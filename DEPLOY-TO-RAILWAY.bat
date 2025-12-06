@echo off
echo.
echo ╔═══════════════════════════════════════════════╗
echo ║   DEPLOY STRIPE BACKEND TO RAILWAY (FREE!)   ║
echo ╚═══════════════════════════════════════════════╝
echo.

:: Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Railway CLI not installed. Installing now...
    npm install -g @railway/cli
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Failed to install Railway CLI
        echo.
        echo Please install manually:
        echo npm install -g @railway/cli
        echo.
        pause
        exit /b 1
    )
)

echo [1/5] Railway CLI detected!
echo.

:: Check if user is logged in
railway whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [2/5] Please log in to Railway...
    echo.
    echo This will open your browser. Sign up for FREE at:
    echo https://railway.app
    echo.
    pause
    railway login
) else (
    echo [2/5] Already logged in to Railway!
)

echo.
echo [3/5] Initializing Railway project...
cd backend
railway init

echo.
echo [4/5] Setting environment variables...
echo.
echo Please enter your Stripe Secret Key (from https://dashboard.stripe.com/apikeys):
set /p STRIPE_KEY="Stripe Secret Key: "
railway variables set STRIPE_SECRET_KEY=%STRIPE_KEY%

echo.
echo Enter your frontend URL (e.g., https://kolshub.netlify.app):
set /p FRONTEND="Frontend URL: "
railway variables set FRONTEND_URL=%FRONTEND%
railway variables set NODE_ENV=production

echo.
echo [5/5] Deploying to Railway...
railway up

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║           🎉 DEPLOYMENT COMPLETE! 🎉          ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo Your backend is now live on Railway!
echo.
echo NEXT STEPS:
echo 1. Get your Railway URL from the dashboard
echo 2. Update your frontend .env:
echo    VITE_API_URL=https://your-app.railway.app/api
echo 3. Set up Stripe webhook at:
echo    https://dashboard.stripe.com/webhooks
echo    Endpoint: https://your-app.railway.app/api/webhook
echo.
railway open
echo.
pause
