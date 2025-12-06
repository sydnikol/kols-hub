/**
 * Kol's Hub - AI Phone Connector & Integration Generator
 * AI-powered system to automatically connect and integrate phone apps
 * Generates custom integrations and workflows between apps
 */

import { phoneIntegration, PhoneContact, CalendarEvent, DeviceInfo } from './phone-integration-service';
import { crossDeviceSync } from './cross-device-sync';

// Types
export interface AppConnection {
  id: string;
  appName: string;
  appPackage: string;
  category: AppCategory;
  connected: boolean;
  permissions: string[];
  syncEnabled: boolean;
  lastSync?: number;
  dataTypes: string[];
  capabilities: AppCapability[];
}

export type AppCategory =
  | 'communication'
  | 'productivity'
  | 'health'
  | 'finance'
  | 'entertainment'
  | 'social'
  | 'utilities'
  | 'travel'
  | 'food'
  | 'shopping'
  | 'education'
  | 'smart-home';

export type AppCapability =
  | 'read-data'
  | 'write-data'
  | 'notifications'
  | 'automation'
  | 'share'
  | 'deep-link'
  | 'widget'
  | 'voice-control';

export interface IntegrationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  enabled: boolean;
  createdAt: number;
  lastRun?: number;
  runCount: number;
}

export interface WorkflowTrigger {
  type: 'time' | 'location' | 'app-event' | 'health-event' | 'calendar-event' | 'manual';
  config: any;
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  appConnection?: string;
  config: any;
  order: number;
}

export type ActionType =
  | 'send-notification'
  | 'create-calendar-event'
  | 'log-health-data'
  | 'send-message'
  | 'play-music'
  | 'set-reminder'
  | 'update-sync'
  | 'speak-text'
  | 'toggle-smart-device'
  | 'create-note'
  | 'call-api';

export interface AIRecommendation {
  id: string;
  type: 'connection' | 'workflow' | 'optimization' | 'insight';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: AppCategory;
  action?: () => Promise<void>;
  dismissed: boolean;
  createdAt: number;
}

export interface PhoneAnalysis {
  deviceInfo: DeviceInfo;
  installedApps: AppConnection[];
  suggestedConnections: AppConnection[];
  potentialWorkflows: IntegrationWorkflow[];
  healthInsights: string[];
  productivityTips: string[];
  privacyScore: number;
}

