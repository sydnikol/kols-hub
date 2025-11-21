import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud, HardDrive, RefreshCw, Download, Upload, Shield,
  CheckCircle, AlertCircle, Clock, Zap, Database, Link2,
  Settings, Play, Pause, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import SyncManager from '../services/sync/SyncManager';
import IntegrationHub, { type Integration } from '../services/integrations/IntegrationHub';

export default function SyncBackupPage() {
  const [syncManager] = useState(() => SyncManager.getInstance());
  const [integrationHub] = useState(() => IntegrationHub.getInstance());

  const [syncStatus, setSyncStatus] = useState(syncManager.getStatus());
  const [syncConfig, setSyncConfig] = useState(syncManager.getConfig());
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [backups, setBackups] = useState(syncManager.listBackups());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setSyncStatus(syncManager.getStatus());
    setSyncConfig(syncManager.getConfig());
    setIntegrations(integrationHub.getAllIntegrations());
    setBackups(syncManager.listBackups());
  };

  const handleSyncNow = async () => {
    toast.loading('Syncing...', { id: 'sync' });
    await syncManager.syncAll();
    toast.success('Sync complete!', { id: 'sync' });
    loadData();
  };

  const handleCreateBackup = async () => {
    toast.loading('Creating backup...', { id: 'backup' });
    const backupId = await syncManager.createBackup();
    toast.success(`Backup created: ${backupId}`, { id: 'backup' });
    loadData();
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('Restore from this backup? Current data will be replaced.')) return;

    toast.loading('Restoring...', { id: 'restore' });
    await syncManager.restoreFromBackup(backupId);
    toast.success('Restore complete!', { id: 'restore' });
    loadData();
  };

  const toggleAutoSync = () => {
    syncManager.updateConfig({ autoSync: !syncConfig.autoSync });
    loadData();
    toast.success(syncConfig.autoSync ? 'Auto-sync disabled' : 'Auto-sync enabled');
  };

  const filteredIntegrations = selectedCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === selectedCategory);

  const stats = integrationHub.getStats();
  const categories = ['all', 'storage', 'productivity', 'health', 'finance', 'social', 'dev', 'automation'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 pl-20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Sync & Backup
              </h1>
              <p className="text-indigo-300 text-lg">
                {stats.connected}/{stats.total} integrations connected • {backups.length} backups
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sync Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-700/30 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Sync Status</h2>
              <div className="flex items-center gap-2">
                {syncStatus.isSyncing ? (
                  <>
                    <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                    <span className="text-cyan-400">Syncing in progress...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400">All synced</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleAutoSync}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
                  syncConfig.autoSync
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {syncConfig.autoSync ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                Auto-Sync {syncConfig.autoSync ? 'ON' : 'OFF'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSyncNow}
                disabled={syncStatus.isSyncing}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                Sync Now
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <Clock className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-sm text-gray-400">Last Sync</div>
              <div className="text-white font-semibold">
                {syncStatus.lastSyncTime
                  ? new Date(syncStatus.lastSyncTime).toLocaleTimeString()
                  : 'Never'}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <Database className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-sm text-gray-400">Items Synced</div>
              <div className="text-white font-semibold">{syncStatus.itemsSynced}</div>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <Zap className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-sm text-gray-400">Sync Interval</div>
              <div className="text-white font-semibold">{syncConfig.syncInterval}min</div>
            </div>

            <div className="bg-black/30 rounded-lg p-4">
              <Shield className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-sm text-gray-400">Encryption</div>
              <div className="text-white font-semibold">
                {syncConfig.encryptionEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>

          {/* Provider Status */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {Object.entries(syncStatus.providers).map(([provider, status]) => (
              <div
                key={provider}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  status.status === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : status.status === 'syncing'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {status.status === 'connected' && <CheckCircle className="w-3 h-3" />}
                {status.status === 'syncing' && <RefreshCw className="w-3 h-3 animate-spin" />}
                {status.status === 'error' && <AlertCircle className="w-3 h-3" />}
                <span className="capitalize">{provider.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Backups Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-700/30 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-purple-400" />
              Backups ({backups.length})
            </h2>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateBackup}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Create Backup
            </motion.button>
          </div>

          <div className="space-y-2">
            {backups.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <HardDrive className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No backups yet. Create your first backup!</p>
              </div>
            ) : (
              backups.slice().reverse().map((backup) => (
                <div
                  key={backup.id}
                  className="bg-black/30 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-semibold">{backup.id}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(backup.timestamp).toLocaleString()} • {backup.itemCount} items •{' '}
                      {(backup.size / 1024).toFixed(2)} KB
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRestoreBackup(backup.id)}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Restore
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (confirm('Delete this backup?')) {
                          syncManager.deleteBackup(backup.id);
                          loadData();
                          toast.success('Backup deleted');
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Integrations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-700/30"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Link2 className="w-6 h-6 text-blue-400" />
            Integrations ({stats.connected}/{stats.total})
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-black/30 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <div className="text-white font-semibold">{integration.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{integration.category}</div>
                    </div>
                  </div>

                  {integration.connected && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-1">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {integration.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        +{integration.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    if (integration.connected) {
                      await integrationHub.disconnect(integration.id);
                      toast.success(`Disconnected from ${integration.name}`);
                    } else {
                      await integrationHub.connect(integration.id);
                      toast.success(`Connected to ${integration.name}`);
                    }
                    loadData();
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                    integration.connected
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                  }`}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </motion.button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
