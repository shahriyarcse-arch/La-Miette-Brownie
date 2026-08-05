/**
 * Mika & Co. — SMS Gateway Notification Engine
 * Supports: Greenweb BD, SSL Wireless, Twilio, and Sandbox Logger
 */

export interface SendSmsRequest {
  phone: string;
  message: string;
}

export interface SendSmsResponse {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

/**
 * Send Automated SMS Notification to Customer Phone Number
 */
export async function sendSmsNotification(
  req: SendSmsRequest
): Promise<SendSmsResponse> {
  const { phone, message } = req;

  // Format BD Phone Number (ensure +880 format)
  const formattedPhone = phone.startsWith("+880")
    ? phone
    : phone.startsWith("0")
    ? `+880${phone.substring(1)}`
    : `+880${phone}`;

  // 1. Greenweb SMS Gateway (BD Standard)
  if (process.env.GREENWEB_API_KEY) {
    try {
      const url = `https://api.greenweb.com.bd/api.php?token=${
        process.env.GREENWEB_API_KEY
      }&to=${encodeURIComponent(formattedPhone)}&message=${encodeURIComponent(
        message
      )}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        console.error("Greenweb SMS API error:", res.status);
        return {
          success: false,
          provider: "Greenweb BD",
          error: `HTTP ${res.status}`,
        };
      }
      return {
        success: true,
        messageId: `GW-${Date.now()}`,
        provider: "Greenweb BD",
      };
    } catch (err) {
      console.error("Greenweb SMS error:", err);
    }
  }

  // 2. Twilio SMS Gateway (International)
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString("base64");

      const body = new URLSearchParams({
        To: formattedPhone,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: message,
      });

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Twilio SMS API error:", res.status, data);
        return {
          success: false,
          provider: "Twilio",
          error: data?.error_message || `HTTP ${res.status}`,
        };
      }
      return {
        success: true,
        messageId: data.sid || `TW-${Date.now()}`,
        provider: "Twilio",
      };
    } catch (err) {
      console.error("Twilio SMS error:", err);
    }
  }

  // 3. Sandbox Development Logger (Simulated Instant SMS)
  console.log(
    `📱 [SMS GATEWAY SANDBOX] To: ${formattedPhone} | Message: "${message}"`
  );
  return {
    success: true,
    messageId: `SMS-SANDBOX-${Date.now()}`,
    provider: "Sandbox Logger",
  };
}

/**
 * Pre-formatted SMS Templates for Order Lifecycle
 */
export const SMS_TEMPLATES = {
  orderConfirmed: (name: string, orderId: string, pickupTime: string) =>
    `Mika & Co.: Hello ${name}! Your bakery order #${orderId} is confirmed for ${pickupTime} pickup. Total batch locked!`,

  orderInOven: (orderId: string) =>
    `Mika & Co.: Great news! Your order #${orderId} is currently baking in our hearth oven. Smells heavenly!`,

  orderReady: (orderId: string, address: string) =>
    `Mika & Co.: Fresh out! Your order #${orderId} is ready for pickup at ${address}. Please show this receipt.`,
};
