/**
 * FEATURE EVOLUTION ENGINE
 *
 * Autonomously generates new feature ideas, learns from usage patterns,
 * and suggests improvements based on cross-system correlations.
 *
 * "The system that builds itself"
 */

import { db } from '../utils/database';
import { kolSystem } from './UnifiedKolSystem';
import { seedLoader } from './UnifiedSeedLoader';

// ============================================
// TYPES
// ============================================

export interface GeneratedFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  reasoning: string;
  confidence: number;
  sourcePatterns: string[];
  suggestedConnections: string[];
  estimatedValue: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface UsagePattern {
  feature: string;
  frequency: number;
  lastUsed: Date;
  averageSessionTime: number;
  correlatedWith: string[];
}

export interface EvolutionMetrics {
  featuresGenerated: number;
  featuresImplemented: number;
  patternsDetected: number;
  connectionsCreated: number;
  lastEvolution: Date;
}

// ============================================
// FEATURE TEMPLATES
// ============================================

const FEATURE_TEMPLATES = {
  health: [
    { template: 'Track {metric} with {visualization}', examples: ['hydration with progress bar', 'pain levels with body map', 'energy with spoon dial'] },
    { template: '{alert} when {condition}', examples: ['Notify when sodium is low', 'Alert when HR exceeds threshold', 'Remind when medication due'] },
    { template: 'Correlate {dataA} with {dataB}', examples: ['pain with weather', 'energy with sleep', 'mood with activity'] },
    { template: 'Predict {outcome} based on {patterns}', examples: ['flare days based on triggers', 'good days based on routines', 'crash risk based on activity'] }
  ],
  finance: [
    { template: 'Automate {action} for {platform}', examples: ['content posting for Medium', 'affiliate tracking for Amazon', 'withdrawals for PayPal'] },
    { template: 'Optimize {metric} by {method}', examples: ['income by diversification', 'expenses by categorization', 'taxes by deduction tracking'] },
    { template: 'Alert when {threshold} reached', examples: ['withdrawal minimum met', 'monthly goal achieved', 'expense limit exceeded'] }
  ],
  creative: [
    { template: 'Generate {content} in style of {style}', examples: ['art prompts in gothic style', 'writing ideas in dark romance', 'patterns in afrofuturist aesthetic'] },
    { template: 'Organize {collection} by {criteria}', examples: ['art ideas by mood', 'sewing patterns by difficulty', 'writing prompts by genre'] },
    { template: 'Suggest {item} for {context}', examples: ['colors for current mood', 'patterns for skill level', 'techniques for available time'] }
  ],
  automation: [
    { template: 'When {trigger}, then {action}', examples: ['low energy then dim lights', 'good day then suggest creative work', 'appointment soon then prep mode'] },
    { template: 'Sync {source} with {destination}', examples: ['calendar with health logs', 'income with budget', 'ideas with todo list'] },
    { template: 'Schedule {task} based on {condition}', examples: ['reminders based on energy', 'activities based on weather', 'work based on health score'] }
  ],
  learning: [
    { template: 'Track progress on {skill}', examples: ['Japanese language', 'Python coding', 'sewing techniques'] },
    { template: 'Suggest {resource} for {goal}', examples: ['courses for certification', 'tutorials for new skill', 'practice for mastery'] },
    { template: 'Connect {learning} to {outcome}', examples: ['skill to income stream', 'certification to resume', 'knowledge to content'] }
  ]
};

// ============================================
// FEATURE EVOLUTION ENGINE CLASS
// ============================================

class FeatureEvolutionEngine {
  private generatedFeatures: GeneratedFeature[] = [];
  private usagePatterns: Map<string, UsagePattern> = new Map();
  private metrics: EvolutionMetrics = {
    featuresGenerated: 0,
    featuresImplemented: 0,
    patternsDetected: 0,
    connectionsCreated: 0,
    lastEvolution: new Date()
  };
  private isRunning = false;

  // ============================================
  // INITIALIZATION
  // ============================================

  async start(): Promise<void> {
    if (this.isRunning) return;

    console.log('🧬 Starting Feature Evolution Engine...');
    this.isRunning = true;

    // Load existing patterns
    await this.loadPatterns();

    // Start evolution cycles
    this.startEvolutionCycle();

    // Listen to system events
    this.listenToSystemEvents();

    console.log('   ✅ Feature Evolution Engine running');
  }

