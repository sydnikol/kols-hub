# 🎲 D&D BEYOND HUB - Quick Reference Guide

## Overview
Your complete digital tabletop gaming companion integrated into KOL Hub. Access via the **D&D Beyond** button in the main navigation or visit `/dnd`.

---

## Features

### 1. 📊 Overview Dashboard
**What it does:** Central hub showing your characters, campaigns, and stats at a glance.

**Quick Actions:**
- Roll Dice
- Open Spell Book
- Start Initiative Tracker
- Create Session Notes

**Stats Displayed:**
- Total characters created
- Active campaigns
- Total sessions played
- Highest character level

---

### 2. 👤 Character Sheet
**What it does:** Complete digital character management system.

**Features:**
- Create unlimited characters
- Track all ability scores (STR, DEX, CON, INT, WIS, CHA)
- Automatic modifier calculations
- HP tracking with slider
- AC, Speed, Initiative display
- Proficiency bonus
- Equipment lists
- Spell lists
- Character features
- Notes section

**How to Use:**
1. Click "New Character" to create
2. Fill in character details
3. Click "Edit" to modify stats
4. HP updates with slider
5. Click character card to view full sheet

**Data Saved:** Characters persist automatically in localStorage

---

### 3. 🎲 Dice Roller
**What it does:** Advanced dice rolling system with history.

**Quick Roll Buttons:**
- d4, d6, d8, d10, d12, d20, d100
- Advantage (2d20, take higher)
- Disadvantage (2d20, take lower)

**Custom Notation:**
- Format: `[number]d[sides]+/-[modifier]`
- Examples:
  - `2d6+3` → Roll 2 six-sided dice, add 3
  - `4d8-2` → Roll 4 eight-sided dice, subtract 2
  - `1d20` → Roll 1 twenty-sided die

**Features:**
- Roll descriptions/labels
- Complete roll history
- Timestamps on all rolls
- Individual dice results shown
- Clear history button

**How to Use:**
1. Add optional description
2. Click quick roll button OR enter custom notation
3. View results and history below

---

### 4. ✨ Spell Book
**What it does:** Searchable spell database with preparation tracking.

**Search & Filter:**
- Search by spell name or description
- Filter by spell level (0-9)
- Filter by class

**Spell Information:**
- Level and school of magic
- Casting time and range
- Components required
- Duration
- Full description
- Available classes

**Preparation:**
- Click "Prepare" to mark spells
- Track prepared spells
- Quick reference during play

**How to Use:**
1. Use search box or filters
2. Click spell card to view details
3. Click "Prepare" to track for your character

---

### 5. 👹 Monster Manual
**What it does:** Monster reference with stats and abilities.

**Monster Cards Show:**
- Name and CR (Challenge Rating)
- Size, type, alignment
- Hit Points
- Armor Class
- Special abilities
- Description

**How to Use:**
1. Search for specific monsters
2. Reference stats during encounters
3. Click monster for full details

---

### 6. 🗺️ Campaign Manager
**What it does:** Track multiple campaigns and their details.

**Campaign Information:**
- Campaign name and description
- DM name
- Player list
- Session count
- Party level range
- Campaign setting
- Notes

**Features:**
- Create multiple campaigns
- Track sessions
- Campaign-specific notes
- Last session date

**How to Use:**
1. Click "New Campaign"
2. Fill in campaign details
3. Click campaign card to view/edit
4. Use "+ Session" to track sessions

---

### 7. ⚡ Initiative Tracker
**What it does:** Combat management with turn order.

**Features:**
- Add player characters from your list
- Add monsters/NPCs on the fly
- Automatic initiative sorting
- Round counter
- Current turn highlighting
- HP tracking during combat
- Remove combatants
- Start/End combat controls

**Combat Flow:**
1. Add all combatants
2. Roll/enter initiative for each
3. Click "Start Combat"
4. Use "Next Turn" to advance
5. Track HP changes
6. Click "End Combat" when done

**During Combat:**
- Current combatant highlighted in purple
- Round number displayed
- Edit HP in real-time
- Remove defeated enemies

---

### 8. 🛡️ Item Database
**What it does:** Magic items and equipment library.

**Item Information:**
- Name and type
- Rarity (Common → Legendary)
- Attunement requirements
- Description
- Special properties

**Features:**
- Search items
- Mark as equipped
- Track attunement slots

**How to Use:**
1. Search for items
2. Click "Equip" to track equipped items
3. View item details in card

---

### 9. ✏️ Homebrew Creator
**What it does:** Create custom D&D content.

**Content Types:**
- Spells
- Monsters
- Magic Items
- Classes/Subclasses

