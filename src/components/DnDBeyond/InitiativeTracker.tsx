import React, { useState } from 'react';
import { Zap, Plus, Trash2, Play, Pause, RotateCcw } from 'lucide-react';

interface Character { id: string; name: string; initiative: number; hp: { current: number; max: number }; ac: number; }
interface InitiativeTrackerProps { characters: Character[]; }

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({ characters }) => {
  const [combatants, setCombatants] = useState<Array<Character & { type: 'pc' | 'npc' }>>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [inCombat, setInCombat] = useState(false);

  const addCharacter = (char: Character) => { setCombatants([...combatants, { ...char, type: 'pc', initiative: Math.floor(Math.random() * 20) + 1 }]); };
  const addMonster = () => { const monster: Character & { type: 'pc' | 'npc' } = { id: Date.now().toString(), name: 'Monster', initiative: Math.floor(Math.random() * 20) + 1, hp: { current: 20, max: 20 }, ac: 12, type: 'npc' }; setCombatants([...combatants, monster]); };

  const sortByInitiative = () => { setCombatants([...combatants].sort((a, b) => b.initiative - a.initiative)); };

  const nextTurn = () => {
    if (currentTurn >= combatants.length - 1) {
      setCurrentTurn(0);
      setRound(round + 1);
    } else {
      setCurrentTurn(currentTurn + 1);
    }
  };

  const startCombat = () => { sortByInitiative(); setInCombat(true); setCurrentTurn(0); setRound(1); };
  const endCombat = () => { setInCombat(false); setCombatants([]); setRound(1); setCurrentTurn(0); };

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2"><Zap className="w-6 h-6" />Initiative Tracker</h2>
          <div className="flex gap-2">
            {!inCombat ? <button onClick={startCombat} disabled={combatants.length === 0} className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-all flex items-center gap-2"><Play className="w-4 h-4" />Start Combat</button> : <><button onClick={nextTurn} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all">Next Turn</button><button onClick={endCombat} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all">End Combat</button></>}
          </div>
        </div>
        {inCombat && <div className="text-center py-4 bg-purple-800/30 rounded-lg mb-4"><div className="text-3xl font-bold text-purple-200">Round {round}</div><div className="text-purple-400">Current Turn: {combatants[currentTurn]?.name || 'None'}</div></div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-bold text-purple-300 mb-3">Add Characters</h3>
          <div className="space-y-2">
            {characters.map(char => (
              <button key={char.id} onClick={() => addCharacter(char)} className="w-full text-left bg-purple-800/30 hover:bg-purple-800/50 rounded-lg p-3 transition-all text-purple-200">{char.name} (Level {char.level})</button>
            ))}
          </div>
        </div>
        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-bold text-purple-300 mb-3">Add Monsters</h3>
          <button onClick={addMonster} className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Monster</button>
        </div>
      </div>

      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-bold text-purple-300 mb-4">Initiative Order</h3>
        <div className="space-y-2">
          {combatants.map((combatant, index) => (
            <div key={combatant.id} className={`bg-purple-800/30 rounded-lg p-4 transition-all ${inCombat && index === currentTurn ? 'bg-purple-600/50 ring-2 ring-purple-400' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-purple-300 w-12 text-center">{combatant.initiative}</div>
                  <div className="flex-1">
                    <input value={combatant.name} onChange={(e) => setCombatants(combatants.map(c => c.id === combatant.id ? {...c, name: e.target.value} : c))} className="text-lg font-semibold bg-transparent text-purple-200 outline-none w-full" />
                    <div className="text-sm text-purple-400">HP: {combatant.hp.current}/{combatant.hp.max} • AC: {combatant.ac}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" value={combatant.hp.current} onChange={(e) => setCombatants(combatants.map(c => c.id === combatant.id ? {...c, hp: {...c.hp, current: parseInt(e.target.value)}} : c))} className="w-16 bg-purple-800/50 rounded px-2 py-1 text-center text-purple-200 outline-none" />
                  <button onClick={() => setCombatants(combatants.filter(c => c.id !== combatant.id))} className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {combatants.length === 0 && <div className="text-center py-8 text-purple-400">No combatants added. Add characters or monsters to begin.</div>}
        </div>
      </div>
    </div>
  );
};

export default InitiativeTracker;
