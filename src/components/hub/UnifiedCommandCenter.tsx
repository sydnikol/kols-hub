import React, { useState, useEffect } from 'react';
import { useAIIntegration, DOLL_PERSONALITIES } from '../../services/unified-ai-integration';

interface DollMessage {
  doll: string;
  message: string;
  timestamp: number;
  suggestions?: string[];
}

const UnifiedCommandCenter: React.FC = () => {
  const ai = useAIIntegration();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<DollMessage[]>([]);
  const [currentDoll, setCurrentDoll] = useState<keyof typeof DOLL_PERSONALITIES>('ember');
  const [digest, setDigest] = useState(ai.getDailyDigest());

  useEffect(() => {
    // Get initial recommendations
    const recs = ai.getRecommendations();
    setMessages([{
      doll: recs.doll.name,
      message: recs.greeting,
      timestamp: Date.now(),
      suggestions: recs.suggestions
    }]);

    // Subscribe to feature messages
    const unsubscribe = ai.subscribeToMessages('command-center', (data) => {
      setMessages(prev => [...prev, {
        doll: 'System',
        message: `Update from ${data.from}: ${JSON.stringify(data.data)}`,
        timestamp: data.timestamp
      }]);
    });

    // Update digest periodically
    const interval = setInterval(() => {
      setDigest(ai.getDailyDigest());
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Track the search
    ai.trackSearch(inputValue);

    // Get AI response
    const response = ai.generateAIResponse(inputValue);
    const bestDoll = ai.getBestDoll(inputValue);
    setCurrentDoll(bestDoll);

    // Track doll interaction
    ai.trackDollInteraction(bestDoll, inputValue);

    // Add messages
    setMessages(prev => [
      ...prev,
      { doll: 'You', message: inputValue, timestamp: Date.now() },
      { doll: DOLL_PERSONALITIES[bestDoll].name, message: response, timestamp: Date.now() + 1 }
    ]);

    setInputValue('');
  };

  const quickActions = [
    { label: '📚 Find Books', action: () => window.location.href = '/shadow-library' },
    { label: '📺 Watch Films', action: () => window.location.href = '/media-player' },
    { label: '🎮 Play Games', action: () => window.location.href = '/game-arcade' },
    { label: '🌐 Languages', action: () => window.location.href = '/language-learning' },
    { label: '✂️ Crafts', action: () => window.location.href = '/sewing-crafts' },
    { label: '💬 Chat', action: () => window.location.href = '/communication-hub' },
    { label: '📱 Apps', action: () => window.location.href = '/universal-apps' },
    { label: '🎓 Learn', action: () => window.location.href = '/openculture' }
  ];

  const doll = DOLL_PERSONALITIES[currentDoll];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center z-50 animate-pulse"
      >
        <span className="text-3xl">✨</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-2xl shadow-2xl shadow-purple-500/20 border border-purple-500/30 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-900 to-pink-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✨</span>
          <div>
            <h3 className="text-white font-bold">Kol's Hub Command Center</h3>
            <p className="text-purple-200 text-xs">All features connected</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Daily Digest */}
      <div className="p-3 bg-black/30 border-b border-purple-500/20">
        <div className="flex justify-between text-xs text-purple-200">
          <span>📊 Today: {digest.pagesVisited} pages</span>
          <span>🔍 {digest.searchesMade} searches</span>
          <span>📺 {digest.mediaConsumed} media</span>
        </div>
        {digest.topInterests.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {digest.topInterests.slice(0, 3).map((interest, i) => (
              <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                #{interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-purple-500/20 bg-black/20">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs rounded-full transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${msg.doll === 'You' ? 'ml-8' : 'mr-8'}`}
          >
            <div className={`p-3 rounded-lg ${
              msg.doll === 'You'
                ? 'bg-purple-600/30 text-purple-100'
                : 'bg-gray-800/80 text-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xs text-purple-300">{msg.doll}</span>
              </div>
              <p className="text-sm">{msg.message}</p>
              {msg.suggestions && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.suggestions.map((sug, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                      {sug}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Current Doll Indicator */}
      <div className="px-4 py-2 bg-black/30 border-t border-purple-500/20 flex items-center gap-2">
        <span className="text-2xl">
          {currentDoll === 'luna' ? '🌙' :
           currentDoll === 'aria' ? '🎨' :
           currentDoll === 'nova' ? '⚡' :
           currentDoll === 'sage' ? '📖' :
           currentDoll === 'ember' ? '🔥' :
           currentDoll === 'harmony' ? '💚' : '🗺️'}
        </span>
        <div>
          <p className="text-xs text-purple-200">{doll.name} - {doll.specialty}</p>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900/80 border-t border-purple-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything or search all features..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 text-sm focus:border-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnifiedCommandCenter;
