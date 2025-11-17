# 🖤 KOL - Complete System Guide
**Knowledge Organization Layer v1.0**  
*Your Personal Operating System*

---

## 🎯 Quick Start

### First Time Setup
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your API keys (see API Reference section)

3. **Launch Application**
   ```bash
   # Desktop App
   npm run electron:dev
   
   # Web App  
   npm run dev
   
   # Or use the launcher
   🖤-START-KOL.bat
   ```

---

## 📱 Platform Support

### Desktop (Windows/Mac/Linux)
- **Technology**: Electron
- **Command**: `npm run electron:dev`
- **Build**: `npm run electron:build`
- **Features**: Full offline support, system integration

### Web (Browser)
- **Technology**: React + Vite PWA
- **Command**: `npm run dev`
- **Deploy**: Netlify (see Deployment section)
- **Features**: Online/offline, installable PWA

### Mobile (iOS/Android)
- **Technology**: Capacitor
- **Build Android**: `npm run build:mobile && cd android && ./gradlew assembleDebug`
- **Build iOS**: `npm run build:mobile && cd ios && xcodebuild`
- **Features**: Native mobile app with offline support

---

## 🗂️ Project Structure

```
unified-mega-app/
├── src/
│   ├── components/      # React components
│   ├── services/        # Business logic & APIs
│   ├── store/          # State management (IndexedDB)│   ├── types/          # TypeScript definitions
│   ├── utils/          # Helper functions
│   └── data/           # Static data & features
├── public/             # Static assets
├── electron/           # Desktop app code
├── android/            # Android mobile app
├── ios/                # iOS mobile app
├── Scripts/            # Build & utility scripts
├── docs/              # Documentation
└── _ARCHIVE/          # Historical files

```

---

## 🎨 Core Features

### Health Management
- **Medication Tracking**: Excel import, scheduling, reminders
- **Symptom Logging**: Track symptoms with spoon theory integration
- **Medical Records**: Secure storage with encryption
- **Patient Portal Integration**: MySaintLukes, myUHealth
- **Wearable Sync**: Apple Watch, Fitbit support
- **Appointment Management**: Calendar integration

### AI Companion (Kol)
- **4 Emotional Modes**: Companion, Creative, Archivist, Rebel
- **6 Virtual Sanctums**: Health, Art, Activism, Ancestry, Rest, Ritual
- **3D Avatar**: Ready Player Me integration (ID: 68e94e474099d80b93c9b714)
- **Voice Interaction**: Speech recognition & synthesis
- **Contextual Responses**: Learns from your patterns
- **Memory System**: Persistent conversation history

### Music & Media
- **Streaming Integration**: Spotify, YouTube, SoundCloud
- **Playlist Management**: Cross-platform sync
- **Mood-Based Selection**: AI-curated playlists
- **Offline Playback**: Downloaded music support
- **Lyrics Display**: Real-time synchronized lyrics

### Organization & Planning
- **Task Management**: Priority-based with energy tracking
- **Calendar Integration**: Google Calendar, iCal
- **Note Taking**: Markdown support with tagging
- **Document Management**: File organization with search
- **Project Tracking**: Goals, milestones, progress
### Communication & Advocacy
- **Self-Advocacy Scripts**: Pre-written templates
- **Support Network**: Contact management
- **Crisis Resources**: Quick access emergency info
- **Disability Rights**: Legal resources & guides
- **Communication Cards**: Downloadable advocacy cards

### Creative Tools
- **Writing Studio**: Distraction-free editor
- **Art Gallery**: Portfolio management
- **Music Composition**: Basic sequencer
- **Journaling**: Daily prompts & reflection
- **Idea Capture**: Quick notes & voice memos

### Spiritual & Wellness
- **Meditation Timer**: Guided & custom sessions
- **Tarot Journal**: Reading tracker & interpretations
- **Moon Phases**: Lunar calendar integration
- **Ritual Planning**: Custom ceremony templates
- **Grounding Exercises**: Trauma-informed techniques

---

## 🔐 API Configuration

### Required API Keys

#### Spotify Integration
```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

**Setup:**
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Add redirect URI: `http://localhost:5173/callback`
4. Copy Client ID and Secret to `.env`

#### Ready Player Me (3D Avatar)
```env
VITE_RPM_SUBDOMAIN=kolhub
VITE_RPM_AVATAR_ID=68e94e474099d80b93c9b714
```

**Setup:**
1. Visit https://readyplayer.me
2. Create your avatar
3. Copy avatar ID from URL
4. Update `.env` file
#### YouTube & SoundCloud
```env
VITE_YOUTUBE_API_KEY=your_youtube_key
VITE_SOUNDCLOUD_CLIENT_ID=your_soundcloud_id
```

