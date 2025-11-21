/**
 * 🖤 COMPREHENSIVE SEED DATA FOR ALL FEATURES
 * Master data initialization for the complete Personal OS
 */

import { db } from './database';
import { MY_MEDICATIONS } from '../data/medications';
import { PASSIVE_INCOME_STREAMS, RECENT_INCOME_ACTIVITIES } from '../data/passive-income-seed';

export async function seedComprehensiveData() {
  console.log('🌱 Seeding comprehensive data for all features...');

  try {
    // Health & Wellness Data
    await seedHealthData();

    // Financial Data
    await seedFinancialData();

    // Passive Income Data
    await seedPassiveIncomeData();

    // Education & Learning Data
    await seedEducationData();

    // Life Management Data
    await seedLifeManagementData();

    // Entertainment & Hobbies Data
    await seedEntertainmentData();

    // Relationships & Social Data
    await seedRelationshipData();

    // Home & Living Data
    await seedHomeLivingData();

    // Resources & Support Data
    await seedResourcesData();

    console.log('✅ Comprehensive seed data complete!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

async function seedHealthData() {
  // Medications (from centralized source)
  const medicationCount = await db.medications.count();
  if (medicationCount === 0) {
    await db.medications.bulkAdd(MY_MEDICATIONS);
  }

  // Vitals
  const vitalsData = Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 86400000),
    bloodPressureSystolic: 90 + Math.floor(Math.random() * 20),
    bloodPressureDiastolic: 60 + Math.floor(Math.random() * 15),
    heartRate: 95 + Math.floor(Math.random() * 20),
    oxygenLevel: 97 + Math.floor(Math.random() * 3),
    temperature: 97.5 + Math.random(),
    notes: i % 5 === 0 ? 'Feeling slightly dizzy' : 'Normal day',
    tags: ['morning']
  }));
  await db.vitals.bulkAdd(vitalsData);

  // Hydration
  const hydrationData = Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 86400000),
    waterIntake: 2000 + Math.floor(Math.random() * 1000),
    sodiumIntake: 3500 + Math.floor(Math.random() * 1500),
    notes: 'Daily hydration tracking'
  }));
  await db.hydration.bulkAdd(hydrationData);

  // Pain logs
  const painData = Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 86400000 * 2),
    painLevel: 3 + Math.floor(Math.random() * 5),
    location: ['knees', 'hands', 'lower back', 'shoulders'].slice(0, Math.floor(Math.random() * 3) + 1),
    triggers: ['weather', 'overexertion', 'stress'].slice(0, Math.floor(Math.random() * 2)),
    reliefMethods: ['heat', 'rest', 'medication', 'stretching'].slice(0, 2),
    notes: 'EDS-related joint pain'
  }));
  await db.pain.bulkAdd(painData);

  // Mood tracking
  const moods = ['Determined', 'Exhausted', 'Hopeful', 'Frustrated', 'Calm', 'Anxious', 'Grateful'];
  const moodData = Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 86400000),
    mood: moods[Math.floor(Math.random() * moods.length)],
    energy: 3 + Math.floor(Math.random() * 5),
    anxiety: 2 + Math.floor(Math.random() * 5),
    notes: 'Daily mood check-in'
  }));
  await db.mood.bulkAdd(moodData);

  // Body Weather Logs
  const bodyWeatherData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    time: '09:00',
    painLevel: 3 + Math.floor(Math.random() * 4),
    energyLevel: 4 + Math.floor(Math.random() * 4),
    moodLevel: 5 + Math.floor(Math.random() * 4),
    anxietyLevel: 2 + Math.floor(Math.random() * 4),
    dissociationLevel: 1 + Math.floor(Math.random() * 3),
    jointPain: ['knees', 'hands', 'shoulders'],
    triggers: ['weather', 'sleep quality'],
    copingStrategies: ['pacing', 'heat therapy', 'meditation'],
    notes: 'Morning body check',
    createdAt: new Date(Date.now() - i * 86400000)
  }));
  await db.bodyWeatherLogs.bulkAdd(bodyWeatherData);
}

