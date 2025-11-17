import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Target, Calendar, Activity, Heart, Zap, Lightbulb, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIsuggestion {
  id: string;
  type: 'health' | 'productivity' | 'wellness' | 'creative' | 'social';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actions: string[];
  estimatedImpact: number;
  relatedIdeas: string[];
}

interface UserContext {
  recentActivities: string[];
  healthMetrics: any;
  mood: string[];
  goals: string[];
  preferences: any;
}

export const AIPoweredSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<AIsuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AIsuggestion | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    loadUserContext();
    loadAppliedSuggestions();
    generateInitialSuggestions();
  }, []);

  const loadUserContext = async () => {
    // Load user data from various sources
    try {
      const context: UserContext = {
        recentActivities: JSON.parse(localStorage.getItem('kol_recent_activities') || '[]'),
        healthMetrics: JSON.parse(localStorage.getItem('kol_health_metrics') || '{}'),
        mood: JSON.parse(localStorage.getItem('kol_mood_tracking') || '[]'),
        goals: JSON.parse(localStorage.getItem('kol_goals') || '[]'),
        preferences: JSON.parse(localStorage.getItem('kol_preferences') || '{}')
      };
      setUserContext(context);
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  };

  const loadAppliedSuggestions = () => {
    const applied = localStorage.getItem('kol_applied_suggestions');
    if (applied) {
      setAppliedSuggestions(JSON.parse(applied));
    }
  };

  const generateInitialSuggestions = async () => {
    setLoading(true);
    
    // Simulate AI analysis with sample suggestions
    setTimeout(() => {
      const generated: AIsuggestion[] = [
        {
          id: 'ai_1',
          type: 'health',
          title: 'Optimize Your Medication Schedule',
          description: 'Based on your sleep patterns, consider taking your evening medications 30 minutes earlier',
          reasoning: 'Analysis of your sleep data shows you sleep better when medications are taken earlier. This could improve rest quality by 15%.',
          confidence: 85,
          priority: 'high',
          category: 'Health Management',
          actions: [
            'Review current medication schedule',
            'Consult with your doctor',
            'Update medication reminder times',
            'Track sleep quality for 2 weeks'
          ],
          estimatedImpact: 8,
          relatedIdeas: ['better-sleep-routine', 'medication-tracking']
        },
        {
          id: 'ai_2',
          type: 'wellness',
          title: 'Add Gentle Movement to Morning Routine',
          description: 'Your energy levels are highest in the morning. A 5-minute gentle stretch could help.',
          reasoning: 'Energy tracking shows 20% higher spoon count in mornings. Brief movement can sustain this throughout the day.',
          confidence: 78,
          priority: 'medium',
          category: 'Energy Management',
          actions: [
            'Start with 2-minute stretches',
            'Use video guides for chronic pain-friendly moves',
            'Track energy levels before and after',
            'Gradually increase to 5 minutes'
          ],
          estimatedImpact: 7,
          relatedIdeas: ['spoon-theory-tracking', 'gentle-exercise']
        },
        {
          id: 'ai_3',
          type: 'productivity',
          title: 'Schedule Creative Work During Peak Hours',
          description: 'Your most creative thinking happens between 2-4pm according to activity patterns',
          reasoning: 'Analysis of your journal entries and project work shows increased creativity and flow state during afternoon hours.',
          confidence: 82,
          priority: 'medium',
          category: 'Productivity',
          actions: [
            'Block 2-4pm for creative tasks',
            'Set boundaries around this time',
            'Use morning for admin tasks',
            'Track creative output for validation'
          ],
          estimatedImpact: 9,
          relatedIdeas: ['time-blocking', 'creative-projects']
        },
        {
          id: 'ai_4',
          type: 'social',
          title: 'Weekly Check-in With Support Network',
          description: 'Your mood improves significantly after social interaction. Schedule regular connections.',
          reasoning: 'Mood data shows 30% improvement after social contact. Regular scheduling reduces barrier to reaching out.',
          confidence: 75,
          priority: 'medium',
          category: 'Social Connection',
          actions: [
            'List key support people',
            'Set weekly recurring calendar events',
            'Prepare low-energy connection options',
            'Track mood changes after interactions'
          ],
          estimatedImpact: 8,
          relatedIdeas: ['support-network', 'social-battery']
        },
        {
          id: 'ai_5',
          type: 'creative',
          title: 'Start a Weekly Digital Art Practice',
          description: 'Your interests in gothic aesthetics and creative work align perfectly with digital art',
          reasoning: 'Based on your saved ideas, aesthetic preferences, and available creative tools, digital art could be deeply fulfilling.',
          confidence: 72,
          priority: 'low',
          category: 'Creative Expression',
          actions: [
            'Explore Procreate or similar apps',
            'Follow gothic/dark art tutorials',
            'Set aside 30 mins weekly',
            'Share work in supportive communities'
          ],
          estimatedImpact: 7,
          relatedIdeas: ['gothic-aesthetics', 'creative-outlets']
        }
      ];

      setSuggestions(generated);
      setLoading(false);
      toast.success('AI suggestions generated!');
    }, 2000);
  };

  const applySuggestion = (suggestion: AIsuggestion) => {
    const updated = [...appliedSuggestions, suggestion.id];
    setAppliedSuggestions(updated);
    localStorage.setItem('kol_applied_suggestions', JSON.stringify(updated));
    
    // Create tasks or reminders based on suggestion actions
    const tasks = suggestion.actions.map((action, index) => ({
      id: `task_${Date.now()}_${index}`,
      title: action,
      category: suggestion.category,
      completed: false,
      createdAt: new Date().toISOString()
    }));
    
    const existingTasks = JSON.parse(localStorage.getItem('kol_tasks') || '[]');
    localStorage.setItem('kol_tasks', JSON.stringify([...existingTasks, ...tasks]));
    
    toast.success('Suggestion applied! Tasks created.');
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
    toast.success('Suggestion dismissed');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health': return <Heart className="w-5 h-5" />;
      case 'productivity': return <Target className="w-5 h-5" />;
      case 'wellness': return <Activity className="w-5 h-5" />;
      case 'creative': return <Sparkles className="w-5 h-5" />;
      case 'social': return <Zap className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'from-red-500 to-purple-500';
      case 'productivity': return 'from-blue-500 to-blue-500';
      case 'wellness': return 'from-green-500 to-emerald-500';
      case 'creative': return 'from-purple-500 to-purple-500';
      case 'social': return 'from-indigo-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-indigo-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">AI-Powered Suggestions</h1>
              <p className="text-gray-400 mt-1">Personalized insights based on your patterns and goals</p>
            </div>
          </div>
          <button
            onClick={generateInitialSuggestions}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2 disabled:opacity-50"
          >
            <Brain className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Analyzing...' : 'Refresh Suggestions'}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Suggestions</p>
            <p className="text-2xl font-bold text-white">{suggestions.length}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">High Priority</p>
            <p className="text-2xl font-bold text-red-400">
              {suggestions.filter(s => s.priority === 'high').length}
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Applied</p>
            <p className="text-2xl font-bold text-green-400">{appliedSuggestions.length}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Avg Confidence</p>
            <p className="text-2xl font-bold text-purple-400">
              {suggestions.length > 0
                ? Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)
                : 0}%
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Brain className="w-16 h-16 text-purple-400 animate-pulse mx-auto mb-4" />
              <p className="text-white text-lg">Analyzing your patterns...</p>
              <p className="text-gray-400 text-sm">This may take a moment</p>
            </div>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg">
            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No suggestions available yet</p>
            <p className="text-gray-500 text-sm mt-2">Use the app more to generate personalized insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suggestions.map(suggestion => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${getTypeColor(suggestion.type)} p-4`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <span className="font-semibold">{suggestion.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getPriorityColor(suggestion.priority)}`} />
                      <span className="text-sm opacity-90">{suggestion.confidence}% confidence</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{suggestion.title}</h3>
                  <p className="text-gray-300 mb-4">{suggestion.description}</p>

                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-400 mb-1">AI Reasoning:</p>
                    <p className="text-sm text-purple-200">{suggestion.reasoning}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Estimated Impact</span>
                      <span className="text-sm text-purple-400 font-semibold">
                        {suggestion.estimatedImpact}/10
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded ${
                            i < suggestion.estimatedImpact
                              ? 'bg-gradient-to-r from-purple-600 to-purple-600'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Suggested Actions:</p>
                    <ul className="space-y-2">
                      {suggestion.actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      disabled={appliedSuggestions.includes(suggestion.id)}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {appliedSuggestions.includes(suggestion.id) ? 'Applied ✓' : 'Apply Suggestion'}
                    </button>
                    <button
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
