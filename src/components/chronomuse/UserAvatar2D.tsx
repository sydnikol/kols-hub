import { motion } from 'framer-motion';

export default function UserAvatar2D() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Character silhouette */}
      <div className="relative">
        {/* Aura glow */}
        <motion.div
          className="absolute inset-0 -m-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 109, 184, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* Floating ring */}
        <motion.div
          className="absolute inset-0 -m-12 rounded-full border-2 border-purple-400/30"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity },
          }}
        />

        {/* Character body */}
        <div className="relative z-10">
          {/* Head */}
          <motion.div
            className="w-20 h-20 rounded-full mx-auto mb-2"
            style={{
              background: 'linear-gradient(135deg, #C0C0D8 0%, #8B6DB8 100%)',
              boxShadow: '0 0 30px rgba(192, 192, 216, 0.6)',
            }}
            animate={{
              y: [-3, 3, -3],
              rotateY: [-5, 5, -5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Eyes */}
            <div className="flex justify-center items-center h-full gap-4 px-6">
              <motion.div
                className="w-4 h-4 rounded-full bg-yellow-400"
                style={{
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0,
                }}
              />
              <motion.div
                className="w-4 h-4 rounded-full bg-yellow-400"
                style={{
                  boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.1,
                }}
              />
            </div>
          </motion.div>

          {/* Body */}
          <motion.div
            className="w-16 h-24 mx-auto rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, #4A5DB8 0%, #6B5DB8 100%)',
            }}
            animate={{
              scaleY: [1, 1.03, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Arms */}
          <div className="absolute top-24 left-0 right-0 flex justify-between px-0">
            <motion.div
              className="w-4 h-16 rounded-full bg-gradient-to-b from-[#4A5DB8] to-[#6B5DB8]"
              style={{
                transformOrigin: 'top center',
              }}
              animate={{
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="w-4 h-16 rounded-full bg-gradient-to-b from-[#4A5DB8] to-[#6B5DB8]"
              style={{
                transformOrigin: 'top center',
              }}
              animate={{
                rotate: [5, -5, 5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            />
          </div>

          {/* Legs */}
          <div className="flex justify-center gap-2 mt-1">
            <div className="w-5 h-20 rounded-full bg-gradient-to-b from-[#6B5DB8] to-[#8B6DB8]" />
            <div className="w-5 h-20 rounded-full bg-gradient-to-b from-[#6B5DB8] to-[#8B6DB8]" />
          </div>
        </div>

        {/* Floating sparkles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-purple-300"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(192, 192, 216, 0.8)',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          );
        })}

        {/* Name tag */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 rounded-full border border-purple-400/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-purple-200 text-xs font-medium whitespace-nowrap">You</p>
        </motion.div>
      </div>
    </div>
  );
}
