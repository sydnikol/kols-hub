# Phone Integration Feature

Native phone contacts, calls, and SMS integration using Capacitor plugins.

## Features

### 1. Contact Management
- **Read Phone Contacts**: Access native contacts from iOS/Android
- **Search Contacts**: Fast search by name, phone number, or email
- **Sync with Care Team**: Import contacts into your care team database
- **Contact Tagging**: Organize contacts with tags (medical, family, friends, etc.)
- **Favorite Contacts**: Mark important contacts for quick access

### 2. Call Integration
- **Direct Calling**: Make phone calls directly from the app
- **Quick Dial**: One-tap calling for care team members
- **Emergency Calling**: Pre-configured emergency numbers (911, 988, etc.)
- **Call Logging**: Track all call attempts in activity log

### 3. SMS Integration
- **Send SMS**: Open SMS app with pre-filled message
- **Quick Text**: Send messages to care team members
- **Emergency Messaging**: Quick contact for crisis situations

### 4. Care Team Management
- **Role Assignment**: Tag contacts as doctor, therapist, family, etc.
- **Emergency Contacts**: Designate critical contacts for emergencies
- **Contact Metadata**: Store specialization, hours, preferred contact method
- **Last Contacted**: Track when you last reached out

### 5. Emergency Features
- **Emergency Contact Cards**: Quick access cards with one-tap actions
- **Crisis Hotlines**: Pre-configured numbers (988 Suicide Lifeline, Crisis Text Line)
- **Emergency Numbers**: Quick dial for 911, poison control, etc.
- **Location Sharing**: (Future feature)

## Files Created

### Services
- `src/services/phoneIntegrationService.ts` - Main service for phone integration
  - Contact management (read, search, sync)
  - Call/SMS functionality
  - Care team integration
  - Activity logging

### Types
- `src/types/phoneContacts.ts` - TypeScript interfaces
  - Contact, CareTeamContact, PhoneNumber, EmailAddress
  - ContactRole, ContactPermissionStatus
  - Emergency contact types
  - Predefined tags and emergency numbers

### Pages
- `src/pages/PhoneContactsPage.tsx` - Main UI
  - Three tabs: Care Team, Phone Contacts, Emergency
  - Search functionality
  - Import/export contacts
  - Bulk operations

### Components
- `src/components/contacts/EmergencyContactCard.tsx` - Emergency contact display
  - One-tap call/SMS buttons
  - Quick actions
  - Role-based styling

- `src/components/contacts/ContactListItem.tsx` - Contact list item
  - Call/SMS actions
  - Favorite/emergency toggle
  - Contact details display

- `src/components/contacts/PermissionHandler.tsx` - Permission management
  - Request contacts permission
  - Platform-specific instructions
  - Permission status display

### Database
- Updated `src/utils/database.ts` (Version 7)
  - Added `careTeam` table for care team contacts
  - Added `activityLog` table for call/SMS tracking

## Dependencies

```json
{
  "@capacitor-community/contacts": "^6.0.0",
  "@capacitor/app": "^6.0.1"
}
```

## Platform Support

### iOS
- Native contacts API
- Requires `NSContactsUsageDescription` in Info.plist
- Permission request flow
- Settings deep-link support

### Android
- Native contacts API
- Requires `READ_CONTACTS` permission in AndroidManifest.xml
- Runtime permission requests
- Settings deep-link support

### Web
- Limited functionality (no native contacts)
- Manual contact entry fallback
- SMS/Call via URL schemes (limited browser support)

## Usage

### Access Phone Contacts
```typescript
import phoneIntegrationService from './services/phoneIntegrationService';

// Check permission
const status = await phoneIntegrationService.checkContactsPermission();

// Request permission
const granted = await phoneIntegrationService.requestContactsPermission();

// Get all contacts
const contacts = await phoneIntegrationService.getPhoneContacts();

// Search contacts
const results = await phoneIntegrationService.searchPhoneContacts('John');
```

