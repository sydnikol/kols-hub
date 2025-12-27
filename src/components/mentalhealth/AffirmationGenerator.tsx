import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Heart,
  Star,
  Moon,
  Sun,
  Zap,
  Shield,
  Feather,
  Shuffle,
  Copy,
  Share2,
  Bookmark,
  BookmarkCheck,
  Plus,
  X,
  ChevronDown,
  Check,
  Edit2,
  Trash2,
  Search,
  Filter,
  Clock,
} from 'lucide-react';

// Types
interface Affirmation {
  id: string;
  text: string;
  category: string;
  isCustom?: boolean;
}

interface AffirmationCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Categories
const categories: AffirmationCategory[] = [
  { id: 'self-love', name: 'Self-Love', icon: <Heart className="w-5 h-5" />, color: 'from-rose-600 to-pink-700', description: 'Embrace your worth' },
  { id: 'strength', name: 'Strength', icon: <Shield className="w-5 h-5" />, color: 'from-amber-600 to-orange-700', description: 'Find your power' },
  { id: 'peace', name: 'Peace', icon: <Feather className="w-5 h-5" />, color: 'from-teal-600 to-cyan-700', description: 'Cultivate calm' },
  { id: 'growth', name: 'Growth', icon: <Zap className="w-5 h-5" />, color: 'from-green-600 to-emerald-700', description: 'Evolve continuously' },
  { id: 'confidence', name: 'Confidence', icon: <Star className="w-5 h-5" />, color: 'from-purple-600 to-violet-700', description: 'Trust yourself' },
  { id: 'healing', name: 'Healing', icon: <Moon className="w-5 h-5" />, color: 'from-indigo-600 to-blue-700', description: 'Restore your spirit' },
  { id: 'abundance', name: 'Abundance', icon: <Sun className="w-5 h-5" />, color: 'from-yellow-600 to-amber-700', description: 'Attract prosperity' },
  { id: 'custom', name: 'My Affirmations', icon: <Sparkles className="w-5 h-5" />, color: 'from-fuchsia-600 to-pink-700', description: 'Personal mantras' },
];

