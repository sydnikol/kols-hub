// Health Analytics Service - Trends, Correlations, and Advanced Health Tracking
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database Schema
interface HealthAnalyticsDB extends DBSchema {
  trends: {
    key: string;
    value: TrendEntry;
    indexes: { 'by-date': string; 'by-type': string };
  };
  erVisits: {
    key: string;
    value: ERVisit;
    indexes: { 'by-date': string };
  };
  medEffects: {
    key: string;
    value: MedEffectEntry;
    indexes: { 'by-medication': string; 'by-date': string };
  };
  appointmentNotes: {
    key: string;
    value: AppointmentNote;
    indexes: { 'by-doctor': string; 'by-date': string };
  };
  triggers: {
    key: string;
    value: Trigger;
    indexes: { 'by-category': string };
  };
  goodDays: {
    key: string;
    value: GoodDay;
    indexes: { 'by-date': string };
  };
  vitalAlerts: {
    key: string;
    value: VitalAlert;
    indexes: { 'by-date': string; 'by-type': string };
  };
  doctorProtocols: {
    key: string;
    value: DoctorProtocol;
    indexes: { 'by-doctor': string };
  };
  allergies: {
    key: string;
    value: Allergy;
  };
}

// Types
export interface TrendEntry {
  id: string;
  date: string;
  type: 'sleep' | 'sodium' | 'meds' | 'pain' | 'energy' | 'hydration' | 'bp' | 'hr';
  value: number;
  note?: string;
}

export interface ERVisit {
  id: string;
  date: string;
  hospital: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  followUp: string;
  notes: string;
  duration: string;
  outcome: 'admitted' | 'discharged' | 'transferred' | 'left-ama';
  documents?: string[];
}

export interface MedEffectEntry {
  id: string;
  date: string;
  medication: string;
  dosage: string;
  effectsPositive: string[];
  effectsNegative: string[];
  severity: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface AppointmentNote {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  reason: string;
  questionsAsked: string[];
  answersReceived: string[];
  testsOrdered: string[];
  prescriptions: string[];
  followUpDate?: string;
  notes: string;
  satisfaction: 1 | 2 | 3 | 4 | 5;
}

export interface Trigger {
  id: string;
  name: string;
  category: 'environmental' | 'food' | 'activity' | 'sensory' | 'emotional' | 'medication' | 'other';
  symptoms: string[];
  severity: 1 | 2 | 3 | 4 | 5;
  avoidanceStrategies: string[];
  copingStrategies: string[];
  lastOccurrence?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
}

export interface GoodDay {
  id: string;
  date: string;
  title: string;
  description: string;
  photos?: string[];
  quotes?: string[];
  gratitude: string[];
  energyLevel: 1 | 2 | 3 | 4 | 5;
  painLevel: 1 | 2 | 3 | 4 | 5;
  moodLevel: 1 | 2 | 3 | 4 | 5;
}

export interface VitalAlert {
  id: string;
  date: string;
  type: 'bp-high' | 'bp-low' | 'hr-high' | 'hr-low' | 'o2-low';
  value: string;
  threshold: string;
  severity: 'warning' | 'critical';
  actionTaken?: string;
  resolved: boolean;
}

export interface DoctorProtocol {
  id: string;
  doctorName: string;
  specialty: string;
  prepChecklist: string[];
  standardQuestions: string[];
  labsToRequest: string[];
  tipsForVisit: string[];
  boundaries: string[];
  lastUpdated: string;
}

export interface Allergy {
  id: string;
  name: string;
  type: 'medication' | 'food' | 'environmental' | 'other';
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'anaphylaxis';
  dateDiscovered?: string;
  notes: string;
}

// Correlation data for analytics
export interface CorrelationData {
  metric1: string;
  metric2: string;
  correlation: number; // -1 to 1
  dataPoints: { x: number; y: number; date: string }[];
}

class HealthAnalyticsService {
  private db: IDBPDatabase<HealthAnalyticsDB> | null = null;

  async init() {
    this.db = await openDB<HealthAnalyticsDB>('health-analytics-db', 1, {
      upgrade(db) {
        // Trends store
        const trendsStore = db.createObjectStore('trends', { keyPath: 'id' });
        trendsStore.createIndex('by-date', 'date');
        trendsStore.createIndex('by-type', 'type');

        // ER Visits store
        const erStore = db.createObjectStore('erVisits', { keyPath: 'id' });
        erStore.createIndex('by-date', 'date');

        // Med Effects store
        const medEffectsStore = db.createObjectStore('medEffects', { keyPath: 'id' });
        medEffectsStore.createIndex('by-medication', 'medication');
        medEffectsStore.createIndex('by-date', 'date');

        // Appointment Notes store
        const appointmentsStore = db.createObjectStore('appointmentNotes', { keyPath: 'id' });
        appointmentsStore.createIndex('by-doctor', 'doctor');
        appointmentsStore.createIndex('by-date', 'date');

        // Triggers store
        const triggersStore = db.createObjectStore('triggers', { keyPath: 'id' });
        triggersStore.createIndex('by-category', 'category');

        // Good Days store
        const goodDaysStore = db.createObjectStore('goodDays', { keyPath: 'id' });
        goodDaysStore.createIndex('by-date', 'date');

        // Vital Alerts store
        const alertsStore = db.createObjectStore('vitalAlerts', { keyPath: 'id' });
        alertsStore.createIndex('by-date', 'date');
        alertsStore.createIndex('by-type', 'type');

        // Doctor Protocols store
        const protocolsStore = db.createObjectStore('doctorProtocols', { keyPath: 'id' });
        protocolsStore.createIndex('by-doctor', 'doctorName');

        // Allergies store
        db.createObjectStore('allergies', { keyPath: 'id' });
      },
    });
  }

