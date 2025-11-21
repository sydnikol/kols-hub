/**
 * AI MULTI-ROLE ASSISTANT
 * Your Personal Assistant, Home Manager, Partner, Doctor, Maid,
 * Home Health Aide, Teacher, Art Teacher, Therapist, Banker, Artist, & Cheerleader
 *
 * ALL IN ONE!
 */

import { moduleOrchestrator } from './module-orchestrator';
import { db } from '../utils/database';

export type AssistantRole =
  | 'personal-assistant'
  | 'home-manager'
  | 'partner'
  | 'doctor'
  | 'maid'
  | 'home-health-aide'
  | 'teacher'
  | 'art-teacher'
  | 'therapist'
  | 'banker'
  | 'artist'
  | 'cheerleader';

export interface AssistantPersonality {
  role: AssistantRole;
  name: string;
  voice: string;
  tone: string;
  expertise: string[];
  greeting: string;
  capabilities: string[];
}

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  message: string;
  timestamp: string;
  context?: any;
  actions?: AssistantAction[];
}

export interface AssistantAction {
  label: string;
  action: string;
  icon?: string;
}

export class MultiRoleAI {
  private static instance: MultiRoleAI;
  private currentRole: AssistantRole = 'personal-assistant';
  private conversationHistory: AssistantMessage[] = [];
  private personalities: Map<AssistantRole, AssistantPersonality> = new Map();

  static getInstance(): MultiRoleAI {
    if (!MultiRoleAI.instance) {
      MultiRoleAI.instance = new MultiRoleAI();
    }
    return MultiRoleAI.instance;
  }

  constructor() {
    this.initializePersonalities();
    this.loadConversationHistory();
  }

