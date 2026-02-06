/**
 * COMPREHENSIVE FASHION, TEXTILES & SEWING DATABASE
 * ===================================================
 * Fashion styles, sewing techniques, fabric guides, pattern making
 * For Sydney's AI Teacher integration
 */

// ===== FASHION STYLES DATABASE =====
export interface FashionStyle {
  id: string;
  name: string;
  description: string;
  era?: string;
  characteristics: string[];
  keyPieces: string[];
  colors: string[];
  accessories: string[];
  icons: string[];
  occasions: string[];
  tags: string[];
}

export const FASHION_STYLES: FashionStyle[] = [
  {
    id: 'style-001',
    name: 'Gothic',
    description: 'Dark, romantic aesthetic inspired by Victorian era and subculture',
    era: '1980s-present',
    characteristics: ['Dark colors', 'Victorian influences', 'Dramatic silhouettes', 'Romantic elements', 'Lace and velvet'],
    keyPieces: ['Black dresses', 'Corsets', 'Platform boots', 'Long coats', 'Lace tops', 'Velvet pieces'],
    colors: ['Black', 'Deep purple', 'Burgundy', 'Blood red', 'Silver'],
    accessories: ['Silver jewelry', 'Chokers', 'Crosses', 'Cameos', 'Dramatic makeup'],
    icons: ['Siouxsie Sioux', 'Robert Smith', 'Morticia Addams'],
    occasions: ['Concerts', 'Clubs', 'Casual', 'Formal goth events'],
    tags: ['goth', 'dark', 'romantic', 'subculture']
  },
  {
    id: 'style-002',
    name: 'Cottagecore',
    description: 'Romanticized rural life aesthetic with vintage, pastoral elements',
    era: '2010s-present',
    characteristics: ['Floral prints', 'Flowing fabrics', 'Natural materials', 'Vintage silhouettes', 'Handmade elements'],
    keyPieces: ['Flowy dresses', 'Puff sleeves', 'Aprons', 'Straw hats', 'Linen pieces', 'Peter pan collars'],
    colors: ['Cream', 'Sage green', 'Dusty rose', 'Lavender', 'Brown', 'White'],
    accessories: ['Wicker baskets', 'Hair ribbons', 'Pressed flowers', 'Vintage brooches'],
    icons: ['Florence Welch', 'Orla Kiely designs'],
    occasions: ['Casual', 'Picnics', 'Garden parties', 'Daily wear'],
    tags: ['romantic', 'vintage', 'nature', 'cozy']
  },
  {
    id: 'style-003',
    name: 'Streetwear',
    description: 'Casual, urban style rooted in skateboarding, hip-hop, and youth culture',
    era: '1990s-present',
    characteristics: ['Oversized fits', 'Graphic prints', 'Sneaker culture', 'Brand logos', 'Comfortable'],
    keyPieces: ['Hoodies', 'Graphic tees', 'Sneakers', 'Joggers', 'Bomber jackets', 'Dad caps'],
    colors: ['Black', 'White', 'Earth tones', 'Bold accent colors'],
    accessories: ['Sneakers', 'Crossbody bags', 'Chains', 'Bucket hats', 'Sunglasses'],
    icons: ['Virgil Abloh', 'ASAP Rocky', 'Rihanna'],
    occasions: ['Casual', 'Concerts', 'Urban settings'],
    tags: ['urban', 'casual', 'comfortable', 'youth']
  },
  {
    id: 'style-004',
    name: 'Minimalist',
    description: 'Clean, simple aesthetic focusing on quality and essentials',
    era: '1990s-present',
    characteristics: ['Clean lines', 'Neutral colors', 'Quality fabrics', 'Simple silhouettes', 'No excess'],
    keyPieces: ['White tee', 'Black trousers', 'Blazer', 'Simple dress', 'Quality basics'],
    colors: ['Black', 'White', 'Grey', 'Navy', 'Camel', 'Beige'],
    accessories: ['Simple watch', 'Minimal jewelry', 'Quality leather goods'],
    icons: ['Jil Sander', 'COS', 'The Row'],
    occasions: ['Work', 'Casual', 'Formal', 'Any'],
    tags: ['simple', 'clean', 'classic', 'timeless']
  },
  {
    id: 'style-005',
    name: 'Bohemian',
    description: 'Free-spirited, artistic style with eclectic and ethnic influences',
    era: '1960s-present',
    characteristics: ['Flowing fabrics', 'Ethnic prints', 'Layering', 'Natural materials', 'Artistic elements'],
    keyPieces: ['Maxi dresses', 'Flowy pants', 'Kimono jackets', 'Fringed items', 'Peasant tops'],
    colors: ['Earth tones', 'Rust', 'Mustard', 'Teal', 'Cream', 'Terracotta'],
    accessories: ['Layered jewelry', 'Headbands', 'Leather bags', 'Ankle boots', 'Scarves'],
    icons: ['Stevie Nicks', 'Janis Joplin', 'Sienna Miller'],
    occasions: ['Casual', 'Festivals', 'Beach', 'Creative events'],
    tags: ['boho', 'free-spirit', 'artistic', 'eclectic']
  },
  {
    id: 'style-006',
    name: 'Afrofuturism',
    description: 'Futuristic style celebrating African diaspora culture and heritage',
    era: '1990s-present',
    characteristics: ['Futuristic silhouettes', 'African patterns', 'Metallic elements', 'Bold colors', 'Traditional-meets-modern'],
    keyPieces: ['Geometric shapes', 'Ankara prints', 'Metallic fabrics', 'Structured pieces', 'Statement pieces'],
    colors: ['Gold', 'Silver', 'Bold primaries', 'Earth tones', 'Metallics'],
    accessories: ['Geometric jewelry', 'Statement earrings', 'Head wraps', 'Bold makeup'],
    icons: ['Janelle Monae', 'Beyonce (Black Is King)', 'Black Panther costume design'],
    occasions: ['Events', 'Performances', 'Creative expression'],
    tags: ['afrofuturism', 'bold', 'cultural', 'futuristic']
  },
  {
    id: 'style-007',
    name: 'Dark Academia',
    description: 'Academic aesthetic inspired by literature, libraries, and classic education',
    era: '2010s-present',
    characteristics: ['Scholarly look', 'Vintage academic', 'Layered', 'Intellectual', 'Autumnal'],
    keyPieces: ['Blazers', 'Sweater vests', 'Oxford shoes', 'Plaid skirts', 'Turtlenecks', 'Trench coats'],
    colors: ['Brown', 'Burgundy', 'Forest green', 'Cream', 'Navy', 'Black'],
    accessories: ['Leather satchels', 'Glasses', 'Vintage watches', 'Scarves'],
    icons: ['Dead Poets Society', 'The Secret History aesthetic'],
    occasions: ['School', 'Work', 'Casual', 'Libraries'],
    tags: ['academic', 'vintage', 'intellectual', 'autumn']
  },
  {
    id: 'style-008',
    name: 'Gender Neutral / Androgynous',
    description: 'Style that transcends traditional gender categories',
    era: 'Always-present',
    characteristics: ['Non-binary cuts', 'Relaxed fits', 'Unisex pieces', 'Mix masculine/feminine', 'Comfort-focused'],
    keyPieces: ['Oversized shirts', 'Straight-leg pants', 'Unstructured blazers', 'Basic tees', 'Combat boots'],
    colors: ['Neutrals', 'Earth tones', 'Black', 'White', 'Denim blue'],
    accessories: ['Minimal jewelry', 'Watches', 'Simple bags', 'Functional pieces'],
    icons: ['Tilda Swinton', 'Janelle Monae', 'Billy Porter'],
    occasions: ['Any', 'Work', 'Casual', 'Formal'],
    tags: ['androgynous', 'gender-neutral', 'inclusive', 'comfortable']
  }
];

