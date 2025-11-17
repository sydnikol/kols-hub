import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaces
interface Course {
  id: string;
  name: string;
  source: string; // CLEP, DSST, Sophia, etc.
  credits: number;
  completed: boolean;
  completionDate?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  examDate?: string;
}

interface PassiveSession {
  id: string;
  resourceId: string;
  resourceName: string;
  duration: number; // minutes
  completedAt: string;
  type: 'started' | 'completed';
}

interface ResumeData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary?: string;
  education: {
    degree: string;
    credits: number;
    sources: string[];
    recentExams: any[];
  };
  skills: {
    technical: string[];
    soft: string[];
    platforms: string[];
    learning: number;
  };
  experience?: any[];
  certifications?: any[];
  lastUpdated: string;
}

interface EducationState {
  // Energy Management
  energyLevel: 'very-low' | 'low' | 'medium' | 'high';
  setEnergyLevel: (level: 'very-low' | 'low' | 'medium' | 'high') => void;
  
  // Credits
  credits: Course[];
  totalCredits: number;
  completedCourses: number;
  addCredit: (course: Course) => void;
  removeCredit: (id: string) => void;
  updateCredit: (id: string, updates: Partial<Course>) => void;
  
  // Passive Learning
  passiveSessions: PassiveSession[];
  addPassiveSession: (resourceId: string, resourceName: string, type: 'started' | 'completed', duration?: number) => void;
  
  // Resume
  resumeData: ResumeData | null;
  updateResume: (data: Partial<ResumeData>) => void;
  
  // Stats
  todaysLearningMinutes: number;
  weeklyLearningMinutes: number;
  totalLearningHours: number;
  activeGoals: number;
  
  // Goals
  goals: any[];
  addGoal: (goal: any) => void;
  completeGoal: (id: string) => void;
}

export const useEducationStore = create<EducationState>()(
  persist(
    (set, get) => ({
      // Initial State
      energyLevel: 'medium',
      credits: [],
      totalCredits: 0,
      completedCourses: 0,
      passiveSessions: [],
      resumeData: null,
      todaysLearningMinutes: 0,
      weeklyLearningMinutes: 0,
      totalLearningHours: 0,
      activeGoals: 3,
      goals: [
        { id: '1', title: 'Earn first 3 college credits', completed: false },
        { id: '2', title: 'Complete 30 minutes of learning today', completed: false },
        { id: '3', title: 'Try 3 different learning platforms', completed: false }
      ],

      // Energy Management
      setEnergyLevel: (level) => set({ energyLevel: level }),

      // Credits Management
      addCredit: (course) => {
        const newCredits = [...get().credits, course];
        const total = newCredits.filter(c => c.completed).reduce((sum, c) => sum + c.credits, 0);
        const completed = newCredits.filter(c => c.completed).length;
        
        set({
          credits: newCredits,
          totalCredits: total,
          completedCourses: completed
        });
      },

      removeCredit: (id) => {
        const newCredits = get().credits.filter(c => c.id !== id);
        const total = newCredits.filter(c => c.completed).reduce((sum, c) => sum + c.credits, 0);
        const completed = newCredits.filter(c => c.completed).length;
        
        set({
          credits: newCredits,
          totalCredits: total,
          completedCourses: completed
        });
      },

      updateCredit: (id, updates) => {
        const newCredits = get().credits.map(c => 
          c.id === id ? { ...c, ...updates } : c
        );
        const total = newCredits.filter(c => c.completed).reduce((sum, c) => sum + c.credits, 0);
        const completed = newCredits.filter(c => c.completed).length;
        
        set({
          credits: newCredits,
          totalCredits: total,
          completedCourses: completed
        });
      },

      // Passive Learning
      addPassiveSession: (resourceId, resourceName, type, duration = 0) => {
        const session: PassiveSession = {
          id: Date.now().toString(),
          resourceId,
          resourceName,
          duration,
          completedAt: new Date().toISOString(),
          type
        };
        
        const newSessions = [...get().passiveSessions, session];
        
        // Calculate stats
        const today = new Date().toDateString();
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);
        
        const todayMinutes = newSessions
          .filter(s => s.type === 'completed' && new Date(s.completedAt).toDateString() === today)
          .reduce((sum, s) => sum + s.duration, 0);
        
        const weekMinutes = newSessions
          .filter(s => s.type === 'completed' && new Date(s.completedAt) >= thisWeek)
          .reduce((sum, s) => sum + s.duration, 0);
        
        const totalHours = newSessions
          .filter(s => s.type === 'completed')
          .reduce((sum, s) => sum + s.duration, 0) / 60;
        
        set({
          passiveSessions: newSessions,
          todaysLearningMinutes: todayMinutes,
          weeklyLearningMinutes: weekMinutes,
          totalLearningHours: Math.round(totalHours * 10) / 10
        });
      },

      // Resume Management
      updateResume: (data) => {
        set({
          resumeData: {
            ...get().resumeData,
            ...data,
            lastUpdated: new Date().toISOString()
          } as ResumeData
        });
      },

      // Goals
      addGoal: (goal) => {
        set({
          goals: [...get().goals, goal],
          activeGoals: get().activeGoals + 1
        });
      },

      completeGoal: (id) => {
        const updatedGoals = get().goals.map(g =>
          g.id === id ? { ...g, completed: true } : g
        );
        const active = updatedGoals.filter(g => !g.completed).length;
        
        set({
          goals: updatedGoals,
          activeGoals: active
        });
      }
    }),
    {
      name: 'education-storage',
      version: 2
    }
  )
);
