import { motion } from 'framer-motion';
import { X, Calendar, Tag, Camera, Music } from 'lucide-react';
import { useChronoMuseStore } from '../../store/chronoMuseStore';

export default function ChronoJournal({ onClose }: { onClose: () => void }) {
  const { journalEntries } = useChronoMuseStore();

  return (
    <motion.div className="bg-[#0A0A0F]/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-[#C0C0D8]/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#C0C0D8]">ChronoJournal</h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#1A1A24]/60 hover:bg-[#1A1A24] flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-[#C0C0D8]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {journalEntries.length === 0 ? (
          <div className="text-center py-12 text-[#E8E8F4]/60">
            <p>Your journey begins now. Every moment will be captured here.</p>
          </div>
        ) : (
          journalEntries.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A24]/60 rounded-2xl p-6 border border-[#C0C0D8]/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#C0C0D8] mb-1">{entry.scene}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#E8E8F4]/60">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(entry.timestamp).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Tag className="w-4 h-4" />{entry.mood}</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-[#4A5DB8]/20 rounded-full text-xs text-[#4A5DB8]">{entry.lighting}</div>
              </div>

              {entry.insights && entry.insights.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-[#C0C0D8] mb-2">Insights:</p>
                  <ul className="space-y-1">
                    {entry.insights.map((insight, i) => (
                      <li key={i} className="text-sm text-[#E8E8F4]/70 pl-4 border-l-2 border-[#4A5DB8]/40">{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-[#E8E8F4]/50">
                {entry.music && <span className="flex items-center gap-1"><Music className="w-3 h-3" />{entry.music}</span>}
                {entry.avatarLook && <span>Avatar: {entry.avatarLook}</span>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
