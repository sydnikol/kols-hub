import React, { useState, useEffect } from 'react';
import { PiggyBank, Target, TrendingUp, Calendar, Plus, Trash2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: 'emergency' | 'vacation' | 'purchase' | 'education' | 'retirement' | 'home' | 'investment' | 'other';
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  monthlyContribution?: number;
  autoSave: boolean;
  notes: string;
}

interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  source: 'income' | 'bonus' | 'gift' | 'refund' | 'other';
  notes: string;
}

interface SavingsStrategy {
  id: string;
  name: string;
  description: string;
  type: '50-30-20' | 'zero-based' | 'envelope' | 'automatic' | 'custom';
  savingsRate: number; // percentage
  active: boolean;
}

const SavingsGoalsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'contributions' | 'strategies' | 'stats'>('goals');
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [contributions, setContributions] = useState<SavingsContribution[]>([]);
  const [strategies, setStrategies] = useState<SavingsStrategy[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    const savedContributions = localStorage.getItem('savingsContributions');
    if (savedContributions) setContributions(JSON.parse(savedContributions));
    const savedStrategies = localStorage.getItem('savingsStrategies');
    if (savedStrategies) setStrategies(JSON.parse(savedStrategies));
  }, []);

  useEffect(() => { localStorage.setItem('savingsGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('savingsContributions', JSON.stringify(contributions)); }, [contributions]);
  useEffect(() => { localStorage.setItem('savingsStrategies', JSON.stringify(strategies)); }, [strategies]);

  const addGoal = () => {
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      category: 'other',
      priority: 'medium',
      autoSave: false,
      notes: '',
    };
    setGoals([...goals, newGoal]);
    toast.success('Savings goal added');
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const addContribution = () => {
    const newContribution: SavingsContribution = {
      id: Date.now().toString(),
      goalId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      source: 'income',
      notes: '',
    };
    setContributions([...contributions, newContribution]);
    toast.success('Contribution added');
  };

  const updateContribution = (id: string, updates: Partial<SavingsContribution>) => {
    setContributions(contributions.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Contribution updated');
  };

  const deleteContribution = (id: string) => {
    setContributions(contributions.filter(c => c.id !== id));
    toast.success('Contribution deleted');
  };

  const addStrategy = () => {
    const newStrategy: SavingsStrategy = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'custom',
      savingsRate: 20,
      active: false,
    };
    setStrategies([...strategies, newStrategy]);
    toast.success('Strategy added');
  };

  const updateStrategy = (id: string, updates: Partial<SavingsStrategy>) => {
    setStrategies(strategies.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Strategy updated');
  };

  const deleteStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
    toast.success('Strategy deleted');
  };

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 pb-20">
      <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <PiggyBank className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Savings Goals Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalTargetAmount.toLocaleString()}</div>
            <div className="text-xs opacity-90">Target</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalCurrentAmount.toLocaleString()}</div>
            <div className="text-xs opacity-90">Saved</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{overallProgress.toFixed(0)}%</div>
            <div className="text-xs opacity-90">Progress</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <PiggyBank className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{goals.length}</div>
            <div className="text-xs opacity-90">Goals</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'contributions', label: 'Contributions', icon: DollarSign },
            { id: 'strategies', label: 'Strategies', icon: TrendingUp },
            { id: 'stats', label: 'Stats', icon: Calendar },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <button onClick={addGoal} className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Savings Goal</span>
            </button>
            {goals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <PiggyBank className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No savings goals yet. Start building your future!</p>
              </div>
            ) : (
              goals.map(goal => {
                const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                const remaining = goal.targetAmount - goal.currentAmount;
                return (
                  <div key={goal.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-teal-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-2">
                        <input type="text" value={goal.name} onChange={(e) => updateGoal(goal.id, { name: e.target.value })} placeholder="Savings goal name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-teal-500 outline-none w-full mb-2" />
                        <div className="text-sm text-gray-600">
                          ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()} • ${remaining.toLocaleString()} remaining
                        </div>
                      </div>
                      <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-600 to-green-600 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select value={goal.category} onChange={(e) => updateGoal(goal.id, { category: e.target.value as SavingsGoal['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none">
                        <option value="emergency">Emergency Fund</option>
                        <option value="vacation">Vacation</option>
                        <option value="purchase">Major Purchase</option>
                        <option value="education">Education</option>
                        <option value="retirement">Retirement</option>
                        <option value="home">Home/Property</option>
                        <option value="investment">Investment</option>
                        <option value="other">Other</option>
                      </select>
                      <select value={goal.priority} onChange={(e) => updateGoal(goal.id, { priority: e.target.value as SavingsGoal['priority'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="critical">Critical Priority</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Target Amount</label>
                        <input type="number" min="0" step="0.01" value={goal.targetAmount} onChange={(e) => updateGoal(goal.id, { targetAmount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Current Amount</label>
                        <input type="number" min="0" step="0.01" value={goal.currentAmount} onChange={(e) => updateGoal(goal.id, { currentAmount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Monthly Contribution</label>
                        <input type="number" min="0" step="0.01" value={goal.monthlyContribution || ''} onChange={(e) => updateGoal(goal.id, { monthlyContribution: parseFloat(e.target.value) || undefined })} placeholder="Optional" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Deadline</label>
                        <input type="date" value={goal.deadline || ''} onChange={(e) => updateGoal(goal.id, { deadline: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none w-full" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <input type="checkbox" checked={goal.autoSave} onChange={(e) => updateGoal(goal.id, { autoSave: e.target.checked })} className="w-4 h-4" />
                      <label className="text-sm text-gray-600">Auto-save enabled</label>
                    </div>
                    <textarea value={goal.notes} onChange={(e) => updateGoal(goal.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none" rows={2} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="space-y-4">
            <button onClick={addContribution} className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Contribution</span>
            </button>
            {contributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(contribution => (
              <div key={contribution.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={contribution.date} onChange={(e) => updateContribution(contribution.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-teal-500 outline-none w-full mb-1" />
                  </div>
                  <button onClick={() => deleteContribution(contribution.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Amount</label>
                    <input type="number" min="0" step="0.01" value={contribution.amount} onChange={(e) => updateContribution(contribution.id, { amount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Source</label>
                    <select value={contribution.source} onChange={(e) => updateContribution(contribution.id, { source: e.target.value as SavingsContribution['source'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none w-full">
                      <option value="income">Income</option>
                      <option value="bonus">Bonus</option>
                      <option value="gift">Gift</option>
                      <option value="refund">Refund</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <textarea value={contribution.notes} onChange={(e) => updateContribution(contribution.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'strategies' && (
          <div className="space-y-4">
            <button onClick={addStrategy} className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Strategy</span>
            </button>
            {strategies.map(strategy => (
              <div key={strategy.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${strategy.active ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={strategy.name} onChange={(e) => updateStrategy(strategy.id, { name: e.target.value })} placeholder="Strategy name..." className="flex-1 mr-2 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-teal-500 outline-none" />
                  <button onClick={() => deleteStrategy(strategy.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <textarea value={strategy.description} onChange={(e) => updateStrategy(strategy.id, { description: e.target.value })} placeholder="Strategy description..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none mb-3" rows={2} />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={strategy.type} onChange={(e) => updateStrategy(strategy.id, { type: e.target.value as SavingsStrategy['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none">
                    <option value="50-30-20">50-30-20 Rule</option>
                    <option value="zero-based">Zero-Based Budget</option>
                    <option value="envelope">Envelope Method</option>
                    <option value="automatic">Automatic Savings</option>
                    <option value="custom">Custom</option>
                  </select>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Savings Rate (%)</label>
                    <input type="number" min="0" max="100" value={strategy.savingsRate} onChange={(e) => updateStrategy(strategy.id, { savingsRate: parseInt(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-teal-500 outline-none w-full" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={strategy.active} onChange={(e) => updateStrategy(strategy.id, { active: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm text-gray-600">Active strategy</label>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-600">Savings Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Target:</span>
                  <span className="font-semibold">${totalTargetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Saved:</span>
                  <span className="font-semibold">${totalCurrentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-semibold">${(totalTargetAmount - totalCurrentAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Progress:</span>
                  <span className="font-semibold">{overallProgress.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Contributions:</span>
                  <span className="font-semibold">${totalContributions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Goals:</span>
                  <span className="font-semibold">{goals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Strategies:</span>
                  <span className="font-semibold">{strategies.filter(s => s.active).length} active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsGoalsHubPage;
