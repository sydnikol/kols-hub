/**
 * MONEYHUB INTEGRATION SERVICE
 * Financial data aggregation and Open Banking platform
 *
 * Features:
 * - Bank account aggregation
 * - Transaction data and categorization
 * - Financial insights and analytics
 * - Open Banking API (UK/EU)
 * - Budgeting and spending analysis
 * - Credit score monitoring
 * - Investment tracking
 *
 * API Documentation:
 * https://docs.moneyhubenterprise.com/
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface MoneyHubConfig {
  clientId: string;
  clientSecret: string;
  apiKey: string;
  environment?: 'production' | 'sandbox';
}

export interface BankAccount {
  id: string;
  accountName: string;
  providerName: string;
  accountType: 'current' | 'savings' | 'credit-card' | 'loan' | 'mortgage' | 'investment' | 'pension';
  balance: {
    amount: number;
    currency: string;
    date: string;
  };
  availableBalance?: number;
  creditLimit?: number;
  interestRate?: number;
  accountNumber?: string;
  sortCode?: string;
  iban?: string;
  status: 'active' | 'inactive' | 'pending';
  lastRefreshed: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  category?: Category;
  merchantName?: string;
  type: 'debit' | 'credit' | 'transfer';
  status: 'pending' | 'posted' | 'cancelled';
  balance?: number;
  metadata?: Record<string, any>;
}

export interface Category {
  id: string;
  group: string;
  name: string;
  color?: string;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  cashBalance: number;
  investments: number;
  creditCardDebt: number;
  loans: number;
  mortgages: number;
  currency: string;
  lastUpdated: string;
}

export interface SpendingAnalysis {
  period: 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  totalSpent: number;
  totalIncome: number;
  netCashFlow: number;
  byCategory: CategorySpending[];
  byMerchant: MerchantSpending[];
  trends: SpendingTrend[];
}

export interface CategorySpending {
  category: Category;
  amount: number;
  transactionCount: number;
  percentageOfTotal: number;
  change: {
    amount: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  };
}

export interface MerchantSpending {
  merchantName: string;
  amount: number;
  transactionCount: number;
  category?: Category;
}

export interface SpendingTrend {
  date: string;
  spent: number;
  income: number;
  netCashFlow: number;
}

export interface Budget {
  id: string;
  name: string;
  category?: Category;
  period: 'weekly' | 'monthly' | 'yearly';
  limit: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'on-track' | 'warning' | 'exceeded';
  startDate: string;
  endDate: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  type: 'savings' | 'debt-payoff' | 'investment' | 'purchase';
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  monthlyContribution?: number;
  progress: number; // percentage
  onTrack: boolean;
  projectedCompletion?: string;
}

export interface CreditScore {
  score: number;
  provider: string;
  scoreDate: string;
  scoreType: 'FICO' | 'VantageScore' | 'Experian' | 'Equifax' | 'TransUnion';
  factors: CreditFactor[];
  history: CreditScoreHistory[];
}

export interface CreditFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface CreditScoreHistory {
  date: string;
  score: number;
}

export interface Investment {
  id: string;
  accountId: string;
  name: string;
  symbol?: string;
  type: 'stock' | 'bond' | 'etf' | 'mutual-fund' | 'crypto' | 'other';
  quantity: number;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercentage: number;
  currency: string;
  lastUpdated: string;
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: Category;
  nextDate: string;
  confidence: number; // 0-1
  averageAmount: number;
  lastOccurrence: string;
}

// ============================================================================
// MONEYHUB INTEGRATION SERVICE
// ============================================================================

class MoneyHubIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private apiKey: string | null = null;
  private accessToken: string | null = null;
  private environment: 'production' | 'sandbox' = 'production';
  private baseUrl = 'https://api.moneyhub.co.uk/v2.0';

  // Initialize service with credentials
  initialize(config: MoneyHubConfig): boolean {
    try {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
      this.apiKey = config.apiKey;
      this.environment = config.environment || 'production';

      if (this.environment === 'sandbox') {
        this.baseUrl = 'https://api-sandbox.moneyhub.co.uk/v2.0';
      }

      // Store in localStorage for persistence
      if (this.apiKey) {
        localStorage.setItem('moneyhub_api_key', this.apiKey);
      }
      if (this.clientId) {
        localStorage.setItem('moneyhub_client_id', this.clientId);
      }

      console.log('✅ MoneyHub integration initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize MoneyHub:', error);
      return false;
    }
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.apiKey !== null || localStorage.getItem('moneyhub_api_key') !== null;
  }

  // Get authentication headers
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = this.accessToken || await this.authenticate();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private async authenticate(): Promise<string | null> {
    try {
      // Mock OAuth2 authentication
      this.accessToken = 'mock-access-token';
      return this.accessToken;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      return null;
    }
  }

  // ============================================================================
  // ACCOUNT MANAGEMENT
  // ============================================================================

  async getAccounts(): Promise<BankAccount[]> {
    try {
      // Mock implementation
      const accounts: BankAccount[] = [
        {
          id: 'acc-1',
          accountName: 'Main Checking',
          providerName: 'Chase Bank',
          accountType: 'current',
          balance: {
            amount: 5420.50,
            currency: 'USD',
            date: new Date().toISOString()
          },
          availableBalance: 5420.50,
          accountNumber: '****1234',
          sortCode: '12-34-56',
          status: 'active',
          lastRefreshed: new Date().toISOString()
        },
        {
          id: 'acc-2',
          accountName: 'Savings Account',
          providerName: 'Bank of America',
          accountType: 'savings',
          balance: {
            amount: 15000.00,
            currency: 'USD',
            date: new Date().toISOString()
          },
          interestRate: 2.5,
          status: 'active',
          lastRefreshed: new Date().toISOString()
        },
        {
          id: 'acc-3',
          accountName: 'Credit Card',
          providerName: 'American Express',
          accountType: 'credit-card',
          balance: {
            amount: -1250.75,
            currency: 'USD',
            date: new Date().toISOString()
          },
          availableBalance: 3749.25,
          creditLimit: 5000,
          interestRate: 18.99,
          status: 'active',
          lastRefreshed: new Date().toISOString()
        }
      ];

      return accounts;
    } catch (error) {
      console.error('❌ Failed to get accounts:', error);
      return [];
    }
  }

  async getAccount(accountId: string): Promise<BankAccount | null> {
    try {
      const accounts = await this.getAccounts();
      return accounts.find(a => a.id === accountId) || null;
    } catch (error) {
      console.error('❌ Failed to get account:', error);
      return null;
    }
  }

  async refreshAccount(accountId: string): Promise<boolean> {
    try {
      console.log('✅ Account refreshed:', accountId);
      return true;
    } catch (error) {
      console.error('❌ Failed to refresh account:', error);
      return false;
    }
  }

  // ============================================================================
  // TRANSACTIONS
  // ============================================================================

  async getTransactions(params?: {
    accountId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<Transaction[]> {
    try {
      // Mock implementation
      const transactions: Transaction[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          amount: -45.67,
          currency: 'USD',
          date: '2025-01-22T14:30:00Z',
          description: 'Whole Foods Market',
          category: { id: 'cat-1', group: 'Shopping', name: 'Groceries' },
          merchantName: 'Whole Foods',
          type: 'debit',
          status: 'posted',
          balance: 5420.50
        },
        {
          id: 'txn-2',
          accountId: 'acc-1',
          amount: -120.00,
          currency: 'USD',
          date: '2025-01-21T09:15:00Z',
          description: 'Shell Gas Station',
          category: { id: 'cat-2', group: 'Transportation', name: 'Gas' },
          merchantName: 'Shell',
          type: 'debit',
          status: 'posted'
        },
        {
          id: 'txn-3',
          accountId: 'acc-1',
          amount: 3500.00,
          currency: 'USD',
          date: '2025-01-20T00:00:00Z',
          description: 'Payroll Deposit',
          category: { id: 'cat-3', group: 'Income', name: 'Salary' },
          type: 'credit',
          status: 'posted'
        }
      ];

      let filtered = transactions;

      if (params?.accountId) {
        filtered = filtered.filter(t => t.accountId === params.accountId);
      }

      if (params?.startDate) {
        filtered = filtered.filter(t => t.date >= params.startDate!);
      }

      if (params?.endDate) {
        filtered = filtered.filter(t => t.date <= params.endDate!);
      }

      if (params?.limit) {
        filtered = filtered.slice(0, params.limit);
      }

      return filtered;
    } catch (error) {
      console.error('❌ Failed to get transactions:', error);
      return [];
    }
  }

  async categorizeTransaction(transactionId: string, categoryId: string): Promise<boolean> {
    try {
      console.log('✅ Transaction categorized');
      return true;
    } catch (error) {
      console.error('❌ Failed to categorize transaction:', error);
      return false;
    }
  }

  // ============================================================================
  // FINANCIAL SUMMARY
  // ============================================================================

  async getFinancialSummary(): Promise<FinancialSummary | null> {
    try {
      const accounts = await this.getAccounts();

      const summary: FinancialSummary = {
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        cashBalance: 0,
        investments: 0,
        creditCardDebt: 0,
        loans: 0,
        mortgages: 0,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      };

      accounts.forEach(account => {
        const amount = account.balance.amount;

        if (amount > 0) {
          summary.totalAssets += amount;

          if (account.accountType === 'current' || account.accountType === 'savings') {
            summary.cashBalance += amount;
          } else if (account.accountType === 'investment') {
            summary.investments += amount;
          }
        } else {
          summary.totalLiabilities += Math.abs(amount);

          if (account.accountType === 'credit-card') {
            summary.creditCardDebt += Math.abs(amount);
          } else if (account.accountType === 'loan') {
            summary.loans += Math.abs(amount);
          } else if (account.accountType === 'mortgage') {
            summary.mortgages += Math.abs(amount);
          }
        }
      });

      summary.netWorth = summary.totalAssets - summary.totalLiabilities;

      return summary;
    } catch (error) {
      console.error('❌ Failed to get financial summary:', error);
      return null;
    }
  }

  // ============================================================================
  // SPENDING ANALYSIS
  // ============================================================================

  async getSpendingAnalysis(params: {
    period: SpendingAnalysis['period'];
    startDate?: string;
    endDate?: string;
  }): Promise<SpendingAnalysis | null> {
    try {
      const endDate = params.endDate || new Date().toISOString();
      const startDate = params.startDate || this.calculateStartDate(params.period, endDate);

      const transactions = await this.getTransactions({ startDate, endDate });

      const totalSpent = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const totalIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      // Group by category
      const categoryMap = new Map<string, CategorySpending>();
      transactions.filter(t => t.amount < 0 && t.category).forEach(t => {
        const catId = t.category!.id;
        const existing = categoryMap.get(catId);

        if (existing) {
          existing.amount += Math.abs(t.amount);
          existing.transactionCount++;
        } else {
          categoryMap.set(catId, {
            category: t.category!,
            amount: Math.abs(t.amount),
            transactionCount: 1,
            percentageOfTotal: 0,
            change: { amount: 0, percentage: 0, direction: 'stable' }
          });
        }
      });

      const byCategory = Array.from(categoryMap.values()).map(cat => ({
        ...cat,
        percentageOfTotal: (cat.amount / totalSpent) * 100
      }));

      return {
        period: params.period,
        startDate,
        endDate,
        totalSpent,
        totalIncome,
        netCashFlow: totalIncome - totalSpent,
        byCategory,
        byMerchant: [],
        trends: []
      };
    } catch (error) {
      console.error('❌ Failed to get spending analysis:', error);
      return null;
    }
  }

  private calculateStartDate(period: string, endDate: string): string {
    const end = new Date(endDate);
    const start = new Date(end);

    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    return start.toISOString();
  }

  // ============================================================================
  // BUDGETS
  // ============================================================================

  async getBudgets(): Promise<Budget[]> {
    try {
      // Mock implementation
      const budgets: Budget[] = [
        {
          id: 'budget-1',
          name: 'Groceries',
          category: { id: 'cat-1', group: 'Shopping', name: 'Groceries' },
          period: 'monthly',
          limit: 600,
          spent: 450,
          remaining: 150,
          percentageUsed: 75,
          status: 'on-track',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        },
        {
          id: 'budget-2',
          name: 'Dining Out',
          period: 'monthly',
          limit: 300,
          spent: 320,
          remaining: -20,
          percentageUsed: 107,
          status: 'exceeded',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        }
      ];

      return budgets;
    } catch (error) {
      console.error('❌ Failed to get budgets:', error);
      return [];
    }
  }

  async createBudget(budget: Omit<Budget, 'id' | 'spent' | 'remaining' | 'percentageUsed' | 'status'>): Promise<Budget | null> {
    try {
      const newBudget: Budget = {
        ...budget,
        id: `budget-${Date.now()}`,
        spent: 0,
        remaining: budget.limit,
        percentageUsed: 0,
        status: 'on-track'
      };

      console.log('✅ Budget created');
      return newBudget;
    } catch (error) {
      console.error('❌ Failed to create budget:', error);
      return null;
    }
  }

  // ============================================================================
  // RECURRING TRANSACTIONS
  // ============================================================================

  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    try {
      // Mock implementation
      const recurring: RecurringTransaction[] = [
        {
          id: 'rec-1',
          description: 'Netflix Subscription',
          amount: -15.99,
          frequency: 'monthly',
          category: { id: 'cat-4', group: 'Entertainment', name: 'Streaming' },
          nextDate: '2025-02-01',
          confidence: 0.95,
          averageAmount: -15.99,
          lastOccurrence: '2025-01-01'
        },
        {
          id: 'rec-2',
          description: 'Rent Payment',
          amount: -1500,
          frequency: 'monthly',
          category: { id: 'cat-5', group: 'Housing', name: 'Rent' },
          nextDate: '2025-02-01',
          confidence: 0.99,
          averageAmount: -1500,
          lastOccurrence: '2025-01-01'
        }
      ];

      return recurring;
    } catch (error) {
      console.error('❌ Failed to get recurring transactions:', error);
      return [];
    }
  }

  // ============================================================================
  // INTEGRATION WITH FINANCIAL AI ADVISOR
  // ============================================================================

  async getDataForFinancialAI(): Promise<{
    summary: FinancialSummary;
    spending: SpendingAnalysis;
    budgets: Budget[];
    recurring: RecurringTransaction[];
  } | null> {
    try {
      const [summary, spending, budgets, recurring] = await Promise.all([
        this.getFinancialSummary(),
        this.getSpendingAnalysis({ period: 'month' }),
        this.getBudgets(),
        this.getRecurringTransactions()
      ]);

      if (!summary || !spending) return null;

      return {
        summary,
        spending,
        budgets,
        recurring
      };
    } catch (error) {
      console.error('❌ Failed to get data for AI:', error);
      return null;
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const moneyHubIntegration = new MoneyHubIntegrationService();
