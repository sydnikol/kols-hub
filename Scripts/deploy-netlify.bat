@echo off
REM ═══════════════════════════════════════════════════════════════
REM KOL PERSONAL OS - NETLIFY DEPLOYMENT SCRIPT (Windows)
REM ═══════════════════════════════════════════════════════════════

echo 🚀 Building KOL Personal OS...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo.
    echo 📦 Deploying to Netlify...
    call netlify deploy --prod --dir=dist --no-build
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 Deployment successful!
        echo 🌐 Production URL: https://kol-personal-os.netlify.app
    ) else (
        echo ❌ Deployment failed
        exit /b 1
    )
) else (
    echo ❌ Build failed
    exit /b 1
)
