/**
 * 🤖 AI LIBRARY CONTENT GENERATOR
 * Dynamically generates comprehensive content for all KOL Hub libraries
 */

export class LibraryContentGenerator {
  private static instance: LibraryContentGenerator;

  static getInstance(): LibraryContentGenerator {
    if (!LibraryContentGenerator.instance) {
      LibraryContentGenerator.instance = new LibraryContentGenerator();
    }
    return LibraryContentGenerator.instance;
  }

  /**
   * Generate 100+ books for Reading Library
   */
  generateBooks(count: number = 100) {
    const genres = ['Fiction', 'Mystery', 'Sci-Fi', 'Fantasy', 'Romance', 'Thriller', 'Historical', 'Biography', 'Self-Help', 'Psychology'];
    const formats = ['physical', 'ebook', 'audiobook'];
    const books = [];

    for (let i = 0; i < count; i++) {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      books.push({
        id: `book-${Date.now()}-${i}`,
        title: this.generateBookTitle(genre),
        author: this.generateAuthorName(),
        genre: [genre, genres[Math.floor(Math.random() * genres.length)]],
        status: ['want-to-read', 'reading', 'completed'][Math.floor(Math.random() * 3)],
        rating: Math.floor(Math.random() * 5) + 1,
        pages: Math.floor(Math.random() * 400) + 100,
        pagesRead: Math.floor(Math.random() * 300),
        format: formats[Math.floor(Math.random() * formats.length)] as any,
        notes: '',
      });
    }

    return books;
  }

  /**
   * Generate 200+ podcasts
   */
  generatePodcasts(count: number = 200) {
    const categories = ['true-crime', 'comedy', 'news', 'education', 'business', 'tech', 'sports', 'entertainment'];
    const platforms = ['Spotify', 'Apple Podcasts', 'Google Podcasts', 'Overcast', 'Pocket Casts'];
    const frequencies = ['daily', 'weekly', 'biweekly', 'monthly', 'irregular'];
    const podcasts = [];

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      podcasts.push({
        id: `podcast-${Date.now()}-${i}`,
        name: this.generatePodcastName(category),
        host: this.generateHostName(),
        category,
        subscribed: Math.random() > 0.5,
        rating: Math.floor(Math.random() * 5) + 1,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        frequency: frequencies[Math.floor(Math.random() * frequencies.length)] as any,
        notes: '',
      });
    }

