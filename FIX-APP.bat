@echo off
echo ===================================
echo   FIXING UNIFIED-MEGA-APP
echo ===================================
echo.

cd "C:\Users\Asus User\Desktop\unified-mega-app"

echo Step 1: Backing up old package.json...
copy package.json package.json.backup

echo Step 2: Installing corrected package.json...
copy "%~dp0package.json" package.json

echo Step 3: Cleaning node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .vite rmdir /s /q .vite

echo Step 4: Installing dependencies (this may take a minute)...
call npm install --legacy-peer-deps

echo.
echo ===================================
echo   INSTALLATION COMPLETE!
echo ===================================
echo.
echo Now starting the app...
echo.

call npm run dev

pause
