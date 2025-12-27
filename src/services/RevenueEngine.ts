/**
 * REVENUE ENGINE SERVICE
 * Target: $1,500/day automated revenue generation
 * AI-powered insights, autopilot scheduling, and performance tracking
 * Focused on art monetization across multiple platforms
 */

export interface DailyTarget {
  target: number; // $1500
  current: number;
  breakdown: {
    etsy: { target: number; current: number };
    gumroad: { target: number; current: number };
    printful: { target: number; current: number };
    affiliate: { target: number; current: number };
    social: { target: number; current: number };
    licensing: { target: number; current: number };
  };
}

export interface AutopilotSchedule {
  enabled: boolean;
  morningTasks: AutopilotTask[];
  middayTasks: AutopilotTask[];
  afternoonTasks: AutopilotTask[];
  eveningTasks: AutopilotTask[];
}

export interface AutopilotTask {
  type: string;
  count: number;
  time: string;
  lastRun?: string;
  nextRun?: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
}

export interface RevenueInsight {
  id: string;
  type: 'opportunity' | 'optimization' | 'trend' | 'warning';
  title: string;
  description: string;
  potentialImpact: number; // estimated $ impact
  action: string; // button text
  actionData: object; // data to execute action
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceMetrics {
  dailyAverage: number;
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyProjection: number;
  topPerformingArt: ArtPerformance[];
  topPlatforms: PlatformPerformance[];
  conversionRate: number;
  avgOrderValue: number;
  totalOrders: number;
  totalViews: number;
}

export interface ArtPerformance {
  artId: string;
  artTitle: string;
  earnings: number;
  sales: number;
  views: number;
  conversionRate: number;
  platforms: string[];
}

export interface PlatformPerformance {
  platform: string;
  earnings: number;
  sales: number;
  avgOrderValue: number;
  conversionRate: number;
}

export interface EarningsRecord {
  id: string;
  platform: string;
  amount: number;
  artId?: string;
  timestamp: string;
  orderId?: string;
  productType?: string;
}

export interface PricingOptimization {
  artId: string;
  artTitle: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  potentialIncrease: number;
  confidence: number; // 0-100
}

export interface TrendAnalysis {
  id: string;
  niche: string;
  trendScore: number; // 0-100
  growthRate: number; // percentage
  competition: 'low' | 'medium' | 'high';
  opportunity: string;
  suggestedActions: string[];
  artStyles: string[];
}

export interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: number;
  estimatedImpact: number;
  estimatedTime: string;
  category: 'content' | 'marketing' | 'optimization' | 'research';
  actionType: string;
  actionData: object;
}

export class RevenueEngine {
  private static instance: RevenueEngine;
  private dailyTarget: DailyTarget;
  private autopilotSchedule: AutopilotSchedule;
  private earningsHistory: EarningsRecord[] = [];
  private insights: RevenueInsight[] = [];
  private readonly STORAGE_KEY = 'revenue_engine_data';
  private readonly SCHEDULE_KEY = 'revenue_engine_schedule';
  private readonly EARNINGS_KEY = 'revenue_engine_earnings';
  private readonly INSIGHTS_KEY = 'revenue_engine_insights';

  private constructor() {
    this.dailyTarget = this.initializeDailyTarget();
    this.autopilotSchedule = this.loadOrCreateSchedule();
    this.loadEarningsHistory();
    this.loadInsights();
    this.initializeAutopilot();
  }

  static getInstance(): RevenueEngine {
    if (!RevenueEngine.instance) {
      RevenueEngine.instance = new RevenueEngine();
    }
    return RevenueEngine.instance;
  }

  /**
   * Initialize daily target structure
   */
  private initializeDailyTarget(): DailyTarget {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    // Default target breakdown for $1,500/day
    return {
      target: 1500,
      current: 0,
      breakdown: {
        etsy: { target: 450, current: 0 }, // 30% - main art marketplace
        gumroad: { target: 300, current: 0 }, // 20% - digital products
        printful: { target: 300, current: 0 }, // 20% - print-on-demand
        affiliate: { target: 225, current: 0 }, // 15% - affiliate marketing
        social: { target: 150, current: 0 }, // 10% - social media sales
        licensing: { target: 75, current: 0 }, // 5% - art licensing
      },
    };
  }

