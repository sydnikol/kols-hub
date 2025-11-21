// Care Team Service - Coordination, Tasks, and Support Network
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface CareTeamDB extends DBSchema {
  careRoles: {
    key: string;
    value: CareRole;
  };
  contacts: {
    key: string;
    value: CareContact;
    indexes: { 'by-role': string; 'by-priority': string };
  };
  careTasks: {
    key: string;
    value: CareTask;
    indexes: { 'by-assignee': string; 'by-status': string };
  };
  shiftNotes: {
    key: string;
    value: ShiftNote;
    indexes: { 'by-date': string };
  };
  carpoolPlans: {
    key: string;
    value: CarpoolPlan;
    indexes: { 'by-date': string };
  };
  consentSettings: {
    key: string;
    value: ConsentSetting;
  };
}

export interface CareRole {
  id: string;
  roleName: string;
  responsibilities: string[];
  contactIds: string[];
  primaryContactId?: string;
  backupContactId?: string;
  color: string;
}

export interface CareContact {
  id: string;
  name: string;
  relationship: string;
  roles: string[]; // e.g., 'medical-advocate', 'transportation', 'emergency', 'daily-support'
  phone: string;
  email?: string;
  address?: string;
  availability: string;
  priority: 'primary' | 'secondary' | 'backup';
  notes: string;
  emergencyContact: boolean;
  consentLevel: 'full' | 'medical-only' | 'emergency-only' | 'none';
  tags: string[];
}

export interface CareTask {
  id: string;
  title: string;
  description: string;
  assignedTo?: string; // contactId
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  category: 'medical' | 'household' | 'transportation' | 'errands' | 'emotional-support' | 'other';
  notes: string;
  completedDate?: string;
  completedBy?: string;
}

export interface ShiftNote {
  id: string;
  date: string;
  caregiver: string;
  startTime: string;
  endTime: string;
  tasksCompleted: string[];
  medsGiven: { medication: string; time: string; dose: string }[];
  meals: string[];
  vitals?: { bp?: string; hr?: string; temp?: string; o2?: string };
  concerns: string[];
  mood: 'great' | 'good' | 'fair' | 'struggling' | 'crisis';
  painLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  notes: string;
  nextShiftHandoff: string;
}

export interface CarpoolPlan {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  appointmentType: string;
  driver: string;
  backupDriver?: string;
  pickupTime: string;
  estimatedDuration: string;
  needsWheelchair: boolean;
  needsWalkingAid: boolean;
  returnTransport: boolean;
  notes: string;
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
}

export interface ConsentSetting {
  id: string;
  contactId: string;
  canViewMedical: boolean;
  canViewMental: boolean;
  canViewFinancial: boolean;
  canMakeDecisions: boolean;
  canAccessRecords: boolean;
  restrictions: string[];
  notes: string;
}

class CareTeamService {
  private db: IDBPDatabase<CareTeamDB> | null = null;

  async init() {
    this.db = await openDB<CareTeamDB>('care-team-db', 1, {
      upgrade(db) {
        db.createObjectStore('careRoles', { keyPath: 'id' });

        const contactsStore = db.createObjectStore('contacts', { keyPath: 'id' });
        contactsStore.createIndex('by-role', 'roles', { multiEntry: true });
        contactsStore.createIndex('by-priority', 'priority');

        const tasksStore = db.createObjectStore('careTasks', { keyPath: 'id' });
        tasksStore.createIndex('by-assignee', 'assignedTo');
        tasksStore.createIndex('by-status', 'status');

        const shiftsStore = db.createObjectStore('shiftNotes', { keyPath: 'id' });
        shiftsStore.createIndex('by-date', 'date');

        const carpoolStore = db.createObjectStore('carpoolPlans', { keyPath: 'id' });
        carpoolStore.createIndex('by-date', 'appointmentDate');

        db.createObjectStore('consentSettings', { keyPath: 'id' });
      },
    });
  }

  // Care Roles
  async addCareRole(role: Omit<CareRole, 'id'>): Promise<string> {
    await this.init();
    const id = `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('careRoles', { ...role, id });
    return id;
  }

  async getAllCareRoles(): Promise<CareRole[]> {
    await this.init();
    return await this.db!.getAll('careRoles');
  }

  async updateCareRole(id: string, updates: Partial<CareRole>): Promise<void> {
    await this.init();
    const existing = await this.db!.get('careRoles', id);
    if (existing) {
      await this.db!.put('careRoles', { ...existing, ...updates });
    }
  }

  // Contacts
  async addContact(contact: Omit<CareContact, 'id'>): Promise<string> {
    await this.init();
    const id = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('contacts', { ...contact, id });
    return id;
  }

  async getAllContacts(): Promise<CareContact[]> {
    await this.init();
    return await this.db!.getAll('contacts');
  }

  async getContactsByRole(role: string): Promise<CareContact[]> {
    await this.init();
    return await this.db!.getAllFromIndex('contacts', 'by-role', role);
  }

  async getEmergencyContacts(): Promise<CareContact[]> {
    await this.init();
    const all = await this.getAllContacts();
    return all.filter(c => c.emergencyContact).sort((a, b) => {
      const priority = { primary: 0, secondary: 1, backup: 2 };
      return priority[a.priority] - priority[b.priority];
    });
  }

  async updateContact(id: string, updates: Partial<CareContact>): Promise<void> {
    await this.init();
    const existing = await this.db!.get('contacts', id);
    if (existing) {
      await this.db!.put('contacts', { ...existing, ...updates });
    }
  }

  // Care Tasks
  async addCareTask(task: Omit<CareTask, 'id'>): Promise<string> {
    await this.init();
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('careTasks', { ...task, id });
    return id;
  }

  async getActiveTasks(): Promise<CareTask[]> {
    await this.init();
    const all = await this.db!.getAll('careTasks');
    return all.filter(t => t.status !== 'completed' && t.status !== 'cancelled')
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  async getTasksByAssignee(contactId: string): Promise<CareTask[]> {
    await this.init();
    return await this.db!.getAllFromIndex('careTasks', 'by-assignee', contactId);
  }

  async completeTask(id: string, completedBy: string): Promise<void> {
    await this.init();
    const task = await this.db!.get('careTasks', id);
    if (task) {
      await this.db!.put('careTasks', {
        ...task,
        status: 'completed',
        completedDate: new Date().toISOString(),
        completedBy
      });
    }
  }

  // Shift Notes
  async addShiftNote(note: Omit<ShiftNote, 'id'>): Promise<string> {
    await this.init();
    const id = `shift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('shiftNotes', { ...note, id });
    return id;
  }

  async getRecentShifts(days: number = 7): Promise<ShiftNote[]> {
    await this.init();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const all = await this.db!.getAll('shiftNotes');
    return all.filter(s => new Date(s.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Carpool Plans
  async addCarpoolPlan(plan: Omit<CarpoolPlan, 'id'>): Promise<string> {
    await this.init();
    const id = `carpool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('carpoolPlans', { ...plan, id });
    return id;
  }

  async getUpcomingCarpool(): Promise<CarpoolPlan[]> {
    await this.init();
    const today = new Date().toISOString().split('T')[0];
    const all = await this.db!.getAll('carpoolPlans');
    return all.filter(p => p.appointmentDate >= today && p.status !== 'cancelled')
      .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));
  }

  async updateCarpoolStatus(id: string, status: CarpoolPlan['status']): Promise<void> {
    await this.init();
    const plan = await this.db!.get('carpoolPlans', id);
    if (plan) {
      await this.db!.put('carpoolPlans', { ...plan, status });
    }
  }

  // Consent Settings
  async setConsent(setting: Omit<ConsentSetting, 'id'>): Promise<string> {
    await this.init();
    const id = `consent-${setting.contactId}`;
    await this.db!.put('consentSettings', { ...setting, id });
    return id;
  }

  async getConsent(contactId: string): Promise<ConsentSetting | undefined> {
    await this.init();
    return await this.db!.get('consentSettings', `consent-${contactId}`);
  }

  async seedSampleData() {
    // Sample care roles
    await this.addCareRole({
      roleName: 'Medical Advocate',
      responsibilities: [
        'Attend important appointments',
        'Help communicate with doctors',
        'Keep track of medical records',
        'Assist with insurance issues'
      ],
      contactIds: [],
      color: '#EF4444'
    });

    await this.addCareRole({
      roleName: 'Daily Support',
      responsibilities: [
        'Help with household tasks',
        'Meal preparation assistance',
        'Medication reminders',
        'Emotional support'
      ],
      contactIds: [],
      color: '#10B981'
    });

    await this.addCareRole({
      roleName: 'Transportation',
      responsibilities: [
        'Drive to appointments',
        'Grocery shopping trips',
        'Emergency transport',
        'Errands as needed'
      ],
      contactIds: [],
      color: '#3B82F6'
    });

    // Sample contacts
    const contact1Id = await this.addContact({
      name: 'Partner/Spouse',
      relationship: 'Partner',
      roles: ['medical-advocate', 'daily-support', 'emergency'],
      phone: '(555) 123-4567',
      availability: 'Always available',
      priority: 'primary',
      notes: 'Primary support person',
      emergencyContact: true,
      consentLevel: 'full',
      tags: ['live-in', 'primary-caregiver']
    });

    await this.addContact({
      name: 'Best Friend',
      relationship: 'Friend',
      roles: ['emotional-support', 'transportation'],
      phone: '(555) 234-5678',
      availability: 'Weekends and evenings',
      priority: 'secondary',
      notes: 'Great for emotional support',
      emergencyContact: false,
      consentLevel: 'medical-only',
      tags: ['trusted', 'local']
    });

    // Sample tasks
    await this.addCareTask({
      title: 'Pick up prescriptions',
      description: 'Get refills from CVS on Main St',
      assignedTo: contact1Id,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: 'high',
      status: 'pending',
      category: 'medical',
      notes: 'Remember to bring insurance card'
    });

    await this.addCareTask({
      title: 'Meal prep for week',
      description: 'Prepare easy-to-reheat meals',
      priority: 'medium',
      status: 'pending',
      category: 'household',
      notes: 'Focus on low-prep, nutritious options'
    });
  }
}

export const careTeamService = new CareTeamService();