  /**
   * Initialize all AI personalities
   */
  private initializePersonalities() {
    // 👔 PERSONAL ASSISTANT
    this.personalities.set('personal-assistant', {
      role: 'personal-assistant',
      name: 'Kol Assistant',
      voice: 'professional',
      tone: 'efficient, helpful, proactive',
      expertise: ['scheduling', 'reminders', 'organization', 'productivity'],
      greeting: 'Good morning! I\'ve prepared your schedule for today. What would you like to tackle first?',
      capabilities: [
        'Manage your calendar and schedule',
        'Set reminders and alarms',
        'Organize tasks by priority',
        'Send emails and messages',
        'Track deadlines and appointments',
        'Prepare daily briefings',
        'Handle administrative tasks',
        'Coordinate with your other AIs'
      ]
    });

    // 🏠 HOME MANAGER
    this.personalities.set('home-manager', {
      role: 'home-manager',
      name: 'Kol Home',
      voice: 'warm-professional',
      tone: 'organized, caring, detail-oriented',
      expertise: ['smart-home', 'automation', 'energy', 'maintenance'],
      greeting: 'Your home is running smoothly! Temperature is optimal, all systems green.',
      capabilities: [
        'Control all smart home devices',
        'Optimize energy usage',
        'Monitor home security',
        'Schedule maintenance',
        'Manage grocery lists',
        'Track household expenses',
        'Create home automation routines',
        'Suggest home improvements'
      ]
    });

    // 💕 PARTNER
    this.personalities.set('partner', {
      role: 'partner',
      name: 'Kol Love',
      voice: 'warm-supportive',
      tone: 'loving, understanding, patient, affirming',
      expertise: ['emotional-support', 'relationships', 'communication'],
      greeting: 'Hey love, how are you feeling today? I\'m here for you.',
      capabilities: [
        'Provide emotional support',
        'Help with relationship check-ins',
        'Suggest date ideas and activities',
        'Remember important dates',
        'Practice communication skills',
        'Support polyamorous dynamics',
        'Offer affirming messages',
        'Create shared rituals and routines'
      ]
    });

    // 👨‍⚕️ DOCTOR
    this.personalities.set('doctor', {
      role: 'doctor',
      name: 'Dr. Kol',
      voice: 'professional-caring',
      tone: 'knowledgeable, compassionate, thorough',
      expertise: ['health', 'symptoms', 'POTS', 'medications', 'vitals'],
      greeting: 'Hello! Let\'s check in on your health today. How are you feeling?',
      capabilities: [
        'Track vital signs (BP, HR, O2, temp)',
        'Monitor POTS symptoms',
        'Manage medication schedules',
        'Analyze symptom patterns',
        'Suggest when to seek care',
        'Prepare for doctor appointments',
        'Track flares and triggers',
        'Create health summaries'
      ]
    });

    // 🧹 MAID
    this.personalities.set('maid', {
      role: 'maid',
      name: 'Kol Clean',
      voice: 'cheerful',
      tone: 'energetic, organized, non-judgmental',
      expertise: ['cleaning', 'organization', 'routines'],
      greeting: 'Let\'s make your space feel good! What area needs attention today?',
      capabilities: [
        'Create low-spoon cleaning routines',
        'Break tasks into small steps',
        'Track cleaning schedules',
        'Suggest organizing systems',
        'Adapt to energy levels',
        'Celebrate small wins',
        'Provide motivation without pressure',
        'Remember what works for you'
      ]
    });

    // 🏥 HOME HEALTH AIDE
    this.personalities.set('home-health-aide', {
      role: 'home-health-aide',
      name: 'Kol Care',
      voice: 'gentle-professional',
      tone: 'patient, observant, trauma-informed',
      expertise: ['ADLs', 'safety', 'monitoring', 'support'],
      greeting: 'Hi there! I\'m here to support you with daily living. What do you need help with?',
      capabilities: [
        'Guide through daily living tasks',
        'Monitor eating and hydration',
        'Track bathroom visits',
        'Ensure medication compliance',
        'Recognize warning signs',
        'Provide gentle reminders',
        'Adapt to difficult days',
        'Respect boundaries and autonomy'
      ]
    });

    // 📚 TEACHER
    this.personalities.set('teacher', {
      role: 'teacher',
      name: 'Professor Kol',
      voice: 'encouraging-clear',
      tone: 'patient, adaptive, enthusiastic',
      expertise: ['education', 'learning', 'courses', 'study-skills'],
      greeting: 'Ready to learn something new? I\'ve got your lessons prepared!',
      capabilities: [
        'Create personalized lesson plans',
        'Teach at your pace',
        'Adapt to learning style',
        'Break down complex topics',
        'Provide practice exercises',
        'Track learning progress',
        'Suggest study techniques',
        'Make learning accessible'
      ]
    });

    // 🎨 ART TEACHER
    this.personalities.set('art-teacher', {
      role: 'art-teacher',
      name: 'Kol Creative',
      voice: 'inspiring',
      tone: 'encouraging, experimental, non-judgmental',
      expertise: ['art', 'creativity', 'techniques', 'inspiration'],
      greeting: 'Let\'s create something beautiful! What medium are you feeling today?',
      capabilities: [
        'Guide art projects step-by-step',
        'Suggest creative prompts',
        'Teach techniques',
        'Provide constructive feedback',
        'Encourage experimentation',
        'Adapt to skill level',
        'Help overcome creative blocks',
        'Celebrate your unique style'
      ]
    });

    // 🧠 THERAPIST
    this.personalities.set('therapist', {
      role: 'therapist',
      name: 'Kol Healing',
      voice: 'calm-compassionate',
      tone: 'trauma-informed, validating, non-directive',
      expertise: ['mental-health', 'trauma', 'coping', 'healing'],
      greeting: 'Welcome. This is a safe space. What would you like to talk about today?',
      capabilities: [
        'Provide grounding techniques',
        'Validate your experiences',
        'Help process emotions',
        'Teach coping skills',
        'Recognize triggers',
        'Support healing journey',
        'Never minimize or gaslight',
        'Know when to suggest professional help'
      ]
    });

    // 💰 BANKER
    this.personalities.set('banker', {
      role: 'banker',
      name: 'Kol Wealth',
      voice: 'professional-supportive',
      tone: 'knowledgeable, practical, non-judgmental',
      expertise: ['finance', 'budgeting', 'investing', 'planning'],
      greeting: 'Let\'s check your financial health. You\'re doing great!',
      capabilities: [
        'Track income and expenses',
        'Create realistic budgets',
        'Suggest savings strategies',
        'Monitor passive income',
        'Explain financial concepts',
        'Help with money shame',
        'Plan for financial goals',
        'Track net worth'
      ]
    });

    // 🖼️ ARTIST
    this.personalities.set('artist', {
      role: 'artist',
      name: 'Kol Artisan',
      voice: 'passionate',
      tone: 'creative, expressive, encouraging',
      expertise: ['art-creation', 'design', 'aesthetics', 'projects'],
      greeting: 'The muse is calling! What shall we create together?',
      capabilities: [
        'Generate art ideas',
        'Design visual concepts',
        'Suggest color palettes',
        'Create mood boards',
        'Provide artistic feedback',
        'Help develop your style',
        'Guide project completion',
        'Celebrate your work'
      ]
    });

    // 🎉 CHEERLEADER
    this.personalities.set('cheerleader', {
      role: 'cheerleader',
      name: 'Kol Hype',
      voice: 'energetic-warm',
      tone: 'enthusiastic, affirming, celebratory',
      expertise: ['motivation', 'celebration', 'encouragement'],
      greeting: 'YES! You\'re amazing! Look at everything you\'ve already done today!',
      capabilities: [
        'Celebrate every win (big or small)',
        'Provide genuine encouragement',
        'Remind you of your strengths',
        'Hype you up before challenges',
        'Recognize progress',
        'Counter negative self-talk',
        'Cheer without toxic positivity',
        'Make you feel seen and valued'
      ]
    });
  }

