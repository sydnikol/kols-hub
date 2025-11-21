import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, AlertCircle, Download, Filter, X, Clock, Activity, Zap, Search, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface SymptomEntry {
  id: string;
  date: string;
  time: string;
  symptomName: string;
  severity: number; // 1-10
  duration: string; // e.g., "2 hours", "ongoing", "intermittent"
  bodyPart?: string;
  triggers: string[];
  relievedBy: string[];
  medications: string[];
  notes: string;
  timestamp: number;
}

interface SymptomPattern {
  symptom: string;
  frequency: number; // occurrences in time period
  avgSeverity: number;
  commonTriggers: string[];
}

const SymptomTimeline: React.FC = () => {
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'patterns' | 'list'>('timeline');
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<number | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<SymptomEntry, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    symptomName: '',
    severity: 5,
    duration: '',
    bodyPart: '',
    triggers: [],
    relievedBy: [],
    medications: [],
    notes: '',
  });

  const [triggerInput, setTriggerInput] = useState('');
  const [reliefInput, setReliefInput] = useState('');
  const [medInput, setMedInput] = useState('');

  const commonSymptoms = [
    'Dizziness', 'Headache', 'Nausea', 'Fatigue', 'Brain Fog',
    'Chest Pain', 'Palpitations', 'Shortness of Breath', 'Muscle Pain',
    'Joint Pain', 'Tremors', 'Vision Changes', 'Weakness', 'Numbness/Tingling',
    'Anxiety', 'Temperature Dysregulation', 'GI Issues', 'Insomnia', 'Pain'
  ];

  const commonTriggers = [
    'Standing', 'Heat', 'Dehydration', 'Low Sodium', 'Stress', 'Poor Sleep',
    'Exercise', 'Food', 'Weather Change', 'Medication', 'Menstrual Cycle', 'Overstimulation'
  ];

  const commonReliefs = [
    'Lying Down', 'Hydration', 'Salt', 'Medication', 'Compression Garments',
    'Cold Pack', 'Heat Pack', 'Rest', 'Deep Breathing', 'Quiet/Dark Room'
  ];

  const bodyParts = [
    'Head', 'Neck', 'Chest', 'Back', 'Abdomen', 'Arms', 'Hands',
    'Legs', 'Feet', 'Full Body', 'Multiple Areas'
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = localStorage.getItem('symptom_timeline');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  };

  const saveEntries = (data: SymptomEntry[]) => {
    setEntries(data);
    localStorage.setItem('symptom_timeline', JSON.stringify(data));
  };

  const addEntry = () => {
    if (!formData.symptomName.trim()) {
      toast.error('Symptom name is required');
      return;
    }

    const newEntry: SymptomEntry = {
      ...formData,
      id: `symptom_${Date.now()}`,
      timestamp: new Date(`${formData.date}T${formData.time}`).getTime(),
    };

    saveEntries([...entries, newEntry].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Symptom entry added');
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
      symptomName: '',
      severity: 5,
      duration: '',
      bodyPart: '',
      triggers: [],
      relievedBy: [],
      medications: [],
      notes: '',
    });
    setTriggerInput('');
    setReliefInput('');
    setMedInput('');
  };

  const addTrigger = (trigger: string) => {
    if (trigger && !formData.triggers.includes(trigger)) {
      setFormData({ ...formData, triggers: [...formData.triggers, trigger] });
      setTriggerInput('');
    }
  };

  const removeTrigger = (trigger: string) => {
    setFormData({ ...formData, triggers: formData.triggers.filter(t => t !== trigger) });
  };

  const addRelief = (relief: string) => {
    if (relief && !formData.relievedBy.includes(relief)) {
      setFormData({ ...formData, relievedBy: [...formData.relievedBy, relief] });
      setReliefInput('');
    }
  };

  const removeRelief = (relief: string) => {
    setFormData({ ...formData, relievedBy: formData.relievedBy.filter(r => r !== relief) });
  };

  const addMed = (med: string) => {
    if (med && !formData.medications.includes(med)) {
      setFormData({ ...formData, medications: [...formData.medications, med] });
      setMedInput('');
    }
  };

  const removeMed = (med: string) => {
    setFormData({ ...formData, medications: formData.medications.filter(m => m !== med) });
  };

  const getSeverityColor = (severity: number): string => {
    if (severity >= 8) return 'text-red-400 bg-red-900/30 border-red-500/50';
    if (severity >= 6) return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
    if (severity >= 4) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
    return 'text-green-400 bg-green-900/30 border-green-500/50';
  };

  const getSeverityLabel = (severity: number): string => {
    if (severity >= 9) return 'Severe';
    if (severity >= 7) return 'High';
    if (severity >= 5) return 'Moderate';
    if (severity >= 3) return 'Mild';
    return 'Minimal';
  };

  const getFilteredEntries = () => {
    let filtered = [...entries];

    // Time range filter
    const cutoff = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(e => e.timestamp >= cutoff);

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.symptomName.toLowerCase().includes(term) ||
        e.notes.toLowerCase().includes(term) ||
        e.bodyPart?.toLowerCase().includes(term)
      );
    }

    // Severity filter
    if (filterSeverity !== null) {
      filtered = filtered.filter(e => e.severity >= filterSeverity);
    }

    return filtered;
  };

  const calculatePatterns = (): SymptomPattern[] => {
    const filtered = getFilteredEntries();
    const symptomMap = new Map<string, SymptomEntry[]>();

    filtered.forEach(entry => {
      const existing = symptomMap.get(entry.symptomName) || [];
      symptomMap.set(entry.symptomName, [...existing, entry]);
    });

    const patterns: SymptomPattern[] = [];

    symptomMap.forEach((entries, symptom) => {
      const avgSeverity = entries.reduce((sum, e) => sum + e.severity, 0) / entries.length;

      const triggerFreq = new Map<string, number>();
      entries.forEach(e => {
        e.triggers.forEach(t => {
          triggerFreq.set(t, (triggerFreq.get(t) || 0) + 1);
        });
      });

      const commonTriggers = Array.from(triggerFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([trigger]) => trigger);

      patterns.push({
        symptom,
        frequency: entries.length,
        avgSeverity: Math.round(avgSeverity * 10) / 10,
        commonTriggers,
      });
    });

    return patterns.sort((a, b) => b.frequency - a.frequency);
  };

  const exportTimeline = () => {
    const filtered = getFilteredEntries();
    let content = `SYMPTOM TIMELINE EXPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Time Range: Last ${timeRange} days\n`;
    content += `Total Entries: ${filtered.length}\n\n`;
    content += `=`.repeat(80) + '\n\n';

    filtered.forEach(entry => {
      content += `DATE: ${new Date(entry.timestamp).toLocaleString()}\n`;
      content += `SYMPTOM: ${entry.symptomName}\n`;
      content += `SEVERITY: ${entry.severity}/10 (${getSeverityLabel(entry.severity)})\n`;
      content += `DURATION: ${entry.duration}\n`;
      if (entry.bodyPart) content += `LOCATION: ${entry.bodyPart}\n`;

      if (entry.triggers.length > 0) {
        content += `TRIGGERS: ${entry.triggers.join(', ')}\n`;
      }

      if (entry.relievedBy.length > 0) {
        content += `RELIEVED BY: ${entry.relievedBy.join(', ')}\n`;
      }

      if (entry.medications.length > 0) {
        content += `MEDICATIONS: ${entry.medications.join(', ')}\n`;
      }

      if (entry.notes) {
        content += `NOTES: ${entry.notes}\n`;
      }

      content += `\n` + `-`.repeat(80) + '\n\n';
    });

    // Add pattern summary
    const patterns = calculatePatterns();
    content += `\nPATTERN ANALYSIS (Last ${timeRange} days)\n`;
    content += `=`.repeat(80) + '\n\n';

    patterns.forEach(pattern => {
      content += `${pattern.symptom}:\n`;
      content += `  - Occurrences: ${pattern.frequency}\n`;
      content += `  - Avg Severity: ${pattern.avgSeverity}/10\n`;
      if (pattern.commonTriggers.length > 0) {
        content += `  - Common Triggers: ${pattern.commonTriggers.join(', ')}\n`;
      }
      content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptom-timeline-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Timeline exported');
  };

  const renderTimelineView = () => {
    const filtered = getFilteredEntries();

    return (
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No symptom entries in the selected time range</p>
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
                    <h3 className="text-xl font-bold text-white">{entry.symptomName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(entry.severity)}`}>
                      {entry.severity}/10 - {getSeverityLabel(entry.severity)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-purple-300 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {entry.time}
                    </span>
                    {entry.duration && (
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {entry.duration}
                      </span>
                    )}
                    {entry.bodyPart && (
                      <span className="bg-purple-900/30 px-2 py-1 rounded">
                        {entry.bodyPart}
                      </span>
                    )}
                  </div>

                  {expandedEntry === entry.id && (
                    <div className="space-y-3 mt-4 border-t border-purple-500/30 pt-4">
                      {entry.triggers.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-2">Potential Triggers:</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.triggers.map((trigger, i) => (
                              <span key={i} className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.relievedBy.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-2">Relieved By:</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.relievedBy.map((relief, i) => (
                              <span key={i} className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">
                                {relief}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.medications.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-purple-300 mb-2">Medications Taken:</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.medications.map((med, i) => (
                              <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                                {med}
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
        <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
          <h3 className="text-lg font-bold text-purple-300 mb-2">Pattern Analysis</h3>
          <p className="text-purple-400 text-sm">
            Based on the last {timeRange} days of symptom tracking
          </p>
        </div>

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
                  <h3 className="text-2xl font-bold text-white mb-1">{pattern.symptom}</h3>
                  <p className="text-purple-300">
                    Occurred {pattern.frequency} {pattern.frequency === 1 ? 'time' : 'times'} in the last {timeRange} days
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${getSeverityColor(Math.round(pattern.avgSeverity))}`}>
                  Avg: {pattern.avgSeverity}/10
                </span>
              </div>

              {pattern.commonTriggers.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-purple-300 mb-2">Most Common Triggers:</p>
                  <div className="flex flex-wrap gap-2">
                    {pattern.commonTriggers.map((trigger, i) => (
                      <span key={i} className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {trigger}
                      </span>
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
          <h2 className="text-3xl font-bold text-white mb-2">Symptom Timeline</h2>
          <p className="text-purple-300">Track symptoms, identify patterns, and prepare for doctor visits</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportTimeline}
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
            Add Symptom
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 mb-6 space-y-4">
        {/* View Mode Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              viewMode === 'timeline'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Timeline
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

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Time Range */}
          <div className="flex items-center gap-2">
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
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-purple-300 text-sm">Min Severity:</span>
            <select
              value={filterSeverity ?? ''}
              onChange={(e) => setFilterSeverity(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
            >
              <option value="">All</option>
              <option value="7">7+ (High)</option>
              <option value="5">5+ (Moderate)</option>
              <option value="3">3+ (Mild)</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full pl-10 pr-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-500/30">
            <span className="text-purple-300 text-sm font-semibold">
              {getFilteredEntries().length} {getFilteredEntries().length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'timeline' && renderTimelineView()}
      {viewMode === 'patterns' && renderPatternsView()}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 p-8 rounded-2xl border border-purple-500/50 max-w-3xl w-full my-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add Symptom Entry</h3>
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

              {/* Symptom Name */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Symptom Name *</label>
                <input
                  type="text"
                  value={formData.symptomName}
                  onChange={(e) => setFormData({ ...formData, symptomName: e.target.value })}
                  placeholder="e.g., Dizziness, Headache, Nausea"
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => setFormData({ ...formData, symptomName: symptom })}
                      className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-full text-sm transition-all"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Severity: {formData.severity}/10 - {getSeverityLabel(formData.severity)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>1 - Minimal</span>
                  <span>5 - Moderate</span>
                  <span>10 - Severe</span>
                </div>
              </div>

              {/* Duration & Body Part */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 hours, ongoing"
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Body Part/Location</label>
                  <select
                    value={formData.bodyPart}
                    onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  >
                    <option value="">Select location...</option>
                    {bodyParts.map(part => (
                      <option key={part} value={part}>{part}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Triggers */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Potential Triggers</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={triggerInput}
                    onChange={(e) => setTriggerInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrigger(triggerInput))}
                    placeholder="Add trigger..."
                    className="flex-1 px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                  />
                  <button
                    onClick={() => addTrigger(triggerInput)}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonTriggers.map(trigger => (
                    <button
                      key={trigger}
                      onClick={() => addTrigger(trigger)}
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
                        <button onClick={() => removeTrigger(trigger)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Relieved By */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Relieved By</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={reliefInput}
                    onChange={(e) => setReliefInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRelief(reliefInput))}
                    placeholder="What helped..."
                    className="flex-1 px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                  />
                  <button
                    onClick={() => addRelief(reliefInput)}
                    className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonReliefs.map(relief => (
                    <button
                      key={relief}
                      onClick={() => addRelief(relief)}
                      className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-full text-sm transition-all"
                    >
                      + {relief}
                    </button>
                  ))}
                </div>
                {formData.relievedBy.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.relievedBy.map((relief, i) => (
                      <span key={i} className="flex items-center gap-2 bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">
                        {relief}
                        <button onClick={() => removeRelief(relief)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Medications */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Medications Taken</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={medInput}
                    onChange={(e) => setMedInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMed(medInput))}
                    placeholder="Medication name & dose..."
                    className="flex-1 px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                  />
                  <button
                    onClick={() => addMed(medInput)}
                    className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {formData.medications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.medications.map((med, i) => (
                      <span key={i} className="flex items-center gap-2 bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {med}
                        <button onClick={() => removeMed(med)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional context, patterns, or observations..."
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
                Add Symptom Entry
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

export default SymptomTimeline;
