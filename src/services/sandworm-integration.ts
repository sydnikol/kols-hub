/**
 * Sandworm Integration Service
 *
 * Sandworm provides security and compliance scanning for npm packages.
 * Helps identify vulnerabilities, license issues, and supply chain risks.
 *
 * Features:
 * - Dependency vulnerability scanning
 * - License compliance checking
 * - Supply chain risk analysis
 * - SBOM (Software Bill of Materials) generation
 * - Security advisories
 * - Dependency tree visualization
 * - CVE tracking
 * - License policy enforcement
 * - Automated security reports
 * - CI/CD integration
 *
 * API Documentation: https://docs.sandworm.dev/
 * GitHub: https://github.com/sandworm-hq/sandworm-audit
 * Value: Open-source security and compliance platform
 */

interface SandwormConfig {
  apiKey?: string;
  projectPath?: string;
}

// Vulnerability Types
interface Vulnerability {
  id: string;
  cve?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  package: string;
  version: string;
  patchedVersions?: string;
  vulnerableVersions: string;
  publishedDate: string;
  modifiedDate: string;
  cwes: string[];
  references: string[];
  recommendation?: string;
}

interface VulnerabilityScan {
  id: string;
  timestamp: string;
  totalVulnerabilities: number;
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  vulnerabilities: Vulnerability[];
  fixAvailable: number;
  requiresUpdate: string[];
}

// License Types
interface License {
  name: string;
  spdxId: string;
  url?: string;
  category: 'permissive' | 'copyleft' | 'restrictive' | 'public-domain' | 'unknown';
  riskLevel: 'low' | 'medium' | 'high';
  requiresAttribution: boolean;
  allowsCommercialUse: boolean;
}

interface LicenseIssue {
  package: string;
  version: string;
  license: License;
  issue: 'incompatible' | 'missing' | 'unknown' | 'risky';
  description: string;
  recommendation?: string;
}

interface LicenseScan {
  id: string;
  timestamp: string;
  totalPackages: number;
  issues: LicenseIssue[];
  byCategory: {
    permissive: number;
    copyleft: number;
    restrictive: number;
    unknown: number;
  };
  compliance: 'pass' | 'warning' | 'fail';
}

// Dependency Types
interface Dependency {
  name: string;
  version: string;
  type: 'direct' | 'dev' | 'peer' | 'optional';
  path: string[];
  depth: number;
  licenses: string[];
  vulnerabilities: number;
  isDeprecated: boolean;
  latestVersion?: string;
}

interface DependencyTree {
  name: string;
  version: string;
  dependencies: DependencyNode[];
  totalCount: number;
  directCount: number;
  devCount: number;
}

interface DependencyNode {
  name: string;
  version: string;
  type: string;
  children: DependencyNode[];
  issues: {
    vulnerabilities: number;
    licenseIssues: number;
    deprecated: boolean;
  };
}

// SBOM Types
interface SBOM {
  bomFormat: 'CycloneDX' | 'SPDX';
  specVersion: string;
  serialNumber: string;
  version: number;
  metadata: {
    timestamp: string;
    tools: Array<{ vendor: string; name: string; version: string }>;
    component: {
      type: 'application';
      name: string;
      version: string;
    };
  };
  components: SBOMComponent[];
}

interface SBOMComponent {
  type: 'library';
  name: string;
  version: string;
  purl: string; // Package URL
  licenses?: Array<{ license: { id: string; name: string } }>;
  hashes?: Array<{ alg: string; content: string }>;
  externalReferences?: Array<{
    type: string;
    url: string;
  }>;
}

// Supply Chain Types
interface SupplyChainRisk {
  package: string;
  version: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  risks: Array<{
    type: 'maintainer-change' | 'typosquatting' | 'abandoned' | 'suspicious-activity' | 'malware';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    detectedAt: string;
  }>;
  maintainers: Array<{
    name: string;
    email: string;
    joinedAt?: string;
  }>;
  downloads: {
    weekly: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  lastPublish: string;
  repository?: string;
}

// Policy Types
interface SecurityPolicy {
  id: string;
  name: string;
  description?: string;
  rules: Array<{
    type: 'vulnerability' | 'license' | 'supply-chain';
    severity?: string[];
    licenses?: string[];
    action: 'block' | 'warn' | 'log';
  }>;
  createdAt: string;
  updatedAt: string;
}

// Report Types
interface SecurityReport {
  id: string;
  projectName: string;
  timestamp: string;
  summary: {
    totalDependencies: number;
    vulnerabilities: VulnerabilityScan;
    licenses: LicenseScan;
    supplyChainRisks: number;
    overallRisk: 'critical' | 'high' | 'medium' | 'low';
    complianceScore: number;
  };
  recommendations: string[];
  fixCommands: string[];
}

class SandwormIntegrationService {
  private apiKey: string | null = null;
  private projectPath: string = process.cwd();

