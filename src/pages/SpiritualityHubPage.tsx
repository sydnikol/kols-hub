import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Star, Heart, Plus, Trash2, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface TarotReading {
  id: string;
  date: string;
  question: string;
  cards: string[];
  interpretation: string;
  createdAt: number;
}

interface Ritual {
  id: string;
  title: string;
  type: string;
  date: string;
  moonPhase: string;
  intention: string;
  tools: string[];
  steps: string;
  reflection: string;
  createdAt: number;
}

interface Ancestor {
  id: string;
  name: string;
  relationship: string;
  offerings: string[];
  memories: string;
  wisdom: string;
  createdAt: number;
}

interface Intention {
  id: string;
  text: string;
  category: string;
  date: string;
  completed: boolean;
  createdAt: number;
}

const tarotCards = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'];
const ritualTypes = ['New Moon', 'Full Moon', 'Protection', 'Cleansing', 'Abundance', 'Love', 'Healing', 'Ancestor Work', 'Gratitude', 'Release', 'Other'];
const moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
const intentionCategories = ['Abundance', 'Love', 'Health', 'Protection', 'Growth', 'Creativity', 'Peace', 'Strength', 'Wisdom', 'Gratitude'];

export default function SpiritualityHubPage() {
  const [activeTab, setActiveTab] = useState<'tarot' | 'rituals' | 'ancestors' | 'intentions'>('tarot');
  const [tarotReadings, setTarotReadings] = useState<TarotReading[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const savedTarot = localStorage.getItem('tarotReadings');
    const savedRituals = localStorage.getItem('rituals');
    const savedAncestors = localStorage.getItem('ancestors');
    const savedIntentions = localStorage.getItem('intentions');
    if (savedTarot) setTarotReadings(JSON.parse(savedTarot));
    if (savedRituals) setRituals(JSON.parse(savedRituals));
    if (savedAncestors) setAncestors(JSON.parse(savedAncestors));
    if (savedIntentions) setIntentions(JSON.parse(savedIntentions));
  }, []);

  useEffect(() => {
    localStorage.setItem('tarotReadings', JSON.stringify(tarotReadings));
  }, [tarotReadings]);

  useEffect(() => {
    localStorage.setItem('rituals', JSON.stringify(rituals));
  }, [rituals]);

  useEffect(() => {
    localStorage.setItem('ancestors', JSON.stringify(ancestors));
  }, [ancestors]);

  useEffect(() => {
    localStorage.setItem('intentions', JSON.stringify(intentions));
  }, [intentions]);

  const drawTarot = () => {
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Spirituality Hub
            </h1>
          </div>
          <p className="text-purple-400">Connect with your spiritual practice and ancestors</p>
        </div>

        <div className="flex gap-2 bg-black/30 p-1 rounded-lg mb-6">
          {(['tarot', 'rituals', 'ancestors', 'intentions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                  : 'text-purple-200/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'tarot' && (
          <div className="space-y-4">
            <button
              onClick={() => {
                const cards = drawTarot();
                const newReading: TarotReading = {
                  id: Date.now().toString(),
                  date: new Date().toISOString().split('T')[0],
                  question: '',
                  cards,
                  interpretation: '',
                  createdAt: Date.now(),
                };
                setTarotReadings([newReading, ...tarotReadings]);
                toast.success('Cards drawn!');
              }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
            >
              Draw 3 Cards
            </button>

            <div className="grid grid-cols-1 gap-4">
              {tarotReadings.map(reading => (
                <div key={reading.id} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-purple-300 text-sm">{new Date(reading.date).toLocaleDateString()}</span>
                    <button onClick={() => setTarotReadings(tarotReadings.filter(r => r.id !== reading.id))}>
                      <Trash2 className="w-5 h-5 text-red-300" />
                    </button>
                  </div>
                  <div className="flex gap-3 mb-4">
                    {reading.cards.map((card, i) => (
                      <div key={i} className="flex-1 bg-purple-900/40 rounded-lg p-3 border border-purple-500/30 text-center">
                        <p className="text-purple-100 font-semibold text-sm">{card}</p>
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={reading.question}
                    onChange={(e) => setTarotReadings(tarotReadings.map(r => r.id === reading.id ? {...r, question: e.target.value} : r))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-2"
                    placeholder="Your question..."
                  />
                  <textarea
                    value={reading.interpretation}
                    onChange={(e) => setTarotReadings(tarotReadings.map(r => r.id === reading.id ? {...r, interpretation: e.target.value} : r))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[100px]"
                    placeholder="Your interpretation..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rituals' && (
          <div className="space-y-4">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium flex items-center justify-center gap-2"
            >
              {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {isAdding ? 'Cancel' : 'Plan Ritual'}
            </button>

            {isAdding && (
              <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20">
                <input
                  type="text"
                  placeholder="Ritual title..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-3"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      setRituals([{
                        id: Date.now().toString(),
                        title: input.value,
                        type: ritualTypes[0],
                        date: new Date().toISOString().split('T')[0],
                        moonPhase: moonPhases[0],
                        intention: '',
                        tools: [],
                        steps: '',
                        reflection: '',
                        createdAt: Date.now(),
                      }, ...rituals]);
                      setIsAdding(false);
                      toast.success('Ritual planned!');
                    }
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {rituals.map(ritual => (
                <div key={ritual.id} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white">{ritual.title}</h3>
                    <button onClick={() => setRituals(rituals.filter(r => r.id !== ritual.id))}>
                      <Trash2 className="w-5 h-5 text-red-300" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={ritual.type}
                      onChange={(e) => setRituals(rituals.map(r => r.id === ritual.id ? {...r, type: e.target.value} : r))}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                    >
                      {ritualTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                      value={ritual.moonPhase}
                      onChange={(e) => setRituals(rituals.map(r => r.id === ritual.id ? {...r, moonPhase: e.target.value} : r))}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                    >
                      {moonPhases.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <textarea
                    value={ritual.intention}
                    onChange={(e) => setRituals(rituals.map(r => r.id === ritual.id ? {...r, intention: e.target.value} : r))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none mb-3"
                    placeholder="Intention..."
                  />
                  <textarea
                    value={ritual.steps}
                    onChange={(e) => setRituals(rituals.map(r => r.id === ritual.id ? {...r, steps: e.target.value} : r))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none min-h-[100px] mb-3"
                    placeholder="Ritual steps..."
                  />
                  <textarea
                    value={ritual.reflection}
                    onChange={(e) => setRituals(rituals.map(r => r.id === ritual.id ? {...r, reflection: e.target.value} : r))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none min-h-[80px]"
                    placeholder="Post-ritual reflection..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ancestors' && (
          <div className="space-y-4">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium flex items-center justify-center gap-2"
            >
              {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {isAdding ? 'Cancel' : 'Honor Ancestor'}
            </button>

            {isAdding && (
              <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20">
                <input
                  type="text"
                  placeholder="Ancestor's name..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      setAncestors([{
                        id: Date.now().toString(),
                        name: input.value,
                        relationship: '',
                        offerings: [],
                        memories: '',
                        wisdom: '',
                        createdAt: Date.now(),
                      }, ...ancestors]);
                      setIsAdding(false);
                      toast.success('Ancestor honored');
                    }
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ancestors.map(ancestor => (
                <div key={ancestor.id} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white">{ancestor.name}</h3>
                    <button onClick={() => setAncestors(ancestors.filter(a => a.id !== ancestor.id))}>
                      <Trash2 className="w-5 h-5 text-red-300" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={ancestor.relationship}
                    onChange={(e) => setAncestors(ancestors.map(a => a.id === ancestor.id ? {...a, relationship: e.target.value} : a))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none mb-3"
                    placeholder="Relationship..."
                  />
                  <textarea
                    value={ancestor.memories}
                    onChange={(e) => setAncestors(ancestors.map(a => a.id === ancestor.id ? {...a, memories: e.target.value} : a))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none min-h-[80px] mb-3"
                    placeholder="Memories & stories..."
                  />
                  <textarea
                    value={ancestor.wisdom}
                    onChange={(e) => setAncestors(ancestors.map(a => a.id === ancestor.id ? {...a, wisdom: e.target.value} : a))}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none min-h-[80px]"
                    placeholder="Their wisdom & guidance..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'intentions' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Set an intention..."
                className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    setIntentions([{
                      id: Date.now().toString(),
                      text: input.value,
                      category: intentionCategories[0],
                      date: new Date().toISOString().split('T')[0],
                      completed: false,
                      createdAt: Date.now(),
                    }, ...intentions]);
                    input.value = '';
                    toast.success('Intention set!');
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {intentions.map(intention => (
                <div
                  key={intention.id}
                  className={`bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border transition-all ${
                    intention.completed ? 'border-green-500/30 opacity-70' : 'border-purple-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <select
                      value={intention.category}
                      onChange={(e) => setIntentions(intentions.map(i => i.id === intention.id ? {...i, category: e.target.value} : i))}
                      className="bg-purple-500/20 text-purple-300 rounded px-2 py-1 text-sm"
                    >
                      {intentionCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => setIntentions(intentions.filter(i => i.id !== intention.id))}>
                      <Trash2 className="w-5 h-5 text-red-300" />
                    </button>
                  </div>
                  <p className="text-white mb-3">{intention.text}</p>
                  <button
                    onClick={() => setIntentions(intentions.map(i => i.id === intention.id ? {...i, completed: !i.completed} : i))}
                    className={`w-full py-2 rounded-lg transition-all ${
                      intention.completed
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    }`}
                  >
                    {intention.completed ? 'Manifested ✓' : 'Mark Manifested'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
