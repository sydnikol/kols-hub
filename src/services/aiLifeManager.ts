/**
 * AI LIFE MANAGER - The Central Intelligence Brain
 *
 * Acts as the master coordinator for ALL app features:
 * - Housewife: Manages home, chores, cleaning schedules
 * - Teacher: Tracks learning, education, provides lessons
 * - Partner: Emotional support, relationship tracking
 * - Health Advocate: Monitors vitals, meds, symptoms, correlations
 * - Caretaker: Coordinates care team, appointments
 * - Money Manager: Tracks passive income, expenses, financial goals
 * - Helper: Task assistance, automation
 * - Personal Assistant: Calendar, reminders, organization
 * - Social Worker: Community connections, support network
 * - Fighter: Advocacy, self-advocacy scripts
 * - Therapist: Mental health support, crisis intervention
 * - Mentor: Personal growth, goal tracking
 * - Home Manager: Household management, inventory
 * - Doctor: Health monitoring, symptom tracking
 */

import { db } from '../utils/database';
import type {
  VitalRecord,
  MedicationRecord,
  HydrationRecord,
  PainRecord,
  MoodRecord,
  CourseProgress,
  PassiveIncomeIdea,
  Task,
  BodyWeatherLog,
  PatternInsight
} from '../utils/database';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AIRole {
  id: RoleId;
  name: string;
  description: string;
  active: boolean;
  capabilities: string[];
  priority: number; // 1-10, higher = more active
}

export type RoleId =
  | 'housewife'
  | 'teacher'
  | 'partner'
  | 'health-advocate'
  | 'caretaker'
  | 'money-manager'
  | 'helper'
  | 'personal-assistant'
  | 'social-worker'
  | 'fighter'
  | 'therapist'
  | 'mentor'
  | 'home-manager'
  | 'doctor';

export interface AIInsight {
  id: string;
  timestamp: Date;
  role: RoleId;
  type: 'suggestion' | 'warning' | 'achievement' | 'pattern' | 'prediction' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  data?: any;
  actionable: boolean;
  actions?: AIAction[];
  expiresAt?: Date;
  dismissed?: boolean;
}

export interface AIAction {
  id: string;
  label: string;
  type: 'navigate' | 'execute' | 'remind' | 'dismiss';
  payload?: any;
}

export interface HealthCorrelation {
  id: string;
  variable1: string;
  variable2: string;
  correlation: number; // -1 to 1
  confidence: number; // 0 to 1
  description: string;
  dataPoints: number;
  detectedAt: Date;
}

export interface DailyReport {
  date: Date;
  summary: string;
  healthScore: number; // 0-100
  energyPrediction: number; // spoons
  alerts: AIInsight[];
  achievements: string[];
  recommendations: AIInsight[];
  stats: {
    health: {
      vitals: VitalRecord | null;
      hydration: number;
      sodium: number;
      pain: number;
      mood: MoodRecord | null;
      medicationsDue: number;
    };
    learning: {
      timeSpent: number;
      coursesActive: number;
      creditsEarned: number;
    };
    finance: {
      income: number;
      expenses: number;
      balance: number;
    };
    tasks: {
      completed: number;
      pending: number;
      overdue: number;
    };
  };
}

export interface CrisisDetection {
  detected: boolean;
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  recommendations: string[];
  notifyCareTeam: boolean;
  emergencyProtocol?: string;
}

export interface AILearningData {
  preferences: Record<string, any>;
  patterns: Record<string, any>;
  correlations: HealthCorrelation[];
  insights: PatternInsight[];
  userFeedback: Record<string, number>; // insight ID -> rating
}

// ============================================================================
// AI ROLES CONFIGURATION
// ============================================================================

