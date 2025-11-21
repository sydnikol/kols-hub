import React, { useState, useEffect } from 'react';
import { AutomationEngine, AutomationJob } from '../features/automation/engine/AutomationEngine';
import { TEMPLATE_COUNTS } from '../features/automation/templates/AutomationTemplates';
import {
  Play,
  Pause,
  RefreshCw,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  Users,
  Brain,
  Home as HomeIcon,
  MessageCircle,
  Shield,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const AutomationPage: React.FC = () => {
  const [engine] = useState(() => AutomationEngine.getInstance());
  const [isRunning, setIsRunning] = useState(false);
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [executionLog, setExecutionLog] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allJobs = engine.getAllJobs();
    setJobs(allJobs);
    setStats(engine.getStats());
    setExecutionLog(engine.getExecutionLog(50));
  };

  const handleStart = async () => {
    await engine.start();
    setIsRunning(true);
    toast.success('Automation Engine Started');
    loadData();
  };

  const handleStop = () => {
    engine.stop();
    setIsRunning(false);
    toast.success('Automation Engine Stopped');
    loadData();
  };

  const handleToggleJob = (id: string, enabled: boolean) => {
    engine.toggleJob(id, !enabled);
    toast.success(enabled ? 'Job Disabled' : 'Job Enabled');
    loadData();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health':
        return <Heart className="w-5 h-5" />;
      case 'caregivers':
        return <Users className="w-5 h-5" />;
      case 'mental-health':
        return <Brain className="w-5 h-5" />;
      case 'home':
        return <HomeIcon className="w-5 h-5" />;
      case 'relationships':
        return <MessageCircle className="w-5 h-5" />;
      case 'advocacy':
        return <Shield className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All', count: TEMPLATE_COUNTS.total },
    { id: 'health', label: 'Health & Body', count: TEMPLATE_COUNTS.health },
    { id: 'caregivers', label: 'Caregivers', count: TEMPLATE_COUNTS.caregivers },
    { id: 'mental-health', label: 'Mental Health', count: TEMPLATE_COUNTS['mental-health'] },
    { id: 'home', label: 'Home & Accessibility', count: TEMPLATE_COUNTS.home },
    { id: 'relationships', label: 'Relationships', count: TEMPLATE_COUNTS.relationships },
    { id: 'advocacy', label: 'Advocacy', count: TEMPLATE_COUNTS.advocacy },
  ];

  const filteredJobs = selectedCategory === 'all'
    ? jobs
    : jobs.filter(job => job.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Life Automation Engine
          </h1>
          <p className="text-purple-400">
            250+ Pre-built automations for health, caregiving, advocacy & daily life
          </p>
        </div>

        {/* Engine Status & Controls */}
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Automation Engine</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-purple-300">
                  {isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors font-bold"
                >
                  <Play className="w-5 h-5" />
                  Start Engine
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-colors font-bold"
                >
                  <Pause className="w-5 h-5" />
                  Stop Engine
                </button>
              )}
              <button
                onClick={loadData}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-purple-400 mb-1">Total Jobs</div>
                <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-green-400 mb-1">Active</div>
                <div className="text-2xl font-bold text-white">{stats.activeJobs}</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-blue-400 mb-1">Success Rate</div>
                <div className="text-2xl font-bold text-white">{stats.successRate}</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <div className="text-sm text-purple-400 mb-1">Executions</div>
                <div className="text-2xl font-bold text-white">{stats.totalExecutions}</div>
              </div>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                }`}
              >
                {cat.id !== 'all' && getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 mb-8">
          <h3 className="text-xl font-bold text-purple-300 mb-4">
            Automation Jobs ({filteredJobs.length})
          </h3>

          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-gradient-to-r p-4 rounded-xl border transition-all ${
                  job.enabled
                    ? 'from-purple-900/40 to-indigo-900/40 border-purple-500/40'
                    : 'from-gray-900/20 to-gray-800/20 border-gray-500/20 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {job.category && (
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          {getCategoryIcon(job.category)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white">{job.name}</h4>
                        {job.description && (
                          <p className="text-sm text-purple-400">{job.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-purple-300">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">{job.schedule}</span>
                      </div>
                      {job.tags && (
                        <div className="flex gap-1">
                          {job.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-500/10 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleJob(job.id, job.enabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        job.enabled
                          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                          : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-400'
                      }`}
                      title={job.enabled ? 'Disable' : 'Enable'}
                    >
                      {job.enabled ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Log */}
        <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-300 mb-4">
            Recent Executions ({executionLog.length})
          </h3>

          <div className="space-y-2">
            {executionLog.length > 0 ? (
              executionLog.map((execution, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between bg-black/30 p-3 rounded-lg border ${
                    execution.success
                      ? 'border-green-500/20'
                      : 'border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {execution.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <div className="font-bold text-white text-sm">{execution.jobId}</div>
                      <div className="text-xs text-purple-400">
                        {new Date(execution.timestamp).toLocaleString()}
                      </div>
                      {execution.error && (
                        <div className="text-xs text-red-400 mt-1">{execution.error}</div>
                      )}
                    </div>
                  </div>
                  {execution.duration && (
                    <div className="text-sm text-purple-400">{execution.duration}ms</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No executions yet. Start the engine to begin automations!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationPage;
