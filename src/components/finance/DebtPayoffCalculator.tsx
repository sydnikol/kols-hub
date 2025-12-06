import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, Trash2, TrendingDown, Calendar, DollarSign, Percent, Target, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Debt {
  id: string;
  name: string;
  type: 'credit-card' | 'student-loan' | 'mortgage' | 'personal-loan' | 'medical' | 'other';
  balance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  notes: string;
  isPriority: boolean;
}

interface Payment {
  id: string;
  debtId: string;
  debtName: string;
  amount: number;
  date: string;
  notes: string;
}

const DebtPayoffCalculator: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [monthlyPaymentBudget, setMonthlyPaymentBudget] = useState(0);
  const [payoffStrategy, setPayoffStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [showAddDebt, setShowAddDebt] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('debts');
    if (saved) setDebts(JSON.parse(saved));

    const savedPayments = localStorage.getItem('debtPayments');
    if (savedPayments) setPayments(JSON.parse(savedPayments));

    const savedBudget = localStorage.getItem('debtPaymentBudget');
    if (savedBudget) setMonthlyPaymentBudget(parseFloat(savedBudget));
  }, []);

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('debtPayments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('debtPaymentBudget', monthlyPaymentBudget.toString());
  }, [monthlyPaymentBudget]);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: '',
      type: 'credit-card',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      dueDate: new Date().toISOString().split('T')[0],
      notes: '',
      isPriority: false
    };
    setDebts([...debts, newDebt]);
    setShowAddDebt(true);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(debts.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDebt = (id: string) => {
    if (confirm('Delete this debt?')) {
      setDebts(debts.filter(d => d.id !== id));
      setPayments(payments.filter(p => p.debtId !== id));
      toast.success('Debt deleted');
    }
  };

  const addPayment = (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    const amount = prompt(`Enter payment amount for ${debt.name}:`);
    if (!amount || isNaN(parseFloat(amount))) return;

    const payment: Payment = {
      id: Date.now().toString(),
      debtId,
      debtName: debt.name,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };

    setPayments([...payments, payment]);
    updateDebt(debtId, { balance: debt.balance - parseFloat(amount) });
    toast.success(`Payment of $${amount} recorded!`);
  };

  const calculateTotalDebt = () => debts.reduce((sum, d) => sum + d.balance, 0);
  const calculateTotalMinimum = () => debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const calculateTotalInterest = () => debts.reduce((sum, d) => sum + (d.balance * d.interestRate / 100 / 12), 0);

  const getPayoffOrder = () => {
    if (payoffStrategy === 'avalanche') {
      // Highest interest rate first
      return [...debts].sort((a, b) => b.interestRate - a.interestRate);
    } else {
      // Smallest balance first (snowball)
      return [...debts].sort((a, b) => a.balance - b.balance);
    }
  };

  const calculatePayoffTime = (debt: Debt) => {
    if (debt.minimumPayment <= 0) return 'N/A';
    const monthlyInterest = debt.interestRate / 100 / 12;
    const months = Math.ceil(
      Math.log(debt.minimumPayment / (debt.minimumPayment - debt.balance * monthlyInterest)) /
      Math.log(1 + monthlyInterest)
    );
    return isFinite(months) ? `${months} months` : 'N/A';
  };

  const getDebtTypeColor = (type: string) => {
    const colors = {
      'credit-card': 'bg-red-500/20 border-red-500/30 text-red-300',
      'student-loan': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'mortgage': 'bg-green-500/20 border-green-500/30 text-green-300',
      'personal-loan': 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
      'medical': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'other': 'bg-gray-500/20 border-gray-500/30 text-gray-300'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const totalDebt = calculateTotalDebt();
  const totalMinimum = calculateTotalMinimum();
  const totalInterest = calculateTotalInterest();
  const debtFreeDate = totalMinimum > 0 ?
    new Date(Date.now() + (totalDebt / totalMinimum) * 30 * 24 * 60 * 60 * 1000) : null;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-red-300 font-semibold">Total Debt</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalDebt.toFixed(2)}</p>
          <p className="text-red-400 text-sm mt-1">{debts.length} debts</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-6 rounded-xl border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <h3 className="text-yellow-300 font-semibold">Monthly Minimum</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalMinimum.toFixed(2)}</p>
          <p className="text-yellow-400 text-sm mt-1">Required payment</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-orange-400" />
            <h3 className="text-orange-300 font-semibold">Monthly Interest</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalInterest.toFixed(2)}</p>
          <p className="text-orange-400 text-sm mt-1">Interest accruing</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-6 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-emerald-300 font-semibold">Debt Free Date</h3>
          </div>
          <p className="text-lg font-bold text-white">
            {debtFreeDate ? debtFreeDate.toLocaleDateString() : 'Set payments'}
          </p>
          <p className="text-emerald-400 text-sm mt-1">Projected</p>
        </div>
      </div>

      {/* Strategy Selector */}
      <div className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-emerald-300 mb-1">Payoff Strategy</h3>
            <p className="text-emerald-400 text-sm">Choose your debt elimination approach</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPayoffStrategy('avalanche')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                payoffStrategy === 'avalanche'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              💨 Avalanche (Highest Interest)
            </button>
            <button
              onClick={() => setPayoffStrategy('snowball')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                payoffStrategy === 'snowball'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              ⛄ Snowball (Smallest Balance)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-300 mb-2">💨 Avalanche Method</h4>
            <p className="text-emerald-400 text-sm">Pay off debts with highest interest rates first. Saves the most money on interest charges over time.</p>
          </div>
          <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-500/20">
            <h4 className="font-semibold text-emerald-300 mb-2">⛄ Snowball Method</h4>
            <p className="text-emerald-400 text-sm">Pay off smallest balances first. Provides psychological wins and motivation through quick victories.</p>
          </div>
        </div>
      </div>

      {/* Add Debt Button */}
      <button
        onClick={addDebt}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500/20 border-2 border-emerald-500/30 rounded-xl text-emerald-300 hover:bg-emerald-500/30 transition-all font-semibold"
      >
        <Plus className="w-5 h-5" />
        Add Debt to Track
      </button>

      {/* Debts List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-emerald-300">
          Your Debts ({payoffStrategy === 'avalanche' ? 'Highest Interest First' : 'Smallest Balance First'})
        </h3>

        {getPayoffOrder().map((debt, index) => {
          const debtPayments = payments.filter(p => p.debtId === debt.id);
          const totalPaid = debtPayments.reduce((sum, p) => sum + p.amount, 0);
          const progress = debt.balance > 0 ? ((totalPaid / (totalPaid + debt.balance)) * 100) : 0;

          return (
            <div key={debt.id} className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 p-6 rounded-xl border border-emerald-500/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-emerald-400">#{index + 1}</span>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, { name: e.target.value })}
                      placeholder="Debt name..."
                      className="text-xl font-bold bg-transparent border-b-2 border-emerald-500/30 focus:border-emerald-500 outline-none text-white flex-1"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDebtTypeColor(debt.type)}`}>
                      {debt.type.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Balance</label>
                      <input
                        type="number"
                        value={debt.balance}
                        onChange={(e) => updateDebt(debt.id, { balance: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={debt.interestRate}
                        onChange={(e) => updateDebt(debt.id, { interestRate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Minimum Payment</label>
                      <input
                        type="number"
                        value={debt.minimumPayment}
                        onChange={(e) => updateDebt(debt.id, { minimumPayment: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-emerald-400 block mb-1">Payoff Time</label>
                      <div className="bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-emerald-300 font-semibold">
                        {calculatePayoffTime(debt)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-emerald-400 mb-1">
                      <span>Payment Progress</span>
                      <span>{progress.toFixed(1)}% paid</span>
                    </div>
                    <div className="h-3 bg-emerald-900/30 rounded-full overflow-hidden border border-emerald-500/30">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => addPayment(debt.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all"
                    >
                      <DollarSign className="w-4 h-4" />
                      Record Payment
                    </button>
                    <button
                      onClick={() => updateDebt(debt.id, { isPriority: !debt.isPriority })}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        debt.isPriority
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {debt.isPriority ? '⭐ Priority' : 'Set Priority'}
                    </button>
                    <button
                      onClick={() => deleteDebt(debt.id)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {debtPayments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-emerald-500/30">
                  <h4 className="text-sm font-semibold text-emerald-300 mb-2">
                    Payment History ({debtPayments.length} payments, ${totalPaid.toFixed(2)} total)
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {debtPayments.slice(-5).map(payment => (
                      <div key={payment.id} className="bg-emerald-900/30 px-3 py-1 rounded-full text-sm text-emerald-300">
                        ${payment.amount} on {new Date(payment.date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {debts.length === 0 && (
        <div className="bg-emerald-900/20 p-12 rounded-xl border border-emerald-500/30 text-center">
          <PiggyBank className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No Debts Tracked Yet</h3>
          <p className="text-emerald-400 mb-4">
            Start tracking your debts to create a personalized payoff plan and become debt-free faster.
          </p>
        </div>
      )}
    </div>
  );
};

export default DebtPayoffCalculator;
