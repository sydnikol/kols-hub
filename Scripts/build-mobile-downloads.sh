#!/bin/bash
# Mobile App Download Builder for Mac/Linux

echo "========================================"
echo "  📱 MOBILE APP DOWNLOAD BUILDER"
echo "========================================"
echo ""

cd "$(dirname "$0")/.."

echo "🔍 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found"
echo ""

echo "📦 Building mobile download assets..."
echo "This will prepare the app for mobile installation"
echo ""

node Scripts/build-mobile-downloads.js

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✅ BUILD COMPLETE!"
    echo "========================================"
    echo ""
    echo "📱 Your mobile apps are ready!"
    echo ""
    echo "NEXT STEPS:"
    echo ""
    echo "1. EASIEST: Install via browser (PWA)"
    echo "   - Open this website on your phone"
    echo "   - Tap \"Add to Home Screen\""
    echo "   - Done! Works offline!"
    echo ""
    echo "2. ADVANCED: Build native apps"
    echo "   - Android: npm run build:android"
    echo "   - iOS: npm run build:ios"
    echo ""
    echo "📄 See public/downloads/README.md for details"
    echo ""
else
    echo ""
    echo "❌ Build failed! Check errors above."
    echo ""
    exit 1
fi