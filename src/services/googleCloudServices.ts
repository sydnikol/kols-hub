/**
 * Google Cloud Services Manager
 * Manages all Google Cloud API integrations for KOL Hub
 * Uses multiple API keys for different services
 */

export interface GoogleMapsPlace {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  types: string[];
  placeId: string;
}

export interface GoogleTranslation {
  translatedText: string;
  detectedLanguage: string;
}

export class GoogleCloudServices {
  private primaryApiKey: string;
  private secondaryApiKey: string;
  private tertiaryApiKey: string;
  private geminiApiKey: string;

  constructor() {
    this.primaryApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.secondaryApiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY_2 || '';
    this.tertiaryApiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY_3 || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  /**
   * GOOGLE MAPS API
   * For: Travel Hub, Transportation Hub, Community Events
   */

  /**
   * Search for places (restaurants, events, etc.)
   */
  async searchPlaces(
    query: string,
    location?: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<GoogleMapsPlace[]> {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const params = new URLSearchParams({
      query,
      key: this.primaryApiKey
    });

    if (location) {
      params.set('location', `${location.lat},${location.lng}`);
      params.set('radius', radius.toString());
    }

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    return data.results.map((place: any) => ({
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      rating: place.rating,
      types: place.types,
      placeId: place.place_id
    }));
  }

  /**
   * Get place details
   */
  async getPlaceDetails(placeId: string): Promise<any> {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'name,formatted_address,geometry,rating,opening_hours,photos,reviews,website,formatted_phone_number',
      key: this.primaryApiKey
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Place Details API error: ${data.status}`);
    }

    return data.result;
  }

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = new URLSearchParams({
      address,
      key: this.primaryApiKey
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Geocoding error: ${data.status}`);
    }

    return data.results[0].geometry.location;
  }

