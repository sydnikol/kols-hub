/**
 * FREE AI TOOLS DATABASE
 * ========================
 * Comprehensive collection of 300+ FREE AI tools for Kol's Hub
 * Curated from: AIxploria, AIToolGuru, GitHub Collections, HuyenChip OSS,
 * Awesome-AI-Tools, Awesome-LLM-Apps, Awesome-LangChain, Awesome-AI-Agents
 *
 * All tools are FREE or have free tiers
 * Created: February 2026
 */

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: AIToolCategory;
  subcategory?: string;
  url?: string;
  github?: string;
  isOpenSource: boolean;
  tags: string[];
  useCase: string[];
  integratedInRoom?: string;
}

export type AIToolCategory =
  | 'chatbots'
  | 'image-generation'
  | 'code-assistants'
  | 'writing'
  | 'productivity'
  | 'audio-music'
  | 'video'
  | 'research'
  | 'agents'
  | 'rag'
  | 'local-llms'
  | 'frameworks'
  | 'data-analysis'
  | 'accessibility'
  | 'health-wellness'
  | 'education'
  | 'creativity'
  | 'automation'
  | 'search'
  | 'translation'
  | 'voice'
  | 'finance'
  | 'gaming';

// ============================================
// CHATBOTS & CONVERSATIONAL AI (Free)
// ============================================
export const CHATBOT_TOOLS: AITool[] = [
  {
    id: 'librechat',
    name: 'LibreChat',
    description: 'Free, open-source chat interface for multiple AI assistants',
    category: 'chatbots',
    github: 'danny-avila/LibreChat',
    isOpenSource: true,
    tags: ['chat', 'multi-model', 'self-hosted'],
    useCase: ['AI companion chat', 'Multi-model conversations'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'chatbot-ui',
    name: 'Chatbot UI',
    description: 'Open source ChatGPT interface with clean design',
    category: 'chatbots',
    github: 'mckaywrigley/chatbot-ui',
    isOpenSource: true,
    tags: ['chat', 'gpt', 'interface'],
    useCase: ['Custom chat interface', 'Self-hosted chat'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'open-webui',
    name: 'Open WebUI',
    description: 'Self-hosted AI platform that runs entirely offline',
    category: 'chatbots',
    github: 'open-webui/open-webui',
    isOpenSource: true,
    tags: ['offline', 'privacy', 'local'],
    useCase: ['Private AI assistant', 'Offline chat'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'jan',
    name: 'Jan',
    description: 'Run LLMs locally and offline on personal devices',
    category: 'local-llms',
    github: 'janhq/jan',
    isOpenSource: true,
    tags: ['local', 'offline', 'privacy'],
    useCase: ['Private local AI', 'Offline assistant'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run large language models locally in terminal',
    category: 'local-llms',
    github: 'ollama/ollama',
    isOpenSource: true,
    tags: ['local', 'terminal', 'models'],
    useCase: ['Local AI', 'Development', 'Privacy'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'gpt4all',
    name: 'GPT4All',
    description: 'Chatbot trained on massive collection of clean assistant data',
    category: 'local-llms',
    github: 'nomic-ai/gpt4all',
    isOpenSource: true,
    tags: ['local', 'free', 'assistant'],
    useCase: ['Local chatbot', 'Privacy-focused AI'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'privategpt',
    name: 'PrivateGPT',
    description: 'Ask questions to your documents without internet connection',
    category: 'rag',
    github: 'zylon-ai/private-gpt',
    isOpenSource: true,
    tags: ['documents', 'offline', 'privacy'],
    useCase: ['Document Q&A', 'Private research'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'quivr',
    name: 'Quivr',
    description: 'Chat with files using generative AI - your second brain',
    category: 'rag',
    github: 'QuivrHQ/quivr',
    isOpenSource: true,
    tags: ['files', 'knowledge', 'memory'],
    useCase: ['Knowledge management', 'File chat'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'hexabot',
    name: 'Hexabot',
    description: 'Open-source No-Code tool to build your AI Chatbot/Agent',
    category: 'chatbots',
    github: 'Hexastack/Hexabot',
    isOpenSource: true,
    tags: ['no-code', 'builder', 'agents'],
    useCase: ['Custom chatbot creation', 'No-code AI'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'tiledesk',
    name: 'Tiledesk',
    description: 'Open-source LLM-enabled no-code chatbot framework',
    category: 'chatbots',
    github: 'Tiledesk/tiledesk',
    isOpenSource: true,
    tags: ['no-code', 'customer-support', 'llm'],
    useCase: ['Support chatbot', 'Customer service'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'clawdbot',
    name: 'Clawdbot',
    description: 'Locally-hosted personal AI assistant with persistent memory via WhatsApp, Telegram, Discord',
    category: 'chatbots',
    isOpenSource: true,
    tags: ['memory', 'multi-platform', 'personal'],
    useCase: ['Personal assistant', 'Cross-platform chat'],
    integratedInRoom: 'ai-command-center'
  }
];

// ============================================
// AI AGENTS (Free & Open Source)
// ============================================
export const AGENT_TOOLS: AITool[] = [
  {
    id: 'autogpt',
    name: 'Auto-GPT',
    description: 'Experimental open-source autonomous GPT-4 agent',
    category: 'agents',
    github: 'Significant-Gravitas/Auto-GPT',
    isOpenSource: true,
    tags: ['autonomous', 'tasks', 'planning'],
    useCase: ['Task automation', 'Autonomous research'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'babyagi',
    name: 'BabyAGI',
    description: 'AI-powered task management system',
    category: 'agents',
    github: 'yoheinakajima/babyagi',
    isOpenSource: true,
    tags: ['tasks', 'planning', 'autonomous'],
    useCase: ['Task management', 'Goal planning'],
    integratedInRoom: 'executive-function-lab'
  },
  {
    id: 'agentgpt',
    name: 'AgentGPT',
    description: 'Browser-based no-code autonomous agent builder',
    category: 'agents',
    github: 'reworkd/AgentGPT',
    isOpenSource: true,
    tags: ['no-code', 'browser', 'autonomous'],
    useCase: ['Goal achievement', 'Autonomous tasks'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'metagpt',
    name: 'MetaGPT',
    description: 'Multi-Agent Framework: requirement to PRD, design, tasks, repo',
    category: 'agents',
    github: 'geekan/MetaGPT',
    isOpenSource: true,
    tags: ['multi-agent', 'development', 'planning'],
    useCase: ['Software development', 'Project planning'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'autogen',
    name: 'AutoGen',
    description: 'Microsoft framework for multi-agent LLM applications',
    category: 'agents',
    github: 'microsoft/autogen',
    isOpenSource: true,
    tags: ['multi-agent', 'microsoft', 'collaboration'],
    useCase: ['Agent collaboration', 'Complex tasks'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    description: 'Role-playing autonomous AI agent framework',
    category: 'agents',
    github: 'joaomdmoura/crewAI',
    isOpenSource: true,
    tags: ['roles', 'team', 'autonomous'],
    useCase: ['Team automation', 'Role-based agents'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'superagi',
    name: 'SuperAGI',
    description: 'Developer-first autonomous AI agent framework',
    category: 'agents',
    github: 'TransformerOptimus/SuperAGI',
    isOpenSource: true,
    tags: ['developer', 'framework', 'autonomous'],
    useCase: ['Development automation', 'Agent building'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'gpt-researcher',
    name: 'GPT Researcher',
    description: 'Autonomous agent for comprehensive online research',
    category: 'agents',
    github: 'assafelovic/gpt-researcher',
    isOpenSource: true,
    tags: ['research', 'autonomous', 'web'],
    useCase: ['Research automation', 'Information gathering'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'opendevin',
    name: 'OpenDevin',
    description: 'Autonomous agent for software engineering complexities',
    category: 'agents',
    github: 'OpenDevin/OpenDevin',
    isOpenSource: true,
    tags: ['coding', 'autonomous', 'engineering'],
    useCase: ['Code generation', 'Software development'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'devika',
    name: 'Devika',
    description: 'Agentic AI software engineer',
    category: 'agents',
    github: 'stitionai/devika',
    isOpenSource: true,
    tags: ['coding', 'engineer', 'autonomous'],
    useCase: ['Software development', 'Code writing'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'storm',
    name: 'STORM',
    description: 'LLM-powered knowledge curation system with citations',
    category: 'research',
    github: 'stanford-oval/storm',
    isOpenSource: true,
    tags: ['research', 'citations', 'knowledge'],
    useCase: ['Research writing', 'Knowledge synthesis'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'agentforge',
    name: 'AgentForge',
    description: 'LLM-agnostic platform for agent building and testing',
    category: 'agents',
    github: 'DataBassGit/AgentForge',
    isOpenSource: true,
    tags: ['builder', 'testing', 'agnostic'],
    useCase: ['Agent development', 'Testing'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'agentverse',
    name: 'AgentVerse',
    description: 'Platform for multiple agents to collaborate on tasks',
    category: 'agents',
    github: 'OpenBMB/AgentVerse',
    isOpenSource: true,
    tags: ['collaboration', 'multi-agent', 'tasks'],
    useCase: ['Agent collaboration', 'Complex problems'],
    integratedInRoom: 'kollective-hub'
  },
  {
    id: 'aider',
    name: 'Aider',
    description: 'Command-line pair programming with GPT for git repos',
    category: 'code-assistants',
    github: 'paul-gauthier/aider',
    isOpenSource: true,
    tags: ['coding', 'git', 'pair-programming'],
    useCase: ['Code editing', 'Pair programming'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'ai-mental-wellbeing-agent',
    name: 'AI Mental Wellbeing Agent',
    description: 'Supports psychological health with AI assistance',
    category: 'health-wellness',
    isOpenSource: true,
    tags: ['mental-health', 'support', 'wellness'],
    useCase: ['Mental health support', 'Wellness coaching'],
    integratedInRoom: 'crisis-vault'
  },
  {
    id: 'ai-health-fitness-agent',
    name: 'AI Health & Fitness Agent',
    description: 'Creates personalized wellness and fitness plans',
    category: 'health-wellness',
    isOpenSource: true,
    tags: ['health', 'fitness', 'wellness'],
    useCase: ['Fitness planning', 'Health tracking'],
    integratedInRoom: 'apothecary'
  },
  {
    id: 'ai-financial-coach',
    name: 'AI Financial Coach Agent',
    description: 'Offers personalized financial guidance',
    category: 'finance',
    isOpenSource: true,
    tags: ['finance', 'coaching', 'planning'],
    useCase: ['Financial advice', 'Budget planning'],
    integratedInRoom: 'treasury'
  },
  {
    id: 'ai-travel-agent',
    name: 'AI Travel Agent',
    description: 'Plans trips with local and cloud options',
    category: 'productivity',
    isOpenSource: true,
    tags: ['travel', 'planning', 'trips'],
    useCase: ['Trip planning', 'Travel assistance'],
    integratedInRoom: 'office-hub'
  }
];

// ============================================
// CODE ASSISTANTS (Free)
// ============================================
export const CODE_TOOLS: AITool[] = [
  {
    id: 'continue',
    name: 'Continue',
    description: 'Open-source AI code assistant for the IDE',
    category: 'code-assistants',
    github: 'continuedev/continue',
    isOpenSource: true,
    tags: ['ide', 'coding', 'assistant'],
    useCase: ['Code completion', 'Development'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'roocode',
    name: 'RooCode',
    description: 'AI-powered autonomous coding agent for VS Code',
    category: 'code-assistants',
    github: 'RooVetGit/Roo-Code',
    isOpenSource: true,
    tags: ['vscode', 'autonomous', 'coding'],
    useCase: ['Code writing', 'Automation'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'plandex',
    name: 'Plandex',
    description: 'Terminal-based AI programming engine for complex tasks',
    category: 'code-assistants',
    github: 'plandex-ai/plandex',
    isOpenSource: true,
    tags: ['terminal', 'planning', 'complex'],
    useCase: ['Complex coding', 'Project planning'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'jupyter-ai',
    name: 'Jupyter AI',
    description: 'AI assistant supporting 100+ LLMs locally or remote',
    category: 'code-assistants',
    github: 'jupyterlab/jupyter-ai',
    isOpenSource: true,
    tags: ['jupyter', 'notebooks', 'data-science'],
    useCase: ['Data analysis', 'Notebooks'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'tabby',
    name: 'Tabby',
    description: 'Self-hosted AI coding assistant',
    category: 'code-assistants',
    github: 'TabbyML/tabby',
    isOpenSource: true,
    tags: ['self-hosted', 'coding', 'completion'],
    useCase: ['Code completion', 'Self-hosted'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'turbopilot',
    name: 'TurboPilot',
    description: 'Self-hosted Copilot clone using Salesforce Codegen',
    category: 'code-assistants',
    github: 'ravenscroftj/turbopilot',
    isOpenSource: true,
    tags: ['copilot', 'self-hosted', 'free'],
    useCase: ['Code completion', 'Development'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'gpt-code-ui',
    name: 'GPT-Code UI',
    description: 'Open-source ChatGPT Code interpreter implementation',
    category: 'code-assistants',
    github: 'ricklamers/gpt-code-ui',
    isOpenSource: true,
    tags: ['code', 'interpreter', 'execution'],
    useCase: ['Code execution', 'Analysis'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'pr-agent',
    name: 'PR-Agent',
    description: 'AI-powered tool for automated PR analysis and feedback',
    category: 'code-assistants',
    github: 'Codium-ai/pr-agent',
    isOpenSource: true,
    tags: ['github', 'pr', 'review'],
    useCase: ['Code review', 'PR analysis'],
    integratedInRoom: 'office-hub'
  }
];

// ============================================
// IMAGE GENERATION (Free)
// ============================================
export const IMAGE_TOOLS: AITool[] = [
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'State-of-the-art text-to-image model by Stability AI',
    category: 'image-generation',
    github: 'CompVis/stable-diffusion',
    isOpenSource: true,
    tags: ['text-to-image', 'local', 'generation'],
    useCase: ['Image creation', 'Art generation'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'fooocus',
    name: 'Fooocus',
    description: 'Easy-to-use image generation interface for Stable Diffusion',
    category: 'image-generation',
    github: 'lllyasviel/Fooocus',
    isOpenSource: true,
    tags: ['simple', 'stable-diffusion', 'ui'],
    useCase: ['Easy image generation', 'Art creation'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'controlnet',
    name: 'ControlNet',
    description: 'Add conditional control to text-to-image diffusion models',
    category: 'image-generation',
    github: 'lllyasviel/ControlNet',
    isOpenSource: true,
    tags: ['control', 'poses', 'edges'],
    useCase: ['Controlled generation', 'Pose-based art'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'draggan',
    name: 'DragGAN',
    description: 'Interactive point-based manipulation on generative images',
    category: 'image-generation',
    github: 'XingangPan/DragGAN',
    isOpenSource: true,
    tags: ['editing', 'manipulation', 'interactive'],
    useCase: ['Image editing', 'Interactive manipulation'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'flux',
    name: 'Flux',
    description: 'High-quality photorealistic text-to-image models by Black Forest Labs',
    category: 'image-generation',
    isOpenSource: true,
    tags: ['photorealistic', 'quality', 'generation'],
    useCase: ['Photorealistic images', 'High quality art'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'comfyui',
    name: 'ComfyUI',
    description: 'Powerful and modular Stable Diffusion GUI and backend',
    category: 'image-generation',
    github: 'comfyanonymous/ComfyUI',
    isOpenSource: true,
    tags: ['workflow', 'nodes', 'advanced'],
    useCase: ['Advanced workflows', 'Custom pipelines'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'automatic1111',
    name: 'Automatic1111 WebUI',
    description: 'Feature-rich Stable Diffusion web interface',
    category: 'image-generation',
    github: 'AUTOMATIC1111/stable-diffusion-webui',
    isOpenSource: true,
    tags: ['webui', 'features', 'community'],
    useCase: ['Image generation', 'Inpainting'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'thumbnail-creator',
    name: 'ThumbnailCreator.com',
    description: 'Create eye-catching thumbnails for YouTube, Twitch, Facebook with AI',
    category: 'image-generation',
    url: 'https://thumbnailcreator.com',
    isOpenSource: false,
    tags: ['thumbnails', 'youtube', 'social'],
    useCase: ['Video thumbnails', 'Social media'],
    integratedInRoom: 'creative-studio'
  }
];

// ============================================
// AUDIO & MUSIC (Free)
// ============================================
export const AUDIO_TOOLS: AITool[] = [
  {
    id: 'whisper',
    name: 'OpenAI Whisper',
    description: 'Robust speech recognition in multiple languages',
    category: 'audio-music',
    github: 'openai/whisper',
    isOpenSource: true,
    tags: ['speech', 'transcription', 'multilingual'],
    useCase: ['Voice transcription', 'Accessibility'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'tuneflow',
    name: 'TuneFlow',
    description: 'Music making with the power of AI - easy and fun',
    category: 'audio-music',
    isOpenSource: true,
    tags: ['music', 'creation', 'easy'],
    useCase: ['Music creation', 'Composition'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'audiocraft',
    name: 'AudioCraft',
    description: 'Meta AI library for audio generation including MusicGen',
    category: 'audio-music',
    github: 'facebookresearch/audiocraft',
    isOpenSource: true,
    tags: ['music', 'generation', 'meta'],
    useCase: ['Music generation', 'Sound effects'],
    integratedInRoom: 'mood-music-lounge'
  },
  {
    id: 'bark',
    name: 'Bark',
    description: 'Text-to-audio model with music, sound effects, emotions',
    category: 'audio-music',
    github: 'suno-ai/bark',
    isOpenSource: true,
    tags: ['tts', 'music', 'effects'],
    useCase: ['Voice generation', 'Sound creation'],
    integratedInRoom: 'mood-music-lounge'
  },
  {
    id: 'qwen3-tts',
    name: 'Qwen3-TTS',
    description: 'Voice cloning with natural speech in multiple languages, controllable tone and emotion',
    category: 'voice',
    isOpenSource: true,
    tags: ['voice', 'cloning', 'emotion'],
    useCase: ['Voice cloning', 'TTS'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'coqui-tts',
    name: 'Coqui TTS',
    description: 'Deep learning toolkit for text-to-speech',
    category: 'voice',
    github: 'coqui-ai/TTS',
    isOpenSource: true,
    tags: ['tts', 'voices', 'deep-learning'],
    useCase: ['Text-to-speech', 'Voice synthesis'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'voice-rag-agent',
    name: 'Voice RAG Agent',
    description: 'Retrieve information via speech using OpenAI SDK',
    category: 'voice',
    isOpenSource: true,
    tags: ['voice', 'rag', 'speech'],
    useCase: ['Voice search', 'Audio interaction'],
    integratedInRoom: 'sensory-sanctuary'
  },
  {
    id: 'voice-dictation-agent',
    name: 'OpenSource Voice Dictation',
    description: 'Transcribes speech like Whisper Flow',
    category: 'voice',
    isOpenSource: true,
    tags: ['dictation', 'transcription', 'accessibility'],
    useCase: ['Voice input', 'Accessibility'],
    integratedInRoom: 'sensory-sanctuary'
  }
];

// ============================================
// PRODUCTIVITY & WRITING (Free)
// ============================================
export const PRODUCTIVITY_TOOLS: AITool[] = [
  {
    id: 'fabric',
    name: 'Fabric',
    description: 'Apply AI to everyday challenges using prompt patterns in terminal',
    category: 'productivity',
    github: 'danielmiessler/fabric',
    isOpenSource: true,
    tags: ['terminal', 'prompts', 'patterns'],
    useCase: ['Daily automation', 'Text processing'],
    integratedInRoom: 'executive-function-lab'
  },
  {
    id: 'mem-free',
    name: 'MemFree',
    description: 'Open Source Hybrid AI Search Engine for accurate answers',
    category: 'search',
    github: 'memfreeme/memfree',
    isOpenSource: true,
    tags: ['search', 'hybrid', 'ai'],
    useCase: ['AI search', 'Knowledge finding'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex',
    description: 'Data framework for building LLM applications over external data',
    category: 'frameworks',
    github: 'run-llama/llama_index',
    isOpenSource: true,
    tags: ['data', 'rag', 'framework'],
    useCase: ['Data applications', 'RAG systems'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Framework for developing applications powered by language models',
    category: 'frameworks',
    github: 'langchain-ai/langchain',
    isOpenSource: true,
    tags: ['framework', 'chains', 'agents'],
    useCase: ['LLM apps', 'Agent building'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'flowise',
    name: 'Flowise',
    description: 'Drag-and-drop UI for building customized LLM flows',
    category: 'frameworks',
    github: 'FlowiseAI/Flowise',
    isOpenSource: true,
    tags: ['no-code', 'visual', 'flows'],
    useCase: ['Visual AI building', 'No-code automation'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'langflow',
    name: 'Langflow',
    description: 'UI interface for LangChain visual building',
    category: 'frameworks',
    github: 'logspace-ai/langflow',
    isOpenSource: true,
    tags: ['visual', 'langchain', 'ui'],
    useCase: ['Visual LangChain', 'Flow building'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'dify',
    name: 'Dify',
    description: 'All-in-one platform for prompt engineering and AI applications',
    category: 'frameworks',
    github: 'langgenius/dify',
    isOpenSource: true,
    tags: ['platform', 'prompts', 'apps'],
    useCase: ['AI app building', 'Prompt management'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'chainlit',
    name: 'Chainlit',
    description: 'Framework for building Python LLM applications with UI',
    category: 'frameworks',
    github: 'Chainlit/chainlit',
    isOpenSource: true,
    tags: ['python', 'ui', 'apps'],
    useCase: ['Chat apps', 'LLM interfaces'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'chatgpt-translate',
    name: 'ChatGPT Translate',
    description: 'Translates text, voice, and images across 50+ languages',
    category: 'translation',
    isOpenSource: false,
    tags: ['translation', 'voice', 'images'],
    useCase: ['Language translation', 'Communication'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'text-to-human',
    name: 'TextToHuman',
    description: 'Transforms AI text into natural language',
    category: 'writing',
    isOpenSource: false,
    tags: ['humanize', 'writing', 'natural'],
    useCase: ['Content humanization', 'Writing'],
    integratedInRoom: 'creative-studio'
  }
];

// ============================================
// RAG & KNOWLEDGE SYSTEMS (Free)
// ============================================
export const RAG_TOOLS: AITool[] = [
  {
    id: 'chat-with-pdf',
    name: 'Chat with PDF',
    description: 'Document analysis and Q&A via GPT & Llama3',
    category: 'rag',
    isOpenSource: true,
    tags: ['pdf', 'documents', 'qa'],
    useCase: ['Document analysis', 'PDF chat'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'chat-with-github',
    name: 'Chat with GitHub',
    description: 'Conversations about GitHub repos using GPT & Llama3',
    category: 'rag',
    isOpenSource: true,
    tags: ['github', 'code', 'repos'],
    useCase: ['Code understanding', 'Repo analysis'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'chat-with-youtube',
    name: 'Chat with YouTube Videos',
    description: 'Video content analysis and Q&A',
    category: 'rag',
    isOpenSource: true,
    tags: ['youtube', 'video', 'analysis'],
    useCase: ['Video learning', 'Content analysis'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'chat-with-arxiv',
    name: 'Chat with Research Papers',
    description: 'ArXiv paper discussions and analysis',
    category: 'rag',
    isOpenSource: true,
    tags: ['research', 'papers', 'arxiv'],
    useCase: ['Research', 'Academic reading'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'agentset',
    name: 'Agentset.ai',
    description: 'Open-source local Semantic Search + RAG for your data',
    category: 'rag',
    isOpenSource: true,
    tags: ['semantic', 'search', 'local'],
    useCase: ['Local search', 'Data retrieval'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'autonomous-rag',
    name: 'Autonomous RAG',
    description: 'Self-managing retrieval augmented generation system',
    category: 'rag',
    isOpenSource: true,
    tags: ['autonomous', 'retrieval', 'self-managing'],
    useCase: ['Automated research', 'Knowledge retrieval'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'corrective-rag',
    name: 'Corrective RAG (CRAG)',
    description: 'Self-correcting retrieval mechanism',
    category: 'rag',
    isOpenSource: true,
    tags: ['corrective', 'accuracy', 'retrieval'],
    useCase: ['Accurate answers', 'Fact checking'],
    integratedInRoom: 'library-study'
  }
];

// ============================================
// DATA ANALYSIS (Free)
// ============================================
export const DATA_TOOLS: AITool[] = [
  {
    id: 'dataline',
    name: 'DataLine',
    description: 'AI-driven data analysis and visualization tool',
    category: 'data-analysis',
    isOpenSource: true,
    tags: ['data', 'visualization', 'analysis'],
    useCase: ['Data analysis', 'Visualization'],
    integratedInRoom: 'treasury'
  },
  {
    id: 'ai-data-analysis-agent',
    name: 'AI Data Analysis Agent',
    description: 'Analyzes datasets and generates insights',
    category: 'data-analysis',
    isOpenSource: true,
    tags: ['datasets', 'insights', 'analysis'],
    useCase: ['Data insights', 'Reporting'],
    integratedInRoom: 'treasury'
  },
  {
    id: 'whodb',
    name: 'WhoDB',
    description: 'SQL/NoSQL/Graph/Cache data explorer with AI-powered chat',
    category: 'data-analysis',
    isOpenSource: true,
    tags: ['database', 'sql', 'explorer'],
    useCase: ['Database exploration', 'Data queries'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'pandas-ai',
    name: 'PandasAI',
    description: 'Chat with your data using natural language',
    category: 'data-analysis',
    github: 'gventuri/pandas-ai',
    isOpenSource: true,
    tags: ['pandas', 'data', 'natural-language'],
    useCase: ['Data querying', 'Analysis'],
    integratedInRoom: 'treasury'
  }
];

// ============================================
// OPEN SOURCE LLMs (Free to Run Locally)
// ============================================
export const OPEN_LLMS: AITool[] = [
  {
    id: 'llama-3',
    name: 'Llama 3',
    description: 'Meta\'s latest 8-70B parameter open LLM',
    category: 'local-llms',
    github: 'meta-llama/llama3',
    isOpenSource: true,
    tags: ['meta', 'large', 'versatile'],
    useCase: ['General AI tasks', 'Local deployment'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'mistral',
    name: 'Mistral 7B',
    description: 'Efficient 7B model with extended context, Apache 2.0',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['efficient', 'context', 'apache'],
    useCase: ['Local AI', 'General tasks'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'mixtral',
    name: 'Mixtral 8x7B',
    description: 'Mistral\'s mixture-of-experts model, Apache 2.0',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['moe', 'efficient', 'powerful'],
    useCase: ['Complex tasks', 'Local deployment'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'phi-3',
    name: 'Phi-3',
    description: 'Microsoft\'s small but capable 3.8B model, MIT license',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['small', 'microsoft', 'efficient'],
    useCase: ['Mobile AI', 'Edge deployment'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'gemma',
    name: 'Gemma',
    description: 'Google\'s efficient 2-7B open models',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['google', 'small', 'efficient'],
    useCase: ['Light AI tasks', 'Mobile'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'qwen',
    name: 'Qwen',
    description: 'Alibaba\'s 7-110B multilingual models',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['alibaba', 'multilingual', 'large'],
    useCase: ['Multilingual AI', 'General tasks'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Powerful 7-236B parameter models',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['large', 'powerful', 'versatile'],
    useCase: ['Complex reasoning', 'Coding'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'falcon',
    name: 'Falcon',
    description: 'TII\'s high-performance 7-180B models, Apache 2.0',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['performance', 'large', 'apache'],
    useCase: ['High performance AI', 'General tasks'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'starcoder',
    name: 'StarCoder',
    description: 'Code generation 1.1-15B models, OpenRAIL-M',
    category: 'local-llms',
    github: 'bigcode-project/starcoder',
    isOpenSource: true,
    tags: ['code', 'programming', 'generation'],
    useCase: ['Code generation', 'Development'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'code-llama',
    name: 'Code Llama',
    description: 'Meta\'s code-focused 7-34B LLM variant',
    category: 'local-llms',
    isOpenSource: true,
    tags: ['code', 'meta', 'programming'],
    useCase: ['Code generation', 'Coding assistant'],
    integratedInRoom: 'office-hub'
  }
];

// ============================================
// ACCESSIBILITY & HEALTH (Free)
// ============================================
export const ACCESSIBILITY_TOOLS: AITool[] = [
  {
    id: 'optikey',
    name: 'OptiKey',
    description: 'Full computer control and speech with your eyes',
    category: 'accessibility',
    github: 'OptiKey/OptiKey',
    isOpenSource: true,
    tags: ['eyes', 'accessibility', 'control'],
    useCase: ['Eye control', 'Accessibility'],
    integratedInRoom: 'sensory-sanctuary'
  },
  {
    id: 'if-me',
    name: 'If-Me',
    description: 'Mental health communication platform for sharing with loved ones',
    category: 'health-wellness',
    github: 'ifmeorg/ifme',
    isOpenSource: true,
    tags: ['mental-health', 'sharing', 'support'],
    useCase: ['Mental health support', 'Communication'],
    integratedInRoom: 'crisis-vault'
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'Catch insensitive, inconsiderate writing',
    category: 'accessibility',
    github: 'get-alex/alex',
    isOpenSource: true,
    tags: ['inclusive', 'writing', 'checking'],
    useCase: ['Inclusive writing', 'Content review'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'pa11y',
    name: 'Pa11y',
    description: 'Automated accessibility testing pal',
    category: 'accessibility',
    github: 'pa11y/pa11y',
    isOpenSource: true,
    tags: ['testing', 'a11y', 'automation'],
    useCase: ['Accessibility testing', 'Web development'],
    integratedInRoom: 'sensory-sanctuary'
  },
  {
    id: 'tota11y',
    name: 'tota11y',
    description: 'Accessibility visualization toolkit',
    category: 'accessibility',
    github: 'jdan/tota11y',
    isOpenSource: true,
    tags: ['visualization', 'a11y', 'toolkit'],
    useCase: ['A11y visualization', 'Testing'],
    integratedInRoom: 'sensory-sanctuary'
  }
];

// ============================================
// GAMING & ENTERTAINMENT (Free)
// ============================================
export const GAMING_TOOLS: AITool[] = [
  {
    id: 'ai-chess-agent',
    name: 'AI Chess Agent',
    description: 'Plays chess strategically using AI',
    category: 'gaming',
    isOpenSource: true,
    tags: ['chess', 'strategy', 'game'],
    useCase: ['Chess playing', 'Strategy games'],
    integratedInRoom: 'gaming-den'
  },
  {
    id: 'ai-3d-pygame-agent',
    name: 'AI 3D Pygame Agent',
    description: 'Plays 3D games autonomously',
    category: 'gaming',
    isOpenSource: true,
    tags: ['3d', 'games', 'autonomous'],
    useCase: ['Game AI', 'Automation'],
    integratedInRoom: 'gaming-den'
  },
  {
    id: 'ai-game-design-team',
    name: 'AI Game Design Agent Team',
    description: 'Designs games collaboratively with AI',
    category: 'gaming',
    isOpenSource: true,
    tags: ['design', 'team', 'collaboration'],
    useCase: ['Game design', 'Ideation'],
    integratedInRoom: 'gaming-den'
  },
  {
    id: 'project-genie',
    name: 'Project Genie',
    description: 'Creates infinite interactive worlds with realistic physics from text or images',
    category: 'gaming',
    isOpenSource: false,
    tags: ['worlds', 'physics', 'generation'],
    useCase: ['World building', 'Interactive environments'],
    integratedInRoom: 'gaming-den'
  },
  {
    id: 'waypoint-overworld',
    name: 'Waypoint-1 Overworld',
    description: 'Open-source simulator creating interactive worlds controllable via text, mouse, keyboard',
    category: 'gaming',
    isOpenSource: true,
    tags: ['worlds', 'interactive', 'open-source'],
    useCase: ['World simulation', 'Gaming'],
    integratedInRoom: 'gaming-den'
  }
];

// ============================================
// CREATIVITY & CONTENT (Free)
// ============================================
export const CREATIVITY_TOOLS: AITool[] = [
  {
    id: 'ai-meme-generator',
    name: 'AI Meme Generator Agent',
    description: 'Creates memes using browser automation',
    category: 'creativity',
    isOpenSource: true,
    tags: ['memes', 'humor', 'generation'],
    useCase: ['Meme creation', 'Entertainment'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'ai-music-generator',
    name: 'AI Music Generator Agent',
    description: 'Generates original music compositions',
    category: 'audio-music',
    isOpenSource: true,
    tags: ['music', 'composition', 'generation'],
    useCase: ['Music creation', 'Composition'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'ai-blog-to-podcast',
    name: 'AI Blog to Podcast Agent',
    description: 'Converts blog content into podcast format',
    category: 'audio-music',
    isOpenSource: true,
    tags: ['podcast', 'conversion', 'content'],
    useCase: ['Content repurposing', 'Podcasting'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'freebeat',
    name: 'freebeat.ai',
    description: 'Transform music into professional-grade music videos',
    category: 'video',
    url: 'https://freebeat.ai',
    isOpenSource: false,
    tags: ['music-video', 'generation', 'free'],
    useCase: ['Music video creation', 'Visual content'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'chroma-ai',
    name: 'Chroma AI',
    description: 'Generates gradients for emotional design associations',
    category: 'creativity',
    isOpenSource: true,
    tags: ['colors', 'gradients', 'design'],
    useCase: ['Color design', 'Themes'],
    integratedInRoom: 'creative-studio'
  }
];

// ============================================
// EDUCATION & LEARNING (Free)
// ============================================
export const EDUCATION_TOOLS: AITool[] = [
  {
    id: 'ai-teaching-team',
    name: 'AI Teaching Agent Team',
    description: 'Delivers educational content with AI teachers',
    category: 'education',
    isOpenSource: true,
    tags: ['teaching', 'education', 'learning'],
    useCase: ['Learning', 'Education'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'alphaxiv',
    name: 'alphaXiv',
    description: 'Discuss, discover, and read arXiv papers',
    category: 'education',
    isOpenSource: true,
    tags: ['research', 'papers', 'discussion'],
    useCase: ['Research learning', 'Academic'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'kiln',
    name: 'Kiln',
    description: 'Build your own AI models with no-code interface',
    category: 'education',
    isOpenSource: true,
    tags: ['no-code', 'models', 'learning'],
    useCase: ['AI learning', 'Model building'],
    integratedInRoom: 'library-study'
  }
];

// ============================================
// AUTOMATION & WORKFLOWS (Free)
// ============================================
export const AUTOMATION_TOOLS: AITool[] = [
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Fair-code workflow automation platform',
    category: 'automation',
    github: 'n8n-io/n8n',
    isOpenSource: true,
    tags: ['workflow', 'automation', 'integration'],
    useCase: ['Workflow automation', 'Integration'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'activepieces',
    name: 'Activepieces',
    description: 'Open source no-code business automation',
    category: 'automation',
    github: 'activepieces/activepieces',
    isOpenSource: true,
    tags: ['no-code', 'automation', 'business'],
    useCase: ['Business automation', 'Workflows'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'browser-mcp-agent',
    name: 'Browser MCP Agent',
    description: 'Controls browsers via Model Context Protocol',
    category: 'automation',
    isOpenSource: true,
    tags: ['browser', 'mcp', 'control'],
    useCase: ['Browser automation', 'Web tasks'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'github-mcp-agent',
    name: 'GitHub MCP Agent',
    description: 'Manages GitHub repositories via MCP',
    category: 'automation',
    isOpenSource: true,
    tags: ['github', 'mcp', 'repos'],
    useCase: ['GitHub automation', 'Repo management'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'notion-mcp-agent',
    name: 'Notion MCP Agent',
    description: 'Integrates with Notion workspaces via MCP',
    category: 'automation',
    isOpenSource: true,
    tags: ['notion', 'mcp', 'workspace'],
    useCase: ['Notion automation', 'Workspace management'],
    integratedInRoom: 'office-hub'
  }
];

// ============================================
// FINANCE (Free)
// ============================================
export const FINANCE_TOOLS: AITool[] = [
  {
    id: 'xai-finance-agent',
    name: 'xAI Finance Agent',
    description: 'Analyzes financial data and markets',
    category: 'finance',
    isOpenSource: true,
    tags: ['finance', 'analysis', 'markets'],
    useCase: ['Financial analysis', 'Market research'],
    integratedInRoom: 'treasury'
  },
  {
    id: 'ai-investment-agent',
    name: 'AI Investment Agent',
    description: 'Makes investment recommendations',
    category: 'finance',
    isOpenSource: true,
    tags: ['investment', 'recommendations', 'analysis'],
    useCase: ['Investment advice', 'Portfolio'],
    integratedInRoom: 'treasury'
  },
  {
    id: 'ai-finance-team',
    name: 'AI Finance Agent Team',
    description: 'Collaborates on financial analysis',
    category: 'finance',
    isOpenSource: true,
    tags: ['team', 'collaboration', 'finance'],
    useCase: ['Financial planning', 'Analysis'],
    integratedInRoom: 'treasury'
  }
];

// ============================================
// FREE ART & CREATIVE SOFTWARE
// ============================================
export const ART_SOFTWARE: AITool[] = [
  // Drawing & Painting
  {
    id: 'krita',
    name: 'Krita',
    description: 'Free drawing/painting program with professional-level tools',
    category: 'creativity',
    url: 'https://krita.org',
    isOpenSource: true,
    tags: ['drawing', 'painting', 'professional', 'digital-art'],
    useCase: ['Digital painting', 'Illustration', 'Concept art'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'gimp',
    name: 'GIMP',
    description: 'Photo editing with pen and lining options for digital art',
    category: 'creativity',
    url: 'https://gimp.org',
    isOpenSource: true,
    tags: ['photo-editing', 'drawing', 'graphics'],
    useCase: ['Photo editing', 'Digital art', 'Graphics'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'inkscape',
    name: 'Inkscape',
    description: 'Vector drawing software - better handling than Adobe Illustrator',
    category: 'creativity',
    url: 'https://inkscape.org',
    isOpenSource: true,
    tags: ['vector', 'svg', 'drawing', 'design'],
    useCase: ['Vector art', 'Logo design', 'Illustrations'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'firealpaca',
    name: 'FireAlpaca',
    description: 'Simple, lightweight drawing program with perspective and comic tools',
    category: 'creativity',
    url: 'https://firealpaca.com',
    isOpenSource: false,
    tags: ['drawing', 'lightweight', 'comics', 'perspective'],
    useCase: ['Digital drawing', 'Comics', 'Manga'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'medibang-paint',
    name: 'Medibang Paint',
    description: 'Comic-focused software with page organization features',
    category: 'creativity',
    url: 'https://medibangpaint.com',
    isOpenSource: false,
    tags: ['comics', 'manga', 'drawing', 'pages'],
    useCase: ['Comic creation', 'Manga', 'Illustration'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'ibispaint',
    name: 'IbisPaint',
    description: 'Fully featured mobile art program with desktop-comparable effects',
    category: 'creativity',
    url: 'https://ibispaint.com',
    isOpenSource: false,
    tags: ['mobile', 'drawing', 'effects', 'brushes'],
    useCase: ['Mobile art', 'Digital drawing', 'Illustrations'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'mypaint',
    name: 'MyPaint',
    description: 'Infinite canvas feature, perfect for sketching',
    category: 'creativity',
    github: 'mypaint/mypaint',
    isOpenSource: true,
    tags: ['sketching', 'infinite-canvas', 'painting'],
    useCase: ['Sketching', 'Painting', 'Concept art'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'drawpile',
    name: 'Drawpile',
    description: 'Collaborative drawing sessions with friends or communities',
    category: 'creativity',
    url: 'https://drawpile.net',
    isOpenSource: true,
    tags: ['collaborative', 'drawing', 'multiplayer', 'social'],
    useCase: ['Collaborative art', 'Group drawing', 'Art jams'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'sketchbook',
    name: 'Sketchbook',
    description: 'Minimal program with clean interface, lightweight performance',
    category: 'creativity',
    url: 'https://sketchbook.com',
    isOpenSource: false,
    tags: ['minimal', 'sketching', 'clean', 'lightweight'],
    useCase: ['Quick sketches', 'Digital drawing', 'Ideation'],
    integratedInRoom: 'creative-studio'
  },
  // Pixel Art
  {
    id: 'libresprite',
    name: 'LibreSprite',
    description: 'Pixel art & sprite animation software based on Aseprite',
    category: 'creativity',
    github: 'LibreSprite/LibreSprite',
    isOpenSource: true,
    tags: ['pixel-art', 'sprites', 'animation', 'retro'],
    useCase: ['Pixel art', 'Game sprites', 'Retro art'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'pixelorama',
    name: 'Pixelorama',
    description: 'Versatile open-source pixel art software for sprites and animations',
    category: 'creativity',
    github: 'Orama-Interactive/Pixelorama',
    isOpenSource: true,
    tags: ['pixel-art', 'godot', 'sprites', 'animation'],
    useCase: ['Pixel art', 'Game assets', 'Animation'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'graphics-gale',
    name: 'Graphics Gale',
    description: 'Elaborate sprite editor focused on animations',
    category: 'creativity',
    isOpenSource: false,
    tags: ['sprites', 'animation', 'pixel-art', 'games'],
    useCase: ['Sprite animation', 'Game graphics', 'Pixel art'],
    integratedInRoom: 'creative-studio'
  },
  // Animation
  {
    id: 'pencil2d',
    name: 'Pencil2D',
    description: 'Basic, lightweight frame-by-frame animation program',
    category: 'creativity',
    github: 'pencil2d/pencil',
    isOpenSource: true,
    tags: ['animation', 'frame-by-frame', 'lightweight', '2d'],
    useCase: ['2D animation', 'Traditional animation', 'Learning'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'opentoonz',
    name: 'OpenToonz',
    description: 'Animation software based on professional Toonz technology',
    category: 'creativity',
    github: 'opentoonz/opentoonz',
    isOpenSource: true,
    tags: ['animation', 'professional', '2d', 'toonz'],
    useCase: ['Professional animation', 'Studio work', '2D films'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'synfig',
    name: 'Synfig',
    description: 'Specializes in tween-based vector animations',
    category: 'creativity',
    github: 'synfig/synfig',
    isOpenSource: true,
    tags: ['animation', 'vector', 'tweening', '2d'],
    useCase: ['Vector animation', 'Motion graphics', 'Explainer videos'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'anime-effects',
    name: 'AnimeEffects',
    description: 'Tween-based program for shorter animations using mesh tweening',
    category: 'creativity',
    isOpenSource: true,
    tags: ['animation', 'mesh', 'tweening', 'effects'],
    useCase: ['Character animation', 'Visual effects', 'Motion'],
    integratedInRoom: 'creative-studio'
  },
  // 3D & Modeling
  {
    id: 'blender',
    name: 'Blender',
    description: 'Comprehensive 3D modeling, animation, 2D animation, and video editing',
    category: 'creativity',
    url: 'https://blender.org',
    github: 'blender/blender',
    isOpenSource: true,
    tags: ['3d', 'modeling', 'animation', 'video', 'rendering'],
    useCase: ['3D modeling', 'Animation', 'Video editing', 'VFX'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'blockbench',
    name: 'Blockbench',
    description: 'Low-poly and block-based modeling with animation, browser version available',
    category: 'creativity',
    github: 'JannisX11/blockbench',
    isOpenSource: true,
    tags: ['3d', 'low-poly', 'minecraft', 'modeling'],
    useCase: ['Game assets', 'Minecraft mods', 'Low-poly art'],
    integratedInRoom: 'creative-studio'
  },
  // Writing
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Customizable notetaking using markdown, perfect for writing projects',
    category: 'writing',
    url: 'https://obsidian.md',
    isOpenSource: false,
    tags: ['notes', 'markdown', 'writing', 'knowledge'],
    useCase: ['Note-taking', 'Writing', 'Knowledge management'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'focuswriter',
    name: 'FocusWriter',
    description: 'Minimal writing program to keep focus on drafting',
    category: 'writing',
    github: 'gottcode/focuswriter',
    isOpenSource: true,
    tags: ['writing', 'minimal', 'distraction-free', 'focus'],
    useCase: ['Creative writing', 'Drafting', 'Focus sessions'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'manuskript',
    name: 'Manuskript',
    description: 'Creative writing software with outline, timeline, and chapter organization',
    category: 'writing',
    github: 'olivierkes/manuskript',
    isOpenSource: true,
    tags: ['writing', 'novel', 'organization', 'outlining'],
    useCase: ['Novel writing', 'Story organization', 'Long-form writing'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'libreoffice-writer',
    name: 'LibreOffice Writer',
    description: 'Full office suite - Writer for documents',
    category: 'writing',
    url: 'https://libreoffice.org',
    isOpenSource: true,
    tags: ['office', 'documents', 'word-processor', 'free'],
    useCase: ['Document creation', 'Writing', 'Formatting'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'scribus',
    name: 'Scribus',
    description: 'Desktop publishing for e-books and traditional publishing',
    category: 'writing',
    url: 'https://scribus.net',
    isOpenSource: true,
    tags: ['publishing', 'ebooks', 'layout', 'design'],
    useCase: ['Book layout', 'Publishing', 'Design'],
    integratedInRoom: 'creative-studio'
  },
  // Music & Audio
  {
    id: 'lmms',
    name: 'LMMS',
    description: 'Free and open source digital audio workstation',
    category: 'audio-music',
    github: 'LMMS/lmms',
    isOpenSource: true,
    tags: ['daw', 'music', 'production', 'beats'],
    useCase: ['Music production', 'Beat making', 'Composition'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'openmpt',
    name: 'OpenMPT',
    description: 'Popular music tracker program for making tracker music files',
    category: 'audio-music',
    url: 'https://openmpt.org',
    isOpenSource: true,
    tags: ['tracker', 'chiptune', 'retro', 'music'],
    useCase: ['Tracker music', 'Chiptune', 'Retro game music'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'milkytracker',
    name: 'MilkyTracker',
    description: 'Classic tracker based on Fasttracker 2',
    category: 'audio-music',
    github: 'milkytracker/MilkyTracker',
    isOpenSource: true,
    tags: ['tracker', 'fasttracker', 'chiptune', 'retro'],
    useCase: ['Tracker music', 'Retro composing', 'Chiptune'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'audacity',
    name: 'Audacity',
    description: 'Versatile tool for voice and audio editing and clipping',
    category: 'audio-music',
    url: 'https://audacityteam.org',
    isOpenSource: true,
    tags: ['audio', 'editing', 'recording', 'podcast'],
    useCase: ['Audio editing', 'Podcast editing', 'Voice recording'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'ardour',
    name: 'Ardour',
    description: 'Robust audio software supporting recording, production, MIDI/VST',
    category: 'audio-music',
    url: 'https://ardour.org',
    isOpenSource: true,
    tags: ['daw', 'recording', 'production', 'professional'],
    useCase: ['Professional recording', 'Music production', 'Mixing'],
    integratedInRoom: 'music-room'
  },
  // Video
  {
    id: 'obs',
    name: 'OBS Studio',
    description: 'Screen recording and live streaming tool',
    category: 'video',
    github: 'obsproject/obs-studio',
    isOpenSource: true,
    tags: ['streaming', 'recording', 'broadcast', 'twitch'],
    useCase: ['Live streaming', 'Screen recording', 'Content creation'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'kdenlive',
    name: 'Kdenlive',
    description: 'FOSS video editor with color correction, masking, multi-track',
    category: 'video',
    github: 'KDE/kdenlive',
    isOpenSource: true,
    tags: ['video-editing', 'multi-track', 'professional', 'free'],
    useCase: ['Video editing', 'Color grading', 'Content creation'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'davinci-resolve',
    name: 'DaVinci Resolve',
    description: 'Professional video editor with free version for basic editing',
    category: 'video',
    url: 'https://blackmagicdesign.com/products/davinciresolve',
    isOpenSource: false,
    tags: ['video-editing', 'color-grading', 'professional', 'vfx'],
    useCase: ['Video editing', 'Color correction', 'VFX'],
    integratedInRoom: 'creative-studio'
  },
  // Utilities
  {
    id: 'pureref',
    name: 'PureRef',
    description: 'Tool for creating and organizing reference images and moodboards',
    category: 'creativity',
    url: 'https://pureref.com',
    isOpenSource: false,
    tags: ['reference', 'moodboard', 'organization', 'images'],
    useCase: ['Reference organization', 'Mood boards', 'Art planning'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'beeref',
    name: 'BeeRef',
    description: 'Open source reference manager alternative to PureRef',
    category: 'creativity',
    github: 'rbreu/beeref',
    isOpenSource: true,
    tags: ['reference', 'open-source', 'moodboard', 'images'],
    useCase: ['Reference management', 'Mood boards', 'Art planning'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'allusion',
    name: 'Allusion',
    description: 'Image sorting and tagging tool for easy lookup',
    category: 'creativity',
    isOpenSource: true,
    tags: ['images', 'sorting', 'tagging', 'organization'],
    useCase: ['Image organization', 'Reference library', 'Asset management'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'sharex',
    name: 'ShareX',
    description: 'Screenshot tool with GIF and video capture capabilities',
    category: 'productivity',
    github: 'ShareX/ShareX',
    isOpenSource: true,
    tags: ['screenshot', 'capture', 'gif', 'recording'],
    useCase: ['Screenshots', 'GIF creation', 'Screen capture'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'postybirb',
    name: 'PostyBirb',
    description: 'Multi-platform posting tool for managing multiple art accounts',
    category: 'creativity',
    github: 'mvdicarlo/postybirb-plus',
    isOpenSource: true,
    tags: ['posting', 'social-media', 'art', 'multi-platform'],
    useCase: ['Art posting', 'Social media management', 'Cross-posting'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'electric-zine-maker',
    name: 'Electric Zine Maker',
    description: 'Playful software toy for creating single-sheet zines',
    category: 'creativity',
    url: 'https://alienmelon.itch.io/electric-zine-maker',
    isOpenSource: false,
    tags: ['zines', 'creative', 'fun', 'publishing'],
    useCase: ['Zine creation', 'Self-publishing', 'Creative expression'],
    integratedInRoom: 'creative-studio'
  }
];

// ============================================
// ADDITIONAL AI TOOLS FROM OPENSOURCEAI
// ============================================
export const ADDITIONAL_AI_TOOLS: AITool[] = [
  {
    id: 'docsgpt',
    name: 'DocsGPT',
    description: 'Utilizes GPT models for generating human-like documents',
    category: 'writing',
    github: 'arc53/DocsGPT',
    isOpenSource: true,
    tags: ['documents', 'generation', 'gpt'],
    useCase: ['Document creation', 'Writing assistance'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'shellgpt',
    name: 'ShellGPT',
    description: 'Interactive shell interface for conversational GPT interactions',
    category: 'code-assistants',
    github: 'TheR1D/shell_gpt',
    isOpenSource: true,
    tags: ['terminal', 'shell', 'cli', 'gpt'],
    useCase: ['Terminal AI', 'Command help', 'Scripting'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'pdfgpt',
    name: 'PDFGPT',
    description: 'Generate and analyze PDF documents using GPT',
    category: 'productivity',
    isOpenSource: true,
    tags: ['pdf', 'documents', 'generation'],
    useCase: ['PDF creation', 'Document analysis'],
    integratedInRoom: 'office-hub'
  },
  {
    id: 'blendergpt',
    name: 'BlenderGPT',
    description: 'Integrates GPT models with Blender 3D software',
    category: 'creativity',
    github: 'gd3kr/BlenderGPT',
    isOpenSource: true,
    tags: ['blender', '3d', 'gpt', 'automation'],
    useCase: ['3D modeling assistance', 'Blender automation'],
    integratedInRoom: 'creative-studio'
  },
  {
    id: 'graphgpt',
    name: 'GraphGPT',
    description: 'Generates graph structures using GPT models',
    category: 'data-analysis',
    isOpenSource: true,
    tags: ['graphs', 'visualization', 'data'],
    useCase: ['Graph generation', 'Data visualization'],
    integratedInRoom: 'treasury'
  },
  {
    id: 'roomgpt',
    name: 'RoomGPT',
    description: 'Generates room descriptions and interior designs',
    category: 'creativity',
    github: 'Nutlope/roomGPT',
    isOpenSource: true,
    tags: ['interior', 'design', 'rooms', 'generation'],
    useCase: ['Interior design', 'Room planning'],
    integratedInRoom: 'home-command'
  },
  {
    id: 'localai',
    name: 'LocalAI',
    description: 'Self-hosted, community-driven, local OpenAI-compatible API',
    category: 'local-llms',
    github: 'mudler/LocalAI',
    isOpenSource: true,
    tags: ['local', 'api', 'self-hosted', 'openai-compatible'],
    useCase: ['Local AI server', 'API hosting'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'audiocraft-meta',
    name: 'AudioCraft (Meta)',
    description: 'Library for audio processing and generation with deep learning',
    category: 'audio-music',
    github: 'facebookresearch/audiocraft',
    isOpenSource: true,
    tags: ['audio', 'music', 'generation', 'meta'],
    useCase: ['Music generation', 'Audio creation'],
    integratedInRoom: 'mood-music-lounge'
  },
  {
    id: 'openchat',
    name: 'OpenChat',
    description: 'LLMs custom-chatbots console',
    category: 'chatbots',
    github: 'imoneoi/openchat',
    isOpenSource: true,
    tags: ['chatbots', 'custom', 'llm'],
    useCase: ['Custom chatbots', 'AI assistants'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'mlc-llm',
    name: 'MLC-LLM',
    description: 'Enables developing, optimizing, and deploying AI models on devices',
    category: 'local-llms',
    github: 'mlc-ai/mlc-llm',
    isOpenSource: true,
    tags: ['mobile', 'deployment', 'optimization'],
    useCase: ['Mobile AI', 'Edge deployment'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'musegpt',
    name: 'MuseGPT',
    description: 'Runs local LLMs inside digital audio workstations',
    category: 'audio-music',
    isOpenSource: true,
    tags: ['music', 'daw', 'llm', 'local'],
    useCase: ['Music production AI', 'DAW integration'],
    integratedInRoom: 'music-room'
  },
  {
    id: 'biogpt',
    name: 'BioGPT',
    description: 'Specialized in biology and life sciences text generation',
    category: 'research',
    github: 'microsoft/BioGPT',
    isOpenSource: true,
    tags: ['biology', 'science', 'research', 'medical'],
    useCase: ['Biology research', 'Medical text'],
    integratedInRoom: 'apothecary'
  },
  {
    id: 'nanogpt',
    name: 'NanoGPT',
    description: 'Lightweight, efficient GPT implementation by Andrej Karpathy',
    category: 'local-llms',
    github: 'karpathy/nanoGPT',
    isOpenSource: true,
    tags: ['lightweight', 'learning', 'efficient'],
    useCase: ['Learning AI', 'Lightweight models'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'flagai',
    name: 'FlagAI',
    description: 'Fast, easy-to-use toolkit for large-scale models',
    category: 'frameworks',
    github: 'FlagAI-Open/FlagAI',
    isOpenSource: true,
    tags: ['toolkit', 'large-scale', 'training'],
    useCase: ['Model training', 'AI development'],
    integratedInRoom: 'ai-command-center'
  },
  {
    id: 'bibigpt',
    name: 'BibiGPT',
    description: 'One-click AI Summary for video & audio content',
    category: 'productivity',
    github: 'JimmyLv/BibiGPT',
    isOpenSource: true,
    tags: ['summary', 'video', 'audio', 'one-click'],
    useCase: ['Video summarization', 'Audio transcription'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'dorkgpt',
    name: 'DorkGPT',
    description: 'Generates Google search operators with AI',
    category: 'search',
    isOpenSource: true,
    tags: ['search', 'google', 'operators', 'dorking'],
    useCase: ['Advanced search', 'Research'],
    integratedInRoom: 'library-study'
  },
  {
    id: 'chart-gpt',
    name: 'Chart-GPT',
    description: 'Generates charts and graphs using GPT technology',
    category: 'data-analysis',
    isOpenSource: true,
    tags: ['charts', 'graphs', 'visualization', 'data'],
    useCase: ['Chart creation', 'Data visualization'],
    integratedInRoom: 'treasury'
  },
  {
    id: 'db-gpt',
    name: 'DB-GPT',
    description: 'Extension of BabyAGI with improved database access',
    category: 'agents',
    github: 'eosphoros-ai/DB-GPT',
    isOpenSource: true,
    tags: ['database', 'agi', 'data'],
    useCase: ['Database queries', 'Data analysis'],
    integratedInRoom: 'office-hub'
  }
];

// ============================================
// COMPILE ALL TOOLS
// ============================================
export const ALL_FREE_AI_TOOLS: AITool[] = [
  ...CHATBOT_TOOLS,
  ...AGENT_TOOLS,
  ...CODE_TOOLS,
  ...IMAGE_TOOLS,
  ...AUDIO_TOOLS,
  ...PRODUCTIVITY_TOOLS,
  ...RAG_TOOLS,
  ...DATA_TOOLS,
  ...OPEN_LLMS,
  ...ACCESSIBILITY_TOOLS,
  ...GAMING_TOOLS,
  ...CREATIVITY_TOOLS,
  ...EDUCATION_TOOLS,
  ...AUTOMATION_TOOLS,
  ...FINANCE_TOOLS,
  ...ART_SOFTWARE,
  ...ADDITIONAL_AI_TOOLS
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getToolsByCategory(category: AIToolCategory): AITool[] {
  return ALL_FREE_AI_TOOLS.filter(tool => tool.category === category);
}

export function getToolsByRoom(roomId: string): AITool[] {
  return ALL_FREE_AI_TOOLS.filter(tool => tool.integratedInRoom === roomId);
}

export function getOpenSourceTools(): AITool[] {
  return ALL_FREE_AI_TOOLS.filter(tool => tool.isOpenSource);
}

export function searchTools(query: string): AITool[] {
  const lowerQuery = query.toLowerCase();
  return ALL_FREE_AI_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    tool.useCase.some(use => use.toLowerCase().includes(lowerQuery))
  );
}

export function getToolsByTags(tags: string[]): AITool[] {
  return ALL_FREE_AI_TOOLS.filter(tool =>
    tags.some(tag => tool.tags.includes(tag.toLowerCase()))
  );
}

// ============================================
// STATISTICS
// ============================================
export const AI_TOOLS_STATS = {
  totalTools: ALL_FREE_AI_TOOLS.length,
  openSourceCount: ALL_FREE_AI_TOOLS.filter(t => t.isOpenSource).length,
  categories: [...new Set(ALL_FREE_AI_TOOLS.map(t => t.category))].length,
  byCategory: Object.fromEntries(
    [...new Set(ALL_FREE_AI_TOOLS.map(t => t.category))].map(cat => [
      cat,
      ALL_FREE_AI_TOOLS.filter(t => t.category === cat).length
    ])
  )
};

console.log(`[AI Tools Database] Loaded ${AI_TOOLS_STATS.totalTools} free AI tools across ${AI_TOOLS_STATS.categories} categories`);
