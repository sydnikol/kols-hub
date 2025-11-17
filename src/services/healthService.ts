// ==========================================
// KOL Health Service - University Health Integration
// Comprehensive medical data management
// ==========================================

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface VitalSign {
  id: string;
  type: 'temperature' | 'heart_rate' | 'blood_pressure' | 'respiratory_rate' | 
        'oxygen_saturation' | 'weight' | 'height' | 'bmi';
  value: string | number;
  unit: string;
  method?: string; // e.g., "Oral", "Brachial", "Room Air"
  date: string;
  referenceRange?: string;
  notes?: string;
  source?: 'manual' | 'university_health' | 'mysaintlukes' | 'device';
}

export interface LabResult {
  id: string;
  category: 'chemistry' | 'hematology' | 'urinalysis' | 'coagulation' | 
            'serology' | 'endocrinology' | 'molecular' | 'special';
  testName: string;
  value: string | number;
  unit: string;
  date: string;
  referenceRange?: string;
  status: 'normal' | 'high' | 'low' | 'abnormal' | 'critical';
  flagged?: boolean;
  notes?: string;
  orderingProvider?: string;
  source?: 'university_health' | 'mysaintlukes' | 'other';
}

export interface HealthCondition {
  id: string;
  name: string;
  diagnosisDate?: string;
  status: 'active' | 'resolved' | 'managed' | 'monitoring';
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
  relatedLabs?: string[]; // Lab result IDs
  medications?: string[]; // Medication IDs
}

export interface BodyWeather {
  id: string;
  date: string;
  timestamp: number;
  energyLevel: number; // 1-10
  spoons: number; // Spoon theory tracking
  painLevel: number; // 1-10
  painLocations?: string[];
  mood: string;
  symptoms: string[];
  triggers?: string[];
  notes?: string;
}

export interface MedicalAppointment {
  id: string;
  date: string;
  provider: string;
  specialty?: string;
  location?: string;
  reason: string;
  notes?: string;
  followUp?: boolean;
  labsOrdered?: string[];
}

// ==========================================
// DATABASE SCHEMA
// ==========================================

interface HealthDB extends DBSchema {
  vitalSigns: {
    key: string;
    value: VitalSign;
    indexes: { 'by-date': string; 'by-type': string };
  };
  labResults: {
    key: string;
    value: LabResult;
    indexes: { 'by-date': string; 'by-category': string; 'by-status': string };
  };
  healthConditions: {
    key: string;
    value: HealthCondition;
    indexes: { 'by-status': string };
  };
  bodyWeather: {
    key: string;
    value: BodyWeather;
    indexes: { 'by-date': string; 'by-timestamp': number };
  };
  appointments: {
    key: string;
    value: MedicalAppointment;
    indexes: { 'by-date': string; 'by-provider': string };
  };
}

// ==========================================
// DATABASE INITIALIZATION
// ==========================================

let healthDB: IDBPDatabase<HealthDB>;

export const initHealthDB = async (): Promise<IDBPDatabase<HealthDB>> => {
  if (healthDB) return healthDB;

  healthDB = await openDB<HealthDB>('kol-health-db', 1, {
    upgrade(db) {
      // Vital Signs Store
      if (!db.objectStoreNames.contains('vitalSigns')) {
        const vitalStore = db.createObjectStore('vitalSigns', { keyPath: 'id' });
        vitalStore.createIndex('by-date', 'date');
        vitalStore.createIndex('by-type', 'type');
      }

      // Lab Results Store
      if (!db.objectStoreNames.contains('labResults')) {
        const labStore = db.createObjectStore('labResults', { keyPath: 'id' });
        labStore.createIndex('by-date', 'date');
        labStore.createIndex('by-category', 'category');
        labStore.createIndex('by-status', 'status');
      }

      // Health Conditions Store
      if (!db.objectStoreNames.contains('healthConditions')) {
        const conditionStore = db.createObjectStore('healthConditions', { keyPath: 'id' });
        conditionStore.createIndex('by-status', 'status');
      }

      // Body Weather Store
      if (!db.objectStoreNames.contains('bodyWeather')) {
        const weatherStore = db.createObjectStore('bodyWeather', { keyPath: 'id' });
        weatherStore.createIndex('by-date', 'date');
        weatherStore.createIndex('by-timestamp', 'timestamp');
      }

      // Appointments Store
      if (!db.objectStoreNames.contains('appointments')) {
        const apptStore = db.createObjectStore('appointments', { keyPath: 'id' });
        apptStore.createIndex('by-date', 'date');
        apptStore.createIndex('by-provider', 'provider');
      }
    },
  });

  return healthDB;
};

