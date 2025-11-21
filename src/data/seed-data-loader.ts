// Comprehensive Seed Data Loader - Populates ALL modules with realistic data
import { MegaPassiveIncomeSystem } from '../services/mega-passive-income-system';

export interface SeedData {
  health: HealthSeedData;
  finance: FinanceSeedData;
  dnd: DnDSeedData;
  smartHome: SmartHomeSeedData;
  wellness: WellnessSeedData;
  productivity: ProductivitySeedData;
  integrations: IntegrationsSeedData;
}

interface HealthSeedData {
  vitals: VitalReading[];
  symptoms: SymptomLog[];
  medications: Medication[];
  appointments: Appointment[];
  triggers: Trigger[];
  erVisits: ERVisit[];
}

interface FinanceSeedData {
  incomeStreams: any[];
  expenses: Expense[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  taxRecords: TaxRecord[];
}

interface DnDSeedData {
  characters: Character[];
  campaigns: Campaign[];
  sessions: GameSession[];
  inventory: InventoryItem[];
}

interface SmartHomeSeedData {
  devices: SmartDevice[];
  scenes: Scene[];
  automations: Automation[];
  history: DeviceHistory[];
}

interface WellnessSeedData {
  moods: MoodEntry[];
  activities: Activity[];
  groundingLogs: GroundingLog[];
  celebrations: Celebration[];
}

interface ProductivitySeedData {
  tasks: Task[];
  projects: Project[];
  notes: Note[];
  goals: Goal[];
}

interface IntegrationsSeedData {
  connections: IntegrationConnection[];
  syncHistory: SyncHistory[];
  apiKeys: APIKey[];
}

// ============================================
// HEALTH SEED DATA
// ============================================

const healthSeedData: HealthSeedData = {
  vitals: [
    // Last 30 days of BP/HR readings
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `vital-${i}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      bloodPressureSystolic: 95 + Math.floor(Math.random() * 25),
      bloodPressureDiastolic: 60 + Math.floor(Math.random() * 15),
      heartRate: 85 + Math.floor(Math.random() * 30),
      oxygenSaturation: 96 + Math.floor(Math.random() * 4),
      standing: Math.random() > 0.7,
      notes: ['', 'Dizzy spell', 'Felt good', 'Low energy', 'Post-exercise'][Math.floor(Math.random() * 5)]
    }))
  ],

  symptoms: [
    { id: 's1', date: '2025-11-20', symptom: 'Fatigue', severity: 7, duration: '3 hours', triggers: ['Low sleep', 'Stress'] },
    { id: 's2', date: '2025-11-19', symptom: 'Joint pain', severity: 5, duration: 'All day', triggers: ['Weather change'] },
    { id: 's3', date: '2025-11-18', symptom: 'Brain fog', severity: 6, duration: '2 hours', triggers: ['Dehydration'] },
    { id: 's4', date: '2025-11-17', symptom: 'Dizziness', severity: 8, duration: '30 minutes', triggers: ['Standing too fast'] },
    { id: 's5', date: '2025-11-16', symptom: 'Headache', severity: 4, duration: '1 hour', triggers: ['Screen time'] }
  ],

  medications: [
    { name: 'Midodrine', dosage: '5mg', frequency: '3x daily', purpose: 'POTS - Raise BP', sideEffects: 'Tingling scalp, goosebumps', startDate: '2024-01-15' },
    { name: 'Fludrocortisone', dosage: '0.1mg', frequency: '1x daily', purpose: 'POTS - Fluid retention', sideEffects: 'None noted', startDate: '2024-02-01' },
    { name: 'Metoprolol', dosage: '25mg', frequency: '2x daily', purpose: 'POTS - Lower HR', sideEffects: 'Fatigue sometimes', startDate: '2024-03-10' },
    { name: 'Vitamin D', dosage: '5000 IU', frequency: '1x daily', purpose: 'Supplement', sideEffects: 'None', startDate: '2023-06-01' },
    { name: 'Magnesium', dosage: '400mg', frequency: '1x nightly', purpose: 'Sleep & muscle cramps', sideEffects: 'None', startDate: '2023-06-01' }
  ],

  appointments: [
    { id: 'apt1', doctor: 'Dr. Sarah Chen', specialty: 'Cardiologist', date: '2025-11-25', time: '10:00 AM', notes: 'POTS follow-up, discuss medication adjustment', location: 'Heart Center, Suite 200' },
    { id: 'apt2', doctor: 'Dr. James Wilson', specialty: 'Rheumatologist', date: '2025-12-02', time: '2:30 PM', notes: 'EDS management, joint pain evaluation', location: 'Medical Plaza, 3rd Floor' },
    { id: 'apt3', doctor: 'Dr. Emily Rodriguez', specialty: 'Primary Care', date: '2025-12-10', time: '9:00 AM', notes: 'Annual physical, lab review', location: 'Family Health Clinic' },
    { id: 'apt4', doctor: 'Dr. Michael Lee', specialty: 'Physical Therapy', date: '2025-11-22', time: '3:00 PM', notes: 'PT session #8 - strengthening exercises', location: 'Rehab Center' }
  ],

  triggers: [
    { id: 't1', name: 'Heat/Humidity', symptoms: ['Dizziness', 'Fatigue', 'Nausea'], severity: 'High', copingStrategies: ['Stay indoors', 'AC on', 'Cold drinks', 'Ice packs'] },
    { id: 't2', name: 'Standing Too Long', symptoms: ['Lightheadedness', 'Vision changes', 'Syncope'], severity: 'High', copingStrategies: ['Sit immediately', 'Compression stockings', 'Leg exercises'] },
    { id: 't3', name: 'Dehydration', symptoms: ['Headache', 'Brain fog', 'Increased HR'], severity: 'Medium', copingStrategies: ['Drink electrolytes', 'Set hydration reminders'] },
    { id: 't4', name: 'Stress/Anxiety', symptoms: ['Fatigue', 'Pain increase', 'Insomnia'], severity: 'Medium', copingStrategies: ['Grounding techniques', 'Rest', 'Talk to therapist'] },
    { id: 't5', name: 'Weather Changes', symptoms: ['Joint pain', 'Headache', 'Fatigue'], severity: 'Low', copingStrategies: ['Pain meds', 'Heating pad', 'Gentle stretching'] }
  ],

  erVisits: [
    { id: 'er1', date: '2025-09-15', reason: 'Syncope episode - lost consciousness', duration: '4 hours', treatment: 'IV fluids, EKG monitoring', outcome: 'Discharged stable, BP 110/70', followUp: 'See cardiologist within 1 week', hospital: 'St. Mary\'s Medical Center' },
    { id: 'er2', date: '2025-06-22', reason: 'Severe tachycardia - HR 165 resting', duration: '5 hours', treatment: 'IV beta blockers, cardiac monitoring', outcome: 'HR controlled, discharged', followUp: 'Medication adjustment scheduled', hospital: 'University Hospital ER' },
    { id: 'er3', date: '2025-03-10', reason: 'Severe dehydration - unable to keep fluids down', duration: '3 hours', treatment: '2L IV saline, anti-nausea meds', outcome: 'Improved, discharged with instructions', followUp: 'PCP in 3 days', hospital: 'Community Hospital' }
  ]
};

// ============================================
// FINANCE SEED DATA ($12,000/DAY TARGET)
// ============================================

const financeSeedData: FinanceSeedData = {
  incomeStreams: [
    // Content Creation ($833/day)
    { id: 'inc1', name: 'AI Blog Empire', category: 'content', dailyTarget: 300, currentDaily: 180, monthlyRevenue: 5400, platforms: ['Medium', 'Substack', 'Ghost'], status: 'scaling', growth: 15 },
    { id: 'inc2', name: 'YouTube Automation', category: 'content', dailyTarget: 400, currentDaily: 250, monthlyRevenue: 7500, platforms: ['YouTube'], status: 'active', growth: 22 },
    { id: 'inc3', name: 'TikTok Creator Fund', category: 'content', dailyTarget: 133, currentDaily: 95, monthlyRevenue: 2850, platforms: ['TikTok', 'Instagram Reels'], status: 'growing', growth: 30 },

    // Affiliate Marketing ($1,500/day)
    { id: 'inc4', name: 'Amazon Affiliate Network', category: 'affiliate', dailyTarget: 500, currentDaily: 320, monthlyRevenue: 9600, platforms: ['Amazon Associates'], status: 'active', growth: 18 },
    { id: 'inc5', name: 'High-Ticket Affiliate', category: 'affiliate', dailyTarget: 1000, currentDaily: 550, monthlyRevenue: 16500, platforms: ['ClickBank', 'ShareASale'], status: 'scaling', growth: 25 },

    // Digital Products ($2,500/day)
    { id: 'inc6', name: 'Notion Template Empire', category: 'digital-products', dailyTarget: 700, currentDaily: 480, monthlyRevenue: 14400, platforms: ['Gumroad', 'Etsy'], status: 'active', growth: 20 },
    { id: 'inc7', name: 'Online Course Platform', category: 'digital-products', dailyTarget: 1000, currentDaily: 650, monthlyRevenue: 19500, platforms: ['Teachable', 'Udemy'], status: 'active', growth: 12 },
    { id: 'inc8', name: 'Print-on-Demand', category: 'digital-products', dailyTarget: 800, currentDaily: 420, monthlyRevenue: 12600, platforms: ['Redbubble', 'Printful'], status: 'growing', growth: 28 },

    // Investments ($3,000/day)
    { id: 'inc9', name: 'Dividend Stock Portfolio', category: 'investments', dailyTarget: 1200, currentDaily: 980, monthlyRevenue: 29400, platforms: ['Robinhood', 'Vanguard'], status: 'stable', growth: 5, taxRate: 15 },
    { id: 'inc10', name: 'REITs & Real Estate', category: 'investments', dailyTarget: 1000, currentDaily: 850, monthlyRevenue: 25500, platforms: ['Fundrise', 'RealtyMogul'], status: 'stable', growth: 7, taxRate: 20 },
    { id: 'inc11', name: 'P2P Lending', category: 'investments', dailyTarget: 800, currentDaily: 620, monthlyRevenue: 18600, platforms: ['LendingClub', 'Prosper'], status: 'active', growth: 10 },

    // Crypto ($2,000/day)
    { id: 'inc12', name: 'Crypto Staking', category: 'crypto', dailyTarget: 1000, currentDaily: 720, monthlyRevenue: 21600, platforms: ['Coinbase', 'Kraken'], status: 'volatile', growth: 35 },
    { id: 'inc13', name: 'DeFi Yield Farming', category: 'crypto', dailyTarget: 1000, currentDaily: 580, monthlyRevenue: 17400, platforms: ['Uniswap', 'Aave'], status: 'volatile', growth: 40 },

    // Automation ($1,500/day)
    { id: 'inc14', name: 'AI SaaS Products', category: 'automation', dailyTarget: 800, currentDaily: 520, monthlyRevenue: 15600, platforms: ['Stripe'], status: 'scaling', growth: 45 },
    { id: 'inc15', name: 'API & Webhook Services', category: 'automation', dailyTarget: 700, currentDaily: 380, monthlyRevenue: 11400, platforms: ['Stripe', 'PayPal'], status: 'growing', growth: 38 },

    // Ecommerce ($1,000/day)
    { id: 'inc16', name: 'Dropshipping Stores', category: 'ecommerce', dailyTarget: 600, currentDaily: 340, monthlyRevenue: 10200, platforms: ['Shopify'], status: 'active', growth: 22 },
    { id: 'inc17', name: 'Amazon FBA', category: 'ecommerce', dailyTarget: 400, currentDaily: 250, monthlyRevenue: 7500, platforms: ['Amazon'], status: 'growing', growth: 18 }
  ],

  expenses: [
    { id: 'exp1', stream: 'AI Blog Empire', category: 'Software', amount: 150, frequency: 'monthly', description: 'Hosting, domain, tools' },
    { id: 'exp2', stream: 'YouTube Automation', category: 'Services', amount: 800, frequency: 'monthly', description: 'Video editors, thumbnail designers' },
    { id: 'exp3', stream: 'Amazon Affiliate Network', category: 'Advertising', amount: 500, frequency: 'monthly', description: 'Google Ads, Facebook Ads' },
    { id: 'exp4', stream: 'Notion Template Empire', category: 'Marketing', amount: 200, frequency: 'monthly', description: 'Social media ads' },
    { id: 'exp5', stream: 'Crypto Staking', category: 'Fees', amount: 100, frequency: 'monthly', description: 'Exchange fees, gas fees' },
    { id: 'exp6', stream: 'AI SaaS Products', category: 'Infrastructure', amount: 450, frequency: 'monthly', description: 'AWS, API costs, databases' },
    { id: 'exp7', stream: 'Dropshipping Stores', category: 'Software', amount: 300, frequency: 'monthly', description: 'Shopify, apps, tools' }
  ],

  transactions: [
    { id: 'tx1', date: '2025-11-20', source: 'YouTube Automation', amount: 250, type: 'income', description: 'Ad revenue' },
    { id: 'tx2', date: '2025-11-19', source: 'Amazon Affiliate', amount: 320, type: 'income', description: 'Commission payments' },
    { id: 'tx3', date: '2025-11-18', source: 'Crypto Staking', amount: 720, type: 'income', description: 'Staking rewards' },
    { id: 'tx4', date: '2025-11-17', source: 'Notion Templates', amount: 480, type: 'income', description: 'Template sales' },
    { id: 'tx5', date: '2025-11-16', source: 'Dividend Stocks', amount: 980, type: 'income', description: 'Dividend distribution' }
  ],

  withdrawals: [
    { id: 'wd1', date: '2025-11-15', method: 'PayPal', amount: 5000, status: 'completed', taxWithheld: 1250, netAmount: 3750, streams: ['YouTube', 'Amazon Affiliate'] },
    { id: 'wd2', date: '2025-11-10', method: 'Bank Transfer', amount: 8000, status: 'completed', taxWithheld: 2000, netAmount: 6000, streams: ['Dividend Stocks', 'REITs'] },
    { id: 'wd3', date: '2025-11-05', method: 'Stripe', amount: 3500, status: 'completed', taxWithheld: 875, netAmount: 2625, streams: ['AI SaaS', 'Notion Templates'] },
    { id: 'wd4', date: '2025-11-01', method: 'Bitcoin', amount: 2000, status: 'completed', taxWithheld: 500, netAmount: 1500, streams: ['Crypto Staking'] }
  ],

  taxRecords: [
    { quarter: 'Q1 2025', totalIncome: 95000, totalExpenses: 12000, taxableIncome: 83000, estimatedTax: 20750, taxPaid: 18000, taxDue: 2750, status: 'paid' },
    { quarter: 'Q2 2025', totalIncome: 108000, totalExpenses: 14500, taxableIncome: 93500, estimatedTax: 23375, taxPaid: 21000, taxDue: 2375, status: 'paid' },
    { quarter: 'Q3 2025', totalIncome: 125000, totalExpenses: 16000, taxableIncome: 109000, estimatedTax: 27250, taxPaid: 25000, taxDue: 2250, status: 'pending' },
    { quarter: 'Q4 2025', totalIncome: 142000, totalExpenses: 18000, taxableIncome: 124000, estimatedTax: 31000, taxPaid: 28000, taxDue: 3000, status: 'accruing' }
  ]
};

// ============================================
// D&D SEED DATA
// ============================================

const dndSeedData: DnDSeedData = {
  characters: [
    {
      id: 'char1',
      name: 'Shadowblade',
      race: 'Tiefling',
      class: 'Rogue',
      level: 5,
      stats: { str: 10, dex: 18, con: 14, int: 12, wis: 13, cha: 16 },
      hp: 38,
      maxHp: 38,
      ac: 16,
      background: 'Criminal',
      alignment: 'Chaotic Neutral',
      equipment: ['Rapier', 'Shortbow', 'Thieves\' Tools', 'Leather Armor', 'Cloak of Elvenkind'],
      gold: 450,
      xp: 6500,
      skills: ['Stealth', 'Sleight of Hand', 'Deception', 'Perception'],
      created: '2025-11-15'
    },
    {
      id: 'char2',
      name: 'Thordak Ironfist',
      race: 'Dwarf',
      class: 'Fighter',
      level: 6,
      stats: { str: 18, dex: 12, con: 17, int: 10, wis: 14, cha: 8 },
      hp: 62,
      maxHp: 62,
      ac: 19,
      background: 'Soldier',
      alignment: 'Lawful Good',
      equipment: ['Battleaxe', 'Shield', 'Plate Armor', 'Potion of Healing x3'],
      gold: 680,
      xp: 14000,
      skills: ['Athletics', 'Intimidation', 'Survival'],
      created: '2025-11-10'
    },
    {
      id: 'char3',
      name: 'Lyra Moonwhisper',
      race: 'Elf',
      class: 'Wizard',
      level: 4,
      stats: { str: 8, dex: 14, con: 12, int: 18, wis: 15, cha: 11 },
      hp: 24,
      maxHp: 24,
      ac: 12,
      background: 'Sage',
      alignment: 'Neutral Good',
      equipment: ['Staff', 'Spellbook', 'Robes', 'Component Pouch', 'Ring of Mind Shielding'],
      gold: 320,
      xp: 2700,
      skills: ['Arcana', 'History', 'Investigation', 'Insight'],
      spells: ['Fireball', 'Magic Missile', 'Shield', 'Detect Magic', 'Misty Step'],
      created: '2025-11-18'
    }
  ],

  campaigns: [
    {
      id: 'camp1',
      name: 'The Lost Temple of Shadows',
      description: 'A mysterious temple has appeared in the mountains, rumored to contain ancient artifacts of immense power.',
      dmType: 'AI',
      players: ['Shadowblade', 'Thordak Ironfist'],
      sessions: 8,
      currentLevel: 5,
      location: 'Shadow Mountains',
      status: 'active',
      started: '2025-10-15'
    },
    {
      id: 'camp2',
      name: 'Dragon\'s Hoard Heist',
      description: 'Your party plans to steal from an ancient red dragon\'s treasure hoard.',
      dmType: 'AI',
      players: ['Shadowblade'],
      sessions: 3,
      currentLevel: 4,
      location: 'Volcanic Peaks',
      status: 'active',
      started: '2025-11-10'
    },
    {
      id: 'camp3',
      name: 'The Underdark Expedition',
      description: 'Explore the dangerous caverns beneath the world in search of a missing expedition.',
      dmType: 'AI',
      players: ['Lyra Moonwhisper', 'Thordak Ironfist'],
      sessions: 2,
      currentLevel: 4,
      location: 'The Underdark',
      status: 'active',
      started: '2025-11-18'
    }
  ],

  sessions: [
    {
      id: 'session1',
      campaign: 'The Lost Temple of Shadows',
      sessionNumber: 8,
      date: '2025-11-19',
      duration: '3 hours',
      summary: 'The party discovered a hidden chamber containing an ancient artifact. Shadowblade disarmed several deadly traps while Thordak held off a horde of undead guardians.',
      encounters: ['Trap: Poison Darts', 'Combat: 6 Skeletons', 'Puzzle: Stone Disk Lock'],
      loot: ['Ancient Amulet', '450 gold', 'Scroll of Fireball'],
      xpGained: 1200
    },
    {
      id: 'session2',
      campaign: 'Dragon\'s Hoard Heist',
      sessionNumber: 3,
      date: '2025-11-17',
      duration: '2.5 hours',
      summary: 'Shadowblade scouted the dragon\'s lair and discovered the best entry point. Plans are being made for the heist.',
      encounters: ['Stealth Challenge', 'Information Gathering'],
      loot: ['Map of Dragon Lair'],
      xpGained: 600
    }
  ],

  inventory: [
    { id: 'item1', character: 'Shadowblade', name: 'Cloak of Elvenkind', type: 'Wondrous Item', rarity: 'Uncommon', attunement: true, description: 'Advantage on Stealth checks' },
    { id: 'item2', character: 'Shadowblade', name: 'Potion of Healing', type: 'Potion', rarity: 'Common', quantity: 5, description: 'Heal 2d4+2 HP' },
    { id: 'item3', character: 'Thordak Ironfist', name: 'Battleaxe +1', type: 'Weapon', rarity: 'Uncommon', attunement: false, description: '+1 to attack and damage rolls' },
    { id: 'item4', character: 'Thordak Ironfist', name: 'Potion of Greater Healing', type: 'Potion', rarity: 'Uncommon', quantity: 3, description: 'Heal 4d4+4 HP' },
    { id: 'item5', character: 'Lyra Moonwhisper', name: 'Ring of Mind Shielding', type: 'Ring', rarity: 'Uncommon', attunement: true, description: 'Immune to magic that reads thoughts' },
    { id: 'item6', character: 'Lyra Moonwhisper', name: 'Scroll of Fireball', type: 'Scroll', rarity: 'Uncommon', quantity: 2, description: 'Cast Fireball once' }
  ]
};

// ============================================
// SMART HOME SEED DATA
// ============================================

const smartHomeSeedData: SmartHomeSeedData = {
  devices: [
    { id: 'light-living-room', name: 'Living Room Lights', type: 'light', platform: 'Philips Hue', status: 'on', brightness: 80, color: 'warm white', room: 'Living Room' },
    { id: 'light-bedroom', name: 'Bedroom Lights', type: 'light', platform: 'Philips Hue', status: 'off', brightness: 50, color: 'purple', room: 'Bedroom' },
    { id: 'light-kitchen', name: 'Kitchen Lights', type: 'light', platform: 'SmartThings', status: 'on', brightness: 100, color: 'daylight', room: 'Kitchen' },
    { id: 'thermostat-main', name: 'Main Thermostat', type: 'thermostat', platform: 'Google Home', status: 'on', temperature: 72, mode: 'cool', room: 'Hallway' },
    { id: 'lock-front-door', name: 'Front Door Lock', type: 'lock', platform: 'SmartThings', status: 'locked', room: 'Entrance' },
    { id: 'camera-doorbell', name: 'Doorbell Camera', type: 'camera', platform: 'Ring', status: 'on', recording: true, room: 'Entrance' },
    { id: 'speaker-living-room', name: 'Living Room Speaker', type: 'speaker', platform: 'Google Home', status: 'on', volume: 40, playing: 'Lofi Beats', room: 'Living Room' },
    { id: 'tv-living-room', name: 'Living Room TV', type: 'tv', platform: 'Google Cast', status: 'off', room: 'Living Room' },
    { id: 'plug-bedroom-fan', name: 'Bedroom Fan', type: 'plug', platform: 'SmartThings', status: 'on', power: 45, room: 'Bedroom' }
  ],

  scenes: [
    { id: 'scene-morning', name: 'Morning Routine', devices: ['light-bedroom', 'light-kitchen', 'thermostat-main'], actions: { brightness: 100, temperature: 70, color: 'daylight' }, trigger: 'time:7:00am' },
    { id: 'scene-dnd-combat', name: 'D&D Combat Mode', devices: ['light-living-room', 'speaker-living-room'], actions: { brightness: 30, color: 'red', music: 'Epic Battle Music' }, trigger: 'manual' },
    { id: 'scene-dnd-tavern', name: 'D&D Tavern', devices: ['light-living-room', 'speaker-living-room'], actions: { brightness: 60, color: 'warm', music: 'Medieval Tavern Ambience' }, trigger: 'manual' },
    { id: 'scene-sleep', name: 'Sleep Mode', devices: ['light-bedroom', 'light-living-room', 'lock-front-door', 'thermostat-main'], actions: { brightness: 0, locked: true, temperature: 68 }, trigger: 'time:10:30pm' },
    { id: 'scene-low-bp', name: 'Low BP Rest', devices: ['light-living-room', 'speaker-living-room'], actions: { brightness: 40, color: 'warm', music: 'Calm Piano' }, trigger: 'health:low-bp' },
    { id: 'scene-celebration', name: 'Celebration', devices: ['light-living-room', 'light-kitchen'], actions: { brightness: 100, color: 'rainbow-cycle', effect: 'pulse' }, trigger: 'event:achievement' },
    { id: 'scene-focus', name: 'Focus Mode', devices: ['light-living-room', 'speaker-living-room'], actions: { brightness: 80, color: 'daylight', music: 'Focus Beats' }, trigger: 'manual' }
  ],

  automations: [
    { id: 'auto1', name: 'Welcome Home', trigger: 'lock:unlock', action: 'Turn on living room lights', enabled: true },
    { id: 'auto2', name: 'Energy Saver', trigger: 'time:2:00am', action: 'Turn off all unnecessary devices', enabled: true },
    { id: 'auto3', name: 'Morning Wake Up', trigger: 'time:7:00am', action: 'Gradual lights + coffee maker', enabled: true },
    { id: 'auto4', name: 'D&D Scene Response', trigger: 'dnd:combat-start', action: 'Activate Combat Mode scene', enabled: true },
    { id: 'auto5', name: 'Health Response', trigger: 'health:vitals-alert', action: 'Dim lights + play calming music', enabled: true }
  ],

  history: [
    { device: 'light-living-room', action: 'turned on', timestamp: '2025-11-20T08:00:00Z', triggeredBy: 'automation:morning' },
    { device: 'light-living-room', action: 'set to red 30%', timestamp: '2025-11-19T20:15:00Z', triggeredBy: 'scene:dnd-combat' },
    { device: 'thermostat-main', action: 'set to 68°F', timestamp: '2025-11-19T22:30:00Z', triggeredBy: 'scene:sleep' },
    { device: 'lock-front-door', action: 'locked', timestamp: '2025-11-19T22:30:00Z', triggeredBy: 'scene:sleep' },
    { device: 'speaker-living-room', action: 'play Epic Battle Music', timestamp: '2025-11-19T20:15:00Z', triggeredBy: 'scene:dnd-combat' }
  ]
};

// ============================================
// WELLNESS SEED DATA
// ============================================

const wellnessSeedData: WellnessSeedData = {
  moods: [
    { id: 'm1', date: '2025-11-20', mood: 'Content', score: 7, energy: 6, pain: 4, notes: 'Good day overall, managed to be productive', tags: ['productive', 'stable'] },
    { id: 'm2', date: '2025-11-19', mood: 'Happy', score: 8, energy: 7, pain: 3, notes: 'Great D&D session! Felt accomplished', tags: ['creative', 'social', 'happy'] },
    { id: 'm3', date: '2025-11-18', mood: 'Tired', score: 5, energy: 3, pain: 6, notes: 'Low energy, needed extra rest', tags: ['fatigue', 'low-spoons'] },
    { id: 'm4', date: '2025-11-17', mood: 'Anxious', score: 4, energy: 4, pain: 5, notes: 'Worried about appointments, used grounding', tags: ['anxiety', 'grounding-used'] },
    { id: 'm5', date: '2025-11-16', mood: 'Motivated', score: 7, energy: 6, pain: 4, notes: 'Started new project, feeling inspired', tags: ['motivated', 'creative'] }
  ],

  activities: [
    { id: 'act1', date: '2025-11-20', activity: 'Gentle yoga', duration: 20, mood: 'better', notes: 'Helped with morning stiffness' },
    { id: 'act2', date: '2025-11-19', activity: 'D&D session', duration: 180, mood: 'happy', notes: 'So much fun! Great storyline' },
    { id: 'act3', date: '2025-11-18', activity: 'Art therapy', duration: 45, mood: 'calm', notes: 'Watercolor painting - very relaxing' },
    { id: 'act4', date: '2025-11-17', activity: 'Grounding exercises', duration: 10, mood: 'stable', notes: '5-4-3-2-1 technique worked well' },
    { id: 'act5', date: '2025-11-16', activity: 'Walk outside', duration: 30, mood: 'better', notes: 'Fresh air helped energy levels' }
  ],

  groundingLogs: [
    { id: 'g1', date: '2025-11-20T14:30:00Z', technique: '5-4-3-2-1 Sensory', duration: 8, effectiveness: 9, trigger: 'Anxiety spike', notes: 'Very effective, felt much calmer after' },
    { id: 'g2', date: '2025-11-19T09:15:00Z', technique: 'Square breathing', duration: 5, effectiveness: 8, trigger: 'Morning anxiety', notes: 'Good way to start the day' },
    { id: 'g3', date: '2025-11-17T16:00:00Z', technique: 'Body scan', duration: 12, effectiveness: 7, trigger: 'Pain distraction', notes: 'Helped refocus attention' },
    { id: 'g4', date: '2025-11-16T21:00:00Z', technique: 'Progressive muscle relaxation', duration: 15, effectiveness: 9, trigger: 'Pre-sleep routine', notes: 'Slept better than usual' }
  ],

  celebrations: [
    { id: 'cel1', date: '2025-11-20', achievement: 'Completed daily tasks', magnitude: 'small', response: 'AI cheerleader mode', notes: 'Celebrated finishing todo list!' },
    { id: 'cel2', date: '2025-11-19', achievement: 'D&D character leveled up to 5', magnitude: 'medium', response: 'Rainbow lights + victory music', notes: 'Level 5! Unlocked new abilities!' },
    { id: 'cel3', date: '2025-11-18', achievement: 'Took shower on low-spoon day', magnitude: 'medium', response: 'AI cheerleader validation', notes: 'Hygiene on hard day = huge win' },
    { id: 'cel4', date: '2025-11-15', achievement: 'Made it to doctor appointment', magnitude: 'large', response: 'Full celebration scene', notes: 'Overcame anxiety and made it!' },
    { id: 'cel5', date: '2025-11-12', achievement: 'Cooked a meal', magnitude: 'small', response: 'Positive affirmation', notes: 'Nutrition + accomplishment' }
  ]
};

// ============================================
// PRODUCTIVITY SEED DATA
// ============================================

const productivitySeedData: ProductivitySeedData = {
  tasks: [
    { id: 'task1', title: 'Refill medications', due: '2025-11-22', priority: 'high', category: 'health', completed: false, estimatedSpoons: 3 },
    { id: 'task2', title: 'Call cardiologist office', due: '2025-11-21', priority: 'high', category: 'health', completed: false, estimatedSpoons: 2 },
    { id: 'task3', title: 'Upload new Notion templates', due: '2025-11-23', priority: 'medium', category: 'income', completed: false, estimatedSpoons: 4 },
    { id: 'task4', title: 'Update YouTube video descriptions', due: '2025-11-25', priority: 'medium', category: 'income', completed: false, estimatedSpoons: 3 },
    { id: 'task5', title: 'Pay rent', due: '2025-12-01', priority: 'high', category: 'finance', completed: false, estimatedSpoons: 1 },
    { id: 'task6', title: 'Plan next D&D session', due: '2025-11-24', priority: 'low', category: 'entertainment', completed: false, estimatedSpoons: 2 },
    { id: 'task7', title: 'Laundry', due: '2025-11-21', priority: 'medium', category: 'household', completed: false, estimatedSpoons: 5 },
    { id: 'task8', title: 'Grocery shopping', due: '2025-11-22', priority: 'medium', category: 'household', completed: false, estimatedSpoons: 6 }
  ],

  projects: [
    { id: 'proj1', name: 'Notion Template Empire', status: 'active', progress: 65, category: 'income', tasks: ['Create 5 new templates', 'Market on Pinterest', 'Update descriptions'], deadline: '2025-12-31' },
    { id: 'proj2', name: 'YouTube Automation Expansion', status: 'active', progress: 40, category: 'income', tasks: ['Hire new editor', 'Research trending topics', 'Batch 20 videos'], deadline: '2025-12-15' },
    { id: 'proj3', name: 'Health Tracking Optimization', status: 'active', progress: 80, category: 'health', tasks: ['Set up automated reminders', 'Create symptom correlation charts'], deadline: '2025-11-30' },
    { id: 'proj4', name: 'Smart Home Scene Expansion', status: 'planning', progress: 20, category: 'home', tasks: ['Design 5 new scenes', 'Test automations', 'Document triggers'], deadline: '2026-01-15' }
  ],

  notes: [
    { id: 'note1', title: 'Doctor Appointment Notes - 2025-11-15', content: 'Dr. Chen suggested trying increased salt intake. Discussed new exercise tolerance test results. BP improving with current meds.', category: 'health', tags: ['doctor', 'POTS', 'medications'], created: '2025-11-15' },
    { id: 'note2', title: 'YouTube Video Ideas', content: '1. "Passive Income for Chronic Illness" 2. "Smart Home Accessibility" 3. "Low-Spoon Productivity Hacks" 4. "D&D for Beginners"', category: 'income', tags: ['youtube', 'content-ideas'], created: '2025-11-18' },
    { id: 'note3', title: 'D&D Campaign Plot Twists', content: 'The ancient artifact is actually a prison for a demon lord. The party must decide: destroy it and unleash the demon, or keep it intact and risk it falling into wrong hands.', category: 'entertainment', tags: ['dnd', 'storytelling'], created: '2025-11-19' },
    { id: 'note4', title: 'Grounding Techniques That Work', content: '5-4-3-2-1 sensory (9/10), Square breathing (8/10), Cold water on wrists (7/10), Progressive muscle relaxation (9/10)', category: 'wellness', tags: ['grounding', 'mental-health'], created: '2025-11-17' }
  ],

  goals: [
    { id: 'goal1', title: 'Reach $12,000/day passive income', target: 12000, current: 7293, unit: 'USD/day', category: 'finance', deadline: '2026-12-31', progress: 61 },
    { id: 'goal2', title: 'Maintain consistent vitals tracking', target: 30, current: 23, unit: 'days', category: 'health', deadline: '2025-12-31', progress: 77 },
    { id: 'goal3', title: 'Complete 10 D&D campaigns', target: 10, current: 3, unit: 'campaigns', category: 'entertainment', deadline: '2026-06-30', progress: 30 },
    { id: 'goal4', title: 'Upload 100 Notion templates', target: 100, current: 47, unit: 'templates', category: 'income', deadline: '2026-03-31', progress: 47 },
    { id: 'goal5', title: 'Daily mood logging streak', target: 365, current: 87, unit: 'days', category: 'wellness', deadline: '2026-11-20', progress: 24 }
  ]
};

// ============================================
// INTEGRATIONS SEED DATA (54+ services)
// ============================================

const integrationsSeedData: IntegrationsSeedData = {
  connections: [
    // Smart Home (4)
    { id: 'int1', service: 'SmartThings', category: 'smart-home', status: 'connected', lastSync: '2025-11-20T12:00:00Z', devices: 12, apiKey: 'st_***abc123' },
    { id: 'int2', service: 'Google Home', category: 'smart-home', status: 'connected', lastSync: '2025-11-20T12:05:00Z', devices: 8, oauth: true },
    { id: 'int3', service: 'Amazon Alexa', category: 'smart-home', status: 'connected', lastSync: '2025-11-20T11:50:00Z', devices: 6, oauth: true },
    { id: 'int4', service: 'Philips Hue', category: 'smart-home', status: 'connected', lastSync: '2025-11-20T12:10:00Z', devices: 15, apiKey: 'hue_***xyz789' },

    // Music & Entertainment (11)
    { id: 'int5', service: 'Spotify', category: 'music', status: 'connected', lastSync: '2025-11-20T10:30:00Z', oauth: true, premium: true },
    { id: 'int6', service: 'YouTube Music', category: 'music', status: 'connected', lastSync: '2025-11-20T09:15:00Z', oauth: true },
    { id: 'int7', service: 'SoundCloud', category: 'music', status: 'connected', lastSync: '2025-11-19T18:00:00Z', oauth: true },
    { id: 'int8', service: 'Apple Music', category: 'music', status: 'pending', lastSync: null, oauth: false },
    { id: 'int9', service: 'Pandora', category: 'music', status: 'connected', lastSync: '2025-11-18T20:00:00Z', oauth: true },
    { id: 'int10', service: 'Tidal', category: 'music', status: 'connected', lastSync: '2025-11-17T14:00:00Z', oauth: true },
    { id: 'int11', service: 'Last.fm', category: 'music', status: 'connected', lastSync: '2025-11-20T11:00:00Z', apiKey: 'lfm_***def456' },
    { id: 'int12', service: 'Twitch', category: 'entertainment', status: 'connected', lastSync: '2025-11-19T22:00:00Z', oauth: true },
    { id: 'int13', service: 'Discord', category: 'entertainment', status: 'connected', lastSync: '2025-11-20T08:00:00Z', oauth: true },
    { id: 'int14', service: 'Steam', category: 'entertainment', status: 'connected', lastSync: '2025-11-18T15:00:00Z', apiKey: 'steam_***ghi789' },
    { id: 'int15', service: 'Netflix', category: 'entertainment', status: 'manual', lastSync: null, oauth: false },

    // Productivity (11)
    { id: 'int16', service: 'Notion', category: 'productivity', status: 'connected', lastSync: '2025-11-20T12:30:00Z', oauth: true, integration: true },
    { id: 'int17', service: 'Todoist', category: 'productivity', status: 'connected', lastSync: '2025-11-20T10:00:00Z', apiKey: 'td_***jkl012' },
    { id: 'int18', service: 'Trello', category: 'productivity', status: 'connected', lastSync: '2025-11-19T16:00:00Z', oauth: true },
    { id: 'int19', service: 'Asana', category: 'productivity', status: 'connected', lastSync: '2025-11-18T11:00:00Z', oauth: true },
    { id: 'int20', service: 'Slack', category: 'productivity', status: 'connected', lastSync: '2025-11-20T09:00:00Z', oauth: true },
    { id: 'int21', service: 'Google Calendar', category: 'productivity', status: 'connected', lastSync: '2025-11-20T12:00:00Z', oauth: true },
    { id: 'int22', service: 'Gmail', category: 'productivity', status: 'connected', lastSync: '2025-11-20T12:00:00Z', oauth: true, accounts: 3 },
    { id: 'int23', service: 'Google Drive', category: 'productivity', status: 'connected', lastSync: '2025-11-20T11:30:00Z', oauth: true },
    { id: 'int24', service: 'Dropbox', category: 'productivity', status: 'connected', lastSync: '2025-11-19T14:00:00Z', oauth: true },
    { id: 'int25', service: 'Evernote', category: 'productivity', status: 'connected', lastSync: '2025-11-17T10:00:00Z', oauth: true },
    { id: 'int26', service: 'Microsoft 365', category: 'productivity', status: 'pending', lastSync: null, oauth: false },

    // Finance (8)
    { id: 'int27', service: 'PayPal', category: 'finance', status: 'connected', lastSync: '2025-11-20T08:00:00Z', oauth: true, business: true },
    { id: 'int28', service: 'Stripe', category: 'finance', status: 'connected', lastSync: '2025-11-20T08:05:00Z', apiKey: 'sk_***mno345' },
    { id: 'int29', service: 'Venmo', category: 'finance', status: 'connected', lastSync: '2025-11-19T12:00:00Z', oauth: true },
    { id: 'int30', service: 'Cash App', category: 'finance', status: 'connected', lastSync: '2025-11-18T16:00:00Z', oauth: true },
    { id: 'int31', service: 'Robinhood', category: 'finance', status: 'connected', lastSync: '2025-11-20T07:00:00Z', oauth: true },
    { id: 'int32', service: 'Coinbase', category: 'finance', status: 'connected', lastSync: '2025-11-20T07:30:00Z', oauth: true },
    { id: 'int33', service: 'Mint', category: 'finance', status: 'connected', lastSync: '2025-11-19T20:00:00Z', oauth: true },
    { id: 'int34', service: 'Google Pay', category: 'finance', status: 'connected', lastSync: '2025-11-20T09:00:00Z', oauth: true },

    // Health & Fitness (7)
    { id: 'int35', service: 'Google Fit', category: 'health', status: 'connected', lastSync: '2025-11-20T12:00:00Z', oauth: true },
    { id: 'int36', service: 'Fitbit', category: 'health', status: 'connected', lastSync: '2025-11-20T11:00:00Z', oauth: true },
    { id: 'int37', service: 'Apple Health', category: 'health', status: 'pending', lastSync: null, oauth: false },
    { id: 'int38', service: 'Strava', category: 'health', status: 'connected', lastSync: '2025-11-19T17:00:00Z', oauth: true },
    { id: 'int39', service: 'MyFitnessPal', category: 'health', status: 'connected', lastSync: '2025-11-20T08:00:00Z', oauth: true },
    { id: 'int40', service: 'Peloton', category: 'health', status: 'manual', lastSync: null, oauth: false },
    { id: 'int41', service: 'Headspace', category: 'health', status: 'connected', lastSync: '2025-11-19T21:00:00Z', oauth: true },

    // Shopping (9)
    { id: 'int42', service: 'Amazon', category: 'shopping', status: 'connected', lastSync: '2025-11-20T10:00:00Z', oauth: true, associate: true },
    { id: 'int43', service: 'Walmart', category: 'shopping', status: 'manual', lastSync: null, oauth: false },
    { id: 'int44', service: 'Target', category: 'shopping', status: 'manual', lastSync: null, oauth: false },
    { id: 'int45', service: 'Etsy', category: 'shopping', status: 'connected', lastSync: '2025-11-19T13:00:00Z', oauth: true, seller: true },
    { id: 'int46', service: 'Shopify', category: 'shopping', status: 'connected', lastSync: '2025-11-20T09:00:00Z', apiKey: 'shp_***pqr678', store: 'dropship-store' },
    { id: 'int47', service: 'eBay', category: 'shopping', status: 'connected', lastSync: '2025-11-18T14:00:00Z', oauth: true },
    { id: 'int48', service: 'Instacart', category: 'shopping', status: 'manual', lastSync: null, oauth: false },
    { id: 'int49', service: 'Uber Eats', category: 'shopping', status: 'connected', lastSync: '2025-11-19T19:00:00Z', oauth: true },
    { id: 'int50', service: 'DoorDash', category: 'shopping', status: 'connected', lastSync: '2025-11-20T07:00:00Z', oauth: true },

    // Transportation (4)
    { id: 'int51', service: 'Uber', category: 'transportation', status: 'connected', lastSync: '2025-11-18T22:00:00Z', oauth: true },
    { id: 'int52', service: 'Lyft', category: 'transportation', status: 'connected', lastSync: '2025-11-17T15:00:00Z', oauth: true },
    { id: 'int53', service: 'Airbnb', category: 'transportation', status: 'manual', lastSync: null, oauth: false },
    { id: 'int54', service: 'Google Maps', category: 'transportation', status: 'connected', lastSync: '2025-11-20T12:00:00Z', oauth: true }
  ],

  syncHistory: [
    { service: 'Spotify', timestamp: '2025-11-20T10:30:00Z', status: 'success', itemsSynced: 1247, duration: 3200 },
    { service: 'Google Calendar', timestamp: '2025-11-20T12:00:00Z', status: 'success', itemsSynced: 45, duration: 1800 },
    { service: 'PayPal', timestamp: '2025-11-20T08:00:00Z', status: 'success', itemsSynced: 23, duration: 2100 },
    { service: 'SmartThings', timestamp: '2025-11-20T12:00:00Z', status: 'success', itemsSynced: 12, duration: 1500 },
    { service: 'Coinbase', timestamp: '2025-11-20T07:30:00Z', status: 'success', itemsSynced: 8, duration: 2800 }
  ],

  apiKeys: [
    { service: 'SmartThings', key: 'st_***abc123', created: '2025-01-15', lastUsed: '2025-11-20', status: 'active', scopes: ['devices:read', 'devices:write'] },
    { service: 'Philips Hue', key: 'hue_***xyz789', created: '2025-02-01', lastUsed: '2025-11-20', status: 'active', scopes: ['lights:control'] },
    { service: 'Stripe', key: 'sk_***mno345', created: '2024-11-10', lastUsed: '2025-11-20', status: 'active', scopes: ['payments:read', 'payouts:write'] },
    { service: 'Todoist', key: 'td_***jkl012', created: '2025-03-15', lastUsed: '2025-11-20', status: 'active', scopes: ['data:read_write'] },
    { service: 'Shopify', key: 'shp_***pqr678', created: '2025-05-20', lastUsed: '2025-11-20', status: 'active', scopes: ['read_products', 'write_orders'] }
  ]
};

// ============================================
// SEED DATA LOADER
// ============================================

export class SeedDataLoader {
  async loadAllSeedData(): Promise<SeedData> {
    console.log('🌱 Loading comprehensive seed data...');

    const seedData: SeedData = {
      health: healthSeedData,
      finance: financeSeedData,
      dnd: dndSeedData,
      smartHome: smartHomeSeedData,
      wellness: wellnessSeedData,
      productivity: productivitySeedData,
      integrations: integrationsSeedData
    };

    // Store in localStorage for persistence
    localStorage.setItem('seed-data-loaded', 'true');
    localStorage.setItem('seed-data-timestamp', new Date().toISOString());

    // Store each category
    localStorage.setItem('health-seed-data', JSON.stringify(healthSeedData));
    localStorage.setItem('finance-seed-data', JSON.stringify(financeSeedData));
    localStorage.setItem('dnd-seed-data', JSON.stringify(dndSeedData));
    localStorage.setItem('smart-home-seed-data', JSON.stringify(smartHomeSeedData));
    localStorage.setItem('wellness-seed-data', JSON.stringify(wellnessSeedData));
    localStorage.setItem('productivity-seed-data', JSON.stringify(productivitySeedData));
    localStorage.setItem('integrations-seed-data', JSON.stringify(integrationsSeedData));

    console.log('✅ Seed data loaded successfully!');
    console.log('📊 Statistics:');
    console.log(`   Health: ${healthSeedData.vitals.length} vitals, ${healthSeedData.medications.length} meds`);
    console.log(`   Finance: ${financeSeedData.incomeStreams.length} income streams, ${financeSeedData.withdrawals.length} withdrawals`);
    console.log(`   D&D: ${dndSeedData.characters.length} characters, ${dndSeedData.campaigns.length} campaigns`);
    console.log(`   Smart Home: ${smartHomeSeedData.devices.length} devices, ${smartHomeSeedData.scenes.length} scenes`);
    console.log(`   Wellness: ${wellnessSeedData.moods.length} mood entries, ${wellnessSeedData.celebrations.length} celebrations`);
    console.log(`   Productivity: ${productivitySeedData.tasks.length} tasks, ${productivitySeedData.goals.length} goals`);
    console.log(`   Integrations: ${integrationsSeedData.connections.length} services connected`);

    return seedData;
  }

  getSeedData(): SeedData | null {
    if (localStorage.getItem('seed-data-loaded') !== 'true') {
      return null;
    }

    return {
      health: JSON.parse(localStorage.getItem('health-seed-data') || '{}'),
      finance: JSON.parse(localStorage.getItem('finance-seed-data') || '{}'),
      dnd: JSON.parse(localStorage.getItem('dnd-seed-data') || '{}'),
      smartHome: JSON.parse(localStorage.getItem('smart-home-seed-data') || '{}'),
      wellness: JSON.parse(localStorage.getItem('wellness-seed-data') || '{}'),
      productivity: JSON.parse(localStorage.getItem('productivity-seed-data') || '{}'),
      integrations: JSON.parse(localStorage.getItem('integrations-seed-data') || '{}')
    };
  }

  clearSeedData(): void {
    localStorage.removeItem('seed-data-loaded');
    localStorage.removeItem('seed-data-timestamp');
    localStorage.removeItem('health-seed-data');
    localStorage.removeItem('finance-seed-data');
    localStorage.removeItem('dnd-seed-data');
    localStorage.removeItem('smart-home-seed-data');
    localStorage.removeItem('wellness-seed-data');
    localStorage.removeItem('productivity-seed-data');
    localStorage.removeItem('integrations-seed-data');
    console.log('🗑️ Seed data cleared');
  }
}

// Auto-load seed data on first run
const seedLoader = new SeedDataLoader();
if (localStorage.getItem('seed-data-loaded') !== 'true') {
  seedLoader.loadAllSeedData();
}

export default seedLoader;
