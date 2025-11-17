import { motion } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function SensoryControls() {
  const [expanded, setExpanded] = useState(false);
  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(50);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
      <button onClick={() => setExpanded(!expanded)} className="w-12 h-12 rounded-full bg-[#0A0A0F]/80 backdrop-blur-xl border border-[#C0C0D8]/20 flex items-center justify-center hover:bg-[#1A1A24] transition-all">
        <span className="text-xl">⚙️</span>
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full right-0 mb-2 bg-[#0A0A0F]/95 backdrop-blur-xl rounded-2xl p-4 border border-[#C0C0D8]/20 w-72">
          <h3 className="text-sm font-semibold text-[#C0C0D8] mb-4">Sensory Controls</h3>

          {/* Brightness */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-[#C0C0D8]" />
              <span className="text-xs text-[#E8E8F4]/70">Brightness: {brightness}%</span>
            </div>
            <input type="range" min="20" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-2 bg-[#1A1A24] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-[#4A5DB8] [&::-webkit-slider-thumb]:to-purple-600" />
          </div>

          {/* Volume */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {volume > 0 ? <Volume2 className="w-4 h-4 text-[#C0C0D8]" /> : <VolumeX className="w-4 h-4 text-[#C0C0D8]" />}
              <span className="text-xs text-[#E8E8F4]/70">Volume: {volume}%</span>
            </div>
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full h-2 bg-[#1A1A24] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-[#4A5DB8] [&::-webkit-slider-thumb]:to-purple-600" />
          </div>

          {/* Reduced Motion Toggle */}
          <button onClick={() => setReducedMotion(!reducedMotion)} className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1A1A24]/60 hover:bg-[#1A1A24] transition-all">
            <span className="text-sm text-[#C0C0D8]">Reduced Motion</span>
            <div className={`w-12 h-6 rounded-full transition-colors ${reducedMotion ? 'bg-[#4A5DB8]' : 'bg-[#1A1A24]'} relative`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
