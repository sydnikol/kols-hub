/**
 * 🎨 AVATAR STYLE GENERATOR
 * AI-powered avatar customization and styling
 */

import { geminiAI } from './geminiAIService';

export interface AvatarStyle {
  id: string;
  name: string;
  category: 'casual' | 'formal' | 'sporty' | 'artistic' | 'fantasy' | 'professional';
  hairstyle: string;
  hairColor: string;
  outfit: {
    top: string;
    bottom: string;
    shoes: string;
    accessories: string[];
  };
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  mood: string;
  expression: string;
  tags: string[];
}

export class AvatarStyleGenerator {
  private static instance: AvatarStyleGenerator;

  static getInstance(): AvatarStyleGenerator {
    if (!AvatarStyleGenerator.instance) {
      AvatarStyleGenerator.instance = new AvatarStyleGenerator();
    }
    return AvatarStyleGenerator.instance;
  }

  /**
   * Generate avatar styles based on personality
   */
  async generateStyles(personality: string = 'creative and friendly'): Promise<AvatarStyle[]> {
    console.log('🎨 Generating AI-powered avatar styles...');

    try {
      const result = await geminiAI.generateAvatarStyles(personality);

      if (result.styles && result.styles.length > 0) {
        return result.styles.map((style: any, i: number) => ({
          id: `ai-style-${Date.now()}-${i}`,
          name: style.name || `Style ${i + 1}`,
          category: this.inferCategory(style),
          ...style,
          tags: style.tags || [],
        }));
      }
    } catch (error) {
      console.error('AI generation failed, using fallback styles:', error);
    }

    // Fallback to pre-generated styles if AI fails
    return this.getPreGeneratedStyles();
  }

  /**
   * Pre-generated fallback styles
   */
  private getPreGeneratedStyles(): AvatarStyle[] {
    return [
      {
        id: 'casual-1',
        name: 'Casual Cool',
        category: 'casual',
        hairstyle: 'Messy waves',
        hairColor: '#4A3728',
        outfit: {
          top: 'Graphic t-shirt',
          bottom: 'Jeans',
          shoes: 'Sneakers',
          accessories: ['Baseball cap', 'Backpack'],
        },
        colorPalette: {
          primary: '#2196F3',
          secondary: '#FFC107',
          accent: '#FF5722',
        },
        mood: 'Relaxed',
        expression: 'Friendly smile',
        tags: ['casual', 'streetwear', 'comfortable'],
      },
      {
        id: 'professional-1',
        name: 'Business Professional',
        category: 'professional',
        hairstyle: 'Sleek updo',
        hairColor: '#1A1A1A',
        outfit: {
          top: 'Blazer',
          bottom: 'Dress pants',
          shoes: 'Oxfords',
          accessories: ['Watch', 'Briefcase'],
        },
        colorPalette: {
          primary: '#263238',
          secondary: '#455A64',
          accent: '#78909C',
        },
        mood: 'Confident',
        expression: 'Professional smile',
        tags: ['business', 'formal', 'corporate'],
      },
      {
        id: 'artistic-1',
        name: 'Creative Artist',
        category: 'artistic',
        hairstyle: 'Colorful pixie cut',
        hairColor: '#E91E63',
        outfit: {
          top: 'Paint-splattered shirt',
          bottom: 'Overalls',
          shoes: 'Boots',
          accessories: ['Beret', 'Art supplies bag'],
        },
        colorPalette: {
          primary: '#9C27B0',
          secondary: '#E91E63',
          accent: '#FFC107',
        },
        mood: 'Inspired',
        expression: 'Thoughtful',
        tags: ['artistic', 'creative', 'bohemian'],
      },
      {
        id: 'sporty-1',
        name: 'Athletic Active',
        category: 'sporty',
        hairstyle: 'High ponytail',
        hairColor: '#8D6E63',
        outfit: {
          top: 'Athletic tank',
          bottom: 'Track pants',
          shoes: 'Running shoes',
          accessories: ['Smartwatch', 'Water bottle'],
        },
        colorPalette: {
          primary: '#4CAF50',
          secondary: '#8BC34A',
          accent: '#CDDC39',
        },
        mood: 'Energetic',
        expression: 'Determined',
        tags: ['sporty', 'active', 'fitness'],
      },
      {
        id: 'fantasy-1',
        name: 'Mystical Wanderer',
        category: 'fantasy',
        hairstyle: 'Long flowing locks',
        hairColor: '#7E57C2',
        outfit: {
          top: 'Hooded cloak',
          bottom: 'Leather boots',
          shoes: 'Adventurer boots',
          accessories: ['Staff', 'Potion belt', 'Magical amulet'],
        },
        colorPalette: {
          primary: '#673AB7',
          secondary: '#9C27B0',
          accent: '#E1BEE7',
        },
        mood: 'Mysterious',
        expression: 'Wise gaze',
        tags: ['fantasy', 'magical', 'rpg'],
      },
    ];
  }

  /**
   * Infer category from style description
   */
  private inferCategory(style: any): AvatarStyle['category'] {
    const description = (style.description || style.name || '').toLowerCase();

    if (description.includes('business') || description.includes('professional') || description.includes('formal')) {
      return 'professional';
    }
    if (description.includes('sport') || description.includes('athletic') || description.includes('active')) {
      return 'sporty';
    }
    if (description.includes('art') || description.includes('creative') || description.includes('bohemian')) {
      return 'artistic';
    }
    if (description.includes('fantasy') || description.includes('magical') || description.includes('mystical')) {
      return 'fantasy';
    }
    if (description.includes('formal') || description.includes('elegant') || description.includes('sophisticated')) {
      return 'formal';
    }

    return 'casual';
  }

  /**
   * Save avatar customization
   */
  saveCustomization(userId: string, style: AvatarStyle) {
    const customizations = JSON.parse(localStorage.getItem('avatarCustomizations') || '{}');
    customizations[userId] = {
      ...style,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('avatarCustomizations', JSON.stringify(customizations));
    console.log('✅ Avatar customization saved');
  }

  /**
   * Load avatar customization
   */
  loadCustomization(userId: string): AvatarStyle | null {
    const customizations = JSON.parse(localStorage.getItem('avatarCustomizations') || '{}');
    return customizations[userId] || null;
  }

  /**
   * Generate random outfit combination
   */
  generateRandomOutfit(): { top: string; bottom: string; shoes: string; accessories: string[] } {
    const tops = ['T-shirt', 'Hoodie', 'Blouse', 'Sweater', 'Tank top', 'Button-up shirt', 'Polo'];
    const bottoms = ['Jeans', 'Shorts', 'Skirt', 'Leggings', 'Dress pants', 'Cargo pants'];
    const shoes = ['Sneakers', 'Boots', 'Sandals', 'Dress shoes', 'Loafers', 'Athletic shoes'];
    const accessories = ['Hat', 'Sunglasses', 'Watch', 'Bracelet', 'Necklace', 'Backpack', 'Scarf'];

    return {
      top: tops[Math.floor(Math.random() * tops.length)],
      bottom: bottoms[Math.floor(Math.random() * bottoms.length)],
      shoes: shoes[Math.floor(Math.random() * shoes.length)],
      accessories: [
        accessories[Math.floor(Math.random() * accessories.length)],
        accessories[Math.floor(Math.random() * accessories.length)],
      ],
    };
  }
}

export const avatarStyleGenerator = AvatarStyleGenerator.getInstance();
export default avatarStyleGenerator;
