import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2, DollarSign, Home, Car, Briefcase, CreditCard, PiggyBank, Building } from 'lucide-react';
import toast from 'react-hot-toast';

interface Asset {
  id: string;
  name: string;
  category: 'cash' | 'investments' | 'property' | 'vehicles' | 'retirement' | 'other';
  value: number;
  notes: string;
  lastUpdated: string;
}

interface Liability {
  id: string;
  name: string;
  category: 'mortgage' | 'auto-loan' | 'credit-card' | 'student-loan' | 'personal-loan' | 'other';
  amount: number;
  notes: string;
  lastUpdated: string;
}

interface NetWorthSnapshot {
  id: string;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

const NetWorthTracker: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [snapshots, setSnapshots] = useState<NetWorthSnapshot[]>([]);
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities' | 'history'>('assets');

  useEffect(() => {
    const savedAssets = localStorage.getItem('netWorthAssets');
    if (savedAssets) setAssets(JSON.parse(savedAssets));

    const savedLiabilities = localStorage.getItem('netWorthLiabilities');
    if (savedLiabilities) setLiabilities(JSON.parse(savedLiabilities));

    const savedSnapshots = localStorage.getItem('netWorthSnapshots');
    if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots));
  }, []);

  useEffect(() => {
    localStorage.setItem('netWorthAssets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('netWorthLiabilities', JSON.stringify(liabilities));
  }, [liabilities]);

  useEffect(() => {
    localStorage.setItem('netWorthSnapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  const addAsset = () => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: '',
      category: 'cash',
      value: 0,
      notes: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(assets.map(a => a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : a));
  };

  const deleteAsset = (id: string) => {
    if (confirm('Delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
      toast.success('Asset deleted');
    }
  };

  const addLiability = () => {
    const newLiability: Liability = {
      id: Date.now().toString(),
      name: '',
      category: 'credit-card',
      amount: 0,
      notes: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setLiabilities([...liabilities, newLiability]);
  };

  const updateLiability = (id: string, updates: Partial<Liability>) => {
    setLiabilities(liabilities.map(l => l.id === id ? { ...l, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : l));
  };

  const deleteLiability = (id: string) => {
    if (confirm('Delete this liability?')) {
      setLiabilities(liabilities.filter(l => l.id !== id));
      toast.success('Liability deleted');
    }
  };

  const takeSnapshot = () => {
    const snapshot: NetWorthSnapshot = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      totalAssets,
      totalLiabilities,
      netWorth
    };
    setSnapshots([snapshot, ...snapshots]);
    toast.success('Net worth snapshot saved!');
  };

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  const previousNetWorth = snapshots.length > 0 ? snapshots[0].netWorth : netWorth;
  const netWorthChange = netWorth - previousNetWorth;
  const netWorthChangePercent = previousNetWorth !== 0 ? (netWorthChange / previousNetWorth) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    const icons = {
      cash: DollarSign,
      investments: TrendingUp,
      property: Home,
      vehicles: Car,
      retirement: PiggyBank,
      mortgage: Home,
      'auto-loan': Car,
      'credit-card': CreditCard,
      'student-loan': Briefcase,
      'personal-loan': Building,
      other: Briefcase
    };
    return icons[category as keyof typeof icons] || Briefcase;
  };

  const getCategoryColor = (category: string, type: 'asset' | 'liability') => {
    if (type === 'asset') {
      const colors = {
        cash: 'bg-green-500/20 border-green-500/30 text-green-300',
        investments: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
        property: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
        vehicles: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
        retirement: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
        other: 'bg-gray-500/20 border-gray-500/30 text-gray-300'
      };
      return colors[category as keyof typeof colors] || colors.other;
    } else {
      const colors = {
        mortgage: 'bg-red-500/20 border-red-500/30 text-red-300',
        'auto-loan': 'bg-orange-500/20 border-orange-500/30 text-orange-300',
        'credit-card': 'bg-pink-500/20 border-pink-500/30 text-pink-300',
        'student-loan': 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
        'personal-loan': 'bg-rose-500/20 border-rose-500/30 text-rose-300',
        other: 'bg-gray-500/20 border-gray-500/30 text-gray-300'
      };
      return colors[category as keyof typeof colors] || colors.other;
    }
  };

  return (
    <div className="space-y-6">
      {/* Net Worth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-6 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-emerald-300 font-semibold">Total Assets</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalAssets.toFixed(2)}</p>
          <p className="text-emerald-400 text-sm mt-1">{assets.length} assets</p>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="text-red-300 font-semibold">Total Liabilities</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalLiabilities.toFixed(2)}</p>
          <p className="text-red-400 text-sm mt-1">{liabilities.length} liabilities</p>
        </div>

        <div className={`bg-gradient-to-br p-6 rounded-xl border ${
          netWorth >= 0
            ? 'from-blue-900/30 to-cyan-900/30 border-blue-500/30'
            : 'from-red-900/30 to-orange-900/30 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`w-5 h-5 ${netWorth >= 0 ? 'text-blue-400' : 'text-red-400'}`} />
            <h3 className={`font-semibold ${netWorth >= 0 ? 'text-blue-300' : 'text-red-300'}`}>Net Worth</h3>
          </div>
          <p className="text-3xl font-bold text-white">${netWorth.toFixed(2)}</p>
          <p className={`text-sm mt-1 ${netWorth >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {netWorth >= 0 ? 'Positive' : 'Negative'}
          </p>
        </div>

        <div className={`bg-gradient-to-br p-6 rounded-xl border ${
          netWorthChange >= 0
            ? 'from-teal-900/30 to-emerald-900/30 border-teal-500/30'
            : 'from-orange-900/30 to-red-900/30 border-orange-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {netWorthChange >= 0 ?
              <TrendingUp className="w-5 h-5 text-teal-400" /> :
              <TrendingDown className="w-5 h-5 text-orange-400" />
            }
            <h3 className={`font-semibold ${netWorthChange >= 0 ? 'text-teal-300' : 'text-orange-300'}`}>Change</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {netWorthChange >= 0 ? '+' : ''}{netWorthChange.toFixed(2)}
          </p>
          <p className={`text-sm mt-1 ${netWorthChange >= 0 ? 'text-teal-400' : 'text-orange-400'}`}>
            {netWorthChangePercent >= 0 ? '+' : ''}{netWorthChangePercent.toFixed(1)}% since last
          </p>
        </div>
      </div>

      {/* Snapshot Button */}
      <button
        onClick={takeSnapshot}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-500/20 border-2 border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all font-semibold"
      >
        <DollarSign className="w-5 h-5" />
        Take Net Worth Snapshot
      </button>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'assets'
              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
              : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          Assets ({assets.length})
        </button>
        <button
          onClick={() => setActiveTab('liabilities')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'liabilities'
              ? 'bg-red-500/30 text-red-300 border border-red-500/50'
              : 'bg-red-900/20 text-red-400 hover:bg-red-500/20'
          }`}
        >
          Liabilities ({liabilities.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
              : 'bg-blue-900/20 text-blue-400 hover:bg-blue-500/20'
          }`}
        >
          History ({snapshots.length})
        </button>
      </div>

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <button
            onClick={addAsset}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 hover:bg-emerald-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Asset
          </button>

          {assets.map(asset => {
            const Icon = getCategoryIcon(asset.category);
            return (
              <div key={asset.id} className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 p-6 rounded-xl border border-emerald-500/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-emerald-400" />
                      <input
                        type="text"
                        value={asset.name}
                        onChange={(e) => updateAsset(asset.id, { name: e.target.value })}
                        placeholder="Asset name..."
                        className="text-lg font-bold bg-transparent border-b-2 border-emerald-500/30 focus:border-emerald-500 outline-none text-white flex-1"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(asset.category, 'asset')}`}>
                        {asset.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Value ($)</label>
                        <input
                          type="number"
                          value={asset.value}
                          onChange={(e) => updateAsset(asset.id, { value: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Category</label>
                        <select
                          value={asset.category}
                          onChange={(e) => updateAsset(asset.id, { category: e.target.value as Asset['category'] })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                        >
                          <option value="cash">Cash & Bank Accounts</option>
                          <option value="investments">Investments</option>
                          <option value="property">Property & Real Estate</option>
                          <option value="vehicles">Vehicles</option>
                          <option value="retirement">Retirement Accounts</option>
                          <option value="other">Other Assets</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs text-emerald-400 block mb-1">Notes</label>
                      <textarea
                        value={asset.notes}
                        onChange={(e) => updateAsset(asset.id, { notes: e.target.value })}
                        placeholder="Additional details..."
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-emerald-400">Last updated: {new Date(asset.lastUpdated).toLocaleDateString()}</span>
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-300 hover:bg-red-500/30 transition-all text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {assets.length === 0 && (
            <div className="bg-emerald-900/20 p-12 rounded-xl border border-emerald-500/30 text-center">
              <TrendingUp className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Assets Yet</h3>
              <p className="text-emerald-400">
                Start tracking your assets to calculate your net worth.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Liabilities Tab */}
      {activeTab === 'liabilities' && (
        <div className="space-y-4">
          <button
            onClick={addLiability}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Liability
          </button>

          {liabilities.map(liability => {
            const Icon = getCategoryIcon(liability.category);
            return (
              <div key={liability.id} className="bg-gradient-to-br from-red-900/20 to-pink-900/20 p-6 rounded-xl border border-red-500/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-red-400" />
                      <input
                        type="text"
                        value={liability.name}
                        onChange={(e) => updateLiability(liability.id, { name: e.target.value })}
                        placeholder="Liability name..."
                        className="text-lg font-bold bg-transparent border-b-2 border-red-500/30 focus:border-red-500 outline-none text-white flex-1"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(liability.category, 'liability')}`}>
                        {liability.category.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-red-400 block mb-1">Amount Owed ($)</label>
                        <input
                          type="number"
                          value={liability.amount}
                          onChange={(e) => updateLiability(liability.id, { amount: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-red-900/30 border border-red-500/30 rounded px-3 py-2 text-white text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-red-400 block mb-1">Category</label>
                        <select
                          value={liability.category}
                          onChange={(e) => updateLiability(liability.id, { category: e.target.value as Liability['category'] })}
                          className="w-full bg-red-900/30 border border-red-500/30 rounded px-3 py-2 text-white"
                        >
                          <option value="mortgage">Mortgage</option>
                          <option value="auto-loan">Auto Loan</option>
                          <option value="credit-card">Credit Card</option>
                          <option value="student-loan">Student Loan</option>
                          <option value="personal-loan">Personal Loan</option>
                          <option value="other">Other Debt</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs text-red-400 block mb-1">Notes</label>
                      <textarea
                        value={liability.notes}
                        onChange={(e) => updateLiability(liability.id, { notes: e.target.value })}
                        placeholder="Additional details..."
                        className="w-full bg-red-900/30 border border-red-500/30 rounded px-3 py-2 text-white text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-red-400">Last updated: {new Date(liability.lastUpdated).toLocaleDateString()}</span>
                      <button
                        onClick={() => deleteLiability(liability.id)}
                        className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-300 hover:bg-red-500/30 transition-all text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {liabilities.length === 0 && (
            <div className="bg-red-900/20 p-12 rounded-xl border border-red-500/30 text-center">
              <TrendingDown className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Liabilities Yet</h3>
              <p className="text-red-400">
                Track your debts and liabilities to get a complete financial picture.
              </p>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {snapshots.map((snapshot, index) => {
            const prevSnapshot = snapshots[index + 1];
            const change = prevSnapshot ? snapshot.netWorth - prevSnapshot.netWorth : 0;
            const changePercent = prevSnapshot && prevSnapshot.netWorth !== 0 ? (change / prevSnapshot.netWorth) * 100 : 0;

            return (
              <div key={snapshot.id} className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{new Date(snapshot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    <p className="text-blue-400 text-sm">Snapshot #{snapshots.length - index}</p>
                  </div>
                  <div className={`text-right ${snapshot.netWorth >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    <p className="text-3xl font-bold">${snapshot.netWorth.toFixed(2)}</p>
                    {prevSnapshot && (
                      <p className={`text-sm ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%)
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-emerald-400 mb-1">Assets</p>
                    <p className="text-lg font-semibold text-emerald-300">${snapshot.totalAssets.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-400 mb-1">Liabilities</p>
                    <p className="text-lg font-semibold text-red-300">${snapshot.totalLiabilities.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {snapshots.length === 0 && (
            <div className="bg-blue-900/20 p-12 rounded-xl border border-blue-500/30 text-center">
              <DollarSign className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Snapshots Yet</h3>
              <p className="text-blue-400">
                Take regular snapshots to track how your net worth changes over time.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetWorthTracker;
