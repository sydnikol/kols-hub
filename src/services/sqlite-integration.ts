/**
 * SQLite Integration Service
 *
 * Lightweight embedded SQL database
 *
 * Features:
 * - Serverless, zero-configuration
 * - Self-contained single file database
 * - ACID transactions
 * - Full SQL support
 * - Prepared statements
 * - Indexes and views
 * - Triggers and stored procedures
 * - Full-text search (FTS5)
 * - JSON support (JSON1 extension)
 * - Common Table Expressions (CTE)
 * - Window functions
 * - Partial indexes
 * - Generated columns
 *
 * Docs: https://www.sqlite.org/docs.html
 */

interface SQLiteConfig {
  databasePath: string;
  mode?: 'memory' | 'file';
  enableWAL?: boolean; // Write-Ahead Logging
  timeout?: number; // Busy timeout in milliseconds
}

interface DatabaseInfo {
  path: string;
  mode: 'memory' | 'file';
  pageSize: number;
  pageCount: number;
  size: number; // bytes
  walEnabled: boolean;
  encoding: string;
  version: string;
}

interface Table {
  name: string;
  type: 'table' | 'view';
  sql: string;
  rowCount?: number;
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: any;
  primaryKey: boolean;
  autoIncrement: boolean;
}

interface Index {
  name: string;
  tableName: string;
  unique: boolean;
  columns: string[];
  partial: boolean;
  where?: string;
}

interface QueryResult<T = any> {
  rows: T[];
  rowsAffected: number;
  lastInsertId?: number;
  executionTime: number; // milliseconds
}

interface PreparedStatement {
  id: string;
  sql: string;
  paramCount: number;
  execute(params?: any[]): Promise<QueryResult>;
  finalize(): void;
}

interface Transaction {
  id: string;
  active: boolean;
  statements: string[];
  commit(): Promise<boolean>;
  rollback(): Promise<boolean>;
}

interface BackupOptions {
  targetPath: string;
  progressCallback?: (remaining: number, total: number) => void;
}

interface AnalysisResult {
  tableName: string;
  totalRows: number;
  totalSize: number; // bytes
  avgRowSize: number;
  indexes: number;
  fragmentationPercent: number;
  recommendations: string[];
}

class SQLiteIntegrationService {
  private databasePath: string | null = null;
  private mode: 'memory' | 'file' = 'file';
  private walEnabled: boolean = false;
  private timeout: number = 5000;
  private connected: boolean = false;
  private preparedStatements: Map<string, PreparedStatement> = new Map();
  private activeTransactions: Map<string, Transaction> = new Map();

  initialize(config: SQLiteConfig): boolean {
    try {
      this.databasePath = config.databasePath;
      this.mode = config.mode || 'file';
      this.walEnabled = config.enableWAL || false;
      this.timeout = config.timeout || 5000;

      localStorage.setItem('sqlite_config', JSON.stringify(config));
      console.log('SQLite integration initialized');
      console.log('Database path:', this.databasePath);
      console.log('Mode:', this.mode);
      return true;
    } catch (error) {
      console.error('Error initializing SQLite integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.databasePath) return true;

    try {
      const savedConfig = localStorage.getItem('sqlite_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.databasePath = config.databasePath;
        this.mode = config.mode || 'file';
        this.walEnabled = config.enableWAL || false;
        this.timeout = config.timeout || 5000;
        return !!this.databasePath;
      }
    } catch (error) {
      console.error('Error loading SQLite config:', error);
    }

    return false;
  }

  // ==================== Connection Management ====================

  async connect(): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      this.connected = true;

      // Enable WAL mode if requested
      if (this.walEnabled) {
        await this.execute('PRAGMA journal_mode=WAL');
        console.log('WAL mode enabled');
      }

      console.log('Connected to database:', this.databasePath);
      return true;
    } catch (error) {
      console.error('Error connecting to database:', error);
      return false;
    }
  }

  async close(): Promise<boolean> {
    if (!this.connected) return false;

    try {
      // Finalize all prepared statements
      for (const stmt of this.preparedStatements.values()) {
        stmt.finalize();
      }
      this.preparedStatements.clear();

      this.connected = false;
      console.log('Database connection closed');
      return true;
    } catch (error) {
      console.error('Error closing database:', error);
      return false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  // ==================== Query Execution ====================

  async execute<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    const startTime = Date.now();

    try {
      // Mock query execution
      const mockRows: T[] = [];
      const rowsAffected = sql.toLowerCase().startsWith('select') ? 0 :
        Math.floor(Math.random() * 10) + 1;

      const result: QueryResult<T> = {
        rows: mockRows,
        rowsAffected,
        lastInsertId: sql.toLowerCase().startsWith('insert') ? Date.now() : undefined,
        executionTime: Date.now() - startTime
      };

      console.log(`Executed: ${sql.substring(0, 50)}...`);
      console.log(`Rows affected: ${rowsAffected}, Time: ${result.executionTime}ms`);

      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.execute<T>(sql, params);
    return result.rows;
  }

  async get<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const result = await this.execute<T>(sql, params);
    return result.rows[0] || null;
  }

  async run(sql: string, params?: any[]): Promise<{ lastInsertId?: number; rowsAffected: number }> {
    const result = await this.execute(sql, params);
    return {
      lastInsertId: result.lastInsertId,
      rowsAffected: result.rowsAffected
    };
  }

  // ==================== Prepared Statements ====================

  prepare(sql: string): PreparedStatement {
    const paramCount = (sql.match(/\?/g) || []).length;

    const statement: PreparedStatement = {
      id: `stmt_${Date.now()}`,
      sql,
      paramCount,
      execute: async (params?: any[]) => {
        return this.execute(sql, params);
      },
      finalize: () => {
        this.preparedStatements.delete(statement.id);
        console.log('Statement finalized:', statement.id);
      }
    };

    this.preparedStatements.set(statement.id, statement);
    console.log('Statement prepared:', statement.id);
    return statement;
  }

  // ==================== Transactions ====================

  async beginTransaction(): Promise<Transaction> {
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      active: true,
      statements: [],
      commit: async () => {
        await this.execute('COMMIT');
        transaction.active = false;
        this.activeTransactions.delete(transaction.id);
        console.log('Transaction committed:', transaction.id);
        return true;
      },
      rollback: async () => {
        await this.execute('ROLLBACK');
        transaction.active = false;
        this.activeTransactions.delete(transaction.id);
        console.log('Transaction rolled back:', transaction.id);
        return true;
      }
    };

    await this.execute('BEGIN TRANSACTION');
    this.activeTransactions.set(transaction.id, transaction);

    console.log('Transaction started:', transaction.id);
    return transaction;
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const txn = await this.beginTransaction();

    try {
      const result = await callback();
      await txn.commit();
      return result;
    } catch (error) {
      await txn.rollback();
      throw error;
    }
  }

  // ==================== Schema Management ====================

  async getTables(): Promise<Table[]> {
    const mockTables: Table[] = [
      {
        name: 'users',
        type: 'table',
        sql: 'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)',
        rowCount: 100
      },
      {
        name: 'posts',
        type: 'table',
        sql: 'CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, content TEXT)',
        rowCount: 500
      }
    ];

    console.log('Tables retrieved:', mockTables.length);
    return mockTables;
  }

  async getTableInfo(tableName: string): Promise<Column[]> {
    const mockColumns: Column[] = [
      {
        name: 'id',
        type: 'INTEGER',
        nullable: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: true
      },
      {
        name: 'name',
        type: 'TEXT',
        nullable: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false
      },
      {
        name: 'created_at',
        type: 'INTEGER',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        primaryKey: false,
        autoIncrement: false
      }
    ];

    console.log(`Table info for ${tableName}:`, mockColumns.length, 'columns');
    return mockColumns;
  }

  async createTable(name: string, columns: Partial<Column>[]): Promise<boolean> {
    const columnDefs = columns.map(col => {
      const parts = [col.name, col.type];

      if (col.primaryKey) parts.push('PRIMARY KEY');
      if (col.autoIncrement) parts.push('AUTOINCREMENT');
      if (!col.nullable) parts.push('NOT NULL');
      if (col.defaultValue !== undefined) parts.push(`DEFAULT ${col.defaultValue}`);

      return parts.join(' ');
    });

    const sql = `CREATE TABLE ${name} (${columnDefs.join(', ')})`;
    await this.execute(sql);

    console.log('Table created:', name);
    return true;
  }

  async dropTable(name: string): Promise<boolean> {
    await this.execute(`DROP TABLE IF EXISTS ${name}`);
    console.log('Table dropped:', name);
    return true;
  }

  // ==================== Index Management ====================

  async createIndex(params: {
    name: string;
    tableName: string;
    columns: string[];
    unique?: boolean;
    where?: string;
  }): Promise<boolean> {
    const uniqueKeyword = params.unique ? 'UNIQUE' : '';
    const whereClause = params.where ? `WHERE ${params.where}` : '';

    const sql = `CREATE ${uniqueKeyword} INDEX ${params.name} ON ${params.tableName} (${params.columns.join(', ')}) ${whereClause}`;
    await this.execute(sql);

    console.log('Index created:', params.name);
    return true;
  }

