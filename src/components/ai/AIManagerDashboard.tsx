/**
 * AI Manager Dashboard Component
 * Visual interface for AI Life Manager insights and controls
 */

import React, { useState } from 'react';
import {
  Brain,
  Heart,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Award,
  Bell,
  Settings,
  ChevronRight,
  X,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';
import {
  useAIManager,
  useAIRoles,
  useCrisisDetection,
  useHealthCorrelations
} from '../../hooks/useAIManager';
import type { AIInsight, AIRole } from '../../services/aiLifeManager';

interface AIManagerDashboardProps {
  compact?: boolean;
}

const AIManagerDashboard: React.FC<AIManagerDashboardProps> = ({ compact = false }) => {
  const {
    insights,
    dailyReport,
    loading,
    dismissInsight,
    refreshInsights,
    refreshDailyReport,
    recordFeedback
  } = useAIManager();

  const { activeRoles, inactiveRoles, toggleRole } = useAIRoles();
  const { crisis } = useCrisisDetection();
  const { correlations } = useHealthCorrelations();

  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [showRoleSettings, setShowRoleSettings] = useState(false);

  const priorityColors = {
    urgent: 'from-red-900/40 to-pink-900/40 border-red-500/50',
    high: 'from-orange-900/40 to-red-900/40 border-orange-500/50',
    medium: 'from-yellow-900/40 to-orange-900/40 border-yellow-500/50',
    low: 'from-blue-900/40 to-indigo-900/40 border-blue-500/50'
  };

  const typeIcons = {
    suggestion: Sparkles,
    warning: AlertTriangle,
    achievement: Award,
    pattern: TrendingUp,
    prediction: Brain,
    reminder: Bell
  };

  const roleIcons: Record<string, React.ReactNode> = {
    'health-advocate': <Heart className="w-5 h-5" />,
    'teacher': <Target className="w-5 h-5" />,
    'partner': <Heart className="w-5 h-5" />,
    'therapist': <Brain className="w-5 h-5" />,
    'doctor': <Activity className="w-5 h-5" />,
    'money-manager': <TrendingUp className="w-5 h-5" />,
    'helper': <Zap className="w-5 h-5" />
  };

  if (loading && !dailyReport) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-center">
          <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
          <span className="ml-3 text-purple-300">AI Brain thinking...</span>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">AI Life Manager</h3>
          </div>
          <button
            onClick={refreshInsights}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
          >
            <Activity className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        {crisis?.detected && crisis.severity !== 'none' && (
          <div className="mb-4 p-4 bg-red-900/40 border border-red-500/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h4 className="font-bold text-red-300">Crisis Detected</h4>
            </div>
            <p className="text-red-200 text-sm">{crisis.triggers.join(', ')}</p>
          </div>
        )}

        {dailyReport && (
          <div className="mb-4">
            <p className="text-purple-300 text-sm mb-3">{dailyReport.summary}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <div className="text-purple-400 text-xs mb-1">Health Score</div>
                <div className="text-2xl font-bold text-white">{dailyReport.healthScore}</div>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <div className="text-purple-400 text-xs mb-1">Energy (Spoons)</div>
                <div className="text-2xl font-bold text-white">{dailyReport.energyPrediction}</div>
              </div>
            </div>
          </div>
        )}

        {insights.length > 0 && (
          <div className="space-y-2">
            {insights.slice(0, 3).map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={dismissInsight}
                onFeedback={recordFeedback}
                compact
              />
            ))}
            {insights.length > 3 && (
              <p className="text-purple-400 text-sm text-center">
                +{insights.length - 3} more insights
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">AI Life Manager</h2>
              <p className="text-purple-400 text-sm">Your central intelligence coordinator</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRoleSettings(!showRoleSettings)}
              className="p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
            >
              <Settings className="w-5 h-5 text-purple-400" />
            </button>
            <button
              onClick={() => {
                refreshInsights();
                refreshDailyReport();
              }}
              className="p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
            >
              <Activity className="w-5 h-5 text-purple-400" />
            </button>
          </div>
        </div>

        {/* Active Roles */}
        <div className="flex flex-wrap gap-2">
          {activeRoles.slice(0, 6).map(role => (
            <div
              key={role.id}
              className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30"
            >
              {roleIcons[role.id] || <Brain className="w-4 h-4" />}
              <span className="text-purple-300 text-sm">{role.name}</span>
            </div>
          ))}
          {activeRoles.length > 6 && (
            <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
              <span className="text-purple-300 text-sm">+{activeRoles.length - 6} more</span>
            </div>
          )}
        </div>
      </div>

      {/* Crisis Alert */}
      {crisis?.detected && crisis.severity !== 'none' && (
        <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 p-6 rounded-2xl border border-red-500/50">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-xl font-bold text-red-300">Crisis Detection Active</h3>
              <p className="text-red-200 text-sm">Severity: {crisis.severity.toUpperCase()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-red-300 font-semibold mb-2">Triggers:</h4>
              <ul className="list-disc list-inside text-red-200 space-y-1">
                {crisis.triggers.map((trigger, idx) => (
                  <li key={idx}>{trigger}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-red-300 font-semibold mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside text-red-200 space-y-1">
                {crisis.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            {crisis.emergencyProtocol && (
              <div className="mt-4 p-4 bg-red-500/20 rounded-lg border border-red-500/50">
                <p className="text-red-100 font-bold text-lg">{crisis.emergencyProtocol}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily Report */}
      {dailyReport && (
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-2xl border border-indigo-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Daily Intelligence Report</h3>
          </div>

          <p className="text-indigo-300 mb-6">{dailyReport.summary}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-500/10 p-4 rounded-xl">
              <div className="text-indigo-400 text-sm mb-1">Health Score</div>
              <div className="text-3xl font-bold text-white">{dailyReport.healthScore}</div>
              <div className="text-indigo-300 text-xs mt-1">/100</div>
            </div>

            <div className="bg-purple-500/10 p-4 rounded-xl">
              <div className="text-purple-400 text-sm mb-1">Energy</div>
              <div className="text-3xl font-bold text-white">{dailyReport.energyPrediction}</div>
              <div className="text-purple-300 text-xs mt-1">spoons</div>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-xl">
              <div className="text-blue-400 text-sm mb-1">Alerts</div>
              <div className="text-3xl font-bold text-white">{dailyReport.alerts.length}</div>
              <div className="text-blue-300 text-xs mt-1">active</div>
            </div>

            <div className="bg-green-500/10 p-4 rounded-xl">
              <div className="text-green-400 text-sm mb-1">Achievements</div>
              <div className="text-3xl font-bold text-white">{dailyReport.achievements.length}</div>
              <div className="text-green-300 text-xs mt-1">today</div>
            </div>
          </div>

          {dailyReport.achievements.length > 0 && (
            <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/30">
              <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Today's Achievements
              </h4>
              <ul className="space-y-1">
                {dailyReport.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-green-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Insights */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AI Insights
          </h3>
          <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
            {insights.length} active
          </span>
        </div>

        <div className="space-y-3">
          {insights.length === 0 ? (
            <p className="text-purple-400 text-center py-8">No insights right now. You're doing great!</p>
          ) : (
            insights.map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={dismissInsight}
                onFeedback={recordFeedback}
                onClick={() => setSelectedInsight(insight)}
              />
            ))
          )}
        </div>
      </div>

      {/* Health Correlations */}
      {correlations.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-2xl border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Health Correlations</h3>
          </div>

          <div className="space-y-3">
            {correlations.map(corr => (
              <div key={corr.id} className="bg-cyan-500/10 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-cyan-300 font-semibold">
                    {corr.variable1} vs {corr.variable2}
                  </h4>
                  <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 text-sm">
                    {(corr.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
                <p className="text-cyan-200 text-sm mb-2">{corr.description}</p>
                <div className="text-cyan-400 text-xs">
                  Based on {corr.dataPoints} data points
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Settings Modal */}
      {showRoleSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-2xl border border-purple-500/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">AI Role Settings</h3>
              <button
                onClick={() => setShowRoleSettings(false)}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30"
              >
                <X className="w-5 h-5 text-purple-400" />
              </button>
            </div>

            <div className="space-y-4">
              {[...activeRoles, ...inactiveRoles].map(role => (
                <RoleCard key={role.id} role={role} onToggle={toggleRole} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-2xl border border-purple-500/50 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedInsight.title}</h3>
              <button
                onClick={() => setSelectedInsight(null)}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30"
              >
                <X className="w-5 h-5 text-purple-400" />
              </button>
            </div>

            <p className="text-purple-200 mb-6">{selectedInsight.message}</p>

            {selectedInsight.actions && (
              <div className="space-y-2">
                {selectedInsight.actions.map(action => (
                  <button
                    key={action.id}
                    className="w-full p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 font-semibold transition-colors"
                    onClick={() => {
                      // Handle action
                      setSelectedInsight(null);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// INSIGHT CARD COMPONENT
// ============================================================================

interface InsightCardProps {
  insight: AIInsight;
  onDismiss: (id: string) => void;
  onFeedback: (id: string, rating: number) => void;
  onClick?: () => void;
  compact?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onDismiss,
  onFeedback,
  onClick,
  compact = false
}) => {
  const priorityColors = {
    urgent: 'from-red-900/40 to-pink-900/40 border-red-500/50',
    high: 'from-orange-900/40 to-red-900/40 border-orange-500/50',
    medium: 'from-yellow-900/40 to-orange-900/40 border-yellow-500/50',
    low: 'from-blue-900/40 to-indigo-900/40 border-blue-500/50'
  };

  const typeIcons = {
    suggestion: Sparkles,
    warning: AlertTriangle,
    achievement: Award,
    pattern: TrendingUp,
    prediction: Brain,
    reminder: Bell
  };

  const Icon = typeIcons[insight.type] || Brain;

  return (
    <div
      className={`bg-gradient-to-br ${priorityColors[insight.priority]} p-4 rounded-xl border ${
        onClick ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-purple-300 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{insight.title}</h4>
          {!compact && <p className="text-purple-200 text-sm mb-3">{insight.message}</p>}

          <div className="flex items-center gap-2 flex-wrap">
            {insight.actions && insight.actions.length > 0 && !compact && (
              <div className="flex gap-2">
                {insight.actions.slice(0, 2).map(action => (
                  <button
                    key={action.id}
                    className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 text-sm font-semibold transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle action
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-1 ml-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedback(insight.id, 1);
                }}
                className="p-1 rounded bg-green-500/20 hover:bg-green-500/30 transition-colors"
              >
                <ThumbsUp className="w-4 h-4 text-green-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedback(insight.id, -1);
                }}
                className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <ThumbsDown className="w-4 h-4 text-red-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(insight.id);
                }}
                className="p-1 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
              >
                <X className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ROLE CARD COMPONENT
// ============================================================================

interface RoleCardProps {
  role: AIRole;
  onToggle: (roleId: any, active: boolean) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onToggle }) => {
  return (
    <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{role.name}</h4>
          <p className="text-purple-300 text-sm mb-2">{role.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-xs">Priority:</span>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < role.priority ? 'bg-purple-400' : 'bg-purple-900/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggle(role.id, !role.active)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            role.active
              ? 'bg-green-500/20 text-green-300 border border-green-500/50'
              : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
          }`}
        >
          {role.active ? 'Active' : 'Inactive'}
        </button>
      </div>

      {role.capabilities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-purple-500/30">
          <div className="text-purple-400 text-xs mb-2">Capabilities:</div>
          <div className="flex flex-wrap gap-2">
            {role.capabilities.map((cap, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-purple-500/20 rounded text-purple-300 text-xs"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIManagerDashboard;
