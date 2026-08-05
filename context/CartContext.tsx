"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Product, parsePrice } from "@/lib/constants";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  pickupTime: string;
  notes?: string;
  paymentMethod?: "bkash" | "sslcommerz" | "nagad" | "cash_on_pickup";
  paymentStatus?: string;
  transactionId?: string;
}

export type OrderStatus = "Reserved" | "In Oven" | "Ready For Pickup" | "Completed";

export interface BakeryOrder {
  orderId: string;
  createdAt: string;
  createdAtISO: string;
  items: CartItem[];
  subtotal: string;
  customer: CustomerDetails;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
}

/** Map of product id → boolean (true = in stock, false = sold out) */
export type ProductStockMap = Record<string, boolean>;

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalCartCount: number;
  calculateSubtotal: () => string;
  orders: BakeryOrder[];
  placeOrder: (customer: CustomerDetails) => BakeryOrder;
  // Admin capabilities
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  productStock: ProductStockMap;
  toggleProductStock: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mika_cart_v1";
const ORDERS_STORAGE_KEY = "mika_orders_v1";
const STOCK_STORAGE_KEY = "mika_stock_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<BakeryOrder[]>([]);
  const [productStock, setProductStock] = useState<ProductStockMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart, orders, and stock from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      const savedStock = localStorage.getItem(STOCK_STORAGE_KEY);
      if (savedStock) {
        setProductStock(JSON.parse(savedStock));
      }
    } catch (e) {
      console.error("Failed to load cart state from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever cartItems updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems, isLoaded]);

  // Save orders to localStorage whenever orders updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to localStorage", e);
    }
  }, [orders, isLoaded]);

  // Save stock to localStorage whenever productStock updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(productStock));
    } catch (e) {
      console.error("Failed to save stock to localStorage", e);
    }
  }, [productStock, isLoaded]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const calculateSubtotal = () => {
    const total = cartItems.reduce((sum, item) => {
      const numPrice = parsePrice(item.product.price);
      return sum + numPrice * item.quantity;
    }, 0);
    return total.toFixed(2);
  };

  const placeOrder = (customer: CustomerDetails): BakeryOrder => {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const newOrder: BakeryOrder = {
      orderId: `MK-${randomId}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtISO: new Date().toISOString(),
      items: [...cartItems],
      subtotal: calculateSubtotal(),
      customer,
      status: "Reserved",
      paymentMethod: customer.paymentMethod || "cash_on_pickup",
      paymentStatus: customer.paymentStatus || (customer.paymentMethod === "cash_on_pickup" ? "Pending (Cash at Pickup)" : "Paid"),
      transactionId: customer.transactionId || `TXN-LOCAL-${randomId}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // --- Admin Methods ---

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  }, []);

  const toggleProductStock = useCallback((productId: string) => {
    setProductStock((prev) => ({
      ...prev,
      [productId]: prev[productId] === undefined ? false : !prev[productId],
    }));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        clearCart,
        totalCartCount,
        calculateSubtotal,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        productStock,
        toggleProductStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