    return podcasts;
  }

  /**
   * Generate 150+ recipes
   */
  generateRecipes(count: number = 150) {
    const cuisines = ['italian', 'mexican', 'chinese', 'indian', 'american', 'french', 'japanese', 'thai', 'mediterranean'];
    const categories = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer', 'beverage'];
    const difficulties = ['easy', 'medium', 'hard', 'expert'];
    const recipes = [];

    for (let i = 0; i < count; i++) {
      const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      recipes.push({
        id: `recipe-${Date.now()}-${i}`,
        name: this.generateRecipeName(cuisine, category),
        cuisine: cuisine as any,
        category: category as any,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)] as any,
        prepTime: Math.floor(Math.random() * 30) + 10,
        cookTime: Math.floor(Math.random() * 60) + 15,
        servings: Math.floor(Math.random() * 6) + 2,
        rating: Math.floor(Math.random() * 5) + 1,
        ingredients: this.generateIngredients(cuisine),
        instructions: this.generateCookingInstructions(category),
        notes: '',
        favorite: Math.random() > 0.8,
      });
    }

    return recipes;
  }

  /**
   * Generate 300+ movies/music/TV shows for Media Library
   */
  generateMediaItems(count: number = 300) {
    const types = ['music', 'movie', 'tv'];
    const musicGenres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Country', 'Indie', 'Metal'];
    const movieGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy'];
    const tvGenres = ['Drama', 'Comedy', 'Sci-Fi', 'Fantasy', 'Documentary', 'Reality', 'Crime', 'Thriller', 'Animation', 'Horror'];
    const statuses = ['want-to-watch', 'watching', 'completed', 'dropped'];
    const items = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      let genre = '';

      if (type === 'music') genre = musicGenres[Math.floor(Math.random() * musicGenres.length)];
      else if (type === 'movie') genre = movieGenres[Math.floor(Math.random() * movieGenres.length)];
      else genre = tvGenres[Math.floor(Math.random() * tvGenres.length)];

      items.push({
        id: `media-${Date.now()}-${i}`,
        title: this.generateMediaTitle(type, genre),
        type: type as any,
        genre,
        artist: type === 'music' ? this.generateArtistName() : undefined,
        year: 2020 + Math.floor(Math.random() * 5),
        rating: Math.floor(Math.random() * 5) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)] as any,
        notes: '',
        tags: this.generateMediaTags(type),
        dateAdded: new Date().toISOString().split('T')[0],
        createdAt: Date.now() - Math.floor(Math.random() * 10000000),
      });
    }

    return items;
  }

  /**
   * Generate 500+ creative ideas
   */
  generateCreativeIdeas(count: number = 500) {
    const categories = ['art', 'writing', 'music', 'crafts', 'coding', 'design', 'photography', 'video'];
    const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
    const ideas = [];

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      ideas.push({
        id: `idea-${Date.now()}-${i}`,
        title: this.generateIdeaTitle(category),
        category,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)] as any,
        description: this.generateIdeaDescription(category),
        materials: this.generateMaterials(category),
        timeRequired: `${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 4) + 3} hours`,
        steps: this.generateSteps(category),
        tips: this.generateTips(),
        estimatedCost: `$${Math.floor(Math.random() * 100) + 10}`,
      });
    }

    return ideas;
  }

  // Helper generators
  private generateBookTitle(genre: string): string {
    const templates = [
      `The ${this.randomWord()} of ${this.randomWord()}`,
      `${this.randomWord()}: A ${genre} Story`,
      `The Last ${this.randomWord()}`,
      `${this.randomWord()} and the ${this.randomWord()}`,
      `Beyond the ${this.randomWord()}`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateAuthorName(): string {
    const firstNames = ['Emma', 'James', 'Olivia', 'Noah', 'Ava', 'Liam', 'Sophia', 'Mason', 'Isabella', 'William'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private generatePodcastName(category: string): string {
    const templates = [
      `The ${category.charAt(0).toUpperCase() + category.slice(1)} Show`,
      `${this.randomWord()} & ${this.randomWord()}`,
      `${this.randomWord()} Podcast`,
      `The ${this.randomWord()} Chronicles`,
      `${this.randomWord()} Talks`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateHostName(): string {
    return this.generateAuthorName();
  }

  private generateRecipeName(cuisine: string, category: string): string {
    const adjectives = ['Delicious', 'Authentic', 'Homemade', 'Quick', 'Easy', 'Classic', 'Traditional', 'Modern', 'Fusion'];
    const mains = {
      italian: ['Pasta', 'Pizza', 'Risotto', 'Lasagna', 'Tiramisu'],
      mexican: ['Tacos', 'Burritos', 'Enchiladas', 'Quesadillas', 'Tamales'],
      chinese: ['Fried Rice', 'Noodles', 'Dumplings', 'Spring Rolls', 'Sweet & Sour'],
      indian: ['Curry', 'Biryani', 'Samosas', 'Naan', 'Tandoori'],
      american: ['Burger', 'Hot Dog', 'Mac & Cheese', 'BBQ', 'Apple Pie'],
      french: ['Croissant', 'Quiche', 'Ratatouille', 'Crepes', 'Souffle'],
      japanese: ['Sushi', 'Ramen', 'Tempura', 'Teriyaki', 'Miso Soup'],
      thai: ['Pad Thai', 'Green Curry', 'Tom Yum', 'Satay', 'Mango Sticky Rice'],
      mediterranean: ['Hummus', 'Falafel', 'Tzatziki', 'Kabobs', 'Baklava'],
    };
    const dishes = mains[cuisine as keyof typeof mains] || ['Dish', 'Meal', 'Recipe'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)} ${dishes[Math.floor(Math.random() * dishes.length)]}`;
  }

  private generateIngredients(cuisine: string): string[] {
    const common = ['Salt', 'Pepper', 'Olive Oil', 'Garlic', 'Onion'];
    const specific = {
      italian: ['Tomatoes', 'Basil', 'Mozzarella', 'Parmesan', 'Pasta'],
      mexican: ['Tortillas', 'Beans', 'Cheese', 'Cilantro', 'Lime'],
      chinese: ['Soy Sauce', 'Rice', 'Ginger', 'Sesame Oil', 'Scallions'],
      indian: ['Curry Powder', 'Rice', 'Yogurt', 'Cumin', 'Turmeric'],
      american: ['Beef', 'Cheese', 'Lettuce', 'Tomato', 'Bread'],
      french: ['Butter', 'Cream', 'Wine', 'Herbs', 'Cheese'],
      japanese: ['Rice', 'Soy Sauce', 'Mirin', 'Nori', 'Wasabi'],
      thai: ['Coconut Milk', 'Lemongrass', 'Fish Sauce', 'Chilies', 'Lime'],
      mediterranean: ['Olive Oil', 'Lemon', 'Chickpeas', 'Tahini', 'Yogurt'],
    };
    const ingredients = [...common, ...(specific[cuisine as keyof typeof specific] || [])];
    return ingredients.slice(0, 8 + Math.floor(Math.random() * 5));
  }

  private generateCookingInstructions(category: string): string {
    return `1. Prepare all ingredients\n2. Heat pan/oven to appropriate temperature\n3. Cook main ingredients\n4. Add seasonings and mix well\n5. Serve hot and enjoy!`;
  }

  private generateMediaTitle(type: string, genre: string): string {
    const templates = [
      `The ${this.randomWord()}`,
      `${this.randomWord()} ${this.randomWord()}`,
      `The Last ${this.randomWord()}`,
      `${this.randomWord()} Chronicles`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateArtistName(): string {
    const names = ['The Velvet Sound', 'Echo Chamber', 'Midnight Vibes', 'Crystal Clear', 'Urban Legends', 'Neon Dreams'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateMediaTags(type: string): string[] {
    const tags = {
      music: ['upbeat', 'chill', 'party', 'workout', 'study', 'relax'],
      movie: ['must-watch', 'popcorn', 'date-night', 'weekend', 'classic'],
      tv: ['binge-worthy', 'must-see', 'addictive', 'weekend', 'acclaimed'],
    };
    const typeTags = tags[type as keyof typeof tags] || [];
    return typeTags.slice(0, 2 + Math.floor(Math.random() * 3));
  }

  private generateIdeaTitle(category: string): string {
    const templates = {
      art: ['Abstract Canvas', 'Watercolor Landscape', 'Portrait Study', 'Still Life'],
      writing: ['Short Story', 'Poetry Collection', 'Novel Chapter', 'Personal Essay'],
      music: ['Song Composition', 'Beat Production', 'Cover Recording', 'Instrumental Piece'],
      crafts: ['DIY Project', 'Handmade Gift', 'Home Decor', 'Upcycled Creation'],
      coding: ['Web App', 'Mobile Game', 'Automation Script', 'API Integration'],
      design: ['Logo Design', 'UI Mockup', 'Poster Art', 'Brand Identity'],
      photography: ['Portrait Session', 'Landscape Series', 'Street Photography', 'Product Shots'],
      video: ['Short Film', 'Vlog Series', 'Tutorial Video', 'Animation Project'],
    };
    const titles = templates[category as keyof typeof templates] || ['Creative Project'];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateIdeaDescription(category: string): string {
    return `A creative ${category} project that combines technique with personal expression. Perfect for building skills and creating something unique.`;
  }

  private generateMaterials(category: string): string[] {
    const materials = {
      art: ['Canvas', 'Paints', 'Brushes', 'Easel', 'Palette'],
      writing: ['Notebook', 'Pen', 'Computer', 'Writing software'],
      music: ['Instrument', 'DAW software', 'Microphone', 'Headphones'],
      crafts: ['Scissors', 'Glue', 'Paper', 'Decorative items', 'Tools'],
      coding: ['Computer', 'Code editor', 'Documentation', 'Testing tools'],
      design: ['Design software', 'Tablet', 'Stylus', 'Reference images'],
      photography: ['Camera', 'Lenses', 'Tripod', 'Lighting', 'Editing software'],
      video: ['Camera', 'Microphone', 'Editing software', 'Lighting', 'Stabilizer'],
    };
    return materials[category as keyof typeof materials] || ['Basic supplies'];
  }

  private generateSteps(category: string): string[] {
    return [
      'Gather all materials and prepare workspace',
      'Plan your project and sketch initial ideas',
      'Begin with the foundation/basic structure',
      'Add details and refine your work',
      'Review and make final adjustments',
      'Share or display your finished creation',
    ];
  }

  private generateTips(): string[] {
    return [
      'Take your time and enjoy the process',
      'Don\'t be afraid to experiment',
      'Reference examples for inspiration',
      'Practice makes perfect',
      'Share your work to get feedback',
    ];
  }

  private randomWord(): string {
    const words = [
      'Shadow', 'Light', 'Storm', 'Dawn', 'Night', 'Fire', 'Ice', 'Wind', 'Earth', 'Sky',
      'Ocean', 'Mountain', 'Forest', 'River', 'Star', 'Moon', 'Sun', 'Dream', 'Hope', 'Fear',
      'Love', 'Time', 'Space', 'Memory', 'Future', 'Past', 'Journey', 'Quest', 'Adventure', 'Mystery',
    ];
    return words[Math.floor(Math.random() * words.length)];
  }

  /**
   * Fill all libraries at once
   */
  fillAllLibraries() {
    console.log('🎨 Generating comprehensive library content...');

    const books = this.generateBooks(100);
    const podcasts = this.generatePodcasts(200);
    const recipes = this.generateRecipes(150);
    const media = this.generateMediaItems(300);
    const ideas = this.generateCreativeIdeas(500);

    // Save to localStorage
    localStorage.setItem('bookLibrary', JSON.stringify(books));
    localStorage.setItem('podcastSubscriptions', JSON.stringify(podcasts));
    localStorage.setItem('cookingRecipes', JSON.stringify(recipes));
    localStorage.setItem('mediaLibrary', JSON.stringify(media));
    localStorage.setItem('creativeIdeas', JSON.stringify(ideas));

    console.log('✅ Library content generated:');
    console.log(`   📚 ${books.length} books`);
    console.log(`   🎙️ ${podcasts.length} podcasts`);
    console.log(`   🍳 ${recipes.length} recipes`);
    console.log(`   🎬 ${media.length} media items`);
    console.log(`   💡 ${ideas.length} creative ideas`);

    return {
      books,
      podcasts,
      recipes,
      media,
      ideas,
      total: books.length + podcasts.length + recipes.length + media.length + ideas.length,
    };
  }
}

export const libraryGenerator = LibraryContentGenerator.getInstance();
export default libraryGenerator;
