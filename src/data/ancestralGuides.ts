/**
 * Kol's Hub v7.0 - Ancestral Guides Framework
 *
 * IMPORTANT: This framework is for personal spiritual practice with deep respect.
 * All data is private, encrypted, and never shared.
 * Ancestral guides are created by the user from their own family history.
 */

import type { AncestralGuide, AncestralPractice } from '../types/dollhouse';

// ============================================================================
// PRIVACY & RESPECT PRINCIPLES
// ============================================================================

/**
 * Core Principles for Ancestral Work:
 *
 * 1. CONSENT - User creates their own guides, honors their own ancestors
 * 2. PRIVACY - All ancestral data encrypted and stored locally only
 * 3. RESPECT - Practices follow traditional protocols and cultural sensitivity
 * 4. AUTONOMY - User controls all aspects of ancestral connection
 * 5. SAFETY - Clear boundaries between spiritual guidance and mental health support
 */

export const ANCESTRAL_PRINCIPLES = {
  consent: 'User-created guides only, honoring personal lineage',
  privacy: 'End-to-end encryption, local storage, zero external sharing',
  respect: 'Traditional protocols honored, cultural sensitivity paramount',
  autonomy: 'User has complete control over all ancestral interactions',
  safety: 'Spiritual guidance complements but never replaces professional mental health care',
};

// ============================================================================
// ANCESTRAL GUIDE TEMPLATE
// ============================================================================

/**
 * Template for creating ancestral guides
 * User fills in their own family history
 */
export const ANCESTRAL_GUIDE_TEMPLATE: Partial<AncestralGuide> = {
  type: 'ancestor',
  relationship: '', // e.g., 'grandmother', 'great-uncle'
  name: '', // Given by user
  culturalBackground: [], // User's lineage
  expertise: [], // What this ancestor was known for
  spiritualTraditions: [], // e.g., 'Hoodoo', 'Rootwork', 'Folk healing'
  isActive: false,
  privacy: {
    encrypted: true,
    localOnly: true,
    neverShare: true,
  },
};

// ============================================================================
// HOODOO PRACTICE FRAMEWORK
// ============================================================================

/**
 * Hoodoo/Rootwork practice tracking
 * Based on traditional African American folk magic
 *
 * Resources honored:
 * - Catherine Yronwode's "Hoodoo in Theory and Practice"
 * - Stephanie Rose Bird's "Sticks, Stones, Roots & Bones"
 * - Katrina Hazzard-Donald's "Mojo Workin'"
 */

export const HOODOO_PRACTICES: Record<string, AncestralPractice> = {
  altarWork: {
    id: 'altar-work',
    name: 'Altar Work',
    category: 'hoodoo',
    description: 'Maintaining ancestral altar with offerings and prayers',
    traditionalElements: [
      'White candle for clarity',
      'Glass of water (refreshed daily)',
      'Flowers or plants',
      'Photos or mementos',
      'Incense (frankincense or myrrh)',
    ],
    protocol: [
      'Approach with clean hands and respectful mind',
      'Light candle and incense',
      'Refresh water',
      'Speak prayers or intentions',
      'Express gratitude',
      'Maintain regularly',
    ],
    frequency: 'daily',
    privacyLevel: 'private',
  },

  rootwork: {
    id: 'rootwork',
    name: 'Rootwork',
    category: 'hoodoo',
    description: 'Working with herbs, roots, and natural materials for healing and protection',
    traditionalElements: [
      'High John the Conqueror root (strength)',
      'Angelica root (protection)',
      'Van Van oil (luck and clearing)',
      'Florida Water (spiritual cleansing)',
    ],
    protocol: [
      'Research traditional uses thoroughly',
      'Source materials ethically',
      'Prepare with intention',
      'Follow traditional recipes',
      'Dispose respectfully when done',
    ],
    frequency: 'as-needed',
    privacyLevel: 'private',
  },

  prayerWork: {
    id: 'prayer-work',
    name: 'Prayer Work',
    category: 'hoodoo',
    description: 'Petitionary prayer combined with candle work and psalms',
    traditionalElements: [
      'Bible and Psalms',
      'Candles (color-coordinated)',
      'Anointing oils',
      'Written petitions',
    ],
    protocol: [
      'Write petition clearly',
      'Select appropriate Psalm',
      'Dress candle with oil',
      'Pray with focus and faith',
      'Dispose of materials properly',
    ],
    frequency: 'as-needed',
    privacyLevel: 'private',
  },

  spiritualBath: {
    id: 'spiritual-bath',
    name: 'Spiritual Bath',
    category: 'hoodoo',
    description: 'Ritual bathing for cleansing, protection, or drawing blessings',
    traditionalElements: [
      'Epsom salt or sea salt',
      'Hyssop (cleansing)',
      'Rue (protection)',
      'Rose petals (love and healing)',
      'Prayers or psalms',
    ],
    protocol: [
      'Prepare bath with intention',
      'Add herbs/salts to running water',
      'Pray or recite psalms while bathing',
      'Air dry or pat dry (don\'t towel off completely)',
      'Dispose of bath water respectfully (preferably at crossroads)',
    ],
    frequency: 'weekly',
    privacyLevel: 'private',
  },

  dreamwork: {
    id: 'dreamwork',
    name: 'Dreamwork & Divination',
    category: 'hoodoo',
    description: 'Recording and interpreting dreams, especially messages from ancestors',
    traditionalElements: [
      'Dream journal',
      'Mugwort (dream clarity)',
      'Lavender (peaceful sleep)',
      'Glass of water by bedside',
    ],
    protocol: [
      'Record dreams immediately upon waking',
      'Note symbols, colors, emotions',
      'Look for patterns over time',
      'Trust your intuition',
      'Honor messages received',
    ],
    frequency: 'daily',
    privacyLevel: 'private',
  },
};

