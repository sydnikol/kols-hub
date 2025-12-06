/**
 * Actual Budget Integration Service
 *
 * Actual is a super fast privacy-focused app for managing your finances.
 * Open-source, local-first budgeting with optional sync.
 *
 * Features:
 * - Envelope budgeting (similar to YNAB)
 * - Local-first data storage
 * - End-to-end encryption
 * - Bank sync capabilities
 * - Goal tracking
 * - Reports and trends
 * - Transaction rules
 * - Multi-device sync
 *
 * API Documentation: https://actualbudget.com/docs/
 * GitHub: https://github.com/actualbudget/actual
 * Value: Open-source budgeting solution
 */

interface ActualConfig {
  serverUrl?: string;  // Optional sync server
  password?: string;   // For encrypted sync
  budgetId?: string;
}

interface ActualAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'mortgage' | 'debt' | 'other';
  offBudget: boolean;
  closed: boolean;
  balance: number;
}

interface ActualCategory {
  id: string;
  name: string;
  groupId: string;
  groupName: string;
  budgeted: number;
  spent: number;
  balance: number;
  isIncome: boolean;
}

interface ActualTransaction {
  id: string;
  accountId: string;
  date: string;
  payee?: string;
  notes?: string;
  category?: string;
  amount: number;
  cleared: boolean;
  reconciled: boolean;
  transferId?: string;
}

interface ActualBudget {
  id: string;
  name: string;
  month: string;  // YYYY-MM format
  income: number;
  budgeted: number;
  spent: number;
  balance: number;
}

interface ActualPayee {
  id: string;
  name: string;
  category?: string;
  transferAccountId?: string;
}

interface ActualRule {
  id: string;
  stage: 'pre' | 'post';
  conditions: Array<{
    field: 'payee' | 'notes' | 'amount' | 'category';
    op: 'is' | 'contains' | 'isapprox' | 'gt' | 'gte' | 'lt' | 'lte';
    value: string | number;
  }>;
  actions: Array<{
    field: 'category' | 'payee' | 'notes';
    value: string;
  }>;
}

interface ActualGoal {
  type: 'target' | 'by' | 'spend' | 'percentage';
  amount?: number;
  month?: string;
}

interface ActualReport {
  type: 'spending' | 'net-worth' | 'cash-flow';
  data: Array<{
    date: string;
    value: number;
  }>;
  categories?: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

class ActualBudgetIntegrationService {
  private serverUrl: string | null = null;
  private password: string | null = null;
  private budgetId: string | null = null;
  private syncEnabled = false;

