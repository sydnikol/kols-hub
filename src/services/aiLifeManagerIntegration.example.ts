/**
 * AI Life Manager Integration Examples
 *
 * This file shows how to integrate the AI Life Manager into your existing features.
 * Copy these patterns into your actual feature components.
 */

import { aiLifeManager } from './aiLifeManager';
import { db } from '../utils/database';
import type {
  VitalRecord,
  MedicationRecord,
  HydrationRecord,
  PainRecord,
  MoodRecord,
  CourseProgress,
  Task
} from '../utils/database';

// ============================================================================
// HEALTH TRACKING INTEGRATION
// ============================================================================

/**
 * Example: Vital Signs Tracking
 * When user logs vitals, notify the AI
 */
export const logVitalSigns = async (vital: Omit<VitalRecord, 'id'>) => {
  try {
    // Save to database
    const id = await db.vitals.add({
      ...vital,
      timestamp: new Date()
    });

    // Notify AI Life Manager
    aiLifeManager.emit('vital:recorded', { id, ...vital });

    // AI will automatically:
    // - Check for crisis situations (high BP, low O2, etc.)
    // - Generate insights if vitals are concerning
    // - Update daily report stats

    return id;
  } catch (error) {
    console.error('Failed to log vitals:', error);
    throw error;
  }
};

/**
 * Example: Medication Tracking
 * When user takes medication, notify the AI
 */
export const takeMedication = async (medicationId: number) => {
  try {
    const medication = await db.medications.get(medicationId);
    if (!medication) throw new Error('Medication not found');

    // Calculate next dose time based on frequency
    const nextDose = calculateNextDose(medication.frequency);

    // Update medication record
    await db.medications.update(medicationId, {
      lastTaken: new Date(),
      nextDose,
      taken: true
    });

    // Notify AI
    aiLifeManager.emit('medication:taken', medication);

    // AI will:
    // - Log the achievement
    // - Update medication compliance tracking
    // - Schedule next reminder

    return medication;
  } catch (error) {
    console.error('Failed to mark medication as taken:', error);
    throw error;
  }
};

/**
 * Example: Hydration Tracking
 * Track water and sodium intake for POTS management
 */
export const logHydration = async (waterMl: number, sodiumMg: number = 0) => {
  try {
    const id = await db.hydration.add({
      timestamp: new Date(),
      waterIntake: waterMl,
      sodiumIntake: sodiumMg
    });

    // Notify AI
    aiLifeManager.emit('hydration:logged', { waterMl, sodiumMg });

    // AI will:
    // - Check if daily goals are met
    // - Generate achievement if goals reached
    // - Suggest more hydration if low
    // - Correlate with pain/energy levels

    return id;
  } catch (error) {
    console.error('Failed to log hydration:', error);
    throw error;
  }
};

/**
 * Example: Pain Tracking
 * Log pain with location and triggers
 */
export const logPain = async (pain: Omit<PainRecord, 'id'>) => {
  try {
    const id = await db.pain.add({
      ...pain,
      timestamp: new Date()
    });

    // Notify AI
    aiLifeManager.emit('pain:logged', pain);

    // AI will:
    // - Detect pain spikes
    // - Suggest rest rituals if pain is high
    // - Correlate with food, weather, activities
    // - Track pain patterns over time

    return id;
  } catch (error) {
    console.error('Failed to log pain:', error);
    throw error;
  }
};

/**
 * Example: Mood/Energy Check-in
 * Track emotional state and spoon count
 */
export const logMood = async (mood: Omit<MoodRecord, 'id'>) => {
  try {
    const id = await db.mood.add({
      ...mood,
      timestamp: new Date()
    });

    // Notify AI
    aiLifeManager.emit('mood:logged', mood);

    // AI will:
    // - Predict energy for the day
    // - Detect low energy and suggest rest
    // - Correlate mood with sleep, pain, etc.
    // - Trigger mental health support if needed

    return id;
  } catch (error) {
    console.error('Failed to log mood:', error);
    throw error;
  }
};

