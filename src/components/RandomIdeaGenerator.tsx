import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Heart, Share2, Bookmark, TrendingUp, Zap, Lightbulb, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface RandomIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  tags: string[];
  inspirationLevel: number;
}

export const RandomIdeaGenerator: React.FC = () => {
  const [currentIdea, setCurrentIdea] = useState<RandomIdea | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<RandomIdea[]>([]);
  const [likedIdeas, setLikedIdeas] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const CATEGORIES = [
    'Health & Wellness',
    'Creative Projects',
    'Organization',
    'Learning',
    'Social Connection',
    'Self-Care',
    'Productivity',
    'Fun & Games',
    'Spiritual',
    'Technology'
  ];

  const IDEAS_DATABASE: RandomIdea[] = [
    {
      id: '1',
      title: 'Start a 5-Minute Meditation Practice',
      description: 'Begin each morning with a simple 5-minute guided meditation focusing on breath awareness.',
      category: 'Health & Wellness',
      difficulty: 'easy',
      estimatedTime: '5 mins/day',
      tags: ['mindfulness', 'mental-health', 'morning-routine'],
      inspirationLevel: 8
    },
    {
      id: '2',
      title: 'Create a Dream Journal with AI Analysis',
      description: 'Record your dreams each morning and use AI to identify patterns and symbols.',
      category: 'Creative Projects',
      difficulty: 'medium',
      estimatedTime: '10 mins/day',
      tags: ['dreams', 'journaling', 'ai', 'pattern-recognition'],
      inspirationLevel: 9
    },
    {
      id: '3',
      title: 'Build a Spoon Theory Tracker',
      description: 'Track your daily energy levels using the spoon metaphor for chronic illness management.',
      category: 'Health & Wellness',
      difficulty: 'easy',
      estimatedTime: '5 mins/day',
      tags: ['chronic-illness', 'energy', 'tracking', 'self-awareness'],
      inspirationLevel: 10
    },
    {
      id: '4',
      title: 'Design Your Personal Tarot Deck',
      description: 'Create custom tarot cards that reflect your personal journey and spiritual practice.',
      category: 'Creative Projects',
      difficulty: 'hard',
      estimatedTime: '20+ hours',
      tags: ['art', 'spirituality', 'creativity', 'tarot'],
      inspirationLevel: 9
    },
    {
      id: '5',
      title: 'Start a Gratitude Photo Album',
      description: 'Take one photo daily of something you\'re grateful for and compile them monthly.',
      category: 'Self-Care',
      difficulty: 'easy',
      estimatedTime: '2 mins/day',
      tags: ['gratitude', 'photography', 'mindfulness'],
      inspirationLevel: 7
    },
    {
      id: '6',
      title: 'Create a Body Weather Map',
      description: 'Map your physical sensations and pain levels throughout the day like a weather forecast.',
      category: 'Health & Wellness',
      difficulty: 'medium',
      estimatedTime: '15 mins/day',
      tags: ['pain-management', 'chronic-illness', 'visualization'],
      inspirationLevel: 8
    },
    {
      id: '7',
      title: 'Build a Personal Sanctuary Playlist',
      description: 'Curate music for each mood and activity - working, resting, energizing, calming.',
      category: 'Creative Projects',
      difficulty: 'easy',
      estimatedTime: '1 hour',
      tags: ['music', 'mood-management', 'self-care'],
      inspirationLevel: 8
    },
    {
      id: '8',
      title: 'Design an Ancestor Altar',
      description: 'Create a dedicated space to honor your ancestors with photos, offerings, and meaningful objects.',
      category: 'Spiritual',
      difficulty: 'medium',
      estimatedTime: '2-3 hours',
      tags: ['spirituality', 'ancestors', 'ritual', 'sacred-space'],
      inspirationLevel: 10
    },
    {
      id: '9',
      title: 'Start a Micro-Habit Challenge',
      description: 'Choose one tiny habit (2 minutes or less) to do every day for 30 days.',
      category: 'Productivity',
      difficulty: 'easy',
      estimatedTime: '2 mins/day',
      tags: ['habits', 'self-improvement', 'consistency'],
      inspirationLevel: 7
    },
    {
      id: '10',
      title: 'Create a Sensory Grounding Kit',
      description: 'Assemble items for each sense to help with dissociation and grounding during difficult moments.',
      category: 'Health & Wellness',
      difficulty: 'medium',
      estimatedTime: '1 hour',
      tags: ['mental-health', 'grounding', 'coping-skills', 'trauma-informed'],
      inspirationLevel: 9
    }
  ];

  useEffect(() => {
    loadSavedIdeas();
    loadLikedIdeas();
  }, []);

  const loadSavedIdeas = () => {
    const stored = localStorage.getItem('kol_saved_random_ideas');
    if (stored) {
      setSavedIdeas(JSON.parse(stored));
    }
  };

  const loadLikedIdeas = () => {
    const stored = localStorage.getItem('kol_liked_ideas');
    if (stored) {
      setLikedIdeas(JSON.parse(stored));
    }
  };

  const generateRandomIdea = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let filteredIdeas = [...IDEAS_DATABASE];

      if (category !== 'all') {
        filteredIdeas = filteredIdeas.filter(idea => idea.category === category);
      }

      if (difficulty !== 'all') {
        filteredIdeas = filteredIdeas.filter(idea => idea.difficulty === difficulty);
      }

      if (filteredIdeas.length === 0) {
        toast.error('No ideas match your filters');
        setIsGenerating(false);
        return;
      }

      const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
      setCurrentIdea(filteredIdeas[randomIndex]);
      setIsGenerating(false);
      toast.success('New idea generated!');
    }, 1000);
  };

  const saveIdea = () => {
    if (!currentIdea) return;
    
    if (savedIdeas.some(idea => idea.id === currentIdea.id)) {
      toast.error('Idea already saved');
      return;
    }

    const updated = [...savedIdeas, currentIdea];
    setSavedIdeas(updated);
    localStorage.setItem('kol_saved_random_ideas', JSON.stringify(updated));
    toast.success('Idea saved!');
  };

  const toggleLike = () => {
    if (!currentIdea) return;

    const updated = likedIdeas.includes(currentIdea.id)
      ? likedIdeas.filter(id => id !== currentIdea.id)
      : [...likedIdeas, currentIdea.id];

    setLikedIdeas(updated);
    localStorage.setItem('kol_liked_ideas', JSON.stringify(updated));
  };

  const shareIdea = () => {
    if (!currentIdea) return;

    if (navigator.share) {
      navigator.share({
        title: currentIdea.title,
        text: currentIdea.description,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(`${currentIdea.title}\n\n${currentIdea.description}`);
      toast.success('Copied to clipboard!');
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-indigo-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (diff: string) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Random Idea Generator</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateRandomIdea}
              disabled={isGenerating}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Idea Display */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current Idea Card */}
            {currentIdea ? (
              <motion.div
                key={currentIdea.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${getDifficultyColor(currentIdea.difficulty)}`} />
                      <span className="text-sm text-gray-400">{getDifficultyText(currentIdea.difficulty)}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">{currentIdea.estimatedTime}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">{currentIdea.title}</h2>
                  </div>
                  <button
                    onClick={toggleLike}
                    className={`p-2 rounded-full ${
                      likedIdeas.includes(currentIdea.id)
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${likedIdeas.includes(currentIdea.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-gray-300 text-lg mb-6">{currentIdea.description}</p>

                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">
                    {currentIdea.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-4 rounded ${
                          i < currentIdea.inspirationLevel
                            ? 'bg-gradient-to-t from-purple-600 to-purple-600'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">Inspiration: {currentIdea.inspirationLevel}/10</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {currentIdea.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveIdea}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded flex items-center justify-center gap-2"
                  >
                    <Bookmark className="w-5 h-5" />
                    Save for Later
                  </button>
                  <button
                    onClick={shareIdea}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-12 text-center">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Ready to be inspired?</h3>
                <p className="text-gray-400 mb-6">Click "Generate New" to discover your next great idea!</p>
                <button
                  onClick={generateRandomIdea}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2 mx-auto"
                >
                  <Zap className="w-5 h-5" />
                  Generate First Idea
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Saved Ideas */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-purple-400" />
                Saved Ideas ({savedIdeas.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedIdeas.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">
                    No saved ideas yet
                  </p>
                ) : (
                  savedIdeas.map(idea => (
                    <div
                      key={idea.id}
                      className="p-3 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => setCurrentIdea(idea)}
                    >
                      <h4 className="text-white font-semibold text-sm mb-1">{idea.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className={`w-2 h-2 rounded-full ${getDifficultyColor(idea.difficulty)}`} />
                        <span>{idea.category}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Generated</span>
                  <span className="text-white font-semibold">{IDEAS_DATABASE.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Saved</span>
                  <span className="text-purple-400 font-semibold">{savedIdeas.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Liked</span>
                  <span className="text-red-400 font-semibold">{likedIdeas.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
