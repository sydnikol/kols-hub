/**
 * DICE ROLLER
 * Beautiful 3D-style dice rolling with animations and history
 */

import React, { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trash2 } from 'lucide-react';
import { DiceRoll } from './types';

export class DiceRoller {
  /**
   * Roll dice with notation like "1d20+5" or "2d6"
   */
  roll(notation: string): DiceRoll {
    const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/i);
    if (!match) {
      throw new Error(`Invalid dice notation: ${notation}`);
    }

    const [_, numDice, diceSize, modifierStr] = match;
    const num = parseInt(numDice);
    const size = parseInt(diceSize);
    const modifier = modifierStr ? parseInt(modifierStr) : 0;

    const rolls: number[] = [];
    for (let i = 0; i < num; i++) {
      rolls.push(Math.floor(Math.random() * size) + 1);
    }

    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    const critical = num === 1 && size === 20 && rolls[0] === 20;
    const fumble = num === 1 && size === 20 && rolls[0] === 1;

    return {
      dice: notation,
      rolls,
      modifier,
      total,
      critical,
      fumble
    };
  }

  /**
   * Roll with advantage (roll twice, take higher)
   */
  rollWithAdvantage(notation: string): DiceRoll {
    const roll1 = this.roll(notation);
    const roll2 = this.roll(notation);
    return roll1.total >= roll2.total ? roll1 : roll2;
  }

  /**
   * Roll with disadvantage (roll twice, take lower)
   */
  rollWithDisadvantage(notation: string): DiceRoll {
    const roll1 = this.roll(notation);
    const roll2 = this.roll(notation);
    return roll1.total <= roll2.total ? roll1 : roll2;
  }

  /**
   * Roll ability check (1d20 + modifier)
   */
  rollAbilityCheck(abilityModifier: number, proficiencyBonus: number = 0): DiceRoll {
    const total = abilityModifier + proficiencyBonus;
    return this.roll(`1d20${total >= 0 ? '+' : ''}${total}`);
  }

  /**
   * Roll saving throw
   */
  rollSavingThrow(abilityModifier: number, proficient: boolean, proficiencyBonus: number): DiceRoll {
    const total = abilityModifier + (proficient ? proficiencyBonus : 0);
    return this.roll(`1d20${total >= 0 ? '+' : ''}${total}`);
  }
}

export const DiceRollerComponent: React.FC = () => {
  const [diceNotation, setDiceNotation] = useState('1d20');
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const diceRoller = new DiceRoller();

  const handleRoll = (notation?: string, type?: 'normal' | 'advantage' | 'disadvantage') => {
    setIsRolling(true);
    const rollNotation = notation || diceNotation;

    setTimeout(() => {
      let result: DiceRoll;

      if (type === 'advantage') {
        result = diceRoller.rollWithAdvantage(rollNotation);
      } else if (type === 'disadvantage') {
        result = diceRoller.rollWithDisadvantage(rollNotation);
      } else {
        result = diceRoller.roll(rollNotation);
      }

      setLastRoll(result);
      setRollHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 rolls
      setIsRolling(false);
    }, 500);
  };

  const getDiceIcon = (value: number) => {
    switch (value) {
      case 1: return <Dice1 className="w-6 h-6" />;
      case 2: return <Dice2 className="w-6 h-6" />;
      case 3: return <Dice3 className="w-6 h-6" />;
      case 4: return <Dice4 className="w-6 h-6" />;
      case 5: return <Dice5 className="w-6 h-6" />;
      case 6: return <Dice6 className="w-6 h-6" />;
      default: return <Dice6 className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-4 border border-purple-500/30">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Dice6 className="w-5 h-5 text-purple-400" />
        Dice Roller
      </h3>

      {/* Current Roll Display */}
      {lastRoll && (
        <div className={`mb-4 p-4 rounded-lg border-2 ${
          lastRoll.critical ? 'bg-green-500/20 border-green-500' :
          lastRoll.fumble ? 'bg-red-500/20 border-red-500' :
          'bg-purple-500/20 border-purple-500'
        } ${isRolling ? 'animate-pulse' : ''}`}>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {lastRoll.critical && '🎉 '}
              {lastRoll.total}
              {lastRoll.fumble && ' 💀'}
            </div>
            <div className="text-sm text-gray-300">
              {lastRoll.dice}
              {lastRoll.critical && ' - CRITICAL HIT!'}
              {lastRoll.fumble && ' - CRITICAL MISS!'}
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {lastRoll.rolls.map((roll, i) => (
                <div key={i} className="bg-white/10 rounded p-2">
                  {getDiceIcon(Math.min(roll, 6))}
                  <div className="text-xs text-center mt-1">{roll}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dice Input */}
      <div className="mb-3">
        <input
          type="text"
          value={diceNotation}
          onChange={(e) => setDiceNotation(e.target.value)}
          placeholder="e.g., 1d20+5"
          className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Roll Buttons */}
      <div className="space-y-2 mb-4">
        <button
          onClick={() => handleRoll()}
          disabled={isRolling}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-all"
        >
          {isRolling ? 'Rolling...' : 'Roll'}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleRoll(diceNotation, 'advantage')}
            disabled={isRolling}
            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 disabled:opacity-50 text-green-400 font-semibold py-2 rounded-lg text-sm transition-all"
          >
            Advantage
          </button>
          <button
            onClick={() => handleRoll(diceNotation, 'disadvantage')}
            disabled={isRolling}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 disabled:opacity-50 text-red-400 font-semibold py-2 rounded-lg text-sm transition-all"
          >
            Disadvantage
          </button>
        </div>
      </div>

      {/* Quick Dice */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Quick Rolls:</p>
        <div className="grid grid-cols-3 gap-2">
          {['1d4', '1d6', '1d8', '1d10', '1d12', '1d20'].map(dice => (
            <button
              key={dice}
              onClick={() => handleRoll(dice)}
              className="bg-white/10 hover:bg-white/20 border border-purple-500/30 text-sm py-1 rounded transition-all"
            >
              {dice}
            </button>
          ))}
        </div>
      </div>

      {/* Roll History */}
      {rollHistory.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">History:</p>
            <button
              onClick={() => setRollHistory([])}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {rollHistory.map((roll, i) => (
              <div
                key={i}
                className="bg-white/5 rounded p-2 text-xs flex justify-between items-center"
              >
                <span className="text-gray-400">{roll.dice}</span>
                <span className={`font-bold ${
                  roll.critical ? 'text-green-400' :
                  roll.fumble ? 'text-red-400' :
                  'text-white'
                }`}>
                  {roll.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRollerComponent;
