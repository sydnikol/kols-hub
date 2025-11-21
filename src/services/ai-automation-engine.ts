/**
 * AI Automation Engine - The Brain of Your Personal OS
 *
 * This service automatically:
 * - Connects all features together
 * - Learns from your patterns
 * - Makes proactive suggestions
 * - Automates repetitive tasks
 * - Optimizes your life without manual intervention
 */

interface AutomationRule {
  id: string;
  name: string;
  trigger: TriggerCondition;
  actions: AutomatedAction[];
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

interface TriggerCondition {
  type: 'time' | 'data-change' | 'threshold' | 'pattern' | 'smart-detection';
  config: any;
}

interface AutomatedAction {
  type: string;
  targetFeature: string;
  params: any;
}

interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'optimization' | 'achievement';
  category: string;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedActions?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  dismissed: boolean;
}

interface CrossFeatureSync {
  sourceFeature: string;
  targetFeature: string;
  dataMapping: Record<string, string>;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  bidirectional: boolean;
}

class AIAutomationEngine {
  private static instance: AIAutomationEngine;
  private rules: AutomationRule[] = [];
  private insights: AIInsight[] = [];
  private syncs: CrossFeatureSync[] = [];
  private isRunning: boolean = false;

  private constructor() {
    this.initializeDefaultRules();
    this.initializeDefaultSyncs();
    this.startAutomation();
  }

  static getInstance(): AIAutomationEngine {
    if (!AIAutomationEngine.instance) {
      AIAutomationEngine.instance = new AIAutomationEngine();
    }
    return AIAutomationEngine.instance;
  }

  private initializeDefaultRules() {
    // Budget Alert Rule
    this.rules.push({
      id: 'budget-alert',
      name: 'Budget Overflow Detection',
      trigger: {
        type: 'threshold',
        config: { dataPath: 'budgets.*.spent', thresholdPercent: 80 }
      },
      actions: [{
        type: 'create-notification',
        targetFeature: 'notifications',
        params: { title: 'Budget Alert', priority: 'high' }
      }],
      enabled: true,
      runCount: 0
    });

    // Habit Streak Protection
    this.rules.push({
      id: 'habit-streak-reminder',
      name: 'Protect Habit Streaks',
      trigger: {
        type: 'time',
        config: { hour: 20, minute: 0 }
      },
      actions: [{
        type: 'check-incomplete-habits',
        targetFeature: 'habits',
        params: { reminder: true }
      }],
      enabled: true,
      runCount: 0
    });

    // Goal Progress Sync
    this.rules.push({
      id: 'goal-achievement-sync',
      name: 'Sync Goal Completions to Achievements',
      trigger: {
        type: 'data-change',
        config: { dataPath: 'goals.*.progress', value: 100 }
      },
      actions: [{
        type: 'create-achievement',
        targetFeature: 'goals',
        params: { autoGenerate: true }
      }],
      enabled: true,
      runCount: 0
    });

    // Financial Health Check
    this.rules.push({
      id: 'financial-health',
      name: 'Daily Financial Health Analysis',
      trigger: {
        type: 'time',
        config: { hour: 9, minute: 0 }
      },
      actions: [{
        type: 'analyze-finances',
        targetFeature: 'ai-insights',
        params: { generateReport: true }
      }],
      enabled: true,
      runCount: 0
    });

    // Expense to Budget Auto-categorization
    this.rules.push({
      id: 'expense-auto-categorize',
      name: 'Auto-categorize Expenses to Budgets',
      trigger: {
        type: 'data-change',
        config: { dataPath: 'expenses.*', operation: 'create' }
      },
      actions: [{
        type: 'update-budget-spent',
        targetFeature: 'budgeting',
        params: { autoMatch: true }
      }],
      enabled: true,
      runCount: 0
    });

    // Study Session to Time Management
    this.rules.push({
      id: 'study-time-tracking',
      name: 'Auto-log Study Time',
      trigger: {
        type: 'data-change',
        config: { dataPath: 'studySessions.*', operation: 'complete' }
      },
      actions: [{
        type: 'create-time-block',
        targetFeature: 'time-management',
        params: { category: 'study', autoFill: true }
      }],
      enabled: true,
      runCount: 0
    });

    // Wellness Activity to Habits
    this.rules.push({
      id: 'wellness-habit-sync',
      name: 'Mark Habits Complete from Wellness Activities',
      trigger: {
        type: 'data-change',
        config: { dataPath: 'wellnessActivities.*', operation: 'create' }
      },
      actions: [{
        type: 'mark-habit-complete',
        targetFeature: 'habits',
        params: { smartMatch: true }
      }],
      enabled: true,
      runCount: 0
    });

    // Debt Payment to Savings Goal
    this.rules.push({
      id: 'debt-payment-milestone',
      name: 'Track Debt Payments as Milestones',
      trigger: {
        type: 'data-change',
        config: { dataPath: 'debtPayments.*', operation: 'create' }
      },
      actions: [{
        type: 'update-debt-balance',
        targetFeature: 'debt-management',
        params: { autoCalculate: true }
      }, {
        type: 'create-milestone',
        targetFeature: 'goals',
        params: { category: 'financial' }
      }],
      enabled: true,
      runCount: 0
    });
  }

