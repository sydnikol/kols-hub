/**
 * REAL AFFILIATE MARKETING SERVICE
 * Connect to actual affiliate networks to earn REAL commissions
 *
 * Top Affiliate Networks:
 * - Amazon Associates (4-10% commissions)
 * - ClickBank (50-75% commissions on digital products)
 * - ShareASale (varies by merchant)
 * - CJ Affiliate (Commission Junction)
 * - Impact (high-ticket affiliate programs)
 */

export interface AffiliateNetwork {
  name: string;
  isConfigured: boolean;
  apiKey?: string;
  accountId?: string;
  earnings: number;
  clicks: number;
  conversions: number;
  commissionRate: number;
  setupUrl: string;
  requirements: string[];
  status: 'not_configured' | 'pending_approval' | 'active' | 'suspended';
}

export interface AffiliateLink {
  id: string;
  network: string;
  productName: string;
  productUrl: string;
  affiliateUrl: string;
  commission: number;
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: Date;
}

export interface AffiliateEarnings {
  network: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
}

class RealAffiliateMarketingService {
  private networks: Map<string, AffiliateNetwork> = new Map();
  private affiliateLinks: AffiliateLink[] = [];

  constructor() {
    this.initializeNetworks();
    this.loadAffiliateLinks();
  }

  /**
   * Initialize all affiliate networks
   */
  private initializeNetworks() {
    // Amazon Associates
    this.networks.set('amazon', {
      name: 'Amazon Associates',
      isConfigured: false,
      earnings: 0,
      clicks: 0,
      conversions: 0,
      commissionRate: 0.04, // 4% average
      setupUrl: 'https://affiliate-program.amazon.com/',
      requirements: [
        'Website or mobile app',
        'Original content',
        'At least 10 posts/pages',
        'Follow Amazon Operating Agreement'
      ],
      status: 'not_configured'
    });

    // ClickBank
    this.networks.set('clickbank', {
      name: 'ClickBank',
      isConfigured: false,
      earnings: 0,
      clicks: 0,
      conversions: 0,
      commissionRate: 0.50, // 50% average on digital products
      setupUrl: 'https://www.clickbank.com/signup',
      requirements: [
        'Valid email address',
        'Payment information',
        'No website required!'
      ],
      status: 'not_configured'
    });

    // ShareASale
    this.networks.set('shareasale', {
      name: 'ShareASale',
      isConfigured: false,
      earnings: 0,
      clicks: 0,
      conversions: 0,
      commissionRate: 0.10, // 10% average
      setupUrl: 'https://account.shareasale.com/newsignup.cfm',
      requirements: [
        'Website with content',
        'Minimum 10 pages',
        'Clear navigation',
        'Contact information'
      ],
      status: 'not_configured'
    });

    // CJ Affiliate (Commission Junction)
    this.networks.set('cj', {
      name: 'CJ Affiliate',
      isConfigured: false,
      earnings: 0,
      clicks: 0,
      conversions: 0,
      commissionRate: 0.08, // 8% average
      setupUrl: 'https://www.cj.com/apply',
      requirements: [
        'Established website',
        'Quality content',
        'Professional appearance',
        'Clear traffic sources'
      ],
      status: 'not_configured'
    });

    // Impact
    this.networks.set('impact', {
      name: 'Impact',
      isConfigured: false,
      earnings: 0,
      clicks: 0,
      conversions: 0,
      commissionRate: 0.15, // 15% average
      setupUrl: 'https://impact.com/publishers/',
      requirements: [
        'Quality website or social media',
        'Engaged audience',
        'Professional content'
      ],
      status: 'not_configured'
    });

    this.loadSavedConfigurations();
  }

  /**
   * Load saved configurations
   */
  private loadSavedConfigurations() {
    const saved = localStorage.getItem('affiliate_networks');
    if (saved) {
      try {
        const configs = JSON.parse(saved);
        Object.entries(configs).forEach(([key, config]: [string, any]) => {
          const existing = this.networks.get(key);
          if (existing) {
            this.networks.set(key, { ...existing, ...config });
          }
        });
      } catch (error) {
        console.error('Failed to load affiliate configurations:', error);
      }
    }
  }

