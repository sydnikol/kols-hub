/**
 * COURSERA INTEGRATION
 * Course enrollment, progress tracking, certificates, and specializations
 *
 * API Documentation: https://dev.coursera.com/docs
 * OAuth Setup: https://dev.coursera.com/docs/oauth-credentials/1/overview
 *
 * Features:
 * - Course catalog browsing
 * - Enrollment management
 * - Progress tracking
 * - Specializations
 * - Professional certificates
 * - Degree programs
 * - Assignments and grades
 * - Certificate management
 * - Learning history
 * - Recommendations
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CourseraConfig {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface CourseraCourse {
  id: string;
  slug: string;
  name: string;
  description: string;
  photoUrl: string;
  partners: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
  categories: string[];
  instructors: Array<{
    id: string;
    fullName: string;
    title: string;
    photo: string;
  }>;
  workload: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  languageCode: string;
  subtitleLanguages: string[];
  startDate?: string;
  duration: string;
  rating: {
    average: number;
    count: number;
  };
  enrollmentCount: number;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseName: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
  progress: {
    percentComplete: number;
    itemsCompleted: number;
    totalItems: number;
    lastActivityAt: string;
  };
  grade?: {
    score: number;
    isPassing: boolean;
  };
  certificateEarned?: boolean;
  certificateUrl?: string;
}

export interface Specialization {
  id: string;
  slug: string;
  name: string;
  description: string;
  photoUrl: string;
  partners: Array<{
    id: string;
    name: string;
  }>;
  courses: CourseraCourse[];
  estimatedDuration: string;
  level: string;
  type: 'Specialization' | 'Professional Certificate' | 'MasterTrack';
  enrollmentCount: number;
}

export interface SpecializationEnrollment {
  id: string;
  specializationId: string;
  specializationName: string;
  enrolledAt: string;
  status: 'active' | 'completed';
  coursesCompleted: number;
  totalCourses: number;
  percentComplete: number;
  certificateEarned?: boolean;
}

export interface DegreeCourse {
  id: string;
  programId: string;
  programName: string;
  university: string;
  degreeType: 'Bachelor' | 'Master' | 'Doctorate';
  fieldOfStudy: string;
  enrolledAt: string;
  expectedGraduation?: string;
  creditsCompleted: number;
  totalCredits: number;
  gpa?: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  type: 'quiz' | 'programming' | 'peer-review' | 'discussion';
  dueDate?: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  grade?: {
    score: number;
    maxScore: number;
    percentage: number;
    feedback?: string;
  };
  submittedAt?: string;
  gradedAt?: string;
}

export interface Certificate {
  id: string;
  type: 'course' | 'specialization' | 'professional-certificate' | 'degree';
  name: string;
  issuedBy: string;
  issuedAt: string;
  verificationUrl: string;
  certificateUrl: string;
  credentialId: string;
  skills: string[];
}

export interface LearningHistory {
  userId: string;
  totalCourses: number;
  completedCourses: number;
  activeCourses: number;
  totalSpecializations: number;
  completedSpecializations: number;
  certificates: number;
  totalLearningHours: number;
  currentStreak: number;
  longestStreak: number;
  averageGrade: number;
  topSkills: string[];
  recentActivity: Array<{
    type: string;
    courseName: string;
    date: string;
    description: string;
  }>;
}

export interface CourseraRecommendation {
  courseId: string;
  courseName: string;
  reason: string;
  relevanceScore: number;
  partner: string;
  photoUrl: string;
  estimatedHours: number;
}

// ============================================================================
// COURSERA INTEGRATION SERVICE
// ============================================================================

class CourseraIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private baseUrl = 'https://api.coursera.org/api';

  // ============================================================================
  // INITIALIZATION & AUTHENTICATION
  // ============================================================================

  async initialize(config: CourseraConfig): Promise<boolean> {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.accessToken = config.accessToken || null;
    this.refreshToken = config.refreshToken || null;

    localStorage.setItem('coursera_client_id', config.clientId);
    localStorage.setItem('coursera_client_secret', config.clientSecret);
    if (config.accessToken) {
      localStorage.setItem('coursera_access_token', config.accessToken);
    }
    if (config.refreshToken) {
      localStorage.setItem('coursera_refresh_token', config.refreshToken);
    }

    console.log('✅ Coursera Integration initialized');
    return true;
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthorizationUrl(redirectUri: string, scope: string[] = ['view_profile', 'access_course_data']): string {
    const params = new URLSearchParams({
      client_id: this.clientId!,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope.join(' '),
      state: Math.random().toString(36).substring(7)
    });

    return `https://www.coursera.org/oauth2/v1/auth?${params}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<boolean> {
    try {
      const response = await fetch('https://www.coursera.org/oauth2/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId!,
          client_secret: this.clientSecret!,
          code: code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      localStorage.setItem('coursera_access_token', this.accessToken);
      if (this.refreshToken) {
        localStorage.setItem('coursera_refresh_token', this.refreshToken);
      }

      return true;

    } catch (error) {
      console.error('Token exchange error:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (!this.accessToken) {
      this.clientId = localStorage.getItem('coursera_client_id');
      this.clientSecret = localStorage.getItem('coursera_client_secret');
      this.accessToken = localStorage.getItem('coursera_access_token');
      this.refreshToken = localStorage.getItem('coursera_refresh_token');
    }
    return !!(this.clientId && this.accessToken);
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // ============================================================================
  // COURSE CATALOG
  // ============================================================================

  async searchCourses(query: string, filters?: {
    category?: string;
    language?: string;
    level?: string;
    partner?: string;
  }): Promise<CourseraCourse[] | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const startTime = Date.now();

      const params = new URLSearchParams({
        q: 'search',
        query: query,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.language && { language: filters.language }),
        ...(filters?.level && { level: filters.level }),
        ...(filters?.partner && { partner: filters.partner })
      });

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/courses.v1?${params}`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('coursera-api', true, duration);

      return this.parseCourses(data.elements);

    } catch (error) {
      console.error('Search courses error:', error);
      MetricsCollector.recordAPICall('coursera-api', false, 0);
      return null;
    }
  }

  async getCourseById(courseId: string): Promise<CourseraCourse | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/courses.v1/${courseId}`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return this.parseCourse(data.elements[0]);

    } catch (error) {
      console.error('Get course error:', error);
      return null;
    }
  }

  // ============================================================================
  // ENROLLMENTS
  // ============================================================================

  async getEnrollments(): Promise<CourseEnrollment[] | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/onDemandCourseEnrollments.v1?includes=courses`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return this.parseEnrollments(data.elements);

    } catch (error) {
      console.error('Get enrollments error:', error);
      return null;
    }
  }

  async enrollInCourse(courseId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/onDemandCourseEnrollments.v1`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          courseId: courseId
        })
      });

      return response.ok;

    } catch (error) {
      console.error('Enroll in course error:', error);
      return false;
    }
  }

  async unenrollFromCourse(enrollmentId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/onDemandCourseEnrollments.v1/${enrollmentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return response.ok;

    } catch (error) {
      console.error('Unenroll from course error:', error);
      return false;
    }
  }

  // ============================================================================
  // SPECIALIZATIONS
  // ============================================================================

  async searchSpecializations(query: string): Promise<Specialization[] | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/onDemandSpecializations.v1?q=search&query=${encodeURIComponent(query)}`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return this.parseSpecializations(data.elements);

    } catch (error) {
      console.error('Search specializations error:', error);
      return null;
    }
  }

  async getSpecializationEnrollments(): Promise<SpecializationEnrollment[] | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/onDemandSpecializationEnrollments.v1`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return this.parseSpecializationEnrollments(data.elements);

    } catch (error) {
      console.error('Get specialization enrollments error:', error);
      return null;
    }
  }

  // ============================================================================
  // ASSIGNMENTS & GRADES
  // ============================================================================

  async getAssignments(courseId: string): Promise<Assignment[] | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/onDemandCourseAssignments.v1?q=course&courseId=${courseId}`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return this.parseAssignments(data.elements);

    } catch (error) {
      console.error('Get assignments error:', error);
      return null;
    }
  }

  async getGrades(courseId: string): Promise<any | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/onDemandCourseGrades.v1?q=course&courseId=${courseId}`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return data.elements[0];

    } catch (error) {
      console.error('Get grades error:', error);
      return null;
    }
  }

  // ============================================================================
  // CERTIFICATES
  // ============================================================================

  async getCertificates(): Promise<Certificate[] | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/accomplishments.v1`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return this.parseCertificates(data.elements);

    } catch (error) {
      console.error('Get certificates error:', error);
      return null;
    }
  }

  // ============================================================================
  // LEARNING HISTORY & STATISTICS
  // ============================================================================

  async getLearningHistory(): Promise<LearningHistory | null> {
    const enrollments = await this.getEnrollments();
    const specializationEnrollments = await getSpecializationEnrollments();
    const certificates = await this.getCertificates();

    if (!enrollments) return null;

    const completed = enrollments.filter(e => e.status === 'completed').length;
    const active = enrollments.filter(e => e.status === 'active').length;

    const totalHours = enrollments.reduce((sum, e) => {
      // Estimate: 4 hours per 10% completion
      return sum + (e.progress.percentComplete * 0.4);
    }, 0);

    const grades = enrollments
      .filter(e => e.grade)
      .map(e => e.grade!.score);
    const avgGrade = grades.length > 0
      ? grades.reduce((sum, g) => sum + g, 0) / grades.length
      : 0;

    return {
      userId: 'current-user',
      totalCourses: enrollments.length,
      completedCourses: completed,
      activeCourses: active,
      totalSpecializations: specializationEnrollments?.length || 0,
      completedSpecializations: specializationEnrollments?.filter(s => s.status === 'completed').length || 0,
      certificates: certificates?.length || 0,
      totalLearningHours: Math.round(totalHours),
      currentStreak: 0, // Would need activity data
      longestStreak: 0, // Would need activity data
      averageGrade: avgGrade,
      topSkills: [], // Would extract from completed courses
      recentActivity: [] // Would need activity feed
    };
  }

  // ============================================================================
  // RECOMMENDATIONS
  // ============================================================================

  async getRecommendations(limit: number = 10): Promise<CourseraRecommendation[] | null> {
    if (!this.isConfigured()) {
      console.error('Coursera not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('coursera-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/courseRecommendations.v1?limit=${limit}`,
          {
            headers: this.getAuthHeaders()
          }
        );
      });

      if (!response.ok) {
        throw new Error('Coursera API error');
      }

      const data = await response.json();
      return this.parseRecommendations(data.elements);

    } catch (error) {
      console.error('Get recommendations error:', error);
      return null;
    }
  }

  // ============================================================================
  // PARSING HELPERS
  // ============================================================================

  private parseCourses(data: any[]): CourseraCourse[] {
    return data.map(course => this.parseCourse(course));
  }

  private parseCourse(data: any): CourseraCourse {
    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description || '',
      photoUrl: data.photoUrl || '',
      partners: data.partners || [],
      categories: data.categories || [],
      instructors: data.instructors || [],
      workload: data.workload || '',
      difficultyLevel: data.difficultyLevel || 'Beginner',
      languageCode: data.primaryLanguages?.[0] || 'en',
      subtitleLanguages: data.subtitleLanguages || [],
      startDate: data.startDate,
      duration: data.duration || '',
      rating: {
        average: data.averageProductRating || 0,
        count: data.ratingCount || 0
      },
      enrollmentCount: data.enrollmentCount || 0
    };
  }

  private parseEnrollments(data: any[]): CourseEnrollment[] {
    return data.map(enrollment => ({
      id: enrollment.id,
      courseId: enrollment.courseId,
      courseName: enrollment.courseName || '',
      enrolledAt: enrollment.enrolledAt,
      status: enrollment.completedAt ? 'completed' : 'active',
      progress: {
        percentComplete: enrollment.progress || 0,
        itemsCompleted: enrollment.itemsCompleted || 0,
        totalItems: enrollment.totalItems || 0,
        lastActivityAt: enrollment.lastActivityAt
      },
      grade: enrollment.grade,
      certificateEarned: !!enrollment.certificateUrl,
      certificateUrl: enrollment.certificateUrl
    }));
  }

  private parseSpecializations(data: any[]): Specialization[] {
    return data.map(spec => ({
      id: spec.id,
      slug: spec.slug,
      name: spec.name,
      description: spec.description || '',
      photoUrl: spec.photoUrl || '',
      partners: spec.partners || [],
      courses: spec.courses || [],
      estimatedDuration: spec.estimatedDuration || '',
      level: spec.level || 'Beginner',
      type: spec.type || 'Specialization',
      enrollmentCount: spec.enrollmentCount || 0
    }));
  }

  private parseSpecializationEnrollments(data: any[]): SpecializationEnrollment[] {
    return data.map(enrollment => ({
      id: enrollment.id,
      specializationId: enrollment.specializationId,
      specializationName: enrollment.specializationName || '',
      enrolledAt: enrollment.enrolledAt,
      status: enrollment.completedAt ? 'completed' : 'active',
      coursesCompleted: enrollment.coursesCompleted || 0,
      totalCourses: enrollment.totalCourses || 0,
      percentComplete: ((enrollment.coursesCompleted || 0) / (enrollment.totalCourses || 1)) * 100,
      certificateEarned: !!enrollment.certificateUrl
    }));
  }

  private parseAssignments(data: any[]): Assignment[] {
    return data.map(assignment => ({
      id: assignment.id,
      courseId: assignment.courseId,
      courseName: assignment.courseName || '',
      title: assignment.name || '',
      description: assignment.description || '',
      type: assignment.typeName || 'quiz',
      dueDate: assignment.deadline,
      status: assignment.status || 'not-started',
      grade: assignment.grade,
      submittedAt: assignment.submittedAt,
      gradedAt: assignment.gradedAt
    }));
  }

  private parseCertificates(data: any[]): Certificate[] {
    return data.map(cert => ({
      id: cert.id,
      type: cert.type || 'course',
      name: cert.name,
      issuedBy: cert.issuedBy || '',
      issuedAt: cert.completedAt,
      verificationUrl: cert.verificationUrl || '',
      certificateUrl: cert.certificateUrl || '',
      credentialId: cert.credentialId || '',
      skills: cert.skills || []
    }));
  }

  private parseRecommendations(data: any[]): CourseraRecommendation[] {
    return data.map(rec => ({
      courseId: rec.courseId,
      courseName: rec.courseName || '',
      reason: rec.reason || '',
      relevanceScore: rec.score || 0,
      partner: rec.partner || '',
      photoUrl: rec.photoUrl || '',
      estimatedHours: rec.estimatedHours || 0
    }));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getCourseUrl(courseSlug: string): string {
    return `https://www.coursera.org/learn/${courseSlug}`;
  }

  getSpecializationUrl(specializationSlug: string): string {
    return `https://www.coursera.org/specializations/${specializationSlug}`;
  }

  getCertificateUrl(certificateId: string): string {
    return `https://www.coursera.org/account/accomplishments/certificate/${certificateId}`;
  }

  // ============================================================================
  // STATISTICS TRACKING
  // ============================================================================

  getStats(): {
    totalCalls: number;
    successRate: number;
    lastSync?: string;
  } {
    const stats = JSON.parse(localStorage.getItem('coursera_stats') || '{}');

    return {
      totalCalls: stats.totalCalls || 0,
      successRate: stats.successRate || 100,
      lastSync: stats.lastSync
    };
  }

  async syncLearningData(): Promise<boolean> {
    const history = await this.getLearningHistory();
    if (!history) return false;

    const stats = {
      totalCalls: (this.getStats().totalCalls || 0) + 1,
      successRate: 100,
      lastSync: new Date().toISOString()
    };

    localStorage.setItem('coursera_stats', JSON.stringify(stats));
    localStorage.setItem('coursera_history', JSON.stringify(history));

    console.log(`✅ Synced Coursera data: ${history.completedCourses} courses completed`);
    return true;
  }

  getCachedHistory(): LearningHistory | null {
    const cached = localStorage.getItem('coursera_history');
    return cached ? JSON.parse(cached) : null;
  }
}

export const courseraIntegration = new CourseraIntegrationService();
