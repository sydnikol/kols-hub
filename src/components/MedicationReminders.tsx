import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Pill, Plus, Trash2, Edit, Check, X, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';

interface MedicationReminder {
  id: string;
  medicationName: string;
  dosage: string;
  times: string[];
  frequency: 'daily' | 'weekly' | 'as-needed';
  days?: string[];
  notes: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  lastTaken?: string;
  enabled: boolean;
}

export const MedicationReminders: React.FC = () => {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState<Partial<MedicationReminder>>({
    medicationName: '',
    dosage: '',
    times: ['09:00'],
    frequency: 'daily',
    days: [],
    notes: '',
    soundEnabled: true,
    vibrationEnabled: true,
    enabled: true
  });

  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadReminders();
    checkReminders();
    
    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const loadReminders = () => {
    const stored = localStorage.getItem('kol_medication_reminders');
    if (stored) {
      setReminders(JSON.parse(stored));
    }
  };

  const saveReminders = (updated: MedicationReminder[]) => {
    localStorage.setItem('kol_medication_reminders', JSON.stringify(updated));
    setReminders(updated);
  };

  const checkReminders = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = DAYS_OF_WEEK[now.getDay() === 0 ? 6 : now.getDay() - 1];

    reminders.forEach(reminder => {
      if (!reminder.enabled) return;

      const shouldTrigger = reminder.times.includes(currentTime) && (
        reminder.frequency === 'daily' ||
        (reminder.frequency === 'weekly' && reminder.days?.includes(currentDay))
      );

      if (shouldTrigger) {
        triggerReminder(reminder);
      }
    });
  };

  const triggerReminder = (reminder: MedicationReminder) => {
    // Visual notification
    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-purple-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-purple-500`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Pill className="h-10 w-10 text-purple-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  Time to take your medication!
                </p>
                <p className="mt-1 text-sm text-purple-200">
                  {reminder.medicationName} - {reminder.dosage}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-purple-700">
            <button
              onClick={() => {
                markAsTaken(reminder.id);
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-purple-300 hover:text-purple-100"
            >
              Taken
            </button>
          </div>
        </div>
      ),
      { duration: 30000 }
    );

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medication Reminder', {
        body: `Time to take ${reminder.medicationName} - ${reminder.dosage}`,
        icon: '/pill-icon.png',
        badge: '/badge-icon.png',
        vibrate: reminder.vibrationEnabled ? [200, 100, 200] : undefined
      });
    }

    // Sound notification
    if (reminder.soundEnabled) {
      playReminderSound();
    }

    // Vibration (mobile only)
    if (reminder.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const playReminderSound = () => {
    const audio = new Audio('/reminder-sound.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Could not play sound:', err));
  };

  const markAsTaken = (id: string) => {
    const updated = reminders.map(r =>
      r.id === id ? { ...r, lastTaken: new Date().toISOString() } : r
    );
    saveReminders(updated);
    toast.success('Marked as taken!');
  };

  const addReminder = () => {
    if (!newReminder.medicationName || !newReminder.dosage) {
      toast.error('Please fill in required fields');
      return;
    }

    const reminder: MedicationReminder = {
      id: `reminder_${Date.now()}`,
      medicationName: newReminder.medicationName!,
      dosage: newReminder.dosage!,
      times: newReminder.times || ['09:00'],
      frequency: newReminder.frequency || 'daily',
      days: newReminder.days || [],
      notes: newReminder.notes || '',
      soundEnabled: newReminder.soundEnabled !== false,
      vibrationEnabled: newReminder.vibrationEnabled !== false,
      enabled: true
    };

    saveReminders([...reminders, reminder]);
    setShowAddForm(false);
    resetForm();
    toast.success('Reminder added!');
  };

  const updateReminder = (id: string, updates: Partial<MedicationReminder>) => {
    const updated = reminders.map(r => r.id === id ? { ...r, ...updates } : r);
    saveReminders(updated);
    toast.success('Reminder updated!');
  };

  const deleteReminder = (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      saveReminders(reminders.filter(r => r.id !== id));
      toast.success('Reminder deleted');
    }
  };

  const resetForm = () => {
    setNewReminder({
      medicationName: '',
      dosage: '',
      times: ['09:00'],
      frequency: 'daily',
      days: [],
      notes: '',
      soundEnabled: true,
      vibrationEnabled: true,
      enabled: true
    });
  };

  const addTimeSlot = () => {
    setNewReminder({
      ...newReminder,
      times: [...(newReminder.times || []), '09:00']
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const updatedTimes = [...(newReminder.times || [])];
    updatedTimes[index] = value;
    setNewReminder({ ...newReminder, times: updatedTimes });
  };

  const removeTimeSlot = (index: number) => {
    const updatedTimes = (newReminder.times || []).filter((_, i) => i !== index);
    setNewReminder({ ...newReminder, times: updatedTimes });
  };

  const toggleDay = (day: string) => {
    const days = newReminder.days || [];
    setNewReminder({
      ...newReminder,
      days: days.includes(day)
        ? days.filter(d => d !== day)
        : [...days, day]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Medication Reminders</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Reminder
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingId ? 'Edit Reminder' : 'New Reminder'}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Medication Name *</label>
                  <input
                    type="text"
                    value={newReminder.medicationName}
                    onChange={(e) => setNewReminder({ ...newReminder, medicationName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                    placeholder="e.g., Lisinopril"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Dosage *</label>
                  <input
                    type="text"
                    value={newReminder.dosage}
                    onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                    placeholder="e.g., 10mg"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Frequency</label>
                <div className="flex gap-4">
                  {(['daily', 'weekly', 'as-needed'] as const).map(freq => (
                    <button
                      key={freq}
                      onClick={() => setNewReminder({ ...newReminder, frequency: freq })}
                      className={`px-4 py-2 rounded ${
                        newReminder.frequency === freq
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {newReminder.frequency === 'weekly' && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1 rounded text-sm ${
                          newReminder.days?.includes(day)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Times</label>
                  <button
                    onClick={addTimeSlot}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    + Add Time
                  </button>
                </div>
                <div className="space-y-2">
                  {newReminder.times?.map((time, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                      />
                      {(newReminder.times?.length || 0) > 1 && (
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="px-3 bg-red-600 hover:bg-red-700 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Notes (optional)</label>
                <textarea
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                  rows={3}
                  placeholder="Special instructions..."
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReminder.soundEnabled}
                    onChange={(e) => setNewReminder({ ...newReminder, soundEnabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Volume2 className="w-4 h-4" />
                  Sound
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReminder.vibrationEnabled}
                    onChange={(e) => setNewReminder({ ...newReminder, vibrationEnabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Bell className="w-4 h-4" />
                  Vibration
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={addReminder}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No reminders set yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded"
              >
                Create Your First Reminder
              </button>
            </div>
          ) : (
            reminders.map(reminder => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{reminder.medicationName}</h3>
                      <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-sm rounded">
                        {reminder.dosage}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {reminder.times.map((time, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {time}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-400 text-sm mb-2">
                      {reminder.frequency === 'daily' && 'Every day'}
                      {reminder.frequency === 'weekly' && `Every ${reminder.days?.join(', ')}`}
                      {reminder.frequency === 'as-needed' && 'As needed'}
                    </p>

                    {reminder.notes && (
                      <p className="text-gray-500 text-sm">{reminder.notes}</p>
                    )}

                    {reminder.lastTaken && (
                      <p className="text-green-400 text-sm mt-2">
                        Last taken: {new Date(reminder.lastTaken).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => updateReminder(reminder.id, { enabled: !reminder.enabled })}
                      className={`px-3 py-1 rounded text-sm ${
                        reminder.enabled ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      {reminder.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => markAsTaken(reminder.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Mark Taken
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
