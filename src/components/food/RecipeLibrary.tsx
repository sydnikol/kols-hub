import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Clock, DollarSign, Flame, ChefHat, Star, Plus, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeDatabase } from '../../data/recipes';

export interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  category: string;
  tags: string[];
  prepTime: number; // minutes
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  budget: 'Budget' | 'Moderate' | 'Expensive';
  sodiumPerServing: number; // mg
  ingredients: string[];
  instructions: string[];
  notes?: string;
  isUserAdded?: boolean;
}

const RecipeLibrary: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const cuisines = [
    'All', 'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian',
    'Thai', 'Mediterranean', 'French', 'Korean', 'Soul Food', 'Comfort Food'
  ];

  const availableTags = [
    'POTS-Friendly', 'High Sodium', 'Low Sodium', 'Soft Food', 'Nausea-Safe',
    'Sensory-Safe', 'No Cheese', 'Vegetarian', 'Vegan', 'Gluten-Free',
    'Dairy-Free', 'Quick Prep', 'One Pot', 'Freezer-Friendly', 'Budget-Friendly',
    'Anti-Inflammatory', 'Comfort Food', 'Low Spoon', 'Sitting Cook'
  ];

  useEffect(() => {
    // Load recipes from database + user additions
    const userRecipes = localStorage.getItem('user-recipes');
    const userAdded = userRecipes ? JSON.parse(userRecipes) : [];
    setRecipes([...recipeDatabase, ...userAdded]);

    // Load favorites
    const savedFavorites = localStorage.getItem('favorite-recipes');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const toggleFavorite = (recipeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(recipeId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorite-recipes', JSON.stringify(Array.from(newFavorites)));
  };

  const filteredRecipes = recipes.filter(recipe => {
    // Search filter
    if (searchTerm && !recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }

    // Cuisine filter
    if (selectedCuisine !== 'All' && recipe.cuisine !== selectedCuisine) {
      return false;
    }

    // Tag filter (recipe must have ALL selected tags)
    if (selectedTags.size > 0) {
      const recipeTags = new Set(recipe.tags);
      for (const tag of selectedTags) {
        if (!recipeTags.has(tag)) {
          return false;
        }
      }
    }

    return true;
  });

  const getSodiumColor = (sodium: number): string => {
    if (sodium >= 400) return 'text-red-400';
    if (sodium >= 200) return 'text-orange-400';
    if (sodium >= 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getDifficultyColor = (difficulty: Recipe['difficulty']): string => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">Recipe Library</h2>
          <span className="text-sm text-orange-400">({filteredRecipes.length} recipes)</span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-orange-600/30 hover:bg-orange-500/40 text-orange-300 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20 mb-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes or ingredients..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-orange-400/50"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-orange-400 hover:text-orange-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-black/60 p-4 rounded-lg border border-orange-500/30 mb-6 space-y-4">
          {/* Cuisine Filter */}
          <div>
            <h3 className="text-orange-300 text-sm font-semibold mb-2">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    selectedCuisine === cuisine
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                      : 'bg-orange-900/20 text-orange-400 hover:bg-orange-500/20'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filters */}
          <div>
            <h3 className="text-orange-300 text-sm font-semibold mb-2">Dietary & Lifestyle Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    selectedTags.has(tag)
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                      : 'bg-orange-900/20 text-orange-400 hover:bg-orange-500/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {selectedTags.size > 0 && (
            <button
              onClick={() => setSelectedTags(new Set())}
              className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all tags
            </button>
          )}
        </div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-black/40 p-4 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-bold text-lg">{recipe.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(recipe.id);
                }}
                className="p-1 hover:bg-orange-500/20 rounded transition-colors"
              >
                <Star
                  className={`w-5 h-5 ${
                    favorites.has(recipe.id)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs">
              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                {recipe.cuisine}
              </span>
              <span className={`px-2 py-1 rounded border ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{recipe.prepTime + recipe.cookTime} min total</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${getSodiumColor(recipe.sodiumPerServing)}`} />
                <span className={getSodiumColor(recipe.sodiumPerServing)}>
                  {recipe.sodiumPerServing}mg sodium
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span>{recipe.budget}</span>
              </div>
            </div>

            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {recipe.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                    {tag}
                  </span>
                ))}
                {recipe.tags.length > 3 && (
                  <span className="text-xs text-gray-400">+{recipe.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center text-orange-400 py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">No recipes found</p>
          <p className="text-sm mt-2">Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-orange-900/90 to-red-900/90 rounded-xl border border-orange-500/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedRecipe.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                    {selectedRecipe.cuisine}
                  </span>
                  <span className={`px-3 py-1 rounded border ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                    {selectedRecipe.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded border border-green-500/30">
                    {selectedRecipe.budget}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-sm">Prep</span>
                </div>
                <p className="text-white font-bold">{selectedRecipe.prepTime} min</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-300 text-sm">Cook</span>
                </div>
                <p className="text-white font-bold">{selectedRecipe.cookTime} min</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <ChefHat className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-sm">Servings</span>
                </div>
                <p className="text-white font-bold">{selectedRecipe.servings}</p>
              </div>
            </div>

            <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Flame className={`w-5 h-5 ${getSodiumColor(selectedRecipe.sodiumPerServing)}`} />
                <span className="text-orange-300 font-semibold">Sodium per Serving</span>
              </div>
              <p className={`text-2xl font-bold ${getSodiumColor(selectedRecipe.sodiumPerServing)}`}>
                {selectedRecipe.sodiumPerServing}mg
              </p>
            </div>

            {selectedRecipe.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-orange-300 font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-orange-300 font-semibold mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span className="text-white">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-orange-300 font-semibold mb-3">Instructions</h3>
              <ol className="space-y-3">
                {selectedRecipe.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500/30 text-orange-300 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-white flex-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {selectedRecipe.notes && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">Notes</h3>
                <p className="text-white text-sm">{selectedRecipe.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
        <p className="text-orange-300 text-xs">
          <span className="font-bold">500+ Recipes:</span> Filter by cuisine, dietary needs, sodium content, and difficulty. Click any recipe for full details. Star your favorites!
        </p>
      </div>
    </div>
  );
};

export default RecipeLibrary;
