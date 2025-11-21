/**
 * SMART HOME WIDGET
 *
 * Quick access widget for other pages to control smart home
 */

import React, { useState, useEffect } from 'react';
import { Home, Lightbulb, Lock, Thermometer, Play, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SmartThingsDevice, Scene } from '../../services/smartThingsService';
import {
  getDevices,
  getScenes,
  executeScene,
  turnOn,
  turnOff,
  getSmartThingsConfig,
} from '../../services/smartThingsService';

export const SmartHomeWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<SmartThingsDevice[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initWidget();
  }, []);

  const initWidget = async () => {
    try {
      const config = await getSmartThingsConfig();
      if (config?.personalAccessToken) {
        setIsConnected(true);
        const [devicesData, scenesData] = await Promise.all([
          getDevices(),
          getScenes(),
        ]);
        setDevices(devicesData.slice(0, 4)); // Show only first 4 devices
        setScenes(scenesData.filter(s => s.favorite).slice(0, 3)); // Show only favorite scenes
      }
    } catch (error) {
      console.error('Failed to load smart home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceToggle = async (deviceId: string, isOn: boolean) => {
    try {
      if (isOn) {
        await turnOff(deviceId);
      } else {
        await turnOn(deviceId);
      }
      await initWidget(); // Refresh
    } catch (error) {
      console.error('Failed to toggle device:', error);
    }
  };

  const handleSceneActivate = async (sceneId: string) => {
    try {
      await executeScene(sceneId);
    } catch (error) {
      console.error('Failed to activate scene:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Smart Home</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/smarthome')}
          className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          Connect SmartThings
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Smart Home</h3>
        </div>
        <button
          onClick={() => navigate('/smarthome')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Quick Device Controls */}
      {devices.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Controls</p>
          <div className="space-y-2">
            {devices.map(device => {
              const isOn = device.attributes.switch?.value === 'on';
              const Icon =
                device.type === 'light' || device.type === 'dimmer'
                  ? Lightbulb
                  : device.type === 'lock'
                  ? Lock
                  : device.type === 'thermostat'
                  ? Thermometer
                  : Home;

              return (
                <div
                  key={device.deviceId}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isOn ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{device.label}</span>
                  </div>
                  {device.type !== 'thermostat' && (
                    <button
                      onClick={() => handleDeviceToggle(device.deviceId, isOn)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        isOn ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          isOn ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Favorite Scenes */}
      {scenes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Scenes</p>
          <div className="space-y-2">
            {scenes.map(scene => (
              <button
                key={scene.sceneId}
                onClick={() => handleSceneActivate(scene.sceneId)}
                className="w-full flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {scene.name}
                </span>
                <Play className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View All */}
      <button
        onClick={() => navigate('/smarthome')}
        className="w-full mt-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
      >
        View All Devices →
      </button>
    </div>
  );
};
