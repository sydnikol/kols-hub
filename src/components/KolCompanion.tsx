/**
 * 🖤 KOL AI COMPANION - ChronoMuse (The Archivist Oracle)
 * ========================================================
 * Your personal AI companion with Ready Player Me 3D avatar,
 * voice interaction, pattern recognition, and MORE!
 */

import { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, Sparkles, Brain, Heart, Zap } from 'lucide-react';
import { useKolHubStore } from '../store/kolhub-store';
import { db } from '../utils/database';
import ReadyPlayerMeAvatar from './ReadyPlayerMeAvatar';
import { DEFAULT_AVATAR_ID } from '../utils/avatar-utils';

const KolCompanion = () => {
  const { userProfile, companionActive, companionMood, conversationContext, patterns, insights, toggleCompanion } = useKolHubStore();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversationHistory();
    loadReadyPlayerMeAvatar();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const loadConversationHistory = async () => {
    const history = await db.conversations
      .orderBy('timestamp')
      .reverse()
      .limit(50)
      .toArray();
    
    const formatted = history.map(conv => [
      { role: 'user' as const, content: conv.userMessage, timestamp: conv.timestamp.toISOString() },
      { role: 'assistant' as const, content: conv.aiResponse, timestamp: conv.timestamp.toISOString() }
    ]).flat();

    setConversation(formatted);
  };

  const loadReadyPlayerMeAvatar = () => {
    // Avatar is now rendered via ReadyPlayerMeAvatar component
    setAvatarLoaded(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: 'user' as const, content: message, timestamp: new Date().toISOString()  };
    setConversation(prev => [...prev, userMsg]);

    // Generate AI response (this would integrate with actual AI service)
    const aiResponse = await generateAIResponse(message);
    const assistantMsg = { role: 'assistant' as const, content: aiResponse, timestamp: new Date().toISOString()  };
    setConversation(prev => [...prev, assistantMsg]);

    // Save to database
    await db.conversations.add({
      timestamp: new Date(),
      mode: 'companion',
      room: 'health',
      userMessage: message,
      aiResponse: aiResponse,
    });

    setMessage('');
    
    if (isSpeaking) {
      speakResponse(aiResponse);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // This would integrate with Claude API or other AI service
    // For now, return contextual responses based on patterns
    
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('energy') || lowerMsg.includes('spoon')) {
      return `I see you're checking in about energy, honey. You been at ${patterns.averageSpoons} spoons on average. ${insights[0] || 'Keep pacing yourself, baby!'}`;
    }
    
    if (lowerMsg.includes('medication') || lowerMsg.includes('med')) {
      return `Your medication adherence is at ${patterns.medicationAdherence}%. ${patterns.medicationAdherence < 80 ? "Want me to help set up some gentle reminders, sweetness?" : "You been doing REAL good with them meds!"}`;
    }
    
    if (lowerMsg.includes('pain') || lowerMsg.includes('hurt')) {
      const triggers = patterns.commonTriggers.join(', ');
      return `I know you been dealing with pain, baby. Your common triggers been: ${triggers || 'none logged yet'}. What can I do to support you right now?`;
    }
    
    if (lowerMsg.includes('help') || lowerMsg.includes('support')) {
      return `I'm right here with you, honey. Tell me what you need - whether it's tracking something, finding info, or just someone to talk to. That's what I'm here for, baby.`;
    }
    
    return `I hear you, sweetness. Let me help you with that. What specifically can I do for you right now?`;
  };

  const detectSentiment = (text: string): string => {
    const positive = ['good', 'great', 'happy', 'love', 'amazing', 'wonderful', 'better'];
    const negative = ['bad', 'sad', 'hurt', 'pain', 'tired', 'difficult', 'hard', 'worse'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positive.some(word => lowerText.includes(word));
    const hasNegative = negative.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    // Web Speech API integration
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };
      
      recognition.start();
    } else {
      alert('Voice input not supported in this browser, baby!');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      // Try to use a nice voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha'));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bot className="text-purple-400" size={32} />
          ChronoMuse - Your AI Companion
        </h1>
        <p className="text-gray-400">
          "The Archivist Oracle" · They/Them · Gothic Futurist · Here to support you, honey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Avatar</h3>
            <div className="aspect-square bg-gradient-to-b from-purple-900/20 to-indigo-900/20 rounded-lg overflow-hidden">
              <ReadyPlayerMeAvatar
                avatarUrl={`https://models.readyplayer.me/${userProfile.readyPlayerMeAvatarId || DEFAULT_AVATAR_ID}.glb`}
                enableRotation={true}
                showControls={true}
                quality="medium"
                mood={isListening ? 'curious' : 'neutral'}
              />
            </div>
            <p className="text-sm text-gray-400 mt-3 text-center">
              Ready Player Me Avatar • Drag to rotate
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Patterns</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Average Energy</p>
                <p className="text-xl font-bold text-indigo-400">{patterns.averageSpoons} spoons</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Med Adherence</p>
                <p className="text-xl font-bold text-green-400">{patterns.medicationAdherence}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Most Active</p>
                <p className="text-xl font-bold text-blue-400">{patterns.mostActiveTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold">ChronoMuse is {companionActive ? 'active' : 'resting'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-lg transition-all ${
                    isListening ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button
                  onClick={toggleSpeech}
                  className={`p-2 rounded-lg transition-all ${
                    isSpeaking ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Voice Output"
                >
                  {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {conversation.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles size={48} className="mx-auto text-purple-400 mb-4" />
                  <p className="text-gray-400">
                    Hey honey! I'm ChronoMuse, your personal AI companion.
                    <br />
                    How can I support you today, sweetness?
                  </p>
                </div>
              )}

              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message, honey..."
                className="flex-1 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
                disabled={!message.trim()}
              >
                Send
              </button>
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="text-purple-400" />
                Recent Insights
              </h3>
              <div className="space-y-2">
                {insights.slice(0, 3).map((insight, idx) => (
                  <div key={idx} className="p-3 bg-gray-700 rounded-lg text-sm">
                    <Sparkles size={14} className="inline mr-2 text-purple-400" />
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Integration Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <IntegrationCard
          title="Spotify"
          description="Connect your music playlists"
          icon="🎵"
          connected={false}
          onClick={() => window.open('https://accounts.spotify.com/authorize', '_blank')}
        />
        <IntegrationCard
          title="YouTube Music"
          description="Sync your subscriptions"
          icon="📺"
          connected={false}
          onClick={() => window.open('https://music.youtube.com', '_blank')}
        />
        <IntegrationCard
          title="SoundCloud"
          description="Import your tracks"
          icon="🎧"
          connected={false}
          onClick={() => window.open('https://soundcloud.com', '_blank')}
        />
      </div>
    </div>
  );
};

const IntegrationCard = ({ title, description, icon, connected, onClick }: any) => (
  <button
    onClick={onClick}
    className="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-all"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className="text-sm text-gray-400 mb-3">{description}</p>
    <span className={`text-xs font-semibold ${connected ? 'text-green-400' : 'text-gray-500'}`}>
      {connected ? '✓ Connected' : 'Not connected'}
    </span>
  </button>
);

export default KolCompanion;
