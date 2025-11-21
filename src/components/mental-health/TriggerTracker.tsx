import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, TrendingUp, Calendar, X, Eye, EyeOff, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface TriggerEntry {
  id: string;
  date: string;
  time: string;
  triggerName: string;
  category: string;
  severity: number; // 1-10
  situation: string;
  emotionalResponse: string[];
  physicalResponse: string[];
  behaviorsUrges: string[];
  copingUsed: string[];
  copingEffectiveness: number; // 1-10
  notes: string;
  timestamp: number;
}

interface TriggerPattern {
  trigger: string;
  frequency: number;
  avgSeverity: number;
  commonEmotions: string[];
  commonSituations: string[];
}

const TriggerTracker: React.FC = () => {
  const [entries, setEntries] = useState<TriggerEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'patterns'>('list');
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState<Omit<TriggerEntry, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    triggerName: '',
    category: 'Interpersonal',
    severity: 5,
    situation: '',
    emotionalResponse: [],
    physicalResponse: [],
    behaviorsUrges: [],
    copingUsed: [],
    copingEffectiveness: 5,
    notes: '',
  });

  const categories = [
    'Interpersonal', 'Environmental', 'Physical', 'Emotional', 'Cognitive',
    'Trauma-Related', 'Sensory', 'Time-Based', 'Substance-Related', 'Other'
  ];

  const commonTriggers = {
    'Interpersonal': ['Conflict', 'Rejection', 'Criticism', 'Being Ignored', 'Boundary Violation', 'Abandonment'],
    'Environmental': ['Crowds', 'Loud Noises', 'Bright Lights', 'Specific Places', 'Weather Changes', 'Clutter'],
    'Physical': ['Pain', 'Fatigue', 'Hunger', 'Illness', 'Lack of Sleep', 'Physical Touch'],
    'Emotional': ['Loneliness', 'Boredom', 'Shame', 'Guilt', 'Jealousy', 'Fear'],
    'Cognitive': ['Negative Thoughts', 'Intrusive Memories', 'Rumination', 'Overthinking', 'Perfectionism'],
    'Trauma-Related': ['Flashbacks', 'Anniversaries', 'Reminders', 'News Events', 'Similar Situations'],
    'Sensory': ['Smells', 'Sounds', 'Textures', 'Tastes', 'Visual Stimuli'],
  };

  const emotionalResponses = [
    'Anxiety', 'Panic', 'Anger', 'Sadness', 'Fear', 'Shame', 'Guilt',
    'Numbness', 'Overwhelm', 'Irritability', 'Despair', 'Hopelessness'
  ];

  const physicalResponses = [
    'Racing Heart', 'Trembling', 'Sweating', 'Nausea', 'Dizziness',
    'Chest Tightness', 'Muscle Tension', 'Headache', 'Stomach Pain',
    'Shortness of Breath', 'Hot/Cold Flashes', 'Fatigue'
  ];

  const behaviorUrges = [
    'Isolate', 'Self-Harm', 'Substance Use', 'Overeat', 'Restrict Food',
    'Lash Out', 'Withdraw', 'Run Away', 'Compulsive Behaviors',
    'Avoidance', 'Seeking Reassurance', 'People Pleasing'
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = localStorage.getItem('trigger_tracker');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  };

  const saveEntries = (data: TriggerEntry[]) => {
    setEntries(data);
    localStorage.setItem('trigger_tracker', JSON.stringify(data));
  };

  const addEntry = () => {
    if (!formData.triggerName.trim()) {
      toast.error('Trigger name is required');
      return;
    }

    const newEntry: TriggerEntry = {
      ...formData,
      id: `trigger_${Date.now()}`,
      timestamp: new Date(`${formData.date}T${formData.time}`).getTime(),
    };

    saveEntries([...entries, newEntry].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Trigger entry added');
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
      triggerName: '',
      category: 'Interpersonal',
      severity: 5,
      situation: '',
      emotionalResponse: [],
      physicalResponse: [],
      behaviorsUrges: [],
      copingUsed: [],
      copingEffectiveness: 5,
      notes: '',
    });
  };

  const addToList = (field: keyof TriggerEntry, value: string) => {
    const currentList = formData[field] as string[];
    if (value && !currentList.includes(value)) {
      setFormData({ ...formData, [field]: [...currentList, value] });
    }
  };

  const removeFromList = (field: keyof TriggerEntry, value: string) => {
    const currentList = formData[field] as string[];
    setFormData({ ...formData, [field]: currentList.filter(v => v !== value) });
  };

  const getFilteredEntries = () => {
    const cutoff = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
    let filtered = entries.filter(e => e.timestamp >= cutoff);

    if (filterCategory !== 'all') {
      filtered = filtered.filter(e => e.category === filterCategory);
    }

    return filtered;
  };

  const calculatePatterns = (): TriggerPattern[] => {
    const filtered = getFilteredEntries();
    const triggerMap = new Map<string, TriggerEntry[]>();

    filtered.forEach(entry => {
      const existing = triggerMap.get(entry.triggerName) || [];
      triggerMap.set(entry.triggerName, [...existing, entry]);
    });

    const patterns: TriggerPattern[] = [];

    triggerMap.forEach((entries, trigger) => {
      const avgSeverity = entries.reduce((sum, e) => sum + e.severity, 0) / entries.length;

      const emotionFreq = new Map<string, number>();
      const situationFreq = new Map<string, number>();

      entries.forEach(e => {
        e.emotionalResponse.forEach(emotion => {
          emotionFreq.set(emotion, (emotionFreq.get(emotion) || 0) + 1);
        });
        if (e.situation) {
          situationFreq.set(e.situation, (situationFreq.get(e.situation) || 0) + 1);
        }
      });

      const commonEmotions = Array.from(emotionFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emotion]) => emotion);

      const commonSituations = Array.from(situationFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([situation]) => situation);

      patterns.push({
        trigger,
        frequency: entries.length,
        avgSeverity: Math.round(avgSeverity * 10) / 10,
        commonEmotions,
        commonSituations,
      });
    });

    return patterns.sort((a, b) => b.frequency - a.frequency);
  };

  const getSeverityColor = (severity: number): string => {
    if (severity >= 8) return 'text-red-400 bg-red-900/30 border-red-500/50';
    if (severity >= 6) return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
    if (severity >= 4) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
    return 'text-green-400 bg-green-900/30 border-green-500/50';
  };

  const exportData = () => {
    const filtered = getFilteredEntries();
    let content = `TRIGGER TRACKER EXPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Time Range: Last ${timeRange} days\n`;
    content += `Total Entries: ${filtered.length}\n\n`;
    content += `=`.repeat(80) + '\n\n';

    const patterns = calculatePatterns();
    if (patterns.length > 0) {
      content += `TRIGGER PATTERNS (Last ${timeRange} days):\n\n`;
      patterns.forEach(pattern => {
        content += `${pattern.trigger}:\n`;
        content += `  - Occurrences: ${pattern.frequency}\n`;
        content += `  - Avg Severity: ${pattern.avgSeverity}/10\n`;
        if (pattern.commonEmotions.length > 0) {
          content += `  - Common Emotions: ${pattern.commonEmotions.join(', ')}\n`;
        }
        content += `\n`;
      });
      content += `\n${`=`.repeat(80)}\n\n`;
    }

    content += `DETAILED ENTRIES:\n\n`;

    filtered.forEach(entry => {
      content += `DATE: ${new Date(entry.timestamp).toLocaleString()}\n`;
      content += `TRIGGER: ${entry.triggerName}\n`;
      content += `CATEGORY: ${entry.category}\n`;
      content += `SEVERITY: ${entry.severity}/10\n`;
      if (entry.situation) content += `SITUATION: ${entry.situation}\n`;

      if (entry.emotionalResponse.length > 0) {
        content += `EMOTIONAL RESPONSE: ${entry.emotionalResponse.join(', ')}\n`;
      }

      if (entry.physicalResponse.length > 0) {
        content += `PHYSICAL RESPONSE: ${entry.physicalResponse.join(', ')}\n`;
      }

      if (entry.behaviorsUrges.length > 0) {
        content += `BEHAVIORS/URGES: ${entry.behaviorsUrges.join(', ')}\n`;
      }

      if (entry.copingUsed.length > 0) {
        content += `COPING USED: ${entry.copingUsed.join(', ')}\n`;
        content += `COPING EFFECTIVENESS: ${entry.copingEffectiveness}/10\n`;
      }

      if (entry.notes) {
        content += `NOTES: ${entry.notes}\n`;
      }

      content += `\n${`-`.repeat(80)}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trigger-tracker-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Data exported');
  };

  const renderListView = () => {
    const filtered = getFilteredEntries();

    return (
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No trigger entries in the selected time range</p>
          </div>
        ) : (
          filtered.map(entry => (
            <div
              key={entry.id}
              className={`p-4 rounded-xl border ${getSeverityColor(entry.severity)} transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold text-white">{entry.triggerName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(entry.severity)}`}>
                      {entry.severity}/10
                    </span>
                    <span className="bg-purple-900/30 px-3 py-1 rounded-full text-purple-300 text-sm">
                      {entry.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-purple-300 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <span>{entry.time}</span>
                  </div>

                  {entry.situation && (
                    <p className="text-purple-200 mb-3 italic">"{entry.situation}"</p>
                  )}

                  {expandedEntry === entry.id && (
                    <div className="space-y-3 mt-4 border-t border-purple-500/30 pt-4">
                      {entry.emotionalResponse.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-2">Emotional Response:</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.emotionalResponse.map((emotion, i) => (
                              <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.physicalResponse.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-2">Physical Response:</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.physicalResponse.map((physical, i) => (
                              <span key={i} className="bg-orange-900/30 text-orange-300 px-3 py-1 rounded-full text-sm">
                                {physical}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.behaviorsUrges.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-2">Behaviors/Urges:</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.behaviorsUrges.map((behavior, i) => (
                              <span key={i} className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm">
                                {behavior}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.copingUsed.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-2">
                            Coping Used (Effectiveness: {entry.copingEffectiveness}/10):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {entry.copingUsed.map((coping, i) => (
                              <span key={i} className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">
                                {coping}
                              </span>
                            ))}
                          </div>
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
          ))
        )}
      </div>
    );
  };

  const renderPatternsView = () => {
    const patterns = calculatePatterns();

    return (
      <div className="space-y-4">
        {patterns.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Not enough data to detect patterns</p>
          </div>
        ) : (
          patterns.map((pattern, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{pattern.trigger}</h3>
                  <p className="text-purple-300">
                    Occurred {pattern.frequency} {pattern.frequency === 1 ? 'time' : 'times'} in the last {timeRange} days
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${getSeverityColor(Math.round(pattern.avgSeverity))}`}>
                  Avg: {pattern.avgSeverity}/10
                </span>
              </div>

              {pattern.commonEmotions.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-purple-300 mb-2">Most Common Emotional Responses:</p>
                  <div className="flex flex-wrap gap-2">
                    {pattern.commonEmotions.map((emotion, i) => (
                      <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pattern.commonSituations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-purple-300 mb-2">Common Situations:</p>
                  <div className="space-y-1">
                    {pattern.commonSituations.map((situation, i) => (
                      <p key={i} className="text-purple-200 italic">• {situation}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Trigger Tracker</h2>
          <p className="text-purple-300">Identify patterns and develop awareness of your triggers</p>
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
            Log Trigger
          </button>
        </div>
      </div>

      {/* Controls */}
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
            onClick={() => setViewMode('patterns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'patterns'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Patterns
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

          <span className="text-purple-300 text-sm ml-4">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <span className="text-purple-400 text-sm font-semibold ml-auto">
            {getFilteredEntries().length} {getFilteredEntries().length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'patterns' && renderPatternsView()}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 p-8 rounded-2xl border border-purple-500/50 max-w-3xl w-full my-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Log Trigger</h3>
              <button
                onClick={() => { setShowAddForm(false); resetForm(); }}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Basic Info */}
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

              {/* Trigger Name & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Trigger Name *</label>
                  <input
                    type="text"
                    value={formData.triggerName}
                    onChange={(e) => setFormData({ ...formData, triggerName: e.target.value })}
                    placeholder="e.g., Conflict with partner"
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                  />
                  {formData.category && commonTriggers[formData.category as keyof typeof commonTriggers] && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commonTriggers[formData.category as keyof typeof commonTriggers].map(trigger => (
                        <button
                          key={trigger}
                          onClick={() => setFormData({ ...formData, triggerName: trigger })}
                          className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded text-xs transition-all"
                        >
                          {trigger}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Severity: {formData.severity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Situation */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">What was happening?</label>
                <textarea
                  value={formData.situation}
                  onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                  placeholder="Describe the situation..."
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              {/* Emotional Response */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Emotional Response</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {emotionalResponses.map(emotion => (
                    <button
                      key={emotion}
                      onClick={() => addToList('emotionalResponse', emotion)}
                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-full text-sm transition-all"
                    >
                      + {emotion}
                    </button>
                  ))}
                </div>
                {formData.emotionalResponse.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.emotionalResponse.map((emotion, i) => (
                      <span key={i} className="flex items-center gap-2 bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {emotion}
                        <button onClick={() => removeFromList('emotionalResponse', emotion)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Physical Response */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Physical Response</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {physicalResponses.slice(0, 8).map(physical => (
                    <button
                      key={physical}
                      onClick={() => addToList('physicalResponse', physical)}
                      className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-full text-sm transition-all"
                    >
                      + {physical}
                    </button>
                  ))}
                </div>
                {formData.physicalResponse.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.physicalResponse.map((physical, i) => (
                      <span key={i} className="flex items-center gap-2 bg-orange-900/30 text-orange-300 px-3 py-1 rounded-full text-sm">
                        {physical}
                        <button onClick={() => removeFromList('physicalResponse', physical)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Coping Used */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Coping Skills Used</label>
                <input
                  type="text"
                  placeholder="Add coping skill..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('copingUsed', (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500 mb-2"
                />
                {formData.copingUsed.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.copingUsed.map((coping, i) => (
                        <span key={i} className="flex items-center gap-2 bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">
                          {coping}
                          <button onClick={() => removeFromList('copingUsed', coping)}>
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div>
                      <label className="block text-green-300 mb-2 text-sm">Coping Effectiveness: {formData.copingEffectiveness}/10</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.copingEffectiveness}
                        onChange={(e) => setFormData({ ...formData, copingEffectiveness: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any other observations..."
                  rows={4}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addEntry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                <Plus className="w-6 h-6" />
                Log Trigger
              </button>
              <button
                onClick={() => { setShowAddForm(false); resetForm(); }}
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

export default TriggerTracker;
