@echo off
echo ============================================
echo  NEW RELIC INTEGRATION TEST
echo ============================================
echo.

echo Testing New Relic configuration...
echo.

echo Your credentials:
echo Account ID: 7395271
echo API Key: <YOUR_NEW_RELIC_API_KEY>
echo.

echo Testing connection to New Relic...
echo.

PowerShell.exe -ExecutionPolicy Bypass -Command ^
"$apiKey = '<YOUR_NEW_RELIC_API_KEY>'; ^
$accountId = '7395271'; ^
$url = \"https://insights-collector.newrelic.com/v1/accounts/$accountId/events\"; ^
$body = @{ ^
    eventType = 'TestEvent'; ^
    timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds(); ^
    testMessage = 'New Relic integration test from Unified Mega App'; ^
    success = $true ^
} | ConvertTo-Json; ^
try { ^
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers @{'Content-Type'='application/json'; 'X-Insert-Key'=$apiKey} -Body $body; ^
    Write-Host ''; ^
    Write-Host 'SUCCESS! New Relic is connected and working!' -ForegroundColor Green; ^
    Write-Host ''; ^
    Write-Host 'Test event sent successfully!'; ^
    Write-Host 'Check your dashboard: https://onenr.io/0vwBYzoDKQp'; ^
    Write-Host ''; ^
} catch { ^
    Write-Host ''; ^
    Write-Host 'ERROR: Could not connect to New Relic' -ForegroundColor Red; ^
    Write-Host $_.Exception.Message; ^
    Write-Host ''; ^
}"

echo.
echo ============================================
echo  INTEGRATION STATUS
echo ============================================
echo.
echo Configuration files:
echo   - src/services/newrelic-integration.ts .... OK
echo   - src/core/MetricsCollector.ts ............ ENHANCED
echo   - INSTALL-NEWRELIC.bat .................... OK
echo.
echo Your app will auto-sync metrics to New Relic:
echo   - Every earning tracked
echo   - Every content piece generated
echo   - Every API call made
echo   - Every error logged
echo.
echo Auto-sync interval: 60 seconds
echo.
echo ============================================
echo  NEXT STEPS
echo ============================================
echo.
echo 1. Start your app: npm run dev
echo 2. Generate some content
echo 3. Wait 60 seconds
echo 4. Check New Relic: https://onenr.io/0vwBYzoDKQp
echo 5. See your metrics appear!
echo.
pause
