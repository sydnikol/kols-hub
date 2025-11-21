import React, { useState, useEffect } from 'react';
import { ChefHat, Utensils, BookOpen, Star, Plus, Trash2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Recipe {
  id: string;
  name: string;
  cuisine: 'italian' | 'mexican' | 'chinese' | 'indian' | 'american' | 'french' | 'japanese' | 'thai' | 'mediterranean' | 'other';
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'appetizer' | 'beverage' | 'other';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  prepTime: number; // minutes
  cookTime: number;
  servings: number;
  rating?: number; // 1-5
  ingredients: string[];
  instructions: string;
  notes: string;
  favorite: boolean;
}

interface MealPlan {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeName: string;
  servings: number;
  cooked: boolean;
  notes: string;
}

interface CookingSession {
  id: string;
  recipeName: string;
  date: string;
  duration: number; // minutes
  success: boolean;
  rating: number; // 1-5
  modifications: string;
  wouldMakeAgain: boolean;
  notes: string;
}

const CookingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'meal-plan' | 'sessions' | 'stats'>('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [sessions, setSessions] = useState<CookingSession[]>([]);

  useEffect(() => {
    const savedRecipes = localStorage.getItem('cookingRecipes');
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
    const savedMealPlans = localStorage.getItem('mealPlans');
    if (savedMealPlans) setMealPlans(JSON.parse(savedMealPlans));
    const savedSessions = localStorage.getItem('cookingSessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => { localStorage.setItem('cookingRecipes', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('mealPlans', JSON.stringify(mealPlans)); }, [mealPlans]);
  useEffect(() => { localStorage.setItem('cookingSessions', JSON.stringify(sessions)); }, [sessions]);

  const addRecipe = () => {
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: '',
      cuisine: 'other',
      category: 'dinner',
      difficulty: 'medium',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      ingredients: [],
      instructions: '',
      notes: '',
      favorite: false,
    };
    setRecipes([...recipes, newRecipe]);
    toast.success('Recipe added');
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Recipe updated');
  };

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter(r => r.id !== id));
    toast.success('Recipe deleted');
  };

  const addMealPlan = () => {
    const newMealPlan: MealPlan = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mealType: 'dinner',
      recipeName: '',
      servings: 4,
      cooked: false,
      notes: '',
    };
    setMealPlans([...mealPlans, newMealPlan]);
    toast.success('Meal plan added');
  };

  const updateMealPlan = (id: string, updates: Partial<MealPlan>) => {
    setMealPlans(mealPlans.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Meal plan updated');
  };

  const deleteMealPlan = (id: string) => {
    setMealPlans(mealPlans.filter(m => m.id !== id));
    toast.success('Meal plan deleted');
  };

  const addSession = () => {
    const newSession: CookingSession = {
      id: Date.now().toString(),
      recipeName: '',
      date: new Date().toISOString().split('T')[0],
      duration: 45,
      success: true,
      rating: 3,
      modifications: '',
      wouldMakeAgain: true,
      notes: '',
    };
    setSessions([...sessions, newSession]);
    toast.success('Cooking session added');
  };

  const updateSession = (id: string, updates: Partial<CookingSession>) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Session updated');
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success('Session deleted');
  };

  const favoriteRecipes = recipes.filter(r => r.favorite).length;
  const upcomingMeals = mealPlans.filter(m => !m.cooked && new Date(m.date) >= new Date()).length;
  const totalSessions = sessions.length;
  const avgRating = recipes.filter(r => r.rating).length > 0
    ? (recipes.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / recipes.filter(r => r.rating).length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pb-20">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <ChefHat className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Cooking Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{recipes.length}</div>
            <div className="text-xs opacity-90">Recipes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{favoriteRecipes}</div>
            <div className="text-xs opacity-90">Favorites</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Utensils className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{upcomingMeals}</div>
            <div className="text-xs opacity-90">Planned</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalSessions}</div>
            <div className="text-xs opacity-90">Sessions</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'recipes', label: 'Recipes', icon: BookOpen },
            { id: 'meal-plan', label: 'Meal Plan', icon: Utensils },
            { id: 'sessions', label: 'Sessions', icon: ChefHat },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'recipes' && (
          <div className="space-y-4">
            <button onClick={addRecipe} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Recipe</span>
            </button>
            {recipes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No recipes yet. Start your cookbook!</p>
              </div>
            ) : (
              recipes.sort((a, b) => {
                if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
                return a.name.localeCompare(b.name);
              }).map(recipe => (
                <div key={recipe.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${recipe.favorite ? 'border-red-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={recipe.name} onChange={(e) => updateRecipe(recipe.id, { name: e.target.value })} placeholder="Recipe name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none w-full mb-2" />
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={recipe.favorite} onChange={(e) => updateRecipe(recipe.id, { favorite: e.target.checked })} className="w-4 h-4" />
                        <label className="text-sm text-gray-600">Favorite</label>
                      </div>
                    </div>
                    <button onClick={() => deleteRecipe(recipe.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={recipe.cuisine} onChange={(e) => updateRecipe(recipe.id, { cuisine: e.target.value as Recipe['cuisine'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none">
                      <option value="italian">Italian</option>
                      <option value="mexican">Mexican</option>
                      <option value="chinese">Chinese</option>
                      <option value="indian">Indian</option>
                      <option value="american">American</option>
                      <option value="french">French</option>
                      <option value="japanese">Japanese</option>
                      <option value="thai">Thai</option>
                      <option value="mediterranean">Mediterranean</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={recipe.category} onChange={(e) => updateRecipe(recipe.id, { category: e.target.value as Recipe['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none">
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="dessert">Dessert</option>
                      <option value="appetizer">Appetizer</option>
                      <option value="beverage">Beverage</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={recipe.difficulty} onChange={(e) => updateRecipe(recipe.id, { difficulty: e.target.value as Recipe['difficulty'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                    <input type="number" value={recipe.servings} onChange={(e) => updateRecipe(recipe.id, { servings: parseInt(e.target.value) || 0 })} placeholder="Servings..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" />
                    <input type="number" value={recipe.prepTime} onChange={(e) => updateRecipe(recipe.id, { prepTime: parseInt(e.target.value) || 0 })} placeholder="Prep time (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" />
                    <input type="number" value={recipe.cookTime} onChange={(e) => updateRecipe(recipe.id, { cookTime: parseInt(e.target.value) || 0 })} placeholder="Cook time (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" />
                  </div>
                  {recipe.rating !== undefined && (
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-2">Rating: {recipe.rating}/5</label>
                      <input type="range" min="1" max="5" value={recipe.rating} onChange={(e) => updateRecipe(recipe.id, { rating: parseInt(e.target.value) })} className="w-full" />
                    </div>
                  )}
                  <textarea value={recipe.instructions} onChange={(e) => updateRecipe(recipe.id, { instructions: e.target.value })} placeholder="Instructions..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none mb-2" rows={3} />
                  <textarea value={recipe.notes} onChange={(e) => updateRecipe(recipe.id, { notes: e.target.value })} placeholder="Notes, tips..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'meal-plan' && (
          <div className="space-y-4">
            <button onClick={addMealPlan} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Meal</span>
            </button>
            {mealPlans.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(meal => (
              <div key={meal.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${meal.cooked ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={meal.date} onChange={(e) => updateMealPlan(meal.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-red-500 outline-none w-full mb-1" />
                    <input type="text" value={meal.recipeName} onChange={(e) => updateMealPlan(meal.id, { recipeName: e.target.value })} placeholder="Recipe name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteMealPlan(meal.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={meal.mealType} onChange={(e) => updateMealPlan(meal.id, { mealType: e.target.value as MealPlan['mealType'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                  <input type="number" value={meal.servings} onChange={(e) => updateMealPlan(meal.id, { servings: parseInt(e.target.value) || 0 })} placeholder="Servings..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" />
                  <div className="flex items-center space-x-2 col-span-2">
                    <input type="checkbox" checked={meal.cooked} onChange={(e) => updateMealPlan(meal.id, { cooked: e.target.checked })} className="w-5 h-5" />
                    <label className="text-sm text-gray-600">Cooked</label>
                  </div>
                </div>
                <textarea value={meal.notes} onChange={(e) => updateMealPlan(meal.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <button onClick={addSession} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Session</span>
            </button>
            {sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(session => (
              <div key={session.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${session.success ? 'border-green-500' : 'border-orange-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={session.date} onChange={(e) => updateSession(session.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-red-500 outline-none w-full mb-1" />
                    <input type="text" value={session.recipeName} onChange={(e) => updateSession(session.id, { recipeName: e.target.value })} placeholder="Recipe name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteSession(session.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="number" value={session.duration} onChange={(e) => updateSession(session.id, { duration: parseInt(e.target.value) || 0 })} placeholder="Duration (min)..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={session.success} onChange={(e) => updateSession(session.id, { success: e.target.checked })} className="w-5 h-5" />
                    <label className="text-sm text-gray-600">Success</label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-2">Rating: {session.rating}/5</label>
                  <input type="range" min="1" max="5" value={session.rating} onChange={(e) => updateSession(session.id, { rating: parseInt(e.target.value) })} className="w-full" />
                </div>
                <textarea value={session.notes} onChange={(e) => updateSession(session.id, { notes: e.target.value })} placeholder="Notes, what went well..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Cooking Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Recipes:</span>
                  <span className="font-semibold">{recipes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Recipes:</span>
                  <span className="font-semibold">{favoriteRecipes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Recipe Rating:</span>
                  <span className="font-semibold">{avgRating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming Meals:</span>
                  <span className="font-semibold">{upcomingMeals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Meals Planned:</span>
                  <span className="font-semibold">{mealPlans.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cooking Sessions:</span>
                  <span className="font-semibold">{totalSessions}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookingHubPage;
