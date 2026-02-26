# Kol's Hub - System Architecture

## Overview

Kol's Hub is a comprehensive personal operating system built as a Progressive Web Application (PWA) with full cross-platform support. It provides 111 feature-rich pages covering health management, relationships, learning, passive income, entertainment, and more. The architecture emphasizes offline-first design, real-time synchronization, and deep third-party integrations.

**Key Metrics:**
- 111+ feature pages
- 50+ integrated services
- 1,250+ AI-generated content items
- 34+ enterprise integrations
- 100% offline-capable

---

## High-Level Architecture

### Client-Server Model

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│  (React + TypeScript + Tailwind CSS)                        │
│  111 Feature Pages, 200+ Components                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼─────────────┐      ┌───────▼─────────────┐
│  INTEGRATION LAYER  │      │   LOCAL DATA LAYER  │
│  (50+ Services)     │      │  (IndexedDB + PWA)  │
└───────┬─────────────┘      └───────┬─────────────┘
        │                             │
        │  OAuth / API Keys           │  Offline-First
        │                             │  Sync Manager
        ▼                             ▼
┌──────────────────────────────────────────────────────┐
│          SERVICE LAYER (TypeScript Services)        │
│  Integration Manager, Auth, Sync, Passive Income   │
└──────────────────────┬───────────────────────────────┘
                       │
        ┌──────────────┴──────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐          ┌──────────────────┐
│  EXTERNAL APIs    │          │  LOCAL STORAGE   │
│  (34+ Services)   │          │  (Browser-based) │
└───────────────────┘          └──────────────────┘
```

### Service-Oriented Architecture

The system is organized into layered services:

1. **Presentation Layer:** React components with TypeScript type safety
2. **Integration Layer:** OAuth, API managers, connectors
3. **Service Layer:** Business logic, sync, passive income orchestration
4. **Data Layer:** IndexedDB + localStorage with optional MongoDB cloud sync
5. **Security Layer:** Auth0, biometric authentication, encryption

---

## Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript 5
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS + custom themes
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **3D:** Three.js + @react-three/fiber
- **Charts:** Recharts
- **PWA:** Vite Plugin PWA with Workbox

### State Management
- **Local:** React hooks (useState, useContext, useReducer)
- **Global:** React Context + IntegrationContext
- **Persistence:** IndexedDB via Dexie.js

### Backend/Services
- **Authentication:** Google OAuth 2.0, Auth0, biometric
- **APIs:** 34+ third-party integrations
- **Real-Time:** Web Sockets (optional), Service Workers
- **Monitoring:** New Relic APM, enterprise observability

### Mobile
- **Framework:** Capacitor for iOS/Android
- **Platform Support:** iOS 13+, Android 7+
- **Native Features:** Haptic feedback, biometric auth, permissions

### Deployment
- **Web:** Netlify (automated CI/CD)
- **Desktop:** Electron (Windows, macOS, Linux)
- **Container:** Docker + docker-compose
- **Cloud Optional:** MongoDB Atlas for optional cloud persistence

---

## Service Modules

Located in `src/services/`, these provide core functionality:

### Core Services
- **auth-service.ts** - Google OAuth 2.0, token management, PKCE flow
- **integration-manager.ts** - Hub managing 34+ API integrations
- **sync-manager.ts** - Manages 7 cloud providers (Google Drive, Dropbox, OneDrive, iCloud, GitHub, Notion, Airtable)

### Feature Services
- **healthAnalyticsService.ts** - Vital tracking, correlations, alerts
- **advocacyService.ts** - Scripts, hearing prep, insurance calls
- **careTeamService.ts** - Care coordinator tools, delegation
- **mvpFeaturesService.ts** - Hydration, sodium, body weather, pain map

### AI & Automation
- **module-orchestrator.ts** - Cross-module event communication (15+ automations)
- **ai-multi-role-assistant.ts** - 12 distinct AI personalities
- **passive-income-orchestrator.ts** - Income generation automation
- **geminiAIService.ts** - Google Gemini integration
- **newrelic-integration.ts** - Enterprise monitoring and metrics

### Integration Services
- **google-connector.ts** - Gmail, Calendar, Drive, Fit, Photos, Home
- **all-services-connector.ts** - Spotify, YouTube Music, Fitbit, Strava, etc.
- **real-money-connector.ts** - Stripe, PayPal, Cash App withdrawals
- **coursera-integration.ts** - Course enrollment and tracking
- **zapier-integration.ts** - 8,000+ app automation

### Platform-Specific
- **platformService.ts** - Platform detection (web, electron, iOS, Android)
- **inworld-ai-integration.ts** - Conversational AI
- **mcp-server-integration.ts** - Multi-provider orchestration

### Data Services
- **autoLibraryFiller.ts** - AI content generation (books, podcasts, recipes, ideas)
- **accountTrackingService.ts** - Financial account aggregation
- **librarySyncService.ts** - Library data persistence

---

## Data Models

Located in `src/models/`, TypeScript interfaces define all data structures:

### Health Models
```typescript
interface Vital {
  id: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  oxygenLevel: number;
  temperature: number;
  timestamp: Date;
  notes: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
  startDate: Date;
  allergies: string[];
}

