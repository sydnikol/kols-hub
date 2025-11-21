# Phone Integration - Quick Start Guide

Get phone contacts, calls, and SMS working in 5 minutes!

## Installation Complete ✅

The phone integration feature is already set up and ready to use. All files have been created.

## Files Overview

### Core Files (Must Have)
- ✅ `src/services/phoneIntegrationService.ts` - Main service
- ✅ `src/types/phoneContacts.ts` - TypeScript types
- ✅ `src/pages/PhoneContactsPage.tsx` - Main UI page
- ✅ `src/components/contacts/` - All contact components
- ✅ `src/utils/database.ts` - Database with careTeam table
- ✅ `src/App.tsx` - Routes configured

### Documentation
- ✅ `PHONE_INTEGRATION_README.md` - Full documentation
- ✅ `PHONE_INTEGRATION_SUMMARY.md` - Implementation summary
- ✅ `MOBILE_PERMISSIONS_SETUP.md` - Permission setup guide
- ✅ `PHONE_INTEGRATION_QUICK_START.md` - This file

### Examples (Optional)
- ✅ `src/examples/PhoneIntegrationExamples.tsx` - Usage examples

## Quick Start

### 1. View on Web (Now)

```bash
npm run dev
```

Visit: http://localhost:5173/contacts

You'll see:
- Permission handler (explains web limitations)
- Three tabs: Care Team, Phone Contacts, Emergency
- Pre-configured emergency numbers

### 2. Test on Mobile (Recommended)

#### For Android:

```bash
# 1. Build the app
npm run build

# 2. Sync Capacitor
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. Run on device/emulator
# Click ▶️ in Android Studio
```

#### For iOS:

```bash
# 1. Build the app
npm run build

# 2. Sync Capacitor
npx cap sync ios

# 3. Open in Xcode
npx cap open ios

# 4. Run on device/simulator
# Click ▶️ in Xcode
```

### 3. Configure Permissions

#### Android - Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.CALL_PHONE" />
```

#### iOS - Add to `ios/App/App/Info.plist`:

```xml
<key>NSContactsUsageDescription</key>
<string>We need access to your contacts to help you manage your care team and emergency contacts.</string>
```

## First Time Usage

### Step 1: Navigate to Contacts
1. Open the app
2. Click menu (☰) in top-left
3. Select "Health & Wellness"
4. Click "Phone Contacts"

### Step 2: Grant Permission
1. Click "Grant Permission" button
2. Accept system permission dialog
3. Contacts will load automatically

### Step 3: Import Contacts
1. Go to "Phone Contacts" tab
2. Select contacts to import
3. Click "Import Selected"
4. Or use "Import" button on individual contacts

### Step 4: Organize Care Team
1. Assign roles (doctor, therapist, family, etc.)
2. Add tags for organization
3. Mark important contacts as "Emergency"
4. Add to "Favorites" for quick access

### Step 5: Test Features
1. Try calling a contact
2. Send an SMS
3. Check emergency contacts tab
4. Test emergency hotlines (988, etc.)

## Common Tasks

### Make a Call
```typescript
import phoneIntegrationService from './services/phoneIntegrationService';

await phoneIntegrationService.makeCall({
  phoneNumber: '555-1234',
  contactName: 'Dr. Smith'
});
```

### Send SMS
```typescript
await phoneIntegrationService.sendSMS({
  phoneNumber: '555-1234',
  message: 'Need appointment',
  contactName: 'Doctor'
});
```

### Get Emergency Contacts
```typescript
const emergencyContacts = await phoneIntegrationService.getEmergencyContacts();
```

### Call Emergency Number
```typescript
// 911 Emergency
await phoneIntegrationService.callEmergencyNumber('911');

// 988 Suicide Prevention
await phoneIntegrationService.callEmergencyNumber('988');
```

## Integration Examples

### Add to Your Page

```typescript
import { QuickContactActions } from '../components/contacts';

<QuickContactActions
  phoneNumber="555-1234"
  email="doctor@example.com"
  contactName="Dr. Smith"
/>
```

### Emergency Button in Dashboard

```typescript
import { EmergencyCallButton } from '../examples/PhoneIntegrationExamples';

<EmergencyCallButton />
```

### Call Your Doctor Widget

```typescript
import { CallMyDoctorWidget } from '../examples/PhoneIntegrationExamples';

