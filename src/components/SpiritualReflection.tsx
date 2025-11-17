/**
 * 🖤 SPIRITUAL REFLECTION
 * Ancestor altar, rituals, dream journal, hoodoo calendar
 * Connects spiritual practice with daily life
 */

import React, { useState, useEffect } from 'react';
import { Flame, Moon, Star, Book, Calendar, Sparkles, Droplet } from 'lucide-react';
import { db } from '../utils/database';
import ideasLibraries from '../data/ideas-libraries.json';

interface AltarItem {
  id: string;
  type: 'candle' | 'water' | 'offering' | 'photo' | 'herb' | 'crystal';
  name: string;
  lastChanged: string;
  notes: string;
}

interface Ritual {
  id: string;
  name: string;
  date: string;
  time: string;
  purpose: string;
  completed: boolean;
}

interface DreamEntry {
  id: string;
  date: string;
  moonPhase: string;
  content: string;
  tags: string[];
  symbols: string[];
}

const SpiritualReflection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'altar' | 'rituals' | 'dreams' | 'hoodoo'>('altar');
  const [altarItems, setAltarItems] = useState<AltarItem[]>([
    { id: '1', type: 'candle', name: 'White Ancestor Candle', lastChanged: new Date().toISOString(), notes: 'Lit daily for ancestors' },
    { id: '2', type: 'water', name: 'Fresh Water Offering', lastChanged: new Date().toISOString(), notes: 'Changed weekly' },
  ]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [moonPhase, setMoonPhase] = useState('Waxing Crescent');
  const [hoodooIdeas, setHoodooIdeas] = useState(ideasLibraries.hoodoo || []);

  // Calculate moon phase
  useEffect(() => {
    const getMoonPhase = () => {
      const date = new Date();
      const phase = ((date.getTime() / 86400000) % 29.53) / 29.53;
      if (phase < 0.125) return 'New Moon';
      if (phase < 0.25) return 'Waxing Crescent';
      if (phase < 0.375) return 'First Quarter';
      if (phase < 0.5) return 'Waxing Gibbous';
      if (phase < 0.625) return 'Full Moon';
      if (phase < 0.75) return 'Waning Gibbous';
      if (phase < 0.875) return 'Last Quarter';
      return 'Waning Crescent';
    };
    setMoonPhase(getMoonPhase());
  }, []);

  const addAltarItem = () => {
    const newItem: AltarItem = {
      id: Date.now().toString(),
      type: 'candle',
      name: 'New Item',
      lastChanged: new Date().toISOString(),
      notes: ''
    };
    setAltarItems([...altarItems, newItem]);
  };

  const updateAltarItem = (id: string, lastChanged: string) => {
    setAltarItems(altarItems.map(item => 
      item.id === id ? { ...item, lastChanged } : item
    ));
  };

  const addRitual = (name: string, purpose: string, date: string, time: string) => {
    const newRitual: Ritual = {
      id: Date.now().toString(),
      name,
      date,
      time,
      purpose,
      completed: false
    };
    setRituals([...rituals, newRitual]);
  };

  const toggleRitual = (id: string) => {
    setRituals(rituals.map(ritual =>
      ritual.id === id ? { ...ritual, completed: !ritual.completed } : ritual
    ));
  };

  const addDreamEntry = (content: string, tags: string[], symbols: string[]) => {
    const newDream: DreamEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      moonPhase,
      content,
      tags,
      symbols
    };
    setDreams([newDream, ...dreams]);
  };
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'candle': return <Flame className="text-orange-400" />;
      case 'water': return <Droplet className="text-blue-400" />;
      case 'offering': return <Star className="text-indigo-400" />;
      case 'photo': return <Book className="text-purple-400" />;
      default: return <Sparkles className="text-purple-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
          Spiritual Reflection
        </h1>
        <p className="text-gray-400">Ancestor work, rituals, dreams, and hoodoo practices</p>
      </div>

      {/* Moon Phase Card */}
      <div className="mb-6 p-6 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl">
        <div className="flex items-center gap-3">
          <Moon size={32} className="text-blue-300" />
          <div>
            <div className="text-sm text-gray-300">Current Moon Phase</div>
            <div className="text-2xl font-bold">{moonPhase}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {[
          { id: 'altar', name: 'Ancestor Altar', icon: <Flame /> },
          { id: 'rituals', name: 'Rituals', icon: <Star /> },
          { id: 'dreams', name: 'Dream Journal', icon: <Moon /> },
          { id: 'hoodoo', name: 'Hoodoo Practices', icon: <Sparkles /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Ancestor Altar Tab */}
      {activeTab === 'altar' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Ancestor Altar</h2>
            <button
              onClick={addAltarItem}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
            >
              + Add Item
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {altarItems.map((item) => (
              <div key={item.id} className="p-6 bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  {getItemIcon(item.type)}
                  <h3 className="font-bold text-lg">{item.name}</h3>
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  Last changed: {new Date(item.lastChanged).toLocaleDateString()}
                </div>
                <p className="text-gray-300 mb-3">{item.notes}</p>
                <button
                  onClick={() => updateAltarItem(item.id, new Date().toISOString())}
                  className="px-3 py-1 bg-purple-900 hover:bg-purple-800 rounded-lg text-sm transition-all"
                >
                  Update
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rituals Tab */}
      {activeTab === 'rituals' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Rituals</h2>
          <div className="space-y-3">
            {rituals.map((ritual) => (
              <div
                key={ritual.id}
                className={`p-4 rounded-xl ${
                  ritual.completed ? 'bg-green-900 bg-opacity-30' : 'bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRitual(ritual.id)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        ritual.completed ? 'bg-green-500 border-green-500' : 'border-gray-600'
                      }`}
                    >
                      {ritual.completed && <span className="text-white">✓</span>}
                    </button>
                    <div>
                      <h3 className="font-semibold">{ritual.name}</h3>
                      <p className="text-sm text-gray-400">{ritual.purpose}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div>{ritual.date}</div>
                    <div>{ritual.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Dreams Tab */}
      {activeTab === 'dreams' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Dream Journal</h2>
          <div className="space-y-4">
            {dreams.map((dream) => (
              <div key={dream.id} className="p-6 bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Moon className="text-blue-300" />
                    <span className="font-semibold">{dream.moonPhase}</span>
                  </div>
                  <span className="text-sm text-gray-400">{new Date(dream.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 mb-3">{dream.content}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {dream.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-900 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                {dream.symbols.length > 0 && (
                  <div className="text-sm text-gray-400">
                    Symbols: {dream.symbols.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hoodoo Practices Tab */}
      {activeTab === 'hoodoo' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Hoodoo Micro-Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hoodooIdeas.map((practice: any) => (
              <div key={practice.id} className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Sparkles className="text-purple-400" size={24} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-purple-900 rounded">{practice.time}</span>
                    <span className="text-xs px-2 py-1 bg-indigo-900 rounded">{practice.spoons} spoons</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{practice.practice}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {practice.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
                {practice.materials && (
                  <div className="text-xs text-gray-500">
                    Materials: {practice.materials.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritualReflection;