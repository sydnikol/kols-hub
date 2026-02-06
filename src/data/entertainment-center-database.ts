/**
 * Entertainment Center Database
 * ==============================
 * Comprehensive database of all entertainment media apps, streaming services,
 * readers, and media servers for the Gothic Mansion Living Room
 *
 * Categories:
 * - Anime Streaming & Management
 * - Manga/Comics Readers & Servers
 * - KDrama & Asian Media
 * - eBook Libraries & Readers
 * - Movie/Video Streaming
 * - Music & Audio
 * - Media Servers (Self-Hosted)
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type EntertainmentCategory =
  | 'anime-streaming'
  | 'manga-reader'
  | 'comics-server'
  | 'kdrama'
  | 'ebook-library'
  | 'ebook-reader'
  | 'movie-streaming'
  | 'music-player'
  | 'media-server'
  | 'tracking'
  | 'downloader';

export type Platform =
  | 'web'
  | 'windows'
  | 'macos'
  | 'linux'
  | 'android'
  | 'ios'
  | 'android-tv'
  | 'self-hosted'
  | 'cross-platform';

export interface EntertainmentApp {
  id: string;
  name: string;
  description: string;
  category: EntertainmentCategory;
  subcategories?: EntertainmentCategory[];
  platforms: Platform[];
  url?: string;
  github?: string;
  isOpenSource: boolean;
  isFree: boolean;
  license?: string;
  features: string[];
  tags: string[];
  rating?: number;
  integratedInApp?: boolean;
  embedUrl?: string;
  apiEndpoint?: string;
}

export interface MediaLibrary {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'books' | 'papers' | 'magazines' | 'comics' | 'audiobooks' | 'mixed';
  itemCount?: number;
  isFree: boolean;
  requiresAccount: boolean;
  features: string[];
}

// ============================================================================
// ANIME STREAMING & MANAGEMENT APPS
// ============================================================================

export const ANIME_APPS: EntertainmentApp[] = [
  {
    id: 'seanime',
    name: 'Seanime',
    description: 'Open-source media server with web interface and desktop app for anime and manga. Features library scanning, downloading, transcoding, torrent streaming, and more.',
    category: 'anime-streaming',
    subcategories: ['manga-reader', 'media-server'],
    platforms: ['windows', 'macos', 'linux', 'web'],
    url: 'https://seanime.app/',
    github: 'https://github.com/5rahim/seanime',
    isOpenSource: true,
    isFree: true,
    license: 'MIT',
    features: [
      'BitTorrent & Debrid support',
      'Automatic episode downloading',
      'Stream without waiting for downloads',
      'FFmpeg transcoding with hardware acceleration',
      'Manga reading with multiple sources',
      'Extension system (Go/JS/TS)',
      'Desktop notifications',
      'MyAnimeList/AniList tracking'
    ],
    tags: ['anime', 'manga', 'streaming', 'media-server', 'torrent', 'desktop'],
    rating: 4.8,
    integratedInApp: true
  },
  {
    id: 'mangayomi',
    name: 'Mangayomi',
    description: 'Free and open source application for reading manga, novels, and watching anime. Inspired by Tachiyomi and Aniyomi, built with Flutter.',
    category: 'anime-streaming',
    subcategories: ['manga-reader'],
    platforms: ['android', 'ios', 'windows', 'macos', 'linux'],
    github: 'https://github.com/kodjodevf/mangayomi',
    isOpenSource: true,
    isFree: true,
    license: 'Apache-2.0',
    features: [
      'Read manga, webtoons, comics, novels',
      'Watch anime and movies',
      'Configurable reader with multiple viewers',
      'Tracker support (MAL, AniList, Kitsu)',
      'External sources via dart_eval',
      'JavaScript engine (ES2020)',
      'Offline reading support',
      'Cross-platform sync'
    ],
    tags: ['anime', 'manga', 'novels', 'flutter', 'cross-platform', 'mobile'],
    rating: 4.7,
    integratedInApp: true
  },
  {
    id: 'anikku',
    name: 'Anikku',
    description: 'Free and open source anime watcher for Android. Adaptive fork from Aniyomi and Komikku with advanced player and library features.',
    category: 'anime-streaming',
    platforms: ['android', 'android-tv'],
    url: 'https://anikku.com/',
    github: 'https://github.com/komikku-app/anikku',
    isOpenSource: true,
    isFree: true,
    features: [
      'mpv-android based player',
      'Custom audio/video/subtitle settings',
      'Auto-detect intros and credits',
      'Dynamic categories and tags',
      'Merge separate anime entries',
      'MAL/AniList/Kitsu/Shikimori tracking',
      'Discord Rich Presence',
      'Android TV compatible',
      'Google Drive sync'
    ],
    tags: ['anime', 'android', 'player', 'tracking', 'tv'],
    rating: 4.6,
    integratedInApp: true
  },
  {
    id: 'ani-cli',
    name: 'ani-cli',
    description: 'CLI tool to browse and watch anime from the terminal. Lightweight and scriptable.',
    category: 'anime-streaming',
    platforms: ['windows', 'macos', 'linux'],
    github: 'https://github.com/pystardust/ani-cli',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-3.0',
    features: [
      'Terminal-based anime watching',
      'Multiple quality options',
      'Download support',
      'History tracking',
      'Scriptable interface',
      'Minimal dependencies'
    ],
    tags: ['anime', 'cli', 'terminal', 'lightweight'],
    rating: 4.5,
    integratedInApp: false
  },
  {
    id: 'animity',
    name: 'Animity',
    description: 'Android app to watch anime without ads. High-quality streaming with AniList sync.',
    category: 'anime-streaming',
    platforms: ['android'],
    github: 'https://github.com/kl3jvi/animity',
    isOpenSource: true,
    isFree: true,
    features: [
      'Ad-free streaming',
      'High-quality playback',
      'AniList integration',
      'Watchlist management',
      'Clean UI',
      'Multiple sources'
    ],
    tags: ['anime', 'android', 'ad-free', 'anilist'],
    rating: 4.4,
    integratedInApp: true
  },
  {
    id: 'anime-tv',
    name: 'AnimeTV',
    description: 'Android TV application for watching anime series and movies. Works on non-TV Android devices too.',
    category: 'anime-streaming',
    platforms: ['android-tv', 'android'],
    github: 'https://github.com/AhmadAli-Dev/AnimeTV',
    isOpenSource: true,
    isFree: true,
    features: [
      'Optimized for TV',
      'HD streaming',
      'Episode tracking',
      'Search functionality',
      'Works on mobile',
      'Remote friendly'
    ],
    tags: ['anime', 'android-tv', 'tv', 'streaming'],
    rating: 4.3,
    integratedInApp: true
  },
  {
    id: 'nekoflix',
    name: 'Nekoflix',
    description: 'All-in-one destination for anime and manga enthusiasts. Stream anime and read manga free of charge.',
    category: 'anime-streaming',
    subcategories: ['manga-reader'],
    platforms: ['android'],
    isOpenSource: true,
    isFree: true,
    features: [
      'Anime streaming',
      'Manga reading',
      'Free access',
      'No ads',
      'Multiple sources',
      'Offline support'
    ],
    tags: ['anime', 'manga', 'free', 'android'],
    rating: 4.4,
    integratedInApp: true
  }
];

// ============================================================================
// MANGA & COMICS APPS
// ============================================================================

export const MANGA_COMICS_APPS: EntertainmentApp[] = [
  {
    id: 'komga',
    name: 'Komga',
    description: 'Free and open source media server for comics, mangas, BDs, magazines, and eBooks with API, OPDS, Kobo Sync and KOReader support.',
    category: 'comics-server',
    subcategories: ['manga-reader', 'media-server'],
    platforms: ['self-hosted', 'web'],
    url: 'https://komga.org/',
    github: 'https://github.com/gotson/komga',
    isOpenSource: true,
    isFree: true,
    license: 'MIT',
    features: [
      'Responsive web UI',
      'Collections and read lists',
      'Web-based reader',
      'OPDS support',
      'Tachiyomi plugin',
      'Full folder structure support',
      'Beautiful thumbnails',
      'REST API',
      'Handles 80k+ books efficiently'
    ],
    tags: ['comics', 'manga', 'server', 'self-hosted', 'opds'],
    rating: 4.9,
    integratedInApp: true
  },
  {
    id: 'stump',
    name: 'Stump',
    description: 'Free and open source comics, manga and digital book server with OPDS support. Built with Rust, Axum, Prisma and React.',
    category: 'comics-server',
    subcategories: ['manga-reader', 'ebook-reader'],
    platforms: ['self-hosted', 'web'],
    url: 'https://www.stumpapp.dev/',
    github: 'https://github.com/stumpapp/stump',
    isOpenSource: true,
    isFree: true,
    license: 'MIT',
    features: [
      'Fast scanning',
      'Low memory usage',
      'Search within books',
      'OPDS support',
      'Modern React UI',
      'Docker support',
      'Multiple format support'
    ],
    tags: ['comics', 'manga', 'ebooks', 'server', 'rust'],
    rating: 4.5,
    integratedInApp: true
  },
  {
    id: 'tachiyomi',
    name: 'Tachiyomi',
    description: 'Free and open source manga reader for Android. Supports hundreds of sources via extensions.',
    category: 'manga-reader',
    platforms: ['android'],
    github: 'https://github.com/tachiyomiorg/tachiyomi',
    isOpenSource: true,
    isFree: true,
    license: 'Apache-2.0',
    features: [
      'Hundreds of manga sources',
      'Local reading of downloaded manga',
      'Configurable reader',
      'Tracker integration',
      'Library organization',
      'Scheduled updates',
      'Extension system'
    ],
    tags: ['manga', 'android', 'reader', 'extensions'],
    rating: 4.9,
    integratedInApp: true
  },
  {
    id: 'komikku',
    name: 'Komikku',
    description: 'Manga reader for GNOME. Read online and offline manga with an intuitive interface.',
    category: 'manga-reader',
    platforms: ['linux'],
    github: 'https://gitlab.com/valos/Komikku',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-3.0',
    features: [
      'GNOME integration',
      'Online reading',
      'Offline support',
      'Multiple sources',
      'Library management',
      'Reading progress tracking'
    ],
    tags: ['manga', 'linux', 'gnome', 'reader'],
    rating: 4.5,
    integratedInApp: false
  },
  {
    id: 'atsumeru',
    name: 'Atsumeru',
    description: 'Free self-hosted mangas/comics/light novels media server. Organize and read your collection anywhere.',
    category: 'comics-server',
    subcategories: ['manga-reader'],
    platforms: ['self-hosted', 'web'],
    url: 'https://atsumeru.xyz/',
    github: 'https://github.com/AtsumeruDev/Atsumeru',
    isOpenSource: true,
    isFree: true,
    features: [
      'Manga/Comics/Light novels',
      'Web reader',
      'Mobile apps',
      'Import from various sources',
      'Metadata management',
      'Reading progress sync'
    ],
    tags: ['manga', 'comics', 'light-novels', 'server'],
    rating: 4.4,
    integratedInApp: true
  }
];

// ============================================================================
// KDRAMA & ASIAN MEDIA APPS
// ============================================================================

export const KDRAMA_APPS: EntertainmentApp[] = [
  {
    id: 'kinani',
    name: 'KinAni',
    description: 'Android app to watch and download anime, anime movies, Asian drama and movies.',
    category: 'kdrama',
    subcategories: ['anime-streaming'],
    platforms: ['android'],
    github: 'https://github.com/PyPiSan/KinAni',
    isOpenSource: true,
    isFree: true,
    features: [
      'Anime streaming',
      'Asian drama',
      'Download support',
      'Offline viewing',
      'Multiple sources',
      'Search functionality'
    ],
    tags: ['kdrama', 'anime', 'asian', 'android', 'download'],
    rating: 4.3,
    integratedInApp: true
  },
  {
    id: 'moobie',
    name: 'Moobie',
    description: 'KDrama streaming web app with clean UI/UX. Server-side rendering for fast performance.',
    category: 'kdrama',
    platforms: ['web'],
    github: 'https://github.com/Zeddxx/moobie',
    isOpenSource: true,
    isFree: true,
    features: [
      'Clean UI/UX',
      'Server-side rendering',
      'Fast loading',
      'Multiple sources',
      'Search and browse',
      'Episode tracking'
    ],
    tags: ['kdrama', 'web', 'streaming', 'react'],
    rating: 4.2,
    integratedInApp: true
  },
  {
    id: 'kd-app',
    name: 'KD',
    description: 'Ad-free KDrama streaming app built with Next.js, Drizzle ORM, NeonDB and shadcn-UI.',
    category: 'kdrama',
    platforms: ['web'],
    github: 'https://github.com/noelrohi/kd',
    isOpenSource: true,
    isFree: true,
    features: [
      'Ad-free experience',
      'Modern tech stack',
      'Fast performance',
      'Clean interface',
      'Episode navigation'
    ],
    tags: ['kdrama', 'nextjs', 'ad-free', 'web'],
    rating: 4.1,
    integratedInApp: true
  },
  {
    id: 'starlight-drama',
    name: 'Starlight',
    description: 'Open-source Android app for streaming Asian drama content in HD quality.',
    category: 'kdrama',
    platforms: ['android'],
    url: 'https://astrobinge.github.io/starlight/',
    isOpenSource: true,
    isFree: true,
    features: [
      'HD streaming',
      'Asian drama focus',
      'Clean interface',
      'Episode tracking',
      'Multiple sources'
    ],
    tags: ['kdrama', 'asian-drama', 'android', 'hd'],
    rating: 4.0,
    integratedInApp: true
  },
  {
    id: 'k-tv-plus',
    name: 'K TV+',
    description: 'Free app for watching anime and K-drama content.',
    category: 'kdrama',
    subcategories: ['anime-streaming'],
    platforms: ['android'],
    github: 'https://github.com/code77-bote/K_tv_plus-',
    isOpenSource: true,
    isFree: true,
    features: [
      'Anime and K-drama',
      'Free content',
      'Simple interface',
      'Multiple sources'
    ],
    tags: ['kdrama', 'anime', 'free', 'android'],
    rating: 3.9,
    integratedInApp: true
  }
];

// ============================================================================
// EBOOK LIBRARIES & READERS
// ============================================================================

export const EBOOK_APPS: EntertainmentApp[] = [
  {
    id: 'calibre',
    name: 'Calibre',
    description: 'Powerful and easy to use e-book manager. View, convert, edit, and catalog e-books of almost any format.',
    category: 'ebook-reader',
    subcategories: ['ebook-library'],
    platforms: ['windows', 'macos', 'linux'],
    url: 'https://calibre-ebook.com/',
    github: 'https://github.com/kovidgoyal/calibre',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-3.0',
    features: [
      'Format conversion',
      'E-book editing',
      'Library management',
      'Content server',
      'News download',
      'Device sync',
      'Metadata editing',
      'Plugin system'
    ],
    tags: ['ebook', 'library', 'converter', 'editor', 'desktop'],
    rating: 4.9,
    integratedInApp: true
  },
  {
    id: 'thorium-reader',
    name: 'Thorium Reader',
    description: 'Reference reading application for EPUB 3, audiobooks, visual narratives, PDF, and DAISY. Free with no ads.',
    category: 'ebook-reader',
    platforms: ['windows', 'macos', 'linux'],
    url: 'https://www.edrlab.org/software/thorium-reader/',
    github: 'https://github.com/edrlab/thorium-reader',
    isOpenSource: true,
    isFree: true,
    license: 'BSD-3-Clause',
    features: [
      'EPUB 3 support',
      'Audiobook support',
      'PDF support',
      'DAISY support',
      'Accessibility features',
      'No ads or tracking',
      'LCP DRM support'
    ],
    tags: ['ebook', 'epub', 'audiobook', 'pdf', 'accessible'],
    rating: 4.7,
    integratedInApp: true
  },
  {
    id: 'koodo-reader',
    name: 'Koodo Reader',
    description: 'All-in-one ebook reader to manage and study your ebooks. Cross-platform with cloud sync.',
    category: 'ebook-reader',
    platforms: ['windows', 'macos', 'linux', 'web'],
    url: 'https://koodo.960960.xyz/',
    github: 'https://github.com/koodo-reader/koodo-reader',
    isOpenSource: true,
    isFree: true,
    license: 'AGPL-3.0',
    features: [
      'Text-to-speech',
      'Translation',
      'Progress slider',
      'Bookmarks and notes',
      'Highlights',
      'Touch screen support',
      'Cloud sync',
      'Multiple themes'
    ],
    tags: ['ebook', 'reader', 'notes', 'tts', 'cross-platform'],
    rating: 4.6,
    integratedInApp: true
  },
  {
    id: 'koreader',
    name: 'KOReader',
    description: 'Document viewer for E Ink devices. Supports EPUB, PDF, DjVu, and many more formats.',
    category: 'ebook-reader',
    platforms: ['android', 'linux'],
    url: 'https://koreader.rocks/',
    github: 'https://github.com/koreader/koreader',
    isOpenSource: true,
    isFree: true,
    license: 'AGPL-3.0',
    features: [
      'E Ink optimized',
      'Multi-format support',
      'Dictionary lookup',
      'WiFi file transfer',
      'Cloud sync',
      'Highly customizable',
      'Gesture support'
    ],
    tags: ['ebook', 'e-ink', 'kindle', 'kobo', 'reader'],
    rating: 4.8,
    integratedInApp: true
  },
  {
    id: 'sumatra-pdf',
    name: 'Sumatra PDF',
    description: 'Fast, small PDF reader for Windows. Supports PDF, eBook, comic book, DjVu, XPS, and CHM.',
    category: 'ebook-reader',
    platforms: ['windows'],
    url: 'https://www.sumatrapdfreader.org/',
    github: 'https://github.com/sumatrapdfreader/sumatrapdf',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-3.0',
    features: [
      'Lightweight and fast',
      'Multi-format support',
      'Portable version',
      'Customizable keyboard shortcuts',
      'Minimal UI',
      'Low memory usage'
    ],
    tags: ['pdf', 'ebook', 'reader', 'windows', 'lightweight'],
    rating: 4.7,
    integratedInApp: false
  },
  {
    id: 'librum',
    name: 'Librum',
    description: 'Manage your online library and access it from any device. Free access to over 70,000 books.',
    category: 'ebook-library',
    subcategories: ['ebook-reader'],
    platforms: ['windows', 'macos', 'linux', 'web'],
    url: 'https://librumreader.com/',
    github: 'https://github.com/Librum-Reader/Librum',
    isOpenSource: true,
    isFree: true,
    features: [
      'Cloud library',
      '70,000+ free books',
      'Notes and bookmarks',
      'Highlighting',
      'Cross-device sync',
      'Multiple formats'
    ],
    tags: ['ebook', 'library', 'cloud', 'free-books'],
    rating: 4.5,
    integratedInApp: true
  },
  {
    id: 'readest',
    name: 'Readest',
    description: 'Modern, feature-rich ebook reader for avid readers. Seamless cross-platform access with powerful tools.',
    category: 'ebook-reader',
    platforms: ['windows', 'macos', 'linux', 'web'],
    github: 'https://github.com/readest/readest',
    isOpenSource: true,
    isFree: true,
    features: [
      'Modern interface',
      'Cross-platform sync',
      'Powerful annotation tools',
      'Reading statistics',
      'Theme customization',
      'Format conversion'
    ],
    tags: ['ebook', 'reader', 'modern', 'annotations'],
    rating: 4.4,
    integratedInApp: true
  },
  {
    id: 'coolreader',
    name: 'CoolReader',
    description: 'Fast and small cross-platform XML/CSS based eBook reader supporting FB2, TXT, RTF, EPUB, and more.',
    category: 'ebook-reader',
    platforms: ['windows', 'linux', 'android'],
    github: 'https://github.com/poire-z/crengine',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-2.0',
    features: [
      'Multiple format support',
      'Skinnable interface',
      'Text-to-speech',
      'Dictionary support',
      'Auto-scroll',
      'Bookmarks'
    ],
    tags: ['ebook', 'reader', 'lightweight', 'android'],
    rating: 4.3,
    integratedInApp: true
  }
];

// ============================================================================
// MOVIE & VIDEO STREAMING
// ============================================================================

export const MOVIE_STREAMING_APPS: EntertainmentApp[] = [
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Free software media system putting you in control of managing and streaming your media.',
    category: 'media-server',
    subcategories: ['movie-streaming'],
    platforms: ['self-hosted', 'web', 'android', 'ios', 'android-tv'],
    url: 'https://jellyfin.org/',
    github: 'https://github.com/jellyfin/jellyfin',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-2.0',
    features: [
      'No premium features',
      'Movies and TV shows',
      'Live TV and DVR',
      'Music streaming',
      'Book management',
      'Hardware transcoding',
      'Multiple user support',
      'Plugin system'
    ],
    tags: ['media-server', 'movies', 'tv', 'music', 'self-hosted'],
    rating: 4.8,
    integratedInApp: true
  },
  {
    id: 'streama',
    name: 'Streama',
    description: 'Your own personal Netflix. Self-hosted media server for organizing shows and movies.',
    category: 'movie-streaming',
    subcategories: ['media-server'],
    platforms: ['self-hosted', 'web'],
    url: 'https://docs.streama-project.com/',
    github: 'https://github.com/streamaserver/streama',
    isOpenSource: true,
    isFree: true,
    license: 'MIT',
    features: [
      'TMDB integration',
      'Auto-fill metadata',
      'Beautiful interface',
      'Resume watching',
      'Multiple users',
      'Subtitle support'
    ],
    tags: ['movies', 'tv-shows', 'self-hosted', 'netflix-like'],
    rating: 4.5,
    integratedInApp: true
  },
  {
    id: 'kodi',
    name: 'Kodi',
    description: 'Open-source media player software supporting a wide array of video formats with plugins.',
    category: 'movie-streaming',
    subcategories: ['music-player'],
    platforms: ['windows', 'macos', 'linux', 'android', 'ios'],
    url: 'https://kodi.tv/',
    github: 'https://github.com/xbmc/xbmc',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-2.0',
    features: [
      'Wide format support',
      'Plugin ecosystem',
      'Live TV/DVR',
      'Music library',
      'Addons',
      'Remote apps',
      'Skins and themes'
    ],
    tags: ['media-player', 'movies', 'music', 'plugins', 'tv'],
    rating: 4.7,
    integratedInApp: true
  },
  {
    id: 'homehost',
    name: 'Homehost',
    description: 'Self-hosted Netflix-like app for streaming your media collection.',
    category: 'movie-streaming',
    platforms: ['self-hosted', 'web'],
    github: 'https://github.com/ridhwaans/homehost',
    isOpenSource: true,
    isFree: true,
    features: [
      'Netflix-like interface',
      'Media organization',
      'Streaming support',
      'Search functionality'
    ],
    tags: ['movies', 'self-hosted', 'streaming'],
    rating: 4.2,
    integratedInApp: true
  },
  {
    id: 'oblecto',
    name: 'Oblecto',
    description: 'Media server similar to Plex/Netflix. Index and stream movies and TV shows via REST API.',
    category: 'media-server',
    platforms: ['self-hosted', 'web'],
    github: 'https://github.com/robinp7720/Oblecto',
    isOpenSource: true,
    isFree: true,
    features: [
      'REST API',
      'TMDB/TVDB integration',
      'Transcoding',
      'Multiple clients',
      'Search and filter'
    ],
    tags: ['media-server', 'movies', 'tv', 'api'],
    rating: 4.3,
    integratedInApp: true
  },
  {
    id: 'owncast',
    name: 'Owncast',
    description: 'Free and open source live streaming server. Take control over your live stream.',
    category: 'movie-streaming',
    platforms: ['self-hosted', 'web'],
    url: 'https://owncast.online/',
    github: 'https://github.com/owncast/owncast',
    isOpenSource: true,
    isFree: true,
    license: 'MIT',
    features: [
      'Live streaming',
      'Built-in chat',
      'Stream to social',
      'Customizable page',
      'Video on demand',
      'S3 storage support'
    ],
    tags: ['live-streaming', 'self-hosted', 'chat', 'broadcast'],
    rating: 4.6,
    integratedInApp: true
  },
  {
    id: 'pilipala',
    name: 'PiliPala',
    description: 'GPL-licensed third-party Bilibili client built with Flutter for Android, iOS, desktop, and web.',
    category: 'movie-streaming',
    platforms: ['android', 'ios', 'windows', 'macos', 'linux', 'web'],
    github: 'https://github.com/guozhigq/pilipala',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-3.0',
    features: [
      'Recommendations',
      'Live streams',
      'Video playback with gestures',
      'Adjustable playback speed',
      'Download support',
      'Cross-platform'
    ],
    tags: ['bilibili', 'video', 'streaming', 'flutter'],
    rating: 4.4,
    integratedInApp: true
  }
];

// ============================================================================
// MAJOR STREAMING PLATFORMS (Integrated Embeds)
// ============================================================================

export const STREAMING_PLATFORMS: EntertainmentApp[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'World\'s largest video sharing platform. Watch, share, and discover videos on any topic.',
    category: 'movie-streaming',
    subcategories: ['music-player'],
    platforms: ['web', 'android', 'ios', 'android-tv'],
    url: 'https://www.youtube.com/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Billions of videos',
      'Live streaming',
      'Music videos',
      'Shorts',
      'Subscriptions',
      'Playlists',
      'Comments and community',
      'Creator tools'
    ],
    tags: ['video', 'streaming', 'music', 'entertainment', 'social'],
    rating: 4.8,
    integratedInApp: true,
    embedUrl: 'https://www.youtube.com/embed/'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'Leading subscription streaming service for movies, TV shows, and original content.',
    category: 'movie-streaming',
    platforms: ['web', 'android', 'ios', 'android-tv'],
    url: 'https://www.netflix.com/',
    isOpenSource: false,
    isFree: false,
    features: [
      'Original content',
      'Movies and TV shows',
      'Multiple profiles',
      'Download for offline',
      'Continue watching',
      'Personalized recommendations',
      '4K HDR support',
      'Multiple languages'
    ],
    tags: ['streaming', 'movies', 'tv-shows', 'originals', 'subscription'],
    rating: 4.7,
    integratedInApp: true
  },
  {
    id: 'hulu',
    name: 'Hulu',
    description: 'Stream TV shows, movies, originals, and live TV. Next-day TV and exclusive originals.',
    category: 'movie-streaming',
    platforms: ['web', 'android', 'ios', 'android-tv'],
    url: 'https://www.hulu.com/',
    isOpenSource: false,
    isFree: false,
    features: [
      'Next-day TV episodes',
      'Hulu Originals',
      'Live TV option',
      'Movies library',
      'Ad-supported tier',
      'Multiple profiles',
      'Download for offline',
      'ESPN+ and Disney+ bundle'
    ],
    tags: ['streaming', 'tv-shows', 'movies', 'live-tv', 'subscription'],
    rating: 4.5,
    integratedInApp: true
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'World\'s most popular audio streaming platform for music, podcasts, and audiobooks.',
    category: 'music-player',
    platforms: ['web', 'windows', 'macos', 'linux', 'android', 'ios'],
    url: 'https://open.spotify.com/',
    isOpenSource: false,
    isFree: true,
    features: [
      '100+ million songs',
      'Podcasts',
      'Audiobooks',
      'Personalized playlists',
      'Discover Weekly',
      'Offline mode (Premium)',
      'Collaborative playlists',
      'Lyrics',
      'Social features'
    ],
    tags: ['music', 'streaming', 'podcasts', 'audio', 'playlists'],
    rating: 4.8,
    integratedInApp: true,
    embedUrl: 'https://open.spotify.com/embed/'
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    description: 'Discover and stream music from emerging and major artists. Upload and share your own tracks.',
    category: 'music-player',
    platforms: ['web', 'android', 'ios'],
    url: 'https://soundcloud.com/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Independent artists',
      'Upload your music',
      'Discover emerging artists',
      'Reposts and playlists',
      'Comments on waveform',
      'Pro tools for creators',
      'DJ mixes',
      'Podcasts'
    ],
    tags: ['music', 'streaming', 'indie', 'upload', 'dj', 'artists'],
    rating: 4.5,
    integratedInApp: true,
    embedUrl: 'https://w.soundcloud.com/player/?url='
  },
  {
    id: 'viki',
    name: 'Viki',
    description: 'Stream Asian dramas, movies, and TV shows with subtitles in 200+ languages.',
    category: 'kdrama',
    subcategories: ['movie-streaming'],
    platforms: ['web', 'android', 'ios', 'android-tv'],
    url: 'https://www.viki.com/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Korean dramas',
      'Chinese dramas',
      'Japanese shows',
      'Community subtitles',
      '200+ subtitle languages',
      'Learn mode',
      'Viki Originals',
      'HD streaming'
    ],
    tags: ['kdrama', 'cdrama', 'jdrama', 'asian', 'subtitles', 'streaming'],
    rating: 4.6,
    integratedInApp: true
  },
  {
    id: 'cinego',
    name: 'Cinego',
    description: 'Free movie streaming platform with extensive collection of films and TV series.',
    category: 'movie-streaming',
    platforms: ['web'],
    url: 'https://cinego.co/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Free streaming',
      'Movies and TV shows',
      'Multiple servers',
      'No registration required',
      'HD quality',
      'Subtitles'
    ],
    tags: ['movies', 'tv-shows', 'free', 'streaming'],
    rating: 4.0,
    integratedInApp: true
  },
  {
    id: 'yesmovies',
    name: 'YesMovies',
    description: 'Watch free movies and TV series online in HD quality without registration.',
    category: 'movie-streaming',
    platforms: ['web'],
    url: 'https://ww1.yesmovies.ag/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Free streaming',
      'No registration',
      'HD quality',
      'Large library',
      'Multiple genres',
      'TV series and movies',
      'Subtitles available'
    ],
    tags: ['movies', 'tv-shows', 'free', 'streaming', 'hd'],
    rating: 4.1,
    integratedInApp: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Short-form video platform for creating, sharing, and discovering entertaining content.',
    category: 'movie-streaming',
    platforms: ['web', 'android', 'ios'],
    url: 'https://www.tiktok.com/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Short-form videos',
      'For You page algorithm',
      'Video creation tools',
      'Filters and effects',
      'Duets and stitches',
      'Live streaming',
      'Sound library',
      'Creator tools',
      'Shopping integration'
    ],
    tags: ['video', 'short-form', 'social', 'entertainment', 'viral', 'creator'],
    rating: 4.7,
    integratedInApp: true,
    embedUrl: 'https://www.tiktok.com/embed/v2/'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Social networking platform with videos, groups, marketplace, and Watch.',
    category: 'movie-streaming',
    platforms: ['web', 'android', 'ios'],
    url: 'https://www.facebook.com/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Facebook Watch videos',
      'Live streaming',
      'Groups and communities',
      'Marketplace',
      'Stories and Reels',
      'Gaming',
      'Events',
      'Messenger integration'
    ],
    tags: ['social', 'video', 'streaming', 'community', 'marketplace'],
    rating: 4.3,
    integratedInApp: true,
    embedUrl: 'https://www.facebook.com/plugins/video.php?href='
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Photo and video sharing platform with Reels, Stories, and IGTV.',
    category: 'movie-streaming',
    platforms: ['web', 'android', 'ios'],
    url: 'https://www.instagram.com/',
    isOpenSource: false,
    isFree: true,
    features: [
      'Reels short videos',
      'Stories (24h)',
      'IGTV long-form',
      'Photo sharing',
      'Live streaming',
      'Direct messages',
      'Shopping',
      'Filters and effects',
      'Creator tools'
    ],
    tags: ['social', 'photos', 'video', 'reels', 'stories', 'creator'],
    rating: 4.6,
    integratedInApp: true,
    embedUrl: 'https://www.instagram.com/p/'
  }
];

// ============================================================================
// TRACKING & MANAGEMENT APPS
// ============================================================================

export const TRACKING_APPS: EntertainmentApp[] = [
  {
    id: 'kurozora',
    name: 'Kurozora',
    description: 'Open-source anime, manga, game and music discovery service with 90,000+ Japanese media.',
    category: 'tracking',
    platforms: ['ios', 'web'],
    url: 'https://kurozora.app/',
    github: 'https://github.com/Kurozora/kurozora-app',
    isOpenSource: true,
    isFree: true,
    license: 'GPL-3.0',
    features: [
      '90,000+ media entries',
      'Anime/Manga/Game tracking',
      'Six list categories',
      'Episode countdown',
      'Reminders',
      'Characters and staff info',
      'No ads',
      'Spotlight shortcuts'
    ],
    tags: ['tracking', 'anime', 'manga', 'games', 'ios'],
    rating: 4.6,
    integratedInApp: true
  }
];

// ============================================================================
// FREE ONLINE LIBRARIES
// ============================================================================

export const FREE_LIBRARIES: MediaLibrary[] = [
  {
    id: 'annas-archive',
    name: 'Anna\'s Archive',
    description: 'Shadow library search engine aggregating LibGen, Sci-Hub, Z-Library, Internet Archive, and more.',
    url: 'https://annas-archive.li/',
    category: 'mixed',
    itemCount: 157341435, // 61M books + 95M papers
    isFree: true,
    requiresAccount: false,
    features: ['Books', 'Papers', 'Magazines', 'Comics', 'Torrents', 'Multiple mirrors']
  },
  {
    id: 'libgen',
    name: 'Library Genesis',
    description: 'File-sharing website for scholarly and general-interest books, articles, and more.',
    url: 'https://libgen.is/',
    category: 'mixed',
    itemCount: 5500000,
    isFree: true,
    requiresAccount: false,
    features: ['Non-fiction', 'Fiction', 'Scientific articles', 'Comics', 'Magazines']
  },
  {
    id: 'sci-hub',
    name: 'Sci-Hub',
    description: 'Website providing free access to millions of research papers and books.',
    url: 'https://sci-hub.se/',
    category: 'papers',
    itemCount: 85000000,
    isFree: true,
    requiresAccount: false,
    features: ['Research papers', 'Journal articles', 'DOI lookup', 'Direct download']
  },
  {
    id: 'project-gutenberg',
    name: 'Project Gutenberg',
    description: 'Volunteer effort to digitize and archive cultural works. 70,000+ free ebooks.',
    url: 'https://www.gutenberg.org/',
    category: 'books',
    itemCount: 70000,
    isFree: true,
    requiresAccount: false,
    features: ['Public domain', 'Multiple formats', 'No registration', 'Legal']
  },
  {
    id: 'open-library',
    name: 'Open Library',
    description: 'Non-profit library with over 2 million free ebooks available for borrowing.',
    url: 'https://openlibrary.org/',
    category: 'books',
    itemCount: 2000000,
    isFree: true,
    requiresAccount: true,
    features: ['Borrowing system', 'Multiple formats', 'Reading lists', 'Want to read']
  },
  {
    id: 'internet-archive',
    name: 'Internet Archive',
    description: 'Digital library with 42M+ books, 866B+ web pages, and extensive media collections.',
    url: 'https://archive.org/',
    category: 'mixed',
    itemCount: 42000000,
    isFree: true,
    requiresAccount: false,
    features: ['Books', 'Movies', 'Music', 'Software', 'Wayback Machine', 'Borrowing']
  },
  {
    id: 'pdf-drive',
    name: 'PDF Drive',
    description: 'Free search engine for PDF files with around 80 million ebooks available.',
    url: 'https://www.pdfdrive.com/',
    category: 'books',
    itemCount: 80000000,
    isFree: true,
    requiresAccount: false,
    features: ['PDF format', 'Search by title/author', 'No registration', 'Preview']
  },
  {
    id: 'manybooks',
    name: 'ManyBooks',
    description: 'Free ebook resource with 50,000+ titles. Advanced search and multiple formats.',
    url: 'https://manybooks.net/',
    category: 'books',
    itemCount: 50000,
    isFree: true,
    requiresAccount: false,
    features: ['Multiple formats', 'Genre categories', 'Author search', 'Recommendations']
  },
  {
    id: 'standard-ebooks',
    name: 'Standard Ebooks',
    description: 'High-quality, carefully formatted free public domain ebooks.',
    url: 'https://standardebooks.org/',
    category: 'books',
    isFree: true,
    requiresAccount: false,
    features: ['High quality formatting', 'Modern typography', 'Public domain', 'EPUB/Kindle']
  },
  {
    id: 'librivox',
    name: 'LibriVox',
    description: 'Free public domain audiobooks read by volunteers from around the world.',
    url: 'https://librivox.org/',
    category: 'audiobooks',
    itemCount: 18000,
    isFree: true,
    requiresAccount: false,
    features: ['Free audiobooks', 'Public domain', 'MP3 download', 'Volunteer readers']
  }
];

// ============================================================================
// ALL ENTERTAINMENT APPS COMBINED
// ============================================================================

export const ALL_ENTERTAINMENT_APPS: EntertainmentApp[] = [
  ...ANIME_APPS,
  ...MANGA_COMICS_APPS,
  ...KDRAMA_APPS,
  ...EBOOK_APPS,
  ...MOVIE_STREAMING_APPS,
  ...STREAMING_PLATFORMS,
  ...TRACKING_APPS
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAppsByCategory(category: EntertainmentCategory): EntertainmentApp[] {
  return ALL_ENTERTAINMENT_APPS.filter(
    app => app.category === category || app.subcategories?.includes(category)
  );
}

export function getAppsByPlatform(platform: Platform): EntertainmentApp[] {
  return ALL_ENTERTAINMENT_APPS.filter(app => app.platforms.includes(platform));
}

export function getOpenSourceApps(): EntertainmentApp[] {
  return ALL_ENTERTAINMENT_APPS.filter(app => app.isOpenSource);
}

export function getFreeApps(): EntertainmentApp[] {
  return ALL_ENTERTAINMENT_APPS.filter(app => app.isFree);
}

export function getIntegratedApps(): EntertainmentApp[] {
  return ALL_ENTERTAINMENT_APPS.filter(app => app.integratedInApp);
}

export function searchApps(query: string): EntertainmentApp[] {
  const lowerQuery = query.toLowerCase();
  return ALL_ENTERTAINMENT_APPS.filter(app =>
    app.name.toLowerCase().includes(lowerQuery) ||
    app.description.toLowerCase().includes(lowerQuery) ||
    app.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAppById(id: string): EntertainmentApp | undefined {
  return ALL_ENTERTAINMENT_APPS.find(app => app.id === id);
}

export function getLibraryById(id: string): MediaLibrary | undefined {
  return FREE_LIBRARIES.find(lib => lib.id === id);
}

export function getEntertainmentStats() {
  return {
    totalApps: ALL_ENTERTAINMENT_APPS.length,
    animeApps: ANIME_APPS.length,
    mangaComicsApps: MANGA_COMICS_APPS.length,
    kdramaApps: KDRAMA_APPS.length,
    ebookApps: EBOOK_APPS.length,
    movieApps: MOVIE_STREAMING_APPS.length,
    streamingPlatforms: STREAMING_PLATFORMS.length,
    trackingApps: TRACKING_APPS.length,
    freeLibraries: FREE_LIBRARIES.length,
    totalOpenSource: ALL_ENTERTAINMENT_APPS.filter(a => a.isOpenSource).length,
    totalIntegrated: ALL_ENTERTAINMENT_APPS.filter(a => a.integratedInApp).length
  };
}
