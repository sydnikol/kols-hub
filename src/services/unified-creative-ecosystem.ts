/**
 * UNIFIED CREATIVE ECOSYSTEM
 *
 * Consolidates all creative/arts functionality:
 * - CreativeArtsDashboardPage, SewingStudioPage
 * - ContentMonetizationPage, ContentGenerationHub
 * - Writing, Art, Music, Crafts projects
 *
 * Cross-system connections:
 * - Finance: Creative income, supply costs
 * - Learning: Skill development for creative pursuits
 * - Entertainment: Portfolio showcase
 * - Health: Creative therapy, spoon management
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CreativeProject {
  id: string;
  title: string;
  type: 'writing' | 'art' | 'music' | 'craft' | 'sewing' | 'photography' | 'video' | 'digital' | 'other';
  subtype?: string;
  status: 'idea' | 'planning' | 'in_progress' | 'review' | 'completed' | 'published' | 'archived';
  description: string;
  inspiration?: string;
  materials: Array<{
    name: string;
    quantity: number;
    unit: string;
    cost: number;
    purchased: boolean;
    supplier?: string;
  }>;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completedDate?: Date;
    timeSpent?: number; // minutes
    notes?: string;
  }>;
  timeEstimate: number; // hours
  timeSpent: number; // minutes
  spoonCost: number;
  deadline?: Date;
  tags: string[];
  images: string[];
  linkedSkills: string[];
  linkedCourses: string[];
  monetization?: {
    platform: string;
    listingUrl?: string;
    price?: number;
    sold: boolean;
    soldDate?: Date;
    soldPrice?: number;
    buyerInfo?: string;
  };
  collaborators: string[];
  notes: string;
  rating?: number; // Self-rating 1-5
  createdAt: Date;
  updatedAt: Date;
}

export interface SewingProject extends CreativeProject {
  type: 'sewing';
  pattern?: {
    name: string;
    source: string;
    url?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    modifications: string[];
  };
  fabric: Array<{
    type: string;
    color: string;
    yards: number;
    cost: number;
    washed: boolean;
  }>;
  measurements?: Record<string, number>;
  garmentType?: string;
  size?: string;
  fittingNotes: string[];
  machineSettings?: {
    stitch: string;
    length: number;
    tension: number;
    needle: string;
  };
}

export interface WritingProject extends CreativeProject {
  type: 'writing';
  genre: string;
  wordCount: number;
  targetWordCount: number;
  chapters?: Array<{
    id: string;
    title: string;
    wordCount: number;
    status: 'outline' | 'draft' | 'revision' | 'complete';
    notes: string;
  }>;
  characters?: Array<{
    name: string;
    role: string;
    description: string;
    arc?: string;
  }>;
  outline?: string;
  drafts: Array<{
    version: number;
    date: Date;
    notes: string;
  }>;
  submissions?: Array<{
    publisher: string;
    date: Date;
    status: 'pending' | 'accepted' | 'rejected';
    response?: string;
  }>;
}

export interface ArtProject extends CreativeProject {
  type: 'art';
  medium: string;
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
    unit: 'inches' | 'cm' | 'pixels';
  };
  surface?: string;
  colorPalette?: string[];
  reference?: string;
  techniques: string[];
  layers?: Array<{
    name: string;
    completed: boolean;
    notes: string;
  }>;
}

export interface ContentPiece {
  id: string;
  type: 'blog' | 'social' | 'video' | 'podcast' | 'newsletter' | 'ebook' | 'course' | 'other';
  platform: string;
  title: string;
  description?: string;
  status: 'idea' | 'drafting' | 'editing' | 'scheduled' | 'published' | 'archived';
  content?: string;
  scheduledDate?: Date;
  publishedDate?: Date;
  url?: string;
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    subscribers?: number;
    revenue?: number;
  };
  seoKeywords?: string[];
  hashtags?: string[];
  linkedProjects: string[];
  linkedProducts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DigitalProduct {
  id: string;
  type: 'ebook' | 'course' | 'template' | 'printable' | 'preset' | 'pattern' | 'asset' | 'software' | 'other';
  title: string;
  description: string;
  price: number;
  currency: string;
  platforms: Array<{
    name: string;
    url: string;
    commission: number;
    active: boolean;
  }>;
  files: Array<{
    name: string;
    type: string;
    size: number;
    version: string;
  }>;
  sales: Array<{
    date: Date;
    platform: string;
    amount: number;
    fees: number;
    netAmount: number;
  }>;
  totalSales: number;
  totalRevenue: number;
  reviews: Array<{
    rating: number;
    comment: string;
    date: Date;
    platform: string;
  }>;
  linkedContent: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreativeSupply {
  id: string;
  category: 'fabric' | 'yarn' | 'paint' | 'paper' | 'tools' | 'notions' | 'digital' | 'other';
  name: string;
  brand?: string;
  color?: string;
  quantity: number;
  unit: string;
  location?: string;
  cost: number;
  purchaseDate?: Date;
  supplier?: string;
  reorderLevel?: number;
  notes?: string;
  linkedProjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreativeGoal {
  id: string;
  title: string;
  type: 'project_count' | 'income' | 'skill' | 'followers' | 'custom';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  milestones: Array<{
    value: number;
    reached: boolean;
    reachedDate?: Date;
    reward?: string;
  }>;
  linkedProjects: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreativeSession {
  id: string;
  projectId?: string;
  type: 'creating' | 'planning' | 'learning' | 'editing' | 'admin';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  energyBefore?: number;
  energyAfter?: number;
  mood?: 'inspired' | 'focused' | 'relaxed' | 'frustrated' | 'tired';
  accomplishments: string[];
  blockers: string[];
  notes: string;
  createdAt: Date;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'specific' | 'client';
  items: Array<{
    projectId: string;
    order: number;
    featured: boolean;
    customDescription?: string;
  }>;
  theme?: string;
  publicUrl?: string;
  password?: string;
  views: number;
  lastViewed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// UNIFIED CREATIVE ECOSYSTEM CLASS
// ============================================================================

class UnifiedCreativeEcosystem {
  private static instance: UnifiedCreativeEcosystem;
  private projects: Map<string, CreativeProject> = new Map();
  private contentPieces: Map<string, ContentPiece> = new Map();
  private digitalProducts: Map<string, DigitalProduct> = new Map();
  private supplies: Map<string, CreativeSupply> = new Map();
  private goals: Map<string, CreativeGoal> = new Map();
  private sessions: CreativeSession[] = [];
  private portfolios: Map<string, Portfolio> = new Map();

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
  }

  static getInstance(): UnifiedCreativeEcosystem {
    if (!UnifiedCreativeEcosystem.instance) {
      UnifiedCreativeEcosystem.instance = new UnifiedCreativeEcosystem();
    }
    return UnifiedCreativeEcosystem.instance;
  }

  private initializeEventListeners(): void {
    // Health integration - creative activities affect energy
    eventBus.on('health:energy:low', () => {
      console.log('[Creative] Low energy - suggesting low-spoon creative activities');
    });

    // Finance integration - track creative income
    eventBus.on('finance:income:needed', () => {
      this.suggestMonetizationOpportunities();
    });

    // Learning integration - skill improvements
    eventBus.on('learning:skill:levelup', (data: any) => {
      this.updateLinkedProjects(data.skill);
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('unified_creative_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.projects) data.projects.forEach((p: CreativeProject) => this.projects.set(p.id, p));
        if (data.contentPieces) data.contentPieces.forEach((c: ContentPiece) => this.contentPieces.set(c.id, c));
        if (data.digitalProducts) data.digitalProducts.forEach((d: DigitalProduct) => this.digitalProducts.set(d.id, d));
        if (data.supplies) data.supplies.forEach((s: CreativeSupply) => this.supplies.set(s.id, s));
        if (data.goals) data.goals.forEach((g: CreativeGoal) => this.goals.set(g.id, g));
        if (data.sessions) this.sessions = data.sessions;
        if (data.portfolios) data.portfolios.forEach((p: Portfolio) => this.portfolios.set(p.id, p));
      }
    } catch (error) {
      console.error('[Creative] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        projects: Array.from(this.projects.values()),
        contentPieces: Array.from(this.contentPieces.values()),
        digitalProducts: Array.from(this.digitalProducts.values()),
        supplies: Array.from(this.supplies.values()),
        goals: Array.from(this.goals.values()),
        sessions: this.sessions.slice(-500),
        portfolios: Array.from(this.portfolios.values())
      };
      localStorage.setItem('unified_creative_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[Creative] Failed to save to storage:', error);
    }
  }

  // ============================================================================
  // PROJECT MANAGEMENT
  // ============================================================================

  async createProject(project: Omit<CreativeProject, 'id' | 'timeSpent' | 'createdAt' | 'updatedAt'>): Promise<CreativeProject> {
    const newProject: CreativeProject = {
      ...project,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timeSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.set(newProject.id, newProject);
    this.saveToStorage();

    // Track material costs
    const totalMaterialCost = newProject.materials.reduce((sum, m) => sum + m.cost, 0);
    if (totalMaterialCost > 0) {
      eventBus.emit('finance:expense', {
        amount: totalMaterialCost,
        category: 'creative_supplies',
        description: `Materials for: ${newProject.title}`,
        linkedId: newProject.id
      });
    }

    eventBus.emit('creative:project:created', newProject);
    return newProject;
  }

  async updateProjectStatus(projectId: string, status: CreativeProject['status']): Promise<CreativeProject | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    project.status = status;
    project.updatedAt = new Date();

    if (status === 'completed') {
      eventBus.emit('creative:project:completed', project);
      this.updateGoalProgress('project_count', 1);
    }

    if (status === 'published' && project.monetization?.price) {
      eventBus.emit('creative:project:published', project);
    }

    this.projects.set(projectId, project);
    this.saveToStorage();

    return project;
  }

  async completeProjectStep(projectId: string, stepId: string, timeSpent: number, notes?: string): Promise<CreativeProject | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const step = project.steps.find(s => s.id === stepId);
    if (step) {
      step.completed = true;
      step.completedDate = new Date();
      step.timeSpent = timeSpent;
      if (notes) step.notes = notes;

      project.timeSpent += timeSpent;
      project.updatedAt = new Date();

      // Check if all steps completed
      const allComplete = project.steps.every(s => s.completed);
      if (allComplete && project.status === 'in_progress') {
        project.status = 'review';
      }

      this.projects.set(projectId, project);
      this.saveToStorage();

      eventBus.emit('creative:step:completed', { project, step });
    }

    return project;
  }

  async recordProjectSale(projectId: string, saleInfo: NonNullable<CreativeProject['monetization']>): Promise<CreativeProject | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    project.monetization = {
      ...project.monetization,
      ...saleInfo,
      sold: true,
      soldDate: new Date()
    };
    project.updatedAt = new Date();

    this.projects.set(projectId, project);
    this.saveToStorage();

    // Emit finance event
    if (saleInfo.soldPrice) {
      eventBus.emit('finance:income', {
        amount: saleInfo.soldPrice,
        category: 'creative_sales',
        description: `Sold: ${project.title}`,
        linkedId: projectId
      });
      this.updateGoalProgress('income', saleInfo.soldPrice);
    }

    eventBus.emit('creative:project:sold', project);
    return project;
  }

  getProject(projectId: string): CreativeProject | undefined {
    return this.projects.get(projectId);
  }

  getAllProjects(): CreativeProject[] {
    return Array.from(this.projects.values());
  }

  getProjectsByStatus(status: CreativeProject['status']): CreativeProject[] {
    return Array.from(this.projects.values()).filter(p => p.status === status);
  }

  getProjectsByType(type: CreativeProject['type']): CreativeProject[] {
    return Array.from(this.projects.values()).filter(p => p.type === type);
  }

  // ============================================================================
  // CONTENT MANAGEMENT
  // ============================================================================

  async createContent(content: Omit<ContentPiece, 'id' | 'metrics' | 'createdAt' | 'updatedAt'>): Promise<ContentPiece> {
    const newContent: ContentPiece = {
      ...content,
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metrics: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.contentPieces.set(newContent.id, newContent);
    this.saveToStorage();

    eventBus.emit('creative:content:created', newContent);
    return newContent;
  }

  async publishContent(contentId: string, url: string): Promise<ContentPiece | null> {
    const content = this.contentPieces.get(contentId);
    if (!content) return null;

    content.status = 'published';
    content.publishedDate = new Date();
    content.url = url;
    content.updatedAt = new Date();

    this.contentPieces.set(contentId, content);
    this.saveToStorage();

    eventBus.emit('creative:content:published', content);
    return content;
  }

  async updateContentMetrics(contentId: string, metrics: Partial<ContentPiece['metrics']>): Promise<ContentPiece | null> {
    const content = this.contentPieces.get(contentId);
    if (!content) return null;

    content.metrics = { ...content.metrics, ...metrics };
    content.updatedAt = new Date();

    if (metrics.revenue && metrics.revenue > 0) {
      eventBus.emit('finance:income', {
        amount: metrics.revenue,
        category: 'content_monetization',
        description: `Content revenue: ${content.title}`,
        linkedId: contentId
      });
    }

    this.contentPieces.set(contentId, content);
    this.saveToStorage();

    return content;
  }

  getAllContent(): ContentPiece[] {
    return Array.from(this.contentPieces.values());
  }

  getContentByPlatform(platform: string): ContentPiece[] {
    return Array.from(this.contentPieces.values()).filter(c => c.platform === platform);
  }

  // ============================================================================
  // DIGITAL PRODUCTS
  // ============================================================================

  async createDigitalProduct(product: Omit<DigitalProduct, 'id' | 'sales' | 'totalSales' | 'totalRevenue' | 'reviews' | 'createdAt' | 'updatedAt'>): Promise<DigitalProduct> {
    const newProduct: DigitalProduct = {
      ...product,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sales: [],
      totalSales: 0,
      totalRevenue: 0,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.digitalProducts.set(newProduct.id, newProduct);
    this.saveToStorage();

    eventBus.emit('creative:product:created', newProduct);
    return newProduct;
  }

  async recordProductSale(productId: string, sale: Omit<DigitalProduct['sales'][0], 'netAmount'>): Promise<DigitalProduct | null> {
    const product = this.digitalProducts.get(productId);
    if (!product) return null;

    const netAmount = sale.amount - sale.fees;
    product.sales.push({ ...sale, netAmount });
    product.totalSales++;
    product.totalRevenue += netAmount;
    product.updatedAt = new Date();

    this.digitalProducts.set(productId, product);
    this.saveToStorage();

    eventBus.emit('finance:income', {
      amount: netAmount,
      category: 'digital_products',
      source: 'passive',
      description: `${product.title} sale on ${sale.platform}`,
      linkedId: productId
    });

    this.updateGoalProgress('income', netAmount);
    eventBus.emit('creative:product:sale', { product, sale });

    return product;
  }

  async addProductReview(productId: string, review: DigitalProduct['reviews'][0]): Promise<DigitalProduct | null> {
    const product = this.digitalProducts.get(productId);
    if (!product) return null;

    product.reviews.push(review);
    product.updatedAt = new Date();

    this.digitalProducts.set(productId, product);
    this.saveToStorage();

    return product;
  }

  getAllDigitalProducts(): DigitalProduct[] {
    return Array.from(this.digitalProducts.values());
  }

  getProductRevenue(productId: string, period?: { from: Date; to: Date }): number {
    const product = this.digitalProducts.get(productId);
    if (!product) return 0;

    let sales = product.sales;
    if (period) {
      sales = sales.filter(s => new Date(s.date) >= period.from && new Date(s.date) <= period.to);
    }

    return sales.reduce((sum, s) => sum + s.netAmount, 0);
  }

  // ============================================================================
  // SUPPLY INVENTORY
  // ============================================================================

  async addSupply(supply: Omit<CreativeSupply, 'id' | 'linkedProjects' | 'createdAt' | 'updatedAt'>): Promise<CreativeSupply> {
    const newSupply: CreativeSupply = {
      ...supply,
      id: `supply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      linkedProjects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.supplies.set(newSupply.id, newSupply);
    this.saveToStorage();

    if (supply.cost > 0) {
      eventBus.emit('finance:expense', {
        amount: supply.cost,
        category: 'creative_supplies',
        description: `${supply.name} (${supply.category})`,
        linkedId: newSupply.id
      });
    }

    return newSupply;
  }

  async updateSupplyQuantity(supplyId: string, quantityChange: number, projectId?: string): Promise<CreativeSupply | null> {
    const supply = this.supplies.get(supplyId);
    if (!supply) return null;

    supply.quantity += quantityChange;
    supply.updatedAt = new Date();

    if (projectId && !supply.linkedProjects.includes(projectId)) {
      supply.linkedProjects.push(projectId);
    }

    // Check reorder level
    if (supply.reorderLevel && supply.quantity <= supply.reorderLevel) {
      eventBus.emit('creative:supply:low', supply);
    }

    this.supplies.set(supplyId, supply);
    this.saveToStorage();

    return supply;
  }

  getAllSupplies(): CreativeSupply[] {
    return Array.from(this.supplies.values());
  }

  getSuppliesByCategory(category: CreativeSupply['category']): CreativeSupply[] {
    return Array.from(this.supplies.values()).filter(s => s.category === category);
  }

  getLowStockSupplies(): CreativeSupply[] {
    return Array.from(this.supplies.values()).filter(s => s.reorderLevel && s.quantity <= s.reorderLevel);
  }

  // ============================================================================
  // CREATIVE SESSIONS
  // ============================================================================

  async startSession(session: Omit<CreativeSession, 'id' | 'endTime' | 'duration' | 'accomplishments' | 'blockers' | 'createdAt'>): Promise<CreativeSession> {
    const newSession: CreativeSession = {
      ...session,
      id: `session_${Date.now()}`,
      accomplishments: [],
      blockers: [],
      createdAt: new Date()
    };

    this.sessions.push(newSession);
    this.saveToStorage();

    if (session.energyBefore) {
      eventBus.emit('health:spoons:used', {
        amount: 2,
        activity: 'creative_session',
        linkedId: newSession.id
      });
    }

    eventBus.emit('creative:session:started', newSession);
    return newSession;
  }

  async endSession(
    sessionId: string,
    accomplishments: string[],
    blockers: string[],
    energyAfter?: number,
    notes?: string
  ): Promise<CreativeSession | null> {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return null;

    const session = this.sessions[sessionIndex];
    session.endTime = new Date();
    session.duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000);
    session.accomplishments = accomplishments;
    session.blockers = blockers;
    session.energyAfter = energyAfter;
    if (notes) session.notes = notes;

    this.sessions[sessionIndex] = session;

    // Update project time
    if (session.projectId) {
      const project = this.projects.get(session.projectId);
      if (project) {
        project.timeSpent += session.duration;
        this.projects.set(session.projectId, project);
      }
    }

    this.saveToStorage();

    eventBus.emit('creative:session:completed', session);
    return session;
  }

  getSessionHistory(limit?: number): CreativeSession[] {
    const sessions = [...this.sessions].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    return limit ? sessions.slice(0, limit) : sessions;
  }

  getTotalCreativeTime(period?: { from: Date; to: Date }): number {
    let sessions = this.sessions.filter(s => s.duration);

    if (period) {
      sessions = sessions.filter(s => new Date(s.startTime) >= period.from && new Date(s.startTime) <= period.to);
    }

    return sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  }

  // ============================================================================
  // GOALS
  // ============================================================================

  async createGoal(goal: Omit<CreativeGoal, 'id' | 'current' | 'createdAt' | 'updatedAt'>): Promise<CreativeGoal> {
    const newGoal: CreativeGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      current: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.goals.set(newGoal.id, newGoal);
    this.saveToStorage();

    eventBus.emit('creative:goal:created', newGoal);
    return newGoal;
  }

  private updateGoalProgress(type: CreativeGoal['type'], amount: number): void {
    Array.from(this.goals.values())
      .filter(g => g.type === type && g.status === 'active')
      .forEach(goal => {
        goal.current += amount;
        goal.updatedAt = new Date();

        // Check milestones
        goal.milestones.forEach(m => {
          if (!m.reached && goal.current >= m.value) {
            m.reached = true;
            m.reachedDate = new Date();
            eventBus.emit('creative:milestone:reached', { goal, milestone: m });
          }
        });

        // Check completion
        if (goal.current >= goal.target && goal.status !== 'completed') {
          goal.status = 'completed';
          eventBus.emit('creative:goal:completed', goal);
        }

        this.goals.set(goal.id, goal);
      });

    this.saveToStorage();
  }

  getAllGoals(): CreativeGoal[] {
    return Array.from(this.goals.values());
  }

  getActiveGoals(): CreativeGoal[] {
    return Array.from(this.goals.values()).filter(g => g.status === 'active');
  }

  // ============================================================================
  // PORTFOLIO
  // ============================================================================

  async createPortfolio(portfolio: Omit<Portfolio, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> {
    const newPortfolio: Portfolio = {
      ...portfolio,
      id: `portfolio_${Date.now()}`,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.portfolios.set(newPortfolio.id, newPortfolio);
    this.saveToStorage();

    return newPortfolio;
  }

  async addToPortfolio(portfolioId: string, projectId: string, featured: boolean = false): Promise<Portfolio | null> {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return null;

    const maxOrder = Math.max(0, ...portfolio.items.map(i => i.order));
    portfolio.items.push({
      projectId,
      order: maxOrder + 1,
      featured
    });
    portfolio.updatedAt = new Date();

    this.portfolios.set(portfolioId, portfolio);
    this.saveToStorage();

    return portfolio;
  }

  getAllPortfolios(): Portfolio[] {
    return Array.from(this.portfolios.values());
  }

  // ============================================================================
  // ANALYTICS & INSIGHTS
  // ============================================================================

  getCreativeStats(): {
    totalProjects: number;
    completedProjects: number;
    totalTimeSpent: number;
    totalRevenue: number;
    productsSold: number;
    contentPublished: number;
    activeGoals: number;
    topCategories: Array<{ category: string; count: number }>;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
  } {
    const projects = Array.from(this.projects.values());
    const products = Array.from(this.digitalProducts.values());
    const content = Array.from(this.contentPieces.values());

    // Revenue from projects
    const projectRevenue = projects
      .filter(p => p.monetization?.sold)
      .reduce((sum, p) => sum + (p.monetization?.soldPrice || 0), 0);

    // Revenue from digital products
    const productRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);

    // Revenue from content
    const contentRevenue = content.reduce((sum, c) => sum + (c.metrics.revenue || 0), 0);

    // Category counts
    const categoryMap: Record<string, number> = {};
    projects.forEach(p => {
      categoryMap[p.type] = (categoryMap[p.type] || 0) + 1;
    });
    const topCategories = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Monthly revenue
    const monthlyMap: Record<string, number> = {};
    products.forEach(p => {
      p.sales.forEach(s => {
        const month = new Date(s.date).toISOString().slice(0, 7);
        monthlyMap[month] = (monthlyMap[month] || 0) + s.netAmount;
      });
    });
    const monthlyRevenue = Object.entries(monthlyMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    return {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed' || p.status === 'published').length,
      totalTimeSpent: this.getTotalCreativeTime(),
      totalRevenue: projectRevenue + productRevenue + contentRevenue,
      productsSold: products.reduce((sum, p) => sum + p.totalSales, 0),
      contentPublished: content.filter(c => c.status === 'published').length,
      activeGoals: this.getActiveGoals().length,
      topCategories,
      monthlyRevenue
    };
  }

  suggestMonetizationOpportunities(): Array<{
    projectId: string;
    title: string;
    suggestion: string;
    estimatedValue: number;
  }> {
    const suggestions: Array<{
      projectId: string;
      title: string;
      suggestion: string;
      estimatedValue: number;
    }> = [];

    // Find completed projects without monetization
    Array.from(this.projects.values())
      .filter(p => (p.status === 'completed' || p.status === 'published') && !p.monetization?.sold)
      .forEach(p => {
        suggestions.push({
          projectId: p.id,
          title: p.title,
          suggestion: `List "${p.title}" for sale on Etsy or your website`,
          estimatedValue: p.materials.reduce((sum, m) => sum + m.cost, 0) * 3 // 3x material cost
        });
      });

    // Find popular content that could be expanded
    Array.from(this.contentPieces.values())
      .filter(c => c.status === 'published' && (c.metrics.views || 0) > 1000)
      .forEach(c => {
        suggestions.push({
          projectId: c.id,
          title: c.title,
          suggestion: `Create a course or ebook expanding on "${c.title}"`,
          estimatedValue: 97 // Typical digital product price
        });
      });

    return suggestions;
  }

  getLowSpoonActivities(): CreativeProject[] {
    return Array.from(this.projects.values())
      .filter(p => p.spoonCost <= 2 && p.status === 'in_progress')
      .sort((a, b) => a.spoonCost - b.spoonCost);
  }

  private updateLinkedProjects(skill: any): void {
    // Update projects linked to improved skills
    Array.from(this.projects.values())
      .filter(p => p.linkedSkills.includes(skill.id))
      .forEach(p => {
        console.log(`[Creative] Skill ${skill.name} improved - affects project ${p.title}`);
      });
  }
}

// Export singleton instance
export const creativeEcosystem = UnifiedCreativeEcosystem.getInstance();

// Export convenience functions
export const createProject = (p: Parameters<typeof creativeEcosystem.createProject>[0]) => creativeEcosystem.createProject(p);
export const createContent = (c: Parameters<typeof creativeEcosystem.createContent>[0]) => creativeEcosystem.createContent(c);
export const createDigitalProduct = (p: Parameters<typeof creativeEcosystem.createDigitalProduct>[0]) => creativeEcosystem.createDigitalProduct(p);
export const getCreativeStats = () => creativeEcosystem.getCreativeStats();
export const getAllProjects = () => creativeEcosystem.getAllProjects();
