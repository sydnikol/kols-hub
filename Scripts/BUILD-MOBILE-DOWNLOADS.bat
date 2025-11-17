@echo off
echo ========================================
echo   📱 MOBILE APP DOWNLOAD BUILDER
echo ========================================
echo.

cd /d "%~dp0.."

echo 🔍 Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

echo 📦 Building mobile download assets...
echo This will prepare the app for mobile installation
echo.

node Scripts\build-mobile-downloads.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ BUILD COMPLETE!
    echo ========================================
    echo.
    echo 📱 Your mobile apps are ready!
    echo.
    echo NEXT STEPS:
    echo.
    echo 1. EASIEST: Install via browser (PWA)
    echo    - Open this website on your phone
    echo    - Tap "Add to Home Screen"
    echo    - Done! Works offline!
    echo.
    echo 2. ADVANCED: Build native apps
    echo    - Android: npm run build:android
    echo    - iOS: npm run build:ios
    echo.
    echo 📄 See public\downloads\README.md for details
    echo.
) else (
    echo.
    echo ❌ Build failed! Check errors above.
    echo.
)

pause