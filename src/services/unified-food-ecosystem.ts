/**
 * UNIFIED FOOD & NUTRITION ECOSYSTEM
 *
 * A comprehensive food management system designed for chronic illness:
 * - Meal planning with energy/spoon awareness
 * - Pantry management with expiration tracking
 * - Medication-food interaction warnings
 * - Dietary restriction management
 * - Hydration tracking (critical for chronic illness)
 * - Easy meal suggestions for low-energy days
 * - Caregiver meal prep coordination
 *
 * Cross-system connections:
 * - Health: Nutrition affects symptoms, medication interactions
 * - Finance: Food budget management
 * - Smart Home: Kitchen timers, appliance control
 * - Relationships: Caregiver meal coordination
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage' | 'side';
  cuisine?: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  spoonCost: number; // 1-5 energy cost to prepare
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    optional?: boolean;
    substitutes?: string[];
    inPantry?: boolean;
  }>;
  instructions: Array<{
    step: number;
    instruction: string;
    duration?: number;
    timer?: boolean;
    tips?: string;
  }>;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
    sugar?: number;
  };
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    lowSodium: boolean;
    lowSugar: boolean;
    kidneyFriendly: boolean;
    heartHealthy: boolean;
    diabeticFriendly: boolean;
    antiInflammatory: boolean;
  };
  medicationInteractions?: Array<{
    medication: string;
    interaction: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  symptomTriggers?: string[];
  symptomHelpers?: string[];
  batchCookable: boolean;
  freezable: boolean;
  makeAhead: boolean;
  onePot: boolean;
  noStove: boolean;
  images: string[];
  rating?: number;
  timesCooked: number;
  lastCooked?: Date;
  notes: string;
  sourceUrl?: string;
  tags: string[];
  caregiverNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PantryItem {
  id: string;
  name: string;
  category: 'produce' | 'dairy' | 'meat' | 'grains' | 'canned' | 'frozen' | 'spices' | 'condiments' | 'beverages' | 'snacks' | 'other';
  quantity: number;
  unit: string;
  location: 'pantry' | 'fridge' | 'freezer' | 'counter' | 'other';
  purchaseDate?: Date;
  expirationDate?: Date;
  openedDate?: Date;
  daysAfterOpening?: number;
  brand?: string;
  cost?: number;
  reorderLevel?: number;
  autoReorder: boolean;
  storePreference?: string;
  notes?: string;
  dietary?: {
    organic: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  linkedRecipes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlan {
  id: string;
  date: Date;
  meals: {
    breakfast?: { recipeId?: string; description: string; prepared: boolean };
    lunch?: { recipeId?: string; description: string; prepared: boolean };
    dinner?: { recipeId?: string; description: string; prepared: boolean };
    snacks: Array<{ recipeId?: string; description: string; time?: string; prepared: boolean }>;
  };
  waterGoal: number; // ounces
  waterConsumed: number;
  totalCalories?: number;
  energyLevel?: number;
  preparedBy?: 'self' | 'caregiver' | 'partner' | 'delivery';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterLog {
  id: string;
  timestamp: Date;
  amount: number; // ounces
  type: 'water' | 'tea' | 'coffee' | 'juice' | 'sports_drink' | 'other';
  withMedication: boolean;
  notes?: string;
}

export interface GroceryList {
  id: string;
  name: string;
  store?: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    aisle?: string;
    brand?: string;
    estimatedPrice?: number;
    purchased: boolean;
    linkedPantryItemId?: string;
    notes?: string;
  }>;
  totalEstimate: number;
  actualTotal?: number;
  status: 'draft' | 'active' | 'shopping' | 'completed';
  shoppingDate?: Date;
  assignedTo?: string;
  shared: boolean;
  sharedWith: string[];
  energyRequired: number;
  deliveryOption: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodLog {
  id: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  description: string;
  portions: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mood?: 'good' | 'neutral' | 'bad';
  symptoms?: string[];
  bloodSugarBefore?: number;
  bloodSugarAfter?: number;
  preparedBy?: string;
  photo?: string;
  notes?: string;
  createdAt: Date;
}

export interface DietaryProfile {
  allergies: string[];
  intolerances: string[];
  restrictions: string[];
  preferences: string[];
  avoidDueToMedication: string[];
  symptomTriggerFoods: Array<{
    food: string;
    symptom: string;
    severity: number;
  }>;
  helpfulFoods: Array<{
    food: string;
    benefit: string;
  }>;
  dailyCalorieGoal?: number;
  dailyProteinGoal?: number;
  dailyWaterGoal: number;
  mealTimings?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string[];
  };
  caregiverInstructions: string;
}

export interface MealPrepBatch {
  id: string;
  name: string;
  prepDate: Date;
  recipes: Array<{
    recipeId: string;
    servingsPrepped: number;
    portionsRemaining: number;
    storageLocation: 'fridge' | 'freezer';
    useByDate: Date;
  }>;
  preparedBy: string;
  totalTime: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// UNIFIED FOOD ECOSYSTEM CLASS
// ============================================================================

class UnifiedFoodEcosystem {
  private static instance: UnifiedFoodEcosystem;
  private recipes: Map<string, Recipe> = new Map();
  private pantry: Map<string, PantryItem> = new Map();
  private mealPlans: Map<string, MealPlan> = new Map();
  private waterLogs: WaterLog[] = [];
  private groceryLists: Map<string, GroceryList> = new Map();
  private foodLogs: FoodLog[] = [];
  private mealPrepBatches: Map<string, MealPrepBatch> = new Map();
  private dietaryProfile: DietaryProfile = {
    allergies: [],
    intolerances: [],
    restrictions: [],
    preferences: [],
    avoidDueToMedication: [],
    symptomTriggerFoods: [],
    helpfulFoods: [],
    dailyWaterGoal: 64, // 64 oz default
    caregiverInstructions: ''
  };

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
    this.startHydrationReminders();
    this.checkExpirations();
  }

  static getInstance(): UnifiedFoodEcosystem {
    if (!UnifiedFoodEcosystem.instance) {
      UnifiedFoodEcosystem.instance = new UnifiedFoodEcosystem();
    }
    return UnifiedFoodEcosystem.instance;
  }

  private initializeEventListeners(): void {
    // Health integration - medication affects food choices
    eventBus.on('health:medication:taken', (data: any) => {
      this.checkMedicationFoodInteractions(data.name);
    });

    eventBus.on('health:medication:due', (data: any) => {
      // Remind about water for medication
      eventBus.emit('notification:send', {
        type: 'hydration',
        title: 'Medication Time',
        message: `Remember to take ${data.medicationName} with water`
      });
    });

    // Spoon/energy integration
    eventBus.on('health:energy:low', () => {
      this.suggestLowSpoonMeals();
    });

    eventBus.on('health:spoons:changed', (data: any) => {
      console.log(`[Food] Energy level: ${data.current}. Adjusting meal suggestions.`);
    });

    // Symptom tracking integration
    eventBus.on('health:symptom:logged', (data: any) => {
      this.correlateSymptomWithFood(data);
    });

    // Finance integration
    eventBus.on('finance:budget:food', (data: any) => {
      console.log(`[Food] Budget updated: $${data.amount}`);
    });

    // Smart home integration
    eventBus.on('smarthome:appliance:ready', (data: any) => {
      if (data.type === 'oven' || data.type === 'timer') {
        console.log(`[Food] ${data.name} is ready`);
      }
    });

    // Caregiver coordination
    eventBus.on('relationships:caregiver:visit', (data: any) => {
      this.prepareCaregiverMealInfo(data.caregiverId);
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('unified_food_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.recipes) data.recipes.forEach((r: Recipe) => this.recipes.set(r.id, r));
        if (data.pantry) data.pantry.forEach((p: PantryItem) => this.pantry.set(p.id, p));
        if (data.mealPlans) data.mealPlans.forEach((m: MealPlan) => this.mealPlans.set(m.id, m));
        if (data.waterLogs) this.waterLogs = data.waterLogs;
        if (data.groceryLists) data.groceryLists.forEach((g: GroceryList) => this.groceryLists.set(g.id, g));
        if (data.foodLogs) this.foodLogs = data.foodLogs;
        if (data.mealPrepBatches) data.mealPrepBatches.forEach((b: MealPrepBatch) => this.mealPrepBatches.set(b.id, b));
        if (data.dietaryProfile) this.dietaryProfile = data.dietaryProfile;
      }
    } catch (error) {
      console.error('[Food] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        recipes: Array.from(this.recipes.values()),
        pantry: Array.from(this.pantry.values()),
        mealPlans: Array.from(this.mealPlans.values()),
        waterLogs: this.waterLogs.slice(-1000),
        groceryLists: Array.from(this.groceryLists.values()),
        foodLogs: this.foodLogs.slice(-500),
        mealPrepBatches: Array.from(this.mealPrepBatches.values()),
        dietaryProfile: this.dietaryProfile
      };
      localStorage.setItem('unified_food_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[Food] Failed to save to storage:', error);
    }
  }

  private startHydrationReminders(): void {
    // Check hydration every hour
    setInterval(() => {
      this.checkHydration();
    }, 60 * 60 * 1000);
  }

  // ============================================================================
  // DIETARY PROFILE
  // ============================================================================

  updateDietaryProfile(updates: Partial<DietaryProfile>): DietaryProfile {
    Object.assign(this.dietaryProfile, updates);
    this.saveToStorage();
    eventBus.emit('food:dietary:updated', this.dietaryProfile);
    return this.dietaryProfile;
  }

  getDietaryProfile(): DietaryProfile {
    return { ...this.dietaryProfile };
  }

  addMedicationFoodRestriction(medication: string, foods: string[], reason: string): void {
    this.dietaryProfile.avoidDueToMedication.push(...foods);
    this.saveToStorage();

    eventBus.emit('notification:send', {
      type: 'medical',
      title: 'Food-Medication Interaction',
      message: `Avoid ${foods.join(', ')} while taking ${medication}: ${reason}`
    });
  }

  // ============================================================================
  // RECIPE MANAGEMENT
  // ============================================================================

  async addRecipe(recipe: Omit<Recipe, 'id' | 'timesCooked' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timesCooked: 0,
      totalTime: recipe.prepTime + recipe.cookTime,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.recipes.set(newRecipe.id, newRecipe);
    this.saveToStorage();

    eventBus.emit('food:recipe:added', newRecipe);
    return newRecipe;
  }

  async updateRecipe(recipeId: string, updates: Partial<Recipe>): Promise<Recipe | null> {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) return null;

    Object.assign(recipe, updates, { updatedAt: new Date() });
    this.recipes.set(recipeId, recipe);
    this.saveToStorage();

    return recipe;
  }

  async cookRecipe(recipeId: string): Promise<Recipe | null> {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) return null;

    recipe.timesCooked++;
    recipe.lastCooked = new Date();
    recipe.updatedAt = new Date();
    this.recipes.set(recipeId, recipe);

    // Update pantry quantities
    for (const ingredient of recipe.ingredients) {
      const pantryItem = Array.from(this.pantry.values()).find(
        p => p.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      if (pantryItem) {
        pantryItem.quantity -= ingredient.amount;
        if (pantryItem.quantity <= 0) {
          eventBus.emit('food:pantry:low', pantryItem);
        }
        this.pantry.set(pantryItem.id, pantryItem);
      }
    }

    // Track spoon cost
    eventBus.emit('health:spoons:used', {
      amount: recipe.spoonCost,
      activity: 'cooking',
      linkedId: recipeId
    });

    this.saveToStorage();
    return recipe;
  }

  getRecipe(recipeId: string): Recipe | undefined {
    return this.recipes.get(recipeId);
  }

  getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  getSafeRecipes(): Recipe[] {
    // Filter recipes based on dietary restrictions, allergies, and medication interactions
    return Array.from(this.recipes.values()).filter(recipe => {
      // Check allergies
      for (const allergy of this.dietaryProfile.allergies) {
        if (recipe.ingredients.some(i => i.name.toLowerCase().includes(allergy.toLowerCase()))) {
          return false;
        }
      }

      // Check medication interactions
      if (recipe.medicationInteractions?.some(i => i.severity === 'high')) {
        return false;
      }

      // Check symptom triggers
      if (recipe.symptomTriggers?.some(t => this.dietaryProfile.symptomTriggerFoods.some(s => s.food === t))) {
        return false;
      }

      return true;
    });
  }

  getLowSpoonRecipes(maxSpoons: number = 2): Recipe[] {
    return this.getSafeRecipes()
      .filter(r => r.spoonCost <= maxSpoons)
      .sort((a, b) => a.spoonCost - b.spoonCost);
  }

  getQuickRecipes(maxMinutes: number = 30): Recipe[] {
    return this.getSafeRecipes()
      .filter(r => r.totalTime <= maxMinutes)
      .sort((a, b) => a.totalTime - b.totalTime);
  }

  getMakeAheadRecipes(): Recipe[] {
    return this.getSafeRecipes().filter(r => r.makeAhead || r.freezable || r.batchCookable);
  }

  getRecipesWithPantryIngredients(): Recipe[] {
    const pantryItems = Array.from(this.pantry.values()).map(p => p.name.toLowerCase());

    return this.getSafeRecipes()
      .map(recipe => {
        const availableCount = recipe.ingredients.filter(i =>
          i.optional || pantryItems.includes(i.name.toLowerCase())
        ).length;
        return { recipe, availableCount, total: recipe.ingredients.length };
      })
      .filter(r => r.availableCount >= r.total * 0.7) // At least 70% of ingredients
      .sort((a, b) => b.availableCount - a.availableCount)
      .map(r => r.recipe);
  }

  // ============================================================================
  // PANTRY MANAGEMENT
  // ============================================================================

  async addPantryItem(item: Omit<PantryItem, 'id' | 'linkedRecipes' | 'createdAt' | 'updatedAt'>): Promise<PantryItem> {
    const newItem: PantryItem = {
      ...item,
      id: `pantry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      linkedRecipes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pantry.set(newItem.id, newItem);

    // Link to recipes that use this ingredient
    for (const recipe of this.recipes.values()) {
      if (recipe.ingredients.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
        newItem.linkedRecipes.push(recipe.id);
      }
    }

    // Track purchase cost
    if (item.cost) {
      eventBus.emit('finance:expense', {
        amount: item.cost,
        category: 'groceries',
        description: item.name,
        linkedId: newItem.id
      });
    }

    this.saveToStorage();
    eventBus.emit('food:pantry:added', newItem);
    return newItem;
  }

  async updatePantryItem(itemId: string, updates: Partial<PantryItem>): Promise<PantryItem | null> {
    const item = this.pantry.get(itemId);
    if (!item) return null;

    Object.assign(item, updates, { updatedAt: new Date() });
    this.pantry.set(itemId, item);
    this.saveToStorage();

    return item;
  }

  async usePantryItem(itemId: string, amount: number): Promise<PantryItem | null> {
    const item = this.pantry.get(itemId);
    if (!item) return null;

    item.quantity -= amount;
    item.updatedAt = new Date();

    if (item.quantity <= 0) {
      this.pantry.delete(itemId);
      eventBus.emit('food:pantry:empty', item);
    } else if (item.reorderLevel && item.quantity <= item.reorderLevel) {
      eventBus.emit('food:pantry:low', item);

      if (item.autoReorder) {
        this.addToGroceryList(item.name, item.reorderLevel * 2, item.unit);
      }
    }

    this.pantry.set(itemId, item);
    this.saveToStorage();

    return item;
  }

  getPantryItem(itemId: string): PantryItem | undefined {
    return this.pantry.get(itemId);
  }

  getAllPantryItems(): PantryItem[] {
    return Array.from(this.pantry.values());
  }

  getExpiringItems(withinDays: number = 7): PantryItem[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + withinDays);

    return Array.from(this.pantry.values())
      .filter(item => item.expirationDate && new Date(item.expirationDate) <= cutoff)
      .sort((a, b) => new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime());
  }

  getLowStockItems(): PantryItem[] {
    return Array.from(this.pantry.values())
      .filter(item => item.reorderLevel && item.quantity <= item.reorderLevel);
  }

  private checkExpirations(): void {
    const expiring = this.getExpiringItems(3);
    if (expiring.length > 0) {
      eventBus.emit('notification:send', {
        type: 'food',
        title: 'Expiring Food',
        message: `${expiring.length} item(s) expiring soon: ${expiring.map(i => i.name).join(', ')}`
      });
    }
  }

  // ============================================================================
  // MEAL PLANNING
  // ============================================================================

  async createMealPlan(date: Date): Promise<MealPlan> {
    const dateKey = date.toISOString().split('T')[0];
    let mealPlan = Array.from(this.mealPlans.values()).find(
      mp => new Date(mp.date).toISOString().split('T')[0] === dateKey
    );

    if (!mealPlan) {
      mealPlan = {
        id: `mealplan_${dateKey}`,
        date,
        meals: {
          snacks: []
        },
        waterGoal: this.dietaryProfile.dailyWaterGoal,
        waterConsumed: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.mealPlans.set(mealPlan.id, mealPlan);
      this.saveToStorage();
    }

    return mealPlan;
  }

  async setMeal(
    date: Date,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    recipeId?: string,
    description?: string
  ): Promise<MealPlan> {
    const mealPlan = await this.createMealPlan(date);

    mealPlan.meals[mealType] = {
      recipeId,
      description: description || (recipeId ? this.recipes.get(recipeId)?.name || '' : ''),
      prepared: false
    };
    mealPlan.updatedAt = new Date();

    this.mealPlans.set(mealPlan.id, mealPlan);
    this.saveToStorage();

    return mealPlan;
  }

  async markMealPrepared(date: Date, mealType: 'breakfast' | 'lunch' | 'dinner'): Promise<MealPlan | null> {
    const dateKey = date.toISOString().split('T')[0];
    const mealPlan = Array.from(this.mealPlans.values()).find(
      mp => new Date(mp.date).toISOString().split('T')[0] === dateKey
    );

    if (!mealPlan || !mealPlan.meals[mealType]) return null;

    mealPlan.meals[mealType]!.prepared = true;
    mealPlan.updatedAt = new Date();

    this.mealPlans.set(mealPlan.id, mealPlan);
    this.saveToStorage();

    return mealPlan;
  }

  getMealPlan(date: Date): MealPlan | undefined {
    const dateKey = date.toISOString().split('T')[0];
    return Array.from(this.mealPlans.values()).find(
      mp => new Date(mp.date).toISOString().split('T')[0] === dateKey
    );
  }

  getWeeklyMealPlan(startDate: Date): MealPlan[] {
    const plans: MealPlan[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const plan = this.getMealPlan(date);
      if (plan) plans.push(plan);
    }
    return plans;
  }

  // ============================================================================
  // HYDRATION TRACKING
  // ============================================================================

  async logWater(amount: number, type: WaterLog['type'] = 'water', withMedication: boolean = false, notes?: string): Promise<WaterLog> {
    const log: WaterLog = {
      id: `water_${Date.now()}`,
      timestamp: new Date(),
      amount,
      type,
      withMedication,
      notes
    };

    this.waterLogs.push(log);

    // Update today's meal plan
    const today = new Date();
    const mealPlan = await this.createMealPlan(today);
    mealPlan.waterConsumed += amount;
    this.mealPlans.set(mealPlan.id, mealPlan);

    this.saveToStorage();

    // Check if goal reached
    if (mealPlan.waterConsumed >= mealPlan.waterGoal) {
      eventBus.emit('food:hydration:goal_reached', mealPlan);
    }

    eventBus.emit('food:water:logged', log);
    return log;
  }

  getTodaysWaterIntake(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.waterLogs
      .filter(log => new Date(log.timestamp) >= today)
      .reduce((sum, log) => sum + log.amount, 0);
  }

  getWaterProgress(): { consumed: number; goal: number; percentage: number } {
    const consumed = this.getTodaysWaterIntake();
    const goal = this.dietaryProfile.dailyWaterGoal;
    return {
      consumed,
      goal,
      percentage: Math.min(100, Math.round((consumed / goal) * 100))
    };
  }

  private checkHydration(): void {
    const progress = this.getWaterProgress();
    const hour = new Date().getHours();

    // If it's afternoon and less than 50% hydrated, send reminder
    if (hour >= 12 && progress.percentage < 50) {
      eventBus.emit('notification:send', {
        type: 'hydration',
        title: 'Hydration Reminder',
        message: `You've had ${progress.consumed}oz of ${progress.goal}oz today. Time for some water!`
      });
    }
  }

  // ============================================================================
  // GROCERY LIST
  // ============================================================================

  async createGroceryList(name: string, store?: string): Promise<GroceryList> {
    const list: GroceryList = {
      id: `grocery_${Date.now()}`,
      name,
      store,
      items: [],
      totalEstimate: 0,
      status: 'draft',
      shared: false,
      sharedWith: [],
      energyRequired: 3, // Default shopping energy
      deliveryOption: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.groceryLists.set(list.id, list);
    this.saveToStorage();

    return list;
  }

  async addToGroceryList(name: string, quantity: number, unit: string, listId?: string): Promise<GroceryList> {
    // Find or create active list
    let list: GroceryList;
    if (listId) {
      list = this.groceryLists.get(listId)!;
    } else {
      list = Array.from(this.groceryLists.values()).find(l => l.status === 'active') ||
        await this.createGroceryList('Shopping List');
    }

    const item: GroceryList['items'][0] = {
      id: `item_${Date.now()}`,
      name,
      quantity,
      unit,
      category: 'other',
      purchased: false
    };

    list.items.push(item);
    list.status = 'active';
    list.updatedAt = new Date();

    this.groceryLists.set(list.id, list);
    this.saveToStorage();

    return list;
  }

  async generateGroceryListFromMealPlan(startDate: Date, days: number = 7): Promise<GroceryList> {
    const list = await this.createGroceryList(`Meal Plan ${startDate.toLocaleDateString()}`);
    const ingredientMap = new Map<string, { amount: number; unit: string }>();

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const mealPlan = this.getMealPlan(date);

      if (mealPlan) {
        for (const mealType of ['breakfast', 'lunch', 'dinner'] as const) {
          const meal = mealPlan.meals[mealType];
          if (meal?.recipeId) {
            const recipe = this.recipes.get(meal.recipeId);
            if (recipe) {
              for (const ingredient of recipe.ingredients) {
                const key = ingredient.name.toLowerCase();
                const existing = ingredientMap.get(key) || { amount: 0, unit: ingredient.unit };
                existing.amount += ingredient.amount;
                ingredientMap.set(key, existing);
              }
            }
          }
        }
      }
    }

    // Subtract what's in pantry
    for (const [name, needed] of ingredientMap) {
      const pantryItem = Array.from(this.pantry.values()).find(
        p => p.name.toLowerCase() === name
      );
      if (pantryItem) {
        needed.amount -= pantryItem.quantity;
      }
      if (needed.amount > 0) {
        list.items.push({
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name,
          quantity: needed.amount,
          unit: needed.unit,
          category: 'other',
          purchased: false
        });
      }
    }

    list.status = 'active';
    this.groceryLists.set(list.id, list);
    this.saveToStorage();

    return list;
  }

  async shareGroceryList(listId: string, withPersonIds: string[]): Promise<GroceryList | null> {
    const list = this.groceryLists.get(listId);
    if (!list) return null;

    list.shared = true;
    list.sharedWith = withPersonIds;
    list.updatedAt = new Date();

    this.groceryLists.set(listId, list);
    this.saveToStorage();

    // Notify caregivers/partner
    eventBus.emit('relationships:notification:send', {
      recipientIds: withPersonIds,
      type: 'grocery_list',
      title: 'Grocery List Shared',
      message: `${list.name} has been shared with you`,
      linkedId: listId
    });

    return list;
  }

  getActiveGroceryList(): GroceryList | undefined {
    return Array.from(this.groceryLists.values()).find(l => l.status === 'active');
  }

  getAllGroceryLists(): GroceryList[] {
    return Array.from(this.groceryLists.values());
  }

  // ============================================================================
  // FOOD LOGGING
  // ============================================================================

  async logFood(log: Omit<FoodLog, 'id' | 'createdAt'>): Promise<FoodLog> {
    const newLog: FoodLog = {
      ...log,
      id: `foodlog_${Date.now()}`,
      createdAt: new Date()
    };

    this.foodLogs.push(newLog);
    this.saveToStorage();

    // Track nutrition
    if (newLog.calories) {
      eventBus.emit('health:nutrition:logged', {
        calories: newLog.calories,
        protein: newLog.protein,
        carbs: newLog.carbs,
        fat: newLog.fat
      });
    }

    eventBus.emit('food:logged', newLog);
    return newLog;
  }

  getFoodLogs(options?: { date?: Date; limit?: number }): FoodLog[] {
    let logs = [...this.foodLogs];

    if (options?.date) {
      const dateKey = options.date.toISOString().split('T')[0];
      logs = logs.filter(l => new Date(l.timestamp).toISOString().split('T')[0] === dateKey);
    }

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (options?.limit) {
      logs = logs.slice(0, options.limit);
    }

    return logs;
  }

  private correlateSymptomWithFood(symptomData: any): void {
    // Look at food eaten in last 24 hours before symptom
    const symptomTime = new Date(symptomData.timestamp || Date.now());
    const dayBefore = new Date(symptomTime);
    dayBefore.setHours(dayBefore.getHours() - 24);

    const recentFoods = this.foodLogs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= dayBefore && logTime <= symptomTime;
    });

    if (recentFoods.length > 0) {
      console.log(`[Food] Possible food triggers for ${symptomData.name}:`,
        recentFoods.map(f => f.description).join(', '));
    }
  }

  // ============================================================================
  // MEAL PREP BATCHES
  // ============================================================================

  async createMealPrepBatch(batch: Omit<MealPrepBatch, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPrepBatch> {
    const newBatch: MealPrepBatch = {
      ...batch,
      id: `batch_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mealPrepBatches.set(newBatch.id, newBatch);
    this.saveToStorage();

    // Calculate total spoon cost for the prep session
    let totalSpoons = 0;
    for (const item of batch.recipes) {
      const recipe = this.recipes.get(item.recipeId);
      if (recipe) {
        totalSpoons += recipe.spoonCost;
      }
    }

    eventBus.emit('health:spoons:used', {
      amount: totalSpoons,
      activity: 'meal_prep',
      linkedId: newBatch.id
    });

    eventBus.emit('food:mealprep:created', newBatch);
    return newBatch;
  }

  async usePreparedMeal(batchId: string, recipeId: string): Promise<MealPrepBatch | null> {
    const batch = this.mealPrepBatches.get(batchId);
    if (!batch) return null;

    const item = batch.recipes.find(r => r.recipeId === recipeId);
    if (item && item.portionsRemaining > 0) {
      item.portionsRemaining--;
      batch.updatedAt = new Date();

      if (item.portionsRemaining === 0) {
        batch.recipes = batch.recipes.filter(r => r.recipeId !== recipeId);
      }

      if (batch.recipes.length === 0) {
        this.mealPrepBatches.delete(batchId);
      } else {
        this.mealPrepBatches.set(batchId, batch);
      }

      this.saveToStorage();
    }

    return batch;
  }

  getAvailablePreparedMeals(): Array<{ batch: MealPrepBatch; recipe: Recipe; portions: number; useBy: Date }> {
    const available: Array<{ batch: MealPrepBatch; recipe: Recipe; portions: number; useBy: Date }> = [];

    for (const batch of this.mealPrepBatches.values()) {
      for (const item of batch.recipes) {
        const recipe = this.recipes.get(item.recipeId);
        if (recipe && item.portionsRemaining > 0) {
          available.push({
            batch,
            recipe,
            portions: item.portionsRemaining,
            useBy: new Date(item.useByDate)
          });
        }
      }
    }

    return available.sort((a, b) => a.useBy.getTime() - b.useBy.getTime());
  }

  // ============================================================================
  // CAREGIVER SUPPORT
  // ============================================================================

  prepareCaregiverMealInfo(caregiverId: string): {
    dietaryProfile: DietaryProfile;
    todaysMeals: MealPlan | undefined;
    preparedMeals: ReturnType<typeof this.getAvailablePreparedMeals>;
    lowSpoonRecipes: Recipe[];
    pantryStaples: PantryItem[];
    expiringItems: PantryItem[];
    hydrationProgress: ReturnType<typeof this.getWaterProgress>;
  } {
    return {
      dietaryProfile: this.dietaryProfile,
      todaysMeals: this.getMealPlan(new Date()),
      preparedMeals: this.getAvailablePreparedMeals(),
      lowSpoonRecipes: this.getLowSpoonRecipes(2).slice(0, 5),
      pantryStaples: Array.from(this.pantry.values()).slice(0, 20),
      expiringItems: this.getExpiringItems(3),
      hydrationProgress: this.getWaterProgress()
    };
  }

  getCaregiverInstructions(): string {
    return this.dietaryProfile.caregiverInstructions;
  }

  updateCaregiverInstructions(instructions: string): void {
    this.dietaryProfile.caregiverInstructions = instructions;
    this.saveToStorage();
  }

  // ============================================================================
  // SUGGESTIONS & RECOMMENDATIONS
  // ============================================================================

  private suggestLowSpoonMeals(): void {
    const suggestions = this.getLowSpoonRecipes(1);
    const preparedMeals = this.getAvailablePreparedMeals();

    eventBus.emit('food:suggestions:lowspoon', {
      prepared: preparedMeals,
      easy: suggestions.slice(0, 5),
      message: 'Low energy? Here are some easy options'
    });
  }

  getMealSuggestions(spoons: number): {
    preparedMeals: ReturnType<typeof this.getAvailablePreparedMeals>;
    easyRecipes: Recipe[];
    canMakeNow: Recipe[];
    message: string;
  } {
    const maxSpoons = Math.ceil(spoons / 3);

    return {
      preparedMeals: this.getAvailablePreparedMeals(),
      easyRecipes: this.getLowSpoonRecipes(maxSpoons).slice(0, 5),
      canMakeNow: this.getRecipesWithPantryIngredients().filter(r => r.spoonCost <= maxSpoons).slice(0, 5),
      message: spoons <= 3
        ? 'Very low energy - consider prepared meals or delivery'
        : spoons <= 5
          ? 'Low energy - simple meals recommended'
          : 'You have energy to cook something nice!'
    };
  }

  private checkMedicationFoodInteractions(medicationName: string): void {
    const interactions: Array<{ recipe: string; interaction: string }> = [];

    for (const recipe of this.recipes.values()) {
      const interaction = recipe.medicationInteractions?.find(
        i => i.medication.toLowerCase() === medicationName.toLowerCase()
      );
      if (interaction) {
        interactions.push({
          recipe: recipe.name,
          interaction: interaction.interaction
        });
      }
    }

    if (interactions.length > 0) {
      eventBus.emit('food:medication:interactions', {
        medication: medicationName,
        interactions
      });
    }
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  getNutritionStats(days: number = 7): {
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
    averageWater: number;
    daysTracked: number;
  } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentLogs = this.foodLogs.filter(l => new Date(l.timestamp) >= cutoff);
    const recentWater = this.waterLogs.filter(l => new Date(l.timestamp) >= cutoff);

    const uniqueDays = new Set(recentLogs.map(l => new Date(l.timestamp).toDateString())).size;

    return {
      averageCalories: uniqueDays > 0 ? Math.round(recentLogs.reduce((sum, l) => sum + (l.calories || 0), 0) / uniqueDays) : 0,
      averageProtein: uniqueDays > 0 ? Math.round(recentLogs.reduce((sum, l) => sum + (l.protein || 0), 0) / uniqueDays) : 0,
      averageCarbs: uniqueDays > 0 ? Math.round(recentLogs.reduce((sum, l) => sum + (l.carbs || 0), 0) / uniqueDays) : 0,
      averageFat: uniqueDays > 0 ? Math.round(recentLogs.reduce((sum, l) => sum + (l.fat || 0), 0) / uniqueDays) : 0,
      averageWater: uniqueDays > 0 ? Math.round(recentWater.reduce((sum, l) => sum + l.amount, 0) / uniqueDays) : 0,
      daysTracked: uniqueDays
    };
  }

  getFoodStats(): {
    totalRecipes: number;
    pantryItems: number;
    expiringCount: number;
    lowStockCount: number;
    preparedMeals: number;
    todaysWater: ReturnType<typeof this.getWaterProgress>;
  } {
    return {
      totalRecipes: this.recipes.size,
      pantryItems: this.pantry.size,
      expiringCount: this.getExpiringItems(7).length,
      lowStockCount: this.getLowStockItems().length,
      preparedMeals: this.getAvailablePreparedMeals().reduce((sum, m) => sum + m.portions, 0),
      todaysWater: this.getWaterProgress()
    };
  }
}

// Export singleton instance
export const foodEcosystem = UnifiedFoodEcosystem.getInstance();

// Export convenience functions
export const addRecipe = (r: Parameters<typeof foodEcosystem.addRecipe>[0]) => foodEcosystem.addRecipe(r);
export const addPantryItem = (i: Parameters<typeof foodEcosystem.addPantryItem>[0]) => foodEcosystem.addPantryItem(i);
export const logWater = (amount: number, type?: WaterLog['type']) => foodEcosystem.logWater(amount, type);
export const getMealSuggestions = (spoons: number) => foodEcosystem.getMealSuggestions(spoons);
export const getWaterProgress = () => foodEcosystem.getWaterProgress();
export const getDietaryProfile = () => foodEcosystem.getDietaryProfile();
export const getCaregiverMealInfo = (id: string) => foodEcosystem.prepareCaregiverMealInfo(id);