const AI_ROLES: Record<RoleId, AIRole> = {
  'housewife': {
    id: 'housewife',
    name: 'Home Manager',
    description: 'Manages home tasks, chores, cleaning schedules, and household organization',
    active: true,
    capabilities: [
      'Track cleaning schedules',
      'Manage household inventory',
      'Coordinate chores',
      'Meal planning assistance',
      'Home maintenance reminders'
    ],
    priority: 7
  },
  'teacher': {
    id: 'teacher',
    name: 'Educational Guide',
    description: 'Tracks learning progress, suggests courses, provides educational support',
    active: true,
    capabilities: [
      'Track course progress',
      'Suggest learning paths',
      'Celebrate achievements',
      'Optimize study schedules',
      'Resume building'
    ],
    priority: 8
  },
  'partner': {
    id: 'partner',
    name: 'Emotional Companion',
    description: 'Provides emotional support, relationship tracking, and companionship',
    active: true,
    capabilities: [
      'Emotional check-ins',
      'Relationship insights',
      'Affirmations',
      'Celebration of wins',
      'Comfort during hard times'
    ],
    priority: 9
  },
  'health-advocate': {
    id: 'health-advocate',
    name: 'Health Guardian',
    description: 'Monitors vitals, medications, symptoms, and health correlations',
    active: true,
    capabilities: [
      'Vital sign monitoring',
      'Medication reminders',
      'Symptom tracking',
      'Health correlations',
      'Doctor visit prep'
    ],
    priority: 10
  },
  'caretaker': {
    id: 'caretaker',
    name: 'Care Coordinator',
    description: 'Coordinates care team, appointments, and support network',
    active: true,
    capabilities: [
      'Appointment scheduling',
      'Care team communication',
      'Task delegation',
      'Support coordination',
      'Emergency contact management'
    ],
    priority: 9
  },
  'money-manager': {
    id: 'money-manager',
    name: 'Financial Advisor',
    description: 'Tracks passive income, expenses, and financial goals',
    active: true,
    capabilities: [
      'Income tracking',
      'Expense monitoring',
      'Budget planning',
      'Passive income ideas',
      'Financial goal tracking'
    ],
    priority: 7
  },
  'helper': {
    id: 'helper',
    name: 'Task Assistant',
    description: 'Provides task assistance, automation, and productivity support',
    active: true,
    capabilities: [
      'Task prioritization',
      'Automation suggestions',
      'Workflow optimization',
      'Productivity tracking',
      'Spoon management'
    ],
    priority: 8
  },
  'personal-assistant': {
    id: 'personal-assistant',
    name: 'Personal Organizer',
    description: 'Manages calendar, reminders, and daily organization',
    active: true,
    capabilities: [
      'Calendar management',
      'Reminder system',
      'Schedule optimization',
      'Time blocking',
      'Priority management'
    ],
    priority: 8
  },
  'social-worker': {
    id: 'social-worker',
    name: 'Community Connector',
    description: 'Facilitates community connections and support network',
    active: true,
    capabilities: [
      'Community resources',
      'Social connection suggestions',
      'Support group coordination',
      'Networking opportunities',
      'Isolation prevention'
    ],
    priority: 6
  },
  'fighter': {
    id: 'fighter',
    name: 'Advocacy Champion',
    description: 'Provides advocacy support and self-advocacy scripts',
    active: true,
    capabilities: [
      'Self-advocacy scripts',
      'Rights information',
      'Assertiveness coaching',
      'Boundary setting',
      'Empowerment support'
    ],
    priority: 8
  },
  'therapist': {
    id: 'therapist',
    name: 'Mental Health Support',
    description: 'Provides mental health support and crisis intervention',
    active: true,
    capabilities: [
      'Emotional regulation',
      'Crisis detection',
      'Coping strategies',
      'Mental health tracking',
      'Therapy integration'
    ],
    priority: 10
  },
  'mentor': {
    id: 'mentor',
    name: 'Growth Guide',
    description: 'Supports personal growth and goal achievement',
    active: true,
    capabilities: [
      'Goal setting',
      'Progress tracking',
      'Skill development',
      'Personal growth insights',
      'Achievement celebration'
    ],
    priority: 7
  },
  'home-manager': {
    id: 'home-manager',
    name: 'Household Administrator',
    description: 'Manages household operations and inventory',
    active: true,
    capabilities: [
      'Inventory management',
      'Maintenance scheduling',
      'Household budgeting',
      'Supply tracking',
      'Organization systems'
    ],
    priority: 6
  },
  'doctor': {
    id: 'doctor',
    name: 'Medical Monitor',
    description: 'Monitors health data, symptoms, and medical correlations',
    active: true,
    capabilities: [
      'Symptom analysis',
      'Health pattern detection',
      'Medical correlation tracking',
      'Treatment effectiveness',
      'Health trend analysis'
    ],
    priority: 10
  }
};

// ============================================================================
// EVENT EMITTER FOR CROSS-FEATURE COMMUNICATION
// ============================================================================

type EventCallback = (data: any) => void;

class EventEmitter {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  clear(): void {
    this.events.clear();
  }
}

// ============================================================================
// AI LIFE MANAGER SERVICE
// ============================================================================

