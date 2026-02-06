// Unified AI Integration Service
// Connects all features, dolls, media, libraries, and AI systems

import { SHADOW_LIBRARIES, LIBRARY_CATEGORIES } from '../data/shadow-libraries-database';

// User Activity & Preferences Tracker
interface UserActivity {
  lastVisitedPages: string[];
  recentSearches: string[];
  favoriteCategories: string[];
  mediaHistory: { id: string; timestamp: number; type: string }[];
  learningProgress: { language: string; level: number }[];
  dollInteractions: { dollId: string; topic: string; timestamp: number }[];
  moodHistory: { mood: string; timestamp: number }[];
  currentGoals: string[];
}

interface AIContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  userMood?: string;
  recentActivity: string[];
  preferences: UserActivity;
}

// Doll Personalities for integrated guidance
const DOLL_PERSONALITIES = {
  luna: {
    name: 'Luna',
    specialty: 'languages',
    greeting: "Bonjour! Ready to explore new languages?",
    suggestions: ['Start a flashcard session', 'Practice pronunciation', 'Watch foreign films'],
    keywords: ['language', 'learn', 'japanese', 'spanish', 'korean', 'french', 'german', 'chinese']
  },
  aria: {
    name: 'Aria',
    specialty: 'arts',
    greeting: "Let's create something beautiful today!",
    suggestions: ['Explore art tutorials', 'Visit the sewing studio', 'Browse design inspiration'],
    keywords: ['art', 'design', 'creative', 'sewing', 'craft', 'draw', 'paint']
  },
  nova: {
    name: 'Nova',
    specialty: 'technology',
    greeting: "Ready to dive into code and tech?",
    suggestions: ['Browse programming books', 'Try a coding tutorial', 'Explore AI tools'],
    keywords: ['code', 'programming', 'tech', 'developer', 'software', 'ai', 'computer']
  },
  sage: {
    name: 'Sage',
    specialty: 'wisdom',
    greeting: "Let's explore the depths of knowledge.",
    suggestions: ['Read philosophy texts', 'Explore research papers', 'Study history'],
    keywords: ['philosophy', 'history', 'research', 'knowledge', 'wisdom', 'theory', 'study']
  },
  ember: {
    name: 'Ember',
    specialty: 'entertainment',
    greeting: "Time for some fun and entertainment!",
    suggestions: ['Watch a classic film', 'Play a game', 'Listen to an audiobook'],
    keywords: ['watch', 'play', 'game', 'movie', 'music', 'entertainment', 'fun', 'stream']
  },
  harmony: {
    name: 'Harmony',
    specialty: 'wellness',
    greeting: "Let's focus on your wellbeing today.",
    suggestions: ['Track your health', 'Practice mindfulness', 'Plan healthy meals'],
    keywords: ['health', 'wellness', 'mental', 'meditation', 'exercise', 'sleep', 'nutrition']
  },
  atlas: {
    name: 'Atlas',
    specialty: 'life',
    greeting: "Ready to conquer your goals?",
    suggestions: ['Manage your finances', 'Organize your schedule', 'Track your habits'],
    keywords: ['finance', 'money', 'schedule', 'goals', 'habit', 'organize', 'productivity']
  }
};

// Cross-feature recommendations engine
class UnifiedAIIntegration {
  private static instance: UnifiedAIIntegration;
  private userActivity: UserActivity;
  private aiContext: AIContext;

  private constructor() {
    this.userActivity = this.loadUserActivity();
    this.aiContext = this.buildContext();
  }

  static getInstance(): UnifiedAIIntegration {
    if (!UnifiedAIIntegration.instance) {
      UnifiedAIIntegration.instance = new UnifiedAIIntegration();
    }
    return UnifiedAIIntegration.instance;
  }

