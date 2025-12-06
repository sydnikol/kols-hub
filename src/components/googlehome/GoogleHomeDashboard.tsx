import React, { useState, useEffect } from 'react';
import { GoogleHome, SmartHomeDevice } from '../../plugins/googlehome';
import {
  Home,
  Mic,
  Speaker,
  Lightbulb,
  Power,
  Wifi,
  Cast,
  Settings,
  Plus,
  Play,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export const GoogleHomeDashboard: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [devices, setDevices] = useState<SmartHomeDevice[]>([]);
  const [castDevices, setCastDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [voiceCommand, setVoiceCommand] = useState('');

  useEffect(() => {
    initializeGoogleHome();
    loadDevices();
  }, []);

  const initializeGoogleHome = async () => {
    try {
      const result = await GoogleHome.initialize();
      setInitialized(result.success);

      if (result.assistantAvailable) {
        // Register common voice commands
        await GoogleHome.registerVoiceCommands([
          'turn on lights',
          'turn off lights',
          'start music',
          'stop music',
          'good morning',
          'good night',
          'show dashboard',
          'check health',
          'start passive income',
        ]);
        toast.success('Google Assistant ready!');
      }
    } catch (error) {
      console.error('Failed to initialize Google Home:', error);
      toast.error('Google Home initialization failed');
    }
  };

  const loadDevices = async () => {
    try {
      setLoading(true);
      const result = await GoogleHome.getSmartDevices();
      setDevices(result.devices);

      // Mock cast devices (in production, detect actual Nest Hubs)
      setCastDevices([
        { id: 'hub-1', name: 'Living Room Nest Hub', type: 'hub', online: true },
        { id: 'hub-2', name: 'Bedroom Nest Hub', type: 'hub', online: true },
      ]);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceControl = async (deviceId: string, action: string, value?: any) => {
    try {
      const result = await GoogleHome.controlDevice({ deviceId, action, value });

      if (result.success) {
        toast.success(result.message);
        loadDevices(); // Refresh devices
      }
    } catch (error) {
      toast.error('Failed to control device');
    }
  };

  const handleVoiceCommand = async () => {
    if (!voiceCommand.trim()) return;

    try {
      const result = await GoogleHome.executeVoiceCommand({
        command: voiceCommand,
        parameters: {}
      });

      if (result.success) {
        toast.success(result.message);
        setVoiceCommand('');
      }
    } catch (error) {
      toast.error('Voice command failed');
    }
  };

  const handleBroadcast = async (message: string) => {
    try {
      await GoogleHome.broadcast({ message });
      toast.success(`Broadcasting: "${message}"`);
    } catch (error) {
      toast.error('Broadcast failed');
    }
  };

  const handleCastToHub = async (deviceId: string) => {
    try {
      const result = await GoogleHome.castToHub({
        deviceId,
        content: {
          type: 'dashboard',
          data: {
            title: 'KOL Personal OS',
            widgets: ['health', 'income', 'music']
          }
        }
      });

      if (result.success) {
        toast.success('Casting to Nest Hub!');
      } else {
        toast.error('Failed to cast - ensure device is connected');
      }
    } catch (error) {
      toast.error('Cast failed');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light':
        return <Lightbulb className="w-6 h-6" />;
      case 'speaker':
        return <Speaker className="w-6 h-6" />;
      case 'switch':
        return <Power className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Google Home Control</h2>
          <p className="text-purple-400 text-sm">Manage your smart home and Google devices</p>
        </div>
        <button
          onClick={loadDevices}
          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-purple-400" />
        </button>
      </div>

      {/* Status */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-4 rounded-xl border border-purple-500/30">
        <div className="flex items-center gap-3">
          <Wifi className={`w-5 h-5 ${initialized ? 'text-green-400' : 'text-red-400'}`} />
          <div>
            <div className="font-bold text-white">
              {initialized ? '✓ Google Home Connected' : '✗ Not Connected'}
            </div>
            <div className="text-sm text-purple-400">
              {devices.length} devices • {castDevices.filter(d => d.online).length} hubs online
            </div>
          </div>
        </div>
      </div>

      {/* Voice Command Input */}
      <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Voice Commands
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={voiceCommand}
            onChange={(e) => setVoiceCommand(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVoiceCommand()}
            placeholder="Say a command... (e.g., 'turn on lights')"
            className="flex-1 px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={handleVoiceCommand}
            className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Execute
          </button>
        </div>

        {/* Quick Commands */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['turn on lights', 'turn off lights', 'good morning', 'good night'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => setVoiceCommand(cmd)}
              className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm rounded-lg border border-purple-500/20 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Home Devices */}
      <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-purple-300 mb-4">
          Smart Home Devices ({devices.length})
        </h3>

        {loading ? (
          <div className="text-center text-purple-400 py-8">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="text-center text-purple-400 py-8">No devices found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-black/30 p-4 rounded-lg border border-purple-500/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${device.state.on ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{device.name}</div>
                      <div className="text-xs text-purple-400">{device.type}</div>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${device.state.on ? 'bg-green-400' : 'bg-gray-400'}`} />
                </div>

                {/* Device Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeviceControl(device.id, 'turn_on')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      device.state.on
                        ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/20 hover:bg-green-500/20'
                    }`}
                  >
                    ON
                  </button>
                  <button
                    onClick={() => handleDeviceControl(device.id, 'turn_off')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      !device.state.on
                        ? 'bg-red-500/30 text-red-300 border border-red-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/20 hover:bg-red-500/20'
                    }`}
                  >
                    OFF
                  </button>
                </div>

                {/* Brightness slider for lights */}
                {device.type === 'light' && device.state.brightness !== undefined && (
                  <div className="mt-3">
                    <label className="text-xs text-purple-400 mb-1 block">
                      Brightness: {device.state.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={device.state.brightness}
                      onChange={(e) => handleDeviceControl(device.id, 'set_brightness', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Hub / Nest Hub Devices */}
      <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30">
        <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
          <Cast className="w-5 h-5" />
          Google Nest Hub Displays
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {castDevices.map((hub) => (
            <div
              key={hub.id}
              className="bg-black/30 p-4 rounded-lg border border-indigo-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-white">{hub.name}</div>
                  <div className="text-sm text-indigo-400">
                    {hub.online ? '🟢 Online' : '⚫ Offline'}
                  </div>
                </div>
                <Cast className="w-6 h-6 text-indigo-400" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCastToHub(hub.id)}
                  className="flex-1 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-colors text-sm font-bold"
                  disabled={!hub.online}
                >
                  Cast Dashboard
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/20 transition-colors text-sm"
                  title="Configure hub settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Messages */}
      <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
        <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
          <Speaker className="w-5 h-5" />
          Broadcast to All Devices
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {[
            'Dinner is ready!',
            'Time to wake up!',
            'Bedtime in 10 minutes',
            'Don\'t forget to check your health!'
          ].map((msg) => (
            <button
              key={msg}
              onClick={() => handleBroadcast(msg)}
              className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors text-sm"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
