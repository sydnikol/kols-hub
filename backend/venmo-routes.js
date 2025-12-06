/**
 * VENMO/PAYPAL BACKEND ROUTES
 * Handle Venmo payments via PayPal/Braintree
 *
 * Installation:
 * npm install @paypal/checkout-server-sdk braintree
 *
 * Environment variables:
 * PAYPAL_CLIENT_ID=your_paypal_client_id
 * PAYPAL_CLIENT_SECRET=your_paypal_secret
 * PAYPAL_ENVIRONMENT=sandbox (or 'production')
 */

const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup
function getPayPalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.PAYPAL_ENVIRONMENT === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(getPayPalEnvironment());
}

/**
 * Create PayPal/Venmo order
 */
router.post('/create-order', async (req, res) => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID) {
      return res.status(500).json({
        error: 'PayPal not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.'
      });
    }

    const { amount, currency = 'USD', description, referenceId } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: referenceId || `ORDER-${Date.now()}`,
        description: description || 'Purchase',
        amount: {
          currency_code: currency,
          value: amount
        }
      }],
      payment_source: {
        venmo: {
          experience_context: {
            shipping_preference: 'NO_SHIPPING'
          }
        }
      }
    });

    const client = getPayPalClient();
    const order = await client.execute(request);

    console.log(`✅ Venmo/PayPal order created: ${order.result.id}`);

    res.json({
      id: order.result.id,
      status: order.result.status,
      links: order.result.links
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Capture PayPal/Venmo order
 */
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const client = getPayPalClient();
    const capture = await client.execute(request);

    console.log(`💰 Venmo/PayPal payment captured: ${capture.result.id}`);

    // Extract payment details
    const captureData = capture.result.purchase_units[0].payments.captures[0];

    res.json({
      id: capture.result.id,
      status: capture.result.status,
      payer: capture.result.payer,
      purchase_units: capture.result.purchase_units,
      create_time: capture.result.create_time,
      update_time: capture.result.update_time,
      capture_id: captureData.id,
      amount: captureData.amount.value
    });
  } catch (error) {
    console.error('Capture order error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get order details
 */
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const request = new paypal.orders.OrdersGetRequest(orderId);
    const client = getPayPalClient();
    const order = await client.execute(request);

    res.json(order.result);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(404).json({ error: 'Order not found' });
  }
});

/**
 * Create refund
 */
router.post('/refund', async (req, res) => {
  try {
    const { captureId, amount } = req.body;

    const request = new paypal.payments.CapturesRefundRequest(captureId);

    if (amount) {
      request.requestBody({
        amount: {
          value: amount,
          currency_code: 'USD'
        }
      });
    }

    const client = getPayPalClient();
    const refund = await client.execute(request);

    console.log(`✅ Venmo/PayPal refund created: ${refund.result.id}`);

    res.json({
      id: refund.result.id,
      status: refund.result.status,
      amount: refund.result.amount
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Webhook handler
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const event = req.body;

    console.log(`📨 PayPal/Venmo webhook: ${event.event_type}`);

    // Handle events
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log(`💰 Payment completed: ${event.resource.id}`);
        // TODO: Update database, fulfill order
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        console.log(`❌ Payment denied: ${event.resource.id}`);
        // TODO: Notify customer
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log(`💵 Payment refunded: ${event.resource.id}`);
        // TODO: Update order status
        break;

      default:
        console.log(`Unhandled event: ${event.event_type}`);
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
  const isConfigured = !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
  res.json({
    configured: isConfigured,
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox'
  });
});

module.exports = router;
