import React, { useState } from 'react';

const GAMES = [
  { id: 1, name: 'Ironsworn', type: 'Solo RPG', spoons: 3, time: '60min', tags: ['fantasy', 'narrative'] },
  { id: 2, name: 'One Deck Dungeon', type: 'Dice/Card', spoons: 2, time: '30min', tags: ['dungeon', 'quick'] },
  { id: 3, name: 'Mage Knight', type: 'Strategy', spoons: 5, time: '120min', tags: ['complex', 'combat'] },
  { id: 4, name: 'Spirit Island', type: 'Coop', spoons: 4, time: '90min', tags: ['strategy', 'puzzle'] },
  { id: 5, name: 'Under Falling Skies', type: 'Dice', spoons: 2, time: '20min', tags: ['quick', 'scifi'] },
  { id: 6, name: 'Friday', type: 'Deck Building', spoons: 2, time: '25min', tags: ['card', 'survival'] },
  { id: 7, name: 'Raging Roll Writing Rangers', type: 'Roll & Write', spoons: 1, time: '15min', tags: ['casual', 'quick'] },
  { id: 8, name: 'Sprawlopolis', type: 'Card', spoons: 2, time: '15min', tags: ['puzzle', 'city'] },
  { id: 9, name: 'Gloomhaven: Jaws of the Lion', type: 'Campaign', spoons: 4, time: '120min', tags: ['tactical', 'story'] },
  { id: 10, name: 'Arkham Horror: The Card Game', type: 'LCG', spoons: 4, time: '90min', tags: ['horror', 'deck'] }
];

const DND_PROMPTS = [
  'Your character discovers an ancient artifact in their attic',
  'A mysterious stranger offers a quest with a suspicious reward',
  'The local tavern has been cursed - everyone speaks in rhymes',
  'A dragon demands tribute but seems surprisingly reasonable',
  'Your character wakes up in a different body',
  'The town festival turns sinister at midnight',
  'A portal opens and someone you recognize steps through',
  'Your character inherits a haunted castle',
  'All magic suddenly stops working for 24 hours',
  'A celestial being asks for your character\'s help',
  'Your character finds a map to a legendary treasure',
  'The dead begin returning with unfinished business',
  'A rival from your past appears seeking alliance',
  'Your character\'s greatest fear manifests physically',
  'An ancient prophecy mentions your character by name',
  'A child with incredible power needs protection',
  'Your character discovers they\'re adopted - and not human',
  'The kingdom\'s heir has been replaced by a doppelganger',
  'A time loop traps your character in one day',
  'Your character\'s mentor sends one final cryptic message'
];

