/**
 * INWORLD AI INTEGRATION
 * AI-Powered Characters and Interactive NPCs
 *
 * Inworld AI Features:
 * - Character-based conversations
 * - Contextual memory
 * - Emotional intelligence
 * - Multi-modal interactions
 * - Real-time voice synthesis
 * - Scene understanding
 *
 * Perfect For:
 * - Interactive content creation
 * - Virtual assistants
 * - Gaming NPCs
 * - Customer service bots
 * - Educational characters
 * - Entertainment experiences
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

export interface InworldConfig {
  workspaceId: string;
  apiKey: string;
  apiSecret: string;
  sceneId?: string;
}

export interface InworldCharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  background: string;
  goals: string[];
  emotions: string[];
}

export interface InworldMessage {
  characterId: string;
  text: string;
  emotion?: string;
  action?: string;
  context?: Record<string, any>;
}

export interface InworldResponse {
  characterId: string;
  text: string;
  emotion: string;
  action?: string;
  audioUrl?: string;
  timestamp: number;
}

export interface InworldSession {
  id: string;
  characterId: string;
  startedAt: number;
  messageCount: number;
  context: Record<string, any>;
}

class InworldAIIntegration {
  private config: InworldConfig | null = null;
  private sessions: Map<string, InworldSession> = new Map();
  private characters: Map<string, InworldCharacter> = new Map();
  private baseUrl = 'https://api.inworld.ai/v1';

  /**
   * Initialize Inworld AI
   */
  initialize(config: InworldConfig): void {
    this.config = config;

    // Save to localStorage
    localStorage.setItem('inworld_workspace_id', config.workspaceId);
    localStorage.setItem('inworld_api_key', config.apiKey);
    localStorage.setItem('inworld_api_secret', config.apiSecret);
    if (config.sceneId) {
      localStorage.setItem('inworld_scene_id', config.sceneId);
    }

    console.log('✅ Inworld AI initialized');
    console.log('Workspace:', config.workspaceId);
  }

  /**
   * Load from localStorage
   */
  loadFromStorage(): boolean {
    const workspaceId = localStorage.getItem('inworld_workspace_id');
    const apiKey = localStorage.getItem('inworld_api_key');
    const apiSecret = localStorage.getItem('inworld_api_secret');
    const sceneId = localStorage.getItem('inworld_scene_id') || undefined;

    if (workspaceId && apiKey && apiSecret) {
      this.config = { workspaceId, apiKey, apiSecret, sceneId };
      return true;
    }

    return false;
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    if (this.config) return true;
    return this.loadFromStorage();
  }

  /**
   * Create authorization header
   */
  private getAuthHeader(): string {
    if (!this.config) throw new Error('Inworld AI not initialized');

    const credentials = `${this.config.apiKey}:${this.config.apiSecret}`;
    const base64 = btoa(credentials);
    return `Basic ${base64}`;
  }

  /**
   * Create a new character
   */
  async createCharacter(character: Omit<InworldCharacter, 'id'>): Promise<InworldCharacter> {
    if (!this.config) throw new Error('Inworld AI not initialized');

    const breaker = CircuitBreakerRegistry.get('inworld-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/workspaces/${this.config!.workspaceId}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify(character)
      });

      if (!response.ok) {
        throw new Error(`Inworld API error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      MetricsCollector.recordAPICall('inworld', true, duration);
      MetricsCollector.incrementCounter('inworld.characters.created', 1);

      const newCharacter: InworldCharacter = {
        id: data.id || Date.now().toString(),
        ...character
      };

      this.characters.set(newCharacter.id, newCharacter);
      return newCharacter;
    });
  }

  /**
   * List all characters
   */
  async listCharacters(): Promise<InworldCharacter[]> {
    if (!this.config) throw new Error('Inworld AI not initialized');

    const breaker = CircuitBreakerRegistry.get('inworld-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/workspaces/${this.config!.workspaceId}/characters`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`Inworld API error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      MetricsCollector.recordAPICall('inworld', true, duration);

      const characters = data.characters || [];
      characters.forEach((char: InworldCharacter) => {
        this.characters.set(char.id, char);
      });

      return characters;
    });
  }

  /**
   * Start a conversation session
   */
  async startSession(characterId: string, context?: Record<string, any>): Promise<InworldSession> {
    if (!this.config) throw new Error('Inworld AI not initialized');

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: InworldSession = {
      id: sessionId,
      characterId,
      startedAt: Date.now(),
      messageCount: 0,
      context: context || {}
    };

    this.sessions.set(sessionId, session);

    MetricsCollector.incrementCounter('inworld.sessions.started', 1, { characterId });

    console.log(`📱 Started Inworld session: ${sessionId}`);
    return session;
  }

  /**
   * Send message to character
   */
  async sendMessage(sessionId: string, message: InworldMessage): Promise<InworldResponse> {
    if (!this.config) throw new Error('Inworld AI not initialized');

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const breaker = CircuitBreakerRegistry.get('inworld-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify({
          characterId: message.characterId,
          text: message.text,
          emotion: message.emotion,
          action: message.action,
          context: { ...session.context, ...message.context }
        })
      });

      if (!response.ok) {
        throw new Error(`Inworld API error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      // Update session
      session.messageCount++;
      this.sessions.set(sessionId, session);

      MetricsCollector.recordAPICall('inworld', true, duration);
      MetricsCollector.incrementCounter('inworld.messages.sent', 1, { characterId: message.characterId });
      MetricsCollector.recordTimer('inworld.response_time', duration, { characterId: message.characterId });

      return {
        characterId: data.characterId || message.characterId,
        text: data.text || '',
        emotion: data.emotion || 'neutral',
        action: data.action,
        audioUrl: data.audioUrl,
        timestamp: Date.now()
      };
    });
  }

  /**
   * Generate character for content creation
   */
  async generateContentCharacter(niche: string, purpose: string): Promise<InworldCharacter> {
    const personalities = [
      'Friendly and enthusiastic educator',
      'Professional and authoritative expert',
      'Witty and entertaining commentator',
      'Empathetic and supportive advisor',
      'Creative and innovative thinker'
    ];

    const personality = personalities[Math.floor(Math.random() * personalities.length)];

    const character: Omit<InworldCharacter, 'id'> = {
      name: `${niche} Expert`,
      description: `An AI character specialized in ${niche} content creation`,
      personality,
      background: `Expert in ${niche} with years of experience creating engaging content`,
      goals: [
        'Create viral and engaging content',
        'Educate and entertain audience',
        'Drive high engagement and shares',
        'Build loyal community'
      ],
      emotions: ['excited', 'curious', 'passionate', 'confident']
    };

    return await this.createCharacter(character);
  }

  /**
   * Generate content with character
   */
  async generateContent(
    characterId: string,
    topic: string,
    type: 'youtube' | 'tiktok' | 'blog' | 'social'
  ): Promise<string> {
    const session = await this.startSession(characterId, { type, topic });

    const prompts = {
      youtube: `Create a viral YouTube script about ${topic}. Make it engaging with hooks, storytelling, and clear structure.`,
      tiktok: `Create a viral TikTok script about ${topic}. Keep it short, punchy, and attention-grabbing.`,
      blog: `Write an engaging blog post about ${topic}. Make it informative, well-structured, and shareable.`,
      social: `Create a viral social media post about ${topic}. Make it concise, impactful, and share-worthy.`
    };

    const response = await this.sendMessage(session.id, {
      characterId,
      text: prompts[type],
      context: { type, topic }
    });

    MetricsCollector.recordContentGenerated(1, type);

    return response.text;
  }

  /**
   * Create interactive assistant character
   */
  async createAssistant(name: string, specialty: string): Promise<InworldCharacter> {
    return await this.createCharacter({
      name,
      description: `AI assistant specialized in ${specialty}`,
      personality: 'Helpful, knowledgeable, and friendly',
      background: `Expert assistant with deep knowledge of ${specialty}`,
      goals: [
        'Help users efficiently',
        'Provide accurate information',
        'Build trust and rapport',
        'Solve problems creatively'
      ],
      emotions: ['helpful', 'patient', 'enthusiastic', 'understanding']
    });
  }

  /**
   * Batch generate content with multiple characters
   */
  async batchGenerateContent(
    requests: Array<{
      characterId: string;
      topic: string;
      type: 'youtube' | 'tiktok' | 'blog' | 'social';
    }>
  ): Promise<Array<{ topic: string; content: string; type: string }>> {
    console.log(`🎬 Generating ${requests.length} pieces with Inworld AI...`);

    const results = [];

    for (const request of requests) {
      try {
        const content = await this.generateContent(
          request.characterId,
          request.topic,
          request.type
        );

        results.push({
          topic: request.topic,
          content,
          type: request.type
        });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to generate content for ${request.topic}:`, error);
        MetricsCollector.recordError('inworld', 'content_generation_failed');
      }
    }

    console.log(`✅ Generated ${results.length} pieces with Inworld AI`);
    return results;
  }

  /**
   * Get character stats
   */
  getCharacterStats(characterId: string): {
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
  } {
    const characterSessions = Array.from(this.sessions.values())
      .filter(s => s.characterId === characterId);

    const totalSessions = characterSessions.length;
    const totalMessages = characterSessions.reduce((sum, s) => sum + s.messageCount, 0);
    const averageMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

    return {
      totalSessions,
      totalMessages,
      averageMessagesPerSession
    };
  }

  /**
   * Get all sessions
   */
  getAllSessions(): InworldSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * End session
   */
  endSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    MetricsCollector.incrementCounter('inworld.sessions.ended', 1);
  }

  /**
   * Get configuration
   */
  getConfig(): InworldConfig | null {
    return this.config;
  }
}

export const inworldAI = new InworldAIIntegration();
export default inworldAI;

/**
 * React Hook
 */
import React from 'react';

export function useInworldAI() {
  const [isReady, setIsReady] = React.useState(false);
  const [characters, setCharacters] = React.useState<InworldCharacter[]>([]);
  const [activeSessions, setActiveSessions] = React.useState<InworldSession[]>([]);

  React.useEffect(() => {
    setIsReady(inworldAI.isReady());
    if (inworldAI.isReady()) {
      loadCharacters();
    }
  }, []);

  const loadCharacters = async () => {
    try {
      const chars = await inworldAI.listCharacters();
      setCharacters(chars);
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
  };

  const refreshSessions = () => {
    setActiveSessions(inworldAI.getAllSessions());
  };

  return {
    isReady,
    characters,
    activeSessions,
    initialize: (config: InworldConfig) => {
      inworldAI.initialize(config);
      setIsReady(true);
      loadCharacters();
    },
    createCharacter: async (character: Omit<InworldCharacter, 'id'>) => {
      const newChar = await inworldAI.createCharacter(character);
      setCharacters([...characters, newChar]);
      return newChar;
    },
    startSession: async (characterId: string, context?: Record<string, any>) => {
      const session = await inworldAI.startSession(characterId, context);
      refreshSessions();
      return session;
    },
    sendMessage: async (sessionId: string, message: InworldMessage) => {
      const response = await inworldAI.sendMessage(sessionId, message);
      refreshSessions();
      return response;
    },
    generateContent: inworldAI.generateContent.bind(inworldAI),
    createAssistant: async (name: string, specialty: string) => {
      const char = await inworldAI.createAssistant(name, specialty);
      setCharacters([...characters, char]);
      return char;
    },
    endSession: (sessionId: string) => {
      inworldAI.endSession(sessionId);
      refreshSessions();
    },
    getCharacterStats: inworldAI.getCharacterStats.bind(inworldAI)
  };
}