  // Trends & Correlations
  async addTrendEntry(entry: Omit<TrendEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `trend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('trends', { ...entry, id });
    return id;
  }

  async getTrendsByType(type: TrendEntry['type'], days: number = 30): Promise<TrendEntry[]> {
    await this.init();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const all = await this.db!.getAllFromIndex('trends', 'by-type', type);
    return all.filter(e => new Date(e.date) >= cutoffDate).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async calculateCorrelation(metric1: string, metric2: string, days: number = 30): Promise<CorrelationData> {
    const data1 = await this.getTrendsByType(metric1 as TrendEntry['type'], days);
    const data2 = await this.getTrendsByType(metric2 as TrendEntry['type'], days);

    const dataPoints: { x: number; y: number; date: string }[] = [];
    const dateMap = new Map<string, { x?: number; y?: number }>();

    data1.forEach(d => {
      const existing = dateMap.get(d.date) || {};
      dateMap.set(d.date, { ...existing, x: d.value });
    });

    data2.forEach(d => {
      const existing = dateMap.get(d.date) || {};
      dateMap.set(d.date, { ...existing, y: d.value });
    });

    dateMap.forEach((values, date) => {
      if (values.x !== undefined && values.y !== undefined) {
        dataPoints.push({ x: values.x, y: values.y, date });
      }
    });

    const correlation = this.calculatePearsonCorrelation(
      dataPoints.map(p => p.x),
      dataPoints.map(p => p.y)
    );

    return { metric1, metric2, correlation, dataPoints };
  }

  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;

    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      numerator += diffX * diffY;
      denomX += diffX * diffX;
      denomY += diffY * diffY;
    }

    if (denomX === 0 || denomY === 0) return 0;
    return numerator / Math.sqrt(denomX * denomY);
  }

  // ER Visits
  async addERVisit(visit: Omit<ERVisit, 'id'>): Promise<string> {
    await this.init();
    const id = `er-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('erVisits', { ...visit, id });
    return id;
  }

