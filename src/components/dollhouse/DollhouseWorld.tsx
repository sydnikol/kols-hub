import React, { useState, useEffect, useCallback } from 'react';
import { useAIIntegration, DOLL_PERSONALITIES } from '../../services/unified-ai-integration';

// Dollhouse World State
interface DollState {
  id: string;
  name: string;
  currentRoom: string;
  mood: 'happy' | 'focused' | 'tired' | 'excited' | 'relaxed';
  activity: string;
  energy: number;
  lastInteraction: number;
}

interface RoomState {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  route: string;
  occupants: string[];
  ambiance: 'bright' | 'cozy' | 'mysterious' | 'energetic' | 'peaceful';
  events: { type: string; message: string; timestamp: number }[];
}

interface HouseholdEvent {
  id: string;
  type: 'activity' | 'message' | 'discovery' | 'achievement' | 'social';
  doll: string;
  room: string;
  message: string;
  timestamp: number;
}

// The 15 Rooms of the Dollhouse
const DOLLHOUSE_ROOMS: RoomState[] = [
  {
    id: 'library',
    name: 'The Grand Library',
    icon: '📚',
    description: 'Where Luna studies languages and Sage reads philosophy',
    features: ['Shadow Library Access', 'Language Learning', 'Research Papers'],
    route: '/shadow-library',
    occupants: [],
    ambiance: 'mysterious',
    events: []
  },
  {
    id: 'theater',
    name: 'The Velvet Theater',
    icon: '🎬',
    description: 'Ember\'s domain of films, shows, and entertainment',
    features: ['Media Player', 'Streaming', 'Classic Films'],
    route: '/media-player',
    occupants: [],
    ambiance: 'cozy',
    events: []
  },
  {
    id: 'arcade',
    name: 'The Game Parlor',
    icon: '🎮',
    description: 'Retro games and digital adventures',
    features: ['Retro Games', 'Emulators', 'Game Arcade'],
    route: '/game-arcade',
    occupants: [],
    ambiance: 'energetic',
    events: []
  },
  {
    id: 'studio',
    name: 'Aria\'s Art Studio',
    icon: '🎨',
    description: 'Creative workspace for crafts and design',
    features: ['Sewing Patterns', 'Art Tutorials', 'DIY Crafts'],
    route: '/sewing-crafts',
    occupants: [],
    ambiance: 'bright',
    events: []
  },
  {
    id: 'tech-lab',
    name: 'Nova\'s Tech Lab',
    icon: '⚡',
    description: 'Where Nova experiments with apps and code',
    features: ['Universal Apps', 'Coding Tools', 'AI Tools'],
    route: '/universal-apps',
    occupants: [],
    ambiance: 'energetic',
    events: []
  },
  {
    id: 'language-room',
    name: 'The Polyglot Parlor',
    icon: '🌐',
    description: 'Luna\'s favorite room for language practice',
    features: ['Flashcards', 'Language Apps', 'Translation'],
    route: '/language-learning',
    occupants: [],
    ambiance: 'peaceful',
    events: []
  },
  {
    id: 'wellness-garden',
    name: 'Harmony\'s Wellness Garden',
    icon: '🌿',
    description: 'A peaceful space for health and mindfulness',
    features: ['Health Tracking', 'Meditation', 'Fitness'],
    route: '/health',
    occupants: [],
    ambiance: 'peaceful',
    events: []
  },
  {
    id: 'finance-vault',
    name: 'Atlas\'s Treasury',
    icon: '💰',
    description: 'Where Atlas manages goals and finances',
    features: ['Budget Tracking', 'Goals', 'Investments'],
    route: '/finance',
    occupants: [],
    ambiance: 'mysterious',
    events: []
  },
  {
    id: 'communication-hub',
    name: 'The Social Salon',
    icon: '💬',
    description: 'Connect with the world from this elegant room',
    features: ['Discord', 'Zoom', 'Email', 'Chat'],
    route: '/communication-hub',
    occupants: [],
    ambiance: 'bright',
    events: []
  },
  {
    id: 'learning-hall',
    name: 'The Academy',
    icon: '🎓',
    description: 'Sage\'s classroom for free courses and education',
    features: ['OpenCulture', 'Free Courses', 'Tutorials'],
    route: '/openculture',
    occupants: [],
    ambiance: 'bright',
    events: []
  },
  {
    id: 'streaming-lounge',
    name: 'The Streaming Lounge',
    icon: '📺',
    description: 'Ember\'s cozy spot for binge-watching',
    features: ['Netflix', 'YouTube', 'Twitch', 'All Platforms'],
    route: '/streaming-full',
    occupants: [],
    ambiance: 'cozy',
    events: []
  },
  {
    id: 'wardrobe',
    name: 'The Wardrobe Palace',
    icon: '👗',
    description: 'Fashion and style headquarters',
    features: ['Doll Outfits', 'Fashion Ideas', 'Style Guide'],
    route: '/fashion',
    occupants: [],
    ambiance: 'bright',
    events: []
  },
  {
    id: 'kitchen',
    name: 'The Gothic Kitchen',
    icon: '🍳',
    description: 'Recipes, nutrition, and culinary arts',
    features: ['Recipes', 'Meal Planning', 'Nutrition'],
    route: '/cooking',
    occupants: [],
    ambiance: 'cozy',
    events: []
  },
  {
    id: 'spiritual-chamber',
    name: 'The Spiritual Chamber',
    icon: '🔮',
    description: 'Mystical practices and mindfulness',
    features: ['Hoodoo', 'Tarot', 'Dream Journal'],
    route: '/spirituality',
    occupants: [],
    ambiance: 'mysterious',
    events: []
  },
  {
    id: 'main-hall',
    name: 'The Grand Hall',
    icon: '🏛️',
    description: 'The heart of the dollhouse where everyone gathers',
    features: ['All Features', 'Dashboard', 'Quick Access'],
    route: '/',
    occupants: [],
    ambiance: 'bright',
    events: []
  }
];

