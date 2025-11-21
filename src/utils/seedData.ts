/**
 * Comprehensive Seed Data System
 * Populates all features with realistic, helpful data for the app
 */

import { db } from './database';
import { dndService } from '../services/dndService';
import { ancestryService } from '../services/ancestryService';

// ============= UTILITY FUNCTIONS =============

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomChoices = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const hoursAgo = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

// ============= 1. HEALTH DATA =============

export async function seedHealthData() {
  console.log('Seeding health data...');

  // Vitals logs for past 30 days
  const vitals = [];
  for (let i = 30; i >= 0; i--) {
    // Morning reading
    vitals.push({
      timestamp: new Date(daysAgo(i).setHours(8, 0, 0)),
      bloodPressureSystolic: randomInt(110, 135),
      bloodPressureDiastolic: randomInt(70, 88),
      heartRate: randomInt(65, 80),
      oxygenLevel: randomInt(95, 99),
      temperature: randomFloat(97.5, 98.6),
      notes: i === 0 ? 'Feeling good today' : i === 5 ? 'Slight headache' : '',
      tags: i < 3 ? ['morning', 'baseline'] : ['morning']
    });

    // Evening reading
    vitals.push({
      timestamp: new Date(daysAgo(i).setHours(20, 0, 0)),
      bloodPressureSystolic: randomInt(115, 140),
      bloodPressureDiastolic: randomInt(72, 90),
      heartRate: randomInt(68, 85),
      oxygenLevel: randomInt(95, 99),
      notes: '',
      tags: ['evening']
    });
  }
  await db.vitals.bulkAdd(vitals);

  // Medications - realistic chronic illness meds
  const medications = [
    {
      drugName: 'Metoprolol',
      genericName: 'Metoprolol Tartrate',
      strength: '25mg',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      prescriber: 'Dr. Sarah Chen',
      pharmacy: 'CVS Pharmacy',
      status: 'Active' as const,
      startDate: daysAgo(180),
      refills: 3,
      notes: 'Take with food. For blood pressure management.',
      lastTaken: hoursAgo(8),
      nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000),
      taken: true
    },
    {
      drugName: 'Lisinopril',
      genericName: 'Lisinopril',
      strength: '10mg',
      dosage: '1 tablet',
      frequency: 'Once daily (morning)',
      prescriber: 'Dr. Sarah Chen',
      pharmacy: 'CVS Pharmacy',
      status: 'Active' as const,
      startDate: daysAgo(365),
      refills: 5,
      notes: 'ACE inhibitor for hypertension. Stay hydrated.',
      lastTaken: hoursAgo(2),
      nextDose: new Date(Date.now() + 22 * 60 * 60 * 1000),
      taken: true
    },
    {
      drugName: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      strength: '2000 IU',
      dosage: '1 capsule',
      frequency: 'Once daily',
      prescriber: 'Dr. Sarah Chen',
      pharmacy: 'Walgreens',
      status: 'Active' as const,
      startDate: daysAgo(90),
      refills: 2,
      notes: 'Take with fatty meal for better absorption.',
      lastTaken: hoursAgo(3),
      nextDose: new Date(Date.now() + 21 * 60 * 60 * 1000),
      taken: true
    },
    {
      drugName: 'Gabapentin',
      genericName: 'Gabapentin',
      strength: '300mg',
      dosage: '1 capsule',
      frequency: 'Three times daily',
      prescriber: 'Dr. Michael Torres',
      pharmacy: 'CVS Pharmacy',
      status: 'Active' as const,
      startDate: daysAgo(120),
      refills: 1,
      notes: 'For nerve pain. May cause drowsiness.',
      lastTaken: hoursAgo(6),
      nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000),
      taken: true
    },
    {
      drugName: 'Omeprazole',
      genericName: 'Omeprazole',
      strength: '20mg',
      dosage: '1 capsule',
      frequency: 'Once daily (before breakfast)',
      prescriber: 'Dr. Sarah Chen',
      pharmacy: 'Walgreens',
      status: 'Active' as const,
      startDate: daysAgo(200),
      refills: 4,
      notes: 'For acid reflux. Take 30 min before eating.',
      lastTaken: hoursAgo(4),
      nextDose: new Date(Date.now() + 20 * 60 * 60 * 1000),
      taken: true
    },
    {
      drugName: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      strength: '81mg',
      dosage: '1 tablet',
      frequency: 'Once daily',
      prescriber: 'Dr. Sarah Chen',
      pharmacy: 'CVS Pharmacy',
      status: 'Active' as const,
      startDate: daysAgo(400),
      refills: 6,
      notes: 'Low-dose aspirin for cardiovascular health.',
      lastTaken: hoursAgo(2),
      nextDose: new Date(Date.now() + 22 * 60 * 60 * 1000),
      taken: true
    }
  ];
  await db.medications.bulkAdd(medications);

  // Hydration logs
  const hydrationLogs = [];
  for (let i = 30; i >= 0; i--) {
    const logsPerDay = randomInt(4, 8);
    for (let j = 0; j < logsPerDay; j++) {
      hydrationLogs.push({
        timestamp: new Date(daysAgo(i).setHours(8 + j * 2, randomInt(0, 59))),
        waterIntake: randomChoice([250, 350, 500, 600]), // mL
        sodiumIntake: randomInt(100, 300), // mg
        notes: j === 0 ? 'Morning water with meds' : ''
      });
    }
  }
  await db.hydration.bulkAdd(hydrationLogs);

  // Pain map entries
  const painLocations = ['neck', 'shoulders', 'lower back', 'knees', 'hands', 'wrists', 'hips', 'feet'];
  const painEntries = [];
  for (let i = 30; i >= 0; i--) {
    if (randomInt(0, 100) > 30) { // 70% chance of pain each day
      painEntries.push({
        timestamp: daysAgo(i),
        painLevel: randomInt(3, 8),
        location: randomChoices(painLocations, randomInt(1, 3)),
        triggers: randomChoices(['weather change', 'stress', 'poor sleep', 'overexertion', 'sitting too long'], randomInt(0, 2)),
        reliefMethods: randomChoices(['heating pad', 'gentle stretching', 'rest', 'medication', 'meditation'], randomInt(1, 2)),
        notes: i === 0 ? 'Bad flare day' : i === 15 ? 'Weather change affected joints' : ''
      });
    }
  }
  await db.pain.bulkAdd(painEntries);

  // Body Weather check-ins
  const bodyWeatherLogs = [];
  for (let i = 14; i >= 0; i--) {
    bodyWeatherLogs.push({
      date: daysAgo(i).toISOString().split('T')[0],
      time: '09:00',
      painLevel: randomInt(3, 8),
      energyLevel: randomInt(2, 7),
      moodLevel: randomInt(4, 8),
      anxietyLevel: randomInt(2, 7),
      dissociationLevel: randomInt(1, 5),
      jointPain: randomChoices(['knees', 'shoulders', 'wrists', 'hips', 'ankles'], randomInt(1, 3)),
      triggers: randomChoices(['weather', 'stress', 'lack of sleep', 'overactivity'], randomInt(0, 2)),
      copingStrategies: randomChoices(['rest', 'stretching', 'meditation', 'music', 'creative work'], randomInt(1, 3)),
      notes: i === 0 ? 'Started the day slowly' : '',
      createdAt: daysAgo(i)
    });
  }
  await db.bodyWeatherLogs.bulkAdd(bodyWeatherLogs);

  // Mood records
  const moods = ['peaceful', 'anxious', 'hopeful', 'tired', 'creative', 'frustrated', 'grateful', 'determined'];
  const moodEntries = [];
  for (let i = 30; i >= 0; i--) {
    moodEntries.push({
      timestamp: daysAgo(i),
      mood: randomChoice(moods),
      energy: randomInt(2, 8), // spoons
      anxiety: randomInt(2, 7),
      notes: i === 0 ? 'Feeling more balanced today' : ''
    });
  }
  await db.mood.bulkAdd(moodEntries);

  console.log('Health data seeded successfully');
}

