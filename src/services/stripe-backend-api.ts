/**
 * STRIPE BACKEND API ENDPOINTS
 * These endpoints should be implemented on your backend server
 * (Node.js/Express, Next.js API routes, or similar)
 *
 * IMPORTANT: Never expose your Stripe Secret Key on the frontend!
 * These are example endpoints your frontend will call.
 */

/**
 * Backend Implementation Example (Node.js/Express)
 * Save this as: backend/routes/stripe.js
 */

/*
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent (for receiving payments)
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Payout (for withdrawing money to your bank)
router.post('/create-payout', async (req, res) => {
  try {
    const { amount, currency = 'usd', destination = 'default_for_currency' } = req.body;

    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency,
      destination
    });

    res.json({
      id: payout.id,
      status: payout.status,
      arrival_date: payout.arrival_date,
      amount: payout.amount / 100
    });
  } catch (error) {
    console.error('Payout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Balance
router.get('/stripe-balance', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();

    res.json({
      available: balance.available.map(b => ({
        amount: b.amount / 100,
        currency: b.currency
      })),
      pending: balance.pending.map(b => ({
        amount: b.amount / 100,
        currency: b.currency
      }))
    });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Customer (for recurring payments)
router.post('/create-customer', async (req, res) => {
  try {
    const { email, name, metadata = {} } = req.body;

    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });

    res.json({
      id: customer.id,
      email: customer.email
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Subscription (for recurring income)
router.post('/create-subscription', async (req, res) => {
  try {
    const { customerId, priceId, trialDays = 0 } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays > 0 ? trialDays : undefined,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook Handler (receive real-time events from Stripe)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('💰 Payment received:', paymentIntent.amount / 100, paymentIntent.currency);
      // Update your database with the payment
      break;

    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object);
      break;

    case 'customer.subscription.created':
      console.log('🎉 New subscription:', event.data.object);
      break;

    case 'customer.subscription.deleted':
      console.log('👋 Subscription cancelled:', event.data.object);
      break;

    case 'invoice.payment_succeeded':
      console.log('💵 Invoice paid:', event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;
*/

/**
 * Frontend Usage Examples
 */

export class StripeBackendClient {
  private apiUrl: string;

  constructor(apiUrl: string = '') {
    this.apiUrl = apiUrl || process.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  /**
   * Create payment intent for receiving money
   */
  async createPaymentIntent(amount: number, metadata?: any): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    const response = await fetch(`${this.apiUrl}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'usd',
        metadata
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.id
    };
  }

  /**
   * Create payout to your bank account
   */
  async createPayout(amount: number): Promise<any> {
    const response = await fetch(`${this.apiUrl}/create-payout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'usd'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payout');
    }

    return response.json();
  }

  /**
   * Get Stripe account balance
   */
  async getBalance(): Promise<{
    available: { amount: number; currency: string }[];
    pending: { amount: number; currency: string }[];
  }> {
    const response = await fetch(`${this.apiUrl}/stripe-balance`);

    if (!response.ok) {
      throw new Error('Failed to get balance');
    }

    return response.json();
  }

  /**
   * Create a customer for subscriptions
   */
  async createCustomer(email: string, name: string): Promise<{ id: string; email: string }> {
    const response = await fetch(`${this.apiUrl}/create-customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name })
    });

    if (!response.ok) {
      throw new Error('Failed to create customer');
    }

    return response.json();
  }

  /**
   * Create a subscription for recurring income
   */
  async createSubscription(customerId: string, priceId: string, trialDays?: number): Promise<{
    subscriptionId: string;
    clientSecret: string;
  }> {
    const response = await fetch(`${this.apiUrl}/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        priceId,
        trialDays
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    return response.json();
  }
}

export const stripeBackendClient = new StripeBackendClient();

/**
 * DEPLOYMENT CHECKLIST
 *
 * 1. Set up backend server (Node.js/Express or Next.js)
 * 2. Install Stripe SDK: npm install stripe
 * 3. Set environment variables:
 *    - STRIPE_SECRET_KEY (from Stripe Dashboard)
 *    - STRIPE_WEBHOOK_SECRET (from Stripe Webhooks)
 * 4. Deploy backend to:
 *    - Vercel (easiest for Next.js)
 *    - Railway (great for Node.js)
 *    - Render (free tier available)
 *    - Your own VPS
 * 5. Set up Stripe webhook endpoint in Stripe Dashboard
 * 6. Update VITE_API_URL in your frontend .env file
 * 7. Test in Stripe test mode first
 * 8. Go live with real Stripe keys
 */
