/**
 * Integrations Status Page
 *
 * Central hub for managing all API integrations and services
 */

import React, { useState, useEffect } from 'react';
import { useIntegrations } from '../contexts/IntegrationContext';
import {
  CheckCircle, XCircle, Clock, Loader, RefreshCw, Settings,
  Bitcoin, Building2, DollarSign, Package, GraduationCap,
  Brain, MessageSquare, Activity, Shield, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const IntegrationsStatusPage: React.FC = () => {
  const { integrationManager, isAuthenticated, user, connectGoogleFit } = useIntegrations();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Integration metadata
  const integrationMeta: Record<string, { name: string; icon: any; color: string; description: string }> = {
    bitcoin: {
      name: 'Bitcoin Core',
      icon: Bitcoin,
      color: 'orange',
      description: 'Cryptocurrency wallet and transaction management'
    },
    banking: {
      name: 'PSD2 Banking',
      icon: Building2,
      color: 'blue',
      description: 'European banking integration (Credit Suisse)'
    },
    finance: {
      name: 'Personal Capital',
      icon: DollarSign,
      color: 'green',
      description: 'Wealth management and financial tracking'
    },
    inventory: {
      name: 'InFlow Inventory',
      icon: Package,
      color: 'purple',
      description: 'Multi-location inventory management'
    },
    learning: {
      name: 'Coursera',
      icon: GraduationCap,
      color: 'blue',
      description: 'Online learning and course management'
    },
    'ai-models': {
      name: 'Hugging Face',
      icon: Brain,
      color: 'yellow',
      description: 'AI model hub and inference'
    },
    'ai-chat': {
      name: 'Local LLM',
      icon: MessageSquare,
      color: 'purple',
      description: 'Local language model (sydnikol/kol)'
    }
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = () => {
    setLoading(true);
    try {
      const stats = integrationManager.getStatus();
      setStatuses(stats);
    } catch (error) {
      console.error('Error loading statuses:', error);
      toast.error('Failed to load integration statuses');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await integrationManager.syncAll();
      toast.success('Sync completed successfully');
      loadStatuses();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnectGoogleFit = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in with Google first');
      return;
    }

    try {
      const success = await connectGoogleFit();
      if (success) {
        toast.success('Connected to Google Fit');
      } else {
        toast.error('Failed to connect to Google Fit');
      }
    } catch (error) {
      console.error('Google Fit error:', error);
      toast.error('Failed to connect to Google Fit');
    }
  };

  const getStatusIcon = (status: any) => {
    if (status.configured && status.connected) {
      return <CheckCircle className="text-green-400" size={24} />;
    } else if (status.configured) {
      return <Clock className="text-yellow-400" size={24} />;
    } else {
      return <XCircle className="text-gray-500" size={24} />;
    }
  };

  const getStatusText = (status: any) => {
    if (status.configured && status.connected) {
      return { text: 'Connected', color: 'text-green-400' };
    } else if (status.configured) {
      return { text: 'Configured', color: 'text-yellow-400' };
    } else {
      return { text: 'Not Configured', color: 'text-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-8 h-8 text-purple-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Integration Status
                </h1>
              </div>
              <p className="text-purple-300">
                Manage and monitor all platform integrations
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={syncing ? 'animate-spin' : ''} size={20} />
              Sync All
            </button>
          </div>
        </div>

        {/* Auth Status */}
        <div className="mb-8 p-6 bg-purple-900/20 backdrop-blur-lg rounded-xl border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Authentication</h3>
                {isAuthenticated ? (
                  <p className="text-green-400">Signed in as {user?.email}</p>
                ) : (
                  <p className="text-yellow-400">Not signed in - some features limited</p>
                )}
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleConnectGoogleFit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Activity className="inline mr-2" size={18} />
                Connect Google Fit
              </button>
            )}
          </div>
        </div>

        {/* Integration Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <p className="text-purple-300">Loading integrations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statuses.map((status) => {
              const meta = integrationMeta[status.name] || {
                name: status.name,
                icon: Package,
                color: 'gray',
                description: 'Integration service'
              };
              const Icon = meta.icon;
              const statusInfo = getStatusText(status);

              return (
                <div
                  key={status.name}
                  className="bg-purple-900/20 backdrop-blur-lg rounded-xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${meta.color}-900/30 border border-${meta.color}-500/30`}>
                      <Icon className={`text-${meta.color}-400`} size={24} />
                    </div>
                    {getStatusIcon(status)}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{meta.name}</h3>
                  <p className="text-purple-300 text-sm mb-4">{meta.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Status</span>
                      <span className={statusInfo.color}>{statusInfo.text}</span>
                    </div>
                    {status.lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Last Sync</span>
                        <span className="text-purple-300">
                          {new Date(status.lastSync).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    {status.error && (
                      <div className="flex items-start gap-2 p-2 bg-red-900/20 rounded border border-red-500/30">
                        <AlertTriangle className="text-red-400 mt-0.5" size={16} />
                        <span className="text-red-300 text-xs">{status.error}</span>
                      </div>
                    )}
                  </div>

                  {!status.configured && (
                    <button className="mt-4 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors">
                      Configure
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-8 p-6 bg-purple-900/20 backdrop-blur-lg rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-3">Setup Instructions</h3>
          <p className="text-purple-300 mb-4">
            To configure integrations, create a <code className="px-2 py-1 bg-purple-900/40 rounded">.env</code> file
            in your project root with the following variables:
          </p>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
            <pre>{`# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_REDIRECT_URI=http://localhost:3000/auth/callback

# Bitcoin
VITE_BITCOIN_RPC_URL=http://localhost:8332
VITE_BITCOIN_RPC_USER=your-username
VITE_BITCOIN_RPC_PASSWORD=your-password

# Banking (PSD2)
VITE_PSD2_CLIENT_ID=your-client-id
VITE_PSD2_CLIENT_SECRET=your-client-secret

# Other integrations...
# See SETUP_GUIDE.md for full details`}</pre>
          </div>
          <p className="text-purple-400 mt-4 text-sm">
            For complete setup instructions, see <code>SETUP_GUIDE.md</code> in the project root.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsStatusPage;
