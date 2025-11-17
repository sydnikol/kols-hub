@echo off
echo.
echo ===================================================
echo KOL UNIFIED MEGA APP - DESKTOP FIX
echo ===================================================
echo.

:: Navigate to project directory
cd /d "C:\Users\Asus User\Desktop\unified-mega-app"

echo [1/6] Cleaning npm cache...
npm cache clean --force

echo.
echo [2/6] Installing missing Electron dependencies...
npm install --save-dev electron@^28.1.1 electron-builder@^24.9.1

echo.
echo [3/6] Installing all project dependencies...
npm install

echo.
echo [4/6] Building the web app...
call npm run build

echo.
echo [5/6] Testing Electron launch...
echo.
echo Starting desktop app... (Press Ctrl+C to stop when verified)
timeout /t 3 >nul

:: Start the desktop app
start cmd /k npm run desktop

echo.
echo [6/6] Desktop app should be launching now!
echo.
echo ===================================================
echo VERIFICATION STEPS:
echo.
echo 1. The desktop app window should open
echo 2. All features should work offline
echo 3. Check developer tools with F12 for any errors
echo.
echo If the app doesn't start, run: npm run desktop
echo For production build: npm run build:desktop
echo.
echo ===================================================
echo DESKTOP APP FIX COMPLETE!
echo ===================================================
echo.
pause
