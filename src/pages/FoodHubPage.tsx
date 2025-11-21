import React, { useState } from 'react';
import { UtensilsCrossed, ShoppingCart, Package, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import PantryTracker from '../components/food/PantryTracker';
import GroceryList from '../components/food/GroceryList';
import MealLogger from '../components/food/MealLogger';
import RecipeLibrary from '../components/food/RecipeLibrary';
import MealPlanner from '../components/food/MealPlanner';
import FoodTrends from '../components/food/FoodTrends';

type TabType = 'pantry' | 'grocery' | 'meals' | 'recipes' | 'planning' | 'trends';

const FoodHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pantry');

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'pantry', label: 'Pantry Tracker', icon: Package, color: 'green' },
    { id: 'grocery', label: 'Grocery List', icon: ShoppingCart, color: 'emerald' },
    { id: 'meals', label: 'Meal Logger', icon: UtensilsCrossed, color: 'amber' },
    { id: 'recipes', label: 'Recipe Library', icon: BookOpen, color: 'orange' },
    { id: 'planning', label: 'Meal Planning', icon: Calendar, color: 'yellow' },
    { id: 'trends', label: 'Food Trends', icon: TrendingUp, color: 'lime' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UtensilsCrossed className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Food & Eating Hub
            </h1>
          </div>
          <p className="text-green-400">
            Complete food tracking with POTS-friendly sodium management
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-green-900/20 p-2 rounded-xl border border-green-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isComingSoon = false;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isComingSoon && setActiveTab(tab.id)}
                  disabled={isComingSoon}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500/30 text-${tab.color}-300 border border-${tab.color}-500/50`
                      : isComingSoon
                      ? 'bg-gray-900/20 text-gray-500 cursor-not-allowed'
                      : 'bg-green-900/20 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {isComingSoon && <span className="text-xs opacity-60">(Soon)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'pantry' && <PantryTracker />}
          {activeTab === 'grocery' && <GroceryList />}
          {activeTab === 'meals' && <MealLogger />}
          {activeTab === 'recipes' && <RecipeLibrary />}
          {activeTab === 'planning' && <MealPlanner />}
          {activeTab === 'trends' && <FoodTrends />}
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
      `}</style>
    </div>
  );
};

export default FoodHubPage;
