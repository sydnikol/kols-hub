import React, { useState } from 'react';
import { Calendar, Clock, Flame, Battery, Heart, Sun, Cloud, Sparkles, Users, AlertCircle, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  targetSodium: number;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  tips: string[];
  shoppingList: string[];
}

const MealPlanner: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  const mealPlans: MealPlan[] = [
    {
      id: 'nausea',
      name: 'Nausea Day',
      description: 'Gentle, easy-to-digest meals for queasy days',
      icon: Cloud,
      color: 'blue',
      targetSodium: 2000,
      meals: {
        breakfast: [
          'Plain toast with small amount of butter',
          'Ginger tea',
          'Applesauce (1/2 cup)'
        ],
        lunch: [
          'Plain white rice (1 cup)',
          'Chicken broth (sip slowly)',
          'Saltine crackers'
        ],
        dinner: [
          'Ginger rice porridge (congee)',
          'Steamed white rice',
          'Chamomile tea'
        ],
        snacks: [
          'Saltines',
          'Plain pretzels',
          'Ginger ale or ginger tea',
          'Frozen grapes (if tolerated)'
        ]
      },
      tips: [
        'Eat small portions every 2-3 hours',
        'Sip liquids slowly between meals, not during',
        'Avoid strong smells - cold foods may be easier',
        'Stay in cool, well-ventilated areas while eating',
        'Ginger helps - try ginger tea, ginger ale, or candied ginger'
      ],
      shoppingList: [
        'White bread',
        'White rice',
        'Ginger (fresh or tea)',
        'Chicken broth',
        'Saltine crackers',
        'Plain pretzels',
        'Applesauce',
        'Ginger ale'
      ]
    },
    {
      id: 'high-sodium',
      name: 'High-Sodium POTS Day',
      description: 'Maximize salt intake to support blood volume',
      icon: Flame,
      color: 'red',
      targetSodium: 6000,
      meals: {
        breakfast: [
          'Scrambled eggs with extra salt',
          'Salty bacon or sausage',
          'Toast with salted butter',
          'Electrolyte drink'
        ],
        lunch: [
          'Instant ramen with full seasoning packet',
          'Add extra salt',
          'Pickles on the side',
          'Salted chips'
        ],
        dinner: [
          'Heavily salted chicken broth',
          'Canned soup (high sodium variety)',
          'Salted crackers',
          'Salty cheese and crackers'
        ],
        snacks: [
          'Pickle juice shots',
          'Salted nuts',
          'Olives',
          'Pretzels with salt',
          'Electrolyte drinks'
        ]
      },
      tips: [
        'Drink 2.5-3L of water throughout the day',
        'Space out salt intake - don\'t consume all at once',
        'Track your sodium to ensure you hit 4-6g goal',
        'Take electrolyte drinks with meals',
        'Keep salted snacks accessible all day'
      ],
      shoppingList: [
        'Instant ramen',
        'Chicken broth',
        'Pickles and pickle juice',
        'Salted nuts',
        'Pretzels',
        'Electrolyte drinks',
        'Canned soup',
        'Olives',
        'Bacon',
        'Extra salt'
      ]
    },
    {
      id: 'low-energy',
      name: 'Low-Energy Day',
      description: 'Minimal prep meals for low-spoon days',
      icon: Battery,
      color: 'yellow',
      targetSodium: 3000,
      meals: {
        breakfast: [
          'Instant oatmeal (microwave)',
          'Banana',
          'Pre-made smoothie or protein shake'
        ],
        lunch: [
          'Microwave mac and cheese',
          'Canned soup (heat and eat)',
          'Pre-made sandwich from fridge'
        ],
        dinner: [
          'Rotisserie chicken (pre-cooked)',
          'Microwavable rice',
          'Frozen vegetables (steam in bag)',
          'OR: Delivery/takeout'
        ],
        snacks: [
          'Granola bars',
          'String cheese',
          'Yogurt cups',
          'Crackers and pre-sliced cheese',
          'Fruit cups'
        ]
      },
      tips: [
        'Use paper plates to avoid dishes',
        'Keep pre-prepped snacks at bedside',
        'Delivery/takeout is valid self-care',
        'Batch cook on good days for low-energy days',
        'Accept help from partner/friends',
        'Nutrition bars are better than nothing'
      ],
      shoppingList: [
        'Instant oatmeal',
        'Canned soup',
        'Microwave meals',
        'Rotisserie chicken',
        'Microwavable rice',
        'Frozen steam-in-bag vegetables',
        'Granola bars',
        'Yogurt',
        'String cheese'
      ]
    },
    {
      id: 'comfort',
      name: 'Comfort Day',
      description: 'Soothing, nostalgic foods for emotional support',
      icon: Heart,
      color: 'pink',
      targetSodium: 2500,
      meals: {
        breakfast: [
          'Fluffy pancakes with syrup',
          'Scrambled eggs',
          'Bacon or sausage',
          'Hot chocolate'
        ],
        lunch: [
          'Grilled cheese sandwich',
          'Tomato soup',
          'Mac and cheese'
        ],
        dinner: [
          'Meatloaf or pot roast',
          'Mashed potatoes',
          'Comfort food of choice',
          'Warm bread'
        ],
        snacks: [
          'Ice cream',
          'Cookies',
          'Popcorn',
          'Comfort snacks from childhood'
        ]
      },
      tips: [
        'No guilt - comfort food serves a purpose',
        'Eat while watching comfort shows/movies',
        'Share with loved ones if able',
        'Make it special - use nice dishes, candles',
        'Leftovers are future comfort'
      ],
      shoppingList: [
        'Pancake mix',
        'Eggs',
        'Bread and cheese',
        'Canned tomato soup',
        'Mac and cheese ingredients',
        'Mashed potato ingredients',
        'Ice cream',
        'Your favorite comfort snacks'
      ]
    },
    {
      id: 'anti-inflammatory',
      name: 'Anti-Inflammatory Day',
      description: 'Foods to reduce inflammation and pain',
      icon: Sparkles,
      color: 'purple',
      targetSodium: 2000,
      meals: {
        breakfast: [
          'Oatmeal with berries and cinnamon',
          'Turmeric golden milk',
          'Walnuts'
        ],
        lunch: [
          'Large salad with leafy greens',
          'Grilled salmon or chickpeas',
          'Olive oil dressing',
          'Avocado'
        ],
        dinner: [
          'Turmeric curry (chicken or chickpea)',
          'Brown rice or quinoa',
          'Steamed broccoli',
          'Green tea'
        ],
        snacks: [
          'Berries (blueberries, strawberries)',
          'Dark chocolate (70%+)',
          'Almonds',
          'Ginger tea'
        ]
      },
      tips: [
        'Focus on omega-3 rich foods (salmon, walnuts, flax)',
        'Add turmeric to everything possible',
        'Eat the rainbow - colorful vegetables',
        'Minimize processed foods and sugar',
        'Stay hydrated with water and herbal teas',
        'Include ginger and garlic often'
      ],
      shoppingList: [
        'Berries',
        'Leafy greens',
        'Salmon',
        'Chickpeas',
        'Turmeric',
        'Ginger',
        'Olive oil',
        'Nuts',
        'Dark chocolate',
        'Green tea'
      ]
    },
    {
      id: 'good-energy',
      name: 'Good-Energy Day',
      description: 'Balanced, nourishing meals when feeling well',
      icon: Sun,
      color: 'orange',
      targetSodium: 3500,
      meals: {
        breakfast: [
          'Veggie omelet',
          'Whole grain toast with avocado',
          'Fresh fruit',
          'Coffee or tea'
        ],
        lunch: [
          'Buddha bowl (quinoa, veggies, protein)',
          'Side salad',
          'Hummus and vegetables'
        ],
        dinner: [
          'Grilled chicken or tofu',
          'Roasted vegetables',
          'Sweet potato or brown rice',
          'Side salad'
        ],
        snacks: [
          'Apple with peanut butter',
          'Trail mix',
          'Veggies and hummus',
          'Smoothie'
        ]
      },
      tips: [
        'Cook extra for meal prep',
        'Try new recipes while you have energy',
        'Prep ingredients for low-energy days',
        'Enjoy the cooking process',
        'Batch cook and freeze portions'
      ],
      shoppingList: [
        'Fresh vegetables',
        'Lean proteins',
        'Whole grains',
        'Fresh fruit',
        'Quinoa',
        'Sweet potatoes',
        'Hummus',
        'Nuts and seeds'
      ]
    },
    {
      id: 'hydration',
      name: 'Hydration Focus Day',
      description: 'Liquid-based meals for maximum fluid intake',
      icon: AlertCircle,
      color: 'cyan',
      targetSodium: 4000,
      meals: {
        breakfast: [
          'Smoothie (fruit, yogurt, protein powder)',
          'Watermelon',
          'Coconut water'
        ],
        lunch: [
          'Chicken or vegetable broth (2 cups)',
          'Tomato soup',
          'Cucumber and melon'
        ],
        dinner: [
          'Miso soup',
          'Pho or ramen with lots of broth',
          'Herbal tea'
        ],
        snacks: [
          'Watermelon, grapes, oranges',
          'Popsicles',
          'Jello',
          'Electrolyte drinks'
        ]
      },
      tips: [
        'Aim for 3-4L total fluid intake',
        'Add salt to broths for electrolytes',
        'Water-rich fruits count toward hydration',
        'Carry water bottle everywhere',
        'Set hourly reminders to drink'
      ],
      shoppingList: [
        'Broth (chicken, vegetable)',
        'Watermelon',
        'Grapes',
        'Oranges',
        'Coconut water',
        'Electrolyte drinks',
        'Herbal teas',
        'Popsicles',
        'Soup ingredients'
      ]
    },
    {
      id: 'partner-care',
      name: 'Partner-Care Day',
      description: 'Easy meals your partner can make or you can share',
      icon: Users,
      color: 'green',
      targetSodium: 3000,
      meals: {
        breakfast: [
          'Scrambled eggs and toast (partner makes)',
          'Yogurt parfait (easy assembly)',
          'Breakfast sandwich'
        ],
        lunch: [
          'Sandwiches (partner prepares)',
          'Canned soup (just heat)',
          'Leftovers from dinner'
        ],
        dinner: [
          'Slow cooker meal (set it and forget it)',
          'Sheet pan dinner (minimal effort)',
          'Takeout/delivery (guilt-free)'
        ],
        snacks: [
          'Pre-cut fruit and cheese',
          'Crackers and spreads',
          'Trail mix',
          'Whatever partner brings'
        ]
      },
      tips: [
        'Communicate needs clearly to partner',
        'Show appreciation - care is exhausting',
        'Keep simple recipes accessible',
        'Delivery/takeout is loving too',
        'No guilt about needing help',
        'Batch cook together on good days'
      ],
      shoppingList: [
        'Sandwich ingredients',
        'Canned soup',
        'Slow cooker meal kits',
        'Sheet pan ingredients',
        'Easy snacks',
        'Partner\'s favorite comfort foods too'
      ]
    },
    {
      id: 'grief-stress',
      name: 'Grief/Stress Day',
      description: 'Gentle, grounding foods for emotional difficult days',
      icon: Cloud,
      color: 'indigo',
      targetSodium: 2500,
      meals: {
        breakfast: [
          'Warm oatmeal with honey',
          'Chamomile tea',
          'Toast with comfort spread'
        ],
        lunch: [
          'Soup (homemade or canned)',
          'Grilled cheese',
          'Comfort food from childhood'
        ],
        dinner: [
          'Whatever sounds good - no pressure',
          'Leftovers are fine',
          'Delivery/takeout without guilt',
          'Or just snacks - that\'s okay too'
        ],
        snacks: [
          'Whatever brings comfort',
          'Ice cream',
          'Cookies',
          'Herbal tea',
          'No judgment zone'
        ]
      },
      tips: [
        'Nutrition is secondary to emotional survival',
        'Eating anything is better than nothing',
        'No guilt about comfort food or delivery',
        'Let others help with food',
        'Hydrate - even if just tea or broth',
        'Small portions, frequent meals if that\'s easier'
      ],
      shoppingList: [
        'Comfort foods specific to you',
        'Herbal tea',
        'Easy soups',
        'Grilled cheese ingredients',
        'Ice cream',
        'Whatever helps you cope',
        'Keep takeout menus handy'
      ]
    },
    {
      id: 'kitchen-reset',
      name: 'Kitchen Reset Day',
      description: 'Use up leftovers and pantry items, meal prep for week',
      icon: ChefHat,
      color: 'teal',
      targetSodium: 3000,
      meals: {
        breakfast: [
          'Use up eggs, bread, fruit',
          'Make breakfast burritos to freeze'
        ],
        lunch: [
          'Leftover remix bowl',
          'Pantry pasta',
          'Whatever needs eating'
        ],
        dinner: [
          'Sheet pan "everything" roast',
          'Fried rice with all the veggies',
          'Soup with leftover proteins and veggies'
        ],
        snacks: [
          'Prep veggie sticks for week',
          'Portion out nuts and trail mix',
          'Wash and prep fruit'
        ]
      },
      tips: [
        'Check fridge for items expiring soon',
        'Batch cook and freeze portions',
        'Prep ingredients for easy assembly later',
        'Make a big pot of soup or chili to freeze',
        'Wash and cut vegetables for the week',
        'Cook rice/quinoa in bulk',
        'Freeze single portions in containers'
      ],
      shoppingList: [
        'Freezer containers',
        'Soup ingredients',
        'Rice/quinoa in bulk',
        'Whatever you\'re low on',
        'Fresh vegetables for prep',
        'Meal prep containers'
      ]
    }
  ];

  const copyShoppingList = (plan: MealPlan) => {
    const text = `Shopping List: ${plan.name}\n\n${plan.shoppingList.map(item => `• ${item}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Shopping list copied to clipboard');
  };

  return (
    <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-6 rounded-xl border border-yellow-500/30">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Adaptive Meal Planning</h2>
      </div>

      <p className="text-yellow-300 mb-6">
        Choose a meal plan based on how you're feeling today. Each plan is designed to support your specific needs.
      </p>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {mealPlans.map(plan => {
          const Icon = plan.icon;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`bg-black/40 p-4 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                selectedPlan?.id === plan.id
                  ? `border-${plan.color}-500/70 bg-${plan.color}-900/20`
                  : 'border-yellow-500/20 hover:border-yellow-500/40'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-6 h-6 text-${plan.color}-400`} />
                <h3 className="text-white font-bold">{plan.name}</h3>
              </div>
              <p className="text-sm text-gray-300">{plan.description}</p>
              <div className="flex items-center gap-2 mt-3 text-xs">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300">Target: {plan.targetSodium}mg sodium</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Plan Details */}
      {selectedPlan && (
        <div className="bg-black/60 p-6 rounded-lg border border-yellow-500/30 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedPlan.name}</h3>
              <p className="text-yellow-300">{selectedPlan.description}</p>
            </div>
            <button
              onClick={() => copyShoppingList(selectedPlan)}
              className="px-4 py-2 bg-blue-600/30 hover:bg-blue-500/40 text-blue-300 font-semibold rounded-lg transition-colors text-sm"
            >
              Copy Shopping List
            </button>
          </div>

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold">Daily Sodium Target</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{selectedPlan.targetSodium}mg</p>
          </div>

          {/* Meal Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Breakfast
              </h4>
              <ul className="space-y-2">
                {selectedPlan.meals.breakfast.map((item, idx) => (
                  <li key={idx} className="text-white text-sm flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Lunch
              </h4>
              <ul className="space-y-2">
                {selectedPlan.meals.lunch.map((item, idx) => (
                  <li key={idx} className="text-white text-sm flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Dinner
              </h4>
              <ul className="space-y-2">
                {selectedPlan.meals.dinner.map((item, idx) => (
                  <li key={idx} className="text-white text-sm flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Snacks
              </h4>
              <ul className="space-y-2">
                {selectedPlan.meals.snacks.map((item, idx) => (
                  <li key={idx} className="text-white text-sm flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-3">Tips & Reminders</h4>
            <ul className="space-y-2">
              {selectedPlan.tips.map((tip, idx) => (
                <li key={idx} className="text-white text-sm flex items-start gap-2">
                  <span className="text-blue-400">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Shopping List */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-3">Shopping List</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selectedPlan.shoppingList.map((item, idx) => (
                <div key={idx} className="text-white text-sm flex items-center gap-2">
                  <span className="text-green-400">□</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
        <p className="text-yellow-300 text-xs">
          <span className="font-bold">Adaptive Plans:</span> These templates are suggestions, not rules. Adjust based on your needs, preferences, and what you have available. The best meal plan is the one you'll actually follow.
        </p>
      </div>
    </div>
  );
};

export default MealPlanner;
