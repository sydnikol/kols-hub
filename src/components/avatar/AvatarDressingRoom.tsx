import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shirt, Palette, Camera, Upload, Sparkles,
  Trash2, Check, X, ScanLine, Plus, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../../utils/database';

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

const AvatarDressingRoom: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState('sensory-safe');
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<{
    top?: string;
    bottom?: string;
    shoes?: string;
    accessory?: string;
  }>({});
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outfitPresets = [
    { id: 'sensory-safe', name: 'Sensory Safe Now', description: 'Comfortable, low-stim clothing', color: '#4a5f7f' },
    { id: 'academic-goth', name: 'Academic Goth', description: 'Dark academia meets velvet', color: '#5f7f4a' },
    { id: 'afrofuturist', name: 'Afro-futurist Royalty', description: 'Gold accents, bold patterns', color: '#9f8f6f' },
    { id: 'cyberpunk', name: 'Cyberpunk Witch', description: 'Neon tech meets mysticism', color: '#7f4a6f' },
    { id: 'quiet-mode', name: 'Quiet Mode: Minimalist Black', description: 'Pure simplicity', color: '#2a2a2a' },
  ];

  // Load wardrobe from database on mount
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

  // AI Photo Analysis Function
  const analyzeClothingPhoto = async (file: File): Promise<ClothingItem> => {
    setIsScanning(true);
    toast.loading('AI analyzing your clothing...', { id: 'scan' });

    return new Promise((resolve) => {
      // Simulate AI analysis
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;

          // Mock AI analysis results
          const mockAnalysis: ClothingItem = {
            id: Date.now().toString(),
            name: `Scanned Item ${wardrobe.length + 1}`,
            type: ['top', 'bottom', 'dress', 'shoes', 'accessory'][Math.floor(Math.random() * 5)] as any,
            colors: ['#7c3aed', '#3b82f6', '#10b981'][Math.floor(Math.random() * 3)].split(','),
            style: ['Casual', 'Formal', 'Athletic', 'Gothic', 'Boho'][Math.floor(Math.random() * 5)],
            imageUrl,
            dateAdded: new Date(),
            aiAnalysis: 'AI detected: Comfortable fabric, perfect for low-sensory days. Colors: purple/violet tones. Style: Gothic comfort.'
          };

          setIsScanning(false);
          toast.success('Item scanned & added to wardrobe!', { id: 'scan' });
          resolve(mockAnalysis);
        };
        reader.readAsDataURL(file);
      }, 2000);
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
      setShowScanner(false);
    } catch (error) {
      console.error('Error saving to wardrobe:', error);
      toast.error('Failed to save item');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await db.wardrobe.delete(id);
      setWardrobe(prev => prev.filter(item => item.id !== id));
      toast.success('Item removed from wardrobe');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const addToOutfit = (item: ClothingItem) => {
    setSelectedOutfit(prev => ({ ...prev, [item.type]: item.id }));
    toast.success(`${item.name} added to outfit!`);
  };

  return (
    <div className="avatar-dressing-room p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <User size={64} color="#7c3aed" strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '300', fontFamily: 'serif', color: '#c0c0c0', margin: '0 0 12px 0' }}>
            Avatar Dressing Room
          </h1>
          <p style={{ fontSize: '16px', color: '#808080', fontStyle: 'italic' }}>
            AI-powered wardrobe scanner - Scan your clothes & dress your avatar
          </p>
        </div>

        {/* AI Scanner Section */}
        <motion.div
          style={{
            background: 'linear-gradient(135deg, #7c3aed22 0%, #3b82f622 100%)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            border: '1px solid #7c3aed44'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '28px', color: '#c0c0c0', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              <Sparkles size={28} color="#7c3aed" />
              AI Wardrobe Scanner
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isScanning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: isScanning ? 0.6 : 1
              }}
            >
              {isScanning ? <ScanLine className="animate-spin" size={20} /> : <Camera size={20} />}
              {isScanning ? 'Scanning...' : 'Scan New Item'}
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <p style={{ color: '#a0a0a0', fontSize: '14px', margin: 0 }}>
            📸 Take a photo or upload an image of your clothing. AI will analyze the style, colors, and add it to your digital wardrobe.
          </p>
        </motion.div>

        {/* My Wardrobe */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '16px', padding: '30px', border: '1px solid #2a2a2a', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shirt size={24} color="#7c3aed" />
            My Wardrobe ({wardrobe.length} items)
          </h2>

          {wardrobe.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#808080' }}>
              <ImageIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No items yet. Scan your first clothing item to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {wardrobe.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: '#0f0f0f',
                    border: selectedOutfit[item.type] === item.id ? '2px solid #7c3aed' : '1px solid #2a2a2a',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => addToOutfit(item)}
                >
                  <div style={{
                    height: '160px',
                    background: `url(${item.imageUrl}) center/cover`,
                    position: 'relative'
                  }}>
                    {selectedOutfit[item.type] === item.id && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: '#7c3aed',
                        borderRadius: '50%',
                        padding: '4px'
                      }}>
                        <Check size={16} color="white" />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h3 style={{ color: '#c0c0c0', fontSize: '14px', marginBottom: '6px', fontWeight: '600' }}>{item.name}</h3>
                    <p style={{ color: '#808080', fontSize: '12px', marginBottom: '8px' }}>{item.type} • {item.style}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {item.colors.map((color, i) => (
                          <div key={i} style={{ width: '16px', height: '16px', borderRadius: '50%', background: color, border: '1px solid #2a2a2a' }} />
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Outfit Presets */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '16px', padding: '30px', border: '1px solid #2a2a2a', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Palette size={24} color="#7c3aed" />
            Quick Presets
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {outfitPresets.map((preset) => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedPreset(preset.id)}
                style={{
                  background: selectedPreset === preset.id ? `${preset.color}22` : '#0f0f0f',
                  border: `1px solid ${selectedPreset === preset.id ? preset.color : '#2a2a2a'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                }}
              >
                <h3 style={{ color: preset.color, fontSize: '16px', marginBottom: '8px' }}>{preset.name}</h3>
                <p style={{ color: '#808080', fontSize: '13px', margin: 0 }}>{preset.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3D Avatar Preview */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '16px', padding: '30px', border: '1px solid #2a2a2a', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px' }}>
            Your Avatar
          </h2>
          <div style={{
            width: '100%',
            height: '500px',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a1f 100%)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            border: '1px solid #7c3aed22'
          }}>
            <User size={120} color="#7c3aed" strokeWidth={0.5} />
            <p style={{ color: '#808080', fontSize: '14px' }}>Ready Player Me Avatar (ID: 68e94e474099d80b93c9b714)</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '400px' }}>
              {Object.entries(selectedOutfit).map(([type, id]) => {
                const item = wardrobe.find(i => i.id === id);
                return item ? (
                  <div key={type} style={{
                    background: '#1a1a1f',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #7c3aed',
                    color: '#c0c0c0',
                    fontSize: '12px'
                  }}>
                    {type}: {item.name}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarDressingRoom;