interface HealthMetric {
  date: Date;
  sleep: number;
  sodium: number;
  medications: string[];
  pain: number;
  energy: number;
  hydration: number;
  bloodPressure: { sys: number; dia: number };
  heartRate: number;
}
```

### Financial Models
```typescript
interface Account {
  id: string;
  type: 'bank' | 'crypto' | 'investment';
  name: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
}

interface EarningRecord {
  id: string;
  source: string;
  amount: number;
  currency: 'USD';
  timestamp: Date;
  description: string;
}

interface Withdrawal {
  id: string;
  method: 'stripe' | 'paypal' | 'cashapp' | 'venmo';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}
```

### Social Models
```typescript
interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string[];
  priority: 'primary' | 'secondary' | 'backup';
  notes: string;
}

interface Relationship {
  id: string;
  name: string;
  type: 'partner' | 'family' | 'friend' | 'professional';
  quality: number;
  lastInteraction: Date;
}
```

### Learning Models
```typescript
interface Course {
  id: string;
  title: string;
  platform: string;
  progress: number;
  status: 'enrolled' | 'in-progress' | 'completed';
  startDate: Date;
  completionDate?: Date;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: number;
  completed: boolean;
}
```

---

## Data Persistence

### Local Storage (Primary)
- **Technology:** IndexedDB via Dexie.js
- **Scope:** 100% offline-capable, no internet required
- **Databases:**
  - `health_db` - Vitals, medications, appointments
  - `finance_db` - Accounts, transactions, earnings
  - `social_db` - Contacts, relationships
  - `learning_db` - Courses, progress
  - `content_db` - Generated content library
  - `sync_db` - Sync metadata and state

### Optional Cloud Storage
- **Technology:** MongoDB Atlas (if configured)
- **Features:** Optional cloud backup, multi-device sync
- **Usage:** Configured via environment variables
- **Fallback:** If unavailable, app continues functioning fully offline

### Sync Strategy
- **Offline-First:** All data written to IndexedDB first
- **Auto-Sync:** Background sync every 15 minutes when online
- **Conflict Resolution:** Last-write-wins with timestamp comparison
- **Bandwidth:** Differential sync (only changed data)

### Data Export
- **Format:** JSON for portability
- **Encryption:** Optional encryption at export
- **Frequency:** User-initiated exports
- **Cloud:** Sync to Google Drive, Dropbox, OneDrive, or GitHub

---

## Security Architecture

### Authentication
1. **Google OAuth 2.0** (Primary)
   - PKCE flow for enhanced security
   - Access tokens for Google services
   - Automatic token refresh
   - No hardcoded credentials

2. **Biometric Authentication** (Mobile)
   - Face ID / Touch ID (iOS)
   - Fingerprint / Face unlock (Android)
   - Fallback to PIN if biometric unavailable

3. **Auth0** (Optional)
   - Multi-factor authentication
   - Social login providers
   - Enterprise SSO

### Authorization
- **Granular Permissions:** Per-service and per-feature
- **User Consent:** Explicit permission requests for sensitive data
- **Privacy Controls:** User can disable any integration

### Data Security
- **Browser Storage:** Secure localStorage for non-sensitive data
- **Sensitive Data:** IndexedDB for local encryption (via browser)
- **API Calls:** HTTPS only, OAuth tokens
- **No Hardcoding:** All credentials from environment variables

### Encryption
- **Transport:** HTTPS for all API communications
- **Optional:** End-to-end encryption for cloud exports
- **Key Management:** User-controlled encryption keys

---

## Plugin System Architecture

### Plugin Interface
Located in `src/core/PluginSystem.ts`:

```typescript
interface Plugin {
  id: string;
  name: string;
  version: string;
  manifest: {
    permissions: string[];
    dependencies: string[];
    hooks: string[];
  };
  init(): Promise<void>;
  activate(): void;
  deactivate(): void;
  execute(action: string, params: any): Promise<any>;
}
```

### Plugin Types
1. **Service Plugins** - Extend functionality (e.g., new AI provider)
2. **UI Plugins** - Add pages or components
3. **Automation Plugins** - Add workflow capabilities
4. **Integration Plugins** - Connect to external services

### Plugin Lifecycle
1. **Discovery:** Registry scans for available plugins
2. **Loading:** Plugin code fetched and verified
3. **Initialization:** Plugin `init()` called, permissions checked
4. **Activation:** Plugin becomes available to user
5. **Execution:** Plugin handles requests via `execute()`
6. **Deactivation:** User can disable plugin anytime

### Hook System
Plugins can hook into:
- `health:vital-logged` - When vitals recorded
- `income:earned` - When money received
- `content:generated` - When content created
- `sync:completed` - After cloud sync
- `error:occurred` - When system error happens

---

## Integration Points

### External Service Categories

1. **Google Ecosystem** (10 services)
   - Calendar, Gmail (3 accounts), Drive, Fit, Photos, Home, Pay

2. **Music & Entertainment** (11 services)
   - Spotify, YouTube Music, SoundCloud, Netflix, Hulu, Disney+, Twitch, Steam, Discord

3. **Productivity** (11 services)
   - Notion, Todoist, Trello, Asana, Slack, Outlook, Teams, Zoom, Dropbox, OneDrive

4. **Finance** (8+ services)
   - PayPal, Venmo, Cash App, Mint, Robinhood, Plaid, Stripe, PSD2 Banking

5. **Health & Fitness** (7 services)
   - Fitbit, Strava, Peloton, Apple Health, MyFitnessPal, Google Fit, Pixel Watch

6. **Shopping & Delivery** (9 services)
   - Amazon, Walmart, Target, Etsy, eBay, Uber Eats, DoorDash, GrubHub, Instacart

7. **Transportation** (4 services)
   - Uber, Lyft, Airbnb, Booking.com

8. **Learning** (3 services)
   - Coursera, Udemy, Duolingo

9. **Smart Home**
   - Samsung SmartThings, Google Home, Amazon Alexa, Philips Hue

10. **AI & Automation** (7+ providers)
    - OpenAI, Google Gemini, DeepSeek, Augment, Inworld AI, Zapier (8,000 apps), MCP servers

### Module Communication

The **Module Orchestrator** (`src/services/module-orchestrator.ts`) enables cross-module automation:

**15+ intelligent automations:**
- Health → Wellness: Low vitals trigger rest recommendations
- Wellness → Music: Auto-play calming music when stress detected
- Calendar → Home: Activate focus mode for work meetings
- Location → Home: Welcome home routine with lights
- Finance → Wellness: Spending stress alerts
- Tasks → Home: Celebration lights when goals achieved
- Music → Wellness: Mood detection from listening habits
- Crisis → Home: Emergency calm-down environment
- Food → Finance: Auto-track meal expenses
- Education → Tasks: Auto-schedule next lessons

---

## Application Flow

### Initialization Sequence
1. App loads in browser/Electron/mobile wrapper
2. Service Worker registers (PWA caching)
3. Auth service checks for existing tokens
4. Integration Manager initializes configured services
5. Sync Manager starts auto-sync (15-minute interval)
6. Passive Income Orchestrator begins earnings loops
7. New Relic monitoring initializes
8. Library auto-fill runs on first load
9. App UI renders fully functional

### User Data Flow
```
User Input (Component)
    ↓
