# 🤖 Android Build Guide - KOL HUB v5.0

## Quick Fix for Gradle Issues

If you see "Unable to find Gradle tasks" errors in Android Studio:

### Option 1: Use the Fix Script (Easiest)
```bash
fix-android-studio.bat
```

This will:
1. Build the latest web version
2. Sync Capacitor with Android
3. Open Android Studio
4. Wait for Gradle sync to complete

### Option 2: Manual Fix in Android Studio

1. **Wait for automatic Gradle sync** (bottom right corner)
2. If it doesn't start automatically:
   - Click **File > Sync Project with Gradle Files**
   - Or click the **🐘 elephant icon** in the toolbar
3. If still having issues:
   - **File > Invalidate Caches > Invalidate and Restart**
   - Wait for Android Studio to restart and reindex

### Option 3: Command Line Build (No Android Studio)
```bash
build-android-debug.bat
```

This will:
1. Build web app
2. Sync Capacitor
3. Clean Android project
4. Build debug APK
5. Show APK location

---

## Building Debug APK (For Testing)

### Method 1: Using Script
```bash
build-android-debug.bat
```

### Method 2: Using Gradle Commands
```bash
cd android
gradlew clean
gradlew assembleDebug
```

**Output:** `android\app\build\outputs\apk\debug\app-debug.apk`

---

## Building Release APK (For Distribution)

### Prerequisites
You need a signing key. Create one with:
```bash
keytool -genkey -v -keystore kol-hub-release.keystore -alias kol-hub -keyalg RSA -keysize 2048 -validity 10000
```

### Update gradle.properties
Create/edit `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=kol-hub-release.keystore
MYAPP_RELEASE_KEY_ALIAS=kol-hub
MYAPP_RELEASE_STORE_PASSWORD=your-password-here
MYAPP_RELEASE_KEY_PASSWORD=your-password-here
```

### Update app/build.gradle
Add to `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Build Release APK
```bash
cd android
gradlew assembleRelease
```

**Output:** `android\app\build\outputs\apk\release\app-release.apk`

---

## Building Android App Bundle (AAB) for Google Play

### Debug Bundle
```bash
cd android
gradlew bundleDebug
```

### Release Bundle
```bash
cd android
gradlew bundleRelease
```

**Output:** `android\app\build\outputs\bundle\release\app-release.aab`

---

## Common Issues & Solutions

### Issue: "Unable to find Gradle tasks"
**Solution:** Run `fix-android-studio.bat` or sync Gradle manually

### Issue: "SDK location not found"
**Solution:** Create `android/local.properties`:
```properties
sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

### Issue: "Build failed with Kotlin error"
**Solution:** Update `android/build.gradle`:
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:8.0.0'
    classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.8.0'
}
```

### Issue: "Out of memory during build"
**Solution:** Create/edit `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4g -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError
```

### Issue: "Failed to install APK"
**Solution:**
1. Enable USB debugging on your Android device
2. Uninstall old version of app
3. Try: `adb install -r path/to/app.apk`

---

## Testing Your APK

### On Physical Device
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run: `adb install android\app\build\outputs\apk\debug\app-debug.apk`

### On Emulator
1. Open Android Studio
2. Open **AVD Manager** (Tools > Device Manager)
3. Create/start an emulator
4. Drag APK file onto emulator window

### Manual Install
1. Copy APK to device
2. Open file manager on device
3. Tap APK file
4. Allow installation from unknown sources if prompted
5. Install

---

## App Signing for Google Play

### Generate Upload Key (One Time)
```bash
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

### Configure Signing
Edit `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../upload-keystore.jks')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias 'upload'
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
}
```

### Build Signed AAB
```bash
cd android
gradlew bundleRelease
```

Upload `app-release.aab` to Google Play Console

---

## App Details for Google Play

- **App Name:** KOL Personal OS
- **Package Name:** com.kol.megaapp
- **Version Code:** 1
- **Version Name:** 5.0.0
- **Min SDK:** 22 (Android 5.1)
- **Target SDK:** 33 (Android 13)

---

## Build Scripts Available

1. **fix-android-studio.bat** - Fix Gradle sync issues
2. **build-android-debug.bat** - Build debug APK
3. **npm run build:android** - Build web + open Android Studio
4. **npm run build:android-only** - Build release APK from command line

---

## Performance Optimization

### Reduce APK Size
In `android/app/build.gradle`:
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Enable ProGuard
Create/edit `android/app/proguard-rules.pro`:
```proguard
-keep class com.getcapacitor.** { *; }
-keep class com.kol.megaapp.** { *; }
-dontwarn com.getcapacitor.**
```

---

## Next Steps After Building

1. **Test thoroughly** on multiple devices
2. **Prepare store listing** (screenshots, description)
3. **Create privacy policy** (required by Google Play)
4. **Submit to Google Play Console**
5. **Wait for review** (typically 1-3 days)

---

**🖤 Your Android app is ready to build! 🖤**

**For quick start:** Run `fix-android-studio.bat`

---

**Updated:** November 14, 2025  
**Version:** 5.0.0  
**Package:** com.kol.megaapp
