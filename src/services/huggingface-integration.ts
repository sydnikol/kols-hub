/**
 * Hugging Face Integration Service
 *
 * AI/ML model hub and inference platform
 *
 * Features:
 * - Model discovery and search
 * - Inference API (text, vision, audio, multimodal)
 * - Model hosting and deployment
 * - Dataset management
 * - Spaces (ML app hosting)
 * - Transformers library integration
 * - Model training and fine-tuning
 * - AutoTrain
 * - Inference Endpoints (dedicated)
 * - Hub API (model/dataset/space management)
 * - Organization and team management
 * - Model cards and documentation
 * - Version control for models
 * - Private model hosting
 *
 * Docs: https://huggingface.co/docs
 * API: https://huggingface.co/docs/api-inference/
 * Hub API: https://huggingface.co/docs/hub/
 * JS Library: https://huggingface.co/docs/huggingface.js/
 */

interface HuggingFaceConfig {
  apiKey: string;
  apiUrl?: string;
  organization?: string;
}

interface Model {
  id: string;
  modelId: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  disabled: boolean;
  downloads: number;
  likes: number;
  tags: string[];
  pipeline_tag: PipelineTag;
  library_name?: string;
  cardData?: ModelCard;
  siblings?: ModelFile[];
  spaces?: string[];
}

type PipelineTag =
  | 'text-classification' | 'token-classification' | 'question-answering'
  | 'translation' | 'summarization' | 'text-generation' | 'fill-mask'
  | 'image-classification' | 'object-detection' | 'image-segmentation'
  | 'image-to-text' | 'text-to-image' | 'text-to-video' | 'image-to-image'
  | 'audio-classification' | 'automatic-speech-recognition' | 'text-to-speech'
  | 'audio-to-audio' | 'voice-activity-detection' | 'zero-shot-classification'
  | 'conversational' | 'feature-extraction' | 'sentence-similarity'
  | 'visual-question-answering' | 'document-question-answering'
  | 'video-classification' | 'depth-estimation' | 'table-question-answering';

interface ModelCard {
  language?: string[];
  license?: string;
  tags?: string[];
  datasets?: string[];
  metrics?: string[];
  modelIndex?: any[];
}

interface ModelFile {
  rfilename: string;
  size?: number;
  blobId?: string;
  lfs?: {
    size: number;
    sha256: string;
    pointer_size: number;
  };
}

interface Dataset {
  id: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  downloads: number;
  likes: number;
  tags: string[];
  cardData?: DatasetCard;
  description?: string;
  citation?: string;
}

interface DatasetCard {
  language?: string[];
  license?: string;
  task_categories?: string[];
  task_ids?: string[];
  size_categories?: string[];
}

interface Space {
  id: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  sdk: 'gradio' | 'streamlit' | 'static' | 'docker';
  likes: number;
  tags: string[];
  cardData?: SpaceCard;
  runtime?: SpaceRuntime;
}

interface SpaceCard {
  title?: string;
  emoji?: string;
  colorFrom?: string;
  colorTo?: string;
  sdk?: string;
  sdk_version?: string;
  app_file?: string;
  pinned?: boolean;
}

interface SpaceRuntime {
  stage: 'RUNNING' | 'STOPPED' | 'BUILDING' | 'BUILD_FAILED' | 'RUNTIME_ERROR';
  hardware: 'cpu-basic' | 'cpu-upgrade' | 'gpu-t4-small' | 'gpu-t4-medium' | 'gpu-a10g-small';
  replicas?: number;
}

interface InferenceRequest {
  inputs: string | string[] | any;
  parameters?: Record<string, any>;
  options?: {
    wait_for_model?: boolean;
    use_cache?: boolean;
  };
}

interface InferenceResult {
  [key: string]: any;
}

interface TextGenerationParams {
  max_new_tokens?: number;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  repetition_penalty?: number;
  do_sample?: boolean;
  return_full_text?: boolean;
  num_return_sequences?: number;
  stop_sequences?: string[];
}

interface TextClassificationResult {
  label: string;
  score: number;
}

interface TokenClassificationResult {
  entity_group?: string;
  entity?: string;
  score: number;
  word: string;
  start: number;
  end: number;
}

interface QuestionAnsweringParams {
  question: string;
  context: string;
}

