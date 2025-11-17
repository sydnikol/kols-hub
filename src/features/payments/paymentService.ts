/**
 * Payment Service - Cash App, Venmo, PayPal Integration
 * Handles payment processing, deep linking, and offline transaction storage
 */

export interface PaymentAccount {
  id: string;
  type: 'cashapp' | 'venmo' | 'paypal';
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  type: 'send' | 'receive' | 'request';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  platform: 'cashapp' | 'venmo' | 'paypal';
  fromAccount: string;
  toAccount: string;
  note?: string;
  category?: string;
  createdAt: string;
  completedAt?: string;
  syncedAt?: string;
  metadata?: {
    originalTransactionId?: string;
    receiptUrl?: string;
    failureReason?: string;
  };
}

export interface PaymentRequest {
  id: string;
  platform: 'cashapp' | 'venmo' | 'paypal';
  amount: number;
  currency: string;
  recipient: string;
  note?: string;
  status: 'pending' | 'paid' | 'declined' | 'cancelled';
  createdAt: string;
  expiresAt?: string;
}

export interface PaymentContact {
  id: string;
  name: string;
  platforms: {
    cashapp?: string;
    venmo?: string;
    paypal?: string;
  };
  avatar?: string;
  isFavorite: boolean;
  lastTransaction?: string;
}

