// Wardrobe, Outfit, and Comfort Models

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories' | 'jewelry' | 'piercing';
  subcategory?: string; // e.g., 't-shirt', 'jeans', 'necklace'
  color: string;
  material: string;
  size: string;
  fit: 'tight' | 'fitted' | 'relaxed' | 'oversized';
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';

  // Accessibility & Comfort Flags
  sensory_safe: boolean;
  eds_friendly: boolean; // Hypermobility-friendly
  compression_support: boolean;
  comfort_score: number; // 0-100
  reliability_score: number; // 0-100

  // Care instructions
  machine_washable: boolean;
  care_instructions: string;

  // Metadata
  image_url?: string;
  purchase_date?: Date;
  cost?: number;
  notes?: string;
  tags?: string[]; // e.g., ['gothic', 'alt', 'leather']
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  wardrobe_item_ids: string[]; // Array of WardrobeItem IDs
  tags: string[]; // e.g., ['home', 'flare', 'errands', 'date']

  // Comfort Profiles
  comfort_profile: 'low_spoon' | 'heat_safe' | 'cold_weather' | 'flare_day' | 'standard';
  weather_suitability?: string[]; // e.g., ['hot', 'humid', 'cold']

  // Backup & Planning
  backup_outfit_id?: string;

  // Metadata
  image_url?: string;
  created_at: Date;
  last_worn?: Date;
  notes?: string;
}

export interface WearLog {
  id: string;
  userId: string;
  outfit_id: string;
  worn_at: Date;

  // Feedback
  comfort_rating: number; // 1-10
  pain_level: number; // 0-10
  energy_level: number; // 0-10
  weather_conditions?: string;
  notes?: string;

  // Issues
  issues_encountered?: string[];
  would_wear_again: boolean;
}

export interface Plan {
  id: string;
  userId: string;
  event_id: string;
  primary_outfit_id: string;
  backup_outfit_id?: string;
  acceptance_status: 'planned' | 'accepted' | 'worn' | 'skipped';
  notes?: string;
}
