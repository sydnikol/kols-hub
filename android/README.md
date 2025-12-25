# KOL Personal OS - Android Project

This is the native Android project generated and managed by Capacitor.

## Quick Start

**From project root, run:**
```batch
..\Scripts\build-android.bat
```

Or use the launcher:
```batch
..\ANDROID-LAUNCHER.bat
```

## Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/kol/megaapp/
│   │   │   └── MainActivity.java       # Main app activity
│   │   ├── res/                        # Resources (icons, strings, etc.)
│   │   └── AndroidManifest.xml         # App configuration & permissions
│   ├── build.gradle                    # App-level build config
│   └── proguard-rules.pro              # Code optimization rules
├── gradle/                              # Gradle wrapper
├── build.gradle                         # Project-level build config
├── variables.gradle                     # SDK versions & dependencies
├── gradle.properties                    # Gradle configuration
└── local.properties                     # SDK path (auto-generated)
```

## Important Files

### AndroidManifest.xml
Defines app permissions, activities, and configuration. Contains:
- App metadata (name, icon, theme)
- Permissions (internet, storage, camera, etc.)
- Activity configuration
- FileProvider setup

### build.gradle (app/)
Controls how the app is built:
- Application ID: `com.kol.megaapp`
- Min SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
- Dependencies (AndroidX, Capacitor, etc.)
- Build types (debug/release)
- ProGuard configuration

### MainActivity.java
The entry point for the app:
- Extends `BridgeActivity` from Capacitor
- Handles app lifecycle
- Enables hardware acceleration
- Manages system windows

### variables.gradle
Centralized version management:
- SDK versions
- AndroidX library versions
- Build tool versions

### proguard-rules.pro
Code optimization rules for release builds:
- Keeps Capacitor classes
- Preserves JavaScript interfaces
- Maintains debugging info
- Optimizes final APK

## Build Process

### Debug Build
```batch
cd android
gradlew assembleDebug
```
Output: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build
```batch
cd android
gradlew assembleRelease
```
Output: `app/build/outputs/apk/release/app-release-unsigned.apk`

### Install on Device
```batch
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Common Commands

```batch
# Clean build
gradlew clean

# Build debug APK
gradlew assembleDebug

# Build release APK
gradlew assembleRelease

# Install on connected device
gradlew installDebug

# Uninstall from device
gradlew uninstallDebug

# Run all checks
gradlew check

# List all tasks
gradlew tasks

# Stop Gradle daemon
gradlew --stop

# Refresh dependencies
gradlew build --refresh-dependencies
```

## Troubleshooting

### Gradle sync failed
```batch
cd ..
Scripts\fix-android.bat
```

### SDK location not found
Create/edit `local.properties`:
```properties
sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Build too slow
Edit `gradle.properties`:
```properties
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.jvmargs=-Xmx4096m
```

### App crashes on device
Check logs:
```batch
adb logcat | findstr "com.kol.megaapp"
```

### Need to reset everything
```batch
cd ..
rmdir /s /q android
npx cap add android
Scripts\build-android.bat
```

## Development Workflow

1. Make changes to React/TypeScript code in `src/`
2. Build web assets: `npm run build`
3. Sync to Android: `npx cap sync android`
4. Test changes:
   - Open Android Studio: `npx cap open android`
   - Or build APK: `cd android && gradlew assembleDebug`
5. Install on device and test

## Android Studio

### Opening Project
```batch
npx cap open android
```

Or open Android Studio and select the `android/` folder.

### First Time Setup
1. Wait for Gradle sync to complete
2. Accept any SDK/tool installation prompts
3. Configure emulator (if not using physical device)
4. Click "Run" button

### Debugging
- Use Android Studio's debugger
- View logcat for console output
- Use Layout Inspector for UI debugging
- Profile app performance with Android Profiler

## Customization

### App Icon
Replace icons in `app/src/main/res/mipmap-*/` folders

### App Name
Edit `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">KOL Personal OS</string>
```

### Theme/Colors
Edit `app/src/main/res/values/styles.xml`

### Splash Screen
Configure in `capacitor.config.ts` (root of project)

## Signing for Release

### Generate Keystore
```batch
keytool -genkey -v -keystore kol-release.keystore -alias kol-key -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing
Add to `app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("path/to/kol-release.keystore")
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
gradlew assembleRelease
```

## Resources

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/guide)
- [Gradle User Manual](https://docs.gradle.org/)

## Need Help?

See the comprehensive guide:
```batch
cd ..
start ANDROID-GUIDE.md
```

Or use the launcher:
```batch
cd ..
ANDROID-LAUNCHER.bat
```

---

**App Version:** 1.0.0  
**Package:** com.kol.megaapp  
**Min SDK:** 24 (Android 7.0)  
**Target SDK:** 34 (Android 14)  
**Build Tools:** Gradle 8.5