async function seedFinancialData() {
  // Using localStorage for expenses, budgets, etc. (as per existing pages)
  const expenses = Array.from({ length: 30 }, (_, i) => ({
    id: `exp-${i}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    amount: 10 + Math.floor(Math.random() * 200),
    category: ['Groceries', 'Medical', 'Entertainment', 'Utilities', 'Transportation'][Math.floor(Math.random() * 5)],
    description: 'Monthly expense',
    paymentMethod: ['Cash', 'Card', 'Digital'][Math.floor(Math.random() * 3)]
  }));
  localStorage.setItem('expenses', JSON.stringify(expenses));

  const budgets = [
    { category: 'Groceries', limit: 400, spent: 285 },
    { category: 'Medical', limit: 300, spent: 250 },
    { category: 'Entertainment', limit: 100, spent: 45 },
    { category: 'Utilities', limit: 200, spent: 180 },
    { category: 'Transportation', limit: 150, spent: 90 }
  ];
  localStorage.setItem('budgets', JSON.stringify(budgets));

  const savingsGoals = [
    { id: '1', name: 'Emergency Fund', target: 5000, current: 2300, deadline: '2025-12-31' },
    { id: '2', name: 'Adaptive Equipment', target: 1500, current: 450, deadline: '2025-06-30' },
    { id: '3', name: 'Vacation Fund', target: 2000, current: 680, deadline: '2025-08-15' }
  ];
  localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
}

async function seedPassiveIncomeData() {
  // Check if already seeded
  const existingStreams = await db.table('incomeStreams').count();
  if (existingStreams > 0) {
    console.log('✓ Passive income streams already seeded');
    return;
  }

  // Add all income streams
  await db.table('incomeStreams').bulkAdd(PASSIVE_INCOME_STREAMS);

  // Add recent activities
  await db.table('incomeActivities').bulkAdd(RECENT_INCOME_ACTIVITIES);

  console.log('✓ Passive income data seeded - $' + PASSIVE_INCOME_STREAMS.reduce((sum, s) => sum + s.dailyRevenue, 0).toFixed(2) + '/day');
}

async function seedEducationData() {
  const courses = [
    {
      platform: 'Coursera',
      courseName: 'Full Stack Web Development',
      provider: 'University of Michigan',
      creditType: 'Coursera',
      creditHours: 4,
      progress: 75,
      timeSpent: 3600,
      startDate: '2024-09-01',
      status: 'in-progress',
      difficulty: 'intermediate',
      tags: ['Web Dev', 'JavaScript', 'React'],
      notes: 'Excellent course, taking it slow due to energy limits',
      resumeReady: true,
      costSavings: 1800
    },
    {
      platform: 'Khan Academy',
      courseName: 'Statistics and Probability',
      provider: 'Khan Academy',
      creditType: 'Khan',
      creditHours: 3,
      progress: 100,
      timeSpent: 2100,
      startDate: '2024-07-15',
      completionDate: '2024-11-10',
      status: 'completed',
      difficulty: 'beginner',
      tags: ['Math', 'Statistics'],
      notes: 'Completed! Great foundation',
      resumeReady: true,
      costSavings: 1200,
      certificateUrl: 'https://khanacademy.org/cert/123'
    },
    {
      platform: 'edX',
      courseName: 'Python for Data Science',
      provider: 'IBM',
      creditType: 'edX',
      creditHours: 5,
      progress: 45,
      timeSpent: 1800,
      startDate: '2024-11-01',
      status: 'in-progress',
      difficulty: 'intermediate',
      tags: ['Python', 'Data Science', 'Programming'],
      notes: 'Challenging but rewarding',
      resumeReady: false,
      costSavings: 2000
    }
  ];
  await db.education.bulkAdd(courses);

  const learningMoments = Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 86400000 * 3),
    topic: ['React Hooks', 'Async/Await', 'Database Design', 'CSS Grid', 'REST APIs'][i % 5],
    content: `Learned important concepts about ${['React Hooks', 'Async/Await', 'Database Design', 'CSS Grid', 'REST APIs'][i % 5]}`,
    source: ['Documentation', 'Tutorial', 'Course', 'Practice Project'][Math.floor(Math.random() * 4)],
    tags: ['programming', 'web development'],
    pathwayId: 'web-development',
    moduleId: `module-${i}`,
    skillPracticed: 'Programming'
  }));
  await db.learningMoments.bulkAdd(learningMoments);
}

async function seedLifeManagementData() {
  // Goals
  const goals = [
    { id: '1', title: 'Complete Web Dev Course', category: 'Education', progress: 75, deadline: '2025-02-28', status: 'in-progress' },
    { id: '2', title: 'Build Portfolio Website', category: 'Career', progress: 40, deadline: '2025-03-31', status: 'in-progress' },
    { id: '3', title: 'Establish Daily Meditation Practice', category: 'Health', progress: 60, deadline: '2025-01-31', status: 'in-progress' },
    { id: '4', title: 'Read 12 Books This Year', category: 'Personal', progress: 50, deadline: '2025-12-31', status: 'in-progress' }
  ];
  localStorage.setItem('goals', JSON.stringify(goals));

  // Habits
  const habits = [
    { id: '1', name: 'Morning Stretches', frequency: 'daily', streak: 12, lastCompleted: new Date().toISOString() },
    { id: '2', name: 'Hydration Check', frequency: 'daily', streak: 45, lastCompleted: new Date().toISOString() },
    { id: '3', name: 'Gratitude Journaling', frequency: 'daily', streak: 8, lastCompleted: new Date().toISOString() },
    { id: '4', name: 'Programming Practice', frequency: 'daily', streak: 22, lastCompleted: new Date().toISOString() }
  ];
  localStorage.setItem('habits', JSON.stringify(habits));

  // Tasks
  const tasks = [
    {
      title: 'Take morning medications',
      description: 'Full medication routine',
      completed: true,
      priority: 'high',
      dueDate: new Date(),
      createdAt: new Date()
    },
    {
      title: 'Complete React assignment',
      description: 'Build todo app component',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 2),
      createdAt: new Date()
    },
    {
      title: 'Doctor appointment prep',
      description: 'Update symptom log and questions list',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 5),
      createdAt: new Date()
    }
  ];
  await db.tasks.bulkAdd(tasks);
}

async function seedEntertainmentData() {
  // Gaming
  const games = [
    { id: '1', title: 'Stardew Valley', platform: 'PC', hoursPlayed: 127, rating: 5, status: 'playing' },
    { id: '2', title: 'Hollow Knight', platform: 'Switch', hoursPlayed: 45, rating: 5, status: 'completed' },
    { id: '3', title: 'Animal Crossing', platform: 'Switch', hoursPlayed: 203, rating: 4, status: 'playing' },
    { id: '4', title: 'Hades', platform: 'PC', hoursPlayed: 89, rating: 5, status: 'completed' }
  ];
  localStorage.setItem('games', JSON.stringify(games));

  // Reading
  const books = [
    { id: '1', title: 'The Body Keeps the Score', author: 'Bessel van der Kolk', status: 'reading', progress: 45, rating: 5 },
    { id: '2', title: 'Atomic Habits', author: 'James Clear', status: 'completed', progress: 100, rating: 5 },
    { id: '3', title: 'Disability Visibility', author: 'Alice Wong', status: 'completed', progress: 100, rating: 5 },
    { id: '4', title: 'The Midnight Library', author: 'Matt Haig', status: 'reading', progress: 67, rating: 4 }
  ];
  localStorage.setItem('books', JSON.stringify(books));

  // Podcasts
  const podcasts = [
    { id: '1', name: 'The Spoon Theory Podcast', category: 'Health', episodes: 45, subscribed: true },
    { id: '2', name: 'Syntax.fm', category: 'Tech', episodes: 12, subscribed: true },
    { id: '3', name: 'The Daily', category: 'News', episodes: 30, subscribed: true }
  ];
  localStorage.setItem('podcasts', JSON.stringify(podcasts));
}

async function seedRelationshipData() {
  // Social connections
  const connections = [
    { id: '1', name: 'Best Friend', relationship: 'Friend', lastContact: new Date().toISOString(), frequency: 'weekly' },
    { id: '2', name: 'Partner', relationship: 'Partner', lastContact: new Date().toISOString(), frequency: 'daily' },
    { id: '3', name: 'Mom', relationship: 'Family', lastContact: new Date(Date.now() - 86400000).toISOString(), frequency: 'weekly' },
    { id: '4', name: 'Support Group', relationship: 'Community', lastContact: new Date(Date.now() - 86400000 * 7).toISOString(), frequency: 'monthly' }
  ];
  localStorage.setItem('connections', JSON.stringify(connections));
}

async function seedHomeLivingData() {
  // Cooking/Meals
  const meals = [
    { id: '1', name: 'Low-FODMAP Stir Fry', category: 'Dinner', spoonCost: 3, mealPrepFriendly: true },
    { id: '2', name: 'Overnight Oats', category: 'Breakfast', spoonCost: 1, mealPrepFriendly: true },
    { id: '3', name: 'Sheet Pan Chicken', category: 'Dinner', spoonCost: 2, mealPrepFriendly: true }
  ];
  localStorage.setItem('meals', JSON.stringify(meals));

  // Home maintenance
  const maintenance = [
    { id: '1', task: 'Change HVAC Filter', frequency: 'quarterly', lastDone: '2024-10-15', nextDue: '2025-01-15' },
    { id: '2', task: 'Deep Clean Bathroom', frequency: 'monthly', lastDone: '2024-11-10', nextDue: '2024-12-10' },
    { id: '3', task: 'Water Plants', frequency: 'weekly', lastDone: new Date().toISOString().split('T')[0], nextDue: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0] }
  ];
  localStorage.setItem('homeMaintenance', JSON.stringify(maintenance));
}

async function seedResourcesData() {
  // AI Conversations
  const conversations = [
    {
      timestamp: new Date(),
      mode: 'companion',
      room: 'health',
      userMessage: 'I\'m having a high pain day',
      aiResponse: 'I hear you. High pain days are so challenging. Remember to be gentle with yourself and use your coping strategies. What would help you most right now?',
      context: { painLevel: 7, energy: 2 }
    },
    {
      timestamp: new Date(Date.now() - 86400000),
      mode: 'companion',
      room: 'rest',
      userMessage: 'Feeling accomplished today!',
      aiResponse: 'That\'s wonderful! Celebrate these wins. What did you accomplish?',
      context: { painLevel: 3, energy: 7 }
    }
  ];
  await db.conversations.bulkAdd(conversations);

  // Emergency info
  const emergencyCard = {
    name: 'KOL User',
    contactInfo: 'Emergency contact: (555) 123-4567',
    medications: MY_MEDICATIONS.filter(m => m.status === 'Active').map(m => `${m.drugName} ${m.strength}`),
    allergies: ['Penicillin', 'Sulfa drugs'],
    medicalConditions: ['EDS', 'POTS', 'MCAS'],
    emergencyContacts: ['Partner: (555) 123-4567', 'Mom: (555) 987-6543'],
    createdAt: new Date()
  };
  await db.emergencyCards.add(emergencyCard);
}
