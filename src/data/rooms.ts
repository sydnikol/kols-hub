/**
 * Kol's Hub v7.0 - Complete 15-Room Configuration
 * Comprehensive mapping of ALL 200+ existing features to 15 specialized rooms
 */

import type { Room, RoomId, RoomTheme, AIPersonality } from '../types/dollhouse';

// ============================================================================
// 15 ROOM THEMES
// ============================================================================

export const ROOM_THEMES_15: Record<RoomId, RoomTheme> = {
  // ORIGINAL 8 ROOMS
  library: {
    primaryColor: '#8B4513',
    secondaryColor: '#D2691E',
    backgroundColor: '#1A1A1A',
    aesthetic: 'Dark wood, bookshelves, warm lamp lighting, academic Victorian study',
    mood: 'focused',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: false },
  },

  studio: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    backgroundColor: '#F7F7F7',
    aesthetic: 'Bright, colorful, creative chaos, art supplies, paint splatters, music notes',
    mood: 'energetic',
    lowStimMode: { enabled: true, reducedMotion: false, mutedColors: true },
  },

  sanctuary: {
    primaryColor: '#98D8C8',
    secondaryColor: '#B8A9C9',
    backgroundColor: '#F0EAD6',
    aesthetic: 'Soft, calming, earth tones, plants, healing crystals, flowing fabrics',
    mood: 'calm',
    lowStimMode: { enabled: false, reducedMotion: true, mutedColors: false },
  },

  observatory: {
    primaryColor: '#1E3A8A',
    secondaryColor: '#A78BFA',
    backgroundColor: '#0F172A',
    aesthetic: 'Starry night sky, vintage telescope, clockwork gears, time portals, ethereal mist',
    mood: 'ethereal',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: false },
  },

  finance: {
    primaryColor: '#059669',
    secondaryColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    aesthetic: 'Professional office, clean desk, organized files, charts, calculator',
    mood: 'professional',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: false },
  },

  social: {
    primaryColor: '#F59E0B',
    secondaryColor: '#EC4899',
    backgroundColor: '#FEF3C7',
    aesthetic: 'Cozy living room, communal table, board games, photos on walls, welcoming vibes',
    mood: 'cozy',
    lowStimMode: { enabled: true, reducedMotion: false, mutedColors: true },
  },

  entertainment: {
    primaryColor: '#7C3AED',
    secondaryColor: '#10B981',
    backgroundColor: '#1F2937',
    aesthetic: 'Game room with LED lights, posters, D&D table, arcade cabinets, cozy couch',
    mood: 'playful',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: true },
  },

  productivity: {
    primaryColor: '#6B7280',
    secondaryColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
    aesthetic: 'Minimal workspace, clean desk, task lists, digital screens, efficient tools',
    mood: 'efficient',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: false },
  },

  // NEW 7 ROOMS
  kitchen: {
    primaryColor: '#F97316', // Orange
    secondaryColor: '#FCD34D', // Yellow
    backgroundColor: '#FFF7ED', // Warm white
    aesthetic: 'Warm kitchen, fresh ingredients, recipe books, cooking utensils, homey comfort',
    mood: 'cozy',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: false },
  },

  wardrobe: {
    primaryColor: '#DB2777', // Pink
    secondaryColor: '#A855F7', // Purple
    backgroundColor: '#FDF2F8', // Soft pink
    aesthetic: 'Boutique closet, full-length mirrors, organized racks, fashion magazines, soft lighting',
    mood: 'energetic',
    lowStimMode: { enabled: true, reducedMotion: false, mutedColors: true },
  },

  wellness: {
    primaryColor: '#10B981', // Green
    secondaryColor: '#06B6D4', // Cyan
    backgroundColor: '#ECFDF5', // Mint
    aesthetic: 'Gym space, yoga mats, fitness equipment, motivational quotes, energizing vibes',
    mood: 'energetic',
    lowStimMode: { enabled: true, reducedMotion: false, mutedColors: false },
  },

  bedroom: {
    primaryColor: '#6366F1', // Indigo
    secondaryColor: '#8B5CF6', // Violet
    backgroundColor: '#1E1B4B', // Deep purple-blue
    aesthetic: 'Restful bedroom, soft bed, dream journal, nightstand, moonlight through curtains',
    mood: 'calm',
    lowStimMode: { enabled: false, reducedMotion: true, mutedColors: false },
  },

  garden: {
    primaryColor: '#22C55E', // Bright green
    secondaryColor: '#84CC16', // Lime
    backgroundColor: '#F0FDF4', // Mint cream
    aesthetic: 'Lush garden, growing plants, soil and seeds, garden tools, natural sunlight',
    mood: 'calm',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: false },
  },

  workshop: {
    primaryColor: '#DC2626', // Red
    secondaryColor: '#EA580C', // Orange-red
    backgroundColor: '#FEF2F2', // Light red
    aesthetic: 'Craft workshop, sewing machine, DIY projects, tools, works in progress',
    mood: 'focused',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: true },
  },

  portal: {
    primaryColor: '#8B5CF6', // Purple
    secondaryColor: '#EC4899', // Pink
    backgroundColor: '#1F1B24', // Deep purple-black
    aesthetic: 'Mystical portal hub, swirling energy, doorways to all rooms, ChronoMuse\'s domain',
    mood: 'ethereal',
    lowStimMode: { enabled: true, reducedMotion: true, mutedColors: false },
  },
};

