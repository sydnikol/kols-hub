import axios from 'axios';
import { HealthPortalData } from '../types';

export class HealthPortalIntegration {
  private userSessions: Map<string, { accessToken: string; refreshToken: string }>;

  constructor() {
    this.userSessions = new Map();
  }

  // myUHealth Portal Integration
  async connectMyUHealth(userId: string, credentials: { username: string; password: string }): Promise<void> {
    try {
      // Note: This is a placeholder - actual myUHealth API endpoints would be needed
      // For FHIR-compliant systems, you would typically use OAuth2
      const response = await axios.post('https://api.myuhealth.com/oauth/token', {
        grant_type: 'password',
        username: credentials.username,
        password: credentials.password,
        client_id: process.env.MYUHEALTH_CLIENT_ID,
        client_secret: process.env.MYUHEALTH_CLIENT_SECRET,
      });

      this.userSessions.set(userId, {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });
    } catch (error) {
      console.error('Error connecting to myUHealth:', error);
      throw new Error('Failed to connect to myUHealth portal');
    }
  }

  async syncHealthData(userId: string): Promise<HealthPortalData> {
    const session = this.userSessions.get(userId);
    if (!session) {
      throw new Error('myUHealth not connected for this user');
    }

    try {
      // Fetch various health data using FHIR API standards
      const [appointments, medications, labResults] = await Promise.all([
        this.fetchAppointments(session.accessToken),
        this.fetchMedications(session.accessToken),
        this.fetchLabResults(session.accessToken),
      ]);

      const healthData: HealthPortalData = {
        userId,
        portal: 'myuhealth',
        appointments,
        medications,
        labResults,
        lastSync: new Date(),
      };

      return healthData;
    } catch (error) {
      console.error('Error syncing health data:', error);
      throw new Error('Failed to sync health portal data');
    }
  }

  private async fetchAppointments(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get('https://api.myuhealth.com/fhir/Appointment', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { status: 'booked,pending' },
      });

      return response.data.entry?.map((entry: any) => ({
        id: entry.resource.id,
        status: entry.resource.status,
        start: entry.resource.start,
        end: entry.resource.end,
        participant: entry.resource.participant,
        description: entry.resource.description,
      })) || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  private async fetchMedications(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get('https://api.myuhealth.com/fhir/MedicationRequest', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { status: 'active' },
      });

      return response.data.entry?.map((entry: any) => ({
        id: entry.resource.id,
        medication: entry.resource.medicationCodeableConcept?.text,
        dosage: entry.resource.dosageInstruction,
        status: entry.resource.status,
        authoredOn: entry.resource.authoredOn,
      })) || [];
    } catch (error) {
      console.error('Error fetching medications:', error);
      return [];
    }
  }

  private async fetchLabResults(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get('https://api.myuhealth.com/fhir/Observation', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { category: 'laboratory' },
      });

      return response.data.entry?.map((entry: any) => ({
        id: entry.resource.id,
        code: entry.resource.code?.text,
        value: entry.resource.valueQuantity,
        effectiveDateTime: entry.resource.effectiveDateTime,
        status: entry.resource.status,
      })) || [];
    } catch (error) {
      console.error('Error fetching lab results:', error);
      return [];
    }
  }

  async importMedicationFromExcel(userId: string, excelData: any[]): Promise<any[]> {
    // Parse Excel medication data
    const medications = excelData.map((row) => ({
      name: row.MedicationName || row['Medication Name'] || '',
      dosage: row.Dosage || '',
      frequency: row.Frequency || '',
      prescribedDate: row['Prescribed Date'] ? new Date(row['Prescribed Date']) : new Date(),
      instructions: row.Instructions || '',
      prescriber: row.Prescriber || '',
    }));

    // Store in database (placeholder - would need actual DB integration)
    console.log(`Imported ${medications.length} medications for user ${userId}`);

    return medications;
  }

  async disconnectPortal(userId: string): Promise<void> {
    this.userSessions.delete(userId);
  }
}