<CallMyDoctorWidget />
```

## Troubleshooting

### Issue: "Permission Denied"
**Solution**:
- Go to device Settings → Apps → KOL → Permissions → Contacts → Allow
- Restart the app

### Issue: "Contacts not loading"
**Solution**:
- Ensure you're on iOS/Android (not web)
- Check permission is granted
- Check console for errors
- Try rebuilding: `npm run mobile:sync`

### Issue: "Calls not working"
**Solution**:
- Verify CALL_PHONE permission (Android)
- Test on physical device (emulators may not work)
- Check phone number format

### Issue: "Can't find phone integration page"
**Solution**:
- Clear browser cache
- Restart dev server: `npm run dev`
- Check route in address bar: `/contacts`

## Next Steps

### Customize for Your Needs

1. **Add More Emergency Numbers**
   - Edit `src/types/phoneContacts.ts`
   - Add to `EMERGENCY_NUMBERS` array

2. **Customize Contact Roles**
   - Edit `ContactRole` type
   - Add new role options

3. **Add Custom Tags**
   - Edit `DEFAULT_CONTACT_TAGS` array
   - Add your own categories

4. **Integrate Elsewhere**
   - Use `QuickContactActions` in other pages
   - Add emergency buttons to dashboards
   - Show recent contacts in home page

### Advanced Features

1. **Contact Sync**
   - Auto-sync contacts on app start
   - Background sync (future feature)

2. **Notifications**
   - Reminder to contact care team
   - Medication refill call reminders

3. **Analytics**
   - Track communication patterns
   - Care team engagement metrics

## Need Help?

### Documentation
- [Full Documentation](./PHONE_INTEGRATION_README.md)
- [Permission Setup](./MOBILE_PERMISSIONS_SETUP.md)
- [Implementation Summary](./PHONE_INTEGRATION_SUMMARY.md)

### Code Examples
- [Usage Examples](./src/examples/PhoneIntegrationExamples.tsx)

### External Resources
- [Capacitor Contacts Plugin](https://github.com/capacitor-community/contacts)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## Feature Status

- ✅ Contact reading (iOS/Android)
- ✅ Contact search
- ✅ Call integration
- ✅ SMS integration
- ✅ Care team management
- ✅ Emergency contacts
- ✅ Activity logging
- ✅ Permission handling
- ✅ Tagging and organization
- ✅ Favorites system

## Mobile-Only Features

These features only work on iOS/Android:
- Native contact access
- Direct phone calls
- SMS integration
- Contact photos (future)
- Contact groups (future)

Web fallback:
- Manual contact entry
- Tel/SMS URL schemes (limited browser support)

## Performance Tips

1. **Large Contact Lists**
   - Search is optimized with indexing
   - Pagination for better performance
   - Virtual scrolling for long lists

2. **Battery Optimization**
   - Minimal background activity
   - Efficient database queries
   - No polling or continuous sync

3. **Storage**
   - IndexedDB for local storage
   - Efficient contact caching
   - Automatic cleanup of old data

## Privacy & Security

### What We Store
- Contact names and numbers
- Care team metadata (roles, tags)
- Communication activity log
- User preferences

### What We DON'T Do
- Upload contacts to servers
- Share contacts with third parties
- Access contacts in background without permission
- Use contacts for marketing

### User Control
- Grant/revoke permission anytime
- Delete individual contacts
- Clear all care team data
- Export contact data (future)

## Success Checklist

Before deploying to production:

- [ ] Permissions configured (iOS & Android)
- [ ] Tested on physical device
- [ ] Permission flow works correctly
- [ ] Can import contacts
- [ ] Can make calls
- [ ] Can send SMS
- [ ] Emergency features tested
- [ ] Database migration successful
- [ ] UI tested on different screen sizes
- [ ] Error handling verified
- [ ] Privacy policy updated
- [ ] User documentation created

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server

# Mobile Build
npm run build                  # Build for production
npm run mobile:sync           # Sync Capacitor
npm run build:android         # Build Android
npm run build:ios             # Build iOS

# Open in IDE
npx cap open android          # Open Android Studio
npx cap open ios              # Open Xcode

# Testing
npx cap run android           # Run on Android
npx cap run ios               # Run on iOS

# Debugging
npx cap doctor                # Check Capacitor setup
```

---

## Ready to Go! 🚀

Your phone integration is complete and ready to use. Start by:

1. Running the dev server: `npm run dev`
2. Visiting `/contacts` in your browser
3. Following the mobile setup for full features

**Happy coding!** 📱

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Support**: See documentation files for detailed help
