import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, X, DollarSign, MapPin, Flame, Download, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  store?: string;
  sodiumPerServing?: number;
  servingSize?: string;
  notes?: string;
  completed: boolean;
  addedDate: number;
  completedDate?: number;
}

const GroceryList: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(true);
  const [filterView, setFilterView] = useState<'all' | 'pending' | 'completed'>('pending');
  const [formData, setFormData] = useState<Partial<GroceryItem>>({
    category: 'Pantry Staples',
    quantity: 1,
    unit: 'item',
    completed: false,
  });

  const categories = [
    'Pantry Staples',
    'Fresh Produce',
    'Dairy & Eggs',
    'Meat & Protein',
    'Frozen Foods',
    'Beverages',
    'Snacks',
    'POTS-Friendly',
    'Nausea-Safe',
    'Comfort Foods',
    'Other',
  ];

  const units = ['item', 'can', 'box', 'bag', 'lb', 'oz', 'bottle', 'jar', 'pack'];

  const commonStores = [
    'Walmart',
    'Target',
    'Kroger',
    'Aldi',
    'Whole Foods',
    'Trader Joe\'s',
    'Local Market',
    'Online',
    'Other',
  ];

  const quickAddItems = [
    { name: 'Chicken/Beef Broth', category: 'POTS-Friendly', sodiumPerServing: 860, servingSize: '1 cup', unit: 'can', quantity: 2 },
    { name: 'Pickle Juice', category: 'POTS-Friendly', sodiumPerServing: 690, servingSize: '1 oz', unit: 'jar', quantity: 1 },
    { name: 'Electrolyte Drink', category: 'POTS-Friendly', sodiumPerServing: 270, servingSize: '8 oz', unit: 'bottle', quantity: 6 },
    { name: 'Salted Pretzels', category: 'POTS-Friendly', sodiumPerServing: 450, servingSize: '1 oz', unit: 'bag', quantity: 1 },
    { name: 'Instant Ramen', category: 'POTS-Friendly', sodiumPerServing: 1560, servingSize: '1 package', unit: 'pack', quantity: 6 },
    { name: 'Canned Soup', category: 'POTS-Friendly', sodiumPerServing: 890, servingSize: '1 cup', unit: 'can', quantity: 3 },
    { name: 'Saltine Crackers', category: 'POTS-Friendly', sodiumPerServing: 230, servingSize: '5 crackers', unit: 'box', quantity: 1 },
    { name: 'Pickles', category: 'POTS-Friendly', sodiumPerServing: 390, servingSize: '1 pickle', unit: 'jar', quantity: 1 },
    { name: 'Salted Nuts', category: 'Snacks', sodiumPerServing: 170, servingSize: '1 oz', unit: 'bag', quantity: 1 },
    { name: 'Ginger Tea', category: 'Nausea-Safe', sodiumPerServing: 0, servingSize: '1 bag', unit: 'box', quantity: 1 },
    { name: 'Crackers (Plain)', category: 'Nausea-Safe', sodiumPerServing: 140, servingSize: '5 crackers', unit: 'box', quantity: 1 },
    { name: 'White Rice', category: 'Nausea-Safe', sodiumPerServing: 0, servingSize: '1/4 cup dry', unit: 'bag', quantity: 1 },
    { name: 'Applesauce', category: 'Nausea-Safe', sodiumPerServing: 0, servingSize: '1/2 cup', unit: 'jar', quantity: 1 },
    { name: 'Bananas', category: 'Fresh Produce', sodiumPerServing: 1, servingSize: '1 medium', unit: 'lb', quantity: 1 },
    { name: 'Mac & Cheese', category: 'Comfort Foods', sodiumPerServing: 710, servingSize: '1 cup', unit: 'box', quantity: 2 },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('grocery-list');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const saveItems = (newItems: GroceryItem[]) => {
    setItems(newItems);
    localStorage.setItem('grocery-list', JSON.stringify(newItems));
  };

  const quickAddItem = (quickItem: typeof quickAddItems[0]) => {
    const newItem: GroceryItem = {
      id: `grocery_${Date.now()}`,
      name: quickItem.name,
      category: quickItem.category,
      quantity: quickItem.quantity,
      unit: quickItem.unit,
      sodiumPerServing: quickItem.sodiumPerServing,
      servingSize: quickItem.servingSize,
      completed: false,
      addedDate: Date.now(),
    };

    saveItems([...items, newItem]);
    toast.success(`Added ${quickItem.name}`);
  };

  const addCustomItem = () => {
    if (!formData.name) {
      toast.error('Item name required');
      return;
    }

    const newItem: GroceryItem = {
      id: `grocery_${Date.now()}`,
      name: formData.name,
      category: formData.category || 'Other',
      quantity: formData.quantity || 1,
      unit: formData.unit || 'item',
      estimatedPrice: formData.estimatedPrice,
      store: formData.store,
      sodiumPerServing: formData.sodiumPerServing,
      servingSize: formData.servingSize,
      notes: formData.notes,
      completed: false,
      addedDate: Date.now(),
    };

    saveItems([...items, newItem]);
    setFormData({ category: 'Pantry Staples', quantity: 1, unit: 'item', completed: false });
    setShowForm(false);
    toast.success('Item added to list');
  };

  const toggleCompleted = (id: string) => {
    const updated = items.map(item =>
      item.id === id
        ? {
            ...item,
            completed: !item.completed,
            completedDate: !item.completed ? Date.now() : undefined,
          }
        : item
    );
    saveItems(updated);
    const item = items.find(i => i.id === id);
    if (item) {
      toast.success(item.completed ? 'Unmarked' : 'Marked as purchased');
    }
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(i => i.id !== id));
    toast.success('Item removed');
  };

  const clearCompleted = () => {
    const remaining = items.filter(i => !i.completed);
    saveItems(remaining);
    toast.success('Cleared completed items');
  };

  const addToPantry = (item: GroceryItem) => {
    const pantryItem = {
      id: `pantry_${Date.now()}`,
      name: item.name,
      category: item.category,
      location: 'Pantry',
      quantity: item.quantity,
      unit: item.unit,
      sodiumPerServing: item.sodiumPerServing || 0,
      servingSize: item.servingSize || 'Unknown',
      tags: item.category === 'POTS-Friendly' ? ['POTS Support'] : [],
      notes: `Added from grocery list on ${new Date().toLocaleDateString()}`,
      addedDate: Date.now(),
    };

    const existingPantry = localStorage.getItem('pantry-items');
    const pantryItems = existingPantry ? JSON.parse(existingPantry) : [];
    pantryItems.push(pantryItem);
    localStorage.setItem('pantry-items', JSON.stringify(pantryItems));

    toggleCompleted(item.id);
    toast.success(`Added ${item.name} to pantry`);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `grocery-list-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Exported to JSON');
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Price', 'Store', 'Sodium (mg)', 'Status'];
    const rows = items.map(item => [
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.estimatedPrice || '',
      item.store || '',
      item.sodiumPerServing || '',
      item.completed ? 'Completed' : 'Pending',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `grocery-list-${new Date().toISOString().split('T')[0]}.csv`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Exported to CSV');
  };

  const getSodiumColor = (sodium?: number): string => {
    if (!sodium) return 'text-gray-400';
    if (sodium >= 400) return 'text-red-400';
    if (sodium >= 200) return 'text-orange-400';
    if (sodium >= 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredItems = items.filter(item => {
    if (filterView === 'pending') return !item.completed;
    if (filterView === 'completed') return item.completed;
    return true;
  });

  const totalBudget = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const pendingBudget = items.filter(i => !i.completed).reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Grocery List</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="flex items-center gap-2 bg-green-600/30 hover:bg-green-500/40 text-green-300 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
          >
            Quick Add
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-black/40 p-3 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">Total Budget</span>
          </div>
          <p className="text-2xl font-bold text-white">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-semibold">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">${pendingBudget.toFixed(2)}</p>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold">Items</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {items.filter(i => i.completed).length}/{items.length}
          </p>
        </div>
      </div>

      {/* Quick Add Items */}
      {showQuickAdd && (
        <div className="bg-black/40 p-4 rounded-lg border border-green-500/20 mb-6">
          <h3 className="text-green-300 text-sm font-semibold mb-3">Quick Add - POTS-Friendly & Common Items</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {quickAddItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => quickAddItem(item)}
                className="bg-green-900/30 hover:bg-green-800/40 border border-green-500/30 rounded-lg p-3 text-left transition-colors group"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-white text-sm font-semibold group-hover:text-green-300">
                    {item.name}
                  </span>
                  <Plus className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100" />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Flame className={`w-3 h-3 ${getSodiumColor(item.sodiumPerServing)}`} />
                  <span className={getSodiumColor(item.sodiumPerServing)}>
                    {item.sodiumPerServing}mg
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Add Form */}
      {showForm && (
        <div className="bg-black/60 p-4 rounded-lg border border-green-500/30 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Item Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Chicken breast, milk, etc."
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                min="0"
                step="0.1"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                {units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Estimated Price ($)</label>
              <input
                type="number"
                value={formData.estimatedPrice || ''}
                onChange={(e) => setFormData({ ...formData, estimatedPrice: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                placeholder="5.99"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Store</label>
              <select
                value={formData.store || ''}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select store...</option>
                {commonStores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Sodium per Serving (mg)</label>
              <input
                type="number"
                value={formData.sodiumPerServing || ''}
                onChange={(e) => setFormData({ ...formData, sodiumPerServing: parseInt(e.target.value) })}
                min="0"
                placeholder="0"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
            </div>
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Serving Size</label>
              <input
                type="text"
                value={formData.servingSize || ''}
                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                placeholder="1 cup, 4 oz, etc."
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Notes</label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Brand preference, etc."
              className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
            />
          </div>

          <button
            onClick={addCustomItem}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Add to List
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'completed'] as const).map(view => (
          <button
            key={view}
            onClick={() => setFilterView(view)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterView === view
                ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                : 'bg-green-900/20 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
        {items.some(i => i.completed) && (
          <button
            onClick={clearCompleted}
            className="ml-auto px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-sm transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                item.completed
                  ? 'bg-green-900/20 border-green-500/20 opacity-60'
                  : 'bg-black/40 border-green-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleCompleted(item.id)}
                    className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      item.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-green-500/50 hover:border-green-500'
                    }`}
                  >
                    {item.completed && <Check className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-bold ${item.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                        {item.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded border border-green-500/30">
                        {item.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-green-400" />
                        <span className="text-green-300">
                          {item.quantity} {item.unit}
                        </span>
                      </div>

                      {item.estimatedPrice && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-300">${item.estimatedPrice.toFixed(2)}</span>
                        </div>
                      )}

                      {item.store && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300">{item.store}</span>
                        </div>
                      )}

                      {item.sodiumPerServing !== undefined && (
                        <div className="flex items-center gap-1">
                          <Flame className={`w-4 h-4 ${getSodiumColor(item.sodiumPerServing)}`} />
                          <span className={getSodiumColor(item.sodiumPerServing)}>
                            {item.sodiumPerServing}mg
                          </span>
                        </div>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-sm text-gray-400 mt-2 italic">{item.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-3">
                  {item.completed && (
                    <button
                      onClick={() => addToPantry(item)}
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                      title="Add to Pantry"
                    >
                      <Package className="w-4 h-4 text-purple-400" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-green-400 py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">No {filterView === 'all' ? '' : filterView} items</p>
            <p className="text-sm mt-2">
              {filterView === 'pending'
                ? 'Use Quick Add or Custom to add items'
                : filterView === 'completed'
                ? 'Mark items as purchased to see them here'
                : 'Start adding items to your grocery list'}
            </p>
          </div>
        )}
      </div>

      {/* Export Options */}
      {items.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={exportToJSON}
            className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-500/40 text-blue-300 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-600/30 hover:bg-indigo-500/40 text-indigo-300 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      )}

      <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
        <p className="text-green-300 text-xs">
          <span className="font-bold">Pro Tip:</span> Quick Add includes high-sodium POTS-friendly foods. Mark items as purchased, then use the pantry icon to automatically add them to your Pantry Tracker.
        </p>
      </div>
    </div>
  );
};

export default GroceryList;