  private loadUserActivity(): UserActivity {
    const saved = localStorage.getItem('kolsHubUserActivity');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      lastVisitedPages: [],
      recentSearches: [],
      favoriteCategories: [],
      mediaHistory: [],
      learningProgress: [],
      dollInteractions: [],
      moodHistory: [],
      currentGoals: []
    };
  }

  private saveUserActivity(): void {
    localStorage.setItem('kolsHubUserActivity', JSON.stringify(this.userActivity));
  }

  private buildContext(): AIContext {
    const hour = new Date().getHours();
    let timeOfDay: AIContext['timeOfDay'];
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
      timeOfDay,
      dayOfWeek: days[new Date().getDay()],
      userMood: this.userActivity.moodHistory[0]?.mood,
      recentActivity: this.userActivity.lastVisitedPages.slice(0, 5),
      preferences: this.userActivity
    };
  }

  // Track page visits
  trackPageVisit(pagePath: string): void {
    this.userActivity.lastVisitedPages = [
      pagePath,
      ...this.userActivity.lastVisitedPages.filter(p => p !== pagePath)
    ].slice(0, 20);
    this.saveUserActivity();
  }

  // Track search queries
  trackSearch(query: string): void {
    this.userActivity.recentSearches = [
      query,
      ...this.userActivity.recentSearches.filter(q => q !== query)
    ].slice(0, 20);
    this.saveUserActivity();
  }

  // Track media consumption
  trackMedia(mediaId: string, mediaType: string): void {
    this.userActivity.mediaHistory = [
      { id: mediaId, timestamp: Date.now(), type: mediaType },
      ...this.userActivity.mediaHistory
    ].slice(0, 50);
    this.saveUserActivity();
  }

  // Track doll interactions
  trackDollInteraction(dollId: string, topic: string): void {
    this.userActivity.dollInteractions = [
      { dollId, topic, timestamp: Date.now() },
      ...this.userActivity.dollInteractions
    ].slice(0, 50);
    this.saveUserActivity();
  }

  // Track mood
  trackMood(mood: string): void {
    this.userActivity.moodHistory = [
      { mood, timestamp: Date.now() },
      ...this.userActivity.moodHistory
    ].slice(0, 30);
    this.saveUserActivity();
  }

  // Get the best doll for current context
  getBestDollForContext(query?: string): keyof typeof DOLL_PERSONALITIES {
    if (query) {
      const queryLower = query.toLowerCase();
      for (const [dollId, doll] of Object.entries(DOLL_PERSONALITIES)) {
        if (doll.keywords.some(k => queryLower.includes(k))) {
          return dollId as keyof typeof DOLL_PERSONALITIES;
        }
      }
    }

    // Based on time of day
    const context = this.buildContext();
    switch (context.timeOfDay) {
      case 'morning': return 'harmony'; // wellness focus
      case 'afternoon': return 'nova'; // productive work
      case 'evening': return 'ember'; // entertainment
      case 'night': return 'sage'; // contemplation
    }
  }

  // Get personalized recommendations
  getRecommendations(): {
    doll: typeof DOLL_PERSONALITIES[keyof typeof DOLL_PERSONALITIES];
    suggestions: string[];
    libraryRecommendation?: typeof SHADOW_LIBRARIES[0];
    mediaRecommendation?: string;
    greeting: string;
  } {
    const context = this.buildContext();
    const bestDoll = this.getBestDollForContext();
    const doll = DOLL_PERSONALITIES[bestDoll];

    let greeting = doll.greeting;
    const suggestions = [...doll.suggestions];

    // Add context-aware suggestions
    if (context.timeOfDay === 'morning') {
      suggestions.push('Check your daily goals');
      greeting = `Good morning! ${doll.greeting}`;
    } else if (context.timeOfDay === 'evening') {
      suggestions.push('Review what you learned today');
      greeting = `Good evening! ${doll.greeting}`;
    } else if (context.timeOfDay === 'night') {
      suggestions.push('Time to wind down with some light reading');
      greeting = `Late night session? ${doll.greeting}`;
    }

    // Recommend library based on interests
    const libraryRecommendation = SHADOW_LIBRARIES.find(lib => {
      return this.userActivity.favoriteCategories.some(cat =>
        lib.contentTypes.includes(cat) || lib.category === cat
      );
    }) || SHADOW_LIBRARIES[0];

    return {
      doll,
      suggestions,
      libraryRecommendation,
      greeting
    };
  }

  // Cross-feature search - search across all integrated features
  universalSearch(query: string): {
    libraries: typeof SHADOW_LIBRARIES;
    suggestedDoll: keyof typeof DOLL_PERSONALITIES;
    relatedPages: string[];
    mediaTypes: string[];
  } {
    this.trackSearch(query);
    const queryLower = query.toLowerCase();

    // Find matching libraries
    const libraries = SHADOW_LIBRARIES.filter(lib =>
      lib.name.toLowerCase().includes(queryLower) ||
      lib.description.toLowerCase().includes(queryLower) ||
      lib.contentTypes.some(t => t.toLowerCase().includes(queryLower)) ||
      lib.features.some(f => f.toLowerCase().includes(queryLower))
    );

    // Find best doll for this query
    const suggestedDoll = this.getBestDollForContext(query);

    // Suggest related pages based on query
    const relatedPages: string[] = [];
    if (queryLower.includes('book') || queryLower.includes('read')) relatedPages.push('/shadow-library', '/media-player');
    if (queryLower.includes('watch') || queryLower.includes('movie')) relatedPages.push('/media-player', '/streaming-full');
    if (queryLower.includes('learn') || queryLower.includes('language')) relatedPages.push('/language-learning', '/openculture');
    if (queryLower.includes('game') || queryLower.includes('play')) relatedPages.push('/game-arcade', '/gaming');
    if (queryLower.includes('craft') || queryLower.includes('sew')) relatedPages.push('/sewing-crafts');
    if (queryLower.includes('app') || queryLower.includes('tool')) relatedPages.push('/universal-apps');
    if (queryLower.includes('chat') || queryLower.includes('communicate')) relatedPages.push('/communication-hub');

    // Suggest media types
    const mediaTypes: string[] = [];
    if (queryLower.includes('audio') || queryLower.includes('listen')) mediaTypes.push('audiobook', 'audio');
    if (queryLower.includes('video') || queryLower.includes('watch')) mediaTypes.push('video', 'film');
    if (queryLower.includes('read') || queryLower.includes('book')) mediaTypes.push('ebook', 'pdf');

    return {
      libraries,
      suggestedDoll,
      relatedPages,
      mediaTypes
    };
  }

  // Generate AI response based on context
  generateAIResponse(userMessage: string): string {
    const recommendations = this.getRecommendations();
    const search = this.universalSearch(userMessage);
    const doll = recommendations.doll;

    // Build contextual response
    let response = `${doll.name}: `;

    if (search.libraries.length > 0) {
      response += `I found ${search.libraries.length} relevant libraries for "${userMessage}". `;
      response += `Try ${search.libraries[0].name} - ${search.libraries[0].description} `;
    }

    if (search.relatedPages.length > 0) {
      response += `You might want to check out: ${search.relatedPages.join(', ')}. `;
    }

    response += recommendations.suggestions[0];

    return response;
  }

  // Feature-to-feature communication
  notifyFeature(fromFeature: string, toFeature: string, data: any): void {
    const event = new CustomEvent('kolsHubFeatureMessage', {
      detail: { from: fromFeature, to: toFeature, data, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  // Subscribe to feature messages
  subscribeToMessages(featureName: string, callback: (data: any) => void): () => void {
    const handler = (event: CustomEvent) => {
      if (event.detail.to === featureName || event.detail.to === 'all') {
        callback(event.detail);
      }
    };
    window.addEventListener('kolsHubFeatureMessage' as any, handler);
    return () => window.removeEventListener('kolsHubFeatureMessage' as any, handler);
  }

  // Get daily digest of activity
  getDailyDigest(): {
    pagesVisited: number;
    searchesMade: number;
    mediaConsumed: number;
    dollInteractions: number;
    topInterests: string[];
    suggestedGoals: string[];
  } {
    const today = new Date().setHours(0, 0, 0, 0);

    const pagesVisited = this.userActivity.lastVisitedPages.length;
    const searchesMade = this.userActivity.recentSearches.length;
    const mediaConsumed = this.userActivity.mediaHistory.filter(m => m.timestamp >= today).length;
    const dollInteractions = this.userActivity.dollInteractions.filter(d => d.timestamp >= today).length;

    // Analyze interests from searches and interactions
    const allKeywords = [
      ...this.userActivity.recentSearches,
      ...this.userActivity.dollInteractions.map(d => d.topic)
    ];
    const keywordCounts: Record<string, number> = {};
    allKeywords.forEach(k => {
      const words = k.toLowerCase().split(' ');
      words.forEach(w => {
        if (w.length > 3) keywordCounts[w] = (keywordCounts[w] || 0) + 1;
      });
    });
    const topInterests = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k);

    // Suggest goals based on activity
    const suggestedGoals: string[] = [];
    if (mediaConsumed === 0) suggestedGoals.push('Watch or listen to something new today');
    if (searchesMade < 3) suggestedGoals.push('Explore a new topic in the libraries');
    if (dollInteractions < 2) suggestedGoals.push('Chat with a doll guide for personalized help');

    return {
      pagesVisited,
      searchesMade,
      mediaConsumed,
      dollInteractions,
      topInterests,
      suggestedGoals
    };
  }
}

// Export singleton instance
export const aiIntegration = UnifiedAIIntegration.getInstance();

// Export types and constants
export { DOLL_PERSONALITIES };
export type { UserActivity, AIContext };

// React hook for easy integration
export function useAIIntegration() {
  return {
    trackPageVisit: (path: string) => aiIntegration.trackPageVisit(path),
    trackSearch: (query: string) => aiIntegration.trackSearch(query),
    trackMedia: (id: string, type: string) => aiIntegration.trackMedia(id, type),
    trackDollInteraction: (dollId: string, topic: string) => aiIntegration.trackDollInteraction(dollId, topic),
    trackMood: (mood: string) => aiIntegration.trackMood(mood),
    getRecommendations: () => aiIntegration.getRecommendations(),
    universalSearch: (query: string) => aiIntegration.universalSearch(query),
    generateAIResponse: (message: string) => aiIntegration.generateAIResponse(message),
    notifyFeature: (from: string, to: string, data: any) => aiIntegration.notifyFeature(from, to, data),
    subscribeToMessages: (feature: string, callback: (data: any) => void) => aiIntegration.subscribeToMessages(feature, callback),
    getDailyDigest: () => aiIntegration.getDailyDigest(),
    getBestDoll: (query?: string) => aiIntegration.getBestDollForContext(query)
  };
}

export default aiIntegration;
