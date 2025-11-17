@echo off
title KOL Personal OS - Android Dev Launcher
color 5F

:menu
cls
echo.
echo  ═══════════════════════════════════════════════════════════════
echo  ║                                                             ║
echo  ║             KOL PERSONAL OS - ANDROID LAUNCHER              ║
echo  ║                                                             ║
echo  ║                   Gothic Futurism Edition                   ║
echo  ║                                                             ║
echo  ═══════════════════════════════════════════════════════════════
echo.
echo   [1] 🚀 Build and Open in Android Studio
echo   [2] ⚡ Quick Test Build (with ADB install)
echo   [3] 📦 Build Release APK
echo   [4] 🔧 Fix/Rebuild Android Platform
echo   [5] 🌐 Run Web Version (localhost:5173)
echo   [6] 💻 Build Desktop Version
echo   [7] 📱 Open Android Folder
echo   [8] 📊 Check Build Status
echo   [9] 📖 Open Android Guide
echo   [0] ❌ Exit
echo.
echo  ═══════════════════════════════════════════════════════════════
echo.
set /p choice="   Select option: "

if "%choice%"=="1" goto build_android
if "%choice%"=="2" goto quick_test
if "%choice%"=="3" goto release_build
if "%choice%"=="4" goto fix_android
if "%choice%"=="5" goto web_dev
if "%choice%"=="6" goto desktop_build
if "%choice%"=="7" goto open_android
if "%choice%"=="8" goto check_status
if "%choice%"=="9" goto open_guide
if "%choice%"=="0" goto exit

echo.
echo   Invalid choice! Press any key to try again...
pause >nul
goto menu

:build_android
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Building Android App...
echo   ═══════════════════════════════════════════════════════════
echo.
call Scripts\build-android.bat
pause
goto menu

:quick_test
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Quick Test Build...
echo   ═══════════════════════════════════════════════════════════
echo.
call Scripts\quick-android-test.bat
pause
goto menu

:release_build
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Building Release APK...
echo   ═══════════════════════════════════════════════════════════
echo.
call Scripts\build-android-release.bat
pause
goto menu

:fix_android
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Fixing/Rebuilding Android Platform...
echo   ═══════════════════════════════════════════════════════════
echo.
call Scripts\fix-android.bat
pause
goto menu

:web_dev
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Starting Web Dev Server...
echo   ═══════════════════════════════════════════════════════════
echo.
echo   Opening http://localhost:5173
echo   Press Ctrl+C to stop server
echo.
start http://localhost:5173
call npm run dev
pause
goto menu

:desktop_build
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Building Desktop Version...
echo   ═══════════════════════════════════════════════════════════
echo.
call npm run build
call npm run desktop
pause
goto menu

:open_android
cls
echo.
echo   Opening Android project folder...
start explorer android
pause
goto menu

:check_status
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Build Status Check
echo   ═══════════════════════════════════════════════════════════
echo.
echo   Checking files...
echo.

if exist "dist\index.html" (
    echo   ✓ Web build exists
) else (
    echo   ✗ Web build missing - run "npm run build"
)

if exist "android\app\build.gradle" (
    echo   ✓ Android platform configured
) else (
    echo   ✗ Android platform missing - run option 4 to fix
)

if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo   ✓ Debug APK exists
) else (
    echo   ✗ Debug APK not built yet
)

if exist "android\app\build\outputs\apk\release\app-release-unsigned.apk" (
    echo   ✓ Release APK exists
) else (
    echo   ✗ Release APK not built yet
)

echo.
echo   Checking tools...
echo.

where node >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Node.js installed
) else (
    echo   ✗ Node.js not found
)

where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ NPM installed
) else (
    echo   ✗ NPM not found
)

where adb >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ ADB available (Android debugging)
) else (
    echo   ℹ ADB not in PATH (optional)
)

where gradle >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Gradle in PATH
) else (
    echo   ℹ Gradle not in PATH (Android Studio has built-in)
)

echo.
echo   Project info...
echo.
if exist "package.json" (
    findstr /C:"\"version\"" package.json
)
echo   Platform: Windows
echo   App ID: com.kol.megaapp
echo.
pause
goto menu

:open_guide
cls
echo.
echo   Opening Android Guide...
start ANDROID-GUIDE.md
pause
goto menu

:exit
cls
echo.
echo   ═══════════════════════════════════════════════════════════
echo   Thanks for using KOL Personal OS Developer Tools!
echo   ═══════════════════════════════════════════════════════════
echo.
timeout /t 2 >nul
exit /b 0
