/**
 * Platform Connectors Service
 * Handles connections to various selling platforms for passive income automation
 */

export interface PlatformConnection {
  id: string;
  platform: 'etsy' | 'gumroad' | 'printful' | 'printify' | 'shopify' | 'instagram' | 'pinterest' | 'tiktok' | 'youtube';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  tier: 'direct_api' | 'semi_auto' | 'manual';
  lastSync: string;
  credentials?: {
    apiKey?: string;
    accessToken?: string;
    shopId?: string;
  };
  stats: {
    totalListings: number;
    totalSales: number;
    totalEarnings: number;
  };
}

export interface PublishRequest {
  productId: string;
  platform: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  images: string[];
  category?: string;
}

export interface PublishResult {
  success: boolean;
  listingId?: string;
  listingUrl?: string;
  error?: string;
}

export interface ScheduledPost {
  id: string;
  platform: string;
  content: any;
  scheduledTime: Date;
  status: 'pending' | 'posted' | 'failed';
}

export interface PlatformCategory {
  id: string;
  name: string;
  subcategories?: string[];
}

export interface FeeEstimate {
  listingFee: number;
  transactionFee: number;
  paymentProcessingFee: number;
  totalFees: number;
  netEarnings: number;
}

class PlatformConnectorsService {
  private readonly STORAGE_KEY = 'platform_connections';
  private readonly SCHEDULED_POSTS_KEY = 'scheduled_posts';

  /**
   * Platform tier definitions
   */
  private platformTiers = {
    etsy: 'direct_api' as const,
    gumroad: 'direct_api' as const,
    printful: 'direct_api' as const,
    printify: 'direct_api' as const,
    shopify: 'direct_api' as const,
    instagram: 'semi_auto' as const,
    pinterest: 'semi_auto' as const,
    tiktok: 'manual' as const,
    youtube: 'manual' as const,
  };

  /**
   * Platform-specific categories
   */
  private platformCategories = {
    etsy: [
      { id: 'art', name: 'Art & Collectibles', subcategories: ['Prints', 'Digital Prints', 'Drawings'] },
      { id: 'home', name: 'Home & Living', subcategories: ['Wall Decor', 'Furniture', 'Lighting'] },
      { id: 'jewelry', name: 'Jewelry & Accessories', subcategories: ['Necklaces', 'Earrings', 'Bracelets'] },
      { id: 'clothing', name: 'Clothing & Shoes', subcategories: ['T-Shirts', 'Dresses', 'Accessories'] },
      { id: 'craft', name: 'Craft Supplies & Tools', subcategories: ['Materials', 'Tools', 'Patterns'] },
    ],
    gumroad: [
      { id: 'digital', name: 'Digital Products', subcategories: ['Ebooks', 'Courses', 'Templates'] },
      { id: 'creative', name: 'Creative Assets', subcategories: ['Graphics', 'Audio', 'Video'] },
      { id: 'software', name: 'Software & Tools', subcategories: ['Plugins', 'Scripts', 'Apps'] },
    ],
    printful: [
      { id: 'apparel', name: 'Apparel', subcategories: ['T-Shirts', 'Hoodies', 'Hats'] },
      { id: 'home', name: 'Home & Living', subcategories: ['Mugs', 'Posters', 'Pillows'] },
      { id: 'accessories', name: 'Accessories', subcategories: ['Bags', 'Phone Cases', 'Stickers'] },
    ],
    printify: [
      { id: 'apparel', name: 'Apparel', subcategories: ['T-Shirts', 'Hoodies', 'Hats'] },
      { id: 'home', name: 'Home & Living', subcategories: ['Mugs', 'Posters', 'Pillows'] },
      { id: 'accessories', name: 'Accessories', subcategories: ['Bags', 'Phone Cases', 'Stickers'] },
    ],
    shopify: [
      { id: 'all', name: 'All Products', subcategories: [] },
    ],
  };

  /**
   * Simulates realistic API delay
   */
  private async simulateDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Gets all platform connections
   */
  getConnections(): PlatformConnection[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultConnections();
  }

