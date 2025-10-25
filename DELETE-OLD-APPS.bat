@echo off
title Delete Old Apps - Keep Unified Mega App Only
color 0E

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║         🧹 CLEANUP - DELETE OLD APPS (Keep New One) 🧹         ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo This will DELETE the following OLD apps from your Desktop:
echo.
echo   • KOL-HUB-INTEGRATED folder (old)
echo   • advanced-stylist.html (old standalone file)
echo   • ai-assistant.html (old standalone file)
echo   • ecosystem-hub folder in Sandbox (if exists)
echo   • Any other old HTML app files
echo.
echo ✅ WILL KEEP:
echo   • unified-mega-app folder (THIS IS YOUR NEW APP!)
echo   • Sandbox folder (but remove old projects inside)
echo.
echo ⚠️  WARNING: This CANNOT be undone!
echo.
echo Do you want to proceed? (Y/N)
set /p confirm=

if /i not "%confirm%"=="Y" (
    echo.
    echo ❌ Cancelled. No files were deleted.
    pause
    exit /b 0
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo 🧹 Starting cleanup...
echo ═══════════════════════════════════════════════════════════════════
echo.

REM Change to Desktop
cd /d "%USERPROFILE%\Desktop"

REM Delete old KOL-HUB-INTEGRATED if exists
if exist "KOL-HUB-INTEGRATED" (
    echo Deleting: KOL-HUB-INTEGRATED...
    rmdir /s /q "KOL-HUB-INTEGRATED" 2>nul
    if errorlevel 1 (
        echo ⚠️  Could not delete KOL-HUB-INTEGRATED (may be in use)
    ) else (
        echo ✅ Deleted: KOL-HUB-INTEGRATED
    )
) else (
    echo ℹ️  KOL-HUB-INTEGRATED not found (already gone)
)

REM Delete old HTML files
if exist "advanced-stylist.html" (
    echo Deleting: advanced-stylist.html...
    del /f "advanced-stylist.html" 2>nul
    echo ✅ Deleted: advanced-stylist.html
) else (
    echo ℹ️  advanced-stylist.html not found
)

if exist "ai-assistant.html" (
    echo Deleting: ai-assistant.html...
    del /f "ai-assistant.html" 2>nul
    echo ✅ Deleted: ai-assistant.html
) else (
    echo ℹ️  ai-assistant.html not found
)

REM Delete any other obvious old app HTML files
for %%f in (desktop-web-app*.html app*.html mega-app*.html) do (
    if exist "%%f" (
        echo Deleting: %%f...
        del /f "%%f" 2>nul
        echo ✅ Deleted: %%f
    )
)

REM Clean up Sandbox if it exists
if exist "Sandbox\projects\ecosystem-hub" (
    echo Deleting: Sandbox\projects\ecosystem-hub...
    rmdir /s /q "Sandbox\projects\ecosystem-hub" 2>nul
    if errorlevel 1 (
        echo ⚠️  Could not delete Sandbox\projects\ecosystem-hub
    ) else (
        echo ✅ Deleted: Sandbox\projects\ecosystem-hub
    )
) else (
    echo ℹ️  Sandbox\projects\ecosystem-hub not found
)

if exist "Sandbox\projects\desktop-web-app" (
    echo Deleting: Sandbox\projects\desktop-web-app...
    rmdir /s /q "Sandbox\projects\desktop-web-app" 2>nul
    if errorlevel 1 (
        echo ⚠️  Could not delete Sandbox\projects\desktop-web-app
    ) else (
        echo ✅ Deleted: Sandbox\projects\desktop-web-app
    )
) else (
    echo ℹ️  Sandbox\projects\desktop-web-app not found
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo ✅ CLEANUP COMPLETE!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo ✅ OLD apps have been removed
echo ✅ unified-mega-app folder is SAFE (not touched)
echo ✅ Your new unified app is ready to use!
echo.
echo 📁 What's left on your Desktop:
echo    • unified-mega-app folder (YOUR NEW APP!)
echo    • All your other files and folders
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo 🚀 NEXT STEP:
echo    Go to unified-mega-app folder
echo    Double-click: INSTALL-EVERYTHING.bat
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

pause
