/**
 * Frollo Integration Service
 *
 * Frollo provides financial data aggregation, open banking, and personal finance management.
 * Enables connection to 200+ Australian banks and financial institutions.
 *
 * Features:
 * - Account aggregation (bank accounts, credit cards, loans)
 * - Transaction data and categorization
 * - Goals and budgeting
 * - Bill tracking and predictions
 * - Financial insights and reports
 * - Open Banking (CDR) compliance
 *
 * API Documentation: https://developer.frollo.com.au/
 * Value: Part of Australia's $26B+ Open Banking ecosystem
 */

interface FrolloConfig {
  apiKey: string;
  clientId: string;
  environment?: 'sandbox' | 'production';
}

interface FrolloAccount {
  id: string;
  accountName: string;
  accountNumber?: string;
  bsb?: string;
  accountType: 'bank_account' | 'credit_card' | 'loan' | 'savings';
  balance: {
    current: number;
    available: number;
    currency: string;
  };
  providerName: string;
  status: 'active' | 'inactive' | 'closed';
  lastRefreshed: string;
}

interface FrolloTransaction {
  id: string;
  accountId: string;
  transactionDate: string;
  description: string;
  amount: number;
  currency: string;
  category: {
    id: string;
    name: string;
    icon?: string;
  };
  merchant?: {
    name: string;
    logo?: string;
  };
  status: 'posted' | 'pending';
  type: 'debit' | 'credit';
}

interface FrolloGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  frequency?: 'once' | 'weekly' | 'monthly' | 'yearly';
  status: 'active' | 'completed' | 'paused';
  accountIds: string[];
}

interface FrolloBudget {
  id: string;
  categoryId: string;
  categoryName: string;
  periodAmount: number;
  currentAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  status: 'under' | 'near' | 'over';
  startDate: string;
  endDate: string;
}

interface FrolloBill {
  id: string;
  name: string;
  description?: string;
  billType: 'recurring' | 'one_off';
  amount?: number;
  dueDate: string;
  frequency?: 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly';
  categoryId: string;
  status: 'paid' | 'unpaid' | 'overdue';
  isPredicted: boolean;
}

interface FrolloInsights {
  cashFlowSummary: {
    income: number;
    expenses: number;
    netCashFlow: number;
    period: string;
  };
  topSpendingCategories: Array<{
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  spendingTrends: Array<{
    period: string;
    amount: number;
    change: number;
  }>;
  savingsRate: number;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
}

interface FrolloProvider {
  id: string;
  name: string;
  logo?: string;
  status: 'available' | 'maintenance' | 'unavailable';
  authType: 'credentials' | 'oauth';
  products: string[];
  popular: boolean;
}

interface FrolloUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateJoined: string;
  lastLoggedIn: string;
  emailVerified: boolean;
  status: 'active' | 'suspended';
}

class FrolloIntegrationService {
  private apiKey: string | null = null;
  private clientId: string | null = null;
  private environment: 'sandbox' | 'production' = 'sandbox';
  private baseUrl = 'https://api.frollo.com.au/v2';