// ============= 2. CHRONOMUSE/AI COMPANION =============

export async function seedAICompanionData() {
  console.log('Seeding AI companion data...');

  const modes = ['companion', 'creative', 'archivist', 'rebel'] as const;
  const rooms = ['health', 'art', 'activism', 'ancestry', 'rest', 'ritual'] as const;

  const conversations = [
    {
      timestamp: daysAgo(5),
      mode: 'companion' as const,
      room: 'health' as const,
      userMessage: 'I\'m having a rough pain day. Everything hurts.',
      aiResponse: 'I hear you, and I\'m here with you through this. Pain days are so hard, especially when it feels like everything at once. What would feel most supportive right now - do you want to talk through it, or would you prefer some gentle distraction? We could do a body scan meditation, or I could share some of your favorite music.',
      context: { painLevel: 7, mood: 'struggling' }
    },
    {
      timestamp: daysAgo(4),
      mode: 'creative' as const,
      room: 'art' as const,
      userMessage: 'I want to create something but I don\'t know what.',
      aiResponse: 'The wanting to create is already beautiful - it means part of you is reaching toward beauty and expression. What if we started small? Maybe some freewriting, or doodling in your journal? Sometimes the "what" reveals itself through the doing. What materials do you have nearby that call to you?',
      context: { mood: 'creative' }
    },
    {
      timestamp: daysAgo(3),
      mode: 'companion' as const,
      room: 'health' as const,
      userMessage: 'I took all my meds today and drank enough water. Small wins.',
      aiResponse: 'Those aren\'t small wins - they\'re HUGE! That\'s you taking care of yourself even when it\'s hard. That\'s you choosing your health and wellbeing. I\'m so proud of you. Want me to log those victories in your health tracker?',
      context: { mood: 'accomplished', spoons: 4 }
    },
    {
      timestamp: daysAgo(2),
      mode: 'archivist' as const,
      room: 'ancestry' as const,
      userMessage: 'Tell me about my great-grandmother.',
      aiResponse: 'Your great-grandmother Mary was born in 1925 in Charleston. She was a seamstress who made beautiful quilts, and family stories say she had the most infectious laugh. She lived through the Harlem Renaissance era and carried forward traditions of resilience and creativity. What aspect of her life would you like to explore more?',
      context: { ancestor: 'Mary Johnson' }
    },
    {
      timestamp: daysAgo(1),
      mode: 'companion' as const,
      room: 'rest' as const,
      userMessage: 'I feel guilty for resting so much.',
      aiResponse: 'Rest is not a luxury - it\'s a necessity, especially for bodies like ours. You\'re not being lazy, you\'re being wise. You\'re listening to what your body needs. That guilt you feel? That\'s internalized ableism, not truth. Your worth isn\'t measured in productivity. You deserve rest, period.',
      context: { mood: 'guilty', spoons: 2 }
    },
    {
      timestamp: hoursAgo(12),
      mode: 'companion' as const,
      room: 'health' as const,
      userMessage: 'Good morning! How\'s my health looking today?',
      aiResponse: 'Good morning, beautiful soul! Looking at your vitals from this morning - your BP is looking stable at 122/80, and you\'ve already taken your morning meds. You have 3 medications due later today. Your water intake yesterday was great! How are you feeling energy-wise?',
      context: { timeOfDay: 'morning' }
    },
    {
      timestamp: hoursAgo(6),
      mode: 'creative' as const,
      room: 'art' as const,
      userMessage: 'I finished a painting today!',
      aiResponse: 'YES! That\'s incredible! Tell me about it - what did you create? How did it feel to bring something into existence? I\'d love to hear about your process and what inspired you. And remember to celebrate this - you made art today!',
      context: { mood: 'accomplished', achievement: 'painting_complete' }
    },
    {
      timestamp: hoursAgo(3),
      mode: 'rebel' as const,
      room: 'activism' as const,
      userMessage: 'I\'m tired of fighting for basic accessibility.',
      aiResponse: 'Your exhaustion is valid. Fighting for what should be a given right is draining and unfair. But know this - every time you speak up, you\'re not just fighting for yourself. You\'re paving the way, changing minds, making it easier for those who come after. Your advocacy matters. And it\'s okay to rest from the fight when you need to. Revolution includes rest.',
      context: { mood: 'tired', topic: 'accessibility' }
    }
  ];
  await db.conversations.bulkAdd(conversations);

  // User preferences
  const preferences = [
    { key: 'companionName', value: 'ChronoMuse', updatedAt: daysAgo(30) },
    { key: 'preferredMode', value: 'companion', updatedAt: daysAgo(10) },
    { key: 'favoriteRoom', value: 'art', updatedAt: daysAgo(5) },
    { key: 'checkInReminder', value: true, updatedAt: daysAgo(20) },
    { key: 'gentleLanguage', value: true, updatedAt: daysAgo(30) },
    { key: 'pronouns', value: 'they/them', updatedAt: daysAgo(30) }
  ];
  await db.preferences.bulkAdd(preferences);

  console.log('AI companion data seeded successfully');
}

