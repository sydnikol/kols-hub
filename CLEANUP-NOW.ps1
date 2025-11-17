# 🖤 KOL Hub Folder Cleanup Script
# Comprehensive reorganization - November 16, 2025

$baseDir = "C:\Users\Asus User\Desktop\unified-mega-app"
Set-Location $baseDir

Write-Host "🖤 Starting KOL Hub Cleanup..." -ForegroundColor Magenta

# ====================================
# MOVE DOCUMENTATION
# ====================================
Write-Host "`n📚 Organizing Documentation..." -ForegroundColor Cyan

# Move guides
$guideFiles = @(
    "ANDROID-BUILD-GUIDE.md",
    "ANDROID-GUIDE.md",
    "ANDROID-QUICK-REF.txt",
    "ANDROID-SUCCESS.md",
    "TESTING_GUIDE.md",
    "VISUAL_GUIDE.md",
    "FEATURE-GUIDE.md",
    "EDUCATION_COMPLETE_GUIDE.md",
    "EDUCATION_QUICKSTART.md",
    "🎉-ANDROID-PERFECT-START-HERE.md",
    "🎓-EDUCATION-START-HERE.txt"
)
foreach ($file in $guideFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\guides\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move technical docs
$technicalFiles = @(
    "BUILD-SUMMARY.txt",
    "BUILD_COMPLETE.md",
    "DEPLOYMENT-STATUS.md",
    "DEPLOYMENT-SUCCESS.md",
    "GRADLE-TROUBLESHOOTING.md",
    "NETLIFY-DEPLOYMENT-GUIDE.md",
    "NETLIFY-DEPLOYMENT.md",
    "NETLIFY-STATUS.md",
    "PLATFORM-VERIFICATION-COMPLETE.md",
    "PRODUCTION-READY-STATUS.md",
    "QUICK-PLATFORM-REFERENCE.txt",
    "DEPLOY-QUICK-REF.txt"
)
foreach ($file in $technicalFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\technical\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move developer logs
$devlogFiles = @(
    "DEVELOPER-LOG.md",
    "DEVELOPER_LOG.md",
    "DEVELOPER_LOG_MOBILE_DOWNLOADS.md",
    "CHRONOMUSE-DEVELOPMENT-LOG.md",
    "CHRONOMUSE_DEVLOG.md",
    "EDUCATION_DEVLOG.md",
    "EDUCATION_SYSTEM_LOG.md",
    "CLEANUP-PLAN.md",
    "CLEANUP_EXECUTION_LOG.md",
    "COLOR_PURGE_LOG.md",
    "🖤-EVOLUTION-LOG.json"
)
foreach ($file in $devlogFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\developer\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move reference docs
$referenceFiles = @(
    "Kol_AI_Companion_Reference.md",
    "kol_ai_companion_reference.json",
    "kol_master_feature_map.json",
    "PROJECT-INDEX.md",
    "📍-MASTER-INDEX-VERIFIED.md",
    "📍-PROJECT-INDEX.md"
)
foreach ($file in $referenceFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\reference\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move status/completion docs
$statusFiles = @(
    "CHECKLIST.md",
    "COMPLETE-FUNCTIONAL-UPDATE.md",
    "COMPLETION-SUMMARY.md",
    "EDUCATION_BUILD_COMPLETE.md",
    "EDUCATION_INTEGRATION_CHECKLIST.md",
    "EDUCATION_SUMMARY.md",
    "MEDICATION-STATUS.md",
    "SUMMARY.md",
    "SYSTEM-STATUS.md",
    "✅-ALL-PLATFORMS-VERIFIED.txt",
    "✅-COMPLETE-SUCCESS-CONFIRMED.md",
    "✅-GRADLE-FIXED-SUCCESS-CARD.txt",
    "⚡-GRADLE-FIX-NOW.txt",
    "📊-COMPLETE-STATUS.md",
    "📋-GRADLE-FIX-INDEX.txt",
    "🎊-ALL-PLATFORMS-VERIFIED.html",
    "🎊-COMPLETE-AND-READY.md",
    "🎊-GRADLE-FIX-COMPLETE-SUMMARY.md",
    "🎊-VERIFICATION-SUMMARY.md",
    "🖤-CLEANUP-COMPLETE.md",
    "🖤-CLEANUP-SUMMARY.html",
    "🖤-COLOR-PURGE-COMPLETE.md",
    "🖤-QUICK-SUMMARY.md",
    "🚀-LAUNCH-CHECKLIST.md",
    "🚀-START-HERE-GRADLE-FIX.md"
)
foreach ($file in $statusFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\status\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# ====================================
# MOVE DATA FILES
# ====================================
Write-Host "`n💾 Organizing Data Files..." -ForegroundColor Cyan

$featureFiles = @(
    "KolHub_Ideas_250.json",
    "KolHub_Ideas_9000_detailed.json",
    "dnd_ideas_601_900.json",
    "automations.full.json"
)
foreach ($file in $featureFiles) {
    if (Test-Path $file) {
        Move-Item $file "data\features\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

$seedFiles = @(
    "generate_full_seed.py"
)
foreach ($file in $seedFiles) {
    if (Test-Path $file) {
        Move-Item $file "data\seeds\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# ====================================
# ORGANIZE SCRIPTS
# ====================================
Write-Host "`n⚙️ Organizing Scripts..." -ForegroundColor Cyan

# Move launchers
$launcherFiles = @(
    "ANDROID-LAUNCHER.bat",
    "🖤-LAUNCH-CARD.txt",
    "🖤-LAUNCH-CONTROL.html"
)
foreach ($file in $launcherFiles) {
    if (Test-Path $file) {
        Move-Item $file "scripts\launchers\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move build scripts
$buildFiles = @(
    "BUILD-ALL-PLATFORMS.bat",
    "build-android-debug.bat",
    "TEST-ALL-PLATFORMS.bat",
    "verify-all-platforms.bat",
    "verify-build.bat",
    "verify-build.sh"
)
foreach ($file in $buildFiles) {
    if (Test-Path $file) {
        Move-Item $file "scripts\build\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move deploy scripts
$deployFiles = @(
    "🚀-DEPLOY-TO-NETLIFY-NOW.bat"
)
foreach ($file in $deployFiles) {
    if (Test-Path $file) {
        Move-Item $file "scripts\deploy\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move maintenance scripts
$maintenanceFiles = @(
    "fix-android-studio.bat",
    "FIX-GRADLE-COMPLETE.bat",
    "FIX-GRADLE-QUICK.bat",
    "FULL-REINSTALL.ps1",
    "REINSTALL-DEPENDENCIES.ps1",
    "RUN-COLOR-PURGE.bat",
    "🔧-REPAIR-SYSTEM.bat",
    "🖤-COMPLETE-REBUILD-NOW.bat",
    "🖤-GRADLE-FIX-MASTER.bat",
    "🖤-ONE-CLICK-SETUP.bat",
    "fix_colors_final.py",
    "remove_all_pastels.py",
    "remove_pastels.py"
)
foreach ($file in $maintenanceFiles) {
    if (Test-Path $file) {
        Move-Item $file "scripts\maintenance\" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# ====================================
# ARCHIVE DUPLICATE HTML/REFERENCE FILES
# ====================================
Write-Host "`n🗄️ Archiving Duplicates..." -ForegroundColor Cyan

$duplicateFiles = @(
    "MISSION-CONTROL.html",
    "QUICK-REFERENCE.html",
    "🔧-GRADLE-FIX-GUIDE.html",
    "🖤-GOTHIC-COLOR-SYSTEM.html",
    "🚀-GRADLE-FIX-QUICK-ACCESS.html"
)
foreach ($file in $duplicateFiles) {
    if (Test-Path $file) {
        Move-Item $file "_ARCHIVE_CLEANUP_20251116\old_status_files\" -Force
        Write-Host "  ✓ Archived $file" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Cleanup Complete!" -ForegroundColor Green
Write-Host "📂 Files organized into:" -ForegroundColor White
Write-Host "  - docs\guides (user documentation)" -ForegroundColor Gray
Write-Host "  - docs\technical (build/deploy guides)" -ForegroundColor Gray
Write-Host "  - docs\developer (evolution logs)" -ForegroundColor Gray
Write-Host "  - docs\reference (API & feature databases)" -ForegroundColor Gray
Write-Host "  - docs\status (completion summaries)" -ForegroundColor Gray
Write-Host "  - data\features (JSON databases)" -ForegroundColor Gray
Write-Host "  - data\seeds (seed generation)" -ForegroundColor Gray
Write-Host "  - scripts\launchers (one-click starts)" -ForegroundColor Gray
Write-Host "  - scripts\build (platform builds)" -ForegroundColor Gray
Write-Host "  - scripts\deploy (deployment automation)" -ForegroundColor Gray
Write-Host "  - scripts\maintenance (repair tools)" -ForegroundColor Gray

Write-Host "`n🖤 KOL Hub folder is now clean and organized!" -ForegroundColor Magenta
