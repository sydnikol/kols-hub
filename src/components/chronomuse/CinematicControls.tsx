import { motion } from 'framer-motion';
import { Camera, Video, Film, Download } from 'lucide-react';
import { useChronoMuseStore } from '../../store/chronoMuseStore';

export default function CinematicControls() {
  const { cinematicMode, recordingScene, toggleCinematicMode, toggleRecording } = useChronoMuseStore();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0A0A0F]/80 backdrop-blur-xl rounded-2xl p-4 border border-[#C0C0D8]/20 flex gap-3">
      <button onClick={toggleCinematicMode} className={`p-3 rounded-xl transition-all ${cinematicMode ? 'bg-gradient-to-br from-[#4A5DB8] to-purple-600 text-white' : 'bg-[#1A1A24]/60 text-[#C0C0D8] hover:bg-[#1A1A24]'}`} title="Cinematic Mode">
        <Film className="w-5 h-5" />
      </button>
      <button onClick={toggleRecording} className={`p-3 rounded-xl transition-all ${recordingScene ? 'bg-red-600 text-white animate-pulse' : 'bg-[#1A1A24]/60 text-[#C0C0D8] hover:bg-[#1A1A24]'}`} title={recordingScene ? 'Stop Recording' : 'Start Recording'}>
        <Video className="w-5 h-5" />
      </button>
      <button className="p-3 rounded-xl bg-[#1A1A24]/60 text-[#C0C0D8] hover:bg-[#1A1A24] transition-all" title="Capture Screenshot">
        <Camera className="w-5 h-5" />
      </button>
      <button className="p-3 rounded-xl bg-[#1A1A24]/60 text-[#C0C0D8] hover:bg-[#1A1A24] transition-all" title="Export Highlight Reel">
        <Download className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
