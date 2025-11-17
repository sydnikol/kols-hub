import { motion } from 'framer-motion';
import { Book, Palette, Heart, Globe } from 'lucide-react';

interface RoomNavigatorProps {
  currentRoom: 'library' | 'studio' | 'sanctuary' | 'observatory';
  onRoomChange: (room: 'library' | 'studio' | 'sanctuary' | 'observatory') => void;
}

export default function RoomNavigator({ currentRoom, onRoomChange }: RoomNavigatorProps) {
  const rooms = [
    { id: 'library', icon: Book, label: 'Library', color: 'from-indigo-600 to-purple-600', description: 'Learning Space' },
    { id: 'studio', icon: Palette, label: 'Studio', color: 'from-purple-600 to-pink-600', description: 'Creative Engine' },
    { id: 'sanctuary', icon: Heart, label: 'Sanctuary', color: 'from-blue-600 to-indigo-600', description: 'Emotional Safety' },
    { id: 'observatory', icon: Globe, label: 'Observatory', color: 'from-cyan-600 to-blue-600', description: 'Time Portals' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {rooms.map((room) => {
        const Icon = room.icon;
        const isActive = currentRoom === room.id;
        
        return (
          <motion.button
            key={room.id}
            onClick={() => onRoomChange(room.id as any)}
            className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group ${isActive ? `bg-gradient-to-br ${room.color} shadow-lg` : 'bg-[#1A1A24]/60 hover:bg-[#1A1A24]/80'} border ${isActive ? 'border-[#C0C0D8]/60' : 'border-[#C0C0D8]/20'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-[#C0C0D8]/70 group-hover:text-[#C0C0D8]'} transition-colors`} />
            <div className="absolute left-full ml-4 px-3 py-2 bg-[#0A0A0F]/95 rounded-lg border border-[#C0C0D8]/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-xl">
              <p className="text-[#C0C0D8] text-sm font-medium">{room.label}</p>
              <p className="text-[#E8E8F4]/50 text-xs">{room.description}</p>
            </div>
            {isActive && (
              <motion.div layoutId="activeRoom" className="absolute inset-0 rounded-xl border-2 border-[#C0C0D8]/60" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
