/**
 * REAL MONEY DASHBOARD
 *
 * Manage real passive income and withdraw to bank account
 */

import React, { useState, useEffect } from 'react';
import { realMoneyConnector } from '../services/real-money-connector';
import {
  DollarSign, TrendingUp, CreditCard, ArrowDownToLine,
  Settings, CheckCircle, XCircle, Clock, Wallet, Building2,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

const RealMoneyDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [autoWithdraw, setAutoWithdraw] = useState(false);
  const [autoWithdrawMin, setAutoWithdrawMin] = useState(50);

  // Payment method configuration
  const [showStripeConfig, setShowStripeConfig] = useState(false);
  const [stripeKey, setStripeKey] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await realMoneyConnector.getRealMoneyStats();
      setStats(data);
      setAutoWithdraw(data.autoWithdrawEnabled);
      setAutoWithdrawMin(data.autoWithdrawThreshold);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load real money stats');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    const success = await realMoneyConnector.withdrawToBank(amount, withdrawMethod);
    if (success) {
      setWithdrawAmount('');
      await loadStats();
    }
  };

  const handleConfigureStripe = async () => {
    if (!stripeKey) {
      toast.error('Enter your Stripe publishable key');
      return;
    }

    try {
      await realMoneyConnector.connectPaymentMethod('stripe', {
        publishableKey: stripeKey
      });
      setShowStripeConfig(false);
      setStripeKey('');
      await loadStats();
    } catch (error) {
      toast.error('Failed to configure Stripe');
    }
  };

  const handleAutoWithdrawToggle = async () => {
    const newValue = !autoWithdraw;
    realMoneyConnector.setAutoWithdraw(newValue, autoWithdrawMin);
    setAutoWithdraw(newValue);
    toast.success(`Auto-withdraw ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleConfigurePayPal = async () => {
    const email = prompt('Enter your PayPal email address:');
    if (!email) return;

    try {
      await realMoneyConnector.connectPaymentMethod('paypal', {
        email: email
      });
      await loadStats();
      toast.success('PayPal configured successfully!');
    } catch (error) {
      toast.error('Failed to configure PayPal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              REAL Money Dashboard
            </h1>
          </div>
          <p className="text-green-300">
            Withdraw your passive income earnings to your bank account
          </p>
        </div>

        {/* Real Balance Card */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-8 rounded-2xl border border-green-500/30 mb-6">
          <div className="text-center">
            <p className="text-green-400 text-sm mb-2">Available to Withdraw</p>
            <div className="text-6xl font-bold text-white mb-4">
              ${stats.realBalance.toFixed(2)}
            </div>
            <p className="text-green-300 text-sm">
              {stats.pendingWithdrawals} pending withdrawal{stats.pendingWithdrawals !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
            <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">${stats.totalWithdrawn.toFixed(2)}</p>
            <p className="text-green-400 text-sm">Total Withdrawn</p>
          </div>

          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
            <Building2 className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.withdrawalHistory}</p>
            <p className="text-blue-400 text-sm">Completed Withdrawals</p>
          </div>

          <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
            <Wallet className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats.passiveIncomeStreams}</p>
            <p className="text-purple-400 text-sm">Active Income Streams</p>
          </div>

          <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-500/30">
            <DollarSign className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">${stats.monthlyProjection.toFixed(2)}</p>
            <p className="text-yellow-400 text-sm">Monthly Projection</p>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Manual Withdraw */}
          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ArrowDownToLine className="text-green-400" />
              Withdraw to Bank
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-green-300 mb-2">Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as 'stripe' | 'paypal')}
                  className="w-full px-4 py-3 bg-green-900/30 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="stripe">Stripe → Bank Account (1-3 days)</option>
                  <option value="paypal">PayPal → PayPal Account (24 hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-green-300 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={stats.realBalance}
                  className="w-full px-4 py-3 bg-green-900/30 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-400"
                />
                <p className="text-green-400 text-sm mt-1">
                  Max: ${stats.realBalance.toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) === 0}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowDownToLine size={20} />
                Withdraw to Bank Account
              </button>

              <p className="text-xs text-green-400">
                Money will be transferred to your Stripe account and then to your connected bank account (1-3 business days)
              </p>
            </div>
          </div>

          {/* Auto-Withdraw */}
          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="text-blue-400" />
              Auto-Withdraw Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-300">Enable Auto-Withdraw</span>
                <button
                  onClick={handleAutoWithdrawToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoWithdraw ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoWithdraw ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-blue-300 mb-2">Minimum Balance</label>
                <input
                  type="number"
                  value={autoWithdrawMin}
                  onChange={(e) => setAutoWithdrawMin(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-blue-900/30 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                />
                <p className="text-blue-400 text-sm mt-1">
                  Auto-withdraw when balance reaches this amount
                </p>
              </div>

              {autoWithdraw && (
                <div className="p-3 bg-blue-900/40 rounded border border-blue-500/40">
                  <p className="text-blue-300 text-sm">
                    ✅ Auto-withdraw is ACTIVE. Money will automatically transfer to your bank when balance reaches ${autoWithdrawMin}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="text-purple-400" />
            Payment Methods ({stats.paymentMethodsConfigured} configured)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stripe */}
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Stripe</span>
                {stats.paymentMethodsConfigured > 0 ? (
                  <CheckCircle className="text-green-400" size={20} />
                ) : (
                  <XCircle className="text-gray-500" size={20} />
                )}
              </div>
              {!showStripeConfig ? (
                <button
                  onClick={() => setShowStripeConfig(true)}
                  className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                >
                  Configure Stripe
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={stripeKey}
                    onChange={(e) => setStripeKey(e.target.value)}
                    placeholder="Publishable Key (pk_...)"
                    className="w-full px-3 py-2 bg-purple-900/40 border border-purple-500/30 rounded text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfigureStripe}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowStripeConfig(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PayPal - NOW AVAILABLE */}
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">PayPal</span>
                {localStorage.getItem('payment_paypal_configured') ? (
                  <CheckCircle className="text-green-400" size={20} />
                ) : (
                  <XCircle className="text-gray-500" size={20} />
                )}
              </div>
              <button
                onClick={() => handleConfigurePayPal()}
                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                {localStorage.getItem('payment_paypal_configured') ? 'Reconfigure' : 'Configure PayPal'}
              </button>
            </div>
          </div>

          <p className="text-purple-400 text-sm mt-4">
            💡 <strong>Get Stripe key:</strong> Visit <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener" className="underline">Stripe Dashboard</a> and copy your publishable key
          </p>
        </div>

        {/* Recent Withdrawals */}
        <div className="bg-gray-900/20 p-6 rounded-xl border border-gray-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Recent Withdrawals</h3>
          {stats.withdrawalHistory === 0 ? (
            <p className="text-gray-400">No withdrawals yet. Start earning and withdraw when ready!</p>
          ) : (
            <div className="space-y-2">
              <p className="text-green-400">
                You've withdrawn ${stats.totalWithdrawn.toFixed(2)} total
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealMoneyDashboard;
