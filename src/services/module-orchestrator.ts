/**
 * Module Orchestrator - Makes the Whole App Talk Together
 *
 * This orchestrator enables bidirectional communication between all app modules,
 * allowing features to share data, trigger actions, and respond to events across the entire system.
 */

import { db } from '../utils/database';
import { appPluginSystem } from './app-integration-plugins';

// Event types for cross-module communication
export type ModuleEvent =
  | 'health:vitals-logged'
  | 'health:medication-taken'
  | 'health:pain-reported'
  | 'health:mood-changed'
  | 'finance:expense-added'
  | 'finance:income-received'
  | 'tasks:task-completed'
  | 'tasks:goal-achieved'
  | 'wellness:energy-low'
  | 'wellness:sleep-logged'
  | 'wellness:rest-recommended'
  | 'wellness:stress-detected'
  | 'wellness:celebration'
  | 'wellness:crisis-mode-activated'
  | 'wellness:notification'
  | 'wellness:sleep-routine-started'
  | 'wellness:morning-routine-started'
  | 'wellness:ai-role-changed'
  | 'automation:action-triggered'
  | 'home:device-state-changed'
  | 'home:scene-activated'
  | 'calendar:event-started'
  | 'calendar:event-ended'
  | 'location:arrived-home'
  | 'location:left-home'
  | 'music:song-playing'
  | 'music:mood-detected'
  | 'social:message-received'
  | 'education:lesson-completed'
  | 'crisis:emergency-triggered'
  | 'food:meal-logged'
  | 'wardrobe:outfit-chosen';

export interface EventPayload {
  module: string;
  event: ModuleEvent;
  data: any;
  timestamp: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

export interface ModuleReaction {
  sourceEvent: ModuleEvent;
  targetModule: string;
  action: (payload: EventPayload) => Promise<void> | void;
  condition?: (payload: EventPayload) => boolean;
  description: string;
}

export class ModuleOrchestrator {
  private static instance: ModuleOrchestrator;
  private eventListeners: Map<ModuleEvent, Set<(payload: EventPayload) => void>> = new Map();
  private reactions: ModuleReaction[] = [];
  private eventHistory: EventPayload[] = [];
  private maxHistorySize = 1000;

  static getInstance(): ModuleOrchestrator {
    if (!ModuleOrchestrator.instance) {
      ModuleOrchestrator.instance = new ModuleOrchestrator();
    }
    return ModuleOrchestrator.instance;
  }

  constructor() {
    this.registerDefaultReactions();
  }

