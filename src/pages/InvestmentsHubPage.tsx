import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Plus, Trash2, Target } from 'lucide-react';
import toast from 'react-hot-toast';

interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'crypto' | 'real-estate' | 'mutual-funds' | 'etf' | 'commodities' | 'other';
  amount: number;
  currentValue: number;
  purchaseDate: string;
  quantity: number;
  symbol?: string;
  platform?: string;
  notes: string;
}

interface Portfolio {
  id: string;
  name: string;
  description: string;
  totalInvested: number;
  currentValue: number;
  investmentIds: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
}

interface Transaction {
  id: string;
  investmentId: string;
  type: 'buy' | 'sell' | 'dividend' | 'interest';
  amount: number;
  quantity: number;
  pricePerUnit: number;
  date: string;
  fees: number;
  notes: string;
}

const InvestmentsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'investments' | 'portfolios' | 'transactions' | 'stats'>('investments');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedInvestments = localStorage.getItem('investments');
    if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
    const savedPortfolios = localStorage.getItem('portfolios');
    if (savedPortfolios) setPortfolios(JSON.parse(savedPortfolios));
    const savedTransactions = localStorage.getItem('investmentTransactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  useEffect(() => { localStorage.setItem('investments', JSON.stringify(investments)); }, [investments]);
  useEffect(() => { localStorage.setItem('portfolios', JSON.stringify(portfolios)); }, [portfolios]);
  useEffect(() => { localStorage.setItem('investmentTransactions', JSON.stringify(transactions)); }, [transactions]);

  const addInvestment = () => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: '',
      type: 'stocks',
      amount: 0,
      currentValue: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      quantity: 0,
      notes: '',
    };
    setInvestments([...investments, newInvestment]);
    toast.success('Investment added');
  };

  const updateInvestment = (id: string, updates: Partial<Investment>) => {
    setInvestments(investments.map(i => i.id === id ? { ...i, ...updates } : i));
    toast.success('Investment updated');
  };

  const deleteInvestment = (id: string) => {
    setInvestments(investments.filter(i => i.id !== id));
    toast.success('Investment deleted');
  };

  const addPortfolio = () => {
    const newPortfolio: Portfolio = {
      id: Date.now().toString(),
      name: '',
      description: '',
      totalInvested: 0,
      currentValue: 0,
      investmentIds: [],
      riskLevel: 'medium',
    };
    setPortfolios([...portfolios, newPortfolio]);
    toast.success('Portfolio added');
  };

  const updatePortfolio = (id: string, updates: Partial<Portfolio>) => {
    setPortfolios(portfolios.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Portfolio updated');
  };

  const deletePortfolio = (id: string) => {
    setPortfolios(portfolios.filter(p => p.id !== id));
    toast.success('Portfolio deleted');
  };

  const addTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      investmentId: '',
      type: 'buy',
      amount: 0,
      quantity: 0,
      pricePerUnit: 0,
      date: new Date().toISOString().split('T')[0],
      fees: 0,
      notes: '',
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

  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalCurrentValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalGains = totalCurrentValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? ((totalGains / totalInvested) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Investments Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalInvested.toLocaleString()}</div>
            <div className="text-xs opacity-90">Invested</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <PieChart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">${totalCurrentValue.toLocaleString()}</div>
            <div className="text-xs opacity-90">Value</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className={`text-xl font-bold ${totalGains >= 0 ? 'text-white' : 'text-red-200'}`}>${totalGains.toLocaleString()}</div>
            <div className="text-xs opacity-90">Gains</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <BarChart3 className="w-5 h-5 mx-auto mb-1" />
            <div className={`text-xl font-bold ${returnPercentage >= 0 ? 'text-white' : 'text-red-200'}`}>{returnPercentage.toFixed(1)}%</div>
            <div className="text-xs opacity-90">Return</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'investments', label: 'Investments', icon: DollarSign },
            { id: 'portfolios', label: 'Portfolios', icon: PieChart },
            { id: 'transactions', label: 'Transactions', icon: BarChart3 },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'investments' && (
          <div className="space-y-4">
            <button onClick={addInvestment} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Investment</span>
            </button>
            {investments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No investments yet. Start building your portfolio!</p>
              </div>
            ) : (
              investments.map(investment => {
                const gain = investment.currentValue - investment.amount;
                const gainPercentage = investment.amount > 0 ? ((gain / investment.amount) * 100) : 0;
                return (
                  <div key={investment.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${gain >= 0 ? 'border-green-500' : 'border-red-500'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-2">
                        <input type="text" value={investment.name} onChange={(e) => updateInvestment(investment.id, { name: e.target.value })} placeholder="Investment name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full mb-2" />
                        <div className="text-sm text-gray-600">
                          ${investment.currentValue.toLocaleString()} ({gain >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%)
                        </div>
                      </div>
                      <button onClick={() => deleteInvestment(investment.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select value={investment.type} onChange={(e) => updateInvestment(investment.id, { type: e.target.value as Investment['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none">
                        <option value="stocks">Stocks</option>
                        <option value="bonds">Bonds</option>
                        <option value="crypto">Crypto</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="mutual-funds">Mutual Funds</option>
                        <option value="etf">ETF</option>
                        <option value="commodities">Commodities</option>
                        <option value="other">Other</option>
                      </select>
                      <input type="date" value={investment.purchaseDate} onChange={(e) => updateInvestment(investment.id, { purchaseDate: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Initial Amount</label>
                        <input type="number" min="0" step="0.01" value={investment.amount} onChange={(e) => updateInvestment(investment.id, { amount: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none w-full" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Current Value</label>
                        <input type="number" min="0" step="0.01" value={investment.currentValue} onChange={(e) => updateInvestment(investment.id, { currentValue: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input type="text" value={investment.symbol || ''} onChange={(e) => updateInvestment(investment.id, { symbol: e.target.value })} placeholder="Symbol (e.g., AAPL)" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                      <input type="number" min="0" step="0.01" value={investment.quantity} onChange={(e) => updateInvestment(investment.id, { quantity: parseFloat(e.target.value) || 0 })} placeholder="Quantity" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    </div>
                    <textarea value={investment.notes} onChange={(e) => updateInvestment(investment.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" rows={2} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div className="space-y-4">
            <button onClick={addPortfolio} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Portfolio</span>
            </button>
            {portfolios.map(portfolio => {
              const returns = portfolio.currentValue - portfolio.totalInvested;
              const returnsPercentage = portfolio.totalInvested > 0 ? ((returns / portfolio.totalInvested) * 100) : 0;
              return (
                <div key={portfolio.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={portfolio.name} onChange={(e) => updatePortfolio(portfolio.id, { name: e.target.value })} placeholder="Portfolio name..." className="flex-1 mr-2 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none" />
                    <button onClick={() => deletePortfolio(portfolio.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea value={portfolio.description} onChange={(e) => updatePortfolio(portfolio.id, { description: e.target.value })} placeholder="Portfolio description..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none mb-3" rows={2} />
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Total Invested</label>
                      <input type="number" min="0" step="0.01" value={portfolio.totalInvested} onChange={(e) => updatePortfolio(portfolio.id, { totalInvested: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Current Value</label>
                      <input type="number" min="0" step="0.01" value={portfolio.currentValue} onChange={(e) => updatePortfolio(portfolio.id, { currentValue: parseFloat(e.target.value) || 0 })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full" />
                    </div>
                  </div>
                  <select value={portfolio.riskLevel} onChange={(e) => updatePortfolio(portfolio.id, { riskLevel: e.target.value as Portfolio['riskLevel'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full mb-3">
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                    <option value="very-high">Very High Risk</option>
                  </select>
                  <div className="text-sm text-gray-600">
                    Returns: <span className={`font-semibold ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${returns.toLocaleString()} ({returns >= 0 ? '+' : ''}{returnsPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <button onClick={addTransaction} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
            {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(transaction => (
              <div key={transaction.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${transaction.type === 'buy' ? 'border-red-500' : 'border-green-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={transaction.date} onChange={(e) => updateTransaction(transaction.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none w-full mb-1" />
                  </div>
                  <button onClick={() => deleteTransaction(transaction.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={transaction.type} onChange={(e) => updateTransaction(transaction.id, { type: e.target.value as Transaction['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none">
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                    <option value="dividend">Dividend</option>
                    <option value="interest">Interest</option>
                  </select>
                  <input type="number" min="0" step="0.01" value={transaction.amount} onChange={(e) => updateTransaction(transaction.id, { amount: parseFloat(e.target.value) || 0 })} placeholder="Amount" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="number" min="0" step="0.01" value={transaction.quantity} onChange={(e) => updateTransaction(transaction.id, { quantity: parseFloat(e.target.value) || 0 })} placeholder="Quantity" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                  <input type="number" min="0" step="0.01" value={transaction.pricePerUnit} onChange={(e) => updateTransaction(transaction.id, { pricePerUnit: parseFloat(e.target.value) || 0 })} placeholder="Price per unit" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                </div>
                <input type="number" min="0" step="0.01" value={transaction.fees} onChange={(e) => updateTransaction(transaction.id, { fees: parseFloat(e.target.value) || 0 })} placeholder="Fees" className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none w-full mb-3" />
                <textarea value={transaction.notes} onChange={(e) => updateTransaction(transaction.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Investment Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Invested:</span>
                  <span className="font-semibold">${totalInvested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="font-semibold">${totalCurrentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Gains:</span>
                  <span className={`font-semibold ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalGains.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Return:</span>
                  <span className={`font-semibold ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {returnPercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Investments:</span>
                  <span className="font-semibold">{investments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Portfolios:</span>
                  <span className="font-semibold">{portfolios.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions:</span>
                  <span className="font-semibold">{transactions.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsHubPage;
