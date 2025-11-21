import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Flame, Droplet, Leaf, Moon, Sun, Star, Wind,
  Book, ShoppingBag, Clock, Filter, Heart, Shield, DollarSign,
  Users, Zap, Target, CheckCircle, AlertCircle, Plus, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HoodooPractice {
  id: number;
  practice: string;
  time: string;
  spoons: number;
  tags: string[];
  materials: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  intention: string;
}

const hoodooData = {
  "hoodoo": [
    // BEGINNER - DAILY PRACTICES (Spoons: 1)
    { id: 1, practice: "Light white candle for ancestors, offer water", time: "5 min", spoons: 1, tags: ["ancestor-work", "daily", "simple"], materials: ["white-candle", "water", "matches"], category: "Ancestor Work", difficulty: "beginner" as const, intention: "Honor & Connection" },
    { id: 2, practice: "Salt at thresholds (door, window)", time: "3 min", spoons: 1, tags: ["protection", "cleansing", "home"], materials: ["salt"], category: "Protection", difficulty: "beginner" as const, intention: "Home Protection" },
    { id: 3, practice: "Bay leaf wish - write, burn, release", time: "10 min", spoons: 1, tags: ["manifestation", "fire", "intentions"], materials: ["bay-leaf", "pen", "fireproof-dish"], category: "Manifestation", difficulty: "beginner" as const, intention: "Wish Fulfillment" },
    { id: 4, practice: "Florida Water spritz for cleansing", time: "2 min", spoons: 1, tags: ["cleansing", "quick", "spiritual-hygiene"], materials: ["florida-water", "spray-bottle"], category: "Cleansing", difficulty: "beginner" as const, intention: "Spiritual Hygiene" },
    { id: 5, practice: "Speak to photo of ancestor, ask for guidance", time: "5 min", spoons: 1, tags: ["ancestor-work", "communication", "guidance"], materials: ["ancestor-photo", "candle"], category: "Ancestor Work", difficulty: "beginner" as const, intention: "Guidance" },
    { id: 14, practice: "Place crystal on altar with intention", time: "3 min", spoons: 1, tags: ["crystal-work", "altar-maintenance"], materials: ["crystal"], category: "Altar Work", difficulty: "beginner" as const, intention: "Energy Amplification" },
    { id: 13, practice: "Burn incense for clarity/peace", time: "5 min", spoons: 1, tags: ["smoke-cleansing", "atmosphere"], materials: ["incense", "matches"], category: "Cleansing", difficulty: "beginner" as const, intention: "Clarity & Peace" },
    { id: 12, practice: "Anoint doorways with protection oil", time: "8 min", spoons: 1, tags: ["protection", "home", "anointing"], materials: ["protection-oil"], category: "Protection", difficulty: "beginner" as const, intention: "Home Blessing" },

    // INTERMEDIATE PRACTICES (Spoons: 2)
    { id: 6, practice: "Dress candle with oil (protection/love/money)", time: "10 min", spoons: 2, tags: ["candle-magic", "dressing", "intention-work"], materials: ["candle", "oil", "herbs"], category: "Candle Magic", difficulty: "intermediate" as const, intention: "Multi-Purpose" },
    { id: 7, practice: "Create sachet/mojo bag with herbs for specific need", time: "15 min", spoons: 2, tags: ["mojo-bag", "herbs", "portable-magic"], materials: ["small-bag", "herbs", "string"], category: "Mojo Work", difficulty: "intermediate" as const, intention: "Portable Power" },
    { id: 9, practice: "Spiritual bath with herbs/salts", time: "30 min", spoons: 2, tags: ["cleansing", "self-care", "ritual-bath"], materials: ["herbs", "salts", "white-candle"], category: "Cleansing", difficulty: "intermediate" as const, intention: "Deep Cleanse" },
    { id: 10, practice: "Read cards/bones for guidance", time: "20 min", spoons: 2, tags: ["divination", "guidance", "reading"], materials: ["cards-or-bones", "candle", "incense"], category: "Divination", difficulty: "intermediate" as const, intention: "Seeking Answers" },
    { id: 11, practice: "Sweep floor while praying/chanting", time: "10 min", spoons: 2, tags: ["cleansing", "movement", "home-blessing"], materials: ["broom"], category: "Cleansing", difficulty: "intermediate" as const, intention: "Remove Negativity" },
    { id: 15, practice: "Make black salt for protection", time: "15 min", spoons: 2, tags: ["protection", "crafting", "ingredients"], materials: ["salt", "charcoal", "herbs"], category: "Protection", difficulty: "intermediate" as const, intention: "Strong Protection" },

    // ADVANCED PRACTICES (Spoons: 3+)
    { id: 8, practice: "Crossroads work - leave offering at intersection", time: "20 min", spoons: 3, tags: ["crossroads", "offerings", "advanced"], materials: ["coins", "whiskey", "tobacco"], category: "Advanced Work", difficulty: "advanced" as const, intention: "Major Change" },

    // ADDITIONAL PRACTICES - Expanding to 50+
    // Money & Prosperity
    { id: 16, practice: "Green candle dressed with money oil", time: "15 min", spoons: 2, tags: ["money", "prosperity", "candle-magic"], materials: ["green-candle", "money-oil", "coins"], category: "Money Work", difficulty: "intermediate" as const, intention: "Attract Wealth" },
    { id: 17, practice: "Cinnamon in wallet for money draw", time: "2 min", spoons: 1, tags: ["money", "quick", "pocket-magic"], materials: ["cinnamon-stick"], category: "Money Work", difficulty: "beginner" as const, intention: "Money Draw" },
    { id: 18, practice: "Basil under welcome mat for prosperity", time: "3 min", spoons: 1, tags: ["prosperity", "home", "herbs"], materials: ["dried-basil"], category: "Money Work", difficulty: "beginner" as const, intention: "Prosperity" },

    // Love & Relationships
    { id: 19, practice: "Pink candle for self-love", time: "10 min", spoons: 1, tags: ["self-love", "healing", "candle-magic"], materials: ["pink-candle", "rose-oil"], category: "Love Work", difficulty: "beginner" as const, intention: "Self-Love" },
    { id: 20, practice: "Rose petal bath for love drawing", time: "30 min", spoons: 2, tags: ["love", "bath", "roses"], materials: ["rose-petals", "pink-salt"], category: "Love Work", difficulty: "intermediate" as const, intention: "Draw Love" },
    { id: 21, practice: "Honey jar for sweetening", time: "20 min", spoons: 2, tags: ["sweetening", "relationship", "jar-spell"], materials: ["honey", "jar", "personal-items", "pink-candle"], category: "Love Work", difficulty: "intermediate" as const, intention: "Sweeten Situation" },

    // Protection & Uncrossing
    { id: 22, practice: "Black candle to remove negativity", time: "15 min", spoons: 2, tags: ["uncrossing", "protection", "candle-magic"], materials: ["black-candle", "uncrossing-oil"], category: "Protection", difficulty: "intermediate" as const, intention: "Remove Curses" },
    { id: 23, practice: "Egg cleansing ritual", time: "10 min", spoons: 2, tags: ["cleansing", "diagnostic", "traditional"], materials: ["raw-egg", "glass-of-water"], category: "Cleansing", difficulty: "intermediate" as const, intention: "Remove Evil Eye" },
    { id: 24, practice: "Fiery wall of protection oil on doors", time: "8 min", spoons: 1, tags: ["protection", "boundary", "strong"], materials: ["fiery-wall-oil"], category: "Protection", difficulty: "beginner" as const, intention: "Strong Protection" },
    { id: 25, practice: "Four Thieves Vinegar spray", time: "5 min", spoons: 1, tags: ["protection", "banishing", "spray"], materials: ["four-thieves-vinegar", "spray-bottle"], category: "Protection", difficulty: "beginner" as const, intention: "Banish Enemies" },

    // Healing
    { id: 26, practice: "Blue candle for healing", time: "15 min", spoons: 2, tags: ["healing", "health", "candle-magic"], materials: ["blue-candle", "healing-oil"], category: "Healing", difficulty: "intermediate" as const, intention: "Physical Healing" },
    { id: 27, practice: "Chamomile tea ritual for peace", time: "10 min", spoons: 1, tags: ["peace", "calming", "tea-magic"], materials: ["chamomile-tea", "honey"], category: "Healing", difficulty: "beginner" as const, intention: "Inner Peace" },
    { id: 28, practice: "Lavender sachet under pillow", time: "5 min", spoons: 1, tags: ["sleep", "dreams", "sachet"], materials: ["lavender", "small-bag"], category: "Healing", difficulty: "beginner" as const, intention: "Restful Sleep" },

    // Spiritual Baths
    { id: 29, practice: "Hyssop bath for purification", time: "30 min", spoons: 2, tags: ["purification", "bath", "deep-cleanse"], materials: ["hyssop", "white-candle"], category: "Cleansing", difficulty: "intermediate" as const, intention: "Purification" },
    { id: 30, practice: "Road opener bath", time: "30 min", spoons: 2, tags: ["road-opening", "opportunity", "bath"], materials: ["road-opener-herbs", "yellow-candle"], category: "Road Opening", difficulty: "intermediate" as const, intention: "Remove Blocks" },

    // Candle Magic
    { id: 31, practice: "Seven day candle spell", time: "5 min/day", spoons: 1, tags: ["candle-magic", "sustained", "weekly"], materials: ["7-day-candle", "oil", "petition"], category: "Candle Magic", difficulty: "intermediate" as const, intention: "Sustained Power" },
    { id: 32, practice: "Reversing candle to send back negativity", time: "20 min", spoons: 3, tags: ["reversing", "advanced", "protection"], materials: ["reversing-candle", "mirror"], category: "Advanced Work", difficulty: "advanced" as const, intention: "Return to Sender" },

    // Divination
    { id: 33, practice: "Tea leaf reading", time: "15 min", spoons: 2, tags: ["divination", "tea", "scrying"], materials: ["loose-tea", "white-cup"], category: "Divination", difficulty: "intermediate" as const, intention: "See Future" },
    { id: 34, practice: "Pendulum yes/no questions", time: "10 min", spoons: 1, tags: ["divination", "quick", "pendulum"], materials: ["pendulum"], category: "Divination", difficulty: "beginner" as const, intention: "Quick Answers" },
    { id: 35, practice: "Mirror scrying", time: "20 min", spoons: 3, tags: ["scrying", "mirror", "visions"], materials: ["black-mirror", "candle"], category: "Divination", difficulty: "advanced" as const, intention: "Deep Visions" },

    // Altar & Sacred Space
    { id: 36, practice: "Refresh ancestor altar weekly", time: "15 min", spoons: 2, tags: ["ancestor-work", "maintenance", "weekly"], materials: ["fresh-water", "offerings", "candles"], category: "Ancestor Work", difficulty: "intermediate" as const, intention: "Maintain Connection" },
    { id: 37, practice: "New Moon altar reset", time: "30 min", spoons: 2, tags: ["moon-magic", "altar", "monthly"], materials: ["new-altar-cloth", "fresh-flowers", "new-candles"], category: "Altar Work", difficulty: "intermediate" as const, intention: "New Beginnings" },
    { id: 38, practice: "Full Moon charging of tools", time: "10 min", spoons: 1, tags: ["moon-magic", "charging", "monthly"], materials: ["crystals", "tools"], category: "Moon Work", difficulty: "beginner" as const, intention: "Recharge Power" },

    // Job & Success
    { id: 39, practice: "Crown of success oil on head", time: "5 min", spoons: 1, tags: ["success", "anointing", "job"], materials: ["crown-of-success-oil"], category: "Success Work", difficulty: "beginner" as const, intention: "Win & Achieve" },
    { id: 40, practice: "Fast luck mojo bag", time: "15 min", spoons: 2, tags: ["luck", "opportunity", "mojo"], materials: ["lucky-hand-root", "lodestone", "red-bag"], category: "Success Work", difficulty: "intermediate" as const, intention: "Quick Luck" },

    // Jinx Breaking
    { id: 41, practice: "Uncrossing candle ritual", time: "20 min", spoons: 2, tags: ["uncrossing", "jinx-breaking"], materials: ["white-candle", "uncrossing-oil", "salt"], category: "Protection", difficulty: "intermediate" as const, intention: "Break Jinx" },
    { id: 42, practice: "Chinese wash floor cleanse", time: "30 min", spoons: 3, tags: ["cleansing", "floor-wash", "deep"], materials: ["chinese-wash", "mop", "prayers"], category: "Cleansing", difficulty: "intermediate" as const, intention: "Deep House Cleanse" },

    // Condition Oils
    { id: 43, practice: "Make your own condition oil", time: "25 min", spoons: 3, tags: ["oil-making", "crafting", "DIY"], materials: ["carrier-oil", "herbs", "essential-oils", "bottle"], category: "Oil Crafting", difficulty: "advanced" as const, intention: "Custom Power" },
    { id: 44, practice: "Bless and fix a mojo bag", time: "20 min", spoons: 2, tags: ["mojo", "blessing", "feeding"], materials: ["mojo-bag", "whiskey", "oil"], category: "Mojo Work", difficulty: "intermediate" as const, intention: "Activate Power" },

    // Triple-Strength Work
    { id: 45, practice: "Three candles (past/present/future)", time: "30 min", spoons: 3, tags: ["candle-magic", "time-work"], materials: ["three-candles", "oils", "herbs"], category: "Advanced Work", difficulty: "advanced" as const, intention: "Clear Path" },

    // Additional Quick Practices
    { id: 46, practice: "Light dressed candle daily with prayer", time: "5 min", spoons: 1, tags: ["daily", "prayer", "simple"], materials: ["candle", "oil"], category: "Daily Practice", difficulty: "beginner" as const, intention: "Daily Blessing" },
    { id: 47, practice: "Coffee grounds at door for visitors", time: "3 min", spoons: 1, tags: ["home", "visitors", "subtle"], materials: ["used-coffee-grounds"], category: "Home Magic", difficulty: "beginner" as const, intention: "Influence Visitors" },
    { id: 48, practice: "Psalms reading for specific needs", time: "10 min", spoons: 1, tags: ["prayer", "bible", "spiritual"], materials: ["bible", "candle"], category: "Prayer Work", difficulty: "beginner" as const, intention: "Divine Help" },
    { id: 49, practice: "Foot track magic - follow in footsteps", time: "15 min", spoons: 2, tags: ["influence", "subtle", "tracking"], materials: ["powder", "herbs"], category: "Influence Work", difficulty: "intermediate" as const, intention: "Influence Person" },
    { id: 50, practice: "Name paper petition under candle", time: "10 min", spoons: 1, tags: ["petition", "paper-magic", "names"], materials: ["paper", "pen", "candle"], category: "Petition Work", difficulty: "beginner" as const, intention: "Direct Intent" }
  ]
};

