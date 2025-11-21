/**
 * 🖤 USER PROFILE INITIALIZATION
 * Comprehensive personalized data setup
 */

import { db, setPreference } from './database';
import { seedAllCollections } from './seed-data';
import { seedComprehensiveData } from './comprehensive-seed';
import { MY_MEDICATIONS } from '../data/medications';

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  conditions: string[];
  goals: string[];
  interests: string[];
  preferences: Record<string, any>;
}

/**
 * Initialize user profile with comprehensive personalized data
 */
export async function initializeUserProfile(): Promise<void> {
  console.log('🖤 Initializing comprehensive user profile...');

  // Check if already initialized
  const existingData = await db.preferences.where('key').equals('profileInitialized').first();
  if (existingData?.value === true) {
    console.log('✓ User profile already initialized');
    return;
  }

  try {
    // Step 1: Set user preferences
    await setUserPreferences();

    // Step 2: Initialize all seed data collections
    await seedAllCollections();

    // Step 2.5: Add comprehensive seed data for ALL features
    await seedComprehensiveData();

    // Step 3: Add personalized health data
    await addHealthData();

    // Step 4: Add personalized finance data
    await addFinanceData();

    // Step 5: Add personalized education data
    await addEducationData();

    // Step 6: Add personalized habits and goals
    await addHabitsAndGoals();

    // Step 7: Add AI companion interactions
    await addAIInteractions();

    // Mark as initialized
    await setPreference('profileInitialized', true);
    await setPreference('profileInitializedAt', new Date().toISOString());

    console.log('✅ User profile fully initialized with comprehensive data!');
  } catch (error) {
    console.error('❌ Error initializing user profile:', error);
    throw error;
  }
}

async function setUserPreferences(): Promise<void> {
  const preferences = [
    // Identity
    { key: 'userName', value: 'KOL User' },
    { key: 'userBio', value: 'Building my Personal OS - Living with EDS, POTS, and chronic conditions' },
    { key: 'avatarId', value: '68e94e474099d80b93c9b714' },

    // Medical Conditions
    { key: 'medicalConditions', value: ['EDS (Ehlers-Danlos Syndrome)', 'POTS', 'MCAS', 'Chronic Pain', 'Chronic Fatigue'] },

    // Theme & Display
    { key: 'theme', value: 'gothic-purple' },
    { key: 'darkMode', value: true },
    { key: 'fontSize', value: 'medium' },
    { key: 'highContrast', value: false },

    // Health Settings
    { key: 'spoonCount', value: 5 },
    { key: 'hydrationGoal', value: 2500 }, // mL per day
    { key: 'sodiumGoal', value: 4000 }, // mg per day (important for POTS)
    { key: 'medicationReminders', value: true },
    { key: 'painTracking', value: true },

    // Automation
    { key: 'autoSyncEnabled', value: true },
    { key: 'aiAutomationEnabled', value: true },
    { key: 'maxAutomationEnabled', value: true },

    // AI Companion
    { key: 'aiMode', value: 'companion' },
    { key: 'aiPersonality', value: 'supportive' },
    { key: 'aiVoice', value: 'gentle' },

    // Notifications
    { key: 'medicationNotifications', value: true },
    { key: 'habitReminders', value: true },
    { key: 'goalUpdates', value: true },
    { key: 'budgetAlerts', value: true },

    // Privacy
    { key: 'dataSharing', value: false },
    { key: 'analytics', value: false },
    { key: 'offlineFirst', value: true }
  ];

  for (const pref of preferences) {
    await setPreference(pref.key, pref.value);
  }

  console.log('✓ User preferences set');
}

