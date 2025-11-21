import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, DollarSign, Calendar, Plus, Trash2, Edit2, Check, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  contributions: Contribution[];
  createdAt: number;
}

interface Contribution {
  id: string;
  amount: number;
  date: string;
  note: string;
  timestamp: number;
}

const categories = [
  'Emergency Fund',
  'Vacation',
  'Home/Rent',
  'Car',
  'Education',
  'Healthcare',
  'Retirement',
  'Gift',
  'Technology',
  'Hobby',
  'Other',
];

const SavingsGoalsTracker: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showContributionForm, setShowContributionForm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: 'Emergency Fund',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
  });

  const [contributionData, setContributionData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  // Load goals
  useEffect(() => {
    const saved = localStorage.getItem('savingsGoals');
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  // Save goals
  const saveGoals = (updated: SavingsGoal[]) => {
    setGoals(updated);
    localStorage.setItem('savingsGoals', JSON.stringify(updated));
  };

  // Add goal
  const handleAddGoal = () => {
    if (!formData.name || !formData.targetAmount) {
      toast.error('Name and target amount are required');
      return;
    }

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      category: formData.category,
      priority: formData.priority,
      notes: formData.notes,
      contributions: [],
      createdAt: Date.now(),
    };

    // Add initial contribution if currentAmount > 0
    if (newGoal.currentAmount > 0) {
      newGoal.contributions.push({
        id: Date.now().toString(),
        amount: newGoal.currentAmount,
        date: new Date().toISOString().split('T')[0],
        note: 'Initial balance',
        timestamp: Date.now(),
      });
    }

    saveGoals([...goals, newGoal]);
    resetForm();
    toast.success(`${newGoal.name} goal added!`);
  };

  // Update goal
  const handleUpdateGoal = () => {
    if (!editingId || !formData.name || !formData.targetAmount) {
      toast.error('Name and target amount are required');
      return;
    }

    const updated = goals.map(goal =>
      goal.id === editingId
        ? {
            ...goal,
            name: formData.name,
            targetAmount: parseFloat(formData.targetAmount),
            deadline: formData.deadline,
            category: formData.category,
            priority: formData.priority,
            notes: formData.notes,
          }
        : goal
    );

    saveGoals(updated);
    resetForm();
    toast.success('Goal updated!');
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    if (confirm('Delete this savings goal? All contribution history will be lost.')) {
      saveGoals(goals.filter(g => g.id !== id));
      toast.success('Goal deleted');
    }
  };

  // Add contribution
  const handleAddContribution = (goalId: string) => {
    if (!contributionData.amount) {
      toast.error('Contribution amount is required');
      return;
    }

    const amount = parseFloat(contributionData.amount);
    if (amount <= 0) {
      toast.error('Contribution must be greater than 0');
      return;
    }

    const contribution: Contribution = {
      id: Date.now().toString(),
      amount,
      date: contributionData.date,
      note: contributionData.note,
      timestamp: Date.now(),
    };

    const updated = goals.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            currentAmount: goal.currentAmount + amount,
            contributions: [contribution, ...goal.contributions],
          }
        : goal
    );

    saveGoals(updated);
    setContributionData({ amount: '', date: new Date().toISOString().split('T')[0], note: '' });
    setShowContributionForm(null);
    toast.success(`$${amount.toFixed(2)} added!`);
  };

  // Delete contribution
  const handleDeleteContribution = (goalId: string, contributionId: string) => {
    if (confirm('Delete this contribution?')) {
      const updated = goals.map(goal => {
        if (goal.id === goalId) {
          const contribution = goal.contributions.find(c => c.id === contributionId);
          if (contribution) {
            return {
              ...goal,
              currentAmount: goal.currentAmount - contribution.amount,
              contributions: goal.contributions.filter(c => c.id !== contributionId),
            };
          }
        }
        return goal;
      });

      saveGoals(updated);
      toast.success('Contribution deleted');
    }
  };

  // Start editing
  const startEdit = (goal: SavingsGoal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category,
      priority: goal.priority,
      notes: goal.notes,
    });
    setEditingId(goal.id);
    setShowAddForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
      category: 'Emergency Fund',
      priority: 'medium',
      notes: '',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  // Calculate progress
  const getProgress = (goal: SavingsGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  // Get days remaining
  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Total saved
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Export data
  const handleExport = () => {
    const csv = [
      ['Goal', 'Category', 'Target', 'Current', 'Progress %', 'Deadline', 'Priority', 'Notes'],
      ...goals.map(g => [
        g.name,
        g.category,
        g.targetAmount.toString(),
        g.currentAmount.toString(),
        getProgress(g).toFixed(1),
        g.deadline,
        g.priority,
        g.notes,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savings-goals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Exported savings goals!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Savings Goals Tracker</h2>
          <p className="text-emerald-400">Track your financial goals and celebrate progress</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
        >
          Export CSV
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-6 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <h3 className="text-emerald-300 font-semibold">Total Saved</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalSaved.toFixed(2)}</p>
          <p className="text-emerald-400 text-sm mt-1">Across {goals.length} goals</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-400" />
            <h3 className="text-blue-300 font-semibold">Total Target</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalTarget.toFixed(2)}</p>
          <p className="text-blue-400 text-sm mt-1">Combined goals</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h3 className="text-purple-300 font-semibold">Overall Progress</h3>
          </div>
          <p className="text-3xl font-bold text-white">{overallProgress.toFixed(1)}%</p>
          <p className="text-purple-400 text-sm mt-1">
            ${(totalTarget - totalSaved).toFixed(2)} remaining
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-semibold hover:from-emerald-500/30 hover:to-green-500/30 transition-all"
      >
        {showAddForm ? (editingId ? 'Cancel Edit' : 'Cancel') : '+ Add Savings Goal'}
      </button>

      {showAddForm && (
        <div className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/30 space-y-4">
          <h3 className="text-xl font-bold text-white">
            {editingId ? 'Edit Savings Goal' : 'New Savings Goal'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Goal Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Emergency fund, vacation, new laptop..."
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Target Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="1000.00"
              />
            </div>

            {!editingId && (
              <div>
                <label className="block text-emerald-300 font-semibold mb-2">Starting Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>
            )}

            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Deadline (Optional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-semibold mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-emerald-300 font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500 h-20"
              placeholder="Why is this goal important? Any specific plans?"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={editingId ? handleUpdateGoal : handleAddGoal}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500/30 to-green-500/30 border border-emerald-500/50 rounded-xl text-white font-bold hover:from-emerald-500/40 hover:to-green-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {editingId ? 'Update' : 'Add'} Goal
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-emerald-900/10 p-12 rounded-xl border border-emerald-500/20 text-center">
          <Target className="w-16 h-16 text-emerald-400/50 mx-auto mb-4" />
          <p className="text-emerald-400">No savings goals yet. Add your first goal to start saving!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const progress = getProgress(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isComplete = progress >= 100;
            const isOverdue = daysRemaining !== null && daysRemaining < 0 && !isComplete;

            return (
              <div
                key={goal.id}
                className={`bg-emerald-900/20 rounded-xl border transition-all ${
                  isComplete
                    ? 'border-green-500/50 bg-green-900/10'
                    : isOverdue
                    ? 'border-red-500/50 bg-red-900/10'
                    : 'border-emerald-500/30 hover:border-emerald-500/50'
                }`}
              >
                {/* Goal Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                        {isComplete && <Sparkles className="w-5 h-5 text-cyan-400" />}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          goal.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          goal.priority === 'medium' ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {goal.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <p className="text-emerald-400 text-sm">{goal.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(goal)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-300 font-semibold">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </span>
                      <span className={`font-bold ${
                        isComplete ? 'text-green-400' :
                        progress >= 75 ? 'text-emerald-400' :
                        progress >= 50 ? 'text-cyan-400' :
                        'text-blue-400'
                      }`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          'bg-gradient-to-r from-emerald-500 to-green-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-emerald-500/70 text-xs mb-1">Remaining</p>
                      <p className="text-white font-bold">
                        ${(goal.targetAmount - goal.currentAmount).toFixed(2)}
                      </p>
                    </div>

                    {goal.deadline && (
                      <div>
                        <p className="text-emerald-500/70 text-xs mb-1">Deadline</p>
                        <p className="text-white font-semibold">
                          {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                        {daysRemaining !== null && (
                          <p className={`text-xs ${
                            isOverdue ? 'text-red-400' :
                            daysRemaining <= 30 ? 'text-orange-400' :
                            'text-emerald-400/70'
                          }`}>
                            {isOverdue ? `${Math.abs(daysRemaining)} days overdue` :
                             daysRemaining === 0 ? 'Today!' :
                             `${daysRemaining} days left`}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="text-emerald-500/70 text-xs mb-1">Contributions</p>
                      <p className="text-white font-bold">{goal.contributions.length}</p>
                    </div>
                  </div>

                  {goal.notes && (
                    <div className="mb-4 p-3 bg-black/30 rounded-lg">
                      <p className="text-emerald-300 text-sm">{goal.notes}</p>
                    </div>
                  )}

                  {/* Add Contribution Button */}
                  {!isComplete && (
                    <button
                      onClick={() => setShowContributionForm(showContributionForm === goal.id ? null : goal.id)}
                      className="w-full px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                      {showContributionForm === goal.id ? 'Cancel' : 'Add Contribution'}
                    </button>
                  )}

                  {/* Contribution Form */}
                  {showContributionForm === goal.id && (
                    <div className="mt-4 p-4 bg-black/30 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-emerald-300 text-sm font-semibold mb-1">Amount ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={contributionData.amount}
                            onChange={(e) => setContributionData({ ...contributionData, amount: e.target.value })}
                            className="w-full px-3 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                            placeholder="50.00"
                          />
                        </div>
                        <div>
                          <label className="block text-emerald-300 text-sm font-semibold mb-1">Date</label>
                          <input
                            type="date"
                            value={contributionData.date}
                            onChange={(e) => setContributionData({ ...contributionData, date: e.target.value })}
                            className="w-full px-3 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-emerald-300 text-sm font-semibold mb-1">Note (Optional)</label>
                        <input
                          type="text"
                          value={contributionData.note}
                          onChange={(e) => setContributionData({ ...contributionData, note: e.target.value })}
                          className="w-full px-3 py-2 bg-black/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                          placeholder="Birthday money, tax refund, etc."
                        />
                      </div>
                      <button
                        onClick={() => handleAddContribution(goal.id)}
                        className="w-full px-4 py-2 bg-emerald-500/30 text-white rounded-lg border border-emerald-500/50 hover:bg-emerald-500/40 transition-all font-semibold"
                      >
                        Add Contribution
                      </button>
                    </div>
                  )}
                </div>

                {/* Contribution History */}
                {goal.contributions.length > 0 && (
                  <div className="border-t border-emerald-500/30 p-6">
                    <h4 className="text-emerald-300 font-semibold mb-3">Contribution History</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {goal.contributions.map(contribution => (
                        <div
                          key={contribution.id}
                          className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-white font-semibold">+${contribution.amount.toFixed(2)}</p>
                            {contribution.note && (
                              <p className="text-emerald-400/70 text-sm">{contribution.note}</p>
                            )}
                            <p className="text-emerald-500/70 text-xs">
                              {new Date(contribution.date).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteContribution(goal.id, contribution.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsTracker;
