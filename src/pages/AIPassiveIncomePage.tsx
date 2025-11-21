import React, { useEffect, useState } from 'react';
import { PassiveIncomeOrchestrator } from '../features/passive-income/agents/PassiveIncomeOrchestrator';
import { IncomeExecutor } from '../features/passive-income/strategies/IncomeExecutor';
import { InvestmentAPI } from '../features/passive-income/apis/InvestmentAPI';
import { CryptoAPI } from '../features/passive-income/apis/CryptoAPI';
import { DollarSign, TrendingUp, Zap, Play, Pause, RefreshCw } from 'lucide-react';

const AIPassiveIncomePage: React.FC = () => {
  const [orchestrator] = useState(() => PassiveIncomeOrchestrator.getInstance());
  const [executor] = useState(() => new IncomeExecutor());
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const data = await orchestrator.getStats();
    setStats(data);
    setRecentActivities(data.activities || []);
    setStrategies(executor.getStrategies());
  };

  const handleStart = async () => {
    setIsRunning(true);
    await orchestrator.start();
    await executor.executeAll();
    loadData();
  };

  const handleStop = () => {
    setIsRunning(false);
    orchestrator.stop();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            AI Passive Income Engine
          </h1>
          <p className="text-green-400">
            Your AI is actively generating passive income 24/7
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-300 mb-2">AI Control Center</h3>
              <p className="text-green-400 text-sm">
                Status: {isRunning ? <span className="text-green-400 font-bold">🟢 ACTIVE - Making Money</span> : <span className="text-gray-400">⚫ Paused</span>}
              </p>
            </div>
            <div className="flex gap-3">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Start AI
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Pause AI
                </button>
              )}
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400">Monthly Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white">
              ${stats?.monthlyRevenue?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400">Today's Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white">
              ${stats?.todayRevenue?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="bg-teal-900/20 p-6 rounded-xl border border-teal-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-teal-400" />
              <span className="text-sm text-teal-400">Active Streams</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats?.activeStreams || 0}
            </div>
          </div>

          <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-400">Total Streams</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats?.totalStreams || 0}
            </div>
          </div>
        </div>

        {/* Active Strategies */}
        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 mb-8">
          <h3 className="text-xl font-bold text-green-300 mb-4">
            Active Income Strategies ({strategies.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy, idx) => (
              <div
                key={idx}
                className="bg-black/30 p-4 rounded-lg border border-green-500/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-green-300 text-sm">{strategy.name}</h4>
                  {strategy.autoRun && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      AUTO
                    </span>
                  )}
                </div>
                <p className="text-xs text-green-400 mb-2">{strategy.description}</p>
                <div className="text-xs text-gray-400">
                  Runs every {strategy.interval} hours
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
          <h3 className="text-xl font-bold text-green-300 mb-4">
            Recent Income Activities
          </h3>
          <div className="space-y-2">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-green-500/20"
                >
                  <div>
                    <div className="font-bold text-green-300">{activity.action}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">
                    +${activity.revenue?.toFixed(2) || '0.00'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No activities yet. Start the AI to begin generating income!
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
          <h4 className="font-bold text-green-300 mb-2">🤖 AI-Powered Passive Income</h4>
          <p className="text-green-400 text-sm">
            Your AI is running {strategies.length} automated income strategies including: Content Creation,
            Affiliate Marketing, Investments, Crypto Trading, Digital Products, AI Art, and more.
            All revenue is tracked in real-time and optimized automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIPassiveIncomePage;
