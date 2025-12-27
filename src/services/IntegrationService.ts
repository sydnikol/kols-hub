// Integration Service
// Cross-system triggers, analytics, daily tracking, and onboarding state management

import { achievementService, AchievementEvent } from './AchievementService';

// ==========================================
// Types & Interfaces
// ==========================================

export interface DailyLoginData {
  lastLogin: string;
  consecutiveDays: number;
  totalLogins: number;
  firstLogin: string;
}

export interface FeatureDiscovery {
  featureId: string;
  discoveredAt: number;
  usageCount: number;
  lastUsed: number;
}

export interface UsageAnalytics {
  sessionStart: number;
  sessionDuration: number;
  roomsVisited: string[];
  featuresUsed: string[];
  actionsPerformed: Record<string, number>;
  lastActive: number;
}

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  totalSteps: number;
  stepsCompleted: string[];
  skipped: boolean;
  startedAt?: number;
  completedAt?: number;
}

export interface CrossSystemTrigger {
  sourceSystem: string;
  sourceAction: string;
  targetSystem: string;
  targetAction: string;
  condition?: (data: any) => boolean;
  transform?: (data: any) => any;
}

export interface IntegrationState {
  dailyLogin: DailyLoginData;
  features: Record<string, FeatureDiscovery>;
  analytics: UsageAnalytics;
  onboarding: OnboardingState;
  preferences: Record<string, any>;
}

export type IntegrationEventType =
  | 'login'
  | 'feature_discovered'
  | 'feature_used'
  | 'room_visited'
  | 'action_performed'
  | 'onboarding_step'
  | 'onboarding_complete'
  | 'cross_trigger';

export interface IntegrationEvent {
  type: IntegrationEventType;
  data: any;
  timestamp: number;
}

export type IntegrationEventListener = (event: IntegrationEvent) => void;

// ==========================================
// Storage Keys
// ==========================================

const STORAGE_KEYS = {
  STATE: 'gothic_integration_state',
  EVENTS: 'gothic_integration_events',
  SESSION: 'gothic_current_session',
};

// ==========================================
// Default State
// ==========================================

const createDefaultState = (): IntegrationState => ({
  dailyLogin: {
    lastLogin: '',
    consecutiveDays: 0,
    totalLogins: 0,
    firstLogin: '',
  },
  features: {},
  analytics: {
    sessionStart: Date.now(),
    sessionDuration: 0,
    roomsVisited: [],
    featuresUsed: [],
    actionsPerformed: {},
    lastActive: Date.now(),
  },
  onboarding: {
    completed: false,
    currentStep: 0,
    totalSteps: 8,
    stepsCompleted: [],
    skipped: false,
  },
  preferences: {},
});

// ==========================================
// Onboarding Steps
// ==========================================

export const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to the Gothic Dollhouse',
    description: 'Your personal sanctuary awaits. Let me show you around.',
  },
  {
    id: 'navigation',
    title: 'Navigate the Mansion',
    description: 'Use the sidebar to explore 16 unique rooms across 4 floors.',
  },
  {
    id: 'pet',
    title: 'Meet Your Companion',
    description: 'Adopt a pet companion who will accompany you on your journey.',
  },
  {
    id: 'mood',
    title: 'Check In Daily',
    description: 'Track your mood and receive personalized affirmations.',
  },
  {
    id: 'achievements',
    title: 'Unlock Achievements',
    description: 'Explore and interact to earn points and unlock rewards.',
  },
  {
    id: 'customize',
    title: 'Personalize Your Space',
    description: 'Adjust themes, accessibility settings, and more.',
  },
  {
    id: 'wellness',
    title: 'Wellness Features',
    description: 'Discover meditation, journaling, and self-care tools.',
  },
  {
    id: 'ready',
    title: 'You\'re Ready!',
    description: 'The mansion is yours to explore. Enjoy your stay.',
  },
];

// ==========================================
// Cross-System Triggers
// ==========================================

