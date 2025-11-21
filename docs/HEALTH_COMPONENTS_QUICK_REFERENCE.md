# Health Components Quick Reference

## Component Overview

All 5 MVP health features are complete and production-ready with framer-motion animations.

---

## 1. Hydration Dial

**Import:**
```tsx
import HydrationDial from '../components/health/HydrationDial';
```

**Visual Structure:**
```
┌─────────────────────────────────────────────┐
│ 💧 Hydration Tracker        [Reset Day]     │
├─────────────────────────────────────────────┤
│                                             │
│         ╭─────────────────╮                 │
│        │                 │                │
│       │   ┌─────────┐   │               │
│       │   │  2.50   │   │  ← Animated  │
│       │   │ liters  │   │     Circle   │
│       │   │ Goal:3L │   │              │
│       │   │  83%    │   │              │
│       │   └─────────┘   │               │
│        │                 │                │
│         ╰─────────────────╯                 │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │+0.25L│ │+0.5L │ │+0.75L│ │+1.0L │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│                                             │
│  Custom Amount: [____] [+Add] [-Remove]    │
│  Daily Goal: [-0.5L] [3.0L] [+0.5L]        │
│                                             │
│  Today's History:                          │
│  ├─ 3:45 PM  +1.0L                         │
│  ├─ 1:30 PM  +0.5L                         │
│  └─ 9:00 AM  +0.25L                        │
└─────────────────────────────────────────────┘
```

**Colors:** Blue/Cyan gradient
**Key Features:** Circular progress, quick buttons, history

---

## 2. Sodium Tracker

**Import:**
```tsx
import SodiumTracker from '../components/health/SodiumTracker';
```

**Visual Structure:**
```
┌─────────────────────────────────────────────┐
│ 🔥 Sodium Tracker           [Reset Day]     │
├─────────────────────────────────────────────┤
│                                             │
│  3.2g / 4g                          80%     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░                      │
│  ⚠️ You need 0.8g more to reach goal        │
│                                             │
│  Quick Add:                                │
│  ┌────────────┐ ┌────────────┐            │
│  │Salt packet │ │Electrolyte │            │
│  │   0.5g     │ │ drink 0.3g │            │
│  └────────────┘ └────────────┘            │
│  ┌────────────┐ ┌────────────┐            │
│  │Salty snack │ │Canned soup │            │
│  │   0.4g     │ │   1.0g     │            │
│  └────────────┘ └────────────┘            │
│                                             │
│  Custom Entry:                             │
│  Food source: [______________]             │
│  Amount: [0.5] [+Add] [-Remove]            │
│                                             │
│  Today's Log:                              │
│  ├─ Salt packet      3:00 PM  +0.5g        │
│  ├─ Electrolyte     12:00 PM  +0.3g        │
│  └─ Pickle           9:00 AM  +0.3g        │
│                                             │
│  ℹ️ POTS Management: 4-6g daily sodium    │
└─────────────────────────────────────────────┘
```

**Colors:** Orange/Red gradient
**Key Features:** Progress bar, preset foods, source tracking

---

## 3. Body Weather Dial

**Import:**
```tsx
import BodyWeatherDial from '../components/health/BodyWeatherDial';
```

**Visual Structure:**
```
┌─────────────────────────────────────────────┐
│ Body Weather            [Show Details]      │
├─────────────────────────────────────────────┤
│                                             │
│        ╔═══════════════════════╗            │
│        ║                       ║            │
│        ║         ⛅            ║            │
│        ║   Partly Cloudy      ║            │
│        ║  Doing okay. Some    ║            │
│        ║  fatigue or mild     ║            │
│        ║     symptoms         ║            │
│        ║    📈 Stable         ║            │
│        ╚═══════════════════════╝            │
│                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │  ☀️   │ │  ⛅    │ │  ☁️   │         │
│  │ Sunny  │ │ Partly │ │ Cloudy │         │
│  └────────┘ └────────┘ └────────┘         │
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │  🌧️  │ │  ⛈️   │ │  🌫️  │         │
│  │ Rainy  │ │ Stormy │ │ Foggy  │         │
│  └────────┘ └────────┘ └────────┘         │
│                                             │
│  Energy:  ▓▓▓▓▓░░░░░ 5/10                 │
│  Pain:    ▓▓▓▓░░░░░░ 4/10                 │
│  Mood:    ▓▓▓▓▓▓░░░░ 6/10                 │
│                                             │
│  Notes: [Feeling okay today...]           │
│                                             │
│  Recent Check-Ins:                         │
│  ├─ ⛅ Partly Cloudy  3:45 PM  E:5 P:4 M:6 │
│  └─ ☁️ Cloudy        9:00 AM  E:3 P:6 M:4 │
└─────────────────────────────────────────────┘
```

