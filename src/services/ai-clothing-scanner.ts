/**
 * AI Clothing Scanner Service
 * Automatically scans photos to detect and categorize clothing items
 * Uses AI vision to extract colors, style, and category information
 */

import { WardrobeClothingItem } from './avatar-wardrobe-integration';

// Clothing detection result from AI
export interface DetectedClothing {
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  colors: string[];
  style: string;
  description: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  tags: string[];
  suggestedName: string;
}

export interface ScanResult {
  success: boolean;
  detectedItems: DetectedClothing[];
  sourceImage: string;
  scanDate: string;
  error?: string;
}

// Color extraction from image
interface RGBColor {
  r: number;
  g: number;
  b: number;
}

class AIClothingScanner {
  private openAIKey: string | null = null;
  private geminiKey: string | null = null;

  // Set API keys
  setOpenAIKey(key: string) {
    this.openAIKey = key;
  }

  setGeminiKey(key: string) {
    this.geminiKey = key;
  }

  // Convert image file to base64
  private async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/... prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Extract dominant colors from image using canvas
  private async extractColors(imageUrl: string): Promise<string[]> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(['#4a4a4a']);
          return;
        }

        // Scale down for faster processing
        const scale = 50 / Math.max(img.width, img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = this.getDominantColors(imageData.data, 5);

        resolve(colors.map(c => this.rgbToHex(c)));
      };

      img.onerror = () => {
        resolve(['#4a4a4a']);
      };

      img.src = imageUrl;
    });
  }

  // Get dominant colors from image data
  private getDominantColors(data: Uint8ClampedArray, numColors: number): RGBColor[] {
    const colorCounts: Map<string, { color: RGBColor; count: number }> = new Map();

    // Sample pixels
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;

      if (colorCounts.has(key)) {
        colorCounts.get(key)!.count++;
      } else {
        colorCounts.set(key, { color: { r, g, b }, count: 1 });
      }
    }

    // Sort by frequency and return top colors
    const sorted = Array.from(colorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, numColors);

    return sorted.map(c => c.color);
  }

  // Convert RGB to hex
  private rgbToHex(color: RGBColor): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }

  // Local analysis without API (fallback)
  private async analyzeLocally(imageUrl: string): Promise<DetectedClothing[]> {
    const colors = await this.extractColors(imageUrl);

    // Basic heuristics based on colors
    const isDark = colors.some(c => {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return (r + g + b) / 3 < 100;
    });

    const isNeutral = colors.every(c => {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return (max - min) < 50;
    });

    // Generate a basic detection
    return [{
      category: 'top', // Default guess
      colors,
      style: isDark ? 'dark' : isNeutral ? 'neutral' : 'colorful',
      description: 'Detected clothing item',
      confidence: 0.6,
      tags: isDark ? ['dark', 'evening'] : ['casual', 'daytime'],
      suggestedName: `${isDark ? 'Dark' : 'Light'} ${isNeutral ? 'Neutral' : 'Colorful'} Top`
    }];
  }

  // Scan with OpenAI Vision API
  private async scanWithOpenAI(base64Image: string): Promise<DetectedClothing[]> {
    if (!this.openAIKey) {
      throw new Error('OpenAI API key not set');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openAIKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a fashion AI that analyzes clothing photos. For each visible clothing item, provide:
1. category: one of [top, bottom, dress, outerwear, shoes, accessory]
2. colors: array of hex color codes
3. style: descriptive style (e.g., casual, formal, gothic, bohemian)
4. description: brief description
5. tags: relevant fashion tags
6. suggestedName: a catchy name for this item

Return a JSON array of detected items. Be thorough and detect ALL visible clothing items.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and identify all clothing items. Return as JSON array.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    // Parse JSON from response
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const items = JSON.parse(jsonMatch[0]);
        return items.map((item: any) => ({
          category: item.category || 'top',
          colors: item.colors || ['#4a4a4a'],
          style: item.style || 'casual',
          description: item.description || 'Clothing item',
          confidence: 0.9,
          tags: item.tags || [],
          suggestedName: item.suggestedName || 'Fashion Item'
        }));
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    return [];
  }

  // Scan with Gemini Vision API
  private async scanWithGemini(base64Image: string): Promise<DetectedClothing[]> {
    if (!this.geminiKey) {
      throw new Error('Gemini API key not set');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this clothing photo and identify all visible clothing items. For each item provide:
- category (one of: top, bottom, dress, outerwear, shoes, accessory)
- colors (array of hex color codes like #FF0000)
- style (descriptive like casual, formal, gothic, bohemian, etc.)
- description (brief description of the item)
- tags (array of fashion tags)
- suggestedName (catchy name for this item)

Return ONLY a valid JSON array, no markdown or other text.`
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image
                  }
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const items = JSON.parse(jsonMatch[0]);
        return items.map((item: any) => ({
          category: item.category || 'top',
          colors: item.colors || ['#4a4a4a'],
          style: item.style || 'casual',
          description: item.description || 'Clothing item',
          confidence: 0.85,
          tags: item.tags || [],
          suggestedName: item.suggestedName || 'Fashion Item'
        }));
      }
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
    }

    return [];
  }

  // Main scan method
  async scanImage(imageFile: File | string): Promise<ScanResult> {
    try {
      let base64Image: string;
      let imageUrl: string;

      if (typeof imageFile === 'string') {
        // It's already a URL or base64
        imageUrl = imageFile;
        if (imageFile.startsWith('data:')) {
          base64Image = imageFile.split(',')[1];
        } else {
          // Fetch and convert
          const response = await fetch(imageFile);
          const blob = await response.blob();
          const file = new File([blob], 'image.jpg', { type: blob.type });
          base64Image = await this.imageToBase64(file);
        }
      } else {
        base64Image = await this.imageToBase64(imageFile);
        imageUrl = URL.createObjectURL(imageFile);
      }

      let detectedItems: DetectedClothing[] = [];

      // Try OpenAI first
      if (this.openAIKey) {
        try {
          detectedItems = await this.scanWithOpenAI(base64Image);
        } catch (e) {
          console.warn('OpenAI scan failed, trying Gemini:', e);
        }
      }

      // Fallback to Gemini
      if (detectedItems.length === 0 && this.geminiKey) {
        try {
          detectedItems = await this.scanWithGemini(base64Image);
        } catch (e) {
          console.warn('Gemini scan failed, using local analysis:', e);
        }
      }

      // Final fallback to local analysis
      if (detectedItems.length === 0) {
        detectedItems = await this.analyzeLocally(imageUrl);
      }

      return {
        success: true,
        detectedItems,
        sourceImage: imageUrl,
        scanDate: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        detectedItems: [],
        sourceImage: typeof imageFile === 'string' ? imageFile : '',
        scanDate: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Batch scan multiple images
  async scanMultipleImages(images: (File | string)[]): Promise<ScanResult[]> {
    const results: ScanResult[] = [];

    for (const image of images) {
      const result = await this.scanImage(image);
      results.push(result);
    }

    return results;
  }

  // Convert scan result to wardrobe item
  detectionToWardrobeItem(
    detection: DetectedClothing,
    sourceImage: string
  ): Omit<WardrobeClothingItem, 'id' | 'dateAdded'> {
    return {
      photoUrl: sourceImage,
      category: detection.category,
      colors: detection.colors,
      tags: detection.tags,
      favorite: false,
      name: detection.suggestedName,
      notes: detection.description,
      wearCount: 0
    };
  }

  // Auto-add scanned items to wardrobe
  async scanAndAddToWardrobe(
    images: (File | string)[],
    addToWardrobe: (item: Omit<WardrobeClothingItem, 'id' | 'dateAdded'>) => Promise<void>
  ): Promise<{
    added: number;
    failed: number;
    items: WardrobeClothingItem[];
  }> {
    let added = 0;
    let failed = 0;
    const items: WardrobeClothingItem[] = [];

    for (const image of images) {
      const result = await this.scanImage(image);

      if (result.success && result.detectedItems.length > 0) {
        for (const detection of result.detectedItems) {
          try {
            const wardrobeItem = this.detectionToWardrobeItem(detection, result.sourceImage);
            await addToWardrobe(wardrobeItem);
            items.push({
              ...wardrobeItem,
              id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              dateAdded: new Date().toISOString()
            });
            added++;
          } catch (e) {
            failed++;
          }
        }
      } else {
        failed++;
      }
    }

    return { added, failed, items };
  }
}

export const aiClothingScanner = new AIClothingScanner();
export default aiClothingScanner;
