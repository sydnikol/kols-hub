import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Droplets, Flame, UtensilsCrossed, Battery, Activity, AlertCircle } from 'lucide-react';

interface MealEntry {
  id: string;
  date: string;
  time: string;
  mealType: string;
  foodItems: string;
  sodiumMg: number;
  energyBefore: number;
  energyAfter: number;
  nauseaLevel: number;
  timestamp: number;
}

interface DayData {
  date: string;
  sodiumTotal: number;
  mealCount: number;
  avgEnergyBefore: number;
  avgEnergyAfter: number;
  avgNausea: number;
}

const FoodTrends: React.FC = () => {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  const [dayData, setDayData] = useState<DayData[]>([]);
  const [hydrationData, setHydrationData] = useState<{ date: string; liters: number }[]>([]);

  useEffect(() => {
    // Load meal data
    const meals = localStorage.getItem('meal-log');
    const mealEntries: MealEntry[] = meals ? JSON.parse(meals) : [];

    // Load hydration data
    const hydration = localStorage.getItem('hydration-tracker');
    const hydrationEntries = hydration ? JSON.parse(hydration) : [];

    // Calculate daily aggregates for the time range
    const days: DayData[] = [];
    const hydrationDays: { date: string; liters: number }[] = [];

    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Get meals for this day
      const dayMeals = mealEntries.filter(m => m.date === dateStr);

      if (dayMeals.length > 0) {
        const sodiumTotal = dayMeals.reduce((sum, m) => sum + (m.sodiumMg || 0), 0);
        const avgEnergyBefore = dayMeals.reduce((sum, m) => sum + m.energyBefore, 0) / dayMeals.length;
        const avgEnergyAfter = dayMeals.reduce((sum, m) => sum + m.energyAfter, 0) / dayMeals.length;
        const avgNausea = dayMeals.reduce((sum, m) => sum + m.nauseaLevel, 0) / dayMeals.length;

        days.push({
          date: dateStr,
          sodiumTotal,
          mealCount: dayMeals.length,
          avgEnergyBefore,
          avgEnergyAfter,
          avgNausea
        });
      } else {
        days.push({
          date: dateStr,
          sodiumTotal: 0,
          mealCount: 0,
          avgEnergyBefore: 0,
          avgEnergyAfter: 0,
          avgNausea: 0
        });
      }

      // Get hydration for this day
      const dayHydration = hydrationEntries.filter((h: any) => {
        const entryDate = new Date(h.timestamp).toISOString().split('T')[0];
        return entryDate === dateStr;
      });

      const totalLiters = dayHydration.reduce((sum: number, h: any) => sum + h.amount, 0);
      hydrationDays.push({ date: dateStr, liters: totalLiters });
    }

    setDayData(days);
    setHydrationData(hydrationDays);
  }, [timeRange]);

  const maxSodium = Math.max(...dayData.map(d => d.sodiumTotal), 4000);
  const maxHydration = Math.max(...hydrationData.map(d => d.liters), 2.5);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getSodiumColor = (sodium: number): string => {
    if (sodium >= 4000) return 'bg-green-500';
    if (sodium >= 3000) return 'bg-yellow-500';
    if (sodium >= 2000) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getHydrationColor = (liters: number): string => {
    if (liters >= 2.5) return 'bg-blue-500';
    if (liters >= 2.0) return 'bg-cyan-500';
    if (liters >= 1.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getEnergyColor = (energy: number): string => {
    if (energy >= 7) return 'text-green-400';
    if (energy >= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const avgSodium = dayData.reduce((sum, d) => sum + d.sodiumTotal, 0) / dayData.filter(d => d.mealCount > 0).length || 0;
  const avgMeals = dayData.reduce((sum, d) => sum + d.mealCount, 0) / dayData.length;
  const avgHydration = hydrationData.reduce((sum, d) => sum + d.liters, 0) / hydrationData.length;
  const avgEnergyChange = dayData.reduce((sum, d) => {
    if (d.mealCount === 0) return sum;
    return sum + (d.avgEnergyAfter - d.avgEnergyBefore);
  }, 0) / dayData.filter(d => d.mealCount > 0).length || 0;

  return (
    <div className="bg-gradient-to-br from-lime-900/30 to-green-900/30 p-6 rounded-xl border border-lime-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-lime-400" />
          <h2 className="text-2xl font-bold text-white">Food Trends & Analytics</h2>
        </div>
        <div className="flex gap-2">
          {([7, 14, 30] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                timeRange === days
                  ? 'bg-lime-500/30 text-lime-300 border border-lime-500/50'
                  : 'bg-lime-900/20 text-lime-400 hover:bg-lime-500/20'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-orange-300 text-sm font-semibold">Avg Sodium/Day</span>
          </div>
          <p className="text-2xl font-bold text-white">{avgSodium.toFixed(0)}mg</p>
          <p className="text-xs text-gray-400 mt-1">Goal: 4000mg</p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm font-semibold">Avg Hydration/Day</span>
          </div>
          <p className="text-2xl font-bold text-white">{avgHydration.toFixed(1)}L</p>
          <p className="text-xs text-gray-400 mt-1">Goal: 2.5L</p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold">Avg Meals/Day</span>
          </div>
          <p className="text-2xl font-bold text-white">{avgMeals.toFixed(1)}</p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">Avg Energy Change</span>
          </div>
          <p className={`text-2xl font-bold ${avgEnergyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {avgEnergyChange >= 0 ? '+' : ''}{avgEnergyChange.toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Before → After meals</p>
        </div>
      </div>

      {/* Sodium Chart */}
      <div className="bg-black/40 p-4 rounded-lg border border-orange-500/20 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h3 className="text-orange-300 font-semibold">{timeRange}-Day Sodium Intake</h3>
        </div>
        <div className="space-y-2">
          {dayData.map((day, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-gray-400 text-sm w-12">{formatDate(day.date)}</span>
              <div className="flex-1 bg-black/40 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full ${getSodiumColor(day.sodiumTotal)} transition-all`}
                  style={{ width: `${(day.sodiumTotal / maxSodium) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                  {day.sodiumTotal}mg
                </span>
              </div>
              <span className="text-gray-400 text-xs w-16">{day.mealCount} meals</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-gray-400">≥4000mg (Goal)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-gray-400">3000-4000mg</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span className="text-gray-400">2000-3000mg</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-gray-400">&lt;2000mg</span>
          </div>
        </div>
      </div>

      {/* Hydration Chart */}
      <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300 font-semibold">{timeRange}-Day Hydration</h3>
        </div>
        <div className="space-y-2">
          {hydrationData.map((day, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-gray-400 text-sm w-12">{formatDate(day.date)}</span>
              <div className="flex-1 bg-black/40 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full ${getHydrationColor(day.liters)} transition-all`}
                  style={{ width: `${(day.liters / maxHydration) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                  {day.liters.toFixed(1)}L
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-gray-400">≥2.5L (Goal)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-cyan-500 rounded" />
            <span className="text-gray-400">2.0-2.5L</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-gray-400">1.5-2.0L</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-gray-400">&lt;1.5L</span>
          </div>
        </div>
      </div>

      {/* Energy & Nausea Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/40 p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Battery className="w-5 h-5 text-green-400" />
            <h3 className="text-green-300 font-semibold">Energy Levels</h3>
          </div>
          <div className="space-y-3">
            {dayData.filter(d => d.mealCount > 0).map((day, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">{formatDate(day.date)}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getEnergyColor(day.avgEnergyBefore)}`}>
                      {day.avgEnergyBefore.toFixed(1)}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className={`font-semibold ${getEnergyColor(day.avgEnergyAfter)}`}>
                      {day.avgEnergyAfter.toFixed(1)}
                    </span>
                    <span className={`text-xs ${day.avgEnergyAfter > day.avgEnergyBefore ? 'text-green-400' : 'text-red-400'}`}>
                      ({day.avgEnergyAfter > day.avgEnergyBefore ? '+' : ''}{(day.avgEnergyAfter - day.avgEnergyBefore).toFixed(1)})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${day.avgEnergyAfter >= 7 ? 'bg-green-500' : day.avgEnergyAfter >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${(day.avgEnergyAfter / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-red-300 font-semibold">Nausea Patterns</h3>
          </div>
          <div className="space-y-3">
            {dayData.filter(d => d.mealCount > 0).map((day, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">{formatDate(day.date)}</span>
                  <span className={`font-semibold ${day.avgNausea === 0 ? 'text-green-400' : day.avgNausea <= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {day.avgNausea.toFixed(1)}/10
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${day.avgNausea === 0 ? 'bg-green-500' : day.avgNausea <= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${(day.avgNausea / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-lime-900/20 border border-lime-500/30 rounded-lg p-3">
        <p className="text-lime-300 text-xs">
          <span className="font-bold">Pattern Tracking:</span> Monitor your sodium, hydration, meal frequency, and how food affects your energy and nausea levels. Look for correlations to identify helpful patterns and food triggers.
        </p>
      </div>
    </div>
  );
};

export default FoodTrends;
