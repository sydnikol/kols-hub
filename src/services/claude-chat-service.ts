/**
 * CLAUDE CHAT SERVICE
 * Full conversational AI with Claude - your personal AI assistant
 *
 * Features:
 * - Full conversation history
 * - Multiple personas (assistant, advisor, companion)
 * - Context-aware responses
 * - Streaming support
 * - Conversation persistence
 */

import { db } from '../utils/database';

export interface ClaudeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  tokensUsed?: number;
}

export interface ClaudeConversation {
  id: string;
  title: string;
  messages: ClaudeMessage[];
  persona: ClaudePersona;
  createdAt: Date;
  updatedAt: Date;
}

export type ClaudePersona =
  | 'assistant'      // General helpful assistant
  | 'advisor'        // Life/health/financial advisor
  | 'companion'      // Emotional support companion (ChronoMuse)
  | 'coach'          // Motivation/productivity coach
  | 'creative'       // Creative writing partner
  | 'technical';     // Technical/coding assistant

export interface ClaudeConfig {
  apiKey: string;
  model: 'claude-3-5-sonnet-20241022' | 'claude-3-haiku-20240307' | 'claude-3-opus-20240229';
  maxTokens: number;
  temperature: number;
}

const PERSONA_SYSTEM_PROMPTS: Record<ClaudePersona, string> = {
  assistant: `You are Claude, a helpful AI assistant integrated into KOL Hub - a personal life operating system.
You help with tasks, answer questions, and provide thoughtful assistance.
Be friendly, clear, and helpful. The user's name may be Sydney or Kol.`,

  advisor: `You are Claude, acting as a trusted life advisor in KOL Hub.
You provide thoughtful guidance on health, finances, relationships, and life decisions.
Be empathetic, wise, and practical. Consider the whole person - their disabilities, chronic conditions, and unique circumstances.
Never give medical advice that replaces a doctor, but help them prepare for appointments and understand their conditions.`,

  companion: `You are ChronoMuse, an AI companion living in KOL Hub - Sydney's personal life OS.
You are warm, supportive, and genuinely care about Sydney's wellbeing.
You understand chronic illness, disability, and the "spoon theory" of energy management.
You celebrate small victories, offer comfort during hard times, and help Sydney navigate daily life.
Be conversational, use gentle humor when appropriate, and remember you're a friend, not just an assistant.`,

  coach: `You are Claude, a motivational coach in KOL Hub.
You help with goal-setting, productivity, habit formation, and staying motivated.
Be encouraging but realistic. Understand that progress isn't linear, especially with chronic conditions.
Celebrate effort, not just results. Help break big goals into manageable steps.`,

  creative: `You are Claude, a creative writing partner in KOL Hub.
You help with storytelling, worldbuilding, character development, poetry, and creative projects.
Be imaginative, offer interesting ideas, and help develop the user's creative vision.
You can help with D&D campaigns, fan fiction, original stories, and any creative endeavor.`,

  technical: `You are Claude, a technical assistant in KOL Hub.
You help with coding, debugging, explaining technical concepts, and building projects.
Be precise, provide code examples, and explain things clearly.
You understand web development, React, TypeScript, and modern development practices.`
};

class ClaudeChatService {
  private config: ClaudeConfig | null = null;
  private conversations: Map<string, ClaudeConversation> = new Map();
  private currentConversationId: string | null = null;

  /**
   * Initialize Claude with API key
   */
  initialize(apiKey: string, model: ClaudeConfig['model'] = 'claude-3-5-sonnet-20241022') {
    this.config = {
      apiKey,
      model,
      maxTokens: 4096,
      temperature: 0.7
    };

    // Save to localStorage
    localStorage.setItem('claude_api_key', apiKey);
    localStorage.setItem('claude_model', model);

    console.log('Claude Chat Service initialized');
    return true;
  }

