import React, { useState, useMemo } from 'react';
import {
  SHADOW_LIBRARIES,
  KNOWLEDGE_RESOURCES,
  OPEN_ACCESS_RESOURCES,
  LIBRARY_CATEGORIES,
  LIBRARY_STATS,
  ShadowLibrary
} from '../../data/shadow-libraries-database';

interface EmbeddedViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const EmbeddedViewer: React.FC<EmbeddedViewerProps> = ({ url, title, onClose }) => (
  <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-500/30">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📚</span>
        <h2 className="text-white font-bold text-lg">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          🔗 Open External
        </a>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
        >
          ✕ Close
        </button>
      </div>
    </div>
    <iframe
      src={url}
      className="flex-1 w-full border-0"
      title={title}
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
    />
  </div>
);

const LibraryCard: React.FC<{
  library: ShadowLibrary;
  onOpen: (library: ShadowLibrary) => void;
}> = ({ library, onOpen }) => (
  <div className="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-400/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 group">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{library.icon}</span>
          <div>
            <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors">
              {library.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              library.status === 'active' ? 'bg-green-500/20 text-green-400' :
              library.status === 'mirror' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {library.status.toUpperCase()}
            </span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          library.accessType === 'free' ? 'bg-green-500/20 text-green-400' :
          library.accessType === 'donation' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {library.accessType === 'free' ? '🆓 Free' :
           library.accessType === 'donation' ? '💝 Donation' :
           '📝 Registration'}
        </span>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {library.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {library.contentTypes.slice(0, 4).map((type, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
            {type}
          </span>
        ))}
        {library.contentTypes.length > 4 && (
          <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded">
            +{library.contentTypes.length - 4} more
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onOpen(library)}
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          📖 Open Library
        </button>
        <a
          href={library.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          🔗
        </a>
      </div>
    </div>

    {library.features.length > 0 && (
      <div className="px-6 py-3 bg-black/30 border-t border-purple-500/20">
        <div className="flex flex-wrap gap-2">
          {library.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs text-gray-400">
              ✓ {feature}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ShadowLibraryHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [embeddedLibrary, setEmbeddedLibrary] = useState<ShadowLibrary | null>(null);
  const [showResources, setShowResources] = useState(false);

  const filteredLibraries = useMemo(() => {
    let libraries = [...SHADOW_LIBRARIES];

    if (selectedCategory !== 'all') {
      libraries = libraries.filter(lib => lib.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      libraries = libraries.filter(lib =>
        lib.name.toLowerCase().includes(query) ||
        lib.description.toLowerCase().includes(query) ||
        lib.contentTypes.some(t => t.toLowerCase().includes(query)) ||
        lib.features.some(f => f.toLowerCase().includes(query))
      );
    }

    return libraries;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-6">
      {/* Embedded Viewer */}
      {embeddedLibrary && (
        <EmbeddedViewer
          url={embeddedLibrary.url}
          title={embeddedLibrary.name}
          onClose={() => setEmbeddedLibrary(null)}
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🏛️</span>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Shadow Library Hub
              </h1>
              <p className="text-purple-300">
                Access the world's largest collection of free knowledge
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            {Object.entries(LIBRARY_STATS).slice(0, 3).map(([key, value]) => (
              <div key={key} className="text-center px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/20">
                <div className="text-xl font-bold text-purple-300">{value}</div>
                <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search libraries, content types, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-900/80 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {LIBRARY_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Libraries Grid */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map(library => (
            <LibraryCard
              key={library.id}
              library={library}
              onOpen={setEmbeddedLibrary}
            />
          ))}
        </div>

        {filteredLibraries.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-5xl mb-4 block">📭</span>
            <p>No libraries found matching your search.</p>
          </div>
        )}
      </div>

      {/* Open Access Resources */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => setShowResources(!showResources)}
          className="w-full px-6 py-4 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl border border-purple-500/30 flex items-center justify-between text-white hover:border-purple-400/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div className="text-left">
              <h3 className="font-bold">Additional Open Access Resources</h3>
              <p className="text-sm text-purple-300">{OPEN_ACCESS_RESOURCES.length} more libraries and archives</p>
            </div>
          </div>
          <span className="text-2xl">{showResources ? '▲' : '▼'}</span>
        </button>

        {showResources && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPEN_ACCESS_RESOURCES.map(resource => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-900/60 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-all group"
              >
                <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                  {resource.name}
                </h4>
                <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                <span className="text-xs text-purple-400 mt-2 inline-block">
                  {resource.category} →
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Knowledge Resources */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span>📖</span> Understanding Shadow Libraries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KNOWLEDGE_RESOURCES.map(resource => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-gray-900 to-indigo-900/30 rounded-lg border border-indigo-500/20 hover:border-indigo-400/40 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {resource.type === 'article' ? '📄' :
                   resource.type === 'essay' ? '📝' :
                   resource.type === 'guide' ? '📘' : '📑'}
                </span>
                <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">
                  {resource.source}
                </span>
              </div>
              <h4 className="font-bold text-white mb-1">{resource.title}</h4>
              <p className="text-sm text-gray-400">{resource.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {resource.topics.map((topic, i) => (
                  <span key={i} className="text-xs text-indigo-400">#{topic}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="max-w-7xl mx-auto mt-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-200 text-sm text-center">
          ⚠️ These resources are provided for educational purposes. Please respect copyright laws in your jurisdiction
          and support authors when possible. Shadow libraries exist to democratize access to knowledge.
        </p>
      </div>
    </div>
  );
};

export default ShadowLibraryHub;
