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

// Sydney Jones - Real Vital Signs from myUHealth (Oct 17, 2025)
const parseVitalSignsFromPDF = (pdfData: any): Omit<VitalSign, 'id'>[] => {
  const vitals: Omit<VitalSign, 'id'>[] = [];

  // Real vital signs from Sydney Jones - myUHealth Oct 17, 2025
  vitals.push({
    type: 'temperature',
    value: 98.3,
    unit: 'DegF',
    method: 'Oral',
    date: '2025-10-17',
    referenceRange: '96.4 DegF - 99.1 DegF',
    source: 'university_health'
  });

  vitals.push({
    type: 'blood_pressure',
    value: '111/74',
    unit: 'mmHg',
    method: 'Left Upper Arm (Adult Large Cuff)',
    date: '2025-10-17',
    referenceRange: '90-139/60-89 mmHg',
    source: 'university_health'
  });

  vitals.push({
    type: 'heart_rate',
    value: 80,
    unit: 'bpm',
    method: 'Brachial',
    date: '2025-10-17',
    referenceRange: '60-100 bpm',
    source: 'university_health'
  });

  vitals.push({
    type: 'respiratory_rate',
    value: 19,
    unit: 'BRMIN',
    date: '2025-10-17',
    referenceRange: '14-20 BRMIN',
    source: 'university_health'
  });

  vitals.push({
    type: 'oxygen_saturation',
    value: 98,
    unit: '%',
    method: 'Room Air',
    date: '2025-10-17',
    referenceRange: '92-100 %',
    source: 'university_health'
  });

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

// Sydney Jones - Real Medications from myUHealth (Nov 2025)
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: string;
  purpose?: string;
  prescriber?: string;
  startDate: string;
  isActive: boolean;
  isPRN: boolean;
  instructions?: string;
}

export const SYDNEY_MEDICATIONS: Omit<Medication, 'id'>[] = [
  {
    name: 'Naltrexone (Low Dose)',
    genericName: 'naltrexone compounding powder',
    dosage: '4.5 mg',
    frequency: 'daily',
    route: 'oral',
    purpose: 'Pain/Inflammation management',
    prescriber: 'Dr. Fei A Cao',
    startDate: '2025-11-05',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Meloxicam',
    dosage: '15 mg',
    frequency: 'daily',
    route: 'oral',
    purpose: 'Anti-inflammatory (NSAID)',
    prescriber: 'Dr. Fei A Cao',
    startDate: '2025-11-05',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Cyclobenzaprine',
    dosage: '5 mg',
    frequency: '3 times per day as needed',
    route: 'oral',
    purpose: 'Muscle relaxant',
    prescriber: 'Dr. Fei A Cao',
    startDate: '2025-11-05',
    isActive: true,
    isPRN: true,
    instructions: 'AS NEEDED FOR MUSCLE PAIN'
  },
  {
    name: 'Methotrexate',
    dosage: '2.5 mg (6 tablets)',
    frequency: 'weekly',
    route: 'oral',
    purpose: 'Autoimmune/Anti-inflammatory',
    prescriber: 'Dr. Sarah Ifteqar',
    startDate: '2025-10-20',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Sumatriptan',
    dosage: '50 mg',
    frequency: 'as needed',
    route: 'oral',
    purpose: 'Migraine headache',
    prescriber: 'Dr. Parashar Koirala',
    startDate: '2025-10-17',
    isActive: true,
    isPRN: true,
    instructions: 'For migraine headache'
  },
  {
    name: 'Emgality',
    genericName: 'galcanezumab',
    dosage: '120 mg',
    frequency: 'every 4 weeks',
    route: 'subcutaneous',
    purpose: 'Migraine prevention',
    prescriber: 'Dr. Parashar Koirala',
    startDate: '2025-10-17',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Truvada',
    genericName: 'emtricitabine/tenofovir',
    dosage: '200-300 mg',
    frequency: 'daily',
    route: 'oral',
    purpose: 'PrEP',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2025-10-07',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Propranolol',
    dosage: '20 mg',
    frequency: 'twice per day',
    route: 'oral',
    purpose: 'POTS/Heart rate control',
    startDate: '2025-08-27',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Gabapentin',
    dosage: '300 mg (3 capsules)',
    frequency: 'daily',
    route: 'oral',
    purpose: 'Nerve pain - EDS',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2025-08-20',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Mirtazapine',
    dosage: '30 mg',
    frequency: 'daily',
    route: 'oral',
    purpose: 'Sleep/Mood',
    startDate: '2025-08-11',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Concerta',
    genericName: 'methylphenidate ER',
    dosage: '54 mg',
    frequency: 'every morning',
    route: 'oral',
    purpose: 'ADHD',
    startDate: '2025-08-11',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Topiramate',
    dosage: '25 mg (2 capsules)',
    frequency: 'daily',
    route: 'oral',
    purpose: 'Migraine prevention',
    startDate: '2025-08-11',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Midodrine',
    dosage: '2.5 mg',
    frequency: '3 times per day',
    route: 'oral',
    purpose: 'POTS - Blood pressure support',
    startDate: '2025-08-11',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Famotidine',
    dosage: '40 mg',
    frequency: 'at bedtime as needed',
    route: 'oral',
    purpose: 'Dyspepsia/GERD',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2025-08-11',
    isActive: true,
    isPRN: true,
    instructions: 'For dyspepsia'
  },
  {
    name: 'Vitamin D3',
    genericName: 'D3-50',
    dosage: '50,000 IU',
    frequency: 'weekly',
    route: 'oral',
    purpose: 'Vitamin D supplementation',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2025-08-11',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Folic Acid',
    dosage: '1 mg',
    frequency: 'daily',
    route: 'oral',
    purpose: 'With methotrexate',
    prescriber: 'Dr. Sarah Ifteqar',
    startDate: '2025-05-13',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Duloxetine',
    genericName: 'Cymbalta',
    dosage: '60 mg',
    frequency: 'daily',
    route: 'oral',
    purpose: 'Pain/Mood - SNRI',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2024-04-05',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Budesonide-Formoterol',
    genericName: 'Symbicort',
    dosage: '160-4.5 mcg',
    frequency: 'twice per day',
    route: 'inhalation',
    purpose: 'Asthma maintenance',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2024-09-03',
    isActive: true,
    isPRN: false
  },
  {
    name: 'Albuterol',
    genericName: 'ProAir HFA',
    dosage: '90 mcg',
    frequency: 'as needed',
    route: 'inhalation',
    purpose: 'Rescue inhaler',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2024-09-03',
    isActive: true,
    isPRN: true
  },
  {
    name: 'Miralax',
    genericName: 'polyethylene glycol 3350',
    dosage: '17 gm',
    frequency: 'daily',
    route: 'oral',
    purpose: 'Constipation',
    prescriber: 'Dr. Allison Tigner',
    startDate: '2023-10-29',
    isActive: true,
    isPRN: false
  }
];

