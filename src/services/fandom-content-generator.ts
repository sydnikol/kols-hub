/**
 * FANDOM API INTEGRATION
 * Generate viral content from popular fandoms
 *
 * Why Fandom?
 * - 250+ million monthly visitors
 * - 250,000+ wikis (Gaming, Anime, Movies, TV, etc.)
 * - HIGHLY engaged audiences
 * - Perfect for affiliate marketing (gaming gear, collectibles, etc.)
 * - Viral content potential is MASSIVE
 *
 * Money-Making Examples:
 * - "10 Things You Didn't Know About [Popular Character]" → 1M+ views
 * - "Complete Guide to [Popular Game]" → Amazon affiliate links
 * - Character analysis videos → YouTube revenue
 * - Gaming tips from wikis → TikTok Creator Fund
 *
 * API: FREE, no auth required!
 * Docs: https://dev.fandom.com/
 */

export interface FandomWiki {
  id: string;
  name: string;
  url: string;
  description: string;
  articles: number;
  category: 'Gaming' | 'Anime' | 'Movies' | 'TV' | 'Books' | 'Comics' | 'Other';
}

export interface FandomArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  url: string;
  images: string[];
  categories: string[];
}

export interface ViralContentIdea {
  title: string;
  type: 'youtube' | 'tiktok' | 'blog';
  hook: string;
  outline: string[];
  keywords: string[];
  estimatedViews: number;
  affiliateOpportunities: string[];
}

class FandomContentService {
  private baseUrl = 'https://community.fandom.com/api/v1';

