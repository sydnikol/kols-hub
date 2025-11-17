@echo off
echo ========================================
echo 🔧 KOL HUB - Android Build Fix
echo ========================================
echo.

cd /d "C:\Users\Asus User\Desktop\unified-mega-app"

echo [1/5] Building web app...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Web build failed
    pause
    exit /b 1
)
echo ✅ Web build complete
echo.

echo [2/5] Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed
    pause
    exit /b 1
)
echo ✅ Capacitor sync complete
echo.

echo [3/5] Cleaning Android build...
cd android
call gradlew clean
echo ✅ Clean complete
echo.

echo [4/5] Building Android app...
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Android build failed
    pause
    exit /b 1
)
echo ✅ Android build complete
echo.

echo [5/5] Locating APK...
cd app\build\outputs\apk\debug
if exist app-debug.apk (
    echo ✅ APK created successfully!
    echo.
    echo 📱 APK Location:
    echo %cd%\app-debug.apk
    echo.
    echo You can now:
    echo 1. Install on your device
    echo 2. Test in Android emulator
    echo 3. Share with others
) else (
    echo ❌ APK not found
)

cd /d "C:\Users\Asus User\Desktop\unified-mega-app"
echo.
pause