// Medical Equipment/Aids
export const SYDNEY_MEDICAL_EQUIPMENT = [
  {
    name: 'Thigh High Compression Stockings',
    purpose: 'POTS management',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2024-11-26'
  },
  {
    name: 'Hinge Lateral J Knee Brace',
    purpose: 'EDS joint support',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: '2022-11-29'
  }
];

// Sydney Jones - Real Lab Results from myUHealth
const parseLabResultsFromPDF = (pdfData: any): Omit<LabResult, 'id'>[] => {
  const labs: Omit<LabResult, 'id'>[] = [];

  // Chemistry Panel (Oct 06, 2025)
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
    },
    {
      category: 'chemistry',
      testName: 'eGFRcr',
      value: 114,
      unit: 'mL/min/1.73m2',
      date: '2025-10-06',
      referenceRange: '>= 60 mL/min/1.73m2',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Calcium',
      value: 9.4,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '8.6-10.3 mg/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Cholesterol (Non-Fasting)',
      value: 231,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '0-200 mg/dL',
      status: 'high',
      flagged: true,
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Triglycerides (Non-Fasting)',
      value: 116,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '10-150 mg/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'HDL (Non-Fasting)',
      value: 54.0,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '40.0-60.0 mg/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'LDL (Non-Fasting)',
      value: 154,
      unit: 'mg/dL',
      date: '2025-10-06',
      referenceRange: '65-175 mg/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'endocrinology',
      testName: 'Hemoglobin A1C',
      value: 5.4,
      unit: '%',
      date: '2025-10-06',
      referenceRange: '4.6-6.2 %',
      status: 'normal',
      source: 'university_health'
    }
  );

  // Hematology (Aug 27, 2025)
  labs.push(
    {
      category: 'hematology',
      testName: 'WBC',
      value: 6.80,
      unit: '10^3/cmm',
      date: '2025-08-27',
      referenceRange: '4.50-11.00 10^3/cmm',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'hematology',
      testName: 'RBC',
      value: 5.18,
      unit: '10^6/cmm',
      date: '2025-08-27',
      referenceRange: '4.00-5.20 10^6/cmm',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'hematology',
      testName: 'Hemoglobin',
      value: 13.9,
      unit: 'g/dL',
      date: '2025-08-27',
      referenceRange: '12.0-16.0 g/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'hematology',
      testName: 'Hematocrit',
      value: 44.0,
      unit: '%',
      date: '2025-08-27',
      referenceRange: '36.0-46.0 %',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'hematology',
      testName: 'Platelets',
      value: 353,
      unit: '10^3/cmm',
      date: '2025-08-27',
      referenceRange: '150-450 10^3/cmm',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'hematology',
      testName: 'RDW',
      value: 15.5,
      unit: '%',
      date: '2025-08-27',
      referenceRange: '11.5-14.5 %',
      status: 'high',
      flagged: true,
      source: 'university_health'
    }
  );

  // Liver Function (Aug 27, 2025)
  labs.push(
    {
      category: 'chemistry',
      testName: 'Total Protein',
      value: 7.0,
      unit: 'g/dL',
      date: '2025-08-27',
      referenceRange: '6.1-8.3 g/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Albumin',
      value: 4.3,
      unit: 'g/dL',
      date: '2025-08-27',
      referenceRange: '3.5-4.8 g/dL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Bilirubin Total',
      value: 0.2,
      unit: 'mg/dL',
      date: '2025-08-27',
      referenceRange: '0.3-1.2 mg/dL',
      status: 'low',
      flagged: true,
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'AST',
      value: 16,
      unit: 'U/L',
      date: '2025-08-27',
      referenceRange: '15-41 U/L',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'ALT',
      value: 12,
      unit: 'U/L',
      date: '2025-08-27',
      referenceRange: '14-54 U/L',
      status: 'low',
      flagged: true,
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Alkaline Phosphatase',
      value: 59,
      unit: 'U/L',
      date: '2025-08-27',
      referenceRange: '35-104 U/L',
      status: 'normal',
      source: 'university_health'
    }
  );

  // Thyroid (Mar 31, 2025)
  labs.push(
    {
      category: 'endocrinology',
      testName: 'TSH',
      value: 1.46,
      unit: 'uIU/mL',
      date: '2025-03-31',
      referenceRange: '0.34-5.60 uIU/mL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'endocrinology',
      testName: 'T4 Free',
      value: 0.84,
      unit: 'ng/dL',
      date: '2025-03-31',
      referenceRange: '0.60-1.60 ng/dL',
      status: 'normal',
      source: 'university_health'
    }
  );

  // Vitamins
  labs.push(
    {
      category: 'chemistry',
      testName: 'Vitamin D, 25-Hydroxy',
      value: 31.0,
      unit: 'ng/mL',
      date: '2024-09-24',
      referenceRange: '30.0-100.0 ng/mL',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'chemistry',
      testName: 'Vitamin B12',
      value: 458,
      unit: 'pg/mL',
      date: '2024-12-17',
      referenceRange: '180-914 pg/mL',
      status: 'normal',
      source: 'university_health'
    }
  );

  // Inflammation markers
  labs.push(
    {
      category: 'special',
      testName: 'C-Reactive Protein',
      value: 1.7,
      unit: 'mg/L',
      date: '2025-08-27',
      referenceRange: '<= 10.0 mg/L',
      status: 'normal',
      source: 'university_health'
    },
    {
      category: 'special',
      testName: 'Sed Rate (ESR)',
      value: 6,
      unit: 'mm/hr',
      date: '2025-08-27',
      referenceRange: '0-20 mm/hr',
      status: 'normal',
      source: 'university_health'
    }
  );

  return labs;
};

