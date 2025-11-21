import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Heart, Dice1, Play, Video, MessageCircle, Sparkles,
  Calendar, Clock, Zap, Battery, Star, Plus, Filter, Search,
  Award, TrendingUp, Shield, Target, BookOpen, Coffee, Moon,
  Sun, Wifi, WifiOff, UserPlus, Settings, Gift, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CoopGame {
  id: string;
  title: string;
  type: 'board' | 'card' | 'dice' | 'party' | 'rpg' | 'cooperative';
  players: string; // "2-4" or "1-6"
  playTime: string; // "30-60min"
  spoonLevel: 1 | 2 | 3 | 4 | 5; // Energy requirement (1 = lowest)
  remotePlayReady: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  goodFor: string[]; // ["date night", "low energy", "family"]
  setupTime: number; // minutes
  teachingTime: number; // minutes
  favorited: boolean;
  lastPlayed?: string;
  timesPlayed: number;
  rating?: number; // 1-5
  notes: string;
  availableOn: string[]; // ["Tabletop Simulator", "Board Game Arena", "Physical"]
}

interface CoopSession {
  id: string;
  gameTitle: string;
  date: string;
  players: string[];
  spoonUsed: number; // 1-5
  duration: number;
  remote: boolean;
  enjoyment: number; // 1-5
  winner?: string;
  highlights: string;
  photos: string[];
}

interface CoopEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  gameOptions: string[];
  attendees: string[];
  remote: boolean;
  spoonLevel: number;
  food: string;
  notes: string;
  rsvps: { name: string; status: 'yes' | 'maybe' | 'no' }[];
}

export default function KollectivePage() {
  const [activeTab, setActiveTab] = useState<'games' | 'sessions' | 'events' | 'remote-lobby'>('games');
  const [games, setGames] = useState<CoopGame[]>([]);
  const [sessions, setSessions] = useState<CoopSession[]>([]);
  const [events, setEvents] = useState<CoopEvent[]>([]);
  const [filterSpoonLevel, setFilterSpoonLevel] = useState<number | null>(null);
  const [filterRemote, setFilterRemote] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGame, setShowAddGame] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedGames = localStorage.getItem('kollectiveGames');
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    } else {
      // Seed with default cooperative games
      setGames(defaultCoopGames);
    }

    const savedSessions = localStorage.getItem('kollectiveSessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));

    const savedEvents = localStorage.getItem('kollectiveEvents');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  // Save data to localStorage
  useEffect(() => { localStorage.setItem('kollectiveGames', JSON.stringify(games)); }, [games]);
  useEffect(() => { localStorage.setItem('kollectiveSessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('kollectiveEvents', JSON.stringify(events)); }, [events]);

  // Filtered games based on spoon level and remote play
  const filteredGames = games.filter(game => {
    const matchesSpoon = filterSpoonLevel ? game.spoonLevel <= filterSpoonLevel : true;
    const matchesRemote = filterRemote !== null ? game.remotePlayReady === filterRemote : true;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpoon && matchesRemote && matchesSearch;
  });

  const stats = {
    totalGames: games.length,
    remoteFriendly: games.filter(g => g.remotePlayReady).length,
    lowSpoonGames: games.filter(g => g.spoonLevel <= 2).length,
    favorites: games.filter(g => g.favorited).length,
    sessionsPlayed: sessions.length,
    upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length
  };

  const addGame = (game: Partial<CoopGame>) => {
    const newGame: CoopGame = {
      id: Date.now().toString(),
      title: game.title || 'New Game',
      type: game.type || 'cooperative',
      players: game.players || '2-4',
      playTime: game.playTime || '30-60min',
      spoonLevel: game.spoonLevel || 3,
      remotePlayReady: game.remotePlayReady || false,
      difficulty: game.difficulty || 'medium',
      description: game.description || '',
      goodFor: game.goodFor || [],
      setupTime: game.setupTime || 5,
      teachingTime: game.teachingTime || 10,
      favorited: false,
      timesPlayed: 0,
      notes: '',
      availableOn: game.availableOn || ['Physical']
    };
    setGames([...games, newGame]);
    toast.success(`${newGame.title} added!`);
    setShowAddGame(false);
  };

  const toggleFavorite = (gameId: string) => {
    setGames(games.map(g => g.id === gameId ? { ...g, favorited: !g.favorited } : g));
  };

  const logSession = (session: Partial<CoopSession>) => {
    const newSession: CoopSession = {
      id: Date.now().toString(),
      gameTitle: session.gameTitle || '',
      date: session.date || new Date().toISOString().split('T')[0],
      players: session.players || [],
      spoonUsed: session.spoonUsed || 3,
      duration: session.duration || 60,
      remote: session.remote || false,
      enjoyment: session.enjoyment || 5,
      highlights: session.highlights || '',
      photos: session.photos || []
    };
    setSessions([newSession, ...sessions]);

    // Update game play count
    setGames(games.map(g =>
      g.title === newSession.gameTitle
        ? { ...g, timesPlayed: g.timesPlayed + 1, lastPlayed: newSession.date }
        : g
    ));

    toast.success('Session logged! ');
  };

  const createEvent = () => {
    const newEvent: CoopEvent = {
      id: Date.now().toString(),
      title: 'Game Night',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      gameOptions: [],
      attendees: [],
      remote: false,
      spoonLevel: 3,
      food: 'Pizza & Snacks',
      notes: '',
      rsvps: []
    };
    setEvents([...events, newEvent]);
    toast.success('Event created!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-indigo-950/80 border-b border-fuchsia-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Dice1 className="w-10 h-10 text-fuchsia-400" />
                The Kollective
              </h1>
              <p className="text-indigo-200">Cozy co-op gaming lounge • Spoon-based • Remote-ready</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddGame(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg hover:from-fuchsia-500 hover:to-purple-500 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Game
              </button>
              <button
                onClick={createEvent}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                <Calendar className="w-4 h-4" />
                Plan Event
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            <StatCard icon={Dice1} label="Games" value={stats.totalGames} />
            <StatCard icon={Wifi} label="Remote" value={stats.remoteFriendly} />
            <StatCard icon={Battery} label="Low Spoon" value={stats.lowSpoonGames} />
            <StatCard icon={Heart} label="Favorites" value={stats.favorites} />
            <StatCard icon={Play} label="Sessions" value={stats.sessionsPlayed} />
            <StatCard icon={Calendar} label="Upcoming" value={stats.upcomingEvents} />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'games', label: 'Game Library', icon: Dice1 },
              { id: 'sessions', label: 'Play History', icon: Play },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'remote-lobby', label: 'Remote Lobby', icon: Video }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600'
                    : 'bg-indigo-900/40 hover:bg-indigo-900/60'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GamesLibrary
                games={filteredGames}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterSpoonLevel={filterSpoonLevel}
                onFilterSpoonChange={setFilterSpoonLevel}
                filterRemote={filterRemote}
                onFilterRemoteChange={setFilterRemote}
                onToggleFavorite={toggleFavorite}
                onLogSession={logSession}
              />
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SessionHistory sessions={sessions} onLogNew={logSession} />
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EventsPlanner events={events} setEvents={setEvents} games={games} />
            </motion.div>
          )}

          {activeTab === 'remote-lobby' && (
            <motion.div
              key="remote-lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RemoteLobby games={games.filter(g => g.remotePlayReady)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Game Modal */}
      {showAddGame && (
        <AddGameModal onClose={() => setShowAddGame(false)} onAdd={addGame} />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-fuchsia-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-fuchsia-400" />
        <span className="text-xs text-indigo-200">{label}</span>
      </div>
      <div className="text-2xl font-bold text-fuchsia-300">{value}</div>
    </div>
  );
}

// Games Library Component
function GamesLibrary({
  games,
  searchQuery,
  onSearchChange,
  filterSpoonLevel,
  onFilterSpoonChange,
  filterRemote,
  onFilterRemoteChange,
  onToggleFavorite,
  onLogSession
}: {
  games: CoopGame[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterSpoonLevel: number | null;
  onFilterSpoonChange: (level: number | null) => void;
  filterRemote: boolean | null;
  onFilterRemoteChange: (remote: boolean | null) => void;
  onToggleFavorite: (id: string) => void;
  onLogSession: (session: Partial<CoopSession>) => void;
}) {
  return (
    <div>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-indigo-900/40 border border-fuchsia-500/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>

        {/* Spoon Level Filter */}
        <div className="flex items-center gap-3">
          <Battery className="w-5 h-5 text-fuchsia-400" />
          <span className="text-sm text-indigo-200">Energy Level:</span>
          <div className="flex gap-2">
            {[null, 1, 2, 3, 4, 5].map(level => (
              <button
                key={level || 'all'}
                onClick={() => onFilterSpoonChange(level)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filterSpoonLevel === level
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600'
                    : 'bg-indigo-900/40 hover:bg-indigo-900/60'
                }`}
              >
                {level || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Remote Filter */}
        <div className="flex items-center gap-3">
          <Wifi className="w-5 h-5 text-fuchsia-400" />
          <span className="text-sm text-indigo-200">Remote Play:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterRemoteChange(null)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterRemote === null ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600' : 'bg-indigo-900/40'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterRemoteChange(true)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterRemote === true ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600' : 'bg-indigo-900/40'
              }`}
            >
              Remote Ready
            </button>
            <button
              onClick={() => onFilterRemoteChange(false)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filterRemote === false ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600' : 'bg-indigo-900/40'
              }`}
            >
              In-Person
            </button>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onToggleFavorite={() => onToggleFavorite(game.id)}
            onQuickPlay={() => onLogSession({ gameTitle: game.title, enjoyment: 5, spoonUsed: game.spoonLevel })}
          />
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-20">
          <Dice1 className="w-16 h-16 text-fuchsia-400/30 mx-auto mb-4" />
          <p className="text-indigo-300">No games match your filters</p>
        </div>
      )}
    </div>
  );
}

// Game Card Component
function GameCard({ game, onToggleFavorite, onQuickPlay }: { game: CoopGame; onToggleFavorite: () => void; onQuickPlay: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-fuchsia-500/20 rounded-lg p-6 hover:border-fuchsia-500/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-fuchsia-200 mb-1">{game.title}</h3>
          <div className="flex items-center gap-2 text-xs text-indigo-300">
            <Users className="w-3 h-3" /> {game.players} players
            <Clock className="w-3 h-3 ml-2" /> {game.playTime}
          </div>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full transition-all ${
            game.favorited ? 'bg-fuchsia-600' : 'bg-indigo-900/40 hover:bg-indigo-900/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${game.favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      <p className="text-sm text-indigo-200 mb-4">{game.description}</p>

      {/* Spoon Level */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Battery className="w-4 h-4 text-fuchsia-400" />
          <span className="text-xs text-indigo-300">Energy Requirement:</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className={`h-2 flex-1 rounded ${
                level <= game.spoonLevel ? 'bg-fuchsia-500' : 'bg-indigo-900/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded text-xs ${
          game.remotePlayReady ? 'bg-green-900/40 border border-green-500/30 text-green-300' : 'bg-gray-900/40 border border-gray-500/30 text-gray-300'
        }`}>
          {game.remotePlayReady ? <Wifi className="w-3 h-3 inline mr-1" /> : <WifiOff className="w-3 h-3 inline mr-1" />}
          {game.remotePlayReady ? 'Remote Ready' : 'In-Person'}
        </span>
        <span className="px-2 py-1 rounded text-xs bg-purple-900/40 border border-purple-500/30 text-purple-300">
          {game.difficulty}
        </span>
        {game.goodFor.map((tag, idx) => (
          <span key={idx} className="px-2 py-1 rounded text-xs bg-indigo-900/40 border border-indigo-500/30 text-indigo-300">
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-indigo-300 mb-4">
        <span>Played {game.timesPlayed}x</span>
        {game.lastPlayed && <span>Last: {new Date(game.lastPlayed).toLocaleDateString()}</span>}
      </div>

      {/* Actions */}
      <button
        onClick={onQuickPlay}
        className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-lg py-2 flex items-center justify-center gap-2 transition-all"
      >
        <Play className="w-4 h-4" />
        Quick Play Log
      </button>
    </motion.div>
  );
}

// Session History Component
function SessionHistory({ sessions, onLogNew }: { sessions: CoopSession[]; onLogNew: (s: Partial<CoopSession>) => void }) {
  const [showLogForm, setShowLogForm] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-fuchsia-300">Play History</h2>
        <button
          onClick={() => setShowLogForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg hover:from-fuchsia-500 hover:to-purple-500"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Log Session
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map(session => (
          <div
            key={session.id}
            className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-fuchsia-500/20 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-fuchsia-200">{session.gameTitle}</h3>
                <p className="text-sm text-indigo-300">
                  {new Date(session.date).toLocaleDateString()} • {session.duration}min • {session.remote ? 'Remote' : 'In-Person'}
                </p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= session.enjoyment ? 'fill-yellow-400 text-yellow-400' : 'text-indigo-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {session.players.map((player, idx) => (
                <span key={idx} className="px-2 py-1 bg-indigo-900/40 border border-indigo-500/30 rounded text-xs text-indigo-300">
                  {player}
                </span>
              ))}
            </div>

            {session.highlights && (
              <p className="text-sm text-indigo-200 italic">&quot;{session.highlights}&quot;</p>
            )}
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-20">
          <Play className="w-16 h-16 text-fuchsia-400/30 mx-auto mb-4" />
          <p className="text-indigo-300">No sessions logged yet. Start playing!</p>
        </div>
      )}
    </div>
  );
}

// Events Planner Component
function EventsPlanner({ events, setEvents, games }: { events: CoopEvent[]; setEvents: (e: CoopEvent[]) => void; games: CoopGame[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-fuchsia-300 mb-6">Game Nights & Events</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map(event => (
          <div
            key={event.id}
            className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-fuchsia-500/20 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-fuchsia-200 mb-4">{event.title}</h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-indigo-200">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </div>

              <div className="flex items-center gap-3 text-indigo-200">
                {event.remote ? <Wifi className="w-4 h-4 text-green-400" /> : <Users className="w-4 h-4 text-purple-400" />}
                {event.remote ? 'Remote Event' : 'In-Person Event'}
              </div>

              <div className="flex items-center gap-3 text-indigo-200">
                <Coffee className="w-4 h-4 text-fuchsia-400" />
                {event.food || 'BYOB'}
              </div>
            </div>

            {event.gameOptions.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-indigo-300 mb-2">Game Options:</p>
                <div className="flex flex-wrap gap-2">
                  {event.gameOptions.map((game, idx) => (
                    <span key={idx} className="px-2 py-1 bg-fuchsia-900/40 border border-fuchsia-500/30 rounded text-xs text-fuchsia-300">
                      {game}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.rsvps.length > 0 && (
              <div>
                <p className="text-sm text-indigo-300 mb-2">RSVPs: {event.rsvps.filter(r => r.status === 'yes').length}/{event.rsvps.length}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-fuchsia-400/30 mx-auto mb-4" />
          <p className="text-indigo-300">No events planned. Create your first game night!</p>
        </div>
      )}
    </div>
  );
}

// Remote Lobby Component
function RemoteLobby({ games }: { games: CoopGame[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-fuchsia-300 mb-6">Remote Play Lobby</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-fuchsia-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-fuchsia-200 mb-4 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Call
          </h3>
          <p className="text-sm text-indigo-200 mb-4">Start a video call for your game session</p>
          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg py-3 flex items-center justify-center gap-2">
            <Video className="w-4 h-4" />
            Start Video Call
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-fuchsia-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-fuchsia-200 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Group Chat
          </h3>
          <p className="text-sm text-indigo-200 mb-4">Chat with your gaming group</p>
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg py-3 flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Open Chat
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-fuchsia-300 mb-4">Remote-Ready Games ({games.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map(game => (
          <div
            key={game.id}
            className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-fuchsia-500/20 rounded-lg p-4"
          >
            <h4 className="font-bold text-fuchsia-200 mb-2">{game.title}</h4>
            <div className="text-xs text-indigo-300 space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" /> {game.players}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" /> {game.playTime}
              </div>
            </div>
            <div className="space-y-1">
              {game.availableOn.map((platform, idx) => (
                <div key={idx} className="text-xs px-2 py-1 bg-green-900/40 border border-green-500/30 rounded text-green-300">
                  {platform}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add Game Modal Component
function AddGameModal({ onClose, onAdd }: { onClose: () => void; onAdd: (game: Partial<CoopGame>) => void }) {
  const [formData, setFormData] = useState<Partial<CoopGame>>({
    title: '',
    type: 'cooperative',
    players: '2-4',
    playTime: '30-60min',
    spoonLevel: 3,
    remotePlayReady: false,
    difficulty: 'medium',
    description: '',
    goodFor: [],
    setupTime: 5,
    teachingTime: 10,
    availableOn: ['Physical']
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-fuchsia-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-fuchsia-300 mb-6">Add Co-op Game</h2>

        <div className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Game Title..."
            className="w-full bg-indigo-950/60 border border-fuchsia-500/20 rounded-lg px-4 py-3 text-white placeholder-indigo-400 focus:outline-none focus:border-fuchsia-500/50"
          />

          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description..."
            className="w-full bg-indigo-950/60 border border-fuchsia-500/20 rounded-lg px-4 py-3 text-white placeholder-indigo-400 focus:outline-none focus:border-fuchsia-500/50"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.players}
              onChange={(e) => setFormData({ ...formData, players: e.target.value })}
              placeholder="Players (e.g. 2-4)"
              className="bg-indigo-950/60 border border-fuchsia-500/20 rounded-lg px-4 py-3 text-white placeholder-indigo-400"
            />
            <input
              type="text"
              value={formData.playTime}
              onChange={(e) => setFormData({ ...formData, playTime: e.target.value })}
              placeholder="Play time (e.g. 30-60min)"
              className="bg-indigo-950/60 border border-fuchsia-500/20 rounded-lg px-4 py-3 text-white placeholder-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm text-indigo-300 mb-2">Spoon Level (1-5): {formData.spoonLevel}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.spoonLevel}
              onChange={(e) => setFormData({ ...formData, spoonLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2 text-indigo-200">
            <input
              type="checkbox"
              checked={formData.remotePlayReady}
              onChange={(e) => setFormData({ ...formData, remotePlayReady: e.target.checked })}
              className="rounded"
            />
            Remote Play Ready
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-900/60 hover:bg-indigo-900 rounded-lg py-3 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(formData)}
            className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-lg py-3 transition-all"
          >
            Add Game
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Default cooperative games database
const defaultCoopGames: CoopGame[] = [
  {
    id: '1',
    title: 'Pandemic',
    type: 'cooperative',
    players: '2-4',
    playTime: '45min',
    spoonLevel: 3,
    remotePlayReady: true,
    difficulty: 'medium',
    description: 'Work together to save humanity from global disease outbreaks',
    goodFor: ['teamwork', 'strategy', 'date night'],
    setupTime: 5,
    teachingTime: 15,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Board Game Arena', 'Tabletop Simulator', 'Physical']
  },
  {
    id: '2',
    title: 'Hanabi',
    type: 'card',
    players: '2-5',
    playTime: '25min',
    spoonLevel: 2,
    remotePlayReady: true,
    difficulty: 'easy',
    description: 'Cooperative card game about creating a fireworks show with limited communication',
    goodFor: ['low energy', 'quick game', 'communication'],
    setupTime: 2,
    teachingTime: 5,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Board Game Arena', 'Physical']
  },
  {
    id: '3',
    title: 'Spirit Island',
    type: 'cooperative',
    players: '1-4',
    playTime: '90-120min',
    spoonLevel: 4,
    remotePlayReady: true,
    difficulty: 'hard',
    description: 'Complex cooperative game where you play as spirits defending an island',
    goodFor: ['deep strategy', 'high energy', 'experienced gamers'],
    setupTime: 15,
    teachingTime: 30,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Tabletop Simulator', 'Physical']
  },
  {
    id: '4',
    title: 'The Mind',
    type: 'card',
    players: '2-4',
    playTime: '15min',
    spoonLevel: 1,
    remotePlayReady: false,
    difficulty: 'easy',
    description: 'Silent cooperative card game that requires perfect synchronization',
    goodFor: ['low energy', 'quick game', 'no talking', 'intuitive'],
    setupTime: 1,
    teachingTime: 2,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Physical']
  },
  {
    id: '5',
    title: 'Forbidden Island',
    type: 'cooperative',
    players: '2-4',
    playTime: '30min',
    spoonLevel: 2,
    remotePlayReady: true,
    difficulty: 'easy',
    description: 'Cooperative treasure hunt on a sinking island',
    goodFor: ['family', 'beginners', 'low energy'],
    setupTime: 5,
    teachingTime: 10,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Board Game Arena', 'Physical']
  },
  {
    id: '6',
    title: 'Codenames Duet',
    type: 'party',
    players: '2+',
    playTime: '15-30min',
    spoonLevel: 2,
    remotePlayReady: true,
    difficulty: 'easy',
    description: 'Cooperative word association game for two players',
    goodFor: ['date night', 'couples', 'word lovers', 'quick game'],
    setupTime: 2,
    teachingTime: 5,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Horsepaste', 'Physical']
  },
  {
    id: '7',
    title: 'Horrified',
    type: 'cooperative',
    players: '1-5',
    playTime: '60min',
    spoonLevel: 3,
    remotePlayReady: true,
    difficulty: 'medium',
    description: 'Team up to defeat classic movie monsters',
    goodFor: ['horror fans', 'theme lovers', 'family'],
    setupTime: 5,
    teachingTime: 15,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Tabletop Simulator', 'Physical']
  },
  {
    id: '8',
    title: 'Just One',
    type: 'party',
    players: '3-7',
    playTime: '20min',
    spoonLevel: 1,
    remotePlayReady: true,
    difficulty: 'easy',
    description: 'Cooperative word guessing game where duplicates are eliminated',
    goodFor: ['low energy', 'party', 'casual', 'large groups'],
    setupTime: 1,
    teachingTime: 3,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Video call', 'Physical']
  },
  {
    id: '9',
    title: 'Magic Maze',
    type: 'cooperative',
    players: '1-8',
    playTime: '15min',
    spoonLevel: 2,
    remotePlayReady: false,
    difficulty: 'medium',
    description: 'Real-time cooperative game with no talking allowed',
    goodFor: ['intense', 'real-time', 'no talking', 'quick'],
    setupTime: 5,
    teachingTime: 10,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Physical']
  },
  {
    id: '10',
    title: 'Wingspan',
    type: 'board',
    players: '1-5',
    playTime: '40-70min',
    spoonLevel: 3,
    remotePlayReady: true,
    difficulty: 'medium',
    description: 'Beautiful bird collection and engine building game',
    goodFor: ['nature lovers', 'engine building', 'relaxing'],
    setupTime: 10,
    teachingTime: 20,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Steam', 'Board Game Arena', 'Physical']
  },
  {
    id: '11',
    title: 'Gloomhaven: Jaws of the Lion',
    type: 'rpg',
    players: '1-4',
    playTime: '30-120min',
    spoonLevel: 4,
    remotePlayReady: true,
    difficulty: 'hard',
    description: 'Tactical combat campaign game with legacy elements',
    goodFor: ['campaign', 'RPG lovers', 'tactical combat', 'progression'],
    setupTime: 15,
    teachingTime: 45,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Tabletop Simulator', 'Physical']
  },
  {
    id: '12',
    title: 'The Crew: Quest for Planet Nine',
    type: 'card',
    players: '2-5',
    playTime: '20min',
    spoonLevel: 2,
    remotePlayReady: true,
    difficulty: 'medium',
    description: 'Cooperative trick-taking card game with 50 missions',
    goodFor: ['trick-taking', 'progression', 'card game lovers'],
    setupTime: 2,
    teachingTime: 10,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Board Game Arena', 'Physical']
  },
  {
    id: '13',
    title: 'Sprawlopolis',
    type: 'card',
    players: '1-4',
    playTime: '15min',
    spoonLevel: 1,
    remotePlayReady: true,
    difficulty: 'easy',
    description: 'Tiny cooperative city-building card game',
    goodFor: ['low energy', 'portable', 'quick', 'solo-friendly'],
    setupTime: 1,
    teachingTime: 5,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Tabletop Simulator', 'Physical']
  },
  {
    id: '14',
    title: 'Mysterium',
    type: 'cooperative',
    players: '2-7',
    playTime: '42min',
    spoonLevel: 2,
    remotePlayReady: true,
    difficulty: 'easy',
    description: 'One player is a ghost giving clues to solve a murder mystery',
    goodFor: ['mystery', 'creative', 'family', 'asymmetric'],
    setupTime: 5,
    teachingTime: 10,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Tabletop Simulator', 'Physical']
  },
  {
    id: '15',
    title: 'Couples Quiz',
    type: 'party',
    players: '2',
    playTime: '20min',
    spoonLevel: 1,
    remotePlayReady: true,
    difficulty: 'easy',
    description: 'Fun questions to see how well you know your partner',
    goodFor: ['date night', 'couples', 'low energy', 'conversation'],
    setupTime: 0,
    teachingTime: 1,
    favorited: false,
    timesPlayed: 0,
    notes: '',
    availableOn: ['Video call', 'Physical']
  }
];