// Helper function
function calculateNextDose(frequency: string): Date {
  const now = new Date();
  const next = new Date(now);

  // Parse frequency and calculate next dose
  if (frequency.includes('daily')) {
    next.setDate(next.getDate() + 1);
  } else if (frequency.includes('12 hours') || frequency.includes('twice')) {
    next.setHours(next.getHours() + 12);
  } else if (frequency.includes('8 hours')) {
    next.setHours(next.getHours() + 8);
  } else if (frequency.includes('6 hours')) {
    next.setHours(next.getHours() + 6);
  } else if (frequency.includes('4 hours')) {
    next.setHours(next.getHours() + 4);
  }

  return next;
}

// ============================================================================
// EDUCATION INTEGRATION
// ============================================================================

/**
 * Example: Course Progress Tracking
 * Update course progress and notify AI
 */
export const updateCourseProgress = async (
  courseId: string,
  minutesSpent: number,
  progressDelta: number = 0
) => {
  try {
    const course = await db.education.get(courseId);
    if (!course) throw new Error('Course not found');

    // Update progress
    const updatedCourse = {
      ...course,
      timeSpent: course.timeSpent + minutesSpent,
      progress: Math.min(100, course.progress + progressDelta)
    };

    await db.education.put(updatedCourse);

    // Notify AI
    aiLifeManager.emit('course:progress', updatedCourse);

    // AI will:
    // - Celebrate milestone achievements (25%, 50%, 75%, 100%)
    // - Update resume automatically
    // - Suggest study breaks based on energy
    // - Track learning patterns

    // Check for milestone
    if (updatedCourse.progress % 25 === 0 && updatedCourse.progress > course.progress) {
      aiLifeManager.emit('achievement:unlocked', {
        type: 'learning-milestone',
        course: updatedCourse.courseName,
        progress: updatedCourse.progress
      });
    }

    return updatedCourse;
  } catch (error) {
    console.error('Failed to update course progress:', error);
    throw error;
  }
};

/**
 * Example: Complete Course
 * Mark course as complete and generate resume entry
 */
export const completeCourse = async (courseId: string) => {
  try {
    const course = await db.education.get(courseId);
    if (!course) throw new Error('Course not found');

    // Mark as complete
    const completedCourse = {
      ...course,
      progress: 100,
      status: 'completed' as const,
      completionDate: new Date().toISOString()
    };

    await db.education.put(completedCourse);

    // Notify AI
    aiLifeManager.emit('achievement:unlocked', {
      type: 'course-completion',
      course: completedCourse.courseName,
      credits: completedCourse.creditHours
    });

    // AI will:
    // - Celebrate the achievement
    // - Auto-generate resume entry
    // - Update degree progress
    // - Suggest next courses

    return completedCourse;
  } catch (error) {
    console.error('Failed to complete course:', error);
    throw error;
  }
};

// ============================================================================
// TASK MANAGEMENT INTEGRATION
// ============================================================================

/**
 * Example: Create Task
 * Add new task and notify AI for prioritization
 */
export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const id = await db.tasks.add({
      ...task,
      createdAt: new Date()
    });

    // Notify AI
    aiLifeManager.emit('task:created', { id, ...task });

    // AI will:
    // - Prioritize based on energy levels
    // - Suggest spoon allocation
    // - Remind if high priority
    // - Group related tasks

    return id;
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
};

/**
 * Example: Complete Task
 * Mark task as done and celebrate
 */
export const completeTask = async (taskId: number) => {
  try {
    const task = await db.tasks.get(taskId);
    if (!task) throw new Error('Task not found');

    await db.tasks.update(taskId, { completed: true });

    // Notify AI
    aiLifeManager.emit('task:completed', task);

    // AI will:
    // - Celebrate the achievement
    // - Update daily stats
    // - Suggest reward/rest
    // - Track productivity patterns

    return task;
  } catch (error) {
    console.error('Failed to complete task:', error);
    throw error;
  }
};

