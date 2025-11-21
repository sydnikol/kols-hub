import { motion } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useChronoMuseStore } from '../../store/chronoMuseStore';
import { ancestryService } from '../../services/ancestryService';

const baseNPCLibrary = [
  { id: '1', name: 'Langston Hughes', type: 'historical', era: 'HarlemRenaissance1920', personality: 'Poetic, insightful, empathetic', category: 'Artist' },
  { id: '2', name: 'Audre Lorde', type: 'historical', era: 'QueerLiberation', personality: 'Powerful, direct, revolutionary', category: 'Activist' },
  { id: '3', name: 'James Baldwin', type: 'historical', era: 'QueerLiberation', personality: 'Thoughtful, eloquent, challenging', category: 'Writer' },
  { id: '4', name: 'Octavia Butler', type: 'historical', era: 'AfroFuturistAlt', personality: 'Visionary, patient, wise', category: 'Author' },
  { id: '5', name: 'Your Future Self', type: 'emotional', era: null, personality: 'Encouraging, knowing, protective', category: 'Guide' },
  { id: '6', name: 'Your Inner Child', type: 'emotional', era: null, personality: 'Playful, honest, vulnerable', category: 'Shadow Work' }
];

export default function NPCSummoner({ onClose }: { onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [npcLibrary, setNpcLibrary] = useState(baseNPCLibrary);
  const { addNPC, activeNPCs } = useChronoMuseStore();

  useEffect(() => {
    loadAncestors();
  }, []);

  const loadAncestors = async () => {
    const ancestorNPCs = await ancestryService.getAncestorsAsNPCs();
    setNpcLibrary([...baseNPCLibrary, ...ancestorNPCs]);
  };

  const categories = ['All', 'Historical', 'Emotional', 'Fictional', 'Ancestral'];

  const handleSummon = (npc: any) => {
    addNPC(npc);
    onClose();
  };

  const filteredNPCs = selectedCategory && selectedCategory !== 'All'
    ? npcLibrary.filter(npc => npc.type === selectedCategory.toLowerCase())
    : npcLibrary;

  return (
    <motion.div className="bg-[#0A0A0F]/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-[#C0C0D8]/30">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#C0C0D8] mb-2">👤 NPC Summoner</h2>
          <p className="text-sm text-[#E8E8F4]/60">Summon historical figures, ancestors, or emotional guides</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#1A1A24]/60 hover:bg-[#1A1A24] flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-[#C0C0D8]" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-gradient-to-br from-[#4A5DB8] to-purple-600 text-white' : 'bg-[#1A1A24]/40 text-[#C0C0D8] hover:bg-[#1A1A24]/60 border border-[#C0C0D8]/20'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* NPC Library */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {filteredNPCs.map((npc) => (
          <motion.div key={npc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A24]/60 rounded-2xl p-4 border border-[#C0C0D8]/20 hover:border-[#4A5DB8]/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#C0C0D8] mb-1">{npc.name}</h3>
                <p className="text-sm text-[#E8E8F4]/70 mb-2">{npc.personality}</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-[#4A5DB8]/20 rounded-full text-xs text-[#4A5DB8]">{npc.category}</span>
                  {npc.era && <span className="px-2 py-1 bg-purple-900/20 rounded-full text-xs text-purple-300">{npc.era}</span>}
                </div>
              </div>
              <button onClick={() => handleSummon(npc)} className="px-4 py-2 bg-gradient-to-br from-[#4A5DB8] to-purple-600 hover:from-[#4A5DB8]/80 hover:to-purple-600/80 rounded-xl text-sm font-medium text-white transition-all">
                Summon
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
