import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Filter,
  Star,
  Bookmark,
  Play,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Palette,
  Music,
  PenTool,
  Scissors,
  Monitor,
  Mic2,
  Video,
  Headphones,
  Podcast,
  BookOpen,
  Gamepad2,
  Waves,
  Wind,
  Smile,
  Heart,
  TrendingUp,
  Eye,
  Tv,
  Film,
  PlayCircle,
  Clock,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  entertainmentLibraryService,
  CreativeIdea,
  DistractionContent,
  WatchList,
} from '../services/entertainmentLibraryService';

type TabType = 'creative' | 'distraction' | 'watchlist' | 'games';
type CategoryFilter = 'all' | string;

const EntertainmentLibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('creative');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Creative Ideas State
  const [creativeIdeas, setCreativeIdeas] = useState<CreativeIdea[]>([]);
  const [creativeCategoryFilter, setCreativeCategoryFilter] = useState<CategoryFilter>('all');
  const [creativeDifficultyFilter, setCreativeDifficultyFilter] = useState<CategoryFilter>('all');
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const [completedIdeas, setCompletedIdeas] = useState<string[]>([]);

  // Distraction Content State
  const [distractionContent, setDistractionContent] = useState<DistractionContent[]>([]);
  const [painLevelFilter, setPainLevelFilter] = useState<CategoryFilter>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<CategoryFilter>('all');
  const [contentCategoryFilter, setContentCategoryFilter] = useState<CategoryFilter>('all');
  const [savedContent, setSavedContent] = useState<string[]>([]);
  const [contentRatings, setContentRatings] = useState<Record<string, number>>({});

  // Watch List State
  const [watchList, setWatchList] = useState<WatchList[]>([]);
  const [watchTypeFilter, setWatchTypeFilter] = useState<CategoryFilter>('all');
  const [watchGenreFilter, setWatchGenreFilter] = useState<CategoryFilter>('all');
  const [watchMoodFilter, setWatchMoodFilter] = useState<CategoryFilter>('all');
  const [watchPlatformFilter, setWatchPlatformFilter] = useState<CategoryFilter>('all');

  // Games State
  const [games, setGames] = useState<Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    playable: boolean;
  }>>([]);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setCreativeIdeas(entertainmentLibraryService.getCreativeIdeas());
    setDistractionContent(entertainmentLibraryService.getDistractionContent());
    setWatchList(entertainmentLibraryService.getWatchList());
    setGames(entertainmentLibraryService.getGames());

    const saved = await entertainmentLibraryService.getSavedIdeas();
    setSavedIdeas(saved);

    const savedContentIds = await entertainmentLibraryService.getSavedContent();
    setSavedContent(savedContentIds);

    // Load completed ideas and ratings from localStorage
    const completedStr = localStorage.getItem('completedIdeas');
    if (completedStr) setCompletedIdeas(JSON.parse(completedStr));

    const ratingsStr = localStorage.getItem('contentRatings');
    if (ratingsStr) setContentRatings(JSON.parse(ratingsStr));
  };

  // Category icons
  const creativeCategoryIcons: Record<string, any> = {
    art: Palette,
    music: Music,
    writing: PenTool,
    craft: Scissors,
    digital: Monitor,
    performance: Mic2,
  };

  const contentTypeIcons: Record<string, any> = {
    video: Video,
    music: Headphones,
    podcast: Podcast,
    audiobook: BookOpen,
    game: Gamepad2,
    meditation: Waves,
    asmr: Wind,
  };

  const contentCategoryIcons: Record<string, any> = {
    calming: Waves,
    funny: Smile,
    educational: BookOpen,
    inspiring: TrendingUp,
    immersive: Eye,
  };

  // Toggle functions
  const toggleSaveIdea = async (ideaId: string) => {
    await entertainmentLibraryService.toggleSaveIdea(ideaId);
    const updated = await entertainmentLibraryService.getSavedIdeas();
    setSavedIdeas(updated);
    toast.success(updated.includes(ideaId) ? 'Idea saved!' : 'Idea unsaved');
  };

  const toggleCompleteIdea = (ideaId: string) => {
    const updated = completedIdeas.includes(ideaId)
      ? completedIdeas.filter(id => id !== ideaId)
      : [...completedIdeas, ideaId];
    setCompletedIdeas(updated);
    localStorage.setItem('completedIdeas', JSON.stringify(updated));
    toast.success(updated.includes(ideaId) ? 'Marked as completed!' : 'Unmarked');
  };

  const toggleSaveContent = async (contentId: string) => {
    await entertainmentLibraryService.toggleSaveContent(contentId);
    const updated = await entertainmentLibraryService.getSavedContent();
    setSavedContent(updated);
    toast.success(updated.includes(contentId) ? 'Content saved!' : 'Content unsaved');
  };

  const rateContent = async (contentId: string, rating: number) => {
    await entertainmentLibraryService.rateContent(contentId, rating);
    setContentRatings({ ...contentRatings, [contentId]: rating });
    toast.success(`Rated ${rating} stars!`);
  };

  const toggleWatched = (watchId: string) => {
    setWatchList(watchList.map(item =>
      item.id === watchId ? { ...item, watched: !item.watched, inProgress: false } : item
    ));
    toast.success('Updated watch status');
  };

  const toggleInProgress = (watchId: string) => {
    setWatchList(watchList.map(item =>
      item.id === watchId ? { ...item, inProgress: !item.inProgress, watched: false } : item
    ));
    toast.success('Updated watch status');
  };

  const updateEpisodeProgress = (watchId: string, episode: number) => {
    setWatchList(watchList.map(item =>
      item.id === watchId ? { ...item, currentEpisode: episode } : item
    ));
  };

  // Filter functions
  const getFilteredCreativeIdeas = () => {
    return creativeIdeas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = creativeCategoryFilter === 'all' || idea.category === creativeCategoryFilter;
      const matchesDifficulty = creativeDifficultyFilter === 'all' || idea.difficulty === creativeDifficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  };

  const getFilteredDistraction = () => {
    return distractionContent.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPainLevel = painLevelFilter === 'all' || content.painLevel === painLevelFilter;
      const matchesType = contentTypeFilter === 'all' || content.type === contentTypeFilter;
      const matchesCategory = contentCategoryFilter === 'all' || content.category === contentCategoryFilter;
      return matchesSearch && matchesPainLevel && matchesType && matchesCategory;
    });
  };

  const getFilteredWatchList = () => {
    return watchList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = watchTypeFilter === 'all' || item.type === watchTypeFilter;
      const matchesGenre = watchGenreFilter === 'all' || item.genre.some(g =>
        g.toLowerCase().includes(watchGenreFilter.toLowerCase())
      );
      const matchesMood = watchMoodFilter === 'all' || item.mood === watchMoodFilter;
      const matchesPlatform = watchPlatformFilter === 'all' || item.platform.some(p =>
        p.toLowerCase().includes(watchPlatformFilter.toLowerCase())
      );
      return matchesSearch && matchesType && matchesGenre && matchesMood && matchesPlatform;
    });
  };

  const getFilteredGames = () => {
    return games.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A24] to-[#2A1A34] text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-blue-900/40 backdrop-blur-xl border-b border-purple-500/20 p-6 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Entertainment Library
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entertainment..."
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'creative', label: 'Creative Ideas', icon: Palette },
            { id: 'distraction', label: 'Pain Distraction', icon: Waves },
            { id: 'watchlist', label: 'Watch List', icon: Tv },
            { id: 'games', label: 'Games', icon: Gamepad2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-black/30 text-gray-400 hover:text-white hover:bg-black/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'creative' && (
            <motion.div
              key="creative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <select
                    value={creativeCategoryFilter}
                    onChange={(e) => setCreativeCategoryFilter(e.target.value)}
                    className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="all">All Categories</option>
                    <option value="art">Art</option>
                    <option value="music">Music</option>
                    <option value="writing">Writing</option>
                    <option value="craft">Craft</option>
                    <option value="digital">Digital</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
                <select
                  value={creativeDifficultyFilter}
                  onChange={(e) => setCreativeDifficultyFilter(e.target.value)}
                  className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Creative Ideas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredCreativeIdeas().map(idea => {
                  const Icon = creativeCategoryIcons[idea.category];
                  const isExpanded = expandedCard === idea.id;
                  const isSaved = savedIdeas.includes(idea.id);
                  const isCompleted = completedIdeas.includes(idea.id);

                  return (
                    <motion.div
                      key={idea.id}
                      layout
                      className={`bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-lg border rounded-xl overflow-hidden ${
                        isCompleted ? 'border-green-500/50' : 'border-purple-500/20'
                      } hover:border-purple-400/50 transition-all`}
                    >
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${
                              idea.category === 'art' ? 'from-pink-500 to-purple-500' :
                              idea.category === 'music' ? 'from-blue-500 to-cyan-500' :
                              idea.category === 'writing' ? 'from-yellow-500 to-orange-500' :
                              idea.category === 'craft' ? 'from-green-500 to-teal-500' :
                              idea.category === 'digital' ? 'from-purple-500 to-indigo-500' :
                              'from-red-500 to-pink-500'
                            }`}>
                              {Icon && <Icon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{idea.title}</h3>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className={`px-2 py-1 rounded-full ${
                                  idea.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                                  idea.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-red-500/20 text-red-300'
                                }`}>
                                  {idea.difficulty}
                                </span>
                                <span className="text-gray-400">{idea.timeRequired}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleSaveIdea(idea.id)}
                              className={`p-2 rounded-lg transition-all ${
                                isSaved ? 'bg-purple-500 text-white' : 'bg-black/30 text-gray-400 hover:text-purple-400'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleCompleteIdea(idea.id)}
                              className={`p-2 rounded-lg transition-all ${
                                isCompleted ? 'bg-green-500 text-white' : 'bg-black/30 text-gray-400 hover:text-green-400'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-3">{idea.description}</p>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : idea.id)}
                          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-purple-500/20"
                            >
                              {/* Materials */}
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-purple-300 mb-2">Materials Needed:</h4>
                                <ul className="space-y-1">
                                  {idea.materials.map((material, idx) => (
                                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                                      <span className="text-purple-400 mr-2">•</span>
                                      {material}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Steps */}
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-purple-300 mb-2">Steps:</h4>
                                <ol className="space-y-2">
                                  {idea.steps.map((step, idx) => (
                                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                                      <span className="text-purple-400 font-semibold mr-2">{idx + 1}.</span>
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {/* Inspiration */}
                              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3">
                                <p className="text-sm italic text-purple-200">"{idea.inspiration}"</p>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                {idea.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-black/30 rounded-full text-xs text-gray-400">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {getFilteredCreativeIdeas().length === 0 && (
                <div className="text-center py-20">
                  <Palette className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No creative ideas found matching your filters.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'distraction' && (
            <motion.div
              key="distraction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <select
                    value={painLevelFilter}
                    onChange={(e) => setPainLevelFilter(e.target.value)}
                    className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="all">All Pain Levels</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <select
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value)}
                  className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                >
                  <option value="all">All Types</option>
                  <option value="video">Video</option>
                  <option value="music">Music</option>
                  <option value="podcast">Podcast</option>
                  <option value="audiobook">Audiobook</option>
                  <option value="game">Game</option>
                  <option value="meditation">Meditation</option>
                  <option value="asmr">ASMR</option>
                </select>
                <select
                  value={contentCategoryFilter}
                  onChange={(e) => setContentCategoryFilter(e.target.value)}
                  className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                >
                  <option value="all">All Categories</option>
                  <option value="calming">Calming</option>
                  <option value="funny">Funny</option>
                  <option value="educational">Educational</option>
                  <option value="inspiring">Inspiring</option>
                  <option value="immersive">Immersive</option>
                </select>
              </div>

              {/* Quick Access Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => {
                    setPainLevelFilter('severe');
                    setContentCategoryFilter('calming');
                  }}
                  className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-lg p-4 hover:border-blue-400/50 transition-all"
                >
                  <Waves className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm font-medium">Severe Pain</p>
                </button>
                <button
                  onClick={() => {
                    setContentCategoryFilter('funny');
                  }}
                  className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/20 rounded-lg p-4 hover:border-yellow-400/50 transition-all"
                >
                  <Smile className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <p className="text-sm font-medium">Make Me Laugh</p>
                </button>
                <button
                  onClick={() => {
                    setContentTypeFilter('meditation');
                  }}
                  className="bg-gradient-to-r from-green-900/30 to-teal-900/30 border border-green-500/20 rounded-lg p-4 hover:border-green-400/50 transition-all"
                >
                  <Waves className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-medium">Meditation</p>
                </button>
                <button
                  onClick={() => {
                    setContentCategoryFilter('immersive');
                  }}
                  className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-400/50 transition-all"
                >
                  <Eye className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm font-medium">Immersive</p>
                </button>
              </div>

              {/* Distraction Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredDistraction().map(content => {
                  const TypeIcon = contentTypeIcons[content.type];
                  const CategoryIcon = contentCategoryIcons[content.category];
                  const isSaved = savedContent.includes(content.id);
                  const rating = contentRatings[content.id] || 0;

                  return (
                    <motion.div
                      key={content.id}
                      layout
                      className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-400/50 transition-all"
                    >
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                              {TypeIcon && <TypeIcon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{content.title}</h3>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className={`px-2 py-1 rounded-full ${
                                  content.painLevel === 'mild' ? 'bg-green-500/20 text-green-300' :
                                  content.painLevel === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-red-500/20 text-red-300'
                                }`}>
                                  {content.painLevel}
                                </span>
                                <span className="text-gray-400">{content.duration}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveContent(content.id)}
                            className={`p-2 rounded-lg transition-all ${
                              isSaved ? 'bg-blue-500 text-white' : 'bg-black/30 text-gray-400 hover:text-blue-400'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-4">{content.description}</p>

                        {/* Category Badge */}
                        <div className="flex items-center space-x-2 mb-4">
                          {CategoryIcon && <CategoryIcon className="w-4 h-4 text-blue-400" />}
                          <span className="text-sm text-blue-300 capitalize">{content.category}</span>
                        </div>

                        {/* Rating */}
                        <div className="mb-3">
                          <p className="text-xs text-gray-400 mb-2">Effectiveness Rating:</p>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => rateContent(content.id, star)}
                                className={`transition-colors ${
                                  star <= rating ? 'text-yellow-400' : 'text-gray-600'
                                }`}
                              >
                                <Star className="w-5 h-5" fill={star <= rating ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Provider Badge */}
                        {content.provider && (
                          <div className="text-xs text-gray-500 capitalize">
                            via {content.provider}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {getFilteredDistraction().length === 0 && (
                <div className="text-center py-20">
                  <Waves className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No content found matching your filters.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'watchlist' && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <select
                    value={watchTypeFilter}
                    onChange={(e) => setWatchTypeFilter(e.target.value)}
                    className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="all">All Types</option>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                    <option value="documentary">Documentary</option>
                    <option value="anime">Anime</option>
                    <option value="youtube_playlist">YouTube Playlist</option>
                  </select>
                </div>
                <select
                  value={watchMoodFilter}
                  onChange={(e) => setWatchMoodFilter(e.target.value)}
                  className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                >
                  <option value="all">All Moods</option>
                  <option value="uplifting">Uplifting</option>
                  <option value="relaxing">Relaxing</option>
                  <option value="exciting">Exciting</option>
                  <option value="thought-provoking">Thought-Provoking</option>
                  <option value="funny">Funny</option>
                </select>
                <input
                  type="text"
                  placeholder="Filter by platform..."
                  value={watchPlatformFilter === 'all' ? '' : watchPlatformFilter}
                  onChange={(e) => setWatchPlatformFilter(e.target.value || 'all')}
                  className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400/50"
                />
              </div>

              {/* Watch List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredWatchList().map(item => {
                  const progress = item.episodeCount && item.currentEpisode
                    ? (item.currentEpisode / item.episodeCount) * 100
                    : 0;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className={`bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur-lg border rounded-xl overflow-hidden ${
                        item.watched ? 'border-green-500/50' : item.inProgress ? 'border-blue-500/50' : 'border-pink-500/20'
                      } hover:border-pink-400/50 transition-all`}
                    >
                      {/* Thumbnail Placeholder */}
                      <div className="h-48 bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                        {item.type === 'movie' ? <Film className="w-16 h-16 text-purple-300" /> :
                         item.type === 'series' ? <Tv className="w-16 h-16 text-pink-300" /> :
                         item.type === 'anime' ? <Sparkles className="w-16 h-16 text-blue-300" /> :
                         <Video className="w-16 h-16 text-purple-300" />}
                      </div>

                      <div className="p-5">
                        {/* Title and Rating */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg flex-1">{item.title}</h3>
                          {item.rating && (
                            <div className="flex items-center space-x-1 ml-2">
                              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                              <span className="text-sm text-yellow-400">{item.rating}</span>
                            </div>
                          )}
                        </div>

                        {/* Type and Mood */}
                        <div className="flex items-center space-x-2 mb-3 text-xs">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full capitalize">
                            {item.type}
                          </span>
                          <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full capitalize">
                            {item.mood}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-3">{item.description}</p>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.genre.map((genre, idx) => (
                            <span key={idx} className="px-2 py-1 bg-black/30 rounded-full text-xs text-gray-400">
                              {genre}
                            </span>
                          ))}
                        </div>

                        {/* Platforms */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-400 mb-1">Available on:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.platform.map((platform, idx) => (
                              <span key={idx} className="text-xs text-blue-300">
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Episode Counter for Series */}
                        {item.episodeCount && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2 text-sm">
                              <span className="text-gray-400">Progress:</span>
                              <span className="text-purple-300">
                                {item.currentEpisode || 0} / {item.episodeCount} episodes
                              </span>
                            </div>
                            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={item.episodeCount}
                              value={item.currentEpisode || 0}
                              onChange={(e) => updateEpisodeProgress(item.id, parseInt(e.target.value))}
                              className="w-full mt-2"
                            />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleInProgress(item.id)}
                            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                              item.inProgress
                                ? 'bg-blue-500 text-white'
                                : 'bg-black/30 text-gray-400 hover:bg-blue-900/30 hover:text-blue-300'
                            }`}
                          >
                            <PlayCircle className="w-4 h-4 inline mr-1" />
                            {item.inProgress ? 'Watching' : 'Start'}
                          </button>
                          <button
                            onClick={() => toggleWatched(item.id)}
                            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                              item.watched
                                ? 'bg-green-500 text-white'
                                : 'bg-black/30 text-gray-400 hover:bg-green-900/30 hover:text-green-300'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            {item.watched ? 'Watched' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {getFilteredWatchList().length === 0 && (
                <div className="text-center py-20">
                  <Tv className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No shows or movies found matching your filters.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredGames().map(game => (
                  <motion.div
                    key={game.id}
                    layout
                    className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-lg border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-400/50 transition-all"
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                          <Gamepad2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
                          <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full">
                            {game.category}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4">{game.description}</p>

                      {/* Play Button */}
                      {game.playable && (
                        <button
                          onClick={() => {
                            setActiveGame(game.id);
                            toast.success(`Launching ${game.title}...`);
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center space-x-2"
                        >
                          <Play className="w-5 h-5" />
                          <span>Play Game</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {getFilteredGames().length === 0 && (
                <div className="text-center py-20">
                  <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No games found.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setActiveGame(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#1A1A24] to-[#2A1A34] border border-purple-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {games.find(g => g.id === activeGame)?.title}
                </h2>
                <button
                  onClick={() => setActiveGame(null)}
                  className="p-2 rounded-lg bg-black/30 hover:bg-red-900/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 h-[70vh] flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                <div className="text-center">
                  <Gamepad2 className="w-24 h-24 mx-auto mb-4 text-purple-400" />
                  <p className="text-gray-400">Game implementation coming soon...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    This would launch the {games.find(g => g.id === activeGame)?.title} game
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntertainmentLibraryPage;
