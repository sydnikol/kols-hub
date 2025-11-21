# AI Life Manager - System Architecture

## Visual Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        YOUR APP FEATURES                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Health  │  │Education │  │ Finance  │  │  Tasks   │  ...more   │
│  │Dashboard │  │  Tracker │  │ Tracker  │  │ Manager  │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │              │             │                   │
│       └─────────────┴──────────────┴─────────────┘                   │
│                            │                                          │
│                            ▼                                          │
│                    ┌───────────────┐                                 │
│                    │  EVENT BUS    │                                 │
│                    │  (Emit/On)    │                                 │
│                    └───────┬───────┘                                 │
│                            │                                          │
│                            ▼                                          │
├────────────────────────────────────────────────────────────────────┤
│                   AI LIFE MANAGER CORE                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Central Intelligence                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │  │
│  │  │  Monitor   │  │  Analyze   │  │  Predict   │             │  │
│  │  │ (15 min)   │  │ Correlate  │  │  Suggest   │             │  │
│  │  └────────────┘  └────────────┘  └────────────┘             │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              14 AI ROLES                               │   │  │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │   │  │
│  │  │  │ Health │ │Teacher │ │Partner │ │ Money  │  + 10   │   │  │
│  │  │  │Advocate│ │        │ │        │ │Manager │  more   │   │  │
│  │  │  └────────┘ └────────┘ └────────┘ └────────┘         │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              DATA PROCESSING                           │   │  │
│  │  │  • Crisis Detection                                    │   │  │
│  │  │  • Pattern Recognition                                 │   │  │
│  │  │  • Correlation Analysis                                │   │  │
│  │  │  • Insight Generation                                  │   │  │
│  │  │  • Daily Report Creation                               │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│                      DATA LAYER                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  IndexedDB   │  │ localStorage │  │   Memory     │             │
│  │  (Dexie)     │  │ (Learning)   │  │  (Cache)     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  USER INTERFACE │
                   │  ┌───────────┐  │
                   │  │Dashboard  │  │
                   │  │Insights   │  │
                   │  │Reports    │  │
                   │  │Analytics  │  │
                   │  └───────────┘  │
                   └─────────────────┘
```

## Data Flow

### 1. Event Flow (User Action → AI Response)

```
User Logs Vitals
      ↓
Component saves to IndexedDB
      ↓
Component emits 'vital:recorded' event
      ↓
AI Life Manager receives event
      ↓
┌─────────────────┐
│ AI Processing:  │
│ 1. Check vitals │
│ 2. Detect crisis│
│ 3. Find patterns│
│ 4. Generate     │
│    insight      │
└────────┬────────┘
         ↓
   Emit 'insights:updated'
         ↓
   React hooks update
         ↓
   UI re-renders with new insights
         ↓
   User sees notification
```

### 2. Monitoring Flow (Continuous)

```
Every 15 minutes:
      ↓
Run monitoring cycle
      ↓
┌──────────────────────┐
│ 1. Detect Crisis     │←─── Check vitals, pain, mood
│ 2. Generate Insights │←─── Analyze all data
│ 3. Update Reports    │←─── Calculate scores
│ 4. Emit Events       │←─── Notify listeners
└──────────────────────┘
      ↓
Update UI automatically
```

### 3. Correlation Analysis (Daily at 10 PM)

```
End of day (10 PM)
      ↓
Gather last 30 days of data
      ↓
┌─────────────────────┐
│ For each pair:      │
│ • Hydration vs Pain │
│ • Hydration vs Mood │
│ • Food vs Symptoms  │
│ • etc.              │
└─────────┬───────────┘
          ↓
Calculate correlation coefficient
          ↓
If correlation > 0.3:
          ↓
Store correlation
          ↓
Generate insight
          ↓
