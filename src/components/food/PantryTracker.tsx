import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Trash2, Edit2, AlertCircle, MapPin, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

interface PantryItem {
  id: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  sodiumPerServing: number; // mg
  servingSize: string;
  expirationDate?: string;
  tags: string[];
  notes?: string;
  addedDate: number;
}

const categories = [
  'Pantry Staples', 'Canned Goods', 'Snacks', 'Beverages',
  'Condiments', 'Spices', 'Frozen', 'Refrigerated',
  'Electrolytes', 'Emergency Foods', 'POTS-Friendly'
];

const commonLocations = [
  'Pantry Shelf 1', 'Pantry Shelf 2', 'Pantry Shelf 3',
  'Fridge - Top', 'Fridge - Bottom', 'Freezer',
  'Cabinet - Left', 'Cabinet - Right', 'Counter'
];

const quickTags = [
  'High Sodium', 'Low Sodium', 'Salty Snack', 'Comfort Food',
  'Nausea-Safe', 'Sensory-Safe', 'Soft Food', 'Quick Prep',
  'POTS Support', 'Electrolytes', 'No Cheese', 'Budget-Friendly'
];

const PantryTracker: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PantryItem>>({
    category: 'Pantry Staples',
    location: 'Pantry Shelf 1',
    quantity: 1,
    unit: 'item',
    sodiumPerServing: 0,
    tags: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem('pantry-items');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const saveItems = (newItems: PantryItem[]) => {
    setItems(newItems);
    localStorage.setItem('pantry-items', JSON.stringify(newItems));
  };

  const addOrUpdateItem = () => {
    if (!formData.name || !formData.servingSize) {
      toast.error('Please fill required fields');
      return;
    }

    if (editingId) {
      const updated = items.map(item =>
        item.id === editingId ? { ...item, ...formData } : item
      );
      saveItems(updated);
      toast.success('Item updated');
    } else {
      const newItem: PantryItem = {
        ...formData,
        id: `item_${Date.now()}`,
        addedDate: Date.now(),
      } as PantryItem;
      saveItems([...items, newItem]);
      toast.success('Item added to pantry');
    }

    resetForm();
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
    toast.success('Item removed');
  };

  const editItem = (item: PantryItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      category: 'Pantry Staples',
      location: 'Pantry Shelf 1',
      quantity: 1,
      unit: 'item',
      sodiumPerServing: 0,
      tags: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleTag = (tag: string) => {
    const tags = formData.tags || [];
    setFormData({
      ...formData,
      tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getSodiumLevel = (sodium: number): { color: string; label: string } => {
    if (sodium >= 400) return { color: 'text-red-400', label: 'High' };
    if (sodium >= 200) return { color: 'text-orange-400', label: 'Medium' };
    if (sodium >= 100) return { color: 'text-yellow-400', label: 'Low' };
    return { color: 'text-green-400', label: 'Very Low' };
  };

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Pantry Tracker</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pantry..."
            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-green-400/50 focus:outline-none focus:border-green-500/60"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/60"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-black/60 p-4 rounded-lg border border-green-500/30 mb-6 space-y-3">
          <h3 className="text-green-300 font-bold mb-3">{editingId ? 'Edit Item' : 'Add New Item'}</h3>

          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Item Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Canned soup, crackers, etc."
              className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                {commonLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="item">item</option>
                <option value="can">can</option>
                <option value="box">box</option>
                <option value="bag">bag</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
              </select>
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Exp. Date</label>
              <input
                type="date"
                value={formData.expirationDate || ''}
                onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Sodium (mg/serving) *</label>
              <input
                type="number"
                value={formData.sodiumPerServing}
                onChange={(e) => setFormData({...formData, sodiumPerServing: parseFloat(e.target.value)})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Serving Size *</label>
              <input
                type="text"
                value={formData.servingSize || ''}
                onChange={(e) => setFormData({...formData, servingSize: e.target.value})}
                placeholder="1 cup, 1 can, etc."
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    formData.tags?.includes(tag)
                      ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                      : 'bg-green-900/20 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional information..."
              className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={addOrUpdateItem}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {editingId ? 'Update Item' : 'Add to Pantry'}
            </button>
            <button
              onClick={resetForm}
              className="px-6 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const sodiumLevel = getSodiumLevel(item.sodiumPerServing);
            const isExpiringSoon = item.expirationDate &&
              new Date(item.expirationDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            return (
              <div key={item.id} className="bg-black/40 p-4 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => editItem(item)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400">Quantity:</span>
                    <span className="text-white font-semibold">{item.quantity} {item.unit}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-green-400">Sodium:</span>
                    </div>
                    <span className={`font-bold ${sodiumLevel.color}`}>
                      {item.sodiumPerServing}mg ({sodiumLevel.label})
                    </span>
                  </div>

                  <div className="text-green-400">
                    Serving: <span className="text-white">{item.servingSize}</span>
                  </div>

                  {item.expirationDate && (
                    <div className={`flex items-center gap-2 ${isExpiringSoon ? 'text-red-400' : 'text-green-400'}`}>
                      {isExpiringSoon && <AlertCircle className="w-4 h-4" />}
                      <span>Exp: {new Date(item.expirationDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-green-400 py-12">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No items in pantry</p>
            <p className="text-sm mt-2">Click "Add Item" to start tracking</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-black/40 p-3 rounded-lg border border-green-500/20 text-center">
          <div className="text-green-400 text-xs mb-1">Total Items</div>
          <div className="text-2xl font-bold text-white">{items.length}</div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-green-500/20 text-center">
          <div className="text-green-400 text-xs mb-1">High Sodium</div>
          <div className="text-2xl font-bold text-white">
            {items.filter(i => i.sodiumPerServing >= 400).length}
          </div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-green-500/20 text-center">
          <div className="text-green-400 text-xs mb-1">Expiring Soon</div>
          <div className="text-2xl font-bold text-white">
            {items.filter(i => i.expirationDate &&
              new Date(i.expirationDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PantryTracker;
