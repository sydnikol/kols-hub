/**
 * Content Monetization Service
 * Scans Google Drive for writing and Google Photos for photography
 * Analyzes content for passive income opportunities
 */

import { googleSyncService } from './googleSyncService';
import { listDriveFiles, downloadFromDrive } from '../utils/googleDrive';
import { googlePhotosService } from './googlePhotosService';
import { db } from '../utils/database';

// ============ TYPES ============

export interface WritingContent {
  id: string;
  title: string;
  googleDriveId: string;
  type: 'blog' | 'story' | 'article' | 'essay' | 'poetry' | 'book';
  content?: string;
  wordCount: number;
  topics: string[];
  keywords: string[];
  quality: number; // 0-100
  marketability: number; // 0-100
  readingTime: number; // minutes
  platforms: MonetizationPlatform[];
  earnings: number;
  submissions: Submission[];
  createdAt: Date;
  updatedAt: Date;
  fileFormat: 'docx' | 'txt' | 'md' | 'pdf';
  status: 'draft' | 'ready' | 'submitted' | 'published' | 'earning';
}

export interface PhotoContent {
  id: string;
  title: string;
  googlePhotoId: string;
  photoUrl: string;
  category: string; // nature, portrait, abstract, urban, food, etc.
  subjects: string[];
  tags: string[];
  quality: number; // 0-100 (technical quality)
  marketability: number; // 0-100 (commercial appeal)
  platforms: PhotoPlatform[];
  earnings: number;
  downloads: number;
  views: number;
  submissions: PhotoSubmission[];
  metadata: PhotoMetadata;
  createdAt: Date;
  status: 'processing' | 'ready' | 'submitted' | 'approved' | 'earning';
}

export interface MonetizationPlatform {
  name: 'medium' | 'substack' | 'kindle' | 'patreon' | 'ghost' | 'hashnode' | 'devto';
  url?: string;
  earnings: number;
  views?: number;
  reads?: number;
  projectedEarnings: number;
  status: 'not_submitted' | 'pending' | 'published' | 'rejected';
  submittedAt?: Date;
  publishedAt?: Date;
}

export interface PhotoPlatform {
  name: 'shutterstock' | 'adobe_stock' | 'istock' | 'getty' | 'unsplash_plus' | 'dreamstime' | '500px';
  earnings: number;
  downloads: number;
  views: number;
  projectedEarnings: number;
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  uploadedAt?: Date;
  approvedAt?: Date;
  assetId?: string;
}

export interface Submission {
  platformName: string;
  submittedAt: Date;
  status: 'pending' | 'published' | 'rejected';
  url?: string;
  earnings?: number;
  views?: number;
}

export interface PhotoSubmission {
  platformName: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  assetId?: string;
  earnings?: number;
  downloads?: number;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  aspectRatio: string;
  colorPalette: string[];
  dominantColor: string;
  hasModel?: boolean;
  hasProperty?: boolean;
  orientation: 'landscape' | 'portrait' | 'square';
}

export interface ContentPortfolio {
  totalWriting: number;
  totalPhotos: number;
  totalEarnings: number;
  monthlyEarnings: number;
  writing: {
    count: number;
    earnings: number;
    avgQuality: number;
    topPlatform: string;
  };
  photography: {
    count: number;
    earnings: number;
    avgQuality: number;
    topPlatform: string;
  };
}

export interface AIAnalysis {
  contentType: 'writing' | 'photo';
  qualityScore: number;
  marketabilityScore: number;
  recommendations: string[];
  suggestedPlatforms: string[];
  pricingRecommendation?: {
    min: number;
    max: number;
    recommended: number;
  };
  seoKeywords?: string[];
  titleSuggestions?: string[];
  descriptionSuggestion?: string;
}

// ============ SERVICE CLASS ============

class ContentMonetizationService {
  private readonly WRITING_EXTENSIONS = ['.docx', '.txt', '.md', '.pdf'];

  // ============ INITIALIZATION ============

  async initialize(): Promise<void> {
    await googleSyncService.initialize();
  }

