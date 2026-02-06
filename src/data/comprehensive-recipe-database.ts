/**
 * COMPREHENSIVE RECIPE DATABASE
 * ==============================
 * Recipes organized by cuisine, difficulty, dietary needs
 * Includes cooking techniques and ingredient guides
 */

// ===== RECIPE DATABASE =====
export interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'beverage' | 'side';
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: { item: string; amount: string; notes?: string }[];
  instructions: string[];
  tips?: string[];
  nutrition?: { calories: number; protein: number; carbs: number; fat: number; sodium?: number };
  dietary: string[]; // vegetarian, vegan, gluten-free, dairy-free, low-sodium, etc.
  tags: string[];
}

export const CUISINES = [
  'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Korean', 'Thai',
  'Indian', 'Mediterranean', 'French', 'Greek', 'Middle Eastern', 'African',
  'Caribbean', 'Southern (US)', 'Soul Food', 'Cajun/Creole', 'Vietnamese'
];

export const DIETARY_TAGS = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'low-sodium',
  'low-carb', 'keto', 'paleo', 'heart-healthy', 'diabetic-friendly', 'POTS-friendly'
];

export const RECIPE_DATABASE: Recipe[] = [
  // ===== BREAKFAST =====
  {
    id: 'recipe-001',
    name: 'Classic Fluffy Pancakes',
    cuisine: 'American',
    category: 'breakfast',
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    ingredients: [
      { item: 'all-purpose flour', amount: '1.5 cups' },
      { item: 'baking powder', amount: '1.5 tsp' },
      { item: 'salt', amount: '0.5 tsp' },
      { item: 'sugar', amount: '1 tbsp' },
      { item: 'milk', amount: '1.25 cups' },
      { item: 'egg', amount: '1 large' },
      { item: 'melted butter', amount: '3 tbsp' },
      { item: 'vanilla extract', amount: '1 tsp' }
    ],
    instructions: [
      'Mix dry ingredients in large bowl',
      'Whisk wet ingredients in separate bowl',
      'Combine wet and dry - dont overmix (lumps are okay)',
      'Heat griddle to medium (350F)',
      'Pour 1/4 cup batter per pancake',
      'Flip when bubbles form and edges set (2-3 min)',
      'Cook other side until golden (1-2 min)'
    ],
    tips: ['Dont overmix - lumps make fluffy pancakes', 'Let batter rest 5 minutes', 'Test griddle with water droplet'],
    nutrition: { calories: 220, protein: 6, carbs: 32, fat: 8 },
    dietary: [],
    tags: ['classic', 'family', 'quick']
  },
  {
    id: 'recipe-002',
    name: 'Avocado Toast with Everything Bagel Seasoning',
    cuisine: 'American',
    category: 'breakfast',
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 3,
    servings: 2,
    ingredients: [
      { item: 'bread slices', amount: '2', notes: 'sourdough recommended' },
      { item: 'ripe avocado', amount: '1 large' },
      { item: 'lime juice', amount: '1 tsp' },
      { item: 'salt', amount: 'pinch' },
      { item: 'everything bagel seasoning', amount: '1 tsp' },
      { item: 'red pepper flakes', amount: 'optional' }
    ],
    instructions: [
      'Toast bread until golden',
      'Mash avocado with lime juice and salt',
      'Spread avocado on toast',
      'Sprinkle with everything bagel seasoning',
      'Add red pepper flakes if desired'
    ],
    tips: ['Use ripe avocados (slight give when pressed)', 'Add fried egg for extra protein'],
    nutrition: { calories: 280, protein: 6, carbs: 28, fat: 18 },
    dietary: ['vegan', 'dairy-free'],
    tags: ['quick', 'healthy', 'trendy']
  },
  {
    id: 'recipe-003',
    name: 'Overnight Oats',
    cuisine: 'American',
    category: 'breakfast',
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    ingredients: [
      { item: 'rolled oats', amount: '0.5 cup' },
      { item: 'milk or milk alternative', amount: '0.5 cup' },
      { item: 'yogurt', amount: '0.25 cup' },
      { item: 'chia seeds', amount: '1 tbsp' },
      { item: 'maple syrup or honey', amount: '1 tbsp' },
      { item: 'vanilla extract', amount: '0.5 tsp' },
      { item: 'fresh berries', amount: '0.25 cup', notes: 'for topping' }
    ],
    instructions: [
      'Combine oats, milk, yogurt, chia seeds, sweetener, and vanilla in jar',
      'Stir well to combine',
      'Cover and refrigerate overnight (or at least 4 hours)',
      'Top with fresh berries before serving',
      'Eat cold or microwave for warm oats'
    ],
    tips: ['Make several jars for the week', 'Try different toppings: nuts, banana, peanut butter'],
    nutrition: { calories: 320, protein: 12, carbs: 48, fat: 8 },
    dietary: ['vegetarian', 'POTS-friendly'],
    tags: ['meal-prep', 'no-cook', 'healthy']
  },

  // ===== LUNCH =====
  {
    id: 'recipe-010',
    name: 'Classic Grilled Cheese',
    cuisine: 'American',
    category: 'lunch',
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    ingredients: [
      { item: 'bread slices', amount: '2' },
      { item: 'butter', amount: '2 tbsp', notes: 'softened' },
      { item: 'cheddar cheese', amount: '2 slices' },
      { item: 'american cheese', amount: '1 slice', notes: 'optional for extra melt' }
    ],
    instructions: [
      'Butter one side of each bread slice',
      'Place one slice butter-side down in cold pan',
      'Layer cheese on bread',
      'Top with second slice, butter-side up',
      'Turn heat to medium-low',
      'Cook until golden (3-4 min per side)',
      'Press gently with spatula, flip carefully'
    ],
    tips: ['Low and slow = perfect melt', 'Mayo instead of butter = extra crispy', 'Add tomato soup for dipping'],
    nutrition: { calories: 450, protein: 18, carbs: 30, fat: 28 },
    dietary: ['vegetarian'],
    tags: ['comfort', 'classic', 'quick']
  },
  {
    id: 'recipe-011',
    name: 'Buddha Bowl',
    cuisine: 'Mediterranean',
    category: 'lunch',
    difficulty: 'medium',
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    ingredients: [
      { item: 'quinoa', amount: '1 cup', notes: 'cooked' },
      { item: 'chickpeas', amount: '1 can', notes: 'drained and rinsed' },
      { item: 'sweet potato', amount: '1 medium', notes: 'cubed' },
      { item: 'kale or spinach', amount: '2 cups' },
      { item: 'avocado', amount: '1' },
      { item: 'tahini', amount: '2 tbsp' },
      { item: 'lemon juice', amount: '2 tbsp' },
      { item: 'olive oil', amount: '2 tbsp' },
      { item: 'garlic', amount: '1 clove' },
      { item: 'cumin', amount: '1 tsp' },
      { item: 'paprika', amount: '1 tsp' }
    ],
    instructions: [
      'Preheat oven to 400F',
      'Toss sweet potato and chickpeas with oil, cumin, paprika',
      'Roast for 25 minutes, stirring halfway',
      'Make tahini dressing: whisk tahini, lemon, garlic, water',
      'Massage kale with a little oil and salt',
      'Assemble bowls: quinoa base, roasted veggies, greens, avocado',
      'Drizzle with tahini dressing'
    ],
    tips: ['Meal prep components separately', 'Swap grains: rice, farro, barley'],
    nutrition: { calories: 520, protein: 16, carbs: 58, fat: 26 },
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    tags: ['healthy', 'meal-prep', 'filling']
  },

  // ===== DINNER =====
  {
    id: 'recipe-020',
    name: 'One-Pan Lemon Herb Chicken',
    cuisine: 'Mediterranean',
    category: 'dinner',
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    ingredients: [
      { item: 'chicken thighs', amount: '4', notes: 'bone-in, skin-on' },
      { item: 'baby potatoes', amount: '1 lb', notes: 'halved' },
      { item: 'green beans', amount: '1 lb', notes: 'trimmed' },
      { item: 'lemon', amount: '1', notes: 'sliced' },
      { item: 'garlic', amount: '4 cloves', notes: 'minced' },
      { item: 'olive oil', amount: '3 tbsp' },
      { item: 'dried thyme', amount: '1 tsp' },
      { item: 'dried rosemary', amount: '1 tsp' },
      { item: 'salt and pepper', amount: 'to taste' }
    ],
    instructions: [
      'Preheat oven to 425F',
      'Toss potatoes with 1 tbsp oil, salt, pepper in large pan',
      'Roast potatoes for 15 minutes',
      'Season chicken with herbs, salt, pepper',
      'Push potatoes aside, add chicken skin-side up',
      'Add green beans, garlic, lemon slices around chicken',
      'Drizzle with remaining oil',
      'Roast 20-25 more minutes until chicken reaches 165F'
    ],
    tips: ['Dont crowd the pan', 'Let chicken rest 5 minutes before serving', 'Pan juices make great sauce'],
    nutrition: { calories: 420, protein: 32, carbs: 28, fat: 22, sodium: 450 },
    dietary: ['gluten-free', 'dairy-free'],
    tags: ['one-pan', 'easy', 'family']
  },
  {
    id: 'recipe-021',
    name: 'Vegetarian Chili',
    cuisine: 'American',
    category: 'dinner',
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 45,
    servings: 6,
    ingredients: [
      { item: 'black beans', amount: '2 cans', notes: 'drained' },
      { item: 'kidney beans', amount: '1 can', notes: 'drained' },
      { item: 'diced tomatoes', amount: '2 cans' },
      { item: 'onion', amount: '1 large', notes: 'diced' },
      { item: 'bell peppers', amount: '2', notes: 'diced' },
      { item: 'garlic', amount: '4 cloves', notes: 'minced' },
      { item: 'chili powder', amount: '2 tbsp' },
      { item: 'cumin', amount: '1 tbsp' },
      { item: 'smoked paprika', amount: '1 tsp' },
      { item: 'vegetable broth', amount: '1 cup' },
      { item: 'olive oil', amount: '2 tbsp' }
    ],
    instructions: [
      'Heat oil in large pot over medium heat',
      'Saute onion and peppers until soft (5-7 min)',
      'Add garlic, cook 1 minute',
      'Add spices, stir for 30 seconds',
      'Add beans, tomatoes, and broth',
      'Bring to boil, reduce to simmer',
      'Cook 30-45 minutes, stirring occasionally',
      'Adjust seasonings to taste'
    ],
    tips: ['Better the next day', 'Top with sour cream, cheese, cilantro', 'Freezes well'],
    nutrition: { calories: 280, protein: 14, carbs: 46, fat: 6, sodium: 580 },
    dietary: ['vegan', 'gluten-free', 'dairy-free', 'high-fiber'],
    tags: ['comfort', 'meal-prep', 'freezer-friendly']
  },
  {
    id: 'recipe-022',
    name: 'Shrimp Stir-Fry',
    cuisine: 'Chinese',
    category: 'dinner',
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    ingredients: [
      { item: 'large shrimp', amount: '1 lb', notes: 'peeled and deveined' },
      { item: 'broccoli florets', amount: '2 cups' },
      { item: 'bell pepper', amount: '1', notes: 'sliced' },
      { item: 'snap peas', amount: '1 cup' },
      { item: 'garlic', amount: '3 cloves', notes: 'minced' },
      { item: 'ginger', amount: '1 tbsp', notes: 'minced' },
      { item: 'soy sauce', amount: '3 tbsp' },
      { item: 'sesame oil', amount: '1 tbsp' },
      { item: 'rice vinegar', amount: '1 tbsp' },
      { item: 'cornstarch', amount: '1 tsp' },
      { item: 'vegetable oil', amount: '2 tbsp' }
    ],
    instructions: [
      'Mix soy sauce, sesame oil, vinegar, cornstarch for sauce',
      'Heat wok or large pan over high heat',
      'Add oil, then shrimp - cook 2 min per side, remove',
      'Add more oil if needed, stir-fry vegetables 3-4 min',
      'Add garlic and ginger, cook 30 seconds',
      'Return shrimp, add sauce',
      'Toss until sauce thickens (1-2 min)',
      'Serve over rice'
    ],
    tips: ['Have everything prepped before cooking', 'Dont overcrowd wok', 'High heat is key'],
    nutrition: { calories: 240, protein: 26, carbs: 14, fat: 10, sodium: 820 },
    dietary: ['dairy-free'],
    tags: ['quick', 'high-protein', 'weeknight']
  },

  // ===== SOUL FOOD / SOUTHERN =====
  {
    id: 'recipe-030',
    name: 'Southern Collard Greens',
    cuisine: 'Soul Food',
    category: 'side',
    difficulty: 'medium',
    prepTime: 20,
    cookTime: 90,
    servings: 8,
    ingredients: [
      { item: 'collard greens', amount: '2 bunches', notes: 'stems removed, chopped' },
      { item: 'smoked turkey leg', amount: '1', notes: 'or smoked ham hock' },
      { item: 'chicken broth', amount: '4 cups' },
      { item: 'onion', amount: '1 large', notes: 'diced' },
      { item: 'garlic', amount: '3 cloves', notes: 'minced' },
      { item: 'apple cider vinegar', amount: '2 tbsp' },
      { item: 'brown sugar', amount: '1 tbsp' },
      { item: 'red pepper flakes', amount: '0.5 tsp' },
      { item: 'salt and pepper', amount: 'to taste' }
    ],
    instructions: [
      'Place smoked meat in large pot with broth, bring to boil',
      'Reduce heat, simmer 30 minutes to flavor broth',
      'Add onion and garlic, cook 5 minutes',
      'Add collards in batches, stirring to wilt',
      'Add vinegar, sugar, red pepper flakes',
      'Cover and simmer 1-1.5 hours until tender',
      'Remove meat, shred and return to greens',
      'Season to taste'
    ],
    tips: ['Pot likker (liquid) is the best part', 'Serve with cornbread', 'Can use smoked turkey for lighter version'],
    nutrition: { calories: 120, protein: 10, carbs: 12, fat: 4, sodium: 480 },
    dietary: ['gluten-free', 'dairy-free'],
    tags: ['soul-food', 'traditional', 'comfort']
  },
  {
    id: 'recipe-031',
    name: 'Mac and Cheese (Soul Food Style)',
    cuisine: 'Soul Food',
    category: 'side',
    difficulty: 'medium',
    prepTime: 20,
    cookTime: 45,
    servings: 8,
    ingredients: [
      { item: 'elbow macaroni', amount: '1 lb' },
      { item: 'sharp cheddar', amount: '2 cups', notes: 'shredded' },
      { item: 'mild cheddar', amount: '1 cup', notes: 'shredded' },
      { item: 'velveeta', amount: '8 oz', notes: 'cubed' },
      { item: 'eggs', amount: '2', notes: 'beaten' },
      { item: 'evaporated milk', amount: '1 can' },
      { item: 'whole milk', amount: '0.5 cup' },
      { item: 'butter', amount: '4 tbsp' },
      { item: 'salt', amount: '1 tsp' },
      { item: 'black pepper', amount: '0.5 tsp' },
      { item: 'paprika', amount: '0.5 tsp' }
    ],
    instructions: [
      'Preheat oven to 350F',
      'Cook pasta 2 minutes less than package directions, drain',
      'Toss hot pasta with butter until melted',
      'Mix eggs with evaporated milk and regular milk',
      'Layer in greased 9x13 pan: pasta, cheese, repeat',
      'Pour egg mixture over top',
      'Top with remaining cheese and paprika',
      'Bake 35-45 minutes until golden and set'
    ],
    tips: ['Dont overcook pasta - it will cook more in oven', 'Let rest 10 minutes before serving', 'Velveeta ensures creamy texture'],
    nutrition: { calories: 480, protein: 22, carbs: 38, fat: 26, sodium: 720 },
    dietary: ['vegetarian'],
    tags: ['soul-food', 'comfort', 'holiday']
  },

  // ===== DESSERTS =====
  {
    id: 'recipe-040',
    name: 'No-Bake Chocolate Oat Cookies',
    cuisine: 'American',
    category: 'dessert',
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 5,
    servings: 24,
    ingredients: [
      { item: 'sugar', amount: '2 cups' },
      { item: 'butter', amount: '0.5 cup' },
      { item: 'milk', amount: '0.5 cup' },
      { item: 'cocoa powder', amount: '4 tbsp' },
      { item: 'quick oats', amount: '3 cups' },
      { item: 'peanut butter', amount: '0.5 cup' },
      { item: 'vanilla', amount: '1 tsp' }
    ],
    instructions: [
      'Line baking sheet with parchment',
      'Combine sugar, butter, milk, cocoa in saucepan',
      'Bring to boil over medium heat, stirring constantly',
      'Boil for exactly 1 minute',
      'Remove from heat immediately',
      'Stir in oats, peanut butter, vanilla',
      'Drop by spoonfuls onto parchment',
      'Let cool until set (about 30 minutes)'
    ],
    tips: ['Timing the boil is crucial', 'Work quickly once off heat', 'Add nuts or coconut if desired'],
    nutrition: { calories: 150, protein: 3, carbs: 22, fat: 7 },
    dietary: ['vegetarian'],
    tags: ['no-bake', 'quick', 'chocolate']
  },
  {
    id: 'recipe-041',
    name: 'Fresh Berry Crumble',
    cuisine: 'American',
    category: 'dessert',
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    ingredients: [
      { item: 'mixed berries', amount: '4 cups', notes: 'fresh or frozen' },
      { item: 'sugar', amount: '0.25 cup', notes: 'for filling' },
      { item: 'lemon juice', amount: '1 tbsp' },
      { item: 'cornstarch', amount: '1 tbsp' },
      { item: 'oats', amount: '1 cup' },
      { item: 'flour', amount: '0.5 cup' },
      { item: 'brown sugar', amount: '0.5 cup' },
      { item: 'cold butter', amount: '6 tbsp', notes: 'cubed' },
      { item: 'cinnamon', amount: '0.5 tsp' }
    ],
    instructions: [
      'Preheat oven to 350F',
      'Toss berries with sugar, lemon juice, cornstarch',
      'Pour into 8x8 baking dish',
      'Mix oats, flour, brown sugar, cinnamon',
      'Cut in cold butter until crumbly',
      'Sprinkle topping over fruit',
      'Bake 35-40 minutes until golden and bubbly',
      'Serve warm with vanilla ice cream'
    ],
    tips: ['Use frozen berries straight from freezer', 'Make ahead and bake when ready', 'Try with peaches or apples'],
    nutrition: { calories: 280, protein: 3, carbs: 48, fat: 10 },
    dietary: ['vegetarian'],
    tags: ['fruit', 'easy', 'crowd-pleaser']
  }
];