export default function KitchenWitchPage() {
  const [practices, setPractices] = useState<HoodooPractice[]>([]);
  const [filteredPractices, setFilteredPractices] = useState<HoodooPractice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSpoons, setSelectedSpoons] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [completedPractices, setCompletedPractices] = useState<number[]>([]);

  useEffect(() => {
    setPractices(hoodooData.hoodoo);
    setFilteredPractices(hoodooData.hoodoo);

    // Load completed practices from localStorage
    const completed = JSON.parse(localStorage.getItem('completedHoodooPractices') || '[]');
    setCompletedPractices(completed);
  }, []);

  useEffect(() => {
    let filtered = [...practices];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    if (selectedSpoons !== 'all') {
      const spoonLevel = parseInt(selectedSpoons);
      filtered = filtered.filter(p => p.spoons === spoonLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.practice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(t => t.includes(searchTerm.toLowerCase())) ||
        p.intention.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPractices(filtered);
  }, [selectedCategory, selectedDifficulty, selectedSpoons, searchTerm, practices]);

  const markComplete = (id: number) => {
    const updated = [...completedPractices, id];
    setCompletedPractices(updated);
    localStorage.setItem('completedHoodooPractices', JSON.stringify(updated));
    toast.success('Practice marked as completed!');
  };

  const categories = ['all', ...Array.from(new Set(practices.map(p => p.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-purple-950 to-indigo-950 pl-20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-12 h-12 text-yellow-400" />
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
                Kitchen Witch & Hoodoo Hub
              </h1>
              <p className="text-purple-300 text-lg">
                {practices.length} traditional hoodoo & rootwork practices
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-xl p-4 border border-yellow-700/30"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-white">{practices.length}</div>
            <div className="text-sm text-yellow-300">Total Practices</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-700/30"
          >
            <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">{completedPractices.length}</div>
            <div className="text-sm text-green-300">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4 border border-purple-700/30"
          >
            <Target className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{filteredPractices.length}</div>
            <div className="text-sm text-purple-300">Filtered Results</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-4 border border-blue-700/30"
          >
            <Book className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
            <div className="text-sm text-blue-300">Categories</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-xl p-6 border border-gray-700/30 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold text-white">Filter Practices</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search practices..."
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Energy Level (Spoons) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Energy Level</label>
              <select
                value={selectedSpoons}
                onChange={(e) => setSelectedSpoons(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
              >
                <option value="all">All Levels</option>
                <option value="1">Low Energy (1 🥄)</option>
                <option value="2">Medium Energy (2 🥄)</option>
                <option value="3">High Energy (3 🥄)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Practices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPractices.map((practice, i) => {
            const isCompleted = completedPractices.includes(practice.id);

            return (
              <motion.div
                key={practice.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-5 border ${
                  isCompleted ? 'border-green-500/50' : 'border-gray-700/50'
                } hover:border-purple-500/50 transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        practice.difficulty === 'beginner' ? 'bg-green-600 text-white' :
                        practice.difficulty === 'intermediate' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {practice.difficulty}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {'🥄'.repeat(practice.spoons)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{practice.practice}</h3>
                  </div>

                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  )}
                </div>

                {/* Category & Time */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                    {practice.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" />
                    {practice.time}
                  </span>
                </div>

                {/* Intention */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Intention:</span>
                  </div>
                  <p className="text-sm text-gray-300">{practice.intention}</p>
                </div>

                {/* Materials */}
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Materials:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {practice.materials.map((material, j) => (
                      <span key={j} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                        {material.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {practice.tags.map((tag, j) => (
                      <span key={j} className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs">
                        {tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {!isCompleted && (
                  <button
                    onClick={() => markComplete(practice.id)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
                  >
                    Mark as Completed
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredPractices.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No practices found with current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
