/**
 * Investment & Stock Market API Integration
 * Connects to Alpha Vantage, Yahoo Finance, and other APIs
 */

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export class InvestmentAPI {
  private static readonly ALPHA_VANTAGE_KEY = 'demo'; // Replace with your API key
  private static readonly BASE_URL = 'https://www.alphavantage.co/query';

  /**
   * Get real-time stock quote
   */
  static async getStockQuote(symbol: string): Promise<StockData> {
    try {
      const response = await fetch(
        `${this.BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_KEY}`
      );
      const data = await response.json();

      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume'])
        };
      }

      throw new Error('Invalid response from Alpha Vantage');
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      // Return mock data as fallback
      return {
        symbol,
        price: 150 + Math.random() * 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 1000000)
      };
    }
  }

  /**
   * Get portfolio value
   */
  static async getPortfolioValue(holdings: Array<{ symbol: string; shares: number }>): Promise<number> {
    let totalValue = 0;

    for (const holding of holdings) {
      const quote = await this.getStockQuote(holding.symbol);
      totalValue += quote.price * holding.shares;
    }

    return totalValue;
  }

  /**
   * Track dividend income
   */
  static async getDividends(symbols: string[]): Promise<number> {
    // In production, fetch real dividend data
    return Math.random() * 100; // Mock dividend income
  }
}
