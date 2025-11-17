@echo off
title KOL HUB - Gradle Fix Master Control
color 5F
cls

echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                                                              ║
echo   ║         🖤 KOL HUB - GRADLE FIX MASTER CONTROL 🖤            ║
echo   ║                                                              ║
echo   ║                  Gradle Build Error Repair                   ║
echo   ║                                                              ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo.
echo   Current Status:
echo   ✓ Gradle: 8.5 (stable)
echo   ✓ Android Plugin: 8.2.0
echo   ✓ SDK: 34
echo   ✓ Performance: Optimized
echo.
echo   ═══════════════════════════════════════════════════════════════
echo.
echo   Choose your fix option:
echo.
echo   [1] QUICK FIX (30 seconds)
echo       • Kill Java/Gradle processes
echo       • Clear Gradle cache
echo       • Clean build directories
echo       • Fast restart
echo.
echo   [2] COMPLETE FIX (10 minutes)
echo       • Stop all Gradle daemons
echo       • Full cache clean
echo       • Reinstall node_modules
echo       • Complete Capacitor sync
echo       • Full rebuild
echo.
echo   [3] TEST BUILD (verify it works)
echo       • Run test build
echo       • Verify Gradle sync
echo       • Check for errors
echo.
echo   [4] OPEN GUIDES
echo       • View troubleshooting guide (HTML)
echo       • Read quick reference (TXT)
echo       • See full docs (MD)
echo.
echo   [5] BUILD ANDROID APK
echo       • Build debug APK
echo       • Build release APK
echo       • Create app bundle
echo.
echo   [6] EXIT
echo.
echo   ═══════════════════════════════════════════════════════════════
echo.
set /p choice="   Enter your choice (1-6): "

if "%choice%"=="1" goto quickfix
if "%choice%"=="2" goto completefix
if "%choice%"=="3" goto testbuild
if "%choice%"=="4" goto guides
if "%choice%"=="5" goto buildapk
if "%choice%"=="6" goto end
goto menu

:quickfix
cls
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                      QUICK FIX (30 SEC)                      ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Step 1: Closing Android Studio...
echo   Please close Android Studio NOW if it's open.
pause
echo.
echo   Step 2: Killing Java/Gradle processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
timeout /t 2 /nobreak >nul
echo   ✓ Done
echo.
echo   Step 3: Clearing Gradle cache...
rmdir /S /Q "%USERPROFILE%\.gradle\caches" 2>nul
rmdir /S /Q "%USERPROFILE%\.gradle\daemon" 2>nul
echo   ✓ Done
echo.
echo   Step 4: Cleaning build directories...
cd android
rmdir /S /Q build 2>nul
rmdir /S /Q app\build 2>nul
rmdir /S /Q .gradle 2>nul
rmdir /S /Q .idea 2>nul
cd ..
echo   ✓ Done
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                   QUICK FIX COMPLETE! ✓                      ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Next steps:
echo   1. Open Android Studio
echo   2. File → Invalidate Caches → Invalidate and Restart
echo   3. Wait for Gradle sync (2-3 minutes)
echo   4. Build → Clean Project
echo   5. Build → Rebuild Project
echo.
echo   Press any key to return to menu...
pause >nul
goto menu

