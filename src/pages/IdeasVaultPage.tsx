import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, Search, Filter, Film, Tv, BookOpen, X,
  Sparkles, Tag, ChevronDown, Star, Plus, Edit3
} from 'lucide-react';
import { CREATIVE_IDEAS, IDEAS_BY_CATEGORY } from '../data/ideas-vault-seed';

type CategoryType = keyof typeof IDEAS_BY_CATEGORY;

export default function IdeasVaultPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showDevelopedOnly, setShowDevelopedOnly] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<typeof CREATIVE_IDEAS[0] | null>(null);

  // Get unique types
  const types = useMemo(() => {
    const typeSet = new Set<string>();
    CREATIVE_IDEAS.forEach(idea => typeSet.add(idea.type));
    return ['All', ...Array.from(typeSet)];
  }, []);

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    let ideas = IDEAS_BY_CATEGORY[selectedCategory] || [];

    if (selectedType !== 'All') {
      ideas = ideas.filter(idea => idea.type === selectedType);
    }

    if (showDevelopedOnly) {
      ideas = ideas.filter(idea => idea.developed);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      ideas = ideas.filter(idea =>
        idea.title.toLowerCase().includes(query) ||
        idea.logline.toLowerCase().includes(query) ||
        idea.genre.toLowerCase().includes(query) ||
        idea.notes.toLowerCase().includes(query)
      );
    }

    return ideas;
  }, [selectedCategory, selectedType, showDevelopedOnly, searchQuery]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(IDEAS_BY_CATEGORY).forEach(cat => {
      counts[cat] = IDEAS_BY_CATEGORY[cat as CategoryType].length;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 pl-20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Ideas Vault
            </h1>
          </div>
          <p className="text-indigo-300 text-lg">
            {CREATIVE_IDEAS.length} TV/Comic/Movie concepts • {CREATIVE_IDEAS.filter(i => i.developed).length} fully developed
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ideas by title, logline, genre..."
              className="w-full bg-indigo-900/40 border border-indigo-700/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(IDEAS_BY_CATEGORY).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as CategoryType)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-indigo-900/40 text-indigo-200 border border-indigo-700/30 hover:bg-indigo-800/50'
                }`}
              >
                {category} ({categoryCounts[category]})
              </button>
            ))}
          </div>

          {/* Type and Filter Toggles */}
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-indigo-900/40 border border-indigo-700/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button
              onClick={() => setShowDevelopedOnly(!showDevelopedOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                showDevelopedOnly
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'bg-indigo-900/40 text-indigo-200 border border-indigo-700/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Developed Only
            </button>

            <div className="ml-auto text-indigo-300 text-sm">
              Showing {filteredIdeas.length} ideas
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredIdeas.map((idea) => (
              <motion.div
                key={idea.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedIdea(idea)}
                className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-5 border border-indigo-700/30 hover:border-amber-500/50 cursor-pointer transition-all hover:shadow-xl hover:shadow-amber-500/10 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-indigo-300">{idea.type}</p>
                  </div>
                  {idea.developed && (
                    <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 ml-2" />
                  )}
                </div>

                {/* Genre */}
                <div className="mb-3">
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    {idea.genre}
                  </span>
                </div>

                {/* Logline */}
                <p className="text-indigo-100 text-sm mb-3 line-clamp-3">
                  {idea.logline}
                </p>

                {/* Notes Preview */}
                {idea.notes && (
                  <p className="text-xs text-indigo-400 italic line-clamp-2">
                    {idea.notes}
                  </p>
                )}

                {/* View More Indicator */}
                <div className="mt-3 pt-3 border-t border-indigo-700/30 text-xs text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view full details →
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredIdeas.length === 0 && (
          <div className="text-center py-20">
            <Lightbulb className="w-20 h-20 text-indigo-400/30 mx-auto mb-4" />
            <p className="text-indigo-300 text-lg">No ideas found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedType('All');
                setShowDevelopedOnly(false);
              }}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdea(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      {selectedIdea.title}
                    </h2>
                    {selectedIdea.developed && (
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm px-3 py-1 bg-indigo-600/40 text-indigo-200 rounded-full border border-indigo-500/30">
                      {selectedIdea.type}
                    </span>
                    <span className="text-sm px-3 py-1 bg-purple-600/40 text-purple-200 rounded-full border border-purple-500/30">
                      {selectedIdea.genre}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="text-indigo-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Logline */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">Logline</h3>
                <p className="text-lg text-indigo-100 leading-relaxed">
                  {selectedIdea.logline}
                </p>
              </div>

              {/* Notes */}
              {selectedIdea.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">Notes</h3>
                  <p className="text-indigo-200 leading-relaxed">
                    {selectedIdea.notes}
                  </p>
                </div>
              )}

              {/* Development Status */}
              <div className="bg-indigo-900/40 rounded-lg p-4 border border-indigo-700/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-300">Development Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedIdea.developed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedIdea.developed ? 'Fully Developed' : 'Concept Stage'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all font-medium flex items-center justify-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Edit Idea
                </button>
                <button className="flex-1 px-4 py-3 bg-indigo-600/40 text-indigo-200 rounded-lg hover:bg-indigo-600/60 transition-all font-medium border border-indigo-500/30 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add to Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
