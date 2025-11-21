# Seed Data System Documentation

This comprehensive seed data system populates ALL features in the app with realistic, helpful data.

## Overview

The seed data system consists of two main files:

1. **`seedData.ts`** - Contains all seed data generation functions
2. **`initializeApp.ts`** - Handles first-run initialization and app setup

## Features Populated

### 1. Health Data
- **Vitals logs**: 30 days of BP, HR, O2, temperature readings (2x daily)
- **Medications**: 6 realistic chronic illness medications with schedules
- **Hydration logs**: 4-8 entries per day for 30 days
- **Pain records**: Pain map entries with locations, triggers, relief methods
- **Body Weather logs**: 14 days of comprehensive check-ins
- **Mood records**: 30 days of mood, energy, anxiety tracking

### 2. ChronoMuse/AI Companion
- **8 conversation history entries** showing different modes and rooms
- **User preferences** for companion settings
- **Contextual conversations** about health, creativity, activism, ancestry

### 3. Education
- **5 courses** at various completion stages:
  - Psychology (65% complete)
  - Web Development (42% complete)
  - Statistics (88% complete)
  - Digital Marketing (100% complete with certificate)
  - Sociology (25% complete)
- **Learning moments** tracking key insights
- **Resume-ready entries** for portfolio building

### 4. Passive Income
- **6 income stream ideas** with realistic potential:
  - Etsy digital printables
  - Print-on-demand t-shirts
  - Notion templates
  - Stock photography
  - YouTube automation
  - Dividend stocks

### 5. Wardrobe
- **24 clothing items** across all categories:
  - Tops, bottoms, dresses, shoes, accessories, outerwear
  - Diverse styles: gothic, minimalist, professional, casual, bohemian
  - AI analysis for some items

### 6. Entertainment
- **5 creative ideas** for art, writing, photography, music, digital art
- Ready to expand with more content

### 7. D&D
- **3 pre-generated characters**:
  - Kira Shadowmend (Half-Elf Rogue, Level 3)
  - Thorin Ironforge (Dwarf Cleric, Level 2)
  - Luna Starwhisper (Tiefling Wizard, Level 4)
- **Active campaign** "The Shattered Crystal" with story log
- **Dice roll history** integrated into story

### 8. Ancestry
- **5 ancestors** spanning 4 generations:
  - Great-grandparents (seamstress & carpenter)
  - Grandparents (teacher/activist & jazz musician)
  - 2nd great-grandmother (midwife & herbalist)
- **Family stories** and cultural background
- **Era-appropriate details** (1898-1948)

### 9. Crisis Support
- **3 advocacy scripts** for medical, workplace, family situations
- **3 support handbooks** for grounding, pain management, safety planning
- **Emergency card** with medical info and contacts

### 10. Calendar/Tasks
- **10 realistic tasks** with priorities and due dates:
  - Medication reminders
  - Health tracking
  - Course work
  - Creative projects
  - Self-care activities

## Usage

### Automatic Initialization (Recommended)

The app automatically initializes with seed data on first run. This is already set up in `main.tsx`:

```typescript
import { autoInitialize } from './utils/initializeApp'

autoInitialize().then(result => {
  if (result.success) {
    console.log('Initialization complete -', result.message)
  }
})
```

### Manual Initialization

```typescript
import { initializeApp } from './utils/initializeApp'

// Initialize with seed data
await initializeApp()

// Initialize without seed data
await initializeApp({ skipSeedData: true })

// Force reload all seed data
await initializeApp({ forceReload: true })
```

### Individual Seed Functions

You can seed individual features:

```typescript
import {
  seedHealthData,
  seedAICompanionData,
  seedEducationData,
  seedPassiveIncomeData,
  seedWardrobeData,
  seedEntertainmentData,
  seedDnDData,
  seedAncestryData,
  seedCrisisSupportData,
  seedCalendarTasksData
} from './utils/seedData'

// Seed only health data
await seedHealthData()

// Seed only education data
await seedEducationData()
```