  private async loadPatterns(): Promise<void> {
    try {
      // Load activity logs to build usage patterns
      const logs = await db.activityLog.orderBy('timestamp').reverse().limit(500).toArray();

      logs.forEach(log => {
        const pattern = this.usagePatterns.get(log.type) || {
          feature: log.type,
          frequency: 0,
          lastUsed: new Date(0),
          averageSessionTime: 0,
          correlatedWith: []
        };

        pattern.frequency++;
        if (log.timestamp > pattern.lastUsed) {
          pattern.lastUsed = log.timestamp;
        }

        this.usagePatterns.set(log.type, pattern);
      });

      this.metrics.patternsDetected = this.usagePatterns.size;
    } catch (error) {
      console.warn('Could not load patterns:', error);
    }
  }

  // ============================================
  // EVOLUTION CYCLE
  // ============================================

  private startEvolutionCycle(): void {
    // Run evolution every 4 hours
    setInterval(() => this.evolve(), 4 * 60 * 60 * 1000);

    // Initial evolution after 1 minute
    setTimeout(() => this.evolve(), 60 * 1000);
  }

  private async evolve(): Promise<void> {
    console.log('🦋 Evolution cycle starting...');

    try {
      // Analyze current state
      const state = kolSystem.getState();
      const seedStats = seedLoader.getStats();

      // Generate new features based on patterns
      const newFeatures = await this.generateFeatures(state, seedStats);

      // Detect new patterns
      const patterns = await this.detectPatterns();

      // Suggest new connections
      const connections = this.suggestConnections(patterns);

      // Update metrics
      this.metrics.featuresGenerated += newFeatures.length;
      this.metrics.patternsDetected = this.usagePatterns.size;
      this.metrics.connectionsCreated += connections.length;
      this.metrics.lastEvolution = new Date();

      // Log evolution
      await db.logEvolution('Evolution cycle complete', 'evolution', {
        newFeatures: newFeatures.length,
        patterns: patterns.length,
        connections: connections.length
      });

      console.log(`   ✅ Generated ${newFeatures.length} features, detected ${patterns.length} patterns`);

    } catch (error) {
      console.error('Evolution cycle error:', error);
    }
  }

  // ============================================
  // FEATURE GENERATION
  // ============================================

  private async generateFeatures(state: any, seedStats: any): Promise<GeneratedFeature[]> {
    const features: GeneratedFeature[] = [];

    // Analyze gaps in current feature set
    const gaps = this.identifyGaps();

    // Generate features for each gap
    for (const gap of gaps) {
      const feature = this.generateFeatureForGap(gap);
      if (feature) {
        features.push(feature);
        this.generatedFeatures.push(feature);
      }
    }

    // Generate features from usage patterns
    const patternFeatures = this.generateFromPatterns();
    features.push(...patternFeatures);

    // Generate cross-system features
    const crossFeatures = this.generateCrossSystemFeatures();
    features.push(...crossFeatures);

    // Store features in database
    for (const feature of features) {
      await db.features.add({
        title: feature.title,
        description: feature.description,
        category: feature.category,
        priority: feature.estimatedValue === 'high' ? 'P1' : feature.estimatedValue === 'medium' ? 'P2' : 'P3',
        status: 'Backlog',
        notes: `AI Generated: ${feature.reasoning}`,
        createdAt: feature.createdAt,
        updatedAt: feature.createdAt
      });
    }

    return features;
  }

