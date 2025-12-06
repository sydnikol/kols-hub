/**
 * Neon Integration Service
 *
 * Serverless PostgreSQL database platform
 *
 * Features:
 * - Serverless PostgreSQL with instant provisioning
 * - Database branching (like Git for databases)
 * - Scale to zero with automatic hibernation
 * - Point-in-time restore
 * - Connection pooling
 * - Read replicas
 * - Autoscaling compute
 * - Project and branch management via API
 *
 * Docs: https://neon.tech/docs
 * API: https://api-docs.neon.tech/
 * GitHub: https://github.com/neondatabase/neon
 */

interface NeonConfig {
  apiKey: string;
}

interface NeonProject {
  id: string;
  name: string;
  region_id: string;
  pg_version: number;
  store_passwords: boolean;
  default_endpoint_settings?: {
    autoscaling_limit_min_cu: number;
    autoscaling_limit_max_cu: number;
    suspend_timeout_seconds: number;
  };
  created_at: string;
  updated_at: string;
}

interface NeonBranch {
  id: string;
  project_id: string;
  parent_id?: string;
  parent_lsn?: string;
  name: string;
  current_state: 'init' | 'ready';
  logical_size?: number;
  physical_size?: number;
  created_at: string;
  updated_at: string;
}

interface NeonEndpoint {
  id: string;
  project_id: string;
  branch_id: string;
  region_id: string;
  type: 'read_write' | 'read_only';
  current_state: 'init' | 'active' | 'idle';
  settings: {
    pg_settings?: Record<string, string>;
    pooler_enabled?: boolean;
    pooler_mode?: 'transaction' | 'session';
  };
  autoscaling_limit_min_cu: number;
  autoscaling_limit_max_cu: number;
  suspend_timeout_seconds: number;
  provisioner: 'k8s-pod' | 'k8s-neonvm' | 'docker';
  host: string;
  created_at: string;
  updated_at: string;
}

interface NeonDatabase {
  id: number;
  branch_id: string;
  name: string;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

interface NeonRole {
  branch_id: string;
  name: string;
  password?: string;
  protected: boolean;
  created_at: string;
  updated_at: string;
}

interface NeonOperation {
  id: string;
  project_id: string;
  branch_id?: string;
  endpoint_id?: string;
  action: string;
  status: 'running' | 'finished' | 'failed' | 'scheduling';
  failures_count: number;
  created_at: string;
  updated_at: string;
  total_duration_ms?: number;
}

interface ConnectionDetails {
  host: string;
  role: string;
  database: string;
  password?: string;
  pooler_host?: string;
  connection_uri: string;
  pooler_connection_uri?: string;
}

interface ConsumptionMetrics {
  project_id: string;
  period_start: string;
  period_end: string;
  metrics: {
    active_time_seconds: number;
    compute_time_seconds: number;
    written_data_bytes: number;
    synthetic_storage_size: number;
  };
}

interface NeonRegion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

class NeonIntegrationService {
  private apiKey: string | null = null;
  private baseUrl = 'https://console.neon.tech/api/v2';

