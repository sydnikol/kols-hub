@echo off
echo ========================================
echo KOL Personal OS - Quick Android Test
echo ========================================
echo.

REM Quick build and test without opening Android Studio
echo [1/4] Building web assets...
call npm run build
if errorlevel 1 goto :error

echo [2/4] Syncing to Android...
call npx cap sync android
if errorlevel 1 goto :error

echo [3/4] Building APK...
cd android
call gradlew assembleDebug
if errorlevel 1 (
    cd ..
    goto :error
)
cd ..

echo [4/4] Installing on device...
echo.
echo ========================================
echo APK Location:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo ========================================
echo.
echo To install manually:
echo 1. Connect your Android device via USB
echo 2. Enable USB debugging in Developer Options
echo 3. Run: adb install -r android\app\build\outputs\apk\debug\app-debug.apk
echo.

REM Try to install automatically if adb is available
where adb >nul 2>&1
if %errorlevel% equ 0 (
    echo Attempting automatic installation...
    adb install -r android\app\build\outputs\apk\debug\app-debug.apk
    if errorlevel 1 (
        echo.
        echo Auto-install failed. Please install manually using the path above.
    ) else (
        echo.
        echo ✓ App installed successfully!
        echo Launch "KOL Personal OS" on your device to test.
    )
) else (
    echo.
    echo ADB not found. Please install Android SDK Platform Tools or install APK manually.
)

echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ERROR: Build failed!
echo Check the error messages above.
echo ========================================
pause
exit /b 1
