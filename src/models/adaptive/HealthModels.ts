// Health, Conditions, and Provider Models

export interface Condition {
  id: string;
  userId: string;
  name: string;
  type: 'chronic' | 'acute' | 'managed';
  diagnosis_date?: Date;
  notes: string;
  care_instructions: string;
  emergency_alert?: string;
  severity?: number; // 1-10
  active: boolean;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  organization: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  type: 'PCP' | 'specialist' | 'therapist' | 'psychiatrist' | 'PT' | 'OT' | 'other';
  emergency_line?: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  route: 'oral' | 'injection' | 'topical' | 'inhaled' | 'other';
  purpose: string;
  schedule: string; // e.g., "Daily 8AM", "BID"
  as_needed: boolean;
  timing_notes?: string; // e.g., "Skip on MTX day"
  side_effects?: string[];
  caution_prompts?: string[];
  active: boolean;
  prescribed_by?: string; // Provider ID
  prescribed_date?: Date;
}

export interface MedicationLog {
  id: string;
  userId: string;
  medication_id: string;
  taken_at: Date;
  dosage: string;
  notes?: string;
  skipped?: boolean;
  skip_reason?: string;
}

export interface VitalsLog {
  id: string;
  userId: string;
  logged_at: Date;
  bp_systolic?: number;
  bp_diastolic?: number;
  heart_rate?: number;
  oxygen?: number;
  temperature?: number;
  notes?: string;
}

export interface VitalsThreshold {
  id: string;
  userId: string;
  type: 'bp_systolic' | 'bp_diastolic' | 'heart_rate' | 'oxygen' | 'temperature';
  condition: 'above' | 'below';
  value: number;
  alert_message: string;
  contact_id?: string; // Contact to notify
  provider_id?: string; // Provider to notify
  severity: 'info' | 'warning' | 'critical';
}

export interface HydrationLog {
  id: string;
  userId: string;
  logged_at: Date;
  volume_ml: number;
  sodium_mg: number;
  source: 'water' | 'electrolyte_drink' | 'pedialyte' | 'LMNT' | 'nuun' | 'other';
  notes?: string;
}

export interface SodiumIntakeLog {
  id: string;
  userId: string;
  logged_at: Date;
  source_type: 'packet' | 'food' | 'tablet' | 'drink';
  source_label: string;
  sodium_mg: number;
  notes?: string;
}

export interface DailyNutritionSummary {
  id: string;
  userId: string;
  date: Date;
  total_fluids_ml: number;
  total_sodium_mg: number;
  electrolyte_packet_count: number;
  below_min: boolean;
  above_max: boolean;
  alerts_triggered: string[];
}

export interface AlertRule {
  id: string;
  userId: string;
  type: 'hydration' | 'sodium' | 'vitals' | 'medication' | 'custom';
  condition: string; // e.g., "sodium < 4000"
  message: string;
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  provider_id: string;
  title: string;
  start_time: Date;
  end_time: Date;
  location: string;
  prep_questions?: string[];
  notes?: string;
  completed: boolean;
  follow_up_notes?: string;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  relationship: 'partner' | 'mom' | 'aide' | 'friend' | 'sibling' | 'other';
  role: string; // e.g., "Primary Support", "Home Health Aide"
  access_level: 'full' | 'emergency' | 'limited';
  phone?: string;
  email?: string;
  notes?: string;
  interpersonal_guidance?: string;
}

export interface EmergencyProfile {
  id: string;
  userId: string;
  key_conditions: string[];
  current_medications: string[];
  if_freeze_steps: string[]; // For dissociation or overwhelm
  priority_contacts: string[]; // Contact IDs in order
  additional_notes?: string;
  last_updated: Date;
}