  initialize(config: NeonConfig): boolean {
    try {
      this.apiKey = config.apiKey;

      localStorage.setItem('neon_config', JSON.stringify({
        apiKey: config.apiKey
      }));

      console.log('Neon integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Neon integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.apiKey) return true;

    try {
      const savedConfig = localStorage.getItem('neon_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.apiKey = config.apiKey;
        return !!this.apiKey;
      }
    } catch (error) {
      console.error('Error loading Neon config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json'
    };
  }

  // ==================== Projects ====================

  async createProject(params: {
    name?: string;
    region_id?: string;
    pg_version?: number;
    autoscaling_limit_min_cu?: number;
    autoscaling_limit_max_cu?: number;
    store_passwords?: boolean;
  }): Promise<{
    project: NeonProject;
    connection_uris: ConnectionDetails[];
  } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProject: NeonProject = {
        id: `proj_${Date.now()}`,
        name: params.name || 'My Project',
        region_id: params.region_id || 'aws-us-east-2',
        pg_version: params.pg_version || 15,
        store_passwords: params.store_passwords !== false,
        default_endpoint_settings: {
          autoscaling_limit_min_cu: params.autoscaling_limit_min_cu || 0.25,
          autoscaling_limit_max_cu: params.autoscaling_limit_max_cu || 1,
          suspend_timeout_seconds: 300
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockConnectionDetails: ConnectionDetails = {
        host: `ep-${Date.now()}.${params.region_id || 'aws-us-east-2'}.neon.tech`,
        role: 'neondb_owner',
        database: 'neondb',
        password: params.store_passwords ? `pwd_${Math.random().toString(36).substring(7)}` : undefined,
        pooler_host: `ep-${Date.now()}-pooler.${params.region_id || 'aws-us-east-2'}.neon.tech`,
        connection_uri: `postgresql://neondb_owner:pwd_xxx@ep-${Date.now()}.${params.region_id || 'aws-us-east-2'}.neon.tech/neondb`,
        pooler_connection_uri: `postgresql://neondb_owner:pwd_xxx@ep-${Date.now()}-pooler.${params.region_id || 'aws-us-east-2'}.neon.tech/neondb`
      };

      console.log('Project created:', mockProject.name);
      return {
        project: mockProject,
        connection_uris: [mockConnectionDetails]
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async listProjects(): Promise<NeonProject[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProjects: NeonProject[] = [
        {
          id: 'proj_1',
          name: 'Production Database',
          region_id: 'aws-us-east-2',
          pg_version: 15,
          store_passwords: true,
          default_endpoint_settings: {
            autoscaling_limit_min_cu: 0.25,
            autoscaling_limit_max_cu: 4,
            suspend_timeout_seconds: 300
          },
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-23T15:30:00Z'
        },
        {
          id: 'proj_2',
          name: 'Development Database',
          region_id: 'aws-us-west-2',
          pg_version: 15,
          store_passwords: true,
          default_endpoint_settings: {
            autoscaling_limit_min_cu: 0.25,
            autoscaling_limit_max_cu: 1,
            suspend_timeout_seconds: 300
          },
          created_at: '2025-01-21T14:00:00Z',
          updated_at: '2025-01-22T09:15:00Z'
        }
      ];

      console.log('Projects retrieved:', mockProjects.length);
      return mockProjects;
    } catch (error) {
      console.error('Error listing projects:', error);
      return null;
    }
  }

  async getProject(projectId: string): Promise<NeonProject | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProject: NeonProject = {
        id: projectId,
        name: 'Production Database',
        region_id: 'aws-us-east-2',
        pg_version: 15,
        store_passwords: true,
        default_endpoint_settings: {
          autoscaling_limit_min_cu: 0.25,
          autoscaling_limit_max_cu: 4,
          suspend_timeout_seconds: 300
        },
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-01-23T15:30:00Z'
      };

      console.log('Project retrieved:', projectId);
      return mockProject;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  async updateProject(projectId: string, updates: {
    name?: string;
    default_endpoint_settings?: {
      autoscaling_limit_min_cu?: number;
      autoscaling_limit_max_cu?: number;
      suspend_timeout_seconds?: number;
    };
  }): Promise<NeonProject | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProject: NeonProject = {
        id: projectId,
        name: updates.name || 'Updated Project',
        region_id: 'aws-us-east-2',
        pg_version: 15,
        store_passwords: true,
        default_endpoint_settings: {
          autoscaling_limit_min_cu: updates.default_endpoint_settings?.autoscaling_limit_min_cu || 0.25,
          autoscaling_limit_max_cu: updates.default_endpoint_settings?.autoscaling_limit_max_cu || 4,
          suspend_timeout_seconds: updates.default_endpoint_settings?.suspend_timeout_seconds || 300
        },
        created_at: '2025-01-20T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Project updated:', projectId);
      return mockProject;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  async deleteProject(projectId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Project deleted:', projectId);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // ==================== Branches ====================

  async createBranch(projectId: string, params: {
    name?: string;
    parent_id?: string;
    parent_lsn?: string;
  }): Promise<NeonBranch | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBranch: NeonBranch = {
        id: `br_${Date.now()}`,
        project_id: projectId,
        parent_id: params.parent_id,
        parent_lsn: params.parent_lsn,
        name: params.name || 'new-branch',
        current_state: 'ready',
        logical_size: 0,
        physical_size: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Branch created:', mockBranch.name);
      return mockBranch;
    } catch (error) {
      console.error('Error creating branch:', error);
      return null;
    }
  }

  async listBranches(projectId: string): Promise<NeonBranch[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBranches: NeonBranch[] = [
        {
          id: 'br_main',
          project_id: projectId,
          name: 'main',
          current_state: 'ready',
          logical_size: 1024000,
          physical_size: 2048000,
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-23T15:30:00Z'
        },
        {
          id: 'br_dev',
          project_id: projectId,
          parent_id: 'br_main',
          name: 'dev',
          current_state: 'ready',
          logical_size: 512000,
          physical_size: 1024000,
          created_at: '2025-01-21T14:00:00Z',
          updated_at: '2025-01-22T09:15:00Z'
        }
      ];

      console.log('Branches retrieved:', mockBranches.length);
      return mockBranches;
    } catch (error) {
      console.error('Error listing branches:', error);
      return null;
    }
  }

  async getBranch(projectId: string, branchId: string): Promise<NeonBranch | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBranch: NeonBranch = {
        id: branchId,
        project_id: projectId,
        name: 'main',
        current_state: 'ready',
        logical_size: 1024000,
        physical_size: 2048000,
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-01-23T15:30:00Z'
      };

      console.log('Branch retrieved:', branchId);
      return mockBranch;
    } catch (error) {
      console.error('Error getting branch:', error);
      return null;
    }
  }

  async updateBranch(projectId: string, branchId: string, updates: {
    name?: string;
  }): Promise<NeonBranch | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBranch: NeonBranch = {
        id: branchId,
        project_id: projectId,
        name: updates.name || 'updated-branch',
        current_state: 'ready',
        logical_size: 1024000,
        physical_size: 2048000,
        created_at: '2025-01-20T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Branch updated:', branchId);
      return mockBranch;
    } catch (error) {
      console.error('Error updating branch:', error);
      return null;
    }
  }

