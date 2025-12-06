// Comprehensive Database Schema for KOL Personal OS
import Dexie, { Table } from 'dexie';

// Define all interfaces for the database
export interface Medication {
  id?: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  times?: string[];
  withFood?: boolean;
  prescribedBy?: string;
  pharmacy?: string;
  refillDate?: Date;
  quantity?: number;
  sideEffects?: string[];
  interactions?: string[];
  purpose?: string;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  notes?: string;
}

export interface MedicationReminder {
  id?: string;
  medicationId: string;
  time: string;
  taken: boolean;
  takenAt?: Date;
  skipped: boolean;
  skippedReason?: string;
  date: Date;
  dosage: string;
  notificationSent: boolean;
}

export interface HealthRecord {
  id?: string;
  type: 'symptom' | 'pain' | 'mood' | 'energy' | 'sleep' | 'exercise' | 'meal' | 'vitals';
  date: Date;
  value: any;
  notes?: string;
  tags?: string[];
  severity?: number;
  location?: string;
  triggers?: string[];
  remedies?: string[];
}

export interface AICompanion {
  id?: string;
  mode: 'companion' | 'creative' | 'archivist' | 'rebel';
  sanctumRoom: 'health' | 'art' | 'activism' | 'ancestry' | 'rest' | 'ritual';
  conversation: Message[];
  context: any;
  lastActive: Date;
}

export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface FeatureIdea {
  id?: string;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'idea' | 'planned' | 'in-progress' | 'completed' | 'archived';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: number;
  completed: boolean;
  completedAt?: Date;
  category: string;
  tags?: string[];
  spoons?: number; // Energy cost in spoon theory
  recurring?: boolean;
  recurrencePattern?: string;
  reminders?: Date[];
}

export interface FinancialRecord {
  id?: string;
  type: 'income' | 'expense' | 'savings' | 'investment';
  amount: number;
  category: string;
  description: string;
  date: Date;
  recurring?: boolean;
  tags?: string[];
  attachments?: string[];
}

export interface CreativeProject {
  id?: string;
  type: 'poetry' | 'photography' | 'design' | 'writing' | 'art' | 'music';
  title: string;
  description?: string;
  content?: any;
  status: 'draft' | 'in-progress' | 'review' | 'published';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  collaborators?: string[];
  monetization?: {
    platform: string;
    earnings: number;
    status: string;
  };
}

export interface Relationship {
  id?: string;
  name: string;
  type: 'family' | 'friend' | 'partner' | 'colleague' | 'community' | 'medical';
  notes?: string;
  importantDates?: {
    date: Date;
    event: string;
  }[];
  supportRole?: string;
  communicationPreferences?: string[];
  boundaries?: string[];
  lastContact?: Date;
}

export interface Automation {
  id?: string;
  name: string;
  trigger: string;
  actions: any[];
  enabled: boolean;
  lastRun?: Date;
  runCount: number;
  category: string;
  platform?: 'zapier' | 'ifttt' | 'custom';
}

export interface SpoonTracker {
  id?: string;
  date: Date;
  startingSpoons: number;
  currentSpoons: number;
  activities: {
    activity: string;
    spoonCost: number;
    time: Date;
  }[];
  restPeriods: {
    duration: number;
    spoonsRecovered: number;
    time: Date;
  }[];
  endOfDayNotes?: string;
}

export interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  medicalInfo?: boolean;
  isPrimary: boolean;
  notes?: string;
}

export interface Document {
  id?: string;
  type: 'medical' | 'legal' | 'financial' | 'personal' | 'advocacy';
  title: string;
  content?: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  sharedWith?: string[];
}

export interface Integration {
  id?: string;
  platform: string;
  type: string;
  credentials?: any;
  config?: any;
  lastSync?: Date;
  status: 'connected' | 'disconnected' | 'error';
  data?: any;
}

export interface Evolution {
  id?: string;
  timestamp: Date;
  type: 'learning' | 'adaptation' | 'insight' | 'pattern';
  category: string;
  data: any;
  impact?: number;
  applied: boolean;
}

// Define the database class
export class KolHubDatabase extends Dexie {
  medications!: Table<Medication>;
  medicationReminders!: Table<MedicationReminder>;
  healthRecords!: Table<HealthRecord>;
  aiCompanion!: Table<AICompanion>;
  messages!: Table<Message>;
  featureIdeas!: Table<FeatureIdea>;
  tasks!: Table<Task>;
  financialRecords!: Table<FinancialRecord>;
  creativeProjects!: Table<CreativeProject>;
  relationships!: Table<Relationship>;
  automations!: Table<Automation>;
  spoonTracker!: Table<SpoonTracker>;
  emergencyContacts!: Table<EmergencyContact>;
  documents!: Table<Document>;
  integrations!: Table<Integration>;
  evolution!: Table<Evolution>;

