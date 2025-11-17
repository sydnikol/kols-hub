@echo off
echo ========================================
echo 🔧 Fix Android Studio Gradle Issues
echo ========================================
echo.

cd /d "C:\Users\Asus User\Desktop\unified-mega-app"

echo [1/3] Building latest web version...
call npm run build
echo.

echo [2/3] Syncing Capacitor with Android...
call npx cap sync android
echo.

echo [3/3] Opening Android Studio...
echo.
echo ✅ IMPORTANT: In Android Studio, do this:
echo    1. Wait for Gradle sync to complete
echo    2. Click "Sync Project with Gradle Files" (toolbar icon)
echo    3. If errors persist: File ^> Invalidate Caches ^> Invalidate and Restart
echo.

call npx cap open android

echo.
echo ✅ Android Studio should now open
echo ✅ Wait for Gradle sync to complete in Android Studio
echo.
pause
