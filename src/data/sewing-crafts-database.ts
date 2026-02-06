/**
 * Sewing & Crafts Database
 * =========================
 * Free sewing patterns, tutorials, and crafting resources
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SewingResource {
  id: string;
  name: string;
  url: string;
  category: SewingCategory;
  description: string;
  features: string[];
  icon: string;
  hasPatterns: boolean;
  hasTutorials: boolean;
  pricing: 'free' | 'freemium';
}

export interface SewingPattern {
  id: string;
  name: string;
  source: string;
  sourceUrl: string;
  category: PatternCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  icon: string;
}

export interface SewingSoftware {
  id: string;
  name: string;
  url: string;
  downloadUrl?: string;
  description: string;
  features: string[];
  icon: string;
  platforms: string[];
  isOpenSource: boolean;
  pricing: 'free' | 'freemium';
}

export type SewingCategory =
  | 'patterns'
  | 'tutorials'
  | 'community'
  | 'fabric'
  | 'software'
  | 'charity'
  | 'quilting'
  | 'embroidery'
  | 'fashion';

export type PatternCategory =
  | 'clothing'
  | 'bags'
  | 'quilts'
  | 'home-decor'
  | 'accessories'
  | 'kids'
  | 'costumes'
  | 'crafts';

// ============================================================================
// FREE SEWING PATTERN SITES
// ============================================================================

export const SEWING_RESOURCES: SewingResource[] = [
  {
    id: 'allfreesewing',
    name: 'AllFreeSewing',
    url: 'https://www.allfreesewing.com/',
    category: 'patterns',
    description: 'Thousands of free sewing patterns and tutorials',
    features: ['Free patterns', 'Video tutorials', 'Project ideas', 'Community'],
    icon: '🧵',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'sewcanshe',
    name: 'Sew Can She',
    url: 'https://sewcanshe.com/',
    category: 'patterns',
    description: 'Free sewing patterns, tutorials, and inspiration',
    features: ['Free patterns', 'Bag patterns', 'Quick projects', 'Tips'],
    icon: '👜',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'sosoeasy',
    name: 'So Sew Easy',
    url: 'https://so-sew-easy.com/free-sewing-patterns/',
    category: 'patterns',
    description: 'Free sewing patterns for bags, clothing, and accessories',
    features: ['PDF patterns', 'Step-by-step', 'All skill levels'],
    icon: '✂️',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'crazylittleprojects',
    name: 'Crazy Little Projects',
    url: 'https://crazylittleprojects.com/',
    category: 'patterns',
    description: 'Easy sewing projects and beginner-friendly patterns',
    features: ['Beginner patterns', 'Quick projects', 'Gift ideas'],
    icon: '🎀',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'moodfabrics',
    name: 'Mood Fabrics Patterns',
    url: 'https://blog.moodfabrics.com/category/free-sewing-patterns/',
    category: 'patterns',
    description: 'Free patterns from the famous Project Runway fabric store',
    features: ['Designer quality', 'Fashion patterns', 'PDF download'],
    icon: '👗',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'threadsmonthly',
    name: 'Threads Monthly',
    url: 'https://threadsmonthly.com/free-sewing-patterns/',
    category: 'patterns',
    description: 'Curated collection of free sewing patterns',
    features: ['Pattern reviews', 'Recommendations', 'Tips'],
    icon: '📰',
    hasPatterns: true,
    hasTutorials: false,
    pricing: 'free'
  },
  {
    id: 'sewmag',
    name: 'Sew Magazine',
    url: 'https://www.sewmag.co.uk/',
    category: 'patterns',
    description: 'UK sewing magazine with 100+ free patterns',
    features: ['100+ free patterns', 'Magazine quality', 'All categories'],
    icon: '📖',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'freemium'
  },
  {
    id: 'bernina',
    name: 'BERNINA Blog',
    url: 'https://blog.bernina.com/en/tag/free-pattern/',
    category: 'patterns',
    description: 'Free patterns from BERNINA sewing machines',
    features: ['Quality patterns', 'Tips', 'Inspiration'],
    icon: '🪡',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'purlsoho',
    name: 'Purl Soho',
    url: 'https://www.purlsoho.com/create/tag/free-sewing-pattern/',
    category: 'patterns',
    description: 'Beautiful free sewing and craft patterns',
    features: ['High quality', 'Modern designs', 'Detailed instructions'],
    icon: '🧶',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'freesewing',
    name: 'FreeSewing',
    url: 'https://freesewing.org/',
    category: 'patterns',
    description: 'Open source sewing patterns generated to your measurements',
    features: ['Custom fit', 'Open source', 'Made-to-measure', 'Many patterns'],
    icon: '📐',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'robertkaufman',
    name: 'Robert Kaufman Patterns',
    url: 'https://www.robertkaufman.com/quilting/quilts_patterns/',
    category: 'quilting',
    description: 'Free quilting patterns from Robert Kaufman fabrics',
    features: ['Quilt patterns', 'Project ideas', 'Quality fabrics'],
    icon: '🎨',
    hasPatterns: true,
    hasTutorials: false,
    pricing: 'free'
  },
  {
    id: 'binkypatrol',
    name: 'Binky Patrol Patterns',
    url: 'https://binkypatrol.org/patterns/free-patterns-from-the-robert-kaufman-site/',
    category: 'charity',
    description: 'Free patterns for charity blanket projects',
    features: ['Charity sewing', 'Blanket patterns', 'Community'],
    icon: '💝',
    hasPatterns: true,
    hasTutorials: false,
    pricing: 'free'
  },
  {
    id: 'stitchinghearts',
    name: 'Stitching Hearts',
    url: 'https://www.stitchingheartsww.org/',
    category: 'charity',
    description: 'Charity sewing organization and patterns',
    features: ['Charity projects', 'Community', 'Free patterns'],
    icon: '❤️',
    hasPatterns: true,
    hasTutorials: false,
    pricing: 'free'
  },
  {
    id: 'sewdaily',
    name: 'Sew Daily',
    url: 'https://www.sewdaily.com/',
    category: 'tutorials',
    description: 'Sewing tutorials, patterns, and resources',
    features: ['Video tutorials', 'Beginner guides', 'Free ebooks'],
    icon: '📚',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'freemium'
  },
  {
    id: 'sewingdirectory',
    name: 'The Sewing Directory',
    url: 'https://www.thesewingdirectory.co.uk/free-projects/',
    category: 'patterns',
    description: 'UK sewing directory with free projects',
    features: ['Project directory', 'Tutorials', 'Resources'],
    icon: '🗂️',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'sewingorg',
    name: 'Sewing.org',
    url: 'https://www.sewing.org/',
    category: 'tutorials',
    description: 'American Sewing Guild educational resources',
    features: ['Educational', 'Tutorials', 'Community'],
    icon: '🎓',
    hasPatterns: false,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'burdastyle',
    name: 'BurdaStyle',
    url: 'https://www.burdastyle.com/sewing-patterns/free-sewing-patterns.html',
    category: 'patterns',
    description: 'Famous fashion patterns with free options',
    features: ['Fashion patterns', 'Professional quality', 'Runway styles'],
    icon: '👔',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'freemium'
  },
  {
    id: 'closetcore',
    name: 'Closet Core Patterns',
    url: 'https://blog.closetcorepatterns.com/category/sewing-help-how-tos/free-patterns-resources/',
    category: 'patterns',
    description: 'Modern indie pattern maker with free resources',
    features: ['Modern patterns', 'Detailed tutorials', 'Size inclusive'],
    icon: '✨',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'freemium'
  },
  {
    id: 'peppermint',
    name: 'Peppermint Sewing School',
    url: 'https://peppermintmag.com/sewing-school/',
    category: 'tutorials',
    description: 'Sustainable sewing tutorials and patterns',
    features: ['Eco-friendly', 'Beginner-friendly', 'Free patterns'],
    icon: '🌿',
    hasPatterns: true,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'socialfabric',
    name: 'The Social Fabric',
    url: 'https://www.thesocialfabric.net/blog/favourite-resources',
    category: 'community',
    description: 'Sewing community and resource sharing',
    features: ['Community', 'Resources', 'Inspiration'],
    icon: '👥',
    hasPatterns: false,
    hasTutorials: true,
    pricing: 'free'
  },
  {
    id: 'domestika-sewing',
    name: 'Domestika Sewing',
    url: 'https://www.domestika.org/en/blog/12491-14-websites-to-download-free-sewing-patterns',
    category: 'patterns',
    description: 'Curated list of free pattern websites',
    features: ['Pattern directory', 'Recommendations', 'Quality curated'],
    icon: '📋',
    hasPatterns: false,
    hasTutorials: false,
    pricing: 'free'
  }
];

// ============================================================================
// SEWING SOFTWARE
// ============================================================================

export const SEWING_SOFTWARE: SewingSoftware[] = [
  {
    id: 'freesewing-software',
    name: 'FreeSewing',
    url: 'https://freesewing.org/',
    description: 'Open source, made-to-measure sewing patterns',
    features: ['Custom measurements', 'Open source', 'Pattern generator', 'JavaScript'],
    icon: '📐',
    platforms: ['web'],
    isOpenSource: true,
    pricing: 'free'
  },
  {
    id: 'seamly',
    name: 'Seamly2D',
    url: 'https://seamly.io/',
    description: 'Open source pattern design software',
    features: ['Pattern drafting', 'Measurements', 'Export to print', 'Cross-platform'],
    icon: '✏️',
    platforms: ['windows', 'mac', 'linux'],
    isOpenSource: true,
    pricing: 'free'
  },
  {
    id: 'seamscape',
    name: 'Seamscape',
    url: 'https://seamscape.com/',
    description: 'Pattern drafting and design tool',
    features: ['Pattern design', 'Custom sizing', 'Digital patterns'],
    icon: '🗺️',
    platforms: ['web'],
    isOpenSource: false,
    pricing: 'freemium'
  },
  {
    id: 'sewist',
    name: 'Sewist',
    url: 'https://www.sewist.com/?lang=en',
    description: 'Made-to-measure pattern generator',
    features: ['Custom patterns', 'Multiple styles', 'PDF download'],
    icon: '👗',
    platforms: ['web'],
    isOpenSource: false,
    pricing: 'freemium'
  },
  {
    id: 'wildginger',
    name: 'Wild Ginger',
    url: 'https://www.wildginger.com/products/default.htm',
    description: 'Pattern making software suite',
    features: ['Pattern making', 'Grading', 'Drafting'],
    icon: '🌶️',
    platforms: ['windows'],
    isOpenSource: false,
    pricing: 'freemium'
  },
  {
    id: 'pdfstitcher',
    name: 'PDFStitcher',
    url: 'https://sourceforge.net/projects/pdfsticher.mirror/',
    description: 'Combine PDF pattern pages for large format printing',
    features: ['PDF merging', 'Tile patterns', 'Print shop ready'],
    icon: '📄',
    platforms: ['windows', 'mac', 'linux'],
    isOpenSource: true,
    pricing: 'free'
  },
  {
    id: 'inkstitch',
    name: 'Ink/Stitch',
    url: 'https://inkstitch.org/',
    description: 'Open source machine embroidery design',
    features: ['Embroidery design', 'Inkscape plugin', 'Multiple formats'],
    icon: '🪡',
    platforms: ['windows', 'mac', 'linux'],
    isOpenSource: true,
    pricing: 'free'
  },
  {
    id: 'threadloop',
    name: 'ThreadLoop',
    url: 'https://threadloop.app/',
    description: 'Sewing project management app',
    features: ['Project tracking', 'Pattern library', 'Fabric inventory'],
    icon: '📱',
    platforms: ['ios', 'android'],
    isOpenSource: false,
    pricing: 'freemium'
  },
  {
    id: 'inkscape-patterns',
    name: 'Inkscape for Patterns',
    url: 'https://sewtobusiness.thinkific.com/courses/pattern-drafting-intro-inkscape',
    description: 'Learn pattern drafting with Inkscape',
    features: ['Free software', 'Vector patterns', 'Course included'],
    icon: '🎨',
    platforms: ['windows', 'mac', 'linux'],
    isOpenSource: true,
    pricing: 'free'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getResourcesByCategory = (category: SewingCategory): SewingResource[] => {
  return SEWING_RESOURCES.filter(r => r.category === category);
};

export const getPatternSites = (): SewingResource[] => {
  return SEWING_RESOURCES.filter(r => r.hasPatterns);
};

export const getTutorialSites = (): SewingResource[] => {
  return SEWING_RESOURCES.filter(r => r.hasTutorials);
};

export const getFreeResources = (): SewingResource[] => {
  return SEWING_RESOURCES.filter(r => r.pricing === 'free');
};

export const getOpenSourceSoftware = (): SewingSoftware[] => {
  return SEWING_SOFTWARE.filter(s => s.isOpenSource);
};

export const getSewingStats = () => ({
  totalResources: SEWING_RESOURCES.length,
  patternSites: getPatternSites().length,
  tutorialSites: getTutorialSites().length,
  freeSoftware: getOpenSourceSoftware().length,
  totalSoftware: SEWING_SOFTWARE.length
});
