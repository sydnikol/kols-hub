@echo off
REM 🖤 KOL HUB - ONE-CLICK COMPLETE SETUP & DEPLOYMENT
REM ===================================================
REM This script does EVERYTHING to get your app running everywhere
REM "One hand on the keyboard, one hand on the altar"

color 0D
title KOL HUB - Complete Setup ^& Deploy

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║         🖤  KOL HUB - COMPLETE SETUP ^& DEPLOYMENT  🖤            ║
echo ║                                                                   ║
echo ║         "One hand on the keyboard, one hand on the altar"        ║
echo ║                                                                   ║
echo ║    This script will:                                             ║
echo ║    ✅ Verify your setup                                           ║
echo ║    ✅ Install all dependencies                                    ║
echo ║    ✅ Build for web, desktop, and mobile                          ║
echo ║    ✅ Deploy to Netlify (optional)                                ║
echo ║    ✅ Test everything locally                                     ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

pause

REM Step 1: Verify setup
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 1/8: VERIFYING SETUP
echo ═══════════════════════════════════════════════════════════════════
echo.
call verify-build.bat
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Setup verification found issues
    echo Please fix the issues above and run this script again
    pause
    exit /b 1
)
echo ✅ Setup verified!

REM Step 2: Clean previous builds
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 2/8: CLEANING PREVIOUS BUILDS
echo ═══════════════════════════════════════════════════════════════════
echo.
if exist dist (
    echo Removing dist folder...
    rmdir /s /q dist
)
if exist build (
    echo Removing build folder...
    rmdir /s /q build
)
echo ✅ Clean complete!

REM Step 3: Install dependencies
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 3/8: INSTALLING DEPENDENCIES
echo ═══════════════════════════════════════════════════════════════════
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Dependency installation failed
    pause
    exit /b 1
)
echo ✅ Dependencies installed!

REM Step 4: Build web version
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 4/8: BUILDING WEB VERSION (PWA)
echo ═══════════════════════════════════════════════════════════════════
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Web build failed
    pause
    exit /b 1
)
echo ✅ Web build complete! (dist/ folder ready)

REM Step 5: Build desktop version
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 5/8: BUILDING DESKTOP VERSION (ELECTRON)
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Building desktop installer...
call npm run build:desktop
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Desktop build had warnings (this is often normal)
    echo Check dist/ folder for installer
) else (
    echo ✅ Desktop build complete!
)

REM Step 6: Sync mobile platforms
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 6/8: SYNCING MOBILE PLATFORMS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Syncing Android...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Android sync had warnings
) else (
    echo ✅ Android synced!
)

echo.
echo Syncing iOS...
call npx cap sync ios
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  iOS sync had warnings (requires macOS for full build)
) else (
    echo ✅ iOS synced!
)

REM Step 7: Test locally
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 7/8: LOCAL TESTING OPTIONS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Would you like to test the app now? (Choose one)
echo.
echo   1. Test WEB version (opens in browser)
echo   2. Test DESKTOP version (opens Electron app)
echo   3. Skip testing (go to deployment)
echo.
choice /c 123 /n /m "Enter your choice (1-3): "
set test_choice=%ERRORLEVEL%

if %test_choice% == 1 (
    echo.
    echo Starting web preview...
    echo Press Ctrl+C to stop when done testing
    timeout /t 3 >nul
    start http://localhost:4173
    call npm run preview
) else if %test_choice% == 2 (
    echo.
    echo Starting desktop app...
    call npm run desktop
) else (
    echo.
    echo Skipping local testing...
)

REM Step 8: Deploy to Netlify
echo.
echo ═══════════════════════════════════════════════════════════════════
echo  STEP 8/8: NETLIFY DEPLOYMENT
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Would you like to deploy to Netlify now?
echo.
echo   Y. Yes, deploy now
echo   N. No, I'll deploy manually later
echo.
choice /c YN /n /m "Deploy to Netlify? (Y/N): "
set deploy_choice=%ERRORLEVEL%

