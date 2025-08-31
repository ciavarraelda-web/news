import { 
  users, newsArticles, sponsoredIcos, bannerAds, payments,
  type User, type InsertUser, type NewsArticle, type InsertNewsArticle,
  type SponsoredIco, type InsertSponsoredIco, type BannerAd, type InsertBannerAd,
  type Payment, type InsertPayment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte } from "drizzle-orm";

interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // News methods
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getNewsArticles(page?: number, limit?: number): Promise<NewsArticle[]>;
  
  // Sponsored ICO methods
  createSponsoredIco(ico: any): Promise<SponsoredIco>;
  getActiveSponsoredIcos(): Promise<SponsoredIco[]>;
  getAllSponsoredIcos(): Promise<SponsoredIco[]>;
  
  // Banner Ad methods
  createBannerAd(banner: any): Promise<BannerAd>;
  getActiveBannerAds(): Promise<BannerAd[]>;
  getAllBannerAds(): Promise<BannerAd[]>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByChargeId(chargeId: string): Promise<Payment | undefined>;
  updatePaymentStatus(chargeId: string, status: string): Promise<void>;
  updatePaymentSponsorshipId(paymentId: string, sponsorshipId: string): Promise<void>;
  getAllPayments(): Promise<Payment[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // News Article methods
  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [newsArticle] = await db
      .insert(newsArticles)
      .values(article)
      .returning();
    return newsArticle;
  }

  async getNewsArticles(page = 1, limit = 20): Promise<NewsArticle[]> {
    const offset = (page - 1) * limit;
    return await db
      .select()
      .from(newsArticles)
      .limit(limit)
      .offset(offset);
  }

  // Sponsored ICO methods
  async createSponsoredIco(ico: any): Promise<SponsoredIco> {
    const [sponsoredIco] = await db
      .insert(sponsoredIcos)
      .values(ico)
      .returning();
    return sponsoredIco;
  }

  async getActiveSponsoredIcos(): Promise<SponsoredIco[]> {
    const now = new Date();
    return await db
      .select()
      .from(sponsoredIcos)
      .where(and(
        eq(sponsoredIcos.isActive, true),
        gte(sponsoredIcos.sponsorshipEndDate, now)
      ));
  }

  async getAllSponsoredIcos(): Promise<SponsoredIco[]> {
    return await db.select().from(sponsoredIcos);
  }

  // Banner Ad methods
  async createBannerAd(banner: any): Promise<BannerAd> {
    const [bannerAd] = await db
      .insert(bannerAds)
      .values(banner)
      .returning();
    return bannerAd;
  }

  async getActiveBannerAds(): Promise<BannerAd[]> {
    const now = new Date();
    return await db
      .select()
      .from(bannerAds)
      .where(and(
        eq(bannerAds.isActive, true),
        gte(bannerAds.endDate, now)
      ));
  }

  async getAllBannerAds(): Promise<BannerAd[]> {
    return await db.select().from(bannerAds);
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return newPayment;
  }

  async getPaymentByChargeId(chargeId: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.coinbaseChargeId, chargeId));
    return payment || undefined;
  }

  async updatePaymentStatus(chargeId: string, status: string): Promise<void> {
    await db
      .update(payments)
      .set({ 
        status: status as any,
        updatedAt: new Date()
      })
      .where(eq(payments.coinbaseChargeId, chargeId));
  }

  async updatePaymentSponsorshipId(paymentId: string, sponsorshipId: string): Promise<void> {
    await db
      .update(payments)
      .set({ 
        sponsorshipId,
        updatedAt: new Date()
      })
      .where(eq(payments.id, paymentId));
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }
}

export const storage = new DatabaseStorage();
