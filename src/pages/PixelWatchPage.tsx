import React from 'react';
import { PixelWatchDashboard } from '../components/wearos/PixelWatchDashboard';

const PixelWatchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pixel Watch 2 Integration
          </h1>
          <p className="text-purple-400">
            Monitor your health data, sync notifications, and control your watch from KOL Hub
          </p>
        </div>

        <PixelWatchDashboard />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Features</h3>
            <ul className="space-y-2 text-purple-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Real-time heart rate monitoring
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Step count tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Calorie burn tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Battery status monitoring
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Send notifications to watch
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Auto-sync health data
              </li>
            </ul>
          </div>

          {/* Setup Guide */}
          <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30">
            <h3 className="text-xl font-bold text-indigo-300 mb-4">Setup Guide</h3>
            <ol className="space-y-3 text-indigo-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/30 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>Pair your Pixel Watch 2 with your phone via Bluetooth</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/30 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>Install the Wear OS app from Google Play Store</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/30 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>Grant KOL Hub permission to access health sensors</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/30 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span>Click "Refresh Data" to start syncing</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Health Insights */}
        <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-300 mb-4">Health Insights</h3>
          <p className="text-purple-400 mb-4">
            Your Pixel Watch 2 data is automatically synced with your KOL Hub health tracking system.
            All health metrics are stored locally on your device for privacy and security.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors">
              View Health Trends
            </button>
            <button className="px-6 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-colors">
              Export Health Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelWatchPage;
