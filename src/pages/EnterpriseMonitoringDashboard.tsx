import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock, Zap, DollarSign } from 'lucide-react';
import { MetricsCollector, MonitoringDashboard } from '../core/MetricsCollector';
import { CircuitBreakerRegistry, CircuitState } from '../core/CircuitBreaker';
import { workflowOrchestrator, WorkflowStatus } from '../core/WorkflowOrchestrator';

/**
 * ENTERPRISE MONITORING DASHBOARD
 * Real-time system health monitoring (Netflix Spectator-inspired)
 */

export default function EnterpriseMonitoringDashboard() {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [circuitBreakers, setCircuitBreakers] = useState<any>({});
  const [metrics, setMetrics] = useState<any>(null);
  const [workflows, setWorkflows] = useState<any>(null);

  useEffect(() => {
    // Initial load
    refreshData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setSystemHealth(MonitoringDashboard.getSystemHealth());
    setCircuitBreakers(CircuitBreakerRegistry.getAllStats());
    setMetrics(MetricsCollector.getAllMetrics());
    setWorkflows(workflowOrchestrator.getStats());
  };

  const resetMetrics = () => {
    MetricsCollector.reset();
    refreshData();
  };

  const resetCircuitBreaker = (name: string) => {
    CircuitBreakerRegistry.reset(name);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Activity className="w-12 h-12 text-purple-400" />
            <div>
              <h1 className="text-5xl font-bold">Enterprise Monitoring</h1>
              <p className="text-xl text-gray-300">Real-time System Health & Performance</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* System Health Overview */}
        {systemHealth && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <HealthCard
              icon={<CheckCircle />}
              label="API Success Rate"
              value={`${systemHealth.apiSuccessRate.toFixed(1)}%`}
              status={systemHealth.apiSuccessRate > 95 ? 'good' : systemHealth.apiSuccessRate > 80 ? 'warning' : 'critical'}
            />
            <HealthCard
              icon={<Clock />}
              label="Avg API Latency"
              value={`${systemHealth.averageAPILatency.toFixed(0)}ms`}
              status={systemHealth.averageAPILatency < 1000 ? 'good' : systemHealth.averageAPILatency < 3000 ? 'warning' : 'critical'}
            />
            <HealthCard
              icon={<AlertCircle />}
              label="Error Rate"
              value={`${systemHealth.errorRate.toFixed(1)}%`}
              status={systemHealth.errorRate < 1 ? 'good' : systemHealth.errorRate < 5 ? 'warning' : 'critical'}
            />
            <HealthCard
              icon={<DollarSign />}
              label="Total Earnings"
              value={`$${systemHealth.totalEarnings.toLocaleString()}`}
              status="good"
            />
            <HealthCard
              icon={<Zap />}
              label="Content Generated"
              value={systemHealth.contentGenerated.toLocaleString()}
              status="good"
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Circuit Breakers */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Circuit Breakers</h2>
              <div className="text-sm text-gray-300">Hystrix-inspired</div>
            </div>

            {Object.keys(circuitBreakers).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(circuitBreakers).map(([name, stats]: [string, any]) => (
                  <div key={name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{name}</div>
                      <div className="flex items-center gap-2">
                        <CircuitStateIndicator state={stats.state} />
                        <button
                          onClick={() => resetCircuitBreaker(name)}
                          className="text-xs px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded transition-all"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400 text-xs">Calls</div>
                        <div className="font-bold">{stats.totalCalls}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Success</div>
                        <div className="font-bold text-green-400">{stats.totalSuccesses}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Failures</div>
                        <div className="font-bold text-red-400">{stats.totalFailures}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">Rejected</div>
                        <div className="font-bold text-yellow-400">{stats.totalRejected}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No circuit breakers active yet</p>
                <p className="text-sm mt-1">Circuit breakers will appear as API calls are made</p>
              </div>
            )}
          </div>

          {/* Workflow Status */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Workflow Orchestration</h2>
              <div className="text-sm text-gray-300">Maestro-inspired</div>
            </div>

            {workflows && workflows.total > 0 ? (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-500/20 rounded-lg p-4">
                    <div className="text-sm text-gray-300">Total Workflows</div>
                    <div className="text-3xl font-bold">{workflows.total}</div>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-4">
                    <div className="text-sm text-gray-300">Completed</div>
                    <div className="text-3xl font-bold text-green-400">{workflows.completed}</div>
                  </div>
                  <div className="bg-yellow-500/20 rounded-lg p-4">
                    <div className="text-sm text-gray-300">Running</div>
                    <div className="text-3xl font-bold text-yellow-400">{workflows.running}</div>
                  </div>
                  <div className="bg-red-500/20 rounded-lg p-4">
                    <div className="text-sm text-gray-300">Failed</div>
                    <div className="text-3xl font-bold text-red-400">{workflows.failed}</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-300 mb-1">Average Duration</div>
                  <div className="text-2xl font-bold">{(workflows.averageDuration / 1000).toFixed(1)}s</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No workflows executed yet</p>
                <p className="text-sm mt-1">Workflows will appear as content is generated</p>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Section */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">System Metrics</h2>
            <div className="flex gap-2">
              <div className="text-sm text-gray-300">Spectator-inspired</div>
              <button
                onClick={resetMetrics}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-semibold transition-all"
              >
                Reset Metrics
              </button>
            </div>
          </div>

          {metrics && (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Counters */}
              <div>
                <h3 className="text-lg font-bold mb-3">Counters</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.keys(metrics.counters).length > 0 ? (
                    Object.entries(metrics.counters).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-white/5 rounded p-3 border border-white/10">
                        <div className="text-sm text-gray-300 mb-1">{key}</div>
                        <div className="text-xl font-bold">{value.toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 py-4">No counters yet</div>
                  )}
                </div>
              </div>

              {/* Gauges */}
              <div>
                <h3 className="text-lg font-bold mb-3">Gauges</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.keys(metrics.gauges).length > 0 ? (
                    Object.entries(metrics.gauges).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-white/5 rounded p-3 border border-white/10">
                        <div className="text-sm text-gray-300 mb-1">{key}</div>
                        <div className="text-xl font-bold">{value.toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 py-4">No gauges yet</div>
                  )}
                </div>
              </div>

              {/* Timers */}
              <div>
                <h3 className="text-lg font-bold mb-3">Timers</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.keys(metrics.timers).length > 0 ? (
                    Object.entries(metrics.timers).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-white/5 rounded p-3 border border-white/10">
                        <div className="text-sm text-gray-300 mb-2">{value.name}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-400">Mean</div>
                            <div className="font-bold">{value.mean.toFixed(0)}ms</div>
                          </div>
                          <div>
                            <div className="text-gray-400">P95</div>
                            <div className="font-bold">{value.p95.toFixed(0)}ms</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Min</div>
                            <div className="font-bold">{value.min.toFixed(0)}ms</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Max</div>
                            <div className="font-bold">{value.max.toFixed(0)}ms</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 py-4">No timers yet</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4">Live Activity Feed</h2>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {metrics && metrics.counters && Object.keys(metrics.counters).length > 0 ? (
              Object.entries(metrics.counters).slice(-10).reverse().map(([key, value]: [string, any], index) => (
                <div key={index} className="py-1 border-b border-white/10 last:border-0">
                  <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-green-400 ml-2">{key}</span>
                  <span className="text-white ml-2">{value}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-8">
                System monitoring... Activity will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Health Card Component
function HealthCard({ icon, label, value, status }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
}) {
  const statusColors = {
    good: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    critical: 'from-red-500 to-rose-500'
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-r ${statusColors[status]} border border-white/20 shadow-2xl`}>
      <div className="flex items-center gap-3 mb-2">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        <div className="text-sm opacity-90">{label}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

// Circuit State Indicator
function CircuitStateIndicator({ state }: { state: CircuitState }) {
  const stateConfig = {
    [CircuitState.CLOSED]: {
      color: 'bg-green-500',
      text: 'CLOSED',
      icon: <CheckCircle className="w-4 h-4" />
    },
    [CircuitState.OPEN]: {
      color: 'bg-red-500',
      text: 'OPEN',
      icon: <XCircle className="w-4 h-4" />
    },
    [CircuitState.HALF_OPEN]: {
      color: 'bg-yellow-500',
      text: 'HALF-OPEN',
      icon: <AlertCircle className="w-4 h-4" />
    }
  };

  const config = stateConfig[state];

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
      {config.icon}
      {config.text}
    </div>
  );
}