const crossSystemTriggers: CrossSystemTrigger[] = [
  // Cooking triggers achievement
  {
    sourceSystem: 'kitchen',
    sourceAction: 'recipe_completed',
    targetSystem: 'achievements',
    targetAction: 'increment_cooking',
    transform: (data) => ({ count: data.recipeCount }),
  },
  // Reading triggers achievement
  {
    sourceSystem: 'library',
    sourceAction: 'book_read',
    targetSystem: 'achievements',
    targetAction: 'increment_reading',
    transform: (data) => ({ bookId: data.bookId }),
  },
  // Game win triggers achievement
  {
    sourceSystem: 'gaming',
    sourceAction: 'game_won',
    targetSystem: 'achievements',
    targetAction: 'track_game',
    transform: (data) => ({ gameId: data.gameId, score: data.score }),
  },
  // Pet interaction triggers achievement
  {
    sourceSystem: 'pets',
    sourceAction: 'pet_fed',
    targetSystem: 'achievements',
    targetAction: 'track_pet_care',
    transform: (data) => ({ petId: data.petId, action: 'feed' }),
  },
  // Outfit saved triggers achievement
  {
    sourceSystem: 'wardrobe',
    sourceAction: 'outfit_saved',
    targetSystem: 'achievements',
    targetAction: 'track_wardrobe',
    transform: (data) => ({ outfitId: data.outfitId }),
  },
  // Oracle reading triggers achievement
  {
    sourceSystem: 'oracle',
    sourceAction: 'reading_complete',
    targetSystem: 'achievements',
    targetAction: 'track_oracle',
    transform: (data) => ({ readingType: data.type }),
  },
  // Journal entry triggers achievement
  {
    sourceSystem: 'journal',
    sourceAction: 'entry_created',
    targetSystem: 'achievements',
    targetAction: 'track_journal',
    transform: (data) => ({ entryId: data.entryId }),
  },
  // Mood check-in triggers wellness
  {
    sourceSystem: 'dashboard',
    sourceAction: 'mood_checked_in',
    targetSystem: 'wellness',
    targetAction: 'record_mood',
    transform: (data) => ({ mood: data.mood, timestamp: data.timestamp }),
  },
];

// ==========================================
// Integration Service Class
// ==========================================

class IntegrationService {
  private state: IntegrationState;
  private listeners: IntegrationEventListener[] = [];
  private sessionInterval: number | null = null;
  private initialized: boolean = false;

  constructor() {
    this.state = createDefaultState();
  }

  // ==========================================
  // Initialization
  // ==========================================

