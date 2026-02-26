# Mobile Setup Guide

Complete guide for setting up and installing Kol's Hub on iOS and Android devices, including PWA installation, mobile permissions, and cross-platform testing.

## Table of Contents

1. [Android Setup and Installation](#android-setup-and-installation)
2. [iOS Setup and Installation](#ios-setup-and-installation)
3. [Mobile Permissions](#mobile-permissions)
4. [Progressive Web App (PWA) Installation](#progressive-web-app-pwa-installation)
5. [Cross-Platform Testing](#cross-platform-testing)
6. [Troubleshooting](#troubleshooting)

---

## Android Setup and Installation

### Method 1: Direct APK Installation (Fastest)

#### Step 1: Enable Unknown Sources

Before installing the APK file, enable installation from unknown sources:

1. Open **Settings** on your Android device
2. Navigate to **Security** or **Privacy** (may vary by device)
3. Find **Install unknown apps** or **Unknown sources**
4. Select your **browser application** (Chrome, Firefox, Samsung Internet, etc.)
5. Toggle **Allow from this source** to ON

Note: On Android 8+, permissions are per-app rather than device-wide.

#### Step 2: Download APK

1. Open your device's web browser
2. Navigate to https://kolshub.net/download
3. Tap **Download for Android** or **Download APK**
4. File will download to your Downloads folder
5. Check notification panel for download completion

#### Step 3: Install Application

1. Open **Files** or **Downloads** app on your device
2. Locate **kolshub-1.0.0.apk** file
3. Tap the file to open it
4. Tap **Install** button
5. Wait for installation to complete (10-30 seconds)
6. Tap **Open** to launch the app or find it in your app drawer

#### Step 4: Grant Initial Permissions

When opening Kol's Hub for the first time, you'll be asked to grant permissions:

```
✅ Storage - Access to save health data offline
✅ Camera - Scan medication barcodes (optional)
✅ Notifications - Medication reminders and alerts
✅ Microphone - Voice AI companion commands
✅ Location - Weather-based outfit suggestions (optional)
✅ Calendar - Auto-create appointment reminders (optional)
✅ Biometric - Fingerprint/face unlock (optional)
```

Tap **Allow** or **Allow only while using the app** for each permission.

### Method 2: Build from Source

If you want to build the APK yourself from source code:

#### Prerequisites

- Git installed
- Node.js 18+ with npm
- Java Development Kit (JDK) 11+
- Android Studio (optional but recommended)
- Android SDK with Android 12+ support

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/sydnikol/kols-hub-merge.git
cd kols-hub-merge

# Install dependencies
npm install

# Build Android APK
npm run build:android

# APK location
# android/app/build/outputs/apk/release/app-release.apk
```

#### Transfer to Device

```bash
# Option 1: USB Cable
adb install android/app/build/outputs/apk/release/app-release.apk

# Option 2: Email - Attach APK to email, download on phone
# Option 3: Cloud Storage - Upload to Google Drive, download on phone
# Option 4: File sharing - Use Airdrop, Shareit, or similar
```

### Method 3: Google Play Store (Coming Soon)

Kol's Hub will be available on Google Play Store soon:

- **Status**: Pending Google Play review
- **Expected availability**: 1-2 weeks
- **Link**: Will be updated when live at https://play.google.com/store/apps/details?id=com.unified.megaapp

Once available, simply search for "Kol's Hub" in Google Play Store and tap **Install**.

### Quick Start After Android Installation

#### 1. Welcome Setup (2 minutes)

- Choose your theme: Gothic Dark, Dark Velvet, or Modern Noir
- Select your language
- Skip or complete optional health profile
- Set medication reminder preferences

#### 2. Add Your First Data (5 minutes)

- Tap **Body Weather** icon to log how you're feeling today
- Tap **Medications** to add your medications and dosages
- Tap **Hydration** to log water intake
- Enable notifications for reminders

#### 3. Connect Integrations (Optional, 5-10 minutes)

- Go to **Settings** → **Integrations**
- Connect available services:
  - Fitbit (for fitness data)
  - Google Calendar (for appointments)
  - Spotify (for wellness music)
  - SmartThings (for smart home)
- Enter API keys only if required

#### 4. Enable Voice AI (1 minute)

- Tap the **microphone button** on home screen
- Say: "How am I feeling today?"
- ChronoMuse AI companion responds with personalized insights

#### 5. Explore Core Features

- **Wardrobe** (👗): Get personalized outfit suggestions based on weather and mood
- **Rituals** (🕯️): Track meditation, prayer, journaling, or other practices
- **Reports** (📊): Generate health summaries for doctor appointments
- **Community** (👥): Connect with others managing similar conditions
- **Messaging**: Get medication refill reminders and appointment notifications

### Android Features

Kol's Hub for Android includes:

- **Material You Dynamic Theming**: App colors match your device theme
- **Adaptive Icons**: App icon adapts to device shape
- **Notification Channels**: Organize notifications by type (reminders, alerts, messages)
- **Fingerprint/Face Unlock**: Biometric authentication for privacy
- **Quick Settings Tiles**: Quick access from notification shade
- **App Shortcuts**: Long-press app icon for quick actions
- **Share Sheet Integration**: Share data with other apps
- **Picture-in-Picture**: Video calls stay visible while using other apps
- **Battery Optimization Exclusion**: Prevent Android from stopping medication reminders
- **Wear OS Sync**: Sync data with smartwatches
- **Always-On Display Widget**: Show Body Weather on lock screen
- **Quick Log Widgets**: Add to home screen for rapid logging

### Android Compatibility

| Aspect | Requirement |
|--------|-------------|
| **Minimum SDK** | Android 8.0 (Oreo) API 26 |
| **Target SDK** | Android 14 (latest) |
| **Recommended** | Android 12+, 6GB+ RAM |
| **Tested Devices** | Samsung Galaxy, Google Pixel, OnePlus, Motorola |
| **File Size** | Approximately 50 MB |
| **Storage Needed** | 100 MB minimum for app and data |
| **RAM Needed** | 2GB minimum, 4GB+ recommended |

---

## iOS Setup and Installation

### Method 1: Build from Source (macOS only)

iOS apps can only be built on macOS due to Apple's requirements.

#### Prerequisites

- macOS 11+ (Big Sur or newer)
- Xcode 13+ (from App Store)
- Xcode Command Line Tools
- Node.js 18+ with npm
- CocoaPods (package manager for iOS)
- Apple Developer Account (free or paid $99/year)

#### Build Steps

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Clone repository
git clone https://github.com/sydnikol/kols-hub-merge.git
cd kols-hub-merge

# Install dependencies
npm install
pod install

# Build web assets
npm run build

# Initialize iOS project
npx cap add ios

# Open in Xcode
npm run cap:open:ios
```

#### Development Build

```bash
# Build for simulator
npm run build:ios:dev

# Test in iOS Simulator
npx cap open ios

# In Xcode:
# 1. Select iPhone simulator from top-left dropdown
# 2. Press Play button (or Cmd+R)
# 3. App launches in simulator
```

#### Release Build for Testing

```bash
# Build for physical device
npm run build:ios:prod

# In Xcode:
# 1. Connect iPhone via USB
# 2. Select your device from dropdown (not simulator)
# 3. Press Play button to build and run on device
```

### Method 2: TestFlight Beta (Coming Soon)

Apple's TestFlight allows testing iOS apps before App Store release:

- **Status**: Pending setup
- **How to Join**: You'll receive email invite
- **Install**: Open email invite link on iPhone → Install via TestFlight app
- **Feedback**: Report issues or suggest features

### Method 3: App Store (Coming Soon)

Once approved, Kol's Hub will be available on Apple App Store:

- **Status**: Pending submission
- **Expected availability**: 2-4 weeks
- **Link**: https://apps.apple.com/app/kols-hub

To install from App Store:

1. Open **App Store** on iPhone/iPad
2. Search for "Kol's Hub"
3. Tap **Get** button
4. Authenticate with Face ID or Apple ID password
5. Wait for installation to complete
6. Tap **Open** or find in home screen

### Quick Start After iOS Installation

#### 1. Welcome Onboarding (2 minutes)

- Grant requested permissions (see below)
- Choose theme (Gothic Dark, Dark Velvet, or Modern Noir)
- Set language preference
- Skip or complete health profile

#### 2. Initial Setup (5 minutes)

- Enable notifications for medication reminders
- Set time zone and language
- (Optional) Enable Siri integration
- (Optional) Configure HealthKit access

#### 3. Sync with iPhone Health (5 minutes)

- Go to **Settings** → **Health & Fitness**
- Tap **Health** to link iPhone's built-in Health app
- Select which data types to sync:
  - Steps, distance, flights climbed
  - Workouts and activities
  - Heart rate, blood pressure (if supported)

#### 4. Apple Watch Integration (5 minutes, optional)

If you have an Apple Watch:

- Kol's Hub automatically syncs to paired Watch
- View Body Weather on Watch face widget
- Get medication reminders on wrist
- Log quick entries from Watch

#### 5. Siri Shortcuts (Optional)

Create Siri shortcuts for common actions:

```
"Hey Siri, how am I feeling?"
→ Opens Body Weather logging

"Hey Siri, log my medication"
→ Opens medication tracker

"Hey Siri, update my body weather"
→ Logs current status
```

### iOS Features

Kol's Hub for iOS includes:

- **HealthKit Integration**: Access Apple Health data (steps, workouts, heart rate)
- **Apple Watch Support**: Synced companion watch app
- **Face ID/Touch ID**: Biometric authentication
- **Siri Integration**: Voice commands and shortcuts
- **Native Notifications**: iOS-style rich notifications
- **HomeKit Support**: Control smart home devices
- **CarPlay Support**: Use while driving (limited UI)
- **App Clips**: Instant app experience without full download
- **iCloud Backup**: Automatic encrypted backup of data
- **Focus Modes**: Different app states based on focus mode
- **Dynamic Island**: Display alerts on notch/Dynamic Island
- **Widgets**: Add to lock screen or home screen
- **Handoff**: Continue on Mac from iPhone

### iOS Permissions

When you first open Kol's Hub, it requests:

- **HealthKit**: Access to Apple Health data
- **Microphone**: Voice AI commands
- **Camera**: Scan medication barcodes
- **Calendar**: Create appointment reminders
- **Location**: Weather-based suggestions (optional)
- **Contacts**: Share with family (optional)
- **Photos**: Attach images to journal entries (optional)
- **Bluetooth**: Connect to wearables (optional)

You can change these anytime in:
**Settings** → **Privacy** → **Kol's Hub**

### iOS Compatibility

| Aspect | Requirement |
|--------|-------------|
| **Minimum iOS** | iOS 14.0 |
| **Recommended** | iOS 16+ |
| **Devices** | iPhone 11+, iPad Air 2+, iPad mini 4+ |
| **Storage Needed** | 100 MB minimum |
| **RAM** | 2GB minimum, 4GB+ recommended |
| **Tested Models** | iPhone 13, 14, 15; iPad Pro; iPad Air |

---

## Mobile Permissions

### Why Kol's Hub Requests Permissions

Kol's Hub requests specific permissions to provide core features. All permissions are optional except notifications:

#### Required Permissions

| Permission | iOS | Android | Purpose | How to Grant |
|-----------|-----|---------|---------|--------------|
| **Notifications** | Settings → Notifications → Kol's Hub | Settings → Apps → Kol's Hub → Notifications | Medication reminders, alerts | Tap "Allow" when prompted |

#### Optional but Recommended

| Permission | iOS | Android | Feature | How to Grant |
|-----------|-----|---------|---------|--------------|
| **HealthKit** | Settings → Health → Data Access → Kol's Hub | Settings → Apps → Kol's Hub → Permissions → Health | Apple/Google Fit sync | In-app prompt or Settings |
| **Microphone** | Settings → Privacy → Microphone → Kol's Hub | Settings → Apps → Kol's Hub → Microphone | Voice AI companion | Tap "Allow" when prompted |
| **Camera** | Settings → Privacy → Camera → Kol's Hub | Settings → Apps → Kol's Hub → Camera | Barcode scanning | Tap "Allow" when prompted |
| **Calendar** | Settings → Privacy → Calendar → Kol's Hub | Settings → Apps → Kol's Hub → Calendar | Create appointment reminders | In-app prompt or Settings |
| **Location** | Settings → Privacy → Location → Kol's Hub | Settings → Apps → Kol's Hub → Location | Weather for outfit suggestions | Tap "While Using App" |
| **Contacts** | Settings → Privacy → Contacts → Kol's Hub | Settings → Apps → Kol's Hub → Contacts | Share with emergency contacts | Tap "Allow" when prompted |
| **Photos/Media** | Settings → Privacy → Photos → Kol's Hub | Settings → Apps → Kol's Hub → Photos | Attach images to journal | Tap "Allow" when prompted |

#### Bluetooth & Wearables

- **Apple Watch**: Automatically syncs when paired
- **Fitbit**: Grant permission in Integrations settings
- **Wear OS**: Automatically syncs to paired Android Watch
- **Heart Rate Monitor**: Bluetooth connection in Integrations

### Privacy and Data Security

All permissions respect your privacy:

- **Local Storage**: All data stored locally on device by default
- **Encrypted**: Data encrypted at rest on device
- **Optional Cloud**: Cloud backup is optional and encrypted
- **No Tracking**: No analytics or user tracking
- **No Selling**: Data never sold to third parties
- **Revoke Anytime**: Remove permissions in device settings

### Changing Permissions

#### On iPhone

1. Open **Settings**
2. Go to **Privacy**
3. Select permission type (Microphone, Camera, Location, etc.)
4. Find **Kol's Hub**
5. Toggle permission on/off or select access level

#### On Android

1. Open **Settings**
2. Go to **Apps** → **Kol's Hub** (or **App permissions**)
3. Select permission type
4. Choose: **Allow**, **Allow only while using the app**, or **Deny**

---

## Progressive Web App (PWA) Installation

### What is a PWA?

A Progressive Web App (PWA) is a web app that works like a native app:
- Installs on home screen
- Works offline with cached data
- Sends notifications
- Auto-updates when new version deployed
- Available on any device with a browser

### Benefits

- **No App Store required** - Install directly from browser
- **Works offline** - Access data without internet
- **Fast loading** - Service worker caching
- **Auto-updates** - Always have latest version
- **Push notifications** - Medication reminders
- **Responsive** - Works on phones, tablets, desktops

### Installation on iPhone (iOS 15+)

#### Step 1: Open in Safari

1. Open Safari browser on iPhone
2. Navigate to https://kolshub.net
3. Wait for page to fully load

#### Step 2: Install

1. Tap the **Share button** (↗️) at bottom of screen
2. Scroll right and tap **Add to Home Screen**
3. Enter name (can leave as "Kol's Hub")
4. Tap **Add** in top-right corner
5. App appears on home screen like native app

#### Step 3: First Launch

1. Tap the Kol's Hub icon on home screen
2. Grant permissions as prompted
3. App launches in full-screen mode (no browser bars)

### Installation on Android (Chrome 76+)

#### Step 1: Open in Chrome

1. Open Chrome browser on Android
2. Navigate to https://kolshub.net
3. Wait for page to fully load

#### Step 2: Install

1. Tap the **menu button** (⋮) in top-right corner
2. Tap **"Install app"** or **"Add Kol's Hub to Home screen"**
3. Confirm by tapping **"Install"**
4. App appears on home screen

Alternatively:

1. When you visit the site, Chrome may show **install banner** at bottom
2. Tap **"Install"** on the banner
3. App installs automatically

#### Step 3: First Launch

1. Tap the Kol's Hub icon on home screen
2. Grant permissions as prompted
3. App launches in full-screen mode

### PWA Features

Once installed, the PWA includes:

- **Offline Access**: Browse cached data without internet
- **Background Sync**: Sync data when connection restored
- **Push Notifications**: Medication reminders and alerts
- **App Shortcuts**: Long-press icon for quick actions
- **Share Sheet**: Share data with other apps
- **Install Prompt**: Reminds you to install if not done

### Uninstalling PWA

#### iPhone

1. Long-press the app icon on home screen
2. Tap **"Remove App"**
3. Tap **"Remove from Home Screen"**

Note: This removes from home screen but keeps data locally. To delete data, go to **Settings** → **Safari** → **Advanced** → **Website Data** → **Kol's Hub** → **Delete**.

#### Android

1. Long-press the app icon on home screen
2. Tap **"Remove"** or **"Uninstall"**
3. Confirm uninstall

---

## Cross-Platform Testing

### Testing During Development

#### Prerequisites

- Node.js 18+ and npm
- Xcode (for iOS testing)
- Android Studio (for Android testing)
- Physical devices or emulators

#### Web Testing

```bash
# Start development server
npm run dev

# Test on desktop browser
# Open http://localhost:5173

# Test responsive design
# Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M or Cmd+Shift+M)
```

#### iOS Simulator Testing

```bash
# Build web assets
npm run build

# Sync to iOS project
npx cap sync ios

# Open Xcode
npm run cap:open:ios

# In Xcode:
# 1. Select "iPhone 15 Pro" from device dropdown
# 2. Press Play (Cmd+R)
# 3. App builds and launches in simulator
```

**Note**: Simulator can't access camera/microphone. Use physical device for testing these features.

#### Android Emulator Testing

```bash
# Build web assets
npm run build

# Sync to Android project
npx cap sync android

# Open Android Studio
npx cap open android

# In Android Studio:
# 1. Select emulator from device dropdown
# 2. Click Play button or use Run menu
# 3. App builds and launches in emulator
```

Or with command line:

```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_4_API_31 &

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat
```

#### Physical Device Testing

##### iOS Device

1. Connect iPhone via USB
2. Trust the computer (tap Trust on phone)
3. In Xcode, select your iPhone from device dropdown
4. Press Play button to build and install
5. Grant access on device when prompted
6. App launches on device

##### Android Device

1. Enable Developer Mode:
   - Go to Settings → About phone
   - Tap Build number 7 times
   - Developer options appears in Settings
2. Enable USB Debugging in Developer options
3. Connect via USB
4. Tap "Allow USB Debugging" on device
5. Run: `adb install android/app/build/outputs/apk/debug/app-debug.apk`
6. App appears in app drawer

### Testing Checklist

Before releasing to production, test on:

#### Android
- [ ] Install from APK on physical device (Android 8+, 10, 12, 14)
- [ ] Install on tablet with different screen size
- [ ] Test offline functionality
- [ ] Test all permissions (camera, microphone, location)
- [ ] Test biometric authentication
- [ ] Test notifications (foreground and background)
- [ ] Test Google Fit sync
- [ ] Test Widget on home screen
- [ ] Test Quick Settings tile
- [ ] Test Wear OS sync (if applicable)
- [ ] Verify app icon, theme, splash screen

#### iOS
- [ ] Install on physical iPhone (iOS 14+, 16+)
- [ ] Install on iPad with different screen size
- [ ] Test offline functionality
- [ ] Test all permissions (HealthKit, camera, microphone)
- [ ] Test Face ID / Touch ID
- [ ] Test notifications
- [ ] Test Apple Watch sync
- [ ] Test Siri shortcuts
- [ ] Test HealthKit integration
- [ ] Test widgets on lock screen
- [ ] Verify app icon, theme, splash screen

#### Web (PWA)
- [ ] Install on iOS Safari
- [ ] Install on Android Chrome
- [ ] Test offline on all platforms
- [ ] Test push notifications
- [ ] Test auto-update functionality
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive design on all screen sizes

#### Cross-Platform
- [ ] Data syncs between platforms
- [ ] OAuth flows work (Spotify, Google, etc.)
- [ ] Account login works everywhere
- [ ] Notifications arrive on all platforms
- [ ] Performance acceptable (< 3 second load)
- [ ] No console errors or warnings
- [ ] Accessibility features work (screen readers, etc.)

### Performance Testing

#### Load Time

Measure time from launch to interactive:

**Target**: < 2 seconds on 3G connection

```bash
# Using Lighthouse in Chrome DevTools
# DevTools → Lighthouse → Run audit

# Or via command line
npm install -g lighthouse
lighthouse https://kolshub.net --view
```

#### Memory Usage

Monitor memory consumption:

- **Android**: DevTools → Profiler → Memory
- **iOS**: Xcode → Debug Navigator → Memory
- **Target**: < 150 MB for typical usage

#### Battery Impact

Test battery drain:

- **Android**: Settings → Device maintenance → Battery usage
- **iOS**: Settings → Battery → Battery Health
- **Target**: < 5% battery drain per hour

### Automated Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Browser Compatibility

Supported browsers and versions:

| Browser | iOS | Android | Desktop |
|---------|-----|---------|---------|
| **Chrome** | - | 88+ | 88+ |
| **Firefox** | - | 87+ | 87+ |
| **Safari** | 15+ | - | 15+ |
| **Edge** | - | 88+ | 88+ |
| **Samsung Internet** | - | 14+ | - |

---

## Troubleshooting

### Android Installation Issues

**Problem: "App not installed"**
- Solution: Ensure unknown sources enabled for your browser
- Check: Storage has 100MB+ free space
- Try: Clear browser cache and re-download APK

**Problem: "Permission denied" or "Parse error"**
- Solution: Download from official https://kolshub.net/download only
- Verify: File ends in .apk (not .apk.txt)
- Try: Delete partial download and retry

**Problem: App crashes on open**
- Solution: Uninstall app and reinstall
- Check: Android version is 8.0+
- Try: Clear app cache (Settings → Apps → Kol's Hub → Storage → Clear Cache)
- Check: Device has 2GB+ available RAM

### Android Permissions Issues

**Problem: Camera not working**
- Solution: Grant camera permission
- Go to: Settings → Apps → Kol's Hub → Permissions → Camera → Allow
- Try: Restart app after granting

**Problem: Microphone not recording**
- Solution: Grant microphone permission
- Go to: Settings → Apps → Kol's Hub → Permissions → Microphone → Allow
- Check: No other app is using microphone

**Problem: Notifications not arriving**
- Solution: Enable notifications
- Go to: Settings → Apps → Kol's Hub → Notifications → Toggle ON
- Check: Device battery saver not blocking notifications

### iOS Installation Issues

**Problem: "Cannot Open" when tapping file**
- Solution: Use files shared via AirDrop or email
- Try: Download APK to device in Safari and tap to open
- Note: Direct installation requires TestFlight or App Store

**Problem: App crashes or won't open**
- Solution: Update iOS to latest version
- Try: Force-quit app (swipe up from bottom), restart iPhone
- Last resort: Delete and reinstall app

**Problem: "App could not be verified"**
- Solution: Go to Settings → General → VPN & Device Management
- Find Kol's Hub and tap "Trust"
- Go back and try opening app again

### iOS Permissions Issues

**Problem: HealthKit sync not working**
- Solution: Grant HealthKit permission
- Go to: Settings → Privacy → Health → Kol's Hub
- Toggle data types you want to share
- In app: Settings → Health & Fitness → Reconnect

**Problem: Apple Watch not syncing**
- Solution: Ensure Watch app is installed
- Check: Watch and iPhone are paired and nearby
- Try: Force-quit and reopen Watch app
- Last resort: Delete and reinstall Watch app

### PWA Issues

**Problem: "Install" button not showing**
- Solution: Only shows when criteria met:
  - On HTTPS connection
  - Service worker installed
  - Visited site multiple times
  - Not already installed
- Try: Wait a few minutes or visit again tomorrow

**Problem: Offline mode not working**
- Solution: Service worker takes time to cache assets
- Try: Refresh page once, then try offline
- Check: In browser settings, offline storage enabled
- Clear: Browser cache if having issues

**Problem: Notifications not showing**
- Solution: Enable notifications when prompted
- On iPhone: Settings → Notifications → Kol's Hub → Allow
- On Android: Settings → Apps → Kol's Hub → Notifications → Enable
- Check: Device is not in Do Not Disturb mode

### Performance Issues

**Problem: App loading slowly**
- Solution: Clear app cache
  - Android: Settings → Apps → Kol's Hub → Storage → Clear Cache
  - iOS: Settings → General → iPhone Storage → Kol's Hub → Offload, then reinstall
- Try: Update app to latest version
- Check: Device has stable internet connection
- Restart: Force-quit and reopen app

**Problem: Battery draining quickly**
- Solution: Disable location if not using
- Go to: Settings → Privacy → Location → Kol's Hub → Never
- Try: Disable background refresh
- Limit: Reduce notification frequency in settings

**Problem: Data using too much storage**
- Solution: Export and delete old data
- Go to: Settings → Data Management → Export to CSV/PDF
- Delete: Data older than 6 months
- Note: Backups stored locally don't count toward cloud storage

### Connection Issues

**Problem: "No internet connection" warning**
- Solution: Kol's Hub works offline!
- Data syncs when connection restored
- Try: Toggle airplane mode off/on
- Check: WiFi or mobile data is enabled
- Note: Some features (AI, OAuth) need internet

**Problem: OAuth login not completing**
- Solution: Check OAuth callback URL is configured
- Try: Use app browser instead of external browser
- Clear: Browser cookies and cache
- Restart: App and try again
- Wait: Sometimes providers have temporary outages

### Data Loss Prevention

**Backup your data:**

```
Android:
Settings → Data Management → Cloud Backup → Enable

iOS:
Settings → iCloud → Kol's Hub → Toggle ON

Web:
Settings → Data → Export All Data → Choose format
```

**Export formats:**
- JSON: Complete data export for backup
- CSV: Spreadsheet-compatible format
- PDF: Human-readable report

**Never:**
- Uninstall without exporting first
- Clear app data without backup
- Deny storage permission (disables saving data)

---

**Last Updated:** February 26, 2026
**Version:** 1.0.0
