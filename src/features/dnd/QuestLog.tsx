/**
 * QUEST LOG
 * Track active and completed quests with objectives
 */

import React, { useState } from 'react';
import { Book, CheckCircle, Circle, Star, MapPin, Trophy } from 'lucide-react';
import { DnDQuest } from './types';

interface QuestLogProps {
  activeQuests: DnDQuest[];
  completedQuests: DnDQuest[];
}

export const QuestLog: React.FC<QuestLogProps> = ({ activeQuests, completedQuests }) => {
  const [selectedQuest, setSelectedQuest] = useState<DnDQuest | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const quests = showCompleted ? completedQuests : activeQuests;

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Book className="w-6 h-6 text-purple-400" />
          Quest Log
        </h2>

        {/* Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowCompleted(false)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !showCompleted
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Active ({activeQuests.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              showCompleted
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Completed ({completedQuests.length})
          </button>
        </div>
      </div>

      {/* Quest List */}
      {quests.length === 0 ? (
        <div className="text-center py-12">
          <Book className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-gray-500">
            {showCompleted ? 'No completed quests yet' : 'No active quests'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {showCompleted
              ? 'Complete quests to see them here'
              : 'Talk to NPCs to discover new quests'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quests.map(quest => {
            const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
            const totalObjectives = quest.objectives.length;
            const progress = (completedObjectives / totalObjectives) * 100;
            const isSelected = selectedQuest?.id === quest.id;

            return (
              <div key={quest.id} className="space-y-2">
                {/* Quest Card */}
                <div
                  onClick={() => setSelectedQuest(isSelected ? null : quest)}
                  className={`bg-white/5 rounded-lg p-4 border cursor-pointer transition-all hover:bg-white/10 ${
                    isSelected ? 'border-purple-500 bg-purple-500/10' : 'border-transparent'
                  }`}
                >
                  {/* Quest Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{quest.name}</h3>
                        {quest.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {quest.location}
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          quest.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          quest.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          quest.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {quest.difficulty}
                        </span>
                        <span>•</span>
                        <span>Level {quest.level}</span>
                      </div>
                    </div>

                    {quest.status !== 'completed' && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-purple-400">
                          {completedObjectives}/{totalObjectives}
                        </div>
                        <div className="text-xs text-gray-400">Objectives</div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-3">{quest.description}</p>

                  {/* Progress Bar */}
                  {quest.status !== 'completed' && (
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Quest Giver */}
                  <div className="text-xs text-gray-500">
                    Quest Giver: {quest.questGiver}
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
                    {/* Objectives */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        Objectives
                      </h4>
                      <div className="space-y-2">
                        {quest.objectives.map(objective => (
                          <div
                            key={objective.id}
                            className={`flex items-start gap-3 p-2 rounded-lg ${
                              objective.completed ? 'bg-green-500/10' : 'bg-white/5'
                            }`}
                          >
                            {objective.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm ${
                                objective.completed ? 'text-green-300 line-through' : 'text-gray-300'
                              }`}>
                                {objective.description}
                              </p>
                              {!objective.completed && objective.currentProgress > 0 && (
                                <div className="mt-1 flex items-center gap-2">
                                  <div className="flex-1 bg-gray-700 rounded-full h-1">
                                    <div
                                      className="bg-purple-500 h-1 rounded-full transition-all"
                                      style={{
                                        width: `${(objective.currentProgress / objective.requiredProgress) * 100}%`
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {objective.currentProgress}/{objective.requiredProgress}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div>
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        Rewards
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-400 mb-1">Experience</div>
                          <div className="text-lg font-bold text-blue-400">{quest.rewards.xp} XP</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-400 mb-1">Gold</div>
                          <div className="text-lg font-bold text-yellow-400">{quest.rewards.gold} gp</div>
                        </div>
                      </div>

                      {quest.rewards.items && quest.rewards.items.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-400 mb-2">Items:</div>
                          <div className="space-y-1">
                            {quest.rewards.items.map(item => (
                              <div key={item.id} className="bg-white/5 rounded p-2 text-sm">
                                {item.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {quest.rewards.reputation && (
                        <div className="mt-2 text-xs text-gray-400">
                          Reputation: <span className="text-purple-400">{quest.rewards.reputation}</span>
                        </div>
                      )}
                    </div>

                    {/* Timestamps */}
                    {quest.status === 'completed' && quest.completedAt && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-xs text-gray-500">
                          Completed: {new Date(quest.completedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestLog;
