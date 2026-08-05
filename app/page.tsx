"use client";

import { createDatabaseOrder } from "@/lib/db-actions";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, ArrowRight, Check, User, Phone, Mail, Clock, CreditCard, DollarSign } from "lucide-react";
import { Product } from "@/lib/constants";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SignatureCollection } from "@/components/sections/SignatureCollection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { ArtisanProcess } from "@/components/sections/ArtisanProcess";
import { Philosophy } from "@/components/sections/Philosophy";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FreshBake } from "@/components/sections/FreshBake";
import { ChefRecommendation } from "@/components/sections/ChefRecommendation";
import { SeasonalCollection } from "@/components/sections/SeasonalCollection";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { Newsletter } from "@/components/sections/Newsletter";
import { VisitBakery } from "@/components/sections/VisitBakery";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCart, BakeryOrder, CustomerDetails } from "@/context/CartContext";

export default function Home() {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    totalCartCount,
    calculateSubtotal,
    placeOrder,
  } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [activeOrder, setActiveOrder] = useState<BakeryOrder | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "sslcommerz" | "nagad" | "cash_on_pickup">("bkash");
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const pendingOrderIdRef = useRef<string | null>(null);

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    pickupTime: "08:30 AM",
    notes: "",
  });

  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  // Force scroll to top on reload for premium hero entrance experience
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  // Accessible Escape Key Handler (WCAG 2.2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
        setIsCartOpen(false);
        setIsCheckoutStep(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for Sandbox Payment Gateway completion signal
  useEffect(() => {
    const handlePaymentMessage = async (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== "PAYMENT_SUCCESS"
      ) {
        return;
      }
      const { trx, orderId } = event.data;
      if (!orderId || orderId !== pendingOrderIdRef.current) return;
      pendingOrderIdRef.current = null;

      const updatedCustomer: CustomerDetails = {
        ...customer,
        paymentMethod,
        paymentStatus: "Paid",
        transactionId: trx,
      };
      const newOrder = placeOrder(updatedCustomer, orderId);
      setActiveOrder(newOrder);
      setIsCheckoutStep(false);
      setIsInitiatingPayment(false);

      // Persist to PostgreSQL Database
      await createDatabaseOrder({
        orderId: newOrder.orderId,
        subtotal: newOrder.subtotal,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        pickupTime: customer.pickupTime,
        notes: customer.notes,
        paymentMethod,
        paymentStatus: "Paid",
        transactionId: trx,
        items: cartItems.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
      });
    };
    window.addEventListener("message", handlePaymentMessage);
    return () => window.removeEventListener("message", handlePaymentMessage);
  }, [customer, paymentMethod, placeOrder, cartItems]);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || cartItems.length === 0) return;

    setCheckoutError(null);
    setIsInitiatingPayment(true);

    const orderId = `MK-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const res = await fetch("/api/checkout/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: parseFloat(calculateSubtotal()),
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          paymentMethod,
          itemsCount: totalCartCount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setCheckoutError(data.message || "Payment initiation failed. Please try again.");
        setIsInitiatingPayment(false);
        return;
      }

      if (data.requiresRedirect && data.gatewayUrl) {
        // Open Sandbox Payment Gateway Popup window
        const width = 480;
        const height = 650;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        pendingOrderIdRef.current = orderId;
        const popup = window.open(
          data.gatewayUrl,
          "MikaPaymentGateway",
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // If the popup is closed without completing payment, release the pending state
        if (popup) {
          const poll = window.setInterval(() => {
            if (popup.closed) {
              window.clearInterval(poll);
              pendingOrderIdRef.current = null;
              setIsInitiatingPayment(false);
            }
          }, 500);
        }
      } else {
        // Cash on Pickup or direct confirmation
        const updatedCustomer: CustomerDetails = {
          ...customer,
          paymentMethod,
          paymentStatus: paymentMethod === "cash_on_pickup" ? "Pending (Cash at Pickup)" : "Paid",
          transactionId: data.transactionId,
        };
        const newOrder = placeOrder(updatedCustomer, orderId);
        setActiveOrder(newOrder);
        setIsCheckoutStep(false);
        setIsInitiatingPayment(false);

        // Persist to PostgreSQL Database
        await createDatabaseOrder({
          orderId: newOrder.orderId,
          subtotal: newOrder.subtotal,
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          pickupTime: customer.pickupTime,
          notes: customer.notes,
          paymentMethod,
          paymentStatus: paymentMethod === "cash_on_pickup" ? "Pending (Cash at Pickup)" : "Paid",
          transactionId: data.transactionId,
          items: cartItems.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
        });
      }
    } catch (err) {
      console.error("Payment initiation error", err);
      setIsInitiatingPayment(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F1E5] text-[#221B12] selection:bg-[#D9A441] selection:text-[#221B12] relative">
      {/* Subtle Grain Overlay */}
      <div className="grain" />

      {/* Preloader */}
      <Preloader onComplete={() => setIsPreloaderDone(true)} />

      {/* Floating Header Navbar */}
      <Navbar cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 1. Hero Section */}
      <Hero isPreloaderDone={isPreloaderDone} />

      {/* 2. Signature Collection */}
      <SignatureCollection
        onSelectProduct={setSelectedProduct}
        onAddToCart={addToCart}
      />

      {/* 3. Featured Products */}
      <FeaturedProducts
        onSelectProduct={setSelectedProduct}
        onAddToCart={addToCart}
      />

      {/* 4. Artisan Process */}
      <ArtisanProcess />

      {/* 5. Philosophy */}
      <Philosophy />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Fresh Bake Schedule */}
      <FreshBake />

      {/* 8. Chef Recommendation Spotlight */}
      <ChefRecommendation />

      {/* 9. Seasonal Collection */}
      <SeasonalCollection />

      {/* 10. Testimonials */}
      <Testimonials />

      {/* 11. FAQ */}
      <FAQ />

      {/* 12. Instagram Gallery */}
      <InstagramGallery />

      {/* 13. Newsletter */}
      <Newsletter />

      {/* 14. Visit Bakery */}
      <VisitBakery />

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
            className="fixed inset-0 z-[10000] bg-[#221B12]/75 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full rounded-3xl bg-[#F7F1E5] text-[#221B12] border border-[#221B12]/20 overflow-hidden shadow-2xl p-6 md:p-8"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-[#221B12] text-[#F7F1E5] hover:bg-[#B06A2C] transition-colors z-10"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative h-64 md:h-full w-full rounded-2xl overflow-hidden bg-[#221B12]/5 border border-[#221B12]/10">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#B06A2C] font-semibold uppercase tracking-widest block mb-1">
                      {selectedProduct.category}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#221B12]">
                      {selectedProduct.name}
                    </h3>
                    <span className="text-xl font-serif font-bold text-[#B06A2C] block mt-2">
                      {selectedProduct.price}
                    </span>

                    <p className="text-[#4A3F2E] text-xs mt-3 leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#221B12]/15 space-y-2 text-xs text-[#4A3F2E] font-mono">
                      <p><strong className="text-[#B06A2C]">Rest Period:</strong> {selectedProduct.prepTime}</p>
                      <p><strong className="text-[#B06A2C]">Pairing:</strong> {selectedProduct.pairing}</p>
                      <p><strong className="text-[#B06A2C]">Calories:</strong> {selectedProduct.calories}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <MagneticButton
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                        setIsCartOpen(true);
                      }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Reservation Basket</span>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart & Checkout Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Reservation Basket"
            className="fixed inset-0 z-[10000] bg-[#221B12]/75 backdrop-blur-md flex justify-end"
            onClick={() => { setIsCartOpen(false); setIsCheckoutStep(false); setActiveOrder(null); }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#221B12] text-[#F7F1E5] border-l border-[#F7F1E5]/15 h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-[#F7F1E5]/15">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D9A441]" />
                    <h3 className="text-xl font-serif font-bold text-[#F7F1E5]">
                      {activeOrder
                        ? "Reservation Receipt"
                        : isCheckoutStep
                        ? "Customer Reservation"
                        : `Reservation Basket (${totalCartCount})`}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutStep(false);
                      setActiveOrder(null);
                    }}
                    className="p-2 rounded-full text-[#F7F1E5]/60 hover:text-[#D9A441]"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 1. Order Confirmation Receipt */}
                {activeOrder ? (
                  <div className="py-8 space-y-6">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                        <Check className="w-8 h-8" />
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-[#F7F1E5]">
                        Reservation Confirmed!
                      </h4>
                      <p className="text-[#D9A441] font-mono text-sm font-bold">
                        Receipt ID: {activeOrder.orderId}
                      </p>
                      <p className="text-[#F7F1E5]/70 text-xs">
                        Your fresh bakery batch is locked in for morning hearth pickup.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F1E5]/05 border border-[#F7F1E5]/15 space-y-3 text-xs font-mono">
                      <div className="flex justify-between text-[#F7F1E5]">
                        <span>Customer Name:</span>
                        <span className="font-bold text-[#D9A441]">{activeOrder.customer.name}</span>
                      </div>
                      <div className="flex justify-between text-[#F7F1E5]">
                        <span>Phone Contact:</span>
                        <span className="text-[#F7F1E5]">{activeOrder.customer.phone}</span>
                      </div>
                      <div className="flex justify-between text-[#F7F1E5]">
                        <span>Est. Pickup:</span>
                        <span className="text-[#D9A441]">{activeOrder.customer.pickupTime}</span>
                      </div>
                      <div className="flex justify-between text-[#F7F1E5] border-t border-[#F7F1E5]/10 pt-2">
                        <span>Payment Method:</span>
                        <span className="font-bold text-[#D9A441] uppercase">{activeOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-[#F7F1E5]">
                        <span>Payment Status:</span>
                        <span className="text-emerald-400 font-bold">{activeOrder.paymentStatus}</span>
                      </div>
                      <div className="flex justify-between text-[#F7F1E5]">
                        <span>Trx ID:</span>
                        <span className="text-[#D9A441]">{activeOrder.transactionId}</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-[#F7F1E5]/15 pt-4">
                      <h5 className="text-xs font-mono text-[#D9A441] uppercase tracking-wider">Reserved Items</h5>
                      {activeOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-[#F7F1E5]">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span className="font-mono text-[#D9A441]">{item.product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isCheckoutStep ? (
                  /* 2. Customer Checkout Form */
                  <form onSubmit={handleReservationSubmit} className="py-6 space-y-4">
                    <div>
                      <label className="text-xs font-mono text-[#D9A441] uppercase block mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#F7F1E5]/40 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F1E5]/10 border border-[#F7F1E5]/20 text-[#F7F1E5] placeholder-[#F7F1E5]/40 text-xs focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-[#D9A441] uppercase block mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#F7F1E5]/40 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="+880 1711 000000"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F1E5]/10 border border-[#F7F1E5]/20 text-[#F7F1E5] placeholder-[#F7F1E5]/40 text-xs focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-[#D9A441] uppercase block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#F7F1E5]/40 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          placeholder="eleanor@mika.co"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F1E5]/10 border border-[#F7F1E5]/20 text-[#F7F1E5] placeholder-[#F7F1E5]/40 text-xs focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-[#D9A441] uppercase block mb-1">
                        Preferred Pickup Window
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-[#F7F1E5]/40 absolute left-3.5 top-3.5" />
                        <select
                          value={customer.pickupTime}
                          onChange={(e) => setCustomer({ ...customer, pickupTime: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#221B12] border border-[#F7F1E5]/20 text-[#F7F1E5] text-xs focus:outline-none focus:border-[#D9A441]"
                        >
                          <option value="07:30 AM">07:30 AM (Dawn Batch)</option>
                          <option value="08:30 AM">08:30 AM (Warm Loaves)</option>
                          <option value="11:30 AM">11:30 AM (Noon Oven)</option>
                          <option value="03:30 PM">03:30 PM (Evening Batch)</option>
                        </select>
                      </div>
                    </div>

                    {/* Payment Gateway Selection */}
                    <div className="space-y-2 pt-2 border-t border-[#F7F1E5]/15">
                      <label className="text-xs font-mono text-[#D9A441] uppercase block">
                        Select Payment Method *
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {/* bKash */}
                        <div
                          onClick={() => setPaymentMethod("bkash")}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            paymentMethod === "bkash"
                              ? "bg-[#D12053]/20 border-[#E2136E] text-white"
                              : "bg-[#F7F1E5]/05 border-[#F7F1E5]/15 text-[#F7F1E5]/70 hover:border-[#D9A441]/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs">
                              bK
                            </div>
                            <div>
                              <p className="text-xs font-bold">bKash Direct Gateway</p>
                              <p className="text-[10px] text-[#F7F1E5]/50">Instant merchant checkout</p>
                            </div>
                          </div>
                          {paymentMethod === "bkash" && <Check className="w-4 h-4 text-[#E2136E]" />}
                        </div>

                        {/* SSLCommerz Cards / Nagad */}
                        <div
                          onClick={() => setPaymentMethod("sslcommerz")}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            paymentMethod === "sslcommerz"
                              ? "bg-amber-500/20 border-[#D9A441] text-white"
                              : "bg-[#F7F1E5]/05 border-[#F7F1E5]/15 text-[#F7F1E5]/70 hover:border-[#D9A441]/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#1B2A4A] text-[#D9A441] flex items-center justify-center font-bold text-xs">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold">Cards / Nagad / Banking (SSL)</p>
                              <p className="text-[10px] text-[#F7F1E5]/50">Visa, Mastercard, Nagad, Rocket</p>
                            </div>
                          </div>
                          {paymentMethod === "sslcommerz" && <Check className="w-4 h-4 text-[#D9A441]" />}
                        </div>

                        {/* Cash on Pickup */}
                        <div
                          onClick={() => setPaymentMethod("cash_on_pickup")}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            paymentMethod === "cash_on_pickup"
                              ? "bg-emerald-500/20 border-emerald-500 text-white"
                              : "bg-[#F7F1E5]/05 border-[#F7F1E5]/15 text-[#F7F1E5]/70 hover:border-[#D9A441]/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                              <DollarSign className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold">Pay Cash at Hearth Pickup</p>
                              <p className="text-[10px] text-[#F7F1E5]/50">Pay when picking up fresh batch</p>
                            </div>
                          </div>
                          {paymentMethod === "cash_on_pickup" && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                      </div>
                    </div>

                    {checkoutError && (
                      <div
                        role="alert"
                        className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
                      >
                        {checkoutError}
                      </div>
                    )}

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsCheckoutStep(false)}
                        className="px-4 py-3 rounded-full border border-[#F7F1E5]/30 text-xs font-mono text-[#F7F1E5]"
                      >
                        Back
                      </button>
                      <MagneticButton variant="primary" type="submit" className="w-full" disabled={isInitiatingPayment}>
                        <span>
                          {isInitiatingPayment
                            ? "Connecting Gateway..."
                            : paymentMethod === "cash_on_pickup"
                            ? `Confirm Reservation (৳${calculateSubtotal()})`
                            : `Pay ৳${calculateSubtotal()} via ${paymentMethod.toUpperCase()}`}
                        </span>
                      </MagneticButton>
                    </div>
                  </form>
                ) : cartItems.length === 0 ? (
                  /* 3. Empty Basket */
                  <div className="py-20 text-center text-[#F7F1E5]/50 space-y-2">
                    <ShoppingBag className="w-12 h-12 mx-auto text-[#F7F1E5]/30" />
                    <p>Your basket is currently empty.</p>
                  </div>
                ) : (
                  /* 4. Cart Items List */
                  <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-4 rounded-2xl bg-[#F7F1E5]/05 border border-[#F7F1E5]/15 flex items-center justify-between gap-4"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#F7F1E5]/10">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm font-serif font-bold text-[#F7F1E5]">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-serif font-bold text-[#D9A441]">
                            {item.product.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#F7F1E5]/10 px-2 py-1 rounded-lg border border-[#F7F1E5]/15">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="text-[#F7F1E5]/70 hover:text-[#D9A441] p-1"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-[#D9A441]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="text-[#F7F1E5]/70 hover:text-[#D9A441] p-1"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              {activeOrder ? (
                <div className="pt-6 border-t border-[#F7F1E5]/15">
                  <MagneticButton
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveOrder(null);
                    }}
                  >
                    <span>Done &amp; Close</span>
                  </MagneticButton>
                </div>
              ) : !isCheckoutStep && cartItems.length > 0 && (
                <div className="pt-6 border-t border-[#F7F1E5]/15 space-y-4">
                  <div className="flex items-center justify-between text-[#F7F1E5]">
                    <span className="text-sm font-mono text-[#F7F1E5]/70">Estimated Subtotal</span>
                    <span className="text-2xl font-serif font-bold text-[#D9A441]">
                      ৳{calculateSubtotal()}
                    </span>
                  </div>

                  <MagneticButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => setIsCheckoutStep(true)}
                  >
                    <span>Proceed To Reservation Details</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </MagneticButton>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}