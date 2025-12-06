/**
 * OPENAI EXTENDED SERVICE
 * Complete OpenAI API Integration with ALL capabilities
 *
 * Features:
 * - Vision (GPT-4o-vision) - Analyze images
 * - DALL-E 3 - Generate images
 * - Whisper - Audio transcription
 * - TTS - Text-to-speech
 * - Assistants - Persistent AI with memory
 * - Embeddings - Semantic search
 * - Chat Completions - Text generation (already in openai-content-enhancer.ts)
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

// ============================================================================
// INTERFACES
// ============================================================================

export interface VisionRequest {
  imageUrl: string;
  prompt: string;
  detail?: 'low' | 'high' | 'auto';
  maxTokens?: number;
}

export interface VisionResponse {
  description: string;
  analysis: string;
  suggestions: string[];
  tokensUsed: number;
  cost: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
}

export interface ImageGenerationResponse {
  images: {
    url: string;
    revisedPrompt: string;
  }[];
  cost: number;
}

export interface TranscriptionRequest {
  audioFile: File | Blob;
  language?: string;
  prompt?: string;
  temperature?: number;
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
}

export interface TranscriptionResponse {
  text: string;
  language?: string;
  duration?: number;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  cost: number;
}

export interface TTSRequest {
  text: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  model?: 'tts-1' | 'tts-1-hd';
  speed?: number;
  responseFormat?: 'mp3' | 'opus' | 'aac' | 'flac';
}

export interface TTSResponse {
  audioUrl: string;
  audioBlob: Blob;
  cost: number;
}

export interface AssistantRequest {
  name: string;
  instructions: string;
  model?: string;
  tools?: Array<{ type: 'code_interpreter' | 'retrieval' | 'function' }>;
  fileIds?: string[];
}

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface EmbeddingRequest {
  input: string | string[];
  model?: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002';
}

export interface EmbeddingResponse {
  embeddings: number[][];
  tokensUsed: number;
  cost: number;
}

// ============================================================================
// OPENAI EXTENDED SERVICE
// ============================================================================

class OpenAIExtendedService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  initialize(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
    console.log('✅ OpenAI Extended Service initialized');
  }

  isConfigured(): boolean {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
    return !!this.apiKey;
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // ============================================================================
  // VISION API (GPT-4o-vision)
  // ============================================================================

  async analyzeImage(request: VisionRequest): Promise<VisionResponse | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('openai-vision');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: request.prompt },
                  {
                    type: 'image_url',
                    image_url: {
                      url: request.imageUrl,
                      detail: request.detail || 'auto'
                    }
                  }
                ]
              }
            ],
            max_tokens: request.maxTokens || 1000
          })
        });
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Vision API error:', error);
        return null;
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Extract analysis components
      const lines = content.split('\n');
      const description = lines[0] || content.substring(0, 200);
      const suggestions = lines.filter((l: string) => l.includes('-') || l.includes('•')).slice(0, 5);

      const tokensUsed = data.usage.total_tokens;
      const cost = this.calculateVisionCost(tokensUsed, request.detail || 'auto');

      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('openai-vision', true, duration);

      return {
        description,
        analysis: content,
        suggestions,
        tokensUsed,
        cost
      };

    } catch (error) {
      console.error('Vision analysis error:', error);
      MetricsCollector.recordAPICall('openai-vision', false, 0);
      return null;
    }
  }

  /**
   * Batch analyze multiple images
   */
  async analyzeImages(requests: VisionRequest[]): Promise<VisionResponse[]> {
    console.log(`📸 Analyzing ${requests.length} images...`);
    const results: VisionResponse[] = [];

    for (const request of requests) {
      const result = await this.analyzeImage(request);
      if (result) results.push(result);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }

    console.log(`✅ Analyzed ${results.length} images`);
    return results;
  }

  // ============================================================================
  // DALL-E 3 IMAGE GENERATION
  // ============================================================================

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('openai-dalle');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/images/generations`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: request.prompt,
            n: request.n || 1,
            size: request.size || '1024x1024',
            quality: request.quality || 'standard',
            style: request.style || 'vivid'
          })
        });
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('DALL-E error:', error);
        return null;
      }

      const data = await response.json();

      const images = data.data.map((img: any) => ({
        url: img.url,
        revisedPrompt: img.revised_prompt
      }));

      const cost = this.calculateDalleCost(request.size || '1024x1024', request.quality || 'standard');

      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('openai-dalle', true, duration);

      return { images, cost };

    } catch (error) {
      console.error('Image generation error:', error);
      MetricsCollector.recordAPICall('openai-dalle', false, 0);
      return null;
    }
  }

  /**
   * Generate YouTube thumbnail
   */
  async generateYouTubeThumbnail(title: string, niche: string): Promise<ImageGenerationResponse | null> {
    const prompt = `Create a professional, eye-catching YouTube thumbnail for: "${title}"

