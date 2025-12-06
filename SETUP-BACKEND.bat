@echo off
echo.
echo ========================================
echo   KOL HUB - STRIPE BACKEND SETUP
echo ========================================
echo.

cd backend

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env file - YOU MUST ADD YOUR STRIPE KEYS!
) else (
    echo .env file already exists
)

echo.
echo [3/4] Testing server...
start /B cmd /c "npm start"
timeout /t 3 /nobreak > nul
curl http://localhost:3001/api/health
taskkill /F /FI "WINDOWTITLE eq C:\Windows\system32\cmd.exe - npm  start" > nul 2>&1

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo 1. Open backend\.env and add your Stripe keys from:
echo    https://dashboard.stripe.com/apikeys
echo.
echo 2. Start the backend:
echo    cd backend
echo    npm start
echo.
echo 3. Keep it running while using your app!
echo.
echo ========================================
echo.
pause
