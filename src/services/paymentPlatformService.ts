/**
 * Payment Platform Service
 * Manages Cash App, Venmo, and PayPal integration
 */

import { db } from './db';

export interface PaymentPlatform {
  id?: number;
  platform: 'cashapp' | 'venmo' | 'paypal';
  username: string;
  displayName?: string;
  balance?: number;
  lastSynced?: Date;
  isActive: boolean;
}

export interface PaymentTransaction {
  id?: number;
  platform: 'cashapp' | 'venmo' | 'paypal';
  type: 'received' | 'sent';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  fromUser?: string;
  toUser?: string;
}

export interface PaymentLink {
  id?: number;
  platform: 'cashapp' | 'venmo' | 'paypal';
  url: string;
  qrCode?: string;
  amount?: number;
  description?: string;
  createdAt: Date;
}

export class PaymentPlatformService {
  /**
   * Get deep link URL for mobile apps
   */
  static getDeepLink(platform: 'cashapp' | 'venmo' | 'paypal', username: string, amount?: number): string {
    switch (platform) {
      case 'cashapp':
        // Cash App: cashapp://cash.app/$username or with amount
        if (amount) {
          return `cashapp://cash.app/$${username}?amount=${amount}`;
        }
        return `cashapp://cash.app/$${username}`;

      case 'venmo':
        // Venmo: venmo://paycharge?txn=pay&recipients=username&amount=10&note=description
        if (amount) {
          return `venmo://paycharge?txn=charge&recipients=${username}&amount=${amount}`;
        }
        return `venmo://users/${username}`;

      case 'paypal':
        // PayPal: paypal://paypalme/username or with amount
        if (amount) {
          return `paypal://paypalme/${username}/${amount}`;
        }
        return `paypal://paypalme/${username}`;

      default:
        return '';
    }
  }

  /**
   * Get web URL fallback
   */
  static getWebLink(platform: 'cashapp' | 'venmo' | 'paypal', username: string, amount?: number): string {
    switch (platform) {
      case 'cashapp':
        if (amount) {
          return `https://cash.app/$${username}/${amount}`;
        }
        return `https://cash.app/$${username}`;

      case 'venmo':
        if (amount) {
          return `https://venmo.com/${username}?txn=charge&amount=${amount}`;
        }
        return `https://venmo.com/${username}`;

      case 'paypal':
        if (amount) {
          return `https://paypal.me/${username}/${amount}`;
        }
        return `https://paypal.me/${username}`;

      default:
        return '';
    }
  }