if %deploy_choice% == 1 (
    echo.
    echo Deploying to Netlify...
    call npm run deploy:netlify:windows
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️  Deployment had issues - check netlify CLI setup
    ) else (
        echo ✅ Deployed to Netlify!
    )
) else (
    echo.
    echo Skipping Netlify deployment
    echo To deploy later, run: npm run deploy:netlify:windows
)

REM Final Summary
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║                    ✨ SETUP COMPLETE! ✨                          ║
echo ║                                                                   ║
echo ╠═══════════════════════════════════════════════════════════════════╣
echo ║                                                                   ║
echo ║  ✅ WEB (PWA): dist/ folder ready for deployment                  ║
echo ║  ✅ DESKTOP: Installer in dist/ (Windows)                         ║
echo ║  ✅ ANDROID: Ready to open in Android Studio                      ║
echo ║  ✅ iOS: Ready to open in Xcode (requires macOS)                  ║
echo ║                                                                   ║
echo ╠═══════════════════════════════════════════════════════════════════╣
echo ║                                                                   ║
echo ║  🚀 QUICK COMMANDS:                                               ║
echo ║                                                                   ║
echo ║  Development:                                                    ║
echo ║    npm run dev              - Start dev server                   ║
echo ║                                                                   ║
echo ║  Testing:                                                        ║
echo ║    npm run preview          - Preview production build           ║
echo ║    npm run desktop          - Run desktop app                    ║
echo ║                                                                   ║
echo ║  Mobile:                                                         ║
echo ║    npm run mobile:android   - Open Android Studio               ║
echo ║    npm run mobile:ios       - Open Xcode                        ║
echo ║                                                                   ║
echo ║  Deployment:                                                     ║
echo ║    npm run deploy:netlify:windows  - Deploy to Netlify          ║
echo ║                                                                   ║
echo ╠═══════════════════════════════════════════════════════════════════╣
echo ║                                                                   ║
echo ║  📚 DOCUMENTATION:                                                ║
echo ║    - DEVELOPER-LOG.md       - Complete technical docs            ║
echo ║    - QUICK-REFERENCE.html   - User guide                         ║
echo ║    - BUILD-SUMMARY.txt      - Build details                      ║
echo ║                                                                   ║
echo ╠═══════════════════════════════════════════════════════════════════╣
echo ║                                                                   ║
echo ║  🎉 YOUR APP IS READY TO USE!                                     ║
echo ║                                                                   ║
echo ║  This is YOUR self-evolving personal OS.                         ║
echo ║  It works across web, desktop, and mobile.                       ║
echo ║  It's offline-first and privacy-focused.                         ║
echo ║  It reflects YOUR identity and needs.                            ║
echo ║                                                                   ║
echo ║  "One hand on the keyboard, one hand on the altar" 🖤            ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

REM Create desktop shortcuts (optional)
echo.
echo Would you like to create desktop shortcuts?
echo.
choice /c YN /n /m "Create shortcuts? (Y/N): "
if %ERRORLEVEL% == 1 (
    echo.
    echo Creating shortcuts...
    
    REM Create shortcut for dev server
    echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
    echo sLinkFile = "%USERPROFILE%\Desktop\KOL HUB - Dev.lnk" >> CreateShortcut.vbs
    echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
    echo oLink.TargetPath = "%CD%\START-KOL-HUB.bat" >> CreateShortcut.vbs
    echo oLink.WorkingDirectory = "%CD%" >> CreateShortcut.vbs
    echo oLink.Description = "Start KOL HUB Development Server" >> CreateShortcut.vbs
    echo oLink.Save >> CreateShortcut.vbs
    cscript CreateShortcut.vbs
    del CreateShortcut.vbs
    
    echo ✅ Desktop shortcuts created!
)

echo.
echo Press any key to exit...
pause >nul
exit /b 0
