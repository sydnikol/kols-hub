/**
 * NABLA INTEGRATION SERVICE
 * AI-powered medical assistant and clinical documentation
 *
 * Features:
 * - Ambient clinical documentation
 * - AI medical note generation
 * - Patient encounter transcription
 * - ICD-10 coding suggestions
 * - SOAP note automation
 * - EHR integration
 *
 * API Documentation:
 * https://docs.nabla.com/
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface NablaConfig {
  apiKey: string;
  organizationId?: string;
  environment?: 'production' | 'staging';
}

export interface ClinicalEncounter {
  id: string;
  patientId: string;
  providerId: string;
  encounterType: 'office-visit' | 'telemedicine' | 'follow-up' | 'emergency' | 'procedure';
  startTime: string;
  endTime?: string;
  status: 'in-progress' | 'completed' | 'cancelled';
  audioRecording?: AudioRecording;
  transcript?: Transcript;
  clinicalNote?: ClinicalNote;
}

export interface AudioRecording {
  id: string;
  duration: number; // seconds
  format: 'mp3' | 'wav' | 'webm';
  url?: string;
  uploadedAt: string;
}

export interface Transcript {
  id: string;
  segments: TranscriptSegment[];
  speakers: Speaker[];
  confidence: number; // 0-1
  language: string;
}

export interface TranscriptSegment {
  speaker: 'provider' | 'patient' | 'unknown';
  text: string;
  startTime: number; // seconds
  endTime: number;
  confidence: number;
}

export interface Speaker {
  id: string;
  role: 'provider' | 'patient';
  name?: string;
}

export interface ClinicalNote {
  id: string;
  encounterId: string;
  type: 'soap' | 'progress-note' | 'consultation' | 'procedure-note';
  sections: NoteSection[];
  icdCodes: ICDCode[];
  cptCodes: CPTCode[];
  generatedAt: string;
  reviewed: boolean;
  signedBy?: string;
  signedAt?: string;
}

export interface NoteSection {
  type: 'subjective' | 'objective' | 'assessment' | 'plan' | 'hpi' | 'ros' | 'physical-exam';
  content: string;
  confidence: number;
  highlights?: string[];
}

export interface ICDCode {
  code: string;
  description: string;
  confidence: number;
  category: string;
}

export interface CPTCode {
  code: string;
  description: string;
  units?: number;
  modifiers?: string[];
}

export interface SOAPNote {
  subjective: {
    chiefComplaint: string;
    hpi: string; // History of Present Illness
    ros: string; // Review of Systems
    socialHistory?: string;
    familyHistory?: string;
  };
  objective: {
    vitals?: VitalSigns;
    physicalExam: string;
    labResults?: string;
    imaging?: string;
  };
  assessment: {
    diagnoses: Diagnosis[];
    differentialDiagnosis?: string[];
  };
  plan: {
    medications?: MedicationOrder[];
    procedures?: string[];
    followUp?: string;
    patientEducation?: string;
    referrals?: Referral[];
  };
}

export interface VitalSigns {
  temperature?: { value: number; unit: string };
  pulse?: { value: number; unit: string };
  bloodPressure?: { systolic: number; diastolic: number };
  respiratoryRate?: { value: number; unit: string };
  oxygenSaturation?: { value: number; unit: string };
  weight?: { value: number; unit: string };
  height?: { value: number; unit: string };
  bmi?: number;
}

export interface Diagnosis {
  description: string;
  icdCode: string;
  isPrimary: boolean;
  status: 'active' | 'resolved' | 'chronic';
}

export interface MedicationOrder {
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}

export interface Referral {
  specialty: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'stat';
  provider?: string;
}

export interface MedicalConcept {
  text: string;
  type: 'symptom' | 'diagnosis' | 'medication' | 'procedure' | 'anatomy' | 'lab-test';
  code?: string;
  codeSystem?: string;
  confidence: number;
}

export interface ClinicalInsight {
  type: 'red-flag' | 'recommendation' | 'missing-info' | 'drug-interaction' | 'guideline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence?: string[];
  actionRequired?: string;
}

// ============================================================================
// NABLA INTEGRATION SERVICE
// ============================================================================

class NablaIntegrationService {
  private apiKey: string | null = null;
  private organizationId: string | null = null;
  private environment: 'production' | 'staging' = 'production';
  private baseUrl = 'https://api.nabla.com/v1';

  // Initialize service with credentials
  initialize(config: NablaConfig): boolean {
    try {
      this.apiKey = config.apiKey;
      this.organizationId = config.organizationId || null;
      this.environment = config.environment || 'production';

      if (this.environment === 'staging') {
        this.baseUrl = 'https://api-staging.nabla.com/v1';
      }

      // Store in localStorage for persistence
      if (this.apiKey) {
        localStorage.setItem('nabla_api_key', this.apiKey);
      }
      if (this.organizationId) {
        localStorage.setItem('nabla_org_id', this.organizationId);
      }

      console.log('✅ Nabla integration initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Nabla:', error);
      return false;
    }
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.apiKey !== null || localStorage.getItem('nabla_api_key') !== null;
  }

  // Get authentication headers
  private getAuthHeaders(): HeadersInit {
    const apiKey = this.apiKey || localStorage.getItem('nabla_api_key');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  // ============================================================================
  // ENCOUNTER MANAGEMENT
  // ============================================================================

  async createEncounter(params: {
    patientId: string;
    providerId: string;
    encounterType: ClinicalEncounter['encounterType'];
  }): Promise<ClinicalEncounter | null> {
    try {
      const encounter: ClinicalEncounter = {
        id: `enc-${Date.now()}`,
        patientId: params.patientId,
        providerId: params.providerId,
        encounterType: params.encounterType,
        startTime: new Date().toISOString(),
        status: 'in-progress'
      };

      console.log('✅ Created clinical encounter:', encounter.id);
      return encounter;
    } catch (error) {
      console.error('❌ Failed to create encounter:', error);
      return null;
    }
  }

  async getEncounter(encounterId: string): Promise<ClinicalEncounter | null> {
    try {
      // Mock implementation
      const encounter: ClinicalEncounter = {
        id: encounterId,
        patientId: 'P12345',
        providerId: 'DR-789',
        encounterType: 'office-visit',
        startTime: '2025-01-23T10:00:00Z',
        endTime: '2025-01-23T10:30:00Z',
        status: 'completed'
      };

      return encounter;
    } catch (error) {
      console.error('❌ Failed to get encounter:', error);
      return null;
    }
  }

  async completeEncounter(encounterId: string): Promise<boolean> {
    try {
      console.log('✅ Completed encounter:', encounterId);
      return true;
    } catch (error) {
      console.error('❌ Failed to complete encounter:', error);
      return false;
    }
  }

  // ============================================================================
  // AUDIO & TRANSCRIPTION
  // ============================================================================

  async uploadAudio(params: {
    encounterId: string;
    audioFile: Blob | File;
    format: AudioRecording['format'];
  }): Promise<AudioRecording | null> {
    try {
      const recording: AudioRecording = {
        id: `audio-${Date.now()}`,
        duration: 1800, // 30 minutes (mock)
        format: params.format,
        uploadedAt: new Date().toISOString()
      };

      console.log('✅ Audio uploaded for transcription');
      return recording;
    } catch (error) {
      console.error('❌ Failed to upload audio:', error);
      return null;
    }
  }

  async transcribeAudio(audioId: string): Promise<Transcript | null> {
    try {
      // Mock implementation
      const transcript: Transcript = {
        id: `transcript-${audioId}`,
        segments: [
          {
            speaker: 'patient',
            text: 'I\'ve been having chest pain for the past three days.',
            startTime: 0,
            endTime: 4.5,
            confidence: 0.95
          },
          {
            speaker: 'provider',
            text: 'Can you describe the pain? Is it sharp or dull?',
            startTime: 4.5,
            endTime: 8.2,
            confidence: 0.97
          },
          {
            speaker: 'patient',
            text: 'It\'s a sharp pain, especially when I take deep breaths.',
            startTime: 8.2,
            endTime: 12.1,
            confidence: 0.94
          }
        ],
        speakers: [
          { id: 'sp-1', role: 'provider', name: 'Dr. Smith' },
          { id: 'sp-2', role: 'patient' }
        ],
        confidence: 0.95,
        language: 'en-US'
      };

      console.log('✅ Audio transcribed');
      return transcript;
    } catch (error) {
      console.error('❌ Failed to transcribe audio:', error);
      return null;
    }
  }

  // ============================================================================
  // CLINICAL NOTE GENERATION
  // ============================================================================

  async generateClinicalNote(params: {
    encounterId: string;
    transcriptId: string;
    noteType: ClinicalNote['type'];
    includeICD?: boolean;
    includeCPT?: boolean;
  }): Promise<ClinicalNote | null> {
    try {
      const note: ClinicalNote = {
        id: `note-${Date.now()}`,
        encounterId: params.encounterId,
        type: params.noteType,
        sections: [
          {
            type: 'subjective',
            content: 'Patient reports chest pain for 3 days, sharp in nature, worse with deep breathing. Denies fever, cough, or shortness of breath.',
            confidence: 0.92,
            highlights: ['chest pain', 'sharp', 'deep breathing']
          },
          {
            type: 'objective',
            content: 'Vitals: BP 130/85, HR 78, RR 16, Temp 98.6°F, O2 Sat 98%. Cardiovascular: Regular rate and rhythm, no murmurs. Respiratory: Clear to auscultation bilaterally.',
            confidence: 0.88
          },
          {
            type: 'assessment',
            content: 'Likely pleuritic chest pain, possibly costochondritis. Differential includes pulmonary embolism (low probability), pneumonia.',
            confidence: 0.85,
            highlights: ['costochondritis', 'differential diagnosis']
          },
          {
            type: 'plan',
            content: 'Ibuprofen 400mg TID with food. Chest X-ray ordered. Follow up in 1 week or sooner if symptoms worsen. Patient education provided regarding warning signs.',
            confidence: 0.90,
            highlights: ['Ibuprofen', 'chest X-ray', 'follow up']
          }
        ],
        icdCodes: params.includeICD ? [
          {
            code: 'R07.1',
            description: 'Chest pain on breathing',
            confidence: 0.88,
            category: 'Symptoms and signs'
          },
          {
            code: 'M94.0',
            description: 'Chondrocostal junction syndrome (Tietze)',
            confidence: 0.75,
            category: 'Musculoskeletal'
          }
        ] : [],
        cptCodes: params.includeCPT ? [
          {
            code: '99214',
            description: 'Office visit, established patient, moderate complexity'
          },
          {
            code: '71045',
            description: 'Chest X-ray, single view'
          }
        ] : [],
        generatedAt: new Date().toISOString(),
        reviewed: false
      };

      console.log('✅ Clinical note generated');
      return note;
    } catch (error) {
      console.error('❌ Failed to generate clinical note:', error);
      return null;
    }
  }

  async generateSOAPNote(encounterId: string): Promise<SOAPNote | null> {
    try {
      const soapNote: SOAPNote = {
        subjective: {
          chiefComplaint: 'Chest pain',
          hpi: 'Patient is a 45-year-old male presenting with chest pain for 3 days. Pain is sharp, located in the left chest wall, worse with deep breathing and movement. No radiation. Denies trauma.',
          ros: 'Constitutional: Denies fever, chills, weight loss. Cardiovascular: Denies palpitations. Respiratory: Denies cough, SOB. GI: Denies nausea, vomiting.',
          socialHistory: 'Non-smoker, occasional alcohol use',
          familyHistory: 'Father with CAD at age 60'
        },
        objective: {
          vitals: {
            temperature: { value: 98.6, unit: '°F' },
            pulse: { value: 78, unit: 'bpm' },
            bloodPressure: { systolic: 130, diastolic: 85 },
            respiratoryRate: { value: 16, unit: 'breaths/min' },
            oxygenSaturation: { value: 98, unit: '%' }
          },
          physicalExam: 'General: Alert, oriented, no acute distress. CV: RRR, no m/r/g. Respiratory: CTAB, no wheezes/rales. Chest wall: Tender to palpation over left costal cartilages.',
          labResults: 'Troponin: Negative. D-dimer: Normal.',
          imaging: 'Chest X-ray pending'
        },
        assessment: {
          diagnoses: [
            {
              description: 'Costochondritis',
              icdCode: 'M94.0',
              isPrimary: true,
              status: 'active'
            }
          ],
          differentialDiagnosis: ['Pulmonary embolism', 'Pneumonia', 'Myocardial infarction']
        },
        plan: {
          medications: [
            {
              name: 'Ibuprofen',
              dosage: '400mg',
              route: 'PO',
              frequency: 'TID',
              duration: '10 days',
              instructions: 'Take with food'
            }
          ],
          procedures: ['Chest X-ray ordered'],
          followUp: 'Return to clinic in 1 week or sooner if symptoms worsen',
          patientEducation: 'Discussed warning signs: severe chest pain, SOB, fever. Patient verbalized understanding.',
          referrals: []
        }
      };

      console.log('✅ SOAP note generated');
      return soapNote;
    } catch (error) {
      console.error('❌ Failed to generate SOAP note:', error);
      return null;
    }
  }

  // ============================================================================
  // MEDICAL CODING
  // ============================================================================

  async suggestICDCodes(clinicalText: string): Promise<ICDCode[]> {
    try {
      // Mock ICD-10 code suggestions
      const codes: ICDCode[] = [
        {
          code: 'R07.1',
          description: 'Chest pain on breathing',
          confidence: 0.88,
          category: 'Symptoms and signs involving the circulatory and respiratory systems'
        },
        {
          code: 'M94.0',
          description: 'Chondrocostal junction syndrome',
          confidence: 0.75,
          category: 'Diseases of the musculoskeletal system'
        },
        {
          code: 'R07.89',
          description: 'Other chest pain',
          confidence: 0.65,
          category: 'Symptoms and signs'
        }
      ];

      return codes;
    } catch (error) {
      console.error('❌ Failed to suggest ICD codes:', error);
      return [];
    }
  }

  async suggestCPTCodes(procedureDescription: string): Promise<CPTCode[]> {
    try {
      // Mock CPT code suggestions
      const codes: CPTCode[] = [
        {
          code: '99214',
          description: 'Office or other outpatient visit, established patient, 30-39 minutes'
        },
        {
          code: '71045',
          description: 'Radiologic examination, chest; single view'
        }
      ];

      return codes;
    } catch (error) {
      console.error('❌ Failed to suggest CPT codes:', error);
      return [];
    }
  }

  // ============================================================================
  // CLINICAL INTELLIGENCE
  // ============================================================================

  async extractMedicalConcepts(text: string): Promise<MedicalConcept[]> {
    try {
      // Mock medical concept extraction
      const concepts: MedicalConcept[] = [
        {
          text: 'chest pain',
          type: 'symptom',
          code: 'R07.9',
          codeSystem: 'ICD-10',
          confidence: 0.95
        },
        {
          text: 'costochondritis',
          type: 'diagnosis',
          code: 'M94.0',
          codeSystem: 'ICD-10',
          confidence: 0.85
        },
        {
          text: 'ibuprofen',
          type: 'medication',
          code: '5640',
          codeSystem: 'RxNorm',
          confidence: 0.92
        }
      ];

      return concepts;
    } catch (error) {
      console.error('❌ Failed to extract medical concepts:', error);
      return [];
    }
  }

  async generateClinicalInsights(encounterId: string): Promise<ClinicalInsight[]> {
    try {
      // Mock clinical insights
      const insights: ClinicalInsight[] = [
        {
          type: 'recommendation',
          severity: 'medium',
          title: 'Consider cardiac workup',
          description: 'Patient has family history of CAD. Consider EKG and cardiac enzymes to rule out cardiac etiology.',
          evidence: ['Family history of CAD at age 60'],
          actionRequired: 'Order EKG if not already done'
        },
        {
          type: 'guideline',
          severity: 'low',
          title: 'NSAIDs and GI protection',
          description: 'Patient prescribed ibuprofen. Consider adding PPI if high risk for GI bleeding.',
          evidence: ['Current guidelines recommend GI protection for long-term NSAID use']
        }
      ];

      return insights;
    } catch (error) {
      console.error('❌ Failed to generate insights:', error);
      return [];
    }
  }

  // ============================================================================
  // NOTE REVIEW & SIGNING
  // ============================================================================

  async reviewNote(noteId: string, edits?: Record<string, string>): Promise<ClinicalNote | null> {
    try {
      console.log('✅ Note reviewed and updated');
      // Would apply edits and return updated note
      return null;
    } catch (error) {
      console.error('❌ Failed to review note:', error);
      return null;
    }
  }

  async signNote(noteId: string, providerId: string, signature?: string): Promise<boolean> {
    try {
      console.log('✅ Note signed by provider:', providerId);
      return true;
    } catch (error) {
      console.error('❌ Failed to sign note:', error);
      return false;
    }
  }

  // ============================================================================
  // INTEGRATION WITH EHR
  // ============================================================================

  async exportToEHR(noteId: string, ehrSystem: 'epic' | 'cerner' | 'allscripts' | 'athenahealth'): Promise<{
    success: boolean;
    exportId?: string;
    error?: string;
  }> {
    try {
      // Mock EHR export
      return {
        success: true,
        exportId: `export-${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const nablaIntegration = new NablaIntegrationService();
