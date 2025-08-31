import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSponsoredIcoSchema, insertBannerAdSchema } from "@shared/schema";
import { z } from "zod";
import { newsApiService } from "./services/newsApi";
import { coinbaseService } from "./services/coinbase";
import { cryptoApiService } from "./services/cryptoApi";

export async function registerRoutes(app: Express): Promise<Server> {
  // News API routes
  app.get("/api/news", async (req, res) => {
    try {
      const { category, page = 1, pageSize = 20 } = req.query;
      const articles = await newsApiService.getNews({
        category: category as string,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
      });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ 
        message: "Failed to fetch news", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get sponsored ICOs
  app.get("/api/sponsored-icos", async (req, res) => {
    try {
      const icos = await storage.getActiveSponsoredIcos();
      res.json(icos);
    } catch (error) {
      console.error("Error fetching sponsored ICOs:", error);
      res.status(500).json({ 
        message: "Failed to fetch sponsored ICOs",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get active banner ads
  app.get("/api/banner-ads", async (req, res) => {
    try {
      const banners = await storage.getActiveBannerAds();
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banner ads:", error);
      res.status(500).json({ 
        message: "Failed to fetch banner ads",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get crypto prices
  app.get("/api/crypto-prices", async (req, res) => {
    try {
      const { ids } = req.query;
      const cryptoIds = ids ? (ids as string).split(',') : ['bitcoin', 'ethereum', 'solana'];
      const prices = await cryptoApiService.getCryptoPrices(cryptoIds);
      res.json(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      res.status(500).json({ 
        message: "Failed to fetch crypto prices",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create ICO sponsorship payment
  app.post("/api/sponsorship/ico", async (req, res) => {
    try {
      const validatedData = insertSponsoredIcoSchema.parse(req.body);
      
      // Create Coinbase charge for ICO sponsorship (100 USDC)
      const charge = await coinbaseService.createCharge({
        name: `ICO Sponsorship: ${validatedData.name}`,
        description: "3-day ICO sponsorship placement",
        amount: "100.00",
        currency: "USDC",
        metadata: {
          type: "ico",
          sponsorshipData: JSON.stringify(validatedData)
        }
      });

      // Store payment record
      const payment = await storage.createPayment({
        coinbaseChargeId: charge.id,
        sponsorshipType: "ico",
        amount: "100.00",
        currency: "USDC",
        status: "pending",
        metadata: JSON.stringify(validatedData)
      });

      res.json({ 
        paymentId: payment.id,
        chargeId: charge.id,
        hostedUrl: charge.hosted_url,
        amount: charge.pricing.local.amount,
        currency: charge.pricing.local.currency
      });
    } catch (error) {
      console.error("Error creating ICO sponsorship:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ 
          message: "Failed to create ICO sponsorship",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  // Create banner ad payment
  app.post("/api/sponsorship/banner", async (req, res) => {
    try {
      const schema = insertBannerAdSchema.extend({
        duration: z.enum(["3_days", "1_week"])
      });
      const validatedData = schema.parse(req.body);
      
      // Determine amount based on duration
      const amount = validatedData.duration === "3_days" ? "100.00" : "150.00";
      const durationText = validatedData.duration === "3_days" ? "3 days" : "1 week";
      
      // Create Coinbase charge
      const charge = await coinbaseService.createCharge({
        name: `Banner Ad: ${validatedData.title}`,
        description: `${durationText} banner advertisement`,
        amount,
        currency: "USDC",
        metadata: {
          type: "banner",
          sponsorshipData: JSON.stringify(validatedData)
        }
      });

      // Store payment record
      const payment = await storage.createPayment({
        coinbaseChargeId: charge.id,
        sponsorshipType: "banner",
        amount,
        currency: "USDC",
        status: "pending",
        metadata: JSON.stringify(validatedData)
      });

      res.json({ 
        paymentId: payment.id,
        chargeId: charge.id,
        hostedUrl: charge.hosted_url,
        amount: charge.pricing.local.amount,
        currency: charge.pricing.local.currency
      });
    } catch (error) {
      console.error("Error creating banner sponsorship:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ 
          message: "Failed to create banner sponsorship",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  // Coinbase webhook endpoint
  app.post("/api/webhooks/coinbase", async (req, res) => {
    try {
      const isValid = coinbaseService.verifyWebhook(req.body, req.headers);
      
      if (!isValid) {
        return res.status(400).json({ message: "Invalid webhook signature" });
      }

      const { event } = req.body;
      
      if (event.type === "charge:confirmed") {
        await coinbaseService.handlePaymentConfirmed(event.data);
      } else if (event.type === "charge:failed") {
        await coinbaseService.handlePaymentFailed(event.data);
      }

      res.json({ message: "Webhook processed successfully" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ 
        message: "Failed to process webhook",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin routes
  app.get("/api/admin/payments", async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ 
        message: "Failed to fetch payments",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/admin/sponsored-content", async (req, res) => {
    try {
      const [icos, banners] = await Promise.all([
        storage.getAllSponsoredIcos(),
        storage.getAllBannerAds()
      ]);
      res.json({ icos, banners });
    } catch (error) {
      console.error("Error fetching sponsored content:", error);
      res.status(500).json({ 
        message: "Failed to fetch sponsored content",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
