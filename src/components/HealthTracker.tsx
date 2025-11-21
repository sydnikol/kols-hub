/**
 * 🖤 COMPREHENSIVE HEALTH TRACKER
 * Complete health management for EDS Type 3 + chronic conditions
 *
 * Features:
 * - Medication tracking with Excel import/export
 * - Vitals logging (BP, HR, O2, temp)
 * - Hydration + Sodium tracking (2-3L + 4000mg goals)
 * - Body Weather (pain/energy/mood journal)
 * - Physical therapy exercises with EDS safety
 * - Emergency suite (cards, protocols)
 */

import React, { useState, useEffect } from 'react';
import {
  Pill, Activity, Droplet, Cloud, Dumbbell, AlertTriangle,
  Plus, Upload, Download, Calendar, TrendingUp, Heart,
  ChevronRight, Clock, CheckCircle2, Info, Shield, Thermometer
} from 'lucide-react';
import { db } from '../utils/database';
import type { MedicationRecord, VitalRecord, HydrationRecord } from '../utils/database';
import { importMedicationsFromExcel, exportMedicationsToExcel } from '../utils/medication-import';

interface HealthTrackerProps {
  theme: string;
}

const HealthTracker: React.FC<HealthTrackerProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('medications');
  const [medications, setMedications] = useState<MedicationRecord[]>([]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [todayVitals, setTodayVitals] = useState<VitalRecord[]>([]);
  const [todayHydration, setTodayHydration] = useState<HydrationRecord[]>([]);

  // Load medications on mount
  useEffect(() => {
    loadMedications();
    loadTodayData();
  }, []);

  const loadMedications = async () => {
    const meds = await db.medications.toArray();
    setMedications(meds);
  };

  const loadTodayData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Load vitals and hydration data for today
    const vitals = await db.vitals
      .where('timestamp')
      .aboveOrEqual(today)
      .toArray();
    setTodayVitals(vitals);

    const hydration = await db.hydration
      .where('timestamp')
      .aboveOrEqual(today)
      .toArray();
    setTodayHydration(hydration);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedMeds = await importMedicationsFromExcel(file);
      // Add imported medications to database
      await db.medications.bulkAdd(importedMeds);
      alert(`Successfully imported ${importedMeds.length} medications!`);
      loadMedications();
    } catch (error) {
      alert(`Import error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleExportExcel = () => {
    try {
      exportMedicationsToExcel(medications);
    } catch (error) {
      alert(`Export error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const tabs = [
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'vitals', label: 'Vitals', icon: Activity },
    { id: 'hydration', label: 'Hydration + Sodium', icon: Droplet },
    { id: 'body-weather', label: 'Body Weather', icon: Cloud },
    { id: 'pt', label: 'Physical Therapy', icon: Dumbbell },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle }
  ];

  const addVitals = async (vitals: Omit<VitalRecord, 'id'>) => {
    await db.vitals.add({
      ...vitals,
      timestamp: new Date()
    });
    loadTodayData();
  };

  const addHydration = async (water: number, sodium: number) => {
    await db.hydration.add({
      timestamp: new Date(),
      waterIntake: water,
      sodiumIntake: sodium
    });
    loadTodayData();
  };

  const calculateHydrationProgress = () => {
    const totalWater = todayHydration.reduce((sum, h) => sum + h.waterIntake, 0);
    const totalSodium = todayHydration.reduce((sum, h) => sum + h.sodiumIntake, 0);

    return {
      water: Math.min((totalWater / 2500) * 100, 100), // 2.5L goal
      sodium: Math.min((totalSodium / 4000) * 100, 100) // 4000mg goal
    };
  };

  const renderMedicationsTab = () => (
    <div className="space-y-6">
      {/* Import/Export Actions */}
      <div className="flex flex-wrap gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
        <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors">
          <Upload className="w-5 h-5" />
          Import Excel
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleImportExcel}
            className="hidden"
          />
        </label>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export Excel
        </button>
        <button
          onClick={() => setShowAddMed(!showAddMed)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Medication
        </button>
      </div>

      {/* Medications List */}
      <div className="grid gap-4">
        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No medications tracked yet.</p>
            <p className="text-sm mt-2">Import your medication list or add manually.</p>
          </div>
        ) : (
          medications.map((med, index) => (
            <div key={med.id || index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{med.drugName}</h4>
                  <p className="text-sm text-gray-400">{med.genericName}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="text-gray-500">Strength:</span> {med.strength}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Dosage:</span> {med.dosage}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Frequency:</span> {med.frequency}
                    </p>
                    {med.prescriber && (
                      <p className="text-sm">
                        <span className="text-gray-500">Prescriber:</span> {med.prescriber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                    ${med.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {med.status}
                  </span>
                  {med.refills !== undefined && (
                    <p className="mt-2 text-sm text-gray-500">
                      {med.refills} refills
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderVitalsTab = () => (
    <div className="space-y-6">
      {/* Quick Entry Form */}
      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Log Vitals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Systolic BP"
            className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
          />
          <input
            type="number"
            placeholder="Diastolic BP"
            className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
          />
          <input
            type="number"
            placeholder="Heart Rate"
            className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
          />
          <input
            type="number"
            placeholder="O2 %"
            className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Temp °F"
            className="px-3 py-2 bg-gray-800 rounded-lg border border-gray-700"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Log Vitals
          </button>
        </div>
      </div>

      {/* Today's Readings */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-400">Today's Readings</h3>
        {todayVitals.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No vitals logged today</p>
        ) : (
          todayVitals.map((vital, index) => (
            <div key={vital.id || index} className="p-3 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-sm">
                  <span>BP: {vital.bloodPressureSystolic || 'N/A'}/{vital.bloodPressureDiastolic || 'N/A'}</span>
                  <span>HR: {vital.heartRate || 'N/A'}</span>
                  <span>O2: {vital.oxygenLevel || 'N/A'}%</span>
                  <span>Temp: {vital.temperature || 'N/A'}°F</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(vital.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderHydrationTab = () => {
    const progress = calculateHydrationProgress();

    return (
      <div className="space-y-6">
        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Water (2.5L goal)</span>
              <span className="text-sm text-gray-400">{progress.water.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.water}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Sodium (4000mg goal)</span>
              <span className="text-sm text-gray-400">{progress.sodium.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.sodium}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => addHydration(250, 0)}
            className="p-4 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <Droplet className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-semibold">+250ml Water</p>
          </button>
          <button
            onClick={() => addHydration(0, 500)}
            className="p-4 bg-orange-500/20 rounded-lg hover:bg-orange-500/30 transition-colors"
          >
            <Shield className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="font-semibold">+500mg Sodium</p>
          </button>
        </div>

        {/* Today's Log */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-400">Today's Intake</h3>
          {todayHydration.map((entry, index) => (
            <div key={entry.id || index} className="flex justify-between p-2 bg-gray-800 rounded">
              <span className="text-sm">
                {entry.waterIntake > 0 && `${entry.waterIntake}ml water`}
                {entry.waterIntake > 0 && entry.sodiumIntake > 0 && ' + '}
                {entry.sodiumIntake > 0 && `${entry.sodiumIntake}mg sodium`}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBodyWeatherTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pain Level */}
        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
          <h3 className="font-semibold mb-3 text-red-400">Pain Level</h3>
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
              <button
                key={level}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all
                  ${level <= 3 ? 'bg-green-500/20 hover:bg-green-500/40' : ''}
                  ${level >= 4 && level <= 6 ? 'bg-indigo-500/20 hover:bg-indigo-500/40' : ''}
                  ${level >= 7 ? 'bg-red-500/20 hover:bg-red-500/40' : ''}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
          <h3 className="font-semibold mb-3 text-indigo-400">Energy (Spoons)</h3>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(spoon => (
              <button
                key={spoon}
                className="p-2 bg-indigo-500/20 rounded hover:bg-indigo-500/40 transition-colors"
              >
                🥄
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <h3 className="font-semibold mb-3 text-purple-400">Mood</h3>
          <div className="grid grid-cols-3 gap-2">
            {['😔', '😐', '😊'].map((emoji, index) => (
              <button
                key={index}
                className="text-2xl p-2 bg-purple-500/20 rounded hover:bg-purple-500/40 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Entry */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Today's Notes</h3>
        <textarea
          className="w-full px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 resize-none"
          rows={4}
          placeholder="How are you feeling today? Any flares, triggers, or victories to note?"
        />
        <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Entry
        </button>
      </div>
    </div>
  );

  const renderPTTab = () => (
    <div className="space-y-6">
      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
        <h3 className="font-semibold mb-3 text-green-400">EDS-Safe Exercises</h3>
        <p className="text-sm text-gray-400 mb-4">
          Low-impact, joint-protective exercises designed for hypermobility
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { name: 'Isometric Holds', duration: '30 sec', sets: 3, safe: true },
          { name: 'Gentle Range of Motion', duration: '5 min', sets: 1, safe: true },
          { name: 'Proprioception Balance', duration: '1 min', sets: 3, safe: true },
          { name: 'Core Stabilization', duration: '10 reps', sets: 2, safe: true }
        ].map((exercise, index) => (
          <div key={index} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{exercise.name}</h4>
              <p className="text-sm text-gray-400">
                {exercise.duration} × {exercise.sets} sets
              </p>
            </div>
            <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Complete
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div className="p-4 bg-red-500/20 rounded-lg border border-red-500">
        <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Emergency Information
        </h3>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-gray-300">Primary Conditions:</p>
            <p>EDS Type 3 (Hypermobile), POTS, Chronic Pain</p>
          </div>

          <div>
            <p className="font-semibold text-gray-300">Emergency Contacts:</p>
            <p>DaVeon: (stored in phone)</p>
            <p>Quincy: (stored in phone)</p>
          </div>

          <div>
            <p className="font-semibold text-gray-300">Critical Notes:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Joint dislocations possible - handle with care</li>
              <li>Orthostatic intolerance - do not sit up quickly</li>
              <li>May need IV fluids for severe POTS episodes</li>
            </ul>
          </div>
        </div>
      </div>

      <button className="w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold">
        Generate Emergency Card (PDF)
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">🖤 Health Tracker</h2>
        <p className="text-gray-400">Comprehensive health management with EDS awareness</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 rounded-xl p-6">
        {activeTab === 'medications' && renderMedicationsTab()}
        {activeTab === 'vitals' && renderVitalsTab()}
        {activeTab === 'hydration' && renderHydrationTab()}
        {activeTab === 'body-weather' && renderBodyWeatherTab()}
        {activeTab === 'pt' && renderPTTab()}
        {activeTab === 'emergency' && renderEmergencyTab()}
      </div>
    </div>
  );
};

export default HealthTracker;