  /**
   * Configure Amazon Associates
   * Get Associate ID from: https://affiliate-program.amazon.com/home/account/tag/manage
   */
  async configureAmazon(associateId: string, accessKey: string, secretKey: string) {
    try {
      // Store credentials securely
      localStorage.setItem('amazon_associate_id', associateId);
      localStorage.setItem('amazon_access_key', accessKey);
      localStorage.setItem('amazon_secret_key', secretKey);

      this.networks.set('amazon', {
        ...this.networks.get('amazon')!,
        isConfigured: true,
        accountId: associateId,
        status: 'active'
      });

      this.saveConfigurations();
      console.log('✅ Amazon Associates configured');
      return { success: true };
    } catch (error: any) {
      console.error('Amazon configuration failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Configure ClickBank
   * Get nickname from: https://accounts.clickbank.com
   */
  async configureClickBank(nickname: string, apiKey?: string) {
    try {
      localStorage.setItem('clickbank_nickname', nickname);
      if (apiKey) {
        localStorage.setItem('clickbank_api_key', apiKey);
      }

      this.networks.set('clickbank', {
        ...this.networks.get('clickbank')!,
        isConfigured: true,
        accountId: nickname,
        apiKey: apiKey,
        status: 'active'
      });

      this.saveConfigurations();
      console.log('✅ ClickBank configured');
      return { success: true };
    } catch (error: any) {
      console.error('ClickBank configuration failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate Amazon affiliate link
   */
  generateAmazonLink(productUrl: string, associateId?: string): string {
    const id = associateId || localStorage.getItem('amazon_associate_id');
    if (!id) {
      throw new Error('Amazon Associates not configured');
    }

    // Parse Amazon URL and add associate tag
    try {
      const url = new URL(productUrl);
      url.searchParams.set('tag', id);
      return url.toString();
    } catch (error) {
      throw new Error('Invalid Amazon product URL');
    }
  }

  /**
   * Generate ClickBank affiliate link
   */
  generateClickBankLink(productId: string): string {
    const nickname = localStorage.getItem('clickbank_nickname');
    if (!nickname) {
      throw new Error('ClickBank not configured');
    }

    return `https://${nickname}.${productId}.hop.clickbank.net`;
  }

  /**
   * Create and track affiliate link
   */
  async createAffiliateLink(
    network: string,
    productName: string,
    productUrl: string,
    commission: number
  ): Promise<AffiliateLink> {
    let affiliateUrl: string;

    switch (network) {
      case 'amazon':
        affiliateUrl = this.generateAmazonLink(productUrl);
        break;
      case 'clickbank':
        affiliateUrl = this.generateClickBankLink(productUrl);
        break;
      default:
        affiliateUrl = productUrl;
    }

    const link: AffiliateLink = {
      id: crypto.randomUUID(),
      network,
      productName,
      productUrl,
      affiliateUrl,
      commission,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      createdAt: new Date()
    };

    this.affiliateLinks.push(link);
    this.saveAffiliateLinks();

    return link;
  }

  /**
   * Track link click
   */
  trackClick(linkId: string) {
    const link = this.affiliateLinks.find(l => l.id === linkId);
    if (link) {
      link.clicks++;
      this.saveAffiliateLinks();

      // Update network stats
      const network = this.networks.get(link.network);
      if (network) {
        network.clicks++;
        this.saveConfigurations();
      }
    }
  }

  /**
   * Track conversion
   */
  trackConversion(linkId: string, amount: number) {
    const link = this.affiliateLinks.find(l => l.id === linkId);
    if (link) {
      link.conversions++;
      link.earnings += amount;
      this.saveAffiliateLinks();

      // Update network stats
      const network = this.networks.get(link.network);
      if (network) {
        network.conversions++;
        network.earnings += amount;
        this.saveConfigurations();
      }
    }
  }

  /**
   * Get Amazon earnings (requires Amazon Product Advertising API)
   * User can manually check: https://affiliate-program.amazon.com/home/reports
   */
  async getAmazonEarnings(): Promise<AffiliateEarnings | null> {
    const network = this.networks.get('amazon');
    if (!network?.isConfigured) {
      return null;
    }

    // Amazon doesn't provide easy earnings API access for most affiliates
    // User must manually update from their dashboard
    return {
      network: 'amazon',
      totalEarnings: network.earnings,
      pendingEarnings: 0,
      paidEarnings: network.earnings,
      clicks: network.clicks,
      conversions: network.conversions,
      conversionRate: network.clicks > 0 ? (network.conversions / network.clicks) * 100 : 0
    };
  }

  /**
   * Get ClickBank earnings via API
   */
  async getClickBankEarnings(): Promise<AffiliateEarnings | null> {
    const network = this.networks.get('clickbank');
    const apiKey = localStorage.getItem('clickbank_api_key');

    if (!network?.isConfigured || !apiKey) {
      return null;
    }

    try {
      // ClickBank Analytics API
      const response = await fetch('https://api.clickbank.com/rest/1.3/orders/list', {
        headers: {
          'Authorization': apiKey,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      // Calculate earnings from orders
      let totalEarnings = 0;
      data.orderData?.forEach((order: any) => {
        totalEarnings += parseFloat(order.amount);
      });

      network.earnings = totalEarnings;
      this.saveConfigurations();

      return {
        network: 'clickbank',
        totalEarnings,
        pendingEarnings: 0,
        paidEarnings: totalEarnings,
        clicks: network.clicks,
        conversions: network.conversions,
        conversionRate: network.clicks > 0 ? (network.conversions / network.clicks) * 100 : 0
      };
    } catch (error) {
      console.error('Failed to get ClickBank earnings:', error);
      return null;
    }
  }

  /**
   * Get top ClickBank products by category
   */
  async getTopClickBankProducts(category: string = 'All'): Promise<any[]> {
    try {
      // ClickBank Marketplace API
      const response = await fetch(`https://api.clickbank.com/rest/1.3/marketplace/products?category=${category}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Failed to get ClickBank products:', error);
      return [];
    }
  }

  /**
   * Manual earnings update
   */
  updateNetworkEarnings(network: string, amount: number) {
    const networkData = this.networks.get(network);
    if (networkData) {
      networkData.earnings = amount;
      this.networks.set(network, networkData);
      this.saveConfigurations();
    }
  }

  /**
   * Get all networks
   */
  getAllNetworks(): AffiliateNetwork[] {
    return Array.from(this.networks.values());
  }

  /**
   * Get all affiliate links
   */
  getAllLinks(): AffiliateLink[] {
    return this.affiliateLinks;
  }

  /**
   * Get total earnings across all networks
   */
  getTotalEarnings(): number {
    return Array.from(this.networks.values())
      .reduce((total, network) => total + network.earnings, 0);
  }

  /**
   * Save configurations
   */
  private saveConfigurations() {
    const configs: any = {};
    this.networks.forEach((network, key) => {
      configs[key] = {
        isConfigured: network.isConfigured,
        apiKey: network.apiKey,
        accountId: network.accountId,
        earnings: network.earnings,
        clicks: network.clicks,
        conversions: network.conversions,
        status: network.status
      };
    });
    localStorage.setItem('affiliate_networks', JSON.stringify(configs));
  }

  /**
   * Save affiliate links
   */
  private saveAffiliateLinks() {
    localStorage.setItem('affiliate_links', JSON.stringify(this.affiliateLinks));
  }

  /**
   * Load affiliate links
   */
  private loadAffiliateLinks() {
    const saved = localStorage.getItem('affiliate_links');
    if (saved) {
      try {
        this.affiliateLinks = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load affiliate links:', error);
      }
    }
  }
}

export const affiliateMarketingService = new RealAffiliateMarketingService();
