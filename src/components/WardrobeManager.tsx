/**
 * 🖤 WARDROBE MANAGER
 * Outfit generator, comfort tracking, partner sync
 */

import React, { useState } from 'react';
import { Shirt, Sparkles, Heart, Calendar, Users } from 'lucide-react';

interface WardrobeItem {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'dress' | 'accessory' | 'shoes';
  comfort: number;
  aesthetic: string[];
  image?: string;
}

const WardrobeManager: React.FC = () => {
  const [items, setItems] = useState<WardrobeItem[]>([
    { id: '1', name: 'Black Velvet Dress', type: 'dress', comfort: 8, aesthetic: ['gothic', 'witchy'] },
    { id: '2', name: 'Purple Leather Harness', type: 'accessory', comfort: 7, aesthetic: ['goth', 'kinky'] },
    { id: '3', name: 'Platform Boots', type: 'shoes', comfort: 6, aesthetic: ['gothic', 'punk'] },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
          Wardrobe Manager
        </h1>
        <p className="text-gray-400">Outfit generator with comfort tracking & partner sync</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl">
          <Shirt className="mb-2 text-purple-400" size={32} />
          <div className="text-3xl font-bold">{items.length}</div>
          <div className="text-sm text-gray-300">Items Cataloged</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-900 to-purple-900 rounded-xl">
          <Sparkles className="mb-2 text-purple-400" size={32} />
          <div className="text-3xl font-bold">5</div>
          <div className="text-sm text-gray-300">Favorite Outfits</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl">
          <Heart className="mb-2 text-red-400" size={32} />
          <div className="text-3xl font-bold">8.2</div>
          <div className="text-sm text-gray-300">Avg Comfort</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-900 to-purple-900 rounded-xl">
          <Users className="mb-2 text-indigo-400" size={32} />
          <div className="text-3xl font-bold">3</div>
          <div className="text-sm text-gray-300">Partner Outfits</div>
        </div>
      </div>

      {/* Wardrobe Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all">
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <Shirt size={64} className="text-gray-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm px-2 py-1 bg-purple-900 rounded capitalize">{item.type}</span>
                <span className="text-sm px-2 py-1 bg-purple-900 rounded">
                  Comfort: {item.comfort}/10
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.aesthetic.map((aes, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-gray-700 rounded">
                    {aes}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outfit Generator */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-900 to-purple-900 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles />
          Outfit Generator
        </h2>
        <p className="text-gray-300 mb-4">Generate outfits based on weather, energy, aesthetic, and occasion</p>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all">
          Generate Outfit
        </button>
      </div>
    </div>
  );
};

export default WardrobeManager;