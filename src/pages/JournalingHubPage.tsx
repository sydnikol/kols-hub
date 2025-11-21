import React, { useState, useEffect } from 'react';
import { BookOpen, Pen, Smile, TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number; // 1-5
  energy: number; // 1-5
  gratitude: string[];
  highlights: string;
  challenges: string;
  tomorrow: string;
  tags: string[];
  favorite: boolean;
}

interface Prompt {
  id: string;
  prompt: string;
  category: 'reflection' | 'gratitude' | 'growth' | 'relationships' | 'creativity' | 'goals' | 'other';
  used: boolean;
  response?: string;
  date?: string;
}

const JournalingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'entries' | 'prompts' | 'stats'>('entries');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    const savedPrompts = localStorage.getItem('journalPrompts');
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
    else {
      // Initialize with default prompts
      const defaultPrompts: Prompt[] = [
        { id: '1', prompt: 'What are three things you\'re grateful for today?', category: 'gratitude', used: false },
        { id: '2', prompt: 'What did you learn about yourself this week?', category: 'reflection', used: false },
        { id: '3', prompt: 'What\'s one goal you\'re working towards and why?', category: 'goals', used: false },
        { id: '4', prompt: 'Describe a moment that made you smile today.', category: 'reflection', used: false },
        { id: '5', prompt: 'What challenges are you facing and how can you overcome them?', category: 'growth', used: false },
      ];
      setPrompts(defaultPrompts);
    }
  }, []);

  useEffect(() => { localStorage.setItem('journalEntries', JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem('journalPrompts', JSON.stringify(prompts)); }, [prompts]);

  const addEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: '',
      content: '',
      mood: 3,
      energy: 3,
      gratitude: [],
      highlights: '',
      challenges: '',
      tomorrow: '',
      tags: [],
      favorite: false,
    };
    setEntries([...entries, newEntry]);
    toast.success('Entry created');
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
    toast.success('Entry updated');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.success('Entry deleted');
  };

  const addPrompt = () => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      prompt: '',
      category: 'reflection',
      used: false,
    };
    setPrompts([...prompts, newPrompt]);
    toast.success('Prompt added');
  };

  const updatePrompt = (id: string, updates: Partial<Prompt>) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Prompt updated');
  };

  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    toast.success('Prompt deleted');
  };

  const totalEntries = entries.length;
  const avgMood = entries.length > 0 ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1) : '0';
  const avgEnergy = entries.length > 0 ? (entries.reduce((sum, e) => sum + e.energy, 0) / entries.length).toFixed(1) : '0';
  const currentStreak = calculateStreak();

  function calculateStreak(): number {
    if (entries.length === 0) return 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const current = new Date(sortedEntries[i].date);
      const next = new Date(sortedEntries[i + 1].date);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Journaling Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Pen className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalEntries}</div>
            <div className="text-xs opacity-90">Entries</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Smile className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgMood}</div>
            <div className="text-xs opacity-90">Avg Mood</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgEnergy}</div>
            <div className="text-xs opacity-90">Avg Energy</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{currentStreak}</div>
            <div className="text-xs opacity-90">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'entries', label: 'Journal Entries', icon: Pen },
            { id: 'prompts', label: 'Prompts', icon: BookOpen },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'entries' && (
          <div className="space-y-4">
            <button onClick={addEntry} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>New Entry</span>
            </button>
            {entries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No journal entries yet. Start writing!</p>
              </div>
            ) : (
              entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                <div key={entry.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${entry.favorite ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="date" value={entry.date} onChange={(e) => updateEntry(entry.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none w-full mb-1" />
                      <input type="text" value={entry.title} onChange={(e) => updateEntry(entry.id, { title: e.target.value })} placeholder="Entry title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Mood: {entry.mood}/5</label>
                      <input type="range" min="1" max="5" value={entry.mood} onChange={(e) => updateEntry(entry.id, { mood: parseInt(e.target.value) })} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Energy: {entry.energy}/5</label>
                      <input type="range" min="1" max="5" value={entry.energy} onChange={(e) => updateEntry(entry.id, { energy: parseInt(e.target.value) })} className="w-full" />
                    </div>
                  </div>
                  <textarea value={entry.content} onChange={(e) => updateEntry(entry.id, { content: e.target.value })} placeholder="Write your thoughts..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2" rows={4} />
                  <textarea value={entry.highlights} onChange={(e) => updateEntry(entry.id, { highlights: e.target.value })} placeholder="Highlights of the day..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2" rows={2} />
                  <textarea value={entry.challenges} onChange={(e) => updateEntry(entry.id, { challenges: e.target.value })} placeholder="Challenges faced..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2" rows={2} />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={entry.favorite} onChange={(e) => updateEntry(entry.id, { favorite: e.target.checked })} className="w-4 h-4" />
                    <label className="text-sm text-gray-600">Mark as favorite</label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-4">
            <button onClick={addPrompt} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Prompt</span>
            </button>
            {prompts.map(prompt => (
              <div key={prompt.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${prompt.used ? 'border-green-500' : 'border-blue-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <textarea value={prompt.prompt} onChange={(e) => updatePrompt(prompt.id, { prompt: e.target.value })} placeholder="Journaling prompt..." className="flex-1 mr-2 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full" rows={2} />
                  <button onClick={() => deletePrompt(prompt.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <select value={prompt.category} onChange={(e) => updatePrompt(prompt.id, { category: e.target.value as Prompt['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none w-full mb-3">
                  <option value="reflection">Reflection</option>
                  <option value="gratitude">Gratitude</option>
                  <option value="growth">Growth</option>
                  <option value="relationships">Relationships</option>
                  <option value="creativity">Creativity</option>
                  <option value="goals">Goals</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={prompt.used} onChange={(e) => updatePrompt(prompt.id, { used: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm text-gray-600">Used</label>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Journaling Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Entries:</span>
                  <span className="font-semibold">{totalEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak:</span>
                  <span className="font-semibold">{currentStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Mood:</span>
                  <span className="font-semibold">{avgMood}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Energy:</span>
                  <span className="font-semibold">{avgEnergy}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Entries:</span>
                  <span className="font-semibold">{entries.filter(e => e.favorite).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Prompts:</span>
                  <span className="font-semibold">{prompts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Used Prompts:</span>
                  <span className="font-semibold">{prompts.filter(p => p.used).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalingHubPage;
