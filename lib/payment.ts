/**
 * La Miette Bakes — Payment Gateway Integration Engine
 * Supports: bKash Direct Checkout, SSLCommerz (Cards/Nagad/Rocket), Cash on Pickup
 */

export type PaymentMethod = "bkash" | "sslcommerz" | "nagad" | "cash_on_pickup";
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export interface PaymentInitiateRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: PaymentMethod;
  itemsCount: number;
}

export interface PaymentInitiateResponse {
  success: boolean;
  gatewayUrl?: string;
  transactionId: string;
  paymentMethod: PaymentMethod;
  message: string;
  requiresRedirect: boolean;
}

/**
  Generate a unique merchant transaction ID
 */
export function generateTransactionId(prefix: string = "TXN"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${randomStr}`;
}

/**
  Initiates payment request to selected gateway
 */
export async function initiatePayment(
  req: PaymentInitiateRequest
): Promise<PaymentInitiateResponse> {
  const transactionId = generateTransactionId(req.paymentMethod.toUpperCase());

  // 1. Cash on Pickup — Immediate success confirmation
  if (req.paymentMethod === "cash_on_pickup") {
    return {
      success: true,
      transactionId,
      paymentMethod: req.paymentMethod,
      message: "Reservation confirmed. Pay cash upon bakery hearth pickup.",
      requiresRedirect: false,
    };
  }

  // 2. bKash Merchant Gateway Integration
  if (req.paymentMethod === "bkash") {
    // In production, this calls https://checkout.sandbox.bKash.com or live API
    return {
      success: true,
      transactionId,
      paymentMethod: "bkash",
      gatewayUrl: `/checkout/pay?method=bkash&trx=${transactionId}&amount=${req.amount}&orderId=${req.orderId}`,
      message: "Redirecting to bKash Direct Checkout...",
      requiresRedirect: true,
    };
  }

  // 3. SSLCommerz Gateway (Supports Visa, Mastercard, Nagad, Rocket)
  if (req.paymentMethod === "sslcommerz" || req.paymentMethod === "nagad") {
    return {
      success: true,
      transactionId,
      paymentMethod: req.paymentMethod,
      gatewayUrl: `/checkout/pay?method=${req.paymentMethod}&trx=${transactionId}&amount=${req.amount}&orderId=${req.orderId}`,
      message: "Redirecting to Payment Gateway...",
      requiresRedirect: true,
    };
  }

  return {
    success: false,
    transactionId,
    paymentMethod: req.paymentMethod,
    message: "Invalid payment method selected.",
    requiresRedirect: false,
  };
}
