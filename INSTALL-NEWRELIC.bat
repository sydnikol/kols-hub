@echo off
echo ============================================
echo  NEW RELIC INSTALLATION
echo  Enterprise Observability Platform
echo ============================================
echo.

echo Installing New Relic CLI...
echo.

PowerShell.exe -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = 'tls12, tls'; $WebClient = New-Object System.Net.WebClient; $WebClient.DownloadFile('https://download.newrelic.com/install/newrelic-cli/scripts/install.ps1', '$env:TEMP\install.ps1'); & PowerShell.exe -ExecutionPolicy Bypass -File $env:TEMP\install.ps1"

echo.
echo Setting environment variables...
set NEW_RELIC_API_KEY=<YOUR_NEW_RELIC_API_KEY>
set NEW_RELIC_ACCOUNT_ID=7395271

echo.
echo Installing New Relic agent...
"C:\Program Files\New Relic\New Relic CLI\newrelic.exe" install

echo.
echo ============================================
echo  INSTALLATION COMPLETE!
echo ============================================
echo.
echo Next steps:
echo 1. New Relic is now installed
echo 2. Your Account ID: 7395271
echo 3. View dashboard: https://one.newrelic.com
echo.
echo Integration with app:
echo 1. Open http://localhost:5173/enterprise-monitoring
echo 2. New Relic metrics will auto-sync every 60 seconds
echo.
pause
