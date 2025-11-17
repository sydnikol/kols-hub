# 🖤 KOL Quick Reference Card

## 🚀 Launch Commands
```bash
npm run dev              # Web dev server (localhost:5173)
npm run electron:dev     # Desktop app
🖤-START-KOL.bat        # Windows one-click launcher
```

## 📦 Build Commands
```bash
npm run build            # Web production build
npm run electron:build   # Desktop app build
npm run build:mobile     # Mobile app build
```

## 🔐 Essential API Keys
```env
VITE_SPOTIFY_CLIENT_ID=your_id
VITE_RPM_AVATAR_ID=68e94e474099d80b93c9b714
```

## 📁 Key Files
- **Main Config**: `vite.config.ts`, `capacitor.config.ts`
- **Features**: `KolHub_Ideas_9000_detailed.json`
- **AI Reference**: `kol_ai_companion_reference.json`
- **Medication Import**: `med_list_20250930_181636.xls`

## 🎯 Quick Fixes
```bash
# Port in use
npx kill-port 5173

# Clean install
rm -rf node_modules && npm install

# Clear cache
npm cache clean --force
```

## 🌐 Deployment
```bash
# Netlify
npm run build && netlify deploy --prod

# Check build
npm run build && npm run preview
```

## 📊 Project Stats
- **9000+** documented features
- **4** emotional AI modes
- **6** virtual sanctum rooms
- **3** platforms (desktop/web/mobile)
- **Offline** support across all platforms

## 🎨 Tech Stack
- React 18 + TypeScript
- Vite 5 + Tailwind CSS
- Electron (desktop)
- Capacitor (mobile)
- IndexedDB (storage)
- Ready Player Me (3D avatar)

## 📖 Full Documentation
See: `docs/_consolidated/COMPLETE-GUIDE.md`
