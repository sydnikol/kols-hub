import React, { useState } from 'react';
import { Dices, Plus, Trash2, Save, History } from 'lucide-react';

interface DiceRoll {
  id: string;
  notation: string;
  result: number;
  rolls: number[];
  timestamp: Date;
  description?: string;
}

const DiceRoller: React.FC = () => {
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const [customNotation, setCustomNotation] = useState('');
  const [description, setDescription] = useState('');

  const rollDice = (notation: string, desc: string = '') => {
    const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/i);
    if (!match) return;

    const count = parseInt(match[1] || '1');
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || '0');

    const diceRolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = diceRolls.reduce((sum, roll) => sum + roll, 0) + modifier;

    const roll: DiceRoll = {
      id: Date.now().toString(),
      notation: notation,
      result: total,
      rolls: diceRolls,
      timestamp: new Date(),
      description: desc || description
    };

    setRolls([roll, ...rolls]);
    setDescription('');
  };

  const quickRolls = [
    { label: 'd4', notation: '1d4' },
    { label: 'd6', notation: '1d6' },
    { label: 'd8', notation: '1d8' },
    { label: 'd10', notation: '1d10' },
    { label: 'd12', notation: '1d12' },
    { label: 'd20', notation: '1d20' },
    { label: 'd100', notation: '1d100' },
    { label: 'Advantage', notation: '2d20' },
    { label: 'Disadvantage', notation: '2d20' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
          <Dices className="w-6 h-6" />
          Dice Roller
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {quickRolls.map((dice) => (
            <button
              key={dice.label}
              onClick={() => rollDice(dice.notation, dice.label)}
              className="bg-purple-800/30 hover:bg-purple-700/50 rounded-lg p-4 transition-all text-purple-200 font-bold"
            >
              {dice.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Roll description (optional)"
            className="flex-1 bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 placeholder-purple-500 outline-none border border-purple-500/30 focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customNotation}
            onChange={(e) => setCustomNotation(e.target.value)}
            placeholder="Custom notation (e.g., 2d6+3)"
            className="flex-1 bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 placeholder-purple-500 outline-none border border-purple-500/30 focus:border-purple-500"
          />
          <button
            onClick={() => { rollDice(customNotation); setCustomNotation(''); }}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center gap-2"
          >
            <Dices className="w-4 h-4" />
            Roll
          </button>
        </div>
      </div>

      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
            <History className="w-5 h-5" />
            Roll History
          </h3>
          <button
            onClick={() => setRolls([])}
            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rolls.map((roll) => (
            <div key={roll.id} className="bg-purple-800/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-purple-200 font-semibold">{roll.notation} = {roll.result}</div>
                  {roll.description && <div className="text-sm text-purple-400">{roll.description}</div>}
                  <div className="text-xs text-purple-500">Rolls: [{roll.rolls.join(', ')}]</div>
                </div>
                <div className="text-sm text-purple-400">{new Date(roll.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          {rolls.length === 0 && (
            <div className="text-center py-8 text-purple-400">
              <Dices className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No rolls yet. Click a die to start rolling!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
