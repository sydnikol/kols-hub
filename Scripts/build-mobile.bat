@echo off
REM 🤖 WINDOWS AUTOMATED MOBILE BUILD SCRIPT
REM ==========================================
REM Builds Android APK automatically on Windows

echo.
echo 🚀 Starting KOL Hub Mobile Build Process...
echo ============================================
echo.

REM Get version from package.json
for /f "tokens=2 delims=:, " %%a in ('type package.json ^| findstr /C:"\"version\""') do set VERSION=%%~a
echo 📦 Building version: %VERSION%

REM Step 1: Install dependencies
echo.
echo 📥 Installing dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 goto :error

REM Step 2: Build web app
echo.
echo 🌐 Building web application...
call npm run build
if errorlevel 1 goto :error

REM Step 3: Setup Android platform (if not already done)
echo.
echo 📱 Setting up Android platform...
if not exist "android\" (
    echo Adding Android platform...
    call npx cap add android
    if errorlevel 1 goto :error
)

REM Step 4: Sync web build to Android
echo.
echo 🔄 Syncing to Android platform...
call npx cap sync android
if errorlevel 1 goto :error

REM Step 5: Build Android APK
echo.
echo 📦 Building Android APK...
cd android
call gradlew clean
call gradlew assembleRelease
if errorlevel 1 (
    cd ..
    goto :error
)

REM Find the APK
for /r %%i in (app\build\outputs\apk\release\*.apk) do set APK_PATH=%%i

if exist "%APK_PATH%" (
    cd ..
    if not exist "public\downloads\" mkdir public\downloads
    copy "%APK_PATH%" "public\downloads\kol-hub-v%VERSION%.apk"
    echo.
    echo ✅ Android APK built successfully!
    echo    Location: public\downloads\kol-hub-v%VERSION%.apk
    for %%A in ("public\downloads\kol-hub-v%VERSION%.apk") do echo    Size: %%~zA bytes
) else (
    cd ..
    echo ❌ Failed to build Android APK
    goto :error
)

REM Step 6: Create release notes
echo.
echo 📝 Creating release notes...
(
echo # KOL Hub v%VERSION% Release Notes
echo.
echo ## 🎉 What's New
echo.
echo - Full cross-platform support ^(Desktop, Web, Mobile^)
echo - Works completely offline with IndexedDB
echo - ChronoMuse AI companion with 3D avatar
echo - Comprehensive health tracking system
echo - Music sanctuary with Spotify/YouTube/SoundCloud
echo - Support handbooks and advocacy scripts
echo - Self-evolving pattern recognition
echo.
echo ## 📦 Downloads
echo.
echo ### Android
echo - File: kol-hub-v%VERSION%.apk
echo - Min Android: 7.0 ^(Nougat^)
echo.
echo ## 📱 Installation
echo.
echo ### Android
echo 1. Download the APK file
echo 2. Enable "Install from Unknown Sources" if prompted
echo 3. Open the APK and follow installation prompts
echo 4. Launch KOL Hub from your app drawer
echo.
echo ## 🔧 System Requirements
echo.
echo - **Android:** 7.0+, 100 MB storage, 2 GB RAM
echo.
echo ## 💜 Built with velvet, voltage, and reverence
) > public\downloads\RELEASE_NOTES_v%VERSION%.md

echo ✅ Release notes created!

REM Summary
echo.
echo ============================================
echo 🎉 Build Complete!
echo ============================================
echo.
echo Built files:
echo   • Android APK: public\downloads\kol-hub-v%VERSION%.apk
echo   • Release Notes: public\downloads\RELEASE_NOTES_v%VERSION%.md
echo.
echo Next steps:
echo   1. Test the APK on an Android device
echo   2. Upload to GitHub Releases
echo   3. Update download URLs in the app
echo.
echo Happy releasing! 🚀
echo.
pause
exit /b 0

:error
echo.
echo ❌ Build failed! Check the error messages above.
echo.
pause
exit /b 1
