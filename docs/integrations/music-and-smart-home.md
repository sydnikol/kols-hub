# Music Services and Smart Home Integration

**Last Updated:** November 20, 2025
**Status:** Production Ready
**Total Platforms:** 4 Music Services + Smart Home Control

---

## Table of Contents

1. [Music Platforms Overview](#music-platforms-overview)
2. [Spotify Integration](#spotify-integration)
3. [Alternative Music Services](#alternative-music-services)
4. [SmartThings Smart Home](#smartthings-smart-home)
5. [Setup and Configuration](#setup-and-configuration)

---

## Music Platforms Overview

KOL Hub integrates with multiple music streaming platforms to provide a unified music experience across 200+ million tracks and recordings.

### Platform Comparison

| Platform | Catalog Size | Best For | API Status | Key Features |
|----------|-------------|----------|-----------|--------------|
| **Spotify** | 100M+ tracks | Mainstream music, playlists, discovery | ✅ Active | Web API, Playback SDK, recommendations |
| **YouTube Music** | 50M+ tracks & videos | Music videos, live performances | ✅ Active | Video search, playlists, channel analytics |
| **SoundCloud** | 300M+ tracks | Independent artists, remixes, DJ sets | ✅ Active | Full API, HTML5 widget, direct uploads |
| **Apple Music** | 100M+ tracks | Apple ecosystem integration | ✅ Ready | MusicKit, playlist management |

**Combined Capabilities:** Cross-platform search, unified playlists, mood-based recommendations, track matching across services

---

## Spotify Integration

Spotify is the primary music platform with the most advanced API and discovery features.

### OAuth 2.0 Setup

Spotify uses OAuth 2.0 for secure authentication without storing user credentials.

**Setup Steps:**

1. Register application at https://developer.spotify.com/dashboard
2. Create an app with name "KOL Personal OS"
3. Accept terms and retrieve:
   - Client ID
   - Client Secret
4. Set redirect URIs:
   ```
   http://localhost:5173/oauth/spotify
   https://your-domain.com/oauth/spotify
   ```
5. Store in environment variables:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

**OAuth Flow:**

```
User clicks "Connect Spotify"
    ↓
Redirect to Spotify login
    ↓
User grants permissions
    ↓
Authorization code returned
    ↓
Exchange code for access token
    ↓
Store token in localStorage
    ↓
Use token for API requests
    ↓
Auto-refresh before expiration
```

### Core API Endpoints

**Track Operations:**
- `GET /v1/me/tracks` - Get user's saved tracks
- `POST /v1/me/tracks` - Save track to library
- `DELETE /v1/me/tracks` - Remove from library
- `GET /v1/me/tracks?ids={id}` - Check if user saved track

**Playlist Management:**
- `GET /v1/me/playlists` - Get user's playlists
- `POST /v1/users/{user_id}/playlists` - Create new playlist
- `POST /v1/playlists/{playlist_id}/tracks` - Add tracks to playlist
- `DELETE /v1/playlists/{playlist_id}/tracks` - Remove tracks

**Personalization:**
- `GET /v1/me/top/tracks` - Get user's top tracks (short_term, medium_term, long_term)
- `GET /v1/me/top/artists` - Get user's top artists
- `GET /v1/me/player/recently-played` - Get recently played tracks

**Recommendations:**
- `GET /v1/recommendations` - Get AI-powered recommendations
- `GET /v1/recommendations/available-genre-seeds` - List available genres

### Mood-Based Playlists

Create intelligent playlists based on user mood, energy level, or activity.

**Implementation:**

```typescript
const createMoodPlaylist = async (mood: 'energetic' | 'calm' | 'focus') => {
  const genreMap = {
    energetic: ['edm', 'hip-hop', 'rock', 'dance-pop'],
    calm: ['ambient', 'classical', 'chill', 'sleep'],
    focus: ['lo-fi', 'instrumental', 'electronic', 'indie']
  };

  const recommendations = await spotifyService.getRecommendations({
    seedGenres: genreMap[mood],
    limit: 50,
    targetEnergy: mood === 'energetic' ? 0.8 : mood === 'calm' ? 0.3 : 0.5
  });

  const playlist = await spotifyService.createPlaylist(
    `${mood.charAt(0).toUpperCase() + mood.slice(1)} Mix`
  );

  await spotifyService.addTracksToPlaylist(playlist.id, recommendations);
  
  return playlist;
};
```

### Advanced Features

**Timeline View (ChronoMuse):**
Build a complete music history showing listening patterns over time.

```typescript
const buildMusicTimeline = async () => {
  const timeline = [];

  // Last 4 weeks
  timeline.push({
    period: 'Last 4 weeks',
    tracks: await spotifyService.getTopTracks('short_term', 10),
    source: 'spotify'
  });

  // Last 6 months
  timeline.push({
    period: 'Last 6 months',
    tracks: await spotifyService.getTopTracks('medium_term', 15),
    source: 'spotify'
  });

  // All time
  timeline.push({
    period: 'All time',
    tracks: await spotifyService.getTopTracks('long_term', 20),
    source: 'spotify'
  });

  return timeline;
};
```

**Cross-Platform Search:**
Search across multiple music services simultaneously to find tracks everywhere.

```typescript
const unifiedSearch = async (query: string) => {
  const [spotify, youtube, soundcloud] = await Promise.all([
    spotifyService.searchTracks(query, 10),
    youtubeService.searchVideos(query, 10, { videoCategory: '10' }),
    soundcloudService.searchTracks(query, 10)
  ]);

  return {
    spotify: spotify.map(t => ({ ...t, platform: 'spotify' })),
    youtube: youtube.map(v => ({ ...v, platform: 'youtube' })),
    soundcloud: soundcloud.map(t => ({ ...t, platform: 'soundcloud' })),
    total: spotify.length + youtube.length + soundcloud.length
  };
};
```

### Rate Limiting

Spotify enforces rate limits on API requests:

- **Rate Limit:** 180 requests per minute
- **Handling:** Implement exponential backoff for 429 responses
- **Burst Allowance:** Up to 180 requests in a single minute

```typescript
const withRateLimit = async (fn: () => Promise<any>) => {
  try {
    return await fn();
  } catch (error: any) {
    if (error.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 1;
      await sleep(retryAfter * 1000);
      return await withRateLimit(fn);
    }
    throw error;
  }
};
```

---

## Alternative Music Services

### YouTube Music

**API:** YouTube Data API v3
**Best For:** Music videos, live performances, covers

**Key Features:**
- Video search with music category filter
- Playlist creation and management
- Channel analytics
- Like/favorite tracking
- Upload custom music

**Setup:**

1. Enable YouTube Data API v3 in Google Cloud Console
2. Create OAuth 2.0 credentials
3. Configure redirect URIs:
   ```
   http://localhost:5173/oauth/youtube
   https://your-domain.com/oauth/youtube
   ```

**Common Endpoints:**
- `GET youtube.v3.search` - Search videos (music category only)
- `GET youtube.v3.playlists.list` - List user playlists
- `POST youtube.v3.playlists.insert` - Create playlist
- `GET youtube.v3.videos.list` - Get video details
- `POST youtube.v3.playlistItems.insert` - Add video to playlist

**Usage Example:**

```typescript
const searchMusicVideos = async (query: string) => {
  const response = await youtubeService.searchVideos(query, 20, {
    videoCategory: '10',  // Music category
    type: 'video',
    order: 'relevance'
  });

  return response.map(video => ({
    id: video.id.videoId,
    title: video.snippet.title,
    channel: video.snippet.channelTitle,
    thumbnail: video.snippet.thumbnails.medium.url,
    url: `https://youtube.com/watch?v=${video.id.videoId}`
  }));
};
```

### SoundCloud

**API:** SoundCloud API + HTML5 Widget
**Best For:** Independent artists, remixes, DJ sets, underground music

**Key Features:**
- Full track upload support (anyone can upload)
- Remix discovery
- Timed comments
- Direct artist support
- Free streaming with ads
- 300M+ tracks

**Setup:**

1. Register at https://developers.soundcloud.com
2. Create application credentials
3. Configure redirect URI:
   ```
   http://localhost:5173/soundcloud/callback
   ```

**Authentication:**

SoundCloud uses OAuth 2.0 with client credentials and authorization code flows.

```typescript
const authenticateSoundCloud = async () => {
  const authUrl = new URL('https://soundcloud.com/oauth');
  authUrl.searchParams.append('client_id', SOUNDCLOUD_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', CALLBACK_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'non-expiring');

  window.location.href = authUrl.toString();
};
```

**Key Endpoints:**
- `GET /tracks` - Search tracks
- `GET /users/{user_id}/tracks` - Get user's tracks
- `GET /users/{user_id}/favorites` - Get user's favorites
- `GET /users/{user_id}/followers` - Get user's followers
- `POST /users/{user_id}/tracks` - Upload track (requires write scope)

**Advanced Usage:**

```typescript
const discoverUndergroundMusic = async (genre: string) => {
  const tracks = await soundcloudService.searchTracks(genre, 50);
  
  // Filter by independent artists
  const independent = tracks.filter(track => 
    !track.user.verified_and_monetized
  );

  // Sort by play count (newer tracks have fewer plays)
  const sorted = independent.sort((a, b) => 
    a.playback_count - b.playback_count
  );

  return sorted.slice(0, 20);
};
```

### Apple Music

**API:** MusicKit for Web
**Best For:** Apple ecosystem users, offline sync

**Key Features:**
- Native iOS/macOS integration
- Offline download capability
- iCloud music library sync
- Lossless audio support
- Spatial audio with Dolby Atmos

**Setup:**

1. Create developer account at developer.apple.com
2. Configure MusicKit:
   ```typescript
   import { MusicKit } from 'musickit-js';

   const music = await MusicKit.configure({
     developerToken: 'your_developer_token'
   });
   ```

3. Request user authorization:
   ```typescript
   const authorizeMusic = async () => {
     const authorized = await music.authorize();
     return authorized;
   };
   ```

---

## SmartThings Smart Home

SmartThings provides comprehensive smart home control integrated with health data for intelligent automations.

### Architecture Overview

SmartThings connects to:
- **Lighting:** Samsung, Philips Hue, LIFX, others
- **Temperature:** Thermostats, HVAC systems
- **Security:** Locks, sensors, cameras
- **Appliances:** Refrigerators, ovens, washers
- **Entertainment:** TVs, speakers, soundbars

**Total Device Support:** 200+ device types

### Setup Process

**Step 1: OAuth Configuration**

1. Register at https://smartthings.developer.samsung.com
2. Create a new project/app
3. Set authorization callback URI:
   ```
   http://localhost:5173/oauth/smartthings
   https://your-domain.com/oauth/smartthings
   ```
4. Retrieve Client ID and Client Secret
5. Add to environment:
   ```env
   VITE_SMARTTHINGS_CLIENT_ID=your_client_id
   VITE_SMARTTHINGS_CLIENT_SECRET=your_client_secret
   ```

**Step 2: Connect Devices**

Once authenticated, SmartThings automatically discovers connected devices:

```typescript
const discoverDevices = async () => {
  const devices = await smartThingsService.getDevices();
  
  return {
    lights: devices.filter(d => d.deviceType === 'light'),
    thermostats: devices.filter(d => d.deviceType === 'thermostat'),
    locks: devices.filter(d => d.deviceType === 'lock'),
    sensors: devices.filter(d => d.deviceType === 'sensor'),
    switches: devices.filter(d => d.deviceType === 'switch')
  };
};
```

**Step 3: Create Scenes**

Scenes group multiple devices for coordinated control:

```typescript
const createScene = async (name: string, devices: DeviceAction[]) => {
  return await smartThingsService.createScene({
    name: name,
    actions: devices.map(d => ({
      deviceId: d.id,
      commands: d.commands
    }))
  });
};
```

### Device Control

**Basic Operations:**

```typescript
// Turn light on/off
await smartThingsService.setDeviceCapability(lightId, 'switch', {
  value: 'on'
});

// Set brightness (0-100)
await smartThingsService.setDeviceCapability(lightId, 'switchLevel', {
  value: 75
});

// Set color (HSV format)
await smartThingsService.setDeviceCapability(lightId, 'colorControl', {
  hue: 240,      // Blue
  saturation: 100
});

// Set temperature
await smartThingsService.setDeviceCapability(thermostadId, 'thermostatSetpoint', {
  value: 72
});

// Lock/unlock door
await smartThingsService.setDeviceCapability(lockId, 'lock', {
  value: 'locked'  // or 'unlocked'
});
```

### Health-Aware Automations

SmartThings integrates with health data to trigger intelligent automations based on user state.

**Available Health Triggers:**

1. **Pain Level Changes**
   - Adjust lighting to reduce strain
   - Lower volume on speakers
   - Activate calming scene

2. **Energy Level Drops**
   - Activate rest scene
   - Dim lights
   - Lower temperature slightly
   - Enable do-not-disturb

3. **Anxiety Increases**
   - Activate security features
   - Adjust lighting to calming colors
   - Play ambient sounds
   - Close blinds for privacy

4. **Crisis Event**
   - Lock all doors
   - Activate emergency lighting
   - Send alerts
   - Contact emergency services (optional)

**Implementation:**

```typescript
const createHealthTriggeredAutomation = async () => {
  // Get current health status
  const health = await getHealthData();

  if (health.painLevel > 7) {
    // High pain: activate recovery scene
    await smartThingsService.executeScene('recovery-scene');
    // Reduce eye strain with warm lighting
    await smartThingsService.setDeviceCapability(lightId, 'colorControl', {
      hue: 30,       // Warm orange
      saturation: 50
    });
  }

  if (health.energyLevel < 3) {
    // Very low energy: activate rest mode
    await smartThingsService.executeScene('rest-mode');
    // Lower temperature for better sleep
    await smartThingsService.setDeviceCapability(thermostadId, 'thermostatSetpoint', {
      value: 65
    });
  }

  if (health.stressLevel > 8) {
    // High stress: calming automation
    await smartThingsService.executeScene('calm-environment');
    // Play relaxing ambient sound
    await playAmbientSound('nature-sounds');
    // Reduce brightness gradually
    await smartThingsService.gradualAdjustment(lightId, {
      from: 100,
      to: 20,
      duration: 300  // 5 minutes
    });
  }
};
```

### Pre-Configured Scenes

**Common Scene Examples:**

1. **Morning Routine**
   - Lights on at 30% brightness
   - Thermostat to 72°F
   - Coffee maker activated
   - Morning news briefing

2. **Work Mode**
   - Lights on at 100% brightness
   - Thermostat to 70°F
   - Close blinds partially
   - Mute notifications

3. **Evening Relaxation**
   - Lights at warm color (2700K)
   - Brightness at 50%
   - Thermostat to 68°F
   - Soft background music

4. **Sleep Mode**
   - All lights off
   - Thermostat to 65°F
   - Door locks engaged
   - Security system armed

5. **Movie Time**
   - Lights dimmed to 10%
   - Close all blinds
   - Lower thermostat 2°F
   - Mute doorbell notifications

### Automation Rules

SmartThings supports complex automation rules triggered by various conditions.

**Rule Types:**

```typescript
// Time-based automation
const scheduleAutomation = {
  name: 'Morning Lights',
  trigger: {
    type: 'time',
    time: '06:30',
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
  },
  actions: [
    { device: lightId, command: 'on', level: 50 }
  ]
};

// Sensor-based automation
const sensorAutomation = {
  name: 'Motion-Activated Lights',
  trigger: {
    type: 'device',
    deviceId: motionSensorId,
    attribute: 'motion',
    value: 'active'
  },
  actions: [
    { device: lightId, command: 'on', level: 100 }
  ],
  timeout: 300  // Turn off after 5 minutes of no motion
};

// Health-based automation
const healthAutomation = {
  name: 'High Stress Response',
  trigger: {
    type: 'health',
    metric: 'stress_level',
    operator: '>=',
    value: 8
  },
  actions: [
    { scene: 'calm-environment' },
    { device: speakerId, command: 'play', content: 'ambient-sounds' }
  ]
};
```

### Webhook Patterns

SmartThings sends real-time notifications via webhooks when device states change.

**Webhook Configuration:**

```typescript
const registerWebhook = async (url: string) => {
  const subscription = await smartThingsService.registerSubscription({
    sourceType: 'DEVICE',
    device: {
      ids: ['*']  // Subscribe to all devices
    },
    eventTypes: ['DEVICE_EVENT'],
    webhookUrl: url
  });

  return subscription;
};
```

**Webhook Payload Example:**

```json
{
  "eventId": "abc123",
  "timestamp": "2025-02-26T14:30:00Z",
  "deviceEvent": {
    "deviceId": "device-123",
    "componentId": "main",
    "capability": "switch",
    "attribute": "switch",
    "value": "on",
    "data": {},
    "timestamp": "2025-02-26T14:30:00Z"
  }
}
```

**Webhook Handling:**

```typescript
app.post('/webhook/smartthings', (req, res) => {
  const event = req.body.deviceEvent;
  
  // Log the event
  console.log(`Device ${event.deviceId} changed: ${event.attribute} = ${event.value}`);
  
  // Trigger any dependent automations
  if (event.capability === 'switch' && event.value === 'on') {
    triggerRelatedAutomations(event.deviceId);
  }
  
  res.sendStatus(200);
});
```

---

## Setup and Configuration

### Environment Variables

Add to `.env` file:

```env
# Spotify
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret

# YouTube Music
VITE_YOUTUBE_API_KEY=your_api_key
VITE_YOUTUBE_OAUTH_CLIENT_ID=your_oauth_id

# SoundCloud
VITE_SOUNDCLOUD_CLIENT_ID=your_client_id
VITE_SOUNDCLOUD_CLIENT_SECRET=your_client_secret

# SmartThings
VITE_SMARTTHINGS_CLIENT_ID=your_client_id
VITE_SMARTTHINGS_CLIENT_SECRET=your_client_secret
VITE_SMARTTHINGS_REDIRECT_URI=http://localhost:5173/oauth/smartthings
```

### Service Implementation Files

- `src/services/spotifyService.ts` (750+ lines)
  - OAuth 2.0 implementation
  - Web Playback SDK integration
  - Complete API coverage
  - Recommendation engine

- `src/services/youtubeService.ts` (470+ lines)
  - Video search and playback
  - Playlist management
  - Channel analytics

- `src/services/soundcloudService.ts` (650+ lines)
  - OAuth authentication
  - Track search and discovery
  - User and playlist management

- `src/services/smartThingsService.ts` (958 lines)
  - Device discovery and control
  - Scene management
  - Health-triggered automations
  - Webhook integration

### Testing Integrations

Test each service on the Integrations Status page:

1. Navigate to `/integrations-status`
2. For each service:
   - Click "Connect" or "Test"
   - Verify connection status
   - Review any error messages
3. For Spotify:
   - Test playlist creation
   - Try mood-based playlist generation
   - Verify cross-platform search
4. For SmartThings:
   - Discover devices
   - Test device control
   - Create and execute scenes
   - Monitor webhook events

---

## Summary

This documentation covers:

- **Spotify:** Full OAuth integration, mood-based playlists, advanced recommendations, rate limiting
- **YouTube Music:** Video search, playlist management, channel analytics
- **SoundCloud:** Independent artist discovery, remix finding, community engagement
- **Apple Music:** MusicKit integration, offline sync, quality audio
- **SmartThings:** 200+ device control, health-aware automations, webhook real-time events

All services are production-ready with comprehensive error handling, automatic token refresh, and rate limit compliance.

**For detailed service architecture, refer to:** `docs/integrations/overview.md`