**Colors:** Indigo/Purple gradient
**Key Features:** Weather icons, metrics, trend analysis

---

## 4. Pain Map

**Import:**
```tsx
import PainMap from '../components/health/PainMap';
```

**Visual Structure:**
```
┌─────────────────────────────────────────────┐
│ ⚡ Pain Map                 [Clear All]     │
├─────────────────────────────────────────────┤
│                                             │
│  Active: 3  |  Avg: 6.5/10  |  Today: 3    │
│                                             │
│  Click on body area where you feel pain    │
│  ┌─────────────────────────┐               │
│  │          ( )            │  ← Head       │
│  │           |             │               │
│  │      🔴   |   🔴        │  ← Shoulders  │
│  │          /_\            │               │
│  │         /   \           │               │
│  │        |     |          │               │
│  │      🟡|     |          │  ← Arms       │
│  │        |_____|          │               │
│  │        |     |          │               │
│  │        |     |          │               │
│  │       / \   / \         │  ← Legs       │
│  │      |   | |   |        │               │
│  └─────────────────────────┘               │
│                                             │
│  🟡 Mild (1-3)  🟠 Moderate (4-6)  🔴 Severe│
│                                             │
│  [Add Pain Point]                          │
│                                             │
│  Active Pain Points:                       │
│  ├─ 🔴 Left Shoulder - Sharp 8/10          │
│  │  Triggered by reaching  2:30 PM  [×]    │
│  ├─ 🔴 Right Knee - Throbbing 7/10         │
│  │  Walking pain  12:00 PM  [×]            │
│  └─ 🟡 Lower Back - Dull 3/10              │
│     Sitting too long  9:00 AM  [×]         │
└─────────────────────────────────────────────┘
```

**Colors:** Red/Pink gradient
**Key Features:** Interactive body map, color-coded pain levels

---

## 5. Crisis Calm Mode

**Import:**
```tsx
import CrisisCalmMode from '../components/crisis/CrisisCalmMode';
```

**Visual Structure (Inactive):**
```
┌─────────────────────────────────────────────┐
│ 💜 Crisis Calm Mode                         │
├─────────────────────────────────────────────┤
│                                             │
│  A fullscreen guided breathing and         │
│  grounding experience with slow,            │
│  calming text.                             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │    ▶️  Enter Calm Mode               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  What happens in Calm Mode:                │
│  • Fullscreen calming interface            │
│  • Slow-reveal affirmations                │
│  • One-tap emergency contacts              │
│  • Minimal stimulation, maximum support    │
└─────────────────────────────────────────────┘
```

**Visual Structure (Active - Fullscreen):**
```
╔═════════════════════════════════════════════╗
║ [×]                            [🔊]         ║
║                                             ║
║                                             ║
║              ◯◯◯◯◯◯◯                        ║
║            ◯         ◯     ← Breathing     ║
║           ◯           ◯      Circle        ║
║           ◯           ◯    (animated)      ║
║            ◯         ◯                     ║
║              ◯◯◯◯◯◯◯                        ║
║                                             ║
║                                             ║
║         You are safe right now.            ║
║                                             ║
║                                             ║
║     ●●●●●○○○○○○○○○○  ← Progress            ║
║                                             ║
║  ┌────────────────────────────────────┐    ║
║  │ Emergency Contacts                 │    ║
║  │ [🚨 911] [☎️ 988] [👥 Partner]     │    ║
║  └────────────────────────────────────┘    ║
╚═════════════════════════════════════════════╝
```

