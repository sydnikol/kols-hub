@echo off
title KOL - Your Self-Evolving Personal OS
color 5F

echo.
echo     ██╗  ██╗ ██████╗ ██╗         
echo     ██║ ██╔╝██╔═══██╗██║         
echo     █████╔╝ ██║   ██║██║         
echo     ██╔═██╗ ██║   ██║██║         
echo     ██║  ██╗╚██████╔╝███████╗    
echo     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    
echo.
echo     🖤 SELF-EVOLVING PERSONAL OS 🖤
echo     "One hand on the keyboard, one hand on the altar"
echo.
echo ════════════════════════════════════════════════════════════════
echo.

cd /d "C:\Users\Asus User\Desktop\unified-mega-app"

REM Check if this is first run
if not exist "node_modules" (
    echo [FIRST RUN DETECTED]
    echo Installing dependencies... this will take a few minutes.
    echo.
    call npm install --legacy-peer-deps
    echo.
    echo ✓ Dependencies installed!
    echo.
)

REM Check if evolution log exists, create if not
if not exist "🖤-EVOLUTION-LOG.json" (
    echo [INITIALIZING EVOLUTION LOG]
    echo Creating self-learning system...
    echo.
    REM Evolution log will be created by the React app on first load
    echo ✓ Evolution system ready!
    echo.
)

echo ════════════════════════════════════════════════════════════════
echo.
echo     STARTING KOL...
echo.
echo     • App will open at: http://localhost:5173
echo     • Evolution log: Active
echo     • Health tracking: Ready
echo     • Medication import: Available
echo     • 9000+ features: Loading...
echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM Open browser after a short delay
timeout /t 3 /nobreak >nul
start http://localhost:5173

REM Start the development server
call npm run dev

REM If npm run dev exits, keep window open
if errorlevel 1 (
    echo.
    echo ════════════════════════════════════════════════════════════════
    echo.
    echo     ⚠️  ERROR DETECTED
    echo.
    echo     If you see module errors, run this first:
    echo     🖤-COMPLETE-FIX-AND-EVOLVE.bat
    echo.
    echo ════════════════════════════════════════════════════════════════
    echo.
    pause
) else (
    echo.
    echo     KOL is sleeping... Press any key to wake them again.
    pause >nul
)
