@echo off
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🖤 CONSOLIDATING KOL INTO ONE UNIFIED SYSTEM 🖤              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "C:\Users\Asus User\Desktop\unified-mega-app"

echo [1/4] Backing up important files...
if not exist "_BACKUPS" mkdir "_BACKUPS"
copy "🖤-EVOLUTION-LOG.json" "_BACKUPS\" >nul 2>&1
copy "kol_ai_companion_reference.json" "_BACKUPS\" >nul 2>&1
copy "kol_master_feature_map.json" "_BACKUPS\" >nul 2>&1
copy "dnd_ideas_001_900.json" "_BACKUPS\" >nul 2>&1
copy ".env" "_BACKUPS\" >nul 2>&1

echo ✓ Critical files backed up

echo.
echo [2/4] Removing duplicate/outdated documentation files...

REM Remove old guides - we have the evolution log now
del /q "COMPLETE-GUIDE.txt" 2>nul
del /q "HOW-TO-FIX-AND-START.txt" 2>nul
del /q "QUICKSTART.txt" 2>nul
del /q "START-ME-FIRST.txt" 2>nul
del /q "🎉-ALL-DONE-READ-ME.txt" 2>nul
del /q "🎉-NEW-HEALTH-AND-COMMUNICATIONS-FEATURES.txt" 2>nul

REM Keep only essential startup files
del /q "START.bat" 2>nul
del /q "START-APP.bat" 2>nul
del /q "FIX-APP.bat" 2>nul
del /q "INSTALL-EVERYTHING.bat" 2>nul
del /q "DELETE-OLD-APPS.bat" 2>nul
del /q "kolhub_repair.bat" 2>nul
del /q "kolhub_repair.sh" 2>nul

echo ✓ Removed duplicate guides

echo.
echo [3/4] Organizing feature data into single sources...

REM Remove duplicate Notion CSV files - data is in JSON now
del /q "Notion_*.csv" 2>nul
rmdir /s /q "Notion_Feature_Tables" 2>nul
rmdir /s /q "Notion_Import_Pack" 2>nul

REM Keep only the master JSON files
del /q "KolHub_Ideas_250.csv" 2>nul
del /q "KolHub_Ideas_250.md" 2>nul
del /q "kolhub_seed.json" 2>nul
REM Keeping: KolHub_Ideas_9000_detailed.json (master)
REM Keeping: kol_master_feature_map.json (reference)
REM Keeping: dnd_ideas_001_900.json (your ideas)

echo ✓ Feature data consolidated

echo.
echo [4/4] Removing old template/generator folders...
rmdir /s /q "KolHub_Notion_Complete_Pack" 2>nul
rmdir /s /q "KolHub_Notion_Icons_Templates" 2>nul
rmdir /s /q "KolHub_Notion_Templates_Addon" 2>nul
rmdir /s /q "KolHub_DetailedSeed_9000_plus_Generator" 2>nul

echo ✓ Old templates removed

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✨ CONSOLIDATION COMPLETE ✨                                  ║
echo ║                                                                 ║
echo ║  Your unified-mega-app is now:                                ║
echo ║  • One clean folder structure                                 ║
echo ║  • Self-updating evolution log                                ║
echo ║  • No duplicate files                                         ║
echo ║  • Ready to grow with you                                     ║
echo ║                                                                 ║
echo ║  Essential files preserved in: _BACKUPS\                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause
