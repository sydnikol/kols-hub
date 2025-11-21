import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Clock, Target, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Game {
  id: string;
  title: string;
  platform: 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'vr' | 'other';
  genre: string[];
  status: 'backlog' | 'playing' | 'completed' | 'on-hold' | 'abandoned';
  rating?: number; // 1-5
  hoursPlayed: number;
  purchasePrice?: number;
  purchaseDate?: string;
  completedDate?: string;
  notes: string;
}

interface GamingSession {
  id: string;
  gameTitle: string;
  platform: string;
  date: string;
  duration: number; // minutes
  achievement?: string;
  progress?: string;
  enjoyment: number; // 1-5
  notes: string;
}

interface Achievement {
  id: string;
  gameTitle: string;
  name: string;
  description: string;
  dateEarned: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points?: number;
}

const GamingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'games' | 'sessions' | 'achievements' | 'stats'>('games');
  const [games, setGames] = useState<Game[]>([]);
  const [sessions, setSessions] = useState<GamingSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const savedGames = localStorage.getItem('gamingLibrary');
    if (savedGames) setGames(JSON.parse(savedGames));
    const savedSessions = localStorage.getItem('gamingSessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    const savedAchievements = localStorage.getItem('gameAchievements');
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
  }, []);

  useEffect(() => { localStorage.setItem('gamingLibrary', JSON.stringify(games)); }, [games]);
  useEffect(() => { localStorage.setItem('gamingSessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('gameAchievements', JSON.stringify(achievements)); }, [achievements]);

  const addGame = () => {
    const newGame: Game = {
      id: Date.now().toString(),
      title: '',
      platform: 'pc',
      genre: [],
      status: 'backlog',
      hoursPlayed: 0,
      notes: '',
    };
    setGames([...games, newGame]);
    toast.success('Game added');
  };

  const updateGame = (id: string, updates: Partial<Game>) => {
    setGames(games.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Game updated');
  };

  const deleteGame = (id: string) => {
    setGames(games.filter(g => g.id !== id));
    toast.success('Game deleted');
  };

  const currentlyPlaying = games.filter(g => g.status === 'playing').length;
  const completed = games.filter(g => g.status === 'completed').length;
  const totalHours = games.reduce((sum, g) => sum + g.hoursPlayed, 0);
  const backlogCount = games.filter(g => g.status === 'backlog').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Gamepad2 className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Gaming Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Gamepad2 className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{games.length}</div>
            <div className="text-xs opacity-90">Games</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{currentlyPlaying}</div>
            <div className="text-xs opacity-90">Playing</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completed}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalHours.toFixed(0)}h</div>
            <div className="text-xs opacity-90">Played</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'games', label: 'Game Library', icon: Gamepad2 },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'stats', label: 'Stats', icon: Star },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'games' && (
          <div className="space-y-4">
            <button onClick={addGame} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Game</span>
            </button>
            {games.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No games yet. Start building your library!</p>
              </div>
            ) : (
              games.map(game => (
                <div key={game.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${game.status === 'completed' ? 'border-green-500' : game.status === 'playing' ? 'border-orange-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={game.title} onChange={(e) => updateGame(game.id, { title: e.target.value })} placeholder="Game title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteGame(game.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={game.platform} onChange={(e) => updateGame(game.id, { platform: e.target.value as Game['platform'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="pc">PC</option>
                      <option value="playstation">PlayStation</option>
                      <option value="xbox">Xbox</option>
                      <option value="nintendo">Nintendo</option>
                      <option value="mobile">Mobile</option>
                      <option value="vr">VR</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={game.status} onChange={(e) => updateGame(game.id, { status: e.target.value as Game['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="backlog">Backlog</option>
                      <option value="playing">Playing</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                    <input type="number" step="0.5" value={game.hoursPlayed} onChange={(e) => updateGame(game.id, { hoursPlayed: parseFloat(e.target.value) || 0 })} placeholder="Hours played..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                    <input type="number" step="0.01" value={game.purchasePrice || ''} onChange={(e) => updateGame(game.id, { purchasePrice: parseFloat(e.target.value) || undefined })} placeholder="Price paid..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Rating: {game.rating ? `${game.rating}/5` : 'Not rated'}</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button key={rating} onClick={() => updateGame(game.id, { rating })} className={`w-10 h-10 rounded ${rating <= (game.rating || 0) ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                          <Star className="w-5 h-5 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={game.notes} onChange={(e) => updateGame(game.id, { notes: e.target.value })} placeholder="Notes, thoughts..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <button onClick={() => {
              const newSession: GamingSession = {
                id: Date.now().toString(),
                gameTitle: '',
                platform: '',
                date: new Date().toISOString().split('T')[0],
                duration: 60,
                enjoyment: 3,
                notes: '',
              };
              setSessions([...sessions, newSession]);
              toast.success('Session added');
            }} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Log Gaming Session</span>
            </button>
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No sessions logged yet. Start tracking your gaming!</p>
              </div>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={session.gameTitle} onChange={(e) => {
                      setSessions(sessions.map(s => s.id === session.id ? { ...s, gameTitle: e.target.value } : s));
                    }} placeholder="Game title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none flex-1 mr-2" />
                    <button onClick={() => {
                      setSessions(sessions.filter(s => s.id !== session.id));
                      toast.success('Session deleted');
                    }} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="date" value={session.date} onChange={(e) => {
                      setSessions(sessions.map(s => s.id === session.id ? { ...s, date: e.target.value } : s));
                    }} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                    <input type="number" value={session.duration} onChange={(e) => {
                      setSessions(sessions.map(s => s.id === session.id ? { ...s, duration: parseInt(e.target.value) || 0 } : s));
                    }} placeholder="Duration (minutes)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Enjoyment: {session.enjoyment}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button key={rating} onClick={() => {
                          setSessions(sessions.map(s => s.id === session.id ? { ...s, enjoyment: rating } : s));
                        }} className={`w-10 h-10 rounded ${rating <= session.enjoyment ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                          <Star className="w-5 h-5 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={session.notes} onChange={(e) => {
                    setSessions(sessions.map(s => s.id === session.id ? { ...s, notes: e.target.value } : s));
                  }} placeholder="Notes, achievements, progress..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <button onClick={() => {
              const newAchievement: Achievement = {
                id: Date.now().toString(),
                gameTitle: '',
                name: '',
                description: '',
                dateEarned: new Date().toISOString().split('T')[0],
                rarity: 'common',
              };
              setAchievements([...achievements, newAchievement]);
              toast.success('Achievement added');
            }} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Achievement</span>
            </button>
            {achievements.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No achievements yet. Start earning!</p>
              </div>
            ) : (
              achievements.map(achievement => (
                <div key={achievement.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                  achievement.rarity === 'legendary' ? 'border-yellow-500' :
                  achievement.rarity === 'epic' ? 'border-purple-500' :
                  achievement.rarity === 'rare' ? 'border-blue-500' :
                  achievement.rarity === 'uncommon' ? 'border-green-500' : 'border-gray-400'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <input type="text" value={achievement.name} onChange={(e) => {
                        setAchievements(achievements.map(a => a.id === achievement.id ? { ...a, name: e.target.value } : a));
                      }} placeholder="Achievement name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none w-full mb-2" />
                      <input type="text" value={achievement.gameTitle} onChange={(e) => {
                        setAchievements(achievements.map(a => a.id === achievement.id ? { ...a, gameTitle: e.target.value } : a));
                      }} placeholder="Game..." className="text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none w-full" />
                    </div>
                    <button onClick={() => {
                      setAchievements(achievements.filter(a => a.id !== achievement.id));
                      toast.success('Achievement deleted');
                    }} className="text-red-500 hover:text-red-700 ml-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea value={achievement.description} onChange={(e) => {
                    setAchievements(achievements.map(a => a.id === achievement.id ? { ...a, description: e.target.value } : a));
                  }} placeholder="Description..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none mb-3" rows={2} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={achievement.dateEarned} onChange={(e) => {
                      setAchievements(achievements.map(a => a.id === achievement.id ? { ...a, dateEarned: e.target.value } : a));
                    }} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                    <select value={achievement.rarity} onChange={(e) => {
                      setAchievements(achievements.map(a => a.id === achievement.id ? { ...a, rarity: e.target.value as Achievement['rarity'] } : a));
                    }} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                      <option value="common">Common</option>
                      <option value="uncommon">Uncommon</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600">Gaming Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Games:</span>
                  <span className="font-semibold">{games.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currently Playing:</span>
                  <span className="font-semibold">{currentlyPlaying}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold">{completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backlog:</span>
                  <span className="font-semibold">{backlogCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Play Time:</span>
                  <span className="font-semibold">{totalHours.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gaming Sessions:</span>
                  <span className="font-semibold">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Achievements Earned:</span>
                  <span className="font-semibold">{achievements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold">${games.reduce((sum, g) => sum + (g.purchasePrice || 0), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Rating:</span>
                  <span className="font-semibold">{(games.filter(g => g.rating).reduce((sum, g) => sum + (g.rating || 0), 0) / games.filter(g => g.rating).length || 0).toFixed(1)}/5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamingHubPage;