  private initializeDefaultSyncs() {
    // Expense → Budget sync
    this.syncs.push({
      sourceFeature: 'expense-tracking',
      targetFeature: 'budgeting',
      dataMapping: {
        'expenses.*.amount': 'budgets.*.spent',
        'expenses.*.category': 'budgets.*.category'
      },
      syncFrequency: 'realtime',
      bidirectional: false
    });

    // Goals → Achievements sync
    this.syncs.push({
      sourceFeature: 'goals',
      targetFeature: 'goals',
      dataMapping: {
        'goals.completed': 'achievements.new'
      },
      syncFrequency: 'realtime',
      bidirectional: false
    });

    // Time Management → Productivity tracking
    this.syncs.push({
      sourceFeature: 'time-management',
      targetFeature: 'goals',
      dataMapping: {
        'sessions.*.duration': 'goals.*.progress'
      },
      syncFrequency: 'daily',
      bidirectional: false
    });

    // Wellness → Habits sync
    this.syncs.push({
      sourceFeature: 'wellness',
      targetFeature: 'habits',
      dataMapping: {
        'wellnessActivities.date': 'habits.completedDates'
      },
      syncFrequency: 'realtime',
      bidirectional: true
    });

    // Savings → Financial Goals
    this.syncs.push({
      sourceFeature: 'savings-goals',
      targetFeature: 'investments',
      dataMapping: {
        'savingsGoals.*.currentAmount': 'investments.ready'
      },
      syncFrequency: 'daily',
      bidirectional: false
    });
  }

  async generateInsights(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Analyze budget health
    const budgetInsight = await this.analyzeBudgetHealth();
    if (budgetInsight) insights.push(budgetInsight);

    // Analyze habit patterns
    const habitInsights = await this.analyzeHabitPatterns();
    insights.push(...habitInsights);

    // Analyze goal progress
    const goalInsights = await this.analyzeGoalProgress();
    insights.push(...goalInsights);

    // Analyze time utilization
    const timeInsights = await this.analyzeTimeUtilization();
    insights.push(...timeInsights);

    // Analyze financial trends
    const financeInsights = await this.analyzeFinancialTrends();
    insights.push(...financeInsights);

    // Store insights
    this.insights = [...this.insights, ...insights];
    this.saveInsights();

    return insights;
  }

  private async analyzeBudgetHealth(): Promise<AIInsight | null> {
    try {
      const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      const overBudget = budgets.filter((b: any) => b.spent > b.amount);

      if (overBudget.length > 0) {
        return {
          id: `insight-${Date.now()}`,
          type: 'warning',
          category: 'finance',
          title: 'Budget Overspending Detected',
          description: `You've exceeded ${overBudget.length} budget(s). Consider adjusting your spending or increasing budget limits.`,
          confidence: 0.95,
          actionable: true,
          suggestedActions: [
            'Review expense categories',
            'Adjust budget allocations',
            'Set up expense alerts'
          ],
          priority: 'high',
          createdAt: new Date().toISOString(),
          dismissed: false
        };
      }
    } catch (error) {
      console.error('Error analyzing budget health:', error);
    }
    return null;
  }

