import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useChronoMuseStore } from '../../store/chronoMuseStore';

const eras = [
  { id: 'HarlemRenaissance1920', name: 'Harlem Renaissance 1920s', color: '#C0C0D8', description: 'Grayscale gothic jazz lounge', icon: '🎷' },
  { id: 'NubiaAncient', name: 'Ancient Nubia & Kemet', color: '#D4AF37', description: 'Gold accents on charcoal stone', icon: '🏛️' },
  { id: 'EdoJapan', name: 'Edo Japan', color: '#8B6DB8', description: 'Ink-brush aesthetic', icon: '🏮' },
  { id: 'CyberSeoul2088', name: 'Cyber Seoul 2088', color: '#4A5DB8', description: 'Neon + metallics', icon: '🌃' },
  { id: 'AfroFuturistAlt', name: 'Afro-Futurist Timeline', color: '#6B5DB8', description: 'Speculative futures', icon: '🚀' },
  { id: 'QueerLiberation', name: 'Queer Liberation Era', color: '#C0A0D8', description: 'Revolutionary movements', icon: '🏳️‍🌈' }
];

export default function TimePortal({ onClose }: { onClose: () => void }) {
  const { currentEra, setCurrentEra, addJournalEntry } = useChronoMuseStore();

  const handleEraSelect = (eraId: string) => {
    setCurrentEra(eraId as any);
    addJournalEntry({
      scene: `Time Portal`,
      lighting: 'silver-orbits',
      mood: 'curiosity',
      music: 'ambient-time-travel',
      insights: [`Traveled to ${eras.find(e => e.id === eraId)?.name}`],
      avatarLook: 'time-traveler',
      emotionalTags: ['curious', 'adventurous']
    });
    onClose();
  };

  return (
    <motion.div className="bg-[#0A0A0F]/95 backdrop-blur-xl rounded-3xl p-8 max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-[#C0C0D8]/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#C0C0D8]">🌀 Time Portal</h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#1A1A24]/60 hover:bg-[#1A1A24] flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-[#C0C0D8]" />
        </button>
      </div>

      <p className="text-[#E8E8F4]/70 mb-8">Select an era to travel to. Your environment, lighting, and ChronoMuse's voice will adapt.</p>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {eras.map((era) => (
          <motion.button
            key={era.id}
            onClick={() => handleEraSelect(era.id)}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${currentEra === era.id ? `border-[${era.color}] bg-gradient-to-br from-[${era.color}]/20 to-[${era.color}]/10` : 'border-[#C0C0D8]/20 bg-[#1A1A24]/40 hover:bg-[#1A1A24]/60'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-4xl mb-3">{era.icon}</div>
            <h3 className="text-lg font-semibold text-[#C0C0D8] mb-2">{era.name}</h3>
            <p className="text-sm text-[#E8E8F4]/60">{era.description}</p>
            {currentEra === era.id && (
              <div className="mt-4 text-xs text-[#4A5DB8] font-medium">✓ Currently Active</div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