// ============================================================================
// 15 ROOM AI PERSONALITIES
// ============================================================================

export const ROOM_AI_MAPPING: Record<RoomId, { personality: AIPersonality; name: string }> = {
  library: { personality: 'scholar', name: 'The Scholar' },
  studio: { personality: 'artist', name: 'The Artist' },
  sanctuary: { personality: 'healer', name: 'The Healer' },
  observatory: { personality: 'chronicler', name: 'The Chronicler' },
  finance: { personality: 'advisor', name: 'The Advisor' },
  social: { personality: 'connector', name: 'The Connector' },
  entertainment: { personality: 'curator', name: 'The Curator' },
  productivity: { personality: 'manager', name: 'The Manager' },
  kitchen: { personality: 'chef', name: 'The Chef' },
  wardrobe: { personality: 'stylist', name: 'The Stylist' },
  wellness: { personality: 'coach', name: 'The Coach' },
  bedroom: { personality: 'dreamer', name: 'The Dreamer' },
  garden: { personality: 'gardener', name: 'The Gardener' },
  workshop: { personality: 'maker', name: 'The Maker' },
  portal: { personality: 'guide', name: 'ChronoMuse' },
};

// ============================================================================
// COMPREHENSIVE FEATURE MAPPING (200+ Features → 15 Rooms)
// ============================================================================

