# Kol's Hub - Platform Support Guide

## Overview

Kol's Hub is built for universal cross-platform deployment. A single codebase runs on PWA (web), Windows, macOS, Linux (via Electron), iOS, and Android (via Capacitor). Each platform receives full feature parity with platform-specific optimizations.

**Supported Platforms:**
- Progressive Web App (PWA)
- Windows 10+ Desktop
- macOS 10.13+ Desktop
- Linux (AppImage, DEB, RPM)
- iOS 13+ (iPhone & iPad)
- Android 7+ (Phones & Tablets)

---

## Platform Feature Matrix

| Feature | PWA | Windows | macOS | Linux | iOS | Android |
|---------|-----|---------|-------|-------|-----|---------|
| **Core Features** |
| All Health Features | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Medication Tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vitals Tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Financial Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Passive Income | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Learning Hub | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Entertainment | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Advanced Features** |
| Offline Mode | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cloud Sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Biometric Auth | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Wearable Sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Platform-Specific** |
| Install as App | ✅ | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| System Tray | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Native Window | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| App Shortcuts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3D Avatar (Full) | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| Haptic Feedback | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

**Legend:** ✅ = Full Support, ⚠️ = Limited/Reduced, ❌ = Not Available

---

## Build Commands

### Web/PWA Build
```bash
# Development server
npm run dev
# Opens: http://localhost:5173

# Production build
npm run build
# Output: dist/

# Preview production build
npm run preview
# Opens: http://localhost:4173

# Deploy to Netlify (automated)
git push origin main
```

### Desktop Applications

#### Windows Build
```bash
# Build Windows installer
npm run build:electron:win
# Output: dist-electron/KolsHub-Setup-1.0.0.exe

# Build portable executable
npm run build:electron:win-portable
# Output: dist-electron/KolsHub-Portable-1.0.0.exe

# Development mode
npm run electron:dev
```

**Output Files:**
- `KolsHub-Setup-1.0.0.exe` - NSIS installer with wizard
- `KolsHub-Portable-1.0.0.exe` - Standalone executable (no install needed)

**Requirements:**
- Windows 10 or later
- 200 MB disk space
- 4 GB RAM recommended

#### macOS Build
```bash
# Build macOS DMG installer
npm run build:electron:mac
# Output: dist-electron/KolsHub-1.0.0.dmg

# Build macOS ZIP
npm run build:electron:mac-zip
# Output: dist-electron/KolsHub-1.0.0.zip

# Development mode (macOS only)
npm run electron:dev
```

**Output Files:**
- `KolsHub-1.0.0.dmg` - Drag-to-Applications installer
- `KolsHub-1.0.0.zip` - Alternative distribution format

**Requirements:**
- macOS 10.13 (High Sierra) or later
- 200 MB disk space
- Code signing configured (optional but recommended for distribution)

#### Linux Build
```bash
# Build all Linux formats
npm run build:electron:linux
# Outputs: dist-electron/ with all formats

# Build AppImage (universal portable)
npm run build:electron:linux-appimage
# Output: dist-electron/KolsHub-1.0.0.AppImage

# Build DEB package (Debian/Ubuntu)
npm run build:electron:linux-deb
# Output: dist-electron/kolshub_1.0.0_amd64.deb

# Build RPM package (Fedora/RHEL)
npm run build:electron:linux-rpm
# Output: dist-electron/kolshub-1.0.0.x86_64.rpm
```

**Output Files:**
- `KolsHub-1.0.0.AppImage` - Universal portable format
- `kolshub_1.0.0_amd64.deb` - Debian/Ubuntu package
- `kolshub-1.0.0.x86_64.rpm` - Fedora/RHEL package

**Requirements:**
- Linux kernel 3.10+
- 200 MB disk space
- Different formats for different distributions

#### Build All Desktop Platforms
```bash
# Build for all OS (requires appropriate tools installed)
npm run build:electron

# Build for current OS only
npm run build:desktop
```

### Mobile Applications

#### Android Build
```bash
# Sync web build to Android project
npm run build:android
# Opens Android Studio automatically

# Or manual sync
npm run build
npx cap sync android
npx cap open android

# Build release APK (in Android Studio)
# Build > Build Bundle(s) / APK(s) > Build APK(s)
# Output: android/app/build/outputs/apk/release/app-release.apk

# Quick build command
npm run android:build-release
```

