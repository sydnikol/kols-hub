/**
 * Comprehensive Food Management Service
 * Complete food tracking, meal planning, recipes, and nutrition management
 */

import { openDB, DBSchema } from 'idb';

// ============ TYPES ============

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  cholesterol?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  calories?: number;
  notes?: string;
  optional?: boolean;
  substitutes?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'appetizer' | 'side' | 'beverage' | 'sauce';
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  nutrition: NutritionInfo;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number;
  imageUrl?: string;
  source?: string;
  notes?: string;
  dietary: string[]; // vegan, vegetarian, gluten-free, dairy-free, etc.
  equipment?: string[];
  tips?: string[];
  createdAt: string;
  isFavorite: boolean;
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expirationDate: string;
  location: 'pantry' | 'fridge' | 'freezer' | 'counter';
  brand?: string;
  notes?: string;
  lowStockThreshold?: number;
  barcode?: string;
  price?: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  store?: string;
  aisle?: string;
  estimatedPrice?: number;
  priority: 'low' | 'medium' | 'high';
  checked: boolean;
  notes?: string;
  recipeId?: string; // linked from recipe
}

export interface MealLog {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  recipeId?: string;
  servings: number;
  nutrition: NutritionInfo;
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'poor';
  hunger?: number; // 1-10
  satisfaction?: number; // 1-10
  imageUrl?: string;
  tags?: string[];
}

export interface MealPlan {
  id: string;
  weekStart: string; // Monday of the week
  days: {
    [day: string]: {
      breakfast?: { recipeId?: string; name: string };
      lunch?: { recipeId?: string; name: string };
      dinner?: { recipeId?: string; name: string };
      snacks?: { recipeId?: string; name: string }[];
    };
  };
  notes?: string;
  shoppingListGenerated?: boolean;
}

export interface WaterLog {
  id: string;
  date: string;
  amount: number; // ml
  time: string;
}

export interface FoodPreferences {
  allergies: string[];
  intolerances: string[];
  dislikedFoods: string[];
  favoriteFoods: string[];
  dietaryRestrictions: string[];
  calorieGoal?: number;
  proteinGoal?: number;
  carbGoal?: number;
  fatGoal?: number;
  waterGoal?: number; // ml per day
}

// ============ DATABASE ============

interface FoodDB extends DBSchema {
  recipes: {
    key: string;
    value: Recipe;
    indexes: { 'by-category': string; 'by-cuisine': string; 'by-favorite': number };
  };
  pantry: {
    key: string;
    value: PantryItem;
    indexes: { 'by-category': string; 'by-location': string; 'by-expiration': string };
  };
  groceryList: {
    key: string;
    value: GroceryItem;
    indexes: { 'by-category': string; 'by-checked': number };
  };
  mealLogs: {
    key: string;
    value: MealLog;
    indexes: { 'by-date': string; 'by-type': string };
  };
  mealPlans: {
    key: string;
    value: MealPlan;
    indexes: { 'by-week': string };
  };
  waterLogs: {
    key: string;
    value: WaterLog;
    indexes: { 'by-date': string };
  };
  preferences: {
    key: string;
    value: FoodPreferences;
  };
}

class FoodManagementService {
  private dbName = 'kolhub-food-management';
  private dbVersion = 1;

