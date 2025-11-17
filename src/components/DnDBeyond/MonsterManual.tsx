import React, { useState } from 'react';
import { Swords, Search, Plus, Shield } from 'lucide-react';

interface Monster { name: string; cr: string; type: string; hp: number; ac: number; size: string; alignment: string; description: string; abilities: string[]; }

const MonsterManual: React.FC = () => {
  const [search, setSearch] = useState('');
  const monsters: Monster[] = [
    { name: 'Goblin', cr: '1/4', type: 'Humanoid', hp: 7, ac: 15, size: 'Small', alignment: 'Neutral Evil', description: 'Small, black-hearted humanoids that lair in despoiled dungeons and other dismal settings.', abilities: ['Nimble Escape'] },
    { name: 'Dragon', cr: '17', type: 'Dragon', hp: 256, ac: 19, size: 'Huge', alignment: 'Chaotic Evil', description: 'A legendary creature of immense power and cunning.', abilities: ['Legendary Resistance', 'Frightful Presence', 'Breath Weapon'] },
    { name: 'Orc', cr: '1/2', type: 'Humanoid', hp: 15, ac: 13, size: 'Medium', alignment: 'Chaotic Evil', description: 'Savage raiders and pillagers with stooped postures, piggish faces, and prominent teeth.', abilities: ['Aggressive'] }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2"><Swords className="w-6 h-6" />Monster Manual</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search monsters..." className="w-full bg-purple-800/30 rounded-lg pl-10 pr-4 py-2 text-purple-200 placeholder-purple-500 outline-none border border-purple-500/30 focus:border-purple-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {monsters.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map((monster) => (
          <div key={monster.name} className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="text-xl font-bold text-purple-200">{monster.name}</h3><p className="text-purple-400">{monster.size} {monster.type}, {monster.alignment}</p></div>
              <span className="px-3 py-1 bg-purple-600/50 rounded-full text-sm font-bold">CR {monster.cr}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div><span className="text-purple-400">HP:</span> <span className="text-purple-200">{monster.hp}</span></div>
              <div><span className="text-purple-400">AC:</span> <span className="text-purple-200">{monster.ac}</span></div>
            </div>
            <p className="text-purple-300 mb-3">{monster.description}</p>
            <div className="space-y-2">
              {monster.abilities.map(ability => (
                <div key={ability} className="text-sm"><span className="text-purple-400 font-semibold">{ability}:</span> <span className="text-purple-300">Special ability description</span></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonsterManual;