// Pre-defined app integrations
const KNOWN_APP_INTEGRATIONS: Partial<AppConnection>[] = [
  // Communication
  { appName: 'Google Messages', appPackage: 'com.google.android.apps.messaging', category: 'communication', dataTypes: ['sms', 'mms'], capabilities: ['read-data', 'notifications', 'share'] },
  { appName: 'WhatsApp', appPackage: 'com.whatsapp', category: 'communication', dataTypes: ['messages', 'calls'], capabilities: ['notifications', 'share', 'deep-link'] },
  { appName: 'Telegram', appPackage: 'org.telegram.messenger', category: 'communication', dataTypes: ['messages'], capabilities: ['notifications', 'share', 'automation'] },
  { appName: 'Discord', appPackage: 'com.discord', category: 'communication', dataTypes: ['messages', 'voice'], capabilities: ['notifications', 'deep-link'] },

  // Productivity
  { appName: 'Google Calendar', appPackage: 'com.google.android.calendar', category: 'productivity', dataTypes: ['events', 'reminders'], capabilities: ['read-data', 'write-data', 'notifications', 'widget'] },
  { appName: 'Google Tasks', appPackage: 'com.google.android.apps.tasks', category: 'productivity', dataTypes: ['tasks'], capabilities: ['read-data', 'write-data', 'widget'] },
  { appName: 'Google Keep', appPackage: 'com.google.android.keep', category: 'productivity', dataTypes: ['notes', 'lists'], capabilities: ['read-data', 'write-data', 'share', 'widget'] },
  { appName: 'Notion', appPackage: 'notion.id', category: 'productivity', dataTypes: ['pages', 'databases'], capabilities: ['read-data', 'write-data', 'automation'] },
  { appName: 'Todoist', appPackage: 'com.todoist', category: 'productivity', dataTypes: ['tasks', 'projects'], capabilities: ['read-data', 'write-data', 'automation'] },

  // Health
  { appName: 'Google Fit', appPackage: 'com.google.android.apps.fitness', category: 'health', dataTypes: ['steps', 'heart_rate', 'sleep', 'activity'], capabilities: ['read-data', 'write-data', 'notifications'] },
  { appName: 'Samsung Health', appPackage: 'com.sec.android.app.shealth', category: 'health', dataTypes: ['steps', 'heart_rate', 'sleep'], capabilities: ['read-data', 'notifications'] },
  { appName: 'MyFitnessPal', appPackage: 'com.myfitnesspal.android', category: 'health', dataTypes: ['nutrition', 'calories'], capabilities: ['read-data', 'write-data'] },
  { appName: 'Headspace', appPackage: 'com.getsomeheadspace.android', category: 'health', dataTypes: ['meditation', 'sleep'], capabilities: ['notifications'] },

  // Finance
  { appName: 'Google Pay', appPackage: 'com.google.android.apps.walletnfcrel', category: 'finance', dataTypes: ['transactions'], capabilities: ['notifications'] },
  { appName: 'PayPal', appPackage: 'com.paypal.android.p2pmobile', category: 'finance', dataTypes: ['transactions', 'balance'], capabilities: ['notifications', 'deep-link'] },
  { appName: 'Cash App', appPackage: 'com.squareup.cash', category: 'finance', dataTypes: ['transactions'], capabilities: ['notifications', 'deep-link'] },
  { appName: 'Mint', appPackage: 'com.mint', category: 'finance', dataTypes: ['accounts', 'budgets', 'transactions'], capabilities: ['read-data', 'notifications'] },

  // Entertainment
  { appName: 'Spotify', appPackage: 'com.spotify.music', category: 'entertainment', dataTypes: ['playlists', 'playback'], capabilities: ['read-data', 'notifications', 'voice-control', 'widget'] },
  { appName: 'YouTube Music', appPackage: 'com.google.android.apps.youtube.music', category: 'entertainment', dataTypes: ['playlists', 'playback'], capabilities: ['read-data', 'notifications'] },
  { appName: 'Netflix', appPackage: 'com.netflix.mediaclient', category: 'entertainment', dataTypes: ['watchlist'], capabilities: ['notifications', 'deep-link'] },
  { appName: 'Hulu', appPackage: 'com.hulu.plus', category: 'entertainment', dataTypes: ['watchlist'], capabilities: ['notifications'] },

  // Social
  { appName: 'Instagram', appPackage: 'com.instagram.android', category: 'social', dataTypes: ['posts', 'stories'], capabilities: ['notifications', 'share'] },
  { appName: 'Twitter/X', appPackage: 'com.twitter.android', category: 'social', dataTypes: ['tweets'], capabilities: ['notifications', 'share', 'deep-link'] },
  { appName: 'Facebook', appPackage: 'com.facebook.katana', category: 'social', dataTypes: ['posts', 'events'], capabilities: ['notifications', 'share'] },
  { appName: 'TikTok', appPackage: 'com.zhiliaoapp.musically', category: 'social', dataTypes: ['videos'], capabilities: ['notifications', 'share'] },

  // Smart Home
  { appName: 'Google Home', appPackage: 'com.google.android.apps.chromecast.app', category: 'smart-home', dataTypes: ['devices', 'routines'], capabilities: ['read-data', 'write-data', 'automation', 'voice-control'] },
  { appName: 'SmartThings', appPackage: 'com.samsung.android.oneconnect', category: 'smart-home', dataTypes: ['devices', 'scenes'], capabilities: ['read-data', 'write-data', 'automation'] },
  { appName: 'Alexa', appPackage: 'com.amazon.dee.app', category: 'smart-home', dataTypes: ['devices', 'routines'], capabilities: ['read-data', 'write-data', 'voice-control'] },
  { appName: 'Philips Hue', appPackage: 'com.philips.lighting.hue2', category: 'smart-home', dataTypes: ['lights', 'scenes'], capabilities: ['read-data', 'write-data', 'automation'] },

  // Travel
  { appName: 'Google Maps', appPackage: 'com.google.android.apps.maps', category: 'travel', dataTypes: ['locations', 'routes'], capabilities: ['read-data', 'notifications', 'widget'] },
  { appName: 'Uber', appPackage: 'com.ubercab', category: 'travel', dataTypes: ['rides'], capabilities: ['notifications', 'deep-link'] },
  { appName: 'Lyft', appPackage: 'me.lyft.android', category: 'travel', dataTypes: ['rides'], capabilities: ['notifications', 'deep-link'] },

  // Food
  { appName: 'DoorDash', appPackage: 'com.dd.doordash', category: 'food', dataTypes: ['orders'], capabilities: ['notifications', 'deep-link'] },
  { appName: 'Uber Eats', appPackage: 'com.ubercab.eats', category: 'food', dataTypes: ['orders'], capabilities: ['notifications', 'deep-link'] },
  { appName: 'Starbucks', appPackage: 'com.starbucks.mobilecard', category: 'food', dataTypes: ['orders', 'rewards'], capabilities: ['notifications'] },
];