// ===== FABRIC GUIDE =====
export interface Fabric {
  id: string;
  name: string;
  type: 'natural' | 'synthetic' | 'blend';
  fiber: string;
  description: string;
  characteristics: string[];
  bestFor: string[];
  careInstructions: string[];
  sewingTips: string[];
  priceRange: 'budget' | 'mid-range' | 'luxury';
  tags: string[];
}

export const FABRIC_GUIDE: Fabric[] = [
  {
    id: 'fabric-001',
    name: 'Cotton',
    type: 'natural',
    fiber: 'Cotton plant',
    description: 'Breathable, versatile natural fiber',
    characteristics: ['Breathable', 'Absorbent', 'Soft', 'Durable', 'Can shrink', 'Wrinkles easily'],
    bestFor: ['T-shirts', 'Dresses', 'Quilting', 'Everyday wear', 'Summer clothes'],
    careInstructions: ['Machine wash warm', 'Tumble dry medium', 'Iron while damp', 'Pre-wash before sewing'],
    sewingTips: ['Easy to sew', 'Use universal needle', 'Pre-wash to prevent shrinkage'],
    priceRange: 'budget',
    tags: ['natural', 'versatile', 'beginner-friendly']
  },
  {
    id: 'fabric-002',
    name: 'Linen',
    type: 'natural',
    fiber: 'Flax plant',
    description: 'Breathable, textured natural fiber perfect for warm weather',
    characteristics: ['Very breathable', 'Textured', 'Gets softer with washing', 'Wrinkles easily', 'Strong'],
    bestFor: ['Summer dresses', 'Pants', 'Shirts', 'Home decor', 'Casual wear'],
    careInstructions: ['Machine wash cool', 'Line dry or low heat', 'Iron while damp', 'Embrace wrinkles'],
    sewingTips: ['Pre-wash', 'Use sharp needle', 'Can fray easily - finish edges', 'Press seams open'],
    priceRange: 'mid-range',
    tags: ['natural', 'summer', 'breathable']
  },
  {
    id: 'fabric-003',
    name: 'Silk',
    type: 'natural',
    fiber: 'Silkworm cocoon',
    description: 'Luxurious natural fiber with beautiful drape',
    characteristics: ['Lustrous', 'Smooth', 'Drapes beautifully', 'Temperature regulating', 'Delicate'],
    bestFor: ['Formal wear', 'Blouses', 'Scarves', 'Lingerie', 'Special occasions'],
    careInstructions: ['Dry clean or hand wash', 'Never wring', 'Air dry flat', 'Low iron on reverse'],
    sewingTips: ['Use silk pins', 'Microtex needle', 'French seams', 'Stabilize with tissue paper'],
    priceRange: 'luxury',
    tags: ['luxury', 'delicate', 'formal']
  },
  {
    id: 'fabric-004',
    name: 'Denim',
    type: 'natural',
    fiber: 'Cotton (twill weave)',
    description: 'Sturdy cotton twill, iconic for jeans',
    characteristics: ['Durable', 'Structured', 'Ages well', 'Heavy', 'Holds shape'],
    bestFor: ['Jeans', 'Jackets', 'Skirts', 'Bags', 'Heavy-duty items'],
    careInstructions: ['Machine wash cold', 'Inside out', 'Line dry or low heat', 'Wash infrequently'],
    sewingTips: ['Use denim needle', 'Longer stitch length', 'Topstitch for authentic look', 'Hammer thick seams'],
    priceRange: 'budget',
    tags: ['durable', 'casual', 'classic']
  },
  {
    id: 'fabric-005',
    name: 'Velvet',
    type: 'blend',
    fiber: 'Various (silk, cotton, polyester)',
    description: 'Luxurious fabric with soft, plush pile',
    characteristics: ['Soft pile', 'Rich appearance', 'Directional', 'Crushes', 'Light-reflective'],
    bestFor: ['Evening wear', 'Gothic fashion', 'Winter garments', 'Special occasions', 'Home decor'],
    careInstructions: ['Dry clean recommended', 'Steam to refresh', 'Store carefully to prevent crushing'],
    sewingTips: ['Cut all pieces same direction', 'Use walking foot', 'Dont press pile', 'Hand baste'],
    priceRange: 'mid-range',
    tags: ['luxury', 'formal', 'gothic', 'winter']
  },
  {
    id: 'fabric-006',
    name: 'Jersey Knit',
    type: 'blend',
    fiber: 'Cotton, polyester, or blend',
    description: 'Stretchy knit fabric comfortable for everyday wear',
    characteristics: ['Stretchy', 'Comfortable', 'Drapes well', 'Can curl at edges', 'Forgiving fit'],
    bestFor: ['T-shirts', 'Dresses', 'Activewear', 'Casual wear', 'Comfortable basics'],
    careInstructions: ['Machine wash cold', 'Tumble dry low', 'Dont need to iron'],
    sewingTips: ['Use ballpoint needle', 'Stretch stitch or serger', 'Stabilize necklines', 'Use walking foot'],
    priceRange: 'budget',
    tags: ['stretchy', 'comfortable', 'casual']
  },
  {
    id: 'fabric-007',
    name: 'Wool',
    type: 'natural',
    fiber: 'Sheep fleece',
    description: 'Warm, natural fiber perfect for cold weather',
    characteristics: ['Warm', 'Breathable', 'Naturally water-resistant', 'Can felt', 'Durable'],
    bestFor: ['Coats', 'Suits', 'Winter wear', 'Blankets', 'Structured garments'],
    careInstructions: ['Dry clean or hand wash cold', 'Never hot water', 'Reshape when wet', 'Air dry flat'],
    sewingTips: ['Pre-shrink by steaming', 'Use universal or microtex needle', 'Finish seams', 'Press with cloth'],
    priceRange: 'mid-range',
    tags: ['warm', 'winter', 'natural', 'professional']
  }
];

