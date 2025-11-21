/**
 * Phone Contacts Types and Interfaces
 * Defines types for native phone integration
 */

export interface PhoneNumber {
  type?: 'home' | 'work' | 'mobile' | 'other';
  number: string;
  label?: string;
}

export interface EmailAddress {
  type?: 'home' | 'work' | 'other';
  address: string;
  label?: string;
}

export interface PostalAddress {
  type?: 'home' | 'work' | 'other';
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Contact {
  contactId: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  nickname?: string;
  phoneNumbers?: PhoneNumber[];
  emails?: EmailAddress[];
  addresses?: PostalAddress[];
  birthday?: string;
  organizationName?: string;
  organizationRole?: string;
  note?: string;
  image?: {
    base64String?: string;
    url?: string;
  };
}

export interface CareTeamContact extends Contact {
  // Additional fields for care team
  careTeamId?: string;
  role?: ContactRole;
  tags?: string[];
  isEmergency?: boolean;
  isFavorite?: boolean;
  relationship?: string;
  specialization?: string;
  availableHours?: string;
  preferredContactMethod?: 'call' | 'sms' | 'email';
  syncedFromPhone?: boolean;
  lastContacted?: Date;
  notes?: string[];
}

export type ContactRole =
  | 'doctor'
  | 'therapist'
  | 'psychiatrist'
  | 'counselor'
  | 'case_manager'
  | 'family'
  | 'friend'
  | 'partner'
  | 'emergency'
  | 'support_group'
  | 'crisis_hotline'
  | 'pharmacy'
  | 'other';

export interface ContactPermissionStatus {
  granted: boolean;
  canRequest: boolean;
  platform: 'ios' | 'android' | 'web';
}

export interface ContactSearchOptions {
  query?: string;
  role?: ContactRole;
  isEmergency?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

export interface CallOptions {
  phoneNumber: string;
  contactName?: string;
}

export interface SMSOptions {
  phoneNumber: string;
  message?: string;
  contactName?: string;
}

export interface EmergencyContact {
  contact: CareTeamContact;
  priority: number;
  quickActions: QuickAction[];
}

export interface QuickAction {
  type: 'call' | 'sms' | 'email';
  label: string;
  value: string;
  icon?: string;
}

export interface ContactSyncResult {
  imported: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export interface EmergencyNumber {
  name: string;
  number: string;
  description: string;
  type: 'emergency' | 'crisis' | 'support';
}

// Predefined emergency numbers
export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    name: 'Emergency Services',
    number: '911',
    description: 'Medical, Fire, Police emergencies',
    type: 'emergency'
  },
  {
    name: 'Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 suicide & crisis support',
    type: 'crisis'
  },
  {
    name: 'Crisis Text Line',
    number: '741741',
    description: 'Text HOME for crisis support',
    type: 'crisis'
  },
  {
    name: 'SAMHSA Helpline',
    number: '1-800-662-4357',
    description: 'Mental health & substance abuse',
    type: 'support'
  },
  {
    name: 'Poison Control',
    number: '1-800-222-1222',
    description: 'Poison emergency hotline',
    type: 'emergency'
  }
];

export interface ContactTag {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// Predefined tags for contact categorization
export const DEFAULT_CONTACT_TAGS: ContactTag[] = [
  { id: 'medical', name: 'Medical', color: '#EF4444', icon: 'medical-bag' },
  { id: 'mental-health', name: 'Mental Health', color: '#8B5CF6', icon: 'brain' },
  { id: 'family', name: 'Family', color: '#10B981', icon: 'users' },
  { id: 'friends', name: 'Friends', color: '#3B82F6', icon: 'heart' },
  { id: 'work', name: 'Work', color: '#F59E0B', icon: 'briefcase' },
  { id: 'emergency', name: 'Emergency', color: '#DC2626', icon: 'alert-triangle' },
  { id: 'support', name: 'Support', color: '#06B6D4', icon: 'hand-heart' }
];
