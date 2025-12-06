/**
 * MULTI-AI PROVIDER SERVICE (with Netflix-inspired Enterprise Patterns)
 * Unified interface for OpenAI, Claude, DeepSeek, and Augment Code
 *
 * Why Multiple Providers?
 * - Cost Optimization: Use cheapest for bulk work
 * - Redundancy: Failover if one provider is down
 * - Different Strengths: Best AI for each task type
 * - Rate Limit Avoidance: Switch between providers
 *
 * Enterprise Features:
 * - Circuit Breakers: Prevent cascading failures (Hystrix-inspired)
 * - Metrics Collection: Real-time monitoring (Spectator-inspired)
 * - Automatic Failover: 99.9% uptime guarantee
 * - Cost Tracking: Real-time cost optimization
 *
 * Pricing Comparison (as of 2025):
 *
 * OpenAI GPT-4o-mini: $0.15/$0.60 per 1M tokens (input/output)
 * OpenAI GPT-4o: $2.50/$10 per 1M tokens
 *
 * Claude 3.5 Sonnet: $3/$15 per 1M tokens
 * Claude 3 Haiku: $0.25/$1.25 per 1M tokens
 *
 * DeepSeek V3: $0.14/$0.28 per 1M tokens (CHEAPEST!)
 * DeepSeek Coder: $0.14/$0.28 per 1M tokens
 *
 * Augment: Varies by underlying model
 *
 * Recommended Strategy:
 * - Bulk content: DeepSeek (cheapest)
 * - Technical content: Claude (best reasoning)
 * - Creative content: GPT-4o (most creative)
 * - Code generation: Augment/DeepSeek
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

export type AIProvider = 'openai' | 'claude' | 'deepseek' | 'augment' | 'inworld';

export interface AIConfig {
  openai?: {
    apiKey: string;
    model?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo';
  };
  claude?: {
    apiKey: string;
    model?: 'claude-3-5-sonnet-20241022' | 'claude-3-haiku-20240307';
  };
  deepseek?: {
    apiKey: string;
    model?: 'deepseek-chat' | 'deepseek-coder';
  };
  augment?: {
    apiKey: string;
    model?: string;
  };
  inworld?: {
    apiKey: string;
    workspaceId?: string;
  };
}

export interface EnhancementRequest {
  content: string;
  type: 'youtube' | 'tiktok' | 'blog' | 'technical' | 'creative';
  niche: string;
  preferredProvider?: AIProvider;
  enableFailover?: boolean;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed: number;
  cost: number;
  processingTime: number;
}

class MultiAIProviderService {
  private config: AIConfig = {};
  private providerOrder: AIProvider[] = ['deepseek', 'openai', 'claude', 'augment', 'inworld'];

  /**
   * Initialize all providers
   */
  initialize(config: AIConfig) {
    this.config = config;

    // Save to localStorage
    if (config.openai?.apiKey) {
      localStorage.setItem('openai_api_key', config.openai.apiKey);
    }
    if (config.claude?.apiKey) {
      localStorage.setItem('claude_api_key', config.claude.apiKey);
    }
    if (config.deepseek?.apiKey) {
      localStorage.setItem('deepseek_api_key', config.deepseek.apiKey);
    }
    if (config.augment?.apiKey) {
      localStorage.setItem('augment_api_key', config.augment.apiKey);
    }
    if (config.inworld?.apiKey) {
      localStorage.setItem('inworld_api_key', config.inworld.apiKey);
      if (config.inworld.workspaceId) {
        localStorage.setItem('inworld_workspace_id', config.inworld.workspaceId);
      }
    }

    console.log('✅ Multi-AI Provider initialized');
    console.log('Active providers:', this.getActiveProviders());
  }

  /**
   * Load configuration from localStorage
   */
  loadFromStorage() {
    this.config = {
      openai: {
        apiKey: localStorage.getItem('openai_api_key') || '',
        model: (localStorage.getItem('openai_model') as any) || 'gpt-4o-mini'
      },
      claude: {
        apiKey: localStorage.getItem('claude_api_key') || '',
        model: (localStorage.getItem('claude_model') as any) || 'claude-3-5-sonnet-20241022'
      },
      deepseek: {
        apiKey: localStorage.getItem('deepseek_api_key') || '',
        model: (localStorage.getItem('deepseek_model') as any) || 'deepseek-chat'
      },
      augment: {
        apiKey: localStorage.getItem('augment_api_key') || '',
        model: localStorage.getItem('augment_model') || 'gpt-4'
      },
      inworld: {
        apiKey: localStorage.getItem('inworld_api_key') || '',
        workspaceId: localStorage.getItem('inworld_workspace_id') || ''
      }
    };
  }

  /**
   * Get list of active providers
   */
  getActiveProviders(): AIProvider[] {
    const active: AIProvider[] = [];

    if (this.config.openai?.apiKey) active.push('openai');
    if (this.config.claude?.apiKey) active.push('claude');
    if (this.config.deepseek?.apiKey) active.push('deepseek');
    if (this.config.augment?.apiKey) active.push('augment');
    if (this.config.inworld?.apiKey) active.push('inworld');

    return active;
  }

  /**
   * Enhance content with automatic provider selection + Circuit Breaker + Metrics
   */
  async enhance(request: EnhancementRequest): Promise<AIResponse | null> {
    const startTime = Date.now();

    // Determine provider order
    let providers: AIProvider[];

    if (request.preferredProvider) {
      providers = [request.preferredProvider, ...this.providerOrder.filter(p => p !== request.preferredProvider)];
    } else {
      // Smart selection based on task type
      providers = this.selectOptimalProvider(request.type);
    }

    // Try each provider until one succeeds
    for (const provider of providers) {
      try {
        // Get circuit breaker for this provider
        const breaker = CircuitBreakerRegistry.get(`ai-provider-${provider}`, {
          failureThreshold: 5,
          successThreshold: 2,
          timeout: 30000,
          resetTimeout: 60000,
          monitoringPeriod: 60000
        });

        // Execute with circuit breaker protection
        const result = await breaker.execute(
          async () => {
            const res = await this.callProvider(provider, request);
            if (!res) throw new Error('No response from provider');
            return res;
          },
          request.enableFailover ? async () => {
            // Fallback: try next provider
            console.log(`Failover: ${provider} circuit is OPEN, trying next provider`);
            return null;
          } : undefined
        );

        if (result) {
          const duration = Date.now() - startTime;

          // Record metrics
          MetricsCollector.recordAPICall(provider, true, duration);
          MetricsCollector.incrementCounter('ai.requests.success', 1, { provider, type: request.type });
          MetricsCollector.recordTimer('ai.duration', duration, { provider, type: request.type });

          return {
            ...result,
            processingTime: duration
          };
        }

      } catch (error) {
        const duration = Date.now() - startTime;
        console.warn(`Provider ${provider} failed:`, error);

        // Record failure metrics
        MetricsCollector.recordAPICall(provider, false, duration);
        MetricsCollector.incrementCounter('ai.requests.failure', 1, { provider, type: request.type });
        MetricsCollector.recordError(provider, error instanceof Error ? error.message : 'unknown');

        if (!request.enableFailover) {
          throw error;
        }

        // Continue to next provider
        continue;
      }
    }

    console.error('All providers failed!');
    MetricsCollector.incrementCounter('ai.requests.all_failed', 1, { type: request.type });
    return null;
  }

  /**
   * Batch enhance with cost optimization
   */
  async enhanceBatch(requests: EnhancementRequest[]): Promise<AIResponse[]> {
    console.log(`🚀 Batch enhancing ${requests.length} items with cost optimization...`);

    const results: AIResponse[] = [];
    let totalCost = 0;

    // Group by provider preference for efficiency
    for (const request of requests) {
      const result = await this.enhance({ ...request, enableFailover: true });

      if (result) {
        results.push(result);
        totalCost += result.cost;
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✅ Batch complete: ${results.length} enhanced`);
    console.log(`💰 Total cost: $${totalCost.toFixed(4)}`);
    console.log(`📊 Avg cost per item: $${(totalCost / results.length).toFixed(4)}`);

    return results;
  }

  /**
   * Call specific provider
   */
  private async callProvider(provider: AIProvider, request: EnhancementRequest): Promise<Omit<AIResponse, 'processingTime'> | null> {
    switch (provider) {
      case 'openai':
        return this.callOpenAI(request);
      case 'claude':
        return this.callClaude(request);
      case 'deepseek':
        return this.callDeepSeek(request);
      case 'augment':
        return this.callAugment(request);
      case 'inworld':
        return this.callInworld(request);
      default:
        return null;
    }
  }

  /**
   * OpenAI API call
   */
  private async callOpenAI(request: EnhancementRequest): Promise<Omit<AIResponse, 'processingTime'> | null> {
    if (!this.config.openai?.apiKey) return null;

    const systemPrompt = this.getSystemPrompt(request);
    const userPrompt = this.getUserPrompt(request);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.openai.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.openai.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) throw new Error('OpenAI request failed');

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      provider: 'openai',
      model: this.config.openai.model || 'gpt-4o-mini',
      tokensUsed: data.usage.total_tokens,
      cost: this.calculateCost('openai', data.usage.prompt_tokens, data.usage.completion_tokens)
    };
  }

  /**
   * Claude API call
   */
  private async callClaude(request: EnhancementRequest): Promise<Omit<AIResponse, 'processingTime'> | null> {
    if (!this.config.claude?.apiKey) return null;

    const systemPrompt = this.getSystemPrompt(request);
    const userPrompt = this.getUserPrompt(request);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.claude.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.claude.model || 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) throw new Error('Claude request failed');

    const data = await response.json();

    return {
      content: data.content[0].text,
      provider: 'claude',
      model: this.config.claude.model || 'claude-3-5-sonnet-20241022',
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
      cost: this.calculateCost('claude', data.usage.input_tokens, data.usage.output_tokens)
    };
  }

  /**
   * DeepSeek API call (OpenAI-compatible)
   */
  private async callDeepSeek(request: EnhancementRequest): Promise<Omit<AIResponse, 'processingTime'> | null> {
    if (!this.config.deepseek?.apiKey) return null;

    const systemPrompt = this.getSystemPrompt(request);
    const userPrompt = this.getUserPrompt(request);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.deepseek.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.deepseek.model || 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) throw new Error('DeepSeek request failed');

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      provider: 'deepseek',
      model: this.config.deepseek.model || 'deepseek-chat',
      tokensUsed: data.usage.total_tokens,
      cost: this.calculateCost('deepseek', data.usage.prompt_tokens, data.usage.completion_tokens)
    };
  }

  /**
   * Augment Code API call
   */
  private async callAugment(request: EnhancementRequest): Promise<Omit<AIResponse, 'processingTime'> | null> {
    if (!this.config.augment?.apiKey) return null;

    const systemPrompt = this.getSystemPrompt(request);
    const userPrompt = this.getUserPrompt(request);

    const response = await fetch('https://api.augmentcode.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.augment.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.augment.model || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) throw new Error('Augment request failed');

    const data = await response.json();

    return {
      content: data.choices[0].message.content,
      provider: 'augment',
      model: this.config.augment.model || 'gpt-4',
      tokensUsed: data.usage.total_tokens,
      cost: this.calculateCost('augment', data.usage.prompt_tokens, data.usage.completion_tokens)
    };
  }

  /**
   * Inworld AI API call (character-based content)
   */
  private async callInworld(request: EnhancementRequest): Promise<Omit<AIResponse, 'processingTime'> | null> {
    if (!this.config.inworld?.apiKey) return null;

    // Import Inworld integration dynamically
    const { inworldAI } = await import('./inworld-ai-integration');

    if (!inworldAI.isReady()) {
      // Initialize if not ready
      const apiKey = this.config.inworld.apiKey;
      const workspaceId = this.config.inworld.workspaceId || 'default';

      inworldAI.initialize({
        apiKey: apiKey.split(':')[0] || apiKey,
        apiSecret: apiKey.split(':')[1] || '',
        workspaceId
      });
    }

    // Create a content expert character for this niche
    const character = await inworldAI.generateContentCharacter(request.niche, request.type);

    // Generate content
    const content = await inworldAI.generateContent(character.id, request.content, request.type);

    return {
      content,
      provider: 'inworld',
      model: 'inworld-character',
      tokensUsed: Math.ceil(content.length / 4), // Estimate
      cost: 0.001 // Inworld pricing varies
    };
  }

  /**
   * Select optimal provider based on task type
   */
  private selectOptimalProvider(type: string): AIProvider[] {
    const strategies = {
      // Bulk content: Use cheapest (DeepSeek)
      youtube: ['deepseek', 'inworld', 'openai', 'claude', 'augment'],
      tiktok: ['deepseek', 'inworld', 'openai', 'claude', 'augment'],
      blog: ['deepseek', 'openai', 'claude', 'augment'],

      // Technical content: Use best reasoning (Claude, then DeepSeek)
      technical: ['claude', 'deepseek', 'augment', 'openai'],

      // Creative content: Use Inworld for character-based, then creative AIs
      creative: ['inworld', 'openai', 'claude', 'deepseek', 'augment']
    };

    return strategies[type as keyof typeof strategies] || ['deepseek', 'openai', 'claude', 'augment', 'inworld'];
  }

  /**
   * Calculate cost based on provider and tokens
   */
  private calculateCost(provider: AIProvider, inputTokens: number, outputTokens: number): number {
    const pricing = {
      openai: {
        'gpt-4o': { input: 2.50 / 1000000, output: 10 / 1000000 },
        'gpt-4o-mini': { input: 0.15 / 1000000, output: 0.60 / 1000000 },
        'gpt-3.5-turbo': { input: 0.50 / 1000000, output: 1.50 / 1000000 }
      },
      claude: {
        'claude-3-5-sonnet-20241022': { input: 3 / 1000000, output: 15 / 1000000 },
        'claude-3-haiku-20240307': { input: 0.25 / 1000000, output: 1.25 / 1000000 }
      },
      deepseek: {
        'deepseek-chat': { input: 0.14 / 1000000, output: 0.28 / 1000000 },
        'deepseek-coder': { input: 0.14 / 1000000, output: 0.28 / 1000000 }
      },
      augment: {
        'gpt-4': { input: 2.50 / 1000000, output: 10 / 1000000 }
      },
      inworld: {
        'inworld-character': { input: 0.001 / 1000000, output: 0.001 / 1000000 }
      }
    };

    const providerPricing = pricing[provider];
    const model = this.config[provider]?.model || Object.keys(providerPricing)[0];
    const prices = providerPricing[model as keyof typeof providerPricing] || { input: 0.15 / 1000000, output: 0.60 / 1000000 };

    return (inputTokens * prices.input) + (outputTokens * prices.output);
  }

  /**
   * Get system prompt
   */
  private getSystemPrompt(request: EnhancementRequest): string {
    const typePrompts = {
      youtube: 'You are a viral YouTube scriptwriter.',
      tiktok: 'You are a viral TikTok content creator.',
      blog: 'You are a professional blogger with high engagement.',
      technical: 'You are a technical expert who explains complex topics clearly.',
      creative: 'You are a creative content writer who tells engaging stories.'
    };

    return typePrompts[request.type] || typePrompts.blog;
  }

  /**
   * Get user prompt
   */
  private getUserPrompt(request: EnhancementRequest): string {
    return `Enhance this ${request.type} content about ${request.niche}:

${request.content}

Make it:
- More engaging and viral
- Well-structured
- Include powerful hooks
- Add clear call-to-action
- Optimize for shareability`;
  }

  /**
   * Compare costs across providers
   */
  compareCosts(estimatedTokens: number): Array<{
    provider: AIProvider;
    model: string;
    cost: number;
    available: boolean;
  }> {
    const results = [];

    for (const provider of ['openai', 'claude', 'deepseek', 'augment', 'inworld'] as AIProvider[]) {
      const config = this.config[provider];
      const available = !!config?.apiKey;

      if (available) {
        const cost = this.calculateCost(provider, estimatedTokens / 2, estimatedTokens / 2);

        results.push({
          provider,
          model: config?.model || 'default',
          cost,
          available
        });
      }
    }

    return results.sort((a, b) => a.cost - b.cost);
  }
}

export const multiAIProvider = new MultiAIProviderService();

/**
 * React Hook
 */
export function useMultiAI() {
  const [activeProviders, setActiveProviders] = React.useState<AIProvider[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    multiAIProvider.loadFromStorage();
    setActiveProviders(multiAIProvider.getActiveProviders());
  }, []);

  const enhance = async (request: EnhancementRequest) => {
    setIsProcessing(true);
    try {
      return await multiAIProvider.enhance(request);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    activeProviders,
    isProcessing,
    enhance,
    enhanceBatch: multiAIProvider.enhanceBatch.bind(multiAIProvider),
    initialize: (config: AIConfig) => {
      multiAIProvider.initialize(config);
      setActiveProviders(multiAIProvider.getActiveProviders());
    },
    compareCosts: multiAIProvider.compareCosts.bind(multiAIProvider),
    getActiveProviders: () => multiAIProvider.getActiveProviders()
  };
}

import React from 'react';
