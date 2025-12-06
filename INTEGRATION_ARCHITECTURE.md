# Integration Architecture - How Everything Connects

## Overview

All your services are now fully integrated and communicating. Here's how the architecture works:

## 🎯 Core Components

### 1. **App Initializer** (`src/utils/appInitializer.ts`)
The central orchestrator that starts on app load.

**Initialization Order:**
1. ✅ Authentication Service (Google OAuth)
2. ✅ Integration Manager (All API services)
3. ✅ Sync Manager
4. ✅ Passive Income Orchestrator
5. ✅ Google Services
6. ✅ Inworld AI
7. ✅ Multi-AI Provider
8. ✅ Account Tracking
9. ✅ Library Auto-fill

### 2. **Integration Manager** (`src/services/integration-manager.ts`)
Manages all platform integrations:

```typescript
Registered Services:
├── bitcoin            - Bitcoin Core wallet & transactions
├── banking            - Credit Suisse PSD2 banking
├── finance            - Personal Capital wealth tracking
├── inventory          - InFlow inventory management
├── learning           - Coursera courses & certifications
├── ai-models          - Hugging Face AI models & OCR
└── ai-chat            - Local LLM (sydnikol/kol)
```

**Key Methods:**
- `initializeAll()` - Initialize all integrations with config
- `getFinancialSnapshot()` - Aggregate data from all financial sources
- `getLearningSnapshot()` - Get learning progress from all platforms
- `getInventorySnapshot()` - Get inventory summary
- `getRealHealthData()` - Fetch real Google Fit health data
- `syncAll()` - Sync all integrations
- `enableAutoSync()` - Auto-sync every 30 minutes

### 3. **Auth Service** (`src/services/auth-service.ts`)
Secure Google OAuth 2.0 authentication.

**Features:**
- Google OAuth login with PKCE
- Access to Google Fit, Gmail, Calendar
- Automatic token refresh
- Secure local storage
- No hardcoded credentials

**Permissions Requested:**
- `fitness.activity.read`
- `fitness.heart_rate.read`
- `fitness.sleep.read`
- `calendar.readonly`
- `gmail.readonly`

### 4. **Integration Context** (`src/contexts/IntegrationContext.tsx`)
React context provider that makes all services available throughout the app.

**Available Hooks:**
```typescript
const {
  integrationManager,    // Access to integration manager
  authService,           // Auth service
  isAuthenticated,       // Auth status
  user,                  // Current user
  login,                 // Trigger Google login
  logout,                // Sign out
  getFinancialSnapshot,  // Get financial data
  getLearningSnapshot,   // Get learning data
  getInventorySnapshot,  // Get inventory data
  getHealthData,         // Get real health data
  connectGoogleFit       // Connect to Google Fit
} = useIntegrations();
```

## 🔄 Data Flow

### Health Data Flow
```
User Signs In (Google OAuth)
    ↓
Auth Service stores access token
    ↓
Integration Manager → Google Fit API
    ↓
getRealHealthData() fetches:
  - Heart rate (7-day buckets)
  - Step count (daily aggregates)
  - Sleep segments
    ↓
Health Dashboard displays real data
```

### Financial Data Flow
```
Environment Variables (.env)
    ↓
App Initializer loads credentials
    ↓
Integration Manager initializes:
  - Personal Capital (net worth tracking)
  - PSD2 Banking (bank accounts)
  - Bitcoin (crypto wallet)
    ↓
getFinancialSnapshot() aggregates:
  - Net worth from Personal Capital
  - Bank balances from PSD2
  - Crypto holdings from Bitcoin
    ↓
Finance Dashboard displays unified view
```

### Learning Data Flow
```
Coursera API Credentials (.env)
    ↓
Integration Manager → Coursera Integration
    ↓
getLearningSnapshot() fetches:
  - Course enrollments
  - Completion status
  - Certificates
    ↓
Learning Hub displays progress
```

