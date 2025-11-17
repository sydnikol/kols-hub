# KOL Personal OS - Android Setup & Troubleshooting Guide

## 🚀 Quick Start

### Option 1: One-Click Build (Recommended)
```batch
Scripts\build-android.bat
```
This will:
- Build web assets
- Sync Capacitor
- Open Android Studio for testing

### Option 2: Quick Test Build
```batch
Scripts\quick-android-test.bat
```
This will build and attempt to install directly on your device.

### Option 3: Release Build
```batch
Scripts\build-android-release.bat
```
This creates an optimized APK for distribution.

## 📱 Requirements

### Essential Software
1. **Node.js** (v18 or higher)
2. **Android Studio** (latest version)
3. **Java Development Kit (JDK)** 17 or higher
4. **Android SDK** (installed via Android Studio)

### Android SDK Components
Install these via Android Studio SDK Manager:
- Android SDK Platform 34
- Android SDK Build-Tools 34.0.0
- Android SDK Platform-Tools
- Android Emulator (for testing without device)

## 🔧 Build Process Explained

### 1. Web Build
```batch
npm run build
```
Compiles React/TypeScript into optimized static files in `dist/`

### 2. Capacitor Sync
```batch
npx cap sync android
```
Copies web assets to Android project and updates plugins

### 3. Android Build
```batch
cd android
gradlew assembleDebug
```
Builds the APK file

## 🐛 Common Issues & Solutions

### Issue: "Gradle sync failed"
**Solution:**
```batch
Scripts\fix-android.bat
```
This completely rebuilds the Android platform.

### Issue: "SDK location not found"
**Solution:**
1. Create `android/local.properties`
2. Add: `sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk`
   (Replace with your actual SDK path)

### Issue: "Dependency resolution failed"
**Solution:**
```batch
cd android
gradlew clean
gradlew build --refresh-dependencies
cd ..
```

### Issue: "App crashes on startup"
**Solutions:**
1. Check Android logs:
   ```batch
   adb logcat | findstr "com.kol.megaapp"
   ```

2. Clear app data on device:
   Settings → Apps → KOL Personal OS → Storage → Clear Data

3. Rebuild with:
   ```batch
   Scripts\fix-android.bat
   ```

### Issue: "Build is too slow"
**Solutions:**
1. Enable Gradle daemon in `android/gradle.properties`:
   ```properties
   org.gradle.daemon=true
   org.gradle.parallel=true
   org.gradle.caching=true
   ```

2. Increase memory:
   ```properties
   org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
   ```

## 📦 APK Installation

### Via USB
1. Enable USB Debugging on Android device
2. Connect device
3. Run:
   ```batch
   adb install -r android\app\build\outputs\apk\debug\app-debug.apk
   ```

### Via File Transfer
1. Copy APK to device
2. Open file manager on device
3. Tap APK file
4. Allow installation from unknown sources if prompted

## 🏗️ Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/kol/megaapp/
│   │       │   └── MainActivity.java
│   │       ├── res/          # App resources (icons, strings, etc.)
│   │       └── AndroidManifest.xml
│   ├── build.gradle         # App-level build config
│   └── proguard-rules.pro   # Code optimization rules
├── build.gradle              # Project-level build config
├── variables.gradle          # SDK versions
└── local.properties          # Local SDK path (gitignored)
```

## 🎨 Customization

### App Icon
Replace files in `android/app/src/main/res/`:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### App Name
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">KOL Personal OS</string>
```

### Package Name
To change from `com.kol.megaapp`:
1. Update `capacitor.config.ts` → `appId`
2. Update `android/app/build.gradle` → `applicationId` and `namespace`
3. Update `android/app/src/main/AndroidManifest.xml` → `package`
4. Rename Java package directory
5. Update MainActivity.java package declaration

## 🔒 Signing for Release

### Generate Keystore (One-Time)
```batch
keytool -genkey -v -keystore kol-release-key.keystore -alias kol-key -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing in build.gradle
Add to `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../kol-release-key.keystore")
            storePassword "YOUR_PASSWORD"
            keyAlias "kol-key"
            keyPassword "YOUR_PASSWORD"
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### Build Signed APK
```batch
cd android
gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

## 📊 Performance Optimization

### Reduce APK Size
1. Enable ProGuard (already configured)
2. Use APK Analyzer in Android Studio:
   Build → Analyze APK → Select your APK
3. Remove unused resources:
   ```gradle
   buildTypes {
       release {
           shrinkResources true
       }
   }
   ```

### Improve Load Time
1. Enable multidex (already configured)
2. Use code splitting in web build
3. Lazy load heavy features

### Optimize for Low-End Devices
1. Reduce minSdkVersion in `variables.gradle`
2. Test on various device configurations
3. Use Android Profiler in Android Studio

## 🧪 Testing

### Run on Emulator
1. Open Android Studio
2. AVD Manager → Create Virtual Device
3. Select device and Android version
4. Click "Run" button in Android Studio

### Run on Physical Device
1. Enable Developer Options on device:
   Settings → About Phone → Tap "Build Number" 7 times
2. Enable USB Debugging:
   Settings → Developer Options → USB Debugging
3. Connect via USB
4. Accept debugging authorization on device
5. Device should appear in Android Studio

### Debug with Chrome DevTools
1. Build and run app
2. Open Chrome: `chrome://inspect`
3. Click "inspect" under your device
4. Use full DevTools for debugging

## 🔄 Updates & Maintenance

### Update Capacitor
```batch
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/android@latest
npx cap sync android
```

### Update Android Dependencies
Update versions in `android/variables.gradle`, then:
```batch
cd android
gradlew clean
gradlew build
```

### Clean Build
```batch
Scripts\fix-android.bat
```

## 📱 Distribution

### Google Play Store
1. Build signed APK or AAB (Android App Bundle):
   ```batch
   cd android
   gradlew bundleRelease
   ```
2. Output: `android/app/build/outputs/bundle/release/app-release.aab`
3. Upload to Google Play Console
4. Complete store listing
5. Submit for review

### Direct Distribution
- Share APK file directly
- Host on your website
- Use alternative app stores (F-Droid, Amazon Appstore)

## 🆘 Emergency Fixes

### Nuclear Option - Complete Rebuild
```batch
rmdir /s /q android
rmdir /s /q node_modules
npm install
npx cap add android
Scripts\build-android.bat
```

### Cannot Find Android SDK
Set environment variable:
```batch
setx ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
```

### Gradle Daemon Issues
```batch
cd android
gradlew --stop
cd ..
```

## 📚 Resources

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/guide)
- [Gradle User Manual](https://docs.gradle.org/)

## 🎯 Checklist for First Build

- [ ] Node.js installed
- [ ] Android Studio installed
- [ ] JDK 17+ installed
- [ ] Android SDK installed
- [ ] `local.properties` configured
- [ ] USB Debugging enabled on device
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Run `npx cap sync android`
- [ ] Open Android Studio
- [ ] Wait for Gradle sync
- [ ] Click Run button
- [ ] App launches successfully

## ✅ Success Indicators

When everything is working correctly:
- ✓ Gradle sync completes without errors
- ✓ App builds without warnings
- ✓ App installs on device
- ✓ App launches without crashing
- ✓ All features work offline
- ✓ Notifications work
- ✓ Data persists between launches

---

**Last Updated:** Android Build Configuration v1.0
**App Version:** KOL Personal OS 1.0.0
**Target SDK:** Android 14 (API 34)
**Min SDK:** Android 7.0 (API 24)