  /**
   * Initialize Actual Budget integration
   */
  initialize(config: ActualConfig): void {
    this.serverUrl = config.serverUrl || null;
    this.password = config.password || null;
    this.budgetId = config.budgetId || null;
    this.syncEnabled = !!(this.serverUrl && this.password);

    // Store in localStorage
    if (config.serverUrl) {
      localStorage.setItem('actual_server_url', config.serverUrl);
    }
    if (config.budgetId) {
      localStorage.setItem('actual_budget_id', config.budgetId);
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return this.syncEnabled;
  }

  /**
   * Get authentication headers for sync server
   */
  private getAuthHeaders(): HeadersInit {
    if (!this.password) return {};

    return {
      'X-ACTUAL-PASSWORD': this.password,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get all accounts
   */
  async getAccounts(): Promise<ActualAccount[]> {
    try {
      // Mock implementation - in real use, this would either:
      // 1. Read from local IndexedDB (local-first)
      // 2. Sync from server if configured
      return [
        {
          id: 'acc_checking',
          name: 'Checking Account',
          type: 'checking',
          offBudget: false,
          closed: false,
          balance: 3420.50
        },
        {
          id: 'acc_savings',
          name: 'Emergency Fund',
          type: 'savings',
          offBudget: false,
          closed: false,
          balance: 12500.00
        },
        {
          id: 'acc_credit',
          name: 'Credit Card',
          type: 'credit',
          offBudget: false,
          closed: false,
          balance: -850.25
        }
      ];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
  }

  /**
   * Get budget for a specific month
   */
  async getBudget(month: string): Promise<ActualBudget | null> {
    try {
      // Mock implementation
      // Real: Query local database or sync server
      return {
        id: `budget_${month}`,
        name: 'Monthly Budget',
        month,
        income: 3500.00,
        budgeted: 3200.00,
        spent: 2347.89,
        balance: 852.11
      };
    } catch (error) {
      console.error('Error fetching budget:', error);
      return null;
    }
  }

  /**
   * Get all categories with budget status
   */
  async getCategories(month?: string): Promise<ActualCategory[]> {
    try {
      // Mock implementation
      return [
        {
          id: 'cat_groceries',
          name: 'Groceries',
          groupId: 'group_everyday',
          groupName: 'Everyday Expenses',
          budgeted: 600,
          spent: 387.45,
          balance: 212.55,
          isIncome: false
        },
        {
          id: 'cat_rent',
          name: 'Rent',
          groupId: 'group_housing',
          groupName: 'Housing',
          budgeted: 1500,
          spent: 1500,
          balance: 0,
          isIncome: false
        },
        {
          id: 'cat_utilities',
          name: 'Utilities',
          groupId: 'group_housing',
          groupName: 'Housing',
          budgeted: 200,
          spent: 145.50,
          balance: 54.50,
          isIncome: false
        },
        {
          id: 'cat_salary',
          name: 'Salary',
          groupId: 'group_income',
          groupName: 'Income',
          budgeted: 0,
          spent: -3500,
          balance: 3500,
          isIncome: true
        }
      ];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get transactions for an account
   */
  async getTransactions(accountId?: string, params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<ActualTransaction[]> {
    try {
      // Mock implementation
      return [
        {
          id: 'txn_001',
          accountId: accountId || 'acc_checking',
          date: '2025-01-22',
          payee: 'Woolworths',
          category: 'cat_groceries',
          amount: -87.45,
          cleared: true,
          reconciled: false
        },
        {
          id: 'txn_002',
          accountId: accountId || 'acc_checking',
          date: '2025-01-21',
          payee: 'Employer',
          category: 'cat_salary',
          amount: 3500.00,
          cleared: true,
          reconciled: true,
          notes: 'Bi-weekly salary'
        },
        {
          id: 'txn_003',
          accountId: accountId || 'acc_checking',
          date: '2025-01-20',
          payee: 'Landlord',
          category: 'cat_rent',
          amount: -1500.00,
          cleared: true,
          reconciled: true,
          notes: 'Monthly rent'
        }
      ];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(transaction: Omit<ActualTransaction, 'id'>): Promise<ActualTransaction | null> {
    try {
      // Mock implementation
      // Real: Insert into local database and sync
      const newTransaction: ActualTransaction = {
        id: `txn_${Date.now()}`,
        ...transaction
      };

      console.log('Transaction created:', newTransaction);
      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  }

  /**
   * Update a transaction
   */
  async updateTransaction(id: string, updates: Partial<ActualTransaction>): Promise<boolean> {
    try {
      // Mock implementation
      // Real: Update in local database and sync
      console.log(`Updating transaction ${id}:`, updates);
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  }

  /**
   * Get all payees
   */
  async getPayees(): Promise<ActualPayee[]> {
    try {
      // Mock implementation
      return [
        { id: 'payee_woolworths', name: 'Woolworths', category: 'cat_groceries' },
        { id: 'payee_landlord', name: 'Landlord', category: 'cat_rent' },
        { id: 'payee_employer', name: 'Employer', category: 'cat_salary' },
        { id: 'payee_netflix', name: 'Netflix', category: 'cat_entertainment' }
      ];
    } catch (error) {
      console.error('Error fetching payees:', error);
      return [];
    }
  }

  /**
   * Get transaction rules
   */
  async getRules(): Promise<ActualRule[]> {
    try {
      // Mock implementation
      return [
        {
          id: 'rule_001',
          stage: 'pre',
          conditions: [
            { field: 'payee', op: 'contains', value: 'Woolworths' }
          ],
          actions: [
            { field: 'category', value: 'cat_groceries' }
          ]
        },
        {
          id: 'rule_002',
          stage: 'pre',
          conditions: [
            { field: 'payee', op: 'is', value: 'Employer' }
          ],
          actions: [
            { field: 'category', value: 'cat_salary' }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching rules:', error);
      return [];
    }
  }

  /**
   * Create a transaction rule
   */
  async createRule(rule: Omit<ActualRule, 'id'>): Promise<ActualRule | null> {
    try {
      // Mock implementation
      const newRule: ActualRule = {
        id: `rule_${Date.now()}`,
        ...rule
      };

      console.log('Rule created:', newRule);
      return newRule;
    } catch (error) {
      console.error('Error creating rule:', error);
      return null;
    }
  }

  /**
   * Set budget amount for a category
   */
  async setBudget(categoryId: string, month: string, amount: number): Promise<boolean> {
    try {
      // Mock implementation
      // Real: Update in local database
      console.log(`Setting budget for ${categoryId} in ${month}: $${amount}`);
      return true;
    } catch (error) {
      console.error('Error setting budget:', error);
      return false;
    }
  }

  /**
   * Set goal for a category
   */
  async setGoal(categoryId: string, goal: ActualGoal): Promise<boolean> {
    try {
      // Mock implementation
      console.log(`Setting goal for ${categoryId}:`, goal);
      return true;
    } catch (error) {
      console.error('Error setting goal:', error);
      return false;
    }
  }

  /**
   * Generate spending report
   */
  async getSpendingReport(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'month' | 'category';
  }): Promise<ActualReport | null> {
    try {
      // Mock implementation
      return {
        type: 'spending',
        data: [
          { date: '2024-11', value: 2150.00 },
          { date: '2024-12', value: 2789.00 },
          { date: '2025-01', value: 2347.89 }
        ],
        categories: [
          { name: 'Groceries', value: 587.45, percentage: 25.0 },
          { name: 'Housing', value: 1700.00, percentage: 72.4 },
          { name: 'Entertainment', value: 60.44, percentage: 2.6 }
        ]
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return null;
    }
  }

  /**
   * Get net worth over time
   */
  async getNetWorthReport(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ActualReport | null> {
    try {
      // Mock implementation
      return {
        type: 'net-worth',
        data: [
          { date: '2024-11', value: 13500.00 },
          { date: '2024-12', value: 14250.00 },
          { date: '2025-01', value: 15070.25 }
        ]
      };
    } catch (error) {
      console.error('Error generating net worth report:', error);
      return null;
    }
  }

  /**
   * Sync with server (if configured)
   */
  async sync(): Promise<{ success: boolean; message: string }> {
    if (!this.syncEnabled || !this.serverUrl) {
      return { success: false, message: 'Sync not configured' };
    }

    try {
      // Mock implementation
      // Real: POST to sync server with encrypted data
      console.log('Syncing with server...');
      return {
        success: true,
        message: 'Sync completed successfully'
      };
    } catch (error) {
      console.error('Error syncing:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export budget data
   */
  async exportData(format: 'json' | 'csv'): Promise<Blob | null> {
    try {
      const accounts = await this.getAccounts();
      const categories = await this.getCategories();
      const transactions = await this.getTransactions();

      const data = {
        accounts,
        categories,
        transactions,
        exportDate: new Date().toISOString()
      };

      if (format === 'json') {
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      } else {
        // Convert to CSV format
        const csv = this.convertToCSV(transactions);
        return new Blob([csv], { type: 'text/csv' });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  /**
   * Helper: Convert transactions to CSV
   */
  private convertToCSV(transactions: ActualTransaction[]): string {
    const headers = ['Date', 'Payee', 'Category', 'Amount', 'Cleared', 'Notes'];
    const rows = transactions.map(t => [
      t.date,
      t.payee || '',
      t.category || '',
      t.amount.toString(),
      t.cleared ? 'Y' : 'N',
      t.notes || ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }
}

// Export singleton instance
export const actualBudgetIntegration = new ActualBudgetIntegrationService();
export default actualBudgetIntegration;