### Make Calls
```typescript
// Make a call
await phoneIntegrationService.makeCall({
  phoneNumber: '555-1234',
  contactName: 'Dr. Smith'
});

// Quick dial from care team
await phoneIntegrationService.quickDial(contactId);

// Emergency call
await phoneIntegrationService.callEmergencyNumber('911');
```

### Send SMS
```typescript
// Send SMS
await phoneIntegrationService.sendSMS({
  phoneNumber: '555-1234',
  message: 'Hello!',
  contactName: 'Friend'
});

// Quick text
await phoneIntegrationService.quickText(contactId, 'Need help');
```

### Manage Care Team
```typescript
// Import contact to care team
const careTeamContact = await phoneIntegrationService.importContactToCareTeam(
  contact,
  'doctor',
  ['medical', 'mental-health']
);

// Sync multiple contacts
const result = await phoneIntegrationService.syncContactsToCareTeam(contacts);

// Get care team contacts
const careTeam = await phoneIntegrationService.getCareTeamContacts({
  role: 'doctor',
  isEmergency: true
});

// Toggle emergency status
await phoneIntegrationService.toggleEmergencyContact(contactId);
```

## Navigation

Access the Phone Contacts feature:
- Main App: `Health & Wellness` → `Phone Contacts`
- Direct URL: `/contacts`

## Security & Privacy

- **Local Storage**: All contacts stored in IndexedDB locally
- **No Server Upload**: Contact data never leaves the device
- **Permission-Based**: Requires explicit user permission
- **Activity Logging**: All calls/SMS logged for tracking

## Emergency Numbers

Pre-configured emergency and crisis numbers:
- **911**: Emergency Services
- **988**: Suicide Prevention Lifeline
- **741741**: Crisis Text Line
- **1-800-662-4357**: SAMHSA Mental Health Helpline
- **1-800-222-1222**: Poison Control

## Future Enhancements

- [ ] Location sharing for emergency contacts
- [ ] Contact groups and categories
- [ ] WhatsApp/Signal integration
- [ ] Video calling support
- [ ] Contact backup/restore
- [ ] Contact photos and avatars
- [ ] Custom ringtones per contact
- [ ] Contact notes and history
- [ ] Shared contacts between care team
- [ ] Emergency SOS button
- [ ] Automatic check-ins with contacts
- [ ] Contact relationship mapping

## Mobile Setup

### iOS Configuration
1. Add to `ios/App/App/Info.plist`:
```xml
<key>NSContactsUsageDescription</key>
<string>We need access to your contacts to help you manage your care team and emergency contacts.</string>
```

### Android Configuration
1. Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.CALL_PHONE" />
```

### Sync and Build
```bash
# Sync Capacitor
npm run mobile:sync

# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## Testing

### Web Testing
- Visit `/contacts` in browser
- Will show "Web Platform Detected" message
- Can test UI but not native features

### Mobile Testing
1. Build and deploy to device/emulator
2. Grant contacts permission when prompted
3. Test contact import
4. Test call/SMS functionality
5. Test emergency contact features

## Troubleshooting

### Permission Issues
- **iOS**: Settings → Privacy → Contacts → KOL → Enable
- **Android**: Settings → Apps → KOL → Permissions → Contacts → Allow

### Contacts Not Loading
- Check permission status
- Verify platform is iOS/Android (not web)
- Check console for errors
- Verify Capacitor plugins installed

### Calls/SMS Not Working
- Verify device has cellular/calling capability
- Check platform support (some emulators don't support calls)
- Ensure valid phone number format

## Support

For issues or questions:
- Check console logs for errors
- Verify permissions granted
- Test on physical device (emulators have limitations)
- Check Capacitor plugin documentation

---

**Built with**: Capacitor, React, TypeScript, Material-UI, Dexie (IndexedDB)

**Platforms**: iOS, Android, Web (limited)

**Version**: 1.0.0
