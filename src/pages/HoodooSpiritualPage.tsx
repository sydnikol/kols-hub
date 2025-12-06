import React, { useState, useEffect } from 'react';
import { Moon, Sun, Star, Flame, Droplets, Wind, Leaf, Heart, 
  Calendar, Clock, Bell, Book, Sparkles, Home, Plus, Edit, 
  Trash2, ChevronRight, Eye, Save, Camera } from 'lucide-react';

interface Ritual {
  id: string;
  name: string;
  type: 'candle' | 'cleansing' | 'offering' | 'prayer' | 'custom';
  moonPhase?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'moon-based' | 'as-needed';
  lastPerformed?: string;
  nextDue?: string;
  supplies: string[];
  notes: string;
}

interface AltarItem {
  id: string;
  name: string;
  type: 'candle' | 'water' | 'offering' | 'photo' | 'object' | 'plant';
  ancestor?: string;
  needsRefresh: boolean;
  lastRefreshed?: string;
}

interface HerbEntry {
  id: string;
  name: string;
  quantity: string;
  uses: string[];
  magicalProperties: string[];
  storageLocation: string;
}

interface DreamEntry {
  id: string;
  date: string;
  moonPhase: string;
  content: string;
  symbols: string[];
  interpretation: string;
  recurring: boolean;
}

const moonPhases = [
  { name: 'New Moon', emoji: '🌑', energy: 'New beginnings, setting intentions' },
  { name: 'Waxing Crescent', emoji: '🌒', energy: 'Growth, attraction, building' },
  { name: 'First Quarter', emoji: '🌓', energy: 'Action, decision, challenges' },
  { name: 'Waxing Gibbous', emoji: '🌔', energy: 'Refinement, patience, trust' },
  { name: 'Full Moon', emoji: '🌕', energy: 'Manifestation, power, completion' },
  { name: 'Waning Gibbous', emoji: '🌖', energy: 'Gratitude, sharing, wisdom' },
  { name: 'Last Quarter', emoji: '🌗', energy: 'Release, forgiveness, letting go' },
  { name: 'Waning Crescent', emoji: '🌘', energy: 'Rest, surrender, reflection' }
];

const candleColors = [
  { color: 'White', hex: '#FFFFFF', uses: ['Purity', 'Peace', 'Protection', 'All-purpose'] },
  { color: 'Black', hex: '#1a1a1a', uses: ['Protection', 'Banishing', 'Absorption of negativity'] },
  { color: 'Red', hex: '#8B0000', uses: ['Passion', 'Courage', 'Strength', 'Love'] },
  { color: 'Pink', hex: '#FFB6C1', uses: ['Self-love', 'Friendship', 'Emotional healing'] },
  { color: 'Orange', hex: '#FF8C00', uses: ['Success', 'Attraction', 'Energy'] },
  { color: 'Yellow', hex: '#FFD700', uses: ['Communication', 'Intellect', 'Clarity'] },
  { color: 'Green', hex: '#228B22', uses: ['Money', 'Growth', 'Fertility', 'Luck'] },
  { color: 'Blue', hex: '#4169E1', uses: ['Peace', 'Healing', 'Truth', 'Wisdom'] },
  { color: 'Purple', hex: '#6B238E', uses: ['Spiritual power', 'Psychic', 'Royalty'] },
  { color: 'Brown', hex: '#8B4513', uses: ['Stability', 'Home', 'Grounding'] }
];

const HoodooSpiritualPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'altar' | 'rituals' | 'herbs' | 'dreams' | 'moon' | 'ancestors'>('altar');
  const [currentMoonPhase, setCurrentMoonPhase] = useState(moonPhases[0]);
  const [altarItems, setAltarItems] = useState<AltarItem[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [herbs, setHerbs] = useState<HerbEntry[]>([]);
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dailyCard, setDailyCard] = useState<{title: string; message: string} | null>(null);

  // Calculate moon phase based on date
  useEffect(() => {
    const getMoonPhase = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // Simplified moon phase calculation
      const c = Math.floor(365.25 * year) + Math.floor(30.6 * (month + 1)) + day - 694039.09;
      const e = c / 29.53;
      const phase = Math.floor((e - Math.floor(e)) * 8);
      
      setCurrentMoonPhase(moonPhases[phase]);
    };
    getMoonPhase();
  }, []);

  // Generate daily affirmation/card
  useEffect(() => {
    const cards = [
      { title: "The Ancestors Speak", message: "Your path is protected. Trust the journey." },
      { title: "Strength", message: "You carry the resilience of all who came before you." },
      { title: "Healing Waters", message: "Let what no longer serves you flow away." },
      { title: "Sacred Fire", message: "Your passion is a gift. Let it burn bright." },
      { title: "Grounding", message: "Root yourself in the present. You are supported." },
      { title: "Intuition", message: "Listen to the quiet voice within. It knows." },
      { title: "Protection", message: "You are surrounded by light. No harm shall pass." },
      { title: "Abundance", message: "Open your hands to receive what is meant for you." }
    ];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    setDailyCard(randomCard);
  }, []);

  const TabButton = ({ tab, icon: Icon, label }: { tab: string; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === tab 
          ? 'bg-purple-600 text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 p-4 md:p-8">
      {/* Header with Moon Phase */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Star className="text-purple-400" />
              Hoodoo & Spiritual Sanctuary
            </h1>
            <p className="text-gray-400 mt-2">"One hand on the keyboard, one hand on the altar"</p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentMoonPhase.emoji}</span>
              <div>
                <p className="font-semibold text-white">{currentMoonPhase.name}</p>
                <p className="text-sm text-purple-300">{currentMoonPhase.energy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Card */}
        {dailyCard && (
          <div className="mt-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-yellow-400" />
              <span className="text-sm text-purple-300">Daily Affirmation</span>
            </div>
            <h3 className="text-xl font-bold text-white">{dailyCard.title}</h3>
            <p className="text-gray-300 mt-1 italic">{dailyCard.message}</p>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-2">
        <TabButton tab="altar" icon={Home} label="Altar" />
        <TabButton tab="rituals" icon={Flame} label="Rituals" />
        <TabButton tab="herbs" icon={Leaf} label="Herb Inventory" />
        <TabButton tab="dreams" icon={Moon} label="Dream Log" />
        <TabButton tab="moon" icon={Star} label="Moon Calendar" />
        <TabButton tab="ancestors" icon={Heart} label="Ancestors" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Altar Tab */}
        {activeTab === 'altar' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Altar Overview */}
            <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-purple-500/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Home className="text-purple-400" />
                  Ancestor Altar
                </h2>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Default altar items */}
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="text-blue-400" />
                    <div>
                      <p className="text-white">Ancestor Water</p>
                      <p className="text-sm text-gray-400">Refresh daily</p>
                    </div>
                  </div>
                  <button className="text-yellow-400 hover:text-yellow-300">
                    <Bell size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flame className="text-orange-400" />
                    <div>
                      <p className="text-white">White Candle</p>
                      <p className="text-sm text-gray-400">Protection & peace</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm">✓ Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="text-pink-400" />
                    <div>
                      <p className="text-white">Fresh Flowers</p>
                      <p className="text-sm text-gray-400">Weekly refresh</p>
                    </div>
                  </div>
                  <span className="text-yellow-400 text-sm">⚠ Due soon</span>
                </div>
              </div>
            </div>

            {/* Candle Color Guide */}
            <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Flame className="text-orange-400" />
                Candle Color Guide
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {candleColors.map(({ color, hex, uses }) => (
                  <div key={color} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: hex }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{color}</p>
                      <p className="text-xs text-gray-400">{uses[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offerings Reminder */}
            <div className="md:col-span-2 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-500/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Bell className="text-amber-400" />
                Offerings Reminders
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-amber-400 font-semibold">Water</p>
                  <p className="text-gray-300 text-sm">Refresh daily for ancestors</p>
                  <p className="text-xs text-gray-500 mt-2">Last: Today, 8:00 AM</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-amber-400 font-semibold">Food</p>
                  <p className="text-gray-300 text-sm">Share meals with ancestors</p>
                  <p className="text-xs text-gray-500 mt-2">Last: Yesterday</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-amber-400 font-semibold">Candles</p>
                  <p className="text-gray-300 text-sm">Light during prayer/meditation</p>
                  <p className="text-xs text-gray-500 mt-2">Last: 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rituals Tab */}
        {activeTab === 'rituals' && (
          <div className="space-y-6">
            <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-purple-500/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Ritual Scheduler</h2>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-2">
                  <Plus size={18} /> New Ritual
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">Energy Cleansing</h3>
                      <p className="text-sm text-gray-400">Weekly - Sundays</p>
                    </div>
                    <span className="text-purple-400">🌿</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Smoke cleanse with sage, open windows, set fresh water.</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Next: Sunday</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">Protection Work</h3>
                      <p className="text-sm text-gray-400">Monthly - New Moon</p>
                    </div>
                    <span className="text-blue-400">🛡️</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Black candle, protection oil, ward refreshing.</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">Moon-based</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">Abundance Ritual</h3>
                      <p className="text-sm text-gray-400">Monthly - Full Moon</p>
                    </div>
                    <span className="text-green-400">💰</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Green candle, cinnamon, bay leaves, money bowl work.</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">Full Moon</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-pink-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">Self-Love Bath</h3>
                      <p className="text-sm text-gray-400">As Needed</p>
                    </div>
                    <span className="text-pink-400">🛁</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Rose water, honey, pink Himalayan salt, flower petals.</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-pink-900/50 text-pink-300 px-2 py-1 rounded">Low spoons OK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rest Ritual Checklist */}
            <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-indigo-500/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Moon className="text-indigo-400" />
                Rest Ritual Checklist
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {['Dim lights after sunset', 'Play calming playlist', 'Light lavender candle', 
                  'Prepare sleep space', 'Set water by bed', 'Journal or reflect', 
                  'Give thanks to ancestors', 'Set intentions for tomorrow'].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700/70">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500" />
                    <span className="text-gray-300">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Herbs Tab */}
        {activeTab === 'herbs' && (
          <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-green-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Leaf className="text-green-400" />
                Hoodoo Herb Inventory
              </h2>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg flex items-center gap-2">
                <Plus size={18} /> Add Herb
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Sage', qty: '3 bundles', uses: ['Cleansing', 'Protection'], props: ['Purification', 'Wisdom'] },
                { name: 'Lavender', qty: '1 jar', uses: ['Peace', 'Sleep'], props: ['Calm', 'Love'] },
                { name: 'Cinnamon', qty: '2 sticks', uses: ['Money', 'Success'], props: ['Prosperity', 'Power'] },
                { name: 'Bay Leaves', qty: '1 pack', uses: ['Wishes', 'Protection'], props: ['Manifestation', 'Psychic'] },
                { name: 'Rose Petals', qty: 'Low', uses: ['Love', 'Beauty'], props: ['Self-love', 'Attraction'] },
                { name: 'Frankincense', qty: '1 box', uses: ['Spiritual', 'Blessing'], props: ['Sacred', 'Ancestor work'] }
              ].map((herb, i) => (
                <div key={i} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{herb.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      herb.qty === 'Low' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
                    }`}>{herb.qty}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {herb.uses.map((use, j) => (
                      <span key={j} className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">{use}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Properties: {herb.props.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dreams Tab */}
        {activeTab === 'dreams' && (
          <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Moon className="text-purple-400" />
              Dream Journal
            </h2>
            <p className="text-gray-400">Record and interpret your dreams for spiritual guidance.</p>
          </div>
        )}

        {/* Moon Calendar Tab */}
        {activeTab === 'moon' && (
          <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Star className="text-yellow-400" />
              Moon Calendar
            </h2>
            <p className="text-gray-400">Track lunar phases for timing your spiritual work.</p>
          </div>
        )}

        {/* Ancestors Tab */}
        {activeTab === 'ancestors' && (
          <div className="bg-gray-800/80 backdrop-blur rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Heart className="text-red-400" />
              Ancestor Veneration
            </h2>
            <p className="text-gray-400">Honor and connect with your ancestral lineage.</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Add Altar Item</h3>
            <input
              type="text"
              placeholder="Item name..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoodooSpiritualPage;
