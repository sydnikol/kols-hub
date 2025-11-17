@echo off
title KOL HUB - Platform Launcher v5.0
color 0d
cls

echo.
echo  ══════════════════════════════════════════════════════════════
echo                    🖤 KOL HUB - PLATFORM LAUNCHER 🖤
echo  ══════════════════════════════════════════════════════════════
echo.
echo              "One hand on the keyboard, one hand on the altar"
echo.
echo  ══════════════════════════════════════════════════════════════
echo.

echo  Select your platform:
echo.
echo   [1] 🖥️  Desktop (Electron) - Best for daily use
echo   [2] 🌐 Web (Development) - localhost:5173
echo   [3] 📱 Mobile (Android Build)
echo   [4] 🍎 Mobile (iOS Build)
echo   [5] 🔧 Verify All Platforms
echo   [6] 🚀 Deploy to Web (Netlify)
echo   [7] 📊 Build Production Web
echo   [8] ❌ Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto desktop
if "%choice%"=="2" goto web
if "%choice%"=="3" goto android
if "%choice%"=="4" goto ios
if "%choice%"=="5" goto verify
if "%choice%"=="6" goto deploy
if "%choice%"=="7" goto build
if "%choice%"=="8" goto end

echo Invalid choice. Please try again.
timeout /t 2 >nul
goto start

:desktop
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo  Starting KOL HUB Desktop (Electron)...
echo ══════════════════════════════════════════════════════════════
echo.
call npm run desktop
pause
goto end

:web
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo  Starting KOL HUB Web Development Server...
echo ══════════════════════════════════════════════════════════════
echo.
echo  Opening at: http://localhost:5173
echo.
call npm run dev
pause
goto end

:android
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo  Building KOL HUB for Android...
echo ══════════════════════════════════════════════════════════════
echo.
echo  This will build the production version and open Android Studio.
echo  APK will be in: android/app/build/outputs/apk/release/
echo.
call npm run build:android
pause
goto end

:ios
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo  Building KOL HUB for iOS...
echo ══════════════════════════════════════════════════════════════
echo.
echo  This will build the production version and open Xcode.
echo  Note: Requires macOS with Xcode installed.
echo.
call npm run build:ios
pause
goto end

:verify
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo  Verifying All Platforms...
echo ══════════════════════════════════════════════════════════════
echo.
call verify-all-platforms.bat
goto end

:deploy
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo  Deploying to Netlify...
echo ══════════════════════════════════════════════════════════════
echo.
echo  This will build and deploy to: kol-personal-os.netlify.app
echo.
set /p confirm="Are you sure? (y/n): "
if /i "%confirm%"=="y" (
    call npm run deploy:netlify
) else (
    echo Deployment cancelled.
)
pause
goto end

:build
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo  Building Production Web Version...
echo ══════════════════════════════════════════════════════════════
echo.
call npm run build
echo.
echo ✅ Build complete! Files in: dist/
echo.
pause
goto end

:end
cls
echo.
echo ══════════════════════════════════════════════════════════════
echo                   🖤 Thank you for using KOL HUB 🖤
echo ══════════════════════════════════════════════════════════════
echo.
echo           Built with velvet, voltage, and reverence
echo.
echo ══════════════════════════════════════════════════════════════
echo.
timeout /t 3 >nul
