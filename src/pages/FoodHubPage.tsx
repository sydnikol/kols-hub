import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed, ShoppingCart, Package, BookOpen, Calendar, TrendingUp,
  Search, Plus, Trash2, Edit2, Check, X, AlertCircle, Star, Clock, Camera,
  Droplet, Heart, Filter, ChefHat, Flame, Leaf, RefreshCw, Download,
  Settings, Apple, Coffee, Moon, Sun, Utensils, Target, Award
} from 'lucide-react';
import foodManagementService, {
  Recipe, PantryItem, GroceryItem, MealLog, MealPlan, WaterLog,
  FoodPreferences, NutritionInfo, Ingredient
} from '../services/food-management-service';

type TabType = 'pantry' | 'grocery' | 'meals' | 'recipes' | 'planning' | 'trends' | 'water' | 'preferences';

const FoodHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pantry');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Data State
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [preferences, setPreferences] = useState<FoodPreferences | null>(null);
  const [dailyWater, setDailyWater] = useState(0);
  const [dailyNutrition, setDailyNutrition] = useState<NutritionInfo | null>(null);

  // Form States
  const [showAddPantry, setShowAddPantry] = useState(false);
  const [showAddGrocery, setShowAddGrocery] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showRecipeDetail, setShowRecipeDetail] = useState<Recipe | null>(null);
  const [selectedRecipeFilters, setSelectedRecipeFilters] = useState({
    category: '',
    cuisine: '',
    dietary: [] as string[],
    maxPrepTime: 0,
    difficulty: ''
  });

  // New item forms
  const [newPantryItem, setNewPantryItem] = useState({
    name: '', category: 'Grains', quantity: 1, unit: 'pieces',
    expirationDate: '', location: 'pantry' as const
  });
  const [newGroceryItem, setNewGroceryItem] = useState({
    name: '', category: 'Produce', quantity: 1, unit: 'pieces',
    store: '', priority: 'medium' as const, checked: false
  });
  const [newMealLog, setNewMealLog] = useState({
    name: '', mealType: 'breakfast' as const, servings: 1,
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 },
    notes: '', mood: 'good' as const
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Seed recipes if empty
      await foodManagementService.seedRecipes();

      // Load all data
      const [
        loadedRecipes,
        loadedPantry,
        loadedGrocery,
        loadedMeals,
        loadedPrefs,
        todayWater,
        todayNutrition
      ] = await Promise.all([
        foodManagementService.getRecipes(),
        foodManagementService.getPantryItems(),
        foodManagementService.getGroceryList(),
        foodManagementService.getMealLogs(),
        foodManagementService.getPreferences(),
        foodManagementService.getDailyWater(new Date().toISOString().split('T')[0]),
        foodManagementService.getDailyNutrition(new Date().toISOString().split('T')[0])
      ]);

      setRecipes(loadedRecipes);
      setPantryItems(loadedPantry);
      setGroceryItems(loadedGrocery);
      setMealLogs(loadedMeals);
      setPreferences(loadedPrefs);
      setDailyWater(todayWater);
      setDailyNutrition(todayNutrition);

      // Load current week's meal plan
      const monday = getMonday(new Date());
      const plan = await foodManagementService.getMealPlan(monday.toISOString().split('T')[0]);
      setMealPlan(plan);
    } catch (error) {
      console.error('Failed to load food data:', error);
    }
    setLoading(false);
  };

  const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
  };

  // Pantry functions
  const addPantryItem = async () => {
    if (!newPantryItem.name) return;
    const item = await foodManagementService.addPantryItem({
      ...newPantryItem,
      purchaseDate: new Date().toISOString()
    });
    setPantryItems([...pantryItems, item]);
    setShowAddPantry(false);
    setNewPantryItem({
      name: '', category: 'Grains', quantity: 1, unit: 'pieces',
      expirationDate: '', location: 'pantry'
    });
  };

  // Grocery functions
  const addGroceryItem = async () => {
    if (!newGroceryItem.name) return;
    const item = await foodManagementService.addGroceryItem(newGroceryItem);
    setGroceryItems([...groceryItems, item]);
    setShowAddGrocery(false);
    setNewGroceryItem({
      name: '', category: 'Produce', quantity: 1, unit: 'pieces',
      store: '', priority: 'medium', checked: false
    });
  };

  const toggleGroceryItem = async (id: string) => {
    await foodManagementService.toggleGroceryChecked(id);
    setGroceryItems(items => items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const clearCheckedGroceries = async () => {
    await foodManagementService.clearCheckedGroceries();
    setGroceryItems(items => items.filter(item => !item.checked));
  };

  // Meal logging
  const logMeal = async () => {
    if (!newMealLog.name) return;
    const meal = await foodManagementService.logMeal({
      ...newMealLog,
      date: new Date().toISOString().split('T')[0]
    });
    setMealLogs([meal, ...mealLogs]);
    setShowAddMeal(false);

    // Update daily nutrition
    const updated = await foodManagementService.getDailyNutrition(new Date().toISOString().split('T')[0]);
    setDailyNutrition(updated);

    setNewMealLog({
      name: '', mealType: 'breakfast', servings: 1,
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 },
      notes: '', mood: 'good'
    });
  };

  // Water tracking
  const addWater = async (amount: number) => {
    await foodManagementService.logWater(amount);
    const updated = await foodManagementService.getDailyWater(new Date().toISOString().split('T')[0]);
    setDailyWater(updated);
  };

  // Recipe functions
  const toggleFavorite = async (id: string) => {
    await foodManagementService.toggleRecipeFavorite(id);
    setRecipes(recipes.map(r =>
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const generateGroceryFromRecipe = async (recipe: Recipe) => {
    const items = await foodManagementService.generateGroceryFromRecipe(recipe);
    setGroceryItems([...groceryItems, ...items]);
    alert(`Added ${items.length} items to grocery list!`);
  };

  // Meal plan functions
  const generateMealPlan = async () => {
    const monday = getMonday(new Date());
    const plan = await foodManagementService.generateMealPlanFromRecipes(
      monday.toISOString().split('T')[0],
      preferences || undefined
    );
    setMealPlan(plan);
  };

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'pantry', label: 'Pantry', icon: Package, color: 'green' },
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart, color: 'emerald' },
    { id: 'meals', label: 'Meals', icon: UtensilsCrossed, color: 'amber' },
    { id: 'recipes', label: 'Recipes', icon: BookOpen, color: 'orange' },
    { id: 'planning', label: 'Planning', icon: Calendar, color: 'yellow' },
    { id: 'water', label: 'Water', icon: Droplet, color: 'blue' },
    { id: 'trends', label: 'Trends', icon: TrendingUp, color: 'lime' },
    { id: 'preferences', label: 'Goals', icon: Target, color: 'purple' },
  ];

  const getExpirationStatus = (date: string) => {
    const today = new Date();
    const expDate = new Date(date);
    const daysUntilExp = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExp < 0) return { status: 'expired', color: 'red', text: 'Expired' };
    if (daysUntilExp <= 7) return { status: 'warning', color: 'yellow', text: `${daysUntilExp}d left` };
    return { status: 'good', color: 'green', text: `${daysUntilExp}d left` };
  };

  const renderPantryTracker = () => {
    const filtered = pantryItems.filter(item =>
      (filterCategory === 'all' || item.category === filterCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['all', ...new Set(pantryItems.map(item => item.category))];
    const expiringItems = pantryItems.filter(item =>
      getExpirationStatus(item.expirationDate).status === 'warning'
    );

    return (
      <div className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
            <Package className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <p className="text-2xl font-bold text-green-100">{pantryItems.length}</p>
            <p className="text-green-400/70 text-sm">Total Items</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-yellow-100">{expiringItems.length}</p>
            <p className="text-yellow-400/70 text-sm">Expiring Soon</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <Droplet className="w-8 h-8 mx-auto text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-blue-100">
              {pantryItems.filter(i => i.location === 'fridge').length}
            </p>
            <p className="text-blue-400/70 text-sm">In Fridge</p>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-center">
            <Sun className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
            <p className="text-2xl font-bold text-cyan-100">
              {pantryItems.filter(i => i.location === 'freezer').length}
            </p>
            <p className="text-cyan-400/70 text-sm">In Freezer</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
            <input
              type="text"
              placeholder="Search pantry items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100 placeholder-green-400/50 focus:outline-none focus:border-green-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100 focus:outline-none focus:border-green-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddPantry(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/30 text-green-300 rounded-lg hover:bg-green-500/40 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Add Pantry Item Modal */}
        {showAddPantry && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-green-500/30 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-green-100 mb-4">Add Pantry Item</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newPantryItem.name}
                  onChange={(e) => setNewPantryItem({ ...newPantryItem, name: e.target.value })}
                  className="w-full px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100"
                />
                <select
                  value={newPantryItem.category}
                  onChange={(e) => setNewPantryItem({ ...newPantryItem, category: e.target.value })}
                  className="w-full px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100"
                >
                  <option value="Grains">Grains</option>
                  <option value="Canned Goods">Canned Goods</option>
                  <option value="Oils">Oils</option>
                  <option value="Spreads">Spreads</option>
                  <option value="Sweeteners">Sweeteners</option>
                  <option value="Spices">Spices</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Protein">Protein</option>
                  <option value="Produce">Produce</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newPantryItem.quantity}
                    onChange={(e) => setNewPantryItem({ ...newPantryItem, quantity: Number(e.target.value) })}
                    className="w-24 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={newPantryItem.unit}
                    onChange={(e) => setNewPantryItem({ ...newPantryItem, unit: e.target.value })}
                    className="flex-1 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100"
                  />
                </div>
                <input
                  type="date"
                  value={newPantryItem.expirationDate}
                  onChange={(e) => setNewPantryItem({ ...newPantryItem, expirationDate: e.target.value })}
                  className="w-full px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100"
                />
                <select
                  value={newPantryItem.location}
                  onChange={(e) => setNewPantryItem({ ...newPantryItem, location: e.target.value as any })}
                  className="w-full px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100"
                >
                  <option value="pantry">Pantry</option>
                  <option value="fridge">Fridge</option>
                  <option value="freezer">Freezer</option>
                  <option value="counter">Counter</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddPantry(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addPantryItem}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const expStatus = getExpirationStatus(item.expirationDate);
            return (
              <div key={item.id} className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 hover:border-green-500/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-green-100 font-semibold">{item.name}</h3>
                    <p className="text-green-400/70 text-sm">{item.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    expStatus.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                    expStatus.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {expStatus.text}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-green-300">
                  <p>Quantity: {item.quantity} {item.unit}</p>
                  <p>Location: {item.location}</p>
                  <p>Expires: {new Date(item.expirationDate).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-green-400/30 mb-4" />
            <p className="text-green-400/70">No pantry items found. Add your first item!</p>
          </div>
        )}
      </div>
    );
  };

  const renderGroceryList = () => {
    const stores = ['all', ...new Set(groceryItems.map(item => item.store).filter(Boolean))];
    const filtered = groceryItems.filter(item =>
      (filterCategory === 'all' || item.store === filterCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unchecked = filtered.filter(i => !i.checked).length;
    const total = filtered.length;

    return (
      <div className="space-y-4">
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-emerald-100 font-semibold">Shopping Progress</h3>
            <span className="text-emerald-400">{total - unchecked} / {total}</span>
          </div>
          <div className="w-full bg-emerald-900/30 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all"
              style={{ width: `${total > 0 ? ((total - unchecked) / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
            <input
              type="text"
              placeholder="Search grocery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100 placeholder-emerald-400/50 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100 focus:outline-none focus:border-emerald-500"
          >
            {stores.map(store => (
              <option key={store} value={store}>{store === 'all' ? 'All Stores' : store}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddGrocery(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/30 text-emerald-300 rounded-lg hover:bg-emerald-500/40 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
          {groceryItems.some(i => i.checked) && (
            <button
              onClick={clearCheckedGroceries}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/40 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear Done
            </button>
          )}
        </div>

        {/* Add Grocery Modal */}
        {showAddGrocery && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-emerald-500/30 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-emerald-100 mb-4">Add Grocery Item</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newGroceryItem.name}
                  onChange={(e) => setNewGroceryItem({ ...newGroceryItem, name: e.target.value })}
                  className="w-full px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100"
                />
                <select
                  value={newGroceryItem.category}
                  onChange={(e) => setNewGroceryItem({ ...newGroceryItem, category: e.target.value })}
                  className="w-full px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100"
                >
                  <option value="Produce">Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Protein">Protein</option>
                  <option value="Grains">Grains</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Condiments">Condiments</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newGroceryItem.quantity}
                    onChange={(e) => setNewGroceryItem({ ...newGroceryItem, quantity: Number(e.target.value) })}
                    className="w-24 px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={newGroceryItem.unit}
                    onChange={(e) => setNewGroceryItem({ ...newGroceryItem, unit: e.target.value })}
                    className="flex-1 px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Store (optional)"
                  value={newGroceryItem.store}
                  onChange={(e) => setNewGroceryItem({ ...newGroceryItem, store: e.target.value })}
                  className="w-full px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100"
                />
                <select
                  value={newGroceryItem.priority}
                  onChange={(e) => setNewGroceryItem({ ...newGroceryItem, priority: e.target.value as any })}
                  className="w-full px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-100"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddGrocery(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addGroceryItem}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => toggleGroceryItem(item.id)}
              className={`bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-all ${
                item.checked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-emerald-500/50'
                }`}>
                  {item.checked && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-emerald-100 font-semibold ${item.checked ? 'line-through' : ''}`}>
                    {item.name}
                  </h3>
                  <p className="text-emerald-400/70 text-sm">
                    {item.category} • {item.quantity} {item.unit}
                    {item.store && ` • ${item.store}`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-emerald-400/30 mb-4" />
            <p className="text-emerald-400/70">No grocery items. Add items or generate from recipes!</p>
          </div>
        )}
      </div>
    );
  };

  const renderMealLogger = () => {
    const filtered = mealLogs.filter(log =>
      log.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        {/* Daily Nutrition Summary */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <h3 className="text-amber-100 font-semibold mb-4">Today's Nutrition</h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            <div className="text-center">
              <Flame className="w-6 h-6 mx-auto text-amber-400 mb-1" />
              <p className="text-amber-100 text-xl font-bold">{dailyNutrition?.calories || 0}</p>
              <p className="text-amber-400/70 text-xs">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-amber-100 text-xl font-bold">{dailyNutrition?.protein || 0}g</p>
              <p className="text-amber-400/70 text-xs">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-amber-100 text-xl font-bold">{dailyNutrition?.carbs || 0}g</p>
              <p className="text-amber-400/70 text-xs">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-amber-100 text-xl font-bold">{dailyNutrition?.fat || 0}g</p>
              <p className="text-amber-400/70 text-xs">Fat</p>
            </div>
            <div className="text-center">
              <p className="text-amber-100 text-xl font-bold">{dailyNutrition?.fiber || 0}g</p>
              <p className="text-amber-400/70 text-xs">Fiber</p>
            </div>
            <div className="text-center">
              <p className="text-amber-100 text-xl font-bold">{dailyNutrition?.sugar || 0}g</p>
              <p className="text-amber-400/70 text-xs">Sugar</p>
            </div>
            <div className="text-center">
              <p className={`text-xl font-bold ${(dailyNutrition?.sodium || 0) > 2300 ? 'text-red-400' : 'text-amber-100'}`}>
                {dailyNutrition?.sodium || 0}mg
              </p>
              <p className="text-amber-400/70 text-xs">Sodium</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => setShowAddMeal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/30 text-amber-300 rounded-lg hover:bg-amber-500/40 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Log Meal
          </button>
        </div>

        {/* Add Meal Modal */}
        {showAddMeal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-amber-500/30 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-amber-100 mb-4">Log Meal</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Meal name"
                  value={newMealLog.name}
                  onChange={(e) => setNewMealLog({ ...newMealLog, name: e.target.value })}
                  className="w-full px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                />
                <div className="flex gap-2">
                  <select
                    value={newMealLog.mealType}
                    onChange={(e) => setNewMealLog({ ...newMealLog, mealType: e.target.value as any })}
                    className="flex-1 px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Servings"
                    value={newMealLog.servings}
                    onChange={(e) => setNewMealLog({ ...newMealLog, servings: Number(e.target.value) })}
                    className="w-24 px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Calories"
                    value={newMealLog.nutrition.calories || ''}
                    onChange={(e) => setNewMealLog({ ...newMealLog, nutrition: { ...newMealLog.nutrition, calories: Number(e.target.value) }})}
                    className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  />
                  <input
                    type="number"
                    placeholder="Protein (g)"
                    value={newMealLog.nutrition.protein || ''}
                    onChange={(e) => setNewMealLog({ ...newMealLog, nutrition: { ...newMealLog.nutrition, protein: Number(e.target.value) }})}
                    className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  />
                  <input
                    type="number"
                    placeholder="Carbs (g)"
                    value={newMealLog.nutrition.carbs || ''}
                    onChange={(e) => setNewMealLog({ ...newMealLog, nutrition: { ...newMealLog.nutrition, carbs: Number(e.target.value) }})}
                    className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  />
                  <input
                    type="number"
                    placeholder="Fat (g)"
                    value={newMealLog.nutrition.fat || ''}
                    onChange={(e) => setNewMealLog({ ...newMealLog, nutrition: { ...newMealLog.nutrition, fat: Number(e.target.value) }})}
                    className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  />
                  <input
                    type="number"
                    placeholder="Fiber (g)"
                    value={newMealLog.nutrition.fiber || ''}
                    onChange={(e) => setNewMealLog({ ...newMealLog, nutrition: { ...newMealLog.nutrition, fiber: Number(e.target.value) }})}
                    className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  />
                  <input
                    type="number"
                    placeholder="Sodium (mg)"
                    value={newMealLog.nutrition.sodium || ''}
                    onChange={(e) => setNewMealLog({ ...newMealLog, nutrition: { ...newMealLog.nutrition, sodium: Number(e.target.value) }})}
                    className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100"
                  />
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  value={newMealLog.notes}
                  onChange={(e) => setNewMealLog({ ...newMealLog, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-100 h-20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddMeal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logMeal}
                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400"
                  >
                    Log Meal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(log => (
            <div key={log.id} className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 hover:border-amber-500/50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-amber-100 font-semibold">{log.name}</h3>
                  <p className="text-amber-400/70 text-sm flex items-center gap-2 mt-1">
                    {log.mealType === 'breakfast' && <Coffee className="w-4 h-4" />}
                    {log.mealType === 'lunch' && <Sun className="w-4 h-4" />}
                    {log.mealType === 'dinner' && <Moon className="w-4 h-4" />}
                    {log.mealType === 'snack' && <Apple className="w-4 h-4" />}
                    {log.mealType} • {new Date(log.date).toLocaleDateString()}
                  </p>
                </div>
                {log.mood && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.mood === 'great' ? 'bg-green-500/20 text-green-400' :
                    log.mood === 'good' ? 'bg-blue-500/20 text-blue-400' :
                    log.mood === 'okay' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    Mood: {log.mood}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-sm text-amber-300">
                <div>
                  <p className="text-amber-400/70 text-xs">Cal</p>
                  <p className="font-semibold">{log.nutrition.calories}</p>
                </div>
                <div>
                  <p className="text-amber-400/70 text-xs">Pro</p>
                  <p className="font-semibold">{log.nutrition.protein}g</p>
                </div>
                <div>
                  <p className="text-amber-400/70 text-xs">Carb</p>
                  <p className="font-semibold">{log.nutrition.carbs}g</p>
                </div>
                <div>
                  <p className="text-amber-400/70 text-xs">Fat</p>
                  <p className="font-semibold">{log.nutrition.fat}g</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-amber-400/70 text-xs">Fiber</p>
                  <p className="font-semibold">{log.nutrition.fiber}g</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-amber-400/70 text-xs">Sugar</p>
                  <p className="font-semibold">{log.nutrition.sugar}g</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-amber-400/70 text-xs">Na</p>
                  <p className="font-semibold">{log.nutrition.sodium}mg</p>
                </div>
              </div>
              {log.notes && (
                <p className="text-amber-300/70 text-sm italic mt-2">{log.notes}</p>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <UtensilsCrossed className="w-16 h-16 mx-auto text-amber-400/30 mb-4" />
            <p className="text-amber-400/70">No meals logged. Start tracking your nutrition!</p>
          </div>
        )}
      </div>
    );
  };

  const renderRecipeLibrary = () => {
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || recipe.category === filterCategory)
    );

    const categories = ['all', ...new Set(recipes.map(r => r.category))];
    const cuisines = [...new Set(recipes.map(r => r.cuisine))];

    return (
      <div className="space-y-4">
        {/* Recipe Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-orange-100">{recipes.length}</p>
            <p className="text-orange-400/70 text-sm">Total Recipes</p>
          </div>
          <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4 text-center">
            <Heart className="w-8 h-8 mx-auto text-pink-400 mb-2" />
            <p className="text-2xl font-bold text-pink-100">{recipes.filter(r => r.isFavorite).length}</p>
            <p className="text-pink-400/70 text-sm">Favorites</p>
          </div>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
            <Leaf className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <p className="text-2xl font-bold text-green-100">
              {recipes.filter(r => r.dietary.includes('vegetarian')).length}
            </p>
            <p className="text-green-400/70 text-sm">Vegetarian</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-yellow-100">
              {recipes.filter(r => (r.prepTime + r.cookTime) <= 30).length}
            </p>
            <p className="text-yellow-400/70 text-sm">Under 30 min</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-orange-900/20 border border-orange-500/30 rounded-lg text-orange-100 placeholder-orange-400/50 focus:outline-none focus:border-orange-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-orange-900/20 border border-orange-500/30 rounded-lg text-orange-100 focus:outline-none focus:border-orange-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {/* Recipe Detail Modal */}
        {showRecipeDetail && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-orange-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-orange-100">{showRecipeDetail.name}</h3>
                  <p className="text-orange-400/70">{showRecipeDetail.cuisine} • {showRecipeDetail.category}</p>
                </div>
                <button onClick={() => setShowRecipeDetail(null)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-orange-200 mb-4">{showRecipeDetail.description}</p>

              <div className="flex gap-4 mb-4 text-sm">
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                  Prep: {showRecipeDetail.prepTime}min
                </span>
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                  Cook: {showRecipeDetail.cookTime}min
                </span>
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                  Serves: {showRecipeDetail.servings}
                </span>
                <span className={`px-3 py-1 rounded-full ${
                  showRecipeDetail.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                  showRecipeDetail.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {showRecipeDetail.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-orange-900/20 rounded-lg">
                <div className="text-center">
                  <p className="text-orange-100 text-xl font-bold">{showRecipeDetail.nutrition.calories}</p>
                  <p className="text-orange-400/70 text-xs">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-100 text-xl font-bold">{showRecipeDetail.nutrition.protein}g</p>
                  <p className="text-orange-400/70 text-xs">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-100 text-xl font-bold">{showRecipeDetail.nutrition.carbs}g</p>
                  <p className="text-orange-400/70 text-xs">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-100 text-xl font-bold">{showRecipeDetail.nutrition.fat}g</p>
                  <p className="text-orange-400/70 text-xs">Fat</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-orange-100 font-semibold mb-2">Ingredients:</h4>
                <ul className="space-y-1 text-orange-200">
                  {showRecipeDetail.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full" />
                      {ing.amount} {ing.unit} {ing.name}
                      {ing.optional && <span className="text-orange-400/50 text-sm">(optional)</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-orange-100 font-semibold mb-2">Instructions:</h4>
                <ol className="space-y-2 text-orange-200">
                  {showRecipeDetail.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {showRecipeDetail.tips && showRecipeDetail.tips.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-100 font-semibold mb-2">Tips:</h4>
                  <ul className="space-y-1 text-yellow-200 text-sm">
                    {showRecipeDetail.tips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {showRecipeDetail.dietary.map(d => (
                  <span key={d} className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                    {d}
                  </span>
                ))}
                {showRecipeDetail.tags.map(tag => (
                  <span key={tag} className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(showRecipeDetail.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                    showRecipeDetail.isFavorite
                      ? 'bg-pink-500 text-white'
                      : 'bg-pink-500/30 text-pink-300 hover:bg-pink-500/40'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${showRecipeDetail.isFavorite ? 'fill-current' : ''}`} />
                  {showRecipeDetail.isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>
                <button
                  onClick={() => {
                    generateGroceryFromRecipe(showRecipeDetail);
                    setShowRecipeDetail(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/30 text-emerald-300 rounded-lg hover:bg-emerald-500/40"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Grocery
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(recipe => (
            <div
              key={recipe.id}
              className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-5 hover:border-orange-500/50 transition-all cursor-pointer"
              onClick={() => setShowRecipeDetail(recipe)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-orange-100 font-semibold text-lg">{recipe.name}</h3>
                  <p className="text-orange-400/70 text-sm">{recipe.cuisine} • {recipe.category}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
                  className="p-1"
                >
                  <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-pink-500 text-pink-500' : 'text-orange-400/50'}`} />
                </button>
              </div>

              <p className="text-orange-300/70 text-sm mb-3 line-clamp-2">{recipe.description}</p>

              <div className="flex gap-3 text-sm text-orange-300 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recipe.prepTime + recipe.cookTime}min
                </span>
                <span>Serves: {recipe.servings}</span>
                <span className={`${
                  recipe.difficulty === 'easy' ? 'text-green-400' :
                  recipe.difficulty === 'medium' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {recipe.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < recipe.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {recipe.dietary.slice(0, 3).map(d => (
                  <span key={d} className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded">
                    {d}
                  </span>
                ))}
                {recipe.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-orange-400/30 mb-4" />
            <p className="text-orange-400/70">No recipes found. Try a different search!</p>
          </div>
        )}
      </div>
    );
  };

  const renderMealPlanner = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 flex-1 mr-4">
            <h3 className="text-yellow-100 font-semibold mb-2">Weekly Meal Plan</h3>
            <p className="text-yellow-400/70 text-sm">Plan your meals for the week to stay organized and healthy</p>
          </div>
          <button
            onClick={generateMealPlan}
            className="flex items-center gap-2 px-4 py-3 bg-yellow-500/30 text-yellow-300 rounded-lg hover:bg-yellow-500/40 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Auto-Generate
          </button>
        </div>

        {mealPlan ? (
          <div className="grid grid-cols-1 gap-4">
            {days.map(day => (
              <div key={day} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h3 className="text-yellow-100 font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {day}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-yellow-900/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Coffee className="w-4 h-4 text-yellow-400" />
                      <p className="text-yellow-400/70 text-xs">Breakfast</p>
                    </div>
                    <p className="text-yellow-100 text-sm font-medium">
                      {mealPlan.days[day]?.breakfast?.name || 'Not planned'}
                    </p>
                  </div>
                  <div className="bg-yellow-900/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Sun className="w-4 h-4 text-yellow-400" />
                      <p className="text-yellow-400/70 text-xs">Lunch</p>
                    </div>
                    <p className="text-yellow-100 text-sm font-medium">
                      {mealPlan.days[day]?.lunch?.name || 'Not planned'}
                    </p>
                  </div>
                  <div className="bg-yellow-900/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Moon className="w-4 h-4 text-yellow-400" />
                      <p className="text-yellow-400/70 text-xs">Dinner</p>
                    </div>
                    <p className="text-yellow-100 text-sm font-medium">
                      {mealPlan.days[day]?.dinner?.name || 'Not planned'}
                    </p>
                  </div>
                  <div className="bg-yellow-900/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Apple className="w-4 h-4 text-yellow-400" />
                      <p className="text-yellow-400/70 text-xs">Snacks</p>
                    </div>
                    <p className="text-yellow-100 text-sm font-medium">
                      {mealPlan.days[day]?.snacks?.map(s => s.name).join(', ') || 'Not planned'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <Calendar className="w-16 h-16 mx-auto text-yellow-400/30 mb-4" />
            <p className="text-yellow-400/70 mb-4">No meal plan for this week yet.</p>
            <button
              onClick={generateMealPlan}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400"
            >
              Generate Meal Plan
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderWaterTracking = () => {
    const waterGoal = preferences?.waterGoal || 2500; // Default 2.5L
    const waterPercentage = Math.min((dailyWater / waterGoal) * 100, 100);

    const quickAmounts = [250, 500, 750, 1000];

    return (
      <div className="space-y-6">
        {/* Water Progress */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-100 font-semibold text-xl">Today's Hydration</h3>
            <span className="text-blue-400 text-lg">{dailyWater}ml / {waterGoal}ml</span>
          </div>

          <div className="relative h-8 bg-blue-900/30 rounded-full overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${waterPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{Math.round(waterPercentage)}%</span>
            </div>
          </div>

          {/* Water Glasses Visualization */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(8)].map((_, i) => {
              const filled = dailyWater >= (i + 1) * (waterGoal / 8);
              const partial = !filled && dailyWater > i * (waterGoal / 8);
              return (
                <div
                  key={i}
                  className={`w-8 h-12 rounded-b-lg border-2 relative overflow-hidden ${
                    filled ? 'border-blue-400' : 'border-blue-800'
                  }`}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 transition-all ${
                      filled ? 'bg-blue-400 h-full' : partial ? 'bg-blue-400 h-1/2' : ''
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {quickAmounts.map(amount => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="flex flex-col items-center justify-center p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
              >
                <Droplet className="w-6 h-6 text-blue-400 mb-1" />
                <span className="text-blue-100 font-semibold">{amount}ml</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hydration Tips */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
          <h4 className="text-cyan-100 font-semibold mb-3">Hydration Tips</h4>
          <ul className="space-y-2 text-cyan-300 text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              Drink a glass of water first thing in the morning
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              Keep a water bottle at your desk
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              Drink before, during, and after exercise
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              For POTS: increase sodium and water together
            </li>
          </ul>
        </div>

        {/* Daily Target Message */}
        {dailyWater >= waterGoal ? (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
            <Award className="w-12 h-12 mx-auto text-green-400 mb-2" />
            <p className="text-green-100 font-semibold">Great job! You've reached your daily water goal!</p>
          </div>
        ) : (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-blue-100">
              {waterGoal - dailyWater}ml more to reach your daily goal!
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFoodTrends = () => {
    const avgNutrition = mealLogs.length > 0 ? {
      calories: Math.round(mealLogs.reduce((acc, log) => acc + log.nutrition.calories, 0) / mealLogs.length),
      protein: Math.round(mealLogs.reduce((acc, log) => acc + log.nutrition.protein, 0) / mealLogs.length),
      carbs: Math.round(mealLogs.reduce((acc, log) => acc + log.nutrition.carbs, 0) / mealLogs.length),
      fat: Math.round(mealLogs.reduce((acc, log) => acc + log.nutrition.fat, 0) / mealLogs.length),
      sodium: Math.round(mealLogs.reduce((acc, log) => acc + log.nutrition.sodium, 0) / mealLogs.length),
    } : { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 };

    const mealTypeDistribution = mealLogs.reduce((acc, log) => {
      acc[log.mealType] = (acc[log.mealType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const topMeals = Object.entries(
      mealLogs.reduce((acc, log) => {
        acc[log.name] = (acc[log.name] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    ).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-lime-900/20 border border-lime-500/30 rounded-lg p-4">
            <h3 className="text-lime-100 font-semibold mb-2">Average Nutrition Per Meal</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-lime-400/70">Calories</span>
                <span className="text-lime-100 font-bold">{avgNutrition.calories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lime-400/70">Protein</span>
                <span className="text-lime-100 font-bold">{avgNutrition.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lime-400/70">Carbs</span>
                <span className="text-lime-100 font-bold">{avgNutrition.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lime-400/70">Fat</span>
                <span className="text-lime-100 font-bold">{avgNutrition.fat}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lime-400/70">Sodium</span>
                <span className={`font-bold ${avgNutrition.sodium > 600 ? 'text-yellow-400' : 'text-lime-100'}`}>
                  {avgNutrition.sodium}mg
                </span>
              </div>
            </div>
          </div>

          <div className="bg-lime-900/20 border border-lime-500/30 rounded-lg p-4">
            <h3 className="text-lime-100 font-semibold mb-2">Meal Distribution</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(mealTypeDistribution).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-lime-400/70 capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-lime-900/30 rounded-full h-2">
                      <div
                        className="bg-lime-500 h-2 rounded-full"
                        style={{ width: `${mealLogs.length > 0 ? (count / mealLogs.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-lime-100 font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-lime-900/20 border border-lime-500/30 rounded-lg p-4">
            <h3 className="text-lime-100 font-semibold mb-2">Pantry & Grocery Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-lime-400/70">Pantry Items</span>
                <span className="text-lime-100 font-bold">{pantryItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lime-400/70">Expiring Soon</span>
                <span className="text-yellow-400 font-bold">
                  {pantryItems.filter(item => getExpirationStatus(item.expirationDate).status === 'warning').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lime-400/70">Grocery Items</span>
                <span className="text-lime-100 font-bold">{groceryItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lime-400/70">Items Checked</span>
                <span className="text-green-400 font-bold">
                  {groceryItems.filter(i => i.checked).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-lime-900/20 border border-lime-500/30 rounded-lg p-4">
          <h3 className="text-lime-100 font-semibold mb-4">Most Logged Meals</h3>
          <div className="space-y-3">
            {topMeals.length > 0 ? topMeals.map(([name, count], index) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-300 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-lime-100 font-medium">{name}</p>
                  <div className="w-full bg-lime-900/30 rounded-full h-2 mt-1">
                    <div
                      className="bg-lime-500 h-2 rounded-full"
                      style={{ width: `${(count / topMeals[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-lime-300 font-bold">{count}x</span>
              </div>
            )) : (
              <p className="text-lime-400/70 text-center">No meals logged yet</p>
            )}
          </div>
        </div>

        <div className="bg-lime-900/20 border border-lime-500/30 rounded-lg p-4">
          <h3 className="text-lime-100 font-semibold mb-2">Health Insights</h3>
          <div className="space-y-2 text-sm text-lime-300">
            <p className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 mt-0.5 text-lime-400 flex-shrink-0" />
              <span>Average sodium: {avgNutrition.sodium}mg per meal. For POTS management, aim for 3000-10000mg daily.</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-lime-400 flex-shrink-0" />
              <span>You have {recipes.length} recipes saved. Try to rotate through them for variety!</span>
            </p>
            <p className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 text-lime-400 flex-shrink-0" />
              <span>Protein average: {avgNutrition.protein}g per meal - good for maintaining energy levels.</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderPreferences = () => {
    const [editPrefs, setEditPrefs] = useState<FoodPreferences>(preferences || {
      allergies: [],
      intolerances: [],
      dislikedFoods: [],
      favoriteFoods: [],
      dietaryRestrictions: [],
      calorieGoal: 2000,
      proteinGoal: 50,
      carbGoal: 250,
      fatGoal: 65,
      waterGoal: 2500
    });

    const savePrefs = async () => {
      await foodManagementService.savePreferences(editPrefs);
      setPreferences(editPrefs);
      alert('Preferences saved!');
    };

    return (
      <div className="space-y-6">
        {/* Nutrition Goals */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-purple-100 font-semibold text-xl mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Daily Nutrition Goals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="text-purple-400/70 text-sm block mb-1">Calories</label>
              <input
                type="number"
                value={editPrefs.calorieGoal || ''}
                onChange={(e) => setEditPrefs({ ...editPrefs, calorieGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-100"
              />
            </div>
            <div>
              <label className="text-purple-400/70 text-sm block mb-1">Protein (g)</label>
              <input
                type="number"
                value={editPrefs.proteinGoal || ''}
                onChange={(e) => setEditPrefs({ ...editPrefs, proteinGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-100"
              />
            </div>
            <div>
              <label className="text-purple-400/70 text-sm block mb-1">Carbs (g)</label>
              <input
                type="number"
                value={editPrefs.carbGoal || ''}
                onChange={(e) => setEditPrefs({ ...editPrefs, carbGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-100"
              />
            </div>
            <div>
              <label className="text-purple-400/70 text-sm block mb-1">Fat (g)</label>
              <input
                type="number"
                value={editPrefs.fatGoal || ''}
                onChange={(e) => setEditPrefs({ ...editPrefs, fatGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-100"
              />
            </div>
            <div>
              <label className="text-purple-400/70 text-sm block mb-1">Water (ml)</label>
              <input
                type="number"
                value={editPrefs.waterGoal || ''}
                onChange={(e) => setEditPrefs({ ...editPrefs, waterGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-100"
              />
            </div>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-purple-100 font-semibold text-xl mb-4 flex items-center gap-2">
            <Leaf className="w-6 h-6" />
            Dietary Preferences
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-sodium', 'low-carb'].map(diet => (
              <label key={diet} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPrefs.dietaryRestrictions?.includes(diet) || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEditPrefs({ ...editPrefs, dietaryRestrictions: [...(editPrefs.dietaryRestrictions || []), diet] });
                    } else {
                      setEditPrefs({ ...editPrefs, dietaryRestrictions: (editPrefs.dietaryRestrictions || []).filter(d => d !== diet) });
                    }
                  }}
                  className="w-4 h-4 rounded border-purple-500 text-purple-500 focus:ring-purple-500 bg-purple-900/20"
                />
                <span className="text-purple-200 capitalize">{diet}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies & Intolerances */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <h3 className="text-red-100 font-semibold text-xl mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Allergies & Intolerances
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['nuts', 'peanuts', 'shellfish', 'fish', 'eggs', 'milk', 'soy', 'wheat', 'sesame'].map(allergy => (
              <label key={allergy} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPrefs.allergies?.includes(allergy) || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEditPrefs({ ...editPrefs, allergies: [...(editPrefs.allergies || []), allergy] });
                    } else {
                      setEditPrefs({ ...editPrefs, allergies: (editPrefs.allergies || []).filter(a => a !== allergy) });
                    }
                  }}
                  className="w-4 h-4 rounded border-red-500 text-red-500 focus:ring-red-500 bg-red-900/20"
                />
                <span className="text-red-200 capitalize">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={savePrefs}
          className="w-full py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-400 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
          <p className="text-green-400">Loading food data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UtensilsCrossed className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Food & Nutrition Hub
            </h1>
          </div>
          <p className="text-green-400">
            Complete food tracking, meal planning, recipes & nutrition management
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-green-900/20 p-2 rounded-xl border border-green-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                    setFilterCategory('all');
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500/30 text-${tab.color}-300 border border-${tab.color}-500/50`
                      : 'bg-green-900/20 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'pantry' && renderPantryTracker()}
          {activeTab === 'grocery' && renderGroceryList()}
          {activeTab === 'meals' && renderMealLogger()}
          {activeTab === 'recipes' && renderRecipeLibrary()}
          {activeTab === 'planning' && renderMealPlanner()}
          {activeTab === 'water' && renderWaterTracking()}
          {activeTab === 'trends' && renderFoodTrends()}
          {activeTab === 'preferences' && renderPreferences()}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FoodHubPage;
