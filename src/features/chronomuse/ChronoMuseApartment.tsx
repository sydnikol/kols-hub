import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Palette, Heart, Globe, User, Music, Camera, 
  Video, MessageCircle, Sparkles, Moon, Sun, Volume2, Settings,
  Clock, MapPin, Users, Mic, Image as ImageIcon, Film
} from 'lucide-react';

// Import room components
// TODO: Re-enable when files are created
// import { Library } from './rooms/Library';
// import { Studio } from './rooms/Studio';
// import { Sanctuary } from './rooms/Sanctuary';
// import { Observatory } from './rooms/Observatory';
// import { EducationHub } from '../education';

// Import ChronoMuse AI companion
// TODO: Re-enable when file is created
// import { ChronoMuseCompanion } from './companion/ChronoMuseCompanion';

// Import utility systems
// TODO: Re-enable when files are created
// import { ChronoJournal } from './systems/ChronoJournal';
// import { NPCSystem } from './systems/NPCSystem';
// import { CinematicEngine } from './systems/CinematicEngine';
// import { emotionalEngineRef.current } from './systems/EmotionalEngine';
// import { TasteMemory } from './systems/TasteMemory';

interface UserProfile {
  name: string;
  aesthetic: string[];
  sensoryNeeds: {
    lowStimLights: boolean;
    softTextures: boolean;
    noBrightColors: boolean;
    fatigueAware: boolean;
  };
  preferences: {
    lighting: string[];
    sound: string[];
    fonts: string[];
    textures: string[];
    forbidden: string[];
  };
  currentMood: 'overwhelm' | 'curiosity' | 'grief' | 'focus' | 'victory' | 'neutral';
  energyLevel: number;
  currentEra?: string;
}

type RoomType = 'Library' | 'Studio' | 'Sanctuary' | 'Observatory' | 'Education' | 'Apartment';

export const ChronoMuseApartment: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<RoomType>('Apartment');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Kol',
    aesthetic: ['dark velvet', 'modern noir', 'gothic', 'punk', 'afro-futurist'],
    sensoryNeeds: {
      lowStimLights: true,
      softTextures: true,
      noBrightColors: true,
      fatigueAware: true
    },
    preferences: {
      lighting: ['silver-blue', 'candlelight', 'grayscale'],
      sound: ['jazz', 'piano', 'lofi', 'rain', 'ambient'],
      fonts: ['gothic-serif', 'silver-script'],
      textures: ['velvet', 'matte black'],
      forbidden: ['pastels', 'girly-ui']
    },
    currentMood: 'neutral',
    energyLevel: 70
  });

  const [showCompanion, setShowCompanion] = useState(true);
  const [showJournal, setShowJournal] = useState(false);
  const [showNPCPanel, setShowNPCPanel] = useState(false);
  const [showCinematicControls, setShowCinematicControls] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<string>('ambient');
  const [lighting, setLighting] = useState<string>('silver-blue');

  // Emotional engine tracking
  const emotionalEngineRef = useRef<any>(null);

  useEffect(() => {
    // TODO: Initialize emotional tracking when EmotionalEngine class is implemented
    // emotionalEngineRef.current = new EmotionalEngine(userProfile);

    // Load saved profile from localStorage
    const savedProfile = localStorage.getItem('chronomuse-profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // return () => {
    //   // Cleanup
    //   if (emotionalEngineRef.current) {
    //     emotionalEngineRef.current.destroy();
    //   }
    // };
  }, []);

  // Save profile changes
  useEffect(() => {
    localStorage.setItem('chronomuse-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Dynamic lighting based on mood
  useEffect(() => {
    const moodLightingMap = {
      overwhelm: 'dim silver-blue',
      curiosity: 'warm candlelight',
      grief: 'rain-lit blues',
      focus: 'monochrome grayscale',
      victory: 'soft gold flecks',
      neutral: 'silver-blue'
    };
    setLighting(moodLightingMap[userProfile.currentMood]);
  }, [userProfile.currentMood]);

  const updateMood = (mood: UserProfile['currentMood']) => {
    setUserProfile(prev => ({ ...prev, currentMood: mood }));
  };

  const updateEnergy = (energy: number) => {
    setUserProfile(prev => ({ ...prev, energyLevel: energy }));
  };

  const enterRoom = (room: RoomType) => {
    setCurrentRoom(room);
    // Log room transition in journal
    if (window.chronoJournal) {
      window.chronoJournal.logEntry({
        type: 'room-transition',
        room,
        timestamp: new Date(),
        mood: userProfile.currentMood,
        energy: userProfile.energyLevel
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-gothic">
      {/* Dynamic Background with Lighting */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ${
          lighting.includes('silver-blue') ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950' :
          lighting.includes('candlelight') ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900' :
          lighting.includes('grayscale') ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' :
          lighting.includes('gold') ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-yellow-950' :
          'bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950'
        }`}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
          }}
        /> */
      </div>

      {/* Main Apartment View or Room View */}
      <AnimatePresence mode="wait">
        {currentRoom === 'Apartment' ? (
          <motion.div
            key="apartment-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full flex flex-col"
          >
            {/* Luxury Apartment Navigation */}
            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 p-8">
              {/* Education Hub - Top Left */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => enterRoom('Education')}
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border border-indigo-700/50 hover:border-indigo-500/70 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 70%)'
                  }}
                /> */
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                  <BookOpen className="w-20 h-20 text-indigo-400 mb-4" /> */
                  <h2 className="text-3xl font-bold text-white mb-2 font-gothic">Education Hub</h2>
                  <p className="text-indigo-300 text-center text-sm">Passive learning & resume building</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">College Credit</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Free</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">Low Pressure</span>
                  </div>
                </div>
              </motion.button>

              {/* Library - Top Middle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => enterRoom('Library')}
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)'
                  }}
                /> */
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                  <Users className="w-20 h-20 text-purple-400 mb-4" /> */
                  <h2 className="text-3xl font-bold text-white mb-2 font-gothic">The Library</h2>
                  <p className="text-slate-400 text-center text-sm">Research, history, & deep study</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Study</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">History</span>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">Theory</span>
                  </div>
                </div>
              </motion.button>

              {/* Studio - Top Right */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => enterRoom('Studio')}
                className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 70%)'
                  }}
                /> */
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                  <Palette className="w-20 h-20 text-pink-400 mb-4" /> */
                  <h2 className="text-3xl font-bold text-white mb-2 font-gothic">The Studio</h2>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
  
  export default ChronoMuseApartment;
