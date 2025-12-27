// Achievement Service
// Comprehensive achievement tracking, progress management, and reward distribution

import {
  Achievement,
  AchievementCategory,
  AchievementRarity,
  allAchievements,
  achievementCategories,
  rarityInfo,
  revealedSecrets,
  totalPossiblePoints,
} from '../data/achievements';

// ==========================================
// Types & Interfaces
// ==========================================

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt?: number;
  claimed: boolean;
}

export interface UserAchievementState {
  totalPoints: number;
  level: number;
  achievements: Record<string, AchievementProgress>;
  recentUnlocks: string[];
  streakDays: number;
  lastLoginDate: string;
  roomVisits: Record<string, number>;
  gameStats: {
    gamesPlayed: number;
    gamesWon: number;
    highScores: Record<string, number>;
    totalPlayTime: number;
  };
  socialStats: {
    friendsCount: number;
    messagesSent: number;
    giftsGiven: number;
    designsShared: number;
    likesReceived: number;
  };
  petStats: {
    petsOwned: string[];
    treatsGiven: number;
    eggsHatched: number;
    maxBondPets: string[];
  };
  wardrobeStats: {
    outfitsSaved: number;
    itemsOwned: number;
    outfitChanges: number;
  };
  historyStats: {
    figuresMet: string[];
    lessonsCompleted: number;
    documentsRead: number;
  };
  claimedRewards: string[];
}

export interface AchievementEvent {
  type: 'unlock' | 'progress' | 'claim';
  achievementId: string;
  progress?: number;
  points?: number;
  timestamp: number;
}

export type AchievementEventListener = (event: AchievementEvent) => void;

// ==========================================
// Storage Keys
// ==========================================

const STORAGE_KEY = 'gothic_achievements_state';
const EVENTS_KEY = 'gothic_achievement_events';

// ==========================================
// Default State
// ==========================================

const createDefaultState = (): UserAchievementState => ({
  totalPoints: 0,
  level: 1,
  achievements: {},
  recentUnlocks: [],
  streakDays: 0,
  lastLoginDate: '',
  roomVisits: {},
  gameStats: {
    gamesPlayed: 0,
    gamesWon: 0,
    highScores: {},
    totalPlayTime: 0,
  },
  socialStats: {
    friendsCount: 0,
    messagesSent: 0,
    giftsGiven: 0,
    designsShared: 0,
    likesReceived: 0,
  },
  petStats: {
    petsOwned: [],
    treatsGiven: 0,
    eggsHatched: 0,
    maxBondPets: [],
  },
  wardrobeStats: {
    outfitsSaved: 0,
    itemsOwned: 0,
    outfitChanges: 0,
  },
  historyStats: {
    figuresMet: [],
    lessonsCompleted: 0,
    documentsRead: 0,
  },
  claimedRewards: [],
});

// ==========================================
// Achievement Service Class
// ==========================================

class AchievementService {
  private state: UserAchievementState;
  private listeners: AchievementEventListener[] = [];
  private achievements: Map<string, Achievement>;
  private initialized: boolean = false;

  constructor() {
    this.state = createDefaultState();
    this.achievements = new Map(allAchievements.map(a => [a.id, a]));
  }

  // ==========================================
  // Initialization & Persistence
  // ==========================================