// ============= 3. EDUCATION =============

export async function seedEducationData() {
  console.log('Seeding education data...');

  const courses = [
    {
      platform: 'Coursera',
      courseName: 'Introduction to Psychology',
      provider: 'Yale University',
      creditType: 'ACE' as const,
      creditHours: 3,
      progress: 65,
      timeSpent: 28,
      startDate: daysAgo(45).toISOString(),
      status: 'in-progress' as const,
      difficulty: 'intermediate' as const,
      tags: ['psychology', 'social science', 'mental health'],
      notes: 'Fascinating content on cognitive psychology. The lectures on memory are especially relevant to my health journey.',
      resumeReady: true,
      costSavings: 1800
    },
    {
      platform: 'edX',
      courseName: 'Web Development Fundamentals',
      provider: 'MIT',
      creditType: 'MIT' as const,
      creditHours: 4,
      progress: 42,
      timeSpent: 35,
      startDate: daysAgo(30).toISOString(),
      status: 'in-progress' as const,
      difficulty: 'intermediate' as const,
      tags: ['computer science', 'web development', 'programming'],
      notes: 'Building portfolio projects alongside the course. Already created two functional websites!',
      resumeReady: true,
      costSavings: 2400
    },
    {
      platform: 'Khan Academy',
      courseName: 'Statistics and Probability',
      provider: 'Khan Academy',
      creditType: 'Khan' as const,
      creditHours: 3,
      progress: 88,
      timeSpent: 42,
      startDate: daysAgo(60).toISOString(),
      status: 'in-progress' as const,
      difficulty: 'beginner' as const,
      tags: ['mathematics', 'statistics', 'data analysis'],
      notes: 'Almost done! Understanding data is becoming second nature.',
      resumeReady: false,
      costSavings: 1500
    },
    {
      platform: 'Coursera',
      courseName: 'Digital Marketing Specialization',
      provider: 'University of Illinois',
      creditType: 'Coursera' as const,
      creditHours: 6,
      progress: 100,
      timeSpent: 67,
      startDate: daysAgo(120).toISOString(),
      completionDate: daysAgo(10).toISOString(),
      certificateUrl: 'https://coursera.org/verify/CERT123456',
      status: 'completed' as const,
      difficulty: 'advanced' as const,
      tags: ['marketing', 'business', 'digital media'],
      notes: 'Completed! This gave me practical skills for my passive income projects.',
      resumeReady: true,
      costSavings: 3600
    },
    {
      platform: 'OpenStax',
      courseName: 'Introduction to Sociology',
      provider: 'OpenStax',
      creditType: 'OpenStax' as const,
      creditHours: 3,
      progress: 25,
      timeSpent: 12,
      startDate: daysAgo(15).toISOString(),
      status: 'in-progress' as const,
      difficulty: 'beginner' as const,
      tags: ['sociology', 'social science', 'culture'],
      notes: 'Just started. Loving the insights into social structures.',
      resumeReady: false,
      costSavings: 1800
    }
  ];
  await db.education.bulkAdd(courses);

  // Learning moments
  const learningMoments = [
    {
      timestamp: daysAgo(2),
      topic: 'JavaScript Array Methods',
      content: 'Learned the difference between .map(), .filter(), and .reduce(). Map transforms, filter selects, reduce accumulates. Game changer!',
      source: 'MIT Web Development Course',
      tags: ['programming', 'javascript', 'web dev'],
      skillPracticed: 'JavaScript'
    },
    {
      timestamp: daysAgo(5),
      topic: 'Cognitive Behavioral Therapy Basics',
      content: 'CBT teaches that our thoughts influence our feelings and behaviors. The thought record technique is powerful for challenging negative thoughts.',
      source: 'Introduction to Psychology',
      tags: ['psychology', 'mental health', 'therapy'],
      skillPracticed: 'Psychology'
    },
    {
      timestamp: daysAgo(7),
      topic: 'Statistical Hypothesis Testing',
      content: 'Null hypothesis testing: we assume no effect exists, then look for evidence to reject that assumption. P-value < 0.05 typically indicates statistical significance.',
      source: 'Khan Academy Statistics',
      tags: ['statistics', 'mathematics', 'research'],
      skillPracticed: 'Statistics'
    }
  ];
  await db.learningMoments.bulkAdd(learningMoments);

  console.log('Education data seeded successfully');
}

