import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, AlertCircle, Lightbulb } from 'lucide-react';

interface BudgetItem {
  id: string;
  category: 'income' | 'expense' | 'bill' | 'creative';
  name: string;
  amount: number;
  frequency: 'once' | 'weekly' | 'monthly' | 'yearly';
  dueDate?: Date;
  autoPay?: boolean;
  isPaid?: boolean;
}

const PASSIVE_INCOME_IDEAS = [
  { category: 'Digital Products', ideas: ['Printable planners', 'Digital art templates', 'Notion templates', 'Accessibility guides', 'Zine PDFs'] },
  { category: 'Content Creation', ideas: ['Poetry ebooks', 'Photography prints', 'Tutorial videos', 'Skill-sharing courses', 'Blog with ads'] },
  { category: 'Print-on-Demand', ideas: ['T-shirt designs', 'Stickers', 'Pins', 'Tote bags', 'Posters'] },
  { category: 'Affiliate/Referral', ideas: ['Product reviews', 'Tool recommendations', 'Resource lists', 'Affiliate blogs', 'Email newsletters'] },
  { category: 'Licensing', ideas: ['Stock photos', 'Music/beats', 'Artwork licensing', 'Pattern designs', 'Font creation'] },
  { category: 'Low-Energy', ideas: ['Curated resource lists', 'Template packs', 'Audio meditations', 'Playlist curation', 'Micro-consulting'] }
];

