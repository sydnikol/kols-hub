/**
 * Gaming Database
 * ================
 * Free games, game development tools, game archives, and gaming resources
 * All resources are FREE or have free tiers
 */

// ============================================================================
// TYPES
// ============================================================================

export interface GameResource {
  id: string;
  name: string;
  category: GameCategory;
  subcategory?: string;
  description: string;
  url: string;
  icon: string;
  features: string[];
  pricing: 'free' | 'freemium' | 'free-tier';
  rating?: number;
  isOpenSource?: boolean;
  platforms?: string[];
}

export interface GameEngine {
  id: string;
  name: string;
  description: string;
  url: string;
  downloadUrl?: string;
  github?: string;
  icon: string;
  features: string[];
  languages: string[];
  pricing: 'free' | 'freemium';
  rating?: number;
  isOpenSource?: boolean;
}

export type GameCategory =
  | 'game-engine'
  | 'game-archive'
  | 'game-library'
  | 'game-database'
  | 'free-games'
  | 'browser-games'
  | 'retro-games'
  | 'indie-games'
  | 'game-manager'
  | 'open-source-games'
  | 'game-history';

// ============================================================================
// GAME ENGINES & DEVELOPMENT
// ============================================================================

export const GAME_ENGINES: GameEngine[] = [
  {
    id: 'godot',
    name: 'Godot Engine',
    description: 'Feature-packed, cross-platform game engine for 2D and 3D games. Completely free and open source.',
    url: 'https://godotengine.org/',
    downloadUrl: 'https://godotengine.org/download/',
    github: 'https://github.com/godotengine/godot',
    icon: '🎮',
    features: [
      '2D and 3D support',
      'GDScript (Python-like)',
      'C# support',
      'Visual scripting',
      'Scene system',
      'Animation tools',
      'Physics engine',
      'Cross-platform export',
      'No royalties'
    ],
    languages: ['GDScript', 'C#', 'C++', 'VisualScript'],
    pricing: 'free',
    rating: 4.9,
    isOpenSource: true
  },
  {
    id: 'phaser',
    name: 'Phaser',
    description: 'Fast, free, and fun HTML5 game framework for making 2D games for desktop and mobile browsers.',
    url: 'https://phaser.io/',
    downloadUrl: 'https://phaser.io/download/stable',
    github: 'https://github.com/photonstorm/phaser',
    icon: '⚡',
    features: [
      'HTML5/JavaScript',
      'WebGL and Canvas',
      'Physics systems',
      'Particle effects',
      'Tilemaps',
      'Animations',
      'Sound support',
      'Mobile ready',
      'Plugin system'
    ],
    languages: ['JavaScript', 'TypeScript'],
    pricing: 'free',
    rating: 4.7,
    isOpenSource: true
  },
  {
    id: 'unity',
    name: 'Unity (Personal)',
    description: 'Industry-standard game engine with free personal license for indie developers.',
    url: 'https://unity.com/',
    downloadUrl: 'https://unity.com/download',
    icon: '🔮',
    features: [
      '2D and 3D games',
      'C# scripting',
      'Asset Store',
      'Visual scripting',
      'Cross-platform',
      'VR/AR support',
      'Multiplayer tools',
      'Analytics'
    ],
    languages: ['C#'],
    pricing: 'freemium',
    rating: 4.8,
    isOpenSource: false
  },
  {
    id: 'unreal',
    name: 'Unreal Engine',
    description: 'Powerful 3D game engine with free access and royalty-based licensing.',
    url: 'https://www.unrealengine.com/',
    downloadUrl: 'https://www.unrealengine.com/download',
    icon: '🎬',
    features: [
      'AAA graphics',
      'Blueprints visual scripting',
      'C++ support',
      'Marketplace',
      'Multiplayer',
      'VR support',
      'Film tools',
      'MetaHumans'
    ],
    languages: ['C++', 'Blueprints'],
    pricing: 'freemium',
    rating: 4.9,
    isOpenSource: false
  },
  {
    id: 'construct',
    name: 'Construct 3',
    description: 'No-code game engine for creating 2D games directly in your browser.',
    url: 'https://www.construct.net/',
    icon: '🔧',
    features: [
      'No coding required',
      'Browser-based',
      'Event sheets',
      'Instant preview',
      'HTML5 export',
      'Built-in behaviors',
      'Multiplayer',
      'Templates'
    ],
    languages: ['Visual (No-code)', 'JavaScript'],
    pricing: 'freemium',
    rating: 4.5,
    isOpenSource: false
  },
  {
    id: 'renpy',
    name: "Ren'Py",
    description: 'Visual novel engine used by thousands of creators. Perfect for storytelling games.',
    url: 'https://www.renpy.org/',
    downloadUrl: 'https://www.renpy.org/latest.html',
    github: 'https://github.com/renpy/renpy',
    icon: '📖',
    features: [
      'Visual novels',
      'Python scripting',
      'Save/load system',
      'Rollback',
      'Cross-platform',
      'Animation support',
      'Localization',
      'Customizable UI'
    ],
    languages: ['Python', 'Ren\'Py Script'],
    pricing: 'free',
    rating: 4.7,
    isOpenSource: true
  },
  {
    id: 'love2d',
    name: 'LÖVE',
    description: 'Free 2D game engine using Lua scripting. Simple, fast, and fun.',
    url: 'https://love2d.org/',
    downloadUrl: 'https://love2d.org/',
    github: 'https://github.com/love2d/love',
    icon: '💖',
    features: [
      '2D focused',
      'Lua scripting',
      'Simple API',
      'Fast prototyping',
      'Physics (Box2D)',
      'Audio support',
      'Cross-platform',
      'Lightweight'
    ],
    languages: ['Lua'],
    pricing: 'free',
    rating: 4.6,
    isOpenSource: true
  },
  {
    id: 'pygame',
    name: 'Pygame',
    description: 'Python library for making games. Great for learning game development.',
    url: 'https://www.pygame.org/',
    github: 'https://github.com/pygame/pygame',
    icon: '🐍',
    features: [
      'Python based',
      'Beginner friendly',
      '2D graphics',
      'Sound support',
      'Input handling',
      'Sprites',
      'Collision detection',
      'Extensive docs'
    ],
    languages: ['Python'],
    pricing: 'free',
    rating: 4.4,
    isOpenSource: true
  }
];

