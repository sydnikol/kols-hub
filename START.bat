@echo off
echo ╔═══════════════════════════════════════════╗
echo ║   🚀 UNIFIED MEGA APP - EASY START 🚀    ║
echo ╔═══════════════════════════════════════════╗
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 First time setup - Installing dependencies...
    echo This will take 2-3 minutes...
    echo.
    call npm install
    echo.
    echo ✅ Dependencies installed!
    echo.
)

echo 🌟 Starting your Unified Mega App...
echo.
echo 📍 Access Points:
echo   • Desktop: Will open automatically
echo   • Website: http://localhost:5173
echo   • Mobile: http://YOUR-IP:5173
echo.
echo 💡 Tip: Find your IP with 'ipconfig' command
echo.
echo ⚠️  Keep this window open while using the app
echo ═════════════════════════════════════════════
echo.

REM Start the app
npm start

pause
