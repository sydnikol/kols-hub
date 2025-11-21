# Mobile Permissions Setup Guide

This guide explains how to configure permissions for phone contacts, calls, and SMS on iOS and Android.

## iOS Configuration

### 1. Update Info.plist

Add the following permission descriptions to `ios/App/App/Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Existing keys... -->

    <!-- Contacts Permission -->
    <key>NSContactsUsageDescription</key>
    <string>We need access to your contacts to help you manage your care team and emergency contacts. Your contacts are stored locally and never uploaded to servers.</string>

    <!-- Optional: If you want to add new contacts -->
    <key>NSContactsAddUsageDescription</key>
    <string>This allows you to add new care team members to your device contacts.</string>

</dict>
</plist>
```

### 2. Build Settings

No additional build settings required for basic contact access.

### 3. Testing on iOS

1. Build the app: `npm run build:ios`
2. Open in Xcode: `npx cap open ios`
3. Run on simulator or device
4. When prompted, grant contacts permission
5. Test contact import and calling features

## Android Configuration

### 1. Update AndroidManifest.xml

Add the following permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.kol.megaapp">

    <!-- Contact Permissions -->
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />

    <!-- Call Permission (for direct calling) -->
    <uses-permission android:name="android.permission.CALL_PHONE" />

    <!-- SMS Permission (optional - we use intent which doesn't need permission) -->
    <!-- <uses-permission android:name="android.permission.SEND_SMS" /> -->

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <!-- Activity and other configurations... -->

    </application>

</manifest>
```

### 2. Runtime Permissions

Android 6.0+ requires runtime permission requests, which are handled automatically by the Capacitor Contacts plugin.

### 3. Testing on Android

1. Build the app: `npm run build:android`
2. Open in Android Studio: `npx cap open android`
3. Run on emulator or device
4. When prompted, grant contacts permission
5. Test contact import and calling features

## Permission Descriptions

### Why We Need Each Permission

#### READ_CONTACTS (Android) / NSContactsUsageDescription (iOS)
- **Purpose**: Access phone contacts to import into care team
- **User Benefit**: Quick setup of care team with existing contacts
- **Privacy**: Contacts stored locally, never uploaded

#### WRITE_CONTACTS (Android) / NSContactsAddUsageDescription (iOS)
- **Purpose**: Optionally add care team members to device contacts
- **User Benefit**: Keep contacts in sync
- **Note**: This is optional for current implementation

#### CALL_PHONE (Android)
- **Purpose**: Make phone calls directly from app
- **User Benefit**: One-tap calling for emergencies
- **Note**: iOS doesn't need this permission for tel: URLs

## Permission Request Flow

### First Time User Experience

1. User opens Phone Contacts page
2. App checks permission status
3. If not granted, shows PermissionHandler component:
   - Explains why permission is needed
   - Shows privacy notice
   - Provides "Grant Permission" button
4. User taps "Grant Permission"
5. System permission dialog appears
6. If user grants: Contacts load automatically
7. If user denies: Shows instructions to enable in Settings

### Permission States

- **Granted**: Full functionality available
- **Denied**: Shows instructions to enable in Settings
- **Web Platform**: Shows fallback message (manual entry)

## Manual Permission Grant

If users initially deny permission and later want to enable:

### iOS
1. Open **Settings** app
2. Scroll to **KOL** (or your app name)
3. Tap **Contacts**
4. Enable **Allow Access**

### Android
1. Open **Settings** app
2. Tap **Apps** or **Applications**
3. Find and tap **KOL** (or your app name)
4. Tap **Permissions**
5. Tap **Contacts**
6. Select **Allow**

## Privacy & Security Best Practices

### What We Do
- Store contacts in local IndexedDB
- Never upload contacts to servers
- Request minimum permissions needed
- Clear permission purpose explanations
- Allow users to revoke access anytime

### What We Don't Do
- Upload contacts to cloud
- Share contacts with third parties
- Use contacts for marketing
- Access contacts in background

## Testing Checklist

### iOS Testing
- [ ] Info.plist updated with NSContactsUsageDescription
- [ ] App builds without errors
- [ ] Permission prompt appears on first access
- [ ] Permission denial shows correct instructions
- [ ] Settings deep-link works (if implemented)
- [ ] Contacts load after permission granted
- [ ] Call/SMS functionality works

### Android Testing
- [ ] AndroidManifest.xml updated with permissions
- [ ] App builds without errors
- [ ] Permission prompt appears on first access
- [ ] Permission denial shows correct instructions
- [ ] Settings navigation instructions clear
- [ ] Contacts load after permission granted
- [ ] Call/SMS functionality works

## Troubleshooting

### Permission Not Requested
- **iOS**: Verify Info.plist includes NSContactsUsageDescription
- **Android**: Verify AndroidManifest.xml includes READ_CONTACTS permission
- **Both**: Check that you're testing on device/emulator (not web)

### Contacts Not Loading
- Verify permission was granted in device settings
- Check console logs for errors
- Ensure Capacitor plugin installed: `npm ls @capacitor-community/contacts`
- Try rebuilding: `npm run mobile:sync`

### Calls Not Working
- **Android**: Verify CALL_PHONE permission in manifest
- **iOS**: Check that phone number format is correct (tel: URL)
- **Both**: Test on physical device (emulators may not support calling)

### Permission Revoked
- If user revokes permission, app will show PermissionHandler again
- User must re-grant permission in Settings
- App will detect and update automatically when permission granted

## Future Enhancements

- [ ] Background contact sync
- [ ] Contact photo support
- [ ] Contact groups
- [ ] Contact sharing between users
- [ ] Automatic contact backup
- [ ] Contact deduplication

## Support

For Capacitor Contacts plugin issues:
- [Plugin Documentation](https://github.com/capacitor-community/contacts)
- [Capacitor Docs](https://capacitorjs.com/docs)

For permission issues:
- [iOS Permission Guide](https://developer.apple.com/documentation/contacts)
- [Android Permission Guide](https://developer.android.com/guide/topics/permissions/overview)

---

**Last Updated**: November 2025
**Plugin Version**: @capacitor-community/contacts@6.0.0
