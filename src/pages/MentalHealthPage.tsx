import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Shuffle, Timer, Plus, RotateCcw, Filter } from 'lucide-react';

const CATEGORIES = [
  { id: 'crisis', title: 'Crisis Stabilizers', color: 'bg-rose-100 dark:bg-rose-900/30', icon: '🆘' },
  { id: 'grounding', title: 'Grounding & Orientation', color: 'bg-emerald-100 dark:bg-emerald-900/30', icon: '🌍' },
  { id: 'breath', title: 'Breathwork', color: 'bg-sky-100 dark:bg-sky-900/30', icon: '🌬️' },
  { id: 'body', title: 'Body-Based Regulation', color: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '💪' },
  { id: 'sensory', title: 'Sensory Soothers', color: 'bg-indigo-100 dark:bg-indigo-900/30', icon: '👂' },
  { id: 'movement', title: 'Movement & Exercise', color: 'bg-orange-100 dark:bg-orange-900/30', icon: '🏃' },
  { id: 'creative', title: 'Creative Expression', color: 'bg-violet-100 dark:bg-violet-900/30', icon: '🎨' },
  { id: 'social', title: 'Social Connection', color: 'bg-blue-100 dark:bg-blue-900/30', icon: '👥' },
  { id: 'cognitive', title: 'Cognitive Reframing', color: 'bg-cyan-100 dark:bg-cyan-900/30', icon: '🧠' },
  { id: 'compassion', title: 'Self-Compassion', color: 'bg-pink-100 dark:bg-pink-900/30', icon: '💖' },
  { id: 'pacing', title: 'Pacing & Energy', color: 'bg-teal-100 dark:bg-teal-900/30', icon: '⚡' },
  { id: 'nature', title: 'Nature & Environment', color: 'bg-green-100 dark:bg-green-900/30', icon: '🌿' },
];

interface CopingStrategy {
  text: string;
  effort: number;
  category: string;
  categoryTitle: string;
  description?: string;
  duration?: string;
}

