/**
 * Entertainment Center Component
 * ================================
 * The ultimate entertainment hub for the Gothic Mansion Living Room
 * Features anime, manga, K-drama, ebooks, movies, and media servers
 */

import React, { useState, useMemo } from 'react';
import {
  ALL_ENTERTAINMENT_APPS,
  FREE_LIBRARIES,
  ANIME_APPS,
  MANGA_COMICS_APPS,
  KDRAMA_APPS,
  EBOOK_APPS,
  MOVIE_STREAMING_APPS,
  STREAMING_PLATFORMS,
  TRACKING_APPS,
  getEntertainmentStats,
  type EntertainmentApp,
  type MediaLibrary,
  type EntertainmentCategory,
  type Platform
} from '../../data/entertainment-center-database';
import {
  ANNA_ARCHIVE_COLLECTIONS,
  CURATED_MEDIA,
  getTotalStats as getAnnaStats
} from '../../data/anna-archive-media-database';

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'grid' | 'list' | 'compact';
type SortBy = 'name' | 'rating' | 'category';

interface EntertainmentCenterProps {
  className?: string;
  initialCategory?: EntertainmentCategory | 'all' | 'libraries';
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const CategoryIcon: React.FC<{ category: EntertainmentCategory | string }> = ({ category }) => {
  const icons: Record<string, string> = {
    'anime-streaming': '🎬',
    'manga-reader': '📚',
    'comics-server': '🦸',
    'kdrama': '🇰🇷',
    'ebook-library': '📖',
    'ebook-reader': '📱',
    'movie-streaming': '🎥',
    'music-player': '🎵',
    'media-server': '🖥️',
    'tracking': '📊',
    'downloader': '⬇️',
    'libraries': '🏛️',
    'collections': '📦',
    'streaming': '📺',
    'social': '👥',
    'all': '✨'
  };
  return <span className="text-2xl">{icons[category] || '📁'}</span>;
};

const PlatformBadge: React.FC<{ platform: Platform }> = ({ platform }) => {
  const colors: Record<Platform, string> = {
    'web': 'bg-blue-500',
    'windows': 'bg-sky-600',
    'macos': 'bg-gray-600',
    'linux': 'bg-orange-500',
    'android': 'bg-green-500',
    'ios': 'bg-gray-500',
    'android-tv': 'bg-green-600',
    'self-hosted': 'bg-purple-500',
    'cross-platform': 'bg-indigo-500'
  };

  const labels: Record<Platform, string> = {
    'web': 'Web',
    'windows': 'Win',
    'macos': 'Mac',
    'linux': 'Linux',
    'android': 'Android',
    'ios': 'iOS',
    'android-tv': 'TV',
    'self-hosted': 'Self-Host',
    'cross-platform': 'All'
  };

  return (
    <span className={`${colors[platform]} text-white text-xs px-2 py-0.5 rounded-full`}>
      {labels[platform]}
    </span>
  );
};

const AppCard: React.FC<{ app: EntertainmentApp; viewMode: ViewMode }> = ({ app, viewMode }) => {
  const [expanded, setExpanded] = useState(false);

  if (viewMode === 'compact') {
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 hover:border-purple-400/50 transition-all">
        <div className="flex items-center gap-3">
          <CategoryIcon category={app.category} />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-purple-200 truncate">{app.name}</h4>
            <p className="text-xs text-gray-400 truncate">{app.description}</p>
          </div>
          <div className="flex gap-1">
            {app.github && (
              <a href={app.github} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-white transition-colors">
                <span className="text-lg">⚙️</span>
              </a>
            )}
            {app.url && (
              <a href={app.url} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-purple-400 transition-colors">
                <span className="text-lg">🔗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-all">
        <div className="flex items-start gap-4">
          <div className="text-3xl">
            <CategoryIcon category={app.category} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-lg text-purple-200">{app.name}</h4>
              {app.rating && (
                <span className="text-yellow-400 text-sm">★ {app.rating.toFixed(1)}</span>
              )}
              {app.isOpenSource && (
                <span className="bg-green-600/30 text-green-400 text-xs px-2 py-0.5 rounded-full">
                  Open Source
                </span>
              )}
            </div>
            <p className="text-gray-300 text-sm mb-2">{app.description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {app.platforms.slice(0, 4).map(p => (
                <PlatformBadge key={p} platform={p} />
              ))}
              {app.platforms.length > 4 && (
                <span className="text-xs text-gray-400">+{app.platforms.length - 4}</span>
              )}
            </div>
            <div className="flex gap-2">
              {app.github && (
                <a href={app.github} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  GitHub →
                </a>
              )}
              {app.url && (
                <a href={app.url} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={`bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4
                  hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10
                  transition-all cursor-pointer ${expanded ? 'col-span-2 row-span-2' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">
          <CategoryIcon category={app.category} />
        </div>
        <div className="flex items-center gap-1">
          {app.rating && (
            <span className="text-yellow-400 text-sm">★ {app.rating.toFixed(1)}</span>
          )}
        </div>
      </div>

      <h4 className="font-bold text-lg text-purple-200 mb-1">{app.name}</h4>
      <p className={`text-gray-300 text-sm mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
        {app.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {app.platforms.slice(0, expanded ? undefined : 3).map(p => (
          <PlatformBadge key={p} platform={p} />
        ))}
        {!expanded && app.platforms.length > 3 && (
          <span className="text-xs text-gray-400">+{app.platforms.length - 3}</span>
        )}
      </div>

      {expanded && (
        <>
          <div className="mb-3">
            <h5 className="text-sm font-semibold text-purple-300 mb-1">Features:</h5>
            <ul className="text-xs text-gray-400 space-y-1">
              {app.features.slice(0, 6).map((f, i) => (
                <li key={i} className="flex items-center gap-1">
                  <span className="text-purple-400">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {app.tags.map(tag => (
              <span key={tag} className="bg-gray-700/50 text-gray-300 text-xs px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-2 pt-2 border-t border-gray-700/50">
        {app.isOpenSource && (
          <span className="bg-green-600/30 text-green-400 text-xs px-2 py-1 rounded-full">
            Open Source
          </span>
        )}
        {app.github && (
          <a href={app.github} target="_blank" rel="noopener noreferrer"
             onClick={e => e.stopPropagation()}
             className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            GitHub
          </a>
        )}
        {app.url && (
          <a href={app.url} target="_blank" rel="noopener noreferrer"
             onClick={e => e.stopPropagation()}
             className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Website
          </a>
        )}
      </div>
    </div>
  );
};

const LibraryCard: React.FC<{ library: MediaLibrary }> = ({ library }) => (
  <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/30 backdrop-blur-sm
                  border border-purple-500/40 rounded-xl p-5 hover:border-purple-400/60
                  hover:shadow-xl hover:shadow-purple-500/20 transition-all">
    <div className="flex items-start justify-between mb-3">
      <span className="text-3xl">🏛️</span>
      {library.isFree && (
        <span className="bg-green-600/40 text-green-300 text-xs px-2 py-1 rounded-full">
          FREE
        </span>
      )}
    </div>

    <h4 className="font-bold text-xl text-purple-100 mb-2">{library.name}</h4>
    <p className="text-gray-300 text-sm mb-3">{library.description}</p>

    {library.itemCount && (
      <div className="text-2xl font-bold text-purple-300 mb-2">
        {library.itemCount.toLocaleString()}+
        <span className="text-sm font-normal text-gray-400 ml-1">items</span>
      </div>
    )}

    <div className="flex flex-wrap gap-1 mb-3">
      {library.features.slice(0, 4).map((f, i) => (
        <span key={i} className="bg-purple-800/50 text-purple-200 text-xs px-2 py-1 rounded-full">
          {f}
        </span>
      ))}
    </div>

    <a href={library.url} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-2 bg-purple-600/50 hover:bg-purple-500/60
                  text-white px-4 py-2 rounded-lg transition-colors">
      <span>Visit Library</span>
      <span>→</span>
    </a>
  </div>
);

const CollectionCard: React.FC<{ collection: typeof ANNA_ARCHIVE_COLLECTIONS[0] }> = ({ collection }) => (
  <div className="bg-gradient-to-br from-gray-800/70 to-indigo-900/30 backdrop-blur-sm
                  border border-indigo-500/40 rounded-xl p-4 hover:border-indigo-400/50 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">📦</span>
      <span className="text-xs text-gray-400">{collection.totalSize}</span>
    </div>

    <h4 className="font-bold text-purple-200 mb-1">{collection.name}</h4>
    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{collection.description}</p>

    <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
      <span className="text-purple-400 font-semibold">{collection.itemCount.toLocaleString()}</span>
      <span>items</span>
    </div>

    {collection.seeders && (
      <div className="flex items-center gap-3 text-xs">
        <span className="text-green-400">↑ {collection.seeders} seeders</span>
        {collection.leechers && (
          <span className="text-orange-400">↓ {collection.leechers}</span>
        )}
      </div>
    )}

    {collection.torrentUrl && (
      <a href={collection.torrentUrl} target="_blank" rel="noopener noreferrer"
         className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
        View Torrent →
      </a>
    )}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EntertainmentCenter: React.FC<EntertainmentCenterProps> = ({
  className = '',
  initialCategory = 'all'
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('rating');

  const stats = getEntertainmentStats();
  const annaStats = getAnnaStats();

  const categories = [
    { id: 'all', name: 'All Apps', count: stats.totalApps },
    { id: 'streaming', name: 'Streaming', count: STREAMING_PLATFORMS.length },
    { id: 'anime-streaming', name: 'Anime', count: ANIME_APPS.length },
    { id: 'manga-reader', name: 'Manga & Comics', count: MANGA_COMICS_APPS.length },
    { id: 'kdrama', name: 'K-Drama', count: KDRAMA_APPS.length },
    { id: 'ebook-reader', name: 'eBooks', count: EBOOK_APPS.length },
    { id: 'movie-streaming', name: 'Movies & TV', count: MOVIE_STREAMING_APPS.length },
    { id: 'music-player', name: 'Music', count: STREAMING_PLATFORMS.filter(s => s.category === 'music-player').length },
    { id: 'libraries', name: 'Libraries', count: FREE_LIBRARIES.length },
    { id: 'collections', name: 'Collections', count: ANNA_ARCHIVE_COLLECTIONS.length }
  ];

  const filteredApps = useMemo(() => {
    let apps = ALL_ENTERTAINMENT_APPS;

    // Filter by category
    if (activeCategory === 'streaming') {
      apps = STREAMING_PLATFORMS;
    } else if (activeCategory !== 'all' && activeCategory !== 'libraries' && activeCategory !== 'collections') {
      apps = apps.filter(app =>
        app.category === activeCategory || app.subcategories?.includes(activeCategory as EntertainmentCategory)
      );
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      apps = apps.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        apps = [...apps].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        apps = [...apps].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'category':
        apps = [...apps].sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return apps;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 ${className}`}>
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📺</span>
              <div>
                <h1 className="text-2xl font-bold text-purple-200">Entertainment Center</h1>
                <p className="text-sm text-gray-400">
                  {stats.totalApps} apps • {FREE_LIBRARIES.length} libraries • {annaStats.totalBooks.toLocaleString()}+ books
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                {(['grid', 'list', 'compact'] as ViewMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded text-sm capitalize transition-colors
                      ${viewMode === mode ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortBy)}
                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-2 text-sm"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search apps, features, or tags..."
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 pl-12
                         text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                         transition-colors"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-600">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
                  ${activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                  }`}
              >
                <CategoryIcon category={cat.id} />
                <span>{cat.name}</span>
                <span className="text-xs opacity-75">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600/30 to-purple-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-200">{stats.totalApps}</div>
            <div className="text-xs text-purple-400">Total Apps</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/30 to-blue-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-200">{stats.totalOpenSource}</div>
            <div className="text-xs text-blue-400">Open Source</div>
          </div>
          <div className="bg-gradient-to-br from-green-600/30 to-green-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-200">{FREE_LIBRARIES.length}</div>
            <div className="text-xs text-green-400">Free Libraries</div>
          </div>
          <div className="bg-gradient-to-br from-amber-600/30 to-amber-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-200">61M+</div>
            <div className="text-xs text-amber-400">Books</div>
          </div>
          <div className="bg-gradient-to-br from-pink-600/30 to-pink-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-200">95M+</div>
            <div className="text-xs text-pink-400">Papers</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600/30 to-indigo-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-200">1.1 PB</div>
            <div className="text-xs text-indigo-400">Total Data</div>
          </div>
        </div>

        {/* Content Grid */}
        {activeCategory === 'libraries' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FREE_LIBRARIES.map(lib => (
              <LibraryCard key={lib.id} library={lib} />
            ))}
          </div>
        ) : activeCategory === 'collections' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ANNA_ARCHIVE_COLLECTIONS.map(col => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            viewMode === 'list' ? 'grid-cols-1' :
            'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredApps.length === 0 && activeCategory !== 'libraries' && activeCategory !== 'collections' && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No apps found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Anna's Archive Feature Section */}
        {activeCategory === 'all' && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-purple-200 mb-6 flex items-center gap-3">
              <span>📚</span> Featured: Anna's Archive
              <span className="text-sm font-normal text-gray-400">World's largest shadow library</span>
            </h2>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 border border-purple-500/30">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-300">{annaStats.totalBooks.toLocaleString()}</div>
                  <div className="text-purple-400">Books</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-300">{annaStats.totalPapers.toLocaleString()}</div>
                  <div className="text-blue-400">Papers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-300">{annaStats.worldBooksPreserved}</div>
                  <div className="text-green-400">World's Books</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {annaStats.sources.slice(0, 6).map((src, i) => (
                  <span key={i} className="bg-gray-800/60 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {src}
                  </span>
                ))}
              </div>
              <a href="https://annas-archive.li/" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500
                            text-white px-6 py-3 rounded-xl transition-colors font-semibold">
                <span>Explore Anna's Archive</span>
                <span>→</span>
              </a>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default EntertainmentCenter;
