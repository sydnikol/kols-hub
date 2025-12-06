// Comprehensive Medication Data Processor
import * as XLSX from 'xlsx';
import { db } from '../db/database';
import { format, addHours, startOfDay, differenceInMinutes } from 'date-fns';

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  times: string[];
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
  reminders: MedicationReminder[];
}

export interface MedicationReminder {
  id: string;
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

export class MedicationProcessor {
  private static instance: MedicationProcessor;

  private constructor() {}

  static getInstance(): MedicationProcessor {
    if (!MedicationProcessor.instance) {
      MedicationProcessor.instance = new MedicationProcessor();
    }
    return MedicationProcessor.instance;
  }

  // Process Excel file with medication data
  async processExcelFile(file: File): Promise<Medication[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          const medications = await this.parseMedications(jsonData);
          await this.saveMedications(medications);
          
          resolve(medications);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  }

  // Parse medication data from Excel
  private async parseMedications(data: any[]): Promise<Medication[]> {
    const medications: Medication[] = [];
    
    for (const row of data) {
      const medication: Medication = {
        id: this.generateId(),
        name: row['Medication Name'] || row['Name'] || '',
        genericName: row['Generic Name'] || '',
        dosage: row['Dosage'] || row['Dose'] || '',
        frequency: row['Frequency'] || 'As needed',
        times: this.parseFrequencyToTimes(row['Frequency'] || 'As needed'),
        withFood: row['With Food'] === 'Yes' || row['Take with food'] === true,
        prescribedBy: row['Prescribed By'] || row['Doctor'] || '',
        pharmacy: row['Pharmacy'] || '',
        refillDate: row['Refill Date'] ? new Date(row['Refill Date']) : undefined,
        quantity: row['Quantity'] ? parseInt(row['Quantity']) : undefined,
        sideEffects: this.parseArrayField(row['Side Effects']),
        interactions: this.parseArrayField(row['Interactions']),
        purpose: row['Purpose'] || row['Condition'] || '',
        startDate: row['Start Date'] ? new Date(row['Start Date']) : new Date(),
        endDate: row['End Date'] ? new Date(row['End Date']) : undefined,
        active: row['Active'] !== 'No',
        notes: row['Notes'] || '',
        reminders: []
      };
      
      // Generate reminders for the next 30 days
      medication.reminders = this.generateReminders(medication, 30);
      
      medications.push(medication);
    }
    
    return medications;
  }

  // Parse frequency to specific times
  private parseFrequencyToTimes(frequency: string): string[] {
    const freq = frequency.toLowerCase();
    
    // Common medication schedules
    if (freq.includes('twice') || freq.includes('bid') || freq.includes('2x')) {
      return ['08:00', '20:00'];
    }
    if (freq.includes('three times') || freq.includes('tid') || freq.includes('3x')) {
      return ['08:00', '14:00', '20:00'];
    }
    if (freq.includes('four times') || freq.includes('qid') || freq.includes('4x')) {
      return ['08:00', '12:00', '16:00', '20:00'];
    }
    if (freq.includes('once') || freq.includes('daily') || freq.includes('qd')) {
      return ['09:00'];
    }
    if (freq.includes('bedtime') || freq.includes('hs')) {
      return ['22:00'];
    }
    if (freq.includes('morning')) {
      return ['08:00'];
    }
    if (freq.includes('evening')) {
      return ['18:00'];
    }
    if (freq.includes('every 8') || freq.includes('q8h')) {
      return ['06:00', '14:00', '22:00'];
    }
    if (freq.includes('every 6') || freq.includes('q6h')) {
      return ['06:00', '12:00', '18:00', '00:00'];
    }
    if (freq.includes('every 12') || freq.includes('q12h')) {
      return ['08:00', '20:00'];
    }
    
    // Default to once daily if unclear
    return ['09:00'];
  }

  // Parse array fields from Excel
  private parseArrayField(field: any): string[] {
    if (!field) return [];
    if (typeof field === 'string') {
      return field.split(/[,;]/).map(item => item.trim()).filter(Boolean);
    }
    return [];
  }

  // Generate reminders for the next N days
  private generateReminders(medication: Medication, days: number): MedicationReminder[] {
    const reminders: MedicationReminder[] = [];
    const today = startOfDay(new Date());
    
    for (let day = 0; day < days; day++) {
      const date = addHours(today, day * 24);
      
      for (const time of medication.times) {
        const [hours, minutes] = time.split(':').map(Number);
        const reminderDate = new Date(date);
        reminderDate.setHours(hours, minutes, 0, 0);
        
        reminders.push({
          id: this.generateId(),
          medicationId: medication.id,
          time,
          taken: false,
          skipped: false,
          date: reminderDate,
          dosage: medication.dosage,
          notificationSent: false
        });
      }
    }
    
    return reminders;
  }

