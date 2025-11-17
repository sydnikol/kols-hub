import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Telescope, Globe, Clock, Sparkles, MapPin } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

const Observatory: React.FC = () => {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const eras = [
    {
      id: 'harlem',
      name: 'Harlem Renaissance',
      period: '1920s',
      description: 'Grayscale gothic jazz lounge',
      color: '#8f6f4f',
      palette: ['#1a1a1a', '#3a3a3a', '#5a5a5a', '#8f6f4f'],
    },
    {
      id: 'nubia',
      name: 'Ancient Nubia & Kemet',
      period: '3000 BCE',
      description: 'Gold accents on charcoal stone',
      color: '#9f8f6f',
      palette: ['#2a2a2a', '#1a1a1a', '#9f8f6f', '#bfaf8f'],
    },
    {
      id: 'edo',
      name: 'Edo Japan',
      period: '1603-1868',
      description: 'Ink-brush aesthetic',
      color: '#4a5f7f',
      palette: ['#0a0a0a', '#1a1a1a', '#4a5f7f', '#6a7f9f'],
    },
    {
      id: 'cyber-seoul',
      name: 'Cyber Future Seoul',
      period: '2088',
      description: 'Neon + metallics',
      color: '#7f4a6f',
      palette: ['#1a1a2a', '#2a2a3a', '#7f4a6f', '#9f6a8f'],
    },
    {
      id: 'diaspora',
      name: 'Maroon Societies',
      period: '1600s-1800s',
      description: 'Liberation timelines',
      color: '#5f7f4a',
      palette: ['#1a2a1a', '#2a3a2a', '#5f7f4a', '#7f9f6a'],
    },
    {
      id: 'punk-future',
      name: 'Punk Alt Future',
      period: '2150',
      description: 'Digital sigils & glitch',
      color: '#7f4a4a',
      palette: ['#2a1a1a', '#3a2a2a', '#7f4a4a', '#9f6a6a'],
    },
  ];

  return (
    <div className="observatory-room" style={{ position: 'relative', minHeight: '80vh' }}>
      {/* 3D Space Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#4a5f7f" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ display: 'inline-block', marginBottom: '20px' }}
            >
              <Telescope size={64} color="#4a5f7f" strokeWidth={1} />
            </motion.div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '300',
              fontFamily: 'serif',
              color: '#c0c0c0',
              margin: '0 0 12px 0',
              letterSpacing: '2px',
            }}>
              The Observatory
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#808080',
              fontStyle: 'italic',
              margin: 0,
            }}>
              Your portal to any time, any place, any culture
            </p>
          </div>

          {/* Era Constellation Map */}
          <div style={{
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #2a2a2a',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '400',
              color: '#c0c0c0',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <Globe size={28} color="#4a5f7f" />
              Era Constellation
            </h2>

            {/* Era Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {eras.map((era) => (
                <motion.div
                  key={era.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedEra(era.id)}
                  style={{
                    background: selectedEra === era.id 
                      ? `linear-gradient(135deg, ${era.color}33 0%, ${era.color}11 100%)`
                      : 'rgba(15, 15, 15, 0.95)',
                    border: `1px solid ${selectedEra === era.id ? era.color : '#2a2a2a'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glow Effect */}
                  <motion.div
                    animate={{
                      opacity: selectedEra === era.id ? [0.3, 0.6, 0.3] : 0,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at 50% 50%, ${era.color}44 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Era Icon */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginBottom: '16px',
                    }}>
                      <Clock size={24} color={era.color} strokeWidth={1.5} />
                      <span style={{
                        fontSize: '12px',
                        color: era.color,
                        fontWeight: '600',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}>
                        {era.period}
                      </span>
                    </div>

                    {/* Era Name */}
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#c0c0c0',
                      margin: '0 0 8px 0',
                    }}>
                      {era.name}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '13px',
                      color: '#808080',
                      margin: '0 0 16px 0',
                      lineHeight: '1.6',
                    }}>
                      {era.description}
                    </p>

                    {/* Color Palette */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px',
                      marginBottom: '16px',
                    }}>
                      {era.palette.map((color, i) => (
                        <div
                          key={i}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: color,
                            border: '1px solid #3a3a3a',
                          }}
                        />
                      ))}
                    </div>

                    {/* Jump Button */}
                    {selectedEra === era.id && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          width: '100%',
                          background: era.color,
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <MapPin size={16} />
                        Jump to {era.name}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Time Travel Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '30px',
              padding: '24px',
              background: 'rgba(74, 95, 127, 0.1)',
              border: '1px solid #4a5f7f',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <Sparkles size={24} color="#4a5f7f" style={{ marginBottom: '12px' }} />
            <p style={{
              fontSize: '14px',
              color: '#c0c0c0',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Select an era to begin your journey. ChronoMuse will adapt the entire environment—
              voice, lighting, music, and visuals—to match your chosen time period.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Observatory;
