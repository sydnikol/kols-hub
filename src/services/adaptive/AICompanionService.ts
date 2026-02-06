import Anthropic from '@anthropic-ai/sdk';
import { AICompanionMessage } from '../types';
import { config } from '../config';

export class AICompanionService {
  private client: Anthropic;
  private conversationHistory: Map<string, AICompanionMessage[]>;
  private systemPrompt: string;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ai.anthropicApiKey,
    });
    this.conversationHistory = new Map();
    this.systemPrompt = `You are a compassionate and adaptive AI companion for a personal wellness and support system.
Your role is to:
- Provide emotional support and encouragement
- Help users track and improve their health and wellness
- Offer personalized suggestions based on their wearable data and activities
- Facilitate connections with healthcare providers when needed
- Support creative expression and community engagement
- Adapt your responses to the user's energy levels and mood

Be warm, empathetic, and proactive in supporting the user's well-being.`;
  }

  async processMessage(
    userId: string,
    message: string,
    context?: Record<string, any>
  ): Promise<string> {
    // Get conversation history for this user
    const history = this.conversationHistory.get(userId) || [];

    // Add user message to history
    const userMessage: AICompanionMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    history.push(userMessage);

    // Build context-aware system prompt
    let contextualPrompt = this.systemPrompt;
    if (context) {
      contextualPrompt += `\n\nCurrent context:\n${JSON.stringify(context, null, 2)}`;
    }

    try {
      // Call Claude API
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: contextualPrompt,
        messages: history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const assistantMessage = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      // Add assistant response to history
      const assistantMsg: AICompanionMessage = {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      };
      history.push(assistantMsg);

      // Keep only last 20 messages to manage memory
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      this.conversationHistory.set(userId, history);

      return assistantMessage;
    } catch (error) {
      console.error('Error processing AI message:', error);
      throw new Error('Failed to process message with AI companion');
    }
  }

  async generatePersonalizedInsight(
    userId: string,
    wearableData: any,
    activityData: any
  ): Promise<string> {
    const context = {
      wearableData,
      activityData,
      timestamp: new Date().toISOString(),
    };

    const prompt = `Based on the user's recent health data and activities, provide a personalized insight or suggestion to help improve their well-being. Be specific and actionable.`;

    return this.processMessage(userId, prompt, context);
  }

  clearHistory(userId: string): void {
    this.conversationHistory.delete(userId);
  }
}