// ============= 4. PASSIVE INCOME =============

export async function seedPassiveIncomeData() {
  console.log('Seeding passive income data...');

  const ideas = [
    {
      title: 'Etsy Digital Printables Store',
      description: 'Sell digital art prints, planners, and journals on Etsy. No inventory needed - customers download files.',
      category: 'Digital Products',
      estimatedEffort: 'Medium - Initial setup and design time',
      potentialIncome: '$200-800/month',
      tags: ['etsy', 'digital art', 'passive', 'printables'],
      createdAt: daysAgo(20)
    },
    {
      title: 'Print-on-Demand T-Shirts',
      description: 'Design t-shirts and use Printful/Printify to handle printing and shipping. You just design and market.',
      category: 'E-commerce',
      estimatedEffort: 'Low - After initial designs',
      potentialIncome: '$100-500/month',
      tags: ['print-on-demand', 'design', 'shopify', 'passive'],
      createdAt: daysAgo(18)
    },
    {
      title: 'Notion Templates Marketplace',
      description: 'Create and sell productivity templates on Gumroad. Health trackers, planners, databases.',
      category: 'Digital Products',
      estimatedEffort: 'Medium - Template creation',
      potentialIncome: '$150-600/month',
      tags: ['notion', 'templates', 'productivity', 'passive'],
      createdAt: daysAgo(15)
    },
    {
      title: 'Stock Photography on Multiple Platforms',
      description: 'Upload photos to Shutterstock, Adobe Stock, iStock. Earn royalties per download.',
      category: 'Creative',
      estimatedEffort: 'Medium - Photography and editing',
      potentialIncome: '$100-400/month',
      tags: ['photography', 'stock photos', 'royalties'],
      createdAt: daysAgo(12)
    },
    {
      title: 'YouTube Automation Channel',
      description: 'Educational content with voiceover and stock footage. Topics: history, science, psychology.',
      category: 'Content Creation',
      estimatedEffort: 'High - Initial setup and scripting',
      potentialIncome: '$300-2000/month',
      tags: ['youtube', 'video', 'education', 'ad revenue'],
      createdAt: daysAgo(10)
    },
    {
      title: 'Dividend Stock Portfolio',
      description: 'Invest in dividend-paying stocks and ETFs for quarterly passive income.',
      category: 'Investments',
      estimatedEffort: 'Low - After initial research',
      potentialIncome: '$50-500/month (scales with capital)',
      tags: ['stocks', 'dividends', 'investing', 'longterm'],
      createdAt: daysAgo(8)
    }
  ];
  await db.passiveIncomeIdeas.bulkAdd(ideas);

  console.log('Passive income data seeded successfully');
}

// ============= 5. WARDROBE =============

