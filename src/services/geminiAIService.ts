/**
 * 🤖 GEMINI AI SERVICE
 * Integrated AI content generation using Google's Gemini API
 */

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiAIService {
  private static instance: GeminiAIService;
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  private constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDhwNAO5BqqpsRqyGwma97PkkJ6bHmCWr0';
  }

  static getInstance(): GeminiAIService {
    if (!GeminiAIService.instance) {
      GeminiAIService.instance = new GeminiAIService();
    }
    return GeminiAIService.instance;
  }

  /**
   * Generate AI content with Gemini
   */
  async generate(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini AI error:', error);
      return '';
    }
  }

  /**
   * Generate book recommendations
   */
  async generateBooks(count: number = 50, preferences?: string): Promise<any[]> {
    const prompt = `Generate a JSON array of ${count} book recommendations${preferences ? ` based on these preferences: ${preferences}` : ''}.
Each book should have: title, author, genre (array), description (2 sentences), pages (number), year (number), rating (1-5).
Return ONLY the JSON array, no additional text.`;

    const response = await this.generate(prompt);
    try {
      const books = JSON.parse(response);
      return books.map((book: any, i: number) => ({
        id: `gemini-book-${Date.now()}-${i}`,
        ...book,
        status: 'want-to-read',
        pagesRead: 0,
        format: ['physical', 'ebook', 'audiobook'][Math.floor(Math.random() * 3)],
        notes: '',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Generate podcast recommendations
   */
  async generatePodcasts(count: number = 50, interests?: string): Promise<any[]> {
    const prompt = `Generate a JSON array of ${count} podcast recommendations${interests ? ` about: ${interests}` : ''}.
Each podcast should have: name, host, category, description (2 sentences), episodeCount (number), averageDuration (minutes), rating (1-5).
Return ONLY the JSON array, no additional text.`;

    const response = await this.generate(prompt);
    try {
      const podcasts = JSON.parse(response);
      return podcasts.map((podcast: any, i: number) => ({
        id: `gemini-podcast-${Date.now()}-${i}`,
        ...podcast,
        subscribed: false,
        platform: ['Spotify', 'Apple Podcasts', 'Google Podcasts'][Math.floor(Math.random() * 3)],
        frequency: 'weekly',
        notes: '',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Generate recipes
   */
  async generateRecipes(count: number = 50, dietaryPrefs?: string): Promise<any[]> {
    const prompt = `Generate a JSON array of ${count} diverse recipe ideas${dietaryPrefs ? ` that are ${dietaryPrefs}` : ''}.
Each recipe should have: name, cuisine, category, difficulty, prepTime (minutes), cookTime (minutes), servings, ingredients (array of 8-12 items), instructions (5-7 steps), description (1 sentence).
Return ONLY the JSON array, no additional text.`;

    const response = await this.generate(prompt);
    try {
      const recipes = JSON.parse(response);
      return recipes.map((recipe: any, i: number) => ({
        id: `gemini-recipe-${Date.now()}-${i}`,
        ...recipe,
        rating: Math.floor(Math.random() * 5) + 1,
        favorite: false,
        notes: '',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Generate creative project ideas
   */
  async generateCreativeIdeas(count: number = 100, category?: string): Promise<any[]> {
    const prompt = `Generate a JSON array of ${count} creative project ideas${category ? ` in the ${category} category` : ' across art, writing, music, crafts, coding, design, photography, and video'}.
Each idea should have: title, category, difficulty, description (2 sentences), materials (array of 5-8 items), timeRequired (string like "2-4 hours"), steps (array of 5-6 steps), tips (array of 3 tips), estimatedCost (string).
Return ONLY the JSON array, no additional text.`;

    const response = await this.generate(prompt);
    try {
      const ideas = JSON.parse(response);
      return ideas.map((idea: any, i: number) => ({
        id: `gemini-idea-${Date.now()}-${i}`,
        ...idea,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Generate avatar style suggestions
   */
  async generateAvatarStyles(personality?: string): Promise<any> {
    const prompt = `Based on ${personality || 'a creative personality'}, suggest 5 avatar style customizations.
Include: hairstyle, hair color, outfit style, color palette, accessories, mood/expression.
Return as JSON object with an array called "styles".
Return ONLY the JSON, no additional text.`;

    const response = await this.generate(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { styles: [] };
    }
  }

  /**
   * Generate theme color palettes
   */
  async generateThemePalettes(mood?: string): Promise<any> {
    const prompt = `Generate 10 color palettes for a ${mood || 'modern'} UI theme.
Each palette should have: name, primary, secondary, accent, background, text, description.
All colors should be in hex format.
Return as JSON object with an array called "palettes".
Return ONLY the JSON, no additional text.`;

    const response = await this.generate(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { palettes: [] };
    }
  }

  /**
   * Generate workout plans
   */
  async generateWorkoutPlans(fitnessLevel?: string): Promise<any[]> {
    const prompt = `Generate 30 workout plans for ${fitnessLevel || 'all'} fitness levels.
Each plan should have: name, duration (minutes), difficulty, equipment (array), exercises (array of 5-8 exercises with sets/reps), calories (number), description.
Return ONLY the JSON array, no additional text.`;

    const response = await this.generate(prompt);
    try {
      const plans = JSON.parse(response);
      return plans.map((plan: any, i: number) => ({
        id: `gemini-workout-${Date.now()}-${i}`,
        ...plan,
        completed: false,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Generate meal plans
   */
  async generateMealPlans(days: number = 7, diet?: string): Promise<any> {
    const prompt = `Generate a ${days}-day meal plan${diet ? ` for a ${diet} diet` : ''}.
Include breakfast, lunch, dinner, and 2 snacks per day.
Each meal should have: name, calories, protein, carbs, fats, prepTime, description.
Return as JSON object with a "days" array.
Return ONLY the JSON, no additional text.`;

    const response = await this.generate(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { days: [] };
    }
  }

  /**
   * Generate learning courses
   */
  async generateCourses(topic?: string): Promise<any[]> {
    const prompt = `Generate 25 online course ideas${topic ? ` about ${topic}` : ' across various topics'}.
Each course should have: title, instructor, platform, duration (hours), level, description (2 sentences), modules (array of 5-8 module names), price, rating.
Return ONLY the JSON array, no additional text.`;

    const response = await this.generate(prompt);
    try {
      const courses = JSON.parse(response);
      return courses.map((course: any, i: number) => ({
        id: `gemini-course-${Date.now()}-${i}`,
        ...course,
        progress: 0,
        enrolled: false,
      }));
    } catch {
      return [];
    }
  }
}

export const geminiAI = GeminiAIService.getInstance();
export default geminiAI;
