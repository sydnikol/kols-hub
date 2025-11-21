import { motion } from 'framer-motion';
import {
  Eye,
  Moon,
  Star,
  Sparkles,
  Coffee,
  BookOpen,
  Circle,
  Orbit,
  Zap,
  Eye
} from 'lucide-react';

export default function ObservatoryRoom2D() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Deep Space Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0015] via-[#150A2E] to-[#0D0520]" />

      {/* Nebula Clouds - Multiple Layers */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-purple-900/30 via-indigo-900/20 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-blue-900/25 via-cyan-900/15 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-radial from-pink-900/20 via-purple-900/15 to-transparent rounded-full blur-3xl"
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Galaxy Spiral Effect */}
      <div className="absolute top-1/4 right-1/4 w-48 h-48">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={`galaxy-${i}`}
            className="absolute inset-0 rounded-full border border-blue-400/20"
            style={{
              width: `${100 - i * 15}%`,
              height: `${100 - i * 15}%`,
              left: `${i * 7.5}%`,
              top: `${i * 7.5}%`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 40 + i * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-4 h-4 bg-white rounded-full blur-sm shadow-[0_0_20px_#fff,0_0_40px_#4AE]" />
        </motion.div>
      </div>

      {/* Star Layers - Multiple Depths */}
      {/* Far Stars - Small and Dim */}
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={`far-star-${i}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.3,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Mid Stars - Medium Size */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={`mid-star-${i}`}
          className="absolute w-1 h-1 bg-blue-100 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5 + Math.random() * 0.3,
            boxShadow: '0 0 2px rgba(255,255,255,0.8)',
          }}
          animate={{
            opacity: [0.5, 0.9, 0.5],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1.5 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Close Stars - Large and Bright */}
      {Array.from({ length: 30 }).map((_, i) => {
        const colors = ['#FFFFFF', '#AACCFF', '#FFDDAA', '#FFAACC', '#CCAAFF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={`close-star-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: color,
              boxShadow: `0 0 4px ${color}, 0 0 8px ${color}`,
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 1 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        );
      })}

      {/* Meteor Shower Effects */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`meteor-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: '-5%',
          }}
          animate={{
            x: [0, -100 - Math.random() * 50],
            y: [0, 150 + Math.random() * 100],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random() * 1,
            repeat: Infinity,
            delay: i * 2 + Math.random() * 3,
            ease: "easeIn",
          }}
        >
          <div className="absolute w-16 h-0.5 bg-gradient-to-r from-white via-blue-300 to-transparent -rotate-45 blur-sm" />
        </motion.div>
      ))}

      {/* Comets with Glowing Tails */}
      {[0, 1].map((i) => (
        <motion.div
          key={`comet-${i}`}
          className="absolute"
          style={{
            left: i === 0 ? '80%' : '20%',
            top: i === 0 ? '15%' : '70%',
          }}
          animate={{
            x: i === 0 ? [0, -200] : [0, 200],
            y: i === 0 ? [0, 100] : [0, -100],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: i * 7,
            ease: "linear",
          }}
        >
          <div className="relative">
            <div className="w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_#4AE,0_0_20px_#4AE]" />
            <motion.div
              className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent blur-sm opacity-70"
              style={{ transformOrigin: 'left center' }}
              animate={{ scaleX: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      ))}

      {/* Aurora Borealis in Distance */}
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`aurora-${i}`}
            className="absolute bottom-0 w-full h-48 opacity-20"
            style={{
              background: `linear-gradient(to top, transparent, ${
                i === 0 ? '#00FF88' : i === 1 ? '#00DDFF' : '#AA88FF'
              }, transparent)`,
              filter: 'blur(20px)',
            }}
            animate={{
              x: ['-20%', '20%', '-20%'],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Floor/Platform */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent via-[#1A1A3A]/80 to-[#0A0A20]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMDAsMTAwLDIwMCwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      </div>

      {/* Large Telescope - Left Side */}
      <motion.div
        className="absolute left-8 bottom-24 z-20"
        animate={{
          rotate: [0, -2, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Telescope Base */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border border-gray-600 shadow-lg" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-20 h-6 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 rounded-full relative"
              style={{ transform: 'rotate(-45deg)' }}
            >
              {/* Telescope Lens */}
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-radial from-blue-400 to-blue-900 rounded-full border-2 border-gray-400 shadow-[0_0_10px_rgba(100,150,255,0.5)]" />
              {/* Eyepiece */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full border border-gray-600" />
              {/* Details */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gray-800 rounded-full" />
            </motion.div>
          </div>
          {/* Tripod Legs */}
          <div className="absolute top-10 left-6 w-0.5 h-8 bg-gray-700 rotate-12" />
          <div className="absolute top-10 left-6 w-0.5 h-8 bg-gray-700 -rotate-12" />
        </div>

        {/* Telescope Icon Decoration */}
        <motion.div
          className="absolute -top-8 left-0"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Eye className="w-6 h-6 text-blue-400" />
        </motion.div>
      </motion.div>

      {/* Planets Display - Right Side */}
      <div className="absolute right-8 top-16 space-y-8 z-20">
        {/* Jupiter */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -5, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 via-amber-400 to-orange-500 shadow-[0_0_20px_rgba(251,146,60,0.6)]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" style={{ top: '40%', height: '20%' }} />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-orange-700/20 to-transparent" style={{ top: '60%', height: '15%' }} />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-300/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Saturn with Rings */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -8, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-14 h-14 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-400 shadow-[0_0_15px_rgba(252,211,77,0.6)]" />
            {/* Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 border-2 border-amber-400/60 rounded-full" style={{ transform: 'translate(-50%, -50%) rotateX(75deg)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-5 border-2 border-yellow-300/40 rounded-full" style={{ transform: 'translate(-50%, -50%) rotateX(75deg)' }} />
          </div>
        </motion.div>

        {/* Mars */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -6, 0],
            rotate: [0, 15, 0],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-orange-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]">
            <div className="absolute w-1.5 h-1.5 bg-red-700 rounded-full top-2 left-2" />
            <div className="absolute w-1 h-1 bg-red-800 rounded-full top-4 left-5" />
          </div>
        </motion.div>
      </div>

      {/* Orrery (Planetary Model) - Center Bottom */}
      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 w-32 h-32 z-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {/* Central Sun */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.8)]" />

        {/* Orbit Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-400/20 rounded-full"
            style={{
              width: `${i * 30}px`,
              height: `${i * 30}px`,
            }}
          />
        ))}

        {/* Orbiting Planets */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`orbit-planet-${i}`}
            className="absolute top-1/2 left-1/2"
            style={{ width: `${i * 30}px`, height: `${i * 30}px` }}
            animate={{ rotate: -360 }}
            transition={{ duration: 30 / i, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: `${6 - i}px`,
                height: `${6 - i}px`,
                backgroundColor: i === 1 ? '#60A5FA' : i === 2 ? '#34D399' : '#F472B6',
                boxShadow: `0 0 8px ${i === 1 ? '#60A5FA' : i === 2 ? '#34D399' : '#F472B6'}`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Star Charts on Walls - Left */}
      <motion.div
        className="absolute left-4 top-20 w-24 h-32 bg-gray-900/60 border border-gray-700 rounded-lg p-2 backdrop-blur-sm z-10"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-[8px] text-gray-400 mb-1 font-mono">CHART-A47</div>
        {/* Constellation Lines */}
        <svg viewBox="0 0 80 100" className="w-full h-full">
          {/* Stars */}
          <circle cx="20" cy="20" r="2" fill="#FFF" opacity="0.8" />
          <circle cx="40" cy="15" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="60" cy="25" r="2" fill="#FFF" opacity="0.8" />
          <circle cx="30" cy="45" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="50" cy="50" r="2" fill="#FFF" opacity="0.8" />
          <circle cx="35" cy="70" r="1.5" fill="#FFF" opacity="0.8" />
          {/* Connecting Lines */}
          <line x1="20" y1="20" x2="40" y2="15" stroke="#4AE" strokeWidth="0.5" opacity="0.5" />
          <line x1="40" y1="15" x2="60" y2="25" stroke="#4AE" strokeWidth="0.5" opacity="0.5" />
          <line x1="20" y1="20" x2="30" y2="45" stroke="#4AE" strokeWidth="0.5" opacity="0.5" />
          <line x1="60" y1="25" x2="50" y2="50" stroke="#4AE" strokeWidth="0.5" opacity="0.5" />
          <line x1="30" y1="45" x2="35" y2="70" stroke="#4AE" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Star Charts on Walls - Right */}
      <motion.div
        className="absolute right-4 top-48 w-24 h-32 bg-gray-900/60 border border-gray-700 rounded-lg p-2 backdrop-blur-sm z-10"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-[8px] text-gray-400 mb-1 font-mono">CHART-B23</div>
        <svg viewBox="0 0 80 100" className="w-full h-full">
          <circle cx="25" cy="30" r="2" fill="#FFF" opacity="0.8" />
          <circle cx="55" cy="30" r="2" fill="#FFF" opacity="0.8" />
          <circle cx="40" cy="50" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="25" cy="70" r="2" fill="#FFF" opacity="0.8" />
          <circle cx="55" cy="70" r="2" fill="#FFF" opacity="0.8" />
          <line x1="25" y1="30" x2="55" y2="30" stroke="#A4E" strokeWidth="0.5" opacity="0.5" />
          <line x1="25" y1="30" x2="40" y2="50" stroke="#A4E" strokeWidth="0.5" opacity="0.5" />
          <line x1="55" y1="30" x2="40" y2="50" stroke="#A4E" strokeWidth="0.5" opacity="0.5" />
          <line x1="40" y1="50" x2="25" y2="70" stroke="#A4E" strokeWidth="0.5" opacity="0.5" />
          <line x1="40" y1="50" x2="55" y2="70" stroke="#A4E" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Moon Phases Display - Top Left */}
      <div className="absolute top-4 left-4 flex space-x-2 z-20">
        {[0, 0.25, 0.5, 0.75, 1].map((phase, i) => (
          <motion.div
            key={`moon-${i}`}
            className="w-6 h-6 rounded-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(to right, #E5E7EB 50%, #1F2937 50%)',
              transform: `scaleX(${1 - Math.abs(phase - 0.5) * 2})`,
            }}
            whileHover={{ scale: 1.2 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            <div className="absolute inset-0 bg-gray-200 rounded-full shadow-inner" />
            <div
              className="absolute inset-0 bg-gray-800 rounded-full"
              style={{
                width: '50%',
                left: phase < 0.5 ? '0%' : '50%',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Zodiac Wheel - Top Center */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 z-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative w-full h-full">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 shadow-[0_0_15px_rgba(192,132,252,0.3)]" />
          <div className="absolute inset-2 rounded-full border border-purple-500/30" />

          {/* Zodiac Symbols */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 50 + Math.cos(angle) * 35;
            const y = 50 + Math.sin(angle) * 35;
            return (
              <motion.div
                key={`zodiac-${i}`}
                className="absolute w-2 h-2 bg-purple-300 rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            );
          })}

          {/* Center Star */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
        </div>
      </motion.div>

      {/* Crystal Ball / Scrying Orb - Center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-32 h-32">
          {/* Orb Stand */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-purple-900 to-purple-950 rounded-b-full border-t border-purple-700" />

          {/* Crystal Ball */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-radial from-blue-300/40 via-purple-400/30 to-transparent backdrop-blur-md border border-purple-300/30"
            style={{
              boxShadow: '0 0 30px rgba(147,51,234,0.4), inset 0 0 20px rgba(255,255,255,0.2)',
            }}
          >
            {/* Inner Swirling Effect */}
            <motion.div
              className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-500/30 blur-sm"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Mystical Symbols Inside */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Eye className="w-8 h-8 text-purple-200/60" />
            </motion.div>
          </motion.div>

          {/* Glow Effect */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-purple-400/20 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Floating Holographic Star Projections */}
      {Array.from({ length: 6 }).map((_, i) => {
        const positions = [
          { x: '20%', y: '30%' },
          { x: '80%', y: '40%' },
          { x: '15%', y: '60%' },
          { x: '85%', y: '65%' },
          { x: '30%', y: '25%' },
          { x: '70%', y: '55%' },
        ];
        return (
          <motion.div
            key={`holo-star-${i}`}
            className="absolute z-10"
            style={{
              left: positions[i].x,
              top: positions[i].y,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <Star className="w-6 h-6 text-cyan-300 fill-cyan-300/40" />
              <motion.div
                className="absolute inset-0 blur-md"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Black Hole Effect - Bottom Right */}
      <motion.div
        className="absolute bottom-40 right-12 w-20 h-20 z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Event Horizon Rings */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={`blackhole-ring-${i}`}
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid rgba(139, 92, 246, ${0.4 - i * 0.08})`,
              width: `${100 - i * 15}%`,
              height: `${100 - i * 15}%`,
              left: `${i * 7.5}%`,
              top: `${i * 7.5}%`,
            }}
            animate={{
              scale: [1, 0.8, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Black Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full shadow-[0_0_20px_rgba(139,92,246,0.8),inset_0_0_10px_rgba(0,0,0,1)]" />

        {/* Accretion Disk */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-purple-400 rounded-full blur-sm" />
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full blur-sm" />
          <div className="absolute left-0 top-1/2 w-1 h-1 bg-violet-400 rounded-full blur-sm" />
          <div className="absolute right-0 top-1/2 w-1 h-1 bg-indigo-400 rounded-full blur-sm" />
        </motion.div>
      </motion.div>

      {/* Interactive Constellation Buttons - Left Side */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-4 z-20">
        {['Orion', 'Ursa', 'Lyra'].map((constellation, i) => (
          <motion.button
            key={constellation}
            className="px-3 py-1.5 bg-indigo-900/60 border border-indigo-500/40 rounded-full text-xs text-indigo-200 backdrop-blur-sm hover:bg-indigo-800/70 hover:border-indigo-400/60 transition-all"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 5px rgba(99,102,241,0.3)',
                '0 0 15px rgba(99,102,241,0.6)',
                '0 0 5px rgba(99,102,241,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>{constellation}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Coffee/Tea for Stargazing - Bottom Left */}
      <motion.div
        className="absolute bottom-8 left-12 z-20"
        animate={{
          y: [0, -3, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          {/* Cup */}
          <div className="w-10 h-12 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg border border-gray-600 relative">
            {/* Liquid */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-lg" />
            {/* Handle */}
            <div className="absolute right-0 top-2 w-3 h-6 border-2 border-gray-700 rounded-r-full" />
          </div>
          {/* Steam */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`steam-${i}`}
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-400/40 rounded-full blur-sm"
              animate={{
                y: [-10, -20],
                opacity: [0.6, 0],
                x: [0, i % 2 === 0 ? 5 : -5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
          <Coffee className="absolute -top-8 left-1/2 -translate-x-1/2 w-5 h-5 text-amber-400 opacity-70" />
        </div>
      </motion.div>

      {/* Notebook with Observations - Bottom Right */}
      <motion.div
        className="absolute bottom-8 right-12 z-20"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <div className="relative w-16 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-r border-l-4 border-gray-900 shadow-lg">
          {/* Pages */}
          <div className="absolute inset-1 bg-gray-100 rounded-r">
            {/* Writing Lines */}
            <div className="p-1 space-y-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-0.5 bg-blue-300/30 rounded" style={{ width: `${Math.random() * 40 + 50}%` }} />
              ))}
            </div>
            {/* Star Sketch */}
            <div className="absolute bottom-2 right-2">
              <Star className="w-4 h-4 text-blue-400 fill-blue-200/30" />
            </div>
          </div>
          {/* Bookmark */}
          <div className="absolute top-0 right-2 w-1 h-8 bg-purple-500" />
        </div>
        <BookOpen className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 text-purple-400 opacity-70" />
      </motion.div>

      {/* Orbital Rings Decoration */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`orbital-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10 pointer-events-none"
          style={{
            width: `${i * 25}%`,
            height: `${i * 25}%`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Wormhole Effect - Center Left */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-16 h-16 z-5"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={`wormhole-${i}`}
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid rgba(34, 211, 238, ${0.3 - i * 0.04})`,
              width: `${100 - i * 12}%`,
              height: `${100 - i * 12}%`,
              left: `${i * 6}%`,
              top: `${i * 6}%`,
            }}
            animate={{
              scale: [1, 0.7, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-sm shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
      </motion.div>

      {/* Additional Sparkle Effects */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full z-5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Constellation Connector Lines - Decorative */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" style={{ opacity: 0.3 }}>
        <defs>
          <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#A78BFA', stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
        <motion.line
          x1="20%" y1="25%" x2="35%" y2="35%"
          stroke="url(#constellation-gradient)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.line
          x1="70%" y1="30%" x2="85%" y2="45%"
          stroke="url(#constellation-gradient)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        />
      </svg>

      {/* Pulsing Ambient Light */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Title Overlay */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
        <motion.h2
          className="text-3xl font-serif text-purple-100 mb-1"
          style={{ textShadow: '0 0 20px rgba(192,132,252,0.8), 0 0 40px rgba(139,92,246,0.4)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Observatory
        </motion.h2>
        <motion.p
          className="text-sm text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Explore the Cosmic Depths
        </motion.p>
      </div>

      {/* Shooting Star Trails */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`trail-${i}`}
          className="absolute w-0.5 h-20 bg-gradient-to-b from-white via-blue-300 to-transparent blur-sm"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: '-10%',
            rotate: '45deg',
          }}
          animate={{
            y: ['0vh', '120vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 3 + Math.random() * 4,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Cosmic Dust Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-0.5 h-0.5 bg-purple-300/40 rounded-full blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 30 - 15],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Energy Particles around Crystal Ball */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        return (
          <motion.div
            key={`energy-${i}`}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full z-25"
            animate={{
              x: [
                -Math.cos(angle) * 60,
                -Math.cos(angle) * 80,
                -Math.cos(angle) * 60,
              ],
              y: [
                -Math.sin(angle) * 60,
                -Math.sin(angle) * 80,
                -Math.sin(angle) * 60,
              ],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Orbit Icon Decoration */}
      <motion.div
        className="absolute bottom-36 left-1/2 -translate-x-1/2 opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Orbit className="w-8 h-8 text-blue-400" />
      </motion.div>

      {/* Lightning/Energy Zaps */}
      {[0, 1].map((i) => (
        <motion.div
          key={`zap-${i}`}
          className="absolute z-15"
          style={{
            left: i === 0 ? '30%' : '65%',
            top: i === 0 ? '45%' : '55%',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3 + i * 2,
            delay: i * 1.5,
          }}
        >
          <Zap className="w-4 h-4 text-cyan-400 fill-cyan-300" />
        </motion.div>
      ))}

      {/* Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-purple-950/30 via-blue-950/20 to-transparent pointer-events-none" />
    </div>
  );
}
