# Unified Mega App - Secure Setup Guide

## ⚠️ SECURITY FIRST

**NEVER hardcode real credentials in your code!** This guide shows you how to set up secure authentication and integrations.

## 1. Google OAuth Setup (Required for Login)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Google Fit API
   - Gmail API
   - Google Calendar API
   - Google+ API

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
5. Copy your **Client ID** (save this securely!)

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
VITE_REDIRECT_URI=http://localhost:3000/auth/callback

# Bitcoin (optional)
VITE_BITCOIN_RPC_URL=http://localhost:8332
VITE_BITCOIN_RPC_USER=your-username
VITE_BITCOIN_RPC_PASSWORD=your-password

# Banking (optional - use sandbox for testing)
VITE_PSD2_CLIENT_ID=your-client-id
VITE_PSD2_CLIENT_SECRET=your-client-secret
VITE_PSD2_ENVIRONMENT=sandbox

# Personal Capital (optional)
VITE_PERSONAL_CAPITAL_USERNAME=your-username
VITE_PERSONAL_CAPITAL_PASSWORD=your-password

# InFlow Inventory (optional)
VITE_INFLOW_API_KEY=your-api-key

# Coursera (optional)
VITE_COURSERA_CLIENT_ID=your-client-id
VITE_COURSERA_CLIENT_SECRET=your-client-secret

# Hugging Face (optional)
VITE_HUGGINGFACE_API_KEY=your-api-key

# Local LLM (optional)
VITE_LOCAL_LLM_URL=http://localhost:8000/v1
VITE_LOCAL_LLM_MODEL=sydnikol/kol
```

**Important**: Add `.env` to your `.gitignore` file!

## 2. Initialize Integrations

In your app initialization code:

```typescript
import { authService } from './services/auth-service';
import { integrationManager } from './services/integration-manager';

// Initialize auth service
authService.initialize({
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_REDIRECT_URI
});

// Initialize all integrations
await integrationManager.initializeAll({
  bitcoin: {
    rpcUrl: import.meta.env.VITE_BITCOIN_RPC_URL,
    rpcUser: import.meta.env.VITE_BITCOIN_RPC_USER,
    rpcPassword: import.meta.env.VITE_BITCOIN_RPC_PASSWORD
  },
  banking: {
    clientId: import.meta.env.VITE_PSD2_CLIENT_ID,
    clientSecret: import.meta.env.VITE_PSD2_CLIENT_SECRET,
    environment: import.meta.env.VITE_PSD2_ENVIRONMENT
  },
  finance: {
    username: import.meta.env.VITE_PERSONAL_CAPITAL_USERNAME,
    password: import.meta.env.VITE_PERSONAL_CAPITAL_PASSWORD
  },
  inventory: {
    apiKey: import.meta.env.VITE_INFLOW_API_KEY
  },
  learning: {
    clientId: import.meta.env.VITE_COURSERA_CLIENT_ID,
    clientSecret: import.meta.env.VITE_COURSERA_CLIENT_SECRET
  },
  'ai-models': {
    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY
  },
  'ai-chat': {
    baseURL: import.meta.env.VITE_LOCAL_LLM_URL,
    defaultModel: import.meta.env.VITE_LOCAL_LLM_MODEL
  }
});
```

## 3. Login Flow

### In your Login component:

```typescript
import { authService } from './services/auth-service';

function LoginPage() {
  const handleGoogleLogin = () => {
    // This redirects to Google's secure login page
    authService.loginWithGoogle();
  };

  return (
    <button onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
}
```

### Handle callback:

```typescript
// In your callback route component
function AuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      authService.handleCallback(code).then(user => {
        console.log('Logged in:', user.email);
        // Redirect to dashboard
        navigate('/dashboard');
      });
    }
  }, []);

  return <div>Logging in...</div>;
}
```

## 4. Connect Real Health Data

```typescript
import { integrationManager } from './services/integration-manager';

// After user logs in with Google
await integrationManager.connectGoogleFit();

// Get real health data
const healthData = await integrationManager.getRealHealthData();
```

## 5. Get Unified Data

```typescript
// Financial snapshot from all sources
const financial = await integrationManager.getFinancialSnapshot();
console.log('Net worth:', financial.netWorth);

// Learning progress
const learning = await integrationManager.getLearningSnapshot();
console.log('Courses completed:', learning.completed);

// Inventory summary
const inventory = await integrationManager.getInventorySnapshot();
console.log('Total products:', inventory.totalProducts);
```

## 6. Enable Auto-Sync

```typescript
// Sync all integrations every 30 minutes
integrationManager.enableAutoSync(30);

// Manual sync
await integrationManager.syncAll();
```

## 7. Check Integration Status

```typescript
const statuses = integrationManager.getStatus();
statuses.forEach(status => {
  console.log(`${status.name}: ${status.configured ? '✅' : '❌'}`);
});
```

## Security Checklist

- [ ] Never commit `.env` file
- [ ] Never hardcode credentials
- [ ] Use environment variables
- [ ] Enable OAuth for user authentication
- [ ] Use HTTPS in production
- [ ] Rotate API keys regularly
- [ ] Use sandbox/test environments for development
- [ ] Implement proper error handling
- [ ] Add rate limiting
- [ ] Monitor for suspicious activity

## Testing

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Troubleshooting

### "Not authenticated" errors
- Make sure you're logged in with Google OAuth
- Check that your access token hasn't expired
- Try logging out and back in

### "Integration not configured" errors
- Verify all required environment variables are set
- Check that API keys are valid
- Ensure services are properly initialized

### Health data not loading
- Confirm Google Fit API is enabled
- Check that you granted all required permissions during login
- Verify your Google account has health data

## Support

For issues or questions, check the integration service files in `src/services/`.

---

**Remember**: Security is paramount. Always use proper authentication and never expose sensitive credentials!
