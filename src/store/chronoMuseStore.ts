import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MoodType = 'overwhelm' | 'curiosity' | 'grief' | 'focus' | 'victory' | 'calm';
type ToneModeType = 'soft-academic' | 'playful-bestie' | 'shadow-self' | 'future-twin' | 'ancestor-sage';
type EraType = 'HarlemRenaissance1920' | 'NubiaAncient' | 'EdoJapan' | 'CyberSeoul2088' | 'AfroFuturistAlt' | 'QueerLiberation' | null;

interface NPCCharacter {
  id: string;
  name: string;
  type: 'historical' | 'fictional' | 'ancestral' | 'emotional' | 'educational';
  era?: string;
  personality: string;
  avatar?: string;
}

interface JournalEntry {
  id: string;
  timestamp: Date;
  scene: string;
  lighting: string;
  mood: MoodType;
  music: string;
  insights: string[];
  screenshot?: string;
  avatarLook: string;
  emotionalTags: string[];
  npcDialogue?: string[];
}

interface ChronoMuseState {
  // Core State
  currentMood: MoodType;
  currentToneMode: ToneModeType;
  currentEra: EraType;
  lightingMode: string;
  musicPlaying: string | null;
  energyLevel: number; // 1-10 scale
  
  // User Preferences (Learned Over Time)
  favoriteColors: string[];
  favoriteFonts: string[];
  fashionPresets: string[];
  texturePreferences: string[];
  musicMoods: string[];
  sensoryTriggers: string[];
  lightingPreferences: Record<string, string>;
  
  // Active NPCs
  activeNPCs: NPCCharacter[];
  
  // Journal
  journalEntries: JournalEntry[];
  
  // Cinematic Mode
  cinematicMode: boolean;
  recordingScene: boolean;
  
  // Actions
  setCurrentMood: (mood: MoodType) => void;
  setCurrentToneMode: (mode: ToneModeType) => void;
  setCurrentEra: (era: EraType) => void;
  setLightingMode: (lighting: string) => void;
  setMusicPlaying: (music: string | null) => void;
  setEnergyLevel: (level: number) => void;
  
  addNPC: (npc: NPCCharacter) => void;
  removeNPC: (id: string) => void;
  
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  
  toggleCinematicMode: () => void;
  toggleRecording: () => void;
  
  // AI Learning
  learnPreference: (category: string, value: string) => void;
}

export const useChronoMuseStore = create<ChronoMuseState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentMood: 'calm',
      currentToneMode: 'soft-academic',
      currentEra: null,
      lightingMode: 'velvet-shadows',
      musicPlaying: null,
      energyLevel: 7,
      
      favoriteColors: ['#0A0A0F', '#1A1A24', '#C0C0D8', '#4A5DB8'],
      favoriteFonts: ['gothic-serif', 'silver-script'],
      fashionPresets: ['Sensory Safe Now', 'Academic Goth', 'Afro-futurist Royalty', 'Cyberpunk Witch'],
      texturePreferences: ['velvet', 'matte-black', 'soft-grain'],
      musicMoods: ['jazz', 'piano', 'lofi', 'rain', 'ambient'],
      sensoryTriggers: [],
      lightingPreferences: {
        overwhelm: 'dim-silver-blue',
        curiosity: 'warm-candlelight',
        grief: 'rain-lit-blues',
        focus: 'monochrome-grayscale',
        victory: 'soft-gold-flecks',
        calm: 'velvet-shadows'
      },
      
      activeNPCs: [],
      journalEntries: [],
      cinematicMode: false,
      recordingScene: false,
      
      // Actions Implementation
      setCurrentMood: (mood) => set({ currentMood: mood }),
      setCurrentToneMode: (mode) => set({ currentToneMode: mode }),
      setCurrentEra: (era) => set({ currentEra: era }),
      setLightingMode: (lighting) => set({ lightingMode: lighting }),
      setMusicPlaying: (music) => set({ musicPlaying: music }),
      setEnergyLevel: (level) => set({ energyLevel: Math.max(1, Math.min(10, level)) }),
      
      addNPC: (npc) => set((state) => ({
        activeNPCs: [...state.activeNPCs, npc]
      })),
      
      removeNPC: (id) => set((state) => ({
        activeNPCs: state.activeNPCs.filter(npc => npc.id !== id)
      })),
      
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [
          {
            ...entry,
            id: `entry-${Date.now()}`,
            timestamp: new Date()
          },
          ...state.journalEntries
        ]
      })),
      
      toggleCinematicMode: () => set((state) => ({ cinematicMode: !state.cinematicMode })),
      toggleRecording: () => set((state) => ({ recordingScene: !state.recordingScene })),
      
      learnPreference: (category, value) => set((state) => {
        const categoryKey = `${category}s` as keyof ChronoMuseState;
        const currentPrefs = state[categoryKey];
        
        if (Array.isArray(currentPrefs) && !currentPrefs.includes(value)) {
          return {
            [categoryKey]: [...currentPrefs, value]
          } as Partial<ChronoMuseState>;
        }
        return state;
      })
    }),
    {
      name: 'chronomuse-storage',
      partialize: (state) => ({
        favoriteColors: state.favoriteColors,
        favoriteFonts: state.favoriteFonts,
        fashionPresets: state.fashionPresets,
        texturePreferences: state.texturePreferences,
        musicMoods: state.musicMoods,
        sensoryTriggers: state.sensoryTriggers,
        lightingPreferences: state.lightingPreferences,
        journalEntries: state.journalEntries,
        energyLevel: state.energyLevel
      })
    }
  )
);
