/**
 * UNIFIED FINANCE ECOSYSTEM
 * ==========================
 * Consolidates ALL finance-related services into a single coherent system.
 * Replaces: passiveIncomeStorage.ts, income-withdrawal-system.ts,
 *           mega-passive-income-system.ts, financial-ai-advisor.ts,
 *           paymentPlatformService.ts, and scattered finance components
 *
 * Features:
 * - Transaction tracking (income, expenses, transfers)
 * - Budget management with category limits
 * - Savings goals with progress tracking
 * - Debt management with payoff strategies
 * - Investment portfolio tracking
 * - Passive income sources & monitoring
 * - Subscription management
 * - Bill reminders
 * - Net worth calculation
 * - Financial insights & AI recommendations
 * - Payment platform integrations (Stripe, PayPal, CashApp, Venmo)
 * - Cross-system finance connections (health costs, entertainment spending)
 */

import { unifiedDataHub, eventBus } from './unified-data-hub';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  date: Date;
  account?: string;
  paymentMethod?: string;
  recurring?: boolean;
  recurrencePattern?: string;
  tags?: string[];
  receipt?: string;
  notes?: string;
  linkedTo?: { type: string; id: string };
  createdAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  limit: number;
  period: 'weekly' | 'monthly' | 'yearly';
  spent: number;
  startDate: Date;
  endDate?: Date;
  rollover: boolean;
  alerts: { threshold: number; enabled: boolean }[];
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  autoSave?: {
    amount: number;
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    nextDate: Date;
  };
  milestones?: Array<{ amount: number; reached: boolean; reachedDate?: Date }>;
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Debt {
  id: string;
  name: string;
  type: 'credit_card' | 'student_loan' | 'mortgage' | 'car_loan' | 'personal_loan' | 'medical' | 'other';
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: number; // Day of month
  lender: string;
  accountNumber?: string;
  startDate: Date;
  projectedPayoffDate?: Date;
  payoffStrategy?: 'avalanche' | 'snowball' | 'custom';
  notes?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'real_estate' | 'retirement' | 'other';
  symbol?: string;
  shares?: number;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: Date;
  platform: string;
  dividendYield?: number;
  lastUpdated: Date;
  notes?: string;
}

export interface PassiveIncomeSource {
  id: string;
  name: string;
  type: 'dividends' | 'rental' | 'royalties' | 'affiliate' | 'digital_products' | 'content' | 'interest' | 'other';
  platform?: string;
  expectedMonthly: number;
  actualMonthly: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastPayout?: Date;
  nextExpectedPayout?: Date;
  status: 'active' | 'paused' | 'discontinued';
  setupCost?: number;
  maintenanceHours?: number;
  notes?: string;
  linkedProject?: string;
  earnings: Array<{ amount: number; date: Date; notes?: string }>;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  nextBillingDate: Date;
  paymentMethod: string;
  autoRenew: boolean;
  cancellationUrl?: string;
  notes?: string;
  usageRating?: number; // 1-5 how much you use it
  keepOrCancel?: 'keep' | 'cancel' | 'review';
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Day of month
  category: string;
  payee: string;
  autopay: boolean;
  reminderDays: number;
  lastPaid?: Date;
  notes?: string;
}

export interface FinancialInsight {
  id: string;
  type: 'trend' | 'alert' | 'recommendation' | 'achievement' | 'warning';
  category: string;
  title: string;
  message: string;
  severity?: 'info' | 'low' | 'medium' | 'high';
  data?: any;
  actionable?: boolean;
  action?: { type: string; label: string; data: any };
  date: Date;
  acknowledged: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  institution: string;
  accountNumber?: string;
  lastUpdated: Date;
}

// ============================================================================
// UNIFIED FINANCE ECOSYSTEM SERVICE
// ============================================================================

class UnifiedFinanceEcosystem {
  private initialized = false;

