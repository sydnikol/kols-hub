import React, { useState } from 'react';
import { Server, Zap, CheckCircle, XCircle, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { useMCPServers, MCPServer } from '../services/mcp-server-integration';

/**
 * MCP SERVERS HUB
 * Manage and monitor Model Context Protocol server connections
 */

export default function MCPServersHub() {
  const {
    servers,
    status,
    connectServer,
    disconnectServer,
    sendRequest,
    registerServer,
    getServerCapabilities,
    isConnected
  } = useMCPServers();

  const [showAddServer, setShowAddServer] = useState(false);
  const [newServer, setNewServer] = useState({
    id: '',
    name: '',
    url: '',
    type: 'custom' as 'custom' | 'versa',
    capabilities: ''
  });
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({});

  const handleAddServer = () => {
    if (!newServer.id || !newServer.name || !newServer.url) return;

    registerServer({
      id: newServer.id,
      name: newServer.name,
      url: newServer.url,
      type: newServer.type,
      capabilities: newServer.capabilities.split(',').map(c => c.trim()).filter(c => c)
    });

    setNewServer({ id: '', name: '', url: '', type: 'custom', capabilities: '' });
    setShowAddServer(false);
  };

  const handleTestServer = async (serverId: string) => {
    setTestResults({ ...testResults, [serverId]: 'testing...' });

    const result = await sendRequest({
      server: serverId,
      method: 'ping',
      params: {}
    });

    setTestResults({
      ...testResults,
      [serverId]: result.success ? 'success' : 'failed'
    });
  };

  const handleQuickSetup = () => {
    // Quick setup for Versa Networks MCP Server
    registerServer({
      id: 'versa-networks',
      name: 'Versa Networks MCP Server',
      url: 'ws://localhost:3000',
      type: 'versa',
      capabilities: [
        'network-management',
        'security-analytics',
        'sd-wan',
        'routing',
        'firewall',
        'vpn'
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Server className="w-12 h-12 text-indigo-400" />
            <div>
              <h1 className="text-5xl font-bold">MCP Servers Hub</h1>
              <p className="text-xl text-gray-300">Model Context Protocol Integration</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleQuickSetup}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Quick Setup
            </button>
            <button
              onClick={() => setShowAddServer(true)}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Server
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="text-sm text-gray-300">Total Servers</div>
            <div className="text-3xl font-bold">{status.totalServers}</div>
          </div>
          <div className="bg-green-500/20 backdrop-blur rounded-xl p-4 border border-green-500/30">
            <div className="text-sm text-gray-300">Connected</div>
            <div className="text-3xl font-bold text-green-400">{status.connected}</div>
          </div>
          <div className="bg-yellow-500/20 backdrop-blur rounded-xl p-4 border border-yellow-500/30">
            <div className="text-sm text-gray-300">Disconnected</div>
            <div className="text-3xl font-bold text-yellow-400">{status.disconnected}</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur rounded-xl p-4 border border-red-500/30">
            <div className="text-sm text-gray-300">Error</div>
            <div className="text-3xl font-bold text-red-400">{status.error}</div>
          </div>
        </div>
      </div>

      {/* Add Server Modal */}
      {showAddServer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 border border-white/20 max-w-2xl w-full mx-4">
            <h2 className="text-3xl font-bold mb-6">Add MCP Server</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Server ID</label>
                <input
                  type="text"
                  value={newServer.id}
                  onChange={(e) => setNewServer({ ...newServer, id: e.target.value })}
                  placeholder="my-mcp-server"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Server Name</label>
                <input
                  type="text"
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                  placeholder="My MCP Server"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Server URL</label>
                <input
                  type="text"
                  value={newServer.url}
                  onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                  placeholder="ws://localhost:3000"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select
                  value={newServer.type}
                  onChange={(e) => setNewServer({ ...newServer, type: e.target.value as 'custom' | 'versa' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="custom">Custom</option>
                  <option value="versa">Versa Networks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Capabilities (comma-separated)</label>
                <input
                  type="text"
                  value={newServer.capabilities}
                  onChange={(e) => setNewServer({ ...newServer, capabilities: e.target.value })}
                  placeholder="content-generation, data-analysis, network-management"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddServer}
                className="flex-1 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition-all"
              >
                Add Server
              </button>
              <button
                onClick={() => setShowAddServer(false)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Servers List */}
      <div className="max-w-7xl mx-auto">
        {servers.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
            <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No MCP Servers</h3>
            <p className="text-gray-300 mb-6">Add your first MCP server to get started</p>
            <button
              onClick={handleQuickSetup}
              className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-semibold transition-all"
            >
              Quick Setup (Versa Networks)
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {servers.map(server => (
              <ServerCard
                key={server.id}
                server={server}
                onConnect={() => connectServer(server.id)}
                onDisconnect={() => disconnectServer(server.id)}
                onTest={() => handleTestServer(server.id)}
                testResult={testResults[server.id]}
                isConnected={isConnected(server.id)}
                capabilities={getServerCapabilities(server.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Server Card Component
function ServerCard({
  server,
  onConnect,
  onDisconnect,
  onTest,
  testResult,
  isConnected,
  capabilities
}: {
  server: MCPServer;
  onConnect: () => void;
  onDisconnect: () => void;
  onTest: () => void;
  testResult?: string;
  isConnected: boolean;
  capabilities: string[];
}) {
  const statusConfig = {
    connected: {
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      text: 'Connected',
      textColor: 'text-green-400'
    },
    disconnected: {
      icon: <XCircle className="w-6 h-6" />,
      color: 'bg-gray-500',
      text: 'Disconnected',
      textColor: 'text-gray-400'
    },
    error: {
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-red-500',
      text: 'Error',
      textColor: 'text-red-400'
    }
  };

  const config = statusConfig[server.status];

  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:border-indigo-400 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold">{server.name}</h3>
          </div>
          <div className="text-sm text-gray-300 mb-1">{server.url}</div>
          <div className="text-xs bg-white/10 px-2 py-1 rounded inline-block">
            {server.type === 'versa' ? 'Versa Networks' : 'Custom'}
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.color} ${config.textColor}`}>
          {config.icon}
          <span className="font-semibold">{config.text}</span>
        </div>
      </div>

      {/* Capabilities */}
      {capabilities.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Capabilities:</div>
          <div className="flex flex-wrap gap-2">
            {capabilities.map(cap => (
              <span key={cap} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Sync */}
      {server.lastSync && (
        <div className="text-sm text-gray-400 mb-4">
          Last sync: {new Date(server.lastSync).toLocaleString()}
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div className={`text-sm mb-4 px-3 py-2 rounded ${
          testResult === 'success' ? 'bg-green-500/20 text-green-400' :
          testResult === 'failed' ? 'bg-red-500/20 text-red-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          Test: {testResult}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isConnected ? (
          <button
            onClick={onDisconnect}
            className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all"
          >
            Connect
          </button>
        )}
        <button
          onClick={onTest}
          className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Test
        </button>
      </div>
    </div>
  );
}
