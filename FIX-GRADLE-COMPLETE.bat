@echo off
echo ========================================
echo    KOL HUB - GRADLE COMPLETE FIX
echo ========================================
echo.

echo [1/8] Stopping Gradle daemons...
cd android
call gradlew --stop
cd ..
echo Done.
echo.

echo [2/8] Cleaning Gradle cache...
rmdir /S /Q "%USERPROFILE%\.gradle\caches" 2>nul
echo Done.
echo.

echo [3/8] Cleaning Android build directories...
rmdir /S /Q android\build 2>nul
rmdir /S /Q android\app\build 2>nul
rmdir /S /Q android\.gradle 2>nul
echo Done.
echo.

echo [4/8] Cleaning node_modules and reinstalling...
rmdir /S /Q node_modules 2>nul
rmdir /S /Q package-lock.json 2>nul
call npm install
echo Done.
echo.

echo [5/8] Syncing Capacitor...
call npx cap sync android
echo Done.
echo.

echo [6/8] Copying Capacitor assets...
call npx cap copy android
echo Done.
echo.

echo [7/8] Updating Capacitor Android...
call npx cap update android
echo Done.
echo.

echo [8/8] Opening Android Studio with clean project...
cd android
call gradlew clean
cd ..
echo Done.
echo.

echo ========================================
echo    GRADLE FIX COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Close Android Studio completely
echo 2. Kill all Java processes in Task Manager
echo 3. Reopen Android Studio
echo 4. Let it sync automatically
echo.
pause