// ============================================================================
// FINANCIAL INTEGRATION
// ============================================================================

/**
 * Example: Log Passive Income
 * Track income from various sources
 */
export const logIncome = async (source: string, amount: number, date: Date = new Date()) => {
  try {
    // Save to your finance database (implement as needed)
    // const id = await db.income.add({ source, amount, date });

    // Notify AI
    aiLifeManager.emit('income:earned', { source, amount, date });

    // AI will:
    // - Track total passive income
    // - Celebrate milestones
    // - Suggest optimization
    // - Update financial goals

    return { source, amount, date };
  } catch (error) {
    console.error('Failed to log income:', error);
    throw error;
  }
};

/**
 * Example: Log Expense
 * Track spending and budget
 */
export const logExpense = async (category: string, amount: number, description?: string) => {
  try {
    // Save to your finance database (implement as needed)
    // const id = await db.expenses.add({ category, amount, description, date: new Date() });

    // Notify AI
    aiLifeManager.emit('expense:logged', { category, amount, description });

    // AI will:
    // - Track spending patterns
    // - Alert if over budget
    // - Suggest cost-cutting
    // - Categorize expenses

    return { category, amount, description };
  } catch (error) {
    console.error('Failed to log expense:', error);
    throw error;
  }
};

// ============================================================================
// LISTENING TO AI EVENTS
// ============================================================================

/**
 * Example: React to AI Alerts
 * Subscribe to AI events in your components
 */
export const setupAIEventListeners = () => {
  // Crisis detected - show emergency UI
  aiLifeManager.on('crisis:detected', (crisis) => {
    console.log('CRISIS DETECTED:', crisis);
    // Show emergency modal
    // Notify care team
    // Display crisis protocol
  });

  // Achievement unlocked - celebrate!
  aiLifeManager.on('achievement:*', (achievement) => {
    console.log('ACHIEVEMENT:', achievement);
    // Show celebration animation
    // Play sound
    // Award badges
  });

  // High BP alert - suggest rest
  aiLifeManager.on('alert:high-bp', (vital) => {
    console.log('High BP detected:', vital);
    // Show notification
    // Suggest lying down
    // Track for doctor
  });

  // Low energy alert - reduce task load
  aiLifeManager.on('alert:low-energy', (mood) => {
    console.log('Low energy detected:', mood);
    // Suggest rest
    // Reschedule non-urgent tasks
    // Activate rest mode
  });

  // Hydration goal met - celebrate
  aiLifeManager.on('achievement:hydration-goal', (data) => {
    console.log('Hydration goal met!', data);
    // Show celebration
    // Update streak
    // Encourage continuation
  });

  // New insights available - update UI
  aiLifeManager.on('insights:updated', (insights) => {
    console.log('New insights:', insights);
    // Update notification badge
    // Show toast
    // Refresh dashboard
  });
};

// ============================================================================
// REACT COMPONENT EXAMPLES
// ============================================================================

/**
 * Example: Vitals Tracker Component
 */
export const VitalsTrackerExample = () => {
  const handleSubmit = async (data: any) => {
    await logVitalSigns({
      bloodPressureSystolic: data.systolic,
      bloodPressureDiastolic: data.diastolic,
      heartRate: data.heartRate,
      oxygenLevel: data.oxygen,
      temperature: data.temp,
      timestamp: new Date()
    });

    // AI will automatically check and respond
  };

  return null; // Your component JSX
};

/**
 * Example: Medication Tracker Component
 */
export const MedicationTrackerExample = () => {
  const handleTakeMed = async (medId: number) => {
    await takeMedication(medId);

    // Show success message
    console.log('Medication logged! AI notified.');
  };

  return null; // Your component JSX
};

/**
 * Example: Course Progress Component
 */
export const CourseProgressExample = () => {
  const handleStudySession = async (courseId: string, minutes: number) => {
    await updateCourseProgress(courseId, minutes, 5); // 5% progress

    // AI will celebrate if milestone reached
  };

  return null; // Your component JSX
};

