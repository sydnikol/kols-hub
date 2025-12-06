import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, TrendingUp, Calendar, Briefcase, Target, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';

interface IncomeSource {
  id: string;
  name: string;
  category: 'salary' | 'freelance' | 'business' | 'investment' | 'passive' | 'benefits' | 'other';
  amount: number;
  frequency: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  isRecurring: boolean;
  nextPayDate?: string;
  notes: string;
  isActive: boolean;
}

interface IncomeEntry {
  id: string;
  sourceId: string;
  sourceName: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
}

const IncomeTracker: React.FC = () => {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'sources' | 'entries' | 'stats'>('sources');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const savedSources = localStorage.getItem('incomeSources');
    if (savedSources) setSources(JSON.parse(savedSources));

    const savedEntries = localStorage.getItem('incomeEntries');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
  }, []);

  useEffect(() => {
    localStorage.setItem('incomeSources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('incomeEntries', JSON.stringify(entries));
  }, [entries]);

  const addSource = () => {
    const newSource: IncomeSource = {
      id: Date.now().toString(),
      name: '',
      category: 'salary',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true,
      nextPayDate: new Date().toISOString().split('T')[0],
      notes: '',
      isActive: true
    };
    setSources([...sources, newSource]);
  };

  const updateSource = (id: string, updates: Partial<IncomeSource>) => {
    setSources(sources.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSource = (id: string) => {
    if (confirm('Delete this income source?')) {
      setSources(sources.filter(s => s.id !== id));
      setEntries(entries.filter(e => e.sourceId !== id));
      toast.success('Income source deleted');
    }
  };

  const addEntry = (sourceId?: string) => {
    const source = sourceId ? sources.find(s => s.id === sourceId) : null;

    const newEntry: IncomeEntry = {
      id: Date.now().toString(),
      sourceId: source?.id || '',
      sourceName: source?.name || '',
      amount: source?.amount || 0,
      date: new Date().toISOString().split('T')[0],
      category: source?.category || 'other',
      notes: ''
    };

    setEntries([...entries, newEntry]);
    toast.success('Income entry added!');
  };

  const updateEntry = (id: string, updates: Partial<IncomeEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this income entry?')) {
      setEntries(entries.filter(e => e.id !== id));
      toast.success('Entry deleted');
    }
  };

  const getMonthlyTotal = () => {
    return entries
      .filter(e => e.date.startsWith(selectedMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getYearlyProjection = () => {
    const activeSources = sources.filter(s => s.isActive && s.isRecurring);
    return activeSources.reduce((sum, s) => {
      const multiplier = {
        'daily': 365,
        'weekly': 52,
        'monthly': 12,
        'yearly': 1,
        'one-time': 0
      }[s.frequency];
      return sum + (s.amount * multiplier);
    }, 0);
  };

  const getCategoryBreakdown = () => {
    const breakdown: Record<string, number> = {};
    entries
      .filter(e => e.date.startsWith(selectedMonth))
      .forEach(e => {
        breakdown[e.category] = (breakdown[e.category] || 0) + e.amount;
      });
    return breakdown;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      salary: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      freelance: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      business: 'bg-green-500/20 border-green-500/30 text-green-300',
      investment: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      passive: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      benefits: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      other: 'bg-gray-500/20 border-gray-500/30 text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const monthlyTotal = getMonthlyTotal();
  const yearlyProjection = getYearlyProjection();
  const categoryBreakdown = getCategoryBreakdown();
  const averageMonthly = entries.length > 0 ?
    entries.reduce((sum, e) => sum + e.amount, 0) / new Set(entries.map(e => e.date.slice(0, 7))).size : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-6 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-emerald-300 font-semibold">This Month</h3>
          </div>
          <p className="text-3xl font-bold text-white">${monthlyTotal.toFixed(2)}</p>
          <p className="text-emerald-400 text-sm mt-1">{selectedMonth}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-blue-300 font-semibold">Yearly Projection</h3>
          </div>
          <p className="text-3xl font-bold text-white">${yearlyProjection.toFixed(2)}</p>
          <p className="text-blue-400 text-sm mt-1">Based on active sources</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h3 className="text-purple-300 font-semibold">Income Sources</h3>
          </div>
          <p className="text-3xl font-bold text-white">{sources.filter(s => s.isActive).length}</p>
          <p className="text-purple-400 text-sm mt-1">{sources.length} total</p>
        </div>

        <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 p-6 rounded-xl border border-teal-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-teal-400" />
            <h3 className="text-teal-300 font-semibold">Monthly Average</h3>
          </div>
          <p className="text-3xl font-bold text-white">${averageMonthly.toFixed(2)}</p>
          <p className="text-teal-400 text-sm mt-1">All time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'sources'
              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
              : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          Income Sources ({sources.length})
        </button>
        <button
          onClick={() => setActiveTab('entries')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'entries'
              ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
              : 'bg-blue-900/20 text-blue-400 hover:bg-blue-500/20'
          }`}
        >
          Entries ({entries.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'stats'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
              : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
          }`}
        >
          Statistics
        </button>
      </div>

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <button
            onClick={addSource}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500/20 border-2 border-emerald-500/30 rounded-xl text-emerald-300 hover:bg-emerald-500/30 transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Income Source
          </button>

          {sources.map(source => (
            <div key={source.id} className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 p-6 rounded-xl border border-emerald-500/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      value={source.name}
                      onChange={(e) => updateSource(source.id, { name: e.target.value })}
                      placeholder="Income source name..."
                      className="text-lg font-bold bg-transparent border-b-2 border-emerald-500/30 focus:border-emerald-500 outline-none text-white flex-1"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(source.category)}`}>
                      {source.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                      source.isActive ? 'bg-green-500/20 border-green-500/30 text-green-300' : 'bg-gray-500/20 border-gray-500/30 text-gray-300'
                    }`}>
                      {source.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Amount ($)</label>
                      <input
                        type="number"
                        value={source.amount}
                        onChange={(e) => updateSource(source.id, { amount: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Frequency</label>
                      <select
                        value={source.frequency}
                        onChange={(e) => updateSource(source.id, { frequency: e.target.value as IncomeSource['frequency'] })}
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                      >
                        <option value="one-time">One Time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Category</label>
                      <select
                        value={source.category}
                        onChange={(e) => updateSource(source.id, { category: e.target.value as IncomeSource['category'] })}
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                      >
                        <option value="salary">Salary/Wages</option>
                        <option value="freelance">Freelance</option>
                        <option value="business">Business</option>
                        <option value="investment">Investment</option>
                        <option value="passive">Passive Income</option>
                        <option value="benefits">Benefits/Assistance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Next Pay Date</label>
                      <input
                        type="date"
                        value={source.nextPayDate || ''}
                        onChange={(e) => updateSource(source.id, { nextPayDate: e.target.value })}
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-emerald-400 block mb-1">Notes</label>
                    <textarea
                      value={source.notes}
                      onChange={(e) => updateSource(source.id, { notes: e.target.value })}
                      placeholder="Additional details..."
                      className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white text-sm"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => addEntry(source.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Log Income
                    </button>
                    <button
                      onClick={() => updateSource(source.id, { isActive: !source.isActive })}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        source.isActive
                          ? 'bg-gray-500/30 text-gray-300 border border-gray-500/50'
                          : 'bg-green-500/30 text-green-300 border border-green-500/50'
                      }`}
                    >
                      {source.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteSource(source.id)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sources.length === 0 && (
            <div className="bg-emerald-900/20 p-12 rounded-xl border border-emerald-500/30 text-center">
              <DollarSign className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Income Sources Yet</h3>
              <p className="text-emerald-400">
                Add your income sources to start tracking your earnings.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Entries Tab */}
      {activeTab === 'entries' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => addEntry()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Income Entry
            </button>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-blue-900/30 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {entries
            .filter(e => e.date.startsWith(selectedMonth))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(entry => (
              <div key={entry.id} className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                      <input
                        type="text"
                        value={entry.sourceName}
                        onChange={(e) => updateEntry(entry.id, { sourceName: e.target.value })}
                        placeholder="Source name..."
                        className="text-lg font-bold bg-transparent border-b-2 border-blue-500/30 focus:border-blue-500 outline-none text-white flex-1"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(entry.category)}`}>
                        {entry.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-blue-400 block mb-1">Amount ($)</label>
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={(e) => updateEntry(entry.id, { amount: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-blue-900/30 border border-blue-500/30 rounded px-3 py-2 text-white text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-blue-400 block mb-1">Date</label>
                        <input
                          type="date"
                          value={entry.date}
                          onChange={(e) => updateEntry(entry.id, { date: e.target.value })}
                          className="w-full bg-blue-900/30 border border-blue-500/30 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 rounded text-red-300 hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>

                    {entry.notes && (
                      <div className="mt-3 bg-blue-900/30 p-3 rounded border border-blue-500/30">
                        <p className="text-sm text-blue-300">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {entries.filter(e => e.date.startsWith(selectedMonth)).length === 0 && (
            <div className="bg-blue-900/20 p-12 rounded-xl border border-blue-500/30 text-center">
              <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Entries for {selectedMonth}</h3>
              <p className="text-blue-400">
                Add income entries to track your earnings this month.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6" />
              Income by Category ({selectedMonth})
            </h3>

            {Object.keys(categoryBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage = (amount / monthlyTotal) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(category)}`}>
                            {category}
                          </span>
                          <span className="text-white font-semibold">
                            ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-3 bg-purple-900/30 rounded-full overflow-hidden border border-purple-500/30">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-purple-400 text-center py-8">No income data for this month</p>
            )}
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-purple-900/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white"
          />
        </div>
      )}
    </div>
  );
};

export default IncomeTracker;
