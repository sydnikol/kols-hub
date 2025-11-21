# AI Life Manager - Central Intelligence System

The **AI Life Manager** is the brain of your unified app - a central intelligence system that coordinates ALL features and provides proactive insights, suggestions, and support across every aspect of your life.

## Overview

The AI Life Manager acts as 14 different roles working together to support you:

1. **Housewife** - Home management, chores, cleaning schedules
2. **Teacher** - Learning tracking, course suggestions, educational support
3. **Partner** - Emotional support, companionship, relationship tracking
4. **Health Advocate** - Vitals monitoring, medication reminders, health correlations
5. **Caretaker** - Care team coordination, appointments, delegation
6. **Money Manager** - Passive income tracking, expense monitoring, financial goals
7. **Helper** - Task assistance, automation, productivity support
8. **Personal Assistant** - Calendar management, reminders, organization
9. **Social Worker** - Community connections, support network facilitation
10. **Fighter** - Advocacy support, self-advocacy scripts, empowerment
11. **Therapist** - Mental health support, crisis intervention, coping strategies
12. **Mentor** - Personal growth, goal tracking, skill development
13. **Home Manager** - Household operations, inventory management
14. **Doctor** - Health monitoring, symptom analysis, pattern detection

## Architecture

### Core Components

```
src/
├── services/
│   └── aiLifeManager.ts          # Main AI service (singleton)
├── hooks/
│   └── useAIManager.ts            # React hooks for AI integration
├── components/
│   └── ai/
│       └── AIManagerDashboard.tsx # Visual dashboard component
└── pages/
    └── AILifeManagerPage.tsx      # Full AI manager interface
```

### Key Features

#### 1. Event-Driven Architecture
```typescript
// Listen to events from any feature
aiLifeManager.on('vital:recorded', (data) => {
  // React to vital sign changes
});

// Emit events from your features
aiLifeManager.emit('medication:taken', medicationData);
```

#### 2. Real-Time Monitoring
- Automatic checks every 15 minutes
- Crisis detection for concerning vitals
- Pattern recognition across all data
- Proactive suggestions and alerts

#### 3. Cross-Feature Intelligence
- Correlates data from health, education, finance, tasks, etc.
- Finds patterns you might miss
- Predicts energy levels and crash days
- Suggests interventions based on holistic view

#### 4. Daily Intelligence Report
- Health score (0-100)
- Energy prediction (spoons)
- Achievements
- Alerts and recommendations
- Stats across all features

## Usage

### Basic Setup

```typescript
import { aiLifeManager } from '../services/aiLifeManager';

// Start monitoring (runs automatically)
aiLifeManager.startMonitoring(15); // Check every 15 minutes
```

### Using React Hooks

```typescript
import { useAIManager, useAIInsights, useCrisisDetection } from '../hooks/useAIManager';

function MyComponent() {
  const { insights, dailyReport, dismissInsight } = useAIManager();
  const { crisis } = useCrisisDetection();

  // Display insights
  return (
    <div>
      {insights.map(insight => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onDismiss={dismissInsight}
        />
      ))}
    </div>
  );
}
```

### Emitting Events

From your feature components, emit events to notify the AI:

```typescript
import { aiLifeManager } from '../services/aiLifeManager';

// When user logs vitals
await db.vitals.add(vitalData);
aiLifeManager.emit('vital:recorded', vitalData);

// When medication is taken
await db.medications.update(id, { lastTaken: new Date() });
aiLifeManager.emit('medication:taken', medication);

// When course progress updates
await db.education.update(courseId, { progress: newProgress });
aiLifeManager.emit('course:progress', course);
```

### Available Events

**Health Events:**
- `vital:recorded` - New vital signs logged
- `medication:taken` - Medication marked as taken
- `hydration:logged` - Water/sodium intake logged
- `pain:logged` - Pain entry recorded
- `mood:logged` - Mood/energy check-in

**Learning Events:**
- `course:progress` - Course progress updated
- `achievement:unlocked` - Learning milestone reached

**Financial Events:**
- `income:earned` - Passive income recorded
- `expense:logged` - Expense tracked

**Task Events:**
- `task:completed` - Task marked as done
- `task:created` - New task added