  /**
   * Search Fandom wikis
   */
  async searchWikis(query: string, limit: number = 25): Promise<FandomWiki[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/Wikis/List?string=${encodeURIComponent(query)}&limit=${limit}`
      );

      if (!response.ok) return [];

      const data = await response.json();

      return data.items?.map((wiki: any) => ({
        id: wiki.id,
        name: wiki.name,
        url: wiki.url,
        description: wiki.desc || '',
        articles: wiki.stats?.articles || 0,
        category: this.categorizeWiki(wiki.hub || '')
      })) || [];
    } catch (error) {
      console.error('Fandom search error:', error);
      return [];
    }
  }

  /**
   * Get trending wikis
   */
  async getTrendingWikis(): Promise<FandomWiki[]> {
    // Popular gaming wikis (these get MILLIONS of views)
    const popularTopics = [
      'Minecraft',
      'Roblox',
      'Fortnite',
      'Pokemon',
      'Marvel',
      'Star Wars',
      'Harry Potter',
      'Naruto',
      'One Piece',
      'League of Legends'
    ];

    const allWikis: FandomWiki[] = [];

    for (const topic of popularTopics.slice(0, 5)) {
      const wikis = await this.searchWikis(topic, 2);
      allWikis.push(...wikis);
    }

    return allWikis;
  }

  /**
   * Get article from wiki
   */
  async getArticle(wikiDomain: string, articleTitle: string): Promise<FandomArticle | null> {
    try {
      const baseWikiUrl = `https://${wikiDomain}.fandom.com/api.php`;

      const params = new URLSearchParams({
        action: 'parse',
        page: articleTitle,
        prop: 'text|categories|images',
        format: 'json',
        origin: '*'
      });

      const response = await fetch(`${baseWikiUrl}?${params}`);

      if (!response.ok) return null;

      const data = await response.json();

      if (data.error) return null;

      const parse = data.parse;

      // Extract text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = parse.text['*'];
      const content = tempDiv.textContent || tempDiv.innerText || '';

      // Get summary (first paragraph)
      const summary = content.split('\n\n')[0] || content.substring(0, 500);

      return {
        id: parse.pageid,
        title: parse.title,
        summary,
        content,
        url: `https://${wikiDomain}.fandom.com/wiki/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`,
        images: parse.images || [],
        categories: parse.categories?.map((cat: any) => cat['*']) || []
      };
    } catch (error) {
      console.error('Failed to get article:', error);
      return null;
    }
  }

  /**
   * Generate viral content ideas from fandom
   */
  async generateViralIdeas(fandomName: string): Promise<ViralContentIdea[]> {
    const ideas: ViralContentIdea[] = [];

    // Get wiki info
    const wikis = await this.searchWikis(fandomName, 1);
    if (wikis.length === 0) return ideas;

    const wiki = wikis[0];

    // Generate various viral content types
    ideas.push({
      title: `10 Things You DIDN'T KNOW About ${fandomName}`,
      type: 'youtube',
      hook: `Think you know everything about ${fandomName}? Think again! These hidden secrets will blow your mind!`,
      outline: [
        'Intro - Hook the viewer',
        'Fact 1 - Obscure lore',
        'Fact 2 - Development secrets',
        'Fact 3 - Easter eggs',
        'Fact 4 - Character backstories',
        'Fact 5 - Fan theories',
        'Fact 6-10 - More hidden gems',
        'Conclusion - Call to action'
      ],
      keywords: [fandomName, `${fandomName} secrets`, `${fandomName} hidden`, `${fandomName} facts`],
      estimatedViews: 100000,
      affiliateOpportunities: [
        `${fandomName} merchandise on Amazon`,
        `${fandomName} games/books`,
        'Collectibles and figures'
      ]
    });

    ideas.push({
      title: `COMPLETE ${fandomName} Guide for Beginners`,
      type: 'youtube',
      hook: `New to ${fandomName}? I'll teach you EVERYTHING you need to know in 10 minutes!`,
      outline: [
        'What is ' + fandomName,
        'Getting started',
        'Key characters/elements',
        'Important locations',
        'Tips and tricks',
        'Common mistakes to avoid',
        'Resources and next steps'
      ],
      keywords: [fandomName, `${fandomName} guide`, `${fandomName} tutorial`, `${fandomName} beginner`],
      estimatedViews: 50000,
      affiliateOpportunities: [
        `${fandomName} starter packs`,
        'Beginner guides (books)',
        'Essential merchandise'
      ]
    });

    ideas.push({
      title: `${fandomName} vs Reality: What They Got WRONG`,
      type: 'tiktok',
      hook: `You won't believe what ${fandomName} got completely wrong about [topic]!`,
      outline: [
        'Myth 1 vs Reality',
        'Myth 2 vs Reality',
        'Myth 3 vs Reality',
        'Why it matters'
      ],
      keywords: [fandomName, 'vs reality', 'facts', 'myths'],
      estimatedViews: 500000,
      affiliateOpportunities: [
        'Related books/documentaries',
        'Educational materials'
      ]
    });

    ideas.push({
      title: `Every ${fandomName} Character RANKED`,
      type: 'youtube',
      hook: `I ranked EVERY ${fandomName} character from worst to best. You'll be shocked at #1!`,
      outline: [
        'Intro - Ranking criteria',
        'Bottom tier characters',
        'Mid tier characters',
        'Top tier characters',
        'The ultimate #1',
        'Conclusion - Your rankings?'
      ],
      keywords: [fandomName, `${fandomName} ranked`, `${fandomName} tier list`, `${fandomName} characters`],
      estimatedViews: 200000,
      affiliateOpportunities: [
        'Character merchandise',
        'Collectible figures',
        'Trading cards'
      ]
    });

    ideas.push({
      title: `${fandomName} Theory That Changes EVERYTHING`,
      type: 'blog',
      hook: `This one theory about ${fandomName} will completely change how you see the entire story...`,
      outline: [
        'The theory explained',
        'Evidence #1',
        'Evidence #2',
        'Evidence #3',
        'Why this matters',
        'What it means for the future',
        'Community reactions'
      ],
      keywords: [fandomName, `${fandomName} theory`, `${fandomName} explained`, `${fandomName} lore`],
      estimatedViews: 50000,
      affiliateOpportunities: [
        'Related media (books, comics)',
        'Analysis tools',
        'Fan merchandise'
      ]
    });

    return ideas;
  }

  /**
   * Generate gaming content (HUGE money potential)
   */
  async generateGamingContent(gameName: string): Promise<ViralContentIdea[]> {
    return [
      {
        title: `${gameName}: Tips the PROS Don't Want You to Know`,
        type: 'youtube',
        hook: 'These pro tips will take your game to the NEXT LEVEL!',
        outline: [
          'Pro tip #1',
          'Pro tip #2',
          'Pro tip #3',
          'Secret strategies',
          'Common mistakes',
          'Advanced techniques'
        ],
        keywords: [gameName, `${gameName} tips`, `${gameName} guide`, `${gameName} pro`],
        estimatedViews: 500000,
        affiliateOpportunities: [
          'Gaming keyboards/mice',
          'Gaming chairs',
          'Headsets',
          `${gameName} guides (ebooks)`,
          'Gaming subscriptions'
        ]
      },
      {
        title: `${gameName} Speedrun World Record Attempts`,
        type: 'youtube',
        hook: 'Watch me attempt to break the world record!',
        outline: ['Strategy explanation', 'Attempt #1', 'Attempt #2', 'Best run', 'Analysis'],
        keywords: [gameName, 'speedrun', 'world record', 'gameplay'],
        estimatedViews: 1000000,
        affiliateOpportunities: [
          'Gaming equipment',
          'Capture cards',
          'Streaming gear'
        ]
      }
    ];
  }

  /**
   * Categorize wiki
   */
  private categorizeWiki(hub: string): FandomWiki['category'] {
    const hubLower = hub.toLowerCase();
    if (hubLower.includes('gam')) return 'Gaming';
    if (hubLower.includes('anime')) return 'Anime';
    if (hubLower.includes('movie')) return 'Movies';
    if (hubLower.includes('tv')) return 'TV';
    if (hubLower.includes('book')) return 'Books';
    if (hubLower.includes('comic')) return 'Comics';
    return 'Other';
  }

  /**
   * Generate complete content package
   */
  async generateContentPackage(fandomName: string): Promise<{
    youtube: ViralContentIdea[];
    tiktok: ViralContentIdea[];
    blog: ViralContentIdea[];
    totalEstimatedViews: number;
    affiliateOpportunities: string[];
  }> {
    const allIdeas = await this.generateViralIdeas(fandomName);

    const youtube = allIdeas.filter(i => i.type === 'youtube');
    const tiktok = allIdeas.filter(i => i.type === 'tiktok');
    const blog = allIdeas.filter(i => i.type === 'blog');

    const totalViews = allIdeas.reduce((sum, idea) => sum + idea.estimatedViews, 0);

    const allOpportunities = new Set<string>();
    allIdeas.forEach(idea => {
      idea.affiliateOpportunities.forEach(opp => allOpportunities.add(opp));
    });

    return {
      youtube,
      tiktok,
      blog,
      totalEstimatedViews: totalViews,
      affiliateOpportunities: Array.from(allOpportunities)
    };
  }
}

export const fandomService = new FandomContentService();

/**
 * React Hook
 */
export function useFandomContent() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [trendingWikis, setTrendingWikis] = React.useState<FandomWiki[]>([]);

  React.useEffect(() => {
    fandomService.getTrendingWikis().then(setTrendingWikis);
  }, []);

  const generateIdeas = async (fandomName: string) => {
    setIsLoading(true);
    try {
      return await fandomService.generateViralIdeas(fandomName);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    trendingWikis,
    generateIdeas,
    generateContentPackage: fandomService.generateContentPackage.bind(fandomService),
    generateGamingContent: fandomService.generateGamingContent.bind(fandomService),
    searchWikis: fandomService.searchWikis.bind(fandomService)
  };
}

import React from 'react';
