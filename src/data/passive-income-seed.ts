/**
 * 🖤 PASSIVE INCOME SEED DATA
 * Realistic income streams totaling ~$1000/day ($30k/month)
 */

export const PASSIVE_INCOME_STREAMS = [
  // CONTENT CREATION - $8,500/month
  {
    id: 1,
    type: 'content' as const,
    name: 'AI Blog Network (5 sites)',
    status: 'active' as const,
    monthlyRevenue: 4200,
    dailyRevenue: 140,
    lastActive: new Date(),
    config: {
      sites: 5,
      postsPerDay: 3,
      avgCPM: 28,
      monthlyPageviews: 450000
    }
  },
  {
    id: 2,
    type: 'content' as const,
    name: 'YouTube Faceless Channels (3)',
    status: 'active' as const,
    monthlyRevenue: 3100,
    dailyRevenue: 103,
    lastActive: new Date(),
    config: {
      channels: 3,
      videosPerWeek: 9,
      avgCPM: 12,
      monthlyViews: 350000
    }
  },
  {
    id: 3,
    type: 'content' as const,
    name: 'Medium Partner Program',
    status: 'active' as const,
    monthlyRevenue: 850,
    dailyRevenue: 28,
    lastActive: new Date(),
    config: {
      articlesPerWeek: 7,
      avgReads: 1200
    }
  },
  {
    id: 4,
    type: 'content' as const,
    name: 'TikTok Creator Fund',
    status: 'active' as const,
    monthlyRevenue: 350,
    dailyRevenue: 12,
    lastActive: new Date(),
    config: {
      postsPerDay: 3,
      avgViews: 50000
    }
  },

  // AFFILIATE & E-COMMERCE - $7,800/month
  {
    id: 5,
    type: 'affiliate' as const,
    name: 'Amazon Associates',
    status: 'active' as const,
    monthlyRevenue: 3200,
    dailyRevenue: 107,
    lastActive: new Date(),
    config: {
      productReviews: 150,
      monthlyClicks: 12000,
      conversionRate: 0.08,
      avgCommission: 0.35
    }
  },
  {
    id: 6,
    type: 'affiliate' as const,
    name: 'ClickBank Products',
    status: 'active' as const,
    monthlyRevenue: 2100,
    dailyRevenue: 70,
    lastActive: new Date(),
    config: {
      activeProducts: 12,
      avgCommission: 45
    }
  },
  {
    id: 7,
    type: 'affiliate' as const,
    name: 'SaaS Affiliate Programs',
    status: 'active' as const,
    monthlyRevenue: 1800,
    dailyRevenue: 60,
    lastActive: new Date(),
    config: {
      programs: ['Shopify', 'ConvertKit', 'Teachable'],
      recurringCommissions: true
    }
  },
  {
    id: 8,
    type: 'affiliate' as const,
    name: 'Course Affiliates (Udemy, Coursera)',
    status: 'active' as const,
    monthlyRevenue: 700,
    dailyRevenue: 23,
    lastActive: new Date(),
    config: {
      courses: 45,
      avgCommission: 15
    }
  },

  // DIGITAL PRODUCTS - $6,500/month
  {
    id: 9,
    type: 'automated' as const,
    name: 'Notion Templates (Gumroad)',
    status: 'active' as const,
    monthlyRevenue: 2400,
    dailyRevenue: 80,
    lastActive: new Date(),
    config: {
      products: 24,
      price: 12,
      monthlySales: 200
    }
  },
  {
    id: 10,
    type: 'automated' as const,
    name: 'Canva Templates (Etsy)',
    status: 'active' as const,
    monthlyRevenue: 1900,
    dailyRevenue: 63,
    lastActive: new Date(),
    config: {
      templates: 150,
      avgPrice: 8,
      monthlySales: 240
    }
  },
  {
    id: 11,
    type: 'automated' as const,
    name: 'Print-on-Demand (Redbubble, Teespring)',
    status: 'active' as const,
    monthlyRevenue: 1200,
    dailyRevenue: 40,
    lastActive: new Date(),
    config: {
      designs: 200,
      avgProfit: 6,
      monthlySales: 200
    }
  },
  {
    id: 12,
    type: 'automated' as const,
    name: 'AI-Generated Stock Photos',
    status: 'active' as const,
    monthlyRevenue: 550,
    dailyRevenue: 18,
    lastActive: new Date(),
    config: {
      photos: 500,
      platforms: ['Shutterstock', 'Adobe Stock', 'iStock'],
      monthlyDownloads: 300
    }
  },
  {
    id: 13,
    type: 'automated' as const,
    name: 'Online Courses (Udemy, Skillshare)',
    status: 'active' as const,
    monthlyRevenue: 450,
    dailyRevenue: 15,
    lastActive: new Date(),
    config: {
      courses: 4,
      totalEnrollments: 850,
      avgPrice: 45
    }
  },

  // INVESTMENTS - $4,200/month
  {
    id: 14,
    type: 'investment' as const,
    name: 'Dividend Stock Portfolio',
    status: 'active' as const,
    monthlyRevenue: 2200,
    dailyRevenue: 73,
    lastActive: new Date(),
    config: {
      portfolioValue: 180000,
      dividendYield: 0.147, // 14.7% annual = ~$2.2k/month
      topHoldings: ['SCHD', 'JEPI', 'VYM', 'QYLD']
    }
  },
  {
    id: 15,
    type: 'investment' as const,
    name: 'REITs (Real Estate Investment Trusts)',
    status: 'active' as const,
    monthlyRevenue: 1400,
    dailyRevenue: 47,
    lastActive: new Date(),
    config: {
      portfolioValue: 120000,
      avgYield: 0.14,
      holdings: ['O (Realty Income)', 'VICI', 'NNN']
    }
  },
  {
    id: 16,
    type: 'investment' as const,
    name: 'Peer-to-Peer Lending (LendingClub)',
    status: 'active' as const,
    monthlyRevenue: 600,
    dailyRevenue: 20,
    lastActive: new Date(),
    config: {
      invested: 50000,
      avgReturn: 0.144,
      activeLoans: 85
    }
  },

  // CRYPTO - $2,000/month
  {
    id: 17,
    type: 'crypto' as const,
    name: 'Crypto Staking (ETH, ADA, SOL)',
    status: 'active' as const,
    monthlyRevenue: 1200,
    dailyRevenue: 40,
    lastActive: new Date(),
    config: {
      stakedValue: 80000,
      avgAPY: 0.18,
      assets: ['ETH 2.0 (5.5%)', 'ADA (4.8%)', 'SOL (7.2%)']
    }
  },
  {
    id: 18,
    type: 'crypto' as const,
    name: 'DeFi Yield Farming',
    status: 'active' as const,
    monthlyRevenue: 800,
    dailyRevenue: 27,
    lastActive: new Date(),
    config: {
      liquidityProvided: 60000,
      avgAPY: 0.16,
      protocols: ['Uniswap', 'Curve', 'Aave']
    }
  },

  // AUTOMATED SERVICES - $1,000/month
  {
    id: 19,
    type: 'automated' as const,
    name: 'AI Chatbot Services (Fiverr)',
    status: 'active' as const,
    monthlyRevenue: 400,
    dailyRevenue: 13,
    lastActive: new Date(),
    config: {
      gigs: 3,
      avgOrder: 50,
      monthlyOrders: 8
    }
  },
  {
    id: 20,
    type: 'automated' as const,
    name: 'Lead Generation & Sales',
    status: 'active' as const,
    monthlyRevenue: 350,
    dailyRevenue: 12,
    lastActive: new Date(),
    config: {
      leadsPerDay: 100,
      sellRate: 0.7,
      pricePerLead: 2.5
    }
  },
  {
    id: 21,
    type: 'automated' as const,
    name: 'Email Marketing (Newsletter)',
    status: 'active' as const,
    monthlyRevenue: 250,
    dailyRevenue: 8,
    lastActive: new Date(),
    config: {
      subscribers: 5000,
      openRate: 0.35,
      clickRate: 0.12,
      monetizationRate: 0.08
    }
  },
];