// ============================================================================
// GAME ARCHIVES & HISTORY
// ============================================================================

export const GAME_ARCHIVES: GameResource[] = [
  {
    id: 'internet-arcade',
    name: 'Internet Arcade',
    url: 'https://archive.org/details/internetarcade',
    category: 'retro-games',
    icon: '🕹️',
    description: 'Play thousands of classic arcade games in your browser via Internet Archive.',
    features: ['Classic arcade games', 'Browser playable', 'Free to play', 'No download needed'],
    pricing: 'free',
    rating: 4.8
  },
  {
    id: 'archive-software',
    name: 'Archive.org Software Library',
    url: 'https://archive.org/details/software',
    category: 'game-archive',
    icon: '💾',
    description: 'Massive collection of vintage games, DOS games, and abandonware.',
    features: ['DOS games', 'Vintage software', 'Console ROMs', 'Emulation'],
    pricing: 'free',
    rating: 4.7
  },
  {
    id: 'game-history-archive',
    name: 'Video Game History Archive',
    url: 'https://archive.gamehistory.org/',
    category: 'game-history',
    icon: '🏛️',
    description: 'Video Game History Foundation archive of game history materials.',
    features: ['Historical documents', 'Game preservation', 'Research materials', 'Scans'],
    pricing: 'free',
    rating: 4.6
  },
  {
    id: 'game-history-library',
    name: 'Video Game History Library',
    url: 'https://library.gamehistory.org/',
    category: 'game-history',
    icon: '📚',
    description: 'Digital library of video game magazines, manuals, and documentation.',
    features: ['Game magazines', 'Manuals', 'Strategy guides', 'Documentation'],
    pricing: 'free',
    rating: 4.5
  },
  {
    id: 'video-game-library',
    name: 'The Video Game Library',
    url: 'https://www.thevideogamelibrary.org/',
    category: 'game-library',
    icon: '🎮',
    description: 'Comprehensive video game library and preservation project.',
    features: ['Game preservation', 'Library catalog', 'Research', 'Education'],
    pricing: 'free',
    rating: 4.4
  },
  {
    id: 'ccs-gaming-lib',
    name: 'CCS Gaming Library',
    url: 'https://libguides.ccsdetroit.edu/vid/game',
    category: 'game-library',
    icon: '🎓',
    description: 'College for Creative Studies video game library resources.',
    features: ['Academic resources', 'Game design', 'Development guides', 'Research'],
    pricing: 'free',
    rating: 4.3
  }
];