  /**
   * Gets default/initial connections
   */
  private getDefaultConnections(): PlatformConnection[] {
    return [
      {
        id: 'etsy-1',
        platform: 'etsy',
        status: 'disconnected',
        tier: 'direct_api',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'gumroad-1',
        platform: 'gumroad',
        status: 'disconnected',
        tier: 'direct_api',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'printful-1',
        platform: 'printful',
        status: 'disconnected',
        tier: 'direct_api',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'printify-1',
        platform: 'printify',
        status: 'disconnected',
        tier: 'direct_api',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'shopify-1',
        platform: 'shopify',
        status: 'disconnected',
        tier: 'direct_api',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'instagram-1',
        platform: 'instagram',
        status: 'disconnected',
        tier: 'semi_auto',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'pinterest-1',
        platform: 'pinterest',
        status: 'disconnected',
        tier: 'semi_auto',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'tiktok-1',
        platform: 'tiktok',
        status: 'disconnected',
        tier: 'manual',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
      {
        id: 'youtube-1',
        platform: 'youtube',
        status: 'disconnected',
        tier: 'manual',
        lastSync: new Date().toISOString(),
        stats: { totalListings: 0, totalSales: 0, totalEarnings: 0 },
      },
    ];
  }

  /**
   * Saves connections to localStorage
   */
  private saveConnections(connections: PlatformConnection[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections));
  }

  /**
   * Initiates OAuth/API connection (simulated)
   */
  async connect(platform: string): Promise<{ success: boolean; error?: string }> {
    await this.simulateDelay();

    const connections = this.getConnections();
    const connection = connections.find(c => c.platform === platform);

    if (!connection) {
      return { success: false, error: 'Platform not found' };
    }

    // Simulate OAuth flow
    const mockToken = `${platform}_token_${Date.now()}`;
    const mockApiKey = `${platform}_api_${Math.random().toString(36).substr(2, 9)}`;

    connection.status = 'connected';
    connection.credentials = {
      apiKey: mockApiKey,
      accessToken: mockToken,
      shopId: `shop_${Math.random().toString(36).substr(2, 9)}`,
    };
    connection.lastSync = new Date().toISOString();

    // Add some mock stats for connected platforms
    connection.stats = {
      totalListings: Math.floor(Math.random() * 50),
      totalSales: Math.floor(Math.random() * 200),
      totalEarnings: Math.floor(Math.random() * 5000),
    };

    this.saveConnections(connections);
    return { success: true };
  }

  /**
   * Removes connection
   */
  async disconnect(platform: string): Promise<{ success: boolean; error?: string }> {
    await this.simulateDelay();

    const connections = this.getConnections();
    const connection = connections.find(c => c.platform === platform);

    if (!connection) {
      return { success: false, error: 'Platform not found' };
    }

    connection.status = 'disconnected';
    connection.credentials = undefined;
    connection.stats = { totalListings: 0, totalSales: 0, totalEarnings: 0 };
    connection.lastSync = new Date().toISOString();

    this.saveConnections(connections);
    return { success: true };
  }

  /**
   * Verifies connection works
   */
  async testConnection(platform: string): Promise<{ success: boolean; error?: string }> {
    await this.simulateDelay();

    const connections = this.getConnections();
    const connection = connections.find(c => c.platform === platform);

    if (!connection) {
      return { success: false, error: 'Platform not found' };
    }

    if (connection.status !== 'connected') {
      return { success: false, error: 'Platform not connected' };
    }

    // Simulate 95% success rate
    const testSucceeds = Math.random() > 0.05;

    if (testSucceeds) {
      connection.lastSync = new Date().toISOString();
      this.saveConnections(connections);
      return { success: true };
    } else {
      connection.status = 'error';
      this.saveConnections(connections);
      return { success: false, error: 'Connection test failed. Please reconnect.' };
    }
  }

  /**
   * Publishes to platform (simulated)
   */
  async publish(request: PublishRequest): Promise<PublishResult> {
    await this.simulateDelay();

    const connections = this.getConnections();
    const connection = connections.find(c => c.platform === request.platform);

    if (!connection) {
      return { success: false, error: 'Platform not found' };
    }

    if (connection.status !== 'connected') {
      return { success: false, error: 'Platform not connected' };
    }

    // Simulate successful publish
    const listingId = `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const platformUrls: Record<string, string> = {
      etsy: `https://www.etsy.com/listing/${listingId}`,
      gumroad: `https://gumroad.com/l/${listingId}`,
      printful: `https://www.printful.com/dashboard/products/${listingId}`,
      printify: `https://printify.com/app/products/${listingId}`,
      shopify: `https://shopify.com/admin/products/${listingId}`,
      instagram: `https://www.instagram.com/p/${listingId}`,
      pinterest: `https://www.pinterest.com/pin/${listingId}`,
      tiktok: `https://www.tiktok.com/@user/video/${listingId}`,
      youtube: `https://www.youtube.com/watch?v=${listingId}`,
    };