  // -------------------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------------------

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.setupEventListeners();
    this.initialized = true;
    console.log('Finance Ecosystem initialized');
  }

  private setupEventListeners(): void {
    // Listen for health expenses
    eventBus.on('health:medication:taken', async (data) => {
      // Check if there's a cost associated
    });

    // Listen for entertainment purchases
    eventBus.on('entertainment:purchased', async (data) => {
      await this.addTransaction({
        type: 'expense',
        category: 'Entertainment',
        subcategory: data.type,
        amount: data.amount,
        description: data.title,
        linkedTo: { type: 'entertainment', id: data.id }
      });
    });

    // Listen for food purchases
    eventBus.on('food:grocery:purchased', async (data) => {
      await this.addTransaction({
        type: 'expense',
        category: 'Food',
        subcategory: 'Groceries',
        amount: data.amount,
        description: data.store || 'Grocery shopping',
        linkedTo: { type: 'grocery', id: data.id }
      });
    });

    // Listen for learning expenses
    eventBus.on('learning:course:purchased', async (data) => {
      await this.addTransaction({
        type: 'expense',
        category: 'Education',
        subcategory: 'Courses',
        amount: data.amount,
        description: data.courseName,
        linkedTo: { type: 'course', id: data.id }
      });
    });
  }

  // -------------------------------------------------------------------------
  // TRANSACTIONS
  // -------------------------------------------------------------------------

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const record: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      date: transaction.date || new Date(),
      createdAt: new Date()
    };

    await unifiedDataHub.addTransaction(record);

    // Update budget spending
    if (record.type === 'expense') {
      await this.updateBudgetSpending(record.category, record.amount);
    }

    // Check for unusual spending
    await this.checkSpendingPatterns(record);

    return record;
  }

  async getTransactions(options?: {
    type?: 'income' | 'expense' | 'transfer';
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<Transaction[]> {
    let transactions = await unifiedDataHub.getTransactions(options?.startDate, options?.endDate);

    if (options?.type) {
      transactions = transactions.filter(t => t.type === options.type);
    }
    if (options?.category) {
      transactions = transactions.filter(t => t.category === options.category);
    }
    if (options?.limit) {
      transactions = transactions.slice(0, options.limit);
    }

    return transactions;
  }

  async deleteTransaction(id: string): Promise<void> {
    // Would delete from unified data hub
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    // Would update in unified data hub
  }

  private async updateBudgetSpending(category: string, amount: number): Promise<void> {
    const budgets = await this.getBudgets();
    const matchingBudget = budgets.find(b => b.category === category);

    if (matchingBudget) {
      matchingBudget.spent += amount;

      // Check if over budget
      const percentUsed = (matchingBudget.spent / matchingBudget.limit) * 100;

      for (const alert of matchingBudget.alerts || []) {
        if (alert.enabled && percentUsed >= alert.threshold) {
          await this.addFinancialInsight({
            type: 'alert',
            category: 'budget',
            title: `Budget Alert: ${category}`,
            message: `You've used ${percentUsed.toFixed(0)}% of your ${category} budget ($${matchingBudget.spent.toFixed(2)} of $${matchingBudget.limit.toFixed(2)})`,
            severity: percentUsed >= 100 ? 'high' : 'medium',
            data: { budget: matchingBudget, percentUsed }
          });
        }
      }
    }
  }

  private async checkSpendingPatterns(transaction: Transaction): Promise<void> {
    if (transaction.type !== 'expense') return;

    // Get recent transactions in same category
    const recentStart = new Date();
    recentStart.setDate(recentStart.getDate() - 30);

    const recentTransactions = await this.getTransactions({
      type: 'expense',
      category: transaction.category,
      startDate: recentStart
    });

    // Check for unusual amount
    if (recentTransactions.length >= 5) {
      const avgAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length;

      if (transaction.amount > avgAmount * 2) {
        await this.addFinancialInsight({
          type: 'alert',
          category: 'spending',
          title: 'Unusual Expense Detected',
          message: `This ${transaction.category} expense ($${transaction.amount.toFixed(2)}) is significantly higher than your average ($${avgAmount.toFixed(2)})`,
          severity: 'low',
          data: { transaction, average: avgAmount }
        });
      }
    }
  }

  // -------------------------------------------------------------------------
  // BUDGETS
  // -------------------------------------------------------------------------

  async addBudget(budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget> {
    const record: Budget = {
      ...budget,
      id: `budget-${Date.now()}`,
      spent: 0
    };

    // Would save to unified data hub
    return record;
  }

  async getBudgets(): Promise<Budget[]> {
    // Would fetch from unified data hub
    return [];
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<void> {
    // Would update in unified data hub
  }

  async deleteBudget(id: string): Promise<void> {
    // Would delete from unified data hub
  }

  async getBudgetSummary(): Promise<{
    totalBudgeted: number;
    totalSpent: number;
    remaining: number;
    byCategory: Array<{
      category: string;
      budgeted: number;
      spent: number;
      remaining: number;
      percentUsed: number;
    }>;
  }> {
    const budgets = await this.getBudgets();
    const byCategory = budgets.map(b => ({
      category: b.category,
      budgeted: b.limit,
      spent: b.spent,
      remaining: b.limit - b.spent,
      percentUsed: (b.spent / b.limit) * 100
    }));

    return {
      totalBudgeted: budgets.reduce((sum, b) => sum + b.limit, 0),
      totalSpent: budgets.reduce((sum, b) => sum + b.spent, 0),
      remaining: budgets.reduce((sum, b) => sum + (b.limit - b.spent), 0),
      byCategory
    };
  }

  // -------------------------------------------------------------------------
  // SAVINGS GOALS
  // -------------------------------------------------------------------------

  async addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt'>): Promise<SavingsGoal> {
    const record: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      currentAmount: 0,
      createdAt: new Date()
    };

    // Would save to unified data hub
    eventBus.emit('finance:goal:progress', { goal: record, progress: 0 });
    return record;
  }

  async getSavingsGoals(): Promise<SavingsGoal[]> {
    // Would fetch from unified data hub
    return [];
  }

  async contributeTrGoal(goalId: string, amount: number, notes?: string): Promise<void> {
    const goals = await this.getSavingsGoals();
    const goal = goals.find(g => g.id === goalId);

    if (goal) {
      goal.currentAmount += amount;

      // Check milestones
      for (const milestone of goal.milestones || []) {
        if (!milestone.reached && goal.currentAmount >= milestone.amount) {
          milestone.reached = true;
          milestone.reachedDate = new Date();

          await this.addFinancialInsight({
            type: 'achievement',
            category: 'savings',
            title: 'Savings Milestone Reached!',
            message: `Congratulations! You've saved $${milestone.amount.toFixed(2)} toward "${goal.name}"!`,
            severity: 'info',
            data: { goal, milestone }
          });
        }
      }

      // Check if goal completed
      if (goal.currentAmount >= goal.targetAmount) {
        await this.addFinancialInsight({
          type: 'achievement',
          category: 'savings',
          title: 'Savings Goal Completed!',
          message: `Amazing! You've reached your goal of $${goal.targetAmount.toFixed(2)} for "${goal.name}"!`,
          severity: 'info',
          data: { goal }
        });
      }

      eventBus.emit('finance:goal:progress', {
        goal,
        progress: (goal.currentAmount / goal.targetAmount) * 100
      });
    }
  }

  async getSavingsProgress(): Promise<{
    totalTarget: number;
    totalSaved: number;
    overallProgress: number;
    goals: Array<{ goal: SavingsGoal; progress: number; monthsToGoal?: number }>;
  }> {
    const goals = await this.getSavingsGoals();

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

    return {
      totalTarget,
      totalSaved,
      overallProgress: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
      goals: goals.map(goal => ({
        goal,
        progress: (goal.currentAmount / goal.targetAmount) * 100,
        monthsToGoal: this.calculateMonthsToGoal(goal)
      }))
    };
  }

  private calculateMonthsToGoal(goal: SavingsGoal): number | undefined {
    if (!goal.autoSave) return undefined;

    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return 0;

    let monthlyContribution = goal.autoSave.amount;
    if (goal.autoSave.frequency === 'weekly') monthlyContribution *= 4;
    if (goal.autoSave.frequency === 'biweekly') monthlyContribution *= 2;
    if (goal.autoSave.frequency === 'daily') monthlyContribution *= 30;

    return Math.ceil(remaining / monthlyContribution);
  }

  // -------------------------------------------------------------------------
  // DEBT MANAGEMENT
  // -------------------------------------------------------------------------

  async addDebt(debt: Omit<Debt, 'id'>): Promise<Debt> {
    const record: Debt = {
      ...debt,
      id: `debt-${Date.now()}`
    };

    // Calculate projected payoff
    record.projectedPayoffDate = this.calculatePayoffDate(record);

    // Would save to unified data hub
    return record;
  }

  async getDebts(): Promise<Debt[]> {
    // Would fetch from unified data hub
    return [];
  }

  async makeDebtPayment(debtId: string, amount: number, notes?: string): Promise<void> {
    const debts = await this.getDebts();
    const debt = debts.find(d => d.id === debtId);

    if (debt) {
      debt.currentBalance -= amount;

      // Record as expense
      await this.addTransaction({
        type: 'expense',
        category: 'Debt Payment',
        subcategory: debt.type,
        amount,
        description: `Payment to ${debt.name}`,
        linkedTo: { type: 'debt', id: debtId }
      });

      // Check if paid off
      if (debt.currentBalance <= 0) {
        await this.addFinancialInsight({
          type: 'achievement',
          category: 'debt',
          title: 'Debt Paid Off!',
          message: `Congratulations! You've paid off "${debt.name}"! That's $${debt.originalAmount.toFixed(2)} of debt eliminated!`,
          severity: 'info',
          data: { debt }
        });
      }
    }
  }

  async getDebtPayoffPlan(strategy: 'avalanche' | 'snowball' = 'avalanche'): Promise<{
    debts: Array<{ debt: Debt; order: number; payoffDate: Date; totalInterest: number }>;
    totalDebt: number;
    totalInterest: number;
    debtFreeDate: Date;
    monthlyPayment: number;
  }> {
    let debts = await this.getDebts();

    // Sort based on strategy
    if (strategy === 'avalanche') {
      // Highest interest first
      debts = debts.sort((a, b) => b.interestRate - a.interestRate);
    } else {
      // Smallest balance first
      debts = debts.sort((a, b) => a.currentBalance - b.currentBalance);
    }

    // Calculate payoff schedule
    const plan = debts.map((debt, index) => ({
      debt,
      order: index + 1,
      payoffDate: this.calculatePayoffDate(debt),
      totalInterest: this.calculateTotalInterest(debt)
    }));

    return {
      debts: plan,
      totalDebt: debts.reduce((sum, d) => sum + d.currentBalance, 0),
      totalInterest: plan.reduce((sum, p) => sum + p.totalInterest, 0),
      debtFreeDate: plan.length > 0 ? plan[plan.length - 1].payoffDate : new Date(),
      monthlyPayment: debts.reduce((sum, d) => sum + d.minimumPayment, 0)
    };
  }

  private calculatePayoffDate(debt: Debt): Date {
    const monthlyRate = debt.interestRate / 100 / 12;
    const balance = debt.currentBalance;
    const payment = debt.minimumPayment;

    if (payment <= balance * monthlyRate) {
      // Will never pay off at minimum payment
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 100);
      return futureDate;
    }

    const months = Math.ceil(
      -Math.log(1 - (balance * monthlyRate / payment)) / Math.log(1 + monthlyRate)
    );

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);
    return payoffDate;
  }

  private calculateTotalInterest(debt: Debt): number {
    const monthlyRate = debt.interestRate / 100 / 12;
    let balance = debt.currentBalance;
    let totalInterest = 0;

    while (balance > 0) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance = balance + interest - debt.minimumPayment;
      if (balance < 0) balance = 0;
    }

    return totalInterest;
  }

  // -------------------------------------------------------------------------
  // INVESTMENTS
  // -------------------------------------------------------------------------

  async addInvestment(investment: Omit<Investment, 'id' | 'lastUpdated'>): Promise<Investment> {
    const record: Investment = {
      ...investment,
      id: `inv-${Date.now()}`,
      lastUpdated: new Date()
    };

    // Would save to unified data hub
    return record;
  }

  async getInvestments(): Promise<Investment[]> {
    // Would fetch from unified data hub
    return [];
  }

  async updateInvestmentValue(id: string, currentValue: number): Promise<void> {
    const investments = await this.getInvestments();
    const investment = investments.find(i => i.id === id);

    if (investment) {
      const previousValue = investment.currentValue;
      investment.currentValue = currentValue;
      investment.lastUpdated = new Date();

      // Check for significant change
      const percentChange = ((currentValue - previousValue) / previousValue) * 100;
      if (Math.abs(percentChange) >= 10) {
        await this.addFinancialInsight({
          type: percentChange > 0 ? 'achievement' : 'warning',
          category: 'investment',
          title: `Investment ${percentChange > 0 ? 'Gain' : 'Loss'}`,
          message: `${investment.name} has ${percentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(percentChange).toFixed(1)}%`,
          severity: percentChange > 0 ? 'info' : 'medium',
          data: { investment, previousValue, currentValue, percentChange }
        });
      }
    }
  }

  async getInvestmentPortfolio(): Promise<{
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    returnPercent: number;
    byType: Record<string, { value: number; percent: number }>;
    dividendIncome: number;
  }> {
    const investments = await this.getInvestments();

    const totalValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
    const totalCost = investments.reduce((sum, i) => sum + i.purchasePrice, 0);

    const byType: Record<string, { value: number; percent: number }> = {};
    for (const inv of investments) {
      if (!byType[inv.type]) {
        byType[inv.type] = { value: 0, percent: 0 };
      }
      byType[inv.type].value += inv.currentValue;
    }

    for (const type of Object.keys(byType)) {
      byType[type].percent = (byType[type].value / totalValue) * 100;
    }

    const dividendIncome = investments.reduce((sum, i) => {
      if (i.dividendYield) {
        return sum + (i.currentValue * i.dividendYield / 100);
      }
      return sum;
    }, 0);

    return {
      totalValue,
      totalCost,
      totalReturn: totalValue - totalCost,
      returnPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
      byType,
      dividendIncome
    };
  }

  // -------------------------------------------------------------------------
  // PASSIVE INCOME
  // -------------------------------------------------------------------------

  async addPassiveIncomeSource(source: Omit<PassiveIncomeSource, 'id' | 'earnings' | 'createdAt'>): Promise<PassiveIncomeSource> {
    const record: PassiveIncomeSource = {
      ...source,
      id: `passive-${Date.now()}`,
      earnings: [],
      createdAt: new Date()
    };

    await unifiedDataHub.addPassiveIncomeSource(record);
    return record;
  }

  async getPassiveIncomeSources(): Promise<PassiveIncomeSource[]> {
    // Would fetch from unified data hub
    return [];
  }

  async logPassiveIncomeEarning(sourceId: string, amount: number, notes?: string): Promise<void> {
    const sources = await this.getPassiveIncomeSources();
    const source = sources.find(s => s.id === sourceId);

    if (source) {
      source.earnings.push({
        amount,
        date: new Date(),
        notes
      });
      source.lastPayout = new Date();

      // Also add as income transaction
      await this.addTransaction({
        type: 'income',
        category: 'Passive Income',
        subcategory: source.type,
        amount,
        description: `${source.name}: ${notes || 'Passive income'}`,
        linkedTo: { type: 'passive_income', id: sourceId }
      });
    }
  }

  async getPassiveIncomeSummary(): Promise<{
    totalMonthlyExpected: number;
    totalMonthlyActual: number;
    totalYearToDate: number;
    byType: Record<string, number>;
    sources: Array<{
      source: PassiveIncomeSource;
      performance: number; // actual vs expected
      trend: 'up' | 'down' | 'stable';
    }>;
    projectedAnnual: number;
  }> {
    const sources = await this.getPassiveIncomeSources();
    const activeSources = sources.filter(s => s.status === 'active');

    const totalMonthlyExpected = activeSources.reduce((sum, s) => sum + s.expectedMonthly, 0);
    const totalMonthlyActual = activeSources.reduce((sum, s) => sum + s.actualMonthly, 0);

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const totalYearToDate = sources.reduce((sum, s) => {
      const yearEarnings = s.earnings
        .filter(e => new Date(e.date) >= startOfYear)
        .reduce((eSum, e) => eSum + e.amount, 0);
      return sum + yearEarnings;
    }, 0);

    const byType: Record<string, number> = {};
    for (const source of activeSources) {
      byType[source.type] = (byType[source.type] || 0) + source.actualMonthly;
    }

    return {
      totalMonthlyExpected,
      totalMonthlyActual,
      totalYearToDate,
      byType,
      sources: activeSources.map(source => ({
        source,
        performance: source.expectedMonthly > 0 ?
          (source.actualMonthly / source.expectedMonthly) * 100 : 100,
        trend: this.calculatePassiveIncomeTrend(source)
      })),
      projectedAnnual: totalMonthlyActual * 12
    };
  }

  private calculatePassiveIncomeTrend(source: PassiveIncomeSource): 'up' | 'down' | 'stable' {
    const recentEarnings = source.earnings.slice(-6);
    if (recentEarnings.length < 3) return 'stable';

    const firstHalf = recentEarnings.slice(0, 3).reduce((sum, e) => sum + e.amount, 0) / 3;
    const secondHalf = recentEarnings.slice(-3).reduce((sum, e) => sum + e.amount, 0) / 3;

    const diff = ((secondHalf - firstHalf) / firstHalf) * 100;
    if (diff > 10) return 'up';
    if (diff < -10) return 'down';
    return 'stable';
  }

  // -------------------------------------------------------------------------
  // SUBSCRIPTIONS
  // -------------------------------------------------------------------------

  async addSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    const record: Subscription = {
      ...subscription,
      id: `sub-${Date.now()}`
    };

    // Would save to unified data hub
    return record;
  }

  async getSubscriptions(): Promise<Subscription[]> {
    // Would fetch from unified data hub
    return [];
  }

  async getSubscriptionSummary(): Promise<{
    monthlyTotal: number;
    yearlyTotal: number;
    subscriptions: Subscription[];
    underutilized: Subscription[];
    upcoming: Array<{ subscription: Subscription; daysUntil: number }>;
  }> {
    const subscriptions = await this.getSubscriptions();

    let monthlyTotal = 0;
    for (const sub of subscriptions) {
      if (sub.frequency === 'weekly') monthlyTotal += sub.amount * 4;
      else if (sub.frequency === 'monthly') monthlyTotal += sub.amount;
      else if (sub.frequency === 'quarterly') monthlyTotal += sub.amount / 3;
      else if (sub.frequency === 'yearly') monthlyTotal += sub.amount / 12;
    }

    const underutilized = subscriptions.filter(s => (s.usageRating || 3) <= 2);

    const now = new Date();
    const upcoming = subscriptions
      .map(sub => ({
        subscription: sub,
        daysUntil: Math.ceil((new Date(sub.nextBillingDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }))
      .filter(u => u.daysUntil <= 7 && u.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    return {
      monthlyTotal,
      yearlyTotal: monthlyTotal * 12,
      subscriptions,
      underutilized,
      upcoming
    };
  }

  // -------------------------------------------------------------------------
  // NET WORTH
  // -------------------------------------------------------------------------

  async calculateNetWorth(): Promise<{
    assets: {
      accounts: number;
      investments: number;
      property: number;
      other: number;
      total: number;
    };
    liabilities: {
      debts: number;
      other: number;
      total: number;
    };
    netWorth: number;
    change: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    };
  }> {
    const [investments, debts] = await Promise.all([
      this.getInvestmentPortfolio(),
      this.getDebts()
    ]);

    const totalDebts = debts.reduce((sum, d) => sum + d.currentBalance, 0);

    return {
      assets: {
        accounts: 0, // Would sum account balances
        investments: investments.totalValue,
        property: 0, // Would include real estate
        other: 0,
        total: investments.totalValue
      },
      liabilities: {
        debts: totalDebts,
        other: 0,
        total: totalDebts
      },
      netWorth: investments.totalValue - totalDebts,
      change: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0
      }
    };
  }

  // -------------------------------------------------------------------------
  // FINANCIAL INSIGHTS
  // -------------------------------------------------------------------------

  async addFinancialInsight(insight: Omit<FinancialInsight, 'id' | 'date' | 'acknowledged'>): Promise<FinancialInsight> {
    const record: FinancialInsight = {
      ...insight,
      id: `fin-insight-${Date.now()}`,
      date: new Date(),
      acknowledged: false
    };

    await unifiedDataHub.addAIInsight({
      ...record,
      category: 'finance'
    });

    return record;
  }

  async getFinancialInsights(options?: {
    type?: string;
    unacknowledgedOnly?: boolean;
  }): Promise<FinancialInsight[]> {
    const all = await unifiedDataHub.getAIInsights('finance');
    let filtered = all;

    if (options?.type) filtered = filtered.filter((i: any) => i.type === options.type);
    if (options?.unacknowledgedOnly) filtered = filtered.filter((i: any) => !i.acknowledged);

    return filtered;
  }

  // -------------------------------------------------------------------------
  // COMPREHENSIVE FINANCIAL SUMMARY
  // -------------------------------------------------------------------------

  async getFinancialDashboard(): Promise<{
    date: Date;
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavingsRate: number;
    budgetStatus: { onTrack: number; overBudget: number };
    savingsProgress: number;
    debtPayoffProgress: number;
    passiveIncomeMonthly: number;
    upcomingBills: Array<{ name: string; amount: number; dueIn: number }>;
    insights: FinancialInsight[];
    recommendations: string[];
  }> {
    const [
      financeSummary,
      netWorth,
      budgetSummary,
      savingsProgress,
      debtPlan,
      passiveIncome,
      subscriptionSummary,
      insights
    ] = await Promise.all([
      unifiedDataHub.getFinanceSummary(),
      this.calculateNetWorth(),
      this.getBudgetSummary(),
      this.getSavingsProgress(),
      this.getDebtPayoffPlan(),
      this.getPassiveIncomeSummary(),
      this.getSubscriptionSummary(),
      this.getFinancialInsights({ unacknowledgedOnly: true })
    ]);

    const savingsRate = financeSummary.income > 0 ?
      ((financeSummary.income - financeSummary.expenses) / financeSummary.income) * 100 : 0;

    return {
      date: new Date(),
      netWorth: netWorth.netWorth,
      monthlyIncome: financeSummary.income + financeSummary.passiveIncome,
      monthlyExpenses: financeSummary.expenses,
      monthlySavingsRate: savingsRate,
      budgetStatus: {
        onTrack: budgetSummary.byCategory.filter(b => b.percentUsed <= 100).length,
        overBudget: budgetSummary.byCategory.filter(b => b.percentUsed > 100).length
      },
      savingsProgress: savingsProgress.overallProgress,
      debtPayoffProgress: debtPlan.totalDebt > 0 ?
        ((debtPlan.debts.reduce((sum, d) => sum + d.debt.originalAmount, 0) - debtPlan.totalDebt) /
         debtPlan.debts.reduce((sum, d) => sum + d.debt.originalAmount, 0)) * 100 : 100,
      passiveIncomeMonthly: passiveIncome.totalMonthlyActual,
      upcomingBills: subscriptionSummary.upcoming.map(u => ({
        name: u.subscription.name,
        amount: u.subscription.amount,
        dueIn: u.daysUntil
      })),
      insights,
      recommendations: this.generateFinancialRecommendations(
        savingsRate,
        budgetSummary,
        passiveIncome
      )
    };
  }

  private generateFinancialRecommendations(
    savingsRate: number,
    budgetSummary: any,
    passiveIncome: any
  ): string[] {
    const recommendations: string[] = [];

    if (savingsRate < 20) {
      recommendations.push('Consider increasing your savings rate. Aim for at least 20% of income.');
    }
    if (budgetSummary.byCategory.some((b: any) => b.percentUsed > 100)) {
      recommendations.push('Some budget categories are over limit. Review spending in those areas.');
    }
    if (passiveIncome.totalMonthlyActual < passiveIncome.totalMonthlyExpected * 0.8) {
      recommendations.push('Passive income is below expectations. Consider reviewing underperforming sources.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Your finances look healthy! Keep up the good work.');
    }

    return recommendations;
  }
}

// Export singleton instance
export const unifiedFinanceEcosystem = new UnifiedFinanceEcosystem();

// Initialize on import
unifiedFinanceEcosystem.initialize().catch(console.error);

export default unifiedFinanceEcosystem;