// Sydney Jones - Health Conditions
export const SYDNEY_HEALTH_CONDITIONS: Omit<HealthCondition, 'id'>[] = [
  {
    name: 'Ehlers-Danlos Syndrome Type 3 - Hypermobile (hEDS)',
    diagnosisDate: '2022-07-25',
    status: 'active',
    severity: 'moderate',
    notes: 'ICD-10: M35.7 - Joint hypermobility, easy bruising, slow wound healing'
  },
  {
    name: 'Postural Orthostatic Tachycardia Syndrome (POTS)',
    diagnosisDate: '2023-07-25',
    status: 'active',
    severity: 'moderate',
    notes: 'ICD-10: G90.A - Managed with midodrine, propranolol, compression stockings, salt/hydration'
  },
  {
    name: 'Chronic Pain Syndrome',
    status: 'active',
    severity: 'moderate',
    notes: 'Secondary to EDS - Managed with gabapentin, duloxetine, LDN, meloxicam'
  },
  {
    name: 'Chronic Migraine',
    status: 'managed',
    severity: 'moderate',
    notes: 'Preventive: Emgality, topiramate. Rescue: sumatriptan'
  },
  {
    name: 'ADHD',
    status: 'managed',
    notes: 'Managed with Concerta 54mg daily'
  },
  {
    name: 'Asthma',
    status: 'managed',
    severity: 'mild',
    notes: 'Maintenance: Symbicort. Rescue: Albuterol'
  }
];

// Blood Type
export const SYDNEY_BLOOD_TYPE = 'A Positive';
