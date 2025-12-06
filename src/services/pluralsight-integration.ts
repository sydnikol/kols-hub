/**
 * PLURALSIGHT SKILLS INTEGRATION
 * Skills assessments, course tracking, and learning management
 *
 * API Documentation: https://help.pluralsight.com/hc/en-us/articles/24420554286868-Skills-APIs-and-integrations
 *
 * Features:
 * - Skills assessments and IQ scores
 * - Course progress tracking
 * - Learning path management
 * - Certification tracking
 * - Team analytics
 * - Skill gap analysis
 * - Personalized recommendations
 * - Transcript and achievements
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PluralsightConfig {
  apiKey: string;
  planId?: string;
  userId?: string;
}

export interface SkillAssessment {
  skillId: string;
  skillName: string;
  category: string;
  iqScore: number; // 0-300
  proficiencyLevel: 'Novice' | 'Proficient' | 'Expert';
  dateCompleted: string;
  percentile: number;
  topics: Array<{
    topicName: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
  }>;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g., "3h 24m"
  author: string;
  releaseDate: string;
  rating: number;
  ratingCount: number;
  skills: string[];
  category: string;
  imageUrl?: string;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  percentComplete: number;
  timeWatched: number; // minutes
  lastViewedDate: string;
  completedDate?: string;
  isCompleted: boolean;
  modules: Array<{
    moduleId: string;
    moduleName: string;
    percentComplete: number;
    clips: Array<{
      clipId: string;
      clipName: string;
      isCompleted: boolean;
    }>;
  }>;
}

export interface LearningPath {
  pathId: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  courses: Course[];
  skills: string[];
  progress: {
    coursesCompleted: number;
    totalCourses: number;
    percentComplete: number;
  };
}

export interface UserTranscript {
  userId: string;
  userName: string;
  totalCoursesCompleted: number;
  totalViewTime: number; // hours
  totalAssessments: number;
  averageIQ: number;
  topSkills: Array<{
    skill: string;
    iqScore: number;
    level: string;
  }>;
  recentCourses: CourseProgress[];
  certifications: Certification[];
}

export interface Certification {
  certId: string;
  name: string;
  provider: string;
  dateEarned: string;
  expiryDate?: string;
  credentialUrl?: string;
  skills: string[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  recommendedCourses: Course[];
  estimatedTime: string;
}

export interface Recommendation {
  type: 'course' | 'path' | 'assessment';
  id: string;
  title: string;
  reason: string;
  relevanceScore: number;
  estimatedTime: string;
}

export interface LearningStats {
  totalSkills: number;
  totalCourses: number;
  totalPaths: number;
  totalAssessments: number;
  averageIQ: number;
  hoursLearned: number;
  currentStreak: number;
  longestStreak: number;
  skillsProgress: {
    novice: number;
    proficient: number;
    expert: number;
  };
}

// ============================================================================
// PLURALSIGHT INTEGRATION SERVICE
// ============================================================================

class PluralsightIntegrationService {
  private apiKey: string | null = null;
  private planId: string | null = null;
  private userId: string | null = null;
  private baseUrl = 'https://api.pluralsight.com'; // Note: Actual endpoint may vary

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  initialize(config: PluralsightConfig) {
    this.apiKey = config.apiKey;
    this.planId = config.planId || null;
    this.userId = config.userId || null;

    localStorage.setItem('pluralsight_api_key', config.apiKey);
    if (config.planId) localStorage.setItem('pluralsight_plan_id', config.planId);
    if (config.userId) localStorage.setItem('pluralsight_user_id', config.userId);

    console.log('✅ Pluralsight Integration initialized');
  }

  isConfigured(): boolean {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('pluralsight_api_key');
      this.planId = localStorage.getItem('pluralsight_plan_id');
      this.userId = localStorage.getItem('pluralsight_user_id');
    }
    return !!this.apiKey;
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // ============================================================================
  // SKILLS ASSESSMENTS
  // ============================================================================

  async getSkillAssessments(userId?: string): Promise<SkillAssessment[] | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const id = userId || this.userId;
    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/users/${id}/assessments`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('pluralsight-api', true, duration);

      return this.parseAssessments(data);

    } catch (error) {
      console.error('Get skill assessments error:', error);
      MetricsCollector.recordAPICall('pluralsight-api', false, 0);
      return null;
    }
  }

  async getSkillIQ(skillId: string, userId?: string): Promise<SkillAssessment | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const id = userId || this.userId;
    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/users/${id}/skills/${skillId}/iq`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parseAssessment(data);

    } catch (error) {
      console.error('Get skill IQ error:', error);
      return null;
    }
  }

  // ============================================================================
  // COURSE MANAGEMENT
  // ============================================================================

  async searchCourses(query: string, filters?: {
    level?: string;
    category?: string;
    skill?: string;
    duration?: string;
  }): Promise<Course[] | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const params = new URLSearchParams({
        q: query,
        ...(filters?.level && { level: filters.level }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.skill && { skill: filters.skill }),
        ...(filters?.duration && { duration: filters.duration })
      });

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/courses/search?${params}`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parseCourses(data);

    } catch (error) {
      console.error('Search courses error:', error);
      return null;
    }
  }

  async getCourseDetails(courseId: string): Promise<Course | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/courses/${courseId}`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parseCourse(data);

    } catch (error) {
      console.error('Get course details error:', error);
      return null;
    }
  }

  async getCourseProgress(courseId: string, userId?: string): Promise<CourseProgress | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const id = userId || this.userId;
    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/users/${id}/courses/${courseId}/progress`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parseProgress(data);

    } catch (error) {
      console.error('Get course progress error:', error);
      return null;
    }
  }

  // ============================================================================
  // LEARNING PATHS
  // ============================================================================

  async getLearningPaths(userId?: string): Promise<LearningPath[] | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const id = userId || this.userId;
    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/users/${id}/paths`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parsePaths(data);

    } catch (error) {
      console.error('Get learning paths error:', error);
      return null;
    }
  }

  async getPathDetails(pathId: string): Promise<LearningPath | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/paths/${pathId}`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parsePath(data);

    } catch (error) {
      console.error('Get path details error:', error);
      return null;
    }
  }

  // ============================================================================
  // USER TRANSCRIPT & ACHIEVEMENTS
  // ============================================================================

  async getUserTranscript(userId?: string): Promise<UserTranscript | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const id = userId || this.userId;
    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/users/${id}/transcript`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parseTranscript(data);

    } catch (error) {
      console.error('Get user transcript error:', error);
      return null;
    }
  }

  async getCertifications(userId?: string): Promise<Certification[] | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const id = userId || this.userId;
    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/users/${id}/certifications`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parseCertifications(data);

    } catch (error) {
      console.error('Get certifications error:', error);
      return null;
    }
  }

  // ============================================================================
  // SKILL GAP ANALYSIS
  // ============================================================================

  async analyzeSkillGaps(targetSkills: Array<{ skill: string; targetLevel: number }>): Promise<SkillGap[] | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const currentSkills = await this.getSkillAssessments();
    if (!currentSkills) return null;

    const gaps: SkillGap[] = [];

    for (const target of targetSkills) {
      const current = currentSkills.find(s => s.skillName === target.skill);
      const currentLevel = current?.iqScore || 0;
      const gap = target.targetLevel - currentLevel;

      if (gap > 0) {
        // Find recommended courses
        const courses = await this.searchCourses(target.skill, {
          level: this.determineLevelFromIQ(target.targetLevel)
        });

        gaps.push({
          skill: target.skill,
          currentLevel,
          targetLevel: target.targetLevel,
          gap,
          recommendedCourses: courses?.slice(0, 5) || [],
          estimatedTime: this.estimateLearningTime(gap)
        });
      }
    }

    return gaps.sort((a, b) => b.gap - a.gap);
  }

  // ============================================================================
  // RECOMMENDATIONS
  // ============================================================================

  async getRecommendations(userId?: string): Promise<Recommendation[] | null> {
    if (!this.isConfigured()) {
      console.error('Pluralsight not configured');
      return null;
    }

    const id = userId || this.userId;
    const breaker = CircuitBreakerRegistry.get('pluralsight-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/users/${id}/recommendations`, {
          headers: this.getAuthHeaders()
        });
      });

      if (!response.ok) {
        throw new Error('Pluralsight API error');
      }

      const data = await response.json();
      return this.parseRecommendations(data);

    } catch (error) {
      console.error('Get recommendations error:', error);
      return null;
    }
  }

  // ============================================================================
  // LEARNING STATISTICS
  // ============================================================================

  async getLearningStats(userId?: string): Promise<LearningStats | null> {
    const transcript = await this.getUserTranscript(userId);
    if (!transcript) return null;

    const assessments = await this.getSkillAssessments(userId);
    const paths = await this.getLearningPaths(userId);

    const skillsProgress = {
      novice: assessments?.filter(a => a.proficiencyLevel === 'Novice').length || 0,
      proficient: assessments?.filter(a => a.proficiencyLevel === 'Proficient').length || 0,
      expert: assessments?.filter(a => a.proficiencyLevel === 'Expert').length || 0
    };

    return {
      totalSkills: assessments?.length || 0,
      totalCourses: transcript.totalCoursesCompleted,
      totalPaths: paths?.length || 0,
      totalAssessments: transcript.totalAssessments,
      averageIQ: transcript.averageIQ,
      hoursLearned: transcript.totalViewTime,
      currentStreak: this.calculateStreak(transcript.recentCourses),
      longestStreak: this.calculateLongestStreak(transcript.recentCourses),
      skillsProgress
    };
  }

  // ============================================================================
  // PARSING HELPERS
  // ============================================================================

  private parseAssessments(data: any): SkillAssessment[] {
    // Parse API response to SkillAssessment array
    // Actual implementation depends on API response format
    return data.assessments || [];
  }

  private parseAssessment(data: any): SkillAssessment {
    // Parse single assessment
    return {
      skillId: data.skillId,
      skillName: data.skillName,
      category: data.category,
      iqScore: data.iqScore,
      proficiencyLevel: this.determineProficiency(data.iqScore),
      dateCompleted: data.dateCompleted,
      percentile: data.percentile,
      topics: data.topics || []
    };
  }

  private parseCourses(data: any): Course[] {
    return data.courses || [];
  }

  private parseCourse(data: any): Course {
    return {
      courseId: data.id,
      title: data.title,
      description: data.description,
      level: data.level,
      duration: data.duration,
      author: data.author,
      releaseDate: data.releaseDate,
      rating: data.rating,
      ratingCount: data.ratingCount,
      skills: data.skills || [],
      category: data.category,
      imageUrl: data.imageUrl
    };
  }

  private parseProgress(data: any): CourseProgress {
    return {
      courseId: data.courseId,
      userId: data.userId,
      percentComplete: data.percentComplete,
      timeWatched: data.timeWatched,
      lastViewedDate: data.lastViewedDate,
      completedDate: data.completedDate,
      isCompleted: data.isCompleted,
      modules: data.modules || []
    };
  }

  private parsePaths(data: any): LearningPath[] {
    return data.paths || [];
  }

  private parsePath(data: any): LearningPath {
    return {
      pathId: data.id,
      title: data.title,
      description: data.description,
      level: data.level,
      duration: data.duration,
      courses: data.courses || [],
      skills: data.skills || [],
      progress: data.progress || { coursesCompleted: 0, totalCourses: 0, percentComplete: 0 }
    };
  }

  private parseTranscript(data: any): UserTranscript {
    return {
      userId: data.userId,
      userName: data.userName,
      totalCoursesCompleted: data.totalCoursesCompleted,
      totalViewTime: data.totalViewTime,
      totalAssessments: data.totalAssessments,
      averageIQ: data.averageIQ,
      topSkills: data.topSkills || [],
      recentCourses: data.recentCourses || [],
      certifications: data.certifications || []
    };
  }

  private parseCertifications(data: any): Certification[] {
    return data.certifications || [];
  }

  private parseRecommendations(data: any): Recommendation[] {
    return data.recommendations || [];
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private determineProficiency(iqScore: number): 'Novice' | 'Proficient' | 'Expert' {
    if (iqScore < 150) return 'Novice';
    if (iqScore < 225) return 'Proficient';
    return 'Expert';
  }

  private determineLevelFromIQ(iqScore: number): string {
    if (iqScore < 150) return 'Beginner';
    if (iqScore < 225) return 'Intermediate';
    return 'Advanced';
  }

  private estimateLearningTime(iqGap: number): string {
    // Rough estimate: 10 hours per 25 IQ points
    const hours = Math.ceil((iqGap / 25) * 10);
    if (hours < 10) return `${hours} hours`;
    const days = Math.ceil(hours / 2); // 2 hours per day
    if (days < 30) return `${days} days`;
    const weeks = Math.ceil(days / 7);
    return `${weeks} weeks`;
  }

  private calculateStreak(recentCourses: CourseProgress[]): number {
    // Calculate current learning streak in days
    // Simplified implementation
    return 0;
  }

  private calculateLongestStreak(recentCourses: CourseProgress[]): number {
    // Calculate longest learning streak
    return 0;
  }

  /**
   * Get Pluralsight course URL
   */
  getCourseUrl(courseId: string): string {
    return `https://app.pluralsight.com/library/courses/${courseId}`;
  }

  /**
   * Get skill assessment URL
   */
  getSkillAssessmentUrl(skillName: string): string {
    return `https://app.pluralsight.com/skill-assessment/${encodeURIComponent(skillName)}`;
  }

  /**
   * Get user profile URL
   */
  getProfileUrl(userId: string): string {
    return `https://app.pluralsight.com/profile/${userId}`;
  }

  /**
   * Format IQ score with proficiency
   */
  formatIQ(iqScore: number): string {
    const level = this.determineProficiency(iqScore);
    return `${iqScore} (${level})`;
  }

  // ============================================================================
  // STATISTICS TRACKING
  // ============================================================================

  getStats(): {
    totalCalls: number;
    successRate: number;
    lastSync?: string;
  } {
    const stats = JSON.parse(localStorage.getItem('pluralsight_stats') || '{}');

    return {
      totalCalls: stats.totalCalls || 0,
      successRate: stats.successRate || 100,
      lastSync: stats.lastSync
    };
  }

  /**
   * Sync user learning data
   */
  async syncLearningData(): Promise<boolean> {
    const transcript = await this.getUserTranscript();
    if (!transcript) return false;

    const stats = {
      totalCalls: (this.getStats().totalCalls || 0) + 1,
      successRate: 100,
      lastSync: new Date().toISOString()
    };

    localStorage.setItem('pluralsight_stats', JSON.stringify(stats));
    localStorage.setItem('pluralsight_transcript', JSON.stringify(transcript));

    console.log(`✅ Synced Pluralsight data: ${transcript.totalCoursesCompleted} courses completed`);
    return true;
  }

  /**
   * Get cached transcript
   */
  getCachedTranscript(): UserTranscript | null {
    const cached = localStorage.getItem('pluralsight_transcript');
    return cached ? JSON.parse(cached) : null;
  }
}

export const pluralsightIntegration = new PluralsightIntegrationService();
