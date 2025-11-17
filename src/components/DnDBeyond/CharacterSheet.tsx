import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Heart, Zap, Users, Book, Download, Upload, Eye } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  hp: { current: number; max: number; temp: number };
  ac: number;
  speed: number;
  initiative: number;
  proficiencyBonus: number;
  stats: {
    str: number; dex: number; con: number;
    int: number; wis: number; cha: number;
  };
  savingThrows: {
    str: boolean; dex: boolean; con: boolean;
    int: boolean; wis: boolean; cha: boolean;
  };
  skills: {
    acrobatics: boolean; animalHandling: boolean; arcana: boolean; athletics: boolean;
    deception: boolean; history: boolean; insight: boolean; intimidation: boolean;
    investigation: boolean; medicine: boolean; nature: boolean; perception: boolean;
    performance: boolean; persuasion: boolean; religion: boolean; sleightOfHand: boolean;
    sblueth: boolean; survival: boolean;
  };
  spells?: { level: number; name: string; prepared: boolean }[];
  equipment?: { name: string; quantity: number; equipped: boolean }[];
  features?: { name: string; description: string; source: string }[];
  notes?: string;
  avatar?: string;
}

interface CharacterSheetProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  selectedCharacter: Character | null;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ characters, setCharacters, selectedCharacter }) => {
  const [viewing, setViewing] = useState<Character | null>(selectedCharacter);
  const [editing, setEditing] = useState(false);
  const [newCharacter, setNewCharacter] = useState(false);

  const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

  const createNewCharacter = () => {
    const character: Character = {
      id: Date.now().toString(),
      name: 'New Character',
      class: 'Fighter',
      level: 1,
      race: 'Human',
      background: 'Folk Hero',
      hp: { current: 10, max: 10, temp: 0 },
      ac: 16,
      speed: 30,
      initiative: 0,
      proficiencyBonus: 2,
      stats: { str: 15, dex: 13, con: 14, int: 10, wis: 12, cha: 11 },
      savingThrows: { str: true, dex: false, con: true, int: false, wis: false, cha: false },
      skills: {
        acrobatics: false, animalHandling: true, arcana: false, athletics: true,
        deception: false, history: false, insight: false, intimidation: false,
        investigation: false, medicine: false, nature: false, perception: true,
        performance: false, persuasion: false, religion: false, sleightOfHand: false,
        sblueth: false, survival: true
      },
      spells: [],
      equipment: [
        { name: 'Longsword', quantity: 1, equipped: true },
        { name: 'Chain Mail', quantity: 1, equipped: true },
        { name: 'Shield', quantity: 1, equipped: true }
      ],
      features: [
        { name: 'Second Wind', description: 'Regain HP once per short rest', source: 'Fighter 1' }
      ],
      notes: ''
    };
    setCharacters([...characters, character]);
    setViewing(character);
    setEditing(true);
    setNewCharacter(false);
  };

  const deleteCharacter = (id: string) => {
    if (confirm('Are you sure you want to delete this character?')) {
      setCharacters(characters.filter(c => c.id !== id));
      setViewing(null);
    }
  };

  const updateCharacter = (updated: Character) => {
    setCharacters(characters.map(c => c.id === updated.id ? updated : c));
    setViewing(updated);
  };

  if (!viewing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-300">Your Characters</h2>
          <button
            onClick={createNewCharacter}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Character
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <div key={char.id} className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:bg-purple-900/40 transition-all cursor-pointer" onClick={() => setViewing(char)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-200">{char.name}</h3>
                  <p className="text-purple-400">Level {char.level} {char.class}</p>
                  <p className="text-sm text-purple-400">{char.race} • {char.background}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div><div className="text-purple-400">HP</div><div className="font-bold text-purple-200">{char.hp.current}/{char.hp.max}</div></div>
                <div><div className="text-purple-400">AC</div><div className="font-bold text-purple-200">{char.ac}</div></div>
                <div><div className="text-purple-400">SPD</div><div className="font-bold text-purple-200">{char.speed}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setViewing(null)} className="text-purple-400 hover:text-purple-300">← Back to Characters</button>
        <div className="flex gap-2">
          <button onClick={() => setEditing(!editing)} className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg transition-all flex items-center gap-2">
            <Edit className="w-4 h-4" />{editing ? 'View' : 'Edit'}
          </button>
          <button onClick={() => deleteCharacter(viewing.id)} className="px-4 py-2 bg-red-600/50 hover:bg-red-600/70 rounded-lg transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" />Delete
          </button>
        </div>
      </div>
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {editing ? (<input value={viewing.name} onChange={(e) => updateCharacter({...viewing, name: e.target.value})} className="text-3xl font-bold bg-transparent border-b-2 border-purple-500/50 focus:border-purple-500 outline-none text-purple-200 w-full" />) : (<h2 className="text-3xl font-bold text-purple-200">{viewing.name}</h2>)}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(viewing.stats).map(([stat, value]) => (
                <div key={stat} className="bg-purple-800/20 rounded-lg p-4 text-center">
                  <div className="text-xs text-purple-400 uppercase">{stat}</div>
                  {editing ? <input type="number" value={value} onChange={(e) => updateCharacter({...viewing, stats: {...viewing.stats, [stat]: parseInt(e.target.value)}})} className="w-16 bg-transparent text-2xl font-bold text-center text-purple-200 outline-none" /> : <div className="text-2xl font-bold text-purple-200">{value}</div>}
                  <div className="text-purple-400">{calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-800/20 rounded-lg p-4 text-center">
              <div className="text-sm text-purple-400">Hit Points</div>
              <div className="text-3xl font-bold text-purple-200">{viewing.hp.current} / {viewing.hp.max}</div>
              {editing && <input type="range" min="0" max={viewing.hp.max} value={viewing.hp.current} onChange={(e) => updateCharacter({...viewing, hp: {...viewing.hp, current: parseInt(e.target.value)}})} className="w-full mt-2" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/20 rounded-lg p-4 text-center"><div className="text-sm text-purple-400">AC</div><div className="text-2xl font-bold text-purple-200">{viewing.ac}</div></div>
              <div className="bg-purple-800/20 rounded-lg p-4 text-center"><div className="text-sm text-purple-400">Speed</div><div className="text-2xl font-bold text-purple-200">{viewing.speed}</div></div>
              <div className="bg-purple-800/20 rounded-lg p-4 text-center"><div className="text-sm text-purple-400">Initiative</div><div className="text-2xl font-bold text-purple-200">+{calculateModifier(viewing.stats.dex)}</div></div>
              <div className="bg-purple-800/20 rounded-lg p-4 text-center"><div className="text-sm text-purple-400">Prof Bonus</div><div className="text-2xl font-bold text-purple-200">+{viewing.proficiencyBonus}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
