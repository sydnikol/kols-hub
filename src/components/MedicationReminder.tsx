/**
 * Medication Reminder Widget
 * Shows upcoming medications and allows quick marking as taken
 */

import React, { useState, useEffect } from 'react';
import { Pill, Clock, CheckCircle, AlertTriangle, Bell } from 'lucide-react';
import { MY_MEDICATIONS } from '../data/medications';
import toast from 'react-hot-toast';

interface MedicationStatus {
  name: string;
  taken: boolean;
  time?: string;
}

const MedicationReminder: React.FC = () => {
  const [medicationStatuses, setMedicationStatuses] = useState<Record<string, MedicationStatus>>({});
  const today = new Date().toISOString().split('T')[0];

  // Get active medications
  const activeMeds = MY_MEDICATIONS.filter(m => m.status === 'Active');

  // Group by frequency
  const dailyMeds = activeMeds.filter(m =>
    m.frequency.toLowerCase().includes('daily') ||
    m.frequency.toLowerCase().includes('every morning') ||
    m.frequency.toLowerCase().includes('bedtime')
  );

  const asNeededMeds = activeMeds.filter(m =>
    m.frequency.toLowerCase().includes('as needed') ||
    m.frequency.toLowerCase().includes('prn')
  );

  const weeklyMeds = activeMeds.filter(m =>
    m.frequency.toLowerCase().includes('weekly') ||
    m.frequency.toLowerCase().includes('once weekly')
  );

  // Load today's status
  useEffect(() => {
    const stored = localStorage.getItem(`medStatus_${today}`);
    if (stored) {
      setMedicationStatuses(JSON.parse(stored));
    }
  }, [today]);

  const toggleMedication = (medName: string) => {
    const newStatuses = {
      ...medicationStatuses,
      [medName]: {
        name: medName,
        taken: !medicationStatuses[medName]?.taken,
        time: new Date().toLocaleTimeString()
      }
    };
    setMedicationStatuses(newStatuses);
    localStorage.setItem(`medStatus_${today}`, JSON.stringify(newStatuses));

    if (!medicationStatuses[medName]?.taken) {
      toast.success(`${medName} marked as taken`);
    }
  };

  const takenCount = Object.values(medicationStatuses).filter(s => s.taken).length;
  const totalDaily = dailyMeds.length;

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-4 border border-blue-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Pill className="text-blue-400" size={20} />
          Medications
        </h3>
        <span className="text-sm text-gray-400">
          {takenCount}/{totalDaily} taken
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${totalDaily > 0 ? (takenCount / totalDaily) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Daily Medications */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <p className="text-xs text-gray-400 font-semibold">Daily Medications</p>
        {dailyMeds.slice(0, 8).map(med => (
          <button
            key={med.drugName}
            onClick={() => toggleMedication(med.drugName)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
              medicationStatuses[med.drugName]?.taken
                ? 'bg-green-900/50 border border-green-500/30'
                : 'bg-blue-900/30 border border-blue-500/20 hover:bg-blue-800/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {medicationStatuses[med.drugName]?.taken ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-500" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium">{med.drugName}</p>
                <p className="text-xs text-gray-400">{med.strength} - {med.frequency}</p>
              </div>
            </div>
            {medicationStatuses[med.drugName]?.time && (
              <span className="text-xs text-gray-500">
                {medicationStatuses[med.drugName].time}
              </span>
            )}
          </button>
        ))}

        {/* Weekly Medications */}
        {weeklyMeds.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-semibold mt-4">Weekly</p>
            {weeklyMeds.map(med => (
              <button
                key={med.drugName}
                onClick={() => toggleMedication(med.drugName)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  medicationStatuses[med.drugName]?.taken
                    ? 'bg-green-900/50 border border-green-500/30'
                    : 'bg-yellow-900/30 border border-yellow-500/20 hover:bg-yellow-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  {medicationStatuses[med.drugName]?.taken ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : (
                    <AlertTriangle className="text-yellow-400" size={16} />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">{med.drugName}</p>
                    <p className="text-xs text-gray-400">{med.strength} - {med.frequency}</p>
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {/* As Needed */}
        {asNeededMeds.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-semibold mt-4">As Needed</p>
            {asNeededMeds.slice(0, 3).map(med => (
              <button
                key={med.drugName}
                onClick={() => toggleMedication(med.drugName)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  medicationStatuses[med.drugName]?.taken
                    ? 'bg-purple-900/50 border border-purple-500/30'
                    : 'bg-gray-900/30 border border-gray-500/20 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  {medicationStatuses[med.drugName]?.taken ? (
                    <CheckCircle className="text-purple-400" size={16} />
                  ) : (
                    <Clock className="text-gray-400" size={16} />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">{med.drugName}</p>
                    <p className="text-xs text-gray-400">{med.strength}</p>
                  </div>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* All Taken Message */}
      {takenCount >= totalDaily && totalDaily > 0 && (
        <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30 text-center">
          <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
            <CheckCircle size={18} />
            All daily medications taken!
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicationReminder;
