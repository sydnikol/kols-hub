/**
 * OpenAI-Compatible API Integration Service
 *
 * Works with OpenAI API and compatible local servers (vLLM, text-generation-inference, LocalAI, etc.)
 *
 * Features:
 * - Chat completions (streaming & non-streaming)
 * - Text completions
 * - Embeddings generation
 * - Image generation (DALL-E)
 * - Vision (GPT-4 Vision)
 * - Function calling
 * - Token counting
 * - Multi-model support
 * - Local server support
 * - Custom model endpoints
 *
 * Compatible with:
 * - OpenAI API (api.openai.com)
 * - Azure OpenAI
 * - Local vLLM servers
 * - text-generation-inference
 * - LocalAI
 * - Any OpenAI-compatible endpoint
 *
 * Example: http://localhost:8000/v1/chat/completions
 */

interface OpenAIConfig {
  apiKey?: string;
  baseURL?: string; // Default: https://api.openai.com/v1
  organization?: string;
  defaultModel?: string;
  timeout?: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string | null;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
  tool_calls?: ToolCall[];
}

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
  functions?: FunctionDefinition[];
  function_call?: 'none' | 'auto' | { name: string };
  tools?: Tool[];
  tool_choice?: 'none' | 'auto' | { type: 'function'; function: { name: string } };
  response_format?: { type: 'text' | 'json_object' };
  seed?: number;
}

interface FunctionDefinition {
  name: string;
  description?: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

interface Tool {
  type: 'function';
  function: FunctionDefinition;
}

interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint?: string;
}

interface ChatChoice {
  index: number;
  message: ChatMessage;
  finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter';
  logprobs?: any;
}

interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: {
    index: number;
    delta: Partial<ChatMessage>;
    finish_reason: ChatChoice['finish_reason'] | null;
  }[];
}

interface CompletionRequest {
  model: string;
  prompt: string | string[];
  suffix?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  logprobs?: number;
  echo?: boolean;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  best_of?: number;
  user?: string;
}