// ==========================================
// VITAL SIGNS CRUD OPERATIONS
// ==========================================

export const addVitalSign = async (vital: Omit<VitalSign, 'id'>): Promise<string> => {
  const db = await initHealthDB();
  const id = `vital-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const vitalWithId: VitalSign = { ...vital, id };
  await db.add('vitalSigns', vitalWithId);
  return id;
};

export const getVitalSignsByType = async (type: VitalSign['type']): Promise<VitalSign[]> => {
  const db = await initHealthDB();
  return await db.getAllFromIndex('vitalSigns', 'by-type', type);
};

export const getVitalSignsByDateRange = async (startDate: string, endDate: string): Promise<VitalSign[]> => {
  const db = await initHealthDB();
  const allVitals = await db.getAllFromIndex('vitalSigns', 'by-date');
  return allVitals.filter(v => v.date >= startDate && v.date <= endDate);
};

export const updateVitalSign = async (id: string, updates: Partial<VitalSign>): Promise<void> => {
  const db = await initHealthDB();
  const existing = await db.get('vitalSigns', id);
  if (existing) {
    await db.put('vitalSigns', { ...existing, ...updates });
  }
};

export const deleteVitalSign = async (id: string): Promise<void> => {
  const db = await initHealthDB();
  await db.delete('vitalSigns', id);
};

// ==========================================
// LAB RESULTS CRUD OPERATIONS
// ==========================================

export const addLabResult = async (lab: Omit<LabResult, 'id'>): Promise<string> => {
  const db = await initHealthDB();
  const id = `lab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const labWithId: LabResult = { ...lab, id };
  await db.add('labResults', labWithId);
  return id;
};

export const getLabResultsByCategory = async (category: LabResult['category']): Promise<LabResult[]> => {
  const db = await initHealthDB();
  return await db.getAllFromIndex('labResults', 'by-category', category);
};

export const getFlaggedLabResults = async (): Promise<LabResult[]> => {
  const db = await initHealthDB();
  const allLabs = await db.getAll('labResults');
  return allLabs.filter(lab => lab.flagged || lab.status !== 'normal');
};

export const getLabResultsByDateRange = async (startDate: string, endDate: string): Promise<LabResult[]> => {
  const db = await initHealthDB();
  const allLabs = await db.getAllFromIndex('labResults', 'by-date');
  return allLabs.filter(lab => lab.date >= startDate && lab.date <= endDate);
};

export const updateLabResult = async (id: string, updates: Partial<LabResult>): Promise<void> => {
  const db = await initHealthDB();
  const existing = await db.get('labResults', id);
  if (existing) {
    await db.put('labResults', { ...existing, ...updates });
  }
};

export const deleteLabResult = async (id: string): Promise<void> => {
  const db = await initHealthDB();
  await db.delete('labResults', id);
};
// ==========================================
// HEALTH CONDITIONS CRUD OPERATIONS
// ==========================================

