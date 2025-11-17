@echo off
REM 🖤 KOL HUB - Complete Platform Testing Suite
REM =============================================
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║           🖤 KOL HUB - PLATFORM TESTING SUITE 🖤                 ║
echo ║       "One hand on the keyboard, one hand on the altar"          ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

echo This script will test your app across all platforms
echo.
pause

REM Test 1: Check if build exists
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  TEST 1: Checking Build Files
echo ═══════════════════════════════════════════════════════════════════
echo.

set build_ok=0

if exist "dist\index.html" (
    echo ✅ Web build found: dist\index.html
    set /a build_ok+=1
) else (
    echo ❌ Web build not found
    echo Run: npm run build
)

if exist "dist\assets" (
    echo ✅ Assets folder found: dist\assets
    set /a build_ok+=1
) else (
    echo ❌ Assets folder not found
)

if exist "electron.js" (
    echo ✅ Desktop config found: electron.js
    set /a build_ok+=1
) else (
    echo ❌ Desktop config not found
)

if exist "android\app" (
    echo ✅ Android project found: android\app
    set /a build_ok+=1
) else (
    echo ❌ Android project not found
    echo Run: npx cap add android
)

if exist "ios\App" (
    echo ✅ iOS project found: ios\App
    set /a build_ok+=1
) else (
    echo ⚠️  iOS project not found (macOS required)
)

echo.
echo Build check: %build_ok%/5 platforms ready

REM Test 2: Check dependencies
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  TEST 2: Checking Dependencies
echo ═══════════════════════════════════════════════════════════════════
echo.

if exist "node_modules" (
    echo ✅ Node modules installed
) else (
    echo ❌ Node modules not found
    echo Run: npm install
    pause
    exit /b 1
)

REM Test 3: Check configuration files
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  TEST 3: Checking Configuration
echo ═══════════════════════════════════════════════════════════════════
echo.

set config_ok=0

if exist ".env.production" (
    echo ✅ Production environment: .env.production
    set /a config_ok+=1
) else (
    echo ⚠️  .env.production not found (using defaults)
)

if exist "netlify.toml" (
    echo ✅ Netlify config: netlify.toml
    set /a config_ok+=1
) else (
    echo ❌ Netlify config missing
)

if exist "capacitor.config.ts" (
    echo ✅ Capacitor config: capacitor.config.ts
    set /a config_ok+=1
) else (
    echo ❌ Capacitor config missing
)

echo.
echo Config check: %config_ok%/3 files present

REM Test 4: Run web preview test
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  TEST 4: Web Preview Test
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Would you like to test the web version?
echo This will start a local server at http://localhost:4173
echo.
choice /c YN /n /m "Test web version? (Y/N): "

if %ERRORLEVEL% == 1 (
    echo.
    echo Starting web preview...
    echo Press Ctrl+C to stop when done testing
    timeout /t 3 >nul
    start http://localhost:4173
    call npm run preview
) else (
    echo Skipping web test
)

REM Test 5: Desktop test
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  TEST 5: Desktop Application Test
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Would you like to test the desktop version?
echo This will open the Electron app
echo.
choice /c YN /n /m "Test desktop version? (Y/N): "

if %ERRORLEVEL% == 1 (
    echo.
    echo Starting desktop app...
    call npm run desktop
) else (
    echo Skipping desktop test
)

REM Test 6: Mobile readiness
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  TEST 6: Mobile Platform Readiness
echo ═══════════════════════════════════════════════════════════════════
echo.

if exist "android\app\build.gradle" (
    echo ✅ Android ready to build
    echo   Open Android Studio: npm run mobile:android
) else (
    echo ❌ Android not configured
)

if exist "ios\App\App.xcodeproj" (
    echo ✅ iOS ready to build
    echo   Open Xcode: npm run mobile:ios
) else (
    echo ⚠️  iOS not configured (macOS required)
)

REM Test 7: Check for common issues
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  TEST 7: Common Issues Check
echo ═══════════════════════════════════════════════════════════════════
echo.

set issues=0

REM Check for large bundle sizes
if exist "dist\assets" (
    for /f %%A in ('dir /s /b "dist\assets\*.js" ^| find /c /v ""') do set js_count=%%A
    echo JavaScript files: %js_count%
    if %js_count% GTR 50 (
        echo ⚠️  High JS file count - may affect load time
        set /a issues+=1
    ) else (
        echo ✅ JS file count is good
    )
)

REM Check manifest
if exist "dist\manifest.json" (
    echo ✅ PWA manifest present
) else (
    echo ❌ PWA manifest missing
    set /a issues+=1
)

REM Check service worker
if exist "dist\service-worker.js" (
    echo ✅ Service worker present
) else (
    echo ❌ Service worker missing
    set /a issues+=1
)

echo.
if %issues% == 0 (
    echo ✅ No issues detected!
) else (
    echo ⚠️  %issues% potential issues found
)

REM Final Summary
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║                     TESTING COMPLETE                              ║
echo ║                                                                   ║
echo ╠═══════════════════════════════════════════════════════════════════╣
echo ║                                                                   ║
echo ║  Platform Readiness:                                             ║
echo ║    • Web (PWA): %build_ok%/5 checks passed                        ║
echo ║    • Configuration: %config_ok%/3 files present                   ║
echo ║    • Common Issues: %issues% found                                ║
echo ║                                                                   ║
echo ╠═══════════════════════════════════════════════════════════════════╣
echo ║                                                                   ║
echo ║  Next Steps:                                                     ║
echo ║                                                                   ║

if %build_ok% GEQ 4 (
    echo ║  ✅ Your app is ready for deployment!                            ║
    echo ║                                                                   ║
    echo ║  Deploy now:                                                     ║
    echo ║    npm run deploy:netlify:windows                                ║
) else (
    echo ║  ⚠️  Some platforms need attention                               ║
    echo ║                                                                   ║
    echo ║  Build everything:                                               ║
    echo ║    BUILD-ALL-PLATFORMS.bat                                       ║
)

echo ║                                                                   ║
echo ║  For mobile apps:                                                ║
echo ║    • Android: npm run mobile:android                             ║
echo ║    • iOS: npm run mobile:ios                                     ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

pause
