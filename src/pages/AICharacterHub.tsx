import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Heart, Brain, Sparkles, Send, Image as ImageIcon,
  Settings, Download, Trash2, Plus, Users, Bot, Zap, Volume2,
  Mic, Camera, Smile, MoreVertical, Star, Clock, TrendingUp
} from 'lucide-react';
import { multiAIService, AIModel, Message, CharacterPersonality } from '../services/multiAIService';
import charactersData from '../data/ai_characters.json';

type Character = CharacterPersonality & {
  id: string;
  category: string;
  defaultModel: AIModel;
  voiceId?: string;
  mood?: string;
  scenarioContexts?: string[];
};

type Category = 'all' | 'companion' | 'romantic' | 'mentor' | 'creative' | 'friend' | 'spiritual' | 'assistant' | 'therapeutic' | 'ancestor' | 'historical' | 'custom';

export default function AICharacterHub() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('claude-sonnet-4');
  const [showSettings, setShowSettings] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const characters: Character[] = charactersData.characters as Character[];
  const scenarios = charactersData.roleplayScenarios;

  // Load conversation history when character changes
  useEffect(() => {
    if (selectedCharacter) {
      const history = multiAIService.getConversationHistory(selectedCharacter.id);
      setMessages(history);
      setSelectedModel(selectedCharacter.defaultModel as AIModel);
    }
  }, [selectedCharacter]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredCharacters = selectedCategory === 'all'
    ? characters
    : characters.filter(c => c.category === selectedCategory);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedCharacter || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await multiAIService.chat(userMessage, {
        model: selectedModel,
        conversationHistory: messages,
        characterPersonality: selectedCharacter as CharacterPersonality
      });

      const updatedMessages = [
        ...messages,
        { role: 'user' as const, content: userMessage, timestamp: new Date() },
        { role: 'assistant' as const, content: response.message, timestamp: response.timestamp }
      ];

      setMessages(updatedMessages);
    } catch (error) {
      console.error('Chat error:', error);
      alert('Failed to send message. Please check your API keys in settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (selectedCharacter && confirm('Clear conversation history?')) {
      multiAIService.clearConversationHistory(selectedCharacter.id);
      setMessages([]);
    }
  };

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario && selectedCharacter) {
      setInputMessage(`Let's roleplay: ${scenario.name}. Setting: ${scenario.setting}`);
      setShowScenarios(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1520] to-[#0A0A0F] text-[#E8E8F4]">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/90 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                AI Character Hub
              </h1>
              <p className="text-[#C0C0D8]/70 text-sm">
                Chat with AI companions • {characters.length} characters available
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-purple-700/30 border border-purple-600/30 rounded-lg hover:border-purple-500/50 transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-purple-600/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Characters
              </h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(['all', 'companion', 'romantic', 'mentor', 'friend', 'historical', 'ancestor'] as Category[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Character List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredCharacters.map(character => (
                  <button
                    key={character.id}
                    onClick={() => setSelectedCharacter(character)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedCharacter?.id === character.id
                        ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-500/50'
                        : 'bg-[#0A0A0F]/40 border border-purple-600/20 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#E8E8F4] font-semibold truncate">{character.name}</h3>
                        <p className="text-xs text-[#C0C0D8]/60 truncate">{character.relationship}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {character.traits.slice(0, 2).map((trait, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-purple-900/30 rounded text-purple-300">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedCharacter ? (
              <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-purple-600/20 rounded-xl overflow-hidden h-[800px] flex flex-col">
                {/* Character Header */}
                <div className="p-4 border-b border-purple-600/20 bg-[#0A0A0F]/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-purple-200">{selectedCharacter.name}</h3>
                        <p className="text-xs text-[#C0C0D8]/60">{selectedCharacter.relationship}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowScenarios(!showScenarios)}
                        className="p-2 hover:bg-purple-900/30 rounded-lg transition-all"
                        title="Roleplay Scenarios"
                      >
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </button>
                      <button
                        onClick={handleClearHistory}
                        className="p-2 hover:bg-purple-900/30 rounded-lg transition-all"
                        title="Clear History"
                      >
                        <Trash2 className="w-5 h-5 text-purple-400" />
                      </button>
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="mt-3 p-3 bg-[#0A0A0F]/40 rounded-lg">
                    <p className="text-sm text-[#C0C0D8]/80 mb-2">{selectedCharacter.backstory}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.interests.slice(0, 4).map((interest, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-purple-900/30 rounded text-purple-300">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scenarios Dropdown */}
                  {showScenarios && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-[#0A0A0F]/60 rounded-lg space-y-2"
                    >
                      <p className="text-sm font-semibold text-purple-300 mb-2">Roleplay Scenarios:</p>
                      {scenarios
                        .filter(s => s.suggestedCharacters?.includes(selectedCharacter.id))
                        .map(scenario => (
                          <button
                            key={scenario.id}
                            onClick={() => handleScenarioSelect(scenario.id)}
                            className="w-full text-left p-2 bg-purple-900/20 hover:bg-purple-800/30 rounded transition-all"
                          >
                            <div className="text-sm text-purple-200">{scenario.name}</div>
                            <div className="text-xs text-[#C0C0D8]/60">{scenario.description}</div>
                          </button>
                        ))}
                    </motion.div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-[#C0C0D8]/60 py-12">
                      <Bot className="w-16 h-16 mx-auto mb-4 text-purple-400/40" />
                      <p className="text-lg font-medium">Start a conversation with {selectedCharacter.name}</p>
                      <p className="text-sm mt-2">They remember everything you discuss!</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-[#0A0A0F]/60 border border-purple-600/20 text-[#E8E8F4]'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          {msg.timestamp && (
                            <p className="text-[10px] mt-1 opacity-60">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#0A0A0F]/60 border border-purple-600/20 rounded-2xl px-4 py-3">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-purple-600/20 bg-[#0A0A0F]/60">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder={`Message ${selectedCharacter.name}...`}
                      className="flex-1 px-4 py-3 bg-[#0A0A0F]/60 border border-purple-600/30 rounded-xl text-[#E8E8F4] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-purple-500/50"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Model Selector */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#C0C0D8]/60">
                    <Brain className="w-3 h-3" />
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                      className="bg-[#0A0A0F]/60 border border-purple-600/20 rounded px-2 py-1 text-[#E8E8F4]"
                    >
                      <option value="claude-sonnet-4">Claude Sonnet</option>
                      <option value="claude-opus-4">Claude Opus</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                    <span>• {messages.length} messages</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-purple-600/20 rounded-xl h-[800px] flex items-center justify-center">
                <div className="text-center text-[#C0C0D8]/60">
                  <Users className="w-24 h-24 mx-auto mb-4 text-purple-400/40" />
                  <p className="text-xl font-medium">Select a character to start chatting</p>
                  <p className="text-sm mt-2">Choose from {characters.length} unique AI personalities</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#1A1520] to-[#0A0A0F] border border-purple-600/30 rounded-xl p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-purple-200 mb-6">AI Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C0C0D8] mb-2">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  onChange={(e) => multiAIService.setAPIKey('anthropic', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0A0A0F]/60 border border-purple-600/30 rounded-lg text-[#E8E8F4]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C0C0D8] mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  onChange={(e) => multiAIService.setAPIKey('openai', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0A0A0F]/60 border border-purple-600/30 rounded-lg text-[#E8E8F4]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C0C0D8] mb-2">
                  Google API Key
                </label>
                <input
                  type="password"
                  placeholder="AIza..."
                  onChange={(e) => multiAIService.setAPIKey('google', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0A0A0F]/60 border border-purple-600/30 rounded-lg text-[#E8E8F4]"
                />
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              Save & Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
