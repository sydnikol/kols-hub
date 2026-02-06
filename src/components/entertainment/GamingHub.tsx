/**
 * Gaming Hub Component
 * ====================
 * Free games, game development tools, archives, and gaming resources
 * ACTUAL working links and embedded tools
 */

import React, { useState } from 'react';
import {
  GAME_ENGINES,
  GAME_ARCHIVES,
  GAME_DATABASES,
  FREE_GAMES,
  GAME_MANAGERS,
  getGamingStats,
  GameEngine,
  GameResource
} from '../../data/gaming-database';

// ============================================================================
// TYPES
// ============================================================================

interface GamingHubProps {
  className?: string;
}

type MainView = 'play' | 'develop' | 'discover' | 'manage';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const EngineCard: React.FC<{ engine: GameEngine; onLaunch: (e: GameEngine) => void }> = ({ engine, onLaunch }) => (
  <div className="bg-gray-800/60 rounded-xl border border-gray-700 hover:border-green-500/50
                  transition-all p-4 group">
    <div className="flex items-start gap-3 mb-3">
      <span className="text-3xl group-hover:scale-110 transition-transform">{engine.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-green-200">{engine.name}</h3>
          {engine.isOpenSource && (
            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">OSS</span>
          )}
          {engine.rating && (
            <span className="text-xs text-yellow-400">★ {engine.rating}</span>
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{engine.description}</p>
      </div>
    </div>

    {/* Languages */}
    <div className="flex flex-wrap gap-1 mb-3">
      {engine.languages.map((lang, idx) => (
        <span key={idx} className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
          {lang}
        </span>
      ))}
    </div>

    {/* Features */}
    <div className="flex flex-wrap gap-1 mb-3">
      {engine.features.slice(0, 3).map((feature, idx) => (
        <span key={idx} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded">
          {feature}
        </span>
      ))}
      {engine.features.length > 3 && (
        <span className="text-xs text-gray-500">+{engine.features.length - 3} more</span>
      )}
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      {engine.downloadUrl && (
        <button
          onClick={() => window.open(engine.downloadUrl, '_blank')}
          className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
        >
          Download
        </button>
      )}
      {engine.github && (
        <button
          onClick={() => window.open(engine.github, '_blank')}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
        >
          GitHub
        </button>
      )}
      <button
        onClick={() => onLaunch(engine)}
        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors ml-auto"
      >
        Website →
      </button>
    </div>
  </div>
);

const ResourceCard: React.FC<{ resource: GameResource; onOpen: (r: GameResource) => void }> = ({ resource, onOpen }) => (
  <button
    onClick={() => onOpen(resource)}
    className="bg-gray-800/60 rounded-xl border border-gray-700 hover:border-purple-500/50
               transition-all p-4 text-left group w-full"
  >
    <div className="flex items-start gap-3">
      <span className="text-3xl group-hover:scale-110 transition-transform">{resource.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-purple-200">{resource.name}</h3>
          {resource.isOpenSource && (
            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">OSS</span>
          )}
          {resource.pricing === 'free' && (
            <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">FREE</span>
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{resource.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.features.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">
              {feature}
            </span>
          ))}
        </div>
      </div>
      <span className="text-gray-500 group-hover:text-purple-400 transition-colors">→</span>
    </div>
  </button>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const GamingHub: React.FC<GamingHubProps> = ({ className = '' }) => {
  const [mainView, setMainView] = useState<MainView>('play');
  const stats = getGamingStats();

  const handleOpenEngine = (engine: GameEngine) => {
    window.open(engine.url, '_blank');
  };

  const handleOpenResource = (resource: GameResource) => {
    window.open(resource.url, '_blank');
  };

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-green-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-200">🎮 Gaming Hub</h2>
        <div className="text-sm text-gray-400">
          {stats.totalResources} resources • {stats.totalEngines} engines • {stats.openSourceGames} open source
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setMainView('play')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            mainView === 'play'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>🕹️</span>
          <span>Play Games</span>
        </button>
        <button
          onClick={() => setMainView('develop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            mainView === 'develop'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>🛠️</span>
          <span>Game Dev</span>
        </button>
        <button
          onClick={() => setMainView('discover')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            mainView === 'discover'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>🔍</span>
          <span>Discover</span>
        </button>
        <button
          onClick={() => setMainView('manage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            mainView === 'manage'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>📚</span>
          <span>Library</span>
        </button>
      </div>

      {/* PLAY GAMES VIEW */}
      {mainView === 'play' && (
        <>
          {/* Quick Play - Browser Games */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">⚡ Quick Play</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: 'Internet Arcade', icon: '🕹️', url: 'https://archive.org/details/internetarcade', desc: 'Classic Arcade' },
                { name: 'Kongregate', icon: '🌐', url: 'https://www.kongregate.com/', desc: 'Browser Games' },
                { name: 'itch.io Free', icon: '🎨', url: 'https://itch.io/games/free', desc: 'Indie Games' },
                { name: 'GOG Free', icon: '🎁', url: 'https://www.gog.com/en/games?priceRange=0,0', desc: 'DRM-Free' },
                { name: 'DOS Games', icon: '💾', url: 'https://archive.org/details/softwarelibrary_msdos_games', desc: 'Retro DOS' },
                { name: 'Console Games', icon: '📺', url: 'https://archive.org/details/consolelivingroom', desc: 'Classic Consoles' }
              ].map(game => (
                <button
                  key={game.name}
                  onClick={() => window.open(game.url, '_blank')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/40
                             border border-green-500/20 hover:border-green-400/50 hover:bg-gray-800/60
                             transition-all duration-300 hover:scale-105"
                >
                  <span className="text-2xl">{game.icon}</span>
                  <span className="text-sm text-gray-300 text-center">{game.name}</span>
                  <span className="text-xs text-gray-500">{game.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Free Games Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">🎁 Free Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FREE_GAMES.map(resource => (
                <ResourceCard key={resource.id} resource={resource} onOpen={handleOpenResource} />
              ))}
            </div>
          </div>

          {/* Game Archives */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">🏛️ Game Archives & History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GAME_ARCHIVES.map(resource => (
                <ResourceCard key={resource.id} resource={resource} onOpen={handleOpenResource} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* GAME DEVELOPMENT VIEW */}
      {mainView === 'develop' && (
        <>
          {/* Quick Start Engines */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">⚡ Start Building</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Godot', icon: '🎮', url: 'https://godotengine.org/', desc: '2D/3D OSS' },
                { name: 'Phaser', icon: '⚡', url: 'https://phaser.io/', desc: 'HTML5 Games' },
                { name: 'Unity', icon: '🔮', url: 'https://unity.com/', desc: 'Industry Std' },
                { name: "Ren'Py", icon: '📖', url: 'https://www.renpy.org/', desc: 'Visual Novels' }
              ].map(engine => (
                <button
                  key={engine.name}
                  onClick={() => window.open(engine.url, '_blank')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/40
                             border border-blue-500/20 hover:border-blue-400/50 hover:bg-gray-800/60
                             transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl">{engine.icon}</span>
                  <span className="text-sm font-medium text-blue-200">{engine.name}</span>
                  <span className="text-xs text-gray-500">{engine.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* All Game Engines */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">🛠️ Game Engines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GAME_ENGINES.map(engine => (
                <EngineCard key={engine.id} engine={engine} onLaunch={handleOpenEngine} />
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">📚 Learn Game Dev</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Godot Docs', url: 'https://docs.godotengine.org/', icon: '📖' },
                { name: 'Phaser Learn', url: 'https://phaser.io/learn', icon: '🎓' },
                { name: 'Unity Learn', url: 'https://learn.unity.com/', icon: '🎮' },
                { name: 'Game Dev Reddit', url: 'https://www.reddit.com/r/gamedev/', icon: '💬' }
              ].map(resource => (
                <button
                  key={resource.name}
                  onClick={() => window.open(resource.url, '_blank')}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/40
                             border border-gray-700 hover:border-blue-500/50 transition-all"
                >
                  <span className="text-xl">{resource.icon}</span>
                  <span className="text-sm text-gray-300">{resource.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* DISCOVER VIEW */}
      {mainView === 'discover' && (
        <>
          {/* Game Databases */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">🗃️ Game Databases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GAME_DATABASES.map(resource => (
                <ResourceCard key={resource.id} resource={resource} onOpen={handleOpenResource} />
              ))}
            </div>
          </div>

          {/* Quick Database Access */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">⚡ Quick Search</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'MobyGames', icon: '📊', url: 'https://www.mobygames.com/' },
                { name: 'IGDB', icon: '🗃️', url: 'https://www.igdb.com/' },
                { name: 'RAWG', icon: '🎯', url: 'https://rawg.io/' },
                { name: 'HowLongToBeat', icon: '⏱️', url: 'https://howlongtobeat.com/' }
              ].map(db => (
                <button
                  key={db.name}
                  onClick={() => window.open(db.url, '_blank')}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/40
                             border border-purple-500/20 hover:border-purple-400/50 transition-all"
                >
                  <span className="text-xl">{db.icon}</span>
                  <span className="text-sm text-gray-300">{db.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Open Source Games */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">🔓 Open Source Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Awesome OSS Games', icon: '⭐', url: 'https://github.com/michelpereira/awesome-open-source-games', desc: 'Curated GitHub list' },
                { name: 'FOSS Games', icon: '🔓', url: 'https://fossgames.com/', desc: 'OSS game directory' },
                { name: 'r/opensourcegames', icon: '📱', url: 'https://www.reddit.com/r/opensourcegames/', desc: 'Reddit community' },
                { name: 'LibreGameWiki', icon: '📖', url: 'https://libregamewiki.org/', desc: 'Free game wiki' },
                { name: 'Open Source Game Clones', icon: '🎮', url: 'https://osgameclones.com/', desc: 'Classic remakes' },
                { name: 'F-Droid Games', icon: '🤖', url: 'https://f-droid.org/packages/#category-Games', desc: 'Android OSS games' }
              ].map(resource => (
                <button
                  key={resource.name}
                  onClick={() => window.open(resource.url, '_blank')}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/40
                             border border-green-500/20 hover:border-green-400/50 transition-all text-left"
                >
                  <span className="text-2xl">{resource.icon}</span>
                  <div>
                    <div className="font-medium text-green-200">{resource.name}</div>
                    <div className="text-xs text-gray-500">{resource.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* LIBRARY MANAGEMENT VIEW */}
      {mainView === 'manage' && (
        <>
          {/* Game Managers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">📚 Game Library Managers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GAME_MANAGERS.map(resource => (
                <ResourceCard key={resource.id} resource={resource} onOpen={handleOpenResource} />
              ))}
            </div>
          </div>

          {/* Quick Launch Managers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">⚡ Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Playnite', icon: '📚', url: 'https://playnite.link/', desc: 'Windows' },
                { name: 'Heroic', icon: '🦸', url: 'https://heroicgameslauncher.com/', desc: 'Multi-platform' },
                { name: 'Lutris', icon: '🐧', url: 'https://lutris.net/', desc: 'Linux' },
                { name: 'Moonlight', icon: '🌙', url: 'https://moonlight-stream.org/', desc: 'Streaming' }
              ].map(manager => (
                <button
                  key={manager.name}
                  onClick={() => window.open(manager.url, '_blank')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/40
                             border border-amber-500/20 hover:border-amber-400/50 transition-all"
                >
                  <span className="text-2xl">{manager.icon}</span>
                  <span className="text-sm font-medium text-amber-200">{manager.name}</span>
                  <span className="text-xs text-gray-500">{manager.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Game Stores */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">🛒 Game Stores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'GOG', icon: '🎁', url: 'https://www.gog.com/', desc: 'DRM-Free' },
                { name: 'Steam', icon: '💨', url: 'https://store.steampowered.com/', desc: 'PC Gaming' },
                { name: 'Epic Games', icon: '🎮', url: 'https://store.epicgames.com/', desc: 'Free Games' },
                { name: 'Humble Bundle', icon: '📦', url: 'https://www.humblebundle.com/', desc: 'Bundles + Charity' },
                { name: 'itch.io', icon: '🎨', url: 'https://itch.io/', desc: 'Indie Games' },
                { name: 'Fanatical', icon: '🔥', url: 'https://www.fanatical.com/', desc: 'Game Keys' },
                { name: 'Green Man Gaming', icon: '🌿', url: 'https://www.greenmangaming.com/', desc: 'Official Keys' },
                { name: 'IndieGala', icon: '🌌', url: 'https://www.indiegala.com/', desc: 'Indie Bundles' }
              ].map(store => (
                <button
                  key={store.name}
                  onClick={() => window.open(store.url, '_blank')}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-800/40
                             border border-gray-700 hover:border-purple-500/50 transition-all"
                >
                  <span className="text-xl">{store.icon}</span>
                  <span className="text-sm text-gray-300">{store.name}</span>
                  <span className="text-xs text-gray-500">{store.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>🎮 Gaming Hub</span>
        <span>•</span>
        <span>{stats.totalEngines} Game Engines</span>
        <span>•</span>
        <span>{stats.openSourceEngines} Open Source</span>
        <span>•</span>
        <span>Free to Play</span>
      </div>
    </div>
  );
};

export default GamingHub;