  /**
   * Register default cross-module reactions
   * This is where the magic happens - features talk to each other!
   */
  private registerDefaultReactions() {
    // HEALTH → WELLNESS: Low blood pressure triggers rest recommendation
    this.addReaction({
      sourceEvent: 'health:vitals-logged',
      targetModule: 'wellness',
      description: 'Suggest rest when vitals are concerning',
      condition: (payload) => {
        const vitals = payload.data;
        return vitals.bloodPressureSystolic < 100 || vitals.heartRate > 110;
      },
      action: async (payload) => {
        const notification = {
          id: crypto.randomUUID(),
          type: 'wellness-recommendation',
          title: 'Take a Rest Break',
          message: 'Your vitals suggest you should rest. Consider lying down and hydrating.',
          priority: 'high',
          timestamp: new Date().toISOString(),
          actions: [
            { label: 'Start Rest Timer', action: 'start-rest-timer' },
            { label: 'Log Symptoms', action: 'open-symptom-logger' }
          ]
        };

        // Trigger wellness module notification
        this.emit('wellness:rest-recommended', notification);

        // Adjust smart home lighting if connected
        if (appPluginSystem.getPlugin('philips-hue')?.connected) {
          this.emit('home:scene-activated', { scene: 'rest-mode', brightness: 30 });
        }
      }
    });

    // WELLNESS → MUSIC: Auto-play calming music when stress is high
    this.addReaction({
      sourceEvent: 'wellness:energy-low',
      targetModule: 'music',
      description: 'Play calming music when energy is low',
      action: async (payload) => {
        if (appPluginSystem.getPlugin('spotify')?.connected) {
          this.emit('music:mood-detected', {
            mood: 'calm',
            playlistUri: 'spotify:playlist:37i9dQZF1DWZqd5JICZI0u' // Peaceful Piano
          });
        }
      }
    });

    // CALENDAR → HOME: Start "focus mode" when work event begins
    this.addReaction({
      sourceEvent: 'calendar:event-started',
      targetModule: 'home',
      description: 'Activate focus mode when work meetings start',
      condition: (payload) => payload.data.category === 'work',
      action: async (payload) => {
        if (appPluginSystem.getPlugin('smartthings')?.connected) {
          this.emit('home:scene-activated', {
            scene: 'focus-mode',
            devices: {
              lights: { brightness: 80, color: 'daylight' },
              thermostat: { temperature: 72 },
              notifications: 'silent'
            }
          });
        }
      }
    });

    // LOCATION → WELLNESS: Welcome home routine
    this.addReaction({
      sourceEvent: 'location:arrived-home',
      targetModule: 'wellness',
      description: 'Trigger welcome home routine',
      action: async (payload) => {
        // Turn on lights
        if (appPluginSystem.getPlugin('philips-hue')?.connected) {
          this.emit('home:scene-activated', { scene: 'welcome-home' });
        }

        // Suggest decompression activity
        this.emit('wellness:rest-recommended', {
          type: 'decompression',
          message: 'Welcome home! How about a 10-minute breathing exercise?',
          actions: [
            { label: 'Start Breathing Exercise', action: 'breathing-exercise' },
            { label: 'Skip', action: 'dismiss' }
          ]
        });
      }
    });

    // FINANCE → WELLNESS: Spending stress alert
    this.addReaction({
      sourceEvent: 'finance:expense-added',
      targetModule: 'wellness',
      description: 'Alert if large expense might cause stress',
      condition: (payload) => payload.data.amount > 100,
      action: async (payload) => {
        const budgetData = await this.getBudgetStatus();
        if (budgetData.overBudget) {
          this.emit('wellness:stress-detected', {
            source: 'financial',
            message: 'Large purchase detected. Remember to practice self-compassion.',
            copingStrategies: [
              'Take 5 deep breaths',
              'Review your budget without judgment',
              'Talk to your support person'
            ]
          });
        }
      }
    });

    // HEALTH → TASKS: Create medication reminder task
    this.addReaction({
      sourceEvent: 'health:medication-taken',
      targetModule: 'tasks',
      description: 'Update medication checklist',
      action: async (payload) => {
        const medId = payload.data.medicationId;
        await db.tasks.where({ relatedTo: `medication:${medId}` }).modify({
          completed: true,
          completedAt: new Date().toISOString()
        });
      }
    });

    // TASKS → WELLNESS: Celebrate completed goal
    this.addReaction({
      sourceEvent: 'tasks:goal-achieved',
      targetModule: 'wellness',
      description: 'Celebrate when goals are achieved',
      action: async (payload) => {
        this.emit('wellness:celebration', {
          goalName: payload.data.name,
          message: `🎉 You did it! ${payload.data.name} is complete!`,
          reward: 'achievement-unlocked',
          confetti: true
        });

        // Change smart lights to celebration colors
        if (appPluginSystem.getPlugin('philips-hue')?.connected) {
          this.emit('home:scene-activated', {
            scene: 'celebration',
            duration: 30000 // 30 seconds
          });
        }
      }
    });

    // MUSIC → WELLNESS: Detect mood from music listening
    this.addReaction({
      sourceEvent: 'music:song-playing',
      targetModule: 'wellness',
      description: 'Infer mood from music selection',
      action: async (payload) => {
        const songData = payload.data;
        const inferredMood = this.inferMoodFromSong(songData);

        // Note: Using mood table (singular) from database schema
        if (db.mood) {
          await db.mood.add({
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            mood: inferredMood,
            energy: songData.energy || 5,
            notes: `Inferred from listening to ${songData.title}`,
            source: 'music-analysis'
          });
        }
      }
    });

    // CRISIS → HOME + WELLNESS: Emergency mode
    this.addReaction({
      sourceEvent: 'crisis:emergency-triggered',
      targetModule: 'home',
      description: 'Activate emergency calm-down environment',
      action: async (payload) => {
        // Dim lights to calming level
        if (appPluginSystem.getPlugin('philips-hue')?.connected) {
          this.emit('home:scene-activated', {
            scene: 'emergency-calm',
            devices: {
              lights: { brightness: 20, color: 'warm-white' },
              sounds: 'white-noise'
            }
          });
        }

        // Load grounding techniques
        this.emit('wellness:crisis-mode-activated', {
          techniques: ['box-breathing', '5-4-3-2-1-grounding', 'safe-place-visualization'],
          emergencyContacts: true,
          autoPlayGuided: true
        });
      }
    });

    // FOOD → FINANCE: Track food expenses
    this.addReaction({
      sourceEvent: 'food:meal-logged',
      targetModule: 'finance',
      description: 'Log food expenses from meal tracking',
      condition: (payload) => payload.data.cost > 0,
      action: async (payload) => {
        // Note: Store expense in localStorage if db.expenses doesn't exist
        const expense = {
          id: crypto.randomUUID(),
          description: `Meal: ${payload.data.name}`,
          amount: payload.data.cost,
          category: 'food',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: payload.data.paymentMethod || 'cash',
          receipt: '',
          recurring: false,
          tags: ['food', 'auto-tracked']
        };

        const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
      }
    });

    // EDUCATION → TASKS: Create study reminders
    this.addReaction({
      sourceEvent: 'education:lesson-completed',
      targetModule: 'tasks',
      description: 'Schedule next lesson reminder',
      action: async (payload) => {
        const courseId = payload.data.courseId;
        const nextLesson = await this.getNextLesson(courseId);

        if (nextLesson) {
          await db.tasks.add({
            id: crypto.randomUUID(),
            title: `Complete: ${nextLesson.title}`,
            category: 'study',
            dueDate: this.getNextStudyDate().toISOString(),
            priority: 'normal',
            completed: false,
            relatedTo: `course:${courseId}`,
            estimatedTime: nextLesson.duration || 30
          });
        }
      }
    });

    // WARDROBE → CALENDAR: Outfit selected for event
    this.addReaction({
      sourceEvent: 'wardrobe:outfit-chosen',
      targetModule: 'calendar',
      description: 'Attach outfit to calendar event',
      condition: (payload) => payload.data.eventId,
      action: async (payload) => {
        // Store outfit selection for event
        const outfitData = {
          eventId: payload.data.eventId,
          outfitId: payload.data.outfitId,
          items: payload.data.items,
          photo: payload.data.photo,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem(
          `event-outfit:${payload.data.eventId}`,
          JSON.stringify(outfitData)
        );
      }
    });

    // SOCIAL → WELLNESS: Message received from support person
    this.addReaction({
      sourceEvent: 'social:message-received',
      targetModule: 'wellness',
      description: 'Log social connection for mental health',
      condition: (payload) => payload.data.fromSupportPerson,
      action: async (payload) => {
        // Store social connection in localStorage
        const connection = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          person: payload.data.from,
          type: 'message',
          quality: 'positive',
          notes: 'Received supportive message',
          impactOnMood: 'improved'
        };

        const connections = JSON.parse(localStorage.getItem('socialConnections') || '[]');
        connections.push(connection);
        localStorage.setItem('socialConnections', JSON.stringify(connections));
      }
    });

    // HOME → WELLNESS: Smart home presence tracking for routine
    this.addReaction({
      sourceEvent: 'home:device-state-changed',
      targetModule: 'wellness',
      description: 'Track daily routine patterns',
      condition: (payload) => payload.data.deviceType === 'bedroom-light',
      action: async (payload) => {
        if (payload.data.state === 'off') {
          // Bedtime detected
          this.emit('wellness:sleep-routine-started', {
            timestamp: new Date().toISOString(),
            automatic: true
          });
        } else if (payload.data.state === 'on') {
          const hour = new Date().getHours();
          if (hour >= 5 && hour <= 9) {
            // Wake up detected
            this.emit('wellness:morning-routine-started', {
              timestamp: new Date().toISOString(),
              automatic: true
            });
          }
        }
      }
    });

    // AUTOMATION → MULTIPLE: Cross-module automation triggers
    this.addReaction({
      sourceEvent: 'automation:action-triggered',
      targetModule: 'multiple',
      description: 'Execute complex multi-module automations',
      action: async (payload) => {
        const automation = payload.data;

        // Execute all actions in the automation
        for (const action of automation.actions) {
          switch (action.type) {
            case 'add-task':
              await db.tasks.add(action.data);
              break;
            case 'log-mood':
              await db.moods.add(action.data);
              break;
            case 'send-notification':
              this.emit('wellness:notification', action.data);
              break;
            case 'control-device':
              this.emit('home:device-state-changed', action.data);
              break;
            case 'play-music':
              this.emit('music:mood-detected', action.data);
              break;
          }
        }
      }
    });
  }

