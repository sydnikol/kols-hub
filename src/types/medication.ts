// Comprehensive Medication Types
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  dose: string;
  dosageAmount?: number;
  dosageUnit?: string;
  frequency: string;
  route: string;
  instructions?: string;
  prescriber?: string;
  dateStarted?: string;
  dateEnded?: string;
  refillDate?: string;
  pharmacy?: string;
  pharmacyPhone?: string;
  rxNumber?: string;
  
  // Categories
  category?: 'daily' | 'as-needed' | 'weekly' | 'injection' | 'inhaler' | 'device' | 'supplement';
  purpose?: string;
  
  // Status
  active: boolean;
  needsRefill?: boolean;
  
  // Tracking
  lastTaken?: string;
  nextDue?: string;
  adherenceRate?: number;
  
  // Reminders
  reminderEnabled?: boolean;
  reminderTimes?: string[];
  
  // Side Effects & Notes
  sideEffects?: string[];
  notes?: string;
  
  // Import tracking
  source?: 'manual' | 'pdf-import' | 'excel-import' | 'portal-sync';
  importDate?: string;
  
  // Images
  images?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  takenAt: string;
  dose: string;
  notes?: string;
  skipped?: boolean;
  skipReason?: string;
  sideEffects?: string[];
  effectiveness?: number; // 1-5 rating
  createdAt: string;
}

export interface MedicationReminder {
  id: string;
  medicationId: string;
  medicationName: string;
  time: string;
  days: number[]; // 0-6, Sunday = 0
  enabled: boolean;
  snoozeUntil?: string;
  lastNotified?: string;
  createdAt: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  phone: string;
  address?: string;
  hours?: string;
  notes?: string;
  preferred?: boolean;
  createdAt: string;
}

export interface Prescriber {
  id: string;
  name: string;
  title?: string;
  specialty?: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface MedicationStats {
  totalActive: number;
  totalInactive: number;
  adherenceRate: number;
  takenToday: number;
  missedToday: number;
  needingRefill: number;
  upcomingReminders: number;
}