// AI Phone Connector Service
class AIPhoneConnectorService {
  private connections: Map<string, AppConnection> = new Map();
  private workflows: Map<string, IntegrationWorkflow> = new Map();
  private recommendations: AIRecommendation[] = [];
  private analysisCache: PhoneAnalysis | null = null;

  constructor() {
    this.loadSavedState();
    this.initializeService();
  }

  private async initializeService() {
    await this.detectInstalledApps();
    await this.generateRecommendations();
    console.log("Kol's Hub AI Phone Connector initialized");
  }

  // ==================== APP DETECTION ====================
  async detectInstalledApps(): Promise<AppConnection[]> {
    const detected: AppConnection[] = [];

    // In native environment, we'd use a native plugin to detect apps
    // For now, we'll use known integrations and let users confirm

    for (const app of KNOWN_APP_INTEGRATIONS) {
      const connection: AppConnection = {
        id: app.appPackage || String(Date.now()),
        appName: app.appName || 'Unknown',
        appPackage: app.appPackage || '',
        category: app.category || 'utilities',
        connected: false,
        permissions: [],
        syncEnabled: false,
        dataTypes: app.dataTypes || [],
        capabilities: app.capabilities || [],
      };

      this.connections.set(connection.id, connection);
      detected.push(connection);
    }

    this.saveState();
    return detected;
  }

  getAvailableApps(): AppConnection[] {
    return Array.from(this.connections.values());
  }

  getConnectedApps(): AppConnection[] {
    return Array.from(this.connections.values()).filter(app => app.connected);
  }

  getAppsByCategory(category: AppCategory): AppConnection[] {
    return Array.from(this.connections.values()).filter(app => app.category === category);
  }

  // ==================== APP CONNECTION ====================
  async connectApp(appId: string): Promise<AppConnection | null> {
    const app = this.connections.get(appId);
    if (!app) return null;

    try {
      // Attempt to establish connection based on app type
      if (app.category === 'health' && app.appName.includes('Google')) {
        await this.connectGoogleFit();
      } else if (app.category === 'productivity' && app.appName.includes('Google')) {
        await this.connectGoogleServices(app);
      } else if (app.category === 'smart-home') {
        await this.connectSmartHome(app);
      }

      app.connected = true;
      app.syncEnabled = true;
      app.lastSync = Date.now();

      this.connections.set(appId, app);
      this.saveState();

      // Create initial sync
      await this.syncAppData(appId);

      return app;
    } catch (error) {
      console.error(`Failed to connect ${app.appName}:`, error);
      return null;
    }
  }

  async disconnectApp(appId: string): Promise<void> {
    const app = this.connections.get(appId);
    if (app) {
      app.connected = false;
      app.syncEnabled = false;
      this.connections.set(appId, app);
      this.saveState();
    }
  }