  /**
   * Add a new reaction between modules
   */
  addReaction(reaction: ModuleReaction) {
    this.reactions.push(reaction);
  }

  /**
   * Emit an event that other modules can react to
   */
  emit(event: ModuleEvent, data: any, priority: 'low' | 'normal' | 'high' | 'critical' = 'normal') {
    const payload: EventPayload = {
      module: event.split(':')[0],
      event,
      data,
      timestamp: new Date().toISOString(),
      priority
    };

    // Add to history
    this.eventHistory.push(payload);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify direct listeners
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(payload));
    }

    // Execute matching reactions
    this.reactions
      .filter(reaction => reaction.sourceEvent === event)
      .filter(reaction => !reaction.condition || reaction.condition(payload))
      .forEach(reaction => {
        try {
          reaction.action(payload);
        } catch (error) {
          console.error(`Error in reaction ${reaction.description}:`, error);
        }
      });

    // Log event
    console.log(`🔗 Module Event: ${event}`, data);
  }

  /**
   * Subscribe to specific events
   */
  on(event: ModuleEvent, callback: (payload: EventPayload) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event: ModuleEvent, callback: (payload: EventPayload) => void) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Get event history for analytics
   */
  getEventHistory(moduleFilter?: string): EventPayload[] {
    if (moduleFilter) {
      return this.eventHistory.filter(e => e.module === moduleFilter);
    }
    return [...this.eventHistory];
  }

  /**
   * Get all registered reactions
   */
  getReactions(): ModuleReaction[] {
    return [...this.reactions];
  }

  /**
   * Clear event history
   */
  clearHistory() {
    this.eventHistory = [];
  }

  // Helper methods for specific integrations
  private async getBudgetStatus() {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses
      .filter((e: any) => e.date.startsWith(thisMonth))
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    const monthlyBudget = 2000; // TODO: Make this configurable
    return {
      spent: monthlyExpenses,
      budget: monthlyBudget,
      overBudget: monthlyExpenses > monthlyBudget
    };
  }

  private inferMoodFromSong(songData: any): string {
    const energy = songData.energy || 0.5;
    const valence = songData.valence || 0.5;

    if (energy > 0.6 && valence > 0.6) return 'happy';
    if (energy > 0.6 && valence < 0.4) return 'angry';
    if (energy < 0.4 && valence > 0.6) return 'peaceful';
    if (energy < 0.4 && valence < 0.4) return 'sad';
    return 'neutral';
  }

  private async getNextLesson(courseId: string) {
    // Placeholder - would query actual course data
    return {
      id: crypto.randomUUID(),
      title: 'Next Lesson',
      duration: 30
    };
  }

  private getNextStudyDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow;
  }
}

// Export singleton instance
export const moduleOrchestrator = ModuleOrchestrator.getInstance();

// Start listening to events on app initialization
export function initializeModuleOrchestrator() {
  console.log('🎭 Module Orchestrator initialized');
  console.log(`📊 ${moduleOrchestrator.getReactions().length} cross-module reactions registered`);

  // Example: Subscribe to all events for debugging (remove in production)
  if (import.meta.env.DEV) {
    const allEvents: ModuleEvent[] = [
      'health:vitals-logged',
      'health:medication-taken',
      'health:pain-reported',
      'wellness:energy-low',
      'finance:expense-added',
      'tasks:goal-achieved',
      'calendar:event-started',
      'location:arrived-home',
      'music:song-playing',
      'crisis:emergency-triggered'
    ];

    allEvents.forEach(event => {
      moduleOrchestrator.on(event, (payload) => {
        console.log(`[${payload.module}] ${payload.event}:`, payload.data);
      });
    });
  }
}
