# Google Sync Integration Setup Guide

This guide will help you set up Google sync integrations for Photos, Calendar, Drive, and Google Home/Hub.

## Features

The Google Sync integration provides:

- **Google Photos**: Sync and import photos for wardrobe management
- **Google Calendar**: Sync events, create reminders, manage schedules
- **Google Drive**: Backup and restore app data
- **Google Home/Hub**: Voice control and smart home integration
- **Unified OAuth**: Single authentication for all Google services
- **Mobile Support**: Works on both web and mobile (Capacitor) platforms

## Prerequisites

1. A Google Cloud Console account
2. Node.js 18+ and npm 9+
3. (Optional) Android Studio for mobile testing

## Step 1: Google Cloud Console Setup

### 1.1 Create a New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "KOL Personal OS" or similar
4. Click "Create"

### 1.2 Enable Required APIs

Enable these APIs for your project:

1. Go to "APIs & Services" → "Library"
2. Search for and enable each:
   - **Google Photos Library API**
   - **Google Calendar API**
   - **Google Drive API**
   - **Google People API** (for user profile)

### 1.3 Create OAuth 2.0 Credentials

#### For Web Application:

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Name: "KOL Personal OS - Web"
5. Add Authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:3000
   https://your-production-domain.com
   ```
6. Add Authorized redirect URIs:
   ```
   http://localhost:5173/auth/google/callback
   http://localhost:3000/auth/google/callback
   https://your-production-domain.com/auth/google/callback
   ```
7. Click "Create"
8. **Save the Client ID and Client Secret**

#### For Android Application (Mobile):

1. Click "Create Credentials" → "OAuth client ID"
2. Choose "Android"
3. Name: "KOL Personal OS - Android"
4. Package name: `com.unified.megaapp`
5. Get SHA-1 certificate fingerprint:
   ```bash
   # For debug builds
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

   # For release builds (use your actual keystore)
   keytool -list -v -keystore /path/to/your/keystore -alias your-alias
   ```
6. Enter the SHA-1 fingerprint
7. Click "Create"

#### For iOS Application (Mobile):

1. Click "Create Credentials" → "OAuth client ID"
2. Choose "iOS"
3. Name: "KOL Personal OS - iOS"
4. Bundle ID: `com.unified.megaapp`
5. Click "Create"

### 1.4 Configure OAuth Consent Screen

1. Go to "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace)
3. Fill in:
   - App name: "KOL Personal OS"
   - User support email: your email
   - Developer contact email: your email
4. Add scopes:
   - `../auth/photoslibrary.readonly`
   - `../auth/calendar`
   - `../auth/drive.file`
   - `../auth/userinfo.profile`
   - `../auth/userinfo.email`
5. Add test users (for testing phase)
6. Save and continue

## Step 2: Configure Environment Variables

### 2.1 Update `.env` File

Edit `C:\Users\Asus User\Desktop\unified-mega-app\.env`:

```env
# Google Services Configuration
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
VITE_GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
VITE_GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_HERE

# Google OAuth Scopes (already configured, no need to change)
VITE_GOOGLE_SCOPES=https://www.googleapis.com/auth/photoslibrary.readonly,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email

# Enable Google Sync
VITE_ENABLE_GOOGLE_SYNC=true
```

### 2.2 Update `.env.development` File

Same configuration for development environment.

### 2.3 Update `.env.production` File (for deployment)

Use your production credentials and domains.

## Step 3: Install Required Dependencies

The app needs the Capacitor Browser plugin for mobile OAuth:

```bash
npm install @capacitor/browser --legacy-peer-deps
```

If you encounter dependency conflicts, use:

```bash
npm install @capacitor/browser --force
```

## Step 4: Update Android Configuration (for Mobile)

### 4.1 Update AndroidManifest.xml

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <application>
    <!-- ... existing configuration ... -->

    <!-- Google OAuth Deep Link -->
    <activity android:name=".MainActivity">
      <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="com.unified.megaapp" android:host="oauth" android:path="/google" />
      </intent-filter>
    </activity>
  </application>
</manifest>
```

### 4.2 Sync Capacitor

```bash
npx cap sync android
```

## Step 5: Update iOS Configuration (for Mobile)

### 5.1 Update Info.plist

Add to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.unified.megaapp</string>
    </array>
    <key>CFBundleURLName</key>
    <string>Google OAuth</string>
  </dict>
</array>
```

### 5.2 Sync Capacitor

```bash
npx cap sync ios
```

## Step 6: Add Route for OAuth Callback

Update `src/App.tsx` to include the OAuth callback route:

```tsx
import GoogleOAuthCallback from './pages/GoogleOAuthCallback';

// In your routes:
<Route path="/auth/google/callback" element={<GoogleOAuthCallback />} />
```

## Usage Examples

### Initialize and Authenticate

```typescript
import { googleSyncService } from './services/googleSyncService';

// Initialize the service
await googleSyncService.initialize();

// Check if authenticated
const isAuth = await googleSyncService.isAuthenticated();

if (!isAuth) {
  // Start OAuth flow
  const result = await googleSyncService.authenticate();

  if (result.success) {
    console.log('Authenticated successfully!');
  } else {
    console.error('Authentication failed:', result.error);
  }
}
```

### Google Photos

```typescript
import { googlePhotosService } from './services/googlePhotosService';

// Connect to Google Photos
const result = await googlePhotosService.connectGooglePhotos();

