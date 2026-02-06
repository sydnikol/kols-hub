/**
 * Unified Search and Suggestion System
 * =====================================
 * Search across all resources in the dollhouse
 * AI-powered suggestions based on context and activity
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DOLL_CHARACTERS, DollCharacter } from '../dolls/DollGuideSystem';

// ============================================================================
// TYPES
// ============================================================================

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'language' | 'entertainment' | 'sewing' | 'learning' | 'gaming' | 'communication' | 'streaming';
  subcategory?: string;
  url?: string;
  embedUrl?: string;
  icon?: string;
  relevantDoll: string;
  tags: string[];
}

export interface SearchContext {
  currentArea?: string;
  recentActivities?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  preferences?: string[];
}

interface UnifiedSearchProps {
  onNavigate?: (path: string) => void;
  onSelectResource?: (resource: SearchResult) => void;
  context?: SearchContext;
  className?: string;
}

// ============================================================================
// SEARCH DATABASE - All resources unified
// ============================================================================

const UNIFIED_RESOURCES: SearchResult[] = [
  // Language Learning
  { id: 'lang-1', title: 'Japanese - Tofugu', description: 'Learn Japanese hiragana, katakana, and culture', category: 'language', subcategory: 'Japanese', url: 'https://www.tofugu.com', icon: '🇯🇵', relevantDoll: 'luna', tags: ['japanese', 'hiragana', 'katakana', 'beginner'] },
  { id: 'lang-2', title: 'Japanese - NHK World', description: 'Official NHK Japanese lessons', category: 'language', subcategory: 'Japanese', url: 'https://www.nhk.or.jp/lesson/english/', icon: '🇯🇵', relevantDoll: 'luna', tags: ['japanese', 'audio', 'listening'] },
  { id: 'lang-3', title: 'Japanese - Minato', description: 'Japan Foundation learning platform', category: 'language', subcategory: 'Japanese', embedUrl: 'https://minato-jf.jp', icon: '🇯🇵', relevantDoll: 'luna', tags: ['japanese', 'jlpt', 'courses'] },
  { id: 'lang-4', title: 'Korean - TTMIK', description: 'Talk To Me In Korean lessons', category: 'language', subcategory: 'Korean', url: 'https://talktomeinkorean.com', icon: '🇰🇷', relevantDoll: 'luna', tags: ['korean', 'hangul', 'beginner'] },
  { id: 'lang-5', title: 'Korean - KoreanClass101', description: 'Comprehensive Korean lessons', category: 'language', subcategory: 'Korean', url: 'https://www.koreanclass101.com', icon: '🇰🇷', relevantDoll: 'luna', tags: ['korean', 'audio', 'podcast'] },
  { id: 'lang-6', title: 'Spanish - SpanishDict', description: 'Spanish dictionary and learning', category: 'language', subcategory: 'Spanish', url: 'https://www.spanishdict.com', icon: '🇪🇸', relevantDoll: 'luna', tags: ['spanish', 'dictionary', 'grammar'] },
  { id: 'lang-7', title: 'German - DW Learn German', description: 'Deutsche Welle German courses', category: 'language', subcategory: 'German', url: 'https://learngerman.dw.com', icon: '🇩🇪', relevantDoll: 'luna', tags: ['german', 'video', 'courses'] },
  { id: 'lang-8', title: 'French - TV5 Monde', description: 'French language exercises', category: 'language', subcategory: 'French', url: 'https://apprendre.tv5monde.com', icon: '🇫🇷', relevantDoll: 'luna', tags: ['french', 'video', 'exercises'] },
  { id: 'lang-9', title: 'Chinese - ChineseClass101', description: 'Mandarin Chinese lessons', category: 'language', subcategory: 'Chinese', url: 'https://www.chineseclass101.com', icon: '🇨🇳', relevantDoll: 'luna', tags: ['chinese', 'mandarin', 'pinyin'] },
  { id: 'lang-10', title: 'Blackfoot Language', description: 'Learn the Blackfoot language', category: 'language', subcategory: 'Blackfoot', url: 'https://blackfootlanguage.org', icon: '🏔️', relevantDoll: 'luna', tags: ['blackfoot', 'indigenous', 'native'] },
  { id: 'lang-11', title: 'Duolingo', description: 'Gamified language learning', category: 'language', embedUrl: 'https://www.duolingo.com', icon: '🦉', relevantDoll: 'luna', tags: ['languages', 'gamified', 'beginner', 'app'] },
  { id: 'lang-12', title: 'Busuu', description: 'Social language learning', category: 'language', embedUrl: 'https://www.busuu.com', icon: '💬', relevantDoll: 'luna', tags: ['languages', 'social', 'community'] },

  // Gaming
  { id: 'game-1', title: 'Godot Engine', description: 'Free, open-source game engine', category: 'gaming', subcategory: 'Development', url: 'https://godotengine.org', icon: '🎮', relevantDoll: 'nova', tags: ['gamedev', 'engine', 'free', '2d', '3d'] },
  { id: 'game-2', title: 'Phaser.js', description: 'HTML5 game framework', category: 'gaming', subcategory: 'Development', url: 'https://phaser.io', icon: '🕹️', relevantDoll: 'nova', tags: ['gamedev', 'html5', 'javascript', 'web'] },
  { id: 'game-3', title: 'Internet Arcade', description: 'Play classic arcade games', category: 'gaming', subcategory: 'Play', embedUrl: 'https://archive.org/details/internetarcade', icon: '👾', relevantDoll: 'ember', tags: ['arcade', 'retro', 'classic', 'free'] },
  { id: 'game-4', title: 'GOG Free Games', description: 'Free classic PC games', category: 'gaming', subcategory: 'Play', url: 'https://www.gog.com/partner/free_games', icon: '🎁', relevantDoll: 'ember', tags: ['free', 'pc', 'drm-free', 'classic'] },
  { id: 'game-5', title: 'itch.io', description: 'Indie game marketplace', category: 'gaming', subcategory: 'Play', embedUrl: 'https://itch.io', icon: '🎯', relevantDoll: 'ember', tags: ['indie', 'free', 'browser', 'download'] },
  { id: 'game-6', title: 'Playnite', description: 'Game library manager', category: 'gaming', subcategory: 'Tools', url: 'https://playnite.link', icon: '📚', relevantDoll: 'nova', tags: ['library', 'manager', 'organization'] },
  { id: 'game-7', title: 'MobyGames', description: 'Video game database', category: 'gaming', subcategory: 'Database', url: 'https://www.mobygames.com', icon: '📖', relevantDoll: 'sage', tags: ['database', 'history', 'reference'] },

  // Sewing & Crafts
  { id: 'sew-1', title: 'FreeSewing', description: 'Open-source sewing patterns', category: 'sewing', url: 'https://freesewing.org', icon: '✂️', relevantDoll: 'aria', tags: ['patterns', 'free', 'custom', 'software'] },
  { id: 'sew-2', title: 'Seamly2D', description: 'Pattern drafting software', category: 'sewing', url: 'https://seamly.io', icon: '📐', relevantDoll: 'aria', tags: ['software', 'drafting', 'free'] },
  { id: 'sew-3', title: 'AllFreeSewing', description: 'Free sewing patterns', category: 'sewing', url: 'https://www.allfreesewing.com', icon: '🧵', relevantDoll: 'aria', tags: ['patterns', 'free', 'clothing'] },
  { id: 'sew-4', title: 'SewCanShe', description: 'Modern sewing projects', category: 'sewing', url: 'https://www.sewcanshe.com', icon: '👗', relevantDoll: 'aria', tags: ['patterns', 'modern', 'tutorials'] },
  { id: 'sew-5', title: 'Mood Fabrics', description: 'Patterns and inspiration', category: 'sewing', url: 'https://www.moodfabrics.com/blog', icon: '🎨', relevantDoll: 'aria', tags: ['patterns', 'designer', 'fabrics'] },
  { id: 'sew-6', title: 'BurdaStyle', description: 'European fashion patterns', category: 'sewing', url: 'https://www.burdastyle.com', icon: '✨', relevantDoll: 'aria', tags: ['patterns', 'fashion', 'european'] },

  // Learning & Education
  { id: 'learn-1', title: 'OpenCulture', description: 'Free courses and books', category: 'learning', url: 'https://www.openculture.com', icon: '📚', relevantDoll: 'sage', tags: ['courses', 'books', 'free', 'university'] },
  { id: 'learn-2', title: 'TED Talks', description: 'Ideas worth spreading', category: 'learning', embedUrl: 'https://www.ted.com', icon: '🎤', relevantDoll: 'sage', tags: ['talks', 'ideas', 'inspiration'] },
  { id: 'learn-3', title: 'Khan Academy', description: 'Free educational courses', category: 'learning', embedUrl: 'https://www.khanacademy.org', icon: '🎓', relevantDoll: 'sage', tags: ['courses', 'math', 'science', 'free'] },
  { id: 'learn-4', title: 'Coursera', description: 'University courses online', category: 'learning', url: 'https://www.coursera.org', icon: '🏛️', relevantDoll: 'sage', tags: ['courses', 'university', 'certificates'] },
  { id: 'learn-5', title: 'Codecademy', description: 'Learn to code', category: 'learning', subcategory: 'Coding', embedUrl: 'https://www.codecademy.com', icon: '💻', relevantDoll: 'nova', tags: ['coding', 'programming', 'interactive'] },
  { id: 'learn-6', title: 'freeCodeCamp', description: 'Free coding education', category: 'learning', subcategory: 'Coding', embedUrl: 'https://www.freecodecamp.org', icon: '🔥', relevantDoll: 'nova', tags: ['coding', 'free', 'web development'] },
  { id: 'learn-7', title: 'Documentary Heaven', description: 'Free documentaries', category: 'learning', embedUrl: 'https://documentaryheaven.com', icon: '🎬', relevantDoll: 'sage', tags: ['documentaries', 'free', 'streaming'] },
  { id: 'learn-8', title: 'Philosophy Bites', description: 'Philosophy podcasts', category: 'learning', subcategory: 'Philosophy', url: 'https://philosophybites.com', icon: '🤔', relevantDoll: 'sage', tags: ['philosophy', 'podcast', 'ideas'] },

  // Entertainment
  { id: 'ent-1', title: 'YouTube', description: 'Video streaming platform', category: 'entertainment', embedUrl: 'https://www.youtube.com', icon: '📺', relevantDoll: 'ember', tags: ['video', 'streaming', 'free'] },
  { id: 'ent-2', title: 'Tubi', description: 'Free movies and TV', category: 'entertainment', embedUrl: 'https://tubitv.com', icon: '🎬', relevantDoll: 'ember', tags: ['movies', 'tv', 'free', 'streaming'] },
  { id: 'ent-3', title: 'Crunchyroll', description: 'Anime streaming', category: 'entertainment', embedUrl: 'https://www.crunchyroll.com', icon: '🌸', relevantDoll: 'ember', tags: ['anime', 'streaming', 'japanese'] },
  { id: 'ent-4', title: 'Viki', description: 'Asian drama streaming', category: 'entertainment', embedUrl: 'https://www.viki.com', icon: '🎭', relevantDoll: 'ember', tags: ['kdrama', 'asian', 'streaming'] },
  { id: 'ent-5', title: 'Spotify', description: 'Music streaming', category: 'entertainment', embedUrl: 'https://open.spotify.com', icon: '🎵', relevantDoll: 'ember', tags: ['music', 'streaming', 'playlists'] },
  { id: 'ent-6', title: 'Bandcamp', description: 'Independent music', category: 'entertainment', embedUrl: 'https://bandcamp.com', icon: '🎸', relevantDoll: 'aria', tags: ['music', 'indie', 'artists'] },
  { id: 'ent-7', title: 'Pluto TV', description: 'Free live TV', category: 'entertainment', embedUrl: 'https://pluto.tv', icon: '📡', relevantDoll: 'ember', tags: ['tv', 'live', 'free', 'streaming'] },

  // Streaming Platforms
  { id: 'stream-1', title: 'Netflix', description: 'Premium streaming service', category: 'streaming', embedUrl: 'https://www.netflix.com', icon: '🎬', relevantDoll: 'ember', tags: ['movies', 'tv', 'premium', 'originals'] },
  { id: 'stream-2', title: 'Hulu', description: 'TV and movie streaming', category: 'streaming', embedUrl: 'https://www.hulu.com', icon: '📺', relevantDoll: 'ember', tags: ['tv', 'movies', 'next-day'] },
  { id: 'stream-3', title: 'Disney+', description: 'Disney, Marvel, Star Wars', category: 'streaming', embedUrl: 'https://www.disneyplus.com', icon: '🏰', relevantDoll: 'ember', tags: ['disney', 'marvel', 'pixar', 'family'] },
  { id: 'stream-4', title: 'HBO Max', description: 'HBO content and more', category: 'streaming', embedUrl: 'https://www.max.com', icon: '🎭', relevantDoll: 'ember', tags: ['hbo', 'movies', 'premium'] },

  // Communication
  { id: 'comm-1', title: 'Discord', description: 'Community chat platform', category: 'communication', embedUrl: 'https://discord.com/app', icon: '💬', relevantDoll: 'harmony', tags: ['chat', 'gaming', 'community', 'voice'] },
  { id: 'comm-2', title: 'Slack', description: 'Team collaboration', category: 'communication', embedUrl: 'https://app.slack.com', icon: '📱', relevantDoll: 'atlas', tags: ['work', 'team', 'collaboration'] },
  { id: 'comm-3', title: 'Notion', description: 'Notes and productivity', category: 'communication', embedUrl: 'https://notion.so', icon: '📝', relevantDoll: 'atlas', tags: ['notes', 'productivity', 'organization'] },
  { id: 'comm-4', title: 'Figma', description: 'Design collaboration', category: 'communication', embedUrl: 'https://www.figma.com', icon: '🎨', relevantDoll: 'aria', tags: ['design', 'collaboration', 'ui'] },

  // Wellness & Self-Care
  { id: 'well-1', title: 'Headspace', description: 'Meditation and mindfulness', category: 'learning', subcategory: 'Wellness', url: 'https://www.headspace.com', icon: '🧘', relevantDoll: 'harmony', tags: ['meditation', 'mental-health', 'mindfulness'] },
  { id: 'well-2', title: 'Yoga With Adriene', description: 'Free yoga videos', category: 'learning', subcategory: 'Wellness', url: 'https://www.youtube.com/c/yogawithadriene', icon: '🧘‍♀️', relevantDoll: 'harmony', tags: ['yoga', 'free', 'exercise', 'video'] },
  { id: 'well-3', title: 'AllRecipes', description: 'Cooking recipes', category: 'learning', subcategory: 'Cooking', url: 'https://www.allrecipes.com', icon: '🍳', relevantDoll: 'atlas', tags: ['cooking', 'recipes', 'food'] },
];

// ============================================================================
// SUGGESTION ENGINE
// ============================================================================

const getContextualSuggestions = (context: SearchContext): SearchResult[] => {
  const suggestions: SearchResult[] = [];
  const { currentArea, timeOfDay, recentActivities } = context;

  // Time-based suggestions
  if (timeOfDay === 'morning') {
    suggestions.push(...UNIFIED_RESOURCES.filter(r =>
      r.tags.includes('meditation') || r.tags.includes('yoga') || r.tags.includes('mindfulness')
    ).slice(0, 2));
    suggestions.push(...UNIFIED_RESOURCES.filter(r => r.category === 'learning').slice(0, 2));
  } else if (timeOfDay === 'evening') {
    suggestions.push(...UNIFIED_RESOURCES.filter(r =>
      r.category === 'entertainment' || r.category === 'streaming'
    ).slice(0, 3));
  }

  // Area-based suggestions
  if (currentArea === 'languages') {
    suggestions.push(...UNIFIED_RESOURCES.filter(r => r.category === 'language').slice(0, 3));
  } else if (currentArea === 'gaming') {
    suggestions.push(...UNIFIED_RESOURCES.filter(r => r.category === 'gaming').slice(0, 3));
  } else if (currentArea === 'creative') {
    suggestions.push(...UNIFIED_RESOURCES.filter(r =>
      r.category === 'sewing' || r.relevantDoll === 'aria'
    ).slice(0, 3));
  }

  // Remove duplicates
  return [...new Map(suggestions.map(s => [s.id, s])).values()].slice(0, 6);
};

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

export const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  onNavigate,
  onSelectResource,
  context = {},
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'suggestions' | 'dolls'>('search');

  // Time of day
  const timeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 6) return 'night' as const;
    if (hour < 12) return 'morning' as const;
    if (hour < 17) return 'afternoon' as const;
    if (hour < 21) return 'evening' as const;
    return 'night' as const;
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return UNIFIED_RESOURCES.filter(resource => {
      const matchesQuery =
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.tags.some(tag => tag.includes(lowerQuery)) ||
        (resource.subcategory?.toLowerCase().includes(lowerQuery));

      const matchesCategory = !selectedCategory || resource.category === selectedCategory;

      return matchesQuery && matchesCategory;
    }).slice(0, 12);
  }, [query, selectedCategory]);

  // Contextual suggestions
  const suggestions = useMemo(() =>
    getContextualSuggestions({ ...context, timeOfDay }),
    [context, timeOfDay]
  );

  const handleSelectResource = useCallback((resource: SearchResult) => {
    onSelectResource?.(resource);
    setIsOpen(false);
    setQuery('');
  }, [onSelectResource]);

  const getDollForResource = (dollId: string): DollCharacter | undefined => {
    return DOLL_CHARACTERS.find(d => d.id === dollId);
  };

  const categories = [
    { id: 'language', label: '🌍 Languages', color: 'purple' },
    { id: 'gaming', label: '🎮 Gaming', color: 'cyan' },
    { id: 'sewing', label: '✂️ Crafts', color: 'pink' },
    { id: 'learning', label: '📚 Learning', color: 'emerald' },
    { id: 'entertainment', label: '🎬 Entertainment', color: 'orange' },
    { id: 'streaming', label: '📺 Streaming', color: 'red' },
    { id: 'communication', label: '💬 Communication', color: 'blue' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/80 border border-purple-500/30
                   hover:border-purple-500/50 transition-all w-full max-w-md"
      >
        <span className="text-xl">🔮</span>
        <span className="text-gray-400">Search the Dollhouse...</span>
        <span className="ml-auto text-xs text-gray-500 hidden sm:block">⌘K</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20 px-4">
          <div className="bg-gray-900 rounded-2xl border border-purple-500/30 w-full max-w-2xl
                          shadow-2xl shadow-purple-500/20 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <input
                  type="text"
                  placeholder="Search languages, games, crafts, learning resources..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                {(['search', 'suggestions', 'dolls'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeTab === tab
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {tab === 'search' && '🔍 Search'}
                    {tab === 'suggestions' && '💡 For You'}
                    {tab === 'dolls' && '✨ Ask a Doll'}
                  </button>
                ))}
              </div>

              {/* Categories */}
              {activeTab === 'search' && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      !selectedCategory
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        selectedCategory === cat.id
                          ? `bg-${cat.color}-600 text-white`
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {/* Search Results */}
              {activeTab === 'search' && (
                <>
                  {query && searchResults.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <span className="text-4xl block mb-3">🔍</span>
                      <p>No results found for "{query}"</p>
                      <p className="text-sm mt-2">Try different keywords or browse categories</p>
                    </div>
                  )}

                  {!query && (
                    <div className="text-center py-8 text-gray-400">
                      <span className="text-4xl block mb-3">✨</span>
                      <p>Start typing to search across all resources</p>
                      <p className="text-sm mt-2">Or check out the suggestions tab for personalized picks!</p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    {searchResults.map((result) => {
                      const doll = getDollForResource(result.relevantDoll);
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelectResource(result)}
                          className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800
                                     border border-gray-700/50 hover:border-purple-500/30 transition-all text-left"
                        >
                          <span className="text-2xl">{result.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{result.title}</span>
                              {result.subcategory && (
                                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                                  {result.subcategory}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">{result.description}</p>
                          </div>
                          {doll && (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <span>{doll.avatar}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Suggestions */}
              {activeTab === 'suggestions' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/20">
                    <h3 className="font-medium text-purple-200 mb-2">
                      Good {timeOfDay}! Here are some picks for you ✨
                    </h3>
                    <p className="text-sm text-gray-400">
                      Based on the time of day and your recent activities
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {suggestions.map((result) => {
                      const doll = getDollForResource(result.relevantDoll);
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelectResource(result)}
                          className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r
                                     ${doll?.bgGradient || 'from-gray-800 to-gray-900'}
                                     border border-white/10 hover:border-white/30 transition-all text-left`}
                        >
                          <span className="text-3xl">{result.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white">{result.title}</div>
                            <p className="text-sm text-gray-300">{result.description}</p>
                          </div>
                          {doll && (
                            <div className="text-2xl">{doll.avatar}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dolls */}
              {activeTab === 'dolls' && (
                <div className="grid grid-cols-2 gap-3">
                  {DOLL_CHARACTERS.map((doll) => (
                    <button
                      key={doll.id}
                      onClick={() => {
                        // Filter resources by doll specialty
                        const dollResources = UNIFIED_RESOURCES.filter(r => r.relevantDoll === doll.id);
                        if (dollResources.length > 0) {
                          handleSelectResource(dollResources[0]);
                        }
                      }}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${doll.bgGradient}
                                 border border-white/10 hover:border-white/30 transition-all hover:scale-105`}
                    >
                      <span className="text-5xl">{doll.avatar}</span>
                      <div className="text-center">
                        <div className="font-bold text-white">{doll.name}</div>
                        <div className="text-xs text-gray-300">{doll.role}</div>
                        <div className="flex flex-wrap gap-1 mt-2 justify-center">
                          {doll.specialty.slice(0, 2).map((s, i) => (
                            <span key={i} className="text-xs bg-white/10 px-2 py-0.5 rounded text-white">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
              <div>
                🏠 Kol's Dollhouse
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSearch;
export { UNIFIED_RESOURCES };
