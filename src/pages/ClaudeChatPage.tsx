/**
 * CLAUDE CHAT PAGE
 * Full-featured chat interface with Claude AI
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Send, Plus, Trash2, Settings, Bot, User,
  Heart, Brain, Lightbulb, Code, Sparkles, Moon, ChevronLeft,
  Copy, Check, RefreshCw, Key, AlertCircle
} from 'lucide-react';
import { useClaudeChat, ClaudePersona, ClaudeConversation, ClaudeMessage } from '../services/claude-chat-service';

const PERSONA_CONFIG: Record<ClaudePersona, { name: string; icon: React.ReactNode; color: string; description: string }> = {
  assistant: {
    name: 'Assistant',
    icon: <Bot className="w-5 h-5" />,
    color: 'purple',
    description: 'General helpful assistant'
  },
  advisor: {
    name: 'Life Advisor',
    icon: <Brain className="w-5 h-5" />,
    color: 'blue',
    description: 'Health, finance & life guidance'
  },
  companion: {
    name: 'ChronoMuse',
    icon: <Heart className="w-5 h-5" />,
    color: 'pink',
    description: 'Supportive AI companion'
  },
  coach: {
    name: 'Coach',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'yellow',
    description: 'Motivation & productivity'
  },
  creative: {
    name: 'Creative Partner',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'orange',
    description: 'Writing & creative projects'
  },
  technical: {
    name: 'Tech Assistant',
    icon: <Code className="w-5 h-5" />,
    color: 'green',
    description: 'Coding & technical help'
  }
};

const ClaudeChatPage: React.FC = () => {
  const {
    isConfigured,
    conversations,
    currentConversation,
    isLoading,
    error,
    initialize,
    startNewChat,
    sendMessage,
    switchChat,
    deleteChat,
    getModel
  } = useClaudeChat();

  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<'claude-3-5-sonnet-20241022' | 'claude-3-haiku-20240307'>('claude-3-5-sonnet-20241022');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');

    if (!currentConversation) {
      startNewChat('assistant');
    }

    await sendMessage(message);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Copy message
  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Save API key
  const saveApiKey = () => {
    if (apiKey.trim()) {
      initialize(apiKey.trim(), selectedModel);
      setShowSettings(false);
    }
  };

  // Settings modal
  if (showSettings || !isConfigured) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Connect to Claude</h2>
            <p className="text-gray-400 mt-2">Enter your Anthropic API key to start chatting</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku (Faster)</option>
              </select>
            </div>

            <button
              onClick={saveApiKey}
              disabled={!apiKey.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors"
            >
              Connect to Claude
            </button>

            <p className="text-xs text-gray-500 text-center">
              Get your API key from{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                console.anthropic.com
              </a>
            </p>

            {isConfigured && (
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={() => startNewChat('assistant')}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Chat
            </button>
          </div>

          {/* Persona quick start */}
          <div className="p-4 border-b border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Quick Start</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(PERSONA_CONFIG) as ClaudePersona[]).map((persona) => {
                const config = PERSONA_CONFIG[persona];
                return (
                  <button
                    key={persona}
                    onClick={() => startNewChat(persona)}
                    className={`p-2 rounded-lg bg-gray-700 hover:bg-${config.color}-600/20 border border-gray-600 hover:border-${config.color}-500/50 transition-all flex flex-col items-center gap-1`}
                    title={config.description}
                  >
                    <span className={`text-${config.color}-400`}>{config.icon}</span>
                    <span className="text-xs text-gray-400">{config.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-2">Recent Chats</p>
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No conversations yet</p>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => {
                  const personaConfig = PERSONA_CONFIG[conv.persona];
                  return (
                    <div
                      key={conv.id}
                      className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                        currentConversation?.id === conv.id
                          ? 'bg-purple-600/20 border border-purple-500/30'
                          : 'hover:bg-gray-700'
                      }`}
                      onClick={() => switchChat(conv.id)}
                    >
                      <span className={`text-${personaConfig.color}-400`}>
                        {personaConfig.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{conv.title}</p>
                        <p className="text-xs text-gray-500">
                          {conv.messages.length} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full py-2 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <p className="text-xs text-gray-600 text-center mt-2">
              Model: {getModel().split('-').slice(0, 2).join(' ')}
            </p>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-700 flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${!showSidebar ? 'rotate-180' : ''}`} />
          </button>

          {currentConversation ? (
            <div className="flex items-center gap-3">
              <span className={`text-${PERSONA_CONFIG[currentConversation.persona].color}-400`}>
                {PERSONA_CONFIG[currentConversation.persona].icon}
              </span>
              <div>
                <h1 className="font-semibold">{currentConversation.title}</h1>
                <p className="text-xs text-gray-500">
                  {PERSONA_CONFIG[currentConversation.persona].description}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-purple-400" />
              <h1 className="font-semibold">Claude Chat</h1>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Chat with Claude</h2>
                <p className="text-gray-400 mb-6">
                  Start a conversation with Claude AI. Choose a persona or just start typing!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(['assistant', 'companion', 'advisor', 'creative'] as ClaudePersona[]).map((persona) => {
                    const config = PERSONA_CONFIG[persona];
                    return (
                      <button
                        key={persona}
                        onClick={() => startNewChat(persona)}
                        className={`p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-${config.color}-500/50 transition-all text-left`}
                      >
                        <span className={`text-${config.color}-400 mb-2 block`}>{config.icon}</span>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-xs text-gray-500">{config.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className={`w-8 h-8 rounded-full bg-${PERSONA_CONFIG[currentConversation.persona].color}-600 flex items-center justify-center flex-shrink-0`}>
                      {PERSONA_CONFIG[currentConversation.persona].icon}
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700">
                        <button
                          onClick={() => copyMessage(message.id, message.content)}
                          className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copiedId === message.id ? 'Copied' : 'Copy'}
                        </button>
                        {message.tokensUsed && (
                          <span className="text-xs text-gray-600">
                            {message.tokensUsed} tokens
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full bg-${PERSONA_CONFIG[currentConversation.persona].color}-600 flex items-center justify-center`}>
                    {PERSONA_CONFIG[currentConversation.persona].icon}
                  </div>
                  <div className="bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-gray-400">Claude is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">
            Claude may make mistakes. Consider checking important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaudeChatPage;