// RECENT ACTIVITIES (last 7 days)
export const RECENT_INCOME_ACTIVITIES = [
  // Today
  {
    id: 1,
    streamId: 1,
    action: 'Blog Ad Revenue - 150k impressions',
    revenue: 142.50,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: { impressions: 150000, cpm: 28, articles: 3 }
  },
  {
    id: 2,
    streamId: 5,
    action: 'Amazon Affiliate - 12 conversions',
    revenue: 108.40,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    details: { conversions: 12, avgCommission: 9.03 }
  },
  {
    id: 3,
    streamId: 14,
    action: 'Dividend Payment - SCHD',
    revenue: 75.20,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    details: { shares: 188, dividendPerShare: 0.40 }
  },
  {
    id: 4,
    streamId: 2,
    action: 'YouTube AdSense - 45k views',
    revenue: 105.00,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    details: { views: 45000, cpm: 12, videos: 3 }
  },
  {
    id: 5,
    streamId: 9,
    action: 'Gumroad Sales - 7 templates sold',
    revenue: 84.00,
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    details: { sales: 7, price: 12 }
  },
  {
    id: 6,
    streamId: 17,
    action: 'ETH Staking Rewards',
    revenue: 42.30,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    details: { ethStaked: 15, apy: 0.055 }
  },

  // Yesterday
  {
    id: 7,
    streamId: 1,
    action: 'Blog Ad Revenue - 145k impressions',
    revenue: 138.60,
    timestamp: new Date(Date.now() - 1 * 86400000 - 2 * 60 * 60 * 1000),
    details: { impressions: 145000, cpm: 28 }
  },
  {
    id: 8,
    streamId: 6,
    action: 'ClickBank Commission - 2 sales',
    revenue: 90.00,
    timestamp: new Date(Date.now() - 1 * 86400000 - 5 * 60 * 60 * 1000),
    details: { sales: 2, avgCommission: 45 }
  },
  {
    id: 9,
    streamId: 10,
    action: 'Etsy Sales - 8 Canva templates',
    revenue: 64.00,
    timestamp: new Date(Date.now() - 1 * 86400000 - 8 * 60 * 60 * 1000),
    details: { sales: 8, price: 8 }
  },
  {
    id: 10,
    streamId: 2,
    action: 'YouTube AdSense - 48k views',
    revenue: 110.40,
    timestamp: new Date(Date.now() - 1 * 86400000 - 10 * 60 * 60 * 1000),
    details: { views: 48000, cpm: 12 }
  },

  // 2 days ago
  {
    id: 11,
    streamId: 5,
    action: 'Amazon Affiliate - 15 conversions',
    revenue: 135.50,
    timestamp: new Date(Date.now() - 2 * 86400000 - 3 * 60 * 60 * 1000),
    details: { conversions: 15 }
  },
  {
    id: 12,
    streamId: 15,
    action: 'REIT Dividend - VICI',
    revenue: 48.75,
    timestamp: new Date(Date.now() - 2 * 86400000 - 7 * 60 * 60 * 1000),
    details: { shares: 325, dividendPerShare: 0.15 }
  },
  {
    id: 13,
    streamId: 11,
    action: 'Print-on-Demand Sales - 7 items',
    revenue: 42.00,
    timestamp: new Date(Date.now() - 2 * 86400000 - 9 * 60 * 60 * 1000),
    details: { sales: 7, avgProfit: 6 }
  },

  // 3 days ago
  {
    id: 14,
    streamId: 1,
    action: 'Blog Ad Revenue - 155k impressions',
    revenue: 145.00,
    timestamp: new Date(Date.now() - 3 * 86400000),
    details: { impressions: 155000, cpm: 28 }
  },
  {
    id: 15,
    streamId: 18,
    action: 'DeFi Yield Harvest - Curve',
    revenue: 28.40,
    timestamp: new Date(Date.now() - 3 * 86400000 - 6 * 60 * 60 * 1000),
    details: { protocol: 'Curve', apy: 0.16 }
  },
  {
    id: 16,
    streamId: 7,
    action: 'SaaS Recurring Commission - Shopify',
    revenue: 65.00,
    timestamp: new Date(Date.now() - 3 * 86400000 - 8 * 60 * 60 * 1000),
    details: { referrals: 13, avgCommission: 5 }
  },

  // 4 days ago
  {
    id: 17,
    streamId: 2,
    action: 'YouTube AdSense - 50k views',
    revenue: 115.00,
    timestamp: new Date(Date.now() - 4 * 86400000),
    details: { views: 50000, cpm: 12 }
  },
  {
    id: 18,
    streamId: 9,
    action: 'Gumroad Sales - 9 templates',
    revenue: 108.00,
    timestamp: new Date(Date.now() - 4 * 86400000 - 5 * 60 * 60 * 1000),
    details: { sales: 9, price: 12 }
  },
  {
    id: 19,
    streamId: 20,
    action: 'Lead Sales - 120 leads',
    revenue: 15.00,
    timestamp: new Date(Date.now() - 4 * 86400000 - 10 * 60 * 60 * 1000),
    details: { leads: 120, sold: 84, pricePerLead: 2.5 }
  },

  // 5 days ago
  {
    id: 20,
    streamId: 14,
    action: 'Dividend Payment - JEPI',
    revenue: 82.50,
    timestamp: new Date(Date.now() - 5 * 86400000),
    details: { shares: 165, dividendPerShare: 0.50 }
  },
  {
    id: 21,
    streamId: 5,
    action: 'Amazon Affiliate - 13 conversions',
    revenue: 117.30,
    timestamp: new Date(Date.now() - 5 * 86400000 - 6 * 60 * 60 * 1000),
    details: { conversions: 13 }
  },
  {
    id: 22,
    streamId: 1,
    action: 'Blog Ad Revenue - 148k impressions',
    revenue: 140.40,
    timestamp: new Date(Date.now() - 5 * 86400000 - 10 * 60 * 60 * 1000),
    details: { impressions: 148000, cpm: 28 }
  },

  // 6 days ago
  {
    id: 23,
    streamId: 10,
    action: 'Etsy Sales - 10 templates',
    revenue: 80.00,
    timestamp: new Date(Date.now() - 6 * 86400000),
    details: { sales: 10, price: 8 }
  },
  {
    id: 24,
    streamId: 17,
    action: 'SOL Staking Rewards',
    revenue: 45.60,
    timestamp: new Date(Date.now() - 6 * 86400000 - 8 * 60 * 60 * 1000),
    details: { solStaked: 250, apy: 0.072 }
  },
];

