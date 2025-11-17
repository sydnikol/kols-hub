@echo off
echo ========================================
echo KOL Personal OS - Android Diagnostic
echo ========================================
echo.

set ERRORS=0
set WARNINGS=0

REM Check Node.js
echo [Checking Node.js...]
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js found
    node --version
) else (
    echo ✗ Node.js not found! Install from nodejs.org
    set /a ERRORS+=1
)
echo.

REM Check NPM
echo [Checking NPM...]
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ NPM found
    npm --version
) else (
    echo ✗ NPM not found! Should come with Node.js
    set /a ERRORS+=1
)
echo.

REM Check Java
echo [Checking Java JDK...]
where java >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Java found
    java -version 2>&1 | findstr /C:"version"
) else (
    echo ✗ Java not found! Install JDK 17 or higher
    set /a ERRORS+=1
)
echo.

REM Check JAVA_HOME
echo [Checking JAVA_HOME...]
if defined JAVA_HOME (
    echo ✓ JAVA_HOME is set
    echo   %JAVA_HOME%
) else (
    echo ⚠ JAVA_HOME not set (may cause issues)
    set /a WARNINGS+=1
)
echo.

REM Check Android SDK
echo [Checking Android SDK...]
if defined ANDROID_HOME (
    echo ✓ ANDROID_HOME is set
    echo   %ANDROID_HOME%
) else if defined ANDROID_SDK_ROOT (
    echo ✓ ANDROID_SDK_ROOT is set
    echo   %ANDROID_SDK_ROOT%
) else (
    echo ⚠ Android SDK environment variable not set
    echo   Will check local.properties instead
    set /a WARNINGS+=1
)
echo.

REM Check local.properties
echo [Checking local.properties...]
if exist "android\local.properties" (
    echo ✓ local.properties exists
    findstr "sdk.dir" android\local.properties
) else (
    echo ⚠ local.properties not found
    echo   Android Studio will create this automatically
    set /a WARNINGS+=1
)
echo.

REM Check Gradle
echo [Checking Gradle...]
if exist "android\gradlew.bat" (
    echo ✓ Gradle wrapper found
) else (
    echo ✗ Gradle wrapper missing!
    set /a ERRORS+=1
)
echo.

REM Check package.json
echo [Checking package.json...]
if exist "package.json" (
    echo ✓ package.json exists
    findstr /C:"\"version\"" package.json
) else (
    echo ✗ package.json not found!
    set /a ERRORS+=1
)
echo.

REM Check Capacitor installation
echo [Checking Capacitor...]
if exist "node_modules\@capacitor\core" (
    echo ✓ Capacitor installed
) else (
    echo ✗ Capacitor not installed! Run: npm install
    set /a ERRORS+=1
)
echo.

REM Check Android platform
echo [Checking Android platform...]
if exist "android\app\build.gradle" (
    echo ✓ Android platform configured
) else (
    echo ✗ Android platform missing! Run: npx cap add android
    set /a ERRORS+=1
)
echo.

REM Check web build
echo [Checking web build...]
if exist "dist\index.html" (
    echo ✓ Web build exists
) else (
    echo ⚠ Web build not found. Run: npm run build
    set /a WARNINGS+=1
)
echo.

REM Check ADB (optional)
echo [Checking ADB (optional)...]
where adb >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ ADB found
    adb version 2>&1 | findstr /C:"Version"
    echo   Checking connected devices...
    adb devices
) else (
    echo ℹ ADB not found (optional for development)
    echo   Install Android SDK Platform Tools to use ADB
)
echo.

REM Check Android Studio (optional)
echo [Checking Android Studio (optional)...]
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    echo ✓ Android Studio found (default location)
) else if exist "%ProgramFiles(x86)%\Android\Android Studio\bin\studio64.exe" (
    echo ✓ Android Studio found (x86 location)
) else (
    echo ℹ Android Studio not found in default location
    echo   You can still build with gradlew, but IDE is recommended
)
echo.

REM Check disk space
echo [Checking disk space...]
for /f "tokens=3" %%a in ('dir /-c ^| find "bytes free"') do set FREE=%%a
echo   Free disk space: %FREE% bytes
echo.

REM Final summary
echo ========================================
echo DIAGNOSTIC SUMMARY
echo ========================================
echo Errors:   %ERRORS%
echo Warnings: %WARNINGS%
echo.

if %ERRORS% equ 0 (
    if %WARNINGS% equ 0 (
        echo ✓✓✓ PERFECT! All checks passed! ✓✓✓
        echo.
        echo You're ready to build! Run:
        echo   Scripts\build-android.bat
        echo   or
        echo   ANDROID-LAUNCHER.bat
    ) else (
        echo ✓ GOOD! All critical checks passed.
        echo ⚠ Some warnings - build should work but may need attention.
    )
) else (
    echo ✗ ISSUES FOUND!
    echo Please fix the errors above before building.
    echo.
    echo Common fixes:
    echo - Install Node.js: https://nodejs.org
    echo - Install JDK 17: https://adoptium.net
    echo - Install Android Studio: https://developer.android.com/studio
    echo - Run: npm install
    echo - Run: npx cap add android
)

echo.
echo ========================================
pause