**Colors:** Deep Indigo/Purple/Black gradient
**Key Features:** Fullscreen mode, breathing animations, emergency contacts

---

## Animation Details

### Framer Motion Patterns Used

**Container Entrance:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

**Button Interactions:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

**List Items:**
```tsx
<AnimatePresence>
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
  />
</AnimatePresence>
```

**Breathing Animation:**
```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.6, 0.3],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
```

---

## Data Flow

### LocalStorage Keys
```typescript
'hydration-data'      // Hydration tracking
'sodium-data'         // Sodium intake
'body-weather-data'   // Body weather states
'pain-map-data'       // Pain points
```

### Data Structures
```typescript
// Hydration
{
  currentLiters: number;
  goalLiters: number;
  history: HydrationEntry[];
  lastUpdated: number;
}

// Sodium
{
  currentGrams: number;
  history: SodiumEntry[];
  lastUpdated: number;
}

// Body Weather
{
  currentStatus: WeatherStatus;
  energy: number;
  pain: number;
  mood: number;
  history: WeatherEntry[];
  lastUpdated: number;
}

// Pain Map
{
  painPoints: PainPoint[];
  lastUpdated: number;
}
```

---

## Integration Example

### Full Health Dashboard Layout
```tsx
import React from 'react';
import HydrationDial from './components/health/HydrationDial';
import SodiumTracker from './components/health/SodiumTracker';
import BodyWeatherDial from './components/health/BodyWeatherDial';
import PainMap from './components/health/PainMap';
import CrisisCalmMode from './components/crisis/CrisisCalmMode';

const HealthDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        Health Dashboard
      </h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <HydrationDial />
        <SodiumTracker />
        <BodyWeatherDial />
        <PainMap />
      </div>

      {/* Crisis Support */}
      <CrisisCalmMode />
    </div>
  );
};
```

---

## Mobile Responsiveness

All components adapt to mobile:

**Desktop (lg+):**
- 2-column grid layout
- Larger text and spacing
- Hover effects enabled

**Tablet (md):**
- 2-column for some, 1-column for others
- Medium text sizing
- Touch-optimized targets

**Mobile (sm):**
- Full-width 1-column
- Larger touch targets (minimum 44px)
- Simplified layouts
- Stacked elements

---

## Color Theme Reference

```css
/* Hydration - Blue/Cyan */
from-blue-900/30 to-cyan-900/30
border-blue-500/30
text-blue-400

/* Sodium - Orange/Red */
from-orange-900/30 to-red-900/30
border-orange-500/30
text-orange-400

/* Body Weather - Indigo/Purple */
from-indigo-900/30 to-purple-900/30
border-indigo-500/30
text-indigo-400

/* Pain Map - Red/Pink */
from-red-900/30 to-pink-900/30
border-red-500/30
text-red-400

/* Crisis Calm - Deep Purple/Black */
from-indigo-950 via-purple-950 to-black
border-purple-500/30
text-purple-400
```

---

## Component Sizes

**Hydration Dial:**
- Min height: ~600px
- Circular dial: 256x256px
- Responsive width: 100%

**Sodium Tracker:**
- Min height: ~550px
- Progress bar: Full width, 32px height
- Responsive width: 100%

**Body Weather Dial:**
- Min height: ~650px (collapsed), ~900px (expanded)
- Weather icon display: 96x96px
- Responsive width: 100%

**Pain Map:**
- Min height: ~750px
- Body diagram: Max 448px wide, aspect ratio 2:3
- Responsive width: 100%

**Crisis Calm Mode:**
- Fullscreen: 100vw x 100vh
- Breathing circle: 192x192px
- Text: 3xl (mobile) to 5xl (desktop)

---

## Status Summary

| Component | Status | Animations | Mobile | Data Persist |
|-----------|--------|-----------|--------|--------------|
| Hydration Dial | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| Sodium Tracker | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| Body Weather | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| Pain Map | ✅ Ready | ✅ Yes | ✅ Yes | ✅ Yes |
| Crisis Calm | ✅ Ready | ✅ Yes | ✅ Yes | ❌ No |

All components are production-ready!

---

**Created:** 2025-11-19
**Version:** 1.0.0
