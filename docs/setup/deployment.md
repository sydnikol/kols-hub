# Deployment Guide

Comprehensive guide for deploying Kol's Hub across web, desktop, mobile, and containerized environments.

## Table of Contents

1. [Web Deployment (Netlify)](#web-deployment-netlify)
2. [Docker Deployment](#docker-deployment)
3. [Desktop Applications (Electron)](#desktop-applications-electron)
4. [Mobile Applications (Capacitor)](#mobile-applications-capacitor)
5. [GitHub Actions CI/CD](#github-actions-cicd)
6. [Build Commands Reference](#build-commands-reference)
7. [GitHub Releases](#github-releases)

---

## Web Deployment (Netlify)

### Prerequisites

- GitHub account with repository access
- Netlify account (free tier available)
- Node.js 18+ installed locally
- All environment variables configured (see environment-config.md)

### Step 1: Connect Repository to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub" as the provider
4. Authorize Netlify to access your repositories
5. Select the `kols-hub-merge` repository
6. Click "Deploy"

### Step 2: Configure Build Settings

Netlify automatically detects settings from `netlify.toml`, but verify:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 (or higher)
- **Environment:** Production

The `netlify.toml` file in your project root contains:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 5173
```

### Step 3: Add Environment Variables

1. In Netlify dashboard, go to: **Site settings → Build & deploy → Environment**
2. Add all variables from your `.env` file (see environment-config.md for complete list)
3. Critical variables:
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`
   - `VITE_ANTHROPIC_API_KEY`
   - `VITE_SPOTIFY_CLIENT_ID` / `VITE_SPOTIFY_CLIENT_SECRET`
   - `VITE_YOUTUBE_API_KEY`
   - All other API keys from environment-config.md
4. Click "Save" to trigger a new deployment

### Step 4: Configure Custom Domain

1. Go to **Domain settings**
2. Click "Add custom domain" (optional)
3. Enter your domain (e.g., kolshub.net)
4. Follow DNS configuration instructions
5. Enable automatic HTTPS

### Step 5: Enable Deploy Previews

Deploy previews are automatically enabled:
- Pull requests trigger preview deployments at unique URLs
- Useful for testing before merging to main branch
- Previews are automatically cleaned up when PR is closed

### Automatic Deployments

GitHub integration automatically deploys:
- **On push to `main`**: Triggers production deployment
- **On pull requests**: Creates preview deployment
- **Rollback**: Redeploy any previous build from deployment history

### Monitoring Deployments

1. Go to **Deploys** tab in Netlify
2. View deployment history and build logs
3. Monitor build times and errors
4. Use **Analytics** for performance metrics

### Troubleshooting Netlify Deployment

**Build fails with "Command not found"**
- Solution: Verify Node version is 18+
- Check: All dependencies are committed (package-lock.json)
- Rebuild: Manual deploy from Deploys → Trigger deploy

**Environment variables not loading**
- Solution: Add all variables to Netlify dashboard
- Check: Variable names start with `VITE_` for Vite
- Verify: Restart build after adding variables

**OAuth callbacks failing**
- Solution: Add Netlify domain to Auth0 / OAuth provider
- Check: `https://kolhub.netlify.app` in allowed callback URLs
- Rebuild: Redeploy to pick up new environment variables

---

## Docker Deployment

### Prerequisites

- Docker installed (https://docker.com/get-docker)
- Docker Compose installed (included with Docker Desktop)
- MongoDB or cloud database URL
- All environment variables configured

### Step 1: Build Docker Image

```bash
# Build image
docker build -t kolshub/app:latest .

# Build specific version
docker build -t kolshub/app:1.0.0 .
```

The `Dockerfile` includes:
- Multi-stage build for optimized image size
- Node.js base image for building
- Nginx for serving production build
- Health checks for container monitoring
- Volume support for data persistence

### Step 2: Run Container Locally

```bash
# Using docker-compose (recommended)
docker-compose up -d

# This runs:
# - App on http://localhost:3000
# - MongoDB on localhost:27017
# - Nginx reverse proxy on :80

# Using plain Docker
docker run -p 3000:3000 \
  -e VITE_AUTH0_DOMAIN=your-domain \
  -e VITE_AUTH0_CLIENT_ID=your-client-id \
  kolshub/app:latest
```

### Step 3: docker-compose Configuration

The `docker-compose.yml` file defines:

```yaml
version: '3.8'
services:
  app:
    image: kolshub/app:latest
    ports:
      - "3000:3000"
    environment:
      - VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
      - VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}
      - MONGODB_URL=${MONGODB_URL}
    volumes:
      - app-data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

volumes:
  app-data:
  mongo-data:
```

### Step 4: Deploy to Production Server

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/sydnikol/kols-hub-merge.git
cd kols-hub-merge

# Create .env file with production variables
cp .env.example .env
# Edit .env with production values

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Step 5: Push to Container Registry

```bash
# Login to Docker Hub
docker login

# Push image
docker push kolshub/app:latest
docker push kolshub/app:1.0.0

# Or use GitHub Container Registry (GHCR)
docker push ghcr.io/sydnikol/kolshub/app:latest
```

### Docker Volumes and Persistence

```bash
# Backup MongoDB data
docker-compose exec mongodb mongodump --out /backup

# Restore from backup
docker-compose exec mongodb mongorestore /backup

# Inspect volume
docker volume inspect kols-hub-merge_app-data

# Clean up unused volumes
docker volume prune
```

### Health Checks and Monitoring

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs app

# Monitor resource usage
docker stats

# Access container shell
docker-compose exec app sh
```

### Troubleshooting Docker Deployment

**Container exits immediately**
- Check logs: `docker-compose logs app`
- Verify environment variables are set
- Ensure VITE_* variables are present

**Port 3000 already in use**
- Change port in docker-compose.yml: `3001:3000`
- Or kill existing process: `lsof -ti:3000 | xargs kill -9`

**MongoDB connection fails**
- Verify MONGODB_URL environment variable
- Check MongoDB container is running: `docker-compose ps`
- Wait for MongoDB to be ready (30 seconds on first start)

**Out of disk space**
- Remove unused images: `docker image prune -a`
- Remove unused volumes: `docker volume prune`
- Check disk usage: `docker system df`

---

## Desktop Applications (Electron)

Kol's Hub supports Windows, macOS, and Linux via Electron with native OS integration.

### Prerequisites

- Node.js 18+ with npm
- Build tools for target platform:
  - **Windows**: Visual Studio Build Tools or Windows SDK
  - **macOS**: Xcode and command-line tools
  - **Linux**: build-essential, libgtk-3-dev, libnotify-dev

### Windows Build

#### Build Setup

```bash
npm install

# Build for Windows
npm run build:electron:win

# Output files
dist-electron/
├── KolsHub Setup 1.0.0.exe      # NSIS installer
└── KolsHub-1.0.0.exe             # Portable executable
```

#### Windows Installer Features

- NSIS setup wizard for user-friendly installation
- Desktop and Start Menu shortcuts
- System tray integration
- Auto-updater for seamless updates
- Uninstaller included

#### Code Signing (Optional but Recommended)

```bash
# Create self-signed certificate
npx electron-builder create-certificate --platform win32

# Sign in electron-builder config
{
  "win": {
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password",
    "signingHashAlgorithms": ["sha256"],
    "sign": "./customSign.js"
  }
}
```

### macOS Build

#### Build Setup

```bash
# Build for macOS
npm run build:electron:mac

# Output files
dist-electron/
├── KolsHub-1.0.0.dmg             # DMG installer
├── KolsHub-1.0.0.zip             # ZIP distribution
└── KolsHub-1.0.0-arm64.dmg       # ARM64 (Apple Silicon)
```

#### macOS Features

- DMG (Disk Image) for drag-to-Applications installation
- Code signing and notarization support
- Native Touch Bar integration
- Dark mode native support
- Automatic updates via Sparkle framework

#### Notarization (Required for Distribution)

```bash
# Setup in electron-builder config
{
  "mac": {
    "identity": "Developer ID Application: Your Name",
    "hardenedRuntime": true,
    "notarize": {
      "teamId": "YOUR_TEAM_ID",
      "appleId": "your-apple-id@example.com",
      "appleIdPassword": "@keychain:AC_PASSWORD"
    }
  }
}

# Build and automatically notarize
npm run build:electron:mac
```

### Linux Build

#### Build Setup

```bash
# Build for Linux
npm run build:electron:linux

# Output files
dist-electron/
├── KolsHub-1.0.0.AppImage        # Universal portable format
├── kolshub_1.0.0_amd64.deb       # Debian/Ubuntu package
├── kolshub_1.0.0_arm64.deb       # ARM package (Raspberry Pi)
└── kolshub-1.0.0.x86_64.rpm      # Fedora/RHEL package
```

#### Linux Package Features

- AppImage: Universal format, runs on any Linux distro
- DEB: Debian/Ubuntu with system integration
- RPM: Fedora/RHEL with system integration
- All formats support auto-updates
- Desktop entry for application launchers

### Desktop Features

All desktop platforms include:

- **Offline-first functionality**: Full app works without internet
- **System tray integration**: Minimize to tray, quick access
- **Native notifications**: OS-level notification support
- **Auto-updater**: Checks for updates, prompts to install
- **Keyboard shortcuts**: Platform-native shortcuts (Cmd+Q on Mac, Alt+F4 on Windows)
- **File associations**: Open files with Kol's Hub
- **Deep linking**: `kolshub://` protocol support
- **Performance**: Native performance compared to web version

### Electron Configuration

Main configuration in `electron-builder.json5`:

```json5
{
  "appId": "com.kolshub.app",
  "productName": "Kol's Hub",
  "directories": {
    "buildResources": "assets",
    "output": "dist-electron"
  },
  "files": [
    "dist/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  "win": {
    "target": ["nsis", "portable"],
    "certificateFile": null,
    "certificatePassword": null
  },
  "mac": {
    "target": ["dmg", "zip"],
    "identity": null
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"]
  }
}
```

---

## Mobile Applications (Capacitor)

Kol's Hub supports iOS and Android via Capacitor for native features and app store distribution.

### Prerequisites

#### Android
- Node.js 18+
- Java Development Kit (JDK) 11+
- Android Studio
- Android SDK 31+

#### iOS (macOS only)
- Xcode 13+
- macOS 11+
- CocoaPods
- Apple Developer Account

### Android Build

#### Build Setup

```bash
# Install Capacitor CLI
npm install -g @capacitor/cli

# Build web assets
npm run build

# Initialize Android project
npx cap add android

# Build APK for testing
npm run build:android

# Output
android/app/build/outputs/apk/release/app-release.apk
```

#### Build Release APK

```bash
# Create keystore for signing (first time only)
keytool -genkey -v -keystore kols-hub.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias kols-hub-key

# Build signed release APK
cd android
./gradlew assembleRelease

# APK location
app/build/outputs/apk/release/app-release.apk
```

#### Android Features

- **Material You** dynamic theming
- **Adaptive icons** for modern devices
- **Notification channels** for organized notifications
- **Fingerprint/Face unlock** via Capacitor Auth
- **Google Fit integration** for wearable data
- **Quick Settings tiles** for quick actions
- **App shortcuts** for quick access to features
- **Share sheet integration** for data sharing
- **Picture-in-picture** for video/telemedicine
- **Wear OS sync** for smartwatch integration

#### Gradle Configuration

File: `android/app/build.gradle`

```gradle
android {
  compileSdkVersion 34

  defaultConfig {
    applicationId "com.unified.megaapp"
    minSdkVersion 26
    targetSdkVersion 34
    versionCode 1
    versionName "1.0.0"
  }

  signingConfigs {
    release {
      storeFile file("kols-hub.jks")
      storePassword "your-password"
      keyAlias "kols-hub-key"
      keyPassword "your-password"
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

### iOS Build

#### Build Setup

```bash
# Build web assets
npm run build

# Initialize iOS project
npx cap add ios

# Open in Xcode
npm run cap:open:ios
```

#### Archive and Submit

```bash
# In Xcode:
# 1. Select Product → Scheme → Edit Scheme
# 2. Set to "Release" build configuration
# 3. Select Product → Archive
# 4. In Organizer, select Archive → Distribute App
# 5. Choose "App Store Connect"
# 6. Follow submission wizard
```

#### iOS Features

- **HealthKit integration** for Apple Watch data
- **Face ID/Touch ID** biometric authentication
- **Siri Shortcuts** support
- **Native notifications** with iOS styling
- **HomeKit integration** for smart home control
- **CarPlay** support for vehicle integration
- **App Clips** for instant app experiences
- **iCloud sync** for cloud data backup

#### Info.plist Configuration

File: `ios/App/App/Info.plist`

```xml
<dict>
  <!-- Health Kit -->
  <key>NSHealthShareUsageDescription</key>
  <string>We need access to your health data to provide personalized wellness recommendations.</string>

  <!-- Microphone -->
  <key>NSMicrophoneUsageDescription</key>
  <string>We need microphone access for voice commands.</string>

  <!-- Camera -->
  <key>NSCameraUsageDescription</key>
  <string>We need camera access to scan medication barcodes.</string>

  <!-- Calendar -->
  <key>NSCalendarsUsageDescription</key>
  <string>We need calendar access to create appointment reminders.</string>

  <!-- Location (Optional) -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>We need your location for weather-based suggestions.</string>

  <!-- Deep Linking -->
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLName</key>
      <string>com.unified.megaapp</string>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>kolshub</string>
        <string>com.unified.megaapp</string>
      </array>
    </dict>
  </array>
</dict>
```

### App Store Submissions

#### Google Play Store

1. Go to https://play.google.com/console
2. Create new app or select existing
3. Upload signed APK/AAB (Android App Bundle)
4. Fill in app details:
   - Title, description, screenshots
   - Category, content rating
   - Privacy policy URL
5. Review policies and submit

**Requirements:**
- Developer account ($25 one-time)
- Privacy policy URL
- Screenshots for multiple device sizes
- App content rating questionnaire
- Feature graphic (1024x500px)

#### Apple App Store

1. Go to https://appstoreconnect.apple.com
2. Create new app
3. Fill in app information:
   - Name, subtitle, description
   - Keywords, category
   - Support email, privacy policy
4. Archive and distribute via Xcode
5. Review and submit

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect credentials
- Privacy policy URL
- Screenshots (multiple sizes)
- App Preview video (optional but recommended)
- Terms and conditions (if applicable)

---

## GitHub Actions CI/CD

Automated builds for all platforms using GitHub Actions workflows.

### Workflow Setup

The `.github/workflows/` directory contains:

- `build.yml` - Builds all platforms on push/tag
- `release.yml` - Creates GitHub Releases with artifacts
- `deploy.yml` - Deploys to Netlify and Docker Registry

### Step 1: Add Secrets to GitHub

1. Go to Repository Settings → Secrets and variables → Actions
2. Add required secrets:

```
NETLIFY_AUTH_TOKEN      - https://app.netlify.com/user/applications
NETLIFY_SITE_ID         - From Netlify site settings
DOCKER_USERNAME         - Docker Hub username
DOCKER_PASSWORD         - Docker Hub access token
MACOS_CERT              - Base64-encoded macOS certificate
MACOS_CERT_PASSWORD     - Certificate password
WINDOWS_CERT            - Base64-encoded Windows certificate
WINDOWS_CERT_PASSWORD   - Certificate password
ANDROID_KEYSTORE        - Base64-encoded keystore file
ANDROID_KEYSTORE_PASSWORD - Keystore password
APPLE_TEAM_ID           - Apple Developer team ID
```

### Step 2: Automatic Builds

Builds trigger automatically on:

- **Push to `main`**: Triggers build.yml
- **Tag creation**: Triggers release.yml
- **Pull requests**: Runs tests only (no builds)

### Step 3: Build Output

Artifacts generated for each platform:

```
GitHub Releases
├── KolsHub-Setup-1.0.0.exe
├── KolsHub-1.0.0.dmg
├── KolsHub-1.0.0.AppImage
├── kolshub_1.0.0_amd64.deb
├── kolshub-1.0.0.x86_64.rpm
├── kolshub-1.0.0.apk
└── CHECKSUMS.txt
```

### Sample Workflow Files

#### build.yml

```yaml
name: Build All Platforms

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

jobs:
  build-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: web-dist
          path: dist/

  build-desktop:
    needs: build-web
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:electron
      - uses: actions/upload-artifact@v3
        with:
          name: desktop-${{ matrix.os }}
          path: dist-electron/

  build-mobile:
    needs: build-web
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-java@v3
        with:
          java-version: '11'
      - run: npm install
      - run: npm run build:android
      - uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: android/app/build/outputs/apk/release/
```

#### deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-netlify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install && npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            kolshub/app:latest
            kolshub/app:${{ github.sha }}
```

---

## Build Commands Reference

### Development

```bash
# Start dev server with hot reload
npm run dev

# Start Electron dev with DevTools
npm run electron:dev

# Open Xcode for iOS development
npm run cap:open:ios

# Open Android Studio for Android development
npm run cap:open:android
```

### Build Web

```bash
# Production build
npm run build

# Build and preview
npm run build && npm run preview

# Build with source maps for debugging
npm run build -- --sourcemap
```

### Build Desktop (Electron)

```bash
# Build all desktop platforms
npm run build:electron

# Windows only
npm run build:electron:win

# macOS only
npm run build:electron:mac

# Linux only
npm run build:electron:linux
```

### Build Mobile

```bash
# Android APK
npm run build:android

# iOS (macOS only)
npm run build:ios

# Capacitor sync (after build)
npx cap sync
```

### Build All

```bash
# Build everything (web, desktop, mobile, docker)
npm run build:all

# Output includes:
# - dist/                         (web)
# - dist-electron/                (desktop)
# - android/app/build/outputs/    (android)
# - ios/App/                      (ios)
# - Docker image
```

### Docker

```bash
# Build Docker image
docker build -t kolshub/app:latest .

# Run Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Testing and Quality

```bash
# Run tests
npm run test

# Test with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type checking (TypeScript)
npm run type-check
```

---

## GitHub Releases

### Creating a Release

#### Automated (Recommended)

```bash
# Tag a version
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"

# Push tag (triggers GitHub Actions)
git push origin v1.0.0

# GitHub Actions automatically:
# 1. Builds all platforms
# 2. Creates GitHub Release
# 3. Uploads artifacts
# 4. Generates checksums
```

#### Manual Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Enter version tag (e.g., v1.0.0)
4. Add release notes with:
   - New features
   - Bug fixes
   - Breaking changes
   - Contributors
5. Upload artifacts manually
6. Click "Publish release"

### Release Assets

Each release includes:

```
Kol's Hub v1.0.0
├── Windows
│   ├── KolsHub-Setup-1.0.0.exe
│   ├── KolsHub-Setup-1.0.0.exe.blockmap
│   ├── KolsHub-1.0.0.exe (portable)
│   └── KolsHub-1.0.0.exe.blockmap
├── macOS
│   ├── KolsHub-1.0.0.dmg
│   ├── KolsHub-1.0.0.zip
│   ├── KolsHub-1.0.0-arm64.dmg (Apple Silicon)
│   └── KolsHub-1.0.0-arm64.zip
├── Linux
│   ├── KolsHub-1.0.0.AppImage
│   ├── KolsHub-1.0.0.AppImage.asc (signature)
│   ├── kolshub_1.0.0_amd64.deb
│   ├── kolshub-1.0.0.x86_64.rpm
│   └── CHECKSUMS.txt
├── Android
│   ├── kolshub-1.0.0.apk
│   └── kolshub-1.0.0.aab (App Bundle)
└── Source Code
    ├── Source code (zip)
    └── Source code (tar.gz)
```

### Update Checking

Desktop apps automatically check for updates:

```javascript
// Electron main process
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();

// Updates check every:
// - Startup
// - Every 60 minutes
// - Manual check via menu
```

Mobile apps check for updates:

```javascript
// Capacitor
import { App } from '@capacitor/app';

App.checkForUpdates().then((result) => {
  if (result.isUpdateAvailable) {
    // Prompt user to update
  }
});
```

### Distribution URLs

Once released, users can download from:

- **GitHub Releases**: https://github.com/sydnikol/kols-hub-merge/releases
- **Download Page**: https://kolshub.net/download
- **Docker Hub**: https://hub.docker.com/r/kolshub/app
- **Google Play**: https://play.google.com/store/apps/details?id=com.unified.megaapp
- **Apple App Store**: https://apps.apple.com/app/kols-hub

---

## Deployment Checklist

- [ ] Environment variables configured in all platforms (Netlify, Docker, CI/CD)
- [ ] GitHub secrets added for CI/CD and code signing
- [ ] Netlify site connected and auto-deploy enabled
- [ ] Docker image builds successfully locally
- [ ] Desktop apps build for all platforms (Windows, macOS, Linux)
- [ ] Mobile apps build successfully (Android APK, iOS IPA)
- [ ] GitHub Actions workflows execute without errors
- [ ] Release artifacts uploaded to GitHub Releases
- [ ] Update URLs configured in all app clients
- [ ] SSL/HTTPS enabled for web deployment
- [ ] Custom domain configured (if applicable)
- [ ] Monitor deployment metrics and errors
- [ ] Test login flows on all platforms
- [ ] Verify OAuth callbacks work in production

---

**Last Updated:** February 26, 2026
**Version:** 1.0.0
