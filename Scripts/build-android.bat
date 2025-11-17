@echo off
echo ========================================
echo KOL Personal OS - Android Build Script
echo ========================================
echo.

REM Step 1: Build web assets
echo [1/5] Building web assets...
call npm run build
if errorlevel 1 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)
echo ✓ Web assets built successfully
echo.

REM Step 2: Sync Capacitor
echo [2/5] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)
echo ✓ Capacitor synced successfully
echo.

REM Step 3: Copy Capacitor assets
echo [3/5] Copying Capacitor assets...
call npx cap copy android
if errorlevel 1 (
    echo Warning: Capacitor copy had issues, but continuing...
)
echo ✓ Assets copied
echo.

REM Step 4: Update Capacitor
echo [4/5] Updating Capacitor plugins...
call npx cap update android
if errorlevel 1 (
    echo Warning: Capacitor update had issues, but continuing...
)
echo ✓ Capacitor updated
echo.

REM Step 5: Open in Android Studio
echo [5/5] Opening Android Studio...
echo.
echo ========================================
echo Next Steps:
echo 1. Wait for Android Studio to open
echo 2. Let Gradle sync complete
echo 3. Connect your Android device or start emulator
echo 4. Click "Run" (green play button) to test
echo 5. For release build: Build -^> Generate Signed Bundle/APK
echo ========================================
echo.

call npx cap open android

echo.
echo Build preparation complete!
echo Android Studio should be opening now...
pause
