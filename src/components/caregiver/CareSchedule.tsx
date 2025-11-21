import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2, Check, X, User, FileText, Bell, RepeatIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface CareVisit {
  id: string;
  caregiverName: string;
  visitType: string;
  date: string;
  startTime: string;
  endTime: string;
  recurring: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
  notes: string;
  completed: boolean;
  reminderMinutes: number;
  createdAt: number;
}

const visitTypes = [
  'Personal Care',
  'Medication Management',
  'Meal Preparation',
  'House Cleaning',
  'Transportation',
  'Medical Appointment',
  'Companionship',
  'Physical Therapy',
  'Occupational Therapy',
  'Speech Therapy',
  'Nursing Care',
  'Respite Care',
  'Other',
];

const reminderOptions = [
  { label: 'No reminder', value: 0 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
  { label: '1 hour before', value: 60 },
  { label: '2 hours before', value: 120 },
  { label: '1 day before', value: 1440 },
];

export default function CareSchedule() {
  const [visits, setVisits] = useState<CareVisit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [formData, setFormData] = useState({
    caregiverName: '',
    visitType: visitTypes[0],
    date: '',
    startTime: '',
    endTime: '',
    recurring: 'none' as CareVisit['recurring'],
    notes: '',
    reminderMinutes: 60,
  });

  useEffect(() => {
    const saved = localStorage.getItem('careVisits');
    if (saved) {
      setVisits(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('careVisits', JSON.stringify(visits));
  }, [visits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.caregiverName.trim() || !formData.date || !formData.startTime) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingId) {
      setVisits(visits.map(visit =>
        visit.id === editingId
          ? { ...visit, ...formData, completed: visit.completed }
          : visit
      ));
      toast.success('Visit updated!');
      setEditingId(null);
    } else {
      const newVisit: CareVisit = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
        createdAt: Date.now(),
      };
      setVisits([...visits, newVisit]);
      toast.success('Visit scheduled!');
    }

    setFormData({
      caregiverName: '',
      visitType: visitTypes[0],
      date: '',
      startTime: '',
      endTime: '',
      recurring: 'none',
      notes: '',
      reminderMinutes: 60,
    });
    setIsAdding(false);
  };

  const handleEdit = (visit: CareVisit) => {
    setFormData({
      caregiverName: visit.caregiverName,
      visitType: visit.visitType,
      date: visit.date,
      startTime: visit.startTime,
      endTime: visit.endTime,
      recurring: visit.recurring,
      notes: visit.notes,
      reminderMinutes: visit.reminderMinutes,
    });
    setEditingId(visit.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this visit?')) {
      setVisits(visits.filter(v => v.id !== id));
      toast.success('Visit deleted');
    }
  };

  const toggleComplete = (id: string) => {
    setVisits(visits.map(visit =>
      visit.id === id ? { ...visit, completed: !visit.completed } : visit
    ));
    const visit = visits.find(v => v.id === id);
    toast.success(visit?.completed ? 'Marked as incomplete' : 'Marked as complete');
  };

  const getFilteredVisits = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return visits.filter(visit => {
      const visitDate = new Date(visit.date);
      const visitDay = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate());

      if (filter === 'upcoming') {
        return visitDay >= today && !visit.completed;
      } else if (filter === 'past') {
        return visitDay < today || visit.completed;
      }
      return true;
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`).getTime();
      const dateB = new Date(`${b.date}T${b.startTime}`).getTime();
      return filter === 'past' ? dateB - dateA : dateA - dateB;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getRecurringLabel = (recurring: CareVisit['recurring']) => {
    const labels = {
      none: '',
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
    };
    return labels[recurring];
  };

  const filteredVisits = getFilteredVisits();
  const upcomingCount = visits.filter(v => {
    const visitDate = new Date(v.date);
    const today = new Date();
    return visitDate >= today && !v.completed;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-cyan-400" />
            Care Schedule
          </h2>
          <p className="text-cyan-200/70 mt-1">
            {upcomingCount} upcoming visit{upcomingCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setEditingId(null);
              setFormData({
                caregiverName: '',
                visitType: visitTypes[0],
                date: '',
                startTime: '',
                endTime: '',
                recurring: 'none',
                notes: '',
                reminderMinutes: 60,
              });
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Schedule Visit'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
        {(['upcoming', 'past', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              filter === tab
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'text-cyan-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Visit' : 'Schedule New Visit'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyan-100 mb-2">Caregiver Name *</label>
              <input
                type="text"
                value={formData.caregiverName}
                onChange={(e) => setFormData({ ...formData, caregiverName: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Enter caregiver name"
                required
              />
            </div>

            <div>
              <label className="block text-cyan-100 mb-2">Visit Type</label>
              <select
                value={formData.visitType}
                onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                {visitTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-cyan-100 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-cyan-100 mb-2">Recurring</label>
              <select
                value={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.value as CareVisit['recurring'] })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-cyan-100 mb-2">Start Time *</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-cyan-100 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-cyan-100 mb-2">Reminder</label>
              <select
                value={formData.reminderMinutes}
                onChange={(e) => setFormData({ ...formData, reminderMinutes: parseInt(e.target.value) })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                {reminderOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-cyan-100 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 min-h-[100px]"
                placeholder="Any special instructions or notes..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all font-medium"
            >
              {editingId ? 'Update Visit' : 'Schedule Visit'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  caregiverName: '',
                  visitType: visitTypes[0],
                  date: '',
                  startTime: '',
                  endTime: '',
                  recurring: 'none',
                  notes: '',
                  reminderMinutes: 60,
                });
              }}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Visits List */}
      <div className="space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20">
            <Calendar className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
            <p className="text-cyan-200/70 text-lg">
              {filter === 'upcoming' ? 'No upcoming visits scheduled' :
               filter === 'past' ? 'No past visits' :
               'No visits scheduled'}
            </p>
          </div>
        ) : (
          filteredVisits.map(visit => (
            <div
              key={visit.id}
              className={`bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-5 border transition-all ${
                visit.completed
                  ? 'border-green-500/30 opacity-60'
                  : 'border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-400" />
                      {visit.caregiverName}
                    </h3>
                    {visit.recurring !== 'none' && (
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold flex items-center gap-1">
                        <RepeatIcon className="w-3 h-3" />
                        {getRecurringLabel(visit.recurring)}
                      </span>
                    )}
                    {visit.completed && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-200">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>{visit.visitType}</span>
                    </div>

                    <div className="flex items-center gap-4 text-cyan-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>{formatDate(visit.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>
                          {formatTime(visit.startTime)}
                          {visit.endTime && ` - ${formatTime(visit.endTime)}`}
                        </span>
                      </div>
                    </div>

                    {visit.reminderMinutes > 0 && (
                      <div className="flex items-center gap-2 text-cyan-200/70 text-sm">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        <span>
                          Reminder: {reminderOptions.find(r => r.value === visit.reminderMinutes)?.label}
                        </span>
                      </div>
                    )}

                    {visit.notes && (
                      <div className="mt-3 p-3 bg-black/30 rounded-lg border border-cyan-500/20">
                        <p className="text-cyan-100 text-sm whitespace-pre-wrap">{visit.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleComplete(visit.id)}
                    className={`p-2 rounded-lg transition-all ${
                      visit.completed
                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                    }`}
                    title={visit.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(visit)}
                    className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                    title="Edit visit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(visit.id)}
                    className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                    title="Delete visit"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
