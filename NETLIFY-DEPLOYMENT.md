# Deploy to Netlify Configuration

## Quick Deploy (One Command)
```bash
npm run deploy
```

## Manual Deploy Steps

1. **Build the production version:**
```bash
npm run build
```

2. **Deploy to Netlify:**
```bash
netlify deploy --prod --dir=dist
```

## Environment Variables
Make sure these are set in Netlify dashboard:

```env
# API Keys
VITE_OPENAI_API_KEY=your_key
VITE_SPOTIFY_CLIENT_ID=860927c26ac74e26a65d64f3ce331431
VITE_SPOTIFY_CLIENT_SECRET=your_secret
VITE_GOOGLE_CLIENT_ID=your_id
VITE_GOOGLE_API_KEY=your_key

# Patient Portals
VITE_MYSAINTLUKES_API=your_endpoint
VITE_MYUHEALTH_API=your_endpoint

# Ready Player Me
VITE_READY_PLAYER_ME_ID=68e94e474099d80b93c9b714

# Analytics
VITE_VERCEL_ANALYTICS_ID=your_id
VITE_NEW_RELIC_APP_ID=your_id

# Payment Processing  
VITE_STRIPE_PUBLISHABLE_KEY=your_key
VITE_PAYPAL_CLIENT_ID=your_id

# Backend
VITE_API_URL=https://your-backend.com
```

## Netlify Configuration File
The `netlify.toml` file is already configured with:
- Build settings
- Redirect rules
- Headers for PWA
- Function settings

## Custom Domain
1. Go to Netlify dashboard
2. Domain settings → Add custom domain
3. Point your domain's DNS to Netlify

## Continuous Deployment
1. Connect GitHub repository to Netlify
2. Set branch to `main`
3. Build command: `npm run build`
4. Publish directory: `dist`

## Post-Deployment Checklist
- [ ] Test PWA installation
- [ ] Verify offline functionality
- [ ] Check medication import
- [ ] Test all sanctum rooms
- [ ] Verify AI companion modes
- [ ] Test notifications
- [ ] Check mobile responsiveness
- [ ] Verify all API integrations
- [ ] Test database sync
- [ ] Monitor analytics

## Performance Optimization
- Lighthouse score target: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <500KB initial

## Monitoring
- New Relic for performance
- Vercel Analytics for usage
- Netlify Analytics for traffic
- Custom evolution tracking

## Rollback Strategy
```bash
# List deployments
netlify deploy --list

# Rollback to specific deployment
netlify deploy --restore=[deploy-id]
```

## Status Page
Create status page at: https://status.kolhub.app

## Support Documentation
Deployed at: /docs

---
**Last Updated:** November 23, 2025
**Version:** 4.0.0
**Status:** READY FOR DEPLOYMENT
