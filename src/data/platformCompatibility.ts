/**
 * Kol's Hub v7.0 - Platform-Feature Compatibility Mapping
 * Defines which features work on which platforms
 */

export type Platform =
  | 'desktop'           // Desktop app (Electron)
  | 'web-online'        // Web browser with internet
  | 'web-offline'       // PWA offline mode
  | 'android'           // Android mobile app
  | 'ios'               // iOS mobile app
  | 'pixel-watch'       // Pixel Watch 2
  | 'google-hub'        // Google Nest Hub
  | 'chromecast';       // Chromecast display

export type PlatformCapability = {
  display: 'large' | 'medium' | 'small' | 'tiny';
  input: ('touch' | 'keyboard' | 'mouse' | 'voice' | 'gestures')[];
  network: 'required' | 'optional' | 'offline';
  sensors?: ('camera' | 'microphone' | 'gps' | 'heartRate' | 'motion')[];
};

// Platform capabilities
export const PLATFORM_CAPABILITIES: Record<Platform, PlatformCapability> = {
  'desktop': {
    display: 'large',
    input: ['keyboard', 'mouse'],
    network: 'optional',
    sensors: ['camera', 'microphone'],
  },
  'web-online': {
    display: 'large',
    input: ['keyboard', 'mouse', 'touch'],
    network: 'required',
    sensors: ['camera', 'microphone'],
  },
  'web-offline': {
    display: 'large',
    input: ['keyboard', 'mouse', 'touch'],
    network: 'offline',
    sensors: [],
  },
  'android': {
    display: 'medium',
    input: ['touch', 'voice'],
    network: 'optional',
    sensors: ['camera', 'microphone', 'gps', 'motion'],
  },
  'ios': {
    display: 'medium',
    input: ['touch', 'voice'],
    network: 'optional',
    sensors: ['camera', 'microphone', 'gps', 'motion'],
  },
  'pixel-watch': {
    display: 'tiny',
    input: ['touch', 'voice'],
    network: 'optional',
    sensors: ['heartRate', 'motion', 'gps'],
  },
  'google-hub': {
    display: 'small',
    input: ['touch', 'voice'],
    network: 'required',
    sensors: ['camera', 'microphone'],
  },
  'chromecast': {
    display: 'large',
    input: ['voice'],
    network: 'required',
    sensors: [],
  },
};

