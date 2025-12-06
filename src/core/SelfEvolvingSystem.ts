// 🖤 KOL's Self-Evolving System - The Heart of the App
// "One hand on the keyboard, one hand on the altar"

import { db } from '../db/database';

export interface EvolutionEntry {
  id?: number;
  timestamp: Date;
  type: 'feature_use' | 'new_idea' | 'pattern_detected' | 'ai_suggestion' | 'user_feedback' | 'system_update';
  category: string;
  description: string;
  metadata: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'logged' | 'reviewed' | 'implemented' | 'archived';
}

export interface FeatureUsagePattern {
  featureId: string;
  featureName: string;
  totalUses: number;
  lastUsed: Date;
  averageSessionDuration: number;
  timeOfDayPattern: Record<string, number>; // hour -> count
  weekdayPattern: Record<string, number>;
  energyLevelCorrelation: number; // -1 to 1
  moodCorrelation: number;
}

export interface AIGeneratedIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  generatedFrom: string; // what triggered this idea
  confidence: number;
  implementationComplexity: 'simple' | 'moderate' | 'complex';
  potentialImpact: 'low' | 'medium' | 'high';
  relatedFeatures: string[];
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
}

class SelfEvolvingSystem {
  private static instance: SelfEvolvingSystem;
  private evolutionLog: EvolutionEntry[] = [];
  private usagePatterns: Map<string, FeatureUsagePattern> = new Map();
  private generatedIdeas: AIGeneratedIdea[] = [];
  private isLearning = true;

  private constructor() {
    this.loadState();
    this.startBackgroundAnalysis();
  }

  static getInstance(): SelfEvolvingSystem {
    if (!SelfEvolvingSystem.instance) {
      SelfEvolvingSystem.instance = new SelfEvolvingSystem();
    }
    return SelfEvolvingSystem.instance;
  }

  // Load saved state from IndexedDB
  private async loadState() {
    try {
      const savedLog = localStorage.getItem('kol_evolution_log');
      const savedPatterns = localStorage.getItem('kol_usage_patterns');
      const savedIdeas = localStorage.getItem('kol_generated_ideas');
      
      if (savedLog) this.evolutionLog = JSON.parse(savedLog);
      if (savedPatterns) {
        const patterns = JSON.parse(savedPatterns);
        this.usagePatterns = new Map(Object.entries(patterns));
      }
      if (savedIdeas) this.generatedIdeas = JSON.parse(savedIdeas);
    } catch (e) {
      console.log('🖤 Starting fresh evolution log');
    }
  }

  // Save state
  private saveState() {
    try {
      localStorage.setItem('kol_evolution_log', JSON.stringify(this.evolutionLog.slice(-1000)));
      localStorage.setItem('kol_usage_patterns', JSON.stringify(Object.fromEntries(this.usagePatterns)));
      localStorage.setItem('kol_generated_ideas', JSON.stringify(this.generatedIdeas.slice(-500)));
    } catch (e) {
      console.error('Failed to save evolution state:', e);
    }
  }

  // Track feature usage
  trackFeatureUse(featureId: string, featureName: string, metadata: Record<string, any> = {}) {
    const now = new Date();
    const hour = now.getHours().toString();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Update usage pattern
    const existing = this.usagePatterns.get(featureId) || {
      featureId,
      featureName,
      totalUses: 0,
      lastUsed: now,
      averageSessionDuration: 0,
      timeOfDayPattern: {},
      weekdayPattern: {},
      energyLevelCorrelation: 0,
      moodCorrelation: 0
    };

    existing.totalUses++;
    existing.lastUsed = now;
    existing.timeOfDayPattern[hour] = (existing.timeOfDayPattern[hour] || 0) + 1;
    existing.weekdayPattern[weekday] = (existing.weekdayPattern[weekday] || 0) + 1;
    
    this.usagePatterns.set(featureId, existing);

    // Log evolution entry
    this.logEvolution({
      timestamp: now,
      type: 'feature_use',
      category: featureName,
      description: `Used ${featureName}`,
      metadata: { ...metadata, hour, weekday },
      priority: 'low',
      status: 'logged'
    });

    // Check for patterns and generate ideas
    this.analyzeAndEvolve(featureId);
    this.saveState();
  }

  // Log any evolution event
  logEvolution(entry: Omit<EvolutionEntry, 'id'>) {
    const fullEntry: EvolutionEntry = {
      ...entry,
      id: Date.now()
    };
    this.evolutionLog.push(fullEntry);
    this.saveState();
    return fullEntry;
  }

