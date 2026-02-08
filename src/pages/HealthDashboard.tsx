/**
 * HEALTH DASHBOARD - Trauma-Informed, Disability-Centered
 * =========================================================
 * A gentle, calm health tracking interface designed with:
 * - Low-stim dark theme (purple/gothic aesthetic)
 * - No guilt language or productivity pressure
 * - Spoon theory integration
 * - POTS/flare awareness
 * - Trauma-informed gentle prompts
 */

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Pill,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Shield,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  Zap,
  Phone,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  Droplets,
  ThermometerSun,
  Brain,
  Eye,
  Loader2
} from 'lucide-react';

import {
  HEALTH_CONDITIONS_REGISTRY,
  SPOON_ACCOUNTING,
  SYMPTOM_TRACKING,
  MEDICATION_SYSTEM,
  EMERGENCY_MODULE,
  CARE_TEAM_COORDINATION,
  IDENTITY_CONTEXT
} from '../data/kol-master-feature-list';

import {
  HEALTH_CONDITIONS,
  COMPLETE_MEDICATIONS,
  EMERGENCY_INFO,
  POTS_EPISODE_PROTOCOL,
  CARE_TEAM,
  getAllActiveMedications
} from '../data/sydney-complete-health-profile';

// Types
interface BodyScan {
  pain: number;
  painLocation: string;
  dizziness: number;
  nausea: number;
  fatigue: number;
  brainFog: number;
  emotionalLoad: number;
  notes: string;
}

interface MedicationCheck {
  id: string;
  name: string;
  taken: boolean;
  time?: string;
}

interface SymptomEntry {
  date: string;
  pain: number;
  dizziness: number;
  fatigue: number;
  spoons: number;
}

// Helper to get current day of week
const getDayOfWeek = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

// Check if it's methotrexate day (Monday)
const isMethotrexateDay = (): boolean => {
  return getDayOfWeek() === 'Monday';
};

// Check if it's folic acid day (not Monday)
const isFolicAcidDay = (): boolean => {
  return getDayOfWeek() !== 'Monday';
};