// Feature platform compatibility
export const FEATURE_PLATFORM_MAP: Record<string, Platform[]> = {
  // ============================================================================
  // LIBRARY ROOM FEATURES
  // ============================================================================

  // Education & Learning (works on all platforms with screens)
  'EducationDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'EducationHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'LearningHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'LearningDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'SkillsPortfolio': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'CreditTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'AutoResume': ['desktop', 'web-online', 'android', 'ios'],
  'CourseViewer': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'StudyTimer': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'NoteTaking': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'ResearchLibrary': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Employment & Career
  'EmploymentHub': ['desktop', 'web-online', 'android', 'ios'],
  'MentorshipHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],

  // Reading & Learning Content
  'ReadingHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'PodcastsHub': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],

  // Identity & Self-Discovery
  'IdentityHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // ============================================================================
  // STUDIO ROOM FEATURES
  // ============================================================================

  // Avatar & Customization (requires camera or large display)
  'AvatarCreator': ['desktop', 'web-online', 'android', 'ios'],
  'AvatarProfileManager': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'ReadyPlayerMeAvatar': ['desktop', 'web-online', 'android', 'ios'],
  'ThemeManager': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'CustomThemeCreator': ['desktop', 'web-online', 'android', 'ios'],

  // Music & Creativity
  'CreativityHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'MusicSanctuary': ['desktop', 'web-online', 'android', 'ios', 'google-hub', 'chromecast'],
  'ChronoMuse': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'EmotionalEngine': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'TasteMemory': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Arts & Writing
  'WritingJournal': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'HobbiesHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Media Consumption
  'StreamingHub': ['desktop', 'web-online', 'android', 'ios', 'google-hub', 'chromecast'],

  // ============================================================================
  // SANCTUARY ROOM FEATURES
  // ============================================================================

  // Physical Health Tracking
  'HealthTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'VitalsTracker': ['android', 'ios', 'pixel-watch'],
  'BodyWeatherChart': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'MedicationTrackerV2': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'MedicationDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'MedicationList': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'MedicationStatsDisplay': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'MedicationLog': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'MedicationReminders': ['desktop', 'web-online', 'android', 'ios', 'pixel-watch', 'google-hub'],
  'DoctorVisitPrep': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'MedicalRecords': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'HospitalVisitsLog': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'CareTeamDirectory': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'SymptomTimeline': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'InsuranceTracker': ['desktop', 'web-online', 'android', 'ios'],
  'TelemedicineIntegration': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'MedicalAdvocacyHub': ['desktop', 'web-online', 'android', 'ios'],
  'MedicalPortalsHub': ['desktop', 'web-online', 'android', 'ios'],
  'SodiumTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'HealthLogsHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Mental Health
  'MoodTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'TherapyJournal': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'TherapyHub': ['desktop', 'web-online', 'android', 'ios'],
  'CopingSkillsLibrary': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'TriggerTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'SafetyPlan': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'MentalHealthDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Spiritual & Ancestral (PRIVATE - local devices only)
  'SpiritualReflection': ['desktop', 'web-offline', 'android', 'ios'],
  'AncestorAltarTracker': ['desktop', 'web-offline', 'android', 'ios'],
  'DreamJournal': ['desktop', 'web-offline', 'android', 'ios'],
  'HoodooPracticeJournal': ['desktop', 'web-offline', 'android', 'ios'],
  'SpiritualityHub': ['desktop', 'web-offline', 'android', 'ios'],
  'AncestryHub': ['desktop', 'web-online', 'android', 'ios'],

  // Disability & Accessibility
  'AdaptiveSupportHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'AccessibilitySettings': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'DisabilityAccommodationsHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'SelfAdvocacyHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'CaregiverInfoHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'CaregiverDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],

  // ============================================================================
  // OBSERVATORY ROOM FEATURES
  // ============================================================================

  // Time Travel & Memory
  'TimePortal': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub', 'chromecast'],
  'ChronoJournal': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'HistoricalSceneCreator': ['desktop', 'web-online', 'android', 'ios'],
  'MemoryTimeline': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub', 'chromecast'],
  'HighlightReelCreator': ['desktop', 'web-online', 'android', 'ios'],
  'MemoriesHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub', 'chromecast'],

  // Journaling & Reflection
  'JournalingHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'PersonalNarrativeBuilder': ['desktop', 'web-online', 'android', 'ios'],

  // Cultural & Learning
  'CulturalExploration': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],

  // ============================================================================
  // FINANCE ROOM FEATURES
  // ============================================================================

  // Budgeting & Money Management
  'BudgetManager': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'BudgetingHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'FinanceTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'ExpenseTrackingHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'ExpenseAnalytics': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Savings & Investments
  'SavingsGoalsTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'SavingsGoalsHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'InvestmentsHub': ['desktop', 'web-online', 'android', 'ios'],
  'DebtManagementHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Passive Income
  'PassiveIncomeLibrary': ['desktop', 'web-online', 'android', 'ios'],
  'PassiveIncomeDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Subscriptions & Payments
  'SubscriptionManager': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'PaymentHub': ['desktop', 'web-online', 'android', 'ios'],
  'BillsCalendar': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'FinancialGoalsTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Value Tracking
  'CostPerWearCalculator': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // ============================================================================
  // SOCIAL ROOM FEATURES
  // ============================================================================

  // Community & Relationships
  'SocialConnectionHub': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'Communications': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'CommunityFeatures': ['desktop', 'web-online', 'android', 'ios'],
  'EventsCalendar': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'CommunityActivismOrgs': ['desktop', 'web-online', 'android', 'ios'],
  'MutualAidNetworks': ['desktop', 'web-online', 'android', 'ios'],
  'PartnerCareLog': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'RelationshipTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'LoveLanguageTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Social Activities
  'BoardgameHangouts': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'GiftIdeasTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'ImportantDatesCalendar': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch', 'google-hub'],

  // Advocacy
  'AdvocacyHub': ['desktop', 'web-online', 'android', 'ios'],

  // Accessibility Planning
  'AccessibilityEventPlanning': ['desktop', 'web-online', 'android', 'ios'],
  'OffendOMeter': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // ============================================================================
  // ENTERTAINMENT ROOM FEATURES
  // ============================================================================

  // Gaming
  'GameLibrary': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'chromecast'],
  'GamingHub': ['desktop', 'web-online', 'android', 'ios', 'chromecast'],

  // D&D & Tabletop
  'DnDBeyondHub': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'CharacterSheet': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'DiceRoller': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'SpellBook': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'MonsterManual': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'CampaignManager': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'SessionNotes': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'HomebrewCreator': ['desktop', 'web-online', 'android', 'ios'],
  'InitiativeTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'CombatTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'ItemDatabase': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'InventoryManager': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'MultiplayerManager': ['desktop', 'web-online', 'android', 'ios'],

  // Media & Content
  'MediaPicks': ['desktop', 'web-online', 'android', 'ios', 'google-hub', 'chromecast'],
  'WatchHistory': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Ideas & Fun
  'IdeasLibrary': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // ============================================================================
  // PRODUCTIVITY ROOM FEATURES
  // ============================================================================

  // Task Management
  'TaskManagement': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch', 'google-hub'],
  'LowSpoonTaskLists': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'TimeManagementHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'GoalsHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],

  // Routines & Habits
  'RoutineManager': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'HabitTracking': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'HabitsHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // AI & Automations
  'AILifeManager': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'AIManagerDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'AutomationsScripts': ['desktop', 'web-online', 'android', 'ios'],

  // Google Integration
  'GoogleDriveSync': ['desktop', 'web-online', 'android', 'ios'],
  'GoogleCalendar': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'GoogleKeepNotes': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'GmailIntegration': ['desktop', 'web-online', 'android', 'ios'],
  'GooglePhotosSync': ['desktop', 'web-online', 'android', 'ios', 'chromecast'],

  // Communication
  'VoiceInteraction': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'KolCompanion': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],

  // Integration Hub
  'AppIntegrationsHub': ['desktop', 'web-online', 'android', 'ios'],
  'IntegrationHub': ['desktop', 'web-online', 'android', 'ios'],

  // ============================================================================
  // KITCHEN ROOM FEATURES
  // ============================================================================

  // Food & Nutrition
  'PantryTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'GroceryList': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch', 'google-hub'],
  'MealLogger': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'RecipeLibrary': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'MealPlanner': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'FoodTrends': ['desktop', 'web-online', 'android', 'ios'],
  'NutritionHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'CookingHub': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],

  // ============================================================================
  // WARDROBE ROOM FEATURES
  // ============================================================================

  // Fashion & Closet (requires camera for scanning)
  'WardrobeManager': ['desktop', 'web-online', 'android', 'ios'],
  'AIStylist': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'OutfitPreview': ['desktop', 'web-online', 'android', 'ios', 'google-hub', 'chromecast'],
  'AIPanelReview': ['desktop', 'web-online', 'android', 'ios'],

  // ============================================================================
  // WELLNESS ROOM FEATURES
  // ============================================================================

  // Fitness & Exercise
  'FitnessHub': ['desktop', 'web-online', 'android', 'ios', 'pixel-watch', 'google-hub'],
  'WellnessHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],
  'PixelWatchDashboard': ['pixel-watch'],

  // ============================================================================
  // BEDROOM ROOM FEATURES
  // ============================================================================

  // Sleep & Rest
  'SleepTrackingHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch'],

  // ============================================================================
  // GARDEN ROOM FEATURES
  // ============================================================================

  // Gardening & Nature
  'GardeningHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],

  // ============================================================================
  // WORKSHOP ROOM FEATURES
  // ============================================================================

  // Crafts & DIY
  'ArtProjectsTracker': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'SewingProjects': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Home & Making
  'HomeMaintenanceHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'HomeManagementHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],

  // ============================================================================
  // PORTAL ROOM FEATURES (Central Hub - all platforms)
  // ============================================================================

  // Central Navigation
  'KOLHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'pixel-watch', 'google-hub', 'chromecast'],
  'KOLMasterDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'UnifiedDashboard': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub', 'chromecast'],
  'AllFeaturesHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],

  // Room Navigation
  'RoomNavigator': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],

  // Multi-Device
  'SyncManager': ['desktop', 'web-online', 'android', 'ios'],

  // Cross-Cutting
  'HousingHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios'],
  'TransportationHub': ['desktop', 'web-online', 'android', 'ios', 'google-hub'],
  'TravelHub': ['desktop', 'web-online', 'android', 'ios'],
  'PetCareHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
  'LegalResourcesHub': ['desktop', 'web-online', 'android', 'ios'],
  'EmergencyPrepHub': ['desktop', 'web-online', 'web-offline', 'android', 'ios', 'google-hub'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a feature is available on a specific platform
 */
export function isFeatureAvailableOnPlatform(
  featureName: string,
  platform: Platform
): boolean {
  const platforms = FEATURE_PLATFORM_MAP[featureName];
  if (!platforms) {
    console.warn(`Feature "${featureName}" not found in platform map`);
    return false;
  }
  return platforms.includes(platform);
}

/**
 * Get all platforms that support a feature
 */
export function getPlatformsForFeature(featureName: string): Platform[] {
  return FEATURE_PLATFORM_MAP[featureName] || [];
}

/**
 * Get all features available on a platform
 */
export function getFeaturesForPlatform(platform: Platform): string[] {
  return Object.entries(FEATURE_PLATFORM_MAP)
    .filter(([_, platforms]) => platforms.includes(platform))
    .map(([feature, _]) => feature);
}

/**
 * Get platform capabilities
 */
export function getPlatformCapabilities(platform: Platform): PlatformCapability {
  return PLATFORM_CAPABILITIES[platform];
}

/**
 * Filter features by platform capabilities
 */
export function filterFeaturesByCapabilities(
  features: string[],
  requiredCapabilities: Partial<PlatformCapability>
): string[] {
  return features.filter((featureName) => {
    const platforms = FEATURE_PLATFORM_MAP[featureName] || [];
    return platforms.some((platform) => {
      const capabilities = PLATFORM_CAPABILITIES[platform];

      // Check display requirement
      if (requiredCapabilities.display && capabilities.display !== requiredCapabilities.display) {
        return false;
      }

      // Check input requirements
      if (requiredCapabilities.input) {
        const hasAllInputs = requiredCapabilities.input.every((input) =>
          capabilities.input.includes(input)
        );
        if (!hasAllInputs) return false;
      }

      // Check network requirement
      if (requiredCapabilities.network && capabilities.network !== requiredCapabilities.network) {
        return false;
      }

      return true;
    });
  });
}

/**
 * Get feature count statistics per platform
 */
export function getPlatformFeatureStats(): Record<Platform, number> {
  const stats: Record<Platform, number> = {
    'desktop': 0,
    'web-online': 0,
    'web-offline': 0,
    'android': 0,
    'ios': 0,
    'pixel-watch': 0,
    'google-hub': 0,
    'chromecast': 0,
  };

  Object.values(FEATURE_PLATFORM_MAP).forEach((platforms) => {
    platforms.forEach((platform) => {
      stats[platform]++;
    });
  });

  return stats;
}

// ============================================================================
// DEBUGGING & VALIDATION
// ============================================================================

console.log('🎯 Platform-Feature Compatibility Map Loaded');
console.log('Total features mapped:', Object.keys(FEATURE_PLATFORM_MAP).length);
console.log('Features per platform:', getPlatformFeatureStats());
