import React, { useState, useEffect } from 'react';
import { Moon, Star, BookOpen, Search, Calendar } from 'lucide-react';

interface DreamEntry {
  id: string;
  date: Date;
  moonPhase: string;
  title: string;
  content: string;
  tags: string[];
  emotions?: string[];
  recurring?: boolean;
  lucid?: boolean;
}

const MOON_PHASES = [
  '🌑 New Moon',
  '🌒 Waxing Crescent',
  '🌓 First Quarter',
  '🌔 Waxing Gibbous',
  '🌕 Full Moon',
  '🌖 Waning Gibbous',
  '🌗 Last Quarter',
  '🌘 Waning Crescent'
];

export const DreamJournal: React.FC = () => {
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [showAddDream, setShowAddDream] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'patterns' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMoonPhase, setFilterMoonPhase] = useState<string>('');

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('dreams', 'readonly');
      const allDreams = await tx.objectStore('dreams').getAll();
      setDreams(allDreams.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error) {
      console.log('No dreams yet');
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KolHubDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('dreams')) {
          db.createObjectStore('dreams', { keyPath: 'id' });
        }
      };
    });
  };

  const getCurrentMoonPhase = (): string => {
    // Simplified moon phase calculation
    const date = new Date();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const phase = Math.floor((dayOfYear % 29.53) / 29.53 * 8);
    return MOON_PHASES[phase];
  };

  const addDream = async (dream: Omit<DreamEntry, 'id'>) => {
    const newDream: DreamEntry = {
      ...dream,
      id: `dream_${Date.now()}`,
      date: new Date()
    };

    const db = await openDB();
    const tx = db.transaction('dreams', 'readwrite');
    await tx.objectStore('dreams').add(newDream);
    setDreams([newDream, ...dreams]);
    setShowAddDream(false);
  };

  const filteredDreams = dreams.filter(dream => {
    if (searchTerm && !dream.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !dream.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterMoonPhase && dream.moonPhase !== filterMoonPhase) {
      return false;
    }
    return true;
  });

  const getDreamsByMoonPhase = () => {
    const byPhase: Record<string, DreamEntry[]> = {};
    MOON_PHASES.forEach(phase => {
      byPhase[phase] = dreams.filter(d => d.moonPhase === phase);
    });
    return byPhase;
  };

  const getCommonTags = () => {
    const tagCounts: Record<string, number> = {};
    dreams.forEach(dream => {
      dream.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const getRecurringThemes = () => {
    return dreams.filter(d => d.recurring);
  };

  const dreamsByPhase = getDreamsByMoonPhase();
  const commonTags = getCommonTags();
  const recurringThemes = getRecurringThemes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 mb-2">
            🌙 Dream Journal
          </h1>
          <p className="text-purple-200">Track your dreams and explore patterns with lunar cycles</p>
        </div>

        {/* Current Moon Phase */}
        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-200 mb-1">Current Moon Phase</div>
              <div className="text-2xl font-bold text-purple-100">{getCurrentMoonPhase()}</div>
            </div>
            <button
              onClick={() => setShowAddDream(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              ✨ Log Dream
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📝 Dream List
          </button>
          <button
            onClick={() => setViewMode('patterns')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'patterns' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            🔮 Patterns
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            🌙 By Moon Phase
          </button>
        </div>

        {/* Search & Filters */}
        {viewMode === 'list' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 mb-2">
                  <Search className="inline mr-2" size={18} />
                  Search Dreams
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or content..."
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                />
              </div>
              <div>
                <label className="block text-purple-200 mb-2">
                  <Moon className="inline mr-2" size={18} />
                  Filter by Moon Phase
                </label>
                <select
                  value={filterMoonPhase}
                  onChange={(e) => setFilterMoonPhase(e.target.value)}
                  className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                >
                  <option value="">All Phases</option>
                  {MOON_PHASES.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Dream List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredDreams.map(dream => (
              <div key={dream.id} className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-100 mb-1">{dream.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-purple-300">
                      <span>{new Date(dream.date).toLocaleDateString()}</span>
                      <span>{dream.moonPhase}</span>
                      {dream.lucid && <span className="bg-blue-600/30 px-2 py-0.5 rounded">💫 Lucid</span>}
                      {dream.recurring && <span className="bg-purple-600/30 px-2 py-0.5 rounded">🔄 Recurring</span>}
                    </div>
                  </div>
                  <div className="text-3xl">{dream.lucid ? '💫' : '💤'}</div>
                </div>
                
                <div className="text-purple-200 mb-4 whitespace-pre-wrap">{dream.content}</div>
                
                {dream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dream.tags.map((tag, i) => (
                      <span key={i} className="bg-purple-600/30 px-3 py-1 rounded-full text-sm text-purple-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {dream.emotions && dream.emotions.length > 0 && (
                  <div className="flex gap-2 text-sm text-purple-300">
                    <span>Emotions:</span>
                    <span>{dream.emotions.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
            
            {filteredDreams.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌙</div>
                <div className="text-purple-200 text-xl">No dreams found</div>
                <div className="text-purple-300 mt-2">Start logging your dreams!</div>
              </div>
            )}
          </div>
        )}

        {/* Patterns View */}
        {viewMode === 'patterns' && (
          <div className="space-y-6">
            {/* Common Tags */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-4">🏷️ Most Common Dream Themes</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {commonTags.map(([tag, count]) => (
                  <div key={tag} className="bg-purple-900/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-100 mb-1">{count}</div>
                    <div className="text-sm text-purple-300">#{tag}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring Dreams */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-4">🔄 Recurring Themes</h2>
              {recurringThemes.length > 0 ? (
                <div className="space-y-3">
                  {recurringThemes.map(dream => (
                    <div key={dream.id} className="bg-purple-900/30 rounded-lg p-4">
                      <div className="font-medium text-purple-100">{dream.title}</div>
                      <div className="text-sm text-purple-300 mt-1">
                        {dream.tags.map(tag => `#${tag}`).join(' ')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-purple-300 py-6">
                  No recurring themes identified yet
                </div>
              )}
            </div>

            {/* Lucid Dreams */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-4">💫 Lucid Dreams</h2>
              <div className="text-4xl font-bold text-purple-100 mb-2">
                {dreams.filter(d => d.lucid).length}
              </div>
              <div className="text-purple-300">
                Out of {dreams.length} total dreams ({dreams.length > 0 ? ((dreams.filter(d => d.lucid).length / dreams.length) * 100).toFixed(1) : 0}%)
              </div>
            </div>
          </div>
        )}

        {/* By Moon Phase View */}
        {viewMode === 'calendar' && (
          <div className="space-y-6">
            {MOON_PHASES.map(phase => (
              <div key={phase} className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-100 mb-4">{phase}</h3>
                {dreamsByPhase[phase].length > 0 ? (
                  <div className="space-y-3">
                    {dreamsByPhase[phase].slice(0, 5).map(dream => (
                      <div key={dream.id} className="bg-purple-900/30 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-purple-100">{dream.title}</div>
                            <div className="text-sm text-purple-300 mt-1">
                              {new Date(dream.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {dream.lucid && <span>💫</span>}
                            {dream.recurring && <span>🔄</span>}
                          </div>
                        </div>
                        {dream.tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {dream.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs bg-purple-700/30 px-2 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {dreamsByPhase[phase].length > 5 && (
                      <div className="text-center text-purple-400 text-sm">
                        +{dreamsByPhase[phase].length - 5} more dreams
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-purple-300 py-4">
                    No dreams during this phase yet
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Dream Form */}
        {showAddDream && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-purple-950 border border-purple-500/30 rounded-xl p-8 max-w-2xl w-full my-8">
              <h3 className="text-2xl font-bold text-purple-100 mb-6">✨ Log Dream</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const tags = (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t);
                const emotions = (formData.get('emotions') as string).split(',').map(e => e.trim()).filter(e => e);
                
                addDream({
                  title: formData.get('title') as string,
                  moonPhase: formData.get('moonPhase') as string,
                  content: formData.get('content') as string,
                  tags,
                  emotions,
                  lucid: formData.get('lucid') === 'on',
                  recurring: formData.get('recurring') === 'on',
                  date: new Date()
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-purple-200 mb-2">Dream Title</label>
                    <input
                      name="title"
                      type="text"
                      placeholder="e.g. Flying over the city"
                      className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2">
                      <Moon className="inline mr-2" size={18} />
                      Moon Phase
                    </label>
                    <select
                      name="moonPhase"
                      defaultValue={getCurrentMoonPhase()}
                      className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                      required
                    >
                      {MOON_PHASES.map(phase => (
                        <option key={phase} value={phase}>{phase}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2">Dream Content</label>
                    <textarea
                      name="content"
                      rows={6}
                      placeholder="Describe your dream in detail..."
                      className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2">Tags (comma-separated)</label>
                    <input
                      name="tags"
                      type="text"
                      placeholder="e.g. flying, city, night, family"
                      className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 mb-2">Emotions (comma-separated)</label>
                    <input
                      name="emotions"
                      type="text"
                      placeholder="e.g. joy, fear, excitement, peace"
                      className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
                    />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                      <input name="lucid" type="checkbox" className="w-5 h-5 rounded" />
                      <span>💫 Lucid Dream</span>
                    </label>
                    <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                      <input name="recurring" type="checkbox" className="w-5 h-5 rounded" />
                      <span>🔄 Recurring Theme</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddDream(false)}
                    className="flex-1 bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all"
                  >
                    💾 Save Dream
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};