/**
 * TORRENT CLIENTS DATABASE
 * Comprehensive torrent client information for Kol's Hub
 * Includes web-based, desktop, and mobile clients
 */

export interface TorrentClient {
  id: string;
  name: string;
  description: string;
  type: 'web' | 'desktop' | 'mobile' | 'hybrid';
  platforms: ('windows' | 'mac' | 'linux' | 'android' | 'ios' | 'web')[];
  downloadUrl: string;
  webUiUrl?: string;
  githubUrl?: string;
  features: string[];
  isOpenSource: boolean;
  hasWebUI: boolean;
  icon: string;
  category: 'main' | 'lightweight' | 'specialized' | 'web-based';
}

export const TORRENT_CLIENTS: TorrentClient[] = [
  // Main Clients
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    description: 'Free, open-source BitTorrent client with no ads. Feature-rich and lightweight.',
    type: 'desktop',
    platforms: ['windows', 'mac', 'linux'],
    downloadUrl: 'https://www.qbittorrent.org/download',
    webUiUrl: 'http://localhost:8080',
    githubUrl: 'https://github.com/qbittorrent/qBittorrent',
    features: ['No ads', 'Integrated search', 'Web UI', 'RSS support', 'Sequential downloading', 'IP filtering'],
    isOpenSource: true,
    hasWebUI: true,
    icon: '🔷',
    category: 'main'
  },
  {
    id: 'pikatorrent',
    name: 'PikaTorrent',
    description: 'Modern, cross-platform torrent client built with Electron. Beautiful UI.',
    type: 'hybrid',
    platforms: ['windows', 'mac', 'linux', 'web'],
    downloadUrl: 'https://www.pikatorrent.com/',
    githubUrl: 'https://github.com/G-Ray/pikatorrent',
    features: ['Modern UI', 'Cross-platform', 'Web version', 'Simple interface', 'Built with Electron'],
    isOpenSource: true,
    hasWebUI: true,
    icon: '⚡',
    category: 'main'
  },
  {
    id: 'transmission',
    name: 'Transmission',
    description: 'Simple, lightweight, and powerful torrent client.',
    type: 'desktop',
    platforms: ['windows', 'mac', 'linux'],
    downloadUrl: 'https://transmissionbt.com/download',
    webUiUrl: 'http://localhost:9091',
    githubUrl: 'https://github.com/transmission/transmission',
    features: ['Lightweight', 'Simple interface', 'Web UI', 'Low resource usage', 'Encryption'],
    isOpenSource: true,
    hasWebUI: true,
    icon: '🔴',
    category: 'lightweight'
  },
  {
    id: 'deluge',
    name: 'Deluge',
    description: 'Lightweight, cross-platform BitTorrent client with plugin support.',
    type: 'desktop',
    platforms: ['windows', 'mac', 'linux'],
    downloadUrl: 'https://deluge-torrent.org/download/',
    githubUrl: 'https://github.com/deluge-torrent/deluge',
    features: ['Plugin system', 'Web UI', 'Daemon mode', 'Encryption', 'Bandwidth scheduling'],
    isOpenSource: true,
    hasWebUI: true,
    icon: '🔵',
    category: 'main'
  },
  {
    id: 'webtorrent',
    name: 'WebTorrent',
    description: 'Streaming torrent client for the browser and desktop. Play while downloading.',
    type: 'web',
    platforms: ['web', 'windows', 'mac', 'linux'],
    downloadUrl: 'https://webtorrent.io/desktop/',
    githubUrl: 'https://github.com/webtorrent/webtorrent',
    features: ['Stream while downloading', 'Browser-based', 'Desktop app', 'Chromecast support', 'WebRTC'],
    isOpenSource: true,
    hasWebUI: true,
    icon: '🌐',
    category: 'web-based'
  },
  {
    id: 'instant-io',
    name: 'Instant.io',
    description: 'Stream torrents directly in your browser using WebTorrent.',
    type: 'web',
    platforms: ['web'],
    downloadUrl: 'https://instant.io/',
    githubUrl: 'https://github.com/webtorrent/instant.io',
    features: ['Browser-based', 'No installation', 'Stream videos', 'Share files', 'WebRTC'],
    isOpenSource: true,
    hasWebUI: true,
    icon: '⚡',
    category: 'web-based'
  },
  {
    id: 'btorrent',
    name: 'βTorrent',
    description: 'Fully-featured browser torrent client using WebTorrent.',
    type: 'web',
    platforms: ['web'],
    downloadUrl: 'https://btorrent.xyz/',
    githubUrl: 'https://github.com/nicholasf/btorrent',
    features: ['Browser-based', 'Full-featured', 'Magnet links', 'Video streaming', 'No signup'],
    isOpenSource: true,
    hasWebUI: true,
    icon: '🅱️',
    category: 'web-based'
  },
  {
    id: 'libretorrent',
    name: 'LibreTorrent',
    description: 'Free, open-source torrent client for Android with no ads.',
    type: 'mobile',
    platforms: ['android'],
    downloadUrl: 'https://play.google.com/store/apps/details?id=org.proninyaroslav.libretorrent',
    githubUrl: 'https://github.com/proninyaroslav/libretorrent',
    features: ['No ads', 'Material design', 'RSS support', 'Sequential downloading', 'WiFi only option'],
    isOpenSource: true,
    hasWebUI: false,
    icon: '📱',
    category: 'mobile'
  },
  {
    id: 'flud',
    name: 'Flud',
    description: 'Simple and beautiful BitTorrent client for Android.',
    type: 'mobile',
    platforms: ['android'],
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.delphicoder.flud',
    features: ['Material design', 'Magnet links', 'DHT', 'Encryption', 'Sequential downloading'],
    isOpenSource: false,
    hasWebUI: false,
    icon: '📲',
    category: 'mobile'
  },
  {
    id: 'rtorrent',
    name: 'rTorrent',
    description: 'Text-based ncurses BitTorrent client for power users.',
    type: 'desktop',
    platforms: ['linux', 'mac'],
    downloadUrl: 'https://github.com/rakshasa/rtorrent/releases',
    githubUrl: 'https://github.com/rakshasa/rtorrent',
    features: ['Text-based', 'Low resources', 'Scriptable', 'XML-RPC', 'ruTorrent web UI'],
    isOpenSource: true,
    hasWebUI: false,
    icon: '🖥️',
    category: 'specialized'
  },
  {
    id: 'aria2',
    name: 'aria2',
    description: 'Lightweight multi-protocol download utility supporting BitTorrent.',
    type: 'desktop',
    platforms: ['windows', 'mac', 'linux'],
    downloadUrl: 'https://aria2.github.io/',
    githubUrl: 'https://github.com/aria2/aria2',
    features: ['Multi-protocol', 'Command-line', 'JSON-RPC', 'Metalink', 'Low memory'],
    isOpenSource: true,
    hasWebUI: false,
    icon: '⬇️',
    category: 'specialized'
  }
];