// ===== COOKING TECHNIQUES =====
export interface CookingTechnique {
  id: string;
  name: string;
  category: 'heat' | 'prep' | 'baking' | 'sauce' | 'knife';
  description: string;
  steps: string[];
  tips: string[];
  commonMistakes: string[];
  usedFor: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const COOKING_TECHNIQUES: CookingTechnique[] = [
  {
    id: 'tech-001',
    name: 'Sauteing',
    category: 'heat',
    description: 'Cooking food quickly in a small amount of fat over high heat',
    steps: ['Heat pan over medium-high heat', 'Add small amount of oil', 'Add food in single layer', 'Let sit briefly to brown', 'Toss or stir frequently', 'Cook until done'],
    tips: ['Dont overcrowd the pan', 'Have ingredients ready before starting', 'Use high smoke point oil'],
    commonMistakes: ['Adding too much food', 'Not preheating pan', 'Moving food too often'],
    usedFor: ['Vegetables', 'Chicken', 'Shrimp', 'Mushrooms'],
    difficulty: 'beginner'
  },
  {
    id: 'tech-002',
    name: 'Braising',
    category: 'heat',
    description: 'Slow cooking in liquid after initial browning',
    steps: ['Season and brown meat on all sides', 'Remove and set aside', 'Saute aromatics', 'Deglaze pan', 'Return meat, add liquid to cover halfway', 'Cover and cook low and slow'],
    tips: ['Low and slow is key', 'Tough cuts become tender', 'Use flavorful liquid'],
    commonMistakes: ['Too much liquid', 'Heat too high', 'Not browning first'],
    usedFor: ['Pot roast', 'Short ribs', 'Chicken thighs', 'Pork shoulder'],
    difficulty: 'intermediate'
  },
  {
    id: 'tech-003',
    name: 'Knife Skills - Dice',
    category: 'knife',
    description: 'Cutting food into uniform cube shapes',
    steps: ['Stabilize item with claw grip', 'Cut into planks', 'Stack planks, cut into strips', 'Cut strips crosswise into cubes'],
    tips: ['Keep fingers curled under', 'Use sharp knife', 'Practice on onions'],
    commonMistakes: ['Dull knife', 'Rushing', 'Inconsistent sizes'],
    usedFor: ['Onions', 'Potatoes', 'Carrots', 'Bell peppers'],
    difficulty: 'beginner'
  },
  {
    id: 'tech-004',
    name: 'Making a Roux',
    category: 'sauce',
    description: 'Equal parts fat and flour cooked together as a thickening base',
    steps: ['Melt butter in pan', 'Add equal amount flour', 'Whisk constantly over medium heat', 'Cook to desired color', 'Slowly add liquid while whisking'],
    tips: ['Whisk constantly to prevent lumps', 'Darker roux = more flavor, less thickening', 'Add liquid slowly'],
    commonMistakes: ['Stopping whisking', 'Adding liquid too fast', 'Burning'],
    usedFor: ['Gravy', 'Bechamel', 'Gumbo', 'Mac and cheese sauce'],
    difficulty: 'intermediate'
  }
];

// ===== INGREDIENT GUIDES =====
export interface IngredientGuide {
  name: string;
  category: string;
  description: string;
  selection: string;
  storage: string;
  preparation: string;
  substitutes?: string[];
  pairings: string[];
}

export const INGREDIENT_GUIDES: IngredientGuide[] = [
  {
    name: 'Avocado',
    category: 'Fruit',
    description: 'Creamy, nutrient-rich fruit',
    selection: 'Slight give when pressed, dark green to black skin',
    storage: 'Room temp until ripe, then refrigerate up to 3 days',
    preparation: 'Cut around pit lengthwise, twist to separate, scoop flesh',
    substitutes: ['Hummus', 'Greek yogurt', 'Mashed banana'],
    pairings: ['Lime', 'Cilantro', 'Tomato', 'Eggs', 'Toast']
  },
  {
    name: 'Garlic',
    category: 'Aromatics',
    description: 'Pungent aromatic essential to many cuisines',
    selection: 'Firm bulbs with tight skin, no green sprouts',
    storage: 'Cool, dry place for several weeks',
    preparation: 'Crush with knife to peel, mince/slice/press as needed',
    substitutes: ['Garlic powder (1/8 tsp per clove)', 'Shallots'],
    pairings: ['Olive oil', 'Lemon', 'Butter', 'Herbs', 'Most savory dishes']
  },
  {
    name: 'Chicken Thighs',
    category: 'Protein',
    description: 'Flavorful, forgiving dark meat cut',
    selection: 'Pink color, no off smell, use by date',
    storage: 'Refrigerate 1-2 days, freeze up to 9 months',
    preparation: 'Trim excess fat, season well, cook to 165F internal',
    substitutes: ['Chicken breast (less forgiving)', 'Turkey thighs'],
    pairings: ['Lemon', 'Herbs', 'Garlic', 'Root vegetables']
  }
];

// Helper functions
export function searchRecipes(query: string) {
  const q = query.toLowerCase();
  return RECIPE_DATABASE.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.cuisine.toLowerCase().includes(q) ||
    r.tags.some(t => t.toLowerCase().includes(q)) ||
    r.ingredients.some(i => i.item.toLowerCase().includes(q))
  );
}

export function getRecipesByDietary(dietary: string) {
  return RECIPE_DATABASE.filter(r =>
    r.dietary.some(d => d.toLowerCase() === dietary.toLowerCase())
  );
}

export function getRecipesByCuisine(cuisine: string) {
  return RECIPE_DATABASE.filter(r =>
    r.cuisine.toLowerCase() === cuisine.toLowerCase()
  );
}

export function getRecipesByCategory(category: string) {
  return RECIPE_DATABASE.filter(r => r.category === category);
}

export function getQuickRecipes(maxTime: number = 30) {
  return RECIPE_DATABASE.filter(r => (r.prepTime + r.cookTime) <= maxTime);
}
