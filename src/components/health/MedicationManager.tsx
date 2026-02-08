import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  Check,
  Clock,
  AlertTriangle,
  AlertCircle,
  Calendar,
  RotateCcw,
  Bell,
  Activity,
  Droplets,
  Brain,
  Heart,
  Stethoscope,
  Wind,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Timer,
  Package,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { COMPLETE_MEDICATIONS, ALLERGIES } from '../../data/sydney-complete-health-profile';

// ===== TYPES =====
interface MedicationEntry {
  id: string;
  name: string;
  genericName?: string;
  strength: string;
  form: string;
  dosage: string;
  frequency: string;
  schedule?: string;
  route: string;
  purpose: string;
  instructions?: string;
  category: string;
  isPRN: boolean;
  isWeekly: boolean;
  weeklyDay?: string;
  times: string[];
  sideEffects?: string[];
  warnings?: string[];
  interactions?: string[];
  maxDaily?: string;
  refillsRemaining?: number;
  lastRefillDate?: Date;
  daysUntilRefill?: number;
}

interface TakenRecord {
  medicationId: string;
  date: string;
  time: string;
  takenAt: string;
  notes?: string;
}

interface SideEffectLog {
  id: string;
  medicationId: string;
  date: string;
  effect: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

interface PRNLog {
  id: string;
  medicationId: string;
  date: string;
  time: string;
  reason: string;
  effectiveness?: 'helped' | 'somewhat' | 'not-helpful';
}

// ===== CATEGORY ICONS =====
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Pain Management': <Activity size={20} />,
    'Autoimmune/Immunosuppressant': <Shield size={20} />,
    'Migraine Treatment': <Brain size={20} />,
    'POTS/Cardiovascular': <Heart size={20} />,
    'Mental Health': <Brain size={20} />,
    'Gastrointestinal': <Droplets size={20} />,
    'Respiratory': <Wind size={20} />,
    'Prevention': <Shield size={20} />,
    'Supplements': <Sparkles size={20} />,
  };
  return iconMap[category] || <Pill size={20} />;
};

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    'Pain Management': '#9b59b6',
    'Autoimmune/Immunosuppressant': '#e74c3c',
    'Migraine Treatment': '#3498db',
    'POTS/Cardiovascular': '#e91e63',
    'Mental Health': '#00bcd4',
    'Gastrointestinal': '#4caf50',
    'Respiratory': '#00acc1',
    'Prevention': '#ff9800',
    'Supplements': '#ffc107',
  };
  return colorMap[category] || '#6c5ce7';
};