async function addHealthData(): Promise<void> {
  // Add current medications from centralized source (src/data/medications.ts)
  // ✏️ To edit your medications, update MY_MEDICATIONS in src/data/medications.ts
  await db.medications.bulkAdd(MY_MEDICATIONS);

  // Add today's vitals
  await db.vitals.add({
    timestamp: new Date(),
    bloodPressureSystolic: 95,
    bloodPressureDiastolic: 62,
    heartRate: 102,
    oxygenLevel: 98,
    temperature: 98.2,
    notes: 'Morning vitals - typical POTS pattern',
    tags: ['morning', 'baseline']
  });

  // Add hydration tracking
  await db.hydration.bulkAdd([
    {
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      waterIntake: 500, // mL
      sodiumIntake: 400, // mg (electrolyte drink)
      notes: 'Morning electrolyte drink'
    },
    {
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      waterIntake: 300,
      sodiumIntake: 0,
      notes: 'Water with meds'
    }
  ]);

  // Add recent pain logs
  await db.pain.bulkAdd([
    {
      timestamp: new Date(),
      painLevel: 4,
      location: ['lower back', 'knees', 'hands'],
      triggers: ['weather change', 'poor sleep'],
      reliefMethods: ['heat pack', 'gentle stretching'],
      notes: 'Woke up with usual joint pain'
    },
    {
      timestamp: new Date(Date.now() - 86400000), // Yesterday
      painLevel: 5,
      location: ['shoulders', 'neck', 'hips'],
      triggers: ['overexertion'],
      reliefMethods: ['rest', 'ice', 'medication'],
      notes: 'Did too much yesterday - paying for it today'
    }
  ]);

  // Add mood tracking
  await db.mood.bulkAdd([
    {
      timestamp: new Date(),
      mood: 'Determined',
      energy: 5, // spoons
      anxiety: 3,
      notes: 'Starting the day with moderate energy. Managing anxiety about health.'
    },
    {
      timestamp: new Date(Date.now() - 86400000),
      mood: 'Exhausted',
      energy: 2,
      anxiety: 4,
      notes: 'Low spoon day. Need to practice pacing.'
    }
  ]);

  console.log('✓ Health data added');
}

async function addFinanceData(): Promise<void> {
  // This would normally pull from localStorage/IndexedDB
  // For now, we'll just log that finance tracking is initialized
  console.log('✓ Finance tracking initialized');

  // Note: Expense tracking, budgets, etc. are handled by separate features
  // and use localStorage. The seed data already includes sample data.
}

async function addEducationData(): Promise<void> {
  // Add current courses (already in seed data, but add progress)
  await db.education.bulkAdd([
    {
      platform: 'Coursera',
      courseName: 'Computer Science Fundamentals',
      provider: 'University of Michigan',
      creditType: 'Coursera',
      creditHours: 4,
      progress: 60,
      timeSpent: 2400, // minutes
      startDate: new Date('2024-10-01').toISOString(),
      status: 'in-progress',
      difficulty: 'intermediate',
      tags: ['CS', 'fundamentals', 'programming'],
      notes: 'Great course! Taking it slow due to health.',
      resumeReady: true,
      costSavings: 1500
    },
    {
      platform: 'Khan Academy',
      courseName: 'Web Development',
      provider: 'Khan Academy',
      creditType: 'Khan',
      creditHours: 3,
      progress: 80,
      timeSpent: 1800,
      startDate: new Date('2024-09-15').toISOString(),
      status: 'in-progress',
      difficulty: 'beginner',
      tags: ['web dev', 'HTML', 'CSS', 'JavaScript'],
      notes: 'Almost done! Building my personal website.',
      resumeReady: true,
      costSavings: 1200
    },
    {
      platform: 'edX',
      courseName: 'Chronic Disease Self-Management',
      provider: 'Stanford',
      creditType: 'edX',
      creditHours: 2,
      progress: 100,
      timeSpent: 900,
      startDate: new Date('2024-08-01').toISOString(),
      completionDate: new Date('2024-10-15').toISOString(),
      status: 'completed',
      difficulty: 'beginner',
      tags: ['health', 'self-care', 'chronic illness'],
      notes: 'Extremely helpful for managing my conditions!',
      resumeReady: false,
      costSavings: 800,
      certificateUrl: 'https://edx.org/certificate/example'
    }
  ]);

  // Add learning moments
  await db.learningMoments.bulkAdd([
    {
      timestamp: new Date(),
      topic: 'React Hooks',
      content: 'Learned about useEffect cleanup functions - super important for preventing memory leaks!',
      source: 'Documentation',
      tags: ['React', 'JavaScript', 'hooks'],
      pathwayId: 'web-development',
      moduleId: 'react-advanced',
      skillPracticed: 'React'
    },
    {
      timestamp: new Date(Date.now() - 86400000),
      topic: 'Pacing Strategies',
      content: 'Discovered the 50% rule - only plan to use 50% of available energy to avoid crashes',
      source: 'Chronic Illness Community',
      tags: ['health', 'pacing', 'spoon theory'],
      skillPracticed: 'Self-advocacy'
    }
  ]);

  console.log('✓ Education data added');
}

