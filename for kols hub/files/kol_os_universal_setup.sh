#!/bin/bash
# 🌙 KOL Personal OS - Universal Setup & Deploy Script
# Works on Windows (Git Bash), Mac, and Linux
# Run this ONCE to set up EVERYTHING

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🌙 KOL PERSONAL OS - COMPLETE SETUP & DEPLOYMENT 🌙       ║"
echo "║         One hand on the keyboard, one hand on the altar       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Set variables
APP_DIR="C:/Users/Asus User/Desktop/unified-mega-app"
PROJECT_NAME="KOL Personal OS"
VERSION="4.1.0"

# Color codes for terminal output
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_status() {
    echo -e "${PURPLE}[KOL-OS]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Check if running on Windows
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
    print_status "Detected Windows environment"
else
    IS_WINDOWS=false
    print_status "Detected Unix-like environment"
fi

# Step 1: Check Node.js installation
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    print_warning "Please install Node.js from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"
fi

# Step 2: Navigate to app directory or create it
print_status "Setting up project directory..."
if [ ! -d "$APP_DIR" ]; then
    print_warning "App directory not found. Creating it..."
    mkdir -p "$APP_DIR"
    cd "$APP_DIR"
    
    # Initialize new project
    print_status "Initializing new KOL Personal OS project..."
    npm init -y
    
    # Create basic structure
    mkdir -p src/components src/utils src/data public
else
    cd "$APP_DIR"
    print_success "Found existing project directory"
fi

# Step 3: Install all dependencies
print_status "Installing/updating dependencies..."
cat > package.json << 'EOF'
{
  "name": "kol-personal-os",
  "version": "4.1.0",
  "description": "Your Self-Evolving Personal Operating System",
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "desktop": "concurrently \"npm run dev\" \"electron .\"",
    "build:desktop": "npm run build && electron-builder",
    "setup:mobile": "npm run build && npx cap add ios && npx cap add android",
    "build:android": "npm run build && npx cap sync && npx cap open android",
    "build:ios": "npm run build && npx cap sync && npx cap open ios",
    "deploy": "npm run build && netlify deploy --prod",
    "start": "npm run dev",
    "test": "vitest",
    "lint": "eslint src --ext ts,tsx",
    "all": "npm run dev & npm run desktop"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "dexie": "^3.2.4",
    "dexie-react-hooks": "^1.1.7",
    "lucide-react": "^0.292.0",
    "framer-motion": "^10.16.5",
    "date-fns": "^2.30.0",
    "xlsx": "^0.18.5",
    "react-hot-toast": "^2.4.1",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "three": "^0.159.0",
    "@react-three/fiber": "^8.15.12",
    "@react-three/drei": "^9.89.0",
    "zustand": "^4.4.7",
    "react-markdown": "^9.0.1",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.3",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "electron": "^27.1.3",
    "electron-builder": "^24.9.1",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.2",
    "vite": "^5.4.10",
    "vite-plugin-pwa": "^0.17.4",
    "@capacitor/core": "^5.5.1",
    "@capacitor/cli": "^5.5.1",
    "@capacitor/ios": "^5.5.1",
    "@capacitor/android": "^5.5.1",
    "concurrently": "^8.2.2",
    "vitest": "^1.0.4",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "netlify-cli": "^17.10.1"
  }
}
EOF

print_success "Package.json created/updated"

# Install dependencies
print_status "Installing npm packages (this may take a few minutes)..."
npm install --legacy-peer-deps

# Step 4: Create essential config files
print_status "Creating configuration files..."

# Vite config
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'KOL Personal OS',
        short_name: 'KOL-OS',
        description: 'Your Self-Evolving Personal Operating System',
        theme_color: '#6B46C1',
        background_color: '#0F0F0F',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  }
})
EOF

# TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Tailwind config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B46C1',
        secondary: '#4C1D95',
        accent: '#F59E0B',
        background: '#0F0F0F',
        surface: '#1A1A1A',
        text: '#E5E5E5',
        error: '#DC2626',
        success: '#059669',
        warning: '#D97706'
      },
      fontFamily: {
        gothic: ['Cinzel', 'serif'],
        cyber: ['Orbitron', 'monospace'],
      }
    },
  },
  plugins: [],
}
EOF

# PostCSS config
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Capacitor config
cat > capacitor.config.ts << 'EOF'
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kol.personalos',
  appName: 'KOL Personal OS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'kolpersonalos.app'
  }
};

export default config;
EOF

print_success "Configuration files created"

# Step 5: Create main app structure
print_status "Setting up React app structure..."

