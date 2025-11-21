import { motion } from 'framer-motion';
import { Book, BookOpen, Sparkles, Moon, Star, Coffee, Lightbulb, Flame, Clock } from 'lucide-react';

export default function LibraryRoom2D() {
  const bookData = [
    { title: 'Codex Obscura', color: '#8B4513', glow: 'rgba(139, 69, 19, 0.4)', height: 24 },
    { title: 'Dark Grimoire', color: '#2F4F4F', glow: 'rgba(47, 79, 79, 0.4)', height: 20 },
    { title: 'Blood Chronicles', color: '#8B0000', glow: 'rgba(139, 0, 0, 0.6)', height: 28 },
    { title: 'Mystic Tome', color: '#4B0082', glow: 'rgba(75, 0, 130, 0.5)', height: 22 },
    { title: 'Herbal Codex', color: '#2E8B57', glow: 'rgba(46, 139, 87, 0.4)', height: 26 },
    { title: 'Alchemical Arts', color: '#8B6914', glow: 'rgba(139, 105, 20, 0.4)', height: 24 },
    { title: 'Prophecies', color: '#483D8B', glow: 'rgba(72, 61, 139, 0.5)', height: 23 },
    { title: 'Ritual Guide', color: '#8B1A1A', glow: 'rgba(139, 26, 26, 0.5)', height: 25 },
    { title: 'Nature Spirits', color: '#556B2F', glow: 'rgba(85, 107, 47, 0.4)', height: 21 },
    { title: 'Cosmic Lore', color: '#8B4789', glow: 'rgba(139, 71, 137, 0.5)', height: 27 },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Multi-layer background - Anime style depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0810] via-[#1A1425] to-[#12101C]" />

      {/* Distant stars layer */}
      <div className="absolute inset-0">
        {Array.from({ length: 120 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              background: `radial-gradient(circle, rgba(${200 + Math.random() * 55}, ${190 + Math.random() * 65}, ${220 + Math.random() * 35}, 0.9), transparent)`,
            }}
            animate={{
              opacity: [0.2, 0.9, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Nebula glow background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(139, 69, 255, 0.4), rgba(75, 0, 130, 0.2), transparent)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(192, 132, 252, 0.3), rgba(168, 85, 247, 0.2), transparent)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Gothic arched window with moonlight streaming */}
      <motion.div
        className="absolute top-12 right-8 w-36 h-56"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Window frame */}
        <div className="relative w-full h-full rounded-t-[70px] border-4 border-purple-950/80 bg-gradient-to-b from-indigo-950/20 to-purple-950/10 overflow-hidden">
          {/* Moonlight */}
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 1), rgba(220, 220, 255, 0.8) 40%, rgba(192, 192, 216, 0.3) 70%, transparent)',
              boxShadow: '0 0 60px rgba(255, 255, 255, 0.8), 0 0 100px rgba(192, 192, 216, 0.5)',
            }}
            animate={{
              scale: [0.95, 1.05, 0.95],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Light rays */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-full origin-top"
              style={{
                background: 'linear-gradient(to bottom, rgba(192, 192, 216, 0.6), transparent 70%)',
                rotate: `${(i - 2) * 10}deg`,
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Window panes */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-purple-950/60" />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-purple-950/60" />
          </div>
        </div>

        {/* Moonlight spillage on floor */}
        <motion.div
          className="absolute -bottom-32 -left-12 w-48 h-48 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(192, 192, 216, 0.2), transparent 70%)',
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </motion.div>

      {/* Left bookshelf - towering anime-style detail */}
      <div className="absolute left-2 top-8 bottom-8 w-24">
        {/* Shelf structure */}
        <div className="relative w-full h-full bg-gradient-to-br from-[#3A2820] via-[#2A1810] to-[#1A1010] rounded-r-lg border-r-2 border-amber-900/30">
          {/* Wood grain effect */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 69, 19, 0.3) 2px, rgba(139, 69, 19, 0.3) 4px)',
          }} />

          {/* Books */}
          <div className="relative h-full p-2 flex flex-col justify-around">
            {bookData.slice(0, 6).map((book, i) => (
              <motion.div
                key={`left-book-${i}`}
                className="relative rounded-sm cursor-pointer group"
                style={{
                  height: `${book.height}px`,
                  background: `linear-gradient(135deg, ${book.color} 0%, ${book.color}dd 50%, ${book.color}99 100%)`,
                  boxShadow: `
                    inset 3px 0 6px rgba(0, 0, 0, 0.4),
                    inset -1px 0 2px rgba(255, 255, 255, 0.1),
                    0 4px 12px ${book.glow},
                    0 0 20px ${book.glow}
                  `,
                }}
                whileHover={{
                  x: 6,
                  scale: 1.05,
                  boxShadow: `
                    inset 3px 0 6px rgba(0, 0, 0, 0.4),
                    inset -1px 0 2px rgba(255, 255, 255, 0.2),
                    0 8px 24px ${book.glow},
                    0 0 40px ${book.glow}
                  `,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Book spine */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/40 to-transparent" />

                {/* Title embossing */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-2/3 bg-white/10 rounded-full" />
                </div>

                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at center, ${book.glow}, transparent 70%)`,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Magical particles on hover */}
                {[...Array(3)].map((_, pi) => (
                  <motion.div
                    key={`particle-${pi}`}
                    className="absolute w-1 h-1 rounded-full bg-purple-300 opacity-0 group-hover:opacity-100"
                    style={{
                      left: `${20 + pi * 30}%`,
                      top: `${30 + pi * 20}%`,
                    }}
                    animate={{
                      y: [-5, -15, -5],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: pi * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </div>

          {/* Shelf shadows */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={`shadow-${i}`}
                className="absolute left-0 right-0 h-px bg-black/30"
                style={{ top: `${(i + 1) * 16}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right bookshelf - mirror of left */}
      <div className="absolute right-2 top-8 bottom-8 w-24">
        <div className="relative w-full h-full bg-gradient-to-bl from-[#3A2820] via-[#2A1810] to-[#1A1010] rounded-l-lg border-l-2 border-amber-900/30">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 69, 19, 0.3) 2px, rgba(139, 69, 19, 0.3) 4px)',
          }} />

          <div className="relative h-full p-2 flex flex-col justify-around">
            {bookData.slice(6).map((book, i) => (
              <motion.div
                key={`right-book-${i}`}
                className="relative rounded-sm cursor-pointer group"
                style={{
                  height: `${book.height}px`,
                  background: `linear-gradient(225deg, ${book.color} 0%, ${book.color}dd 50%, ${book.color}99 100%)`,
                  boxShadow: `
                    inset -3px 0 6px rgba(0, 0, 0, 0.4),
                    inset 1px 0 2px rgba(255, 255, 255, 0.1),
                    0 4px 12px ${book.glow},
                    0 0 20px ${book.glow}
                  `,
                }}
                whileHover={{
                  x: -6,
                  scale: 1.05,
                  boxShadow: `
                    inset -3px 0 6px rgba(0, 0, 0, 0.4),
                    inset 1px 0 2px rgba(255, 255, 255, 0.2),
                    0 8px 24px ${book.glow},
                    0 0 40px ${book.glow}
                  `,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-l from-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-2/3 bg-white/10 rounded-full" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at center, ${book.glow}, transparent 70%)`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Center reading area - anime detail level */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-72">
        {/* Ornate desk */}
        <div className="relative">
          {/* Desk surface with intricate details */}
          <div className="relative h-6 bg-gradient-to-b from-[#5A4A3A] via-[#4A3A2A] to-[#3A2A1A] rounded-lg border-2 border-amber-900/40">
            {/* Wood grain */}
            <div className="absolute inset-0 opacity-30 rounded-lg" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(139, 69, 19, 0.4) 8px, rgba(139, 69, 19, 0.4) 10px)',
            }} />
            {/* Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/10 to-transparent rounded-t-lg" />
          </div>

          {/* Open ancient book */}
          <motion.div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-44 h-28"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div
              className="relative w-full h-full rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d4b8 50%, #d4c4a8 100%)',
                boxShadow: `
                  0 10px 40px rgba(139, 109, 184, 0.4),
                  inset 0 2px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -2px 8px rgba(0, 0, 0, 0.2)
                `,
              }}
            >
              {/* Book spine/binding */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950" />
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-amber-950/60" />

              {/* Left page */}
              <div className="absolute left-2 top-2 right-1/2 bottom-2 pr-2">
                {/* Ornate border */}
                <div className="absolute inset-0 border border-amber-900/20 rounded-sm" />

                {/* Ancient text lines */}
                <div className="absolute inset-2 space-y-1.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={`left-line-${i}`} className="flex gap-0.5">
                      {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, wi) => (
                        <div
                          key={`word-${wi}`}
                          className="h-1 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-full"
                          style={{ width: `${30 + Math.random() * 40}%` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Decorative illuminated initial */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-sm border-2 border-purple-600/40 bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-purple-700/60" />
                </div>
              </div>

              {/* Right page */}
              <div className="absolute right-2 top-2 left-1/2 bottom-2 pl-2">
                <div className="absolute inset-0 border border-amber-900/20 rounded-sm" />
                <div className="absolute inset-2 space-y-1.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={`right-line-${i}`} className="flex gap-0.5">
                      {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, wi) => (
                        <div
                          key={`word-${wi}`}
                          className="h-1 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-full"
                          style={{ width: `${30 + Math.random() * 40}%` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Magical glowing bookmark */}
              <motion.div
                className="absolute -top-1 left-1/3 w-6 h-32 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.6))',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.3)',
                }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)',
                    '0 0 40px rgba(168, 85, 247, 1), inset 0 0 15px rgba(255, 255, 255, 0.5)',
                    '0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Page shadows for depth */}
              <div className="absolute right-1/2 top-1 bottom-1 w-2 bg-gradient-to-r from-transparent via-black/10 to-black/5" />
            </div>
          </motion.div>

          {/* Floating magical quill pen */}
          <motion.div
            className="absolute -top-12 right-12"
            animate={{
              y: [-8, 8, -8],
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              {/* Quill shaft */}
              <div className="w-1.5 h-20 bg-gradient-to-b from-purple-200 via-purple-400 to-purple-900 rounded-full relative">
                {/* Feather barbs */}
                <div className="absolute -left-3 top-2 w-10 h-12 border-l-4 border-t-4 border-purple-300/60 rounded-tl-full transform -rotate-45" style={{
                  borderTopColor: 'transparent',
                  borderLeftColor: 'rgba(216, 180, 254, 0.6)',
                }} />
                <div className="absolute -left-2 top-4 w-8 h-10 border-l-3 border-t-3 border-purple-400/40 rounded-tl-full transform -rotate-45" />

                {/* Magical glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(192, 132, 252, 0.6)',
                      '0 0 30px rgba(192, 132, 252, 1)',
                      '0 0 15px rgba(192, 132, 252, 0.6)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Ink droplet */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-900"
                  animate={{
                    scale: [0, 1, 0],
                    y: [0, 10, 20],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Steaming coffee/tea cup */}
          <motion.div
            className="absolute -top-8 left-8"
            whileHover={{ scale: 1.1 }}
          >
            <div className="relative w-10 h-12 bg-gradient-to-b from-amber-900 via-amber-950 to-black rounded-b-xl border-2 border-amber-800/60">
              {/* Coffee surface */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-t-lg overflow-hidden">
                {/* Surface reflection */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-20, 40] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              {/* Cup handle */}
              <div className="absolute -right-3 top-3 w-4 h-5 border-2 border-amber-800/80 rounded-r-full" />

              {/* Steam wisps - anime style */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`steam-${i}`}
                  className="absolute -top-12 left-1/2 -translate-x-1/2"
                  animate={{
                    y: [-20, -35],
                    x: [(i - 1.5) * 4, (i - 1.5) * 8],
                    opacity: [0, 0.7, 0],
                    scale: [0.5, 1, 1.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <div className="w-3 h-8 rounded-full bg-gradient-to-t from-purple-200/40 via-purple-100/30 to-transparent blur-sm" />
                </motion.div>
              ))}

              {/* Cup shine */}
              <div className="absolute top-2 left-1 w-1 h-4 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
            </div>
          </motion.div>

          {/* Candelabra with animated flames */}
          <motion.div
            className="absolute -top-16 right-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {/* Candle stick */}
            <div className="relative w-3 h-16 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 rounded-lg">
              {/* Wax drips */}
              <div className="absolute -left-0.5 top-4 w-1 h-8 bg-gradient-to-b from-amber-200/80 to-transparent rounded-full" />
              <div className="absolute -right-0.5 top-6 w-1 h-6 bg-gradient-to-b from-amber-200/80 to-transparent rounded-full" />

              {/* Flame */}
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2"
                animate={{
                  scaleY: [1, 1.2, 0.9, 1],
                  scaleX: [1, 0.9, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Outer flame */}
                <div className="relative w-6 h-10">
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500 via-orange-400 to-yellow-300 rounded-[50%] blur-sm opacity-80" />
                  <div className="absolute inset-1 bg-gradient-to-t from-orange-400 via-yellow-400 to-yellow-200 rounded-[50%]" />
                  <div className="absolute inset-2 bg-gradient-to-t from-yellow-200 to-white rounded-[50%] blur-[2px]" />
                </div>

                {/* Flame glow */}
                <motion.div
                  className="absolute inset-0 rounded-[50%]"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.4)',
                      '0 0 30px rgba(251, 146, 60, 1), 0 0 60px rgba(251, 146, 60, 0.6)',
                      '0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.4)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating knowledge orbs - enhanced */}
      {[
        { left: '20%', top: '25%', size: 16, color: 'rgba(139, 109, 184, 0.6)', delay: 0 },
        { left: '80%', top: '30%', size: 20, color: 'rgba(168, 85, 247, 0.5)', delay: 1 },
        { left: '50%', top: '20%', size: 14, color: 'rgba(192, 132, 252, 0.6)', delay: 2 },
        { left: '30%', top: '50%', size: 12, color: 'rgba(147, 51, 234, 0.5)', delay: 1.5 },
        { left: '70%', top: '55%', size: 18, color: 'rgba(126, 34, 206, 0.5)', delay: 0.5 },
      ].map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${orb.color} 40%, transparent 70%)`,
            boxShadow: `
              0 0 30px ${orb.color},
              inset 0 0 15px rgba(255, 255, 255, 0.3)
            `,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            scale: [1, 1.15, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        >
          {/* Inner sparkle */}
          <motion.div
            className="absolute inset-2 rounded-full bg-white/40 blur-sm"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: orb.delay + 0.5,
            }}
          />
        </motion.div>
      ))}

      {/* Magical particle system */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${180 + Math.random() * 75}, ${150 + Math.random() * 105}, ${220 + Math.random() * 35}, 0.8)`,
            boxShadow: `0 0 ${4 + Math.random() * 6}px rgba(192, 132, 252, 0.8)`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40],
            x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Title overlay with anime-style presentation */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="relative inline-block"
          animate={{
            textShadow: [
              '0 0 20px rgba(192, 192, 216, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)',
              '0 0 30px rgba(192, 192, 216, 1), 0 0 60px rgba(168, 85, 247, 0.7)',
              '0 0 20px rgba(192, 192, 216, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-8 h-8 text-purple-300" />
            </motion.div>
            <h2 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200">
              Library of Eras
            </h2>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Book className="w-8 h-8 text-purple-300" />
            </motion.div>
          </div>
          <p className="text-sm text-purple-300/90 max-w-xs mx-auto leading-relaxed backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg">
            Where ancient wisdom meets eternal knowledge. Touch the tomes to unveil their secrets.
          </p>
        </motion.div>
      </motion.div>

      {/* Interactive action buttons - anime style */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        <motion.button
          className="group relative px-6 py-3 overflow-hidden rounded-xl font-medium text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-400/50 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 border-2 border-purple-400/30 rounded-xl" />
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0)',
                '0 0 40px rgba(168, 85, 247, 0.6)',
                '0 0 20px rgba(168, 85, 247, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="relative flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Browse Archives
          </span>
        </motion.button>

        <motion.button
          className="group relative px-6 py-3 overflow-hidden rounded-xl font-medium text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-700 to-red-800" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-400/50 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 border-2 border-amber-400/30 rounded-xl" />
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            animate={{
              boxShadow: [
                '0 0 20px rgba(251, 146, 60, 0)',
                '0 0 40px rgba(251, 146, 60, 0.6)',
                '0 0 20px rgba(251, 146, 60, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="relative flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Seek Wisdom
          </span>
        </motion.button>
      </div>

      {/* Atmospheric vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Corner accent lights */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-48 bg-purple-500/5 rounded-br-full blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-tl-full blur-3xl"
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          delay: 3,
        }}
      />
    </div>
  );
}