interface QuestionAnsweringResult {
  answer: string;
  score: number;
  start: number;
  end: number;
}

interface ImageClassificationResult {
  label: string;
  score: number;
}

interface ObjectDetectionResult {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

interface ASRResult {
  text: string;
}

interface InferenceEndpoint {
  id: string;
  name: string;
  namespace: string;
  model: {
    repository: string;
    framework: string;
    task: PipelineTag;
    revision: string;
  };
  compute: {
    accelerator: 'cpu' | 'gpu';
    instanceType: string;
    instanceSize: 'small' | 'medium' | 'large' | 'xlarge';
    scaling: {
      minReplica: number;
      maxReplica: number;
    };
  };
  status: {
    state: 'initializing' | 'pending' | 'running' | 'scaled_to_zero' | 'failed' | 'updating';
    message?: string;
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AutoTrainProject {
  id: string;
  name: string;
  task: 'text_binary_classification' | 'text_multi_class_classification' | 'text_entity_extraction'
    | 'text_summarization' | 'text_question_answering' | 'image_classification' | 'tabular';
  baseModel?: string;
  dataset: string;
  status: 'created' | 'training' | 'completed' | 'failed';
  progress?: number;
  createdAt: string;
  trainedModel?: string;
  metrics?: Record<string, number>;
}

interface Organization {
  name: string;
  fullname: string;
  email?: string;
  avatarUrl?: string;
  isEnterprise: boolean;
  members: OrganizationMember[];
  plan: 'free' | 'pro' | 'enterprise';
}

interface OrganizationMember {
  username: string;
  fullname: string;
  role: 'admin' | 'write' | 'read';
  avatarUrl?: string;
}

interface UserInfo {
  username: string;
  fullname: string;
  email?: string;
  avatarUrl?: string;
  orgs: string[];
  isPro: boolean;
  periodEnd?: string;
}

class HuggingFaceIntegrationService {
  private apiKey?: string;
  private apiUrl: string = 'https://api-inference.huggingface.co/models';
  private hubApiUrl: string = 'https://huggingface.co/api';
  private organization?: string;

  initialize(config: HuggingFaceConfig): boolean {
    try {
      this.apiKey = config.apiKey;
      this.apiUrl = config.apiUrl || 'https://api-inference.huggingface.co/models';
      this.organization = config.organization;

      localStorage.setItem('huggingface_config', JSON.stringify({
        apiUrl: this.apiUrl,
        organization: this.organization
      }));

      console.log('Hugging Face integration initialized');
      console.log('API URL:', this.apiUrl);
      console.log('Organization:', this.organization || 'Personal');

      return true;
    } catch (error) {
      console.error('Error initializing Hugging Face integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== Model Discovery ====================

  async searchModels(params?: {
    search?: string;
    author?: string;
    filter?: PipelineTag;
    sort?: 'downloads' | 'likes' | 'trending';
    direction?: 'asc' | 'desc';
    limit?: number;
  }): Promise<Model[]> {
    console.log('Searching models');
    if (params?.search) console.log('Query:', params.search);
    if (params?.filter) console.log('Filter:', params.filter);

    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.author) queryParams.set('author', params.author);
      if (params?.filter) queryParams.set('filter', params.filter);
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.direction) queryParams.set('direction', params.direction);
      if (params?.limit) queryParams.set('limit', params.limit.toString());

      const response = await fetch(`${this.hubApiUrl}/models?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to search models');
      }

      const models = await response.json();
      console.log('Models found:', models.length);

      return models;
    } catch (error) {
      console.error('Error searching models:', error);
      return [];
    }
  }

  async getModel(modelId: string): Promise<Model | null> {
    console.log('Fetching model:', modelId);

    try {
      const response = await fetch(`${this.hubApiUrl}/models/${modelId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Model not found');
      }

      const model = await response.json();
      console.log('Model retrieved');
      console.log('Downloads:', model.downloads);
      console.log('Likes:', model.likes);
      console.log('Pipeline:', model.pipeline_tag);

      return model;
    } catch (error) {
      console.error('Error fetching model:', error);
      return null;
    }
  }

  // ==================== Inference API ====================

  async inference(modelId: string, request: InferenceRequest): Promise<InferenceResult> {
    console.log('Running inference');
    console.log('Model:', modelId);

    try {
      const response = await fetch(`${this.apiUrl}/${modelId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Inference failed');
      }

      const result = await response.json();
      console.log('Inference completed');

      return result;
    } catch (error) {
      console.error('Error running inference:', error);
      throw error;
    }
  }

  // ==================== Text Tasks ====================

  async textGeneration(
    modelId: string,
    inputs: string,
    params?: TextGenerationParams
  ): Promise<{ generated_text: string }[]> {
    console.log('Generating text');
    console.log('Model:', modelId);
    console.log('Input length:', inputs.length);

    const result = await this.inference(modelId, {
      inputs,
      parameters: params
    });

    console.log('Text generated');
    return Array.isArray(result) ? result : [result];
  }

  async textClassification(
    modelId: string,
    inputs: string
  ): Promise<TextClassificationResult[]> {
    console.log('Classifying text');
    console.log('Model:', modelId);

    const result = await this.inference(modelId, { inputs });

    console.log('Classification complete');
    console.log('Results:', Array.isArray(result[0]) ? result[0].length : 1);

    return Array.isArray(result[0]) ? result[0] : result;
  }

  async tokenClassification(
    modelId: string,
    inputs: string
  ): Promise<TokenClassificationResult[]> {
    console.log('Token classification (NER)');
    console.log('Model:', modelId);

    const result = await this.inference(modelId, { inputs });

    console.log('Entities found:', result.length);
    return result;
  }

  async questionAnswering(
    modelId: string,
    params: QuestionAnsweringParams
  ): Promise<QuestionAnsweringResult> {
    console.log('Question answering');
    console.log('Model:', modelId);
    console.log('Question:', params.question);

    const result = await this.inference(modelId, { inputs: params });

    console.log('Answer:', result.answer);
    console.log('Score:', result.score.toFixed(3));

    return result;
  }

  async summarization(
    modelId: string,
    inputs: string,
    params?: {
      max_length?: number;
      min_length?: number;
    }
  ): Promise<{ summary_text: string }> {
    console.log('Summarizing text');
    console.log('Model:', modelId);
    console.log('Input length:', inputs.length);

    const result = await this.inference(modelId, {
      inputs,
      parameters: params
    });

    console.log('Summary generated');
    return Array.isArray(result) ? result[0] : result;
  }

  async translation(
    modelId: string,
    inputs: string
  ): Promise<{ translation_text: string }> {
    console.log('Translating text');
    console.log('Model:', modelId);

    const result = await this.inference(modelId, { inputs });

    console.log('Translation complete');
    return Array.isArray(result) ? result[0] : result;
  }

  async fillMask(
    modelId: string,
    inputs: string
  ): Promise<Array<{ score: number; token: number; token_str: string; sequence: string }>> {
    console.log('Fill mask task');
    console.log('Model:', modelId);
    console.log('Input:', inputs);

    const result = await this.inference(modelId, { inputs });

    console.log('Predictions:', result.length);
    return result;
  }

  // ==================== Vision Tasks ====================

  async documentOCR(
    modelId: string = 'deepseek-ai/DeepSeek-OCR',
    image: Blob | ArrayBuffer
  ): Promise<{ text: string; confidence?: number }> {
    console.log('Running OCR on document');
    console.log('Model:', modelId);

    const response = await fetch(`${this.apiUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: image
    });

    if (!response.ok) {
      throw new Error('OCR failed');
    }

    const result = await response.json();
    console.log('OCR complete');
    console.log('Text extracted:', result.text?.length || 0, 'characters');

    return result;
  }

  async imageClassification(
    modelId: string,
    image: Blob | ArrayBuffer
  ): Promise<ImageClassificationResult[]> {
    console.log('Classifying image');
    console.log('Model:', modelId);

    const response = await fetch(`${this.apiUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: image
    });

    if (!response.ok) {
      throw new Error('Image classification failed');
    }

    const result = await response.json();
    console.log('Classification complete');
    console.log('Top result:', result[0]?.label, result[0]?.score.toFixed(3));

    return result;
  }

  async objectDetection(
    modelId: string,
    image: Blob | ArrayBuffer
  ): Promise<ObjectDetectionResult[]> {
    console.log('Detecting objects');
    console.log('Model:', modelId);

    const response = await fetch(`${this.apiUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: image
    });

    if (!response.ok) {
      throw new Error('Object detection failed');
    }

    const result = await response.json();
    console.log('Objects detected:', result.length);

    return result;
  }

  async imageToText(
    modelId: string,
    image: Blob | ArrayBuffer
  ): Promise<{ generated_text: string }> {
    console.log('Image to text');
    console.log('Model:', modelId);

    const response = await fetch(`${this.apiUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: image
    });

    if (!response.ok) {
      throw new Error('Image to text failed');
    }

    const result = await response.json();
    console.log('Caption generated');

    return Array.isArray(result) ? result[0] : result;
  }

  async textToImage(
    modelId: string,
    inputs: string,
    params?: {
      negative_prompt?: string;
      num_inference_steps?: number;
      guidance_scale?: number;
      width?: number;
      height?: number;
    }
  ): Promise<Blob> {
    console.log('Generating image from text');
    console.log('Model:', modelId);
    console.log('Prompt:', inputs);

    const response = await fetch(`${this.apiUrl}/${modelId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        inputs,
        parameters: params
      })
    });

    if (!response.ok) {
      throw new Error('Text to image failed');
    }

    const imageBlob = await response.blob();
    console.log('Image generated');
    console.log('Size:', (imageBlob.size / 1024).toFixed(2), 'KB');

    return imageBlob;
  }

  // ==================== Audio Tasks ====================

  async automaticSpeechRecognition(
    modelId: string,
    audio: Blob | ArrayBuffer
  ): Promise<ASRResult> {
    console.log('Transcribing audio');
    console.log('Model:', modelId);

    const response = await fetch(`${this.apiUrl}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: audio
    });

    if (!response.ok) {
      throw new Error('ASR failed');
    }

    const result = await response.json();
    console.log('Transcription complete');
    console.log('Text:', result.text);

    return result;
  }

  async textToSpeech(
    modelId: string,
    inputs: string
  ): Promise<Blob> {
    console.log('Generating speech');
    console.log('Model:', modelId);
    console.log('Text:', inputs);

    const response = await fetch(`${this.apiUrl}/${modelId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ inputs })
    });

    if (!response.ok) {
      throw new Error('TTS failed');
    }

    const audioBlob = await response.blob();
    console.log('Audio generated');

    return audioBlob;
  }

