# Kol's Hub - Adaptive Support Platform

A comprehensive wellness and adaptive support system designed for managing chronic conditions, daily life management, and personal well-being through AI-powered insights and extensive third-party integrations.

## Overview

Kol's Hub is a full-stack application that provides holistic support for chronic illness management with features including condition tracking, AI companion assistance, sensory-safe wardrobe planning, and seamless integration with 40+ wellness and health applications.

## Key Features

### Health & Wellness Tracking
- Chronic condition management with care instructions
- Medication tracking (PRN and scheduled) with adherence monitoring
- Vital signs logging (blood pressure, heart rate, oxygen, temperature)
- Hydration and sodium intake tracking with smart alerts
- Body weather tracking (pain, energy, mood, spoon count with trend analysis)
- Emergency profile for first responders

### Daily Life Management
- Ritual and self-care routine tracking with low-energy variants
- Chore management and task tracking with aide assignment
- Pet care bonding activities and care logs
- Meal planning with preferences and auto-generated grocery lists
- Communication scripts for medical advocacy
- Educational handbooks for partners, family, and caregivers

### Wardrobe Comfort Engine
- Sensory-safe garment tracking with EDS-friendliness flags
- Context-aware outfit suggestions based on pain/energy/weather
- Wear comfort logging with reliability scoring
- Backup outfit planning

### AI Companion (ChronoMuse)
- Natural language voice interaction with text-to-speech
- Contextual awareness of health data and energy levels
- Personalized insights from wearable and activity data
- Multi-language support (English, Spanish, French, German, Chinese, Japanese)

### Integrations (40+ Supported Apps)

**Music & Media:** Spotify, Apple Music, YouTube Music

**Health & Fitness:** Fitbit, Apple Health, Google Fit, MyFitnessPal, WaterMinder

**Productivity:** Google Calendar, Todoist, Notion, Evernote

**Wellness:** Calm, Headspace, Insight Timer

**Healthcare:** Teladoc, Doctor On Demand, CVS/Walgreens

**Transportation:** Uber, Lyft

**Shopping:** Amazon, Instacart

**Communication:** Discord, Slack, WhatsApp

**Other:** Weather.com, Sleep Cycle, Clue/Flo period tracking

## Technology Stack

- **Frontend:** TypeScript, React
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Mobile:** Capacitor (iOS/Android), Electron (Desktop)
- **Speech:** Deepgram (STT), ElevenLabs (TTS)
- **AI:** Anthropic Claude
- **Deployment:** Netlify, Docker, Railway
- **Architecture:** Microservices with plugin system

## Supported Platforms

- Web (PWA with offline support)
- Windows & macOS (Electron)
- Linux
- iOS & Android (Capacitor)
- Docker

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (optional for persistence)
- API Keys: Anthropic, Deepgram, ElevenLabs, Fitbit (optional), Twilio (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/sydnikol/adaptive-support-hub.git
cd adaptive-support-hub

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# Build the project
npm run build

# Start development server
npm run dev

# Or start production server
npm start
```

## Project Structure

```
src/
├── models/              # TypeScript interfaces and types
│   ├── HealthModels.ts
│   ├── WardrobeModels.ts
│   └── DailyLifeModels.ts
├── services/            # Core business logic (12+ services)
│   ├── AICompanionService.ts
│   ├── VoiceInteractionService.ts
│   ├── HealthManagementService.ts
│   ├── HydrationTrackingService.ts
│   ├── WardrobeComfortService.ts
│   ├── BiometricAuthService.ts
│   ├── CloudSyncService.ts
│   └── ... more services
├── integrations/        # Third-party API integrations
│   ├── WearableIntegration.ts
│   ├── HealthPortalIntegration.ts
│   ├── MusicStreamingService.ts
│   └── ReadyPlayerMeIntegration.ts
├── plugins/             # Extensible plugin system
├── api/                 # REST API routes
├── middleware/          # Express middleware
└── index.ts             # Main server application

public/                  # PWA assets and manifest
docs/                    # Documentation
```

## API Endpoints

### Health Management
- `POST /api/health/conditions` - Add condition
- `GET /api/health/conditions/:userId` - Get conditions
- `POST /api/health/medications` - Add medication
- `POST /api/health/medications/log` - Log medication taken
- `POST /api/health/vitals` - Log vital signs

### Hydration & Nutrition
- `POST /api/hydration/log` - Log fluid intake
- `POST /api/sodium/log` - Log sodium intake
- `GET /api/nutrition/summary/:userId/:date` - Daily summary

### Wardrobe
- `POST /api/wardrobe/items` - Add wardrobe item
- `GET /api/wardrobe/items/:userId` - Get wardrobe
- `POST /api/wardrobe/outfits` - Create outfit
- `POST /api/wardrobe/suggest` - AI outfit suggestion

### Daily Life
- `POST /api/rituals` - Add ritual
- `POST /api/body-weather` - Log body weather
- `GET /api/body-weather/trends/:userId` - Get trends

### AI & Voice
- `POST /api/ai/message` - Message AI companion
- `POST /api/voice/start` - Start voice session
- `POST /api/voice/transcribe` - Transcribe audio

### Data Export
- `POST /api/reports/doctor` - Generate doctor report
- `GET /api/export/:userId/:format` - Export (json/csv/pdf)

## Design Principles

This system is built on accessibility, chronic illness support, and user privacy:

- **Accessibility First:** Large tap targets, dyslexia-friendly fonts, high contrast options
- **Spoon Theory:** Respecting energy limitations with low-energy mode variants
- **Chronic Illness Support:** Purpose-built for POTS, EDS, and related conditions
- **Privacy & Security:** Local-first data storage with optional encrypted cloud sync
- **Customization:** Highly adaptable to individual needs and preferences
- **Dark Themes:** Gothic Dark, Dark Velvet, Modern Noir aesthetic options

## Documentation

Additional guides are available in the docs/ folder:
- `setup/` - Installation and configuration guides
- `features/` - Feature documentation
- `integrations/` - App integration guides
- `architecture/` - System architecture documentation

## Development

### Creating a Plugin

```javascript
// plugins/my-plugin/manifest.json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Custom functionality",
  "author": "Your Name",
  "main": "index.js"
}

// plugins/my-plugin/index.js
export default class MyPlugin {
  constructor(config) {
    this.config = config;
  }

  async onLoad() {
    console.log('Plugin loaded');
  }

  async onMessage(message) {
    return message;
  }

  async onWearableData(data) {
    return data;
  }
}
```

### Adding Translations

Add translation files in `src/locales/{lang}.json`:

```json
{
  "common": {
    "welcome": "Welcome"
  },
  "health": {
    "medicationReminder": "Time to take your medication"
  }
}
```

## Contributing

This is a personal open-source project. Suggestions and feedback are welcome. Please open an issue to discuss potential changes or improvements.

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built with care for the chronic illness, neurodivergence, and adaptive living communities. Special thanks to all the spoonies and disability warriors for inspiration and resilience.

---

**Note:** This system handles sensitive health data. Always keep API keys secure and enable encryption for cloud sync.