// ===== SEWING TECHNIQUES =====
export interface SewingTechnique {
  id: string;
  name: string;
  category: 'seam' | 'hem' | 'closure' | 'finishing' | 'construction' | 'hand-sewing';
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tools: string[];
  steps: string[];
  tips: string[];
  usedFor: string[];
  visualGuide?: string;
}

export const SEWING_TECHNIQUES: SewingTechnique[] = [
  {
    id: 'sew-001',
    name: 'Straight Stitch Seam',
    category: 'seam',
    description: 'Basic seam joining two fabric pieces',
    difficulty: 'beginner',
    tools: ['Sewing machine', 'Thread', 'Pins or clips', 'Iron'],
    steps: [
      'Pin fabric pieces right sides together',
      'Align edges at machine foot',
      'Backstitch at start',
      'Sew with 5/8" seam allowance',
      'Backstitch at end',
      'Press seam open or to one side'
    ],
    tips: ['Keep consistent seam allowance', 'Dont pull fabric through machine', 'Press after every seam'],
    usedFor: ['All garment construction', 'Quilting', 'Home decor']
  },
  {
    id: 'sew-002',
    name: 'French Seam',
    category: 'seam',
    description: 'Enclosed seam hiding raw edges, perfect for sheer fabrics',
    difficulty: 'intermediate',
    tools: ['Sewing machine', 'Thread', 'Pins', 'Iron'],
    steps: [
      'Pin fabric WRONG sides together',
      'Sew with 3/8" seam allowance',
      'Trim to 1/8"',
      'Press seam to one side',
      'Fold RIGHT sides together, enclosing raw edges',
      'Press and pin',
      'Sew with 1/4" seam allowance',
      'Press seam to one side'
    ],
    tips: ['Great for sheer/delicate fabrics', 'Test on scraps first', 'Trim carefully'],
    usedFor: ['Silk', 'Chiffon', 'Sheer fabrics', 'Quality garments']
  },
  {
    id: 'sew-003',
    name: 'Invisible Zipper',
    category: 'closure',
    description: 'Hidden zipper installation',
    difficulty: 'intermediate',
    tools: ['Invisible zipper', 'Invisible zipper foot', 'Machine', 'Thread', 'Iron'],
    steps: [
      'Press zipper teeth flat with low iron',
      'Mark zipper placement on fabric',
      'Open zipper',
      'Place zipper face down on right side of fabric',
      'Using zipper foot, sew close to teeth',
      'Repeat for other side',
      'Close zipper, sew remaining seam below'
    ],
    tips: ['Iron zipper teeth flat before sewing', 'Sew with zipper open', 'Specialized foot is essential'],
    usedFor: ['Dresses', 'Skirts', 'Formal wear', 'Back closures']
  },
  {
    id: 'sew-004',
    name: 'Blind Hem',
    category: 'hem',
    description: 'Nearly invisible hem stitch',
    difficulty: 'intermediate',
    tools: ['Hand needle', 'Thread matching fabric', 'Pins', 'Iron'],
    steps: [
      'Fold and press hem allowance',
      'Fold hem back on itself, leaving 1/4" edge showing',
      'Take tiny stitch in garment, catching only few threads',
      'Take stitch in hem fold',
      'Repeat, keeping stitches loose',
      'Unfold and press'
    ],
    tips: ['Use matching thread', 'Keep stitches loose', 'Catch minimal fabric on outside'],
    usedFor: ['Dress pants', 'Formal wear', 'Any professional hem']
  },
  {
    id: 'sew-005',
    name: 'Gathering',
    category: 'construction',
    description: 'Creating controlled fullness in fabric',
    difficulty: 'beginner',
    tools: ['Sewing machine', 'Thread', 'Pins'],
    steps: [
      'Set machine to longest stitch length',
      'Sew two parallel rows within seam allowance',
      'Leave long thread tails',
      'Pin one end',
      'Pull bobbin threads to gather',
      'Distribute gathers evenly',
      'Pin to corresponding piece',
      'Sew with regular stitch length'
    ],
    tips: ['Use longer stitch for more gather', 'Pull bobbin thread, not top', 'Secure threads at ends'],
    usedFor: ['Skirt waists', 'Sleeves', 'Ruffles', 'Puff details']
  },
  {
    id: 'sew-006',
    name: 'Hand Basting',
    category: 'hand-sewing',
    description: 'Temporary hand stitches for fitting and preparation',
    difficulty: 'beginner',
    tools: ['Hand needle', 'Thread (contrasting color)', 'Scissors'],
    steps: [
      'Thread needle with contrasting thread (no knot optional)',
      'Take long stitches (1/2" to 1")',
      'Keep tension loose',
      'Use to hold pieces for fitting or tricky sewing',
      'Remove easily after permanent stitching'
    ],
    tips: ['Contrasting thread easy to see and remove', 'Dont secure too tightly', 'Essential for fitting'],
    usedFor: ['Fitting garments', 'Holding slippery fabrics', 'Testing placement', 'Zippers']
  },
  {
    id: 'sew-007',
    name: 'Stay Stitching',
    category: 'construction',
    description: 'Stabilizing stitch to prevent stretching',
    difficulty: 'beginner',
    tools: ['Sewing machine', 'Thread'],
    steps: [
      'Sew within seam allowance (1/2" from edge)',
      'Stitch directionally (usually from high to low point)',
      'Use regular stitch length',
      'Do NOT backstitch',
      'Leave in permanently'
    ],
    tips: ['Always stitch curves and bias edges', 'Do immediately after cutting', 'Stitch in direction of grain'],
    usedFor: ['Necklines', 'Armholes', 'Waistlines', 'Any curved or bias edge']
  }
];