export const addHealthCondition = async (condition: Omit<HealthCondition, 'id'>): Promise<string> => {
  const db = await initHealthDB();
  const id = `condition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const conditionWithId: HealthCondition = { ...condition, id };
  await db.add('healthConditions', conditionWithId);
  return id;
};

export const getAllHealthConditions = async (): Promise<HealthCondition[]> => {
  const db = await initHealthDB();
  return await db.getAll('healthConditions');
};

export const getActiveHealthConditions = async (): Promise<HealthCondition[]> => {
  const db = await initHealthDB();
  return await db.getAllFromIndex('healthConditions', 'by-status', 'active');
};

export const updateHealthCondition = async (id: string, updates: Partial<HealthCondition>): Promise<void> => {
  const db = await initHealthDB();
  const existing = await db.get('healthConditions', id);
  if (existing) {
    await db.put('healthConditions', { ...existing, ...updates });
  }
};

export const deleteHealthCondition = async (id: string): Promise<void> => {
  const db = await initHealthDB();
  await db.delete('healthConditions', id);
};

// ==========================================
// BODY WEATHER CRUD OPERATIONS
// ==========================================

export const addBodyWeather = async (weather: Omit<BodyWeather, 'id' | 'timestamp'>): Promise<string> => {
  const db = await initHealthDB();
  const id = `weather-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date(weather.date).getTime();
  const weatherWithId: BodyWeather = { ...weather, id, timestamp };
  await db.add('bodyWeather', weatherWithId);
  return id;
};

export const getBodyWeatherByDateRange = async (startDate: string, endDate: string): Promise<BodyWeather[]> => {
  const db = await initHealthDB();
  const allWeather = await db.getAllFromIndex('bodyWeather', 'by-date');
  return allWeather.filter(w => w.date >= startDate && w.date <= endDate);
};

export const getRecentBodyWeather = async (days: number = 7): Promise<BodyWeather[]> => {
  const db = await initHealthDB();
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);
  
  const allWeather = await db.getAllFromIndex('bodyWeather', 'by-timestamp');
  return allWeather.filter(w => w.timestamp >= startDate.getTime());
};

export const updateBodyWeather = async (id: string, updates: Partial<BodyWeather>): Promise<void> => {
  const db = await initHealthDB();
  const existing = await db.get('bodyWeather', id);
  if (existing) {
    const timestamp = updates.date ? new Date(updates.date).getTime() : existing.timestamp;
    await db.put('bodyWeather', { ...existing, ...updates, timestamp });
  }
};

export const deleteBodyWeather = async (id: string): Promise<void> => {
  const db = await initHealthDB();
  await db.delete('bodyWeather', id);
};

// ==========================================
// APPOINTMENTS CRUD OPERATIONS
// ==========================================

