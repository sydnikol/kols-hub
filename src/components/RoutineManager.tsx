/**
 * 🖤 ROUTINE MANAGER
 * Time-based routines with auto-adjustment for energy, weather, pain
 * Includes spoon-aware pacing and routine skips/swaps
 */

import React, { useState, useEffect } from 'react';
import { Clock, Zap, Sun, Moon, Coffee, Wind, Calendar } from 'lucide-react';
import { useKolHubStore } from '../store/kolhub-store';
import { db } from '../utils/database';

interface RoutineTask {
  id: string;
  name: string;
  time: string;
  spoonCost: number;
  category: string;
  optional: boolean;
  completed: boolean;
}

interface Routine {
  id: string;
  name: string;
  timeOfDay: 'morning' | 'midday' | 'evening' | 'night';
  tasks: RoutineTask[];
  flexibilityLevel: 'rigid' | 'flexible' | 'adaptive';
}

const RoutineManager: React.FC = () => {
  const { energyState, updateEnergyState } = useKolHubStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: 'morning',
      name: 'Morning Flow',
      timeOfDay: 'morning',
      flexibilityLevel: 'adaptive',
      tasks: [
        { id: 'm1', name: 'Take morning meds', time: '08:00', spoonCost: 1, category: 'health', optional: false, completed: false },
        { id: 'm2', name: 'Check blood pressure', time: '08:15', spoonCost: 1, category: 'health', optional: false, completed: false },
        { id: 'm3', name: 'Drink 16oz water + salt', time: '08:30', spoonCost: 1, category: 'hydration', optional: false, completed: false },
        { id: 'm4', name: 'Light breakfast', time: '09:00', spoonCost: 2, category: 'food', optional: false, completed: false },
        { id: 'm5', name: 'Gentle stretches', time: '09:30', spoonCost: 2, category: 'movement', optional: true, completed: false },
        { id: 'm6', name: 'Journal body weather', time: '10:00', spoonCost: 1, category: 'tracking', optional: true, completed: false },
      ]
    },
    {
      id: 'midday',
      name: 'Midday Reset',
      timeOfDay: 'midday',
      flexibilityLevel: 'flexible',
      tasks: [
        { id: 'd1', name: 'Lunch + hydration', time: '12:00', spoonCost: 2, category: 'food', optional: false, completed: false },
        { id: 'd2', name: 'Take midday meds', time: '13:00', spoonCost: 1, category: 'health', optional: false, completed: false },
        { id: 'd3', name: 'Rest break (20 min)', time: '14:00', spoonCost: 0, category: 'rest', optional: true, completed: false },
        { id: 'd4', name: 'Creative time', time: '15:00', spoonCost: 3, category: 'creative', optional: true, completed: false },
      ]
    },
    {
      id: 'evening',
      name: 'Evening Wind Down',
      timeOfDay: 'evening',
      flexibilityLevel: 'adaptive',
      tasks: [
        { id: 'e1', name: 'Light dinner', time: '18:00', spoonCost: 2, category: 'food', optional: false, completed: false },
        { id: 'e2', name: 'Take evening meds', time: '19:00', spoonCost: 1, category: 'health', optional: false, completed: false },
        { id: 'e3', name: 'Compression socks off', time: '20:00', spoonCost: 1, category: 'health', optional: true, completed: false },
        { id: 'e4', name: 'Low-spoon creative', time: '20:30', spoonCost: 2, category: 'creative', optional: true, completed: false },
        { id: 'e5', name: 'Evening reflection', time: '21:00', spoonCost: 1, category: 'tracking', optional: true, completed: false },
      ]
    },
    {
      id: 'night',
      name: 'Night Ritual',
      timeOfDay: 'night',
      flexibilityLevel: 'flexible',
      tasks: [
        { id: 'n1', name: 'Auto-play Spotify (start with Dimple)', time: '22:30', spoonCost: 0, category: 'music', optional: false, completed: false },
        { id: 'n2', name: 'Take night meds', time: '23:00', spoonCost: 1, category: 'health', optional: false, completed: false },
        { id: 'n3', name: 'Ancestor altar check', time: '23:15', spoonCost: 1, category: 'spiritual', optional: true, completed: false },
        { id: 'n4', name: 'Dream journal prep', time: '23:30', spoonCost: 1, category: 'spiritual', optional: true, completed: false },
        { id: 'n5', name: 'Lights dim + sleep prep', time: '23:45', spoonCost: 1, category: 'rest', optional: false, completed: false },
      ]
    },
  ]);
  // Determine current routine based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) setActiveRoutine('morning');
    else if (hour >= 12 && hour < 17) setActiveRoutine('midday');
    else if (hour >= 17 && hour < 22) setActiveRoutine('evening');
    else setActiveRoutine('night');

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [currentTime]);

  const toggleTaskComplete = (routineId: string, taskId: string) => {
    setRoutines(prevRoutines =>
      prevRoutines.map(routine => {
        if (routine.id === routineId) {
          return {
            ...routine,
            tasks: routine.tasks.map(task => {
              if (task.id === taskId) {
                const newCompleted = !task.completed;
                // Update energy if task completed
                if (newCompleted) {
                  updateEnergyState({
                    currentSpoons: Math.max(0, energyState.currentSpoons - task.spoonCost)
                  });
                } else {
                  updateEnergyState({
                    currentSpoons: Math.min(energyState.maxSpoons, energyState.currentSpoons + task.spoonCost)
                  });
                }
                return { ...task, completed: newCompleted };
              }
              return task;
            })
          };
        }
        return routine;
      })
    );
  };

  const skipTask = (routineId: string, taskId: string) => {
    setRoutines(prevRoutines =>
      prevRoutines.map(routine => {
        if (routine.id === routineId) {
          return {
            ...routine,
            tasks: routine.tasks.filter(task => task.id !== taskId)
          };
        }
        return routine;
      })
    );
  };

  const getRoutineIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return <Sun className="text-indigo-400" />;
      case 'midday': return <Coffee className="text-orange-400" />;
      case 'evening': return <Wind className="text-purple-400" />;
      case 'night': return <Moon className="text-indigo-400" />;
      default: return <Clock />;
    }
  };

  const getCurrentRoutine = () => routines.find(r => r.id === activeRoutine);

  const totalSpoons = getCurrentRoutine()?.tasks.reduce((sum, task) => sum + (task.optional ? 0 : task.spoonCost), 0) || 0;
  const completedSpoons = getCurrentRoutine()?.tasks.filter(t => t.completed).reduce((sum, task) => sum + task.spoonCost, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
          Routine Manager
        </h1>
        <p className="text-gray-400">Adaptive scheduling for chronic illness management</p>
      </div>

      {/* Energy Status */}
      <div className="mb-6 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-indigo-400" />
              <span className="font-semibold">Current Energy</span>
            </div>
            <div className="text-3xl font-bold">{energyState.currentSpoons}/{energyState.maxSpoons} spoons</div>
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-1">Routine Cost</div>
            <div className="text-2xl font-semibold">{totalSpoons} spoons</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-indigo-400 to-green-400 h-4 rounded-full transition-all"
            style={{ width: `${(energyState.currentSpoons / energyState.maxSpoons) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Time & Active Routine */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
          <Clock size={20} />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-900 rounded-lg">
          {getCurrentRoutine() && getRoutineIcon(getCurrentRoutine()!.timeOfDay)}
          <span className="font-semibold capitalize">{activeRoutine} Routine</span>
        </div>
      </div>
      {/* Active Routine Tasks */}
      {getCurrentRoutine() && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            {getRoutineIcon(getCurrentRoutine()!.timeOfDay)}
            {getCurrentRoutine()!.name}
          </h2>
          <div className="space-y-3">
            {getCurrentRoutine()!.tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl transition-all ${
                  task.completed
                    ? 'bg-green-900 bg-opacity-30 border border-green-700'
                    : 'bg-gray-800 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleTaskComplete(getCurrentRoutine()!.id, task.id)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-600 hover:border-purple-400'
                      }`}
                    >
                      {task.completed && <span className="text-white">✓</span>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.name}
                        </span>
                        {task.optional && (
                          <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-400">Optional</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {task.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap size={14} />
                          {task.spoonCost} spoon{task.spoonCost !== 1 ? 's' : ''}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-700 rounded text-xs capitalize">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.optional && (
                    <button
                      onClick={() => skipTask(getCurrentRoutine()!.id, task.id)}
                      className="px-3 py-1 text-sm bg-gray-700 hover:bg-red-900 rounded-lg transition-all"
                    >
                      Skip
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Routines Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Routines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {routines.map((routine) => {
            const completed = routine.tasks.filter(t => t.completed).length;
            const total = routine.tasks.length;
            const progress = total > 0 ? (completed / total) * 100 : 0;

            return (
              <button
                key={routine.id}
                onClick={() => setActiveRoutine(routine.id)}
                className={`p-6 rounded-xl text-left transition-all transform hover:scale-105 ${
                  activeRoutine === routine.id
                    ? 'bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl'
                    : 'bg-gray-800 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {getRoutineIcon(routine.timeOfDay)}
                  <h3 className="font-bold text-lg">{routine.name}</h3>
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {completed}/{total} tasks complete
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-purple-400 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoutineManager;