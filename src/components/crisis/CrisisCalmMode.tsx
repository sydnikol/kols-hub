import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, Users, X, Volume2, VolumeX, PlayCircle } from 'lucide-react';

interface CalmScript {
  id: string;
  text: string;
  duration: number; // seconds
}

const calmScripts: CalmScript[] = [
  { id: '1', text: 'You are safe right now.', duration: 4 },
  { id: '2', text: 'This feeling will pass.', duration: 4 },
  { id: '3', text: 'Breathe in... 1... 2... 3... 4...', duration: 5 },
  { id: '4', text: 'Hold... 1... 2... 3... 4...', duration: 5 },
  { id: '5', text: 'Breathe out... 1... 2... 3... 4... 5... 6...', duration: 7 },
  { id: '6', text: 'You are doing your best.', duration: 4 },
  { id: '7', text: 'Your feelings are valid.', duration: 4 },
  { id: '8', text: 'Focus on what you can see around you.', duration: 5 },
  { id: '9', text: 'Feel your feet on the ground.', duration: 4 },
  { id: '10', text: 'You have survived hard things before.', duration: 5 },
  { id: '11', text: 'Breathe in... 1... 2... 3... 4...', duration: 5 },
  { id: '12', text: 'Breathe out... 1... 2... 3... 4... 5... 6...', duration: 7 },
  { id: '13', text: 'You are allowed to rest.', duration: 4 },
  { id: '14', text: 'Help is available if you need it.', duration: 4 },
  { id: '15', text: 'This moment is temporary.', duration: 4 },
];

const CrisisCalmMode: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentScriptIndex, setCurrentScriptIndex] = useState<number>(0);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Emergency contacts
  const emergencyContacts = [
    { name: '911', number: '911', type: 'emergency' },
    { name: 'Crisis Line', number: '988', type: 'crisis' },
    { name: 'Partner', number: '', type: 'personal' },
  ];

  useEffect(() => {
    if (!isActive) return;

    const script = calmScripts[currentScriptIndex];
    const timer = setTimeout(() => {
      const nextIndex = currentScriptIndex + 1;
      if (nextIndex < calmScripts.length) {
        setCurrentScriptIndex(nextIndex);
      } else if (isLooping) {
        setCurrentScriptIndex(0);
      }
    }, script.duration * 1000);

    return () => clearTimeout(timer);
  }, [isActive, currentScriptIndex, isLooping]);

  const startCalmMode = () => {
    setIsActive(true);
    setCurrentScriptIndex(0);
  };

  const stopCalmMode = () => {
    setIsActive(false);
    setCurrentScriptIndex(0);
  };

  const handleCall = (number: string) => {
    if (number) {
      window.location.href = `tel:${number}`;
    }
  };

  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Crisis Calm Mode</h2>
        </div>

        <p className="text-purple-300 mb-6">
          A fullscreen guided breathing and grounding experience with slow, calming text.
        </p>

        <motion.button
          onClick={startCalmMode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3 text-lg"
        >
          <PlayCircle className="w-6 h-6" />
          Enter Calm Mode
        </motion.button>

        <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-300 text-sm">
            <span className="font-bold">What happens in Calm Mode:</span>
            <ul className="mt-2 space-y-1 ml-4">
              <li>• Fullscreen calming interface</li>
              <li>• Slow-reveal affirmations and breathing cues</li>
              <li>• One-tap emergency contacts</li>
              <li>• Minimal stimulation, maximum support</li>
            </ul>
          </p>
        </div>
      </motion.div>
    );
  }

  const currentScript = calmScripts[currentScriptIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex flex-col items-center justify-center p-8"
    >
      {/* Exit Button */}
      <button
        onClick={stopCalmMode}
        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Exit calm mode"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Sound Toggle */}
      <button
        onClick={() => setIsSoundOn(!isSoundOn)}
        className="absolute top-4 left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        aria-label="Toggle sound"
      >
        {isSoundOn ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          {/* Breathing Circle */}
          <div className="relative w-48 h-48 mx-auto mb-12">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-4 border-purple-400/30"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-400/10 to-indigo-400/10 border-2 border-purple-400/20"
            />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-purple-300/5 to-indigo-300/5" />
          </div>

          {/* Calm Text - Animated Fade In */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScript.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-3xl md:text-5xl font-light text-white leading-relaxed"
            >
              {currentScript.text}
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="mt-12 flex items-center justify-center gap-2">
            {calmScripts.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === currentScriptIndex
                    ? 'w-8 bg-purple-400'
                    : idx < currentScriptIndex
                    ? 'w-2 bg-purple-600'
                    : 'w-2 bg-purple-900'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts Bar */}
      <div className="w-full max-w-2xl pb-8">
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold">Emergency Contacts</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {emergencyContacts.map((contact) => (
              <motion.button
                key={contact.name}
                onClick={() => handleCall(contact.number)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg font-bold transition-all ${
                  contact.type === 'emergency'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : contact.type === 'crisis'
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
                disabled={!contact.number}
              >
                <div className="flex items-center justify-center gap-2">
                  {contact.type === 'personal' ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                  <span>{contact.name}</span>
                </div>
                {contact.number && (
                  <div className="text-xs mt-1 opacity-80">{contact.number}</div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default CrisisCalmMode;