  // Analyze usage and generate new ideas
  private async analyzeAndEvolve(triggeredBy: string) {
    if (!this.isLearning) return;

    const pattern = this.usagePatterns.get(triggeredBy);
    if (!pattern) return;

    // Generate ideas based on patterns
    const ideas: AIGeneratedIdea[] = [];

    // If feature is used heavily in morning
    const morningUse = (pattern.timeOfDayPattern['6'] || 0) + 
                       (pattern.timeOfDayPattern['7'] || 0) + 
                       (pattern.timeOfDayPattern['8'] || 0);
    if (morningUse > pattern.totalUses * 0.3) {
      ideas.push({
        id: `idea_${Date.now()}_morning`,
        title: `Morning Quick-Access for ${pattern.featureName}`,
        description: `Create a dedicated morning widget for ${pattern.featureName} since you use it frequently in the AM`,
        category: 'UX Enhancement',
        generatedFrom: `Usage pattern analysis for ${triggeredBy}`,
        confidence: 0.75,
        implementationComplexity: 'simple',
        potentialImpact: 'medium',
        relatedFeatures: [triggeredBy],
        createdAt: new Date(),
        status: 'pending'
      });
    }

    // If feature is used heavily on weekends
    const weekendUse = (pattern.weekdayPattern['Saturday'] || 0) + 
                       (pattern.weekdayPattern['Sunday'] || 0);
    if (weekendUse > pattern.totalUses * 0.4) {
      ideas.push({
        id: `idea_${Date.now()}_weekend`,
        title: `Weekend Mode for ${pattern.featureName}`,
        description: `Special weekend configuration for ${pattern.featureName}`,
        category: 'Automation',
        generatedFrom: `Weekend usage pattern for ${triggeredBy}`,
        confidence: 0.70,
        implementationComplexity: 'moderate',
        potentialImpact: 'medium',
        relatedFeatures: [triggeredBy],
        createdAt: new Date(),
        status: 'pending'
      });
    }

    // Add unique ideas
    for (const idea of ideas) {
      if (!this.generatedIdeas.find(i => i.title === idea.title)) {
        this.generatedIdeas.push(idea);
        this.logEvolution({
          timestamp: new Date(),
          type: 'ai_suggestion',
          category: idea.category,
          description: idea.title,
          metadata: { ideaId: idea.id },
          priority: 'medium',
          status: 'logged'
        });
      }
    }
  }

  // Background analysis every 30 minutes
  private startBackgroundAnalysis() {
    setInterval(() => {
      this.runComprehensiveAnalysis();
    }, 30 * 60 * 1000);
  }

  private async runComprehensiveAnalysis() {
    const topFeatures = Array.from(this.usagePatterns.values())
      .sort((a, b) => b.totalUses - a.totalUses)
      .slice(0, 10);

    // Find underutilized features that might need better discoverability
    const underutilized = Array.from(this.usagePatterns.values())
      .filter(p => p.totalUses < 3 && Date.now() - new Date(p.lastUsed).getTime() > 7 * 24 * 60 * 60 * 1000);

    if (underutilized.length > 3) {
      this.generatedIdeas.push({
        id: `idea_${Date.now()}_rediscover`,
        title: 'Feature Rediscovery Prompt',
        description: `${underutilized.length} features haven't been used in a while. Consider adding a "Rediscover" section.`,
        category: 'UX Enhancement',
        generatedFrom: 'Underutilization analysis',
        confidence: 0.80,
        implementationComplexity: 'simple',
        potentialImpact: 'high',
        relatedFeatures: underutilized.map(f => f.featureId),
        createdAt: new Date(),
        status: 'pending'
      });
    }

    this.saveState();
  }

  // Get insights for display
  getInsights() {
    const topFeatures = Array.from(this.usagePatterns.values())
      .sort((a, b) => b.totalUses - a.totalUses)
      .slice(0, 5);

    const pendingIdeas = this.generatedIdeas.filter(i => i.status === 'pending');
    const recentActivity = this.evolutionLog.slice(-20);

    return {
      topFeatures,
      pendingIdeas,
      recentActivity,
      totalEvolutionEntries: this.evolutionLog.length,
      totalGeneratedIdeas: this.generatedIdeas.length,
      learningStatus: this.isLearning ? 'Active' : 'Paused'
    };
  }

  // Get evolution stats
  getStats() {
    return {
      totalFeatureUses: Array.from(this.usagePatterns.values()).reduce((sum, p) => sum + p.totalUses, 0),
      uniqueFeaturesUsed: this.usagePatterns.size,
      totalEvolutionEntries: this.evolutionLog.length,
      totalGeneratedIdeas: this.generatedIdeas.length,
      implementedIdeas: this.generatedIdeas.filter(i => i.status === 'implemented').length,
      pendingIdeas: this.generatedIdeas.filter(i => i.status === 'pending').length
    };
  }

  // Approve an AI-generated idea
  approveIdea(ideaId: string) {
    const idea = this.generatedIdeas.find(i => i.id === ideaId);
    if (idea) {
      idea.status = 'approved';
      this.logEvolution({
        timestamp: new Date(),
        type: 'user_feedback',
        category: 'Idea Approval',
        description: `Approved: ${idea.title}`,
        metadata: { ideaId },
        priority: 'high',
        status: 'logged'
      });
      this.saveState();
    }
  }

  // Reject an AI-generated idea
  rejectIdea(ideaId: string) {
    const idea = this.generatedIdeas.find(i => i.id === ideaId);
    if (idea) {
      idea.status = 'rejected';
      this.saveState();
    }
  }

  // Mark idea as implemented
  markImplemented(ideaId: string) {
    const idea = this.generatedIdeas.find(i => i.id === ideaId);
    if (idea) {
      idea.status = 'implemented';
      this.logEvolution({
        timestamp: new Date(),
        type: 'system_update',
        category: 'Implementation',
        description: `Implemented: ${idea.title}`,
        metadata: { ideaId },
        priority: 'high',
        status: 'implemented'
      });
      this.saveState();
    }
  }

  // Toggle learning
  toggleLearning(enabled: boolean) {
    this.isLearning = enabled;
    this.saveState();
  }

  // Export evolution data
  exportData() {
    return {
      evolutionLog: this.evolutionLog,
      usagePatterns: Object.fromEntries(this.usagePatterns),
      generatedIdeas: this.generatedIdeas,
      exportedAt: new Date().toISOString()
    };
  }
}

export const selfEvolvingSystem = SelfEvolvingSystem.getInstance();
export default selfEvolvingSystem;
