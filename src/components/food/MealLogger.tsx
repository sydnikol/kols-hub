import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Trash2, Calendar, Flame, Users, Smile, Frown, Meh, Battery, BatteryLow, BatteryFull, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  foodItems: string;
  sodiumMg: number;
  energyBefore: number; // 1-10
  energyAfter: number; // 1-10
  nauseaLevel: number; // 0-10 (0 = none, 10 = severe)
  preparedBy?: string;
  eatenWith?: string;
  notes?: string;
  photoUrl?: string;
  timestamp: number;
}

const MealLogger: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<Partial<Meal>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    mealType: 'Breakfast',
    sodiumMg: 0,
    energyBefore: 5,
    energyAfter: 5,
    nauseaLevel: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem('meal-log');
    if (stored) {
      setMeals(JSON.parse(stored));
    }
  }, []);

  const saveMeals = (newMeals: Meal[]) => {
    setMeals(newMeals);
    localStorage.setItem('meal-log', JSON.stringify(newMeals));
  };

  const addMeal = () => {
    if (!formData.foodItems) {
      toast.error('Please describe what you ate');
      return;
    }

    const newMeal: Meal = {
      id: `meal_${Date.now()}`,
      date: formData.date!,
      time: formData.time!,
      mealType: formData.mealType!,
      foodItems: formData.foodItems!,
      sodiumMg: formData.sodiumMg || 0,
      energyBefore: formData.energyBefore || 5,
      energyAfter: formData.energyAfter || 5,
      nauseaLevel: formData.nauseaLevel || 0,
      preparedBy: formData.preparedBy,
      eatenWith: formData.eatenWith,
      notes: formData.notes,
      timestamp: Date.now(),
    };

    saveMeals([...meals, newMeal]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      mealType: 'Breakfast',
      sodiumMg: 0,
      energyBefore: 5,
      energyAfter: 5,
      nauseaLevel: 0,
    });
    setShowForm(false);
    toast.success('Meal logged');
  };

  const deleteMeal = (id: string) => {
    saveMeals(meals.filter(m => m.id !== id));
    toast.success('Meal deleted');
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedMeals);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMeals(newExpanded);
  };

  const getMealsForDate = (date: string) => {
    return meals
      .filter(m => m.date === date)
      .sort((a, b) => {
        const timeA = new Date(`${a.date} ${a.time}`).getTime();
        const timeB = new Date(`${b.date} ${b.time}`).getTime();
        return timeA - timeB;
      });
  };

  const getDailySodium = (date: string) => {
    return getMealsForDate(date).reduce((sum, meal) => sum + meal.sodiumMg, 0);
  };

  const getEnergyIcon = (level: number) => {
    if (level >= 7) return <BatteryFull className="w-4 h-4 text-green-400" />;
    if (level >= 4) return <Battery className="w-4 h-4 text-yellow-400" />;
    return <BatteryLow className="w-4 h-4 text-red-400" />;
  };

  const getNauseaIcon = (level: number) => {
    if (level === 0) return <Smile className="w-4 h-4 text-green-400" />;
    if (level <= 4) return <Meh className="w-4 h-4 text-yellow-400" />;
    return <Frown className="w-4 h-4 text-red-400" />;
  };

  const getMealTypeColor = (type: Meal['mealType']) => {
    switch (type) {
      case 'Breakfast': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Lunch': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Dinner': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Snack': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const todaysMeals = getMealsForDate(selectedDate);
  const dailySodium = getDailySodium(selectedDate);
  const sodiumGoal = 4000; // 4g for POTS

  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 p-6 rounded-xl border border-amber-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">What Kol Ate Today</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Log Meal'}
        </button>
      </div>

      {/* Date Selector */}
      <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-amber-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white"
          />
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-2 bg-amber-600/30 hover:bg-amber-500/40 text-amber-300 font-semibold rounded-lg transition-colors text-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-semibold">Meals Today</span>
          </div>
          <p className="text-3xl font-bold text-white">{todaysMeals.length}</p>
        </div>
        <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-semibold">Sodium Today</span>
          </div>
          <p className="text-3xl font-bold text-white">{dailySodium}mg</p>
          <div className="w-full bg-black/40 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${
                dailySodium >= sodiumGoal ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{ width: `${Math.min((dailySodium / sodiumGoal) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-orange-400 mt-1">Goal: {sodiumGoal}mg</p>
        </div>
        <div className="bg-black/40 p-4 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Battery className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-semibold">Avg Energy</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {todaysMeals.length > 0
              ? (todaysMeals.reduce((sum, m) => sum + m.energyAfter, 0) / todaysMeals.length).toFixed(1)
              : '-'}
          </p>
        </div>
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <div className="bg-black/60 p-4 rounded-lg border border-amber-500/30 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-300 text-sm font-semibold mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-amber-300 text-sm font-semibold mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-semibold mb-2">Meal Type</label>
            <select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value as Meal['mealType'] })}
              className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-semibold mb-2">What did you eat? *</label>
            <textarea
              value={formData.foodItems || ''}
              onChange={(e) => setFormData({ ...formData, foodItems: e.target.value })}
              placeholder="Chicken broth, saltines, ginger ale..."
              className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-amber-400/50"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-semibold mb-2">
              Sodium (mg) - Estimate total for this meal
            </label>
            <input
              type="number"
              value={formData.sodiumMg}
              onChange={(e) => setFormData({ ...formData, sodiumMg: parseInt(e.target.value) })}
              min="0"
              step="50"
              className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-amber-300 text-sm font-semibold mb-2">
                Energy Before (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energyBefore}
                onChange={(e) => setFormData({ ...formData, energyBefore: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-white text-lg font-bold">{formData.energyBefore}</p>
            </div>
            <div>
              <label className="block text-amber-300 text-sm font-semibold mb-2">
                Energy After (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energyAfter}
                onChange={(e) => setFormData({ ...formData, energyAfter: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-white text-lg font-bold">{formData.energyAfter}</p>
            </div>
            <div>
              <label className="block text-amber-300 text-sm font-semibold mb-2">
                Nausea (0-10)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.nauseaLevel}
                onChange={(e) => setFormData({ ...formData, nauseaLevel: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-white text-lg font-bold">{formData.nauseaLevel}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-300 text-sm font-semibold mb-2">Prepared By</label>
              <input
                type="text"
                value={formData.preparedBy || ''}
                onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                placeholder="Partner, Me, Restaurant..."
                className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-amber-400/50"
              />
            </div>
            <div>
              <label className="block text-amber-300 text-sm font-semibold mb-2">Eaten With</label>
              <input
                type="text"
                value={formData.eatenWith || ''}
                onChange={(e) => setFormData({ ...formData, eatenWith: e.target.value })}
                placeholder="Partner, Solo, Friends..."
                className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-amber-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="How did you feel? Any reactions? Enjoyed it?"
              className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-amber-400/50"
              rows={2}
            />
          </div>

          <button
            onClick={addMeal}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Meal
          </button>
        </div>
      )}

      {/* Meals List */}
      <div className="space-y-3">
        {todaysMeals.length > 0 ? (
          todaysMeals.map((meal) => (
            <div
              key={meal.id}
              className={`p-4 rounded-lg border-2 ${getMealTypeColor(meal.mealType)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded border ${getMealTypeColor(meal.mealType)}`}>
                      {meal.mealType}
                    </span>
                    <span className="text-sm text-gray-400">{meal.time}</span>
                  </div>

                  <p className="text-white font-semibold mb-2">{meal.foodItems}</p>

                  <div className="flex flex-wrap gap-3 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300">{meal.sodiumMg}mg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getEnergyIcon(meal.energyBefore)}
                      <span className="text-gray-300">→</span>
                      {getEnergyIcon(meal.energyAfter)}
                    </div>
                    <div className="flex items-center gap-1">
                      {getNauseaIcon(meal.nauseaLevel)}
                      <span className="text-gray-300">
                        {meal.nauseaLevel === 0 ? 'No nausea' : `Nausea: ${meal.nauseaLevel}`}
                      </span>
                    </div>
                  </div>

                  {(meal.preparedBy || meal.eatenWith || meal.notes) && (
                    <button
                      onClick={() => toggleExpanded(meal.id)}
                      className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {expandedMeals.has(meal.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>Details</span>
                    </button>
                  )}

                  {expandedMeals.has(meal.id) && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-sm">
                      {meal.preparedBy && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300">Prepared by: {meal.preparedBy}</span>
                        </div>
                      )}
                      {meal.eatenWith && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300">Eaten with: {meal.eatenWith}</span>
                        </div>
                      )}
                      {meal.notes && (
                        <div className="text-gray-300 italic">{meal.notes}</div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-amber-400 py-12">
            <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">No meals logged for {new Date(selectedDate).toLocaleDateString()}</p>
            <p className="text-sm mt-2">Click "Log Meal" to add your first entry</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
        <p className="text-amber-300 text-xs">
          <span className="font-bold">Partner Sharing:</span> Track who prepared meals and who you ate with. Monitor energy before/after eating and nausea levels to identify helpful vs triggering foods.
        </p>
      </div>
    </div>
  );
};

export default MealLogger;
