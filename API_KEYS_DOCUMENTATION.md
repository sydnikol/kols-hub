# 🔐 Kol's Hub - API Keys & Environment Variables

> **Quick Setup Guide for Netlify & GitHub Secrets**

---

## 📋 NETLIFY ENVIRONMENT VARIABLES

Copy each key-value pair to: **Site Settings → Build & Deploy → Environment Variables**

### App Configuration
```
NODE_ENV=production
VITE_APP_NAME=KOL Personal OS
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

---

### 🎵 SPOTIFY API
```
VITE_SPOTIFY_CLIENT_ID=860927c26ac74e26a65d64f3ce331431
VITE_SPOTIFY_CLIENT_SECRET=61b7c1b2f67c451fa8d2ba6480965a40
VITE_SPOTIFY_REDIRECT_URI_PROD=https://kolhub.netlify.app/spotify/callback
```

**Dashboard:** https://developer.spotify.com/dashboard

---

### 🎧 SOUNDCLOUD API
```
VITE_SOUNDCLOUD_CLIENT_ID=KOWxp0TbDUURmsSbjCmJps06OkFRdMoU
VITE_SOUNDCLOUD_CLIENT_SECRET=ddZywieMpwCj712Q0gHAMs4KfUw66TgA
VITE_SOUNDCLOUD_REDIRECT_URI_PROD=https://kolhub.netlify.app/soundcloud/callback
```

**Dashboard:** https://soundcloud.com/you/apps

---

### 📺 YOUTUBE API
```
VITE_YOUTUBE_API_KEY=AIzaSyCYX4XRr7j2oKC-Xu6qNCMyIX6WF9ep5gY
VITE_YOUTUBE_OAUTH_CLIENT_ID=982711879367-2jcmmge9k858eercf865i2jo1c4v37p8.apps.googleusercontent.com
VITE_YOUTUBE_REDIRECT_URI_PROD=https://kolhub.netlify.app/youtube/callback
```

**Dashboard:** https://console.cloud.google.com/apis/credentials

---

### 🔵 GOOGLE SERVICES
```
VITE_GOOGLE_CLIENT_ID=632151349257-q9jd1j0tt03u1hrd1uc05se1m9rifqke.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VITE_GOOGLE_API_KEY=AIzaSyCki3uazpZKfJSgEESbpMwWtDSoZJO86DE
VITE_GOOGLE_CLOUD_API_KEY_2=AIzaSyCR_nUGGPfCifoTfP-ePfh6K_IGgyBSNHU
VITE_GOOGLE_CLOUD_API_KEY_3=AIzaSyBd2wPiqDwj_DEJzA79NfkFDFOIYycYOBg
```

**Dashboard:** https://console.cloud.google.com/apis/credentials

---

### 🤖 GEMINI AI
```
VITE_GEMINI_API_KEY=AIzaSyDhwNAO5BqqpsRqyGwma97PkkJ6bHmCWr0
```

**Dashboard:** https://aistudio.google.com/apikey

---

### 🎭 READY PLAYER ME (3D Avatar)
```
VITE_READYPLAYER_ME_AVATAR_ID=68e94e474099d80b93c9b714
```

**Dashboard:** https://readyplayer.me/hub

---

### ⚙️ FEATURE FLAGS
```
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_PWA=true
VITE_ENABLE_3D_AVATAR=true
VITE_ENABLE_MUSIC_STREAMING=true
VITE_ENABLE_PLATFORM_SYNC=true
VITE_ENABLE_GOOGLE_SYNC=true
```

---

### 🔗 GOOGLE SCOPES (Single Line)
```
VITE_GOOGLE_SCOPES=https://www.googleapis.com/auth/photoslibrary.readonly,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/fitness.activity.read,https://www.googleapis.com/auth/fitness.body.read,https://www.googleapis.com/auth/fitness.sleep.read,https://www.googleapis.com/auth/fitness.heart_rate.read,https://www.googleapis.com/auth/fitness.nutrition.read,https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/keep.readonly
```

---

## 🔒 GITHUB SECRETS

Add to: **Repository Settings → Secrets and Variables → Actions**

### Required for Builds
| Secret Name | Value |
|-------------|-------|
| `GH_TOKEN` | `${{ secrets.GITHUB_TOKEN }}` (auto) |
| `VITE_SPOTIFY_CLIENT_ID` | `860927c26ac74e26a65d64f3ce331431` |
| `VITE_SPOTIFY_CLIENT_SECRET` | `61b7c1b2f67c451fa8d2ba6480965a40` |
| `VITE_SOUNDCLOUD_CLIENT_ID` | `KOWxp0TbDUURmsSbjCmJps06OkFRdMoU` |
| `VITE_SOUNDCLOUD_CLIENT_SECRET` | `ddZywieMpwCj712Q0gHAMs4KfUw66TgA` |
| `VITE_YOUTUBE_API_KEY` | `AIzaSyCYX4XRr7j2oKC-Xu6qNCMyIX6WF9ep5gY` |
| `VITE_GOOGLE_API_KEY` | `AIzaSyCki3uazpZKfJSgEESbpMwWtDSoZJO86DE` |
| `VITE_GEMINI_API_KEY` | `AIzaSyDhwNAO5BqqpsRqyGwma97PkkJ6bHmCWr0` |

---

## 📱 MOBILE APP CONFIGURATION

### Android (Spotify Dashboard)
| Field | Value |
|-------|-------|
| **Package Name** | `com.unified.megaapp` |
| **SHA-1 Fingerprint** | `E7:B0:A7:20:20:4F:3A:C0:E1:5C:91:09:5E:36:FF:BC:37:9C:1E:C0` |

### iOS (Spotify Dashboard)
| Field | Value |
|-------|-------|
| **Bundle ID** | `com.unified.megaapp` |

---

## 🔗 REDIRECT URIs (Add to All Dashboards)

### Development
```
http://localhost:5173/callback
http://localhost:5173/spotify/callback
http://localhost:5173/soundcloud/callback
http://localhost:5173/youtube/callback
http://localhost:5173/google/callback
```

### Production (Netlify)
```
https://kolhub.netlify.app/callback
https://kolhub.netlify.app/spotify/callback
https://kolhub.netlify.app/soundcloud/callback
https://kolhub.netlify.app/youtube/callback
https://kolhub.netlify.app/google/callback
https://kol-personal-os.netlify.app/callback
```

### Mobile (Deep Links)
```
kolhub://spotify/callback
kolhub://soundcloud/callback
kolhub://youtube/callback
kolhub://google/callback
com.unified.megaapp://callback
```

---

## 📝 QUICK COPY - ALL NETLIFY VARS

```env
NODE_ENV=production
VITE_APP_NAME=KOL Personal OS
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_SPOTIFY_CLIENT_ID=860927c26ac74e26a65d64f3ce331431
VITE_SPOTIFY_CLIENT_SECRET=61b7c1b2f67c451fa8d2ba6480965a40
VITE_SPOTIFY_REDIRECT_URI_PROD=https://kolhub.netlify.app/spotify/callback
VITE_SOUNDCLOUD_CLIENT_ID=KOWxp0TbDUURmsSbjCmJps06OkFRdMoU
VITE_SOUNDCLOUD_CLIENT_SECRET=ddZywieMpwCj712Q0gHAMs4KfUw66TgA
VITE_SOUNDCLOUD_REDIRECT_URI_PROD=https://kolhub.netlify.app/soundcloud/callback
VITE_YOUTUBE_API_KEY=AIzaSyCYX4XRr7j2oKC-Xu6qNCMyIX6WF9ep5gY
VITE_YOUTUBE_OAUTH_CLIENT_ID=982711879367-2jcmmge9k858eercf865i2jo1c4v37p8.apps.googleusercontent.com
VITE_YOUTUBE_REDIRECT_URI_PROD=https://kolhub.netlify.app/youtube/callback
VITE_GOOGLE_CLIENT_ID=632151349257-q9jd1j0tt03u1hrd1uc05se1m9rifqke.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyCki3uazpZKfJSgEESbpMwWtDSoZJO86DE
VITE_GOOGLE_CLOUD_API_KEY_2=AIzaSyCR_nUGGPfCifoTfP-ePfh6K_IGgyBSNHU
VITE_GOOGLE_CLOUD_API_KEY_3=AIzaSyBd2wPiqDwj_DEJzA79NfkFDFOIYycYOBg
VITE_GEMINI_API_KEY=AIzaSyDhwNAO5BqqpsRqyGwma97PkkJ6bHmCWr0
VITE_READYPLAYER_ME_AVATAR_ID=68e94e474099d80b93c9b714
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_PWA=true
VITE_ENABLE_3D_AVATAR=true
VITE_ENABLE_MUSIC_STREAMING=true
VITE_ENABLE_PLATFORM_SYNC=true
VITE_ENABLE_GOOGLE_SYNC=true
VITE_GOOGLE_SCOPES=https://www.googleapis.com/auth/photoslibrary.readonly,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/fitness.activity.read,https://www.googleapis.com/auth/fitness.body.read,https://www.googleapis.com/auth/fitness.sleep.read,https://www.googleapis.com/auth/fitness.heart_rate.read,https://www.googleapis.com/auth/fitness.nutrition.read,https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/keep.readonly
```

---

## 🔗 API DASHBOARD LINKS

| Service | Dashboard URL |
|---------|---------------|
| **Spotify** | https://developer.spotify.com/dashboard |
| **SoundCloud** | https://soundcloud.com/you/apps |
| **Google Cloud** | https://console.cloud.google.com/apis/credentials |
| **Google AI Studio** | https://aistudio.google.com/apikey |
| **Ready Player Me** | https://readyplayer.me/hub |
| **Netlify** | https://app.netlify.com/sites/kols-hub/settings/env |
| **GitHub Secrets** | https://github.com/sydnikol/kols-hub/settings/secrets/actions |

---

**Last Updated:** 2026-02-06
**Version:** 10.6.0