export const GameLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'library' | 'dnd' | 'scheduler'>('library');
  const [filterSpoons, setFilterSpoons] = useState<number>(0);
  const [filterTags, setFilterTags] = useState<string>('');
  const [dndCharacter, setDndCharacter] = useState({
    name: '',
    class: '',
    level: 1,
    backstory: '',
    quest: ''
  });
  const [randomPrompt, setRandomPrompt] = useState('');

  const filteredGames = GAMES.filter(game => {
    if (filterSpoons > 0 && game.spoons > filterSpoons) return false;
    if (filterTags && !game.tags.some(tag => tag.includes(filterTags.toLowerCase()))) return false;
    return true;
  });

  const getRandomPrompt = () => {
    const prompt = DND_PROMPTS[Math.floor(Math.random() * DND_PROMPTS.length)];
    setRandomPrompt(prompt);
  };

  const getSpoonEmoji = (spoons: number) => {
    return '🥄'.repeat(spoons);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 mb-2">
            🎲 Game Library & D&D Planner
          </h1>
          <p className="text-purple-200">Solo board games and D&D campaign tools</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('library')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'library' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📚 Game Library
          </button>
          <button
            onClick={() => setViewMode('dnd')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'dnd' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            🐉 D&D Solo
          </button>
          <button
            onClick={() => setViewMode('scheduler')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'scheduler' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📅 Game Night
          </button>
        </div>

        {/* Game Library View */}
        {viewMode === 'library' && (
          <div>
            {/* Filters */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2">
                    🥄 Max Spoons: {filterSpoons > 0 ? filterSpoons : 'Any'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={filterSpoons}
                    onChange={(e) => setFilterSpoons(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">🏷️ Filter by Tag</label>
                  <input
                    type="text"
                    value={filterTags}
                    onChange={(e) => setFilterTags(e.target.value)}
                    placeholder="e.g. quick, fantasy, puzzle"
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                  />
                </div>
              </div>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <div key={game.id} className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-colors">
                  <div className="text-3xl mb-3">🎮</div>
                  <h3 className="text-xl font-bold text-purple-100 mb-2">{game.name}</h3>
                  <div className="text-purple-300 text-sm mb-3">{game.type}</div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-400">Energy</span>
                      <span className="text-purple-200">{getSpoonEmoji(game.spoons)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-400">Time</span>
                      <span className="text-purple-200">⏱️ {game.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag, i) => (
                      <span key={i} className="bg-purple-600/30 px-2 py-1 rounded-full text-xs text-purple-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* D&D Solo View */}
        {viewMode === 'dnd' && (
          <div className="space-y-6">
            {/* Character Creator */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-6">⚔️ Character & Campaign</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-purple-200 mb-2">Character Name</label>
                  <input
                    type="text"
                    value={dndCharacter.name}
                    onChange={(e) => setDndCharacter({...dndCharacter, name: e.target.value})}
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">Class</label>
                  <select
                    value={dndCharacter.class}
                    onChange={(e) => setDndCharacter({...dndCharacter, class: e.target.value})}
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                  >
                    <option value="">Select Class</option>
                    <option value="Barbarian">⚔️ Barbarian</option>
                    <option value="Bard">🎵 Bard</option>
                    <option value="Cleric">✨ Cleric</option>
                    <option value="Druid">🌿 Druid</option>
                    <option value="Fighter">🛡️ Fighter</option>
                    <option value="Monk">🥋 Monk</option>
                    <option value="Paladin">🗡️ Paladin</option>
                    <option value="Ranger">🏹 Ranger</option>
                    <option value="Rogue">🗝️ Rogue</option>
                    <option value="Sorcerer">🔮 Sorcerer</option>
                    <option value="Warlock">👁️ Warlock</option>
                    <option value="Wizard">📚 Wizard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">Level</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={dndCharacter.level}
                    onChange={(e) => setDndCharacter({...dndCharacter, level: Number(e.target.value)})}
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-purple-200 mb-2">Backstory</label>
                  <textarea
                    value={dndCharacter.backstory}
                    onChange={(e) => setDndCharacter({...dndCharacter, backstory: e.target.value})}
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 h-24"
                    placeholder="Who is your character? What's their story?"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-purple-200 mb-2">Current Quest</label>
                  <textarea
                    value={dndCharacter.quest}
                    onChange={(e) => setDndCharacter({...dndCharacter, quest: e.target.value})}
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 h-24"
                    placeholder="What are they currently pursuing?"
                  />
                </div>
              </div>
            </div>

            {/* Prompt Generator */}
            <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-100">🎲 Adventure Prompts</h2>
                <button
                  onClick={getRandomPrompt}
                  className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  ✨ Generate Prompt
                </button>
              </div>

              {randomPrompt && (
                <div className="bg-purple-900/40 rounded-lg p-6 border border-purple-500/30">
                  <div className="text-xl text-purple-100 font-medium mb-3">Your Next Adventure:</div>
                  <div className="text-purple-200 text-lg italic">"{randomPrompt}"</div>
                </div>
              )}

              <div className="mt-6 bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                <div className="text-purple-200 text-sm">
                  💡 <strong>Tip:</strong> Use these prompts to kickstart solo D&D sessions, inspire story arcs, or overcome writer's block in your campaign!
                </div>
              </div>
            </div>

            {/* Solo D&D Resources */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-4">📖 Solo D&D Resources</h2>
              <div className="space-y-3 text-purple-200">
                <div>🎲 <strong>Oracle Systems:</strong> Use Mythic GME, MUNE, or Ironsworn for yes/no questions</div>
                <div>📝 <strong>Journaling:</strong> Write session recaps to track your story</div>
                <div>🗺️ <strong>Random Generators:</strong> Use donjon.bin.sh for NPCs, dungeons, and more</div>
                <div>🎭 <strong>Play Dual Role:</strong> Be both player and DM - embrace surprises!</div>
                <div>⚔️ <strong>Combat:</strong> Use standard D&D rules or simplify for solo play</div>
              </div>
            </div>
          </div>
        )}

        {/* Game Night Scheduler */}
        {viewMode === 'scheduler' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">📅 Board Game Hangout</h2>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30 mb-6">
              <div className="text-purple-100 text-center text-lg mb-2">
                🎉 Next Game Night Planning
              </div>
              <div className="text-purple-300 text-center text-sm">
                Schedule multiplayer sessions with friends
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-purple-200 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                />
              </div>
              <div>
                <label className="block text-purple-200 mb-2">Game to Play</label>
                <select className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100">
                  <option value="">Select a game</option>
                  {GAMES.map(game => (
                    <option key={game.id} value={game.name}>{game.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-purple-200 mb-2">Invited Friends</label>
                <input
                  type="text"
                  placeholder="Enter names (comma-separated)"
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-purple-200 mb-2">Notes</label>
                <textarea
                  placeholder="Food preferences, house rules, etc."
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 h-24"
                />
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105">
              📤 Send Invites
            </button>
          </div>
        )}
      </div>
    </div>
  );
};