export const ROOM_FEATURES_15: Record<RoomId, string[]> = {
  library: [
    // Education & Learning
    'EducationDashboard', 'EducationHub', 'LearningHub', 'LearningDashboard',
    'SkillsPortfolio', 'CreditTracker', 'AutoResume',
    'CourseViewer', 'StudyTimer', 'NoteTaking', 'ResearchLibrary',
    // Employment & Career
    'EmploymentHub', 'MentorshipHub',
    // Reading & Learning Content
    'ReadingHub', 'PodcastsHub',
    // Identity & Self-Discovery
    'IdentityHub',
  ],

  studio: [
    // Fashion & Wardrobe (shared with Wardrobe room)
    'AvatarCreator', 'AvatarProfileManager', 'ReadyPlayerMeAvatar',
    'ThemeManager', 'CustomThemeCreator',
    // Music & Creativity
    'CreativityHub', 'MusicSanctuary', 'ChronoMuse',
    'EmotionalEngine', 'TasteMemory',
    // Arts & Writing
    'WritingJournal', 'HobbiesHub',
    // Media Consumption
    'StreamingHub',
  ],

  sanctuary: [
    // Physical Health
    'HealthTracker', 'VitalsTracker', 'BodyWeatherChart',
    'MedicationTrackerV2', 'MedicationDashboard', 'MedicationList',
    'MedicationStatsDisplay', 'MedicationLog', 'MedicationReminders',
    'DoctorVisitPrep', 'MedicalRecords', 'HospitalVisitsLog',
    'CareTeamDirectory', 'SymptomTimeline', 'InsuranceTracker',
    'TelemedicineIntegration', 'MedicalAdvocacyHub', 'MedicalPortalsHub',
    'SodiumTracker', 'HealthLogsHub',
    // Mental Health
    'MoodTracker', 'TherapyJournal', 'TherapyHub',
    'CopingSkillsLibrary', 'TriggerTracker', 'SafetyPlan',
    'MentalHealthDashboard',
    // Spiritual & Ancestral
    'SpiritualReflection', 'AncestorAltarTracker',
    'DreamJournal', 'HoodooPracticeJournal',
    'SpiritualityHub', 'AncestryHub',
    // Disability & Accessibility
    'AdaptiveSupportHub', 'AccessibilitySettings',
    'DisabilityAccommodationsHub', 'SelfAdvocacyHub',
    'CaregiverInfoHub', 'CaregiverDashboard',
  ],

  observatory: [
    // Time Travel & Memory
    'TimePortal', 'ChronoJournal',
    'HistoricalSceneCreator', 'MemoryTimeline',
    'HighlightReelCreator', 'MemoriesHub',
    // Journaling & Reflection
    'JournalingHub', 'PersonalNarrativeBuilder',
    // Cultural & Learning
    'CulturalExploration',
  ],

  finance: [
    // Budgeting & Money Management
    'BudgetManager', 'BudgetingHub', 'FinanceTracker',
    'ExpenseTrackingHub', 'ExpenseAnalytics',
    // Savings & Investments
    'SavingsGoalsTracker', 'SavingsGoalsHub',
    'InvestmentsHub', 'DebtManagementHub',
    // Passive Income
    'PassiveIncomeLibrary', 'PassiveIncomeDashboard',
    // Subscriptions & Payments
    'SubscriptionManager', 'PaymentHub',
    'BillsCalendar', 'FinancialGoalsTracker',
    // Value Tracking
    'CostPerWearCalculator',
  ],

  social: [
    // Community & Relationships
    'SocialConnectionHub', 'Communications',
    'CommunityFeatures', 'EventsCalendar',
    'CommunityActivismOrgs', 'MutualAidNetworks',
    'PartnerCareLog', 'RelationshipTracker',
    'LoveLanguageTracker',
    // Social Activities
    'BoardgameHangouts', 'GiftIdeasTracker',
    'ImportantDatesCalendar',
    // Advocacy
    'AdvocacyHub',
    // Accessibility Planning
    'AccessibilityEventPlanning', 'OffendOMeter',
  ],

  entertainment: [
    // Gaming
    'GameLibrary', 'GamingHub',
    // D&D & Tabletop
    'DnDBeyondHub', 'CharacterSheet', 'DiceRoller',
    'SpellBook', 'MonsterManual', 'CampaignManager',
    'SessionNotes', 'HomebrewCreator',
    'InitiativeTracker', 'CombatTracker',
    'ItemDatabase', 'InventoryManager', 'MultiplayerManager',
    // Media & Content
    'MediaPicks', 'WatchHistory',
    // Ideas & Fun
    'IdeasLibrary',
  ],

  productivity: [
    // Task Management
    'TaskManagement', 'LowSpoonTaskLists',
    'TimeManagementHub', 'GoalsHub',
    // Routines & Habits
    'RoutineManager', 'HabitTracking', 'HabitsHub',
    // AI & Automations
    'AILifeManager', 'AIManagerDashboard',
    'AutomationsScripts',
    // Google Integration
    'GoogleDriveSync', 'GoogleCalendar',
    'GoogleKeepNotes', 'GmailIntegration',
    'GooglePhotosSync',
    // Communication
    'VoiceInteraction', 'KolCompanion',
    // Integration Hub
    'AppIntegrationsHub', 'IntegrationHub',
  ],

  kitchen: [
    // Food & Nutrition
    'PantryTracker', 'GroceryList', 'MealLogger',
    'RecipeLibrary', 'MealPlanner', 'FoodTrends',
    'NutritionHub', 'CookingHub',
  ],

  wardrobe: [
    // Fashion & Closet
    'WardrobeManager', 'AIStylist',
    'OutfitPreview', 'AIPanelReview',
    'CostPerWearCalculator', // Also in Finance
  ],

  wellness: [
    // Fitness & Exercise
    'FitnessHub', 'WellnessHub',
    'PixelWatchDashboard',
    // POTS & Physical Management
    'AdaptiveSupportHub', // Also in Sanctuary
  ],

  bedroom: [
    // Sleep & Rest
    'SleepTrackingHub',
    'DreamJournal', // Also in Sanctuary/Observatory
    // Relaxation
  ],

  garden: [
    // Gardening & Nature
    'GardeningHub',
    // Outdoor & Environment
  ],

  workshop: [
    // Crafts & DIY
    'ArtProjectsTracker', 'SewingProjects',
    // Home & Making
    'HomeMaintenanceHub', 'HomeManagementHub',
  ],

  portal: [
    // Central Navigation
    'KOLHub', 'KOLMasterDashboard',
    'UnifiedDashboard', 'AllFeaturesHub',
    // Room Navigation
    'RoomNavigator',
    // Multi-Device
    'SyncManager',
    // Cross-Cutting
    'HousingHub', 'TransportationHub',
    'TravelHub', 'PetCareHub',
    'LegalResourcesHub', 'EmergencyPrepHub',
  ],
};

// ============================================================================
// ROOM ICONS (for navigation)
// ============================================================================

