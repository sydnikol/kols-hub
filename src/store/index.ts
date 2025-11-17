import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ========================================
// 🖤 KOL HUB - CENTRAL STATE STORE
// ========================================

// Types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  takenToday: boolean[];
  prescriber?: string;
  pharmacy?: string;
  notes?: string;
}

export interface PainEntry {
  id: string;
  date: string;
  level: number; // 0-10
  location: string[];
  triggers?: string;
  relief?: string;
  notes?: string;
}

export interface Vital {
  id: string;
  date: string;
  type: 'bp' | 'hr' | 'temp' | 'o2' | 'weight' | 'glucose';
  value: string;
  notes?: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  energy: 'XS' | 'S' | 'M' | 'L' | 'XL';
  spoons: number;
  triggers?: string;
  notes?: string;
}

export interface OutfitItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  color: string;
  season: string[];
  occasion: string[];
  image?: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  category: 'emergency' | 'medical' | 'support' | 'family' | 'friend';
  phone: string;
  email?: string;
  notes?: string;
}

export interface FeatureIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planned' | 'in-progress' | 'complete';
  effort: 'XS' | 'S' | 'M' | 'L' | 'XL';
  votes: number;
}

// State Interface
interface AppState {
  userName: string;
  avatarId: string;
  medications: Medication[];
  painLog: PainEntry[];
  vitals: Vital[];
  moodLog: MoodEntry[];
  wardrobe: OutfitItem[];
  contacts: Contact[];
  features: FeatureIdea[];
  theme: 'dark' | 'light';
  energyLevel: 'XS' | 'S' | 'M' | 'L' | 'XL';
  
  // Actions
  addMedication: (med: Medication) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  addPainEntry: (entry: PainEntry) => void;
  addVital: (vital: Vital) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addContact: (contact: Contact) => void;
  addFeatureIdea: (feature: FeatureIdea) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setEnergyLevel: (level: 'XS' | 'S' | 'M' | 'L' | 'XL') => void;
  importMedications: (meds: Medication[]) => void;
}

// Create Store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userName: 'Kol',
      avatarId: '68e94e474099d80b93c9b714',
      medications: [],
      painLog: [],
      vitals: [],
      moodLog: [],
      wardrobe: [],
      contacts: [],
      features: [],
      theme: 'dark',
      energyLevel: 'M',

      addMedication: (med) => set((state) => ({
        medications: [...state.medications, med]
      })),
      updateMedication: (id, updates) => set((state) => ({
        medications: state.medications.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        )
      })),
      deleteMedication: (id) => set((state) => ({
        medications: state.medications.filter((m) => m.id !== id)
      })),
      addPainEntry: (entry) => set((state) => ({
        painLog: [...state.painLog, entry]
      })),
      addVital: (vital) => set((state) => ({
        vitals: [...state.vitals, vital]
      })),
      addMoodEntry: (entry) => set((state) => ({
        moodLog: [...state.moodLog, entry]
      })),
      addContact: (contact) => set((state) => ({
        contacts: [...state.contacts, contact]
      })),
      addFeatureIdea: (feature) => set((state) => ({
        features: [...state.features, feature]
      })),
      setTheme: (theme) => set({ theme }),
      setEnergyLevel: (level) => set({ energyLevel: level }),
      importMedications: (meds) => set({ medications: meds })
    }),
    { name: 'kol-hub-storage', storage: createJSONStorage(() => localStorage) }
  )
);
