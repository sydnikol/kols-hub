import React, { useState, useEffect } from 'react';
import { Film, Tv, Music2, Plus, Star, Trash2, X, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaItem {
  id: string;
  title: string;
  type: 'music' | 'movie' | 'tv';
  genre: string;
  artist?: string; // for music
  year?: number;
  rating: number; // 1-5
  status: 'want-to-watch' | 'watching' | 'completed' | 'dropped';
  notes: string;
  tags: string[];
  dateAdded: string;
  dateCompleted?: string;
  createdAt: number;
}

const musicGenres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Country', 'Indie', 'Metal', 'Other'];
const movieGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy', 'Other'];
const tvGenres = ['Drama', 'Comedy', 'Sci-Fi', 'Fantasy', 'Documentary', 'Reality', 'Crime', 'Thriller', 'Animation', 'Horror', 'Other'];

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'music' | 'movie' | 'tv'>('music');
  const [filter, setFilter] = useState<'all' | 'want-to-watch' | 'watching' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    artist: '',
    year: new Date().getFullYear(),
    rating: 3,
    status: 'want-to-watch' as MediaItem['status'],
    notes: '',
  });
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mediaLibrary');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mediaLibrary', JSON.stringify(items));
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newItem: MediaItem = {
      id: Date.now().toString(),
      ...formData,
      type: activeTab,
      tags: tempTags,
      dateAdded: new Date().toISOString().split('T')[0],
      dateCompleted: formData.status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
      createdAt: Date.now(),
    };

    setItems([...items, newItem]);
    setFormData({
      title: '',
      genre: '',
      artist: '',
      year: new Date().getFullYear(),
      rating: 3,
      status: 'want-to-watch',
      notes: '',
    });
    setTempTags([]);
    setIsAdding(false);
    toast.success(`${activeTab === 'music' ? 'Album' : activeTab === 'movie' ? 'Movie' : 'Show'} added!`);
  };

  const deleteItem = (id: string) => {
    if (confirm('Delete this item?')) {
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    }
  };

  const updateStatus = (id: string, status: MediaItem['status']) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          dateCompleted: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return item;
    }));
    toast.success(`Status updated`);
  };

  const addTag = () => {
    if (!tagInput.trim() || tempTags.includes(tagInput.trim())) return;
    setTempTags([...tempTags, tagInput.trim()]);
    setTagInput('');
  };

  const getFilteredItems = () => {
    return items
      .filter(item => item.type === activeTab)
      .filter(item => filter === 'all' || item.status === filter)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const getStats = () => {
    const typeItems = items.filter(i => i.type === activeTab);
    return {
      total: typeItems.length,
      completed: typeItems.filter(i => i.status === 'completed').length,
      watching: typeItems.filter(i => i.status === 'watching').length,
      wantTo: typeItems.filter(i => i.status === 'want-to-watch').length,
    };
  };

  const genres = activeTab === 'music' ? musicGenres : activeTab === 'movie' ? movieGenres : tvGenres;
  const filteredItems = getFilteredItems();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Media Library
            </h1>
            <p className="text-indigo-400 mt-1">
              {stats.total} items • {stats.completed} completed • {stats.watching} in progress
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Cancel' : 'Add Item'}
          </button>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 mb-6">
          {(['music', 'movie', 'tv'] as const).map(type => {
            const Icon = type === 'music' ? Music2 : type === 'movie' ? Film : Tv;
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === type
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-white/5 text-indigo-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {type === 'music' ? 'Music' : type === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-black/30 p-1 rounded-lg mb-6">
          {(['all', 'want-to-watch', 'watching', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-indigo-200/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'all' ? 'All' : f === 'want-to-watch' ? 'Wishlist' : f === 'watching' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Add Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Add {activeTab === 'music' ? 'Album/Song' : activeTab === 'movie' ? 'Movie' : 'TV Show'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                placeholder="Title *"
                required
              />
              {activeTab === 'music' && (
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                  placeholder="Artist"
                />
              )}
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
              >
                <option value="">Select Genre</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                placeholder="Year"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MediaItem['status'] })}
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
              >
                <option value="want-to-watch">Wishlist</option>
                <option value="watching">In Progress</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-indigo-100 mb-2">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: r })}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      formData.rating === r
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white/5 text-indigo-300 hover:bg-white/10'
                    }`}
                  >
                    {r} ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 min-h-[80px] mb-4"
              placeholder="Notes..."
            />
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                placeholder="Add tags..."
              />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {tempTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tempTags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2">
                    #{tag}
                    <button type="button" onClick={() => setTempTags(tempTags.filter(t => t !== tag))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all font-medium"
            >
              Add to Library
            </button>
          </form>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/20">
              {activeTab === 'music' && <Music2 className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />}
              {activeTab === 'movie' && <Film className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />}
              {activeTab === 'tv' && <Tv className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />}
              <p className="text-indigo-200/70">No {activeTab === 'music' ? 'music' : activeTab === 'movie' ? 'movies' : 'TV shows'} yet</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-400/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    {item.artist && <p className="text-indigo-300 text-sm">{item.artist}</p>}
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="p-1 text-red-300 hover:text-red-200">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    item.status === 'watching' ? 'bg-indigo-500/20 text-indigo-300' :
                    item.status === 'want-to-watch' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {item.status === 'want-to-watch' ? 'Wishlist' : item.status.replace('-', ' ').toUpperCase()}
                  </span>
                  {item.genre && <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{item.genre}</span>}
                  {item.year && <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs">{item.year}</span>}
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < item.rating ? 'text-purple-400 fill-current' : 'text-purple-600'}`}
                    />
                  ))}
                </div>

                {item.notes && <p className="text-indigo-200/70 text-sm mb-3">{item.notes}</p>}

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t border-indigo-500/20">
                  {['want-to-watch', 'watching', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(item.id, status as MediaItem['status'])}
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                        item.status === status
                          ? 'bg-indigo-500/30 text-indigo-300'
                          : 'bg-white/5 text-indigo-300 hover:bg-white/10'
                      }`}
                      disabled={item.status === status}
                    >
                      {status === 'want-to-watch' ? 'Wish' : status === 'watching' ? 'Active' : 'Done'}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
