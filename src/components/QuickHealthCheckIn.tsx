/**
 * Quick Health Check-In Component
 * A quick daily check-in widget for tracking how you feel
 */

import React, { useState, useEffect } from 'react';
import { Heart, Brain, Battery, Sun, Moon, Pill, Activity, Save, CheckCircle } from 'lucide-react';
import { db } from '../utils/database';
import toast from 'react-hot-toast';

interface CheckInData {
  date: string;
  energyLevel: number;
  painLevel: number;
  mood: string;
  spoons: number;
  symptoms: string[];
  medicationsTaken: boolean;
  notes: string;
}

const MOOD_OPTIONS = [
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'bad', emoji: '😢', label: 'Bad' },
];

const COMMON_SYMPTOMS = [
  'Fatigue', 'Headache', 'Brain Fog', 'Joint Pain', 'Muscle Pain',
  'Nausea', 'Dizziness', 'Anxiety', 'Insomnia', 'Migraine'
];

const QuickHealthCheckIn: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState(5);
  const [painLevel, setPainLevel] = useState(3);
  const [mood, setMood] = useState('okay');
  const [spoons, setSpoons] = useState(12);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [medicationsTaken, setMedicationsTaken] = useState(false);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<CheckInData | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Load today's check-in if exists
  useEffect(() => {
    const loadTodayCheckIn = async () => {
      try {
        const stored = localStorage.getItem(`healthCheckIn_${today}`);
        if (stored) {
          const data = JSON.parse(stored);
          setTodayCheckIn(data);
          setEnergyLevel(data.energyLevel);
          setPainLevel(data.painLevel);
          setMood(data.mood);
          setSpoons(data.spoons);
          setSymptoms(data.symptoms || []);
          setMedicationsTaken(data.medicationsTaken);
          setNotes(data.notes || '');
          setSaved(true);
        }
      } catch (error) {
        console.error('Failed to load check-in:', error);
      }
    };
    loadTodayCheckIn();
  }, [today]);

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
    setSaved(false);
  };

  const saveCheckIn = async () => {
    const checkInData: CheckInData = {
      date: today,
      energyLevel,
      painLevel,
      mood,
      spoons,
      symptoms,
      medicationsTaken,
      notes
    };

    try {
      // Save to localStorage for quick access
      localStorage.setItem(`healthCheckIn_${today}`, JSON.stringify(checkInData));

      // Also save to IndexedDB if available
      if (db.bodyWeather) {
        await db.bodyWeather.add({
          id: Date.now(),
          date: today,
          timestamp: Date.now(),
          energyLevel,
          spoons,
          painLevel,
          mood,
          symptoms,
          notes
        });
      }

      setSaved(true);
      setTodayCheckIn(checkInData);
      toast.success('Check-in saved!');
    } catch (error) {
      console.error('Failed to save check-in:', error);
      toast.error('Failed to save');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Heart className="text-pink-400" size={20} />
          Daily Check-In
        </h3>
        {saved && (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle size={16} />
            Saved
          </span>
        )}
      </div>

      {/* Energy Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-sm">
            <Battery className="text-yellow-400" size={16} />
            Energy: {energyLevel}/10
          </span>
          <span className="text-xs text-gray-400">Spoons: {spoons}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={energyLevel}
          onChange={(e) => { setEnergyLevel(Number(e.target.value)); setSaved(false); }}
          className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
      </div>

      {/* Pain Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-sm">
            <Activity className="text-red-400" size={16} />
            Pain: {painLevel}/10
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(e) => { setPainLevel(Number(e.target.value)); setSaved(false); }}
          className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-red-400"
        />
      </div>

      {/* Mood */}
      <div className="mb-4">
        <span className="flex items-center gap-2 text-sm mb-2">
          <Brain className="text-purple-400" size={16} />
          Mood
        </span>
        <div className="flex gap-2">
          {MOOD_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => { setMood(option.value); setSaved(false); }}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                mood === option.value
                  ? 'bg-purple-600 scale-105'
                  : 'bg-purple-900/50 hover:bg-purple-800/50'
              }`}
            >
              <span className="text-xl">{option.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spoons */}
      <div className="mb-4">
        <span className="text-sm mb-2 block">Spoons Available: {spoons}</span>
        <input
          type="range"
          min="0"
          max="20"
          value={spoons}
          onChange={(e) => { setSpoons(Number(e.target.value)); setSaved(false); }}
          className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
        />
      </div>

      {/* Quick Symptoms */}
      <div className="mb-4">
        <span className="text-sm mb-2 block">Symptoms</span>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map(symptom => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-2 py-1 text-xs rounded-full transition-all ${
                symptoms.includes(symptom)
                  ? 'bg-red-600 text-white'
                  : 'bg-purple-900/50 text-gray-300 hover:bg-purple-800/50'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Medications Taken */}
      <div className="mb-4">
        <button
          onClick={() => { setMedicationsTaken(!medicationsTaken); setSaved(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            medicationsTaken
              ? 'bg-green-600 text-white'
              : 'bg-purple-900/50 text-gray-300 hover:bg-purple-800/50'
          }`}
        >
          <Pill size={16} />
          {medicationsTaken ? 'Medications Taken ✓' : 'Mark Medications Taken'}
        </button>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
          placeholder="Quick notes..."
          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/30 rounded-lg text-sm resize-none focus:outline-none focus:border-purple-400"
          rows={2}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveCheckIn}
        disabled={saved}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
          saved
            ? 'bg-green-600 cursor-default'
            : 'bg-purple-600 hover:bg-purple-500'
        }`}
      >
        {saved ? (
          <>
            <CheckCircle size={18} />
            Saved for Today
          </>
        ) : (
          <>
            <Save size={18} />
            Save Check-In
          </>
        )}
      </button>
    </div>
  );
};

export default QuickHealthCheckIn;
