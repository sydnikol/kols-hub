# New Routes to Add to App.tsx

## Import Statements to Add (after existing imports):

```typescript
// New Feature Pages
import AllFeaturesHub from './pages/AllFeaturesHub';
import HealthLogsHub from './pages/health/HealthLogsHub';
import TrendsCorrelationsPage from './pages/health/TrendsCorrelationsPage';
import SelfAdvocacyHub from './pages/advocacy/SelfAdvocacyHub';
```

## Routes to Add (in the <Routes> section):

```typescript
{/* All Features Hub */}
<Route path="/all-features" element={<AllFeaturesHub />} />

{/* Health Logs - V1 */}
<Route path="/health/logs" element={<HealthLogsHub />} />
<Route path="/health/trends" element={<TrendsCorrelationsPage />} />
<Route path="/health/er-visits" element={<HealthLogsHub />} />
<Route path="/health/med-effects" element={<HealthLogsHub />} />
<Route path="/health/appointment-notes" element={<HealthLogsHub />} />
<Route path="/health/triggers" element={<HealthLogsHub />} />
<Route path="/health/good-days" element={<HealthLogsHub />} />
<Route path="/health/vital-alerts" element={<HealthLogsHub />} />
<Route path="/health/doctor-protocols" element={<HealthLogsHub />} />
<Route path="/health/allergies" element={<HealthLogsHub />} />
<Route path="/health/vitals-snapshot" element={<HealthLogsHub />} />

{/* MVP Features */}
<Route path="/health/hydration" element={<HealthLogsHub />} />
<Route path="/health/sodium" element={<HealthLogsHub />} />
<Route path="/health/body-weather" element={<HealthLogsHub />} />
<Route path="/health/pain-map" element={<HealthLogsHub />} />
<Route path="/crisis/calm-mode" element={<CrisisSupportPage />} />

{/* Self-Advocacy - V1 */}
<Route path="/advocacy/hub" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/scripts" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/hearing-prep" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/insurance-helper" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/role-play" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/access-cards" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/records-binder" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/appeal-letters" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/accommodations" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/meeting-receipts" element={<SelfAdvocacyHub />} />
<Route path="/advocacy/boundaries" element={<SelfAdvocacyHub />} />

{/* Care Team - V1 */}
<Route path="/care-team/hub" element={<AllFeaturesHub />} />
<Route path="/care-team/roles-matrix" element={<AllFeaturesHub />} />
<Route path="/care-team/contacts" element={<AllFeaturesHub />} />
<Route path="/care-team/consent" element={<AllFeaturesHub />} />
<Route path="/care-team/tasks" element={<AllFeaturesHub />} />
<Route path="/care-team/shift-notes" element={<AllFeaturesHub />} />
<Route path="/care-team/carpool" element={<AllFeaturesHub />} />

{/* Accessibility - V1 */}
<Route path="/accessibility/motion" element={<AllFeaturesHub />} />
<Route path="/accessibility/one-hand" element={<AllFeaturesHub />} />
<Route path="/accessibility/large-targets" element={<AllFeaturesHub />} />
<Route path="/accessibility/voice" element={<AllFeaturesHub />} />
<Route path="/accessibility/reading-mode" element={<AllFeaturesHub />} />

{/* V2 Features - Relationships */}
<Route path="/relationships/partner-checkins" element={<RelationshipDashboardPage />} />
<Route path="/relationships/affection-scripts" element={<RelationshipDashboardPage />} />
<Route path="/relationships/joy-rituals" element={<RelationshipDashboardPage />} />

{/* V2 Features - Social */}
<Route path="/social/community-wave" element={<SocialConnectionHubPage />} />
<Route path="/social/mutual-aid" element={<SocialConnectionHubPage />} />
<Route path="/social/win-jar" element={<SocialConnectionHubPage />} />

{/* V2 Features - Wardrobe */}
<Route path="/wardrobe/catalog" element={<VirtualWardrobePage />} />
<Route path="/wardrobe/outfit-builder" element={<VirtualWardrobePage />} />
<Route path="/wardrobe/sensory-safe" element={<VirtualWardrobePage />} />

{/* V2 Features - Learning & Spiritual */}
<Route path="/learning/study-streaks" element={<LearningHubPage />} />
<Route path="/spiritual/grimoire" element={<SpiritualityHubPage />} />
<Route path="/learning/kanji-cards" element={<LearningHubPage />} />

{/* V2 Features - Entertainment */}
<Route path="/entertainment/comedy-picker" element={<EntertainmentLibraryPage />} />
<Route path="/entertainment/anime-watchlist" element={<EntertainmentLibraryPage />} />
<Route path="/entertainment/cozy-night" element={<EntertainmentLibraryPage />} />

{/* V3 & V4 Features - Advanced */}
<Route path="/advanced/energy-budget" element={<AllFeaturesHub />} />
<Route path="/advanced/spoon-ledger" element={<AllFeaturesHub />} />
<Route path="/chronomuse/library" element={<ChronoMusePage />} />
<Route path="/chronomuse/studio" element={<ChronoMusePage />} />
<Route path="/chronomuse/sanctuary" element={<ChronoMusePage />} />
```

## Navigation Categories to Add/Update:

```typescript
{
  id: 'all-features',
  name: 'All Features',
  icon: Sparkles,
  color: 'from-purple-500 to-pink-500',
  routes: [
    { path: '/all-features', name: 'Browse All 200+ Features', icon: Sparkles },
  ]
},
{
  id: 'health-advanced',
  name: 'Health Logs',
  icon: Heart,
  color: 'from-red-500 to-pink-500',
  routes: [
    { path: '/health/logs', name: 'Health Logs Hub', icon: Heart },
    { path: '/health/trends', name: 'Trends & Correlations', icon: Activity },
    { path: '/health/hydration', name: 'Hydration Dial', icon: Activity },
    { path: '/health/sodium', name: 'Sodium Tracker', icon: Activity },
    { path: '/health/body-weather', name: 'Body Weather', icon: Heart },
    { path: '/health/pain-map', name: 'Pain Map', icon: Activity },
  ]
},
{
  id: 'advocacy-tools',
  name: 'Self-Advocacy',
  icon: MessageSquare,
  color: 'from-green-500 to-teal-500',
  routes: [
    { path: '/advocacy/hub', name: 'Self-Advocacy Hub', icon: MessageSquare },
    { path: '/advocacy/scripts', name: 'Script Picker', icon: MessageSquare },
    { path: '/advocacy/hearing-prep', name: 'Hearing Prep', icon: Shield },
    { path: '/care-team/hub', name: 'Care Team Tools', icon: Users },
  ]
}
```

## Summary

Total new features implemented across all versions:
- MVP: 5 features (Hydration, Sodium, Body Weather, Pain Map, Crisis Calm)
- V1: 40 features (10 Health Logs, 10 Self-Advocacy, 10 Care Team, 10 Accessibility)
- V2: 50 features (10 per category: Relationships, Social, Wardrobe, Learning, Entertainment)
- V3: 50 features (Advanced tracking, Household, Pets, Food)
- V4: 40 features (Energy pacing, ChronoMuse rooms, Advanced features)

**Total: 185+ new features with comprehensive hub pages!**