// Calculate totals
export const PASSIVE_INCOME_STATS = {
  totalMonthlyRevenue: PASSIVE_INCOME_STREAMS.reduce((sum, s) => sum + s.monthlyRevenue, 0),
  totalDailyRevenue: PASSIVE_INCOME_STREAMS.reduce((sum, s) => sum + s.dailyRevenue, 0),
  activeStreams: PASSIVE_INCOME_STREAMS.filter(s => s.status === 'active').length,
  totalStreams: PASSIVE_INCOME_STREAMS.length,
  topStream: PASSIVE_INCOME_STREAMS.reduce((top, s) => s.monthlyRevenue > top.monthlyRevenue ? s : top),
  streamsByType: {
    content: PASSIVE_INCOME_STREAMS.filter(s => s.type === 'content').reduce((sum, s) => sum + s.monthlyRevenue, 0),
    affiliate: PASSIVE_INCOME_STREAMS.filter(s => s.type === 'affiliate').reduce((sum, s) => sum + s.monthlyRevenue, 0),
    automated: PASSIVE_INCOME_STREAMS.filter(s => s.type === 'automated').reduce((sum, s) => sum + s.monthlyRevenue, 0),
    investment: PASSIVE_INCOME_STREAMS.filter(s => s.type === 'investment').reduce((sum, s) => sum + s.monthlyRevenue, 0),
    crypto: PASSIVE_INCOME_STREAMS.filter(s => s.type === 'crypto').reduce((sum, s) => sum + s.monthlyRevenue, 0),
  }
};
