import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ChronoMuseAvatar2DProps {
  mood: 'overwhelm' | 'curiosity' | 'grief' | 'focus' | 'victory' | 'calm';
}

export default function ChronoMuseAvatar2D({ mood }: ChronoMuseAvatar2DProps) {
  const [glowColor, setGlowColor] = useState('#4A5DB8');
  const [emoji, setEmoji] = useState('🌙');

  useEffect(() => {
    const moodColors = {
      overwhelm: '#4A7DB8',
      curiosity: '#D4AF37',
      grief: '#6B7DB8',
      focus: '#C0C0D8',
      victory: '#D4AF37',
      calm: '#4A5DB8'
    };

    const moodEmojis = {
      overwhelm: '🌊',
      curiosity: '✨',
      grief: '🌧️',
      focus: '🎯',
      victory: '🌟',
      calm: '🌙'
    };

    setGlowColor(moodColors[mood]);
    setEmoji(moodEmojis[mood]);
  }, [mood]);

  return (
    <motion.div
      className="w-48 h-48 rounded-full overflow-hidden border-4 relative flex items-center justify-center"
      style={{
        borderColor: `${glowColor}60`,
        background: `radial-gradient(circle at 30% 30%, ${glowColor}40, #0A0A0F 70%)`,
      }}
      animate={{
        borderColor: [`${glowColor}40`, `${glowColor}80`, `${glowColor}40`],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 60%, ${glowColor}20)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* Avatar face/orb */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Main avatar circle */}
        <motion.div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-2"
          style={{
            background: `linear-gradient(135deg, ${glowColor}80, ${glowColor}40)`,
            boxShadow: `0 0 40px ${glowColor}60, inset 0 0 30px ${glowColor}30`,
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <span className="text-6xl">{emoji}</span>
        </motion.div>

        {/* Sparkles around avatar */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 70;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: glowColor,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            />
          );
        })}
      </motion.div>

      {/* Mood Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border z-20" style={{ borderColor: `${glowColor}60` }}>
        <p className="text-xs font-medium" style={{ color: glowColor }}>{mood}</p>
      </div>

      {/* Animated rings */}
      <motion.div
        className="absolute inset-4 rounded-full border-2"
        style={{ borderColor: `${glowColor}30` }}
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity },
        }}
      />

      <motion.div
        className="absolute inset-8 rounded-full border"
        style={{ borderColor: `${glowColor}20` }}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}