class AILifeManagerService {
  private eventBus: EventEmitter;
  private learningData: AILearningData;
  private activeInsights: Map<string, AIInsight> = new Map();
  private monitoringInterval: number | null = null;

  constructor() {
    this.eventBus = new EventEmitter();
    this.learningData = this.loadLearningData();
    this.setupEventListeners();
  }

  // ========================================================================
  // INITIALIZATION & LIFECYCLE
  // ========================================================================

  private loadLearningData(): AILearningData {
    const stored = localStorage.getItem('ai-life-manager-learning');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load AI learning data:', e);
      }
    }
    return {
      preferences: {},
      patterns: {},
      correlations: [],
      insights: [],
      userFeedback: {}
    };
  }

  private saveLearningData(): void {
    localStorage.setItem('ai-life-manager-learning', JSON.stringify(this.learningData));
  }

  private setupEventListeners(): void {
    // Listen for health data changes
    this.eventBus.on('vital:recorded', (data) => this.onVitalRecorded(data));
    this.eventBus.on('medication:taken', (data) => this.onMedicationTaken(data));
    this.eventBus.on('hydration:logged', (data) => this.onHydrationLogged(data));
    this.eventBus.on('pain:logged', (data) => this.onPainLogged(data));
    this.eventBus.on('mood:logged', (data) => this.onMoodLogged(data));

    // Listen for learning events
    this.eventBus.on('course:progress', (data) => this.onCourseProgress(data));
    this.eventBus.on('achievement:unlocked', (data) => this.onAchievementUnlocked(data));

    // Listen for financial events
    this.eventBus.on('income:earned', (data) => this.onIncomeEarned(data));
    this.eventBus.on('expense:logged', (data) => this.onExpenseLogged(data));

    // Listen for task events
    this.eventBus.on('task:completed', (data) => this.onTaskCompleted(data));
    this.eventBus.on('task:created', (data) => this.onTaskCreated(data));
  }

  startMonitoring(intervalMinutes: number = 15): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = window.setInterval(() => {
      this.runMonitoringCycle();
    }, intervalMinutes * 60 * 1000);

    // Run immediately
    this.runMonitoringCycle();
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  // ========================================================================
  // DAILY INTELLIGENCE REPORT
  // ========================================================================

  async generateDailyReport(): Promise<DailyReport> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Gather all data
    const [
      vitals,
      hydration,
      pain,
      mood,
      medications,
      courses,
      tasks
    ] = await Promise.all([
      db.vitals.where('timestamp').aboveOrEqual(today).toArray(),
      db.hydration.where('timestamp').aboveOrEqual(today).toArray(),
      db.pain.where('timestamp').aboveOrEqual(today).toArray(),
      db.mood.where('timestamp').aboveOrEqual(today).toArray(),
      db.medications.where('status').equals('Active').toArray(),
      db.education.where('status').equals('in-progress').toArray(),
      db.tasks.where('createdAt').aboveOrEqual(today).toArray()
    ]);

    // Calculate stats
    const totalWater = hydration.reduce((sum, h) => sum + h.waterIntake, 0);
    const totalSodium = hydration.reduce((sum, h) => sum + h.sodiumIntake, 0);
    const avgPain = pain.length > 0 ? pain.reduce((sum, p) => sum + p.painLevel, 0) / pain.length : 0;
    const latestMood = mood[mood.length - 1] || null;
    const latestVital = vitals[vitals.length - 1] || null;

    const medicationsDue = medications.filter(m => {
      if (!m.nextDose) return false;
      const next = new Date(m.nextDose);
      return next <= new Date();
    }).length;

    const tasksCompleted = tasks.filter(t => t.completed).length;
    const tasksPending = tasks.filter(t => !t.completed && (!t.dueDate || new Date(t.dueDate) >= new Date())).length;
    const tasksOverdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;

    // Generate insights
    const insights = await this.generateInsights();
    const alerts = insights.filter(i => i.priority === 'high' || i.priority === 'urgent');
    const recommendations = insights.filter(i => i.type === 'suggestion');

    // Calculate health score
    const healthScore = this.calculateHealthScore({
      vitals: latestVital,
      hydration: totalWater,
      pain: avgPain,
      mood: latestMood,
      medicationCompliance: medicationsDue === 0 ? 100 : 50
    });

    // Predict energy
    const energyPrediction = this.predictEnergyLevel({
      mood: latestMood,
      pain: avgPain,
      hydration: totalWater,
      sleep: 0 // TODO: integrate sleep tracking
    });

    // Generate achievements
    const achievements: string[] = [];
    if (totalWater >= 2500) achievements.push('Met hydration goal!');
    if (totalSodium >= 4000) achievements.push('Met sodium goal for POTS!');
    if (tasksCompleted > 0) achievements.push(`Completed ${tasksCompleted} tasks!`);
    if (courses.length > 0) achievements.push('Actively learning!');

    // Generate summary
    const summary = this.generateDailySummary({
      healthScore,
      energyPrediction,
      achievements,
      alerts
    });

    return {
      date: new Date(),
      summary,
      healthScore,
      energyPrediction,
      alerts,
      achievements,
      recommendations,
      stats: {
        health: {
          vitals: latestVital,
          hydration: totalWater,
          sodium: totalSodium,
          pain: avgPain,
          mood: latestMood,
          medicationsDue
        },
        learning: {
          timeSpent: courses.reduce((sum, c) => sum + c.timeSpent, 0),
          coursesActive: courses.length,
          creditsEarned: 0 // TODO: calculate from completed courses
        },
        finance: {
          income: 0, // TODO: integrate finance tracking
          expenses: 0,
          balance: 0
        },
        tasks: {
          completed: tasksCompleted,
          pending: tasksPending,
          overdue: tasksOverdue
        }
      }
    };
  }

  private generateDailySummary(data: {
    healthScore: number;
    energyPrediction: number;
    achievements: string[];
    alerts: AIInsight[];
  }): string {
    const { healthScore, energyPrediction, achievements, alerts } = data;

    let summary = '';

    if (healthScore >= 80) {
      summary += 'You\'re doing well today! ';
    } else if (healthScore >= 60) {
      summary += 'You\'re managing okay today. ';
    } else {
      summary += 'Take it easy today. ';
    }

    if (energyPrediction <= 3) {
      summary += 'Low energy predicted - prioritize rest and essential tasks only. ';
    } else if (energyPrediction <= 6) {
      summary += 'Moderate energy expected - pace yourself. ';
    } else {
      summary += 'Good energy levels predicted! ';
    }

    if (alerts.length > 0) {
      summary += `You have ${alerts.length} important alert${alerts.length > 1 ? 's' : ''} to review. `;
    }

    if (achievements.length > 0) {
      summary += `Great job on ${achievements.length} achievement${achievements.length > 1 ? 's' : ''}!`;
    }

    return summary.trim();
  }

  // ========================================================================
  // HEALTH MONITORING & CORRELATIONS
  // ========================================================================

  private calculateHealthScore(data: {
    vitals: VitalRecord | null;
    hydration: number;
    pain: number;
    mood: MoodRecord | null;
    medicationCompliance: number;
  }): number {
    let score = 0;
    let factors = 0;

    // Vitals (30 points)
    if (data.vitals) {
      factors++;
      let vitalScore = 30;

      if (data.vitals.bloodPressureSystolic && data.vitals.bloodPressureDiastolic) {
        const sys = data.vitals.bloodPressureSystolic;
        const dia = data.vitals.bloodPressureDiastolic;
        if (sys > 140 || sys < 90 || dia > 90 || dia < 60) vitalScore -= 10;
      }

      if (data.vitals.heartRate) {
        const hr = data.vitals.heartRate;
        if (hr > 100 || hr < 60) vitalScore -= 5;
      }

      if (data.vitals.oxygenLevel) {
        const o2 = data.vitals.oxygenLevel;
        if (o2 < 95) vitalScore -= 10;
      }

      score += Math.max(0, vitalScore);
    }

    // Hydration (20 points)
    factors++;
    const hydrationGoal = 2500;
    score += Math.min(20, (data.hydration / hydrationGoal) * 20);

    // Pain (20 points)
    factors++;
    score += Math.max(0, 20 - (data.pain * 2));

    // Mood/Energy (20 points)
    if (data.mood) {
      factors++;
      score += data.mood.energy * 2; // spoons to score
    }

    // Medication Compliance (10 points)
    factors++;
    score += data.medicationCompliance * 0.1;

    return Math.round(score);
  }

  private predictEnergyLevel(data: {
    mood: MoodRecord | null;
    pain: number;
    hydration: number;
    sleep: number;
  }): number {
    let spoons = 5; // baseline

    // Mood influence
    if (data.mood) {
      spoons = data.mood.energy;
    }

    // Pain reduces energy
    spoons -= Math.floor(data.pain / 3);

    // Hydration influence
    if (data.hydration < 1500) spoons -= 1;
    if (data.hydration >= 2500) spoons += 1;

    // Sleep influence (TODO: when sleep tracking is added)
    // if (data.sleep < 6) spoons -= 2;
    // if (data.sleep >= 8) spoons += 1;

    return Math.max(1, Math.min(10, spoons));
  }

  async analyzeHealthCorrelations(): Promise<HealthCorrelation[]> {
    const correlations: HealthCorrelation[] = [];

    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [hydration, pain, mood, vitals] = await Promise.all([
      db.hydration.where('timestamp').aboveOrEqual(thirtyDaysAgo).toArray(),
      db.pain.where('timestamp').aboveOrEqual(thirtyDaysAgo).toArray(),
      db.mood.where('timestamp').aboveOrEqual(thirtyDaysAgo).toArray(),
      db.vitals.where('timestamp').aboveOrEqual(thirtyDaysAgo).toArray()
    ]);

    // Analyze hydration vs pain
    if (hydration.length > 5 && pain.length > 5) {
      const correlation = this.calculateCorrelation(
        hydration.map(h => h.waterIntake),
        pain.map(p => p.painLevel)
      );

      if (Math.abs(correlation) > 0.3) {
        correlations.push({
          id: `corr-hydration-pain-${Date.now()}`,
          variable1: 'Hydration',
          variable2: 'Pain Level',
          correlation,
          confidence: Math.min(hydration.length / 30, 1),
          description: correlation < 0
            ? 'Higher hydration tends to correlate with lower pain levels'
            : 'Lower hydration may be associated with higher pain',
          dataPoints: Math.min(hydration.length, pain.length),
          detectedAt: new Date()
        });
      }
    }

    // Analyze hydration vs mood/energy
    if (hydration.length > 5 && mood.length > 5) {
      const correlation = this.calculateCorrelation(
        hydration.map(h => h.waterIntake),
        mood.map(m => m.energy)
      );

      if (Math.abs(correlation) > 0.3) {
        correlations.push({
          id: `corr-hydration-energy-${Date.now()}`,
          variable1: 'Hydration',
          variable2: 'Energy Level',
          correlation,
          confidence: Math.min(hydration.length / 30, 1),
          description: correlation > 0
            ? 'Better hydration correlates with higher energy levels'
            : 'Hydration patterns may affect energy',
          dataPoints: Math.min(hydration.length, mood.length),
          detectedAt: new Date()
        });
      }
    }

    // Store correlations in learning data
    this.learningData.correlations = correlations;
    this.saveLearningData();

    return correlations;
  }

  private calculateCorrelation(arr1: number[], arr2: number[]): number {
    const n = Math.min(arr1.length, arr2.length);
    if (n < 2) return 0;

    const mean1 = arr1.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const mean2 = arr2.slice(0, n).reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let sum1Sq = 0;
    let sum2Sq = 0;

    for (let i = 0; i < n; i++) {
      const diff1 = arr1[i] - mean1;
      const diff2 = arr2[i] - mean2;
      numerator += diff1 * diff2;
      sum1Sq += diff1 * diff1;
      sum2Sq += diff2 * diff2;
    }

    const denominator = Math.sqrt(sum1Sq * sum2Sq);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // ========================================================================
  // CRISIS DETECTION
  // ========================================================================

  async detectCrisis(): Promise<CrisisDetection> {
    const triggers: string[] = [];
    let severity: CrisisDetection['severity'] = 'none';
    const recommendations: string[] = [];

    // Get recent data
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);

    const [recentVitals, recentPain, recentMood] = await Promise.all([
      db.vitals.where('timestamp').aboveOrEqual(lastHour).toArray(),
      db.pain.where('timestamp').aboveOrEqual(lastHour).toArray(),
      db.mood.where('timestamp').aboveOrEqual(lastHour).toArray()
    ]);

    // Check vitals
    if (recentVitals.length > 0) {
      const latest = recentVitals[recentVitals.length - 1];

      if (latest.bloodPressureSystolic && latest.bloodPressureSystolic > 180) {
        triggers.push('Blood pressure critically high');
        severity = 'critical';
        recommendations.push('Seek immediate medical attention');
      } else if (latest.bloodPressureSystolic && latest.bloodPressureSystolic > 160) {
        triggers.push('Blood pressure very high');
        severity = severity === 'critical' ? 'critical' : 'high';
        recommendations.push('Rest and monitor closely');
      }

      if (latest.oxygenLevel && latest.oxygenLevel < 90) {
        triggers.push('Oxygen level critically low');
        severity = 'critical';
        recommendations.push('Seek immediate medical attention');
      } else if (latest.oxygenLevel && latest.oxygenLevel < 95) {
        triggers.push('Oxygen level low');
        severity = severity === 'critical' ? 'critical' : 'high';
        recommendations.push('Monitor oxygen and consider supplementation');
      }

      if (latest.heartRate && latest.heartRate > 120) {
        triggers.push('Heart rate elevated (possible POTS flare)');
        severity = severity === 'critical' ? 'critical' : severity === 'high' ? 'high' : 'medium';
        recommendations.push('Lie down, elevate legs, hydrate with electrolytes');
      }
    }

    // Check pain
    if (recentPain.length > 0) {
      const latest = recentPain[recentPain.length - 1];

      if (latest.painLevel >= 9) {
        triggers.push('Severe pain level');
        severity = severity === 'critical' ? 'critical' : 'high';
        recommendations.push('Consider emergency care if pain is sudden or unusual');
      } else if (latest.painLevel >= 7) {
        triggers.push('High pain level');
        severity = severity === 'critical' || severity === 'high' ? severity : 'medium';
        recommendations.push('Use pain management techniques, rest');
      }
    }

    // Check mood/mental health
    if (recentMood.length > 0) {
      const latest = recentMood[recentMood.length - 1];

      if (latest.anxiety && latest.anxiety >= 9) {
        triggers.push('Severe anxiety');
        severity = severity === 'critical' ? 'critical' : 'high';
        recommendations.push('Use grounding techniques, consider crisis support');
      }

      if (latest.energy <= 1) {
        triggers.push('Critically low energy');
        severity = severity === 'critical' || severity === 'high' ? severity : 'medium';
        recommendations.push('Rest required, cancel non-essential activities');
      }
    }

    return {
      detected: triggers.length > 0,
      severity,
      triggers,
      recommendations,
      notifyCareTeam: severity === 'critical' || severity === 'high',
      emergencyProtocol: severity === 'critical' ? 'Call 911 or go to ER' : undefined
    };
  }

  // ========================================================================
  // PROACTIVE INSIGHTS & SUGGESTIONS
  // ========================================================================

  async generateInsights(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    const now = new Date();

    // Get recent data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      hydrationToday,
      sodiumToday,
      vitalsToday,
      painToday,
      medications
    ] = await Promise.all([
      db.hydration.where('timestamp').aboveOrEqual(today).toArray(),
      db.hydration.where('timestamp').aboveOrEqual(today).toArray(),
      db.vitals.where('timestamp').aboveOrEqual(today).toArray(),
      db.pain.where('timestamp').aboveOrEqual(today).toArray(),
      db.medications.where('status').equals('Active').toArray()
    ]);

    // Hydration insights
    const totalWater = hydrationToday.reduce((sum, h) => sum + h.waterIntake, 0);
    if (totalWater < 1000 && now.getHours() >= 14) {
      insights.push({
        id: `insight-hydration-${Date.now()}`,
        timestamp: now,
        role: 'health-advocate',
        type: 'warning',
        priority: 'high',
        title: 'Low Hydration Detected',
        message: 'You\'ve only had ' + Math.round(totalWater) + 'mL of water today. Your POTS symptoms may worsen. Try to drink some water now.',
        actionable: true,
        actions: [
          { id: 'log-water', label: 'Log Water Intake', type: 'navigate', payload: '/health' },
          { id: 'dismiss', label: 'Dismiss', type: 'dismiss' }
        ]
      });
    }

    // Sodium insights (POTS)
    const totalSodium = sodiumToday.reduce((sum, h) => sum + h.sodiumIntake, 0);
    if (totalSodium < 2000 && now.getHours() >= 14) {
      insights.push({
        id: `insight-sodium-${Date.now()}`,
        timestamp: now,
        role: 'health-advocate',
        type: 'suggestion',
        priority: 'medium',
        title: 'Sodium Intake Low',
        message: 'You\'ve had ' + Math.round(totalSodium) + 'mg sodium today. Consider a salty snack or electrolyte drink to help manage POTS.',
        actionable: true,
        actions: [
          { id: 'log-sodium', label: 'Log Sodium', type: 'navigate', payload: '/health' },
          { id: 'dismiss', label: 'Dismiss', type: 'dismiss' }
        ]
      });
    }

    // Medication reminders
    const overdueMeds = medications.filter(m => {
      if (!m.nextDose) return false;
      return new Date(m.nextDose) <= now;
    });

    if (overdueMeds.length > 0) {
      insights.push({
        id: `insight-meds-${Date.now()}`,
        timestamp: now,
        role: 'health-advocate',
        type: 'reminder',
        priority: 'high',
        title: 'Medication Due',
        message: `You have ${overdueMeds.length} medication${overdueMeds.length > 1 ? 's' : ''} due: ${overdueMeds.map(m => m.drugName).join(', ')}`,
        actionable: true,
        actions: [
          { id: 'take-meds', label: 'Mark as Taken', type: 'navigate', payload: '/health/medications' },
          { id: 'snooze', label: 'Remind Later', type: 'remind', payload: { minutes: 30 } }
        ]
      });
    }

    // Refill reminders
    const needRefill = medications.filter(m => {
      return m.refills !== undefined && m.refills < 1;
    });

    if (needRefill.length > 0) {
      insights.push({
        id: `insight-refill-${Date.now()}`,
        timestamp: now,
        role: 'caretaker',
        type: 'reminder',
        priority: 'medium',
        title: 'Medication Refills Needed',
        message: `${needRefill.length} medication${needRefill.length > 1 ? 's need' : ' needs'} refills: ${needRefill.map(m => m.drugName).join(', ')}`,
        actionable: true,
        actions: [
          { id: 'contact-pharmacy', label: 'Contact Pharmacy', type: 'execute' },
          { id: 'dismiss', label: 'Already Ordered', type: 'dismiss' }
        ]
      });
    }

    // Pain pattern insights
    if (painToday.length > 0) {
      const avgPain = painToday.reduce((sum, p) => sum + p.painLevel, 0) / painToday.length;
      if (avgPain > 7) {
        insights.push({
          id: `insight-pain-${Date.now()}`,
          timestamp: now,
          role: 'therapist',
          type: 'suggestion',
          priority: 'medium',
          title: 'High Pain Day',
          message: 'Your pain levels are elevated today. Consider using your rest rituals or pain management techniques.',
          actionable: true,
          actions: [
            { id: 'rest-ritual', label: 'Start Rest Ritual', type: 'navigate', payload: '/rest' },
            { id: 'pain-log', label: 'Log Pain Details', type: 'navigate', payload: '/health' }
          ]
        });
      }
    }

    // BP check for POTS
    if (vitalsToday.length > 0) {
      const latest = vitalsToday[vitalsToday.length - 1];
      if (latest.bloodPressureSystolic && latest.bloodPressureSystolic > 140) {
        insights.push({
          id: `insight-bp-${Date.now()}`,
          timestamp: now,
          role: 'doctor',
          type: 'warning',
          priority: 'high',
          title: 'Blood Pressure Elevated',
          message: `Your BP is ${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}. Have you had enough water and salt today?`,
          actionable: true,
          actions: [
            { id: 'hydrate', label: 'Log Hydration', type: 'navigate', payload: '/health' },
            { id: 'rest', label: 'Rest', type: 'execute' }
          ]
        });
      }
    }

    // Learning encouragement
    const courses = await db.education.where('status').equals('in-progress').toArray();
    if (courses.length > 0 && now.getDay() !== 0) { // Not Sunday
      const randomCourse = courses[Math.floor(Math.random() * courses.length)];
      insights.push({
        id: `insight-learning-${Date.now()}`,
        timestamp: now,
        role: 'teacher',
        type: 'suggestion',
        priority: 'low',
        title: 'Learning Opportunity',
        message: `You have ${courses.length} course${courses.length > 1 ? 's' : ''} in progress. Maybe spend 15 minutes on "${randomCourse.courseName}"?`,
        actionable: true,
        actions: [
          { id: 'study', label: 'Start Learning', type: 'navigate', payload: '/education' },
          { id: 'later', label: 'Maybe Later', type: 'dismiss' }
        ]
      });
    }

    // Filter out dismissed insights
    const filtered = insights.filter(i => !this.activeInsights.has(i.id) || !this.activeInsights.get(i.id)!.dismissed);

    // Store active insights
    filtered.forEach(i => this.activeInsights.set(i.id, i));

    return filtered;
  }

  dismissInsight(insightId: string): void {
    const insight = this.activeInsights.get(insightId);
    if (insight) {
      insight.dismissed = true;
      this.activeInsights.set(insightId, insight);
    }
  }

  // ========================================================================
  // MONITORING CYCLE
  // ========================================================================

  private async runMonitoringCycle(): Promise<void> {
    try {
      // Check for crisis situations
      const crisis = await this.detectCrisis();
      if (crisis.detected && crisis.severity === 'critical') {
        this.eventBus.emit('crisis:detected', crisis);
      }

      // Generate and emit new insights
      const insights = await this.generateInsights();
      if (insights.length > 0) {
        this.eventBus.emit('insights:updated', insights);
      }

      // Analyze correlations periodically
      const hour = new Date().getHours();
      if (hour === 22) { // 10 PM - end of day analysis
        await this.analyzeHealthCorrelations();
      }

    } catch (error) {
      console.error('Error in monitoring cycle:', error);
    }
  }

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  private async onVitalRecorded(vital: VitalRecord): Promise<void> {
    // Check for concerning vitals
    if (vital.bloodPressureSystolic && vital.bloodPressureSystolic > 160) {
      this.eventBus.emit('alert:high-bp', vital);
    }
    if (vital.oxygenLevel && vital.oxygenLevel < 95) {
      this.eventBus.emit('alert:low-oxygen', vital);
    }
  }

  private async onMedicationTaken(medication: MedicationRecord): Promise<void> {
    // Log achievement
    await db.logEvolution('Medication taken', 'health', { medication: medication.drugName });
  }

  private async onHydrationLogged(hydration: HydrationRecord): Promise<void> {
    // Check if goal met
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = await db.hydration.where('timestamp').aboveOrEqual(today).toArray();
    const total = todayLogs.reduce((sum, h) => sum + h.waterIntake, 0);

    if (total >= 2500) {
      this.eventBus.emit('achievement:hydration-goal', { amount: total });
    }
  }

  private async onPainLogged(pain: PainRecord): Promise<void> {
    // Detect pain spikes
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentPain = await db.pain.where('timestamp').aboveOrEqual(yesterday).toArray();
    const avgPain = recentPain.reduce((sum, p) => sum + p.painLevel, 0) / recentPain.length;

    if (pain.painLevel > avgPain + 3) {
      this.eventBus.emit('alert:pain-spike', { current: pain.painLevel, average: avgPain });
    }
  }

  private async onMoodLogged(mood: MoodRecord): Promise<void> {
    // Detect low energy
    if (mood.energy <= 2) {
      this.eventBus.emit('alert:low-energy', mood);
    }
  }

  private async onCourseProgress(course: CourseProgress): Promise<void> {
    // Celebrate milestones
    if (course.progress % 25 === 0) {
      this.eventBus.emit('achievement:learning-milestone', course);
    }
  }

  private async onAchievementUnlocked(achievement: any): Promise<void> {
    this.eventBus.emit('celebration:achievement', achievement);
  }

  private async onIncomeEarned(income: any): Promise<void> {
    this.eventBus.emit('finance:income', income);
  }

  private async onExpenseLogged(expense: any): Promise<void> {
    this.eventBus.emit('finance:expense', expense);
  }

  private async onTaskCompleted(task: Task): Promise<void> {
    this.eventBus.emit('achievement:task-complete', task);
  }

  private async onTaskCreated(task: Task): Promise<void> {
    // Task prioritization logic
    if (task.priority === 'high') {
      this.eventBus.emit('alert:high-priority-task', task);
    }
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  getRoles(): AIRole[] {
    return Object.values(AI_ROLES);
  }

  getRole(roleId: RoleId): AIRole | undefined {
    return AI_ROLES[roleId];
  }

  toggleRole(roleId: RoleId, active: boolean): void {
    if (AI_ROLES[roleId]) {
      AI_ROLES[roleId].active = active;
      this.saveLearningData();
    }
  }

  getEventBus(): EventEmitter {
    return this.eventBus;
  }

  getActiveInsights(): AIInsight[] {
    return Array.from(this.activeInsights.values()).filter(i => !i.dismissed);
  }

  getLearningData(): AILearningData {
    return this.learningData;
  }

  recordFeedback(insightId: string, rating: number): void {
    this.learningData.userFeedback[insightId] = rating;
    this.saveLearningData();
  }

  // Emit custom events
  emit(event: string, data?: any): void {
    this.eventBus.emit(event, data);
  }

  // Subscribe to events
  on(event: string, callback: EventCallback): void {
    this.eventBus.on(event, callback);
  }

  // Unsubscribe from events
  off(event: string, callback: EventCallback): void {
    this.eventBus.off(event, callback);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const aiLifeManager = new AILifeManagerService();

// Auto-start monitoring
aiLifeManager.startMonitoring(15); // Check every 15 minutes

export default aiLifeManager;