  constructor() {
    super('KolHubDatabase');
    
    this.version(1).stores({
      medications: '++id, name, active, startDate',
      medicationReminders: '++id, medicationId, date, taken, time',
      healthRecords: '++id, type, date, severity',
      aiCompanion: '++id, mode, sanctumRoom, lastActive',
      messages: '++id, timestamp, role',
      featureIdeas: '++id, category, priority, status, createdAt',
      tasks: '++id, dueDate, priority, completed, category',
      financialRecords: '++id, type, date, category, amount',
      creativeProjects: '++id, type, status, createdAt, title',
      relationships: '++id, name, type, lastContact',
      automations: '++id, name, enabled, category, lastRun',
      spoonTracker: '++id, date, currentSpoons',
      emergencyContacts: '++id, name, isPrimary',
      documents: '++id, type, title, createdAt',
      integrations: '++id, platform, status, lastSync',
      evolution: '++id, timestamp, type, category, applied'
    });
  }

  // Initialize with default data
  async initializeDefaults() {
    const count = await this.emergencyContacts.count();
    if (count === 0) {
      // Add default emergency contacts
      await this.emergencyContacts.bulkAdd([
        {
          name: 'Mom',
          relationship: 'Mother',
          phone: '911',
          isPrimary: true,
          notes: 'Call first in emergencies'
        }
      ]);
    }

    // Initialize AI Companion default modes
    const aiCount = await this.aiCompanion.count();
    if (aiCount === 0) {
      const rooms = ['health', 'art', 'activism', 'ancestry', 'rest', 'ritual'];
      const modes = ['companion', 'creative', 'archivist', 'rebel'];
      
      for (const room of rooms) {
        await this.aiCompanion.add({
          mode: 'companion' as const,
          sanctumRoom: room as any,
          conversation: [],
          context: {},
          lastActive: new Date()
        });
      }
    }

    // Initialize spoon tracker for today
    const today = new Date().toDateString();
    const todaySpoons = await this.spoonTracker
      .where('date')
      .equals(new Date(today))
      .first();
    
    if (!todaySpoons) {
      await this.spoonTracker.add({
        date: new Date(today),
        startingSpoons: 12, // Default daily spoons
        currentSpoons: 12,
        activities: [],
        restPeriods: []
      });
    }
  }

  // Sync with remote storage
  async syncWithCloud() {
    console.log('🔄 Syncing with cloud storage...');
    // Implement cloud sync logic here
    // This would connect to your backend API or cloud service
  }

  // Export data for backup
  async exportData() {
    const data = {
      medications: await this.medications.toArray(),
      medicationReminders: await this.medicationReminders.toArray(),
      healthRecords: await this.healthRecords.toArray(),
      tasks: await this.tasks.toArray(),
      financialRecords: await this.financialRecords.toArray(),
      creativeProjects: await this.creativeProjects.toArray(),
      relationships: await this.relationships.toArray(),
      automations: await this.automations.toArray(),
      spoonTracker: await this.spoonTracker.toArray(),
      emergencyContacts: await this.emergencyContacts.toArray(),
      documents: await this.documents.toArray(),
      evolution: await this.evolution.toArray(),
      exportDate: new Date().toISOString()
    };
    
    return data;
  }

  // Import data from backup
  async importData(data: any) {
    console.log('📥 Importing data...');
    
    try {
      await this.transaction('rw', 
        this.medications,
        this.medicationReminders,
        this.healthRecords,
        this.tasks,
        this.financialRecords,
        this.creativeProjects,
        this.relationships,
        this.automations,
        this.spoonTracker,
        this.emergencyContacts,
        this.documents,
        this.evolution,
        async () => {
          // Clear existing data
          await Promise.all([
            this.medications.clear(),
            this.medicationReminders.clear(),
            this.healthRecords.clear(),
            this.tasks.clear(),
            this.financialRecords.clear(),
            this.creativeProjects.clear(),
            this.relationships.clear(),
            this.automations.clear(),
            this.spoonTracker.clear(),
            this.emergencyContacts.clear(),
            this.documents.clear(),
            this.evolution.clear()
          ]);
          
          // Import new data
          if (data.medications) await this.medications.bulkAdd(data.medications);
          if (data.medicationReminders) await this.medicationReminders.bulkAdd(data.medicationReminders);
          if (data.healthRecords) await this.healthRecords.bulkAdd(data.healthRecords);
          if (data.tasks) await this.tasks.bulkAdd(data.tasks);
          if (data.financialRecords) await this.financialRecords.bulkAdd(data.financialRecords);
          if (data.creativeProjects) await this.creativeProjects.bulkAdd(data.creativeProjects);
          if (data.relationships) await this.relationships.bulkAdd(data.relationships);
          if (data.automations) await this.automations.bulkAdd(data.automations);
          if (data.spoonTracker) await this.spoonTracker.bulkAdd(data.spoonTracker);
          if (data.emergencyContacts) await this.emergencyContacts.bulkAdd(data.emergencyContacts);
          if (data.documents) await this.documents.bulkAdd(data.documents);
          if (data.evolution) await this.evolution.bulkAdd(data.evolution);
        });
      
      console.log('✅ Data imported successfully');
    } catch (error) {
      console.error('❌ Error importing data:', error);
      throw error;
    }
  }
}

// Create and export the database instance
export const db = new KolHubDatabase();

// Initialize on first load
db.on('ready', function() {
  return db.initializeDefaults();
});

// Enable offline persistence
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(registration => {
    return registration.sync.register('sync-data');
  });
}
