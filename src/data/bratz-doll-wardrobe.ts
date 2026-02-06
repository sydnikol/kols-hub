/**
 * BRATZ DOLL WARDROBE DATABASE
 * 200+ Detailed Outfits with Video Game Style Visuals
 * Styles: Gothic, Alternative, Punk, Steampunk, K-Pop, R&B, Hip Hop,
 * Anime, Cosplay, Holiday, Rockabilly, and Real Clothes Inspired
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface BratzClothingItem {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory' | 'hair' | 'makeup' | 'bag' | 'jewelry' | 'headwear' | 'legwear';
  style: string[];
  colors: string[];
  pattern?: string;
  material?: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedBy?: string;
  visualDetails: {
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    texture?: string;
    shine?: 'matte' | 'satin' | 'glossy' | 'metallic' | 'glitter' | 'holographic';
    transparency?: number;
    animationEffect?: string;
  };
  tags: string[];
}

export interface BratzOutfit {
  id: string;
  name: string;
  style: string;
  subStyle?: string;
  description: string;
  occasion: string[];
  season: ('spring' | 'summer' | 'fall' | 'winter' | 'all')[];
  mood: string;
  items: {
    top?: string;
    bottom?: string;
    dress?: string;
    outerwear?: string;
    shoes: string;
    accessories: string[];
    hair: string;
    makeup: string;
    bag?: string;
    jewelry?: string[];
    headwear?: string;
    legwear?: string;
  };
  colorPalette: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockRequirement?: string;
  specialEffects?: string[];
  inspirationNotes?: string;
  rating: number;
  tags: string[];
}

export interface BratzDoll {
  id: string;
  name: string;
  personality: string[];
  favoriteStyles: string[];
  signatureColors: string[];
  skinTone: string;
  eyeColor: string;
  defaultHair: string;
  bio: string;
  unlocked: boolean;
}

// ============================================================================
// BRATZ DOLLS
// ============================================================================

export const BRATZ_DOLLS: BratzDoll[] = [
  {
    id: 'doll-yasmin',
    name: 'Yasmin',
    personality: ['Creative', 'Dreamy', 'Artistic', 'Romantic'],
    favoriteStyles: ['Bohemian', 'Gothic', 'Alternative'],
    signatureColors: ['Purple', 'Gold', 'Burgundy'],
    skinTone: 'warm-tan',
    eyeColor: 'amber',
    defaultHair: 'Long wavy brunette',
    bio: 'Pretty Princess with a passion for poetry and dark aesthetics',
    unlocked: true
  },
  {
    id: 'doll-cloe',
    name: 'Cloe',
    personality: ['Athletic', 'Energetic', 'Confident', 'Bold'],
    favoriteStyles: ['Streetwear', 'Hip Hop', 'Punk'],
    signatureColors: ['Blue', 'White', 'Silver'],
    skinTone: 'fair',
    eyeColor: 'blue',
    defaultHair: 'Long blonde',
    bio: 'Angel with fierce street style and athletic edge',
    unlocked: true
  },
  {
    id: 'doll-sasha',
    name: 'Sasha',
    personality: ['Fierce', 'Leader', 'Musical', 'Trendsetter'],
    favoriteStyles: ['R&B', 'Hip Hop', 'K-Pop'],
    signatureColors: ['Red', 'Black', 'Gold'],
    skinTone: 'deep-brown',
    eyeColor: 'brown',
    defaultHair: 'Black with highlights',
    bio: 'Bunny Boo bringing the beats and fierce fashion',
    unlocked: true
  },
  {
    id: 'doll-jade',
    name: 'Jade',
    personality: ['Edgy', 'Creative', 'Tech-savvy', 'Artistic'],
    favoriteStyles: ['Punk', 'Gothic', 'Anime', 'K-Pop'],
    signatureColors: ['Green', 'Black', 'Pink'],
    skinTone: 'light-olive',
    eyeColor: 'green',
    defaultHair: 'Black with colored streaks',
    bio: 'Kool Kat with killer style and creative vision',
    unlocked: true
  }
];

// ============================================================================
// CLOTHING ITEMS - GOTHIC COLLECTION
// ============================================================================

export const GOTHIC_ITEMS: BratzClothingItem[] = [
  // TOPS
  {
    id: 'goth-top-001',
    name: 'Victorian Lace Corset',
    type: 'top',
    style: ['Gothic', 'Victorian'],
    colors: ['Black', 'Deep Purple'],
    pattern: 'Lace overlay',
    material: 'Velvet with lace',
    description: 'Elegant Victorian-inspired corset with intricate lace detailing and silver busk closures',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#1a0a1a',
      secondaryColor: '#2d0a3d',
      accentColor: '#c0c0c0',
      texture: 'velvet-lace',
      shine: 'satin'
    },
    tags: ['corset', 'lace', 'victorian', 'elegant']
  },
  {
    id: 'goth-top-002',
    name: 'Mesh Sleeve Crop Top',
    type: 'top',
    style: ['Gothic', 'Modern Goth'],
    colors: ['Black'],
    pattern: 'Solid with mesh',
    material: 'Cotton and mesh',
    description: 'Black crop top with dramatic sheer mesh bishop sleeves',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0d0d0d',
      texture: 'cotton-mesh',
      shine: 'matte',
      transparency: 0.7
    },
    tags: ['crop', 'mesh', 'sleeves', 'edgy']
  },
  {
    id: 'goth-top-003',
    name: 'Coffin Embroidered Blouse',
    type: 'top',
    style: ['Gothic', 'Romantic Goth'],
    colors: ['Black', 'Silver'],
    pattern: 'Coffin embroidery',
    material: 'Chiffon',
    description: 'Flowing black chiffon blouse with silver coffin and rose embroidery',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#c0c0c0',
      texture: 'chiffon-embroidered',
      shine: 'satin',
      transparency: 0.3
    },
    tags: ['blouse', 'embroidered', 'coffin', 'romantic']
  },
  {
    id: 'goth-top-004',
    name: 'Bat Wing Halter',
    type: 'top',
    style: ['Gothic', 'Nu Goth'],
    colors: ['Black', 'Purple'],
    pattern: 'Bat wing cutout',
    material: 'Spandex blend',
    description: 'Fitted halter top with dramatic bat wing cutout back design',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#0d0d0d',
      secondaryColor: '#2a0a3a',
      texture: 'spandex',
      shine: 'glossy',
      animationEffect: 'subtle-shimmer'
    },
    tags: ['halter', 'bat', 'cutout', 'fitted']
  },
  {
    id: 'goth-top-005',
    name: 'Velvet Mourning Bodice',
    type: 'top',
    style: ['Gothic', 'Victorian'],
    colors: ['Deep Burgundy', 'Black'],
    pattern: 'Damask',
    material: 'Crushed velvet',
    description: 'Rich burgundy velvet bodice with black damask print and jet button details',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#4a0a0a',
      secondaryColor: '#1a0a1a',
      accentColor: '#0a0a0a',
      texture: 'crushed-velvet-damask',
      shine: 'satin',
      animationEffect: 'light-catch'
    },
    tags: ['bodice', 'velvet', 'damask', 'victorian', 'luxury']
  },

  // BOTTOMS
  {
    id: 'goth-bottom-001',
    name: 'Layered Tulle Skirt',
    type: 'bottom',
    style: ['Gothic', 'Romantic Goth'],
    colors: ['Black', 'Deep Purple'],
    pattern: 'Layered',
    material: 'Tulle and satin',
    description: 'Multi-layered tulle skirt with satin underskirt, perfect for twirling',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#1a0a2a',
      texture: 'tulle-layered',
      shine: 'matte',
      transparency: 0.5,
      animationEffect: 'flow'
    },
    tags: ['skirt', 'tulle', 'layered', 'flowing']
  },
  {
    id: 'goth-bottom-002',
    name: 'Distressed Black Skinny Jeans',
    type: 'bottom',
    style: ['Gothic', 'Casual Goth'],
    colors: ['Black'],
    pattern: 'Distressed',
    material: 'Denim',
    description: 'High-waisted black skinny jeans with strategic rips and silver hardware',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#c0c0c0',
      texture: 'distressed-denim',
      shine: 'matte'
    },
    tags: ['jeans', 'skinny', 'distressed', 'casual']
  },
  {
    id: 'goth-bottom-003',
    name: 'Velvet Palazzo Pants',
    type: 'bottom',
    style: ['Gothic', 'Elegant Goth'],
    colors: ['Black'],
    material: 'Velvet',
    description: 'Wide-leg velvet palazzo pants with dramatic flow',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0d0d0d',
      texture: 'velvet',
      shine: 'satin',
      animationEffect: 'gentle-sway'
    },
    tags: ['pants', 'velvet', 'wide-leg', 'elegant']
  },
  {
    id: 'goth-bottom-004',
    name: 'Plaid Bondage Mini',
    type: 'bottom',
    style: ['Gothic', 'Punk Goth'],
    colors: ['Black', 'Red'],
    pattern: 'Tartan plaid',
    material: 'Cotton blend',
    description: 'Pleated mini skirt in black and red tartan with D-ring straps',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#1a0a0a',
      secondaryColor: '#8a0a0a',
      accentColor: '#c0c0c0',
      texture: 'plaid-pleated',
      shine: 'matte'
    },
    tags: ['skirt', 'plaid', 'mini', 'punk']
  },
  {
    id: 'goth-bottom-005',
    name: 'Lace Overlay Pencil Skirt',
    type: 'bottom',
    style: ['Gothic', 'Corporate Goth'],
    colors: ['Black'],
    pattern: 'Lace overlay',
    material: 'Satin with lace',
    description: 'Sleek pencil skirt with delicate black lace overlay',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'satin-lace-overlay',
      shine: 'satin',
      transparency: 0.2
    },
    tags: ['skirt', 'pencil', 'lace', 'professional']
  },

  // DRESSES
  {
    id: 'goth-dress-001',
    name: 'Cemetery Rose Gown',
    type: 'dress',
    style: ['Gothic', 'Romantic Goth'],
    colors: ['Black', 'Deep Red'],
    pattern: 'Rose print',
    material: 'Velvet and chiffon',
    description: 'Floor-length gown with velvet bodice and flowing chiffon skirt adorned with dark roses',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#3a0a0a',
      accentColor: '#5a0a1a',
      texture: 'velvet-chiffon-rose',
      shine: 'satin',
      animationEffect: 'ethereal-flow'
    },
    tags: ['gown', 'roses', 'elegant', 'formal']
  },
  {
    id: 'goth-dress-002',
    name: 'Wednesday Mini Dress',
    type: 'dress',
    style: ['Gothic', 'Classic Goth'],
    colors: ['Black'],
    pattern: 'Solid with white collar',
    material: 'Cotton blend',
    description: 'Classic black mini dress with crisp white peter pan collar',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0d0d0d',
      accentColor: '#ffffff',
      texture: 'cotton-crisp',
      shine: 'matte'
    },
    tags: ['dress', 'mini', 'collar', 'classic']
  },
  {
    id: 'goth-dress-003',
    name: 'Spiderweb Lace Dress',
    type: 'dress',
    style: ['Gothic', 'Halloween Goth'],
    colors: ['Black', 'Silver'],
    pattern: 'Spiderweb lace',
    material: 'Lace',
    description: 'Fitted dress in delicate spiderweb patterned lace with silver thread accents',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#c0c0c0',
      texture: 'spiderweb-lace',
      shine: 'metallic',
      transparency: 0.4,
      animationEffect: 'silver-glint'
    },
    tags: ['dress', 'lace', 'spiderweb', 'halloween']
  },
  {
    id: 'goth-dress-004',
    name: 'Corseted Bustle Dress',
    type: 'dress',
    style: ['Gothic', 'Victorian'],
    colors: ['Purple', 'Black'],
    pattern: 'Striped',
    material: 'Taffeta and satin',
    description: 'Victorian-inspired dress with integrated corset, puffed sleeves, and dramatic bustle',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#2a0a3a',
      secondaryColor: '#0a0a0a',
      accentColor: '#d4af37',
      texture: 'taffeta-striped',
      shine: 'satin',
      animationEffect: 'bustle-bounce'
    },
    tags: ['dress', 'corset', 'bustle', 'victorian', 'formal']
  },
  {
    id: 'goth-dress-005',
    name: 'Witchy Maxi Dress',
    type: 'dress',
    style: ['Gothic', 'Witch'],
    colors: ['Black', 'Forest Green'],
    pattern: 'Moon phases print',
    material: 'Rayon',
    description: 'Flowing maxi dress with bell sleeves featuring moon phase print',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#0a2a0a',
      accentColor: '#c0c0c0',
      texture: 'rayon-printed',
      shine: 'matte',
      animationEffect: 'gentle-flow'
    },
    tags: ['dress', 'maxi', 'witch', 'moon']
  },

  // OUTERWEAR
  {
    id: 'goth-outer-001',
    name: 'Velvet Cape with Hood',
    type: 'outerwear',
    style: ['Gothic', 'Romantic Goth'],
    colors: ['Black', 'Red lining'],
    material: 'Velvet',
    description: 'Dramatic floor-length velvet cape with oversized hood and crimson satin lining',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#5a0a0a',
      texture: 'velvet-lined',
      shine: 'satin',
      animationEffect: 'dramatic-swirl'
    },
    tags: ['cape', 'velvet', 'hood', 'dramatic']
  },
  {
    id: 'goth-outer-002',
    name: 'Studded Leather Jacket',
    type: 'outerwear',
    style: ['Gothic', 'Punk Goth'],
    colors: ['Black'],
    material: 'Faux leather',
    description: 'Classic biker jacket covered in silver pyramid studs and safety pins',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#c0c0c0',
      texture: 'leather-studded',
      shine: 'glossy',
      animationEffect: 'stud-glint'
    },
    tags: ['jacket', 'leather', 'studded', 'punk']
  },
  {
    id: 'goth-outer-003',
    name: 'Lace Bolero',
    type: 'outerwear',
    style: ['Gothic', 'Elegant Goth'],
    colors: ['Black'],
    pattern: 'Floral lace',
    material: 'Lace',
    description: 'Delicate cropped lace bolero jacket with scalloped edges',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'floral-lace',
      shine: 'matte',
      transparency: 0.6
    },
    tags: ['bolero', 'lace', 'elegant', 'cropped']
  },

  // SHOES
  {
    id: 'goth-shoe-001',
    name: 'Platform Combat Boots',
    type: 'shoes',
    style: ['Gothic', 'Punk Goth'],
    colors: ['Black'],
    material: 'Faux leather',
    description: 'Chunky platform combat boots with buckles and thick sole',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0d0d0d',
      accentColor: '#c0c0c0',
      texture: 'leather-buckled',
      shine: 'glossy'
    },
    tags: ['boots', 'platform', 'combat', 'chunky']
  },
  {
    id: 'goth-shoe-002',
    name: 'Victorian Lace-Up Boots',
    type: 'shoes',
    style: ['Gothic', 'Victorian'],
    colors: ['Black', 'Burgundy'],
    material: 'Velvet and leather',
    description: 'Elegant Victorian boots with velvet panels and antique brass eyelets',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#1a0a0a',
      secondaryColor: '#3a0a0a',
      accentColor: '#b8860b',
      texture: 'velvet-leather',
      shine: 'satin'
    },
    tags: ['boots', 'victorian', 'lace-up', 'elegant']
  },
  {
    id: 'goth-shoe-003',
    name: 'Coffin Heel Pumps',
    type: 'shoes',
    style: ['Gothic', 'Nu Goth'],
    colors: ['Black'],
    material: 'Patent leather',
    description: 'Sleek pumps with unique coffin-shaped heels',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'patent-leather',
      shine: 'glossy',
      animationEffect: 'heel-sparkle'
    },
    tags: ['pumps', 'heels', 'coffin', 'statement']
  },

  // ACCESSORIES
  {
    id: 'goth-acc-001',
    name: 'Spiked Choker',
    type: 'accessory',
    style: ['Gothic', 'Punk Goth'],
    colors: ['Black', 'Silver'],
    material: 'Leather and metal',
    description: 'Classic leather choker with silver cone spikes',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#c0c0c0',
      texture: 'leather-metal',
      shine: 'metallic'
    },
    tags: ['choker', 'spiked', 'leather', 'punk']
  },
  {
    id: 'goth-acc-002',
    name: 'Cameo Necklace',
    type: 'jewelry',
    style: ['Gothic', 'Victorian'],
    colors: ['Black', 'Ivory', 'Silver'],
    material: 'Silver and resin',
    description: 'Ornate Victorian-style cameo on black velvet ribbon',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#c0c0c0',
      secondaryColor: '#f5f5dc',
      accentColor: '#0a0a0a',
      texture: 'cameo-velvet',
      shine: 'satin'
    },
    tags: ['necklace', 'cameo', 'victorian', 'elegant']
  },
  {
    id: 'goth-acc-003',
    name: 'Pentagram Earrings',
    type: 'jewelry',
    style: ['Gothic', 'Witch'],
    colors: ['Silver'],
    material: 'Sterling silver',
    description: 'Dangling pentagram earrings with crescent moon accents',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#c0c0c0',
      texture: 'silver-detailed',
      shine: 'metallic',
      animationEffect: 'dangle-sway'
    },
    tags: ['earrings', 'pentagram', 'witch', 'silver']
  },
  {
    id: 'goth-acc-004',
    name: 'Coffin Crossbody Bag',
    type: 'bag',
    style: ['Gothic', 'Nu Goth'],
    colors: ['Black', 'Red lining'],
    material: 'Faux leather',
    description: 'Coffin-shaped crossbody bag with velvet lining and silver hardware',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#5a0a0a',
      accentColor: '#c0c0c0',
      texture: 'leather-coffin',
      shine: 'glossy'
    },
    tags: ['bag', 'coffin', 'crossbody', 'statement']
  },

  // HAIR
  {
    id: 'goth-hair-001',
    name: 'Long Black with Purple Tips',
    type: 'hair',
    style: ['Gothic'],
    colors: ['Black', 'Purple'],
    description: 'Sleek long black hair with vibrant purple dip-dyed tips',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#5a0a5a',
      texture: 'sleek-ombre',
      shine: 'glossy',
      animationEffect: 'hair-flow'
    },
    tags: ['long', 'black', 'purple', 'ombre']
  },
  {
    id: 'goth-hair-002',
    name: 'Victorian Updo with Roses',
    type: 'hair',
    style: ['Gothic', 'Victorian'],
    colors: ['Black', 'Dark Red'],
    description: 'Elaborate updo with cascading curls and dark red roses',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#5a0a0a',
      texture: 'curled-roses',
      shine: 'satin',
      animationEffect: 'curl-bounce'
    },
    tags: ['updo', 'curls', 'roses', 'elegant']
  },
  {
    id: 'goth-hair-003',
    name: 'Crimped Witch Hair',
    type: 'hair',
    style: ['Gothic', 'Witch'],
    colors: ['Black'],
    description: 'Long crimped black hair with dramatic volume',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'crimped-voluminous',
      shine: 'matte',
      animationEffect: 'dramatic-flow'
    },
    tags: ['long', 'crimped', 'volume', 'witch']
  },

  // MAKEUP
  {
    id: 'goth-makeup-001',
    name: 'Classic Goth Face',
    type: 'makeup',
    style: ['Gothic'],
    colors: ['Black', 'White', 'Deep Red'],
    description: 'Pale foundation, dramatic black smoky eye, and deep red lips',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#f5f5f5',
      secondaryColor: '#0a0a0a',
      accentColor: '#5a0a0a',
      texture: 'matte-dramatic',
      shine: 'matte'
    },
    tags: ['smoky', 'pale', 'dramatic', 'classic']
  },
  {
    id: 'goth-makeup-002',
    name: 'Romantic Goth Glam',
    type: 'makeup',
    style: ['Gothic', 'Romantic Goth'],
    colors: ['Purple', 'Black', 'Rose'],
    description: 'Soft purple eyeshadow with winged liner and dusty rose lips',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#f0e6e6',
      secondaryColor: '#3a1a3a',
      accentColor: '#8a4a5a',
      texture: 'soft-romantic',
      shine: 'satin'
    },
    tags: ['purple', 'romantic', 'soft', 'elegant']
  },
  {
    id: 'goth-makeup-003',
    name: 'Vampiric Beauty',
    type: 'makeup',
    style: ['Gothic', 'Vampire'],
    colors: ['Black', 'Blood Red', 'White'],
    description: 'Deathly pale skin, intense black liner, and blood red lips with subtle fang detail',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#f0f0f0',
      secondaryColor: '#0a0a0a',
      accentColor: '#8a0a0a',
      texture: 'vampiric-intense',
      shine: 'glossy',
      animationEffect: 'lip-glisten'
    },
    tags: ['vampire', 'pale', 'blood', 'dramatic']
  },

  // HEADWEAR
  {
    id: 'goth-head-001',
    name: 'Black Lace Veil',
    type: 'headwear',
    style: ['Gothic', 'Romantic Goth'],
    colors: ['Black'],
    material: 'Lace',
    description: 'Delicate black lace veil with rose clip attachment',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'lace-sheer',
      shine: 'matte',
      transparency: 0.7,
      animationEffect: 'veil-flow'
    },
    tags: ['veil', 'lace', 'romantic', 'elegant']
  },
  {
    id: 'goth-head-002',
    name: 'Mini Top Hat',
    type: 'headwear',
    style: ['Gothic', 'Steampunk'],
    colors: ['Black', 'Purple'],
    material: 'Velvet',
    description: 'Miniature top hat with feathers and chain accents',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#2a0a2a',
      accentColor: '#c0c0c0',
      texture: 'velvet-feathered',
      shine: 'satin',
      animationEffect: 'feather-sway'
    },
    tags: ['hat', 'tophat', 'mini', 'feathers']
  },

  // LEGWEAR
  {
    id: 'goth-leg-001',
    name: 'Fishnet Stockings',
    type: 'legwear',
    style: ['Gothic', 'Punk Goth'],
    colors: ['Black'],
    material: 'Nylon',
    description: 'Classic black fishnet stockings with small diamond pattern',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'fishnet',
      shine: 'matte',
      transparency: 0.6
    },
    tags: ['stockings', 'fishnet', 'classic', 'punk']
  },
  {
    id: 'goth-leg-002',
    name: 'Spiderweb Tights',
    type: 'legwear',
    style: ['Gothic', 'Halloween Goth'],
    colors: ['Black'],
    pattern: 'Spiderweb',
    material: 'Nylon',
    description: 'Sheer black tights with allover spiderweb pattern',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'spiderweb-sheer',
      shine: 'matte',
      transparency: 0.5
    },
    tags: ['tights', 'spiderweb', 'halloween', 'sheer']
  },
  {
    id: 'goth-leg-003',
    name: 'Striped Thigh Highs',
    type: 'legwear',
    style: ['Gothic', 'Punk Goth'],
    colors: ['Black', 'Purple'],
    pattern: 'Horizontal stripes',
    material: 'Cotton blend',
    description: 'Over-the-knee socks in black and purple stripes',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#3a0a3a',
      texture: 'striped-knit',
      shine: 'matte'
    },
    tags: ['socks', 'thigh-high', 'striped', 'colorful']
  }
];

// ============================================================================
// CLOTHING ITEMS - PUNK COLLECTION
// ============================================================================

export const PUNK_ITEMS: BratzClothingItem[] = [
  {
    id: 'punk-top-001',
    name: 'Ripped Band Tee',
    type: 'top',
    style: ['Punk', 'Rock'],
    colors: ['Black', 'White'],
    pattern: 'Band logo print',
    material: 'Cotton',
    description: 'Oversized vintage band tee with strategic rips and safety pins',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#ffffff',
      texture: 'distressed-cotton',
      shine: 'matte'
    },
    tags: ['tee', 'band', 'ripped', 'oversized']
  },
  {
    id: 'punk-top-002',
    name: 'Tartan Bondage Top',
    type: 'top',
    style: ['Punk', 'British Punk'],
    colors: ['Red', 'Black'],
    pattern: 'Tartan plaid',
    material: 'Cotton',
    description: 'Fitted tartan top with bondage straps and D-rings',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#8a0a0a',
      secondaryColor: '#1a1a1a',
      accentColor: '#c0c0c0',
      texture: 'plaid-strapped',
      shine: 'matte'
    },
    tags: ['tartan', 'bondage', 'straps', 'british']
  },
  {
    id: 'punk-top-003',
    name: 'DIY Patch Vest',
    type: 'outerwear',
    style: ['Punk', 'Crust Punk'],
    colors: ['Black', 'Various'],
    pattern: 'Band patches',
    material: 'Denim',
    description: 'Sleeveless denim vest covered in band patches and studs',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'patched-denim',
      shine: 'matte',
      animationEffect: 'patch-variety'
    },
    tags: ['vest', 'patches', 'diy', 'denim']
  },
  {
    id: 'punk-top-004',
    name: 'Anarchy Crop',
    type: 'top',
    style: ['Punk'],
    colors: ['Black', 'Red'],
    pattern: 'Anarchy symbol',
    material: 'Cotton',
    description: 'Black crop top with bold red anarchy symbol',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#cc0000',
      texture: 'printed-cotton',
      shine: 'matte'
    },
    tags: ['crop', 'anarchy', 'symbol', 'bold']
  },
  {
    id: 'punk-bottom-001',
    name: 'Plaid Bondage Pants',
    type: 'bottom',
    style: ['Punk', 'British Punk'],
    colors: ['Red', 'Black'],
    pattern: 'Tartan',
    material: 'Cotton blend',
    description: 'Tight plaid pants with connecting straps between legs',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#8a0a0a',
      secondaryColor: '#1a1a1a',
      accentColor: '#c0c0c0',
      texture: 'plaid-bondage',
      shine: 'matte'
    },
    tags: ['pants', 'bondage', 'plaid', 'tight']
  },
  {
    id: 'punk-bottom-002',
    name: 'Safety Pin Mini Skirt',
    type: 'bottom',
    style: ['Punk'],
    colors: ['Black'],
    material: 'Faux leather',
    description: 'Leather mini skirt held together with rows of safety pins',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#c0c0c0',
      texture: 'leather-pinned',
      shine: 'glossy'
    },
    tags: ['skirt', 'mini', 'safety-pins', 'leather']
  },
  {
    id: 'punk-bottom-003',
    name: 'Destroyed Denim Shorts',
    type: 'bottom',
    style: ['Punk', 'Grunge'],
    colors: ['Black'],
    pattern: 'Distressed',
    material: 'Denim',
    description: 'High-waisted black denim shorts with extreme distressing',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'destroyed-denim',
      shine: 'matte'
    },
    tags: ['shorts', 'denim', 'destroyed', 'high-waisted']
  },
  {
    id: 'punk-shoe-001',
    name: 'Classic Doc Martens Style',
    type: 'shoes',
    style: ['Punk', 'Alternative'],
    colors: ['Black', 'Yellow stitching'],
    material: 'Leather',
    description: '8-hole combat boots with signature yellow stitching',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0d0d0d',
      accentColor: '#ffd700',
      texture: 'leather-stitched',
      shine: 'glossy'
    },
    tags: ['boots', 'combat', 'classic', 'docs']
  },
  {
    id: 'punk-shoe-002',
    name: 'Studded Creepers',
    type: 'shoes',
    style: ['Punk', 'Rockabilly'],
    colors: ['Black', 'Leopard'],
    pattern: 'Leopard print accents',
    material: 'Suede and leather',
    description: 'Platform creepers with leopard panels and pyramid studs',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#8a6a2a',
      accentColor: '#c0c0c0',
      texture: 'suede-leopard-studded',
      shine: 'matte'
    },
    tags: ['creepers', 'platform', 'leopard', 'studded']
  },
  {
    id: 'punk-acc-001',
    name: 'Studded Wristband',
    type: 'accessory',
    style: ['Punk'],
    colors: ['Black', 'Silver'],
    material: 'Leather',
    description: 'Wide leather wristband covered in cone studs',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#c0c0c0',
      texture: 'leather-studded',
      shine: 'metallic'
    },
    tags: ['wristband', 'studded', 'leather', 'punk']
  },
  {
    id: 'punk-acc-002',
    name: 'Safety Pin Earrings',
    type: 'jewelry',
    style: ['Punk'],
    colors: ['Silver'],
    material: 'Metal',
    description: 'Oversized safety pin earrings with dangling chains',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#c0c0c0',
      texture: 'metal-chains',
      shine: 'metallic',
      animationEffect: 'chain-dangle'
    },
    tags: ['earrings', 'safety-pin', 'chains', 'punk']
  },
  {
    id: 'punk-hair-001',
    name: 'Bright Pink Mohawk',
    type: 'hair',
    style: ['Punk'],
    colors: ['Hot Pink', 'Black'],
    description: 'Dramatic spiked mohawk in hot pink with shaved black sides',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#ff1493',
      secondaryColor: '#0a0a0a',
      texture: 'spiked-mohawk',
      shine: 'matte',
      animationEffect: 'spike-definition'
    },
    tags: ['mohawk', 'pink', 'spiked', 'dramatic']
  },
  {
    id: 'punk-hair-002',
    name: 'Liberty Spikes',
    type: 'hair',
    style: ['Punk'],
    colors: ['Multi-color'],
    description: 'Rainbow-colored liberty spikes fanning out from head',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      accentColor: '#0000ff',
      texture: 'spiked-liberty',
      shine: 'glossy',
      animationEffect: 'rainbow-shift'
    },
    tags: ['spikes', 'liberty', 'rainbow', 'extreme']
  },
  {
    id: 'punk-makeup-001',
    name: 'Classic Punk Face',
    type: 'makeup',
    style: ['Punk'],
    colors: ['Black', 'Red'],
    description: 'Heavy black eyeliner, pale skin, and bold red or black lips',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#f0e6e6',
      secondaryColor: '#0a0a0a',
      accentColor: '#cc0000',
      texture: 'bold-punk',
      shine: 'matte'
    },
    tags: ['eyeliner', 'bold', 'pale', 'classic']
  }
];

// ============================================================================
// CLOTHING ITEMS - STEAMPUNK COLLECTION
// ============================================================================

export const STEAMPUNK_ITEMS: BratzClothingItem[] = [
  {
    id: 'steam-top-001',
    name: 'Clockwork Corset',
    type: 'top',
    style: ['Steampunk', 'Victorian'],
    colors: ['Brown', 'Copper', 'Gold'],
    pattern: 'Gear embellishments',
    material: 'Brocade',
    description: 'Fitted corset adorned with working miniature gears and clock parts',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#5a3a1a',
      secondaryColor: '#b87333',
      accentColor: '#d4af37',
      texture: 'brocade-gears',
      shine: 'metallic',
      animationEffect: 'gear-spin'
    },
    tags: ['corset', 'gears', 'clockwork', 'victorian']
  },
  {
    id: 'steam-top-002',
    name: 'Aviator Blouse',
    type: 'top',
    style: ['Steampunk', 'Adventure'],
    colors: ['Cream', 'Brown'],
    material: 'Cotton with leather',
    description: 'High-collared blouse with leather shoulder guards and brass buttons',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#f5f5dc',
      secondaryColor: '#5a3a1a',
      accentColor: '#b8860b',
      texture: 'cotton-leather-brass',
      shine: 'satin'
    },
    tags: ['blouse', 'aviator', 'leather', 'brass']
  },
  {
    id: 'steam-top-003',
    name: 'Mechanical Arm Shrug',
    type: 'outerwear',
    style: ['Steampunk'],
    colors: ['Copper', 'Brown'],
    material: 'Leather with metal',
    description: 'Cropped shrug with articulated metal arm details',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#b87333',
      secondaryColor: '#5a3a1a',
      texture: 'leather-mechanical',
      shine: 'metallic',
      animationEffect: 'arm-articulate'
    },
    tags: ['shrug', 'mechanical', 'arm', 'copper']
  },
  {
    id: 'steam-bottom-001',
    name: 'Bustle Skirt with Gears',
    type: 'bottom',
    style: ['Steampunk', 'Victorian'],
    colors: ['Brown', 'Bronze'],
    pattern: 'Asymmetric with gear trim',
    material: 'Taffeta',
    description: 'Layered bustle skirt with exposed gear detailing along hem',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#5a3a1a',
      secondaryColor: '#cd7f32',
      texture: 'taffeta-bustle-gears',
      shine: 'satin',
      animationEffect: 'bustle-sway'
    },
    tags: ['skirt', 'bustle', 'gears', 'layered']
  },
  {
    id: 'steam-bottom-002',
    name: 'Airship Captain Pants',
    type: 'bottom',
    style: ['Steampunk'],
    colors: ['Brown', 'Black'],
    material: 'Leather',
    description: 'High-waisted leather pants with buckle details and tool loops',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#3a2a1a',
      secondaryColor: '#1a1a1a',
      accentColor: '#b8860b',
      texture: 'leather-buckled',
      shine: 'glossy'
    },
    tags: ['pants', 'leather', 'captain', 'buckles']
  },
  {
    id: 'steam-dress-001',
    name: 'Time Traveler Gown',
    type: 'dress',
    style: ['Steampunk', 'Victorian'],
    colors: ['Burgundy', 'Gold', 'Bronze'],
    pattern: 'Clock print',
    material: 'Brocade and velvet',
    description: 'Elaborate gown with clock face print, bustle, and brass gear accents',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#4a0a0a',
      secondaryColor: '#d4af37',
      accentColor: '#cd7f32',
      texture: 'brocade-clock-velvet',
      shine: 'satin',
      animationEffect: 'clock-tick'
    },
    tags: ['gown', 'clock', 'formal', 'elaborate']
  },
  {
    id: 'steam-outer-001',
    name: 'Inventor\'s Coat',
    type: 'outerwear',
    style: ['Steampunk'],
    colors: ['Brown', 'Copper'],
    material: 'Leather and canvas',
    description: 'Long coat with multiple pockets, gear clasps, and goggles holder',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#5a3a1a',
      secondaryColor: '#b87333',
      accentColor: '#d4af37',
      texture: 'leather-canvas-detailed',
      shine: 'matte',
      animationEffect: 'coat-flow'
    },
    tags: ['coat', 'inventor', 'pockets', 'long']
  },
  {
    id: 'steam-shoe-001',
    name: 'Victorian Gear Boots',
    type: 'shoes',
    style: ['Steampunk', 'Victorian'],
    colors: ['Brown', 'Copper'],
    material: 'Leather with metal',
    description: 'Lace-up boots with decorative gears and spat details',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#5a3a1a',
      accentColor: '#b87333',
      texture: 'leather-gear-spat',
      shine: 'glossy'
    },
    tags: ['boots', 'gears', 'victorian', 'lace-up']
  },
  {
    id: 'steam-acc-001',
    name: 'Aviator Goggles',
    type: 'accessory',
    style: ['Steampunk'],
    colors: ['Brass', 'Brown'],
    material: 'Metal and leather',
    description: 'Brass goggles with multiple lenses and leather strap',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#b8860b',
      secondaryColor: '#5a3a1a',
      texture: 'brass-leather-lens',
      shine: 'metallic',
      animationEffect: 'lens-glint'
    },
    tags: ['goggles', 'aviator', 'brass', 'essential']
  },
  {
    id: 'steam-acc-002',
    name: 'Pocket Watch Necklace',
    type: 'jewelry',
    style: ['Steampunk'],
    colors: ['Gold', 'Bronze'],
    material: 'Metal',
    description: 'Ornate pocket watch on long chain that actually opens',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#d4af37',
      secondaryColor: '#cd7f32',
      texture: 'metal-detailed-watch',
      shine: 'metallic',
      animationEffect: 'watch-swing'
    },
    tags: ['necklace', 'watch', 'pocket', 'chain']
  },
  {
    id: 'steam-head-001',
    name: 'Top Hat with Goggles',
    type: 'headwear',
    style: ['Steampunk'],
    colors: ['Brown', 'Brass'],
    material: 'Leather and felt',
    description: 'Tall top hat with goggles, gears, and feather accent',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#3a2a1a',
      secondaryColor: '#b8860b',
      accentColor: '#2a1a1a',
      texture: 'felt-leather-adorned',
      shine: 'satin',
      animationEffect: 'feather-flutter'
    },
    tags: ['hat', 'tophat', 'goggles', 'statement']
  },
  {
    id: 'steam-hair-001',
    name: 'Victorian Curls with Gear Pins',
    type: 'hair',
    style: ['Steampunk', 'Victorian'],
    colors: ['Auburn'],
    description: 'Elaborate upswept curls decorated with miniature gear hairpins',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#8a4a2a',
      accentColor: '#b87333',
      texture: 'curled-pinned',
      shine: 'glossy',
      animationEffect: 'curl-bounce'
    },
    tags: ['updo', 'curls', 'gears', 'elegant']
  },
  {
    id: 'steam-makeup-001',
    name: 'Inventor Chic',
    type: 'makeup',
    style: ['Steampunk'],
    colors: ['Bronze', 'Gold', 'Brown'],
    description: 'Warm bronzed skin, copper eyeshadow with gear stamps, and berry lips',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4a574',
      secondaryColor: '#b87333',
      accentColor: '#8a2a4a',
      texture: 'bronzed-metallic',
      shine: 'metallic'
    },
    tags: ['bronze', 'copper', 'warm', 'inventor']
  }
];

// ============================================================================
// CLOTHING ITEMS - K-POP COLLECTION
// ============================================================================

export const KPOP_ITEMS: BratzClothingItem[] = [
  {
    id: 'kpop-top-001',
    name: 'Oversized Cropped Blazer',
    type: 'top',
    style: ['K-Pop', 'Streetwear'],
    colors: ['Pastel Pink', 'White'],
    material: 'Cotton blend',
    description: 'Boxy cropped blazer with exaggerated shoulders and chain detail',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#ffb6c1',
      secondaryColor: '#ffffff',
      accentColor: '#c0c0c0',
      texture: 'structured-soft',
      shine: 'satin'
    },
    tags: ['blazer', 'cropped', 'oversized', 'trendy']
  },
  {
    id: 'kpop-top-002',
    name: 'Holographic Crop Top',
    type: 'top',
    style: ['K-Pop', 'Y2K'],
    colors: ['Holographic', 'Silver'],
    material: 'PVC blend',
    description: 'Fitted crop top in color-shifting holographic material',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#e6e6fa',
      texture: 'holographic-shift',
      shine: 'holographic',
      animationEffect: 'color-shift'
    },
    tags: ['holographic', 'crop', 'futuristic', 'statement']
  },
  {
    id: 'kpop-top-003',
    name: 'Ruffle Blouse with Bow',
    type: 'top',
    style: ['K-Pop', 'Feminine'],
    colors: ['Lavender', 'White'],
    pattern: 'Ruffled tiers',
    material: 'Chiffon',
    description: 'Romantic blouse with cascading ruffles and oversized bow at neck',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#e6e6fa',
      secondaryColor: '#ffffff',
      texture: 'chiffon-ruffle',
      shine: 'satin',
      animationEffect: 'ruffle-flutter'
    },
    tags: ['blouse', 'ruffle', 'bow', 'romantic']
  },
  {
    id: 'kpop-top-004',
    name: 'Mesh Panel Bodysuit',
    type: 'top',
    style: ['K-Pop', 'Stage'],
    colors: ['Black', 'Silver'],
    pattern: 'Geometric mesh',
    material: 'Spandex and mesh',
    description: 'Performance bodysuit with strategic mesh cutouts and rhinestone details',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#c0c0c0',
      texture: 'spandex-mesh-rhinestone',
      shine: 'glossy',
      transparency: 0.3,
      animationEffect: 'sparkle'
    },
    tags: ['bodysuit', 'mesh', 'performance', 'rhinestone']
  },
  {
    id: 'kpop-bottom-001',
    name: 'Pleated Tennis Skirt',
    type: 'bottom',
    style: ['K-Pop', 'Preppy'],
    colors: ['White', 'Pink trim'],
    pattern: 'Pleated',
    material: 'Polyester',
    description: 'Classic pleated mini skirt with contrast color trim',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#ffffff',
      accentColor: '#ffb6c1',
      texture: 'pleated-crisp',
      shine: 'matte',
      animationEffect: 'pleat-sway'
    },
    tags: ['skirt', 'pleated', 'tennis', 'mini']
  },
  {
    id: 'kpop-bottom-002',
    name: 'High-Waist Cargo Pants',
    type: 'bottom',
    style: ['K-Pop', 'Streetwear'],
    colors: ['White', 'Silver hardware'],
    material: 'Cotton',
    description: 'Baggy cargo pants with multiple pockets and chain accessories',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#f5f5f5',
      accentColor: '#c0c0c0',
      texture: 'cargo-utility',
      shine: 'matte'
    },
    tags: ['pants', 'cargo', 'baggy', 'utility']
  },
  {
    id: 'kpop-bottom-003',
    name: 'Vinyl Mini Shorts',
    type: 'bottom',
    style: ['K-Pop', 'Stage'],
    colors: ['Hot Pink'],
    material: 'Vinyl',
    description: 'High-shine vinyl shorts perfect for performances',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#ff1493',
      texture: 'vinyl-glossy',
      shine: 'glossy',
      animationEffect: 'shine-catch'
    },
    tags: ['shorts', 'vinyl', 'shiny', 'bold']
  },
  {
    id: 'kpop-dress-001',
    name: 'Tiered Tulle Princess Dress',
    type: 'dress',
    style: ['K-Pop', 'Fairy'],
    colors: ['Baby Pink', 'Glitter'],
    pattern: 'Layered tulle',
    material: 'Tulle and satin',
    description: 'Dreamy mini dress with multiple layers of sparkly tulle',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#ffc0cb',
      texture: 'tulle-sparkle-layered',
      shine: 'glitter',
      animationEffect: 'shimmer-float'
    },
    tags: ['dress', 'tulle', 'princess', 'sparkly']
  },
  {
    id: 'kpop-outer-001',
    name: 'Oversized Varsity Jacket',
    type: 'outerwear',
    style: ['K-Pop', 'Streetwear'],
    colors: ['Pastel Blue', 'White'],
    pattern: 'Color block',
    material: 'Wool blend',
    description: 'Boyfriend-fit varsity jacket with contrast sleeves and patches',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#add8e6',
      secondaryColor: '#ffffff',
      texture: 'wool-leather',
      shine: 'matte'
    },
    tags: ['jacket', 'varsity', 'oversized', 'sporty']
  },
  {
    id: 'kpop-shoe-001',
    name: 'Chunky Platform Sneakers',
    type: 'shoes',
    style: ['K-Pop', 'Streetwear'],
    colors: ['White', 'Pastel accents'],
    material: 'Leather and mesh',
    description: 'Ultra-chunky platform sneakers with pastel color blocking',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#ffffff',
      secondaryColor: '#e6e6fa',
      accentColor: '#ffb6c1',
      texture: 'chunky-platform',
      shine: 'matte'
    },
    tags: ['sneakers', 'platform', 'chunky', 'trendy']
  },
  {
    id: 'kpop-shoe-002',
    name: 'Strappy Platform Heels',
    type: 'shoes',
    style: ['K-Pop', 'Stage'],
    colors: ['Silver', 'Clear'],
    material: 'PVC and metal',
    description: 'Clear strappy heels with silver platform and rhinestones',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#c0c0c0',
      texture: 'clear-rhinestone',
      shine: 'metallic',
      transparency: 0.8,
      animationEffect: 'diamond-sparkle'
    },
    tags: ['heels', 'platform', 'clear', 'sparkly']
  },
  {
    id: 'kpop-acc-001',
    name: 'Heart-Shaped Sunglasses',
    type: 'accessory',
    style: ['K-Pop', 'Y2K'],
    colors: ['Pink', 'Clear'],
    material: 'Plastic',
    description: 'Oversized heart-shaped sunglasses with gradient lenses',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#ff69b4',
      texture: 'plastic-gradient',
      shine: 'glossy',
      transparency: 0.5
    },
    tags: ['sunglasses', 'heart', 'cute', 'y2k']
  },
  {
    id: 'kpop-acc-002',
    name: 'Layered Pearl Chains',
    type: 'jewelry',
    style: ['K-Pop', 'Elegant'],
    colors: ['White', 'Gold'],
    material: 'Faux pearl and gold',
    description: 'Multiple strands of pearls mixed with gold chains',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#fffaf0',
      accentColor: '#d4af37',
      texture: 'pearl-chain-layered',
      shine: 'satin',
      animationEffect: 'pearl-gleam'
    },
    tags: ['necklace', 'pearls', 'layered', 'elegant']
  },
  {
    id: 'kpop-hair-001',
    name: 'Two-Tone Split Hair',
    type: 'hair',
    style: ['K-Pop'],
    colors: ['Black', 'Blonde'],
    description: 'Dramatic half-and-half hair color split down the middle',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#f5deb3',
      texture: 'sleek-split',
      shine: 'glossy'
    },
    tags: ['two-tone', 'split', 'dramatic', 'trendy']
  },
  {
    id: 'kpop-hair-002',
    name: 'Cotton Candy Waves',
    type: 'hair',
    style: ['K-Pop', 'Fairy'],
    colors: ['Pink', 'Purple', 'Blue'],
    description: 'Long wavy hair in gradient pastel rainbow colors',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#ffb6c1',
      secondaryColor: '#dda0dd',
      accentColor: '#add8e6',
      texture: 'wavy-gradient',
      shine: 'glossy',
      animationEffect: 'gradient-flow'
    },
    tags: ['pastel', 'rainbow', 'wavy', 'dreamy']
  },
  {
    id: 'kpop-hair-003',
    name: 'Sleek High Ponytail',
    type: 'hair',
    style: ['K-Pop', 'Stage'],
    colors: ['Black'],
    description: 'Ultra-sleek high ponytail with face-framing strands',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'sleek-ponytail',
      shine: 'glossy',
      animationEffect: 'ponytail-sway'
    },
    tags: ['ponytail', 'sleek', 'high', 'chic']
  },
  {
    id: 'kpop-makeup-001',
    name: 'Glass Skin Glam',
    type: 'makeup',
    style: ['K-Pop'],
    colors: ['Dewy', 'Pink', 'Shimmer'],
    description: 'Flawless dewy skin, gradient lips, soft pink blush, and sparkly eye accents',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#ffe4e1',
      secondaryColor: '#ffb6c1',
      accentColor: '#ffffff',
      texture: 'dewy-glass',
      shine: 'glossy',
      animationEffect: 'glow-effect'
    },
    tags: ['glass-skin', 'dewy', 'gradient-lips', 'glam']
  },
  {
    id: 'kpop-makeup-002',
    name: 'Glitter Fantasy',
    type: 'makeup',
    style: ['K-Pop', 'Stage'],
    colors: ['Silver', 'Pink', 'Holographic'],
    description: 'Heavy glitter eye look with rhinestone accents and glossy lips',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#c0c0c0',
      secondaryColor: '#ff69b4',
      texture: 'glitter-rhinestone',
      shine: 'glitter',
      animationEffect: 'sparkle-burst'
    },
    tags: ['glitter', 'rhinestone', 'stage', 'dramatic']
  },
  {
    id: 'kpop-head-001',
    name: 'Oversized Hair Bow',
    type: 'headwear',
    style: ['K-Pop', 'Cute'],
    colors: ['Hot Pink'],
    material: 'Satin',
    description: 'Giant satin bow hair accessory',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#ff1493',
      texture: 'satin-bow',
      shine: 'satin',
      animationEffect: 'bow-flutter'
    },
    tags: ['bow', 'oversized', 'cute', 'statement']
  }
];

// ============================================================================
// CLOTHING ITEMS - HIP HOP COLLECTION
// ============================================================================

export const HIPHOP_ITEMS: BratzClothingItem[] = [
  {
    id: 'hiphop-top-001',
    name: 'Oversized Graphic Hoodie',
    type: 'top',
    style: ['Hip Hop', 'Streetwear'],
    colors: ['Black', 'Neon Green'],
    pattern: 'Bold graphic print',
    material: 'Cotton fleece',
    description: 'Extra oversized hoodie with bold street art graphic',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#39ff14',
      texture: 'fleece-printed',
      shine: 'matte'
    },
    tags: ['hoodie', 'oversized', 'graphic', 'street']
  },
  {
    id: 'hiphop-top-002',
    name: 'Vintage Basketball Jersey',
    type: 'top',
    style: ['Hip Hop', 'Sports'],
    colors: ['Red', 'White', 'Blue'],
    pattern: 'Number print',
    material: 'Mesh',
    description: 'Oversized throwback basketball jersey with vintage team graphics',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#ffffff',
      accentColor: '#00008b',
      texture: 'mesh-sports',
      shine: 'matte'
    },
    tags: ['jersey', 'basketball', 'vintage', 'sports']
  },
  {
    id: 'hiphop-top-003',
    name: 'Cropped Logo Tee',
    type: 'top',
    style: ['Hip Hop', 'Streetwear'],
    colors: ['White', 'Black'],
    pattern: 'Brand logo',
    material: 'Cotton',
    description: 'Cropped tee with oversized designer-inspired logo',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#ffffff',
      secondaryColor: '#000000',
      texture: 'cotton-printed',
      shine: 'matte'
    },
    tags: ['tee', 'cropped', 'logo', 'designer']
  },
  {
    id: 'hiphop-top-004',
    name: 'Puffer Crop Vest',
    type: 'outerwear',
    style: ['Hip Hop', 'Streetwear'],
    colors: ['Metallic Silver'],
    material: 'Nylon',
    description: 'Cropped puffer vest in metallic silver with oversized collar',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#c0c0c0',
      texture: 'puffer-metallic',
      shine: 'metallic',
      animationEffect: 'metallic-shine'
    },
    tags: ['vest', 'puffer', 'metallic', 'cropped']
  },
  {
    id: 'hiphop-bottom-001',
    name: 'Baggy Cargo Jeans',
    type: 'bottom',
    style: ['Hip Hop', 'Streetwear'],
    colors: ['Light Blue Denim'],
    pattern: 'Distressed',
    material: 'Denim',
    description: 'Super baggy low-rise cargo jeans with multiple pockets',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#87ceeb',
      texture: 'denim-distressed-baggy',
      shine: 'matte'
    },
    tags: ['jeans', 'baggy', 'cargo', 'denim']
  },
  {
    id: 'hiphop-bottom-002',
    name: 'Track Pants with Stripes',
    type: 'bottom',
    style: ['Hip Hop', 'Athletic'],
    colors: ['Black', 'White stripes'],
    material: 'Polyester',
    description: 'Classic track pants with contrast side stripes and snap buttons',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#ffffff',
      texture: 'track-striped',
      shine: 'satin'
    },
    tags: ['track-pants', 'stripes', 'athletic', 'classic']
  },
  {
    id: 'hiphop-bottom-003',
    name: 'Leather Mini Skirt',
    type: 'bottom',
    style: ['Hip Hop', 'Club'],
    colors: ['Black'],
    material: 'Faux leather',
    description: 'High-waisted leather mini skirt with gold zipper details',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#d4af37',
      texture: 'leather-zippered',
      shine: 'glossy'
    },
    tags: ['skirt', 'leather', 'mini', 'club']
  },
  {
    id: 'hiphop-outer-001',
    name: 'Oversized Denim Jacket',
    type: 'outerwear',
    style: ['Hip Hop', 'Streetwear'],
    colors: ['Medium Blue Denim'],
    pattern: 'Distressed with patches',
    material: 'Denim',
    description: 'Oversized vintage-style denim jacket with custom patches',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#4169e1',
      texture: 'denim-patched',
      shine: 'matte'
    },
    tags: ['jacket', 'denim', 'oversized', 'patches']
  },
  {
    id: 'hiphop-outer-002',
    name: 'Fur-Trimmed Parka',
    type: 'outerwear',
    style: ['Hip Hop', 'Luxury'],
    colors: ['Army Green', 'Brown fur'],
    material: 'Nylon with faux fur',
    description: 'Oversized parka with dramatic faux fur hood trim',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#556b2f',
      secondaryColor: '#8b4513',
      texture: 'nylon-fur-trim',
      shine: 'matte',
      animationEffect: 'fur-texture'
    },
    tags: ['parka', 'fur', 'oversized', 'luxury']
  },
  {
    id: 'hiphop-shoe-001',
    name: 'Classic High-Top Sneakers',
    type: 'shoes',
    style: ['Hip Hop', 'Streetwear'],
    colors: ['White', 'Red'],
    material: 'Leather',
    description: 'Iconic high-top basketball sneakers with air cushion sole',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#ffffff',
      accentColor: '#cc0000',
      texture: 'leather-athletic',
      shine: 'matte'
    },
    tags: ['sneakers', 'high-top', 'classic', 'basketball']
  },
  {
    id: 'hiphop-shoe-002',
    name: 'Chunky Designer Sneakers',
    type: 'shoes',
    style: ['Hip Hop', 'Luxury'],
    colors: ['Multi-color', 'Neon'],
    material: 'Mixed materials',
    description: 'Ultra-chunky designer sneakers with multiple color panels',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#ffffff',
      secondaryColor: '#ff6b6b',
      accentColor: '#4ecdc4',
      texture: 'chunky-multi',
      shine: 'matte',
      animationEffect: 'color-pop'
    },
    tags: ['sneakers', 'chunky', 'designer', 'bold']
  },
  {
    id: 'hiphop-acc-001',
    name: 'Thick Gold Chain',
    type: 'jewelry',
    style: ['Hip Hop'],
    colors: ['Gold'],
    material: 'Gold-plated',
    description: 'Chunky Cuban link chain necklace',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4af37',
      texture: 'gold-chain-thick',
      shine: 'metallic',
      animationEffect: 'gold-gleam'
    },
    tags: ['chain', 'gold', 'cuban-link', 'bold']
  },
  {
    id: 'hiphop-acc-002',
    name: 'Nameplate Necklace',
    type: 'jewelry',
    style: ['Hip Hop', 'Personalized'],
    colors: ['Gold'],
    material: 'Gold-plated',
    description: 'Custom nameplate necklace with bamboo-style lettering',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#d4af37',
      texture: 'gold-nameplate',
      shine: 'metallic'
    },
    tags: ['necklace', 'nameplate', 'custom', 'gold']
  },
  {
    id: 'hiphop-acc-003',
    name: 'Bucket Hat',
    type: 'headwear',
    style: ['Hip Hop', 'Streetwear'],
    colors: ['Black'],
    material: 'Cotton',
    description: 'Classic bucket hat with small logo detail',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'cotton-bucket',
      shine: 'matte'
    },
    tags: ['hat', 'bucket', 'classic', 'streetwear']
  },
  {
    id: 'hiphop-acc-004',
    name: 'Oversized Hoop Earrings',
    type: 'jewelry',
    style: ['Hip Hop', 'Statement'],
    colors: ['Gold'],
    material: 'Gold-plated',
    description: 'Extra large bamboo-textured hoop earrings',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4af37',
      texture: 'gold-bamboo-hoop',
      shine: 'metallic',
      animationEffect: 'hoop-sway'
    },
    tags: ['earrings', 'hoops', 'oversized', 'bamboo']
  },
  {
    id: 'hiphop-bag-001',
    name: 'Mini Designer Bag',
    type: 'bag',
    style: ['Hip Hop', 'Luxury'],
    colors: ['Black', 'Gold hardware'],
    material: 'Leather',
    description: 'Tiny structured designer bag with gold chain strap',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#1a1a1a',
      accentColor: '#d4af37',
      texture: 'leather-structured',
      shine: 'glossy'
    },
    tags: ['bag', 'designer', 'mini', 'luxury']
  },
  {
    id: 'hiphop-hair-001',
    name: 'Long Box Braids',
    type: 'hair',
    style: ['Hip Hop', 'Protective'],
    colors: ['Black', 'Brown tips'],
    description: 'Ultra-long box braids with ombre ends',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#1a0a0a',
      secondaryColor: '#5a3a1a',
      texture: 'braids-long',
      shine: 'matte',
      animationEffect: 'braid-sway'
    },
    tags: ['braids', 'box-braids', 'long', 'protective']
  },
  {
    id: 'hiphop-hair-002',
    name: 'Slicked Back Bun',
    type: 'hair',
    style: ['Hip Hop', 'Sleek'],
    colors: ['Black'],
    description: 'Super sleek low bun with baby hair styling',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'sleek-bun-babyhair',
      shine: 'glossy'
    },
    tags: ['bun', 'sleek', 'baby-hairs', 'polished']
  },
  {
    id: 'hiphop-makeup-001',
    name: 'Beat to the Gods',
    type: 'makeup',
    style: ['Hip Hop', 'Glam'],
    colors: ['Bronze', 'Nude', 'Gold'],
    description: 'Full glam with contoured face, nude glossy lips, and golden highlight',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4a574',
      secondaryColor: '#c4a484',
      accentColor: '#d4af37',
      texture: 'beat-contoured',
      shine: 'glossy',
      animationEffect: 'highlight-glow'
    },
    tags: ['contour', 'glam', 'highlight', 'nude-lip']
  }
];

// ============================================================================
// CLOTHING ITEMS - R&B COLLECTION
// ============================================================================

export const RNB_ITEMS: BratzClothingItem[] = [
  {
    id: 'rnb-top-001',
    name: 'Satin Slip Top',
    type: 'top',
    style: ['R&B', 'Sensual'],
    colors: ['Champagne'],
    material: 'Silk satin',
    description: 'Delicate satin camisole with lace trim',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#f5e6d3',
      texture: 'satin-lace-trim',
      shine: 'satin',
      animationEffect: 'silk-shimmer'
    },
    tags: ['camisole', 'satin', 'delicate', 'romantic']
  },
  {
    id: 'rnb-top-002',
    name: 'Off-Shoulder Sweater',
    type: 'top',
    style: ['R&B', 'Cozy'],
    colors: ['Dusty Rose'],
    material: 'Cashmere blend',
    description: 'Soft oversized sweater falling off one shoulder',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4a5a5',
      texture: 'cashmere-soft',
      shine: 'matte'
    },
    tags: ['sweater', 'off-shoulder', 'cozy', 'soft']
  },
  {
    id: 'rnb-top-003',
    name: 'Mesh Bodysuit',
    type: 'top',
    style: ['R&B', 'Stage'],
    colors: ['Nude', 'Crystal'],
    pattern: 'Crystal embellished',
    material: 'Mesh',
    description: 'Sheer mesh bodysuit covered in crystal embellishments',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#d4a574',
      accentColor: '#ffffff',
      texture: 'mesh-crystal',
      shine: 'glitter',
      transparency: 0.6,
      animationEffect: 'crystal-sparkle'
    },
    tags: ['bodysuit', 'mesh', 'crystal', 'stage']
  },
  {
    id: 'rnb-bottom-001',
    name: 'High-Slit Maxi Skirt',
    type: 'bottom',
    style: ['R&B', 'Sensual'],
    colors: ['Black'],
    material: 'Jersey',
    description: 'Floor-length skirt with dramatic thigh-high slit',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'jersey-flowing',
      shine: 'matte',
      animationEffect: 'slit-reveal'
    },
    tags: ['skirt', 'maxi', 'slit', 'dramatic']
  },
  {
    id: 'rnb-bottom-002',
    name: 'Velvet Flares',
    type: 'bottom',
    style: ['R&B', 'Retro'],
    colors: ['Burgundy'],
    material: 'Velvet',
    description: 'High-waisted velvet bell bottoms',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#722f37',
      texture: 'velvet-flare',
      shine: 'satin',
      animationEffect: 'flare-sway'
    },
    tags: ['pants', 'flare', 'velvet', 'retro']
  },
  {
    id: 'rnb-dress-001',
    name: 'Slinky Mini Dress',
    type: 'dress',
    style: ['R&B', 'Club'],
    colors: ['Metallic Gold'],
    material: 'Metallic jersey',
    description: 'Body-hugging mini dress in liquid gold fabric',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#d4af37',
      texture: 'metallic-jersey',
      shine: 'metallic',
      animationEffect: 'liquid-gold'
    },
    tags: ['dress', 'mini', 'metallic', 'bodycon']
  },
  {
    id: 'rnb-dress-002',
    name: 'Feather Trim Gown',
    type: 'dress',
    style: ['R&B', 'Red Carpet'],
    colors: ['White', 'Blush feathers'],
    material: 'Satin with feathers',
    description: 'Elegant gown with cascading feather trim at hem',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#ffffff',
      secondaryColor: '#ffe4e1',
      texture: 'satin-feather',
      shine: 'satin',
      animationEffect: 'feather-flutter'
    },
    tags: ['gown', 'feathers', 'elegant', 'red-carpet']
  },
  {
    id: 'rnb-outer-001',
    name: 'Faux Fur Coat',
    type: 'outerwear',
    style: ['R&B', 'Luxury'],
    colors: ['Cream'],
    material: 'Faux fur',
    description: 'Luxurious long faux fur coat',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#fffaf0',
      texture: 'faux-fur-plush',
      shine: 'matte',
      animationEffect: 'fur-movement'
    },
    tags: ['coat', 'fur', 'luxury', 'statement']
  },
  {
    id: 'rnb-shoe-001',
    name: 'Strappy Stilettos',
    type: 'shoes',
    style: ['R&B', 'Sexy'],
    colors: ['Nude'],
    material: 'Patent leather',
    description: 'Barely-there strappy heels with stiletto heel',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4a574',
      texture: 'patent-strappy',
      shine: 'glossy'
    },
    tags: ['heels', 'strappy', 'stiletto', 'nude']
  },
  {
    id: 'rnb-shoe-002',
    name: 'Thigh-High Boots',
    type: 'shoes',
    style: ['R&B', 'Statement'],
    colors: ['Black'],
    material: 'Suede',
    description: 'Fitted suede boots that reach the thigh',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'suede-fitted',
      shine: 'matte'
    },
    tags: ['boots', 'thigh-high', 'suede', 'statement']
  },
  {
    id: 'rnb-acc-001',
    name: 'Diamond Drop Earrings',
    type: 'jewelry',
    style: ['R&B', 'Elegant'],
    colors: ['Diamond', 'Silver'],
    material: 'Crystal and silver',
    description: 'Long cascading crystal drop earrings',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#ffffff',
      accentColor: '#c0c0c0',
      texture: 'crystal-drop',
      shine: 'glitter',
      animationEffect: 'diamond-sparkle'
    },
    tags: ['earrings', 'drop', 'crystal', 'elegant']
  },
  {
    id: 'rnb-hair-001',
    name: 'Sleek Long Waves',
    type: 'hair',
    style: ['R&B'],
    colors: ['Black'],
    description: 'Ultra-shiny long black hair with soft waves',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'sleek-wave',
      shine: 'glossy',
      animationEffect: 'wave-flow'
    },
    tags: ['long', 'waves', 'sleek', 'shiny']
  },
  {
    id: 'rnb-hair-002',
    name: 'Honey Blonde Curls',
    type: 'hair',
    style: ['R&B'],
    colors: ['Honey Blonde'],
    description: 'Voluminous curls in warm honey blonde',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#daa520',
      texture: 'curly-voluminous',
      shine: 'glossy',
      animationEffect: 'curl-bounce'
    },
    tags: ['curls', 'blonde', 'voluminous', 'warm']
  },
  {
    id: 'rnb-makeup-001',
    name: '90s R&B Glam',
    type: 'makeup',
    style: ['R&B', 'Retro'],
    colors: ['Brown', 'Nude', 'Shimmer'],
    description: 'Brown lip liner with nude gloss, soft brown smoky eye, and subtle shimmer',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4a574',
      secondaryColor: '#8b4513',
      accentColor: '#ffe4c4',
      texture: '90s-glam',
      shine: 'glossy'
    },
    tags: ['90s', 'brown-lip', 'smoky', 'classic']
  }
];

// ============================================================================
// CLOTHING ITEMS - ANIME COLLECTION
// ============================================================================

export const ANIME_ITEMS: BratzClothingItem[] = [
  {
    id: 'anime-top-001',
    name: 'Sailor Uniform Top',
    type: 'top',
    style: ['Anime', 'School'],
    colors: ['White', 'Navy'],
    pattern: 'Sailor collar',
    material: 'Cotton',
    description: 'Classic Japanese sailor fuku top with navy collar and red ribbon',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#ffffff',
      secondaryColor: '#000080',
      accentColor: '#cc0000',
      texture: 'cotton-crisp-sailor',
      shine: 'matte'
    },
    tags: ['sailor', 'school', 'uniform', 'classic']
  },
  {
    id: 'anime-top-002',
    name: 'Maid Cafe Top',
    type: 'top',
    style: ['Anime', 'Maid'],
    colors: ['Black', 'White'],
    pattern: 'Frilly trim',
    material: 'Cotton with lace',
    description: 'Classic maid uniform top with white apron and puffy sleeves',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#ffffff',
      texture: 'cotton-frilly',
      shine: 'satin'
    },
    tags: ['maid', 'frilly', 'costume', 'cute']
  },
  {
    id: 'anime-top-003',
    name: 'Magical Girl Bodice',
    type: 'top',
    style: ['Anime', 'Magical Girl'],
    colors: ['Pink', 'White', 'Gold'],
    pattern: 'Bow and heart details',
    material: 'Satin',
    description: 'Sparkly magical girl transformation outfit bodice with oversized bow',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#ff69b4',
      secondaryColor: '#ffffff',
      accentColor: '#d4af37',
      texture: 'satin-sparkle',
      shine: 'glitter',
      animationEffect: 'magical-sparkle'
    },
    tags: ['magical-girl', 'sparkly', 'bow', 'fantasy']
  },
  {
    id: 'anime-bottom-001',
    name: 'Pleated School Skirt',
    type: 'bottom',
    style: ['Anime', 'School'],
    colors: ['Navy', 'Plaid'],
    pattern: 'Pleated',
    material: 'Polyester',
    description: 'Short pleated skirt in classic Japanese school style',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#000080',
      texture: 'pleated-uniform',
      shine: 'matte',
      animationEffect: 'pleat-sway'
    },
    tags: ['skirt', 'pleated', 'school', 'uniform']
  },
  {
    id: 'anime-bottom-002',
    name: 'Magical Girl Tutu',
    type: 'bottom',
    style: ['Anime', 'Magical Girl'],
    colors: ['Pink', 'Rainbow shimmer'],
    pattern: 'Layered tulle',
    material: 'Tulle',
    description: 'Multi-layered tutu that glows and sparkles with movement',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#ff69b4',
      texture: 'tulle-rainbow-shimmer',
      shine: 'holographic',
      animationEffect: 'rainbow-glow'
    },
    tags: ['tutu', 'magical', 'rainbow', 'sparkle']
  },
  {
    id: 'anime-dress-001',
    name: 'Lolita Princess Dress',
    type: 'dress',
    style: ['Anime', 'Lolita'],
    colors: ['Pink', 'White', 'Lace'],
    pattern: 'Bows and ruffles',
    material: 'Cotton and lace',
    description: 'Sweet Lolita dress with petticoat, bows, and intricate lace trim',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#ffc0cb',
      secondaryColor: '#ffffff',
      texture: 'cotton-lace-ruffle',
      shine: 'satin',
      animationEffect: 'petticoat-puff'
    },
    tags: ['lolita', 'princess', 'ruffles', 'bows']
  },
  {
    id: 'anime-dress-002',
    name: 'Gothic Lolita Dress',
    type: 'dress',
    style: ['Anime', 'Gothic Lolita'],
    colors: ['Black', 'White', 'Red'],
    pattern: 'Cross and rose motifs',
    material: 'Velvet and lace',
    description: 'Dark elegant Lolita dress with cross details and red ribbon accents',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#ffffff',
      accentColor: '#8b0000',
      texture: 'velvet-lace-detailed',
      shine: 'satin'
    },
    tags: ['gothic-lolita', 'dark', 'elegant', 'crosses']
  },
  {
    id: 'anime-shoe-001',
    name: 'Mary Jane Platforms',
    type: 'shoes',
    style: ['Anime', 'Lolita'],
    colors: ['Black', 'Pink'],
    material: 'Patent leather',
    description: 'Chunky platform Mary Janes with heart-shaped buckles',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#ff69b4',
      texture: 'patent-chunky',
      shine: 'glossy'
    },
    tags: ['shoes', 'platform', 'mary-jane', 'cute']
  },
  {
    id: 'anime-acc-001',
    name: 'Cat Ear Headband',
    type: 'headwear',
    style: ['Anime', 'Kawaii'],
    colors: ['Black', 'Pink inner'],
    material: 'Plush and metal',
    description: 'Fluffy cat ears on headband with pink inner ear',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#ff69b4',
      texture: 'plush-ears',
      shine: 'matte'
    },
    tags: ['ears', 'cat', 'kawaii', 'cosplay']
  },
  {
    id: 'anime-acc-002',
    name: 'Magical Girl Wand',
    type: 'accessory',
    style: ['Anime', 'Magical Girl'],
    colors: ['Pink', 'Gold', 'Crystal'],
    material: 'Plastic with gems',
    description: 'Sparkling transformation wand with heart crystal top',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#ff69b4',
      secondaryColor: '#d4af37',
      accentColor: '#ffffff',
      texture: 'crystal-sparkle',
      shine: 'glitter',
      animationEffect: 'wand-glow'
    },
    tags: ['wand', 'magical', 'crystal', 'prop']
  },
  {
    id: 'anime-hair-001',
    name: 'Twin Tails with Buns',
    type: 'hair',
    style: ['Anime', 'Kawaii'],
    colors: ['Pink'],
    description: 'Iconic anime twin tails with odango buns, Sailor Moon inspired',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#ff69b4',
      texture: 'twin-tail-buns',
      shine: 'glossy',
      animationEffect: 'tail-bounce'
    },
    tags: ['twin-tails', 'odango', 'pink', 'iconic']
  },
  {
    id: 'anime-hair-002',
    name: 'Long Straight Hime Cut',
    type: 'hair',
    style: ['Anime', 'Traditional'],
    colors: ['Black'],
    description: 'Long straight black hair with traditional hime cut bangs',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'straight-hime',
      shine: 'glossy'
    },
    tags: ['hime', 'straight', 'traditional', 'elegant']
  },
  {
    id: 'anime-makeup-001',
    name: 'Anime Eyes',
    type: 'makeup',
    style: ['Anime'],
    colors: ['Large eyes', 'Pink blush', 'Glossy lips'],
    description: 'Exaggerated anime-style makeup with huge sparkling eyes and rosy cheeks',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#ffe4e1',
      secondaryColor: '#ff69b4',
      accentColor: '#ffffff',
      texture: 'anime-sparkle',
      shine: 'glossy',
      animationEffect: 'eye-sparkle'
    },
    tags: ['anime', 'big-eyes', 'cute', 'kawaii']
  }
];

// ============================================================================
// CLOTHING ITEMS - COSPLAY COLLECTION
// ============================================================================

export const COSPLAY_ITEMS: BratzClothingItem[] = [
  {
    id: 'cos-top-001',
    name: 'Superhero Bodysuit Top',
    type: 'top',
    style: ['Cosplay', 'Superhero'],
    colors: ['Red', 'Blue', 'Gold'],
    pattern: 'Logo emblem',
    material: 'Spandex',
    description: 'Fitted superhero bodysuit top with iconic emblem',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#00008b',
      accentColor: '#d4af37',
      texture: 'spandex-printed',
      shine: 'glossy'
    },
    tags: ['superhero', 'bodysuit', 'costume', 'comic']
  },
  {
    id: 'cos-top-002',
    name: 'Fantasy Armor Breastplate',
    type: 'top',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Silver', 'Blue accents'],
    material: 'Foam and metallic fabric',
    description: 'Detailed fantasy armor chestpiece with gem accents',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#c0c0c0',
      secondaryColor: '#4169e1',
      texture: 'armor-detailed',
      shine: 'metallic',
      animationEffect: 'armor-glint'
    },
    tags: ['armor', 'fantasy', 'warrior', 'detailed']
  },
  {
    id: 'cos-top-003',
    name: 'Witch Corset',
    type: 'top',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Purple', 'Black', 'Silver'],
    pattern: 'Moon and stars',
    material: 'Brocade',
    description: 'Mystical witch corset with celestial embroidery',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#4b0082',
      secondaryColor: '#0a0a0a',
      accentColor: '#c0c0c0',
      texture: 'brocade-celestial',
      shine: 'satin',
      animationEffect: 'star-twinkle'
    },
    tags: ['witch', 'corset', 'celestial', 'mystical']
  },
  {
    id: 'cos-bottom-001',
    name: 'Elf Warrior Skirt',
    type: 'bottom',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Forest Green', 'Gold'],
    pattern: 'Leaf motifs',
    material: 'Faux suede',
    description: 'Asymmetric warrior skirt with leather leaf details',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#228b22',
      accentColor: '#d4af37',
      texture: 'suede-leaf',
      shine: 'matte',
      animationEffect: 'leaf-flutter'
    },
    tags: ['elf', 'warrior', 'fantasy', 'nature']
  },
  {
    id: 'cos-dress-001',
    name: 'Fairy Queen Gown',
    type: 'dress',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Iridescent', 'Green', 'Gold'],
    pattern: 'Petal layers',
    material: 'Organza and silk',
    description: 'Ethereal fairy gown with petal-shaped layers that shimmer',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#98fb98',
      secondaryColor: '#daa520',
      texture: 'organza-petal-iridescent',
      shine: 'holographic',
      animationEffect: 'fairy-shimmer'
    },
    tags: ['fairy', 'queen', 'ethereal', 'magical']
  },
  {
    id: 'cos-dress-002',
    name: 'Video Game Princess Gown',
    type: 'dress',
    style: ['Cosplay', 'Gaming'],
    colors: ['Pink', 'White', 'Blue gems'],
    material: 'Satin and tulle',
    description: 'Iconic video game princess dress with puffed sleeves and gem brooch',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#ffb6c1',
      secondaryColor: '#ffffff',
      accentColor: '#4169e1',
      texture: 'satin-princess',
      shine: 'satin',
      animationEffect: 'gem-sparkle'
    },
    tags: ['princess', 'gaming', 'iconic', 'elegant']
  },
  {
    id: 'cos-outer-001',
    name: 'Dragon Scale Cape',
    type: 'outerwear',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Black', 'Purple', 'Iridescent'],
    pattern: 'Scale texture',
    material: 'Specialty fabric',
    description: 'Dramatic cape with iridescent dragon scale pattern',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#1a0a2a',
      secondaryColor: '#4b0082',
      texture: 'scale-iridescent',
      shine: 'holographic',
      animationEffect: 'scale-shimmer'
    },
    tags: ['cape', 'dragon', 'scales', 'dramatic']
  },
  {
    id: 'cos-shoe-001',
    name: 'Elven Boots',
    type: 'shoes',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Brown', 'Green trim'],
    material: 'Faux leather',
    description: 'Knee-high elven boots with leaf-shaped cuffs',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#8b4513',
      accentColor: '#228b22',
      texture: 'leather-leaf-cuff',
      shine: 'matte'
    },
    tags: ['boots', 'elven', 'fantasy', 'nature']
  },
  {
    id: 'cos-acc-001',
    name: 'Elf Ears',
    type: 'accessory',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Skin tone'],
    material: 'Silicone',
    description: 'Realistic pointed elf ear tips',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#d4a574',
      texture: 'silicone-realistic',
      shine: 'matte'
    },
    tags: ['ears', 'elf', 'prosthetic', 'fantasy']
  },
  {
    id: 'cos-acc-002',
    name: 'Fairy Wings',
    type: 'accessory',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Iridescent', 'Pink', 'Purple'],
    material: 'Wire and organza',
    description: 'Large fairy wings with LED lights and iridescent fabric',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#dda0dd',
      secondaryColor: '#ff69b4',
      texture: 'organza-iridescent-lit',
      shine: 'holographic',
      animationEffect: 'wing-flutter-glow'
    },
    tags: ['wings', 'fairy', 'led', 'magical']
  },
  {
    id: 'cos-hair-001',
    name: 'Anime Character Wig - Blue',
    type: 'hair',
    style: ['Cosplay', 'Anime'],
    colors: ['Electric Blue'],
    description: 'Styled anime character wig in vibrant electric blue',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#00bfff',
      texture: 'wig-styled',
      shine: 'glossy'
    },
    tags: ['wig', 'anime', 'blue', 'styled']
  },
  {
    id: 'cos-hair-002',
    name: 'Princess Crown Updo',
    type: 'hair',
    style: ['Cosplay', 'Royalty'],
    colors: ['Blonde', 'Gold crown'],
    description: 'Elaborate royal updo with integrated tiara',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#f5deb3',
      accentColor: '#d4af37',
      texture: 'updo-crown',
      shine: 'glossy',
      animationEffect: 'crown-sparkle'
    },
    tags: ['updo', 'crown', 'princess', 'royal']
  },
  {
    id: 'cos-makeup-001',
    name: 'Fantasy Character Face',
    type: 'makeup',
    style: ['Cosplay', 'Fantasy'],
    colors: ['Elaborate', 'Jewel tones'],
    description: 'Dramatic cosplay makeup with gems, dramatic liner, and fantasy colors',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#4b0082',
      secondaryColor: '#d4af37',
      accentColor: '#ff69b4',
      texture: 'fantasy-gem-detailed',
      shine: 'glitter',
      animationEffect: 'gem-sparkle'
    },
    tags: ['fantasy', 'gems', 'dramatic', 'costume']
  }
];

// ============================================================================
// CLOTHING ITEMS - HOLIDAY COLLECTION
// ============================================================================

export const HOLIDAY_ITEMS: BratzClothingItem[] = [
  // CHRISTMAS
  {
    id: 'hol-top-001',
    name: 'Ugly Christmas Sweater',
    type: 'top',
    style: ['Holiday', 'Christmas'],
    colors: ['Red', 'Green', 'White'],
    pattern: 'Reindeer and snowflakes',
    material: 'Knit',
    description: 'Iconic ugly Christmas sweater with 3D pom poms',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#228b22',
      accentColor: '#ffffff',
      texture: 'knit-3d-pom',
      shine: 'matte'
    },
    tags: ['christmas', 'sweater', 'ugly', 'festive']
  },
  {
    id: 'hol-dress-001',
    name: 'Mrs. Claus Dress',
    type: 'dress',
    style: ['Holiday', 'Christmas'],
    colors: ['Red', 'White fur trim'],
    material: 'Velvet and faux fur',
    description: 'Glamorous Mrs. Claus dress with white fur trim and gold belt',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#ffffff',
      accentColor: '#d4af37',
      texture: 'velvet-fur-trim',
      shine: 'satin'
    },
    tags: ['christmas', 'mrs-claus', 'festive', 'glamorous']
  },
  {
    id: 'hol-dress-002',
    name: 'Snowflake Ball Gown',
    type: 'dress',
    style: ['Holiday', 'Winter'],
    colors: ['Ice Blue', 'Silver', 'White'],
    pattern: 'Snowflake crystals',
    material: 'Tulle and satin',
    description: 'Frozen-inspired ball gown with crystal snowflake embellishments',
    rarity: 'legendary',
    visualDetails: {
      primaryColor: '#add8e6',
      secondaryColor: '#c0c0c0',
      accentColor: '#ffffff',
      texture: 'tulle-crystal-snowflake',
      shine: 'glitter',
      animationEffect: 'snowflake-shimmer'
    },
    tags: ['winter', 'snowflake', 'ball-gown', 'frozen']
  },
  // HALLOWEEN
  {
    id: 'hol-dress-003',
    name: 'Witch Costume Dress',
    type: 'dress',
    style: ['Holiday', 'Halloween'],
    colors: ['Black', 'Purple', 'Orange'],
    pattern: 'Spider web',
    material: 'Taffeta',
    description: 'Classic witch costume with tattered hem and spider web overlay',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#4b0082',
      accentColor: '#ff6600',
      texture: 'taffeta-web',
      shine: 'satin'
    },
    tags: ['halloween', 'witch', 'spooky', 'costume']
  },
  {
    id: 'hol-dress-004',
    name: 'Vampire Countess Gown',
    type: 'dress',
    style: ['Holiday', 'Halloween'],
    colors: ['Black', 'Blood Red'],
    material: 'Velvet and satin',
    description: 'Elegant vampire gown with high collar and blood red lining',
    rarity: 'epic',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#8b0000',
      texture: 'velvet-vampire',
      shine: 'satin',
      animationEffect: 'cape-flow'
    },
    tags: ['halloween', 'vampire', 'elegant', 'gothic']
  },
  // VALENTINE'S
  {
    id: 'hol-dress-005',
    name: 'Valentine Sweetheart Dress',
    type: 'dress',
    style: ['Holiday', 'Valentine'],
    colors: ['Red', 'Pink', 'White'],
    pattern: 'Hearts',
    material: 'Satin',
    description: 'Romantic red dress with heart cutout back and sweetheart neckline',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#ff69b4',
      accentColor: '#ffffff',
      texture: 'satin-heart',
      shine: 'satin'
    },
    tags: ['valentine', 'romantic', 'hearts', 'date-night']
  },
  // NEW YEAR'S EVE
  {
    id: 'hol-dress-006',
    name: 'NYE Sequin Mini',
    type: 'dress',
    style: ['Holiday', 'New Year'],
    colors: ['Gold', 'Silver'],
    pattern: 'All-over sequins',
    material: 'Sequin fabric',
    description: 'Head-to-toe sequin mini dress for ringing in the new year',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#d4af37',
      secondaryColor: '#c0c0c0',
      texture: 'sequin-dense',
      shine: 'glitter',
      animationEffect: 'disco-sparkle'
    },
    tags: ['new-year', 'sequin', 'party', 'glamorous']
  },
  // ST. PATRICK'S
  {
    id: 'hol-top-002',
    name: 'Lucky Shamrock Top',
    type: 'top',
    style: ['Holiday', 'St Patrick'],
    colors: ['Green', 'Gold'],
    pattern: 'Shamrock print',
    material: 'Cotton',
    description: 'Festive green top with shamrock print and gold accents',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#228b22',
      accentColor: '#d4af37',
      texture: 'cotton-printed',
      shine: 'matte'
    },
    tags: ['st-patricks', 'shamrock', 'green', 'lucky']
  },
  // ACCESSORIES
  {
    id: 'hol-head-001',
    name: 'Witch Hat',
    type: 'headwear',
    style: ['Holiday', 'Halloween'],
    colors: ['Black', 'Purple ribbon'],
    material: 'Felt',
    description: 'Classic pointed witch hat with buckle and ribbon',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#4b0082',
      texture: 'felt-pointed',
      shine: 'matte'
    },
    tags: ['hat', 'witch', 'halloween', 'pointy']
  },
  {
    id: 'hol-head-002',
    name: 'Reindeer Antler Headband',
    type: 'headwear',
    style: ['Holiday', 'Christmas'],
    colors: ['Brown', 'Red nose'],
    material: 'Plush',
    description: 'Cute reindeer antlers with jingle bells',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#8b4513',
      accentColor: '#cc0000',
      texture: 'plush-antler',
      shine: 'matte',
      animationEffect: 'bell-jingle'
    },
    tags: ['christmas', 'reindeer', 'cute', 'festive']
  },
  {
    id: 'hol-shoe-001',
    name: 'Elf Boots',
    type: 'shoes',
    style: ['Holiday', 'Christmas'],
    colors: ['Green', 'Red', 'Gold bells'],
    material: 'Velvet',
    description: 'Curly-toed elf boots with jingle bells',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#228b22',
      secondaryColor: '#cc0000',
      accentColor: '#d4af37',
      texture: 'velvet-curly',
      shine: 'satin',
      animationEffect: 'bell-jingle'
    },
    tags: ['christmas', 'elf', 'boots', 'festive']
  }
];

// ============================================================================
// CLOTHING ITEMS - ROCKABILLY COLLECTION
// ============================================================================

export const ROCKABILLY_ITEMS: BratzClothingItem[] = [
  {
    id: 'rock-top-001',
    name: 'Gingham Tie-Front Top',
    type: 'top',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Red', 'White'],
    pattern: 'Gingham check',
    material: 'Cotton',
    description: 'Classic tie-front crop top in red gingham',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#ffffff',
      texture: 'gingham-cotton',
      shine: 'matte'
    },
    tags: ['gingham', 'tie-front', 'crop', 'vintage']
  },
  {
    id: 'rock-top-002',
    name: 'Cherry Embroidered Cardigan',
    type: 'top',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Black', 'Red cherries'],
    pattern: 'Cherry embroidery',
    material: 'Knit',
    description: 'Cropped cardigan with cherry embroidery details',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#cc0000',
      texture: 'knit-embroidered',
      shine: 'matte'
    },
    tags: ['cardigan', 'cherry', 'cropped', 'vintage']
  },
  {
    id: 'rock-top-003',
    name: 'Leopard Print Bustier',
    type: 'top',
    style: ['Rockabilly', 'Pin-Up'],
    colors: ['Leopard', 'Black'],
    pattern: 'Leopard print',
    material: 'Cotton blend',
    description: 'Fitted bustier top in classic leopard print',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#d4a574',
      secondaryColor: '#0a0a0a',
      texture: 'leopard-fitted',
      shine: 'matte'
    },
    tags: ['leopard', 'bustier', 'pin-up', 'fierce']
  },
  {
    id: 'rock-bottom-001',
    name: 'High-Waisted Pencil Skirt',
    type: 'bottom',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Black'],
    material: 'Cotton blend',
    description: 'Classic high-waisted pencil skirt with back slit',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'cotton-fitted',
      shine: 'matte'
    },
    tags: ['skirt', 'pencil', 'high-waisted', 'classic']
  },
  {
    id: 'rock-bottom-002',
    name: 'Polka Dot Circle Skirt',
    type: 'bottom',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Black', 'White polka dots'],
    pattern: 'Polka dots',
    material: 'Cotton',
    description: 'Full circle skirt with classic polka dot pattern',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#ffffff',
      texture: 'cotton-circle-skirt',
      shine: 'matte',
      animationEffect: 'skirt-twirl'
    },
    tags: ['skirt', 'circle', 'polka-dot', 'twirl']
  },
  {
    id: 'rock-bottom-003',
    name: 'Cuffed Denim Capris',
    type: 'bottom',
    style: ['Rockabilly', 'Casual'],
    colors: ['Medium Blue Denim'],
    material: 'Denim',
    description: 'High-waisted capri pants with rolled cuffs',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#4169e1',
      texture: 'denim-cuffed',
      shine: 'matte'
    },
    tags: ['capris', 'denim', 'cuffed', 'casual']
  },
  {
    id: 'rock-dress-001',
    name: 'Swing Dress with Petticoat',
    type: 'dress',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Red', 'Black trim'],
    pattern: 'Solid with contrast',
    material: 'Cotton',
    description: 'Classic 50s swing dress with sweetheart neckline and matching petticoat',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#0a0a0a',
      texture: 'cotton-swing-petticoat',
      shine: 'matte',
      animationEffect: 'petticoat-bounce'
    },
    tags: ['swing', 'dress', 'petticoat', '50s']
  },
  {
    id: 'rock-dress-002',
    name: 'Cherry Print Halter Dress',
    type: 'dress',
    style: ['Rockabilly', 'Pin-Up'],
    colors: ['White', 'Red cherries'],
    pattern: 'Cherry print',
    material: 'Cotton',
    description: 'Halter neck dress with allover cherry print and flared skirt',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#ffffff',
      accentColor: '#cc0000',
      texture: 'cotton-cherry-print',
      shine: 'matte',
      animationEffect: 'skirt-sway'
    },
    tags: ['halter', 'cherry', 'print', 'flared']
  },
  {
    id: 'rock-shoe-001',
    name: 'Saddle Shoes',
    type: 'shoes',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Black', 'White'],
    material: 'Leather',
    description: 'Classic two-tone saddle shoes',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#ffffff',
      secondaryColor: '#0a0a0a',
      texture: 'leather-two-tone',
      shine: 'glossy'
    },
    tags: ['shoes', 'saddle', 'two-tone', 'classic']
  },
  {
    id: 'rock-shoe-002',
    name: 'Polka Dot Heels',
    type: 'shoes',
    style: ['Rockabilly', 'Pin-Up'],
    colors: ['Red', 'White polka dots'],
    pattern: 'Polka dots',
    material: 'Fabric',
    description: 'Peep-toe heels in red with white polka dots',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#ffffff',
      texture: 'fabric-polka',
      shine: 'satin'
    },
    tags: ['heels', 'polka-dot', 'peep-toe', 'retro']
  },
  {
    id: 'rock-acc-001',
    name: 'Bandana Hair Tie',
    type: 'headwear',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Red'],
    pattern: 'Paisley',
    material: 'Cotton',
    description: 'Classic bandana tied in hair with bow',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#cc0000',
      texture: 'bandana-tied',
      shine: 'matte'
    },
    tags: ['bandana', 'hair', 'retro', 'casual']
  },
  {
    id: 'rock-acc-002',
    name: 'Cherry Earrings',
    type: 'jewelry',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Red', 'Green'],
    material: 'Enamel',
    description: 'Dangling cherry earrings with green leaves',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#cc0000',
      accentColor: '#228b22',
      texture: 'enamel-cherry',
      shine: 'glossy',
      animationEffect: 'dangle-swing'
    },
    tags: ['earrings', 'cherry', 'retro', 'cute']
  },
  {
    id: 'rock-hair-001',
    name: 'Victory Rolls',
    type: 'hair',
    style: ['Rockabilly', 'Vintage'],
    colors: ['Black'],
    description: 'Classic 40s/50s victory roll hairstyle',
    rarity: 'rare',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'victory-roll-styled',
      shine: 'glossy'
    },
    tags: ['victory-rolls', 'vintage', 'styled', '40s']
  },
  {
    id: 'rock-hair-002',
    name: 'Bettie Bangs with Ponytail',
    type: 'hair',
    style: ['Rockabilly', 'Pin-Up'],
    colors: ['Black'],
    description: 'Classic Bettie Page bangs with high ponytail',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'bettie-bangs-pony',
      shine: 'glossy',
      animationEffect: 'ponytail-bounce'
    },
    tags: ['bettie', 'bangs', 'ponytail', 'pin-up']
  },
  {
    id: 'rock-makeup-001',
    name: 'Pin-Up Glam',
    type: 'makeup',
    style: ['Rockabilly', 'Pin-Up'],
    colors: ['Red lips', 'Winged liner', 'Rosy cheeks'],
    description: 'Classic pin-up makeup with bold red lips and dramatic cat eye',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#ffe4c4',
      secondaryColor: '#cc0000',
      accentColor: '#0a0a0a',
      texture: 'pinup-classic',
      shine: 'glossy'
    },
    tags: ['red-lip', 'cat-eye', 'classic', 'glamorous']
  }
];

// ============================================================================
// CLOTHING ITEMS - ALTERNATIVE COLLECTION
// ============================================================================

export const ALTERNATIVE_ITEMS: BratzClothingItem[] = [
  {
    id: 'alt-top-001',
    name: 'Grunge Flannel',
    type: 'top',
    style: ['Alternative', 'Grunge'],
    colors: ['Red', 'Black'],
    pattern: 'Buffalo plaid',
    material: 'Flannel',
    description: 'Oversized flannel shirt tied at waist',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#cc0000',
      secondaryColor: '#0a0a0a',
      texture: 'flannel-soft',
      shine: 'matte'
    },
    tags: ['flannel', 'grunge', 'oversized', 'plaid']
  },
  {
    id: 'alt-top-002',
    name: 'Band Crop Tee',
    type: 'top',
    style: ['Alternative', 'Rock'],
    colors: ['Black', 'Faded print'],
    pattern: 'Vintage band logo',
    material: 'Distressed cotton',
    description: 'Cropped vintage band tee with distressed edges',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#4a4a4a',
      texture: 'distressed-faded',
      shine: 'matte'
    },
    tags: ['band-tee', 'cropped', 'vintage', 'distressed']
  },
  {
    id: 'alt-top-003',
    name: 'Mesh Long Sleeve',
    type: 'top',
    style: ['Alternative', 'Edgy'],
    colors: ['Black'],
    material: 'Mesh',
    description: 'Sheer black mesh long sleeve top',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'mesh-sheer',
      shine: 'matte',
      transparency: 0.7
    },
    tags: ['mesh', 'sheer', 'long-sleeve', 'layering']
  },
  {
    id: 'alt-bottom-001',
    name: 'Ripped Black Jeans',
    type: 'bottom',
    style: ['Alternative', 'Grunge'],
    colors: ['Black'],
    pattern: 'Heavy distressing',
    material: 'Denim',
    description: 'Super distressed black skinny jeans',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'denim-destroyed',
      shine: 'matte'
    },
    tags: ['jeans', 'ripped', 'black', 'skinny']
  },
  {
    id: 'alt-bottom-002',
    name: 'Plaid Mini Skirt',
    type: 'bottom',
    style: ['Alternative', 'Punk'],
    colors: ['Black', 'Grey'],
    pattern: 'Plaid',
    material: 'Wool blend',
    description: 'Pleated plaid mini skirt with safety pin details',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#2a2a2a',
      secondaryColor: '#4a4a4a',
      accentColor: '#c0c0c0',
      texture: 'plaid-pleated',
      shine: 'matte'
    },
    tags: ['skirt', 'plaid', 'mini', 'punk']
  },
  {
    id: 'alt-outer-001',
    name: 'Oversized Hoodie',
    type: 'outerwear',
    style: ['Alternative', 'Casual'],
    colors: ['Grey', 'Black'],
    material: 'Cotton fleece',
    description: 'Super oversized hoodie with kangaroo pocket',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#4a4a4a',
      secondaryColor: '#1a1a1a',
      texture: 'fleece-soft',
      shine: 'matte'
    },
    tags: ['hoodie', 'oversized', 'cozy', 'staple']
  },
  {
    id: 'alt-outer-002',
    name: 'Distressed Denim Jacket',
    type: 'outerwear',
    style: ['Alternative', 'Grunge'],
    colors: ['Light Blue', 'Patches'],
    pattern: 'Distressed with patches',
    material: 'Denim',
    description: 'Vintage-style denim jacket with band patches',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#87ceeb',
      texture: 'denim-patched-distressed',
      shine: 'matte'
    },
    tags: ['jacket', 'denim', 'patches', 'grunge']
  },
  {
    id: 'alt-shoe-001',
    name: 'Platform Boots',
    type: 'shoes',
    style: ['Alternative', 'Edgy'],
    colors: ['Black'],
    material: 'Faux leather',
    description: 'Chunky platform boots with buckle straps',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      accentColor: '#c0c0c0',
      texture: 'leather-platform-buckle',
      shine: 'matte'
    },
    tags: ['boots', 'platform', 'chunky', 'buckles']
  },
  {
    id: 'alt-shoe-002',
    name: 'Worn-In Converse Style',
    type: 'shoes',
    style: ['Alternative', 'Casual'],
    colors: ['Black', 'Worn'],
    material: 'Canvas',
    description: 'Beat-up high-top canvas sneakers with doodles',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'canvas-worn-doodle',
      shine: 'matte'
    },
    tags: ['sneakers', 'high-top', 'worn', 'diy']
  },
  {
    id: 'alt-acc-001',
    name: 'Layered Chain Necklace',
    type: 'jewelry',
    style: ['Alternative', 'Edgy'],
    colors: ['Silver'],
    material: 'Metal',
    description: 'Multiple layered silver chains of different lengths',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#c0c0c0',
      texture: 'chain-layered',
      shine: 'metallic'
    },
    tags: ['necklace', 'chains', 'layered', 'silver']
  },
  {
    id: 'alt-acc-002',
    name: 'Beanie',
    type: 'headwear',
    style: ['Alternative', 'Casual'],
    colors: ['Black'],
    material: 'Knit',
    description: 'Slouchy black beanie',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'knit-slouchy',
      shine: 'matte'
    },
    tags: ['beanie', 'hat', 'slouchy', 'casual']
  },
  {
    id: 'alt-hair-001',
    name: 'Split Dye Hair',
    type: 'hair',
    style: ['Alternative', 'Edgy'],
    colors: ['Black', 'Bleached blonde'],
    description: 'Half black, half bleached blonde hair',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      secondaryColor: '#f5deb3',
      texture: 'split-dye',
      shine: 'matte'
    },
    tags: ['split-dye', 'two-tone', 'edgy', 'bold']
  },
  {
    id: 'alt-hair-002',
    name: 'Messy Shag with Bangs',
    type: 'hair',
    style: ['Alternative', 'Grunge'],
    colors: ['Dark Brown'],
    description: 'Choppy layered shag haircut with curtain bangs',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#3a2a1a',
      texture: 'shag-messy',
      shine: 'matte'
    },
    tags: ['shag', 'messy', 'bangs', 'layered']
  },
  {
    id: 'alt-makeup-001',
    name: 'Grunge Smudge',
    type: 'makeup',
    style: ['Alternative', 'Grunge'],
    colors: ['Smudged black', 'Bare lips'],
    description: 'Smudged black eyeliner, bare lips, minimal base',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#d4a574',
      secondaryColor: '#0a0a0a',
      texture: 'grunge-smudge',
      shine: 'matte'
    },
    tags: ['grunge', 'smudged', 'minimal', 'effortless']
  }
];

// ============================================================================
// CLOTHING ITEMS - REAL CLOTHES INSPIRED (Sydney's Wardrobe)
// ============================================================================

export const REAL_CLOTHES_ITEMS: BratzClothingItem[] = [
  // Based on alternative/gothic style preferences
  {
    id: 'real-top-001',
    name: 'Favorite Black Hoodie',
    type: 'top',
    style: ['Real Clothes', 'Comfort'],
    colors: ['Black'],
    material: 'Cotton fleece',
    description: 'Well-worn favorite black hoodie, soft and cozy',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'fleece-soft-worn',
      shine: 'matte'
    },
    tags: ['hoodie', 'comfort', 'everyday', 'cozy']
  },
  {
    id: 'real-top-002',
    name: 'Graphic Tee Collection Piece',
    type: 'top',
    style: ['Real Clothes', 'Casual'],
    colors: ['Black', 'Graphic'],
    pattern: 'Favorite band or show',
    material: 'Cotton',
    description: 'Cherished graphic tee from favorite band or show',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#4a4a4a',
      texture: 'cotton-printed-worn',
      shine: 'matte'
    },
    tags: ['tee', 'graphic', 'fandom', 'treasured']
  },
  {
    id: 'real-top-003',
    name: 'Cozy Cardigan',
    type: 'outerwear',
    style: ['Real Clothes', 'Comfort'],
    colors: ['Dark Grey'],
    material: 'Knit',
    description: 'Oversized knit cardigan perfect for low-energy days',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#3a3a3a',
      texture: 'knit-oversized',
      shine: 'matte'
    },
    tags: ['cardigan', 'cozy', 'spoon-friendly', 'soft']
  },
  {
    id: 'real-bottom-001',
    name: 'Go-To Black Leggings',
    type: 'bottom',
    style: ['Real Clothes', 'Comfort'],
    colors: ['Black'],
    material: 'Cotton blend',
    description: 'Comfortable black leggings, everyday staple',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'cotton-stretch',
      shine: 'matte'
    },
    tags: ['leggings', 'comfort', 'everyday', 'easy']
  },
  {
    id: 'real-bottom-002',
    name: 'Favorite Jeans',
    type: 'bottom',
    style: ['Real Clothes', 'Casual'],
    colors: ['Dark Blue Denim'],
    material: 'Denim',
    description: 'Best-fitting jeans that feel just right',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#191970',
      texture: 'denim-perfect-fit',
      shine: 'matte'
    },
    tags: ['jeans', 'favorite', 'reliable', 'flattering']
  },
  {
    id: 'real-bottom-003',
    name: 'Comfy Sweatpants',
    type: 'bottom',
    style: ['Real Clothes', 'Lounge'],
    colors: ['Grey'],
    material: 'Fleece',
    description: 'Super soft sweatpants for home days',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#696969',
      texture: 'fleece-soft',
      shine: 'matte'
    },
    tags: ['sweatpants', 'lounge', 'comfort', 'home']
  },
  {
    id: 'real-dress-001',
    name: 'Easy Black Dress',
    type: 'dress',
    style: ['Real Clothes', 'Versatile'],
    colors: ['Black'],
    material: 'Jersey',
    description: 'Simple black dress that works for anything',
    rarity: 'uncommon',
    visualDetails: {
      primaryColor: '#0a0a0a',
      texture: 'jersey-simple',
      shine: 'matte'
    },
    tags: ['dress', 'lbd', 'versatile', 'easy']
  },
  {
    id: 'real-shoe-001',
    name: 'Everyday Sneakers',
    type: 'shoes',
    style: ['Real Clothes', 'Casual'],
    colors: ['Black', 'White sole'],
    material: 'Canvas and rubber',
    description: 'Reliable everyday sneakers, broken in perfectly',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#ffffff',
      texture: 'canvas-worn-in',
      shine: 'matte'
    },
    tags: ['sneakers', 'everyday', 'comfortable', 'reliable']
  },
  {
    id: 'real-shoe-002',
    name: 'Comfy Slip-Ons',
    type: 'shoes',
    style: ['Real Clothes', 'Easy'],
    colors: ['Black'],
    material: 'Fabric',
    description: 'Easy slip-on shoes for quick outings',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#1a1a1a',
      texture: 'fabric-slip-on',
      shine: 'matte'
    },
    tags: ['slip-ons', 'easy', 'quick', 'practical']
  },
  {
    id: 'real-acc-001',
    name: 'Sensory-Friendly Necklace',
    type: 'jewelry',
    style: ['Real Clothes', 'Practical'],
    colors: ['Silver', 'Muted'],
    material: 'Hypoallergenic metal',
    description: 'Simple necklace that doesn\'t irritate',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#a0a0a0',
      texture: 'smooth-simple',
      shine: 'satin'
    },
    tags: ['necklace', 'sensory-friendly', 'simple', 'comfortable']
  },
  {
    id: 'real-hair-001',
    name: 'Natural Easy Style',
    type: 'hair',
    style: ['Real Clothes', 'Low Maintenance'],
    colors: ['Natural brown'],
    description: 'Natural hair in an easy, low-maintenance style',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#4a3a2a',
      texture: 'natural-easy',
      shine: 'matte'
    },
    tags: ['natural', 'easy', 'low-maintenance', 'effortless']
  },
  {
    id: 'real-hair-002',
    name: 'Messy Bun',
    type: 'hair',
    style: ['Real Clothes', 'Quick'],
    colors: ['Any'],
    description: 'Quick messy bun for low-spoon days',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#4a3a2a',
      texture: 'messy-bun',
      shine: 'matte'
    },
    tags: ['bun', 'messy', 'quick', 'practical']
  },
  {
    id: 'real-makeup-001',
    name: 'Natural No-Makeup Look',
    type: 'makeup',
    style: ['Real Clothes', 'Minimal'],
    colors: ['Natural', 'Minimal'],
    description: 'Barely-there makeup that evens skin and adds life',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#d4a574',
      texture: 'natural-minimal',
      shine: 'matte'
    },
    tags: ['natural', 'minimal', 'everyday', 'quick']
  },
  {
    id: 'real-makeup-002',
    name: 'Five-Minute Face',
    type: 'makeup',
    style: ['Real Clothes', 'Quick'],
    colors: ['Neutral', 'Subtle'],
    description: 'Quick makeup routine - mascara, lip balm, maybe brows',
    rarity: 'common',
    visualDetails: {
      primaryColor: '#d4a574',
      secondaryColor: '#ffb6c1',
      texture: 'quick-subtle',
      shine: 'glossy'
    },
    tags: ['quick', 'easy', 'everyday', 'natural']
  }
];

// ============================================================================
// COMBINED ITEMS EXPORT
// ============================================================================

export const ALL_BRATZ_ITEMS: BratzClothingItem[] = [
  ...GOTHIC_ITEMS,
  ...PUNK_ITEMS,
  ...STEAMPUNK_ITEMS,
  ...KPOP_ITEMS,
  ...HIPHOP_ITEMS,
  ...RNB_ITEMS,
  ...ANIME_ITEMS,
  ...COSPLAY_ITEMS,
  ...HOLIDAY_ITEMS,
  ...ROCKABILLY_ITEMS,
  ...ALTERNATIVE_ITEMS,
  ...REAL_CLOTHES_ITEMS
];

// ============================================================================
// 200+ PRE-BUILT OUTFITS
// ============================================================================

export const BRATZ_OUTFITS: BratzOutfit[] = [
  // =========================================================================
  // GOTHIC OUTFITS (1-25)
  // =========================================================================
  {
    id: 'outfit-goth-001',
    name: 'Victorian Mourning',
    style: 'Gothic',
    subStyle: 'Victorian Goth',
    description: 'Elegant Victorian-inspired mourning ensemble with velvet and lace',
    occasion: ['formal', 'special event', 'goth night'],
    season: ['fall', 'winter'],
    mood: 'Dramatic & Elegant',
    items: {
      dress: 'Cemetery Rose Gown',
      shoes: 'Victorian Lace-Up Boots',
      accessories: ['Black Lace Veil', 'Cameo Necklace'],
      hair: 'Victorian Updo with Roses',
      makeup: 'Romantic Goth Glam',
      jewelry: ['Cameo Necklace']
    },
    colorPalette: ['#0a0a0a', '#3a0a0a', '#c0c0c0'],
    rarity: 'legendary',
    specialEffects: ['ethereal-glow', 'rose-petals'],
    rating: 5,
    tags: ['victorian', 'elegant', 'formal', 'dramatic']
  },
  {
    id: 'outfit-goth-002',
    name: 'Casual Darkness',
    style: 'Gothic',
    subStyle: 'Casual Goth',
    description: 'Everyday goth look perfect for running errands in style',
    occasion: ['casual', 'everyday', 'shopping'],
    season: ['all'],
    mood: 'Effortlessly Dark',
    items: {
      top: 'Mesh Sleeve Crop Top',
      bottom: 'Distressed Black Skinny Jeans',
      shoes: 'Platform Combat Boots',
      accessories: ['Spiked Choker'],
      hair: 'Long Black with Purple Tips',
      makeup: 'Classic Goth Face',
      legwear: 'Fishnet Stockings'
    },
    colorPalette: ['#0a0a0a', '#1a1a1a', '#c0c0c0'],
    rarity: 'common',
    rating: 4,
    tags: ['casual', 'everyday', 'edgy', 'comfortable']
  },
  {
    id: 'outfit-goth-003',
    name: 'Club Night Siren',
    style: 'Gothic',
    subStyle: 'Nu Goth',
    description: 'Sleek and sexy outfit for goth club nights',
    occasion: ['club', 'nightlife', 'concert'],
    season: ['all'],
    mood: 'Seductive & Bold',
    items: {
      top: 'Bat Wing Halter',
      bottom: 'Lace Overlay Pencil Skirt',
      shoes: 'Coffin Heel Pumps',
      accessories: ['Pentagram Earrings'],
      hair: 'Crimped Witch Hair',
      makeup: 'Vampiric Beauty',
      bag: 'Coffin Crossbody Bag'
    },
    colorPalette: ['#0a0a0a', '#2a0a3a', '#c0c0c0'],
    rarity: 'epic',
    specialEffects: ['heel-sparkle', 'dramatic-flow'],
    rating: 5,
    tags: ['club', 'sexy', 'night', 'bold']
  },
  {
    id: 'outfit-goth-004',
    name: 'Romantic Poet',
    style: 'Gothic',
    subStyle: 'Romantic Goth',
    description: 'Flowing romantic ensemble for artistic souls',
    occasion: ['date night', 'poetry reading', 'art gallery'],
    season: ['spring', 'fall'],
    mood: 'Dreamy & Romantic',
    items: {
      top: 'Coffin Embroidered Blouse',
      bottom: 'Layered Tulle Skirt',
      shoes: 'Victorian Lace-Up Boots',
      accessories: ['Black Lace Veil'],
      hair: 'Victorian Updo with Roses',
      makeup: 'Romantic Goth Glam',
      jewelry: ['Cameo Necklace']
    },
    colorPalette: ['#0a0a0a', '#1a0a2a', '#5a0a0a'],
    rarity: 'rare',
    specialEffects: ['tulle-flow', 'veil-flow'],
    rating: 5,
    tags: ['romantic', 'flowing', 'artistic', 'elegant']
  },
  {
    id: 'outfit-goth-005',
    name: 'Wednesday Vibes',
    style: 'Gothic',
    subStyle: 'Classic Goth',
    description: 'Clean, classic gothic look inspired by Wednesday Addams',
    occasion: ['everyday', 'school', 'casual'],
    season: ['all'],
    mood: 'Darkly Cute',
    items: {
      dress: 'Wednesday Mini Dress',
      shoes: 'Platform Combat Boots',
      accessories: ['Spiked Choker'],
      hair: 'Long Black with Purple Tips',
      makeup: 'Classic Goth Face',
      legwear: 'Striped Thigh Highs'
    },
    colorPalette: ['#0a0a0a', '#ffffff'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['wednesday', 'classic', 'cute', 'iconic']
  },
  {
    id: 'outfit-goth-006',
    name: 'Witchy Woman',
    style: 'Gothic',
    subStyle: 'Witch',
    description: 'Mystical witchy outfit for full moon nights',
    occasion: ['ritual', 'special event', 'halloween'],
    season: ['fall', 'winter'],
    mood: 'Mystical & Powerful',
    items: {
      dress: 'Witchy Maxi Dress',
      outerwear: 'Velvet Cape with Hood',
      shoes: 'Victorian Lace-Up Boots',
      accessories: ['Pentagram Earrings'],
      hair: 'Crimped Witch Hair',
      makeup: 'Classic Goth Face',
      headwear: 'Mini Top Hat'
    },
    colorPalette: ['#0a0a0a', '#0a2a0a', '#c0c0c0'],
    rarity: 'rare',
    specialEffects: ['cape-swirl', 'moonlight-glow'],
    rating: 5,
    tags: ['witch', 'mystical', 'halloween', 'magical']
  },
  {
    id: 'outfit-goth-007',
    name: 'Punk Goth Rebellion',
    style: 'Gothic',
    subStyle: 'Punk Goth',
    description: 'Edgy fusion of punk and goth aesthetics',
    occasion: ['concert', 'club', 'casual'],
    season: ['all'],
    mood: 'Rebellious',
    items: {
      top: 'Victorian Lace Corset',
      bottom: 'Plaid Bondage Mini',
      outerwear: 'Studded Leather Jacket',
      shoes: 'Platform Combat Boots',
      accessories: ['Spiked Choker'],
      hair: 'Long Black with Purple Tips',
      makeup: 'Classic Goth Face',
      legwear: 'Fishnet Stockings'
    },
    colorPalette: ['#0a0a0a', '#8a0a0a', '#c0c0c0'],
    rarity: 'rare',
    rating: 5,
    tags: ['punk', 'rebellious', 'edgy', 'concert']
  },
  {
    id: 'outfit-goth-008',
    name: 'Halloween Queen',
    style: 'Gothic',
    subStyle: 'Halloween Goth',
    description: 'Spooky spectacular outfit for Halloween festivities',
    occasion: ['halloween', 'costume party'],
    season: ['fall'],
    mood: 'Spooky & Fun',
    items: {
      dress: 'Spiderweb Lace Dress',
      shoes: 'Platform Combat Boots',
      accessories: ['Pentagram Earrings'],
      hair: 'Crimped Witch Hair',
      makeup: 'Vampiric Beauty',
      legwear: 'Spiderweb Tights'
    },
    colorPalette: ['#0a0a0a', '#c0c0c0', '#4b0082'],
    rarity: 'epic',
    specialEffects: ['spider-crawl', 'silver-glint'],
    rating: 5,
    tags: ['halloween', 'spooky', 'spiderweb', 'festive']
  },
  {
    id: 'outfit-goth-009',
    name: 'Corporate Darkness',
    style: 'Gothic',
    subStyle: 'Corporate Goth',
    description: 'Professional goth look for the office',
    occasion: ['work', 'professional', 'interview'],
    season: ['all'],
    mood: 'Professional & Dark',
    items: {
      top: 'Coffin Embroidered Blouse',
      bottom: 'Lace Overlay Pencil Skirt',
      outerwear: 'Lace Bolero',
      shoes: 'Coffin Heel Pumps',
      accessories: ['Cameo Necklace'],
      hair: 'Victorian Updo with Roses',
      makeup: 'Romantic Goth Glam'
    },
    colorPalette: ['#0a0a0a', '#1a1a1a'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['professional', 'office', 'subtle', 'elegant']
  },
  {
    id: 'outfit-goth-010',
    name: 'Vampire Countess',
    style: 'Gothic',
    subStyle: 'Vampire',
    description: 'Regal vampire-inspired formal wear',
    occasion: ['formal', 'ball', 'special event'],
    season: ['fall', 'winter'],
    mood: 'Regal & Mysterious',
    items: {
      dress: 'Corseted Bustle Dress',
      outerwear: 'Velvet Cape with Hood',
      shoes: 'Victorian Lace-Up Boots',
      accessories: ['Cameo Necklace'],
      hair: 'Victorian Updo with Roses',
      makeup: 'Vampiric Beauty'
    },
    colorPalette: ['#2a0a3a', '#0a0a0a', '#5a0a0a'],
    rarity: 'legendary',
    specialEffects: ['cape-flow', 'fang-glint'],
    rating: 5,
    tags: ['vampire', 'regal', 'formal', 'dramatic']
  },
  {
    id: 'outfit-goth-011',
    name: 'Velvet Dreams',
    style: 'Gothic',
    subStyle: 'Elegant Goth',
    description: 'Luxurious velvet ensemble for special occasions',
    occasion: ['dinner', 'date', 'theater'],
    season: ['fall', 'winter'],
    mood: 'Luxurious',
    items: {
      top: 'Velvet Mourning Bodice',
      bottom: 'Velvet Palazzo Pants',
      shoes: 'Coffin Heel Pumps',
      accessories: ['Cameo Necklace'],
      hair: 'Long Black with Purple Tips',
      makeup: 'Romantic Goth Glam'
    },
    colorPalette: ['#4a0a0a', '#1a0a1a', '#d4af37'],
    rarity: 'epic',
    specialEffects: ['velvet-shimmer'],
    rating: 5,
    tags: ['velvet', 'luxurious', 'elegant', 'winter']
  },
  {
    id: 'outfit-goth-012',
    name: 'Summer Shadows',
    style: 'Gothic',
    subStyle: 'Summer Goth',
    description: 'Breathable goth look for hot weather',
    occasion: ['casual', 'summer', 'outdoor'],
    season: ['summer'],
    mood: 'Cool & Dark',
    items: {
      dress: 'Wednesday Mini Dress',
      shoes: 'Platform Combat Boots',
      accessories: ['Pentagram Earrings'],
      hair: 'Long Black with Purple Tips',
      makeup: 'Classic Goth Face'
    },
    colorPalette: ['#0a0a0a', '#ffffff', '#c0c0c0'],
    rarity: 'common',
    rating: 3,
    tags: ['summer', 'light', 'breathable', 'casual']
  },

  // =========================================================================
  // PUNK OUTFITS (13-30)
  // =========================================================================
  {
    id: 'outfit-punk-001',
    name: 'Classic Punk',
    style: 'Punk',
    subStyle: 'Classic Punk',
    description: 'Iconic punk look with all the essentials',
    occasion: ['concert', 'casual', 'protest'],
    season: ['all'],
    mood: 'Rebellious',
    items: {
      top: 'Ripped Band Tee',
      bottom: 'Plaid Bondage Pants',
      outerwear: 'DIY Patch Vest',
      shoes: 'Classic Doc Martens Style',
      accessories: ['Studded Wristband', 'Safety Pin Earrings'],
      hair: 'Bright Pink Mohawk',
      makeup: 'Classic Punk Face'
    },
    colorPalette: ['#1a1a1a', '#8a0a0a', '#c0c0c0'],
    rarity: 'uncommon',
    rating: 5,
    tags: ['classic', 'rebellious', 'iconic', 'punk']
  },
  {
    id: 'outfit-punk-002',
    name: 'British Invasion',
    style: 'Punk',
    subStyle: 'British Punk',
    description: 'Union Jack inspired punk aesthetic',
    occasion: ['concert', 'club', 'casual'],
    season: ['all'],
    mood: 'Anarchy',
    items: {
      top: 'Tartan Bondage Top',
      bottom: 'Plaid Bondage Pants',
      outerwear: 'DIY Patch Vest',
      shoes: 'Classic Doc Martens Style',
      accessories: ['Studded Wristband'],
      hair: 'Liberty Spikes',
      makeup: 'Classic Punk Face'
    },
    colorPalette: ['#cc0000', '#1a1a1a', '#c0c0c0'],
    rarity: 'rare',
    specialEffects: ['rainbow-shift'],
    rating: 5,
    tags: ['british', 'tartan', 'anarchy', 'bold']
  },
  {
    id: 'outfit-punk-003',
    name: 'Punk Princess',
    style: 'Punk',
    subStyle: 'Feminine Punk',
    description: 'Punk with a feminine twist',
    occasion: ['casual', 'date', 'concert'],
    season: ['all'],
    mood: 'Fierce & Cute',
    items: {
      top: 'Anarchy Crop',
      bottom: 'Safety Pin Mini Skirt',
      shoes: 'Studded Creepers',
      accessories: ['Safety Pin Earrings'],
      hair: 'Bright Pink Mohawk',
      makeup: 'Classic Punk Face',
      legwear: 'Fishnet Stockings'
    },
    colorPalette: ['#0a0a0a', '#cc0000', '#ff1493'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['feminine', 'punk', 'cute', 'fierce']
  },
  {
    id: 'outfit-punk-004',
    name: 'Skate Punk',
    style: 'Punk',
    subStyle: 'Skate Punk',
    description: 'Punk style for the skatepark',
    occasion: ['casual', 'skating', 'concert'],
    season: ['spring', 'summer', 'fall'],
    mood: 'Active & Rebellious',
    items: {
      top: 'Ripped Band Tee',
      bottom: 'Destroyed Denim Shorts',
      shoes: 'Classic Doc Martens Style',
      accessories: ['Studded Wristband'],
      hair: 'Bright Pink Mohawk',
      makeup: 'Classic Punk Face'
    },
    colorPalette: ['#1a1a1a', '#ffffff', '#c0c0c0'],
    rarity: 'common',
    rating: 4,
    tags: ['skate', 'active', 'casual', 'summer']
  },
  {
    id: 'outfit-punk-005',
    name: 'Street Fighter',
    style: 'Punk',
    subStyle: 'Street Punk',
    description: 'Tough street punk look',
    occasion: ['casual', 'protest', 'concert'],
    season: ['all'],
    mood: 'Tough',
    items: {
      top: 'Anarchy Crop',
      bottom: 'Plaid Bondage Pants',
      outerwear: 'DIY Patch Vest',
      shoes: 'Classic Doc Martens Style',
      accessories: ['Studded Wristband', 'Safety Pin Earrings'],
      hair: 'Liberty Spikes',
      makeup: 'Classic Punk Face'
    },
    colorPalette: ['#0a0a0a', '#cc0000', '#c0c0c0'],
    rarity: 'rare',
    rating: 5,
    tags: ['street', 'tough', 'rebellious', 'bold']
  },

  // =========================================================================
  // STEAMPUNK OUTFITS (31-45)
  // =========================================================================
  {
    id: 'outfit-steam-001',
    name: 'Airship Captain',
    style: 'Steampunk',
    subStyle: 'Adventure',
    description: 'Ready to command an airship across the skies',
    occasion: ['convention', 'costume', 'special event'],
    season: ['fall', 'winter'],
    mood: 'Adventurous',
    items: {
      top: 'Aviator Blouse',
      bottom: 'Airship Captain Pants',
      outerwear: 'Inventor\'s Coat',
      shoes: 'Victorian Gear Boots',
      accessories: ['Aviator Goggles', 'Pocket Watch Necklace'],
      hair: 'Victorian Curls with Gear Pins',
      makeup: 'Inventor Chic',
      headwear: 'Top Hat with Goggles'
    },
    colorPalette: ['#5a3a1a', '#b87333', '#d4af37'],
    rarity: 'legendary',
    specialEffects: ['gear-spin', 'coat-flow'],
    rating: 5,
    tags: ['captain', 'airship', 'adventure', 'commanding']
  },
  {
    id: 'outfit-steam-002',
    name: 'Clockwork Lady',
    style: 'Steampunk',
    subStyle: 'Victorian',
    description: 'Elegant steampunk lady of the manor',
    occasion: ['formal', 'convention', 'tea party'],
    season: ['fall', 'winter'],
    mood: 'Elegant & Inventive',
    items: {
      top: 'Clockwork Corset',
      bottom: 'Bustle Skirt with Gears',
      shoes: 'Victorian Gear Boots',
      accessories: ['Pocket Watch Necklace'],
      hair: 'Victorian Curls with Gear Pins',
      makeup: 'Inventor Chic'
    },
    colorPalette: ['#5a3a1a', '#cd7f32', '#d4af37'],
    rarity: 'epic',
    specialEffects: ['gear-spin', 'bustle-sway'],
    rating: 5,
    tags: ['elegant', 'victorian', 'clockwork', 'lady']
  },
  {
    id: 'outfit-steam-003',
    name: 'Mad Inventor',
    style: 'Steampunk',
    description: 'Eccentric inventor fresh from the workshop',
    occasion: ['convention', 'costume', 'casual'],
    season: ['all'],
    mood: 'Eccentric',
    items: {
      top: 'Aviator Blouse',
      outerwear: 'Mechanical Arm Shrug',
      bottom: 'Airship Captain Pants',
      shoes: 'Victorian Gear Boots',
      accessories: ['Aviator Goggles'],
      hair: 'Victorian Curls with Gear Pins',
      makeup: 'Inventor Chic'
    },
    colorPalette: ['#f5f5dc', '#b87333', '#5a3a1a'],
    rarity: 'rare',
    specialEffects: ['arm-articulate', 'lens-glint'],
    rating: 4,
    tags: ['inventor', 'eccentric', 'mechanical', 'workshop']
  },
  {
    id: 'outfit-steam-004',
    name: 'Time Traveler\'s Ball',
    style: 'Steampunk',
    subStyle: 'Formal',
    description: 'Formal steampunk gown for time-traveling galas',
    occasion: ['formal', 'ball', 'convention'],
    season: ['fall', 'winter'],
    mood: 'Majestic',
    items: {
      dress: 'Time Traveler Gown',
      shoes: 'Victorian Gear Boots',
      accessories: ['Pocket Watch Necklace'],
      hair: 'Victorian Curls with Gear Pins',
      makeup: 'Inventor Chic',
      headwear: 'Top Hat with Goggles'
    },
    colorPalette: ['#4a0a0a', '#d4af37', '#cd7f32'],
    rarity: 'legendary',
    specialEffects: ['clock-tick', 'feather-flutter'],
    rating: 5,
    tags: ['formal', 'ball', 'time-travel', 'gown']
  },

  // =========================================================================
  // K-POP OUTFITS (46-65)
  // =========================================================================
  {
    id: 'outfit-kpop-001',
    name: 'Stage Sensation',
    style: 'K-Pop',
    subStyle: 'Performance',
    description: 'Sparkling stage outfit fit for a K-pop idol',
    occasion: ['performance', 'concert', 'photoshoot'],
    season: ['all'],
    mood: 'Star Power',
    items: {
      top: 'Mesh Panel Bodysuit',
      bottom: 'Vinyl Mini Shorts',
      shoes: 'Strappy Platform Heels',
      accessories: ['Heart-Shaped Sunglasses'],
      hair: 'Sleek High Ponytail',
      makeup: 'Glitter Fantasy',
      jewelry: ['Layered Pearl Chains']
    },
    colorPalette: ['#0a0a0a', '#ff1493', '#c0c0c0'],
    rarity: 'epic',
    specialEffects: ['sparkle', 'diamond-sparkle'],
    rating: 5,
    tags: ['stage', 'performance', 'sparkly', 'idol']
  },
  {
    id: 'outfit-kpop-002',
    name: 'Pastel Dream',
    style: 'K-Pop',
    subStyle: 'Fairy',
    description: 'Soft and dreamy pastel outfit',
    occasion: ['casual', 'cafe', 'photoshoot'],
    season: ['spring', 'summer'],
    mood: 'Dreamy',
    items: {
      dress: 'Tiered Tulle Princess Dress',
      shoes: 'Chunky Platform Sneakers',
      accessories: ['Heart-Shaped Sunglasses'],
      hair: 'Cotton Candy Waves',
      makeup: 'Glass Skin Glam',
      headwear: 'Oversized Hair Bow'
    },
    colorPalette: ['#ffc0cb', '#e6e6fa', '#add8e6'],
    rarity: 'rare',
    specialEffects: ['shimmer-float', 'gradient-flow'],
    rating: 5,
    tags: ['pastel', 'dreamy', 'fairy', 'cute']
  },
  {
    id: 'outfit-kpop-003',
    name: 'Street Style Star',
    style: 'K-Pop',
    subStyle: 'Streetwear',
    description: 'Trendy K-pop streetwear look',
    occasion: ['casual', 'shopping', 'airport'],
    season: ['spring', 'fall'],
    mood: 'Effortlessly Cool',
    items: {
      top: 'Oversized Cropped Blazer',
      bottom: 'High-Waist Cargo Pants',
      shoes: 'Chunky Platform Sneakers',
      accessories: ['Heart-Shaped Sunglasses'],
      hair: 'Two-Tone Split Hair',
      makeup: 'Glass Skin Glam'
    },
    colorPalette: ['#ffb6c1', '#ffffff', '#f5f5f5'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['streetwear', 'trendy', 'cool', 'casual']
  },
  {
    id: 'outfit-kpop-004',
    name: 'Y2K Revival',
    style: 'K-Pop',
    subStyle: 'Y2K',
    description: 'Nostalgic Y2K inspired look',
    occasion: ['party', 'club', 'casual'],
    season: ['all'],
    mood: 'Retro Fun',
    items: {
      top: 'Holographic Crop Top',
      bottom: 'Pleated Tennis Skirt',
      shoes: 'Chunky Platform Sneakers',
      accessories: ['Heart-Shaped Sunglasses'],
      hair: 'Cotton Candy Waves',
      makeup: 'Glitter Fantasy'
    },
    colorPalette: ['#e6e6fa', '#ffffff', '#ffb6c1'],
    rarity: 'rare',
    specialEffects: ['color-shift', 'sparkle-burst'],
    rating: 5,
    tags: ['y2k', 'retro', 'holographic', 'fun']
  },
  {
    id: 'outfit-kpop-005',
    name: 'School Chic',
    style: 'K-Pop',
    subStyle: 'Preppy',
    description: 'K-drama school uniform inspired look',
    occasion: ['school', 'casual', 'photoshoot'],
    season: ['spring', 'fall'],
    mood: 'Fresh & Cute',
    items: {
      top: 'Ruffle Blouse with Bow',
      bottom: 'Pleated Tennis Skirt',
      outerwear: 'Oversized Varsity Jacket',
      shoes: 'Chunky Platform Sneakers',
      accessories: [],
      hair: 'Sleek High Ponytail',
      makeup: 'Glass Skin Glam'
    },
    colorPalette: ['#e6e6fa', '#ffffff', '#add8e6'],
    rarity: 'common',
    rating: 4,
    tags: ['school', 'preppy', 'cute', 'fresh']
  },

  // =========================================================================
  // HIP HOP OUTFITS (66-85)
  // =========================================================================
  {
    id: 'outfit-hiphop-001',
    name: 'Street Queen',
    style: 'Hip Hop',
    subStyle: 'Streetwear',
    description: 'Boss energy streetwear ensemble',
    occasion: ['casual', 'concert', 'photoshoot'],
    season: ['all'],
    mood: 'Boss Energy',
    items: {
      top: 'Oversized Graphic Hoodie',
      bottom: 'Baggy Cargo Jeans',
      shoes: 'Chunky Designer Sneakers',
      accessories: ['Thick Gold Chain', 'Oversized Hoop Earrings'],
      hair: 'Long Box Braids',
      makeup: 'Beat to the Gods',
      headwear: 'Bucket Hat'
    },
    colorPalette: ['#1a1a1a', '#d4af37', '#87ceeb'],
    rarity: 'uncommon',
    rating: 5,
    tags: ['street', 'boss', 'gold', 'confident']
  },
  {
    id: 'outfit-hiphop-002',
    name: 'Throwback Fresh',
    style: 'Hip Hop',
    subStyle: '90s Hip Hop',
    description: 'Vintage 90s hip hop vibes',
    occasion: ['casual', 'party', 'concert'],
    season: ['all'],
    mood: 'Nostalgic',
    items: {
      top: 'Vintage Basketball Jersey',
      bottom: 'Baggy Cargo Jeans',
      shoes: 'Classic High-Top Sneakers',
      accessories: ['Thick Gold Chain', 'Nameplate Necklace'],
      hair: 'Slicked Back Bun',
      makeup: 'Beat to the Gods'
    },
    colorPalette: ['#cc0000', '#ffffff', '#00008b'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['90s', 'throwback', 'vintage', 'basketball']
  },
  {
    id: 'outfit-hiphop-003',
    name: 'Club Ready',
    style: 'Hip Hop',
    subStyle: 'Club',
    description: 'VIP section ready outfit',
    occasion: ['club', 'party', 'nightlife'],
    season: ['all'],
    mood: 'VIP',
    items: {
      top: 'Cropped Logo Tee',
      bottom: 'Leather Mini Skirt',
      shoes: 'Chunky Designer Sneakers',
      accessories: ['Thick Gold Chain', 'Oversized Hoop Earrings'],
      hair: 'Long Box Braids',
      makeup: 'Beat to the Gods',
      bag: 'Mini Designer Bag'
    },
    colorPalette: ['#1a1a1a', '#d4af37', '#ffffff'],
    rarity: 'rare',
    rating: 5,
    tags: ['club', 'vip', 'party', 'luxury']
  },
  {
    id: 'outfit-hiphop-004',
    name: 'Athletic Luxury',
    style: 'Hip Hop',
    subStyle: 'Athleisure',
    description: 'High-end athletic wear',
    occasion: ['casual', 'gym', 'brunch'],
    season: ['all'],
    mood: 'Sporty Chic',
    items: {
      top: 'Puffer Crop Vest',
      bottom: 'Track Pants with Stripes',
      shoes: 'Chunky Designer Sneakers',
      accessories: ['Thick Gold Chain'],
      hair: 'Slicked Back Bun',
      makeup: 'Beat to the Gods'
    },
    colorPalette: ['#c0c0c0', '#1a1a1a', '#ffffff'],
    rarity: 'uncommon',
    specialEffects: ['metallic-shine'],
    rating: 4,
    tags: ['athletic', 'sporty', 'luxury', 'athleisure']
  },
  {
    id: 'outfit-hiphop-005',
    name: 'Winter Drip',
    style: 'Hip Hop',
    subStyle: 'Luxury',
    description: 'Cold weather luxury look',
    occasion: ['casual', 'winter', 'photoshoot'],
    season: ['winter'],
    mood: 'Iced Out',
    items: {
      top: 'Oversized Graphic Hoodie',
      bottom: 'Baggy Cargo Jeans',
      outerwear: 'Fur-Trimmed Parka',
      shoes: 'Chunky Designer Sneakers',
      accessories: ['Thick Gold Chain', 'Oversized Hoop Earrings'],
      hair: 'Long Box Braids',
      makeup: 'Beat to the Gods'
    },
    colorPalette: ['#556b2f', '#8b4513', '#d4af37'],
    rarity: 'rare',
    specialEffects: ['fur-texture'],
    rating: 5,
    tags: ['winter', 'luxury', 'warm', 'drip']
  },

  // =========================================================================
  // R&B OUTFITS (86-100)
  // =========================================================================
  {
    id: 'outfit-rnb-001',
    name: 'Late Night Serenade',
    style: 'R&B',
    subStyle: 'Sensual',
    description: 'Smooth and sophisticated evening look',
    occasion: ['date night', 'concert', 'dinner'],
    season: ['all'],
    mood: 'Sensual',
    items: {
      top: 'Satin Slip Top',
      bottom: 'High-Slit Maxi Skirt',
      shoes: 'Strappy Stilettos',
      accessories: ['Diamond Drop Earrings'],
      hair: 'Sleek Long Waves',
      makeup: '90s R&B Glam'
    },
    colorPalette: ['#f5e6d3', '#0a0a0a', '#ffffff'],
    rarity: 'rare',
    specialEffects: ['silk-shimmer', 'slit-reveal'],
    rating: 5,
    tags: ['sensual', 'elegant', 'date', 'sophisticated']
  },
  {
    id: 'outfit-rnb-002',
    name: 'Golden Hour',
    style: 'R&B',
    subStyle: 'Club',
    description: 'Liquid gold club look',
    occasion: ['club', 'party', 'concert'],
    season: ['all'],
    mood: 'Glamorous',
    items: {
      dress: 'Slinky Mini Dress',
      shoes: 'Strappy Stilettos',
      accessories: ['Diamond Drop Earrings'],
      hair: 'Honey Blonde Curls',
      makeup: '90s R&B Glam'
    },
    colorPalette: ['#d4af37', '#daa520', '#d4a574'],
    rarity: 'rare',
    specialEffects: ['liquid-gold'],
    rating: 5,
    tags: ['gold', 'glamorous', 'club', 'shiny']
  },
  {
    id: 'outfit-rnb-003',
    name: 'Red Carpet Diva',
    style: 'R&B',
    subStyle: 'Red Carpet',
    description: 'Award show worthy glamour',
    occasion: ['red carpet', 'formal', 'awards'],
    season: ['all'],
    mood: 'Diva',
    items: {
      dress: 'Feather Trim Gown',
      shoes: 'Strappy Stilettos',
      accessories: ['Diamond Drop Earrings'],
      hair: 'Sleek Long Waves',
      makeup: '90s R&B Glam'
    },
    colorPalette: ['#ffffff', '#ffe4e1', '#d4a574'],
    rarity: 'legendary',
    specialEffects: ['feather-flutter'],
    rating: 5,
    tags: ['red-carpet', 'diva', 'feathers', 'glamorous']
  },
  {
    id: 'outfit-rnb-004',
    name: 'Cozy & Cute',
    style: 'R&B',
    subStyle: 'Cozy',
    description: 'Comfortable but still cute',
    occasion: ['casual', 'home', 'brunch'],
    season: ['fall', 'winter'],
    mood: 'Comfortable',
    items: {
      top: 'Off-Shoulder Sweater',
      bottom: 'Velvet Flares',
      shoes: 'Thigh-High Boots',
      accessories: [],
      hair: 'Honey Blonde Curls',
      makeup: '90s R&B Glam'
    },
    colorPalette: ['#d4a5a5', '#722f37', '#1a1a1a'],
    rarity: 'uncommon',
    specialEffects: ['flare-sway'],
    rating: 4,
    tags: ['cozy', 'comfortable', 'cute', 'warm']
  },
  {
    id: 'outfit-rnb-005',
    name: 'Ice Queen',
    style: 'R&B',
    subStyle: 'Stage',
    description: 'Crystal-covered performance look',
    occasion: ['performance', 'concert', 'photoshoot'],
    season: ['all'],
    mood: 'Regal',
    items: {
      top: 'Mesh Bodysuit',
      outerwear: 'Faux Fur Coat',
      shoes: 'Strappy Stilettos',
      accessories: ['Diamond Drop Earrings'],
      hair: 'Sleek Long Waves',
      makeup: '90s R&B Glam'
    },
    colorPalette: ['#d4a574', '#ffffff', '#fffaf0'],
    rarity: 'legendary',
    specialEffects: ['crystal-sparkle', 'fur-movement'],
    rating: 5,
    tags: ['ice', 'crystal', 'performance', 'regal']
  },

  // =========================================================================
  // ANIME OUTFITS (101-120)
  // =========================================================================
  {
    id: 'outfit-anime-001',
    name: 'Sailor Scout',
    style: 'Anime',
    subStyle: 'School',
    description: 'Classic anime school girl look',
    occasion: ['cosplay', 'convention', 'casual'],
    season: ['spring', 'fall'],
    mood: 'Kawaii',
    items: {
      top: 'Sailor Uniform Top',
      bottom: 'Pleated School Skirt',
      shoes: 'Mary Jane Platforms',
      accessories: [],
      hair: 'Twin Tails with Buns',
      makeup: 'Anime Eyes'
    },
    colorPalette: ['#ffffff', '#000080', '#cc0000'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['sailor', 'school', 'classic', 'kawaii']
  },
  {
    id: 'outfit-anime-002',
    name: 'Magical Transformation',
    style: 'Anime',
    subStyle: 'Magical Girl',
    description: 'Ready to transform and save the day!',
    occasion: ['cosplay', 'convention', 'photoshoot'],
    season: ['all'],
    mood: 'Magical',
    items: {
      top: 'Magical Girl Bodice',
      bottom: 'Magical Girl Tutu',
      shoes: 'Mary Jane Platforms',
      accessories: ['Magical Girl Wand'],
      hair: 'Twin Tails with Buns',
      makeup: 'Anime Eyes'
    },
    colorPalette: ['#ff69b4', '#ffffff', '#d4af37'],
    rarity: 'legendary',
    specialEffects: ['magical-sparkle', 'rainbow-glow', 'wand-glow'],
    rating: 5,
    tags: ['magical-girl', 'sparkly', 'transformation', 'fantasy']
  },
  {
    id: 'outfit-anime-003',
    name: 'Sweet Lolita',
    style: 'Anime',
    subStyle: 'Lolita',
    description: 'Adorable sweet Lolita fashion',
    occasion: ['tea party', 'convention', 'casual'],
    season: ['spring', 'summer'],
    mood: 'Cute',
    items: {
      dress: 'Lolita Princess Dress',
      shoes: 'Mary Jane Platforms',
      accessories: ['Cat Ear Headband'],
      hair: 'Twin Tails with Buns',
      makeup: 'Anime Eyes'
    },
    colorPalette: ['#ffc0cb', '#ffffff', '#ff69b4'],
    rarity: 'epic',
    specialEffects: ['petticoat-puff'],
    rating: 5,
    tags: ['lolita', 'sweet', 'cute', 'princess']
  },
  {
    id: 'outfit-anime-004',
    name: 'Gothic Lolita',
    style: 'Anime',
    subStyle: 'Gothic Lolita',
    description: 'Dark and elegant Gothic Lolita fashion',
    occasion: ['tea party', 'convention', 'casual'],
    season: ['fall', 'winter'],
    mood: 'Dark Elegant',
    items: {
      dress: 'Gothic Lolita Dress',
      shoes: 'Mary Jane Platforms',
      accessories: ['Cat Ear Headband'],
      hair: 'Long Straight Hime Cut',
      makeup: 'Anime Eyes'
    },
    colorPalette: ['#0a0a0a', '#ffffff', '#8b0000'],
    rarity: 'epic',
    rating: 5,
    tags: ['gothic-lolita', 'dark', 'elegant', 'victorian']
  },
  {
    id: 'outfit-anime-005',
    name: 'Maid Cafe Cutie',
    style: 'Anime',
    subStyle: 'Maid',
    description: 'Welcome home, Master!',
    occasion: ['cosplay', 'convention', 'work'],
    season: ['all'],
    mood: 'Service',
    items: {
      top: 'Maid Cafe Top',
      bottom: 'Pleated School Skirt',
      shoes: 'Mary Jane Platforms',
      accessories: ['Cat Ear Headband'],
      hair: 'Twin Tails with Buns',
      makeup: 'Anime Eyes'
    },
    colorPalette: ['#0a0a0a', '#ffffff', '#ff69b4'],
    rarity: 'rare',
    rating: 4,
    tags: ['maid', 'cute', 'service', 'cosplay']
  },

  // =========================================================================
  // COSPLAY OUTFITS (121-140)
  // =========================================================================
  {
    id: 'outfit-cos-001',
    name: 'Fairy Queen',
    style: 'Cosplay',
    subStyle: 'Fantasy',
    description: 'Ethereal fairy royalty',
    occasion: ['cosplay', 'convention', 'renaissance faire'],
    season: ['spring', 'summer'],
    mood: 'Ethereal',
    items: {
      dress: 'Fairy Queen Gown',
      shoes: 'Elven Boots',
      accessories: ['Fairy Wings', 'Elf Ears'],
      hair: 'Princess Crown Updo',
      makeup: 'Fantasy Character Face'
    },
    colorPalette: ['#98fb98', '#daa520', '#dda0dd'],
    rarity: 'legendary',
    specialEffects: ['fairy-shimmer', 'wing-flutter-glow'],
    rating: 5,
    tags: ['fairy', 'queen', 'ethereal', 'magical']
  },
  {
    id: 'outfit-cos-002',
    name: 'Warrior Princess',
    style: 'Cosplay',
    subStyle: 'Fantasy',
    description: 'Battle-ready fantasy warrior',
    occasion: ['cosplay', 'convention', 'renaissance faire'],
    season: ['all'],
    mood: 'Fierce',
    items: {
      top: 'Fantasy Armor Breastplate',
      bottom: 'Elf Warrior Skirt',
      outerwear: 'Dragon Scale Cape',
      shoes: 'Elven Boots',
      accessories: ['Elf Ears'],
      hair: 'Princess Crown Updo',
      makeup: 'Fantasy Character Face'
    },
    colorPalette: ['#c0c0c0', '#228b22', '#4b0082'],
    rarity: 'legendary',
    specialEffects: ['armor-glint', 'scale-shimmer'],
    rating: 5,
    tags: ['warrior', 'fantasy', 'armor', 'fierce']
  },
  {
    id: 'outfit-cos-003',
    name: 'Video Game Princess',
    style: 'Cosplay',
    subStyle: 'Gaming',
    description: 'Iconic video game royalty',
    occasion: ['cosplay', 'convention', 'gaming event'],
    season: ['all'],
    mood: 'Royal',
    items: {
      dress: 'Video Game Princess Gown',
      shoes: 'Mary Jane Platforms',
      accessories: [],
      hair: 'Princess Crown Updo',
      makeup: 'Fantasy Character Face'
    },
    colorPalette: ['#ffb6c1', '#ffffff', '#4169e1'],
    rarity: 'epic',
    specialEffects: ['gem-sparkle'],
    rating: 5,
    tags: ['princess', 'gaming', 'iconic', 'royal']
  },
  {
    id: 'outfit-cos-004',
    name: 'Mystical Witch',
    style: 'Cosplay',
    subStyle: 'Fantasy',
    description: 'Powerful magical witch',
    occasion: ['cosplay', 'convention', 'halloween'],
    season: ['fall', 'winter'],
    mood: 'Mystical',
    items: {
      top: 'Witch Corset',
      bottom: 'Elf Warrior Skirt',
      shoes: 'Elven Boots',
      accessories: ['Elf Ears'],
      hair: 'Anime Character Wig - Blue',
      makeup: 'Fantasy Character Face'
    },
    colorPalette: ['#4b0082', '#0a0a0a', '#c0c0c0'],
    rarity: 'rare',
    specialEffects: ['star-twinkle'],
    rating: 4,
    tags: ['witch', 'mystical', 'magic', 'fantasy']
  },
  {
    id: 'outfit-cos-005',
    name: 'Comic Book Hero',
    style: 'Cosplay',
    subStyle: 'Superhero',
    description: 'Ready to save the day',
    occasion: ['cosplay', 'convention', 'comic con'],
    season: ['all'],
    mood: 'Heroic',
    items: {
      top: 'Superhero Bodysuit Top',
      bottom: 'Pleated School Skirt',
      shoes: 'Platform Combat Boots',
      accessories: [],
      hair: 'Sleek High Ponytail',
      makeup: 'Classic Goth Face'
    },
    colorPalette: ['#cc0000', '#00008b', '#d4af37'],
    rarity: 'rare',
    rating: 4,
    tags: ['superhero', 'hero', 'comic', 'powerful']
  },

  // =========================================================================
  // HOLIDAY OUTFITS (141-160)
  // =========================================================================
  {
    id: 'outfit-hol-001',
    name: 'Glamorous Mrs. Claus',
    style: 'Holiday',
    subStyle: 'Christmas',
    description: 'Festive and fashionable holiday queen',
    occasion: ['christmas party', 'holiday'],
    season: ['winter'],
    mood: 'Festive',
    items: {
      dress: 'Mrs. Claus Dress',
      shoes: 'Elf Boots',
      accessories: [],
      hair: 'Victory Rolls',
      makeup: 'Pin-Up Glam',
      headwear: 'Reindeer Antler Headband'
    },
    colorPalette: ['#cc0000', '#ffffff', '#d4af37'],
    rarity: 'rare',
    specialEffects: ['bell-jingle'],
    rating: 5,
    tags: ['christmas', 'festive', 'glamorous', 'mrs-claus']
  },
  {
    id: 'outfit-hol-002',
    name: 'Ice Queen',
    style: 'Holiday',
    subStyle: 'Winter',
    description: 'Frozen-inspired winter elegance',
    occasion: ['winter ball', 'holiday party', 'formal'],
    season: ['winter'],
    mood: 'Majestic',
    items: {
      dress: 'Snowflake Ball Gown',
      shoes: 'Strappy Platform Heels',
      accessories: ['Diamond Drop Earrings'],
      hair: 'Princess Crown Updo',
      makeup: 'Glitter Fantasy'
    },
    colorPalette: ['#add8e6', '#c0c0c0', '#ffffff'],
    rarity: 'legendary',
    specialEffects: ['snowflake-shimmer'],
    rating: 5,
    tags: ['frozen', 'ice', 'winter', 'elegant']
  },
  {
    id: 'outfit-hol-003',
    name: 'Spooky Elegance',
    style: 'Holiday',
    subStyle: 'Halloween',
    description: 'Elegant vampire costume',
    occasion: ['halloween party', 'costume'],
    season: ['fall'],
    mood: 'Spooky Chic',
    items: {
      dress: 'Vampire Countess Gown',
      shoes: 'Victorian Lace-Up Boots',
      accessories: ['Cameo Necklace'],
      hair: 'Victorian Updo with Roses',
      makeup: 'Vampiric Beauty'
    },
    colorPalette: ['#0a0a0a', '#8b0000', '#c0c0c0'],
    rarity: 'epic',
    specialEffects: ['cape-flow'],
    rating: 5,
    tags: ['halloween', 'vampire', 'elegant', 'spooky']
  },
  {
    id: 'outfit-hol-004',
    name: 'Classic Witch',
    style: 'Holiday',
    subStyle: 'Halloween',
    description: 'Traditional witch costume with style',
    occasion: ['halloween party', 'costume'],
    season: ['fall'],
    mood: 'Bewitching',
    items: {
      dress: 'Witch Costume Dress',
      shoes: 'Platform Combat Boots',
      accessories: ['Pentagram Earrings'],
      hair: 'Crimped Witch Hair',
      makeup: 'Classic Goth Face',
      headwear: 'Witch Hat'
    },
    colorPalette: ['#0a0a0a', '#4b0082', '#ff6600'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['halloween', 'witch', 'classic', 'costume']
  },
  {
    id: 'outfit-hol-005',
    name: 'Valentine\'s Date',
    style: 'Holiday',
    subStyle: 'Valentine',
    description: 'Romantic date night look',
    occasion: ['valentine\'s day', 'date', 'dinner'],
    season: ['winter'],
    mood: 'Romantic',
    items: {
      dress: 'Valentine Sweetheart Dress',
      shoes: 'Strappy Stilettos',
      accessories: ['Diamond Drop Earrings'],
      hair: 'Sleek Long Waves',
      makeup: 'Pin-Up Glam'
    },
    colorPalette: ['#cc0000', '#ff69b4', '#ffffff'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['valentine', 'romantic', 'date', 'hearts']
  },
  {
    id: 'outfit-hol-006',
    name: 'NYE Sparkle',
    style: 'Holiday',
    subStyle: 'New Year',
    description: 'Ring in the new year in style',
    occasion: ['new year\'s eve', 'party'],
    season: ['winter'],
    mood: 'Celebratory',
    items: {
      dress: 'NYE Sequin Mini',
      shoes: 'Strappy Platform Heels',
      accessories: ['Diamond Drop Earrings'],
      hair: 'Sleek High Ponytail',
      makeup: 'Glitter Fantasy'
    },
    colorPalette: ['#d4af37', '#c0c0c0', '#ffffff'],
    rarity: 'rare',
    specialEffects: ['disco-sparkle'],
    rating: 5,
    tags: ['new-year', 'party', 'sequin', 'sparkle']
  },

  // =========================================================================
  // ROCKABILLY OUTFITS (161-175)
  // =========================================================================
  {
    id: 'outfit-rock-001',
    name: 'Diner Darling',
    style: 'Rockabilly',
    subStyle: 'Vintage',
    description: 'Classic 50s diner waitress vibes',
    occasion: ['casual', 'themed party', 'diner'],
    season: ['spring', 'summer'],
    mood: 'Retro Cute',
    items: {
      top: 'Gingham Tie-Front Top',
      bottom: 'Cuffed Denim Capris',
      shoes: 'Saddle Shoes',
      accessories: ['Cherry Earrings'],
      hair: 'Bettie Bangs with Ponytail',
      makeup: 'Pin-Up Glam',
      headwear: 'Bandana Hair Tie'
    },
    colorPalette: ['#cc0000', '#ffffff', '#4169e1'],
    rarity: 'common',
    specialEffects: ['ponytail-bounce'],
    rating: 4,
    tags: ['diner', 'vintage', 'cute', 'retro']
  },
  {
    id: 'outfit-rock-002',
    name: 'Pin-Up Perfect',
    style: 'Rockabilly',
    subStyle: 'Pin-Up',
    description: 'Classic pin-up girl look',
    occasion: ['photoshoot', 'themed party', 'date'],
    season: ['all'],
    mood: 'Glamorous',
    items: {
      dress: 'Swing Dress with Petticoat',
      shoes: 'Polka Dot Heels',
      accessories: ['Cherry Earrings'],
      hair: 'Victory Rolls',
      makeup: 'Pin-Up Glam'
    },
    colorPalette: ['#cc0000', '#0a0a0a', '#ffffff'],
    rarity: 'rare',
    specialEffects: ['petticoat-bounce'],
    rating: 5,
    tags: ['pin-up', 'glamorous', 'swing', 'classic']
  },
  {
    id: 'outfit-rock-003',
    name: 'Cherry Bomb',
    style: 'Rockabilly',
    subStyle: 'Pin-Up',
    description: 'Sweet and sassy cherry themed look',
    occasion: ['casual', 'themed party', 'summer'],
    season: ['spring', 'summer'],
    mood: 'Sweet & Sassy',
    items: {
      top: 'Cherry Embroidered Cardigan',
      dress: 'Cherry Print Halter Dress',
      shoes: 'Polka Dot Heels',
      accessories: ['Cherry Earrings'],
      hair: 'Bettie Bangs with Ponytail',
      makeup: 'Pin-Up Glam'
    },
    colorPalette: ['#ffffff', '#cc0000', '#228b22'],
    rarity: 'uncommon',
    specialEffects: ['skirt-sway', 'dangle-swing'],
    rating: 5,
    tags: ['cherry', 'sweet', 'sassy', 'summer']
  },
  {
    id: 'outfit-rock-004',
    name: 'Leopard Lady',
    style: 'Rockabilly',
    subStyle: 'Pin-Up',
    description: 'Fierce leopard print pin-up',
    occasion: ['night out', 'themed party', 'date'],
    season: ['all'],
    mood: 'Fierce',
    items: {
      top: 'Leopard Print Bustier',
      bottom: 'High-Waisted Pencil Skirt',
      shoes: 'Studded Creepers',
      accessories: ['Cherry Earrings'],
      hair: 'Victory Rolls',
      makeup: 'Pin-Up Glam'
    },
    colorPalette: ['#d4a574', '#0a0a0a', '#cc0000'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['leopard', 'fierce', 'bold', 'animal-print']
  },
  {
    id: 'outfit-rock-005',
    name: 'Polka Dot Dream',
    style: 'Rockabilly',
    subStyle: 'Vintage',
    description: 'Classic polka dot ensemble',
    occasion: ['dance', 'themed party', 'casual'],
    season: ['spring', 'summer'],
    mood: 'Playful',
    items: {
      bottom: 'Polka Dot Circle Skirt',
      top: 'Gingham Tie-Front Top',
      shoes: 'Saddle Shoes',
      accessories: ['Cherry Earrings'],
      hair: 'Bettie Bangs with Ponytail',
      makeup: 'Pin-Up Glam'
    },
    colorPalette: ['#0a0a0a', '#ffffff', '#cc0000'],
    rarity: 'common',
    specialEffects: ['skirt-twirl'],
    rating: 4,
    tags: ['polka-dot', 'playful', 'dance', 'classic']
  },

  // =========================================================================
  // ALTERNATIVE OUTFITS (176-190)
  // =========================================================================
  {
    id: 'outfit-alt-001',
    name: 'Grunge Queen',
    style: 'Alternative',
    subStyle: 'Grunge',
    description: 'Peak 90s grunge aesthetic',
    occasion: ['casual', 'concert', 'everyday'],
    season: ['fall', 'winter'],
    mood: 'Effortless',
    items: {
      top: 'Grunge Flannel',
      bottom: 'Ripped Black Jeans',
      shoes: 'Worn-In Converse Style',
      accessories: ['Layered Chain Necklace'],
      hair: 'Messy Shag with Bangs',
      makeup: 'Grunge Smudge'
    },
    colorPalette: ['#cc0000', '#0a0a0a', '#1a1a1a'],
    rarity: 'common',
    rating: 4,
    tags: ['grunge', '90s', 'effortless', 'casual']
  },
  {
    id: 'outfit-alt-002',
    name: 'Edgy Minimalist',
    style: 'Alternative',
    subStyle: 'Edgy',
    description: 'Simple but edgy everyday look',
    occasion: ['casual', 'everyday', 'school'],
    season: ['all'],
    mood: 'Cool',
    items: {
      top: 'Band Crop Tee',
      bottom: 'Ripped Black Jeans',
      shoes: 'Platform Boots',
      accessories: ['Layered Chain Necklace'],
      hair: 'Split Dye Hair',
      makeup: 'Grunge Smudge',
      headwear: 'Beanie'
    },
    colorPalette: ['#1a1a1a', '#4a4a4a', '#c0c0c0'],
    rarity: 'common',
    rating: 4,
    tags: ['minimalist', 'edgy', 'everyday', 'simple']
  },
  {
    id: 'outfit-alt-003',
    name: 'School Punk',
    style: 'Alternative',
    subStyle: 'Punk',
    description: 'Punk-inspired school outfit',
    occasion: ['school', 'casual', 'everyday'],
    season: ['fall', 'spring'],
    mood: 'Rebellious',
    items: {
      top: 'Mesh Long Sleeve',
      bottom: 'Plaid Mini Skirt',
      outerwear: 'Distressed Denim Jacket',
      shoes: 'Platform Boots',
      accessories: ['Layered Chain Necklace'],
      hair: 'Split Dye Hair',
      makeup: 'Grunge Smudge'
    },
    colorPalette: ['#0a0a0a', '#2a2a2a', '#c0c0c0'],
    rarity: 'uncommon',
    rating: 4,
    tags: ['punk', 'school', 'plaid', 'rebellious']
  },
  {
    id: 'outfit-alt-004',
    name: 'Concert Ready',
    style: 'Alternative',
    subStyle: 'Rock',
    description: 'Perfect for seeing your favorite band',
    occasion: ['concert', 'festival', 'night out'],
    season: ['summer', 'fall'],
    mood: 'Excited',
    items: {
      top: 'Band Crop Tee',
      bottom: 'Ripped Black Jeans',
      outerwear: 'Distressed Denim Jacket',
      shoes: 'Worn-In Converse Style',
      accessories: ['Layered Chain Necklace'],
      hair: 'Messy Shag with Bangs',
      makeup: 'Grunge Smudge'
    },
    colorPalette: ['#1a1a1a', '#87ceeb', '#c0c0c0'],
    rarity: 'common',
    rating: 4,
    tags: ['concert', 'band', 'rock', 'festival']
  },
  {
    id: 'outfit-alt-005',
    name: 'Cozy Alternative',
    style: 'Alternative',
    subStyle: 'Casual',
    description: 'Comfortable but still alt',
    occasion: ['casual', 'home', 'errands'],
    season: ['fall', 'winter'],
    mood: 'Cozy',
    items: {
      outerwear: 'Oversized Hoodie',
      bottom: 'Ripped Black Jeans',
      shoes: 'Worn-In Converse Style',
      accessories: ['Layered Chain Necklace'],
      hair: 'Messy Shag with Bangs',
      makeup: 'Grunge Smudge',
      headwear: 'Beanie'
    },
    colorPalette: ['#4a4a4a', '#1a1a1a', '#c0c0c0'],
    rarity: 'common',
    rating: 4,
    tags: ['cozy', 'comfortable', 'casual', 'warm']
  },

  // =========================================================================
  // REAL CLOTHES INSPIRED OUTFITS (191-210)
  // =========================================================================
  {
    id: 'outfit-real-001',
    name: 'Everyday Comfort',
    style: 'Real Clothes',
    subStyle: 'Comfort',
    description: 'Your go-to comfortable outfit',
    occasion: ['everyday', 'home', 'errands'],
    season: ['all'],
    mood: 'Relaxed',
    items: {
      top: 'Favorite Black Hoodie',
      bottom: 'Go-To Black Leggings',
      shoes: 'Comfy Slip-Ons',
      accessories: [],
      hair: 'Messy Bun',
      makeup: 'Natural No-Makeup Look'
    },
    colorPalette: ['#1a1a1a', '#0a0a0a'],
    rarity: 'common',
    rating: 5,
    tags: ['comfort', 'everyday', 'easy', 'relaxed']
  },
  {
    id: 'outfit-real-002',
    name: 'Low-Spoon Chic',
    style: 'Real Clothes',
    subStyle: 'Low Energy',
    description: 'Looking put-together with minimal effort',
    occasion: ['casual', 'appointments', 'errands'],
    season: ['all'],
    mood: 'Managing',
    items: {
      outerwear: 'Cozy Cardigan',
      bottom: 'Go-To Black Leggings',
      shoes: 'Comfy Slip-Ons',
      accessories: ['Sensory-Friendly Necklace'],
      hair: 'Messy Bun',
      makeup: 'Five-Minute Face'
    },
    colorPalette: ['#3a3a3a', '#0a0a0a', '#a0a0a0'],
    rarity: 'common',
    rating: 5,
    tags: ['low-spoon', 'easy', 'comfortable', 'managing']
  },
  {
    id: 'outfit-real-003',
    name: 'Casual Day Out',
    style: 'Real Clothes',
    subStyle: 'Casual',
    description: 'For running errands or casual hangouts',
    occasion: ['casual', 'shopping', 'friends'],
    season: ['all'],
    mood: 'Casual',
    items: {
      top: 'Graphic Tee Collection Piece',
      bottom: 'Favorite Jeans',
      shoes: 'Everyday Sneakers',
      accessories: ['Sensory-Friendly Necklace'],
      hair: 'Natural Easy Style',
      makeup: 'Five-Minute Face'
    },
    colorPalette: ['#1a1a1a', '#191970', '#ffffff'],
    rarity: 'common',
    rating: 4,
    tags: ['casual', 'everyday', 'comfortable', 'easy']
  },
  {
    id: 'outfit-real-004',
    name: 'Cozy Home Day',
    style: 'Real Clothes',
    subStyle: 'Lounge',
    description: 'Maximum comfort for staying in',
    occasion: ['home', 'rest', 'self-care'],
    season: ['all'],
    mood: 'Relaxed',
    items: {
      top: 'Favorite Black Hoodie',
      bottom: 'Comfy Sweatpants',
      shoes: 'Comfy Slip-Ons',
      accessories: [],
      hair: 'Messy Bun',
      makeup: 'Natural No-Makeup Look'
    },
    colorPalette: ['#1a1a1a', '#696969'],
    rarity: 'common',
    rating: 5,
    tags: ['home', 'lounge', 'cozy', 'rest']
  },
  {
    id: 'outfit-real-005',
    name: 'Simple & Put Together',
    style: 'Real Clothes',
    subStyle: 'Versatile',
    description: 'Simple outfit that looks pulled together',
    occasion: ['casual', 'work', 'appointments'],
    season: ['all'],
    mood: 'Capable',
    items: {
      dress: 'Easy Black Dress',
      outerwear: 'Cozy Cardigan',
      shoes: 'Everyday Sneakers',
      accessories: ['Sensory-Friendly Necklace'],
      hair: 'Natural Easy Style',
      makeup: 'Five-Minute Face'
    },
    colorPalette: ['#0a0a0a', '#3a3a3a', '#a0a0a0'],
    rarity: 'uncommon',
    rating: 5,
    tags: ['simple', 'versatile', 'put-together', 'capable']
  },
  {
    id: 'outfit-real-006',
    name: 'Fandom Pride',
    style: 'Real Clothes',
    subStyle: 'Casual',
    description: 'Representing your favorite show/band',
    occasion: ['casual', 'convention', 'concert'],
    season: ['all'],
    mood: 'Happy',
    items: {
      top: 'Graphic Tee Collection Piece',
      bottom: 'Go-To Black Leggings',
      outerwear: 'Cozy Cardigan',
      shoes: 'Everyday Sneakers',
      accessories: [],
      hair: 'Messy Bun',
      makeup: 'Natural No-Makeup Look'
    },
    colorPalette: ['#1a1a1a', '#0a0a0a', '#3a3a3a'],
    rarity: 'common',
    rating: 4,
    tags: ['fandom', 'casual', 'comfortable', 'happy']
  },
  {
    id: 'outfit-real-007',
    name: 'Doctor\'s Visit Ready',
    style: 'Real Clothes',
    subStyle: 'Practical',
    description: 'Easy outfit for medical appointments',
    occasion: ['appointments', 'medical', 'practical'],
    season: ['all'],
    mood: 'Practical',
    items: {
      top: 'Favorite Black Hoodie',
      bottom: 'Go-To Black Leggings',
      shoes: 'Comfy Slip-Ons',
      accessories: [],
      hair: 'Messy Bun',
      makeup: 'Natural No-Makeup Look'
    },
    colorPalette: ['#1a1a1a', '#0a0a0a'],
    rarity: 'common',
    rating: 5,
    tags: ['practical', 'medical', 'easy', 'comfortable']
  },
  {
    id: 'outfit-real-008',
    name: 'Good Day Outfit',
    style: 'Real Clothes',
    subStyle: 'Casual',
    description: 'For days when you have more energy',
    occasion: ['casual', 'outing', 'social'],
    season: ['all'],
    mood: 'Good',
    items: {
      top: 'Graphic Tee Collection Piece',
      bottom: 'Favorite Jeans',
      outerwear: 'Cozy Cardigan',
      shoes: 'Everyday Sneakers',
      accessories: ['Sensory-Friendly Necklace'],
      hair: 'Natural Easy Style',
      makeup: 'Five-Minute Face'
    },
    colorPalette: ['#1a1a1a', '#191970', '#3a3a3a'],
    rarity: 'common',
    rating: 5,
    tags: ['good-day', 'energy', 'casual', 'comfortable']
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getOutfitsByStyle(style: string): BratzOutfit[] {
  return BRATZ_OUTFITS.filter(outfit =>
    outfit.style.toLowerCase() === style.toLowerCase() ||
    outfit.subStyle?.toLowerCase() === style.toLowerCase()
  );
}

export function getOutfitsByOccasion(occasion: string): BratzOutfit[] {
  return BRATZ_OUTFITS.filter(outfit =>
    outfit.occasion.some(o => o.toLowerCase().includes(occasion.toLowerCase()))
  );
}

export function getOutfitsBySeason(season: string): BratzOutfit[] {
  return BRATZ_OUTFITS.filter(outfit =>
    outfit.season.includes(season as any) || outfit.season.includes('all')
  );
}

export function getOutfitsByRarity(rarity: string): BratzOutfit[] {
  return BRATZ_OUTFITS.filter(outfit => outfit.rarity === rarity);
}

export function getItemById(id: string): BratzClothingItem | undefined {
  return ALL_BRATZ_ITEMS.find(item => item.id === id);
}

export function getItemsByStyle(style: string): BratzClothingItem[] {
  return ALL_BRATZ_ITEMS.filter(item =>
    item.style.some(s => s.toLowerCase().includes(style.toLowerCase()))
  );
}

export function getItemsByType(type: string): BratzClothingItem[] {
  return ALL_BRATZ_ITEMS.filter(item => item.type === type);
}

export function getRandomOutfit(): BratzOutfit {
  return BRATZ_OUTFITS[Math.floor(Math.random() * BRATZ_OUTFITS.length)];
}

export function searchItems(query: string): BratzClothingItem[] {
  const q = query.toLowerCase();
  return ALL_BRATZ_ITEMS.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.tags.some(tag => tag.toLowerCase().includes(q)) ||
    item.style.some(style => style.toLowerCase().includes(q))
  );
}

export function searchOutfits(query: string): BratzOutfit[] {
  const q = query.toLowerCase();
  return BRATZ_OUTFITS.filter(outfit =>
    outfit.name.toLowerCase().includes(q) ||
    outfit.description.toLowerCase().includes(q) ||
    outfit.tags.some(tag => tag.toLowerCase().includes(q)) ||
    outfit.style.toLowerCase().includes(q)
  );
}

// Get total counts
export const BRATZ_WARDROBE_STATS = {
  totalItems: ALL_BRATZ_ITEMS.length,
  totalOutfits: BRATZ_OUTFITS.length,
  styles: ['Gothic', 'Punk', 'Steampunk', 'K-Pop', 'Hip Hop', 'R&B', 'Anime', 'Cosplay', 'Holiday', 'Rockabilly', 'Alternative', 'Real Clothes'],
  itemsByType: {
    tops: ALL_BRATZ_ITEMS.filter(i => i.type === 'top').length,
    bottoms: ALL_BRATZ_ITEMS.filter(i => i.type === 'bottom').length,
    dresses: ALL_BRATZ_ITEMS.filter(i => i.type === 'dress').length,
    outerwear: ALL_BRATZ_ITEMS.filter(i => i.type === 'outerwear').length,
    shoes: ALL_BRATZ_ITEMS.filter(i => i.type === 'shoes').length,
    accessories: ALL_BRATZ_ITEMS.filter(i => i.type === 'accessory').length,
    hair: ALL_BRATZ_ITEMS.filter(i => i.type === 'hair').length,
    makeup: ALL_BRATZ_ITEMS.filter(i => i.type === 'makeup').length
  }
};