if (result.success) {
  // Scan for clothing photos
  const clothes = await googlePhotosService.scanPhotosForClothes();

  // Get albums
  const albums = await googlePhotosService.getAlbums();

  // Scan specific album
  const albumItems = await googlePhotosService.scanAlbum('album-id');
}
```

### Google Calendar

```typescript
import { googleCalendarService } from './services/googleCalendarService';

// Connect to Google Calendar
await googleCalendarService.connect();

// Get today's events
const todayEvents = await googleCalendarService.getTodayEvents();

// Get upcoming events
const upcoming = await googleCalendarService.getUpcomingEvents(7); // next 7 days

// Create a medication reminder
await googleCalendarService.createMedicationReminder({
  medicationName: 'Aspirin',
  time: new Date('2025-11-20T08:00:00'),
  dosage: '100mg',
  recurrence: 'daily'
});

// Create a health check-in
await googleCalendarService.createHealthCheckIn({
  title: 'Check Blood Pressure',
  time: new Date('2025-11-20T12:00:00'),
  recurrence: 'daily'
});

// Create an event
await googleCalendarService.createEvent({
  summary: 'Doctor Appointment',
  description: 'Annual checkup',
  location: 'Medical Center',
  start: new Date('2025-11-25T10:00:00'),
  end: new Date('2025-11-25T11:00:00'),
  reminders: [
    { method: 'popup', minutes: 30 },
    { method: 'email', minutes: 1440 } // 1 day before
  ]
});
```

### Google Drive

```typescript
import { uploadToDrive, listDriveFiles, createBackup, restoreBackup } from './utils/googleDrive';

// Upload a file
const file = await uploadToDrive('my-file.txt', 'Hello World', {
  mimeType: 'text/plain'
});

// List files
const files = await listDriveFiles({
  maxResults: 20
});

// Create a backup
const appData = {
  medications: [...],
  events: [...],
  // ... your app data
};
const backup = await createBackup(appData);

// Restore from backup
const restored = await restoreBackup('file-id');
```

### Check Sync Status

```typescript
// Get overall sync status
const status = await googleSyncService.getSyncStatus();
console.log('Photos synced:', status.photos);
console.log('Calendar synced:', status.calendar);
console.log('Drive synced:', status.drive);
console.log('Last synced:', status.lastSynced);
```

### Sign Out

```typescript
// Sign out from all Google services
await googleSyncService.signOut();
```

## Troubleshooting

### Issue: "Popup blocked" error
**Solution**: Make sure popup blockers are disabled for your domain, or use redirect flow instead.

### Issue: "redirect_uri_mismatch" error
**Solution**: Ensure the redirect URI in your code matches exactly what's configured in Google Cloud Console.

### Issue: "Access blocked: This app's request is invalid"
**Solution**: Make sure you've enabled the required APIs in Google Cloud Console.

### Issue: Token expired
**Solution**: The service automatically refreshes tokens. If it fails, sign out and authenticate again.

### Issue: Mobile OAuth not working
**Solution**:
1. Verify the URL scheme is correctly configured in AndroidManifest.xml or Info.plist
2. Make sure `@capacitor/browser` plugin is installed
3. Check that the App plugin can handle deep links

### Issue: CORS errors
**Solution**: CORS is handled by Google. Make sure your domain is added to Authorized JavaScript origins.

## Security Best Practices

1. **Never commit credentials**: Keep `.env` files out of version control
2. **Use environment variables**: Always use `import.meta.env.VITE_*` for credentials
3. **Rotate secrets regularly**: Change client secrets periodically
4. **Limit scopes**: Only request the scopes you actually need
5. **Secure token storage**: Tokens are stored in localStorage (web) or Preferences (mobile)
6. **Implement refresh logic**: Tokens are automatically refreshed before expiration

## Mobile-Specific Notes

### Android
- Deep links use custom URL scheme: `com.unified.megaapp://oauth/google`
- Make sure to add the intent filter in AndroidManifest.xml
- Test on a real device for best results

### iOS
- URL schemes must be registered in Info.plist
- Test on a real device or simulator with network access

## API Limits and Quotas

Be aware of Google API quotas:
- **Google Photos**: 10,000 requests/day
- **Google Calendar**: 1,000,000 requests/day
- **Google Drive**: 1,000,000,000 queries/day

For production apps, request quota increases if needed.

## Next Steps

1. Set up your Google Cloud Console project
2. Configure environment variables
3. Test authentication on web
4. Test authentication on mobile
5. Implement specific features (photos, calendar, drive)
6. Deploy to production

## Support

For issues or questions:
- Check the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
- Review the [Capacitor documentation](https://capacitorjs.com/)
- Check the service files for inline documentation

## Files Modified/Created

### New Services
- `src/services/googleSyncService.ts` - Main sync service with OAuth
- `src/services/googleCalendarService.ts` - Calendar-specific service

### Updated Services
- `src/services/googlePhotosService.ts` - Now uses googleSyncService
- `src/utils/googleDrive.ts` - Now uses googleSyncService

### New Pages
- `src/pages/GoogleOAuthCallback.tsx` - OAuth callback handler

### Configuration
- `.env` - Added Google credentials
- `.env.example` - Added Google configuration template
- `.env.development` - Added Google development settings
- `capacitor.config.ts` - Added Google domains to allowNavigation

### Documentation
- `GOOGLE_SYNC_SETUP.md` - This file
