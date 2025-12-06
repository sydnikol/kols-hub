/**
 * VENMO API INTEGRATION
 * Accept payments through Venmo
 *
 * Setup:
 * 1. Sign up for PayPal Business: https://www.paypal.com/business
 * 2. Enable Venmo in PayPal settings
 * 3. Get your Client ID from: https://developer.paypal.com/dashboard/
 * 4. Venmo uses PayPal's API infrastructure
 */

export interface VenmoConfig {
  clientId: string;
  environment: 'sandbox' | 'production';
  merchantId?: string;
}

export interface VenmoPaymentRequest {
  amount: number;
  currency: 'USD';
  description: string;
  referenceId?: string;
}

export interface VenmoPayment {
  id: string;
  status: 'CREATED' | 'APPROVED' | 'COMPLETED' | 'FAILED';
  amount: number;
  payer: {
    name?: string;
    email?: string;
    venmoAccount?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

class VenmoService {
  private config: VenmoConfig | null = null;
  private paypal: any = null;

  /**
   * Initialize Venmo (uses PayPal SDK)
   */
  async initialize(config: VenmoConfig) {
    this.config = config;

    // Load PayPal SDK with Venmo enabled
    await this.loadPayPalSDK();

    console.log('✅ Venmo initialized (via PayPal)');
  }

  /**
   * Load PayPal SDK with Venmo enabled
   */
  private async loadPayPalSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        this.paypal = (window as any).paypal;
        resolve();
        return;
      }

      const script = document.createElement('script');
      const clientId = this.config!.clientId;
      const currency = 'USD';

      // Enable Venmo in the SDK
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&enable-funding=venmo`;

      script.onload = () => {
        this.paypal = (window as any).paypal;
        resolve();
      };

      script.onerror = () => reject(new Error('Failed to load PayPal/Venmo SDK'));

      document.head.appendChild(script);
    });
  }

  /**
   * Create Venmo payment button
   */
  createVenmoButton(
    containerId: string,
    amount: number,
    description: string,
    onSuccess: (payment: VenmoPayment) => void,
    onError?: (error: any) => void
  ) {
    if (!this.paypal) {
      throw new Error('Venmo/PayPal not initialized');
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }

    // Create PayPal button with Venmo enabled
    this.paypal.Buttons({
      // Funding sources - Venmo will show as an option
      fundingSource: this.paypal.FUNDING.VENMO,

      style: {
        label: 'pay',
        color: 'blue', // Venmo blue
        shape: 'rect',
        height: 48
      },

      createOrder: async () => {
        try {
          // Call your backend to create order
          const response = await fetch('/api/venmo/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: amount.toFixed(2),
              currency: 'USD',
              description
            })
          });

          const data = await response.json();
          return data.id;
        } catch (error) {
          console.error('Failed to create Venmo order:', error);
          throw error;
        }
      },

      onApprove: async (data: any) => {
        try {
          // Capture the payment
          const response = await fetch('/api/venmo/capture-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: data.orderID
            })
          });

          const captureData = await response.json();

          const payment: VenmoPayment = {
            id: captureData.id,
            status: 'COMPLETED',
            amount: amount,
            payer: {
              name: captureData.payer?.name?.given_name + ' ' + captureData.payer?.name?.surname,
              email: captureData.payer?.email_address,
              venmoAccount: captureData.payer?.venmo_account
            },
            createdAt: new Date(captureData.create_time),
            updatedAt: new Date(captureData.update_time)
          };

          console.log('✅ Venmo payment completed:', payment.id);
          onSuccess(payment);
        } catch (error) {
          console.error('Failed to capture Venmo payment:', error);
          if (onError) onError(error);
        }
      },

      onError: (err: any) => {
        console.error('Venmo payment error:', err);
        if (onError) onError(err);
      }
    }).render(`#${containerId}`);
  }

  /**
   * Create Venmo payment link (for mobile/QR code)
   */
  async createPaymentLink(request: VenmoPaymentRequest): Promise<string> {
    try {
      // Call backend to create PayPal order
      const response = await fetch('/api/venmo/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: request.amount.toFixed(2),
          currency: request.currency,
          description: request.description,
          referenceId: request.referenceId
        })
      });

      const data = await response.json();

      // Get approval URL (works for Venmo mobile app)
      const approvalUrl = data.links.find((link: any) => link.rel === 'approve')?.href;

      return approvalUrl;
    } catch (error) {
      console.error('Failed to create Venmo payment link:', error);
      throw error;
    }
  }

  /**
   * Get payment details
   */
  async getPayment(orderId: string): Promise<VenmoPayment | null> {
    try {
      const response = await fetch(`/api/venmo/order/${orderId}`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      return {
        id: data.id,
        status: data.status,
        amount: parseFloat(data.purchase_units[0].amount.value),
        payer: {
          name: data.payer?.name?.given_name + ' ' + data.payer?.name?.surname,
          email: data.payer?.email_address,
          venmoAccount: data.payer?.venmo_account
        },
        createdAt: new Date(data.create_time),
        updatedAt: new Date(data.update_time)
      };
    } catch (error) {
      console.error('Failed to get payment:', error);
      return null;
    }
  }

  /**
   * Refund a Venmo payment
   */
  async refundPayment(captureId: string, amount?: number): Promise<{ refundId: string }> {
    try {
      const response = await fetch('/api/venmo/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          captureId,
          amount: amount ? amount.toFixed(2) : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Refund failed');
      }

      const data = await response.json();
      return { refundId: data.id };
    } catch (error) {
      console.error('Venmo refund failed:', error);
      throw error;
    }
  }

  /**
   * Check if configured
   */
  isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * Load config from localStorage
   */
  static loadConfig(): VenmoConfig | null {
    const clientId = localStorage.getItem('venmo_client_id');
    const environment = localStorage.getItem('venmo_environment') as 'sandbox' | 'production' || 'sandbox';

    if (clientId) {
      return {
        clientId,
        environment
      };
    }

    return null;
  }

  /**
   * Save config to localStorage
   */
  static saveConfig(config: VenmoConfig) {
    localStorage.setItem('venmo_client_id', config.clientId);
    localStorage.setItem('venmo_environment', config.environment);
  }
}

export const venmoService = new VenmoService();

/**
 * React Hook for Venmo
 */
export function useVenmo() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const config = VenmoService.loadConfig();
    if (config) {
      venmoService.initialize(config).then(() => {
        setIsInitialized(true);
      });
    }
  }, []);

  const createButton = (
    containerId: string,
    amount: number,
    description: string,
    onSuccess: (payment: VenmoPayment) => void,
    onError?: (error: any) => void
  ) => {
    if (!isInitialized) {
      throw new Error('Venmo not initialized');
    }
    venmoService.createVenmoButton(containerId, amount, description, onSuccess, onError);
  };

  const createPaymentLink = async (request: VenmoPaymentRequest) => {
    setIsLoading(true);
    try {
      return await venmoService.createPaymentLink(request);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInitialized,
    isLoading,
    createButton,
    createPaymentLink,
    getPayment: venmoService.getPayment.bind(venmoService),
    refundPayment: venmoService.refundPayment.bind(venmoService)
  };
}

// Import React for the hook
import React from 'react';
