/**
 * Streaming Platform Launcher
 * ============================
 * Launch and track streaming platforms directly in the app
 * Netflix, Hulu, Viki, and more - all embedded with activity tracking
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface StreamingLauncherProps {
  className?: string;
  onActivityLog?: (activity: StreamingActivity) => void;
}

interface StreamingPlatform {
  id: string;
  name: string;
  url: string;
  icon: string;
  logo?: string;
  description: string;
  category: 'subscription' | 'free' | 'anime' | 'kdrama' | 'music';
  color: string;
  bgGradient: string;
}

interface StreamingActivity {
  platformId: string;
  platformName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

interface WatchHistory {
  id: string;
  platformId: string;
  platformName: string;
  icon: string;
  startTime: Date;
  duration: number;
}

// ============================================================================
// STREAMING PLATFORMS DATABASE
// ============================================================================

const STREAMING_PLATFORMS: StreamingPlatform[] = [
  // Subscription Services
  {
    id: 'netflix',
    name: 'Netflix',
    url: 'https://www.netflix.com/',
    icon: '🎬',
    description: 'Movies, TV shows, and originals',
    category: 'subscription',
    color: 'red',
    bgGradient: 'from-red-900 to-black'
  },
  {
    id: 'hulu',
    name: 'Hulu',
    url: 'https://www.hulu.com/',
    icon: '📺',
    description: 'Stream TV and movies',
    category: 'subscription',
    color: 'green',
    bgGradient: 'from-green-700 to-green-900'
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    url: 'https://www.disneyplus.com/',
    icon: '🏰',
    description: 'Disney, Pixar, Marvel, Star Wars',
    category: 'subscription',
    color: 'blue',
    bgGradient: 'from-blue-800 to-indigo-900'
  },
  {
    id: 'hbo-max',
    name: 'Max',
    url: 'https://www.max.com/',
    icon: '🎭',
    description: 'HBO originals and Warner Bros',
    category: 'subscription',
    color: 'purple',
    bgGradient: 'from-purple-900 to-violet-900'
  },
  {
    id: 'amazon-prime',
    name: 'Prime Video',
    url: 'https://www.amazon.com/Prime-Video/',
    icon: '📦',
    description: 'Amazon Prime streaming',
    category: 'subscription',
    color: 'cyan',
    bgGradient: 'from-cyan-800 to-blue-900'
  },
  {
    id: 'paramount-plus',
    name: 'Paramount+',
    url: 'https://www.paramountplus.com/',
    icon: '⛰️',
    description: 'CBS, MTV, Comedy Central & more',
    category: 'subscription',
    color: 'blue',
    bgGradient: 'from-blue-700 to-blue-900'
  },
  {
    id: 'peacock',
    name: 'Peacock',
    url: 'https://www.peacocktv.com/',
    icon: '🦚',
    description: 'NBC, Universal & Peacock Originals',
    category: 'subscription',
    color: 'yellow',
    bgGradient: 'from-yellow-600 to-orange-700'
  },
  {
    id: 'apple-tv',
    name: 'Apple TV+',
    url: 'https://tv.apple.com/',
    icon: '🍎',
    description: 'Apple original series and films',
    category: 'subscription',
    color: 'gray',
    bgGradient: 'from-gray-800 to-black'
  },

  // Free Streaming
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/',
    icon: '▶️',
    description: 'Videos, music, and live streams',
    category: 'free',
    color: 'red',
    bgGradient: 'from-red-700 to-red-900'
  },
  {
    id: 'tubi',
    name: 'Tubi',
    url: 'https://tubitv.com/',
    icon: '📽️',
    description: 'Free movies and TV shows',
    category: 'free',
    color: 'orange',
    bgGradient: 'from-orange-700 to-red-800'
  },
  {
    id: 'pluto',
    name: 'Pluto TV',
    url: 'https://pluto.tv/',
    icon: '🪐',
    description: 'Free live TV and movies',
    category: 'free',
    color: 'yellow',
    bgGradient: 'from-yellow-700 to-orange-800'
  },
  {
    id: 'crackle',
    name: 'Crackle',
    url: 'https://www.crackle.com/',
    icon: '⚡',
    description: 'Free Sony movies and originals',
    category: 'free',
    color: 'orange',
    bgGradient: 'from-orange-600 to-red-700'
  },

  // Anime
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    url: 'https://www.crunchyroll.com/',
    icon: '🎌',
    description: 'Anime streaming',
    category: 'anime',
    color: 'orange',
    bgGradient: 'from-orange-600 to-yellow-700'
  },
  {
    id: 'funimation',
    name: 'Funimation',
    url: 'https://www.funimation.com/',
    icon: '⚔️',
    description: 'Dubbed and subbed anime',
    category: 'anime',
    color: 'purple',
    bgGradient: 'from-purple-700 to-pink-800'
  },
  {
    id: 'hidive',
    name: 'HIDIVE',
    url: 'https://www.hidive.com/',
    icon: '🌊',
    description: 'Anime and dubs',
    category: 'anime',
    color: 'cyan',
    bgGradient: 'from-cyan-700 to-blue-800'
  },
  {
    id: 'zoro',
    name: 'Zoro.to',
    url: 'https://zoro.to/',
    icon: '🗡️',
    description: 'Free anime streaming',
    category: 'anime',
    color: 'green',
    bgGradient: 'from-green-700 to-emerald-800'
  },
  {
    id: '9anime',
    name: '9Anime',
    url: 'https://9animetv.to/',
    icon: '🔮',
    description: 'Free anime HD',
    category: 'anime',
    color: 'purple',
    bgGradient: 'from-purple-700 to-indigo-800'
  },

  // K-Drama / Asian
  {
    id: 'viki',
    name: 'Viki',
    url: 'https://www.viki.com/',
    icon: '🇰🇷',
    description: 'Asian dramas and movies',
    category: 'kdrama',
    color: 'pink',
    bgGradient: 'from-pink-700 to-rose-800'
  },
  {
    id: 'dramacool',
    name: 'DramaCool',
    url: 'https://dramacool.pa/',
    icon: '🎎',
    description: 'K-Drama and Asian content',
    category: 'kdrama',
    color: 'rose',
    bgGradient: 'from-rose-700 to-pink-800'
  },
  {
    id: 'kissasian',
    name: 'KissAsian',
    url: 'https://kissasian.lu/',
    icon: '💋',
    description: 'Asian dramas free',
    category: 'kdrama',
    color: 'red',
    bgGradient: 'from-red-600 to-rose-700'
  },
  {
    id: 'iqiyi',
    name: 'iQIYI',
    url: 'https://www.iq.com/',
    icon: '🎬',
    description: 'Chinese dramas and variety',
    category: 'kdrama',
    color: 'green',
    bgGradient: 'from-green-700 to-emerald-800'
  },

  // Music
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com/',
    icon: '🎵',
    description: 'Music streaming',
    category: 'music',
    color: 'green',
    bgGradient: 'from-green-600 to-green-800'
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    url: 'https://soundcloud.com/',
    icon: '🎧',
    description: 'Music and audio platform',
    category: 'music',
    color: 'orange',
    bgGradient: 'from-orange-600 to-red-700'
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    url: 'https://music.apple.com/',
    icon: '🎼',
    description: 'Apple Music streaming',
    category: 'music',
    color: 'red',
    bgGradient: 'from-red-600 to-pink-700'
  },
  {
    id: 'youtube-music',
    name: 'YouTube Music',
    url: 'https://music.youtube.com/',
    icon: '🎶',
    description: 'Music from YouTube',
    category: 'music',
    color: 'red',
    bgGradient: 'from-red-700 to-black'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StreamingLauncher: React.FC<StreamingLauncherProps> = ({
  className = '',
  onActivityLog
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatform | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'subscription' | 'free' | 'anime' | 'kdrama' | 'music'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🌐' },
    { id: 'subscription', name: 'Subscription', icon: '💎' },
    { id: 'free', name: 'Free', icon: '🆓' },
    { id: 'anime', name: 'Anime', icon: '🎌' },
    { id: 'kdrama', name: 'K-Drama', icon: '🇰🇷' },
    { id: 'music', name: 'Music', icon: '🎵' }
  ];

  const filteredPlatforms = activeCategory === 'all'
    ? STREAMING_PLATFORMS
    : STREAMING_PLATFORMS.filter(p => p.category === activeCategory);

  // Load watch history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kols-hub-watch-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWatchHistory(parsed.map((h: any) => ({
          ...h,
          startTime: new Date(h.startTime)
        })));
      } catch (e) {
        console.error('Error loading watch history:', e);
      }
    }
  }, []);

  // Save watch history to localStorage
  useEffect(() => {
    if (watchHistory.length > 0) {
      localStorage.setItem('kols-hub-watch-history', JSON.stringify(watchHistory));
    }
  }, [watchHistory]);

  const handleOpenPlatform = (platform: StreamingPlatform) => {
    setSelectedPlatform(platform);
    setSessionStart(new Date());

    onActivityLog?.({
      platformId: platform.id,
      platformName: platform.name,
      startTime: new Date()
    });
  };

  const handleClosePlatform = () => {
    if (selectedPlatform && sessionStart) {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - sessionStart.getTime()) / 1000 / 60); // minutes

      // Add to history
      setWatchHistory(prev => [{
        id: Date.now().toString(),
        platformId: selectedPlatform.id,
        platformName: selectedPlatform.name,
        icon: selectedPlatform.icon,
        startTime: sessionStart,
        duration
      }, ...prev.slice(0, 49)]); // Keep last 50

      onActivityLog?.({
        platformId: selectedPlatform.id,
        platformName: selectedPlatform.name,
        startTime: sessionStart,
        endTime,
        duration
      });
    }

    setSelectedPlatform(null);
    setSessionStart(null);
    setIsFullscreen(false);
  };

  const getTotalWatchTime = () => {
    return watchHistory.reduce((acc, h) => acc + h.duration, 0);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-red-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-200">📺 Streaming Hub</h2>
        <div className="text-sm text-gray-400">
          Total watch time: {formatDuration(getTotalWatchTime())}
        </div>
      </div>

      {/* If platform is selected, show embedded view */}
      {selectedPlatform ? (
        <div className="space-y-4">
          {/* Platform Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClosePlatform}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <span className="text-3xl">{selectedPlatform.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedPlatform.name}</h3>
                <p className="text-sm text-gray-400">
                  {sessionStart && `Started: ${sessionStart.toLocaleTimeString()}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isFullscreen ? '🔲 Exit' : '⛶ Fullscreen'}
              </button>
              <button
                onClick={() => window.open(selectedPlatform.url, '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Open in New Tab →
              </button>
            </div>
          </div>

          {/* Embedded Platform */}
          <div
            className={`bg-black rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
            style={{ height: isFullscreen ? '100vh' : '70vh' }}
          >
            <iframe
              src={selectedPlatform.url}
              className="w-full h-full"
              title={selectedPlatform.name}
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
            />
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg z-10"
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          {watchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">⏱️ Recent Activity</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {watchHistory.slice(0, 5).map(history => (
                  <button
                    key={history.id}
                    onClick={() => {
                      const platform = STREAMING_PLATFORMS.find(p => p.id === history.platformId);
                      if (platform) handleOpenPlatform(platform);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700
                               hover:border-red-500/50 transition-all whitespace-nowrap"
                  >
                    <span className="text-xl">{history.icon}</span>
                    <div className="text-left">
                      <div className="text-sm text-gray-200">{history.platformName}</div>
                      <div className="text-xs text-gray-500">{formatDuration(history.duration)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Platform Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPlatforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => handleOpenPlatform(platform)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${platform.bgGradient}
                           border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 group`}
              >
                <span className="text-4xl group-hover:animate-bounce">{platform.icon}</span>
                <div className="text-center">
                  <div className="font-semibold text-white">{platform.name}</div>
                  <div className="text-xs text-gray-300 line-clamp-1">{platform.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{watchHistory.length}</div>
              <div className="text-xs text-gray-500">Sessions</div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{formatDuration(getTotalWatchTime())}</div>
              <div className="text-xs text-gray-500">Total Time</div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {new Set(watchHistory.map(h => h.platformId)).size}
              </div>
              <div className="text-xs text-gray-500">Platforms Used</div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {STREAMING_PLATFORMS.length}
              </div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>📺 Streaming Hub</span>
        <span>•</span>
        <span>{STREAMING_PLATFORMS.length} Platforms</span>
        <span>•</span>
        <span>All Your Entertainment</span>
      </div>
    </div>
  );
};

export default StreamingLauncher;
