/**
 * GROK (xAI) INTEGRATION
 * Real-time AI with X platform access and web search
 * https://grok.com/
 */

interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GrokChatRequest {
  messages: GrokMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface GrokChatResponse {
  id: string;
  model: string;
  choices: Array<{
    message: GrokMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class GrokIntegration {
  private apiKey: string;
  private baseURL: string = 'https://api.x.ai/v1';

  constructor() {
    this.apiKey = localStorage.getItem('grok_api_key') || '';
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('grok_api_key', key);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Send a chat completion request to Grok
   */
  async chat(request: GrokChatRequest): Promise<GrokChatResponse> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || 'grok-beta',
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.max_tokens ?? 2048,
          stream: request.stream ?? false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Grok API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Grok API Error:', error);
      throw error;
    }
  }

  /**
   * Simple chat helper - sends a single message and returns the response
   */
  async ask(prompt: string, systemMessage?: string): Promise<string> {
    const messages: GrokMessage[] = [];

    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.chat({ messages });
    return response.choices[0]?.message?.content || '';
  }

  /**
   * Get real-time information using Grok's X platform access
   */
  async getRealtimeInfo(query: string): Promise<string> {
    return this.ask(
      query,
      'You have access to real-time information from X (Twitter) and the web. Provide current, accurate information based on the latest data available.'
    );
  }

  /**
   * Code generation with Grok
   */
  async generateCode(description: string, language: string = 'typescript'): Promise<string> {
    return this.ask(
      `Generate ${language} code for: ${description}`,
      'You are an expert programmer. Generate clean, efficient, well-documented code.'
    );
  }

  /**
   * Get Grok's witty response (Grok's signature feature)
   */
  async getWittyResponse(topic: string): Promise<string> {
    return this.ask(
      topic,
      'You are Grok, an AI with a sense of humor and a witty personality. Respond with intelligence and a touch of humor.'
    );
  }

  /**
   * Test the Grok API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.ask('Hello, Grok!');
      return true;
    } catch (error) {
      console.error('Grok connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models
   */
  async getModels(): Promise<string[]> {
    // As of now, Grok has limited model options
    // This will be updated as xAI releases more models
    return ['grok-beta', 'grok-1'];
  }
}

export const grokIntegration = new GrokIntegration();
export default grokIntegration;