// 100+ Affirmations
const defaultAffirmations: Affirmation[] = [
  // Self-Love (15)
  { id: 'sl1', text: 'I am worthy of love and belonging exactly as I am.', category: 'self-love' },
  { id: 'sl2', text: 'I embrace my shadows as part of my beautiful whole.', category: 'self-love' },
  { id: 'sl3', text: 'My imperfections make me uniquely magnificent.', category: 'self-love' },
  { id: 'sl4', text: 'I honor my needs and treat myself with compassion.', category: 'self-love' },
  { id: 'sl5', text: 'I am enough, just as I am in this moment.', category: 'self-love' },
  { id: 'sl6', text: 'I forgive myself and release all self-judgment.', category: 'self-love' },
  { id: 'sl7', text: 'My self-worth is not determined by others opinions.', category: 'self-love' },
  { id: 'sl8', text: 'I celebrate my strengths and accept my weaknesses.', category: 'self-love' },
  { id: 'sl9', text: 'I deserve rest, joy, and all good things.', category: 'self-love' },
  { id: 'sl10', text: 'I am my own best friend and fiercest advocate.', category: 'self-love' },
  { id: 'sl11', text: 'My body is a sacred temple deserving of care.', category: 'self-love' },
  { id: 'sl12', text: 'I choose to speak kindly to myself always.', category: 'self-love' },
  { id: 'sl13', text: 'I am deserving of my own love and affection.', category: 'self-love' },
  { id: 'sl14', text: 'My past does not define my present worth.', category: 'self-love' },
  { id: 'sl15', text: 'I radiate self-love in all that I do.', category: 'self-love' },

  // Strength (15)
  { id: 'st1', text: 'I am stronger than any challenge before me.', category: 'strength' },
  { id: 'st2', text: 'My resilience is forged in the fires of adversity.', category: 'strength' },
  { id: 'st3', text: 'I have survived every difficult day so far.', category: 'strength' },
  { id: 'st4', text: 'My power lies in my ability to persevere.', category: 'strength' },
  { id: 'st5', text: 'I bend but never break in the storms of life.', category: 'strength' },
  { id: 'st6', text: 'Each struggle is making me wiser and stronger.', category: 'strength' },
  { id: 'st7', text: 'I am a warrior of light in times of darkness.', category: 'strength' },
  { id: 'st8', text: 'My courage grows with every fear I face.', category: 'strength' },
  { id: 'st9', text: 'I draw strength from the ancestors who came before me.', category: 'strength' },
  { id: 'st10', text: 'I am capable of overcoming any obstacle.', category: 'strength' },
  { id: 'st11', text: 'My inner strength is my greatest superpower.', category: 'strength' },
  { id: 'st12', text: 'I rise every time I fall, stronger than before.', category: 'strength' },
  { id: 'st13', text: 'Challenges are opportunities for growth in disguise.', category: 'strength' },
  { id: 'st14', text: 'I trust my ability to handle whatever comes.', category: 'strength' },
  { id: 'st15', text: 'My spirit is unbreakable and my will is iron.', category: 'strength' },

  // Peace (15)
  { id: 'pc1', text: 'I release what I cannot control and find peace.', category: 'peace' },
  { id: 'pc2', text: 'Tranquility flows through me like a gentle river.', category: 'peace' },
  { id: 'pc3', text: 'I breathe in calm and exhale all tension.', category: 'peace' },
  { id: 'pc4', text: 'My mind is a sanctuary of stillness and peace.', category: 'peace' },
  { id: 'pc5', text: 'I choose serenity over chaos in every moment.', category: 'peace' },
  { id: 'pc6', text: 'Peace is my natural state of being.', category: 'peace' },
  { id: 'pc7', text: 'I am centered, grounded, and at peace with myself.', category: 'peace' },
  { id: 'pc8', text: 'I let go of worry and embrace the present moment.', category: 'peace' },
  { id: 'pc9', text: 'My soul rests in a place of deep tranquility.', category: 'peace' },
  { id: 'pc10', text: 'I create peaceful spaces within and around me.', category: 'peace' },
  { id: 'pc11', text: 'Stillness and silence nourish my spirit.', category: 'peace' },
  { id: 'pc12', text: 'I am at peace with my past and excited for my future.', category: 'peace' },
  { id: 'pc13', text: 'I radiate calm energy to everyone around me.', category: 'peace' },
  { id: 'pc14', text: 'My heart beats in harmony with the universe.', category: 'peace' },
  { id: 'pc15', text: 'I find peace in the beautiful chaos of life.', category: 'peace' },

  // Growth (15)
  { id: 'gr1', text: 'Every day I am becoming more of who I am meant to be.', category: 'growth' },
  { id: 'gr2', text: 'I embrace change as a catalyst for transformation.', category: 'growth' },
  { id: 'gr3', text: 'My potential is limitless and ever-expanding.', category: 'growth' },
  { id: 'gr4', text: 'I learn valuable lessons from every experience.', category: 'growth' },
  { id: 'gr5', text: 'I am open to new perspectives and possibilities.', category: 'growth' },
  { id: 'gr6', text: 'My comfort zone expands daily as I grow braver.', category: 'growth' },
  { id: 'gr7', text: 'I am a work in progress and thats beautiful.', category: 'growth' },
  { id: 'gr8', text: 'Every setback is a setup for a comeback.', category: 'growth' },
  { id: 'gr9', text: 'I nourish my mind, body, and soul daily.', category: 'growth' },
  { id: 'gr10', text: 'I am constantly evolving into my highest self.', category: 'growth' },
  { id: 'gr11', text: 'Growth requires patience and I am patient with myself.', category: 'growth' },
  { id: 'gr12', text: 'I welcome new beginnings with open arms.', category: 'growth' },
  { id: 'gr13', text: 'My journey of growth is unique and sacred.', category: 'growth' },
  { id: 'gr14', text: 'I plant seeds today that will bloom tomorrow.', category: 'growth' },
  { id: 'gr15', text: 'I am committed to my personal evolution.', category: 'growth' },

  // Confidence (15)
  { id: 'cf1', text: 'I trust my intuition and make wise decisions.', category: 'confidence' },
  { id: 'cf2', text: 'I walk through life with grace and confidence.', category: 'confidence' },
  { id: 'cf3', text: 'My voice matters and deserves to be heard.', category: 'confidence' },
  { id: 'cf4', text: 'I believe in my abilities and trust my path.', category: 'confidence' },
  { id: 'cf5', text: 'I radiate confidence and attract success.', category: 'confidence' },
  { id: 'cf6', text: 'I am bold, brilliant, and beautifully unique.', category: 'confidence' },
  { id: 'cf7', text: 'My presence commands respect and admiration.', category: 'confidence' },
  { id: 'cf8', text: 'I stand tall in my truth and power.', category: 'confidence' },
  { id: 'cf9', text: 'I am capable of achieving anything I set my mind to.', category: 'confidence' },
  { id: 'cf10', text: 'Self-doubt has no power over me.', category: 'confidence' },
  { id: 'cf11', text: 'I celebrate my victories, no matter how small.', category: 'confidence' },
  { id: 'cf12', text: 'I speak my truth with clarity and courage.', category: 'confidence' },
  { id: 'cf13', text: 'I am the author of my own success story.', category: 'confidence' },
  { id: 'cf14', text: 'My confidence grows stronger every single day.', category: 'confidence' },
  { id: 'cf15', text: 'I own my power and use it wisely.', category: 'confidence' },

  // Healing (15)
  { id: 'hl1', text: 'My body knows how to heal itself and I trust it.', category: 'healing' },
  { id: 'hl2', text: 'I release all that no longer serves my highest good.', category: 'healing' },
  { id: 'hl3', text: 'Healing energy flows through every cell of my being.', category: 'healing' },
  { id: 'hl4', text: 'I am gentle with myself as I heal and grow.', category: 'healing' },
  { id: 'hl5', text: 'Every breath brings me closer to wholeness.', category: 'healing' },
  { id: 'hl6', text: 'I honor my healing journey at my own pace.', category: 'healing' },
  { id: 'hl7', text: 'My wounds are transforming into wisdom.', category: 'healing' },
  { id: 'hl8', text: 'I choose healing thoughts that nourish my soul.', category: 'healing' },
  { id: 'hl9', text: 'Light fills the dark spaces within me.', category: 'healing' },
  { id: 'hl10', text: 'I am worthy of complete healing and restoration.', category: 'healing' },
  { id: 'hl11', text: 'My heart heals a little more each day.', category: 'healing' },
  { id: 'hl12', text: 'I forgive others and myself to free my spirit.', category: 'healing' },
  { id: 'hl13', text: 'Rest is a sacred part of my healing process.', category: 'healing' },
  { id: 'hl14', text: 'I surround myself with healing energy and love.', category: 'healing' },
  { id: 'hl15', text: 'My scars tell a story of survival and strength.', category: 'healing' },

  // Abundance (15)
  { id: 'ab1', text: 'Abundance flows to me from expected and unexpected sources.', category: 'abundance' },
  { id: 'ab2', text: 'I am a magnet for prosperity and success.', category: 'abundance' },
  { id: 'ab3', text: 'The universe provides for all my needs.', category: 'abundance' },
  { id: 'ab4', text: 'I attract wealth, health, and happiness.', category: 'abundance' },
  { id: 'ab5', text: 'I am open to receiving all the good life has to offer.', category: 'abundance' },
  { id: 'ab6', text: 'Money comes to me easily and effortlessly.', category: 'abundance' },
  { id: 'ab7', text: 'I live in an abundant universe with endless possibilities.', category: 'abundance' },
  { id: 'ab8', text: 'Gratitude multiplies my blessings.', category: 'abundance' },
  { id: 'ab9', text: 'I deserve to live a life of abundance and joy.', category: 'abundance' },
  { id: 'ab10', text: 'Opportunities for wealth are all around me.', category: 'abundance' },
  { id: 'ab11', text: 'I release all blocks to receiving abundance.', category: 'abundance' },
  { id: 'ab12', text: 'My cup overflows with blessings.', category: 'abundance' },
  { id: 'ab13', text: 'I am financially free and secure.', category: 'abundance' },
  { id: 'ab14', text: 'Abundance is my birthright and I claim it now.', category: 'abundance' },
  { id: 'ab15', text: 'I give and receive abundance with an open heart.', category: 'abundance' },
];

