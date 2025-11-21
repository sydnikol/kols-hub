import React, { useEffect, useState } from 'react';
import { WearOS, HealthData } from '../../plugins/wearos';
import { Watch, Heart, TrendingUp, Battery, Activity } from 'lucide-react';

interface WatchStatus {
  connected: boolean;
  deviceName?: string;
  battery?: number;
  isCharging?: boolean;
}

export const PixelWatchDashboard: React.FC = () => {
  const [watchStatus, setWatchStatus] = useState<WatchStatus>({ connected: false });
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [steps, setSteps] = useState<number>(0);

  useEffect(() => {
    checkConnection();
    setupHealthSync();

    return () => {
      WearOS.stopHealthSync();
      WearOS.removeAllListeners();
    };
  }, []);

  const checkConnection = async () => {
    try {
      const result = await WearOS.isConnected();
      setWatchStatus({
        connected: result.connected,
        deviceName: result.deviceName
      });

      if (result.connected) {
        // Get initial data
        const battery = await WearOS.getBatteryLevel();
        setWatchStatus(prev => ({
          ...prev,
          battery: battery.level,
          isCharging: battery.isCharging
        }));

        const stepsData = await WearOS.getStepCount();
        setSteps(stepsData.steps);

        const hrData = await WearOS.getHeartRate();
        setHeartRate(hrData.heartRate);
      }
    } catch (error) {
      console.error('Failed to check watch connection:', error);
    }
  };

  const setupHealthSync = async () => {
    try {
      await WearOS.startHealthSync();

      // Listen for health data updates
      await WearOS.addListener('healthData', (data: HealthData) => {
        setHealthData(data);
        if (data.heartRate) setHeartRate(data.heartRate);
        if (data.steps) setSteps(data.steps);
      });

      // Listen for connection status changes
      await WearOS.addListener('connectionStatus', (status) => {
        setWatchStatus(prev => ({
          ...prev,
          connected: status.connected,
          deviceName: status.deviceName
        }));
      });
    } catch (error) {
      console.error('Failed to start health sync:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await WearOS.sendNotification({
        title: 'KOL Hub',
        message: 'Test notification from your phone!',
        priority: 'normal'
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-500/30">
      <div className="flex items-center gap-3 mb-6">
        <Watch className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-purple-300">Pixel Watch 2</h2>
          <p className="text-sm text-purple-400">
            {watchStatus.connected ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Connected: {watchStatus.deviceName}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Not Connected
              </span>
            )}
          </p>
        </div>
      </div>

      {watchStatus.connected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Heart Rate */}
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-sm text-purple-400">Heart Rate</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {heartRate || '--'}
              <span className="text-lg text-purple-400 ml-1">bpm</span>
            </div>
            <div className="text-xs text-purple-400 mt-1">
              {healthData?.timestamp
                ? new Date(healthData.timestamp).toLocaleTimeString()
                : 'No data'}
            </div>
          </div>

          {/* Steps */}
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-purple-400">Steps Today</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {steps.toLocaleString()}
            </div>
            <div className="text-xs text-purple-400 mt-1">
              Goal: 10,000 steps
            </div>
          </div>

          {/* Activity */}
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-purple-400">Activity</span>
            </div>
            <div className="text-3xl font-bold text-white capitalize">
              {healthData?.calories || 0}
              <span className="text-lg text-purple-400 ml-1">kcal</span>
            </div>
            <div className="text-xs text-purple-400 mt-1">
              Calories burned
            </div>
          </div>

          {/* Battery */}
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-purple-400">Battery</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {watchStatus.battery || '--'}
              <span className="text-lg text-purple-400 ml-1">%</span>
            </div>
            <div className="text-xs text-purple-400 mt-1">
              {watchStatus.isCharging ? 'Charging' : 'Not charging'}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={checkConnection}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
        >
          Refresh Data
        </button>
        {watchStatus.connected && (
          <button
            onClick={sendTestNotification}
            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-colors"
          >
            Send Test Notification
          </button>
        )}
      </div>

      {!watchStatus.connected && (
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm">
            <strong>Setup Required:</strong> Make sure your Pixel Watch 2 is paired with your phone and the Wear OS app is installed.
          </p>
        </div>
      )}
    </div>
  );
};