export const BudgetManager: React.FC = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [viewMode, setViewMode] = useState<'budget' | 'bills' | 'passive' | 'analysis'>('budget');
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('budget', 'readonly');
      const items = await tx.objectStore('budget').getAll();
      setBudgetItems(items);
    } catch (error) {
      console.log('No budget data yet');
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KolHubDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('budget')) {
          db.createObjectStore('budget', { keyPath: 'id' });
        }
      };
    });
  };

  const addBudgetItem = async (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: `budget_${Date.now()}`
    };

    const db = await openDB();
    const tx = db.transaction('budget', 'readwrite');
    await tx.objectStore('budget').add(newItem);
    setBudgetItems([...budgetItems, newItem]);
    setShowAddItem(false);
  };

  const togglePaid = async (id: string) => {
    const db = await openDB();
    const tx = db.transaction('budget', 'readwrite');
    const store = tx.objectStore('budget');
    const item = await store.get(id);
    item.isPaid = !item.isPaid;
    await store.put(item);
    setBudgetItems(budgetItems.map(i => i.id === id ? item : i));
  };

  const calculateMonthlyTotals = () => {
    let income = 0;
    let expenses = 0;
    let bills = 0;

    budgetItems.forEach(item => {
      let monthlyAmount = item.amount;
      if (item.frequency === 'weekly') monthlyAmount *= 4;
      if (item.frequency === 'yearly') monthlyAmount /= 12;

      if (item.category === 'income') income += monthlyAmount;
      else if (item.category === 'expense') expenses += monthlyAmount;
      else if (item.category === 'bill') bills += monthlyAmount;
    });

    return { income, expenses, bills, total: income - expenses - bills };
  };

  const getUpcomingBills = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return budgetItems.filter(item => 
      item.category === 'bill' && 
      item.dueDate && 
      new Date(item.dueDate) <= nextWeek &&
      !item.isPaid
    ).sort((a, b) => 
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    );
  };

  const totals = calculateMonthlyTotals();
  const upcomingBills = getUpcomingBills();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 mb-2">
            💰 Budget & Finance Manager
          </h1>
          <p className="text-purple-200">Track income, expenses, bills, and passive income ideas</p>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm p-6 rounded-lg border border-green-500/30">
            <div className="text-green-300 text-sm mb-2">Monthly Income</div>
            <div className="text-3xl font-bold text-green-100">${totals.income.toFixed(2)}</div>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm p-6 rounded-lg border border-red-500/30">
            <div className="text-red-300 text-sm mb-2">Expenses</div>
            <div className="text-3xl font-bold text-red-100">${totals.expenses.toFixed(2)}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm p-6 rounded-lg border border-orange-500/30">
            <div className="text-orange-300 text-sm mb-2">Bills</div>
            <div className="text-3xl font-bold text-orange-100">${totals.bills.toFixed(2)}</div>
          </div>
          <div className={`bg-gradient-to-br backdrop-blur-sm p-6 rounded-lg border ${
            totals.total >= 0 
              ? 'from-purple-600/20 to-purple-800/20 border-purple-500/30'
              : 'from-red-600/20 to-red-800/20 border-red-500/30'
          }`}>
            <div className={totals.total >= 0 ? 'text-purple-300' : 'text-red-300'} className="text-sm mb-2">Net Balance</div>
            <div className={`text-3xl font-bold ${totals.total >= 0 ? 'text-purple-100' : 'text-red-100'}`}>
              ${Math.abs(totals.total).toFixed(2)}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('budget')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'budget' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            💵 Budget
          </button>
          <button
            onClick={() => setViewMode('bills')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'bills' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📅 Bills & Auto-Pay
          </button>
          <button
            onClick={() => setViewMode('passive')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'passive' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            💡 Passive Income Ideas
          </button>
          <button
            onClick={() => setViewMode('analysis')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'analysis' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📊 Analysis
          </button>
        </div>

        {/* Budget View */}
        {viewMode === 'budget' && (
          <div>
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-purple-100">Income & Expenses</h2>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  ➕ Add Item
                </button>
              </div>
            </div>

            {/* Income Items */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-green-300 mb-4">💚 Income</h3>
              <div className="space-y-3">
                {budgetItems.filter(i => i.category === 'income').map(item => (
                  <div key={item.id} className="bg-green-900/20 rounded-lg p-4 border border-green-500/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-green-100">{item.name}</div>
                        <div className="text-sm text-green-300">{item.frequency}</div>
                      </div>
                      <div className="text-xl font-bold text-green-100">${item.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Items */}
            <div>
              <h3 className="text-lg font-bold text-red-300 mb-4">💸 Expenses</h3>
              <div className="space-y-3">
                {budgetItems.filter(i => i.category === 'expense').map(item => (
                  <div key={item.id} className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-red-100">{item.name}</div>
                        <div className="text-sm text-red-300">{item.frequency}</div>
                      </div>
                      <div className="text-xl font-bold text-red-100">${item.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bills View */}
        {viewMode === 'bills' && (
          <div>
            {/* Upcoming Bills Alert */}
            {upcomingBills.length > 0 && (
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-orange-400" size={24} />
                  <h3 className="text-xl font-bold text-orange-200">Upcoming Bills (Next 7 Days)</h3>
                </div>
                <div className="space-y-3">
                  {upcomingBills.map(bill => (
                    <div key={bill.id} className="bg-orange-900/30 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-orange-100">{bill.name}</div>
                        <div className="text-sm text-orange-300">
                          Due: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
                          {bill.autoPay && ' • Auto-Pay Enabled'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xl font-bold text-orange-100">${bill.amount.toFixed(2)}</div>
                        <button
                          onClick={() => togglePaid(bill.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Mark Paid
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Bills */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-100 mb-6">All Bills</h2>
              <div className="space-y-3">
                {budgetItems.filter(i => i.category === 'bill').map(bill => (
                  <div key={bill.id} className={`rounded-lg p-4 border ${
                    bill.isPaid
                      ? 'bg-green-900/20 border-green-500/20'
                      : 'bg-purple-900/20 border-purple-500/20'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-purple-100 mb-1">{bill.name}</div>
                        <div className="flex gap-4 text-sm text-purple-300">
                          <span>${bill.amount.toFixed(2)}</span>
                          <span>{bill.frequency}</span>
                          {bill.dueDate && <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>}
                          {bill.autoPay && <span className="text-green-400">🤖 Auto-Pay</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => togglePaid(bill.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          bill.isPaid
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {bill.isPaid ? 'Unpaid' : '✓ Paid'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Passive Income Ideas View */}
        {viewMode === 'passive' && (
          <div className="space-y-6">
            {PASSIVE_INCOME_IDEAS.map((category, idx) => (
              <div key={idx} className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-purple-100 mb-4">
                  <Lightbulb className="inline mr-2" />
                  {category.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.ideas.map((idea, i) => (
                    <div key={i} className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/50 transition-colors">
                      <div className="text-purple-200">{idea}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-100 mb-4">💡 Getting Started Tips</h3>
              <ul className="space-y-2 text-purple-200">
                <li>✓ Start with what you already do - monetize existing skills</li>
                <li>✓ Choose low-energy options that respect your spoons</li>
                <li>✓ Build once, sell many times (digital products)</li>
                <li>✓ Use templates and automation to reduce workload</li>
                <li>✓ Start small - one idea at a time</li>
                <li>✓ Track which income streams work best for you</li>
              </ul>
            </div>
          </div>
        )}

        {/* Analysis View */}
        {viewMode === 'analysis' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">
              <TrendingUp className="inline mr-2" />
              Financial Analysis
            </h2>

            <div className="space-y-6">
              {/* Spending Breakdown */}
              <div>
                <h3 className="text-xl font-bold text-purple-100 mb-4">Monthly Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-200">Income</span>
                      <span className="text-green-300 font-bold">${totals.income.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-200">Expenses</span>
                      <span className="text-red-300 font-bold">${totals.expenses.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-3">
                      <div className="bg-red-600 h-3 rounded-full" style={{width: `${(totals.expenses / totals.income) * 100}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-200">Bills</span>
                      <span className="text-orange-300 font-bold">${totals.bills.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-3">
                      <div className="bg-orange-600 h-3 rounded-full" style={{width: `${(totals.bills / totals.income) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-500/20">
                <h4 className="font-bold text-purple-100 mb-3">📊 Insights</h4>
                <ul className="space-y-2 text-purple-200 text-sm">
                  {totals.total > 0 && (
                    <li className="text-green-300">✓ You're saving ${totals.total.toFixed(2)}/month - great job!</li>
                  )}
                  {totals.total < 0 && (
                    <li className="text-red-300">⚠️ Spending ${Math.abs(totals.total).toFixed(2)} more than income</li>
                  )}
                  {totals.bills > totals.income * 0.5 && (
                    <li className="text-orange-300">⚠️ Bills are over 50% of income - consider ways to reduce</li>
                  )}
                  {budgetItems.filter(i => i.category === 'bill' && i.autoPay).length > 0 && (
                    <li className="text-blue-300">✓ {budgetItems.filter(i => i.autoPay).length} bills on auto-pay</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Form */}
        {showAddItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-purple-950 border border-purple-500/30 rounded-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-purple-100 mb-6">Add Budget Item</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addBudgetItem({
                  category: formData.get('category') as any,
                  name: formData.get('name') as string,
                  amount: Number(formData.get('amount')),
                  frequency: formData.get('frequency') as any,
                  dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : undefined,
                  autoPay: formData.get('autoPay') === 'on'
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-purple-200 mb-2">Category</label>
                    <select name="category" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required>
                      <option value="income">💚 Income</option>
                      <option value="expense">💸 Expense</option>
                      <option value="bill">📅 Bill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Name</label>
                    <input name="name" type="text" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Amount ($)</label>
                    <input name="amount" type="number" step="0.01" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required />
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Frequency</label>
                    <select name="frequency" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" required>
                      <option value="once">Once</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 mb-2">Due Date (for bills)</label>
                    <input name="dueDate" type="date" className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100" />
                  </div>
                  <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                    <input name="autoPay" type="checkbox" className="w-5 h-5 rounded" />
                    <span>🤖 Auto-Pay Enabled</span>
                  </label>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowAddItem(false)} className="flex-1 bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 py-3 rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white py-3 rounded-lg">
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};