export const ROOM_ICONS: Record<RoomId, string> = {
  library: '📚',
  studio: '🎨',
  sanctuary: '🕊️',
  observatory: '🔭',
  finance: '💰',
  social: '👥',
  entertainment: '🎮',
  productivity: '⚙️',
  kitchen: '🍳',
  wardrobe: '👗',
  wellness: '💪',
  bedroom: '🛏️',
  garden: '🌱',
  workshop: '🔨',
  portal: '🌀',
};

// ============================================================================
// EXPORTS
// ============================================================================

export function getRoomTheme(roomId: RoomId): RoomTheme {
  return ROOM_THEMES_15[roomId];
}

export function getRoomAI(roomId: RoomId): { personality: AIPersonality; name: string } {
  return ROOM_AI_MAPPING[roomId];
}

export function getRoomFeatures(roomId: RoomId): string[] {
  return ROOM_FEATURES_15[roomId];
}

export function getRoomIcon(roomId: RoomId): string {
  return ROOM_ICONS[roomId];
}

export function getTotalFeatureCount(): number {
  const allFeatures = new Set<string>();
  Object.values(ROOM_FEATURES_15).forEach((features) => {
    features.forEach((feature) => allFeatures.add(feature));
  });
  return allFeatures.size;
}

export function getAllRooms(): Room[] {
  const roomIds: RoomId[] = Object.keys(ROOM_THEMES_15) as RoomId[];

  return roomIds.map((roomId) => ({
    id: roomId,
    name: getRoomName(roomId),
    description: getRoomDescription(roomId),
    aiTeacher: {
      id: `${roomId}-teacher`,
      name: ROOM_AI_MAPPING[roomId].name,
      type: 'core' as const,
      personality: ROOM_AI_MAPPING[roomId].personality,
      room: roomId,
      avatar: {
        modelUrl: '',
        thumbnailUrl: '',
        defaultOutfit: '',
        currentOutfit: null,
        customization: {},
      },
      voice: {
        voiceId: '',
        provider: 'elevenlabs' as const,
        settings: {
          stability: 0.5,
          similarityBoost: 0.75,
        },
      },
      teachingStyle: {
        approachType: 'adaptive' as const,
        pacing: 'self-paced' as const,
        interactionLevel: 'conversational' as const,
        feedbackStyle: 'encouraging' as const,
      },
      expertiseAreas: ROOM_FEATURES_15[roomId],
      wardrobe: {
        outfits: [],
        accessories: [],
      },
      progressionLevel: 1,
      conversationHistory: [],
      isActive: false,
    },
    features: ROOM_FEATURES_15[roomId],
    theme: ROOM_THEMES_15[roomId],
    isUnlocked: true,
    visitCount: 0,
    lastVisited: null,
  }));
}

function getRoomName(roomId: RoomId): string {
  const names: Record<RoomId, string> = {
    library: 'The Library',
    studio: 'The Studio',
    sanctuary: 'The Sanctuary',
    observatory: 'The Observatory',
    finance: 'Finance Office',
    social: 'Social Lounge',
    entertainment: 'Entertainment Room',
    productivity: 'Productivity Hub',
    kitchen: 'The Kitchen',
    wardrobe: 'The Wardrobe',
    wellness: 'Wellness Center',
    bedroom: 'The Bedroom',
    garden: 'The Garden',
    workshop: 'The Workshop',
    portal: 'The Portal',
  };
  return names[roomId];
}

function getRoomDescription(roomId: RoomId): string {
  const descriptions: Record<RoomId, string> = {
    library: 'A space for learning, education, and knowledge',
    studio: 'A creative hub for art, music, and self-expression',
    sanctuary: 'A healing space for health, wellness, and spiritual growth',
    observatory: 'A time-traveling room for memories and reflection',
    finance: 'A professional space for managing money and resources',
    social: 'A welcoming room for connection and community',
    entertainment: 'A playful space for games, media, and fun',
    productivity: 'An efficient hub for tasks, routines, and organization',
    kitchen: 'A warm space for cooking, nutrition, and meal planning',
    wardrobe: 'A stylish room for fashion and outfit management',
    wellness: 'An energizing space for fitness and physical health',
    bedroom: 'A restful room for sleep and dream journaling',
    garden: 'A natural space for gardening and outdoor activities',
    workshop: 'A creative room for crafts, DIY, and making',
    portal: 'The central hub connecting all rooms',
  };
  return descriptions[roomId];
}

// Summary for debugging
console.log('🏠 15-Room System Loaded');
console.log('Total unique features:', getTotalFeatureCount());
console.log('Features per room:', Object.fromEntries(
  Object.entries(ROOM_FEATURES_15).map(([room, features]) => [room, features.length])
));
