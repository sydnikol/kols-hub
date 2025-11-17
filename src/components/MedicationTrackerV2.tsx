import React, { useState, useEffect } from 'react';
import medicationsData from '../data/medications-current.json';

interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  route: string;
  indication: string;
  category: string;
  notes: string;
  active: boolean;
  timing: string;
  requires_meal: boolean;
  date_started?: string;
  ordered_by?: string;
  warning?: string;
}

interface MedicationLog {
  medicationId: string;
  timestamp: Date;
  taken: boolean;
  notes?: string;
}

const MedicationTrackerV2: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>('all');
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [expandedMed, setExpandedMed] = useState<string | null>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Determine current time period
  const getCurrentTimePeriod = (): string => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 15) return 'midday';
    if (hour >= 15 && hour < 18) return 'late_afternoon';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'bedtime';
  };

  // Check if today is Monday (MTX day)
  const isMTXDay = (): boolean => {
    return currentTime.getDay() === 1; // Monday = 1
  };

  // Get medications for specific time period
  const getMedicationsForTime = (timePeriod: string) => {
    const schedule = medicationsData.daily_medication_schedule;
    return schedule[timePeriod as keyof typeof schedule] || [];
  };

  // Log medication taken
  const logMedication = (medId: string, taken: boolean) => {
    const newLog: MedicationLog = {
      medicationId: medId,
      timestamp: new Date(),
      taken: taken,
    };
    setMedicationLogs([...medicationLogs, newLog]);
    // TODO: Save to IndexedDB
  };

  // Get medication status for today
  const getMedicationStatus = (medId: string): boolean | null => {
    const today = new Date().toDateString();
    const todayLogs = medicationLogs.filter(
      log => new Date(log.timestamp).toDateString() === today && log.medicationId === medId
    );
    if (todayLogs.length === 0) return null;
    return todayLogs[todayLogs.length - 1].taken;
  };

  // Category colors (gothic theme)
  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Pain Relief': 'from-red-900 to-red-700',
      'Cardiovascular': 'from-purple-900 to-purple-700',
      'Immunosuppressant': 'from-indigo-900 to-indigo-700',
      'Respiratory': 'from-blue-900 to-blue-700',
      'Migraine': 'from-purple-900 to-purple-700',
      'Antiviral': 'from-green-900 to-green-700',
      'Antidepressant': 'from-violet-900 to-violet-700',
      'Stimulant': 'from-orange-900 to-orange-700',
      'Gastrointestinal': 'from-indigo-900 to-indigo-700',
      'Supplement': 'from-emerald-900 to-emerald-700',
      'Medical Device': 'from-gray-900 to-gray-700',
      'Immunomodulator': 'from-blue-900 to-blue-700',
      'NSAID/Pain Relief': 'from-purple-900 to-purple-700',
      'Muscle Relaxant': 'from-indigo-900 to-indigo-700',
      'Migraine Treatment': 'from-purple-900 to-purple-700',
      'Migraine Prevention': 'from-magenta-900 to-magenta-700',
      'SNRI Antidepressant': 'from-slate-900 to-slate-700',
      'Anticonvulsant/Migraine Prevention': 'from-blue-900 to-blue-700',
    };
    return colors[category] || 'from-gray-900 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
              💊 Medication Tracker
            </h1>
            <p className="text-gray-400 mt-2">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {isMTXDay() && (
              <div className="mt-2 p-3 bg-red-900/30 border-2 border-red-500 rounded-lg animate-pulse">
                <p className="text-red-400 font-bold">⚠️ TODAY IS METHOTREXATE DAY - NO FOLIC ACID!</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowEmergency(!showEmergency)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50"
          >
            🚨 EMERGENCY
          </button>
        </div>

        {/* Emergency Panel */}
        {showEmergency && (
          <div className="mb-6 p-6 bg-red-900/20 border-2 border-red-500 rounded-xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">🚑 Emergency Medications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-950/50 rounded-lg border border-red-700">
                <h3 className="font-bold text-lg mb-2">🫁 Albuterol Inhaler</h3>
                <p className="text-sm text-gray-300 mb-2">For: Breathing difficulty/Asthma attack</p>
                <p className="text-xs text-red-300">Use immediately. If no improvement or worsening, call 911</p>
              </div>
              <div className="p-4 bg-red-950/50 rounded-lg border border-red-700">
                <h3 className="font-bold text-lg mb-2">🤕 Sumatriptan</h3>
                <p className="text-sm text-gray-300 mb-2">For: Severe migraine</p>
                <p className="text-xs text-red-300">Take at first sign. May repeat in 2 hours (max 200mg/day)</p>
              </div>
            </div>
          </div>
        )}

        {/* Critical Reminders */}
        <div className="mb-6 p-4 bg-purple-900/20 border-2 border-purple-500 rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-purple-300">⚠️ Critical Reminders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {medicationsData.critical_reminders.map((reminder, index) => (
              <div key={index} className="p-2 bg-purple-950/30 rounded-lg">
                {reminder}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {['all', 'morning', 'midday', 'late_afternoon', 'evening', 'bedtime', 'weekly', 'monthly', 'as_needed'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeOfDay(period)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedTimeOfDay === period
                  ? 'bg-gradient-to-r from-purple-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {period.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Active Medications List */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">
          {selectedTimeOfDay === 'all' ? 'All Active Medications' : `${selectedTimeOfDay.replace('_', ' ').toUpperCase()} Medications`}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {medicationsData.medications
            .filter((med: Medication) => med.active)
            .filter((med: Medication) => {
              if (selectedTimeOfDay === 'all') return true;
              // Filter based on timing
              const timing = med.timing.toLowerCase();
              if (selectedTimeOfDay === 'morning') return timing.includes('morning') || timing.includes('am') || timing.includes('daily');
              if (selectedTimeOfDay === 'midday') return timing.includes('midday') || timing.includes('3 times') || timing.includes('3x');
              if (selectedTimeOfDay === 'evening') return timing.includes('evening') || timing.includes('pm') || timing.includes('twice');
              if (selectedTimeOfDay === 'bedtime') return timing.includes('bedtime');
              if (selectedTimeOfDay === 'weekly') return timing.includes('weekly');
              if (selectedTimeOfDay === 'monthly') return timing.includes('monthly');
              if (selectedTimeOfDay === 'as_needed') return timing.includes('prn') || timing.includes('needed') || timing.includes('as needed');
              return false;
            })
            .map((med: Medication) => {
              const status = getMedicationStatus(med.id);
              const isExpanded = expandedMed === med.id;

              return (
                <div
                  key={med.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    status === true
                      ? 'bg-green-900/20 border-green-500'
                      : status === false
                      ? 'bg-red-900/20 border-red-500'
                      : 'bg-gray-800/50 border-purple-500/30 hover:border-purple-500'
                  }`}
                >
                  {/* Medication Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{med.name}</h3>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(med.category)}`}>
                        {med.category}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedMed(isExpanded ? null : med.id)}
                      className="ml-2 text-purple-400 hover:text-purple-300 text-2xl"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-1 text-sm mb-3">
                    <p><span className="text-gray-400">Dose:</span> <span className="text-white font-semibold">{med.dose}</span></p>
                    <p><span className="text-gray-400">Timing:</span> <span className="text-purple-300">{med.timing}</span></p>
                    {med.requires_meal && (
                      <p className="text-indigo-400 font-semibold">🍔 Take with food</p>
                    )}
                    {med.warning && (
                      <p className="text-red-400 font-bold">⚠️ {med.warning}</p>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-purple-500/30 space-y-2 text-sm">
                      <p><span className="text-gray-400">Indication:</span> <span className="text-white">{med.indication}</span></p>
                      <p><span className="text-gray-400">Route:</span> <span className="text-white">{med.route}</span></p>
                      <p><span className="text-gray-400">Frequency:</span> <span className="text-white">{med.frequency}</span></p>
                      {med.date_started && (
                        <p><span className="text-gray-400">Started:</span> <span className="text-white">{med.date_started}</span></p>
                      )}
                      {med.ordered_by && (
                        <p><span className="text-gray-400">Prescribed by:</span> <span className="text-white">{med.ordered_by}</span></p>
                      )}
                      <div className="mt-3 p-3 bg-purple-900/20 rounded-lg">
                        <p className="text-gray-300 text-xs">{med.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => logMedication(med.id, true)}
                      disabled={status === true}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        status === true
                          ? 'bg-green-900/30 text-green-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {status === true ? '✓ Taken' : 'Mark Taken'}
                    </button>
                    <button
                      onClick={() => logMedication(med.id, false)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all duration-300"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Medication Summary Stats */}
      <div className="max-w-7xl mx-auto mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-purple-900/30 rounded-xl border-2 border-purple-500/30">
        <h3 className="text-xl font-bold mb-4 text-purple-300">📊 Medication Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-3xl font-bold text-purple-400">{medicationsData.medication_summary.total_medications}</p>
            <p className="text-sm text-gray-400">Total Medications</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-3xl font-bold text-green-400">{medicationsData.medication_summary.active_medications}</p>
            <p className="text-sm text-gray-400">Active</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-3xl font-bold text-blue-400">{medicationsData.medication_summary.daily_oral_count}</p>
            <p className="text-sm text-gray-400">Daily Oral</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg">
            <p className="text-3xl font-bold text-purple-400">{medicationsData.medication_summary.prn_count}</p>
            <p className="text-sm text-gray-400">As Needed</p>
          </div>
        </div>
      </div>

      {/* Prescriber Quick Contact */}
      <div className="max-w-7xl mx-auto mt-8 p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border-2 border-indigo-500/30">
        <h3 className="text-xl font-bold mb-4 text-indigo-300">👨‍⚕️ Prescriber Directory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(medicationsData.prescriber_directory).map(([key, prescriber]: [string, any]) => (
            <div key={key} className="p-3 bg-black/30 rounded-lg">
              <p className="font-bold text-white">{prescriber.name}</p>
              <p className="text-xs text-gray-400">{prescriber.specialty}</p>
              <p className="text-xs text-purple-400 mt-1">{prescriber.medications.length} medications</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationTrackerV2;
