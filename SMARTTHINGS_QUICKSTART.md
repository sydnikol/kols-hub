# SmartThings Quick Start Guide

## 5-Minute Setup

### Step 1: Get Your Token (2 minutes)
1. Go to https://account.smartthings.com/tokens
2. Click "Generate New Token"
3. Name it "KOL App"
4. Select ALL scopes (or at minimum: `r:devices:*`, `x:devices:*`, `r:locations:*`)
5. Click "Generate" and **COPY THE TOKEN** (you can't see it again!)

### Step 2: Connect (1 minute)
1. In the app, go to `/smarthome`
2. Paste your token
3. Click "Connect SmartThings"
4. Wait for device discovery

### Step 3: Enable Health Monitoring (30 seconds)
1. Click "Health Monitoring OFF" button
2. It turns green: "Health Monitoring ON"
3. Done! Your environment will now auto-adjust based on your health data

### Step 4: Test It Out (1 minute)
1. Try toggling a light on/off
2. Try activating the "Good Morning" scene
3. Create your first automation

## Common Use Cases

### "I want my lights to dim when I'm in pain"
1. Go to Scenes tab
2. The "High Pain Day" scene is already created
3. Click on it to see details
4. It auto-activates when pain > 7
5. Or click "Activate" to test it now

### "I want medication reminders with lights"
1. Go to Automations tab
2. Click "New Automation"
3. Set trigger: Time → 8:00 AM
4. Add action: Select a light → Set Color Control → setColor → [75, 100] (purple)
5. Add another action: Same light → Switch → on
6. Save & enable

### "I want a bedtime routine"
1. The "Bedtime" scene is already created
2. It turns off all lights and locks doors
3. Click "Activate" to run it
4. Or create an automation to run it at 10 PM every night

### "I want my home to know when I'm having a crisis"
1. The "Crisis Mode" scene is already created
2. It dims lights to 15% and locks all doors
3. You can:
   - Activate it manually from the Crisis Support page
   - Set it to auto-activate when anxiety > 8
   - Add it to your emergency shortcuts

## Key Features at a Glance

### Device Control
- **On/Off**: Click the toggle switch
- **Dimming**: Use the slider (for dimmable lights)
- **Locks**: Click Lock/Unlock button
- **Thermostats**: View current temp, adjust setpoints

### Scenes (Pre-made for you!)
- **Good Morning**: Gentle wake-up lighting
- **High Pain Day**: Dim + cool (auto-activates when pain > 7)
- **Good Energy**: Bright + energizing
- **Crisis Mode**: Calming + secure (auto-activates when anxiety > 8)
- **Bedtime**: All off + locked
- **Medication Reminder**: Purple light flash
- **Emergency**: All lights on + doors unlocked

### Automations
- **Time Trigger**: "Every day at 7 AM, turn on bedroom light to 30%"
- **Health Trigger**: "When pain > 7, dim all lights and cool to 68°F"
- **Device Trigger**: "When motion detected, turn on hallway light"
- **Sunrise/Sunset**: "At sunset, turn on outdoor lights"

### Health Integration
The magic happens automatically:
1. You log health data (pain, energy, mood, anxiety)
2. Health monitoring checks every 5 minutes
3. Matching scenes auto-activate
4. Your environment adapts to support you

## Tips for Success

### Start Simple
- Begin with just one scene
- Test it manually first
- Then enable auto-activation
- Add more complexity gradually

### Health Triggers
- Set reasonable thresholds (pain > 7, not > 5)
- Test manual activation first
- Enable auto-activation once confident
- You can always override manually

### Scene Names
- Use clear, descriptive names
- Include the purpose: "High Pain - Cool & Dim"
- Add emojis if it helps you remember
- Favorite the ones you use most

### Security
- Test lock automations multiple times
- Create an "unlock all" scene for emergencies
- Never rely 100% on automation for security
- Keep your token secure

## Troubleshooting

### "No devices found"
- Check devices are online in SmartThings app
- Verify your token has the right permissions
- Click "Refresh" button
- Try reconnecting with a new token

### "Commands aren't working"
- Make sure device is online (green indicator)
- Check your internet connection
- Try the same command in SmartThings app
- Refresh the device status

### "Health triggers not working"
- Is Health Monitoring enabled? (should be green)
- Are you logging health data regularly?
- Check the trigger threshold is being met
- Look for the scene in Scenes tab to verify it exists

### "Scene activated but nothing happened"
- Check all devices in the scene are online
- Some devices take a few seconds to respond
- Try executing each device command individually
- Verify the devices support the commands being sent

## Integration with Other Features

### Health Dashboard
- Your pain/energy/mood data automatically triggers scenes
- No extra setup needed
- Just enable Health Monitoring

### Crisis Support
- Crisis Mode scene available for quick activation
- Can be triggered automatically when anxiety is high
- Helps create a safe, calming space instantly

### Medication Tracker
- Set up light reminders for medication times
- Purple light = time for meds
- Visual notification that's gentle but noticeable

### Sleep Tracking
- Bedtime scene for sleep preparation
- Morning scene for gentle wake-up
- Can tie to sleep schedule

### AI Life Manager
- Learns your patterns
- Suggests optimal scenes
- Predicts when you might need environment changes

## Next Steps

Once you're comfortable with basics:
1. Create your own custom scenes
2. Build complex automations with conditions
3. Set up room-based control
4. Explore energy monitoring
5. Fine-tune health triggers to your needs

## Need Help?

- Check `SMARTTHINGS_SETUP.md` for detailed setup
- See `SMARTTHINGS_INTEGRATION.md` for technical details
- Look at `smartThingsService.example.ts` for code examples
- Test individual features in isolation
- Start simple and build up

## Remember

Your smart home should support you, not stress you out. Start with one simple automation, test it, and expand from there. The health-aware features are designed to quietly support you on difficult days without requiring constant management.

Take it slow, test everything, and adjust to what works for YOUR needs.

---

**Happy Automating!** 🏠✨