export async function seedWardrobeData() {
  console.log('Seeding wardrobe data...');

  const wardrobeItems = [
    { id: 'w1', name: 'Black Turtleneck', type: 'top' as const, colors: ['black'], style: 'minimalist', imageUrl: '/wardrobe/black-turtleneck.jpg', dateAdded: daysAgo(100), aiAnalysis: 'Classic piece, pairs well with jeans or skirts' },
    { id: 'w2', name: 'Dark Wash Jeans', type: 'bottom' as const, colors: ['dark blue'], style: 'casual', imageUrl: '/wardrobe/dark-jeans.jpg', dateAdded: daysAgo(95) },
    { id: 'w3', name: 'Purple Velvet Blazer', type: 'outerwear' as const, colors: ['purple'], style: 'gothic', imageUrl: '/wardrobe/purple-blazer.jpg', dateAdded: daysAgo(90), aiAnalysis: 'Statement piece for special occasions' },
    { id: 'w4', name: 'White Button-Up Shirt', type: 'top' as const, colors: ['white'], style: 'professional', imageUrl: '/wardrobe/white-shirt.jpg', dateAdded: daysAgo(85) },
    { id: 'w5', name: 'Black Skinny Jeans', type: 'bottom' as const, colors: ['black'], style: 'casual', imageUrl: '/wardrobe/black-jeans.jpg', dateAdded: daysAgo(80) },
    { id: 'w6', name: 'Burgundy Sweater', type: 'top' as const, colors: ['burgundy', 'red'], style: 'cozy', imageUrl: '/wardrobe/burgundy-sweater.jpg', dateAdded: daysAgo(75) },
    { id: 'w7', name: 'Floral Maxi Dress', type: 'dress' as const, colors: ['multi', 'purple', 'green'], style: 'bohemian', imageUrl: '/wardrobe/floral-dress.jpg', dateAdded: daysAgo(70) },
    { id: 'w8', name: 'Black Ankle Boots', type: 'shoes' as const, colors: ['black'], style: 'edgy', imageUrl: '/wardrobe/ankle-boots.jpg', dateAdded: daysAgo(65) },
    { id: 'w9', name: 'Silver Crescent Moon Necklace', type: 'accessory' as const, colors: ['silver'], style: 'mystical', imageUrl: '/wardrobe/moon-necklace.jpg', dateAdded: daysAgo(60) },
    { id: 'w10', name: 'Gray Hoodie', type: 'top' as const, colors: ['gray'], style: 'comfortable', imageUrl: '/wardrobe/gray-hoodie.jpg', dateAdded: daysAgo(55) },
    { id: 'w11', name: 'Pleated Midi Skirt', type: 'bottom' as const, colors: ['navy'], style: 'elegant', imageUrl: '/wardrobe/navy-skirt.jpg', dateAdded: daysAgo(50) },
    { id: 'w12', name: 'Leather Jacket', type: 'outerwear' as const, colors: ['black'], style: 'edgy', imageUrl: '/wardrobe/leather-jacket.jpg', dateAdded: daysAgo(45) },
    { id: 'w13', name: 'Lavender Blouse', type: 'top' as const, colors: ['lavender', 'purple'], style: 'romantic', imageUrl: '/wardrobe/lavender-blouse.jpg', dateAdded: daysAgo(40) },
    { id: 'w14', name: 'Wide Leg Trousers', type: 'bottom' as const, colors: ['beige'], style: 'professional', imageUrl: '/wardrobe/beige-trousers.jpg', dateAdded: daysAgo(35) },
    { id: 'w15', name: 'Graphic Band Tee', type: 'top' as const, colors: ['black', 'white'], style: 'casual', imageUrl: '/wardrobe/band-tee.jpg', dateAdded: daysAgo(30) },
    { id: 'w16', name: 'Green Combat Boots', type: 'shoes' as const, colors: ['green', 'olive'], style: 'alternative', imageUrl: '/wardrobe/combat-boots.jpg', dateAdded: daysAgo(25) },
    { id: 'w17', name: 'Silk Scarf', type: 'accessory' as const, colors: ['multi', 'gold', 'purple'], style: 'elegant', imageUrl: '/wardrobe/silk-scarf.jpg', dateAdded: daysAgo(20) },
    { id: 'w18', name: 'Denim Jacket', type: 'outerwear' as const, colors: ['blue'], style: 'casual', imageUrl: '/wardrobe/denim-jacket.jpg', dateAdded: daysAgo(15) },
    { id: 'w19', name: 'Emerald Wrap Dress', type: 'dress' as const, colors: ['green', 'emerald'], style: 'elegant', imageUrl: '/wardrobe/emerald-dress.jpg', dateAdded: daysAgo(10) },
    { id: 'w20', name: 'Chunky Knit Cardigan', type: 'outerwear' as const, colors: ['cream', 'beige'], style: 'cozy', imageUrl: '/wardrobe/knit-cardigan.jpg', dateAdded: daysAgo(5) },
    { id: 'w21', name: 'Black Platform Sneakers', type: 'shoes' as const, colors: ['black'], style: 'streetwear', imageUrl: '/wardrobe/platform-sneakers.jpg', dateAdded: daysAgo(3) },
    { id: 'w22', name: 'Gold Hoop Earrings', type: 'accessory' as const, colors: ['gold'], style: 'classic', imageUrl: '/wardrobe/gold-hoops.jpg', dateAdded: daysAgo(2) },
    { id: 'w23', name: 'Striped Breton Top', type: 'top' as const, colors: ['white', 'navy'], style: 'nautical', imageUrl: '/wardrobe/breton-top.jpg', dateAdded: daysAgo(1) },
    { id: 'w24', name: 'High-Waisted Shorts', type: 'bottom' as const, colors: ['denim'], style: 'casual', imageUrl: '/wardrobe/denim-shorts.jpg', dateAdded: new Date() }
  ];
  await db.wardrobe.bulkAdd(wardrobeItems);

  console.log('Wardrobe data seeded successfully');
}

// ============= 6. ENTERTAINMENT =============

