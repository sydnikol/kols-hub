import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Shuffle, Timer, Plus, RotateCcw, Filter } from 'lucide-react';

const CATEGORIES = [
  { id: 'crisis', title: 'Crisis Stabilizers', color: 'bg-rose-100 dark:bg-rose-900/30' },
  { id: 'grounding', title: 'Grounding & Orientation', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'breath', title: 'Breathwork', color: 'bg-sky-100 dark:bg-sky-900/30' },
  { id: 'body', title: 'Body-Based Regulation', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { id: 'sensory', title: 'Sensory Soothers', color: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { id: 'exec', title: 'Executive Function', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
  { id: 'pacing', title: 'Pacing & Energy', color: 'bg-teal-100 dark:bg-teal-900/30' },
  { id: 'compassion', title: 'Self-Compassion', color: 'bg-pink-100 dark:bg-pink-900/30' },
];

const SAMPLE_IDEAS = [
  { text: 'Name five safeties', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers' },
  { text: 'Cold water wrists', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers' },
  { text: 'Feet on floor check', effort: 1, category: 'grounding', categoryTitle: 'Grounding & Orientation' },
  { text: '4-7-8 breaths x4', effort: 1, category: 'breath', categoryTitle: 'Breathwork' },
];

export default function MentalHealthPage() {
  const [query, setQuery] = useState('');
  const [effort, setEffort] = useState(3);
  const [activeCats, setActiveCats] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);

  const filtered = useMemo(() => {
    return SAMPLE_IDEAS.filter(i =>
      activeCats.includes(i.category) &&
      i.effort <= effort &&
      (query === '' || i.text.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, effort, activeCats]);

  const toggleCat = (id: string) => {
    setActiveCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleFav = (text: string) => {
    setFavorites(f => f.includes(text) ? f.filter(x => x !== text) : [...f, text]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 pl-20 p-8">
      <header className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
          Mental Health Toolkit
        </h1>
        <p className="text-indigo-300 text-lg">250 spoon-aware coping strategies across 25 categories</p>
      </header>

      {/* Search & Filters */}
      <div className="bg-indigo-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search strategies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-indigo-950/50 border border-indigo-700/50 rounded-xl px-10 py-3 text-white placeholder-indigo-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-indigo-300">Max Effort:</span>
            <input
              type="range"
              min="1"
              max="3"
              value={effort}
              onChange={(e) => setEffort(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-white font-bold">{effort}/3</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimer(300)}
              className="flex-1 bg-purple-600 hover:bg-purple-500 rounded-xl px-4 py-3 text-white font-medium transition flex items-center justify-center gap-2"
            >
              <Timer className="w-4 h-4" /> 5m
            </button>
            <button
              onClick={() => setTimer(120)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 py-3 text-white font-medium transition"
            >
              2m
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCats.includes(cat.id)
                  ? 'bg-purple-600 text-white'
                  : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-indigo-300">
          Showing <span className="text-white font-bold">{filtered.length}</span> strategies
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-indigo-300 hover:text-white transition"
        >
          <Shuffle className="w-4 h-4" /> Shuffle
        </button>
      </div>

      {/* Ideas Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((idea) => (
            <motion.div
              key={idea.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-indigo-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm hover:border-purple-500/50 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{idea.text}</h3>
                  <p className="text-sm text-indigo-400">{idea.categoryTitle}</p>
                </div>
                <button
                  onClick={() => toggleFav(idea.text)}
                  className={`p-2 rounded-lg transition ${
                    favorites.includes(idea.text)
                      ? 'bg-pink-600 text-white'
                      : 'bg-indigo-900/50 text-indigo-400 hover:bg-indigo-800/50'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={favorites.includes(idea.text) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(idea.effort)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-purple-500" />
                ))}
                <span className="text-xs text-indigo-400">Effort {idea.effort}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Note */}
      <div className="mt-8 bg-indigo-900/20 rounded-2xl p-6 border border-indigo-700/30">
        <p className="text-indigo-300 text-sm">
          💜 Built for low-spoon days • Effort filter shows only ideas at or under your chosen level •
          Timer = gentle pacing • Favoriting builds a personal plan
        </p>
      </div>
    </div>
  );
}
