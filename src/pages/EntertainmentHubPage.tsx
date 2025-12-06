import React, { useState } from 'react';
import { Film, Tv, Gamepad2, BookOpen, Users, Clock, Battery, Star, Play, Plus, Search, Filter, TrendingUp, Heart, Zap } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'game' | 'book';
  genre: string;
  energyLevel: 'low' | 'medium' | 'high';
  mood: string[];
  duration: string;
  rating: number;
  progress?: number;
  thumbnail?: string;
}

export default function EntertainmentHubPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');

  // Sample media library
  const mediaLibrary: MediaItem[] = [
    {
      id: '1',
      title: 'Cozy Mystery Night',
      type: 'movie',
      genre: 'Mystery',
      energyLevel: 'low',
      mood: ['relaxed', 'curious'],
      duration: '2h 15m',
      rating: 4.5,
      progress: 0
    },
    {
      id: '2',
      title: 'Comfort Food Show',
      type: 'tv',
      genre: 'Cooking',
      energyLevel: 'low',
      mood: ['calm', 'happy'],
      duration: '30m episodes',
      rating: 4.8,
      progress: 65
    },
    {
      id: '3',
      title: 'Puzzle Adventure Game',
      type: 'game',
      genre: 'Puzzle',
      energyLevel: 'medium',
      mood: ['focused', 'calm'],
      duration: 'Self-paced',
      rating: 4.6,
      progress: 45
    },
    {
      id: '4',
      title: 'Fantasy Epic Series',
      type: 'tv',
      genre: 'Fantasy',
      energyLevel: 'high',
      mood: ['adventurous', 'excited'],
      duration: '1h episodes',
      rating: 4.9,
      progress: 30
    },
    {
      id: '5',
      title: 'Cozy Audiobook Collection',
      type: 'book',
      genre: 'Fiction',
      energyLevel: 'low',
      mood: ['relaxed', 'sleepy'],
      duration: '8h total',
      rating: 4.7,
      progress: 20
    },
    {
      id: '6',
      title: 'Action Platformer',
      type: 'game',
      genre: 'Action',
      energyLevel: 'high',
      mood: ['energetic', 'focused'],
      duration: '20-40h',
      rating: 4.4,
      progress: 0
    }
  ];

  const watchParties = [
    { id: '1', name: 'Cozy Movie Night', participants: 4, time: 'Tonight 8 PM', type: 'movie' },
    { id: '2', name: 'Mystery Series Marathon', participants: 2, time: 'Saturday 2 PM', type: 'tv' },
    { id: '3', name: 'Co-op Gaming Session', participants: 3, time: 'Friday 7 PM', type: 'game' }
  ];

  const collections = [
    { name: 'Low Energy Favorites', count: 24, icon: Battery },
    { name: 'Feel Good Collection', count: 18, icon: Heart },
    { name: 'Currently Watching', count: 12, icon: Play },
    { name: 'Want to Watch', count: 47, icon: Star }
  ];

  const filteredMedia = mediaLibrary.filter(item => {
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    const energyMatch = selectedEnergy === 'all' || item.energyLevel === selectedEnergy;
    const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && energyMatch && searchMatch;
  });

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'movie': return Film;
      case 'tv': return Tv;
      case 'game': return Gamepad2;
      case 'book': return BookOpen;
      default: return Film;
    }
  };

  const getEnergyColor = (level: string) => {
    switch(level) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-4">
          Entertainment Hub
        </h1>
        <p className="text-indigo-300 text-lg">Unified media browser with energy-level filtering and watch parties</p>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-2 mb-6">
        {['browse', 'parties', 'collections', 'recommendations'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-indigo-400" size={20} />
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-indigo-900/40 border border-indigo-700/30 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-indigo-900/40 border border-indigo-700/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
              <option value="game">Games</option>
              <option value="book">Books</option>
            </select>

            {/* Energy Filter */}
            <select
              value={selectedEnergy}
              onChange={(e) => setSelectedEnergy(e.target.value)}
              className="px-4 py-3 bg-indigo-900/40 border border-indigo-700/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Energy Levels</option>
              <option value="low">Low Energy 🟢</option>
              <option value="medium">Medium Energy 🟡</option>
              <option value="high">High Energy 🔴</option>
            </select>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map(item => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/50 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="text-purple-400" size={24} />
                      <span className={`text-xs px-2 py-1 rounded-full border ${getEnergyColor(item.energyLevel)}`}>
                        {item.energyLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="text-white font-semibold">{item.rating}</span>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-indigo-300 text-sm mb-2">{item.genre}</p>
                  <div className="flex items-center space-x-2 text-indigo-400 text-sm mb-4">
                    <Clock size={14} />
                    <span>{item.duration}</span>
                  </div>

                  {/* Mood Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.mood.map(mood => (
                      <span key={mood} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                        {mood}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  {item.progress !== undefined && item.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-indigo-400 mb-1">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-indigo-900/60 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                      <Play size={16} />
                      <span>{item.progress ? 'Continue' : 'Start'}</span>
                    </button>
                    <button className="bg-indigo-700/50 hover:bg-indigo-600/50 text-white px-4 py-2 rounded-lg transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Watch Parties Tab */}
      {activeTab === 'parties' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Watch Parties</h2>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>Create Party</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchParties.map(party => (
              <div key={party.id} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{party.name}</h3>
                  {party.type === 'movie' && <Film className="text-purple-400" size={24} />}
                  {party.type === 'tv' && <Tv className="text-purple-400" size={24} />}
                  {party.type === 'game' && <Gamepad2 className="text-purple-400" size={24} />}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-indigo-300">
                    <Users size={16} />
                    <span>{party.participants} participants</span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-300">
                    <Clock size={16} />
                    <span>{party.time}</span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Join Party
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collections Tab */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">My Collections</h2>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>New Collection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection, idx) => {
              const Icon = collection.icon;
              return (
                <div key={idx} className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6 hover:bg-indigo-800/50 transition-all cursor-pointer">
                  <Icon className="text-purple-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-white mb-2">{collection.name}</h3>
                  <p className="text-indigo-300">{collection.count} items</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Personalized Recommendations</h2>

          {/* Current Mood */}
          <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">How are you feeling today?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Relaxed', 'Energetic', 'Curious', 'Cozy'].map(mood => (
                <button
                  key={mood}
                  className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-white">Trending in Your Groups</h3>
            </div>
            <p className="text-indigo-300">Discover what others with similar energy patterns are enjoying</p>
          </div>

          {/* AI Recommendations */}
          <div className="bg-indigo-900/40 border border-indigo-700/30 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-white">AI Curated for You</h3>
            </div>
            <p className="text-indigo-300">Based on your current energy level and mood preferences</p>
          </div>
        </div>
      )}
    </div>
  );
}
