@echo off
title KOL HUB - Starting Frontend + Backend
color 0A

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║     KOL HUB - COMPLETE STARTUP SCRIPT         ║
echo ║  Starting Backend + Frontend for Real Money   ║
echo ╚═══════════════════════════════════════════════╝
echo.

:: Check if backend folder exists
if not exist "backend" (
    echo ERROR: Backend folder not found!
    echo Run SETUP-BACKEND.bat first.
    pause
    exit /b 1
)

:: Check if backend .env exists
if not exist "backend\.env" (
    echo ERROR: Backend .env not configured!
    echo.
    echo SETUP REQUIRED:
    echo 1. Run SETUP-BACKEND.bat
    echo 2. Edit backend\.env with your Stripe keys
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Stripe Backend Server...
start "KOL HUB - Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend App...
start "KOL HUB - Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak > nul

echo [3/3] Opening in browser...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║            🚀 ALL SYSTEMS RUNNING! 🚀        ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Navigate to: Financial ^& Income ^> $1,500/Day Action Plan
echo.
echo Press any key to stop all servers...
pause > nul

echo Stopping servers...
taskkill /FI "WINDOWTITLE eq KOL HUB - Backend*" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq KOL HUB - Frontend*" /F > nul 2>&1

echo.
echo All servers stopped. Goodbye!
timeout /t 2 /nobreak > nul