  initialize(): void {
    if (this.initialized) return;

    this.loadState();
    this.handleDailyLogin();
    this.startSessionTracking();
    this.setupAchievementListener();
    this.initialized = true;

    console.log('[IntegrationService] Initialized');
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...createDefaultState(), ...parsed };
      }
    } catch (error) {
      console.error('Failed to load integration state:', error);
      this.state = createDefaultState();
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save integration state:', error);
    }
  }

  // ==========================================
  // Daily Login Tracking
  // ==========================================

  private handleDailyLogin(): void {
    const today = new Date().toISOString().split('T')[0];
    const { lastLogin, consecutiveDays, totalLogins, firstLogin } = this.state.dailyLogin;

    if (lastLogin === today) {
      // Already logged in today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const newConsecutiveDays = lastLogin === yesterdayStr ? consecutiveDays + 1 : 1;

    this.state.dailyLogin = {
      lastLogin: today,
      consecutiveDays: newConsecutiveDays,
      totalLogins: totalLogins + 1,
      firstLogin: firstLogin || today,
    };

    this.saveState();
    this.emit({
      type: 'login',
      data: {
        consecutive: newConsecutiveDays,
        total: totalLogins + 1,
        isFirstLogin: !firstLogin,
      },
      timestamp: Date.now(),
    });

    // Trigger achievements for login streaks
    if (newConsecutiveDays >= 7) {
      achievementService.unlockAchievement('daily-player');
    }
    if (newConsecutiveDays >= 30) {
      achievementService.unlockAchievement('monthly-master');
    }
  }

  getDailyLoginData(): DailyLoginData {
    return { ...this.state.dailyLogin };
  }

  getConsecutiveDays(): number {
    return this.state.dailyLogin.consecutiveDays;
  }

  // ==========================================
  // Session Tracking
  // ==========================================

  private startSessionTracking(): void {
    this.state.analytics.sessionStart = Date.now();
    this.state.analytics.lastActive = Date.now();

    // Update session duration every minute
    this.sessionInterval = window.setInterval(() => {
      this.updateSessionDuration();
    }, 60000);

    // Track page visibility
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.updateSessionDuration();
        } else {
          this.state.analytics.lastActive = Date.now();
        }
      });
    }
  }

  private updateSessionDuration(): void {
    const now = Date.now();
    const elapsed = Math.floor((now - this.state.analytics.sessionStart) / 1000);
    this.state.analytics.sessionDuration = elapsed;
    this.saveState();
  }

  getSessionDuration(): number {
    return this.state.analytics.sessionDuration;
  }

  // ==========================================
  // Feature Discovery
  // ==========================================

  discoverFeature(featureId: string): boolean {
    const existing = this.state.features[featureId];

    if (!existing) {
      this.state.features[featureId] = {
        featureId,
        discoveredAt: Date.now(),
        usageCount: 1,
        lastUsed: Date.now(),
      };

      this.saveState();
      this.emit({
        type: 'feature_discovered',
        data: { featureId },
        timestamp: Date.now(),
      });

      // Check for feature discovery achievements
      const discoveredCount = Object.keys(this.state.features).length;
      if (discoveredCount >= 10) {
        achievementService.unlockAchievement('curious-explorer');
      }
      if (discoveredCount >= 25) {
        achievementService.unlockAchievement('feature-master');
      }

      return true;
    }

    return false;
  }

  useFeature(featureId: string): void {
    if (!this.state.features[featureId]) {
      this.discoverFeature(featureId);
    } else {
      this.state.features[featureId].usageCount += 1;
      this.state.features[featureId].lastUsed = Date.now();
    }

    if (!this.state.analytics.featuresUsed.includes(featureId)) {
      this.state.analytics.featuresUsed.push(featureId);
    }

    this.saveState();
    this.emit({
      type: 'feature_used',
      data: { featureId, usageCount: this.state.features[featureId].usageCount },
      timestamp: Date.now(),
    });
  }

  getFeatureDiscoveryProgress(): { discovered: number; total: number } {
    const discovered = Object.keys(this.state.features).length;
    const total = 50; // Total features in the app
    return { discovered, total };
  }

  getMostUsedFeatures(limit: number = 5): FeatureDiscovery[] {
    return Object.values(this.state.features)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // ==========================================
  // Room Tracking
  // ==========================================

  trackRoomVisit(roomId: string): void {
    if (!this.state.analytics.roomsVisited.includes(roomId)) {
      this.state.analytics.roomsVisited.push(roomId);
    }

    this.performAction('room_visit', { roomId });
    achievementService.trackRoomVisit(roomId);

    this.emit({
      type: 'room_visited',
      data: { roomId, totalRoomsVisited: this.state.analytics.roomsVisited.length },
      timestamp: Date.now(),
    });
  }

  getRoomsVisitedToday(): string[] {
    return [...this.state.analytics.roomsVisited];
  }

  // ==========================================
  // Action Tracking
  // ==========================================

  performAction(actionType: string, data?: any): void {
    const key = actionType;
    this.state.analytics.actionsPerformed[key] =
      (this.state.analytics.actionsPerformed[key] || 0) + 1;
    this.state.analytics.lastActive = Date.now();

    this.saveState();
    this.emit({
      type: 'action_performed',
      data: { actionType, count: this.state.analytics.actionsPerformed[key], ...data },
      timestamp: Date.now(),
    });
  }

  getActionCount(actionType: string): number {
    return this.state.analytics.actionsPerformed[actionType] || 0;
  }

  getTotalActions(): number {
    return Object.values(this.state.analytics.actionsPerformed)
      .reduce((sum, count) => sum + count, 0);
  }

  // ==========================================
  // Onboarding
  // ==========================================

  getOnboardingState(): OnboardingState {
    return { ...this.state.onboarding };
  }

  startOnboarding(): void {
    if (this.state.onboarding.completed) return;

    this.state.onboarding.startedAt = Date.now();
    this.state.onboarding.currentStep = 0;
    this.saveState();
  }

  completeOnboardingStep(stepId: string): boolean {
    if (this.state.onboarding.completed) return false;
    if (this.state.onboarding.stepsCompleted.includes(stepId)) return false;

    this.state.onboarding.stepsCompleted.push(stepId);
    this.state.onboarding.currentStep = this.state.onboarding.stepsCompleted.length;

    this.saveState();
    this.emit({
      type: 'onboarding_step',
      data: { stepId, stepsCompleted: this.state.onboarding.stepsCompleted.length },
      timestamp: Date.now(),
    });

    // Check if onboarding is complete
    if (this.state.onboarding.stepsCompleted.length >= this.state.onboarding.totalSteps) {
      this.finishOnboarding();
    }

    return true;
  }

  finishOnboarding(): void {
    this.state.onboarding.completed = true;
    this.state.onboarding.completedAt = Date.now();
    this.saveState();

    this.emit({
      type: 'onboarding_complete',
      data: {
        skipped: this.state.onboarding.skipped,
        stepsCompleted: this.state.onboarding.stepsCompleted.length,
      },
      timestamp: Date.now(),
    });

    // Award onboarding achievement
    if (!this.state.onboarding.skipped) {
      achievementService.unlockAchievement('welcome-home');
    }
  }

  skipOnboarding(): void {
    this.state.onboarding.skipped = true;
    this.finishOnboarding();
  }

  isOnboardingComplete(): boolean {
    return this.state.onboarding.completed;
  }

  // ==========================================
  // Cross-System Triggers
  // ==========================================

  trigger(sourceSystem: string, sourceAction: string, data?: any): void {
    const matchingTriggers = crossSystemTriggers.filter(
      t => t.sourceSystem === sourceSystem && t.sourceAction === sourceAction
    );

    for (const trigger of matchingTriggers) {
      // Check condition if exists
      if (trigger.condition && !trigger.condition(data)) {
        continue;
      }

      // Transform data if needed
      const transformedData = trigger.transform ? trigger.transform(data) : data;

      // Execute target action
      this.executeTriggerAction(trigger.targetSystem, trigger.targetAction, transformedData);

      this.emit({
        type: 'cross_trigger',
        data: {
          source: `${sourceSystem}:${sourceAction}`,
          target: `${trigger.targetSystem}:${trigger.targetAction}`,
          data: transformedData,
        },
        timestamp: Date.now(),
      });
    }
  }

  private executeTriggerAction(targetSystem: string, targetAction: string, data: any): void {
    // Route to appropriate system
    switch (targetSystem) {
      case 'achievements':
        this.handleAchievementTrigger(targetAction, data);
        break;
      case 'wellness':
        // Could dispatch to wellness system
        console.log('[Integration] Wellness trigger:', targetAction, data);
        break;
      default:
        console.log('[Integration] Unknown target system:', targetSystem);
    }
  }

  private handleAchievementTrigger(action: string, data: any): void {
    switch (action) {
      case 'increment_cooking':
        achievementService.incrementProgress('master-chef', 1);
        break;
      case 'increment_reading':
        achievementService.incrementProgress('bookworm', 1);
        break;
      case 'track_game':
        achievementService.trackGamePlayed(data.gameId, true, data.score);
        break;
      case 'track_pet_care':
        achievementService.trackPetAction('treat');
        break;
      case 'track_wardrobe':
        achievementService.trackWardrobeAction('save');
        break;
      case 'track_oracle':
        achievementService.incrementProgress('fortune-seeker', 1);
        break;
      case 'track_journal':
        achievementService.incrementProgress('diary-keeper', 1);
        break;
    }
  }

  // ==========================================
  // Achievement Listener
  // ==========================================

  private setupAchievementListener(): void {
    achievementService.subscribe((event: AchievementEvent) => {
      if (event.type === 'unlock') {
        this.performAction('achievement_unlocked', { achievementId: event.achievementId });
      }
    });
  }

  // ==========================================
  // Event System
  // ==========================================

  subscribe(listener: IntegrationEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: IntegrationEvent): void {
    this.saveEvent(event);
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Integration listener error:', error);
      }
    });
  }

  private saveEvent(event: IntegrationEvent): void {
    try {
      const events = this.getEvents();
      events.push(event);
      // Keep only last 200 events
      const trimmed = events.slice(-200);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save integration event:', error);
    }
  }

  getEvents(): IntegrationEvent[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // ==========================================
  // Analytics Summary
  // ==========================================

  getAnalyticsSummary(): {
    loginStreak: number;
    totalLogins: number;
    featuresDiscovered: number;
    roomsExplored: number;
    totalActions: number;
    sessionDuration: number;
    onboardingProgress: number;
  } {
    return {
      loginStreak: this.state.dailyLogin.consecutiveDays,
      totalLogins: this.state.dailyLogin.totalLogins,
      featuresDiscovered: Object.keys(this.state.features).length,
      roomsExplored: this.state.analytics.roomsVisited.length,
      totalActions: this.getTotalActions(),
      sessionDuration: this.state.analytics.sessionDuration,
      onboardingProgress: (this.state.onboarding.stepsCompleted.length / this.state.onboarding.totalSteps) * 100,
    };
  }

  // ==========================================
  // Preferences
  // ==========================================

  setPreference(key: string, value: any): void {
    this.state.preferences[key] = value;
    this.saveState();
  }

  getPreference<T>(key: string, defaultValue: T): T {
    return this.state.preferences[key] ?? defaultValue;
  }

  // ==========================================
  // Reset & Export
  // ==========================================

  resetAll(): void {
    this.state = createDefaultState();
    this.saveState();
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
  }

  exportData(): string {
    return JSON.stringify({
      state: this.state,
      events: this.getEvents(),
      version: 1,
    });
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.version && parsed.state) {
        this.state = { ...createDefaultState(), ...parsed.state };
        this.saveState();
        if (parsed.events) {
          localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(parsed.events));
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ==========================================
  // Cleanup
  // ==========================================

  destroy(): void {
    if (this.sessionInterval) {
      clearInterval(this.sessionInterval);
    }
    this.updateSessionDuration();
  }
}

// ==========================================
// Export Singleton
// ==========================================

export const integrationService = new IntegrationService();

// Initialize on import
if (typeof window !== 'undefined') {
  integrationService.initialize();
}

export default integrationService;
