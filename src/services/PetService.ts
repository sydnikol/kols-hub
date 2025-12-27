// Pet Service - Core pet logic with localStorage persistence
// Handles all pet state management, interactions, and stat decay

export interface Pet {
  id: string;
  name: string;
  species: string;
  emoji: string;
  stats: {
    hunger: number;      // 0-100, decreases over time
    energy: number;      // 0-100, decreases when playing
    happiness: number;   // 0-100, affected by care
    bond: number;        // 0-100, increases with interaction
  };
  mood: string;          // Derived from stats
  lastFed: number;       // timestamp
  lastPlayed: number;    // timestamp
  lastRested: number;    // timestamp
  lastGroomed: number;   // timestamp
  createdAt: number;
}

export interface PetActionResult {
  pet: Pet;
  message: string;
  statChanges: {
    hunger?: number;
    energy?: number;
    happiness?: number;
    bond?: number;
  };
}

const STORAGE_KEY = 'pet_sanctuary_pets';

// Stat decay rates (per hour)
const DECAY_RATES = {
  hunger: 5,      // Decreases 5% per hour
  energy: 3,      // Decreases 3% per hour
  happiness: 2,   // Decreases 2% per hour
};

// Action effects
const ACTION_EFFECTS = {
  feed: { hunger: 30, energy: -10 },
  play: { happiness: 20, bond: 5, energy: -15 },
  rest: { energy: 40 },
  groom: { bond: 10, happiness: 5 },
};

// Mood thresholds and messages
const MOOD_CONFIG = {
  thresholds: {
    critical: 20,
    low: 40,
    medium: 60,
    high: 80,
  },
  messages: {
    starving: { mood: 'Starving', emoji: '😫' },
    hungry: { mood: 'Hungry', emoji: '🍽️' },
    exhausted: { mood: 'Exhausted', emoji: '😴' },
    tired: { mood: 'Tired', emoji: '😪' },
    sad: { mood: 'Sad', emoji: '😢' },
    content: { mood: 'Content', emoji: '😊' },
    happy: { mood: 'Happy', emoji: '😄' },
    ecstatic: { mood: 'Ecstatic', emoji: '🤩' },
    loving: { mood: 'Loving', emoji: '💕' },
  },
};

// Calculate mood based on stats
export function calculateMood(stats: Pet['stats']): string {
  const { hunger, energy, happiness, bond } = stats;

  // Critical conditions take priority
  if (hunger < MOOD_CONFIG.thresholds.critical) return 'Starving';
  if (energy < MOOD_CONFIG.thresholds.critical) return 'Exhausted';
  if (happiness < MOOD_CONFIG.thresholds.critical) return 'Sad';

  // Low conditions
  if (hunger < MOOD_CONFIG.thresholds.low) return 'Hungry';
  if (energy < MOOD_CONFIG.thresholds.low) return 'Tired';

  // High bond + happiness = loving
  if (bond > MOOD_CONFIG.thresholds.high && happiness > MOOD_CONFIG.thresholds.high) {
    return 'Loving';
  }

  // Very happy
  if (happiness > MOOD_CONFIG.thresholds.high && energy > MOOD_CONFIG.thresholds.medium) {
    return 'Ecstatic';
  }

  // Good overall stats
  if (hunger > MOOD_CONFIG.thresholds.medium &&
      energy > MOOD_CONFIG.thresholds.medium &&
      happiness > MOOD_CONFIG.thresholds.medium) {
    return 'Happy';
  }

  return 'Content';
}

// Get mood emoji
export function getMoodEmoji(mood: string): string {
  const moodEntry = Object.entries(MOOD_CONFIG.messages).find(([, value]) => value.mood === mood);
  return moodEntry ? moodEntry[1].emoji : '😊';
}

// Get all pets from localStorage
export function getPets(): Pet[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Pet[];
  } catch (error) {
    console.error('Error loading pets:', error);
    return [];
  }
}

// Save pets to localStorage
export function savePets(pets: Pet[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  } catch (error) {
    console.error('Error saving pets:', error);
  }
}

// Get a single pet by ID
export function getPetById(petId: string): Pet | undefined {
  const pets = getPets();
  return pets.find(p => p.id === petId);
}

// Update a single pet
function updatePet(pet: Pet): Pet {
  const pets = getPets();
  const index = pets.findIndex(p => p.id === pet.id);
  if (index >= 0) {
    pets[index] = pet;
    savePets(pets);
  }
  return pet;
}

// Clamp a value between 0 and 100
function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

