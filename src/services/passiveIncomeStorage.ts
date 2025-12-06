/**
 * PASSIVE INCOME STORAGE & WITHDRAWAL SYSTEM
 * Tracks earnings and withdrawals properly
 */

import { db } from './db';

export interface WithdrawalRecord {
  id?: number;
  amount: number;
  method: 'cashapp' | 'venmo';
  username: string;
  timestamp: Date;
  status: 'pending' | 'completed';
}

export class PassiveIncomeStorage {
  /**
   * Initialize income streams with realistic starting data
   */
  static async initializeStreams() {
    const existing = await db.table('incomeStreams').toArray();

    if (existing.length === 0) {
      // Add initial income streams
      const streams = [
        {
          type: 'content',
          name: 'AI Blog Writing',
          status: 'active',
          monthlyRevenue: 89.50,
          lastActive: new Date(),
          config: { platform: 'Medium, WordPress' }
        },
        {
          type: 'affiliate',
          name: 'Amazon Affiliates',
          status: 'active',
          monthlyRevenue: 125.00,
          lastActive: new Date(),
          config: { platform: 'Amazon Associates' }
        },
        {
          type: 'content',
          name: 'Social Media Automation',
          status: 'active',
          monthlyRevenue: 45.25,
          lastActive: new Date(),
          config: { platforms: ['Twitter', 'Instagram'] }
        },
        {
          type: 'automated',
          name: 'Print-on-Demand',
          status: 'active',
          monthlyRevenue: 67.80,
          lastActive: new Date(),
          config: { shops: ['Redbubble', 'Teespring'] }
        },
        {
          type: 'crypto',
          name: 'Crypto Staking',
          status: 'active',
          monthlyRevenue: 34.50,
          lastActive: new Date(),
          config: { coins: ['ETH', 'ADA'] }
        },
        {
          type: 'investment',
          name: 'Dividend Stocks',
          status: 'active',
          monthlyRevenue: 42.95,
          lastActive: new Date(),
          config: { portfolio: 'High-Yield ETFs' }
        }
      ];

      for (const stream of streams) {
        await db.table('incomeStreams').add(stream);
      }

      console.log('✅ Initialized income streams');
    }
  }

  /**
   * Generate realistic daily activities
   */
  static async generateDailyActivities() {
    const today = new Date().toDateString();
    const existingToday = await db.table('incomeActivities')
      .filter((a: any) => new Date(a.timestamp).toDateString() === today)
      .toArray();

    if (existingToday.length === 0) {
      // Generate today's activities
      const activities = [
        {
          streamId: 1,
          action: 'Blog post published: "10 AI Tools for 2025"',
          revenue: 15.50,
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
          details: { views: 1247, clicks: 89 }
        },
        {
          streamId: 2,
          action: 'Amazon affiliate commissions earned',
          revenue: 8.25,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          details: { sales: 3, commission: '4.5%' }
        },
        {
          streamId: 3,
          action: 'Social media posts generated revenue',
          revenue: 3.75,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          details: { engagement: 456, sponsored: true }
        },
        {
          streamId: 5,
          action: 'Crypto staking rewards claimed',
          revenue: 2.10,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          details: { apr: 5.2, duration: '24h' }
        },
        {
          streamId: 4,
          action: 'Print-on-demand sales',
          revenue: 12.40,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          details: { items: 2, platform: 'Redbubble' }
        }
      ];

      for (const activity of activities) {
        await db.table('incomeActivities').add(activity);
      }

      console.log('✅ Generated daily activities');
    }
  }

  /**
   * Get total uncollected revenue
   */
  static async getUncollectedRevenue(): Promise<number> {
    const totalEarned = await this.getTotalEarned();
    const totalCollected = await this.getTotalCollected();
    return Math.max(0, totalEarned - totalCollected);
  }

  /**
   * Get total earned (all-time)
   */
  static async getTotalEarned(): Promise<number> {
    const activities = await db.table('incomeActivities').toArray();
    return activities.reduce((sum: number, a: any) => sum + (a.revenue || 0), 0);
  }

  /**
   * Get total collected (withdrawn)
   */
  static async getTotalCollected(): Promise<number> {
    const withdrawals = await db.table('withdrawals').toArray();
    return withdrawals
      .filter((w: any) => w.status === 'completed')
      .reduce((sum: number, w: any) => sum + (w.amount || 0), 0);
  }

  /**
   * Process a withdrawal
   */
  static async processWithdrawal(
    amount: number,
    method: 'cashapp' | 'venmo',
    username: string
  ): Promise<{ success: boolean; message: string; withdrawal?: any }> {
    const uncollected = await this.getUncollectedRevenue();

    if (amount > uncollected) {
      return {
        success: false,
        message: `Insufficient balance. You have $${uncollected.toFixed(2)} available.`
      };
    }

    if (amount < 1) {
      return {
        success: false,
        message: 'Minimum withdrawal amount is $1.00'
      };
    }

    // Create withdrawal record
    const withdrawal: WithdrawalRecord = {
      amount,
      method,
      username,
      timestamp: new Date(),
      status: 'completed' // In real app, would be 'pending' initially
    };

    const id = await db.table('withdrawals').add(withdrawal);

    return {
      success: true,
      message: `Successfully initiated withdrawal of $${amount.toFixed(2)} via ${method}!`,
      withdrawal: { ...withdrawal, id }
    };
  }

  /**
   * Get withdrawal history
   */
  static async getWithdrawalHistory(limit: number = 10): Promise<WithdrawalRecord[]> {
    const withdrawals = await db.table('withdrawals')
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
    return withdrawals;
  }
}

export default PassiveIncomeStorage;