export async function seedEntertainmentData() {
  console.log('Seeding entertainment data...');

  const ideas = [
    {
      title: 'Watercolor Galaxy Tutorial',
      description: 'Follow along YouTube tutorial for painting cosmic nebulas',
      type: 'art',
      tags: ['watercolor', 'space', 'tutorial', 'painting'],
      createdAt: daysAgo(10)
    },
    {
      title: 'Short Story: The Library Between Worlds',
      description: 'A magical library where books contain doorways to other dimensions',
      type: 'writing',
      tags: ['fantasy', 'short story', 'magic', 'portal'],
      createdAt: daysAgo(8)
    },
    {
      title: 'Tarot Card Photography Series',
      description: 'Create styled photos representing each major arcana card',
      type: 'photography',
      tags: ['tarot', 'photography', 'mystical', 'series'],
      createdAt: daysAgo(5)
    },
    {
      title: 'Playlist: Rainy Day Coding',
      description: 'Lo-fi beats mixed with ambient rain sounds for focus work',
      type: 'music',
      tags: ['playlist', 'lofi', 'focus', 'productivity'],
      createdAt: daysAgo(3)
    },
    {
      title: 'Digital Collage: Afrofuturism',
      description: 'Mixed media digital art exploring Black futures and technology',
      type: 'digital art',
      tags: ['afrofuturism', 'collage', 'digital', 'culture'],
      createdAt: daysAgo(1)
    }
  ];
  await db.ideaLibrary.bulkAdd(ideas);

  console.log('Entertainment data seeded successfully');
}

// ============= 7. D&D =============

export async function seedDnDData() {
  console.log('Seeding D&D data...');

  // Create 3 characters
  const character1Stats = dndService.generateStats();
  const character1 = dndService.createCharacter({
    name: 'Kira Shadowmend',
    race: 'Half-Elf',
    class: 'Rogue',
    stats: character1Stats,
    background: 'A former street thief turned adventurer, seeking redemption and treasure in equal measure.'
  });
  character1.personality = 'Quick-witted and charming, but haunted by past mistakes';
  character1.ideals = 'Freedom - chains are meant to be broken';
  character1.bonds = 'I owe everything to my mentor who saved me from a life of crime';
  character1.flaws = 'I can\'t resist a good heist, even when I should';
  character1.level = 3;
  character1.experience = 900;
  character1.gold = 250;
  await dndService.saveCharacter(character1);

  const character2Stats = dndService.generateStats();
  const character2 = dndService.createCharacter({
    name: 'Thorin Ironforge',
    race: 'Dwarf',
    class: 'Cleric',
    stats: character2Stats,
    background: 'A devout cleric of the forge god, dedicated to healing and protection.'
  });
  character2.personality = 'Gruff exterior but deeply caring, loyal to a fault';
  character2.ideals = 'Protection - I must shield the innocent from harm';
  character2.bonds = 'My temple was destroyed, and I seek to rebuild it';
  character2.flaws = 'I\'m stubborn and refuse to retreat, even when I should';
  character2.level = 2;
  character2.experience = 450;
  character2.gold = 180;
  await dndService.saveCharacter(character2);

  const character3Stats = dndService.generateStats();
  const character3 = dndService.createCharacter({
    name: 'Luna Starwhisper',
    race: 'Tiefling',
    class: 'Wizard',
    stats: character3Stats,
    background: 'A scholarly wizard researching ancient magical artifacts and forbidden knowledge.'
  });
  character3.personality = 'Curious and bookish, often lost in thought';
  character3.ideals = 'Knowledge - the path to power and self-improvement is through learning';
  character3.bonds = 'I\'m searching for a lost spellbook that belonged to my mentor';
  character3.flaws = 'I speak without thinking, often insulting others';
  character3.level = 4;
  character3.experience = 2100;
  character3.gold = 320;
  await dndService.saveCharacter(character3);

  // Create a campaign
  const campaign = await dndService.createCampaign({
    name: 'The Shattered Crystal',
    description: 'An ancient crystal that holds the balance between light and darkness has been shattered. The party must find the fragments before they fall into the wrong hands.',
    isAIDM: true,
    characterIds: [character1.id],
    setting: 'Forgotten Realms'
  });

  // Add story entries
  await dndService.addStoryEntry(campaign.id, {
    type: 'narration',
    content: 'You stand at the entrance of the Whispering Caves, where rumors speak of a crystal fragment hidden deep within. The air is thick with ancient magic, and distant echoes suggest you\'re not alone...'
  });

  await dndService.addStoryEntry(campaign.id, {
    type: 'action',
    speaker: 'Kira Shadowmend',
    content: 'I light my torch and carefully check for traps at the entrance.',
    diceRoll: dndService.rollDice('d20', 1, 5)
  });

  await dndService.addStoryEntry(campaign.id, {
    type: 'narration',
    content: 'Your trained eyes spot a nearly invisible tripwire! You carefully disarm it, revealing a safe passage into the cave. As you venture deeper, you hear the sound of claws scraping against stone...'
  });

  await dndService.addStoryEntry(campaign.id, {
    type: 'combat',
    content: 'Three goblins emerge from the shadows, weapons drawn! Roll for initiative!'
  });

  console.log('D&D data seeded successfully');
}

// ============= 8. ANCESTRY =============