class PaymentService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'KOL_Payments';
  private readonly DB_VERSION = 1;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Payment Accounts Store
        if (!db.objectStoreNames.contains('accounts')) {
          const accountStore = db.createObjectStore('accounts', { keyPath: 'id' });
          accountStore.createIndex('type', 'type', { unique: false });
          accountStore.createIndex('username', 'username', { unique: false });
        }

        // Transactions Store
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('platform', 'platform', { unique: false });
          txStore.createIndex('status', 'status', { unique: false });
          txStore.createIndex('createdAt', 'createdAt', { unique: false });
          txStore.createIndex('type', 'type', { unique: false });
        }

        // Payment Requests Store
        if (!db.objectStoreNames.contains('requests')) {
          const reqStore = db.createObjectStore('requests', { keyPath: 'id' });
          reqStore.createIndex('platform', 'platform', { unique: false });
          reqStore.createIndex('status', 'status', { unique: false });
        }

        // Contacts Store
        if (!db.objectStoreNames.contains('contacts')) {
          const contactStore = db.createObjectStore('contacts', { keyPath: 'id' });
          contactStore.createIndex('name', 'name', { unique: false });
          contactStore.createIndex('isFavorite', 'isFavorite', { unique: false });
        }
      };
    });
  }

  // ==================== ACCOUNT MANAGEMENT ====================

  async addAccount(account: Omit<PaymentAccount, 'id' | 'createdAt'>): Promise<PaymentAccount> {
    if (!this.db) await this.initialize();

    const newAccount: PaymentAccount = {
      ...account,
      id: `${account.type}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['accounts'], 'readwrite');
      const store = transaction.objectStore('accounts');
      const request = store.add(newAccount);

      request.onsuccess = () => resolve(newAccount);
      request.onerror = () => reject(request.error);
    });
  }

  async getAccounts(): Promise<PaymentAccount[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['accounts'], 'readonly');
      const store = transaction.objectStore('accounts');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getAccountsByPlatform(platform: 'cashapp' | 'venmo' | 'paypal'): Promise<PaymentAccount[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['accounts'], 'readonly');
      const store = transaction.objectStore('accounts');
      const index = store.index('type');
      const request = index.getAll(platform);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async setDefaultAccount(accountId: string): Promise<void> {
    if (!this.db) await this.initialize();

    const accounts = await this.getAccounts();
    const targetAccount = accounts.find(a => a.id === accountId);
    
    if (!targetAccount) throw new Error('Account not found');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['accounts'], 'readwrite');
      const store = transaction.objectStore('accounts');

      // Reset all defaults for the same platform
      accounts.forEach(account => {
        if (account.type === targetAccount.type) {
          account.isDefault = account.id === accountId;
          store.put(account);
        }
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // ==================== TRANSACTION MANAGEMENT ====================

  async createTransaction(tx: Omit<PaymentTransaction, 'id' | 'createdAt'>): Promise<PaymentTransaction> {
    if (!this.db) await this.initialize();

    const newTransaction: PaymentTransaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      const request = store.add(newTransaction);

      request.onsuccess = () => resolve(newTransaction);
      request.onerror = () => reject(request.error);
    });
  }

  async getTransactions(filters?: {
    platform?: 'cashapp' | 'venmo' | 'paypal';
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaymentTransaction[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result || [];

        if (filters) {
          if (filters.platform) {
            results = results.filter(tx => tx.platform === filters.platform);
          }
          if (filters.status) {
            results = results.filter(tx => tx.status === filters.status);
          }
          if (filters.type) {
            results = results.filter(tx => tx.type === filters.type);
          }
          if (filters.startDate) {
            results = results.filter(tx => tx.createdAt >= filters.startDate!);
          }
          if (filters.endDate) {
            results = results.filter(tx => tx.createdAt <= filters.endDate!);
          }
        }

        // Sort by date descending
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateTransactionStatus(
    transactionId: string,
    status: PaymentTransaction['status'],
    metadata?: any
  ): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      const getRequest = store.get(transactionId);

      getRequest.onsuccess = () => {
        const tx = getRequest.result;
        if (tx) {
          tx.status = status;
          if (status === 'completed') {
            tx.completedAt = new Date().toISOString();
          }
          if (metadata) {
            tx.metadata = { ...tx.metadata, ...metadata };
          }
          store.put(tx);
        }
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // ==================== PAYMENT REQUESTS ====================

  async createPaymentRequest(request: Omit<PaymentRequest, 'id' | 'createdAt'>): Promise<PaymentRequest> {
    if (!this.db) await this.initialize();

    const newRequest: PaymentRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      expiresAt: request.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days default
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readwrite');
      const store = transaction.objectStore('requests');
      const req = store.add(newRequest);

      req.onsuccess = () => resolve(newRequest);
      req.onerror = () => reject(req.error);
    });
  }

  async getPaymentRequests(status?: string): Promise<PaymentRequest[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readonly');
      const store = transaction.objectStore('requests');
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result || [];
        
        if (status) {
          results = results.filter(req => req.status === status);
        }

        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== CONTACTS ====================

  async addContact(contact: Omit<PaymentContact, 'id'>): Promise<PaymentContact> {
    if (!this.db) await this.initialize();

    const newContact: PaymentContact = {
      ...contact,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contacts'], 'readwrite');
      const store = transaction.objectStore('contacts');
      const request = store.add(newContact);

      request.onsuccess = () => resolve(newContact);
      request.onerror = () => reject(request.error);
    });
  }

  async getContacts(): Promise<PaymentContact[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contacts'], 'readonly');
      const store = transaction.objectStore('contacts');
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        results.sort((a, b) => {
          if (a.isFavorite !== b.isFavorite) {
            return a.isFavorite ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== DEEP LINKING ====================

  generateCashAppLink(params: {
    recipient: string;
    amount?: number;
    note?: string;
  }): string {
    const { recipient, amount, note } = params;
    let url = `https://cash.app/$${recipient}`;
    
    if (amount) {
      url += `/${amount}`;
    }
    
    if (note) {
      url += `?note=${encodeURIComponent(note)}`;
    }

    return url;
  }

  generateVenmoLink(params: {
    recipient: string;
    amount?: number;
    note?: string;
    txn?: 'pay' | 'charge';
  }): string {
    const { recipient, amount, note, txn = 'pay' } = params;
    let url = `https://venmo.com/${recipient}`;
    
    const queryParams: string[] = [];
    if (amount) queryParams.push(`amount=${amount}`);
    if (note) queryParams.push(`note=${encodeURIComponent(note)}`);
    if (txn) queryParams.push(`txn=${txn}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return url;
  }

  generatePayPalLink(params: {
    recipient: string;
    amount?: number;
    currency?: string;
    note?: string;
  }): string {
    const { recipient, amount, currency = 'USD', note } = params;
    let url = `https://www.paypal.com/paypalme/${recipient}`;
    
    if (amount) {
      url += `/${amount}${currency}`;
    }

    if (note) {
      url += `?note=${encodeURIComponent(note)}`;
    }

    return url;
  }

  openPaymentApp(platform: 'cashapp' | 'venmo' | 'paypal', link: string): void {
    // For mobile, try deep link first, fallback to web
    const deepLinks = {
      cashapp: link.replace('https://cash.app', 'cashapp://'),
      venmo: link.replace('https://venmo.com', 'venmo://'),
      paypal: link.replace('https://www.paypal.com', 'paypal://'),
    };

    // Try deep link
    window.location.href = deepLinks[platform];

    // Fallback to web after delay
    setTimeout(() => {
      window.open(link, '_blank');
    }, 500);
  }

  // ==================== ANALYTICS ====================

  async getPaymentAnalytics(startDate?: string, endDate?: string): Promise<{
    totalSent: number;
    totalReceived: number;
    totalTransactions: number;
    byPlatform: Record<string, { sent: number; received: number; count: number }>;
    topCategories: Array<{ category: string; amount: number; count: number }>;
    recentActivity: PaymentTransaction[];
  }> {
    const transactions = await this.getTransactions({
      startDate,
      endDate,
    });

    const analytics = {
      totalSent: 0,
      totalReceived: 0,
      totalTransactions: transactions.length,
      byPlatform: {} as Record<string, { sent: number; received: number; count: number }>,
      topCategories: [] as Array<{ category: string; amount: number; count: number }>,
      recentActivity: transactions.slice(0, 10),
    };

    const categoryMap = new Map<string, { amount: number; count: number }>();

    transactions.forEach(tx => {
      if (tx.status !== 'completed') return;

      // Platform stats
      if (!analytics.byPlatform[tx.platform]) {
        analytics.byPlatform[tx.platform] = { sent: 0, received: 0, count: 0 };
      }

      analytics.byPlatform[tx.platform].count++;

      if (tx.type === 'send') {
        analytics.totalSent += tx.amount;
        analytics.byPlatform[tx.platform].sent += tx.amount;
      } else if (tx.type === 'receive') {
        analytics.totalReceived += tx.amount;
        analytics.byPlatform[tx.platform].received += tx.amount;
      }

      // Category stats
      if (tx.category) {
        const existing = categoryMap.get(tx.category) || { amount: 0, count: 0 };
        categoryMap.set(tx.category, {
          amount: existing.amount + tx.amount,
          count: existing.count + 1,
        });
      }
    });

    // Convert category map to sorted array
    analytics.topCategories = Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    return analytics;
  }

  // ==================== EXPORT ====================

  async exportTransactions(format: 'csv' | 'json' = 'csv'): Promise<string> {
    const transactions = await this.getTransactions();

    if (format === 'json') {
      return JSON.stringify(transactions, null, 2);
    }

    // CSV format
    const headers = ['Date', 'Platform', 'Type', 'Amount', 'Currency', 'Status', 'From', 'To', 'Note'];
    const rows = transactions.map(tx => [
      new Date(tx.createdAt).toLocaleString(),
      tx.platform,
      tx.type,
      tx.amount.toString(),
      tx.currency,
      tx.status,
      tx.fromAccount,
      tx.toAccount,
      tx.note || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }
}

export const paymentService = new PaymentService();
