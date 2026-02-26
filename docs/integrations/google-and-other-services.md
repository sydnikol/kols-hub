# Google Services, Healthcare, and Advanced Integrations

**Last Updated:** November 20, 2025
**Status:** Production Ready
**Total Integrations:** 20+ Services

---

## Table of Contents

1. [Google Workspace Integration](#google-workspace-integration)
2. [Health and Fitness Services](#health-and-fitness-services)
3. [Healthcare Integrations](#healthcare-integrations)
4. [Phone and Wearable Integration](#phone-and-wearable-integration)
5. [Advanced Integrations](#advanced-integrations)
6. [Automation and MCP Servers](#automation-and-mcp-servers)

---

## Google Workspace Integration

Google Workspace provides 20+ integrated services through a unified OAuth authentication system.

### OAuth 2.0 Setup

**Scopes Required:**

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

**Scopes Requested:**

```typescript
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/keep'
];
```

### Google Fit (Health Tracking)

**Purpose:** Real-time health data synchronization with automatic Spoon Theory calculations.

**Available Data Types:**

| Data Type | Endpoint | Update Frequency | Use Case |
|-----------|----------|-----------------|----------|
| **Steps** | `/fitness/steps` | Real-time | Daily activity tracking |
| **Heart Rate** | `/fitness/heart_rate` | Continuous | Cardiovascular health |
| **Sleep** | `/fitness/sleep` | Daily | Rest and recovery |
| **Calories** | `/fitness/calories` | Real-time | Energy expenditure |
| **Blood Pressure** | `/fitness/blood_pressure` | Manual | Health monitoring |
| **Body Temperature** | `/fitness/body_temperature` | Manual | Fever detection |
| **Weight** | `/fitness/body_metrics` | Weekly | Health trends |

**Spoon Theory Integration:**

Spoon Theory is an energy management framework. KOL Hub converts health metrics into "spoons" (units of energy):

```typescript
const calculateSpoons = async (healthData: HealthMetrics): Promise<number> => {
  const baseSpoons = 5; // Default daily spoons
  
  // Adjust based on sleep
  const sleepHours = healthData.sleepDuration / 3600;
  const sleepAdjustment = (sleepHours - 8) * 0.5; // Adjust -0.5 per hour from 8h
  
  // Adjust based on pain level
  const painAdjustment = -(healthData.painLevel || 0) * 0.3;
  
  // Adjust based on heart rate (stress indicator)
  const restingHR = healthData.restingHeartRate || 60;
  const stressAdjustment = (restingHR - 60) * 0.02; // Higher HR = more stress
  
  // Adjust based on recent activity
  const activityAdjustment = -(healthData.stepsToday / 10000) * 0.5;
  
  return Math.max(0, baseSpoons + sleepAdjustment + painAdjustment + stressAdjustment + activityAdjustment);
};
```

**Implementation:**

```typescript
const getHealthSnapshot = async () => {
  const [steps, heartRate, sleep] = await Promise.all([
    googleFitService.getSteps(Date.now() - 24*60*60*1000, Date.now()),
    googleFitService.getHeartRate(Date.now() - 24*60*60*1000, Date.now()),
    googleFitService.getSleep(Date.now() - 24*60*60*1000, Date.now())
  ]);

  const spoons = await calculateSpoons({
    stepsToday: steps.total,
    restingHeartRate: heartRate.resting,
    sleepDuration: sleep.totalDuration,
    painLevel: await getPainLevel()
  });

  return {
    steps: steps.total,
    heartRate: heartRate.current,
    sleep: `${sleep.totalDuration / 3600}h`,
    spoons: Math.round(spoons * 10) / 10,
    trend: steps.total > 5000 ? 'active' : 'sedentary'
  };
};
```

### Google Calendar

**Purpose:** Event scheduling, meeting management, and community event discovery.

**Key Endpoints:**

- `GET /calendar/v3/calendars/primary/events` - List events
- `POST /calendar/v3/calendars/primary/events` - Create event
- `PUT /calendar/v3/calendars/primary/events/{eventId}` - Update event
- `DELETE /calendar/v3/calendars/primary/events/{eventId}` - Delete event
- `GET /calendar/v3/calendars/primary/events/{eventId}` - Get event details

**Advanced Features:**

```typescript
// Find free time between meetings
const findFreeSlots = async (minDuration: number = 60): Promise<TimeSlot[]> => {
  const events = await googleCalendarService.getEvents({
    timeMin: new Date().toISOString(),
    timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });

  const workingHours = { start: 9, end: 17 };
  const slots: TimeSlot[] = [];

  for (let day = 0; day < 7; day++) {
    let currentTime = new Date();
    currentTime.setDate(currentTime.getDate() + day);
    currentTime.setHours(workingHours.start, 0, 0, 0);

    const endOfDay = new Date(currentTime);
    endOfDay.setHours(workingHours.end, 0, 0, 0);

    const dayEvents = events.filter(e => 
      new Date(e.start.dateTime).toDateString() === currentTime.toDateString()
    );

    dayEvents.forEach(event => {
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);

      if (currentTime < eventStart) {
        const durationMinutes = (eventStart.getTime() - currentTime.getTime()) / (60 * 1000);
        if (durationMinutes >= minDuration) {
          slots.push({
            start: new Date(currentTime),
            end: new Date(eventStart),
            duration: durationMinutes
          });
        }
      }

      currentTime = new Date(eventEnd);
    });

    if (currentTime < endOfDay) {
      const durationMinutes = (endOfDay.getTime() - currentTime.getTime()) / (60 * 1000);
      if (durationMinutes >= minDuration) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(endOfDay),
          duration: durationMinutes
        });
      }
    }
  }

  return slots;
};
```

### Google Drive & Photos

**Google Drive:**
- Cloud file storage and sync
- Activity tracking
- Version history
- File sharing and collaboration

**Google Photos:**
- Photo sync and backup
- Virtual wardrobe management
- Memory albums
- Auto-organization by date

**Implementation:**

```typescript
// Sync all photos for wardrobe management
const buildVirtualWardrobe = async () => {
  const photos = await googlePhotosService.getAllPhotos();
  
  const filtered = photos.filter(photo => 
    photo.filename.toLowerCase().includes('outfit') ||
    photo.filename.toLowerCase().includes('wardrobe') ||
    photo.description?.toLowerCase().includes('outfit')
  );

  return filtered.map(photo => ({
    id: photo.id,
    url: photo.baseUrl,
    date: photo.creationTime,
    tags: extractTags(photo.description),
    occasion: classifyOccasion(photo.description)
  }));
};
```

### Google Keep

**Purpose:** Note sync, ideas vault, and journaling.

**Features:**
- Automatic sync across devices
- Rich text formatting
- Voice-to-text notes
- Checklists and reminders

### Google Translate

**Purpose:** Multi-language support and accessibility.

**Key Endpoints:**
- `POST /language/translate/v2` - Translate text
- Supports 100+ languages
- Real-time translation

**Usage:**

```typescript
const translateContent = async (text: string, targetLanguage: string) => {
  return await googleTranslateService.translate(text, {
    targetLanguage: targetLanguage,
    format: 'text'
  });
};
```

---

## Health and Fitness Services

Multiple health platforms integrate for comprehensive wellness tracking.

### HealthKit (Apple Health)

**iOS Only Integration**

**Available Data:**

- Heart rate variability
- Blood oxygen levels
- ECG readings
- Workout data
- Nutrition information
- Mental health metrics

**Implementation:**

```typescript
const requestHealthKitPermissions = async () => {
  const permissions = [
    'HKQuantityTypeIdentifierHeartRate',
    'HKQuantityTypeIdentifierStepCount',
    'HKCategoryTypeIdentifierSleepAnalysis',
    'HKQuantityTypeIdentifierBloodPressureSystolic'
  ];

  return await healthKitService.requestAuthorization(permissions);
};
```

### Fitbit

**OAuth 2.0 Integration**

**Tracked Metrics:**
- Activity (steps, distance, floors)
- Sleep (duration, stages, quality)
- Heart rate (continuous monitoring)
- Calories burned
- Weight and body metrics

**Setup:**

```env
VITE_FITBIT_CLIENT_ID=your_client_id
VITE_FITBIT_CLIENT_SECRET=your_client_secret
VITE_FITBIT_REDIRECT_URI=http://localhost:5173/oauth/fitbit
```

**Data Synchronization:**

```typescript
const syncFitbitData = async () => {
  const today = new Date().toISOString().split('T')[0];

  const [activities, sleep, heartRate] = await Promise.all([
    fitbitService.getActivities(today),
    fitbitService.getSleep(today),
    fitbitService.getHeartRate(today)
  ]);

  return {
    steps: activities.summary.steps,
    activeMinutes: activities.summary.activeMinutes,
    sleep: sleep.summary.totalMinutesAsleep / 60,
    heartRate: heartRate.average,
    syncedAt: new Date()
  };
};
```

### Samsung Health

**OAuth 2.0 Integration**

**Features:**
- Wearable device sync (Galaxy Watch)
- Exercise tracking
- Health insights
- Stress management
- Sleep analysis

---

## Healthcare Integrations

Professional healthcare data integration with HIPAA compliance.

### Redox Engine

**FHIR API Integration**

Redox provides standardized healthcare data exchange using HL7 FHIR (Fast Healthcare Interoperability Resources) standard.

**Capabilities:**
- EHR integration
- Patient data access
- Medication management
- Vital signs
- Lab results

**Implementation:**

```typescript
const getPatientData = async (patientId: string) => {
  const patient = await redoxService.getPatient(patientId);
  const medications = await redoxService.getMedications(patientId);
  const vitals = await redoxService.getVitals(patientId);
  const labs = await redoxService.getLabResults(patientId);

  return {
    patient: {
      name: patient.name,
      dob: patient.dateOfBirth,
      mrn: patient.medicalRecordNumber
    },
    activemedications: medications,
    recentVitals: vitals.slice(0, 5),
    labResults: labs
  };
};
```

**FHIR Resource Types:**
- Patient
- Observation (vitals, labs)
- Medication
- MedicationRequest
- Procedure
- Condition
- AllergyIntolerance

### Nabla

**Clinical Documentation API**

Nabla integrates ambient documentation and clinical data capture.

**Features:**
- Automatic clinical note generation
- ICD/CPT code suggestions
- Voice-to-text documentation
- Integration with EHR systems

**Usage:**

```typescript
const generateClinicalNote = async (encounter: EncounterData) => {
  const note = await nablaService.generateNote({
    patientId: encounter.patientId,
    visitDate: encounter.date,
    symptoms: encounter.symptoms,
    examination: encounter.examination,
    assessment: encounter.assessment,
    plan: encounter.plan
  });

  const codes = await nablaService.suggestCodes(note.text);

  return {
    note: note.text,
    suggestedICDCodes: codes.icd10,
    suggestedCPTCodes: codes.cpt
  };
};
```

### NexHealth

**Appointment and Patient Management**

NexHealth handles:
- Appointment scheduling
- Patient form management
- Insurance verification
- Billing and payments

**Implementation:**

```typescript
const scheduleAppointment = async (appointment: AppointmentRequest) => {
  return await nexhealthService.createAppointment({
    patientId: appointment.patientId,
    providerId: appointment.providerId,
    dateTime: appointment.dateTime,
    appointmentType: appointment.type,
    reason: appointment.reason
  });
};

const verifyInsurance = async (patientId: string) => {
  return await nexhealthService.verifyInsurance(patientId);
};
```

---

## Phone and Wearable Integration

### Pixel Watch Integration

**Android Wearable Support**

Pixel Watch provides real-time health metrics and notifications.

**Features:**
- Heart rate monitoring
- Sleep tracking
- Stress detection
- Workout tracking
- Gesture controls

**Data Synchronization:**

```typescript
const syncPixelWatchData = async () => {
  return await googleFitService.getRealtimeData({
    dataType: ['heart_rate', 'steps', 'sleep'],
    device: 'wear_os',
    frequency: 'realtime'
  });
};
```

### Pixel Companion App

**Mobile App Integration**

The Pixel Companion app provides:
- Device controls
- Call and SMS notifications
- App notifications
- Health data sync

**Notification Handling:**

```typescript
const registerNotificationHandler = () => {
  messaging.onMessage((message) => {
    if (message.data.type === 'health_alert') {
      displayHealthNotification(message.data);
    } else if (message.data.type === 'earnings_milestone') {
      displayEarningsNotification(message.data);
    }
  });
};
```

---

## Advanced Integrations

### Zapier Automation Hub

**8,000+ App Integration Platform**

Zapier connects KOL Hub to thousands of other services without custom code.

**Use Cases:**

1. **Email to Task Automation**
   - Forward emails to create tasks
   - Attach task to calendar
   - Notify on completion

2. **Passive Income Tracking**
   - Log earnings to spreadsheet
   - Create daily summaries
   - Send SMS alerts for milestones

3. **Social Media Publishing**
   - Schedule posts across platforms
   - Auto-create calendar events for live streams
   - Track engagement metrics

4. **Data Synchronization**
   - Sync data between Google Drive and other cloud services
   - Auto-backup important documents
   - Consolidate analytics from multiple sources

**Setup:**

```env
VITE_ZAPIER_API_KEY=your_api_key
```

**Common Zaps:**

```typescript
// Create task from email
const createTaskFromEmail = async (email: EmailMessage) => {
  return await zapierService.trigger('email_to_task', {
    email: email.from,
    subject: email.subject,
    content: email.body
  });
};

// Log earnings to spreadsheet
const logEarnings = async (amount: number, source: string) => {
  return await zapierService.trigger('log_earnings', {
    amount: amount,
    source: source,
    date: new Date().toISOString(),
    spreadsheetId: EARNINGS_SPREADSHEET_ID
  });
};

// Send notification on milestone
const notifyMilestone = async (milestone: string) => {
  return await zapierService.trigger('milestone_notification', {
    milestone: milestone,
    sms: process.env.USER_PHONE_NUMBER,
    email: process.env.USER_EMAIL
  });
};
```

### Ancestry and Genealogy

**Family Tree and Health History**

Ancestry integration provides:
- Family tree building
- Heritage tracking
- Health history documentation
- Genetic insights

**Implementation:**

```typescript
const buildFamilyTree = async () => {
  const tree = await ancestryService.getFamilyTree(userId);
  const healthHistory = tree.members.map(member => ({
    name: member.name,
    generation: member.generation,
    healthConditions: member.healthNotes,
    lifespan: `${member.birthYear}-${member.deathYear}`
  }));

  return healthHistory;
};
```

### Wikipedia Content Automation

**Research and Content Generation**

Wikipedia integration enables:
- Auto-research for content generation
- Trending topic discovery
- Content fact-checking
- Citation management

**API Usage:**

```typescript
const researchTopic = async (topic: string) => {
  const article = await wikipediaService.getArticle(topic);

  return {
    title: article.title,
    summary: article.extract,
    sections: article.sections,
    references: article.references,
    images: article.images,
    relatedTopics: article.links
  };
};
```

**Content Generation Integration:**

```typescript
const generateContentWithResearch = async (topic: string) => {
  // Research the topic
  const research = await researchTopic(topic);

  // Generate content using AI
  const content = await aiService.generateContent({
    topic: topic,
    research: research,
    style: 'informative',
    length: 'medium'
  });

  // Add Wikipedia citations
  const cited = addCitations(content, research.references);

  return cited;
};
```

---

## Automation and MCP Servers

### Model Context Protocol (MCP)

MCP enables standardized connections to external AI services and data sources.

**Supported Servers:**

1. **Versa Networks MCP**
   - Network management
   - Security analytics
   - SD-WAN routing
   - Real-time monitoring

2. **Vantage Cost Management**
   - Cloud cost tracking
   - Budget alerts
   - Cost optimization
   - Multi-cloud analysis

3. **Auth0 Authentication**
   - Enterprise user authentication
   - OAuth2 flows
   - Social login integration
   - MFA and security

4. **Telnyx Communications**
   - SMS messaging
   - Voice calls
   - Video conferencing
   - Phone number management

**Implementation:**

```typescript
import { mcpServerIntegration } from './services/mcp-server-integration';

// Register custom MCP server
const registerCustomServer = async () => {
  await mcpServerIntegration.registerServer({
    id: 'my-custom-server',
    name: 'My Custom MCP Server',
    url: 'ws://localhost:3000',
    type: 'custom',
    capabilities: ['data-analysis', 'reporting']
  });
};

// Send request to MCP server
const requestData = async () => {
  const response = await mcpServerIntegration.sendRequest({
    server: 'vantage-cost',
    method: 'getCosts',
    params: {
      service: 'openai',
      startDate: '2025-01-01',
      endDate: '2025-02-26'
    }
  });

  return response.data;
};
```

**Circuit Breaker Protection:**

MCP connections include automatic failover:

```typescript
// If Vantage server is down, circuit breaker opens
// Request fails fast without waiting for timeout
// Automatic retry after 60 seconds
const response = await mcpServerIntegration.sendRequest({
  server: 'vantage-cost',
  method: 'getCosts',
  params: { /* ... */ }
});

// Response either contains data or fails fast with circuit breaker status
if (response.success) {
  console.log('Cost data:', response.data);
} else if (response.error === 'CIRCUIT_BREAKER_OPEN') {
  console.log('Service temporarily unavailable, will retry soon');
  showOfflineMode();
}
```

---

## Configuration Summary

### Required Environment Variables

```env
# Google Services
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your_client_secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# Health Services
VITE_FITBIT_CLIENT_ID=your_client_id
VITE_FITBIT_CLIENT_SECRET=your_client_secret
VITE_SAMSUNG_HEALTH_API_KEY=your_api_key

# Healthcare APIs
VITE_REDOX_API_KEY=your_api_key
VITE_NABLA_API_KEY=your_api_key
VITE_NEXHEALTH_API_KEY=your_api_key

# Advanced Services
VITE_ZAPIER_API_KEY=your_api_key
VITE_ANCESTRY_API_KEY=your_api_key

# MCP Servers
VITE_VERSA_MCP_URL=ws://localhost:3000
VITE_VANTAGE_MCP_URL=ws://localhost:3001
VITE_AUTH0_MCP_URL=ws://localhost:3002
VITE_TELNYX_MCP_URL=ws://localhost:3003
```

### Service Implementation Files

- `src/services/googleFitService.ts` (600+ lines)
- `src/services/googleCloudServices.ts` (465+ lines)
- `src/services/healthKitService.ts` (400+ lines)
- `src/services/fitbitService.ts` (500+ lines)
- `src/services/redoxHealthcareService.ts` (600+ lines)
- `src/services/zapierAutomationService.ts` (700+ lines)
- `src/services/mcp-server-integration.ts` (800+ lines)

---

## Integration Summary

This documentation covers:

**Google Workspace:** Fit (Spoon Theory), Calendar, Drive, Photos, Keep, Translate

**Health Services:** HealthKit, Fitbit, Samsung Health, Google Fit

**Healthcare:** Redox, Nabla, NexHealth with HIPAA compliance

**Wearables:** Pixel Watch, Pixel Companion App with real-time sync

**Automation:** Zapier (8,000+ app integration)

**Advanced:** Ancestry genealogy, Wikipedia research, MCP servers with circuit breaker protection

All integrations are production-ready with comprehensive error handling, automatic synchronization, and enterprise security.

**For complete integration overview, refer to:** `docs/integrations/overview.md`

