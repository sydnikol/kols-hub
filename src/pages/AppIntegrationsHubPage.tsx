import React, { useState, useEffect } from 'react';
import { Plug, Power, PowerOff, RefreshCw, Check, X, BarChart3, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { appPluginSystem, AppPlugin } from '../services/app-integration-plugins';

const AppIntegrationsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'productivity' | 'finance' | 'health' | 'entertainment' | 'communication' | 'transportation' | 'food'>('all');
  const [plugins, setPlugins] = useState<AppPlugin[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    loadPlugins();
    loadStats();

    // Start the plugin system
    appPluginSystem.start();
  }, []);

  const loadPlugins = () => {
    const allPlugins = appPluginSystem.getAllPlugins();
    setPlugins(allPlugins);
  };

  const loadStats = () => {
    const syncStats = appPluginSystem.getSyncStats();
    setStats(syncStats);
  };

  const handleConnect = (pluginId: string) => {
    const success = appPluginSystem.connectPlugin(pluginId);
    if (success) {
      toast.success('Plugin connected!');
      loadPlugins();
      loadStats();
    } else {
      toast.error('Failed to connect plugin');
    }
  };

  const handleDisconnect = (pluginId: string) => {
    const success = appPluginSystem.disconnectPlugin(pluginId);
    if (success) {
      toast.success('Plugin disconnected');
      loadPlugins();
      loadStats();
    }
  };

  const handleToggleAutoSync = (pluginId: string) => {
    const enabled = appPluginSystem.toggleAutoSync(pluginId);
    toast.success(`Auto-sync ${enabled ? 'enabled' : 'disabled'}`);
    loadPlugins();
  };

  const handleManualSync = async (pluginId: string) => {
    setSyncing(pluginId);
    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Sync completed successfully!');
      loadPlugins();
      loadStats();
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setSyncing(null);
    }
  };

  const filteredPlugins = activeTab === 'all'
    ? plugins
    : plugins.filter(p => p.category === activeTab);

  const tabs = [
    { id: 'all' as const, label: 'All Apps', count: plugins.length },
    { id: 'productivity' as const, label: 'Productivity', count: plugins.filter(p => p.category === 'productivity').length },
    { id: 'finance' as const, label: 'Finance', count: plugins.filter(p => p.category === 'finance').length },
    { id: 'health' as const, label: 'Health', count: plugins.filter(p => p.category === 'health').length },
    { id: 'entertainment' as const, label: 'Entertainment', count: plugins.filter(p => p.category === 'entertainment').length },
    { id: 'communication' as const, label: 'Communication', count: plugins.filter(p => p.category === 'communication').length },
    { id: 'transportation' as const, label: 'Transportation', count: plugins.filter(p => p.category === 'transportation').length },
    { id: 'food' as const, label: 'Food & Delivery', count: plugins.filter(p => p.category === 'food').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
              <Plug className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">App Integrations</h1>
              <p className="text-purple-200">Connect with your favorite apps for seamless automation</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Plug className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-200 text-sm">Total Apps</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalPlugins}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Power className="w-4 h-4 text-green-400" />
                  <span className="text-purple-200 text-sm">Connected</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.connectedPlugins}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-purple-200 text-sm">Auto-Sync</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.autoSyncEnabled}</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  <span className="text-purple-200 text-sm">Total Syncs</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalSyncs}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlugins.map(plugin => (
            <div
              key={plugin.id}
              className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 transition-all ${
                plugin.connected
                  ? 'border-green-500/50 shadow-lg shadow-green-500/20'
                  : 'border-white/20'
              }`}
            >
              {/* Plugin Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{plugin.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plugin.name}</h3>
                    <span className={`text-sm ${
                      plugin.connected ? 'text-green-400' : 'text-purple-300'
                    }`}>
                      {plugin.connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${
                  plugin.connected ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  {plugin.connected ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <X className="w-5 h-5 text-purple-400" />
                  )}
                </div>
              </div>

              {/* Plugin Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300">Category</span>
                  <span className="text-white capitalize">{plugin.category}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300">Sync Frequency</span>
                  <span className="text-white capitalize">{plugin.syncFrequency}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300">Syncs</span>
                  <span className="text-white">{plugin.syncCount}</span>
                </div>

                {plugin.lastSync && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300">
                      Last: {new Date(plugin.lastSync).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Data Mappings */}
              <div className="mb-4">
                <div className="text-sm text-purple-300 mb-2">Syncs to:</div>
                <div className="flex flex-wrap gap-2">
                  {plugin.dataMapping.map((mapping, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-500/20 rounded-lg text-xs text-purple-200"
                    >
                      {mapping.targetFeature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!plugin.connected ? (
                  <button
                    onClick={() => handleConnect(plugin.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Power className="w-4 h-4 inline mr-2" />
                    Connect
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleDisconnect(plugin.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all"
                    >
                      <PowerOff className="w-4 h-4 inline mr-2" />
                      Disconnect
                    </button>

                    <button
                      onClick={() => handleManualSync(plugin.id)}
                      disabled={syncing === plugin.id}
                      className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-xl hover:bg-purple-500/30 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncing === plugin.id ? 'animate-spin' : ''}`} />
                    </button>
                  </>
                )}
              </div>

              {/* Auto-sync Toggle */}
              {plugin.connected && (
                <div className="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-sm text-purple-200">Auto-Sync</span>
                  <button
                    onClick={() => handleToggleAutoSync(plugin.id)}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      plugin.autoSync ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        plugin.autoSync ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPlugins.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔌</div>
            <div className="text-xl text-purple-200">No apps in this category</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppIntegrationsHubPage;