  /**
   * Initialize Frollo integration with API credentials
   */
  initialize(config: FrolloConfig): void {
    this.apiKey = config.apiKey;
    this.clientId = config.clientId;
    this.environment = config.environment || 'sandbox';

    if (this.environment === 'production') {
      this.baseUrl = 'https://api.frollo.com.au/v2';
    } else {
      this.baseUrl = 'https://api-sandbox.frollo.com.au/v2';
    }

    // Store in localStorage
    localStorage.setItem('frollo_api_key', config.apiKey);
    localStorage.setItem('frollo_client_id', config.clientId);
    localStorage.setItem('frollo_environment', this.environment);
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.clientId);
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Client-ID': this.clientId || '',
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<FrolloUser | null> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return null;
    }

    try {
      // Mock implementation - replace with real API call
      return {
        id: 'user_123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Smith',
        dateJoined: '2024-01-15T10:00:00Z',
        lastLoggedIn: new Date().toISOString(),
        emailVerified: true,
        status: 'active'
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Get all connected accounts
   */
  async getAccounts(): Promise<FrolloAccount[]> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return [];
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /aggregation/accounts
      return [
        {
          id: 'acc_001',
          accountName: 'Everyday Transaction Account',
          accountNumber: '12345678',
          bsb: '123-456',
          accountType: 'bank_account',
          balance: {
            current: 3420.50,
            available: 3420.50,
            currency: 'AUD'
          },
          providerName: 'Commonwealth Bank',
          status: 'active',
          lastRefreshed: new Date().toISOString()
        },
        {
          id: 'acc_002',
          accountName: 'Credit Card',
          accountType: 'credit_card',
          balance: {
            current: -850.25,
            available: 4149.75,
            currency: 'AUD'
          },
          providerName: 'NAB',
          status: 'active',
          lastRefreshed: new Date().toISOString()
        },
        {
          id: 'acc_003',
          accountName: 'Savings Account',
          accountType: 'savings',
          balance: {
            current: 12500.00,
            available: 12500.00,
            currency: 'AUD'
          },
          providerName: 'ING',
          status: 'active',
          lastRefreshed: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
  }

  /**
   * Get transactions for an account
   */
  async getTransactions(accountId: string, params?: {
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<FrolloTransaction[]> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return [];
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /aggregation/transactions
      return [
        {
          id: 'txn_001',
          accountId,
          transactionDate: '2025-01-22T09:30:00Z',
          description: 'Woolworths Sydney',
          amount: -87.45,
          currency: 'AUD',
          category: {
            id: 'cat_groceries',
            name: 'Groceries',
            icon: '🛒'
          },
          merchant: {
            name: 'Woolworths',
            logo: 'https://example.com/woolworths.png'
          },
          status: 'posted',
          type: 'debit'
        },
        {
          id: 'txn_002',
          accountId,
          transactionDate: '2025-01-21T14:15:00Z',
          description: 'Salary Payment',
          amount: 3500.00,
          currency: 'AUD',
          category: {
            id: 'cat_income',
            name: 'Income'
          },
          status: 'posted',
          type: 'credit'
        },
        {
          id: 'txn_003',
          accountId,
          transactionDate: '2025-01-20T19:45:00Z',
          description: 'Netflix Subscription',
          amount: -16.99,
          currency: 'AUD',
          category: {
            id: 'cat_entertainment',
            name: 'Entertainment',
            icon: '🎬'
          },
          merchant: {
            name: 'Netflix'
          },
          status: 'posted',
          type: 'debit'
        }
      ];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  /**
   * Get all goals
   */
  async getGoals(): Promise<FrolloGoal[]> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return [];
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /goals
      return [
        {
          id: 'goal_001',
          name: 'Emergency Fund',
          description: 'Build 6 months of expenses',
          targetAmount: 20000,
          currentAmount: 12500,
          targetDate: '2025-12-31',
          frequency: 'monthly',
          status: 'active',
          accountIds: ['acc_003']
        },
        {
          id: 'goal_002',
          name: 'Holiday to Japan',
          targetAmount: 8000,
          currentAmount: 3200,
          targetDate: '2025-09-01',
          frequency: 'weekly',
          status: 'active',
          accountIds: ['acc_003']
        }
      ];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  /**
   * Create a new goal
   */
  async createGoal(goal: Omit<FrolloGoal, 'id' | 'currentAmount' | 'status'>): Promise<FrolloGoal | null> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return null;
    }

    try {
      // Mock implementation - replace with real API call
      // Real: POST /goals
      return {
        id: `goal_${Date.now()}`,
        ...goal,
        currentAmount: 0,
        status: 'active'
      };
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  }

  /**
   * Get all budgets
   */
  async getBudgets(): Promise<FrolloBudget[]> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return [];
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /budgets
      return [
        {
          id: 'budget_001',
          categoryId: 'cat_groceries',
          categoryName: 'Groceries',
          periodAmount: 600,
          currentAmount: 387.45,
          period: 'monthly',
          status: 'under',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        },
        {
          id: 'budget_002',
          categoryId: 'cat_dining',
          categoryName: 'Dining Out',
          periodAmount: 200,
          currentAmount: 215.80,
          period: 'monthly',
          status: 'over',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        },
        {
          id: 'budget_003',
          categoryId: 'cat_transport',
          categoryName: 'Transport',
          periodAmount: 300,
          currentAmount: 275.00,
          period: 'monthly',
          status: 'near',
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        }
      ];
    } catch (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }
  }

  /**
   * Get bills and predictions
   */
  async getBills(params?: { upcoming?: boolean }): Promise<FrolloBill[]> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return [];
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /bills
      return [
        {
          id: 'bill_001',
          name: 'Electricity',
          billType: 'recurring',
          amount: 180.50,
          dueDate: '2025-02-05',
          frequency: 'monthly',
          categoryId: 'cat_utilities',
          status: 'unpaid',
          isPredicted: false
        },
        {
          id: 'bill_002',
          name: 'Internet',
          billType: 'recurring',
          amount: 79.99,
          dueDate: '2025-02-10',
          frequency: 'monthly',
          categoryId: 'cat_utilities',
          status: 'unpaid',
          isPredicted: false
        },
        {
          id: 'bill_003',
          name: 'Phone Bill',
          description: 'Predicted based on usage',
          billType: 'recurring',
          amount: 65.00,
          dueDate: '2025-02-15',
          frequency: 'monthly',
          categoryId: 'cat_utilities',
          status: 'unpaid',
          isPredicted: true
        }
      ];
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  }

  /**
   * Get financial insights and reports
   */
  async getInsights(period?: 'week' | 'month' | 'year'): Promise<FrolloInsights | null> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return null;
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /reports
      return {
        cashFlowSummary: {
          income: 3500.00,
          expenses: 2347.89,
          netCashFlow: 1152.11,
          period: 'January 2025'
        },
        topSpendingCategories: [
          { categoryName: 'Groceries', amount: 587.45, percentage: 25.0 },
          { categoryName: 'Transport', amount: 385.00, percentage: 16.4 },
          { categoryName: 'Dining Out', amount: 315.80, percentage: 13.5 },
          { categoryName: 'Utilities', amount: 280.50, percentage: 11.9 },
          { categoryName: 'Entertainment', amount: 179.14, percentage: 7.6 }
        ],
        spendingTrends: [
          { period: 'Nov 2024', amount: 2150.00, change: 0 },
          { period: 'Dec 2024', amount: 2789.00, change: 29.7 },
          { period: 'Jan 2025', amount: 2347.89, change: -15.8 }
        ],
        savingsRate: 32.9,
        averageMonthlyIncome: 3500.00,
        averageMonthlyExpenses: 2347.89
      };
    } catch (error) {
      console.error('Error fetching insights:', error);
      return null;
    }
  }

  /**
   * Get available financial providers
   */
  async getProviders(params?: { popular?: boolean }): Promise<FrolloProvider[]> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return [];
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /aggregation/providers
      return [
        {
          id: 'prov_cba',
          name: 'Commonwealth Bank',
          logo: 'https://example.com/cba.png',
          status: 'available',
          authType: 'credentials',
          products: ['bank_account', 'credit_card', 'loan'],
          popular: true
        },
        {
          id: 'prov_nab',
          name: 'NAB',
          logo: 'https://example.com/nab.png',
          status: 'available',
          authType: 'credentials',
          products: ['bank_account', 'credit_card'],
          popular: true
        },
        {
          id: 'prov_ing',
          name: 'ING',
          logo: 'https://example.com/ing.png',
          status: 'available',
          authType: 'oauth',
          products: ['bank_account', 'savings'],
          popular: true
        }
      ];
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  }

  /**
   * Refresh account data from provider
   */
  async refreshAccount(accountId: string): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Frollo not configured' };
    }

    try {
      // Mock implementation - replace with real API call
      // Real: POST /aggregation/accounts/{accountId}/refresh
      console.log(`Refreshing account ${accountId}...`);
      return {
        success: true,
        message: 'Account data refreshed successfully'
      };
    } catch (error) {
      console.error('Error refreshing account:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get data formatted for Financial AI Advisor integration
   */
  async getDataForFinancialAI(): Promise<{
    accounts: FrolloAccount[];
    transactions: FrolloTransaction[];
    budgets: FrolloBudget[];
    goals: FrolloGoal[];
    insights: FrolloInsights | null;
  } | null> {
    if (!this.isConfigured()) {
      console.error('Frollo not configured');
      return null;
    }

    try {
      const accounts = await this.getAccounts();
      const transactions = accounts.length > 0
        ? await this.getTransactions(accounts[0].id)
        : [];
      const budgets = await this.getBudgets();
      const goals = await this.getGoals();
      const insights = await this.getInsights('month');

      return {
        accounts,
        transactions,
        budgets,
        goals,
        insights
      };
    } catch (error) {
      console.error('Error getting data for Financial AI:', error);
      return null;
    }
  }
}

// Export singleton instance
export const frolloIntegration = new FrolloIntegrationService();
export default frolloIntegration;
