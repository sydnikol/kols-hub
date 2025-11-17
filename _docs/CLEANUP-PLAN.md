# KOL Project Cleanup Plan
**Date:** November 13, 2025

## Files to Archive/Remove

### Duplicate Documentation (Keep only consolidated versions)
- Multiple NETLIFY guides (consolidate to one)
- Multiple AVATAR guides (consolidate to one)
- Multiple MUSIC setup guides (consolidate to one)
- Multiple MOBILE download guides (consolidate to one)
- Multiple DEPLOYMENT guides (consolidate to one)
- Duplicate EVOLUTION-LOG.json files
- Multiple checklist HTML files (consolidate)

### Redundant Batch Scripts (Keep only essential launchers)
- Keep: 🖤-START-KOL.bat (main launcher)
- Keep: Scripts/ folder for build utilities
- Archive: All other specialty .bat files

### Scattered Reference Files
- Consolidate all .txt quick references into one master reference
- Keep JSON data files (feature maps, AI companion reference)
- Archive completion markers (🎉-ALL-DONE-*.txt files)

## New Organization Structure

### /docs (Consolidated Documentation)
- COMPLETE-GUIDE.md (all-in-one guide)
- DEPLOYMENT-GUIDE.md (deployment only)
- DEVELOPER-LOG.md (keep existing)
- MOBILE-GUIDE.md (mobile setup)
- API-REFERENCE.md (API keys and integrations)

### /scripts (Build & Utility Scripts)
- Keep all existing build scripts
- Add repair and maintenance scripts

### Root Files (Minimal)
- README.md (main project readme)
- 🖤-START-KOL.bat (primary launcher)
- Package files (package.json, tsconfig, vite.config, etc.)
- .env files

### /assets (Visual Resources)
- Move Covers_Icons_Blend here
- Keep organized by category

### /_ARCHIVE (Historical & Redundant Files)
- Move all duplicate/old files here with date stamp
- Keep for reference but out of main project

## Implementation Steps
1. Create new /docs structure
2. Consolidate documentation
3. Move redundant files to archive
4. Create master launcher script
5. Update README with new structure
6. Test all functionality
7. Update DEVELOPER-LOG
