import React, { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Target, PiggyBank, Activity, Receipt, Wallet } from 'lucide-react';
import SubscriptionManager from '../components/finance/SubscriptionManager';
import SavingsGoalsTracker from '../components/finance/SavingsGoalsTracker';

type TabType = 'overview' | 'subscriptions' | 'savings' | 'budget' | 'expenses';

const FinanceDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'green' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, color: 'emerald' },
    { id: 'savings', label: 'Savings Goals', icon: Target, color: 'teal' },
    { id: 'budget', label: 'Budget', icon: Wallet, color: 'cyan' },
    { id: 'expenses', label: 'Expenses', icon: Receipt, color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Financial Enhancement Hub
            </h1>
          </div>
          <p className="text-green-400">
            Track subscriptions, save for goals, manage budgets, and build financial wellness
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-green-900/20 p-2 rounded-xl border border-green-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                      : 'bg-green-900/20 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-6 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-emerald-300 font-semibold">Subscriptions</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Track All</p>
                  <p className="text-emerald-400 text-sm mt-1">Save money monthly</p>
                </div>

                <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-teal-400" />
                    <h3 className="text-teal-300 font-semibold">Savings Goals</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Build Wealth</p>
                  <p className="text-teal-400 text-sm mt-1">Track progress visually</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-cyan-300 font-semibold">Budgets</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Plan Ahead</p>
                  <p className="text-cyan-400 text-sm mt-1">Stay on track</p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Receipt className="w-6 h-6 text-blue-400" />
                    <h3 className="text-blue-300 font-semibold">Expenses</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Track Spending</p>
                  <p className="text-blue-400 text-sm mt-1">Understand patterns</p>
                </div>
              </div>

              {/* Feature Description Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 p-6 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Subscription Manager</h2>
                  </div>
                  <p className="text-emerald-200 mb-4">
                    Track all your recurring subscriptions and bills in one place. Never miss a renewal,
                    identify unused subscriptions, and save money by optimizing your monthly expenses.
                  </p>
                  <ul className="space-y-2 text-emerald-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Track all subscription details and costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Calculate monthly and yearly totals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Get alerts for upcoming renewals (7 days)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Organize by category and payment method</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Pause, cancel, or track auto-renewal status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Export subscription data to CSV</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-8 h-8 text-teal-400" />
                    <h2 className="text-2xl font-bold text-white">Savings Goals Tracker</h2>
                  </div>
                  <p className="text-teal-200 mb-4">
                    Set financial goals and track your progress visually. Whether saving for emergencies,
                    vacation, or a big purchase - celebrate every milestone on your savings journey.
                  </p>
                  <ul className="space-y-2 text-teal-300">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Create unlimited savings goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Set target amounts and deadlines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Visual progress bars and statistics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Track every contribution with history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Prioritize goals (high, medium, low)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>Celebrate completion automatically</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white">Budget Planner</h2>
                  </div>
                  <p className="text-cyan-200 mb-4">
                    Create monthly budgets by category and track spending against your targets. Build
                    healthy financial habits and stay accountable to your money goals.
                  </p>
                  <ul className="space-y-2 text-cyan-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Set category budgets (housing, food, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Track actual vs. planned spending</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Get warnings when approaching limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Monthly and yearly budget views</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Rollover unused budget to next month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Income vs. expense analysis</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-cyan-900/40 rounded-lg border border-cyan-500/40">
                    <p className="text-cyan-300 text-sm italic">
                      Coming soon: Budget planning tools
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Receipt className="w-8 h-8 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Expense Tracker</h2>
                  </div>
                  <p className="text-blue-200 mb-4">
                    Log every expense and understand your spending patterns. Categorize purchases,
                    attach receipts, and gain insights into where your money goes.
                  </p>
                  <ul className="space-y-2 text-blue-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Quick expense logging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Categorize and tag purchases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Attach receipt photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Daily, weekly, monthly summaries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Spending trends and patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Export for tax purposes</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-900/40 rounded-lg border border-blue-500/40">
                    <p className="text-blue-300 text-sm italic">
                      Coming soon: Expense tracking tools
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Wellness Tips */}
              <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
                <h3 className="text-xl font-bold text-green-300 mb-3">
                  Financial Wellness for Chronic Illness & Disability
                </h3>
                <div className="space-y-3 text-green-200">
                  <p>
                    Managing finances with chronic illness or disability presents unique challenges. Medical
                    expenses, reduced work capacity, and unpredictable costs require careful planning and
                    flexible strategies.
                  </p>
                  <p>
                    These tools are designed to help you track expenses, save for goals, and maintain
                    financial stability while honoring your health needs and limitations.
                  </p>
                  <p className="font-semibold text-green-100">
                    Remember: Financial health is part of overall wellness. Start small, track what you can,
                    and celebrate every step toward your goals - no matter how modest.
                  </p>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-300 mb-3">Coming Soon</h3>
                <ul className="space-y-2 text-emerald-200">
                  <li className="flex items-start gap-2">
                    <PiggyBank className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span>Debt Payoff Calculator - Track debt reduction progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span>Net Worth Tracker - Monitor assets vs. liabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span>Income Tracker - Log all income sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span>Financial Assistance Tracker - SSI/SSDI, benefits, programs</span>
                  </li>
                </ul>
              </div>

              {/* Privacy & Data */}
              <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
                <h3 className="text-lg font-bold text-green-300 mb-2">Privacy & Your Data</h3>
                <p className="text-green-400 leading-relaxed">
                  All financial data is stored locally on your device and never uploaded or shared anywhere.
                  Your financial information remains completely private. Export features allow you to back up
                  your data or share it with trusted financial advisors if you choose.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && <SubscriptionManager />}
          {activeTab === 'savings' && <SavingsGoalsTracker />}

          {activeTab === 'budget' && (
            <div className="bg-cyan-900/20 p-12 rounded-xl border border-cyan-500/30 text-center">
              <Wallet className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Budget Planner Coming Soon</h2>
              <p className="text-cyan-300 max-w-2xl mx-auto">
                Create monthly budgets, track spending against targets, and build healthy financial habits
                with our upcoming budget planning tools.
              </p>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="bg-blue-900/20 p-12 rounded-xl border border-blue-500/30 text-center">
              <Receipt className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Expense Tracker Coming Soon</h2>
              <p className="text-blue-300 max-w-2xl mx-auto">
                Log expenses, categorize purchases, attach receipts, and analyze spending patterns with
                our upcoming expense tracking system.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FinanceDashboardPage;
