#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# KOL PERSONAL OS - NETLIFY DEPLOYMENT SCRIPT
# ═══════════════════════════════════════════════════════════════

echo "🚀 Building KOL Personal OS..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📦 Deploying to Netlify..."
    netlify deploy --prod --dir=dist --no-build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Deployment successful!"
        echo "🌐 Production URL: https://kol-personal-os.netlify.app"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
