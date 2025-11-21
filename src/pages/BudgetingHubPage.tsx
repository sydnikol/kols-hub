import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, TrendingUp, PieChart, Plus, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface Budget {
  id: string;
  name: string;
  category: 'income' | 'housing' | 'transportation' | 'food' | 'utilities' | 'healthcare' | 'personal' | 'debt' | 'savings' | 'entertainment' | 'other';
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  recurring: boolean;
  notes: string;
}

interface Transaction {
  id: string;
  budgetName: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

interface FinancialGoal {
  id: string;
  goal: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

const BudgetingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'budgets' | 'transactions' | 'goals' | 'stats'>('budgets');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    const savedTransactions = localStorage.getItem('budgetTransactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    const savedGoals = localStorage.getItem('financialGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => { localStorage.setItem('budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('budgetTransactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('financialGoals', JSON.stringify(goals)); }, [goals]);

  const addBudget = () => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      name: '',
      category: 'personal',
      amount: 0,
      spent: 0,
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      recurring: true,
      notes: '',
    };
    setBudgets([...budgets, newBudget]);
    toast.success('Budget added');
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...updates } : b));
    toast.success('Budget updated');
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
    toast.success('Budget deleted');
  };

  const addTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      budgetName: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      type: 'expense',
    };
    setTransactions([...transactions, newTransaction]);
    toast.success('Transaction added');
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Transaction updated');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success('Transaction deleted');
  };

  const addGoal = () => {
    const newGoal: FinancialGoal = {
      id: Date.now().toString(),
      goal: '',
      targetAmount: 0,
      currentAmount: 0,
      priority: 'medium',
      notes: '',
    };
    setGoals([...goals, newGoal]);
    toast.success('Financial goal added');
  };

  const updateGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Budgeting Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <PieChart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalBudgeted.toLocaleString()}</div>
            <div className="text-xs opacity-90">Budgeted</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingDown className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalSpent.toLocaleString()}</div>
            <div className="text-xs opacity-90">Spent</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalIncome.toLocaleString()}</div>
            <div className="text-xs opacity-90">Income</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{budgets.length}</div>
            <div className="text-xs opacity-90">Budgets</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'budgets', label: 'Budgets', icon: PieChart },
            { id: 'transactions', label: 'Transactions', icon: DollarSign },
            { id: 'goals', label: 'Goals', icon: TrendingUp },
            { id: 'stats', label: 'Stats', icon: Calendar },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'budgets' && (
          <div className="space-y-4">
            <button onClick={addBudget} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Budget</span>
            </button>
            {budgets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No budgets yet. Start managing your finances!</p>
              </div>
            ) : (
              budgets.map(budget => {
                const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                const isOverBudget = percentage > 100;
                return (
                  <div key={budget.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${isOverBudget ? 'border-red-500' : percentage > 80 ? 'border-orange-500' : 'border-green-500'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-2">
                        <input type="text" value={budget.name} onChange={(e) => updateBudget(budget.id, { name: e.target.value })} placeholder="Budget name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full mb-2" />
                        <div className="text-sm text-gray-600">
                          ${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()} ({percentage.toFixed(0)}%)
                        </div>
                      </div>
                      <button onClick={() => deleteBudget(budget.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div className={`h-full transition-all ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, percentage)}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select value={budget.category} onChange={(e) => updateBudget(budget.id, { category: e.target.value as Budget['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                        <option value="income">Income</option>
                        <option value="housing">Housing</option>
                        <option value="transportation">Transportation</option>
                        <option value="food">Food</option>
                        <option value="utilities">Utilities</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="personal">Personal</option>
                        <option value="debt">Debt</option>
                        <option value="savings">Savings</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="other">Other</option>
                      </select>
                      <select value={budget.period} onChange={(e) => updateBudget(budget.id, { period: e.target.value as Budget['period'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Budget Amount</label>
                        <input type="number" min="0" step="0.01" value={budget.amount} onChange={(e) => updateBudget(budget.id, { amount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Spent</label>
                        <input type="number" min="0" step="0.01" value={budget.spent} onChange={(e) => updateBudget(budget.id, { spent: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none w-full" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <input type="checkbox" checked={budget.recurring} onChange={(e) => updateBudget(budget.id, { recurring: e.target.checked })} className="w-4 h-4" />
                      <label className="text-sm text-gray-600">Recurring budget</label>
                    </div>
                    <textarea value={budget.notes} onChange={(e) => updateBudget(budget.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <button onClick={addTransaction} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
            {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(transaction => (
              <div key={transaction.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${transaction.type === 'income' ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={transaction.date} onChange={(e) => updateTransaction(transaction.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none w-full mb-1" />
                    <input type="text" value={transaction.description} onChange={(e) => updateTransaction(transaction.id, { description: e.target.value })} placeholder="Description..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteTransaction(transaction.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={transaction.type} onChange={(e) => updateTransaction(transaction.id, { type: e.target.value as Transaction['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <div>
                    <input type="number" min="0" step="0.01" value={transaction.amount} onChange={(e) => updateTransaction(transaction.id, { amount: parseFloat(e.target.value) || 0 })} placeholder="Amount" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none w-full" />
                  </div>
                </div>
                <input type="text" value={transaction.category} onChange={(e) => updateTransaction(transaction.id, { category: e.target.value })} placeholder="Category..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none w-full" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            <button onClick={addGoal} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Financial Goal</span>
            </button>
            {goals.map(goal => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={goal.goal} onChange={(e) => updateGoal(goal.id, { goal: e.target.value })} placeholder="Financial goal..." className="flex-1 mr-2 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none" />
                    <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Target Amount</label>
                      <input type="number" min="0" step="0.01" value={goal.targetAmount} onChange={(e) => updateGoal(goal.id, { targetAmount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Current Amount</label>
                      <input type="number" min="0" step="0.01" value={goal.currentAmount} onChange={(e) => updateGoal(goal.id, { currentAmount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none w-full" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-green-600 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>
                  </div>
                  <select value={goal.priority} onChange={(e) => updateGoal(goal.id, { priority: e.target.value as FinancialGoal['priority'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none w-full mb-3">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Priority</option>
                  </select>
                  <textarea value={goal.notes} onChange={(e) => updateGoal(goal.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none" rows={2} />
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Budgeting Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budgeted:</span>
                  <span className="font-semibold">${totalBudgeted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold">${totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-semibold">${(totalBudgeted - totalSpent).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Income:</span>
                  <span className="font-semibold text-green-600">${totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expenses:</span>
                  <span className="font-semibold text-red-600">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net:</span>
                  <span className={`font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>${(totalIncome - totalExpenses).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Budgets:</span>
                  <span className="font-semibold">{budgets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions:</span>
                  <span className="font-semibold">{transactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Financial Goals:</span>
                  <span className="font-semibold">{goals.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetingHubPage;
