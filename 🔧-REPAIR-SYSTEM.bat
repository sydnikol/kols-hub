@echo off
echo.
echo ========================================
echo   🖤 KOL HUB - COMPLETE SYSTEM REPAIR
echo   Fixing dependencies and cache issues
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Cleaning NPM cache...
call npm cache clean --force

echo.
echo [2/5] Removing package-lock.json...
if exist package-lock.json del /f package-lock.json

echo.
echo [3/5] Removing node_modules (this may take a minute)...
if exist node_modules rmdir /s /q node_modules 2>nul

echo.
echo [4/5] Fresh install of all dependencies...
call npm install

echo.
echo [5/5] Verification...
if errorlevel 1 (
    echo [X] Installation failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ SYSTEM REPAIR COMPLETE
echo   Ready to launch KOL Personal OS
echo ========================================
echo.
echo Run 🖤-START-KOL.bat to launch the app
echo.
pause
