import React, { useState } from 'react';
import { Sparkles, Search, Filter, Book, Plus } from 'lucide-react';

interface Spell {
  name: string; level: number; school: string; castingTime: string;
  range: string; components: string; duration: string; description: string;
  classes: string[]; prepared?: boolean;
}

const SpellBook: React.FC = () => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [prepared, setPrepared] = useState<Set<string>>(new Set());

  const sampleSpells: Spell[] = [
    { name: 'Fireball', level: 3, school: 'Evocation', castingTime: '1 action', range: '150 feet', components: 'V, S, M', duration: 'Instantaneous', description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.', classes: ['Sorcerer', 'Wizard'] },
    { name: 'Magic Missile', level: 1, school: 'Evocation', castingTime: '1 action', range: '120 feet', components: 'V, S', duration: 'Instantaneous', description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range.', classes: ['Sorcerer', 'Wizard'] },
    { name: 'Cure Wounds', level: 1, school: 'Evocation', castingTime: '1 action', range: 'Touch', components: 'V, S', duration: 'Instantaneous', description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger'] },
    { name: 'Shield', level: 1, school: 'Abjuration', castingTime: '1 reaction', range: 'Self', components: 'V, S', duration: '1 round', description: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC.', classes: ['Sorcerer', 'Wizard'] }
  ];

  const filteredSpells = sampleSpells.filter(spell => {
    const matchesSearch = spell.name.toLowerCase().includes(search.toLowerCase()) || spell.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || spell.level === levelFilter;
    const matchesClass = classFilter === 'all' || spell.classes.includes(classFilter);
    return matchesSearch && matchesLevel && matchesClass;
  });

  const togglePrepared = (spellName: string) => {
    const newPrepared = new Set(prepared);
    if (newPrepared.has(spellName)) {
      newPrepared.delete(spellName);
    } else {
      newPrepared.add(spellName);
    }
    setPrepared(newPrepared);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Spell Book
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spells..."
              className="w-full bg-purple-800/30 rounded-lg pl-10 pr-4 py-2 text-purple-200 placeholder-purple-500 outline-none border border-purple-500/30 focus:border-purple-500"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 outline-none border border-purple-500/30 focus:border-purple-500"
          >
            <option value="all">All Levels</option>
            {[0,1,2,3,4,5,6,7,8,9].map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 outline-none border border-purple-500/30 focus:border-purple-500"
          >
            <option value="all">All Classes</option>
            {['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'].map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSpells.map((spell) => (
          <div key={spell.name} className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-purple-200">{spell.name}</h3>
                <p className="text-purple-400">Level {spell.level} {spell.school}</p>
              </div>
              <button
                onClick={() => togglePrepared(spell.name)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  prepared.has(spell.name)
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-800/30 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                {prepared.has(spell.name) ? 'Prepared' : 'Prepare'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div><span className="text-purple-400">Casting Time:</span> <span className="text-purple-200">{spell.castingTime}</span></div>
              <div><span className="text-purple-400">Range:</span> <span className="text-purple-200">{spell.range}</span></div>
              <div><span className="text-purple-400">Components:</span> <span className="text-purple-200">{spell.components}</span></div>
              <div><span className="text-purple-400">Duration:</span> <span className="text-purple-200">{spell.duration}</span></div>
            </div>
            <p className="text-purple-300">{spell.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {spell.classes.map(cls => (
                <span key={cls} className="px-3 py-1 bg-purple-800/30 rounded-full text-xs text-purple-300">{cls}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellBook;
