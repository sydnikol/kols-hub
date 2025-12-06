/**
 * CASH APP PAY BACKEND ROUTES
 * Handle Cash App Pay payment processing
 *
 * Installation:
 * npm install @square/web-sdk node-fetch
 *
 * Environment variables needed:
 * CASHAPP_CLIENT_ID=your_client_id
 * CASHAPP_CLIENT_SECRET=your_client_secret
 * CASHAPP_ENVIRONMENT=sandbox  (or 'production')
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In production, use the actual Cash App Pay API client
// For now, we'll use fetch for HTTP requests

const CASHAPP_BASE_URL = process.env.CASHAPP_ENVIRONMENT === 'production'
  ? 'https://api.cash.app'
  : 'https://sandbox.api.cash.app';

const CASHAPP_CLIENT_ID = process.env.CASHAPP_CLIENT_ID;
const CASHAPP_CLIENT_SECRET = process.env.CASHAPP_CLIENT_SECRET;

/**
 * Get OAuth access token
 */
async function getAccessToken() {
  try {
    const response = await fetch(`${CASHAPP_BASE_URL}/oauth2/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CASHAPP_CLIENT_ID}:${CASHAPP_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'PAYMENTS_WRITE PAYMENTS_READ'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Cash App access token:', error);
    throw error;
  }
}

/**
 * Create a payment request
 */
router.post('/create-payment', async (req, res) => {
  try {
    if (!CASHAPP_CLIENT_ID || !CASHAPP_CLIENT_SECRET) {
      return res.status(500).json({
        error: 'Cash App Pay not configured. Set CASHAPP_CLIENT_ID and CASHAPP_CLIENT_SECRET.'
      });
    }

    const { amount, reference_id, redirect_url, customer_request_id } = req.body;

    const accessToken = await getAccessToken();

    // Create payment request
    const response = await fetch(`${CASHAPP_BASE_URL}/pay/v1/payment-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        idempotency_key: customer_request_id || crypto.randomUUID(),
        amount,
        reference_id,
        redirect_url,
        actions: {
          payment_action: {
            type: 'ONE_TIME_PAYMENT',
            scope_id: process.env.CASHAPP_LOCATION_ID
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Cash App Pay API error:', error);
      return res.status(response.status).json({ error: 'Failed to create payment request' });
    }

    const data = await response.json();

    console.log(`✅ Cash App payment created: ${data.id}`);

    res.json({
      id: data.id,
      status: data.status,
      redirect_url: data.redirect_url,
      created_at: data.created_at
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get payment status
 */
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const accessToken = await getAccessToken();

    const response = await fetch(`${CASHAPP_BASE_URL}/pay/v1/payment-requests/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Payment not found' });
    }

    const data = await response.json();

    res.json({
      id: data.id,
      status: data.status,
      amount: data.amount,
      customer_id: data.customer_id,
      created_at: data.created_at,
      approved_at: data.approved_at,
      completed_at: data.completed_at
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create refund
 */
router.post('/refund', async (req, res) => {
  try {
    const { payment_id, amount } = req.body;
    const accessToken = await getAccessToken();

    const response = await fetch(`${CASHAPP_BASE_URL}/pay/v1/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        payment_id,
        amount,
        reason: 'CUSTOMER_REQUEST',
        idempotency_key: crypto.randomUUID()
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Refund failed' });
    }

    const data = await response.json();

    console.log(`✅ Cash App refund created: ${data.id}`);

    res.json({
      id: data.id,
      status: data.status,
      amount: data.amount
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Webhook handler for Cash App Pay events
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const event = req.body;

    // Verify webhook signature
    const signature = req.headers['x-cashapp-signature'];
    const webhookSecret = process.env.CASHAPP_WEBHOOK_SECRET;

    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    console.log(`📨 Cash App webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment.approved':
        console.log(`✅ Payment approved: ${event.data.id}`);
        // TODO: Update your database, fulfill order
        break;

      case 'payment.completed':
        console.log(`💰 Payment completed: ${event.data.id}`);
        // TODO: Mark order as paid
        break;

      case 'payment.failed':
        console.log(`❌ Payment failed: ${event.data.id}`);
        // TODO: Notify customer
        break;

      case 'refund.completed':
        console.log(`💵 Refund completed: ${event.data.id}`);
        // TODO: Update order status
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Test endpoint
 */
router.get('/test', (req, res) => {
  const isConfigured = !!(CASHAPP_CLIENT_ID && CASHAPP_CLIENT_SECRET);
  res.json({
    configured: isConfigured,
    environment: process.env.CASHAPP_ENVIRONMENT || 'sandbox',
    baseUrl: CASHAPP_BASE_URL
  });
});

module.exports = router;