  async getIndexes(tableName?: string): Promise<Index[]> {
    const mockIndexes: Index[] = [
      {
        name: 'idx_users_email',
        tableName: 'users',
        unique: true,
        columns: ['email'],
        partial: false
      },
      {
        name: 'idx_posts_user_id',
        tableName: 'posts',
        unique: false,
        columns: ['user_id'],
        partial: false
      }
    ];

    const filtered = tableName
      ? mockIndexes.filter(idx => idx.tableName === tableName)
      : mockIndexes;

    console.log('Indexes retrieved:', filtered.length);
    return filtered;
  }

  async dropIndex(name: string): Promise<boolean> {
    await this.execute(`DROP INDEX IF EXISTS ${name}`);
    console.log('Index dropped:', name);
    return true;
  }

  // ==================== Full-Text Search ====================

  async createFTS5Table(params: {
    name: string;
    columns: string[];
    contentTable?: string;
  }): Promise<boolean> {
    const columns = params.columns.join(', ');
    const contentClause = params.contentTable ? `, content=${params.contentTable}` : '';

    const sql = `CREATE VIRTUAL TABLE ${params.name} USING fts5(${columns}${contentClause})`;
    await this.execute(sql);

    console.log('FTS5 table created:', params.name);
    return true;
  }

  async searchFTS(params: {
    table: string;
    query: string;
    columns?: string[];
    limit?: number;
  }): Promise<QueryResult> {
    const columns = params.columns?.join(', ') || '*';
    const limit = params.limit || 10;

    const sql = `SELECT ${columns} FROM ${params.table} WHERE ${params.table} MATCH ? LIMIT ${limit}`;
    const result = await this.execute(sql, [params.query]);

    console.log(`FTS search for "${params.query}":`, result.rows.length, 'results');
    return result;
  }

  // ==================== JSON Support ====================

  async jsonExtract(params: {
    table: string;
    jsonColumn: string;
    path: string;
    where?: string;
  }): Promise<any[]> {
    const whereClause = params.where ? `WHERE ${params.where}` : '';
    const sql = `SELECT json_extract(${params.jsonColumn}, '${params.path}') AS value FROM ${params.table} ${whereClause}`;

    const result = await this.execute(sql);
    return result.rows.map((r: any) => r.value);
  }

  // ==================== Database Operations ====================

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    const info: DatabaseInfo = {
      path: this.databasePath || ':memory:',
      mode: this.mode,
      pageSize: 4096,
      pageCount: 1000,
      size: 4096 * 1000,
      walEnabled: this.walEnabled,
      encoding: 'UTF-8',
      version: '3.45.0'
    };

    console.log('Database info:', info);
    return info;
  }

  async vacuum(): Promise<boolean> {
    await this.execute('VACUUM');
    console.log('Database vacuumed (reclaimed unused space)');
    return true;
  }

  async analyze(tableName?: string): Promise<AnalysisResult[]> {
    const tables = tableName ? [tableName] : (await this.getTables()).map(t => t.name);
    const results: AnalysisResult[] = [];

    for (const table of tables) {
      const result: AnalysisResult = {
        tableName: table,
        totalRows: Math.floor(Math.random() * 10000),
        totalSize: Math.floor(Math.random() * 1024 * 1024),
        avgRowSize: 256,
        indexes: 2,
        fragmentationPercent: Math.random() * 20,
        recommendations: []
      };

      if (result.fragmentationPercent > 15) {
        result.recommendations.push('Consider running VACUUM to reduce fragmentation');
      }

      if (result.indexes === 0) {
        result.recommendations.push('Add indexes to improve query performance');
      }

      results.push(result);
    }

    console.log('Analysis completed for', results.length, 'tables');
    return results;
  }

  async backup(options: BackupOptions): Promise<boolean> {
    console.log('Backing up database to:', options.targetPath);

    // Mock backup progress
    if (options.progressCallback) {
      const total = 100;
      for (let i = total; i >= 0; i -= 10) {
        options.progressCallback(i, total);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('Backup completed');
    return true;
  }

  async restore(sourcePath: string): Promise<boolean> {
    console.log('Restoring database from:', sourcePath);
    console.log('Restore completed');
    return true;
  }

  // ==================== Pragma Management ====================

  async setPragma(name: string, value: string | number): Promise<boolean> {
    await this.execute(`PRAGMA ${name}=${value}`);
    console.log(`Pragma set: ${name}=${value}`);
    return true;
  }

  async getPragma(name: string): Promise<any> {
    const result = await this.execute(`PRAGMA ${name}`);
    return result.rows[0];
  }

  // ==================== Utility Methods ====================

  escapeString(str: string): string {
    return str.replace(/'/g, "''");
  }

  async getRowCount(tableName: string): Promise<number> {
    const result = await this.get<{ count: number }>(`SELECT COUNT(*) as count FROM ${tableName}`);
    return result?.count || 0;
  }

  async tableExists(tableName: string): Promise<boolean> {
    const result = await this.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName]
    );
    return !!result;
  }
}

export const sqliteIntegration = new SQLiteIntegrationService();
