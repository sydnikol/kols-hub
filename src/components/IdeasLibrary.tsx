/**
 * 🖤 IDEAS LIBRARY
 * 200-600 curated ideas across food, health, sewing, art, hoodoo, passive income
 * Filter by spoons, tags, difficulty
 */

import React, { useState } from 'react';
import { Search, Filter, Zap, Clock, Tag, DollarSign, Heart, Scissors, Palette, Sparkles, UtensilsCrossed } from 'lucide-react';
import ideasData from '../data/ideas-libraries.json';

type LibraryCategory = 'food' | 'health' | 'sewing' | 'art' | 'hoodoo' | 'passive_income';

const IdeasLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>('food');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxSpoons, setMaxSpoons] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = [
    { id: 'food', name: 'Food Ideas', icon: <UtensilsCrossed />, color: 'orange', count: 20 },
    { id: 'health', name: 'Health Actions', icon: <Heart />, color: 'red', count: 20 },
    { id: 'sewing', name: 'Sewing Projects', icon: <Scissors />, color: 'purple', count: 15 },
    { id: 'art', name: 'Art Prompts', icon: <Palette />, color: 'purple', count: 15 },
    { id: 'hoodoo', name: 'Hoodoo Practices', icon: <Sparkles />, color: 'indigo', count: 15 },
    { id: 'passive_income', name: 'Passive Income', icon: <DollarSign />, color: 'green', count: 15 },
  ];

  const currentData = (ideasData as any)[activeCategory] || [];

  const filteredIdeas = currentData.filter((item: any) => {
    const matchesSearch = !searchQuery || 
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpoons = !item.spoons || item.spoons <= maxSpoons;
    const matchesTags = selectedTags.length === 0 || 
      (item.tags && item.tags.some((tag: string) => selectedTags.includes(tag)));
    return matchesSearch && matchesSpoons && matchesTags;
  });

  // Extract unique tags from current category
  const allTags = [...new Set(currentData.flatMap((item: any) => item.tags || []))];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const renderIdea = (idea: any) => {
    switch (activeCategory) {
      case 'food':
        return (
          <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{idea.name}</h3>
              <div className="flex items-center gap-2">
                {idea.spoons && (
                  <span className="flex items-center gap-1 text-sm px-2 py-1 bg-indigo-900 rounded">
                    <Zap size={14} />
                    {idea.spoons}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {idea.prep_time}
              </span>
              <span>{idea.sodium_mg}mg sodium</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {idea.tags.map((tag: string, idx: number) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-orange-900 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{idea.name}</h3>
              <div className="flex items-center gap-2">
                {idea.spoons && (
                  <span className="flex items-center gap-1 text-sm px-2 py-1 bg-indigo-900 rounded">
                    <Zap size={14} />
                    {idea.spoons}
                  </span>
                )}
                {idea.pots_safe && (
                  <span className="text-xs px-2 py-1 bg-green-900 rounded">POTS Safe</span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-2 capitalize">{idea.category}</div>
            <div className="flex flex-wrap gap-1">
              {idea.tags.map((tag: string, idx: number) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-red-900 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'sewing':
        return (
          <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
            <h3 className="font-semibold mb-2">{idea.name}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
              <span className="capitalize px-2 py-1 bg-purple-900 rounded">{idea.difficulty}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {idea.time}
              </span>
              {idea.spoons && (
                <span className="flex items-center gap-1">
                  <Zap size={14} />
                  {idea.spoons} spoons
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">Materials: {idea.materials.join(', ')}</div>
          </div>
        );

      case 'art':
        return (
          <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="capitalize text-xs px-2 py-1 bg-purple-900 rounded">{idea.type}</div>
              {idea.spoons && (
                <span className="flex items-center gap-1 text-sm px-2 py-1 bg-indigo-900 rounded">
                  <Zap size={14} />
                  {idea.spoons}
                </span>
              )}
            </div>
            <p className="text-gray-300 mb-2">{idea.prompt}</p>
            <div className="flex flex-wrap gap-1">
              {idea.tags.map((tag: string, idx: number) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-purple-800 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'hoodoo':
        return (
          <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
            <h3 className="font-semibold mb-2">{idea.practice}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {idea.time}
              </span>
              {idea.spoons && (
                <span className="flex items-center gap-1">
                  <Zap size={14} />
                  {idea.spoons} spoons
                </span>
              )}
            </div>
            {idea.materials && (
              <div className="text-xs text-gray-500 mb-2">
                Materials: {idea.materials.join(', ')}
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {idea.tags.map((tag: string, idx: number) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-indigo-900 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'passive_income':
        return (
          <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
            <h3 className="font-semibold mb-2">{idea.idea}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-green-900 rounded capitalize">{idea.category}</span>
              <span className="text-xs px-2 py-1 bg-blue-900 rounded capitalize">{idea.effort} effort</span>
              <span className="text-xs px-2 py-1 bg-purple-900 rounded capitalize">{idea.scalability} scale</span>
            </div>
            <div className="text-sm text-gray-400">Startup: {idea.startup_cost}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
          Ideas Library
        </h1>
        <p className="text-gray-400">Curated ideas organized by spoon cost and difficulty</p>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as LibraryCategory)}
            className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
              activeCategory === cat.id
                ? `bg-${cat.color}-600 shadow-lg`
                : 'bg-gray-800 hover:bg-gray-750'
            }`}
          >
            <div className={`mb-2 ${activeCategory === cat.id ? '' : `text-${cat.color}-400`}`}>
              {cat.icon}
            </div>
            <div className="font-semibold text-sm">{cat.name}</div>
            <div className="text-xs text-gray-400 mt-1">{cat.count} ideas</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-800 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Spoon Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Spoons: {maxSpoons}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={maxSpoons}
              onChange={(e) => setMaxSpoons(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Filter by Tags</label>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {allTags.slice(0, 10).map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2 py-1 rounded transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-400">
        Showing {filteredIdeas.length} of {currentData.length} ideas
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea: any) => (
          <div key={idea.id}>{renderIdea(idea)}</div>
        ))}
      </div>
    </div>
  );
};

export default IdeasLibrary;