interface CompletionResponse {
  id: string;
  object: 'text_completion';
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: any;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface EmbeddingRequest {
  model: string;
  input: string | string[];
  encoding_format?: 'float' | 'base64';
  dimensions?: number;
  user?: string;
}

interface EmbeddingResponse {
  object: 'list';
  data: {
    object: 'embedding';
    embedding: number[];
    index: number;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

interface ImageGenerationRequest {
  prompt: string;
  model?: string;
  n?: number;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  response_format?: 'url' | 'b64_json';
  style?: 'vivid' | 'natural';
  user?: string;
}

interface ImageGenerationResponse {
  created: number;
  data: {
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }[];
}

interface Model {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
}

interface ModelsResponse {
  object: 'list';
  data: Model[];
}

class OpenAICompatibleIntegrationService {
  private apiKey?: string;
  private baseURL: string = 'https://api.openai.com/v1';
  private organization?: string;
  private defaultModel: string = 'gpt-3.5-turbo';
  private timeout: number = 60000;

  initialize(config: OpenAIConfig): boolean {
    try {
      this.apiKey = config.apiKey;
      this.baseURL = config.baseURL || 'https://api.openai.com/v1';
      this.organization = config.organization;
      this.defaultModel = config.defaultModel || 'gpt-3.5-turbo';
      this.timeout = config.timeout || 60000;

      // Remove trailing slash from baseURL
      this.baseURL = this.baseURL.replace(/\/$/, '');

      localStorage.setItem('openai_config', JSON.stringify({
        baseURL: this.baseURL,
        defaultModel: this.defaultModel,
        organization: this.organization
      }));

      console.log('OpenAI-compatible integration initialized');
      console.log('Base URL:', this.baseURL);
      console.log('Default model:', this.defaultModel);

      return true;
    } catch (error) {
      console.error('Error initializing OpenAI-compatible integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    // API key is optional for local servers
    return !!this.baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    if (this.organization) {
      headers['OpenAI-Organization'] = this.organization;
    }

    return headers;
  }

  // ==================== Chat Completions ====================

  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    console.log('Creating chat completion');
    console.log('Model:', request.model);
    console.log('Messages:', request.messages.length);

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Chat completion failed');
      }

      const completion: ChatCompletionResponse = await response.json();

      console.log('Completion created');
      console.log('Finish reason:', completion.choices[0].finish_reason);
      console.log('Tokens used:', completion.usage.total_tokens);

      return completion;
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw error;
    }
  }

  async *streamChatCompletion(
    request: ChatCompletionRequest
  ): AsyncGenerator<ChatCompletionChunk, void, unknown> {
    console.log('Starting streaming chat completion');
    console.log('Model:', request.model);

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ...request, stream: true })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Streaming failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const chunk: ChatCompletionChunk = JSON.parse(trimmed.slice(6));
              yield chunk;
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      console.log('Streaming completed');
    } catch (error) {
      console.error('Error streaming chat completion:', error);
      throw error;
    }
  }

  // ==================== Completions ====================

  async createCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    console.log('Creating completion');
    console.log('Model:', request.model);

    try {
      const response = await fetch(`${this.baseURL}/completions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Completion failed');
      }

      const completion: CompletionResponse = await response.json();

      console.log('Completion created');
      console.log('Text length:', completion.choices[0].text.length);

      return completion;
    } catch (error) {
      console.error('Error creating completion:', error);
      throw error;
    }
  }

  // ==================== Embeddings ====================

  async createEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    console.log('Creating embeddings');
    console.log('Model:', request.model);
    console.log('Input:', Array.isArray(request.input) ? request.input.length + ' texts' : '1 text');

    try {
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Embedding failed');
      }

      const embeddings: EmbeddingResponse = await response.json();

      console.log('Embeddings created');
      console.log('Dimension:', embeddings.data[0].embedding.length);
      console.log('Count:', embeddings.data.length);

      return embeddings;
    } catch (error) {
      console.error('Error creating embeddings:', error);
      throw error;
    }
  }

  // ==================== Images ====================

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    console.log('Generating image');
    console.log('Prompt:', request.prompt);
    console.log('Size:', request.size);

    try {
      const response = await fetch(`${this.baseURL}/images/generations`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Image generation failed');
      }

      const images: ImageGenerationResponse = await response.json();

      console.log('Image generated');
      console.log('Count:', images.data.length);

      return images;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  // ==================== Models ====================

  async listModels(): Promise<ModelsResponse> {
    console.log('Listing available models');

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to list models');
      }

      const models: ModelsResponse = await response.json();

      console.log('Models retrieved:', models.data.length);
      models.data.forEach(model => {
        console.log('  -', model.id);
      });

      return models;
    } catch (error) {
      console.error('Error listing models:', error);
      throw error;
    }
  }

  async getModel(modelId: string): Promise<Model> {
    console.log('Getting model info:', modelId);

    try {
      const response = await fetch(`${this.baseURL}/models/${modelId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Model not found');
      }

      const model: Model = await response.json();

      console.log('Model retrieved');
      console.log('Owner:', model.owned_by);

      return model;
    } catch (error) {
      console.error('Error getting model:', error);
      throw error;
    }
  }

  // ==================== Helper Methods ====================

  async chat(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<string> {
    const request: ChatCompletionRequest = {
      model: options?.model || this.defaultModel,
      messages,
      temperature: options?.temperature,
      max_tokens: options?.maxTokens
    };

    const completion = await this.createChatCompletion(request);
    return completion.choices[0].message.content || '';
  }

  async simpleChat(userMessage: string, systemPrompt?: string): Promise<string> {
    const messages: ChatMessage[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: userMessage });

    return this.chat(messages);
  }

  async chatWithHistory(
    conversationHistory: ChatMessage[],
    newMessage: string
  ): Promise<{ response: string; updatedHistory: ChatMessage[] }> {
    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: newMessage }
    ];

    const response = await this.chat(messages);

    const updatedHistory = [
      ...messages,
      { role: 'assistant' as const, content: response }
    ];

    return { response, updatedHistory };
  }

  async functionCall(
    messages: ChatMessage[],
    functions: FunctionDefinition[],
    options?: {
      model?: string;
      function_call?: ChatCompletionRequest['function_call'];
    }
  ): Promise<ChatCompletionResponse> {
    console.log('Making function call');
    console.log('Available functions:', functions.map(f => f.name).join(', '));

    const request: ChatCompletionRequest = {
      model: options?.model || this.defaultModel,
      messages,
      functions,
      function_call: options?.function_call
    };

    const completion = await this.createChatCompletion(request);

    if (completion.choices[0].message.function_call) {
      console.log('Function called:', completion.choices[0].message.function_call.name);
    }

    return completion;
  }

  async embed(text: string | string[], model: string = 'text-embedding-ada-002'): Promise<number[][]> {
    const request: EmbeddingRequest = {
      model,
      input: text
    };

    const response = await this.createEmbedding(request);
    return response.data.map(d => d.embedding);
  }

  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  // ==================== Local Server Helpers ====================

  static createLocalConfig(port: number = 8000, model: string = 'sydnikol/kol'): OpenAIConfig {
    return {
      baseURL: `http://localhost:${port}/v1`,
      defaultModel: model
    };
  }

  static createVLLMConfig(host: string = 'localhost', port: number = 8000): OpenAIConfig {
    return {
      baseURL: `http://${host}:${port}/v1`
    };
  }

  async testConnection(): Promise<boolean> {
    console.log('Testing connection to:', this.baseURL);

    try {
      const models = await this.listModels();
      console.log('✅ Connection successful');
      console.log('Available models:', models.data.length);
      return true;
    } catch (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
  }
}

export const openaiCompatibleIntegration = new OpenAICompatibleIntegrationService();

// ==================== Usage Examples ====================

/*
// Example 1: Using with local vLLM server (like your curl example)
const localConfig = OpenAICompatibleIntegrationService.createLocalConfig(8000, 'sydnikol/kol');
openaiCompatibleIntegration.initialize(localConfig);

// Simple chat
const response = await openaiCompatibleIntegration.simpleChat(
  'What is the capital of France?'
);

// Example 2: Using with OpenAI API
openaiCompatibleIntegration.initialize({
  apiKey: 'sk-...',
  baseURL: 'https://api.openai.com/v1',
  defaultModel: 'gpt-4'
});

// Example 3: Streaming chat
const stream = openaiCompatibleIntegration.streamChatCompletion({
  model: 'sydnikol/kol',
  messages: [{ role: 'user', content: 'Tell me a story' }]
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}

// Example 4: Function calling
const functions: FunctionDefinition[] = [{
  name: 'get_weather',
  description: 'Get weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' },
      unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
    },
    required: ['location']
  }
}];

const result = await openaiCompatibleIntegration.functionCall(
  [{ role: 'user', content: 'What\'s the weather in Paris?' }],
  functions
);

// Example 5: Embeddings
const embeddings = await openaiCompatibleIntegration.embed([
  'Hello world',
  'Goodbye world'
]);
*/