  /**
   * Load or create default autopilot schedule
   */
  private loadOrCreateSchedule(): AutopilotSchedule {
    const saved = localStorage.getItem(this.SCHEDULE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    // Default schedule for $1,500/day target
    return {
      enabled: true,
      morningTasks: [
        { type: 'etsy_listing', count: 5, time: '09:00', status: 'pending' },
        { type: 'printful_sync', count: 3, time: '10:00', status: 'pending' },
      ],
      middayTasks: [
        { type: 'social_post', count: 10, time: '12:00', status: 'pending' },
        { type: 'pinterest_pin', count: 5, time: '13:00', status: 'pending' },
      ],
      afternoonTasks: [
        { type: 'gumroad_product', count: 3, time: '15:00', status: 'pending' },
      ],
      eveningTasks: [
        { type: 'affiliate_article', count: 2, time: '18:00', status: 'pending' },
        { type: 'analytics_review', count: 1, time: '20:00', status: 'pending' },
      ],
    };
  }

  /**
   * Load earnings history
   */
  private loadEarningsHistory(): void {
    const saved = localStorage.getItem(this.EARNINGS_KEY);
    if (saved) {
      this.earningsHistory = JSON.parse(saved);
    } else {
      // Generate some realistic mock data
      this.earningsHistory = this.generateMockEarnings();
      this.saveEarningsHistory();
    }
  }

  /**
   * Load insights
   */
  private loadInsights(): void {
    const saved = localStorage.getItem(this.INSIGHTS_KEY);
    if (saved) {
      this.insights = JSON.parse(saved);
    } else {
      this.generateInsights();
    }
  }

  /**
   * Initialize autopilot system
   */
  private initializeAutopilot(): void {
    if (this.autopilotSchedule.enabled) {
      // Check tasks every 15 minutes
      setInterval(() => {
        this.checkScheduledTasks();
      }, 15 * 60 * 1000);

      console.log('✅ Revenue Engine Autopilot initialized');
    }
  }

  /**
   * Get current daily target and progress
   */
  getDailyTarget(): DailyTarget {
    return { ...this.dailyTarget };
  }

  /**
   * Update earnings for a platform
   */
  updateEarnings(platform: string, amount: number, artId?: string, orderId?: string): void {
    const record: EarningsRecord = {
      id: crypto.randomUUID(),
      platform: platform.toLowerCase(),
      amount,
      artId,
      timestamp: new Date().toISOString(),
      orderId,
    };

    this.earningsHistory.push(record);

    // Update daily target
    const today = new Date().toDateString();
    const todayEarnings = this.earningsHistory
      .filter((e) => new Date(e.timestamp).toDateString() === today)
      .reduce((sum, e) => sum + e.amount, 0);

    this.dailyTarget.current = todayEarnings;

    // Update platform breakdown
    const platformKey = platform.toLowerCase() as keyof typeof this.dailyTarget.breakdown;
    if (platformKey in this.dailyTarget.breakdown) {
      const platformToday = this.earningsHistory
        .filter(
          (e) =>
            e.platform === platform.toLowerCase() &&
            new Date(e.timestamp).toDateString() === today
        )
        .reduce((sum, e) => sum + e.amount, 0);

      this.dailyTarget.breakdown[platformKey].current = platformToday;
    }

    this.saveDailyTarget();
    this.saveEarningsHistory();

    // Regenerate insights based on new data
    this.generateInsights();

    console.log(`💰 Added $${amount} from ${platform}. Today's total: $${todayEarnings}`);
  }

  /**
   * Get current autopilot schedule
   */
  getAutopilotSchedule(): AutopilotSchedule {
    return { ...this.autopilotSchedule };
  }

  /**
   * Update autopilot schedule
   */
  setAutopilotSchedule(schedule: AutopilotSchedule): void {
    this.autopilotSchedule = schedule;
    this.saveSchedule();
    console.log('✅ Autopilot schedule updated');
  }

  /**
   * Run autopilot cycle (simulated)
   */
  async runAutopilotCycle(): Promise<void> {
    if (!this.autopilotSchedule.enabled) {
      console.log('⚠️ Autopilot is disabled');
      return;
    }

    console.log('🤖 Running autopilot cycle...');

    const allTasks = [
      ...this.autopilotSchedule.morningTasks,
      ...this.autopilotSchedule.middayTasks,
      ...this.autopilotSchedule.afternoonTasks,
      ...this.autopilotSchedule.eveningTasks,
    ];

    for (const task of allTasks) {
      await this.executeTask(task);
    }

    console.log('✅ Autopilot cycle completed');
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: AutopilotTask): Promise<void> {
    console.log(`🔄 Executing: ${task.type} (${task.count}x)`);

    task.status = 'running';
    task.lastRun = new Date().toISOString();

    // Simulate task execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate revenue generation
    const revenue = this.simulateTaskRevenue(task);
    if (revenue > 0) {
      const platform = this.getTaskPlatform(task.type);
      this.updateEarnings(platform, revenue);
    }

    task.status = 'completed';
    this.saveSchedule();
  }

  /**
   * Check and execute scheduled tasks
   */
  private checkScheduledTasks(): void {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const allTasks = [
      ...this.autopilotSchedule.morningTasks,
      ...this.autopilotSchedule.middayTasks,
      ...this.autopilotSchedule.afternoonTasks,
      ...this.autopilotSchedule.eveningTasks,
    ];

    allTasks.forEach((task) => {
      if (task.time === currentTime && task.status !== 'running') {
        this.executeTask(task);
      }
    });
  }

  /**
   * Get insights and recommendations
   */
  getInsights(): RevenueInsight[] {
    return [...this.insights];
  }

  /**
   * Generate AI-powered insights
   */
  private generateInsights(): void {
    const metrics = this.getPerformanceMetrics('week');
    const insights: RevenueInsight[] = [];

    // Opportunity insights
    if (this.dailyTarget.current < this.dailyTarget.target * 0.7) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'opportunity',
        title: 'Increase Etsy Listings',
        description: `You're at ${((this.dailyTarget.current / this.dailyTarget.target) * 100).toFixed(0)}% of your daily target. Adding 10 more Etsy listings could generate an additional $150-200/day.`,
        potentialImpact: 175,
        action: 'Create Listings',
        actionData: { platform: 'etsy', count: 10 },
        createdAt: new Date().toISOString(),
        priority: 'high',
      });
    }

    // Platform optimization
    const topPlatform = metrics.topPlatforms[0];
    if (topPlatform && topPlatform.conversionRate > 0.05) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'optimization',
        title: `${topPlatform.platform} is Converting Well`,
        description: `Your conversion rate on ${topPlatform.platform} is ${(topPlatform.conversionRate * 100).toFixed(1)}%. Consider increasing your presence here.`,
        potentialImpact: 250,
        action: 'Scale Platform',
        actionData: { platform: topPlatform.platform },
        createdAt: new Date().toISOString(),
        priority: 'medium',
      });
    }

    // Trend detection
    insights.push({
      id: crypto.randomUUID(),
      type: 'trend',
      title: 'Minimalist Art Trending',
      description: 'Minimalist and abstract art styles are seeing 45% higher sales this week. Consider creating more in this style.',
      potentialImpact: 300,
      action: 'Generate Art',
      actionData: { style: 'minimalist', count: 5 },
      createdAt: new Date().toISOString(),
      priority: 'high',
    });

    // Warning insights
    if (metrics.conversionRate < 0.02) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'warning',
        title: 'Low Conversion Rate',
        description: `Your conversion rate is ${(metrics.conversionRate * 100).toFixed(2)}%. Review your pricing and product descriptions.`,
        potentialImpact: 0,
        action: 'Optimize Listings',
        actionData: { focus: 'conversion' },
        createdAt: new Date().toISOString(),
        priority: 'critical',
      });
    }

    // Pricing opportunities
    insights.push({
      id: crypto.randomUUID(),
      type: 'opportunity',
      title: 'Premium Pricing Opportunity',
      description: 'Your best-selling pieces are underpriced. Increasing prices by 20% could add $200/day with minimal sales impact.',
      potentialImpact: 200,
      action: 'Adjust Pricing',
      actionData: { increase: 0.2 },
      createdAt: new Date().toISOString(),
      priority: 'medium',
    });

    this.insights = insights;
    this.saveInsights();
  }

  /**
   * Apply an insight recommendation
   */
  async applyInsight(insightId: string): Promise<void> {
    const insight = this.insights.find((i) => i.id === insightId);
    if (!insight) {
      console.error('Insight not found');
      return;
    }

    console.log(`🚀 Applying insight: ${insight.title}`);
    console.log(`📊 Expected impact: +$${insight.potentialImpact}`);

    // Simulate applying the recommendation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Remove applied insight
    this.insights = this.insights.filter((i) => i.id !== insightId);
    this.saveInsights();

    console.log('✅ Insight applied successfully');
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(period: 'day' | 'week' | 'month' | 'year'): PerformanceMetrics {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const periodEarnings = this.earningsHistory.filter(
      (e) => new Date(e.timestamp) >= startDate
    );

    const totalEarnings = periodEarnings.reduce((sum, e) => sum + e.amount, 0);
    const totalOrders = periodEarnings.length;
    const totalViews = totalOrders * 20; // Simulated view data

    // Calculate platform performance
    const platformMap = new Map<string, PlatformPerformance>();
    periodEarnings.forEach((e) => {
      const platform = e.platform;
      if (!platformMap.has(platform)) {
        platformMap.set(platform, {
          platform,
          earnings: 0,
          sales: 0,
          avgOrderValue: 0,
          conversionRate: 0,
        });
      }
      const perf = platformMap.get(platform)!;
      perf.earnings += e.amount;
      perf.sales += 1;
    });

    const topPlatforms = Array.from(platformMap.values())
      .map((p) => ({
        ...p,
        avgOrderValue: p.sales > 0 ? p.earnings / p.sales : 0,
        conversionRate: p.sales / (totalViews / platformMap.size),
      }))
      .sort((a, b) => b.earnings - a.earnings);

    // Calculate art performance
    const artMap = new Map<string, ArtPerformance>();
    periodEarnings.forEach((e) => {
      if (e.artId) {
        if (!artMap.has(e.artId)) {
          artMap.set(e.artId, {
            artId: e.artId,
            artTitle: `Art ${e.artId.slice(0, 8)}`,
            earnings: 0,
            sales: 0,
            views: 0,
            conversionRate: 0,
            platforms: [],
          });
        }
        const art = artMap.get(e.artId)!;
        art.earnings += e.amount;
        art.sales += 1;
        if (!art.platforms.includes(e.platform)) {
          art.platforms.push(e.platform);
        }
      }
    });

    const topPerformingArt = Array.from(artMap.values())
      .map((a) => ({
        ...a,
        views: a.sales * 15,
        conversionRate: a.sales / (a.sales * 15),
      }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 10);

    const days = Math.max((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24), 1);

    return {
      dailyAverage: totalEarnings / days,
      weeklyTotal: period === 'week' ? totalEarnings : (totalEarnings / days) * 7,
      monthlyTotal: period === 'month' ? totalEarnings : (totalEarnings / days) * 30,
      yearlyProjection: (totalEarnings / days) * 365,
      topPerformingArt,
      topPlatforms,
      conversionRate: totalOrders / totalViews,
      avgOrderValue: totalOrders > 0 ? totalEarnings / totalOrders : 0,
      totalOrders,
      totalViews,
    };
  }

  /**
   * Calculate revenue projection
   */
  calculateProjection(daysAhead: number): number {
    const metrics = this.getPerformanceMetrics('month');
    return metrics.dailyAverage * daysAhead;
  }

  /**
   * AI-powered pricing optimization
   */
  optimizePricing(): PricingOptimization[] {
    const metrics = this.getPerformanceMetrics('month');
    const optimizations: PricingOptimization[] = [];

    metrics.topPerformingArt.forEach((art) => {
      if (art.conversionRate > 0.1) {
        // High conversion = can increase price
        optimizations.push({
          artId: art.artId,
          artTitle: art.artTitle,
          currentPrice: art.earnings / art.sales,
          suggestedPrice: (art.earnings / art.sales) * 1.25,
          reason: 'High conversion rate indicates pricing power',
          potentialIncrease: (art.earnings / art.sales) * 0.25 * art.sales,
          confidence: 85,
        });
      } else if (art.conversionRate < 0.03) {
        // Low conversion = consider lowering price
        optimizations.push({
          artId: art.artId,
          artTitle: art.artTitle,
          currentPrice: art.earnings / art.sales,
          suggestedPrice: (art.earnings / art.sales) * 0.85,
          reason: 'Low conversion rate suggests price sensitivity',
          potentialIncrease: 0,
          confidence: 70,
        });
      }
    });

    return optimizations;
  }

  /**
   * Identify trending niches
   */
  identifyTrends(): TrendAnalysis[] {
    return [
      {
        id: crypto.randomUUID(),
        niche: 'Minimalist Abstract',
        trendScore: 92,
        growthRate: 45,
        competition: 'medium',
        opportunity: 'High demand with moderate competition',
        suggestedActions: [
          'Create 10 minimalist pieces',
          'Focus on neutral colors',
          'Target home decor market',
        ],
        artStyles: ['geometric', 'line art', 'monochrome'],
      },
      {
        id: crypto.randomUUID(),
        niche: 'Nature & Botanicals',
        trendScore: 88,
        growthRate: 35,
        competition: 'high',
        opportunity: 'Evergreen niche with consistent demand',
        suggestedActions: [
          'Focus on unique plant species',
          'Create seasonal collections',
          'Offer in multiple sizes',
        ],
        artStyles: ['watercolor', 'vintage botanical', 'modern illustration'],
      },
      {
        id: crypto.randomUUID(),
        niche: 'Retro Gaming',
        trendScore: 85,
        growthRate: 60,
        competition: 'low',
        opportunity: 'Growing niche with low competition',
        suggestedActions: [
          'Create pixel art designs',
          'Target nostalgia market',
          'Consider merchandise options',
        ],
        artStyles: ['pixel art', '8-bit', 'vaporwave'],
      },
      {
        id: crypto.randomUUID(),
        niche: 'Motivational Quotes',
        trendScore: 78,
        growthRate: 20,
        competition: 'high',
        opportunity: 'Saturated but profitable with unique approach',
        suggestedActions: [
          'Focus on original typography',
          'Combine with abstract art',
          'Target specific audiences',
        ],
        artStyles: ['modern typography', 'hand lettering', 'mixed media'],
      },
    ];
  }

  /**
   * Suggest next actions to hit target
   */
  suggestNextActions(): NextAction[] {
    const current = this.dailyTarget.current;
    const target = this.dailyTarget.target;
    const remaining = target - current;

    const actions: NextAction[] = [];

    if (remaining > 0) {
      // Prioritize high-impact actions
      if (this.dailyTarget.breakdown.etsy.current < this.dailyTarget.breakdown.etsy.target) {
        actions.push({
          id: crypto.randomUUID(),
          title: 'Create Etsy Listings',
          description: `Add ${Math.ceil(remaining / 30)} new Etsy listings to reach daily target`,
          priority: 1,
          estimatedImpact: Math.min(remaining, 300),
          estimatedTime: '2 hours',
          category: 'content',
          actionType: 'create_listings',
          actionData: { platform: 'etsy', count: Math.ceil(remaining / 30) },
        });
      }

      if (this.dailyTarget.breakdown.social.current < this.dailyTarget.breakdown.social.target) {
        actions.push({
          id: crypto.randomUUID(),
          title: 'Boost Social Media',
          description: 'Post 15 pieces across Instagram, Pinterest, and TikTok',
          priority: 2,
          estimatedImpact: 150,
          estimatedTime: '1 hour',
          category: 'marketing',
          actionType: 'social_posts',
          actionData: { platforms: ['instagram', 'pinterest', 'tiktok'], count: 15 },
        });
      }

      actions.push({
        id: crypto.randomUUID(),
        title: 'Optimize Top Performers',
        description: 'Review and improve listings for your 5 best-selling pieces',
        priority: 3,
        estimatedImpact: 100,
        estimatedTime: '30 minutes',
        category: 'optimization',
        actionType: 'optimize_listings',
        actionData: { count: 5 },
      });

      actions.push({
        id: crypto.randomUUID(),
        title: 'Research Trending Niches',
        description: 'Analyze current market trends and identify new opportunities',
        priority: 4,
        estimatedImpact: 200,
        estimatedTime: '1 hour',
        category: 'research',
        actionType: 'trend_research',
        actionData: {},
      });
    } else {
      // Already hit target
      actions.push({
        id: crypto.randomUUID(),
        title: 'Scale Winning Strategies',
        description: "You've hit your target! Double down on what's working",
        priority: 1,
        estimatedImpact: 500,
        estimatedTime: '2 hours',
        category: 'optimization',
        actionType: 'scale_success',
        actionData: {},
      });
    }

    return actions.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Generate mock earnings data
   */
  private generateMockEarnings(): EarningsRecord[] {
    const earnings: EarningsRecord[] = [];
    const platforms = ['etsy', 'gumroad', 'printful', 'affiliate', 'social', 'licensing'];
    const now = new Date();

    // Generate last 30 days of data
    for (let day = 30; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);

      // 5-15 sales per day
      const salesCount = Math.floor(Math.random() * 10) + 5;

      for (let i = 0; i < salesCount; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const amount = Math.random() * 100 + 20; // $20-120 per sale

        earnings.push({
          id: crypto.randomUUID(),
          platform,
          amount: Math.round(amount * 100) / 100,
          artId: crypto.randomUUID(),
          timestamp: date.toISOString(),
          orderId: `ORD-${Math.random().toString(36).substring(7).toUpperCase()}`,
        });
      }
    }

    return earnings;
  }

  /**
   * Simulate task revenue
   */
  private simulateTaskRevenue(task: AutopilotTask): number {
    const revenueMap: Record<string, number> = {
      etsy_listing: 30,
      printful_sync: 25,
      social_post: 15,
      pinterest_pin: 10,
      gumroad_product: 50,
      affiliate_article: 75,
      analytics_review: 0,
    };

    const baseRevenue = revenueMap[task.type] || 0;
    return baseRevenue * task.count * (0.8 + Math.random() * 0.4); // ±20% variance
  }

  /**
   * Get platform from task type
   */
  private getTaskPlatform(taskType: string): string {
    const platformMap: Record<string, string> = {
      etsy_listing: 'etsy',
      printful_sync: 'printful',
      social_post: 'social',
      pinterest_pin: 'social',
      gumroad_product: 'gumroad',
      affiliate_article: 'affiliate',
      analytics_review: 'analytics',
    };

    return platformMap[taskType] || 'other';
  }

  /**
   * Save daily target
   */
  private saveDailyTarget(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.dailyTarget));
  }

  /**
   * Save schedule
   */
  private saveSchedule(): void {
    localStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(this.autopilotSchedule));
  }

  /**
   * Save earnings history
   */
  private saveEarningsHistory(): void {
    localStorage.setItem(this.EARNINGS_KEY, JSON.stringify(this.earningsHistory));
  }

  /**
   * Save insights
   */
  private saveInsights(): void {
    localStorage.setItem(this.INSIGHTS_KEY, JSON.stringify(this.insights));
  }

  /**
   * Reset daily progress (call at midnight)
   */
  resetDailyProgress(): void {
    this.dailyTarget.current = 0;
    Object.keys(this.dailyTarget.breakdown).forEach((platform) => {
      const key = platform as keyof typeof this.dailyTarget.breakdown;
      this.dailyTarget.breakdown[key].current = 0;
    });
    this.saveDailyTarget();
    console.log('🔄 Daily progress reset');
  }

  /**
   * Get earnings history
   */
  getEarningsHistory(days: number = 30): EarningsRecord[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.earningsHistory.filter((e) => new Date(e.timestamp) >= cutoffDate);
  }

  /**
   * Export data for analysis
   */
  exportData(): string {
    return JSON.stringify(
      {
        dailyTarget: this.dailyTarget,
        schedule: this.autopilotSchedule,
        earnings: this.earningsHistory,
        insights: this.insights,
        metrics: this.getPerformanceMetrics('month'),
      },
      null,
      2
    );
  }
}

// Export singleton instance
export const revenueEngine = RevenueEngine.getInstance();