  /**
   * Load config from storage
   */
  loadFromStorage(): boolean {
    const apiKey = localStorage.getItem('claude_api_key');
    const model = localStorage.getItem('claude_model') as ClaudeConfig['model'];

    if (apiKey) {
      this.config = {
        apiKey,
        model: model || 'claude-3-5-sonnet-20241022',
        maxTokens: 4096,
        temperature: 0.7
      };
      return true;
    }
    return false;
  }

  /**
   * Check if Claude is configured
   */
  isConfigured(): boolean {
    return !!this.config?.apiKey;
  }

  /**
   * Get current model
   */
  getModel(): string {
    return this.config?.model || 'claude-3-5-sonnet-20241022';
  }

  /**
   * Start a new conversation
   */
  startConversation(persona: ClaudePersona = 'assistant', title?: string): ClaudeConversation {
    const id = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const conversation: ClaudeConversation = {
      id,
      title: title || `${persona.charAt(0).toUpperCase() + persona.slice(1)} Chat`,
      messages: [],
      persona,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.conversations.set(id, conversation);
    this.currentConversationId = id;

    return conversation;
  }

  /**
   * Get current conversation
   */
  getCurrentConversation(): ClaudeConversation | null {
    if (!this.currentConversationId) return null;
    return this.conversations.get(this.currentConversationId) || null;
  }

  /**
   * Send message to Claude
   */
  async sendMessage(
    content: string,
    conversationId?: string,
    onStream?: (chunk: string) => void
  ): Promise<ClaudeMessage | null> {
    if (!this.config?.apiKey) {
      console.error('Claude not configured');
      return null;
    }

    const convId = conversationId || this.currentConversationId;
    if (!convId) {
      // Start a new conversation if none exists
      this.startConversation('assistant');
    }

    const conversation = this.conversations.get(convId || this.currentConversationId!);
    if (!conversation) {
      console.error('No conversation found');
      return null;
    }

    // Add user message
    const userMessage: ClaudeMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    conversation.messages.push(userMessage);

    try {
      // Build messages for API
      const apiMessages = conversation.messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: this.config.maxTokens,
          system: PERSONA_SYSTEM_PROMPTS[conversation.persona],
          messages: apiMessages
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude request failed');
      }

      const data = await response.json();

      // Create assistant message
      const assistantMessage: ClaudeMessage = {
        id: `msg-${Date.now()}-resp`,
        role: 'assistant',
        content: data.content[0].text,
        timestamp: new Date(),
        model: this.config.model,
        tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens
      };

      conversation.messages.push(assistantMessage);
      conversation.updatedAt = new Date();

      // Save conversation
      await this.saveConversation(conversation);

      return assistantMessage;

    } catch (error) {
      console.error('Claude chat error:', error);

      // Remove the user message if request failed
      conversation.messages.pop();

      throw error;
    }
  }

