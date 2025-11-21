/**
 * INVENTORY MANAGER
 * Comprehensive inventory system with equipment, items, and gold tracking
 */

import React, { useState } from 'react';
import { Backpack, Sword, Shield, Sparkles, Trash2, Plus } from 'lucide-react';
import { DnDCharacter, Item } from './types';

interface InventoryManagerProps {
  characters: DnDCharacter[];
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ characters }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<DnDCharacter | null>(
    characters[0] || null
  );
  const [filterType, setFilterType] = useState<string>('all');

  if (!selectedCharacter) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
        <p className="text-gray-400">No characters available</p>
      </div>
    );
  }

  const filteredInventory = filterType === 'all'
    ? selectedCharacter.inventory
    : selectedCharacter.inventory.filter(item => item.type === filterType);

  const totalWeight = selectedCharacter.inventory.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  const totalValue = selectedCharacter.inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Backpack className="w-6 h-6 text-purple-400" />
          Inventory
        </h2>

        {/* Character Selector */}
        {characters.length > 1 && (
          <select
            value={selectedCharacter.id}
            onChange={(e) => {
              const char = characters.find(c => c.id === e.target.value);
              if (char) setSelectedCharacter(char);
            }}
            className="w-full mb-4 bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {characters.map(char => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
        )}

        {/* Inventory Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Gold</div>
            <div className="text-2xl font-bold text-yellow-400">{selectedCharacter.gold}</div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Weight</div>
            <div className="text-2xl font-bold text-blue-400">{totalWeight.toFixed(1)} lbs</div>
          </div>

          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Value</div>
            <div className="text-2xl font-bold text-purple-400">{totalValue} gp</div>
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sword className="w-5 h-5 text-orange-400" />
          Equipped
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Weapon */}
          <div className="bg-white/5 rounded-lg p-3 border border-orange-500/30">
            <div className="text-xs text-gray-400 mb-2">Main Hand</div>
            {selectedCharacter.weapon ? (
              <div>
                <div className="font-semibold">{selectedCharacter.weapon.name}</div>
                <div className="text-xs text-gray-400">{selectedCharacter.weapon.damage} {selectedCharacter.weapon.damageType}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No weapon equipped</div>
            )}
          </div>

          {/* Armor */}
          <div className="bg-white/5 rounded-lg p-3 border border-blue-500/30">
            <div className="text-xs text-gray-400 mb-2">Armor</div>
            {selectedCharacter.armor ? (
              <div>
                <div className="font-semibold">{selectedCharacter.armor.name}</div>
                <div className="text-xs text-gray-400">AC {selectedCharacter.armor.armorClass}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No armor equipped</div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All', icon: Backpack },
          { id: 'weapon', label: 'Weapons', icon: Sword },
          { id: 'armor', label: 'Armor', icon: Shield },
          { id: 'potion', label: 'Potions', icon: Sparkles }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilterType(id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filterType === id
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Backpack className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No items in this category</p>
          </div>
        ) : (
          filteredInventory.map(item => (
            <div
              key={item.id}
              className={`bg-white/5 rounded-lg p-4 border transition-all hover:bg-white/10 ${
                item.magical
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{item.name}</span>
                    {item.magical && (
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    )}
                    {item.rarity && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.rarity === 'common' ? 'bg-gray-500/20 text-gray-400' :
                        item.rarity === 'uncommon' ? 'bg-green-500/20 text-green-400' :
                        item.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                        item.rarity === 'very rare' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {item.rarity}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>

                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Qty: {item.quantity}</span>
                    <span>•</span>
                    <span>Weight: {(item.weight * item.quantity).toFixed(1)} lbs</span>
                    <span>•</span>
                    <span>Value: {item.value * item.quantity} gp</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {item.type === 'weapon' && !selectedCharacter.weapon && (
                    <button className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-all">
                      Equip
                    </button>
                  )}
                  {item.type === 'armor' && !selectedCharacter.armor && (
                    <button className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-all">
                      Equip
                    </button>
                  )}
                  {item.type === 'potion' && (
                    <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-all">
                      Use
                    </button>
                  )}
                  <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-all flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                    Drop
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Item Button (for testing/admin) */}
      <button className="w-full mt-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        Add Item (Debug)
      </button>
    </div>
  );
};

export default InventoryManager;