Trigger Service Method
    ↓
IndexedDB Write (Local)
    ↓
UI State Update (Instant)
    ↓
Background Cloud Sync (Every 15 min)
    ↓
External API Call (If configured)
    ↓
Response → IndexedDB
    ↓
UI Updates with New Data
```

### Income Generation Flow
```
PassiveIncomeOrchestrator
    ├─ Content Generation (every 6 hours)
    ├─ Affiliate Optimization (every 12 hours)
    ├─ Investment Monitoring (every 15 minutes)
    └─ Crypto Trading (every 5 minutes)
        ↓
    RealMoneyConnector.recordRealEarning()
        ↓
    Accumulates in localStorage
        ↓
    Syncs to New Relic
        ↓
    Auto-Withdraw (if enabled, at threshold)
        ↓
    Stripe/PayPal Transfer
        ↓
    Bank Account (1-3 days)
```

---

## Development Patterns

### Context-Based State Management
```typescript
// IntegrationContext provides:
const {
  integrationManager,      // All integrations
  authService,             // Authentication
  isAuthenticated,         // Auth status
  user,                    // Current user
  realMoneyConnector,      // Income tracking
  getRealBalance,          // Get earnings
  withdrawMoney            // Withdraw to bank
} = useIntegrations();
```

### Service Pattern
Each service follows:
```typescript
class FeatureService {
  private db: IDBPDatabase | null = null;

