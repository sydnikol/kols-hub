import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, TrendingUp, Lightbulb, Check, X, 
  Clock, Activity, Zap, ChevronRight, Eye, Settings,
  BarChart2, RefreshCw, Download
} from 'lucide-react';
import selfEvolvingSystem from '../core/SelfEvolvingSystem';

const EvolutionDashboard: React.FC = () => {
  const [insights, setInsights] = useState(selfEvolvingSystem.getInsights());
  const [stats, setStats] = useState(selfEvolvingSystem.getStats());
  const [showSettings, setShowSettings] = useState(false);
  const [learningEnabled, setLearningEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(selfEvolvingSystem.getInsights());
      setStats(selfEvolvingSystem.getStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApproveIdea = (ideaId: string) => {
    selfEvolvingSystem.approveIdea(ideaId);
    setInsights(selfEvolvingSystem.getInsights());
  };

  const handleRejectIdea = (ideaId: string) => {
    selfEvolvingSystem.rejectIdea(ideaId);
    setInsights(selfEvolvingSystem.getInsights());
  };

  const handleExport = () => {
    const data = selfEvolvingSystem.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kol-evolution-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleLearning = () => {
    const newState = !learningEnabled;
    setLearningEnabled(newState);
    selfEvolvingSystem.toggleLearning(newState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Self-Evolution Dashboard</h1>
            <p className="text-purple-300 text-sm">Your app learns and grows with you</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-purple-600/30 text-purple-300 rounded-lg flex items-center gap-2 hover:bg-purple-600/50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-purple-500/20">
          <h3 className="text-white font-medium mb-3">Evolution Settings</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Active Learning</span>
            <button
              onClick={toggleLearning}
              className={`px-4 py-2 rounded-lg transition-colors ${
                learningEnabled 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {learningEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm">Total Uses</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalFeatureUses.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 text-sm">Features Used</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.uniqueFeaturesUsed}</div>
        </div>
        <div className="bg-gradient-to-br from-violet-600/20 to-violet-800/20 rounded-xl p-4 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-violet-400" />
            <span className="text-violet-300 text-sm">Ideas Generated</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalGeneratedIdeas}</div>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-600/20 to-fuchsia-800/20 rounded-xl p-4 border border-fuchsia-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-fuchsia-400" />
            <span className="text-fuchsia-300 text-sm">Implemented</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.implementedIdeas}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Features */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Top Features
          </h2>
          <div className="space-y-3">
            {insights.topFeatures.length === 0 ? (
              <p className="text-gray-400 text-sm">Start using features to see patterns emerge!</p>
            ) : (
              insights.topFeatures.map((feature, idx) => (
                <div 
                  key={feature.featureId}
                  className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-purple-600/50 rounded-full flex items-center justify-center text-sm text-white">
                      {idx + 1}
                    </span>
                    <span className="text-white">{feature.featureName}</span>
                  </div>
                  <span className="text-purple-300">{feature.totalUses} uses</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI-Generated Ideas */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-indigo-500/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI-Generated Ideas ({insights.pendingIdeas.length} pending)
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {insights.pendingIdeas.length === 0 ? (
              <p className="text-gray-400 text-sm">The AI is learning your patterns...</p>
            ) : (
              insights.pendingIdeas.map(idea => (
                <div 
                  key={idea.id}
                  className="bg-gray-700/30 rounded-lg p-4 border border-indigo-500/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium">{idea.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      idea.potentialImpact === 'high' 
                        ? 'bg-green-600/30 text-green-300' 
                        : idea.potentialImpact === 'medium'
                        ? 'bg-yellow-600/30 text-yellow-300'
                        : 'bg-gray-600/30 text-gray-300'
                    }`}>
                      {idea.potentialImpact} impact
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{idea.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 text-xs">{idea.category}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveIdea(idea.id)}
                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectIdea(idea.id)}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-gray-800/30 rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Recent Evolution Activity
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {insights.recentActivity.map((entry, idx) => (
            <div 
              key={entry.id || idx}
              className="flex items-center gap-3 text-sm py-2 border-b border-gray-700/30 last:border-0"
            >
              <span className={`w-2 h-2 rounded-full ${
                entry.type === 'ai_suggestion' ? 'bg-purple-500' :
                entry.type === 'feature_use' ? 'bg-blue-500' :
                entry.type === 'user_feedback' ? 'bg-green-500' :
                'bg-gray-500'
              }`} />
              <span className="text-gray-400">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-white">{entry.description}</span>
              <span className="text-purple-300 ml-auto">{entry.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evolution Status */}
      <div className="mt-6 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          learningEnabled 
            ? 'bg-green-600/20 text-green-300' 
            : 'bg-gray-600/20 text-gray-400'
        }`}>
          <RefreshCw className={`w-4 h-4 ${learningEnabled ? 'animate-spin' : ''}`} />
          {learningEnabled ? 'Actively Learning & Evolving' : 'Learning Paused'}
        </div>
      </div>
    </div>
  );
};

export default EvolutionDashboard;
