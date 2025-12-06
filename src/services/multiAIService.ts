/**
 * MULTI-MODEL AI SERVICE
 * Unified interface for multiple AI providers
 *
 * Supported Models:
 * - Anthropic Claude (Opus, Sonnet, Haiku)
 * - OpenAI GPT (GPT-4, GPT-3.5)
 * - Google Gemini (Pro, Ultra)
 * - Local models via Ollama
 */

export type AIProvider = 'anthropic' | 'openai' | 'google' | 'ollama';
export type AIModel =
  // Anthropic
  | 'claude-opus-4' | 'claude-sonnet-4' | 'claude-haiku-4'
  // OpenAI
  | 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
  // Google
  | 'gemini-pro' | 'gemini-ultra'
  // Local
  | 'llama-2' | 'mistral';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  imageUrl?: string;
}

export interface ChatOptions {
  model: AIModel;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  conversationHistory?: Message[];
  characterPersonality?: CharacterPersonality;
}

export interface CharacterPersonality {
  name: string;
  avatar?: string;
  traits: string[];
  backstory: string;
  speakingStyle: string;
  interests: string[];
  relationship?: string; // e.g., "romantic partner", "friend", "mentor"
  memoryContext?: string[]; // Recent memories
}

export interface AIResponse {
  message: string;
  model: string;
  provider: AIProvider;
  tokens?: number;
  cost?: number;
  timestamp: Date;
}

class MultiAIService {
  private readonly STORAGE_KEY_PREFIX = 'ai_api_key_';
  private conversationMemories: Map<string, Message[]> = new Map();

  /**
   * Get API key for a provider
   */
  private getAPIKey(provider: AIProvider): string | null {
    return localStorage.getItem(`${this.STORAGE_KEY_PREFIX}${provider}`);
  }

  /**
   * Set API key for a provider
   */
  setAPIKey(provider: AIProvider, apiKey: string): void {
    localStorage.setItem(`${this.STORAGE_KEY_PREFIX}${provider}`, apiKey);
  }

  /**
   * Get provider for a model
   */
  private getProviderForModel(model: AIModel): AIProvider {
    if (model.startsWith('claude')) return 'anthropic';
    if (model.startsWith('gpt')) return 'openai';
    if (model.startsWith('gemini')) return 'google';
    return 'ollama';
  }

  /**
   * Build system prompt with character personality
   */
  private buildSystemPrompt(personality?: CharacterPersonality, customPrompt?: string): string {
    let prompt = customPrompt || 'You are a helpful AI assistant.';

    if (personality) {
      prompt = `You are ${personality.name}.

PERSONALITY TRAITS: ${personality.traits.join(', ')}

BACKSTORY: ${personality.backstory}

SPEAKING STYLE: ${personality.speakingStyle}

INTERESTS: ${personality.interests.join(', ')}

${personality.relationship ? `RELATIONSHIP TO USER: ${personality.relationship}` : ''}

${personality.memoryContext && personality.memoryContext.length > 0 ? `
RECENT MEMORIES:
${personality.memoryContext.join('\n')}
` : ''}

Always stay in character. Respond naturally as ${personality.name} would.`;
    }

    return prompt;
  }