// ============================================================================
// GAME DATABASES & CATALOGS
// ============================================================================

export const GAME_DATABASES: GameResource[] = [
  {
    id: 'mobygames',
    name: 'MobyGames',
    url: 'https://www.mobygames.com/',
    category: 'game-database',
    icon: '📊',
    description: 'Comprehensive video game documentation and database since 1999.',
    features: ['Game database', 'Credits', 'Screenshots', 'Reviews', 'Covers'],
    pricing: 'free',
    rating: 4.8
  },
  {
    id: 'igdb',
    name: 'IGDB',
    url: 'https://www.igdb.com/',
    category: 'game-database',
    icon: '🗃️',
    description: 'Internet Game Database - comprehensive game information powered by Twitch.',
    features: ['Game info', 'Release dates', 'Platforms', 'API access', 'Community'],
    pricing: 'free',
    rating: 4.7
  },
  {
    id: 'rawg',
    name: 'RAWG',
    url: 'https://rawg.io/',
    category: 'game-database',
    icon: '🎯',
    description: 'Video game discovery platform with 500,000+ games.',
    features: ['Game discovery', 'Collection tracking', 'Reviews', 'API', 'Wishlist'],
    pricing: 'free',
    rating: 4.6
  }
];

// ============================================================================
// FREE & OPEN SOURCE GAMES
// ============================================================================

export const FREE_GAMES: GameResource[] = [
  {
    id: 'gog-free',
    name: 'GOG Free Games',
    url: 'https://www.gog.com/en/games?priceRange=0,0',
    category: 'free-games',
    icon: '🎁',
    description: 'DRM-free games from GOG, including free classics and giveaways.',
    features: ['DRM-free', 'Free classics', 'Weekly giveaways', 'No launcher needed'],
    pricing: 'free',
    rating: 4.8
  },
  {
    id: 'itch-io',
    name: 'itch.io Free Games',
    url: 'https://itch.io/games/free',
    category: 'indie-games',
    icon: '🎨',
    description: 'Thousands of free indie games from independent developers.',
    features: ['Indie games', 'Game jams', 'Name your price', 'Browser games'],
    pricing: 'free',
    rating: 4.7
  },
  {
    id: 'kongregate',
    name: 'Kongregate',
    url: 'https://www.kongregate.com/',
    category: 'browser-games',
    icon: '🌐',
    description: 'Classic browser gaming portal with thousands of free Flash and HTML5 games.',
    features: ['Browser games', 'Achievements', 'Leaderboards', 'Community'],
    pricing: 'free',
    rating: 4.5
  },
  {
    id: 'foss-games',
    name: 'FOSS Games',
    url: 'https://fossgames.com/',
    category: 'open-source-games',
    icon: '🔓',
    description: 'Directory of free and open source games.',
    features: ['Open source', 'Multiple platforms', 'Source code', 'Community'],
    pricing: 'free',
    rating: 4.4,
    isOpenSource: true
  },
  {
    id: 'awesome-oss-games',
    name: 'Awesome Open Source Games',
    url: 'https://github.com/michelpereira/awesome-open-source-games',
    category: 'open-source-games',
    icon: '⭐',
    description: 'Curated list of open source games on GitHub.',
    features: ['GitHub repos', 'Source code', 'Multiple genres', 'Curated list'],
    pricing: 'free',
    rating: 4.6,
    isOpenSource: true
  },
  {
    id: 'reddit-oss-games',
    name: 'r/opensourcegames',
    url: 'https://www.reddit.com/r/opensourcegames/',
    category: 'open-source-games',
    icon: '📱',
    description: 'Reddit community for discovering and discussing open source games.',
    features: ['Community', 'Recommendations', 'Discussions', 'New releases'],
    pricing: 'free',
    rating: 4.3,
    isOpenSource: true
  }
];

