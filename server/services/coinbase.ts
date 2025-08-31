import crypto from "crypto";
import { storage } from "../storage";

interface CoinbaseCharge {
  id: string;
  resource: string;
  code: string;
  name: string;
  description: string;
  hosted_url: string;
  created_at: string;
  expires_at: string;
  timeline: Array<{
    time: string;
    status: string;
  }>;
  metadata: Record<string, any>;
  pricing: {
    local: {
      amount: string;
      currency: string;
    };
    settlement: {
      amount: string;
      currency: string;
    };
  };
  payments: Array<any>;
  addresses: Record<string, string>;
}

interface CreateChargeRequest {
  name: string;
  description: string;
  amount: string;
  currency: string;
  metadata?: Record<string, any>;
}

class CoinbaseService {
  private apiKey: string;
  private webhookSecret: string;
  private baseUrl = "https://api.commerce.coinbase.com";

  constructor() {
    this.apiKey = process.env.COINBASE_COMMERCE_API_KEY || "";
    this.webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET || "";
    
    if (!this.apiKey) {
      throw new Error("COINBASE_COMMERCE_API_KEY environment variable is required");
    }
    if (!this.webhookSecret) {
      throw new Error("COINBASE_COMMERCE_WEBHOOK_SECRET environment variable is required");
    }
  }

  async createCharge(chargeData: CreateChargeRequest): Promise<CoinbaseCharge> {
    try {
      const response = await fetch(`${this.baseUrl}/charges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CC-Api-Key": this.apiKey,
          "X-CC-Version": "2018-03-22"
        },
        body: JSON.stringify({
          name: chargeData.name,
          description: chargeData.description,
          local_price: {
            amount: chargeData.amount,
            currency: chargeData.currency
          },
          pricing_type: "fixed_price",
          metadata: chargeData.metadata || {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Coinbase API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.data as CoinbaseCharge;
    } catch (error) {
      console.error("Error creating Coinbase charge:", error);
      throw new Error(
        error instanceof Error 
          ? `Failed to create charge: ${error.message}`
          : "Failed to create Coinbase charge"
      );
    }
  }

  verifyWebhook(payload: any, headers: Record<string, any>): boolean {
    try {
      const signature = headers["x-cc-webhook-signature"];
      if (!signature) {
        console.error("No webhook signature found");
        return false;
      }

      const expectedSignature = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(JSON.stringify(payload))
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex")
      );
    } catch (error) {
      console.error("Error verifying webhook signature:", error);
      return false;
    }
  }

  async handlePaymentConfirmed(chargeData: CoinbaseCharge) {
    try {
      // Update payment status
      await storage.updatePaymentStatus(chargeData.id, "completed");

      // Get payment details
      const payment = await storage.getPaymentByChargeId(chargeData.id);
      if (!payment) {
        throw new Error(`Payment not found for charge ID: ${chargeData.id}`);
      }

      const sponsorshipData = JSON.parse(payment.metadata || "{}");

      if (payment.sponsorshipType === "ico") {
        // Create sponsored ICO
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3); // 3 days sponsorship

        const ico = await storage.createSponsoredIco({
          ...sponsorshipData,
          sponsorshipEndDate: endDate,
          paymentId: payment.id
        });

        // Update payment with sponsorship ID
        await storage.updatePaymentSponsorshipId(payment.id, ico.id);
      } else if (payment.sponsorshipType === "banner") {
        // Create banner ad
        const startDate = new Date();
        const endDate = new Date();
        const duration = sponsorshipData.duration === "3_days" ? 3 : 7;
        endDate.setDate(endDate.getDate() + duration);

        const banner = await storage.createBannerAd({
          ...sponsorshipData,
          startDate,
          endDate,
          paymentId: payment.id
        });

        // Update payment with sponsorship ID
        await storage.updatePaymentSponsorshipId(payment.id, banner.id);
      }

      console.log(`Payment confirmed and sponsorship activated for charge: ${chargeData.id}`);
    } catch (error) {
      console.error("Error handling payment confirmation:", error);
      throw error;
    }
  }

  async handlePaymentFailed(chargeData: CoinbaseCharge) {
    try {
      await storage.updatePaymentStatus(chargeData.id, "failed");
      console.log(`Payment failed for charge: ${chargeData.id}`);
    } catch (error) {
      console.error("Error handling payment failure:", error);
      throw error;
    }
  }
}

export const coinbaseService = new CoinbaseService();