# Create main HTML
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#6B46C1" />
    <title>KOL Personal OS</title>
    <link rel="manifest" href="/manifest.json" />
    <meta name="description" content="Your Self-Evolving Personal Operating System" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create main TypeScript entry
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Create main CSS
cat > src/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Orbitron:wght@400;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #6B46C1;
  --secondary: #4C1D95;
  --accent: #F59E0B;
  --background: #0F0F0F;
  --surface: #1A1A1A;
}

body {
  margin: 0;
  background-color: var(--background);
  color: #E5E5E5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
EOF

# Create main App component
cat > src/App.tsx << 'EOF'
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="bg-surface p-6 border-b border-primary/20">
        <h1 className="text-3xl font-gothic text-primary">
          🌙 KOL Personal OS
        </h1>
        <p className="text-sm opacity-70 mt-2">
          One hand on the keyboard, one hand on the altar
        </p>
      </header>
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface p-6 rounded-lg border border-primary/30">
            <h2 className="text-xl font-semibold mb-4">🏥 Health Tracker</h2>
            <p>Medication management, symptom tracking, and energy monitoring</p>
          </div>
          <div className="bg-surface p-6 rounded-lg border border-primary/30">
            <h2 className="text-xl font-semibold mb-4">🤖 AI Companion</h2>
            <p>Your gothic futurist AI with multiple personality modes</p>
          </div>
          <div className="bg-surface p-6 rounded-lg border border-primary/30">
            <h2 className="text-xl font-semibold mb-4">🎵 Music Hub</h2>
            <p>Integrated Spotify, YouTube, and SoundCloud player</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
EOF

print_success "React app structure created"

# Step 6: Create service worker for PWA
print_status "Setting up PWA capabilities..."
cat > public/service-worker.js << 'EOF'
const CACHE_NAME = 'kol-os-v4.1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
EOF

# Step 7: Create manifest
cat > public/manifest.json << 'EOF'
{
  "name": "KOL Personal OS",
  "short_name": "KOL-OS",
  "description": "Your Self-Evolving Personal Operating System",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6B46C1",
  "background_color": "#0F0F0F",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

print_success "PWA setup complete"

# Step 8: Create Electron main file
print_status "Setting up Electron for desktop..."
mkdir -p electron
cat > electron/main.js << 'EOF'
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../public/icon-512.png'),
    backgroundColor: '#0F0F0F',
    titleBarStyle: 'hidden',
    autoHideMenuBar: true
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL || 
    `file://${path.join(__dirname, '../dist/index.html')}`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
EOF

print_success "Electron desktop setup complete"

# Step 9: Create launch scripts
print_status "Creating launch scripts..."

# Windows batch file
cat > START.bat << 'EOF'
@echo off
echo Starting KOL Personal OS...
cd /d "C:\Users\Asus User\Desktop\unified-mega-app"
start cmd /k npm run dev
timeout /t 5
start http://localhost:5173
echo.
echo ===================================
echo KOL Personal OS is now running!
echo Access at: http://localhost:5173
echo ===================================
pause
EOF

# Unix shell script
cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting KOL Personal OS..."
npm run dev &
sleep 5
open http://localhost:5173 || xdg-open http://localhost:5173
echo "====================================="
echo "KOL Personal OS is now running!"
echo "Access at: http://localhost:5173"
echo "====================================="
EOF
chmod +x start.sh

print_success "Launch scripts created"

# Step 10: Build the project
print_status "Building the project..."
npm run build

# Step 11: Start the development server
print_status "Starting KOL Personal OS..."
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🎉 SETUP COMPLETE! 🎉                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_success "KOL Personal OS v$VERSION is ready!"
echo ""
echo "📋 Quick Commands:"
echo "  Start Development:  npm run dev"
echo "  Desktop App:        npm run desktop"
echo "  Build for Web:      npm run build"
echo "  Build Android:      npm run build:android"
echo "  Build iOS:          npm run build:ios"
echo "  Deploy to Web:      npm run deploy"
echo ""
echo "🌐 Access Points:"
echo "  Local:     http://localhost:5173"
echo "  Network:   http://$(hostname -I | awk '{print $1}'):5173"
echo "  Desktop:   Run 'npm run desktop'"
echo ""
echo "📱 Mobile Setup:"
echo "  1. Connect phone to same WiFi"
echo "  2. Open browser to network address above"
echo "  3. Add to home screen"
echo ""
echo "💜 Remember: One hand on the keyboard, one hand on the altar 💜"
echo ""

# Launch in development mode
if [[ "$1" != "--no-launch" ]]; then
    print_status "Launching KOL Personal OS..."
    npm run dev
fi
