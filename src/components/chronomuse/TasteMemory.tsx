import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TasteMemoryProps {
  mode: string;
}

const TasteMemory: React.FC<TasteMemoryProps> = ({ mode }) => {
  const [preferences, setPreferences] = useState({
    favoriteColors: ['#0a0a0a', '#4a5f7f', '#c0c0c0'],
    favoriteEras: ['Harlem Renaissance', 'Ancient Nubia', 'Cyberpunk Future'],
    fashionStyle: 'Gothic Academic',
    musicMood: 'Lo-fi & Jazz',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        marginTop: '16px',
        padding: '12px',
        background: '#0f0f0f',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
      }}
    >
      <p style={{
        color: '#808080',
        fontSize: '10px',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        Taste Memory
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {preferences.favoriteColors.map((color, i) => (
            <div
              key={i}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: color,
                border: '1px solid #4a4a4a',
              }}
            />
          ))}
          <span style={{ color: '#808080', fontSize: '11px', marginLeft: '8px' }}>
            Your Palette
          </span>
        </div>
        <p style={{ color: '#c0c0c0', fontSize: '11px', margin: 0 }}>
          Style: {preferences.fashionStyle}
        </p>
        <p style={{ color: '#c0c0c0', fontSize: '11px', margin: 0 }}>
          Music: {preferences.musicMood}
        </p>
      </div>
    </motion.div>
  );
};

export default TasteMemory;