  async getAllERVisits(): Promise<ERVisit[]> {
    await this.init();
    const visits = await this.db!.getAll('erVisits');
    return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async updateERVisit(id: string, updates: Partial<ERVisit>): Promise<void> {
    await this.init();
    const existing = await this.db!.get('erVisits', id);
    if (existing) {
      await this.db!.put('erVisits', { ...existing, ...updates });
    }
  }

  // Medication Effects
  async addMedEffect(effect: Omit<MedEffectEntry, 'id'>): Promise<string> {
    await this.init();
    const id = `medeffect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('medEffects', { ...effect, id });
    return id;
  }

  async getMedEffectsByMedication(medication: string): Promise<MedEffectEntry[]> {
    await this.init();
    return await this.db!.getAllFromIndex('medEffects', 'by-medication', medication);
  }

  async getAllMedEffects(): Promise<MedEffectEntry[]> {
    await this.init();
    const effects = await this.db!.getAll('medEffects');
    return effects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Appointment Notes
  async addAppointmentNote(note: Omit<AppointmentNote, 'id'>): Promise<string> {
    await this.init();
    const id = `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('appointmentNotes', { ...note, id });
    return id;
  }

  async getAppointmentsByDoctor(doctor: string): Promise<AppointmentNote[]> {
    await this.init();
    return await this.db!.getAllFromIndex('appointmentNotes', 'by-doctor', doctor);
  }

  async getAllAppointments(): Promise<AppointmentNote[]> {
    await this.init();
    const notes = await this.db!.getAll('appointmentNotes');
    return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Triggers
  async addTrigger(trigger: Omit<Trigger, 'id'>): Promise<string> {
    await this.init();
    const id = `trigger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('triggers', { ...trigger, id });
    return id;
  }

  async getAllTriggers(): Promise<Trigger[]> {
    await this.init();
    return await this.db!.getAll('triggers');
  }

  async updateTrigger(id: string, updates: Partial<Trigger>): Promise<void> {
    await this.init();
    const existing = await this.db!.get('triggers', id);
    if (existing) {
      await this.db!.put('triggers', { ...existing, ...updates });
    }
  }

  async deleteTrigger(id: string): Promise<void> {
    await this.init();
    await this.db!.delete('triggers', id);
  }

  // Good Days
  async addGoodDay(day: Omit<GoodDay, 'id'>): Promise<string> {
    await this.init();
    const id = `goodday-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('goodDays', { ...day, id });
    return id;
  }

  async getAllGoodDays(): Promise<GoodDay[]> {
    await this.init();
    const days = await this.db!.getAll('goodDays');
    return days.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Vital Alerts
  async addVitalAlert(alert: Omit<VitalAlert, 'id'>): Promise<string> {
    await this.init();
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('vitalAlerts', { ...alert, id });
    return id;
  }

  async getUnresolvedAlerts(): Promise<VitalAlert[]> {
    await this.init();
    const all = await this.db!.getAll('vitalAlerts');
    return all.filter(a => !a.resolved).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async resolveAlert(id: string, actionTaken: string): Promise<void> {
    await this.init();
    const alert = await this.db!.get('vitalAlerts', id);
    if (alert) {
      await this.db!.put('vitalAlerts', { ...alert, resolved: true, actionTaken });
    }
  }

  // Doctor Protocols
  async addDoctorProtocol(protocol: Omit<DoctorProtocol, 'id'>): Promise<string> {
    await this.init();
    const id = `protocol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('doctorProtocols', { ...protocol, id });
    return id;
  }

  async getAllDoctorProtocols(): Promise<DoctorProtocol[]> {
    await this.init();
    return await this.db!.getAll('doctorProtocols');
  }

  async updateDoctorProtocol(id: string, updates: Partial<DoctorProtocol>): Promise<void> {
    await this.init();
    const existing = await this.db!.get('doctorProtocols', id);
    if (existing) {
      await this.db!.put('doctorProtocols', { ...existing, ...updates });
    }
  }

  // Allergies
  async addAllergy(allergy: Omit<Allergy, 'id'>): Promise<string> {
    await this.init();
    const id = `allergy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db!.add('allergies', { ...allergy, id });
    return id;
  }

  async getAllAllergies(): Promise<Allergy[]> {
    await this.init();
    return await this.db!.getAll('allergies');
  }

  async updateAllergy(id: string, updates: Partial<Allergy>): Promise<void> {
    await this.init();
    const existing = await this.db!.get('allergies', id);
    if (existing) {
      await this.db!.put('allergies', { ...existing, ...updates });
    }
  }

  async deleteAllergy(id: string): Promise<void> {
    await this.init();
    await this.db!.delete('allergies', id);
  }

  // Seed data
  async seedSampleData() {
    // Add sample trends
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      await this.addTrendEntry({
        date: date.toISOString().split('T')[0],
        type: 'sleep',
        value: 5 + Math.random() * 4,
        note: 'Sample sleep data'
      });

      await this.addTrendEntry({
        date: date.toISOString().split('T')[0],
        type: 'pain',
        value: 3 + Math.random() * 5,
        note: 'Sample pain data'
      });
    }

    // Add sample triggers
    await this.addTrigger({
      name: 'Bright fluorescent lights',
      category: 'sensory',
      symptoms: ['Migraine', 'Eye strain', 'Dizziness'],
      severity: 4,
      avoidanceStrategies: ['Wear sunglasses indoors', 'Request LED bulbs', 'Sit away from overhead lights'],
      copingStrategies: ['Take breaks in dark room', 'Use cold compress', 'Medication as needed'],
      frequency: 'weekly'
    });

    await this.addTrigger({
      name: 'Dairy products',
      category: 'food',
      symptoms: ['Stomach pain', 'Bloating', 'Fatigue'],
      severity: 3,
      avoidanceStrategies: ['Check all food labels', 'Ask about ingredients', 'Bring own snacks'],
      copingStrategies: ['Take lactase enzyme', 'Stay hydrated', 'Rest'],
      frequency: 'rarely'
    });

    // Add sample good day
    await this.addGoodDay({
      date: new Date().toISOString().split('T')[0],
      title: 'Great day with low pain!',
      description: 'Managed to go for a short walk and had energy for creative work',
      gratitude: ['Sunshine', 'Supportive partner', 'Good sleep last night'],
      energyLevel: 4,
      painLevel: 2,
      moodLevel: 5
    });

    // Add sample allergies
    await this.addAllergy({
      name: 'Penicillin',
      type: 'medication',
      reaction: 'Severe rash and difficulty breathing',
      severity: 'anaphylaxis',
      notes: 'MUST avoid all penicillin-based antibiotics'
    });

    await this.addAllergy({
      name: 'Latex',
      type: 'environmental',
      reaction: 'Skin rash and itching',
      severity: 'moderate',
      notes: 'Request non-latex gloves for medical procedures'
    });
  }
}

export const healthAnalyticsService = new HealthAnalyticsService();
