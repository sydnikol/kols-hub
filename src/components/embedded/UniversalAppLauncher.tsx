/**
 * Universal App Launcher
 * =======================
 * Launch and embed any web app, tool, or service
 * With categories, favorites, and activity tracking
 */

import React, { useState, useEffect, useMemo } from 'react';
import { EmbeddedResourceViewer } from './EmbeddedResourceViewer';

// ============================================================================
// COMPREHENSIVE APP DATABASE
// ============================================================================

export interface AppResource {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  subcategory?: string;
  tags: string[];
  isFree: boolean;
  requiresLogin?: boolean;
  embedSupported: boolean;
}

export const ALL_APPS: AppResource[] = [
  // ===== PRODUCTIVITY =====
  { id: 'notion', name: 'Notion', description: 'All-in-one workspace', url: 'https://notion.so', icon: '📝', category: 'productivity', tags: ['notes', 'wiki', 'database'], isFree: true, embedSupported: true },
  { id: 'todoist', name: 'Todoist', description: 'Task management', url: 'https://todoist.com', icon: '✅', category: 'productivity', tags: ['tasks', 'todo'], isFree: true, embedSupported: true },
  { id: 'trello', name: 'Trello', description: 'Kanban boards', url: 'https://trello.com', icon: '📋', category: 'productivity', tags: ['kanban', 'projects'], isFree: true, embedSupported: true },
  { id: 'airtable', name: 'Airtable', description: 'Spreadsheet-database hybrid', url: 'https://airtable.com', icon: '📊', category: 'productivity', tags: ['database', 'spreadsheet'], isFree: true, embedSupported: true },
  { id: 'miro', name: 'Miro', description: 'Collaborative whiteboard', url: 'https://miro.com', icon: '🎨', category: 'productivity', tags: ['whiteboard', 'collaboration'], isFree: true, embedSupported: true },
  { id: 'figma', name: 'Figma', description: 'Design collaboration', url: 'https://figma.com', icon: '🎯', category: 'productivity', subcategory: 'design', tags: ['design', 'ui', 'prototyping'], isFree: true, embedSupported: true },
  { id: 'canva', name: 'Canva', description: 'Graphic design', url: 'https://canva.com', icon: '🖼️', category: 'productivity', subcategory: 'design', tags: ['design', 'graphics'], isFree: true, embedSupported: true },

  // ===== COMMUNICATION =====
  { id: 'discord', name: 'Discord', description: 'Community chat', url: 'https://discord.com/app', icon: '💬', category: 'communication', tags: ['chat', 'voice', 'gaming'], isFree: true, embedSupported: true },
  { id: 'slack', name: 'Slack', description: 'Team messaging', url: 'https://app.slack.com', icon: '📱', category: 'communication', tags: ['work', 'messaging'], isFree: true, embedSupported: true },
  { id: 'telegram', name: 'Telegram Web', description: 'Secure messaging', url: 'https://web.telegram.org', icon: '✈️', category: 'communication', tags: ['messaging', 'secure'], isFree: true, embedSupported: true },
  { id: 'zoom', name: 'Zoom', description: 'Video conferencing', url: 'https://zoom.us/join', icon: '📹', category: 'communication', tags: ['video', 'meetings'], isFree: true, embedSupported: true },
  { id: 'meet', name: 'Google Meet', description: 'Video meetings', url: 'https://meet.google.com', icon: '🎥', category: 'communication', tags: ['video', 'google'], isFree: true, embedSupported: true },
  { id: 'jitsi', name: 'Jitsi Meet', description: 'Open source video', url: 'https://meet.jit.si', icon: '📞', category: 'communication', tags: ['video', 'open-source'], isFree: true, embedSupported: true },

  // ===== ENTERTAINMENT =====
  { id: 'youtube', name: 'YouTube', description: 'Video streaming', url: 'https://youtube.com', icon: '📺', category: 'entertainment', tags: ['video', 'streaming'], isFree: true, embedSupported: true },
  { id: 'twitch', name: 'Twitch', description: 'Live streaming', url: 'https://twitch.tv', icon: '🎮', category: 'entertainment', tags: ['gaming', 'live'], isFree: true, embedSupported: true },
  { id: 'spotify', name: 'Spotify', description: 'Music streaming', url: 'https://open.spotify.com', icon: '🎵', category: 'entertainment', subcategory: 'music', tags: ['music', 'streaming'], isFree: true, embedSupported: true },
  { id: 'soundcloud', name: 'SoundCloud', description: 'Music platform', url: 'https://soundcloud.com', icon: '🎧', category: 'entertainment', subcategory: 'music', tags: ['music', 'indie'], isFree: true, embedSupported: true },
  { id: 'bandcamp', name: 'Bandcamp', description: 'Indie music', url: 'https://bandcamp.com', icon: '🎸', category: 'entertainment', subcategory: 'music', tags: ['music', 'indie', 'artists'], isFree: true, embedSupported: true },
  { id: 'tubi', name: 'Tubi', description: 'Free movies & TV', url: 'https://tubitv.com', icon: '🎬', category: 'entertainment', subcategory: 'streaming', tags: ['movies', 'tv', 'free'], isFree: true, embedSupported: true },
  { id: 'pluto', name: 'Pluto TV', description: 'Free live TV', url: 'https://pluto.tv', icon: '📡', category: 'entertainment', subcategory: 'streaming', tags: ['tv', 'live', 'free'], isFree: true, embedSupported: true },
  { id: 'crunchyroll', name: 'Crunchyroll', description: 'Anime streaming', url: 'https://crunchyroll.com', icon: '🌸', category: 'entertainment', subcategory: 'anime', tags: ['anime', 'streaming'], isFree: true, embedSupported: true },
  { id: 'netflix', name: 'Netflix', description: 'Premium streaming', url: 'https://netflix.com', icon: '🎬', category: 'entertainment', subcategory: 'streaming', tags: ['movies', 'tv', 'premium'], isFree: false, requiresLogin: true, embedSupported: true },
  { id: 'viki', name: 'Viki', description: 'Asian drama', url: 'https://viki.com', icon: '🎭', category: 'entertainment', subcategory: 'kdrama', tags: ['kdrama', 'asian'], isFree: true, embedSupported: true },

  // ===== GAMING =====
  { id: 'arcade', name: 'Internet Arcade', description: 'Classic arcade games', url: 'https://archive.org/details/internetarcade', icon: '👾', category: 'gaming', tags: ['retro', 'arcade', 'free'], isFree: true, embedSupported: true },
  { id: 'itchio', name: 'itch.io', description: 'Indie games', url: 'https://itch.io', icon: '🎯', category: 'gaming', tags: ['indie', 'free', 'browser'], isFree: true, embedSupported: true },
  { id: 'kongregate', name: 'Kongregate', description: 'Browser games', url: 'https://kongregate.com', icon: '🕹️', category: 'gaming', tags: ['browser', 'flash', 'free'], isFree: true, embedSupported: true },
  { id: 'poki', name: 'Poki', description: 'Free online games', url: 'https://poki.com', icon: '🎲', category: 'gaming', tags: ['browser', 'casual', 'free'], isFree: true, embedSupported: true },
  { id: 'crazygames', name: 'CrazyGames', description: 'Browser games', url: 'https://www.crazygames.com', icon: '🎪', category: 'gaming', tags: ['browser', 'free'], isFree: true, embedSupported: true },
  { id: 'godot', name: 'Godot Engine', description: 'Game development', url: 'https://godotengine.org', icon: '⚙️', category: 'gaming', subcategory: 'development', tags: ['gamedev', 'engine'], isFree: true, embedSupported: true },
  { id: 'phaser', name: 'Phaser.js', description: 'HTML5 game framework', url: 'https://phaser.io', icon: '🎮', category: 'gaming', subcategory: 'development', tags: ['gamedev', 'html5'], isFree: true, embedSupported: true },

  // ===== LEARNING =====
  { id: 'khan', name: 'Khan Academy', description: 'Free education', url: 'https://khanacademy.org', icon: '🎓', category: 'learning', tags: ['courses', 'free', 'math', 'science'], isFree: true, embedSupported: true },
  { id: 'coursera', name: 'Coursera', description: 'Online courses', url: 'https://coursera.org', icon: '🏛️', category: 'learning', tags: ['courses', 'university'], isFree: true, embedSupported: true },
  { id: 'edx', name: 'edX', description: 'University courses', url: 'https://edx.org', icon: '📚', category: 'learning', tags: ['courses', 'university', 'free'], isFree: true, embedSupported: true },
  { id: 'codecademy', name: 'Codecademy', description: 'Learn to code', url: 'https://codecademy.com', icon: '💻', category: 'learning', subcategory: 'coding', tags: ['coding', 'programming'], isFree: true, embedSupported: true },
  { id: 'freecodecamp', name: 'freeCodeCamp', description: 'Free coding courses', url: 'https://freecodecamp.org', icon: '🔥', category: 'learning', subcategory: 'coding', tags: ['coding', 'free', 'web'], isFree: true, embedSupported: true },
  { id: 'duolingo', name: 'Duolingo', description: 'Language learning', url: 'https://duolingo.com', icon: '🦉', category: 'learning', subcategory: 'languages', tags: ['languages', 'gamified'], isFree: true, embedSupported: true },
  { id: 'ted', name: 'TED Talks', description: 'Ideas worth spreading', url: 'https://ted.com', icon: '🎤', category: 'learning', tags: ['talks', 'ideas', 'inspiration'], isFree: true, embedSupported: true },
  { id: 'openculture', name: 'OpenCulture', description: 'Free courses & books', url: 'https://openculture.com', icon: '📖', category: 'learning', tags: ['free', 'courses', 'books', 'movies'], isFree: true, embedSupported: true },
  { id: 'documentaryheaven', name: 'Documentary Heaven', description: 'Free documentaries', url: 'https://documentaryheaven.com', icon: '🎬', category: 'learning', tags: ['documentaries', 'free'], isFree: true, embedSupported: true },

  // ===== LANGUAGE LEARNING =====
  { id: 'tofugu', name: 'Tofugu', description: 'Japanese learning', url: 'https://tofugu.com', icon: '🇯🇵', category: 'learning', subcategory: 'languages', tags: ['japanese', 'hiragana'], isFree: true, embedSupported: true },
  { id: 'nhk', name: 'NHK World', description: 'Japanese lessons', url: 'https://www.nhk.or.jp/lesson/english/', icon: '🗾', category: 'learning', subcategory: 'languages', tags: ['japanese', 'audio'], isFree: true, embedSupported: true },
  { id: 'ttmik', name: 'Talk To Me In Korean', description: 'Korean lessons', url: 'https://talktomeinkorean.com', icon: '🇰🇷', category: 'learning', subcategory: 'languages', tags: ['korean', 'hangul'], isFree: true, embedSupported: true },
  { id: 'spanishdict', name: 'SpanishDict', description: 'Spanish learning', url: 'https://spanishdict.com', icon: '🇪🇸', category: 'learning', subcategory: 'languages', tags: ['spanish', 'dictionary'], isFree: true, embedSupported: true },
  { id: 'dw', name: 'DW Learn German', description: 'German courses', url: 'https://learngerman.dw.com', icon: '🇩🇪', category: 'learning', subcategory: 'languages', tags: ['german', 'video'], isFree: true, embedSupported: true },
  { id: 'tv5', name: 'TV5 Monde', description: 'French exercises', url: 'https://apprendre.tv5monde.com', icon: '🇫🇷', category: 'learning', subcategory: 'languages', tags: ['french', 'video'], isFree: true, embedSupported: true },

  // ===== CREATIVE =====
  { id: 'photopea', name: 'Photopea', description: 'Free Photoshop alternative', url: 'https://photopea.com', icon: '🎨', category: 'creative', subcategory: 'art', tags: ['photo', 'editing', 'free'], isFree: true, embedSupported: true },
  { id: 'pixlr', name: 'Pixlr', description: 'Photo editor', url: 'https://pixlr.com/x/', icon: '📸', category: 'creative', subcategory: 'art', tags: ['photo', 'editing'], isFree: true, embedSupported: true },
  { id: 'excalidraw', name: 'Excalidraw', description: 'Whiteboard sketching', url: 'https://excalidraw.com', icon: '✏️', category: 'creative', subcategory: 'art', tags: ['drawing', 'whiteboard'], isFree: true, embedSupported: true },
  { id: 'tldraw', name: 'tldraw', description: 'Collaborative drawing', url: 'https://tldraw.com', icon: '🖌️', category: 'creative', subcategory: 'art', tags: ['drawing', 'collaboration'], isFree: true, embedSupported: true },
  { id: 'remove-bg', name: 'Remove.bg', description: 'Remove backgrounds', url: 'https://remove.bg', icon: '✂️', category: 'creative', subcategory: 'art', tags: ['photo', 'background'], isFree: true, embedSupported: true },

  // ===== SEWING & CRAFTS =====
  { id: 'freesewing', name: 'FreeSewing', description: 'Open source patterns', url: 'https://freesewing.org', icon: '✂️', category: 'creative', subcategory: 'sewing', tags: ['patterns', 'custom', 'free'], isFree: true, embedSupported: true },
  { id: 'allfreesewing', name: 'AllFreeSewing', description: 'Free patterns', url: 'https://allfreesewing.com', icon: '🧵', category: 'creative', subcategory: 'sewing', tags: ['patterns', 'free'], isFree: true, embedSupported: true },
  { id: 'sewcanshe', name: 'Sew Can She', description: 'Sewing patterns', url: 'https://sewcanshe.com', icon: '👗', category: 'creative', subcategory: 'sewing', tags: ['patterns', 'tutorials'], isFree: true, embedSupported: true },
  { id: 'moodfabrics', name: 'Mood Fabrics', description: 'Patterns & fabrics', url: 'https://moodfabrics.com/blog', icon: '🎨', category: 'creative', subcategory: 'sewing', tags: ['patterns', 'designer'], isFree: true, embedSupported: true },

  // ===== DEVELOPER TOOLS =====
  { id: 'github', name: 'GitHub', description: 'Code hosting', url: 'https://github.com', icon: '🐱', category: 'developer', tags: ['code', 'git', 'open-source'], isFree: true, embedSupported: true },
  { id: 'codepen', name: 'CodePen', description: 'Frontend playground', url: 'https://codepen.io', icon: '✒️', category: 'developer', tags: ['code', 'frontend', 'playground'], isFree: true, embedSupported: true },
  { id: 'replit', name: 'Replit', description: 'Online IDE', url: 'https://replit.com', icon: '💻', category: 'developer', tags: ['ide', 'code', 'cloud'], isFree: true, embedSupported: true },
  { id: 'stackblitz', name: 'StackBlitz', description: 'Web IDE', url: 'https://stackblitz.com', icon: '⚡', category: 'developer', tags: ['ide', 'web', 'instant'], isFree: true, embedSupported: true },
  { id: 'codesandbox', name: 'CodeSandbox', description: 'Cloud development', url: 'https://codesandbox.io', icon: '📦', category: 'developer', tags: ['ide', 'cloud', 'react'], isFree: true, embedSupported: true },
  { id: 'glitch', name: 'Glitch', description: 'Build web apps', url: 'https://glitch.com', icon: '🎏', category: 'developer', tags: ['code', 'hosting', 'collaboration'], isFree: true, embedSupported: true },

  // ===== AI TOOLS =====
  { id: 'chatgpt', name: 'ChatGPT', description: 'AI assistant', url: 'https://chat.openai.com', icon: '🤖', category: 'ai', tags: ['ai', 'chat', 'assistant'], isFree: true, requiresLogin: true, embedSupported: true },
  { id: 'claude', name: 'Claude', description: 'AI by Anthropic', url: 'https://claude.ai', icon: '🧠', category: 'ai', tags: ['ai', 'chat', 'assistant'], isFree: true, requiresLogin: true, embedSupported: true },
  { id: 'perplexity', name: 'Perplexity', description: 'AI search', url: 'https://perplexity.ai', icon: '🔍', category: 'ai', tags: ['ai', 'search', 'research'], isFree: true, embedSupported: true },
  { id: 'huggingface', name: 'Hugging Face', description: 'AI models', url: 'https://huggingface.co', icon: '🤗', category: 'ai', tags: ['ai', 'models', 'ml'], isFree: true, embedSupported: true },
  { id: 'replicate', name: 'Replicate', description: 'AI model APIs', url: 'https://replicate.com', icon: '🔄', category: 'ai', tags: ['ai', 'api', 'models'], isFree: true, embedSupported: true },

  // ===== SOCIAL =====
  { id: 'twitter', name: 'Twitter/X', description: 'Social network', url: 'https://twitter.com', icon: '🐦', category: 'social', tags: ['social', 'news'], isFree: true, embedSupported: true },
  { id: 'reddit', name: 'Reddit', description: 'Community forums', url: 'https://reddit.com', icon: '🤖', category: 'social', tags: ['forums', 'community'], isFree: true, embedSupported: true },
  { id: 'instagram', name: 'Instagram', description: 'Photo sharing', url: 'https://instagram.com', icon: '📷', category: 'social', tags: ['photos', 'social'], isFree: true, embedSupported: true },
  { id: 'tiktok', name: 'TikTok', description: 'Short videos', url: 'https://tiktok.com', icon: '🎵', category: 'social', tags: ['video', 'social'], isFree: true, embedSupported: true },
  { id: 'linkedin', name: 'LinkedIn', description: 'Professional network', url: 'https://linkedin.com', icon: '💼', category: 'social', tags: ['professional', 'jobs'], isFree: true, embedSupported: true },

  // ===== UTILITIES =====
  { id: 'wolframalpha', name: 'Wolfram Alpha', description: 'Computational knowledge', url: 'https://wolframalpha.com', icon: '🧮', category: 'utilities', tags: ['math', 'knowledge', 'compute'], isFree: true, embedSupported: true },
  { id: 'desmos', name: 'Desmos', description: 'Graphing calculator', url: 'https://desmos.com/calculator', icon: '📈', category: 'utilities', tags: ['math', 'graphs', 'calculator'], isFree: true, embedSupported: true },
  { id: 'wayback', name: 'Wayback Machine', description: 'Internet archive', url: 'https://web.archive.org', icon: '🕰️', category: 'utilities', tags: ['archive', 'history'], isFree: true, embedSupported: true },
  { id: 'speedtest', name: 'Speedtest', description: 'Internet speed test', url: 'https://speedtest.net', icon: '⚡', category: 'utilities', tags: ['internet', 'speed'], isFree: true, embedSupported: true },
];