  private async analyzeHabitPatterns(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      const today = new Date().toISOString().split('T')[0];

      // Find habits at risk of losing streaks
      const atRiskHabits = habits.filter((h: any) =>
        h.currentStreak > 7 && !h.completedDates.includes(today)
      );

      if (atRiskHabits.length > 0) {
        insights.push({
          id: `insight-${Date.now()}-habits`,
          type: 'warning',
          category: 'personal',
          title: 'Streak Protection Alert',
          description: `You have ${atRiskHabits.length} habit streak(s) at risk today. Complete them to maintain your progress!`,
          confidence: 0.9,
          actionable: true,
          suggestedActions: atRiskHabits.map((h: any) => `Complete: ${h.name}`),
          priority: 'medium',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }

      // Celebrate achievements
      const strongStreaks = habits.filter((h: any) => h.currentStreak >= 30);
      if (strongStreaks.length > 0) {
        insights.push({
          id: `insight-${Date.now()}-achievement`,
          type: 'achievement',
          category: 'personal',
          title: 'Habit Mastery!',
          description: `Amazing! You've maintained ${strongStreaks.length} habit(s) for 30+ days. You're building lasting change!`,
          confidence: 1.0,
          actionable: false,
          priority: 'low',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }
    } catch (error) {
      console.error('Error analyzing habits:', error);
    }

    return insights;
  }

  private async analyzeGoalProgress(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      const goals = JSON.parse(localStorage.getItem('goals') || '[]');

      // Find stagnant goals
      const stagnantGoals = goals.filter((g: any) =>
        g.status === 'in-progress' && g.progress < 20
      );

      if (stagnantGoals.length > 0) {
        insights.push({
          id: `insight-${Date.now()}-goals-stagnant`,
          type: 'recommendation',
          category: 'personal',
          title: 'Goals Need Attention',
          description: `${stagnantGoals.length} goal(s) have low progress. Break them into smaller milestones for momentum!`,
          confidence: 0.85,
          actionable: true,
          suggestedActions: [
            'Create smaller milestones',
            'Set weekly targets',
            'Review goal priorities'
          ],
          priority: 'medium',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }

      // Celebrate near-completion
      const nearComplete = goals.filter((g: any) => g.progress >= 80 && g.progress < 100);
      if (nearComplete.length > 0) {
        insights.push({
          id: `insight-${Date.now()}-goals-close`,
          type: 'recommendation',
          category: 'personal',
          title: 'You\'re Almost There!',
          description: `${nearComplete.length} goal(s) are almost complete! A final push will get you across the finish line.`,
          confidence: 0.95,
          actionable: true,
          suggestedActions: nearComplete.map((g: any) => `Complete: ${g.title}`),
          priority: 'high',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }
    } catch (error) {
      console.error('Error analyzing goals:', error);
    }

    return insights;
  }

  private async analyzeTimeUtilization(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      const timeBlocks = JSON.parse(localStorage.getItem('timeBlocks') || '[]');
      const sessions = JSON.parse(localStorage.getItem('productivitySessions') || '[]');

      const totalMinutes = sessions.reduce((sum: number, s: any) => sum + s.duration, 0);
      const avgFocus = sessions.length > 0
        ? sessions.reduce((sum: number, s: any) => sum + s.focusLevel, 0) / sessions.length
        : 0;

      if (avgFocus < 3 && sessions.length >= 5) {
        insights.push({
          id: `insight-${Date.now()}-focus`,
          type: 'recommendation',
          category: 'productivity',
          title: 'Focus Optimization Needed',
          description: `Your average focus level is ${avgFocus.toFixed(1)}/5. Try the Pomodoro technique or reduce distractions.`,
          confidence: 0.8,
          actionable: true,
          suggestedActions: [
            'Enable focus mode',
            'Block distracting websites',
            'Try Pomodoro timer'
          ],
          priority: 'medium',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }

      if (totalMinutes > 300 && sessions.length > 0) {
        insights.push({
          id: `insight-${Date.now()}-productive`,
          type: 'achievement',
          category: 'productivity',
          title: 'Productivity Champion!',
          description: `You've logged ${Math.floor(totalMinutes / 60)} hours of focused work. Your dedication is impressive!`,
          confidence: 1.0,
          actionable: false,
          priority: 'low',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }
    } catch (error) {
      console.error('Error analyzing time utilization:', error);
    }

    return insights;
  }

  private async analyzeFinancialTrends(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const savingsGoals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
      const debts = JSON.parse(localStorage.getItem('debts') || '[]');

      // Calculate savings rate
      const totalSaved = savingsGoals.reduce((sum: any, g: any) => sum + g.currentAmount, 0);
      const totalTarget = savingsGoals.reduce((sum: any, g: any) => sum + g.targetAmount, 0);
      const savingsRate = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

      if (savingsRate > 50) {
        insights.push({
          id: `insight-${Date.now()}-savings-progress`,
          type: 'achievement',
          category: 'finance',
          title: 'Great Savings Progress!',
          description: `You've saved ${savingsRate.toFixed(0)}% of your goal! Keep up the momentum!`,
          confidence: 1.0,
          actionable: false,
          priority: 'low',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }

      // Debt reduction opportunity
      const totalDebt = debts.reduce((sum: any, d: any) => sum + d.remainingBalance, 0);
      const highInterestDebt = debts.filter((d: any) => d.interestRate > 15);

      if (highInterestDebt.length > 0) {
        insights.push({
          id: `insight-${Date.now()}-debt-priority`,
          type: 'recommendation',
          category: 'finance',
          title: 'High-Interest Debt Alert',
          description: `Focus on paying off ${highInterestDebt.length} high-interest debt(s) first to save on interest.`,
          confidence: 0.9,
          actionable: true,
          suggestedActions: [
            'Use debt avalanche method',
            'Consider debt consolidation',
            'Increase monthly payments'
          ],
          priority: 'high',
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }
    } catch (error) {
      console.error('Error analyzing financial trends:', error);
    }

    return insights;
  }

  private async executeCrossFeatureSync() {
    for (const sync of this.syncs) {
      try {
        await this.performSync(sync);
      } catch (error) {
        console.error(`Sync error between ${sync.sourceFeature} and ${sync.targetFeature}:`, error);
      }
    }
  }

  private async performSync(sync: CrossFeatureSync) {
    // Simplified sync implementation
    // In production, this would be more sophisticated
    console.log(`Syncing ${sync.sourceFeature} → ${sync.targetFeature}`);

    // Expense → Budget sync example
    if (sync.sourceFeature === 'expense-tracking' && sync.targetFeature === 'budgeting') {
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');

      budgets.forEach((budget: any) => {
        const categoryExpenses = expenses.filter((e: any) =>
          e.category.toLowerCase() === budget.category.toLowerCase()
        );
        const totalSpent = categoryExpenses.reduce((sum: any, e: any) => sum + e.amount, 0);
        budget.spent = totalSpent;
      });

      localStorage.setItem('budgets', JSON.stringify(budgets));
    }
  }

  private startAutomation() {
    if (this.isRunning) return;

    this.isRunning = true;

    // Run insights generation every hour
    setInterval(() => {
      this.generateInsights();
    }, 60 * 60 * 1000); // 1 hour

    // Run cross-feature sync every 5 minutes
    setInterval(() => {
      this.executeCrossFeatureSync();
    }, 5 * 60 * 1000); // 5 minutes

    // Run initial generation
    setTimeout(() => {
      this.generateInsights();
      this.executeCrossFeatureSync();
    }, 5000); // 5 seconds after startup
  }

  private saveInsights() {
    localStorage.setItem('aiInsights', JSON.stringify(this.insights));
  }

  getInsights(): AIInsight[] {
    return this.insights.filter(i => !i.dismissed);
  }

  dismissInsight(id: string) {
    const insight = this.insights.find(i => i.id === id);
    if (insight) {
      insight.dismissed = true;
      this.saveInsights();
    }
  }

  getRules(): AutomationRule[] {
    return this.rules;
  }

  toggleRule(id: string) {
    const rule = this.rules.find(r => r.id === id);
    if (rule) {
      rule.enabled = !rule.enabled;
    }
  }
}

// Initialize the automation engine
export const aiEngine = AIAutomationEngine.getInstance();
export default aiEngine;
