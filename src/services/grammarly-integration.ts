/**
 * GRAMMARLY INTEGRATION SERVICE
 * AI-powered writing assistant with grammar, style, and tone detection
 *
 * Features:
 * - Text analysis with grammar and spelling corrections
 * - Style and clarity suggestions
 * - Tone detection and adjustment
 * - Plagiarism detection (premium)
 * - Editor SDK React integration
 * - Real-time writing feedback
 * - Writing statistics and insights
 *
 * API Documentation:
 * https://developer.grammarly.com/docs
 * https://developer.grammarly.com/docs/api/editor-sdk-react
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GrammarlyConfig {
  clientId: string;
  apiKey?: string;
}

export interface TextAnalysisRequest {
  text: string;
  dialect?: 'american' | 'british' | 'canadian' | 'australian';
  domain?: 'general' | 'academic' | 'business' | 'email' | 'casual' | 'creative';
  goals?: {
    audience?: 'general' | 'knowledgeable' | 'expert';
    formality?: 'neutral' | 'informal' | 'formal';
    domain?: 'general' | 'academic' | 'business' | 'technical' | 'casual' | 'creative';
    tone?: string[];
  };
}

export interface TextAnalysisResult {
  text: string;
  score: number; // Overall quality score 0-100
  alerts: Alert[];
  statistics: TextStatistics;
  suggestions: Suggestion[];
}

export interface Alert {
  id: string;
  category: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'clarity' | 'engagement' | 'delivery' | 'tone';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  begin: number; // Character position
  end: number;
  replacements: string[];
  impact: 'correctness' | 'clarity' | 'engagement' | 'delivery';
  examples?: string[];
}

export interface Suggestion {
  type: 'grammar' | 'spelling' | 'style' | 'clarity' | 'tone' | 'wordChoice';
  original: string;
  suggested: string;
  explanation: string;
  confidence: number; // 0-1
}

export interface TextStatistics {
  characters: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readabilityScore: number; // 0-100 (higher = easier to read)
  vocabularyDiversity: number; // 0-1
  averageWordLength: number;
  averageSentenceLength: number;
}

export interface ToneAnalysis {
  overall: string[];
  tones: {
    tone: string;
    confidence: number;
    examples: string[];
  }[];
  recommendations: string[];
}

export interface PlagiarismCheckRequest {
  text: string;
  excludeSources?: string[];
}

export interface PlagiarismCheckResult {
  overallScore: number; // 0-100 (0 = no plagiarism)
  matches: PlagiarismMatch[];
  sources: number;
  citationsNeeded: boolean;
}

export interface PlagiarismMatch {
  text: string;
  source: string;
  url?: string;
  matchPercentage: number;
  begin: number;
  end: number;
}

export interface WritingGoals {
  audience?: 'general' | 'knowledgeable' | 'expert';
  formality?: 'neutral' | 'informal' | 'formal';
  domain?: 'general' | 'academic' | 'business' | 'technical' | 'casual' | 'creative';
  tone?: string[];
  intent?: 'inform' | 'describe' | 'convince' | 'tellStory';
}

export interface EditorOptions {
  autocomplete?: boolean;
  underlines?: boolean;
  emotionsMirroring?: boolean;
  documentDialect?: 'american' | 'british' | 'canadian' | 'australian';
}

// ============================================================================
// GRAMMARLY INTEGRATION SERVICE
// ============================================================================

class GrammarlyIntegrationService {
  private clientId: string | null = null;
  private apiKey: string | null = null;
  private baseUrl = 'https://api.grammarly.com/v1';

  // Initialize service with credentials
  initialize(config: GrammarlyConfig): boolean {
    try {
      this.clientId = config.clientId;
      this.apiKey = config.apiKey || null;

      // Store in localStorage for persistence
      if (this.clientId) {
        localStorage.setItem('grammarly_client_id', this.clientId);
      }
      if (this.apiKey) {
        localStorage.setItem('grammarly_api_key', this.apiKey);
      }

      console.log('✅ Grammarly integration initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Grammarly:', error);
      return false;
    }
  }

  // Check if service is configured
  isConfigured(): boolean {
    return this.clientId !== null || localStorage.getItem('grammarly_client_id') !== null;
  }

  // Get authentication headers
  private getAuthHeaders(): HeadersInit {
    const apiKey = this.apiKey || localStorage.getItem('grammarly_api_key');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  // ============================================================================
  // TEXT ANALYSIS
  // ============================================================================

  async analyzeText(request: TextAnalysisRequest): Promise<TextAnalysisResult | null> {
    try {
      // Note: This is a simulated implementation
      // Real Grammarly API requires OAuth and specific endpoints

      // For now, return mock data structure for UI integration
      const words = request.text.split(/\s+/).filter(w => w.length > 0);
      const sentences = request.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const paragraphs = request.text.split(/\n\n+/).filter(p => p.trim().length > 0);

      const statistics: TextStatistics = {
        characters: request.text.length,
        words: words.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        readabilityScore: this.calculateReadabilityScore(words, sentences),
        vocabularyDiversity: this.calculateVocabularyDiversity(words),
        averageWordLength: words.reduce((sum, w) => sum + w.length, 0) / words.length,
        averageSentenceLength: words.length / sentences.length
      };

      // Simulate basic grammar/style detection
      const alerts: Alert[] = this.detectBasicIssues(request.text);

      // Calculate overall score
      const score = Math.max(0, 100 - (alerts.length * 5));

      return {
        text: request.text,
        score,
        alerts,
        statistics,
        suggestions: alerts.map(alert => ({
          type: alert.category as any,
          original: request.text.substring(alert.begin, alert.end),
          suggested: alert.replacements[0] || '',
          explanation: alert.description,
          confidence: alert.severity === 'critical' ? 0.95 : alert.severity === 'high' ? 0.85 : 0.7
        }))
      };
    } catch (error) {
      console.error('❌ Text analysis failed:', error);
      return null;
    }
  }

  // ============================================================================
  // TONE ANALYSIS
  // ============================================================================

  async analyzeTone(text: string): Promise<ToneAnalysis | null> {
    try {
      // Simulate tone detection based on text characteristics
      const tones: { tone: string; confidence: number; examples: string[] }[] = [];

      // Check for formal tone
      if (text.includes('furthermore') || text.includes('therefore') || text.includes('however')) {
        tones.push({
          tone: 'formal',
          confidence: 0.85,
          examples: ['Use of transition words like "furthermore", "therefore"']
        });
      }

      // Check for confident tone
      if (text.includes('will') || text.includes('definitely') || text.includes('certainly')) {
        tones.push({
          tone: 'confident',
          confidence: 0.80,
          examples: ['Strong assertions with "will", "definitely"']
        });
      }

      // Check for friendly tone
      if (text.includes('!') || text.includes(':)') || text.match(/\bhey\b/i)) {
        tones.push({
          tone: 'friendly',
          confidence: 0.75,
          examples: ['Exclamation marks and casual greetings']
        });
      }

      const overall = tones.map(t => t.tone);

      return {
        overall,
        tones,
        recommendations: this.generateToneRecommendations(tones, text)
      };
    } catch (error) {
      console.error('❌ Tone analysis failed:', error);
      return null;
    }
  }

  // ============================================================================
  // PLAGIARISM CHECK (PREMIUM)
  // ============================================================================

  async checkPlagiarism(request: PlagiarismCheckRequest): Promise<PlagiarismCheckResult | null> {
    try {
      // Note: Plagiarism check requires Grammarly Premium
      // This is a mock implementation for UI structure

      console.warn('⚠️ Plagiarism check requires Grammarly Premium subscription');

      return {
        overallScore: 0,
        matches: [],
        sources: 0,
        citationsNeeded: false
      };
    } catch (error) {
      console.error('❌ Plagiarism check failed:', error);
      return null;
    }
  }

  // ============================================================================
  // WRITING IMPROVEMENT
  // ============================================================================

  async improveClarity(text: string): Promise<{ original: string; improved: string; changes: string[] } | null> {
    try {
      // Simulate clarity improvements
      let improved = text;
      const changes: string[] = [];

      // Replace passive voice with active voice (simple heuristic)
      const passiveMatches = text.match(/\b(was|were|is|are|been|being)\s+\w+ed\b/gi);
      if (passiveMatches) {
        changes.push('Convert passive voice to active voice for clarity');
      }

      // Replace complex words with simpler alternatives
      const complexWords: Record<string, string> = {
        'utilize': 'use',
        'commence': 'start',
        'terminate': 'end',
        'facilitate': 'help',
        'demonstrate': 'show'
      };

      Object.entries(complexWords).forEach(([complex, simple]) => {
        if (improved.toLowerCase().includes(complex)) {
          improved = improved.replace(new RegExp(complex, 'gi'), simple);
          changes.push(`Replaced "${complex}" with simpler "${simple}"`);
        }
      });

      return { original: text, improved, changes };
    } catch (error) {
      console.error('❌ Clarity improvement failed:', error);
      return null;
    }
  }

  async enhanceEngagement(text: string): Promise<{ original: string; enhanced: string; techniques: string[] } | null> {
    try {
      let enhanced = text;
      const techniques: string[] = [];

      // Add rhetorical questions (if appropriate)
      if (!text.includes('?')) {
        techniques.push('Consider adding questions to engage readers');
      }

      // Check for variety in sentence structure
      const sentences = text.split(/[.!?]+/);
      const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;

      if (avgLength > 20) {
        techniques.push('Mix short and long sentences for better rhythm');
      }

      // Check for strong verbs
      const weakVerbs = ['is', 'was', 'are', 'were', 'has', 'have', 'had'];
      const verbCount = weakVerbs.reduce((count, verb) => {
        return count + (text.match(new RegExp(`\\b${verb}\\b`, 'gi'))?.length || 0);
      }, 0);

      if (verbCount > sentences.length * 0.3) {
        techniques.push('Replace weak verbs (is, was, has) with stronger action verbs');
      }

      return { original: text, enhanced, techniques };
    } catch (error) {
      console.error('❌ Engagement enhancement failed:', error);
      return null;
    }
  }

  // ============================================================================
  // EDITOR SDK INTEGRATION
  // ============================================================================

  getEditorSDKConfig(options: EditorOptions = {}): any {
    return {
      clientId: this.clientId || localStorage.getItem('grammarly_client_id'),
      autocomplete: options.autocomplete ?? true,
      underlines: options.underlines ?? true,
      emotionsMirroring: options.emotionsMirroring ?? false,
      documentDialect: options.documentDialect ?? 'american'
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private calculateReadabilityScore(words: string[], sentences: string[]): number {
    // Simplified Flesch Reading Ease formula
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = words.reduce((sum, word) => sum + this.countSyllables(word), 0) / words.length;

    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  private calculateVocabularyDiversity(words: string[]): number {
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    return uniqueWords.size / words.length;
  }

  private countSyllables(word: string): number {
    // Simple syllable counting heuristic
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    const vowels = word.match(/[aeiouy]+/g);
    let count = vowels ? vowels.length : 1;

    if (word.endsWith('e')) count--;
    if (word.endsWith('le') && word.length > 2) count++;

    return Math.max(1, count);
  }

  private detectBasicIssues(text: string): Alert[] {
    const alerts: Alert[] = [];

    // Check for double spaces
    let match;
    const doubleSpaceRegex = /  +/g;
    while ((match = doubleSpaceRegex.exec(text)) !== null) {
      alerts.push({
        id: `space-${match.index}`,
        category: 'punctuation',
        title: 'Extra space',
        description: 'Remove extra spaces between words',
        severity: 'low',
        begin: match.index,
        end: match.index + match[0].length,
        replacements: [' '],
        impact: 'correctness'
      });
    }

    // Check for missing spaces after punctuation
    const missingSpaceRegex = /[.!?,;:]([a-zA-Z])/g;
    while ((match = missingSpaceRegex.exec(text)) !== null) {
      alerts.push({
        id: `spacing-${match.index}`,
        category: 'punctuation',
        title: 'Missing space',
        description: 'Add space after punctuation',
        severity: 'medium',
        begin: match.index,
        end: match.index + 2,
        replacements: [match[0][0] + ' ' + match[0][1]],
        impact: 'correctness'
      });
    }

    // Check for sentence fragments (starting with lowercase)
    const fragmentRegex = /[.!?]\s+([a-z])/g;
    while ((match = fragmentRegex.exec(text)) !== null) {
      alerts.push({
        id: `capitalization-${match.index}`,
        category: 'grammar',
        title: 'Capitalization',
        description: 'Sentence should start with a capital letter',
        severity: 'medium',
        begin: match.index + 2,
        end: match.index + 3,
        replacements: [match[1].toUpperCase()],
        impact: 'correctness'
      });
    }

    return alerts;
  }

  private generateToneRecommendations(tones: any[], text: string): string[] {
    const recommendations: string[] = [];

    if (tones.some(t => t.tone === 'formal') && tones.some(t => t.tone === 'casual')) {
      recommendations.push('Consider maintaining consistent formality throughout');
    }

    if (tones.length === 0) {
      recommendations.push('Try adding more personality to engage your readers');
    }

    if (text.split('!').length > 5) {
      recommendations.push('Consider using exclamation marks more sparingly for impact');
    }

    return recommendations;
  }

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  async analyzeMultipleTexts(texts: string[]): Promise<TextAnalysisResult[]> {
    const results = await Promise.all(
      texts.map(text => this.analyzeText({ text }))
    );
    return results.filter(r => r !== null) as TextAnalysisResult[];
  }

  // ============================================================================
  // STATISTICS & REPORTING
  // ============================================================================

  getWritingStatistics(results: TextAnalysisResult[]): {
    averageScore: number;
    totalWords: number;
    totalAlerts: number;
    commonIssues: { category: string; count: number }[];
  } {
    const totalWords = results.reduce((sum, r) => sum + r.statistics.words, 0);
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const totalAlerts = results.reduce((sum, r) => sum + r.alerts.length, 0);

    // Count common issues
    const issueCounts: Record<string, number> = {};
    results.forEach(result => {
      result.alerts.forEach(alert => {
        issueCounts[alert.category] = (issueCounts[alert.category] || 0) + 1;
      });
    });

    const commonIssues = Object.entries(issueCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      averageScore,
      totalWords,
      totalAlerts,
      commonIssues
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const grammarlyIntegration = new GrammarlyIntegrationService();