const COPING_STRATEGIES: CopingStrategy[] = [
  // Crisis Stabilizers (Effort 1-2)
  { text: 'Name five safeties', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'List 5 things that are safe right now', duration: '1min' },
  { text: 'Cold water on wrists', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'Run cold water over your wrists for 30 seconds', duration: '1min' },
  { text: 'Ice cube in hand', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'Hold an ice cube and focus on the sensation', duration: '2min' },
  { text: 'Strong scent (mint/citrus)', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'Smell something strong like peppermint or lemon', duration: '1min' },
  { text: 'Count backwards from 100', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'Count backwards by 7s or 3s', duration: '3min' },
  { text: 'TIPP technique', effort: 2, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'Temperature, Intense exercise, Paced breathing, Paired muscle relaxation', duration: '5min' },
  { text: 'Safe place visualization', effort: 2, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'Imagine your safest, most peaceful place in detail', duration: '5min' },
  { text: 'Emergency contact list', effort: 1, category: 'crisis', categoryTitle: 'Crisis Stabilizers', description: 'Review your crisis support contacts', duration: '2min' },

  // Grounding & Orientation (Effort 1-2)
  { text: 'Feet on floor check', effort: 1, category: 'grounding', categoryTitle: 'Grounding & Orientation', description: 'Feel your feet firmly on the ground', duration: '1min' },
  { text: '5-4-3-2-1 senses', effort: 1, category: 'grounding', categoryTitle: 'Grounding & Orientation', description: '5 things you see, 4 hear, 3 touch, 2 smell, 1 taste', duration: '3min' },
  { text: 'Name where you are', effort: 1, category: 'grounding', categoryTitle: 'Grounding & Orientation', description: 'State your location, date, time out loud', duration: '1min' },
  { text: 'Touch different textures', effort: 1, category: 'grounding', categoryTitle: 'Grounding & Orientation', description: 'Find and touch 5 different textures nearby', duration: '3min' },
  { text: 'Body scan from toes up', effort: 2, category: 'grounding', categoryTitle: 'Grounding & Orientation', description: 'Mentally scan each body part from feet to head', duration: '5min' },
  { text: 'Trace hand outline', effort: 1, category: 'grounding', categoryTitle: 'Grounding & Orientation', description: 'Trace around your hand slowly with your finger', duration: '2min' },
  { text: 'Say your name 10 times', effort: 1, category: 'grounding', categoryTitle: 'Grounding & Orientation', description: 'Repeat your full name slowly and clearly', duration: '1min' },

  // Breathwork (Effort 1-3)
  { text: '4-7-8 breathing', effort: 1, category: 'breath', categoryTitle: 'Breathwork', description: 'Inhale 4, hold 7, exhale 8', duration: '2min' },
  { text: 'Box breathing', effort: 1, category: 'breath', categoryTitle: 'Breathwork', description: 'Inhale 4, hold 4, exhale 4, hold 4', duration: '3min' },
  { text: 'Belly breathing', effort: 1, category: 'breath', categoryTitle: 'Breathwork', description: 'Deep diaphragmatic breathing, hand on belly', duration: '5min' },
  { text: 'Alternate nostril breathing', effort: 2, category: 'breath', categoryTitle: 'Breathwork', description: 'Nadi Shodhana pranayama technique', duration: '5min' },
  { text: 'Humming bee breath', effort: 2, category: 'breath', categoryTitle: 'Breathwork', description: 'Bhramari pranayama with humming on exhale', duration: '3min' },
  { text: 'Ocean breathing', effort: 1, category: 'breath', categoryTitle: 'Breathwork', description: 'Ujjayi breath with slight throat constriction', duration: '5min' },
  { text: 'Breath counting meditation', effort: 2, category: 'breath', categoryTitle: 'Breathwork', description: 'Count each exhale up to 10, repeat', duration: '10min' },

  // Body-Based Regulation (Effort 1-3)
  { text: 'Progressive muscle relaxation', effort: 2, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Tense and release each muscle group', duration: '10min' },
  { text: 'Self-hug or butterfly hug', effort: 1, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Cross arms and tap shoulders alternately', duration: '2min' },
  { text: 'Gentle neck rolls', effort: 1, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Slow, circular neck movements', duration: '2min' },
  { text: 'Shoulder shrugs', effort: 1, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Raise shoulders to ears, hold, release', duration: '2min' },
  { text: 'Hand massage', effort: 1, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Massage palms, fingers, and wrists', duration: '5min' },
  { text: 'EFT tapping', effort: 2, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Tap acupressure points while stating affirmations', duration: '5min' },
  { text: 'Havening technique', effort: 2, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Self-soothing touch on arms, face, hands', duration: '5min' },
  { text: 'Wall push-ups', effort: 2, category: 'body', categoryTitle: 'Body-Based Regulation', description: 'Gentle resistance exercise against wall', duration: '3min' },

  // Sensory Soothers (Effort 1-2)
  { text: 'Listen to calming music', effort: 1, category: 'sensory', categoryTitle: 'Sensory Soothers', description: 'Put on your favorite soothing playlist', duration: '10min' },
  { text: 'Weighted blanket', effort: 1, category: 'sensory', categoryTitle: 'Sensory Soothers', description: 'Use deep pressure for calming', duration: '15min' },
  { text: 'Soft texture stroking', effort: 1, category: 'sensory', categoryTitle: 'Sensory Soothers', description: 'Pet, blanket, or soft fabric', duration: '5min' },
  { text: 'Aromatherapy', effort: 1, category: 'sensory', categoryTitle: 'Sensory Soothers', description: 'Lavender, chamomile, or your favorite scent', duration: '10min' },
  { text: 'Dim the lights', effort: 1, category: 'sensory', categoryTitle: 'Sensory Soothers', description: 'Reduce visual stimulation', duration: '1min' },
  { text: 'White noise or nature sounds', effort: 1, category: 'sensory', categoryTitle: 'Sensory Soothers', description: 'Rain, ocean waves, or forest sounds', duration: '15min' },
  { text: 'Warm shower or bath', effort: 2, category: 'sensory', categoryTitle: 'Sensory Soothers', description: 'Soothing water temperature', duration: '15min' },

  // Movement & Exercise (Effort 2-3)
  { text: 'Short walk outside', effort: 2, category: 'movement', categoryTitle: 'Movement & Exercise', description: '5-10 minute gentle walk', duration: '10min' },
  { text: 'Gentle stretching', effort: 2, category: 'movement', categoryTitle: 'Movement & Exercise', description: 'Slow, mindful stretches', duration: '10min' },
  { text: 'Dance to one song', effort: 2, category: 'movement', categoryTitle: 'Movement & Exercise', description: 'Move freely to your favorite upbeat song', duration: '3min' },
  { text: 'Yoga flow', effort: 3, category: 'movement', categoryTitle: 'Movement & Exercise', description: 'Gentle yoga sequence', duration: '20min' },
  { text: 'Jumping jacks', effort: 2, category: 'movement', categoryTitle: 'Movement & Exercise', description: '20-30 jumping jacks for energy release', duration: '2min' },
  { text: 'Tai chi movements', effort: 2, category: 'movement', categoryTitle: 'Movement & Exercise', description: 'Slow, flowing movements', duration: '10min' },
  { text: 'Shake it out', effort: 1, category: 'movement', categoryTitle: 'Movement & Exercise', description: 'Shake your whole body loose', duration: '2min' },

  // Creative Expression (Effort 1-3)
  { text: 'Free writing', effort: 2, category: 'creative', categoryTitle: 'Creative Expression', description: 'Write without stopping for 5 minutes', duration: '5min' },
  { text: 'Doodle or scribble', effort: 1, category: 'creative', categoryTitle: 'Creative Expression', description: 'No-pressure drawing', duration: '10min' },
  { text: 'Coloring book', effort: 1, category: 'creative', categoryTitle: 'Creative Expression', description: 'Meditative coloring', duration: '15min' },
  { text: 'Play an instrument', effort: 2, category: 'creative', categoryTitle: 'Creative Expression', description: 'Even just a few notes or chords', duration: '10min' },
  { text: 'Sing or hum', effort: 1, category: 'creative', categoryTitle: 'Creative Expression', description: 'Use your voice freely', duration: '5min' },
  { text: 'Clay or playdough', effort: 2, category: 'creative', categoryTitle: 'Creative Expression', description: 'Tactile creative expression', duration: '15min' },
  { text: 'Photograph 5 beautiful things', effort: 2, category: 'creative', categoryTitle: 'Creative Expression', description: 'Find beauty around you', duration: '10min' },
  { text: 'Create a playlist', effort: 2, category: 'creative', categoryTitle: 'Creative Expression', description: 'Curate music for your mood', duration: '15min' },

  // Social Connection (Effort 1-3)
  { text: 'Text a friend', effort: 1, category: 'social', categoryTitle: 'Social Connection', description: 'Reach out with a simple check-in', duration: '5min' },
  { text: 'Hug someone or pet', effort: 1, category: 'social', categoryTitle: 'Social Connection', description: '20-second hug for oxytocin', duration: '1min' },
  { text: 'Watch comfort show', effort: 1, category: 'social', categoryTitle: 'Social Connection', description: 'Familiar, soothing content', duration: '20min' },
  { text: 'Join online support chat', effort: 2, category: 'social', categoryTitle: 'Social Connection', description: 'Connect with understanding community', duration: '15min' },
  { text: 'Call a support line', effort: 2, category: 'social', categoryTitle: 'Social Connection', description: 'Professional support available 24/7', duration: '30min' },
  { text: 'Video call a loved one', effort: 2, category: 'social', categoryTitle: 'Social Connection', description: 'Face-to-face connection', duration: '15min' },
  { text: 'Read positive messages', effort: 1, category: 'social', categoryTitle: 'Social Connection', description: 'Review saved kind words', duration: '5min' },

  // Cognitive Reframing (Effort 2-3)
  { text: 'Challenge negative thought', effort: 2, category: 'cognitive', categoryTitle: 'Cognitive Reframing', description: 'Ask: Is this thought true? Helpful?', duration: '5min' },
  { text: 'Gratitude list (3 things)', effort: 2, category: 'cognitive', categoryTitle: 'Cognitive Reframing', description: 'Write 3 things you\'re grateful for', duration: '5min' },
  { text: 'Reframe as temporary', effort: 2, category: 'cognitive', categoryTitle: 'Cognitive Reframing', description: 'Add "right now" to negative thoughts', duration: '3min' },
  { text: 'Best friend perspective', effort: 2, category: 'cognitive', categoryTitle: 'Cognitive Reframing', description: 'What would you tell a friend?', duration: '5min' },
  { text: 'Evidence for and against', effort: 3, category: 'cognitive', categoryTitle: 'Cognitive Reframing', description: 'List evidence objectively', duration: '10min' },
  { text: 'Worry postponement', effort: 2, category: 'cognitive', categoryTitle: 'Cognitive Reframing', description: 'Schedule a "worry time" for later', duration: '2min' },

  // Self-Compassion (Effort 1-2)
  { text: 'Self-compassion mantra', effort: 1, category: 'compassion', categoryTitle: 'Self-Compassion', description: '"May I be kind to myself in this moment"', duration: '2min' },
  { text: 'Hand on heart', effort: 1, category: 'compassion', categoryTitle: 'Self-Compassion', description: 'Place hand on heart, breathe compassion', duration: '3min' },
  { text: 'Write kind letter to self', effort: 2, category: 'compassion', categoryTitle: 'Self-Compassion', description: 'As if to a dear friend', duration: '10min' },
  { text: 'Permission to rest', effort: 1, category: 'compassion', categoryTitle: 'Self-Compassion', description: 'Explicitly give yourself permission', duration: '1min' },
  { text: 'Loving-kindness meditation', effort: 2, category: 'compassion', categoryTitle: 'Self-Compassion', description: 'Metta practice starting with self', duration: '10min' },
  { text: 'Affirmations mirror work', effort: 2, category: 'compassion', categoryTitle: 'Self-Compassion', description: 'Look in mirror, speak kindly', duration: '5min' },

  // Pacing & Energy (Effort 1-2)
  { text: 'Set a 5-minute timer', effort: 1, category: 'pacing', categoryTitle: 'Pacing & Energy', description: 'Just 5 minutes of gentle activity', duration: '5min' },
  { text: 'Energy level check', effort: 1, category: 'pacing', categoryTitle: 'Pacing & Energy', description: 'Rate 1-10, adjust accordingly', duration: '2min' },
  { text: 'Micro-rest break', effort: 1, category: 'pacing', categoryTitle: 'Pacing & Energy', description: 'Close eyes for 60 seconds', duration: '1min' },
  { text: 'One thing at a time', effort: 1, category: 'pacing', categoryTitle: 'Pacing & Energy', description: 'Choose just one task, let go of rest', duration: '2min' },
  { text: 'Planned rest period', effort: 1, category: 'pacing', categoryTitle: 'Pacing & Energy', description: 'Intentional 15-minute break', duration: '15min' },
  { text: 'Energy-first prioritization', effort: 2, category: 'pacing', categoryTitle: 'Pacing & Energy', description: 'Reorder tasks by energy available', duration: '5min' },

  // Nature & Environment (Effort 1-3)
  { text: 'Sit in sunlight', effort: 1, category: 'nature', categoryTitle: 'Nature & Environment', description: '5-10 minutes of natural light', duration: '10min' },
  { text: 'Water a plant', effort: 1, category: 'nature', categoryTitle: 'Nature & Environment', description: 'Nurture something living', duration: '3min' },
  { text: 'Open a window', effort: 1, category: 'nature', categoryTitle: 'Nature & Environment', description: 'Let in fresh air', duration: '1min' },
  { text: 'Watch clouds or trees', effort: 1, category: 'nature', categoryTitle: 'Nature & Environment', description: 'Mindful nature observation', duration: '5min' },
  { text: 'Barefoot on grass', effort: 2, category: 'nature', categoryTitle: 'Nature & Environment', description: 'Earthing/grounding practice', duration: '10min' },
  { text: 'Bird watching', effort: 2, category: 'nature', categoryTitle: 'Nature & Environment', description: 'Observe birds from window or outside', duration: '15min' },
  { text: 'Garden or tend plants', effort: 3, category: 'nature', categoryTitle: 'Nature & Environment', description: 'Gentle gardening activities', duration: '20min' },
];

export default function MentalHealthPage() {
  const [query, setQuery] = useState('');
  const [effort, setEffort] = useState(3);
  const [activeCats, setActiveCats] = useState<string[]>(CATEGORIES.map(c => c.id));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'category' | 'effort' | 'duration'>('category');
  const [timer, setTimer] = useState(0);

  const filtered = useMemo(() => {
    let results = COPING_STRATEGIES.filter(strategy =>
      activeCats.includes(strategy.category) &&
      strategy.effort <= effort &&
      (query === '' ||
        strategy.text.toLowerCase().includes(query.toLowerCase()) ||
        strategy.description?.toLowerCase().includes(query.toLowerCase()) ||
        strategy.categoryTitle.toLowerCase().includes(query.toLowerCase()))
    );

    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      results = results.filter(s => favorites.includes(s.text));
    }

    // Sort results
    results.sort((a, b) => {
      if (sortBy === 'effort') return a.effort - b.effort;
      if (sortBy === 'duration') {
        const aDuration = parseInt(a.duration || '0');
        const bDuration = parseInt(b.duration || '0');
        return aDuration - bDuration;
      }
      // Default: sort by category
      return a.category.localeCompare(b.category);
    });

    return results;
  }, [query, effort, activeCats, favorites, showFavoritesOnly, sortBy]);

  const toggleCat = (id: string) => {
    setActiveCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleFav = (text: string) => {
    setFavorites(f => f.includes(text) ? f.filter(x => x !== text) : [...f, text]);
  };

  const getRandomStrategy = () => {
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      return random;
    }
    return null;
  };

  const selectAllCategories = () => {
    setActiveCats(CATEGORIES.map(c => c.id));
  };

  const clearAllCategories = () => {
    setActiveCats([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-purple-950 pl-20 p-8">
      <header className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
          Mental Health Toolkit
        </h1>
        <p className="text-indigo-300 text-lg">
          {COPING_STRATEGIES.length} evidence-based coping strategies across {CATEGORIES.length} categories
        </p>
        {favorites.length > 0 && (
          <p className="text-pink-400 text-sm mt-1">
            {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
          </p>
        )}
      </header>

      {/* Search & Filters */}
      <div className="bg-indigo-900/40 rounded-2xl p-6 border border-indigo-700/30 backdrop-blur-sm mb-6">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              placeholder="Search strategies, descriptions, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-indigo-950/50 border border-indigo-700/50 rounded-xl px-10 py-3 text-white placeholder-indigo-400 focus:outline-none focus:border-purple-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-indigo-300 whitespace-nowrap">Max Effort:</span>
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'category' | 'effort' | 'duration')}
              className="flex-1 bg-indigo-950/50 border border-indigo-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="category">Sort: Category</option>
              <option value="effort">Sort: Effort</option>
              <option value="duration">Sort: Duration</option>
            </select>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              showFavoritesOnly
                ? 'bg-pink-600 text-white'
                : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50'
            }`}
          >
            <Heart className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            {showFavoritesOnly ? 'Favorites Only' : 'Show All'}
          </button>
          <button
            onClick={selectAllCategories}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50 transition"
          >
            Select All
          </button>
          <button
            onClick={clearAllCategories}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50 transition"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              const random = getRandomStrategy();
              if (random) {
                alert(`Try this: ${random.text}\n\n${random.description}\n\nDuration: ${random.duration}\nEffort: ${random.effort}/3`);
              }
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Random Strategy
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                activeCats.includes(cat.id)
                  ? 'bg-purple-600 text-white'
                  : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-indigo-300">
          Showing <span className="text-white font-bold">{filtered.length}</span> of{' '}
          <span className="text-white font-bold">{COPING_STRATEGIES.length}</span> strategies
          {showFavoritesOnly && (
            <span className="ml-2 text-pink-400">(Favorites only)</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-indigo-400">
            {activeCats.length} of {CATEGORIES.length} categories active
          </span>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-indigo-400 text-lg mb-2">No strategies found</p>
              <p className="text-indigo-500 text-sm">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          ) : (
            filtered.map((strategy) => (
              <motion.div
                key={strategy.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-indigo-900/40 rounded-2xl p-5 border border-indigo-700/30 backdrop-blur-sm hover:border-purple-500/50 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition">
                      {strategy.text}
                    </h3>
                    <p className="text-xs text-indigo-400 mb-2 flex items-center gap-1">
                      <span>
                        {CATEGORIES.find(c => c.id === strategy.category)?.icon}
                      </span>
                      {strategy.categoryTitle}
                    </p>
                    {strategy.description && (
                      <p className="text-sm text-indigo-300 leading-relaxed">
                        {strategy.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFav(strategy.text)}
                    className={`p-2 rounded-lg transition flex-shrink-0 ${
                      favorites.includes(strategy.text)
                        ? 'bg-pink-600 text-white'
                        : 'bg-indigo-900/50 text-indigo-400 hover:bg-indigo-800/50'
                    }`}
                    title={favorites.includes(strategy.text) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className="w-4 h-4" fill={favorites.includes(strategy.text) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-indigo-700/30">
                  <div className="flex items-center gap-2">
                    {[...Array(strategy.effort)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-purple-500" />
                    ))}
                    <span className="text-xs text-indigo-400">Effort {strategy.effort}/3</span>
                  </div>
                  {strategy.duration && (
                    <div className="flex items-center gap-1 text-xs text-indigo-400">
                      <Timer className="w-3 h-3" />
                      {strategy.duration}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Information Cards */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="bg-indigo-900/20 rounded-2xl p-6 border border-indigo-700/30">
          <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            How to Use This Toolkit
          </h3>
          <ul className="text-indigo-300 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span><strong>Effort Filter:</strong> Shows only strategies at or under your energy level (1=lowest, 3=highest)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span><strong>Search:</strong> Find strategies by name, description, or category</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span><strong>Favorites:</strong> Build your personal coping plan by saving what works for you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span><strong>Random Strategy:</strong> Let the toolkit choose for you when decision fatigue hits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span><strong>Categories:</strong> Filter by technique type to find what resonates with you</span>
            </li>
          </ul>
        </div>

        <div className="bg-rose-900/20 rounded-2xl p-6 border border-rose-700/30">
          <h3 className="text-rose-400 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Crisis Resources
          </h3>
          <div className="text-indigo-300 text-sm space-y-3">
            <p>If you're in crisis or experiencing thoughts of self-harm, please reach out for professional help:</p>
            <div className="bg-rose-950/30 rounded-lg p-3 space-y-1">
              <p className="font-semibold text-white">24/7 Crisis Hotlines:</p>
              <p>🇺🇸 <strong>988</strong> - Suicide & Crisis Lifeline</p>
              <p>🇺🇸 <strong>1-800-273-8255</strong> - National Suicide Prevention</p>
              <p>📱 <strong>Text "HELLO" to 741741</strong> - Crisis Text Line</p>
            </div>
            <p className="text-xs text-indigo-400">
              These strategies are tools for daily coping, not substitutes for professional mental health care.
            </p>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="mt-6 bg-indigo-900/20 rounded-2xl p-6 border border-indigo-700/30">
        <h3 className="text-purple-400 font-semibold mb-4">Strategies by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => {
            const count = COPING_STRATEGIES.filter(s => s.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-indigo-950/50 rounded-lg p-3 text-center border border-indigo-700/30"
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs text-indigo-400 mb-1">{cat.title}</div>
                <div className="text-lg font-bold text-white">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-indigo-400 text-sm">
        <p>
          Built with compassion for mental health support • {COPING_STRATEGIES.length} strategies •
          Evidence-based techniques from CBT, DBT, mindfulness, and somatic practices
        </p>
      </div>
    </div>
  );
}
