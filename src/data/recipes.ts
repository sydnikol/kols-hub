import { Recipe } from '../components/food/RecipeLibrary';

export const recipeDatabase: Recipe[] = [
  // POTS-Friendly High Sodium Recipes
  {
    id: 'pots_1',
    name: 'Healing Chicken Broth',
    cuisine: 'American',
    category: 'Soups',
    tags: ['POTS-Friendly', 'High Sodium', 'Nausea-Safe', 'Quick Prep', 'Budget-Friendly', 'Anti-Inflammatory'],
    prepTime: 5,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 920,
    ingredients: [
      '4 cups low-sodium chicken broth',
      '2 tsp sea salt',
      '1 tsp garlic powder',
      '1/2 tsp black pepper',
      '1 bay leaf',
      'Optional: cooked chicken, veggies'
    ],
    instructions: [
      'Heat chicken broth in a pot over medium heat',
      'Add sea salt, garlic powder, pepper, and bay leaf',
      'Simmer for 20 minutes',
      'Add cooked chicken or vegetables if desired',
      'Serve hot and sip slowly'
    ],
    notes: 'Perfect for POTS flares. The high sodium helps with blood volume. Sip throughout the day.'
  },
  {
    id: 'pots_2',
    name: 'Electrolyte Ramen Bowl',
    cuisine: 'Japanese',
    category: 'Noodles',
    tags: ['POTS-Friendly', 'High Sodium', 'Quick Prep', 'Budget-Friendly', 'One Pot'],
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 1650,
    ingredients: [
      '1 package instant ramen (any flavor)',
      '1 soft boiled egg',
      '1/2 cup sliced mushrooms',
      '1/4 cup green onions',
      '1 tsp sesame oil',
      'Extra salt to taste'
    ],
    instructions: [
      'Boil water and cook ramen noodles according to package',
      'Add flavor packet plus extra salt if needed',
      'Top with soft boiled egg, mushrooms, and green onions',
      'Drizzle with sesame oil',
      'Eat while hot'
    ],
    notes: 'Ultra-high sodium for POTS support. Easy to make when low-energy.'
  },

  // Soft Foods & Nausea-Safe
  {
    id: 'soft_1',
    name: 'Creamy Mashed Potatoes',
    cuisine: 'American',
    category: 'Sides',
    tags: ['Soft Food', 'Nausea-Safe', 'Comfort Food', 'Budget-Friendly', 'Sensory-Safe'],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 380,
    ingredients: [
      '2 lbs potatoes, peeled and cubed',
      '4 tbsp butter',
      '1/2 cup milk',
      '1 tsp salt',
      '1/4 tsp white pepper'
    ],
    instructions: [
      'Boil potatoes in salted water until fork-tender (15-20 min)',
      'Drain and return to pot',
      'Add butter, milk, salt, and pepper',
      'Mash until smooth and creamy',
      'Adjust seasoning to taste'
    ],
    notes: 'Gentle on the stomach. Can add more salt for POTS support.'
  },
  {
    id: 'soft_2',
    name: 'Ginger Rice Porridge (Congee)',
    cuisine: 'Chinese',
    category: 'Breakfast',
    tags: ['Soft Food', 'Nausea-Safe', 'Anti-Inflammatory', 'Budget-Friendly', 'One Pot'],
    prepTime: 5,
    cookTime: 60,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 420,
    ingredients: [
      '1 cup white rice',
      '8 cups water or broth',
      '2 inches fresh ginger, sliced',
      '1 tsp salt',
      'Green onions for garnish',
      'Optional: soy sauce, sesame oil'
    ],
    instructions: [
      'Rinse rice and combine with water/broth in a large pot',
      'Add ginger slices and salt',
      'Bring to boil, then reduce to low simmer',
      'Cook for 60 minutes, stirring occasionally, until creamy',
      'Remove ginger slices, garnish with green onions'
    ],
    notes: 'Traditional remedy for upset stomach. Ginger helps nausea.'
  },

  // Comfort Foods
  {
    id: 'comfort_1',
    name: 'Classic Mac and Cheese',
    cuisine: 'American',
    category: 'Pasta',
    tags: ['Comfort Food', 'Budget-Friendly', 'Quick Prep'],
    prepTime: 10,
    cookTime: 20,
    servings: 6,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 520,
    ingredients: [
      '1 lb elbow macaroni',
      '4 tbsp butter',
      '1/4 cup flour',
      '3 cups milk',
      '3 cups shredded cheddar cheese',
      '1 tsp salt',
      '1/2 tsp mustard powder'
    ],
    instructions: [
      'Cook macaroni according to package, drain',
      'In same pot, melt butter and whisk in flour',
      'Gradually add milk, whisking constantly',
      'Cook until thickened, about 5 minutes',
      'Remove from heat, stir in cheese until melted',
      'Add cooked macaroni, mix well'
    ],
    notes: 'Ultimate comfort food. Can make dairy-free with plant-based alternatives.'
  },
  {
    id: 'comfort_2',
    name: 'Grilled Cheese Sandwich',
    cuisine: 'American',
    category: 'Sandwiches',
    tags: ['Comfort Food', 'Quick Prep', 'Budget-Friendly', 'Low Spoon'],
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 680,
    ingredients: [
      '2 slices bread',
      '2 slices cheese (cheddar or American)',
      '1 tbsp butter',
      'Optional: tomato slices, bacon'
    ],
    instructions: [
      'Butter one side of each bread slice',
      'Place one slice butter-side down in skillet over medium heat',
      'Add cheese slices on top',
      'Top with second bread slice, butter-side up',
      'Cook 3-4 minutes per side until golden and cheese melts'
    ],
    notes: 'Perfect low-energy meal. Pairs well with tomato soup.'
  },

  // Mexican Cuisine
  {
    id: 'mex_1',
    name: 'Bean and Cheese Quesadillas',
    cuisine: 'Mexican',
    category: 'Main Dishes',
    tags: ['Vegetarian', 'Quick Prep', 'Budget-Friendly', 'Low Spoon'],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 540,
    ingredients: [
      '8 flour tortillas',
      '1 can refried beans',
      '2 cups shredded cheese',
      '1 tsp cumin',
      'Salsa and sour cream for serving'
    ],
    instructions: [
      'Mix refried beans with cumin',
      'Spread beans on half of each tortilla',
      'Top with cheese and fold tortilla',
      'Cook in skillet 3-4 minutes per side until golden',
      'Cut into wedges and serve with salsa and sour cream'
    ],
    notes: 'Easy to customize. Add vegetables or cooked meat if desired.'
  },
  {
    id: 'mex_2',
    name: 'Simple Chicken Tacos',
    cuisine: 'Mexican',
    category: 'Main Dishes',
    tags: ['Quick Prep', 'Budget-Friendly'],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 620,
    ingredients: [
      '1 lb chicken breast',
      '8 small tortillas',
      '2 tsp taco seasoning',
      '1 cup shredded lettuce',
      '1 cup diced tomatoes',
      'Cheese, salsa, sour cream for topping'
    ],
    instructions: [
      'Cook chicken breast in skillet with taco seasoning',
      'Shred or dice cooked chicken',
      'Warm tortillas in dry skillet',
      'Fill tortillas with chicken',
      'Top with lettuce, tomatoes, cheese, and desired toppings'
    ],
    notes: 'Quick weeknight dinner. Can batch cook chicken for multiple meals.'
  },

  // Italian Cuisine
  {
    id: 'ital_1',
    name: 'Simple Marinara Pasta',
    cuisine: 'Italian',
    category: 'Pasta',
    tags: ['Vegetarian', 'Budget-Friendly', 'Quick Prep', 'One Pot'],
    prepTime: 5,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 480,
    ingredients: [
      '1 lb spaghetti',
      '1 can (28 oz) crushed tomatoes',
      '4 cloves garlic, minced',
      '2 tbsp olive oil',
      '1 tsp dried basil',
      '1 tsp salt',
      'Fresh basil for garnish'
    ],
    instructions: [
      'Cook pasta according to package directions',
      'Meanwhile, heat olive oil and sauté garlic',
      'Add crushed tomatoes, basil, and salt',
      'Simmer 15-20 minutes',
      'Toss with cooked pasta and serve'
    ],
    notes: 'Classic Italian comfort. Add meatballs or vegetables for variety.'
  },

  // Asian Cuisine
  {
    id: 'asian_1',
    name: 'Egg Fried Rice',
    cuisine: 'Chinese',
    category: 'Main Dishes',
    tags: ['Quick Prep', 'Budget-Friendly', 'One Pot', 'Low Spoon'],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 720,
    ingredients: [
      '4 cups cooked rice (day-old works best)',
      '3 eggs, beaten',
      '3 tbsp soy sauce',
      '2 tbsp oil',
      '1 cup frozen mixed vegetables',
      '2 green onions, sliced'
    ],
    instructions: [
      'Heat oil in large skillet or wok',
      'Scramble eggs, set aside',
      'Stir-fry vegetables until tender',
      'Add rice, breaking up clumps',
      'Add soy sauce and eggs, mix well',
      'Top with green onions'
    ],
    notes: 'Great way to use leftover rice. Highly customizable.'
  },

  // Indian Cuisine
  {
    id: 'indian_1',
    name: 'Simple Dal (Lentil Curry)',
    cuisine: 'Indian',
    category: 'Soups',
    tags: ['Vegetarian', 'Vegan', 'Budget-Friendly', 'Anti-Inflammatory', 'One Pot'],
    prepTime: 10,
    cookTime: 30,
    servings: 6,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 380,
    ingredients: [
      '1 cup red lentils',
      '4 cups water',
      '1 onion, diced',
      '2 tomatoes, diced',
      '2 tsp curry powder',
      '1 tsp turmeric',
      '1 tsp salt',
      '2 tbsp oil'
    ],
    instructions: [
      'Rinse lentils and cook in water until soft (20 min)',
      'Meanwhile, sauté onion in oil until golden',
      'Add tomatoes, curry powder, and turmeric',
      'Combine with cooked lentils',
      'Simmer 10 minutes, adjust seasoning',
      'Serve with rice or naan'
    ],
    notes: 'Packed with protein and iron. Freezes well for meal prep.'
  },

  // Thai Cuisine
  {
    id: 'thai_1',
    name: 'Pad Thai',
    cuisine: 'Thai',
    category: 'Noodles',
    tags: ['Quick Prep'],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    budget: 'Moderate',
    sodiumPerServing: 840,
    ingredients: [
      '8 oz rice noodles',
      '2 eggs',
      '1/2 lb shrimp or chicken',
      '3 tbsp fish sauce',
      '2 tbsp tamarind paste',
      '2 tbsp sugar',
      'Bean sprouts, peanuts, lime wedges'
    ],
    instructions: [
      'Soak rice noodles until soft, drain',
      'Mix fish sauce, tamarind, and sugar',
      'Stir-fry protein until cooked',
      'Push to side, scramble eggs',
      'Add noodles and sauce, toss well',
      'Top with sprouts, peanuts, and lime'
    ],
    notes: 'Restaurant-quality at home. Balance sweet, salty, sour.'
  },

  // Mediterranean
  {
    id: 'med_1',
    name: 'Greek Lemon Chicken',
    cuisine: 'Mediterranean',
    category: 'Main Dishes',
    tags: ['Anti-Inflammatory', 'Gluten-Free'],
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Moderate',
    sodiumPerServing: 420,
    ingredients: [
      '4 chicken thighs',
      '3 lemons, juiced',
      '4 cloves garlic, minced',
      '2 tbsp olive oil',
      '1 tsp oregano',
      '1 tsp salt',
      'Fresh herbs for garnish'
    ],
    instructions: [
      'Mix lemon juice, garlic, olive oil, oregano, and salt',
      'Marinate chicken for at least 30 minutes',
      'Bake at 400°F for 35 minutes until golden',
      'Serve with roasted vegetables or rice'
    ],
    notes: 'Light and flavorful. The lemon helps with iron absorption.'
  },

  // Soul Food
  {
    id: 'soul_1',
    name: 'Southern Collard Greens',
    cuisine: 'Soul Food',
    category: 'Sides',
    tags: ['Budget-Friendly', 'Anti-Inflammatory', 'High Sodium', 'POTS-Friendly'],
    prepTime: 15,
    cookTime: 45,
    servings: 6,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 680,
    ingredients: [
      '2 bunches collard greens',
      '4 cups chicken or vegetable broth',
      '1 onion, diced',
      '3 cloves garlic',
      '2 tbsp apple cider vinegar',
      '1 tsp salt',
      'Hot sauce to taste'
    ],
    instructions: [
      'Wash and chop collard greens, removing tough stems',
      'Sauté onion and garlic in large pot',
      'Add greens and broth',
      'Simmer 45 minutes until tender',
      'Add vinegar and season with salt',
      'Serve with hot sauce'
    ],
    notes: 'Traditional Southern cooking. Packed with nutrients and flavor.'
  },

  // French
  {
    id: 'french_1',
    name: 'French Onion Soup',
    cuisine: 'French',
    category: 'Soups',
    tags: ['Comfort Food', 'High Sodium', 'POTS-Friendly'],
    prepTime: 15,
    cookTime: 60,
    servings: 4,
    difficulty: 'Medium',
    budget: 'Moderate',
    sodiumPerServing: 920,
    ingredients: [
      '4 large onions, thinly sliced',
      '4 cups beef broth',
      '2 tbsp butter',
      '1 tsp sugar',
      '1 tsp salt',
      'Bread and Gruyère cheese for topping'
    ],
    instructions: [
      'Caramelize onions in butter with sugar (30-40 min)',
      'Add beef broth and salt',
      'Simmer 20 minutes',
      'Toast bread slices',
      'Ladle soup into bowls, top with bread and cheese',
      'Broil until cheese melts and bubbles'
    ],
    notes: 'Classic French comfort food. The slow-cooked onions are key.'
  },

  // Korean
  {
    id: 'korean_1',
    name: 'Kimchi Fried Rice',
    cuisine: 'Korean',
    category: 'Main Dishes',
    tags: ['Quick Prep', 'Budget-Friendly', 'One Pot', 'High Sodium', 'POTS-Friendly'],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 880,
    ingredients: [
      '2 cups cooked rice',
      '1 cup kimchi, chopped',
      '2 eggs',
      '2 tbsp gochujang (Korean chili paste)',
      '2 tbsp oil',
      'Green onions and sesame seeds'
    ],
    instructions: [
      'Heat oil in large skillet',
      'Stir-fry kimchi for 3 minutes',
      'Add rice and gochujang, mix well',
      'Push to side, fry eggs',
      'Serve rice topped with egg',
      'Garnish with green onions and sesame seeds'
    ],
    notes: 'Spicy and flavorful. Kimchi provides probiotics for gut health.'
  },

  // Breakfast Options
  {
    id: 'breakfast_1',
    name: 'Fluffy Pancakes',
    cuisine: 'American',
    category: 'Breakfast',
    tags: ['Comfort Food', 'Budget-Friendly', 'Quick Prep'],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 320,
    ingredients: [
      '2 cups flour',
      '2 tbsp sugar',
      '2 tsp baking powder',
      '1/2 tsp salt',
      '2 eggs',
      '1 3/4 cups milk',
      '1/4 cup melted butter'
    ],
    instructions: [
      'Mix dry ingredients in bowl',
      'Whisk together wet ingredients',
      'Combine wet and dry, don\'t overmix',
      'Pour 1/4 cup batter onto hot griddle',
      'Flip when bubbles appear',
      'Serve with syrup and butter'
    ],
    notes: 'Weekend breakfast favorite. Can add blueberries or chocolate chips.'
  },
  {
    id: 'breakfast_2',
    name: 'Avocado Toast',
    cuisine: 'American',
    category: 'Breakfast',
    tags: ['Quick Prep', 'Vegetarian', 'Anti-Inflammatory'],
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: 'Easy',
    budget: 'Moderate',
    sodiumPerServing: 420,
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '1 tsp lemon juice',
      'Salt and pepper to taste',
      'Optional: egg, tomato, red pepper flakes'
    ],
    instructions: [
      'Toast bread until golden',
      'Mash avocado with lemon juice, salt, and pepper',
      'Spread avocado on toast',
      'Top with optional additions',
      'Serve immediately'
    ],
    notes: 'Trendy and nutritious. Avocado provides healthy fats.'
  },

  // No-Cheese Options
  {
    id: 'nocheese_1',
    name: 'Vegan Chickpea Curry',
    cuisine: 'Indian',
    category: 'Main Dishes',
    tags: ['Vegan', 'No Cheese', 'Budget-Friendly', 'Anti-Inflammatory', 'One Pot'],
    prepTime: 10,
    cookTime: 30,
    servings: 6,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 420,
    ingredients: [
      '2 cans chickpeas, drained',
      '1 can coconut milk',
      '1 can diced tomatoes',
      '1 onion, diced',
      '3 cloves garlic',
      '2 tbsp curry powder',
      '1 tsp salt'
    ],
    instructions: [
      'Sauté onion and garlic until soft',
      'Add curry powder, toast 1 minute',
      'Add tomatoes, coconut milk, and chickpeas',
      'Simmer 20 minutes',
      'Season with salt',
      'Serve with rice or naan'
    ],
    notes: 'Creamy without dairy. Protein-packed and satisfying.'
  },

  // Budget-Friendly Staples
  {
    id: 'budget_1',
    name: 'Rice and Beans',
    cuisine: 'American',
    category: 'Main Dishes',
    tags: ['Budget-Friendly', 'Vegan', 'No Cheese', 'One Pot'],
    prepTime: 5,
    cookTime: 30,
    servings: 6,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 380,
    ingredients: [
      '2 cups white rice',
      '1 can black beans, drained',
      '1 onion, diced',
      '2 cloves garlic',
      '1 tsp cumin',
      '1 tsp salt',
      'Salsa for topping'
    ],
    instructions: [
      'Cook rice according to package',
      'Sauté onion and garlic',
      'Add beans, cumin, and salt',
      'Heat through',
      'Serve beans over rice',
      'Top with salsa'
    ],
    notes: 'Complete protein when combined. Costs pennies per serving.'
  },

  // Low-Spoon / Sitting Cook
  {
    id: 'lowspoon_1',
    name: 'Slow Cooker Chicken Tacos',
    cuisine: 'Mexican',
    category: 'Main Dishes',
    tags: ['Low Spoon', 'Sitting Cook', 'Budget-Friendly', 'One Pot'],
    prepTime: 5,
    cookTime: 240,
    servings: 8,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 580,
    ingredients: [
      '2 lbs chicken breast',
      '1 jar salsa',
      '1 packet taco seasoning',
      'Tortillas and toppings for serving'
    ],
    instructions: [
      'Place chicken in slow cooker',
      'Pour salsa over chicken',
      'Sprinkle taco seasoning on top',
      'Cook on low 6-8 hours or high 3-4 hours',
      'Shred chicken with forks',
      'Serve in tortillas with desired toppings'
    ],
    notes: 'Set it and forget it. Perfect for low-energy days.'
  },

  // Anti-Inflammatory
  {
    id: 'antiinflam_1',
    name: 'Turmeric Golden Milk',
    cuisine: 'Indian',
    category: 'Beverages',
    tags: ['Anti-Inflammatory', 'Quick Prep', 'Nausea-Safe'],
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 80,
    ingredients: [
      '1 cup milk (dairy or plant-based)',
      '1 tsp turmeric powder',
      '1/4 tsp cinnamon',
      '1/4 tsp ginger powder',
      '1 tsp honey',
      'Pinch black pepper'
    ],
    instructions: [
      'Heat milk in small pot',
      'Whisk in turmeric, cinnamon, and ginger',
      'Add black pepper (helps turmeric absorption)',
      'Sweeten with honey',
      'Serve warm'
    ],
    notes: 'Soothing bedtime drink. Turmeric is a powerful anti-inflammatory.'
  },

  // Freezer-Friendly
  {
    id: 'freezer_1',
    name: 'Beef Chili',
    cuisine: 'American',
    category: 'Soups',
    tags: ['Freezer-Friendly', 'Budget-Friendly', 'One Pot', 'High Sodium', 'POTS-Friendly'],
    prepTime: 15,
    cookTime: 60,
    servings: 8,
    difficulty: 'Easy',
    budget: 'Budget',
    sodiumPerServing: 720,
    ingredients: [
      '1 lb ground beef',
      '1 onion, diced',
      '2 cans kidney beans',
      '1 can diced tomatoes',
      '2 tbsp chili powder',
      '1 tsp cumin',
      '1 tsp salt'
    ],
    instructions: [
      'Brown ground beef with onion',
      'Add beans, tomatoes, and spices',
      'Simmer 45-60 minutes',
      'Adjust seasoning',
      'Serve with cornbread or rice',
      'Freeze extras in portions'
    ],
    notes: 'Makes great leftovers. Freezes perfectly for quick meals.'
  },

  // Gluten-Free
  {
    id: 'gf_1',
    name: 'Quinoa Buddha Bowl',
    cuisine: 'Mediterranean',
    category: 'Main Dishes',
    tags: ['Gluten-Free', 'Vegetarian', 'Anti-Inflammatory'],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    budget: 'Moderate',
    sodiumPerServing: 340,
    ingredients: [
      '2 cups cooked quinoa',
      '1 can chickpeas, roasted',
      '2 cups mixed vegetables',
      '1 avocado, sliced',
      '2 tbsp tahini',
      '1 lemon, juiced',
      'Salt and pepper'
    ],
    instructions: [
      'Cook quinoa according to package',
      'Roast chickpeas at 400°F for 20 minutes',
      'Steam or roast vegetables',
      'Assemble bowls with quinoa base',
      'Top with chickpeas, vegetables, and avocado',
      'Drizzle with tahini-lemon dressing'
    ],
    notes: 'Nutrient-dense and customizable. Perfect meal prep option.'
  }
];
