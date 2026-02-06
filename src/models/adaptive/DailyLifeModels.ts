// Daily Life, Routines, and Care Models

export interface Ritual {
  id: string;
  userId: string;
  name: string;
  type: 'spiritual' | 'self-care' | 'grounding' | 'creative';
  category?: 'hoodoo' | 'ancestor_altar' | 'breathwork' | 'other';

  // Steps
  standard_steps: string[];
  low_energy_variant?: string[];

  // Scheduling
  cadence: 'daily' | 'weekly' | 'monthly' | 'custom';
  custom_schedule?: string; // e.g., "Every Tuesday and Friday"
  preferred_time?: string; // e.g., "morning", "evening"

  // Metadata
  duration_minutes?: number;
  supplies_needed?: string[];
  notes?: string;
  active: boolean;
}

export interface RitualLog {
  id: string;
  userId: string;
  ritual_id: string;
  performed_at: Date;
  variant_used: 'standard' | 'low_energy';
  duration_minutes?: number;
  notes?: string;
  mood_before?: number; // 1-10
  mood_after?: number; // 1-10
}

export interface Chore {
  id: string;
  userId: string;
  name: string;
  description: string;
  cadence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  assigned_contact_id?: string; // Aide or partner
  low_stress: boolean;
  estimated_minutes?: number;
  active: boolean;
}

export interface ChoreLog {
  id: string;
  userId: string;
  chore_id: string;
  completed_at: Date;
  completed_by?: string; // Contact ID
  notes?: string;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed?: string;
  age?: number;
  notes?: string;
  bonding_activities: string[]; // e.g., "walk", "cuddle ritual"
}

export interface PetCareLog {
  id: string;
  userId: string;
  pet_id: string;
  activity: string;
  performed_at: Date;
  duration_minutes?: number;
  notes?: string;
}

export interface MealPreference {
  id: string;
  userId: string;
  preferred_cuisines: string[]; // e.g., ['Italian', 'Thai', 'Soul Food']
  dislikes: string[];
  dietary_constraints: string[]; // e.g., ['vegetarian', 'gluten-free']
  no_leftovers: boolean;
  budget_friendly: boolean;
  notes?: string;
}

export interface PantryItem {
  id: string;
  userId: string;
  name: string;
  category: 'grains' | 'canned' | 'spices' | 'snacks' | 'electrolytes' | 'beverages' | 'other';
  in_stock: boolean;
  low_stock?: boolean;
  reorder_threshold?: number;
  notes?: string;
}

export interface GroceryList {
  id: string;
  userId: string;
  name: string;
  items: GroceryListItem[];
  shared_with_contacts?: string[]; // Contact IDs
  created_at: Date;
  completed: boolean;
}

export interface GroceryListItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  notes?: string;
}

export interface Script {
  id: string;
  userId: string;
  situation: string; // e.g., "Advocate for chart documentation"
  domain: 'medical' | 'family' | 'systems' | 'community' | 'workplace';
  tone: 'calm' | 'firm' | 'warm' | 'neutral';
  script_text: string;
  example_use?: string;
  tags?: string[];
}

export interface Handbook {
  id: string;
  userId: string;
  title: string;
  audience: 'partners' | 'mom' | 'aide' | 'friends' | 'community';
  sections: HandbookSection[];
  created_at: Date;
  last_updated: Date;
}

export interface HandbookSection {
  title: string;
  content: string;
  bullet_steps?: string[];
  examples?: string[];
}

export interface MediaAutomation {
  id: string;
  userId: string;
  name: string;
  trigger_type: 'time' | 'event' | 'condition';
  trigger_value: string; // e.g., "DAILY@22:30", "on_sleep_routine"
  action: 'play_playlist' | 'start_meditation' | 'play_album' | 'shuffle_genre';
  payload: {
    service?: 'spotify' | 'apple_music';
    playlist?: string;
    album?: string;
    genre?: string;
    volume?: number;
  };
  enabled: boolean;
}

export interface BodyWeatherEntry {
  id: string;
  userId: string;
  logged_at: Date;
  pain_level: number; // 0-10
  energy_level: number; // 0-10
  mood: number; // 0-10
  spoons_available: number; // Spoon theory
  symptoms: string[];
  triggers?: string[];
  notes?: string;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'gothic_dark' | 'dark_velvet' | 'modern_noir';
  language: string; // e.g., 'en-US'
  timezone: string;

  // Accessibility
  dyslexia_friendly_font: boolean;
  high_contrast: boolean;
  large_tap_targets: boolean;
  haptics_enabled: boolean;

  // Privacy
  default_privacy: 'private' | 'friends_only' | 'public';

  // Notifications
  medication_reminders: boolean;
  hydration_reminders: boolean;
  appointment_reminders: boolean;
}
