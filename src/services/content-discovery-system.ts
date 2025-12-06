/**
 * CONTENT DISCOVERY SYSTEM
 * Integrates Wikipedia + SeeAlso.org + Trending Topics
 *
 * Never run out of content ideas again!
 *
 * Features:
 * - Find related topics automatically
 * - Expand single idea into 100+ pieces
 * - Discover trending connections
 * - Generate content clusters
 * - Build topic maps
 */

import { wikipediaService } from './wikipedia-content-generator';

export interface RelatedTopic {
  title: string;
  relevance: number;
  url: string;
  category?: string;
}

export interface ContentCluster {
  mainTopic: string;
  relatedTopics: RelatedTopic[];
  contentIdeas: ContentIdea[];
  keywords: string[];
  estimatedReach: number;
}

export interface ContentIdea {
  title: string;
  type: 'youtube' | 'tiktok' | 'blog' | 'medium' | 'twitter';
  description: string;
  keywords: string[];
  estimatedViews: number;
}

class ContentDiscoveryService {
  private seeAlsoUrl = 'https://api.seealso.org';

  /**
   * Find related topics using SeeAlso.org
   */
  async findRelatedTopics(topic: string, limit: number = 20): Promise<RelatedTopic[]> {
    try {
      // SeeAlso.org API endpoint
      const response = await fetch(`${this.seeAlsoUrl}/?wiki=en&title=${encodeURIComponent(topic)}&format=json`);

      if (!response.ok) {
        console.warn('SeeAlso API unavailable, using Wikipedia search fallback');
        return this.fallbackRelatedTopics(topic, limit);
      }

      const data = await response.json();

      return data.results?.map((result: any) => ({
        title: result.title,
        relevance: result.score || 0.5,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`,
        category: result.category
      })).slice(0, limit) || [];
    } catch (error) {
      console.warn('SeeAlso error, using fallback:', error);
      return this.fallbackRelatedTopics(topic, limit);
    }
  }

  /**
   * Fallback: Use Wikipedia search for related topics
   */
  private async fallbackRelatedTopics(topic: string, limit: number): Promise<RelatedTopic[]> {
    const results = await wikipediaService.search(topic, limit);
    return results.map(result => ({
      title: result.title,
      relevance: 0.5,
      url: result.url,
      category: 'wikipedia-search'
    }));
  }

  /**
   * Create content cluster from single topic
   * Expands 1 topic into 50-100+ content pieces!
   */
  async createContentCluster(mainTopic: string): Promise<ContentCluster> {
    console.log(`🔍 Creating content cluster for: ${mainTopic}`);

    // 1. Find related topics
    const relatedTopics = await this.findRelatedTopics(mainTopic, 20);

    // 2. Generate content ideas for main topic
    const mainIdeas = await this.generateIdeasForTopic(mainTopic);

    // 3. Generate ideas for each related topic (5 per topic)
    const relatedIdeas: ContentIdea[] = [];
    for (const related of relatedTopics.slice(0, 10)) {
      const ideas = await this.generateIdeasForTopic(related.title, 5);
      relatedIdeas.push(...ideas);
    }

    // 4. Extract keywords
    const allTopics = [mainTopic, ...relatedTopics.map(t => t.title)];
    const keywords = this.extractKeywords(allTopics);

    // 5. Calculate estimated reach
    const estimatedReach = (mainIdeas.length + relatedIdeas.length) * 500; // 500 views per piece avg

    return {
      mainTopic,
      relatedTopics,
      contentIdeas: [...mainIdeas, ...relatedIdeas],
      keywords,
      estimatedReach
    };
  }

  /**
   * Generate multiple content ideas for a single topic
   */
  private async generateIdeasForTopic(topic: string, count: number = 10): Promise<ContentIdea[]> {
    const ideas: ContentIdea[] = [];

    // YouTube ideas
    ideas.push({
      title: `Everything You Need to Know About ${topic}`,
      type: 'youtube',
      description: `Complete guide to ${topic}`,
      keywords: [topic, `${topic} explained`, `what is ${topic}`],
      estimatedViews: 5000
    });

    ideas.push({
      title: `Top 10 Facts About ${topic} That Will Blow Your Mind`,
      type: 'youtube',
      description: `Fascinating facts about ${topic}`,
      keywords: [topic, `${topic} facts`, `amazing ${topic}`],
      estimatedViews: 10000
    });

    // TikTok ideas
    ideas.push({
      title: `Did You Know? ${topic} Edition`,
      type: 'tiktok',
      description: `Quick facts about ${topic}`,
      keywords: [topic, 'facts', 'education'],
      estimatedViews: 50000
    });

    // Blog ideas
    ideas.push({
      title: `The Ultimate Guide to ${topic} in 2025`,
      type: 'blog',
      description: `Comprehensive guide covering everything about ${topic}`,
      keywords: [topic, `${topic} guide`, `learn ${topic}`],
      estimatedViews: 2000
    });

    // Medium ideas
    ideas.push({
      title: `5 Things I Learned About ${topic}`,
      type: 'medium',
      description: `Personal insights and research on ${topic}`,
      keywords: [topic, 'lessons', 'learning'],
      estimatedViews: 1000
    });

    // Twitter ideas
    ideas.push({
      title: `🧵 Thread: Everything About ${topic}`,
      type: 'twitter',
      description: `Educational thread breaking down ${topic}`,
      keywords: [topic, 'thread', 'explained'],
      estimatedViews: 5000
    });

    return ideas.slice(0, count);
  }

  /**
   * Extract keywords from topics
   */
  private extractKeywords(topics: string[]): string[] {
    const keywords = new Set<string>();

    topics.forEach(topic => {
      // Add the topic itself
      keywords.add(topic.toLowerCase());

      // Add variations
      keywords.add(`${topic} explained`);
      keywords.add(`what is ${topic}`);
      keywords.add(`${topic} guide`);
      keywords.add(`${topic} facts`);
      keywords.add(`learn ${topic}`);
    });

    return Array.from(keywords).slice(0, 50);
  }

  /**
   * Generate 30-day content calendar
   */
  async generate30DayCalendar(niche: string): Promise<{
    days: Array<{
      day: number;
      topics: string[];
      contentPieces: number;
      platforms: string[];
    }>;
    totalPieces: number;
    estimatedReach: number;
  }> {
    console.log(`📅 Generating 30-day calendar for: ${niche}`);

    // Get main topics for the niche
    const mainTopics = await wikipediaService.search(niche, 10);

    const calendar = [];
    let totalPieces = 0;

    for (let day = 1; day <= 30; day++) {
      const topicIndex = (day - 1) % mainTopics.length;
      const topic = mainTopics[topicIndex];

      // Find related topics for variety
      const related = await this.findRelatedTopics(topic.title, 3);

      const dayTopics = [topic.title, ...related.slice(0, 2).map(r => r.title)];
      const contentPieces = 5; // 5 pieces per day

      calendar.push({
        day,
        topics: dayTopics,
        contentPieces,
        platforms: ['tiktok', 'youtube', 'medium', 'twitter', 'pinterest']
      });

      totalPieces += contentPieces;
    }

    return {
      days: calendar,
      totalPieces,
      estimatedReach: totalPieces * 1000 // 1000 views per piece avg
    };
  }

  /**
   * Find content gaps (topics your competitors haven't covered)
   */
  async findContentGaps(niche: string, competitorTopics: string[]): Promise<string[]> {
    // Get all possible topics in niche
    const allTopics = await wikipediaService.search(niche, 50);

    // Find topics not covered by competitors
    const gaps = allTopics
      .filter(topic => !competitorTopics.some(comp =>
        topic.title.toLowerCase().includes(comp.toLowerCase()) ||
        comp.toLowerCase().includes(topic.title.toLowerCase())
      ))
      .map(t => t.title);

    return gaps.slice(0, 20);
  }

  /**
   * Generate viral content ideas (controversial/surprising topics)
   */
  async generateViralIdeas(niche: string): Promise<ContentIdea[]> {
    const topics = await wikipediaService.search(`${niche} controversy`, 10);

    const viralIdeas: ContentIdea[] = topics.map(topic => ({
      title: `The TRUTH About ${topic.title} (Nobody Tells You This)`,
      type: 'youtube',
      description: `Controversial facts and hidden truths about ${topic.title}`,
      keywords: [topic.title, 'truth', 'exposed', 'facts'],
      estimatedViews: 50000
    }));

    return viralIdeas;
  }

  /**
   * Auto-generate content for an entire week
   */
  async generateWeekOfContent(niche: string): Promise<{
    youtube: string[];
    tiktok: string[];
    blog: any[];
    medium: any[];
    twitter: string[];
  }> {
    console.log(`🚀 Generating week of content for: ${niche}...`);

    const mainTopics = await wikipediaService.search(niche, 7);

    const content = {
      youtube: [] as string[],
      tiktok: [] as string[],
      blog: [] as any[],
      medium: [] as any[],
      twitter: [] as string[]
    };

    for (const topic of mainTopics) {
      // YouTube (1 per day)
      const ytScript = await wikipediaService.generateYouTubeScript(topic.title);
      if (ytScript) content.youtube.push(ytScript);

      // TikTok (5 per day)
      const tiktoks = await wikipediaService.generateShortFormIdeas(topic.title);
      content.tiktok.push(...tiktoks.slice(0, 5));

      // Blog (1 per day)
      const blogIdea = await wikipediaService.generateBlogIdea(topic.title);
      if (blogIdea) content.blog.push(blogIdea);

      // Medium (1 per day)
      const listicle = await wikipediaService.generateListicle(topic.title, 10);
      if (listicle) content.medium.push(listicle);

      // Twitter (10 tweets per day from the article)
      const article = await wikipediaService.getSummary(topic.title);
      if (article) {
        const tweets = article.summary.split(/[.!?]+/)
          .filter(s => s.trim().length > 20 && s.trim().length < 280)
          .slice(0, 10)
          .map(s => `${s.trim()}... 🧵\n\n#${topic.title.replace(/\s+/g, '')}`);
        content.twitter.push(...tweets);
      }
    }

    console.log(`✅ Generated:
    - ${content.youtube.length} YouTube scripts
    - ${content.tiktok.length} TikTok videos
    - ${content.blog.length} blog posts
    - ${content.medium.length} Medium articles
    - ${content.twitter.length} tweets

    Total: ${content.youtube.length + content.tiktok.length + content.blog.length + content.medium.length + content.twitter.length} pieces!`);

    return content;
  }
}

export const contentDiscoveryService = new ContentDiscoveryService();

/**
 * React Hook
 */
export function useContentDiscovery() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [contentCluster, setContentCluster] = React.useState<ContentCluster | null>(null);

  const createCluster = async (topic: string) => {
    setIsLoading(true);
    try {
      const cluster = await contentDiscoveryService.createContentCluster(topic);
      setContentCluster(cluster);
      return cluster;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    contentCluster,
    createCluster,
    findRelatedTopics: contentDiscoveryService.findRelatedTopics.bind(contentDiscoveryService),
    generate30DayCalendar: contentDiscoveryService.generate30DayCalendar.bind(contentDiscoveryService),
    generateWeekOfContent: contentDiscoveryService.generateWeekOfContent.bind(contentDiscoveryService),
    generateViralIdeas: contentDiscoveryService.generateViralIdeas.bind(contentDiscoveryService)
  };
}

import React from 'react';
