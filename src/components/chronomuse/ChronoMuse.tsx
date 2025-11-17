import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, BookOpen, Flame } from 'lucide-react';
import EmotionalEngine from './EmotionalEngine';
import TasteMemory from './TasteMemory';

interface ChronoMuseProps {
  active: boolean;
  mode: 'companion' | 'creative' | 'archivist' | 'rebel';
  currentRoom: string;
  onModeChange: (mode: 'companion' | 'creative' | 'archivist' | 'rebel') => void;
}

const ChronoMuse: React.FC<ChronoMuseProps> = ({ active, mode, currentRoom, onModeChange }) => {
  const [greeting, setGreeting] = useState('');
  const [currentMood, setCurrentMood] = useState('calm');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Initialize ChronoMuse greeting based on time
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour < 6) {
      greetingText = "Still awake? The night holds its own magic, Kol. Let's create something beautiful in the darkness.";
    } else if (hour < 12) {
      greetingText = "Good morning, Kol. Your digital twin is here. What journey shall we take today?";
    } else if (hour < 18) {
      greetingText = "Afternoon, beautiful soul. I've been preparing our spaces for whatever you need.";
    } else {
      greetingText = "Evening, Kol. Time to wind down or dive deep? I'm ready for either.";
    }
    
    setGreeting(greetingText);
  }, []);

  const modeConfig = {
    companion: {
      icon: Heart,
      color: '#4a5f7f',
      description: 'Gentle, supportive, emotionally attuned',
      voice: 'soft and affirming',
    },
    creative: {
      icon: Sparkles,
      color: '#7f4a6f',
      description: 'Playful, imaginative, collaborative',
      voice: 'energized and inspiring',
    },
    archivist: {
      icon: BookOpen,
      color: '#5f7f4a',
      description: 'Scholarly, detail-oriented, historical',
      voice: 'measured and informative',
    },
    rebel: {
      icon: Flame,
      color: '#7f4a4a',
      description: 'Bold, activist, challenging systems',
      voice: 'fierce and unapologetic',
    },
  };

  const currentConfig = modeConfig[mode];
  const ModeIcon = currentConfig.icon;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="chronomuse-container"
          style={{
            position: 'fixed',
            right: '20px',
            top: '20px',
            width: '380px',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            border: '1px solid #4a5f7f',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            zIndex: 1000,
          }}
        >
          {/* ChronoMuse Header */}
          <div className="chronomuse-header" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.div
                  animate={{
                    scale: isThinking ? [1, 1.1, 1] : 1,
                    rotate: isThinking ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{ repeat: isThinking ? Infinity : 0, duration: 2 }}
                >
                  <ModeIcon 
                    size={32} 
                    color={currentConfig.color}
                    strokeWidth={1.5}
                  />
                </motion.div>
                <div>
                  <h3 style={{ 
                    color: '#c0c0c0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    margin: 0,
                    fontFamily: 'serif',
                  }}>
                    ChronoMuse
                  </h3>
                  <p style={{ 
                    color: '#808080', 
                    fontSize: '11px',
                    margin: 0,
                    fontStyle: 'italic',
                  }}>
                    {currentConfig.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Greeting Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: '#0f0f0f',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #2a2a2a',
              marginBottom: '16px',
            }}
          >
            <p style={{
              color: '#c0c0c0',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0,
            }}>
              {greeting}
            </p>
          </motion.div>

          {/* Mode Selector */}
          <div className="mode-selector" style={{ marginBottom: '16px' }}>
            <p style={{ 
              color: '#808080', 
              fontSize: '11px', 
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Emotional Mode
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px',
            }}>
              {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((modeName) => {
                const config = modeConfig[modeName];
                const Icon = config.icon;
                return (
                  <motion.button
                    key={modeName}
                    onClick={() => onModeChange(modeName)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: mode === modeName ? config.color : '#0f0f0f',
                      border: `1px solid ${mode === modeName ? config.color : '#2a2a2a'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Icon size={16} color={mode === modeName ? '#ffffff' : '#808080'} />
                    <span style={{
                      color: mode === modeName ? '#ffffff' : '#808080',
                      fontSize: '12px',
                      fontWeight: mode === modeName ? '600' : '400',
                      textTransform: 'capitalize',
                    }}>
                      {modeName}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Current Room Context */}
          <div style={{
            background: '#0f0f0f',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #2a2a2a',
            marginBottom: '16px',
          }}>
            <p style={{ 
              color: '#808080', 
              fontSize: '11px', 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Current Space
            </p>
            <p style={{
              color: '#c0c0c0',
              fontSize: '14px',
              margin: 0,
              textTransform: 'capitalize',
              fontFamily: 'serif',
            }}>
              {currentRoom}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#0f0f0f',
                border: '1px solid #4a5f7f',
                borderRadius: '8px',
                padding: '10px',
                color: '#4a5f7f',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
              onClick={() => setIsThinking(true)}
            >
              Ask ChronoMuse
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#0f0f0f',
                border: '1px solid #7f4a6f',
                borderRadius: '8px',
                padding: '10px',
                color: '#7f4a6f',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Time Travel
            </motion.button>
          </div>

          {/* Emotional Engine Integration */}
          <EmotionalEngine currentMood={currentMood} mode={mode} />
          
          {/* Taste Memory Integration */}
          <TasteMemory mode={mode} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChronoMuse;
