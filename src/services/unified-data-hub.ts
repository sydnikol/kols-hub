/**
 * UNIFIED DATA HUB - Central Nervous System for Kol's Hub
 * =========================================================
 * This service connects ALL features, removes duplicates, and ensures
 * every system can communicate with every other system in real-time.
 *
 * Architecture:
 * - Event Bus: Real-time cross-system communication
 * - Data Connectors: Link related data across domains
 * - AI Insights: Generate cross-domain recommendations
 * - Sync Manager: Keep all systems in sync
 */

import { openDB, IDBPDatabase } from 'idb';

// ============================================================================
// EVENT BUS - Real-time Cross-System Communication
// ============================================================================

type EventCallback = (data: any) => void;
type EventType =
  | 'health:update' | 'health:medication:taken' | 'health:symptom:logged' | 'health:vitals:recorded'
  | 'finance:transaction' | 'finance:income' | 'finance:expense' | 'finance:goal:progress'
  | 'learning:progress' | 'learning:skill:unlocked' | 'learning:course:completed'
  | 'entertainment:watched' | 'entertainment:listened' | 'entertainment:played'
  | 'food:meal:logged' | 'food:water:logged' | 'food:recipe:cooked' | 'food:grocery:purchased'
  | 'creative:project:updated' | 'creative:idea:generated' | 'creative:monetization:earned'
  | 'relationship:interaction' | 'relationship:event:reminder'
  | 'task:completed' | 'task:created' | 'spoons:updated'
  | 'automation:triggered' | 'integration:synced'
  | 'avatar:outfit:changed' | 'avatar:mood:changed'
  | 'smarthome:device:changed' | 'smarthome:scene:activated'
  | 'dnd:session:started' | 'dnd:character:updated'
  | 'ai:insight:generated' | 'ai:recommendation:made'
  | 'sync:completed' | 'system:initialized';

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private eventHistory: Array<{ type: EventType; data: any; timestamp: Date }> = [];
  private maxHistory = 1000;

  on(event: EventType | string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: EventType, data: any): void {
    const eventData = { type: event, data, timestamp: new Date() };

    // Store in history
    this.eventHistory.push(eventData);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    // Notify listeners
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Event listener error for ${event}:`, error);
      }
    });

    // Also emit to wildcard listeners
    this.listeners.get('*')?.forEach(callback => {
      try {
        callback(eventData);
      } catch (error) {
        console.error('Wildcard listener error:', error);
      }
    });
  }

  getHistory(filter?: EventType): Array<{ type: EventType; data: any; timestamp: Date }> {
    if (filter) {
      return this.eventHistory.filter(e => e.type === filter);
    }
    return [...this.eventHistory];
  }
}

export const eventBus = new EventBus();

// ============================================================================
// UNIFIED DATABASE SCHEMA
// ============================================================================

interface UnifiedDB {
  // Health Ecosystem
  medications: any;
  medicationLogs: any;
  symptoms: any;
  vitals: any;
  moods: any;
  sleep: any;
  exercise: any;
  doctorVisits: any;
  insuranceClaims: any;

  // Finance Ecosystem
  transactions: any;
  budgets: any;
  savingsGoals: any;
  investments: any;
  passiveIncome: any;
  debts: any;
  subscriptions: any;

  // Food Ecosystem
  pantryItems: any;
  groceryItems: any;
  recipes: any;
  mealLogs: any;
  mealPlans: any;
  waterLogs: any;
  nutritionGoals: any;

  // Learning Ecosystem
  courses: any;
  skills: any;
  certifications: any;
  studySessions: any;
  learningGoals: any;

  // Entertainment Ecosystem
  watchHistory: any;
  listenHistory: any;
  gameHistory: any;
  mediaLibrary: any;
  playlists: any;

  // Creative Ecosystem
  projects: any;
  ideas: any;
  portfolio: any;
  monetization: any;

  // Relationship Ecosystem
  contacts: any;
  interactions: any;
  events: any;
  careTeam: any;

  // Task/Productivity Ecosystem
  tasks: any;
  habits: any;
  goals: any;
  spoonLogs: any;
  routines: any;

  // Smart Home Ecosystem
  devices: any;
  scenes: any;
  automations: any;

  // Avatar/Wardrobe Ecosystem
  wardrobeItems: any;
  outfits: any;
  avatarState: any;

  // DnD Ecosystem
  characters: any;
  campaigns: any;
  sessions: any;

  // System
  settings: any;
  integrations: any;
  syncState: any;
  aiInsights: any;
  crossReferences: any;
}

// ============================================================================
// CROSS-REFERENCE SYSTEM
// ============================================================================

interface CrossReference {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationshipType: 'causes' | 'affects' | 'relates_to' | 'triggers' | 'depends_on' | 'correlates';
  strength: number; // 0-1
  metadata?: any;
  createdAt: Date;
  discoveredBy: 'user' | 'ai' | 'system';
}

// ============================================================================
// UNIFIED DATA HUB SERVICE
// ============================================================================

class UnifiedDataHub {
  private db: IDBPDatabase<UnifiedDB> | null = null;
  private initialized = false;

  // -------------------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------------------

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.db = await openDB<UnifiedDB>('unified-kol-hub', 3, {
      upgrade(db, oldVersion, newVersion) {
        // Health stores
        if (!db.objectStoreNames.contains('medications')) {
          db.createObjectStore('medications', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('medicationLogs')) {
          const store = db.createObjectStore('medicationLogs', { keyPath: 'id' });
          store.createIndex('medicationId', 'medicationId');
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('symptoms')) {
          const store = db.createObjectStore('symptoms', { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('vitals')) {
          const store = db.createObjectStore('vitals', { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('moods')) {
          const store = db.createObjectStore('moods', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('sleep')) {
          const store = db.createObjectStore('sleep', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('exercise')) {
          const store = db.createObjectStore('exercise', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('doctorVisits')) {
          const store = db.createObjectStore('doctorVisits', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('insuranceClaims')) {
          const store = db.createObjectStore('insuranceClaims', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }

        // Finance stores
        if (!db.objectStoreNames.contains('transactions')) {
          const store = db.createObjectStore('transactions', { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('category', 'category');
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('budgets')) {
          db.createObjectStore('budgets', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('savingsGoals')) {
          db.createObjectStore('savingsGoals', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('investments')) {
          db.createObjectStore('investments', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('passiveIncome')) {
          const store = db.createObjectStore('passiveIncome', { keyPath: 'id' });
          store.createIndex('source', 'source');
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('debts')) {
          db.createObjectStore('debts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('subscriptions')) {
          db.createObjectStore('subscriptions', { keyPath: 'id' });
        }

        // Food stores
        if (!db.objectStoreNames.contains('pantryItems')) {
          const store = db.createObjectStore('pantryItems', { keyPath: 'id' });
          store.createIndex('category', 'category');
          store.createIndex('expiryDate', 'expiryDate');
        }
        if (!db.objectStoreNames.contains('groceryItems')) {
          const store = db.createObjectStore('groceryItems', { keyPath: 'id' });
          store.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains('recipes')) {
          const store = db.createObjectStore('recipes', { keyPath: 'id' });
          store.createIndex('category', 'category');
          store.createIndex('cuisine', 'cuisine');
        }
        if (!db.objectStoreNames.contains('mealLogs')) {
          const store = db.createObjectStore('mealLogs', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('mealPlans')) {
          const store = db.createObjectStore('mealPlans', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('waterLogs')) {
          const store = db.createObjectStore('waterLogs', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('nutritionGoals')) {
          db.createObjectStore('nutritionGoals', { keyPath: 'id' });
        }

        // Learning stores
        if (!db.objectStoreNames.contains('courses')) {
          const store = db.createObjectStore('courses', { keyPath: 'id' });
          store.createIndex('category', 'category');
          store.createIndex('status', 'status');
        }
        if (!db.objectStoreNames.contains('skills')) {
          const store = db.createObjectStore('skills', { keyPath: 'id' });
          store.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains('certifications')) {
          db.createObjectStore('certifications', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('studySessions')) {
          const store = db.createObjectStore('studySessions', { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('courseId', 'courseId');
        }
        if (!db.objectStoreNames.contains('learningGoals')) {
          db.createObjectStore('learningGoals', { keyPath: 'id' });
        }

        // Entertainment stores
        if (!db.objectStoreNames.contains('watchHistory')) {
          const store = db.createObjectStore('watchHistory', { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('listenHistory')) {
          const store = db.createObjectStore('listenHistory', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('gameHistory')) {
          const store = db.createObjectStore('gameHistory', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('mediaLibrary')) {
          const store = db.createObjectStore('mediaLibrary', { keyPath: 'id' });
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('playlists')) {
          db.createObjectStore('playlists', { keyPath: 'id' });
        }

        // Creative stores
        if (!db.objectStoreNames.contains('projects')) {
          const store = db.createObjectStore('projects', { keyPath: 'id' });
          store.createIndex('type', 'type');
          store.createIndex('status', 'status');
        }
        if (!db.objectStoreNames.contains('ideas')) {
          const store = db.createObjectStore('ideas', { keyPath: 'id' });
          store.createIndex('category', 'category');
          store.createIndex('status', 'status');
        }
        if (!db.objectStoreNames.contains('portfolio')) {
          db.createObjectStore('portfolio', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('monetization')) {
          const store = db.createObjectStore('monetization', { keyPath: 'id' });
          store.createIndex('platform', 'platform');
          store.createIndex('date', 'date');
        }

        // Relationship stores
        if (!db.objectStoreNames.contains('contacts')) {
          const store = db.createObjectStore('contacts', { keyPath: 'id' });
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('interactions')) {
          const store = db.createObjectStore('interactions', { keyPath: 'id' });
          store.createIndex('contactId', 'contactId');
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('events')) {
          const store = db.createObjectStore('events', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('careTeam')) {
          db.createObjectStore('careTeam', { keyPath: 'id' });
        }

        // Task/Productivity stores
        if (!db.objectStoreNames.contains('tasks')) {
          const store = db.createObjectStore('tasks', { keyPath: 'id' });
          store.createIndex('dueDate', 'dueDate');
          store.createIndex('status', 'status');
          store.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains('habits')) {
          const store = db.createObjectStore('habits', { keyPath: 'id' });
          store.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains('goals')) {
          const store = db.createObjectStore('goals', { keyPath: 'id' });
          store.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains('spoonLogs')) {
          const store = db.createObjectStore('spoonLogs', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }
        if (!db.objectStoreNames.contains('routines')) {
          db.createObjectStore('routines', { keyPath: 'id' });
        }

        // Smart Home stores
        if (!db.objectStoreNames.contains('devices')) {
          db.createObjectStore('devices', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('scenes')) {
          db.createObjectStore('scenes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('automations')) {
          db.createObjectStore('automations', { keyPath: 'id' });
        }

        // Avatar/Wardrobe stores
        if (!db.objectStoreNames.contains('wardrobeItems')) {
          const store = db.createObjectStore('wardrobeItems', { keyPath: 'id' });
          store.createIndex('category', 'category');
          store.createIndex('type', 'type');
        }
        if (!db.objectStoreNames.contains('outfits')) {
          db.createObjectStore('outfits', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('avatarState')) {
          db.createObjectStore('avatarState', { keyPath: 'id' });
        }

        // DnD stores
        if (!db.objectStoreNames.contains('characters')) {
          db.createObjectStore('characters', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('campaigns')) {
          db.createObjectStore('campaigns', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' });
          store.createIndex('campaignId', 'campaignId');
          store.createIndex('date', 'date');
        }

        // System stores
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('integrations')) {
          db.createObjectStore('integrations', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('syncState')) {
          db.createObjectStore('syncState', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('aiInsights')) {
          const store = db.createObjectStore('aiInsights', { keyPath: 'id' });
          store.createIndex('date', 'date');
          store.createIndex('category', 'category');
        }
        if (!db.objectStoreNames.contains('crossReferences')) {
          const store = db.createObjectStore('crossReferences', { keyPath: 'id' });
          store.createIndex('sourceType', 'sourceType');
          store.createIndex('targetType', 'targetType');
        }
      }
    });

    this.initialized = true;
    this.setupCrossSystemListeners();
    eventBus.emit('system:initialized', { timestamp: new Date() });
  }

  // -------------------------------------------------------------------------
  // CROSS-SYSTEM LISTENERS - Auto-connect related data
  // -------------------------------------------------------------------------

  private setupCrossSystemListeners(): void {
    // Health -> Finance: Medical expenses
    eventBus.on('health:medication:taken', async (data) => {
      // Check if medication has associated cost
      const medication = await this.getMedication(data.medicationId);
      if (medication?.monthlyCost) {
        const dailyCost = medication.monthlyCost / 30;
        await this.addTransaction({
          id: `med-${data.medicationId}-${Date.now()}`,
          type: 'expense',
          category: 'Medical',
          subcategory: 'Medications',
          amount: dailyCost,
          description: `${medication.name} daily cost`,
          date: new Date(),
          linkedTo: { type: 'medication', id: data.medicationId }
        });
      }
    });

    // Food -> Health: Nutrition tracking
    eventBus.on('food:meal:logged', async (data) => {
      if (data.nutrition) {
        await this.addHealthRecord({
          id: `nutrition-${Date.now()}`,
          type: 'nutrition',
          date: new Date(),
          value: data.nutrition,
          linkedTo: { type: 'mealLog', id: data.id }
        });
      }
    });

    // Learning -> Skills: Auto-update skills
    eventBus.on('learning:course:completed', async (data) => {
      const course = await this.getCourse(data.courseId);
      if (course?.skills) {
        for (const skillName of course.skills) {
          await this.updateSkillProgress(skillName, course.skillPoints || 10);
        }
      }
    });

    // Entertainment -> Mood: Track mood during entertainment
    eventBus.on('entertainment:watched', async (data) => {
      // If user finished watching something, prompt for mood update
      await this.addAIInsight({
        id: `insight-${Date.now()}`,
        category: 'mood',
        type: 'suggestion',
        message: `How are you feeling after watching "${data.title}"?`,
        linkedTo: { type: 'watchHistory', id: data.id },
        date: new Date()
      });
    });

    // Task completion -> Spoons
    eventBus.on('task:completed', async (data) => {
      if (data.spoonCost) {
        await this.updateSpoons(-data.spoonCost, `Completed: ${data.title}`);
      }
    });

    // Passive Income -> Finance
    eventBus.on('creative:monetization:earned', async (data) => {
      await this.addTransaction({
        id: `income-${Date.now()}`,
        type: 'income',
        category: 'Passive Income',
        subcategory: data.platform,
        amount: data.amount,
        description: `${data.platform}: ${data.source}`,
        date: new Date(),
        linkedTo: { type: 'monetization', id: data.id }
      });
      eventBus.emit('finance:income', data);
    });

    // Smart Home -> Health: Adjust environment based on health
    eventBus.on('health:symptom:logged', async (data) => {
      if (data.severity >= 7) {
        // High severity symptom - suggest comfort scene
        await this.addAIInsight({
          id: `insight-${Date.now()}`,
          category: 'smarthome',
          type: 'suggestion',
          message: `High ${data.type} detected. Would you like to activate comfort mode?`,
          action: { type: 'scene', sceneId: 'comfort-mode' },
          linkedTo: { type: 'symptom', id: data.id },
          date: new Date()
        });
      }
    });

    // Water tracking -> Health
    eventBus.on('food:water:logged', async (data) => {
      await this.addHealthRecord({
        id: `hydration-${Date.now()}`,
        type: 'hydration',
        date: new Date(),
        value: data.amount,
        linkedTo: { type: 'waterLog', id: data.id }
      });
    });
  }

  // -------------------------------------------------------------------------
  // HEALTH ECOSYSTEM
  // -------------------------------------------------------------------------

  async getMedication(id: string): Promise<any> {
    if (!this.db) await this.initialize();
    return this.db!.get('medications', id);
  }

  async getAllMedications(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('medications');
  }

  async addMedication(medication: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('medications', { ...medication, updatedAt: new Date() });
    eventBus.emit('health:update', { type: 'medication', action: 'add', data: medication });
  }

  async logMedicationTaken(medicationId: string, taken: boolean, notes?: string): Promise<void> {
    if (!this.db) await this.initialize();
    const log = {
      id: `log-${medicationId}-${Date.now()}`,
      medicationId,
      taken,
      notes,
      timestamp: new Date()
    };
    await this.db!.put('medicationLogs', log);
    eventBus.emit('health:medication:taken', { medicationId, taken, notes });
  }

  async addSymptom(symptom: any): Promise<void> {
    if (!this.db) await this.initialize();
    const record = { ...symptom, id: symptom.id || `symptom-${Date.now()}`, date: new Date() };
    await this.db!.put('symptoms', record);
    eventBus.emit('health:symptom:logged', record);
  }

  async addVitals(vitals: any): Promise<void> {
    if (!this.db) await this.initialize();
    const record = { ...vitals, id: vitals.id || `vitals-${Date.now()}`, date: new Date() };
    await this.db!.put('vitals', record);
    eventBus.emit('health:vitals:recorded', record);
  }

  async addHealthRecord(record: any): Promise<void> {
    if (!this.db) await this.initialize();
    // Store in appropriate table based on type
    const storeName = this.getHealthStoreName(record.type);
    await this.db!.put(storeName as any, { ...record, updatedAt: new Date() });
    eventBus.emit('health:update', record);
  }

  private getHealthStoreName(type: string): string {
    const mapping: Record<string, string> = {
      symptom: 'symptoms',
      vitals: 'vitals',
      mood: 'moods',
      sleep: 'sleep',
      exercise: 'exercise',
      nutrition: 'vitals',
      hydration: 'vitals'
    };
    return mapping[type] || 'vitals';
  }

  async getHealthSummary(startDate: Date, endDate: Date): Promise<any> {
    if (!this.db) await this.initialize();

    const [symptoms, vitals, moods, sleep, exercise, medicationLogs] = await Promise.all([
      this.db!.getAll('symptoms'),
      this.db!.getAll('vitals'),
      this.db!.getAll('moods'),
      this.db!.getAll('sleep'),
      this.db!.getAll('exercise'),
      this.db!.getAll('medicationLogs')
    ]);

    const inRange = (date: Date) => date >= startDate && date <= endDate;

    return {
      symptoms: symptoms.filter(s => inRange(new Date(s.date))),
      vitals: vitals.filter(v => inRange(new Date(v.date))),
      moods: moods.filter(m => inRange(new Date(m.date))),
      sleep: sleep.filter(s => inRange(new Date(s.date))),
      exercise: exercise.filter(e => inRange(new Date(e.date))),
      medicationAdherence: this.calculateMedicationAdherence(medicationLogs, startDate, endDate)
    };
  }

  private calculateMedicationAdherence(logs: any[], startDate: Date, endDate: Date): number {
    const inRange = logs.filter(l => {
      const date = new Date(l.timestamp);
      return date >= startDate && date <= endDate;
    });
    if (inRange.length === 0) return 100;
    const taken = inRange.filter(l => l.taken).length;
    return Math.round((taken / inRange.length) * 100);
  }

  // -------------------------------------------------------------------------
  // FINANCE ECOSYSTEM
  // -------------------------------------------------------------------------

  async addTransaction(transaction: any): Promise<void> {
    if (!this.db) await this.initialize();
    const record = { ...transaction, id: transaction.id || `txn-${Date.now()}`, createdAt: new Date() };
    await this.db!.put('transactions', record);

    if (record.type === 'income') {
      eventBus.emit('finance:income', record);
    } else if (record.type === 'expense') {
      eventBus.emit('finance:expense', record);
    }
    eventBus.emit('finance:transaction', record);
  }

  async getTransactions(startDate?: Date, endDate?: Date): Promise<any[]> {
    if (!this.db) await this.initialize();
    const all = await this.db!.getAll('transactions');
    if (!startDate || !endDate) return all;
    return all.filter(t => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });
  }

  async getFinanceSummary(month?: Date): Promise<any> {
    if (!this.db) await this.initialize();

    const targetMonth = month || new Date();
    const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

    const transactions = await this.getTransactions(startOfMonth, endOfMonth);
    const passiveIncome = await this.db!.getAll('passiveIncome');
    const savingsGoals = await this.db!.getAll('savingsGoals');
    const debts = await this.db!.getAll('debts');

    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const passiveTotal = passiveIncome
      .filter(p => {
        const date = new Date(p.date);
        return date >= startOfMonth && date <= endOfMonth;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      income,
      expenses,
      passiveIncome: passiveTotal,
      netIncome: income + passiveTotal - expenses,
      savingsGoals,
      debts,
      byCategory: this.groupByCategory(transactions)
    };
  }

  private groupByCategory(transactions: any[]): Record<string, number> {
    return transactions.reduce((acc, t) => {
      const key = `${t.type}:${t.category}`;
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  }

  async addPassiveIncomeSource(source: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('passiveIncome', { ...source, id: source.id || `pi-${Date.now()}` });
  }

  async logPassiveIncome(sourceId: string, amount: number, notes?: string): Promise<void> {
    if (!this.db) await this.initialize();
    const source = await this.db!.get('passiveIncome', sourceId);
    await this.addTransaction({
      type: 'income',
      category: 'Passive Income',
      subcategory: source?.name || 'Unknown',
      amount,
      description: notes || `Passive income from ${source?.name}`,
      linkedTo: { type: 'passiveIncome', id: sourceId }
    });
  }

  // -------------------------------------------------------------------------
  // FOOD ECOSYSTEM
  // -------------------------------------------------------------------------

  async addPantryItem(item: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('pantryItems', { ...item, id: item.id || `pantry-${Date.now()}`, addedAt: new Date() });
  }

  async getPantryItems(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('pantryItems');
  }

  async addGroceryItem(item: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('groceryItems', { ...item, id: item.id || `grocery-${Date.now()}` });
  }

  async getGroceryItems(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('groceryItems');
  }

  async addRecipe(recipe: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('recipes', { ...recipe, id: recipe.id || `recipe-${Date.now()}`, createdAt: new Date() });
  }

  async getRecipes(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('recipes');
  }

  async logMeal(meal: any): Promise<void> {
    if (!this.db) await this.initialize();
    const record = { ...meal, id: meal.id || `meal-${Date.now()}`, date: new Date() };
    await this.db!.put('mealLogs', record);
    eventBus.emit('food:meal:logged', record);
  }

  async logWater(amount: number, unit: 'oz' | 'ml' = 'oz'): Promise<void> {
    if (!this.db) await this.initialize();
    const record = {
      id: `water-${Date.now()}`,
      amount,
      unit,
      date: new Date()
    };
    await this.db!.put('waterLogs', record);
    eventBus.emit('food:water:logged', record);
  }

  async getWaterLogsForDay(date: Date): Promise<any[]> {
    if (!this.db) await this.initialize();
    const all = await this.db!.getAll('waterLogs');
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return all.filter(w => {
      const d = new Date(w.date);
      return d >= dayStart && d <= dayEnd;
    });
  }

  // -------------------------------------------------------------------------
  // LEARNING ECOSYSTEM
  // -------------------------------------------------------------------------

  async getCourse(id: string): Promise<any> {
    if (!this.db) await this.initialize();
    return this.db!.get('courses', id);
  }

  async getAllCourses(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('courses');
  }

  async addCourse(course: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('courses', { ...course, id: course.id || `course-${Date.now()}`, startedAt: new Date() });
  }

  async updateCourseProgress(courseId: string, progress: number, notes?: string): Promise<void> {
    if (!this.db) await this.initialize();
    const course = await this.getCourse(courseId);
    if (course) {
      course.progress = progress;
      course.lastStudied = new Date();
      if (progress >= 100) {
        course.completedAt = new Date();
        eventBus.emit('learning:course:completed', { courseId, course });
      }
      await this.db!.put('courses', course);
      eventBus.emit('learning:progress', { courseId, progress });
    }
  }

  async getSkills(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('skills');
  }

  async updateSkillProgress(skillName: string, points: number): Promise<void> {
    if (!this.db) await this.initialize();
    const skills = await this.getSkills();
    let skill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());

    if (skill) {
      skill.points = (skill.points || 0) + points;
      skill.level = Math.floor(skill.points / 100) + 1;
      skill.updatedAt = new Date();
    } else {
      skill = {
        id: `skill-${Date.now()}`,
        name: skillName,
        points,
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    await this.db!.put('skills', skill);
    eventBus.emit('learning:skill:unlocked', skill);
  }

  async logStudySession(session: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('studySessions', { ...session, id: session.id || `study-${Date.now()}`, date: new Date() });

    if (session.courseId) {
      await this.updateCourseProgress(session.courseId, session.progressDelta || 0);
    }
  }

  // -------------------------------------------------------------------------
  // ENTERTAINMENT ECOSYSTEM
  // -------------------------------------------------------------------------

  async logWatch(item: any): Promise<void> {
    if (!this.db) await this.initialize();
    const record = { ...item, id: item.id || `watch-${Date.now()}`, date: new Date() };
    await this.db!.put('watchHistory', record);
    eventBus.emit('entertainment:watched', record);
  }

  async logListen(item: any): Promise<void> {
    if (!this.db) await this.initialize();
    const record = { ...item, id: item.id || `listen-${Date.now()}`, date: new Date() };
    await this.db!.put('listenHistory', record);
    eventBus.emit('entertainment:listened', record);
  }

  async logGamePlay(item: any): Promise<void> {
    if (!this.db) await this.initialize();
    const record = { ...item, id: item.id || `game-${Date.now()}`, date: new Date() };
    await this.db!.put('gameHistory', record);
    eventBus.emit('entertainment:played', record);
  }

  async getEntertainmentHistory(type?: 'watch' | 'listen' | 'game', limit?: number): Promise<any[]> {
    if (!this.db) await this.initialize();

    let results: any[] = [];
    if (!type || type === 'watch') {
      results = results.concat(await this.db!.getAll('watchHistory'));
    }
    if (!type || type === 'listen') {
      results = results.concat(await this.db!.getAll('listenHistory'));
    }
    if (!type || type === 'game') {
      results = results.concat(await this.db!.getAll('gameHistory'));
    }

    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return limit ? results.slice(0, limit) : results;
  }

  // -------------------------------------------------------------------------
  // CREATIVE ECOSYSTEM
  // -------------------------------------------------------------------------

  async addProject(project: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('projects', { ...project, id: project.id || `project-${Date.now()}`, createdAt: new Date() });
    eventBus.emit('creative:project:updated', project);
  }

  async getProjects(type?: string): Promise<any[]> {
    if (!this.db) await this.initialize();
    const all = await this.db!.getAll('projects');
    return type ? all.filter(p => p.type === type) : all;
  }

  async addIdea(idea: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('ideas', { ...idea, id: idea.id || `idea-${Date.now()}`, createdAt: new Date() });
    eventBus.emit('creative:idea:generated', idea);
  }

  async getIdeas(category?: string, status?: string): Promise<any[]> {
    if (!this.db) await this.initialize();
    let all = await this.db!.getAll('ideas');
    if (category) all = all.filter(i => i.category === category);
    if (status) all = all.filter(i => i.status === status);
    return all;
  }

  async logMonetization(record: any): Promise<void> {
    if (!this.db) await this.initialize();
    const entry = { ...record, id: record.id || `money-${Date.now()}`, date: new Date() };
    await this.db!.put('monetization', entry);
    eventBus.emit('creative:monetization:earned', entry);
  }

  // -------------------------------------------------------------------------
  // TASK/PRODUCTIVITY ECOSYSTEM
  // -------------------------------------------------------------------------

  async addTask(task: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('tasks', { ...task, id: task.id || `task-${Date.now()}`, createdAt: new Date() });
    eventBus.emit('task:created', task);
  }

  async getTasks(filter?: { status?: string; category?: string; dueDate?: Date }): Promise<any[]> {
    if (!this.db) await this.initialize();
    let all = await this.db!.getAll('tasks');
    if (filter?.status) all = all.filter(t => t.status === filter.status);
    if (filter?.category) all = all.filter(t => t.category === filter.category);
    if (filter?.dueDate) {
      const due = filter.dueDate;
      all = all.filter(t => new Date(t.dueDate) <= due);
    }
    return all;
  }

  async completeTask(taskId: string): Promise<void> {
    if (!this.db) await this.initialize();
    const task = await this.db!.get('tasks', taskId);
    if (task) {
      task.status = 'completed';
      task.completedAt = new Date();
      await this.db!.put('tasks', task);
      eventBus.emit('task:completed', task);
    }
  }

  async updateSpoons(delta: number, reason: string): Promise<void> {
    if (!this.db) await this.initialize();
    const today = new Date().toISOString().split('T')[0];
    let todayLog = (await this.db!.getAll('spoonLogs')).find(l => l.date === today);

    if (!todayLog) {
      todayLog = {
        id: `spoons-${today}`,
        date: today,
        startingSpoons: 12,
        currentSpoons: 12,
        activities: []
      };
    }

    todayLog.currentSpoons = Math.max(0, Math.min(20, todayLog.currentSpoons + delta));
    todayLog.activities.push({
      delta,
      reason,
      timestamp: new Date()
    });

    await this.db!.put('spoonLogs', todayLog);
    eventBus.emit('spoons:updated', { current: todayLog.currentSpoons, delta, reason });
  }

  async getCurrentSpoons(): Promise<number> {
    if (!this.db) await this.initialize();
    const today = new Date().toISOString().split('T')[0];
    const todayLog = (await this.db!.getAll('spoonLogs')).find(l => l.date === today);
    return todayLog?.currentSpoons ?? 12;
  }

  // -------------------------------------------------------------------------
  // RELATIONSHIP ECOSYSTEM
  // -------------------------------------------------------------------------

  async addContact(contact: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('contacts', { ...contact, id: contact.id || `contact-${Date.now()}`, createdAt: new Date() });
  }

  async getContacts(type?: string): Promise<any[]> {
    if (!this.db) await this.initialize();
    const all = await this.db!.getAll('contacts');
    return type ? all.filter(c => c.type === type) : all;
  }

  async logInteraction(interaction: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('interactions', { ...interaction, id: interaction.id || `int-${Date.now()}`, date: new Date() });
    eventBus.emit('relationship:interaction', interaction);
  }

  async getCareTeam(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('careTeam');
  }

  // -------------------------------------------------------------------------
  // SMART HOME ECOSYSTEM
  // -------------------------------------------------------------------------

  async getDevices(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('devices');
  }

  async updateDeviceState(deviceId: string, state: any): Promise<void> {
    if (!this.db) await this.initialize();
    const device = await this.db!.get('devices', deviceId);
    if (device) {
      device.state = { ...device.state, ...state };
      device.lastUpdated = new Date();
      await this.db!.put('devices', device);
      eventBus.emit('smarthome:device:changed', { deviceId, state });
    }
  }

  async activateScene(sceneId: string): Promise<void> {
    if (!this.db) await this.initialize();
    const scene = await this.db!.get('scenes', sceneId);
    if (scene) {
      for (const action of scene.actions || []) {
        await this.updateDeviceState(action.deviceId, action.state);
      }
      eventBus.emit('smarthome:scene:activated', scene);
    }
  }

  // -------------------------------------------------------------------------
  // WARDROBE/AVATAR ECOSYSTEM
  // -------------------------------------------------------------------------

  async addWardrobeItem(item: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('wardrobeItems', { ...item, id: item.id || `wardrobe-${Date.now()}`, addedAt: new Date() });
  }

  async getWardrobeItems(category?: string): Promise<any[]> {
    if (!this.db) await this.initialize();
    const all = await this.db!.getAll('wardrobeItems');
    return category ? all.filter(i => i.category === category) : all;
  }

  async saveOutfit(outfit: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('outfits', { ...outfit, id: outfit.id || `outfit-${Date.now()}`, createdAt: new Date() });
  }

  async setAvatarOutfit(outfitId: string): Promise<void> {
    if (!this.db) await this.initialize();
    const outfit = await this.db!.get('outfits', outfitId);
    if (outfit) {
      await this.db!.put('avatarState', { id: 'current', currentOutfit: outfit, updatedAt: new Date() });
      eventBus.emit('avatar:outfit:changed', outfit);
    }
  }

  // -------------------------------------------------------------------------
  // DND ECOSYSTEM
  // -------------------------------------------------------------------------

  async getCharacters(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('characters');
  }

  async addCharacter(character: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('characters', { ...character, id: character.id || `char-${Date.now()}`, createdAt: new Date() });
  }

  async getCampaigns(): Promise<any[]> {
    if (!this.db) await this.initialize();
    return this.db!.getAll('campaigns');
  }

  async logDnDSession(session: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('sessions', { ...session, id: session.id || `session-${Date.now()}`, date: new Date() });
    eventBus.emit('dnd:session:started', session);
  }

  // -------------------------------------------------------------------------
  // AI INSIGHTS
  // -------------------------------------------------------------------------

  async addAIInsight(insight: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('aiInsights', { ...insight, id: insight.id || `insight-${Date.now()}`, createdAt: new Date() });
    eventBus.emit('ai:insight:generated', insight);
  }

  async getAIInsights(category?: string, limit?: number): Promise<any[]> {
    if (!this.db) await this.initialize();
    let all = await this.db!.getAll('aiInsights');
    if (category) all = all.filter(i => i.category === category);
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return limit ? all.slice(0, limit) : all;
  }

  // -------------------------------------------------------------------------
  // CROSS-DOMAIN ANALYSIS
  // -------------------------------------------------------------------------

  async generateDailyDigest(): Promise<any> {
    if (!this.db) await this.initialize();

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      spoons,
      tasks,
      healthSummary,
      financeSummary,
      waterLogs,
      mealLogs,
      entertainmentHistory
    ] = await Promise.all([
      this.getCurrentSpoons(),
      this.getTasks({ dueDate: endOfDay }),
      this.getHealthSummary(startOfDay, endOfDay),
      this.getFinanceSummary(),
      this.getWaterLogsForDay(new Date()),
      this.db!.getAll('mealLogs'),
      this.getEntertainmentHistory(undefined, 5)
    ]);

    const totalWater = waterLogs.reduce((sum, w) => sum + w.amount, 0);
    const todayMeals = mealLogs.filter(m => {
      const d = new Date(m.date);
      return d >= startOfDay && d <= endOfDay;
    });

    return {
      date: new Date(),
      spoons: {
        current: spoons,
        recommendation: spoons < 4 ? 'Consider resting - energy is low' : 'Good energy levels'
      },
      tasks: {
        pending: tasks.filter(t => t.status !== 'completed').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        urgent: tasks.filter(t => t.priority === 'high' && t.status !== 'completed')
      },
      health: {
        medicationAdherence: healthSummary.medicationAdherence,
        symptomsLogged: healthSummary.symptoms.length,
        topSymptom: healthSummary.symptoms[0]?.type || 'None'
      },
      finance: {
        todaySpent: financeSummary.expenses,
        monthlyBudgetRemaining: (financeSummary.income || 0) - financeSummary.expenses,
        passiveIncomeThisMonth: financeSummary.passiveIncome
      },
      nutrition: {
        waterIntake: totalWater,
        waterGoal: 64,
        waterProgress: Math.round((totalWater / 64) * 100),
        mealsLogged: todayMeals.length
      },
      recentEntertainment: entertainmentHistory.slice(0, 3),
      recommendations: await this.generateRecommendations(spoons, healthSummary, financeSummary)
    };
  }

  private async generateRecommendations(spoons: number, health: any, finance: any): Promise<string[]> {
    const recommendations: string[] = [];

    if (spoons < 4) {
      recommendations.push('Your energy is low. Consider taking a rest break or doing a low-spoon activity.');
    }
    if (health.medicationAdherence < 80) {
      recommendations.push('Your medication adherence could improve. Set up reminders to help you stay on track.');
    }
    if (finance.expenses > finance.income * 0.8) {
      recommendations.push('Spending is high this month. Review your budget for potential savings.');
    }
    if (recommendations.length === 0) {
      recommendations.push('You\'re doing great! Keep up the good work on all fronts.');
    }

    return recommendations;
  }

  // -------------------------------------------------------------------------
  // CROSS-REFERENCES
  // -------------------------------------------------------------------------

  async addCrossReference(ref: Omit<CrossReference, 'id' | 'createdAt'>): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('crossReferences', {
      ...ref,
      id: `ref-${Date.now()}`,
      createdAt: new Date()
    });
  }

  async getCrossReferences(sourceType: string, sourceId: string): Promise<CrossReference[]> {
    if (!this.db) await this.initialize();
    const all = await this.db!.getAll('crossReferences');
    return all.filter(r =>
      (r.sourceType === sourceType && r.sourceId === sourceId) ||
      (r.targetType === sourceType && r.targetId === sourceId)
    );
  }

  // -------------------------------------------------------------------------
  // SETTINGS & SYNC
  // -------------------------------------------------------------------------

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.initialize();
    const setting = await this.db!.get('settings', key);
    return setting?.value;
  }

  async setSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('settings', { id: key, value, updatedAt: new Date() });
  }

  async getIntegration(platform: string): Promise<any> {
    if (!this.db) await this.initialize();
    return this.db!.get('integrations', platform);
  }

  async setIntegration(platform: string, config: any): Promise<void> {
    if (!this.db) await this.initialize();
    await this.db!.put('integrations', { id: platform, ...config, updatedAt: new Date() });
    eventBus.emit('integration:synced', { platform, config });
  }

  async exportAllData(): Promise<any> {
    if (!this.db) await this.initialize();

    const storeNames = [
      'medications', 'medicationLogs', 'symptoms', 'vitals', 'moods', 'sleep', 'exercise',
      'transactions', 'budgets', 'savingsGoals', 'investments', 'passiveIncome', 'debts',
      'pantryItems', 'groceryItems', 'recipes', 'mealLogs', 'mealPlans', 'waterLogs',
      'courses', 'skills', 'certifications', 'studySessions',
      'watchHistory', 'listenHistory', 'gameHistory', 'mediaLibrary', 'playlists',
      'projects', 'ideas', 'portfolio', 'monetization',
      'contacts', 'interactions', 'events', 'careTeam',
      'tasks', 'habits', 'goals', 'spoonLogs', 'routines',
      'devices', 'scenes', 'automations',
      'wardrobeItems', 'outfits', 'avatarState',
      'characters', 'campaigns', 'sessions',
      'settings', 'integrations', 'aiInsights', 'crossReferences'
    ];

    const data: Record<string, any[]> = {};
    for (const storeName of storeNames) {
      try {
        data[storeName] = await this.db!.getAll(storeName as any);
      } catch (e) {
        data[storeName] = [];
      }
    }

    return {
      exportedAt: new Date().toISOString(),
      version: '5.5.0',
      data
    };
  }

  async importData(backup: any): Promise<void> {
    if (!this.db) await this.initialize();

    for (const [storeName, records] of Object.entries(backup.data)) {
      if (Array.isArray(records)) {
        for (const record of records) {
          try {
            await this.db!.put(storeName as any, record);
          } catch (e) {
            console.warn(`Failed to import record to ${storeName}:`, e);
          }
        }
      }
    }

    eventBus.emit('sync:completed', { importedAt: new Date() });
  }
}

// Export singleton instance
export const unifiedDataHub = new UnifiedDataHub();

// Initialize on import
unifiedDataHub.initialize().catch(console.error);

export default unifiedDataHub;
