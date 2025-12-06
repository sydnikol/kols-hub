/**
 * COMPLETE STRIPE BACKEND SERVER
 * Ready to deploy - handles all payment operations
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Important: raw body for webhooks, json for everything else
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Mount payment routes
const cashAppRoutes = require('./cashapp-routes');
const venmoRoutes = require('./venmo-routes');
const openaiRoutes = require('./openai-routes');

app.use('/api/cashapp', cashAppRoutes);
app.use('/api/venmo', venmoRoutes);
app.use('/api/openai', openaiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Full-stack money-making backend is running!',
    services: {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      cashapp: !!(process.env.CASHAPP_CLIENT_ID && process.env.CASHAPP_CLIENT_SECRET),
      venmo: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      openai: !!process.env.OPENAI_API_KEY
    }
  });
});

// Create Payment Intent (for receiving payments)
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`✅ Payment intent created: $${amount}`);
    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Payment Link (shareable link for quick payments)
app.post('/api/create-payment-link', async (req, res) => {
  try {
    const { productName, amount, currency = 'usd' } = req.body;

    // Create a product
    const product = await stripe.products.create({
      name: productName,
    });

    // Create a price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(amount * 100),
      currency,
    });

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    });

    console.log(`✅ Payment link created: ${paymentLink.url}`);
    res.json({
      url: paymentLink.url,
      id: paymentLink.id
    });
  } catch (error) {
    console.error('Payment link error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Payout (withdraw to bank account)
app.post('/api/create-payout', async (req, res) => {
  try {
    const { amount, currency = 'usd', destination } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency,
      destination: destination || undefined
    });

    console.log(`✅ Payout created: $${amount}`);
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

// Get Stripe Balance
app.get('/api/stripe-balance', async (req, res) => {
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

// Create Customer
app.post('/api/create-customer', async (req, res) => {
  try {
    const { email, name, metadata = {} } = req.body;

    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });

    console.log(`✅ Customer created: ${email}`);
    res.json({
      id: customer.id,
      email: customer.email
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Subscription (recurring payments)
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { customerId, priceId, trialDays = 0 } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays > 0 ? trialDays : undefined,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    console.log(`✅ Subscription created for customer: ${customerId}`);
    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List Transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const charges = await stripe.charges.list({
      limit
    });

    const transactions = charges.data.map(charge => ({
      id: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency,
      status: charge.status,
      created: new Date(charge.created * 1000),
      description: charge.description,
      customer: charge.customer
    }));

    res.json({ transactions });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook Handler (receive events from Stripe)
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('⚠️  Webhook secret not set. Skipping signature verification.');
    return res.json({ received: true });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📨 Webhook received: ${event.type}`);

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`💰 Payment succeeded: $${paymentIntent.amount / 100}`);
        // TODO: Update your database, send confirmation email, etc.
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`❌ Payment failed: ${failedPayment.id}`);
        // TODO: Notify user, log failure
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object;
        console.log(`🎉 New subscription: ${subscription.id}`);
        // TODO: Grant access to subscriber
        break;

      case 'customer.subscription.deleted':
        const canceledSub = event.data.object;
        console.log(`👋 Subscription cancelled: ${canceledSub.id}`);
        // TODO: Revoke access
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log(`💵 Invoice paid: $${invoice.amount_paid / 100}`);
        // TODO: Log recurring payment
        break;

      case 'charge.succeeded':
        const charge = event.data.object;
        console.log(`✅ Charge succeeded: $${charge.amount / 100}`);
        break;

      case 'payout.paid':
        const payout = event.data.object;
        console.log(`🏦 Payout completed: $${payout.amount / 100}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 Stripe Backend Server Running!           ║
║                                               ║
║  URL: http://localhost:${PORT}                  ║
║  Status: http://localhost:${PORT}/api/health    ║
║                                               ║
║  Ready to process real payments! 💰           ║
╚═══════════════════════════════════════════════╝
  `);

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    console.warn('\n⚠️  WARNING: STRIPE_SECRET_KEY not set in .env file!');
    console.warn('Get your key from: https://dashboard.stripe.com/apikeys\n');
  }
});

module.exports = app;
