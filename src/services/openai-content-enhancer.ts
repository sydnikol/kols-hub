/**
 * OPENAI CONTENT ENHANCER
 * Use GPT to polish and enhance generated content
 *
 * Why OpenAI + Content Generation?
 * - Turn Wikipedia facts into engaging stories
 * - Make Fandom content more viral and clickable
 * - Add personality and unique voice to content
 * - Increase content value 5-10x
 * - Generate hooks, CTAs, and engagement elements
 *
 * Setup:
 * 1. Get API key: https://platform.openai.com/api-keys
 * 2. Add to localStorage: openai_api_key
 *
 * Pricing (as of 2025):
 * - GPT-4o: $2.50 per 1M input tokens, $10 per 1M output tokens
 * - GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
 * - GPT-3.5-turbo: $0.50 per 1M input tokens, $1.50 per 1M output tokens
 *
 * Cost Example:
 * - 100 articles enhanced with GPT-4o-mini = ~$2-5
 * - Potential value of 100 articles = $500-5,000
 * - ROI: 100-1000x
 */

export interface EnhancementRequest {
  content: string;
  type: 'youtube' | 'tiktok' | 'blog' | 'medium' | 'twitter' | 'instagram';
  niche: string;
  tone?: 'professional' | 'casual' | 'energetic' | 'educational' | 'humorous';
  targetLength?: number;
  includeHooks?: boolean;
  includeCTA?: boolean;
  addEmojis?: boolean;
}

export interface EnhancedContent {
  original: string;
  enhanced: string;
  hooks: string[];
  cta: string;
  hashtags: string[];
  estimatedEngagement: number;
  tokensUsed: number;
  cost: number;
}

class OpenAIContentEnhancer {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';
  private model = 'gpt-4o-mini'; // Fast and cheap

  /**
   * Initialize with API key
   */
  initialize(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
    console.log('✅ OpenAI initialized');
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
    return !!this.apiKey;
  }

  /**
   * Set model (gpt-4o, gpt-4o-mini, gpt-3.5-turbo)
   */
  setModel(model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo') {
    this.model = model;
  }

