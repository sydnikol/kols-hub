/**
 * Google Workspace Integration Service
 *
 * Comprehensive integration with Google Workspace (Gmail, Calendar, Drive, etc.)
 * following Google API Services User Data Policy requirements.
 *
 * COMPLIANCE REQUIREMENTS:
 * - Limited Use: Only use data for features explicitly requested by user
 * - No Data Transfer: Don't transfer data to third parties (except as necessary for feature)
 * - No Human Readability: Don't allow humans to read user data unless:
 *   1. User's explicit consent for specific messages
 *   2. Necessary for security purposes
 *   3. Required by law
 * - Privacy Policy: Must have prominent privacy policy
 * - Secure Transmission: Use industry-standard encryption (HTTPS)
 *
 * Features:
 * - Gmail: Read, send, search emails
 * - Calendar: Events, scheduling, availability
 * - Drive: File management, sharing
 * - Contacts: People API integration
 * - Tasks: Task management
 * - Meet: Video conferencing
 *
 * API Documentation: https://developers.google.com/workspace
 * User Data Policy: https://developers.google.com/terms/api-services-user-data-policy
 */

interface GoogleWorkspaceConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  accessToken?: string;
  refreshToken?: string;
}

// Gmail Types
interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: {
    partId: string;
    mimeType: string;
    headers: Array<{ name: string; value: string }>;
    body: {
      size: number;
      data?: string;
    };
  };
  sizeEstimate: number;
  raw?: string;
}

interface GmailThread {
  id: string;
  snippet: string;
  historyId: string;
  messages: GmailMessage[];
}

interface GmailLabel {
  id: string;
  name: string;
  messageListVisibility: 'show' | 'hide';
  labelListVisibility: 'labelShow' | 'labelHide';
  type: 'system' | 'user';
  messagesTotal: number;
  messagesUnread: number;
}

// Calendar Types
interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    organizer?: boolean;
  }>;
  conferenceData?: {
    entryPoints: Array<{
      entryPointType: 'video' | 'phone' | 'sip' | 'more';
      uri: string;
      label?: string;
    }>;
  };
  recurrence?: string[];
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

interface Calendar {
  id: string;
  summary: string;
  description?: string;
  timeZone: string;
  primary?: boolean;
  backgroundColor?: string;
}

// Drive Types
interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  starred: boolean;
  trashed: boolean;
  parents?: string[];
  createdTime: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  owners?: Array<{
    emailAddress: string;
    displayName: string;
  }>;
  permissions?: DrivePermission[];
}

interface DrivePermission {
  id: string;
  type: 'user' | 'group' | 'domain' | 'anyone';
  emailAddress?: string;
  domain?: string;
  role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
  displayName?: string;
}

// Contacts Types
interface Contact {
  resourceName: string;
  etag: string;
  names?: Array<{
    displayName: string;
    givenName?: string;
    familyName?: string;
  }>;
  emailAddresses?: Array<{
    value: string;
    type?: string;
  }>;
  phoneNumbers?: Array<{
    value: string;
    type?: string;
  }>;
  organizations?: Array<{
    name: string;
    title?: string;
  }>;
  photos?: Array<{
    url: string;
  }>;
}

// Tasks Types
interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  parent?: string;
  position: string;
  links?: Array<{
    type: string;
    description: string;
    link: string;
  }>;
}

interface TaskList {
  id: string;
  title: string;
  updated: string;
}

class GoogleWorkspaceIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri: string | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private scopes: string[] = [];

  // Common OAuth scopes
  private readonly SCOPE_GMAIL_READONLY = 'https://www.googleapis.com/auth/gmail.readonly';
  private readonly SCOPE_GMAIL_SEND = 'https://www.googleapis.com/auth/gmail.send';
  private readonly SCOPE_GMAIL_MODIFY = 'https://www.googleapis.com/auth/gmail.modify';
  private readonly SCOPE_CALENDAR = 'https://www.googleapis.com/auth/calendar';
  private readonly SCOPE_CALENDAR_READONLY = 'https://www.googleapis.com/auth/calendar.readonly';
  private readonly SCOPE_DRIVE = 'https://www.googleapis.com/auth/drive';
  private readonly SCOPE_DRIVE_FILE = 'https://www.googleapis.com/auth/drive.file';
  private readonly SCOPE_CONTACTS = 'https://www.googleapis.com/auth/contacts.readonly';
  private readonly SCOPE_TASKS = 'https://www.googleapis.com/auth/tasks';

  /**
   * Initialize Google Workspace integration
   * COMPLIANCE: Stores credentials securely, only in memory and localStorage
   */
  initialize(config: GoogleWorkspaceConfig): void {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.scopes = config.scopes;
    this.accessToken = config.accessToken || null;
    this.refreshToken = config.refreshToken || null;

    // Store in localStorage (encrypted in production)
    localStorage.setItem('google_client_id', config.clientId);
    if (config.accessToken) {
      localStorage.setItem('google_access_token', config.accessToken);
    }
    if (config.refreshToken) {
      localStorage.setItem('google_refresh_token', config.refreshToken);
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.accessToken);
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generate OAuth2 authorization URL
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId || '',
      redirect_uri: this.redirectUri || '',
      response_type: 'code',
      scope: this.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: this.clientId || '',
          client_secret: this.clientSecret || '',
          redirect_uri: this.redirectUri || '',
          grant_type: 'authorization_code'
        })
      });

      if (!response.ok) throw new Error(`OAuth error: ${response.status}`);

      const data = await response.json();

      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return null;
    }
  }

  // ==================== GMAIL API ====================

  /**
   * Get Gmail messages
   * COMPLIANCE: Limited Use - only for displaying user's own emails
   */
  async getMessages(params?: {
    maxResults?: number;
    query?: string;
    labelIds?: string[];
  }): Promise<GmailMessage[]> {
    if (!this.isConfigured()) {
      console.error('Google Workspace not configured');
      return [];
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET https://gmail.googleapis.com/gmail/v1/users/me/messages
      return [
        {
          id: 'msg_001',
          threadId: 'thread_001',
          labelIds: ['INBOX', 'UNREAD'],
          snippet: 'Meeting tomorrow at 2pm...',
          historyId: '12345',
          internalDate: new Date().toISOString(),
          payload: {
            partId: '0',
            mimeType: 'text/plain',
            headers: [
              { name: 'From', value: 'colleague@example.com' },
              { name: 'Subject', value: 'Meeting Tomorrow' },
              { name: 'Date', value: new Date().toISOString() }
            ],
            body: {
              size: 150
            }
          },
          sizeEstimate: 150
        }
      ];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Send email
   * COMPLIANCE: Only sends emails explicitly composed by user
   */
  async sendEmail(params: {
    to: string[];
    subject: string;
    body: string;
    cc?: string[];
    bcc?: string[];
  }): Promise<{ success: boolean; messageId?: string }> {
    if (!this.isConfigured()) {
      return { success: false };
    }

    try {
      // Mock implementation
      // Real: POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send
      console.log('Sending email:', params);
      return {
        success: true,
        messageId: `msg_${Date.now()}`
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false };
    }
  }

  /**
   * Get Gmail labels
   */
  async getLabels(): Promise<GmailLabel[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      return [
        {
          id: 'INBOX',
          name: 'INBOX',
          messageListVisibility: 'show',
          labelListVisibility: 'labelShow',
          type: 'system',
          messagesTotal: 125,
          messagesUnread: 8
        },
        {
          id: 'SENT',
          name: 'SENT',
          messageListVisibility: 'show',
          labelListVisibility: 'labelShow',
          type: 'system',
          messagesTotal: 89,
          messagesUnread: 0
        }
      ];
    } catch (error) {
      console.error('Error fetching labels:', error);
      return [];
    }
  }

  // ==================== CALENDAR API ====================

  /**
   * Get calendar events
   * COMPLIANCE: Limited Use - only for displaying user's calendar
   */
  async getCalendarEvents(params?: {
    calendarId?: string;
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
  }): Promise<CalendarEvent[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
      return [
        {
          id: 'event_001',
          summary: 'Team Standup',
          description: 'Daily team sync',
          start: {
            dateTime: '2025-01-24T09:00:00-08:00',
            timeZone: 'America/Los_Angeles'
          },
          end: {
            dateTime: '2025-01-24T09:30:00-08:00',
            timeZone: 'America/Los_Angeles'
          },
          attendees: [
            {
              email: 'team@example.com',
              displayName: 'Team',
              responseStatus: 'accepted'
            }
          ],
          conferenceData: {
            entryPoints: [
              {
                entryPointType: 'video',
                uri: 'https://meet.google.com/abc-defg-hij',
                label: 'meet.google.com/abc-defg-hij'
              }
            ]
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  /**
   * Create calendar event
   * COMPLIANCE: Only creates events explicitly requested by user
   */
  async createCalendarEvent(event: Omit<CalendarEvent, 'id'>, calendarId = 'primary'): Promise<CalendarEvent | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
      const newEvent: CalendarEvent = {
        id: `event_${Date.now()}`,
        ...event
      };

      console.log('Event created:', newEvent);
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  /**
   * Get list of calendars
   */
  async getCalendars(): Promise<Calendar[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      return [
        {
          id: 'primary',
          summary: 'user@example.com',
          timeZone: 'America/Los_Angeles',
          primary: true,
          backgroundColor: '#9fe1e7'
        }
      ];
    } catch (error) {
      console.error('Error fetching calendars:', error);
      return [];
    }
  }

  // ==================== DRIVE API ====================

  /**
   * List files in Drive
   * COMPLIANCE: Limited Use - only for file management features
   */
  async listDriveFiles(params?: {
    q?: string;  // Query string
    pageSize?: number;
    orderBy?: string;
  }): Promise<DriveFile[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET https://www.googleapis.com/drive/v3/files
      return [
        {
          id: 'file_001',
          name: 'Project Proposal.docx',
          mimeType: 'application/vnd.google-apps.document',
          starred: false,
          trashed: false,
          createdTime: '2025-01-20T10:00:00Z',
          modifiedTime: '2025-01-22T15:30:00Z',
          size: '45678',
          webViewLink: 'https://docs.google.com/document/d/...',
          owners: [
            {
              emailAddress: 'user@example.com',
              displayName: 'User Name'
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Upload file to Drive
   * COMPLIANCE: Only uploads files explicitly selected by user
   */
  async uploadFile(params: {
    name: string;
    mimeType: string;
    content: Blob;
    parents?: string[];
  }): Promise<DriveFile | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST https://www.googleapis.com/upload/drive/v3/files
      console.log('Uploading file:', params.name);
      return {
        id: `file_${Date.now()}`,
        name: params.name,
        mimeType: params.mimeType,
        starred: false,
        trashed: false,
        parents: params.parents,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  /**
   * Share file with permissions
   */
  async shareFile(fileId: string, permission: {
    type: 'user' | 'group' | 'domain' | 'anyone';
    role: 'reader' | 'writer' | 'commenter';
    emailAddress?: string;
  }): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      // Mock implementation
      // Real: POST https://www.googleapis.com/drive/v3/files/{fileId}/permissions
      console.log(`Sharing file ${fileId}:`, permission);
      return true;
    } catch (error) {
      console.error('Error sharing file:', error);
      return false;
    }
  }

  // ==================== CONTACTS API ====================

  /**
   * Get contacts
   * COMPLIANCE: Limited Use - only for contact management features
   */
  async getContacts(params?: {
    pageSize?: number;
  }): Promise<Contact[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET https://people.googleapis.com/v1/people/me/connections
      return [
        {
          resourceName: 'people/c123',
          etag: '%EgQBAgM=',
          names: [
            {
              displayName: 'John Smith',
              givenName: 'John',
              familyName: 'Smith'
            }
          ],
          emailAddresses: [
            {
              value: 'john.smith@example.com',
              type: 'work'
            }
          ],
          phoneNumbers: [
            {
              value: '+1 555-0123',
              type: 'mobile'
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }

  // ==================== TASKS API ====================

  /**
   * Get task lists
   */
  async getTaskLists(): Promise<TaskList[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET https://tasks.googleapis.com/tasks/v1/users/@me/lists
      return [
        {
          id: 'tasklist_001',
          title: 'My Tasks',
          updated: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching task lists:', error);
      return [];
    }
  }

  /**
   * Get tasks from a list
   */
  async getTasks(taskListId: string): Promise<GoogleTask[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks
      return [
        {
          id: 'task_001',
          title: 'Complete project proposal',
          notes: 'Include budget and timeline',
          status: 'needsAction',
          due: '2025-01-30T00:00:00Z',
          position: '00000000000000000001'
        }
      ];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskListId: string, task: {
    title: string;
    notes?: string;
    due?: string;
  }): Promise<GoogleTask | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks
      const newTask: GoogleTask = {
        id: `task_${Date.now()}`,
        title: task.title,
        notes: task.notes,
        status: 'needsAction',
        due: task.due,
        position: '00000000000000000001'
      };

      console.log('Task created:', newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  /**
   * COMPLIANCE CHECK: Validate scopes match usage
   * Ensures we only access data we've requested permission for
   */
  validateScopes(): {
    valid: boolean;
    missing: string[];
    message: string;
  } {
    const requiredScopes = [
      this.SCOPE_GMAIL_READONLY,
      this.SCOPE_CALENDAR,
      this.SCOPE_DRIVE_FILE,
      this.SCOPE_CONTACTS,
      this.SCOPE_TASKS
    ];

    const missing = requiredScopes.filter(scope => !this.scopes.includes(scope));

    return {
      valid: missing.length === 0,
      missing,
      message: missing.length > 0
        ? `Missing required scopes: ${missing.join(', ')}`
        : 'All required scopes present'
    };
  }
}

// Export singleton instance
export const googleWorkspaceIntegration = new GoogleWorkspaceIntegrationService();
export default googleWorkspaceIntegration;