**Gradle Build Output:**
```
✓ Built in 25 seconds
✓ APK generated: app-release.apk
✓ Ready for Google Play Store
```

**Requirements:**
- Android SDK 24+ (Android 7.0)
- Gradle 8.13
- Java 11+
- 500 MB disk space for build cache

**Installation on Device:**
```bash
# Via USB cable
adb install app-release.apk

# Via Google Play Store
# Upload to Play Console → Internal Testing → Share link → Install

# Via direct APK share
# Transfer APK to device → Open with file manager → Install
```

#### iOS Build
```bash
# Sync web build to iOS project
npm run build:ios
# Opens Xcode automatically (macOS only)

# Or manual sync
npm run build
npx cap sync ios
npx cap open ios

# Build in Xcode
# Product > Build for > Running (for simulator)
# Product > Archive (for App Store)
```

**Xcode Build:**
- Select target device or simulator
- Product > Build
- App appears in build folder
- For App Store: Archive > Distribute App > App Store Connect

**Requirements:**
- macOS 11 (Big Sur) or later
- Xcode 13+
- iOS 13 deployment target
- Apple Developer Account for distribution
- 3 GB disk space

---

## Electron Configuration

Located in `electron/main.ts` and `electron/preload.ts`:

### Main Process
```typescript
// electron/main.ts
const mainWindow = createWindow();
mainWindow.webContents.send('app-version', {
  app: app.getVersion(),
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  node: process.versions.node,
});

// Handle app events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Auto-updater
autoUpdater.checkForUpdatesAndNotify();
```

### Preload Script
```typescript
// electron/preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  openExternalLink: (url: string) => ipcRenderer.invoke('open-external', url),
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window'),
});
```

### Configuration Features
- **Single Instance Lock** - Only one app instance
- **Auto-Update** - Background app updates
- **System Tray** - Minimize to system tray
- **Native Menu** - Platform-specific menus
- **Keyboard Shortcuts** - Global shortcuts
- **Dev Tools** - Debug in development mode

---

## Capacitor Configuration

Located in `capacitor.config.ts`:

### iOS Configuration
```typescript
{
  "appId": "com.kolshub.app",
  "appName": "Kol's Hub",
  "webDir": "dist",
  "ios": {
    "contentInset": "automatic",
    "preferredContentMode": "desktop",
    "limitsNavigationsToAppBoundDomains": true
  },
  "plugins": {
    "CapacitorHttp": {
      "enabled": true
    },
    "Keyboard": {
      "resize": "body",
      "resizeOnFullScreen": true
    }
  }
}
```

### Android Configuration
```typescript
{
  "android": {
    "backgroundColor": "#1a1a1a",
    "useLegacyBridge": false,
    "webContentsDebuggingEnabled": false
  },
  "plugins": {
    "Keyboard": {
      "resize": "none"
    }
  }
}
```

### Capacitor Plugins
Located in `capacitor.config.ts`:

```
@capacitor/app@5.0.8          - App state management
@capacitor/haptics@5.0.8      - Vibration feedback
@capacitor/keyboard@5.0.9     - Keyboard control
@capacitor/status-bar@5.0.8   - Status bar theming
```

### Native Features
- **App Lifecycle** - Handle pause/resume events
- **Haptic Feedback** - Vibration on interactions
- **Keyboard Handling** - Auto-hide keyboard
- **Status Bar** - Dynamic theming (dark/light mode)
- **Permissions** - Camera, photo, storage access
- **Deeplinks** - Handle app URL schemes

---

## PWA Manifest and Service Worker

### Web App Manifest (`public/manifest.json`)
```json
{
  "name": "Kol's Hub - Personal Operating System",
  "short_name": "Kol's Hub",
  "description": "Your complete personal operating system",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#1a1a1a",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/screenshot1.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "Health Dashboard",
      "short_name": "Health",
      "description": "View your health metrics",
      "url": "/health",
      "icons": [{ "src": "/icons/health-icon.png", "sizes": "192x192" }]
    }
  ]
}
```

