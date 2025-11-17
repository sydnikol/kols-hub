import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shirt, Palette } from 'lucide-react';

const AvatarDressingRoom: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState('sensory-safe');

  const outfitPresets = [
    { id: 'sensory-safe', name: 'Sensory Safe Now', description: 'Comfortable, low-stim clothing', color: '#4a5f7f' },
    { id: 'academic-goth', name: 'Academic Goth', description: 'Dark academia meets velvet', color: '#5f7f4a' },
    { id: 'afrofuturist', name: 'Afro-futurist Royalty', description: 'Gold accents, bold patterns', color: '#9f8f6f' },
    { id: 'cyberpunk', name: 'Cyberpunk Witch', description: 'Neon tech meets mysticism', color: '#7f4a6f' },
    { id: 'quiet-mode', name: 'Quiet Mode: Minimalist Black', description: 'Pure simplicity', color: '#2a2a2a' },
  ];

  return (
    <div className="avatar-dressing-room">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <User size={64} color="#7f4a6f" strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '300', fontFamily: 'serif', color: '#c0c0c0', margin: '0 0 12px 0' }}>
            Avatar Dressing Room
          </h1>
          <p style={{ fontSize: '16px', color: '#808080', fontStyle: 'italic' }}>
            Design your look - syncs with real-life outfit choices
          </p>
        </div>

        {/* Outfit Presets */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '16px', padding: '30px', border: '1px solid #2a2a2a' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shirt size={24} color="#7f4a6f" />
            Outfit Presets
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
        <div style={{ marginTop: '30px', background: 'rgba(10, 10, 10, 0.8)', borderRadius: '16px', padding: '30px', border: '1px solid #2a2a2a', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px' }}>
            3D Avatar Preview
          </h2>
          <div style={{ width: '100%', height: '400px', background: '#0a0a0a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#808080' }}>Ready Player Me Avatar (ID: 68e94e474099d80b93c9b714)</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarDressingRoom;
