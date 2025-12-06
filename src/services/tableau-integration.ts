/**
 * TABLEAU INTEGRATION
 * Data visualization and analytics for learning, financial, and health data
 *
 * API Documentation: https://developer.pluralsight.com/integrations-hub/documentation/tableau
 * Tableau REST API: https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api.htm
 *
 * Features:
 * - Learning analytics dashboards (Pluralsight data)
 * - Financial performance visualization
 * - Health metrics tracking
 * - Custom workbooks and views
 * - Embedded dashboards
 * - Real-time data updates
 * - Export and sharing
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

// ============================================================================
// INTERFACES
// ============================================================================

export interface TableauConfig {
  serverUrl: string;
  apiVersion?: string;
  siteName?: string;
  personalAccessTokenName?: string;
  personalAccessTokenSecret?: string;
  username?: string;
  password?: string;
}

export interface TableauWorkbook {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  owner: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  webpageUrl: string;
  tags: string[];
  views: TableauView[];
}

export interface TableauView {
  id: string;
  name: string;
  workbookId: string;
  contentUrl: string;
  createdAt: string;
  updatedAt: string;
  viewUrlName: string;
  tags: string[];
}

export interface TableauDatasource {
  id: string;
  name: string;
  description: string;
  type: string;
  projectId: string;
  owner: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  isCertified: boolean;
  tags: string[];
}

export interface TableauProject {
  id: string;
  name: string;
  description: string;
  parentProjectId?: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
  };
}

export interface PluralsightLearningData {
  userId: string;
  userName: string;
  courses: Array<{
    courseId: string;
    courseName: string;
    completionDate: string;
    duration: number;
    category: string;
    level: string;
  }>;
  skillAssessments: Array<{
    skillName: string;
    iqScore: number;
    proficiencyLevel: string;
    dateCompleted: string;
    percentile: number;
  }>;
  learningPaths: Array<{
    pathName: string;
    coursesCompleted: number;
    totalCourses: number;
    percentComplete: number;
  }>;
}

export interface FinancialDashboardData {
  userId: string;
  netWorth: Array<{
    date: string;
    assets: number;
    liabilities: number;
    netWorth: number;
  }>;
  income: Array<{
    date: string;
    source: string;
    amount: number;
    category: string;
  }>;
  expenses: Array<{
    date: string;
    category: string;
    amount: number;
  }>;
  debts: Array<{
    name: string;
    balance: number;
    interestRate: number;
    monthlyPayment: number;
  }>;
}

export interface HealthMetricsData {
  userId: string;
  vitals: Array<{
    date: string;
    type: string;
    value: number;
    unit: string;
  }>;
  labResults: Array<{
    date: string;
    testName: string;
    value: number;
    unit: string;
    referenceRange: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    startDate: string;
    adherenceRate: number;
  }>;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'learning' | 'financial' | 'health' | 'custom';
  views: string[];
  dataRequirements: string[];
}

// ============================================================================
// TABLEAU INTEGRATION SERVICE
// ============================================================================

class TableauIntegrationService {
  private serverUrl: string | null = null;
  private apiVersion: string = '3.19'; // Latest Tableau REST API version
  private siteName: string = '';
  private authToken: string | null = null;
  private siteId: string | null = null;

  // ============================================================================
  // INITIALIZATION & AUTHENTICATION
  // ============================================================================

  async initialize(config: TableauConfig): Promise<boolean> {
    this.serverUrl = config.serverUrl;
    this.apiVersion = config.apiVersion || '3.19';
    this.siteName = config.siteName || '';

    localStorage.setItem('tableau_server_url', config.serverUrl);
    localStorage.setItem('tableau_api_version', this.apiVersion);
    if (config.siteName) localStorage.setItem('tableau_site_name', config.siteName);

    // Authenticate
    let authenticated = false;

    if (config.personalAccessTokenName && config.personalAccessTokenSecret) {
      authenticated = await this.authenticateWithPAT(
        config.personalAccessTokenName,
        config.personalAccessTokenSecret
      );
    } else if (config.username && config.password) {
      authenticated = await this.authenticateWithCredentials(
        config.username,
        config.password
      );
    }

    if (authenticated) {
      console.log('✅ Tableau Integration initialized');
    }

    return authenticated;
  }

  private async authenticateWithPAT(tokenName: string, tokenSecret: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.serverUrl}/api/${this.apiVersion}/auth/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            credentials: {
              personalAccessTokenName: tokenName,
              personalAccessTokenSecret: tokenSecret,
              site: {
                contentUrl: this.siteName
              }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Tableau authentication failed');
      }

      const data = await response.json();
      this.authToken = data.credentials.token;
      this.siteId = data.credentials.site.id;

      localStorage.setItem('tableau_auth_token', this.authToken);
      localStorage.setItem('tableau_site_id', this.siteId);

      return true;

    } catch (error) {
      console.error('Tableau PAT authentication error:', error);
      return false;
    }
  }

  private async authenticateWithCredentials(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.serverUrl}/api/${this.apiVersion}/auth/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            credentials: {
              name: username,
              password: password,
              site: {
                contentUrl: this.siteName
              }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Tableau authentication failed');
      }

      const data = await response.json();
      this.authToken = data.credentials.token;
      this.siteId = data.credentials.site.id;

      localStorage.setItem('tableau_auth_token', this.authToken);
      localStorage.setItem('tableau_site_id', this.siteId);

      return true;

    } catch (error) {
      console.error('Tableau credentials authentication error:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (!this.authToken) {
      this.serverUrl = localStorage.getItem('tableau_server_url');
      this.authToken = localStorage.getItem('tableau_auth_token');
      this.siteId = localStorage.getItem('tableau_site_id');
      this.siteName = localStorage.getItem('tableau_site_name') || '';
    }
    return !!(this.serverUrl && this.authToken && this.siteId);
  }

  private getAuthHeaders() {
    return {
      'X-Tableau-Auth': this.authToken!,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // ============================================================================
  // WORKBOOKS
  // ============================================================================

  async getWorkbooks(): Promise<TableauWorkbook[] | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('tableau-api');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.serverUrl}/api/${this.apiVersion}/sites/${this.siteId}/workbooks`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Tableau API error');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('tableau-api', true, duration);

      return this.parseWorkbooks(data.workbooks.workbook);

    } catch (error) {
      console.error('Get workbooks error:', error);
      MetricsCollector.recordAPICall('tableau-api', false, 0);
      return null;
    }
  }

  async getWorkbookById(workbookId: string): Promise<TableauWorkbook | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('tableau-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.serverUrl}/api/${this.apiVersion}/sites/${this.siteId}/workbooks/${workbookId}`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Tableau API error');
      }

      const data = await response.json();
      return this.parseWorkbook(data.workbook);

    } catch (error) {
      console.error('Get workbook error:', error);
      return null;
    }
  }

  // ============================================================================
  // VIEWS
  // ============================================================================

  async getViewsForWorkbook(workbookId: string): Promise<TableauView[] | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('tableau-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.serverUrl}/api/${this.apiVersion}/sites/${this.siteId}/workbooks/${workbookId}/views`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Tableau API error');
      }

      const data = await response.json();
      return this.parseViews(data.views.view);

    } catch (error) {
      console.error('Get views error:', error);
      return null;
    }
  }

  /**
   * Get embedded view URL for iframe
   */
  getEmbeddedViewUrl(viewId: string, filters?: Record<string, string>): string {
    let url = `${this.serverUrl}/trusted/${this.authToken}/views/${viewId}`;

    if (filters && Object.keys(filters).length > 0) {
      const filterParams = Object.entries(filters)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${filterParams}`;
    }

    return url;
  }

  // ============================================================================
  // DATA PUBLISHING - PLURALSIGHT LEARNING ANALYTICS
  // ============================================================================

  async publishPluralsightData(data: PluralsightLearningData, projectId: string): Promise<string | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    try {
      // Convert Pluralsight data to Tableau-compatible format
      const tableauData = this.convertPluralsightToTableauFormat(data);

      // Create datasource
      const datasourceId = await this.createDatasource({
        name: `Pluralsight Learning Data - ${data.userName}`,
        projectId,
        type: 'json',
        data: tableauData
      });

      if (!datasourceId) {
        throw new Error('Failed to create datasource');
      }

      console.log(`✅ Published Pluralsight data to Tableau: ${datasourceId}`);
      return datasourceId;

    } catch (error) {
      console.error('Publish Pluralsight data error:', error);
      return null;
    }
  }

  private convertPluralsightToTableauFormat(data: PluralsightLearningData) {
    return {
      courses: data.courses.map(course => ({
        user_id: data.userId,
        user_name: data.userName,
        course_id: course.courseId,
        course_name: course.courseName,
        completion_date: course.completionDate,
        duration_hours: course.duration / 60,
        category: course.category,
        level: course.level
      })),
      skills: data.skillAssessments.map(skill => ({
        user_id: data.userId,
        user_name: data.userName,
        skill_name: skill.skillName,
        iq_score: skill.iqScore,
        proficiency: skill.proficiencyLevel,
        date_completed: skill.dateCompleted,
        percentile: skill.percentile
      })),
      paths: data.learningPaths.map(path => ({
        user_id: data.userId,
        user_name: data.userName,
        path_name: path.pathName,
        courses_completed: path.coursesCompleted,
        total_courses: path.totalCourses,
        percent_complete: path.percentComplete
      }))
    };
  }

  // ============================================================================
  // DATA PUBLISHING - FINANCIAL DASHBOARD
  // ============================================================================

  async publishFinancialData(data: FinancialDashboardData, projectId: string): Promise<string | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    try {
      const tableauData = {
        net_worth: data.netWorth.map(nw => ({
          user_id: data.userId,
          date: nw.date,
          assets: nw.assets,
          liabilities: nw.liabilities,
          net_worth: nw.netWorth
        })),
        income: data.income.map(inc => ({
          user_id: data.userId,
          date: inc.date,
          source: inc.source,
          amount: inc.amount,
          category: inc.category
        })),
        expenses: data.expenses.map(exp => ({
          user_id: data.userId,
          date: exp.date,
          category: exp.category,
          amount: exp.amount
        })),
        debts: data.debts.map(debt => ({
          user_id: data.userId,
          name: debt.name,
          balance: debt.balance,
          interest_rate: debt.interestRate,
          monthly_payment: debt.monthlyPayment
        }))
      };

      const datasourceId = await this.createDatasource({
        name: `Financial Dashboard - ${data.userId}`,
        projectId,
        type: 'json',
        data: tableauData
      });

      console.log(`✅ Published financial data to Tableau: ${datasourceId}`);
      return datasourceId;

    } catch (error) {
      console.error('Publish financial data error:', error);
      return null;
    }
  }

  // ============================================================================
  // DATA PUBLISHING - HEALTH METRICS
  // ============================================================================

  async publishHealthData(data: HealthMetricsData, projectId: string): Promise<string | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    try {
      const tableauData = {
        vitals: data.vitals.map(vital => ({
          user_id: data.userId,
          date: vital.date,
          type: vital.type,
          value: vital.value,
          unit: vital.unit
        })),
        lab_results: data.labResults.map(lab => ({
          user_id: data.userId,
          date: lab.date,
          test_name: lab.testName,
          value: lab.value,
          unit: lab.unit,
          reference_range: lab.referenceRange
        })),
        medications: data.medications.map(med => ({
          user_id: data.userId,
          name: med.name,
          dosage: med.dosage,
          start_date: med.startDate,
          adherence_rate: med.adherenceRate
        }))
      };

      const datasourceId = await this.createDatasource({
        name: `Health Metrics - ${data.userId}`,
        projectId,
        type: 'json',
        data: tableauData
      });

      console.log(`✅ Published health data to Tableau: ${datasourceId}`);
      return datasourceId;

    } catch (error) {
      console.error('Publish health data error:', error);
      return null;
    }
  }

  // ============================================================================
  // DATASOURCES
  // ============================================================================

  private async createDatasource(params: {
    name: string;
    projectId: string;
    type: string;
    data: any;
  }): Promise<string | null> {
    // Note: Actual implementation would use Tableau's data publishing API
    // This is a simplified version
    try {
      const response = await fetch(
        `${this.serverUrl}/api/${this.apiVersion}/sites/${this.siteId}/datasources`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            datasource: {
              name: params.name,
              project: {
                id: params.projectId
              }
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create datasource');
      }

      const data = await response.json();
      return data.datasource.id;

    } catch (error) {
      console.error('Create datasource error:', error);
      return null;
    }
  }

  async getDatasources(): Promise<TableauDatasource[] | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('tableau-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.serverUrl}/api/${this.apiVersion}/sites/${this.siteId}/datasources`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Tableau API error');
      }

      const data = await response.json();
      return this.parseDatasources(data.datasources.datasource);

    } catch (error) {
      console.error('Get datasources error:', error);
      return null;
    }
  }

  // ============================================================================
  // PROJECTS
  // ============================================================================

  async getProjects(): Promise<TableauProject[] | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('tableau-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.serverUrl}/api/${this.apiVersion}/sites/${this.siteId}/projects`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Tableau API error');
      }

      const data = await response.json();
      return this.parseProjects(data.projects.project);

    } catch (error) {
      console.error('Get projects error:', error);
      return null;
    }
  }

  async createProject(name: string, description: string): Promise<string | null> {
    if (!this.isConfigured()) {
      console.error('Tableau not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.serverUrl}/api/${this.apiVersion}/sites/${this.siteId}/projects`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            project: {
              name,
              description
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      return data.project.id;

    } catch (error) {
      console.error('Create project error:', error);
      return null;
    }
  }

  // ============================================================================
  // DASHBOARD TEMPLATES
  // ============================================================================

  getDashboardTemplates(): DashboardTemplate[] {
    return [
      {
        id: 'learning-analytics',
        name: 'Learning Analytics Dashboard',
        description: 'Comprehensive Pluralsight learning progress and skill development tracking',
        category: 'learning',
        views: ['skill-progression', 'course-completion', 'learning-paths', 'time-investment'],
        dataRequirements: ['courses', 'skillAssessments', 'learningPaths']
      },
      {
        id: 'financial-overview',
        name: 'Financial Dashboard',
        description: 'Net worth tracking, income analysis, and debt management visualization',
        category: 'financial',
        views: ['net-worth-trends', 'income-breakdown', 'expense-analysis', 'debt-payoff'],
        dataRequirements: ['netWorth', 'income', 'expenses', 'debts']
      },
      {
        id: 'health-tracking',
        name: 'Health Metrics Dashboard',
        description: 'Vitals monitoring, lab result trends, and medication adherence tracking',
        category: 'health',
        views: ['vitals-timeline', 'lab-trends', 'medication-adherence', 'health-summary'],
        dataRequirements: ['vitals', 'labResults', 'medications']
      },
      {
        id: 'skill-gap-analysis',
        name: 'Skill Gap Analysis',
        description: 'Identify skill gaps and track progress toward target proficiency levels',
        category: 'learning',
        views: ['current-vs-target', 'recommended-courses', 'learning-roadmap'],
        dataRequirements: ['skillAssessments', 'targetSkills', 'courses']
      }
    ];
  }

  // ============================================================================
  // PARSING HELPERS
  // ============================================================================

  private parseWorkbooks(data: any[]): TableauWorkbook[] {
    return data.map(wb => this.parseWorkbook(wb));
  }

  private parseWorkbook(data: any): TableauWorkbook {
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      projectId: data.project?.id,
      projectName: data.project?.name,
      owner: {
        id: data.owner?.id,
        name: data.owner?.name
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      webpageUrl: data.webpageUrl,
      tags: data.tags?.tag?.map((t: any) => t.label) || [],
      views: []
    };
  }

  private parseViews(data: any[]): TableauView[] {
    return data.map(view => ({
      id: view.id,
      name: view.name,
      workbookId: view.workbook?.id,
      contentUrl: view.contentUrl,
      createdAt: view.createdAt,
      updatedAt: view.updatedAt,
      viewUrlName: view.viewUrlName,
      tags: view.tags?.tag?.map((t: any) => t.label) || []
    }));
  }

  private parseDatasources(data: any[]): TableauDatasource[] {
    return data.map(ds => ({
      id: ds.id,
      name: ds.name,
      description: ds.description || '',
      type: ds.type,
      projectId: ds.project?.id,
      owner: {
        id: ds.owner?.id,
        name: ds.owner?.name
      },
      createdAt: ds.createdAt,
      updatedAt: ds.updatedAt,
      isCertified: ds.isCertified || false,
      tags: ds.tags?.tag?.map((t: any) => t.label) || []
    }));
  }

  private parseProjects(data: any[]): TableauProject[] {
    return data.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description || '',
      parentProjectId: project.parentProjectId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      owner: {
        id: project.owner?.id,
        name: project.owner?.name
      }
    }));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get Tableau Server URL for a view
   */
  getViewUrl(viewId: string): string {
    return `${this.serverUrl}/#/site/${this.siteName}/views/${viewId}`;
  }

  /**
   * Get Tableau Server URL for a workbook
   */
  getWorkbookUrl(workbookId: string): string {
    return `${this.serverUrl}/#/site/${this.siteName}/workbooks/${workbookId}`;
  }

  /**
   * Sign out from Tableau Server
   */
  async signOut(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const response = await fetch(
        `${this.serverUrl}/api/${this.apiVersion}/auth/signout`,
        {
          method: 'POST',
          headers: this.getAuthHeaders()
        }
      );

      if (response.ok) {
        this.authToken = null;
        this.siteId = null;
        localStorage.removeItem('tableau_auth_token');
        localStorage.removeItem('tableau_site_id');
        console.log('✅ Signed out from Tableau');
        return true;
      }

      return false;

    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }

  // ============================================================================
  // STATISTICS TRACKING
  // ============================================================================

  getStats(): {
    totalCalls: number;
    successRate: number;
    lastSync?: string;
  } {
    const stats = JSON.parse(localStorage.getItem('tableau_stats') || '{}');

    return {
      totalCalls: stats.totalCalls || 0,
      successRate: stats.successRate || 100,
      lastSync: stats.lastSync
    };
  }

  async syncData(): Promise<boolean> {
    const workbooks = await this.getWorkbooks();
    if (!workbooks) return false;

    const stats = {
      totalCalls: (this.getStats().totalCalls || 0) + 1,
      successRate: 100,
      lastSync: new Date().toISOString()
    };

    localStorage.setItem('tableau_stats', JSON.stringify(stats));
    localStorage.setItem('tableau_workbooks', JSON.stringify(workbooks));

    console.log(`✅ Synced Tableau data: ${workbooks.length} workbooks`);
    return true;
  }
}

export const tableauIntegration = new TableauIntegrationService();
