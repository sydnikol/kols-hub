import React, { useState, useEffect } from 'react';
import {
  Activity, Calendar, Plus, X, Download, TrendingUp, AlertCircle,
  Heart, Brain, Eye, Zap, Cloud, Moon, Droplets, ThermometerSun,
  Clock, Filter, FileText, Printer, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { HEALTH_CONDITIONS_REGISTRY, SYMPTOM_TRACKING } from '../../data/kol-master-feature-list';

// ===== INTERFACES =====
interface DailyBodyScan {
  id: string;
  date: string;
  timestamp: number;
  pain: {
    level: number;
    locations: string[];
  };
  dizziness: number;
  nausea: number;
  fatigue: number;
  cognitive: {
    brainFog: number;
    dissociation: boolean;
  };
  emotionalLoad: number;
  notes: string;
}

interface MigraineEntry {
  id: string;
  date: string;
  timestamp: number;
  auraType: string;
  duration: string;
  triggers: string[];
  rescueMedUsed: string[];
  severity: number;
  notes: string;
}

interface POTSEpisode {
  id: string;
  date: string;
  timestamp: number;
  heartRateIncrease: number;
  syncope: 'none' | 'near-syncope' | 'syncope';
  duration: string;
  triggers: string[];
  notes: string;
}

interface TriggerCorrelation {
  id: string;
  date: string;
  timestamp: number;
  weather: string;
  sleepQuality: number;
  sleepHours: number;
  hydration: number;
  foodNotes: string;
  stressLevel: number;
  menstrualPhase: string;
}

interface FlareDay {
  id: string;
  date: string;
  timestamp: number;
  severity: 'mild' | 'moderate' | 'severe' | 'crisis';
  conditions: string[];
  notes: string;
}

// ===== CONSTANTS =====
const BODY_LOCATIONS = [
  'Head', 'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Chest',
  'Abdomen', 'Hips', 'Left Arm', 'Right Arm', 'Left Hand', 'Right Hand',
  'Left Leg', 'Right Leg', 'Left Knee', 'Right Knee', 'Left Foot', 'Right Foot',
  'Jaw/TMJ', 'Full Body', 'Multiple Areas'
];

const AURA_TYPES = [
  'Visual - Zigzag lines', 'Visual - Blind spots', 'Visual - Flashing lights',
  'Visual - Tunnel vision', 'Sensory - Tingling', 'Sensory - Numbness',
  'Speech difficulty', 'Motor weakness', 'Vertigo', 'None'
];

const MIGRAINE_TRIGGERS = [
  'Stress', 'Weather changes', 'Bright lights', 'Loud sounds', 'Strong smells',
  'Citrus', 'Chocolate', 'Alcohol', 'Caffeine withdrawal', 'Dehydration',
  'Poor sleep', 'Hormonal', 'Screen time', 'Skipped meal'
];

const POTS_TRIGGERS = [
  'Standing too long', 'Heat exposure', 'Dehydration', 'Low salt intake',
  'Stress', 'Large meal', 'Hot shower', 'Exercise', 'Menstrual cycle',
  'Lack of sleep', 'Alcohol', 'Illness'
];

const RESCUE_MEDS = [
  'Sumatriptan', 'Rizatriptan', 'Ibuprofen', 'Acetaminophen', 'Excedrin',
  'Ondansetron', 'Promethazine', 'Medical cannabis', 'Other'
];

const WEATHER_OPTIONS = [
  'Clear/Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Hot', 'Cold',
  'Humid', 'Dry', 'Pressure change', 'Temperature swing'
];

const MENSTRUAL_PHASES = [
  'N/A', 'Menstrual', 'Follicular', 'Ovulation', 'Luteal', 'Unknown'
];

const FLARE_CONDITIONS = HEALTH_CONDITIONS_REGISTRY.map(c => c.name);

// ===== HELPER FUNCTIONS =====
const getSeverityColor = (level: number): string => {
  if (level >= 8) return 'text-red-400 bg-red-900/30 border-red-500/50';
  if (level >= 6) return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
  if (level >= 4) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
  return 'text-green-400 bg-green-900/30 border-green-500/50';
};

const getSeverityLabel = (level: number): string => {
  if (level >= 9) return 'Severe';
  if (level >= 7) return 'High';
  if (level >= 5) return 'Moderate';
  if (level >= 3) return 'Mild';
  return 'Minimal';
};

const getFlareColor = (severity: string): string => {
  switch (severity) {
    case 'crisis': return 'bg-red-600 text-white';
    case 'severe': return 'bg-red-500/30 text-red-300 border-red-500/50';
    case 'moderate': return 'bg-orange-500/30 text-orange-300 border-orange-500/50';
    default: return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
  }
};

// ===== MAIN COMPONENT =====
const SymptomTracker: React.FC = () => {
  // State for all tracking types
  const [dailyScans, setDailyScans] = useState<DailyBodyScan[]>([]);
  const [migraines, setMigraines] = useState<MigraineEntry[]>([]);
  const [potsEpisodes, setPotsEpisodes] = useState<POTSEpisode[]>([]);
  const [triggerData, setTriggerData] = useState<TriggerCorrelation[]>([]);
  const [flareDays, setFlareDays] = useState<FlareDay[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<'scan' | 'migraine' | 'pots' | 'triggers' | 'flares' | 'trends' | 'export'>('scan');
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Load data from localStorage
  useEffect(() => {
    const loadData = (key: string) => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    };
    setDailyScans(loadData('symptom_daily_scans'));
    setMigraines(loadData('symptom_migraines'));
    setPotsEpisodes(loadData('symptom_pots'));
    setTriggerData(loadData('symptom_triggers'));
    setFlareDays(loadData('symptom_flares'));
  }, []);

  // Save helpers
  const saveData = (key: string, data: unknown[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Tab configuration
  const tabs = [
    { id: 'scan', label: 'Body Scan', icon: Activity },
    { id: 'migraine', label: 'Migraines', icon: Eye },
    { id: 'pots', label: 'POTS', icon: Heart },
    { id: 'triggers', label: 'Triggers', icon: Zap },
    { id: 'flares', label: 'Flare Days', icon: AlertCircle },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'export', label: 'Export', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Symptom & Flare Tracking</h2>
        <p className="text-purple-300">
          Track daily symptoms, episodes, and identify patterns for better care
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 bg-purple-900/20 p-2 rounded-xl border border-purple-500/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as typeof activeTab); setShowForm(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-purple-900/30 text-purple-300 hover:bg-purple-500/20'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'scan' && (
        <DailyBodyScanSection
          scans={dailyScans}
          setScans={(data) => { setDailyScans(data); saveData('symptom_daily_scans', data); }}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
      {activeTab === 'migraine' && (
        <MigraineSection
          entries={migraines}
          setEntries={(data) => { setMigraines(data); saveData('symptom_migraines', data); }}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
      {activeTab === 'pots' && (
        <POTSSection
          episodes={potsEpisodes}
          setEpisodes={(data) => { setPotsEpisodes(data); saveData('symptom_pots', data); }}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
      {activeTab === 'triggers' && (
        <TriggerSection
          data={triggerData}
          setData={(data) => { setTriggerData(data); saveData('symptom_triggers', data); }}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
      {activeTab === 'flares' && (
        <FlareSection
          flares={flareDays}
          setFlares={(data) => { setFlareDays(data); saveData('symptom_flares', data); }}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
      {activeTab === 'trends' && (
        <TrendsSection
          dailyScans={dailyScans}
          migraines={migraines}
          potsEpisodes={potsEpisodes}
          triggerData={triggerData}
          flareDays={flareDays}
        />
      )}
      {activeTab === 'export' && (
        <ExportSection
          dailyScans={dailyScans}
          migraines={migraines}
          potsEpisodes={potsEpisodes}
          triggerData={triggerData}
          flareDays={flareDays}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}
    </div>
  );
};

// ===== DAILY BODY SCAN SECTION =====
interface DailyBodyScanSectionProps {
  scans: DailyBodyScan[];
  setScans: (data: DailyBodyScan[]) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const DailyBodyScanSection: React.FC<DailyBodyScanSectionProps> = ({
  scans, setScans, showForm, setShowForm
}) => {
  const [form, setForm] = useState<Omit<DailyBodyScan, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    pain: { level: 4, locations: [] },
    dizziness: 3,
    nausea: 2,
    fatigue: 5,
    cognitive: { brainFog: 4, dissociation: false },
    emotionalLoad: 4,
    notes: ''
  });

  const addScan = () => {
    const newScan: DailyBodyScan = {
      ...form,
      id: `scan_${Date.now()}`,
      timestamp: new Date(form.date).getTime()
    };
    setScans([...scans, newScan].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Daily scan logged');
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      pain: { level: 4, locations: [] },
      dizziness: 3,
      nausea: 2,
      fatigue: 5,
      cognitive: { brainFog: 4, dissociation: false },
      emotionalLoad: 4,
      notes: ''
    });
  };

  const deleteScan = (id: string) => {
    setScans(scans.filter(s => s.id !== id));
    toast.success('Entry removed');
  };

  const toggleLocation = (loc: string) => {
    const locs = form.pain.locations.includes(loc)
      ? form.pain.locations.filter(l => l !== loc)
      : [...form.pain.locations, loc];
    setForm({ ...form, pain: { ...form.pain, locations: locs } });
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          New Daily Scan
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-6 rounded-2xl border border-purple-500/50 max-w-2xl w-full my-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                Daily Body Scan
              </h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Date */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              {/* Pain Level & Locations */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Pain Level: {form.pain.level}/10 - {getSeverityLabel(form.pain.level)}
                </label>
                <input
                  type="range" min="0" max="10" value={form.pain.level}
                  onChange={(e) => setForm({ ...form, pain: { ...form.pain, level: Number(e.target.value) } })}
                  className="w-full mb-3"
                />
                <label className="block text-purple-300 mb-2 text-sm">Pain Locations (select all that apply):</label>
                <div className="flex flex-wrap gap-2">
                  {BODY_LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        form.pain.locations.includes(loc)
                          ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                          : 'bg-purple-900/30 text-purple-400 hover:bg-purple-500/20'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dizziness */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Dizziness: {form.dizziness}/10
                </label>
                <input
                  type="range" min="0" max="10" value={form.dizziness}
                  onChange={(e) => setForm({ ...form, dizziness: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Nausea */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Nausea: {form.nausea}/10
                </label>
                <input
                  type="range" min="0" max="10" value={form.nausea}
                  onChange={(e) => setForm({ ...form, nausea: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Fatigue */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Fatigue: {form.fatigue}/10
                </label>
                <input
                  type="range" min="0" max="10" value={form.fatigue}
                  onChange={(e) => setForm({ ...form, fatigue: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Cognitive Status */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Brain Fog: {form.cognitive.brainFog}/10
                </label>
                <input
                  type="range" min="0" max="10" value={form.cognitive.brainFog}
                  onChange={(e) => setForm({ ...form, cognitive: { ...form.cognitive, brainFog: Number(e.target.value) } })}
                  className="w-full mb-3"
                />
                <label className="flex items-center gap-3 text-purple-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.cognitive.dissociation}
                    onChange={(e) => setForm({ ...form, cognitive: { ...form.cognitive, dissociation: e.target.checked } })}
                    className="w-5 h-5 rounded bg-purple-900/30 border-purple-500/30"
                  />
                  <span>Experiencing dissociation</span>
                </label>
              </div>

              {/* Emotional Load */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Emotional Load: {form.emotionalLoad}/10
                </label>
                <input
                  type="range" min="0" max="10" value={form.emotionalLoad}
                  onChange={(e) => setForm({ ...form, emotionalLoad: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional observations..."
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              {/* Submit */}
              <button
                onClick={addScan}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                Save Daily Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {scans.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No daily scans recorded yet</p>
          </div>
        ) : (
          scans.slice(0, 10).map(scan => (
            <div key={scan.id} className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-bold">{new Date(scan.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm">
                    <div className={`p-2 rounded-lg border ${getSeverityColor(scan.pain.level)}`}>
                      <div className="font-semibold">Pain</div>
                      <div>{scan.pain.level}/10</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${getSeverityColor(scan.dizziness)}`}>
                      <div className="font-semibold">Dizziness</div>
                      <div>{scan.dizziness}/10</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${getSeverityColor(scan.nausea)}`}>
                      <div className="font-semibold">Nausea</div>
                      <div>{scan.nausea}/10</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${getSeverityColor(scan.fatigue)}`}>
                      <div className="font-semibold">Fatigue</div>
                      <div>{scan.fatigue}/10</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${getSeverityColor(scan.cognitive.brainFog)}`}>
                      <div className="font-semibold">Brain Fog</div>
                      <div>{scan.cognitive.brainFog}/10</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${getSeverityColor(scan.emotionalLoad)}`}>
                      <div className="font-semibold">Emotional</div>
                      <div>{scan.emotionalLoad}/10</div>
                    </div>
                  </div>
                  {scan.pain.locations.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {scan.pain.locations.map(loc => (
                        <span key={loc} className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs">{loc}</span>
                      ))}
                    </div>
                  )}
                  {scan.cognitive.dissociation && (
                    <div className="mt-2 text-yellow-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Dissociation noted
                    </div>
                  )}
                </div>
                <button onClick={() => deleteScan(scan.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg ml-2">
                  <X className="w-5 h-5 text-red-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===== MIGRAINE SECTION =====
interface MigraineSectionProps {
  entries: MigraineEntry[];
  setEntries: (data: MigraineEntry[]) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const MigraineSection: React.FC<MigraineSectionProps> = ({
  entries, setEntries, showForm, setShowForm
}) => {
  const [form, setForm] = useState<Omit<MigraineEntry, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    auraType: 'None',
    duration: '',
    triggers: [],
    rescueMedUsed: [],
    severity: 6,
    notes: ''
  });

  const addEntry = () => {
    const newEntry: MigraineEntry = {
      ...form,
      id: `migraine_${Date.now()}`,
      timestamp: new Date(form.date).getTime()
    };
    setEntries([...entries, newEntry].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Migraine logged');
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      auraType: 'None',
      duration: '',
      triggers: [],
      rescueMedUsed: [],
      severity: 6,
      notes: ''
    });
  };

  const toggleTrigger = (t: string) => {
    setForm({
      ...form,
      triggers: form.triggers.includes(t)
        ? form.triggers.filter(x => x !== t)
        : [...form.triggers, t]
    });
  };

  const toggleMed = (m: string) => {
    setForm({
      ...form,
      rescueMedUsed: form.rescueMedUsed.includes(m)
        ? form.rescueMedUsed.filter(x => x !== m)
        : [...form.rescueMedUsed, m]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          Log Migraine
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-6 rounded-2xl border border-purple-500/50 max-w-2xl w-full my-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-400" />
                Visual Migraine Tracking
              </h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Date</label>
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Aura Type</label>
                <select value={form.auraType}
                  onChange={(e) => setForm({ ...form, auraType: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                >
                  {AURA_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Duration</label>
                <input type="text" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g., 4 hours, 2 days"
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Severity: {form.severity}/10</label>
                <input type="range" min="1" max="10" value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Triggers Identified</label>
                <div className="flex flex-wrap gap-2">
                  {MIGRAINE_TRIGGERS.map(t => (
                    <button key={t} onClick={() => toggleTrigger(t)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        form.triggers.includes(t)
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                          : 'bg-purple-900/30 text-purple-400 hover:bg-purple-500/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Rescue Medication Used</label>
                <div className="flex flex-wrap gap-2">
                  {RESCUE_MEDS.map(m => (
                    <button key={m} onClick={() => toggleMed(m)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        form.rescueMedUsed.includes(m)
                          ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                          : 'bg-purple-900/30 text-purple-400 hover:bg-purple-500/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Notes</label>
                <textarea value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional observations..."
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              <button onClick={addEntry}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                Save Migraine Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No migraine entries recorded</p>
          </div>
        ) : (
          entries.slice(0, 10).map(e => (
            <div key={e.id} className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-bold">{new Date(e.timestamp).toLocaleDateString()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(e.severity)}`}>
                      {e.severity}/10
                    </span>
                  </div>
                  <div className="text-purple-300 text-sm space-y-1">
                    <p><strong>Aura:</strong> {e.auraType}</p>
                    <p><strong>Duration:</strong> {e.duration || 'Not specified'}</p>
                    {e.triggers.length > 0 && <p><strong>Triggers:</strong> {e.triggers.join(', ')}</p>}
                    {e.rescueMedUsed.length > 0 && <p><strong>Meds:</strong> {e.rescueMedUsed.join(', ')}</p>}
                  </div>
                </div>
                <button onClick={() => setEntries(entries.filter(x => x.id !== e.id))} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                  <X className="w-5 h-5 text-red-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===== POTS SECTION =====
interface POTSSectionProps {
  episodes: POTSEpisode[];
  setEpisodes: (data: POTSEpisode[]) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const POTSSection: React.FC<POTSSectionProps> = ({
  episodes, setEpisodes, showForm, setShowForm
}) => {
  const [form, setForm] = useState<Omit<POTSEpisode, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    heartRateIncrease: 30,
    syncope: 'none',
    duration: '',
    triggers: [],
    notes: ''
  });

  const addEpisode = () => {
    const newEp: POTSEpisode = {
      ...form,
      id: `pots_${Date.now()}`,
      timestamp: new Date(form.date).getTime()
    };
    setEpisodes([...episodes, newEp].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('POTS episode logged');
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      heartRateIncrease: 30,
      syncope: 'none',
      duration: '',
      triggers: [],
      notes: ''
    });
  };

  const toggleTrigger = (t: string) => {
    setForm({
      ...form,
      triggers: form.triggers.includes(t) ? form.triggers.filter(x => x !== t) : [...form.triggers, t]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          Log POTS Episode
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-6 rounded-2xl border border-purple-500/50 max-w-2xl w-full my-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                POTS Episode Logging
              </h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Date</label>
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">
                  Heart Rate Increase on Standing: +{form.heartRateIncrease} bpm
                </label>
                <input type="range" min="10" max="80" value={form.heartRateIncrease}
                  onChange={(e) => setForm({ ...form, heartRateIncrease: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>+10 bpm</span>
                  <span className="text-yellow-400">+30 bpm (diagnostic)</span>
                  <span>+80 bpm</span>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Syncope Status</label>
                <div className="flex gap-3">
                  {(['none', 'near-syncope', 'syncope'] as const).map(s => (
                    <button key={s} onClick={() => setForm({ ...form, syncope: s })}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                        form.syncope === s
                          ? s === 'syncope' ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                            : s === 'near-syncope' ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                            : 'bg-green-500/30 text-green-300 border border-green-500/50'
                          : 'bg-purple-900/30 text-purple-400 hover:bg-purple-500/20'
                      }`}
                    >
                      {s === 'none' ? 'None' : s === 'near-syncope' ? 'Near-Syncope' : 'Full Syncope'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Duration</label>
                <input type="text" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g., 10 minutes, 1 hour"
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Triggers</label>
                <div className="flex flex-wrap gap-2">
                  {POTS_TRIGGERS.map(t => (
                    <button key={t} onClick={() => toggleTrigger(t)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        form.triggers.includes(t)
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                          : 'bg-purple-900/30 text-purple-400 hover:bg-purple-500/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Notes</label>
                <textarea value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="What happened before/after..."
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              <button onClick={addEpisode}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                Save POTS Episode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Episodes List */}
      <div className="space-y-4">
        {episodes.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No POTS episodes logged</p>
          </div>
        ) : (
          episodes.slice(0, 10).map(ep => (
            <div key={ep.id} className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-bold">{new Date(ep.timestamp).toLocaleDateString()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      ep.syncope === 'syncope' ? 'bg-red-500/30 text-red-300'
                        : ep.syncope === 'near-syncope' ? 'bg-orange-500/30 text-orange-300'
                        : 'bg-green-500/30 text-green-300'
                    }`}>
                      {ep.syncope === 'none' ? 'No Syncope' : ep.syncope === 'near-syncope' ? 'Near-Syncope' : 'Syncope'}
                    </span>
                  </div>
                  <div className="text-purple-300 text-sm space-y-1">
                    <p><strong>HR Increase:</strong> +{ep.heartRateIncrease} bpm</p>
                    <p><strong>Duration:</strong> {ep.duration || 'Not specified'}</p>
                    {ep.triggers.length > 0 && <p><strong>Triggers:</strong> {ep.triggers.join(', ')}</p>}
                  </div>
                </div>
                <button onClick={() => setEpisodes(episodes.filter(x => x.id !== ep.id))} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                  <X className="w-5 h-5 text-red-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===== TRIGGER CORRELATION SECTION =====
interface TriggerSectionProps {
  data: TriggerCorrelation[];
  setData: (data: TriggerCorrelation[]) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const TriggerSection: React.FC<TriggerSectionProps> = ({
  data, setData, showForm, setShowForm
}) => {
  const [form, setForm] = useState<Omit<TriggerCorrelation, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    weather: 'Clear/Sunny',
    sleepQuality: 5,
    sleepHours: 7,
    hydration: 5,
    foodNotes: '',
    stressLevel: 5,
    menstrualPhase: 'N/A'
  });

  const addEntry = () => {
    const newEntry: TriggerCorrelation = {
      ...form,
      id: `trigger_${Date.now()}`,
      timestamp: new Date(form.date).getTime()
    };
    setData([...data, newEntry].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Trigger data logged');
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      weather: 'Clear/Sunny',
      sleepQuality: 5,
      sleepHours: 7,
      hydration: 5,
      foodNotes: '',
      stressLevel: 5,
      menstrualPhase: 'N/A'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          Log Daily Factors
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-6 rounded-2xl border border-purple-500/50 max-w-2xl w-full my-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Trigger Correlation Analysis
              </h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Date</label>
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold flex items-center gap-2">
                  <Cloud className="w-4 h-4" /> Weather
                </label>
                <select value={form.weather}
                  onChange={(e) => setForm({ ...form, weather: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                >
                  {WEATHER_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Sleep Quality: {form.sleepQuality}/10
                  </label>
                  <input type="range" min="0" max="10" value={form.sleepQuality}
                    onChange={(e) => setForm({ ...form, sleepQuality: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Sleep Hours</label>
                  <input type="number" min="0" max="24" step="0.5" value={form.sleepHours}
                    onChange={(e) => setForm({ ...form, sleepHours: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> Hydration Level: {form.hydration}/10
                </label>
                <input type="range" min="0" max="10" value={form.hydration}
                  onChange={(e) => setForm({ ...form, hydration: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Food/Diet Notes</label>
                <textarea value={form.foodNotes}
                  onChange={(e) => setForm({ ...form, foodNotes: e.target.value })}
                  placeholder="What did you eat? Anything unusual?"
                  rows={2}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold flex items-center gap-2">
                  <ThermometerSun className="w-4 h-4" /> Stress Level: {form.stressLevel}/10
                </label>
                <input type="range" min="0" max="10" value={form.stressLevel}
                  onChange={(e) => setForm({ ...form, stressLevel: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Menstrual Cycle Phase</label>
                <select value={form.menstrualPhase}
                  onChange={(e) => setForm({ ...form, menstrualPhase: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                >
                  {MENSTRUAL_PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <button onClick={addEntry}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                Save Daily Factors
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data List */}
      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No trigger data logged</p>
          </div>
        ) : (
          data.slice(0, 10).map(d => (
            <div key={d.id} className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-white font-bold mb-2">{new Date(d.timestamp).toLocaleDateString()}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div className="bg-blue-900/30 p-2 rounded text-blue-300">
                      <Cloud className="w-4 h-4 inline mr-1" /> {d.weather}
                    </div>
                    <div className="bg-purple-900/30 p-2 rounded text-purple-300">
                      <Moon className="w-4 h-4 inline mr-1" /> Sleep: {d.sleepQuality}/10 ({d.sleepHours}h)
                    </div>
                    <div className="bg-cyan-900/30 p-2 rounded text-cyan-300">
                      <Droplets className="w-4 h-4 inline mr-1" /> Hydration: {d.hydration}/10
                    </div>
                    <div className="bg-orange-900/30 p-2 rounded text-orange-300">
                      <ThermometerSun className="w-4 h-4 inline mr-1" /> Stress: {d.stressLevel}/10
                    </div>
                  </div>
                </div>
                <button onClick={() => setData(data.filter(x => x.id !== d.id))} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg ml-2">
                  <X className="w-5 h-5 text-red-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===== FLARE DAY SECTION =====
interface FlareSectionProps {
  flares: FlareDay[];
  setFlares: (data: FlareDay[]) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const FlareSection: React.FC<FlareSectionProps> = ({
  flares, setFlares, showForm, setShowForm
}) => {
  const [form, setForm] = useState<Omit<FlareDay, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    severity: 'moderate',
    conditions: [],
    notes: ''
  });

  const addFlare = () => {
    const newFlare: FlareDay = {
      ...form,
      id: `flare_${Date.now()}`,
      timestamp: new Date(form.date).getTime()
    };
    setFlares([...flares, newFlare].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Flare day marked');
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      severity: 'moderate',
      conditions: [],
      notes: ''
    });
  };

  const toggleCondition = (c: string) => {
    setForm({
      ...form,
      conditions: form.conditions.includes(c) ? form.conditions.filter(x => x !== c) : [...form.conditions, c]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all"
        >
          <AlertCircle className="w-5 h-5" />
          Mark Flare Day
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-red-900/95 to-orange-900/95 p-6 rounded-2xl border border-red-500/50 max-w-2xl w-full my-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                Mark Flare Day
              </h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-red-200 mb-2 font-semibold">Date</label>
                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-100"
                />
              </div>

              <div>
                <label className="block text-red-200 mb-2 font-semibold">Severity Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['mild', 'moderate', 'severe', 'crisis'] as const).map(s => (
                    <button key={s} onClick={() => setForm({ ...form, severity: s })}
                      className={`py-3 rounded-lg font-semibold transition-all capitalize ${
                        form.severity === s ? getFlareColor(s) : 'bg-red-900/30 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-red-200 mb-2 font-semibold">Conditions Flaring</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {FLARE_CONDITIONS.map(c => (
                    <button key={c} onClick={() => toggleCondition(c)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        form.conditions.includes(c)
                          ? 'bg-red-500/40 text-red-200 border border-red-400/50'
                          : 'bg-red-900/30 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-red-200 mb-2 font-semibold">Notes</label>
                <textarea value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="What's happening? What do you need?"
                  rows={3}
                  className="w-full px-4 py-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-100 placeholder-red-400/50"
                />
              </div>

              <button onClick={addFlare}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-bold text-lg transition-all"
              >
                Save Flare Day
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flares List */}
      <div className="space-y-4">
        {flares.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No flare days marked</p>
          </div>
        ) : (
          flares.slice(0, 10).map(f => (
            <div key={f.id} className={`p-4 rounded-xl border ${getFlareColor(f.severity)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold">{new Date(f.timestamp).toLocaleDateString()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getFlareColor(f.severity)}`}>
                      {f.severity}
                    </span>
                  </div>
                  {f.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {f.conditions.map(c => (
                        <span key={c} className="px-2 py-1 bg-black/30 rounded text-xs">{c}</span>
                      ))}
                    </div>
                  )}
                  {f.notes && <p className="text-sm opacity-80">{f.notes}</p>}
                </div>
                <button onClick={() => setFlares(flares.filter(x => x.id !== f.id))} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ===== TRENDS SECTION =====
interface TrendsSectionProps {
  dailyScans: DailyBodyScan[];
  migraines: MigraineEntry[];
  potsEpisodes: POTSEpisode[];
  triggerData: TriggerCorrelation[];
  flareDays: FlareDay[];
}

const TrendsSection: React.FC<TrendsSectionProps> = ({
  dailyScans, migraines, potsEpisodes, triggerData, flareDays
}) => {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);

  const cutoff = Date.now() - timeRange * 24 * 60 * 60 * 1000;
  const filteredScans = dailyScans.filter(s => s.timestamp >= cutoff);
  const filteredMigraines = migraines.filter(m => m.timestamp >= cutoff);
  const filteredPots = potsEpisodes.filter(p => p.timestamp >= cutoff);
  const filteredFlares = flareDays.filter(f => f.timestamp >= cutoff);

  const avgPain = filteredScans.length > 0
    ? (filteredScans.reduce((sum, s) => sum + s.pain.level, 0) / filteredScans.length).toFixed(1)
    : 'N/A';
  const avgFatigue = filteredScans.length > 0
    ? (filteredScans.reduce((sum, s) => sum + s.fatigue, 0) / filteredScans.length).toFixed(1)
    : 'N/A';
  const avgBrainFog = filteredScans.length > 0
    ? (filteredScans.reduce((sum, s) => sum + s.cognitive.brainFog, 0) / filteredScans.length).toFixed(1)
    : 'N/A';

  // Simple bar chart data
  const chartData = [];
  for (let i = timeRange - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const scan = filteredScans.find(s => s.date === dateStr);
    chartData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pain: scan?.pain.level ?? 0,
      fatigue: scan?.fatigue ?? 0,
      brainFog: scan?.cognitive.brainFog ?? 0
    });
  }

  const maxVal = 10;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {([7, 14, 30] as const).map(d => (
          <button key={d} onClick={() => setTimeRange(d)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              timeRange === d
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-purple-900/30 text-purple-400 hover:bg-purple-500/20'
            }`}
          >
            {d} Days
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30 text-center">
          <div className="text-3xl font-bold text-white">{filteredScans.length}</div>
          <div className="text-purple-300 text-sm">Daily Scans</div>
        </div>
        <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30 text-center">
          <div className="text-3xl font-bold text-white">{filteredMigraines.length}</div>
          <div className="text-purple-300 text-sm">Migraines</div>
        </div>
        <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30 text-center">
          <div className="text-3xl font-bold text-white">{filteredPots.length}</div>
          <div className="text-purple-300 text-sm">POTS Episodes</div>
        </div>
        <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30 text-center">
          <div className="text-3xl font-bold text-red-400">{filteredFlares.length}</div>
          <div className="text-purple-300 text-sm">Flare Days</div>
        </div>
      </div>

      {/* Averages */}
      <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-4">Averages (Last {timeRange} Days)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-purple-300 text-sm mb-1">Avg Pain</div>
            <div className={`text-2xl font-bold ${typeof avgPain === 'string' ? 'text-gray-400' : Number(avgPain) >= 6 ? 'text-red-400' : Number(avgPain) >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
              {avgPain}/10
            </div>
          </div>
          <div>
            <div className="text-purple-300 text-sm mb-1">Avg Fatigue</div>
            <div className={`text-2xl font-bold ${typeof avgFatigue === 'string' ? 'text-gray-400' : Number(avgFatigue) >= 6 ? 'text-red-400' : Number(avgFatigue) >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
              {avgFatigue}/10
            </div>
          </div>
          <div>
            <div className="text-purple-300 text-sm mb-1">Avg Brain Fog</div>
            <div className={`text-2xl font-bold ${typeof avgBrainFog === 'string' ? 'text-gray-400' : Number(avgBrainFog) >= 6 ? 'text-red-400' : Number(avgBrainFog) >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
              {avgBrainFog}/10
            </div>
          </div>
        </div>
      </div>

      {/* Simple CSS Bar Chart */}
      <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-4">Daily Trends</h3>
        <div className="flex items-end gap-1 h-48 overflow-x-auto pb-8">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center min-w-[30px]">
              <div className="flex gap-0.5 items-end h-40">
                <div
                  className="w-2 bg-red-500 rounded-t"
                  style={{ height: `${(d.pain / maxVal) * 100}%` }}
                  title={`Pain: ${d.pain}`}
                />
                <div
                  className="w-2 bg-orange-500 rounded-t"
                  style={{ height: `${(d.fatigue / maxVal) * 100}%` }}
                  title={`Fatigue: ${d.fatigue}`}
                />
                <div
                  className="w-2 bg-purple-500 rounded-t"
                  style={{ height: `${(d.brainFog / maxVal) * 100}%` }}
                  title={`Brain Fog: ${d.brainFog}`}
                />
              </div>
              <div className="text-xs text-purple-400 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                {d.date}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-purple-300 text-sm">Pain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-purple-300 text-sm">Fatigue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span className="text-purple-300 text-sm">Brain Fog</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== EXPORT SECTION =====
interface ExportSectionProps {
  dailyScans: DailyBodyScan[];
  migraines: MigraineEntry[];
  potsEpisodes: POTSEpisode[];
  triggerData: TriggerCorrelation[];
  flareDays: FlareDay[];
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const ExportSection: React.FC<ExportSectionProps> = ({
  dailyScans, migraines, potsEpisodes, triggerData, flareDays, dateRange, setDateRange
}) => {
  const filterByDate = <T extends { timestamp: number }>(data: T[]) => {
    const start = new Date(dateRange.start).getTime();
    const end = new Date(dateRange.end).getTime() + 24 * 60 * 60 * 1000;
    return data.filter(d => d.timestamp >= start && d.timestamp < end);
  };

  const generateReport = () => {
    const scans = filterByDate(dailyScans);
    const migs = filterByDate(migraines);
    const pots = filterByDate(potsEpisodes);
    const triggers = filterByDate(triggerData);
    const flares = filterByDate(flareDays);

    let report = `SYMPTOM & FLARE TRACKING REPORT\n`;
    report += `${'='.repeat(60)}\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Date Range: ${dateRange.start} to ${dateRange.end}\n`;
    report += `\n${'='.repeat(60)}\n\n`;

    // Summary
    report += `SUMMARY\n${'-'.repeat(40)}\n`;
    report += `Daily Body Scans: ${scans.length}\n`;
    report += `Migraine Episodes: ${migs.length}\n`;
    report += `POTS Episodes: ${pots.length}\n`;
    report += `Flare Days: ${flares.length}\n\n`;

    if (scans.length > 0) {
      const avgPain = (scans.reduce((s, d) => s + d.pain.level, 0) / scans.length).toFixed(1);
      const avgFatigue = (scans.reduce((s, d) => s + d.fatigue, 0) / scans.length).toFixed(1);
      report += `Average Pain Level: ${avgPain}/10\n`;
      report += `Average Fatigue Level: ${avgFatigue}/10\n\n`;
    }

    // Daily Scans
    if (scans.length > 0) {
      report += `\nDAILY BODY SCANS\n${'='.repeat(60)}\n`;
      scans.forEach(s => {
        report += `\nDate: ${new Date(s.timestamp).toLocaleDateString()}\n`;
        report += `  Pain: ${s.pain.level}/10 (${s.pain.locations.join(', ') || 'No locations'})\n`;
        report += `  Dizziness: ${s.dizziness}/10\n`;
        report += `  Nausea: ${s.nausea}/10\n`;
        report += `  Fatigue: ${s.fatigue}/10\n`;
        report += `  Brain Fog: ${s.cognitive.brainFog}/10\n`;
        report += `  Dissociation: ${s.cognitive.dissociation ? 'Yes' : 'No'}\n`;
        report += `  Emotional Load: ${s.emotionalLoad}/10\n`;
        if (s.notes) report += `  Notes: ${s.notes}\n`;
      });
    }

    // Migraines
    if (migs.length > 0) {
      report += `\n\nMIGRAINE EPISODES\n${'='.repeat(60)}\n`;
      migs.forEach(m => {
        report += `\nDate: ${new Date(m.timestamp).toLocaleDateString()}\n`;
        report += `  Severity: ${m.severity}/10\n`;
        report += `  Aura Type: ${m.auraType}\n`;
        report += `  Duration: ${m.duration || 'Not specified'}\n`;
        if (m.triggers.length > 0) report += `  Triggers: ${m.triggers.join(', ')}\n`;
        if (m.rescueMedUsed.length > 0) report += `  Rescue Meds: ${m.rescueMedUsed.join(', ')}\n`;
        if (m.notes) report += `  Notes: ${m.notes}\n`;
      });
    }

    // POTS Episodes
    if (pots.length > 0) {
      report += `\n\nPOTS EPISODES\n${'='.repeat(60)}\n`;
      pots.forEach(p => {
        report += `\nDate: ${new Date(p.timestamp).toLocaleDateString()}\n`;
        report += `  Heart Rate Increase: +${p.heartRateIncrease} bpm\n`;
        report += `  Syncope Status: ${p.syncope}\n`;
        report += `  Duration: ${p.duration || 'Not specified'}\n`;
        if (p.triggers.length > 0) report += `  Triggers: ${p.triggers.join(', ')}\n`;
        if (p.notes) report += `  Notes: ${p.notes}\n`;
      });
    }

    // Flare Days
    if (flares.length > 0) {
      report += `\n\nFLARE DAYS\n${'='.repeat(60)}\n`;
      flares.forEach(f => {
        report += `\nDate: ${new Date(f.timestamp).toLocaleDateString()}\n`;
        report += `  Severity: ${f.severity.toUpperCase()}\n`;
        if (f.conditions.length > 0) report += `  Conditions: ${f.conditions.join(', ')}\n`;
        if (f.notes) report += `  Notes: ${f.notes}\n`;
      });
    }

    report += `\n\n${'='.repeat(60)}\n`;
    report += `END OF REPORT\n`;

    return report;
  };

  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptom-report-${dateRange.start}-to-${dateRange.end}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  const printReport = () => {
    const report = generateReport();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Symptom Report</title>
            <style>
              body { font-family: monospace; white-space: pre-wrap; padding: 20px; line-height: 1.5; }
              @media print { body { font-size: 12px; } }
            </style>
          </head>
          <body>${report}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-400" />
          Export Report for Doctors
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-purple-300 mb-2 font-semibold">Start Date</label>
            <input type="date" value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
            />
          </div>
          <div>
            <label className="block text-purple-300 mb-2 font-semibold">End Date</label>
            <input type="date" value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={downloadReport}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all"
          >
            <Download className="w-5 h-5" />
            Download Report (TXT)
          </button>
          <button onClick={printReport}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all"
          >
            <Printer className="w-5 h-5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-black/40 p-4 rounded-xl border border-purple-500/30">
        <h4 className="text-purple-300 font-semibold mb-3">Report Preview</h4>
        <pre className="text-purple-200 text-xs overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
          {generateReport()}
        </pre>
      </div>
    </div>
  );
};

export default SymptomTracker;