const AffirmationGenerator: React.FC = () => {
  const [affirmations, setAffirmations] = useState<Affirmation[]>(defaultAffirmations);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'daily' | 'browse' | 'favorites'>('daily');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dailyAffirmation, setDailyAffirmation] = useState<Affirmation | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('affirmation-favorites');
    const savedCustom = localStorage.getItem('affirmation-custom');
    const savedDaily = localStorage.getItem('affirmation-daily');

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    if (savedCustom) {
      const customAffirmations = JSON.parse(savedCustom);
      setAffirmations([...defaultAffirmations, ...customAffirmations]);
    }

    if (savedDaily) {
      const { affirmation, date } = JSON.parse(savedDaily);
      const today = new Date().toDateString();
      if (date === today) {
        setDailyAffirmation(affirmation);
      } else {
        generateDailyAffirmation();
      }
    } else {
      generateDailyAffirmation();
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('affirmation-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Generate daily affirmation
  const generateDailyAffirmation = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * defaultAffirmations.length);
    const affirmation = defaultAffirmations[randomIndex];
    setDailyAffirmation(affirmation);
    localStorage.setItem(
      'affirmation-daily',
      JSON.stringify({ affirmation, date: new Date().toDateString() })
    );
  }, []);

  // Filter affirmations
  const filteredAffirmations = useMemo(() => {
    let filtered = affirmations;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.text.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    if (viewMode === 'favorites') {
      filtered = filtered.filter((a) => favorites.includes(a.id));
    }

    return filtered;
  }, [affirmations, selectedCategory, searchQuery, viewMode, favorites]);

  // Get random affirmation
  const getRandomAffirmation = () => {
    const source = selectedCategory === 'all' ? affirmations : filteredAffirmations;
    const randomIndex = Math.floor(Math.random() * source.length);
    setCurrentAffirmation(source[randomIndex]);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Share
  const shareAffirmation = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Affirmation',
          text: text,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      copyToClipboard(text, 'share');
    }
  };

  // Add custom affirmation
  const addCustomAffirmation = () => {
    if (!newAffirmation.trim()) return;

    const custom: Affirmation = {
      id: `custom-${Date.now()}`,
      text: newAffirmation.trim(),
      category: 'custom',
      isCustom: true,
    };

    const newAffirmations = [...affirmations, custom];
    setAffirmations(newAffirmations);

    // Save custom affirmations
    const customOnes = newAffirmations.filter((a) => a.isCustom);
    localStorage.setItem('affirmation-custom', JSON.stringify(customOnes));

    setNewAffirmation('');
    setShowAddModal(false);
  };

  // Delete custom affirmation
  const deleteCustomAffirmation = (id: string) => {
    const updated = affirmations.filter((a) => a.id !== id);
    setAffirmations(updated);
    setFavorites((prev) => prev.filter((f) => f !== id));

    const customOnes = updated.filter((a) => a.isCustom);
    localStorage.setItem('affirmation-custom', JSON.stringify(customOnes));
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || categories[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-fuchsia-950 to-slate-950 text-white p-4 md:p-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-fuchsia-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Affirmation Generator
            </h1>
            <Star className="w-8 h-8 text-pink-400" />
          </div>
          <p className="text-gray-400 text-lg">Speak your truth into existence</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'daily', label: 'Daily', icon: <Sun className="w-4 h-4" /> },
            { id: 'browse', label: 'Browse', icon: <Search className="w-4 h-4" /> },
            { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
                viewMode === tab.id
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily View */}
        {viewMode === 'daily' && dailyAffirmation && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-8 md:p-12 shadow-2xl text-center">
            <div className="flex items-center justify-center gap-2 text-fuchsia-400 mb-6">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Today's Affirmation</span>
            </div>

            <div className={`inline-block p-3 rounded-xl bg-gradient-to-r ${getCategoryInfo(dailyAffirmation.category).color} mb-6`}>
              {getCategoryInfo(dailyAffirmation.category).icon}
            </div>

            <blockquote className="text-2xl md:text-3xl font-light text-gray-200 italic mb-8 leading-relaxed">
              "{dailyAffirmation.text}"
            </blockquote>

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => toggleFavorite(dailyAffirmation.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  favorites.includes(dailyAffirmation.id)
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                {favorites.includes(dailyAffirmation.id) ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
                {favorites.includes(dailyAffirmation.id) ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={() => copyToClipboard(dailyAffirmation.text, dailyAffirmation.id)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-gray-400 hover:bg-slate-700 transition-all"
              >
                {copiedId === dailyAffirmation.id ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                Copy
              </button>

              <button
                onClick={() => shareAffirmation(dailyAffirmation.text)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-gray-400 hover:bg-slate-700 transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            <button
              onClick={getRandomAffirmation}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl font-semibold hover:from-fuchsia-500 hover:to-pink-500 transition-all mx-auto"
            >
              <Shuffle className="w-5 h-5" />
              Get Another
            </button>

            {currentAffirmation && currentAffirmation.id !== dailyAffirmation.id && (
              <div className="mt-8 p-6 bg-slate-800/50 rounded-xl">
                <p className="text-lg text-gray-300 italic">"{currentAffirmation.text}"</p>
                <span className="text-sm text-fuchsia-400 mt-2 block">
                  {getCategoryInfo(currentAffirmation.category).name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Browse View */}
        {viewMode === 'browse' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search affirmations..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-fuchsia-500/20 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-900/80 border border-fuchsia-500/20 rounded-xl text-gray-300 focus:outline-none focus:border-fuchsia-500/50"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 rounded-xl font-medium hover:bg-fuchsia-500 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Custom
              </button>
            </div>

            {/* Category Cards */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {categories.slice(0, -1).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-xl bg-gradient-to-br ${cat.color} text-center hover:scale-105 transition-all`}
                  >
                    <div className="flex justify-center mb-2">{cat.icon}</div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-xs opacity-80">
                      {affirmations.filter((a) => a.category === cat.id).length}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Affirmation List */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  {filteredAffirmations.length} affirmations
                </span>
                <button
                  onClick={getRandomAffirmation}
                  className="flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300"
                >
                  <Shuffle className="w-4 h-4" />
                  Random
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredAffirmations.map((affirmation) => {
                  const category = getCategoryInfo(affirmation.category);
                  return (
                    <div
                      key={affirmation.id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-fuchsia-500/10 hover:border-fuchsia-500/30 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} flex-shrink-0`}>
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-200">{affirmation.text}</p>
                          <span className="text-xs text-fuchsia-400 mt-1 block">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleFavorite(affirmation.id)}
                            className={`p-2 rounded-lg transition-all ${
                              favorites.includes(affirmation.id)
                                ? 'text-pink-400 bg-pink-900/30'
                                : 'text-gray-500 hover:bg-slate-700'
                            }`}
                          >
                            {favorites.includes(affirmation.id) ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(affirmation.text, affirmation.id)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-slate-700 transition-all"
                          >
                            {copiedId === affirmation.id ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          {affirmation.isCustom && (
                            <button
                              onClick={() => deleteCustomAffirmation(affirmation.id)}
                              className="p-2 rounded-lg text-red-400 hover:bg-red-900/30 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredAffirmations.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No affirmations found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Favorites View */}
        {viewMode === 'favorites' && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-fuchsia-500/20 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-fuchsia-400 mb-6 text-center flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              My Favorites ({favorites.length})
            </h2>

            {favorites.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No favorites yet. Save affirmations that resonate with you!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredAffirmations.map((affirmation) => {
                  const category = getCategoryInfo(affirmation.category);
                  return (
                    <div
                      key={affirmation.id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-pink-500/20"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200">{affirmation.text}</p>
                          <span className="text-xs text-fuchsia-400 mt-1 block">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(affirmation.text, affirmation.id)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-slate-700 transition-all"
                          >
                            {copiedId === affirmation.id ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => shareAffirmation(affirmation.text)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-slate-700 transition-all"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleFavorite(affirmation.id)}
                            className="p-2 rounded-lg text-pink-400 hover:bg-pink-900/30 transition-all"
                          >
                            <BookmarkCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add Custom Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-fuchsia-500/30 max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-fuchsia-500/20">
                <h2 className="text-xl font-semibold text-fuchsia-400">Create Your Affirmation</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-400 text-sm mb-4">
                  Write an affirmation that speaks to your soul. Use "I am" or "I" statements for maximum impact.
                </p>

                <textarea
                  value={newAffirmation}
                  onChange={(e) => setNewAffirmation(e.target.value)}
                  placeholder="I am worthy of love and success..."
                  className="w-full p-4 bg-slate-800/50 border border-fuchsia-500/20 rounded-xl text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-fuchsia-500/50"
                  rows={4}
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-slate-800 rounded-xl text-gray-400 hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomAffirmation}
                    disabled={!newAffirmation.trim()}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      newAffirmation.trim()
                        ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white hover:from-fuchsia-500 hover:to-pink-500'
                        : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffirmationGenerator;
