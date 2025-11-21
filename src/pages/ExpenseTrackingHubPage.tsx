import React, { useState, useEffect } from 'react';
import { Receipt, DollarSign, Calendar, TrendingDown, Plus, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'groceries' | 'dining' | 'transportation' | 'utilities' | 'healthcare' | 'entertainment' | 'shopping' | 'travel' | 'education' | 'other';
  date: string;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'digital' | 'other';
  recurring: boolean;
  receiptUrl?: string;
  tags: string[];
  notes: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  budgetLimit?: number;
  color: string;
}

interface Receipt {
  id: string;
  expenseId: string;
  date: string;
  vendor: string;
  totalAmount: number;
  items: string[];
  notes: string;
}

const ExpenseTrackingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'categories' | 'receipts' | 'stats'>('expenses');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    const savedCategories = localStorage.getItem('expenseCategories');
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    const savedReceipts = localStorage.getItem('receipts');
    if (savedReceipts) setReceipts(JSON.parse(savedReceipts));
  }, []);

  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('expenseCategories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('receipts', JSON.stringify(receipts)); }, [receipts]);

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description: '',
      amount: 0,
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      recurring: false,
      tags: [],
      notes: '',
    };
    setExpenses([...expenses, newExpense]);
    toast.success('Expense added');
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, ...updates } : e));
    toast.success('Expense updated');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('Expense deleted');
  };

  const addCategory = () => {
    const newCategory: ExpenseCategory = {
      id: Date.now().toString(),
      name: '',
      color: '#10b981',
    };
    setCategories([...categories, newCategory]);
    toast.success('Category added');
  };

  const updateCategory = (id: string, updates: Partial<ExpenseCategory>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Category updated');
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  const addReceipt = () => {
    const newReceipt: Receipt = {
      id: Date.now().toString(),
      expenseId: '',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      totalAmount: 0,
      items: [],
      notes: '',
    };
    setReceipts([...receipts, newReceipt]);
    toast.success('Receipt added');
  };

  const updateReceipt = (id: string, updates: Partial<Receipt>) => {
    setReceipts(receipts.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Receipt updated');
  };

  const deleteReceipt = (id: string) => {
    setReceipts(receipts.filter(r => r.id !== id));
    toast.success('Receipt deleted');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(thisMonth)).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pb-20">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Receipt className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Expense Tracking Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalExpenses.toLocaleString()}</div>
            <div className="text-xs opacity-90">Total</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${monthlyExpenses.toLocaleString()}</div>
            <div className="text-xs opacity-90">This Month</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingDown className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${avgExpense.toFixed(0)}</div>
            <div className="text-xs opacity-90">Average</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Receipt className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{expenses.length}</div>
            <div className="text-xs opacity-90">Expenses</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'categories', label: 'Categories', icon: Tag },
            { id: 'receipts', label: 'Receipts', icon: Receipt },
            { id: 'stats', label: 'Stats', icon: TrendingDown },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <button onClick={addExpense} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
            {expenses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No expenses yet. Start tracking your spending!</p>
              </div>
            ) : (
              expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                <div key={expense.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="date" value={expense.date} onChange={(e) => updateExpense(expense.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-red-500 outline-none w-full mb-1" />
                      <input type="text" value={expense.description} onChange={(e) => updateExpense(expense.id, { description: e.target.value })} placeholder="Expense description..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteExpense(expense.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Amount</label>
                      <input type="number" min="0" step="0.01" value={expense.amount} onChange={(e) => updateExpense(expense.id, { amount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Category</label>
                      <select value={expense.category} onChange={(e) => updateExpense(expense.id, { category: e.target.value as Expense['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none w-full">
                        <option value="groceries">Groceries</option>
                        <option value="dining">Dining</option>
                        <option value="transportation">Transportation</option>
                        <option value="utilities">Utilities</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="shopping">Shopping</option>
                        <option value="travel">Travel</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Payment Method</label>
                    <select value={expense.paymentMethod} onChange={(e) => updateExpense(expense.id, { paymentMethod: e.target.value as Expense['paymentMethod'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none w-full">
                      <option value="cash">Cash</option>
                      <option value="credit">Credit Card</option>
                      <option value="debit">Debit Card</option>
                      <option value="digital">Digital Wallet</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <input type="checkbox" checked={expense.recurring} onChange={(e) => updateExpense(expense.id, { recurring: e.target.checked })} className="w-4 h-4" />
                    <label className="text-sm text-gray-600">Recurring expense</label>
                  </div>
                  <textarea value={expense.notes} onChange={(e) => updateExpense(expense.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <button onClick={addCategory} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={category.name} onChange={(e) => updateCategory(category.id, { name: e.target.value })} placeholder="Category name..." className="flex-1 mr-2 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none" />
                  <button onClick={() => deleteCategory(category.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Budget Limit</label>
                    <input type="number" min="0" step="0.01" value={category.budgetLimit || ''} onChange={(e) => updateCategory(category.id, { budgetLimit: parseFloat(e.target.value) || undefined })} placeholder="Optional" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Color</label>
                    <input type="color" value={category.color} onChange={(e) => updateCategory(category.id, { color: e.target.value })} className="w-full h-10 rounded border border-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'receipts' && (
          <div className="space-y-4">
            <button onClick={addReceipt} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Receipt</span>
            </button>
            {receipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(receipt => (
              <div key={receipt.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={receipt.date} onChange={(e) => updateReceipt(receipt.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-red-500 outline-none w-full mb-1" />
                    <input type="text" value={receipt.vendor} onChange={(e) => updateReceipt(receipt.id, { vendor: e.target.value })} placeholder="Vendor name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteReceipt(receipt.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">Total Amount</label>
                  <input type="number" min="0" step="0.01" value={receipt.totalAmount} onChange={(e) => updateReceipt(receipt.id, { totalAmount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none w-full" />
                </div>
                <textarea value={receipt.notes} onChange={(e) => updateReceipt(receipt.id, { notes: e.target.value })} placeholder="Receipt notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Expense Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expenses:</span>
                  <span className="font-semibold">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month:</span>
                  <span className="font-semibold">${monthlyExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Expense:</span>
                  <span className="font-semibold">${avgExpense.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tracked:</span>
                  <span className="font-semibold">{expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recurring:</span>
                  <span className="font-semibold">{expenses.filter(e => e.recurring).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-semibold">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipts:</span>
                  <span className="font-semibold">{receipts.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTrackingHubPage;
