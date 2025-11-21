import React, { useState, useEffect } from 'react';
import { Tv, Film, Star, Clock, Plus, Trash2, Play, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface StreamingService {
  id: string;
  name: string;
  type: 'video' | 'music' | 'audiobook' | 'other';
  subscriptionCost: number;
  active: boolean;
  username?: string;
  notes: string;
}

interface WatchlistItem {
  id: string;
  title: string;
  type: 'movie' | 'tv-show' | 'documentary' | 'anime' | 'youtube' | 'other';
  service: string;
  rating?: number; // 1-5
  status: 'want-to-watch' | 'watching' | 'completed' | 'on-hold' | 'dropped';
  priority: 'low' | 'medium' | 'high' | 'must-watch';
  genre: string[];
  notes: string;
  startDate?: string;
  completedDate?: string;
}

interface ViewingSession {
  id: string;
  title: string;
  service: string;
  date: string;
  duration: number; // minutes
  episode?: string;
  enjoyment: number; // 1-5
  notes: string;
}

const StreamingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'watchlist' | 'sessions' | 'stats'>('watchlist');
  const [services, setServices] = useState<StreamingService[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [sessions, setSessions] = useState<ViewingSession[]>([]);

  useEffect(() => {
    const savedServices = localStorage.getItem('streamingServices');
    if (savedServices) setServices(JSON.parse(savedServices));
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    const savedSessions = localStorage.getItem('viewingSessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => { localStorage.setItem('streamingServices', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('watchlist', JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem('viewingSessions', JSON.stringify(sessions)); }, [sessions]);

  const addWatchlistItem = () => {
    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      title: '',
      type: 'movie',
      service: '',
      status: 'want-to-watch',
      priority: 'medium',
      genre: [],
      notes: '',
    };
    setWatchlist([...watchlist, newItem]);
    toast.success('Added to watchlist');
  };

  const updateWatchlistItem = (id: string, updates: Partial<WatchlistItem>) => {
    setWatchlist(watchlist.map(item => item.id === id ? { ...item, ...updates } : item));
    toast.success('Watchlist updated');
  };

  const deleteWatchlistItem = (id: string) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
    toast.success('Removed from watchlist');
  };

  const addService = () => {
    const newService: StreamingService = {
      id: Date.now().toString(),
      name: '',
      type: 'video',
      subscriptionCost: 0,
      active: true,
      notes: '',
    };
    setServices([...services, newService]);
    toast.success('Service added');
  };

  const updateService = (id: string, updates: Partial<StreamingService>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Service updated');
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast.success('Service deleted');
  };

  const totalCost = services.filter(s => s.active).reduce((sum, s) => sum + s.subscriptionCost, 0);
  const watchingNow = watchlist.filter(item => item.status === 'watching').length;
  const completed = watchlist.filter(item => item.status === 'completed').length;
  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Tv className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Streaming Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Film className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{watchlist.length}</div>
            <div className="text-xs opacity-90">Watchlist</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Play className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{watchingNow}</div>
            <div className="text-xs opacity-90">Watching</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Check className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completed}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalHours.toFixed(0)}h</div>
            <div className="text-xs opacity-90">Watched</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'watchlist', label: 'Watchlist', icon: Film },
            { id: 'services', label: 'Services', icon: Tv },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'stats', label: 'Stats', icon: Star },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'watchlist' && (
          <div className="space-y-4">
            <button onClick={addWatchlistItem} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add to Watchlist</span>
            </button>
            {watchlist.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No items in watchlist. Start adding shows and movies!</p>
              </div>
            ) : (
              watchlist.map(item => (
                <div key={item.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${item.status === 'completed' ? 'border-green-500' : item.status === 'watching' ? 'border-purple-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={item.title} onChange={(e) => updateWatchlistItem(item.id, { title: e.target.value })} placeholder="Title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteWatchlistItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select value={item.type} onChange={(e) => updateWatchlistItem(item.id, { type: e.target.value as WatchlistItem['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="movie">Movie</option>
                      <option value="tv-show">TV Show</option>
                      <option value="documentary">Documentary</option>
                      <option value="anime">Anime</option>
                      <option value="youtube">YouTube</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="text" value={item.service} onChange={(e) => updateWatchlistItem(item.id, { service: e.target.value })} placeholder="Service..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                    <select value={item.status} onChange={(e) => updateWatchlistItem(item.id, { status: e.target.value as WatchlistItem['status'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="want-to-watch">Want to Watch</option>
                      <option value="watching">Watching</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="dropped">Dropped</option>
                    </select>
                    <select value={item.priority} onChange={(e) => updateWatchlistItem(item.id, { priority: e.target.value as WatchlistItem['priority'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="must-watch">Must Watch</option>
                    </select>
                  </div>
                  {item.rating && (
                    <div className="mb-2 flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= item.rating! ? 'fill-purple-500 text-purple-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  )}
                  <textarea value={item.notes} onChange={(e) => updateWatchlistItem(item.id, { notes: e.target.value })} placeholder="Notes, thoughts..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <button onClick={addService} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Service</span>
            </button>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-purple-600">Total Monthly Cost</h3>
              <div className="text-3xl font-bold text-purple-600">${totalCost.toFixed(2)}</div>
              <div className="text-sm text-gray-600">{services.filter(s => s.active).length} active services</div>
            </div>
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={service.name} onChange={(e) => updateService(service.id, { name: e.target.value })} placeholder="Service name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none flex-1 mr-2" />
                  <button onClick={() => deleteService(service.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <select value={service.type} onChange={(e) => updateService(service.id, { type: e.target.value as StreamingService['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                    <option value="video">Video Streaming</option>
                    <option value="music">Music Streaming</option>
                    <option value="audiobook">Audiobooks</option>
                    <option value="other">Other</option>
                  </select>
                  <input type="number" step="0.01" value={service.subscriptionCost} onChange={(e) => updateService(service.id, { subscriptionCost: parseFloat(e.target.value) || 0 })} placeholder="Cost..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                </div>
                <label className="flex items-center space-x-2 cursor-pointer text-sm mb-2">
                  <input type="checkbox" checked={service.active} onChange={(e) => updateService(service.id, { active: e.target.checked })} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-gray-700">Active Subscription</span>
                </label>
                <textarea value={service.notes} onChange={(e) => updateService(service.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600">Streaming Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Watchlist Items:</span>
                  <span className="font-semibold">{watchlist.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currently Watching:</span>
                  <span className="font-semibold">{watchingNow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold">{completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Watch Time:</span>
                  <span className="font-semibold">{totalHours.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Streaming Cost:</span>
                  <span className="font-semibold">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamingHubPage;