async function addHabitsAndGoals(): Promise<void> {
  // Add tasks
  await db.tasks.bulkAdd([
    {
      title: 'Take morning medications',
      description: 'Midodrine, Fludrocortisone, Vitamin D',
      completed: true,
      priority: 'high',
      dueDate: new Date(),
      createdAt: new Date()
    },
    {
      title: 'Complete Python lesson',
      description: 'Finish week 4 exercises in Coursera course',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 2),
      createdAt: new Date()
    },
    {
      title: 'Log body weather',
      description: 'Track pain, energy, mood for today',
      completed: false,
      priority: 'high',
      dueDate: new Date(),
      createdAt: new Date()
    },
    {
      title: 'Apply to remote jobs',
      description: 'Submit 3 applications this week',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 3),
      createdAt: new Date()
    },
    {
      title: 'Physical therapy exercises',
      description: 'Gentle neck stretches and shoulder blade squeezes',
      completed: false,
      priority: 'medium',
      dueDate: new Date(),
      createdAt: new Date()
    }
  ]);

  // Add body weather logs
  await db.bodyWeatherLogs.bulkAdd([
    {
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      painLevel: 4,
      energyLevel: 5,
      moodLevel: 7,
      anxietyLevel: 3,
      dissociationLevel: 2,
      jointPain: ['knees', 'hands', 'lower back'],
      triggers: ['weather change', 'poor sleep'],
      copingStrategies: ['gentle stretching', 'heat pack', 'pacing'],
      notes: 'Woke up stiff but determined to have a good day. Remember to pace!',
      createdAt: new Date()
    },
    {
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      time: '20:00',
      painLevel: 6,
      energyLevel: 2,
      moodLevel: 5,
      anxietyLevel: 5,
      dissociationLevel: 3,
      jointPain: ['shoulders', 'neck', 'hips', 'knees'],
      triggers: ['overexertion', 'stress'],
      copingStrategies: ['rest', 'medication', 'distraction'],
      notes: 'Did too much today. Need to be more careful with energy management.',
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      time: '12:00',
      painLevel: 3,
      energyLevel: 7,
      moodLevel: 8,
      anxietyLevel: 2,
      dissociationLevel: 1,
      jointPain: ['hands'],
      triggers: [],
      copingStrategies: ['good sleep', 'staying hydrated'],
      notes: 'Good day! Managed energy well. This is what pacing looks like.',
      createdAt: new Date(Date.now() - 86400000 * 2)
    }
  ]);

  console.log('✓ Habits and goals added');
}

async function addAIInteractions(): Promise<void> {
  // Add some AI companion conversations
  await db.conversations.bulkAdd([
    {
      timestamp: new Date(),
      mode: 'companion',
      room: 'health',
      userMessage: 'I\'m feeling overwhelmed by all my health tasks today.',
      aiResponse: 'I understand. Managing chronic conditions can be exhausting. Remember, you don\'t have to do everything today. What\'s the most important thing you need to accomplish? Let\'s start there and see how your energy holds up.',
      context: { spoons: 5, painLevel: 4, mood: 'overwhelmed' }
    },
    {
      timestamp: new Date(Date.now() - 86400000),
      mode: 'companion',
      room: 'health',
      userMessage: 'I overdid it again. When will I learn?',
      aiResponse: 'You\'re learning right now. Each time this happens, you gain more data about your limits. Be gentle with yourself - pacing is a skill that takes time to develop. What can we do to support your recovery today?',
      context: { spoons: 2, painLevel: 6, mood: 'frustrated' }
    },
    {
      timestamp: new Date(Date.now() - 86400000 * 2),
      mode: 'companion',
      room: 'rest',
      userMessage: 'I actually feel pretty good today!',
      aiResponse: 'That\'s wonderful! Good days are precious. How are you planning to use this energy? Remember to pace yourself so you can enjoy the whole day, not just the morning.',
      context: { spoons: 7, painLevel: 3, mood: 'happy' }
    }
  ]);

  console.log('✓ AI interactions added');
}

/**
 * Get comprehensive user stats
 */
export async function getUserStats() {
  const [
    medicationCount,
    vitalsCount,
    courseCount,
    taskCount,
    conversationCount
  ] = await Promise.all([
    db.medications.where('status').equals('Active').count(),
    db.vitals.count(),
    db.education.count(),
    db.tasks.count(),
    db.conversations.count()
  ]);

  return {
    activeMedications: medicationCount,
    vitalsTracked: vitalsCount,
    coursesEnrolled: courseCount,
    activeTasks: taskCount,
    aiConversations: conversationCount
  };
}
