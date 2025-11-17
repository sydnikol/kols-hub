import React, { useState } from 'react';
import { DollarSign, CreditCard, Wallet, TrendingUp, Download, ShoppingCart, AlertCircle } from 'lucide-react';

/**
 * 💰 Payment Hub Component
 * Handles all payment, billing, and passive income features
 */

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal' | 'crypto';
  name: string;
  last4?: string;
  default: boolean;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  category: string;
}

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  type: 'passive' | 'active';
  status: 'completed' | 'pending';
}

const PaymentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bills' | 'income' | 'methods'>('overview');
  const [bills, setBills] = useState<Bill[]>([
    { id: '1', name: 'Rent', amount: 800, dueDate: '2024-12-01', status: 'paid', category: 'housing' },
    { id: '2', name: 'Utilities', amount: 120, dueDate: '2024-12-05', status: 'pending', category: 'utilities' },
    { id: '3', name: 'Phone', amount: 75, dueDate: '2024-12-10', status: 'pending', category: 'services' },
  ]);

  const [income, setIncome] = useState<Income[]>([
    { id: '1', source: 'Digital Products', amount: 250, date: '2024-11-20', type: 'passive', status: 'completed' },
    { id: '2', source: 'Freelance Work', amount: 500, date: '2024-11-15', type: 'active', status: 'completed' },
    { id: '3', source: 'Affiliate Sales', amount: 125, date: '2024-11-18', type: 'passive', status: 'pending' },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', name: 'Visa ****1234', last4: '1234', default: true },
    { id: '2', type: 'bank', name: 'Bank Account ****5678', last4: '5678', default: false },
  ]);

  const totalIncome = income.filter(i => i.status === 'completed').reduce((sum, i) => sum + i.amount, 0);
  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const paidBills = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const passiveIncome = income.filter(i => i.type === 'passive' && i.status === 'completed').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="text-green-400" size={40} />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Payment & Finance Hub
          </h1>
        </div>
        <p className="text-gray-400">Manage your bills, income, and payment methods</p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total Income</span>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">${totalIncome.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">This month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-purple-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Passive Income</span>
            <Wallet className="text-purple-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">${passiveIncome.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">Automated earnings</div>
        </div>

        <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total Bills</span>
            <ShoppingCart className="text-red-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">${totalBills.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">{bills.filter(b => b.status !== 'paid').length} pending</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Bills Paid</span>
            <CreditCard className="text-blue-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">${paidBills.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">{bills.filter(b => b.status === 'paid').length} of {bills.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['overview', 'bills', 'income', 'methods'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bills */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Bills</h3>
              <div className="space-y-3">
                {bills.filter(b => b.status !== 'paid').slice(0, 3).map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div>
                      <div className="font-semibold">{bill.name}</div>
                      <div className="text-sm text-gray-400">Due: {bill.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${bill.amount}</div>
                      <div className={`text-xs ${bill.status === 'overdue' ? 'text-red-400' : 'text-indigo-400'}`}>
                        {bill.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Income */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Recent Income</h3>
              <div className="space-y-3">
                {income.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div>
                      <div className="font-semibold">{item.source}</div>
                      <div className="text-sm text-gray-400">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-400">${item.amount}</div>
                      <div className="text-xs text-purple-400">{item.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Bills Management</h3>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all">
                Add Bill
              </button>
            </div>
            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-all">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{bill.name}</div>
                    <div className="text-sm text-gray-400">Category: {bill.category}</div>
                    <div className="text-sm text-gray-400">Due: {bill.dueDate}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-bold text-xl">${bill.amount}</div>
                    <div className={`text-sm px-3 py-1 rounded-full inline-block ${
                      bill.status === 'paid' ? 'bg-green-900 text-green-400' :
                      bill.status === 'overdue' ? 'bg-red-900 text-red-400' :
                      'bg-indigo-900 text-indigo-400'
                    }`}>
                      {bill.status}
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    bill.status === 'paid' ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}>
                    {bill.status === 'paid' ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'income' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Income Tracking</h3>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all">
                Add Income
              </button>
            </div>
            <div className="space-y-3">
              {income.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-all">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{item.source}</div>
                    <div className="text-sm text-gray-400">Date: {item.date}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.type === 'passive' ? 'bg-purple-900 text-purple-400' : 'bg-blue-900 text-blue-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'completed' ? 'bg-green-900 text-green-400' : 'bg-indigo-900 text-indigo-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-green-400">${item.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Payment Methods</h3>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all">
                Add Method
              </button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      {method.type === 'card' && <CreditCard className="text-blue-400" size={24} />}
                      {method.type === 'bank' && <Wallet className="text-green-400" size={24} />}
                      {method.type === 'paypal' && <DollarSign className="text-blue-400" size={24} />}
                      {method.type === 'crypto' && <TrendingUp className="text-orange-400" size={24} />}
                    </div>
                    <div>
                      <div className="font-semibold">{method.name}</div>
                      <div className="text-sm text-gray-400 capitalize">{method.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {method.default && (
                      <span className="px-3 py-1 bg-green-900 text-green-400 text-xs rounded-full">
                        Default
                      </span>
                    )}
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-green-900 to-emerald-900 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all text-left">
            <Download className="text-green-400 mb-2" size={24} />
            <div className="font-semibold">Download Statements</div>
            <div className="text-sm text-gray-400">Export your financial data</div>
          </button>
          <button className="p-4 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all text-left">
            <TrendingUp className="text-purple-400 mb-2" size={24} />
            <div className="font-semibold">View Analytics</div>
            <div className="text-sm text-gray-400">Detailed spending insights</div>
          </button>
          <button className="p-4 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all text-left">
            <AlertCircle className="text-indigo-400 mb-2" size={24} />
            <div className="font-semibold">Set Budget Alerts</div>
            <div className="text-sm text-gray-400">Get notified before overspending</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHub;