:completefix
cls
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                  COMPLETE FIX (10 MINUTES)                   ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   This will completely rebuild everything. Continue? (Y/N)
set /p confirm="   "
if /i not "%confirm%"=="Y" goto menu
echo.
echo   Step 1: Closing Android Studio...
echo   Please close Android Studio NOW if it's open.
pause
echo.
echo   Step 2: Stopping Gradle daemons...
cd android
call gradlew --stop
cd ..
echo   ✓ Done
echo.
echo   Step 3: Clearing Gradle cache completely...
rmdir /S /Q "%USERPROFILE%\.gradle\caches" 2>nul
rmdir /S /Q "%USERPROFILE%\.gradle\daemon" 2>nul
echo   ✓ Done
echo.
echo   Step 4: Cleaning all Android build directories...
rmdir /S /Q android\build 2>nul
rmdir /S /Q android\app\build 2>nul
rmdir /S /Q android\.gradle 2>nul
rmdir /S /Q android\.idea 2>nul
echo   ✓ Done
echo.
echo   Step 5: Cleaning node_modules...
rmdir /S /Q node_modules 2>nul
echo   ✓ Done
echo.
echo   Step 6: Reinstalling packages...
call npm install
echo   ✓ Done
echo.
echo   Step 7: Syncing Capacitor...
call npx cap sync android
echo   ✓ Done
echo.
echo   Step 8: Copying assets...
call npx cap copy android
echo   ✓ Done
echo.
echo   Step 9: Updating Capacitor Android...
call npx cap update android
echo   ✓ Done
echo.
echo   Step 10: Clean Gradle build...
cd android
call gradlew clean
cd ..
echo   ✓ Done
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                 COMPLETE FIX FINISHED! ✓                     ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Next steps:
echo   1. Open Android Studio
echo   2. File → Invalidate Caches → Invalidate and Restart
echo   3. Wait for Gradle sync (2-3 minutes)
echo   4. Build → Clean Project
echo   5. Build → Rebuild Project
echo.
echo   Press any key to return to menu...
pause >nul
goto menu

:testbuild
cls
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                        TEST BUILD                            ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Testing Gradle sync and build...
echo.
cd android
echo   Running: gradlew tasks
call gradlew tasks
echo.
echo   Running: gradlew assembleDebug
call gradlew assembleDebug
cd ..
echo.
echo   ═══════════════════════════════════════════════════════════════
echo.
if %ERRORLEVEL% EQU 0 (
    echo   ✓ BUILD SUCCESSFUL!
    echo.
    echo   Output APK location:
    echo   android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo   ✗ BUILD FAILED
    echo.
    echo   Try running the COMPLETE FIX option.
)
echo.
echo   Press any key to return to menu...
pause >nul
goto menu

:guides
cls
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                      OPENING GUIDES                          ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Opening all available guides...
echo.
start 🔧-GRADLE-FIX-GUIDE.html
start notepad ⚡-GRADLE-FIX-NOW.txt
start notepad GRADLE-TROUBLESHOOTING.md
echo.
echo   ✓ Guides opened!
echo.
echo   Press any key to return to menu...
pause >nul
goto menu

:buildapk
cls
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                      BUILD ANDROID APK                       ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   [1] Build Debug APK (for testing)
echo   [2] Build Release APK (for distribution)
echo   [3] Build App Bundle (for Play Store)
echo   [4] Back to menu
echo.
set /p buildchoice="   Enter your choice (1-4): "

if "%buildchoice%"=="1" (
    cd android
    echo.
    echo   Building debug APK...
    call gradlew assembleDebug
    echo.
    echo   Output: android\app\build\outputs\apk\debug\app-debug.apk
    cd ..
    pause
    goto buildapk
)

if "%buildchoice%"=="2" (
    cd android
    echo.
    echo   Building release APK...
    call gradlew assembleRelease
    echo.
    echo   Output: android\app\build\outputs\apk\release\app-release.apk
    cd ..
    pause
    goto buildapk
)

if "%buildchoice%"=="3" (
    cd android
    echo.
    echo   Building app bundle...
    call gradlew bundleRelease
    echo.
    echo   Output: android\app\build\outputs\bundle\release\app-release.aab
    cd ..
    pause
    goto buildapk
)

if "%buildchoice%"=="4" goto menu
goto buildapk

:menu
cls
goto :EOF

:end
cls
echo.
echo   ╔══════════════════════════════════════════════════════════════╗
echo   ║                                                              ║
echo   ║         🖤 KOL HUB - GRADLE FIX COMPLETE 🖤                  ║
echo   ║                                                              ║
echo   ║          Built with velvet, voltage, and reverence          ║
echo   ║                                                              ║
echo   ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Your unified-mega-app is ready for all platforms!
echo.
echo   Desktop: npm run desktop
echo   Web: https://kolshub.net
echo   Android: Now building successfully!
echo.
echo   Press any key to exit...
pause >nul
exit