  /**
   * Chat with Anthropic Claude
   */
  private async chatAnthropic(
    messages: Message[],
    model: string,
    systemPrompt: string,
    temperature: number,
    maxTokens: number
  ): Promise<AIResponse> {
    const apiKey = this.getAPIKey('anthropic');
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role === 'system' ? 'user' : m.role,
          content: m.content
        })),
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.content[0].text,
      model: model,
      provider: 'anthropic',
      tokens: data.usage.input_tokens + data.usage.output_tokens,
      timestamp: new Date()
    };
  }

  /**
   * Chat with OpenAI GPT
   */
  private async chatOpenAI(
    messages: Message[],
    model: string,
    systemPrompt: string,
    temperature: number,
    maxTokens: number
  ): Promise<AIResponse> {
    const apiKey = this.getAPIKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: chatMessages,
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.choices[0].message.content,
      model: model,
      provider: 'openai',
      tokens: data.usage.total_tokens,
      cost: this.calculateOpenAICost(model, data.usage.total_tokens),
      timestamp: new Date()
    };
  }

  /**
   * Chat with Google Gemini
   */
  private async chatGemini(
    messages: Message[],
    model: string,
    systemPrompt: string,
    temperature: number,
    maxTokens: number
  ): Promise<AIResponse> {
    const apiKey = this.getAPIKey('google');
    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.candidates[0].content.parts[0].text,
      model: model,
      provider: 'google',
      timestamp: new Date()
    };
  }

  /**
   * Main chat method - routes to appropriate provider
   */
  async chat(userMessage: string, options: ChatOptions): Promise<AIResponse> {
    const {
      model,
      temperature = 0.7,
      maxTokens = 2000,
      systemPrompt,
      conversationHistory = [],
      characterPersonality
    } = options;

    const provider = this.getProviderForModel(model);
    const finalSystemPrompt = this.buildSystemPrompt(characterPersonality, systemPrompt);

    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: userMessage, timestamp: new Date() }
    ];

    let response: AIResponse;

    switch (provider) {
      case 'anthropic':
        response = await this.chatAnthropic(messages, model, finalSystemPrompt, temperature, maxTokens);
        break;
      case 'openai':
        response = await this.chatOpenAI(messages, model, finalSystemPrompt, temperature, maxTokens);
        break;
      case 'google':
        response = await this.chatGemini(messages, model, finalSystemPrompt, temperature, maxTokens);
        break;
      default:
        throw new Error(`Provider ${provider} not yet implemented`);
    }

    // Store conversation in memory
    if (characterPersonality) {
      this.addToMemory(characterPersonality.name, {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });
      this.addToMemory(characterPersonality.name, {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp
      });
    }

    return response;
  }

  /**
   * Add message to conversation memory
   */
  private addToMemory(characterId: string, message: Message): void {
    const history = this.conversationMemories.get(characterId) || [];
    history.push(message);

    // Keep last 50 messages
    if (history.length > 50) {
      history.shift();
    }

    this.conversationMemories.set(characterId, history);

    // Persist to localStorage
    localStorage.setItem(`conversation_${characterId}`, JSON.stringify(history));
  }

  /**
   * Get conversation history for a character
   */
  getConversationHistory(characterId: string): Message[] {
    // Try memory first
    let history = this.conversationMemories.get(characterId);

    // Fall back to localStorage
    if (!history) {
      const stored = localStorage.getItem(`conversation_${characterId}`);
      if (stored) {
        history = JSON.parse(stored);
        this.conversationMemories.set(characterId, history);
      }
    }

    return history || [];
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory(characterId: string): void {
    this.conversationMemories.delete(characterId);
    localStorage.removeItem(`conversation_${characterId}`);
  }

  /**
   * Get recent memories as summary
   */
  getRecentMemories(characterId: string, count: number = 5): string[] {
    const history = this.getConversationHistory(characterId);
    return history
      .slice(-count * 2) // Get last N exchanges (user + assistant)
      .map(m => `${m.role === 'user' ? 'User' : characterId}: ${m.content}`)
      .slice(-count); // Take last N
  }

  /**
   * Calculate OpenAI cost
   */
  private calculateOpenAICost(model: string, tokens: number): number {
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4': { input: 0.03, output: 0.06 }, // per 1K tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
    };

    const rates = pricing[model] || pricing['gpt-3.5-turbo'];
    return (tokens / 1000) * rates.output; // Simplified
  }

  /**
   * Get available models
   */
  getAvailableModels(): AIModel[] {
    const models: AIModel[] = [];

    if (this.getAPIKey('anthropic')) {
      models.push('claude-opus-4', 'claude-sonnet-4', 'claude-haiku-4');
    }
    if (this.getAPIKey('openai')) {
      models.push('gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo');
    }
    if (this.getAPIKey('google')) {
      models.push('gemini-pro', 'gemini-ultra');
    }

    return models;
  }
}

export const multiAIService = new MultiAIService();