// Apply stat decay based on time elapsed
export function applyStatDecay(pet: Pet): Pet {
  const now = Date.now();

  // Calculate hours since last interactions
  const hoursSinceLastFed = (now - pet.lastFed) / (1000 * 60 * 60);
  const hoursSinceLastPlayed = (now - pet.lastPlayed) / (1000 * 60 * 60);
  const hoursSinceLastRested = (now - pet.lastRested) / (1000 * 60 * 60);

  // Apply decay
  const newStats = { ...pet.stats };

  // Hunger decays based on time since last fed
  newStats.hunger = clamp(100 - (hoursSinceLastFed * DECAY_RATES.hunger));

  // Energy decays based on time since last rested
  newStats.energy = clamp(100 - (hoursSinceLastRested * DECAY_RATES.energy));

  // Happiness decays based on time since last played/groomed
  const hoursSinceInteraction = Math.min(hoursSinceLastPlayed, (now - pet.lastGroomed) / (1000 * 60 * 60));
  newStats.happiness = clamp(100 - (hoursSinceInteraction * DECAY_RATES.happiness));

  // Bond doesn't decay, it's permanent progress

  // Update mood based on new stats
  const newMood = calculateMood(newStats);

  return {
    ...pet,
    stats: newStats,
    mood: newMood,
  };
}

// Update all pets' stats (call periodically)
export function updateAllPetStats(): Pet[] {
  const pets = getPets();
  const updatedPets = pets.map(pet => applyStatDecay(pet));
  savePets(updatedPets);
  return updatedPets;
}

// Feed a pet
export function feedPet(petId: string): PetActionResult | null {
  const pet = getPetById(petId);
  if (!pet) return null;

  const now = Date.now();
  const statChanges = {
    hunger: ACTION_EFFECTS.feed.hunger,
    energy: ACTION_EFFECTS.feed.energy,
  };

  const newStats = {
    ...pet.stats,
    hunger: clamp(pet.stats.hunger + statChanges.hunger),
    energy: clamp(pet.stats.energy + statChanges.energy),
  };

  const updatedPet: Pet = {
    ...pet,
    stats: newStats,
    mood: calculateMood(newStats),
    lastFed: now,
  };

  updatePet(updatedPet);

  const messages = [
    `${pet.name} munches happily!`,
    `${pet.name} gobbles up the food!`,
    `${pet.name}'s tummy is pleased!`,
    `Yum yum! ${pet.name} loves it!`,
    `${pet.name} licks their lips contentedly!`,
  ];

  return {
    pet: updatedPet,
    message: messages[Math.floor(Math.random() * messages.length)],
    statChanges,
  };
}

// Play with a pet
export function playWithPet(petId: string): PetActionResult | null {
  const pet = getPetById(petId);
  if (!pet) return null;

  // Check if pet has enough energy
  if (pet.stats.energy < 15) {
    return {
      pet,
      message: `${pet.name} is too tired to play right now. Let them rest first!`,
      statChanges: {},
    };
  }

  const now = Date.now();
  const statChanges = {
    happiness: ACTION_EFFECTS.play.happiness,
    bond: ACTION_EFFECTS.play.bond,
    energy: ACTION_EFFECTS.play.energy,
  };

  const newStats = {
    ...pet.stats,
    happiness: clamp(pet.stats.happiness + statChanges.happiness),
    bond: clamp(pet.stats.bond + statChanges.bond),
    energy: clamp(pet.stats.energy + statChanges.energy),
  };

  const updatedPet: Pet = {
    ...pet,
    stats: newStats,
    mood: calculateMood(newStats),
    lastPlayed: now,
  };

  updatePet(updatedPet);

  const messages = [
    `${pet.name} bounces around excitedly!`,
    `${pet.name} does a happy dance!`,
    `What fun! ${pet.name} is thrilled!`,
    `${pet.name} plays enthusiastically!`,
    `${pet.name} zooms around with joy!`,
  ];

  return {
    pet: updatedPet,
    message: messages[Math.floor(Math.random() * messages.length)],
    statChanges,
  };
}

// Rest a pet
export function restPet(petId: string): PetActionResult | null {
  const pet = getPetById(petId);
  if (!pet) return null;

  const now = Date.now();
  const statChanges = {
    energy: ACTION_EFFECTS.rest.energy,
  };

  const newStats = {
    ...pet.stats,
    energy: clamp(pet.stats.energy + statChanges.energy),
  };

  const updatedPet: Pet = {
    ...pet,
    stats: newStats,
    mood: calculateMood(newStats),
    lastRested: now,
  };

  updatePet(updatedPet);

  const messages = [
    `${pet.name} curls up for a cozy nap...`,
    `${pet.name} stretches and relaxes.`,
    `Sweet dreams, ${pet.name}...`,
    `${pet.name} snoozes peacefully.`,
    `${pet.name} finds a warm spot to rest.`,
  ];

  return {
    pet: updatedPet,
    message: messages[Math.floor(Math.random() * messages.length)],
    statChanges,
  };
}