  private identifyGaps(): { category: string; type: string; reason: string }[] {
    const gaps: { category: string; type: string; reason: string }[] = [];

    // Check for underutilized categories
    const categoryUsage = new Map<string, number>();
    this.usagePatterns.forEach(pattern => {
      const category = pattern.feature.split('-')[0] || 'general';
      categoryUsage.set(category, (categoryUsage.get(category) || 0) + pattern.frequency);
    });

    // Find categories with low usage relative to available features
    const seedCategories = seedLoader.getCategories();
    seedCategories.forEach(category => {
      const usage = categoryUsage.get(category) || 0;
      const available = seedLoader.getByCategory(category).length;

      if (available > 10 && usage < 5) {
        gaps.push({
          category,
          type: 'underutilized',
          reason: `${available} ideas available but only ${usage} uses - needs better discovery`
        });
      }
    });

    // Check for missing cross-system connections
    const connections = kolSystem.getConnections();
    const connectedModules = new Set(connections.flatMap(c => [c.fromModule, c.toModule]));
    const allModules = ['health', 'finance', 'creative', 'learning', 'smartHome', 'relationships'];

    allModules.forEach(module => {
      if (!connectedModules.has(module)) {
        gaps.push({
          category: module,
          type: 'disconnected',
          reason: `${module} module has no cross-system connections`
        });
      }
    });

    return gaps.slice(0, 5); // Limit to 5 gaps per cycle
  }

  private generateFeatureForGap(gap: { category: string; type: string; reason: string }): GeneratedFeature | null {
    const templates = FEATURE_TEMPLATES[gap.category as keyof typeof FEATURE_TEMPLATES] || FEATURE_TEMPLATES.automation;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const example = template.examples[Math.floor(Math.random() * template.examples.length)];

    // Generate feature from template
    const title = template.template.replace(/\{[^}]+\}/g, (match) => {
      const parts = example.split(' ');
      const index = template.template.split('{').length - template.template.split(match).length;
      return parts[index] || match;
    });