  private async connectGoogleFit(): Promise<void> {
    // Check if we have Google OAuth token
    const token = localStorage.getItem('google_access_token');
    if (!token) {
      throw new Error('Google authentication required');
    }
    // Connection established via OAuth
  }

  private async connectGoogleServices(app: AppConnection): Promise<void> {
    const token = localStorage.getItem('google_access_token');
    if (!token) {
      throw new Error('Google authentication required');
    }
  }

  private async connectSmartHome(app: AppConnection): Promise<void> {
    // Smart home connection would require specific API setup
    // For Google Home, we'd use Google's Smart Home API
    const token = localStorage.getItem('google_access_token');
    if (!token && app.appName.includes('Google')) {
      throw new Error('Google authentication required');
    }
  }

  // ==================== DATA SYNC ====================
  async syncAppData(appId: string): Promise<void> {
    const app = this.connections.get(appId);
    if (!app || !app.connected) return;

    try {
      let data: any = {};

      // Sync based on app type
      if (app.category === 'health') {
        data = await this.syncHealthData(app);
      } else if (app.category === 'productivity') {
        data = await this.syncProductivityData(app);
      } else if (app.category === 'communication') {
        data = await this.syncCommunicationData(app);
      }

      // Save to cross-device sync
      await crossDeviceSync.saveData(app.category as any, app.id, data);

      app.lastSync = Date.now();
      this.connections.set(appId, app);
      this.saveState();
    } catch (error) {
      console.error(`Failed to sync ${app.appName}:`, error);
    }
  }

  async syncAllApps(): Promise<void> {
    const connected = this.getConnectedApps();
    await Promise.all(connected.map(app => this.syncAppData(app.id)));
  }

  private async syncHealthData(app: AppConnection): Promise<any> {
    // Sync health data from connected app
    return {
      syncedAt: Date.now(),
      source: app.appName,
      dataTypes: app.dataTypes,
    };
  }

  private async syncProductivityData(app: AppConnection): Promise<any> {
    if (app.appName.includes('Calendar')) {
      const events = await phoneIntegration.getCalendarEvents();
      return { events };
    }
    return {};
  }

  private async syncCommunicationData(app: AppConnection): Promise<any> {
    if (app.dataTypes.includes('contacts')) {
      const contacts = await phoneIntegration.getContacts();
      return { contacts };
    }
    return {};
  }

  // ==================== WORKFLOW AUTOMATION ====================
  async createWorkflow(workflow: Omit<IntegrationWorkflow, 'id' | 'createdAt' | 'runCount'>): Promise<IntegrationWorkflow> {
    const newWorkflow: IntegrationWorkflow = {
      ...workflow,
      id: `wf_${Date.now()}`,
      createdAt: Date.now(),
      runCount: 0,
    };

    this.workflows.set(newWorkflow.id, newWorkflow);
    this.saveState();

    // Set up trigger
    await this.setupWorkflowTrigger(newWorkflow);

    return newWorkflow;
  }

  async updateWorkflow(id: string, updates: Partial<IntegrationWorkflow>): Promise<IntegrationWorkflow | null> {
    const workflow = this.workflows.get(id);
    if (!workflow) return null;

    const updated = { ...workflow, ...updates };
    this.workflows.set(id, updated);
    this.saveState();

    return updated;
  }

  async deleteWorkflow(id: string): Promise<void> {
    this.workflows.delete(id);
    this.saveState();
  }

  getWorkflows(): IntegrationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  async runWorkflow(id: string): Promise<void> {
    const workflow = this.workflows.get(id);
    if (!workflow || !workflow.enabled) return;

    try {
      for (const action of workflow.actions.sort((a, b) => a.order - b.order)) {
        await this.executeAction(action);
      }

      workflow.lastRun = Date.now();
      workflow.runCount++;
      this.workflows.set(id, workflow);
      this.saveState();
    } catch (error) {
      console.error(`Workflow ${workflow.name} failed:`, error);
    }
  }

