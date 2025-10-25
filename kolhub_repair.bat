@echo off
title KolHub OS v3 Repair Utility
echo ==========================================
echo   KolHub OS v3.0.0 — Gothic Dark Release
echo   Automated Repair Script (Windows)
echo ==========================================
echo.

REM --- Step 1: Clean old dependencies ---
echo [1/5] Cleaning node_modules and cache...
rmdir /s /q node_modules
del /f /q package-lock.json
npm cache clean --force

REM --- Step 2: Reinstall required packages ---
echo [2/5] Reinstalling dependencies...
npm install

REM --- Step 3: Fix Capacitor versions ---
echo [3/5] Fixing Capacitor peer dependency conflicts...
npm uninstall @capacitor/core @capacitor/app @capacitor/android @capacitor/ios @capacitor/splash-screen
npm install @capacitor/core@5.7.8 @capacitor/app@5.0.8 @capacitor/android@5.7.8 @capacitor/ios@5.7.8 @capacitor/splash-screen@5.0.8

REM --- Step 4: Reinstall missing core libs ---
echo [4/5] Installing core dependencies...
npm install express cors dotenv sqlite3 react-router-dom@6

REM --- Step 5: Rebuild project ---
echo [5/5] Rebuilding project...
npm run build

echo.
echo ==========================================
echo ✅ KolHub repair completed successfully!
echo ==========================================
echo You can now run: npm run dev  or  npm run desktop
pause
