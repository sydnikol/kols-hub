import {
  Condition,
  Provider,
  Medication,
  MedicationLog,
  VitalsLog,
  VitalsThreshold,
  Appointment,
  EmergencyProfile,
} from '../models/HealthModels';

export class HealthManagementService {
  private conditions: Map<string, Condition>;
  private providers: Map<string, Provider>;
  private medications: Map<string, Medication>;
  private medicationLogs: MedicationLog[];
  private vitalsLogs: VitalsLog[];
  private vitalsThresholds: Map<string, VitalsThreshold>;
  private appointments: Map<string, Appointment>;
  private emergencyProfiles: Map<string, EmergencyProfile>;

  constructor() {
    this.conditions = new Map();
    this.providers = new Map();
    this.medications = new Map();
    this.medicationLogs = [];
    this.vitalsLogs = [];
    this.vitalsThresholds = new Map();
    this.appointments = new Map();
    this.emergencyProfiles = new Map();
  }

  // Conditions Management
  async addCondition(condition: Condition): Promise<Condition> {
    this.conditions.set(condition.id, condition);
    return condition;
  }

  async getUserConditions(userId: string): Promise<Condition[]> {
    return Array.from(this.conditions.values()).filter(
      (c) => c.userId === userId && c.active
    );
  }

  // Providers Management
  async addProvider(provider: Provider): Promise<Provider> {
    this.providers.set(provider.id, provider);
    return provider;
  }

  async getUserProviders(userId: string): Promise<Provider[]> {
    return Array.from(this.providers.values()).filter((p) => p.userId === userId);
  }

  getProviderByType(userId: string, type: Provider['type']): Provider | undefined {
    return Array.from(this.providers.values()).find(
      (p) => p.userId === userId && p.type === type
    );
  }

  // Medication Management
  async addMedication(medication: Medication): Promise<Medication> {
    this.medications.set(medication.id, medication);
    return medication;
  }

  async getUserMedications(userId: string): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      (m) => m.userId === userId && m.active
    );
  }

  async logMedication(log: MedicationLog): Promise<MedicationLog> {
    this.medicationLogs.push(log);
    return log;
  }

  async getMedicationLogs(
    userId: string,
    medicationId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<MedicationLog[]> {
    let logs = this.medicationLogs.filter((log) => log.userId === userId);

    if (medicationId) {
      logs = logs.filter((log) => log.medication_id === medicationId);
    }

    if (dateRange) {
      logs = logs.filter(
        (log) =>
          log.taken_at >= dateRange.start && log.taken_at <= dateRange.end
      );
    }

    return logs.sort((a, b) => b.taken_at.getTime() - a.taken_at.getTime());
  }

  async checkMedicationAdherence(userId: string, days: number = 7): Promise<{
    adherence_rate: number;
    missed_doses: number;
    total_expected: number;
  }> {
    const medications = await this.getUserMedications(userId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.getMedicationLogs(userId, undefined, {
      start: startDate,
      end: new Date(),
    });

    // Simple adherence calculation (would be more complex in production)
    const takenDoses = logs.filter((log) => !log.skipped).length;
    const expectedDoses = medications.filter((m) => !m.as_needed).length * days;

    return {
      adherence_rate: expectedDoses > 0 ? (takenDoses / expectedDoses) * 100 : 100,
      missed_doses: expectedDoses - takenDoses,
      total_expected: expectedDoses,
    };
  }

  // Vitals Monitoring
  async logVitals(vitals: VitalsLog): Promise<VitalsLog> {
    this.vitalsLogs.push(vitals);

    // Check thresholds and trigger alerts
    await this.checkVitalsThresholds(vitals);

    return vitals;
  }

  private async checkVitalsThresholds(vitals: VitalsLog): Promise<void> {
    const userThresholds = Array.from(this.vitalsThresholds.values()).filter(
      (t) => t.userId === vitals.userId
    );

    for (const threshold of userThresholds) {
      let value: number | undefined;

      switch (threshold.type) {
        case 'bp_systolic':
          value = vitals.bp_systolic;
          break;
        case 'bp_diastolic':
          value = vitals.bp_diastolic;
          break;
        case 'heart_rate':
          value = vitals.heart_rate;
          break;
        case 'oxygen':
          value = vitals.oxygen;
          break;
        case 'temperature':
          value = vitals.temperature;
          break;
      }

      if (value !== undefined) {
        const triggered =
          (threshold.condition === 'above' && value > threshold.value) ||
          (threshold.condition === 'below' && value < threshold.value);

        if (triggered) {
          console.log(`[ALERT ${threshold.severity.toUpperCase()}] ${threshold.alert_message}`);
          // In production, send notification to user and contacts
        }
      }
    }
  }

  async getVitalsLogs(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<VitalsLog[]> {
    let logs = this.vitalsLogs.filter((log) => log.userId === userId);

    if (dateRange) {
      logs = logs.filter(
        (log) =>
          log.logged_at >= dateRange.start && log.logged_at <= dateRange.end
      );
    }

    return logs.sort((a, b) => b.logged_at.getTime() - a.logged_at.getTime());
  }

  async addVitalsThreshold(threshold: VitalsThreshold): Promise<VitalsThreshold> {
    this.vitalsThresholds.set(threshold.id, threshold);
    return threshold;
  }

  // Appointments
  async scheduleAppointment(appointment: Appointment): Promise<Appointment> {
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    const now = new Date();
    return Array.from(this.appointments.values())
      .filter((a) => a.userId === userId && a.start_time > now && !a.completed)
      .sort((a, b) => a.start_time.getTime() - b.start_time.getTime());
  }

  // Emergency Profile
  async updateEmergencyProfile(profile: EmergencyProfile): Promise<EmergencyProfile> {
    profile.last_updated = new Date();
    this.emergencyProfiles.set(profile.userId, profile);
    return profile;
  }

  async getEmergencyProfile(userId: string): Promise<EmergencyProfile | undefined> {
    return this.emergencyProfiles.get(userId);
  }

  async generateEmergencyCard(userId: string): Promise<string> {
    const profile = await this.getEmergencyProfile(userId);
    if (!profile) {
      throw new Error('No emergency profile found');
    }

    const conditions = profile.key_conditions.join(', ');
    const medications = profile.current_medications.join(', ');

    return `
=== EMERGENCY PROFILE ===
User ID: ${userId}
Last Updated: ${profile.last_updated.toLocaleDateString()}

KEY CONDITIONS:
${conditions}

CURRENT MEDICATIONS:
${medications}

IF FREEZE/DISSOCIATION OCCURS:
${profile.if_freeze_steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

PRIORITY CONTACTS:
[Contact list would be populated here]

Additional Notes:
${profile.additional_notes || 'None'}
    `.trim();
  }
}
