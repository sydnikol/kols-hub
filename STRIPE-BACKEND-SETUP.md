# 🚀 Stripe Backend Setup Guide

Your app now has Stripe integration on the **frontend**, but to process real payments, you need a **backend server** (for security - never expose your Secret Key!).

## 🎯 Two Options for Backend

### Option 1: Quick Setup with Vercel (5 minutes) ⚡ RECOMMENDED

**Best for:** Quick deployment, no server management

1. **Create a simple Next.js API**:
```bash
# In a new folder
npx create-next-app@latest stripe-backend
cd stripe-backend
npm install stripe
```

2. **Create API route**: `pages/api/create-payment-intent.js`
```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

3. **Deploy to Vercel**:
```bash
npm install -g vercel
vercel login
vercel
```

4. **Add environment variable** in Vercel dashboard:
   - Go to your project settings
   - Add `STRIPE_SECRET_KEY` = your Stripe secret key

5. **Update your app**:
```typescript
// In your .env file
VITE_API_URL=https://your-app.vercel.app/api
```

### Option 2: Express Server (15 minutes)

**Best for:** More control, custom logic

1. **Create backend folder**:
```bash
mkdir stripe-backend
cd stripe-backend
npm init -y
npm install express stripe cors dotenv
```

2. **Create `server.js`**:
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Payout
app.post('/api/create-payout', async (req, res) => {
  try {
    const { amount } = req.body;

    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    res.json({
      id: payout.id,
      status: payout.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Balance
app.get('/api/stripe-balance', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({
      available: balance.available.map(b => ({
        amount: b.amount / 100,
        currency: b.currency
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint
app.post('/api/webhook',
  express.raw({type: 'application/json'}),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      // Handle events
      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('💰 Payment received!');
          // Update your database
          break;
      }

      res.json({received: true});
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Stripe backend running on http://localhost:${PORT}`);
});
```

3. **Create `.env` file**:
```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PORT=3001
```

4. **Run it**:
```bash
node server.js
```

5. **Deploy to Railway** (free tier):
   - Go to https://railway.app
   - Click "New Project" > "Deploy from GitHub"
   - Connect your repo
   - Add environment variables
   - Done!

## 🔑 Getting Your Stripe Keys

1. **Sign up**: https://stripe.com
2. **Go to Dashboard**: https://dashboard.stripe.com
3. **Get API Keys**:
   - Click "Developers" > "API Keys"
   - Copy "Publishable key" (starts with `pk_`)
   - Copy "Secret key" (starts with `sk_`)
   - **Important**: Use test keys first (`pk_test_` and `sk_test_`)

4. **Set up Webhooks**:
   - Click "Developers" > "Webhooks"
   - Click "Add endpoint"
   - Enter: `https://your-backend.com/api/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook signing secret (starts with `whsec_`)

## 🧪 Testing

1. **Use Stripe test cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC

2. **Test the flow**:
```bash
# Test payment creation
curl -X POST http://localhost:3001/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 29.99}'
```

## 📱 Connect to Your App

Update your frontend `.env`:
```
VITE_API_URL=http://localhost:3001/api
# Or for production:
VITE_API_URL=https://your-backend.vercel.app/api
```

## 🎯 Quick Start Checklist

- [ ] Choose Option 1 (Vercel) or Option 2 (Express)
- [ ] Sign up for Stripe
- [ ] Get test API keys
- [ ] Deploy backend
- [ ] Add environment variables
- [ ] Update frontend API URL
- [ ] Test with Stripe test cards
- [ ] Set up webhooks
- [ ] Go live with real keys when ready

## 💡 Alternative: Stripe Payment Links (No Code!)

If you want to accept payments **RIGHT NOW** without any backend:

1. Go to https://dashboard.stripe.com/payment-links
2. Click "Create payment link"
3. Set price, description
4. Get shareable link
5. Share on social media, email, etc.
6. Money goes straight to your Stripe account!

**Perfect for:**
- Selling digital products
- Accepting donations
- Quick one-time payments

## 🆘 Need Help?

- Stripe Docs: https://stripe.com/docs
- Stripe Discord: https://discord.gg/stripe
- My implementation: See `src/services/stripe-backend-api.ts`

---

**You're just 5 minutes away from accepting real payments! 💰**
