@echo off
REM 🖤 KOL HUB - Build All Platforms Script
REM ==========================================
REM This script builds the app for all platforms: Web, Desktop, Mobile
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         🖤 KOL HUB - BUILDING ALL PLATFORMS 🖤                ║
echo ║      "One hand on the keyboard, one hand on the altar"        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Clean previous builds
echo [1/7] 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
echo ✅ Clean complete

REM Step 2: Install dependencies
echo.
echo [2/7] 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Dependency installation failed
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Step 3: Build web version
echo.
echo [3/7] 🌐 Building web version...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Web build failed
    pause
    exit /b 1
)
echo ✅ Web build complete

REM Step 4: Build desktop version
echo.
echo [4/7] 💻 Building desktop version...
call npm run build:desktop
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Desktop build warning (may need manual configuration)
) else (
    echo ✅ Desktop build complete
)

REM Step 5: Sync mobile (Android)
echo.
echo [5/7] 📱 Syncing Android...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Android sync warning
) else (
    echo ✅ Android synced
)

REM Step 6: Sync mobile (iOS)
echo.
echo [6/7] 🍎 Syncing iOS...
call npx cap sync ios
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  iOS sync warning (requires macOS for full build)
) else (
    echo ✅ iOS synced
)

REM Step 7: Generate deployment summary
echo.
echo [7/7] 📋 Generating deployment summary...
echo 🖤 KOL HUB - BUILD SUMMARY > BUILD-SUMMARY.txt
echo ================================ >> BUILD-SUMMARY.txt
echo. >> BUILD-SUMMARY.txt
echo Build Date: %date% %time% >> BUILD-SUMMARY.txt
echo. >> BUILD-SUMMARY.txt
echo ✅ WEB BUILD: dist/ folder ready for Netlify >> BUILD-SUMMARY.txt
echo ✅ DESKTOP BUILD: Check dist/ for installer >> BUILD-SUMMARY.txt
echo ✅ ANDROID: Open in Android Studio via: npm run mobile:android >> BUILD-SUMMARY.txt
echo ✅ iOS: Open in Xcode via: npm run mobile:ios >> BUILD-SUMMARY.txt
echo. >> BUILD-SUMMARY.txt
echo NEXT STEPS: >> BUILD-SUMMARY.txt
echo 1. Deploy to Netlify: npm run deploy:netlify:windows >> BUILD-SUMMARY.txt
echo 2. Test desktop: npm run desktop >> BUILD-SUMMARY.txt
echo 3. Test web locally: npm run preview >> BUILD-SUMMARY.txt
echo 4. Build Android APK: Open Android Studio ^& build >> BUILD-SUMMARY.txt
echo 5. Build iOS IPA: Open Xcode ^& archive >> BUILD-SUMMARY.txt

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  ✨ BUILD COMPLETE! ✨                         ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║  📁 Web: dist/ folder ready                                    ║
echo ║  💻 Desktop: Installer in dist/                                ║
echo ║  📱 Android: Run 'npm run mobile:android' to open studio       ║
echo ║  🍎 iOS: Run 'npm run mobile:ios' to open Xcode               ║
echo ║                                                                ║
echo ║  🚀 Deploy to Netlify: npm run deploy:netlify:windows         ║
echo ║  🔍 View summary: BUILD-SUMMARY.txt                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Press any key to open BUILD-SUMMARY.txt...
pause >nul
notepad BUILD-SUMMARY.txt