  async isConnected(): Promise<boolean> {
    return await googleSyncService.isAuthenticated();
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.initialize();
      const result = await googleSyncService.authenticate();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  // ============ WRITING INTEGRATION ============

  /**
   * Scan Google Drive for writing content
   */
  async scanWritingContent(): Promise<WritingContent[]> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Drive');
      }

      const allFiles: any[] = [];

      // Scan for each writing format
      for (const ext of this.WRITING_EXTENSIONS) {
        const query = `name contains '${ext}' and mimeType != 'application/vnd.google-apps.folder'`;
        const files = await listDriveFiles({ query, maxResults: 100 });
        allFiles.push(...files);
      }

      const writingContent: WritingContent[] = [];

      for (const file of allFiles) {
        const content = await this.processWritingFile(file);
        if (content) {
          writingContent.push(content);
          // Save to database
          await this.saveWritingContent(content);
        }
      }

      return writingContent;
    } catch (error) {
      console.error('Failed to scan writing content:', error);
      throw error;
    }
  }

  /**
   * Process a writing file from Google Drive
   */
  private async processWritingFile(file: any): Promise<WritingContent | null> {
    try {
      const fileExtension = this.getFileExtension(file.name);
      if (!this.WRITING_EXTENSIONS.includes(fileExtension)) {
        return null;
      }

      // Download and analyze content
      let textContent = '';
      try {
        const blob = await downloadFromDrive(file.id);
        textContent = await this.extractTextFromBlob(blob, fileExtension);
      } catch (error) {
        console.warn(`Could not download file ${file.name}:`, error);
        textContent = '';
      }

      const wordCount = this.countWords(textContent);
      const analysis = await this.analyzeWritingContent(textContent, file.name);

      const content: WritingContent = {
        id: `writing_${file.id}`,
        title: file.name.replace(fileExtension, ''),
        googleDriveId: file.id,
        type: this.detectWritingType(file.name, textContent),
        content: textContent.substring(0, 5000), // Store first 5000 chars
        wordCount,
        topics: analysis.topics || [],
        keywords: analysis.keywords || [],
        quality: analysis.qualityScore,
        marketability: analysis.marketabilityScore,
        readingTime: Math.ceil(wordCount / 200), // ~200 words per minute
        platforms: this.suggestWritingPlatforms(analysis),
        earnings: 0,
        submissions: [],
        createdAt: file.createdTime ? new Date(file.createdTime) : new Date(),
        updatedAt: file.modifiedTime ? new Date(file.modifiedTime) : new Date(),
        fileFormat: fileExtension.replace('.', '') as any,
        status: wordCount > 300 ? 'ready' : 'draft',
      };

      return content;
    } catch (error) {
      console.error('Error processing writing file:', error);
      return null;
    }
  }

  /**
   * Analyze writing content with AI
   */
  private async analyzeWritingContent(text: string, filename: string): Promise<{
    qualityScore: number;
    marketabilityScore: number;
    topics: string[];
    keywords: string[];
  }> {
    // Basic analysis (in production, use actual AI/NLP)
    const wordCount = this.countWords(text);
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / Math.max(sentences, 1);

    // Quality based on structure
    const qualityScore = Math.min(100, Math.max(0,
      (wordCount > 500 ? 30 : wordCount / 500 * 30) +
      (avgWordsPerSentence > 10 && avgWordsPerSentence < 25 ? 30 : 10) +
      (text.includes('\n\n') ? 20 : 5) + // Has paragraphs
      (text.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) ? 20 : 0) // Has proper nouns
    ));

    // Extract topics and keywords
    const topics = this.extractTopics(text);
    const keywords = this.extractKeywords(text);

    // Marketability based on topics and length
    const marketabilityScore = Math.min(100, Math.max(0,
      (wordCount >= 800 ? 40 : wordCount / 800 * 40) +
      (topics.length > 0 ? 30 : 0) +
      (keywords.length >= 5 ? 30 : keywords.length * 6)
    ));

    return {
      qualityScore: Math.round(qualityScore),
      marketabilityScore: Math.round(marketabilityScore),
      topics,
      keywords,
    };
  }

  /**
   * Suggest monetization platforms based on content analysis
   * Updated to reflect $1000/day ($30,000/month) passive income goals
   */
  private suggestWritingPlatforms(analysis: any): MonetizationPlatform[] {
    const platforms: MonetizationPlatform[] = [];

    // Medium - good for articles and essays
    // Top writers earn $5,000-$10,000/month per article
    platforms.push({
      name: 'medium',
      earnings: 0,
      projectedEarnings: analysis.marketabilityScore * 50, // $500-$5,000/month per article
      status: 'not_submitted'
    });

    // Substack - good for newsletters and series
    // Successful writers earn $5,000-$50,000/month with paid subscribers
    if (analysis.qualityScore > 60) {
      platforms.push({
        name: 'substack',
        earnings: 0,
        projectedEarnings: analysis.marketabilityScore * 150, // $1,500-$15,000/month
        status: 'not_submitted'
      });
    }

    // Kindle - for longer content
    // Best-selling authors earn $3,000-$20,000/month per book
    if (analysis.marketabilityScore > 50) {
      platforms.push({
        name: 'kindle',
        earnings: 0,
        projectedEarnings: analysis.marketabilityScore * 200, // $2,000-$20,000/month
        status: 'not_submitted'
      });
    }

    return platforms;
  }

  // ============ PHOTOGRAPHY INTEGRATION ============

  /**
   * Scan Google Photos for photography content
   */
  async scanPhotographyContent(): Promise<PhotoContent[]> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Photos');
      }

      // Get photos from Google Photos
      const mediaItems = await googleSyncService.syncPhotos({
        maxResults: 100,
        filters: {
          contentCategories: ['LANDSCAPES', 'CITYSCAPES', 'LANDMARKS', 'ANIMALS', 'FOOD', 'PEOPLE'],
        }
      });

      const photoContent: PhotoContent[] = [];

      for (const item of mediaItems) {
        const photo = await this.processPhotoFile(item);
        if (photo) {
          photoContent.push(photo);
          await this.savePhotoContent(photo);
        }
      }

      return photoContent;
    } catch (error) {
      console.error('Failed to scan photography content:', error);
      throw error;
    }
  }

  /**
   * Process a photo from Google Photos
   */
  private async processPhotoFile(photoItem: any): Promise<PhotoContent | null> {
    try {
      const metadata = photoItem.mediaMetadata || {};
      const width = parseInt(metadata.width) || 0;
      const height = parseInt(metadata.height) || 0;

      // Skip low-resolution images
      if (width < 1920 || height < 1080) {
        return null;
      }

      const analysis = await this.analyzePhotoContent(photoItem);

      const photo: PhotoContent = {
        id: `photo_${photoItem.id}`,
        title: photoItem.filename?.replace(/\.[^/.]+$/, '') || 'Untitled',
        googlePhotoId: photoItem.id,
        photoUrl: photoItem.baseUrl,
        category: analysis.category,
        subjects: analysis.subjects,
        tags: analysis.tags,
        quality: analysis.qualityScore,
        marketability: analysis.marketabilityScore,
        platforms: this.suggestPhotoPlatforms(analysis),
        earnings: 0,
        downloads: 0,
        views: 0,
        submissions: [],
        metadata: {
          width,
          height,
          aspectRatio: this.calculateAspectRatio(width, height),
          colorPalette: [],
          dominantColor: '#000000',
          orientation: width > height ? 'landscape' : height > width ? 'portrait' : 'square',
        },
        createdAt: photoItem.mediaMetadata?.creationTime
          ? new Date(photoItem.mediaMetadata.creationTime)
          : new Date(),
        status: width >= 3000 && height >= 2000 ? 'ready' : 'processing',
      };

      return photo;
    } catch (error) {
      console.error('Error processing photo:', error);
      return null;
    }
  }

  /**
   * Analyze photo content for marketability
   */
  private async analyzePhotoContent(photoItem: any): Promise<{
    category: string;
    subjects: string[];
    tags: string[];
    qualityScore: number;
    marketabilityScore: number;
  }> {
    const metadata = photoItem.mediaMetadata || {};
    const width = parseInt(metadata.width) || 0;
    const height = parseInt(metadata.height) || 0;

    // Quality based on resolution
    const resolution = width * height;
    const qualityScore = Math.min(100, Math.max(0,
      (resolution >= 6000000 ? 50 : resolution / 6000000 * 50) + // 6MP+
      (width >= 3000 && height >= 2000 ? 30 : 0) + // High res
      (photoItem.description ? 20 : 0) // Has description
    ));

    // Marketability
    const marketabilityScore = Math.min(100, qualityScore +
      (metadata.photo?.exposureTime ? 10 : 0) + // Proper EXIF
      (metadata.photo?.focalLength ? 10 : 0)
    );

    // Extract category and tags from description or filename
    const description = (photoItem.description || photoItem.filename || '').toLowerCase();
    const category = this.detectPhotoCategory(description);
    const subjects = this.extractPhotoSubjects(description);
    const tags = this.generatePhotoTags(category, subjects);

    return {
      category,
      subjects,
      tags,
      qualityScore: Math.round(qualityScore),
      marketabilityScore: Math.round(marketabilityScore),
    };
  }

  /**
   * Suggest stock photo platforms
   * Updated to reflect $1000/day ($30,000/month) passive income goals
   */
  private suggestPhotoPlatforms(analysis: any): PhotoPlatform[] {
    const platforms: PhotoPlatform[] = [];

    // Shutterstock - general stock photos
    // Top contributors earn $2,000-$8,000/month
    platforms.push({
      name: 'shutterstock',
      earnings: 0,
      downloads: 0,
      views: 0,
      projectedEarnings: analysis.marketabilityScore * 25, // $250-$2,500/month per photo
      status: 'not_submitted'
    });

    // Adobe Stock - high quality
    // Premium contributors earn $3,000-$10,000/month
    if (analysis.qualityScore > 70) {
      platforms.push({
        name: 'adobe_stock',
        earnings: 0,
        downloads: 0,
        views: 0,
        projectedEarnings: analysis.marketabilityScore * 33, // $330-$3,300/month per photo
        status: 'not_submitted'
      });
    }

    // Getty Images - premium quality
    // Elite photographers earn $5,000-$20,000/month
    if (analysis.qualityScore > 85) {
      platforms.push({
        name: 'getty',
        earnings: 0,
        downloads: 0,
        views: 0,
        projectedEarnings: analysis.marketabilityScore * 200, // $2,000-$20,000/month per photo
        status: 'not_submitted'
      });
    }

    return platforms;
  }

  // ============ PORTFOLIO & ANALYTICS ============

  /**
   * Get content portfolio overview
   */
  async getPortfolio(): Promise<ContentPortfolio> {
    const writing = await this.getAllWritingContent();
    const photos = await this.getAllPhotoContent();

    const writingEarnings = writing.reduce((sum, w) => sum + w.earnings, 0);
    const photoEarnings = photos.reduce((sum, p) => sum + p.earnings, 0);

    const writingAvgQuality = writing.length > 0
      ? writing.reduce((sum, w) => sum + w.quality, 0) / writing.length
      : 0;

    const photoAvgQuality = photos.length > 0
      ? photos.reduce((sum, p) => sum + p.quality, 0) / photos.length
      : 0;

    return {
      totalWriting: writing.length,
      totalPhotos: photos.length,
      totalEarnings: writingEarnings + photoEarnings,
      monthlyEarnings: this.calculateMonthlyEarnings(writing, photos),
      writing: {
        count: writing.length,
        earnings: writingEarnings,
        avgQuality: Math.round(writingAvgQuality),
        topPlatform: this.getTopPlatform(writing.flatMap(w => w.platforms)),
      },
      photography: {
        count: photos.length,
        earnings: photoEarnings,
        avgQuality: Math.round(photoAvgQuality),
        topPlatform: this.getTopPhotoPlatform(photos.flatMap(p => p.platforms)),
      },
    };
  }

  /**
   * Generate upload metadata for photos
   */
  generatePhotoUploadMetadata(photo: PhotoContent): {
    title: string;
    description: string;
    keywords: string[];
  } {
    const title = this.optimizePhotoTitle(photo.title, photo.category);
    const description = this.generatePhotoDescription(photo);
    const keywords = photo.tags.slice(0, 50); // Most platforms limit keywords

    return { title, description, keywords };
  }

  /**
   * Track earnings for content
   */
  async trackEarnings(contentId: string, platformName: string, amount: number): Promise<void> {
    const isWriting = contentId.startsWith('writing_');

    if (isWriting) {
      const content = await this.getWritingContent(contentId);
      if (content) {
        content.earnings += amount;
        const platform = content.platforms.find(p => p.name === platformName);
        if (platform) {
          platform.earnings += amount;
        }
        await this.saveWritingContent(content);

        // Log to income activities
        await this.logIncomeActivity(contentId, platformName, amount, 'writing');
      }
    } else {
      const content = await this.getPhotoContent(contentId);
      if (content) {
        content.earnings += amount;
        const platform = content.platforms.find(p => p.name === platformName);
        if (platform) {
          platform.earnings += amount;
          platform.downloads += 1;
        }
        await this.savePhotoContent(content);

        // Log to income activities
        await this.logIncomeActivity(contentId, platformName, amount, 'photography');
      }
    }
  }

  // ============ HELPER METHODS ============

  private getFileExtension(filename: string): string {
    const match = filename.match(/\.[^.]+$/);
    return match ? match[0].toLowerCase() : '';
  }

  private async extractTextFromBlob(blob: Blob, extension: string): Promise<string> {
    if (extension === '.txt' || extension === '.md') {
      return await blob.text();
    }
    // For .docx and .pdf, you'd need additional libraries
    // For now, return empty string
    return '';
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private detectWritingType(filename: string, content: string): WritingContent['type'] {
    const lower = filename.toLowerCase() + ' ' + content.toLowerCase();

    if (lower.includes('blog') || lower.includes('post')) return 'blog';
    if (lower.includes('story') || lower.includes('fiction')) return 'story';
    if (lower.includes('article')) return 'article';
    if (lower.includes('essay')) return 'essay';
    if (lower.includes('poem') || lower.includes('poetry')) return 'poetry';
    if (lower.includes('book') || lower.includes('chapter')) return 'book';

    // Default based on length
    const wordCount = this.countWords(content);
    if (wordCount > 10000) return 'book';
    if (wordCount > 2000) return 'article';
    return 'blog';
  }

  private extractTopics(text: string): string[] {
    // Simple topic extraction (in production, use NLP)
    const commonTopics = [
      'technology', 'health', 'business', 'lifestyle', 'travel',
      'food', 'fashion', 'education', 'finance', 'relationships',
      'productivity', 'mindfulness', 'fitness', 'career', 'creativity'
    ];

    const foundTopics = commonTopics.filter(topic =>
      text.toLowerCase().includes(topic)
    );

    return foundTopics.slice(0, 5);
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 4);

    // Count frequency
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Get top keywords
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private detectPhotoCategory(description: string): string {
    const categories = {
      nature: ['nature', 'landscape', 'mountain', 'forest', 'tree', 'ocean', 'sunset'],
      portrait: ['portrait', 'person', 'people', 'face', 'model'],
      urban: ['city', 'urban', 'street', 'building', 'architecture'],
      food: ['food', 'meal', 'dish', 'cuisine', 'restaurant'],
      abstract: ['abstract', 'pattern', 'texture'],
      animals: ['animal', 'pet', 'dog', 'cat', 'bird', 'wildlife'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  private extractPhotoSubjects(description: string): string[] {
    const subjects: string[] = [];
    const keywords = description.split(/\s+/);

    keywords.forEach(keyword => {
      if (keyword.length > 3) {
        subjects.push(keyword);
      }
    });

    return subjects.slice(0, 10);
  }

  private generatePhotoTags(category: string, subjects: string[]): string[] {
    const baseTags = [category, ...subjects];
    const additionalTags = [
      'stock photo', 'commercial use', 'high quality',
      'professional', category + ' photography'
    ];

    return [...new Set([...baseTags, ...additionalTags])].slice(0, 30);
  }

  private calculateAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }

  private optimizePhotoTitle(title: string, category: string): string {
    // Add category if not in title
    if (!title.toLowerCase().includes(category)) {
      return `${title} - ${category.charAt(0).toUpperCase() + category.slice(1)} Photography`;
    }
    return title;
  }

  private generatePhotoDescription(photo: PhotoContent): string {
    return `High-quality ${photo.category} photography. ${photo.subjects.join(', ')}. Perfect for commercial and editorial use. ${photo.metadata.orientation} orientation, ${photo.metadata.width}x${photo.metadata.height} pixels.`;
  }

  private calculateMonthlyEarnings(writing: WritingContent[], photos: PhotoContent[]): number {
    // Calculate average earnings over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // This is simplified - in production, track actual daily earnings
    const totalEarnings =
      writing.reduce((sum, w) => sum + w.earnings, 0) +
      photos.reduce((sum, p) => sum + p.earnings, 0);

    return totalEarnings; // Return total for now
  }

  private getTopPlatform(platforms: MonetizationPlatform[]): string {
    if (platforms.length === 0) return 'none';

    const earnings = platforms.reduce((acc, p) => {
      acc[p.name] = (acc[p.name] || 0) + p.earnings;
      return acc;
    }, {} as Record<string, number>);

    const top = Object.entries(earnings).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : 'none';
  }

  private getTopPhotoPlatform(platforms: PhotoPlatform[]): string {
    if (platforms.length === 0) return 'none';

    const earnings = platforms.reduce((acc, p) => {
      acc[p.name] = (acc[p.name] || 0) + p.earnings;
      return acc;
    }, {} as Record<string, number>);

    const top = Object.entries(earnings).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : 'none';
  }

  private async logIncomeActivity(
    contentId: string,
    platform: string,
    amount: number,
    type: 'writing' | 'photography'
  ): Promise<void> {
    try {
      await db.incomeActivities.add({
        streamId: 0, // Will be linked to income stream
        action: `${type} sale on ${platform}`,
        revenue: amount,
        timestamp: new Date(),
        details: { contentId, platform, type }
      });
    } catch (error) {
      console.error('Failed to log income activity:', error);
    }
  }

  // ============ DATABASE OPERATIONS ============

  private async saveWritingContent(content: WritingContent): Promise<void> {
    // Save to localStorage for now (in production, use IndexedDB)
    const existing = this.getStoredWriting();
    const index = existing.findIndex(w => w.id === content.id);

    if (index >= 0) {
      existing[index] = content;
    } else {
      existing.push(content);
    }

    localStorage.setItem('content_writing', JSON.stringify(existing));
  }

  private async savePhotoContent(photo: PhotoContent): Promise<void> {
    const existing = this.getStoredPhotos();
    const index = existing.findIndex(p => p.id === photo.id);

    if (index >= 0) {
      existing[index] = photo;
    } else {
      existing.push(photo);
    }

    localStorage.setItem('content_photos', JSON.stringify(existing));
  }

  async getAllWritingContent(): Promise<WritingContent[]> {
    return this.getStoredWriting();
  }

  async getAllPhotoContent(): Promise<PhotoContent[]> {
    return this.getStoredPhotos();
  }

  async getWritingContent(id: string): Promise<WritingContent | null> {
    const all = this.getStoredWriting();
    return all.find(w => w.id === id) || null;
  }

  async getPhotoContent(id: string): Promise<PhotoContent | null> {
    const all = this.getStoredPhotos();
    return all.find(p => p.id === id) || null;
  }

  private getStoredWriting(): WritingContent[] {
    try {
      const stored = localStorage.getItem('content_writing');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private getStoredPhotos(): PhotoContent[] {
    try {
      const stored = localStorage.getItem('content_photos');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async deleteWritingContent(id: string): Promise<void> {
    const all = this.getStoredWriting();
    const filtered = all.filter(w => w.id !== id);
    localStorage.setItem('content_writing', JSON.stringify(filtered));
  }

  async deletePhotoContent(id: string): Promise<void> {
    const all = this.getStoredPhotos();
    const filtered = all.filter(p => p.id !== id);
    localStorage.setItem('content_photos', JSON.stringify(filtered));
  }
}

export const contentMonetizationService = new ContentMonetizationService();
