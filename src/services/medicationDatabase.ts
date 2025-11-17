import Dexie, { Table } from 'dexie';
import { 
  Medication, 
  MedicationLog, 
  MedicationReminder, 
  Pharmacy, 
  Prescriber 
} from '../types/medication';

class MedicationDatabase extends Dexie {
  medications!: Table<Medication, string>;
  medicationLogs!: Table<MedicationLog, string>;
  medicationReminders!: Table<MedicationReminder, string>;
  pharmacies!: Table<Pharmacy, string>;
  prescribers!: Table<Prescriber, string>;

  constructor() {
    super('KOL_MedicationDB');
    
    this.version(1).stores({
      medications: 'id, name, active, category, prescriber, dateStarted, createdAt',
      medicationLogs: 'id, medicationId, takenAt, createdAt',
      medicationReminders: 'id, medicationId, enabled, time',
      pharmacies: 'id, name, preferred, createdAt',
      prescribers: 'id, name, specialty, createdAt'
    });
  }
}

export const medDB = new MedicationDatabase();

// Medication CRUD Operations
export const medicationService = {
  // Create
  async addMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await medDB.medications.add({
      ...medication,
      id,
      createdAt: now,
      updatedAt: now
    });
    
    return id;
  },

  // Read
  async getMedication(id: string): Promise<Medication | undefined> {
    return await medDB.medications.get(id);
  },

  async getAllMedications(): Promise<Medication[]> {
    return await medDB.medications.toArray();
  },

  async getActiveMedications(): Promise<Medication[]> {
    return await medDB.medications.where('active').equals(1).toArray();
  },

  async getMedicationsByCategory(category: string): Promise<Medication[]> {
    return await medDB.medications.where('category').equals(category).toArray();
  },

  // Update
  async updateMedication(id: string, updates: Partial<Medication>): Promise<void> {
    await medDB.medications.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  // Delete
  async deleteMedication(id: string): Promise<void> {
    await medDB.medications.delete(id);
    // Also delete related logs and reminders
    await medDB.medicationLogs.where('medicationId').equals(id).delete();
    await medDB.medicationReminders.where('medicationId').equals(id).delete();
  },

  // Bulk operations
  async addMedications(medications: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    const now = new Date().toISOString();
    const medsWithIds = medications.map(med => ({
      ...med,
      id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    }));
    
    await medDB.medications.bulkAdd(medsWithIds);
    return medsWithIds.map(m => m.id);
  }
};

// Medication Log Operations
export const logService = {
  async logMedication(log: Omit<MedicationLog, 'id' | 'createdAt'>): Promise<string> {
    const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await medDB.medicationLogs.add({
      ...log,
      id,
      createdAt: new Date().toISOString()
    });
    
    // Update medication lastTaken
    await medicationService.updateMedication(log.medicationId, {
      lastTaken: log.takenAt
    });
    
    return id;
  },

  async getLogsForMedication(medicationId: string, limit?: number): Promise<MedicationLog[]> {
    let query = medDB.medicationLogs
      .where('medicationId')
      .equals(medicationId)
      .reverse();
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query.toArray();
  },

  async getLogsForDateRange(startDate: string, endDate: string): Promise<MedicationLog[]> {
    return await medDB.medicationLogs
      .where('takenAt')
      .between(startDate, endDate, true, true)
      .toArray();
  },

  async getTodayLogs(): Promise<MedicationLog[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await logService.getLogsForDateRange(
      today.toISOString(),
      tomorrow.toISOString()
    );
  }
};

// Reminder Operations
export const reminderService = {
  async addReminder(reminder: Omit<MedicationReminder, 'id' | 'createdAt'>): Promise<string> {
    const id = `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await medDB.medicationReminders.add({
      ...reminder,
      id,
      createdAt: new Date().toISOString()
    });
    
    return id;
  },

  async getRemindersForMedication(medicationId: string): Promise<MedicationReminder[]> {
    return await medDB.medicationReminders
      .where('medicationId')
      .equals(medicationId)
      .toArray();
  },

  async getEnabledReminders(): Promise<MedicationReminder[]> {
    return await medDB.medicationReminders
      .where('enabled')
      .equals(1)
      .toArray();
  },

  async updateReminder(id: string, updates: Partial<MedicationReminder>): Promise<void> {
    await medDB.medicationReminders.update(id, updates);
  },

  async deleteReminder(id: string): Promise<void> {
    await medDB.medicationReminders.delete(id);
  }
};

// Pharmacy Operations
export const pharmacyService = {
  async addPharmacy(pharmacy: Omit<Pharmacy, 'id' | 'createdAt'>): Promise<string> {
    const id = `pharm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await medDB.pharmacies.add({
      ...pharmacy,
      id,
      createdAt: new Date().toISOString()
    });
    
    return id;
  },

  async getAllPharmacies(): Promise<Pharmacy[]> {
    return await medDB.pharmacies.toArray();
  },

  async getPreferredPharmacy(): Promise<Pharmacy | undefined> {
    return await medDB.pharmacies.where('preferred').equals(1).first();
  },

  async updatePharmacy(id: string, updates: Partial<Pharmacy>): Promise<void> {
    await medDB.pharmacies.update(id, updates);
  },

  async deletePharmacy(id: string): Promise<void> {
    await medDB.pharmacies.delete(id);
  }
};

// Prescriber Operations
export const prescriberService = {
  async addPrescriber(prescriber: Omit<Prescriber, 'id' | 'createdAt'>): Promise<string> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await medDB.prescribers.add({
      ...prescriber,
      id,
      createdAt: new Date().toISOString()
    });
    
    return id;
  },

  async getAllPrescribers(): Promise<Prescriber[]> {
    return await medDB.prescribers.toArray();
  },

  async updatePrescriber(id: string, updates: Partial<Prescriber>): Promise<void> {
    await medDB.prescribers.update(id, updates);
  },

  async deletePrescriber(id: string): Promise<void> {
    await medDB.prescribers.delete(id);
  }
};

export default medDB;