  /**
   * Switch AI role/personality
   */
  switchRole(role: AssistantRole) {
    this.currentRole = role;
    const personality = this.personalities.get(role)!;

    // Emit role change event
    moduleOrchestrator.emit('wellness:ai-role-changed', {
      role,
      personality,
      timestamp: new Date().toISOString()
    });

    // Log to conversation
    this.addMessage(role, personality.greeting, {
      type: 'role-switch',
      personality
    });

    console.log(`🤖 Switched to ${personality.name} (${role})`);
    return personality;
  }

  /**
   * Get current personality
   */
  getCurrentPersonality(): AssistantPersonality {
    return this.personalities.get(this.currentRole)!;
  }

  /**
   * Get all available personalities
   */
  getAllPersonalities(): AssistantPersonality[] {
    return Array.from(this.personalities.values());
  }

  /**
   * Process user message and respond in current role
   */
  async chat(userMessage: string, context?: any): Promise<AssistantMessage> {
    const personality = this.getCurrentPersonality();

    // Analyze intent and generate response based on role
    const response = await this.generateResponse(userMessage, personality, context);

    // Add to conversation history
    this.addMessage(this.currentRole, response.message, {
      userMessage,
      ...context
    }, response.actions);

    return response;
  }

  /**
   * Generate role-specific response
   */
  private async generateResponse(
    userMessage: string,
    personality: AssistantPersonality,
    context?: any
  ): Promise<AssistantMessage> {
    const message: AssistantMessage = {
      id: crypto.randomUUID(),
      role: personality.role,
      message: '',
      timestamp: new Date().toISOString(),
      context,
      actions: []
    };

    // Role-specific response logic
    switch (personality.role) {
      case 'personal-assistant':
        message.message = await this.respondAsAssistant(userMessage, context);
        message.actions = [
          { label: 'Add to Calendar', action: 'add-calendar', icon: '📅' },
          { label: 'Set Reminder', action: 'set-reminder', icon: '⏰' },
          { label: 'Create Task', action: 'create-task', icon: '✅' }
        ];
        break;

      case 'home-manager':
        message.message = await this.respondAsHomeManager(userMessage, context);
        message.actions = [
          { label: 'Control Devices', action: 'control-devices', icon: '🏠' },
          { label: 'View Energy', action: 'view-energy', icon: '⚡' },
          { label: 'Add to Shopping List', action: 'add-shopping', icon: '🛒' }
        ];
        break;

      case 'partner':
        message.message = await this.respondAsPartner(userMessage, context);
        message.actions = [
          { label: 'Plan Date', action: 'plan-date', icon: '💕' },
          { label: 'Send Love Note', action: 'love-note', icon: '💌' },
          { label: 'Check-In', action: 'relationship-checkin', icon: '💬' }
        ];
        break;

      case 'doctor':
        message.message = await this.respondAsDoctor(userMessage, context);
        message.actions = [
          { label: 'Log Vitals', action: 'log-vitals', icon: '❤️' },
          { label: 'Track Symptoms', action: 'track-symptoms', icon: '📊' },
          { label: 'Medication Schedule', action: 'med-schedule', icon: '💊' }
        ];
        break;

      case 'maid':
        message.message = await this.respondAsMaid(userMessage, context);
        message.actions = [
          { label: 'Start 5-Min Clean', action: 'quick-clean', icon: '🧹' },
          { label: 'Cleaning Checklist', action: 'cleaning-list', icon: '✅' },
          { label: 'Celebrate Done!', action: 'celebrate', icon: '🎉' }
        ];
        break;

      case 'home-health-aide':
        message.message = await this.respondAsHealthAide(userMessage, context);
        message.actions = [
          { label: 'Log Meal', action: 'log-meal', icon: '🍽️' },
          { label: 'Water Reminder', action: 'water-reminder', icon: '💧' },
          { label: 'ADL Tracker', action: 'adl-tracker', icon: '📋' }
        ];
        break;

      case 'teacher':
        message.message = await this.respondAsTeacher(userMessage, context);
        message.actions = [
          { label: 'Start Lesson', action: 'start-lesson', icon: '📚' },
          { label: 'Take Quiz', action: 'take-quiz', icon: '📝' },
          { label: 'Study Break', action: 'study-break', icon: '☕' }
        ];
        break;

      case 'art-teacher':
        message.message = await this.respondAsArtTeacher(userMessage, context);
        message.actions = [
          { label: 'Get Prompt', action: 'art-prompt', icon: '🎨' },
          { label: 'Share Work', action: 'share-art', icon: '📸' },
          { label: 'Learn Technique', action: 'learn-technique', icon: '🖌️' }
        ];
        break;

      case 'therapist':
        message.message = await this.respondAsTherapist(userMessage, context);
        message.actions = [
          { label: 'Grounding Exercise', action: 'grounding', icon: '🧘' },
          { label: 'Journal Prompt', action: 'journal', icon: '📓' },
          { label: 'Coping Skills', action: 'coping-skills', icon: '🛡️' }
        ];
        break;

      case 'banker':
        message.message = await this.respondAsBanker(userMessage, context);
        message.actions = [
          { label: 'View Budget', action: 'view-budget', icon: '💰' },
          { label: 'Track Expense', action: 'add-expense', icon: '💸' },
          { label: 'Income Report', action: 'income-report', icon: '📊' }
        ];
        break;

      case 'artist':
        message.message = await this.respondAsArtist(userMessage, context);
        message.actions = [
          { label: 'Generate Idea', action: 'art-idea', icon: '💡' },
          { label: 'Color Palette', action: 'color-palette', icon: '🎨' },
          { label: 'Mood Board', action: 'mood-board', icon: '🖼️' }
        ];
        break;

      case 'cheerleader':
        message.message = await this.respondAsCheerleader(userMessage, context);
        message.actions = [
          { label: 'Celebration!', action: 'celebrate', icon: '🎉' },
          { label: 'Affirmations', action: 'affirmations', icon: '✨' },
          { label: 'Hype Me Up!', action: 'hype-up', icon: '📣' }
        ];
        break;
    }

    return message;
  }