  // Save medications to database
  private async saveMedications(medications: Medication[]): Promise<void> {
    try {
      // Clear existing medications
      await db.medications.clear();
      await db.medicationReminders.clear();
      
      // Add new medications
      for (const medication of medications) {
        await db.medications.add({
          ...medication,
          reminders: undefined // Store reminders separately
        });
        
        // Add reminders
        for (const reminder of medication.reminders) {
          await db.medicationReminders.add(reminder);
        }
      }
      
      console.log(`✅ Saved ${medications.length} medications to database`);
    } catch (error) {
      console.error('Error saving medications:', error);
      throw error;
    }
  }

  // Get today's medication schedule
  async getTodaySchedule(): Promise<MedicationReminder[]> {
    const today = startOfDay(new Date());
    const tomorrow = addHours(today, 24);
    
    const reminders = await db.medicationReminders
      .where('date')
      .between(today, tomorrow)
      .toArray();
    
    // Sort by time
    return reminders.sort((a, b) => {
      const timeA = parseInt(a.time.replace(':', ''));
      const timeB = parseInt(b.time.replace(':', ''));
      return timeA - timeB;
    });
  }

  // Mark medication as taken
  async markAsTaken(reminderId: string): Promise<void> {
    await db.medicationReminders.update(reminderId, {
      taken: true,
      takenAt: new Date()
    });
  }

  // Skip medication with reason
  async skipMedication(reminderId: string, reason: string): Promise<void> {
    await db.medicationReminders.update(reminderId, {
      skipped: true,
      skippedReason: reason
    });
  }

  // Get medication adherence statistics
  async getAdherenceStats(days: number = 30): Promise<{
    totalScheduled: number;
    totalTaken: number;
    totalSkipped: number;
    adherenceRate: number;
    byMedication: Map<string, number>;
  }> {
    const startDate = addHours(startOfDay(new Date()), -days * 24);
    const reminders = await db.medicationReminders
      .where('date')
      .above(startDate)
      .toArray();
    
    const totalScheduled = reminders.length;
    const totalTaken = reminders.filter(r => r.taken).length;
    const totalSkipped = reminders.filter(r => r.skipped).length;
    const adherenceRate = totalScheduled > 0 ? (totalTaken / totalScheduled) * 100 : 0;
    
    // Calculate adherence by medication
    const byMedication = new Map<string, number>();
    const medicationGroups = new Map<string, { taken: number; total: number }>();
    
    for (const reminder of reminders) {
      const current = medicationGroups.get(reminder.medicationId) || { taken: 0, total: 0 };
      current.total++;
      if (reminder.taken) current.taken++;
      medicationGroups.set(reminder.medicationId, current);
    }
    
    for (const [medId, stats] of medicationGroups) {
      byMedication.set(medId, (stats.taken / stats.total) * 100);
    }
    
    return {
      totalScheduled,
      totalTaken,
      totalSkipped,
      adherenceRate,
      byMedication
    };
  }

  // Check for medication interactions
  async checkInteractions(medicationIds: string[]): Promise<string[]> {
    const interactions: string[] = [];
    const medications = await db.medications
      .where('id')
      .anyOf(medicationIds)
      .toArray();
    
    // Check known interactions
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];
        
        // Check if either medication lists the other as an interaction
        if (med1.interactions?.some(int => 
          int.toLowerCase().includes(med2.name.toLowerCase()) ||
          (med2.genericName && int.toLowerCase().includes(med2.genericName.toLowerCase()))
        )) {
          interactions.push(`⚠️ ${med1.name} may interact with ${med2.name}`);
        }
      }
    }
    
    return interactions;
  }

  // Generate medication reminder notifications
  async scheduleNotifications(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      const today = await this.getTodaySchedule();
      
      for (const reminder of today) {
        if (!reminder.taken && !reminder.skipped && !reminder.notificationSent) {
          const notificationTime = new Date(reminder.date);
          const [hours, minutes] = reminder.time.split(':').map(Number);
          notificationTime.setHours(hours, minutes, 0, 0);
          
          const now = new Date();
          const delay = notificationTime.getTime() - now.getTime();
          
          if (delay > 0) {
            setTimeout(async () => {
              const medication = await db.medications.get(reminder.medicationId);
              new Notification('Medication Reminder', {
                body: `Time to take ${medication?.name} - ${reminder.dosage}`,
                icon: '/icon-192x192.png',
                tag: reminder.id,
                requireInteraction: true
              });
              
              await db.medicationReminders.update(reminder.id, {
                notificationSent: true
              });
            }, delay);
          }
        }
      }
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const medicationProcessor = MedicationProcessor.getInstance();
