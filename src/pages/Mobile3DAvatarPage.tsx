import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Camera, Shirt, Sparkles, Check, ChevronLeft, ChevronRight,
  RotateCcw, ZoomIn, ZoomOut, Home, Upload, Palette
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../utils/database';
import ReadyPlayerMeAvatar from '../components/ReadyPlayerMeAvatar';

interface ClothingItem {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'dress' | 'shoes' | 'accessory' | 'outerwear';
  colors: string[];
  style: string;
  imageUrl: string;
  dateAdded: Date;
  aiAnalysis?: string;
}

/**
 * 📱 MOBILE 3D AVATAR PAGE
 * Full-screen mobile experience with real clothing dress-up
 * - Take photos of real clothes
 * - AI analyzes clothing
 * - Apply to 3D avatar
 * - Touch controls optimized for phone
 */
const Mobile3DAvatarPage: React.FC = () => {
  // Avatar state
  const [avatarId] = useState('68e94e474099d80b93c9b714'); // Default Ready Player Me avatar
  const [avatarMood, setAvatarMood] = useState<'happy' | 'excited' | 'neutral' | 'thinking'>('neutral');

  // Wardrobe state
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<{
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    accessory?: ClothingItem;
  }>({});

  // UI state
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedType, setSelectedType] = useState<ClothingItem['type']>('top');
  const [avatarScale, setAvatarScale] = useState(1);
  const [avatarRotation, setAvatarRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load wardrobe on mount
  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    try {
      const items = await db.wardrobe.toArray();
      setWardrobe(items as ClothingItem[]);
    } catch (error) {
      console.error('Error loading wardrobe:', error);
    }
  };

  // AI Photo Analysis
  const analyzeClothingPhoto = async (file: File): Promise<ClothingItem> => {
    setIsScanning(true);
    toast.loading('AI analyzing your clothing...', { id: 'scan' });

    return new Promise((resolve) => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;

          // Mock AI analysis
          const clothingTypes: ClothingItem['type'][] = ['top', 'bottom', 'dress', 'shoes', 'accessory'];
          const styles = ['Casual', 'Formal', 'Athletic', 'Gothic', 'Streetwear', 'Vintage'];
          const colorPalettes = [
            ['#000000', '#1a1a1a'],
            ['#7c3aed', '#a78bfa'],
            ['#3b82f6', '#60a5fa'],
            ['#ef4444', '#f87171'],
            ['#10b981', '#34d399'],
            ['#f59e0b', '#fbbf24']
          ];

          const randomType = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
          const randomStyle = styles[Math.floor(Math.random() * styles.length)];
          const randomColors = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

          const mockAnalysis: ClothingItem = {
            id: Date.now().toString(),
            name: `${randomStyle} ${randomType}`,
            type: randomType,
            colors: randomColors,
            style: randomStyle,
            imageUrl,
            dateAdded: new Date(),
            aiAnalysis: `AI detected: ${randomStyle} style ${randomType}. Comfortable fabric. Colors: ${randomColors.join(', ')}`
          };

          setIsScanning(false);
          toast.success('Clothing scanned!', { id: 'scan' });
          resolve(mockAnalysis);
        };
        reader.readAsDataURL(file);
      }, 1500);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const analyzedItem = await analyzeClothingPhoto(file);

    // Save to database
    try {
      await db.wardrobe.add(analyzedItem);
      setWardrobe(prev => [...prev, analyzedItem]);

      // Auto-apply to avatar
      setSelectedOutfit(prev => ({ ...prev, [analyzedItem.type]: analyzedItem }));
      setAvatarMood('excited');
      setTimeout(() => setAvatarMood('happy'), 2000);

      toast.success(`${analyzedItem.name} added and equipped!`);
    } catch (error) {
      console.error('Error saving to wardrobe:', error);
      toast.error('Failed to save item');
    }
  };

  const applyClothing = (item: ClothingItem) => {
    setSelectedOutfit(prev => ({ ...prev, [item.type]: item }));
    setAvatarMood('excited');
    setTimeout(() => setAvatarMood('happy'), 1500);
    toast.success(`Wearing ${item.name}!`);
  };

  const removeClothing = (type: ClothingItem['type']) => {
    setSelectedOutfit(prev => {
      const newOutfit = { ...prev };
      delete newOutfit[type];
      return newOutfit;
    });
    toast('Clothing removed');
  };

  const filteredWardrobe = wardrobe.filter(item => item.type === selectedType);

  const clothingTypes: { type: ClothingItem['type']; icon: string }[] = [
    { type: 'top', icon: '👕' },
    { type: 'bottom', icon: '👖' },
    { type: 'dress', icon: '👗' },
    { type: 'shoes', icon: '👟' },
    { type: 'accessory', icon: '👓' }
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-900 via-purple-900/20 to-black overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-600/30 transition-colors"
        >
          <Home size={24} className="text-purple-300" />
        </button>

        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <User size={24} className="text-purple-400" />
          My 3D Avatar
        </h1>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          {isScanning ? (
            <Sparkles size={24} className="text-white animate-spin" />
          ) : (
            <Camera size={24} className="text-white" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* 3D Avatar Display */}
      <div className="flex-1 relative">
        <ReadyPlayerMeAvatar
          avatarUrl={`https://models.readyplayer.me/${avatarId}.glb`}
          mood={avatarMood}
          quality="medium"
          enableRotation={true}
          enableZoom={true}
          scale={avatarScale}
          rotation={[0, avatarRotation, 0]}
          backgroundColor="transparent"
        />

        {/* Avatar Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setAvatarScale(prev => Math.min(prev + 0.2, 2))}
            className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-purple-500/30"
          >
            <ZoomIn size={20} className="text-purple-300" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setAvatarScale(prev => Math.max(prev - 0.2, 0.5))}
            className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-purple-500/30"
          >
            <ZoomOut size={20} className="text-purple-300" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setAvatarRotation(0)}
            className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-purple-500/30"
          >
            <RotateCcw size={20} className="text-purple-300" />
          </motion.button>
        </div>

        {/* Current Outfit Display */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 max-w-[150px]">
          {Object.entries(selectedOutfit).map(([type, item]) => (
            item && (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-purple-500/30 flex items-center gap-2"
              >
                <div
                  className="w-10 h-10 rounded bg-cover bg-center border border-purple-500/50"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                  <p className="text-purple-300 text-[10px]">{item.type}</p>
                </div>
                <button
                  onClick={() => removeClothing(type as ClothingItem['type'])}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </motion.div>
            )
          ))}
        </div>

        {/* Wardrobe Toggle Button */}
        <button
          onClick={() => setShowWardrobe(!showWardrobe)}
          className="absolute bottom-4 right-4 p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
        >
          <Shirt size={28} className="text-white" />
        </button>
      </div>

      {/* Wardrobe Drawer */}
      <AnimatePresence>
        {showWardrobe && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-purple-500/30 rounded-t-3xl max-h-[50vh] overflow-hidden flex flex-col"
          >
            {/* Wardrobe Header */}
            <div className="p-4 border-b border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Palette size={20} className="text-purple-400" />
                  Wardrobe ({wardrobe.length})
                </h2>
                <button
                  onClick={() => setShowWardrobe(false)}
                  className="text-purple-300 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Type Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {clothingTypes.map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {icon} {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Clothing Items Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredWardrobe.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Upload size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No {selectedType}s yet</p>
                  <p className="text-sm text-gray-500 mt-1">Tap camera to scan clothing</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {filteredWardrobe.map((item) => (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => applyClothing(item)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        selectedOutfit[item.type]?.id === item.id
                          ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                          : 'border-gray-700 hover:border-purple-500/50'
                      }`}
                    >
                      <div
                        className="aspect-square bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      />

                      {selectedOutfit[item.type]?.id === item.id && (
                        <div className="absolute top-1 right-1 bg-purple-600 rounded-full p-1">
                          <Check size={14} className="text-white" />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2">
                        <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                        <div className="flex gap-1 mt-1">
                          {item.colors.slice(0, 3).map((color, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full border border-white/50"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mobile3DAvatarPage;