// ===== PATTERN MAKING BASICS =====
export interface PatternBasics {
  id: string;
  term: string;
  definition: string;
  example?: string;
  tips?: string[];
}

export const PATTERN_TERMINOLOGY: PatternBasics[] = [
  { id: 'pat-001', term: 'Grain Line', definition: 'Arrow on pattern indicating direction parallel to selvage (lengthwise grain)', tips: ['Always align with fabric grain', 'Measure from both ends to selvage'] },
  { id: 'pat-002', term: 'Selvage', definition: 'Finished, non-fraying edge of fabric running lengthwise', tips: ['Dont include in seams', 'Use as reference for grain'] },
  { id: 'pat-003', term: 'Seam Allowance', definition: 'Extra fabric beyond seam line for joining pieces', example: 'Standard is 5/8" (1.5cm)', tips: ['Check pattern for specified amount', 'Commercial patterns usually 5/8"'] },
  { id: 'pat-004', term: 'Notch', definition: 'Small mark on pattern edge for matching pieces', tips: ['Cut outward, not into seam allowance', 'Match single to single, double to double'] },
  { id: 'pat-005', term: 'Ease', definition: 'Extra room in garment beyond body measurements for movement', example: 'A size 10 pattern is larger than a size 10 body' },
  { id: 'pat-006', term: 'Dart', definition: 'Triangular fold sewn to shape flat fabric to body curves', tips: ['Press bust darts down', 'Press back darts toward center'] },
  { id: 'pat-007', term: 'Bias', definition: '45-degree angle to grain, maximum stretch direction', tips: ['Cut strips for binding', 'Handle carefully - stretches easily'] },
  { id: 'pat-008', term: 'Right Side / Wrong Side', definition: 'Right side is the finished, public-facing side; wrong side is inside', tips: ['Mark wrong side if hard to tell', 'Right sides together means outsides facing each other'] }
];

