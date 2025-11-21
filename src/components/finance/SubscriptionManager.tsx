import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, AlertCircle, TrendingUp, Trash2, Edit2, Check, X, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  nextBillingDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  notes: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: number;
}

const categories = [
  'Streaming',
  'Music',
  'Software',
  'Gaming',
  'Cloud Storage',
  'Productivity',
  'Fitness',
  'News & Media',
  'Education',
  'Communication',
  'Utilities',
  'Other',
];

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Streaming',
    amount: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly' | 'quarterly' | 'weekly',
    nextBillingDate: '',
    autoRenew: true,
    paymentMethod: '',
    notes: '',
    status: 'active' as 'active' | 'paused' | 'cancelled',
  });

  // Load subscriptions
  useEffect(() => {
    const saved = localStorage.getItem('subscriptions');
    if (saved) {
      setSubscriptions(JSON.parse(saved));
    }
  }, []);

  // Save subscriptions
  const saveSubscriptions = (updated: Subscription[]) => {
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  // Add subscription
  const handleAdd = () => {
    if (!formData.name || !formData.amount || !formData.nextBillingDate) {
      toast.error('Name, amount, and billing date are required');
      return;
    }

    const newSub: Subscription = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      billingCycle: formData.billingCycle,
      nextBillingDate: formData.nextBillingDate,
      autoRenew: formData.autoRenew,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      status: formData.status,
      createdAt: Date.now(),
    };

    saveSubscriptions([...subscriptions, newSub]);
    resetForm();
    toast.success(`${newSub.name} added!`);
  };

  // Update subscription
  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.amount || !formData.nextBillingDate) {
      toast.error('Name, amount, and billing date are required');
      return;
    }

    const updated = subscriptions.map(sub =>
      sub.id === editingId
        ? {
            ...sub,
            name: formData.name,
            category: formData.category,
            amount: parseFloat(formData.amount),
            billingCycle: formData.billingCycle,
            nextBillingDate: formData.nextBillingDate,
            autoRenew: formData.autoRenew,
            paymentMethod: formData.paymentMethod,
            notes: formData.notes,
            status: formData.status,
          }
        : sub
    );

    saveSubscriptions(updated);
    resetForm();
    toast.success('Subscription updated!');
  };

  // Delete subscription
  const handleDelete = (id: string) => {
    if (confirm('Delete this subscription?')) {
      saveSubscriptions(subscriptions.filter(s => s.id !== id));
      toast.success('Subscription deleted');
    }
  };

  // Start editing
  const startEdit = (sub: Subscription) => {
    setFormData({
      name: sub.name,
      category: sub.category,
      amount: sub.amount.toString(),
      billingCycle: sub.billingCycle,
      nextBillingDate: sub.nextBillingDate,
      autoRenew: sub.autoRenew,
      paymentMethod: sub.paymentMethod,
      notes: sub.notes,
      status: sub.status,
    });
    setEditingId(sub.id);
    setShowAddForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Streaming',
      amount: '',
      billingCycle: 'monthly',
      nextBillingDate: '',
      autoRenew: true,
      paymentMethod: '',
      notes: '',
      status: 'active',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  // Calculate totals
  const calculateTotal = (cycle: 'monthly' | 'yearly') => {
    return subscriptions
      .filter(s => s.status === 'active')
      .reduce((total, sub) => {
        let amount = sub.amount;
        if (cycle === 'monthly') {
          if (sub.billingCycle === 'yearly') amount /= 12;
          if (sub.billingCycle === 'quarterly') amount /= 3;
          if (sub.billingCycle === 'weekly') amount *= 4.33;
        } else {
          if (sub.billingCycle === 'monthly') amount *= 12;
          if (sub.billingCycle === 'quarterly') amount *= 4;
          if (sub.billingCycle === 'weekly') amount *= 52;
        }
        return total + amount;
      }, 0);
  };

  // Get upcoming renewals
  const getUpcomingRenewals = () => {
    const today = new Date();
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return subscriptions
      .filter(s => s.status === 'active')
      .filter(s => {
        const renewalDate = new Date(s.nextBillingDate);
        return renewalDate >= today && renewalDate <= in7Days;
      })
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
  };

  // Filter subscriptions
  const filteredSubs = filter === 'all'
    ? subscriptions
    : subscriptions.filter(s => s.status === filter);

  const monthlyTotal = calculateTotal('monthly');
  const yearlyTotal = calculateTotal('yearly');
  const upcomingRenewals = getUpcomingRenewals();

  // Export data
  const handleExport = () => {
    const csv = [
      ['Name', 'Category', 'Amount', 'Billing Cycle', 'Next Billing', 'Auto Renew', 'Payment Method', 'Status', 'Notes'],
      ...subscriptions.map(s => [
        s.name,
        s.category,
        s.amount.toString(),
        s.billingCycle,
        s.nextBillingDate,
        s.autoRenew ? 'Yes' : 'No',
        s.paymentMethod,
        s.status,
        s.notes,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Exported subscription data!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Subscription & Bills Manager</h2>
          <p className="text-green-400">Track recurring expenses and save money</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-all"
        >
          Export CSV
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h3 className="text-green-300 font-semibold">Monthly Total</h3>
          </div>
          <p className="text-3xl font-bold text-white">${monthlyTotal.toFixed(2)}</p>
          <p className="text-green-400 text-sm mt-1">
            {subscriptions.filter(s => s.status === 'active').length} active subscriptions
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-blue-300 font-semibold">Yearly Total</h3>
          </div>
          <p className="text-3xl font-bold text-white">${yearlyTotal.toFixed(2)}</p>
          <p className="text-blue-400 text-sm mt-1">Annual subscription cost</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            <h3 className="text-orange-300 font-semibold">Upcoming Renewals</h3>
          </div>
          <p className="text-3xl font-bold text-white">{upcomingRenewals.length}</p>
          <p className="text-orange-400 text-sm mt-1">In the next 7 days</p>
        </div>
      </div>

      {/* Upcoming Renewals Alert */}
      {upcomingRenewals.length > 0 && (
        <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-orange-300 font-bold mb-2">Upcoming Renewals</h3>
              <div className="space-y-2">
                {upcomingRenewals.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between text-sm">
                    <span className="text-orange-200">
                      {sub.name} - ${sub.amount}
                    </span>
                    <span className="text-orange-400">
                      {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'active', 'paused', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                : 'bg-green-900/20 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? subscriptions.length : subscriptions.filter(s => s.status === f).length})
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-green-300 font-semibold hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
      >
        {showAddForm ? (editingId ? 'Cancel Edit' : 'Cancel') : '+ Add Subscription'}
      </button>

      {showAddForm && (
        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 space-y-4">
          <h3 className="text-xl font-bold text-white">
            {editingId ? 'Edit Subscription' : 'New Subscription'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-green-300 font-semibold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="Netflix, Spotify, etc."
              />
            </div>

            <div>
              <label className="block text-green-300 font-semibold mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-green-300 font-semibold mb-2">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="9.99"
              />
            </div>

            <div>
              <label className="block text-green-300 font-semibold mb-2">Billing Cycle</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-green-300 font-semibold mb-2">Next Billing Date *</label>
              <input
                type="date"
                value={formData.nextBillingDate}
                onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-green-300 font-semibold mb-2">Payment Method</label>
              <input
                type="text"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="Visa ***1234, PayPal, etc."
              />
            </div>

            <div>
              <label className="block text-green-300 font-semibold mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-green-300 font-semibold mb-2">
                <input
                  type="checkbox"
                  checked={formData.autoRenew}
                  onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                  className="w-5 h-5 bg-black/50 border border-green-500/30 rounded"
                />
                Auto-Renew
              </label>
            </div>
          </div>

          <div>
            <label className="block text-green-300 font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500 h-20"
              placeholder="Free trial ends soon, shared with family, etc."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 rounded-xl text-white font-bold hover:from-green-500/40 hover:to-emerald-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {editingId ? 'Update' : 'Add'} Subscription
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      {filteredSubs.length === 0 ? (
        <div className="bg-green-900/10 p-12 rounded-xl border border-green-500/20 text-center">
          <CreditCard className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
          <p className="text-green-400">
            {filter === 'all'
              ? 'No subscriptions yet. Add your first subscription to start tracking!'
              : `No ${filter} subscriptions`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubs.map(sub => {
            const isUpcoming = upcomingRenewals.some(r => r.id === sub.id);
            const daysUntilRenewal = Math.ceil(
              (new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={sub.id}
                className={`bg-green-900/20 p-4 rounded-xl border transition-all ${
                  isUpcoming
                    ? 'border-orange-500/50 bg-orange-900/10'
                    : 'border-green-500/30 hover:border-green-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{sub.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'active' ? 'bg-green-500/20 text-green-300' :
                        sub.status === 'paused' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-green-400 text-sm">{sub.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(sub)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-green-500/70 text-xs mb-1">Amount</p>
                    <p className="text-white font-bold">${sub.amount.toFixed(2)}</p>
                    <p className="text-green-400/70 text-xs">{sub.billingCycle}</p>
                  </div>

                  <div>
                    <p className="text-green-500/70 text-xs mb-1">Next Billing</p>
                    <p className="text-white font-semibold">
                      {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </p>
                    <p className={`text-xs ${
                      daysUntilRenewal <= 7 ? 'text-orange-400' : 'text-green-400/70'
                    }`}>
                      {daysUntilRenewal > 0 ? `In ${daysUntilRenewal} days` : 'Overdue'}
                    </p>
                  </div>

                  <div>
                    <p className="text-green-500/70 text-xs mb-1">Auto-Renew</p>
                    <p className="text-white font-semibold">{sub.autoRenew ? 'Yes' : 'No'}</p>
                  </div>

                  {sub.paymentMethod && (
                    <div>
                      <p className="text-green-500/70 text-xs mb-1">Payment</p>
                      <p className="text-white font-semibold text-sm">{sub.paymentMethod}</p>
                    </div>
                  )}
                </div>

                {sub.notes && (
                  <div className="mt-3 p-3 bg-black/30 rounded-lg">
                    <p className="text-green-300 text-sm">{sub.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
