import React, { useState, useEffect } from 'react';
import ideasIndex from '../data/ideas-libraries-index.json';
import { 
  Lightbulb, Heart, Scissors, Palette, Sparkles, DollarSign, 
  FolderOpen, Filter, Search, Star, TrendingUp, Clock, Zap
} from 'lucide-react';

interface IdeasLibrary {
  key: string;
  name: string;
  path: string;
  description: string;
  count: number;
  categories: string[];
  filters?: {
    [key: string]: string[];
  };
}

export const IdeasLibraryManager: React.FC = () => {
  const [selectedLibrary, setSelectedLibrary] = useState<IdeasLibrary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavs = localStorage.getItem('kolFavoriteLibraries');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const toggleFavorite = (libraryKey: string) => {
    const newFavs = favorites.includes(libraryKey)
      ? favorites.filter(key => key !== libraryKey)
      : [...favorites, libraryKey];
    
    setFavorites(newFavs);
    localStorage.setItem('kolFavoriteLibraries', JSON.stringify(newFavs));
  };

  const getLibraryIcon = (key: string) => {
    switch (key) {
      case 'ideas_food': return '🍜';
      case 'ideas_health': return '💊';
      case 'ideas_sewing': return '🪡';
      case 'ideas_art': return '🎨';
      case 'ideas_hoodoo': return '🕯️';
      case 'ideas_passive_income': return '💰';
      case 'project_chats_index': return '💬';
      case 'app_feature_ideas': return '⚡';
      default: return '📚';
    }
  };

  const filteredLibraries = ideasIndex.libraries.filter(lib => {
    const matchesSearch = lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lib.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || favorites.includes(lib.key);
    
    return matchesSearch && matchesFavorites;
  });

  return (
    <div className="ideas-library-manager p-6 bg-gradient-to-br from-indigo-950 via-black to-purple-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-300 mb-2">
            💡 Ideas Library Sanctuary
          </h1>
          <p className="text-purple-400 mb-4">
            {ideasIndex.total_ideas}+ curated ideas across {ideasIndex.libraries.length} specialized libraries
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="text"
                placeholder="Search libraries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-purple-950 border border-purple-500 rounded text-purple-100 placeholder-purple-400"
              />
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded font-medium transition-all ${
                showFavoritesOnly
                  ? 'bg-indigo-500 text-black'
                  : 'bg-purple-900 text-purple-100 border border-purple-500'
              }`}
            >
              <Star className="inline mr-2" size={16} />
              Favorites Only
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-900/50 border border-purple-500 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-purple-300">Total Libraries</h3>
            </div>
            <p className="text-3xl font-bold text-purple-100">{ideasIndex.libraries.length}</p>
          </div>
          <div className="bg-indigo-900/50 border border-indigo-500 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="text-indigo-400" size={24} />
              <h3 className="text-xl font-bold text-indigo-300">Total Ideas</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-100">{ideasIndex.total_ideas}+</p>
          </div>
          <div className="bg-purple-900/50 border border-purple-500 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star className="text-indigo-400" size={24} />
              <h3 className="text-xl font-bold text-purple-300">Favorites</h3>
            </div>
            <p className="text-3xl font-bold text-purple-100">{favorites.length}</p>
          </div>
        </div>

        {/* Libraries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map(library => (
            <LibraryCard
              key={library.key}
              library={library}
              icon={getLibraryIcon(library.key)}
              isFavorite={favorites.includes(library.key)}
              onToggleFavorite={toggleFavorite}
              onSelect={setSelectedLibrary}
            />
          ))}
        </div>

        {filteredLibraries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-400 text-xl">No libraries match your search</p>
          </div>
        )}

        {/* Usage & Integration Info */}
        <div className="mt-12 bg-purple-900/30 border border-purple-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">
            🔮 Integration Points
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideasIndex.usage.integration_points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Zap className="text-indigo-400 mt-1" size={20} />
                <p className="text-purple-200">{point}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-indigo-900/30 border border-indigo-500 rounded p-4">
            <h3 className="font-bold text-indigo-300 mb-2">AI-Powered Suggestions</h3>
            <p className="text-indigo-200">{ideasIndex.usage.ai_suggestions}</p>
          </div>
        </div>

        {/* Expansion Roadmap */}
        <div className="mt-8 bg-purple-900/30 border border-purple-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">
            🚀 Upcoming Libraries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ideasIndex.expansion_plans.upcoming_libraries.map((lib, idx) => (
              <div key={idx} className="bg-purple-950/50 border border-purple-600 rounded p-3">
                <p className="text-purple-200 flex items-center gap-2">
                  <Clock className="text-purple-400" size={16} />
                  {lib}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Library Detail Modal */}
      {selectedLibrary && (
        <LibraryDetailModal
          library={selectedLibrary}
          onClose={() => setSelectedLibrary(null)}
        />
      )}
    </div>
  );
};

interface LibraryCardProps {
  library: IdeasLibrary;
  icon: string;
  isFavorite: boolean;
  onToggleFavorite: (key: string) => void;
  onSelect: (library: IdeasLibrary) => void;
}

const LibraryCard: React.FC<LibraryCardProps> = ({
  library,
  icon,
  isFavorite,
  onToggleFavorite,
  onSelect
}) => {
  return (
    <div
      className="library-card bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-2 border-purple-500 rounded-lg p-5 hover:border-purple-400 transition-all cursor-pointer group"
      onClick={() => onSelect(library)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-4xl">{icon}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(library.key);
          }}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>
      <h3 className="text-xl font-bold text-purple-200 mb-2 group-hover:text-purple-100">
        {library.name}
      </h3>
      <p className="text-purple-400 text-sm mb-3 line-clamp-2">
        {library.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-purple-300 font-bold text-lg">
          {library.count} ideas
        </span>
        <div className="text-purple-400 group-hover:text-purple-300">
          View Details →
        </div>
      </div>
    </div>
  );
};

interface LibraryDetailModalProps {
  library: IdeasLibrary;
  onClose: () => void;
}

const LibraryDetailModal: React.FC<LibraryDetailModalProps> = ({ library, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-purple-950 to-indigo-950 border-2 border-purple-500 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-purple-300">{library.name}</h2>
            <button
              onClick={onClose}
              className="text-purple-400 hover:text-purple-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <p className="text-purple-200 mb-6">{library.description}</p>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-purple-300 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {library.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          
          {library.filters && Object.keys(library.filters).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-purple-300 mb-3">Available Filters</h3>
              {Object.entries(library.filters).map(([filterName, options]) => (
                <div key={filterName} className="mb-3">
                  <h4 className="text-purple-400 font-medium mb-2 capitalize">
                    {filterName.replace(/_/g, ' ')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-900/50 text-indigo-200 px-2 py-1 rounded text-sm border border-indigo-500"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded transition-colors"
              onClick={() => alert('Browse all curated ideas in this library with advanced filters')}
            >
              Browse Ideas
            </button>
            <button
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded transition-colors"
              onClick={() => alert('Get a random idea to spark inspiration and creative momentum')}
            >
              Get Random Idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeasLibraryManager;