**How to Use:**
1. Select content type
2. Enter name
3. Write description and mechanics
4. Click "Save Homebrew"
5. View in "Your Homebrew Content" section

---

### 10. 📝 Session Notes
**What it does:** Track session summaries and details.

**Features:**
- Link to specific campaigns
- Automatic session numbering
- Date/time stamps
- Session titles
- Detailed notes
- History of all sessions

**How to Use:**
1. Select campaign from dropdown
2. Click "New Session Note"
3. Enter session title
4. Write session summary
5. Click "Done" to save
6. View all notes below

**What to Track:**
- Key events
- Plot developments
- NPCs encountered
- Locations visited
- Loot acquired
- Player decisions
- Cliffhangers

---

## Keyboard Shortcuts (Coming Soon)
- `Ctrl/Cmd + D` - Quick dice roll (d20)
- `Ctrl/Cmd + S` - Save current data
- `Ctrl/Cmd + N` - New (context-aware)

---

## Data Management

### Where Data is Stored
All data saved automatically in browser localStorage:
- Characters
- Campaigns
- Session notes
- Roll history
- Prepared spells
- Equipped items

### Backup & Export
Current: Manual copy from localStorage
Coming Soon: Export to JSON, import from D&D Beyond

### Offline Support
✅ All features work completely offline

---

## Tips & Tricks

### For Players
1. **Create backup characters** for quick swaps
2. **Use roll descriptions** to track what you're rolling
3. **Prepare spells ahead** of game sessions
4. **Track HP in initiative** during combat

### For DMs
1. **Create multiple campaigns** for different groups
2. **Add monsters quickly** during improvisation
3. **Use session notes** for campaign continuity
4. **Create homebrew** for unique encounters

### For Both
1. **Search spells by keyword** in description
2. **Filter by your class** for quick reference
3. **Use roll history** to verify past rolls
4. **Track initiative** even in theater of mind

---

## Integration with Other KOL Hub Features

### With Ideas Library
- Access 900+ D&D ideas
- Tool integration ideas
- Social/intrigue scenarios
- Heist planning tools
- Virtual break-ins

### With AI Companion
- Ask for D&D advice
- Generate NPCs
- Create plot hooks
- World-building assistance

### With Creative Tools
- Character art references
- Campaign mood boards
- Map creation
- Story writing

---

## Mobile & Desktop

### On Desktop
- Full multi-column layouts
- Keyboard shortcuts
- Large character sheets
- Detailed views

### On Mobile
- Touch-friendly buttons
- Swipeable tabs
- Responsive grids
- Optimized dice roller

### On Tablet
- Best of both worlds
- Split-screen friendly
- Perfect for table use
- Reference while playing

---

## Future D&D Beyond API Integration

When official D&D Beyond API access is added:
- Import characters directly
- Sync character updates
- Access official content
- Expanded spell database
- Official monster stats
- Campaign sharing

---

## Troubleshooting

**Characters not saving?**
- Check browser localStorage permissions
- Try private/incognito mode
- Clear cache and reload

**Dice roller not working?**
- Check notation format
- Use whole numbers only
- Verify browser JavaScript enabled

**Can't find a spell?**
- Check spell level filter
- Try broader search terms
- Verify class filter

**Initiative tracker issues?**
- Click "End Combat" and restart
- Refresh page if stuck
- Re-add combatants

---

## Quick Start Guide

### First Time Setup
1. Navigate to D&D Beyond hub
2. Create your first character
3. Create a campaign
4. Start your first session note
5. Try rolling dice
6. Browse spells and monsters

### Before Each Session
1. Review character sheet
2. Prepare spells
3. Check equipment
4. Open session notes
5. Test dice roller

### During Session
1. Keep character sheet open
2. Use dice roller for rolls
3. Reference spells as needed
4. Track initiative in combat
5. Take session notes

### After Session
1. Update character (XP, items)
2. Finish session notes
3. Track loot acquired
4. Note character progression

---

## Support & Updates

**Currently Available:** v1.0 - All 10 core features
**Status:** Production ready, fully functional
**Platform:** Desktop, Web, Mobile (iOS/Android)
**Offline:** Yes, full offline support

**Future Updates:**
- D&D Beyond API integration
- VTT integrations (Roll20, Foundry)
- Dice roll animations
- Character portraits/tokens
- Virtual maps
- More homebrew tools

---

## Getting Help

**In-App:**
- Hover over elements for tooltips
- Click info icons for guidance
- Check examples in each feature

**Need More?**
- AI Companion can help with D&D questions
- Ideas Library has 900+ D&D concepts
- Session Notes track your learning

---

*Built with ⚔️ for adventurers*
*Part of KOL Hub - Your Self-Evolving Personal OS*