    // Update connection stats
    connection.stats.totalListings++;
    connection.lastSync = new Date().toISOString();
    this.saveConnections(connections);

    return {
      success: true,
      listingId,
      listingUrl: platformUrls[request.platform] || `https://${request.platform}.com/${listingId}`,
    };
  }

  /**
   * Gets all listings on platform
   */
  async getListings(platform: string): Promise<any[]> {
    await this.simulateDelay();

    const connections = this.getConnections();
    const connection = connections.find(c => c.platform === platform);

    if (!connection || connection.status !== 'connected') {
      return [];
    }

    // Generate mock listings
    const listingCount = connection.stats.totalListings;
    const mockListings = [];

    for (let i = 0; i < listingCount; i++) {
      mockListings.push({
        id: `listing_${i + 1}`,
        title: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 10,
        status: Math.random() > 0.2 ? 'active' : 'draft',
        views: Math.floor(Math.random() * 1000),
        sales: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return mockListings;
  }

  /**
   * Syncs earnings data
   */
  async syncEarnings(platform: string): Promise<{ success: boolean; earnings?: number; error?: string }> {
    await this.simulateDelay();

    const connections = this.getConnections();
    const connection = connections.find(c => c.platform === platform);

    if (!connection) {
      return { success: false, error: 'Platform not found' };
    }

    if (connection.status !== 'connected') {
      return { success: false, error: 'Platform not connected' };
    }

    // Simulate earnings update
    const newEarnings = connection.stats.totalEarnings + Math.floor(Math.random() * 500);
    connection.stats.totalEarnings = newEarnings;
    connection.stats.totalSales += Math.floor(Math.random() * 10);
    connection.lastSync = new Date().toISOString();

    this.saveConnections(connections);

    return { success: true, earnings: newEarnings };
  }

  /**
   * Schedules social posts
   */
  async schedulePost(
    platform: string,
    content: object,
    scheduledTime: Date
  ): Promise<{ success: boolean; postId?: string; error?: string }> {
    await this.simulateDelay();

    const connections = this.getConnections();
    const connection = connections.find(c => c.platform === platform);

    if (!connection) {
      return { success: false, error: 'Platform not found' };
    }

    if (connection.status !== 'connected') {
      return { success: false, error: 'Platform not connected' };
    }

    // Store scheduled post
    const scheduledPosts = this.getScheduledPosts();
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newPost: ScheduledPost = {
      id: postId,
      platform,
      content,
      scheduledTime,
      status: 'pending',
    };

    scheduledPosts.push(newPost);
    localStorage.setItem(this.SCHEDULED_POSTS_KEY, JSON.stringify(scheduledPosts));

    return { success: true, postId };
  }

  /**
   * Gets scheduled posts
   */
  getScheduledPosts(): ScheduledPost[] {
    const stored = localStorage.getItem(this.SCHEDULED_POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Gets available categories for platform
   */
  getPlatformCategories(platform: string): PlatformCategory[] {
    type PlatformKey = keyof typeof this.platformCategories;
    return this.platformCategories[platform as PlatformKey] || [];
  }

  /**
   * Calculates platform fees
   */
  estimateFees(platform: string, price: number): FeeEstimate {
    const feeStructures: Record<string, any> = {
      etsy: {
        listingFee: 0.20,
        transactionFeePercent: 0.065,
        paymentProcessingPercent: 0.03,
        paymentProcessingFixed: 0.25,
      },
      gumroad: {
        listingFee: 0,
        transactionFeePercent: 0.10,
        paymentProcessingPercent: 0,
        paymentProcessingFixed: 0,
      },
      printful: {
        listingFee: 0,
        transactionFeePercent: 0,
        paymentProcessingPercent: 0.029,
        paymentProcessingFixed: 0.30,
      },
      printify: {
        listingFee: 0,
        transactionFeePercent: 0,
        paymentProcessingPercent: 0.029,
        paymentProcessingFixed: 0.30,
      },
      shopify: {
        listingFee: 0,
        transactionFeePercent: 0.02,
        paymentProcessingPercent: 0.029,
        paymentProcessingFixed: 0.30,
      },
    };

    const fees = feeStructures[platform] || {
      listingFee: 0,
      transactionFeePercent: 0.05,
      paymentProcessingPercent: 0.029,
      paymentProcessingFixed: 0.30,
    };

    const listingFee = fees.listingFee;
    const transactionFee = price * fees.transactionFeePercent;
    const paymentProcessingFee = price * fees.paymentProcessingPercent + fees.paymentProcessingFixed;
    const totalFees = listingFee + transactionFee + paymentProcessingFee;
    const netEarnings = price - totalFees;

    return {
      listingFee: parseFloat(listingFee.toFixed(2)),
      transactionFee: parseFloat(transactionFee.toFixed(2)),
      paymentProcessingFee: parseFloat(paymentProcessingFee.toFixed(2)),
      totalFees: parseFloat(totalFees.toFixed(2)),
      netEarnings: parseFloat(netEarnings.toFixed(2)),
    };
  }

  /**
   * Generates Etsy-optimized 13 tags from description
   */
  generateEtsyTags(description: string): string[] {
    const commonKeywords = [
      'digital download',
      'printable',
      'instant download',
      'wall art',
      'home decor',
      'gift',
      'handmade',
      'unique',
      'custom',
      'personalized',
      'vintage',
      'modern',
      'minimalist',
    ];

    // Extract potential keywords from description
    const words = description.toLowerCase().split(/\s+/);
    const keywords = words
      .filter(word => word.length > 3 && word.length < 20)
      .slice(0, 8);

    // Combine with common keywords
    const allTags = [...keywords, ...commonKeywords];

    // Remove duplicates and limit to 13 tags
    const uniqueTags = Array.from(new Set(allTags)).slice(0, 13);

    return uniqueTags;
  }

  /**
   * Generates Instagram hashtags (30 max)
   */
  generateInstagramHashtags(description: string): string[] {
    const baseHashtags = [
      '#art',
      '#design',
      '#creative',
      '#handmade',
      '#digitalart',
      '#artwork',
      '#artist',
      '#instagood',
      '#beautiful',
      '#style',
      '#photography',
      '#photooftheday',
      '#follow',
      '#like',
      '#instadaily',
      '#picoftheday',
      '#fashion',
      '#nature',
      '#love',
      '#inspiration',
    ];

    // Extract keywords from description for custom hashtags
    const words = description.toLowerCase().split(/\s+/);
    const customHashtags = words
      .filter(word => word.length > 4 && word.length < 20)
      .map(word => `#${word.replace(/[^a-z0-9]/g, '')}`)
      .slice(0, 10);

    // Combine and limit to 30
    const allHashtags = [...customHashtags, ...baseHashtags];
    return Array.from(new Set(allHashtags)).slice(0, 30);
  }

  /**
   * Generates Pinterest SEO keywords
   */
  generatePinterestKeywords(description: string): string[] {
    const pinterestKeywords = [
      'DIY',
      'ideas',
      'inspiration',
      'creative',
      'tutorial',
      'how to',
      'tips',
      'guide',
      'design ideas',
      'home decor',
      'crafts',
      'projects',
      'lifestyle',
      'aesthetic',
      'beautiful',
    ];

    // Extract meaningful phrases from description
    const words = description.toLowerCase().split(/\s+/);
    const phrases = [];

    for (let i = 0; i < words.length - 1; i++) {
      const twoWord = `${words[i]} ${words[i + 1]}`;
      if (twoWord.length > 6 && twoWord.length < 25) {
        phrases.push(twoWord);
      }
    }

    // Combine keywords and phrases
    const allKeywords = [...phrases.slice(0, 10), ...pinterestKeywords];
    return Array.from(new Set(allKeywords)).slice(0, 20);
  }

  /**
   * Gets connection by platform
   */
  getConnection(platform: string): PlatformConnection | undefined {
    const connections = this.getConnections();
    return connections.find(c => c.platform === platform);
  }

  /**
   * Gets all connected platforms
   */
  getConnectedPlatforms(): PlatformConnection[] {
    return this.getConnections().filter(c => c.status === 'connected');
  }

  /**
   * Gets total earnings across all platforms
   */
  getTotalEarnings(): number {
    const connections = this.getConnections();
    return connections.reduce((total, conn) => total + conn.stats.totalEarnings, 0);
  }

  /**
   * Gets total sales across all platforms
   */
  getTotalSales(): number {
    const connections = this.getConnections();
    return connections.reduce((total, conn) => total + conn.stats.totalSales, 0);
  }

  /**
   * Gets total listings across all platforms
   */
  getTotalListings(): number {
    const connections = this.getConnections();
    return connections.reduce((total, conn) => total + conn.stats.totalListings, 0);
  }
}

// Export singleton instance
export const platformConnectors = new PlatformConnectorsService();
export default platformConnectors;
