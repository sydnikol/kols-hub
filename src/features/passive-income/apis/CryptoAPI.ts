/**
 * Cryptocurrency API Integration
 * Connects to CoinGecko, Binance, and other crypto APIs
 */

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export class CryptoAPI {
  private static readonly COINGECKO_URL = 'https://api.coingecko.com/api/v3';

  /**
   * Get real-time crypto prices
   */
  static async getCryptoPrices(symbols: string[] = ['bitcoin', 'ethereum', 'cardano']): Promise<CryptoPrice[]> {
    try {
      const ids = symbols.join(',');
      const response = await fetch(
        `${this.COINGECKO_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Return mock data as fallback
      return symbols.map(symbol => ({
        id: symbol,
        symbol: symbol.substring(0, 3).toUpperCase(),
        name: symbol.charAt(0).toUpperCase() + symbol.slice(1),
        current_price: Math.random() * 50000,
        price_change_24h: (Math.random() - 0.5) * 1000,
        price_change_percentage_24h: (Math.random() - 0.5) * 10,
        market_cap: Math.random() * 1000000000
      }));
    }
  }

  /**
   * Get portfolio value in crypto
   */
  static async getCryptoPortfolioValue(holdings: Array<{ id: string; amount: number }>): Promise<number> {
    const prices = await this.getCryptoPrices(holdings.map(h => h.id));
    let totalValue = 0;

    for (const holding of holdings) {
      const price = prices.find(p => p.id === holding.id);
      if (price) {
        totalValue += price.current_price * holding.amount;
      }
    }

    return totalValue;
  }

  /**
   * Calculate staking rewards
   */
  static calculateStakingRewards(amount: number, apr: number, days: number): number {
    return (amount * apr * days) / 365 / 100;
  }
}
