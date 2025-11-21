# Google Services - Developer Quick Reference

## Quick Start

```typescript
import { googleSyncService } from './googleSyncService';
import { googlePhotosService } from './googlePhotosService';
import { googleCalendarService } from './googleCalendarService';
import { uploadToDrive, createBackup } from '../utils/googleDrive';

// 1. Initialize (optional, done automatically on first use)
await googleSyncService.initialize();

// 2. Authenticate
const result = await googleSyncService.authenticate();
if (result.success) {
  console.log('Authenticated!');
}

// 3. Use any service
const photos = await googlePhotosService.scanPhotosForClothes();
const events = await googleCalendarService.getTodayEvents();
await createBackup({ myData: 'value' });
```

## Service Overview

### `googleSyncService` - Core Authentication & API Access
Main service that handles OAuth and provides low-level API access.

### `googlePhotosService` - Photos Management
Specialized service for Google Photos with wardrobe features.

### `googleCalendarService` - Calendar & Events
Specialized service for Google Calendar with health features.

### `googleDrive` - File Storage
Utility functions for Google Drive backup/restore.

## Common Patterns

### Check if Authenticated

```typescript
const isAuth = await googleSyncService.isAuthenticated();
if (!isAuth) {
  // Prompt user to authenticate
}
```

### Handle Authentication Result

```typescript
const result = await googleSyncService.authenticate();

if (result.success) {
  console.log('Success! Tokens:', result.tokens);
  // Proceed with API calls
} else {
  console.error('Failed:', result.error);
  // Show error to user
}
```

### Sign Out

```typescript
await googleSyncService.signOut();
// User must authenticate again
```

## Google Photos Examples

### Basic Photo Sync

```typescript
// Connect (if not already)
const connResult = await googlePhotosService.connectGooglePhotos();

// Scan for clothing photos
const clothes = await googlePhotosService.scanPhotosForClothes();

console.log(`Found ${clothes.length} clothing items`);
```

### Album-based Sync

```typescript
// Get list of albums
const albums = await googlePhotosService.getAlbums();

// Scan a specific album
const albumItems = await googlePhotosService.scanAlbum(albums[0].id);
```

### Advanced Filtering

```typescript
// Use low-level API for custom filters
const photos = await googleSyncService.syncPhotos({
  maxResults: 50,
  filters: {
    contentCategories: ['FASHION', 'PEOPLE'],
    dateRange: {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31')
    }
  }
});
```

## Google Calendar Examples

### Get Today's Events

```typescript
const events = await googleCalendarService.getTodayEvents();

events.forEach(event => {
  console.log(`${event.start}: ${event.summary}`);
});
```

### Get Upcoming Events

```typescript
// Next 7 days
const upcoming = await googleCalendarService.getUpcomingEvents(7);

// Next 30 days
const month = await googleCalendarService.getUpcomingEvents(30);
```

### Create Simple Event

```typescript
await googleCalendarService.createEvent({
  summary: 'Team Meeting',
  description: 'Weekly sync',
  location: 'Conference Room',
  start: new Date('2025-11-25T10:00:00'),
  end: new Date('2025-11-25T11:00:00'),
  reminders: [
    { method: 'popup', minutes: 15 }
  ]
});
```

### Create Medication Reminder

```typescript
await googleCalendarService.createMedicationReminder({
  medicationName: 'Aspirin',
  time: new Date('2025-11-20T08:00:00'),
  dosage: '100mg',
  recurrence: 'daily' // 'daily', 'weekly', or 'monthly'
});
```

### Create Medication Schedule

```typescript
const medications = [
  {
    name: 'Aspirin',
    times: [
      new Date('2025-11-20T08:00:00'),
      new Date('2025-11-20T20:00:00')
    ],
    dosage: '100mg',
    recurrence: 'daily'
  },
  {
    name: 'Vitamin D',
    times: [new Date('2025-11-20T09:00:00')],
    dosage: '2000 IU',
    recurrence: 'daily'
  }
];

const events = await googleCalendarService.createMedicationSchedule(medications);
console.log(`Created ${events.length} medication reminders`);
```

### Create Health Check-in

```typescript
await googleCalendarService.createHealthCheckIn({
  title: 'Check Blood Pressure',
  time: new Date('2025-11-20T12:00:00'),
  description: 'Take BP reading and log in app',
  recurrence: 'daily'
});
```

### Create Passive Income Review

```typescript
await googleCalendarService.createPassiveIncomeReview({
  time: new Date('2025-11-20T15:00:00'),
  recurrence: 'weekly'
});
```

### Search Events

```typescript
const results = await googleCalendarService.searchEvents('doctor');
// Returns all events with "doctor" in title, description, or location
```

### Batch Create Events

```typescript
const events = [
  { summary: 'Event 1', start: new Date(), end: new Date() },
  { summary: 'Event 2', start: new Date(), end: new Date() },
  // ... more events
];

const created = await googleCalendarService.batchCreateEvents(events);
console.log(`Created ${created.length} events`);
```

## Google Drive Examples

### Upload File

```typescript
// Upload text file
await uploadToDrive('notes.txt', 'Hello World', {
  mimeType: 'text/plain'
});

// Upload JSON
await uploadToDrive('data.json', JSON.stringify({ key: 'value' }), {
  mimeType: 'application/json'
});

// Upload to specific folder
await uploadToDrive('file.txt', 'content', {
  mimeType: 'text/plain',
  folderId: 'folder-id-here'
});
```

### List Files

```typescript
// List all files
const files = await listDriveFiles();

// List files in folder
const folderFiles = await listDriveFiles({
  folderId: 'folder-id'
});

// Search by query
const searchResults = await listDriveFiles({
  query: "name contains 'backup'"
});
```

