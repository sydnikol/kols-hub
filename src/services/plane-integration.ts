/**
 * Plane Integration Service
 *
 * Plane is an open-source project management tool designed for modern software teams.
 * Alternative to Jira, Linear, and other project management platforms.
 *
 * Features:
 * - Issue tracking and management
 * - Sprint planning and cycles
 * - Project and workspace management
 * - Custom views and filters
 * - Labels, priorities, and states
 * - Comments and activity tracking
 * - File attachments
 * - Team collaboration
 * - Analytics and insights
 * - API-first architecture
 *
 * API Documentation: https://docs.plane.so/
 * GitHub: https://github.com/makeplane/plane
 * Value: Open-source project management platform
 */

interface PlaneConfig {
  apiKey: string;
  workspaceSlug: string;
  instanceUrl?: string; // For self-hosted instances
}

// Workspace Types
interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

// Project Types
interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  identifier: string; // e.g., "PROJ"
  network: 'public' | 'private';
  icon?: string;
  emoji?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

// Issue Types
interface Issue {
  id: string;
  projectId: string;
  sequenceId: number; // Auto-incrementing number
  name: string;
  description?: string;
  descriptionHtml?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  state: string;
  stateId: string;
  assignees: string[];
  labels: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  targetDate?: string;
  estimate?: number;
  parent?: string; // Parent issue ID
  subIssuesCount: number;
  attachmentCount: number;
  linkCount: number;
  archived: boolean;
}

interface IssueState {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  color: string;
  group: 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled';
  sequence: number;
  isDefault: boolean;
}

interface IssueLabel {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

interface IssueComment {
  id: string;
  issueId: string;
  comment: string;
  commentHtml?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

interface IssueAttachment {
  id: string;
  issueId: string;
  asset: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
}

// Cycle Types
interface Cycle {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'current' | 'upcoming' | 'completed';
  issueCount: number;
  completedIssues: number;
  progress: number;
  createdBy: string;
  createdAt: string;
}

// Module Types
interface Module {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: 'backlog' | 'planned' | 'in-progress' | 'paused' | 'completed' | 'cancelled';
  lead?: string;
  members: string[];
  startDate?: string;
  targetDate?: string;
  issueCount: number;
  completedIssues: number;
  createdAt: string;
}

// View Types
interface IssueView {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  query: {
    state?: string[];
    priority?: string[];
    assignees?: string[];
    labels?: string[];
    createdBy?: string[];
  };
  displayFilters: {
    layout: 'list' | 'kanban' | 'calendar' | 'spreadsheet' | 'gantt';
    groupBy?: string;
    orderBy?: string;
    showEmptyGroups?: boolean;
  };
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

// Member Types
interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Analytics Types
interface ProjectAnalytics {
  projectId: string;
  period: string;
  totalIssues: number;
  completedIssues: number;
  inProgressIssues: number;
  backlogIssues: number;
  completionRate: number;
  issuesByPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  issuesByState: Array<{
    stateName: string;
    count: number;
  }>;
  velocityTrend: Array<{
    period: string;
    completed: number;
    created: number;
  }>;
}

class PlaneIntegrationService {
  private apiKey: string | null = null;
  private workspaceSlug: string | null = null;
  private baseUrl = 'https://api.plane.so';

