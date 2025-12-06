/**
 * UNIFIED LEARNING ECOSYSTEM
 *
 * Consolidates all learning-related functionality:
 * - LearningHubPage, CourseManagementHubPage, EducationPage
 * - StudyTrackingHubPage, SkillsDevelopmentHubPage
 * - CertificationsHubPage, ResearchHubPage
 * - learningService.ts, educationService.ts
 * - AI Avatar Teacher integration
 *
 * Cross-system connections:
 * - Health: Study sessions affect spoons, breaks improve focus
 * - Finance: Course costs, certification ROI tracking
 * - Entertainment: Educational content (documentaries, podcasts)
 * - Career: Skills → Job qualifications mapping
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Course {
  id: string;
  title: string;
  provider: 'coursera' | 'udemy' | 'skillshare' | 'linkedin' | 'pluralsight' | 'youtube' | 'custom' | 'other';
  url?: string;
  category: string;
  subcategory?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'dropped';
  progress: number; // 0-100
  totalModules: number;
  completedModules: number;
  estimatedHours: number;
  actualHoursSpent: number;
  startDate?: Date;
  completionDate?: Date;
  targetDate?: Date;
  cost: number;
  currency: string;
  certificate?: {
    earned: boolean;
    url?: string;
    expirationDate?: Date;
    credentialId?: string;
  };
  rating?: number;
  notes: string[];
  linkedSkills: string[];
  linkedCareerGoals: string[];
  spoonCost: number; // Learning energy cost
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'creative' | 'language' | 'physical' | 'other';
  subcategory?: string;
  currentLevel: 1 | 2 | 3 | 4 | 5; // Beginner to Expert
  targetLevel: 1 | 2 | 3 | 4 | 5;
  description?: string;
  evidenceLinks: string[]; // Portfolio, certificates, projects
  linkedCourses: string[];
  linkedProjects: string[];
  practiceHours: number;
  lastPracticed?: Date;
  endorsements: Array<{
    from: string;
    date: Date;
    notes?: string;
  }>;
  milestones: Array<{
    level: number;
    achievedDate: Date;
    evidence?: string;
  }>;
  marketValue?: {
    avgSalaryIncrease: number;
    demandTrend: 'rising' | 'stable' | 'declining';
    jobPostings?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  category: string;
  status: 'planned' | 'studying' | 'scheduled' | 'earned' | 'expired' | 'renewed';
  earnedDate?: Date;
  expirationDate?: Date;
  renewalDate?: Date;
  credentialId?: string;
  verificationUrl?: string;
  cost: number;
  renewalCost?: number;
  preparationCourse?: string;
  studyHours: number;
  examScore?: number;
  passingScore?: number;
  attempts: number;
  linkedSkills: string[];
  linkedCareerGoals: string[];
  requirements?: string[];
  recertificationRequirements?: string[];
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  courseId?: string;
  skillId?: string;
  certificationId?: string;
  researchProjectId?: string;
  type: 'course' | 'practice' | 'reading' | 'video' | 'hands_on' | 'flashcards' | 'exam_prep' | 'research';
  topic: string;
  startTime: Date;
  endTime?: Date;
  plannedDuration: number; // minutes
  actualDuration?: number;
  focusScore?: number; // 1-10
  energyBefore?: number; // Spoons
  energyAfter?: number;
  breaks: Array<{
    startTime: Date;
    duration: number;
    type: 'short' | 'long' | 'pomodoro';
  }>;
  notes: string;
  keyTakeaways: string[];
  questionsRaised: string[];
  resourcesUsed: string[];
  mood?: 'focused' | 'distracted' | 'tired' | 'motivated' | 'frustrated';
  environment?: 'home' | 'library' | 'cafe' | 'office' | 'commute' | 'other';
  completed: boolean;
  createdAt: Date;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'certification' | 'course_completion' | 'career' | 'personal';
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'abandoned';
  progress: number;
  milestones: Array<{
    id: string;
    title: string;
    targetDate: Date;
    completed: boolean;
    completedDate?: Date;
  }>;
  linkedCourses: string[];
  linkedSkills: string[];
  linkedCertifications: string[];
  motivation: string;
  obstacles: string[];
  strategies: string[];
  rewards?: string;
  accountability?: {
    partner?: string;
    checkInFrequency?: 'daily' | 'weekly' | 'monthly';
    lastCheckIn?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  field: string;
  status: 'ideation' | 'literature_review' | 'data_collection' | 'analysis' | 'writing' | 'review' | 'published' | 'archived';
  hypothesis?: string;
  methodology?: string;
  findings?: string;
  sources: Array<{
    id: string;
    type: 'paper' | 'book' | 'website' | 'interview' | 'dataset' | 'other';
    title: string;
    authors?: string[];
    url?: string;
    citation?: string;
    notes: string;
    relevance: number; // 1-5
    dateAccessed: Date;
  }>;
  notes: Array<{
    id: string;
    content: string;
    sourceId?: string;
    tags: string[];
    createdAt: Date;
  }>;
  collaborators: string[];
  linkedSkills: string[];
  publications?: Array<{
    title: string;
    venue: string;
    date: Date;
    url?: string;
    citations?: number;
  }>;
  hoursSpent: number;
  startDate: Date;
  targetCompletionDate?: Date;
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  easeFactor: number; // For spaced repetition algorithm
  interval: number; // Days until next review
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description?: string;
  category: string;
  linkedCourseId?: string;
  linkedSkillId?: string;
  linkedCertificationId?: string;
  cardCount: number;
  masteredCount: number;
  lastStudied?: Date;
  totalStudyTime: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadingItem {
  id: string;
  type: 'book' | 'article' | 'paper' | 'documentation' | 'blog';
  title: string;
  author?: string;
  url?: string;
  status: 'to_read' | 'reading' | 'completed' | 'abandoned';
  progress: number; // percentage or page number
  totalPages?: number;
  startDate?: Date;
  completionDate?: Date;
  rating?: number;
  highlights: Array<{
    text: string;
    page?: number;
    chapter?: string;
    note?: string;
    createdAt: Date;
  }>;
  notes: string;
  keyTakeaways: string[];
  linkedCourses: string[];
  linkedSkills: string[];
  linkedResearchProjects: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AITeacherSession {
  id: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  teachingStyle: 'socratic' | 'lecture' | 'hands_on' | 'visual' | 'story_based';
  avatarId?: string;
  avatarOutfitId?: string;
  messages: Array<{
    role: 'user' | 'teacher';
    content: string;
    timestamp: Date;
  }>;
  questionsAsked: number;
  conceptsCovered: string[];
  quizResults?: Array<{
    question: string;
    userAnswer: string;
    correct: boolean;
    explanation?: string;
  }>;
  duration: number;
  satisfaction?: number; // 1-5
  linkedCourseId?: string;
  linkedSkillId?: string;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  totalDaysLearned: number;
  weeklyGoalMinutes: number;
  weeklyActualMinutes: number;
  monthlyStats: Array<{
    month: string;
    daysActive: number;
    minutesLearned: number;
    coursesCompleted: number;
    skillsImproved: number;
  }>;
}

export interface LearningRecommendation {
  id: string;
  type: 'course' | 'skill' | 'certification' | 'reading' | 'practice';
  title: string;
  reason: string;
  relevanceScore: number;
  linkedGoals: string[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  provider?: string;
  url?: string;
  cost?: number;
  createdAt: Date;
}

// ============================================================================
// UNIFIED LEARNING ECOSYSTEM CLASS
// ============================================================================

class UnifiedLearningEcosystem {
  private static instance: UnifiedLearningEcosystem;
  private courses: Map<string, Course> = new Map();
  private skills: Map<string, Skill> = new Map();
  private certifications: Map<string, Certification> = new Map();
  private studySessions: StudySession[] = [];
  private goals: Map<string, LearningGoal> = new Map();
  private researchProjects: Map<string, ResearchProject> = new Map();
  private flashcardDecks: Map<string, FlashcardDeck> = new Map();
  private flashcards: Map<string, Flashcard> = new Map();
  private readingList: Map<string, ReadingItem> = new Map();
  private aiTeacherSessions: AITeacherSession[] = [];
  private streak: LearningStreak = {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date(),
    totalDaysLearned: 0,
    weeklyGoalMinutes: 300, // 5 hours default
    weeklyActualMinutes: 0,
    monthlyStats: []
  };

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
  }

  static getInstance(): UnifiedLearningEcosystem {
    if (!UnifiedLearningEcosystem.instance) {
      UnifiedLearningEcosystem.instance = new UnifiedLearningEcosystem();
    }
    return UnifiedLearningEcosystem.instance;
  }

  // ============================================================================
  // EVENT LISTENERS - Cross-System Communication
  // ============================================================================

  private initializeEventListeners(): void {
    // Health system integration - study affects energy
    eventBus.on('health:energy:changed', (data: any) => {
      // Adjust recommended study duration based on available spoons
      console.log('[Learning] Energy changed, adjusting recommendations');
    });

    // Finance integration - track learning investments
    eventBus.on('finance:budget:alert', (data: any) => {
      if (data.category === 'education') {
        console.log('[Learning] Education budget alert received');
      }
    });

    // Entertainment integration - educational content
    eventBus.on('entertainment:watched', (data: any) => {
      if (data.type === 'documentary' || data.educational) {
        this.logEducationalContent(data);
      }
    });

    // Career integration - skill requirements
    eventBus.on('career:job:applied', (data: any) => {
      this.checkSkillGaps(data.requiredSkills || []);
    });
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem('unified_learning_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        // Restore data from storage
        if (data.courses) {
          data.courses.forEach((c: Course) => this.courses.set(c.id, c));
        }
        if (data.skills) {
          data.skills.forEach((s: Skill) => this.skills.set(s.id, s));
        }
        if (data.certifications) {
          data.certifications.forEach((c: Certification) => this.certifications.set(c.id, c));
        }
        if (data.studySessions) {
          this.studySessions = data.studySessions;
        }
        if (data.goals) {
          data.goals.forEach((g: LearningGoal) => this.goals.set(g.id, g));
        }
        if (data.streak) {
          this.streak = data.streak;
        }
      }
    } catch (error) {
      console.error('[Learning] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        courses: Array.from(this.courses.values()),
        skills: Array.from(this.skills.values()),
        certifications: Array.from(this.certifications.values()),
        studySessions: this.studySessions.slice(-500), // Keep last 500 sessions
        goals: Array.from(this.goals.values()),
        researchProjects: Array.from(this.researchProjects.values()),
        flashcardDecks: Array.from(this.flashcardDecks.values()),
        readingList: Array.from(this.readingList.values()),
        streak: this.streak
      };
      localStorage.setItem('unified_learning_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[Learning] Failed to save to storage:', error);
    }
  }

  // ============================================================================
  // COURSE MANAGEMENT
  // ============================================================================

  async addCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.courses.set(newCourse.id, newCourse);
    this.saveToStorage();

    // Emit event for finance tracking if course has cost
    if (newCourse.cost > 0) {
      eventBus.emit('finance:expense', {
        amount: newCourse.cost,
        category: 'education',
        description: `Course: ${newCourse.title}`,
        linkedId: newCourse.id
      });
    }

    eventBus.emit('learning:course:added', newCourse);
    return newCourse;
  }

  async updateCourseProgress(courseId: string, progress: number, completedModules?: number): Promise<Course | null> {
    const course = this.courses.get(courseId);
    if (!course) return null;

    const previousProgress = course.progress;
    course.progress = Math.min(100, Math.max(0, progress));
    if (completedModules !== undefined) {
      course.completedModules = completedModules;
    }
    course.updatedAt = new Date();

    // Check if course just completed
    if (course.progress === 100 && previousProgress < 100) {
      course.status = 'completed';
      course.completionDate = new Date();

      // Update linked skills
      for (const skillId of course.linkedSkills) {
        await this.addSkillPracticeHours(skillId, course.actualHoursSpent);
      }

      eventBus.emit('learning:course:completed', course);
    }

    this.courses.set(courseId, course);
    this.saveToStorage();
    this.updateStreak();

    eventBus.emit('learning:progress', {
      type: 'course',
      id: courseId,
      progress: course.progress
    });

    return course;
  }

  getCourse(courseId: string): Course | undefined {
    return this.courses.get(courseId);
  }

  getAllCourses(): Course[] {
    return Array.from(this.courses.values());
  }

  getCoursesByStatus(status: Course['status']): Course[] {
    return Array.from(this.courses.values()).filter(c => c.status === status);
  }

  getCoursesByProvider(provider: Course['provider']): Course[] {
    return Array.from(this.courses.values()).filter(c => c.provider === provider);
  }

  // ============================================================================
  // SKILL MANAGEMENT
  // ============================================================================

  async addSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
    const newSkill: Skill = {
      ...skill,
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.skills.set(newSkill.id, newSkill);
    this.saveToStorage();

    eventBus.emit('learning:skill:added', newSkill);
    return newSkill;
  }

  async updateSkillLevel(skillId: string, newLevel: 1 | 2 | 3 | 4 | 5, evidence?: string): Promise<Skill | null> {
    const skill = this.skills.get(skillId);
    if (!skill) return null;

    const previousLevel = skill.currentLevel;
    skill.currentLevel = newLevel;
    skill.updatedAt = new Date();

    if (newLevel > previousLevel) {
      skill.milestones.push({
        level: newLevel,
        achievedDate: new Date(),
        evidence
      });

      eventBus.emit('learning:skill:levelup', {
        skill,
        previousLevel,
        newLevel
      });
    }

    this.skills.set(skillId, skill);
    this.saveToStorage();

    return skill;
  }

  async addSkillPracticeHours(skillId: string, hours: number): Promise<Skill | null> {
    const skill = this.skills.get(skillId);
    if (!skill) return null;

    skill.practiceHours += hours;
    skill.lastPracticed = new Date();
    skill.updatedAt = new Date();

    // Check for level up based on practice hours
    const hoursForLevel = [0, 10, 50, 200, 500, 1000]; // Hours needed for each level
    const potentialLevel = hoursForLevel.findIndex(h => skill.practiceHours < h);
    if (potentialLevel > skill.currentLevel && potentialLevel <= 5) {
      await this.updateSkillLevel(skillId, potentialLevel as 1 | 2 | 3 | 4 | 5, `${skill.practiceHours} hours of practice`);
    }

    this.skills.set(skillId, skill);
    this.saveToStorage();

    return skill;
  }

  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getSkillsByCategory(category: Skill['category']): Skill[] {
    return Array.from(this.skills.values()).filter(s => s.category === category);
  }

  getSkillGaps(requiredSkills: Array<{ name: string; level: number }>): Array<{ skill: string; required: number; current: number; gap: number }> {
    const gaps: Array<{ skill: string; required: number; current: number; gap: number }> = [];

    for (const required of requiredSkills) {
      const existingSkill = Array.from(this.skills.values()).find(
        s => s.name.toLowerCase() === required.name.toLowerCase()
      );

      const currentLevel = existingSkill?.currentLevel || 0;
      if (currentLevel < required.level) {
        gaps.push({
          skill: required.name,
          required: required.level,
          current: currentLevel,
          gap: required.level - currentLevel
        });
      }
    }

    return gaps.sort((a, b) => b.gap - a.gap);
  }

  private checkSkillGaps(requiredSkills: string[]): void {
    const skills = requiredSkills.map(name => ({ name, level: 3 })); // Assume level 3 required
    const gaps = this.getSkillGaps(skills);
    if (gaps.length > 0) {
      eventBus.emit('learning:skill:gaps', gaps);
    }
  }

  // ============================================================================
  // CERTIFICATION MANAGEMENT
  // ============================================================================

  async addCertification(cert: Omit<Certification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Certification> {
    const newCert: Certification = {
      ...cert,
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.certifications.set(newCert.id, newCert);
    this.saveToStorage();

    if (newCert.cost > 0 && newCert.status !== 'planned') {
      eventBus.emit('finance:expense', {
        amount: newCert.cost,
        category: 'education',
        description: `Certification: ${newCert.name}`,
        linkedId: newCert.id
      });
    }

    eventBus.emit('learning:certification:added', newCert);
    return newCert;
  }

  async updateCertificationStatus(certId: string, status: Certification['status'], examScore?: number): Promise<Certification | null> {
    const cert = this.certifications.get(certId);
    if (!cert) return null;

    cert.status = status;
    cert.updatedAt = new Date();

    if (status === 'earned') {
      cert.earnedDate = new Date();
      if (examScore !== undefined) {
        cert.examScore = examScore;
      }

      // Update linked skills
      for (const skillId of cert.linkedSkills) {
        const skill = this.skills.get(skillId);
        if (skill) {
          skill.evidenceLinks.push(cert.verificationUrl || cert.name);
          this.skills.set(skillId, skill);
        }
      }

      eventBus.emit('learning:certification:earned', cert);
    }

    this.certifications.set(certId, cert);
    this.saveToStorage();

    return cert;
  }

  getCertification(certId: string): Certification | undefined {
    return this.certifications.get(certId);
  }

  getAllCertifications(): Certification[] {
    return Array.from(this.certifications.values());
  }

  getExpiringCertifications(withinDays: number = 90): Certification[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + withinDays);

    return Array.from(this.certifications.values())
      .filter(c => c.expirationDate && c.status === 'earned' && new Date(c.expirationDate) <= cutoffDate)
      .sort((a, b) => new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime());
  }

  // ============================================================================
  // STUDY SESSION MANAGEMENT
  // ============================================================================

  async startStudySession(session: Omit<StudySession, 'id' | 'createdAt' | 'breaks' | 'completed'>): Promise<StudySession> {
    const newSession: StudySession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      breaks: [],
      completed: false,
      createdAt: new Date()
    };

    this.studySessions.push(newSession);
    this.saveToStorage();

    // Emit spoon cost for health system
    if (session.energyBefore) {
      eventBus.emit('health:spoons:used', {
        amount: 2, // Base study spoon cost
        activity: 'study_session',
        linkedId: newSession.id
      });
    }

    eventBus.emit('learning:session:started', newSession);
    return newSession;
  }

  async endStudySession(
    sessionId: string,
    notes: string,
    keyTakeaways: string[],
    focusScore?: number,
    energyAfter?: number
  ): Promise<StudySession | null> {
    const sessionIndex = this.studySessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return null;

    const session = this.studySessions[sessionIndex];
    session.endTime = new Date();
    session.actualDuration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000);
    session.notes = notes;
    session.keyTakeaways = keyTakeaways;
    session.focusScore = focusScore;
    session.energyAfter = energyAfter;
    session.completed = true;

    this.studySessions[sessionIndex] = session;
    this.saveToStorage();
    this.updateStreak();

    // Update related entities
    if (session.courseId) {
      const course = this.courses.get(session.courseId);
      if (course) {
        course.actualHoursSpent += session.actualDuration / 60;
        this.courses.set(session.courseId, course);
      }
    }

    if (session.skillId) {
      await this.addSkillPracticeHours(session.skillId, session.actualDuration / 60);
    }

    eventBus.emit('learning:session:completed', {
      ...session,
      duration: session.actualDuration
    });

    return session;
  }

  addBreakToSession(sessionId: string, breakType: 'short' | 'long' | 'pomodoro'): void {
    const session = this.studySessions.find(s => s.id === sessionId);
    if (session && !session.completed) {
      session.breaks.push({
        startTime: new Date(),
        duration: breakType === 'short' ? 5 : breakType === 'long' ? 15 : 25,
        type: breakType
      });
      this.saveToStorage();

      // Breaks help recover energy
      eventBus.emit('health:spoons:recovered', {
        amount: breakType === 'long' ? 1 : 0.5,
        activity: 'study_break'
      });
    }
  }

  getStudySessions(options?: {
    fromDate?: Date;
    toDate?: Date;
    courseId?: string;
    skillId?: string;
    limit?: number;
  }): StudySession[] {
    let sessions = [...this.studySessions];

    if (options?.fromDate) {
      sessions = sessions.filter(s => new Date(s.startTime) >= options.fromDate!);
    }
    if (options?.toDate) {
      sessions = sessions.filter(s => new Date(s.startTime) <= options.toDate!);
    }
    if (options?.courseId) {
      sessions = sessions.filter(s => s.courseId === options.courseId);
    }
    if (options?.skillId) {
      sessions = sessions.filter(s => s.skillId === options.skillId);
    }

    sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    if (options?.limit) {
      sessions = sessions.slice(0, options.limit);
    }

    return sessions;
  }

  // ============================================================================
  // LEARNING GOALS
  // ============================================================================

  async addGoal(goal: Omit<LearningGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningGoal> {
    const newGoal: LearningGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.goals.set(newGoal.id, newGoal);
    this.saveToStorage();

    eventBus.emit('learning:goal:added', newGoal);
    return newGoal;
  }

  async updateGoalProgress(goalId: string, progress: number): Promise<LearningGoal | null> {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    goal.progress = Math.min(100, Math.max(0, progress));
    goal.updatedAt = new Date();

    if (goal.progress === 100 && goal.status !== 'completed') {
      goal.status = 'completed';
      eventBus.emit('learning:goal:completed', goal);
    }

    this.goals.set(goalId, goal);
    this.saveToStorage();

    return goal;
  }

  async completeMilestone(goalId: string, milestoneId: string): Promise<LearningGoal | null> {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.completed = true;
      milestone.completedDate = new Date();

      // Recalculate progress
      const completedCount = goal.milestones.filter(m => m.completed).length;
      goal.progress = Math.round((completedCount / goal.milestones.length) * 100);
      goal.updatedAt = new Date();

      this.goals.set(goalId, goal);
      this.saveToStorage();

      eventBus.emit('learning:milestone:completed', { goal, milestone });
    }

    return goal;
  }

  getAllGoals(): LearningGoal[] {
    return Array.from(this.goals.values());
  }

  getActiveGoals(): LearningGoal[] {
    return Array.from(this.goals.values()).filter(g => g.status === 'in_progress');
  }

  // ============================================================================
  // RESEARCH PROJECTS
  // ============================================================================

  async addResearchProject(project: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchProject> {
    const newProject: ResearchProject = {
      ...project,
      id: `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.researchProjects.set(newProject.id, newProject);
    this.saveToStorage();

    eventBus.emit('learning:research:added', newProject);
    return newProject;
  }

  async addSourceToResearch(projectId: string, source: Omit<ResearchProject['sources'][0], 'id'>): Promise<ResearchProject | null> {
    const project = this.researchProjects.get(projectId);
    if (!project) return null;

    project.sources.push({
      ...source,
      id: `source_${Date.now()}`
    });
    project.updatedAt = new Date();

    this.researchProjects.set(projectId, project);
    this.saveToStorage();

    return project;
  }

  getAllResearchProjects(): ResearchProject[] {
    return Array.from(this.researchProjects.values());
  }

  // ============================================================================
  // FLASHCARDS & SPACED REPETITION
  // ============================================================================

  async createFlashcardDeck(deck: Omit<FlashcardDeck, 'id' | 'cardCount' | 'masteredCount' | 'totalStudyTime' | 'createdAt' | 'updatedAt'>): Promise<FlashcardDeck> {
    const newDeck: FlashcardDeck = {
      ...deck,
      id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cardCount: 0,
      masteredCount: 0,
      totalStudyTime: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.flashcardDecks.set(newDeck.id, newDeck);
    this.saveToStorage();

    return newDeck;
  }

  async addFlashcard(card: Omit<Flashcard, 'id' | 'correctCount' | 'incorrectCount' | 'streak' | 'easeFactor' | 'interval' | 'createdAt' | 'updatedAt'>): Promise<Flashcard> {
    const newCard: Flashcard = {
      ...card,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      correctCount: 0,
      incorrectCount: 0,
      streak: 0,
      easeFactor: 2.5, // Default SM-2 ease factor
      interval: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.flashcards.set(newCard.id, newCard);

    // Update deck card count
    const deck = this.flashcardDecks.get(card.deckId);
    if (deck) {
      deck.cardCount++;
      this.flashcardDecks.set(deck.id, deck);
    }

    this.saveToStorage();
    return newCard;
  }

  async reviewFlashcard(cardId: string, correct: boolean): Promise<Flashcard | null> {
    const card = this.flashcards.get(cardId);
    if (!card) return null;

    // SM-2 Spaced Repetition Algorithm
    if (correct) {
      card.correctCount++;
      card.streak++;

      if (card.streak === 1) {
        card.interval = 1;
      } else if (card.streak === 2) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }

      card.easeFactor = Math.max(1.3, card.easeFactor + 0.1);
    } else {
      card.incorrectCount++;
      card.streak = 0;
      card.interval = 1;
      card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
    }

    card.lastReviewed = new Date();
    card.nextReview = new Date();
    card.nextReview.setDate(card.nextReview.getDate() + card.interval);
    card.updatedAt = new Date();

    this.flashcards.set(cardId, card);
    this.saveToStorage();

    return card;
  }

  getCardsForReview(deckId?: string, limit: number = 20): Flashcard[] {
    const now = new Date();
    let cards = Array.from(this.flashcards.values());

    if (deckId) {
      cards = cards.filter(c => c.deckId === deckId);
    }

    // Get cards due for review
    cards = cards.filter(c => !c.nextReview || new Date(c.nextReview) <= now);

    // Sort by priority: new cards first, then by due date
    cards.sort((a, b) => {
      if (!a.lastReviewed && b.lastReviewed) return -1;
      if (a.lastReviewed && !b.lastReviewed) return 1;
      return (a.nextReview?.getTime() || 0) - (b.nextReview?.getTime() || 0);
    });

    return cards.slice(0, limit);
  }

  getAllFlashcardDecks(): FlashcardDeck[] {
    return Array.from(this.flashcardDecks.values());
  }

  // ============================================================================
  // READING LIST
  // ============================================================================

  async addReadingItem(item: Omit<ReadingItem, 'id' | 'highlights' | 'createdAt' | 'updatedAt'>): Promise<ReadingItem> {
    const newItem: ReadingItem = {
      ...item,
      id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      highlights: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.readingList.set(newItem.id, newItem);
    this.saveToStorage();

    eventBus.emit('learning:reading:added', newItem);
    return newItem;
  }

  async addHighlight(itemId: string, highlight: Omit<ReadingItem['highlights'][0], 'createdAt'>): Promise<ReadingItem | null> {
    const item = this.readingList.get(itemId);
    if (!item) return null;

    item.highlights.push({
      ...highlight,
      createdAt: new Date()
    });
    item.updatedAt = new Date();

    this.readingList.set(itemId, item);
    this.saveToStorage();

    return item;
  }

  async updateReadingProgress(itemId: string, progress: number): Promise<ReadingItem | null> {
    const item = this.readingList.get(itemId);
    if (!item) return null;

    item.progress = progress;
    item.updatedAt = new Date();

    if (progress === 100 || (item.totalPages && progress >= item.totalPages)) {
      item.status = 'completed';
      item.completionDate = new Date();
      eventBus.emit('learning:reading:completed', item);
    }

    this.readingList.set(itemId, item);
    this.saveToStorage();
    this.updateStreak();

    return item;
  }

  getReadingList(status?: ReadingItem['status']): ReadingItem[] {
    let items = Array.from(this.readingList.values());
    if (status) {
      items = items.filter(i => i.status === status);
    }
    return items;
  }

  // ============================================================================
  // AI TEACHER SESSIONS
  // ============================================================================

  async startAITeacherSession(session: Omit<AITeacherSession, 'id' | 'messages' | 'questionsAsked' | 'conceptsCovered' | 'duration' | 'createdAt'>): Promise<AITeacherSession> {
    const newSession: AITeacherSession = {
      ...session,
      id: `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messages: [],
      questionsAsked: 0,
      conceptsCovered: [],
      duration: 0,
      createdAt: new Date()
    };

    this.aiTeacherSessions.push(newSession);
    this.saveToStorage();

    eventBus.emit('learning:ai_teacher:started', newSession);
    return newSession;
  }

  async addMessageToTeacherSession(sessionId: string, role: 'user' | 'teacher', content: string): Promise<AITeacherSession | null> {
    const session = this.aiTeacherSessions.find(s => s.id === sessionId);
    if (!session) return null;

    session.messages.push({
      role,
      content,
      timestamp: new Date()
    });

    if (role === 'user' && content.includes('?')) {
      session.questionsAsked++;
    }

    this.saveToStorage();
    return session;
  }

  async endAITeacherSession(sessionId: string, conceptsCovered: string[], satisfaction?: number): Promise<AITeacherSession | null> {
    const session = this.aiTeacherSessions.find(s => s.id === sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000);
    session.conceptsCovered = conceptsCovered;
    session.satisfaction = satisfaction;

    this.saveToStorage();
    this.updateStreak();

    eventBus.emit('learning:ai_teacher:completed', session);
    return session;
  }

  getAITeacherSessions(limit?: number): AITeacherSession[] {
    let sessions = [...this.aiTeacherSessions];
    sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    if (limit) {
      sessions = sessions.slice(0, limit);
    }
    return sessions;
  }

  // ============================================================================
  // LEARNING STREAK & STATISTICS
  // ============================================================================

  private updateStreak(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = new Date(this.streak.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const dayDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) {
      // Same day, streak continues
    } else if (dayDiff === 1) {
      // Next day, increment streak
      this.streak.currentStreak++;
      this.streak.totalDaysLearned++;
    } else {
      // Streak broken
      this.streak.currentStreak = 1;
      this.streak.totalDaysLearned++;
    }

    if (this.streak.currentStreak > this.streak.longestStreak) {
      this.streak.longestStreak = this.streak.currentStreak;
    }

    this.streak.lastActivityDate = new Date();
    this.saveToStorage();

    eventBus.emit('learning:streak:updated', this.streak);
  }

  getStreak(): LearningStreak {
    return { ...this.streak };
  }

  getWeeklyStudyMinutes(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return this.studySessions
      .filter(s => new Date(s.startTime) >= weekAgo && s.completed)
      .reduce((sum, s) => sum + (s.actualDuration || 0), 0);
  }

  getLearningStatistics(): {
    totalCoursesCompleted: number;
    totalStudyHours: number;
    totalSkills: number;
    totalCertifications: number;
    averageFocusScore: number;
    mostProductiveTime: string;
    topCategories: Array<{ category: string; hours: number }>;
  } {
    const completedCourses = Array.from(this.courses.values()).filter(c => c.status === 'completed').length;
    const totalStudyMinutes = this.studySessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
    const earnedCerts = Array.from(this.certifications.values()).filter(c => c.status === 'earned').length;

    // Calculate average focus score
    const focusScores = this.studySessions.filter(s => s.focusScore).map(s => s.focusScore!);
    const avgFocus = focusScores.length > 0
      ? focusScores.reduce((a, b) => a + b, 0) / focusScores.length
      : 0;

    // Find most productive time
    const hourCounts: { [hour: number]: number } = {};
    this.studySessions.forEach(s => {
      const hour = new Date(s.startTime).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + (s.actualDuration || 0);
    });
    const mostProductiveHour = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)[0];
    const productiveTime = mostProductiveHour
      ? `${mostProductiveHour[0]}:00 - ${parseInt(mostProductiveHour[0]) + 1}:00`
      : 'N/A';

    // Top categories
    const categoryHours: { [cat: string]: number } = {};
    Array.from(this.courses.values()).forEach(c => {
      categoryHours[c.category] = (categoryHours[c.category] || 0) + c.actualHoursSpent;
    });
    const topCategories = Object.entries(categoryHours)
      .map(([category, hours]) => ({ category, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);

    return {
      totalCoursesCompleted: completedCourses,
      totalStudyHours: Math.round(totalStudyMinutes / 60),
      totalSkills: this.skills.size,
      totalCertifications: earnedCerts,
      averageFocusScore: Math.round(avgFocus * 10) / 10,
      mostProductiveTime: productiveTime,
      topCategories
    };
  }

  // ============================================================================
  // RECOMMENDATIONS
  // ============================================================================

  generateRecommendations(): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = [];

    // Recommend based on incomplete courses with high progress
    Array.from(this.courses.values())
      .filter(c => c.status === 'in_progress' && c.progress >= 75)
      .forEach(c => {
        recommendations.push({
          id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          type: 'course',
          title: `Finish "${c.title}"`,
          reason: `You're ${c.progress}% done! Just a little more to complete.`,
          relevanceScore: 0.9,
          linkedGoals: c.linkedCareerGoals,
          estimatedTime: (c.estimatedHours - c.actualHoursSpent) * 60,
          difficulty: 'intermediate',
          provider: c.provider,
          url: c.url,
          createdAt: new Date()
        });
      });

    // Recommend skills that haven't been practiced recently
    Array.from(this.skills.values())
      .filter(s => {
        if (!s.lastPracticed) return true;
        const daysSince = (Date.now() - new Date(s.lastPracticed).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince > 14;
      })
      .slice(0, 3)
      .forEach(s => {
        recommendations.push({
          id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          type: 'skill',
          title: `Practice ${s.name}`,
          reason: s.lastPracticed
            ? `It's been a while since you practiced this skill.`
            : `Start building proficiency in this skill.`,
          relevanceScore: 0.7,
          linkedGoals: [],
          estimatedTime: 30,
          difficulty: s.currentLevel <= 2 ? 'beginner' : s.currentLevel <= 4 ? 'intermediate' : 'advanced',
          createdAt: new Date()
        });
      });

    // Recommend flashcard review
    const dueCards = this.getCardsForReview(undefined, 1).length;
    if (dueCards > 0) {
      recommendations.push({
        id: `rec_${Date.now()}_flashcards`,
        type: 'practice',
        title: `Review ${dueCards} flashcard${dueCards > 1 ? 's' : ''}`,
        reason: 'Spaced repetition helps retain knowledge long-term.',
        relevanceScore: 0.8,
        linkedGoals: [],
        estimatedTime: Math.min(dueCards * 2, 30),
        difficulty: 'beginner',
        createdAt: new Date()
      });
    }

    // Recommend based on reading list
    const toReadItems = this.getReadingList('to_read');
    if (toReadItems.length > 0) {
      const item = toReadItems[0];
      recommendations.push({
        id: `rec_${Date.now()}_reading`,
        type: 'reading',
        title: `Read "${item.title}"`,
        reason: 'Start on your reading backlog.',
        relevanceScore: 0.6,
        linkedGoals: [],
        estimatedTime: 30,
        difficulty: 'beginner',
        url: item.url,
        createdAt: new Date()
      });
    }

    return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // ============================================================================
  // CROSS-SYSTEM HELPERS
  // ============================================================================

  private logEducationalContent(data: any): void {
    // Log educational entertainment content as learning activity
    this.studySessions.push({
      id: `session_edu_${Date.now()}`,
      type: 'video',
      topic: data.title || 'Educational Content',
      startTime: new Date(data.startTime || Date.now()),
      endTime: new Date(),
      plannedDuration: data.duration || 30,
      actualDuration: data.duration || 30,
      notes: `Watched: ${data.title}`,
      keyTakeaways: [],
      questionsRaised: [],
      resourcesUsed: [data.source || 'streaming'],
      completed: true,
      breaks: [],
      createdAt: new Date()
    });

    this.updateStreak();
    this.saveToStorage();
  }

  calculateLearningROI(): {
    totalInvested: number;
    estimatedReturn: number;
    roi: number;
    breakdown: Array<{ item: string; cost: number; estimatedValue: number }>;
  } {
    const breakdown: Array<{ item: string; cost: number; estimatedValue: number }> = [];
    let totalInvested = 0;

    // Course investments
    Array.from(this.courses.values())
      .filter(c => c.status === 'completed')
      .forEach(c => {
        const estimatedValue = c.cost * 3; // Conservative 3x return estimate
        breakdown.push({
          item: c.title,
          cost: c.cost,
          estimatedValue
        });
        totalInvested += c.cost;
      });

    // Certification investments
    Array.from(this.certifications.values())
      .filter(c => c.status === 'earned')
      .forEach(c => {
        const estimatedValue = c.cost * 5; // Certifications often have higher ROI
        breakdown.push({
          item: c.name,
          cost: c.cost,
          estimatedValue
        });
        totalInvested += c.cost;
      });

    const estimatedReturn = breakdown.reduce((sum, b) => sum + b.estimatedValue, 0);
    const roi = totalInvested > 0 ? ((estimatedReturn - totalInvested) / totalInvested) * 100 : 0;

    return { totalInvested, estimatedReturn, roi: Math.round(roi), breakdown };
  }
}

// Export singleton instance
export const learningEcosystem = UnifiedLearningEcosystem.getInstance();

// Export convenience functions
export const addCourse = (course: Parameters<typeof learningEcosystem.addCourse>[0]) => learningEcosystem.addCourse(course);
export const addSkill = (skill: Parameters<typeof learningEcosystem.addSkill>[0]) => learningEcosystem.addSkill(skill);
export const addCertification = (cert: Parameters<typeof learningEcosystem.addCertification>[0]) => learningEcosystem.addCertification(cert);
export const startStudySession = (session: Parameters<typeof learningEcosystem.startStudySession>[0]) => learningEcosystem.startStudySession(session);
export const getStreak = () => learningEcosystem.getStreak();
export const getRecommendations = () => learningEcosystem.generateRecommendations();
export const getLearningStats = () => learningEcosystem.getLearningStatistics();
