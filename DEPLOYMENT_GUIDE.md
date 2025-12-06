# 🚀 KOL HUB - Complete Deployment Guide

**End-to-End Deployment for Web, Android, and PWA**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Web Deployment (Netlify)](#web-deployment-netlify)
4. [Android Deployment](#android-deployment)
5. [PWA Configuration](#pwa-configuration)
6. [Production Checklist](#production-checklist)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### **Required Software**

```bash
# Node.js & npm
node --version  # Should be 18+
npm --version   # Should be 9+

# Git
git --version

# Android (for mobile deployment)
java --version  # Should be JDK 17+
```

### **Required Accounts**

- [ ] Netlify account (https://netlify.com)
- [ ] Spotify Developer account
- [ ] SoundCloud Developer account
- [ ] Google Cloud Platform account
- [ ] GitHub account (optional, for CI/CD)

---

## 🌍 Environment Setup

### **1. Clone Repository**

```bash
git clone <your-repository-url>
cd unified-mega-app
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Environment Variables**

Create `.env` file:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# App Configuration
NODE_ENV=production
VITE_APP_NAME=KOL Personal OS
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Music Services
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
VITE_SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
VITE_SOUNDCLOUD_CLIENT_SECRET=your_soundcloud_client_secret

# YouTube
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_YOUTUBE_OAUTH_CLIENT_ID=your_youtube_oauth_client_id

# Google Cloud
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_CLOUD_API_KEY_2=your_secondary_key
VITE_GOOGLE_CLOUD_API_KEY_3=your_tertiary_key
VITE_GEMINI_API_KEY=your_gemini_api_key

# OAuth Redirect URIs - Production
VITE_SPOTIFY_REDIRECT_URI_PROD=https://kolhub.netlify.app/spotify/callback
VITE_SOUNDCLOUD_REDIRECT_URI_PROD=https://kolhub.netlify.app/soundcloud/callback
VITE_YOUTUBE_REDIRECT_URI_PROD=https://kolhub.netlify.app/youtube/callback

# Feature Flags
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_PWA=true
VITE_ENABLE_3D_AVATAR=true
VITE_ENABLE_MUSIC_STREAMING=true
VITE_ENABLE_PLATFORM_SYNC=true
VITE_ENABLE_GOOGLE_SYNC=true
```

### **4. Verify Configuration**

```bash
npm run dev
```

Open http://localhost:5173 and verify app loads correctly.

---

## 🌐 Web Deployment (Netlify)

### **Method 1: Netlify CLI (Recommended)**

#### **Step 1: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

#### **Step 2: Login to Netlify**

```bash
netlify login
```

#### **Step 3: Build for Production**

```bash
npm run build
```

This creates `dist/` folder with optimized production files.

#### **Step 4: Deploy to Netlify**

```bash
# First deployment (creates new site)
netlify deploy

# Follow prompts:
# - Create & configure a new site
# - Team: Select your team
# - Site name: kolhub (or your preferred name)
# - Publish directory: dist

# After verification, deploy to production
netlify deploy --prod
```

#### **Step 5: Configure Netlify**

```bash
# Add environment variables
netlify env:set VITE_SPOTIFY_CLIENT_ID "your_client_id"
netlify env:set VITE_SPOTIFY_CLIENT_SECRET "your_client_secret"
# ... add all other env vars from .env
```

#### **Step 6: Get Deployment URL**

```bash
netlify open:site
```

Your site URL: `https://kolhub.netlify.app`

---

### **Method 2: Netlify Dashboard**

#### **Step 1: Build Locally**

```bash
npm run build
```

#### **Step 2: Manual Deploy**

1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag and drop `dist/` folder
4. Wait for deployment to complete

#### **Step 3: Configure Site**

1. Go to "Site settings"
2. Change site name: `kolhub` or your preferred name
3. Add environment variables in "Build & deploy" → "Environment"
4. Add all variables from `.env`

---

### **Method 3: GitHub Integration (CI/CD)**

#### **Step 1: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### **Step 2: Connect to Netlify**

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18
6. Add environment variables
7. Click "Deploy site"

#### **Step 3: Automatic Deploys**

Every push to `main` branch triggers automatic deployment!

---

## 📱 Android Deployment

### **Prerequisites**

- Android Studio installed
- JDK 17+ configured
- Android SDK 34 installed

### **Step 1: Build Web Assets**

```bash
npm run build
```

### **Step 2: Sync to Android**

```bash
npx cap sync android
```

### **Step 3: Open in Android Studio**

```bash
npx cap open android
```

### **Step 4: Generate Signing Keystore**

```bash
cd android/app

keytool -genkey -v -keystore kolhub-release.keystore -alias kolhub -keyalg RSA -keysize 2048 -validity 10000

# Enter secure password when prompted
# Fill in organization details
```

**Save this keystore and password securely!**

### **Step 5: Configure Signing**

Create `android/keystore.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=kolhub
storeFile=kolhub-release.keystore
```

Add to `android/app/build.gradle`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### **Step 6: Build Release APK**

```bash
cd android
./gradlew assembleRelease
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

### **Step 7: Build App Bundle (for Play Store)**

```bash
./gradlew bundleRelease
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

### **Step 8: Test Release Build**

```bash
# Install on connected device
adb install app/build/outputs/apk/release/app-release.apk

# Or drag and drop APK to emulator
```

---

## 📦 Play Store Deployment

### **Step 1: Prepare Assets**

Create the following:
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (at least 2, various sizes)
- [ ] Short description (80 characters)
- [ ] Full description (4000 characters)
- [ ] Privacy policy URL

### **Step 2: Create Google Play Console Account**

1. Go to https://play.google.com/console
2. Pay $25 one-time registration fee
3. Complete account setup

### **Step 3: Create App**

1. Click "Create app"
2. Fill in app details:
   - **Name:** KOL Hub - Personal OS
   - **Default language:** English
   - **App/Game:** App
   - **Free/Paid:** Free (or Paid)
3. Accept Play Store declarations

### **Step 4: App Content**

1. Fill in content rating questionnaire
2. Add target audience
3. Upload privacy policy
4. Configure data safety section

### **Step 5: Upload App Bundle**

1. Go to "Production" → "Create new release"
2. Upload `app-release.aab`
3. Add release notes
4. Review and rollout

### **Step 6: Review & Publish**

1. Complete all required sections
2. Submit for review
3. Wait for approval (usually 1-3 days)
4. Monitor reviews and crashes

---

## 🔒 Security Configuration

### **1. Configure OAuth Redirect URIs**

Add production URLs to all OAuth providers:

**Spotify:**
```
https://kolhub.netlify.app/spotify/callback
```

**SoundCloud:**
```
https://kolhub.netlify.app/soundcloud/callback
```

**Google:**
```
https://kolhub.netlify.app/google/callback
https://kolhub.netlify.app/youtube/callback
```

**See:** `OAUTH_REDIRECT_URIS.md` for complete list

### **2. Configure CORS**

Ensure your backend APIs allow requests from:
- `https://kolhub.netlify.app`
- `https://kol-personal-os.netlify.app`

### **3. Content Security Policy**

Add to `index.html` or Netlify headers:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.spotify.com https://api.soundcloud.com https://www.googleapis.com;
">
```

---

## ✅ Production Checklist

### **Pre-Deployment**

- [ ] All environment variables configured
- [ ] API credentials valid and working
- [ ] OAuth redirect URIs updated
- [ ] Build succeeds without errors
- [ ] No console errors in production build
- [ ] All features tested locally

### **Web Deployment**

- [ ] Netlify site created
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Netlify)
- [ ] Environment variables set in Netlify
- [ ] Build and deploy successful
- [ ] Site accessible and functional

### **Android Deployment**

- [ ] Release keystore generated and secured
- [ ] Signing configuration complete
- [ ] Release APK/AAB builds successfully
- [ ] App tested on physical device
- [ ] All permissions working
- [ ] OAuth deep links functioning
- [ ] App icon and metadata ready

### **Post-Deployment**

- [ ] Test all OAuth flows in production
- [ ] Verify API integrations working
- [ ] Check error monitoring (Sentry, etc.)
- [ ] Monitor performance metrics
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure backup strategy

---

## 🔍 Troubleshooting

### **Build Failures**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite

# Rebuild
npm run build
```

### **OAuth Not Working in Production**

1. Verify redirect URIs in developer dashboards
2. Check environment variables are set
3. Ensure HTTPS is being used
4. Clear browser cache and cookies
5. Check browser console for errors

### **Android Build Issues**

```bash
# Clean Gradle cache
cd android
./gradlew clean

# Invalidate caches in Android Studio
# File → Invalidate Caches / Restart

# Sync Capacitor
npx cap sync android
```

### **Netlify Deploy Fails**

```bash
# Check build logs
netlify logs

# Test build locally
npm run build

# Verify netlify.toml configuration
```

---

## 📊 Monitoring & Analytics

### **Recommended Tools**

1. **Netlify Analytics** - Built-in traffic analytics
2. **Google Analytics** - User behavior tracking
3. **Sentry** - Error monitoring
4. **Lighthouse** - Performance monitoring
5. **Firebase Crashlytics** - Android crash reporting

---

## 🔄 Continuous Deployment

### **Automated Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

**Deployment complete! Your KOL Hub is now live! 🎉**

*For issues or questions, refer to the documentation or create an issue.*
