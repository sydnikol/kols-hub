import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import ChronoMuseAvatar from '../components/chronomuse/ChronoMuseAvatar';
import LibraryRoom from '../components/chronomuse/rooms/LibraryRoom';
import StudioRoom from '../components/chronomuse/rooms/StudioRoom';
import SanctuaryRoom from '../components/chronomuse/rooms/SanctuaryRoom';
import ObservatoryRoom from '../components/chronomuse/rooms/ObservatoryRoom';
import ChronoMuseChat from '../components/chronomuse/ChronoMuseChat';
import RoomNavigator from '../components/chronomuse/RoomNavigator';
import EmotionalEngine from '../components/chronomuse/EmotionalEngine';
import ChronoJournal from '../components/chronomuse/ChronoJournal';
import TimePortal from '../components/chronomuse/TimePortal';
import NPCSummoner from '../components/chronomuse/NPCSummoner';
import CinematicControls from '../components/chronomuse/CinematicControls';
import SensoryControls from '../components/chronomuse/SensoryControls';
import { useChronoMuseStore } from '../store/chronoMuseStore';

type RoomType = 'library' | 'studio' | 'sanctuary' | 'observatory';
type MoodType = 'overwhelm' | 'curiosity' | 'grief' | 'focus' | 'victory' | 'calm';

export default function ChronoMusePage() {
  const [currentRoom, setCurrentRoom] = useState<RoomType>('observatory');
  const [showChat, setShowChat] = useState(true);
  const [showJournal, setShowJournal] = useState(false);
  const [showTimePortal, setShowTimePortal] = useState(false);
  const [showNPCSummoner, setShowNPCSummoner] = useState(false);
  
  const {
    currentMood,
    currentEra,
    lightingMode,
    musicPlaying,
    energyLevel,
    setCurrentMood,
    setLightingMode
  } = useChronoMuseStore();

  // Adaptive lighting based on mood
  useEffect(() => {
    const moodLighting: Record<MoodType, string> = {
      overwhelm: 'dim-silver-blue',
      curiosity: 'warm-candlelight',
      grief: 'rain-lit-blues',
      focus: 'monochrome-grayscale',
      victory: 'soft-gold-flecks',
      calm: 'velvet-shadows'
    };
    
    setLightingMode(moodLighting[currentMood] || 'velvet-shadows');
  }, [currentMood, setLightingMode]);

  // Room descriptions for luxury apartment feel
  const roomDescriptions = {
    library: "A velvet-dark archive where books float and eras glow. History bends for you here.",
    studio: "Your creative engine room. Moodboards, tools, and infinite possibility.",
    sanctuary: "A soft shadow-blue space. Weighted sound. Low-stim. Safety.",
    observatory: "Your time portal. Orbiting rings of eras. Constellations of history."
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0A0A0F] via-[#1A1A24] to-[#1A1A24]">
      {/* Ambient Background with Stars */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          <ambientLight intensity={0.3} />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Main Apartment View */}
      <div className="relative z-10 h-full flex">
        {/* Left Sidebar - Room Navigator */}
        <div className="w-20 bg-black/40 backdrop-blur-xl border-r border-[#C0C0D8]/20 flex flex-col items-center py-8 gap-6">
          <RoomNavigator 
            currentRoom={currentRoom} 
            onRoomChange={setCurrentRoom}
          />
          
          {/* Quick Actions */}
          <div className="mt-auto flex flex-col gap-4">
            <button
              onClick={() => setShowTimePortal(!showTimePortal)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A5DB8]/30 to-purple-900/30 hover:from-[#4A5DB8]/50 hover:to-purple-900/50 flex items-center justify-center transition-all border border-[#C0C0D8]/30"
              title="Time Portal"
            >
              <span className="text-2xl">🌀</span>
            </button>
            <button
              onClick={() => setShowNPCSummoner(!showNPCSummoner)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/30 to-pink-900/30 hover:from-purple-900/50 hover:to-pink-900/50 flex items-center justify-center transition-all border border-[#C0C0D8]/30"
              title="Summon NPC"
            >
              <span className="text-2xl">👤</span>
            </button>
            <button
              onClick={() => setShowJournal(!showJournal)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-900/30 to-blue-900/30 hover:from-indigo-900/50 hover:to-blue-900/50 flex items-center justify-center transition-all border border-[#C0C0D8]/30"
              title="ChronoJournal"
            >
              <span className="text-2xl">📖</span>
            </button>
          </div>
        </div>

        {/* Main Content Area - Current Room */}
        <div className="flex-1 relative">
          {/* Room Header */}
          <div className="absolute top-0 left-0 right-0 z-20 p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-[#C0C0D8]/30"
            >
              <h1 className="text-4xl font-bold text-[#C0C0D8] mb-2 tracking-wide">
                {currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}
              </h1>
              <p className="text-[#E8E8F4]/70 text-lg font-light italic">
                {roomDescriptions[currentRoom]}
              </p>
              
              {/* Current Era Badge */}
              {currentEra && (
                <div className="mt-4 inline-block px-4 py-2 bg-[#4A5DB8]/20 rounded-full border border-[#4A5DB8]/40">
                  <span className="text-[#C0C0D8] text-sm">📍 {currentEra}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* 3D Room Environment */}
          <div className="absolute inset-0 z-10">
            <AnimatePresence mode="wait">
              {currentRoom === 'library' && (
                <motion.div
                  key="library"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <LibraryRoom />
                </motion.div>
              )}
              
              {currentRoom === 'studio' && (
                <motion.div
                  key="studio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <StudioRoom />
                </motion.div>
              )}
              
              {currentRoom === 'sanctuary' && (
                <motion.div
                  key="sanctuary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <SanctuaryRoom />
                </motion.div>
              )}
              
              {currentRoom === 'observatory' && (
                <motion.div
                  key="observatory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <ObservatoryRoom />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ChronoMuse Avatar - Always Present */}
          <div className="absolute bottom-8 left-8 z-30">
            <ChronoMuseAvatar mood={currentMood} />
          </div>

          {/* Emotional Engine Display */}
          <div className="absolute top-32 right-8 z-20">
            <EmotionalEngine onMoodChange={setCurrentMood} />
          </div>

          {/* Cinematic Controls */}
          <div className="absolute bottom-8 right-8 z-30">
            <CinematicControls />
          </div>
        </div>

        {/* Right Sidebar - Chat Interface */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-black/60 backdrop-blur-xl border-l border-[#C0C0D8]/20"
            >
              <ChronoMuseChat currentRoom={currentRoom} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Overlays */}
      <AnimatePresence>
        {showJournal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <ChronoJournal onClose={() => setShowJournal(false)} />
          </motion.div>
        )}

        {showTimePortal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <TimePortal onClose={() => setShowTimePortal(false)} />
          </motion.div>
        )}

        {showNPCSummoner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <NPCSummoner onClose={() => setShowNPCSummoner(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sensory Controls - Bottom Right Corner */}
      <div className="fixed bottom-4 right-4 z-40">
        <SensoryControls />
      </div>

      {/* Toggle Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed top-4 right-4 z-40 px-4 py-2 bg-[#4A5DB8]/30 hover:bg-[#4A5DB8]/50 text-[#C0C0D8] rounded-full border border-[#C0C0D8]/30 transition-all backdrop-blur-xl"
      >
        {showChat ? 'Hide ChronoMuse' : 'Show ChronoMuse'}
      </button>
    </div>
  );
}
