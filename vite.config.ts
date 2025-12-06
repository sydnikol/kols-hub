// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',  // Don't auto-register - we handle it manually
      devOptions: { enabled: false },
      selfDestroying: false,
      injectRegister: false,  // Don't inject registration script
      includeAssets: ['icon.svg', 'data/**/*'],
      manifest: {
        name: "Kol's Hub - Your Self-Evolving Personal OS",
        short_name: "Kol's Hub",
        description: 'Complete unified life management system',
        theme_color: '#8b5cf6',
        background_color: '#1a0033',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.spotify\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'spotify-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-apis-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@data': path.resolve(__dirname, './src/data'),
      '@config': path.resolve(__dirname, './src/config')
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/preferences',
        '@capacitor/browser',
        '@capacitor/filesystem',
        '@capacitor/camera',
        '@capacitor/share',
        '@capacitor/clipboard',
        '@capacitor/device',
        '@capacitor/app',
        '@capacitor/haptics',
        '@capacitor/local-notifications',
        '@capacitor-community/contacts'
      ],
      output: {
        manualChunks(id) {
          // Core React ecosystem
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }

          // UI Libraries - split MUI into smaller chunks
          if (id.includes('node_modules/@mui/material')) {
            return 'mui-material';
          }
          if (id.includes('node_modules/@mui/')) {
            return 'mui-system';
          }
          if (id.includes('node_modules/@emotion/')) {
            return 'emotion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }

          // 3D Graphics - separate chunk (only loaded when needed)
          if (id.includes('node_modules/three')) {
            return 'three-core';
          }
          if (id.includes('node_modules/@react-three/')) {
            return 'react-three';
          }

          // Charts
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'charts';
          }
          if (id.includes('node_modules/recharts')) {
            return 'recharts';
          }

          // Data/State management
          if (id.includes('node_modules/dexie')) {
            return 'database';
          }
          if (id.includes('node_modules/axios')) {
            return 'http';
          }
          if (id.includes('node_modules/date-fns')) {
            return 'date-utils';
          }

          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'animation';
          }

          // Utilities
          if (id.includes('node_modules/lodash')) {
            return 'lodash';
          }

          // All other node_modules go to vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'dexie',
      'lucide-react',
      'react-hot-toast'
    ]
  }
});