  private async setupWorkflowTrigger(workflow: IntegrationWorkflow): Promise<void> {
    switch (workflow.trigger.type) {
      case 'time':
        // Set up scheduled execution
        const { schedule } = workflow.trigger.config;
        if (schedule) {
          // Use notification scheduling as a trigger mechanism
          await phoneIntegration.scheduleNotification({
            title: `Workflow: ${workflow.name}`,
            body: 'Running automated workflow',
            schedule: new Date(schedule),
          });
        }
        break;

      case 'calendar-event':
        // Listen for calendar events
        crossDeviceSync.on('dataChanged', async ({ category }: any) => {
          if (category === 'calendar' && workflow.enabled) {
            await this.runWorkflow(workflow.id);
          }
        });
        break;

      case 'health-event':
        // Listen for health data changes
        crossDeviceSync.on('dataChanged', async ({ category }: any) => {
          if (category === 'health' && workflow.enabled) {
            await this.runWorkflow(workflow.id);
          }
        });
        break;
    }
  }

  private async executeAction(action: WorkflowAction): Promise<void> {
    switch (action.type) {
      case 'send-notification':
        await phoneIntegration.scheduleNotification({
          title: action.config.title || 'Kol\'s Hub',
          body: action.config.body || '',
        });
        break;

      case 'create-calendar-event':
        await phoneIntegration.createCalendarEvent({
          title: action.config.title,
          startDate: new Date(action.config.startDate),
          endDate: new Date(action.config.endDate),
          description: action.config.description,
        });
        break;

      case 'log-health-data':
        await crossDeviceSync.saveData('health', action.config.dataType, action.config.data);
        break;

      case 'set-reminder':
        await phoneIntegration.scheduleNotification({
          title: action.config.title,
          body: action.config.body,
          schedule: new Date(action.config.time),
        });
        break;

      case 'update-sync':
        await this.syncAllApps();
        break;

      case 'speak-text':
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(action.config.text);
          speechSynthesis.speak(utterance);
        }
        break;

      case 'toggle-smart-device':
        // Would integrate with smart home API
        console.log(`Toggling device: ${action.config.deviceId}`);
        break;

      case 'call-api':
        await fetch(action.config.url, {
          method: action.config.method || 'GET',
          headers: action.config.headers,
          body: action.config.body,
        });
        break;
    }
  }

  // ==================== AI RECOMMENDATIONS ====================
  async generateRecommendations(): Promise<AIRecommendation[]> {
    this.recommendations = [];

    // Analyze current state and generate recommendations
    const connectedApps = this.getConnectedApps();
    const availableApps = this.getAvailableApps();

    // Recommend high-value connections
    for (const app of availableApps) {
      if (!app.connected) {
        const priority = this.calculateConnectionPriority(app);
        if (priority !== 'low') {
          this.recommendations.push({
            id: `rec_conn_${app.id}`,
            type: 'connection',
            title: `Connect ${app.appName}`,
            description: `Integrate ${app.appName} to sync ${app.dataTypes.join(', ')} automatically`,
            priority,
            category: app.category,
            action: async () => await this.connectApp(app.id),
            dismissed: false,
            createdAt: Date.now(),
          });
        }
      }
    }

    // Recommend workflows based on connected apps
    if (connectedApps.length >= 2) {
      const workflowSuggestions = this.suggestWorkflows(connectedApps);
      this.recommendations.push(...workflowSuggestions);
    }

    // Health insights
    const healthApps = connectedApps.filter(a => a.category === 'health');
    if (healthApps.length > 0) {
      this.recommendations.push({
        id: 'rec_health_tracking',
        type: 'insight',
        title: 'Health Tracking Active',
        description: `You're tracking health data from ${healthApps.length} app(s). Consider setting up daily health reminders.`,
        priority: 'medium',
        category: 'health',
        dismissed: false,
        createdAt: Date.now(),
      });
    }

    // Productivity tips
    const productivityApps = connectedApps.filter(a => a.category === 'productivity');
    if (productivityApps.length === 0) {
      this.recommendations.push({
        id: 'rec_productivity',
        type: 'insight',
        title: 'Boost Productivity',
        description: 'Connect your calendar and task apps to automatically sync schedules and reminders.',
        priority: 'high',
        category: 'productivity',
        dismissed: false,
        createdAt: Date.now(),
      });
    }

    return this.recommendations;
  }

  private calculateConnectionPriority(app: AppConnection): 'high' | 'medium' | 'low' {
    // Health and productivity apps are high priority
    if (app.category === 'health' || app.category === 'productivity') {
      return 'high';
    }
    // Communication and finance are medium
    if (app.category === 'communication' || app.category === 'finance') {
      return 'medium';
    }
    return 'low';
  }

  private suggestWorkflows(connectedApps: AppConnection[]): AIRecommendation[] {
    const suggestions: AIRecommendation[] = [];

    const hasCalendar = connectedApps.some(a => a.dataTypes.includes('events'));
    const hasHealth = connectedApps.some(a => a.category === 'health');
    const hasSmartHome = connectedApps.some(a => a.category === 'smart-home');
    const hasMusic = connectedApps.some(a => a.category === 'entertainment' && a.dataTypes.includes('playback'));

    // Morning routine workflow
    if (hasCalendar && hasSmartHome) {
      suggestions.push({
        id: 'rec_wf_morning',
        type: 'workflow',
        title: 'Morning Routine Automation',
        description: 'Automatically turn on lights, play music, and show today\'s calendar when you wake up.',
        priority: 'high',
        category: 'smart-home',
        action: async () => {
          await this.createWorkflow({
            name: 'Morning Routine',
            description: 'Wake up automation',
            trigger: { type: 'time', config: { schedule: '07:00' } },
            actions: [
              { id: '1', type: 'toggle-smart-device', config: { deviceId: 'lights', action: 'on' }, order: 1 },
              { id: '2', type: 'speak-text', config: { text: 'Good morning! Here\'s your schedule for today.' }, order: 2 },
            ],
            enabled: true,
          });
        },
        dismissed: false,
        createdAt: Date.now(),
      });
    }

    // Health reminder workflow
    if (hasHealth) {
      suggestions.push({
        id: 'rec_wf_health',
        type: 'workflow',
        title: 'Health Check Reminders',
        description: 'Get reminded to log symptoms, medications, and check vitals throughout the day.',
        priority: 'high',
        category: 'health',
        action: async () => {
          await this.createWorkflow({
            name: 'Health Reminders',
            description: 'Daily health tracking reminders',
            trigger: { type: 'time', config: { schedule: '09:00' } },
            actions: [
              { id: '1', type: 'send-notification', config: { title: 'Health Check', body: 'Time to log your morning symptoms and medications' }, order: 1 },
            ],
            enabled: true,
          });
        },
        dismissed: false,
        createdAt: Date.now(),
      });
    }

    // Relaxation workflow
    if (hasMusic && hasSmartHome) {
      suggestions.push({
        id: 'rec_wf_relax',
        type: 'workflow',
        title: 'Relaxation Mode',
        description: 'Dim lights, play calming music, and set phone to Do Not Disturb for rest time.',
        priority: 'medium',
        category: 'entertainment',
        dismissed: false,
        createdAt: Date.now(),
      });
    }

    return suggestions;
  }

  getRecommendations(): AIRecommendation[] {
    return this.recommendations.filter(r => !r.dismissed);
  }

  dismissRecommendation(id: string): void {
    const rec = this.recommendations.find(r => r.id === id);
    if (rec) {
      rec.dismissed = true;
    }
  }

  // ==================== PHONE ANALYSIS ====================
  async analyzePhone(): Promise<PhoneAnalysis> {
    const deviceInfo = await phoneIntegration.getDeviceInfo();
    const installedApps = this.getAvailableApps();
    const connectedApps = this.getConnectedApps();

    const analysis: PhoneAnalysis = {
      deviceInfo,
      installedApps,
      suggestedConnections: installedApps.filter(a => !a.connected && this.calculateConnectionPriority(a) !== 'low'),
      potentialWorkflows: this.generatePotentialWorkflows(connectedApps),
      healthInsights: this.generateHealthInsights(connectedApps),
      productivityTips: this.generateProductivityTips(connectedApps),
      privacyScore: this.calculatePrivacyScore(connectedApps),
    };

    this.analysisCache = analysis;
    return analysis;
  }

  private generatePotentialWorkflows(apps: AppConnection[]): IntegrationWorkflow[] {
    const workflows: IntegrationWorkflow[] = [];

    // Generate workflow suggestions based on connected apps
    if (apps.length >= 2) {
      workflows.push({
        id: 'suggested_sync_all',
        name: 'Sync All Data',
        description: 'Automatically sync all connected apps every hour',
        trigger: { type: 'time', config: { interval: 60 } },
        actions: [
          { id: '1', type: 'update-sync', config: {}, order: 1 },
          { id: '2', type: 'send-notification', config: { title: 'Sync Complete', body: 'All apps synchronized' }, order: 2 },
        ],
        enabled: false,
        createdAt: Date.now(),
        runCount: 0,
      });
    }

    return workflows;
  }

  private generateHealthInsights(apps: AppConnection[]): string[] {
    const insights: string[] = [];
    const healthApps = apps.filter(a => a.category === 'health');

    if (healthApps.length === 0) {
      insights.push('Connect a health app to start tracking your wellness metrics.');
    } else {
      insights.push(`You're tracking health data from ${healthApps.length} source(s).`);
      if (healthApps.some(a => a.dataTypes.includes('steps'))) {
        insights.push('Step tracking is active - aim for 10,000 steps daily!');
      }
      if (healthApps.some(a => a.dataTypes.includes('sleep'))) {
        insights.push('Sleep tracking enabled - maintain consistent sleep schedules.');
      }
    }

    return insights;
  }

  private generateProductivityTips(apps: AppConnection[]): string[] {
    const tips: string[] = [];
    const productivityApps = apps.filter(a => a.category === 'productivity');

    if (productivityApps.length === 0) {
      tips.push('Connect calendar and task apps to boost productivity.');
    } else {
      tips.push('Use calendar blocking to protect focus time.');
      tips.push('Set up daily planning reminders each morning.');
    }

    return tips;
  }

  private calculatePrivacyScore(apps: AppConnection[]): number {
    // Calculate privacy score based on connected apps and their permissions
    const maxScore = 100;
    const perAppDeduction = 5;
    const highRiskCategories = ['social', 'communication'];

    let score = maxScore;
    for (const app of apps) {
      if (app.connected) {
        score -= perAppDeduction;
        if (highRiskCategories.includes(app.category)) {
          score -= 5;
        }
        if (app.capabilities.includes('read-data')) {
          score -= 2;
        }
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  // ==================== STATE MANAGEMENT ====================
  private saveState(): void {
    const state = {
      connections: Array.from(this.connections.entries()),
      workflows: Array.from(this.workflows.entries()),
      recommendations: this.recommendations,
    };
    localStorage.setItem('kolshub_ai_connector_state', JSON.stringify(state));
  }

  private loadSavedState(): void {
    const saved = localStorage.getItem('kolshub_ai_connector_state');
    if (saved) {
      const state = JSON.parse(saved);
      this.connections = new Map(state.connections || []);
      this.workflows = new Map(state.workflows || []);
      this.recommendations = state.recommendations || [];
    }
  }

  // ==================== QUICK ACTIONS ====================
  async quickSetupHealthTracking(): Promise<void> {
    const healthApps = this.getAppsByCategory('health');
    for (const app of healthApps) {
      if (app.appName.includes('Google') || app.appName.includes('Fit')) {
        await this.connectApp(app.id);
        break;
      }
    }
  }

  async quickSetupProductivity(): Promise<void> {
    const productivityApps = this.getAppsByCategory('productivity');
    for (const app of productivityApps.slice(0, 3)) {
      await this.connectApp(app.id);
    }
  }

  async quickSetupEntertainment(): Promise<void> {
    const entertainmentApps = this.getAppsByCategory('entertainment');
    for (const app of entertainmentApps.slice(0, 2)) {
      await this.connectApp(app.id);
    }
  }
}

// Export singleton
export const aiPhoneConnector = new AIPhoneConnectorService();
export default aiPhoneConnector;
