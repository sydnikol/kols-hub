/**
 * WIKIPEDIA/WIKIMEDIA API INTEGRATION
 * Research and generate content automatically using Wikipedia
 *
 * Use Cases:
 * - Research topics for blog posts
 * - Generate educational content
 * - Create "10 Facts About..." articles
 * - Build knowledge-based products
 * - Enhance Medium/blog articles with facts
 * - Create video scripts from Wikipedia data
 *
 * API: FREE, no auth required!
 * Docs: https://developer.wikimedia.org/
 */

export interface WikiArticle {
  title: string;
  summary: string;
  fullText: string;
  url: string;
  imageUrl?: string;
  categories: string[];
  sections: WikiSection[];
}

export interface WikiSection {
  title: string;
  content: string;
  level: number;
}

export interface WikiSearchResult {
  title: string;
  snippet: string;
  pageId: number;
  url: string;
}

class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private wikiApiUrl = 'https://en.wikipedia.org/w/api.php';

  /**
   * Search Wikipedia articles
   */
  async search(query: string, limit: number = 10): Promise<WikiSearchResult[]> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: limit.toString(),
        format: 'json',
        origin: '*'
      });

      const response = await fetch(`${this.wikiApiUrl}?${params}`);
      const data = await response.json();

      return data.query.search.map((result: any) => ({
        title: result.title,
        snippet: result.snippet.replace(/<[^>]*>/g, ''), // Remove HTML tags
        pageId: result.pageid,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`
      }));
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  /**
   * Get article summary (perfect for quick facts)
   */
  async getSummary(title: string): Promise<WikiArticle | null> {
    try {
      const encodedTitle = encodeURIComponent(title.replace(/ /g, '_'));
      const response = await fetch(`${this.baseUrl}/page/summary/${encodedTitle}`);

      if (!response.ok) return null;

      const data = await response.json();

      return {
        title: data.title,
        summary: data.extract,
        fullText: data.extract,
        url: data.content_urls.desktop.page,
        imageUrl: data.thumbnail?.source,
        categories: [],
        sections: []
      };
    } catch (error) {
      console.error('Failed to get summary:', error);
      return null;
    }
  }

  /**
   * Get full article with all sections
   */
  async getFullArticle(title: string): Promise<WikiArticle | null> {
    try {
      const params = new URLSearchParams({
        action: 'parse',
        page: title,
        prop: 'text|categories|sections',
        format: 'json',
        origin: '*'
      });

      const response = await fetch(`${this.wikiApiUrl}?${params}`);
      const data = await response.json();

      if (data.error) return null;

      const parse = data.parse;

      // Extract text content (remove HTML)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = parse.text['*'];
      const fullText = tempDiv.textContent || tempDiv.innerText || '';

      // Get summary
      const summary = await this.getSummary(title);

      return {
        title: parse.title,
        summary: summary?.summary || fullText.substring(0, 500),
        fullText,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
        imageUrl: summary?.imageUrl,
        categories: parse.categories.map((cat: any) => cat['*']),
        sections: parse.sections.map((section: any) => ({
          title: section.line,
          content: '', // Would need additional parsing
          level: section.level
        }))
      };
    } catch (error) {
      console.error('Failed to get full article:', error);
      return null;
    }
  }

  /**
   * Get random articles (for content ideas)
   */
  async getRandomArticles(count: number = 5): Promise<WikiSearchResult[]> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        list: 'random',
        rnnamespace: '0',
        rnlimit: count.toString(),
        format: 'json',
        origin: '*'
      });

      const response = await fetch(`${this.wikiApiUrl}?${params}`);
      const data = await response.json();

      return data.query.random.map((article: any) => ({
        title: article.title,
        snippet: '',
        pageId: article.id,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, '_'))}`
      }));
    } catch (error) {
      console.error('Failed to get random articles:', error);
      return [];
    }
  }

  /**
   * Generate blog post idea from Wikipedia article
   */
  async generateBlogIdea(topic: string): Promise<{
    title: string;
    outline: string[];
    keywords: string[];
    sources: string[];
  } | null> {
    try {
      const article = await this.getSummary(topic);
      if (!article) return null;

      // Generate catchy title variations
      const titleVariations = [
        `10 Fascinating Facts About ${topic}`,
        `Everything You Need to Know About ${topic}`,
        `The Ultimate Guide to ${topic}`,
        `${topic}: A Complete Breakdown`,
        `Understanding ${topic} in 5 Minutes`
      ];

      // Extract key points for outline
      const sentences = article.summary.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const outline = sentences.slice(0, 5).map(s => s.trim());

      // Extract potential keywords
      const words = article.summary.toLowerCase().split(/\W+/);
      const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'that', 'this', 'these', 'those', 'it', 'its', 'as']);
      const keywords = Array.from(new Set(words))
        .filter(w => w.length > 4 && !commonWords.has(w))
        .slice(0, 10);

      return {
        title: titleVariations[0],
        outline,
        keywords,
        sources: [article.url]
      };
    } catch (error) {
      console.error('Failed to generate blog idea:', error);
      return null;
    }
  }

  /**
   * Generate YouTube script from Wikipedia article
   */
  async generateYouTubeScript(topic: string): Promise<string | null> {
    try {
      const article = await this.getSummary(topic);
      if (!article) return null;

      const script = `
🎬 YOUTUBE SCRIPT: ${article.title}

[INTRO - 0:00]
Hey everyone! Welcome back to the channel. Today we're diving deep into ${article.title}.
If you're interested in ${topic.toLowerCase()}, make sure to stick around because we've got some fascinating facts!
Don't forget to like, subscribe, and hit that notification bell!

[MAIN CONTENT - 0:30]
So, what is ${article.title}?

${article.summary}

[KEY POINTS - 1:30]
Let me break this down into the key things you need to know:

${article.summary.split(/[.!?]+/).filter(s => s.trim()).slice(0, 5).map((s, i) => `${i + 1}. ${s.trim()}`).join('\n\n')}

[CONCLUSION - 3:30]
And there you have it! Everything you need to know about ${article.title}.

If you found this helpful, give it a thumbs up and let me know in the comments what you'd like to learn about next!

[OUTRO - 4:00]
Thanks for watching, and I'll see you in the next video!

---
📚 Source: ${article.url}
⏱️ Estimated Length: 4-5 minutes
🎯 Target Keywords: ${topic}, facts about ${topic}, ${topic} explained
      `.trim();

      return script;
    } catch (error) {
      console.error('Failed to generate script:', error);
      return null;
    }
  }

  /**
   * Generate TikTok/Short-form content ideas
   */
  async generateShortFormIdeas(topic: string): Promise<string[]> {
    try {
      const article = await this.getSummary(topic);
      if (!article) return [];

      const facts = article.summary.split(/[.!?]+/).filter(s => s.trim().length > 20);

      return facts.map((fact, i) =>
        `Did you know? ${fact.trim()}! 🤯\n#${topic.replace(/\s+/g, '')} #facts #education`
      );
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      return [];
    }
  }

  /**
   * Generate listicle content (perfect for Medium/blogs)
   */
  async generateListicle(topic: string, count: number = 10): Promise<{
    title: string;
    intro: string;
    items: string[];
    conclusion: string;
  } | null> {
    try {
      const article = await this.getSummary(topic);
      if (!article) return null;

      const facts = article.summary.split(/[.!?]+/)
        .filter(s => s.trim().length > 20)
        .slice(0, count);

      return {
        title: `${count} Amazing Facts About ${article.title}`,
        intro: `${article.title} is fascinating! Here are ${count} things you probably didn't know:`,
        items: facts.map((fact, i) => `${i + 1}. ${fact.trim()}`),
        conclusion: `These are just a few of the incredible facts about ${article.title}. Want to learn more? Check out the full article on Wikipedia!`
      };
    } catch (error) {
      console.error('Failed to generate listicle:', error);
      return null;
    }
  }

  /**
   * Get trending topics (from Wikipedia's featured/popular articles)
   */
  async getTrendingTopics(): Promise<WikiSearchResult[]> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        list: 'mostviewed',
        pvimdays: '7',
        format: 'json',
        origin: '*'
      });

      const response = await fetch(`${this.wikiApiUrl}?${params}`);
      const data = await response.json();

      if (data.query?.mostviewed) {
        return data.query.mostviewed.map((article: any) => ({
          title: article.title,
          snippet: '',
          pageId: article.pageid || 0,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, '_'))}`
        }));
      }

      // Fallback: get random articles if trending not available
      return this.getRandomArticles(10);
    } catch (error) {
      console.error('Failed to get trending topics:', error);
      return this.getRandomArticles(10);
    }
  }
}

export const wikipediaService = new WikipediaService();

/**
 * React Hook for Wikipedia content generation
 */
export function useWikipediaContent() {
  const [isLoading, setIsLoading] = React.useState(false);

  const generateContent = async (topic: string, type: 'blog' | 'youtube' | 'tiktok' | 'listicle') => {
    setIsLoading(true);
    try {
      switch (type) {
        case 'blog':
          return await wikipediaService.generateBlogIdea(topic);
        case 'youtube':
          return await wikipediaService.generateYouTubeScript(topic);
        case 'tiktok':
          return await wikipediaService.generateShortFormIdeas(topic);
        case 'listicle':
          return await wikipediaService.generateListicle(topic);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    search: wikipediaService.search.bind(wikipediaService),
    getSummary: wikipediaService.getSummary.bind(wikipediaService),
    getFullArticle: wikipediaService.getFullArticle.bind(wikipediaService),
    generateContent,
    getTrendingTopics: wikipediaService.getTrendingTopics.bind(wikipediaService),
    getRandomArticles: wikipediaService.getRandomArticles.bind(wikipediaService)
  };
}

// Import React
import React from 'react';
