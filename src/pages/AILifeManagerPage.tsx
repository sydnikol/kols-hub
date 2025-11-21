/**
 * AI Life Manager Page
 * Full interface for the central AI intelligence system
 */

import React, { useState } from 'react';
import {
  Brain,
  Heart,
  GraduationCap,
  Users,
  DollarSign,
  Zap,
  Calendar,
  Shield,
  MessageCircle,
  TrendingUp,
  Activity,
  Home,
  Stethoscope,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';
import AIManagerDashboard from '../components/ai/AIManagerDashboard';
import { useAIRoles, useDailyReport, useHealthCorrelations } from '../hooks/useAIManager';

type ViewMode = 'dashboard' | 'roles' | 'analytics' | 'settings';

const AILifeManagerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const { activeRoles } = useAIRoles();
  const { report } = useDailyReport();
  const { correlations } = useHealthCorrelations();

  const roleCategories = {
    health: ['health-advocate', 'doctor', 'caretaker', 'therapist'],
    productivity: ['helper', 'personal-assistant', 'teacher', 'mentor'],
    lifestyle: ['housewife', 'home-manager', 'money-manager'],
    support: ['partner', 'social-worker', 'fighter']
  };

  const roleIcons: Record<string, any> = {
    'health-advocate': Heart,
    'teacher': GraduationCap,
    'partner': Heart,
    'caretaker': Users,
    'money-manager': DollarSign,
    'helper': Zap,
    'personal-assistant': Calendar,
    'social-worker': Users,
    'fighter': Shield,
    'therapist': MessageCircle,
    'mentor': Target,
    'home-manager': Home,
    'doctor': Stethoscope,
    'housewife': Home
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                AI Life Manager
              </h1>
              <p className="text-purple-400">
                Your central intelligence coordinating everything in your life
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 text-sm">Active Roles</span>
              </div>
              <div className="text-3xl font-bold text-white">{activeRoles.length}</div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-4 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 text-sm">Health Score</span>
              </div>
              <div className="text-3xl font-bold text-white">{report?.healthScore || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span className="text-green-300 text-sm">Energy</span>
              </div>
              <div className="text-3xl font-bold text-white">{report?.energyPrediction || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-4 rounded-xl border border-orange-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <span className="text-orange-300 text-sm">Patterns</span>
              </div>
              <div className="text-3xl font-bold text-white">{correlations.length}</div>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-purple-900/20 p-2 rounded-xl border border-purple-500/30 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                viewMode === 'dashboard'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              <Brain className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => setViewMode('roles')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                viewMode === 'roles'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              <Users className="w-5 h-5" />
              AI Roles
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                viewMode === 'analytics'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>

            <button
              onClick={() => setViewMode('settings')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                viewMode === 'settings'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'dashboard' && <AIManagerDashboard />}

        {viewMode === 'roles' && (
          <div className="space-y-6">
            {/* Health & Medical Roles */}
            <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 p-6 rounded-2xl border border-red-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Heart className="w-7 h-7 text-red-400" />
                Health & Medical Team
              </h3>
              <p className="text-red-300 mb-6">
                Monitoring your vitals, medications, symptoms, and overall health
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoles
                  .filter(role => roleCategories.health.includes(role.id))
                  .map(role => {
                    const Icon = roleIcons[role.id] || Brain;
                    return (
                      <div
                        key={role.id}
                        className="bg-red-500/10 p-4 rounded-xl border border-red-500/30"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Icon className="w-6 h-6 text-red-400 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-bold">{role.name}</h4>
                            <p className="text-red-200 text-sm">{role.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.capabilities.slice(0, 3).map((cap, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-red-500/20 rounded text-red-300 text-xs"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Productivity Roles */}
            <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-6 rounded-2xl border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-7 h-7 text-blue-400" />
                Productivity & Growth
              </h3>
              <p className="text-blue-300 mb-6">
                Helping you learn, grow, and accomplish your goals
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoles
                  .filter(role => roleCategories.productivity.includes(role.id))
                  .map(role => {
                    const Icon = roleIcons[role.id] || Brain;
                    return (
                      <div
                        key={role.id}
                        className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Icon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-bold">{role.name}</h4>
                            <p className="text-blue-200 text-sm">{role.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.capabilities.slice(0, 3).map((cap, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Lifestyle Roles */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-2xl border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Home className="w-7 h-7 text-green-400" />
                Lifestyle & Finance
              </h3>
              <p className="text-green-300 mb-6">
                Managing your home, finances, and daily life
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoles
                  .filter(role => roleCategories.lifestyle.includes(role.id))
                  .map(role => {
                    const Icon = roleIcons[role.id] || Brain;
                    return (
                      <div
                        key={role.id}
                        className="bg-green-500/10 p-4 rounded-xl border border-green-500/30"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Icon className="w-6 h-6 text-green-400 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-bold">{role.name}</h4>
                            <p className="text-green-200 text-sm">{role.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.capabilities.slice(0, 3).map((cap, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-500/20 rounded text-green-300 text-xs"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Support Roles */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-2xl border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Heart className="w-7 h-7 text-purple-400" />
                Emotional & Social Support
              </h3>
              <p className="text-purple-300 mb-6">
                Providing companionship, advocacy, and connection
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoles
                  .filter(role => roleCategories.support.includes(role.id))
                  .map(role => {
                    const Icon = roleIcons[role.id] || Brain;
                    return (
                      <div
                        key={role.id}
                        className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/30"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Icon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-bold">{role.name}</h4>
                            <p className="text-purple-200 text-sm">{role.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.capabilities.slice(0, 3).map((cap, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-500/20 rounded text-purple-300 text-xs"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-2xl border border-indigo-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">AI Analytics & Learning</h3>
              <p className="text-indigo-300 mb-6">
                How your AI Life Manager learns and improves over time
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-500/10 p-6 rounded-xl">
                  <h4 className="text-indigo-300 font-bold mb-4">Health Correlations</h4>
                  {correlations.length === 0 ? (
                    <p className="text-indigo-200">
                      Keep tracking your health data. The AI will detect patterns after 5+ days of
                      data.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {correlations.map(corr => (
                        <div key={corr.id} className="bg-indigo-900/30 p-3 rounded-lg">
                          <div className="text-white font-semibold mb-1">
                            {corr.variable1} ↔ {corr.variable2}
                          </div>
                          <div className="text-indigo-200 text-sm mb-2">{corr.description}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-indigo-900/50 rounded-full h-2">
                              <div
                                className="bg-indigo-400 h-2 rounded-full"
                                style={{ width: `${corr.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-indigo-300 text-xs">
                              {(corr.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-indigo-500/10 p-6 rounded-xl">
                  <h4 className="text-indigo-300 font-bold mb-4">Learning Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-indigo-300">Pattern Recognition</span>
                        <span className="text-white">75%</span>
                      </div>
                      <div className="bg-indigo-900/50 rounded-full h-2">
                        <div className="bg-indigo-400 h-2 rounded-full w-3/4" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-indigo-300">Prediction Accuracy</span>
                        <span className="text-white">60%</span>
                      </div>
                      <div className="bg-indigo-900/50 rounded-full h-2">
                        <div className="bg-indigo-400 h-2 rounded-full w-3/5" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-indigo-300">Data Coverage</span>
                        <span className="text-white">45%</span>
                      </div>
                      <div className="bg-indigo-900/50 rounded-full h-2">
                        <div className="bg-indigo-400 h-2 rounded-full w-[45%]" />
                      </div>
                    </div>

                    <p className="text-indigo-200 text-sm mt-4">
                      The more you use the app and track data, the smarter your AI becomes!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {report && (
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Today's Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-500/10 p-4 rounded-xl">
                    <div className="text-purple-300 text-sm mb-1">Recommendations Given</div>
                    <div className="text-3xl font-bold text-white">
                      {report.recommendations.length}
                    </div>
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-xl">
                    <div className="text-purple-300 text-sm mb-1">Alerts Raised</div>
                    <div className="text-3xl font-bold text-white">{report.alerts.length}</div>
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-xl">
                    <div className="text-purple-300 text-sm mb-1">Tasks Completed</div>
                    <div className="text-3xl font-bold text-white">
                      {report.stats.tasks.completed}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'settings' && (
          <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-2xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">AI Manager Settings</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-purple-300 font-bold mb-3">Monitoring</h4>
                <div className="bg-purple-500/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-white font-semibold">Real-time Monitoring</div>
                      <div className="text-purple-300 text-sm">
                        AI checks your data every 15 minutes
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/50 font-semibold">
                      Active
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">Crisis Detection</div>
                      <div className="text-purple-300 text-sm">
                        Automatic alerts for concerning vitals
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/50 font-semibold">
                      Enabled
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-purple-300 font-bold mb-3">Notifications</h4>
                <div className="space-y-3">
                  <div className="bg-purple-500/10 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-white">High Priority Insights</span>
                    <input type="checkbox" defaultChecked className="w-6 h-6" />
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-white">Daily Report</span>
                    <input type="checkbox" defaultChecked className="w-6 h-6" />
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-white">Achievement Celebrations</span>
                    <input type="checkbox" defaultChecked className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-purple-300 font-bold mb-3">Data & Privacy</h4>
                <div className="bg-purple-500/10 p-4 rounded-xl">
                  <p className="text-purple-200 mb-4">
                    All AI learning and insights are stored locally on your device. No data is sent
                    to external servers.
                  </p>
                  <button className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg font-semibold transition-colors">
                    Clear AI Learning Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILifeManagerPage;
