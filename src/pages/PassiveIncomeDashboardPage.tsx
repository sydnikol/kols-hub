/**
 * Passive Income Dashboard Page
 * Complete income management with Cash App, Venmo, and PayPal integration
 */

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Download,
  Settings,
  PieChart,
  Calendar,
  Target,
  Zap,
  CreditCard,
  ArrowUpRight,
  Filter,
  Search
} from 'lucide-react';
import PaymentPlatformCard from '../components/income/PaymentPlatformCard';
import PaymentPlatformService, { PaymentPlatform } from '../services/paymentPlatformService';
import { PassiveIncomeOrchestrator } from '../features/passive-income/agents/PassiveIncomeOrchestrator';
import { db } from '../services/db';
import {
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PassiveIncomeDashboardPage: React.FC = () => {
  const [orchestrator] = useState(() => PassiveIncomeOrchestrator.getInstance());
  const [platforms, setPlatforms] = useState<PaymentPlatform[]>([]);
  const [incomeStats, setIncomeStats] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [incomeByPlatform, setIncomeByPlatform] = useState<any[]>([]);
  const [incomeBySource, setIncomeBySource] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  // Platform setup forms
  const [cashAppUsername, setCashAppUsername] = useState('');
  const [venmoUsername, setVenmoUsername] = useState('');
  const [paypalUsername, setPaypalUsername] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      // Load payment platforms
      const allPlatforms = await PaymentPlatformService.getAllPlatforms();
      setPlatforms(allPlatforms);

      // Load income stats from passive income orchestrator
      const stats = await orchestrator.getStats();
      setIncomeStats(stats);

      // Generate monthly trend data
      const monthly = generateMonthlyData();
      setMonthlyData(monthly);

      // Generate income by platform
      const platformIncome = await generatePlatformIncome(allPlatforms);
      setIncomeByPlatform(platformIncome);

      // Generate income by source
      const sourceIncome = generateSourceIncome(stats);
      setIncomeBySource(sourceIncome);

      // Get recent transactions from all platforms
      const allTransactions = await getAllTransactions(allPlatforms);
      setRecentTransactions(allTransactions);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const generateMonthlyData = () => {
    // Mock monthly trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      income: 500 + (idx * 150) + Math.random() * 200,
      goal: 1000
    }));
  };

  const generatePlatformIncome = async (platforms: PaymentPlatform[]) => {
    const data = [];
    for (const platform of platforms) {
      if (platform.isActive) {
        const balance = await PaymentPlatformService.getBalance(platform.platform);
        data.push({
          name: platform.platform.toUpperCase(),
          value: balance,
          color: PaymentPlatformService.getPlatformColors(platform.platform).primary
        });
      }
    }
    return data;
  };

  const generateSourceIncome = (stats: any) => {
    return [
      { name: 'Content', value: 350, color: '#10B981' },
      { name: 'Affiliate', value: 280, color: '#3B82F6' },
      { name: 'Investments', value: 450, color: '#8B5CF6' },
      { name: 'Crypto', value: 220, color: '#F59E0B' },
      { name: 'Digital Products', value: 180, color: '#EF4444' }
    ];
  };

  const getAllTransactions = async (platforms: PaymentPlatform[]) => {
    const allTxs = [];
    for (const platform of platforms) {
      if (platform.isActive) {
        const txs = await PaymentPlatformService.getRecentTransactions(platform.platform);
        allTxs.push(...txs);
      }
    }
    return allTxs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  };

  const handleSavePlatform = async (
    platform: 'cashapp' | 'venmo' | 'paypal',
    username: string
  ) => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    const platformData: PaymentPlatform = {
      platform,
      username: username.trim(),
      isActive: true,
      lastSynced: new Date()
    };

    await PaymentPlatformService.savePlatform(platformData);
    await loadData();
    alert(`${platform.toUpperCase()} configured successfully!`);
  };

  const totalBalance = platforms.reduce((sum, p) => sum + (p.balance || 0), 0);
  const monthlyIncome = incomeStats?.monthlyRevenue || 0;
  const todayIncome = incomeStats?.todayRevenue || 0;
  const projectedMonthly = monthlyIncome * 1.15; // 15% growth projection

  const filteredTransactions = recentTransactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.fromUser?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || tx.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-green-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Passive Income Dashboard
            </h1>
            <p className="text-green-400">
              Track all your income streams and payment platforms in one place
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 mb-8">
            <h2 className="text-2xl font-bold text-green-300 mb-6">Payment Platform Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cash App Setup */}
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <h3 className="text-lg font-bold text-green-300 mb-4">Cash App</h3>
                <input
                  type="text"
                  placeholder="$cashtag (without $)"
                  value={cashAppUsername}
                  onChange={(e) => setCashAppUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white mb-3"
                />
                <button
                  onClick={() => handleSavePlatform('cashapp', cashAppUsername)}
                  className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors"
                >
                  Save Cash App
                </button>
              </div>

              {/* Venmo Setup */}
              <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                <h3 className="text-lg font-bold text-blue-300 mb-4">Venmo</h3>
                <input
                  type="text"
                  placeholder="@username (without @)"
                  value={venmoUsername}
                  onChange={(e) => setVenmoUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white mb-3"
                />
                <button
                  onClick={() => handleSavePlatform('venmo', venmoUsername)}
                  className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 transition-colors"
                >
                  Save Venmo
                </button>
              </div>

              {/* PayPal Setup */}
              <div className="bg-black/30 p-4 rounded-lg border border-blue-600/20">
                <h3 className="text-lg font-bold text-blue-300 mb-4">PayPal</h3>
                <input
                  type="text"
                  placeholder="PayPal.me username"
                  value={paypalUsername}
                  onChange={(e) => setPaypalUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-blue-600/30 rounded-lg text-white mb-3"
                />
                <button
                  onClick={() => handleSavePlatform('paypal', paypalUsername)}
                  className="w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg border border-blue-600/30 transition-colors"
                >
                  Save PayPal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-white" />
              <span className="text-sm text-white/80">Total Balance</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {PaymentPlatformService.formatCurrency(totalBalance)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-sm text-white/80">This Month</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {PaymentPlatformService.formatCurrency(monthlyIncome)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-sm text-white/80">Today</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {PaymentPlatformService.formatCurrency(todayIncome)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-white" />
              <span className="text-sm text-white/80">Projected</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {PaymentPlatformService.formatCurrency(projectedMonthly)}
            </div>
          </div>
        </div>

        {/* Payment Platform Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-300 mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Payment Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PaymentPlatformCard
              platform="cashapp"
              platformData={platforms.find(p => p.platform === 'cashapp')}
              onRefresh={loadData}
            />
            <PaymentPlatformCard
              platform="venmo"
              platformData={platforms.find(p => p.platform === 'venmo')}
              onRefresh={loadData}
            />
            <PaymentPlatformCard
              platform="paypal"
              platformData={platforms.find(p => p.platform === 'paypal')}
              onRefresh={loadData}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Income Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10B98155" />
                <XAxis dataKey="month" stroke="#10B981" />
                <YAxis stroke="#10B981" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064e3b', border: '1px solid #10B981' }}
                  labelStyle={{ color: '#10B981' }}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} name="Income" />
                <Line type="monotone" dataKey="goal" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Goal" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Income by Source */}
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Income by Source
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={incomeBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Streams Overview */}
        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 mb-8">
          <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Active Income Streams ({incomeStats?.activeStreams || 0})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeBySource.map((source, idx) => (
              <div key={idx} className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-green-300">{source.name}</h4>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {PaymentPlatformService.formatCurrency(source.value)}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+12% this month</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-300 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Recent Transactions
            </h3>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white text-sm"
                />
              </div>

              {/* Filter */}
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="cashapp">Cash App</option>
                <option value="venmo">Venmo</option>
                <option value="paypal">PayPal</option>
              </select>

              {/* Export */}
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'received' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <DollarSign className={`w-5 h-5 ${
                        tx.type === 'received' ? 'text-green-400' : 'text-red-400'
                      }`} />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{tx.description}</div>
                      <div className="text-sm text-gray-400">
                        {tx.platform.toUpperCase()} • {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      tx.type === 'received' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'received' ? '+' : '-'}{PaymentPlatformService.formatCurrency(tx.amount)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      tx.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No transactions found
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105">
            <CreditCard className="w-5 h-5" />
            Request Money
          </button>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105">
            <QrCode className="w-5 h-5" />
            Show QR Code
          </button>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105">
            <Download className="w-5 h-5" />
            Create Invoice
          </button>
          <button
            onClick={loadData}
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            <TrendingUp className="w-5 h-5" />
            Sync All
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassiveIncomeDashboardPage;
