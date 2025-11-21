import React, { useState, useEffect } from 'react';
import { Radio, Mic, Clock, TrendingUp, Plus, Trash2, Star, Play } from 'lucide-react';
import toast from 'react-hot-toast';

interface Podcast {
  id: string;
  name: string;
  host: string;
  category: 'true-crime' | 'comedy' | 'news' | 'education' | 'business' | 'tech' | 'sports' | 'entertainment' | 'other';
  subscribed: boolean;
  rating?: number; // 1-5
  platform: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'irregular';
  notes: string;
}

interface Episode {
  id: string;
  podcastName: string;
  episodeTitle: string;
  episodeNumber?: string;
  releaseDate: string;
  duration: number; // minutes
  status: 'to-listen' | 'listening' | 'completed' | 'skipped';
  playbackPosition?: number; // minutes
  rating?: number; // 1-5
  notes: string;
}

interface ListeningSession {
  id: string;
  podcastName: string;
  episodeTitle: string;
  date: string;
  duration: number; // minutes
  activity: 'commuting' | 'working' | 'exercising' | 'relaxing' | 'cleaning' | 'other';
  enjoyment: number; // 1-5
  notes: string;
}

const PodcastsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'podcasts' | 'episodes' | 'sessions' | 'stats'>('podcasts');
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [sessions, setSessions] = useState<ListeningSession[]>([]);

  useEffect(() => {
    const savedPodcasts = localStorage.getItem('podcastSubscriptions');
    if (savedPodcasts) setPodcasts(JSON.parse(savedPodcasts));
    const savedEpisodes = localStorage.getItem('podcastEpisodes');
    if (savedEpisodes) setEpisodes(JSON.parse(savedEpisodes));
    const savedSessions = localStorage.getItem('listeningSessionsPodcast');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => { localStorage.setItem('podcastSubscriptions', JSON.stringify(podcasts)); }, [podcasts]);
  useEffect(() => { localStorage.setItem('podcastEpisodes', JSON.stringify(episodes)); }, [episodes]);
  useEffect(() => { localStorage.setItem('listeningSessionsPodcast', JSON.stringify(sessions)); }, [sessions]);

  const addPodcast = () => {
    const newPodcast: Podcast = {
      id: Date.now().toString(),
      name: '',
      host: '',
      category: 'other',
      subscribed: true,
      platform: '',
      frequency: 'weekly',
      notes: '',
    };
    setPodcasts([...podcasts, newPodcast]);
    toast.success('Podcast added');
  };

  const updatePodcast = (id: string, updates: Partial<Podcast>) => {
    setPodcasts(podcasts.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Podcast updated');
  };

  const deletePodcast = (id: string) => {
    setPodcasts(podcasts.filter(p => p.id !== id));
    toast.success('Podcast deleted');
  };

  const addEpisode = () => {
    const newEpisode: Episode = {
      id: Date.now().toString(),
      podcastName: '',
      episodeTitle: '',
      releaseDate: new Date().toISOString().split('T')[0],
      duration: 60,
      status: 'to-listen',
      notes: '',
    };
    setEpisodes([...episodes, newEpisode]);
    toast.success('Episode added');
  };

  const updateEpisode = (id: string, updates: Partial<Episode>) => {
    setEpisodes(episodes.map(e => e.id === id ? { ...e, ...updates } : e));
    toast.success('Episode updated');
  };

  const deleteEpisode = (id: string) => {
    setEpisodes(episodes.filter(e => e.id !== id));
    toast.success('Episode deleted');
  };

  const subscribed = podcasts.filter(p => p.subscribed).length;
  const toListenCount = episodes.filter(e => e.status === 'to-listen').length;
  const completedCount = episodes.filter(e => e.status === 'completed').length;
  const totalHours = episodes.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.duration, 0) / 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Radio className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Podcasts Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Mic className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{subscribed}</div>
            <div className="text-xs opacity-90">Subscribed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Play className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{toListenCount}</div>
            <div className="text-xs opacity-90">Queue</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedCount}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalHours.toFixed(0)}h</div>
            <div className="text-xs opacity-90">Listened</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'podcasts', label: 'Podcasts', icon: Mic },
            { id: 'episodes', label: 'Episodes', icon: Play },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'podcasts' && (
          <div className="space-y-4">
            <button onClick={addPodcast} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Podcast</span>
            </button>
            {podcasts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Radio className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No podcasts yet. Start your podcast journey!</p>
              </div>
            ) : (
              podcasts.map(podcast => (
                <div key={podcast.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${podcast.subscribed ? 'border-green-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={podcast.name} onChange={(e) => updatePodcast(podcast.id, { name: e.target.value })} placeholder="Podcast name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full mb-1" />
                      <input type="text" value={podcast.host} onChange={(e) => updatePodcast(podcast.id, { host: e.target.value })} placeholder="Host..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deletePodcast(podcast.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select value={podcast.category} onChange={(e) => updatePodcast(podcast.id, { category: e.target.value as Podcast['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="true-crime">True Crime</option>
                      <option value="comedy">Comedy</option>
                      <option value="news">News</option>
                      <option value="education">Education</option>
                      <option value="business">Business</option>
                      <option value="tech">Technology</option>
                      <option value="sports">Sports</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={podcast.frequency} onChange={(e) => updatePodcast(podcast.id, { frequency: e.target.value as Podcast['frequency'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="irregular">Irregular</option>
                    </select>
                    <input type="text" value={podcast.platform} onChange={(e) => updatePodcast(podcast.id, { platform: e.target.value })} placeholder="Platform..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer text-sm mb-2">
                    <input type="checkbox" checked={podcast.subscribed} onChange={(e) => updatePodcast(podcast.id, { subscribed: e.target.checked })} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-gray-700">Subscribed</span>
                  </label>
                  <div className="mb-2">
                    <label className="block text-sm text-gray-600 mb-1">Rating: {podcast.rating ? `${podcast.rating}/5` : 'Not rated'}</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button key={rating} onClick={() => updatePodcast(podcast.id, { rating })} className="transition-colors">
                          <Star className={`w-5 h-5 ${rating <= (podcast.rating || 0) ? 'fill-green-500 text-green-500' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={podcast.notes} onChange={(e) => updatePodcast(podcast.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'episodes' && (
          <div className="space-y-4">
            <button onClick={addEpisode} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Episode</span>
            </button>
            {episodes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No episodes tracked. Add episodes to your queue!</p>
              </div>
            ) : (
              episodes.map(episode => (
                <div key={episode.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${episode.status === 'completed' ? 'border-green-500' : episode.status === 'listening' ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={episode.podcastName} onChange={(e) => updateEpisode(episode.id, { podcastName: e.target.value })} placeholder="Podcast name..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none w-full mb-1" />
                      <input type="text" value={episode.episodeTitle} onChange={(e) => updateEpisode(episode.id, { episodeTitle: e.target.value })} placeholder="Episode title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteEpisode(episode.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select value={episode.status} onChange={(e) => updateEpisode(episode.id, { status: e.target.value as Episode['status'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="to-listen">To Listen</option>
                      <option value="listening">Listening</option>
                      <option value="completed">Completed</option>
                      <option value="skipped">Skipped</option>
                    </select>
                    <input type="number" value={episode.duration} onChange={(e) => updateEpisode(episode.id, { duration: parseInt(e.target.value) || 0 })} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                    <input type="date" value={episode.releaseDate} onChange={(e) => updateEpisode(episode.id, { releaseDate: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                  </div>
                  <textarea value={episode.notes} onChange={(e) => updateEpisode(episode.id, { notes: e.target.value })} placeholder="Notes, key takeaways..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Podcast Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Podcasts:</span>
                  <span className="font-semibold">{podcasts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscribed:</span>
                  <span className="font-semibold">{subscribed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Episodes in Queue:</span>
                  <span className="font-semibold">{toListenCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Episodes Completed:</span>
                  <span className="font-semibold">{completedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Listening Time:</span>
                  <span className="font-semibold">{totalHours.toFixed(1)} hours</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastsHubPage;