// ============================================================================
// CATEGORIES
// ============================================================================

const CATEGORIES = [
  { id: 'all', name: 'All Apps', icon: '🌐' },
  { id: 'productivity', name: 'Productivity', icon: '📋' },
  { id: 'communication', name: 'Communication', icon: '💬' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'learning', name: 'Learning', icon: '📚' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'developer', name: 'Developer', icon: '💻' },
  { id: 'ai', name: 'AI Tools', icon: '🤖' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'utilities', name: 'Utilities', icon: '🔧' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface UniversalAppLauncherProps {
  className?: string;
  onAppLaunch?: (app: AppResource) => void;
  defaultCategory?: string;
  showEmbedded?: boolean;
}

export const UniversalAppLauncher: React.FC<UniversalAppLauncherProps> = ({
  className = '',
  onAppLaunch,
  defaultCategory = 'all',
  showEmbedded = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApp, setActiveApp] = useState<AppResource | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kol-app-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentApps, setRecentApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('kol-recent-apps');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter apps
  const filteredApps = useMemo(() => {
    return ALL_APPS.filter(app => {
      const matchesCategory = selectedCategory === 'all' ||
        app.category === selectedCategory ||
        (selectedCategory === 'favorites' && favorites.includes(app.id)) ||
        (selectedCategory === 'recent' && recentApps.includes(app.id));

      const matchesSearch = !searchQuery ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some(tag => tag.includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, favorites, recentApps]);

  // Launch app
  const handleLaunchApp = (app: AppResource) => {
    setActiveApp(app);

    // Update recent apps
    const newRecent = [app.id, ...recentApps.filter(id => id !== app.id)].slice(0, 10);
    setRecentApps(newRecent);
    localStorage.setItem('kol-recent-apps', JSON.stringify(newRecent));

    onAppLaunch?.(app);
  };

  // Toggle favorite
  const toggleFavorite = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(appId)
      ? favorites.filter(id => id !== appId)
      : [...favorites, appId];
    setFavorites(newFavorites);
    localStorage.setItem('kol-app-favorites', JSON.stringify(newFavorites));
  };

  // Close embedded app
  const closeApp = () => {
    setActiveApp(null);
  };

  return (
    <div className={`bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 min-h-screen ${className}`}>
      {/* Active App Viewer */}
      {activeApp && showEmbedded && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4">
          <EmbeddedResourceViewer
            url={activeApp.url}
            title={activeApp.name}
            icon={activeApp.icon}
            category={activeApp.category}
            onClose={closeApp}
            className="h-full"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🚀 Universal App Launcher
          </h1>
          <p className="text-gray-400">Access {ALL_APPS.length}+ apps, tools, and services - all embedded in your dollhouse</p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800 border border-purple-500/30 rounded-xl
                         text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory('favorites')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              selectedCategory === 'favorites'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <span>⭐</span>
            <span>Favorites</span>
          </button>
          <button
            onClick={() => setSelectedCategory('recent')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              selectedCategory === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <span>🕐</span>
            <span>Recent</span>
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredApps.map(app => (
            <button
              key={app.id}
              onClick={() => handleLaunchApp(app)}
              className="relative group p-4 bg-gray-800/50 rounded-xl border border-gray-700/50
                         hover:border-purple-500/50 hover:bg-gray-800 transition-all text-left"
            >
              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(app.id, e)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {favorites.includes(app.id) ? '⭐' : '☆'}
              </button>

              <div className="text-3xl mb-2">{app.icon}</div>
              <h3 className="font-medium text-white truncate">{app.name}</h3>
              <p className="text-xs text-gray-400 truncate">{app.description}</p>

              <div className="flex items-center gap-2 mt-2">
                {app.isFree && (
                  <span className="text-xs bg-green-600/30 text-green-400 px-2 py-0.5 rounded">FREE</span>
                )}
                {app.requiresLogin && (
                  <span className="text-xs bg-yellow-600/30 text-yellow-400 px-2 py-0.5 rounded">Login</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl block mb-4">🔍</span>
            <p>No apps found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalAppLauncher;