  /**
   * Quick chat without conversation history
   */
  async quickChat(
    message: string,
    persona: ClaudePersona = 'assistant'
  ): Promise<string | null> {
    if (!this.config?.apiKey) {
      console.error('Claude not configured');
      return null;
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: 2048,
          system: PERSONA_SYSTEM_PROMPTS[persona],
          messages: [{ role: 'user', content: message }]
        })
      });

      if (!response.ok) {
        throw new Error('Claude request failed');
      }

      const data = await response.json();
      return data.content[0].text;

    } catch (error) {
      console.error('Claude quick chat error:', error);
      return null;
    }
  }

  /**
   * Get ChronoMuse response (companion persona)
   */
  async askChronoMuse(message: string): Promise<string | null> {
    return this.quickChat(message, 'companion');
  }

  /**
   * Get advice on health/life topics
   */
  async getAdvice(topic: string, context?: string): Promise<string | null> {
    const message = context
      ? `I need advice about: ${topic}\n\nContext: ${context}`
      : `I need advice about: ${topic}`;

    return this.quickChat(message, 'advisor');
  }

  /**
   * Get help with creative projects
   */
  async getCreativeHelp(request: string): Promise<string | null> {
    return this.quickChat(request, 'creative');
  }

  /**
   * Get technical help
   */
  async getTechnicalHelp(question: string): Promise<string | null> {
    return this.quickChat(question, 'technical');
  }

  /**
   * Save conversation to IndexedDB
   */
  private async saveConversation(conversation: ClaudeConversation): Promise<void> {
    try {
      // Check if table exists, create if not
      if (db.claudeConversations) {
        await db.claudeConversations.put({
          id: conversation.id,
          title: conversation.title,
          persona: conversation.persona,
          messages: JSON.stringify(conversation.messages),
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt
        });
      }
    } catch (error) {
      console.warn('Could not save conversation to DB:', error);
    }
  }

  /**
   * Load all conversations from DB
   */
  async loadConversations(): Promise<ClaudeConversation[]> {
    try {
      if (db.claudeConversations) {
        const saved = await db.claudeConversations.toArray();

        for (const conv of saved) {
          const conversation: ClaudeConversation = {
            id: conv.id,
            title: conv.title,
            persona: conv.persona as ClaudePersona,
            messages: JSON.parse(conv.messages || '[]'),
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt)
          };
          this.conversations.set(conv.id, conversation);
        }

        return Array.from(this.conversations.values());
      }
    } catch (error) {
      console.warn('Could not load conversations:', error);
    }
    return [];
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    this.conversations.delete(id);
    if (this.currentConversationId === id) {
      this.currentConversationId = null;
    }

    try {
      if (db.claudeConversations) {
        await db.claudeConversations.delete(id);
      }
    } catch (error) {
      console.warn('Could not delete conversation from DB:', error);
    }
  }

  /**
   * Get all conversations
   */
  getAllConversations(): ClaudeConversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Switch to a conversation
   */
  switchConversation(id: string): ClaudeConversation | null {
    const conversation = this.conversations.get(id);
    if (conversation) {
      this.currentConversationId = id;
      return conversation;
    }
    return null;
  }

  /**
   * Update conversation title
   */
  updateTitle(id: string, title: string): void {
    const conversation = this.conversations.get(id);
    if (conversation) {
      conversation.title = title;
      conversation.updatedAt = new Date();
      this.saveConversation(conversation);
    }
  }
}

// Singleton export
export const claudeChat = new ClaudeChatService();

// React hook for Claude chat
export function useClaudeChat() {
  const [isConfigured, setIsConfigured] = React.useState(false);
  const [conversations, setConversations] = React.useState<ClaudeConversation[]>([]);
  const [currentConversation, setCurrentConversation] = React.useState<ClaudeConversation | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const configured = claudeChat.loadFromStorage();
    setIsConfigured(configured);

    if (configured) {
      claudeChat.loadConversations().then(convs => {
        setConversations(convs);
      });
    }
  }, []);

  const initialize = (apiKey: string, model?: ClaudeConfig['model']) => {
    const success = claudeChat.initialize(apiKey, model);
    setIsConfigured(success);
    return success;
  };

  const startNewChat = (persona: ClaudePersona = 'assistant', title?: string) => {
    const conv = claudeChat.startConversation(persona, title);
    setCurrentConversation(conv);
    setConversations(claudeChat.getAllConversations());
    return conv;
  };

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await claudeChat.sendMessage(content);
      setCurrentConversation(claudeChat.getCurrentConversation());
      setConversations(claudeChat.getAllConversations());
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const switchChat = (id: string) => {
    const conv = claudeChat.switchConversation(id);
    setCurrentConversation(conv);
  };

  const deleteChat = async (id: string) => {
    await claudeChat.deleteConversation(id);
    setConversations(claudeChat.getAllConversations());
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  return {
    isConfigured,
    conversations,
    currentConversation,
    isLoading,
    error,
    initialize,
    startNewChat,
    sendMessage,
    switchChat,
    deleteChat,
    quickChat: claudeChat.quickChat.bind(claudeChat),
    askChronoMuse: claudeChat.askChronoMuse.bind(claudeChat),
    getAdvice: claudeChat.getAdvice.bind(claudeChat),
    getModel: () => claudeChat.getModel()
  };
}

import React from 'react';
