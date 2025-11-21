import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Activity, Droplets, Flame, Cloud, AlertCircle } from 'lucide-react';

interface DataPoint {
  date: string;
  energy: number;
  pain: number;
  sleep: number;
  hydration: number;
  sodium: number;
  meds: number;
}

const TrendsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('7');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['energy', 'pain']);
  const [data, setData] = useState<DataPoint[]>([]);

  const metrics = [
    { id: 'energy', label: 'Energy', color: 'text-green-400', bgColor: 'bg-green-500' },
    { id: 'pain', label: 'Pain', color: 'text-red-400', bgColor: 'bg-red-500' },
    { id: 'sleep', label: 'Sleep', color: 'text-purple-400', bgColor: 'bg-purple-500' },
    { id: 'hydration', label: 'Hydration', color: 'text-blue-400', bgColor: 'bg-blue-500' },
    { id: 'sodium', label: 'Sodium', color: 'text-orange-400', bgColor: 'bg-orange-500' },
    { id: 'meds', label: 'Meds Taken', color: 'text-pink-400', bgColor: 'bg-pink-500' },
  ];

  // Generate sample data
  useEffect(() => {
    const days = parseInt(timeRange);
    const sampleData: DataPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      sampleData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        energy: Math.floor(Math.random() * 5) + 3,
        pain: Math.floor(Math.random() * 5) + 2,
        sleep: Math.floor(Math.random() * 3) + 5,
        hydration: Math.floor(Math.random() * 3) + 1.5,
        sodium: Math.floor(Math.random() * 2) + 3,
        meds: Math.random() > 0.2 ? 2 : 1,
      });
    }
    setData(sampleData);
  }, [timeRange]);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(m => m !== metricId)
        : [...prev, metricId]
    );
  };

  const calculateCorrelation = (metric1: string, metric2: string): number => {
    // Simple correlation calculation
    if (data.length < 2) return 0;

    const values1 = data.map(d => d[metric1 as keyof DataPoint] as number);
    const values2 = data.map(d => d[metric2 as keyof DataPoint] as number);

    const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
    const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;

    for (let i = 0; i < values1.length; i++) {
      const diff1 = values1[i] - mean1;
      const diff2 = values2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += diff1 * diff1;
      denom2 += diff2 * diff2;
    }

    if (denom1 === 0 || denom2 === 0) return 0;
    return numerator / Math.sqrt(denom1 * denom2);
  };

  const getCorrelationColor = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs > 0.7) return correlation > 0 ? 'text-green-400' : 'text-red-400';
    if (abs > 0.4) return correlation > 0 ? 'text-yellow-400' : 'text-orange-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Trends & Correlations</h2>
        </div>
        <div className="flex gap-2">
          {['7', '14', '30'].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as '7' | '14' | '30')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                timeRange === days
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector */}
      <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20 mb-6">
        <h3 className="text-purple-300 text-sm font-semibold mb-3">Select Metrics to Track</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`p-3 rounded-lg font-semibold transition-all ${
                selectedMetrics.includes(metric.id)
                  ? `${metric.bgColor} bg-opacity-20 border-2 border-current ${metric.color}`
                  : 'bg-gray-800/40 text-gray-400 hover:bg-gray-700/40'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20 mb-6">
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-purple-400">
            {[10, 8, 6, 4, 2, 0].map((val) => (
              <div key={val}>{val}</div>
            ))}
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full relative">
            {/* Grid lines */}
            {[0, 20, 40, 60, 80, 100].map((percent) => (
              <div
                key={percent}
                className="absolute left-0 right-0 border-t border-purple-500/10"
                style={{ top: `${percent}%` }}
              />
            ))}

            {/* Data lines */}
            <svg className="absolute inset-0" preserveAspectRatio="none">
              {selectedMetrics.map((metricId, idx) => {
                const metric = metrics.find(m => m.id === metricId);
                if (!metric) return null;

                const points = data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = 100 - ((d[metricId as keyof DataPoint] as number) / 10 * 100);
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <polyline
                    key={metricId}
                    points={points}
                    fill="none"
                    stroke={metric.color.replace('text-', '')}
                    strokeWidth="2"
                    className="opacity-80"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-purple-400 mt-2">
              {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, idx) => (
                <div key={idx}>{d.date}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Correlations */}
      {selectedMetrics.length >= 2 && (
        <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-purple-400" />
            <h3 className="text-purple-300 text-sm font-semibold">Correlations</h3>
          </div>
          <div className="space-y-2">
            {selectedMetrics.slice(0, -1).map((metric1, i) =>
              selectedMetrics.slice(i + 1).map(metric2 => {
                const correlation = calculateCorrelation(metric1, metric2);
                const metric1Data = metrics.find(m => m.id === metric1);
                const metric2Data = metrics.find(m => m.id === metric2);

                return (
                  <div
                    key={`${metric1}-${metric2}`}
                    className="flex items-center justify-between bg-purple-900/20 p-3 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className={metric1Data?.color}>{metric1Data?.label}</span>
                      <span className="text-purple-400">↔</span>
                      <span className={metric2Data?.color}>{metric2Data?.label}</span>
                    </div>
                    <div className={`font-bold ${getCorrelationColor(correlation)}`}>
                      {correlation > 0 ? '+' : ''}{correlation.toFixed(2)}
                      {Math.abs(correlation) > 0.7 && (
                        <span className="ml-2 text-xs">
                          {correlation > 0 ? '📈 Strong' : '📉 Strong'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-300 text-xs">
                <span className="font-bold">Correlation Guide:</span> +1.0 = perfect positive correlation,
                -1.0 = perfect negative correlation, 0 = no correlation. Values above 0.7 or below -0.7 indicate strong relationships.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
        <p className="text-purple-300 text-xs">
          <span className="font-bold">Track patterns:</span> This chart helps you identify relationships between symptoms,
          lifestyle factors, and health metrics. Look for correlations to understand what helps or hurts.
        </p>
      </div>
    </div>
  );
};

export default TrendsChart;
