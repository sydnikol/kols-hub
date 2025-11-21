/**
 * HEALTH SCENE SUGGESTIONS
 *
 * AI-powered scene suggestions based on current health status
 */

import React, { useState, useEffect } from 'react';
import { Activity, Lightbulb, Sparkles, Play, X } from 'lucide-react';
import { getRecentBodyWeather } from '../../services/healthService';
import type { Scene } from '../../services/smartThingsService';
import { getScenes, executeScene } from '../../services/smartThingsService';

interface SceneSuggestion {
  scene: Scene;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

export const HealthSceneSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SceneSuggestion[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
    const interval = setInterval(loadSuggestions, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadSuggestions = async () => {
    try {
      const [recentHealth, allScenes] = await Promise.all([
        getRecentBodyWeather(1),
        getScenes(),
      ]);

      if (recentHealth.length === 0 || allScenes.length === 0) {
        setLoading(false);
        return;
      }

      const latest = recentHealth[0];
      const newSuggestions: SceneSuggestion[] = [];

      // High pain level
      if (latest.painLevel && latest.painLevel >= 7) {
        const painScene = allScenes.find(s => s.name === 'High Pain Day' || s.healthTrigger?.metric === 'pain');
        if (painScene && !dismissed.includes(painScene.sceneId)) {
          newSuggestions.push({
            scene: painScene,
            reason: `Your pain level is ${latest.painLevel}/10. This scene will dim lights and cool the room.`,
            priority: 'high',
          });
        }
      }

      // Low energy level
      if (latest.energyLevel && latest.energyLevel <= 3) {
        const energyScene = allScenes.find(s => s.name === 'Good Energy' || s.healthTrigger?.metric === 'energy');
        if (energyScene && !dismissed.includes(energyScene.sceneId)) {
          newSuggestions.push({
            scene: energyScene,
            reason: `Your energy is low (${latest.energyLevel}/10). Brighter lights might help.`,
            priority: 'medium',
          });
        }
      }

      // High anxiety
      if (latest.anxietyLevel && latest.anxietyLevel >= 7) {
        const anxietyScene = allScenes.find(s => s.name === 'Crisis Mode' || s.healthTrigger?.metric === 'anxiety');
        if (anxietyScene && !dismissed.includes(anxietyScene.sceneId)) {
          newSuggestions.push({
            scene: anxietyScene,
            reason: `Anxiety is high (${latest.anxietyLevel}/10). Creating a calming environment.`,
            priority: 'high',
          });
        }
      }

      // Good mood and energy - suggest energizing scene
      if (latest.moodLevel && latest.moodLevel >= 7 && latest.energyLevel && latest.energyLevel >= 7) {
        const goodDayScene = allScenes.find(s => s.name === 'Good Energy');
        if (goodDayScene && !dismissed.includes(goodDayScene.sceneId)) {
          newSuggestions.push({
            scene: goodDayScene,
            reason: "You're having a good day! Optimize your space for productivity.",
            priority: 'low',
          });
        }
      }

      // Time-based suggestions
      const hour = new Date().getHours();
      if (hour >= 21 || hour <= 5) {
        const bedtimeScene = allScenes.find(s => s.name === 'Bedtime');
        if (bedtimeScene && !dismissed.includes(bedtimeScene.sceneId)) {
          newSuggestions.push({
            scene: bedtimeScene,
            reason: "It's late. Would you like to prepare for sleep?",
            priority: 'medium',
          });
        }
      } else if (hour >= 6 && hour <= 9) {
        const morningScene = allScenes.find(s => s.name === 'Good Morning');
        if (morningScene && !dismissed.includes(morningScene.sceneId)) {
          newSuggestions.push({
            scene: morningScene,
            reason: "Good morning! Start your day with the right lighting.",
            priority: 'low',
          });
        }
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (sceneId: string) => {
    try {
      await executeScene(sceneId);
      setDismissed([...dismissed, sceneId]);
      setSuggestions(suggestions.filter(s => s.scene.sceneId !== sceneId));
    } catch (error) {
      console.error('Failed to activate scene:', error);
    }
  };

  const handleDismiss = (sceneId: string) => {
    setDismissed([...dismissed, sceneId]);
    setSuggestions(suggestions.filter(s => s.scene.sceneId !== sceneId));
  };

  if (loading || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {suggestions.map(({ scene, reason, priority }) => {
        const priorityColors = {
          low: 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20',
          medium: 'border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20',
          high: 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20',
        };

        const priorityTextColors = {
          low: 'text-blue-700 dark:text-blue-300',
          medium: 'text-purple-700 dark:text-purple-300',
          high: 'text-red-700 dark:text-red-300',
        };

        const priorityIconColors = {
          low: 'text-blue-600 dark:text-blue-400',
          medium: 'text-purple-600 dark:text-purple-400',
          high: 'text-red-600 dark:text-red-400',
        };

        return (
          <div
            key={scene.sceneId}
            className={`border-2 rounded-xl p-4 ${priorityColors[priority]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${priorityIconColors[priority]}`}>
                  {priority === 'high' ? (
                    <Activity className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${priorityTextColors[priority]}`}>
                    Suggested: {scene.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{reason}</p>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(scene.sceneId)}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleActivate(scene.sceneId)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  priority === 'high'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : priority === 'medium'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Play className="w-4 h-4" />
                Activate Now
              </button>
              <button
                onClick={() => handleDismiss(scene.sceneId)}
                className="px-4 py-2 bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
