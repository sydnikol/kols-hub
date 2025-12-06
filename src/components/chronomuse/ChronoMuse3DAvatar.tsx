import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReadyPlayerMeAvatar from '../ReadyPlayerMeAvatar';
import { useChronoMuseStore } from '../../store/chronoMuseStore';
import { Sparkles, Heart, Brain, Zap, Coffee, Moon } from 'lucide-react';

interface ChronoMuse3DAvatarProps {
  aiMessage?: string;
  userMessage?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
}

/**
 * 🤖✨ CHRONOMUSE 3D AVATAR
 * Your AI companion with a living, breathing 3D avatar
 * - Reacts to conversation mood
 * - Changes expression based on AI sentiment
 * - Animated responses to user input
 * - Synced with ChronoMuse emotional engine
 */
const ChronoMuse3DAvatar: React.FC<ChronoMuse3DAvatarProps> = ({
  aiMessage = '',
  userMessage = '',
  isListening = false,
  isSpeaking = false
}) => {
  const {
    currentMood,
    energyLevel,
    currentToneMode,
  } = useChronoMuseStore();

  // Map ChronoMuse mood to avatar expression
  const [avatarMood, setAvatarMood] = useState<'neutral' | 'happy' | 'excited' | 'thinking' | 'mysterious' | 'sad'>('neutral');
  const [avatarExpression, setAvatarExpression] = useState<string>('idle');

  useEffect(() => {
    // Map ChronoMuse moods to avatar moods
    const moodMap: Record<string, typeof avatarMood> = {
      'overwhelm': 'thinking',
      'curiosity': 'excited',
      'grief': 'sad',
      'focus': 'thinking',
      'victory': 'happy',
      'calm': 'neutral'
    };

    setAvatarMood(moodMap[currentMood] || 'neutral');
  }, [currentMood]);

  useEffect(() => {
    // React to AI speaking
    if (isSpeaking) {
      setAvatarExpression('talking');

      // Analyze sentiment of AI message
      if (aiMessage.includes('!') || aiMessage.includes('✨') || aiMessage.includes('🎉')) {
        setAvatarMood('excited');
      } else if (aiMessage.includes('?') || aiMessage.includes('curious')) {
        setAvatarMood('thinking');
      } else if (aiMessage.includes('sad') || aiMessage.includes('sorry')) {
        setAvatarMood('sad');
      }
    } else if (isListening) {
      setAvatarExpression('listening');
      setAvatarMood('thinking');
    } else {
      setAvatarExpression('idle');
    }
  }, [isSpeaking, isListening, aiMessage]);

  // Get current mood color
  const getMoodColor = () => {
    const moodColors: Record<string, string> = {
      'neutral': '#6633cc',
      'happy': '#aa44ff',
      'excited': '#ff00ff',
      'thinking': '#4400ff',
      'mysterious': '#8800ff',
      'sad': '#4444aa'
    };
    return moodColors[avatarMood] || '#6633cc';
  };

  // Get energy status icon
  const getEnergyIcon = () => {
    if (energyLevel > 70) return <Zap className="text-yellow-400" size={20} />;
    if (energyLevel > 40) return <Coffee className="text-orange-400" size={20} />;
    return <Moon className="text-blue-400" size={20} />;
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Avatar Display */}
      <div className="w-full h-full">
        <ReadyPlayerMeAvatar
          avatarUrl="https://models.readyplayer.me/68e94e474099d80b93c9b714.glb"
          mood={avatarMood}
          expression={avatarExpression}
          quality="high"
          enableRotation={true}
          enableZoom={false}
          showControls={false}
          backgroundColor="transparent"
          animationSpeed={isSpeaking ? 1.5 : 1}
        />
      </div>

      {/* Mood Indicator Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-2xl px-6 py-3 border-2 flex items-center gap-4"
        style={{ borderColor: getMoodColor() }}
      >
        {/* Current Mood */}
        <div className="flex items-center gap-2">
          <Heart size={18} style={{ color: getMoodColor() }} />
          <span className="text-white text-sm font-semibold capitalize">{avatarMood}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600" />

        {/* Energy Level */}
        <div className="flex items-center gap-2">
          {getEnergyIcon()}
          <span className="text-white text-sm">{energyLevel}%</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600" />

        {/* Tone Mode */}
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-purple-400" />
          <span className="text-white text-sm capitalize">{currentToneMode}</span>
        </div>

        {/* Status Indicator */}
        {isSpeaking && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex items-center gap-2"
          >
            <Sparkles size={18} className="text-yellow-400" />
            <span className="text-yellow-400 text-sm">Speaking...</span>
          </motion.div>
        )}

        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-green-400 text-sm">Listening...</span>
          </motion.div>
        )}
      </motion.div>

      {/* AI Message Display */}
      {isSpeaking && aiMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-4 left-4 right-4 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md rounded-xl p-4 border border-purple-500/30"
        >
          <p className="text-white text-sm italic">"{aiMessage.substring(0, 150)}{aiMessage.length > 150 ? '...' : ''}"</p>
        </motion.div>
      )}

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: getMoodColor(),
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChronoMuse3DAvatar;
