import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Moon,
  Sun,
  Wind,
  Eye,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Volume2,
  ChevronDown,
  Check,
  History,
  X,
  Star,
} from 'lucide-react';

// Types
interface MeditationSession {
  id: string;
  type: 'breathing' | 'body-scan' | 'visualization' | 'loving-kindness' | 'grounding';
  duration: number; // in minutes
  completedAt: string;
  notes?: string;
}

interface MeditationType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  instructions: string[];
}

// Meditation Types
const meditationTypes: MeditationType[] = [
  {
    id: 'breathing',
    name: 'Breath Awareness',
    description: 'Focus on the rhythm of your breath, letting thoughts pass like clouds',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-violet-600 to-purple-700',
    instructions: [
      'Find a comfortable seated position',
      'Close your eyes gently',
      'Breathe naturally, noticing each inhale and exhale',
      'When thoughts arise, acknowledge them and return to breath',
      'Feel the air entering through your nose, filling your lungs',
      'Notice the gentle pause between breaths',
    ],
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Travel through your body, releasing tension from each part',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-rose-600 to-pink-700',
    instructions: [
      'Lie down or sit comfortably',
      'Start at the crown of your head',
      'Slowly move attention down through your body',
      'Notice any tension or sensation without judgment',
      'Imagine each area softening as you focus on it',
      'End at your toes, feeling fully relaxed',
    ],
  },
  {
    id: 'visualization',
    name: 'Gothic Sanctuary',
    description: 'Enter your mystical inner sanctuary, a place of dark beauty and peace',
    icon: <Moon className="w-6 h-6" />,
    color: 'from-indigo-600 to-slate-800',
    instructions: [
      'Close your eyes and take three deep breaths',
      'Imagine walking through an ancient stone archway',
      'Enter a moonlit garden with silver flowers',
      'Feel the cool night air on your skin',
      'A velvet throne awaits you among the roses',
      'Sit and absorb the peaceful darkness around you',
    ],
  },
  {
    id: 'loving-kindness',
    name: 'Loving Kindness',
    description: 'Send waves of compassion to yourself and others',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-amber-600 to-orange-700',
    instructions: [
      'Sit comfortably and breathe deeply',
      'Place your hand on your heart',
      'Repeat: "May I be safe, may I be happy, may I be healthy"',
      'Extend this wish to someone you love',
      'Expand to include all beings in the world',
      'Feel the warmth spreading from your heart',
    ],
  },
  {
    id: 'grounding',
    name: 'Earth Grounding',
    description: 'Connect with the ancient energy of the earth beneath you',
    icon: <Sun className="w-6 h-6" />,
    color: 'from-emerald-600 to-teal-700',
    instructions: [
      'Stand or sit with feet flat on the floor',
      'Imagine roots growing from your feet into the earth',
      'Feel the solid support beneath you',
      'Draw up energy from the earth into your body',
      'Let this energy fill you with stability and calm',
      'You are connected to something ancient and powerful',
    ],
  },
];

const sessionDurations = [5, 10, 15, 30];

