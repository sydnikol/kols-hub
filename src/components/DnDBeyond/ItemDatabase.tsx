import React, { useState } from 'react';
import { Shield, Search, Plus } from 'lucide-react';

interface Item { name: string; type: string; rarity: string; attunement: boolean; description: string; properties?: string[]; equipped?: boolean; }

const ItemDatabase: React.FC = () => {
  const [search, setSearch] = useState('');
  const [equipped, setEquipped] = useState<Set<string>>(new Set());

  const items: Item[] = [
    { name: 'Longsword', type: 'Weapon', rarity: 'Common', attunement: false, description: 'A versatile martial weapon.', properties: ['Versatile (1d10)'] },
    { name: 'Bag of Holding', type: 'Wondrous Item', rarity: 'Uncommon', attunement: false, description: 'This bag has an interior space considerably larger than its outside dimensions.', properties: ['500 lb capacity', '64 cubic feet'] },
    { name: 'Flame Tongue', type: 'Weapon (Longsword)', rarity: 'Rare', attunement: true, description: 'You can use a bonus action to speak this magic sword\'s command word, causing flames to erupt from the blade.', properties: ['Requires Attunement', '+2d6 fire damage'] }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2"><Shield className="w-6 h-6" />Item Database</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="w-full bg-purple-800/30 rounded-lg pl-10 pr-4 py-2 text-purple-200 placeholder-purple-500 outline-none border border-purple-500/30 focus:border-purple-500" />
        </div>
      </div>
      <div className="space-y-4">
        {items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
          <div key={item.name} className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="text-xl font-bold text-purple-200">{item.name}</h3><p className="text-purple-400">{item.type} • {item.rarity}</p></div>
              <button onClick={() => { const newEquipped = new Set(equipped); if (newEquipped.has(item.name)) newEquipped.delete(item.name); else newEquipped.add(item.name); setEquipped(newEquipped); }} className={`px-4 py-2 rounded-lg transition-all ${equipped.has(item.name) ? 'bg-purple-600 text-white' : 'bg-purple-800/30 text-purple-300 hover:bg-purple-800/50'}`}>{equipped.has(item.name) ? 'Equipped' : 'Equip'}</button>
            </div>
            <p className="text-purple-300 mb-3">{item.description}</p>
            {item.properties && (
              <div className="flex flex-wrap gap-2">
                {item.properties.map(prop => (
                  <span key={prop} className="px-3 py-1 bg-purple-800/30 rounded-full text-xs text-purple-300">{prop}</span>
                ))}
                {item.attunement && <span className="px-3 py-1 bg-indigo-600/30 rounded-full text-xs text-indigo-300">Attunement Required</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemDatabase;