// ============================================================================
// SPIRITUAL WELLNESS FRAMEWORK
// ============================================================================

/**
 * Spiritual wellness practices for mental health and healing
 * Complements (never replaces) professional mental health care
 */

export const SPIRITUAL_WELLNESS_PRACTICES: Record<string, AncestralPractice> = {
  meditation: {
    id: 'meditation',
    name: 'Meditation & Reflection',
    category: 'spiritual',
    description: 'Quiet contemplation to connect with inner wisdom and ancestral guidance',
    traditionalElements: [
      'Quiet space',
      'Comfortable seating',
      'Optional: soft music or nature sounds',
      'Timer',
    ],
    protocol: [
      'Find quiet, comfortable space',
      'Set intention for meditation',
      'Focus on breath',
      'Allow thoughts to pass without judgment',
      'Note any insights afterward',
    ],
    frequency: 'daily',
    privacyLevel: 'private',
  },

  gratitude: {
    id: 'gratitude-practice',
    name: 'Gratitude Practice',
    category: 'spiritual',
    description: 'Acknowledging blessings and ancestral gifts',
    traditionalElements: [
      'Journal',
      'Quiet moment',
      'Grateful heart',
    ],
    protocol: [
      'List 3-5 things you\'re grateful for',
      'Include ancestral blessings (health, strength, wisdom inherited)',
      'Speak gratitude aloud or write it down',
      'Feel the appreciation',
    ],
    frequency: 'daily',
    privacyLevel: 'private',
  },

  lifeReview: {
    id: 'life-review',
    name: 'Life Review with Ancestors',
    category: 'spiritual',
    description: 'Reflecting on life events with ancestral wisdom perspective',
    traditionalElements: [
      'Journal',
      'Photos or mementos',
      'Quiet reflection time',
    ],
    protocol: [
      'Review recent events or life periods',
      'Consider: What would my ancestors want me to learn from this?',
      'Identify patterns or lessons',
      'Honor growth and resilience',
      'Release what no longer serves',
    ],
    frequency: 'monthly',
    privacyLevel: 'private',
  },
};

// ============================================================================
// FAMILY HISTORY TRACKING
// ============================================================================

/**
 * Framework for tracking family health history and patterns
 * Important for medical care and understanding inherited conditions
 */

export interface FamilyHealthHistory {
  ancestorId: string;
  conditions: string[];
  medications: string[];
  lifespan: number | null;
  causeOfDeath?: string;
  resilience: string[]; // What they survived, overcame
  wisdom: string[]; // Health wisdom they passed down
  encrypted: true;
}

/**
 * Family health wisdom tracking
 */
export const FAMILY_HEALTH_WISDOM_TEMPLATE = {
  source: '', // Which ancestor
  wisdom: '', // The health advice/practice
  category: '', // e.g., 'nutrition', 'mental health', 'herbal remedy'
  stillPractice: false, // Do you still use this wisdom?
  effectiveness: null as number | null, // 1-5 rating if you use it
};

// ============================================================================
// SAFETY PROTOCOLS
// ============================================================================

/**
 * Clear boundaries for ancestral work
 */
export const SAFETY_PROTOCOLS = {
  mentalHealth: {
    boundary: 'Spiritual guidance supports but never replaces therapy',
    warning: 'If experiencing mental health crisis, contact professional help immediately',
    resources: [
      '988 - Suicide & Crisis Lifeline',
      'NAMI Helpline: 1-800-950-NAMI',
      'Crisis Text Line: Text HOME to 741741',
    ],
  },

  spiritualBoundaries: {
    consent: 'Only work with ancestors who present with love and positive intention',
    discernment: 'Trust your intuition - if it feels wrong, stop',
    grounding: 'Always ground and close spiritual work properly',
    protection: 'Use protection practices (prayers, salt, cleansing)',
  },

  privacy: {
    encryption: 'All ancestral data encrypted at rest',
    storage: 'Local device only, never cloud sync',
    sharing: 'User controls all data, zero third-party access',
    deletion: 'User can delete all ancestral data at any time',
  },
};

// ============================================================================
// EXPORT HELPERS
// ============================================================================

export function getHoodooPractice(practiceId: string): AncestralPractice | undefined {
  return HOODOO_PRACTICES[practiceId];
}

export function getAllHoodooPractices(): AncestralPractice[] {
  return Object.values(HOODOO_PRACTICES);
}

export function getSpiritualWellnessPractices(): AncestralPractice[] {
  return Object.values(SPIRITUAL_WELLNESS_PRACTICES);
}

export function getAllPractices(): AncestralPractice[] {
  return [...getAllHoodooPractices(), ...getSpiritualWellnessPractices()];
}

// Summary for debugging
console.log('🕊️ Ancestral Guide Framework Loaded');
console.log('Hoodoo Practices:', Object.keys(HOODOO_PRACTICES).length);
console.log('Spiritual Wellness:', Object.keys(SPIRITUAL_WELLNESS_PRACTICES).length);
console.log('Privacy: Encrypted, Local-Only, User-Controlled');
