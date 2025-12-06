/**
 * HashDocs Integration Service
 *
 * HashDocs is an open-source document management and e-signature platform.
 * Provides digital signing, document workflows, and secure storage.
 *
 * Features:
 * - Electronic signatures (e-sign)
 * - Document templates
 * - Workflow automation
 * - Secure document storage
 * - Audit trails
 * - Certificate generation
 * - Multi-party signing
 * - Document versioning
 * - Access controls
 * - API-first architecture
 *
 * Documentation: https://hashdocs.org/
 * GitHub: https://github.com/hashdocs/hashdocs
 * Value: Open-source e-signature and document management
 */

interface HashDocsConfig {
  apiKey: string;
  organizationId?: string;
  instanceUrl?: string; // For self-hosted instances
}

// Document Types
interface Document {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  status: 'draft' | 'pending' | 'signed' | 'completed' | 'cancelled' | 'expired';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  signedAt?: string;
  metadata?: Record<string, any>;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fields: TemplateField[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

interface TemplateField {
  id: string;
  type: 'signature' | 'text' | 'date' | 'checkbox' | 'initials';
  label: string;
  required: boolean;
  position: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  assignedTo?: 'sender' | 'signer' | string; // Role or specific user
}

// Signature Types
interface SignatureRequest {
  id: string;
  documentId: string;
  signers: Signer[];
  message?: string;
  subject?: string;
  status: 'pending' | 'completed' | 'declined' | 'cancelled';
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

interface Signer {
  id: string;
  name: string;
  email: string;
  role?: string;
  order: number;
  status: 'pending' | 'viewed' | 'signed' | 'declined';
  signedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  signature?: {
    type: 'draw' | 'type' | 'upload';
    data: string;
  };
}

interface SignatureField {
  id: string;
  documentId: string;
  signerId: string;
  type: 'signature' | 'initial' | 'text' | 'date' | 'checkbox';
  value?: string;
  position: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  required: boolean;
  completed: boolean;
}

// Workflow Types
interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  templateId?: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

interface WorkflowStep {
  id: string;
  order: number;
  action: 'sign' | 'approve' | 'review' | 'receive';
  assignee: {
    type: 'role' | 'user' | 'email';
    value: string;
  };
  dueInDays?: number;
  required: boolean;
}

// Certificate Types
interface Certificate {
  id: string;
  documentId: string;
  signatureRequestId: string;
  type: 'completion' | 'signature';
  certificateUrl: string;
  hash: string;
  timestamp: string;
  signers: Array<{
    name: string;
    email: string;
    signedAt: string;
    ipAddress?: string;
  }>;
  issuedAt: string;
}

// Audit Types
interface AuditLog {
  id: string;
  documentId: string;
  action: 'created' | 'viewed' | 'signed' | 'declined' | 'completed' | 'cancelled' | 'downloaded';
  actor: {
    id: string;
    name: string;
    email: string;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Folder/Organization Types
interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  documentCount: number;
  createdBy: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  settings: {
    allowExternalSigners: boolean;
    requireEmailVerification: boolean;
    defaultExpirationDays: number;
    brandingEnabled: boolean;
  };
  createdAt: string;
}

class HashDocsIntegrationService {
  private apiKey: string | null = null;
  private organizationId: string | null = null;
  private baseUrl = 'https://api.hashdocs.org';

  /**
   * Initialize HashDocs integration
   */
  initialize(config: HashDocsConfig): void {
    this.apiKey = config.apiKey;
    this.organizationId = config.organizationId || null;
    this.baseUrl = config.instanceUrl || 'https://api.hashdocs.org';

    // Store in localStorage
    localStorage.setItem('hashdocs_api_key', config.apiKey);
    if (config.organizationId) {
      localStorage.setItem('hashdocs_organization_id', config.organizationId);
    }
    if (config.instanceUrl) {
      localStorage.setItem('hashdocs_instance_url', config.instanceUrl);
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-Organization-Id': this.organizationId || ''
    };
  }

  // ==================== DOCUMENT MANAGEMENT ====================

  /**
   * Upload a document
   */
  async uploadDocument(params: {
    name: string;
    file: File | Blob;
    description?: string;
    folderId?: string;
    metadata?: Record<string, any>;
  }): Promise<Document | null> {
    if (!this.isConfigured()) {
      console.error('HashDocs not configured');
      return null;
    }

    try {
      // Mock implementation - replace with real API call
      // Real: POST /api/documents (multipart/form-data)
      const newDocument: Document = {
        id: `doc_${Date.now()}`,
        name: params.name,
        description: params.description,
        fileUrl: 'https://example.com/documents/sample.pdf',
        fileType: 'application/pdf',
        fileSize: params.file.size,
        status: 'draft',
        createdBy: 'user_001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: params.metadata
      };

      console.log('Document uploaded:', newDocument);
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      return null;
    }
  }

  /**
   * Get all documents
   */
  async getDocuments(params?: {
    status?: string;
    folderId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Document[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/documents
      return [
        {
          id: 'doc_001',
          name: 'Employment Contract.pdf',
          fileUrl: 'https://example.com/documents/contract.pdf',
          fileType: 'application/pdf',
          fileSize: 245678,
          status: 'pending',
          createdBy: 'user_001',
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-01-22T14:30:00Z',
          expiresAt: '2025-02-20T10:00:00Z'
        },
        {
          id: 'doc_002',
          name: 'NDA Agreement.pdf',
          fileUrl: 'https://example.com/documents/nda.pdf',
          fileType: 'application/pdf',
          fileSize: 156789,
          status: 'signed',
          createdBy: 'user_001',
          createdAt: '2025-01-15T09:00:00Z',
          updatedAt: '2025-01-18T16:45:00Z',
          signedAt: '2025-01-18T16:45:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  /**
   * Get document details
   */
  async getDocument(documentId: string): Promise<Document | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: GET /api/documents/{documentId}
      return {
        id: documentId,
        name: 'Sample Document.pdf',
        fileUrl: 'https://example.com/documents/sample.pdf',
        fileType: 'application/pdf',
        fileSize: 245678,
        status: 'draft',
        createdBy: 'user_001',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      // Mock implementation
      // Real: DELETE /api/documents/{documentId}
      console.log(`Deleting document ${documentId}`);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  // ==================== SIGNATURE REQUESTS ====================

  /**
   * Create a signature request
   */
  async createSignatureRequest(params: {
    documentId: string;
    signers: Array<{
      name: string;
      email: string;
      role?: string;
      order?: number;
    }>;
    subject?: string;
    message?: string;
    expiresInDays?: number;
  }): Promise<SignatureRequest | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST /api/signature-requests
      const newRequest: SignatureRequest = {
        id: `sig_${Date.now()}`,
        documentId: params.documentId,
        signers: params.signers.map((s, idx) => ({
          id: `signer_${idx}`,
          name: s.name,
          email: s.email,
          role: s.role,
          order: s.order || idx + 1,
          status: 'pending'
        })),
        subject: params.subject,
        message: params.message,
        status: 'pending',
        createdBy: 'user_001',
        createdAt: new Date().toISOString(),
        expiresAt: params.expiresInDays
          ? new Date(Date.now() + params.expiresInDays * 86400000).toISOString()
          : undefined
      };

      console.log('Signature request created:', newRequest);
      return newRequest;
    } catch (error) {
      console.error('Error creating signature request:', error);
      return null;
    }
  }

  /**
   * Get signature request details
   */
  async getSignatureRequest(requestId: string): Promise<SignatureRequest | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: GET /api/signature-requests/{requestId}
      return {
        id: requestId,
        documentId: 'doc_001',
        signers: [
          {
            id: 'signer_001',
            name: 'John Doe',
            email: 'john@example.com',
            order: 1,
            status: 'signed',
            signedAt: '2025-01-22T10:30:00Z'
          },
          {
            id: 'signer_002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            order: 2,
            status: 'pending'
          }
        ],
        status: 'pending',
        createdBy: 'user_001',
        createdAt: '2025-01-20T10:00:00Z',
        expiresAt: '2025-02-20T10:00:00Z'
      };
    } catch (error) {
      console.error('Error fetching signature request:', error);
      return null;
    }
  }

  /**
   * Cancel a signature request
   */
  async cancelSignatureRequest(requestId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      // Mock implementation
      // Real: POST /api/signature-requests/{requestId}/cancel
      console.log(`Cancelling signature request ${requestId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling signature request:', error);
      return false;
    }
  }

  /**
   * Resend signature request reminder
   */
  async resendReminder(requestId: string, signerId?: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      // Mock implementation
      // Real: POST /api/signature-requests/{requestId}/remind
      console.log(`Sending reminder for ${requestId}`, signerId ? `to signer ${signerId}` : 'to all');
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      return false;
    }
  }

  // ==================== SIGNATURES ====================

  /**
   * Sign a document
   */
  async signDocument(params: {
    requestId: string;
    signerId: string;
    signature: {
      type: 'draw' | 'type' | 'upload';
      data: string;
    };
    fields: Array<{
      fieldId: string;
      value: string;
    }>;
  }): Promise<{ success: boolean; certificate?: Certificate }> {
    if (!this.isConfigured()) return { success: false };

    try {
      // Mock implementation
      // Real: POST /api/signature-requests/{requestId}/sign
      console.log('Signing document:', params);

      const certificate: Certificate = {
        id: `cert_${Date.now()}`,
        documentId: 'doc_001',
        signatureRequestId: params.requestId,
        type: 'signature',
        certificateUrl: 'https://example.com/certificates/cert.pdf',
        hash: 'sha256:1234567890abcdef',
        timestamp: new Date().toISOString(),
        signers: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            signedAt: new Date().toISOString(),
            ipAddress: '192.168.1.1'
          }
        ],
        issuedAt: new Date().toISOString()
      };

      return { success: true, certificate };
    } catch (error) {
      console.error('Error signing document:', error);
      return { success: false };
    }
  }

  /**
   * Decline to sign
   */
  async declineToSign(requestId: string, signerId: string, reason?: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      // Mock implementation
      // Real: POST /api/signature-requests/{requestId}/decline
      console.log(`Declining signature for ${requestId}:`, reason);
      return true;
    } catch (error) {
      console.error('Error declining signature:', error);
      return false;
    }
  }

  // ==================== TEMPLATES ====================

  /**
   * Get all templates
   */
  async getTemplates(params?: { active?: boolean }): Promise<DocumentTemplate[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/templates
      return [
        {
          id: 'tmpl_001',
          name: 'Employment Contract Template',
          description: 'Standard employment agreement',
          fileUrl: 'https://example.com/templates/employment.pdf',
          fields: [
            {
              id: 'field_001',
              type: 'signature',
              label: 'Employee Signature',
              required: true,
              position: { page: 1, x: 100, y: 700, width: 200, height: 50 },
              assignedTo: 'signer'
            },
            {
              id: 'field_002',
              type: 'date',
              label: 'Date',
              required: true,
              position: { page: 1, x: 350, y: 700, width: 100, height: 50 },
              assignedTo: 'signer'
            }
          ],
          createdBy: 'user_001',
          createdAt: '2024-12-01T10:00:00Z',
          isActive: true
        }
      ];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }

  /**
   * Create document from template
   */
  async createFromTemplate(templateId: string, params: {
    name: string;
    fieldValues?: Record<string, string>;
  }): Promise<Document | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST /api/templates/{templateId}/create-document
      console.log(`Creating document from template ${templateId}:`, params);
      return {
        id: `doc_${Date.now()}`,
        name: params.name,
        fileUrl: 'https://example.com/documents/new.pdf',
        fileType: 'application/pdf',
        fileSize: 245678,
        status: 'draft',
        createdBy: 'user_001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating from template:', error);
      return null;
    }
  }

  // ==================== WORKFLOWS ====================

  /**
   * Get workflows
   */
  async getWorkflows(): Promise<Workflow[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/workflows
      return [
        {
          id: 'wf_001',
          name: 'Contract Approval Process',
          description: 'Legal review → Manager approval → Signer',
          steps: [
            {
              id: 'step_001',
              order: 1,
              action: 'review',
              assignee: { type: 'role', value: 'legal' },
              dueInDays: 3,
              required: true
            },
            {
              id: 'step_002',
              order: 2,
              action: 'approve',
              assignee: { type: 'role', value: 'manager' },
              dueInDays: 2,
              required: true
            },
            {
              id: 'step_003',
              order: 3,
              action: 'sign',
              assignee: { type: 'email', value: 'external@example.com' },
              dueInDays: 7,
              required: true
            }
          ],
          status: 'active',
          createdBy: 'user_001',
          createdAt: '2024-11-15T10:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return [];
    }
  }

  /**
   * Start a workflow for a document
   */
  async startWorkflow(documentId: string, workflowId: string): Promise<{ success: boolean; requestId?: string }> {
    if (!this.isConfigured()) return { success: false };

    try {
      // Mock implementation
      // Real: POST /api/workflows/{workflowId}/start
      console.log(`Starting workflow ${workflowId} for document ${documentId}`);
      return {
        success: true,
        requestId: `sig_${Date.now()}`
      };
    } catch (error) {
      console.error('Error starting workflow:', error);
      return { success: false };
    }
  }

  // ==================== CERTIFICATES & AUDIT ====================

  /**
   * Get completion certificate
   */
  async getCertificate(documentId: string): Promise<Certificate | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: GET /api/documents/{documentId}/certificate
      return {
        id: 'cert_001',
        documentId,
        signatureRequestId: 'sig_001',
        type: 'completion',
        certificateUrl: 'https://example.com/certificates/cert.pdf',
        hash: 'sha256:1234567890abcdef',
        timestamp: '2025-01-22T16:45:00Z',
        signers: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            signedAt: '2025-01-22T10:30:00Z',
            ipAddress: '192.168.1.1'
          },
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
            signedAt: '2025-01-22T16:45:00Z',
            ipAddress: '192.168.1.2'
          }
        ],
        issuedAt: '2025-01-22T16:45:00Z'
      };
    } catch (error) {
      console.error('Error fetching certificate:', error);
      return null;
    }
  }

  /**
   * Get audit trail for a document
   */
  async getAuditTrail(documentId: string): Promise<AuditLog[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/documents/{documentId}/audit
      return [
        {
          id: 'audit_001',
          documentId,
          action: 'created',
          actor: { id: 'user_001', name: 'Admin User', email: 'admin@example.com' },
          timestamp: '2025-01-20T10:00:00Z',
          ipAddress: '192.168.1.1'
        },
        {
          id: 'audit_002',
          documentId,
          action: 'viewed',
          actor: { id: 'signer_001', name: 'John Doe', email: 'john@example.com' },
          timestamp: '2025-01-22T09:15:00Z',
          ipAddress: '192.168.1.5'
        },
        {
          id: 'audit_003',
          documentId,
          action: 'signed',
          actor: { id: 'signer_001', name: 'John Doe', email: 'john@example.com' },
          timestamp: '2025-01-22T10:30:00Z',
          ipAddress: '192.168.1.5'
        }
      ];
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      return [];
    }
  }

  // ==================== FOLDERS ====================

  /**
   * Get folders
   */
  async getFolders(parentId?: string): Promise<Folder[]> {
    if (!this.isConfigured()) return [];

    try {
      // Mock implementation
      // Real: GET /api/folders
      return [
        {
          id: 'folder_001',
          name: 'Contracts',
          description: 'All contract documents',
          documentCount: 12,
          createdBy: 'user_001',
          createdAt: '2024-12-01T10:00:00Z'
        },
        {
          id: 'folder_002',
          name: 'NDAs',
          parentId: 'folder_001',
          documentCount: 5,
          createdBy: 'user_001',
          createdAt: '2025-01-05T10:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching folders:', error);
      return [];
    }
  }

  /**
   * Create a folder
   */
  async createFolder(params: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<Folder | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock implementation
      // Real: POST /api/folders
      const newFolder: Folder = {
        id: `folder_${Date.now()}`,
        name: params.name,
        description: params.description,
        parentId: params.parentId,
        documentCount: 0,
        createdBy: 'user_001',
        createdAt: new Date().toISOString()
      };

      console.log('Folder created:', newFolder);
      return newFolder;
    } catch (error) {
      console.error('Error creating folder:', error);
      return null;
    }
  }
}

// Export singleton instance
export const hashDocsIntegration = new HashDocsIntegrationService();
export default hashDocsIntegration;
