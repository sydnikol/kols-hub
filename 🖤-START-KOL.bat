@echo off
echo.
echo ═══════════════════════════════════════════════════════════════════════
echo 🖤 KOL AI COMPANION v1.0 + myUHealth Portal Setup 🏥✨
echo ═══════════════════════════════════════════════════════════════════════
echo.
echo Installing Excel support (xlsx library)...
echo.

call npm install xlsx

echo.
echo ✅ Setup complete!
echo.
echo Starting your app now...
echo.
timeout /t 2

call npm start

pause