### Download File

```typescript
const blob = await downloadFromDrive('file-id');

// Convert to text
const text = await blob.text();

// Convert to JSON
const json = JSON.parse(await blob.text());
```

### Create Backup

```typescript
const appData = {
  medications: [...],
  events: [...],
  settings: {...}
};

const backup = await createBackup(appData);
console.log('Backup created:', backup.id);

// Custom filename
const backup2 = await createBackup(appData, 'my-backup-2025-11-20.json');
```

### Restore Backup

```typescript
const data = await restoreBackup('backup-file-id');

// Use the restored data
console.log('Medications:', data.medications);
console.log('Events:', data.events);
```

## Low-Level API Access

For advanced use cases, use `googleSyncService` directly:

### Custom API Request

```typescript
const token = await googleSyncService.getAccessToken();

const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Sync Status

```typescript
const status = await googleSyncService.getSyncStatus();

console.log('Photos synced:', status.photos);
console.log('Calendar synced:', status.calendar);
console.log('Drive synced:', status.drive);
console.log('Last synced:', status.lastSynced);
```

## Error Handling

All methods can throw errors. Always use try-catch:

```typescript
try {
  const result = await googleSyncService.authenticate();

  if (result.success) {
    // Success case
    const photos = await googlePhotosService.scanPhotosForClothes();
  } else {
    // OAuth failed but no exception
    console.error('Auth failed:', result.error);
  }
} catch (error) {
  // API error or exception
  console.error('Error:', error);

  if (error.message.includes('Not authenticated')) {
    // Prompt user to authenticate
  } else if (error.message.includes('quota')) {
    // API quota exceeded
  } else {
    // Other error
  }
}
```

## Platform Detection

Services automatically detect platform:

```typescript
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  // Mobile: Uses Capacitor Browser + deep links
  console.log('Running on mobile');
} else {
  // Web: Uses popup window
  console.log('Running on web');
}
```

## Token Lifecycle

### Token Storage
- **Web**: `localStorage.getItem('google_tokens')`
- **Mobile**: `Preferences.get({ key: 'google_tokens' })`

### Token Refresh
Automatic before API calls:

```typescript
// This automatically refreshes if needed
const token = await googleSyncService.getAccessToken();
```

### Token Expiration
Tokens expire after ~1 hour but are automatically refreshed using the refresh token.

### Token Revocation

```typescript
// Revoke on Google's servers and clear local storage
await googleSyncService.signOut();
```

## React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { googlePhotosService } from '../services/googlePhotosService';
import { googleCalendarService } from '../services/googleCalendarService';

const GoogleSyncComponent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = await googlePhotosService.isConnected();
    setIsConnected(connected);

    if (connected) {
      loadData();
    }
  };

  const handleConnect = async () => {
    const result = await googlePhotosService.connectGooglePhotos();

    if (result.success) {
      setIsConnected(true);
      loadData();
    } else {
      alert(`Connection failed: ${result.error}`);
    }
  };

  const loadData = async () => {
    try {
      const [photosData, eventsData] = await Promise.all([
        googlePhotosService.scanPhotosForClothes(),
        googleCalendarService.getTodayEvents()
      ]);

      setPhotos(photosData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnect}>
          Connect to Google
        </button>
      ) : (
        <div>
          <h2>Photos: {photos.length}</h2>
          <h2>Events: {events.length}</h2>
          <button onClick={loadData}>Refresh</button>
        </div>
      )}
    </div>
  );
};
```

## Testing

### Mock for Development

```typescript
// In development, you can mock the services
const MOCK_MODE = import.meta.env.DEV;

if (MOCK_MODE) {
  // Return mock data
  return {
    success: true,
    tokens: { /* mock tokens */ }
  };
} else {
  // Real API call
  return await googleSyncService.authenticate();
}
```

### Check Environment

```typescript
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId || clientId === 'your_google_client_id_here') {
  console.error('Google Client ID not configured!');
  // Show setup instructions
}
```

## Best Practices

1. **Initialize once**: Call `initialize()` at app startup
2. **Check authentication**: Always check `isAuthenticated()` before API calls
3. **Handle errors**: Wrap API calls in try-catch
4. **Batch operations**: Use batch methods when creating multiple items
5. **Monitor quotas**: Be aware of API limits
6. **Cache data**: Store API responses locally to reduce calls
7. **Show progress**: Display loading states during sync
8. **Handle offline**: Check for network before syncing

## Debugging

### Enable Console Logs

```typescript
// All services log errors to console
console.log('Checking console for errors...');
```

### Check Token Status

```typescript
const isAuth = await googleSyncService.isAuthenticated();
const token = await googleSyncService.getAccessToken();

console.log('Authenticated:', isAuth);
console.log('Token:', token ? 'Present' : 'Missing');
```

### Check Sync Status

```typescript
const status = await googleSyncService.getSyncStatus();
console.log('Sync status:', status);
```

### Test OAuth Flow

```typescript
// Force re-authentication
await googleSyncService.signOut();
const result = await googleSyncService.authenticate();
console.log('Auth result:', result);
```

## Common Issues

### "Not authenticated"
**Solution**: Call `authenticate()` first

### "Token expired"
**Solution**: Should auto-refresh. If not, sign out and authenticate again

### "Popup blocked"
**Solution**: Allow popups for your domain

### "redirect_uri_mismatch"
**Solution**: Check Google Console redirect URI matches your code

### Mobile OAuth not working
**Solution**: Check URL scheme configuration and deep link setup

## Resources

- Setup Guide: `GOOGLE_SYNC_SETUP.md`
- Changes Summary: `GOOGLE_SYNC_CHANGES.md`
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Capacitor: https://capacitorjs.com/