  // ==================== Datasets ====================

  async searchDatasets(params?: {
    search?: string;
    author?: string;
    filter?: string;
    limit?: number;
  }): Promise<Dataset[]> {
    console.log('Searching datasets');
    if (params?.search) console.log('Query:', params.search);

    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.author) queryParams.set('author', params.author);
      if (params?.filter) queryParams.set('filter', params.filter);
      if (params?.limit) queryParams.set('limit', params.limit.toString());

      const response = await fetch(`${this.hubApiUrl}/datasets?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to search datasets');
      }

      const datasets = await response.json();
      console.log('Datasets found:', datasets.length);

      return datasets;
    } catch (error) {
      console.error('Error searching datasets:', error);
      return [];
    }
  }

  async getDataset(datasetId: string): Promise<Dataset | null> {
    console.log('Fetching dataset:', datasetId);

    try {
      const response = await fetch(`${this.hubApiUrl}/datasets/${datasetId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Dataset not found');
      }

      const dataset = await response.json();
      console.log('Dataset retrieved');

      return dataset;
    } catch (error) {
      console.error('Error fetching dataset:', error);
      return null;
    }
  }

  // ==================== Spaces ====================

  async searchSpaces(params?: {
    search?: string;
    author?: string;
    sdk?: Space['sdk'];
    limit?: number;
  }): Promise<Space[]> {
    console.log('Searching spaces');
    if (params?.search) console.log('Query:', params.search);

    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.author) queryParams.set('author', params.author);
      if (params?.sdk) queryParams.set('sdk', params.sdk);
      if (params?.limit) queryParams.set('limit', params.limit.toString());