### Service Worker Configuration (`vite-plugin-pwa`)
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: 'Kol\'s Hub',
        short_name: 'Hub',
        theme_color: '#1a1a1a',
      },
      workbox: {
        globPatterns: ['**/*.{html,css,js,woff2}'],
        globIgnores: ['**/three-vendor-*.js'],
        runtimeCaching: [
          {
            urlPattern: /three-vendor/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'three-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ]
});
```

### Service Worker Features
- **Offline Support** - Cached assets serve when offline
- **Background Sync** - Queue actions, sync when online
- **Push Notifications** - Server can send notifications
- **Updates** - Auto-detect and install new versions
- **Precaching** - 129 entries (~5.37 MB precached)

### PWA Installation
**On Web:**
1. Visit https://kolshub.netlify.app
2. Click "Install" prompt (varies by browser)
3. App installs to home screen/app drawer

**On Android:**
- Automatic install prompt after 30 seconds
- Manual: Menu > "Install app" or "Add to Home Screen"

**On iOS:**
- Limited PWA support (Safari only)
- Manual: Share > Add to Home Screen

---

## Docker Deployment

### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 3s
      retries: 3

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

### Docker Build and Run
```bash
# Build image
docker build -t kolshub/app:latest .

# Run locally
docker-compose up -d

# View logs
docker logs -f kolshub-web-1

# Deploy to registry
docker push kolshub/app:latest

# Pull and run production
docker pull kolshub/app:latest
docker run -p 3000:3000 \
  -e VITE_GOOGLE_CLIENT_ID=your_id \
  kolshub/app:latest
```

### Health Check
The app includes `healthcheck.js` for monitoring:
```javascript
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => process.exit(1));
request.end();
```

---

## CI/CD Pipeline

Located in `.github/workflows/`:

### Build Workflow (`.github/workflows/build.yml`)
```yaml
name: Build All Platforms

on:
  push:
    tags:
      - 'v*'

jobs:
  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod

  windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build:electron:win

  macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build:electron:mac

  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: 11
      - uses: android-actions/setup-android@v2
      - run: npm install && npm run build:android
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm test`)
- [ ] Build successful for all platforms (`npm run build:all`)
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] New Relic API key set
- [ ] Stripe/PayPal credentials configured

### Web Deployment
- [ ] Repository pushed to GitHub
- [ ] Netlify auto-deploys from main branch
- [ ] Verify deployment at https://kolshub.netlify.app
- [ ] PWA manifest valid
- [ ] Service Worker registers successfully

### Desktop Deployment
- [ ] Signed binaries for macOS (optional)
- [ ] Published to GitHub Releases
- [ ] Available at https://kolshub.net/download
- [ ] Auto-updater configured in Electron

### Mobile Deployment
- [ ] iOS: Submitted to App Store
- [ ] Android: Uploaded to Google Play Store
- [ ] Privacy policy updated
- [ ] App Store listings complete
- [ ] Screenshots and descriptions added

### Docker Deployment
- [ ] Docker image builds successfully
- [ ] Health checks pass
- [ ] Published to Docker Hub / GHCR
- [ ] Multi-stage build optimized
- [ ] Database credentials secure

---

## Platform-Specific Considerations

### Network Handling
```typescript
// Detect offline status
window.addEventListener('offline', () => {
  showNotification('You are offline - using cached data');
});

window.addEventListener('online', () => {
  syncManager.syncAll();
  showNotification('Back online - syncing data');
});
```

### Permission Requests
```typescript
// Request needed permissions
async function requestPermissions() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Show notifications
    }
  }

  if ('camera' in navigator) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Use camera
  }
}
```

### Platform Detection
```typescript
function getPlatform() {
  if (window.electron) return 'electron';
  if (window.Capacitor) return 'capacitor';
  if (window.location.protocol === 'file:') return 'file';
  return 'web';
}
```

---

## Conclusion

Kol's Hub provides unified codebase deployment across six platforms with full feature parity and platform-specific optimizations. The build system, Electron configuration, Capacitor setup, and Docker containerization enable seamless distribution across all supported platforms. Choose the deployment method that best suits your distribution needs.
