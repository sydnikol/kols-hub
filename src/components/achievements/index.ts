// Achievement System exports
// Comprehensive achievements, rewards, and gamification components

// Main achievement system (existing)
export { AchievementSystem, default } from './AchievementSystem';

// Achievement Panel - Grid view with filters and progress
export { AchievementPanel } from './AchievementPanel';

// Achievement Popup - Toast notifications on unlock
export { AchievementPopup } from './AchievementPopup';

// Rewards Shop - Spend points on items
export { RewardsShop } from './RewardsShop';

// Re-export types from data and service
export type {
  Achievement,
  AchievementRarity,
  AchievementCategory,
} from '../../data/achievements';

export {
  allAchievements,
  achievementCategories,
  rarityInfo,
  totalPossiblePoints,
  explorationAchievements,
  minigamesAchievements,
  socialAchievements,
  petsAchievements,
  wardrobeAchievements,
  historyAchievements,
  secretAchievements,
  revealedSecrets,
} from '../../data/achievements';

export type {
  AchievementProgress,
  UserAchievementState,
  AchievementEvent,
  AchievementEventListener,
} from '../../services/AchievementService';

export {
  achievementService,
} from '../../services/AchievementService';