      const response = await fetch(`${this.hubApiUrl}/spaces?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to search spaces');
      }

      const spaces = await response.json();
      console.log('Spaces found:', spaces.length);

      return spaces;
    } catch (error) {
      console.error('Error searching spaces:', error);
      return [];
    }
  }

  async getSpace(spaceId: string): Promise<Space | null> {
    console.log('Fetching space:', spaceId);

    try {
      const response = await fetch(`${this.hubApiUrl}/spaces/${spaceId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Space not found');
      }

      const space = await response.json();
      console.log('Space retrieved');
      console.log('SDK:', space.sdk);
      console.log('Runtime status:', space.runtime?.stage);

      return space;
    } catch (error) {
      console.error('Error fetching space:', error);
      return null;
    }
  }

  // ==================== Inference Endpoints ====================

  async createInferenceEndpoint(params: {
    name: string;
    model: string;
    instanceType: string;
    instanceSize: InferenceEndpoint['compute']['instanceSize'];
    minReplica?: number;
    maxReplica?: number;
  }): Promise<InferenceEndpoint | null> {
    console.log('Creating inference endpoint');
    console.log('Name:', params.name);
    console.log('Model:', params.model);
    console.log('Instance:', params.instanceType, params.instanceSize);

    try {
      const namespace = this.organization || 'personal';

      const response = await fetch(`${this.hubApiUrl}/inference-endpoints`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          name: params.name,
          namespace,
          model: {
            repository: params.model,
            framework: 'pytorch',
            task: 'text-generation'
          },
          compute: {
            accelerator: 'gpu',
            instanceType: params.instanceType,
            instanceSize: params.instanceSize,
            scaling: {
              minReplica: params.minReplica || 1,
              maxReplica: params.maxReplica || 1
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create endpoint');
      }

      const endpoint = await response.json();
      console.log('Endpoint created:', endpoint.id);
      console.log('Status:', endpoint.status.state);

      return endpoint;
    } catch (error) {
      console.error('Error creating endpoint:', error);
      return null;
    }
  }

  async listInferenceEndpoints(): Promise<InferenceEndpoint[]> {
    console.log('Listing inference endpoints');

    try {
      const namespace = this.organization || 'personal';

      const response = await fetch(`${this.hubApiUrl}/inference-endpoints?namespace=${namespace}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to list endpoints');
      }

      const endpoints = await response.json();
      console.log('Endpoints found:', endpoints.length);

      return endpoints;
    } catch (error) {
      console.error('Error listing endpoints:', error);
      return [];
    }
  }

  async deleteInferenceEndpoint(endpointId: string): Promise<boolean> {
    console.log('Deleting inference endpoint:', endpointId);

    try {
      const response = await fetch(`${this.hubApiUrl}/inference-endpoints/${endpointId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const success = response.ok;
      if (success) {
        console.log('Endpoint deleted');
      }

      return success;
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      return false;
    }
  }

  // ==================== User & Organization ====================

  async getUserInfo(): Promise<UserInfo | null> {
    console.log('Fetching user info');

    try {
      const response = await fetch(`${this.hubApiUrl}/whoami`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const user = await response.json();
      console.log('User:', user.username);
      console.log('Pro:', user.isPro);

      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  async getOrganization(orgName: string): Promise<Organization | null> {
    console.log('Fetching organization:', orgName);

    try {
      const response = await fetch(`${this.hubApiUrl}/organizations/${orgName}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Organization not found');
      }

      const org = await response.json();
      console.log('Organization retrieved');
      console.log('Members:', org.members?.length || 0);

      return org;
    } catch (error) {
      console.error('Error fetching organization:', error);
      return null;
    }
  }

  // ==================== Helper Methods ====================

  getModelUrl(modelId: string): string {
    return `https://huggingface.co/${modelId}`;
  }

  getDatasetUrl(datasetId: string): string {
    return `https://huggingface.co/datasets/${datasetId}`;
  }

  getSpaceUrl(spaceId: string): string {
    return `https://huggingface.co/spaces/${spaceId}`;
  }

  async downloadModel(modelId: string, filename: string): Promise<Blob | null> {
    console.log('Downloading model file');
    console.log('Model:', modelId);
    console.log('File:', filename);

    try {
      const response = await fetch(
        `https://huggingface.co/${modelId}/resolve/main/${filename}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      console.log('File downloaded:', (blob.size / 1024 / 1024).toFixed(2), 'MB');

      return blob;
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }
}

export const huggingfaceIntegration = new HuggingFaceIntegrationService();
