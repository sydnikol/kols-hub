/**
 * AUGMENT CODE INTEGRATION
 * Alternative AI provider for content generation
 *
 * Why Augment Code?
 * - Multiple model options (GPT-4, Claude, Gemini, etc.)
 * - Code generation optimized
 * - Competitive pricing
 * - Good for technical content
 *
 * Setup:
 * 1. Sign up: https://www.augmentcode.com/
 * 2. Get API key from dashboard
 * 3. Add to localStorage: augment_api_key
 *
 * Use Cases:
 * - Technical tutorials
 * - Programming content
 * - Code explanations
 * - Developer-focused content
 * - Backup when OpenAI is rate-limited
 */

export interface AugmentConfig {
  apiKey: string;
  model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-2' | 'claude-instant' | 'gemini-pro';
  temperature?: number;
  maxTokens?: number;
}

export interface AugmentEnhancementRequest {
  content: string;
  type: 'youtube' | 'tiktok' | 'blog' | 'tutorial' | 'code-explanation';
  niche: string;
  includeTechnicalDetails?: boolean;
  targetAudience?: 'beginners' | 'intermediate' | 'advanced' | 'all';
}

export interface AugmentResponse {
  enhanced: string;
  model: string;
  tokensUsed: number;
  cost: number;
  suggestions?: string[];
}

class AugmentCodeService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.augmentcode.com/v1'; // Adjust if needed
  private model: string = 'gpt-4';

  /**
   * Initialize Augment Code
   */
  initialize(config: AugmentConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4';

    // Store in localStorage for persistence
    localStorage.setItem('augment_api_key', config.apiKey);
    localStorage.setItem('augment_model', this.model);

    console.log('✅ Augment Code initialized');
  }

  /**
   * Check if configured
   */
  isConfigured(): boolean {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('augment_api_key');
      this.model = localStorage.getItem('augment_model') || 'gpt-4';
    }
    return !!this.apiKey;
  }

  /**
   * Enhance content using Augment Code
   */
  async enhanceContent(request: AugmentEnhancementRequest): Promise<AugmentResponse | null> {
    if (!this.isConfigured()) {
      console.error('Augment Code not configured');
      return null;
    }

    try {
      const systemPrompt = this.getSystemPrompt(request);
      const userPrompt = this.getUserPrompt(request);

      // Using standard OpenAI-compatible API format
      // Adjust endpoint based on Augment's actual API
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Augment Code error:', error);
        return null;
      }

      const data = await response.json();

      return {
        enhanced: data.choices[0].message.content,
        model: this.model,
        tokensUsed: data.usage.total_tokens,
        cost: this.calculateCost(data.usage.total_tokens),
        suggestions: this.extractSuggestions(data.choices[0].message.content)
      };

    } catch (error) {
      console.error('Augment enhancement error:', error);
      return null;
    }
  }

  /**
   * Generate technical tutorial
   * Perfect for programming content
   */
  async generateTechnicalTutorial(topic: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<string | null> {
    if (!this.isConfigured()) return null;

    const prompt = `Create a comprehensive technical tutorial about: ${topic}

Target Audience: ${level}

Include:
1. Introduction - Why this matters
2. Prerequisites (if any)
3. Step-by-step instructions
4. Code examples (if applicable)
5. Common pitfalls and how to avoid them
6. Best practices
7. Resources for further learning
8. Conclusion with key takeaways

Make it engaging and easy to follow.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are an expert technical educator and content creator.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('Tutorial generation error:', error);
      return null;
    }
  }

  /**
   * Explain code snippet
   * Perfect for technical content
   */
  async explainCode(code: string, language: string): Promise<{
    explanation: string;
    improvements: string[];
    useCases: string[];
  } | null> {
    if (!this.isConfigured()) return null;

    const prompt = `Explain this ${language} code in simple terms:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. What the code does (simple explanation)
2. How it works (step-by-step)
3. Potential improvements
4. Real-world use cases

Format as JSON:
{
  "explanation": "...",
  "improvements": ["...", "..."],
  "useCases": ["...", "..."]
}`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a code explanation expert.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) return null;

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);

    } catch (error) {
      console.error('Code explanation error:', error);
      return null;
    }
  }

  /**
   * Generate developer-focused content ideas
   */
  async generateDevContentIdeas(technology: string, count: number = 10): Promise<Array<{
    title: string;
    description: string;
    difficulty: string;
    estimatedViews: number;
  }>> {
    if (!this.isConfigured()) return [];

    const prompt = `Generate ${count} viral content ideas for developers about: ${technology}

Format as JSON array:
{
  "ideas": [
    {
      "title": "...",
      "description": "...",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedViews": 50000
    }
  ]
}

Focus on practical, trending topics that developers want to learn.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are a developer content strategist.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) return [];

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      return parsed.ideas || [];

    } catch (error) {
      console.error('Content ideas error:', error);
      return [];
    }
  }

  /**
   * Switch model
   */
  setModel(model: AugmentConfig['model']) {
    this.model = model || 'gpt-4';
    localStorage.setItem('augment_model', this.model);
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return [
      { id: 'gpt-4', name: 'GPT-4', description: 'Most capable, best for complex tasks' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
      { id: 'claude-2', name: 'Claude 2', description: 'Great for long-form content' },
      { id: 'claude-instant', name: 'Claude Instant', description: 'Fast and affordable' },
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Google\'s powerful model' }
    ];
  }

  // Helper methods

  private getSystemPrompt(request: AugmentEnhancementRequest): string {
    const audienceMap = {
      beginners: 'Explain concepts simply, avoid jargon',
      intermediate: 'Balance technical detail with clarity',
      advanced: 'Use technical terminology, assume knowledge',
      all: 'Make it accessible to all levels'
    };

    const audience = request.targetAudience || 'all';

    return `You are an expert content creator for ${request.type}.
${audienceMap[audience]}.
Focus on: ${request.niche}
${request.includeTechnicalDetails ? 'Include technical details and code examples where relevant.' : ''}
Make content engaging, informative, and shareable.`;
  }

  private getUserPrompt(request: AugmentEnhancementRequest): string {
    let prompt = `Enhance this content for ${request.type}:\n\n${request.content}\n\n`;

    prompt += 'Make it:';
    prompt += '\n- More engaging and viral';
    prompt += '\n- Well-structured';
    prompt += '\n- Include powerful hooks';
    prompt += '\n- Add actionable takeaways';

    if (request.includeTechnicalDetails) {
      prompt += '\n- Include relevant technical details';
      prompt += '\n- Add code examples if applicable';
    }

    return prompt;
  }

  private calculateCost(tokens: number): number {
    // Pricing varies by model - adjust as needed
    const pricing: Record<string, number> = {
      'gpt-4': 0.03 / 1000,
      'gpt-3.5-turbo': 0.002 / 1000,
      'claude-2': 0.01 / 1000,
      'claude-instant': 0.001 / 1000,
      'gemini-pro': 0.0005 / 1000
    };

    const rate = pricing[this.model] || 0.01 / 1000;
    return tokens * rate;
  }

  private extractSuggestions(content: string): string[] {
    // Extract any suggestions or tips from the content
    const suggestions: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.toLowerCase().includes('tip:') ||
          line.toLowerCase().includes('suggestion:') ||
          line.toLowerCase().includes('pro tip:')) {
        suggestions.push(line.trim());
      }
    }

    return suggestions;
  }
}