export async function seedAncestryData() {
  console.log('Seeding ancestry data...');

  const ancestors = [
    {
      name: 'Mary Elizabeth Johnson',
      birthYear: 1925,
      deathYear: 2008,
      birthPlace: 'Charleston, South Carolina',
      occupation: 'Seamstress and Quilter',
      relation: 'Great-grandmother',
      generation: 3,
      personality: 'Creative, resilient, known for her infectious laugh and beautiful quilts',
      culturalBackground: ['African American', 'Gullah Geechee'],
      stories: [
        'Made quilts that told stories of family history',
        'Taught three generations how to sew',
        'Was known in the community for her sweet potato pie'
      ]
    },
    {
      name: 'James Robert Johnson',
      birthYear: 1922,
      deathYear: 1995,
      birthPlace: 'Charleston, South Carolina',
      occupation: 'Carpenter and Craftsman',
      relation: 'Great-grandfather',
      generation: 3,
      personality: 'Quiet but wise, master craftsman, loved to tell stories',
      culturalBackground: ['African American'],
      stories: [
        'Built furniture that families passed down for generations',
        'Served in WWII and rarely spoke of it',
        'Taught woodworking to neighborhood kids every Saturday'
      ]
    },
    {
      name: 'Dorothy Mae Williams',
      birthYear: 1948,
      deathYear: 2015,
      birthPlace: 'Atlanta, Georgia',
      occupation: 'Teacher and Civil Rights Activist',
      relation: 'Grandmother',
      generation: 2,
      personality: 'Fierce advocate for justice, loving educator, strong-willed',
      culturalBackground: ['African American'],
      stories: [
        'Participated in lunch counter sit-ins during the Civil Rights Movement',
        'Was the first Black teacher at her school',
        'Created a scholarship fund for underprivileged students'
      ]
    },
    {
      name: 'Samuel Thomas Williams',
      birthYear: 1945,
      birthPlace: 'Birmingham, Alabama',
      occupation: 'Jazz Musician',
      relation: 'Grandfather',
      generation: 2,
      personality: 'Soulful artist, gentle spirit, lover of music and life',
      culturalBackground: ['African American'],
      stories: [
        'Played saxophone in jazz clubs across the South',
        'Taught music to kids in his community for free',
        'Recorded two albums that are now collector\'s items'
      ]
    },
    {
      name: 'Ruth Ada Thompson',
      birthYear: 1898,
      deathYear: 1975,
      birthPlace: 'Savannah, Georgia',
      occupation: 'Midwife and Herbalist',
      relation: '2nd Great-grandmother',
      generation: 4,
      personality: 'Wise healer, keeper of traditional knowledge',
      culturalBackground: ['African American', 'Cherokee'],
      stories: [
        'Delivered over 300 babies in her lifetime',
        'Maintained a medicinal herb garden',
        'Passed down healing traditions through oral history'
      ]
    }
  ];

  for (const ancestor of ancestors) {
    await ancestryService.addAncestor(ancestor);
  }

  console.log('Ancestry data seeded successfully');
}

// ============= 9. CRISIS SUPPORT =============

export async function seedCrisisSupportData() {
  console.log('Seeding crisis support data...');

  const advocacyScripts = [
    {
      title: 'Requesting Medical Accommodations',
      situation: 'You need to ask your doctor for specific accommodations or treatments',
      script: '"I\'ve been experiencing [symptoms] and I\'ve done some research. I\'d like to discuss [specific treatment/accommodation]. Can you help me understand if this would be appropriate for my situation?"',
      tips: [
        'Bring written notes about your symptoms and their frequency',
        'Be specific about how symptoms impact your daily life',
        'Don\'t minimize your pain or symptoms',
        'It\'s okay to ask for a second opinion'
      ],
      tags: ['medical', 'self-advocacy', 'healthcare'],
      createdAt: daysAgo(20)
    },
    {
      title: 'Workplace Disability Accommodations',
      situation: 'Requesting reasonable accommodations at work under ADA',
      script: '"I have a medical condition that affects my ability to [specific task]. Under the ADA, I\'m requesting reasonable accommodations including [specific needs]. I have documentation from my healthcare provider. Can we schedule a time to discuss how to implement these?"',
      tips: [
        'Get documentation from your doctor first',
        'Be specific about what accommodations you need',
        'Know your rights under the ADA',
        'Follow up in writing after verbal requests'
      ],
      tags: ['workplace', 'ada', 'accommodations', 'employment'],
      createdAt: daysAgo(18)
    },
    {
      title: 'Setting Boundaries with Family',
      situation: 'Family members don\'t understand or respect your health limitations',
      script: '"I understand you want me to [activity], but my health requires that I [boundary]. I need you to respect this decision. It\'s not negotiable, but I appreciate your understanding."',
      tips: [
        'Be firm but calm',
        'Don\'t over-explain or justify',
        'Repeat the boundary if challenged',
        'It\'s okay to end the conversation if boundaries aren\'t respected'
      ],
      tags: ['family', 'boundaries', 'self-care'],
      createdAt: daysAgo(15)
    }
  ];
  await db.advocacyScripts.bulkAdd(advocacyScripts);

  const supportHandbooks = [
    {
      title: 'Grounding Techniques for Dissociation',
      content: '5-4-3-2-1 Technique: Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, 1 thing you taste. This brings you back to the present moment.',
      category: 'Mental Health',
      tags: ['grounding', 'dissociation', 'anxiety', 'coping'],
      createdAt: daysAgo(25)
    },
    {
      title: 'Pain Management During Flares',
      content: 'Heat therapy, gentle stretching, distraction techniques, medication as prescribed, rest in comfortable positions. Remember: pain is not your fault, and you deserve relief.',
      category: 'Physical Health',
      tags: ['pain', 'chronic illness', 'flares', 'management'],
      createdAt: daysAgo(22)
    },
    {
      title: 'Creating a Safety Plan',
      content: 'Identify triggers, list coping strategies, emergency contacts, safe places, reasons for living, professional resources. Keep it accessible and update regularly.',
      category: 'Crisis Planning',
      tags: ['safety', 'crisis', 'planning', 'mental health'],
      createdAt: daysAgo(20)
    }
  ];
  await db.supportHandbooks.bulkAdd(supportHandbooks);

  const emergencyCard = {
    name: 'Personal Emergency Information',
    contactInfo: 'Emergency Contact: [Name] - [Phone]',
    medications: ['Metoprolol 25mg', 'Lisinopril 10mg', 'Gabapentin 300mg'],
    allergies: ['Penicillin', 'Latex'],
    medicalConditions: ['POTS', 'Chronic Pain', 'Anxiety Disorder'],
    emergencyContacts: ['Dr. Sarah Chen - (555) 123-4567', 'Therapist: Dr. Marcus Reed - (555) 234-5678'],
    createdAt: daysAgo(30)
  };
  await db.emergencyCards.add(emergencyCard);

  console.log('Crisis support data seeded successfully');
}