#### Healthcare Portals (Optional)
```env
VITE_MYSAINTLUKES_EMAIL=your_email
VITE_MYUHEALTH_EMAIL=your_email
```

---

## 🚀 Deployment

### Web (Netlify)

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Configure Environment Variables**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add all VITE_* variables from `.env`

4. **Set Redirects**
   - Already configured in `public/_redirects`
   - Handles SPA routing

### Desktop (Electron)

**Windows:**
```bash
npm run electron:build
```
Output: `dist/KOL-Setup-1.0.0.exe`

**Mac:**
```bash
npm run electron:build
```
Output: `dist/KOL-1.0.0.dmg`

**Linux:**
```bash
npm run electron:build
```
Output: `dist/KOL-1.0.0.AppImage`

### Mobile (Capacitor)

**Android:**
```bash
# Build web assets
npm run build:mobile

# Open in Android Studio
cd android
./gradlew assembleDebug

# Or build directly
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`
**iOS:**
```bash
# Build web assets
npm run build:mobile

# Open in Xcode
cd ios/App
open App.xcworkspace

# Build through Xcode UI
```

---

## 💾 Data Storage

### IndexedDB (Primary Storage)
- **Location**: Browser's IndexedDB
- **Features**: Large capacity, offline support
- **Tables**: 
  - medications
  - symptoms
  - appointments
  - notes
  - conversations
  - settings

### LocalStorage (Settings)
- **Location**: Browser's localStorage
- **Purpose**: App preferences, UI state
- **Size**: ~5-10MB limit

### File System (Desktop Only)
- **Location**: User documents folder
- **Purpose**: Exports, backups, imports
- **Access**: Electron file system API

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Environment Setup
```bash
# Clone repository
git clone [repo-url]
cd unified-mega-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure API keys
# Edit .env with your keys

# Start development server
npm run dev
```

### Available Scripts

**Development:**
- `npm run dev` - Start web dev server (Vite)
- `npm run electron:dev` - Start Electron app
- `npm run build` - Build for production
**Build:**
- `npm run electron:build` - Build Electron app
- `npm run build:mobile` - Build for Capacitor

**Mobile:**
- `npm run mobile:sync` - Sync web build to mobile
- `npm run mobile:android` - Open Android Studio
- `npm run mobile:ios` - Open Xcode

**Utilities:**
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript checks
- `npm test` - Run tests

### Code Structure

**Components:** `src/components/`
```
components/
├── health/           # Health tracking UI
├── ai-companion/     # Kol AI interface
├── music/            # Music player
├── calendar/         # Calendar views
├── advocacy/         # Advocacy tools
└── shared/           # Reusable components
```

**Services:** `src/services/`
```
services/
├── health.ts         # Health data API
├── ai.ts             # AI companion logic
├── music.ts          # Music streaming
├── storage.ts        # IndexedDB wrapper
└── sync.ts           # Cross-device sync
```

**State Management:** `src/store/`
```
store/
├── health.ts         # Health state
├── user.ts           # User preferences
├── ai.ts             # AI companion state
└── index.ts          # Store configuration
```

---

## 🎮 Feature Reference

### 9000+ Features Organized by Category

1. **Health & Medical** (1500+ features)
   - Medication tracking & reminders
   - Symptom logging with spoon theory
   - Medical records management
   - Appointment scheduling
   - Insurance tracking
   - Lab results integration

2. **Mental Health & Wellness** (1200+ features)
   - Mood tracking & patterns
   - Therapy journal
   - Crisis management tools   - Grounding exercises
   - Meditation & mindfulness
   - Sleep tracking

3. **Support & Relationships** (800+ features)
   - Contact management
   - Support network mapping
   - Communication templates
   - Relationship tracking
   - Social energy management

4. **Advocacy & Education** (1000+ features)
   - Self-advocacy scripts
   - Disability rights resources
   - Medical advocacy tools
   - Education materials
   - Community organizing

5. **Organization & Daily Life** (1200+ features)
   - Task management
   - Calendar integration
   - Note-taking system
   - Document organization
   - Financial tracking

6. **Communication Tools** (600+ features)
   - Email templates
   - Text message scripts
   - Call preparation guides
   - Meeting agendas
   - Emergency cards

7. **Spiritual & Ritual** (500+ features)
   - Tarot journal
   - Moon phase tracking
   - Meditation guides
   - Ritual planning
   - Altar design

8. **Creative & Learning** (1100+ features)
   - Writing studio
   - Art portfolio
   - Music composition
   - Learning tracker
   - Project management

