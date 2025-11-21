import { motion } from 'framer-motion';
import {
  Music, Palette, Brush, Disc, Headphones, Coffee,
  Sparkles, Star, Circle, Lightbulb, Volume2, Radio,
  Play, Pause, SkipForward, Heart, Share2, Download
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StudioRoom2D() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => (prev + 1) % 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0A0515]">
      {/* ===== MULTI-LAYERED STARFIELD BACKGROUND ===== */}
      {/* Deep space layer */}
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <motion.div
            key={`star-deep-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              opacity: [Math.random() * 0.3 + 0.1, Math.random() * 0.5 + 0.3, Math.random() * 0.3 + 0.1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Nebula clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      {/* Shooting stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`shooting-star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)',
          }}
          animate={{
            x: [0, -200],
            y: [0, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 4 + Math.random() * 3,
            repeatDelay: 5,
          }}
        />
      ))}

      {/* ===== BACK WALL WITH NEON LIGHTS ===== */}
      <div className="absolute inset-0">
        {/* Wall texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F2E] via-[#1A0F2E]/90 to-transparent opacity-80" />

        {/* LED Strip - Top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-pink-500/30 to-transparent blur-sm" />

        {/* LED Strip - Left side */}
        <motion.div
          className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-purple-500/30 to-transparent blur-sm" />

        {/* LED Strip - Right side */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-blue-500/30 to-transparent blur-sm" />
      </div>

      {/* ===== REFERENCE SKETCHES ON WALLS ===== */}
      <div className="absolute top-8 left-4">
        <motion.div
          className="w-16 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded shadow-lg border border-amber-200"
          initial={{ rotate: -5 }}
          animate={{ rotate: [-5, -3, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          {/* Sketch content */}
          <div className="p-1 space-y-1">
            <div className="w-full h-1 bg-gray-400/40 rounded" />
            <div className="w-3/4 h-1 bg-gray-400/30 rounded" />
            <div className="w-full h-6 bg-gray-300/40 rounded mt-1" />
            <div className="w-1/2 h-1 bg-gray-400/30 rounded" />
          </div>
        </motion.div>
      </div>

      <div className="absolute top-12 right-4">
        <motion.div
          className="w-14 h-18 bg-gradient-to-br from-blue-100 to-blue-50 rounded shadow-lg border border-blue-200"
          initial={{ rotate: 8 }}
          animate={{ rotate: [8, 6, 8] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          <div className="p-1 space-y-1">
            <div className="w-full h-5 bg-gray-300/40 rounded" />
            <div className="w-full h-1 bg-gray-400/30 rounded" />
            <div className="w-2/3 h-1 bg-gray-400/30 rounded" />
          </div>
        </motion.div>
      </div>

      {/* ===== EASEL WITH CANVAS (LEFT SIDE) ===== */}
      <div className="absolute left-8 top-1/4 z-10">
        {/* Easel legs */}
        <div className="relative w-32 h-48">
          {/* Left leg */}
          <div className="absolute left-2 top-8 w-1.5 h-40 bg-gradient-to-b from-amber-700 to-amber-900 rounded transform -rotate-12 origin-top"
            style={{ boxShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          />
          {/* Right leg */}
          <div className="absolute right-2 top-8 w-1.5 h-40 bg-gradient-to-b from-amber-700 to-amber-900 rounded transform rotate-12 origin-top"
            style={{ boxShadow: '-2px 2px 8px rgba(0,0,0,0.5)' }}
          />
          {/* Center support */}
          <div className="absolute left-1/2 top-8 w-1.5 h-36 bg-gradient-to-b from-amber-700 to-amber-900 rounded -ml-0.5"
            style={{ boxShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          />

          {/* Canvas */}
          <motion.div
            className="absolute left-4 top-6 w-24 h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded shadow-2xl border-4 border-amber-800"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
            }}
          >
            {/* Art in progress - abstract colorful shapes */}
            <div className="relative w-full h-full overflow-hidden rounded">
              {/* Background wash */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 via-pink-200/40 to-blue-200/40" />

              {/* Paint strokes */}
              <motion.div
                className="absolute top-4 left-2 w-16 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 blur-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-12 right-2 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-60 blur-sm"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-6 left-4 w-14 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 blur-sm"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              />

              {/* Magical sparkles on canvas */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`canvas-sparkle-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Paint palette on easel */}
          <motion.div
            className="absolute -bottom-2 right-0 w-16 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full"
            style={{
              boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            }}
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Paint dabs */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full shadow-lg" />
            <div className="absolute top-1 left-6 w-3 h-3 bg-blue-500 rounded-full shadow-lg" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg" />
            <div className="absolute bottom-2 left-4 w-3 h-3 bg-green-500 rounded-full shadow-lg" />
            <div className="absolute bottom-2 right-3 w-3 h-3 bg-purple-500 rounded-full shadow-lg" />
          </motion.div>
        </div>
      </div>

      {/* ===== FLOATING PAINT BRUSHES WITH MAGICAL GLOW ===== */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 25;
        const x = 50 + Math.cos(angle) * radius;
        const y = 35 + Math.sin(angle) * radius;

        return (
          <motion.div
            key={`brush-${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360],
              x: [0, Math.sin(i) * 10, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.3 }}
            >
              <Brush
                className="w-6 h-6"
                style={{
                  color: ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171'][i],
                  filter: `drop-shadow(0 0 8px ${['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171'][i]})`,
                }}
              />
              {/* Magical glow */}
              <motion.div
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  background: ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171'][i],
                  opacity: 0.4,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* ===== MUSICAL INSTRUMENTS AREA (RIGHT SIDE) ===== */}
      {/* Electric Guitar */}
      <div className="absolute right-12 top-1/4">
        <motion.div
          className="relative w-12 h-40"
          animate={{
            rotate: [8, 12, 8],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Guitar body */}
          <div className="absolute bottom-8 left-0 w-12 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg"
            style={{
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Sound hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full shadow-inner" />
            {/* Pickups */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-gray-800 rounded" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-gray-800 rounded" />
          </div>

          {/* Guitar neck */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-28 bg-gradient-to-b from-amber-700 to-amber-900 rounded"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            {/* Frets */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-full h-px bg-gray-400/50" style={{ top: `${i * 16 + 8}%` }} />
            ))}
            {/* Strings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`string-${i}`}
                className="absolute h-full w-px bg-gray-300/60"
                style={{ left: `${(i + 1) * 25}%` }}
                animate={{
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          {/* Musical note particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`guitar-note-${i}`}
              className="absolute -right-4 text-pink-400"
              style={{
                top: `${20 + i * 20}%`,
              }}
              animate={{
                x: [0, 20],
                y: [0, -30],
                opacity: [0, 1, 0],
                rotate: [0, 20],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <Music className="w-3 h-3" style={{ filter: 'drop-shadow(0 0 4px #ec4899)' }} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Keyboard/Piano */}
      <div className="absolute right-4 bottom-24">
        <motion.div
          className="relative w-28 h-16 bg-gradient-to-b from-gray-900 to-black rounded shadow-2xl"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 40px rgba(168, 85, 247, 0.3)',
          }}
        >
          {/* Keys */}
          <div className="absolute inset-2 flex gap-px">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={`key-${i}`}
                className="flex-1 bg-gradient-to-b from-gray-100 to-white rounded-sm shadow"
                animate={{
                  scaleY: i % 2 === 0 ? [1, 0.95, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  repeatDelay: 2,
                }}
              />
            ))}
          </div>
          {/* Black keys */}
          <div className="absolute top-2 left-4 flex gap-3">
            {[...Array(5)].map((_, i) => (
              i !== 2 && (
                <div
                  key={`black-key-${i}`}
                  className="w-2 h-6 bg-gradient-to-b from-gray-900 to-black rounded-sm shadow-lg"
                />
              )
            ))}
          </div>

          {/* Light glow effect */}
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-b blur-sm"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* ===== VINYL RECORDS WITH HOLOGRAPHIC NOTES ===== */}
      <div className="absolute left-4 bottom-16">
        <motion.div
          className="relative w-20 h-20"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Vinyl record */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl"
            style={{
              boxShadow: '0 8px 20px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.1)',
            }}
          >
            {/* Grooves */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`groove-${i}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-700/40"
                style={{
                  width: `${90 - i * 10}%`,
                  height: `${90 - i * 10}%`,
                }}
              />
            ))}

            {/* Center label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600"
              style={{
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />
            </div>
          </div>

          {/* Holographic music notes emanating */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <motion.div
                key={`vinyl-note-${i}`}
                className="absolute top-1/2 left-1/2"
                animate={{
                  x: [0, Math.cos(angle) * 40],
                  y: [0, Math.sin(angle) * 40],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Volume2
                  className="w-4 h-4 text-cyan-400"
                  style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Second vinyl slightly behind */}
        <motion.div
          className="absolute top-4 -right-6 w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 via-gray-700 to-black shadow-xl"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            boxShadow: '0 6px 15px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600"
            style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black" />
          </div>
        </motion.div>
      </div>

      {/* ===== HEADPHONES HANGING ===== */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Headphones
            className="w-10 h-10 text-gray-300"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))',
            }}
          />
          {/* Glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>

      {/* ===== COFFEE CUP / ENERGY DRINK ===== */}
      <div className="absolute bottom-8 left-1/3">
        <motion.div
          className="relative"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          {/* Cup */}
          <div className="relative w-10 h-12 bg-gradient-to-b from-purple-900 to-purple-950 rounded-b-lg shadow-xl"
            style={{
              boxShadow: '0 6px 15px rgba(0,0,0,0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
              borderTop: '2px solid #a855f7',
            }}
          >
            {/* Coffee/drink inside */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-900 to-amber-700 rounded-b-lg" />

            {/* Steam */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`steam-${i}`}
                className="absolute -top-2 left-1/2 -translate-x-1/2"
                style={{ left: `${40 + i * 20}%` }}
                animate={{
                  y: [0, -20],
                  x: [0, Math.sin(i) * 5],
                  opacity: [0.6, 0],
                  scale: [0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                <div className="w-1.5 h-3 bg-white/60 rounded-full blur-sm" />
              </motion.div>
            ))}

            {/* Handle */}
            <div className="absolute right-0 top-2 w-3 h-6 border-2 border-purple-800 rounded-r-full"
              style={{
                borderLeft: 'none',
                boxShadow: 'inset -1px 0 3px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Glow under cup */}
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-purple-600/50 blur-md rounded-full" />
        </motion.div>
      </div>

      {/* ===== HOLOGRAPHIC MUSIC VISUALIZER (CENTER) ===== */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-48 h-20">
        <div className="relative w-full h-full">
          {/* Visualizer bars */}
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={`viz-${i}`}
              className="absolute bottom-0 rounded-t"
              style={{
                left: `${(i / 24) * 100}%`,
                width: '3%',
                background: `linear-gradient(to top,
                  ${i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6'},
                  ${i % 3 === 0 ? '#f9a8d4' : i % 3 === 1 ? '#c4b5fd' : '#93c5fd'}
                )`,
                boxShadow: `0 0 10px ${i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6'}`,
              }}
              animate={{
                height: isPlaying ? [
                  `${20 + Math.sin(currentTime + i) * 30}%`,
                  `${40 + Math.cos(currentTime + i * 1.5) * 35}%`,
                  `${25 + Math.sin(currentTime * 2 + i) * 30}%`,
                ] : '5%',
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Reflection */}
          <div className="absolute top-full left-0 right-0 h-20 overflow-hidden opacity-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={`viz-reflect-${i}`}
                className="absolute top-0 rounded-b"
                style={{
                  left: `${(i / 24) * 100}%`,
                  width: '3%',
                  background: `linear-gradient(to bottom,
                    ${i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6'},
                    transparent
                  )`,
                }}
                animate={{
                  height: isPlaying ? [
                    `${20 + Math.sin(currentTime + i) * 30}%`,
                    `${40 + Math.cos(currentTime + i * 1.5) * 35}%`,
                    `${25 + Math.sin(currentTime * 2 + i) * 30}%`,
                  ] : '5%',
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAGICAL PARTICLE EFFECTS ===== */}
      {/* Floating sparkles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24'][Math.floor(Math.random() * 5)],
            boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
          }}
          animate={{
            y: [0, -Math.random() * 100 - 50],
            x: [0, Math.sin(i) * 50],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Glowing orbs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-xl"
            style={{
              width: Math.random() * 40 + 20 + 'px',
              height: Math.random() * 40 + 20 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: color,
              opacity: 0.3,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        );
      })}

      {/* ===== ART SUPPLIES SCATTERED ===== */}
      {/* Paint tubes */}
      <div className="absolute bottom-20 right-16">
        <motion.div
          className="flex gap-1"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {['#ef4444', '#3b82f6', '#eab308', '#22c55e'].map((color, i) => (
            <motion.div
              key={`tube-${i}`}
              className="w-3 h-8 rounded-sm shadow-lg"
              style={{
                background: `linear-gradient(to bottom, ${color}, ${color}dd)`,
                boxShadow: `0 2px 8px ${color}66, inset 0 1px 2px rgba(255,255,255,0.3)`,
                transform: `rotate(${i * 5}deg)`,
              }}
              whileHover={{ scale: 1.2, y: -5 }}
            >
              {/* Cap */}
              <div className="w-full h-2 bg-gray-800 rounded-t-sm" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scattered pencils */}
      <div className="absolute top-32 right-24">
        <motion.div
          className="relative w-16 h-2"
          animate={{ rotate: [15, 18, 15] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="absolute w-full h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-md" />
          <div className="absolute right-0 w-3 h-2 bg-gradient-to-r from-amber-800 to-amber-900 rounded-r-full" />
          <div className="absolute right-0 w-1 h-2 bg-gray-800 rounded-r-full" />
        </motion.div>
      </div>

      {/* ===== INTERACTIVE CONTROL PANEL ===== */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 shadow-2xl border border-white/10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            className="p-2 rounded-full bg-purple-600/80 hover:bg-purple-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </motion.button>

          <motion.button
            className="p-2 rounded-full bg-pink-600/80 hover:bg-pink-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="w-4 h-4 text-white" />
          </motion.button>

          <div className="w-px h-6 bg-white/20" />

          <motion.button
            className="p-2 rounded-full bg-red-600/80 hover:bg-red-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-4 h-4 text-white" />
          </motion.button>

          <motion.button
            className="p-2 rounded-full bg-blue-600/80 hover:bg-blue-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-4 h-4 text-white" />
          </motion.button>

          <motion.button
            className="p-2 rounded-full bg-green-600/80 hover:bg-green-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* ===== AMBIENT LIGHT BULB ===== */}
      <div className="absolute top-8 right-1/3">
        <motion.div
          className="relative"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <Lightbulb
            className="w-8 h-8 text-yellow-300"
            style={{
              filter: 'drop-shadow(0 0 20px #fde047) drop-shadow(0 0 40px #facc15)',
            }}
          />
          {/* Light rays */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <motion.div
                key={`ray-${i}`}
                className="absolute top-1/2 left-1/2 w-1 h-8 bg-gradient-to-b from-yellow-300 to-transparent origin-top"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scaleY: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* ===== FLOATING PALETTE WITH PAINTS ===== */}
      <motion.div
        className="absolute top-1/2 left-1/4"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      >
        <div className="relative w-20 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl shadow-2xl"
          style={{
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
          }}
        >
          {/* Paint dabs */}
          {[
            { color: '#ef4444', x: '20%', y: '20%' },
            { color: '#3b82f6', x: '50%', y: '15%' },
            { color: '#eab308', x: '75%', y: '25%' },
            { color: '#22c55e', x: '30%', y: '55%' },
            { color: '#a855f7', x: '65%', y: '60%' },
            { color: '#f97316', x: '45%', y: '75%' },
          ].map((paint, i) => (
            <motion.div
              key={`paint-dab-${i}`}
              className="absolute w-4 h-4 rounded-full"
              style={{
                left: paint.x,
                top: paint.y,
                background: paint.color,
                boxShadow: `0 0 10px ${paint.color}, inset 0 1px 2px rgba(255,255,255,0.3)`,
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Thumb hole */}
          <div className="absolute bottom-1 right-2 w-5 h-6 rounded-full bg-black/50 shadow-inner" />
        </div>
      </motion.div>

      {/* ===== FLOOR REFLECTION ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* ===== DEPTH LAYERS - FOREGROUND PARTICLES ===== */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`foreground-${i}`}
          className="absolute rounded-full bg-white/10 blur-sm"
          style={{
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 200 + 100],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* ===== TITLE TEXT (OPTIONAL) ===== */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
        transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
      >
        <h1
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          style={{
            textShadow: '0 0 40px rgba(168, 85, 247, 0.5)',
          }}
        >
          Creative Studio
        </h1>
        <p className="text-sm text-purple-300/80 mt-2">Where Art Meets Music</p>
      </motion.div>

      {/* ===== RADIO/SPEAKER ===== */}
      <div className="absolute bottom-12 right-4">
        <motion.div
          className="relative w-12 h-10 bg-gradient-to-br from-gray-800 to-black rounded shadow-xl"
          animate={{
            boxShadow: isPlaying ? [
              '0 0 20px rgba(168, 85, 247, 0.5)',
              '0 0 30px rgba(236, 72, 153, 0.5)',
              '0 0 20px rgba(168, 85, 247, 0.5)',
            ] : '0 4px 10px rgba(0,0,0,0.5)',
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Radio className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
          {/* Speaker grille */}
          <div className="absolute bottom-1 left-1 right-1 flex gap-px">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-gray-700 rounded-full" />
            ))}
          </div>
          {/* Sound waves */}
          {isPlaying && [...Array(3)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute top-1/2 left-0 w-full h-full border-2 border-purple-400 rounded-sm"
              style={{ transformOrigin: 'center' }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
