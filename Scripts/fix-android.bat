@echo off
echo ========================================
echo KOL Personal OS - Android Fix Script
echo ========================================
echo This script will fix common Android build issues
echo.

REM Step 1: Clean everything
echo [1/8] Cleaning all build artifacts...
if exist "android\.gradle" rmdir /s /q "android\.gradle"
if exist "android\app\build" rmdir /s /q "android\app\build"
if exist "android\build" rmdir /s /q "android\build"
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
echo ✓ Cleaned build artifacts

echo [2/8] Reinstalling Capacitor...
call npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/android@latest
if errorlevel 1 goto :error
echo ✓ Capacitor updated

echo [3/8] Rebuilding web assets...
call npm run build
if errorlevel 1 goto :error
echo ✓ Web assets built

echo [4/8] Removing old Android platform...
call npx cap remove android
echo ✓ Old platform removed

echo [5/8] Adding fresh Android platform...
call npx cap add android
if errorlevel 1 goto :error
echo ✓ Fresh Android platform added

echo [6/8] Copying assets...
call npx cap copy android
echo ✓ Assets copied

echo [7/8] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 goto :error
echo ✓ Capacitor synced

echo [8/8] Updating plugins...
call npx cap update android
echo ✓ Plugins updated

echo.
echo ========================================
echo Android platform has been completely rebuilt!
echo ========================================
echo.
echo Next steps:
echo 1. Run: Scripts\build-android.bat
echo 2. Or run: npx cap open android
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ERROR: Fix script encountered an error!
echo Check the error messages above.
echo ========================================
pause
exit /b 1
