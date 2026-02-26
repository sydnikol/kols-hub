# 📱 MOBILE APP DOWNLOADS - COMPLETE GUIDE
================================================================

## 🎯 Overview

This system allows users to download Android APK and iOS apps **directly from your website**. No app stores required for Android!

## 🚀 Quick Start

### For Users
1. Visit: http://localhost:5173/downloads
2. Choose your platform
3. Download and install
4. Done!

### For Developers

**Windows:**
```powershell
npm run build:mobile:windows
```

**Mac/Linux:**
```bash
npm run build:mobile
```

This builds everything and places files in `public/downloads/`

================================================================

## 📦 What Gets Built

- Android APK: `public/downloads/kol-hub-v5.0.0.apk` (~25 MB)
- iOS App: `public/downloads/kol-hub-v5.0.0.ipa` (~30 MB, Mac only)
- QR Codes: `public/qr-android.png`, `public/qr-ios.png`
- Release Notes: `public/downloads/RELEASE_NOTES_v5.0.0.md`

================================================================

## 🔧 Prerequisites

**Android:**
- Node.js 18+
- Java JDK 11+
- Android Studio
- ANDROID_HOME environment variable

**iOS (Mac only):**
- Xcode
- CocoaPods
- Apple Developer account

================================================================

## 📤 Publishing to GitHub Releases

### Automatic (Recommended)

```bash
git tag v5.0.0
git push origin v5.0.0
```

GitHub Actions automatically builds and releases!

### Manual

1. Build: `npm run build:mobile`
2. Go to GitHub → Releases → "Draft a new release"
3. Upload `public/downloads/kol-hub-v5.0.0.apk`
4. Publish

Update download URL in `src/components/MobileDownloads.tsx`:
```typescript
downloadUrl: 'https://github.com/USERNAME/REPO/releases/latest/download/kol-hub-v5.0.0.apk'
```

================================================================

## 🧪 Testing

**Android:**
```bash
npm run build:android-only
adb install android/app/build/outputs/apk/release/app-release.apk
```

**iOS:**
```bash
npm run mobile:ios
# Then click Play in Xcode
```

**Downloads Page:**
```bash
npm run dev
# Visit http://localhost:5173/downloads
```

================================================================

## 🐛 Common Issues

**"Gradle build failed"**
```bash
cd android && chmod +x gradlew && ./gradlew clean assembleRelease
```

**"SDK location not found"**
Create `android/local.properties`:
```properties
sdk.dir=/path/to/android/sdk
```

**"App not installed"**
- Uninstall old version completely
- Clear app data
- Restart device

================================================================

## ✅ Before Going Live

- [ ] APK builds successfully
- [ ] Installs on real device
- [ ] Works offline
- [ ] Download page accessible
- [ ] GitHub releases configured
- [ ] QR codes generated
- [ ] Analytics tracking (optional)

================================================================

Built with velvet, voltage, and reverence 🖤⚡🕯️