const MeditationCenter: React.FC = () => {
  const [selectedType, setSelectedType] = useState<MeditationType>(meditationTypes[0]);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('meditation-sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('meditation-sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  // Step progression
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = (selectedDuration * 60) / selectedType.instructions.length;
      const elapsed = selectedDuration * 60 - timeRemaining;
      const newStep = Math.min(
        Math.floor(elapsed / stepDuration),
        selectedType.instructions.length - 1
      );
      setCurrentStep(newStep);
    }
  }, [timeRemaining, isPlaying, selectedDuration, selectedType]);

  const handleSessionComplete = useCallback(() => {
    setIsPlaying(false);

    // Play completion sound
    if (soundEnabled) {
      playCompletionSound();
    }

    // Save session
    const newSession: MeditationSession = {
      id: Date.now().toString(),
      type: selectedType.id as any,
      duration: selectedDuration,
      completedAt: new Date().toISOString(),
      notes: sessionNotes || undefined,
    };

    setSessions((prev) => [newSession, ...prev].slice(0, 100));
    setSessionNotes('');
  }, [selectedType, selectedDuration, sessionNotes, soundEnabled]);

  const playCompletionSound = () => {
    // Create a gentle bell sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(528, audioContext.currentTime); // Solfeggio frequency
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 3);
    } catch (e) {
      console.log('Audio not available');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isPlaying && timeRemaining === 0) {
      setTimeRemaining(selectedDuration * 60);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeRemaining(selectedDuration * 60);
    setCurrentStep(0);
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration * 60);
    setCurrentStep(0);
  };

  const handleTypeChange = (type: MeditationType) => {
    setSelectedType(type);
    setCurrentStep(0);
    setShowTypeDropdown(false);
    if (!isPlaying) {
      setTimeRemaining(selectedDuration * 60);
    }
  };

  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const thisWeekSessions = sessions.filter((s) => {
      const sessionDate = new Date(s.completedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate > weekAgo;
    }).length;
    return { totalSessions, totalMinutes, thisWeekSessions };
  };

  const stats = getSessionStats();
  const progress = ((selectedDuration * 60 - timeRemaining) / (selectedDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white p-4 md:p-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Meditation Center
            </h1>
            <Eye className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-gray-400 text-lg">Enter the stillness within the shadows</p>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalSessions}</div>
            <div className="text-xs text-gray-500">Total Sessions</div>
          </div>
          <div className="h-12 w-px bg-purple-800/50" />
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-400">{stats.totalMinutes}</div>
            <div className="text-xs text-gray-500">Minutes Meditated</div>
          </div>
          <div className="h-12 w-px bg-purple-800/50" />
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{stats.thisWeekSessions}</div>
            <div className="text-xs text-gray-500">This Week</div>
          </div>
        </div>

        {/* Main Meditation Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 md:p-8 mb-6 shadow-2xl shadow-purple-900/20">
          {/* Type Selector */}
          <div className="relative mb-6">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className={`w-full p-4 rounded-xl bg-gradient-to-r ${selectedType.color} flex items-center justify-between transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-3">
                {selectedType.icon}
                <div className="text-left">
                  <div className="font-semibold">{selectedType.name}</div>
                  <div className="text-sm opacity-80">{selectedType.description}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-purple-500/30 overflow-hidden z-10 shadow-xl">
                {meditationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-700 transition-colors ${
                      selectedType.id === type.id ? 'bg-purple-900/30' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color}`}>
                      {type.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-gray-400">{type.description}</div>
                    </div>
                    {selectedType.id === type.id && <Check className="w-5 h-5 text-purple-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration Selector */}
          <div className="flex justify-center gap-3 mb-8">
            {sessionDurations.map((duration) => (
              <button
                key={duration}
                onClick={() => handleDurationChange(duration)}
                disabled={isPlaying}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDuration === duration
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {duration} min
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Circular Progress */}
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-800"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-light tracking-wider text-purple-300">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {isPlaying ? 'In Progress' : 'Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Instruction */}
          <div className="bg-slate-800/50 rounded-xl p-6 mb-6 min-h-[100px]">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {selectedType.instructions.length}
              </span>
            </div>
            <p className="text-lg text-gray-200 italic">
              "{selectedType.instructions[currentStep]}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isPlaying ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/50"
              >
                <Play className="w-6 h-6" />
                {timeRemaining < selectedDuration * 60 ? 'Resume' : 'Begin'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-8 py-4 bg-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-600 transition-all"
              >
                <Pause className="w-6 h-6" />
                Pause
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all"
              title="Reset"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-4 rounded-xl transition-all ${
                soundEnabled ? 'bg-purple-600/30 text-purple-400' : 'bg-slate-800 text-gray-500'
              }`}
              title="Toggle Sound"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Session Notes */}
          <div className="mt-6">
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Add notes about this session..."
              className="w-full p-4 bg-slate-800/50 border border-purple-500/20 rounded-xl text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/50"
              rows={2}
            />
          </div>
        </div>

        {/* History Button */}
        <button
          onClick={() => setShowHistory(true)}
          className="w-full py-4 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-purple-500/20 flex items-center justify-center gap-2 text-purple-400 hover:bg-slate-800 transition-all"
        >
          <History className="w-5 h-5" />
          View Session History ({sessions.length})
        </button>

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-purple-500/30 max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-semibold text-purple-400">Session History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {sessions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No sessions yet. Start your first meditation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => {
                      const type = meditationTypes.find((t) => t.id === session.type);
                      return (
                        <div
                          key={session.id}
                          className="p-4 bg-slate-800/50 rounded-xl border border-purple-500/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${type?.color || 'from-purple-600 to-indigo-600'}`}>
                                {type?.icon || <Star className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="font-medium">{type?.name || session.type}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(session.completedAt).toLocaleDateString()} at{' '}
                                  {new Date(session.completedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-purple-400 font-medium">{session.duration} min</div>
                          </div>
                          {session.notes && (
                            <p className="text-sm text-gray-400 italic pl-11">"{session.notes}"</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeditationCenter;
