/**
 * Art & Creative Tools Database
 * ==============================
 * Free art software, drawing apps, and learning resources
 * All tools are FREE or have free tiers
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CreativeTool {
  id: string;
  name: string;
  category: CreativeCategory;
  subcategory?: string;
  description: string;
  url: string;
  downloadUrl?: string;
  icon: string;
  features: string[];
  platforms: ('windows' | 'mac' | 'linux' | 'web' | 'ios' | 'android')[];
  pricing: 'free' | 'freemium' | 'free-tier';
  rating?: number;
  isOpenSource?: boolean;
}

export interface LearningResource {
  id: string;
  name: string;
  category: LearningCategory;
  description: string;
  url: string;
  icon: string;
  contentType: ('video' | 'article' | 'course' | 'tutorial' | 'community')[];
  topics: string[];
  pricing: 'free' | 'freemium' | 'free-tier';
  rating?: number;
}

export type CreativeCategory =
  | 'digital-painting'
  | 'vector-graphics'
  | 'photo-editing'
  | 'drawing'
  | '3d-modeling'
  | 'animation'
  | 'graphic-design'
  | 'ui-ux'
  | 'video-editing';

export type LearningCategory =
  | 'drawing-fundamentals'
  | 'digital-art'
  | 'traditional-art'
  | 'animation'
  | 'design'
  | 'art-history'
  | 'tutorials'
  | 'community';

// ============================================================================
// FREE ART SOFTWARE
// ============================================================================

export const DIGITAL_PAINTING_APPS: CreativeTool[] = [
  {
    id: 'krita',
    name: 'Krita',
    category: 'digital-painting',
    description: 'Professional FREE digital painting app. Industry-standard for concept art, illustration, and comics.',
    url: 'https://krita.org/',
    downloadUrl: 'https://krita.org/en/download/',
    icon: '🎨',
    features: [
      '100+ professional brushes',
      'Animation tools',
      'Layer management',
      'HDR painting',
      'PSD support',
      'Customizable UI',
      'Brush stabilizer',
      'Vector tools'
    ],
    platforms: ['windows', 'mac', 'linux'],
    pricing: 'free',
    rating: 4.8,
    isOpenSource: true
  },
  {
    id: 'gimp',
    name: 'GIMP',
    category: 'photo-editing',
    subcategory: 'digital-painting',
    description: 'GNU Image Manipulation Program - powerful free alternative to Photoshop',
    url: 'https://www.gimp.org/',
    downloadUrl: 'https://www.gimp.org/downloads/',
    icon: '🖼️',
    features: [
      'Photo retouching',
      'Image composition',
      'Customizable interface',
      'Extensive plugin support',
      'Batch processing',
      'Format support'
    ],
    platforms: ['windows', 'mac', 'linux'],
    pricing: 'free',
    rating: 4.5,
    isOpenSource: true
  },
  {
    id: 'medibang-paint',
    name: 'MediBang Paint',
    category: 'digital-painting',
    description: 'Free manga and comic creation tool with cloud features',
    url: 'https://medibangpaint.com/',
    downloadUrl: 'https://medibangpaint.com/en/app-download/',
    icon: '📱',
    features: [
      '800+ free tones/backgrounds',
      'Comic panel tools',
      'Cloud storage',
      'Cross-platform sync',
      '50+ free brushes',
      'Manga fonts'
    ],
    platforms: ['windows', 'mac', 'ios', 'android'],
    pricing: 'free',
    rating: 4.6
  },
  {
    id: 'firealpaca',
    name: 'FireAlpaca',
    category: 'digital-painting',
    description: 'Lightweight, easy-to-use painting software',
    url: 'https://firealpaca.com/',
    downloadUrl: 'https://firealpaca.com/download/',
    icon: '🦙',
    features: [
      'Simple interface',
      'Brush stabilizer',
      'Layer support',
      '3D perspective tools',
      'Comic tools',
      'Low system requirements'
    ],
    platforms: ['windows', 'mac'],
    pricing: 'free',
    rating: 4.4
  },
  {
    id: 'ibispaint',
    name: 'ibisPaint X',
    category: 'digital-painting',
    description: 'Popular mobile drawing app with desktop version',
    url: 'https://ibispaint.com/',
    downloadUrl: 'https://ibispaint.com/download.jsp',
    icon: '✏️',
    features: [
      '15,000+ brushes',
      '2,800+ materials',
      'Recording feature',
      'Stabilizer',
      'Clipping masks',
      'Font library'
    ],
    platforms: ['windows', 'ios', 'android'],
    pricing: 'freemium',
    rating: 4.7
  },
  {
    id: 'autodesk-sketchbook',
    name: 'Autodesk Sketchbook',
    category: 'drawing',
    description: 'Professional-grade drawing app, completely free',
    url: 'https://www.sketchbook.com/',
    downloadUrl: 'https://www.sketchbook.com/apps',
    icon: '📝',
    features: [
      'Pro-level brushes',
      'Natural drawing feel',
      '140+ brushes',
      'Perspective guides',
      'Blend modes',
      'PSD support'
    ],
    platforms: ['windows', 'mac', 'ios', 'android'],
    pricing: 'free',
    rating: 4.7
  },
  {
    id: 'adobe-fresco',
    name: 'Adobe Fresco',
    category: 'digital-painting',
    description: 'Adobe\'s free drawing app with live brushes',
    url: 'https://www.adobe.com/products/fresco.html',
    downloadUrl: 'https://www.adobe.com/products/fresco.html',
    icon: '🎭',
    features: [
      'Live brushes (watercolor, oil)',
      'Vector brushes',
      'Pixel brushes',
      'Cloud sync',
      'PS brush support'
    ],
    platforms: ['windows', 'ios'],
    pricing: 'freemium',
    rating: 4.5
  }
];

export const VECTOR_GRAPHICS_APPS: CreativeTool[] = [
  {
    id: 'inkscape',
    name: 'Inkscape',
    category: 'vector-graphics',
    description: 'Professional vector graphics editor - free Illustrator alternative',
    url: 'https://inkscape.org/',
    downloadUrl: 'https://inkscape.org/release/',
    icon: '✒️',
    features: [
      'SVG native format',
      'Bezier & spiro curves',
      'Text on path',
      'Clone objects',
      'Extensions support',
      'XML editor'
    ],
    platforms: ['windows', 'mac', 'linux'],
    pricing: 'free',
    rating: 4.6,
    isOpenSource: true
  },
  {
    id: 'gravit-designer',
    name: 'Gravit Designer',
    category: 'vector-graphics',
    description: 'Cross-platform vector design app with free tier',
    url: 'https://www.designer.io/',
    downloadUrl: 'https://www.designer.io/en/download/',
    icon: '🔷',
    features: [
      'Vector illustration',
      'UI/UX design',
      'Presentation design',
      'Cloud storage',
      'Offline mode'
    ],
    platforms: ['windows', 'mac', 'linux', 'web'],
    pricing: 'freemium',
    rating: 4.4
  },
  {
    id: 'vectr',
    name: 'Vectr',
    category: 'vector-graphics',
    description: 'Simple, free vector graphics software',
    url: 'https://vectr.com/',
    icon: '📐',
    features: [
      'Real-time collaboration',
      'Live sharing',
      'Cross-platform',
      'Simple interface',
      'Export to SVG/PNG'
    ],
    platforms: ['windows', 'mac', 'linux', 'web'],
    pricing: 'free',
    rating: 4.2
  }
];

export const DESIGN_APPS: CreativeTool[] = [
  {
    id: 'figma',
    name: 'Figma',
    category: 'ui-ux',
    description: 'Collaborative interface design tool with generous free tier',
    url: 'https://www.figma.com/',
    icon: '🎯',
    features: [
      'Real-time collaboration',
      'Prototyping',
      'Component system',
      'Auto layout',
      'Design systems',
      'Plugins'
    ],
    platforms: ['web', 'windows', 'mac'],
    pricing: 'freemium',
    rating: 4.9
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'graphic-design',
    description: 'Easy-to-use design platform with free templates',
    url: 'https://www.canva.com/',
    icon: '🖌️',
    features: [
      'Thousands of templates',
      'Drag-and-drop editor',
      'Brand kit',
      'Team collaboration',
      'Social media sizing'
    ],
    platforms: ['web', 'ios', 'android'],
    pricing: 'freemium',
    rating: 4.7
  },
  {
    id: 'photopea',
    name: 'Photopea',
    category: 'photo-editing',
    description: 'Free online Photoshop alternative - works in browser',
    url: 'https://www.photopea.com/',
    icon: '🌐',
    features: [
      'PSD support',
      'Layer styles',
      'Smart objects',
      'Brush tools',
      'Export to multiple formats',
      'No download needed'
    ],
    platforms: ['web'],
    pricing: 'free',
    rating: 4.8
  },
  {
    id: 'pixlr',
    name: 'Pixlr',
    category: 'photo-editing',
    description: 'Online photo editor with AI tools',
    url: 'https://pixlr.com/',
    icon: '📷',
    features: [
      'AI-powered tools',
      'Layer support',
      'Effects & overlays',
      'Collage maker',
      'Template library'
    ],
    platforms: ['web', 'ios', 'android'],
    pricing: 'freemium',
    rating: 4.5
  }
];

export const THREE_D_APPS: CreativeTool[] = [
  {
    id: 'blender',
    name: 'Blender',
    category: '3d-modeling',
    description: 'Industry-standard free 3D creation suite',
    url: 'https://www.blender.org/',
    downloadUrl: 'https://www.blender.org/download/',
    icon: '🧊',
    features: [
      '3D modeling',
      'Animation',
      'Rendering',
      'Video editing',
      'Sculpting',
      'VFX',
      'Game creation',
      'Python scripting'
    ],
    platforms: ['windows', 'mac', 'linux'],
    pricing: 'free',
    rating: 4.9,
    isOpenSource: true
  },
  {
    id: 'sculptris',
    name: 'Sculptris',
    category: '3d-modeling',
    subcategory: 'sculpting',
    description: 'Free 3D sculpting software for beginners',
    url: 'https://www.sculpteo.com/en/glossary/sculptris-definition/',
    icon: '🗿',
    features: [
      'Intuitive sculpting',
      'Dynamic tessellation',
      'Paint directly on model',
      'Easy to learn'
    ],
    platforms: ['windows', 'mac'],
    pricing: 'free',
    rating: 4.3
  }
];

export const ANIMATION_APPS: CreativeTool[] = [
  {
    id: 'opentoonz',
    name: 'OpenToonz',
    category: 'animation',
    description: 'Professional 2D animation software used by Studio Ghibli',
    url: 'https://opentoonz.github.io/',
    downloadUrl: 'https://opentoonz.github.io/e/download/opentoonz.html',
    icon: '🎬',
    features: [
      'Traditional animation',
      'Scanning tools',
      'Effects',
      'Compositing',
      'SDK for plugins'
    ],
    platforms: ['windows', 'mac', 'linux'],
    pricing: 'free',
    rating: 4.4,
    isOpenSource: true
  },
  {
    id: 'pencil2d',
    name: 'Pencil2D',
    category: 'animation',
    description: 'Simple, intuitive 2D hand-drawn animation',
    url: 'https://www.pencil2d.org/',
    downloadUrl: 'https://www.pencil2d.org/download/',
    icon: '✏️',
    features: [
      'Bitmap & vector layers',
      'Simple timeline',
      'Onion skinning',
      'Cross-platform'
    ],
    platforms: ['windows', 'mac', 'linux'],
    pricing: 'free',
    rating: 4.2,
    isOpenSource: true
  },
  {
    id: 'synfig',
    name: 'Synfig Studio',
    category: 'animation',
    description: 'Vector-based 2D animation software',
    url: 'https://www.synfig.org/',
    downloadUrl: 'https://www.synfig.org/download/',
    icon: '🎞️',
    features: [
      'Vector tweening',
      'Bone system',
      'Advanced controls',
      'Filters & effects'
    ],
    platforms: ['windows', 'mac', 'linux'],
    pricing: 'free',
    rating: 4.1,
    isOpenSource: true
  }
];

// ============================================================================
// LEARNING RESOURCES
// ============================================================================

export const DRAWING_FUNDAMENTALS: LearningResource[] = [
  {
    id: 'ctrlpaint',
    name: 'Ctrl+Paint',
    category: 'drawing-fundamentals',
    description: 'Free video library for digital painting fundamentals',
    url: 'https://www.ctrlpaint.com/',
    icon: '🎓',
    contentType: ['video', 'tutorial'],
    topics: ['digital painting basics', 'photoshop', 'fundamentals', 'workflow'],
    pricing: 'free',
    rating: 4.9
  },
  {
    id: 'drawabox',
    name: 'Drawabox',
    category: 'drawing-fundamentals',
    description: 'Free structured drawing course - fundamentals focus',
    url: 'https://drawabox.com/',
    icon: '📦',
    contentType: ['article', 'tutorial', 'course'],
    topics: ['line work', 'boxes', 'perspective', 'construction'],
    pricing: 'free',
    rating: 4.8
  },
  {
    id: 'proko',
    name: 'Proko',
    category: 'drawing-fundamentals',
    description: 'Professional art education - many free tutorials',
    url: 'https://www.proko.com/',
    icon: '👤',
    contentType: ['video', 'course', 'tutorial'],
    topics: ['anatomy', 'figure drawing', 'portrait', 'gesture'],
    pricing: 'freemium',
    rating: 4.9
  },
  {
    id: 'virtual-instructor',
    name: 'The Virtual Instructor',
    category: 'drawing-fundamentals',
    description: 'Free drawing and painting lessons',
    url: 'https://thevirtualinstructor.com/',
    icon: '🖊️',
    contentType: ['video', 'article', 'tutorial'],
    topics: ['drawing', 'painting', 'colored pencil', 'techniques'],
    pricing: 'freemium',
    rating: 4.6
  },
  {
    id: 'artists-network',
    name: 'Artists Network',
    category: 'traditional-art',
    description: 'Free art tutorials and articles',
    url: 'https://www.artistsnetwork.com/',
    icon: '🎨',
    contentType: ['article', 'tutorial', 'community'],
    topics: ['painting', 'drawing', 'mixed media', 'art business'],
    pricing: 'freemium',
    rating: 4.5
  }
];

export const DIGITAL_ART_LEARNING: LearningResource[] = [
  {
    id: 'krita-tutorials',
    name: 'Krita Tutorials',
    category: 'digital-art',
    description: 'Official Krita documentation and tutorials',
    url: 'https://docs.krita.org/en/tutorials.html',
    icon: '📚',
    contentType: ['article', 'tutorial'],
    topics: ['krita', 'digital painting', 'brushes', 'techniques'],
    pricing: 'free',
    rating: 4.7
  },
  {
    id: 'davidrevoy',
    name: 'David Revoy Blog',
    category: 'digital-art',
    description: 'Free tutorials from Pepper&Carrot creator',
    url: 'https://www.davidrevoy.com/',
    icon: '🐉',
    contentType: ['article', 'tutorial'],
    topics: ['krita', 'comic creation', 'open source art'],
    pricing: 'free',
    rating: 4.8
  },
  {
    id: 'concept-art-empire',
    name: 'Concept Art Empire',
    category: 'digital-art',
    description: 'Free concept art tutorials and resources',
    url: 'https://conceptartempire.com/',
    icon: '🏰',
    contentType: ['article', 'tutorial'],
    topics: ['concept art', 'character design', 'environment design'],
    pricing: 'free',
    rating: 4.5
  }
];

export const VIDEO_COURSES: LearningResource[] = [
  {
    id: 'skillshare',
    name: 'Skillshare',
    category: 'tutorials',
    description: 'Online learning platform - free trial available',
    url: 'https://www.skillshare.com/',
    icon: '🎓',
    contentType: ['video', 'course'],
    topics: ['illustration', 'design', 'animation', 'photography'],
    pricing: 'freemium',
    rating: 4.6
  },
  {
    id: 'domestika',
    name: 'Domestika',
    category: 'tutorials',
    description: 'Creative courses from professionals',
    url: 'https://www.domestika.org/',
    icon: '🎬',
    contentType: ['video', 'course'],
    topics: ['illustration', 'design', 'crafts', 'marketing'],
    pricing: 'freemium',
    rating: 4.7
  },
  {
    id: 'creativebug',
    name: 'Creativebug',
    category: 'tutorials',
    description: 'Art and craft video classes',
    url: 'https://www.creativebug.com/',
    icon: '🦋',
    contentType: ['video', 'course'],
    topics: ['crafts', 'art', 'sewing', 'painting'],
    pricing: 'freemium',
    rating: 4.5
  }
];

export const COMMUNITY_RESOURCES: LearningResource[] = [
  {
    id: 'deviantart',
    name: 'DeviantArt',
    category: 'community',
    description: 'Largest art community - tutorials and resources',
    url: 'https://www.deviantart.com/',
    icon: '🎭',
    contentType: ['community', 'tutorial'],
    topics: ['all art styles', 'tutorials', 'resources', 'feedback'],
    pricing: 'freemium',
    rating: 4.4
  },
  {
    id: 'artstation',
    name: 'ArtStation Learning',
    category: 'digital-art',
    description: 'Professional art community with tutorials',
    url: 'https://www.artstation.com/learning',
    icon: '🖼️',
    contentType: ['video', 'course', 'community'],
    topics: ['concept art', 'game art', '3D', 'illustration'],
    pricing: 'freemium',
    rating: 4.8
  },
  {
    id: 'reddit-learnart',
    name: 'r/learnart',
    category: 'community',
    description: 'Reddit community for learning art',
    url: 'https://www.reddit.com/r/learnart/',
    icon: '📱',
    contentType: ['community', 'tutorial'],
    topics: ['feedback', 'resources', 'motivation', 'tips'],
    pricing: 'free',
    rating: 4.5
  }
];

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

export const ALL_CREATIVE_TOOLS: CreativeTool[] = [
  ...DIGITAL_PAINTING_APPS,
  ...VECTOR_GRAPHICS_APPS,
  ...DESIGN_APPS,
  ...THREE_D_APPS,
  ...ANIMATION_APPS
];

export const ALL_LEARNING_RESOURCES: LearningResource[] = [
  ...DRAWING_FUNDAMENTALS,
  ...DIGITAL_ART_LEARNING,
  ...VIDEO_COURSES,
  ...COMMUNITY_RESOURCES
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getToolsByCategory = (category: CreativeCategory): CreativeTool[] => {
  return ALL_CREATIVE_TOOLS.filter(tool => tool.category === category);
};

export const getOpenSourceTools = (): CreativeTool[] => {
  return ALL_CREATIVE_TOOLS.filter(tool => tool.isOpenSource);
};

export const getWebBasedTools = (): CreativeTool[] => {
  return ALL_CREATIVE_TOOLS.filter(tool => tool.platforms.includes('web'));
};

export const getLearningByCategory = (category: LearningCategory): LearningResource[] => {
  return ALL_LEARNING_RESOURCES.filter(resource => resource.category === category);
};

export const getFreeResources = (): LearningResource[] => {
  return ALL_LEARNING_RESOURCES.filter(resource => resource.pricing === 'free');
};

export const getArtStudioStats = () => ({
  totalTools: ALL_CREATIVE_TOOLS.length,
  totalResources: ALL_LEARNING_RESOURCES.length,
  openSourceTools: getOpenSourceTools().length,
  freeResources: getFreeResources().length,
  categories: {
    painting: DIGITAL_PAINTING_APPS.length,
    vector: VECTOR_GRAPHICS_APPS.length,
    design: DESIGN_APPS.length,
    threeD: THREE_D_APPS.length,
    animation: ANIMATION_APPS.length
  }
});
