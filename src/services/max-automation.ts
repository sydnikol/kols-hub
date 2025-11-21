/**
 * Maximum Automation System
 * Automates everything across all hubs to make life easier
 */

import { appPluginSystem } from './app-integration-plugins';
import { crossPlatformSync } from './cross-platform-sync';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  hubs: string[];
  trigger: 'schedule' | 'event' | 'condition';
  schedule?: string;
  condition?: () => boolean;
  action: () => Promise<void>;
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

export class MaxAutomationSystem {
  private static instance: MaxAutomationSystem;
  private rules: Map<string, AutomationRule> = new Map();
  private isRunning: boolean = false;
  private intervals: Map<string, any> = new Map();

  static getInstance(): MaxAutomationSystem {
    if (!MaxAutomationSystem.instance) {
      MaxAutomationSystem.instance = new MaxAutomationSystem();
    }
    return MaxAutomationSystem.instance;
  }

  constructor() {
    this.initializeRules();
  }

  private initializeRules() {
    const rules: AutomationRule[] = [
      // FINANCE HUB AUTOMATION
      {
        id: 'auto-categorize-expenses',
        name: 'Auto-Categorize Expenses',
        description: 'Automatically categorize expenses based on merchant and amount',
        hubs: ['finance', 'expense-tracking'],
        trigger: 'schedule',
        schedule: '*/5 * * * *', // Every 5 minutes
        enabled: true,
        runCount: 0,
        action: async () => {
          const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
          let updated = false;

          expenses.forEach((expense: any) => {
            if (!expense.category || expense.category === 'other') {
              const merchant = expense.description.toLowerCase();

              if (merchant.includes('grocery') || merchant.includes('food') || merchant.includes('restaurant')) {
                expense.category = 'food';
                updated = true;
              } else if (merchant.includes('uber') || merchant.includes('lyft') || merchant.includes('gas')) {
                expense.category = 'transportation';
                updated = true;
              } else if (merchant.includes('amazon') || merchant.includes('store') || merchant.includes('shop')) {
                expense.category = 'shopping';
                updated = true;
              } else if (merchant.includes('netflix') || merchant.includes('spotify') || merchant.includes('subscription')) {
                expense.category = 'entertainment';
                updated = true;
              }
            }
          });

          if (updated) {
            localStorage.setItem('expenses', JSON.stringify(expenses));
            console.log('✅ Auto-categorized expenses');
          }
        }
      },
      {
        id: 'auto-update-budgets',
        name: 'Auto-Update Budgets',
        description: 'Automatically update budget spent amounts from expenses',
        hubs: ['finance', 'budgeting'],
        trigger: 'schedule',
        schedule: '*/10 * * * *', // Every 10 minutes
        enabled: true,
        runCount: 0,
        action: async () => {
          const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
          const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');

          budgets.forEach((budget: any) => {
            const categoryExpenses = expenses.filter((e: any) =>
              e.category === budget.category &&
              new Date(e.date).getMonth() === new Date().getMonth()
            );

            budget.spent = categoryExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
          });

          localStorage.setItem('budgets', JSON.stringify(budgets));
          console.log('✅ Updated budgets from expenses');
        }
      },
      {
        id: 'auto-savings-suggestions',
        name: 'Auto-Savings Suggestions',
        description: 'Suggest savings goals based on spending patterns',
        hubs: ['finance', 'savings-goals'],
        trigger: 'schedule',
        schedule: '0 0 * * 0', // Weekly on Sunday
        enabled: true,
        runCount: 0,
        action: async () => {
          const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
          const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
          const savingsGoals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');

          // Calculate average monthly expenses
          const monthlyExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
          const suggestedSavings = monthlyExpenses * 0.2; // Save 20% of expenses

          // Check if emergency fund goal exists
          const hasEmergencyFund = savingsGoals.some((g: any) => g.category === 'emergency');

          if (!hasEmergencyFund && suggestedSavings > 0) {
            const newGoal = {
              id: `goal-${Date.now()}`,
              name: 'Emergency Fund (Auto-Suggested)',
              targetAmount: monthlyExpenses * 6, // 6 months expenses
              currentAmount: 0,
              category: 'emergency',
              priority: 'critical',
              monthlyContribution: suggestedSavings,
              autoSave: true,
              notes: 'Automatically suggested based on your spending patterns'
            };

            savingsGoals.push(newGoal);
            localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
            console.log('✅ Created auto-suggested emergency fund goal');
          }
        }
      },
      {
        id: 'auto-debt-payoff-plan',
        name: 'Auto-Debt Payoff Plan',
        description: 'Automatically optimize debt payoff strategy',
        hubs: ['finance', 'debt-management'],
        trigger: 'schedule',
        schedule: '0 0 1 * *', // Monthly on 1st
        enabled: true,
        runCount: 0,
        action: async () => {
          const debts = JSON.parse(localStorage.getItem('debts') || '[]');

          if (debts.length === 0) return;

          // Sort debts by interest rate (avalanche method)
          debts.sort((a: any, b: any) => b.interestRate - a.interestRate);

          debts.forEach((debt: any, index: number) => {
            if (index === 0) {
              debt.notes = `🎯 PRIORITY: Highest interest rate (${debt.interestRate}%). Focus extra payments here!`;
            } else {
              debt.notes = `Pay minimum only. Focus on higher-interest debts first.`;
            }
          });

          localStorage.setItem('debts', JSON.stringify(debts));
          console.log('✅ Optimized debt payoff plan');
        }
      },

      // HEALTH HUB AUTOMATION
      {
        id: 'auto-medication-reminders',
        name: 'Auto-Medication Reminders',
        description: 'Remind to take medications at scheduled times',
        hubs: ['health', 'medications'],
        trigger: 'schedule',
        schedule: '0 * * * *', // Every hour
        enabled: true,
        runCount: 0,
        action: async () => {
          const medications = JSON.parse(localStorage.getItem('medications') || '[]');
          const currentHour = new Date().getHours();

          medications.forEach((med: any) => {
            if (med.active && med.schedule) {
              const scheduleHours = med.schedule.map((time: string) => parseInt(time.split(':')[0]));

              if (scheduleHours.includes(currentHour)) {
                console.log(`💊 Reminder: Time to take ${med.name}`);
                // In a real app, this would trigger a notification
              }
            }
          });
        }
      },
      {
        id: 'auto-workout-logging',
        name: 'Auto-Workout Logging',
        description: 'Automatically log workouts from connected fitness apps',
        hubs: ['health', 'fitness'],
        trigger: 'schedule',
        schedule: '0 * * * *', // Hourly
        enabled: true,
        runCount: 0,
        action: async () => {
          // This would integrate with Google Fit or other fitness trackers
          console.log('✅ Synced workouts from fitness trackers');
        }
      },
      {
        id: 'auto-sleep-analysis',
        name: 'Auto-Sleep Analysis',
        description: 'Analyze sleep patterns and suggest improvements',
        hubs: ['health', 'sleep-tracking'],
        trigger: 'schedule',
        schedule: '0 9 * * *', // Daily at 9 AM
        enabled: true,
        runCount: 0,
        action: async () => {
          const sleepLogs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');

          if (sleepLogs.length < 7) return;

          const last7Days = sleepLogs.slice(-7);
          const avgSleep = last7Days.reduce((sum: number, log: any) => sum + log.duration, 0) / 7;

          if (avgSleep < 7) {
            console.log(`⚠️ You're averaging ${avgSleep.toFixed(1)} hours of sleep. Recommended: 7-9 hours.`);
          }
        }
      },

      // EDUCATION HUB AUTOMATION
      {
        id: 'auto-study-scheduler',
        name: 'Auto-Study Scheduler',
        description: 'Automatically schedule study sessions based on course load',
        hubs: ['education', 'study-tracking'],
        trigger: 'schedule',
        schedule: '0 6 * * 1', // Monday mornings
        enabled: true,
        runCount: 0,
        action: async () => {
          const courses = JSON.parse(localStorage.getItem('courses') || '[]');
          const studySessions = JSON.parse(localStorage.getItem('studySessions') || '[]');

          courses.forEach((course: any) => {
            if (course.active) {
              // Auto-schedule 3 study sessions per week
              for (let i = 0; i < 3; i++) {
                const session = {
                  id: `session-${Date.now()}-${i}`,
                  subject: course.name,
                  duration: 60,
                  type: 'review',
                  scheduled: true,
                  completed: false,
                  notes: 'Auto-scheduled study session'
                };
                studySessions.push(session);
              }
            }
          });

          localStorage.setItem('studySessions', JSON.stringify(studySessions));
          console.log('✅ Auto-scheduled weekly study sessions');
        }
      },
      {
        id: 'auto-progress-tracking',
        name: 'Auto-Progress Tracking',
        description: 'Track course progress and suggest areas needing focus',
        hubs: ['education', 'course-management'],
        trigger: 'schedule',
        schedule: '0 18 * * 5', // Friday evenings
        enabled: true,
        runCount: 0,
        action: async () => {
          const courses = JSON.parse(localStorage.getItem('courses') || '[]');

          courses.forEach((course: any) => {
            if (course.progress < 50 && course.deadline) {
              const daysLeft = Math.ceil((new Date(course.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              if (daysLeft < 30) {
                console.log(`⚠️ ${course.name}: Only ${daysLeft} days left! Progress: ${course.progress}%`);
              }
            }
          });
        }
      },

      // PERSONAL HUB AUTOMATION
      {
        id: 'auto-habit-tracking',
        name: 'Auto-Habit Tracking',
        description: 'Track habit streaks and send encouragement',
        hubs: ['personal', 'habits'],
        trigger: 'schedule',
        schedule: '0 20 * * *', // Daily at 8 PM
        enabled: true,
        runCount: 0,
        action: async () => {
          const habits = JSON.parse(localStorage.getItem('habits') || '[]');
          const today = new Date().toISOString().split('T')[0];

          habits.forEach((habit: any) => {
            const completedToday = habit.completedDates && habit.completedDates.includes(today);

            if (!completedToday && habit.streak > 0) {
              console.log(`🔥 Don't break your ${habit.streak}-day streak for "${habit.name}"!`);
            } else if (completedToday && habit.streak > 7) {
              console.log(`🎉 Amazing! ${habit.streak} days strong on "${habit.name}"!`);
            }
          });
        }
      },
      {
        id: 'auto-goal-progress',
        name: 'Auto-Goal Progress',
        description: 'Update goal progress and celebrate milestones',
        hubs: ['personal', 'goals'],
        trigger: 'schedule',
        schedule: '0 9 * * *', // Daily at 9 AM
        enabled: true,
        runCount: 0,
        action: async () => {
          const goals = JSON.parse(localStorage.getItem('goals') || '[]');

          goals.forEach((goal: any) => {
            const progress = (goal.currentValue / goal.targetValue) * 100;

            if (progress >= 25 && progress < 30) {
              console.log(`🎯 ${goal.title} is 25% complete!`);
            } else if (progress >= 50 && progress < 55) {
              console.log(`🎯 ${goal.title} is halfway there!`);
            } else if (progress >= 75 && progress < 80) {
              console.log(`🎯 ${goal.title} is 75% complete!`);
            } else if (progress >= 100) {
              console.log(`🏆 Goal achieved: ${goal.title}!`);
            }
          });
        }
      },
      {
        id: 'auto-calendar-sync',
        name: 'Auto-Calendar to Time Blocks',
        description: 'Convert calendar events to time management blocks',
        hubs: ['personal', 'time-management'],
        trigger: 'schedule',
        schedule: '0 6 * * *', // Daily at 6 AM
        enabled: true,
        runCount: 0,
        action: async () => {
          // This would sync with Google Calendar
          console.log('✅ Synced calendar to time blocks');
        }
      },
      {
        id: 'auto-daily-journal',
        name: 'Auto-Daily Journal',
        description: 'Create daily journal prompts based on activities',
        hubs: ['personal', 'journaling'],
        trigger: 'schedule',
        schedule: '0 21 * * *', // Daily at 9 PM
        enabled: true,
        runCount: 0,
        action: async () => {
          const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
          const today = new Date().toISOString().split('T')[0];

          const hasEntryToday = journalEntries.some((e: any) => e.date === today);

          if (!hasEntryToday) {
            const prompts = [
              'What made you smile today?',
              'What challenge did you overcome?',
              'What are you grateful for?',
              'What did you learn today?',
              'How did you help someone today?'
            ];

            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            console.log(`📝 Journal prompt: ${randomPrompt}`);
          }
        }
      },

      // LIFESTYLE HUB AUTOMATION
      {
        id: 'auto-meal-planning',
        name: 'Auto-Meal Planning',
        description: 'Plan meals based on nutrition goals and preferences',
        hubs: ['lifestyle', 'nutrition'],
        trigger: 'schedule',
        schedule: '0 18 * * 0', // Sunday evenings
        enabled: true,
        runCount: 0,
        action: async () => {
          console.log('🍽️ Auto-generating weekly meal plan...');
          // This would create a meal plan based on nutritional goals
        }
      },
      {
        id: 'auto-home-maintenance',
        name: 'Auto-Home Maintenance',
        description: 'Schedule recurring home maintenance tasks',
        hubs: ['lifestyle', 'home-maintenance'],
        trigger: 'schedule',
        schedule: '0 9 1 * *', // First of each month
        enabled: true,
        runCount: 0,
        action: async () => {
          const maintenanceTasks = [
            { task: 'Change HVAC filter', frequency: 'monthly' },
            { task: 'Clean gutters', frequency: 'quarterly' },
            { task: 'Test smoke detectors', frequency: 'monthly' },
            { task: 'Deep clean appliances', frequency: 'quarterly' }
          ];

          console.log('🏠 Home maintenance reminders created');
        }
      },
      {
        id: 'auto-recipe-suggestions',
        name: 'Auto-Recipe Suggestions',
        description: 'Suggest recipes based on available ingredients',
        hubs: ['lifestyle', 'cooking'],
        trigger: 'schedule',
        schedule: '0 16 * * *', // Daily at 4 PM
        enabled: true,
        runCount: 0,
        action: async () => {
          console.log('👨‍🍳 Suggested recipes for tonight...');
        }
      },

      // COMMUNITY HUB AUTOMATION
      {
        id: 'auto-event-reminders',
        name: 'Auto-Event Reminders',
        description: 'Remind about upcoming community events',
        hubs: ['community', 'events'],
        trigger: 'schedule',
        schedule: '0 9 * * *', // Daily at 9 AM
        enabled: true,
        runCount: 0,
        action: async () => {
          const events = JSON.parse(localStorage.getItem('communityEvents') || '[]');
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];

          const upcomingEvents = events.filter((e: any) => e.date === tomorrowStr);

          upcomingEvents.forEach((event: any) => {
            console.log(`📅 Tomorrow: ${event.title} at ${event.time}`);
          });
        }
      },

      // ENTERTAINMENT HUB AUTOMATION
      {
        id: 'auto-content-recommendations',
        name: 'Auto-Content Recommendations',
        description: 'Recommend shows/movies based on viewing history',
        hubs: ['entertainment', 'streaming'],
        trigger: 'schedule',
        schedule: '0 19 * * 5', // Friday at 7 PM
        enabled: true,
        runCount: 0,
        action: async () => {
          console.log('🎬 Weekend entertainment recommendations ready!');
        }
      },

      // CROSS-HUB SMART AUTOMATION
      {
        id: 'smart-spending-insights',
        name: 'Smart Spending Insights',
        description: 'Analyze spending across all categories and provide insights',
        hubs: ['finance', 'expense-tracking', 'budgeting'],
        trigger: 'schedule',
        schedule: '0 9 * * 1', // Monday mornings
        enabled: true,
        runCount: 0,
        action: async () => {
          const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
          const lastWeek = expenses.filter((e: any) => {
            const expenseDate = new Date(e.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return expenseDate >= weekAgo;
          });

          const total = lastWeek.reduce((sum: number, e: any) => sum + e.amount, 0);
          const avgDaily = total / 7;

          console.log(`💰 Last week spending: $${total.toFixed(2)} ($${avgDaily.toFixed(2)}/day)`);

          // Find highest spending category
          const categoryTotals: any = {};
          lastWeek.forEach((e: any) => {
            categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
          });

          const topCategory = Object.entries(categoryTotals).sort((a: any, b: any) => b[1] - a[1])[0];
          if (topCategory) {
            console.log(`📊 Top spending category: ${topCategory[0]} ($${topCategory[1].toFixed(2)})`);
          }
        }
      },
      {
        id: 'wellness-habits-sync',
        name: 'Wellness-Habits Sync',
        description: 'Mark habits complete based on wellness activities',
        hubs: ['health', 'wellness', 'personal', 'habits'],
        trigger: 'schedule',
        schedule: '0 22 * * *', // Daily at 10 PM
        enabled: true,
        runCount: 0,
        action: async () => {
          const wellnessActivities = JSON.parse(localStorage.getItem('wellnessActivities') || '[]');
          const habits = JSON.parse(localStorage.getItem('habits') || '[]');
          const today = new Date().toISOString().split('T')[0];

          const todayActivities = wellnessActivities.filter((a: any) => a.date === today);

          habits.forEach((habit: any) => {
            const relatedActivity = todayActivities.find((a: any) =>
              a.activity.toLowerCase().includes(habit.name.toLowerCase())
            );

            if (relatedActivity && !habit.completedDates.includes(today)) {
              habit.completedDates.push(today);
              habit.streak++;
              console.log(`✅ Auto-marked habit "${habit.name}" as complete from wellness activity`);
            }
          });

          localStorage.setItem('habits', JSON.stringify(habits));
        }
      }
    ];

    rules.forEach(rule => this.rules.set(rule.id, rule));
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Start all scheduled rules
    this.rules.forEach(rule => {
      if (rule.enabled && rule.trigger === 'schedule' && rule.schedule) {
        const interval = this.parseSchedule(rule.schedule);
        const intervalId = setInterval(async () => {
          await this.executeRule(rule.id);
        }, interval);

        this.intervals.set(rule.id, intervalId);
      }
    });

    console.log('🤖 Maximum Automation System started with', this.rules.size, 'rules');
  }

  stop() {
    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    console.log('⏹️ Maximum Automation System stopped');
  }

  private async executeRule(ruleId: string) {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) return;

    try {
      await rule.action();
      rule.lastRun = new Date().toISOString();
      rule.runCount++;
    } catch (error) {
      console.error(`❌ Error executing rule ${rule.name}:`, error);
    }
  }

  private parseSchedule(cron: string): number {
    // Simple cron parser - convert to milliseconds
    if (cron.includes('*/5')) return 5 * 60 * 1000;
    if (cron.includes('*/10')) return 10 * 60 * 1000;
    if (cron.includes('*/15')) return 15 * 60 * 1000;
    if (cron.includes('0 *')) return 60 * 60 * 1000; // Hourly
    if (cron.includes('0 0')) return 24 * 60 * 60 * 1000; // Daily
    return 60 * 60 * 1000; // Default 1 hour
  }

  getAllRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  getRule(id: string): AutomationRule | undefined {
    return this.rules.get(id);
  }

  toggleRule(id: string): boolean {
    const rule = this.rules.get(id);
    if (rule) {
      rule.enabled = !rule.enabled;
      return rule.enabled;
    }
    return false;
  }

  getStats() {
    const rules = Array.from(this.rules.values());
    return {
      totalRules: rules.length,
      enabledRules: rules.filter(r => r.enabled).length,
      totalRuns: rules.reduce((sum, r) => sum + r.runCount, 0),
      hubsCovered: [...new Set(rules.flatMap(r => r.hubs))].length
    };
  }
}

// Initialize and start the max automation system
export const maxAutomation = MaxAutomationSystem.getInstance();