// ===== HELPER FUNCTIONS =====
const getDateKey = (date: Date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const getDayOfWeek = (date: Date = new Date()) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const isMonday = (date: Date = new Date()) => {
  return date.getDay() === 1;
};

const parseTimeFromFrequency = (frequency: string, schedule?: string): string[] => {
  const times: string[] = [];

  // Handle specific schedules
  if (schedule) {
    if (schedule.toLowerCase().includes('morning')) times.push('Morning');
    if (schedule.toLowerCase().includes('afternoon') || schedule.toLowerCase().includes('midday')) times.push('Afternoon');
    if (schedule.toLowerCase().includes('evening')) times.push('Evening');
    if (schedule.toLowerCase().includes('bedtime')) times.push('Bedtime');
  }

  // Parse from frequency
  const freq = frequency.toLowerCase();
  if (freq.includes('morning') || freq.includes('every morning')) times.push('Morning');
  if (freq.includes('twice daily') || freq.includes('bid')) {
    if (!times.includes('Morning')) times.push('Morning');
    if (!times.includes('Evening')) times.push('Evening');
  }
  if (freq.includes('3 times daily') || freq.includes('tid')) {
    if (!times.includes('Morning')) times.push('Morning');
    if (!times.includes('Afternoon')) times.push('Afternoon');
    if (!times.includes('Evening')) times.push('Evening');
  }
  if (freq.includes('bedtime') || freq.includes('at night')) times.push('Bedtime');
  if (freq.includes('daily') && times.length === 0) times.push('Morning');
  if (freq.includes('as needed') || freq.includes('prn')) times.push('As Needed');

  return times.length > 0 ? times : ['Morning'];
};

const isPRNMedication = (frequency: string): boolean => {
  const freq = frequency.toLowerCase();
  return freq.includes('as needed') || freq.includes('prn');
};

const isWeeklyMedication = (frequency: string): boolean => {
  const freq = frequency.toLowerCase();
  return freq.includes('weekly') || freq.includes('once weekly') || freq.includes('every 4 weeks');
};

const getWeeklyDay = (frequency: string): string | undefined => {
  const freq = frequency.toLowerCase();
  if (freq.includes('monday')) return 'Monday';
  if (freq.includes('tuesday')) return 'Tuesday';
  if (freq.includes('wednesday')) return 'Wednesday';
  if (freq.includes('thursday')) return 'Thursday';
  if (freq.includes('friday')) return 'Friday';
  if (freq.includes('saturday')) return 'Saturday';
  if (freq.includes('sunday')) return 'Sunday';
  return undefined;
};

// ===== PROCESS MEDICATIONS =====
const processMedications = (): MedicationEntry[] => {
  const processed: MedicationEntry[] = [];

  COMPLETE_MEDICATIONS.forEach(category => {
    category.medications.forEach(med => {
      const isPRN = isPRNMedication(med.frequency);
      const isWeekly = isWeeklyMedication(med.frequency);

      processed.push({
        id: `${category.category}-${med.name}`.replace(/\s+/g, '-').toLowerCase(),
        name: med.name,
        genericName: med.genericName,
        strength: med.strength,
        form: med.form,
        dosage: med.dosage,
        frequency: med.frequency,
        schedule: med.schedule,
        route: med.route,
        purpose: med.purpose,
        instructions: med.instructions,
        category: category.category,
        isPRN,
        isWeekly,
        weeklyDay: getWeeklyDay(med.frequency),
        times: parseTimeFromFrequency(med.frequency, med.schedule),
        sideEffects: med.sideEffects,
        warnings: med.warnings,
        interactions: med.interactions,
        maxDaily: med.maxDaily,
        refillsRemaining: med.refillsRemaining,
      });
    });
  });

  return processed;
};

// ===== STORAGE HELPERS =====
const STORAGE_KEYS = {
  TAKEN_RECORDS: 'kol-medication-taken-records',
  SIDE_EFFECTS: 'kol-medication-side-effects',
  PRN_LOG: 'kol-medication-prn-log',
  REFILL_ALERTS: 'kol-medication-refill-alerts',
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// ===== MAIN COMPONENT =====
const MedicationManager: React.FC = () => {
  // State
  const [medications] = useState<MedicationEntry[]>(processMedications());
  const [takenRecords, setTakenRecords] = useState<TakenRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.TAKEN_RECORDS, [])
  );
  const [sideEffects, setSideEffects] = useState<SideEffectLog[]>(() =>
    loadFromStorage(STORAGE_KEYS.SIDE_EFFECTS, [])
  );
  const [prnLog, setPRNLog] = useState<PRNLog[]>(() =>
    loadFromStorage(STORAGE_KEYS.PRN_LOG, [])
  );

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'prn' | 'all' | 'refills' | 'side-effects'>('daily');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Pain Management']));
  const [selectedMed, setSelectedMed] = useState<MedicationEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUndoToast, setShowUndoToast] = useState<{ medId: string; time: string } | null>(null);
  const [showPRNModal, setShowPRNModal] = useState<MedicationEntry | null>(null);
  const [showSideEffectModal, setShowSideEffectModal] = useState<MedicationEntry | null>(null);
  const [prnReason, setPRNReason] = useState('');
  const [sideEffectInput, setSideEffectInput] = useState('');
  const [sideEffectSeverity, setSideEffectSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');

  const today = new Date();
  const dateKey = getDateKey(today);
  const dayOfWeek = getDayOfWeek(today);
  const isMondayToday = isMonday(today);

  // Persist state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TAKEN_RECORDS, takenRecords);
  }, [takenRecords]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SIDE_EFFECTS, sideEffects);
  }, [sideEffects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRN_LOG, prnLog);
  }, [prnLog]);

  // Get today's scheduled medications (excluding weekly meds on wrong days)
  const todaysMedications = useMemo(() => {
    return medications.filter(med => {
      if (med.isPRN) return false;
      if (med.isWeekly) {
        if (med.weeklyDay) return med.weeklyDay === dayOfWeek;
        // Default weekly meds to Monday if no day specified
        return isMondayToday;
      }
      return true;
    });
  }, [medications, dayOfWeek, isMondayToday]);

  // Check if medication is taken
  const isMedicationTaken = useCallback((medId: string, time: string): boolean => {
    return takenRecords.some(
      record => record.medicationId === medId &&
                record.date === dateKey &&
                record.time === time
    );
  }, [takenRecords, dateKey]);

  // Toggle medication taken status
  const toggleMedicationTaken = useCallback((med: MedicationEntry, time: string) => {
    const wasTaken = isMedicationTaken(med.id, time);

    if (wasTaken) {
      // Undo - remove record
      setTakenRecords(prev => prev.filter(
        record => !(record.medicationId === med.id && record.date === dateKey && record.time === time)
      ));
    } else {
      // Mark as taken
      const newRecord: TakenRecord = {
        medicationId: med.id,
        date: dateKey,
        time,
        takenAt: new Date().toISOString(),
      };
      setTakenRecords(prev => [...prev, newRecord]);
      setShowUndoToast({ medId: med.id, time });
      setTimeout(() => setShowUndoToast(null), 5000);
    }
  }, [isMedicationTaken, dateKey]);

  // Log PRN medication
  const logPRNMedication = useCallback(() => {
    if (!showPRNModal || !prnReason.trim()) return;

    const newLog: PRNLog = {
      id: `prn-${Date.now()}`,
      medicationId: showPRNModal.id,
      date: dateKey,
      time: new Date().toLocaleTimeString(),
      reason: prnReason.trim(),
    };

    setPRNLog(prev => [...prev, newLog]);
    setShowPRNModal(null);
    setPRNReason('');
  }, [showPRNModal, prnReason, dateKey]);

  // Log side effect
  const logSideEffect = useCallback(() => {
    if (!showSideEffectModal || !sideEffectInput.trim()) return;

    const newLog: SideEffectLog = {
      id: `se-${Date.now()}`,
      medicationId: showSideEffectModal.id,
      date: dateKey,
      effect: sideEffectInput.trim(),
      severity: sideEffectSeverity,
    };

    setSideEffects(prev => [...prev, newLog]);
    setShowSideEffectModal(null);
    setSideEffectInput('');
    setSideEffectSeverity('mild');
  }, [showSideEffectModal, sideEffectInput, sideEffectSeverity, dateKey]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Calculate stats
  const stats = useMemo(() => {
    const todayTakenCount = takenRecords.filter(r => r.date === dateKey).length;
    const todayTotalDoses = todaysMedications.reduce((acc, med) => acc + med.times.filter(t => t !== 'As Needed').length, 0);
    const completionRate = todayTotalDoses > 0 ? Math.round((todayTakenCount / todayTotalDoses) * 100) : 0;

    return {
      todayTakenCount,
      todayTotalDoses,
      completionRate,
      prnUsedToday: prnLog.filter(p => p.date === dateKey).length,
      sideEffectsReported: sideEffects.filter(s => s.date === dateKey).length,
    };
  }, [takenRecords, todaysMedications, dateKey, prnLog, sideEffects]);

  // Check for contraindications (Methotrexate + Folic Acid)
  const contraindications = useMemo(() => {
    const warnings: string[] = [];

    if (isMondayToday) {
      // Check if folic acid is marked as taken on MTX day
      const folicAcidTaken = takenRecords.some(
        r => r.date === dateKey && r.medicationId.includes('folic-acid')
      );
      if (folicAcidTaken) {
        warnings.push('Folic Acid should not be taken on Methotrexate day (Monday)');
      }
    }

    return warnings;
  }, [isMondayToday, takenRecords, dateKey]);

  // Group medications by time
  const medicationsByTime = useMemo(() => {
    const groups: Record<string, MedicationEntry[]> = {
      'Morning': [],
      'Afternoon': [],
      'Evening': [],
      'Bedtime': [],
    };

    todaysMedications.forEach(med => {
      med.times.forEach(time => {
        if (groups[time]) {
          if (!groups[time].some(m => m.id === med.id)) {
            groups[time].push(med);
          }
        }
      });
    });

    return groups;
  }, [todaysMedications]);

  // Filter medications by search
  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) return medications;
    const query = searchQuery.toLowerCase();
    return medications.filter(med =>
      med.name.toLowerCase().includes(query) ||
      med.genericName?.toLowerCase().includes(query) ||
      med.purpose.toLowerCase().includes(query) ||
      med.category.toLowerCase().includes(query)
    );
  }, [medications, searchQuery]);

  // Group all medications by category
  const medicationsByCategory = useMemo(() => {
    const groups: Record<string, MedicationEntry[]> = {};
    filteredMedications.forEach(med => {
      if (!groups[med.category]) {
        groups[med.category] = [];
      }
      groups[med.category].push(med);
    });
    return groups;
  }, [filteredMedications]);

  // Get PRN medications
  const prnMedications = useMemo(() => {
    return medications.filter(med => med.isPRN);
  }, [medications]);

  // Get weekly medications
  const weeklyMedications = useMemo(() => {
    return medications.filter(med => med.isWeekly);
  }, [medications]);

  // ===== RENDER HELPERS =====

  const renderTimeGroup = (time: string, meds: MedicationEntry[]) => {
    if (meds.length === 0) return null;

    const allTaken = meds.every(med => isMedicationTaken(med.id, time));
    const someTaken = meds.some(med => isMedicationTaken(med.id, time));

    return (
      <motion.div
        key={time}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: allTaken ? 'rgba(72, 187, 120, 0.2)' : 'rgba(139, 92, 246, 0.2)',
              border: `2px solid ${allTaken ? '#48bb78' : '#8b5cf6'}`
            }}
          >
            {allTaken ? <CheckCircle2 size={20} color="#48bb78" /> : <Clock size={20} color="#8b5cf6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-100">{time}</h3>
            <p className="text-sm text-purple-300/70">
              {meds.filter(m => isMedicationTaken(m.id, time)).length} of {meds.length} taken
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {meds.map(med => renderMedicationCard(med, time))}
        </div>
      </motion.div>
    );
  };

  const renderMedicationCard = (med: MedicationEntry, time: string) => {
    const taken = isMedicationTaken(med.id, time);
    const categoryColor = getCategoryColor(med.category);

    // Special handling for folic acid on Monday
    const isFolicAcidOnMonday = med.name.toLowerCase().includes('folic acid') && isMondayToday;

    return (
      <motion.div
        key={`${med.id}-${time}`}
        layout
        whileHover={{ scale: 1.01 }}
        className={`relative rounded-xl p-4 transition-all duration-300 ${
          isFolicAcidOnMonday
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        }`}
        style={{
          background: taken
            ? 'rgba(72, 187, 120, 0.15)'
            : 'rgba(139, 92, 246, 0.08)',
          border: `1px solid ${taken ? 'rgba(72, 187, 120, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
        }}
        onClick={() => !isFolicAcidOnMonday && toggleMedicationTaken(med, time)}
      >
        {/* Skip indicator for folic acid on Monday */}
        {isFolicAcidOnMonday && (
          <div className="absolute top-2 right-2 bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle size={12} />
            Skip today (MTX day)
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <motion.div
            animate={{ scale: taken ? [1, 1.2, 1] : 1 }}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
              isFolicAcidOnMonday
                ? 'border-gray-500 bg-gray-700/50'
                : taken
                  ? 'border-green-400 bg-green-500'
                  : 'border-purple-400 bg-transparent'
            }`}
          >
            {taken && <Check size={16} color="white" strokeWidth={3} />}
            {isFolicAcidOnMonday && <XCircle size={16} color="#9ca3af" />}
          </motion.div>

          {/* Medication Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className={`font-semibold ${taken ? 'text-green-300' : 'text-purple-100'}`}>
                  {med.name}
                </h4>
                {med.genericName && (
                  <p className="text-sm text-purple-300/60 italic">{med.genericName}</p>
                )}
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                style={{
                  background: `${categoryColor}20`,
                  color: categoryColor,
                }}
              >
                {med.category.split('/')[0]}
              </span>
            </div>

            <p className="text-sm text-purple-200/80 mt-1">
              {med.dosage} {med.strength} - {med.route}
            </p>

            <p className="text-xs text-purple-300/60 mt-1">
              {med.purpose}
            </p>

            {/* Quick actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMed(med);
                }}
                className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center gap-1"
              >
                <Info size={12} />
                Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSideEffectModal(med);
                }}
                className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
              >
                <AlertCircle size={12} />
                Log Effect
              </button>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {med.warnings && med.warnings.length > 0 && (
          <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-300 flex items-start gap-1">
              <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
              {med.warnings[0]}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderPRNCard = (med: MedicationEntry) => {
    const todayUsage = prnLog.filter(p => p.medicationId === med.id && p.date === dateKey);
    const categoryColor = getCategoryColor(med.category);

    return (
      <motion.div
        key={med.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4"
        style={{
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${categoryColor}20` }}
          >
            {getCategoryIcon(med.category)}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-purple-100">{med.name}</h4>
                <p className="text-sm text-purple-300/70">{med.strength} - {med.form}</p>
              </div>
              {todayUsage.length > 0 && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                  Used {todayUsage.length}x today
                </span>
              )}
            </div>

            <p className="text-sm text-purple-200/80 mt-2">{med.purpose}</p>

            {med.maxDaily && (
              <p className="text-xs text-amber-300 mt-1">
                Max daily: {med.maxDaily}
              </p>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowPRNModal(med)}
                className="flex-1 py-2 rounded-lg bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Log Use
              </button>
              <button
                onClick={() => setSelectedMed(med)}
                className="px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
              >
                <Info size={16} />
              </button>
            </div>

            {/* Recent usage */}
            {todayUsage.length > 0 && (
              <div className="mt-3 space-y-1">
                {todayUsage.map(use => (
                  <div key={use.id} className="text-xs text-purple-300/60 flex items-center gap-2">
                    <Timer size={12} />
                    {use.time} - {use.reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderWeeklyCard = (med: MedicationEntry) => {
    const isToday = med.weeklyDay === dayOfWeek || (!med.weeklyDay && isMondayToday);
    const taken = isToday && isMedicationTaken(med.id, 'Weekly');
    const categoryColor = getCategoryColor(med.category);

    return (
      <motion.div
        key={med.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 ${isToday ? 'ring-2 ring-purple-500' : ''}`}
        style={{
          background: taken
            ? 'rgba(72, 187, 120, 0.15)'
            : isToday
              ? 'rgba(139, 92, 246, 0.15)'
              : 'rgba(139, 92, 246, 0.08)',
          border: `1px solid ${taken ? 'rgba(72, 187, 120, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${categoryColor}20` }}
          >
            <Calendar size={20} color={categoryColor} />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-purple-100">{med.name}</h4>
                <p className="text-sm text-purple-300/70">{med.strength} - {med.frequency}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isToday
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                {med.weeklyDay || 'Monday'}
                {isToday && ' (Today)'}
              </span>
            </div>

            <p className="text-sm text-purple-200/80 mt-2">{med.purpose}</p>

            {isToday && (
              <button
                onClick={() => toggleMedicationTaken(med, 'Weekly')}
                className={`mt-3 w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  taken
                    ? 'bg-green-500/30 text-green-300'
                    : 'bg-purple-600/30 text-purple-200 hover:bg-purple-600/50'
                }`}
              >
                {taken ? <CheckCircle2 size={16} /> : <Check size={16} />}
                {taken ? 'Taken' : 'Mark as Taken'}
              </button>
            )}

            {/* Special instructions for Methotrexate */}
            {med.name.toLowerCase().includes('methotrexate') && (
              <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-300">
                  <strong>REMINDER:</strong> No folic acid today. Take on empty stomach. Report any infection signs.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCategorySection = (category: string, meds: MedicationEntry[]) => {
    const isExpanded = expandedCategories.has(category);
    const categoryColor = getCategoryColor(category);

    return (
      <div key={category} className="mb-4">
        <button
          onClick={() => toggleCategory(category)}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-500/10 transition-colors"
          style={{ background: isExpanded ? 'rgba(139, 92, 246, 0.1)' : 'transparent' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `${categoryColor}20`, color: categoryColor }}
            >
              {getCategoryIcon(category)}
            </div>
            <span className="font-semibold text-purple-100">{category}</span>
            <span className="text-sm text-purple-300/60">({meds.length})</span>
          </div>
          {isExpanded ? <ChevronUp size={20} color="#a78bfa" /> : <ChevronDown size={20} color="#a78bfa" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-3 pl-11">
                {meds.map(med => (
                  <div
                    key={med.id}
                    className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/20 cursor-pointer hover:bg-purple-900/30 transition-colors"
                    onClick={() => setSelectedMed(med)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-purple-100">{med.name}</h4>
                        {med.genericName && (
                          <p className="text-xs text-purple-300/60 italic">{med.genericName}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {med.isPRN && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">PRN</span>
                        )}
                        {med.isWeekly && (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Weekly</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-purple-200/70 mt-1">
                      {med.dosage} {med.strength} - {med.frequency}
                    </p>
                    <p className="text-xs text-purple-300/50 mt-1">{med.purpose}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #1a1025 0%, #2d1f3d 50%, #1a1025 100%)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(139, 92, 246, 0.2)', border: '2px solid #8b5cf6' }}
          >
            <Pill size={32} color="#8b5cf6" />
          </div>
        </div>
        <h1 className="text-3xl font-light text-purple-100 mb-2" style={{ fontFamily: 'serif' }}>
          Medication Manager
        </h1>
        <p className="text-purple-300/70">
          {dayOfWeek}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Contraindication Warnings */}
      <AnimatePresence>
        {contraindications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            {contraindications.map((warning, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 flex items-start gap-3 mb-2"
              >
                <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-medium">Contraindication Warning</p>
                  <p className="text-red-200/80 text-sm">{warning}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20 text-center">
          <p className="text-3xl font-bold text-purple-100">
            {stats.todayTakenCount}/{stats.todayTotalDoses}
          </p>
          <p className="text-sm text-purple-300/70">Doses Today</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20 text-center">
          <p className="text-3xl font-bold text-green-400">{stats.completionRate}%</p>
          <p className="text-sm text-purple-300/70">Completion</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20 text-center">
          <p className="text-3xl font-bold text-amber-400">{stats.prnUsedToday}</p>
          <p className="text-sm text-purple-300/70">PRN Used</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20 text-center">
          <p className="text-3xl font-bold text-blue-400">{medications.length}</p>
          <p className="text-sm text-purple-300/70">Total Meds</p>
        </div>
      </motion.div>

      {/* Gentle reminder if not all taken */}
      {stats.completionRate < 100 && stats.todayTotalDoses > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
        >
          <p className="text-purple-200 text-sm text-center">
            You're doing great! Take your time with today's medications.
            <br />
            <span className="text-purple-300/60">No pressure - your health journey is your own.</span>
          </p>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'daily', label: 'Daily Schedule', icon: <Clock size={16} /> },
          { id: 'weekly', label: 'Weekly', icon: <Calendar size={16} /> },
          { id: 'prn', label: 'As Needed', icon: <Timer size={16} /> },
          { id: 'all', label: 'All Meds', icon: <Pill size={16} /> },
          { id: 'refills', label: 'Refills', icon: <Package size={16} /> },
          { id: 'side-effects', label: 'Side Effects', icon: <AlertCircle size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search (for All Meds tab) */}
      {activeTab === 'all' && (
        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="min-h-[400px]">
        {/* Daily Schedule Tab */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            {Object.entries(medicationsByTime).map(([time, meds]) => renderTimeGroup(time, meds))}

            {/* Monday special - MTX reminder */}
            {isMondayToday && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-300 font-medium">Methotrexate Monday</p>
                    <p className="text-red-200/70 text-sm">
                      Remember: Take on empty stomach. Skip folic acid today. Stay hydrated. Report any infection symptoms immediately.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Weekly Tab */}
        {activeTab === 'weekly' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-purple-100 mb-2">Weekly Medications</h2>
              <p className="text-purple-300/70 text-sm">
                Medications taken once a week or monthly
              </p>
            </div>
            {weeklyMedications.map(med => renderWeeklyCard(med))}
          </div>
        )}

        {/* PRN Tab */}
        {activeTab === 'prn' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-purple-100 mb-2">As-Needed Medications</h2>
              <p className="text-purple-300/70 text-sm">
                Take these only when needed. Log each use to track patterns.
              </p>
            </div>
            {prnMedications.map(med => renderPRNCard(med))}
          </div>
        )}

        {/* All Meds Tab */}
        {activeTab === 'all' && (
          <div>
            {Object.entries(medicationsByCategory).map(([category, meds]) =>
              renderCategorySection(category, meds)
            )}
          </div>
        )}

        {/* Refills Tab */}
        {activeTab === 'refills' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-purple-100 mb-2">Refill Tracker</h2>
              <p className="text-purple-300/70 text-sm">
                Keep track of medication refills to never run out
              </p>
            </div>

            {medications.filter(m => m.refillsRemaining !== undefined).map(med => (
              <div
                key={med.id}
                className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-purple-100">{med.name}</h4>
                    <p className="text-sm text-purple-300/70">{med.strength}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      (med.refillsRemaining || 0) <= 1 ? 'text-red-400' :
                      (med.refillsRemaining || 0) <= 3 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {med.refillsRemaining} refills
                    </span>
                    {(med.refillsRemaining || 0) <= 1 && (
                      <p className="text-xs text-red-300">Refill soon!</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mt-6">
              <p className="text-purple-200 text-sm text-center">
                Refill tracking is based on prescription data.
                <br />
                <span className="text-purple-300/60">Update counts after each pharmacy visit.</span>
              </p>
            </div>
          </div>
        )}

        {/* Side Effects Tab */}
        {activeTab === 'side-effects' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-purple-100 mb-2">Side Effect Log</h2>
              <p className="text-purple-300/70 text-sm">
                Track side effects to discuss with your care team
              </p>
            </div>

            {sideEffects.length === 0 ? (
              <div className="p-8 rounded-xl bg-purple-900/20 border border-purple-500/20 text-center">
                <AlertCircle size={48} className="mx-auto text-purple-400 mb-4" />
                <p className="text-purple-200">No side effects logged yet</p>
                <p className="text-purple-300/60 text-sm mt-2">
                  Click "Log Effect" on any medication to record a side effect
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sideEffects.slice().reverse().map(effect => {
                  const med = medications.find(m => m.id === effect.medicationId);
                  return (
                    <div
                      key={effect.id}
                      className={`p-4 rounded-xl border ${
                        effect.severity === 'severe'
                          ? 'bg-red-500/10 border-red-500/30'
                          : effect.severity === 'moderate'
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-purple-500/10 border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-purple-100">{med?.name || 'Unknown'}</p>
                          <p className="text-sm text-purple-200/80 mt-1">{effect.effect}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            effect.severity === 'severe'
                              ? 'bg-red-500/30 text-red-300'
                              : effect.severity === 'moderate'
                                ? 'bg-amber-500/30 text-amber-300'
                                : 'bg-purple-500/30 text-purple-300'
                          }`}>
                            {effect.severity}
                          </span>
                          <p className="text-xs text-purple-300/60 mt-2">{effect.date}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Undo Toast */}
      <AnimatePresence>
        {showUndoToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-600 text-white shadow-lg">
              <CheckCircle2 size={20} />
              <span>Medication marked as taken</span>
              <button
                onClick={() => {
                  const med = medications.find(m => m.id === showUndoToast.medId);
                  if (med) {
                    toggleMedicationTaken(med, showUndoToast.time);
                  }
                  setShowUndoToast(null);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
              >
                <RotateCcw size={14} />
                Undo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medication Detail Modal */}
      <AnimatePresence>
        {selectedMed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMed(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-950 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-purple-100">{selectedMed.name}</h2>
                    {selectedMed.genericName && (
                      <p className="text-purple-300/60 italic">{selectedMed.genericName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedMed(null)}
                    className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
                  >
                    <XCircle size={24} color="#a78bfa" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-purple-900/30">
                      <p className="text-xs text-purple-300/60 mb-1">Strength</p>
                      <p className="text-purple-100">{selectedMed.strength}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-900/30">
                      <p className="text-xs text-purple-300/60 mb-1">Form</p>
                      <p className="text-purple-100">{selectedMed.form}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-900/30">
                      <p className="text-xs text-purple-300/60 mb-1">Dosage</p>
                      <p className="text-purple-100">{selectedMed.dosage}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-900/30">
                      <p className="text-xs text-purple-300/60 mb-1">Route</p>
                      <p className="text-purple-100">{selectedMed.route}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-900/30">
                    <p className="text-xs text-purple-300/60 mb-1">Frequency</p>
                    <p className="text-purple-100">{selectedMed.frequency}</p>
                    {selectedMed.schedule && (
                      <p className="text-sm text-purple-300/70 mt-1">{selectedMed.schedule}</p>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-purple-900/30">
                    <p className="text-xs text-purple-300/60 mb-1">Purpose</p>
                    <p className="text-purple-100">{selectedMed.purpose}</p>
                  </div>

                  {selectedMed.instructions && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-xs text-blue-300 mb-1">Instructions</p>
                      <p className="text-blue-100">{selectedMed.instructions}</p>
                    </div>
                  )}

                  {selectedMed.sideEffects && selectedMed.sideEffects.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs text-amber-300 mb-2">Possible Side Effects</p>
                      <ul className="space-y-1">
                        {selectedMed.sideEffects.map((effect, idx) => (
                          <li key={idx} className="text-sm text-amber-100/80 flex items-start gap-2">
                            <span className="text-amber-400 mt-1">-</span>
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMed.warnings && selectedMed.warnings.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-xs text-red-300 mb-2 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Warnings
                      </p>
                      <ul className="space-y-1">
                        {selectedMed.warnings.map((warning, idx) => (
                          <li key={idx} className="text-sm text-red-100/80 flex items-start gap-2">
                            <span className="text-red-400 mt-1">!</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMed.interactions && selectedMed.interactions.length > 0 && (
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <p className="text-xs text-orange-300 mb-2">Drug Interactions</p>
                      <ul className="space-y-1">
                        {selectedMed.interactions.map((interaction, idx) => (
                          <li key={idx} className="text-sm text-orange-100/80 flex items-start gap-2">
                            <span className="text-orange-400 mt-1">-</span>
                            {interaction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMed.maxDaily && (
                    <div className="p-3 rounded-lg bg-purple-900/30">
                      <p className="text-xs text-purple-300/60 mb-1">Maximum Daily Dose</p>
                      <p className="text-purple-100">{selectedMed.maxDaily}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowSideEffectModal(selectedMed);
                      setSelectedMed(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={18} />
                    Log Side Effect
                  </button>
                  <button
                    onClick={() => setSelectedMed(null)}
                    className="flex-1 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRN Log Modal */}
      <AnimatePresence>
        {showPRNModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPRNModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-950 rounded-2xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-purple-100 mb-2">
                Log {showPRNModal.name}
              </h3>
              <p className="text-purple-300/70 text-sm mb-4">
                {showPRNModal.dosage} {showPRNModal.strength}
              </p>

              <div className="mb-4">
                <label className="block text-sm text-purple-300 mb-2">
                  Why are you taking this?
                </label>
                <textarea
                  value={prnReason}
                  onChange={(e) => setPRNReason(e.target.value)}
                  placeholder="e.g., Muscle pain in lower back, Migraine starting..."
                  className="w-full p-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 resize-none"
                  rows={3}
                />
              </div>

              {showPRNModal.maxDaily && (
                <p className="text-sm text-amber-300 mb-4">
                  Remember: Max {showPRNModal.maxDaily} per day
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPRNModal(null);
                    setPRNReason('');
                  }}
                  className="flex-1 py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logPRNMedication}
                  disabled={!prnReason.trim()}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Log Dose
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Effect Log Modal */}
      <AnimatePresence>
        {showSideEffectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSideEffectModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-950 rounded-2xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-purple-100 mb-2">
                Log Side Effect
              </h3>
              <p className="text-purple-300/70 text-sm mb-4">
                For: {showSideEffectModal.name}
              </p>

              <div className="mb-4">
                <label className="block text-sm text-purple-300 mb-2">
                  What are you experiencing?
                </label>
                <textarea
                  value={sideEffectInput}
                  onChange={(e) => setSideEffectInput(e.target.value)}
                  placeholder="Describe the side effect..."
                  className="w-full p-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-purple-300 mb-2">
                  Severity
                </label>
                <div className="flex gap-2">
                  {(['mild', 'moderate', 'severe'] as const).map(severity => (
                    <button
                      key={severity}
                      onClick={() => setSideEffectSeverity(severity)}
                      className={`flex-1 py-2 rounded-lg capitalize transition-colors ${
                        sideEffectSeverity === severity
                          ? severity === 'severe'
                            ? 'bg-red-500 text-white'
                            : severity === 'moderate'
                              ? 'bg-amber-500 text-white'
                              : 'bg-purple-500 text-white'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSideEffectModal(null);
                    setSideEffectInput('');
                    setSideEffectSeverity('mild');
                  }}
                  className="flex-1 py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logSideEffect}
                  disabled={!sideEffectInput.trim()}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allergy Reminder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-medium mb-2">Allergy Reminders</p>
            <div className="flex flex-wrap gap-2">
              {ALLERGIES.map((allergy, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-200"
                >
                  {allergy.allergen} ({allergy.severity})
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
      >
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-purple-300/70">
            <strong className="text-purple-200">Privacy:</strong> All medication tracking data is stored locally on your device.
            Nothing is uploaded to any server. Your health information stays with you.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MedicationManager;
