# Environment Configuration Guide

Complete setup guide for configuring environment variables, API keys, and authentication for Kol's Hub.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [API Keys Configuration](#api-keys-configuration)
3. [Auth0 Setup](#auth0-setup)
4. [OAuth Redirect URIs](#oauth-redirect-uris)
5. [Netlify Configuration](#netlify-configuration)
6. [GitHub Secrets](#github-secrets)
7. [Local Development Setup](#local-development-setup)

---

## Environment Variables

### Creating the .env File

Create a `.env` file in your project root with the following variables:

```env
# App Configuration
NODE_ENV=production
VITE_APP_NAME=KOL Personal OS
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Anthropic AI (Claude)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Spotify
VITE_SPOTIFY_CLIENT_ID=860927c26ac74e26a65d64f3ce331431
VITE_SPOTIFY_CLIENT_SECRET=61b7c1b2f67c451fa8d2ba6480965a40
VITE_SPOTIFY_REDIRECT_URI_DEV=http://localhost:5173/spotify/callback
VITE_SPOTIFY_REDIRECT_URI_PROD=https://kolhub.netlify.app/spotify/callback

# SoundCloud
VITE_SOUNDCLOUD_CLIENT_ID=KOWxp0TbDUURmsSbjCmJps06OkFRdMoU
VITE_SOUNDCLOUD_CLIENT_SECRET=ddZywieMpwCj712Q0gHAMs4KfUw66TgA
VITE_SOUNDCLOUD_REDIRECT_URI_DEV=http://localhost:5173/soundcloud/callback
VITE_SOUNDCLOUD_REDIRECT_URI_PROD=https://kolhub.netlify.app/soundcloud/callback

# YouTube
VITE_YOUTUBE_API_KEY=AIzaSyCYX4XRr7j2oKC-Xu6qNCMyIX6WF9ep5gY
VITE_YOUTUBE_OAUTH_CLIENT_ID=982711879367-2jcmmge9k858eercf865i2jo1c4v37p8.apps.googleusercontent.com
VITE_YOUTUBE_REDIRECT_URI_DEV=http://localhost:5173/youtube/callback
VITE_YOUTUBE_REDIRECT_URI_PROD=https://kolhub.netlify.app/youtube/callback

# Google Cloud Platform
VITE_GOOGLE_CLIENT_ID=632151349257-q9jd1j0tt03u1hrd1uc05se1m9rifqke.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VITE_GOOGLE_API_KEY=AIzaSyCki3uazpZKfJSgEESbpMwWtDSoZJO86DE
VITE_GOOGLE_CLOUD_API_KEY_2=AIzaSyCR_nUGGPfCifoTfP-ePfh6K_IGgyBSNHU
VITE_GOOGLE_CLOUD_API_KEY_3=AIzaSyBd2wPiqDwj_DEJzA79NfkFDFOIYycYOBg

# Gemini AI
VITE_GEMINI_API_KEY=AIzaSyDhwNAO5BqqpsRqyGwma97PkkJ6bHmCWr0

# Google Scopes (Single Line)
VITE_GOOGLE_SCOPES=https://www.googleapis.com/auth/photoslibrary.readonly,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/fitness.activity.read,https://www.googleapis.com/auth/fitness.body.read,https://www.googleapis.com/auth/fitness.sleep.read,https://www.googleapis.com/auth/fitness.heart_rate.read,https://www.googleapis.com/auth/fitness.nutrition.read,https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/keep.readonly

# Auth0
VITE_AUTH0_DOMAIN=dev-YOUR-TENANT.us.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_AUTH0_AUDIENCE=https://api.kolhub.app

# ReadyPlayerMe Avatar
VITE_READYPLAYER_ME_AVATAR_ID=68e94e474099d80b93c9b714

# Feature Flags
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_PWA=true
VITE_ENABLE_3D_AVATAR=true
VITE_ENABLE_MUSIC_STREAMING=true
VITE_ENABLE_PLATFORM_SYNC=true
VITE_ENABLE_GOOGLE_SYNC=true
```

### Security Note

Add `.env` to your `.gitignore` file to prevent committing sensitive credentials:

```
.env
.env.local
.env.*.local
```

---

## API Keys Configuration

### Anthropic (Claude AI)

1. Go to https://console.anthropic.com/
2. Create a new API key
3. Copy the key to `VITE_ANTHROPIC_API_KEY`

**Used for:** AI-powered content generation and analysis

---

### Spotify

1. Go to https://developer.spotify.com/dashboard
2. Create a new application
3. Copy **Client ID** to `VITE_SPOTIFY_CLIENT_ID`
4. Copy **Client Secret** to `VITE_SPOTIFY_CLIENT_SECRET`
5. Add Redirect URIs (see OAuth section below)

**Used for:** Music streaming, playlists, recommendations

---

### SoundCloud

1. Go to https://soundcloud.com/you/apps
2. Register your application
3. Copy **Client ID** to `VITE_SOUNDCLOUD_CLIENT_ID`
4. Copy **Client Secret** to `VITE_SOUNDCLOUD_CLIENT_SECRET`
5. Add Redirect URIs (see OAuth section below)

**Used for:** Independent music discovery, DJ mixes

---

### YouTube

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials (Web application)
5. Copy **API Key** to `VITE_YOUTUBE_API_KEY`
6. Copy **Client ID** to `VITE_YOUTUBE_OAUTH_CLIENT_ID`
7. Add Redirect URIs (see OAuth section below)

**Used for:** Video search, music videos, YouTube integrations

---

### Google Cloud Platform

1. Go to https://console.cloud.google.com
2. Enable these APIs:
   - Google Maps API
   - Google Translate API
   - Google Vision API
   - Google Natural Language API
   - Google Fit API
   - Gmail API
   - Google Calendar API

3. Create API Keys:
   - Primary: Maps, Places, Geocoding → `VITE_GOOGLE_API_KEY`
   - Secondary: Translate, Language → `VITE_GOOGLE_CLOUD_API_KEY_2`
   - Tertiary: Vision, NLP, Sentiment → `VITE_GOOGLE_CLOUD_API_KEY_3`

4. Create OAuth 2.0 credentials:
   - Client ID → `VITE_GOOGLE_CLIENT_ID`
   - Client Secret → `VITE_GOOGLE_CLIENT_SECRET`

**Used for:** Location services, travel, maps, calendar, photos, email, fitness

---

### Gemini AI

1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Copy the key to `VITE_GEMINI_API_KEY`

**Used for:** Content generation, recipe ideas, workout plans, creative suggestions

---

### ReadyPlayerMe

1. Go to https://readyplayer.me/hub
2. Create or select your avatar
3. Copy **Avatar ID** to `VITE_READYPLAYER_ME_AVATAR_ID`

**Used for:** 3D avatar customization and visualization

---

## Auth0 Setup

### Step 1: Create Auth0 Account

1. Go to https://auth0.com
2. Click "Sign Up"
3. Choose sign-up method (email, GitHub, Google, or Microsoft)
4. Verify email
5. Select tenant region (US recommended)

### Step 2: Create Application

1. Go to https://manage.auth0.com/dashboard
2. Click "Applications" in left sidebar
3. Click "Create Application"
4. Fill in:
   - Name: `Kol's Hub`
   - Type: **Single Page Application**
5. Click "Create"

### Step 3: Copy Credentials

In the Settings tab, copy:
- **Domain** → `VITE_AUTH0_DOMAIN`
- **Client ID** → `VITE_AUTH0_CLIENT_ID`
- **Client Secret** → Keep private (not needed in .env)

### Step 4: Configure URIs

Still in Settings tab, scroll to Application URIs and add:

**Allowed Callback URLs:**
```
http://localhost:5173/auth/callback
http://localhost:5173/callback
https://kolhub.netlify.app/auth/callback
https://kolhub.netlify.app/callback
https://kol-personal-os.netlify.app/auth/callback
https://kol-personal-os.netlify.app/callback
kolhub://auth/callback
kolhub://callback
com.unified.megaapp://auth/callback
com.unified.megaapp://callback
```

**Allowed Logout URLs:**
```
http://localhost:5173
https://kolhub.netlify.app
https://kol-personal-os.netlify.app
kolhub://logout
com.unified.megaapp://logout
```

**Allowed Web Origins:**
```
http://localhost:5173
https://kolhub.netlify.app
https://kol-personal-os.netlify.app
```

### Step 5: Configure Grant Types

In Advanced Settings → Grant Types, enable:
- Authorization Code
- Refresh Token
- Implicit (optional, for legacy)

---

## OAuth Redirect URIs

### Development (localhost:5173)

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

### Configuration Instructions

For each OAuth provider:

1. **Spotify Developer Dashboard:**
   - Go to your app settings
   - Add all redirect URIs to the Redirect URIs field

2. **SoundCloud Developer Dashboard:**
   - Go to your app settings
   - Add all redirect URIs to the Redirect URIs field

3. **Google Cloud Console:**
   - Go to Credentials
   - Select your OAuth Client ID
   - Add all URIs to Authorized redirect URIs

4. **Auth0:**
   - See Auth0 Setup section above

---

## Netlify Configuration

### Step 1: Create Netlify Site

1. Go to https://app.netlify.com
2. Click "Add new site"
3. Choose "Import an existing project" → "GitHub"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

### Step 2: Add Environment Variables

1. Go to Site settings → Build & deploy → Environment
2. Add all variables from `.env` file
3. Click "Save"

### Step 3: Configure Domain

1. Go to Domain settings
2. Add custom domain (optional)
3. Configure DNS if using custom domain

### Step 4: Enable Auto-Deploy

GitHub integration automatically deploys on:
- Push to `main` branch
- Pull requests (creates preview)

---

## GitHub Secrets

### Step 1: Add Build Secrets

1. Go to Repository Settings
2. Click Secrets and variables → Actions
3. Click "New repository secret"

### Step 2: Required Secrets

| Secret Name | Value |
|---|---|
| `VITE_SPOTIFY_CLIENT_ID` | Your Spotify Client ID |
| `VITE_SPOTIFY_CLIENT_SECRET` | Your Spotify Client Secret |
| `VITE_SOUNDCLOUD_CLIENT_ID` | Your SoundCloud Client ID |
| `VITE_SOUNDCLOUD_CLIENT_SECRET` | Your SoundCloud Client Secret |
| `VITE_YOUTUBE_API_KEY` | Your YouTube API Key |
| `VITE_GOOGLE_API_KEY` | Your Google API Key |
| `VITE_GEMINI_API_KEY` | Your Gemini API Key |
| `VITE_AUTH0_DOMAIN` | Your Auth0 Domain |
| `VITE_AUTH0_CLIENT_ID` | Your Auth0 Client ID |
| `NETLIFY_AUTH_TOKEN` | Your Netlify Auth Token |
| `NETLIFY_SITE_ID` | Your Netlify Site ID |

### Step 3: Get Netlify Tokens

1. Go to https://app.netlify.com/user/applications
2. Click "New access token" → generate token
3. Copy to `NETLIFY_AUTH_TOKEN`

For `NETLIFY_SITE_ID`:
1. Go to your site settings
2. Look for "Site ID" in general settings

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd kols-hub-merge
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create .env File

```bash
cp .env.example .env
# Edit .env with your API keys
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Output:**
```
VITE v6.0.11 ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

### Step 5: Test OAuth Flows

1. Open http://localhost:5173
2. Click "Connect Spotify"
3. You should be redirected to Spotify login
4. After authentication, should return to http://localhost:5173/spotify/callback
5. Repeat for SoundCloud, YouTube, Google

---

## Troubleshooting

### OAuth Errors: "Invalid redirect URI"

**Solution:**
1. Verify redirect URI is configured in provider dashboard
2. Check URI matches exactly (including protocol and trailing slash)
3. For localhost, make sure development URIs are added
4. For production, make sure Netlify URLs are added

### Environment Variables Not Loading

**Solution:**
1. Make sure .env file exists in project root
2. Variable names must start with `VITE_` for Vite
3. After editing .env, restart dev server
4. Check Netlify has all variables set

### Auth0 Callback Fails

**Solution:**
1. Verify Allowed Callback URLs include your URL
2. Check Allowed Web Origins is configured
3. Clear browser cookies and cache
4. Test with incognito window

### API Key Errors

**Solution:**
1. Verify API key is correct and not revoked
2. Check key has required permissions/scopes enabled
3. For Anthropic, make sure key starts with `sk-ant-`
4. For Google, verify APIs are enabled in Cloud Console

---

## Summary Checklist

- [ ] Created .env file with all variables
- [ ] Added .env to .gitignore
- [ ] Configured Anthropic API key
- [ ] Configured Spotify credentials
- [ ] Configured SoundCloud credentials
- [ ] Configured YouTube credentials
- [ ] Configured Google Cloud credentials
- [ ] Configured Gemini API key
- [ ] Created Auth0 application
- [ ] Added Auth0 credentials to .env
- [ ] Configured OAuth redirect URIs in all providers
- [ ] Created Netlify site
- [ ] Added environment variables to Netlify
- [ ] Added GitHub secrets
- [ ] Tested OAuth flows locally
- [ ] Deployed to Netlify and tested

---

**Last Updated:** February 26, 2026
**Version:** 1.0.0