## 🔗 Communication Between Services

### Service-to-Service Communication

**Integration Manager as Hub:**
```
FinanceDashboard
    ↓ calls
IntegrationContext.getFinancialSnapshot()
    ↓ triggers
IntegrationManager.getFinancialSnapshot()
    ↓ queries in parallel
┌─────────────────┬──────────────────┬─────────────────┐
│ Personal Capital│  PSD2 Banking    │  Bitcoin Core   │
└─────────────────┴──────────────────┴─────────────────┘
    ↓ aggregates results
Returns unified financial snapshot
```

**Auto-Sync Communication:**
```
setInterval (every 30 minutes)
    ↓
IntegrationManager.syncAll()
    ↓
Triggers sync on all configured services:
  - personalCapitalIntegration.syncLearningData()
  - courseraIntegration.syncLearningData()
    ↓
Updates localStorage with fresh data
    ↓
UI automatically refreshes via React state
```

### Cross-Service Data Sharing

**Example: Passive Income + Finance Integration**
```
PassiveIncomeOrchestrator generates revenue
    ↓
Account tracking service monitors stats
    ↓
Updates localStorage:
  - accountBalance
  - totalPassiveIncome
    ↓
Finance Dashboard reads from localStorage
    ↓
Displays combined income from all sources
```

## 🎨 UI Integration Points

### 1. **Header (App.tsx)**
- Shows authentication status
- Login/Logout buttons
- User email display
- Integrates with IntegrationContext

### 2. **Login Page** (`/login`)
- Google OAuth flow
- Secure redirect handling
- Integration status preview

### 3. **Auth Callback** (`/auth/callback`)
- Handles OAuth redirect
- Exchanges code for tokens
- Redirects to dashboard

### 4. **Integration Status Page** (`/integrations-status`)
- **Central hub for all integrations**
- Real-time status of each service
- Manual sync trigger
- Google Fit connection
- Configuration instructions

### 5. **Health Dashboard** (`/health`)
- Displays real Google Fit data
- Uses `integrationManager.getRealHealthData()`
- Auto-refreshes on data changes

### 6. **Finance Dashboard** (`/financial`)
- Shows unified financial view
- Uses `integrationManager.getFinancialSnapshot()`
- Aggregates from multiple sources

## 🔐 Security Architecture

### Environment Variables
All credentials stored in `.env`:
```env
VITE_GOOGLE_CLIENT_ID=...          # Google OAuth
VITE_BITCOIN_RPC_URL=...           # Bitcoin Core
VITE_BITCOIN_RPC_USER=...          # Bitcoin auth
VITE_BITCOIN_RPC_PASSWORD=...      # Bitcoin auth
VITE_PSD2_CLIENT_ID=...            # Banking
VITE_PSD2_CLIENT_SECRET=...        # Banking
VITE_PERSONAL_CAPITAL_USERNAME=... # Finance
VITE_PERSONAL_CAPITAL_PASSWORD=... # Finance
VITE_INFLOW_API_KEY=...            # Inventory
VITE_COURSERA_CLIENT_ID=...        # Learning
VITE_COURSERA_CLIENT_SECRET=...    # Learning
VITE_HUGGINGFACE_API_KEY=...       # AI Models
VITE_LOCAL_LLM_URL=...             # Local LLM
VITE_LOCAL_LLM_MODEL=...           # Model name
```

### OAuth Flow Security
1. User clicks "Sign in with Google"
2. Redirects to Google's secure auth page
3. User grants permissions
4. Google redirects back with authorization code
5. Auth service exchanges code for access token
6. Token stored securely in localStorage
7. Token used for all Google API calls

### Data Storage
- **Credentials:** Never hardcoded, always in environment variables
- **Tokens:** Stored in localStorage with expiration check
- **User Data:** Stored locally, never uploaded
- **API Keys:** Read from .env, never exposed to client

## 🚀 Usage Examples

