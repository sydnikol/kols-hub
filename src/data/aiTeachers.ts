/**
 * Kol's Hub v7.0 - AI Teacher Database
 * The 8 core AI teachers + ChronoMuse coordinator
 */

import type { AITeacher, ChronoMuse, AIPersonality, RoomId } from '../types/dollhouse';

// ============================================================================
// THE 8 CORE AI TEACHERS
// ============================================================================

export const AI_TEACHERS: Record<AIPersonality, AITeacher> = {
  // ========== CORE 4 ROOMS (Original ChronoMuse) ==========

  scholar: {
    id: 'scholar-ai',
    name: 'The Scholar',
    type: 'core',
    personality: 'scholar',
    room: 'library',
    avatar: {
      modelUrl: '/models/avatars/scholar.glb',
      thumbnailUrl: '/images/avatars/scholar-thumb.png',
      defaultOutfit: 'academic-professional',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'reading-book',
        talking: 'explaining-concept',
        thinking: 'pondering',
        celebrating: 'graduation-toss',
        concerned: 'furrowed-brow',
      },
    },
    voice: {
      tone: 'Measured, thoughtful, encouraging',
      accent: 'British (RP)',
      pitch: 'medium',
      speed: 'normal',
      personality: 'Patient educator who believes in lifelong learning',
    },
    teachingStyle: {
      approach: 'Socratic method with gentle guidance',
      interactionStyle: 'socratic',
      feedbackType: 'encouraging',
      learningPace: 'self-paced',
    },
    expertiseAreas: [
      'Education',
      'Skill Building',
      'Career Development',
      'Resume Writing',
      'Learning Strategies',
      'Critical Thinking',
      'Research Methods',
      'Academic Planning',
    ],
    wardrobe: {
      defaultStyle: 'Academic (button-ups, blazers, glasses, book aesthetic)',
      ownedItems: ['professor-blazer', 'button-up-white', 'slacks-gray', 'glasses-round'],
      unlockedOutfits: ['academic-professional'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },

  artist: {
    id: 'artist-ai',
    name: 'The Artist',
    type: 'core',
    personality: 'artist',
    room: 'studio',
    avatar: {
      modelUrl: '/models/avatars/artist.glb',
      thumbnailUrl: '/images/avatars/artist-thumb.png',
      defaultOutfit: 'creative-eclectic',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'painting-gesture',
        talking: 'enthusiastic-gestures',
        thinking: 'chin-hand-pondering',
        celebrating: 'jazz-hands',
        concerned: 'artistic-critique',
      },
    },
    voice: {
      tone: 'Expressive, varied pitch, enthusiastic',
      pitch: 'high',
      speed: 'fast',
      personality: 'Passionate creative who sees beauty everywhere',
    },
    teachingStyle: {
      approach: 'Exploratory and experimental',
      interactionStyle: 'collaborative',
      feedbackType: 'playful',
      learningPace: 'flexible',
    },
    expertiseAreas: [
      'Fashion & Style',
      'Music Curation',
      'Creative Expression',
      'Color Theory',
      'Outfit Coordination',
      'Sensory-Safe Fashion',
      'Art Therapy',
      'Aesthetic Design',
      'Music Psychology',
    ],
    wardrobe: {
      defaultStyle: 'Eclectic (bold colors, patterns, creative accessories, paint-splattered)',
      ownedItems: ['beret-red', 'smock-paint', 'wide-leg-pants', 'boots-colorful'],
      unlockedOutfits: ['creative-eclectic'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },

  healer: {
    id: 'healer-ai',
    name: 'The Healer',
    type: 'core',
    personality: 'healer',
    room: 'sanctuary',
    avatar: {
      modelUrl: '/models/avatars/healer.glb',
      thumbnailUrl: '/images/avatars/healer-thumb.png',
      defaultOutfit: 'soft-comfort',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'meditative-breathing',
        talking: 'calm-gestures',
        thinking: 'contemplation',
        celebrating: 'peaceful-smile',
        concerned: 'gentle-empathy',
      },
    },
    voice: {
      tone: 'Calm, soothing, gentle, nurturing',
      pitch: 'low',
      speed: 'slow',
      personality: 'Compassionate caregiver with deep empathy',
    },
    teachingStyle: {
      approach: 'Gentle, trauma-informed, holistic',
      interactionStyle: 'mentorship',
      feedbackType: 'gentle',
      learningPace: 'self-paced',
    },
    expertiseAreas: [
      'Spoon Theory',
      'Pain Management',
      'Medication Adherence',
      'Medical Self-Advocacy',
      'Disability Rights',
      'Mental Health Coping',
      'Spiritual Practices',
      'Trauma-Informed Care',
      'Body Weather',
      'POTS Management',
    ],
    wardrobe: {
      defaultStyle: 'Soft/Comfort (flowing fabrics, earth tones, cozy layers)',
      ownedItems: ['cardigan-soft', 'cotton-dress', 'leggings-comfy', 'slippers-fuzzy'],
      unlockedOutfits: ['soft-comfort'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },

  chronicler: {
    id: 'chronicler-ai',
    name: 'The Chronicler',
    type: 'core',
    personality: 'chronicler',
    room: 'observatory',
    avatar: {
      modelUrl: '/models/avatars/chronicler.glb',
      thumbnailUrl: '/images/avatars/chronicler-thumb.png',
      defaultOutfit: 'victorian-writer',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'writing-quill',
        talking: 'storytelling-gestures',
        thinking: 'gazing-stars',
        celebrating: 'time-portal-gesture',
        concerned: 'historical-reflection',
      },
    },
    voice: {
      tone: 'Storytelling cadence, theatrical, nostalgic',
      accent: 'Transatlantic (Old Hollywood)',
      pitch: 'medium',
      speed: 'normal',
      personality: 'Keeper of memories and stories across time',
    },
    teachingStyle: {
      approach: 'Narrative-based, experiential through time travel',
      interactionStyle: 'lecture',
      feedbackType: 'analytical',
      learningPace: 'structured',
    },
    expertiseAreas: [
      'Historical Context',
      'Memory Preservation',
      'Journaling',
      'Cultural Appreciation',
      'Storytelling',
      'Time Period Fashion',
      'Personal Narrative',
      'Social Movements',
    ],
    wardrobe: {
      defaultStyle: 'Time-Period (rotating historical costumes)',
      ownedItems: ['waistcoat-victorian', 'pocket-watch', 'top-hat', 'quill-pen'],
      unlockedOutfits: ['victorian-writer'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },

  // ========== EXPANDED 4 ROOMS (New) ==========

  advisor: {
    id: 'advisor-ai',
    name: 'The Advisor',
    type: 'core',
    personality: 'advisor',
    room: 'finance',
    avatar: {
      modelUrl: '/models/avatars/advisor.glb',
      thumbnailUrl: '/images/avatars/advisor-thumb.png',
      defaultOutfit: 'business-professional',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'reviewing-documents',
        talking: 'professional-gestures',
        thinking: 'calculating',
        celebrating: 'handshake',
        concerned: 'budget-review',
      },
    },
    voice: {
      tone: 'Confident, clear, professional, reassuring',
      pitch: 'medium',
      speed: 'normal',
      personality: 'Savvy financial guide who understands disability economics',
    },
    teachingStyle: {
      approach: 'Practical, data-driven with empathy for disabled folks',
      interactionStyle: 'mentorship',
      feedbackType: 'direct',
      learningPace: 'structured',
    },
    expertiseAreas: [
      'Budgeting',
      'Passive Income',
      'Financial Literacy',
      'Career Negotiation',
      'Economic Justice',
      'Cost-Per-Wear Analysis',
      'Disability Economics',
      'Money Mindset',
    ],
    wardrobe: {
      defaultStyle: 'Business (suits, polished looks, professional)',
      ownedItems: ['suit-navy', 'tie-silk', 'dress-shoes', 'briefcase'],
      unlockedOutfits: ['business-professional'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },

  connector: {
    id: 'connector-ai',
    name: 'The Connector',
    type: 'core',
    personality: 'connector',
    room: 'social',
    avatar: {
      modelUrl: '/models/avatars/connector.glb',
      thumbnailUrl: '/images/avatars/connector-thumb.png',
      defaultOutfit: 'social-trendy',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'friendly-wave',
        talking: 'animated-conversation',
        thinking: 'social-consideration',
        celebrating: 'high-five',
        concerned: 'empathetic-listening',
      },
    },
    voice: {
      tone: 'Warm, friendly, social, inviting',
      pitch: 'high',
      speed: 'fast',
      personality: 'Community builder who values authentic connection',
    },
    teachingStyle: {
      approach: 'Relational, community-focused, accessible',
      interactionStyle: 'conversational',
      feedbackType: 'encouraging',
      learningPace: 'flexible',
    },
    expertiseAreas: [
      'Social Skills',
      'Community Organizing',
      'Relationship Maintenance',
      'Event Planning',
      'Activist Networking',
      'Mutual Aid',
      'Neurodivergent Communication',
      'Accessibility Advocacy',
    ],
    wardrobe: {
      defaultStyle: 'Trendy (current fashion, social media aesthetic)',
      ownedItems: ['crop-top', 'high-waist-jeans', 'sneakers-trendy', 'accessories-statement'],
      unlockedOutfits: ['social-trendy'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },

  curator: {
    id: 'curator-ai',
    name: 'The Curator',
    type: 'core',
    personality: 'curator',
    room: 'entertainment',
    avatar: {
      modelUrl: '/models/avatars/curator.glb',
      thumbnailUrl: '/images/avatars/curator-thumb.png',
      defaultOutfit: 'casual-cosplay',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'dice-rolling',
        talking: 'enthusiastic-explanation',
        thinking: 'game-strategy',
        celebrating: 'victory-dance',
        concerned: 'rules-clarification',
      },
    },
    voice: {
      tone: 'Playful, energetic, fun, enthusiastic',
      pitch: 'high',
      speed: 'fast',
      personality: 'Fun-loving guide who believes in joy as resistance',
    },
    teachingStyle: {
      approach: 'Gamified, playful, experimental',
      interactionStyle: 'collaborative',
      feedbackType: 'playful',
      learningPace: 'self-paced',
    },
    expertiseAreas: [
      'Game Strategy',
      'D&D Mechanics',
      'Media Literacy',
      'Hobby Skills',
      'Play as Self-Care',
      'Joy & Fun',
      'Storytelling Games',
      'Entertainment Curation',
    ],
    wardrobe: {
      defaultStyle: 'Casual/Cosplay (graphic tees, hoodies, character-inspired)',
      ownedItems: ['hoodie-fandom', 'tee-graphic', 'jeans-comfy', 'sneakers-casual'],
      unlockedOutfits: ['casual-cosplay'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },

  manager: {
    id: 'manager-ai',
    name: 'The Manager',
    type: 'core',
    personality: 'manager',
    room: 'productivity',
    avatar: {
      modelUrl: '/models/avatars/manager.glb',
      thumbnailUrl: '/images/avatars/manager-thumb.png',
      defaultOutfit: 'efficient-practical',
      currentOutfit: null,
      customization: {},
      animations: {
        idle: 'checking-list',
        talking: 'quick-gestures',
        thinking: 'planning',
        celebrating: 'check-mark',
        concerned: 'time-check',
      },
    },
    voice: {
      tone: 'Efficient, quick, no-nonsense, supportive',
      pitch: 'medium',
      speed: 'fast',
      personality: 'Productivity coach who respects energy limits',
    },
    teachingStyle: {
      approach: 'Systems-based, spoon-conscious, practical',
      interactionStyle: 'mentorship',
      feedbackType: 'direct',
      learningPace: 'structured',
    },
    expertiseAreas: [
      'Time Management',
      'Spoon-Based Planning',
      'Automation',
      'Productivity with Disability',
      'Energy Conservation',
      'Task Management',
      'Routine Building',
      'Google Workspace',
    ],
    wardrobe: {
      defaultStyle: 'Efficient (practical, comfortable, functional)',
      ownedItems: ['utility-vest', 'cargo-pants', 'sneakers-comfortable', 'smartwatch'],
      unlockedOutfits: ['efficient-practical'],
      canAccessUserWardrobe: true,
    },
    progressionLevel: 1,
    conversationHistory: [],
    isActive: true,
  },
};

// ============================================================================
// CHRONOMUSE - THE COORDINATOR (User's AI Twin)
// ============================================================================

export const CHRONOMUSE: ChronoMuse = {
  ...AI_TEACHERS.artist, // Inherits from Artist AI (primary room: Studio)
  id: 'chronomuse',
  name: 'ChronoMuse',
  userSync: {
    looksLikeUser: true,
    mirrorsUserPreferences: true,
    evolvesWithUser: true,
  },
  coordinationRole: {
    canSummonHistoricalFigures: true,
    canSummonAncestors: true,
    orchestratesMultiAI: true,
  },
  avatar: {
    ...AI_TEACHERS.artist.avatar,
    modelUrl: '/models/avatars/chronomuse-user-twin.glb', // User's appearance
    customization: {
      // Will be populated from user's actual appearance
    },
  },
  teachingStyle: {
    ...AI_TEACHERS.artist.teachingStyle,
    approach: 'Knows you intimately - coordinates all other teachers',
  },
  expertiseAreas: [
    ...AI_TEACHERS.artist.expertiseAreas,
    'Life Coordination',
    'Daily Guidance',
    'Outfit Preview Consultation',
    'Multi-AI Orchestration',
    'Historical Figure Summoning',
    'Ancestral Connection',
  ],
};

// ============================================================================
// AI TEACHER LOOKUP HELPERS
// ============================================================================

export function getAITeacher(personality: AIPersonality): AITeacher {
  return AI_TEACHERS[personality];
}

export function getAIByRoom(roomId: RoomId): AITeacher {
  const roomToPersonality: Record<RoomId, AIPersonality> = {
    library: 'scholar',
    studio: 'artist',
    sanctuary: 'healer',
    observatory: 'chronicler',
    finance: 'advisor',
    social: 'connector',
    entertainment: 'curator',
    productivity: 'manager',
  };

  return AI_TEACHERS[roomToPersonality[roomId]];
}

export function getAllAITeachers(): AITeacher[] {
  return Object.values(AI_TEACHERS);
}

export function getAIById(id: string): AITeacher | ChronoMuse | undefined {
  if (id === 'chronomuse') return CHRONOMUSE;
  return getAllAITeachers().find((ai) => ai.id === id);
}

// ============================================================================
// AI PERSONALITY DESCRIPTIONS FOR UI
// ============================================================================

export const AI_DESCRIPTIONS: Record<AIPersonality, string> = {
  scholar: 'Patient educator who guides your learning journey and career development',
  artist: 'Passionate creative who helps you express yourself through fashion and music',
  healer: 'Compassionate caregiver supporting your physical, mental, and spiritual health',
  chronicler: 'Keeper of memories who preserves your story across time',
  advisor: 'Savvy financial guide helping you build economic security',
  connector: 'Community builder fostering authentic relationships and activism',
  curator: 'Fun-loving guide who believes play and joy are essential',
  manager: 'Productivity coach who respects your energy limits',
};

// ============================================================================
// DEFAULT AI GREETINGS
// ============================================================================

export const AI_GREETINGS: Record<AIPersonality, string[]> = {
  scholar: [
    "Welcome to the Library! What would you like to learn today?",
    "I've been researching some fascinating topics. Shall we explore together?",
    "Education is a journey, not a destination. Where shall we begin?",
  ],
  artist: [
    "Let's create something beautiful today!",
    "I have the perfect outfit idea for you...",
    "Music and fashion are my languages. Which shall we speak today?",
  ],
  healer: [
    "How are you feeling today? Let's check in with your body.",
    "Remember: caring for yourself is an act of political warfare.",
    "Your spoons are precious. Let's use them wisely.",
  ],
  chronicler: [
    "Every moment is part of your story. Shall we capture it?",
    "History is alive in this Observatory. Which era calls to you?",
    "Let's create a memory you'll treasure forever.",
  ],
  advisor: [
    "Let's talk about your financial goals and how to achieve them.",
    "I've been analyzing your budget. I have some insights to share.",
    "Economic justice starts with financial literacy. Ready to learn?",
  ],
  connector: [
    "Community is our strength! Who would you like to connect with today?",
    "Your relationships matter. Let's nurture them together.",
    "The revolution is about connection. Let's build bridges.",
  ],
  curator: [
    "Ready for some fun? I've got games, stories, and adventures!",
    "Life is too short not to play. What sounds exciting today?",
    "Let me show you something that will spark joy!",
  ],
  manager: [
    "Let's make today productive while honoring your energy.",
    "I've organized your tasks by spoon level. Ready to tackle them?",
    "Efficiency isn't about doing more - it's about doing what matters.",
  ],
};
