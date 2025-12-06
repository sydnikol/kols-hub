/**
 * Avatar Wardrobe Selector Component
 * Allows users to dress their AI Teacher avatar with actual wardrobe clothes
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shirt, X, Check, Sparkles, RefreshCw, Heart,
  ChevronLeft, ChevronRight, Wand2, Sun, Moon, Cloud, Snowflake
} from 'lucide-react';
import avatarWardrobeIntegration, {
  WardrobeClothingItem,
  AvatarOutfit
} from '../services/avatar-wardrobe-integration';

interface AvatarWardrobeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onOutfitSelected: (outfit: AvatarOutfit) => void;
  currentOutfit?: AvatarOutfit | null;
}

type Category = 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';

const CATEGORY_LABELS: Record<Category, string> = {
  top: 'Tops',
  bottom: 'Bottoms',
  dress: 'Dresses',
  outerwear: 'Outerwear',
  shoes: 'Shoes',
  accessory: 'Accessories'
};

const WEATHER_OPTIONS = [
  { id: 'hot', icon: Sun, label: 'Hot' },
  { id: 'warm', icon: Sun, label: 'Warm' },
  { id: 'cool', icon: Cloud, label: 'Cool' },
  { id: 'cold', icon: Snowflake, label: 'Cold' }
] as const;

const MOOD_OPTIONS = [
  'Confident', 'Cozy', 'Professional', 'Creative', 'Relaxed', 'Energetic'
];

const OCCASION_OPTIONS = [
  'Teaching', 'Casual', 'Meeting', 'Date', 'Party', 'Work from Home'
];

const AvatarWardrobeSelector: React.FC<AvatarWardrobeSelectorProps> = ({
  isOpen,
  onClose,
  onOutfitSelected,
  currentOutfit
}) => {
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('top');
  const [selectedOutfit, setSelectedOutfit] = useState<Partial<AvatarOutfit>>({
    name: 'New Outfit',
    accessories: [],
    isFavorite: false
  });
  const [savedOutfits, setSavedOutfits] = useState<AvatarOutfit[]>([]);
  const [showSavedOutfits, setShowSavedOutfits] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI suggestion parameters
  const [selectedWeather, setSelectedWeather] = useState<'hot' | 'warm' | 'cool' | 'cold'>('warm');
  const [selectedMood, setSelectedMood] = useState('Confident');
  const [selectedOccasion, setSelectedOccasion] = useState('Teaching');

  // Load wardrobe items
  useEffect(() => {
    if (isOpen) {
      loadWardrobeItems();
      loadSavedOutfits();
    }
  }, [isOpen]);

  const loadWardrobeItems = async () => {
    const items = await avatarWardrobeIntegration.getAllWardrobeItems();
    setWardrobeItems(items);
  };

  const loadSavedOutfits = async () => {
    const outfits = await avatarWardrobeIntegration.getSavedOutfits();
    setSavedOutfits(outfits);
  };

  // Get items for current category
  const categoryItems = wardrobeItems.filter(item => item.category === selectedCategory);

  // Select an item for the outfit
  const selectItem = (item: WardrobeClothingItem) => {
    if (item.category === 'accessory') {
      // Toggle accessory
      const current = selectedOutfit.accessories || [];
      const exists = current.find(a => a.id === item.id);
      if (exists) {
        setSelectedOutfit(prev => ({
          ...prev,
          accessories: current.filter(a => a.id !== item.id)
        }));
      } else {
        setSelectedOutfit(prev => ({
          ...prev,
          accessories: [...current, item]
        }));
      }
    } else if (item.category === 'dress') {
      // Dress replaces top and bottom
      setSelectedOutfit(prev => ({
        ...prev,
        dress: item,
        top: undefined,
        bottom: undefined
      }));
    } else if (item.category === 'top' || item.category === 'bottom') {
      // Top or bottom clears dress
      setSelectedOutfit(prev => ({
        ...prev,
        [item.category]: item,
        dress: undefined
      }));
    } else {
      setSelectedOutfit(prev => ({
        ...prev,
        [item.category]: item
      }));
    }
  };

  // Check if item is selected
  const isSelected = (item: WardrobeClothingItem): boolean => {
    if (item.category === 'accessory') {
      return (selectedOutfit.accessories || []).some(a => a.id === item.id);
    }
    return selectedOutfit[item.category as keyof typeof selectedOutfit]?.id === item.id;
  };

  // Generate AI suggestion
  const generateSuggestion = async () => {
    setIsGenerating(true);
    try {
      const suggestion = await avatarWardrobeIntegration.suggestOutfit({
        mood: selectedMood.toLowerCase(),
        occasion: selectedOccasion.toLowerCase(),
        weather: selectedWeather
      });

      if (suggestion) {
        setSelectedOutfit({
          ...suggestion,
          name: `${selectedMood} ${selectedOccasion} Look`
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Save and apply outfit
  const applyOutfit = async () => {
    if (!selectedOutfit.top && !selectedOutfit.dress && !selectedOutfit.bottom) {
      alert('Please select at least a top/bottom or dress');
      return;
    }

    const outfit = await avatarWardrobeIntegration.createAvatarOutfit({
      name: selectedOutfit.name || 'Custom Outfit',
      top: selectedOutfit.top,
      bottom: selectedOutfit.bottom,
      dress: selectedOutfit.dress,
      outerwear: selectedOutfit.outerwear,
      shoes: selectedOutfit.shoes,
      accessories: selectedOutfit.accessories || [],
      mood: selectedMood,
      occasion: selectedOccasion,
      isFavorite: selectedOutfit.isFavorite || false
    });

    await avatarWardrobeIntegration.setCurrentOutfit(outfit);
    onOutfitSelected(outfit);
    onClose();
  };

  // Apply saved outfit
  const applySavedOutfit = async (outfit: AvatarOutfit) => {
    await avatarWardrobeIntegration.setCurrentOutfit(outfit);
    onOutfitSelected(outfit);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-purple-500/30"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <Shirt className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Dress Your AI Teacher</h2>
                <p className="text-sm text-gray-400">Choose clothes from your wardrobe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left: Category selection and items */}
            <div className="w-2/3 flex flex-col border-r border-gray-800">
              {/* Category tabs */}
              <div className="flex gap-2 p-3 overflow-x-auto border-b border-gray-800">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => {
                  const count = wardrobeItems.filter(i => i.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {CATEGORY_LABELS[cat]} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Items grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {categoryItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Shirt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No {CATEGORY_LABELS[selectedCategory].toLowerCase()} in your wardrobe</p>
                    <p className="text-sm mt-1">Add items from the Virtual Wardrobe page</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {categoryItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectItem(item)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                          isSelected(item)
                            ? 'border-purple-500 ring-2 ring-purple-500/50'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <img
                          src={item.photoUrl}
                          alt={item.name || item.category}
                          className="w-full h-full object-cover"
                        />

                        {/* Selection indicator */}
                        {isSelected(item) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}

                        {/* Favorite indicator */}
                        {item.favorite && (
                          <Heart className="absolute top-2 left-2 w-4 h-4 text-red-400 fill-red-400" />
                        )}

                        {/* Color dots */}
                        {item.colors.length > 0 && (
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            {item.colors.slice(0, 3).map((color, idx) => (
                              <div
                                key={idx}
                                className="w-3 h-3 rounded-full border border-white/30"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Preview and AI suggestions */}
            <div className="w-1/3 flex flex-col">
              {/* Tabs: Create / Saved */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setShowSavedOutfits(false)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    !showSavedOutfits
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Create Outfit
                </button>
                <button
                  onClick={() => setShowSavedOutfits(true)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    showSavedOutfits
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Saved ({savedOutfits.length})
                </button>
              </div>

              {!showSavedOutfits ? (
                <>
                  {/* Current outfit preview */}
                  <div className="p-4 border-b border-gray-800">
                    <h3 className="text-sm font-medium mb-3">Current Selection</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Top or Dress */}
                      <div className="aspect-square rounded-lg bg-gray-800 overflow-hidden">
                        {(selectedOutfit.dress || selectedOutfit.top) && (
                          <img
                            src={selectedOutfit.dress?.photoUrl || selectedOutfit.top?.photoUrl}
                            alt="Top"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {/* Bottom */}
                      <div className="aspect-square rounded-lg bg-gray-800 overflow-hidden">
                        {selectedOutfit.bottom && !selectedOutfit.dress && (
                          <img
                            src={selectedOutfit.bottom.photoUrl}
                            alt="Bottom"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {/* Shoes */}
                      <div className="aspect-square rounded-lg bg-gray-800 overflow-hidden">
                        {selectedOutfit.shoes && (
                          <img
                            src={selectedOutfit.shoes.photoUrl}
                            alt="Shoes"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* Accessories */}
                    {(selectedOutfit.accessories?.length || 0) > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {selectedOutfit.accessories?.map((acc) => (
                          <div
                            key={acc.id}
                            className="w-8 h-8 rounded bg-gray-800 overflow-hidden"
                          >
                            <img
                              src={acc.photoUrl}
                              alt="Accessory"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Suggestions */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-purple-400" />
                      AI Style Assistant
                    </h3>

                    {/* Weather */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-500 mb-2 block">Weather</label>
                      <div className="flex gap-2">
                        {WEATHER_OPTIONS.map(({ id, icon: Icon, label }) => (
                          <button
                            key={id}
                            onClick={() => setSelectedWeather(id)}
                            className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                              selectedWeather === id
                                ? 'bg-purple-600/30 border border-purple-500'
                                : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mood */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-500 mb-2 block">Mood</label>
                      <div className="flex flex-wrap gap-2">
                        {MOOD_OPTIONS.map((mood) => (
                          <button
                            key={mood}
                            onClick={() => setSelectedMood(mood)}
                            className={`px-3 py-1 rounded-full text-xs transition-colors ${
                              selectedMood === mood
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Occasion */}
                    <div className="mb-4">
                      <label className="text-xs text-gray-500 mb-2 block">Occasion</label>
                      <div className="flex flex-wrap gap-2">
                        {OCCASION_OPTIONS.map((occasion) => (
                          <button
                            key={occasion}
                            onClick={() => setSelectedOccasion(occasion)}
                            className={`px-3 py-1 rounded-full text-xs transition-colors ${
                              selectedOccasion === occasion
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {occasion}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate button */}
                    <button
                      onClick={generateSuggestion}
                      disabled={isGenerating || wardrobeItems.length === 0}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Suggest Outfit
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Saved outfits */
                <div className="flex-1 overflow-y-auto p-4">
                  {savedOutfits.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shirt className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No saved outfits yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedOutfits.map((outfit) => (
                        <motion.button
                          key={outfit.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => applySavedOutfit(outfit)}
                          className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* Outfit preview thumbnails */}
                            <div className="flex -space-x-2">
                              {[outfit.top || outfit.dress, outfit.bottom, outfit.shoes]
                                .filter(Boolean)
                                .slice(0, 3)
                                .map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-800"
                                  >
                                    <img
                                      src={item!.photoUrl}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{outfit.name}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {outfit.mood} - {outfit.occasion}
                              </p>
                            </div>
                            {outfit.isFavorite && (
                              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Apply button */}
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={applyOutfit}
                  disabled={!selectedOutfit.top && !selectedOutfit.dress && !selectedOutfit.bottom}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Apply to Avatar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AvatarWardrobeSelector;