### Getting Health Data in Any Component
```typescript
import { useIntegrations } from '../contexts/IntegrationContext';

function MyHealthComponent() {
  const { getHealthData, isAuthenticated } = useIntegrations();

  const loadHealth = async () => {
    if (!isAuthenticated) {
      console.log('Please sign in first');
      return;
    }

    const data = await getHealthData();
    // data contains heart rate, steps, sleep from Google Fit
  };

  return <button onClick={loadHealth}>Load Health Data</button>;
}
```

### Getting Financial Snapshot
```typescript
import { useIntegrations } from '../contexts/IntegrationContext';

function MyFinanceComponent() {
  const { getFinancialSnapshot } = useIntegrations();

  const loadFinances = async () => {
    const snapshot = await getFinancialSnapshot();
    console.log('Net Worth:', snapshot.netWorth);
    console.log('Bank Accounts:', snapshot.bankAccounts);
    console.log('Crypto:', snapshot.crypto);
  };

  return <button onClick={loadFinances}>Load Finances</button>;
}
```

### Accessing Individual Integrations
```typescript
import { useIntegrations } from '../contexts/IntegrationContext';

function BitcoinWallet() {
  const { integrationManager } = useIntegrations();

  const createWallet = async () => {
    const bitcoin = integrationManager.get('bitcoin');
    const wallet = await bitcoin.createWallet({
      name: 'My Wallet',
      passphrase: 'secure-passphrase'
    });
    console.log('Wallet created:', wallet.id);
  };

  return <button onClick={createWallet}>Create Bitcoin Wallet</button>;
}
```

## 📊 Monitoring & Debugging

### Check Integration Status
Visit `/integrations-status` page to see:
- ✅ Which services are configured
- 🔄 Last sync time
- ⚠️ Any errors
- 🔌 Connection status

### Browser Console Logs
The app logs initialization progress:
```
🚀 Initializing KOL Hub...
🔐 Initializing Authentication...
✅ User authenticated: user@example.com
🔌 Initializing API Integrations...
✅ Integrations initialized: 7/7 configured
  ✓ bitcoin
  ✓ banking
  ✓ finance
  ✓ inventory
  ✓ learning
  ✓ ai-models
  ✓ ai-chat
🔄 Starting Sync Manager...
✅ All systems online
```

### Manual Sync
Click "Sync All" button on Integrations page to:
- Force refresh all data
- Update localStorage
- Trigger UI refresh

## 🔧 Troubleshooting

### Integration Not Configured
**Problem:** Service shows "Not Configured"
**Solution:** Add required environment variables to `.env` file

### Authentication Failed
**Problem:** Google login doesn't work
**Solution:**
1. Check `VITE_GOOGLE_CLIENT_ID` in `.env`
2. Verify redirect URI matches OAuth config
3. Check browser console for errors

### No Health Data
**Problem:** Health data not loading
**Solution:**
1. Ensure you're signed in with Google
2. Click "Connect Google Fit" on Integrations page
3. Grant Fitness permissions when prompted

### Sync Failures
**Problem:** Manual sync fails
**Solution:**
1. Check integration status page for errors
2. Verify API credentials are correct
3. Check service-specific configuration

## 🎯 Next Steps

All integrations are now connected and communicating! You can:

1. ✅ **Sign in** with Google (`/login`)
2. ✅ **Check status** of all integrations (`/integrations-status`)
3. ✅ **Connect Google Fit** for real health data
4. ✅ **View unified data** on dashboards
5. ✅ **Manual sync** anytime via Integrations page

## 📚 Related Files

- `SETUP_GUIDE.md` - Initial setup and configuration
- `src/utils/appInitializer.ts` - App initialization
- `src/services/integration-manager.ts` - Integration hub
- `src/services/auth-service.ts` - Authentication
- `src/contexts/IntegrationContext.tsx` - React context
- Individual integration files in `src/services/`

---

**Everything is connected and ready to use!** 🎉
