/**
 * ZAPIER AUTOMATION HUB
 * Connect to 8,000+ apps and automate everything
 */

import React, { useState } from 'react';
import { useZapier } from '../services/zapier-integration';
import type { ZapTemplate, ZapGuessRequest } from '../services/zapier-integration';
import toast from 'react-hot-toast';

export default function ZapierAutomationHub() {
  const zapier = useZapier();
  const [activeTab, setActiveTab] = useState<'templates' | 'ai-builder' | 'my-zaps' | 'setup'>('setup');
  const [templates, setTemplates] = useState<ZapTemplate[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickAccountEmail, setQuickAccountEmail] = useState('');
  const [zapierUserId, setZapierUserId] = useState<string | null>(null);

  // Setup configuration
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [sponsorMode, setSponsorMode] = useState(true);

  const handleInitialize = () => {
    if (!clientId || !clientSecret) {
      toast.error('Please enter Client ID and Client Secret');
      return;
    }

    zapier.initialize({
      clientId,
      clientSecret,
      sponsorMode
    });

    toast.success('Zapier integration initialized!');
    setActiveTab('templates');
  };

  const handleCreateQuickAccount = async () => {
    if (!quickAccountEmail) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const result = await zapier.createQuickAccount({
        email: quickAccountEmail,
        skip_intro_survey: true
      });

      setZapierUserId(result.user_id);
      toast.success('Zapier account created! You can now create Zaps.');
      localStorage.setItem('zapier_user_id', result.user_id);
    } catch (error) {
      console.error('Failed to create account:', error);
      toast.error('Failed to create Zapier account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTemplates = async () => {
    if (!searchQuery) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    try {
      const results = await zapier.searchTemplates(searchQuery);
      setTemplates(results);
      toast.success(`Found ${results.length} templates!`);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to search templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadContentTemplates = async () => {
    setIsLoading(true);
    try {
      const results = await zapier.getContentMonetizationTemplates();
      setTemplates(results);
      toast.success(`Loaded ${results.length} content monetization templates!`);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuessZap = async () => {
    if (!aiPrompt) {
      toast.error('Please describe what you want to automate');
      return;
    }

    setIsLoading(true);
    try {
      const request: ZapGuessRequest = {
        description: aiPrompt,
        context: {
          industry: 'content creation',
          goal: 'passive income'
        }
      };

      const result = await zapier.guessZap(request);
      setAiSuggestions(result.zaps);
      toast.success(`AI suggested ${result.zaps.length} automation workflows!`);
    } catch (error) {
      console.error('AI Guess failed:', error);
      toast.error('Failed to get AI suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupPassiveIncome = async () => {
    if (!zapierUserId) {
      toast.error('Please create a Zapier account first');
      return;
    }

    setIsLoading(true);
    try {
      const zaps = await zapier.setupPassiveIncomeWorkflows(zapierUserId);
      toast.success(`Created ${zaps.length} passive income workflows!`);
      setActiveTab('my-zaps');
    } catch (error) {
      console.error('Failed to setup workflows:', error);
      toast.error('Failed to create workflows');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const savedUserId = localStorage.getItem('zapier_user_id');
    if (savedUserId) {
      setZapierUserId(savedUserId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ⚡ Zapier Automation Hub
              </h1>
              <p className="text-white/80">
                Connect to 8,000+ apps - Automate your passive income
              </p>
            </div>
            {zapierUserId && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2">
                <div className="text-green-400 text-sm">Zapier Account</div>
                <div className="text-white font-mono text-xs">{zapierUserId}</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {zapier.stats.accountsCreated}
            </div>
            <div className="text-white/80 text-sm">Accounts Created</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {zapier.stats.zapsCreated}
            </div>
            <div className="text-white/80 text-sm">Zaps Created</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {zapier.stats.actionsRun}
            </div>
            <div className="text-white/80 text-sm">Actions Run</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">
              8,000+
            </div>
            <div className="text-white/80 text-sm">Apps Available</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'setup'
                ? 'bg-white text-orange-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Setup
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'templates'
                ? 'bg-white text-orange-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            disabled={!zapier.isReady}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('ai-builder')}
            className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'ai-builder'
                ? 'bg-white text-orange-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            disabled={!zapier.isReady}
          >
            🤖 AI Builder
          </button>
          <button
            onClick={() => setActiveTab('my-zaps')}
            className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === 'my-zaps'
                ? 'bg-white text-orange-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            disabled={!zapier.isReady}
          >
            My Zaps
          </button>
        </div>

        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Configure Zapier Integration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter your Zapier Client ID"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                  />
                  <p className="text-white/60 text-xs mt-1">
                    Get from: https://developer.zapier.com/
                  </p>
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Enter your Zapier Client Secret"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="sponsor-mode"
                    checked={sponsorMode}
                    onChange={(e) => setSponsorMode(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="sponsor-mode" className="text-white/80">
                    Sponsor Mode (Cover costs for users)
                  </label>
                </div>

                <button
                  onClick={handleInitialize}
                  className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
                >
                  Initialize Zapier Integration
                </button>
              </div>
            </div>

            {zapier.isReady && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Create Zapier Account (Quick Account Creation)
                </h2>
                <div className="space-y-4">
                  <p className="text-white/80 text-sm">
                    Create a Zapier account for your user without leaving your app - completely frictionless!
                  </p>
                  <input
                    type="email"
                    value={quickAccountEmail}
                    onChange={(e) => setQuickAccountEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                  />
                  <button
                    onClick={handleCreateQuickAccount}
                    disabled={isLoading || !!zapierUserId}
                    className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
                  >
                    {isLoading ? 'Creating...' : zapierUserId ? 'Account Created ✓' : 'Create Quick Account'}
                  </button>
                </div>
              </div>
            )}

            {zapierUserId && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Quick Setup: Passive Income Workflows
                </h2>
                <p className="text-white/80 mb-4">
                  Automatically create pre-built workflows for content distribution and monetization
                </p>
                <button
                  onClick={handleSetupPassiveIncome}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
                >
                  {isLoading ? 'Creating Workflows...' : 'Setup Passive Income Workflows'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchTemplates()}
                  placeholder="Search Zap templates..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                />
                <button
                  onClick={handleSearchTemplates}
                  disabled={isLoading}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
                >
                  Search
                </button>
                <button
                  onClick={handleLoadContentTemplates}
                  disabled={isLoading}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-lg font-medium transition whitespace-nowrap"
                >
                  Content Templates
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition"
                  >
                    <h3 className="font-semibold text-white mb-2">{template.title}</h3>
                    <p className="text-white/60 text-sm mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {template.apps.slice(0, 3).map((app, idx) => (
                          <div
                            key={idx}
                            className="bg-white/20 px-2 py-1 rounded text-white text-xs"
                          >
                            {app}
                          </div>
                        ))}
                      </div>
                      <a
                        href={template.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition"
                      >
                        Use Template
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {templates.length === 0 && !isLoading && (
                <div className="text-center py-12 text-white/60">
                  Search for templates or click "Content Templates" to get started
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Builder Tab */}
        {activeTab === 'ai-builder' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                🤖 AI-Powered Workflow Builder
              </h2>
              <p className="text-white/80 mb-4">
                Describe what you want to automate, and AI will suggest the perfect workflows
              </p>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Example: 'When I publish a YouTube video, automatically share it on Twitter, add it to a Google Sheet, and send me an email confirmation'"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 h-32 mb-4"
              />

              <button
                onClick={handleGuessZap}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
              >
                {isLoading ? 'AI is thinking...' : 'Generate Workflows with AI'}
              </button>
            </div>

            {aiSuggestions.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  AI Suggestions ({aiSuggestions.length})
                </h3>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-white">{suggestion.title}</h4>
                          <p className="text-white/60 text-sm mt-1">{suggestion.description}</p>
                        </div>
                        <div className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-sm">
                          {Math.round(suggestion.confidence * 100)}% match
                        </div>
                      </div>
                      <div className="space-y-2">
                        {suggestion.steps.map((step: any, stepIdx: number) => (
                          <div key={stepIdx} className="flex items-center space-x-3 text-sm">
                            <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-white">
                              {stepIdx + 1}
                            </div>
                            <div className="flex-1">
                              <span className="text-white font-medium">{step.app}</span>
                              <span className="text-white/60"> - {step.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition">
                        Create This Zap
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Zaps Tab */}
        {activeTab === 'my-zaps' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">My Automations</h2>
            {zapierUserId ? (
              <div className="text-center py-12">
                <p className="text-white/80 mb-4">
                  Your Zaps will appear here once created
                </p>
                <button
                  onClick={handleSetupPassiveIncome}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition"
                >
                  Create Passive Income Workflows
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                Create a Zapier account in the Setup tab first
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
