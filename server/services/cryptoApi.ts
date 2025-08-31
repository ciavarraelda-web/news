interface CryptoPriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

interface CryptoApiResponse {
  prices: CryptoPriceData[];
}

class CryptoApiService {
  private baseUrl = "https://api.coingecko.com/api/v3";

  async getCryptoPrices(ids: string[] = ["bitcoin", "ethereum", "solana"]): Promise<CryptoApiResponse> {
    try {
      const idsParam = ids.join(",");
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`Crypto API error: ${response.status} ${response.statusText}`);
      }

      const data: CryptoPriceData[] = await response.json();
      
      return {
        prices: data.map(coin => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0,
          market_cap: coin.market_cap,
          total_volume: coin.total_volume,
          image: coin.image
        }))
      };
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      
      // Return mock data as fallback
      return {
        prices: [
          {
            id: "bitcoin",
            symbol: "BTC",
            name: "Bitcoin",
            current_price: 43256,
            price_change_percentage_24h: 2.4,
            market_cap: 850000000000,
            total_volume: 15000000000,
            image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
          },
          {
            id: "ethereum", 
            symbol: "ETH",
            name: "Ethereum",
            current_price: 2678,
            price_change_percentage_24h: -1.2,
            market_cap: 320000000000,
            total_volume: 8000000000,
            image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
          },
          {
            id: "solana",
            symbol: "SOL", 
            name: "Solana",
            current_price: 98.45,
            price_change_percentage_24h: 5.7,
            market_cap: 45000000000,
            total_volume: 2000000000,
            image: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
          }
        ]
      };
    }
  }
}

export const cryptoApiService = new CryptoApiService();
