/**
 * 🖤 FINANCE TRACKER
 * Passive income ideas, budgets, bills, money reflection
 */

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard, Lightbulb } from 'lucide-react';
import ideasData from '../data/ideas-libraries.json';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  autoPay: boolean;
  paid: boolean;
}

const FinanceTracker: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([
    { id: '1', name: 'Rent', amount: 800, dueDate: '2025-12-01', autoPay: true, paid: false },
    { id: '2', name: 'Internet', amount: 60, dueDate: '2025-12-05', autoPay: true, paid: false },
    { id: '3', name: 'Phone', amount: 45, dueDate: '2025-12-10', autoPay: true, paid: false },
  ]);

  const [budget] = useState({
    monthly_income: 2000,
    essential: 1200,
    discretionary: 500,
    savings: 300,
  });

  const passiveIncomeIdeas = ideasData.passive_income || [];

  const toggleBillPaid = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, paid: !bill.paid } : bill
    ));
  };

  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = bills.filter(b => b.paid).reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Finance Tracker
        </h1>
        <p className="text-gray-400">Budget, bills, and passive income planning</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl">
          <DollarSign className="mb-2 text-green-400" size={32} />
          <div className="text-3xl font-bold">${budget.monthly_income}</div>
          <div className="text-sm text-gray-300">Monthly Income</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-orange-900 to-red-900 rounded-xl">
          <CreditCard className="mb-2 text-orange-400" size={32} />
          <div className="text-3xl font-bold">${budget.essential}</div>
          <div className="text-sm text-gray-300">Essential Costs</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-900 to-purple-900 rounded-xl">
          <TrendingUp className="mb-2 text-purple-400" size={32} />
          <div className="text-3xl font-bold">${budget.discretionary}</div>
          <div className="text-sm text-gray-300">Discretionary</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl">
          <DollarSign className="mb-2 text-blue-400" size={32} />
          <div className="text-3xl font-bold">${budget.savings}</div>
          <div className="text-sm text-gray-300">Savings Goal</div>
        </div>
      </div>

      {/* Bills Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Monthly Bills</h2>
          <div className="text-sm text-gray-400">
            Paid: ${paidBills} / ${totalBills}
          </div>
        </div>
        <div className="space-y-3">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`p-4 rounded-xl transition-all ${
                bill.paid ? 'bg-green-900 bg-opacity-30' : 'bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleBillPaid(bill.id)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      bill.paid ? 'bg-green-500 border-green-500' : 'border-gray-600'
                    }`}
                  >
                    {bill.paid && <span className="text-white">✓</span>}
                  </button>
                  <div>
                    <h3 className="font-semibold">{bill.name}</h3>
                    <div className="text-sm text-gray-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                      </span>
                      {bill.autoPay && (
                        <span className="px-2 py-0.5 bg-blue-900 rounded text-xs">Auto-Pay</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold">${bill.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passive Income Ideas */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="text-indigo-400" />
          Passive Income Ideas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {passiveIncomeIdeas.slice(0, 9).map((idea: any) => (
            <div key={idea.id} className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
              <h3 className="font-semibold mb-2">{idea.idea}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-green-900 rounded capitalize">{idea.category}</span>
                <span className="text-xs px-2 py-1 bg-blue-900 rounded capitalize">{idea.effort} effort</span>
              </div>
              <div className="text-sm text-gray-400 mb-1">Startup: {idea.startup_cost}</div>
              <div className="text-xs text-gray-500 capitalize">Scalability: {idea.scalability}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;