  /**
   * Initialize Plane integration
   */
  initialize(config: PlaneConfig): void {
    this.apiKey = config.apiKey;
    this.workspaceSlug = config.workspaceSlug;
    this.baseUrl = config.instanceUrl || 'https://api.plane.so';

    // Store in localStorage
    localStorage.setItem('plane_api_key', config.apiKey);
    localStorage.setItem('plane_workspace_slug', config.workspaceSlug);
    if (config.instanceUrl) {
      localStorage.setItem('plane_instance_url', config.instanceUrl);
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.workspaceSlug);
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== WORKSPACE MANAGEMENT ====================

  /**
   * Get workspace details
   */
  async getWorkspace(): Promise<Workspace | null> {
    if (!this.isConfigured()) {
      console.error('Plane not configured');
      return null;
    }

    try {
      // Mock implementation - replace with real API call
      // Real: GET /api/workspaces/{workspace_slug}/
      return {
        id: 'ws_001',
        name: 'My Workspace',
        slug: this.workspaceSlug || '',
        owner: 'user_001',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching workspace:', error);
      return null;
    }
  }

  /**
   * Get workspace members
   */
  async getWorkspaceMembers(): Promise<WorkspaceMember[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/members/
      return [
        {
          id: 'wm_001',
          workspaceId: 'ws_001',
          userId: 'user_001',
          role: 'owner',
          email: 'owner@example.com',
          firstName: 'John',
          lastName: 'Doe',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching workspace members:', error);
      return [];
    }
  }

  // ==================== PROJECT MANAGEMENT ====================

  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/
      return [
        {
          id: 'proj_001',
          workspaceId: 'ws_001',
          name: 'Main Project',
          description: 'Primary development project',
          identifier: 'MAIN',
          network: 'private',
          emoji: '🚀',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: new Date().toISOString(),
          archived: false
        }
      ];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  /**
   * Create a new project
   */
  async createProject(project: {
    name: string;
    description?: string;
    identifier: string;
    network?: 'public' | 'private';
    emoji?: string;
  }): Promise<Project | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST /api/workspaces/{workspace_slug}/projects/
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        workspaceId: 'ws_001',
        ...project,
        network: project.network || 'private',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archived: false
      };

      console.log('Project created:', newProject);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  /**
   * Get project details
   */
  async getProject(projectId: string): Promise<Project | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/
      return {
        id: projectId,
        workspaceId: 'ws_001',
        name: 'Main Project',
        identifier: 'MAIN',
        network: 'private',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
        archived: false
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  // ==================== ISSUE MANAGEMENT ====================

  /**
   * Get all issues in a project
   */
  async getIssues(projectId: string, params?: {
    state?: string[];
    priority?: string[];
    assignees?: string[];
    labels?: string[];
  }): Promise<Issue[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/issues/
      return [
        {
          id: 'issue_001',
          projectId,
          sequenceId: 1,
          name: 'Implement user authentication',
          description: 'Add OAuth 2.0 authentication flow',
          priority: 'high',
          state: 'In Progress',
          stateId: 'state_002',
          assignees: ['user_001'],
          labels: ['backend', 'security'],
          createdBy: 'user_001',
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: new Date().toISOString(),
          targetDate: '2025-01-30',
          subIssuesCount: 2,
          attachmentCount: 0,
          linkCount: 1,
          archived: false
        },
        {
          id: 'issue_002',
          projectId,
          sequenceId: 2,
          name: 'Fix bug in payment processing',
          priority: 'urgent',
          state: 'Backlog',
          stateId: 'state_001',
          assignees: [],
          labels: ['bug', 'payments'],
          createdBy: 'user_002',
          createdAt: '2025-01-22T14:30:00Z',
          updatedAt: new Date().toISOString(),
          subIssuesCount: 0,
          attachmentCount: 1,
          linkCount: 0,
          archived: false
        }
      ];
    } catch (error) {
      console.error('Error fetching issues:', error);
      return [];
    }
  }

  /**
   * Create a new issue
   */
  async createIssue(projectId: string, issue: {
    name: string;
    description?: string;
    priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none';
    stateId?: string;
    assignees?: string[];
    labels?: string[];
    startDate?: string;
    targetDate?: string;
    parent?: string;
  }): Promise<Issue | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST /api/workspaces/{workspace_slug}/projects/{project_id}/issues/
      const newIssue: Issue = {
        id: `issue_${Date.now()}`,
        projectId,
        sequenceId: 100, // Would be auto-generated
        name: issue.name,
        description: issue.description,
        priority: issue.priority || 'none',
        state: 'Backlog',
        stateId: issue.stateId || 'state_001',
        assignees: issue.assignees || [],
        labels: issue.labels || [],
        createdBy: 'user_001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: issue.startDate,
        targetDate: issue.targetDate,
        parent: issue.parent,
        subIssuesCount: 0,
        attachmentCount: 0,
        linkCount: 0,
        archived: false
      };

      console.log('Issue created:', newIssue);
      return newIssue;
    } catch (error) {
      console.error('Error creating issue:', error);
      return null;
    }
  }

  /**
   * Update an issue
   */
  async updateIssue(projectId: string, issueId: string, updates: Partial<Issue>): Promise<Issue | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: PATCH /api/workspaces/{workspace_slug}/projects/{project_id}/issues/{issue_id}/
      console.log(`Updating issue ${issueId}:`, updates);
      return this.getIssue(projectId, issueId);
    } catch (error) {
      console.error('Error updating issue:', error);
      return null;
    }
  }

