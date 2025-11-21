import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, Heart, Filter, Sparkles, User } from 'lucide-react';
import { googlePhotosService, ClothingItem } from '../services/googlePhotosService';

export default function VirtualWardrobePage() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDressUp, setShowDressUp] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<{
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    outerwear?: ClothingItem;
    accessory?: ClothingItem;
  }>({});

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    const items = await googlePhotosService.getWardrobe();
    setWardrobe(items);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await googlePhotosService.uploadClothingPhoto(file);
      await loadWardrobe();
    } catch (error) {
      alert('Failed to upload photo');
      console.error(error);
    }
  };

  const handleGooglePhotosConnect = async () => {
    try {
      const result = await googlePhotosService.connectGooglePhotos();
      if (result.success) {
        alert('Google Photos connected successfully!');
        await loadWardrobe();
      } else {
        alert(`Failed to connect: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Google Photos connection error:', error);
      alert('Failed to connect to Google Photos');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Remove this item from your wardrobe?')) {
      await googlePhotosService.deleteClothingItem(itemId);
      await loadWardrobe();
    }
  };

  const toggleFavorite = async (item: ClothingItem) => {
    await googlePhotosService.updateClothingItem(item.id, {
      favorite: !item.favorite
    });
    await loadWardrobe();
  };

  const getOutfitSuggestion = async (occasion: string) => {
    const suggestion = await googlePhotosService.getOutfitSuggestion(occasion as any);
    setSelectedOutfit(suggestion);
    setShowDressUp(true);
  };

  const categories = [
    { id: 'all', label: 'All', icon: '👗' },
    { id: 'top', label: 'Tops', icon: '👚' },
    { id: 'bottom', label: 'Bottoms', icon: '👖' },
    { id: 'dress', label: 'Dresses', icon: '👗' },
    { id: 'outerwear', label: 'Outerwear', icon: '🧥' },
    { id: 'shoes', label: 'Shoes', icon: '👟' },
    { id: 'accessory', label: 'Accessories', icon: '💍' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? wardrobe
    : wardrobe.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A24] to-[#2A1A3F] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#C0C0D8] mb-2">👗 Virtual Wardrobe</h1>
            <p className="text-[#E8E8F4]/60">
              Your digital closet • {wardrobe.length} items
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDressUp(!showDressUp)}
              className="px-6 py-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              Dress Up
            </button>

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="px-6 py-3 bg-gradient-to-br from-[#4A5DB8] to-indigo-600 hover:from-[#4A5DB8]/80 hover:to-indigo-600/80 rounded-xl text-white font-medium transition-all flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Add Photo
              </div>
            </label>

            <button
              onClick={handleGooglePhotosConnect}
              className="px-6 py-3 bg-[#1A1A24]/60 hover:bg-[#1A1A24] rounded-xl text-[#C0C0D8] font-medium transition-all flex items-center gap-2 border border-[#C0C0D8]/20"
            >
              <Upload className="w-5 h-5" />
              Sync Google Photos
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-br from-[#4A5DB8] to-purple-600 text-white shadow-lg'
                  : 'bg-[#1A1A24]/40 text-[#C0C0D8] hover:bg-[#1A1A24]/60 border border-[#C0C0D8]/20'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Outfit Suggestions */}
        <div className="mt-6 flex gap-3">
          <p className="text-[#C0C0D8] flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Quick Outfit:
          </p>
          {['casual', 'formal', 'date', 'workout'].map(occasion => (
            <button
              key={occasion}
              onClick={() => getOutfitSuggestion(occasion)}
              className="px-4 py-2 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg text-purple-200 text-sm font-medium transition-all capitalize"
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      {/* Wardrobe Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">👗</div>
            <h3 className="text-2xl font-semibold text-[#C0C0D8] mb-3">Your wardrobe is empty</h3>
            <p className="text-[#E8E8F4]/60 mb-6">Add photos of your clothes to get started!</p>
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="px-8 py-4 bg-gradient-to-br from-[#4A5DB8] to-purple-600 rounded-xl text-white font-medium inline-flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Add Your First Item
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group bg-[#1A1A24]/60 rounded-2xl overflow-hidden border border-[#C0C0D8]/20 hover:border-purple-500/50 transition-all"
              >
                {/* Photo */}
                <div className="aspect-square bg-[#0A0A0F] flex items-center justify-center overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt="Clothing item"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%231A1A24" width="200" height="200"/%3E%3Ctext fill="%23C0C0D8" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="48"%3E👗%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFavorite(item)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                      item.favorite
                        ? 'bg-red-500/90 text-white'
                        : 'bg-black/60 text-white hover:bg-red-500/90'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-red-600/90 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-purple-900/30 rounded-full text-xs text-purple-200 capitalize">
                      {item.category}
                    </span>
                    {item.colors.length > 0 && (
                      <div className="flex gap-1">
                        {item.colors.slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/30"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <p className="text-xs text-[#C0C0D8]/60">
                      {item.tags.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dress Up Modal */}
      <AnimatePresence>
        {showDressUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setShowDressUp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0A0F]/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full border border-[#C0C0D8]/30"
            >
              <h2 className="text-3xl font-bold text-[#C0C0D8] mb-6">✨ Dress Up</h2>

              <div className="grid grid-cols-3 gap-6">
                {/* Avatar */}
                <div className="col-span-1">
                  <div className="aspect-[3/4] bg-gradient-to-br from-[#1A1A24] to-[#2A1A3F] rounded-2xl flex items-center justify-center border-2 border-dashed border-purple-500/30">
                    <div className="text-center">
                      <User className="w-24 h-24 text-purple-300/50 mx-auto mb-3" />
                      <p className="text-purple-300/50 text-sm">Your outfit preview</p>
                    </div>
                  </div>
                </div>

                {/* Outfit Pieces */}
                <div className="col-span-2 space-y-4">
                  {[
                    { key: 'top', label: 'Top', icon: '👚' },
                    { key: 'bottom', label: 'Bottom', icon: '👖' },
                    { key: 'shoes', label: 'Shoes', icon: '👟' },
                    { key: 'outerwear', label: 'Outerwear', icon: '🧥' },
                    { key: 'accessory', label: 'Accessory', icon: '💍' },
                  ].map(({ key, label, icon }) => {
                    const item = selectedOutfit[key as keyof typeof selectedOutfit];
                    return (
                      <div key={key} className="bg-[#1A1A24]/60 rounded-xl p-4 border border-[#C0C0D8]/20">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{icon}</span>
                          <div className="flex-1">
                            <p className="text-sm text-[#C0C0D8]/60 mb-1">{label}</p>
                            {item ? (
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.photoUrl}
                                  alt={label}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="text-[#C0C0D8] capitalize">{item.category}</p>
                                  {item.colors.length > 0 && (
                                    <p className="text-xs text-[#C0C0D8]/60">
                                      {item.colors.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-[#C0C0D8]/40 italic">Not selected</p>
                            )}
                          </div>
                          <button className="px-4 py-2 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg text-purple-200 text-sm transition-all">
                            Change
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDressUp(false)}
                  className="px-6 py-3 bg-[#1A1A24]/60 hover:bg-[#1A1A24] rounded-xl text-[#C0C0D8] font-medium transition-all"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all">
                  Save Outfit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
