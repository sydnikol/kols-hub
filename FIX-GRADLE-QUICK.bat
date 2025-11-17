@echo off
echo ========================================
echo    KOL HUB - QUICK GRADLE FIX
echo ========================================
echo.

echo Killing all Java/Gradle processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM javaw.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done.
echo.

echo Deleting Gradle cache...
rmdir /S /Q "%USERPROFILE%\.gradle\caches" 2>nul
rmdir /S /Q "%USERPROFILE%\.gradle\daemon" 2>nul
echo Done.
echo.

echo Cleaning Android build files...
cd android
rmdir /S /Q build 2>nul
rmdir /S /Q app\build 2>nul
rmdir /S /Q .gradle 2>nul
rmdir /S /Q .idea 2>nul
cd ..
echo Done.
echo.

echo ========================================
echo    QUICK FIX COMPLETE!
echo ========================================
echo.
echo Now do this:
echo 1. Restart Android Studio
echo 2. File → Invalidate Caches → Invalidate and Restart
echo 3. Let it sync automatically
echo 4. Build → Clean Project
echo 5. Build → Rebuild Project
echo.
pause
