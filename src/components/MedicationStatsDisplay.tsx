import React from 'react';
import { MedicationStats as Stats } from '../types/medication';
import { TrendingUp, Check, X, AlertCircle, Calendar } from 'lucide-react';

interface Props {
  stats: Stats;
  medications: any[];
  todayLogs: any[];
}

const MedicationStatsDisplay: React.FC<Props> = ({ stats, medications, todayLogs }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Adherence Rate</h3>
            <TrendingUp size={24} className="text-purple-400" />
          </div>
          <div className="text-4xl font-bold mb-2">{stats.adherenceRate}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.adherenceRate}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Taken Today</h3>
            <Check size={24} className="text-green-400" />
          </div>
          <div className="text-4xl font-bold">{stats.takenToday}</div>
          <p className="text-sm text-gray-400 mt-2">
            {stats.takenToday} of {stats.takenToday + stats.missedToday} daily medications
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/20 to-orange-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Need Refill</h3>
            <AlertCircle size={24} className="text-indigo-400" />
          </div>
          <div className="text-4xl font-bold">{stats.needingRefill}</div>
          <p className="text-sm text-gray-400 mt-2">
            Medications requiring refills
          </p>
        </div>
      </div>

      <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {todayLogs.slice(0, 5).map((log, i) => (
            <div key={i} className="flex items-center gap-4 bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
              <Check size={16} className="text-green-400" />
              <div className="flex-1">
                <p className="font-semibold">{log.medicationName}</p>
                <p className="text-sm text-gray-400">{new Date(log.takenAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {todayLogs.length === 0 && (
            <p className="text-center text-gray-400 py-4">No medications logged today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationStatsDisplay;