// ============= 10. CALENDAR/TASKS =============

export async function seedCalendarTasksData() {
  console.log('Seeding calendar and tasks data...');

  const tasks = [
    {
      title: 'Take evening medications',
      description: 'Metoprolol, Gabapentin',
      completed: false,
      priority: 'high' as const,
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
      createdAt: daysAgo(1)
    },
    {
      title: 'Check blood pressure',
      description: 'Morning and evening readings',
      completed: true,
      priority: 'high' as const,
      dueDate: new Date(),
      createdAt: daysAgo(1)
    },
    {
      title: 'Complete Psychology course module',
      description: 'Week 6: Memory and Learning',
      completed: false,
      priority: 'medium' as const,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(3)
    },
    {
      title: 'Submit freelance project draft',
      description: 'Website mockups for client review',
      completed: false,
      priority: 'high' as const,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(5)
    },
    {
      title: 'Physical therapy exercises',
      description: 'Shoulder and neck stretches - 15 minutes',
      completed: false,
      priority: 'medium' as const,
      dueDate: new Date(),
      createdAt: daysAgo(1)
    },
    {
      title: 'Update passive income tracker',
      description: 'Log this week\'s earnings from digital products',
      completed: false,
      priority: 'low' as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(2)
    },
    {
      title: 'Therapy appointment preparation',
      description: 'Write down topics to discuss: boundaries with family, pain management progress',
      completed: false,
      priority: 'medium' as const,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(4)
    },
    {
      title: 'Grocery order',
      description: 'Order low-sodium options, fresh vegetables, easy-prep meals',
      completed: false,
      priority: 'medium' as const,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(1)
    },
    {
      title: 'Creative time: Work on painting',
      description: 'Continue galaxy watercolor series',
      completed: false,
      priority: 'low' as const,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdAt: daysAgo(2)
    },
    {
      title: 'Journal about today',
      description: 'Reflect on pain levels, mood, wins',
      completed: false,
      priority: 'low' as const,
      dueDate: new Date(),
      createdAt: new Date()
    }
  ];
  await db.tasks.bulkAdd(tasks);

  console.log('Calendar and tasks data seeded successfully');
}

// ============= MASTER SEED FUNCTION =============

export async function seedAllData() {
  console.log('Starting comprehensive data seeding...');
  console.log('This will populate ALL features with realistic, helpful data.');

  try {
    await seedHealthData();
    await seedAICompanionData();
    await seedEducationData();
    await seedPassiveIncomeData();
    await seedWardrobeData();
    await seedEntertainmentData();
    await seedDnDData();
    await seedAncestryData();
    await seedCrisisSupportData();
    await seedCalendarTasksData();

    // Log evolution event
    await db.logEvolution('Initial seed data loaded', 'system', {
      timestamp: new Date(),
      message: 'App populated with comprehensive seed data across all features'
    });

    console.log('Seed data complete! Your app is now fully populated.');
    return {
      success: true,
      message: 'All features populated with seed data',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error seeding data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    };
  }
}

// ============= CLEAR ALL DATA =============

export async function clearAllData() {
  console.log('Clearing all seed data...');

  try {
    await Promise.all([
      db.medications.clear(),
      db.vitals.clear(),
      db.hydration.clear(),
      db.pain.clear(),
      db.mood.clear(),
      db.bodyWeatherLogs.clear(),
      db.conversations.clear(),
      db.education.clear(),
      db.learningMoments.clear(),
      db.passiveIncomeIdeas.clear(),
      db.wardrobe.clear(),
      db.ideaLibrary.clear(),
      db.advocacyScripts.clear(),
      db.supportHandbooks.clear(),
      db.emergencyCards.clear(),
      db.tasks.clear()
    ]);

    // Clear D&D data
    const dndData = await dndService['loadData']();
    dndData.characters = [];
    dndData.campaigns = [];
    await dndService['saveData'](dndData);

    // Clear ancestry data
    const ancestors = await ancestryService.getAncestors();
    for (const ancestor of ancestors) {
      await ancestryService.deleteAncestor(ancestor.id);
    }

    await db.logEvolution('All seed data cleared', 'system');

    console.log('All seed data cleared successfully');
    return {
      success: true,
      message: 'All seed data has been cleared',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error clearing data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    };
  }
}

// Individual seed functions are already exported above
