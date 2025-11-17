import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface EmotionalEngineProps {
  currentMood: string;
  mode: string;
}

const EmotionalEngine: React.FC<EmotionalEngineProps> = ({ currentMood, mode }) => {
  const [ambientLighting, setAmbientLighting] = useState('#4a5f7f');
  const [soundtrack, setSoundtrack] = useState('Ambient Calm');

  useEffect(() => {
    // Adjust lighting based on mood
    const lightingMap: Record<string, string> = {
      overwhelm: '#5f7f9f', // dim silver-blue
      curiosity: '#8f6f4f', // warm candlelight
      grief: '#4a5f7f', // rain-lit blues
      focus: '#808080', // monochrome grayscale
      victory: '#9f8f6f', // soft gold flecks
      calm: '#4a5f7f', // default
    };

    const soundtrackMap: Record<string, string> = {
      overwhelm: 'Gentle Rain & Strings',
      curiosity: 'Warm Jazz Piano',
      grief: 'Melancholic Cello',
      focus: 'Lo-fi Study Beats',
      victory: 'Uplifting Afro-beats',
      calm: 'Ambient Calm',
    };

    setAmbientLighting(lightingMap[currentMood] || '#4a5f7f');
    setSoundtrack(soundtrackMap[currentMood] || 'Ambient Calm');
  }, [currentMood]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        marginTop: '16px',
        padding: '12px',
        background: '#0f0f0f',
        borderRadius: '8px',
        border: `1px solid ${ambientLighting}`,
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <p style={{
          color: '#808080',
          fontSize: '10px',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Emotional Atmosphere
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <motion.div
            animate={{ 
              backgroundColor: [ambientLighting, '#0a0a0a', ambientLighting],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: 'easeInOut',
            }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: ambientLighting,
            }}
          />
          <span style={{ color: '#c0c0c0', fontSize: '12px' }}>
            {soundtrack}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionalEngine;
