/**
 * AI Creative Tools Integration Service
 * Integrates multiple AI-powered creative and productivity tools
 *
 * Supported Services:
 * - Synthesia (AI Video Generation)
 * - Deevid AI (AI Avatars)
 * - Soundraw (AI Music Generation)
 * - Fliki (AI Video Creation)
 * - LightPDF (PDF AI Tools)
 * - Midjourney (AI Image Generation)
 * - Remini (AI Photo Enhancement)
 * - Sider AI (AI Assistant)
 * - Pictory (AI Video Editing)
 * - Wordtune (AI Writing)
 * - Copy.ai (AI Content Generation)
 */

export interface AICreativeService {
  id: string;
  name: string;
  description: string;
  category: 'video' | 'image' | 'audio' | 'text' | 'pdf' | 'assistant';
  website: string;
  features: string[];
  pricing: 'free' | 'freemium' | 'paid';
  apiAvailable: boolean;
}

export interface AIGenerationRequest {
  serviceId: string;
  prompt: string;
  options?: Record<string, any>;
}

export interface AIGenerationResult {
  success: boolean;
  serviceId: string;
  result?: any;
  error?: string;
  url?: string;
}

// AI Creative Tools Configuration
export const AI_CREATIVE_SERVICES: AICreativeService[] = [
  {
    id: 'synthesia',
    name: 'Synthesia',
    description: 'AI-powered video generation with realistic avatars. Create professional videos from text in minutes.',
    category: 'video',
    website: 'https://www.synthesia.io/',
    features: [
      'AI Avatar Video Creation',
      'Text-to-Video Generation',
      '140+ Languages Support',
      'Custom Avatar Creation',
      'Template Library',
      'Brand Kit Integration',
      'Video Translation'
    ],
    pricing: 'paid',
    apiAvailable: true
  },
  {
    id: 'deevid',
    name: 'Deevid AI',
    description: 'Create stunning AI avatars and digital humans for videos and presentations.',
    category: 'video',
    website: 'https://deevid.ai/',
    features: [
      'AI Avatar Generation',
      'Digital Human Creation',
      'Voice Synthesis',
      'Multi-language Support',
      'Custom Styling',
      'Real-time Rendering'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'soundraw',
    name: 'Soundraw',
    description: 'AI music generator for creating royalty-free music for content creators.',
    category: 'audio',
    website: 'https://soundraw.io/',
    features: [
      'AI Music Generation',
      'Royalty-Free Tracks',
      'Customizable Length',
      'Multiple Genres',
      'Mood Selection',
      'Tempo Control',
      'Instrument Customization'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'fliki',
    name: 'Fliki',
    description: 'Turn text into videos with AI voices. Create engaging video content quickly.',
    category: 'video',
    website: 'https://fliki.ai/',
    features: [
      'Text-to-Video',
      'AI Voice Over',
      '900+ Voices',
      '75+ Languages',
      'Stock Media Library',
      'Brand Kit',
      'Subtitles Generation'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'lightpdf',
    name: 'LightPDF',
    description: 'AI-powered PDF tools for editing, converting, and analyzing documents.',
    category: 'pdf',
    website: 'https://lightpdf.com/',
    features: [
      'AI PDF Analysis',
      'PDF to Word Conversion',
      'OCR Technology',
      'PDF Editing',
      'Document Signing',
      'PDF Compression',
      'Batch Processing'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI image generation tool creating stunning artwork from text descriptions.',
    category: 'image',
    website: 'https://www.midjourney.com/',
    features: [
      'Text-to-Image Generation',
      'Style Customization',
      'High Resolution Output',
      'Image Variations',
      'Upscaling',
      'Artistic Styles',
      'Community Gallery'
    ],
    pricing: 'paid',
    apiAvailable: false // Discord-based
  },
  {
    id: 'remini',
    name: 'Remini',
    description: 'AI photo enhancer that transforms low-quality images into HD clarity.',
    category: 'image',
    website: 'https://remini.ai/',
    features: [
      'Photo Enhancement',
      'Face Enhancement',
      'Old Photo Restoration',
      'Image Upscaling',
      'Color Correction',
      'Blur Removal',
      'Video Enhancement'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'sider',
    name: 'Sider AI',
    description: 'AI browser assistant for writing, reading, and chatting with AI anywhere.',
    category: 'assistant',
    website: 'https://sider.ai/',
    features: [
      'Browser Extension',
      'AI Chat Assistant',
      'Writing Assistant',
      'Reading Summarization',
      'Translation',
      'Multiple AI Models',
      'Context-aware Help'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'pictory',
    name: 'Pictory',
    description: 'AI video creation tool that turns long-form content into short, shareable videos.',
    category: 'video',
    website: 'https://pictory.ai/',
    features: [
      'Script to Video',
      'Blog to Video',
      'Auto Captions',
      'Video Summarization',
      'Text-based Editing',
      'Stock Media',
      'Brand Customization'
    ],
    pricing: 'paid',
    apiAvailable: true
  },
  {
    id: 'wordtune',
    name: 'Wordtune',
    description: 'AI writing companion that helps rewrite, rephrase, and perfect your writing.',
    category: 'text',
    website: 'https://www.wordtune.com/',
    features: [
      'Text Rewriting',
      'Tone Adjustment',
      'Sentence Expansion',
      'Sentence Shortening',
      'Grammar Correction',
      'Style Suggestions',
      'Multiple Languages'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'copyai',
    name: 'Copy.ai',
    description: 'AI content generator for marketing copy, blog posts, and creative writing.',
    category: 'text',
    website: 'https://www.copy.ai/',
    features: [
      'Marketing Copy Generation',
      'Blog Post Writing',
      'Social Media Content',
      'Email Writing',
      'Product Descriptions',
      'Ad Copy',
      'Brand Voice Training'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'artrage',
    name: 'ArtRage',
    description: 'Professional digital painting software with realistic brush simulation and natural media tools.',
    category: 'image',
    website: 'https://www.artrage.com/',
    features: [
      'Realistic Oil Painting',
      'Watercolor Simulation',
      'Natural Media Tools',
      'Canvas Texture Effects',
      'Layer System',
      'Color Blending',
      'Reference Image Support',
      'Stencils and Rulers',
      'Custom Brushes'
    ],
    pricing: 'paid',
    apiAvailable: false
  },
  {
    id: 'replit',
    name: 'Replit',
    description: 'AI-powered collaborative coding platform for building and deploying apps in the browser.',
    category: 'assistant',
    website: 'https://replit.com/',
    features: [
      'AI Code Generation',
      'Collaborative Coding',
      'Browser-based IDE',
      'Instant Deployment',
      'Multi-language Support',
      'Database Integration',
      'Version Control',
      'Real-time Collaboration'
    ],
    pricing: 'freemium',
    apiAvailable: true
  },
  {
    id: 'ibispaint',
    name: 'ibis Paint X',
    description: 'Feature-rich digital painting app with over 15,000 brushes, layers, and professional drawing tools.',
    category: 'image',
    website: 'https://ibispaint.com/',
    features: [
      '15,000+ Brushes',
      'Layer System',
      'Stabilizer Feature',
      'Recording & Playback',
      'Blend Modes',
      'Clipping Masks',
      'Canvas Textures',
      'Filter Effects',
      'Cloud Storage',
      'Social Sharing'
    ],
    pricing: 'freemium',
    apiAvailable: false
  },
  {
    id: 'krita',
    name: 'Krita',
    description: 'Free and open-source professional digital painting program designed for concept artists, illustrators, and VFX artists.',
    category: 'image',
    website: 'https://krita.org/',
    features: [
      'Professional Brush Engine',
      'Layer Management',
      'Vector Tools',
      'Animation Support',
      'HDR Painting',
      'Python Scripting',
      'PSD Support',
      'Resource Manager',
      'Customizable Interface',
      'Open Source',
      'Full Documentation at docs.krita.org'
    ],
    pricing: 'free',
    apiAvailable: false
  },
  {
    id: 'blackink',
    name: 'Black Ink',
    description: 'GPU-powered digital painting software with unique procedural brush system for creating stunning artwork.',
    category: 'image',
    website: 'https://blackink.bleank.com/',
    features: [
      'Procedural Brush System',
      'GPU Acceleration',
      'Real-time Brush Preview',
      'Controller Language',
      'Infinite Canvas',
      'High-Performance Rendering',
      'Custom Brush Creation',
      'Pressure Sensitivity',
      'Layer Support',
      'Export Options'
    ],
    pricing: 'paid',
    apiAvailable: false
  },
  {
    id: 'clipstudio',
    name: 'Clip Studio Paint',
    description: 'Professional digital art software for illustration, manga, comics, and animation. Industry standard for digital artists.',
    category: 'image',
    website: 'https://www.clipstudio.net/',
    features: [
      'Professional Brush Engine',
      'Vector Layers',
      'Manga & Comic Tools',
      'Panel Layout System',
      'Screentone Library',
      '3D Model Pose Reference',
      'Animation Timeline',
      'Perspective Rulers',
      'Symmetry Tools',
      'Asset Store Access',
      'Timelapse Recording',
      'Multi-page Document Management',
      'Custom Auto Actions',
      'GPU Acceleration',
      'Webtoon Support'
    ],
    pricing: 'paid',
    apiAvailable: false
  },
  {
    id: 'procreate',
    name: 'Procreate',
    description: 'Award-winning illustration app for iPad with powerful features and intuitive interface for digital artists.',
    category: 'image',
    website: 'https://procreate.com/',
    features: [
      'Powerful Brush Engine',
      'Apple Pencil Support',
      'Layer System',
      'Animation Assist',
      'QuickShape',
      'Color Drop',
      'Drawing Guides',
      '3D Painting',
      'Timelapse Export',
      'PSD Import/Export'
    ],
    pricing: 'paid',
    apiAvailable: false
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    description: 'Industry-standard image editing and digital painting software used by professionals worldwide.',
    category: 'image',
    website: 'https://www.adobe.com/products/photoshop.html',
    features: [
      'Advanced Layer System',
      'AI-Powered Selection',
      'Content-Aware Fill',
      'Neural Filters',
      'Custom Brushes',
      'Smart Objects',
      'RAW Processing',
      'Video Editing',
      '3D Capabilities',
      'Plugin Support'
    ],
    pricing: 'paid',
    apiAvailable: true
  },
  {
    id: 'medibang',
    name: 'MediBang Paint',
    description: 'Free digital painting and comic creation program with cloud features and cross-platform support.',
    category: 'image',
    website: 'https://medibangpaint.com/',
    features: [
      'Free to Use',
      'Cloud Storage',
      'Cross-Platform',
      '800+ Tones',
      'Comic Templates',
      'Font Library',
      'Collaboration Tools',
      'Custom Brushes',
      'Panel Layout',
      'Team Management'
    ],
    pricing: 'free',
    apiAvailable: false
  },
  {
    id: 'firealpaca',
    name: 'FireAlpaca',
    description: 'Free digital painting software that is lightweight, fast, and easy to use for beginners.',
    category: 'image',
    website: 'https://firealpaca.com/',
    features: [
      'Lightweight & Fast',
      'Simple Interface',
      'Basic Layer Support',
      'Brush Customization',
      'Perspective Snapping',
      'Comic Templates',
      'Onion Skin Mode',
      'Cross-Platform',
      'Regular Updates'
    ],
    pricing: 'free',
    apiAvailable: false
  },
  {
    id: 'painttoolsai',
    name: 'Paint Tool SAI',
    description: 'Lightweight raster graphics editor and painting software known for smooth linework and fast performance.',
    category: 'image',
    website: 'https://www.systemax.jp/en/sai/',
    features: [
      'Smooth Linework',
      'Stabilizer Feature',
      'Fast Performance',
      'Lightweight',
      'Layer Blending',
      'Brush Customization',
      'Linework Layer',
      'Shape Tools',
      'Canvas Rotation'
    ],
    pricing: 'paid',
    apiAvailable: false
  }
];

// Desktop Application Launch Paths
export interface DesktopAppPaths {
  windows?: string[];
  mac?: string[];
  linux?: string[];
}

export const DESKTOP_APP_PATHS: Record<string, DesktopAppPaths> = {
  clipstudio: {
    windows: [
      'C:\\Program Files\\CELSYS\\CLIP STUDIO 1.5\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe',
      'C:\\Program Files\\CELSYS\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe',
      'C:\\Program Files (x86)\\CELSYS\\CLIP STUDIO 1.5\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe',
    ],
    mac: [
      '/Applications/CLIP STUDIO PAINT.app',
      '/Applications/Clip Studio Paint.app',
    ],
    linux: []
  },
  krita: {
    windows: [
      'C:\\Program Files\\Krita (x64)\\bin\\krita.exe',
      'C:\\Program Files\\Krita\\bin\\krita.exe',
    ],
    mac: [
      '/Applications/krita.app',
      '/Applications/Krita.app',
    ],
    linux: ['/usr/bin/krita']
  },
  photoshop: {
    windows: [
      'C:\\Program Files\\Adobe\\Adobe Photoshop 2024\\Photoshop.exe',
      'C:\\Program Files\\Adobe\\Adobe Photoshop 2023\\Photoshop.exe',
      'C:\\Program Files\\Adobe\\Adobe Photoshop CC 2019\\Photoshop.exe',
    ],
    mac: [
      '/Applications/Adobe Photoshop 2024/Adobe Photoshop 2024.app',
      '/Applications/Adobe Photoshop 2023/Adobe Photoshop 2023.app',
    ],
    linux: []
  },
  ibispaint: {
    windows: [],
    mac: [],
    linux: []
    // Mobile/Web only
  },
  firealpaca: {
    windows: [
      'C:\\Program Files\\FireAlpaca\\FireAlpaca.exe',
      'C:\\Program Files (x86)\\FireAlpaca\\FireAlpaca.exe',
    ],
    mac: ['/Applications/FireAlpaca.app'],
    linux: []
  },
  medibang: {
    windows: [
      'C:\\Program Files\\MediBangPaintPro\\MediBangPaintPro.exe',
      'C:\\Program Files (x86)\\MediBangPaintPro\\MediBangPaintPro.exe',
    ],
    mac: ['/Applications/MediBang Paint Pro.app'],
    linux: []
  },
  painttoolsai: {
    windows: [
      'C:\\PaintToolSAI\\sai.exe',
      'C:\\Program Files\\PaintToolSAI\\sai.exe',
      'C:\\Program Files (x86)\\PaintToolSAI\\sai.exe',
      'C:\\PaintToolSAI2\\sai2.exe',
    ],
    mac: [],
    linux: []
  },
  artrage: {
    windows: [
      'C:\\Program Files\\Ambient Design\\ArtRage 6\\ArtRage.exe',
      'C:\\Program Files (x86)\\Ambient Design\\ArtRage 6\\ArtRage.exe',
      'C:\\Program Files\\Ambient Design\\ArtRage Vitae\\ArtRage.exe',
    ],
    mac: ['/Applications/ArtRage 6.app', '/Applications/ArtRage Vitae.app'],
    linux: []
  },
  blackink: {
    windows: [
      'C:\\Program Files\\Black Ink\\BlackInk.exe',
      'C:\\Program Files (x86)\\Black Ink\\BlackInk.exe',
    ],
    mac: [],
    linux: []
  }
};

class AICreativeToolsService {
  private services: Map<string, AICreativeService>;
  private apiKeys: Map<string, string>;
  private customAppPaths: Map<string, string>;

  constructor() {
    this.services = new Map(AI_CREATIVE_SERVICES.map(s => [s.id, s]));
    this.apiKeys = new Map();
    this.customAppPaths = new Map();
    this.loadApiKeys();
    this.loadCustomPaths();
  }

  private loadCustomPaths(): void {
    try {
      const stored = localStorage.getItem('custom_app_paths');
      if (stored) {
        const paths = JSON.parse(stored);
        Object.entries(paths).forEach(([key, value]) => {
          this.customAppPaths.set(key, value as string);
        });
      }
    } catch (error) {
      console.error('Error loading custom app paths:', error);
    }
  }

  // Set custom path for an application
  setCustomAppPath(appId: string, path: string): void {
    this.customAppPaths.set(appId, path);
    try {
      const stored = JSON.parse(localStorage.getItem('custom_app_paths') || '{}');
      stored[appId] = path;
      localStorage.setItem('custom_app_paths', JSON.stringify(stored));
    } catch (error) {
      console.error('Error storing custom app path:', error);
    }
  }

  // Get custom path for an application
  getCustomAppPath(appId: string): string | undefined {
    return this.customAppPaths.get(appId);
  }

  // Detect current platform
  private getPlatform(): 'windows' | 'mac' | 'linux' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'mac';
    return 'linux';
  }

  // Get app paths for current platform
  getAppPaths(appId: string): string[] {
    const paths = DESKTOP_APP_PATHS[appId];
    if (!paths) return [];

    const platform = this.getPlatform();
    const platformPaths = paths[platform] || [];

    // Add custom path if set
    const customPath = this.customAppPaths.get(appId);
    if (customPath) {
      return [customPath, ...platformPaths];
    }

    return platformPaths;
  }

  // Check if app is likely installed (for web, we can't actually check)
  isDesktopApp(appId: string): boolean {
    return !!DESKTOP_APP_PATHS[appId];
  }

  // Launch desktop application (works in Electron environment)
  async launchApp(appId: string): Promise<{ success: boolean; message: string; url?: string }> {
    const service = this.services.get(appId);
    if (!service) {
      return { success: false, message: 'Unknown application' };
    }

    // Check if running in Electron
    const isElectron = !!(window as any).electron || !!(window as any).process?.type;

    if (isElectron && DESKTOP_APP_PATHS[appId]) {
      const paths = this.getAppPaths(appId);
      if (paths.length > 0) {
        try {
          // In Electron, we can use shell.openPath
          const electron = (window as any).electron;
          if (electron?.shell?.openPath) {
            for (const path of paths) {
              try {
                await electron.shell.openPath(path);
                return { success: true, message: `Launching ${service.name}...` };
              } catch {
                continue;
              }
            }
          }
        } catch (error) {
          console.error('Error launching app:', error);
        }
      }
    }

    // Fallback: open the website
    window.open(service.website, '_blank');
    return {
      success: true,
      message: `Opening ${service.name} website. For desktop launch, please set the custom path or ensure Clip Studio is installed.`,
      url: service.website
    };
  }

  // Launch Clip Studio Paint specifically
  async launchClipStudio(): Promise<{ success: boolean; message: string; url?: string }> {
    return this.launchApp('clipstudio');
  }

  // Get all digital painting/drawing apps
  getDigitalArtApps(): AICreativeService[] {
    return AI_CREATIVE_SERVICES.filter(s =>
      s.category === 'image' &&
      (s.features.some(f =>
        f.toLowerCase().includes('brush') ||
        f.toLowerCase().includes('layer') ||
        f.toLowerCase().includes('painting') ||
        f.toLowerCase().includes('drawing')
      ) || DESKTOP_APP_PATHS[s.id])
    );
  }

  private loadApiKeys(): void {
    // Load API keys from environment or localStorage
    const envKeys = [
      'VITE_SYNTHESIA_API_KEY',
      'VITE_DEEVID_API_KEY',
      'VITE_SOUNDRAW_API_KEY',
      'VITE_FLIKI_API_KEY',
      'VITE_LIGHTPDF_API_KEY',
      'VITE_REMINI_API_KEY',
      'VITE_SIDER_API_KEY',
      'VITE_PICTORY_API_KEY',
      'VITE_WORDTUNE_API_KEY',
      'VITE_COPYAI_API_KEY'
    ];

    envKeys.forEach(key => {
      const value = import.meta.env[key];
      if (value) {
        const serviceId = key.replace('VITE_', '').replace('_API_KEY', '').toLowerCase();
        this.apiKeys.set(serviceId, value);
      }
    });
  }

  // Get all available services
  getAllServices(): AICreativeService[] {
    return AI_CREATIVE_SERVICES;
  }

  // Get services by category
  getServicesByCategory(category: AICreativeService['category']): AICreativeService[] {
    return AI_CREATIVE_SERVICES.filter(s => s.category === category);
  }

  // Get video generation services
  getVideoServices(): AICreativeService[] {
    return this.getServicesByCategory('video');
  }

  // Get image generation services
  getImageServices(): AICreativeService[] {
    return this.getServicesByCategory('image');
  }

  // Get audio/music services
  getAudioServices(): AICreativeService[] {
    return this.getServicesByCategory('audio');
  }

  // Get text/writing services
  getTextServices(): AICreativeService[] {
    return this.getServicesByCategory('text');
  }

  // Get service by ID
  getService(id: string): AICreativeService | undefined {
    return this.services.get(id);
  }

  // Check if service has API key configured
  isServiceConfigured(serviceId: string): boolean {
    return this.apiKeys.has(serviceId);
  }

  // Set API key for a service
  setApiKey(serviceId: string, apiKey: string): void {
    this.apiKeys.set(serviceId, apiKey);
    // Store in localStorage for persistence
    try {
      const stored = JSON.parse(localStorage.getItem('ai_creative_api_keys') || '{}');
      stored[serviceId] = apiKey;
      localStorage.setItem('ai_creative_api_keys', JSON.stringify(stored));
    } catch (error) {
      console.error('Error storing API key:', error);
    }
  }

  // Open service website
  openServiceWebsite(serviceId: string): void {
    const service = this.services.get(serviceId);
    if (service) {
      window.open(service.website, '_blank');
    }
  }

  // Generate content using Synthesia
  async generateSynthesiaVideo(script: string, avatarId?: string): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('synthesia');
    if (!apiKey) {
      return { success: false, serviceId: 'synthesia', error: 'API key not configured' };
    }

    try {
      const response = await fetch('https://api.synthesia.io/v2/videos', {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          test: true,
          input: [{
            scriptText: script,
            avatar: avatarId || 'anna_costume1_cameraA',
            background: 'green_screen'
          }]
        })
      });

      const data = await response.json();
      return { success: true, serviceId: 'synthesia', result: data };
    } catch (error: any) {
      return { success: false, serviceId: 'synthesia', error: error.message };
    }
  }

  // Generate music using Soundraw
  async generateSoundrawMusic(options: {
    mood?: string;
    genre?: string;
    length?: number;
    tempo?: string;
  }): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('soundraw');
    if (!apiKey) {
      return {
        success: false,
        serviceId: 'soundraw',
        error: 'API key not configured',
        url: 'https://soundraw.io/'
      };
    }

    // Soundraw API implementation would go here
    // For now, return a link to the service
    return {
      success: true,
      serviceId: 'soundraw',
      url: 'https://soundraw.io/create'
    };
  }

  // Generate video using Fliki
  async generateFlikiVideo(text: string, options?: {
    voice?: string;
    language?: string;
    format?: string;
  }): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('fliki');
    if (!apiKey) {
      return {
        success: false,
        serviceId: 'fliki',
        error: 'API key not configured',
        url: 'https://fliki.ai/'
      };
    }

    try {
      const response = await fetch('https://api.fliki.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: text,
          ...options
        })
      });

      const data = await response.json();
      return { success: true, serviceId: 'fliki', result: data };
    } catch (error: any) {
      return { success: false, serviceId: 'fliki', error: error.message };
    }
  }

  // Enhance image using Remini
  async enhanceWithRemini(imageUrl: string): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('remini');
    if (!apiKey) {
      return {
        success: false,
        serviceId: 'remini',
        error: 'API key not configured',
        url: 'https://remini.ai/'
      };
    }

    try {
      const response = await fetch('https://api.remini.ai/v1/enhance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_url: imageUrl })
      });

      const data = await response.json();
      return { success: true, serviceId: 'remini', result: data };
    } catch (error: any) {
      return { success: false, serviceId: 'remini', error: error.message };
    }
  }

  // Rewrite text using Wordtune
  async rewriteWithWordtune(text: string, tone?: 'casual' | 'formal' | 'shorter' | 'longer'): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('wordtune');
    if (!apiKey) {
      return {
        success: false,
        serviceId: 'wordtune',
        error: 'API key not configured',
        url: 'https://www.wordtune.com/'
      };
    }

    try {
      const response = await fetch('https://api.wordtune.com/v1/rewrite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, tone })
      });

      const data = await response.json();
      return { success: true, serviceId: 'wordtune', result: data };
    } catch (error: any) {
      return { success: false, serviceId: 'wordtune', error: error.message };
    }
  }

  // Generate content using Copy.ai
  async generateWithCopyAI(prompt: string, type: string): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('copyai');
    if (!apiKey) {
      return {
        success: false,
        serviceId: 'copyai',
        error: 'API key not configured',
        url: 'https://www.copy.ai/'
      };
    }

    try {
      const response = await fetch('https://api.copy.ai/api/workflow/generate', {
        method: 'POST',
        headers: {
          'x-copy-ai-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          workflow_type: type
        })
      });

      const data = await response.json();
      return { success: true, serviceId: 'copyai', result: data };
    } catch (error: any) {
      return { success: false, serviceId: 'copyai', error: error.message };
    }
  }

  // Process PDF using LightPDF
  async processWithLightPDF(file: File, operation: 'convert' | 'compress' | 'ocr'): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('lightpdf');
    if (!apiKey) {
      return {
        success: false,
        serviceId: 'lightpdf',
        error: 'API key not configured',
        url: 'https://lightpdf.com/'
      };
    }

    // LightPDF API implementation
    return {
      success: true,
      serviceId: 'lightpdf',
      url: 'https://lightpdf.com/'
    };
  }

  // Create video using Pictory
  async createPictoryVideo(script: string): Promise<AIGenerationResult> {
    const apiKey = this.apiKeys.get('pictory');
    if (!apiKey) {
      return {
        success: false,
        serviceId: 'pictory',
        error: 'API key not configured',
        url: 'https://pictory.ai/'
      };
    }

    try {
      const response = await fetch('https://api.pictory.ai/v1/video/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script })
      });

      const data = await response.json();
      return { success: true, serviceId: 'pictory', result: data };
    } catch (error: any) {
      return { success: false, serviceId: 'pictory', error: error.message };
    }
  }

  // Get service status and configuration
  getServiceStatus(): { configured: string[]; unconfigured: string[] } {
    const configured: string[] = [];
    const unconfigured: string[] = [];

    AI_CREATIVE_SERVICES.forEach(service => {
      if (this.isServiceConfigured(service.id)) {
        configured.push(service.id);
      } else {
        unconfigured.push(service.id);
      }
    });

    return { configured, unconfigured };
  }

  // Get recommended services for a use case
  getRecommendedServices(useCase: 'video' | 'social-media' | 'writing' | 'image' | 'music'): AICreativeService[] {
    const recommendations: Record<string, string[]> = {
      'video': ['synthesia', 'fliki', 'pictory', 'deevid'],
      'social-media': ['copyai', 'fliki', 'pictory', 'wordtune'],
      'writing': ['wordtune', 'copyai', 'sider'],
      'image': ['midjourney', 'remini'],
      'music': ['soundraw']
    };

    return (recommendations[useCase] || [])
      .map(id => this.services.get(id))
      .filter((s): s is AICreativeService => s !== undefined);
  }
}

