import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Puzzle, Download, Trash2, Settings, Power, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'health' | 'productivity' | 'social' | 'creative' | 'utility';
  enabled: boolean;
  installed: boolean;
  icon?: string;
  permissions: string[];
  size: string;
  rating: number;
  downloads: number;
}

export const PluginSystem: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [installedPlugins, setInstalledPlugins] = useState<Plugin[]>([]);
  const [availablePlugins, setAvailablePlugins] = useState<Plugin[]>([]);
  const [activeTab, setActiveTab] = useState<'installed' | 'available'>('installed');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = () => {
    // Sample plugins
    const samplePlugins: Plugin[] = [
      {
        id: 'plugin_apple_health',
        name: 'Apple Health Sync',
        description: 'Automatically import health data from Apple Health app',
        version: '1.0.0',
        author: 'KOL Team',
        category: 'health',
        enabled: true,
        installed: true,
        permissions: ['health_data', 'background_sync'],
        size: '2.5 MB',
        rating: 4.8,
        downloads: 1250
      },
      {
        id: 'plugin_fitbit',
        name: 'Fitbit Integration',
        description: 'Connect your Fitbit device for activity and sleep tracking',
        version: '1.2.0',
        author: 'KOL Team',
        category: 'health',
        enabled: false,
        installed: true,
        permissions: ['health_data', 'background_sync', 'notifications'],
        size: '3.1 MB',
        rating: 4.6,
        downloads: 980
      },
      {
        id: 'plugin_google_calendar',
        name: 'Google Calendar',
        description: 'Sync your appointments and reminders with Google Calendar',
        version: '2.0.0',
        author: 'Community',
        category: 'productivity',
        enabled: false,
        installed: false,
        permissions: ['calendar', 'internet'],
        size: '1.8 MB',
        rating: 4.9,
        downloads: 2100
      },
      {
        id: 'plugin_trello',
        name: 'Trello Boards',
        description: 'Manage your tasks and projects with Trello integration',
        version: '1.5.0',
        author: 'Community',
        category: 'productivity',
        enabled: false,
        installed: false,
        permissions: ['internet', 'storage'],
        size: '2.2 MB',
        rating: 4.7,
        downloads: 1560
      },
      {
        id: 'plugin_spotify_enhanced',
        name: 'Spotify Enhanced',
        description: 'Advanced Spotify features including playlist analysis and mood detection',
        version: '1.0.0',
        author: 'Community',
        category: 'creative',
        enabled: false,
        installed: false,
        permissions: ['spotify_api', 'storage'],
        size: '1.5 MB',
        rating: 4.5,
        downloads: 890
      },
      {
        id: 'plugin_tarot',
        name: 'Digital Tarot Deck',
        description: 'Daily tarot readings with customizable decks',
        version: '1.1.0',
        author: 'Community',
        category: 'creative',
        enabled: false,
        installed: false,
        permissions: ['storage'],
        size: '5.2 MB',
        rating: 4.9,
        downloads: 1340
      }
    ];

    setPlugins(samplePlugins);
    setInstalledPlugins(samplePlugins.filter(p => p.installed));
    setAvailablePlugins(samplePlugins.filter(p => !p.installed));

    // Load from localStorage
    const stored = localStorage.getItem('kol_plugins');
    if (stored) {
      const storedPlugins = JSON.parse(stored);
      setInstalledPlugins(storedPlugins.filter((p: Plugin) => p.installed));
    }
  };

  const savePlugins = () => {
    localStorage.setItem('kol_plugins', JSON.stringify(plugins));
  };

  const installPlugin = (plugin: Plugin) => {
    const updated = plugins.map(p =>
      p.id === plugin.id ? { ...p, installed: true } : p
    );
    setPlugins(updated);
    setInstalledPlugins(updated.filter(p => p.installed));
    setAvailablePlugins(updated.filter(p => !p.installed));
    savePlugins();
    toast.success(`${plugin.name} installed!`);
  };

  const uninstallPlugin = (pluginId: string) => {
    if (confirm('Are you sure you want to uninstall this plugin?')) {
      const updated = plugins.map(p =>
        p.id === pluginId ? { ...p, installed: false, enabled: false } : p
      );
      setPlugins(updated);
      setInstalledPlugins(updated.filter(p => p.installed));
      setAvailablePlugins(updated.filter(p => !p.installed));
      savePlugins();
      toast.success('Plugin uninstalled');
    }
  };

  const togglePlugin = (pluginId: string) => {
    const updated = plugins.map(p =>
      p.id === pluginId ? { ...p, enabled: !p.enabled } : p
    );
    setPlugins(updated);
    setInstalledPlugins(updated.filter(p => p.installed));
    savePlugins();

    const plugin = updated.find(p => p.id === pluginId);
    if (plugin) {
      toast.success(`${plugin.name} ${plugin.enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-red-500';
      case 'productivity': return 'bg-blue-500';
      case 'social': return 'bg-green-500';
      case 'creative': return 'bg-purple-500';
      case 'utility': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Puzzle className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Plugin System</h1>
              <p className="text-gray-400 mt-1">Extend KOL with community-built features</p>
            </div>
          </div>
          <button
            onClick={loadPlugins}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Installed</p>
            <p className="text-2xl font-bold text-white">{installedPlugins.length}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Enabled</p>
            <p className="text-2xl font-bold text-green-400">
              {installedPlugins.filter(p => p.enabled).length}
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Available</p>
            <p className="text-2xl font-bold text-purple-400">{availablePlugins.length}</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Downloads</p>
            <p className="text-2xl font-bold text-blue-400">
              {plugins.reduce((acc, p) => acc + p.downloads, 0)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {(['installed', 'available'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'installed' ? installedPlugins.length : availablePlugins.length})
            </button>
          ))}
        </div>

        {/* Plugin List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'installed' ? installedPlugins : availablePlugins).map(plugin => (
            <motion.div
              key={plugin.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-600 flex items-center justify-center">
                  <Puzzle className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 ${getCategoryColor(plugin.category)} text-white text-xs rounded`}>
                    {plugin.category}
                  </span>
                  {plugin.installed && plugin.enabled && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{plugin.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{plugin.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white">{plugin.version}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Author</span>
                  <span className="text-white">{plugin.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white">{plugin.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-indigo-400">★ {plugin.rating}</span>
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {plugin.permissions.map(perm => (
                    <span key={perm} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {plugin.installed ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePlugin(plugin.id)}
                    className={`flex-1 px-4 py-2 rounded flex items-center justify-center gap-2 ${
                      plugin.enabled
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {plugin.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => uninstallPlugin(plugin.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedPlugin(plugin)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => installPlugin(plugin)}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Plugin Settings Modal */}
        {selectedPlugin && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-purple-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedPlugin.name} Settings</h3>
                <button
                  onClick={() => setSelectedPlugin(null)}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-indigo-200 text-sm">
                        Configure plugin behavior, enable/disable features, and manage permissions for advanced customization.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Required Permissions:</h4>
                  <ul className="space-y-2">
                    {selectedPlugin.permissions.map(perm => (
                      <li key={perm} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-400" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedPlugin(null)}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Developer Info */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-200 mb-3">Plugin Development</h3>
          <p className="text-blue-100 text-sm mb-4">
            Want to create your own plugins? Check out the KOL Plugin SDK and start building extensions for the community!
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              View Documentation
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              Example Plugins
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
