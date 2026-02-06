/**
 * Library Search Component
 * ========================
 * Actual working search for Anna's Archive, LibGen, Sci-Hub, and other libraries
 * These are REAL integrations that open search results
 */

import React, { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface LibrarySearchProps {
  className?: string;
}

type LibraryTab = 'books' | 'papers' | 'audiobooks' | 'comics' | 'magazines';

interface Library {
  name: string;
  url: string;
  searchUrl: string;
  icon: string;
  description: string;
  categories: LibraryTab[];
}

// ============================================================================
// LIBRARIES DATA
// ============================================================================

const LIBRARIES: Library[] = [
  {
    name: "Anna's Archive",
    url: 'https://annas-archive.li/',
    searchUrl: 'https://annas-archive.li/search?q=',
    icon: '📚',
    description: '61M+ books, 95M+ papers - The world\'s largest shadow library',
    categories: ['books', 'papers', 'comics', 'magazines']
  },
  {
    name: 'Library Genesis',
    url: 'https://libgen.is/',
    searchUrl: 'https://libgen.is/search.php?req=',
    icon: '📖',
    description: '5.5M+ books and articles',
    categories: ['books', 'papers', 'magazines']
  },
  {
    name: 'Z-Library',
    url: 'https://z-lib.io/',
    searchUrl: 'https://z-lib.io/s/',
    icon: '📕',
    description: 'Millions of free ebooks',
    categories: ['books']
  },
  {
    name: 'Sci-Hub',
    url: 'https://sci-hub.se/',
    searchUrl: 'https://sci-hub.se/',
    icon: '🔬',
    description: 'Free access to research papers',
    categories: ['papers']
  },
  {
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    searchUrl: 'https://www.gutenberg.org/ebooks/search/?query=',
    icon: '📜',
    description: '70,000+ free public domain ebooks',
    categories: ['books']
  },
  {
    name: 'Open Library',
    url: 'https://openlibrary.org/',
    searchUrl: 'https://openlibrary.org/search?q=',
    icon: '🏛️',
    description: '2M+ free ebooks to borrow',
    categories: ['books']
  },
  {
    name: 'Internet Archive',
    url: 'https://archive.org/',
    searchUrl: 'https://archive.org/search?query=',
    icon: '🌐',
    description: '42M+ books, 866B+ web pages',
    categories: ['books', 'audiobooks', 'magazines']
  },
  {
    name: 'PDF Drive',
    url: 'https://www.pdfdrive.com/',
    searchUrl: 'https://www.pdfdrive.com/search?q=',
    icon: '📄',
    description: '80M+ PDF ebooks',
    categories: ['books']
  },
  {
    name: 'LibriVox',
    url: 'https://librivox.org/',
    searchUrl: 'https://librivox.org/search?primary_key=0&search_category=title&search_page=1&search_form=get_results&search_order=catalog_date&project_type=either&q=',
    icon: '🎧',
    description: '18,000+ free audiobooks',
    categories: ['audiobooks']
  },
  {
    name: 'MagzDB',
    url: 'https://magzdb.org/',
    searchUrl: 'https://magzdb.org/makelist?t=',
    icon: '📰',
    description: 'Magazine archive',
    categories: ['magazines']
  },
  {
    name: 'ReadComicOnline',
    url: 'https://readcomiconline.li/',
    searchUrl: 'https://readcomiconline.li/Search/Comic?keyword=',
    icon: '🦸',
    description: 'Comics and graphic novels',
    categories: ['comics']
  },
  {
    name: 'GetComics',
    url: 'https://getcomics.org/',
    searchUrl: 'https://getcomics.org/?s=',
    icon: '💥',
    description: 'Download comics',
    categories: ['comics']
  }
];

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

export const LibrarySearch: React.FC<LibrarySearchProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<LibraryTab>('books');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const tabs: { id: LibraryTab; name: string; icon: string }[] = [
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'papers', name: 'Papers', icon: '📄' },
    { id: 'audiobooks', name: 'Audiobooks', icon: '🎧' },
    { id: 'comics', name: 'Comics', icon: '🦸' },
    { id: 'magazines', name: 'Magazines', icon: '📰' }
  ];

  const filteredLibraries = LIBRARIES.filter(lib => lib.categories.includes(activeTab));

  const handleSearch = (library: Library) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        return updated;
      });

      // Open search in new tab
      window.open(library.searchUrl + encodeURIComponent(searchQuery), '_blank');
    } else {
      // Just open the library
      window.open(library.url, '_blank');
    }
  };

  const searchAll = () => {
    if (searchQuery.trim()) {
      // Open Anna's Archive (most comprehensive)
      window.open(`https://annas-archive.li/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-purple-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-200">📚 Library Search</h2>
        <span className="text-sm text-gray-400">157M+ items available</span>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchAll()}
            placeholder="Search for books, papers, audiobooks..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-12
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>
        <button
          onClick={searchAll}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl
                     font-medium transition-colors flex items-center gap-2"
        >
          <span>Search All</span>
          <span>→</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Libraries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredLibraries.map(library => (
          <button
            key={library.name}
            onClick={() => handleSearch(library)}
            className="flex items-start gap-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700
                       hover:border-purple-500/50 hover:bg-gray-800 transition-all text-left group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{library.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-purple-200 group-hover:text-purple-100">
                {library.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{library.description}</p>
            </div>
            <span className="text-gray-500 group-hover:text-purple-400 transition-colors">→</span>
          </button>
        ))}
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(search)}
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm
                           hover:bg-gray-700 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/40 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-300">61M+</div>
          <div className="text-xs text-gray-500">Books</div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-300">95M+</div>
          <div className="text-xs text-gray-500">Papers</div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-300">1.1PB</div>
          <div className="text-xs text-gray-500">Total Data</div>
        </div>
      </div>
    </div>
  );
};

export default LibrarySearch;
