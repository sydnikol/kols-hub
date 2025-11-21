import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shirt, Heart, Calendar, DollarSign, Tag, TrendingUp, Plus, Edit2, Trash2, Star, Eye, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory' | 'underwear' | 'activewear';
  color: string;
  brand: string;
  size: string;
  purchaseDate: string;
  cost: number;
  location: string; // where stored
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
  affirmingLevel: number; // 1-5, how gender-affirming
  comfortLevel: number; // 1-5
  versatility: number; // 1-5, how many outfits it works with
  wearCount: number;
  lastWorn: string;
  favorited: boolean;
  tags: string[];
  notes: string;
  photo?: string;
  createdAt: number;
}

interface Outfit {
  id: string;
  name: string;
  items: string[]; // IDs of clothing items
  occasion: 'casual' | 'work' | 'formal' | 'party' | 'date' | 'athletic' | 'other';
  affirmingLevel: number; // 1-5
  confidenceLevel: number; // 1-5
  wearCount: number;
  lastWorn: string;
  favorited: boolean;
  notes: string;
  photo?: string;
  createdAt: number;
}

interface StyleGoal {
  id: string;
  title: string;
  description: string;
  category: 'build-wardrobe' | 'find-style' | 'budget' | 'declutter' | 'affirming' | 'other';
  targetDate: string;
  progress: number; // 0-100
  milestones: string[];
  completed: boolean;
  notes: string;
  createdAt: number;
}

interface WishlistItem {
  id: string;
  name: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCost: number;
  savedAmount: number;
  link: string;
  notes: string;
  purchased: boolean;
  createdAt: number;
}

const FashionHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'outfits' | 'goals' | 'wishlist' | 'stats'>('wardrobe');

  // Wardrobe Tab
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [showClothingForm, setShowClothingForm] = useState(false);
  const [editingClothing, setEditingClothing] = useState<string | null>(null);
  const [newClothing, setNewClothing] = useState<Partial<ClothingItem>>({
    category: 'top',
    season: 'all-season',
    affirmingLevel: 3,
    comfortLevel: 3,
    versatility: 3,
    wearCount: 0,
    favorited: false,
    tags: []
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Outfits Tab
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [showOutfitForm, setShowOutfitForm] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<string | null>(null);
  const [newOutfit, setNewOutfit] = useState<Partial<Outfit>>({
    items: [],
    occasion: 'casual',
    affirmingLevel: 3,
    confidenceLevel: 3,
    wearCount: 0,
    favorited: false
  });

  // Goals Tab
  const [goals, setGoals] = useState<StyleGoal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<StyleGoal>>({
    category: 'build-wardrobe',
    progress: 0,
    milestones: [],
    completed: false
  });

  // Wishlist Tab
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [showWishlistForm, setShowWishlistForm] = useState(false);
  const [editingWishlistItem, setEditingWishlistItem] = useState<string | null>(null);
  const [newWishlistItem, setNewWishlistItem] = useState<Partial<WishlistItem>>({
    priority: 'medium',
    savedAmount: 0,
    purchased: false
  });

  // Load data
  useEffect(() => {
    const savedWardrobe = localStorage.getItem('wardrobe');
    const savedOutfits = localStorage.getItem('outfits');
    const savedGoals = localStorage.getItem('styleGoals');
    const savedWishlist = localStorage.getItem('fashionWishlist');

    if (savedWardrobe) setWardrobe(JSON.parse(savedWardrobe));
    if (savedOutfits) setOutfits(JSON.parse(savedOutfits));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem('styleGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fashionWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Clothing functions
  const saveClothing = () => {
    if (!newClothing.name || !newClothing.category) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingClothing) {
      setWardrobe(wardrobe.map(c => c.id === editingClothing ? { ...c, ...newClothing } as ClothingItem : c));
      toast.success('Item updated!');
    } else {
      const item: ClothingItem = {
        id: Date.now().toString(),
        name: newClothing.name!,
        category: newClothing.category!,
        color: newClothing.color || '',
        brand: newClothing.brand || '',
        size: newClothing.size || '',
        purchaseDate: newClothing.purchaseDate || '',
        cost: newClothing.cost || 0,
        location: newClothing.location || '',
        season: newClothing.season || 'all-season',
        affirmingLevel: newClothing.affirmingLevel || 3,
        comfortLevel: newClothing.comfortLevel || 3,
        versatility: newClothing.versatility || 3,
        wearCount: 0,
        lastWorn: '',
        favorited: false,
        tags: newClothing.tags || [],
        notes: newClothing.notes || '',
        createdAt: Date.now()
      };
      setWardrobe([item, ...wardrobe]);
      toast.success('Item added to wardrobe!');
    }

    setNewClothing({ category: 'top', season: 'all-season', affirmingLevel: 3, comfortLevel: 3, versatility: 3, wearCount: 0, favorited: false, tags: [] });
    setShowClothingForm(false);
    setEditingClothing(null);
  };

  const deleteClothing = (id: string) => {
    setWardrobe(wardrobe.filter(c => c.id !== id));
    toast.success('Item removed');
  };

  const toggleFavoriteClothing = (id: string) => {
    setWardrobe(wardrobe.map(c => c.id === id ? { ...c, favorited: !c.favorited } : c));
  };

  const wearClothing = (id: string) => {
    setWardrobe(wardrobe.map(c => c.id === id ? {
      ...c,
      wearCount: c.wearCount + 1,
      lastWorn: new Date().toISOString().split('T')[0]
    } : c));
    toast.success('Wear logged!');
  };

  // Outfit functions
  const saveOutfit = () => {
    if (!newOutfit.name || !newOutfit.items || newOutfit.items.length === 0) {
      toast.error('Please add a name and select at least one item');
      return;
    }

    if (editingOutfit) {
      setOutfits(outfits.map(o => o.id === editingOutfit ? { ...o, ...newOutfit } as Outfit : o));
      toast.success('Outfit updated!');
    } else {
      const outfit: Outfit = {
        id: Date.now().toString(),
        name: newOutfit.name!,
        items: newOutfit.items!,
        occasion: newOutfit.occasion || 'casual',
        affirmingLevel: newOutfit.affirmingLevel || 3,
        confidenceLevel: newOutfit.confidenceLevel || 3,
        wearCount: 0,
        lastWorn: '',
        favorited: false,
        notes: newOutfit.notes || '',
        createdAt: Date.now()
      };
      setOutfits([outfit, ...outfits]);
      toast.success('Outfit saved!');
    }

    setNewOutfit({ items: [], occasion: 'casual', affirmingLevel: 3, confidenceLevel: 3, wearCount: 0, favorited: false });
    setShowOutfitForm(false);
    setEditingOutfit(null);
  };

  const deleteOutfit = (id: string) => {
    setOutfits(outfits.filter(o => o.id !== id));
    toast.success('Outfit deleted');
  };

  const toggleFavoriteOutfit = (id: string) => {
    setOutfits(outfits.map(o => o.id === id ? { ...o, favorited: !o.favorited } : o));
  };

  const wearOutfit = (id: string) => {
    const outfit = outfits.find(o => o.id === id);
    if (outfit) {
      // Update outfit
      setOutfits(outfits.map(o => o.id === id ? {
        ...o,
        wearCount: o.wearCount + 1,
        lastWorn: new Date().toISOString().split('T')[0]
      } : o));

      // Update all clothing items in the outfit
      outfit.items.forEach(itemId => {
        wearClothing(itemId);
      });

      toast.success('Outfit wear logged!');
    }
  };

  const toggleOutfitItem = (itemId: string) => {
    const items = newOutfit.items || [];
    if (items.includes(itemId)) {
      setNewOutfit({ ...newOutfit, items: items.filter(id => id !== itemId) });
    } else {
      setNewOutfit({ ...newOutfit, items: [...items, itemId] });
    }
  };

  // Goal functions
  const saveGoal = () => {
    if (!newGoal.title) {
      toast.error('Please enter a title');
      return;
    }

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal ? { ...g, ...newGoal } as StyleGoal : g));
      toast.success('Goal updated!');
    } else {
      const goal: StyleGoal = {
        id: Date.now().toString(),
        title: newGoal.title!,
        description: newGoal.description || '',
        category: newGoal.category || 'build-wardrobe',
        targetDate: newGoal.targetDate || '',
        progress: 0,
        milestones: newGoal.milestones || [],
        completed: false,
        notes: newGoal.notes || '',
        createdAt: Date.now()
      };
      setGoals([goal, ...goals]);
      toast.success('Goal created!');
    }

    setNewGoal({ category: 'build-wardrobe', progress: 0, milestones: [], completed: false });
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(goals.map(g => g.id === id ? {
      ...g,
      progress,
      completed: progress >= 100
    } : g));
  };

  // Wishlist functions
  const saveWishlistItem = () => {
    if (!newWishlistItem.name) {
      toast.error('Please enter a name');
      return;
    }

    if (editingWishlistItem) {
      setWishlist(wishlist.map(w => w.id === editingWishlistItem ? { ...w, ...newWishlistItem } as WishlistItem : w));
      toast.success('Wishlist item updated!');
    } else {
      const item: WishlistItem = {
        id: Date.now().toString(),
        name: newWishlistItem.name!,
        type: newWishlistItem.type || '',
        priority: newWishlistItem.priority || 'medium',
        estimatedCost: newWishlistItem.estimatedCost || 0,
        savedAmount: 0,
        link: newWishlistItem.link || '',
        notes: newWishlistItem.notes || '',
        purchased: false,
        createdAt: Date.now()
      };
      setWishlist([item, ...wishlist]);
      toast.success('Added to wishlist!');
    }

    setNewWishlistItem({ priority: 'medium', savedAmount: 0, purchased: false });
    setShowWishlistForm(false);
    setEditingWishlistItem(null);
  };

  const deleteWishlistItem = (id: string) => {
    setWishlist(wishlist.filter(w => w.id !== id));
    toast.success('Removed from wishlist');
  };

  const markPurchased = (id: string) => {
    setWishlist(wishlist.map(w => w.id === id ? { ...w, purchased: true } : w));
    toast.success('Marked as purchased!');
  };

  const updateSavedAmount = (id: string, amount: number) => {
    setWishlist(wishlist.map(w => w.id === id ? { ...w, savedAmount: w.savedAmount + amount } : w));
  };

  // Stats
  const totalItems = wardrobe.length;
  const totalOutfits = outfits.length;
  const totalSpent = wardrobe.reduce((sum, item) => sum + item.cost, 0);
  const avgCostPerItem = totalItems > 0 ? totalSpent / totalItems : 0;
  const affirmingItems = wardrobe.filter(item => item.affirmingLevel >= 4).length;
  const favoriteItems = wardrobe.filter(item => item.favorited).length;
  const mostWornItem = wardrobe.reduce((max, item) => item.wearCount > (max?.wearCount || 0) ? item : max, wardrobe[0]);
  const leastWornItems = wardrobe.filter(item => item.wearCount === 0).length;

  const filteredWardrobe = filterCategory === 'all'
    ? wardrobe
    : wardrobe.filter(item => item.category === filterCategory);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-violet-900 p-6">
        <button onClick={() => navigate('/')} className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Shirt className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Fashion Hub</h1>
        </div>
        <p className="text-purple-200">Build your affirming wardrobe</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-4 rounded-lg border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">{totalItems}</div>
          <div className="text-sm text-purple-200">Items</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-4 rounded-lg border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{totalOutfits}</div>
          <div className="text-sm text-blue-200">Outfits</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-4 rounded-lg border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">{affirmingItems}</div>
          <div className="text-sm text-green-200">Affirming Items</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-4 rounded-lg border border-orange-500/30">
          <div className="text-2xl font-bold text-orange-400">${totalSpent.toFixed(0)}</div>
          <div className="text-sm text-orange-200">Total Spent</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 px-6 mb-6 no-scrollbar">
        {[
          { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
          { id: 'outfits', label: 'Outfits', icon: Sparkles },
          { id: 'goals', label: 'Goals', icon: TrendingUp },
          { id: 'wishlist', label: 'Wishlist', icon: Heart },
          { id: 'stats', label: 'Stats', icon: Tag }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wardrobe Tab */}
      {activeTab === 'wardrobe' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowClothingForm(!showClothingForm)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Clothing Item
          </button>

          {/* Category Filter */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {['all', 'top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory', 'underwear', 'activewear'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap text-sm transition-colors ${
                  filterCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {showClothingForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Item name"
                value={newClothing.name || ''}
                onChange={(e) => setNewClothing({ ...newClothing, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newClothing.category}
                onChange={(e) => setNewClothing({ ...newClothing, category: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="dress">Dress</option>
                <option value="outerwear">Outerwear</option>
                <option value="shoes">Shoes</option>
                <option value="accessory">Accessory</option>
                <option value="underwear">Underwear</option>
                <option value="activewear">Activewear</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Color"
                  value={newClothing.color || ''}
                  onChange={(e) => setNewClothing({ ...newClothing, color: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Size"
                  value={newClothing.size || ''}
                  onChange={(e) => setNewClothing({ ...newClothing, size: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Brand (optional)"
                value={newClothing.brand || ''}
                onChange={(e) => setNewClothing({ ...newClothing, brand: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newClothing.season}
                onChange={(e) => setNewClothing({ ...newClothing, season: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
                <option value="all-season">All Season</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Cost ($)"
                  step="0.01"
                  value={newClothing.cost || ''}
                  onChange={(e) => setNewClothing({ ...newClothing, cost: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="date"
                  placeholder="Purchase date"
                  value={newClothing.purchaseDate || ''}
                  onChange={(e) => setNewClothing({ ...newClothing, purchaseDate: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Gender-Affirming Level (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setNewClothing({ ...newClothing, affirmingLevel: level })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newClothing.affirmingLevel === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Comfort Level (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setNewClothing({ ...newClothing, comfortLevel: level })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newClothing.comfortLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Versatility (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setNewClothing({ ...newClothing, versatility: level })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newClothing.versatility === level
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Storage location (optional)"
                value={newClothing.location || ''}
                onChange={(e) => setNewClothing({ ...newClothing, location: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Notes (optional)"
                value={newClothing.notes || ''}
                onChange={(e) => setNewClothing({ ...newClothing, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveClothing}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingClothing ? 'Update' : 'Save'} Item
                </button>
                <button
                  onClick={() => {
                    setShowClothingForm(false);
                    setEditingClothing(null);
                    setNewClothing({ category: 'top', season: 'all-season', affirmingLevel: 3, comfortLevel: 3, versatility: 3, wearCount: 0, favorited: false, tags: [] });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {filteredWardrobe.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shirt className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No items in wardrobe yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWardrobe.map(item => (
                <div key={item.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">
                        {item.category} • {item.color} {item.size && `• ${item.size}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavoriteClothing(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.favorited ? 'text-red-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={item.favorited ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingClothing(item.id);
                          setNewClothing(item);
                          setShowClothingForm(true);
                        }}
                        className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteClothing(item.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded text-center">
                      Affirming: {item.affirmingLevel}/5
                    </div>
                    <div className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-center">
                      Comfort: {item.comfortLevel}/5
                    </div>
                    <div className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-center">
                      Versatile: {item.versatility}/5
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">
                      Worn {item.wearCount} time{item.wearCount !== 1 ? 's' : ''}
                      {item.lastWorn && ` • Last: ${item.lastWorn}`}
                    </div>
                    <button
                      onClick={() => wearClothing(item.id)}
                      className="bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 px-3 py-1 rounded text-xs transition-colors"
                    >
                      Wear Today
                    </button>
                  </div>
                  {item.brand && (
                    <div className="text-xs text-gray-500 mt-1">Brand: {item.brand}</div>
                  )}
                  {item.cost > 0 && (
                    <div className="text-xs text-green-400 mt-1">${item.cost.toFixed(2)}</div>
                  )}
                  {item.notes && (
                    <p className="text-sm text-gray-400 mt-2">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outfits Tab */}
      {activeTab === 'outfits' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => {
              setNewOutfit({ items: [], occasion: 'casual', affirmingLevel: 3, confidenceLevel: 3, wearCount: 0, favorited: false });
              setShowOutfitForm(!showOutfitForm);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Outfit
          </button>

          {showOutfitForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Outfit name"
                value={newOutfit.name || ''}
                onChange={(e) => setNewOutfit({ ...newOutfit, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newOutfit.occasion}
                onChange={(e) => setNewOutfit({ ...newOutfit, occasion: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="casual">Casual</option>
                <option value="work">Work</option>
                <option value="formal">Formal</option>
                <option value="party">Party</option>
                <option value="date">Date</option>
                <option value="athletic">Athletic</option>
                <option value="other">Other</option>
              </select>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Items ({(newOutfit.items || []).length})</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {wardrobe.map(item => (
                    <label key={item.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(newOutfit.items || []).includes(item.id)}
                        onChange={() => toggleOutfitItem(item.id)}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{item.name} ({item.category})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Affirming Level (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setNewOutfit({ ...newOutfit, affirmingLevel: level })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newOutfit.affirmingLevel === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confidence Level (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setNewOutfit({ ...newOutfit, confidenceLevel: level })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newOutfit.confidenceLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={newOutfit.notes || ''}
                onChange={(e) => setNewOutfit({ ...newOutfit, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveOutfit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingOutfit ? 'Update' : 'Save'} Outfit
                </button>
                <button
                  onClick={() => {
                    setShowOutfitForm(false);
                    setEditingOutfit(null);
                    setNewOutfit({ items: [], occasion: 'casual', affirmingLevel: 3, confidenceLevel: 3, wearCount: 0, favorited: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {outfits.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No outfits created yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {outfits.map(outfit => (
                <div key={outfit.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{outfit.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{outfit.occasion} • {outfit.items.length} items</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavoriteOutfit(outfit.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          outfit.favorited ? 'text-red-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={outfit.favorited ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingOutfit(outfit.id);
                          setNewOutfit(outfit);
                          setShowOutfitForm(true);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOutfit(outfit.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded text-center">
                      Affirming: {outfit.affirmingLevel}/5
                    </div>
                    <div className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-center">
                      Confidence: {outfit.confidenceLevel}/5
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">
                      Worn {outfit.wearCount} time{outfit.wearCount !== 1 ? 's' : ''}
                      {outfit.lastWorn && ` • Last: ${outfit.lastWorn}`}
                    </div>
                    <button
                      onClick={() => wearOutfit(outfit.id)}
                      className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-3 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Wear Today
                    </button>
                  </div>
                  {outfit.notes && (
                    <p className="text-sm text-gray-400 mt-2">{outfit.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Goals Tab - continuing in next message due to length */}
      {activeTab === 'goals' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Style Goal
          </button>

          {showGoalForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Goal title"
                value={newGoal.title || ''}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="build-wardrobe">Build Wardrobe</option>
                <option value="find-style">Find Style</option>
                <option value="budget">Budget</option>
                <option value="declutter">Declutter</option>
                <option value="affirming">Gender-Affirming</option>
                <option value="other">Other</option>
              </select>
              <input
                type="date"
                placeholder="Target date"
                value={newGoal.targetDate || ''}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Description"
                value={newGoal.description || ''}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveGoal}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingGoal ? 'Update' : 'Save'} Goal
                </button>
                <button
                  onClick={() => {
                    setShowGoalForm(false);
                    setEditingGoal(null);
                    setNewGoal({ category: 'build-wardrobe', progress: 0, milestones: [], completed: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {goals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No style goals yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map(goal => (
                <div key={goal.id} className={`bg-gray-900 p-4 rounded-lg border ${goal.completed ? 'border-green-500/50' : 'border-gray-700'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${goal.completed ? 'text-green-400' : ''}`}>
                        {goal.title}
                        {goal.completed && <CheckCircle className="inline w-4 h-4 ml-2" />}
                      </h3>
                      <p className="text-sm text-gray-400 capitalize">{goal.category.replace('-', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingGoal(goal.id);
                          setNewGoal(goal);
                          setShowGoalForm(true);
                        }}
                        className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-gray-400 mb-2">{goal.description}</p>
                  )}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-xs transition-colors"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                      className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 py-1 rounded text-xs transition-colors"
                    >
                      +10%
                    </button>
                  </div>
                  {goal.targetDate && (
                    <div className="text-xs text-gray-500 mt-2">Target: {goal.targetDate}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowWishlistForm(!showWishlistForm)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add to Wishlist
          </button>

          {showWishlistForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Item name"
                value={newWishlistItem.name || ''}
                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Type (e.g., jeans, jacket)"
                value={newWishlistItem.type || ''}
                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, type: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newWishlistItem.priority}
                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, priority: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="number"
                placeholder="Estimated cost ($)"
                step="0.01"
                value={newWishlistItem.estimatedCost || ''}
                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, estimatedCost: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Link (optional)"
                value={newWishlistItem.link || ''}
                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, link: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Notes (optional)"
                value={newWishlistItem.notes || ''}
                onChange={(e) => setNewWishlistItem({ ...newWishlistItem, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveWishlistItem}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingWishlistItem ? 'Update' : 'Add'} Item
                </button>
                <button
                  onClick={() => {
                    setShowWishlistForm(false);
                    setEditingWishlistItem(null);
                    setNewWishlistItem({ priority: 'medium', savedAmount: 0, purchased: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No wishlist items yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlist.filter(w => !w.purchased).map(item => {
                const savingsProgress = item.estimatedCost > 0 ? (item.savedAmount / item.estimatedCost) * 100 : 0;

                return (
                  <div key={item.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-400">{item.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => markPurchased(item.id)}
                          className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingWishlistItem(item.id);
                            setNewWishlistItem(item);
                            setShowWishlistForm(true);
                          }}
                          className="p-2 text-orange-400 hover:bg-orange-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteWishlistItem(item.id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded text-xs mb-2 capitalize ${
                      item.priority === 'high' ? 'bg-red-900/30 text-red-400' :
                      item.priority === 'medium' ? 'bg-orange-900/30 text-orange-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {item.priority} priority
                    </div>
                    <div className="text-lg font-bold text-green-400 mb-1">
                      ${item.estimatedCost.toFixed(2)}
                    </div>
                    {item.estimatedCost > 0 && (
                      <>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Saved</span>
                            <span>${item.savedAmount.toFixed(2)} / ${item.estimatedCost.toFixed(2)}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all"
                              style={{ width: `${Math.min(100, savingsProgress)}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateSavedAmount(item.id, 10)}
                            className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 py-1 rounded text-xs transition-colors"
                          >
                            +$10
                          </button>
                          <button
                            onClick={() => updateSavedAmount(item.id, 20)}
                            className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 py-1 rounded text-xs transition-colors"
                          >
                            +$20
                          </button>
                          <button
                            onClick={() => updateSavedAmount(item.id, 50)}
                            className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 py-1 rounded text-xs transition-colors"
                          >
                            +$50
                          </button>
                        </div>
                      </>
                    )}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-2 block">
                        View Item
                      </a>
                    )}
                    {item.notes && (
                      <p className="text-sm text-gray-400 mt-2">{item.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="px-6 space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold mb-3">Wardrobe Overview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Items:</span>
                <span className="text-white">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Spent:</span>
                <span className="text-green-400">${totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Cost/Item:</span>
                <span className="text-green-400">${avgCostPerItem.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Favorite Items:</span>
                <span className="text-red-400">{favoriteItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Highly Affirming (4-5):</span>
                <span className="text-purple-400">{affirmingItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Never Worn:</span>
                <span className="text-orange-400">{leastWornItems}</span>
              </div>
            </div>
          </div>

          {mostWornItem && (
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold mb-2">Most Worn Item</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">{mostWornItem.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{mostWornItem.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{mostWornItem.wearCount}</div>
                  <div className="text-xs text-gray-400">times</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold mb-3">By Category</h3>
            <div className="space-y-2">
              {['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory'].map(cat => {
                const count = wardrobe.filter(item => item.category === cat).length;
                const percent = totalItems > 0 ? (count / totalItems) * 100 : 0;

                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 capitalize">{cat}</span>
                      <span className="text-white">{count} ({percent.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-violet-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FashionHubPage;
