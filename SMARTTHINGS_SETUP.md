# Samsung SmartThings Integration Setup Guide

## Overview

The SmartThings integration provides comprehensive smart home control with health-aware automation. Control your lights, locks, thermostats, and more while automatically adjusting your environment based on your health data.

## Features

### Device Management
- **Device Discovery**: Automatically find all SmartThings devices
- **Real-time Control**: Control devices instantly
- **Room Organization**: Group devices by room
- **Multiple Device Types**: Lights, locks, thermostats, cameras, sensors, and more

### Health-Aware Automation
- **Pain Management**: Automatically dim lights and lower temperature on high pain days
- **Energy Optimization**: Adjust environment based on energy levels
- **Crisis Mode**: Calming lights and secure locks during crisis
- **Medication Reminders**: Visual light notifications for medication time

### Scenes & Routines
- **Preset Scenes**: Good Morning, Bedtime, High Pain Day, Crisis Mode, Emergency
- **Custom Scenes**: Create your own scene combinations
- **Health Triggers**: Automatically activate scenes based on health data
- **Quick Access**: Favorite scenes for one-tap activation

### Automations
- **Visual Builder**: Drag-and-drop automation creation
- **Multiple Triggers**: Time, device state, health metrics, sunrise/sunset
- **Conditions**: Add conditions for when automations should run
- **Complex Actions**: Chain multiple actions with delays

## Setup Instructions

### 1. Get Your SmartThings Personal Access Token (PAT)

