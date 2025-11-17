/**
 * 🖤 KOL HUB - Global State Management
 * =====================================
 * Zustand store with persistence for ALL app state
 * Self-evolving with pattern recognition
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../utils/database';
import { ReadyPlayerMeAvatar } from '../types/avatar';
import { saveAvatarsToStorage, setCurrentAvatar as saveCurrentAvatar } from '../utils/avatar-utils';

// ==================== TYPES ====================

interface AppSettings {
  theme: 'gothic_dark' | 'clean_witchy_minimal' | 'grayscale_print';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticFeedback: boolean;
}

interface UserProfile {
  name: string;
  pronouns: string;
  timezone: string;
  readyPlayerMeAvatarId: string;
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    priority: number;
  }[];
}

interface EnergyState {
  currentSpoons: number;
  maxSpoons: number;
  energyMode: 'conserve' | 'moderate' | 'active' | 'recovery';
  lastUpdated: string;
}

interface PatternData {
  mostActiveTime: string;
  averageSpoons: number;
  commonTriggers: string[];
  effectiveCoping: string[];
  medicationAdherence: number;
  healthTrends: Record<string, any>;
}

interface KolHubStore {
  // User & Settings
  settings: AppSettings;
  userProfile: UserProfile;
  energyState: EnergyState;
  
  // Current State
  currentDate: string;
  currentTime: string;
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  
  // AI Companion State
  companionActive: boolean;
  companionMood: 'supportive' | 'curious' | 'playful' | 'serious';
  conversationContext: string[];
  
  // Pattern Recognition
  patterns: PatternData;
  insights: string[];
  
  // Quick Stats (for dashboard)
  stats: {
    healthScore: number;
    tasksCompleted: number;
    medicationsTaken: number;
    energyTrend: 'up' | 'down' | 'stable';
  };
  
  // Actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateEnergyState: (energy: Partial<EnergyState>) => void;
  toggleCompanion: () => void;
  addInsight: (insight: string) => void;
  updateStats: () => Promise<void>;
  logEvolution: (change: string, category: string, trigger: string) => Promise<void>;
  detectPatterns: () => Promise<void>;
  syncData: () => Promise<void>;
}

// ==================== STORE CREATION ====================

export const useKolHubStore = create<KolHubStore>()(
  persist(
    (set, get) => ({
      // Initial State
      settings: {
        theme: 'gothic_dark',
        fontSize: 'medium',
        contrast: 'normal',
        reducedMotion: false,
        notificationsEnabled: true,
        soundEnabled: true,
        hapticFeedback: true,
      },
      
      userProfile: {
        name: 'Kol',
        pronouns: 'they/them',
        timezone: 'America/Chicago',
        readyPlayerMeAvatarId: '68e94e474099d80b93c9b714',
        emergencyContacts: [],
      },
      
      energyState: {
        currentSpoons: 10,
        maxSpoons: 12,
        energyMode: 'moderate',
        lastUpdated: new Date().toISOString(),
      },
      
      currentDate: new Date().toISOString().split('T')[0],
      currentTime: new Date().toLocaleTimeString(),
      isOnline: navigator.onLine,
      syncStatus: 'synced',
      
      companionActive: false,
      companionMood: 'supportive',
      conversationContext: [],
      
      patterns: {
        mostActiveTime: '14:00',
        averageSpoons: 8,
        commonTriggers: [],
        effectiveCoping: [],
        medicationAdherence: 0,
        healthTrends: {},
      },
      
      insights: [],
      
      stats: {
        healthScore: 75,
        tasksCompleted: 0,
        medicationsTaken: 0,
        energyTrend: 'stable',
      },
      
      // Actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
        
        get().logEvolution(
          `Settings updated: ${Object.keys(newSettings).join(', ')}`,
          'settings',
          'user_action'
        );
      },
      
      updateUserProfile: (newProfile) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...newProfile },
        }));
      },
      
      updateEnergyState: (newEnergy) => {
        const state = get();
        const updated = {
          ...state.energyState,
          ...newEnergy,
          lastUpdated: new Date().toISOString(),
        };
        
        set({ energyState: updated });
        
        // Log body weather
        db.bodyWeatherLogs.add({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          painLevel: 0,
          energyLevel: updated.currentSpoons,
          moodLevel: 0,
          anxietyLevel: 0,
          dissociationLevel: 0,
          jointPain: [],
          createdAt: new Date().toISOString(),
        });
        
        get().detectPatterns();
      },
      
      toggleCompanion: () => {
        set((state) => ({
          companionActive: !state.companionActive,
        }));
      },
      
      addInsight: (insight) => {
        set((state) => ({
          insights: [insight, ...state.insights].slice(0, 10),
        }));
        
        db.patternInsights.add({
          detectedAt: new Date().toISOString(),
          pattern: insight,
          category: 'system',
          confidence: 0.8,
        });
      },
      
      updateStats: async () => {
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's tasks
        const tasks = await db.tasks
          .where('dueDate')
          .equals(today)
          .toArray();
        const completedTasks = tasks.filter(t => t.completed).length;
        
        // Get today's medications
        const meds = await db.medications.toArray();
        let takenCount = 0;
        meds.forEach(med => {
          const todayTaken = med.taken.filter(t => t.date === today && t.taken);
          takenCount += todayTaken.length;
        });
        
        // Get energy trend
        const recentLogs = await db.bodyWeatherLogs
          .orderBy('date')
          .reverse()
          .limit(7)
          .toArray();
        
        const avgEnergy = recentLogs.reduce((sum, log) => sum + log.energyLevel, 0) / recentLogs.length;
        const currentEnergy = get().energyState.currentSpoons;
        const trend: 'up' | 'down' | 'stable' = 
          currentEnergy > avgEnergy ? 'up' : 
          currentEnergy < avgEnergy ? 'down' : 
          'stable';
        
        // Calculate health score
        const medAdherence = meds.length > 0 ? (takenCount / (meds.length * 2)) * 100 : 100;
        const energyScore = (currentEnergy / get().energyState.maxSpoons) * 100;
        const healthScore = Math.round((medAdherence + energyScore) / 2);
        
        set({
          stats: {
            healthScore,
            tasksCompleted: completedTasks,
            medicationsTaken: takenCount,
            energyTrend: trend,
          },
        });
      },
      
      logEvolution: async (change, category, trigger) => {
        await db.evolutionLogs.add({
          timestamp: new Date().toISOString(),
          change,
          category,
          trigger,
        });
      },
      
      detectPatterns: async () => {
        // Analyze body weather logs for patterns
        const logs = await db.bodyWeatherLogs
          .orderBy('date')
          .reverse()
          .limit(30)
          .toArray();
        
        if (logs.length < 7) return;
        
        // Find most common active time
        const timeDistribution: Record<string, number> = {};
        logs.forEach(log => {
          const hour = log.time.split(':')[0];
          timeDistribution[hour] = (timeDistribution[hour] || 0) + 1;
        });
        const mostActiveTime = Object.keys(timeDistribution)
          .sort((a, b) => timeDistribution[b] - timeDistribution[a])[0] + ':00';
        
        // Calculate average spoons
        const avgSpoons = Math.round(
          logs.reduce((sum, log) => sum + log.energyLevel, 0) / logs.length
        );
        
        // Find common triggers
        const triggers: Record<string, number> = {};
        logs.forEach(log => {
          log.triggers?.forEach(trigger => {
            triggers[trigger] = (triggers[trigger] || 0) + 1;
          });
        });
        const commonTriggers = Object.keys(triggers)
          .sort((a, b) => triggers[b] - triggers[a])
          .slice(0, 5);
        
        // Find effective coping strategies
        const coping: Record<string, number> = {};
        logs.forEach(log => {
          log.copingStrategies?.forEach(strategy => {
            coping[strategy] = (coping[strategy] || 0) + 1;
          });
        });
        const effectiveCoping = Object.keys(coping)
          .sort((a, b) => coping[b] - coping[a])
          .slice(0, 5);
        
        // Calculate medication adherence
        const meds = await db.medications.toArray();
        let totalDoses = 0;
        let takenDoses = 0;
        meds.forEach(med => {
          totalDoses += med.taken.length;
          takenDoses += med.taken.filter(t => t.taken).length;
        });
        const medicationAdherence = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 100;
        
        set({
          patterns: {
            mostActiveTime,
            averageSpoons: avgSpoons,
            commonTriggers,
            effectiveCoping,
            medicationAdherence: Math.round(medicationAdherence),
            healthTrends: {},
          },
        });
        
        // Generate insights
        if (avgSpoons < 5) {
          get().addInsight('Your energy levels have been low lately. Consider adding more rest breaks.');
        }
        if (medicationAdherence < 80) {
          get().addInsight('Medication adherence could be improved. Would you like to set up reminders?');
        }
        if (commonTriggers.length > 0) {
          get().addInsight(`Pattern detected: ${commonTriggers[0]} appears to be a common trigger for you.`);
        }
      },
      
      syncData: async () => {
        set({ syncStatus: 'syncing' });
        
        try {
          // Update stats
          await get().updateStats();
          
          // Detect patterns
          await get().detectPatterns();
          
          // Log evolution
          await get().logEvolution(
            'Data synchronized',
            'system',
            'auto_sync'
          );
          
          set({ syncStatus: 'synced' });
        } catch (error) {
          console.error('Sync error:', error);
          set({ syncStatus: 'error' });
        }
      },
    }),
    {
      name: 'kolhub-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        userProfile: state.userProfile,
        energyState: state.energyState,
        patterns: state.patterns,
        insights: state.insights,
      }),
    }
  )
);

// Initialize sync on app load
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useKolHubStore.getState().syncData();
  });
  
  window.addEventListener('offline', () => {
    useKolHubStore.setState({ isOnline: false, syncStatus: 'offline' });
  });
  
  // Sync every 5 minutes
  setInterval(() => {
    if (navigator.onLine) {
      useKolHubStore.getState().syncData();
    }
  }, 5 * 60 * 1000);
}

export default useKolHubStore;