// Groom a pet
export function groomPet(petId: string): PetActionResult | null {
  const pet = getPetById(petId);
  if (!pet) return null;

  const now = Date.now();
  const statChanges = {
    bond: ACTION_EFFECTS.groom.bond,
    happiness: ACTION_EFFECTS.groom.happiness,
  };

  const newStats = {
    ...pet.stats,
    bond: clamp(pet.stats.bond + statChanges.bond),
    happiness: clamp(pet.stats.happiness + statChanges.happiness),
  };

  const updatedPet: Pet = {
    ...pet,
    stats: newStats,
    mood: calculateMood(newStats),
    lastGroomed: now,
  };

  updatePet(updatedPet);

  const messages = [
    `${pet.name} looks fabulous!`,
    `${pet.name} purrs with contentment!`,
    `So shiny! ${pet.name} appreciates the care!`,
    `${pet.name} feels pampered and loved!`,
    `${pet.name} sparkles after grooming!`,
  ];

  return {
    pet: updatedPet,
    message: messages[Math.floor(Math.random() * messages.length)],
    statChanges,
  };
}

// Adopt a new pet
export function adoptPet(species: string, name: string, emoji: string): Pet {
  const now = Date.now();

  const newPet: Pet = {
    id: `pet-${now}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    species,
    emoji,
    stats: {
      hunger: 80,
      energy: 80,
      happiness: 90,
      bond: 10,
    },
    mood: 'Happy',
    lastFed: now,
    lastPlayed: now,
    lastRested: now,
    lastGroomed: now,
    createdAt: now,
  };

  const pets = getPets();
  pets.push(newPet);
  savePets(pets);

  return newPet;
}

// Remove a pet
export function removePet(petId: string): boolean {
  const pets = getPets();
  const filteredPets = pets.filter(p => p.id !== petId);
  if (filteredPets.length < pets.length) {
    savePets(filteredPets);
    return true;
  }
  return false;
}

// Initialize with default pets if none exist
export function initializeDefaultPets(): Pet[] {
  const existingPets = getPets();
  if (existingPets.length > 0) {
    return updateAllPetStats();
  }

  const now = Date.now();
  const defaultPets: Pet[] = [
    {
      id: 'pet-default-1',
      name: 'Luna',
      species: 'Shadow Cat',
      emoji: '🐱',
      stats: { hunger: 60, energy: 75, happiness: 90, bond: 85 },
      mood: 'Happy',
      lastFed: now - (2 * 60 * 60 * 1000), // 2 hours ago
      lastPlayed: now - (1 * 60 * 60 * 1000), // 1 hour ago
      lastRested: now - (3 * 60 * 60 * 1000), // 3 hours ago
      lastGroomed: now - (4 * 60 * 60 * 1000), // 4 hours ago
      createdAt: now - (7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
    {
      id: 'pet-default-2',
      name: 'Merlin',
      species: 'Mystic Owl',
      emoji: '🦉',
      stats: { hunger: 80, energy: 45, happiness: 85, bond: 92 },
      mood: 'Tired',
      lastFed: now - (1 * 60 * 60 * 1000),
      lastPlayed: now - (2 * 60 * 60 * 1000),
      lastRested: now - (5 * 60 * 60 * 1000),
      lastGroomed: now - (2 * 60 * 60 * 1000),
      createdAt: now - (14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
    {
      id: 'pet-default-3',
      name: 'Ember',
      species: 'Spirit Fox',
      emoji: '🦊',
      stats: { hunger: 40, energy: 95, happiness: 88, bond: 70 },
      mood: 'Hungry',
      lastFed: now - (4 * 60 * 60 * 1000),
      lastPlayed: now - (30 * 60 * 1000), // 30 mins ago
      lastRested: now - (1 * 60 * 60 * 1000),
      lastGroomed: now - (3 * 60 * 60 * 1000),
      createdAt: now - (3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];

  savePets(defaultPets);
  return defaultPets;
}

// Get stat color based on value
export function getStatColor(stat: string, value: number): string {
  if (value < 20) return '#ef4444'; // red
  if (value < 40) return '#f97316'; // orange
  if (value < 60) return '#eab308'; // yellow
  if (value < 80) return '#22c55e'; // green
  return '#10b981'; // emerald
}

// Format time since action
export function getTimeSince(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

// Pet species options for adoption
export const AVAILABLE_SPECIES = [
  { species: 'Shadow Cat', emoji: '🐱', description: 'A mysterious feline companion' },
  { species: 'Mystic Owl', emoji: '🦉', description: 'A wise and observant friend' },
  { species: 'Spirit Fox', emoji: '🦊', description: 'A playful trickster' },
  { species: 'Moon Rabbit', emoji: '🐰', description: 'A gentle lunar companion' },
  { species: 'Storm Dragon', emoji: '🐉', description: 'A tiny but mighty dragon' },
  { species: 'Ghost Wolf', emoji: '🐺', description: 'A loyal spectral guardian' },
  { species: 'Crystal Phoenix', emoji: '🐦', description: 'A radiant bird of rebirth' },
  { species: 'Garden Fairy', emoji: '🧚', description: 'A whimsical nature spirit' },
];

export default {
  getPets,
  savePets,
  getPetById,
  feedPet,
  playWithPet,
  restPet,
  groomPet,
  adoptPet,
  removePet,
  calculateMood,
  getMoodEmoji,
  updateAllPetStats,
  applyStatDecay,
  initializeDefaultPets,
  getStatColor,
  getTimeSince,
  AVAILABLE_SPECIES,
};