    return {
      id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${gap.category.charAt(0).toUpperCase() + gap.category.slice(1)}: ${example}`,
      description: `Auto-generated to address: ${gap.reason}`,
      category: gap.category,
      reasoning: gap.reason,
      confidence: 0.7,
      sourcePatterns: [gap.type],
      suggestedConnections: this.suggestConnectionsForFeature(gap.category),
      estimatedValue: gap.type === 'disconnected' ? 'high' : 'medium',
      createdAt: new Date()
    };
  }

  private generateFromPatterns(): GeneratedFeature[] {
    const features: GeneratedFeature[] = [];

    // Find high-frequency patterns
    const sorted = Array.from(this.usagePatterns.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    sorted.forEach(pattern => {
      if (pattern.frequency > 10) {
        features.push({
          id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `Enhanced ${pattern.feature} Dashboard`,
          description: `You use ${pattern.feature} frequently - adding shortcuts and quick actions`,
          category: pattern.feature.split('-')[0] || 'general',
          reasoning: `High usage frequency: ${pattern.frequency} times`,
          confidence: 0.85,
          sourcePatterns: ['high-frequency'],
          suggestedConnections: pattern.correlatedWith,
          estimatedValue: 'high',
          createdAt: new Date()
        });
      }
    });

    return features;
  }

  private generateCrossSystemFeatures(): GeneratedFeature[] {
    const features: GeneratedFeature[] = [];

    // Look for patterns that correlate across systems
    const learningEvents = kolSystem.getLearningHistory();

    const correlations = learningEvents.filter(e => e.type === 'correlation');
    const uniqueCorrelations = new Set(correlations.map(c => `${c.source}-${c.data?.pattern}`));

    uniqueCorrelations.forEach(correlation => {
      const [source, pattern] = correlation.split('-');
      if (pattern && !this.generatedFeatures.some(f => f.title.includes(pattern))) {
        features.push({
          id: `cross-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `${pattern} Integration`,
          description: `Detected correlation in ${source} - automating response`,
          category: source,
          reasoning: 'Cross-system correlation detected',
          confidence: 0.75,
          sourcePatterns: ['cross-system'],
          suggestedConnections: [source, 'automation'],
          estimatedValue: 'medium',
          createdAt: new Date()
        });
      }
    });

    return features.slice(0, 3); // Limit cross-system features
  }

  // ============================================
  // PATTERN DETECTION
  // ============================================

  private async detectPatterns(): Promise<any[]> {
    const patterns: any[] = [];

    // Analyze time-based patterns
    const timePatterns = this.analyzeTimePatterns();
    patterns.push(...timePatterns);

    // Analyze sequence patterns
    const sequencePatterns = await this.analyzeSequencePatterns();
    patterns.push(...sequencePatterns);

    return patterns;
  }

  private analyzeTimePatterns(): any[] {
    const patterns: any[] = [];

    // Group usage by hour of day
    const hourlyUsage = new Map<number, number>();
    this.usagePatterns.forEach(pattern => {
      const hour = pattern.lastUsed.getHours();
      hourlyUsage.set(hour, (hourlyUsage.get(hour) || 0) + pattern.frequency);
    });

    // Find peak hours
    const sorted = Array.from(hourlyUsage.entries()).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      patterns.push({
        type: 'peak-usage-hour',
        hour: sorted[0][0],
        frequency: sorted[0][1],
        insight: `Peak usage at ${sorted[0][0]}:00`
      });
    }

    return patterns;
  }

  private async analyzeSequencePatterns(): Promise<any[]> {
    const patterns: any[] = [];

    try {
      // Get recent activity sequence
      const logs = await db.activityLog.orderBy('timestamp').reverse().limit(100).toArray();

      // Find common sequences
      const sequences = new Map<string, number>();
      for (let i = 0; i < logs.length - 1; i++) {
        const sequence = `${logs[i].type}->${logs[i + 1].type}`;
        sequences.set(sequence, (sequences.get(sequence) || 0) + 1);
      }

      // Report frequent sequences
      sequences.forEach((count, sequence) => {
        if (count >= 3) {
          patterns.push({
            type: 'action-sequence',
            sequence,
            count,
            insight: `Users often do ${sequence} (${count} times)`
          });
        }
      });
    } catch (error) {
      console.warn('Could not analyze sequences:', error);
    }

    return patterns;
  }

  // ============================================
  // CONNECTION SUGGESTIONS
  // ============================================

  private suggestConnections(patterns: any[]): any[] {
    const suggestions: any[] = [];

    patterns.forEach(pattern => {
      if (pattern.type === 'action-sequence' && pattern.count >= 3) {
        const [from, to] = pattern.sequence.split('->');
        suggestions.push({
          fromModule: from,
          toModule: to,
          trigger: `${from}Complete`,
          action: `prepare${to.charAt(0).toUpperCase() + to.slice(1)}`,
          reason: `Detected frequent sequence: ${pattern.sequence}`
        });
      }
    });

    // Add connections to system
    suggestions.forEach(suggestion => {
      kolSystem.addConnection({
        fromModule: suggestion.fromModule,
        toModule: suggestion.toModule,
        trigger: suggestion.trigger,
        action: suggestion.action,
        enabled: true
      });
    });

    return suggestions;
  }

  private suggestConnectionsForFeature(category: string): string[] {
    const connectionMap: Record<string, string[]> = {
      health: ['smartHome', 'notifications', 'calendar'],
      finance: ['notifications', 'calendar', 'learning'],
      creative: ['contentMonetization', 'passiveIncome', 'gallery'],
      learning: ['resume', 'passiveIncome', 'certifications'],
      smartHome: ['health', 'calendar', 'automation'],
      relationships: ['calendar', 'notifications', 'reminders']
    };

    return connectionMap[category] || ['automation', 'notifications'];
  }

  // ============================================
  // SYSTEM EVENT LISTENING
  // ============================================

  private listenToSystemEvents(): void {
    // Log usage when pages are viewed
    if (typeof window !== 'undefined') {
      const originalPushState = history.pushState;
      history.pushState = function(...args) {
        const result = originalPushState.apply(this, args);

        // Log navigation
        const path = args[2] as string;
        if (path) {
          db.activityLog.add({
            type: path.replace(/\//g, '-').slice(1) || 'home',
            timestamp: new Date(),
            metadata: { url: path }
          }).catch(() => {});
        }

        return result;
      };
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  getGeneratedFeatures(): GeneratedFeature[] {
    return [...this.generatedFeatures];
  }

  getMetrics(): EvolutionMetrics {
    return { ...this.metrics };
  }

  getUsagePatterns(): UsagePattern[] {
    return Array.from(this.usagePatterns.values());
  }

  // Manually trigger evolution
  async triggerEvolution(): Promise<void> {
    await this.evolve();
  }

  // Get feature suggestions for a specific category
  getSuggestionsFor(category: string): GeneratedFeature[] {
    return this.generatedFeatures.filter(f => f.category === category);
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const evolutionEngine = new FeatureEvolutionEngine();

export async function startEvolution(): Promise<void> {
  return evolutionEngine.start();
}

export default evolutionEngine;