  /**
   * Get issue details
   */
  async getIssue(projectId: string, issueId: string): Promise<Issue | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/issues/{issue_id}/
      return {
        id: issueId,
        projectId,
        sequenceId: 1,
        name: 'Sample Issue',
        priority: 'medium',
        state: 'In Progress',
        stateId: 'state_002',
        assignees: [],
        labels: [],
        createdBy: 'user_001',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: new Date().toISOString(),
        subIssuesCount: 0,
        attachmentCount: 0,
        linkCount: 0,
        archived: false
      };
    } catch (error) {
      console.error('Error fetching issue:', error);
      return null;
    }
  }

  /**
   * Delete an issue
   */
  async deleteIssue(projectId: string, issueId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      // Mock implementation
      // Real: DELETE /api/workspaces/{workspace_slug}/projects/{project_id}/issues/{issue_id}/
      console.log(`Deleting issue ${issueId}`);
      return true;
    } catch (error) {
      console.error('Error deleting issue:', error);
      return false;
    }
  }

  // ==================== ISSUE STATES ====================

  /**
   * Get project states
   */
  async getStates(projectId: string): Promise<IssueState[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/states/
      return [
        {
          id: 'state_001',
          projectId,
          name: 'Backlog',
          color: '#94a3b8',
          group: 'backlog',
          sequence: 1,
          isDefault: true
        },
        {
          id: 'state_002',
          projectId,
          name: 'In Progress',
          color: '#3b82f6',
          group: 'started',
          sequence: 2,
          isDefault: false
        },
        {
          id: 'state_003',
          projectId,
          name: 'Done',
          color: '#22c55e',
          group: 'completed',
          sequence: 3,
          isDefault: false
        }
      ];
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }

  // ==================== LABELS ====================

  /**
   * Get project labels
   */
  async getLabels(projectId: string): Promise<IssueLabel[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/labels/
      return [
        {
          id: 'label_001',
          projectId,
          name: 'bug',
          description: 'Something is broken',
          color: '#ef4444',
          createdBy: 'user_001',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'label_002',
          projectId,
          name: 'feature',
          description: 'New functionality',
          color: '#3b82f6',
          createdBy: 'user_001',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching labels:', error);
      return [];
    }
  }

  /**
   * Create a label
   */
  async createLabel(projectId: string, label: {
    name: string;
    description?: string;
    color: string;
  }): Promise<IssueLabel | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      const newLabel: IssueLabel = {
        id: `label_${Date.now()}`,
        projectId,
        ...label,
        createdBy: 'user_001',
        createdAt: new Date().toISOString()
      };

      console.log('Label created:', newLabel);
      return newLabel;
    } catch (error) {
      console.error('Error creating label:', error);
      return null;
    }
  }

  // ==================== COMMENTS ====================

  /**
   * Get issue comments
   */
  async getComments(projectId: string, issueId: string): Promise<IssueComment[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/issues/{issue_id}/comments/
      return [
        {
          id: 'comment_001',
          issueId,
          comment: 'This needs to be prioritized for the next sprint.',
          createdBy: 'user_001',
          createdAt: '2025-01-22T15:30:00Z',
          updatedAt: '2025-01-22T15:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  /**
   * Add a comment to an issue
   */
  async addComment(projectId: string, issueId: string, comment: string): Promise<IssueComment | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST /api/workspaces/{workspace_slug}/projects/{project_id}/issues/{issue_id}/comments/
      const newComment: IssueComment = {
        id: `comment_${Date.now()}`,
        issueId,
        comment,
        createdBy: 'user_001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Comment added:', newComment);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  // ==================== CYCLES ====================

  /**
   * Get project cycles
   */
  async getCycles(projectId: string): Promise<Cycle[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/cycles/
      return [
        {
          id: 'cycle_001',
          projectId,
          name: 'Sprint 5',
          description: 'Focus on authentication and payment features',
          startDate: '2025-01-20',
          endDate: '2025-02-03',
          status: 'current',
          issueCount: 12,
          completedIssues: 5,
          progress: 41.67,
          createdBy: 'user_001',
          createdAt: '2025-01-15T10:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching cycles:', error);
      return [];
    }
  }

  /**
   * Create a cycle
   */
  async createCycle(projectId: string, cycle: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
  }): Promise<Cycle | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      const newCycle: Cycle = {
        id: `cycle_${Date.now()}`,
        projectId,
        ...cycle,
        status: 'draft',
        issueCount: 0,
        completedIssues: 0,
        progress: 0,
        createdBy: 'user_001',
        createdAt: new Date().toISOString()
      };

      console.log('Cycle created:', newCycle);
      return newCycle;
    } catch (error) {
      console.error('Error creating cycle:', error);
      return null;
    }
  }

  // ==================== MODULES ====================

  /**
   * Get project modules
   */
  async getModules(projectId: string): Promise<Module[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/modules/
      return [
        {
          id: 'module_001',
          projectId,
          name: 'Authentication Module',
          description: 'User authentication and authorization',
          status: 'in-progress',
          members: ['user_001', 'user_002'],
          startDate: '2025-01-15',
          targetDate: '2025-02-15',
          issueCount: 8,
          completedIssues: 3,
          createdAt: '2025-01-15T10:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  }

  // ==================== ANALYTICS ====================

  /**
   * Get project analytics
   */
  async getAnalytics(projectId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ProjectAnalytics | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/projects/{project_id}/analytics/
      return {
        projectId,
        period: 'Last 30 days',
        totalIssues: 45,
        completedIssues: 28,
        inProgressIssues: 12,
        backlogIssues: 5,
        completionRate: 62.22,
        issuesByPriority: {
          urgent: 3,
          high: 12,
          medium: 20,
          low: 8,
          none: 2
        },
        issuesByState: [
          { stateName: 'Backlog', count: 5 },
          { stateName: 'In Progress', count: 12 },
          { stateName: 'Done', count: 28 }
        ],
        velocityTrend: [
          { period: 'Week 1', completed: 5, created: 8 },
          { period: 'Week 2', completed: 7, created: 6 },
          { period: 'Week 3', completed: 8, created: 7 },
          { period: 'Week 4', completed: 8, created: 5 }
        ]
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  /**
   * Search issues across projects
   */
  async searchIssues(query: string, projectId?: string): Promise<Issue[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workspaces/{workspace_slug}/search/issues/?query={query}
      console.log(`Searching for: ${query}`);
      return [];
    } catch (error) {
      console.error('Error searching issues:', error);
      return [];
    }
  }
}

// Export singleton instance
export const planeIntegration = new PlaneIntegrationService();
export default planeIntegration;