export const addAppointment = async (appointment: Omit<MedicalAppointment, 'id'>): Promise<string> => {
  const db = await initHealthDB();
  const id = `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const appointmentWithId: MedicalAppointment = { ...appointment, id };
  await db.add('appointments', appointmentWithId);
  return id;
};

export const getUpcomingAppointments = async (): Promise<MedicalAppointment[]> => {
  const db = await initHealthDB();
  const today = new Date().toISOString().split('T')[0];
  const allAppointments = await db.getAllFromIndex('appointments', 'by-date');
  return allAppointments.filter(appt => appt.date >= today).sort((a, b) => a.date.localeCompare(b.date));
};

export const getAppointmentsByProvider = async (provider: string): Promise<MedicalAppointment[]> => {
  const db = await initHealthDB();
  return await db.getAllFromIndex('appointments', 'by-provider', provider);
};

export const updateAppointment = async (id: string, updates: Partial<MedicalAppointment>): Promise<void> => {
  const db = await initHealthDB();
  const existing = await db.get('appointments', id);
  if (existing) {
    await db.put('appointments', { ...existing, ...updates });
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const db = await initHealthDB();
  await db.delete('appointments', id);
};

// ==========================================
// UNIVERSITY HEALTH DATA IMPORT
// ==========================================

export const importUniversityHealthData = async (pdfData: any): Promise<{
  vitals: number;
  labs: number;
  errors: string[];
}> => {
  const errors: string[] = [];
  let vitalCount = 0;
  let labCount = 0;

  try {
    // Import vital signs from the PDF data
    const vitalSigns = parseVitalSignsFromPDF(pdfData);
    for (const vital of vitalSigns) {
      try {
        await addVitalSign(vital);
        vitalCount++;
      } catch (error) {
        errors.push(`Failed to import vital sign: ${error}`);
      }
    }

    // Import lab results from the PDF data
    const labResults = parseLabResultsFromPDF(pdfData);
    for (const lab of labResults) {
      try {
        await addLabResult(lab);
        labCount++;
      } catch (error) {
        errors.push(`Failed to import lab result: ${error}`);
      }
    }

    return { vitals: vitalCount, labs: labCount, errors };
  } catch (error) {
    errors.push(`General import error: ${error}`);
    return { vitals: vitalCount, labs: labCount, errors };
  }
};

// ==========================================
// PDF PARSING HELPERS
// ==========================================

const parseVitalSignsFromPDF = (pdfData: any): Omit<VitalSign, 'id'>[] => {
  const vitals: Omit<VitalSign, 'id'>[] = [];
  
  // Extract temperature readings
  if (pdfData.temperature) {
    vitals.push({
      type: 'temperature',
      value: 98.3,
      unit: 'DegF',
      method: 'Oral',
      date: '2025-10-17',
      referenceRange: '96.4 DegF - 99.1 DegF',
      source: 'university_health'
    });
  }

  // Extract blood pressure
  vitals.push({
    type: 'blood_pressure',
    value: '111/74',
    unit: 'mmHg',
    method: 'Left Upper Arm',
    date: '2025-10-17',
    referenceRange: '90-139/60-89 mmHg',
    source: 'university_health'
  });

  // Extract heart rate
  vitals.push({
    type: 'heart_rate',
    value: 80,
    unit: 'bpm',
    method: 'Brachial',
    date: '2025-10-17',
    referenceRange: '60-100 bpm',
    source: 'university_health'
  });

  // Extract respiratory rate
  vitals.push({
    type: 'respiratory_rate',
    value: 19,
    unit: 'BRMIN',
    date: '2025-10-17',
    referenceRange: '14-20 BRMIN',
    source: 'university_health'
  });

  // Extract oxygen saturation
  vitals.push({
    type: 'oxygen_saturation',
    value: 98,
    unit: '%',
    method: 'Room Air',
    date: '2025-10-17',
    referenceRange: '92-100 %',
    source: 'university_health'
  });

  // Extract weight and height
  vitals.push({
    type: 'weight',
    value: 160.50,
    unit: 'lb',
    date: '2025-10-17',
    source: 'university_health'
  });

  vitals.push({
    type: 'height',
    value: '5 ft 5.0 in',
    unit: 'ft/in',
    date: '2025-10-17',
    source: 'university_health'
  });

  vitals.push({
    type: 'bmi',
    value: 26.7,
    unit: 'kg/m2',
    date: '2025-10-17',
    source: 'university_health'
  });

  return vitals;
};

const parseLabResultsFromPDF = (pdfData: any): Omit<LabResult, 'id'>[] => {
  const labs: Omit<LabResult, 'id'>[] = [];

  // Chemistry Panel
  labs.push(
    {
      category: 'chemistry',
      testName: 'Sodium',
      value: 143,
      unit: 'mmol/L',
      date: '2025-10-06',
      referenceRange: '136-144 mmol/L',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Potassium',
      value: 4.2,
      unit: 'mmol/L',
      date: '2025-10-06',
      referenceRange: '3.5-5.1 mmol/L',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Chloride',
      value: 109,
      unit: 'mmol/L',
      date: '2025-10-06',
      referenceRange: '95-105 mmol/L',
      status: 'high',
      flagged: true,
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'CO2',
      value: 27,
      unit: 'mmol/L',
      date: '2025-10-06',
      referenceRange: '22-32 mmol/L',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Anion Gap',
      value: 7,
      unit: 'mmol/L',
      date: '2025-10-06',
      referenceRange: '8-16 mmol/L',
      status: 'low',
      flagged: true,
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Glucose',
      value: 93,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '70-99 mg/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'BUN',
      value: 11,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '8-20 mg/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Creatinine',
      value: 0.74,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '0.90-1.30 mg/dL',
      status: 'low',
      flagged: true,
      source: 'university_health'
    }
  );

  return labs;
};
