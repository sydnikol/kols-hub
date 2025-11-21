import { motion } from 'framer-motion';
import { Sparkles, Circle, Star, Moon, Sun, Flame } from 'lucide-react';
import { useState } from 'react';

export default function SanctuaryRoom2D() {
  const [isMeditating, setIsMeditating] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(0);

  // Generate star positions for constellation patterns
  const constellations = Array.from({ length: 80 }).map((_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));

  // Sacred symbols
  const sacredSymbols = ['ॐ', '☯', '☮', '☸', '✡', '☪'];

  // Energy particles
  const energyParticles = Array.from({ length: 40 }).map((_, i) => ({
    delay: i * 0.1,
    duration: Math.random() * 8 + 6,
  }));

  // Floating crystals
  const crystals = Array.from({ length: 8 });

  // Candles in sacred geometry (circle of 6)
  const candles = Array.from({ length: 6 });

  // Prayer flags
  const prayerFlags = Array.from({ length: 7 });

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#0A0520] via-[#1A0F35] to-[#0D0820]">
      {/* ========== LAYER 1: STARFIELD BACKGROUND ========== */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1A0F35]/50 via-[#0A0520]/80 to-[#000000]" />

        {/* Constellation stars */}
        {constellations.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8)`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}

        {/* Nebula clouds */}
        <motion.div
          className="absolute top-0 right-0 w-[60%] h-[50%] bg-gradient-radial from-purple-600/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[50%] h-[40%] bg-gradient-radial from-indigo-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      {/* ========== LAYER 2: STAINED GLASS WINDOW ========== */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-40">
        <motion.div
          className="relative w-full h-full"
          animate={{
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        >
          {/* Window frame */}
          <div className="absolute inset-0 border-2 border-amber-900/60 rounded-t-full bg-gradient-to-b from-purple-500/20 via-blue-500/20 to-cyan-500/20 backdrop-blur-sm">
            {/* Colored glass segments */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-purple-400/30 to-purple-600/20 rounded-tl-full" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-400/30 to-blue-600/20 rounded-tr-full" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-cyan-400/30 to-cyan-600/20" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-pink-400/30 to-pink-600/20" />

            {/* Window dividers */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-900/40" />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-900/40" />

            {/* Central mandala */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300/50 to-amber-500/50"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 4, repeat: Infinity },
                }}
              >
                <div className="absolute inset-1 rounded-full border border-amber-300/50" />
                <div className="absolute inset-2 rounded-full border border-amber-200/30" />
              </motion.div>
            </div>
          </div>

          {/* Light rays from window */}
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 w-40 h-64 bg-gradient-to-b from-purple-400/10 via-blue-400/5 to-transparent"
            style={{
              clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>

      {/* ========== LAYER 3: PRAYER FLAGS ========== */}
      <div className="absolute top-12 left-0 right-0 flex justify-between px-4">
        {prayerFlags.map((_, i) => (
          <motion.div
            key={`flag-${i}`}
            className="relative"
            animate={{
              y: [0, -3, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <div
              className="w-8 h-10 border border-white/20"
              style={{
                background: [
                  'rgba(255, 100, 100, 0.3)',
                  'rgba(100, 255, 100, 0.3)',
                  'rgba(255, 255, 100, 0.3)',
                  'rgba(100, 100, 255, 0.3)',
                  'rgba(255, 100, 255, 0.3)',
                  'rgba(100, 255, 255, 0.3)',
                  'rgba(255, 255, 255, 0.3)',
                ][i],
              }}
            >
              {/* Sacred symbols on flags */}
              <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs">
                {sacredSymbols[i % sacredSymbols.length]}
              </div>
            </div>
            {/* String */}
            <div className="absolute -top-4 left-1/2 w-px h-4 bg-white/20" />
          </motion.div>
        ))}
      </div>

      {/* ========== LAYER 4: BONSAI TREE (Left Corner) ========== */}
      <div className="absolute bottom-16 left-4 w-20 h-24">
        {/* Pot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-amber-900/60 to-amber-950/80 rounded-b-lg border border-amber-700/40">
          <div className="absolute top-1 left-2 right-2 h-0.5 bg-amber-700/30 rounded" />
        </div>

        {/* Trunk */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2 h-10 bg-gradient-to-b from-amber-800/70 to-amber-900/80 rounded-t" />

        {/* Branches with leaves */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        >
          {/* Left branch */}
          <div className="absolute top-0 -left-6 w-6 h-8 bg-gradient-to-br from-green-600/50 to-green-800/60 rounded-full blur-[1px]" />
          {/* Right branch */}
          <div className="absolute top-2 left-2 w-7 h-9 bg-gradient-to-bl from-green-500/50 to-green-700/60 rounded-full blur-[1px]" />
          {/* Top branch */}
          <div className="absolute -top-4 left-0 w-8 h-10 bg-gradient-to-b from-green-400/50 to-green-600/60 rounded-full blur-[1px]" />
        </motion.div>
      </div>

      {/* ========== LAYER 5: WATER FOUNTAIN (Right Corner) ========== */}
      <div className="absolute bottom-16 right-4 w-20 h-20">
        {/* Basin */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-6 bg-gradient-to-b from-cyan-900/40 to-cyan-950/60 rounded-full border border-cyan-700/30">
          {/* Water surface */}
          <motion.div
            className="absolute top-1 inset-x-2 h-2 bg-gradient-to-b from-cyan-400/30 to-cyan-600/20 rounded-full"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>

        {/* Water drops */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`drop-${i}`}
            className="absolute left-1/2 w-1 h-2 bg-cyan-300/60 rounded-full"
            style={{
              left: `calc(50% + ${(i - 1) * 4}px)`,
            }}
            animate={{
              y: [-15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* ========== LAYER 6: FLOATING CRYSTALS ========== */}
      <div className="absolute inset-0">
        {crystals.map((_, i) => {
          const angle = (i / crystals.length) * Math.PI * 2;
          const radius = 35;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;

          return (
            <motion.div
              key={`crystal-${i}`}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                y: { duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                delay: i * 0.4,
              }}
            >
              {/* Crystal with rainbow refraction */}
              <div className="relative w-8 h-12">
                {/* Rainbow glow */}
                <motion.div
                  className="absolute inset-0 blur-xl"
                  animate={{
                    background: [
                      'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)',
                      'radial-gradient(circle, rgba(255,127,0,0.3) 0%, transparent 70%)',
                      'radial-gradient(circle, rgba(255,255,0,0.3) 0%, transparent 70%)',
                      'radial-gradient(circle, rgba(0,255,0,0.3) 0%, transparent 70%)',
                      'radial-gradient(circle, rgba(0,0,255,0.3) 0%, transparent 70%)',
                      'radial-gradient(circle, rgba(139,0,255,0.3) 0%, transparent 70%)',
                      'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)',
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />

                {/* Crystal shape */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/40 via-cyan-200/30 to-purple-200/30 backdrop-blur-sm"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%)',
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Internal facets */}
                  <div className="absolute top-1/3 left-1/4 right-1/4 bottom-1/3 bg-white/20" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ========== LAYER 7: CENTRAL MEDITATION AREA ========== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center">
        {/* Sacred geometry floor pattern */}
        <motion.div
          className="absolute w-64 h-64"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Flower of Life pattern */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 30;
            const y = Math.sin(angle) * 30;

            return (
              <div
                key={`geometry-${i}`}
                className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-purple-400/20 rounded-full"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              />
            );
          })}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-purple-400/20 rounded-full" />
        </motion.div>

        {/* Meditation cushion/mat */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: isMeditating ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 4,
            repeat: isMeditating ? Infinity : 0,
          }}
        >
          {/* Mat base */}
          <div className="relative w-40 h-40">
            {/* Outer rim with intricate pattern */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900/60 to-amber-950/80 border-2 border-amber-700/40">
              {/* Pattern circles */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const x = 50 + Math.cos(angle) * 40;
                const y = 50 + Math.sin(angle) * 40;

                return (
                  <div
                    key={`pattern-${i}`}
                    className="absolute w-3 h-3 rounded-full bg-amber-600/30 border border-amber-500/30"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
            </div>

            {/* Inner cushion */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-900/50 to-purple-900/50 border border-red-700/30">
              {/* Center mandala */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-4xl"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <span className="text-amber-300/70 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                  ॐ
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========== LAYER 8: CANDLES IN SACRED GEOMETRY ========== */}
      <div className="absolute inset-0 flex items-center justify-center">
        {candles.map((_, i) => {
          const angle = (i / candles.length) * Math.PI * 2;
          const radius = 42;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;

          return (
            <div
              key={`candle-${i}`}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Candle body */}
              <div className="relative w-3 h-10 bg-gradient-to-b from-amber-100/80 to-amber-200/90 rounded-sm">
                {/* Wax drip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-amber-100/70 rounded-b" />
              </div>

              {/* Flame */}
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-8"
                animate={{
                  scaleY: [1, 1.2, 1],
                  scaleX: [1, 0.9, 1],
                }}
                transition={{
                  duration: 1.5 + i * 0.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 via-yellow-400/60 to-transparent rounded-full blur-md" />

                {/* Inner flame */}
                <div
                  className="absolute inset-1 bg-gradient-to-t from-orange-400 via-yellow-300 to-yellow-100 rounded-full"
                  style={{
                    clipPath: 'polygon(50% 0%, 80% 40%, 70% 100%, 30% 100%, 20% 40%)',
                  }}
                />

                {/* Core */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-yellow-100 rounded-full" />
              </motion.div>

              {/* Light radius */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ========== LAYER 9: INCENSE BURNER ========== */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
        {/* Burner */}
        <div className="relative w-8 h-4 bg-gradient-to-b from-gray-700/60 to-gray-800/80 rounded-full border border-gray-600/40">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500/80 rounded-full blur-[1px]" />
        </div>

        {/* Mystical smoke */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`smoke-${i}`}
            className="absolute left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-t from-purple-400/40 via-blue-300/20 to-transparent rounded-full blur-md"
            initial={{ y: 0, opacity: 0, scaleX: 0.5 }}
            animate={{
              y: -60,
              opacity: [0, 0.6, 0],
              scaleX: [0.5, 1.5, 2],
              x: [0, 10, -10, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* ========== LAYER 10: SINGING BOWLS ========== */}
      {[
        { left: '15%', bottom: '25%' },
        { right: '15%', bottom: '25%' },
      ].map((pos, i) => (
        <motion.div
          key={`bowl-${i}`}
          className="absolute"
          style={pos}
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 2,
          }}
        >
          {/* Bowl */}
          <div className="relative w-12 h-6">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-700/70 to-yellow-900/80 rounded-full border-2 border-yellow-600/50">
              <div className="absolute top-1 inset-x-2 h-1 bg-yellow-600/30 rounded-full" />
            </div>

            {/* Sound waves */}
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-16 border-2 border-yellow-400/30 rounded-full"
              animate={{
                scale: [0.5, 2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* ========== LAYER 11: HANGING PRAYER BEADS/MALA ========== */}
      <div className="absolute top-20 right-8">
        <motion.div
          animate={{
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          {/* String */}
          <div className="w-px h-16 bg-amber-700/40 mx-auto" />

          {/* Beads in circle */}
          <div className="relative w-12 h-12">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * 45;
              const y = 50 + Math.sin(angle) * 45;

              return (
                <div
                  key={`bead-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-amber-600/80 to-red-800/80 border border-amber-500/40"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              );
            })}

            {/* Guru bead (larger) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-3 h-3 rounded-full bg-gradient-to-br from-red-600/90 to-red-900/90 border border-red-500/50" />
          </div>
        </motion.div>
      </div>

      {/* ========== LAYER 12: FLOATING SACRED SYMBOLS ========== */}
      <div className="absolute inset-0">
        {sacredSymbols.map((symbol, i) => {
          const positions = [
            { left: '10%', top: '20%' },
            { right: '10%', top: '30%' },
            { left: '15%', bottom: '30%' },
            { right: '12%', bottom: '35%' },
            { left: '8%', top: '50%' },
            { right: '8%', top: '60%' },
          ];

          return (
            <motion.div
              key={`symbol-${i}`}
              className="absolute text-3xl"
              style={positions[i]}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                y: { duration: 4 + i * 0.5, repeat: Infinity },
                rotate: { duration: 20 + i * 2, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 3 + i * 0.3, repeat: Infinity },
                delay: i * 0.5,
              }}
            >
              <span
                className="text-purple-300/60"
                style={{
                  textShadow: '0 0 20px rgba(216, 180, 254, 0.5)',
                }}
              >
                {symbol}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ========== LAYER 13: CHI/ENERGY PARTICLES ========== */}
      <div className="absolute inset-0 overflow-hidden">
        {energyParticles.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              background: [
                'rgba(255, 200, 255, 0.6)',
                'rgba(200, 200, 255, 0.6)',
                'rgba(200, 255, 255, 0.6)',
                'rgba(255, 255, 200, 0.6)',
              ][i % 4],
              boxShadow: '0 0 4px currentColor',
            }}
            animate={{
              y: [0, -window.innerHeight],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* ========== LAYER 14: MAGICAL ENERGY ORBS ========== */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0, -20, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          >
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 w-12 h-12 rounded-full blur-xl"
              style={{
                background: [
                  'radial-gradient(circle, rgba(255, 100, 255, 0.4) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(100, 255, 200, 0.4) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(255, 255, 100, 0.4) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(255, 150, 100, 0.4) 0%, transparent 70%)',
                ][i],
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />

            {/* Inner orb */}
            <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-white/40 to-purple-300/40 backdrop-blur-sm border border-white/20" />
          </motion.div>
        ))}
      </div>

      {/* ========== LAYER 15: AMBIENT GLOW & ATMOSPHERE ========== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft ambient pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-950/10 to-black/30" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
      </div>

      {/* ========== LAYER 16: SPARKLES & MAGIC DUST ========== */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          <Sparkles className="w-2 h-2 text-purple-300/60" />
        </motion.div>
      ))}

      {/* ========== LAYER 17: INTERACTIVE MEDITATION BUTTONS ========== */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <motion.button
          onClick={() => setIsMeditating(!isMeditating)}
          className="px-6 py-3 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-md rounded-full border border-purple-500/30 text-purple-200 text-sm font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            {isMeditating ? 'End Meditation' : 'Begin Meditation'}
          </div>
        </motion.button>

        <motion.button
          onClick={() => setEnergyLevel((prev) => (prev + 1) % 4)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-900/80 to-teal-900/80 backdrop-blur-md rounded-full border border-cyan-500/30 text-cyan-200 text-sm font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Energy Level: {energyLevel}
          </div>
        </motion.button>
      </div>

      {/* ========== LAYER 18: MEDITATION STATE EFFECTS ========== */}
      {isMeditating && (
        <>
          {/* Expanding consciousness ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-purple-400/30 rounded-full"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: ['0px', '400px'],
              height: ['0px', '400px'],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          {/* Inner peace aura */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-cyan-400/20 via-purple-400/10 to-transparent rounded-full blur-2xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />
        </>
      )}

      {/* ========== LAYER 19: ENERGY LEVEL EFFECTS ========== */}
      {energyLevel > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: energyLevel * 10 }).map((_, i) => (
            <motion.div
              key={`energy-${i}`}
              className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-cyan-400/60"
              initial={{ y: 0, x: 0, opacity: 0 }}
              animate={{
                y: -window.innerHeight,
                x: (Math.random() - 0.5) * 200,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* ========== LAYER 20: ROOM TITLE & INFO ========== */}
      <div className="absolute top-8 left-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-serif text-purple-200 mb-1" style={{ textShadow: '0 0 20px rgba(216, 180, 254, 0.6)' }}>
            Sacred Sanctuary
          </h2>
          <p className="text-sm text-purple-300/70">Find peace within the cosmic temple</p>
        </motion.div>
      </div>

      {/* ========== LAYER 21: MYSTICAL MOON ========== */}
      <motion.div
        className="absolute top-20 right-12"
        animate={{
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      >
        <div className="relative w-16 h-16">
          {/* Moon glow */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/40 via-yellow-300/20 to-transparent rounded-full blur-xl" />

          {/* Moon body */}
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-100/80 to-yellow-300/60 rounded-full border border-yellow-200/40">
            {/* Craters */}
            <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-yellow-400/30" />
            <div className="absolute bottom-3 right-2 w-1.5 h-1.5 rounded-full bg-yellow-400/30" />
            <div className="absolute top-1/2 left-2 w-1 h-1 rounded-full bg-yellow-400/30" />
          </div>
        </div>
      </motion.div>

      {/* ========== LAYER 22: LOTUS FLOWERS (Corners) ========== */}
      {[
        { bottom: '10%', left: '8%' },
        { bottom: '12%', right: '8%' },
      ].map((pos, i) => (
        <motion.div
          key={`lotus-${i}`}
          className="absolute"
          style={pos}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 2,
          }}
        >
          {/* Lotus petals */}
          <div className="relative w-12 h-12">
            {Array.from({ length: 8 }).map((_, j) => {
              const angle = (j / 8) * Math.PI * 2;
              const x = Math.cos(angle) * 8;
              const y = Math.sin(angle) * 8;

              return (
                <div
                  key={`petal-${j}`}
                  className="absolute top-1/2 left-1/2 w-6 h-8 bg-gradient-to-t from-pink-400/40 to-pink-200/60 rounded-full"
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}rad)`,
                  }}
                />
              );
            })}

            {/* Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300/70 to-yellow-500/70" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
