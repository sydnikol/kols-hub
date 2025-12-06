/**
 * CASH APP PAY INTEGRATION
 * Accept payments directly through Cash App Pay
 *
 * Setup:
 * 1. Sign up at: https://cash.app/business
 * 2. Apply for Cash App Pay: https://developers.cash.app/
 * 3. Get your credentials from Developer Dashboard
 * 4. Test in sandbox: https://developers.cash.app/cash-app-pay-partner-api/guides/technical-guides/sandbox/developer-sandbox
 */

export interface CashAppPayConfig {
  clientId: string;
  locationId: string; // Your business location ID
  environment: 'sandbox' | 'production';
  redirectUrl?: string;
}

export interface CashAppPayRequest {
  amount: number; // In dollars (e.g., 29.99)
  currency: 'USD';
  referenceId?: string; // Your order/transaction ID
  customerProfile?: {
    email?: string;
    phone?: string;
    name?: string;
  };
}

export interface CashAppPayment {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  customerId: string;
  createdAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}

class CashAppPayService {
  private config: CashAppPayConfig | null = null;
  private baseUrl: string = '';

  /**
   * Initialize Cash App Pay
   */
  async initialize(config: CashAppPayConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'sandbox'
      ? 'https://sandbox.api.cash.app'
      : 'https://api.cash.app';

    // Load Cash App Pay SDK
    await this.loadSDK();

    console.log('✅ Cash App Pay initialized');
  }

  /**
   * Load Cash App Pay SDK
   */
  private async loadSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('cashapp-sdk')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'cashapp-sdk';
      script.src = 'https://sandbox.api.cash.app/pay-button/v1/sdk.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Cash App Pay SDK'));
      document.head.appendChild(script);
    });
  }

  /**
   * Create a payment request
   */
  async createPayment(request: CashAppPayRequest): Promise<{ paymentId: string; redirectUrl: string }> {
    if (!this.config) {
      throw new Error('Cash App Pay not initialized');
    }

    try {
      // Call your backend to create payment
      const response = await fetch('/api/cashapp/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: {
            amount: Math.round(request.amount * 100), // Convert to cents
            currency: request.currency
          },
          reference_id: request.referenceId || `ORDER-${Date.now()}`,
          redirect_url: this.config.redirectUrl || window.location.href,
          customer_request_id: crypto.randomUUID()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Cash App payment');
      }

      const data = await response.json();

      return {
        paymentId: data.id,
        redirectUrl: data.redirect_url
      };
    } catch (error: any) {
      console.error('Cash App Pay error:', error);
      throw error;
    }
  }

  /**
   * Redirect to Cash App for payment
   */
  async pay(request: CashAppPayRequest): Promise<void> {
    const { redirectUrl } = await this.createPayment(request);
    window.location.href = redirectUrl;
  }

  /**
   * Create Cash App Pay button
   */
  createButton(containerId: string, amount: number, onSuccess: (paymentId: string) => void) {
    if (!this.config) {
      throw new Error('Cash App Pay not initialized');
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }

    // Create button using Cash App Pay SDK
    const button = document.createElement('cash-app-pay-button');
    button.setAttribute('data-client-id', this.config.clientId);
    button.setAttribute('data-amount', (amount * 100).toString());
    button.setAttribute('data-currency', 'USD');

    button.addEventListener('success', (event: any) => {
      onSuccess(event.detail.paymentId);
    });

    container.appendChild(button);
  }

  /**
   * Get payment status
   */
  async getPayment(paymentId: string): Promise<CashAppPayment> {
    try {
      const response = await fetch(`/api/cashapp/payment/${paymentId}`);

      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      const data = await response.json();

      return {
        id: data.id,
        status: data.status,
        amount: data.amount.amount / 100,
        currency: data.amount.currency,
        customerId: data.customer_id,
        createdAt: new Date(data.created_at),
        approvedAt: data.approved_at ? new Date(data.approved_at) : undefined,
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined
      };
    } catch (error) {
      console.error('Failed to get payment:', error);
      throw error;
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<{ refundId: string }> {
    try {
      const response = await fetch('/api/cashapp/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          amount: amount ? { amount: Math.round(amount * 100), currency: 'USD' } : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refund payment');
      }

      const data = await response.json();
      return { refundId: data.id };
    } catch (error) {
      console.error('Refund failed:', error);
      throw error;
    }
  }

  /**
   * Check if Cash App Pay is configured
   */
  isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * Get configuration from localStorage
   */
  static loadConfig(): CashAppPayConfig | null {
    const clientId = localStorage.getItem('cashapp_client_id');
    const locationId = localStorage.getItem('cashapp_location_id');
    const environment = localStorage.getItem('cashapp_environment') as 'sandbox' | 'production' || 'sandbox';

    if (clientId && locationId) {
      return {
        clientId,
        locationId,
        environment,
        redirectUrl: window.location.origin + '/payment/success'
      };
    }

    return null;
  }

  /**
   * Save configuration to localStorage
   */
  static saveConfig(config: CashAppPayConfig) {
    localStorage.setItem('cashapp_client_id', config.clientId);
    localStorage.setItem('cashapp_location_id', config.locationId);
    localStorage.setItem('cashapp_environment', config.environment);
  }
}

export const cashAppPayService = new CashAppPayService();

/**
 * React Hook for Cash App Pay
 */
export function useCashAppPay() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const config = CashAppPayService.loadConfig();
    if (config) {
      cashAppPayService.initialize(config).then(() => {
        setIsInitialized(true);
      });
    }
  }, []);

  const pay = async (amount: number, referenceId?: string) => {
    setIsLoading(true);
    try {
      await cashAppPayService.pay({
        amount,
        currency: 'USD',
        referenceId
      });
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createButton = (containerId: string, amount: number, onSuccess: (paymentId: string) => void) => {
    if (!isInitialized) {
      throw new Error('Cash App Pay not initialized');
    }
    cashAppPayService.createButton(containerId, amount, onSuccess);
  };

  return {
    isInitialized,
    isLoading,
    pay,
    createButton,
    getPayment: cashAppPayService.getPayment.bind(cashAppPayService),
    refundPayment: cashAppPayService.refundPayment.bind(cashAppPayService)
  };
}

// Import React for the hook
import React from 'react';
