interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: {
      id: string | null;
      name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }>;
}

interface NewsQuery {
  category?: string;
  page?: number;
  pageSize?: number;
}

class NewsApiService {
  private apiKey: string;
  private baseUrl = "https://newsapi.org/v2";

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("NEWS_API_KEY environment variable is required");
    }
  }

  async getNews(query: NewsQuery = {}) {
    const { category, page = 1, pageSize = 20 } = query;
    
    // Build search query for cryptocurrency news
    let searchQuery = "cryptocurrency OR bitcoin OR ethereum OR blockchain OR crypto OR ICO OR DeFi OR NFT";
    
    if (category && category !== "all") {
      searchQuery += ` AND ${category}`;
    }

    const params = new URLSearchParams({
      q: searchQuery,
      language: "en",
      sortBy: "publishedAt",
      page: page.toString(),
      pageSize: pageSize.toString(),
      apiKey: this.apiKey
    });

    try {
      const response = await fetch(`${this.baseUrl}/everything?${params}`);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} ${response.statusText}`);
      }

      const data: NewsApiResponse = await response.json();
      
      if (data.status !== "ok") {
        throw new Error(`News API returned error status: ${data.status}`);
      }

      // Transform the data to our format
      const articles = data.articles.map(article => ({
        title: article.title,
        description: article.description || "",
        content: article.content || "",
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: new Date(article.publishedAt),
        source: article.source.name,
        author: article.author,
        category: this.categorizeArticle(article.title + " " + (article.description || ""))
      }));

      return {
        articles,
        totalResults: data.totalResults,
        page,
        pageSize,
        totalPages: Math.ceil(data.totalResults / pageSize)
      };
    } catch (error) {
      console.error("Error fetching news from News API:", error);
      throw new Error(
        error instanceof Error 
          ? `Failed to fetch news: ${error.message}`
          : "Failed to fetch news from News API"
      );
    }
  }

  private categorizeArticle(text: string): string {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes("bitcoin") || lowercaseText.includes("btc")) {
      return "Bitcoin";
    } else if (lowercaseText.includes("ethereum") || lowercaseText.includes("eth")) {
      return "Ethereum";
    } else if (lowercaseText.includes("defi") || lowercaseText.includes("decentralized finance")) {
      return "DeFi";
    } else if (lowercaseText.includes("nft") || lowercaseText.includes("non-fungible")) {
      return "NFTs";
    } else if (lowercaseText.includes("regulation") || lowercaseText.includes("law") || lowercaseText.includes("sec")) {
      return "Regulation";
    } else if (lowercaseText.includes("ico") || lowercaseText.includes("initial coin offering")) {
      return "ICO";
    } else {
      return "General";
    }
  }
}

export const newsApiService = new NewsApiService();