/**
 * Example: Task List Component
 */
export const TaskListExample = () => {
  const handleCompleteTask = async (taskId: number) => {
    await completeTask(taskId);

    // AI will celebrate and update stats
  };

  return null; // Your component JSX
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get AI recommendations for current situation
 */
export const getContextualRecommendations = async () => {
  // Get recent health data
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [recentMood, recentPain, recentHydration] = await Promise.all([
    db.mood.where('timestamp').aboveOrEqual(today).toArray(),
    db.pain.where('timestamp').aboveOrEqual(today).toArray(),
    db.hydration.where('timestamp').aboveOrEqual(today).toArray()
  ]);

  const latestMood = recentMood[recentMood.length - 1];
  const avgPain = recentPain.reduce((sum, p) => sum + p.painLevel, 0) / recentPain.length || 0;
  const totalWater = recentHydration.reduce((sum, h) => sum + h.waterIntake, 0);

  // Generate contextual recommendations
  const recommendations = [];

  if (latestMood && latestMood.energy <= 3) {
    recommendations.push({
      type: 'rest',
      message: 'Low energy detected. Consider resting and prioritizing essential tasks only.',
      priority: 'high'
    });
  }

  if (avgPain > 6) {
    recommendations.push({
      type: 'pain-management',
      message: 'Pain levels elevated. Try your rest rituals or pain management techniques.',
      priority: 'high'
    });
  }

  if (totalWater < 1500 && new Date().getHours() > 12) {
    recommendations.push({
      type: 'hydration',
      message: 'Low hydration detected. Try to drink some water to help manage POTS symptoms.',
      priority: 'medium'
    });
  }

  return recommendations;
};

/**
 * Get AI-powered task prioritization
 */
export const getAIPrioritizedTasks = async () => {
  const tasks = await db.tasks.where('completed').equals(false).toArray();

  // Get current energy level
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const recentMood = await db.mood.where('timestamp').aboveOrEqual(today).toArray();
  const energyLevel = recentMood[recentMood.length - 1]?.energy || 5;

  // Prioritize based on energy and urgency
  return tasks.sort((a, b) => {
    // High priority first
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (b.priority === 'high' && a.priority !== 'high') return 1;

    // If low energy, suggest easier tasks
    if (energyLevel <= 3) {
      // Deprioritize tasks without due dates (can wait)
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && !b.dueDate) return -1;
    }

    // Due date urgency
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    return 0;
  });
};

/**
 * Export all AI data for backup
 */
export const exportAILearningData = () => {
  const learningData = aiLifeManager.getLearningData();
  const blob = new Blob([JSON.stringify(learningData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-learning-data-${new Date().toISOString()}.json`;
  a.click();

  URL.revokeObjectURL(url);
};

/**
 * Import AI learning data from backup
 */
export const importAILearningData = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        localStorage.setItem('ai-life-manager-learning', JSON.stringify(data));
        window.location.reload(); // Reload to apply
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid AI learning data file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize AI Life Manager in your app
 * Call this in your main App.tsx
 */
export const initializeAILifeManager = () => {
  // Setup event listeners
  setupAIEventListeners();

  // Start monitoring (already auto-started, but you can restart with custom interval)
  aiLifeManager.startMonitoring(15); // Check every 15 minutes

  console.log('AI Life Manager initialized');
  console.log('Active roles:', aiLifeManager.getRoles().filter(r => r.active).length);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Health
  logVitalSigns,
  takeMedication,
  logHydration,
  logPain,
  logMood,

  // Education
  updateCourseProgress,
  completeCourse,

  // Tasks
  createTask,
  completeTask,

  // Finance
  logIncome,
  logExpense,

  // Utilities
  getContextualRecommendations,
  getAIPrioritizedTasks,
  exportAILearningData,
  importAILearningData,
  initializeAILifeManager
};