// Export singleton instance
export const aiCreativeToolsService = new AICreativeToolsService();

// Export for React components
export function useAICreativeTools() {
  return {
    services: aiCreativeToolsService.getAllServices(),
    videoServices: aiCreativeToolsService.getVideoServices(),
    imageServices: aiCreativeToolsService.getImageServices(),
    audioServices: aiCreativeToolsService.getAudioServices(),
    textServices: aiCreativeToolsService.getTextServices(),
    digitalArtApps: aiCreativeToolsService.getDigitalArtApps(),
    getService: (id: string) => aiCreativeToolsService.getService(id),
    isConfigured: (id: string) => aiCreativeToolsService.isServiceConfigured(id),
    isDesktopApp: (id: string) => aiCreativeToolsService.isDesktopApp(id),
    setApiKey: (id: string, key: string) => aiCreativeToolsService.setApiKey(id, key),
    setCustomAppPath: (id: string, path: string) => aiCreativeToolsService.setCustomAppPath(id, path),
    getCustomAppPath: (id: string) => aiCreativeToolsService.getCustomAppPath(id),
    openWebsite: (id: string) => aiCreativeToolsService.openServiceWebsite(id),
    launchApp: (id: string) => aiCreativeToolsService.launchApp(id),
    launchClipStudio: () => aiCreativeToolsService.launchClipStudio(),
    getRecommended: (useCase: 'video' | 'social-media' | 'writing' | 'image' | 'music') =>
      aiCreativeToolsService.getRecommendedServices(useCase),
    generateSynthesiaVideo: aiCreativeToolsService.generateSynthesiaVideo.bind(aiCreativeToolsService),
    generateSoundrawMusic: aiCreativeToolsService.generateSoundrawMusic.bind(aiCreativeToolsService),
    generateFlikiVideo: aiCreativeToolsService.generateFlikiVideo.bind(aiCreativeToolsService),
    enhanceWithRemini: aiCreativeToolsService.enhanceWithRemini.bind(aiCreativeToolsService),
    rewriteWithWordtune: aiCreativeToolsService.rewriteWithWordtune.bind(aiCreativeToolsService),
    generateWithCopyAI: aiCreativeToolsService.generateWithCopyAI.bind(aiCreativeToolsService),
    createPictoryVideo: aiCreativeToolsService.createPictoryVideo.bind(aiCreativeToolsService)
  };
}

export default aiCreativeToolsService;