9. **Community & Activism** (700+ features)
   - Event planning
   - Volunteer coordination
   - Campaign management
   - Resource sharing
   - Community building

**Full Feature Database:** See `KolHub_Ideas_9000_detailed.json`

---

## 🔧 Troubleshooting
### Common Issues

**Port Already in Use**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or change port in vite.config.ts
```

**Build Failures**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

**Electron Won't Start**
```bash
# Rebuild native modules
npm run electron:rebuild

# Check Electron version
npm list electron
```

**Mobile Build Issues**
```bash
# Android: Clean build
cd android
./gradlew clean

# iOS: Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

**Database Errors**
- Open DevTools → Application → IndexedDB
- Delete corrupted databases
- Refresh page to recreate

**API Connection Failures**
- Check `.env` file exists
- Verify API keys are valid
- Check network connectivity
- Review browser console for CORS errors

---

## 📊 Performance Optimization

### Web Performance
- **Bundle Size**: Target <500KB main bundle
- **Code Splitting**: Dynamic imports for routes
- **Image Optimization**: WebP format, lazy loading
- **Service Worker**: Aggressive caching strategy

### Mobile Performance
- **Native APIs**: Use Capacitor plugins
- **Memory Management**: Clear unused data
- **Battery Optimization**: Reduce background tasks
- **Offline First**: Cache critical resources

### Desktop Performance
- **IPC Optimization**: Batch renderer-main communication
- **Memory Limits**: Monitor Electron heap
- **Native Modules**: Prebuilt binaries where possible
---

## 🔒 Security

### Data Encryption
- **At Rest**: IndexedDB encryption for sensitive data
- **In Transit**: HTTPS for all API calls
- **Credentials**: Environment variables, never committed

### Privacy
- **Local First**: Data stays on device by default
- **Optional Sync**: Cloud sync is opt-in
- **No Tracking**: No analytics or telemetry by default
- **GDPR Compliant**: Data export and deletion tools

### API Keys
- **Never Commit**: Use `.env` files
- **Rotate Regularly**: Update keys periodically
- **Scope Limits**: Minimal permissions
- **Secure Storage**: System keychain on desktop

---

## 🎯 Roadmap

### Version 1.1 (Q1 2025)
- [ ] Voice commands for AI companion
- [ ] Advanced wearable integration
- [ ] Telemedicine portal
- [ ] Community features
- [ ] Plugin system

### Version 1.2 (Q2 2025)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Custom themes
- [ ] Data export improvements
- [ ] Third-party integrations

### Version 2.0 (Q3 2025)
- [ ] ChronoMuse metaverse
- [ ] VR/AR support
- [ ] Advanced AI features
- [ ] Social networking
- [ ] Marketplace

---

## 📝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Update DEVELOPER-LOG.md
4. Test across platforms
5. Submit pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier configuration
- **Linting**: ESLint rules
- **Testing**: Jest + React Testing Library

### Documentation
- Update guides for new features
- Add JSDoc comments
- Include examples
- Update changelog
---

## 📚 Resources

### Documentation
- **Complete Guide**: This file
- **Developer Log**: DEVELOPER-LOG.md
- **API Reference**: docs/API-REFERENCE.md
- **Feature Database**: KolHub_Ideas_9000_detailed.json

### External Links
- **Ready Player Me**: https://readyplayer.me
- **Spotify Developers**: https://developer.spotify.com
- **Capacitor Docs**: https://capacitorjs.com
- **Electron Docs**: https://electronjs.org
- **React Docs**: https://react.dev

### Support
- **Issues**: GitHub Issues (when repository is public)
- **Discussions**: GitHub Discussions
- **Email**: [Contact email when available]

---

## 🖤 About KOL

**KOL (Knowledge Organization Layer)** is a personal operating system designed for individuals managing chronic health conditions. Built with accessibility, trauma-informed design, and spoon theory at its core.

### Design Philosophy
- **User-Centered**: Built around real user needs
- **Accessibility First**: WCAG AA compliant
- **Trauma-Informed**: Safe, predictable interactions
- **Energy-Aware**: Spoon theory integration
- **Gothic Futurism**: Dark themes with neon accents

### Technical Vision
- **Cross-Platform**: Desktop, web, mobile
- **Offline-First**: Works without internet
- **Consolidated**: One app for everything
- **Evolving**: Continuous improvement
- **Open**: Transparent development

### Creator
Built by Kol with assistance from AI collaboration tools, designed to meet the specific needs of chronically ill individuals who need comprehensive life management in one place.

---

**Last Updated**: November 13, 2025  
**Version**: 1.0.0  
**License**: [To be determined]

---

*"Your personal operating system, designed with care for those who need it most."*
