import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Cloud, Sun, CloudRain, Zap, Calendar, TrendingUp, Download, Plus, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface MoodEntry {
  id: string;
  date: string;
  time: string;
  moodScore: number; // 1-10
  emotionalState: string; // Happy, Sad, Anxious, etc.
  energy: number; // 1-10
  sleep: number; // hours
  sleepQuality: number; // 1-10
  triggers: string[];
  positives: string[];
  activities: string[];
  socialInteraction: 'none' | 'minimal' | 'moderate' | 'high';
  physicalSymptoms: string[];
  medications: string[];
  notes: string;
  gratitude?: string;
  timestamp: number;
}

const MoodTracker: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'trends'>('list');
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<MoodEntry, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    moodScore: 5,
    emotionalState: '',
    energy: 5,
    sleep: 7,
    sleepQuality: 5,
    triggers: [],
    positives: [],
    activities: [],
    socialInteraction: 'moderate',
    physicalSymptoms: [],
    medications: [],
    notes: '',
    gratitude: '',
  });

  const emotionalStates = [
    'Happy', 'Sad', 'Anxious', 'Calm', 'Angry', 'Frustrated', 'Excited',
    'Content', 'Lonely', 'Overwhelmed', 'Hopeful', 'Numb', 'Grateful',
    'Stressed', 'Peaceful', 'Irritable', 'Energized', 'Drained', 'Neutral'
  ];

  const commonTriggers = [
    'Poor Sleep', 'Stress', 'Conflict', 'Work', 'Family', 'Health Issues',
    'Finances', 'Loneliness', 'Overstimulation', 'News/Social Media',
    'Weather', 'Pain', 'Medication Change', 'Lack of Routine'
  ];

  const commonActivities = [
    'Exercise', 'Meditation', 'Therapy', 'Journaling', 'Reading', 'Music',
    'Art/Creative', 'Time in Nature', 'Socializing', 'Gaming', 'Cooking',
    'Cleaning/Organizing', 'TV/Movies', 'Resting', 'Working', 'Hobbies'
  ];

  const commonSymptoms = [
    'Headache', 'Fatigue', 'Nausea', 'Muscle Tension', 'Racing Heart',
    'Stomach Issues', 'Dizziness', 'Chest Tightness', 'Trembling', 'Sweating'
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = localStorage.getItem('mood_tracker');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  };

  const saveEntries = (data: MoodEntry[]) => {
    setEntries(data);
    localStorage.setItem('mood_tracker', JSON.stringify(data));
  };

  const addEntry = () => {
    if (!formData.emotionalState) {
      toast.error('Please select an emotional state');
      return;
    }

    const newEntry: MoodEntry = {
      ...formData,
      id: `mood_${Date.now()}`,
      timestamp: new Date(`${formData.date}T${formData.time}`).getTime(),
    };

    saveEntries([...entries, newEntry].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Mood entry added');
    setShowAddForm(false);
    resetForm();
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
    toast.success('Entry deleted');
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      moodScore: 5,
      emotionalState: '',
      energy: 5,
      sleep: 7,
      sleepQuality: 5,
      triggers: [],
      positives: [],
      activities: [],
      socialInteraction: 'moderate',
      physicalSymptoms: [],
      medications: [],
      notes: '',
      gratitude: '',
    });
  };

  const addToList = (list: keyof Pick<MoodEntry, 'triggers' | 'positives' | 'activities' | 'physicalSymptoms' | 'medications'>, item: string) => {
    const currentList = formData[list] as string[];
    if (item && !currentList.includes(item)) {
      setFormData({ ...formData, [list]: [...currentList, item] });
    }
  };

  const removeFromList = (list: keyof Pick<MoodEntry, 'triggers' | 'positives' | 'activities' | 'physicalSymptoms' | 'medications'>, item: string) => {
    const currentList = formData[list] as string[];
    setFormData({ ...formData, [list]: currentList.filter(i => i !== item) });
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 8) return { icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-500/50' };
    if (score >= 6) return { icon: Smile, color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-500/50' };
    if (score >= 4) return { icon: Meh, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-500/50' };
    if (score >= 2) return { icon: Cloud, color: 'text-gray-400', bg: 'bg-gray-900/30', border: 'border-gray-500/50' };
    return { icon: CloudRain, color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-500/50' };
  };

  const getMoodLabel = (score: number): string => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Okay';
    if (score >= 3) return 'Low';
    return 'Very Low';
  };

  const getFilteredEntries = () => {
    const cutoff = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
    return entries.filter(e => e.timestamp >= cutoff);
  };

  const calculateAverages = () => {
    const filtered = getFilteredEntries();
    if (filtered.length === 0) return null;

    const avgMood = filtered.reduce((sum, e) => sum + e.moodScore, 0) / filtered.length;
    const avgEnergy = filtered.reduce((sum, e) => sum + e.energy, 0) / filtered.length;
    const avgSleep = filtered.reduce((sum, e) => sum + e.sleep, 0) / filtered.length;
    const avgSleepQuality = filtered.reduce((sum, e) => sum + e.sleepQuality, 0) / filtered.length;

    return {
      mood: Math.round(avgMood * 10) / 10,
      energy: Math.round(avgEnergy * 10) / 10,
      sleep: Math.round(avgSleep * 10) / 10,
      sleepQuality: Math.round(avgSleepQuality * 10) / 10,
    };
  };

  const getMostCommon = (key: keyof MoodEntry) => {
    const filtered = getFilteredEntries();
    const items = new Map<string, number>();

    filtered.forEach(entry => {
      const value = entry[key];
      if (Array.isArray(value)) {
        value.forEach(item => {
          items.set(item, (items.get(item) || 0) + 1);
        });
      } else if (typeof value === 'string' && value) {
        items.set(value, (items.get(value) || 0) + 1);
      }
    });

    return Array.from(items.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([item, count]) => ({ item, count }));
  };

  const exportData = () => {
    const filtered = getFilteredEntries();
    let content = `MOOD TRACKER EXPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Time Range: Last ${timeRange} days\n`;
    content += `Total Entries: ${filtered.length}\n\n`;
    content += `=`.repeat(80) + '\n\n';

    const averages = calculateAverages();
    if (averages) {
      content += `AVERAGES (Last ${timeRange} days):\n`;
      content += `  Mood: ${averages.mood}/10\n`;
      content += `  Energy: ${averages.energy}/10\n`;
      content += `  Sleep: ${averages.sleep} hours\n`;
      content += `  Sleep Quality: ${averages.sleepQuality}/10\n\n`;
    }

    const commonEmotions = getMostCommon('emotionalState');
    if (commonEmotions.length > 0) {
      content += `MOST COMMON EMOTIONS:\n`;
      commonEmotions.forEach(({ item, count }) => {
        content += `  - ${item}: ${count} times\n`;
      });
      content += `\n`;
    }

    const commonTriggers = getMostCommon('triggers');
    if (commonTriggers.length > 0) {
      content += `MOST COMMON TRIGGERS:\n`;
      commonTriggers.forEach(({ item, count }) => {
        content += `  - ${item}: ${count} times\n`;
      });
      content += `\n`;
    }

    content += `=`.repeat(80) + '\n\n';
    content += `DETAILED ENTRIES:\n\n`;

    filtered.forEach(entry => {
      content += `DATE: ${new Date(entry.timestamp).toLocaleString()}\n`;
      content += `MOOD: ${entry.moodScore}/10 (${getMoodLabel(entry.moodScore)})\n`;
      content += `EMOTIONAL STATE: ${entry.emotionalState}\n`;
      content += `ENERGY: ${entry.energy}/10\n`;
      content += `SLEEP: ${entry.sleep} hours (Quality: ${entry.sleepQuality}/10)\n`;
      content += `SOCIAL: ${entry.socialInteraction}\n`;

      if (entry.triggers.length > 0) {
        content += `TRIGGERS: ${entry.triggers.join(', ')}\n`;
      }

      if (entry.positives.length > 0) {
        content += `POSITIVES: ${entry.positives.join(', ')}\n`;
      }

      if (entry.activities.length > 0) {
        content += `ACTIVITIES: ${entry.activities.join(', ')}\n`;
      }

      if (entry.physicalSymptoms.length > 0) {
        content += `PHYSICAL SYMPTOMS: ${entry.physicalSymptoms.join(', ')}\n`;
      }

      if (entry.medications.length > 0) {
        content += `MEDICATIONS: ${entry.medications.join(', ')}\n`;
      }

      if (entry.gratitude) {
        content += `GRATITUDE: ${entry.gratitude}\n`;
      }

      if (entry.notes) {
        content += `NOTES: ${entry.notes}\n`;
      }

      content += `\n` + `-`.repeat(80) + '\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Data exported');
  };

  const renderListView = () => {
    const filtered = getFilteredEntries();

    return (
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Smile className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No mood entries in the selected time range</p>
          </div>
        ) : (
          filtered.map(entry => {
            const moodStyle = getMoodEmoji(entry.moodScore);
            const MoodIcon = moodStyle.icon;

            return (
              <div
                key={entry.id}
                className={`p-4 rounded-xl border ${moodStyle.bg} ${moodStyle.border} transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MoodIcon className={`w-6 h-6 ${moodStyle.color}`} />
                      <h3 className="text-xl font-bold text-white">{entry.emotionalState}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${moodStyle.bg} ${moodStyle.color}`}>
                        {entry.moodScore}/10 - {getMoodLabel(entry.moodScore)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-purple-300 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                      <span>{entry.time}</span>
                      <span>Energy: {entry.energy}/10</span>
                      <span>Sleep: {entry.sleep}h ({entry.sleepQuality}/10)</span>
                      <span className="capitalize">Social: {entry.socialInteraction}</span>
                    </div>

                    {expandedEntry === entry.id && (
                      <div className="space-y-3 mt-4 border-t border-purple-500/30 pt-4">
                        {entry.triggers.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-purple-300 mb-2">Triggers:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.triggers.map((trigger, i) => (
                                <span key={i} className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm">
                                  {trigger}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.positives.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-purple-300 mb-2">Positives:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.positives.map((positive, i) => (
                                <span key={i} className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">
                                  {positive}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.activities.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-purple-300 mb-2">Activities:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.activities.map((activity, i) => (
                                <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.physicalSymptoms.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-purple-300 mb-2">Physical Symptoms:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.physicalSymptoms.map((symptom, i) => (
                                <span key={i} className="bg-orange-900/30 text-orange-300 px-3 py-1 rounded-full text-sm">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.medications.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-purple-300 mb-2">Medications:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.medications.map((med, i) => (
                                <span key={i} className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                                  {med}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.gratitude && (
                          <div>
                            <p className="text-sm font-semibold text-purple-300 mb-2">Gratitude:</p>
                            <p className="text-purple-200 italic">{entry.gratitude}</p>
                          </div>
                        )}

                        {entry.notes && (
                          <div>
                            <p className="text-sm font-semibold text-purple-300 mb-2">Notes:</p>
                            <p className="text-purple-200">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all"
                    >
                      {expandedEntry === entry.id ? (
                        <EyeOff className="w-5 h-5 text-purple-300" />
                      ) : (
                        <Eye className="w-5 h-5 text-purple-300" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5 text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderTrendsView = () => {
    const averages = calculateAverages();
    const commonEmotions = getMostCommon('emotionalState');
    const commonTriggersData = getMostCommon('triggers');
    const commonActivitiesData = getMostCommon('activities');

    return (
      <div className="space-y-6">
        {/* Averages */}
        {averages && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border border-yellow-500/30">
              <h3 className="text-yellow-300 font-semibold mb-2">Average Mood</h3>
              <p className="text-4xl font-bold text-white">{averages.mood}/10</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
              <h3 className="text-green-300 font-semibold mb-2">Average Energy</h3>
              <p className="text-4xl font-bold text-white">{averages.energy}/10</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
              <h3 className="text-blue-300 font-semibold mb-2">Average Sleep</h3>
              <p className="text-4xl font-bold text-white">{averages.sleep}h</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-purple-300 font-semibold mb-2">Sleep Quality</h3>
              <p className="text-4xl font-bold text-white">{averages.sleepQuality}/10</p>
            </div>
          </div>
        )}

        {/* Common Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commonEmotions.length > 0 && (
            <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4">Most Common Emotions</h3>
              <div className="space-y-2">
                {commonEmotions.map(({ item, count }) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-purple-200">{item}</span>
                    <span className="text-purple-400 font-semibold">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {commonTriggersData.length > 0 && (
            <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30">
              <h3 className="text-lg font-bold text-red-300 mb-4">Most Common Triggers</h3>
              <div className="space-y-2">
                {commonTriggersData.map(({ item, count }) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-red-200">{item}</span>
                    <span className="text-red-400 font-semibold">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {commonActivitiesData.length > 0 && (
            <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
              <h3 className="text-lg font-bold text-green-300 mb-4">Most Common Activities</h3>
              <div className="space-y-2">
                {commonActivitiesData.map(({ item, count }) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-green-200">{item}</span>
                    <span className="text-green-400 font-semibold">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Mood Tracker</h2>
          <p className="text-purple-300">Track your mental health journey</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl border border-blue-500/50 transition-all"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Entry
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 mb-6 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
            }`}
          >
            <Calendar className="w-5 h-5" />
            List
          </button>
          <button
            onClick={() => setViewMode('trends')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'trends'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Trends
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-purple-300 text-sm">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value) as 7 | 14 | 30)}
            className="px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <span className="text-purple-400 text-sm font-semibold ml-auto">
            {getFilteredEntries().length} {getFilteredEntries().length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'trends' && renderTrendsView()}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 p-8 rounded-2xl border border-purple-500/50 max-w-4xl w-full my-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add Mood Entry</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
              </div>

              {/* Emotional State */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">How are you feeling? *</label>
                <div className="flex flex-wrap gap-2">
                  {emotionalStates.map(state => (
                    <button
                      key={state}
                      onClick={() => setFormData({ ...formData, emotionalState: state })}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        formData.emotionalState === state
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                          : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Score */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Mood Score: {formData.moodScore}/10 - {getMoodLabel(formData.moodScore)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.moodScore}
                  onChange={(e) => setFormData({ ...formData, moodScore: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>1 - Very Low</span>
                  <span>5 - Okay</span>
                  <span>10 - Excellent</span>
                </div>
              </div>

              {/* Energy & Sleep */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">
                    Energy Level: {formData.energy}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energy}
                    onChange={(e) => setFormData({ ...formData, energy: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">
                    Sleep Last Night: {formData.sleep} hours
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="0.5"
                    value={formData.sleep}
                    onChange={(e) => setFormData({ ...formData, sleep: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Sleep Quality & Social */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">
                    Sleep Quality: {formData.sleepQuality}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleepQuality}
                    onChange={(e) => setFormData({ ...formData, sleepQuality: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Social Interaction</label>
                  <select
                    value={formData.socialInteraction}
                    onChange={(e) => setFormData({ ...formData, socialInteraction: e.target.value as any })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  >
                    <option value="none">None</option>
                    <option value="minimal">Minimal</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Triggers */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Triggers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonTriggers.map(trigger => (
                    <button
                      key={trigger}
                      onClick={() => addToList('triggers', trigger)}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-full text-sm transition-all"
                    >
                      + {trigger}
                    </button>
                  ))}
                </div>
                {formData.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.triggers.map((trigger, i) => (
                      <span key={i} className="flex items-center gap-2 bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm">
                        {trigger}
                        <button onClick={() => removeFromList('triggers', trigger)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Positives */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Positives / What Helped</label>
                <input
                  type="text"
                  placeholder="Add something positive..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('positives', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500 mb-2"
                />
                {formData.positives.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.positives.map((positive, i) => (
                      <span key={i} className="flex items-center gap-2 bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">
                        {positive}
                        <button onClick={() => removeFromList('positives', positive)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Activities */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Activities</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonActivities.map(activity => (
                    <button
                      key={activity}
                      onClick={() => addToList('activities', activity)}
                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-full text-sm transition-all"
                    >
                      + {activity}
                    </button>
                  ))}
                </div>
                {formData.activities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.activities.map((activity, i) => (
                      <span key={i} className="flex items-center gap-2 bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {activity}
                        <button onClick={() => removeFromList('activities', activity)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Physical Symptoms */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Physical Symptoms</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => addToList('physicalSymptoms', symptom)}
                      className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-full text-sm transition-all"
                    >
                      + {symptom}
                    </button>
                  ))}
                </div>
                {formData.physicalSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.physicalSymptoms.map((symptom, i) => (
                      <span key={i} className="flex items-center gap-2 bg-orange-900/30 text-orange-300 px-3 py-1 rounded-full text-sm">
                        {symptom}
                        <button onClick={() => removeFromList('physicalSymptoms', symptom)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Medications */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Medications Taken Today</label>
                <input
                  type="text"
                  placeholder="Add medication..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('medications', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500 mb-2"
                />
                {formData.medications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.medications.map((med, i) => (
                      <span key={i} className="flex items-center gap-2 bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {med}
                        <button onClick={() => removeFromList('medications', med)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Gratitude */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Gratitude (Optional)</label>
                <textarea
                  value={formData.gratitude}
                  onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
                  placeholder="What are you grateful for today?"
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional thoughts or observations..."
                  rows={4}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={addEntry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                <Plus className="w-6 h-6" />
                Add Mood Entry
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="px-6 py-4 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