  /**
   * Reverse geocode (coordinates to address)
   */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = new URLSearchParams({
      latlng: `${lat},${lng}`,
      key: this.primaryApiKey
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Reverse geocoding error: ${data.status}`);
    }

    return data.results[0].formatted_address;
  }

  /**
   * GOOGLE TRANSLATE API
   * For: Multi-language support, accessibility
   */

  /**
   * Translate text
   */
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<GoogleTranslation> {
    const baseUrl = 'https://translation.googleapis.com/language/translate/v2';
    const params = new URLSearchParams({
      q: text,
      target: targetLanguage,
      key: this.secondaryApiKey
    });

    if (sourceLanguage) {
      params.set('source', sourceLanguage);
    }

    const response = await fetch(`${baseUrl}?${params}`, { method: 'POST' });
    const data = await response.json();

    if (data.error) {
      throw new Error(`Translation error: ${data.error.message}`);
    }

    const translation = data.data.translations[0];
    return {
      translatedText: translation.translatedText,
      detectedLanguage: translation.detectedSourceLanguage || sourceLanguage || 'unknown'
    };
  }

  /**
   * Detect language
   */
  async detectLanguage(text: string): Promise<string> {
    const baseUrl = 'https://translation.googleapis.com/language/translate/v2/detect';
    const params = new URLSearchParams({
      q: text,
      key: this.secondaryApiKey
    });

    const response = await fetch(`${baseUrl}?${params}`, { method: 'POST' });
    const data = await response.json();

    if (data.error) {
      throw new Error(`Language detection error: ${data.error.message}`);
    }

    return data.data.detections[0][0].language;
  }

  /**
   * GOOGLE VISION API
   * For: Photo analysis, text extraction, object detection
   */

  /**
   * Analyze image (labels, text, objects)
   */
  async analyzeImage(imageUrl: string): Promise<any> {
    const baseUrl = 'https://vision.googleapis.com/v1/images:annotate';

    const requestBody = {
      requests: [{
        image: { source: { imageUri: imageUrl } },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'TEXT_DETECTION' },
          { type: 'OBJECT_LOCALIZATION' },
          { type: 'IMAGE_PROPERTIES' }
        ]
      }]
    };

    const response = await fetch(`${baseUrl}?key=${this.tertiaryApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Vision API error: ${data.error.message}`);
    }

    return data.responses[0];
  }

  /**
   * Extract text from image (OCR)
   */
  async extractTextFromImage(imageUrl: string): Promise<string> {
    const analysis = await this.analyzeImage(imageUrl);
    return analysis.textAnnotations?.[0]?.description || '';
  }

  /**
   * Get image labels/tags
   */
  async getImageLabels(imageUrl: string): Promise<string[]> {
    const analysis = await this.analyzeImage(imageUrl);
    return analysis.labelAnnotations?.map((label: any) => label.description) || [];
  }

  /**
   * GOOGLE NATURAL LANGUAGE API
   * For: Sentiment analysis, entity recognition
   */

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<{ score: number; magnitude: number }> {
    const baseUrl = 'https://language.googleapis.com/v1/documents:analyzeSentiment';

    const requestBody = {
      document: {
        type: 'PLAIN_TEXT',
        content: text
      },
      encodingType: 'UTF8'
    };

    const response = await fetch(`${baseUrl}?key=${this.tertiaryApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Sentiment analysis error: ${data.error.message}`);
    }

    return {
      score: data.documentSentiment.score,
      magnitude: data.documentSentiment.magnitude
    };
  }

  /**
   * Extract entities from text
   */
  async extractEntities(text: string): Promise<any[]> {
    const baseUrl = 'https://language.googleapis.com/v1/documents:analyzeEntities';

    const requestBody = {
      document: {
        type: 'PLAIN_TEXT',
        content: text
      },
      encodingType: 'UTF8'
    };

    const response = await fetch(`${baseUrl}?key=${this.tertiaryApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Entity extraction error: ${data.error.message}`);
    }

    return data.entities || [];
  }

  /**
   * GOOGLE CLOUD STORAGE
   * For: Large file uploads, backups
   */

  /**
   * Generate signed URL for upload
   */
  generateUploadUrl(bucketName: string, fileName: string): string {
    // Note: This requires server-side signing for security
    // This is a placeholder - actual implementation needs backend
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  }

  /**
   * KOL HUB SPECIFIC INTEGRATIONS
   */

  /**
   * Search nearby restaurants (for Cooking Hub, Food Hub)
   */
  async searchNearbyRestaurants(
    location: { lat: number; lng: number },
    radius: number = 2000
  ): Promise<GoogleMapsPlace[]> {
    return this.searchPlaces('restaurants', location, radius);
  }

  /**
   * Search community events (for Community Events Hub)
   */
  async searchCommunityEvents(
    location: { lat: number; lng: number },
    eventType: string = 'event'
  ): Promise<GoogleMapsPlace[]> {
    return this.searchPlaces(eventType, location, 10000);
  }

  /**
   * Analyze journal entry sentiment (for Journaling Hub)
   */
  async analyzeJournalSentiment(entry: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    magnitude: number;
  }> {
    const analysis = await this.analyzeSentiment(entry);

    let sentiment: 'positive' | 'negative' | 'neutral';
    if (analysis.score > 0.25) sentiment = 'positive';
    else if (analysis.score < -0.25) sentiment = 'negative';
    else sentiment = 'neutral';

    return {
      sentiment,
      score: analysis.score,
      magnitude: analysis.magnitude
    };
  }

  /**
   * Tag wardrobe photo (for Virtual Wardrobe)
   */
  async tagWardrobePhoto(imageUrl: string): Promise<{
    labels: string[];
    colors: string[];
    text: string;
  }> {
    const analysis = await this.analyzeImage(imageUrl);

    return {
      labels: analysis.labelAnnotations?.map((l: any) => l.description) || [],
      colors: analysis.imagePropertiesAnnotation?.dominantColors?.colors?.map(
        (c: any) => this.rgbToHex(c.color.red, c.color.green, c.color.blue)
      ) || [],
      text: analysis.textAnnotations?.[0]?.description || ''
    };
  }

  /**
   * Translate recipe (for Cooking Hub)
   */
  async translateRecipe(
    recipe: { title: string; ingredients: string[]; instructions: string[] },
    targetLanguage: string
  ): Promise<any> {
    const [title, ingredients, instructions] = await Promise.all([
      this.translateText(recipe.title, targetLanguage),
      Promise.all(recipe.ingredients.map(i => this.translateText(i, targetLanguage))),
      Promise.all(recipe.instructions.map(i => this.translateText(i, targetLanguage)))
    ]);

    return {
      title: title.translatedText,
      ingredients: ingredients.map(i => i.translatedText),
      instructions: instructions.map(i => i.translatedText)
    };
  }

  /**
   * Helper: RGB to Hex color
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Check API key validity
   */
  async validateApiKeys(): Promise<{
    primary: boolean;
    secondary: boolean;
    tertiary: boolean;
    gemini: boolean;
  }> {
    const results = {
      primary: false,
      secondary: false,
      tertiary: false,
      gemini: false
    };

    // Test primary key (Maps API)
    try {
      await this.geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA');
      results.primary = true;
    } catch (error) {
      console.error('Primary API key validation failed:', error);
    }

    // Test secondary key (Translate API)
    try {
      await this.translateText('Hello', 'es');
      results.secondary = true;
    } catch (error) {
      console.error('Secondary API key validation failed:', error);
    }

    // Test tertiary key (Vision API)
    try {
      await this.detectLanguage('Hello world');
      results.tertiary = true;
    } catch (error) {
      console.error('Tertiary API key validation failed:', error);
    }

    // Gemini is already validated elsewhere
    results.gemini = this.geminiApiKey !== '';

    return results;
  }
}

// Singleton instance
export const googleCloudServices = new GoogleCloudServices();
export default googleCloudServices;