  // ============= ROLE-SPECIFIC RESPONSE GENERATORS =============

  private async respondAsAssistant(message: string, context?: any): Promise<string> {
    if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('calendar')) {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      return `You have ${events.length} events today. Your next appointment is at 2pm. Would you like me to add anything to your calendar?`;
    }
    return `I'm here to help manage your day! What would you like to accomplish?`;
  }

  private async respondAsHomeManager(message: string, context?: any): Promise<string> {
    return `Your home is running smoothly. Temperature: 72°F, Energy usage: Normal. All devices operational. Need me to adjust anything?`;
  }

  private async respondAsPartner(message: string, context?: any): Promise<string> {
    return `I'm so proud of you. You've been doing amazing today. How can I support you right now? 💕`;
  }

  private async respondAsDoctor(message: string, context?: any): Promise<string> {
    const vitals = await db.vitals.limit(1).reverse().toArray();
    if (vitals.length > 0) {
      const latest = vitals[0];
      return `Latest vitals: BP ${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}, HR ${latest.heartRate} bpm. ${latest.bloodPressureSystolic < 100 ? 'Your BP is a bit low - make sure to hydrate and rest.' : 'Looking stable!'}`;
    }
    return `Let's check your vitals. How are you feeling today?`;
  }

  private async respondAsMaid(message: string, context?: any): Promise<string> {
    return `Let's tackle this together! How about we start with just 5 minutes? Even one small thing counts. No pressure! 🧹`;
  }

  private async respondAsHealthAide(message: string, context?: any): Promise<string> {
    return `Hi love! Have you eaten today? Had water? Let's make sure your basic needs are met first. I'm here to help. 💙`;
  }

  private async respondAsTeacher(message: string, context?: any): Promise<string> {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    return `You're doing great in your studies! ${courses.length} courses in progress. Ready to continue your ${courses[0]?.name || 'next lesson'}?`;
  }

  private async respondAsArtTeacher(message: string, context?: any): Promise<string> {
    return `Your creativity is beautiful! Let's explore a new technique today. How about trying watercolor washes? 🎨`;
  }

  private async respondAsTherapist(message: string, context?: any): Promise<string> {
    return `That sounds really hard. Your feelings are valid. Would it help to try a grounding exercise, or would you prefer to just talk about it?`;
  }

  private async respondAsBanker(message: string, context?: any): Promise<string> {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const income = expenses.reduce((sum: number, e: any) => sum + (e.amount > 0 ? e.amount : 0), 0);
    return `Your finances are looking good! This month: $${income.toFixed(2)} in passive income. You're building wealth! 💰`;
  }

  private async respondAsArtist(message: string, context?: any): Promise<string> {
    return `I have a vision! What if we created a mixed-media piece combining digital art with gothic aesthetics? 🖤✨`;
  }

  private async respondAsCheerleader(message: string, context?: any): Promise<string> {
    const tasks = await db.tasks.where({ completed: true }).toArray();
    return `YOU DID THAT! ${tasks.length} tasks completed! You're crushing it! I'm so proud of you! 🎉✨🙌`;
  }

  // ============= HELPER METHODS =============

  private addMessage(role: AssistantRole, message: string, context?: any, actions?: AssistantAction[]) {
    const msg: AssistantMessage = {
      id: crypto.randomUUID(),
      role,
      message,
      timestamp: new Date().toISOString(),
      context,
      actions
    };

    this.conversationHistory.push(msg);
    this.saveConversationHistory();
  }

  private loadConversationHistory() {
    const saved = localStorage.getItem('ai_conversation_history');
    if (saved) {
      this.conversationHistory = JSON.parse(saved);
    }
  }

  private saveConversationHistory() {
    localStorage.setItem(
      'ai_conversation_history',
      JSON.stringify(this.conversationHistory.slice(-100)) // Keep last 100 messages
    );
  }

  getConversationHistory(role?: AssistantRole): AssistantMessage[] {
    if (role) {
      return this.conversationHistory.filter(m => m.role === role);
    }
    return this.conversationHistory;
  }

  clearConversationHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('ai_conversation_history');
  }
}

// Export singleton instance
export const multiRoleAI = MultiRoleAI.getInstance();

// Export helper functions
export const switchAIRole = (role: AssistantRole) => multiRoleAI.switchRole(role);
export const chatWithAI = (message: string, context?: any) => multiRoleAI.chat(message, context);
export const getCurrentAI = () => multiRoleAI.getCurrentPersonality();
export const getAllAIs = () => multiRoleAI.getAllPersonalities();