**System Events:**
- `crisis:detected` - Crisis situation identified
- `insights:updated` - New AI insights available
- `alert:*` - Various alert types

## AI Insights

The AI generates different types of insights:

### Insight Types

- **Suggestion** - Helpful recommendations
- **Warning** - Important alerts requiring attention
- **Achievement** - Celebrations of accomplishments
- **Pattern** - Detected correlations and trends
- **Prediction** - Forecasts about energy, crashes, etc.
- **Reminder** - Time-based notifications

### Priority Levels

- **Urgent** - Requires immediate attention (red)
- **High** - Important but not critical (orange)
- **Medium** - Useful to know (yellow)
- **Low** - Nice to have (blue)

### Example Insights

```typescript
{
  id: "insight-hydration-123",
  timestamp: new Date(),
  role: "health-advocate",
  type: "warning",
  priority: "high",
  title: "Low Hydration Detected",
  message: "You've only had 800mL of water today. Your POTS symptoms may worsen.",
  actionable: true,
  actions: [
    { id: "log-water", label: "Log Water Intake", type: "navigate" },
    { id: "dismiss", label: "Dismiss", type: "dismiss" }
  ]
}
```

## Health Correlations

The AI automatically analyzes your health data to find correlations:

```typescript
import { useHealthCorrelations } from '../hooks/useAIManager';

function CorrelationsView() {
  const { correlations, analyzing, refresh } = useHealthCorrelations();

  return (
    <div>
      {correlations.map(corr => (
        <div key={corr.id}>
          <h3>{corr.variable1} vs {corr.variable2}</h3>
          <p>{corr.description}</p>
          <p>Confidence: {(corr.confidence * 100).toFixed(0)}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Example Correlations

- "Higher hydration tends to correlate with lower pain levels"
- "Better hydration correlates with higher energy levels"
- "Pain increases after eating certain foods"
- "Energy drops before weather changes"

## Crisis Detection

The AI monitors for crisis situations:

```typescript
const crisis = await aiLifeManager.detectCrisis();

if (crisis.detected) {
  console.log('Severity:', crisis.severity); // none, low, medium, high, critical
  console.log('Triggers:', crisis.triggers);
  console.log('Recommendations:', crisis.recommendations);
  console.log('Notify care team?', crisis.notifyCareTeam);
}
```

### Crisis Triggers

- Blood pressure critically high (>180 systolic)
- Oxygen level critically low (<90%)
- Heart rate very elevated (>120 for POTS)
- Severe pain (9-10/10)
- Severe anxiety (9-10/10)
- Critically low energy (1 spoon)

## Daily Report

Get a comprehensive daily intelligence report:

```typescript
import { useDailyReport } from '../hooks/useAIManager';

function DailySummary() {
  const { report, loading, refresh } = useDailyReport();

  if (!report) return null;

  return (
    <div>
      <h2>Daily Report</h2>
      <p>{report.summary}</p>
      <p>Health Score: {report.healthScore}/100</p>
      <p>Energy Prediction: {report.energyPrediction} spoons</p>
      <ul>
        {report.achievements.map(a => <li key={a}>{a}</li>)}
      </ul>
    </div>
  );
}
```

## Managing AI Roles

Enable/disable specific AI roles:

```typescript
import { useAIRoles } from '../hooks/useAIManager';

function RoleManager() {
  const { roles, activeRoles, toggleRole } = useAIRoles();

  return (
    <div>
      {roles.map(role => (
        <button
          key={role.id}
          onClick={() => toggleRole(role.id, !role.active)}
        >
          {role.name}: {role.active ? 'ON' : 'OFF'}
        </button>
      ))}
    </div>
  );
}
```

## AI Learning & Feedback

The AI learns from your feedback:

```typescript
const { recordFeedback } = useAIManager();

// User liked an insight
recordFeedback(insightId, 1); // thumbs up