Show to user next day
```

## Component Architecture

### React Hooks Layer
```
┌─────────────────────────────────────────────┐
│            React Hooks                       │
│  ┌─────────────────────────────────────┐   │
│  │ useAIManager()                       │   │
│  │  ├─ insights: AIInsight[]           │   │
│  │  ├─ dailyReport: DailyReport        │   │
│  │  ├─ dismissInsight(id)              │   │
│  │  ├─ refreshInsights()               │   │
│  │  └─ recordFeedback(id, rating)     │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ useAIRoles()                         │   │
│  │  ├─ roles: AIRole[]                 │   │
│  │  ├─ activeRoles: AIRole[]           │   │
│  │  └─ toggleRole(id, active)          │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ useCrisisDetection()                 │   │
│  │  ├─ crisis: CrisisDetection         │   │
│  │  └─ checkCrisis()                   │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ useHealthCorrelations()              │   │
│  │  ├─ correlations: Correlation[]     │   │
│  │  └─ refresh()                       │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Component Hierarchy
```
AILifeManagerPage
├─ Header (with stats)
├─ Tab Navigation
│  ├─ Dashboard
│  ├─ Roles
│  ├─ Analytics
│  └─ Settings
└─ Content Area
   └─ AIManagerDashboard (when Dashboard tab)
      ├─ Active Roles Display
      ├─ Crisis Alert (if detected)
      ├─ Daily Report Card
      ├─ Insights Grid
      │  └─ InsightCard (for each insight)
      │     ├─ Icon
      │     ├─ Title & Message
      │     ├─ Actions
      │     └─ Feedback Buttons
      └─ Correlations Display
```

## State Management

### AI Manager State
```typescript
{
  // Active insights
  activeInsights: Map<string, AIInsight>

  // Learning data (persisted)
  learningData: {
    preferences: {},
    patterns: {},
    correlations: [],
    insights: [],
    userFeedback: {}
  }

  // Event listeners
  eventBus: Map<string, Function[]>

  // Monitoring
  monitoringInterval: number | null
}
```

### Component State
```typescript
{
  // Dashboard
  insights: AIInsight[]
  dailyReport: DailyReport | null
  loading: boolean

  // Roles
  roles: AIRole[]
  activeRoles: AIRole[]

  // Crisis
  crisis: CrisisDetection | null
  monitoring: boolean

  // Correlations
  correlations: HealthCorrelation[]
  analyzing: boolean
}
```

## Event System

### Event Categories

**Health Events:**
```
vital:recorded        → New vital signs logged
medication:taken      → Med marked as taken
hydration:logged      → Water/sodium logged
pain:logged           → Pain entry added
mood:logged           → Mood/energy check-in
```

**Learning Events:**
```
course:progress       → Course updated
achievement:unlocked  → Milestone reached
```

**Financial Events:**
```
income:earned         → Money in
expense:logged        → Money out
```

**Task Events:**
```
task:created          → New task
task:completed        → Task done
```

**System Events:**
```
crisis:detected       → Emergency situation
insights:updated      → New suggestions
alert:*               → Various alerts
achievement:*         → Various achievements
```

### Event Flow Example

```typescript
// Feature emits event
aiLifeManager.emit('vital:recorded', {
  bloodPressureSystolic: 150,
  bloodPressureDiastolic: 95
});

// AI processes
onVitalRecorded(vital) {
  if (vital.bloodPressureSystolic > 140) {
    // Generate warning
    createInsight({
      type: 'warning',
      priority: 'high',
      title: 'Blood Pressure Elevated',
      message: 'Your BP is high...'
    });

    // Emit alert
    emit('alert:high-bp', vital);
  }
}

// Component listens
useEffect(() => {
  aiLifeManager.on('alert:high-bp', (vital) => {
    showNotification('High BP detected!');
  });
}, []);
```

## Database Schema

### AI Learning Data (localStorage)
```json
{
  "preferences": {
    "restReminderTime": "14:00",
    "energyThreshold": 3
  },
  "patterns": {
    "morningEnergy": "usually-low",
    "painTriggers": ["sitting", "weather"]
  },
  "correlations": [
    {
      "id": "corr-1",
      "variable1": "Hydration",
      "variable2": "Pain",
      "correlation": -0.65,
      "confidence": 0.85,
      "description": "Higher hydration = lower pain"
    }
  ],
  "insights": [
    // Pattern insights stored for analysis
  ],
  "userFeedback": {
    "insight-123": 1,  // thumbs up
    "insight-456": -1  // thumbs down
  }
}
```

### IndexedDB Tables (via Dexie)
```
vitals         → Health measurements
medications    → Med tracking
hydration      → Water/sodium logs
pain           → Pain tracking
mood           → Energy/emotional state
education      → Course progress
tasks          → Task management
patternInsights → Detected patterns
```