1. Go to [SmartThings Developer Portal](https://account.smartthings.com/tokens)
2. Sign in with your Samsung account
3. Click "Generate New Token"
4. Give it a name (e.g., "KOL App")
5. Select the following scopes:
   - `r:devices:*` - Read device information
   - `x:devices:*` - Execute device commands
   - `r:locations:*` - Read location information
   - `r:rooms:*` - Read room information
   - `r:scenes:*` - Read scenes
   - `x:scenes:*` - Execute scenes
   - `r:rules:*` - Read automation rules
   - `w:rules:*` - Create/update rules
6. Click "Generate Token"
7. **IMPORTANT**: Copy the token immediately (you won't be able to see it again)

### 2. Configure the App

1. Navigate to `/smarthome` in the app
2. Paste your Personal Access Token
3. Click "Connect SmartThings"
4. Wait for device discovery to complete

### 3. Enable Health Monitoring

1. On the Smart Home page, click "Health Monitoring OFF"
2. This will automatically check your health data every 5 minutes
3. Scenes with health triggers will activate automatically when conditions are met

## Usage Guide

### Controlling Devices

**Individual Devices:**
- Click the power toggle to turn devices on/off
- Use the brightness slider for dimmable lights
- Click lock/unlock buttons for smart locks
- View device details by clicking the expand button

**Bulk Actions:**
- Use scenes to control multiple devices at once
- Create custom scenes for different scenarios

### Creating Scenes

1. Go to the "Scenes" tab
2. Note the preset scenes available (Good Morning, Bedtime, etc.)
3. To create a custom scene:
   - Use the automation builder to create an automation with a manual trigger
   - Or modify existing scenes by duplicating and customizing

### Building Automations

1. Go to the "Automations" tab
2. Click "New Automation"
3. **Set a Trigger:**
   - **Time**: Run at a specific time daily
   - **Health Metric**: Trigger when pain/energy/mood/anxiety crosses a threshold
   - **Device State**: Trigger when a device changes state
   - **Sunrise/Sunset**: Trigger at sunrise or sunset
4. **Add Conditions (Optional):**
   - Time Range: Only run during specific hours
   - Device State: Only run if device is in a certain state
5. **Add Actions:**
   - Select device(s) to control
   - Choose what to do (on, off, set level, etc.)
   - Add delays between actions if needed
6. Save and enable the automation

### Health Integration Examples

**High Pain Day Scene:**
- **Trigger**: Pain level above 7
- **Actions**:
  - Dim all lights to 20%
  - Set thermostat to 68°F (cooling for inflammation)
  - Close blinds
  - Turn on white noise/fan

**Low Energy Mode:**
- **Trigger**: Energy level below 3
- **Actions**:
  - Brighten main room lights
  - Open blinds
  - Adjust temperature for alertness

**Crisis Support:**
- **Trigger**: Manual activation or anxiety level above 8
- **Actions**:
  - Dim lights to 15% (calming)
  - Lock all doors (security)
  - Turn on calming music (if integrated)
  - Send notification to support person

**Medication Time:**
- **Trigger**: Time-based (e.g., 8:00 AM, 8:00 PM)
- **Actions**:
  - Flash specific light purple
  - Gentle brightness pulse 3 times

## Device Types Supported

### Lights & Switches
- On/Off control
- Dimming (0-100%)
- Color control (for RGB lights)
- Color temperature adjustment

### Locks
- Lock/Unlock
- Status monitoring
- Auto-lock settings

### Thermostats
- Mode control (heat, cool, auto, off)
- Temperature setpoints
- Current temperature monitoring
- Fan control

### Sensors
- Motion detection
- Contact sensors (doors/windows)
- Temperature sensors
- Humidity sensors
- Air quality sensors

### Cameras
- Status monitoring
- Basic control
- (Note: Live feed requires additional integration)

### Other Devices
- Outlets/Plugs
- Fans
- Blinds/Shades
- Air Purifiers
- Humidifiers
- Smart Speakers

## Best Practices

### Health Automation
- Start with simple automations and add complexity gradually
- Test health triggers manually before enabling auto-activation
- Set reasonable thresholds (e.g., pain > 7, not pain > 5)
- Create override scenes for manual control

### Scene Design
- Name scenes clearly (e.g., "High Pain - Dim & Cool" not "Scene 1")
- Add descriptions to remember what each scene does
- Mark frequently used scenes as favorites
- Include health context in scene names when applicable

### Energy Efficiency
- Use motion sensors to auto-turn off lights
- Schedule thermostats based on your routine
- Monitor energy usage in the Energy tab
- Set scenes to optimize power consumption

### Security
- Test lock automations thoroughly before relying on them
- Create a "Leaving Home" scene that locks all doors
- Set up a "Coming Home" automation with proper security
- Never share your Personal Access Token

## Troubleshooting

### Devices Not Appearing
- Verify your PAT has the correct permissions
- Check that devices are online in the SmartThings app
- Try clicking "Refresh" to rediscover devices
- Ensure location ID is correct in settings

### Commands Not Working
- Check device status (must be online)
- Verify internet connection
- Check PAT hasn't expired
- Try controlling the device in the official SmartThings app first

### Health Triggers Not Activating
- Ensure Health Monitoring is enabled (green toggle)
- Verify you're logging health data regularly
- Check trigger thresholds are reasonable
- Look at automation logs to see if conditions are being met

### Scenes Not Executing Fully
- Check that all devices in the scene are online
- Verify each device supports the commanded capability
- Add delays between actions if some devices are slow to respond
- Test each device individually first

## Privacy & Security

### Data Storage
- SmartThings configuration stored locally in browser
- Device list cached locally for offline access
- Health data stays in your local database
- No data sent to third-party servers

### API Security
- Personal Access Token stored in browser localStorage
- Token encrypted by browser security
- Never share your token with others
- Revoke and regenerate if compromised

### Health Data
- Health-based automations use local data only
- No health information sent to SmartThings
- Automation logic runs entirely in your browser
- You control what health data is used

## Integration Points

The SmartThings integration connects with:

- **Health Dashboard**: Read pain, energy, mood data
- **Crisis Support**: Auto-activate calming scenes
- **Medication Tracker**: Light notifications for doses
- **Sleep Tracking**: Bedtime and wake routines
- **AI Life Manager**: Proactive environment optimization

## Advanced Features

### Webhooks (Coming Soon)
- Real-time device status updates
- Instant notification of state changes
- Bidirectional communication

### Voice Control
- Works with Google Home integration
- Bixby voice commands
- Custom voice shortcuts

### Energy Monitoring
- Track power consumption
- Identify energy-hungry devices
- Cost estimation
- Usage trends and insights

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review SmartThings API status: https://status.smartthings.com/
3. Check your device compatibility
4. Verify PAT permissions

## API Rate Limits

SmartThings API has rate limits:
- 250 requests per minute per token
- The app respects these limits automatically
- Batch operations used where possible
- Caching reduces API calls

## Future Enhancements

Planned features:
- Scene scheduling
- Geofencing integration
- Advanced energy analytics
- Custom device types
- SmartThings TV control
- SmartThings camera live feed
- Multi-location support
- Family member profiles
- Advanced health correlations
- Machine learning optimization

---

**Remember**: Your smart home should adapt to your needs, especially on difficult days. Take time to set up health-aware automations that truly support your wellbeing.
