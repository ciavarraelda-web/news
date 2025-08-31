// Re-export types from shared schema for frontend use
export type {
  NewsArticle,
  SponsoredIco,
  BannerAd,
  Payment,
  User,
  InsertNewsArticle,
  InsertSponsoredIco,
  InsertUser
  InsertPayment,
  InsertUser,
} from "../../../shared/schema";

// Import types first
import type { NewsArticle, SponsoredIco, BannerAd } from "../../../shared/schema";

// Additional frontend-specific types
export interface NewsApiResponse {
  articles: NewsArticle[];
  totalResults: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaymentResponse {
  paymentId: string;
  chargeId: string;
  hostedUrl: string;
  amount: string;
  currency: string;
}

export interface AdminSponsoredContent {
  icos: SponsoredIco[];
  banners: BannerAd[];
}
