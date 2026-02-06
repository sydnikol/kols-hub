import React, { useState, useMemo } from 'react';
import {
  EMULATORS,
  ROM_SOURCES,
  EMULATOR_CATEGORIES,
  EMULATOR_STATS,
  Emulator
} from '../../data/emulator-database';

// Embedded player for web-based emulation
const EmbeddedPlayer: React.FC<{
  emulator: Emulator;
  onClose: () => void;
}> = ({ emulator, onClose }) => (
  <div className="fixed inset-0 bg-black z-50 flex flex-col">
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-900 to-purple-900 border-b border-indigo-500/30">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emulator.icon}</span>
        <div>
          <h2 className="text-white font-bold text-lg">{emulator.name}</h2>
          <p className="text-indigo-300 text-sm">{emulator.platform}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {emulator.website && (
          <a
            href={emulator.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            🔗 Download
          </a>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
        >
          ✕ Close
        </button>
      </div>
    </div>
    <div className="flex-1 bg-black">
      {emulator.webEmulator ? (
        <iframe
          src={emulator.webEmulator}
          className="w-full h-full border-0"
          allow="fullscreen; gamepad"
          title={emulator.name}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <span className="text-8xl mb-6">{emulator.icon}</span>
          <h3 className="text-2xl font-bold text-white mb-4">Download Required</h3>
          <p className="text-gray-400 mb-6 max-w-lg">
            {emulator.name} requires downloading and installing on your computer.
            Click the download button above to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {emulator.features.slice(0, 5).map((feature, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const EmulatorCard: React.FC<{
  emulator: Emulator;
  onPlay: (emulator: Emulator) => void;
}> = ({ emulator, onPlay }) => (
  <div className="bg-gradient-to-br from-gray-900 to-indigo-900/30 rounded-xl border border-indigo-500/20 overflow-hidden hover:border-indigo-400/40 transition-all group">
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{emulator.icon}</span>
          <div>
            <h3 className="text-white font-bold group-hover:text-indigo-300 transition-colors">
              {emulator.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              emulator.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              emulator.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {emulator.difficulty.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {emulator.webEmulator && (
            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
              🌐 Web Play
            </span>
          )}
          {emulator.isOpenSource && (
            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
              Open Source
            </span>
          )}
        </div>
      </div>

      <p className="text-indigo-200 text-sm font-medium mb-2">{emulator.platform}</p>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{emulator.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {emulator.supportedFormats.slice(0, 4).map((format, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded font-mono">
            {format}
          </span>
        ))}
        {emulator.supportedFormats.length > 4 && (
          <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded">
            +{emulator.supportedFormats.length - 4}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPlay(emulator)}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            emulator.webEmulator
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {emulator.webEmulator ? '▶️ Play in Browser' : '📥 Get Emulator'}
        </button>
        <a
          href={emulator.website}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          🔗
        </a>
      </div>
    </div>

    <div className="px-5 py-3 bg-black/30 border-t border-indigo-500/10">
      <div className="flex flex-wrap gap-2">
        {emulator.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="text-xs text-gray-400">✓ {feature}</span>
        ))}
      </div>
    </div>
  </div>
);

const EmulatorHubComplete: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEmulator, setActiveEmulator] = useState<Emulator | null>(null);
  const [showRomSources, setShowRomSources] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'platform' | 'difficulty'>('platform');

  const filteredEmulators = useMemo(() => {
    let emulators = [...EMULATORS];

    // Filter by category
    if (selectedCategory !== 'all') {
      emulators = emulators.filter(e => e.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      emulators = emulators.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.platform.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.supportedFormats.some(f => f.toLowerCase().includes(query))
      );
    }

    // Sort
    emulators.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'platform') return a.platform.localeCompare(b.platform);
      if (sortBy === 'difficulty') {
        const order = { easy: 1, medium: 2, advanced: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

    return emulators;
  }, [selectedCategory, searchQuery, sortBy]);

  const webPlayable = filteredEmulators.filter(e => e.webEmulator);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 p-6">
      {/* Embedded Player */}
      {activeEmulator && (
        <EmbeddedPlayer
          emulator={activeEmulator}
          onClose={() => setActiveEmulator(null)}
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🎮</span>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Universal Emulator Hub
              </h1>
              <p className="text-indigo-300">
                Every gaming platform, one destination
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
              <div className="text-xl font-bold text-indigo-300">{EMULATOR_STATS.totalEmulators}</div>
              <div className="text-xs text-gray-400">Emulators</div>
            </div>
            <div className="text-center px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/20">
              <div className="text-xl font-bold text-purple-300">{EMULATOR_STATS.platforms}</div>
              <div className="text-xs text-gray-400">Platforms</div>
            </div>
            <div className="text-center px-4 py-2 bg-green-900/30 rounded-lg border border-green-500/20">
              <div className="text-xl font-bold text-green-300">{EMULATOR_STATS.webPlayable}</div>
              <div className="text-xs text-gray-400">Web Playable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search emulators, platforms, or file formats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-900/80 border border-indigo-500/30 rounded-xl text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-gray-900/80 border border-indigo-500/30 rounded-xl text-white focus:border-indigo-400 focus:outline-none"
          >
            <option value="platform">Sort by Platform</option>
            <option value="name">Sort by Name</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {EMULATOR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.icon} {cat.name}
              <span className="text-xs px-1.5 py-0.5 bg-black/30 rounded">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Play Section - Web Emulators */}
      {webPlayable.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🌐</span> Play in Browser - No Download Required
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {webPlayable.slice(0, 6).map(emulator => (
              <button
                key={emulator.id}
                onClick={() => setActiveEmulator(emulator)}
                className="flex-shrink-0 w-48 p-4 bg-gradient-to-br from-green-900/50 to-indigo-900/50 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all text-left"
              >
                <span className="text-3xl block mb-2">{emulator.icon}</span>
                <h4 className="text-white font-medium text-sm">{emulator.name}</h4>
                <p className="text-xs text-green-400 mt-1">▶️ Play Now</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedCategory === 'all' ? 'All Emulators' : EMULATOR_CATEGORIES.find(c => c.id === selectedCategory)?.name}
          <span className="text-sm text-gray-400 ml-2">({filteredEmulators.length} emulators)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmulators.map(emulator => (
            <EmulatorCard
              key={emulator.id}
              emulator={emulator}
              onPlay={setActiveEmulator}
            />
          ))}
        </div>

        {filteredEmulators.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-5xl mb-4 block">🎮</span>
            <p>No emulators found matching your search.</p>
          </div>
        )}
      </div>

      {/* ROM Sources */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => setShowRomSources(!showRomSources)}
          className="w-full px-6 py-4 bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-xl border border-amber-500/30 flex items-center justify-between text-white hover:border-amber-400/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💾</span>
            <div className="text-left">
              <h3 className="font-bold">ROM & Game Sources</h3>
              <p className="text-sm text-amber-300">Where to find games for your emulators</p>
            </div>
          </div>
          <span className="text-2xl">{showRomSources ? '▲' : '▼'}</span>
        </button>

        {showRomSources && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROM_SOURCES.map(source => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-900/60 rounded-lg border border-amber-500/20 hover:border-amber-400/40 transition-all group"
              >
                <h4 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                  {source.name}
                </h4>
                <p className="text-sm text-gray-400 mt-1">{source.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {source.platforms.slice(0, 3).map((p, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                      {p}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">{source.legalNote}</p>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* OpenEmu Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="p-6 bg-gradient-to-br from-gray-900 to-purple-900/30 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🍎</span>
            <div>
              <h2 className="text-2xl font-bold text-white">OpenEmu (macOS)</h2>
              <p className="text-purple-300">The most beautiful multi-system emulator</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            OpenEmu is a macOS-exclusive emulator that provides an iTunes-like experience for retro gaming.
            It automatically organizes your games, downloads cover art, and supports over 30 systems with a single app.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['NES', 'SNES', 'N64', 'Game Boy', 'GBA', 'DS', 'Genesis', 'Master System', 'Game Gear', 'Atari 2600', 'PSP', 'Neo Geo', 'Arcade'].map(system => (
              <span key={system} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                {system}
              </span>
            ))}
            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">+20 more</span>
          </div>
          <div className="flex gap-3">
            <a
              href="https://openemu.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Download OpenEmu
            </a>
            <a
              href="https://github.com/OpenEmu"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="max-w-7xl mx-auto p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-200 text-sm text-center">
          ⚠️ Emulators are legal software. ROMs are only legal if you own the original game.
          Always respect copyright laws and support game developers when possible.
        </p>
      </div>
    </div>
  );
};

export default EmulatorHubComplete;
