import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shirt, Camera, Upload, Heart, Star, DollarSign, Calendar, Tag,
  TrendingUp, Plus, Trash2, Filter, Sparkles, User, Eye, CheckCircle,
  ShoppingBag, Target, Grid, List, Search, Palette, Scissors, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { googlePhotosService, ClothingItem } from '../services/googlePhotosService';
import { db } from '../utils/database';

interface OutfitCombo {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion: string;
  affirmingLevel: number;
  confidenceLevel: number;
  wearCount: number;
  lastWorn: string;
  favorited: boolean;
  photo?: string;
}

interface StyleGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  completed: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  type: string;
  priority: number;
  estimatedCost: number;
  link?: string;
}

/**
 * 👗✨ UNIFIED FASHION & WARDROBE HUB
 * Complete fashion management system combining:
 * - Virtual Wardrobe (photo-based clothing catalog)
 * - Fashion Hub (outfits, style goals, budget tracking)
 * - AI Stylist & Outfit Generator
 * - Wishlist & Shopping Planner
 * - Wear Tracking & Analytics
 */
const UnifiedFashionWardrobePage: React.FC = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'outfits' | 'stylist' | 'goals' | 'wishlist'>('wardrobe');

  // Wardrobe state
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Outfit state
  const [outfits, setOutfits] = useState<OutfitCombo[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<{
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    outerwear?: ClothingItem;
    accessory?: ClothingItem;
  }>({});

  // Goals & Wishlist
  const [styleGoals, setStyleGoals] = useState<StyleGoal[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // UI state
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showOutfitBuilder, setShowOutfitBuilder] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const items = await googlePhotosService.getWardrobe();
      setWardrobe(items);

      // Load from database
      const savedOutfits = await db.outfits.toArray();
      setOutfits(savedOutfits as OutfitCombo[]);

      const savedGoals = await db.styleGoals.toArray();
      setStyleGoals(savedGoals as StyleGoal[]);

      const savedWishlist = await db.wishlist.toArray();
      setWishlist(savedWishlist as WishlistItem[]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Photo upload handler
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.loading('Uploading & analyzing...', { id: 'upload' });

    try {
      await googlePhotosService.uploadClothingPhoto(file);
      await loadAllData();
      toast.success('Item added to wardrobe!', { id: 'upload' });
      setShowPhotoUpload(false);
    } catch (error) {
      toast.error('Upload failed', { id: 'upload' });
      console.error(error);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Remove this item?')) {
      await googlePhotosService.deleteClothingItem(itemId);
      await loadAllData();
      toast.success('Item removed');
    }
  };

  // Toggle favorite
  const toggleFavorite = (itemId: string) => {
    setWardrobe(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, favorited: !item.favorited } : item
      )
    );
    toast('Favorite updated');
  };

  // Build outfit
  const buildOutfit = (item: ClothingItem) => {
    const category = item.category.toLowerCase();
    setSelectedOutfit(prev => ({ ...prev, [category]: item }));
    setShowOutfitBuilder(true);
    toast(`Added ${item.name} to outfit`);
  };

  // Save outfit
  const saveOutfit = async () => {
    const items = Object.values(selectedOutfit).filter(Boolean) as ClothingItem[];
    if (items.length === 0) {
      toast.error('Add items to outfit first');
      return;
    }

    const newOutfit: OutfitCombo = {
      id: Date.now().toString(),
      name: prompt('Name this outfit:') || 'Untitled Outfit',
      items,
      occasion: 'casual',
      affirmingLevel: 5,
      confidenceLevel: 5,
      wearCount: 0,
      lastWorn: '',
      favorited: false
    };

    await db.outfits.add(newOutfit);
    setOutfits(prev => [...prev, newOutfit]);
    toast.success('Outfit saved!');
    setShowOutfitBuilder(false);
    setSelectedOutfit({});
  };

  // Filter wardrobe
  const filteredWardrobe = wardrobe.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFavorite = !showFavoritesOnly || item.favorited;
    return matchesCategory && matchesSearch && matchesFavorite;
  });

  const categories = ['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-purple-500/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="text-pink-400" size={32} />
              Fashion & Wardrobe Hub
            </h1>
            <p className="text-gray-400 mt-1">
              Your complete style management system - {wardrobe.length} items, {outfits.length} outfits
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPhotoUpload(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-pink-500/50"
            >
              <Camera size={20} />
              Add Item
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOutfitBuilder(!showOutfitBuilder)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/50"
            >
              <Shirt size={20} />
              Build Outfit
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-6 flex gap-2 overflow-x-auto">
          {[
            { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
            { id: 'outfits', label: 'Outfits', icon: Sparkles },
            { id: 'stylist', label: 'AI Stylist', icon: Zap },
            { id: 'goals', label: 'Style Goals', icon: Target },
            { id: 'wishlist', label: 'Wishlist', icon: ShoppingBag },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* WARDROBE TAB */}
          {activeTab === 'wardrobe' && (
            <motion.div
              key="wardrobe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <div className="mb-6 flex gap-4 items-center flex-wrap">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-pink-500 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-4 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                    showFavoritesOnly
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-800/50 text-gray-400'
                  }`}
                >
                  <Heart size={18} fill={showFavoritesOnly ? 'white' : 'none'} />
                  Favorites
                </button>

                <div className="flex gap-2 bg-gray-800/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Wardrobe Grid */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'flex flex-col gap-3'}>
                {filteredWardrobe.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-pink-500/50 transition-all cursor-pointer group"
                    onClick={() => buildOutfit(item)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                      {item.photo ? (
                        <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shirt size={48} className="text-gray-600" />
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-2 right-2 p-2 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 transition-all"
                      >
                        <Heart size={16} fill={item.favorited ? '#ec4899' : 'none'} className={item.favorited ? 'text-pink-500' : 'text-white'} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                        className="absolute top-2 left-2 p-2 bg-black/60 rounded-full backdrop-blur-sm hover:bg-red-600/80 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* OUTFITS TAB */}
          {activeTab === 'outfits' && (
            <motion.div
              key="outfits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfits.map(outfit => (
                  <motion.div
                    key={outfit.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
                  >
                    <h3 className="text-xl font-bold text-white mb-3">{outfit.name}</h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {outfit.items.map(item => (
                        <div key={item.id} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                          {item.photo ? (
                            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Shirt size={24} className="text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize">{outfit.occasion}</span>
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-400" />
                        <span className="text-white">{outfit.affirmingLevel}/5</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI STYLIST TAB */}
          {activeTab === 'stylist' && (
            <motion.div
              key="stylist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30"
            >
              <div className="text-center mb-8">
                <Zap size={64} className="text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">AI Stylist</h2>
                <p className="text-gray-400">Get personalized outfit recommendations</p>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                Generate Outfit for Today
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowPhotoUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-pink-500/30"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Add to Wardrobe</h3>
              <label className="block">
                <div className="border-2 border-dashed border-pink-500/50 rounded-xl p-12 text-center hover:border-pink-500 transition-all cursor-pointer">
                  <Camera size={48} className="text-pink-400 mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">Take or Upload Photo</p>
                  <p className="text-sm text-gray-400">AI will analyze your clothing</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outfit Builder Drawer */}
      <AnimatePresence>
        {showOutfitBuilder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-purple-500/30 p-6 z-40 overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Outfit Builder</h3>

            {Object.entries(selectedOutfit).map(([type, item]) => (
              item && (
                <div key={type} className="mb-4 bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                    {item.photo && <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-400 capitalize">{type}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOutfit(prev => {
                      const newOutfit = { ...prev };
                      delete newOutfit[type as keyof typeof prev];
                      return newOutfit;
                    })}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-all"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              )
            ))}

            <button
              onClick={saveOutfit}
              disabled={Object.keys(selectedOutfit).length === 0}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-700 hover:to-purple-700 transition-all"
            >
              Save Outfit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedFashionWardrobePage;