// ============================================================================
// GAME MANAGERS & LAUNCHERS
// ============================================================================

export const GAME_MANAGERS: GameResource[] = [
  {
    id: 'playnite',
    name: 'Playnite',
    url: 'https://playnite.link/',
    category: 'game-manager',
    icon: '📚',
    description: 'Open source video game library manager with support for all platforms.',
    features: [
      'Unified library',
      'All launchers',
      'Emulator support',
      'Themes',
      'Extensions',
      'Metadata',
      'IGDB integration'
    ],
    pricing: 'free',
    rating: 4.9,
    isOpenSource: true,
    platforms: ['Windows']
  },
  {
    id: 'heroic',
    name: 'Heroic Games Launcher',
    url: 'https://heroicgameslauncher.com/',
    category: 'game-manager',
    icon: '🦸',
    description: 'Open source Epic Games and GOG launcher for Linux, Windows, and macOS.',
    features: ['Epic Games', 'GOG support', 'Wine/Proton', 'Cloud saves', 'Linux native'],
    pricing: 'free',
    rating: 4.7,
    isOpenSource: true,
    platforms: ['Windows', 'Linux', 'macOS']
  },
  {
    id: 'lutris',
    name: 'Lutris',
    url: 'https://lutris.net/',
    category: 'game-manager',
    icon: '🐧',
    description: 'Open gaming platform for Linux. Install and play games from any source.',
    features: ['Linux gaming', 'Wine integration', 'Emulators', 'Install scripts', 'Community'],
    pricing: 'free',
    rating: 4.6,
    isOpenSource: true,
    platforms: ['Linux']
  },
  {
    id: 'gamestream',
    name: 'Moonlight',
    url: 'https://moonlight-stream.org/',
    category: 'game-manager',
    icon: '🌙',
    description: 'Open source NVIDIA GameStream client for streaming PC games.',
    features: ['Game streaming', 'Low latency', 'Multi-platform', '4K HDR', 'Controller support'],
    pricing: 'free',
    rating: 4.7,
    isOpenSource: true,
    platforms: ['Windows', 'Linux', 'macOS', 'Android', 'iOS']
  }
];

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

export const ALL_GAME_RESOURCES: GameResource[] = [
  ...GAME_ARCHIVES,
  ...GAME_DATABASES,
  ...FREE_GAMES,
  ...GAME_MANAGERS
];

export const ALL_GAME_ENGINES: GameEngine[] = GAME_ENGINES;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getResourcesByCategory = (category: GameCategory): GameResource[] => {
  return ALL_GAME_RESOURCES.filter(r => r.category === category);
};

export const getOpenSourceResources = (): GameResource[] => {
  return ALL_GAME_RESOURCES.filter(r => r.isOpenSource);
};

export const getOpenSourceEngines = (): GameEngine[] => {
  return GAME_ENGINES.filter(e => e.isOpenSource);
};

export const getGamingStats = () => ({
  totalResources: ALL_GAME_RESOURCES.length,
  totalEngines: GAME_ENGINES.length,
  openSourceGames: getOpenSourceResources().length,
  openSourceEngines: getOpenSourceEngines().length,
  categories: {
    archives: GAME_ARCHIVES.length,
    databases: GAME_DATABASES.length,
    freeGames: FREE_GAMES.length,
    managers: GAME_MANAGERS.length
  }
});