  initialize(): void {
    if (this.initialized) return;
    this.loadState();
    this.checkDailyLogin();
    this.initialized = true;
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...createDefaultState(), ...parsed };
      }
    } catch (error) {
      console.error('Failed to load achievement state:', error);
      this.state = createDefaultState();
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save achievement state:', error);
    }
  }

  private saveEvent(event: AchievementEvent): void {
    try {
      const events = this.getEvents();
      events.push(event);
      // Keep only last 100 events
      const trimmed = events.slice(-100);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save achievement event:', error);
    }
  }

  getEvents(): AchievementEvent[] {
    try {
      const saved = localStorage.getItem(EVENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // ==========================================
  // Event System
  // ==========================================

  subscribe(listener: AchievementEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: AchievementEvent): void {
    this.saveEvent(event);
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Achievement listener error:', error);
      }
    });
  }

  // ==========================================
  // Progress Tracking
  // ==========================================

  updateProgress(achievementId: string, progress: number): boolean {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return false;

    let achievementProgress = this.state.achievements[achievementId];
    if (!achievementProgress) {
      achievementProgress = {
        achievementId,
        currentProgress: 0,
        unlocked: false,
        claimed: false,
      };
      this.state.achievements[achievementId] = achievementProgress;
    }

    if (achievementProgress.unlocked) return false;

    achievementProgress.currentProgress = progress;

    const maxProgress = achievement.maxProgress || 1;
    if (progress >= maxProgress) {
      return this.unlockAchievement(achievementId);
    }

    this.emit({
      type: 'progress',
      achievementId,
      progress,
      timestamp: Date.now(),
    });

    this.saveState();
    return false;
  }

  incrementProgress(achievementId: string, amount: number = 1): boolean {
    const current = this.getProgress(achievementId);
    return this.updateProgress(achievementId, current + amount);
  }

  getProgress(achievementId: string): number {
    return this.state.achievements[achievementId]?.currentProgress || 0;
  }

  // ==========================================
  // Achievement Unlocking
  // ==========================================

  unlockAchievement(achievementId: string): boolean {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return false;

    let achievementProgress = this.state.achievements[achievementId];
    if (!achievementProgress) {
      achievementProgress = {
        achievementId,
        currentProgress: achievement.maxProgress || 1,
        unlocked: false,
        claimed: false,
      };
      this.state.achievements[achievementId] = achievementProgress;
    }

    if (achievementProgress.unlocked) return false;

    // Unlock the achievement
    achievementProgress.unlocked = true;
    achievementProgress.unlockedAt = Date.now();
    achievementProgress.currentProgress = achievement.maxProgress || 1;

    // Add to recent unlocks
    this.state.recentUnlocks = [achievementId, ...this.state.recentUnlocks].slice(0, 10);

    // Award points
    this.state.totalPoints += achievement.points;
    this.updateLevel();

    this.emit({
      type: 'unlock',
      achievementId,
      points: achievement.points,
      timestamp: Date.now(),
    });

    this.saveState();

    // Check for category completion
    this.checkCategoryCompletion(achievement.category);

    return true;
  }

  isUnlocked(achievementId: string): boolean {
    return this.state.achievements[achievementId]?.unlocked || false;
  }

  // ==========================================
  // Reward System
  // ==========================================

  claimReward(achievementId: string): boolean {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return false;

    const progress = this.state.achievements[achievementId];
    if (!progress?.unlocked || progress.claimed) return false;
    if (!achievement.reward) return false;

    progress.claimed = true;
    this.state.claimedRewards.push(`${achievement.reward.type}:${achievement.reward.value}`);

    this.emit({
      type: 'claim',
      achievementId,
      timestamp: Date.now(),
    });

    this.saveState();
    return true;
  }

  hasClaimedReward(achievementId: string): boolean {
    return this.state.achievements[achievementId]?.claimed || false;
  }

  getClaimedRewards(): string[] {
    return [...this.state.claimedRewards];
  }

  // ==========================================
  // Level System
  // ==========================================

  private updateLevel(): void {
    // Level formula: level = floor(sqrt(totalPoints / 100)) + 1
    const newLevel = Math.floor(Math.sqrt(this.state.totalPoints / 100)) + 1;
    this.state.level = newLevel;
  }

  getLevel(): number {
    return this.state.level;
  }

  getPointsToNextLevel(): number {
    const nextLevel = this.state.level + 1;
    const requiredPoints = Math.pow(nextLevel - 1, 2) * 100;
    return Math.max(0, requiredPoints - this.state.totalPoints);
  }

  getLevelProgress(): number {
    const currentLevelPoints = Math.pow(this.state.level - 1, 2) * 100;
    const nextLevelPoints = Math.pow(this.state.level, 2) * 100;
    const progressPoints = this.state.totalPoints - currentLevelPoints;
    const levelRange = nextLevelPoints - currentLevelPoints;
    return (progressPoints / levelRange) * 100;
  }

  // ==========================================
  // Statistics & Queries
  // ==========================================

  getTotalPoints(): number {
    return this.state.totalPoints;
  }

  getUnlockedCount(): number {
    return Object.values(this.state.achievements).filter(a => a.unlocked).length;
  }

  getTotalCount(): number {
    return allAchievements.length;
  }

  getCompletionPercentage(): number {
    return (this.getUnlockedCount() / this.getTotalCount()) * 100;
  }

  getRecentUnlocks(): Achievement[] {
    return this.state.recentUnlocks
      .map(id => this.achievements.get(id))
      .filter((a): a is Achievement => !!a);
  }

  getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return allAchievements.filter(a => a.category === category);
  }

  getCategoryProgress(category: AchievementCategory): { unlocked: number; total: number } {
    const categoryAchievements = this.getAchievementsByCategory(category);
    const unlocked = categoryAchievements.filter(a => this.isUnlocked(a.id)).length;
    return { unlocked, total: categoryAchievements.length };
  }

  getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
    return allAchievements.filter(a => a.rarity === rarity);
  }

  getUnlockedAchievements(): Achievement[] {
    return allAchievements.filter(a => this.isUnlocked(a.id));
  }

  getLockedAchievements(): Achievement[] {
    return allAchievements.filter(a => !this.isUnlocked(a.id));
  }

  getAchievementDetails(achievementId: string): {
    achievement: Achievement;
    progress: AchievementProgress;
    revealed?: { name: string; description: string; icon: React.ElementType };
  } | null {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return null;

    const progress = this.state.achievements[achievementId] || {
      achievementId,
      currentProgress: 0,
      unlocked: false,
      claimed: false,
    };

    const revealed = achievement.secret && progress.unlocked
      ? revealedSecrets[achievementId]
      : undefined;

    return { achievement, progress, revealed };
  }

  // ==========================================
  // Streak System
  // ==========================================

  private checkDailyLogin(): void {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = this.state.lastLoginDate;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLogin === yesterdayStr) {
        this.state.streakDays += 1;
      } else {
        this.state.streakDays = 1;
      }

      this.state.lastLoginDate = today;
      this.saveState();

      // Check streak achievements
      this.checkStreakAchievements();
    }
  }

  private checkStreakAchievements(): void {
    const streak = this.state.streakDays;
    if (streak >= 7) this.unlockAchievement('daily-player');
    if (streak >= 30) this.unlockAchievement('monthly-master');
  }

  getStreakDays(): number {
    return this.state.streakDays;
  }

  // ==========================================
  // Category Completion
  // ==========================================

  private checkCategoryCompletion(category: AchievementCategory): void {
    const { unlocked, total } = this.getCategoryProgress(category);
    if (unlocked === total - 1) {
      // The last achievement in the category is the legend achievement
      const legendAchievements: Record<AchievementCategory, string> = {
        exploration: 'summit-reached',
        minigames: 'game-guru',
        social: 'social-legend',
        pets: 'pet-master',
        wardrobe: 'fashion-legend',
        history: 'history-legend',
        secrets: 'secret-master',
      };
      // Note: Don't auto-unlock legend achievements - they have special conditions
    }
  }

  // ==========================================
  // Specific Tracking Methods
  // ==========================================

  // Room visits
  trackRoomVisit(roomId: string): void {
    this.state.roomVisits[roomId] = (this.state.roomVisits[roomId] || 0) + 1;

    // Check first room visit
    if (Object.keys(this.state.roomVisits).length === 1) {
      this.unlockAchievement('first-steps');
    }

    // Check room explorer (all 16 rooms)
    if (Object.keys(this.state.roomVisits).length >= 16) {
      this.unlockAchievement('room-explorer');
    }

    // Check frequent visitor
    if (this.state.roomVisits[roomId] >= 50) {
      this.unlockAchievement('frequent-visitor');
    }

    // Check time-based achievements
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      if (hour >= 0 && hour < 1) this.unlockAchievement('night-owl');
      if (hour >= 4 && hour < 6) this.unlockAchievement('early-bird');
    }
    if (hour >= 17 && hour < 20) {
      this.unlockAchievement('twilight-wanderer');
    }

    this.saveState();
  }

  // Game stats
  trackGamePlayed(gameId: string, won: boolean, score: number): void {
    this.state.gameStats.gamesPlayed += 1;
    if (won) this.state.gameStats.gamesWon += 1;

    const prevHighScore = this.state.gameStats.highScores[gameId] || 0;
    if (score > prevHighScore) {
      this.state.gameStats.highScores[gameId] = score;
      this.incrementProgress('high-scorer');
    }

    // First victory
    if (won && this.state.gameStats.gamesWon === 1) {
      this.unlockAchievement('first-victory');
    }

    // Memory master
    if (gameId === 'memory-match' && score >= 900) {
      this.unlockAchievement('memory-master');
    }

    this.saveState();
  }

  // Social stats
  trackSocialAction(action: 'friend' | 'message' | 'gift' | 'share' | 'like'): void {
    switch (action) {
      case 'friend':
        this.state.socialStats.friendsCount += 1;
        if (this.state.socialStats.friendsCount === 1) this.unlockAchievement('first-friend');
        if (this.state.socialStats.friendsCount >= 10) this.unlockAchievement('social-butterfly');
        break;
      case 'message':
        this.state.socialStats.messagesSent += 1;
        this.updateProgress('chatterbox', this.state.socialStats.messagesSent);
        break;
      case 'gift':
        this.state.socialStats.giftsGiven += 1;
        this.updateProgress('gift-giver', this.state.socialStats.giftsGiven);
        break;
      case 'share':
        this.state.socialStats.designsShared += 1;
        this.updateProgress('room-designer', this.state.socialStats.designsShared);
        break;
      case 'like':
        this.state.socialStats.likesReceived += 1;
        this.updateProgress('heart-collector', this.state.socialStats.likesReceived);
        break;
    }
    this.saveState();
  }

  // Pet stats
  trackPetAction(action: 'adopt' | 'treat' | 'hatch' | 'maxBond', petType?: string): void {
    switch (action) {
      case 'adopt':
        if (petType && !this.state.petStats.petsOwned.includes(petType)) {
          this.state.petStats.petsOwned.push(petType);
          if (this.state.petStats.petsOwned.length === 1) this.unlockAchievement('pet-parent');
        }
        break;
      case 'treat':
        this.state.petStats.treatsGiven += 1;
        this.updateProgress('treat-master', this.state.petStats.treatsGiven);
        break;
      case 'hatch':
        this.state.petStats.eggsHatched += 1;
        this.updateProgress('egg-hatcher', this.state.petStats.eggsHatched);
        break;
      case 'maxBond':
        if (petType && !this.state.petStats.maxBondPets.includes(petType)) {
          this.state.petStats.maxBondPets.push(petType);
          if (this.state.petStats.maxBondPets.length === 1) this.unlockAchievement('best-friend-forever');
        }
        break;
    }
    this.saveState();
  }

  // Wardrobe stats
  trackWardrobeAction(action: 'save' | 'purchase' | 'change'): void {
    switch (action) {
      case 'save':
        this.state.wardrobeStats.outfitsSaved += 1;
        if (this.state.wardrobeStats.outfitsSaved === 1) this.unlockAchievement('fashion-forward');
        this.updateProgress('style-icon', this.state.wardrobeStats.outfitsSaved);
        break;
      case 'purchase':
        this.state.wardrobeStats.itemsOwned += 1;
        this.updateProgress('shopaholic', this.state.wardrobeStats.itemsOwned);
        break;
      case 'change':
        this.state.wardrobeStats.outfitChanges += 1;
        this.updateProgress('transformation-master', this.state.wardrobeStats.outfitChanges);
        break;
    }
    this.saveState();
  }

  // History stats
  trackHistoryAction(action: 'meet' | 'lesson' | 'document', figureId?: string): void {
    switch (action) {
      case 'meet':
        if (figureId && !this.state.historyStats.figuresMet.includes(figureId)) {
          this.state.historyStats.figuresMet.push(figureId);
          if (this.state.historyStats.figuresMet.length === 1) this.unlockAchievement('first-encounter');
          this.updateProgress('history-buff', this.state.historyStats.figuresMet.length);
        }
        break;
      case 'lesson':
        this.state.historyStats.lessonsCompleted += 1;
        this.updateProgress('scholar', this.state.historyStats.lessonsCompleted);
        break;
      case 'document':
        this.state.historyStats.documentsRead += 1;
        this.updateProgress('library-master', this.state.historyStats.documentsRead);
        break;
    }
    this.saveState();
  }

  // Secret achievements
  checkSecretCondition(secretId: string): boolean {
    // Check various secret conditions
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    switch (secretId) {
      case 'secret-midnight':
        return hour === 3 && minute === 0;
      case 'secret-time':
        // Special date: October 31 (Halloween)
        return now.getMonth() === 9 && now.getDate() === 31;
      default:
        return false;
    }
  }

  triggerSecretAchievement(secretId: string): boolean {
    if (this.isUnlocked(secretId)) return false;
    return this.unlockAchievement(secretId);
  }

  // ==========================================
  // Utility Methods
  // ==========================================

  getAllAchievements(): Achievement[] {
    return allAchievements;
  }

  getCategoryInfo() {
    return achievementCategories;
  }

  getRarityInfo() {
    return rarityInfo;
  }

  getTotalPossiblePoints(): number {
    return totalPossiblePoints;
  }

  getState(): UserAchievementState {
    return { ...this.state };
  }

  resetProgress(): void {
    this.state = createDefaultState();
    this.saveState();
    localStorage.removeItem(EVENTS_KEY);
  }

  // Export/Import for backup
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
          localStorage.setItem(EVENTS_KEY, JSON.stringify(parsed.events));
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const achievementService = new AchievementService();

// Initialize on import
if (typeof window !== 'undefined') {
  achievementService.initialize();
}

export default achievementService;
