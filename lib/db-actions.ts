"use server";

import { prisma } from "@/lib/prisma";
import { ALL_PRODUCTS } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendEmailReceipt } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { invalidateCache } from "@/lib/redis";
import { sendSmsNotification, SMS_TEMPLATES } from "@/lib/sms";

export interface CreateOrderPayload {
  orderId: string;
  subtotal: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupTime: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  items: {
    productId: string;
    productName: string;
    price: string;
    quantity: number;
  }[];
}

/**
 * Sanitize raw strings against XSS & script injection
 */
function sanitizeInput(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Server-side Admin Passcode Verification
 * Prevents secret passcode leakage in client JS bundles.
 * Fails closed: without ADMIN_PASSCODE configured, access is denied.
 */
export async function verifyAdminPasscode(passcode: string): Promise<{ success: boolean }> {
  const secretPasscode = process.env.ADMIN_PASSCODE;
  if (!secretPasscode) {
    console.error("ADMIN_PASSCODE is not configured. Admin access denied.");
    return { success: false };
  }

  // Brute-force guard: max 5 attempts per minute per client
  const forwardedFor = (await headers()).get("x-forwarded-for") || "";
  const clientIp = (
    forwardedFor.split(",")[0]?.trim() ||
    (await headers()).get("x-real-ip") ||
    "admin_login"
  );
  const rateLimit = await checkRateLimit(`admin_login:${clientIp}`, 5, 60);
  if (!rateLimit.allowed) {
    return { success: false };
  }

  if (passcode === secretPasscode) {
    return { success: true };
  }
  return { success: false };
}

/**
 * Seed products into PostgreSQL if database is empty
 */
export async function seedProductsIfEmpty() {
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      console.log("Seeding products into PostgreSQL database...");
      for (const item of ALL_PRODUCTS) {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
        await prisma.product.create({
          data: {
            productId: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            numericPrice,
            description: item.description,
            ingredients: item.ingredients,
            pairing: item.pairing,
            rating: item.rating,
            badge: item.badge,
            image: item.image,
            prepTime: item.prepTime,
            calories: item.calories,
            inStock: true,
          },
        });
      }
      console.log("Products successfully seeded!");
    }
  } catch (error) {
    console.error("Failed to seed products:", error);
  }
}

/**
 * Create a new Order in PostgreSQL inside an atomic transaction
 */
export async function createDatabaseOrder(payload: CreateOrderPayload) {
  try {
    // Ensure the catalog is seeded so order items can link to real products
    await seedProductsIfEmpty();

    const numericTotal = parseFloat(payload.subtotal.replace(/[^0-9.]/g, "")) || 0;

    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          orderId: payload.orderId,
          subtotal: payload.subtotal,
          numericTotal,
          status: "Reserved",
          paymentMethod: payload.paymentMethod,
          paymentStatus: payload.paymentStatus,
          transactionId: payload.transactionId,
          customer: {
            create: {
              name: sanitizeInput(payload.customerName),
              phone: sanitizeInput(payload.customerPhone),
              email: payload.customerEmail ? sanitizeInput(payload.customerEmail) : null,
              pickupTime: sanitizeInput(payload.pickupTime),
              notes: payload.notes ? sanitizeInput(payload.notes) : null,
            },
          },
        },
      });

      // 2. Create Order Items and connect to Product
      for (const item of payload.items) {
        // Find matching product
        const dbProduct = await tx.product.findFirst({
          where: {
            OR: [{ id: item.productId }, { productId: item.productId }],
          },
        });

        if (dbProduct) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: dbProduct.id,
              productName: item.productName,
              price: item.price,
              quantity: item.quantity,
            },
          });
        }
      }

      return order;
    });

    // 3. Trigger Instant Customer SMS & Email Notifications
    if (payload.customerPhone) {
      await sendSmsNotification({
        phone: payload.customerPhone,
        message: SMS_TEMPLATES.orderConfirmed(
          payload.customerName,
          payload.orderId,
          payload.pickupTime
        ),
      });
    }

    if (payload.customerEmail) {
      await sendEmailReceipt({
        to: payload.customerEmail,
        customerName: payload.customerName,
        orderId: payload.orderId,
        subtotal: payload.subtotal,
        pickupTime: payload.pickupTime,
        paymentMethod: payload.paymentMethod,
        transactionId: payload.transactionId,
        items: payload.items,
      });
    }

    revalidatePath("/admin");
    return { success: true, data: newOrder };
  } catch (error) {
    console.error("Failed to create order in PostgreSQL:", error);
    return { success: false, error: "Database transaction failed." };
  }
}

/**
 * Update Order status in PostgreSQL and trigger SMS notification
 */
export async function updateDatabaseOrderStatus(orderId: string, newStatus: string) {
  try {
    const updated = await prisma.order.update({
      where: { orderId },
      data: { status: newStatus },
      include: { customer: true },
    });

    // Send SMS Notification based on new status
    if (updated.customer?.phone) {
      if (newStatus === "In Oven") {
        await sendSmsNotification({
          phone: updated.customer.phone,
          message: SMS_TEMPLATES.orderInOven(orderId),
        });
      } else if (newStatus === "Ready For Pickup") {
        await sendSmsNotification({
          phone: updated.customer.phone,
          message: SMS_TEMPLATES.orderReady(orderId, "House 14, Road 53, Gulshan-2, Dhaka"),
        });
      }
    }

    revalidatePath("/admin");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

/**
 * Toggle product stock status in PostgreSQL
 */
export async function toggleDatabaseProductStock(productId: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: productId }, { productId }] },
    });

    if (!product) return { success: false, error: "Product not found." };

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { inStock: !product.inStock },
    });

    // Invalidate Redis catalog cache
    await invalidateCache("products_catalog");

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to toggle stock:", error);
    return { success: false, error: "Failed to toggle product stock." };
  }
}

/**
 * Subscribe email to newsletter in PostgreSQL
 */
export async function subscribeNewsletter(email: string) {
  try {
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return { success: true, data: subscriber };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Failed to subscribe email." };
  }
}

/**
 * Delete an order and its related records from PostgreSQL
 */
export async function deleteDatabaseOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderId },
      include: { items: true },
    });

    if (!order) {
      return { success: false, error: "Order not found in database." };
    }

    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { orderId: order.id } }),
      prisma.customer.deleteMany({ where: { orderId: order.id } }),
      prisma.order.delete({ where: { id: order.id } }),
    ]);

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order from database." };
  }
}