Niche: ${niche}
Style: Bold text, vibrant colors, high contrast
Text: Include title text in the image
Professional quality, click-worthy, viral potential`;

    return this.generateImage({
      prompt,
      size: '1792x1024',
      quality: 'hd',
      style: 'vivid'
    });
  }

  /**
   * Generate social media image
   */
  async generateSocialImage(text: string, platform: 'instagram' | 'twitter' | 'facebook'): Promise<ImageGenerationResponse | null> {
    const sizes = {
      instagram: '1024x1024' as const,
      twitter: '1024x1024' as const,
      facebook: '1024x1024' as const
    };

    const prompt = `Create a stunning ${platform} post image with this text: "${text}"

Modern design, aesthetic, engaging, brand-friendly
Include text overlay if needed
High quality, social media optimized`;

    return this.generateImage({
      prompt,
      size: sizes[platform],
      quality: 'hd'
    });
  }

  // ============================================================================
  // WHISPER AUDIO TRANSCRIPTION
  // ============================================================================

  async transcribeAudio(request: TranscriptionRequest): Promise<TranscriptionResponse | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('openai-whisper');

    try {
      const startTime = Date.now();

      const formData = new FormData();
      formData.append('file', request.audioFile);
      formData.append('model', 'whisper-1');
      if (request.language) formData.append('language', request.language);
      if (request.prompt) formData.append('prompt', request.prompt);
      if (request.temperature) formData.append('temperature', request.temperature.toString());
      formData.append('response_format', request.responseFormat || 'verbose_json');

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/audio/transcriptions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
            // Don't set Content-Type, let browser set it with boundary
          },
          body: formData
        });
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Whisper error:', error);
        return null;
      }

      const data = await response.json();

      const cost = this.calculateWhisperCost(request.audioFile.size);

      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('openai-whisper', true, duration);

      return {
        text: data.text,
        language: data.language,
        duration: data.duration,
        segments: data.segments,
        cost
      };

    } catch (error) {
      console.error('Transcription error:', error);
      MetricsCollector.recordAPICall('openai-whisper', false, 0);
      return null;
    }
  }

  /**
   * Transcribe voice note to text
   */
  async voiceNoteToText(audioBlob: Blob): Promise<string | null> {
    const result = await this.transcribeAudio({
      audioFile: audioBlob,
      responseFormat: 'text'
    });
    return result?.text || null;
  }

  // ============================================================================
  // TEXT-TO-SPEECH (TTS)
  // ============================================================================

  async generateSpeech(request: TTSRequest): Promise<TTSResponse | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('openai-tts');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/audio/speech`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            model: request.model || 'tts-1',
            input: request.text,
            voice: request.voice || 'alloy',
            speed: request.speed || 1.0,
            response_format: request.responseFormat || 'mp3'
          })
        });
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('TTS error:', error);
        return null;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const cost = this.calculateTTSCost(request.text.length, request.model || 'tts-1');

      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('openai-tts', true, duration);

      return {
        audioUrl,
        audioBlob,
        cost
      };

    } catch (error) {
      console.error('TTS error:', error);
      MetricsCollector.recordAPICall('openai-tts', false, 0);
      return null;
    }
  }

  /**
   * Generate voiceover for YouTube script
   */
  async generateYouTubeVoiceover(script: string, voice?: TTSRequest['voice']): Promise<TTSResponse | null> {
    return this.generateSpeech({
      text: script,
      voice: voice || 'nova',
      model: 'tts-1-hd',
      speed: 1.0
    });
  }

  // ============================================================================
  // ASSISTANTS API (Persistent Memory)
  // ============================================================================

  /**
   * Create an AI assistant with persistent memory
   */
  async createAssistant(request: AssistantRequest): Promise<{ id: string; name: string } | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('openai-assistants');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/assistants`, {
          method: 'POST',
          headers: {
            ...this.getAuthHeaders(),
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({
            name: request.name,
            instructions: request.instructions,
            model: request.model || 'gpt-4o',
            tools: request.tools || [],
            file_ids: request.fileIds || []
          })
        });
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Assistants API error:', error);
        return null;
      }

      const data = await response.json();
      console.log(`✅ Created assistant: ${data.name} (${data.id})`);

      return {
        id: data.id,
        name: data.name
      };

    } catch (error) {
      console.error('Create assistant error:', error);
      return null;
    }
  }

  /**
   * Create a conversation thread
   */
  async createThread(): Promise<string | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/threads`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Thread creation error:', error);
        return null;
      }

      const data = await response.json();
      return data.id;

    } catch (error) {
      console.error('Create thread error:', error);
      return null;
    }
  }

  /**
   * Send message to assistant
   */
  async sendMessage(threadId: string, assistantId: string, message: string): Promise<AssistantMessage | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    try {
      // Add message to thread
      await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });

      // Run the assistant
      const runResponse = await fetch(`${this.baseUrl}/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: assistantId
        })
      });

      const runData = await runResponse.json();
      const runId = runData.id;

      // Poll for completion
      let status = 'queued';
      let attempts = 0;
      while (status === 'queued' || status === 'in_progress') {
        if (attempts++ > 60) break; // Timeout after 60 seconds
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusResponse = await fetch(`${this.baseUrl}/threads/${threadId}/runs/${runId}`, {
          headers: {
            ...this.getAuthHeaders(),
            'OpenAI-Beta': 'assistants=v2'
          }
        });

        const statusData = await statusResponse.json();
        status = statusData.status;
      }

      if (status !== 'completed') {
        console.error('Run did not complete:', status);
        return null;
      }

      // Get messages
      const messagesResponse = await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
        headers: {
          ...this.getAuthHeaders(),
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      const messagesData = await messagesResponse.json();
      const latestMessage = messagesData.data[0];

      return {
        role: 'assistant',
        content: latestMessage.content[0].text.value,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Send message error:', error);
      return null;
    }
  }

  /**
   * Get conversation history from thread
   */
  async getThreadMessages(threadId: string): Promise<AssistantMessage[]> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
        headers: {
          ...this.getAuthHeaders(),
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!response.ok) return [];

      const data = await response.json();

      return data.data.map((msg: any) => ({
        role: msg.role,
        content: msg.content[0].text.value,
        timestamp: msg.created_at * 1000
      })).reverse();

    } catch (error) {
      console.error('Get thread messages error:', error);
      return [];
    }
  }

  /**
   * Delete an assistant
   */
  async deleteAssistant(assistantId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(`${this.baseUrl}/assistants/${assistantId}`, {
        method: 'DELETE',
        headers: {
          ...this.getAuthHeaders(),
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      return response.ok;

    } catch (error) {
      console.error('Delete assistant error:', error);
      return false;
    }
  }

  // ============================================================================
  // EMBEDDINGS API
  // ============================================================================

  async createEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse | null> {
    if (!this.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('openai-embeddings');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/embeddings`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            model: request.model || 'text-embedding-3-small',
            input: request.input,
            encoding_format: 'float'
          })
        });
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Embeddings error:', error);
        return null;
      }

      const data = await response.json();

      const embeddings = data.data.map((item: any) => item.embedding);
      const tokensUsed = data.usage.total_tokens;
      const cost = this.calculateEmbeddingsCost(tokensUsed, request.model || 'text-embedding-3-small');

      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('openai-embeddings', true, duration);

      return {
        embeddings,
        tokensUsed,
        cost
      };

    } catch (error) {
      console.error('Embeddings error:', error);
      MetricsCollector.recordAPICall('openai-embeddings', false, 0);
      return null;
    }
  }

  /**
   * Calculate similarity between two texts
   */
  async calculateSimilarity(text1: string, text2: string): Promise<number | null> {
    const result = await this.createEmbeddings({
      input: [text1, text2],
      model: 'text-embedding-3-small'
    });

    if (!result || result.embeddings.length !== 2) return null;

    // Calculate cosine similarity
    const [vec1, vec2] = result.embeddings;
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (mag1 * mag2);
  }

  /**
   * Find similar content from library
   */
  async findSimilarContent(query: string, library: string[]): Promise<Array<{ content: string; similarity: number }>> {
    const allTexts = [query, ...library];
    const result = await this.createEmbeddings({
      input: allTexts,
      model: 'text-embedding-3-small'
    });

    if (!result) return [];

    const queryEmbedding = result.embeddings[0];
    const similarities = library.map((content, idx) => {
      const contentEmbedding = result.embeddings[idx + 1];
      const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * contentEmbedding[i], 0);
      const mag1 = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0));
      const mag2 = Math.sqrt(contentEmbedding.reduce((sum, val) => sum + val * val, 0));
      const similarity = dotProduct / (mag1 * mag2);

      return { content, similarity };
    });

    return similarities.sort((a, b) => b.similarity - a.similarity);
  }

  // ============================================================================
  // COST CALCULATION
  // ============================================================================

  private calculateVisionCost(tokens: number, detail: 'low' | 'high' | 'auto'): number {
    // GPT-4o pricing: $2.50/$10 per 1M tokens
    const baseCost = (tokens / 1000000) * 2.50;

    // Vision has additional image processing cost
    const imageCost = detail === 'high' ? 0.00765 : 0.00255;

    return baseCost + imageCost;
  }

  private calculateDalleCost(size: string, quality: string): number {
    // DALL-E 3 pricing
    const pricing: Record<string, Record<string, number>> = {
      '1024x1024': { standard: 0.040, hd: 0.080 },
      '1792x1024': { standard: 0.080, hd: 0.120 },
      '1024x1792': { standard: 0.080, hd: 0.120 }
    };

    return pricing[size]?.[quality] || 0.040;
  }

  private calculateWhisperCost(fileSize: number): number {
    // Whisper pricing: $0.006 per minute
    // Estimate: ~1MB = 1 minute of audio
    const estimatedMinutes = fileSize / (1024 * 1024);
    return estimatedMinutes * 0.006;
  }

  private calculateTTSCost(textLength: number, model: string): number {
    // TTS pricing: $15/$30 per 1M characters
    const pricePerChar = model === 'tts-1' ? 15 / 1000000 : 30 / 1000000;
    return textLength * pricePerChar;
  }

  private calculateEmbeddingsCost(tokens: number, model: string): number {
    const pricing: Record<string, number> = {
      'text-embedding-3-small': 0.02 / 1000000,
      'text-embedding-3-large': 0.13 / 1000000,
      'text-embedding-ada-002': 0.10 / 1000000
    };

    return tokens * (pricing[model] || pricing['text-embedding-3-small']);
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  getStats(): {
    vision: { calls: number; cost: number };
    dalle: { calls: number; cost: number };
    whisper: { calls: number; cost: number };
    tts: { calls: number; cost: number };
    embeddings: { calls: number; cost: number };
    assistants: { calls: number; cost: number };
    totalCost: number;
  } {
    const stats = JSON.parse(localStorage.getItem('openai_extended_stats') || '{}');

    return {
      vision: stats.vision || { calls: 0, cost: 0 },
      dalle: stats.dalle || { calls: 0, cost: 0 },
      whisper: stats.whisper || { calls: 0, cost: 0 },
      tts: stats.tts || { calls: 0, cost: 0 },
      embeddings: stats.embeddings || { calls: 0, cost: 0 },
      assistants: stats.assistants || { calls: 0, cost: 0 },
      totalCost: Object.values(stats).reduce((sum: number, s: any) => sum + (s.cost || 0), 0)
    };
  }
}

export const openAIExtended = new OpenAIExtendedService();
