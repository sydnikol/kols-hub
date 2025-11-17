@echo off
echo ========================================
echo KOL Personal OS - Release APK Builder
echo ========================================
echo.

REM Build optimized release APK
echo [1/6] Cleaning previous builds...
call npm run build
cd android
call gradlew clean
cd ..

echo [2/6] Building optimized web assets...
call npm run build
if errorlevel 1 goto :error

echo [3/6] Syncing Capacitor...
call npx cap sync android
if errorlevel 1 goto :error

echo [4/6] Building release APK...
cd android
call gradlew assembleRelease
if errorlevel 1 (
    cd ..
    goto :error
)
cd ..

echo [5/6] Verifying APK...
if exist "android\app\build\outputs\apk\release\app-release-unsigned.apk" (
    echo ✓ Release APK created successfully!
) else (
    echo ERROR: Release APK not found!
    goto :error
)

echo [6/6] Build complete!
echo.
echo ========================================
echo Release APK Location:
echo android\app\build\outputs\apk\release\app-release-unsigned.apk
echo ========================================
echo.
echo IMPORTANT: This APK is unsigned and cannot be installed.
echo.
echo To create a signed APK for distribution:
echo 1. Generate a keystore:
echo    keytool -genkey -v -keystore kol-release-key.keystore -alias kol-key -keyalg RSA -keysize 2048 -validity 10000
echo.
echo 2. Sign the APK:
echo    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore kol-release-key.keystore android\app\build\outputs\apk\release\app-release-unsigned.apk kol-key
echo.
echo 3. Optimize with zipalign:
echo    zipalign -v 4 android\app\build\outputs\apk\release\app-release-unsigned.apk kol-release-signed.apk
echo.
echo OR use Android Studio:
echo    Build -^> Generate Signed Bundle / APK -^> APK
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ERROR: Build failed!
echo Check the error messages above.
echo ========================================
pause
exit /b 1
