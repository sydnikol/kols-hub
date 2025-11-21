import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Moon, Droplet, Pill, Heart, Brain, Zap } from 'lucide-react';
import { healthAnalyticsService, TrendEntry, CorrelationData } from '../../services/healthAnalyticsService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const TrendsCorrelationsPage: React.FC = () => {
  const [trends, setTrends] = useState<Map<string, TrendEntry[]>>(new Map());
  const [selectedMetrics, setSelectedMetrics] = useState<[string, string]>(['sleep', 'pain']);
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);

  const metrics = [
    { id: 'sleep', name: 'Sleep Quality', icon: Moon, color: '#8B5CF6', unit: 'hours' },
    { id: 'sodium', name: 'Sodium Intake', icon: Droplet, color: '#EC4899', unit: 'g' },
    { id: 'meds', name: 'Medication Adherence', icon: Pill, color: '#10B981', unit: '%' },
    { id: 'pain', name: 'Pain Level', icon: Zap, color: '#EF4444', unit: '/10' },
    { id: 'energy', name: 'Energy Level', icon: Activity, color: '#F59E0B', unit: '/10' },
    { id: 'hydration', name: 'Hydration', icon: Droplet, color: '#3B82F6', unit: 'L' },
    { id: 'bp', name: 'Blood Pressure', icon: Heart, color: '#DC2626', unit: 'mmHg' },
    { id: 'hr', name: 'Heart Rate', icon: Activity, color: '#F97316', unit: 'bpm' },
  ];

  useEffect(() => {
    loadData();
  }, [timeRange]);

  useEffect(() => {
    if (selectedMetrics[0] && selectedMetrics[1]) {
      loadCorrelation();
    }
  }, [selectedMetrics, timeRange]);

  const loadData = async () => {
    setLoading(true);
    const trendMap = new Map<string, TrendEntry[]>();

    for (const metric of metrics) {
      const data = await healthAnalyticsService.getTrendsByType(metric.id as any, timeRange);
      trendMap.set(metric.id, data);
    }

    setTrends(trendMap);
    setLoading(false);
  };

  const loadCorrelation = async () => {
    const data = await healthAnalyticsService.calculateCorrelation(
      selectedMetrics[0],
      selectedMetrics[1],
      timeRange
    );
    setCorrelationData(data);
  };

  const getCorrelationStrength = (correlation: number): { text: string; color: string } => {
    const abs = Math.abs(correlation);
    if (abs > 0.7) return { text: 'Strong', color: 'text-green-400' };
    if (abs > 0.4) return { text: 'Moderate', color: 'text-yellow-400' };
    if (abs > 0.2) return { text: 'Weak', color: 'text-orange-400' };
    return { text: 'None', color: 'text-gray-400' };
  };

  const getCorrelationDirection = (correlation: number): string => {
    if (correlation > 0) return 'Positive';
    if (correlation < 0) return 'Negative';
    return 'No';
  };

  // Prepare combined chart data
  const getCombinedChartData = () => {
    const dates = new Set<string>();
    trends.forEach(entries => entries.forEach(e => dates.add(e.date)));
    const sortedDates = Array.from(dates).sort();

    return sortedDates.map(date => {
      const dataPoint: any = { date };
      metrics.forEach(metric => {
        const entry = trends.get(metric.id)?.find(e => e.date === date);
        dataPoint[metric.id] = entry?.value || null;
      });
      return dataPoint;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <TrendingUp size={36} />
              Trends & Correlations
            </h1>
            <p className="text-gray-400 mt-2">Discover patterns in your health data</p>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.slice(0, 4).map(metric => {
            const data = trends.get(metric.id) || [];
            const avg = data.length > 0
              ? (data.reduce((sum, e) => sum + e.value, 0) / data.length).toFixed(1)
              : '0';
            const Icon = metric.icon;

            return (
              <div key={metric.id} className="bg-black/40 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={20} style={{ color: metric.color }} />
                  <span className="text-sm text-gray-400">{metric.name}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: metric.color }}>
                  {avg} {metric.unit}
                </div>
                <div className="text-xs text-gray-500 mt-1">Average</div>
              </div>
            );
          })}
        </div>

        {/* Multi-Metric Chart */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4">All Metrics Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getCombinedChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid #8B5CF6' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              {metrics.map(metric => (
                <Line
                  key={metric.id}
                  type="monotone"
                  dataKey={metric.id}
                  stroke={metric.color}
                  name={metric.name}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Analysis */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4">Correlation Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">First Metric</label>
              <select
                value={selectedMetrics[0]}
                onChange={(e) => setSelectedMetrics([e.target.value, selectedMetrics[1]])}
                className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white"
              >
                {metrics.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Second Metric</label>
              <select
                value={selectedMetrics[1]}
                onChange={(e) => setSelectedMetrics([selectedMetrics[0], e.target.value])}
                className="w-full px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white"
              >
                {metrics.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {correlationData && (
            <>
              <div className="bg-purple-900/20 rounded-lg p-4 mb-6 border border-purple-500/30">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Correlation Coefficient</div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {correlationData.correlation.toFixed(3)}
                  </div>
                  <div className="mt-2">
                    <span className={`${getCorrelationStrength(correlationData.correlation).color} font-semibold`}>
                      {getCorrelationStrength(correlationData.correlation).text}
                    </span>
                    <span className="text-gray-400"> {getCorrelationDirection(correlationData.correlation)} Correlation</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={metrics.find(m => m.id === selectedMetrics[0])?.name}
                    stroke="#9CA3AF"
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={metrics.find(m => m.id === selectedMetrics[1])?.name}
                    stroke="#9CA3AF"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid #8B5CF6' }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter
                    name="Data Points"
                    data={correlationData.dataPoints}
                    fill="#8B5CF6"
                  />
                </ScatterChart>
              </ResponsiveContainer>

              <div className="mt-4 text-sm text-gray-400">
                Showing {correlationData.dataPoints.length} data points
              </div>
            </>
          )}
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain size={24} className="text-purple-400" />
            AI Insights
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-gray-300">
                Your sleep quality shows a {correlationData && Math.abs(correlationData.correlation) > 0.4 ? 'moderate to strong' : 'weak'} relationship with pain levels.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-pink-400 mt-2"></div>
              <p className="text-gray-300">
                Consider tracking additional metrics like stress levels or specific activities to identify more patterns.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-gray-300">
                The data suggests consistent tracking for at least 30 days provides the most reliable insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsCorrelationsPage;