// User didn't like an insight
recordFeedback(insightId, -1); // thumbs down
```

This helps the AI improve its suggestions over time.

## Integration Examples

### Health Dashboard Integration

```typescript
// In your health tracking component
const handleVitalSubmit = async (vital: VitalRecord) => {
  // Save to database
  await db.vitals.add(vital);

  // Notify AI
  aiLifeManager.emit('vital:recorded', vital);

  // AI will automatically check for crisis situations
  // and generate insights if needed
};
```

### Education Integration

```typescript
// When course progress updates
const updateProgress = async (courseId: string, minutes: number) => {
  const course = await db.education.get(courseId);
  if (course) {
    course.timeSpent += minutes;
    await db.education.put(course);

    // Notify AI
    aiLifeManager.emit('course:progress', course);

    // AI might celebrate milestones or suggest study breaks
  }
};
```

### Task Management Integration

```typescript
// When task is completed
const completeTask = async (taskId: number) => {
  await db.tasks.update(taskId, { completed: true });
  const task = await db.tasks.get(taskId);

  // Notify AI
  aiLifeManager.emit('task:completed', task);

  // AI will celebrate the achievement
};
```

## Notification System

Get real-time notifications:

```typescript
import { useAINotifications } from '../hooks/useAIManager';

function NotificationBell() {
  const { notifications, dismiss, dismissAll, count } = useAINotifications();

  return (
    <div>
      <button>Notifications ({count})</button>
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          data={notif}
          onDismiss={() => dismiss(notif.id)}
        />
      ))}
    </div>
  );
}
```

## Event Bus

Direct access to the event bus:

```typescript
import { aiLifeManager } from '../services/aiLifeManager';

// Subscribe to specific events
aiLifeManager.on('achievement:hydration-goal', (data) => {
  showCelebration('You met your hydration goal!');
});

// Unsubscribe
const handler = (data) => { /* ... */ };
aiLifeManager.on('alert:high-bp', handler);
aiLifeManager.off('alert:high-bp', handler);
```

## Data Storage

All AI learning data is stored in localStorage:

```json
{
  "preferences": { /* user preferences */ },
  "patterns": { /* detected patterns */ },
  "correlations": [ /* health correlations */ ],
  "insights": [ /* pattern insights */ ],
  "userFeedback": { /* insight ratings */ }
}
```

### Accessing Learning Data

```typescript
import { useAILearning } from '../hooks/useAIManager';

function AILearningView() {
  const learningData = useAILearning();

  return (
    <div>
      <h3>Correlations Found: {learningData.correlations.length}</h3>
      <h3>Patterns Detected: {Object.keys(learningData.patterns).length}</h3>
    </div>
  );
}
```

## Performance

- Monitoring runs every 15 minutes (configurable)
- Insights are cached to prevent excessive calculations
- Correlations are calculated once daily (at 10 PM)
- Event handlers are lightweight and non-blocking

## Future Enhancements

### Planned Features

1. **Machine Learning Integration**
   - More sophisticated pattern detection
   - Better energy prediction models
   - Food/symptom correlation analysis

2. **Voice Assistant**
   - Voice commands for logging data
   - Spoken daily reports
   - Hands-free operation

3. **Care Team Integration**
   - Share insights with caregivers
   - Delegate tasks automatically
   - Emergency alerts

4. **Advanced Analytics**
   - Weather correlation detection
   - Menstrual cycle tracking integration
   - Sleep quality analysis

5. **Automation**
   - Auto-log recurring events
   - Smart reminders based on patterns
   - Predictive task scheduling

## Troubleshooting

### Insights not appearing

1. Check if monitoring is running: `aiLifeManager.startMonitoring()`
2. Verify data exists in the database
3. Check console for errors
4. Ensure roles are active

### Correlations not detected

- Need at least 5 days of data
- Both variables must have data points
- Correlation threshold is 0.3 (30%)

### Events not firing

1. Verify event name spelling
2. Check if event was emitted: `aiLifeManager.emit('event', data)`
3. Ensure listener is registered before event fires

## Contributing

To add a new AI role:

1. Add role to `AI_ROLES` in `aiLifeManager.ts`
2. Define capabilities and priority
3. Create event handlers for role-specific logic
4. Add role icon to components

To add a new insight type:

1. Create insight in `generateInsights()`
2. Define priority and actions
3. Add to appropriate role
4. Test with real data

## License

Part of the Unified Mega App - All rights reserved.

---

**Remember:** The AI Life Manager is YOUR central brain. It learns from you, adapts to you, and works FOR you. The more you use it, the smarter it becomes!