const HealthDashboard: React.FC = () => {
  // State
  const [currentSpoons, setCurrentSpoons] = useState<number>(8);
  const [bodyScan, setBodyScan] = useState<BodyScan>({
    pain: 4,
    painLocation: '',
    dizziness: 2,
    nausea: 1,
    fatigue: 5,
    brainFog: 3,
    emotionalLoad: 4,
    notes: ''
  });
  const [showEmergencyCard, setShowEmergencyCard] = useState(false);
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  const [medicationChecks, setMedicationChecks] = useState<MedicationCheck[]>([]);
  const [flareAlert, setFlareAlert] = useState<'none' | 'pots' | 'flare' | 'both'>('none');
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomEntry[]>([]);

  // Initialize medications for today
  useEffect(() => {
    const allMeds = getAllActiveMedications();
    const todaysMeds: MedicationCheck[] = [];

    // Add daily medications
    allMeds.forEach((med, idx) => {
      if (med.frequency?.toLowerCase().includes('daily') ||
          med.frequency?.toLowerCase().includes('twice') ||
          med.frequency?.toLowerCase().includes('bid')) {
        todaysMeds.push({
          id: `med-${idx}`,
          name: `${med.name} ${med.strength || ''}`.trim(),
          taken: false
        });
      }
    });

    // Add weekly medications if applicable
    if (isMethotrexateDay()) {
      todaysMeds.push({
        id: 'mtx',
        name: 'Methotrexate 15mg (6 tablets)',
        taken: false
      });
    }

    if (isFolicAcidDay()) {
      todaysMeds.push({
        id: 'folic',
        name: 'Folic Acid 1mg',
        taken: false
      });
    }

    setMedicationChecks(todaysMeds.slice(0, 8)); // Limit to first 8 for display

    // Generate mock recent symptoms for demo
    const mockSymptoms: SymptomEntry[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockSymptoms.push({
        date: date.toISOString().split('T')[0],
        pain: Math.floor(Math.random() * 4) + 3,
        dizziness: Math.floor(Math.random() * 4) + 1,
        fatigue: Math.floor(Math.random() * 4) + 4,
        spoons: Math.floor(Math.random() * 6) + 4
      });
    }
    setRecentSymptoms(mockSymptoms);
  }, []);

  // Check for flare conditions
  useEffect(() => {
    const isPOTSAlert = bodyScan.dizziness >= 6;
    const isFlareAlert = bodyScan.pain >= 7 || bodyScan.fatigue >= 8;

    if (isPOTSAlert && isFlareAlert) {
      setFlareAlert('both');
    } else if (isPOTSAlert) {
      setFlareAlert('pots');
    } else if (isFlareAlert) {
      setFlareAlert('flare');
    } else {
      setFlareAlert('none');
    }
  }, [bodyScan]);

  const toggleMedication = (id: string) => {
    setMedicationChecks(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: !med.taken, time: !med.taken ? new Date().toLocaleTimeString() : undefined } : med
      )
    );
  };

  const getSpoonColor = (spoons: number): string => {
    if (spoons <= 3) return 'text-red-400';
    if (spoons <= 6) return 'text-orange-400';
    if (spoons <= 9) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSpoonBgColor = (spoons: number): string => {
    if (spoons <= 3) return 'bg-red-500/20 border-red-500/30';
    if (spoons <= 6) return 'bg-orange-500/20 border-orange-500/30';
    if (spoons <= 9) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  const getSeverityColor = (value: number): string => {
    if (value <= 3) return 'bg-green-500';
    if (value <= 5) return 'bg-yellow-500';
    if (value <= 7) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get main conditions for status cards
  const mainConditions = HEALTH_CONDITIONS.filter(c =>
    c.name.includes('hEDS') ||
    c.name.includes('POTS') ||
    c.name.includes('Rheumatoid') ||
    c.name.includes('Migraine') ||
    c.name.includes('PTSD') ||
    c.name.includes('ADHD')
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-violet-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Gentle greeting */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-purple-400" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Health Dashboard
            </h1>
          </div>
          <p className="text-purple-300/80 text-lg">
            {getDayOfWeek()} - Take your time. You're doing what you can.
          </p>
        </div>

        {/* POTS/Flare Alert Banner */}
        {flareAlert !== 'none' && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              flareAlert === 'both' ? 'bg-red-900/30 border-red-500/50' :
              flareAlert === 'pots' ? 'bg-orange-900/30 border-orange-500/50' :
              'bg-yellow-900/30 border-yellow-500/50'
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                flareAlert === 'both' ? 'text-red-400' :
                flareAlert === 'pots' ? 'text-orange-400' :
                'text-yellow-400'
              }`} aria-hidden="true" />
              <div>
                <h2 className={`font-semibold ${
                  flareAlert === 'both' ? 'text-red-300' :
                  flareAlert === 'pots' ? 'text-orange-300' :
                  'text-yellow-300'
                }`}>
                  {flareAlert === 'both' ? 'POTS + Flare Day Detected' :
                   flareAlert === 'pots' ? 'POTS Alert - High Dizziness' :
                   'Flare Day - High Symptoms'}
                </h2>
                <p className="text-purple-200/80 text-sm mt-1">
                  {flareAlert === 'pots' || flareAlert === 'both' ?
                    'Remember: Sit or lie down, elevate legs, hydrate with electrolytes. ' : ''}
                  Be extra gentle with yourself today. Rest is not optional.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Body Scan */}
            <section
              className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-6 rounded-xl border border-purple-500/30"
              aria-labelledby="body-scan-title"
            >
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-purple-400" aria-hidden="true" />
                <h2 id="body-scan-title" className="text-xl font-bold text-purple-300">
                  Daily Body Scan
                </h2>
                <span className="text-sm text-purple-400/70 ml-auto">No pressure - just checking in</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pain */}
                <div>
                  <label className="flex items-center justify-between text-purple-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" aria-hidden="true" />
                      Pain Level
                    </span>
                    <span className="text-lg font-bold">{bodyScan.pain}/10</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bodyScan.pain}
                    onChange={(e) => setBodyScan(prev => ({ ...prev, pain: parseInt(e.target.value) }))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-purple-900/50"
                    style={{
                      background: `linear-gradient(to right, ${getSeverityColor(bodyScan.pain)} ${bodyScan.pain * 10}%, rgb(88 28 135 / 0.5) ${bodyScan.pain * 10}%)`
                    }}
                    aria-label="Pain level from 0 to 10"
                  />
                  <div className="flex justify-between text-xs text-purple-400/60 mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                {/* Dizziness */}
                <div>
                  <label className="flex items-center justify-between text-purple-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4" aria-hidden="true" />
                      Dizziness
                    </span>
                    <span className="text-lg font-bold">{bodyScan.dizziness}/10</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bodyScan.dizziness}
                    onChange={(e) => setBodyScan(prev => ({ ...prev, dizziness: parseInt(e.target.value) }))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-purple-900/50"
                    style={{
                      background: `linear-gradient(to right, ${getSeverityColor(bodyScan.dizziness)} ${bodyScan.dizziness * 10}%, rgb(88 28 135 / 0.5) ${bodyScan.dizziness * 10}%)`
                    }}
                    aria-label="Dizziness level from 0 to 10"
                  />
                  <div className="flex justify-between text-xs text-purple-400/60 mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                {/* Nausea */}
                <div>
                  <label className="flex items-center justify-between text-purple-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Cloud className="w-4 h-4" aria-hidden="true" />
                      Nausea
                    </span>
                    <span className="text-lg font-bold">{bodyScan.nausea}/10</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bodyScan.nausea}
                    onChange={(e) => setBodyScan(prev => ({ ...prev, nausea: parseInt(e.target.value) }))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-purple-900/50"
                    style={{
                      background: `linear-gradient(to right, ${getSeverityColor(bodyScan.nausea)} ${bodyScan.nausea * 10}%, rgb(88 28 135 / 0.5) ${bodyScan.nausea * 10}%)`
                    }}
                    aria-label="Nausea level from 0 to 10"
                  />
                  <div className="flex justify-between text-xs text-purple-400/60 mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                {/* Fatigue */}
                <div>
                  <label className="flex items-center justify-between text-purple-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Moon className="w-4 h-4" aria-hidden="true" />
                      Fatigue
                    </span>
                    <span className="text-lg font-bold">{bodyScan.fatigue}/10</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bodyScan.fatigue}
                    onChange={(e) => setBodyScan(prev => ({ ...prev, fatigue: parseInt(e.target.value) }))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-purple-900/50"
                    style={{
                      background: `linear-gradient(to right, ${getSeverityColor(bodyScan.fatigue)} ${bodyScan.fatigue * 10}%, rgb(88 28 135 / 0.5) ${bodyScan.fatigue * 10}%)`
                    }}
                    aria-label="Fatigue level from 0 to 10"
                  />
                  <div className="flex justify-between text-xs text-purple-400/60 mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                {/* Brain Fog */}
                <div>
                  <label className="flex items-center justify-between text-purple-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Brain className="w-4 h-4" aria-hidden="true" />
                      Brain Fog
                    </span>
                    <span className="text-lg font-bold">{bodyScan.brainFog}/10</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bodyScan.brainFog}
                    onChange={(e) => setBodyScan(prev => ({ ...prev, brainFog: parseInt(e.target.value) }))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-purple-900/50"
                    style={{
                      background: `linear-gradient(to right, ${getSeverityColor(bodyScan.brainFog)} ${bodyScan.brainFog * 10}%, rgb(88 28 135 / 0.5) ${bodyScan.brainFog * 10}%)`
                    }}
                    aria-label="Brain fog level from 0 to 10"
                  />
                  <div className="flex justify-between text-xs text-purple-400/60 mt-1">
                    <span>Clear</span>
                    <span>Dense</span>
                  </div>
                </div>

                {/* Emotional Load */}
                <div>
                  <label className="flex items-center justify-between text-purple-200 mb-2">
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4" aria-hidden="true" />
                      Emotional Load
                    </span>
                    <span className="text-lg font-bold">{bodyScan.emotionalLoad}/10</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={bodyScan.emotionalLoad}
                    onChange={(e) => setBodyScan(prev => ({ ...prev, emotionalLoad: parseInt(e.target.value) }))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-purple-900/50"
                    style={{
                      background: `linear-gradient(to right, ${getSeverityColor(bodyScan.emotionalLoad)} ${bodyScan.emotionalLoad * 10}%, rgb(88 28 135 / 0.5) ${bodyScan.emotionalLoad * 10}%)`
                    }}
                    aria-label="Emotional load level from 0 to 10"
                  />
                  <div className="flex justify-between text-xs text-purple-400/60 mt-1">
                    <span>Light</span>
                    <span>Heavy</span>
                  </div>
                </div>
              </div>

              {/* Notes field */}
              <div className="mt-6">
                <label className="text-purple-200 mb-2 block">
                  Anything you want to note? (Optional)
                </label>
                <textarea
                  value={bodyScan.notes}
                  onChange={(e) => setBodyScan(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Pain location, triggers, what helped..."
                  className="w-full p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 resize-none"
                  rows={2}
                />
              </div>
            </section>

            {/* Today's Medications */}
            <section
              className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 p-6 rounded-xl border border-violet-500/30"
              aria-labelledby="medications-title"
            >
              <div className="flex items-center gap-3 mb-4">
                <Pill className="w-6 h-6 text-violet-400" aria-hidden="true" />
                <h2 id="medications-title" className="text-xl font-bold text-violet-300">
                  Today's Medications
                </h2>
                {isMethotrexateDay() && (
                  <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-300">
                    MTX Day - No Folic Acid
                  </span>
                )}
              </div>

              <p className="text-purple-300/70 text-sm mb-4">
                Check off when taken. No judgment if you miss one.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {medicationChecks.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => toggleMedication(med.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      med.taken
                        ? 'bg-green-900/30 border-green-500/50 text-green-300'
                        : 'bg-purple-900/20 border-purple-500/30 text-purple-200 hover:bg-purple-900/40'
                    }`}
                    aria-pressed={med.taken}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                      med.taken ? 'bg-green-500/30' : 'bg-purple-500/20'
                    }`}>
                      {med.taken && <Check className="w-4 h-4 text-green-400" aria-hidden="true" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${med.taken ? 'line-through opacity-70' : ''}`}>
                        {med.name}
                      </p>
                      {med.time && (
                        <p className="text-xs text-green-400/70">Taken at {med.time}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent Symptom Trends */}
            <section
              className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30"
              aria-labelledby="trends-title"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-400" aria-hidden="true" />
                <h2 id="trends-title" className="text-xl font-bold text-indigo-300">
                  Last 7 Days
                </h2>
              </div>

              <div className="space-y-4">
                {/* Pain Trend */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm">Pain</span>
                    <span className="text-purple-400 text-sm">
                      Avg: {(recentSymptoms.reduce((a, b) => a + b.pain, 0) / 7).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {recentSymptoms.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t ${getSeverityColor(entry.pain)}`}
                        style={{ height: `${entry.pain * 10}%` }}
                        title={`${entry.date}: ${entry.pain}/10`}
                        aria-label={`Pain on ${entry.date}: ${entry.pain} out of 10`}
                      />
                    ))}
                  </div>
                </div>

                {/* Fatigue Trend */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm">Fatigue</span>
                    <span className="text-purple-400 text-sm">
                      Avg: {(recentSymptoms.reduce((a, b) => a + b.fatigue, 0) / 7).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {recentSymptoms.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t ${getSeverityColor(entry.fatigue)}`}
                        style={{ height: `${entry.fatigue * 10}%` }}
                        title={`${entry.date}: ${entry.fatigue}/10`}
                        aria-label={`Fatigue on ${entry.date}: ${entry.fatigue} out of 10`}
                      />
                    ))}
                  </div>
                </div>

                {/* Spoons Trend */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 text-sm">Spoons Available</span>
                    <span className="text-purple-400 text-sm">
                      Avg: {(recentSymptoms.reduce((a, b) => a + b.spoons, 0) / 7).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {recentSymptoms.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t ${
                          entry.spoons >= 8 ? 'bg-green-500' :
                          entry.spoons >= 5 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ height: `${(entry.spoons / 12) * 100}%` }}
                        title={`${entry.date}: ${entry.spoons} spoons`}
                        aria-label={`Spoons on ${entry.date}: ${entry.spoons}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Condition Status Cards */}
            <section aria-labelledby="conditions-title">
              <h2 id="conditions-title" className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" aria-hidden="true" />
                Condition Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainConditions.map((condition, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-4 rounded-xl border border-purple-500/30"
                  >
                    <button
                      onClick={() => setExpandedCondition(expandedCondition === condition.name ? null : condition.name)}
                      className="w-full text-left"
                      aria-expanded={expandedCondition === condition.name}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-purple-200">
                            {condition.name.split('(')[0].trim()}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            condition.status === 'Active - Managed' || condition.status === 'Active - Controlled'
                              ? 'bg-green-500/20 text-green-300'
                              : condition.status?.includes('Active')
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {condition.status}
                          </span>
                        </div>
                        {expandedCondition === condition.name ?
                          <ChevronUp className="w-5 h-5 text-purple-400" aria-hidden="true" /> :
                          <ChevronDown className="w-5 h-5 text-purple-400" aria-hidden="true" />
                        }
                      </div>
                    </button>

                    {expandedCondition === condition.name && (
                      <div className="mt-3 pt-3 border-t border-purple-500/20 text-sm text-purple-300/80">
                        {condition.management && (
                          <div>
                            <p className="font-medium text-purple-200 mb-1">Current Management:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {condition.management.slice(0, 4).map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Spoon Counter */}
            <section
              className={`p-6 rounded-xl border ${getSpoonBgColor(currentSpoons)}`}
              aria-labelledby="spoons-title"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className={`w-6 h-6 ${getSpoonColor(currentSpoons)}`} aria-hidden="true" />
                <h2 id="spoons-title" className="text-xl font-bold text-purple-200">
                  Today's Spoons
                </h2>
              </div>

              <div className="text-center mb-4">
                <span className={`text-6xl font-bold ${getSpoonColor(currentSpoons)}`}>
                  {currentSpoons}
                </span>
                <span className="text-2xl text-purple-400/70"> / 12</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all ${
                      i < currentSpoons
                        ? currentSpoons <= 3 ? 'bg-red-400' :
                          currentSpoons <= 6 ? 'bg-orange-400' :
                          currentSpoons <= 9 ? 'bg-yellow-400' :
                          'bg-green-400'
                        : 'bg-purple-900/50'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setCurrentSpoons(Math.max(0, currentSpoons - 1))}
                  className="px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-900/70 transition-colors"
                  aria-label="Use one spoon"
                >
                  Use Spoon
                </button>
                <button
                  onClick={() => setCurrentSpoons(Math.min(12, currentSpoons + 1))}
                  className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors"
                  aria-label="Recover one spoon"
                >
                  + Rest
                </button>
              </div>

              <p className="text-center text-purple-400/60 text-xs mt-4">
                {currentSpoons <= 3 ? "Very low. Prioritize rest and essentials only." :
                 currentSpoons <= 6 ? "Running low. Be gentle with yourself." :
                 currentSpoons <= 9 ? "Moderate energy. Pace yourself." :
                 "Good energy today. Still pace yourself."}
              </p>
            </section>

            {/* Emergency Card Button */}
            <section>
              <button
                onClick={() => setShowEmergencyCard(!showEmergencyCard)}
                className="w-full p-4 bg-red-900/30 border border-red-500/40 rounded-xl hover:bg-red-900/40 transition-colors text-left"
                aria-expanded={showEmergencyCard}
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-red-400" aria-hidden="true" />
                  <div>
                    <h2 className="font-bold text-red-300">Emergency Card</h2>
                    <p className="text-sm text-red-400/70">Tap to view emergency info</p>
                  </div>
                  {showEmergencyCard ?
                    <ChevronUp className="w-5 h-5 text-red-400 ml-auto" aria-hidden="true" /> :
                    <ChevronDown className="w-5 h-5 text-red-400 ml-auto" aria-hidden="true" />
                  }
                </div>
              </button>

              {showEmergencyCard && (
                <div className="mt-3 p-4 bg-red-900/20 border border-red-500/30 rounded-xl space-y-4">
                  <div>
                    <h3 className="font-semibold text-red-300 mb-2">Key Conditions</h3>
                    <p className="text-sm text-purple-200">
                      {EMERGENCY_INFO.conditions.join(', ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-300 mb-2">Allergies</h3>
                    <p className="text-sm text-purple-200">
                      {EMERGENCY_INFO.allergies.join(', ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-300 mb-2">Emergency Contacts</h3>
                    <ul className="space-y-1">
                      {EMERGENCY_INFO.emergencyContacts.map((contact, idx) => (
                        <li key={idx} className="text-sm text-purple-200">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-purple-400"> ({contact.relationship})</span>
                          {contact.phone && <span className="text-purple-300"> - {contact.phone}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-300 mb-2">Critical Notes</h3>
                    <ul className="text-sm text-purple-200 space-y-1">
                      {EMERGENCY_INFO.instructions.slice(0, 4).map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-400">*</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </section>

            {/* Next Appointment */}
            <section
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30"
              aria-labelledby="appointment-title"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-purple-400" aria-hidden="true" />
                <h2 id="appointment-title" className="text-xl font-bold text-purple-300">
                  Next Appointment
                </h2>
              </div>

              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-lg font-semibold text-purple-200">
                  Dr. Amanda Sommerville
                </p>
                <p className="text-purple-400 text-sm">Primary Care - Follow-up</p>
                <div className="flex items-center gap-2 mt-3 text-purple-300">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>Check myUHealth portal for date</span>
                </div>
              </div>

              <p className="text-purple-400/60 text-xs mt-3">
                Remember: You can request accommodations like written instructions or extra time.
              </p>
            </section>

            {/* Care Team Quick Access */}
            <section
              className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 p-6 rounded-xl border border-violet-500/30"
              aria-labelledby="care-team-title"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-violet-400" aria-hidden="true" />
                <h2 id="care-team-title" className="text-xl font-bold text-violet-300">
                  Care Team
                </h2>
              </div>

              <div className="space-y-2">
                {CARE_TEAM.slice(0, 5).map((provider, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20"
                  >
                    <p className="font-medium text-purple-200">{provider.name}</p>
                    <p className="text-sm text-purple-400">{provider.role}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* POTS Protocol Quick Reference */}
            <section
              className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-500/30"
              aria-labelledby="pots-protocol-title"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-400" aria-hidden="true" />
                <h2 id="pots-protocol-title" className="text-lg font-bold text-orange-300">
                  POTS Episode Protocol
                </h2>
              </div>

              <ol className="space-y-2 text-sm text-purple-200">
                {POTS_EPISODE_PROTOCOL.immediateCareProtocol.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">{idx + 1}.</span>
                    {step.replace(/^\d\.\s*/, '')}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-purple-400/60 text-sm">
            You are doing your best. That is always enough.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Custom range slider styling */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid #581c87;
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid #581c87;
        }

        input[type="range"]:focus {
          outline: none;
        }

        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
        }
      `}</style>
    </div>
  );
};

export default HealthDashboard;
