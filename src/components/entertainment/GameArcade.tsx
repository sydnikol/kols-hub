/**
 * Game Arcade Component
 * =====================
 * ACTUAL PLAYABLE GAMES embedded in the app!
 * Browser games, retro games, and HTML5 games you can play right here
 */

import React, { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface GameArcadeProps {
  className?: string;
}

interface EmbeddedGame {
  id: string;
  name: string;
  embedUrl: string;
  category: GameType;
  icon: string;
  description: string;
  controls?: string;
}

type GameType = 'arcade' | 'puzzle' | 'action' | 'retro' | 'casual' | 'multiplayer';

// ============================================================================
// EMBEDDABLE GAMES DATABASE
// These are actual games that can be embedded and played!
// ============================================================================

const EMBEDDED_GAMES: EmbeddedGame[] = [
  // Classic Arcade Games from Internet Archive
  {
    id: 'pacman',
    name: 'Pac-Man',
    embedUrl: 'https://archive.org/embed/msdos_Pac-Man_1983',
    category: 'arcade',
    icon: '🟡',
    description: 'Classic maze chase game. Eat all dots while avoiding ghosts!',
    controls: 'Arrow keys to move'
  },
  {
    id: 'donkey-kong',
    name: 'Donkey Kong',
    embedUrl: 'https://archive.org/embed/msdos_Donkey_Kong_1983',
    category: 'arcade',
    icon: '🦍',
    description: 'Climb ladders and dodge barrels to save the princess!',
    controls: 'Arrow keys to move, Space to jump'
  },
  {
    id: 'space-invaders',
    name: 'Space Invaders',
    embedUrl: 'https://archive.org/embed/msdos_Space_Invaders_1995',
    category: 'arcade',
    icon: '👾',
    description: 'Defend Earth from waves of alien invaders!',
    controls: 'Arrow keys to move, Space to shoot'
  },
  {
    id: 'tetris',
    name: 'Tetris',
    embedUrl: 'https://archive.org/embed/msdos_Tetris_1987',
    category: 'puzzle',
    icon: '🧱',
    description: 'The classic falling block puzzle game!',
    controls: 'Arrow keys to move/rotate'
  },
  {
    id: 'frogger',
    name: 'Frogger',
    embedUrl: 'https://archive.org/embed/msdos_Frogger_1983',
    category: 'arcade',
    icon: '🐸',
    description: 'Help the frog cross the busy road and river!',
    controls: 'Arrow keys to hop'
  },
  {
    id: 'galaga',
    name: 'Galaga',
    embedUrl: 'https://archive.org/embed/msdos_Galaga_1983',
    category: 'arcade',
    icon: '🚀',
    description: 'Shoot down waves of alien ships!',
    controls: 'Arrow keys to move, Space to shoot'
  },
  {
    id: 'asteroids',
    name: 'Asteroids',
    embedUrl: 'https://archive.org/embed/msdos_Asteroids_1987',
    category: 'arcade',
    icon: '☄️',
    description: 'Blast asteroids and survive in space!',
    controls: 'Arrow keys to move, Space to shoot'
  },
  {
    id: 'dig-dug',
    name: 'Dig Dug',
    embedUrl: 'https://archive.org/embed/msdos_Dig_Dug_1984',
    category: 'arcade',
    icon: '⛏️',
    description: 'Dig tunnels and defeat underground monsters!',
    controls: 'Arrow keys to move'
  },
  {
    id: 'qbert',
    name: 'Q*bert',
    embedUrl: 'https://archive.org/embed/msdos_Qbert_1983',
    category: 'arcade',
    icon: '🔶',
    description: 'Hop on cubes to change their colors!',
    controls: 'Arrow keys to hop diagonally'
  },
  {
    id: 'centipede',
    name: 'Centipede',
    embedUrl: 'https://archive.org/embed/msdos_Centipede_1983',
    category: 'arcade',
    icon: '🐛',
    description: 'Shoot the centipede before it reaches you!',
    controls: 'Arrow keys to move, Space to shoot'
  },
  {
    id: 'breakout',
    name: 'Breakout',
    embedUrl: 'https://archive.org/embed/msdos_Super_Breakout_1981',
    category: 'arcade',
    icon: '🧱',
    description: 'Break all the bricks with a bouncing ball!',
    controls: 'Arrow keys to move paddle'
  },
  {
    id: 'pong',
    name: 'Pong',
    embedUrl: 'https://archive.org/embed/msdos_Pong_The_Next_Level_1999',
    category: 'retro',
    icon: '🏓',
    description: 'The original video game classic!',
    controls: 'Arrow keys to move paddle'
  },
  // DOS Games
  {
    id: 'oregon-trail',
    name: 'Oregon Trail',
    embedUrl: 'https://archive.org/embed/msdos_Oregon_Trail_The_1990',
    category: 'casual',
    icon: '🛤️',
    description: 'Lead your wagon party to Oregon!',
    controls: 'Keyboard to type commands'
  },
  {
    id: 'prince-of-persia',
    name: 'Prince of Persia',
    embedUrl: 'https://archive.org/embed/msdos_Prince_of_Persia_1990',
    category: 'action',
    icon: '⚔️',
    description: 'Classic platformer - save the princess!',
    controls: 'Arrow keys, Shift to grab ledges'
  },
  {
    id: 'lemmings',
    name: 'Lemmings',
    embedUrl: 'https://archive.org/embed/msdos_Lemmings_1991',
    category: 'puzzle',
    icon: '🐭',
    description: 'Guide the lemmings to safety!',
    controls: 'Mouse to assign tasks'
  },
  {
    id: 'doom',
    name: 'DOOM',
    embedUrl: 'https://archive.org/embed/msdos_DOOM_1993',
    category: 'action',
    icon: '😈',
    description: 'The legendary first-person shooter!',
    controls: 'Arrow keys, Ctrl to shoot, Space to open'
  },
  {
    id: 'commander-keen',
    name: 'Commander Keen',
    embedUrl: 'https://archive.org/embed/msdos_Commander_Keen_1_-_Marooned_on_Mars_1990',
    category: 'action',
    icon: '🚀',
    description: 'Help Commander Keen save the galaxy!',
    controls: 'Arrow keys, Ctrl to jump, Alt to pogo'
  },
  {
    id: 'wolfenstein',
    name: 'Wolfenstein 3D',
    embedUrl: 'https://archive.org/embed/msdos_Wolfenstein_3D_1992',
    category: 'action',
    icon: '🔫',
    description: 'Escape from Castle Wolfenstein!',
    controls: 'Arrow keys, Ctrl to shoot, Space to open'
  }
];

// HTML5 Games that can be embedded
const HTML5_GAMES = [
  {
    id: '2048',
    name: '2048',
    url: 'https://play2048.co/',
    embedUrl: 'https://play2048.co/',
    category: 'puzzle',
    icon: '🔢',
    description: 'Slide tiles to combine numbers and reach 2048!'
  },
  {
    id: 'wordle',
    name: 'Wordle',
    url: 'https://www.nytimes.com/games/wordle/',
    category: 'puzzle',
    icon: '📝',
    description: 'Guess the 5-letter word in 6 tries!'
  },
  {
    id: 'slither',
    name: 'Slither.io',
    url: 'https://slither.io/',
    category: 'multiplayer',
    icon: '🐍',
    description: 'Grow your snake and dominate the arena!'
  },
  {
    id: 'agar',
    name: 'Agar.io',
    url: 'https://agar.io/',
    category: 'multiplayer',
    icon: '⚪',
    description: 'Eat smaller cells and grow bigger!'
  },
  {
    id: 'krunker',
    name: 'Krunker.io',
    url: 'https://krunker.io/',
    category: 'action',
    icon: '🔫',
    description: 'Fast-paced browser FPS game!'
  },
  {
    id: 'cookie-clicker',
    name: 'Cookie Clicker',
    url: 'https://orteil.dashnet.org/cookieclicker/',
    category: 'casual',
    icon: '🍪',
    description: 'Click cookies and build a cookie empire!'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const GameArcade: React.FC<GameArcadeProps> = ({ className = '' }) => {
  const [selectedGame, setSelectedGame] = useState<EmbeddedGame | null>(null);
  const [activeCategory, setActiveCategory] = useState<GameType | 'all'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories: { id: GameType | 'all'; name: string; icon: string }[] = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'arcade', name: 'Arcade', icon: '🕹️' },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
    { id: 'action', name: 'Action', icon: '⚔️' },
    { id: 'retro', name: 'Retro', icon: '📺' },
    { id: 'casual', name: 'Casual', icon: '☕' }
  ];

  const filteredGames = activeCategory === 'all'
    ? EMBEDDED_GAMES
    : EMBEDDED_GAMES.filter(g => g.category === activeCategory);

  const handlePlayGame = (game: EmbeddedGame) => {
    setSelectedGame(game);
    setIsFullscreen(false);
  };

  const handleOpenExternal = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-green-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-200">🕹️ Game Arcade</h2>
        <div className="text-sm text-gray-400">
          {EMBEDDED_GAMES.length} playable games • No download required
        </div>
      </div>

      {/* If a game is selected, show the player */}
      {selectedGame ? (
        <div className="space-y-4">
          {/* Game Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedGame(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <span className="text-2xl">{selectedGame.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-green-200">{selectedGame.name}</h3>
                <p className="text-sm text-gray-400">{selectedGame.controls}</p>
              </div>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isFullscreen ? '🔲 Exit Fullscreen' : '⛶ Fullscreen'}
            </button>
          </div>

          {/* Game Embed */}
          <div className={`bg-black rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}>
            <iframe
              src={selectedGame.embedUrl}
              className="w-full h-full"
              allow="fullscreen"
              allowFullScreen
              title={selectedGame.name}
            />
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                ✕ Close
              </button>
            )}
          </div>

          {/* Game Info */}
          <div className="bg-gray-800/40 rounded-xl p-4">
            <p className="text-gray-300">{selectedGame.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              💡 Tip: Click inside the game to activate controls. Some games may need a moment to load.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Playable Arcade Games */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">🕹️ Play Now - Classic Arcade & DOS Games</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredGames.map(game => (
                <button
                  key={game.id}
                  onClick={() => handlePlayGame(game)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/60
                             border border-green-500/20 hover:border-green-400/50 hover:bg-gray-800
                             transition-all duration-300 hover:scale-105 group"
                >
                  <span className="text-4xl group-hover:animate-bounce">{game.icon}</span>
                  <span className="text-sm font-medium text-gray-200 text-center">{game.name}</span>
                  <span className="text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ▶ Play Now
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* HTML5 Browser Games */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">🌐 HTML5 Browser Games</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {HTML5_GAMES.map(game => (
                <button
                  key={game.id}
                  onClick={() => handleOpenExternal(game.url)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/60
                             border border-blue-500/20 hover:border-blue-400/50 hover:bg-gray-800
                             transition-all duration-300 hover:scale-105 group"
                >
                  <span className="text-4xl group-hover:animate-pulse">{game.icon}</span>
                  <span className="text-sm font-medium text-gray-200 text-center">{game.name}</span>
                  <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* More Games Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">🎮 More Free Games</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Internet Arcade', icon: '🕹️', url: 'https://archive.org/details/internetarcade', desc: '900+ arcade games' },
                { name: 'DOS Games', icon: '💾', url: 'https://archive.org/details/softwarelibrary_msdos_games', desc: '6000+ DOS games' },
                { name: 'Kongregate', icon: '🌐', url: 'https://www.kongregate.com/', desc: 'Flash & HTML5' },
                { name: 'itch.io Free', icon: '🎨', url: 'https://itch.io/games/free', desc: 'Indie games' },
                { name: 'Newgrounds', icon: '🔥', url: 'https://www.newgrounds.com/games', desc: 'Flash classics' },
                { name: 'CrazyGames', icon: '🎯', url: 'https://www.crazygames.com/', desc: 'Browser games' },
                { name: 'Poki', icon: '🎪', url: 'https://poki.com/', desc: 'Family games' },
                { name: 'Armor Games', icon: '🛡️', url: 'https://armorgames.com/', desc: 'Strategy & RPG' }
              ].map(site => (
                <button
                  key={site.name}
                  onClick={() => handleOpenExternal(site.url)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/40
                             border border-purple-500/20 hover:border-purple-400/50 transition-all text-left"
                >
                  <span className="text-2xl">{site.icon}</span>
                  <div>
                    <div className="font-medium text-purple-200">{site.name}</div>
                    <div className="text-xs text-gray-500">{site.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>🕹️ Game Arcade</span>
        <span>•</span>
        <span>{EMBEDDED_GAMES.length} Embedded Games</span>
        <span>•</span>
        <span>Powered by Internet Archive</span>
      </div>
    </div>
  );
};

export default GameArcade;
