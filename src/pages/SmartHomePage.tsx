/**
 * SMART HOME PAGE
 *
 * Samsung SmartThings integration with health-aware automation
 */

import React, { useState, useEffect } from 'react';
import {
  Home,
  Plus,
  RefreshCw,
  Settings,
  Play,
  Zap,
  Activity,
  TrendingUp,
  Grid,
  List,
  Star,
  Clock,
  Lightbulb,
  Lock,
  Thermometer,
  Camera,
  Power,
} from 'lucide-react';
import { DeviceCard } from '../components/smarthome/DeviceCard';
import { AutomationBuilder } from '../components/smarthome/AutomationBuilder';
import type {
  SmartThingsDevice,
  Room,
  Scene,
  Automation,
} from '../services/smartThingsService';
import {
  getSmartThingsConfig,
  setSmartThingsConfig,
  testConnection,
  discoverDevices,
  getDevices,
  getRooms,
  getScenes,
  executeScene,
  deleteScene,
  getAutomations,
  executeAutomation,
  createPresetScenes,
  startHealthMonitoring,
  stopHealthMonitoring,
} from '../services/smartThingsService';

type ViewMode = 'grid' | 'list' | 'rooms';
type TabView = 'devices' | 'scenes' | 'automations' | 'energy';

export const SmartHomePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [token, setToken] = useState('');
  const [devices, setDevices] = useState<SmartThingsDevice[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<TabView>('devices');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [healthMonitoring, setHealthMonitoring] = useState(false);
  const [showAutomationBuilder, setShowAutomationBuilder] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | undefined>();

  useEffect(() => {
    initializeSmartThings();
  }, []);

  const initializeSmartThings = async () => {
    const config = await getSmartThingsConfig();
    if (config?.personalAccessToken) {
      setToken(config.personalAccessToken);
      const connected = await testConnection();
      setIsConnected(connected);

      if (connected) {
        loadData();
      }
    } else {
      setIsConfiguring(true);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [devicesData, scenesData, automationsData] = await Promise.all([
        getDevices(),
        getScenes(),
        getAutomations(),
      ]);

      setDevices(devicesData);
      setScenes(scenesData);
      setAutomations(automationsData);

      if (devicesData.length > 0) {
        const config = await getSmartThingsConfig();
        if (config?.locationId) {
          const roomsData = await getRooms(config.locationId);
          setRooms(roomsData);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!token) {
      alert('Please enter your SmartThings Personal Access Token');
      return;
    }

    setIsLoading(true);
    try {
      await setSmartThingsConfig({ personalAccessToken: token });
      const connected = await testConnection();

      if (connected) {
        setIsConnected(true);
        setIsConfiguring(false);
        await handleDiscover();
      } else {
        alert('Failed to connect. Please check your token and try again.');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect to SmartThings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscover = async () => {
    setIsLoading(true);
    try {
      const config = await getSmartThingsConfig();
      const devicesData = await discoverDevices(config?.locationId);
      setDevices(devicesData);

      if (config?.locationId) {
        const roomsData = await getRooms(config.locationId);
        setRooms(roomsData);
      }

      // Create preset scenes if none exist
      const scenesData = await getScenes();
      if (scenesData.length === 0 && devicesData.length > 0) {
        await createPresetScenes();
        const updatedScenes = await getScenes();
        setScenes(updatedScenes);
      }
    } catch (error) {
      console.error('Discovery failed:', error);
      alert('Failed to discover devices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteScene = async (sceneId: string) => {
    try {
      await executeScene(sceneId);
      alert('Scene executed successfully!');
    } catch (error) {
      console.error('Failed to execute scene:', error);
      alert('Failed to execute scene');
    }
  };

  const handleDeleteScene = async (sceneId: string) => {
    if (confirm('Are you sure you want to delete this scene?')) {
      try {
        await deleteScene(sceneId);
        setScenes(scenes.filter(s => s.sceneId !== sceneId));
      } catch (error) {
        console.error('Failed to delete scene:', error);
        alert('Failed to delete scene');
      }
    }
  };

  const handleExecuteAutomation = async (automationId: string) => {
    try {
      await executeAutomation(automationId);
      alert('Automation executed successfully!');
      loadData();
    } catch (error) {
      console.error('Failed to execute automation:', error);
      alert('Failed to execute automation');
    }
  };

  const toggleHealthMonitoring = () => {
    if (healthMonitoring) {
      stopHealthMonitoring();
      setHealthMonitoring(false);
    } else {
      startHealthMonitoring();
      setHealthMonitoring(true);
    }
  };

  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Samsung SmartThings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your smart home with health-aware automation
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personal Access Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="Enter your SmartThings PAT..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Get your Personal Access Token from the{' '}
                  <a
                    href="https://account.smartthings.com/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    SmartThings Developer Portal
                  </a>
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={isLoading || !token}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Connecting...' : 'Connect SmartThings'}
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Health-Aware Features:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Activity className="w-4 h-4 mt-0.5 text-purple-600" />
                    Automatic environment adjustments based on pain levels
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 mt-0.5 text-purple-600" />
                    Energy-aware lighting and temperature control
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 mt-0.5 text-purple-600" />
                    Custom scenes for different health states
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 text-purple-600" />
                    Medication reminders with light notifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Not connected to SmartThings
          </p>
          <button
            onClick={() => setIsConfiguring(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Configure Connection
          </button>
        </div>
      </div>
    );
  }

  const filteredDevices = selectedRoom
    ? devices.filter(d => d.roomId === selectedRoom)
    : devices;

  const deviceStats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    lights: devices.filter(d => d.type === 'light' || d.type === 'dimmer').length,
    locks: devices.filter(d => d.type === 'lock').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Home Control
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Health-aware automation powered by SmartThings
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleHealthMonitoring}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                healthMonitoring
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              Health Monitoring {healthMonitoring ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleDiscover}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsConfiguring(true)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Devices</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {deviceStats.total}
                </p>
              </div>
              <Home className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {deviceStats.online}
                </p>
              </div>
              <Power className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lights</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {deviceStats.lights}
                </p>
              </div>
              <Lightbulb className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scenes</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {scenes.length}
                </p>
              </div>
              <Star className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'devices'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Devices
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'scenes'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Scenes
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'automations'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Automations
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'energy'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Energy
          </button>
        </div>

        {/* Content */}
        {activeTab === 'devices' && (
          <div>
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('rooms')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'rooms'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>

              {viewMode === 'rooms' && (
                <select
                  value={selectedRoom || ''}
                  onChange={e => setSelectedRoom(e.target.value || null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Rooms</option>
                  {rooms.map(room => (
                    <option key={room.roomId} value={room.roomId}>
                      {room.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Devices Grid */}
            <div
              className={
                viewMode === 'list'
                  ? 'space-y-4'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {filteredDevices.map(device => (
                <DeviceCard
                  key={device.deviceId}
                  device={device}
                  onDeviceUpdate={updated => {
                    setDevices(devices.map(d => (d.deviceId === updated.deviceId ? updated : d)));
                  }}
                  compact={viewMode === 'list'}
                />
              ))}
            </div>

            {filteredDevices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedRoom ? 'No devices in this room' : 'No devices found'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scenes' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenes.map(scene => (
                <div
                  key={scene.sceneId}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: scene.color || '#9333EA' }}
                      >
                        {scene.icon === 'sunrise' && '🌅'}
                        {scene.icon === 'moon' && '🌙'}
                        {scene.icon === 'zap' && '⚡'}
                        {scene.icon === 'heart-pulse' && '💜'}
                        {scene.icon === 'shield-alert' && '🛡️'}
                        {scene.icon === 'pill' && '💊'}
                        {scene.icon === 'siren' && '🚨'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {scene.name}
                        </h3>
                        {scene.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {scene.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {scene.favorite && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                  </div>

                  {scene.healthTrigger && (
                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Auto-activates when {scene.healthTrigger.metric} is{' '}
                        {scene.healthTrigger.comparison} {scene.healthTrigger.threshold}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExecuteScene(scene.sceneId)}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Activate
                    </button>
                    <button
                      onClick={() => handleDeleteScene(scene.sceneId)}
                      className="px-3 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'automations' && (
          <div>
            {!showAutomationBuilder && (
              <>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => {
                      setEditingAutomation(undefined);
                      setShowAutomationBuilder(true);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Automation
                  </button>
                </div>

                <div className="space-y-4">
                  {automations.map(automation => (
                    <div
                      key={automation.automationId}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {automation.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                automation.enabled
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {automation.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          {automation.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {automation.description}
                            </p>
                          )}
                          {automation.lastTriggered && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Last triggered: {new Date(automation.lastTriggered).toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExecuteAutomation(automation.automationId)}
                            className="px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingAutomation(automation);
                              setShowAutomationBuilder(true);
                            }}
                            className="px-3 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Trigger</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {automation.trigger.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Conditions</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {automation.conditions?.length || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 mb-1">Actions</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {automation.actions.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {automations.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No automations yet</p>
                    <button
                      onClick={() => setShowAutomationBuilder(true)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Create Your First Automation
                    </button>
                  </div>
                )}
              </>
            )}

            {showAutomationBuilder && (
              <AutomationBuilder
                automation={editingAutomation}
                onSave={automation => {
                  setShowAutomationBuilder(false);
                  setEditingAutomation(undefined);
                  loadData();
                }}
                onCancel={() => {
                  setShowAutomationBuilder(false);
                  setEditingAutomation(undefined);
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Energy Monitoring
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Energy usage tracking coming soon
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartHomePage;
