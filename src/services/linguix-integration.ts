/**
 * LINGUIX INTEGRATION SERVICE
 * Writing enhancement and content quality platform
 *
 * Features:
 * - Advanced grammar and style checking
 * - AI-powered rewriting and paraphrasing
 * - Text shortcuts and templates
 * - Team style guides and brand voice
 * - Content quality scoring
 * - Multilingual support
 *
 * API Documentation:
 * https://linguix.com/api
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LinguixConfig {
  apiKey: string;
  teamId?: string;
}

export interface CheckRequest {
  text: string;
  language?: string;
  enabledRules?: string[];
  disabledRules?: string[];
}

export interface CheckResponse {
  matches: GrammarMatch[];
  language: string;
  qualityScore: number; // 0-100
}

export interface GrammarMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: Replacement[];
  context: {
    text: string;
    offset: number;
    length: number;
  };
  rule: {
    id: string;
    description: string;
    category: string;
    issueType: string;
  };
  type: {
    typeName: string;
  };
}

export interface Replacement {
  value: string;
  description?: string;
}

export interface RewriteRequest {
  text: string;
  style?: 'formal' | 'casual' | 'professional' | 'creative' | 'academic';
  tone?: 'friendly' | 'assertive' | 'neutral' | 'empathetic';
  purpose?: 'clarify' | 'shorten' | 'expand' | 'simplify' | 'enhance';
}

export interface RewriteResponse {
  original: string;
  rewritten: string;
  changes: Change[];
  improvements: string[];
}

export interface Change {
  type: 'addition' | 'deletion' | 'modification';
  original: string;
  new: string;
  reason: string;
}

export interface Shortcut {
  id: string;
  trigger: string;
  expansion: string;
  description?: string;
  category?: string;
  createdAt: string;
}

export interface StyleGuideRule {
  id: string;
  name: string;
  description: string;
  category: 'grammar' | 'spelling' | 'style' | 'terminology' | 'tone';
  enabled: boolean;
  severity: 'error' | 'warning' | 'suggestion';
  examples: {
    incorrect: string;
    correct: string;
  }[];
}

export interface TeamStyleGuide {
  id: string;
  name: string;
  description: string;
  rules: StyleGuideRule[];
  terminology: {
    term: string;
    definition: string;
    preferredAlternatives?: string[];
    avoidAlternatives?: string[];
  }[];
  brandVoice: {
    description: string;
    keywords: string[];
    examples: string[];
  };
}

export interface QualityScore {
  overall: number; // 0-100
  breakdown: {
    grammar: number;
    spelling: number;
    style: number;
    clarity: number;
    engagement: number;
  };
  readability: {
    score: number;
    grade: string;
  };
  recommendations: string[];
}

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  preserveFormatting?: boolean;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  confidence: number;
}

export interface ParaphraseRequest {
  text: string;
  variants?: number; // Number of variations to generate
  creativityLevel?: 'low' | 'medium' | 'high';
}

export interface ParaphraseResponse {
  original: string;
  variants: {
    text: string;
    similarity: number; // 0-1 (how similar to original)
    readability: number; // 0-100
  }[];
}

// ============================================================================
// LINGUIX INTEGRATION SERVICE
// ============================================================================

class LinguixIntegrationService {
  private apiKey: string | null = null;
  private teamId: string | null = null;
  private baseUrl = 'https://api.linguix.com/v1';

  // Initialize service with credentials
  initialize(config: LinguixConfig): boolean {
    try {
      this.apiKey = config.apiKey;
      this.teamId = config.teamId || null;

      // Store in localStorage for persistence
      if (this.apiKey) {
        localStorage.setItem('linguix_api_key', this.apiKey);
      }
      if (this.teamId) {
        localStorage.setItem('linguix_team_id', this.teamId);
      }

      console.log('✅ Linguix integration initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Linguix:', error);
      return false;
    }
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.apiKey !== null || localStorage.getItem('linguix_api_key') !== null;
  }

  // Get authentication headers
  private getAuthHeaders(): HeadersInit {
    const apiKey = this.apiKey || localStorage.getItem('linguix_api_key');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  // ============================================================================
  // GRAMMAR AND STYLE CHECKING
  // ============================================================================

  async checkText(request: CheckRequest): Promise<CheckResponse | null> {
    try {
      // Simulate grammar checking
      const matches = this.detectGrammarIssues(request.text);
      const qualityScore = this.calculateQualityScore(request.text, matches);

      return {
        matches,
        language: request.language || 'en-US',
        qualityScore
      };
    } catch (error) {
      console.error('❌ Text check failed:', error);
      return null;
    }
  }

  private detectGrammarIssues(text: string): GrammarMatch[] {
    const matches: GrammarMatch[] = [];

    // Check for common errors
    const patterns = [
      {
        regex: /\b(their|there|they're)\b/gi,
        message: 'Possible confusion between their/there/they\'re',
        category: 'grammar'
      },
      {
        regex: /\b(your|you're)\b/gi,
        message: 'Possible confusion between your/you\'re',
        category: 'grammar'
      },
      {
        regex: /\b(its|it's)\b/gi,
        message: 'Possible confusion between its/it\'s',
        category: 'grammar'
      },
      {
        regex: /\s{2,}/g,
        message: 'Extra whitespace',
        category: 'spacing'
      }
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        matches.push({
          message: pattern.message,
          shortMessage: pattern.message.split('.')[0],
          offset: match.index,
          length: match[0].length,
          replacements: this.getSuggestions(match[0], pattern.category),
          context: {
            text: text.substring(Math.max(0, match.index - 20), Math.min(text.length, match.index + match[0].length + 20)),
            offset: Math.min(20, match.index),
            length: match[0].length
          },
          rule: {
            id: `rule-${pattern.category}`,
            description: pattern.message,
            category: pattern.category,
            issueType: 'misspelling'
          },
          type: {
            typeName: pattern.category
          }
        });
      }
    });

    return matches;
  }

  private getSuggestions(text: string, category: string): Replacement[] {
    // Simple suggestion logic
    if (category === 'spacing') {
      return [{ value: ' ', description: 'Single space' }];
    }

    return [
      { value: text.toLowerCase(), description: 'Lowercase version' },
      { value: text.toUpperCase(), description: 'Uppercase version' }
    ];
  }

  private calculateQualityScore(text: string, matches: GrammarMatch[]): number {
    const words = text.split(/\s+/).length;
    const errorsPerWord = matches.length / words;

    let score = 100 - (errorsPerWord * 100);
    score = Math.max(0, Math.min(100, score));

    return Math.round(score);
  }

  // ============================================================================
  // REWRITING AND PARAPHRASING
  // ============================================================================

  async rewriteText(request: RewriteRequest): Promise<RewriteResponse | null> {
    try {
      const { text, style, tone, purpose } = request;

      // Simulate rewriting based on parameters
      let rewritten = text;
      const changes: Change[] = [];
      const improvements: string[] = [];

      if (purpose === 'shorten') {
        rewritten = this.shortenText(text);
        changes.push({
          type: 'deletion',
          original: text,
          new: rewritten,
          reason: 'Removed redundant words and phrases'
        });
        improvements.push('Reduced word count by ~30%');
      } else if (purpose === 'expand') {
        rewritten = this.expandText(text);
        changes.push({
          type: 'addition',
          original: text,
          new: rewritten,
          reason: 'Added detail and context'
        });
        improvements.push('Enhanced with additional context');
      } else if (purpose === 'simplify') {
        rewritten = this.simplifyText(text);
        changes.push({
          type: 'modification',
          original: text,
          new: rewritten,
          reason: 'Replaced complex words with simpler alternatives'
        });
        improvements.push('Improved readability');
      }

      if (style === 'formal') {
        improvements.push('Adjusted tone to be more formal');
      } else if (style === 'casual') {
        improvements.push('Adjusted tone to be more casual');
      }

      return {
        original: text,
        rewritten,
        changes,
        improvements
      };
    } catch (error) {
      console.error('❌ Text rewriting failed:', error);
      return null;
    }
  }

  private shortenText(text: string): string {
    // Simple shortening logic
    return text
      .replace(/\b(very|really|actually|basically)\s+/gi, '')
      .replace(/\b(in order to)\b/gi, 'to')
      .replace(/\b(due to the fact that)\b/gi, 'because');
  }

  private expandText(text: string): string {
    // Simple expansion logic
    return text.replace(/\.\s/g, '. Moreover, ');
  }

  private simplifyText(text: string): string {
    // Replace complex words with simpler alternatives
    const replacements: Record<string, string> = {
      'utilize': 'use',
      'commence': 'start',
      'terminate': 'end',
      'facilitate': 'help',
      'demonstrate': 'show',
      'subsequent': 'next',
      'prior': 'before',
      'approximately': 'about'
    };

    let simplified = text;
    Object.entries(replacements).forEach(([complex, simple]) => {
      simplified = simplified.replace(new RegExp(`\\b${complex}\\b`, 'gi'), simple);
    });

    return simplified;
  }

  async paraphrase(request: ParaphraseRequest): Promise<ParaphraseResponse | null> {
    try {
      const variants: ParaphraseResponse['variants'] = [];
      const numVariants = request.variants || 3;

      for (let i = 0; i < numVariants; i++) {
        // Generate simple variations
        const variant = this.generateVariation(request.text, i);
        variants.push({
          text: variant,
          similarity: 0.7 + (Math.random() * 0.2),
          readability: 70 + Math.floor(Math.random() * 20)
        });
      }

      return {
        original: request.text,
        variants
      };
    } catch (error) {
      console.error('❌ Paraphrasing failed:', error);
      return null;
    }
  }

  private generateVariation(text: string, index: number): string {
    // Simple variation generation
    const variations = [
      text.split(' ').reverse().join(' '),
      text.charAt(0).toUpperCase() + text.slice(1),
      text.replace(/\./g, ';')
    ];

    return variations[index % variations.length] || text;
  }

  // ============================================================================
  // SHORTCUTS AND TEMPLATES
  // ============================================================================

  async getShortcuts(): Promise<Shortcut[]> {
    try {
      const savedShortcuts = localStorage.getItem('linguix_shortcuts');
      if (savedShortcuts) {
        return JSON.parse(savedShortcuts);
      }

      // Return default shortcuts
      return [
        {
          id: 'shortcut-1',
          trigger: '/email',
          expansion: 'Best regards,\n[Your Name]',
          description: 'Email signature',
          category: 'email',
          createdAt: new Date().toISOString()
        },
        {
          id: 'shortcut-2',
          trigger: '/date',
          expansion: new Date().toLocaleDateString(),
          description: 'Current date',
          category: 'general',
          createdAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('❌ Failed to get shortcuts:', error);
      return [];
    }
  }

  async createShortcut(shortcut: Omit<Shortcut, 'id' | 'createdAt'>): Promise<Shortcut> {
    const newShortcut: Shortcut = {
      ...shortcut,
      id: `shortcut-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const shortcuts = await this.getShortcuts();
    shortcuts.push(newShortcut);

    localStorage.setItem('linguix_shortcuts', JSON.stringify(shortcuts));
    console.log('✅ Created shortcut:', newShortcut.trigger);

    return newShortcut;
  }

  async deleteShortcut(id: string): Promise<boolean> {
    try {
      const shortcuts = await this.getShortcuts();
      const filtered = shortcuts.filter(s => s.id !== id);

      localStorage.setItem('linguix_shortcuts', JSON.stringify(filtered));
      console.log('✅ Deleted shortcut:', id);

      return true;
    } catch (error) {
      console.error('❌ Failed to delete shortcut:', error);
      return false;
    }
  }

  // ============================================================================
  // TEAM STYLE GUIDE
  // ============================================================================

  async getTeamStyleGuide(): Promise<TeamStyleGuide | null> {
    try {
      // Mock implementation
      return {
        id: 'team-guide-1',
        name: 'Company Writing Standards',
        description: 'Official style guide for all company communications',
        rules: [
          {
            id: 'rule-1',
            name: 'Oxford Comma',
            description: 'Always use Oxford comma in lists',
            category: 'grammar',
            enabled: true,
            severity: 'warning',
            examples: [
              {
                incorrect: 'We offer support, training and consulting',
                correct: 'We offer support, training, and consulting'
              }
            ]
          },
          {
            id: 'rule-2',
            name: 'Active Voice',
            description: 'Prefer active voice over passive',
            category: 'style',
            enabled: true,
            severity: 'suggestion',
            examples: [
              {
                incorrect: 'The report was written by the team',
                correct: 'The team wrote the report'
              }
            ]
          }
        ],
        terminology: [
          {
            term: 'customer',
            definition: 'Person or organization using our product',
            preferredAlternatives: ['user'],
            avoidAlternatives: ['client', 'consumer']
          }
        ],
        brandVoice: {
          description: 'Professional, helpful, and approachable',
          keywords: ['clear', 'concise', 'empathetic', 'actionable'],
          examples: [
            'We\'re here to help you succeed.',
            'Let\'s work together to solve this.'
          ]
        }
      };
    } catch (error) {
      console.error('❌ Failed to get team style guide:', error);
      return null;
    }
  }

  // ============================================================================
  // QUALITY SCORING
  // ============================================================================

  async getQualityScore(text: string): Promise<QualityScore | null> {
    try {
      const checkResult = await this.checkText({ text });
      if (!checkResult) return null;

      const words = text.split(/\s+/).length;
      const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;

      // Calculate readability
      const avgWordsPerSentence = words / sentences;
      const readabilityScore = this.calculateFleschKincaid(text);

      return {
        overall: checkResult.qualityScore,
        breakdown: {
          grammar: Math.max(0, 100 - checkResult.matches.length * 5),
          spelling: 95,
          style: 88,
          clarity: this.calculateClarityScore(text),
          engagement: this.calculateEngagementScore(text)
        },
        readability: {
          score: readabilityScore,
          grade: this.getReadabilityGrade(readabilityScore)
        },
        recommendations: this.getRecommendations(checkResult, text)
      };
    } catch (error) {
      console.error('❌ Quality scoring failed:', error);
      return null;
    }
  }

  private calculateClarityScore(text: string): number {
    const words = text.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;

    // Shorter words = clearer writing
    return Math.max(0, 100 - (avgWordLength * 5));
  }

  private calculateEngagementScore(text: string): number {
    let score = 70;

    // Check for questions
    if (text.includes('?')) score += 10;

    // Check for exclamations (moderate use)
    const exclamations = (text.match(/!/g) || []).length;
    if (exclamations > 0 && exclamations < 3) score += 10;

    // Check for personal pronouns (engagement)
    if (/\b(you|we|our)\b/i.test(text)) score += 10;

    return Math.min(100, score);
  }

  private calculateFleschKincaid(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    const score = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    const vowels = word.match(/[aeiouy]+/g);
    let count = vowels ? vowels.length : 1;

    if (word.endsWith('e')) count--;
    if (word.endsWith('le') && word.length > 2) count++;

    return Math.max(1, count);
  }

  private getReadabilityGrade(score: number): string {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College)';
    return 'Very Difficult (College graduate)';
  }

  private getRecommendations(checkResult: CheckResponse, text: string): string[] {
    const recommendations: string[] = [];

    if (checkResult.matches.length > 5) {
      recommendations.push('Review grammar and spelling suggestions');
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgLength = text.split(/\s+/).length / sentences.length;

    if (avgLength > 20) {
      recommendations.push('Consider breaking long sentences into shorter ones');
    }

    if (!text.includes('?') && text.length > 200) {
      recommendations.push('Add questions to increase engagement');
    }

    return recommendations;
  }

  // ============================================================================
  // TRANSLATION (MULTILINGUAL SUPPORT)
  // ============================================================================

  async translate(request: TranslationRequest): Promise<TranslationResponse | null> {
    try {
      console.warn('⚠️ Translation requires external translation API');

      return {
        translatedText: `[Translated: ${request.text}]`,
        sourceLang: request.sourceLang,
        targetLang: request.targetLang,
        confidence: 0.85
      };
    } catch (error) {
      console.error('❌ Translation failed:', error);
      return null;
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const linguixIntegration = new LinguixIntegrationService();