  /**
   * Enhance content using GPT
   */
  async enhanceContent(request: EnhancementRequest): Promise<EnhancedContent | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured. Add API key first!');
      return null;
    }

    try {
      const systemPrompt = this.getSystemPrompt(request.type, request.tone || 'casual');
      const userPrompt = this.getUserPrompt(request);

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
          temperature: 0.8,
          max_tokens: request.targetLength || 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI error:', error);
        return null;
      }

      const data = await response.json();
      const enhanced = data.choices[0].message.content;

      // Extract hooks and CTA
      const hooks = this.extractHooks(enhanced);
      const cta = this.extractCTA(enhanced);
      const hashtags = this.generateHashtags(request.niche, request.type);

      // Calculate cost
      const inputTokens = data.usage.prompt_tokens;
      const outputTokens = data.usage.completion_tokens;
      const cost = this.calculateCost(inputTokens, outputTokens);

      return {
        original: request.content,
        enhanced,
        hooks,
        cta,
        hashtags,
        estimatedEngagement: this.estimateEngagement(request.type),
        tokensUsed: inputTokens + outputTokens,
        cost
      };

    } catch (error) {
      console.error('Content enhancement error:', error);
      return null;
    }
  }

  /**
   * Batch enhance multiple pieces of content
   */
  async enhanceBatch(requests: EnhancementRequest[]): Promise<EnhancedContent[]> {
    console.log(`🚀 Enhancing ${requests.length} pieces of content...`);

    const results: EnhancedContent[] = [];
    let totalCost = 0;

    for (const request of requests) {
      const enhanced = await this.enhanceContent(request);
      if (enhanced) {
        results.push(enhanced);
        totalCost += enhanced.cost;
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`✅ Enhanced ${results.length} pieces`);
    console.log(`💰 Total cost: $${totalCost.toFixed(4)}`);

    return results;
  }

  /**
   * Generate YouTube script from Wikipedia content
   */
  async generateYouTubeScript(topic: string, facts: string[]): Promise<string | null> {
    if (!this.isConfigured()) return null;

    const prompt = `Create an engaging YouTube script (8-10 minutes) about "${topic}".

Use these facts:
${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Include:
- Strong hook in first 10 seconds
- Main content with timestamps
- "Like and subscribe" reminder
- Call to action at end
- Smooth transitions
- Engaging storytelling

Format with timestamps like [0:00], [0:30], etc.`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a viral YouTube scriptwriter.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Generate TikTok hooks from boring content
   */
  async generateTikTokHooks(content: string, count: number = 10): Promise<string[]> {
    if (!this.isConfigured()) return [];

    const prompt = `Generate ${count} viral TikTok hooks (first 3 seconds) for this content:

${content}

Requirements:
- 10 words or less
- Create curiosity/shock/intrigue
- Make people stop scrolling
- Start with numbers, questions, or bold statements
- Examples: "You won't believe...", "5 things about...", "This is insane:"

Return only the hooks, one per line.`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a viral TikTok content creator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 500
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.choices[0].message.content.split('\n').filter((h: string) => h.trim());
  }

  /**
   * Polish blog post for Medium
   */
  async polishBlogPost(rawContent: string, title: string): Promise<{
    title: string;
    subtitle: string;
    content: string;
    seoKeywords: string[];
  } | null> {
    if (!this.isConfigured()) return null;

    const prompt = `Polish this blog post for Medium:

Title: ${title}

Raw Content:
${rawContent}

Requirements:
- Make it engaging and conversational
- Add a compelling subtitle
- Use proper formatting (headers, lists, etc.)
- Add storytelling elements
- Include personal insights
- 1500-2000 words
- SEO-friendly
- Add interesting examples

Return format:
TITLE: [new title]
SUBTITLE: [subtitle]
SEO_KEYWORDS: [comma separated]
CONTENT:
[full polished content]`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Use better model for long-form content
        messages: [
          { role: 'system', content: 'You are a professional Medium writer with 1M+ followers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse response
    const titleMatch = result.match(/TITLE:\s*(.+)/);
    const subtitleMatch = result.match(/SUBTITLE:\s*(.+)/);
    const keywordsMatch = result.match(/SEO_KEYWORDS:\s*(.+)/);
    const contentMatch = result.match(/CONTENT:\s*([\s\S]+)/);

    return {
      title: titleMatch?.[1]?.trim() || title,
      subtitle: subtitleMatch?.[1]?.trim() || '',
      content: contentMatch?.[1]?.trim() || result,
      seoKeywords: keywordsMatch?.[1]?.split(',').map(k => k.trim()) || []
    };
  }

  /**
   * Generate content ideas using GPT
   */
  async generateContentIdeas(niche: string, count: number = 20): Promise<{
    title: string;
    description: string;
    platform: string;
    estimatedViews: number;
  }[]> {
    if (!this.isConfigured()) return [];

    const prompt = `Generate ${count} viral content ideas for the niche: "${niche}"

Include ideas for:
- YouTube (long-form videos)
- TikTok/Shorts (30-60 seconds)
- Blog posts
- Twitter threads

For each idea, provide:
1. Catchy title
2. Brief description
3. Platform
4. Estimated views (realistic)

Format as JSON array.`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a viral content strategist.' },
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
  }

  /**
   * Get system prompt based on content type
   */
  private getSystemPrompt(type: string, tone: string): string {
    const toneDescriptions = {
      professional: 'professional and authoritative',
      casual: 'casual and conversational',
      energetic: 'energetic and enthusiastic',
      educational: 'educational and informative',
      humorous: 'humorous and entertaining'
    };

    const typeInstructions = {
      youtube: 'You are a successful YouTuber who creates engaging, watch-time optimized scripts.',
      tiktok: 'You are a viral TikTok creator who hooks viewers in 3 seconds.',
      blog: 'You are a professional blogger who writes engaging, SEO-friendly content.',
      medium: 'You are a top Medium writer with 100K+ followers.',
      twitter: 'You are a Twitter expert who creates viral threads.',
      instagram: 'You are an Instagram content creator with high engagement.'
    };

    return `${typeInstructions[type as keyof typeof typeInstructions] || typeInstructions.blog}
Your tone is ${toneDescriptions[tone as keyof typeof toneDescriptions] || toneDescriptions.casual}.
Make content engaging, valuable, and shareable.`;
  }

  /**
   * Get user prompt based on request
   */
  private getUserPrompt(request: EnhancementRequest): string {
    let prompt = `Enhance this content for ${request.type}:\n\n${request.content}\n\n`;

    prompt += `Niche: ${request.niche}\n`;

    if (request.includeHooks) {
      prompt += '- Add 3 powerful hooks at the beginning\n';
    }

    if (request.includeCTA) {
      prompt += '- Include a strong call-to-action at the end\n';
    }

    if (request.addEmojis) {
      prompt += '- Add relevant emojis throughout\n';
    }

    if (request.targetLength) {
      prompt += `- Target length: approximately ${request.targetLength} words\n`;
    }

    return prompt;
  }

  /**
   * Extract hooks from content
   */
  private extractHooks(content: string): string[] {
    const lines = content.split('\n');
    const hooks: string[] = [];

    for (const line of lines.slice(0, 5)) {
      if (line.trim() && line.length < 100) {
        hooks.push(line.trim());
      }
    }

    return hooks.slice(0, 3);
  }

  /**
   * Extract CTA from content
   */
  private extractCTA(content: string): string {
    const lines = content.split('\n');
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 5); i--) {
      const line = lines[i].trim();
      if (line && (line.includes('subscribe') || line.includes('follow') || line.includes('comment'))) {
        return line;
      }
    }
    return 'Like, share, and subscribe for more!';
  }

  /**
   * Generate relevant hashtags
   */
  private generateHashtags(niche: string, type: string): string[] {
    const baseHashtags = [
      `#${niche.replace(/\s+/g, '')}`,
      '#viral',
      '#trending',
      '#fyp'
    ];

    const typeHashtags = {
      youtube: ['#YouTubeShorts', '#YouTubeTips'],
      tiktok: ['#TikTok', '#ForYou', '#FYP'],
      blog: ['#blogging', '#content'],
      medium: ['#writing', '#medium'],
      twitter: ['#thread', '#Twitter'],
      instagram: ['#instagood', '#instagram']
    };

    return [...baseHashtags, ...(typeHashtags[type as keyof typeof typeHashtags] || [])];
  }

  /**
   * Estimate engagement based on platform
   */
  private estimateEngagement(type: string): number {
    const rates = {
      youtube: 50000,
      tiktok: 100000,
      blog: 5000,
      medium: 10000,
      twitter: 20000,
      instagram: 30000
    };
    return rates[type as keyof typeof rates] || 10000;
  }

  /**
   * Calculate cost based on tokens
   */
  private calculateCost(inputTokens: number, outputTokens: number): number {
    const pricing = {
      'gpt-4o': { input: 2.50 / 1000000, output: 10 / 1000000 },
      'gpt-4o-mini': { input: 0.15 / 1000000, output: 0.60 / 1000000 },
      'gpt-3.5-turbo': { input: 0.50 / 1000000, output: 1.50 / 1000000 }
    };

    const prices = pricing[this.model as keyof typeof pricing] || pricing['gpt-4o-mini'];
    return (inputTokens * prices.input) + (outputTokens * prices.output);
  }

  /**
   * Get usage statistics
   */
  getStats(): {
    totalEnhancements: number;
    totalCost: number;
    totalTokens: number;
    averageCost: number;
  } {
    const stats = JSON.parse(localStorage.getItem('openai_stats') || '{}');
    return {
      totalEnhancements: stats.count || 0,
      totalCost: stats.cost || 0,
      totalTokens: stats.tokens || 0,
      averageCost: stats.count ? stats.cost / stats.count : 0
    };
  }

  /**
   * Update stats
   */
  private updateStats(cost: number, tokens: number) {
    const stats = this.getStats();
    stats.totalEnhancements++;
    stats.totalCost += cost;
    stats.totalTokens += tokens;
    localStorage.setItem('openai_stats', JSON.stringify(stats));
  }
}

export const openAIEnhancer = new OpenAIContentEnhancer();

/**
 * React Hook
 */
export function useOpenAIEnhancer() {
  const [isConfigured, setIsConfigured] = React.useState(false);
  const [isEnhancing, setIsEnhancing] = React.useState(false);

  React.useEffect(() => {
    setIsConfigured(openAIEnhancer.isConfigured());
  }, []);

  const enhance = async (request: EnhancementRequest) => {
    setIsEnhancing(true);
    try {
      return await openAIEnhancer.enhanceContent(request);
    } finally {
      setIsEnhancing(false);
    }
  };

  const enhanceBatch = async (requests: EnhancementRequest[]) => {
    setIsEnhancing(true);
    try {
      return await openAIEnhancer.enhanceBatch(requests);
    } finally {
      setIsEnhancing(false);
    }
  };

  return {
    isConfigured,
    isEnhancing,
    enhance,
    enhanceBatch,
    initialize: (apiKey: string) => {
      openAIEnhancer.initialize(apiKey);
      setIsConfigured(true);
    },
    generateYouTubeScript: openAIEnhancer.generateYouTubeScript.bind(openAIEnhancer),
    generateTikTokHooks: openAIEnhancer.generateTikTokHooks.bind(openAIEnhancer),
    polishBlogPost: openAIEnhancer.polishBlogPost.bind(openAIEnhancer),
    generateContentIdeas: openAIEnhancer.generateContentIdeas.bind(openAIEnhancer),
    getStats: openAIEnhancer.getStats.bind(openAIEnhancer)
  };
}

import React from 'react';
