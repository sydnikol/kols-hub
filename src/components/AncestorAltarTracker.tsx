import React, { useState, useEffect } from 'react';
import { Flame, Droplets, Calendar, BookOpen, Moon, Sun } from 'lucide-react';

interface AltarItem {
  id: string;
  type: 'candle' | 'water' | 'offering' | 'photo' | 'other';
  name: string;
  ancestor?: string;
  lastRefreshed?: Date;
  notes?: string;
}

interface Ritual {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'special';
  dayOfWeek?: number;
  dayOfMonth?: number;
  lastPerformed?: Date;
  notes?: string;
}

export const AncestorAltarTracker: React.FC = () => {
  const [altarItems, setAltarItems] = useState<AltarItem[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [viewMode, setViewMode] = useState<'altar' | 'rituals' | 'calendar'>('altar');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddRitual, setShowAddRitual] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const db = await openDB();
      const tx1 = db.transaction('altarItems', 'readonly');
      const itemsRequest = tx1.objectStore('altarItems').getAll();
      const items = await new Promise<AltarItem[]>((resolve, reject) => {
        itemsRequest.onsuccess = () => resolve(itemsRequest.result);
        itemsRequest.onerror = () => reject(itemsRequest.error);
      });
      setAltarItems(items);

      const tx2 = db.transaction('rituals', 'readonly');
      const ritsRequest = tx2.objectStore('rituals').getAll();
      const rits = await new Promise<Ritual[]>((resolve, reject) => {
        ritsRequest.onsuccess = () => resolve(ritsRequest.result);
        ritsRequest.onerror = () => reject(ritsRequest.error);
      });
      setRituals(rits);
    } catch (error) {
      console.log('No altar data yet');
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KolHubDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('altarItems')) {
          db.createObjectStore('altarItems', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('rituals')) {
          db.createObjectStore('rituals', { keyPath: 'id' });
        }
      };
    });
  };

  const addAltarItem = async (item: Omit<AltarItem, 'id'>) => {
    const newItem: AltarItem = {
      ...item,
      id: `altar_${Date.now()}`,
      lastRefreshed: new Date()
    };

    const db = await openDB();
    const tx = db.transaction('altarItems', 'readwrite');
    await tx.objectStore('altarItems').add(newItem);
    setAltarItems([...altarItems, newItem]);
    setShowAddItem(false);
  };

  const refreshItem = async (id: string) => {
    const db = await openDB();
    const tx = db.transaction('altarItems', 'readwrite');
    const store = tx.objectStore('altarItems');
    const getRequest = store.get(id);
    const item = await new Promise<AltarItem>((resolve, reject) => {
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    });
    item.lastRefreshed = new Date();
    await store.put(item);
    setAltarItems(altarItems.map(i => i.id === id ? item : i));
  };

  const addRitual = async (ritual: Omit<Ritual, 'id'>) => {
    const newRitual: Ritual = {
      ...ritual,
      id: `ritual_${Date.now()}`
    };

    const db = await openDB();
    const tx = db.transaction('rituals', 'readwrite');
    await tx.objectStore('rituals').add(newRitual);
    setRituals([...rituals, newRitual]);
    setShowAddRitual(false);
  };

  const markRitualPerformed = async (id: string) => {
    const db = await openDB();
    const tx = db.transaction('rituals', 'readwrite');
    const store = tx.objectStore('rituals');
    const getRequest = store.get(id);
    const ritual = await new Promise<Ritual>((resolve, reject) => {
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    });
    ritual.lastPerformed = new Date();
    await store.put(ritual);
    setRituals(rituals.map(r => r.id === id ? ritual : r));
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'candle': return '🕯️';
      case 'water': return '💧';
      case 'offering': return '🍎';
      case 'photo': return '🖼️';
      default: return '✨';
    }
  };

  const needsRefresh = (item: AltarItem) => {
    if (!item.lastRefreshed) return true;
    const daysSince = (Date.now() - new Date(item.lastRefreshed).getTime()) / (1000 * 60 * 60 * 24);
    if (item.type === 'water') return daysSince > 3;
    if (item.type === 'offering') return daysSince > 7;
    return daysSince > 14;
  };

  const getUpcomingRituals = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();

    return rituals.filter(r => {
      if (r.type === 'weekly' && r.dayOfWeek === dayOfWeek) return true;
      if (r.type === 'monthly' && r.dayOfMonth === dayOfMonth) return true;
      return false;
    });
  };

  const upcoming = getUpcomingRituals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 mb-2">
            🕯️ Ancestor Altar & Rituals
          </h1>
          <p className="text-purple-200">Track your sacred space and spiritual practices</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('altar')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'altar' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            🕯️ Altar Items
          </button>
          <button
            onClick={() => setViewMode('rituals')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'rituals' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📿 Rituals
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            🌙 Calendar
          </button>
        </div>

        {/* Altar Items View */}
        {viewMode === 'altar' && (
          <div>
            {/* Quick Actions */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-purple-100 mb-2">Sacred Altar</h2>
                  <p className="text-purple-300 text-sm">{altarItems.length} items on your altar</p>
                </div>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  ➕ Add Item
                </button>
              </div>

              {/* Needs Attention */}
              {altarItems.filter(needsRefresh).length > 0 && (
                <div className="mt-4 bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <div className="font-medium text-orange-200 mb-2">🔔 Needs Attention</div>
                  <div className="space-y-1 text-sm">
                    {altarItems.filter(needsRefresh).map(item => (
                      <div key={item.id} className="text-orange-300">
                        {getItemIcon(item.type)} {item.name} - time to refresh
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Altar Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {altarItems.map(item => (
                <div
                  key={item.id}
                  className={`bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border ${
                    needsRefresh(item) ? 'border-orange-500/50' : 'border-purple-500/30'
                  }`}
                >
                  <div className="text-4xl mb-3">{getItemIcon(item.type)}</div>
                  <h3 className="text-xl font-bold text-purple-100 mb-2">{item.name}</h3>
                  {item.ancestor && (
                    <div className="text-purple-300 text-sm mb-2">For: {item.ancestor}</div>
                  )}
                  <div className="text-purple-400 text-xs mb-3">
                    Last refreshed: {item.lastRefreshed ? new Date(item.lastRefreshed).toLocaleDateString() : 'Never'}
                  </div>
                  {item.notes && (
                    <div className="text-purple-200 text-sm italic mb-3">"{item.notes}"</div>
                  )}
                  <button
                    onClick={() => refreshItem(item.id)}
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      needsRefresh(item)
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {needsRefresh(item) ? '⚠️ Refresh Now' : '✓ Mark Refreshed'}
                  </button>
                </div>
              ))}
            </div>

            {/* Add Item Form */}
            {showAddItem && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-purple-950 border border-purple-500/30 rounded-xl p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-purple-100 mb-6">Add Altar Item</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addAltarItem({
                      type: formData.get('type') as any,
                      name: formData.get('name') as string,
                      ancestor: formData.get('ancestor') as string,
                      notes: formData.get('notes') as string
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-purple-200 mb-2">Type</label>
                        <select name="type" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required>
                          <option value="candle">🕯️ Candle</option>
                          <option value="water">💧 Water</option>
                          <option value="offering">🍎 Offering</option>
                          <option value="photo">🖼️ Photo</option>
                          <option value="other">✨ Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-purple-200 mb-2">Name</label>
                        <input name="name" type="text" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required />
                      </div>
                      <div>
                        <label className="block text-purple-200 mb-2">Ancestor (optional)</label>
                        <input name="ancestor" type="text" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" />
                      </div>
                      <div>
                        <label className="block text-purple-200 mb-2">Notes (optional)</label>
                        <textarea name="notes" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 h-20" />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button type="button" onClick={() => setShowAddItem(false)} className="flex-1 bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 py-3 rounded-lg">
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white py-3 rounded-lg">
                        Add Item
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rituals View */}
        {viewMode === 'rituals' && (
          <div>
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-purple-100 mb-2">Ritual Schedule</h2>
                  <p className="text-purple-300 text-sm">{rituals.length} rituals tracked</p>
                </div>
                <button
                  onClick={() => setShowAddRitual(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  ➕ Add Ritual
                </button>
              </div>
            </div>

            {/* Today's Rituals */}
            {upcoming.length > 0 && (
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
                <h3 className="text-xl font-bold text-purple-100 mb-4">🌟 Today's Rituals</h3>
                <div className="space-y-3">
                  {upcoming.map(ritual => (
                    <div key={ritual.id} className="bg-purple-900/40 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-purple-100">{ritual.name}</div>
                        {ritual.notes && <div className="text-sm text-purple-300 mt-1">{ritual.notes}</div>}
                      </div>
                      <button
                        onClick={() => markRitualPerformed(ritual.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✓ Complete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Rituals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rituals.map(ritual => (
                <div key={ritual.id} className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold text-purple-100 mb-2">{ritual.name}</h3>
                  <div className="text-purple-300 text-sm mb-3">
                    {ritual.type === 'weekly' && `Weekly - Every ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][ritual.dayOfWeek!]}`}
                    {ritual.type === 'monthly' && `Monthly - Day ${ritual.dayOfMonth}`}
                    {ritual.type === 'special' && 'Special Occasion'}
                  </div>
                  {ritual.lastPerformed && (
                    <div className="text-purple-400 text-xs mb-3">
                      Last performed: {new Date(ritual.lastPerformed).toLocaleDateString()}
                    </div>
                  )}
                  {ritual.notes && (
                    <div className="text-purple-200 text-sm italic">{ritual.notes}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Ritual Form */}
            {showAddRitual && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-purple-950 border border-purple-500/30 rounded-xl p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-purple-100 mb-6">Add Ritual</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const type = formData.get('type') as 'weekly' | 'monthly' | 'special';
                    addRitual({
                      name: formData.get('name') as string,
                      type,
                      dayOfWeek: type === 'weekly' ? Number(formData.get('dayOfWeek')) : undefined,
                      dayOfMonth: type === 'monthly' ? Number(formData.get('dayOfMonth')) : undefined,
                      notes: formData.get('notes') as string
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-purple-200 mb-2">Ritual Name</label>
                        <input name="name" type="text" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required />
                      </div>
                      <div>
                        <label className="block text-purple-200 mb-2">Type</label>
                        <select name="type" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="special">Special Occasion</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-purple-200 mb-2">Day of Week (for weekly)</label>
                        <select name="dayOfWeek" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100">
                          <option value="0">Sunday</option>
                          <option value="1">Monday</option>
                          <option value="2">Tuesday</option>
                          <option value="3">Wednesday</option>
                          <option value="4">Thursday</option>
                          <option value="5">Friday</option>
                          <option value="6">Saturday</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-purple-200 mb-2">Day of Month (for monthly)</label>
                        <input name="dayOfMonth" type="number" min="1" max="31" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" />
                      </div>
                      <div>
                        <label className="block text-purple-200 mb-2">Notes</label>
                        <textarea name="notes" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 h-20" />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button type="button" onClick={() => setShowAddRitual(false)} className="flex-1 bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 py-3 rounded-lg">
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white py-3 rounded-lg">
                        Add Ritual
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">🌙 Hoodoo Calendar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Moon Phases */}
              <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-100 mb-4">🌙 Moon Phases</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">New Moon</span>
                    <span className="text-purple-400">New beginnings, setting intentions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Waxing Crescent</span>
                    <span className="text-purple-400">Growth, building energy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">First Quarter</span>
                    <span className="text-purple-400">Taking action, decisions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Waxing Gibbous</span>
                    <span className="text-purple-400">Refinement, adjustments</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Full Moon</span>
                    <span className="text-purple-400">Manifestation, peak power</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Waning Gibbous</span>
                    <span className="text-purple-400">Gratitude, sharing</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Last Quarter</span>
                    <span className="text-purple-400">Release, let go</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Waning Crescent</span>
                    <span className="text-purple-400">Rest, reflection</span>
                  </div>
                </div>
              </div>

              {/* Candle Colors */}
              <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-100 mb-4">🕯️ Candle Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white border border-purple-400"></div>
                    <span className="text-purple-200">White: Purification, clarity, peace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-600"></div>
                    <span className="text-purple-200">Red: Love, passion, strength</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600"></div>
                    <span className="text-purple-200">Green: Money, prosperity, growth</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                    <span className="text-purple-200">Blue: Healing, peace, wisdom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600"></div>
                    <span className="text-purple-200">Purple: Spiritual power, psychic work</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
                    <span className="text-purple-200">Yellow: Success, confidence, creativity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-600"></div>
                    <span className="text-purple-200">Orange: Opportunity, attraction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                    <span className="text-purple-200">Pink: Romance, friendship, kindness</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-black border border-purple-400"></div>
                    <span className="text-purple-200">Black: Protection, banishing, grounding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};