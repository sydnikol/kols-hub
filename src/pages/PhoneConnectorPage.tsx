import React, { useState, useEffect } from 'react';
import {
  Smartphone, Link, Wifi, WifiOff, Check, X, RefreshCw, Settings,
  Heart, Calendar, MessageSquare, Music, Home, DollarSign, MapPin,
  Lightbulb, Zap, Play, Plus, ChevronRight, Brain, Shield, Bell,
  Layers, Activity, Clock, Share2, Database, Cloud, Download
} from 'lucide-react';
import { aiPhoneConnector, AppConnection, IntegrationWorkflow, AIRecommendation, AppCategory } from '../services/ai-phone-connector';
import { crossDeviceSync, SyncStatus } from '../services/cross-device-sync';
import { phoneIntegration } from '../services/phone-integration-service';

const CATEGORY_ICONS: Record<AppCategory, React.ReactNode> = {
  'communication': <MessageSquare className="w-5 h-5" />,
  'productivity': <Calendar className="w-5 h-5" />,
  'health': <Heart className="w-5 h-5" />,
  'finance': <DollarSign className="w-5 h-5" />,
  'entertainment': <Music className="w-5 h-5" />,
  'social': <Share2 className="w-5 h-5" />,
  'utilities': <Settings className="w-5 h-5" />,
  'travel': <MapPin className="w-5 h-5" />,
  'food': <Activity className="w-5 h-5" />,
  'shopping': <DollarSign className="w-5 h-5" />,
  'education': <Lightbulb className="w-5 h-5" />,
  'smart-home': <Home className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<AppCategory, string> = {
  'communication': 'from-blue-500 to-blue-600',
  'productivity': 'from-purple-500 to-purple-600',
  'health': 'from-red-500 to-pink-500',
  'finance': 'from-green-500 to-emerald-500',
  'entertainment': 'from-yellow-500 to-orange-500',
  'social': 'from-pink-500 to-rose-500',
  'utilities': 'from-gray-500 to-gray-600',
  'travel': 'from-cyan-500 to-teal-500',
  'food': 'from-orange-500 to-red-500',
  'shopping': 'from-indigo-500 to-purple-500',
  'education': 'from-amber-500 to-yellow-500',
  'smart-home': 'from-teal-500 to-cyan-500',
};

const PhoneConnectorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apps' | 'workflows' | 'sync' | 'ai'>('apps');
  const [apps, setApps] = useState<AppConnection[]>([]);
  const [workflows, setWorkflows] = useState<IntegrationWorkflow[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allApps = aiPhoneConnector.getAvailableApps();
    const allWorkflows = aiPhoneConnector.getWorkflows();
    const recs = aiPhoneConnector.getRecommendations();
    const status = await crossDeviceSync.getStatus();
    const device = await phoneIntegration.getDeviceInfo();

    setApps(allApps);
    setWorkflows(allWorkflows);
    setRecommendations(recs);
    setSyncStatus(status);
    setDeviceInfo(device);
  };

  const handleConnectApp = async (appId: string) => {
    setIsConnecting(appId);
    try {
      await aiPhoneConnector.connectApp(appId);
      await loadData();
    } catch (error) {
      console.error('Connection failed:', error);
    }
    setIsConnecting(null);
  };

  const handleDisconnectApp = async (appId: string) => {
    await aiPhoneConnector.disconnectApp(appId);
    await loadData();
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await crossDeviceSync.syncToCloud();
      await crossDeviceSync.pullFromCloud();
      await aiPhoneConnector.syncAllApps();
      await loadData();
    } catch (error) {
      console.error('Sync failed:', error);
    }
    setIsSyncing(false);
  };

  const handleRunWorkflow = async (id: string) => {
    await aiPhoneConnector.runWorkflow(id);
    await loadData();
  };

  const handleAcceptRecommendation = async (rec: AIRecommendation) => {
    if (rec.action) {
      await rec.action();
      await loadData();
    }
  };

  const handleDismissRecommendation = (id: string) => {
    aiPhoneConnector.dismissRecommendation(id);
    setRecommendations(aiPhoneConnector.getRecommendations());
  };

  const filteredApps = selectedCategory === 'all'
    ? apps
    : apps.filter(app => app.category === selectedCategory);

  const connectedCount = apps.filter(a => a.connected).length;

  const categories: AppCategory[] = [
    'health', 'productivity', 'communication', 'finance',
    'entertainment', 'social', 'smart-home', 'travel', 'food', 'education'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-purple-400" />
              AI Phone Connector
            </h1>
            <p className="text-gray-400 mt-2">
              Connect and integrate your phone apps with Kol's Hub
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <span className="text-purple-300">{connectedCount}</span>
              <span className="text-gray-400 ml-1">apps connected</span>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync All
            </button>
          </div>
        </div>

        {/* Device Info Banner */}
        {deviceInfo && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600/30 rounded-lg">
                <Smartphone className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">{deviceInfo.model || 'Your Device'}</h3>
                <p className="text-sm text-gray-400">
                  {deviceInfo.platform} {deviceInfo.osVersion} •
                  {deviceInfo.batteryLevel && ` ${Math.round(deviceInfo.batteryLevel * 100)}% battery`}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {navigator.onLine ? (
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <Wifi className="w-4 h-4" /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    <WifiOff className="w-4 h-4" /> Offline
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-[#12121A] p-1 rounded-lg w-fit">
          {[
            { id: 'apps', label: 'Apps', icon: Layers },
            { id: 'workflows', label: 'Workflows', icon: Zap },
            { id: 'sync', label: 'Sync', icon: Cloud },
            { id: 'ai', label: 'AI Insights', icon: Brain },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Apps Tab */}
        {activeTab === 'apps' && (
          <div>
            {/* Category Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All Apps
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {CATEGORY_ICONS[cat]}
                  {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>

            {/* Quick Setup */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Health Tracking', action: () => aiPhoneConnector.quickSetupHealthTracking(), icon: Heart, color: 'red' },
                { label: 'Productivity', action: () => aiPhoneConnector.quickSetupProductivity(), icon: Calendar, color: 'purple' },
                { label: 'Entertainment', action: () => aiPhoneConnector.quickSetupEntertainment(), icon: Music, color: 'yellow' },
              ].map(setup => (
                <button
                  key={setup.label}
                  onClick={async () => { await setup.action(); await loadData(); }}
                  className={`p-4 bg-gradient-to-r ${
                    setup.color === 'red' ? 'from-red-900/30 to-pink-900/30 border-red-500/30' :
                    setup.color === 'purple' ? 'from-purple-900/30 to-indigo-900/30 border-purple-500/30' :
                    'from-yellow-900/30 to-orange-900/30 border-yellow-500/30'
                  } border rounded-xl hover:bg-opacity-50 transition-all text-left`}
                >
                  <div className="flex items-center gap-3">
                    <setup.icon className={`w-6 h-6 ${
                      setup.color === 'red' ? 'text-red-400' :
                      setup.color === 'purple' ? 'text-purple-400' :
                      'text-yellow-400'
                    }`} />
                    <div>
                      <h3 className="font-semibold">Quick Setup: {setup.label}</h3>
                      <p className="text-sm text-gray-400">One-click connection</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApps.map(app => (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl border transition-all ${
                    app.connected
                      ? 'bg-green-900/20 border-green-500/30'
                      : 'bg-[#12121A] border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${CATEGORY_COLORS[app.category]}`}>
                        {CATEGORY_ICONS[app.category]}
                      </div>
                      <div>
                        <h3 className="font-semibold">{app.appName}</h3>
                        <p className="text-xs text-gray-400">{app.category}</p>
                      </div>
                    </div>
                    {app.connected && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Syncs: {app.dataTypes.join(', ')}</p>
                    {app.lastSync && (
                      <p className="text-xs text-gray-500">
                        Last sync: {new Date(app.lastSync).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {app.connected ? (
                      <>
                        <button
                          onClick={() => aiPhoneConnector.syncAppData(app.id)}
                          className="flex-1 px-3 py-2 bg-purple-600/30 text-purple-300 rounded-lg text-sm hover:bg-purple-600/40 transition-colors flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Sync
                        </button>
                        <button
                          onClick={() => handleDisconnectApp(app.id)}
                          className="px-3 py-2 bg-red-600/30 text-red-300 rounded-lg text-sm hover:bg-red-600/40 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnectApp(app.id)}
                        disabled={isConnecting === app.id}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {isConnecting === app.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Connecting...
                          </>
                        ) : (
                          <>
                            <Link className="w-3 h-3" /> Connect
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Automation Workflows</h2>
              <button className="px-4 py-2 bg-purple-600 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4" /> Create Workflow
              </button>
            </div>

            {workflows.length === 0 ? (
              <div className="text-center py-12 bg-[#12121A] rounded-xl">
                <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Workflows Yet</h3>
                <p className="text-gray-500 mb-4">Create automated workflows to connect your apps</p>
                <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  Create Your First Workflow
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map(workflow => (
                  <div
                    key={workflow.id}
                    className="p-4 bg-[#12121A] rounded-xl border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${workflow.enabled ? 'bg-green-600/30' : 'bg-gray-600/30'}`}>
                          <Zap className={`w-5 h-5 ${workflow.enabled ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{workflow.name}</h3>
                          <p className="text-sm text-gray-400">{workflow.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Ran {workflow.runCount} times
                        </span>
                        <button
                          onClick={() => handleRunWorkflow(workflow.id)}
                          className="px-3 py-1.5 bg-purple-600/30 text-purple-300 rounded-lg text-sm hover:bg-purple-600/40 transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Run
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Trigger: {workflow.trigger.type}
                      <span className="mx-2">•</span>
                      {workflow.actions.length} actions
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sync Tab */}
        {activeTab === 'sync' && syncStatus && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Last Sync', value: syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never', icon: Clock },
                { label: 'Pending Changes', value: String(syncStatus.pendingChanges), icon: Database },
                { label: 'Connected Devices', value: String(syncStatus.connectedDevices), icon: Smartphone },
                { label: 'Cloud Status', value: syncStatus.cloudConnected ? 'Connected' : 'Offline', icon: Cloud },
              ].map(stat => (
                <div key={stat.label} className="p-4 bg-[#12121A] rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-400">{stat.label}</span>
                  </div>
                  <p className="text-xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sync Controls */}
              <div className="p-6 bg-[#12121A] rounded-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">Sync Controls</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                    className="w-full px-4 py-3 bg-purple-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button
                    onClick={() => crossDeviceSync.pullFromCloud()}
                    className="w-full px-4 py-3 bg-blue-600/30 text-blue-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600/40 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Pull from Cloud
                  </button>
                </div>
              </div>

              {/* Export/Import */}
              <div className="p-6 bg-[#12121A] rounded-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-4">Backup & Restore</h3>
                <div className="space-y-4">
                  <button
                    onClick={async () => {
                      const data = await crossDeviceSync.exportAllData();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `kolshub-backup-${Date.now()}.json`;
                      a.click();
                    }}
                    className="w-full px-4 py-3 bg-green-600/30 text-green-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600/40 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export All Data
                  </button>
                  <label className="w-full px-4 py-3 bg-orange-600/30 text-orange-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-orange-600/40 transition-colors cursor-pointer">
                    <Database className="w-5 h-5" />
                    Import Backup
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const text = await file.text();
                          await crossDeviceSync.importData(text);
                          await loadData();
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                AI Recommendations
              </h2>
              <button
                onClick={async () => {
                  await aiPhoneConnector.generateRecommendations();
                  setRecommendations(aiPhoneConnector.getRecommendations());
                }}
                className="px-4 py-2 bg-purple-600/30 text-purple-300 rounded-lg flex items-center gap-2 hover:bg-purple-600/40 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-12 bg-[#12121A] rounded-xl">
                <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">All Caught Up!</h3>
                <p className="text-gray-500">No new recommendations at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-xl border ${
                      rec.priority === 'high'
                        ? 'bg-red-900/20 border-red-500/30'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-900/20 border-yellow-500/30'
                        : 'bg-gray-800/50 border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          rec.type === 'connection' ? 'bg-blue-600/30' :
                          rec.type === 'workflow' ? 'bg-purple-600/30' :
                          rec.type === 'optimization' ? 'bg-green-600/30' :
                          'bg-yellow-600/30'
                        }`}>
                          {rec.type === 'connection' ? <Link className="w-5 h-5 text-blue-400" /> :
                           rec.type === 'workflow' ? <Zap className="w-5 h-5 text-purple-400" /> :
                           rec.type === 'optimization' ? <Activity className="w-5 h-5 text-green-400" /> :
                           <Lightbulb className="w-5 h-5 text-yellow-400" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{rec.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              rec.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                              rec.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                              'bg-gray-500/30 text-gray-300'
                            }`}>
                              {rec.priority} priority
                            </span>
                            <span className="text-xs text-gray-500">{rec.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {rec.action && (
                          <button
                            onClick={() => handleAcceptRecommendation(rec)}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Apply
                          </button>
                        )}
                        <button
                          onClick={() => handleDismissRecommendation(rec.id)}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneConnectorPage;
