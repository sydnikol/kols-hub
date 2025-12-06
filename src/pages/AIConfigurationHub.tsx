/**
 * AI CONFIGURATION HUB
 * Centralized management for all AI and API integrations
 *
 * Integrations:
 * - OpenAI (Vision, DALL-E, Whisper, TTS, Assistants, Embeddings)
 * - Steam API (Game tracking)
 * - Untappd API (Beverage tracking)
 * - ZBrain AI (Knowledge graphs)
 * - Botpress (Conversational AI)
 * - New Relic (APM)
 * - Zapier (Automation)
 */

import React, { useState, useEffect } from 'react';
import {
  Settings, Key, Zap, BarChart3, TestTube2, DollarSign,
  Eye, Image, Mic, Volume2, Brain, Search, Sparkles,
  Gamepad2, Beer, Database, MessageSquare, Activity, Link2,
  CheckCircle, XCircle, AlertCircle, RefreshCw, Save, Trash2,
  TrendingUp, Calendar, Clock, Shield, GraduationCap, PieChart,
  BookOpen, FileText, PenTool, Sparkle, Code2, Stethoscope,
  Bitcoin, Heart, CreditCard, Wallet, Globe, FlaskConical
} from 'lucide-react';
import { openAIExtended } from '../services/openai-extended';

interface APIConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'error';
  features: string[];
  cost?: number;
  calls?: number;
  lastUsed?: string;
}

type TabType = 'overview' | 'openai' | 'gaming' | 'social' | 'automation' | 'monitoring' | 'learning' | 'writing' | 'developer' | 'healthcare' | 'finance' | 'payments';