export interface TorrentSite {
  id: string;
  name: string;
  url: string;
  category: 'general' | 'movies' | 'tv' | 'music' | 'games' | 'software' | 'books' | 'anime';
  description: string;
  isActive: boolean;
}

export const TORRENT_SITES: TorrentSite[] = [
  // General
  { id: '1337x', name: '1337x', url: 'https://1337x.to/', category: 'general', description: 'General torrents', isActive: true },
  { id: 'rarbg', name: 'RARBG Mirrors', url: 'https://rarbgmirror.org/', category: 'general', description: 'Movies, TV, Games', isActive: true },
  { id: 'torrentgalaxy', name: 'TorrentGalaxy', url: 'https://torrentgalaxy.to/', category: 'general', description: 'General torrents', isActive: true },

  // Movies & TV
  { id: 'yts', name: 'YTS', url: 'https://yts.mx/', category: 'movies', description: 'HD movies', isActive: true },
  { id: 'eztv', name: 'EZTV', url: 'https://eztv.re/', category: 'tv', description: 'TV shows', isActive: true },

  // Anime
  { id: 'nyaa', name: 'Nyaa', url: 'https://nyaa.si/', category: 'anime', description: 'Anime torrents', isActive: true },
  { id: 'animek', name: 'AnimeK', url: 'https://animek.to/', category: 'anime', description: 'Anime torrents', isActive: true },

  // Books
  { id: 'libgen', name: 'Library Genesis', url: 'https://libgen.is/', category: 'books', description: 'E-books', isActive: true },
  { id: 'audiobookbay', name: 'AudioBook Bay', url: 'https://audiobookbay.is/', category: 'books', description: 'Audiobooks', isActive: true },

  // Music
  { id: 'rutracker', name: 'RuTracker', url: 'https://rutracker.org/', category: 'music', description: 'Music & Audio', isActive: true },

  // Games
  { id: 'fitgirl', name: 'FitGirl Repacks', url: 'https://fitgirl-repacks.site/', category: 'games', description: 'Game repacks', isActive: true },
  { id: 'dodi', name: 'DODI Repacks', url: 'https://dodi-repacks.site/', category: 'games', description: 'Game repacks', isActive: true }
];

export const WEB_TORRENT_PLAYERS = [
  {
    id: 'instant-io',
    name: 'Instant.io',
    url: 'https://instant.io/',
    description: 'Stream torrents in browser',
    embedUrl: 'https://instant.io/'
  },
  {
    id: 'webtorrent',
    name: 'WebTorrent.io',
    url: 'https://webtorrent.io/intro',
    description: 'WebTorrent streaming player',
    embedUrl: 'https://webtorrent.io/intro'
  },
  {
    id: 'btorrent',
    name: 'βTorrent',
    url: 'https://btorrent.xyz/',
    description: 'Full browser torrent client',
    embedUrl: 'https://btorrent.xyz/'
  },
  {
    id: 'seedr',
    name: 'Seedr',
    url: 'https://www.seedr.cc/',
    description: 'Cloud torrent streaming',
    embedUrl: 'https://www.seedr.cc/'
  }
];
