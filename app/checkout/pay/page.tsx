"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Lock, CreditCard } from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const method = searchParams.get("method") || "bkash";
  const trx = searchParams.get("trx") || "TXN-DEMO-99";
  const amount = searchParams.get("amount") || "0";
  const orderId = searchParams.get("orderId") || "BK-0000";

  const [step, setStep] = useState<"input" | "otp" | "pin" | "success">("input");
  const [phone, setPhone] = useState("01711000000");
  const [otp, setOtp] = useState("123456");
  const [pin, setPin] = useState("12345");
  const [isProcessing, setIsProcessing] = useState(false);

  const getMethodTitle = () => {
    if (method === "bkash") return "bKash Merchant Payment Gateway";
    if (method === "nagad") return "Nagad Merchant Direct Pay";
    return "SSLCommerz Secured Payment (Card/Mobile Banking)";
  };

  const getMethodColor = () => {
    if (method === "bkash") return "bg-[#D12053] border-[#E2136E]";
    if (method === "nagad") return "bg-[#F7931E] border-[#F7931E]";
    return "bg-[#1B2A4A] border-[#0A66C2]";
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (step === "input") setStep("otp");
      else if (step === "otp") setStep("pin");
      else if (step === "pin") {
        setStep("success");
      }
    }, 1000);
  };

  const handleCompleteAndReturn = () => {
    // Send success signal back to parent app
    if (window.opener) {
      window.opener.postMessage({ type: "PAYMENT_SUCCESS", trx, orderId }, "*");
      window.close();
    } else {
      router.push(`/?payment=success&trx=${trx}&orderId=${orderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#140F0A] text-[#FAF6EE] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-[#1C1610] border border-[#E8AB48]/40 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-[#FAF6EE]/15 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E8AB48] shadow-[0_0_10px_#E8AB48]" />
            <h1 className="text-lg font-serif font-bold text-[#FAF6EE]">La Miette Brownie Checkout</h1>
          </div>
          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-[#E8AB48] px-2.5 py-1 rounded-full border border-amber-500/30 font-bold">
            Sandbox Mode
          </span>
        </div>

        {/* Amount & Merchant Info */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE]/05 border border-[#FAF6EE]/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-[#FAF6EE]/60 uppercase">Merchant Receipt</p>
            <p className="text-sm font-bold text-[#FAF6EE]">Order #{orderId}</p>
            <p className="text-[11px] font-mono text-[#E8AB48]">Trx ID: {trx}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-[#FAF6EE]/60 uppercase">Total Amount</p>
            <p className="text-2xl font-serif font-bold text-[#E8AB48]">৳{amount}</p>
          </div>
        </div>

        {/* Step 1, 2, 3 Forms */}
        {step !== "success" ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div className={`p-4 rounded-2xl ${getMethodColor()} text-white flex items-center gap-3 shadow-lg`}>
              <CreditCard className="w-6 h-6 shrink-0" />
              <div>
                <h2 className="text-sm font-bold">{getMethodTitle()}</h2>
                <p className="text-[11px] opacity-80">Secured 256-Bit SSL Encrypted Transaction</p>
              </div>
            </div>

            {step === "input" && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-[#E8AB48] uppercase block">
                  {method === "bkash" ? "bKash Account Number" : method === "nagad" ? "Nagad Account Number" : "Card / Account Number"}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE]/10 border border-[#FAF6EE]/20 text-[#FAF6EE] text-sm font-mono focus:outline-none focus:border-[#E8AB48]"
                  placeholder="017XXXXXXXX"
                />
                <p className="text-[11px] text-[#FAF6EE]/50">Enter any test 11-digit number to proceed.</p>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-[#E8AB48] uppercase block">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE]/10 border border-[#FAF6EE]/20 text-[#FAF6EE] text-sm font-mono text-center tracking-[0.5em] focus:outline-none focus:border-[#E8AB48]"
                  placeholder="123456"
                />
                <p className="text-[11px] text-[#FAF6EE]/50 text-center">Test OTP pre-filled. Click proceed.</p>
              </div>
            )}

            {step === "pin" && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-[#E8AB48] uppercase block">
                  Enter {method.toUpperCase()} PIN
                </label>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE]/10 border border-[#FAF6EE]/20 text-[#FAF6EE] text-sm font-mono text-center tracking-[0.5em] focus:outline-none focus:border-[#E8AB48]"
                  placeholder="•••••"
                />
                <p className="text-[11px] text-[#FAF6EE]/50 text-center">Sandbox mode: Enter any 5-digit PIN.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-full bg-[#E8AB48] text-[#140F0A] font-bold text-sm hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Verifying with Bank...</span>
              ) : (
                <span>
                  {step === "input" ? "Proceed To OTP" : step === "otp" ? "Verify OTP Code" : `Confirm Payment (৳${amount})`}
                </span>
              )}
            </button>
          </form>
        ) : (
          /* Step 4: Success Receipt Confirmation */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-[#FAF6EE]">Payment Successful!</h2>
              <p className="text-xs text-emerald-400 font-mono font-bold mt-1">
                Transaction Verified: {trx}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6EE]/05 border border-[#FAF6EE]/15 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#FAF6EE]/60">Payment Gateway:</span>
                <span className="font-bold text-[#E8AB48] uppercase">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FAF6EE]/60">Amount Paid:</span>
                <span className="font-bold text-[#FAF6EE]">৳{amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#FAF6EE]/60">Status:</span>
                <span className="text-emerald-400 font-bold">PAID (CONFIRMED)</span>
              </div>
            </div>

            <button
              onClick={handleCompleteAndReturn}
              className="w-full py-3.5 rounded-full bg-[#E8AB48] text-[#140F0A] font-bold text-sm hover:bg-white transition-all shadow-xl"
            >
              Return To La Miette Brownie
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#FAF6EE]/40 pt-2 border-t border-[#FAF6EE]/10">
          <Lock className="w-3 h-3 text-[#E8AB48]" />
          <span>Protected by La Miette Brownie Encrypted Gateway Engine</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#140F0A] text-white flex items-center justify-center">Loading Sandbox Gateway...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
