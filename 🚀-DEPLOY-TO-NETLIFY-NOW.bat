@echo off
color 0D
title 🖤 KOL HUB - DEPLOY TO NETLIFY NOW

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║              🖤  KOL HUB - DEPLOY TO NETLIFY  🖤                  ║
echo ║                                                                   ║
echo ║         "One hand on the keyboard, one hand on the altar"        ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo.
echo This script will:
echo   1. Build your web app for production
echo   2. Deploy to Netlify
echo   3. Give you the live URL
echo.
echo Your app will be LIVE on the internet in about 2 minutes!
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause

echo.
echo [1/3] 🏗️  Building production version...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Build failed! Check errors above.
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Build complete!

echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo [2/3] 🚀 Deploying to Netlify...
echo.
echo Make sure you have:
echo   • Netlify CLI installed (npm install -g netlify-cli)
echo   • Logged in to Netlify (netlify login)
echo.
echo If not, the script will help you set up.
echo.
pause

REM Check if netlify CLI exists
where netlify >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Netlify CLI not found! Installing now...
    call npm install -g netlify-cli
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Netlify CLI
        pause
        exit /b 1
    )
    echo ✅ Netlify CLI installed!
)

echo.
echo Checking Netlify login...
netlify status
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 🔑 Please log in to Netlify...
    netlify login
)

echo.
echo Deploying to Netlify...
echo (This may take a minute or two)
echo.
netlify deploy --prod --dir=dist

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Deployment failed! 
    echo.
    echo Common fixes:
    echo   1. Make sure you're logged in: netlify login
    echo   2. Link to a site: netlify link
    echo   3. Check your internet connection
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Deployed to Netlify!

echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo [3/3] 🎉 DEPLOYMENT COMPLETE!
echo.
netlify status
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║                    ✨ YOU'RE LIVE! ✨                            ║
echo ║                                                                   ║
echo ║  Your KOL Hub is now live on the internet!                       ║
echo ║                                                                   ║
echo ║  📱 Access from any device                                        ║
echo ║  🌐 Works offline after first visit                               ║
echo ║  🔒 Secure HTTPS connection                                       ║
echo ║  ⚡ Auto-updates on every push to GitHub                         ║
echo ║                                                                   ║
echo ║  Check the URL above ^^ and bookmark it!                         ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo Would you like to open your live site in a browser?
echo.
choice /c YN /n /m "Open site? (Y/N): "
if %ERRORLEVEL% == 1 (
    echo.
    echo Opening your site...
    netlify open:site
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 💜 NEXT STEPS:
echo.
echo   • Test your live site on different devices
echo   • Set up a custom domain (netlify.toml has settings)
echo   • Enable Netlify analytics (optional)
echo   • Share the URL with anyone you want to give access
echo.
echo   Every time you push to GitHub, Netlify will auto-deploy!
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 🖤 "One hand on the keyboard, one hand on the altar"
echo.
echo You did it, Kol! Your personal OS is LIVE. 🚀
echo.
pause
