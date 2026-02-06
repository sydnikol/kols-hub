/**
 * Interactive AI Doll Guide System
 * ==================================
 * AI-powered dolls that guide, suggest, and interact with users
 * Each doll is a specialist in different areas - like a sorority of knowledge
 */

import React, { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface DollCharacter {
  id: string;
  name: string;
  avatar: string;
  role: string;
  specialty: string[];
  personality: string;
  greeting: string;
  color: string;
  bgGradient: string;
}

export interface DollMessage {
  id: string;
  dollId: string;
  message: string;
  type: 'greeting' | 'suggestion' | 'tip' | 'encouragement' | 'resource';
  resourceLink?: string;
  timestamp: Date;
}

export interface UserActivity {
  type: string;
  area: string;
  timestamp: Date;
  duration?: number;
}

interface DollGuideSystemProps {
  currentActivity?: string;
  currentArea?: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

// ============================================================================
// DOLL CHARACTERS - THE SORORITY OF KNOWLEDGE
// ============================================================================

export const DOLL_CHARACTERS: DollCharacter[] = [
  {
    id: 'luna',
    name: 'Luna',
    avatar: '🌙',
    role: 'Head of Languages & Culture',
    specialty: ['languages', 'culture', 'travel', 'communication'],
    personality: 'Curious and worldly, Luna speaks 12 languages and loves connecting people across cultures.',
    greeting: "こんにちは! Bonjour! Hello! I'm Luna, your language learning guide. What would you like to explore today?",
    color: 'purple',
    bgGradient: 'from-purple-900 to-indigo-900'
  },
  {
    id: 'aria',
    name: 'Aria',
    avatar: '🎨',
    role: 'Creative Arts Director',
    specialty: ['art', 'design', 'music', 'crafts', 'sewing'],
    personality: 'Expressive and imaginative, Aria sees art in everything and loves helping others discover their creative voice.',
    greeting: "Welcome to the creative space! I'm Aria, and I'm here to help you express yourself through art, music, and crafts.",
    color: 'pink',
    bgGradient: 'from-pink-900 to-rose-900'
  },
  {
    id: 'nova',
    name: 'Nova',
    avatar: '⭐',
    role: 'Science & Technology Lead',
    specialty: ['science', 'technology', 'coding', 'gaming', 'math'],
    personality: 'Analytical yet approachable, Nova makes complex topics fun and accessible.',
    greeting: "Hey there, future innovator! I'm Nova. Ready to explore the fascinating world of science and tech?",
    color: 'cyan',
    bgGradient: 'from-cyan-900 to-blue-900'
  },
  {
    id: 'sage',
    name: 'Sage',
    avatar: '📚',
    role: 'Wisdom & Knowledge Keeper',
    specialty: ['philosophy', 'history', 'literature', 'self-improvement'],
    personality: 'Thoughtful and wise, Sage helps you find deeper meaning and understanding.',
    greeting: "Greetings, seeker of knowledge. I'm Sage. Let's explore the great questions together.",
    color: 'emerald',
    bgGradient: 'from-emerald-900 to-green-900'
  },
  {
    id: 'ember',
    name: 'Ember',
    avatar: '🔥',
    role: 'Entertainment & Fun Director',
    specialty: ['movies', 'anime', 'games', 'streaming', 'entertainment'],
    personality: 'Energetic and fun-loving, Ember knows every show, movie, and game worth your time.',
    greeting: "What's up! I'm Ember, your entertainment guru. Let's find something amazing to watch or play!",
    color: 'orange',
    bgGradient: 'from-orange-900 to-red-900'
  },
  {
    id: 'harmony',
    name: 'Harmony',
    avatar: '💜',
    role: 'Wellness & Self-Care Guide',
    specialty: ['health', 'wellness', 'meditation', 'fitness', 'mental-health'],
    personality: 'Calm and nurturing, Harmony helps you find balance in body and mind.',
    greeting: "Hello, beautiful soul. I'm Harmony. Let's take care of you today - mind, body, and spirit.",
    color: 'violet',
    bgGradient: 'from-violet-900 to-purple-900'
  },
  {
    id: 'atlas',
    name: 'Atlas',
    avatar: '🗺️',
    role: 'Life Skills & Finance Advisor',
    specialty: ['finance', 'career', 'life-skills', 'cooking', 'productivity'],
    personality: 'Practical and encouraging, Atlas helps you navigate real-world challenges.',
    greeting: "Hey there! I'm Atlas. Whether it's budgeting, cooking, or career planning - I've got your back!",
    color: 'amber',
    bgGradient: 'from-amber-900 to-yellow-900'
  }
];

// ============================================================================
// SUGGESTION ENGINE
// ============================================================================

const generateSuggestions = (
  activity: string,
  area: string,
  timeOfDay: string
): { doll: DollCharacter; message: string; resourceLink?: string }[] => {
  const suggestions: { doll: DollCharacter; message: string; resourceLink?: string }[] = [];

  // Find relevant dolls based on activity
  const dolls = DOLL_CHARACTERS;

  // Morning suggestions
  if (timeOfDay === 'morning') {
    const sage = dolls.find(d => d.id === 'sage')!;
    suggestions.push({
      doll: sage,
      message: "Good morning! Starting the day with learning is a wonderful habit. Perhaps some philosophy or a thoughtful article?",
      resourceLink: '/learning'
    });
  }

  // Activity-based suggestions
  if (area === 'entertainment') {
    const ember = dolls.find(d => d.id === 'ember')!;
    suggestions.push({
      doll: ember,
      message: "I see you're in the entertainment zone! Have you checked out the new anime recommendations? Or maybe some retro games?",
      resourceLink: '/living-room'
    });
  }

  if (area === 'art' || area === 'sewing') {
    const aria = dolls.find(d => d.id === 'aria')!;
    suggestions.push({
      doll: aria,
      message: "Feeling creative? I found some amazing free sewing patterns and art tutorials you might love!",
      resourceLink: '/sewing-studio'
    });
  }

  if (area === 'languages') {
    const luna = dolls.find(d => d.id === 'luna')!;
    suggestions.push({
      doll: luna,
      message: "継続は力なり (Keizoku wa chikara nari) - Persistence is power! Keep up your language studies. Have you tried flashcards today?",
      resourceLink: '/language-learning'
    });
  }

  if (area === 'gaming') {
    const nova = dolls.find(d => d.id === 'nova')!;
    suggestions.push({
      doll: nova,
      message: "Gaming can be a great way to learn! Want to try some game development with Godot or Phaser? It's easier than you think!",
      resourceLink: '/gaming-hub'
    });
  }

  // Always include a wellness check
  const harmony = dolls.find(d => d.id === 'harmony')!;
  if (Math.random() > 0.7) {
    suggestions.push({
      doll: harmony,
      message: "Remember to take breaks! How about a quick stretch or some deep breaths? Your well-being matters. 💜",
      resourceLink: '/wellness'
    });
  }

  return suggestions;
};

// ============================================================================
// DOLL MESSAGE BUBBLE
// ============================================================================

const DollMessageBubble: React.FC<{
  doll: DollCharacter;
  message: string;
  resourceLink?: string;
  onNavigate?: (path: string) => void;
  onDismiss: () => void;
}> = ({ doll, message, resourceLink, onNavigate, onDismiss }) => (
  <div className={`bg-gradient-to-r ${doll.bgGradient} rounded-2xl p-4 border border-${doll.color}-500/50 shadow-lg max-w-md animate-fade-in`}>
    <div className="flex items-start gap-3">
      <div className="text-4xl">{doll.avatar}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-white">{doll.name}</div>
            <div className="text-xs text-gray-300">{doll.role}</div>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-200 mt-2 text-sm">{message}</p>
        {resourceLink && (
          <button
            onClick={() => onNavigate?.(resourceLink)}
            className={`mt-3 text-xs bg-${doll.color}-600 hover:bg-${doll.color}-700 text-white px-3 py-1.5 rounded-lg transition-colors`}
          >
            Take me there →
          </button>
        )}
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const DollGuideSystem: React.FC<DollGuideSystemProps> = ({
  currentActivity = '',
  currentArea = '',
  onNavigate,
  className = ''
}) => {
  const [activeDoll, setActiveDoll] = useState<DollCharacter | null>(null);
  const [messages, setMessages] = useState<DollMessage[]>([]);
  const [showDollPanel, setShowDollPanel] = useState(false);
  const [selectedDoll, setSelectedDoll] = useState<DollCharacter | null>(null);
  const [suggestions, setSuggestions] = useState<{ doll: DollCharacter; message: string; resourceLink?: string }[]>([]);

  // Get time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Generate suggestions when activity/area changes
  useEffect(() => {
    const newSuggestions = generateSuggestions(currentActivity, currentArea, getTimeOfDay());
    setSuggestions(newSuggestions);
  }, [currentActivity, currentArea]);

  // Show random doll greeting on mount
  useEffect(() => {
    const randomDoll = DOLL_CHARACTERS[Math.floor(Math.random() * DOLL_CHARACTERS.length)];
    setActiveDoll(randomDoll);

    const timer = setTimeout(() => {
      setMessages([{
        id: 'welcome',
        dollId: randomDoll.id,
        message: randomDoll.greeting,
        type: 'greeting',
        timestamp: new Date()
      }]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const dismissMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const selectDoll = (doll: DollCharacter) => {
    setSelectedDoll(doll);
    setMessages([{
      id: `chat-${Date.now()}`,
      dollId: doll.id,
      message: doll.greeting,
      type: 'greeting',
      timestamp: new Date()
    }]);
  };

  return (
    <div className={className}>
      {/* Floating Assistant Button */}
      <button
        onClick={() => setShowDollPanel(!showDollPanel)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600
                   shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center
                   border-2 border-white/20"
      >
        <span className="text-3xl">{activeDoll?.avatar || '✨'}</span>
      </button>

      {/* Active Messages */}
      <div className="fixed bottom-24 right-6 z-50 space-y-4">
        {messages.map(msg => {
          const doll = DOLL_CHARACTERS.find(d => d.id === msg.dollId);
          if (!doll) return null;
          return (
            <DollMessageBubble
              key={msg.id}
              doll={doll}
              message={msg.message}
              onNavigate={onNavigate}
              onDismiss={() => dismissMessage(msg.id)}
            />
          );
        })}
      </div>

      {/* Doll Panel */}
      {showDollPanel && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-purple-500/30 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-200">✨ The Sorority of Knowledge</h2>
              <button
                onClick={() => setShowDollPanel(false)}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-400 mb-6">
              Meet your personal guides! Each doll specializes in different areas and is here to help you learn, create, and grow.
              Click on any doll to chat with them.
            </p>

            {/* Doll Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {DOLL_CHARACTERS.map(doll => (
                <button
                  key={doll.id}
                  onClick={() => selectDoll(doll)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${doll.bgGradient}
                             border border-white/10 hover:border-white/30 transition-all hover:scale-105
                             ${selectedDoll?.id === doll.id ? 'ring-2 ring-white' : ''}`}
                >
                  <span className="text-5xl">{doll.avatar}</span>
                  <div className="text-center">
                    <div className="font-bold text-white">{doll.name}</div>
                    <div className="text-xs text-gray-300">{doll.role}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Doll Chat */}
            {selectedDoll && (
              <div className={`bg-gradient-to-r ${selectedDoll.bgGradient} rounded-xl p-6 border border-white/10`}>
                <div className="flex items-start gap-4">
                  <span className="text-6xl">{selectedDoll.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-white">{selectedDoll.name}</span>
                      <span className="text-sm text-gray-300">• {selectedDoll.role}</span>
                    </div>
                    <p className="text-gray-200 mb-4">{selectedDoll.personality}</p>

                    <div className="bg-black/20 rounded-lg p-4 mb-4">
                      <p className="text-white italic">"{messages.find(m => m.dollId === selectedDoll.id)?.message || selectedDoll.greeting}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-300">Specialties:</span>
                      {selectedDoll.specialty.map((s, i) => (
                        <span key={i} className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">💡 Suggestions for You</h3>
                <div className="space-y-3">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${s.doll.bgGradient} border border-white/10`}
                    >
                      <span className="text-3xl">{s.doll.avatar}</span>
                      <div className="flex-1">
                        <span className="font-medium text-white">{s.doll.name}:</span>
                        <span className="text-gray-200 ml-2">{s.message}</span>
                      </div>
                      {s.resourceLink && (
                        <button
                          onClick={() => {
                            onNavigate?.(s.resourceLink!);
                            setShowDollPanel(false);
                          }}
                          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Go →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DollGuideSystem;