  /**
   * Generate QR code URL for payment
   */
  static getQRCodeURL(platform: 'cashapp' | 'venmo' | 'paypal', username: string, amount?: number): string {
    const webLink = this.getWebLink(platform, username, amount);
    // Using a QR code API service
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(webLink)}`;
  }

  /**
   * Open payment platform app
   */
  static openPlatformApp(platform: 'cashapp' | 'venmo' | 'paypal', username: string, amount?: number): void {
    const deepLink = this.getDeepLink(platform, username, amount);
    const webLink = this.getWebLink(platform, username, amount);

    // Try to open deep link (mobile app)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);

    // Fallback to web link after delay
    setTimeout(() => {
      document.body.removeChild(iframe);
      window.open(webLink, '_blank');
    }, 1500);
  }

  /**
   * Save payment platform credentials
   */
  static async savePlatform(platform: PaymentPlatform): Promise<void> {
    const pref = await db.preferences.where('key').equals(`payment_${platform.platform}`).first();

    if (pref) {
      await db.preferences.update(pref.id!, {
        value: platform,
        updatedAt: new Date()
      });
    } else {
      await db.preferences.add({
        key: `payment_${platform.platform}`,
        value: platform,
        updatedAt: new Date()
      });
    }
  }

  /**
   * Get payment platform credentials
   */
  static async getPlatform(platform: 'cashapp' | 'venmo' | 'paypal'): Promise<PaymentPlatform | null> {
    const pref = await db.preferences.where('key').equals(`payment_${platform}`).first();
    return pref?.value || null;
  }

  /**
   * Get all configured platforms
   */
  static async getAllPlatforms(): Promise<PaymentPlatform[]> {
    const platforms: PaymentPlatform[] = [];

    for (const platformName of ['cashapp', 'venmo', 'paypal'] as const) {
      const platform = await this.getPlatform(platformName);
      if (platform) {
        platforms.push(platform);
      }
    }

    return platforms;
  }

  /**
   * Get platform branding colors
   */
  static getPlatformColors(platform: 'cashapp' | 'venmo' | 'paypal'): {
    primary: string;
    secondary: string;
    gradient: string;
  } {
    switch (platform) {
      case 'cashapp':
        return {
          primary: '#00D632',
          secondary: '#00A826',
          gradient: 'from-green-500 to-green-600'
        };

      case 'venmo':
        return {
          primary: '#3D95CE',
          secondary: '#2B7AAD',
          gradient: 'from-blue-500 to-blue-600'
        };

      case 'paypal':
        return {
          primary: '#0070BA',
          secondary: '#003087',
          gradient: 'from-blue-600 to-blue-700'
        };

      default:
        return {
          primary: '#000000',
          secondary: '#333333',
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  }

  /**
   * Get platform icon/logo URL
   */
  static getPlatformLogo(platform: 'cashapp' | 'venmo' | 'paypal'): string {
    switch (platform) {
      case 'cashapp':
        return 'https://cdn.worldvectorlogo.com/logos/cash-app.svg';
      case 'venmo':
        return 'https://cdn.worldvectorlogo.com/logos/venmo-2.svg';
      case 'paypal':
        return 'https://cdn.worldvectorlogo.com/logos/paypal-2.svg';
      default:
        return '';
    }
  }

  /**
   * Create shareable payment link
   */
  static async createPaymentLink(
    platform: 'cashapp' | 'venmo' | 'paypal',
    username: string,
    amount?: number,
    description?: string
  ): Promise<PaymentLink> {
    const url = this.getWebLink(platform, username, amount);
    const qrCode = this.getQRCodeURL(platform, username, amount);

    const link: PaymentLink = {
      platform,
      url,
      qrCode,
      amount,
      description,
      createdAt: new Date()
    };

    return link;
  }

  /**
   * Share payment link
   */
  static async sharePaymentLink(link: PaymentLink): Promise<void> {
    const shareData = {
      title: `Pay me on ${link.platform.toUpperCase()}`,
      text: link.description || `Send me money on ${link.platform}`,
      url: link.url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(link.url);
      alert('Payment link copied to clipboard!');
    }
  }

  /**
   * Mock: Get account balance (would need API integration)
   */
  static async getBalance(platform: 'cashapp' | 'venmo' | 'paypal'): Promise<number> {
    // In production, this would call actual APIs
    // For now, return mock data
    const savedPlatform = await this.getPlatform(platform);
    return savedPlatform?.balance || 0;
  }

  /**
   * Mock: Get recent transactions (would need API integration)
   */
  static async getRecentTransactions(platform: 'cashapp' | 'venmo' | 'paypal'): Promise<PaymentTransaction[]> {
    // In production, this would call actual APIs
    // For now, return mock data
    return [
      {
        platform,
        type: 'received',
        amount: 50.00,
        description: 'Freelance payment',
        timestamp: new Date(Date.now() - 86400000),
        status: 'completed',
        fromUser: 'client123'
      },
      {
        platform,
        type: 'received',
        amount: 25.00,
        description: 'Content monetization',
        timestamp: new Date(Date.now() - 172800000),
        status: 'completed',
        fromUser: 'platform_payout'
      }
    ];
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Detect if user is on mobile
   */
  static isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
}

export default PaymentPlatformService;