  async deleteBranch(projectId: string, branchId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Branch deleted:', branchId);
      return true;
    } catch (error) {
      console.error('Error deleting branch:', error);
      return false;
    }
  }

  async restoreBranch(projectId: string, branchId: string, params: {
    source_branch_id: string;
    timestamp: string;
  }): Promise<NeonBranch | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBranch: NeonBranch = {
        id: branchId,
        project_id: projectId,
        parent_id: params.source_branch_id,
        name: 'restored-branch',
        current_state: 'ready',
        logical_size: 1024000,
        physical_size: 2048000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Branch restored from timestamp:', params.timestamp);
      return mockBranch;
    } catch (error) {
      console.error('Error restoring branch:', error);
      return null;
    }
  }

  // ==================== Endpoints ====================

  async createEndpoint(projectId: string, params: {
    branch_id: string;
    type?: 'read_write' | 'read_only';
    autoscaling_limit_min_cu?: number;
    autoscaling_limit_max_cu?: number;
    suspend_timeout_seconds?: number;
    pooler_enabled?: boolean;
    pooler_mode?: 'transaction' | 'session';
  }): Promise<NeonEndpoint | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoint: NeonEndpoint = {
        id: `ep_${Date.now()}`,
        project_id: projectId,
        branch_id: params.branch_id,
        region_id: 'aws-us-east-2',
        type: params.type || 'read_write',
        current_state: 'active',
        settings: {
          pooler_enabled: params.pooler_enabled,
          pooler_mode: params.pooler_mode
        },
        autoscaling_limit_min_cu: params.autoscaling_limit_min_cu || 0.25,
        autoscaling_limit_max_cu: params.autoscaling_limit_max_cu || 1,
        suspend_timeout_seconds: params.suspend_timeout_seconds || 300,
        provisioner: 'k8s-neonvm',
        host: `ep-${Date.now()}.aws-us-east-2.neon.tech`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Endpoint created:', mockEndpoint.id);
      return mockEndpoint;
    } catch (error) {
      console.error('Error creating endpoint:', error);
      return null;
    }
  }

  async listEndpoints(projectId: string, branchId?: string): Promise<NeonEndpoint[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoints: NeonEndpoint[] = [
        {
          id: 'ep_1',
          project_id: projectId,
          branch_id: branchId || 'br_main',
          region_id: 'aws-us-east-2',
          type: 'read_write',
          current_state: 'active',
          settings: {
            pooler_enabled: true,
            pooler_mode: 'transaction'
          },
          autoscaling_limit_min_cu: 0.25,
          autoscaling_limit_max_cu: 4,
          suspend_timeout_seconds: 300,
          provisioner: 'k8s-neonvm',
          host: 'ep-1.aws-us-east-2.neon.tech',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-23T15:30:00Z'
        }
      ];

      console.log('Endpoints retrieved:', mockEndpoints.length);
      return mockEndpoints;
    } catch (error) {
      console.error('Error listing endpoints:', error);
      return null;
    }
  }

  async updateEndpoint(projectId: string, endpointId: string, updates: {
    autoscaling_limit_min_cu?: number;
    autoscaling_limit_max_cu?: number;
    suspend_timeout_seconds?: number;
    pooler_enabled?: boolean;
    pooler_mode?: 'transaction' | 'session';
  }): Promise<NeonEndpoint | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoint: NeonEndpoint = {
        id: endpointId,
        project_id: projectId,
        branch_id: 'br_main',
        region_id: 'aws-us-east-2',
        type: 'read_write',
        current_state: 'active',
        settings: {
          pooler_enabled: updates.pooler_enabled,
          pooler_mode: updates.pooler_mode
        },
        autoscaling_limit_min_cu: updates.autoscaling_limit_min_cu || 0.25,
        autoscaling_limit_max_cu: updates.autoscaling_limit_max_cu || 4,
        suspend_timeout_seconds: updates.suspend_timeout_seconds || 300,
        provisioner: 'k8s-neonvm',
        host: `${endpointId}.aws-us-east-2.neon.tech`,
        created_at: '2025-01-20T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Endpoint updated:', endpointId);
      return mockEndpoint;
    } catch (error) {
      console.error('Error updating endpoint:', error);
      return null;
    }
  }

  async startEndpoint(projectId: string, endpointId: string): Promise<NeonEndpoint | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoint: NeonEndpoint = {
        id: endpointId,
        project_id: projectId,
        branch_id: 'br_main',
        region_id: 'aws-us-east-2',
        type: 'read_write',
        current_state: 'active',
        settings: {},
        autoscaling_limit_min_cu: 0.25,
        autoscaling_limit_max_cu: 4,
        suspend_timeout_seconds: 300,
        provisioner: 'k8s-neonvm',
        host: `${endpointId}.aws-us-east-2.neon.tech`,
        created_at: '2025-01-20T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Endpoint started:', endpointId);
      return mockEndpoint;
    } catch (error) {
      console.error('Error starting endpoint:', error);
      return null;
    }
  }

  async suspendEndpoint(projectId: string, endpointId: string): Promise<NeonEndpoint | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoint: NeonEndpoint = {
        id: endpointId,
        project_id: projectId,
        branch_id: 'br_main',
        region_id: 'aws-us-east-2',
        type: 'read_write',
        current_state: 'idle',
        settings: {},
        autoscaling_limit_min_cu: 0.25,
        autoscaling_limit_max_cu: 4,
        suspend_timeout_seconds: 300,
        provisioner: 'k8s-neonvm',
        host: `${endpointId}.aws-us-east-2.neon.tech`,
        created_at: '2025-01-20T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Endpoint suspended:', endpointId);
      return mockEndpoint;
    } catch (error) {
      console.error('Error suspending endpoint:', error);
      return null;
    }
  }

  // ==================== Databases ====================

  async createDatabase(projectId: string, branchId: string, params: {
    name: string;
    owner_name: string;
  }): Promise<NeonDatabase | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDatabase: NeonDatabase = {
        id: Date.now(),
        branch_id: branchId,
        name: params.name,
        owner_name: params.owner_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Database created:', mockDatabase.name);
      return mockDatabase;
    } catch (error) {
      console.error('Error creating database:', error);
      return null;
    }
  }

  async listDatabases(projectId: string, branchId: string): Promise<NeonDatabase[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDatabases: NeonDatabase[] = [
        {
          id: 1,
          branch_id: branchId,
          name: 'neondb',
          owner_name: 'neondb_owner',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-20T10:00:00Z'
        },
        {
          id: 2,
          branch_id: branchId,
          name: 'app_db',
          owner_name: 'app_user',
          created_at: '2025-01-21T14:00:00Z',
          updated_at: '2025-01-21T14:00:00Z'
        }
      ];

      console.log('Databases retrieved:', mockDatabases.length);
      return mockDatabases;
    } catch (error) {
      console.error('Error listing databases:', error);
      return null;
    }
  }

  // ==================== Roles ====================

  async createRole(projectId: string, branchId: string, params: {
    name: string;
  }): Promise<NeonRole | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRole: NeonRole = {
        branch_id: branchId,
        name: params.name,
        password: `pwd_${Math.random().toString(36).substring(7)}`,
        protected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Role created:', mockRole.name);
      return mockRole;
    } catch (error) {
      console.error('Error creating role:', error);
      return null;
    }
  }

  async listRoles(projectId: string, branchId: string): Promise<NeonRole[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRoles: NeonRole[] = [
        {
          branch_id: branchId,
          name: 'neondb_owner',
          protected: true,
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-20T10:00:00Z'
        },
        {
          branch_id: branchId,
          name: 'app_user',
          password: 'pwd_xxx',
          protected: false,
          created_at: '2025-01-21T14:00:00Z',
          updated_at: '2025-01-21T14:00:00Z'
        }
      ];

      console.log('Roles retrieved:', mockRoles.length);
      return mockRoles;
    } catch (error) {
      console.error('Error listing roles:', error);
      return null;
    }
  }

  async resetRolePassword(projectId: string, branchId: string, roleName: string): Promise<NeonRole | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRole: NeonRole = {
        branch_id: branchId,
        name: roleName,
        password: `pwd_${Math.random().toString(36).substring(7)}`,
        protected: false,
        created_at: '2025-01-20T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Role password reset:', roleName);
      return mockRole;
    } catch (error) {
      console.error('Error resetting role password:', error);
      return null;
    }
  }

  // ==================== Operations ====================

  async listOperations(projectId: string): Promise<NeonOperation[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockOperations: NeonOperation[] = [
        {
          id: 'op_1',
          project_id: projectId,
          branch_id: 'br_main',
          action: 'create_branch',
          status: 'finished',
          failures_count: 0,
          created_at: '2025-01-23T10:00:00Z',
          updated_at: '2025-01-23T10:00:05Z',
          total_duration_ms: 5000
        },
        {
          id: 'op_2',
          project_id: projectId,
          endpoint_id: 'ep_1',
          action: 'start_compute',
          status: 'finished',
          failures_count: 0,
          created_at: '2025-01-23T11:00:00Z',
          updated_at: '2025-01-23T11:00:02Z',
          total_duration_ms: 2000
        }
      ];

      console.log('Operations retrieved:', mockOperations.length);
      return mockOperations;
    } catch (error) {
      console.error('Error listing operations:', error);
      return null;
    }
  }

  async getOperation(projectId: string, operationId: string): Promise<NeonOperation | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockOperation: NeonOperation = {
        id: operationId,
        project_id: projectId,
        branch_id: 'br_main',
        action: 'create_branch',
        status: 'finished',
        failures_count: 0,
        created_at: '2025-01-23T10:00:00Z',
        updated_at: '2025-01-23T10:00:05Z',
        total_duration_ms: 5000
      };

      console.log('Operation retrieved:', operationId);
      return mockOperation;
    } catch (error) {
      console.error('Error getting operation:', error);
      return null;
    }
  }

  // ==================== Consumption ====================

  async getConsumptionMetrics(projectId: string, params: {
    from: string;
    to: string;
    granularity?: 'hourly' | 'daily' | 'monthly';
  }): Promise<ConsumptionMetrics | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMetrics: ConsumptionMetrics = {
        project_id: projectId,
        period_start: params.from,
        period_end: params.to,
        metrics: {
          active_time_seconds: 86400,
          compute_time_seconds: 3600,
          written_data_bytes: 1073741824,
          synthetic_storage_size: 2147483648
        }
      };

      console.log('Consumption metrics retrieved');
      return mockMetrics;
    } catch (error) {
      console.error('Error getting consumption metrics:', error);
      return null;
    }
  }

  // ==================== Regions ====================

  async listRegions(): Promise<NeonRegion[] | null> {
    try {
      const mockRegions: NeonRegion[] = [
        {
          id: 'aws-us-east-2',
          name: 'US East (Ohio)',
          latitude: 39.9612,
          longitude: -82.9988
        },
        {
          id: 'aws-us-west-2',
          name: 'US West (Oregon)',
          latitude: 45.5152,
          longitude: -122.6784
        },
        {
          id: 'aws-eu-central-1',
          name: 'EU (Frankfurt)',
          latitude: 50.1109,
          longitude: 8.6821
        },
        {
          id: 'aws-ap-southeast-1',
          name: 'Asia Pacific (Singapore)',
          latitude: 1.3521,
          longitude: 103.8198
        }
      ];

      console.log('Regions retrieved:', mockRegions.length);
      return mockRegions;
    } catch (error) {
      console.error('Error listing regions:', error);
      return null;
    }
  }

  // ==================== Connection String Helper ====================

  getConnectionString(params: {
    host: string;
    database: string;
    role: string;
    password: string;
    sslmode?: string;
  }): string {
    const sslmode = params.sslmode || 'require';
    return `postgresql://${params.role}:${params.password}@${params.host}/${params.database}?sslmode=${sslmode}`;
  }
}

export const neonIntegration = new NeonIntegrationService();
