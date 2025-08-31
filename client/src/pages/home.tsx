import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import NewsCard from "@/components/news/news-card";
import IcoCard from "@/components/ico/ico-card";
import SponsorshipCard from "@/components/sponsorship/sponsorship-card";
import PaymentModal from "@/components/payment/payment-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ChartLine, Gamepad2, Leaf } from "lucide-react";
import type { NewsArticle, SponsoredIco, BannerAd, NewsApiResponse } from "@/lib/types";

export default function Home() {
  const [newsCategory, setNewsCategory] = useState("all");
  const [newsPage, setNewsPage] = useState(1);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"ico" | "banner">("ico");

  // Fetch news
  const { data: newsData, isLoading: newsLoading } = useQuery<NewsApiResponse>({
    queryKey: ["/api/news", { category: newsCategory, page: newsPage }],
    enabled: true,
  });

  // Fetch sponsored ICOs
  const { data: sponsoredIcos, isLoading: icosLoading } = useQuery<SponsoredIco[]>({
    queryKey: ["/api/sponsored-icos"],
    enabled: true,
  });

  // Fetch banner ads
  const { data: bannerAds, isLoading: bannersLoading } = useQuery<BannerAd[]>({
    queryKey: ["/api/banner-ads"],
    enabled: true,
  });

  // Fetch crypto prices
  const { data: cryptoPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ["/api/crypto-prices"],
    enabled: true,
    refetchInterval: 60000, // Refresh every minute
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "bitcoin", label: "Bitcoin" },
    { id: "ethereum", label: "Ethereum" },
    { id: "defi", label: "DeFi" },
    { id: "nft", label: "NFTs" },
    { id: "regulation", label: "Regulation" },
  ];

  const handleSponsorshipClick = (type: "ico" | "banner") => {
    setPaymentType(type);
    setPaymentModalOpen(true);
  };

  // Format market data from crypto prices API
  const marketData = cryptoPrices?.prices?.map((crypto: any) => ({
    name: crypto.name,
    symbol: crypto.symbol,
    price: `$${crypto.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    change: `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(1)}%`,
    positive: crypto.price_change_percentage_24h >= 0,
  })) || [
    { name: "Bitcoin", symbol: "BTC", price: "$43,256", change: "+2.4%", positive: true },
    { name: "Ethereum", symbol: "ETH", price: "$2,678", change: "-1.2%", positive: false },
    { name: "Solana", symbol: "SOL", price: "$98.45", change: "+5.7%", positive: true },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6" data-testid="text-latest-news">Latest Crypto News</h2>
              
              {/* Featured News Article */}
              {newsLoading ? (
                <Card className="mb-6">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ) : newsData?.articles?.length > 0 ? (
                <NewsCard 
                  article={newsData.articles[0]} 
                  featured={true} 
                  className="mb-6" 
                />
              ) : (
                <Card className="mb-6">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No news articles available at the moment.</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sponsorship Pricing Card */}
            <div className="lg:col-span-1">
              <SponsorshipCard onSponsorClick={handleSponsorshipClick} />
            </div>
          </div>
        </section>

        {/* Sponsored ICOs Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" data-testid="text-sponsored-icos">Sponsored ICOs</h2>
            <Button variant="link" className="text-primary hover:text-primary/80" data-testid="button-view-all-icos">
              View All →
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {icosLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-2 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : sponsoredIcos?.length > 0 ? (
              sponsoredIcos.map((ico: SponsoredIco) => (
                <IcoCard key={ico.id} ico={ico} sponsored={true} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No sponsored ICOs available. Be the first to sponsor your ICO!</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => handleSponsorshipClick("ico")}
                    data-testid="button-sponsor-first-ico"
                  >
                    Sponsor Your ICO
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Add some mock ICOs for demo */}
            {!icosLoading && (!sponsoredIcos || sponsoredIcos.length < 3) && (
              <>
                <IcoCard 
                  ico={{
                    id: "demo-1",
                    name: "GreenChain Carbon",
                    description: "Blockchain-based carbon credit marketplace for sustainable business practices.",
                    category: "Sustainability",
                    targetAmount: "2000000",
                    raisedAmount: "900000",
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    isActive: true,
                    sponsorshipEndDate: new Date(),
                    paymentId: null,
                    createdAt: new Date(),
                    logoUrl: null,
                    websiteUrl: null,
                    whitepaperUrl: null
                  }} 
                  sponsored={false} 
                />
              </>
            )}
          </div>
        </section>

        {/* News Section */}
        <section className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* News Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={newsCategory === category.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => {
                    setNewsCategory(category.id);
                    setNewsPage(1);
                  }}
                  data-testid={`button-category-${category.id}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* News Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {newsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              ) : newsData?.articles?.slice(1).map((article: NewsArticle, index: number) => (
                <NewsCard key={`${article.url}-${index}`} article={article} />
              )) || (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No news articles found for this category.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Load More Button */}
            {newsData?.articles?.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  variant="secondary" 
                  onClick={() => setNewsPage(prev => prev + 1)}
                  data-testid="button-load-more-news"
                >
                  Load More News
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sponsored Banner Ad */}
            {bannersLoading ? (
              <Card className="sponsored-banner">
                <CardContent className="p-4">
                  <Skeleton className="h-32 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ) : bannerAds?.length > 0 ? (
              <Card className="sponsored-banner" data-testid="card-sponsored-banner">
                <CardContent className="p-4 text-center">
                  <Badge variant="outline" className="mb-2">SPONSORED</Badge>
                  <div className="mt-2">
                    <img 
                      src={bannerAds[0].imageUrl} 
                      alt={bannerAds[0].title}
                      className="w-full h-32 object-cover rounded-md mb-3" 
                    />
                    <h4 className="font-semibold mb-2">{bannerAds[0].title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{bannerAds[0].description}</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(bannerAds[0].targetUrl, "_blank")}
                      data-testid="button-sponsored-banner-cta"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sponsored-banner">
                <CardContent className="p-4 text-center">
                  <Badge variant="outline" className="mb-2">ADVERTISING SPACE</Badge>
                  <div className="mt-2">
                    <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Your Ad Here</p>
                    </div>
                    <h4 className="font-semibold mb-2">Advertise Here</h4>
                    <p className="text-sm text-muted-foreground mb-3">Reach crypto enthusiasts with your banner ad</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSponsorshipClick("banner")}
                      data-testid="button-advertise-here"
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Overview */}
            <Card data-testid="card-market-overview">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Market Overview</h3>
                <div className="space-y-3">
                  {marketData.map((coin) => (
                    <div key={coin.symbol} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-full"></div>
                        <span className="text-sm">{coin.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{coin.price}</div>
                        <div className={`text-xs flex items-center gap-1 ${
                          coin.positive ? "text-accent" : "text-destructive"
                        }`}>
                          {coin.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {coin.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card data-testid="card-newsletter">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">Get the latest crypto news delivered to your inbox</p>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    data-testid="input-newsletter-email"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="w-full"
                    data-testid="button-subscribe-newsletter"
                  >
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
      
      <PaymentModal 
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        type={paymentType}
      />
    </div>
  );
}
