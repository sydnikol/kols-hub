import React, { useState, useEffect } from 'react';
import { Dice1, Plus, Trash2, Star, Users, Clock, Target, Calendar, Gift, TrendingUp, Book } from 'lucide-react';
import toast from 'react-hot-toast';

interface BoardGame {
  id: string;
  title: string;
  designer: string;
  publisher: string;
  yearPublished: number;
  minPlayers: number;
  maxPlayers: number;
  playTime: number; // minutes
  minAge: number;
  complexity: number; // 1-5
  rating: number; // 1-10
  owned: boolean;
  wishlist: boolean;
  forTrade: boolean;
  purchasePrice?: number;
  currentValue?: number;
  timesPlayed: number;
  lastPlayed?: string;
  location?: string; // shelf location
  expansions: string[];
  mechanics: string[];
  categories: string[];
  notes: string;
}

interface GameNight {
  id: string;
  date: string;
  startTime: string;
  duration: number;
  games: string[]; // game titles
  attendees: string[];
  location: string;
  foodPlans: string;
  notes: string;
}

interface PlaySession {
  id: string;
  gameTitle: string;
  date: string;
  duration: number;
  players: string[];
  winner?: string;
  score?: string;
  enjoyment: number; // 1-5
  notes: string;
}

const BoardGamesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collection' | 'wishlist' | 'stats' | 'game-nights' | 'plays'>('collection');
  const [games, setGames] = useState<BoardGame[]>([]);
  const [gameNights, setGameNights] = useState<GameNight[]>([]);
  const [plays, setPlays] = useState<PlaySession[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const savedGames = localStorage.getItem('boardGameCollection');
    if (savedGames) setGames(JSON.parse(savedGames));
    const savedNights = localStorage.getItem('boardGameNights');
    if (savedNights) setGameNights(JSON.parse(savedNights));
    const savedPlays = localStorage.getItem('boardGamePlays');
    if (savedPlays) setPlays(JSON.parse(savedPlays));
  }, []);

  useEffect(() => { localStorage.setItem('boardGameCollection', JSON.stringify(games)); }, [games]);
  useEffect(() => { localStorage.setItem('boardGameNights', JSON.stringify(gameNights)); }, [gameNights]);
  useEffect(() => { localStorage.setItem('boardGamePlays', JSON.stringify(plays)); }, [plays]);

  const ownedGames = games.filter(g => g.owned);
  const wishlistGames = games.filter(g => g.wishlist);
  const forTradeGames = games.filter(g => g.forTrade);
  const totalValue = ownedGames.reduce((sum, g) => sum + (g.currentValue || 0), 0);
  const totalPlays = plays.length;
  const mostPlayed = games.reduce((prev, current) => (prev.timesPlayed > current.timesPlayed) ? prev : current, games[0]);

  const addGame = () => {
    const newGame: BoardGame = {
      id: Date.now().toString(),
      title: '',
      designer: '',
      publisher: '',
      yearPublished: new Date().getFullYear(),
      minPlayers: 1,
      maxPlayers: 4,
      playTime: 60,
      minAge: 10,
      complexity: 2,
      rating: 7,
      owned: true,
      wishlist: false,
      forTrade: false,
      timesPlayed: 0,
      expansions: [],
      mechanics: [],
      categories: [],
      notes: '',
    };
    setGames([...games, newGame]);
    toast.success('Game added');
  };

  const updateGame = (id: string, updates: Partial<BoardGame>) => {
    setGames(games.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Game updated');
  };

  const deleteGame = (id: string) => {
    setGames(games.filter(g => g.id !== id));
    toast.success('Game deleted');
  };

  const addGameNight = () => {
    const newNight: GameNight = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      duration: 180,
      games: [],
      attendees: [],
      location: '',
      foodPlans: '',
      notes: '',
    };
    setGameNights([...gameNights, newNight]);
    toast.success('Game night added');
  };

  const deleteGameNight = (id: string) => {
    setGameNights(gameNights.filter(gn => gn.id !== id));
    toast.success('Game night deleted');
  };

  const addPlaySession = () => {
    const newPlay: PlaySession = {
      id: Date.now().toString(),
      gameTitle: '',
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      players: [],
      enjoyment: 4,
      notes: '',
    };
    setPlays([...plays, newPlay]);
    toast.success('Play session added');
  };

  const deletePlaySession = (id: string) => {
    setPlays(plays.filter(p => p.id !== id));
    toast.success('Play session deleted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Dice1 className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Board Game Collection</h1>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Book className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xl font-bold">{ownedGames.length}</div>
            <div className="text-xs opacity-90">Owned</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Gift className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xl font-bold">{wishlistGames.length}</div>
            <div className="text-xs opacity-90">Wishlist</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalPlays}</div>
            <div className="text-xs opacity-90">Plays</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalValue}</div>
            <div className="text-xs opacity-90">Value</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xl font-bold">{gameNights.length}</div>
            <div className="text-xs opacity-90">Events</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'collection', label: 'Collection', icon: Book },
            { id: 'wishlist', label: 'Wishlist', icon: Gift },
            { id: 'plays', label: 'Play History', icon: Target },
            { id: 'game-nights', label: 'Game Nights', icon: Calendar },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'collection' && (
          <div className="space-y-4">
            <button onClick={addGame} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Board Game</span>
            </button>
            {ownedGames.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Dice1 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No games in collection yet. Start adding!</p>
              </div>
            ) : (
              ownedGames.map(game => (
                <div key={game.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={game.title} onChange={(e) => updateGame(game.id, { title: e.target.value })} placeholder="Game title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteGame(game.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={game.designer} onChange={(e) => updateGame(game.id, { designer: e.target.value })} placeholder="Designer..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="text" value={game.publisher} onChange={(e) => updateGame(game.id, { publisher: e.target.value })} placeholder="Publisher..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="number" value={game.minPlayers} onChange={(e) => updateGame(game.id, { minPlayers: parseInt(e.target.value) || 1 })} placeholder="Min players..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="number" value={game.maxPlayers} onChange={(e) => updateGame(game.id, { maxPlayers: parseInt(e.target.value) || 1 })} placeholder="Max players..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="number" value={game.playTime} onChange={(e) => updateGame(game.id, { playTime: parseInt(e.target.value) || 0 })} placeholder="Play time (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="number" value={game.timesPlayed} onChange={(e) => updateGame(game.id, { timesPlayed: parseInt(e.target.value) || 0 })} placeholder="Times played..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Rating: {game.rating}/10</label>
                    <input type="range" min="1" max="10" value={game.rating} onChange={(e) => updateGame(game.id, { rating: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div className="flex gap-2 mb-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={game.wishlist} onChange={(e) => updateGame(game.id, { wishlist: e.target.checked })} className="rounded" />
                      <span className="text-sm text-gray-600">Wishlist</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={game.forTrade} onChange={(e) => updateGame(game.id, { forTrade: e.target.checked })} className="rounded" />
                      <span className="text-sm text-gray-600">For Trade</span>
                    </label>
                  </div>
                  <textarea value={game.notes} onChange={(e) => updateGame(game.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            {wishlistGames.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No games in wishlist. Mark games from collection!</p>
              </div>
            ) : (
              wishlistGames.map(game => (
                <div key={game.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                  <h3 className="text-lg font-bold mb-2">{game.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>👥 {game.minPlayers}-{game.maxPlayers} players • ⏱️ {game.playTime}min</div>
                    <div>⭐ {game.rating}/10</div>
                    {game.purchasePrice && <div>💰 ${game.purchasePrice}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'plays' && (
          <div className="space-y-4">
            <button onClick={addPlaySession} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Log Play Session</span>
            </button>
            {plays.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No play sessions logged yet!</p>
              </div>
            ) : (
              plays.map(play => (
                <div key={play.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={play.gameTitle} onChange={(e) => setPlays(plays.map(p => p.id === play.id ? { ...p, gameTitle: e.target.value } : p))} placeholder="Game..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deletePlaySession(play.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="date" value={play.date} onChange={(e) => setPlays(plays.map(p => p.id === play.id ? { ...p, date: e.target.value } : p))} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="number" value={play.duration} onChange={(e) => setPlays(plays.map(p => p.id === play.id ? { ...p, duration: parseInt(e.target.value) || 0 } : p))} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Enjoyment: {play.enjoyment}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button key={rating} onClick={() => setPlays(plays.map(p => p.id === play.id ? { ...p, enjoyment: rating } : p))} className={`w-10 h-10 rounded ${rating <= play.enjoyment ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>
                          <Star className="w-5 h-5 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={play.notes} onChange={(e) => setPlays(plays.map(p => p.id === play.id ? { ...p, notes: e.target.value } : p))} placeholder="Notes, winner, scores..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'game-nights' && (
          <div className="space-y-4">
            <button onClick={addGameNight} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Plan Game Night</span>
            </button>
            {gameNights.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No game nights planned. Start planning!</p>
              </div>
            ) : (
              gameNights.map(night => (
                <div key={night.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold">Game Night</h3>
                    <button onClick={() => deleteGameNight(night.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="date" value={night.date} onChange={(e) => setGameNights(gameNights.map(gn => gn.id === night.id ? { ...gn, date: e.target.value } : gn))} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="time" value={night.startTime} onChange={(e) => setGameNights(gameNights.map(gn => gn.id === night.id ? { ...gn, startTime: e.target.value } : gn))} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="text" value={night.location} onChange={(e) => setGameNights(gameNights.map(gn => gn.id === night.id ? { ...gn, location: e.target.value } : gn))} placeholder="Location..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none col-span-2" />
                  </div>
                  <textarea value={night.notes} onChange={(e) => setGameNights(gameNights.map(gn => gn.id === night.id ? { ...gn, notes: e.target.value } : gn))} placeholder="Attendees, games planned, food..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" rows={3} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Collection Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Games Owned:</span>
                  <span className="font-semibold">{ownedGames.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wishlist:</span>
                  <span className="font-semibold">{wishlistGames.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">For Trade:</span>
                  <span className="font-semibold">{forTradeGames.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Plays:</span>
                  <span className="font-semibold">{totalPlays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection Value:</span>
                  <span className="font-semibold">${totalValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Game Nights Planned:</span>
                  <span className="font-semibold">{gameNights.length}</span>
                </div>
                {mostPlayed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Most Played:</span>
                    <span className="font-semibold">{mostPlayed.title} ({mostPlayed.timesPlayed}x)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardGamesPage;
