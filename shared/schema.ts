import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "expired"]);
export const sponsorshipTypeEnum = pgEnum("sponsorship_type", ["ico", "banner"]);
export const bannerDurationEnum = pgEnum("banner_duration", ["3_days", "1_week"]);

export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  source: text("source").notNull(),
  author: text("author"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sponsoredIcos = pgTable("sponsored_icos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  whitepaperUrl: text("whitepaper_url"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  raisedAmount: decimal("raised_amount", { precision: 10, scale: 2 }).default("0"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  sponsorshipEndDate: timestamp("sponsorship_end_date").notNull(),
  paymentId: varchar("payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bannerAds = pgTable("banner_ads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  targetUrl: text("target_url").notNull(),
  duration: bannerDurationEnum("duration").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  paymentId: varchar("payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coinbaseChargeId: text("coinbase_charge_id").notNull().unique(),
  sponsorshipType: sponsorshipTypeEnum("sponsorship_type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  sponsorshipId: varchar("sponsorship_id"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const sponsoredIcosRelations = relations(sponsoredIcos, ({ one }) => ({
  payment: one(payments, {
    fields: [sponsoredIcos.paymentId],
    references: [payments.id],
  }),
}));

export const bannerAdsRelations = relations(bannerAds, ({ one }) => ({
  payment: one(payments, {
    fields: [bannerAds.paymentId],
    references: [payments.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  sponsoredIco: one(sponsoredIcos, {
    fields: [payments.sponsorshipId],
    references: [sponsoredIcos.id],
  }),
  bannerAd: one(bannerAds, {
    fields: [payments.sponsorshipId],
    references: [bannerAds.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertSponsoredIcoSchema = createInsertSchema(sponsoredIcos).omit({
  id: true,
  createdAt: true,
  paymentId: true,
  sponsorshipEndDate: true,
});

export const insertBannerAdSchema = createInsertSchema(bannerAds).omit({
  id: true,
  createdAt: true,
  paymentId: true,
  startDate: true,
  endDate: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type SponsoredIco = typeof sponsoredIcos.$inferSelect;
export type InsertSponsoredIco = z.infer<typeof insertSponsoredIcoSchema>;

export type BannerAd = typeof bannerAds.$inferSelect;
export type InsertBannerAd = z.infer<typeof insertBannerAdSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