// The 7 Dolls of the Sorority
const DOLLS: DollState[] = [
  { id: 'luna', name: 'Luna', currentRoom: 'language-room', mood: 'focused', activity: 'Studying Japanese', energy: 85, lastInteraction: Date.now() },
  { id: 'aria', name: 'Aria', currentRoom: 'studio', mood: 'happy', activity: 'Sketching designs', energy: 90, lastInteraction: Date.now() },
  { id: 'nova', name: 'Nova', currentRoom: 'tech-lab', mood: 'excited', activity: 'Testing new apps', energy: 95, lastInteraction: Date.now() },
  { id: 'sage', name: 'Sage', currentRoom: 'library', mood: 'relaxed', activity: 'Reading philosophy', energy: 75, lastInteraction: Date.now() },
  { id: 'ember', name: 'Ember', currentRoom: 'theater', mood: 'excited', activity: 'Watching films', energy: 80, lastInteraction: Date.now() },
  { id: 'harmony', name: 'Harmony', currentRoom: 'wellness-garden', mood: 'relaxed', activity: 'Meditating', energy: 88, lastInteraction: Date.now() },
  { id: 'atlas', name: 'Atlas', currentRoom: 'finance-vault', mood: 'focused', activity: 'Planning goals', energy: 82, lastInteraction: Date.now() }
];

