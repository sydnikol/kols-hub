/**
 * INWORLD AI HUB
 * Manage AI Characters and Generate Content
 */

import React, { useState } from 'react';
import { useInworldAI } from '../services/inworld-ai-integration';
import type { InworldCharacter, InworldMessage } from '../services/inworld-ai-integration';
import toast from 'react-hot-toast';

export default function InworldAIHub() {
  const inworld = useInworldAI();
  const [activeTab, setActiveTab] = useState<'characters' | 'chat' | 'generate'>('characters');
  const [selectedCharacter, setSelectedCharacter] = useState<InworldCharacter | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'character'; text: string; emotion?: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [contentTopic, setContentTopic] = useState('');
  const [contentType, setContentType] = useState<'youtube' | 'tiktok' | 'blog' | 'social'>('youtube');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Create character form
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterNiche, setNewCharacterNiche] = useState('');
  const [newCharacterPurpose, setNewCharacterPurpose] = useState('');

  const handleCreateCharacter = async () => {
    if (!newCharacterName || !newCharacterNiche) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const character = await inworld.createCharacter({
        name: newCharacterName,
        description: `AI character specialized in ${newCharacterNiche}`,
        personality: 'Friendly, knowledgeable, and engaging',
        background: `Expert in ${newCharacterNiche} with deep knowledge and experience`,
        goals: [
          'Create engaging content',
          'Build audience connection',
          'Maximize shareability'
        ],
        emotions: ['enthusiastic', 'confident', 'helpful']
      });

      toast.success(`Created character: ${character.name}`);
      setNewCharacterName('');
      setNewCharacterNiche('');
      setNewCharacterPurpose('');
    } catch (error) {
      console.error('Failed to create character:', error);
      toast.error('Failed to create character');
    }
  };

  const handleCreateAssistant = async () => {
    if (!newCharacterName || !newCharacterNiche) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const character = await inworld.createAssistant(newCharacterName, newCharacterNiche);
      toast.success(`Created assistant: ${character.name}`);
      setNewCharacterName('');
      setNewCharacterNiche('');
    } catch (error) {
      console.error('Failed to create assistant:', error);
      toast.error('Failed to create assistant');
    }
  };

  const handleStartChat = async (character: InworldCharacter) => {
    try {
      const session = await inworld.startSession(character.id, {
        purpose: 'chat',
        timestamp: Date.now()
      });

      setSelectedCharacter(character);
      setActiveSessionId(session.id);
      setMessages([]);
      toast.success(`Started chat with ${character.name}`);
      setActiveTab('chat');
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage || !activeSessionId || !selectedCharacter) return;

    const userMessage = currentMessage;
    setCurrentMessage('');

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      const response = await inworld.sendMessage(activeSessionId, {
        characterId: selectedCharacter.id,
        text: userMessage
      });

      setMessages(prev => [...prev, {
        role: 'character',
        text: response.text,
        emotion: response.emotion
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleGenerateContent = async () => {
    if (!contentTopic || !selectedCharacter) {
      toast.error('Please select a character and enter a topic');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const content = await inworld.generateContent(
        selectedCharacter.id,
        contentTopic,
        contentType
      );

      setGeneratedContent(content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!inworld.isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              🎭 Inworld AI Not Configured
            </h1>
            <p className="text-white/80 mb-4">
              Inworld AI will auto-initialize on app startup.
            </p>
            <p className="text-white/60 text-sm">
              Status: Initializing...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎭 Inworld AI Hub
          </h1>
          <p className="text-white/80">
            Create AI characters, chat, and generate content
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'characters'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Characters ({inworld.characters.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'chat'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'generate'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Generate Content
          </button>
        </div>

        {/* Characters Tab */}
        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Character Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Create Character</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Character Name"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                />
                <input
                  type="text"
                  placeholder="Niche (e.g., Tech, Finance, Fitness)"
                  value={newCharacterNiche}
                  onChange={(e) => setNewCharacterNiche(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                />
                <input
                  type="text"
                  placeholder="Purpose (e.g., content creation, education)"
                  value={newCharacterPurpose}
                  onChange={(e) => setNewCharacterPurpose(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateCharacter}
                    className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition"
                  >
                    Create Content Character
                  </button>
                  <button
                    onClick={handleCreateAssistant}
                    className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
                  >
                    Create Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* Characters List */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                My Characters ({inworld.characters.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {inworld.characters.map((character) => {
                  const stats = inworld.getCharacterStats(character.id);
                  return (
                    <div
                      key={character.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{character.name}</h3>
                          <p className="text-white/60 text-sm">{character.description}</p>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mb-3">{character.personality}</p>
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <span>{stats.totalMessages} messages</span>
                        <button
                          onClick={() => handleStartChat(character)}
                          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
                        >
                          Start Chat
                        </button>
                      </div>
                    </div>
                  );
                })}
                {inworld.characters.length === 0 && (
                  <p className="text-white/60 text-center py-8">
                    No characters yet. Create your first character!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            {!selectedCharacter ? (
              <div className="text-center py-12">
                <p className="text-white/80 mb-4">Select a character to start chatting</p>
                <button
                  onClick={() => setActiveTab('characters')}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
                >
                  Go to Characters
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    Chatting with {selectedCharacter.name}
                  </h2>
                  <button
                    onClick={() => {
                      if (activeSessionId) {
                        inworld.endSession(activeSessionId);
                      }
                      setActiveSessionId(null);
                      setSelectedCharacter(null);
                      setMessages([]);
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    End Chat
                  </button>
                </div>

                <div className="bg-white/5 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-4 ${
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block max-w-lg px-4 py-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        {msg.emotion && (
                          <span className="text-xs opacity-75 block mb-1">
                            {msg.emotion}
                          </span>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate Content Tab */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Generate Content</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    Select Character
                  </label>
                  <select
                    value={selectedCharacter?.id || ''}
                    onChange={(e) => {
                      const char = inworld.characters.find(c => c.id === e.target.value);
                      setSelectedCharacter(char || null);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20"
                  >
                    <option value="">Choose a character...</option>
                    {inworld.characters.map(char => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    Content Type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20"
                  >
                    <option value="youtube">YouTube Script</option>
                    <option value="tiktok">TikTok Script</option>
                    <option value="blog">Blog Post</option>
                    <option value="social">Social Media Post</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    Topic
                  </label>
                  <textarea
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                    placeholder="Enter your content topic..."
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 h-32"
                  />
                </div>

                <button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !selectedCharacter || !contentTopic}
                  className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
                >
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Generated Content</h2>
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-white whitespace-pre-wrap">{generatedContent}</pre>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                      toast.success('Copied to clipboard!');
                    }}
                    className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-white/60">
                  No content generated yet
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {inworld.characters.length}
            </div>
            <div className="text-white/80">Total Characters</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {inworld.activeSessions.length}
            </div>
            <div className="text-white/80">Active Sessions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {inworld.activeSessions.reduce((sum, s) => sum + s.messageCount, 0)}
            </div>
            <div className="text-white/80">Total Messages</div>
          </div>
        </div>
      </div>
    </div>
  );
}
