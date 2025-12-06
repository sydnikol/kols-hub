/**
 * UNIFIED CAREER ECOSYSTEM
 *
 * Career and employment management for chronic illness:
 * - Accommodation tracking and documentation
 * - Flexible work arrangement management
 * - Disability benefits coordination
 * - Passive income tracking (when traditional work is limited)
 * - Volunteer work (for social connection when employed work isn't possible)
 * - Skills inventory and job matching
 *
 * Cross-system connections:
 * - Health: Symptom impacts on work, accommodations needed
 * - Finance: Income tracking, benefits, passive income
 * - Learning: Skills development, certifications
 * - Relationships: Professional network
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Employment {
  id: string;
  type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'volunteer' | 'disability' | 'self_employed';
  employer?: string;
  jobTitle: string;
  department?: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'leave' | 'ended' | 'paused';
  workArrangement: 'onsite' | 'remote' | 'hybrid';
  schedule?: {
    hoursPerWeek: number;
    flexibleHours: boolean;
    workDays: number[]; // 0-6 for Sun-Sat
    startTime?: string;
    endTime?: string;
  };
  compensation?: {
    type: 'salary' | 'hourly' | 'commission' | 'stipend' | 'unpaid';
    amount: number;
    frequency: 'hourly' | 'weekly' | 'biweekly' | 'monthly' | 'annual';
    currency: string;
  };
  benefits?: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    visionInsurance: boolean;
    lifeInsurance: boolean;
    disability: {
      shortTerm: boolean;
      longTerm: boolean;
    };
    pto: {
      sickDays: number;
      vacationDays: number;
      personalDays: number;
    };
    fmlaEligible: boolean;
    otherBenefits: string[];
  };
  accommodations: string[];
  supervisorContact?: {
    name: string;
    email?: string;
    phone?: string;
  };
  hrContact?: {
    name: string;
    email?: string;
    phone?: string;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Accommodation {
  id: string;
  employmentId?: string;
  type: 'schedule' | 'physical' | 'equipment' | 'communication' | 'policy' | 'other';
  title: string;
  description: string;
  status: 'requested' | 'pending' | 'approved' | 'denied' | 'implemented' | 'expired';
  requestDate: Date;
  responseDate?: Date;
  implementationDate?: Date;
  expirationDate?: Date;
  documentation: Array<{
    type: string;
    fileName: string;
    uploadDate: Date;
    notes?: string;
  }>;
  medicalJustification?: string;
  interactiveMeetings: Array<{
    date: Date;
    attendees: string[];
    notes: string;
    outcome: string;
  }>;
  denialReason?: string;
  appealStatus?: 'none' | 'filed' | 'pending' | 'won' | 'lost';
  linkedSymptoms: string[];
  effectiveness?: number; // 1-5
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkCapacity {
  date: Date;
  energyLevel: number; // Spoons available for work
  estimatedProductiveHours: number;
  symptoms: Array<{
    symptom: string;
    severity: number;
    impactOnWork: string;
  }>;
  accommodationsNeeded: string[];
  workFromHomeNeeded: boolean;
  reducedHoursNeeded: boolean;
  canAttendMeetings: boolean;
  canDriveToOffice: boolean;
  notes: string;
}

export interface DisabilityBenefit {
  id: string;
  type: 'ssdi' | 'ssi' | 'state_disability' | 'private_disability' | 'veterans' | 'other';
  provider: string;
  applicationDate?: Date;
  approvalDate?: Date;
  status: 'not_applied' | 'preparing' | 'applied' | 'pending' | 'approved' | 'denied' | 'appeal' | 'receiving';
  monthlyAmount?: number;
  startDate?: Date;
  reviewDate?: Date;
  conditions: string[];
  caseNumber?: string;
  representativeName?: string;
  representativeContact?: string;
  documents: Array<{
    type: string;
    fileName: string;
    date: Date;
    notes?: string;
  }>;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PassiveIncomeStream {
  id: string;
  type: 'dividends' | 'rental' | 'royalties' | 'affiliate' | 'digital_products' | 'content' | 'interest' | 'disability_income' | 'other';
  name: string;
  description: string;
  platform?: string;
  status: 'active' | 'paused' | 'building' | 'ended';
  setupDate?: Date;
  setupSpoonCost: number; // Initial energy to set up
  ongoingSpoonCost: number; // Monthly maintenance energy
  monthlyIncome: number;
  yearToDateIncome: number;
  incomeHistory: Array<{
    month: string;
    amount: number;
    notes?: string;
  }>;
  linkedContent?: string[];
  linkedProjects?: string[];
  automationLevel: 'none' | 'partial' | 'full';
  nextAction?: string;
  nextActionDate?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  jobPostingUrl?: string;
  status: 'researching' | 'preparing' | 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected' | 'withdrawn';
  applicationDate?: Date;
  workArrangement: 'onsite' | 'remote' | 'hybrid' | 'unknown';
  accommodationFriendly: boolean;
  salaryRange?: { min: number; max: number };
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  contacts: Array<{
    name: string;
    role: string;
    email?: string;
    notes?: string;
  }>;
  interviews: Array<{
    date: Date;
    type: 'phone' | 'video' | 'onsite' | 'panel';
    interviewers: string[];
    questions?: string[];
    notes: string;
    energyRequired: number;
  }>;
  followUps: Array<{
    date: Date;
    type: string;
    notes: string;
  }>;
  spoonCostTotal: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'industry' | 'tool' | 'language' | 'certification';
  level: 1 | 2 | 3 | 4 | 5;
  yearsExperience?: number;
  canDoOnBadDays: boolean; // Can perform this skill even with symptoms
  energyRequired: 'low' | 'medium' | 'high';
  linkedCertifications: string[];
  linkedEmployments: string[];
  lastUsed?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VolunteerPosition {
  id: string;
  organization: string;
  role: string;
  description: string;
  status: 'active' | 'paused' | 'ended';
  startDate: Date;
  endDate?: Date;
  hoursPerWeek: number;
  flexibility: 'high' | 'medium' | 'low';
  remoteOption: boolean;
  spoonCost: number;
  socialValue: number; // 1-5 how much social connection it provides
  skillsUsed: string[];
  skillsGained: string[];
  contactPerson?: string;
  contactEmail?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// UNIFIED CAREER ECOSYSTEM CLASS
// ============================================================================

class UnifiedCareerEcosystem {
  private static instance: UnifiedCareerEcosystem;
  private employments: Map<string, Employment> = new Map();
  private accommodations: Map<string, Accommodation> = new Map();
  private workCapacityLogs: WorkCapacity[] = [];
  private disabilityBenefits: Map<string, DisabilityBenefit> = new Map();
  private passiveIncomeStreams: Map<string, PassiveIncomeStream> = new Map();
  private jobApplications: Map<string, JobApplication> = new Map();
  private skills: Map<string, Skill> = new Map();
  private volunteerPositions: Map<string, VolunteerPosition> = new Map();

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
  }

  static getInstance(): UnifiedCareerEcosystem {
    if (!UnifiedCareerEcosystem.instance) {
      UnifiedCareerEcosystem.instance = new UnifiedCareerEcosystem();
    }
    return UnifiedCareerEcosystem.instance;
  }

  private initializeEventListeners(): void {
    // Health integration - symptoms affect work capacity
    eventBus.on('health:symptom:logged', (data: any) => {
      this.assessWorkImpact(data);
    });

    eventBus.on('health:energy:changed', (data: any) => {
      this.updateWorkCapacity(data.currentSpoons);
    });

    // Finance integration - income tracking
    eventBus.on('finance:income:needed', () => {
      this.suggestIncomeOpportunities();
    });

    // Learning integration - skill updates
    eventBus.on('learning:skill:levelup', (data: any) => {
      this.updateSkillFromLearning(data);
    });

    eventBus.on('learning:certification:earned', (data: any) => {
      this.linkCertificationToSkills(data);
    });

    // Calendar integration - work schedule
    eventBus.on('calendar:work:scheduled', (data: any) => {
      this.checkScheduleAgainstCapacity(data);
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('unified_career_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.employments) data.employments.forEach((e: Employment) => this.employments.set(e.id, e));
        if (data.accommodations) data.accommodations.forEach((a: Accommodation) => this.accommodations.set(a.id, a));
        if (data.workCapacityLogs) this.workCapacityLogs = data.workCapacityLogs;
        if (data.disabilityBenefits) data.disabilityBenefits.forEach((d: DisabilityBenefit) => this.disabilityBenefits.set(d.id, d));
        if (data.passiveIncomeStreams) data.passiveIncomeStreams.forEach((p: PassiveIncomeStream) => this.passiveIncomeStreams.set(p.id, p));
        if (data.jobApplications) data.jobApplications.forEach((j: JobApplication) => this.jobApplications.set(j.id, j));
        if (data.skills) data.skills.forEach((s: Skill) => this.skills.set(s.id, s));
        if (data.volunteerPositions) data.volunteerPositions.forEach((v: VolunteerPosition) => this.volunteerPositions.set(v.id, v));
      }
    } catch (error) {
      console.error('[Career] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        employments: Array.from(this.employments.values()),
        accommodations: Array.from(this.accommodations.values()),
        workCapacityLogs: this.workCapacityLogs.slice(-365),
        disabilityBenefits: Array.from(this.disabilityBenefits.values()),
        passiveIncomeStreams: Array.from(this.passiveIncomeStreams.values()),
        jobApplications: Array.from(this.jobApplications.values()),
        skills: Array.from(this.skills.values()),
        volunteerPositions: Array.from(this.volunteerPositions.values())
      };
      localStorage.setItem('unified_career_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[Career] Failed to save to storage:', error);
    }
  }

  // ============================================================================
  // EMPLOYMENT MANAGEMENT
  // ============================================================================

  async addEmployment(employment: Omit<Employment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employment> {
    const newEmployment: Employment = {
      ...employment,
      id: `employment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.employments.set(newEmployment.id, newEmployment);
    this.saveToStorage();

    if (newEmployment.compensation?.amount) {
      eventBus.emit('finance:income:source', {
        type: 'employment',
        amount: newEmployment.compensation.amount,
        frequency: newEmployment.compensation.frequency,
        linkedId: newEmployment.id
      });
    }

    eventBus.emit('career:employment:added', newEmployment);
    return newEmployment;
  }

  async updateEmploymentStatus(employmentId: string, status: Employment['status'], notes?: string): Promise<Employment | null> {
    const employment = this.employments.get(employmentId);
    if (!employment) return null;

    const previousStatus = employment.status;
    employment.status = status;
    employment.updatedAt = new Date();
    if (notes) employment.notes = notes;

    if (status === 'ended') {
      employment.endDate = new Date();
    }

    this.employments.set(employmentId, employment);
    this.saveToStorage();

    eventBus.emit('career:employment:statuschange', {
      employment,
      previousStatus,
      newStatus: status
    });

    return employment;
  }

  getCurrentEmployment(): Employment | undefined {
    return Array.from(this.employments.values()).find(e => e.status === 'active');
  }

  getAllEmployments(): Employment[] {
    return Array.from(this.employments.values());
  }

  // ============================================================================
  // ACCOMMODATION MANAGEMENT
  // ============================================================================

  async requestAccommodation(accommodation: Omit<Accommodation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Accommodation> {
    const newAccommodation: Accommodation = {
      ...accommodation,
      id: `accommodation_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accommodations.set(newAccommodation.id, newAccommodation);
    this.saveToStorage();

    eventBus.emit('career:accommodation:requested', newAccommodation);
    return newAccommodation;
  }

  async updateAccommodationStatus(
    accommodationId: string,
    status: Accommodation['status'],
    details?: Partial<Accommodation>
  ): Promise<Accommodation | null> {
    const accommodation = this.accommodations.get(accommodationId);
    if (!accommodation) return null;

    accommodation.status = status;
    if (details) Object.assign(accommodation, details);
    accommodation.updatedAt = new Date();

    if (status === 'approved' || status === 'denied') {
      accommodation.responseDate = new Date();
    }
    if (status === 'implemented') {
      accommodation.implementationDate = new Date();
    }

    this.accommodations.set(accommodationId, accommodation);
    this.saveToStorage();

    eventBus.emit('career:accommodation:updated', accommodation);
    return accommodation;
  }

  async logInteractiveMeeting(
    accommodationId: string,
    meeting: Accommodation['interactiveMeetings'][0]
  ): Promise<Accommodation | null> {
    const accommodation = this.accommodations.get(accommodationId);
    if (!accommodation) return null;

    accommodation.interactiveMeetings.push(meeting);
    accommodation.updatedAt = new Date();

    this.accommodations.set(accommodationId, accommodation);
    this.saveToStorage();

    return accommodation;
  }

  getAccommodations(employmentId?: string): Accommodation[] {
    let accommodations = Array.from(this.accommodations.values());
    if (employmentId) {
      accommodations = accommodations.filter(a => a.employmentId === employmentId);
    }
    return accommodations;
  }

  getActiveAccommodations(): Accommodation[] {
    return Array.from(this.accommodations.values()).filter(a =>
      a.status === 'approved' || a.status === 'implemented'
    );
  }

  // ============================================================================
  // WORK CAPACITY TRACKING
  // ============================================================================

  async logWorkCapacity(capacity: WorkCapacity): Promise<void> {
    this.workCapacityLogs.push(capacity);
    this.saveToStorage();

    // Alert if capacity is very low
    if (capacity.energyLevel <= 2 || capacity.estimatedProductiveHours <= 2) {
      eventBus.emit('career:capacity:low', capacity);

      // Suggest calling in or working from home
      if (!capacity.workFromHomeNeeded) {
        eventBus.emit('notification:send', {
          type: 'work',
          title: 'Low Work Capacity',
          message: 'Your energy is low today. Consider working from home or taking a sick day.'
        });
      }
    }

    eventBus.emit('career:capacity:logged', capacity);
  }

  getTodaysCapacity(): WorkCapacity | undefined {
    const today = new Date().toDateString();
    return this.workCapacityLogs.find(c => new Date(c.date).toDateString() === today);
  }

  getCapacityHistory(days: number = 30): WorkCapacity[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return this.workCapacityLogs
      .filter(c => new Date(c.date) >= cutoff)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private updateWorkCapacity(currentSpoons: number): void {
    // Estimate productive hours based on spoons
    const productiveHours = Math.max(0, Math.floor((currentSpoons / 12) * 8));
    console.log(`[Career] Estimated productive hours today: ${productiveHours}`);
  }

  private assessWorkImpact(symptomData: any): void {
    // Log work impact of symptoms
    console.log(`[Career] Assessing work impact of ${symptomData.name}`);

    if (symptomData.severity >= 7) {
      eventBus.emit('notification:send', {
        type: 'work',
        title: 'Symptom Affecting Work',
        message: `High ${symptomData.name} severity may impact your work today. Consider accommodations.`
      });
    }
  }

  private checkScheduleAgainstCapacity(scheduleData: any): void {
    const todaysCapacity = this.getTodaysCapacity();
    if (todaysCapacity && scheduleData.hours > todaysCapacity.estimatedProductiveHours) {
      eventBus.emit('notification:send', {
        type: 'work',
        title: 'Schedule vs Capacity',
        message: `Scheduled ${scheduleData.hours} hours but estimated capacity is ${todaysCapacity.estimatedProductiveHours} hours`
      });
    }
  }

  // ============================================================================
  // DISABILITY BENEFITS
  // ============================================================================

  async addDisabilityBenefit(benefit: Omit<DisabilityBenefit, 'id' | 'createdAt' | 'updatedAt'>): Promise<DisabilityBenefit> {
    const newBenefit: DisabilityBenefit = {
      ...benefit,
      id: `benefit_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.disabilityBenefits.set(newBenefit.id, newBenefit);
    this.saveToStorage();

    if (benefit.status === 'receiving' && benefit.monthlyAmount) {
      eventBus.emit('finance:income:source', {
        type: 'disability',
        amount: benefit.monthlyAmount,
        frequency: 'monthly',
        linkedId: newBenefit.id
      });
    }

    eventBus.emit('career:disability:added', newBenefit);
    return newBenefit;
  }

  async updateDisabilityStatus(
    benefitId: string,
    status: DisabilityBenefit['status'],
    details?: Partial<DisabilityBenefit>
  ): Promise<DisabilityBenefit | null> {
    const benefit = this.disabilityBenefits.get(benefitId);
    if (!benefit) return null;

    benefit.status = status;
    if (details) Object.assign(benefit, details);
    benefit.updatedAt = new Date();

    if (status === 'approved') {
      benefit.approvalDate = new Date();
    }

    this.disabilityBenefits.set(benefitId, benefit);
    this.saveToStorage();

    eventBus.emit('career:disability:updated', benefit);
    return benefit;
  }

  async addDisabilityDocument(
    benefitId: string,
    document: DisabilityBenefit['documents'][0]
  ): Promise<DisabilityBenefit | null> {
    const benefit = this.disabilityBenefits.get(benefitId);
    if (!benefit) return null;

    benefit.documents.push(document);
    benefit.updatedAt = new Date();

    this.disabilityBenefits.set(benefitId, benefit);
    this.saveToStorage();

    return benefit;
  }

  getDisabilityBenefits(): DisabilityBenefit[] {
    return Array.from(this.disabilityBenefits.values());
  }

  getActiveBenefits(): DisabilityBenefit[] {
    return Array.from(this.disabilityBenefits.values()).filter(b => b.status === 'receiving');
  }

  getBenefitsNeedingReview(): DisabilityBenefit[] {
    const now = new Date();
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);

    return Array.from(this.disabilityBenefits.values()).filter(b =>
      b.status === 'receiving' && b.reviewDate && new Date(b.reviewDate) <= threeMonths
    );
  }

  // ============================================================================
  // PASSIVE INCOME
  // ============================================================================

  async addPassiveIncomeStream(stream: Omit<PassiveIncomeStream, 'id' | 'yearToDateIncome' | 'incomeHistory' | 'createdAt' | 'updatedAt'>): Promise<PassiveIncomeStream> {
    const newStream: PassiveIncomeStream = {
      ...stream,
      id: `passive_${Date.now()}`,
      yearToDateIncome: 0,
      incomeHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.passiveIncomeStreams.set(newStream.id, newStream);
    this.saveToStorage();

    eventBus.emit('career:passive_income:added', newStream);
    return newStream;
  }

  async recordPassiveIncome(streamId: string, amount: number, notes?: string): Promise<PassiveIncomeStream | null> {
    const stream = this.passiveIncomeStreams.get(streamId);
    if (!stream) return null;

    const month = new Date().toISOString().slice(0, 7);
    stream.incomeHistory.push({ month, amount, notes });
    stream.yearToDateIncome += amount;
    stream.updatedAt = new Date();

    this.passiveIncomeStreams.set(streamId, stream);
    this.saveToStorage();

    eventBus.emit('finance:income', {
      amount,
      category: 'passive_income',
      source: stream.type,
      description: `${stream.name}: ${notes || 'Monthly income'}`,
      linkedId: streamId
    });

    eventBus.emit('career:passive_income:recorded', { stream, amount });
    return stream;
  }

  getPassiveIncomeStreams(): PassiveIncomeStream[] {
    return Array.from(this.passiveIncomeStreams.values());
  }

  getActivePassiveIncome(): PassiveIncomeStream[] {
    return Array.from(this.passiveIncomeStreams.values()).filter(s => s.status === 'active');
  }

  getTotalMonthlyPassiveIncome(): number {
    return Array.from(this.passiveIncomeStreams.values())
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.monthlyIncome, 0);
  }

  getLowSpoonIncomeOpportunities(): PassiveIncomeStream[] {
    return Array.from(this.passiveIncomeStreams.values())
      .filter(s => s.ongoingSpoonCost <= 2 && (s.status === 'active' || s.status === 'building'))
      .sort((a, b) => a.ongoingSpoonCost - b.ongoingSpoonCost);
  }

  private suggestIncomeOpportunities(): void {
    const lowSpoonOptions = this.getLowSpoonIncomeOpportunities();
    eventBus.emit('career:income:suggestions', {
      passive: lowSpoonOptions,
      message: 'Low energy income options available'
    });
  }

  // ============================================================================
  // JOB APPLICATIONS
  // ============================================================================

  async addJobApplication(application: Omit<JobApplication, 'id' | 'spoonCostTotal' | 'createdAt' | 'updatedAt'>): Promise<JobApplication> {
    const newApplication: JobApplication = {
      ...application,
      id: `job_${Date.now()}`,
      spoonCostTotal: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Calculate matching skills
    const mySkills = Array.from(this.skills.values()).map(s => s.name.toLowerCase());
    newApplication.matchingSkills = application.requiredSkills.filter(s => mySkills.includes(s.toLowerCase()));
    newApplication.missingSkills = application.requiredSkills.filter(s => !mySkills.includes(s.toLowerCase()));

    this.jobApplications.set(newApplication.id, newApplication);
    this.saveToStorage();

    eventBus.emit('career:application:added', newApplication);
    return newApplication;
  }

  async updateApplicationStatus(
    applicationId: string,
    status: JobApplication['status'],
    spoonCost?: number
  ): Promise<JobApplication | null> {
    const application = this.jobApplications.get(applicationId);
    if (!application) return null;

    application.status = status;
    if (spoonCost) {
      application.spoonCostTotal += spoonCost;
      eventBus.emit('health:spoons:used', {
        amount: spoonCost,
        activity: 'job_search',
        linkedId: applicationId
      });
    }
    application.updatedAt = new Date();

    if (status === 'applied') {
      application.applicationDate = new Date();
    }

    this.jobApplications.set(applicationId, application);
    this.saveToStorage();

    return application;
  }

  async addInterview(
    applicationId: string,
    interview: JobApplication['interviews'][0]
  ): Promise<JobApplication | null> {
    const application = this.jobApplications.get(applicationId);
    if (!application) return null;

    application.interviews.push(interview);
    application.spoonCostTotal += interview.energyRequired;
    application.updatedAt = new Date();

    this.jobApplications.set(applicationId, application);
    this.saveToStorage();

    // Schedule in calendar
    eventBus.emit('calendar:event:create', {
      title: `Interview: ${application.company} - ${application.position}`,
      date: interview.date,
      type: 'interview',
      energyRequired: interview.energyRequired
    });

    return application;
  }

  getJobApplications(status?: JobApplication['status']): JobApplication[] {
    let applications = Array.from(this.jobApplications.values());
    if (status) {
      applications = applications.filter(a => a.status === status);
    }
    return applications.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getAccommodationFriendlyJobs(): JobApplication[] {
    return Array.from(this.jobApplications.values()).filter(a =>
      a.accommodationFriendly || a.workArrangement === 'remote'
    );
  }

  // ============================================================================
  // SKILLS
  // ============================================================================

  async addSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
    const newSkill: Skill = {
      ...skill,
      id: `skill_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.skills.set(newSkill.id, newSkill);
    this.saveToStorage();

    eventBus.emit('career:skill:added', newSkill);
    return newSkill;
  }

  async updateSkillLevel(skillId: string, level: Skill['level']): Promise<Skill | null> {
    const skill = this.skills.get(skillId);
    if (!skill) return null;

    skill.level = level;
    skill.lastUsed = new Date();
    skill.updatedAt = new Date();

    this.skills.set(skillId, skill);
    this.saveToStorage();

    return skill;
  }

  private updateSkillFromLearning(learningData: any): void {
    const skill = Array.from(this.skills.values()).find(
      s => s.name.toLowerCase() === learningData.skill.name.toLowerCase()
    );
    if (skill && learningData.newLevel > skill.level) {
      this.updateSkillLevel(skill.id, learningData.newLevel);
    }
  }

  private linkCertificationToSkills(certData: any): void {
    // Link new certification to relevant skills
    for (const skill of this.skills.values()) {
      if (certData.linkedSkills?.includes(skill.id)) {
        skill.linkedCertifications.push(certData.id);
        this.skills.set(skill.id, skill);
      }
    }
    this.saveToStorage();
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getLowEnergySkills(): Skill[] {
    return Array.from(this.skills.values()).filter(s =>
      s.canDoOnBadDays || s.energyRequired === 'low'
    );
  }

  // ============================================================================
  // VOLUNTEER POSITIONS
  // ============================================================================

  async addVolunteerPosition(position: Omit<VolunteerPosition, 'id' | 'createdAt' | 'updatedAt'>): Promise<VolunteerPosition> {
    const newPosition: VolunteerPosition = {
      ...position,
      id: `volunteer_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.volunteerPositions.set(newPosition.id, newPosition);
    this.saveToStorage();

    eventBus.emit('career:volunteer:added', newPosition);
    return newPosition;
  }

  async updateVolunteerStatus(positionId: string, status: VolunteerPosition['status']): Promise<VolunteerPosition | null> {
    const position = this.volunteerPositions.get(positionId);
    if (!position) return null;

    position.status = status;
    if (status === 'ended') {
      position.endDate = new Date();
    }
    position.updatedAt = new Date();

    this.volunteerPositions.set(positionId, position);
    this.saveToStorage();

    return position;
  }

  getVolunteerPositions(): VolunteerPosition[] {
    return Array.from(this.volunteerPositions.values());
  }

  getActiveVolunteerPositions(): VolunteerPosition[] {
    return Array.from(this.volunteerPositions.values()).filter(v => v.status === 'active');
  }

  getLowSpoonVolunteerOpportunities(): VolunteerPosition[] {
    return Array.from(this.volunteerPositions.values())
      .filter(v => v.spoonCost <= 2 && v.flexibility === 'high')
      .sort((a, b) => a.spoonCost - b.spoonCost);
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  getCareerStats(): {
    currentEmployment: Employment | undefined;
    totalMonthlyIncome: number;
    activeAccommodations: number;
    pendingApplications: number;
    activeVolunteerHours: number;
    skillsCount: number;
    lowEnergySkillsCount: number;
    averageWorkCapacity: number;
    passiveIncomeStreams: number;
  } {
    const currentEmployment = this.getCurrentEmployment();

    // Calculate total monthly income
    let totalMonthlyIncome = 0;
    if (currentEmployment?.compensation) {
      const comp = currentEmployment.compensation;
      switch (comp.frequency) {
        case 'hourly': totalMonthlyIncome = comp.amount * (currentEmployment.schedule?.hoursPerWeek || 40) * 4; break;
        case 'weekly': totalMonthlyIncome = comp.amount * 4; break;
        case 'biweekly': totalMonthlyIncome = comp.amount * 2; break;
        case 'monthly': totalMonthlyIncome = comp.amount; break;
        case 'annual': totalMonthlyIncome = comp.amount / 12; break;
      }
    }

    // Add disability income
    for (const benefit of this.disabilityBenefits.values()) {
      if (benefit.status === 'receiving' && benefit.monthlyAmount) {
        totalMonthlyIncome += benefit.monthlyAmount;
      }
    }

    // Add passive income
    totalMonthlyIncome += this.getTotalMonthlyPassiveIncome();

    // Average work capacity
    const recentCapacity = this.getCapacityHistory(30);
    const avgCapacity = recentCapacity.length > 0
      ? recentCapacity.reduce((sum, c) => sum + c.estimatedProductiveHours, 0) / recentCapacity.length
      : 0;

    return {
      currentEmployment,
      totalMonthlyIncome: Math.round(totalMonthlyIncome),
      activeAccommodations: this.getActiveAccommodations().length,
      pendingApplications: this.getJobApplications().filter(a => ['applied', 'interviewing'].includes(a.status)).length,
      activeVolunteerHours: this.getActiveVolunteerPositions().reduce((sum, v) => sum + v.hoursPerWeek, 0),
      skillsCount: this.skills.size,
      lowEnergySkillsCount: this.getLowEnergySkills().length,
      averageWorkCapacity: Math.round(avgCapacity * 10) / 10,
      passiveIncomeStreams: this.getActivePassiveIncome().length
    };
  }

  getWorkCapacityTrend(days: number = 30): {
    dates: string[];
    hours: number[];
    average: number;
    trend: 'improving' | 'stable' | 'declining';
  } {
    const history = this.getCapacityHistory(days);

    const dates = history.map(c => new Date(c.date).toLocaleDateString());
    const hours = history.map(c => c.estimatedProductiveHours);
    const average = hours.length > 0 ? hours.reduce((a, b) => a + b, 0) / hours.length : 0;

    // Calculate trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (hours.length >= 7) {
      const firstWeek = hours.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
      const lastWeek = hours.slice(-7).reduce((a, b) => a + b, 0) / 7;
      if (lastWeek > firstWeek * 1.1) trend = 'improving';
      else if (lastWeek < firstWeek * 0.9) trend = 'declining';
    }

    return { dates, hours, average: Math.round(average * 10) / 10, trend };
  }

  generateAccommodationReport(): string {
    const accommodations = this.getActiveAccommodations();
    const employment = this.getCurrentEmployment();

    let report = '# ACCOMMODATION REPORT\n\n';
    report += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    if (employment) {
      report += `## Employment\n`;
      report += `- Employer: ${employment.employer || 'N/A'}\n`;
      report += `- Position: ${employment.jobTitle}\n`;
      report += `- Arrangement: ${employment.workArrangement}\n\n`;
    }

    report += `## Active Accommodations (${accommodations.length})\n\n`;
    for (const acc of accommodations) {
      report += `### ${acc.title}\n`;
      report += `- Type: ${acc.type}\n`;
      report += `- Status: ${acc.status}\n`;
      report += `- Implemented: ${acc.implementationDate ? new Date(acc.implementationDate).toLocaleDateString() : 'Pending'}\n`;
      report += `- Effectiveness: ${acc.effectiveness ? `${acc.effectiveness}/5` : 'Not rated'}\n`;
      report += `- Linked Symptoms: ${acc.linkedSymptoms.join(', ') || 'None specified'}\n\n`;
    }

    return report;
  }
}

// Export singleton instance
export const careerEcosystem = UnifiedCareerEcosystem.getInstance();

// Export convenience functions
export const addEmployment = (e: Parameters<typeof careerEcosystem.addEmployment>[0]) => careerEcosystem.addEmployment(e);
export const requestAccommodation = (a: Parameters<typeof careerEcosystem.requestAccommodation>[0]) => careerEcosystem.requestAccommodation(a);
export const logWorkCapacity = (c: WorkCapacity) => careerEcosystem.logWorkCapacity(c);
export const addPassiveIncomeStream = (s: Parameters<typeof careerEcosystem.addPassiveIncomeStream>[0]) => careerEcosystem.addPassiveIncomeStream(s);
export const getCareerStats = () => careerEcosystem.getCareerStats();
export const getLowEnergySkills = () => careerEcosystem.getLowEnergySkills();
