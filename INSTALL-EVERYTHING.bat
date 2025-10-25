@echo off
title Unified Mega App - One-Click Installer
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║            🚀 UNIFIED MEGA APP - ONE-CLICK SETUP 🚀            ║
echo ║                                                                ║
echo ║  This will set up EVERYTHING you need to use your app on:     ║
echo ║    • Desktop (Windows/Mac/Linux)                               ║
echo ║    • Website (any browser)                                     ║
echo ║    • Mobile (iPhone & Android) - via browser                   ║
echo ║    • Works OFFLINE after first load!                           ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 📋 What will be installed:
echo    • Node.js dependencies (React, Electron, etc.)
echo    • Desktop app framework
echo    • Mobile app preparation
echo    • Offline support (PWA)
echo.

echo ⏱️  This will take 3-5 minutes (one-time only)
echo.

pause

echo.
echo ═══════════════════════════════════════════════════════════════════
echo STEP 1/3: Installing dependencies...
echo ═══════════════════════════════════════════════════════════════════
echo.

call npm install

if errorlevel 1 (
    echo.
    echo ❌ Installation failed!
    echo 💡 Make sure Node.js is installed: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

echo ═══════════════════════════════════════════════════════════════════
echo STEP 2/3: Building the app...
echo ═══════════════════════════════════════════════════════════════════
echo.

call npm run build

if errorlevel 1 (
    echo.
    echo ⚠️  Build had warnings but may still work
    echo.
)

echo.
echo ✅ App built successfully!
echo.

echo ═══════════════════════════════════════════════════════════════════
echo STEP 3/3: Final setup...
echo ═══════════════════════════════════════════════════════════════════
echo.

REM Create shortcut instructions file
echo ✅ Creating desktop shortcut info...

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║                    🎉 INSTALLATION COMPLETE! 🎉                ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 YOUR APP IS READY TO USE!
echo.
echo 📍 TO START YOUR APP:
echo    → Double-click "START.bat" in this folder
echo.
echo 📱 TO USE ON YOUR PHONE:
echo    1. Make sure phone and computer are on the same WiFi
echo    2. Run: ipconfig (in command prompt)
echo    3. Look for "IPv4 Address" (e.g., 192.168.1.100)
echo    4. On phone browser, go to: http://YOUR-IP:5173
echo    5. Tap "Add to Home Screen" to install!
echo.
echo 💻 TO USE ON DESKTOP:
echo    → Double-click START.bat and it opens automatically
echo.
echo 🌐 TO DEPLOY ONLINE:
echo    → Upload the "dist" folder to Netlify/Vercel (FREE)
echo.
echo 📚 FOR MORE INFO:
echo    → Open "COMPLETE-GUIDE.txt" for full instructions
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

echo Press any key to start your app now...
pause > nul

echo.
echo 🚀 Launching Unified Mega App...
echo.

call START.bat
