import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Tag, Calendar, TrendingUp, Sparkles, RefreshCw, BookOpen, Lightbulb, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'idea' | 'planned' | 'in-progress' | 'completed';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  category: string;
  priority: string;
  status: string;
  tags: string[];
  searchTerm: string;
}

export const IndividualIdeaBrowser: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    priority: 'all',
    status: 'all',
    tags: [],
    searchTerm: ''
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');

  useEffect(() => {
    loadIdeas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [ideas, filters, sortBy]);

  const loadIdeas = async () => {
    try {
      // Load from IndexedDB or localStorage
      const stored = localStorage.getItem('kol_ideas');
      if (stored) {
        const loadedIdeas = JSON.parse(stored);
        setIdeas(loadedIdeas);
        
        // Extract unique categories and tags
        const uniqueCategories = [...new Set(loadedIdeas.map((i: Idea) => i.category))];
        const uniqueTags = [...new Set(loadedIdeas.flatMap((i: Idea) => i.tags))];
        
        setCategories(uniqueCategories as string[]);
        setAllTags(uniqueTags as string[]);
      } else {
        // Generate sample ideas if none exist
        generateSampleIdeas();
      }
    } catch (error) {
      console.error('Error loading ideas:', error);
      toast.error('Failed to load ideas');
    }
  };

  const generateSampleIdeas = () => {
    const sampleIdeas: Idea[] = [
      {
        id: '1',
        title: 'Medication Reminder System',
        description: 'Smart notification system with customizable alerts',
        category: 'Health',
        priority: 'high',
        status: 'completed',
        tags: ['health', 'automation', 'notifications'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Dream Journal Integration',
        description: 'Voice-to-text dream recording with AI analysis',
        category: 'Mental Wellness',
        priority: 'medium',
        status: 'in-progress',
        tags: ['mental-health', 'ai', 'journaling'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Spoon Theory Tracker',
        description: 'Daily energy management using spoon metaphor',
        category: 'Health',
        priority: 'high',
        status: 'planned',
        tags: ['chronic-illness', 'energy', 'tracking'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setIdeas(sampleIdeas);
    localStorage.setItem('kol_ideas', JSON.stringify(sampleIdeas));
  };

  const applyFilters = () => {
    let filtered = [...ideas];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(idea => idea.category === filters.category);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(idea => idea.priority === filters.priority);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(idea => idea.status === filters.status);
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(idea => 
        filters.tags.some(tag => idea.tags.includes(tag))
      );
    }

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    setFilteredIdeas(filtered);
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priority: 'all',
      status: 'all',
      tags: [],
      searchTerm: ''
    });
    toast.success('Filters cleared');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-indigo-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'planned': return 'text-indigo-400';
      case 'idea': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Ideas Browser</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            >
              {viewMode === 'grid' ? 'List' : 'Grid'} View
            </button>
            <button
              onClick={loadIdeas}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Ideas</p>
            <p className="text-2xl font-bold text-white">{ideas.length}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Filtered</p>
            <p className="text-2xl font-bold text-purple-400">{filteredIdeas.length}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-blue-400">
              {ideas.filter(i => i.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {ideas.filter(i => i.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  placeholder="Search ideas..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
              >
                <option value="all">All Statuses</option>
                <option value="idea">Idea</option>
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <label className="text-sm text-gray-400 mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    filters.tags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm text-gray-400">Sort by:</label>
            <div className="flex gap-2">
              {['date', 'priority', 'title'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort as any)}
                  className={`px-3 py-1 rounded text-sm ${
                    sortBy === sort
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ideas Display */}
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No ideas found matching your filters</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}>
            {filteredIdeas.map(idea => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{idea.title}</h3>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(idea.priority)}`} />
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{idea.description}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
                    {idea.category}
                  </span>
                  <span className={`text-xs ${getStatusColor(idea.status)}`}>
                    {idea.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {idea.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(idea.updatedAt).toLocaleDateString()}
                  </span>
                  <button className="text-purple-400 hover:text-purple-300">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
