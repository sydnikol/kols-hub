# 📱 KOL HUB - Android Development Setup

**Complete guide for building Android APKs and developing mobile features**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Android Studio Setup](#android-studio-setup)
3. [SDK Configuration](#sdk-configuration)
4. [First Build](#first-build)
5. [Development Workflow](#development-workflow)
6. [Deep Links & OAuth](#deep-links--oauth)
7. [Signing & Release](#signing--release)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### **Required Software**

#### **1. Java Development Kit (JDK 17)**

**Windows:**
```bash
# Download from Oracle or use Chocolatey
choco install openjdk17

# Verify installation
java -version
# Should show: openjdk version "17.x.x"
```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS (using Homebrew)
brew install openjdk@17

# Verify
java -version
```

**Set JAVA_HOME environment variable:**

**Windows:**
```bash
# Add to System Environment Variables
JAVA_HOME=C:\Program Files\Java\jdk-17
```

**Linux/Mac:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

---

#### **2. Android Studio**

**Download:** https://developer.android.com/studio

**Minimum Version:** Arctic Fox (2020.3.1) or newer

**Installation:**
1. Download Android Studio installer
2. Run installer with default options
3. Launch Android Studio
4. Complete initial setup wizard
5. Install recommended SDK components

---

### **Required SDK Components**

Open Android Studio → **Tools** → **SDK Manager**

**Install the following:**

#### **SDK Platforms (tab 1):**
- [ ] Android 14.0 (API 34) - **Required**
- [ ] Android 13.0 (API 33) - Recommended
- [ ] Android 12.0 (API 31) - Recommended

#### **SDK Tools (tab 2):**
- [ ] Android SDK Build-Tools 34.0.0
- [ ] Android SDK Platform-Tools
- [ ] Android SDK Tools
- [ ] Android Emulator
- [ ] Intel x86 Emulator Accelerator (HAXM)

---

## 🚀 Android Studio Setup

### **Step 1: Install Android Studio**

1. **Download:** https://developer.android.com/studio
2. **Install** with default settings
3. **Launch** Android Studio
4. **Complete** setup wizard

### **Step 2: Configure Android SDK**

1. Open **Tools** → **SDK Manager**
2. Install **Android SDK 34** (Target API level)
3. Install **Build Tools 34.0.0**
4. Click **Apply** to download and install

### **Step 3: Set Environment Variables**

**Windows:**
```bash
# Add to System Environment Variables
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
Path=%Path%;%ANDROID_HOME%\platform-tools
Path=%Path%;%ANDROID_HOME%\tools
```

**Linux/Mac:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

**Verify installation:**
```bash
adb --version
# Should show: Android Debug Bridge version x.x.x
```

---

## 🏗️ SDK Configuration

### **Step 1: Verify SDK Installation**

```bash
# Check Android SDK location
echo $ANDROID_HOME
# Windows: C:\Users\YourUsername\AppData\Local\Android\Sdk
# Linux/Mac: ~/Android/Sdk

# List installed SDK platforms
sdkmanager --list

# Verify adb is accessible
adb --version
```

### **Step 2: Accept SDK Licenses**

```bash
# Navigate to Android SDK tools
cd $ANDROID_HOME/tools/bin

# Accept all licenses
./sdkmanager --licenses
# Type 'y' to accept each license
```

---

## 🔨 First Build

### **Step 1: Prepare Web Assets**

```bash
# Navigate to project root
cd unified-mega-app

# Build web application
npm run build
```

**Expected output:**
```
✓ built in 5.32s
dist/index.html                   2.45 kB
dist/assets/index-a1b2c3d4.js   450.12 kB
```

---

### **Step 2: Sync Capacitor to Android**

```bash
# Sync web assets to Android project
npx cap sync android
```

**What this does:**
- ✅ Copies `dist/` folder to Android `assets/`
- ✅ Updates Capacitor plugins
- ✅ Configures native Android dependencies

---

### **Step 3: Open in Android Studio**

```bash
# Open Android project in Android Studio
npx cap open android
```

**Alternative:**
1. Launch Android Studio manually
2. **File** → **Open**
3. Navigate to `unified-mega-app/android`
4. Click **OK**

---

### **Step 4: Build Debug APK**

#### **Option A: Using Gradle (Command Line)**

```bash
# Navigate to android folder
cd android

# Build debug APK
./gradlew assembleDebug

# Windows:
gradlew.bat assembleDebug
```

**Output location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### **Option B: Using Android Studio**

1. Open project in Android Studio
2. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. Click **locate** in notification to find APK

---

### **Step 5: Install on Device/Emulator**

#### **Physical Device:**

1. **Enable Developer Options** on Android device:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   - Go back to **Settings** → **Developer Options**
   - Enable **USB Debugging**

2. **Connect via USB** and install:
```bash
# Verify device is connected
adb devices

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### **Emulator:**

1. **Create AVD** (Android Virtual Device):
   - Android Studio → **Tools** → **AVD Manager**
   - **Create Virtual Device**
   - Choose **Pixel 6** or similar
   - Select **API 34** system image
   - Click **Finish**

2. **Launch emulator** and install:
```bash
# Start emulator
emulator -avd Pixel_6_API_34

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔄 Development Workflow

### **Typical Development Cycle:**

```bash
# 1. Make changes to React/TypeScript code
# Edit files in src/

# 2. Build web assets
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Rebuild APK
cd android && ./gradlew assembleDebug

# 5. Install on device
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### **Live Reload (Development Mode):**

```bash
# Start dev server
npm run dev

# In Android Studio, update server URL in capacitor.config.ts:
{
  server: {
    url: 'http://YOUR_LOCAL_IP:5173',
    cleartext: true
  }
}

# Rebuild and install
# App will now load from local dev server with live reload!
```

---

## 🔗 Deep Links & OAuth

### **Configure Deep Links for OAuth**

All OAuth deep links are configured in:
`android/app/src/main/AndroidManifest.xml`

**Already configured for:**
- ✅ Spotify OAuth: `kolhub://spotify/callback`
- ✅ SoundCloud OAuth: `kolhub://soundcloud/callback`
- ✅ YouTube OAuth: `kolhub://youtube/callback`
- ✅ Google OAuth: `kolhub://google/callback`

### **Test Deep Links:**

```bash
# Test Spotify deep link
adb shell am start -W -a android.intent.action.VIEW -d "kolhub://spotify/callback?code=test123"

# Verify intent filter works
adb shell am start -W -a android.intent.action.VIEW -d "https://kolhub.netlify.app"
```

### **Get SHA1 Fingerprint for OAuth**

Required for Spotify Android SDK and Google OAuth:

```bash
# Debug keystore (for development)
cd android/app
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Look for SHA1 fingerprint:
# SHA1: 12:34:56:78:90:AB:CD:EF:...
```

**Add SHA1 to:**
1. **Spotify Developer Dashboard** → App Settings → Android Package
2. **Google Cloud Console** → OAuth Client ID → Android

---

## 🔐 Signing & Release

### **Step 1: Generate Release Keystore**

```bash
cd android/app

keytool -genkey -v -keystore kolhub-release.keystore -alias kolhub -keyalg RSA -keysize 2048 -validity 10000

# Enter secure password when prompted
# Fill in organization details
```

**⚠️ CRITICAL: Backup this keystore file securely!**
- If lost, you cannot update your app on Play Store
- Store in password manager + cloud backup

---

### **Step 2: Configure Signing**

Create `android/keystore.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=kolhub
storeFile=kolhub-release.keystore
```

**Add to `.gitignore`:**
```
android/keystore.properties
android/app/kolhub-release.keystore
```

---

### **Step 3: Update `build.gradle`**

Edit `android/app/build.gradle`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

### **Step 4: Build Release APK/AAB**

#### **Release APK:**
```bash
cd android
./gradlew assembleRelease

# Output:
# android/app/build/outputs/apk/release/app-release.apk
```

#### **App Bundle (for Play Store):**
```bash
./gradlew bundleRelease

# Output:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

### **Step 5: Test Release Build**

```bash
# Install release APK
adb install app/build/outputs/apk/release/app-release.apk

# Test all features:
# - OAuth flows work
# - Music playback works
# - All pages load
# - No crashes
```

---

## 🐛 Troubleshooting

### **Build Fails: "SDK location not found"**

**Solution:**
Create `android/local.properties`:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### **Gradle Sync Fails**

```bash
# Clean Gradle cache
cd android
./gradlew clean

# In Android Studio:
# File → Invalidate Caches / Restart
```

### **App Crashes on Launch**

**Check logs:**
```bash
adb logcat | grep -i "exception"
```

**Common causes:**
- Missing permissions in AndroidManifest.xml
- Incorrect Capacitor configuration
- Web assets not synced (`npx cap sync android`)

### **Deep Links Not Working**

1. Verify `AndroidManifest.xml` has intent filters
2. Check app link verification:
```bash
adb shell pm get-app-links com.kolhub.app
```
3. Test manually:
```bash
adb shell am start -W -a android.intent.action.VIEW -d "kolhub://spotify/callback"
```

### **OAuth Redirects Fail**

1. Verify SHA1 fingerprint is added to OAuth providers
2. Check package name matches: `com.kolhub.app`
3. Ensure deep links are configured in AndroidManifest.xml
4. Test with debug keystore SHA1 first

---

## 🎯 Quick Command Reference

```bash
# Build web assets
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# Build app bundle
cd android && ./gradlew bundleRelease

# Install APK
adb install app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat

# List devices
adb devices

# Get SHA1 fingerprint
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

---

## ✅ Android Development Checklist

### **Initial Setup:**
- [ ] JDK 17 installed
- [ ] Android Studio installed
- [ ] Android SDK 34 installed
- [ ] Environment variables configured
- [ ] Licenses accepted

### **First Build:**
- [ ] Web assets built (`npm run build`)
- [ ] Synced to Android (`npx cap sync android`)
- [ ] Opened in Android Studio
- [ ] Debug APK builds successfully
- [ ] Installed on device/emulator
- [ ] App launches without crashes

### **OAuth Configuration:**
- [ ] SHA1 fingerprint obtained
- [ ] Added to Spotify dashboard
- [ ] Added to Google Cloud Console
- [ ] Deep links configured in AndroidManifest
- [ ] Tested OAuth callbacks

### **Release Build:**
- [ ] Release keystore generated
- [ ] Keystore backed up securely
- [ ] `keystore.properties` created
- [ ] `build.gradle` updated
- [ ] Release APK builds successfully
- [ ] Release build tested on device

---

**You're ready to build Android apps! 🎉**

For deployment to Play Store, see `DEPLOYMENT_GUIDE.md`

---

*Last Updated: November 20, 2025*
*Platform: Android 14 (API 34)*
