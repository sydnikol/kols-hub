/**
 * COMBAT TRACKER
 * Turn-based combat management with initiative tracking
 */

import React, { useState } from 'react';
import { Sword, Shield, Heart, Zap, Target, Skull } from 'lucide-react';
import { DnDCombatEncounter, DnDCharacter, Enemy } from './types';
import { AIDungeonMaster } from './AIDungeonMaster';

interface CombatTrackerProps {
  encounter: DnDCombatEncounter;
  characters: DnDCharacter[];
  onCombatAction: (characterId: string, actionType: string, targetId?: string) => void;
  aiDM: AIDungeonMaster;
}

export const CombatTracker: React.FC<CombatTrackerProps> = ({
  encounter,
  characters,
  onCombatAction,
  aiDM
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('attack');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([
    `Combat begins! ${encounter.name}`
  ]);

  const currentTurn = encounter.turnOrder[encounter.currentTurnIndex];
  const isPlayerTurn = currentTurn?.type === 'player';

  const handleAction = () => {
    if (!currentTurn || !selectedTarget) return;

    const character = characters.find(c => c.id === currentTurn.id);
    if (!character) return;

    onCombatAction(character.id, selectedAction, selectedTarget);

    setCombatLog(prev => [
      ...prev,
      `${character.name} uses ${selectedAction} on ${selectedTarget}`
    ]);
  };

  const calculateHPPercentage = (current: number, max: number): number => {
    return (current / max) * 100;
  };

  const getHPColor = (percentage: number): string => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-red-500/30">
      {/* Combat Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-red-400">
          <Sword className="w-6 h-6" />
          {encounter.name}
        </h2>
        <p className="text-gray-400">{encounter.description}</p>
        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="text-purple-400">Round {encounter.round}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-300">{encounter.environment}</span>
        </div>
      </div>

      {/* Turn Order */}
      <div className="mb-6 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-lg p-4 border border-purple-500/30">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Initiative Order
        </h3>
        <div className="space-y-2">
          {encounter.turnOrder.map((turn, index) => (
            <div
              key={turn.id}
              className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                index === encounter.currentTurnIndex
                  ? 'bg-purple-500/40 border-2 border-purple-400'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  turn.type === 'player' ? 'bg-green-400' :
                  turn.type === 'enemy' ? 'bg-red-400' :
                  'bg-blue-400'
                }`} />
                <span className="font-semibold">{turn.name}</span>
                {index === encounter.currentTurnIndex && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    TURN
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                Initiative: {turn.initiative}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Characters */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Party
          </h3>
          <div className="space-y-2">
            {characters.map(character => {
              const hpPercentage = calculateHPPercentage(character.currentHP, character.maxHP);
              return (
                <div
                  key={character.id}
                  className={`bg-white/5 rounded-lg p-3 border ${
                    currentTurn?.id === character.id
                      ? 'border-purple-500'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{character.name}</div>
                      <div className="text-xs text-gray-400">
                        AC {character.armorClass} • ATK +{character.attackBonus}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {character.currentHP}/{character.maxHP}
                      </div>
                      <div className="text-xs text-gray-400">HP</div>
                    </div>
                  </div>
                  {/* HP Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`${getHPColor(hpPercentage)} h-2 rounded-full transition-all`}
                      style={{ width: `${hpPercentage}%` }}
                    />
                  </div>
                  {character.conditions.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {character.conditions.map(condition => (
                        <span
                          key={condition}
                          className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enemies */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-400" />
            Enemies
          </h3>
          <div className="space-y-2">
            {encounter.enemies.map(enemy => {
              const hpPercentage = calculateHPPercentage(enemy.currentHP, enemy.maxHP);
              const isDefeated = enemy.status === 'defeated';

              return (
                <div
                  key={enemy.id}
                  className={`bg-white/5 rounded-lg p-3 border cursor-pointer transition-all ${
                    selectedTarget === enemy.id
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-transparent hover:border-red-500/30'
                  } ${isDefeated ? 'opacity-50' : ''}`}
                  onClick={() => !isDefeated && setSelectedTarget(enemy.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {enemy.name}
                        {isDefeated && (
                          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                            DEFEATED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        AC {enemy.armorClass} • CR {enemy.challengeRating}
                      </div>
                    </div>
                    {!isDefeated && (
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {enemy.currentHP}/{enemy.maxHP}
                        </div>
                        <div className="text-xs text-gray-400">HP</div>
                      </div>
                    )}
                  </div>
                  {!isDefeated && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${getHPColor(hpPercentage)} h-2 rounded-full transition-all`}
                        style={{ width: `${hpPercentage}%` }}
                      />
                    </div>
                  )}
                  {enemy.resistances.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-400">
                        Resistant: {enemy.resistances.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Player Actions (only show on player's turn) */}
      {isPlayerTurn && (
        <div className="mt-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
          <h3 className="text-lg font-bold mb-3">Your Turn!</h3>

          {/* Action Selection */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { id: 'attack', label: 'Attack', icon: Sword },
              { id: 'cast-spell', label: 'Cast Spell', icon: Zap },
              { id: 'use-item', label: 'Use Item', icon: Heart },
              { id: 'dodge', label: 'Dodge', icon: Shield }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedAction(id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                  selectedAction === id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>

          {/* Target Info */}
          {selectedTarget && (
            <div className="mb-3 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">
                  Target: {encounter.enemies.find(e => e.id === selectedTarget)?.name || 'Unknown'}
                </span>
              </div>
            </div>
          )}

          {/* Execute Action Button */}
          <button
            onClick={handleAction}
            disabled={!selectedTarget}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
          >
            {selectedAction === 'attack' && 'Attack!'}
            {selectedAction === 'cast-spell' && 'Cast Spell'}
            {selectedAction === 'use-item' && 'Use Item'}
            {selectedAction === 'dodge' && 'Dodge'}
          </button>
        </div>
      )}

      {/* Enemy Turn Indicator */}
      {!isPlayerTurn && currentTurn && (
        <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-lg font-semibold">
            {currentTurn.name}'s turn...
          </p>
          <p className="text-sm text-gray-400 mt-1">
            The AI DM is deciding their action
          </p>
        </div>
      )}

      {/* Combat Log */}
      <div className="mt-6">
        <h3 className="text-sm font-bold mb-2 text-gray-400">Combat Log</h3>
        <div className="bg-black/40 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
          {combatLog.map((log, i) => (
            <div key={i} className="text-sm text-gray-300">
              <span className="text-purple-400 mr-2">&gt;</span>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CombatTracker;