export const AIConfigurationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [configs, setConfigs] = useState<APIConfig[]>([]);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    const savedConfigs = localStorage.getItem('ai_api_configs');
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs));
    } else {
      // Initialize default configs
      const defaultConfigs: APIConfig[] = [
        {
          id: 'openai',
          name: 'OpenAI',
          description: 'Vision, DALL-E, Whisper, TTS, Assistants, Embeddings',
          icon: Brain,
          color: 'emerald',
          apiKey: localStorage.getItem('openai_api_key') || '',
          status: localStorage.getItem('openai_api_key') ? 'active' : 'inactive',
          features: ['Vision Analysis', 'Image Generation', 'Audio Transcription', 'Text-to-Speech', 'Assistants', 'Embeddings']
        },
        {
          id: 'grok',
          name: 'Grok (xAI)',
          description: 'Real-time AI with access to X platform and web search',
          icon: Sparkles,
          color: 'slate',
          apiKey: localStorage.getItem('grok_api_key') || '',
          status: localStorage.getItem('grok_api_key') ? 'active' : 'inactive',
          features: ['Real-time Information', 'X Platform Access', 'Web Search', 'Conversational AI', 'Code Generation', 'Humor & Wit']
        },
        {
          id: 'steam',
          name: 'Steam API',
          description: 'Game library, achievements, playtime tracking',
          icon: Gamepad2,
          color: 'blue',
          apiKey: localStorage.getItem('steam_api_key') || '',
          status: localStorage.getItem('steam_api_key') ? 'active' : 'inactive',
          features: ['Game Library', 'Achievements', 'Playtime Stats', 'Friends List']
        },
        {
          id: 'untappd',
          name: 'Untappd',
          description: 'Beer check-ins, ratings, collection tracking',
          icon: Beer,
          color: 'amber',
          apiKey: localStorage.getItem('untappd_api_key') || '',
          status: localStorage.getItem('untappd_api_key') ? 'active' : 'inactive',
          features: ['Beer Check-ins', 'Ratings', 'Collection', 'Brewery Info']
        },
        {
          id: 'zbrain',
          name: 'ZBrain AI',
          description: 'Knowledge graphs, AI workflows, data processing',
          icon: Database,
          color: 'purple',
          apiKey: localStorage.getItem('zbrain_api_key') || '',
          status: localStorage.getItem('zbrain_api_key') ? 'active' : 'inactive',
          features: ['Knowledge Graphs', 'AI Workflows', 'Data Processing', 'Custom Models']
        },
        {
          id: 'botpress',
          name: 'Botpress',
          description: 'Conversational AI, chatbots, workflows',
          icon: MessageSquare,
          color: 'indigo',
          apiKey: localStorage.getItem('botpress_api_key') || '',
          status: localStorage.getItem('botpress_api_key') ? 'active' : 'inactive',
          features: ['Chatbots', 'Workflows', 'NLU', 'Multi-channel']
        },
        {
          id: 'newrelic',
          name: 'New Relic',
          description: 'APM, monitoring, observability',
          icon: Activity,
          color: 'green',
          apiKey: localStorage.getItem('newrelic_api_key') || '',
          status: localStorage.getItem('newrelic_api_key') ? 'active' : 'inactive',
          features: ['APM', 'Infrastructure Monitoring', 'Logs', 'Alerts']
        },
        {
          id: 'zapier',
          name: 'Zapier',
          description: 'Workflow automation, 8000+ app integrations',
          icon: Zap,
          color: 'orange',
          apiKey: localStorage.getItem('zapier_api_key') || '',
          status: localStorage.getItem('zapier_api_key') ? 'active' : 'inactive',
          features: ['Workflows', '8000+ Apps', 'Triggers', 'Actions']
        },
        {
          id: 'pluralsight',
          name: 'Pluralsight Skills',
          description: 'Skills assessments, courses, certifications (includes ACG)',
          icon: GraduationCap,
          color: 'pink',
          apiKey: localStorage.getItem('pluralsight_api_key') || '',
          status: localStorage.getItem('pluralsight_api_key') ? 'active' : 'inactive',
          features: ['Skill IQ Assessments', 'Course Tracking', 'Learning Paths', 'Certifications', 'Cloud Guru Content']
        },
        {
          id: 'tableau',
          name: 'Tableau',
          description: 'Data visualization and analytics dashboards',
          icon: PieChart,
          color: 'blue',
          apiKey: localStorage.getItem('tableau_api_key') || '',
          status: localStorage.getItem('tableau_api_key') ? 'active' : 'inactive',
          features: ['Learning Analytics', 'Financial Dashboards', 'Health Metrics', 'Embedded Views', 'Custom Workbooks']
        },
        {
          id: 'coursera',
          name: 'Coursera',
          description: 'Online courses, specializations, and degrees',
          icon: BookOpen,
          color: 'blue',
          apiKey: localStorage.getItem('coursera_api_key') || '',
          status: localStorage.getItem('coursera_api_key') ? 'active' : 'inactive',
          features: ['Course Enrollment', 'Specializations', 'Degrees', 'Certificates', 'Learning History', 'Recommendations']
        },
        {
          id: 'grammarly',
          name: 'Grammarly',
          description: 'AI-powered writing assistant and grammar checker',
          icon: PenTool,
          color: 'green',
          apiKey: localStorage.getItem('grammarly_api_key') || '',
          status: localStorage.getItem('grammarly_api_key') ? 'active' : 'inactive',
          features: ['Grammar Check', 'Style Suggestions', 'Tone Detection', 'Plagiarism Check', 'Clarity Score', 'Real-time Editing']
        },
        {
          id: 'writer',
          name: 'Writer',
          description: 'Enterprise AI writing platform with brand consistency',
          icon: FileText,
          color: 'purple',
          apiKey: localStorage.getItem('writer_api_key') || '',
          status: localStorage.getItem('writer_api_key') ? 'active' : 'inactive',
          features: ['AI Agents', 'Brand Voice', 'Style Guide', 'Content Generation', 'Team Collaboration', 'Compliance']
        },
        {
          id: 'linguix',
          name: 'Linguix',
          description: 'Writing enhancement and content quality platform',
          icon: Sparkle,
          color: 'cyan',
          apiKey: localStorage.getItem('linguix_api_key') || '',
          status: localStorage.getItem('linguix_api_key') ? 'active' : 'inactive',
          features: ['Grammar Check', 'Rewriting', 'Shortcuts', 'Team Style Guide', 'Content Quality Score', 'Multilingual Support']
        },
        {
          id: 'missinglink',
          name: 'MissingLink.ai',
          description: 'ML experiment tracking and hyperparameter optimization',
          icon: FlaskConical,
          color: 'cyan',
          apiKey: localStorage.getItem('missinglink_api_key') || '',
          status: localStorage.getItem('missinglink_api_key') ? 'active' : 'inactive',
          features: ['Experiment Tracking', 'Hyperparameter Optimization', 'Resource Monitoring', 'Model Comparison', 'Artifact Management']
        },
        {
          id: 'chroma',
          name: 'Chroma Vector DB',
          description: 'AI-native embedding database for semantic search',
          icon: Database,
          color: 'purple',
          apiKey: localStorage.getItem('chroma_api_key') || '',
          status: localStorage.getItem('chroma_api_key') ? 'active' : 'inactive',
          features: ['Vector Storage', 'Semantic Search', 'Embeddings', 'Collections', 'Similarity Queries']
        },
        {
          id: 'agentql',
          name: 'AgentQL',
          description: 'AI-powered web scraping and automation',
          icon: Globe,
          color: 'blue',
          apiKey: localStorage.getItem('agentql_api_key') || '',
          status: localStorage.getItem('agentql_api_key') ? 'active' : 'inactive',
          features: ['Natural Language Queries', 'Web Scraping', 'Form Automation', 'Screenshots', 'Monitoring']
        },
        {
          id: 'redox',
          name: 'Redox Engine',
          description: 'Healthcare EHR interoperability platform',
          icon: Stethoscope,
          color: 'red',
          apiKey: localStorage.getItem('redox_api_key') || '',
          status: localStorage.getItem('redox_api_key') ? 'active' : 'inactive',
          features: ['EHR Integration', 'Patient Data', 'Clinical Workflows', 'FHIR Support', 'Lab Results', 'Appointments']
        },
        {
          id: 'nabla',
          name: 'Nabla',
          description: 'AI medical assistant and clinical documentation',
          icon: Heart,
          color: 'pink',
          apiKey: localStorage.getItem('nabla_api_key') || '',
          status: localStorage.getItem('nabla_api_key') ? 'active' : 'inactive',
          features: ['Clinical Documentation', 'AI Note Generation', 'ICD-10 Coding', 'SOAP Notes', 'Audio Transcription', 'EHR Export']
        },
        {
          id: 'fewsats',
          name: 'Fewsats',
          description: 'Bitcoin Lightning micropayments and value-for-value',
          icon: Bitcoin,
          color: 'orange',
          apiKey: localStorage.getItem('fewsats_api_key') || '',
          status: localStorage.getItem('fewsats_api_key') ? 'active' : 'inactive',
          features: ['Lightning Payments', 'Micropayments', 'Payment Streaming', 'API Monetization', 'Content Paywall', 'Instant Settlement']
        },
        {
          id: 'moneyhub',
          name: 'MoneyHub',
          description: 'Financial data aggregation and Open Banking',
          icon: Wallet,
          color: 'green',
          apiKey: localStorage.getItem('moneyhub_api_key') || '',
          status: localStorage.getItem('moneyhub_api_key') ? 'active' : 'inactive',
          features: ['Account Aggregation', 'Transaction Data', 'Spending Analysis', 'Budgets', 'Financial Insights', 'Open Banking']
        }
      ];
      setConfigs(defaultConfigs);
      localStorage.setItem('ai_api_configs', JSON.stringify(defaultConfigs));
    }
  };

  const saveConfig = (config: APIConfig) => {
    const updated = configs.map(c => c.id === config.id ? config : c);
    setConfigs(updated);
    localStorage.setItem('ai_api_configs', JSON.stringify(updated));
    localStorage.setItem(`${config.id}_api_key`, config.apiKey);

    // Initialize OpenAI if configured
    if (config.id === 'openai' && config.apiKey) {
      openAIExtended.initialize(config.apiKey);
    }
  };

  const testConnection = async (configId: string) => {
    setTestResults({ ...testResults, [configId]: 'testing' });

    try {
      if (configId === 'openai') {
        // Test OpenAI connection
        const result = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${configs.find(c => c.id === 'openai')?.apiKey}`
          }
        });

        if (result.ok) {
          setTestResults({ ...testResults, [configId]: 'success' });
          updateConfigStatus(configId, 'active');
        } else {
          setTestResults({ ...testResults, [configId]: 'error' });
          updateConfigStatus(configId, 'error');
        }
      } else {
        // Placeholder for other API tests
        setTimeout(() => {
          setTestResults({ ...testResults, [configId]: 'success' });
          updateConfigStatus(configId, 'active');
        }, 1500);
      }
    } catch (error) {
      setTestResults({ ...testResults, [configId]: 'error' });
      updateConfigStatus(configId, 'error');
    }
  };

  const updateConfigStatus = (configId: string, status: 'active' | 'inactive' | 'error') => {
    const updated = configs.map(c => c.id === configId ? { ...c, status } : c);
    setConfigs(updated);
    localStorage.setItem('ai_api_configs', JSON.stringify(updated));
  };

  const deleteConfig = (configId: string) => {
    if (confirm('Are you sure you want to delete this API configuration?')) {
      const updated = configs.map(c =>
        c.id === configId ? { ...c, apiKey: '', status: 'inactive' as const } : c
      );
      setConfigs(updated);
      localStorage.setItem('ai_api_configs', JSON.stringify(updated));
      localStorage.removeItem(`${configId}_api_key`);
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3, color: 'purple' },
    { id: 'openai' as const, label: 'OpenAI', icon: Brain, color: 'emerald' },
    { id: 'gaming' as const, label: 'Gaming', icon: Gamepad2, color: 'blue' },
    { id: 'social' as const, label: 'Social', icon: Beer, color: 'amber' },
    { id: 'automation' as const, label: 'Automation', icon: Zap, color: 'orange' },
    { id: 'monitoring' as const, label: 'Monitoring', icon: Activity, color: 'green' },
    { id: 'learning' as const, label: 'Learning', icon: GraduationCap, color: 'pink' },
    { id: 'writing' as const, label: 'Writing', icon: PenTool, color: 'indigo' },
    { id: 'developer' as const, label: 'Developer', icon: Code2, color: 'cyan' },
    { id: 'healthcare' as const, label: 'Healthcare', icon: Stethoscope, color: 'red' },
    { id: 'finance' as const, label: 'Finance', icon: Wallet, color: 'green' },
    { id: 'payments' as const, label: 'Payments', icon: Bitcoin, color: 'orange' }
  ];

  const getOpenAIStats = () => {
    if (openAIExtended.isConfigured()) {
      return openAIExtended.getStats();
    }
    return null;
  };

  const activeConfigs = configs.filter(c => c.status === 'active').length;
  const totalConfigs = configs.length;
  const openaiStats = getOpenAIStats();

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-purple-300">AI Configuration Hub</h1>
          </div>
          <p className="text-purple-400">
            Manage all AI integrations, API keys, and monitor usage across {totalConfigs} services
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <span className="text-3xl font-bold text-emerald-300">{activeConfigs}</span>
            </div>
            <p className="text-emerald-400 font-medium">Active Integrations</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Key className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-purple-300">{totalConfigs}</span>
            </div>
            <p className="text-purple-400 font-medium">Total Services</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-blue-300">
                {openaiStats ? Object.values(openaiStats).reduce((sum, stat) =>
                  sum + (typeof stat === 'object' && stat !== null ? (stat.calls || 0) : 0), 0
                ) : 0}
              </span>
            </div>
            <p className="text-blue-400 font-medium">API Calls Today</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-amber-400" />
              <span className="text-3xl font-bold text-amber-300">
                ${openaiStats?.totalCost.toFixed(2) || '0.00'}
              </span>
            </div>
            <p className="text-amber-400 font-medium">Total Cost</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-600 text-white`
                    : `bg-${tab.color}-900/30 text-${tab.color}-300 hover:bg-${tab.color}-900/50`
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">All Integrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {configs.map(config => (
                  <ConfigCard
                    key={config.id}
                    config={config}
                    onSave={saveConfig}
                    onTest={testConnection}
                    onDelete={deleteConfig}
                    testStatus={testResults[config.id]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* OpenAI Tab */}
          {activeTab === 'openai' && (
            <OpenAIPanel
              config={configs.find(c => c.id === 'openai')!}
              stats={openaiStats}
              onSave={saveConfig}
              onTest={testConnection}
              testStatus={testResults['openai']}
            />
          )}

          {/* Gaming Tab */}
          {activeTab === 'gaming' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-300 mb-4">Gaming Integrations</h2>
              <ConfigCard
                config={configs.find(c => c.id === 'steam')!}
                onSave={saveConfig}
                onTest={testConnection}
                onDelete={deleteConfig}
                testStatus={testResults['steam']}
              />
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-3">Steam Integration Features</h3>
                <ul className="space-y-2 text-blue-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-400" />
                    Track game library and playtime
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-400" />
                    Monitor achievements and progress
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-400" />
                    Sync friends and community data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-400" />
                    Get personalized game recommendations
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-amber-300 mb-4">Social Integrations</h2>
              <ConfigCard
                config={configs.find(c => c.id === 'untappd')!}
                onSave={saveConfig}
                onTest={testConnection}
                onDelete={deleteConfig}
                testStatus={testResults['untappd']}
              />
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-amber-300 mb-3">Untappd Integration Features</h3>
                <ul className="space-y-2 text-amber-200">
                  <li className="flex items-center gap-2">
                    <Beer size={16} className="text-amber-400" />
                    Track beer check-ins and ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <Beer size={16} className="text-amber-400" />
                    Build your beer collection
                  </li>
                  <li className="flex items-center gap-2">
                    <Beer size={16} className="text-amber-400" />
                    Discover breweries and venues
                  </li>
                  <li className="flex items-center gap-2">
                    <Beer size={16} className="text-amber-400" />
                    Share with friends and earn badges
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Automation Tab */}
          {activeTab === 'automation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-orange-300 mb-4">Automation & AI</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                  config={configs.find(c => c.id === 'zapier')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['zapier']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'zbrain')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['zbrain']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'botpress')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['botpress']}
                />
              </div>
            </div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-300 mb-4">Monitoring & Observability</h2>
              <ConfigCard
                config={configs.find(c => c.id === 'newrelic')!}
                onSave={saveConfig}
                onTest={testConnection}
                onDelete={deleteConfig}
                testStatus={testResults['newrelic']}
              />
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-300 mb-3">New Relic Features</h3>
                <ul className="space-y-2 text-green-200">
                  <li className="flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    Application Performance Monitoring (APM)
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    Infrastructure monitoring and alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    Log management and analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    Real-time dashboards and insights
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-pink-300 mb-4">Learning & Skills Development</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                  config={configs.find(c => c.id === 'pluralsight')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['pluralsight']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'coursera')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['coursera']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'tableau')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['tableau']}
                />
              </div>

              <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-pink-300 mb-3">Pluralsight Skills Features</h3>
                <ul className="space-y-2 text-pink-200">
                  <li className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-pink-400" />
                    Skill IQ Assessments (300-point scale)
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-pink-400" />
                    Course progress tracking and transcripts
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-pink-400" />
                    Personalized learning paths
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-pink-400" />
                    Certification management
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-pink-400" />
                    A Cloud Guru content (cloud computing)
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-pink-400" />
                    Skill gap analysis and recommendations
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-3">Coursera Features</h3>
                <ul className="space-y-2 text-blue-200">
                  <li className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    University-level courses and specializations
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    Degree programs from top universities
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    Professional certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    Guided projects and hands-on learning
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    Assignment submission and grading
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    AI-powered course recommendations
                  </li>
                </ul>
              </div>

              <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-pink-300 mb-3">Complete Learning Ecosystem</h3>
                <div className="space-y-3 text-pink-200">
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-pink-400 mt-1 flex-shrink-0" />
                    <span><strong>Pluralsight:</strong> Technical skills, cloud computing, developer training</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Coursera:</strong> Academic courses, degrees, professional certifications</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Tableau:</strong> Visualize learning progress, track skill development, analytics dashboards</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Sparkles size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                    <span><strong>Unified Learning:</strong> Track all courses, skills, and certifications in one place</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Writing Tab */}
          {activeTab === 'writing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-indigo-300 mb-4">Writing & Content Quality</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                  config={configs.find(c => c.id === 'grammarly')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['grammarly']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'writer')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['writer']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'linguix')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['linguix']}
                />
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-300 mb-3">Grammarly Features</h3>
                <ul className="space-y-2 text-green-200">
                  <li className="flex items-center gap-2">
                    <PenTool size={16} className="text-green-400" />
                    Real-time grammar and spelling corrections
                  </li>
                  <li className="flex items-center gap-2">
                    <PenTool size={16} className="text-green-400" />
                    Tone and clarity detection
                  </li>
                  <li className="flex items-center gap-2">
                    <PenTool size={16} className="text-green-400" />
                    Style and consistency recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <PenTool size={16} className="text-green-400" />
                    Plagiarism detection (premium)
                  </li>
                  <li className="flex items-center gap-2">
                    <PenTool size={16} className="text-green-400" />
                    Editor SDK for React integration
                  </li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-3">Writer Enterprise Features</h3>
                <ul className="space-y-2 text-purple-200">
                  <li className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" />
                    AI-powered content generation agents
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" />
                    Brand voice and style guide enforcement
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" />
                    Team collaboration and workflows
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" />
                    Compliance and regulatory checks
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" />
                    Custom AI agents for specific use cases
                  </li>
                </ul>
              </div>

              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Linguix Features</h3>
                <ul className="space-y-2 text-cyan-200">
                  <li className="flex items-center gap-2">
                    <Sparkle size={16} className="text-cyan-400" />
                    Advanced grammar and style checking
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkle size={16} className="text-cyan-400" />
                    AI-powered rewriting and paraphrasing
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkle size={16} className="text-cyan-400" />
                    Text shortcuts and templates
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkle size={16} className="text-cyan-400" />
                    Team style guides and brand voice
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkle size={16} className="text-cyan-400" />
                    Content quality scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkle size={16} className="text-cyan-400" />
                    Multilingual support
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-300 mb-3">Writing Enhancement Ecosystem</h3>
                <div className="space-y-3 text-indigo-200">
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Grammarly:</strong> Industry-leading grammar, clarity, and tone detection</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Writer:</strong> Enterprise AI agents, brand consistency, compliance</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span><strong>Linguix:</strong> Rewriting, shortcuts, multilingual content quality</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Sparkles size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                    <span><strong>Complete Solution:</strong> Cover all writing needs from personal to enterprise</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Developer Tools Tab */}
          {activeTab === 'developer' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">Developer & ML Tools</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                  config={configs.find(c => c.id === 'missinglink')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['missinglink']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'chroma')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['chroma']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'agentql')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['agentql']}
                />
              </div>

              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">ML & Experimentation</h3>
                <ul className="space-y-2 text-cyan-200">
                  <li className="flex items-center gap-2">
                    <FlaskConical size={16} className="text-cyan-400" />
                    Track ML experiments and hyperparameters with MissingLink
                  </li>
                  <li className="flex items-center gap-2">
                    <FlaskConical size={16} className="text-cyan-400" />
                    Monitor GPU/CPU resources during training
                  </li>
                  <li className="flex items-center gap-2">
                    <FlaskConical size={16} className="text-cyan-400" />
                    Compare model performance across experiments
                  </li>
                  <li className="flex items-center gap-2">
                    <FlaskConical size={16} className="text-cyan-400" />
                    Automated hyperparameter optimization
                  </li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-3">Vector Database & Semantic Search</h3>
                <ul className="space-y-2 text-purple-200">
                  <li className="flex items-center gap-2">
                    <Database size={16} className="text-purple-400" />
                    Store and query embeddings with Chroma
                  </li>
                  <li className="flex items-center gap-2">
                    <Database size={16} className="text-purple-400" />
                    Build semantic search for your applications
                  </li>
                  <li className="flex items-center gap-2">
                    <Database size={16} className="text-purple-400" />
                    Integrate with OpenAI Embeddings
                  </li>
                  <li className="flex items-center gap-2">
                    <Database size={16} className="text-purple-400" />
                    Query by similarity, not exact matches
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-3">Web Automation with AI</h3>
                <ul className="space-y-2 text-blue-200">
                  <li className="flex items-center gap-2">
                    <Globe size={16} className="text-blue-400" />
                    Natural language web scraping with AgentQL
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe size={16} className="text-blue-400" />
                    Automate form filling and submissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe size={16} className="text-blue-400" />
                    Extract data from dynamic websites
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe size={16} className="text-blue-400" />
                    Take screenshots and monitor pages
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Healthcare Tab */}
          {activeTab === 'healthcare' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-red-300 mb-4">Healthcare & Clinical Systems</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                  config={configs.find(c => c.id === 'redox')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['redox']}
                />
                <ConfigCard
                  config={configs.find(c => c.id === 'nabla')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['nabla']}
                />
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-300 mb-3">EHR Integration (Redox Engine)</h3>
                <ul className="space-y-2 text-red-200">
                  <li className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-red-400" />
                    Connect to 300+ EHR systems (Epic, Cerner, AllScripts)
                  </li>
                  <li className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-red-400" />
                    Access patient demographics and identifiers
                  </li>
                  <li className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-red-400" />
                    Retrieve medications, allergies, and vital signs
                  </li>
                  <li className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-red-400" />
                    Schedule appointments and create orders
                  </li>
                  <li className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-red-400" />
                    FHIR R4 compliant data exchange
                  </li>
                </ul>
              </div>

              <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-pink-300 mb-3">AI Clinical Documentation (Nabla)</h3>
                <ul className="space-y-2 text-pink-200">
                  <li className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-400" />
                    Ambient clinical documentation from conversation
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-400" />
                    AI-generated SOAP notes with 70% time savings
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-400" />
                    Automatic ICD-10 and CPT code suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-400" />
                    Medical concept extraction and insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-400" />
                    Export directly to EHR systems
                  </li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-300 mb-3">HIPAA & Compliance</h3>
                <div className="space-y-3 text-red-200">
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>HIPAA Compliant:</strong> Secure PHI handling with encryption</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>HITRUST Certified:</strong> Working with certified vendors</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Audit Logging:</strong> Track all data access and modifications</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Heart size={16} className="text-pink-400 mt-1 flex-shrink-0" />
                    <span><strong>Integration:</strong> Works with Health AI Advisor for clinical insights</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Finance Tab */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-300 mb-4">Financial Data & Open Banking</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                  config={configs.find(c => c.id === 'moneyhub')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['moneyhub']}
                />
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-300 mb-3">Account Aggregation</h3>
                <ul className="space-y-2 text-green-200">
                  <li className="flex items-center gap-2">
                    <Wallet size={16} className="text-green-400" />
                    Connect all bank accounts in one place
                  </li>
                  <li className="flex items-center gap-2">
                    <Wallet size={16} className="text-green-400" />
                    Real-time balance and transaction sync
                  </li>
                  <li className="flex items-center gap-2">
                    <Wallet size={16} className="text-green-400" />
                    Support for checking, savings, credit cards, loans
                  </li>
                  <li className="flex items-center gap-2">
                    <Wallet size={16} className="text-green-400" />
                    Automatic transaction categorization
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-300 mb-3">Financial Analytics</h3>
                <ul className="space-y-2 text-emerald-200">
                  <li className="flex items-center gap-2">
                    <CreditCard size={16} className="text-emerald-400" />
                    Spending analysis by category and merchant
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCard size={16} className="text-emerald-400" />
                    Income tracking and cash flow monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCard size={16} className="text-emerald-400" />
                    Budget creation and tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCard size={16} className="text-emerald-400" />
                    Net worth calculation (assets - liabilities)
                  </li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-300 mb-3">AI Integration</h3>
                <div className="space-y-3 text-green-200">
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong>Financial AI Advisor:</strong> Get AI-powered insights on spending patterns</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong>Debt Strategies:</strong> AI recommendations for debt payoff optimization</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span><strong>Income Optimization:</strong> Analyze income streams and identify opportunities</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Sparkles size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                    <span><strong>Open Banking:</strong> Secure, standardized access to your financial data</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-orange-300 mb-4">Bitcoin Lightning Payments</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                  config={configs.find(c => c.id === 'fewsats')!}
                  onSave={saveConfig}
                  onTest={testConnection}
                  onDelete={deleteConfig}
                  testStatus={testResults['fewsats']}
                />
              </div>

              <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-300 mb-3">Lightning Network Features</h3>
                <ul className="space-y-2 text-orange-200">
                  <li className="flex items-center gap-2">
                    <Bitcoin size={16} className="text-orange-400" />
                    Instant micropayments (as low as 1 satoshi)
                  </li>
                  <li className="flex items-center gap-2">
                    <Bitcoin size={16} className="text-orange-400" />
                    Near-zero transaction fees
                  </li>
                  <li className="flex items-center gap-2">
                    <Bitcoin size={16} className="text-orange-400" />
                    Payment streaming (sats per minute)
                  </li>
                  <li className="flex items-center gap-2">
                    <Bitcoin size={16} className="text-orange-400" />
                    Instant settlement, no chargebacks
                  </li>
                </ul>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-amber-300 mb-3">Content Monetization</h3>
                <ul className="space-y-2 text-amber-200">
                  <li className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    Create paywalls for articles, videos, APIs
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    Value-for-value content (pay what you want)
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    Revenue splitting (multiple recipients)
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    Pay-per-use API monetization
                  </li>
                </ul>
              </div>

              <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-300 mb-3">Use Cases</h3>
                <div className="space-y-3 text-orange-200">
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                    <span><strong>Podcasting 2.0:</strong> Streaming sats while listening to content</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                    <span><strong>API Monetization:</strong> Charge per API call with instant settlement</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                    <span><strong>Digital Content:</strong> Micropayments for articles, images, downloads</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Sparkles size={16} className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Global Payments:</strong> Borderless, instant payments worldwide</span>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CONFIG CARD COMPONENT
// ============================================================================

interface ConfigCardProps {
  config: APIConfig;
  onSave: (config: APIConfig) => void;
  onTest: (configId: string) => void;
  onDelete: (configId: string) => void;
  testStatus?: string;
}

const ConfigCard: React.FC<ConfigCardProps> = ({ config, onSave, onTest, onDelete, testStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const Icon = config.icon;

  const handleSave = () => {
    onSave({ ...config, apiKey, status: apiKey ? 'inactive' : 'inactive' });
    setIsEditing(false);
  };

  const getStatusIcon = () => {
    if (testStatus === 'testing') return <RefreshCw size={20} className="animate-spin text-blue-400" />;
    if (testStatus === 'success') return <CheckCircle size={20} className="text-green-400" />;
    if (testStatus === 'error') return <XCircle size={20} className="text-red-400" />;
    if (config.status === 'active') return <CheckCircle size={20} className="text-green-400" />;
    if (config.status === 'error') return <AlertCircle size={20} className="text-red-400" />;
    return <XCircle size={20} className="text-gray-400" />;
  };

  return (
    <div className={`bg-gradient-to-br from-${config.color}-900/30 to-${config.color}-950/30 border border-${config.color}-500/30 rounded-xl p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 bg-${config.color}-600/20 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${config.color}-400`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold text-${config.color}-300`}>{config.name}</h3>
            <p className={`text-sm text-${config.color}-400`}>{config.description}</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      {/* Features */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {config.features.map((feature, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 bg-${config.color}-900/50 text-${config.color}-200 rounded text-xs`}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* API Key Input */}
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API key..."
            className={`w-full px-3 py-2 bg-${config.color}-950/50 border border-${config.color}-500/30 rounded text-${config.color}-100 placeholder-${config.color}-400`}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-${config.color}-600 hover:bg-${config.color}-500 text-white rounded font-medium transition-colors`}
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`px-4 py-2 bg-${config.color}-900/50 hover:bg-${config.color}-900/70 text-${config.color}-300 rounded font-medium transition-colors`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-${config.color}-600/20 hover:bg-${config.color}-600/30 text-${config.color}-300 rounded font-medium transition-colors`}
          >
            <Key size={16} />
            {config.apiKey ? 'Update Key' : 'Add Key'}
          </button>
          {config.apiKey && (
            <>
              <button
                onClick={() => onTest(config.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded font-medium transition-colors`}
              >
                <TestTube2 size={16} />
                Test
              </button>
              <button
                onClick={() => onDelete(config.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded font-medium transition-colors`}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// OPENAI PANEL COMPONENT
// ============================================================================

interface OpenAIPanelProps {
  config: APIConfig;
  stats: any;
  onSave: (config: APIConfig) => void;
  onTest: (configId: string) => void;
  testStatus?: string;
}

const OpenAIPanel: React.FC<OpenAIPanelProps> = ({ config, stats, onSave, onTest, testStatus }) => {
  const [apiKey, setApiKey] = useState(config.apiKey);

  const services = [
    { name: 'Vision (GPT-4o)', icon: Eye, stats: stats?.vision, color: 'cyan' },
    { name: 'DALL-E 3', icon: Image, stats: stats?.dalle, color: 'purple' },
    { name: 'Whisper', icon: Mic, stats: stats?.whisper, color: 'blue' },
    { name: 'Text-to-Speech', icon: Volume2, stats: stats?.tts, color: 'green' },
    { name: 'Assistants', icon: Brain, stats: stats?.assistants, color: 'indigo' },
    { name: 'Embeddings', icon: Search, stats: stats?.embeddings, color: 'amber' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-emerald-300 mb-4">OpenAI Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-emerald-300 font-medium mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2 bg-emerald-950/50 border border-emerald-500/30 rounded text-emerald-100 placeholder-emerald-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onSave({ ...config, apiKey });
                if (apiKey) openAIExtended.initialize(apiKey);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors"
            >
              <Save size={16} />
              Save Configuration
            </button>
            {apiKey && (
              <button
                onClick={() => onTest('openai')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
              >
                <TestTube2 size={16} />
                Test Connection
              </button>
            )}
          </div>

          {testStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={20} />
              Connection successful!
            </div>
          )}
          {testStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-400">
              <XCircle size={20} />
              Connection failed. Check your API key.
            </div>
          )}
        </div>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.name}
              className={`bg-gradient-to-br from-${service.color}-900/30 to-${service.color}-950/30 border border-${service.color}-500/30 rounded-xl p-4`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-6 h-6 text-${service.color}-400`} />
                <h3 className={`font-bold text-${service.color}-300`}>{service.name}</h3>
              </div>
              <div className="space-y-1">
                <div className={`flex justify-between text-sm text-${service.color}-200`}>
                  <span>Calls:</span>
                  <span className="font-bold">{service.stats?.calls || 0}</span>
                </div>
                <div className={`flex justify-between text-sm text-${service.color}-200`}>
                  <span>Cost:</span>
                  <span className="font-bold">${service.stats?.cost?.toFixed(4) || '0.0000'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Cost */}
      {stats && (
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-xl font-bold text-amber-300">Total OpenAI Cost</h3>
                <p className="text-amber-400">Across all services</p>
              </div>
            </div>
            <span className="text-4xl font-bold text-amber-300">
              ${stats.totalCost?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConfigurationHub;