  private async getDB() {
    return openDB<FoodDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Recipes store
        if (!db.objectStoreNames.contains('recipes')) {
          const store = db.createObjectStore('recipes', { keyPath: 'id' });
          store.createIndex('by-category', 'category');
          store.createIndex('by-cuisine', 'cuisine');
          store.createIndex('by-favorite', 'isFavorite');
        }

        // Pantry store
        if (!db.objectStoreNames.contains('pantry')) {
          const store = db.createObjectStore('pantry', { keyPath: 'id' });
          store.createIndex('by-category', 'category');
          store.createIndex('by-location', 'location');
          store.createIndex('by-expiration', 'expirationDate');
        }

        // Grocery list store
        if (!db.objectStoreNames.contains('groceryList')) {
          const store = db.createObjectStore('groceryList', { keyPath: 'id' });
          store.createIndex('by-category', 'category');
          store.createIndex('by-checked', 'checked');
        }

        // Meal logs store
        if (!db.objectStoreNames.contains('mealLogs')) {
          const store = db.createObjectStore('mealLogs', { keyPath: 'id' });
          store.createIndex('by-date', 'date');
          store.createIndex('by-type', 'mealType');
        }

        // Meal plans store
        if (!db.objectStoreNames.contains('mealPlans')) {
          const store = db.createObjectStore('mealPlans', { keyPath: 'id' });
          store.createIndex('by-week', 'weekStart');
        }

        // Water logs store
        if (!db.objectStoreNames.contains('waterLogs')) {
          const store = db.createObjectStore('waterLogs', { keyPath: 'id' });
          store.createIndex('by-date', 'date');
        }

        // Preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'id' });
        }
      },
    });
  }

  // ============ RECIPES ============

  async addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> {
    const db = await this.getDB();
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await db.put('recipes', newRecipe);
    return newRecipe;
  }

  async getRecipes(): Promise<Recipe[]> {
    const db = await this.getDB();
    return db.getAll('recipes');
  }

  async getRecipesByCategory(category: Recipe['category']): Promise<Recipe[]> {
    const db = await this.getDB();
    return db.getAllFromIndex('recipes', 'by-category', category);
  }

  async getFavoriteRecipes(): Promise<Recipe[]> {
    const db = await this.getDB();
    const recipes = await db.getAll('recipes');
    return recipes.filter(r => r.isFavorite);
  }

  async toggleRecipeFavorite(id: string): Promise<Recipe | null> {
    const db = await this.getDB();
    const recipe = await db.get('recipes', id);
    if (recipe) {
      recipe.isFavorite = !recipe.isFavorite;
      await db.put('recipes', recipe);
      return recipe;
    }
    return null;
  }

  async searchRecipes(query: string, filters?: {
    category?: string;
    cuisine?: string;
    dietary?: string[];
    maxPrepTime?: number;
    difficulty?: string;
  }): Promise<Recipe[]> {
    const recipes = await this.getRecipes();
    const q = query.toLowerCase();

    return recipes.filter(recipe => {
      // Text search
      const matchesQuery = !query ||
        recipe.name.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q) ||
        recipe.tags.some(t => t.toLowerCase().includes(q)) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(q));

      // Category filter
      const matchesCategory = !filters?.category || recipe.category === filters.category;

      // Cuisine filter
      const matchesCuisine = !filters?.cuisine || recipe.cuisine === filters.cuisine;

      // Dietary filter
      const matchesDietary = !filters?.dietary?.length ||
        filters.dietary.every(d => recipe.dietary.includes(d));

      // Prep time filter
      const matchesPrepTime = !filters?.maxPrepTime ||
        (recipe.prepTime + recipe.cookTime) <= filters.maxPrepTime;

      // Difficulty filter
      const matchesDifficulty = !filters?.difficulty || recipe.difficulty === filters.difficulty;

      return matchesQuery && matchesCategory && matchesCuisine &&
             matchesDietary && matchesPrepTime && matchesDifficulty;
    });
  }

  // ============ PANTRY ============

  async addPantryItem(item: Omit<PantryItem, 'id'>): Promise<PantryItem> {
    const db = await this.getDB();
    const newItem: PantryItem = {
      ...item,
      id: `pantry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    await db.put('pantry', newItem);
    return newItem;
  }

  async getPantryItems(): Promise<PantryItem[]> {
    const db = await this.getDB();
    return db.getAll('pantry');
  }

  async getExpiringItems(daysAhead: number = 7): Promise<PantryItem[]> {
    const items = await this.getPantryItems();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return items.filter(item => {
      const expDate = new Date(item.expirationDate);
      return expDate <= futureDate && expDate >= new Date();
    }).sort((a, b) =>
      new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
    );
  }

  async getLowStockItems(): Promise<PantryItem[]> {
    const items = await this.getPantryItems();
    return items.filter(item =>
      item.lowStockThreshold && item.quantity <= item.lowStockThreshold
    );
  }

  async updatePantryQuantity(id: string, quantity: number): Promise<void> {
    const db = await this.getDB();
    const item = await db.get('pantry', id);
    if (item) {
      item.quantity = quantity;
      await db.put('pantry', item);
    }
  }

  // ============ GROCERY LIST ============

  async addGroceryItem(item: Omit<GroceryItem, 'id'>): Promise<GroceryItem> {
    const db = await this.getDB();
    const newItem: GroceryItem = {
      ...item,
      id: `grocery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    await db.put('groceryList', newItem);
    return newItem;
  }

  async getGroceryList(): Promise<GroceryItem[]> {
    const db = await this.getDB();
    return db.getAll('groceryList');
  }

  async toggleGroceryChecked(id: string): Promise<void> {
    const db = await this.getDB();
    const item = await db.get('groceryList', id);
    if (item) {
      item.checked = !item.checked;
      await db.put('groceryList', item);
    }
  }

  async clearCheckedGroceries(): Promise<void> {
    const db = await this.getDB();
    const items = await this.getGroceryList();
    const tx = db.transaction('groceryList', 'readwrite');
    for (const item of items) {
      if (item.checked) {
        await tx.store.delete(item.id);
      }
    }
    await tx.done;
  }

  async generateGroceryFromRecipe(recipe: Recipe, servingsMultiplier: number = 1): Promise<GroceryItem[]> {
    const items: GroceryItem[] = [];

    for (const ingredient of recipe.ingredients) {
      items.push({
        id: `grocery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: ingredient.name,
        category: this.categorizeIngredient(ingredient.name),
        quantity: ingredient.amount * servingsMultiplier,
        unit: ingredient.unit,
        priority: 'medium',
        checked: false,
        recipeId: recipe.id,
        notes: ingredient.notes,
      });
    }

    const db = await this.getDB();
    for (const item of items) {
      await db.put('groceryList', item);
    }

    return items;
  }

  private categorizeIngredient(name: string): string {
    const lower = name.toLowerCase();

    if (['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey', 'lamb'].some(m => lower.includes(m))) {
      return 'Protein';
    }
    if (['milk', 'cheese', 'yogurt', 'butter', 'cream'].some(d => lower.includes(d))) {
      return 'Dairy';
    }
    if (['apple', 'banana', 'berry', 'orange', 'lemon', 'lime', 'grape', 'melon'].some(f => lower.includes(f))) {
      return 'Fruits';
    }
    if (['lettuce', 'spinach', 'kale', 'broccoli', 'carrot', 'tomato', 'onion', 'garlic', 'pepper', 'potato'].some(v => lower.includes(v))) {
      return 'Vegetables';
    }
    if (['bread', 'pasta', 'rice', 'flour', 'oat', 'cereal', 'quinoa'].some(g => lower.includes(g))) {
      return 'Grains';
    }
    if (['oil', 'vinegar', 'sauce', 'mayo', 'mustard', 'ketchup'].some(c => lower.includes(c))) {
      return 'Condiments';
    }
    if (['salt', 'pepper', 'cumin', 'paprika', 'cinnamon', 'oregano', 'basil'].some(s => lower.includes(s))) {
      return 'Spices';
    }
    return 'Other';
  }

  // ============ MEAL LOGGING ============

  async logMeal(meal: Omit<MealLog, 'id'>): Promise<MealLog> {
    const db = await this.getDB();
    const newLog: MealLog = {
      ...meal,
      id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    await db.put('mealLogs', newLog);
    return newLog;
  }

  async getMealLogs(startDate?: string, endDate?: string): Promise<MealLog[]> {
    const db = await this.getDB();
    const logs = await db.getAll('mealLogs');

    if (!startDate && !endDate) return logs;

    return logs.filter(log => {
      const logDate = new Date(log.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      return logDate >= start && logDate <= end;
    });
  }

  async getDailyNutrition(date: string): Promise<NutritionInfo> {
    const logs = await this.getMealLogs(date, date);

    return logs.reduce((acc, log) => ({
      calories: acc.calories + (log.nutrition.calories * log.servings),
      protein: acc.protein + (log.nutrition.protein * log.servings),
      carbs: acc.carbs + (log.nutrition.carbs * log.servings),
      fat: acc.fat + (log.nutrition.fat * log.servings),
      fiber: acc.fiber + (log.nutrition.fiber * log.servings),
      sodium: acc.sodium + (log.nutrition.sodium * log.servings),
      sugar: acc.sugar + (log.nutrition.sugar * log.servings),
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0
    });
  }

  async getWeeklyNutritionAverage(): Promise<NutritionInfo> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const logs = await this.getMealLogs(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    const totals = logs.reduce((acc, log) => ({
      calories: acc.calories + (log.nutrition.calories * log.servings),
      protein: acc.protein + (log.nutrition.protein * log.servings),
      carbs: acc.carbs + (log.nutrition.carbs * log.servings),
      fat: acc.fat + (log.nutrition.fat * log.servings),
      fiber: acc.fiber + (log.nutrition.fiber * log.servings),
      sodium: acc.sodium + (log.nutrition.sodium * log.servings),
      sugar: acc.sugar + (log.nutrition.sugar * log.servings),
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0
    });

    return {
      calories: Math.round(totals.calories / 7),
      protein: Math.round(totals.protein / 7),
      carbs: Math.round(totals.carbs / 7),
      fat: Math.round(totals.fat / 7),
      fiber: Math.round(totals.fiber / 7),
      sodium: Math.round(totals.sodium / 7),
      sugar: Math.round(totals.sugar / 7),
    };
  }

  // ============ MEAL PLANNING ============

  async createMealPlan(weekStart: string): Promise<MealPlan> {
    const db = await this.getDB();
    const newPlan: MealPlan = {
      id: `plan-${Date.now()}`,
      weekStart,
      days: {
        'Monday': {},
        'Tuesday': {},
        'Wednesday': {},
        'Thursday': {},
        'Friday': {},
        'Saturday': {},
        'Sunday': {},
      },
    };
    await db.put('mealPlans', newPlan);
    return newPlan;
  }

  async getMealPlan(weekStart: string): Promise<MealPlan | null> {
    const db = await this.getDB();
    const plans = await db.getAllFromIndex('mealPlans', 'by-week', weekStart);
    return plans[0] || null;
  }

  async updateMealPlan(plan: MealPlan): Promise<void> {
    const db = await this.getDB();
    await db.put('mealPlans', plan);
  }

  async generateMealPlanFromRecipes(weekStart: string, preferences?: FoodPreferences): Promise<MealPlan> {
    const recipes = await this.getRecipes();
    const plan = await this.createMealPlan(weekStart);

    const breakfasts = recipes.filter(r => r.category === 'breakfast');
    const lunches = recipes.filter(r => ['lunch', 'dinner'].includes(r.category) && r.prepTime <= 30);
    const dinners = recipes.filter(r => ['dinner', 'lunch'].includes(r.category));
    const snacks = recipes.filter(r => r.category === 'snack');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (const day of days) {
      const pickRandom = <T>(arr: T[]): T | undefined =>
        arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;

      const breakfast = pickRandom(breakfasts);
      const lunch = pickRandom(lunches);
      const dinner = pickRandom(dinners);
      const snack = pickRandom(snacks);

      plan.days[day] = {
        breakfast: breakfast ? { recipeId: breakfast.id, name: breakfast.name } : undefined,
        lunch: lunch ? { recipeId: lunch.id, name: lunch.name } : undefined,
        dinner: dinner ? { recipeId: dinner.id, name: dinner.name } : undefined,
        snacks: snack ? [{ recipeId: snack.id, name: snack.name }] : undefined,
      };
    }

    await this.updateMealPlan(plan);
    return plan;
  }

  // ============ WATER TRACKING ============

  async logWater(amount: number): Promise<WaterLog> {
    const db = await this.getDB();
    const now = new Date();
    const log: WaterLog = {
      id: `water-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      amount,
      time: now.toTimeString().split(' ')[0],
    };
    await db.put('waterLogs', log);
    return log;
  }

  async getDailyWater(date: string): Promise<number> {
    const db = await this.getDB();
    const logs = await db.getAllFromIndex('waterLogs', 'by-date', date);
    return logs.reduce((total, log) => total + log.amount, 0);
  }

  // ============ PREFERENCES ============

  async savePreferences(prefs: FoodPreferences): Promise<void> {
    const db = await this.getDB();
    await db.put('preferences', { ...prefs, id: 'user-preferences' } as any);
  }

  async getPreferences(): Promise<FoodPreferences | null> {
    const db = await this.getDB();
    return db.get('preferences', 'user-preferences') as Promise<FoodPreferences | null>;
  }

  // ============ SEED DATA ============

  async seedRecipes(): Promise<void> {
    const existingRecipes = await this.getRecipes();
    if (existingRecipes.length > 0) return;

    const recipes: Omit<Recipe, 'id' | 'createdAt'>[] = [
      // BREAKFAST
      {
        name: 'Avocado Toast with Poached Eggs',
        description: 'Creamy avocado on toasted sourdough topped with perfectly poached eggs',
        category: 'breakfast',
        cuisine: 'American',
        ingredients: [
          { name: 'Sourdough bread', amount: 2, unit: 'slices' },
          { name: 'Avocado', amount: 1, unit: 'whole' },
          { name: 'Eggs', amount: 2, unit: 'whole' },
          { name: 'Lemon juice', amount: 1, unit: 'tsp' },
          { name: 'Red pepper flakes', amount: 0.25, unit: 'tsp' },
          { name: 'Salt', amount: 1, unit: 'pinch' },
          { name: 'Black pepper', amount: 1, unit: 'pinch' },
        ],
        instructions: [
          'Toast the sourdough bread until golden',
          'Mash avocado with lemon juice, salt, and pepper',
          'Bring water to simmer with a splash of vinegar',
          'Create a gentle whirlpool and drop eggs in',
          'Poach for 3-4 minutes until whites are set',
          'Spread avocado on toast, top with eggs',
          'Season with red pepper flakes',
        ],
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        nutrition: { calories: 420, protein: 18, carbs: 35, fat: 24, fiber: 8, sodium: 380, sugar: 2 },
        tags: ['high-protein', 'quick', 'vegetarian'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['vegetarian'],
        equipment: ['Toaster', 'Saucepan'],
        tips: ['Add vinegar to water for better egg whites', 'Use ripe avocados'],
        isFavorite: false,
      },
      {
        name: 'Overnight Oats with Berries',
        description: 'Creamy no-cook oats prepared the night before with fresh berries',
        category: 'breakfast',
        cuisine: 'American',
        ingredients: [
          { name: 'Rolled oats', amount: 0.5, unit: 'cup' },
          { name: 'Almond milk', amount: 0.5, unit: 'cup' },
          { name: 'Greek yogurt', amount: 0.25, unit: 'cup' },
          { name: 'Chia seeds', amount: 1, unit: 'tbsp' },
          { name: 'Honey', amount: 1, unit: 'tbsp' },
          { name: 'Mixed berries', amount: 0.5, unit: 'cup' },
          { name: 'Cinnamon', amount: 0.25, unit: 'tsp' },
        ],
        instructions: [
          'Combine oats, milk, yogurt, chia seeds in a jar',
          'Add honey and cinnamon, mix well',
          'Cover and refrigerate overnight (at least 6 hours)',
          'In the morning, top with fresh berries',
          'Add more milk if too thick',
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        nutrition: { calories: 350, protein: 14, carbs: 52, fat: 10, fiber: 8, sodium: 140, sugar: 18 },
        tags: ['meal-prep', 'no-cook', 'high-fiber'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian'],
        equipment: ['Mason jar'],
        tips: ['Prepare multiple jars for the week'],
        isFavorite: false,
      },
      {
        name: 'Veggie Scramble',
        description: 'Fluffy scrambled eggs loaded with colorful vegetables',
        category: 'breakfast',
        cuisine: 'American',
        ingredients: [
          { name: 'Eggs', amount: 3, unit: 'whole' },
          { name: 'Bell peppers', amount: 0.5, unit: 'cup diced' },
          { name: 'Spinach', amount: 1, unit: 'cup' },
          { name: 'Cherry tomatoes', amount: 0.5, unit: 'cup halved' },
          { name: 'Feta cheese', amount: 2, unit: 'tbsp' },
          { name: 'Olive oil', amount: 1, unit: 'tbsp' },
          { name: 'Salt and pepper', amount: 1, unit: 'to taste' },
        ],
        instructions: [
          'Whisk eggs with salt and pepper',
          'Heat olive oil in non-stick pan over medium heat',
          'Sauté bell peppers for 2 minutes',
          'Add spinach and tomatoes, cook 1 minute',
          'Pour in eggs, gently fold until just set',
          'Top with crumbled feta cheese',
        ],
        prepTime: 5,
        cookTime: 8,
        servings: 1,
        nutrition: { calories: 380, protein: 22, carbs: 12, fat: 28, fiber: 3, sodium: 520, sugar: 6 },
        tags: ['high-protein', 'low-carb', 'quick'],
        difficulty: 'easy',
        rating: 4,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      // LUNCH
      {
        name: 'Mediterranean Quinoa Bowl',
        description: 'Protein-packed quinoa with Mediterranean vegetables and tahini dressing',
        category: 'lunch',
        cuisine: 'Mediterranean',
        ingredients: [
          { name: 'Quinoa', amount: 1, unit: 'cup cooked' },
          { name: 'Chickpeas', amount: 0.5, unit: 'can' },
          { name: 'Cucumber', amount: 0.5, unit: 'cup diced' },
          { name: 'Cherry tomatoes', amount: 0.5, unit: 'cup' },
          { name: 'Red onion', amount: 0.25, unit: 'cup' },
          { name: 'Kalamata olives', amount: 0.25, unit: 'cup' },
          { name: 'Feta cheese', amount: 0.25, unit: 'cup' },
          { name: 'Tahini', amount: 2, unit: 'tbsp' },
          { name: 'Lemon juice', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Cook quinoa according to package directions',
          'Drain and rinse chickpeas',
          'Chop all vegetables',
          'Whisk tahini with lemon juice and water',
          'Assemble bowl with quinoa base',
          'Top with vegetables, chickpeas, olives, feta',
          'Drizzle with tahini dressing',
        ],
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        nutrition: { calories: 450, protein: 18, carbs: 52, fat: 20, fiber: 10, sodium: 480, sugar: 4 },
        tags: ['vegetarian', 'high-fiber', 'meal-prep'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Asian Chicken Lettuce Wraps',
        description: 'Light and flavorful chicken in crisp lettuce cups with peanut sauce',
        category: 'lunch',
        cuisine: 'Asian',
        ingredients: [
          { name: 'Ground chicken', amount: 1, unit: 'lb' },
          { name: 'Butter lettuce', amount: 1, unit: 'head' },
          { name: 'Water chestnuts', amount: 0.5, unit: 'cup' },
          { name: 'Green onions', amount: 0.25, unit: 'cup' },
          { name: 'Soy sauce', amount: 2, unit: 'tbsp' },
          { name: 'Sesame oil', amount: 1, unit: 'tbsp' },
          { name: 'Ginger', amount: 1, unit: 'tsp minced' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
          { name: 'Peanut butter', amount: 2, unit: 'tbsp' },
          { name: 'Rice vinegar', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Heat sesame oil in large skillet',
          'Cook ground chicken until browned',
          'Add ginger and garlic, cook 1 minute',
          'Stir in water chestnuts and soy sauce',
          'Make peanut sauce with PB, vinegar, and water',
          'Separate lettuce leaves for cups',
          'Fill lettuce cups with chicken mixture',
          'Drizzle with peanut sauce, top with green onions',
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        nutrition: { calories: 320, protein: 28, carbs: 12, fat: 18, fiber: 2, sodium: 580, sugar: 3 },
        tags: ['low-carb', 'high-protein', 'gluten-free-option'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      // DINNER
      {
        name: 'Lemon Herb Salmon',
        description: 'Flaky salmon with bright lemon and fresh herbs',
        category: 'dinner',
        cuisine: 'Mediterranean',
        ingredients: [
          { name: 'Salmon fillets', amount: 4, unit: '6oz each' },
          { name: 'Lemon', amount: 2, unit: 'whole' },
          { name: 'Fresh dill', amount: 0.25, unit: 'cup' },
          { name: 'Fresh parsley', amount: 0.25, unit: 'cup' },
          { name: 'Garlic', amount: 3, unit: 'cloves' },
          { name: 'Olive oil', amount: 3, unit: 'tbsp' },
          { name: 'Salt and pepper', amount: 1, unit: 'to taste' },
        ],
        instructions: [
          'Preheat oven to 400°F (200°C)',
          'Place salmon on lined baking sheet',
          'Mix olive oil, minced garlic, lemon zest, herbs',
          'Spread herb mixture over salmon',
          'Top with lemon slices',
          'Bake 12-15 minutes until flakes easily',
          'Serve with extra lemon wedges',
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        nutrition: { calories: 380, protein: 42, carbs: 4, fat: 22, fiber: 1, sodium: 320, sugar: 1 },
        tags: ['omega-3', 'high-protein', 'quick'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['gluten-free', 'dairy-free', 'paleo', 'keto'],
        isFavorite: false,
      },
      {
        name: 'Chicken Stir Fry with Vegetables',
        description: 'Quick and healthy stir fry with colorful vegetables',
        category: 'dinner',
        cuisine: 'Asian',
        ingredients: [
          { name: 'Chicken breast', amount: 1.5, unit: 'lbs' },
          { name: 'Broccoli florets', amount: 2, unit: 'cups' },
          { name: 'Bell peppers', amount: 2, unit: 'whole' },
          { name: 'Snow peas', amount: 1, unit: 'cup' },
          { name: 'Soy sauce', amount: 0.25, unit: 'cup' },
          { name: 'Sesame oil', amount: 2, unit: 'tbsp' },
          { name: 'Ginger', amount: 1, unit: 'tbsp minced' },
          { name: 'Garlic', amount: 3, unit: 'cloves' },
          { name: 'Cornstarch', amount: 1, unit: 'tbsp' },
          { name: 'Brown rice', amount: 2, unit: 'cups cooked' },
        ],
        instructions: [
          'Cut chicken into bite-sized pieces',
          'Mix soy sauce with cornstarch',
          'Heat wok or large pan over high heat',
          'Cook chicken until golden, set aside',
          'Stir fry vegetables 3-4 minutes',
          'Add ginger and garlic',
          'Return chicken, add sauce',
          'Cook until sauce thickens',
          'Serve over brown rice',
        ],
        prepTime: 15,
        cookTime: 15,
        servings: 4,
        nutrition: { calories: 420, protein: 38, carbs: 42, fat: 12, fiber: 5, sodium: 680, sugar: 6 },
        tags: ['high-protein', 'quick', 'family-friendly'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['dairy-free'],
        isFavorite: false,
      },
      {
        name: 'Vegetable Curry',
        description: 'Aromatic Indian curry loaded with vegetables in creamy coconut sauce',
        category: 'dinner',
        cuisine: 'Indian',
        ingredients: [
          { name: 'Chickpeas', amount: 1, unit: 'can' },
          { name: 'Cauliflower', amount: 2, unit: 'cups' },
          { name: 'Sweet potato', amount: 1, unit: 'large' },
          { name: 'Spinach', amount: 2, unit: 'cups' },
          { name: 'Coconut milk', amount: 1, unit: 'can' },
          { name: 'Curry paste', amount: 3, unit: 'tbsp' },
          { name: 'Onion', amount: 1, unit: 'medium' },
          { name: 'Garlic', amount: 3, unit: 'cloves' },
          { name: 'Ginger', amount: 1, unit: 'tbsp' },
          { name: 'Basmati rice', amount: 2, unit: 'cups cooked' },
        ],
        instructions: [
          'Sauté onion until soft',
          'Add garlic, ginger, and curry paste',
          'Add cubed sweet potato and cauliflower',
          'Pour in coconut milk and simmer 15 min',
          'Add chickpeas, cook 5 more minutes',
          'Stir in spinach until wilted',
          'Serve over basmati rice',
        ],
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        nutrition: { calories: 480, protein: 14, carbs: 58, fat: 22, fiber: 10, sodium: 520, sugar: 8 },
        tags: ['vegetarian', 'vegan', 'comfort-food'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      // SNACKS
      {
        name: 'Greek Yogurt Parfait',
        description: 'Layered yogurt with granola and fresh fruit',
        category: 'snack',
        cuisine: 'American',
        ingredients: [
          { name: 'Greek yogurt', amount: 1, unit: 'cup' },
          { name: 'Granola', amount: 0.25, unit: 'cup' },
          { name: 'Mixed berries', amount: 0.5, unit: 'cup' },
          { name: 'Honey', amount: 1, unit: 'tbsp' },
          { name: 'Chia seeds', amount: 1, unit: 'tsp' },
        ],
        instructions: [
          'Layer half the yogurt in a glass',
          'Add half the berries and granola',
          'Repeat layers',
          'Drizzle with honey',
          'Sprinkle with chia seeds',
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        nutrition: { calories: 280, protein: 18, carbs: 38, fat: 8, fiber: 4, sodium: 80, sugar: 22 },
        tags: ['quick', 'high-protein', 'probiotic'],
        difficulty: 'easy',
        rating: 4,
        dietary: ['vegetarian', 'gluten-free-option'],
        isFavorite: false,
      },
      {
        name: 'Hummus and Veggie Plate',
        description: 'Creamy hummus with fresh cut vegetables',
        category: 'snack',
        cuisine: 'Middle Eastern',
        ingredients: [
          { name: 'Hummus', amount: 0.5, unit: 'cup' },
          { name: 'Carrots', amount: 2, unit: 'medium' },
          { name: 'Cucumber', amount: 0.5, unit: 'whole' },
          { name: 'Bell pepper', amount: 1, unit: 'whole' },
          { name: 'Cherry tomatoes', amount: 0.5, unit: 'cup' },
          { name: 'Pita bread', amount: 1, unit: 'whole', optional: true },
        ],
        instructions: [
          'Cut vegetables into sticks and slices',
          'Arrange on plate around hummus',
          'Optionally warm pita and cut into triangles',
          'Serve immediately',
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        nutrition: { calories: 220, protein: 8, carbs: 28, fat: 10, fiber: 7, sodium: 380, sugar: 8 },
        tags: ['vegetarian', 'vegan', 'high-fiber'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'dairy-free'],
        isFavorite: false,
      },
      // DESSERTS
      {
        name: 'Dark Chocolate Avocado Mousse',
        description: 'Rich and creamy chocolate mousse made with avocado',
        category: 'dessert',
        cuisine: 'American',
        ingredients: [
          { name: 'Ripe avocados', amount: 2, unit: 'whole' },
          { name: 'Cocoa powder', amount: 0.25, unit: 'cup' },
          { name: 'Maple syrup', amount: 0.25, unit: 'cup' },
          { name: 'Vanilla extract', amount: 1, unit: 'tsp' },
          { name: 'Almond milk', amount: 2, unit: 'tbsp' },
          { name: 'Sea salt', amount: 1, unit: 'pinch' },
        ],
        instructions: [
          'Blend avocados until smooth',
          'Add cocoa powder, maple syrup, vanilla',
          'Blend until creamy, adding milk as needed',
          'Add pinch of salt',
          'Chill for 30 minutes',
          'Serve with berries or whipped cream',
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 4,
        nutrition: { calories: 220, protein: 3, carbs: 24, fat: 15, fiber: 7, sodium: 40, sugar: 14 },
        tags: ['vegan', 'healthy-dessert', 'no-bake'],
        difficulty: 'easy',
        rating: 4,
        dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      // MORE BREAKFAST
      {
        name: 'Banana Pancakes',
        description: 'Fluffy pancakes made with ripe bananas and a hint of cinnamon',
        category: 'breakfast',
        cuisine: 'American',
        ingredients: [
          { name: 'Ripe bananas', amount: 2, unit: 'whole' },
          { name: 'Eggs', amount: 2, unit: 'whole' },
          { name: 'All-purpose flour', amount: 1, unit: 'cup' },
          { name: 'Milk', amount: 0.75, unit: 'cup' },
          { name: 'Baking powder', amount: 1, unit: 'tsp' },
          { name: 'Cinnamon', amount: 0.5, unit: 'tsp' },
          { name: 'Butter', amount: 2, unit: 'tbsp' },
        ],
        instructions: [
          'Mash bananas in a large bowl',
          'Whisk in eggs and milk',
          'Add flour, baking powder, and cinnamon',
          'Mix until just combined',
          'Heat butter in pan over medium heat',
          'Pour 1/4 cup batter per pancake',
          'Cook until bubbles form, flip and cook other side',
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        nutrition: { calories: 280, protein: 8, carbs: 45, fat: 8, fiber: 3, sodium: 220, sugar: 12 },
        tags: ['breakfast', 'family-friendly', 'comfort-food'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian'],
        isFavorite: false,
      },
      {
        name: 'Spinach and Mushroom Omelette',
        description: 'Classic French-style omelette with sautéed vegetables',
        category: 'breakfast',
        cuisine: 'French',
        ingredients: [
          { name: 'Eggs', amount: 3, unit: 'whole' },
          { name: 'Spinach', amount: 1, unit: 'cup' },
          { name: 'Mushrooms', amount: 0.5, unit: 'cup sliced' },
          { name: 'Gruyere cheese', amount: 0.25, unit: 'cup' },
          { name: 'Butter', amount: 1, unit: 'tbsp' },
          { name: 'Fresh herbs', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Sauté mushrooms until golden',
          'Add spinach until wilted, set aside',
          'Whisk eggs with herbs, salt, pepper',
          'Melt butter in pan, add eggs',
          'Cook until almost set',
          'Add vegetables and cheese to one half',
          'Fold omelette and serve',
        ],
        prepTime: 10,
        cookTime: 10,
        servings: 1,
        nutrition: { calories: 420, protein: 28, carbs: 6, fat: 32, fiber: 2, sodium: 480, sugar: 2 },
        tags: ['high-protein', 'low-carb', 'keto'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free', 'keto'],
        isFavorite: false,
      },
      {
        name: 'Açaí Bowl',
        description: 'Brazilian superfood bowl with frozen açaí and fresh toppings',
        category: 'breakfast',
        cuisine: 'Brazilian',
        ingredients: [
          { name: 'Frozen açaí packets', amount: 2, unit: 'packets' },
          { name: 'Banana', amount: 1, unit: 'whole' },
          { name: 'Almond milk', amount: 0.5, unit: 'cup' },
          { name: 'Granola', amount: 0.25, unit: 'cup' },
          { name: 'Fresh berries', amount: 0.5, unit: 'cup' },
          { name: 'Sliced almonds', amount: 2, unit: 'tbsp' },
          { name: 'Honey', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Blend açaí packets with banana and milk',
          'Pour into bowl',
          'Top with granola, berries, almonds',
          'Drizzle with honey',
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        nutrition: { calories: 380, protein: 8, carbs: 62, fat: 12, fiber: 10, sodium: 60, sugar: 32 },
        tags: ['superfood', 'antioxidant', 'energizing'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Shakshuka',
        description: 'Middle Eastern eggs poached in spiced tomato sauce',
        category: 'breakfast',
        cuisine: 'Middle Eastern',
        ingredients: [
          { name: 'Eggs', amount: 4, unit: 'whole' },
          { name: 'Canned tomatoes', amount: 1, unit: 'can' },
          { name: 'Bell pepper', amount: 1, unit: 'whole' },
          { name: 'Onion', amount: 1, unit: 'medium' },
          { name: 'Garlic', amount: 3, unit: 'cloves' },
          { name: 'Cumin', amount: 1, unit: 'tsp' },
          { name: 'Paprika', amount: 1, unit: 'tsp' },
          { name: 'Feta cheese', amount: 0.25, unit: 'cup' },
        ],
        instructions: [
          'Sauté onion and pepper until soft',
          'Add garlic, cumin, paprika',
          'Pour in tomatoes, simmer 10 minutes',
          'Make wells and crack eggs into sauce',
          'Cover and cook until eggs set',
          'Top with feta and fresh herbs',
        ],
        prepTime: 10,
        cookTime: 25,
        servings: 4,
        nutrition: { calories: 220, protein: 14, carbs: 16, fat: 12, fiber: 4, sodium: 520, sugar: 8 },
        tags: ['high-protein', 'one-pan', 'spicy'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      // MORE LUNCH
      {
        name: 'Grilled Caesar Salad',
        description: 'Classic Caesar with grilled romaine and homemade dressing',
        category: 'lunch',
        cuisine: 'American',
        ingredients: [
          { name: 'Romaine hearts', amount: 2, unit: 'heads' },
          { name: 'Parmesan cheese', amount: 0.5, unit: 'cup' },
          { name: 'Croutons', amount: 1, unit: 'cup' },
          { name: 'Anchovy paste', amount: 1, unit: 'tsp' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
          { name: 'Lemon juice', amount: 2, unit: 'tbsp' },
          { name: 'Olive oil', amount: 0.25, unit: 'cup' },
          { name: 'Dijon mustard', amount: 1, unit: 'tsp' },
        ],
        instructions: [
          'Make dressing: blend anchovy, garlic, lemon, mustard, oil',
          'Halve romaine lengthwise',
          'Brush with oil and grill 2 minutes per side',
          'Plate grilled romaine',
          'Drizzle with dressing',
          'Top with parmesan and croutons',
        ],
        prepTime: 15,
        cookTime: 5,
        servings: 4,
        nutrition: { calories: 320, protein: 12, carbs: 18, fat: 24, fiber: 4, sodium: 680, sugar: 3 },
        tags: ['grilled', 'salad', 'classic'],
        difficulty: 'easy',
        rating: 4,
        dietary: [],
        isFavorite: false,
      },
      {
        name: 'Black Bean Tacos',
        description: 'Smoky black bean tacos with fresh pico de gallo',
        category: 'lunch',
        cuisine: 'Mexican',
        ingredients: [
          { name: 'Black beans', amount: 1, unit: 'can' },
          { name: 'Corn tortillas', amount: 8, unit: 'small' },
          { name: 'Avocado', amount: 1, unit: 'whole' },
          { name: 'Tomatoes', amount: 2, unit: 'medium' },
          { name: 'Red onion', amount: 0.25, unit: 'cup' },
          { name: 'Cilantro', amount: 0.25, unit: 'cup' },
          { name: 'Lime', amount: 1, unit: 'whole' },
          { name: 'Cumin', amount: 1, unit: 'tsp' },
        ],
        instructions: [
          'Heat beans with cumin and mash slightly',
          'Make pico: dice tomato, onion, cilantro, lime juice',
          'Warm tortillas',
          'Fill with beans',
          'Top with pico and sliced avocado',
        ],
        prepTime: 15,
        cookTime: 10,
        servings: 4,
        nutrition: { calories: 340, protein: 12, carbs: 52, fat: 10, fiber: 14, sodium: 380, sugar: 4 },
        tags: ['vegetarian', 'vegan', 'mexican', 'quick'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Thai Peanut Noodles',
        description: 'Cold rice noodles with creamy peanut sauce and vegetables',
        category: 'lunch',
        cuisine: 'Thai',
        ingredients: [
          { name: 'Rice noodles', amount: 8, unit: 'oz' },
          { name: 'Peanut butter', amount: 0.25, unit: 'cup' },
          { name: 'Soy sauce', amount: 3, unit: 'tbsp' },
          { name: 'Rice vinegar', amount: 2, unit: 'tbsp' },
          { name: 'Sesame oil', amount: 1, unit: 'tbsp' },
          { name: 'Shredded carrots', amount: 1, unit: 'cup' },
          { name: 'Cucumber', amount: 1, unit: 'cup julienned' },
          { name: 'Green onions', amount: 0.25, unit: 'cup' },
          { name: 'Peanuts', amount: 0.25, unit: 'cup' },
        ],
        instructions: [
          'Cook noodles according to package, rinse cold',
          'Whisk peanut butter, soy sauce, vinegar, sesame oil',
          'Toss noodles with sauce',
          'Add carrots and cucumber',
          'Top with green onions and peanuts',
        ],
        prepTime: 15,
        cookTime: 10,
        servings: 4,
        nutrition: { calories: 380, protein: 12, carbs: 48, fat: 16, fiber: 4, sodium: 680, sugar: 6 },
        tags: ['vegetarian', 'cold', 'asian'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'dairy-free'],
        isFavorite: false,
      },
      {
        name: 'Caprese Sandwich',
        description: 'Italian sandwich with fresh mozzarella, tomato, and basil',
        category: 'lunch',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Ciabatta bread', amount: 1, unit: 'loaf' },
          { name: 'Fresh mozzarella', amount: 8, unit: 'oz' },
          { name: 'Tomatoes', amount: 2, unit: 'large' },
          { name: 'Fresh basil', amount: 0.5, unit: 'cup' },
          { name: 'Balsamic glaze', amount: 2, unit: 'tbsp' },
          { name: 'Olive oil', amount: 2, unit: 'tbsp' },
          { name: 'Salt and pepper', amount: 1, unit: 'to taste' },
        ],
        instructions: [
          'Slice ciabatta in half lengthwise',
          'Drizzle with olive oil',
          'Layer mozzarella, tomato slices, basil',
          'Season with salt and pepper',
          'Drizzle with balsamic glaze',
          'Close sandwich and slice',
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        nutrition: { calories: 520, protein: 24, carbs: 48, fat: 26, fiber: 3, sodium: 680, sugar: 8 },
        tags: ['italian', 'fresh', 'no-cook'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian'],
        isFavorite: false,
      },
      {
        name: 'Tuna Poke Bowl',
        description: 'Hawaiian-style raw tuna bowl with rice and vegetables',
        category: 'lunch',
        cuisine: 'Hawaiian',
        ingredients: [
          { name: 'Sushi-grade tuna', amount: 1, unit: 'lb' },
          { name: 'Sushi rice', amount: 2, unit: 'cups cooked' },
          { name: 'Soy sauce', amount: 3, unit: 'tbsp' },
          { name: 'Sesame oil', amount: 1, unit: 'tbsp' },
          { name: 'Cucumber', amount: 1, unit: 'cup diced' },
          { name: 'Avocado', amount: 1, unit: 'whole' },
          { name: 'Edamame', amount: 0.5, unit: 'cup' },
          { name: 'Nori strips', amount: 1, unit: 'sheet' },
          { name: 'Sesame seeds', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Cube tuna into bite-sized pieces',
          'Marinate with soy sauce and sesame oil',
          'Divide rice among bowls',
          'Top with marinated tuna',
          'Add cucumber, avocado, edamame',
          'Garnish with nori and sesame seeds',
        ],
        prepTime: 20,
        cookTime: 0,
        servings: 4,
        nutrition: { calories: 420, protein: 32, carbs: 42, fat: 14, fiber: 6, sodium: 720, sugar: 3 },
        tags: ['raw', 'omega-3', 'fresh'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      // MORE DINNER
      {
        name: 'Spaghetti Carbonara',
        description: 'Classic Roman pasta with eggs, cheese, and pancetta',
        category: 'dinner',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Spaghetti', amount: 1, unit: 'lb' },
          { name: 'Pancetta', amount: 6, unit: 'oz' },
          { name: 'Eggs', amount: 4, unit: 'whole' },
          { name: 'Pecorino Romano', amount: 1, unit: 'cup grated' },
          { name: 'Black pepper', amount: 2, unit: 'tsp' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
        ],
        instructions: [
          'Cook pasta until al dente, reserve pasta water',
          'Crisp pancetta in pan',
          'Whisk eggs with cheese and pepper',
          'Toss hot pasta with pancetta',
          'Remove from heat, add egg mixture',
          'Toss quickly, adding pasta water as needed',
          'Serve immediately with extra cheese',
        ],
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        nutrition: { calories: 580, protein: 28, carbs: 62, fat: 24, fiber: 3, sodium: 920, sugar: 2 },
        tags: ['italian', 'comfort-food', 'classic'],
        difficulty: 'medium',
        rating: 5,
        dietary: [],
        isFavorite: false,
      },
      {
        name: 'Beef Tacos',
        description: 'Seasoned ground beef tacos with all the fixings',
        category: 'dinner',
        cuisine: 'Mexican',
        ingredients: [
          { name: 'Ground beef', amount: 1, unit: 'lb' },
          { name: 'Taco seasoning', amount: 2, unit: 'tbsp' },
          { name: 'Taco shells', amount: 12, unit: 'shells' },
          { name: 'Lettuce', amount: 2, unit: 'cups shredded' },
          { name: 'Tomatoes', amount: 1, unit: 'cup diced' },
          { name: 'Cheddar cheese', amount: 1, unit: 'cup shredded' },
          { name: 'Sour cream', amount: 0.5, unit: 'cup' },
          { name: 'Salsa', amount: 0.5, unit: 'cup' },
        ],
        instructions: [
          'Brown ground beef, drain fat',
          'Add taco seasoning with water',
          'Simmer until thickened',
          'Warm taco shells',
          'Fill shells with beef',
          'Top with lettuce, tomato, cheese',
          'Serve with sour cream and salsa',
        ],
        prepTime: 15,
        cookTime: 15,
        servings: 6,
        nutrition: { calories: 380, protein: 22, carbs: 28, fat: 20, fiber: 3, sodium: 720, sugar: 4 },
        tags: ['family-friendly', 'quick', 'mexican'],
        difficulty: 'easy',
        rating: 5,
        dietary: [],
        isFavorite: false,
      },
      {
        name: 'Grilled Ribeye Steak',
        description: 'Perfectly grilled ribeye with herb butter',
        category: 'dinner',
        cuisine: 'American',
        ingredients: [
          { name: 'Ribeye steaks', amount: 2, unit: '12oz each' },
          { name: 'Butter', amount: 4, unit: 'tbsp' },
          { name: 'Fresh rosemary', amount: 2, unit: 'sprigs' },
          { name: 'Fresh thyme', amount: 4, unit: 'sprigs' },
          { name: 'Garlic', amount: 3, unit: 'cloves' },
          { name: 'Salt', amount: 1, unit: 'tbsp' },
          { name: 'Black pepper', amount: 1, unit: 'tsp' },
        ],
        instructions: [
          'Bring steaks to room temperature',
          'Season generously with salt and pepper',
          'Make herb butter: mix softened butter with minced herbs and garlic',
          'Grill over high heat 4-5 min per side for medium-rare',
          'Rest 5 minutes',
          'Top with herb butter and serve',
        ],
        prepTime: 10,
        cookTime: 12,
        servings: 2,
        nutrition: { calories: 720, protein: 52, carbs: 2, fat: 56, fiber: 0, sodium: 1200, sugar: 0 },
        tags: ['high-protein', 'keto', 'grilled'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['gluten-free', 'keto', 'paleo'],
        isFavorite: false,
      },
      {
        name: 'Shrimp Scampi',
        description: 'Garlicky shrimp in white wine butter sauce over pasta',
        category: 'dinner',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Large shrimp', amount: 1.5, unit: 'lbs' },
          { name: 'Linguine', amount: 1, unit: 'lb' },
          { name: 'Butter', amount: 4, unit: 'tbsp' },
          { name: 'Olive oil', amount: 2, unit: 'tbsp' },
          { name: 'Garlic', amount: 6, unit: 'cloves' },
          { name: 'White wine', amount: 0.5, unit: 'cup' },
          { name: 'Lemon juice', amount: 2, unit: 'tbsp' },
          { name: 'Fresh parsley', amount: 0.25, unit: 'cup' },
          { name: 'Red pepper flakes', amount: 0.25, unit: 'tsp' },
        ],
        instructions: [
          'Cook pasta, reserve 1 cup pasta water',
          'Sauté shrimp in oil until pink, remove',
          'Add butter and garlic, cook 1 minute',
          'Deglaze with wine, add lemon juice',
          'Return shrimp to pan',
          'Toss with pasta and parsley',
          'Add pasta water if needed',
        ],
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        nutrition: { calories: 520, protein: 38, carbs: 52, fat: 18, fiber: 3, sodium: 680, sugar: 2 },
        tags: ['seafood', 'quick', 'italian'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['dairy-free-option'],
        isFavorite: false,
      },
      {
        name: 'Stuffed Bell Peppers',
        description: 'Bell peppers stuffed with seasoned rice and ground beef',
        category: 'dinner',
        cuisine: 'American',
        ingredients: [
          { name: 'Bell peppers', amount: 6, unit: 'large' },
          { name: 'Ground beef', amount: 1, unit: 'lb' },
          { name: 'Cooked rice', amount: 2, unit: 'cups' },
          { name: 'Tomato sauce', amount: 1, unit: 'can' },
          { name: 'Onion', amount: 1, unit: 'medium' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
          { name: 'Italian seasoning', amount: 1, unit: 'tbsp' },
          { name: 'Mozzarella', amount: 1, unit: 'cup shredded' },
        ],
        instructions: [
          'Cut tops off peppers, remove seeds',
          'Brown beef with onion and garlic',
          'Mix beef with rice, half the tomato sauce, seasonings',
          'Stuff peppers with mixture',
          'Place in baking dish, pour remaining sauce around',
          'Bake at 375°F for 35 minutes',
          'Top with cheese, bake 5 more minutes',
        ],
        prepTime: 20,
        cookTime: 40,
        servings: 6,
        nutrition: { calories: 380, protein: 24, carbs: 32, fat: 18, fiber: 4, sodium: 580, sugar: 8 },
        tags: ['family-friendly', 'meal-prep', 'comfort-food'],
        difficulty: 'medium',
        rating: 4,
        dietary: ['gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Teriyaki Salmon',
        description: 'Glazed salmon with homemade teriyaki sauce',
        category: 'dinner',
        cuisine: 'Japanese',
        ingredients: [
          { name: 'Salmon fillets', amount: 4, unit: '6oz each' },
          { name: 'Soy sauce', amount: 0.25, unit: 'cup' },
          { name: 'Mirin', amount: 2, unit: 'tbsp' },
          { name: 'Honey', amount: 2, unit: 'tbsp' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
          { name: 'Ginger', amount: 1, unit: 'tbsp' },
          { name: 'Sesame seeds', amount: 1, unit: 'tbsp' },
          { name: 'Green onions', amount: 2, unit: 'stalks' },
        ],
        instructions: [
          'Mix soy sauce, mirin, honey, garlic, ginger for sauce',
          'Marinate salmon 15 minutes',
          'Heat broiler',
          'Broil salmon 4-5 minutes',
          'Brush with extra sauce',
          'Broil 2 more minutes until caramelized',
          'Garnish with sesame seeds and green onions',
        ],
        prepTime: 20,
        cookTime: 10,
        servings: 4,
        nutrition: { calories: 380, protein: 40, carbs: 14, fat: 18, fiber: 0, sodium: 820, sugar: 12 },
        tags: ['omega-3', 'asian', 'quick'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      {
        name: 'Mushroom Risotto',
        description: 'Creamy Italian rice with mixed mushrooms and parmesan',
        category: 'dinner',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Arborio rice', amount: 1.5, unit: 'cups' },
          { name: 'Mixed mushrooms', amount: 12, unit: 'oz' },
          { name: 'Chicken broth', amount: 6, unit: 'cups' },
          { name: 'White wine', amount: 0.5, unit: 'cup' },
          { name: 'Parmesan', amount: 1, unit: 'cup grated' },
          { name: 'Butter', amount: 3, unit: 'tbsp' },
          { name: 'Shallots', amount: 2, unit: 'medium' },
          { name: 'Fresh thyme', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Sauté mushrooms until golden, set aside',
          'Cook shallots in butter',
          'Add rice, toast 2 minutes',
          'Add wine, stir until absorbed',
          'Add warm broth one ladle at a time',
          'Stir constantly, adding broth as absorbed',
          'Fold in mushrooms, parmesan, extra butter',
        ],
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        nutrition: { calories: 480, protein: 16, carbs: 58, fat: 20, fiber: 3, sodium: 720, sugar: 4 },
        tags: ['vegetarian', 'italian', 'comfort-food'],
        difficulty: 'hard',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'BBQ Pulled Pork',
        description: 'Slow-cooked pork shoulder with homemade BBQ sauce',
        category: 'dinner',
        cuisine: 'American',
        ingredients: [
          { name: 'Pork shoulder', amount: 4, unit: 'lbs' },
          { name: 'BBQ sauce', amount: 2, unit: 'cups' },
          { name: 'Brown sugar', amount: 0.25, unit: 'cup' },
          { name: 'Paprika', amount: 2, unit: 'tbsp' },
          { name: 'Garlic powder', amount: 1, unit: 'tbsp' },
          { name: 'Onion powder', amount: 1, unit: 'tbsp' },
          { name: 'Apple cider vinegar', amount: 0.25, unit: 'cup' },
          { name: 'Brioche buns', amount: 8, unit: 'buns' },
        ],
        instructions: [
          'Mix dry rub: sugar, paprika, garlic powder, onion powder',
          'Rub all over pork',
          'Place in slow cooker with vinegar',
          'Cook on low 8-10 hours',
          'Shred pork with two forks',
          'Mix with BBQ sauce',
          'Serve on brioche buns',
        ],
        prepTime: 15,
        cookTime: 480,
        servings: 8,
        nutrition: { calories: 520, protein: 38, carbs: 42, fat: 22, fiber: 2, sodium: 920, sugar: 24 },
        tags: ['slow-cooker', 'bbq', 'comfort-food'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['dairy-free'],
        isFavorite: false,
      },
      // MORE SNACKS
      {
        name: 'Energy Balls',
        description: 'No-bake oat and nut energy bites perfect for snacking',
        category: 'snack',
        cuisine: 'American',
        ingredients: [
          { name: 'Rolled oats', amount: 1, unit: 'cup' },
          { name: 'Peanut butter', amount: 0.5, unit: 'cup' },
          { name: 'Honey', amount: 0.25, unit: 'cup' },
          { name: 'Dark chocolate chips', amount: 0.25, unit: 'cup' },
          { name: 'Chia seeds', amount: 2, unit: 'tbsp' },
          { name: 'Vanilla extract', amount: 1, unit: 'tsp' },
        ],
        instructions: [
          'Mix all ingredients in a bowl',
          'Refrigerate 30 minutes',
          'Roll into 1-inch balls',
          'Store in refrigerator up to 1 week',
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 12,
        nutrition: { calories: 120, protein: 4, carbs: 14, fat: 6, fiber: 2, sodium: 40, sugar: 8 },
        tags: ['no-bake', 'meal-prep', 'portable'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Guacamole with Chips',
        description: 'Fresh homemade guacamole with crispy tortilla chips',
        category: 'snack',
        cuisine: 'Mexican',
        ingredients: [
          { name: 'Avocados', amount: 3, unit: 'ripe' },
          { name: 'Lime juice', amount: 2, unit: 'tbsp' },
          { name: 'Red onion', amount: 0.25, unit: 'cup diced' },
          { name: 'Tomato', amount: 1, unit: 'medium diced' },
          { name: 'Cilantro', amount: 0.25, unit: 'cup' },
          { name: 'Jalapeño', amount: 1, unit: 'small', optional: true },
          { name: 'Tortilla chips', amount: 6, unit: 'oz' },
        ],
        instructions: [
          'Mash avocados to desired consistency',
          'Add lime juice immediately',
          'Fold in onion, tomato, cilantro',
          'Add diced jalapeño if using',
          'Season with salt',
          'Serve with tortilla chips',
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 6,
        nutrition: { calories: 280, protein: 4, carbs: 28, fat: 18, fiber: 8, sodium: 180, sugar: 2 },
        tags: ['vegan', 'fresh', 'party-food'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Caprese Skewers',
        description: 'Mini skewers of mozzarella, tomato, and basil',
        category: 'snack',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Mozzarella balls', amount: 20, unit: 'mini' },
          { name: 'Cherry tomatoes', amount: 20, unit: 'pieces' },
          { name: 'Fresh basil', amount: 20, unit: 'leaves' },
          { name: 'Balsamic glaze', amount: 2, unit: 'tbsp' },
          { name: 'Olive oil', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Thread on toothpicks: tomato, basil, mozzarella',
          'Arrange on platter',
          'Drizzle with olive oil and balsamic glaze',
          'Season with salt and pepper',
        ],
        prepTime: 15,
        cookTime: 0,
        servings: 10,
        nutrition: { calories: 80, protein: 5, carbs: 4, fat: 6, fiber: 0, sodium: 120, sugar: 3 },
        tags: ['appetizer', 'party-food', 'quick'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Banana Nice Cream',
        description: 'Healthy frozen banana ice cream with no dairy',
        category: 'snack',
        cuisine: 'American',
        ingredients: [
          { name: 'Frozen bananas', amount: 4, unit: 'whole' },
          { name: 'Cocoa powder', amount: 2, unit: 'tbsp', optional: true },
          { name: 'Almond milk', amount: 2, unit: 'tbsp' },
          { name: 'Vanilla extract', amount: 0.5, unit: 'tsp' },
          { name: 'Toppings of choice', amount: 1, unit: 'as desired' },
        ],
        instructions: [
          'Slice bananas and freeze overnight',
          'Blend frozen bananas in food processor',
          'Add milk if needed for blending',
          'Add cocoa powder if making chocolate flavor',
          'Serve immediately or freeze 30 minutes for firmer texture',
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 2,
        nutrition: { calories: 180, protein: 2, carbs: 46, fat: 1, fiber: 5, sodium: 5, sugar: 28 },
        tags: ['vegan', 'healthy', 'no-added-sugar'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      // MORE DESSERTS
      {
        name: 'Classic Brownies',
        description: 'Rich, fudgy chocolate brownies with a crackly top',
        category: 'dessert',
        cuisine: 'American',
        ingredients: [
          { name: 'Butter', amount: 1, unit: 'cup' },
          { name: 'Sugar', amount: 2, unit: 'cups' },
          { name: 'Cocoa powder', amount: 0.75, unit: 'cup' },
          { name: 'Eggs', amount: 4, unit: 'whole' },
          { name: 'Vanilla extract', amount: 1, unit: 'tsp' },
          { name: 'All-purpose flour', amount: 1, unit: 'cup' },
          { name: 'Chocolate chips', amount: 1, unit: 'cup', optional: true },
        ],
        instructions: [
          'Preheat oven to 350°F',
          'Melt butter, mix with sugar and cocoa',
          'Add eggs one at a time',
          'Stir in vanilla and flour',
          'Fold in chocolate chips if using',
          'Spread in greased 9x13 pan',
          'Bake 25-30 minutes',
        ],
        prepTime: 15,
        cookTime: 30,
        servings: 16,
        nutrition: { calories: 240, protein: 3, carbs: 32, fat: 12, fiber: 2, sodium: 80, sugar: 24 },
        tags: ['chocolate', 'classic', 'baking'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian'],
        isFavorite: false,
      },
      {
        name: 'Fruit Tart',
        description: 'Buttery tart shell with pastry cream and fresh fruit',
        category: 'dessert',
        cuisine: 'French',
        ingredients: [
          { name: 'Pre-made tart shell', amount: 1, unit: '9-inch' },
          { name: 'Milk', amount: 2, unit: 'cups' },
          { name: 'Egg yolks', amount: 4, unit: 'whole' },
          { name: 'Sugar', amount: 0.5, unit: 'cup' },
          { name: 'Cornstarch', amount: 0.25, unit: 'cup' },
          { name: 'Vanilla extract', amount: 1, unit: 'tsp' },
          { name: 'Assorted fresh fruit', amount: 3, unit: 'cups' },
        ],
        instructions: [
          'Bake tart shell according to package',
          'Heat milk in saucepan',
          'Whisk yolks, sugar, cornstarch',
          'Temper eggs with hot milk',
          'Cook until thick, stirring constantly',
          'Add vanilla, cool completely',
          'Fill shell with cream, top with fruit',
        ],
        prepTime: 30,
        cookTime: 20,
        servings: 8,
        nutrition: { calories: 280, protein: 5, carbs: 42, fat: 10, fiber: 2, sodium: 120, sugar: 28 },
        tags: ['elegant', 'fresh', 'french'],
        difficulty: 'hard',
        rating: 5,
        dietary: ['vegetarian'],
        isFavorite: false,
      },
      {
        name: 'Panna Cotta',
        description: 'Silky Italian cream dessert with berry compote',
        category: 'dessert',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Heavy cream', amount: 2, unit: 'cups' },
          { name: 'Sugar', amount: 0.5, unit: 'cup' },
          { name: 'Vanilla bean', amount: 1, unit: 'whole' },
          { name: 'Gelatin', amount: 2, unit: 'tsp' },
          { name: 'Mixed berries', amount: 2, unit: 'cups' },
          { name: 'Lemon zest', amount: 1, unit: 'tsp' },
        ],
        instructions: [
          'Bloom gelatin in cold water',
          'Heat cream with sugar and vanilla',
          'Remove from heat, add gelatin',
          'Pour into molds, refrigerate 4 hours',
          'Make compote: cook berries with sugar and lemon',
          'Unmold panna cotta, top with compote',
        ],
        prepTime: 15,
        cookTime: 10,
        servings: 6,
        nutrition: { calories: 320, protein: 3, carbs: 28, fat: 22, fiber: 2, sodium: 40, sugar: 24 },
        tags: ['elegant', 'make-ahead', 'italian'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Apple Crisp',
        description: 'Warm spiced apples with crunchy oat topping',
        category: 'dessert',
        cuisine: 'American',
        ingredients: [
          { name: 'Apples', amount: 6, unit: 'large' },
          { name: 'Brown sugar', amount: 0.75, unit: 'cup' },
          { name: 'Rolled oats', amount: 1, unit: 'cup' },
          { name: 'Flour', amount: 0.5, unit: 'cup' },
          { name: 'Butter', amount: 0.5, unit: 'cup' },
          { name: 'Cinnamon', amount: 2, unit: 'tsp' },
          { name: 'Nutmeg', amount: 0.25, unit: 'tsp' },
        ],
        instructions: [
          'Preheat oven to 375°F',
          'Slice apples, toss with some sugar and spices',
          'Place in baking dish',
          'Mix oats, flour, remaining sugar, spices, butter',
          'Crumble topping over apples',
          'Bake 40-45 minutes until golden',
          'Serve warm with ice cream',
        ],
        prepTime: 20,
        cookTime: 45,
        servings: 8,
        nutrition: { calories: 280, protein: 3, carbs: 48, fat: 10, fiber: 4, sodium: 60, sugar: 32 },
        tags: ['fall', 'comfort-food', 'warm'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian'],
        isFavorite: false,
      },
      // BEVERAGES
      {
        name: 'Green Smoothie',
        description: 'Nutrient-packed smoothie with spinach, banana, and berries',
        category: 'beverage',
        cuisine: 'American',
        ingredients: [
          { name: 'Spinach', amount: 2, unit: 'cups' },
          { name: 'Banana', amount: 1, unit: 'frozen' },
          { name: 'Mixed berries', amount: 1, unit: 'cup' },
          { name: 'Almond milk', amount: 1.5, unit: 'cups' },
          { name: 'Protein powder', amount: 1, unit: 'scoop', optional: true },
          { name: 'Chia seeds', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Add milk to blender first',
          'Add spinach and blend until smooth',
          'Add remaining ingredients',
          'Blend until creamy',
          'Add more milk if too thick',
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 2,
        nutrition: { calories: 180, protein: 6, carbs: 38, fat: 3, fiber: 6, sodium: 120, sugar: 22 },
        tags: ['healthy', 'quick', 'breakfast'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      {
        name: 'Iced Matcha Latte',
        description: 'Creamy iced green tea latte with subtle sweetness',
        category: 'beverage',
        cuisine: 'Japanese',
        ingredients: [
          { name: 'Matcha powder', amount: 2, unit: 'tsp' },
          { name: 'Hot water', amount: 2, unit: 'tbsp' },
          { name: 'Oat milk', amount: 1, unit: 'cup' },
          { name: 'Maple syrup', amount: 1, unit: 'tbsp' },
          { name: 'Ice', amount: 1, unit: 'cup' },
        ],
        instructions: [
          'Sift matcha into a bowl',
          'Add hot water, whisk until smooth',
          'Fill glass with ice',
          'Add milk and maple syrup',
          'Pour matcha over',
          'Stir and enjoy',
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        nutrition: { calories: 120, protein: 2, carbs: 22, fat: 3, fiber: 1, sodium: 80, sugar: 14 },
        tags: ['caffeine', 'antioxidant', 'trendy'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      // SIDE DISHES
      {
        name: 'Roasted Garlic Mashed Potatoes',
        description: 'Creamy mashed potatoes with roasted garlic',
        category: 'side',
        cuisine: 'American',
        ingredients: [
          { name: 'Russet potatoes', amount: 3, unit: 'lbs' },
          { name: 'Garlic head', amount: 1, unit: 'whole' },
          { name: 'Butter', amount: 0.5, unit: 'cup' },
          { name: 'Heavy cream', amount: 0.5, unit: 'cup' },
          { name: 'Salt', amount: 1, unit: 'tsp' },
          { name: 'Chives', amount: 2, unit: 'tbsp' },
        ],
        instructions: [
          'Roast garlic head at 400°F for 40 minutes',
          'Boil potatoes until tender',
          'Squeeze roasted garlic from skins',
          'Mash potatoes with butter, cream, garlic',
          'Season with salt',
          'Top with chives',
        ],
        prepTime: 15,
        cookTime: 40,
        servings: 8,
        nutrition: { calories: 240, protein: 4, carbs: 32, fat: 12, fiber: 3, sodium: 320, sugar: 2 },
        tags: ['comfort-food', 'side-dish', 'holiday'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Roasted Brussels Sprouts',
        description: 'Crispy roasted sprouts with balsamic glaze',
        category: 'side',
        cuisine: 'American',
        ingredients: [
          { name: 'Brussels sprouts', amount: 1.5, unit: 'lbs' },
          { name: 'Olive oil', amount: 3, unit: 'tbsp' },
          { name: 'Balsamic vinegar', amount: 2, unit: 'tbsp' },
          { name: 'Honey', amount: 1, unit: 'tbsp' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
          { name: 'Parmesan', amount: 0.25, unit: 'cup' },
        ],
        instructions: [
          'Preheat oven to 425°F',
          'Halve Brussels sprouts',
          'Toss with oil, garlic, salt, pepper',
          'Roast 20-25 minutes until crispy',
          'Mix balsamic with honey',
          'Drizzle over sprouts, top with parmesan',
        ],
        prepTime: 10,
        cookTime: 25,
        servings: 6,
        nutrition: { calories: 140, protein: 6, carbs: 14, fat: 8, fiber: 4, sodium: 180, sugar: 6 },
        tags: ['vegetarian', 'healthy', 'crispy'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Cilantro Lime Rice',
        description: 'Fluffy rice with fresh cilantro and lime',
        category: 'side',
        cuisine: 'Mexican',
        ingredients: [
          { name: 'Long grain rice', amount: 2, unit: 'cups' },
          { name: 'Chicken broth', amount: 3.5, unit: 'cups' },
          { name: 'Fresh cilantro', amount: 0.5, unit: 'cup' },
          { name: 'Lime juice', amount: 3, unit: 'tbsp' },
          { name: 'Lime zest', amount: 1, unit: 'tbsp' },
          { name: 'Butter', amount: 2, unit: 'tbsp' },
        ],
        instructions: [
          'Toast rice in butter',
          'Add broth, bring to boil',
          'Reduce heat, cover, simmer 18 minutes',
          'Rest 5 minutes',
          'Fluff with fork',
          'Fold in cilantro, lime juice, and zest',
        ],
        prepTime: 5,
        cookTime: 25,
        servings: 8,
        nutrition: { calories: 180, protein: 4, carbs: 36, fat: 3, fiber: 1, sodium: 180, sugar: 0 },
        tags: ['mexican', 'fresh', 'quick'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      // SAUCES
      {
        name: 'Classic Marinara',
        description: 'Simple Italian tomato sauce with garlic and basil',
        category: 'sauce',
        cuisine: 'Italian',
        ingredients: [
          { name: 'San Marzano tomatoes', amount: 2, unit: 'cans' },
          { name: 'Garlic', amount: 4, unit: 'cloves' },
          { name: 'Olive oil', amount: 0.25, unit: 'cup' },
          { name: 'Fresh basil', amount: 0.5, unit: 'cup' },
          { name: 'Salt', amount: 1, unit: 'tsp' },
          { name: 'Red pepper flakes', amount: 0.25, unit: 'tsp' },
        ],
        instructions: [
          'Sauté garlic in olive oil until fragrant',
          'Add crushed tomatoes',
          'Season with salt and pepper flakes',
          'Simmer 20 minutes',
          'Add fresh basil',
          'Blend if desired for smoother sauce',
        ],
        prepTime: 5,
        cookTime: 25,
        servings: 8,
        nutrition: { calories: 80, protein: 1, carbs: 8, fat: 5, fiber: 2, sodium: 380, sugar: 5 },
        tags: ['italian', 'basic', 'versatile'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
        isFavorite: false,
      },
      {
        name: 'Pesto',
        description: 'Classic Genovese basil pesto',
        category: 'sauce',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Fresh basil', amount: 2, unit: 'cups packed' },
          { name: 'Pine nuts', amount: 0.25, unit: 'cup' },
          { name: 'Parmesan', amount: 0.5, unit: 'cup' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
          { name: 'Olive oil', amount: 0.5, unit: 'cup' },
          { name: 'Lemon juice', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Toast pine nuts lightly',
          'Blend basil, pine nuts, garlic',
          'Add parmesan, pulse',
          'Drizzle in olive oil while blending',
          'Add lemon juice',
          'Season with salt and pepper',
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 8,
        nutrition: { calories: 160, protein: 4, carbs: 2, fat: 16, fiber: 0, sodium: 140, sugar: 0 },
        tags: ['italian', 'fresh', 'no-cook'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      // MORE APPETIZERS
      {
        name: 'Bruschetta',
        description: 'Toasted bread topped with fresh tomato and basil',
        category: 'appetizer',
        cuisine: 'Italian',
        ingredients: [
          { name: 'Baguette', amount: 1, unit: 'loaf' },
          { name: 'Tomatoes', amount: 4, unit: 'medium' },
          { name: 'Fresh basil', amount: 0.25, unit: 'cup' },
          { name: 'Garlic', amount: 3, unit: 'cloves' },
          { name: 'Olive oil', amount: 3, unit: 'tbsp' },
          { name: 'Balsamic vinegar', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Slice baguette, brush with oil',
          'Toast until golden',
          'Rub with garlic clove',
          'Dice tomatoes, mix with basil, oil, vinegar',
          'Top bread with tomato mixture',
          'Serve immediately',
        ],
        prepTime: 15,
        cookTime: 5,
        servings: 8,
        nutrition: { calories: 120, protein: 3, carbs: 18, fat: 4, fiber: 2, sodium: 180, sugar: 3 },
        tags: ['italian', 'fresh', 'party-food'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'vegan', 'dairy-free'],
        isFavorite: false,
      },
      {
        name: 'Spinach Artichoke Dip',
        description: 'Creamy warm dip with spinach and artichoke hearts',
        category: 'appetizer',
        cuisine: 'American',
        ingredients: [
          { name: 'Spinach', amount: 10, unit: 'oz frozen' },
          { name: 'Artichoke hearts', amount: 14, unit: 'oz can' },
          { name: 'Cream cheese', amount: 8, unit: 'oz' },
          { name: 'Sour cream', amount: 0.5, unit: 'cup' },
          { name: 'Parmesan', amount: 0.5, unit: 'cup' },
          { name: 'Mozzarella', amount: 0.5, unit: 'cup' },
          { name: 'Garlic', amount: 2, unit: 'cloves' },
        ],
        instructions: [
          'Thaw and squeeze spinach dry',
          'Chop artichoke hearts',
          'Mix cream cheese, sour cream, garlic',
          'Fold in spinach, artichokes, half the cheese',
          'Transfer to baking dish',
          'Top with remaining cheese',
          'Bake at 350°F for 25 minutes',
        ],
        prepTime: 15,
        cookTime: 25,
        servings: 12,
        nutrition: { calories: 140, protein: 6, carbs: 6, fat: 11, fiber: 2, sodium: 320, sugar: 1 },
        tags: ['party-food', 'comfort-food', 'cheesy'],
        difficulty: 'easy',
        rating: 5,
        dietary: ['vegetarian', 'gluten-free'],
        isFavorite: false,
      },
      // FINAL RECIPES TO REACH 50
      {
        name: 'Korean Bibimbap',
        description: 'Korean rice bowl with vegetables, meat, and gochujang',
        category: 'dinner',
        cuisine: 'Korean',
        ingredients: [
          { name: 'Rice', amount: 2, unit: 'cups cooked' },
          { name: 'Ground beef', amount: 0.5, unit: 'lb' },
          { name: 'Spinach', amount: 2, unit: 'cups' },
          { name: 'Carrots', amount: 1, unit: 'cup julienned' },
          { name: 'Zucchini', amount: 1, unit: 'cup' },
          { name: 'Egg', amount: 1, unit: 'fried' },
          { name: 'Gochujang', amount: 2, unit: 'tbsp' },
          { name: 'Sesame oil', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
          'Cook rice',
          'Sauté each vegetable separately with sesame oil',
          'Brown beef with soy sauce',
          'Fry eggs sunny-side up',
          'Arrange rice in bowl',
          'Top with vegetables, beef, egg',
          'Serve with gochujang on side',
        ],
        prepTime: 20,
        cookTime: 30,
        servings: 2,
        nutrition: { calories: 520, protein: 28, carbs: 62, fat: 18, fiber: 5, sodium: 720, sugar: 6 },
        tags: ['korean', 'colorful', 'balanced'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['gluten-free'],
        isFavorite: false,
      },
      {
        name: 'Pad Thai',
        description: 'Classic Thai stir-fried rice noodles with shrimp',
        category: 'dinner',
        cuisine: 'Thai',
        ingredients: [
          { name: 'Rice noodles', amount: 8, unit: 'oz' },
          { name: 'Shrimp', amount: 1, unit: 'lb' },
          { name: 'Eggs', amount: 2, unit: 'whole' },
          { name: 'Bean sprouts', amount: 1, unit: 'cup' },
          { name: 'Green onions', amount: 0.5, unit: 'cup' },
          { name: 'Peanuts', amount: 0.25, unit: 'cup' },
          { name: 'Fish sauce', amount: 3, unit: 'tbsp' },
          { name: 'Tamarind paste', amount: 2, unit: 'tbsp' },
          { name: 'Brown sugar', amount: 2, unit: 'tbsp' },
        ],
        instructions: [
          'Soak noodles in warm water',
          'Mix fish sauce, tamarind, sugar for sauce',
          'Scramble eggs, set aside',
          'Stir fry shrimp until pink',
          'Add noodles and sauce',
          'Add eggs, bean sprouts, green onions',
          'Top with peanuts and lime',
        ],
        prepTime: 20,
        cookTime: 15,
        servings: 4,
        nutrition: { calories: 420, protein: 24, carbs: 52, fat: 14, fiber: 3, sodium: 920, sugar: 12 },
        tags: ['thai', 'classic', 'wok'],
        difficulty: 'medium',
        rating: 5,
        dietary: ['gluten-free', 'dairy-free'],
        isFavorite: false,
      },
    ];

    for (const recipe of recipes) {
      await this.addRecipe(recipe);
    }
  }

  // Delete methods
  async deleteRecipe(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('recipes', id);
  }

  async deletePantryItem(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('pantry', id);
  }

  async deleteGroceryItem(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('groceryList', id);
  }

  async deleteMealLog(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('mealLogs', id);
  }

  // Update methods
  async updateRecipe(recipe: Recipe): Promise<void> {
    const db = await this.getDB();
    await db.put('recipes', recipe);
  }

  async updatePantryItem(item: PantryItem): Promise<void> {
    const db = await this.getDB();
    await db.put('pantry', item);
  }

  async updateGroceryItem(item: GroceryItem): Promise<void> {
    const db = await this.getDB();
    await db.put('groceryList', item);
  }

  // Get single item
  async getRecipe(id: string): Promise<Recipe | undefined> {
    const db = await this.getDB();
    return db.get('recipes', id);
  }

  async getPantryItem(id: string): Promise<PantryItem | undefined> {
    const db = await this.getDB();
    return db.get('pantry', id);
  }
}

export const foodManagementService = new FoodManagementService();
export default foodManagementService;
