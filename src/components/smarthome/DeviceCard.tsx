/**
 * DEVICE CARD COMPONENT
 *
 * Beautiful device cards with real-time controls
 */

import React, { useState } from 'react';
import {
  Power,
  Lightbulb,
  Lock,
  Thermometer,
  Camera,
  Wifi,
  WifiOff,
  AlertCircle,
  ChevronRight,
  Zap,
  Eye,
  Fan,
  Sun,
  Droplets,
} from 'lucide-react';
import type { SmartThingsDevice } from '../../services/smartThingsService';
import {
  turnOn,
  turnOff,
  setLevel,
  setThermostat,
  lockDoor,
  unlockDoor,
  refreshDeviceStatus,
} from '../../services/smartThingsService';

interface DeviceCardProps {
  device: SmartThingsDevice;
  onDeviceUpdate?: (device: SmartThingsDevice) => void;
  compact?: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onDeviceUpdate,
  compact = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const isOn = device.attributes.switch?.value === 'on';
      if (isOn) {
        await turnOff(device.deviceId);
      } else {
        await turnOn(device.deviceId);
      }

      // Refresh device status
      const updated = await refreshDeviceStatus(device.deviceId);
      onDeviceUpdate?.(updated);
    } catch (error) {
      console.error('Failed to toggle device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelChange = async (level: number) => {
    setIsLoading(true);
    try {
      await setLevel(device.deviceId, level);
      const updated = await refreshDeviceStatus(device.deviceId);
      onDeviceUpdate?.(updated);
    } catch (error) {
      console.error('Failed to set level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockToggle = async () => {
    setIsLoading(true);
    try {
      const isLocked = device.attributes.lock?.value === 'locked';
      if (isLocked) {
        await unlockDoor(device.deviceId);
      } else {
        await lockDoor(device.deviceId);
      }

      const updated = await refreshDeviceStatus(device.deviceId);
      onDeviceUpdate?.(updated);
    } catch (error) {
      console.error('Failed to toggle lock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'light':
      case 'dimmer':
        return <Lightbulb className="w-6 h-6" />;
      case 'lock':
        return <Lock className="w-6 h-6" />;
      case 'thermostat':
        return <Thermometer className="w-6 h-6" />;
      case 'camera':
        return <Camera className="w-6 h-6" />;
      case 'outlet':
        return <Zap className="w-6 h-6" />;
      case 'fan':
        return <Fan className="w-6 h-6" />;
      case 'blind':
        return <Sun className="w-6 h-6" />;
      case 'humidifier':
        return <Droplets className="w-6 h-6" />;
      default:
        return <Power className="w-6 h-6" />;
    }
  };

  const getStatusColor = () => {
    switch (device.status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-gray-400';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const isOn = device.attributes.switch?.value === 'on';
  const level = device.attributes.switchLevel?.value || 0;
  const temperature = device.attributes.temperature?.value;
  const isLocked = device.attributes.lock?.value === 'locked';
  const thermostatMode = device.attributes.thermostatMode?.value;
  const coolingSetpoint = device.attributes.thermostatCoolingSetpoint?.value;
  const heatingSetpoint = device.attributes.thermostatHeatingSetpoint?.value;

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${isOn ? 'text-purple-600' : 'text-gray-400'} transition-colors`}>
              {getDeviceIcon()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{device.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{device.type}</p>
            </div>
          </div>

          {device.type === 'lock' ? (
            <button
              onClick={handleLockToggle}
              disabled={isLoading || device.status !== 'online'}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isLocked
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLocked ? 'Locked' : 'Unlocked'}
            </button>
          ) : (
            <button
              onClick={handleToggle}
              disabled={isLoading || device.status !== 'online'}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isOn ? 'bg-purple-600' : 'bg-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isOn ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                isOn ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              } transition-colors`}
            >
              {getDeviceIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {device.label}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {device.type}
                </span>
                {device.status === 'online' ? (
                  <Wifi className={`w-4 h-4 ${getStatusColor()}`} />
                ) : device.status === 'offline' ? (
                  <WifiOff className={`w-4 h-4 ${getStatusColor()}`} />
                ) : (
                  <AlertCircle className={`w-4 h-4 ${getStatusColor()}`} />
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-transform ${
                showDetails ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Switch */}
          {device.capabilities.includes('switch') && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Power</span>
              <button
                onClick={handleToggle}
                disabled={isLoading || device.status !== 'online'}
                className={`w-14 h-7 rounded-full transition-colors relative ${
                  isOn ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    isOn ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Dimmer */}
          {device.capabilities.includes('switchLevel') && isOn && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brightness
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{level}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={level}
                onChange={e => handleLevelChange(parseInt(e.target.value))}
                disabled={isLoading || device.status !== 'online'}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          )}

          {/* Lock */}
          {device.type === 'lock' && (
            <button
              onClick={handleLockToggle}
              disabled={isLoading || device.status !== 'online'}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isLocked
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLocked ? 'Locked' : 'Unlocked'}
            </button>
          )}

          {/* Thermostat */}
          {device.type === 'thermostat' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {temperature}°F
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-blue-600 dark:text-blue-400 font-medium">Cool</div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {coolingSetpoint}°F
                  </div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <div className="text-red-600 dark:text-red-400 font-medium">Heat</div>
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {heatingSetpoint}°F
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 capitalize">
                Mode: {thermostatMode}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Device Info</h4>
          <div className="space-y-2 text-sm">
            {device.manufacturer && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Manufacturer</span>
                <span className="text-gray-900 dark:text-white">{device.manufacturer}</span>
              </div>
            )}
            {device.model && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Model</span>
                <span className="text-gray-900 dark:text-white">{device.model}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Device ID</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {device.deviceId.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className={`font-medium capitalize ${getStatusColor()}`}>
                {device.status}
              </span>
            </div>
            {device.lastUpdated && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(device.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Capabilities</h4>
            <div className="flex flex-wrap gap-2">
              {device.capabilities.map(cap => (
                <span
                  key={cap}
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