const DollhouseWorld: React.FC = () => {
  const ai = useAIIntegration();
  const [dolls, setDolls] = useState<DollState[]>(DOLLS);
  const [rooms, setRooms] = useState<RoomState[]>(DOLLHOUSE_ROOMS);
  const [events, setEvents] = useState<HouseholdEvent[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDoll, setSelectedDoll] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Time-based activities
  const getTimeBasedActivity = useCallback((dollId: string, hour: number): string => {
    const activities: Record<string, Record<string, string>> = {
      luna: {
        morning: 'Practicing morning vocabulary',
        afternoon: 'Teaching a language lesson',
        evening: 'Watching foreign films',
        night: 'Reading bilingual books'
      },
      aria: {
        morning: 'Setting up her easel',
        afternoon: 'Working on a new project',
        evening: 'Browsing design inspiration',
        night: 'Sketching by candlelight'
      },
      nova: {
        morning: 'Checking tech news',
        afternoon: 'Coding a new feature',
        evening: 'Testing apps',
        night: 'Debugging code'
      },
      sage: {
        morning: 'Morning meditation',
        afternoon: 'Deep philosophical reading',
        evening: 'Writing research notes',
        night: 'Contemplating the universe'
      },
      ember: {
        morning: 'Curating playlists',
        afternoon: 'Streaming games',
        evening: 'Movie marathon time!',
        night: 'Late night horror films'
      },
      harmony: {
        morning: 'Sunrise yoga',
        afternoon: 'Preparing healthy meals',
        evening: 'Evening meditation',
        night: 'Sleep tracking setup'
      },
      atlas: {
        morning: 'Reviewing daily goals',
        afternoon: 'Budget planning',
        evening: 'Setting tomorrow\'s agenda',
        night: 'Reflecting on achievements'
      }
    };

    const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
    return activities[dollId]?.[period] || 'Relaxing';
  }, []);

  // Simulate doll movements and activities
  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();

      setDolls(prev => prev.map(doll => ({
        ...doll,
        activity: getTimeBasedActivity(doll.id, hour),
        energy: Math.max(20, Math.min(100, doll.energy + (hour >= 6 && hour < 22 ? 1 : -2))),
        mood: doll.energy > 70 ? 'happy' : doll.energy > 40 ? 'focused' : 'tired'
      })));

      setCurrentTime(new Date());

      // Random events
      if (Math.random() > 0.9) {
        const randomDoll = DOLLS[Math.floor(Math.random() * DOLLS.length)];
        const eventTypes = ['activity', 'discovery', 'social', 'achievement'];
        const eventMessages = [
          `${randomDoll.name} found something interesting!`,
          `${randomDoll.name} just finished a task.`,
          `${randomDoll.name} is chatting with friends.`,
          `${randomDoll.name} unlocked a new achievement!`
        ];

        setEvents(prev => [{
          id: `event-${Date.now()}`,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)] as any,
          doll: randomDoll.name,
          room: randomDoll.currentRoom,
          message: eventMessages[Math.floor(Math.random() * eventMessages.length)],
          timestamp: Date.now()
        }, ...prev.slice(0, 9)]);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getTimeBasedActivity]);

  // Update room occupants based on doll positions
  useEffect(() => {
    setRooms(prev => prev.map(room => ({
      ...room,
      occupants: dolls.filter(d => d.currentRoom === room.id).map(d => d.id)
    })));
  }, [dolls]);

  const moveDoll = (dollId: string, roomId: string) => {
    setDolls(prev => prev.map(doll =>
      doll.id === dollId
        ? { ...doll, currentRoom: roomId, lastInteraction: Date.now() }
        : doll
    ));

    ai.trackDollInteraction(dollId, `Moved to ${roomId}`);

    setEvents(prev => [{
      id: `event-${Date.now()}`,
      type: 'activity',
      doll: dolls.find(d => d.id === dollId)?.name || '',
      room: roomId,
      message: `${dolls.find(d => d.id === dollId)?.name} moved to ${rooms.find(r => r.id === roomId)?.name}`,
      timestamp: Date.now()
    }, ...prev.slice(0, 9)]);
  };

  const visitRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      ai.trackPageVisit(room.route);
      window.location.href = room.route;
    }
  };

  const interactWithDoll = (dollId: string) => {
    const doll = dolls.find(d => d.id === dollId);
    if (doll) {
      ai.trackDollInteraction(dollId, 'Conversation started');
      setSelectedDoll(dollId);
    }
  };

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '☀️ Good Morning';
    if (hour < 17) return '🌤️ Good Afternoon';
    if (hour < 21) return '🌅 Good Evening';
    return '🌙 Good Night';
  };

  const getDollEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'focused': return '🎯';
      case 'tired': return '😴';
      case 'excited': return '🤩';
      case 'relaxed': return '😌';
      default: return '😊';
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed top-20 left-6 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-purple-500/50 transition-all z-40 flex items-center gap-2"
      >
        <span className="text-xl">🏠</span>
        <span className="hidden md:inline">Enter Dollhouse</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{dolls.length} dolls</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 p-4 border-b border-purple-500/30 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏠</span>
            <div>
              <h1 className="text-2xl font-bold text-white">The Gothic Dollhouse</h1>
              <p className="text-purple-200 text-sm">{getTimeGreeting()} · {currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{rooms.length}</div>
              <div className="text-xs text-gray-400">Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-300">{dolls.length}</div>
              <div className="text-xs text-gray-400">Dolls</div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Dolls Status Bar */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>👸</span> The Sorority · Current Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {dolls.map(doll => (
              <button
                key={doll.id}
                onClick={() => interactWithDoll(doll.id)}
                className={`p-3 rounded-lg transition-all ${
                  selectedDoll === doll.id
                    ? 'bg-purple-600 border-purple-400'
                    : 'bg-gray-800/80 hover:bg-gray-700/80 border-purple-500/20'
                } border`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{getDollEmoji(doll.mood)}</span>
                  <span className="text-xs text-gray-400">{doll.energy}%</span>
                </div>
                <h4 className="text-white font-medium text-sm">{doll.name}</h4>
                <p className="text-xs text-gray-400 truncate">{doll.activity}</p>
                <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${doll.energy}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid - Rooms */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {rooms.map(room => (
            <div
              key={room.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedRoom === room.id
                  ? 'bg-purple-900/50 border-purple-400 shadow-lg shadow-purple-500/20'
                  : 'bg-gray-900/80 border-purple-500/20 hover:border-purple-500/40'
              }`}
              onClick={() => setSelectedRoom(room.id === selectedRoom ? null : room.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{room.icon}</span>
                {room.occupants.length > 0 && (
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                    {room.occupants.length} 👸
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{room.name}</h3>
              <p className="text-gray-400 text-xs mb-2 line-clamp-2">{room.description}</p>

              {/* Room Occupants */}
              {room.occupants.length > 0 && (
                <div className="flex gap-1 mb-2">
                  {room.occupants.map(dollId => {
                    const doll = dolls.find(d => d.id === dollId);
                    return doll ? (
                      <span key={dollId} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        {doll.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); visitRoom(room.id); }}
                className="w-full px-3 py-1.5 bg-purple-600/50 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors"
              >
                Enter Room →
              </button>
            </div>
          ))}
        </div>

        {/* Selected Room Details */}
        {selectedRoom && (
          <div className="mb-6 p-6 bg-gradient-to-br from-gray-900 to-purple-900/30 rounded-xl border border-purple-500/30">
            {(() => {
              const room = rooms.find(r => r.id === selectedRoom);
              if (!room) return null;
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{room.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{room.name}</h2>
                        <p className="text-purple-300">{room.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => visitRoom(room.id)}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                    >
                      Enter Room →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-black/30 rounded-lg">
                      <h4 className="text-gray-400 text-xs mb-1">Ambiance</h4>
                      <p className="text-white capitalize">{room.ambiance}</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg">
                      <h4 className="text-gray-400 text-xs mb-1">Occupants</h4>
                      <p className="text-white">{room.occupants.length} dolls</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded-lg col-span-2">
                      <h4 className="text-gray-400 text-xs mb-1">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {room.features.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Move Doll to Room */}
                  <div className="p-4 bg-black/20 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Move a doll here:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dolls.filter(d => d.currentRoom !== room.id).map(doll => (
                        <button
                          key={doll.id}
                          onClick={() => moveDoll(doll.id, room.id)}
                          className="px-3 py-1.5 bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 text-sm rounded-lg transition-colors"
                        >
                          {doll.name} ({rooms.find(r => r.id === doll.currentRoom)?.name})
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Recent Events Feed */}
        <div className="p-4 bg-gray-900/80 rounded-xl border border-purple-500/20">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>📜</span> Household Activity
          </h2>
          {events.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent activity. The dolls are settling in...</p>
          ) : (
            <div className="space-y-2">
              {events.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2 bg-black/30 rounded-lg">
                  <span className="text-xl">
                    {event.type === 'activity' ? '⚡' :
                     event.type === 'discovery' ? '✨' :
                     event.type === 'social' ? '💬' :
                     event.type === 'achievement' ? '🏆' : '📌'}
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{event.message}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DollhouseWorld;