export const augmentCodeService = new AugmentCodeService();

/**
 * React Hook
 */
export function useAugmentCode() {
  const [isConfigured, setIsConfigured] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState('gpt-4');

  React.useEffect(() => {
    setIsConfigured(augmentCodeService.isConfigured());
    const model = localStorage.getItem('augment_model') || 'gpt-4';
    setCurrentModel(model);
  }, []);

  const enhance = async (request: AugmentEnhancementRequest) => {
    setIsProcessing(true);
    try {
      return await augmentCodeService.enhanceContent(request);
    } finally {
      setIsProcessing(false);
    }
  };

  const switchModel = (model: AugmentConfig['model']) => {
    augmentCodeService.setModel(model);
    setCurrentModel(model || 'gpt-4');
  };

  return {
    isConfigured,
    isProcessing,
    currentModel,
    enhance,
    switchModel,
    initialize: (config: AugmentConfig) => {
      augmentCodeService.initialize(config);
      setIsConfigured(true);
    },
    generateTechnicalTutorial: augmentCodeService.generateTechnicalTutorial.bind(augmentCodeService),
    explainCode: augmentCodeService.explainCode.bind(augmentCodeService),
    generateDevContentIdeas: augmentCodeService.generateDevContentIdeas.bind(augmentCodeService),
    getAvailableModels: augmentCodeService.getAvailableModels.bind(augmentCodeService)
  };
}

import React from 'react';