  async init() { /* DB initialization */ }
  async addItem(item) { /* Create */ }
  async getItems() { /* Read */ }
  async updateItem(id, updates) { /* Update */ }
  async deleteItem(id) { /* Delete */ }
  async seedSampleData() { /* Demo data */ }
}
```

### Component Pattern
```typescript
function MyComponent() {
  const { integrationManager } = useIntegrations();

  useEffect(() => {
    integrationManager.getFinancialSnapshot().then(data => {
      setFinances(data);
    });
  }, []);

  return <div>{/* Render */}</div>;
}
```

---

## Performance Considerations

### Optimization Strategies
- **Code Splitting:** Route-based lazy loading
- **Bundle Optimization:** Manual chunks for large libraries
- **Image Optimization:** WebP with fallbacks, lazy loading
- **Caching:** Service Worker precaches 129 entries (~5 MB)
- **Compression:** Gzip for assets in production

### Monitoring
- **New Relic APM:** Real-time performance metrics
- **Web Vitals:** FCP, LCP, CLS, FID tracking
- **Custom Events:** Earnings, content, API calls
- **Alerts:** Threshold-based notifications

### Build Artifacts
- **Main Bundle:** ~600 KB (gzipped: ~200 KB)
- **Three.js Vendor:** ~698 KB (gzipped: ~178 KB)
- **Total Precache:** ~5.37 MB
- **Build Time:** ~16 seconds

---

## Scalability

### Horizontal Scaling
- PWA serves from CDN (Netlify)
- Stateless services (no server-side sessions)
- Optional MongoDB for multi-user cloud sync
- Zapier connects to 8,000+ apps

### Vertical Scaling
- Component memoization prevents unnecessary re-renders
- Virtual scrolling for long lists
- Debounced searches and API calls
- Efficient IndexedDB queries with indexes

### Performance Targets
- Initial Load: <3 seconds
- Page Navigation: <500ms
- API Response: <1 second
- Offline Response: Instant (local data)

---

## Conclusion

Kol's Hub provides a production-ready, enterprise-grade personal operating system with extensive customization, deep integrations, and comprehensive offline-first design. The modular architecture allows easy feature additions through both native services and external plugins, while comprehensive monitoring ensures system health and performance tracking.
