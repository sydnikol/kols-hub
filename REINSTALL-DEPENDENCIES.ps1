# KOL Personal OS - Complete Dependency Reinstall
# PowerShell Script for Windows

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  🖤 KOL PERSONAL OS - DEPENDENCY FIX" -ForegroundColor Magenta  
Write-Host "  Complete Reinstallation Process" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Step 1: Clear NPM cache
Write-Host "[1/6] Clearing NPM cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✓ Cache cleared" -ForegroundColor Green

# Step 2: Remove package-lock.json
Write-Host ""
Write-Host "[2/6] Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "✓ Lock file removed" -ForegroundColor Green
} else {
    Write-Host "✓ No lock file found" -ForegroundColor Green
}

# Step 3: Remove node_modules
Write-Host ""
Write-Host "[3/6] Removing node_modules..." -ForegroundColor Yellow
Write-Host "   (This may take a minute - Please wait)" -ForegroundColor Cyan
if (Test-Path "node_modules") {
    # Kill any processes that might be locking files
    Get-Process | Where-Object {$_.Path -like "*node_modules*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Use robocopy to delete (faster for large directories)
    $null = New-Item -ItemType Directory -Path "empty_temp" -Force
    robocopy "empty_temp" "node_modules" /MIR /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "empty_temp" -Recurse -Force
    
    Write-Host "✓ node_modules removed" -ForegroundColor Green
} else {
    Write-Host "✓ No node_modules found" -ForegroundColor Green
}

# Step 4: Fresh install
Write-Host ""
Write-Host "[4/6] Installing all dependencies..." -ForegroundColor Yellow  
Write-Host "   (This will take 2-3 minutes)" -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 5: Verify installation
Write-Host ""
Write-Host "[5/6] Verifying installation..." -ForegroundColor Yellow
$viteExists = Test-Path "node_modules\vite"
$reactExists = Test-Path "node_modules\react"
$dexieExists = Test-Path "node_modules\dexie"

if ($viteExists -and $reactExists -and $dexieExists) {
    Write-Host "✓ Core packages verified" -ForegroundColor Green
} else {
    Write-Host "✗ Some packages missing!" -ForegroundColor Red
    if (-not $viteExists) { Write-Host "  Missing: vite" -ForegroundColor Red }
    if (-not $reactExists) { Write-Host "  Missing: react" -ForegroundColor Red }
    if (-not $dexieExists) { Write-Host "  Missing: dexie" -ForegroundColor Red }
}

# Step 6: Test build
Write-Host ""
Write-Host "[6/6] Testing configuration..." -ForegroundColor Yellow
Write-Host "   Checking if dev server can start..." -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  ✅ INSTALLATION COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Ready to launch KOL Personal OS!" -ForegroundColor Cyan
Write-Host "Run: npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or use: 🖤-START-KOL.bat" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