  /**
   * Initialize Sandworm integration
   */
  initialize(config: SandwormConfig): void {
    this.apiKey = config.apiKey || null;
    this.projectPath = config.projectPath || process.cwd();

    // Store in localStorage
    if (config.apiKey) {
      localStorage.setItem('sandworm_api_key', config.apiKey);
    }
    if (config.projectPath) {
      localStorage.setItem('sandworm_project_path', config.projectPath);
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return true; // Can work without API key for basic scans
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  // ==================== VULNERABILITY SCANNING ====================

  /**
   * Scan project for vulnerabilities
   */
  async scanVulnerabilities(params?: {
    severity?: string[];
    includeDevDeps?: boolean;
  }): Promise<VulnerabilityScan | null> {
    try {
      // Mock implementation - replace with real Sandworm API/CLI call
      // Real: Run sandworm audit command or API call
      return {
        id: `scan_${Date.now()}`,
        timestamp: new Date().toISOString(),
        totalVulnerabilities: 5,
        bySeverity: {
          critical: 1,
          high: 2,
          medium: 1,
          low: 1,
          info: 0
        },
        vulnerabilities: [
          {
            id: 'vuln_001',
            cve: 'CVE-2024-1234',
            severity: 'critical',
            title: 'Remote Code Execution in package-name',
            description: 'Allows arbitrary code execution through malicious input',
            package: 'vulnerable-package',
            version: '1.2.3',
            patchedVersions: '>=1.2.4',
            vulnerableVersions: '<1.2.4',
            publishedDate: '2024-01-15T10:00:00Z',
            modifiedDate: '2024-01-20T14:30:00Z',
            cwes: ['CWE-94'],
            references: [
              'https://nvd.nist.gov/vuln/detail/CVE-2024-1234',
              'https://github.com/advisories/GHSA-xxxx-yyyy-zzzz'
            ],
            recommendation: 'Update to version 1.2.4 or higher'
          }
        ],
        fixAvailable: 3,
        requiresUpdate: ['vulnerable-package', 'another-package']
      };
    } catch (error) {
      console.error('Error scanning vulnerabilities:', error);
      return null;
    }
  }

  /**
   * Check for known vulnerabilities in a specific package
   */
  async checkPackageVulnerabilities(params: {
    package: string;
    version: string;
  }): Promise<Vulnerability[]> {
    try {
      // Mock implementation
      return [
        {
          id: 'vuln_001',
          cve: 'CVE-2024-1234',
          severity: 'high',
          title: 'Security vulnerability found',
          description: 'Vulnerability description here',
          package: params.package,
          version: params.version,
          vulnerableVersions: `<=${params.version}`,
          publishedDate: '2024-01-15T10:00:00Z',
          modifiedDate: '2024-01-20T14:30:00Z',
          cwes: ['CWE-79'],
          references: []
        }
      ];
    } catch (error) {
      console.error('Error checking package vulnerabilities:', error);
      return [];
    }
  }

  // ==================== LICENSE SCANNING ====================

  /**
   * Scan project for license compliance issues
   */
  async scanLicenses(params?: {
    allowedLicenses?: string[];
    blockedLicenses?: string[];
  }): Promise<LicenseScan | null> {
    try {
      // Mock implementation
      return {
        id: `license_scan_${Date.now()}`,
        timestamp: new Date().toISOString(),
        totalPackages: 150,
        issues: [
          {
            package: 'gpl-package',
            version: '2.1.0',
            license: {
              name: 'GNU General Public License v3.0',
              spdxId: 'GPL-3.0',
              url: 'https://opensource.org/licenses/GPL-3.0',
              category: 'copyleft',
              riskLevel: 'high',
              requiresAttribution: true,
              allowsCommercialUse: true
            },
            issue: 'risky',
            description: 'GPL-3.0 requires derivative works to be open-sourced',
            recommendation: 'Consider using an alternative package with a permissive license'
          }
        ],
        byCategory: {
          permissive: 120,
          copyleft: 5,
          restrictive: 2,
          unknown: 23
        },
        compliance: 'warning'
      };
    } catch (error) {
      console.error('Error scanning licenses:', error);
      return null;
    }
  }

  /**
   * Get license information for a package
   */
  async getPackageLicense(params: {
    package: string;
    version: string;
  }): Promise<License | null> {
    try {
      // Mock implementation
      return {
        name: 'MIT License',
        spdxId: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
        category: 'permissive',
        riskLevel: 'low',
        requiresAttribution: true,
        allowsCommercialUse: true
      };
    } catch (error) {
      console.error('Error getting package license:', error);
      return null;
    }
  }

  // ==================== DEPENDENCY ANALYSIS ====================

  /**
   * Get dependency tree
   */
  async getDependencyTree(params?: {
    includeDevDeps?: boolean;
    maxDepth?: number;
  }): Promise<DependencyTree | null> {
    try {
      // Mock implementation
      return {
        name: 'my-project',
        version: '1.0.0',
        dependencies: [
          {
            name: 'express',
            version: '4.18.2',
            type: 'direct',
            children: [
              {
                name: 'body-parser',
                version: '1.20.1',
                type: 'transitive',
                children: [],
                issues: { vulnerabilities: 0, licenseIssues: 0, deprecated: false }
              }
            ],
            issues: { vulnerabilities: 0, licenseIssues: 0, deprecated: false }
          }
        ],
        totalCount: 150,
        directCount: 25,
        devCount: 35
      };
    } catch (error) {
      console.error('Error getting dependency tree:', error);
      return null;
    }
  }

  /**
   * Find outdated dependencies
   */
  async findOutdated(): Promise<Array<{
    package: string;
    current: string;
    latest: string;
    type: 'major' | 'minor' | 'patch';
  }>> {
    try {
      // Mock implementation
      return [
        {
          package: 'react',
          current: '17.0.2',
          latest: '18.2.0',
          type: 'major'
        },
        {
          package: 'typescript',
          current: '4.9.5',
          latest: '5.3.3',
          type: 'major'
        }
      ];
    } catch (error) {
      console.error('Error finding outdated dependencies:', error);
      return [];
    }
  }

  // ==================== SBOM GENERATION ====================

  /**
   * Generate Software Bill of Materials
   */
  async generateSBOM(params: {
    format: 'CycloneDX' | 'SPDX';
    includeHashes?: boolean;
  }): Promise<SBOM | null> {
    try {
      // Mock implementation
      return {
        bomFormat: params.format,
        specVersion: params.format === 'CycloneDX' ? '1.4' : '2.3',
        serialNumber: `urn:uuid:${Date.now()}`,
        version: 1,
        metadata: {
          timestamp: new Date().toISOString(),
          tools: [
            { vendor: 'Sandworm', name: 'sandworm-audit', version: '1.0.0' }
          ],
          component: {
            type: 'application',
            name: 'my-project',
            version: '1.0.0'
          }
        },
        components: [
          {
            type: 'library',
            name: 'express',
            version: '4.18.2',
            purl: 'pkg:npm/express@4.18.2',
            licenses: [
              { license: { id: 'MIT', name: 'MIT License' } }
            ]
          }
        ]
      };
    } catch (error) {
      console.error('Error generating SBOM:', error);
      return null;
    }
  }

  /**
   * Export SBOM to file
   */
  async exportSBOM(sbom: SBOM, format: 'json' | 'xml'): Promise<Blob | null> {
    try {
      if (format === 'json') {
        return new Blob([JSON.stringify(sbom, null, 2)], { type: 'application/json' });
      }
      // XML conversion would go here
      return null;
    } catch (error) {
      console.error('Error exporting SBOM:', error);
      return null;
    }
  }

  // ==================== SUPPLY CHAIN ANALYSIS ====================

  /**
   * Analyze supply chain risks
   */
  async analyzeSupplyChain(params?: {
    checkTyposquatting?: boolean;
    checkMaintainers?: boolean;
  }): Promise<SupplyChainRisk[]> {
    try {
      // Mock implementation
      return [
        {
          package: 'suspicious-package',
          version: '1.0.0',
          riskLevel: 'high',
          risks: [
            {
              type: 'maintainer-change',
              severity: 'high',
              description: 'Package maintainer changed recently without notice',
              detectedAt: '2024-01-20T10:00:00Z'
            }
          ],
          maintainers: [
            {
              name: 'New Maintainer',
              email: 'new@example.com',
              joinedAt: '2024-01-15T00:00:00Z'
            }
          ],
          downloads: {
            weekly: 1000,
            trend: 'decreasing'
          },
          lastPublish: '2024-01-20T10:00:00Z',
          repository: 'https://github.com/user/repo'
        }
      ];
    } catch (error) {
      console.error('Error analyzing supply chain:', error);
      return [];
    }
  }

  // ==================== POLICY MANAGEMENT ====================

  /**
   * Create security policy
   */
  async createPolicy(policy: Omit<SecurityPolicy, 'id' | 'createdAt' | 'updatedAt'>): Promise<SecurityPolicy | null> {
    try {
      // Mock implementation
      const newPolicy: SecurityPolicy = {
        id: `policy_${Date.now()}`,
        ...policy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Policy created:', newPolicy);
      return newPolicy;
    } catch (error) {
      console.error('Error creating policy:', error);
      return null;
    }
  }

  /**
   * Validate project against policy
   */
  async validatePolicy(policyId: string): Promise<{
    passed: boolean;
    violations: Array<{
      rule: string;
      package: string;
      issue: string;
    }>;
  }> {
    try {
      // Mock implementation
      return {
        passed: false,
        violations: [
          {
            rule: 'No critical vulnerabilities',
            package: 'vulnerable-package',
            issue: 'Contains CVE-2024-1234 (critical)'
          }
        ]
      };
    } catch (error) {
      console.error('Error validating policy:', error);
      return { passed: false, violations: [] };
    }
  }

  // ==================== REPORTING ====================

  /**
   * Generate comprehensive security report
   */
  async generateReport(): Promise<SecurityReport | null> {
    try {
      const vulnScan = await this.scanVulnerabilities();
      const licenseScan = await this.scanLicenses();
      const supplyChainRisks = await this.analyzeSupplyChain();

      if (!vulnScan || !licenseScan) return null;

      return {
        id: `report_${Date.now()}`,
        projectName: 'my-project',
        timestamp: new Date().toISOString(),
        summary: {
          totalDependencies: 150,
          vulnerabilities: vulnScan,
          licenses: licenseScan,
          supplyChainRisks: supplyChainRisks.length,
          overallRisk: 'high',
          complianceScore: 65
        },
        recommendations: [
          'Update vulnerable-package to version 1.2.4 or higher',
          'Review GPL-3.0 licensed packages for license compatibility',
          'Investigate recent maintainer changes in suspicious-package'
        ],
        fixCommands: [
          'npm update vulnerable-package',
          'npm audit fix --force'
        ]
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return null;
    }
  }

  /**
   * Export report to various formats
   */
  async exportReport(report: SecurityReport, format: 'json' | 'html' | 'pdf'): Promise<Blob | null> {
    try {
      if (format === 'json') {
        return new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      }
      // HTML and PDF generation would go here
      return null;
    } catch (error) {
      console.error('Error exporting report:', error);
      return null;
    }
  }

  /**
   * Get security score
   */
  async getSecurityScore(): Promise<{
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    factors: Array<{
      name: string;
      score: number;
      impact: 'high' | 'medium' | 'low';
    }>;
  } | null> {
    try {
      // Mock implementation
      return {
        score: 75,
        grade: 'B',
        factors: [
          {
            name: 'Vulnerabilities',
            score: 60,
            impact: 'high'
          },
          {
            name: 'License Compliance',
            score: 85,
            impact: 'medium'
          },
          {
            name: 'Supply Chain',
            score: 80,
            impact: 'high'
          },
          {
            name: 'Dependencies',
            score: 75,
            impact: 'medium'
          }
        ]
      };
    } catch (error) {
      console.error('Error getting security score:', error);
      return null;
    }
  }
}

// Export singleton instance
export const sandwormIntegration = new SandwormIntegrationService();
export default sandwormIntegration;
