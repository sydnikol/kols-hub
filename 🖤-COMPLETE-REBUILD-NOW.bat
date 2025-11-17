@echo off
echo.
echo ========================================
echo    KOL HUB - COMPLETE REBUILD
echo    Gothic Futurism Edition
echo ========================================
echo.
echo This will completely rebuild your app with all dependencies.
echo Please be patient, this may take 5-10 minutes.
echo.
pause

cd /d "%~dp0"

echo.
echo [1/6] Cleaning npm cache...
call npm cache clean --force

echo.
echo [2/6] Removing old lock file...
if exist package-lock.json (
    del /f /q package-lock.json
    echo     ✓ Removed package-lock.json
)

echo.
echo [3/6] Removing node_modules (this takes a while)...
echo     Please wait...
if exist node_modules (
    rd /s /q node_modules
    echo     ✓ Removed node_modules
)

echo.
echo [4/6] Installing ALL dependencies fresh...
echo     This will take 3-5 minutes...
call npm install

echo.
echo [5/6] Verifying vite installation...
if exist "node_modules\vite\package.json" (
    echo     ✓ Vite installed successfully
) else (
    echo     ⚠ Vite not found, installing separately...
    call npm install vite --save-dev
)

echo.
echo [6/6] Build verification...
call npm run build

echo.
echo ========================================
echo    ✅ REBUILD COMPLETE!
echo ========================================
echo.
echo To start the app, run: 🖤-START-KOL.bat
echo.
pause
