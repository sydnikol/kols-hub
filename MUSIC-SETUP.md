# 🎵 Music Integration Setup Guide

## Overview
KOL Personal OS supports **3 music streaming platforms** with full **offline functionality** across all platforms (Web, Desktop, Android, iOS).

### Supported Platforms
- ✅ **Spotify** - Full API integration
- ✅ **YouTube Music** - YouTube Data API v3
- ✅ **SoundCloud** - SoundCloud API

---

## 🔑 Getting API Keys

### Spotify Setup

1. **Go to Spotify Developer Dashboard**
   - Visit: https://developer.spotify.com/dashboard
   - Log in with your Spotify account

2. **Create an App**
   - Click "Create an App"
   - Name: "KOL Personal OS"
   - Description: "Personal music integration for KOL Hub"
   - Check "Web API" and accept terms

3. **Get Credentials**
   - Copy your `Client ID`
   - Copy your `Client Secret`
   - Click "Edit Settings"

4. **Add Redirect URIs**
   ```
   http://localhost:5173/oauth/spotify
   https://your-domain.com/oauth/spotify
   ```

5. **Update .env file**
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

### YouTube Music Setup

**ALREADY CONFIGURED!** ✅

YouTube API key is already included in the project:
- API Key: `AIzaSyCYX4XRr7j2oKC-Xu6qNCMyIX6WF9ep5gY`
- OAuth Client ID: `982711879367-2jcmmge9k858eercf865i2jo1c4v37p8.apps.googleusercontent.com`

**If you want your own key:**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Create a new project or select existing

2. **Enable YouTube Data API v3**
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

3. **Create Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

4. **Create OAuth 2.0 Client**
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Add redirect URIs:
     ```
     http://localhost:5173/oauth/youtube
     https://your-domain.com/oauth/youtube
     ```

5. **Update .env file (optional)**
   ```env
   VITE_YOUTUBE_API_KEY=your_api_key_here
   VITE_YOUTUBE_OAUTH_CLIENT_ID=your_oauth_client_id_here
   ```

### SoundCloud Setup

1. **Go to SoundCloud for Developers**
   - Visit: https://developers.soundcloud.com
   - Log in with your SoundCloud account

2. **Register Your App**
   - Click "Register a new application"
   - Name: "KOL Personal OS"
   - Redirect URI: `http://localhost:5173/soundcloud/callback`

3. **Get Credentials**
   - Copy your `Client ID`
   - Copy your `Client Secret`

4. **Update .env file**
   ```env
   VITE_SOUNDCLOUD_CLIENT_ID=your_client_id_here
   VITE_SOUNDCLOUD_CLIENT_SECRET=your_client_secret_here
   ```

---

## 📱 Platform Support

### ✅ Web (Browser)
- **All features work** (online and offline)
- PWA installable
- Offline caching via Service Worker
- IndexedDB for local storage

### ✅ Desktop (Electron)
- **All features work** (online and offline)
- Native app experience
- Full offline support
- Better performance than web

### ✅ Android (Capacitor)
- **All features work** (online and offline)
- Native Android app
- Haptic feedback
- Status bar customization
- Offline music caching
- Hardware back button support

### ✅ iOS (Capacitor)
- **All features work** (online and offline)
- Native iOS app
- Haptic feedback
- Status bar customization
- Offline music caching
- Safe area inset handling

---

## 🔄 Offline Mode

### Automatic Features
- ✅ **Automatic caching** of search results
- ✅ **Playlist caching** when viewed online
- ✅ **Track metadata** stored locally
- ✅ **Offline search** in cached tracks
- ✅ **Network detection** and auto-fallback

### How It Works

1. **Online Usage**
   - Search and browse normally
   - Results are automatically cached
   - Playlists are cached when viewed

2. **Going Offline**
   - App automatically detects offline status
   - Searches fallback to cached tracks
   - Playlists load from local storage

3. **Mobile Downloads** (Android/iOS only)
   - Tap "Download" on any track
   - Track is saved for offline playback
   - Access via "Offline Tracks" section

---

## 🚀 Quick Start

### 1. Configure Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Add your API keys to .env
# Edit .env and fill in:
# - VITE_SPOTIFY_CLIENT_ID
# - VITE_SPOTIFY_CLIENT_SECRET
# - VITE_SOUNDCLOUD_CLIENT_ID (optional)
# - VITE_SOUNDCLOUD_CLIENT_SECRET (optional)
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the App
```bash
# For web
npm run build

# For desktop
npm run build:desktop

# For Android
npm run build:android

# For iOS
npm run build:ios
```

### 4. Run the App
```bash
# Development (web)
npm run dev

# Desktop
npm run desktop

# Android (after build)
npm run mobile:android

# iOS (after build)
npm run mobile:ios
```

---

## 🎯 Features by Platform

| Feature | Web | Desktop | Android | iOS |
|---------|-----|---------|---------|-----|
| Spotify Streaming | ✅ | ✅ | ✅ | ✅ |
| YouTube Music | ✅ | ✅ | ✅ | ✅ |
| SoundCloud | ✅ | ✅ | ✅ | ✅ |
| Offline Mode | ✅ | ✅ | ✅ | ✅ |
| PWA Install | ✅ | ❌ | ✅ | ❌ |
| Haptic Feedback | ❌ | ❌ | ✅ | ✅ |
| Download Tracks | ❌ | ✅ | ✅ | ✅ |
| Background Play | ❌ | ✅ | ✅ | ✅ |

---

## 🔧 Troubleshooting

### Music Not Playing
1. Check API keys are set correctly
2. Check you're authenticated with the service
3. Check network connection
4. Try clearing cache and re-authenticating

### Offline Mode Not Working
1. Verify IndexedDB is enabled in browser
2. Check service worker is registered
3. Clear browser cache and reload
4. Check console for errors

### Mobile App Issues
1. Rebuild the app: `npm run build && npx cap sync`
2. Check Capacitor plugins are installed
3. Verify AndroidX is enabled in gradle
4. Check permissions in AndroidManifest.xml

### API Rate Limits
- **Spotify**: 180 requests per minute
- **YouTube**: 10,000 units per day (quota)
- **SoundCloud**: 15,000 requests per minute

---

## 📖 Usage Tips

### Best Practices
1. **Authenticate once** - Credentials are saved locally
2. **Browse online first** - Builds your offline cache
3. **Download favorites** - Save your most-played tracks for offline
4. **Clear cache regularly** - Prevents storage bloat

### Power User Features
- **Cross-platform sync** - Play on web, continue on mobile
- **Unified search** - Search across all platforms at once
- **Smart caching** - Most-played tracks cached automatically
- **Network-aware** - Seamless online/offline transitions

---

## 💡 Need Help?

### Documentation
- Spotify API Docs: https://developer.spotify.com/documentation/web-api
- YouTube API Docs: https://developers.google.com/youtube/v3
- SoundCloud API Docs: https://developers.soundcloud.com/docs/api

### Support
- Check console for error messages
- Verify API keys are correct
- Ensure redirect URIs match exactly
- Check browser console for network errors

---

## 🎉 You're Ready!

Once you've configured your API keys, you can:
- ✅ Stream music from 3 platforms
- ✅ Use offline on any device
- ✅ Download tracks for offline playback (mobile)
- ✅ Enjoy seamless cross-platform experience

**Happy listening! 🎵**
