import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingDown, DollarSign, Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Debt {
  id: string;
  name: string;
  type: 'credit-card' | 'student-loan' | 'mortgage' | 'auto-loan' | 'personal-loan' | 'medical' | 'other';
  totalAmount: number;
  remainingBalance: number;
  interestRate: number; // percentage
  minimumPayment: number;
  dueDate: string;
  creditor: string;
  accountNumber?: string;
  notes: string;
}

interface Payment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  type: 'minimum' | 'extra' | 'full';
  notes: string;
}

interface PayoffStrategy {
  id: string;
  name: string;
  method: 'avalanche' | 'snowball' | 'consolidation' | 'custom';
  description: string;
  active: boolean;
  targetDate?: string;
}

const DebtManagementHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'debts' | 'payments' | 'strategies' | 'stats'>('debts');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [strategies, setStrategies] = useState<PayoffStrategy[]>([]);

  useEffect(() => {
    const savedDebts = localStorage.getItem('debts');
    if (savedDebts) setDebts(JSON.parse(savedDebts));
    const savedPayments = localStorage.getItem('debtPayments');
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    const savedStrategies = localStorage.getItem('payoffStrategies');
    if (savedStrategies) setStrategies(JSON.parse(savedStrategies));
  }, []);

  useEffect(() => { localStorage.setItem('debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('debtPayments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('payoffStrategies', JSON.stringify(strategies)); }, [strategies]);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: '',
      type: 'credit-card',
      totalAmount: 0,
      remainingBalance: 0,
      interestRate: 0,
      minimumPayment: 0,
      dueDate: '',
      creditor: '',
      notes: '',
    };
    setDebts([...debts, newDebt]);
    toast.success('Debt added');
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(debts.map(d => d.id === id ? { ...d, ...updates } : d));
    toast.success('Debt updated');
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
    toast.success('Debt deleted');
  };

  const addPayment = () => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      debtId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'minimum',
      notes: '',
    };
    setPayments([...payments, newPayment]);
    toast.success('Payment added');
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(payments.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Payment updated');
  };

  const deletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
    toast.success('Payment deleted');
  };

  const addStrategy = () => {
    const newStrategy: PayoffStrategy = {
      id: Date.now().toString(),
      name: '',
      method: 'avalanche',
      description: '',
      active: false,
    };
    setStrategies([...strategies, newStrategy]);
    toast.success('Strategy added');
  };

  const updateStrategy = (id: string, updates: Partial<PayoffStrategy>) => {
    setStrategies(strategies.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Strategy updated');
  };

  const deleteStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
    toast.success('Strategy deleted');
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.remainingBalance, 0);
  const totalPaid = debts.reduce((sum, d) => sum + (d.totalAmount - d.remainingBalance), 0);
  const totalOriginal = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalMinimumPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const avgInterestRate = debts.length > 0 ? (debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <CreditCard className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Debt Management Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <AlertCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalDebt.toLocaleString()}</div>
            <div className="text-xs opacity-90">Total Debt</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingDown className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalPaid.toLocaleString()}</div>
            <div className="text-xs opacity-90">Paid Off</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalMinimumPayments.toLocaleString()}</div>
            <div className="text-xs opacity-90">Min/Month</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgInterestRate.toFixed(1)}%</div>
            <div className="text-xs opacity-90">Avg APR</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'debts', label: 'Debts', icon: CreditCard },
            { id: 'payments', label: 'Payments', icon: DollarSign },
            { id: 'strategies', label: 'Strategies', icon: TrendingDown },
            { id: 'stats', label: 'Stats', icon: Calendar },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'debts' && (
          <div className="space-y-4">
            <button onClick={addDebt} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Debt</span>
            </button>
            {debts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No debts tracked. Start managing your debt!</p>
              </div>
            ) : (
              debts.map(debt => {
                const progress = debt.totalAmount > 0 ? ((debt.totalAmount - debt.remainingBalance) / debt.totalAmount) * 100 : 0;
                return (
                  <div key={debt.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-2">
                        <input type="text" value={debt.name} onChange={(e) => updateDebt(debt.id, { name: e.target.value })} placeholder="Debt name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none w-full mb-2" />
                        <div className="text-sm text-gray-600">
                          ${debt.remainingBalance.toLocaleString()} remaining • {debt.interestRate}% APR
                        </div>
                      </div>
                      <button onClick={() => deleteDebt(debt.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Paid Off</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select value={debt.type} onChange={(e) => updateDebt(debt.id, { type: e.target.value as Debt['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none">
                        <option value="credit-card">Credit Card</option>
                        <option value="student-loan">Student Loan</option>
                        <option value="mortgage">Mortgage</option>
                        <option value="auto-loan">Auto Loan</option>
                        <option value="personal-loan">Personal Loan</option>
                        <option value="medical">Medical</option>
                        <option value="other">Other</option>
                      </select>
                      <input type="text" value={debt.creditor} onChange={(e) => updateDebt(debt.id, { creditor: e.target.value })} placeholder="Creditor name" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Original Amount</label>
                        <input type="number" min="0" step="0.01" value={debt.totalAmount} onChange={(e) => updateDebt(debt.id, { totalAmount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Remaining Balance</label>
                        <input type="number" min="0" step="0.01" value={debt.remainingBalance} onChange={(e) => updateDebt(debt.id, { remainingBalance: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Interest Rate (%)</label>
                        <input type="number" min="0" step="0.01" value={debt.interestRate} onChange={(e) => updateDebt(debt.id, { interestRate: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Min. Payment</label>
                        <input type="number" min="0" step="0.01" value={debt.minimumPayment} onChange={(e) => updateDebt(debt.id, { minimumPayment: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Due Date</label>
                        <input type="date" value={debt.dueDate} onChange={(e) => updateDebt(debt.id, { dueDate: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                      </div>
                    </div>
                    <textarea value={debt.notes} onChange={(e) => updateDebt(debt.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <button onClick={addPayment} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Payment</span>
            </button>
            {payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(payment => (
              <div key={payment.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={payment.date} onChange={(e) => updatePayment(payment.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-orange-500 outline-none w-full mb-1" />
                  </div>
                  <button onClick={() => deletePayment(payment.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Amount</label>
                    <input type="number" min="0" step="0.01" value={payment.amount} onChange={(e) => updatePayment(payment.id, { amount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Payment Type</label>
                    <select value={payment.type} onChange={(e) => updatePayment(payment.id, { type: e.target.value as Payment['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full">
                      <option value="minimum">Minimum Payment</option>
                      <option value="extra">Extra Payment</option>
                      <option value="full">Full Payment</option>
                    </select>
                  </div>
                </div>
                <textarea value={payment.notes} onChange={(e) => updatePayment(payment.id, { notes: e.target.value })} placeholder="Payment notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'strategies' && (
          <div className="space-y-4">
            <button onClick={addStrategy} className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Payoff Strategy</span>
            </button>
            {strategies.map(strategy => (
              <div key={strategy.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${strategy.active ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={strategy.name} onChange={(e) => updateStrategy(strategy.id, { name: e.target.value })} placeholder="Strategy name..." className="flex-1 mr-2 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none" />
                  <button onClick={() => deleteStrategy(strategy.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <select value={strategy.method} onChange={(e) => updateStrategy(strategy.id, { method: e.target.value as PayoffStrategy['method'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full mb-3">
                  <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                  <option value="snowball">Debt Snowball (Smallest Balance First)</option>
                  <option value="consolidation">Debt Consolidation</option>
                  <option value="custom">Custom Strategy</option>
                </select>
                <textarea value={strategy.description} onChange={(e) => updateStrategy(strategy.id, { description: e.target.value })} placeholder="Strategy description..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none mb-3" rows={2} />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Target Payoff Date</label>
                    <input type="date" value={strategy.targetDate || ''} onChange={(e) => updateStrategy(strategy.id, { targetDate: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-orange-500 outline-none w-full" />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={strategy.active} onChange={(e) => updateStrategy(strategy.id, { active: e.target.checked })} className="w-4 h-4" />
                      <label className="text-sm text-gray-600">Active strategy</label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600">Debt Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Debt Remaining:</span>
                  <span className="font-semibold text-red-600">${totalDebt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid Off:</span>
                  <span className="font-semibold text-green-600">${totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Debt:</span>
                  <span className="font-semibold">${totalOriginal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payoff Progress:</span>
                  <span className="font-semibold">{totalOriginal > 0 ? ((totalPaid / totalOriginal) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min. Monthly Payments:</span>
                  <span className="font-semibold">${totalMinimumPayments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average APR:</span>
                  <span className="font-semibold">{avgInterestRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Debts:</span>
                  <span className="font-semibold">{debts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payments Made:</span>
                  <span className="font-semibold">{payments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Strategies:</span>
                  <span className="font-semibold">{strategies.filter(s => s.active).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtManagementHubPage;
