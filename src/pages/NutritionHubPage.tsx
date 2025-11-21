import React, { useState, useEffect } from 'react';
import { Apple, UtensilsCrossed, Target, TrendingUp, Calendar, Plus, Edit2, Trash2, Star, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Meal {
  id: string;
  date: string;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  hydration?: number; // ounces of water
  notes: string;
  satisfactionLevel: number; // 1-5
}

interface FoodItem {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'fruit' | 'grain' | 'dairy' | 'fat' | 'snack' | 'beverage' | 'other';
  servingSize: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  safe: boolean; // safe for dietary restrictions
  favorite: boolean;
  notes: string;
}

interface NutritionGoal {
  id: string;
  goal: string;
  type: 'calories' | 'protein' | 'hydration' | 'vegetables' | 'meal-timing' | 'supplements' | 'other';
  target: string;
  currentProgress: number;
  targetValue: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  active: boolean;
}

interface DietaryRestriction {
  id: string;
  restriction: string;
  type: 'allergy' | 'intolerance' | 'preference' | 'medical' | 'religious' | 'ethical';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  symptoms?: string[];
  alternatives: string[];
  notes: string;
}

interface MealPlan {
  id: string;
  name: string;
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  totalCalories?: number;
  prepTime?: number;
  notes: string;
}

const NutritionHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'meals' | 'foods' | 'goals' | 'restrictions' | 'plans'>('meals');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [goals, setGoals] = useState<NutritionGoal[]>([]);
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem('nutritionMeals');
    const savedFoods = localStorage.getItem('foodItems');
    const savedGoals = localStorage.getItem('nutritionGoals');
    const savedRestrictions = localStorage.getItem('dietaryRestrictions');
    const savedPlans = localStorage.getItem('mealPlans');

    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedFoods) setFoods(JSON.parse(savedFoods));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedRestrictions) setRestrictions(JSON.parse(savedRestrictions));
    if (savedPlans) setMealPlans(JSON.parse(savedPlans));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nutritionMeals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('nutritionGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('dietaryRestrictions', JSON.stringify(restrictions));
  }, [restrictions]);

  useEffect(() => {
    localStorage.setItem('mealPlans', JSON.stringify(mealPlans));
  }, [mealPlans]);

  const addMeal = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      type: 'breakfast',
      foods: [],
      hydration: 0,
      notes: '',
      satisfactionLevel: 3,
    };
    setMeals([...meals, newMeal]);
    toast.success('Meal logged');
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    setMeals(meals.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Meal updated');
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
    toast.success('Meal deleted');
  };

  const addFood = () => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: '',
      category: 'other',
      servingSize: '',
      safe: true,
      favorite: false,
      notes: '',
    };
    setFoods([...foods, newFood]);
    toast.success('Food added');
  };

  const updateFood = (id: string, updates: Partial<FoodItem>) => {
    setFoods(foods.map(f => f.id === id ? { ...f, ...updates } : f));
    toast.success('Food updated');
  };

  const deleteFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
    toast.success('Food deleted');
  };

  const addGoal = () => {
    const newGoal: NutritionGoal = {
      id: Date.now().toString(),
      goal: '',
      type: 'calories',
      target: '',
      currentProgress: 0,
      targetValue: 100,
      frequency: 'daily',
      active: true,
    };
    setGoals([...goals, newGoal]);
    toast.success('Goal added');
  };

  const updateGoal = (id: string, updates: Partial<NutritionGoal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const addRestriction = () => {
    const newRestriction: DietaryRestriction = {
      id: Date.now().toString(),
      restriction: '',
      type: 'preference',
      severity: 'mild',
      alternatives: [],
      notes: '',
    };
    setRestrictions([...restrictions, newRestriction]);
    toast.success('Restriction added');
  };

  const updateRestriction = (id: string, updates: Partial<DietaryRestriction>) => {
    setRestrictions(restrictions.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Restriction updated');
  };

  const deleteRestriction = (id: string) => {
    setRestrictions(restrictions.filter(r => r.id !== id));
    toast.success('Restriction deleted');
  };

  const addMealPlan = () => {
    const newPlan: MealPlan = {
      id: Date.now().toString(),
      name: '',
      day: new Date().toISOString().split('T')[0],
      meals: {
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: [],
      },
      notes: '',
    };
    setMealPlans([...mealPlans, newPlan]);
    toast.success('Meal plan added');
  };

  const updateMealPlan = (id: string, updates: Partial<MealPlan>) => {
    setMealPlans(mealPlans.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Meal plan updated');
  };

  const deleteMealPlan = (id: string) => {
    setMealPlans(mealPlans.filter(p => p.id !== id));
    toast.success('Meal plan deleted');
  };

  const mealsToday = meals.filter(m => m.date === new Date().toISOString().split('T')[0]).length;
  const activeGoals = goals.filter(g => g.active).length;
  const safeFood = foods.filter(f => f.safe).length;
  const criticalRestrictions = restrictions.filter(r => r.severity === 'life-threatening' || r.severity === 'severe').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Apple className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Nutrition Hub</h1>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <UtensilsCrossed className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{mealsToday}</div>
            <div className="text-xs opacity-90">Meals Today</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeGoals}</div>
            <div className="text-xs opacity-90">Active Goals</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{safeFood}</div>
            <div className="text-xs opacity-90">Safe Foods</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{criticalRestrictions}</div>
            <div className="text-xs opacity-90">Critical</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'meals', label: 'Meals', icon: UtensilsCrossed },
            { id: 'foods', label: 'Foods', icon: Apple },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'restrictions', label: 'Restrictions', icon: Star },
            { id: 'plans', label: 'Meal Plans', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Meals Tab */}
        {activeTab === 'meals' && (
          <div className="space-y-4">
            <button
              onClick={addMeal}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Log Meal</span>
            </button>

            {meals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No meals logged yet. Start tracking your nutrition!</p>
              </div>
            ) : (
              meals.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()).map(meal => (
                <div key={meal.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="date"
                          value={meal.date}
                          onChange={(e) => updateMeal(meal.id, { date: e.target.value })}
                          className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                        />
                        <input
                          type="time"
                          value={meal.time}
                          onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                          className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                        />
                      </div>
                      <select
                        value={meal.type}
                        onChange={(e) => updateMeal(meal.id, { type: e.target.value as Meal['type'] })}
                        className="w-full text-lg font-semibold bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                    <button onClick={() => deleteMeal(meal.id)} className="text-red-500 hover:text-red-700 ml-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="number"
                      value={meal.calories || ''}
                      onChange={(e) => updateMeal(meal.id, { calories: parseInt(e.target.value) || undefined })}
                      placeholder="Calories..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="number"
                      value={meal.protein || ''}
                      onChange={(e) => updateMeal(meal.id, { protein: parseInt(e.target.value) || undefined })}
                      placeholder="Protein (g)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="number"
                      value={meal.hydration || ''}
                      onChange={(e) => updateMeal(meal.id, { hydration: parseInt(e.target.value) || undefined })}
                      placeholder="Water (oz)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Satisfaction: {meal.satisfactionLevel}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateMeal(meal.id, { satisfactionLevel: level })}
                          className={`w-10 h-10 rounded ${level <= meal.satisfactionLevel ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={meal.notes}
                    onChange={(e) => updateMeal(meal.id, { notes: e.target.value })}
                    placeholder="What did you eat? Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div className="space-y-4">
            <button
              onClick={addFood}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Food Item</span>
            </button>

            {foods.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Apple className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No foods saved yet. Build your food database!</p>
              </div>
            ) : (
              foods.map(food => (
                <div key={food.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${food.safe ? 'border-green-500' : 'border-red-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => updateFood(food.id, { name: e.target.value })}
                      placeholder="Food name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateFood(food.id, { favorite: !food.favorite })}
                        className={food.favorite ? 'text-green-500' : 'text-gray-300'}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                      <button onClick={() => deleteFood(food.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select
                      value={food.category}
                      onChange={(e) => updateFood(food.id, { category: e.target.value as FoodItem['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="protein">Protein</option>
                      <option value="vegetable">Vegetable</option>
                      <option value="fruit">Fruit</option>
                      <option value="grain">Grain</option>
                      <option value="dairy">Dairy</option>
                      <option value="fat">Fat</option>
                      <option value="snack">Snack</option>
                      <option value="beverage">Beverage</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={food.servingSize}
                      onChange={(e) => updateFood(food.id, { servingSize: e.target.value })}
                      placeholder="Serving size..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={food.notes}
                    onChange={(e) => updateFood(food.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none mb-2"
                    rows={2}
                  />

                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={food.safe}
                      onChange={(e) => updateFood(food.id, { safe: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Safe for my dietary needs</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <button
              onClick={addGoal}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Nutrition Goal</span>
            </button>

            {goals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No goals yet. Set your nutrition targets!</p>
              </div>
            ) : (
              goals.map(goal => (
                <div key={goal.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${goal.active ? 'border-green-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={goal.goal}
                      onChange={(e) => updateGoal(goal.id, { goal: e.target.value })}
                      placeholder="Goal description..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={goal.type}
                      onChange={(e) => updateGoal(goal.id, { type: e.target.value as NutritionGoal['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="calories">Calories</option>
                      <option value="protein">Protein</option>
                      <option value="hydration">Hydration</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="meal-timing">Meal Timing</option>
                      <option value="supplements">Supplements</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={goal.frequency}
                      onChange={(e) => updateGoal(goal.id, { frequency: e.target.value as NutritionGoal['frequency'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Progress: {goal.currentProgress}% of {goal.targetValue}</label>
                    <input
                      type="range"
                      min="0"
                      max={goal.targetValue}
                      value={goal.currentProgress}
                      onChange={(e) => updateGoal(goal.id, { currentProgress: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={goal.active}
                      onChange={(e) => updateGoal(goal.id, { active: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Active goal</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Restrictions Tab */}
        {activeTab === 'restrictions' && (
          <div className="space-y-4">
            <button
              onClick={addRestriction}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Dietary Restriction</span>
            </button>

            {restrictions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No restrictions logged. Track your dietary needs!</p>
              </div>
            ) : (
              restrictions.map(restriction => (
                <div key={restriction.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${restriction.severity === 'life-threatening' ? 'border-red-500' : restriction.severity === 'severe' ? 'border-orange-500' : 'border-green-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={restriction.restriction}
                      onChange={(e) => updateRestriction(restriction.id, { restriction: e.target.value })}
                      placeholder="Restriction..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteRestriction(restriction.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <select
                      value={restriction.type}
                      onChange={(e) => updateRestriction(restriction.id, { type: e.target.value as DietaryRestriction['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="allergy">Allergy</option>
                      <option value="intolerance">Intolerance</option>
                      <option value="preference">Preference</option>
                      <option value="medical">Medical</option>
                      <option value="religious">Religious</option>
                      <option value="ethical">Ethical</option>
                    </select>
                    <select
                      value={restriction.severity}
                      onChange={(e) => updateRestriction(restriction.id, { severity: e.target.value as DietaryRestriction['severity'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                      <option value="life-threatening">Life-Threatening</option>
                    </select>
                  </div>

                  <textarea
                    value={restriction.notes}
                    onChange={(e) => updateRestriction(restriction.id, { notes: e.target.value })}
                    placeholder="Notes, symptoms, alternatives..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Meal Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <button
              onClick={addMealPlan}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Meal Plan</span>
            </button>

            {mealPlans.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No meal plans yet. Plan your nutrition ahead!</p>
              </div>
            ) : (
              mealPlans.map(plan => (
                <div key={plan.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => updateMealPlan(plan.id, { name: e.target.value })}
                      placeholder="Plan name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteMealPlan(plan.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <input
                    type="date"
                    value={plan.day}
                    onChange={(e) => updateMealPlan(plan.id, { day: e.target.value })}
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none mb-3"
                  />

                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={plan.meals.breakfast}
                      onChange={(e) => updateMealPlan(plan.id, { meals: { ...plan.meals, breakfast: e.target.value } })}
                      placeholder="Breakfast..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={plan.meals.lunch}
                      onChange={(e) => updateMealPlan(plan.id, { meals: { ...plan.meals, lunch: e.target.value } })}
                      placeholder="Lunch..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={plan.meals.dinner}
                      onChange={(e) => updateMealPlan(plan.id, { meals: { ...plan.meals, dinner: e.target.value } })}
                      placeholder="Dinner..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={plan.notes}
                    onChange={(e) => updateMealPlan(plan.id, { notes: e.target.value })}
                    placeholder="Notes, prep instructions..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionHubPage;
