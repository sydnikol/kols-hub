cd "C:\Users\Asus User\Desktop\unified-mega-app"

Write-Host "Cleaning NPM cache..." -ForegroundColor Cyan
npm cache clean --force

Write-Host "`nRemoving package-lock.json..." -ForegroundColor Cyan
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
}

Write-Host "`nRemoving node_modules (please wait)..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Get-ChildItem -Path "node_modules" -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    Remove-Item "node_modules" -Force -Recurse -ErrorAction SilentlyContinue
}

Write-Host "`nInstalling dependencies..." -ForegroundColor Green
npm install --force --legacy-peer-deps

Write-Host "`nVerifying Vite installation..." -ForegroundColor Cyan
$vitePath = "node_modules\vite\package.json"
if (Test-Path $vitePath) {
    Write-Host "Vite installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Vite missing, installing separately..." -ForegroundColor Yellow
    npm install vite@5.4.21 --save-dev --force
}

Write-Host "`nInstallation complete!" -ForegroundColor Green
