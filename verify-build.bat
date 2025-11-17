@echo off
REM 🖤 KOL HUB - Verify All Platform Builds (Windows)
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║       🖤 KOL HUB - PLATFORM BUILD VERIFICATION 🖤             ║
echo ║    "One hand on the keyboard, one hand on the altar"          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set total_checks=0
set passed_checks=0

echo === Checking Core Files ===
call :check_file "package.json"
call :check_file "vite.config.ts"
call :check_file "tsconfig.json"
call :check_file "tailwind.config.js"
call :check_file "index.html"
call :check_file "src\main.tsx"
call :check_file "src\App.tsx"

echo.
echo === Checking Build Directories ===
call :check_dir "src"
call :check_dir "src\components"
call :check_dir "src\services"
call :check_dir "src\store"
call :check_dir "src\utils"
call :check_dir "public"

echo.
echo === Checking Desktop Configuration ===
call :check_file "electron.js"

echo.
echo === Checking Mobile Configuration ===
call :check_file "capacitor.config.ts"
call :check_file "capacitor.config.json"
call :check_dir "android"
call :check_dir "ios"

echo.
echo === Checking Deployment Configuration ===
call :check_file "netlify.toml"
call :check_file ".env.production"

echo.
echo === Checking Dependencies ===
call :check_dir "node_modules"
call :check_file "package-lock.json"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    VERIFICATION RESULTS                        ║
echo ╠════════════════════════════════════════════════════════════════╣
set /a percentage=(%passed_checks% * 100) / %total_checks%
echo ║  Checks Passed: %passed_checks% / %total_checks% (%percentage%%%)
echo ╠════════════════════════════════════════════════════════════════╣

if %percentage% == 100 (
    echo ║  Status: ✅ ALL SYSTEMS GO!
    echo ║  Ready to build and deploy across all platforms!
) else if %percentage% GEQ 80 (
    echo ║  Status: ⚠️  MOSTLY READY
    echo ║  Some components missing, but core functionality intact
) else (
    echo ║  Status: ❌ NEEDS ATTENTION
    echo ║  Critical components missing, check above for details
)

echo ╚════════════════════════════════════════════════════════════════╝
echo.

if %percentage% == 100 (
    echo 🚀 NEXT STEPS:
    echo   1. Run: npm run build          (Web build^)
    echo   2. Run: npm run build:desktop  (Desktop build^)
    echo   3. Run: npx cap sync android   (Android sync^)
    echo   4. Run: npx cap sync ios       (iOS sync^)
    echo   5. Deploy: npm run deploy:netlify:windows
) else if %percentage% GEQ 80 (
    echo ⚠️  RECOMMENDED ACTIONS:
    echo   1. Review missing files above
    echo   2. Run: npm install
    echo   3. Re-run this verification
) else (
    echo ❌ REQUIRED ACTIONS:
    echo   1. Install dependencies: npm install
    echo   2. Check project structure
    echo   3. Re-run verification
)

echo.
pause
exit /b 0

:check_file
set /a total_checks+=1
if exist "%~1" (
    echo ✅ Found: %~1
    set /a passed_checks+=1
) else (
    echo ❌ Missing: %~1
)
exit /b 0

:check_dir
set /a total_checks+=1
if exist "%~1" (
    echo ✅ Found: %~1
    set /a passed_checks+=1
) else (
    echo ❌ Missing: %~1
)
exit /b 0
