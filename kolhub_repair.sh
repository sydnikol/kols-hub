#!/bin/bash
echo "🛠 KolHub OS v3 Repair Utility (Unix/macOS)"
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm uninstall @capacitor/core @capacitor/app @capacitor/android @capacitor/ios @capacitor/splash-screen
npm install @capacitor/core@5.7.8 @capacitor/app@5.0.8 @capacitor/android@5.7.8 @capacitor/ios@5.7.8 @capacitor/splash-screen@5.0.8
npm install express cors dotenv sqlite3 react-router-dom@6
npm run build
echo "✅ Repair complete — run npm run dev to start KolHub."