## Performance Optimization

### Caching Strategy
```
Insights Cache
├─ Generated insights stored in Map
├─ Expired after dismissal
└─ Cleared on page refresh

Daily Report Cache
├─ Generated once per day
├─ Refreshed on manual request
└─ Cached in component state

Correlation Cache
├─ Calculated daily at 10 PM
├─ Stored in learningData
└─ Available immediately on load
```

### Monitoring Intervals
```
Real-time: Event-driven (immediate)
Periodic:  Every 15 minutes (configurable)
Daily:     10 PM (correlations)
On-demand: Manual refresh
```

## Security & Privacy

```
┌─────────────────────────────────┐
│      All Data Local Only        │
│  ┌───────────────────────────┐  │
│  │   IndexedDB (Dexie)       │  │
│  │   • Health data           │  │
│  │   • Personal data         │  │
│  │   • Course data           │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │   localStorage            │  │
│  │   • AI learning data      │  │
│  │   • Preferences           │  │
│  │   • User feedback         │  │
│  └───────────────────────────┘  │
│                                  │
│  ❌ No external API calls        │
│  ❌ No data transmission         │
│  ❌ No cloud storage             │
│  ✅ Complete privacy             │
│  ✅ Offline-first                │
│  ✅ User-controlled              │
└─────────────────────────────────┘
```

## Scalability

### Adding New Features
```
1. Create your feature
2. Save data to IndexedDB
3. Emit event: aiLifeManager.emit('your-event', data)
4. AI automatically processes
5. Insights appear in dashboard

No changes needed to AI core!
```

### Adding New AI Roles
```typescript
// 1. Add to AI_ROLES
{
  id: 'new-role',
  name: 'Role Name',
  description: 'What it does',
  active: true,
  capabilities: ['cap1', 'cap2'],
  priority: 7
}

// 2. Add event handlers
private onNewEvent(data) {
  // Process data
  // Generate insights
}

// 3. Add to generateInsights()
if (roleActive('new-role')) {
  // Check conditions
  // Create insights
}
```

### Adding New Insight Types
```typescript
// Define new type
type InsightType =
  | 'suggestion'
  | 'warning'
  | 'achievement'
  | 'pattern'
  | 'prediction'
  | 'reminder'
  | 'your-new-type';  // Add here

// Generate in generateInsights()
insights.push({
  id: `insight-${Date.now()}`,
  type: 'your-new-type',
  priority: 'medium',
  title: 'New Insight',
  message: 'Details...'
});
```

## Deployment

### Development
```bash
npm run dev
# AI Manager auto-starts monitoring
# Visit /ai-life-manager
```

### Production
```bash
npm run build
# AI Manager included in bundle
# No configuration needed
# Works offline
```

### Testing
```typescript
// 1. Log test data
await db.vitals.add({ /* test vital */ });

// 2. Emit event
aiLifeManager.emit('vital:recorded', vital);

// 3. Check insights
const insights = await aiLifeManager.generateInsights();
console.log(insights);

// 4. View in UI
// Navigate to /ai-life-manager
```

## Troubleshooting Architecture

```
Problem: No insights appearing
  ├─ Check: Is monitoring running?
  │    └─ Fix: aiLifeManager.startMonitoring()
  ├─ Check: Is data in database?
  │    └─ Fix: Add test data
  ├─ Check: Are roles active?
  │    └─ Fix: Enable roles in settings
  └─ Check: Console for errors
       └─ Fix: Debug error messages

Problem: Events not firing
  ├─ Check: Event name spelling
  ├─ Check: Listener registered
  │    └─ aiLifeManager.on('event', handler)
  └─ Check: Event emitted
       └─ aiLifeManager.emit('event', data)

Problem: Correlations not found
  ├─ Need: 5+ days of data
  ├─ Need: Data points for both variables
  └─ Threshold: Correlation > 0.3
```

---

This architecture is designed to be:
- **Modular** - Easy to extend
- **Scalable** - Handles growth
- **Performant** - Optimized caching
- **Private** - Local-only data
- **Resilient** - Error handling
- **Maintainable** - Clear structure