// ===== BODY MEASUREMENTS GUIDE =====
export interface MeasurementGuide {
  name: string;
  howToMeasure: string;
  tips: string[];
}

export const MEASUREMENT_GUIDE: MeasurementGuide[] = [
  { name: 'Bust/Chest', howToMeasure: 'Around fullest part of bust/chest, keeping tape parallel to floor', tips: ['Wear well-fitting bra', 'Dont pull tape tight', 'Breathe normally'] },
  { name: 'Waist', howToMeasure: 'Around natural waist, the smallest part of your torso', tips: ['Bend side to side to find natural waist', 'Tie string around waist to mark'] },
  { name: 'Hip', howToMeasure: 'Around fullest part of hips/seat, usually 7-9" below waist', tips: ['Include fullest part of seat', 'Keep tape parallel to floor'] },
  { name: 'Shoulder Width', howToMeasure: 'From shoulder point to shoulder point across back', tips: ['Measure across upper back', 'Find where arm meets shoulder'] },
  { name: 'Arm Length', howToMeasure: 'From shoulder point to wrist with arm slightly bent', tips: ['Bend elbow slightly', 'Measure to wrist bone'] },
  { name: 'Inseam', howToMeasure: 'From crotch to ankle along inside leg', tips: ['Measure wearing shoes if for pants', 'Stand straight'] },
  { name: 'Back Length', howToMeasure: 'From prominent bone at back of neck to waist', tips: ['Find bone by tilting head forward', 'Measure straight down'] }
];

// Helper functions
export function searchFashion(query: string) {
  const q = query.toLowerCase();
  const results: any[] = [];

  results.push(...FASHION_STYLES.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.tags.some(t => t.toLowerCase().includes(q))
  ).map(s => ({ ...s, type: 'style' })));

  results.push(...FABRIC_GUIDE.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.characteristics.some(c => c.toLowerCase().includes(q))
  ).map(f => ({ ...f, type: 'fabric' })));

  results.push(...SEWING_TECHNIQUES.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  ).map(t => ({ ...t, type: 'technique' })));

  return results;
}

export function getFabricsByType(type: 'natural' | 'synthetic' | 'blend') {
  return FABRIC_GUIDE.filter(f => f.type === type);
}

export function getTechniquesByCategory(category: string) {
  return SEWING_TECHNIQUES.filter(t => t.category === category);
}

export function getTechniquesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced') {
  return SEWING_TECHNIQUES.filter(t => t.difficulty === difficulty);
}