### Check Initialization Status

```typescript
import { getInitializationStatus, getInitDiagnostics } from './utils/initializeApp'

// Get simple status
const status = getInitializationStatus()
console.log(status)
// {
//   isFirstRun: false,
//   seedDataLoaded: true,
//   version: '1.0.0',
//   timestamp: Date,
//   needsUpdate: false
// }

// Get detailed diagnostics
const diagnostics = getInitDiagnostics()
console.log(diagnostics.recommendations)
```

### Clear All Data

```typescript
import { clearAllData } from './utils/seedData'

// Clear all seed data (preserves initialization flags)
await clearAllData()
```

### Development Helpers

```typescript
import { devReinitialize, resetInitialization } from './utils/initializeApp'

// Force reinitialize with fresh seed data (development only)
await devReinitialize()

// Reset initialization flags only (doesn't touch data)
resetInitialization()
```

## Data Characteristics

### Realistic and Contextual
- Health data includes realistic vitals for someone with chronic illness
- Medications are actual drugs used for POTS, hypertension, chronic pain
- Pain levels vary realistically with weather and activity triggers
- Timestamps are distributed naturally throughout days

### Diverse and Inclusive
- Ancestor data represents African American and Gullah Geechee heritage
- Cultural connections to civil rights movement and jazz history
- Wardrobe includes diverse styles from gothic to professional
- Creative ideas span multiple mediums and difficulty levels

### Lived-In Feel
- Some courses are partially complete, not all at 100%
- Some tasks are already completed, others pending
- Conversations show ongoing relationship with AI companion
- Pain and mood data shows natural variations

### Interconnected
- Medications reference actual prescribers and pharmacies
- Learning moments connect to specific courses
- Tasks reference course deadlines and health activities
- Family stories include specific cultural and historical details

## Version Management

The initialization system tracks versions and can handle updates:

```typescript
// Current version defined in initializeApp.ts
const CURRENT_VERSION = '1.0.0'

// Automatic version checking on app load
// Migrations can be added in handleVersionUpdate()
```

## Best Practices

1. **Let it auto-initialize**: The system is designed to run automatically on first launch
2. **Don't clear data unnecessarily**: Users will lose their progress
3. **Use individual seed functions**: For targeted testing or development
4. **Check status before actions**: Use `getInitializationStatus()` to understand current state
5. **Test with real data**: The seed data is realistic enough for full app testing

## Troubleshooting

### Seed data not loading
```typescript
// Check status
const status = getInitializationStatus()
console.log(status.seedDataLoaded) // Should be true

// Force reload
await initializeApp({ forceReload: true })
```

### App thinks it's first run when it's not
```typescript
// Check localStorage
console.log(localStorage.getItem('app_initialized'))

// Reset if corrupted
resetInitialization()
await initializeApp()
```

### Need fresh data for testing
```typescript
// Clear and reseed
await clearAllData()
await seedAllData()
```

## Future Enhancements

Potential additions to the seed data system:

- [ ] More granular seed options (e.g., "seed last 7 days only")
- [ ] Seed data profiles (light, medium, heavy)
- [ ] Export/import seed configurations
- [ ] Randomization options for different user personas
- [ ] Seed data versioning for feature updates
- [ ] Performance monitoring for large datasets

## Technical Details

### Storage
- IndexedDB via Dexie for structured data
- localStorage for D&D and ancestry data
- All dates use JavaScript Date objects
- Random data uses cryptographically weak randomization (fine for seed data)

### Performance
- Bulk inserts for efficiency (`bulkAdd`)
- Async/await for all database operations
- Lazy loading - data only loads when needed
- No blocking operations on main thread

### Data Integrity
- All foreign key relationships maintained
- Dates are logically ordered
- No duplicate primary keys
- Validation through TypeScript types

## License & Attribution

This seed data system is part of the KOL Hub application.
All seed data is fictional and created for demonstration purposes.
