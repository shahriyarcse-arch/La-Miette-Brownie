import { NextRequest, NextResponse } from "next/server";
import { initiatePayment, PaymentInitiateRequest } from "@/lib/payment";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (Anti-Spam Guard: Max 10 requests per minute per IP)
    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const clientIp = (
      forwardedFor.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "client_ip_local"
    );
    const rateLimit = await checkRateLimit(clientIp, 10, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many checkout attempts. Please wait 1 minute." },
        { status: 429 }
      );
    }

    const body: PaymentInitiateRequest = await req.json();

    if (
      !body.orderId ||
      !Number.isFinite(body.amount) ||
      body.amount <= 0 ||
      !body.customerName ||
      !body.customerPhone
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required order details." },
        { status: 400 }
      );
    }

    const response = await initiatePayment(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { success: false, message: "Server error initiating payment." },
      { status: 500 }
    );
  }
}
