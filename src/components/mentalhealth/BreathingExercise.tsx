import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Check,
  Vibrate,
  Info,
  Trophy,
  Settings,
  X,
  ChevronRight,
  Moon,
  Sparkles,
} from 'lucide-react';

// Types
interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  color: string;
}

interface CompletionRecord {
  id: string;
  patternId: string;
  cycles: number;
  completedAt: string;
}

// Breathing Patterns
const breathingPatterns: BreathingPattern[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Relaxing Breath',
    description: 'Ancient yogic technique for deep relaxation and sleep',
    benefits: ['Reduces anxiety', 'Helps with sleep', 'Calms nervous system'],
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    color: 'from-violet-600 to-purple-800',
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Navy SEAL technique for focus and stress management',
    benefits: ['Improves focus', 'Reduces stress', 'Enhances performance'],
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: 'from-indigo-600 to-blue-800',
  },
  {
    id: '5-5-5',
    name: '5-5-5 Balanced Breath',
    description: 'Simple rhythmic breathing for everyday calm',
    benefits: ['Easy to learn', 'Versatile', 'Quick stress relief'],
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 5,
    color: 'from-teal-600 to-emerald-800',
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick revitalizing breath pattern for energy boost',
    benefits: ['Increases alertness', 'Boosts energy', 'Improves mood'],
    inhale: 4,
    hold1: 2,
    exhale: 2,
    hold2: 0,
    color: 'from-amber-600 to-orange-800',
  },
  {
    id: 'calming',
    name: 'Deep Calming Breath',
    description: 'Extended exhale for parasympathetic activation',
    benefits: ['Deep relaxation', 'Heart rate reduction', 'Anxiety relief'],
    inhale: 4,
    hold1: 4,
    exhale: 8,
    hold2: 0,
    color: 'from-rose-600 to-pink-800',
  },
];

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';

const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out',
  hold2: 'Hold',
  idle: 'Ready',
};

const BreathingExercise: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('idle');
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles, setTargetCycles] = useState(4);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showPatternSelect, setShowPatternSelect] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [showCompletions, setShowCompletions] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<BreathPhase>('idle');

  // Load completions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('breathing-completions');
    if (saved) {
      setCompletions(JSON.parse(saved));
    }
  }, []);

  // Save completions
  useEffect(() => {
    localStorage.setItem('breathing-completions', JSON.stringify(completions));
  }, [completions]);

  // Haptic feedback
  const triggerHaptic = useCallback((pattern: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!hapticEnabled || !navigator.vibrate) return;

    const patterns = {
      light: [50],
      medium: [100],
      heavy: [200],
    };

    navigator.vibrate(patterns[pattern]);
  }, [hapticEnabled]);

  // Get total cycle duration
  const getCycleDuration = useCallback((pattern: BreathingPattern) => {
    return pattern.inhale + pattern.hold1 + pattern.exhale + pattern.hold2;
  }, []);

  // Get phase duration
  const getPhaseDuration = useCallback((phase: BreathPhase, pattern: BreathingPattern) => {
    const durations: Record<BreathPhase, number> = {
      inhale: pattern.inhale,
      hold1: pattern.hold1,
      exhale: pattern.exhale,
      hold2: pattern.hold2,
      idle: 0,
    };
    return durations[phase];
  }, []);

  // Get next phase
  const getNextPhase = useCallback((current: BreathPhase, pattern: BreathingPattern): BreathPhase => {
    const sequence: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    const index = sequence.indexOf(current);

    // Find next non-zero phase
    for (let i = 1; i <= sequence.length; i++) {
      const nextIndex = (index + i) % sequence.length;
      const nextPhase = sequence[nextIndex];
      if (getPhaseDuration(nextPhase, pattern) > 0) {
        return nextPhase;
      }
    }
    return 'inhale';
  }, [getPhaseDuration]);

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPhaseTime((prev) => {
          const currentPhaseDuration = getPhaseDuration(phaseRef.current, selectedPattern);

          if (prev >= currentPhaseDuration * 10) {
            // Phase complete
            const nextPhase = getNextPhase(phaseRef.current, selectedPattern);

            // Check if cycle complete
            if (nextPhase === 'inhale' && phaseRef.current !== 'idle') {
              setCycleCount((c) => {
                const newCount = c + 1;
                if (newCount >= targetCycles) {
                  // Session complete
                  setIsPlaying(false);
                  handleSessionComplete();
                  return 0;
                }
                triggerHaptic('heavy');
                return newCount;
              });
            } else {
              triggerHaptic('light');
            }

            phaseRef.current = nextPhase;
            setCurrentPhase(nextPhase);
            return 0;
          }

          return prev + 1;
        });
      }, 100);
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
  }, [isPlaying, selectedPattern, targetCycles, getNextPhase, getPhaseDuration, triggerHaptic]);

  const handleSessionComplete = () => {
    const newCompletion: CompletionRecord = {
      id: Date.now().toString(),
      patternId: selectedPattern.id,
      cycles: targetCycles,
      completedAt: new Date().toISOString(),
    };
    setCompletions((prev) => [newCompletion, ...prev].slice(0, 50));
    triggerHaptic('heavy');
  };

  const handleStart = () => {
    if (currentPhase === 'idle') {
      phaseRef.current = 'inhale';
      setCurrentPhase('inhale');
      setPhaseTime(0);
    }
    setIsPlaying(true);
    triggerHaptic('medium');
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    phaseRef.current = 'idle';
    setCurrentPhase('idle');
    setPhaseTime(0);
    setCycleCount(0);
  };

  const handlePatternChange = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    handleReset();
    setShowPatternSelect(false);
  };

  // Calculate circle scale based on phase
  const getCircleScale = () => {
    if (currentPhase === 'idle') return 0.6;

    const duration = getPhaseDuration(currentPhase, selectedPattern) * 10;
    const progress = phaseTime / duration;

    switch (currentPhase) {
      case 'inhale':
        return 0.6 + 0.4 * progress; // 0.6 -> 1.0
      case 'hold1':
      case 'hold2':
        return currentPhase === 'hold1' ? 1.0 : 0.6;
      case 'exhale':
        return 1.0 - 0.4 * progress; // 1.0 -> 0.6
      default:
        return 0.6;
    }
  };

  // Calculate remaining time in phase
  const getPhaseTimeRemaining = () => {
    const duration = getPhaseDuration(currentPhase, selectedPattern);
    return Math.ceil(duration - phaseTime / 10);
  };

  const getTotalStats = () => {
    return {
      totalSessions: completions.length,
      totalCycles: completions.reduce((acc, c) => acc + c.cycles, 0),
      favoritePattern: completions.length > 0
        ? breathingPatterns.find(
            (p) =>
              p.id ===
              completions.reduce(
                (acc, c) => {
                  acc[c.patternId] = (acc[c.patternId] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>
              ) &&
              Object.entries(
                completions.reduce(
                  (acc, c) => {
                    acc[c.patternId] = (acc[c.patternId] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              ).sort((a, b) => b[1] - a[1])[0]?.[0]
          )?.name || 'None'
        : 'None',
    };
  };

  const scale = getCircleScale();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white p-4 md:p-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wind className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Breathing Exercise
            </h1>
            <Moon className="w-8 h-8 text-violet-400" />
          </div>
          <p className="text-gray-400 text-lg">Master your breath, master your mind</p>
        </div>

        {/* Pattern Selector Button */}
        <button
          onClick={() => setShowPatternSelect(true)}
          disabled={isPlaying}
          className={`w-full mb-6 p-4 rounded-xl bg-gradient-to-r ${selectedPattern.color} flex items-center justify-between transition-all hover:scale-[1.02] ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Wind className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">{selectedPattern.name}</div>
              <div className="text-sm opacity-80">{selectedPattern.description}</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Main Breathing Circle */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-8 md:p-12 mb-6 shadow-2xl">
          {/* Cycle Counter */}
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: targetCycles }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < cycleCount ? 'bg-indigo-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Breathing Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />

              {/* Animated circle */}
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${selectedPattern.color} flex items-center justify-center transition-all duration-300 shadow-2xl`}
                style={{
                  transform: `scale(${scale})`,
                  boxShadow: `0 0 60px ${currentPhase === 'inhale' || currentPhase === 'hold1' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.2)'}`,
                }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {currentPhase !== 'idle' ? getPhaseTimeRemaining() : '--'}
                  </div>
                  <div className="text-sm opacity-80 mt-1">{phaseLabels[currentPhase]}</div>
                </div>
              </div>

              {/* Sparkle effects */}
              {isPlaying && (
                <>
                  <Sparkles className="absolute top-4 right-8 w-4 h-4 text-indigo-400 animate-pulse" />
                  <Sparkles className="absolute bottom-8 left-4 w-3 h-3 text-violet-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
            </div>
          </div>

          {/* Pattern Info */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {selectedPattern.inhale > 0 && (
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
                <div className="text-indigo-400 text-xl font-bold">{selectedPattern.inhale}s</div>
                <div className="text-xs text-gray-500">Inhale</div>
              </div>
            )}
            {selectedPattern.hold1 > 0 && (
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
                <div className="text-violet-400 text-xl font-bold">{selectedPattern.hold1}s</div>
                <div className="text-xs text-gray-500">Hold</div>
              </div>
            )}
            {selectedPattern.exhale > 0 && (
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
                <div className="text-purple-400 text-xl font-bold">{selectedPattern.exhale}s</div>
                <div className="text-xs text-gray-500">Exhale</div>
              </div>
            )}
            {selectedPattern.hold2 > 0 && (
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
                <div className="text-pink-400 text-xl font-bold">{selectedPattern.hold2}s</div>
                <div className="text-xs text-gray-500">Hold</div>
              </div>
            )}
          </div>

          {/* Target Cycles */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-gray-400">Target Cycles:</span>
            {[3, 4, 5, 8, 10].map((cycles) => (
              <button
                key={cycles}
                onClick={() => setTargetCycles(cycles)}
                disabled={isPlaying}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  targetCycles === cycles
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cycles}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isPlaying ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-semibold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg"
              >
                <Play className="w-6 h-6" />
                {currentPhase !== 'idle' ? 'Resume' : 'Start'}
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
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className={`p-4 rounded-xl transition-all ${
                hapticEnabled ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-800 text-gray-500'
              }`}
              title="Toggle Haptic Feedback"
            >
              <Vibrate className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowInfo(true)}
              className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all"
              title="Pattern Info"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* History Button */}
        <button
          onClick={() => setShowCompletions(true)}
          className="w-full py-4 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-indigo-500/20 flex items-center justify-center gap-2 text-indigo-400 hover:bg-slate-800 transition-all"
        >
          <Trophy className="w-5 h-5" />
          Completion History ({completions.length})
        </button>

        {/* Pattern Selection Modal */}
        {showPatternSelect && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-indigo-500/20">
                <h2 className="text-xl font-semibold text-indigo-400">Select Breathing Pattern</h2>
                <button
                  onClick={() => setShowPatternSelect(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                {breathingPatterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() => handlePatternChange(pattern)}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${
                      selectedPattern.id === pattern.id
                        ? 'border-indigo-500 bg-indigo-900/30'
                        : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${pattern.color}`}>
                        <Wind className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pattern.name}</span>
                          {selectedPattern.id === pattern.id && (
                            <Check className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{pattern.description}</div>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-slate-700 rounded">
                            {pattern.inhale}-{pattern.hold1}-{pattern.exhale}-{pattern.hold2}
                          </span>
                          <span className="text-xs px-2 py-1 bg-slate-700 rounded">
                            {getCycleDuration(pattern)}s cycle
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pattern Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-indigo-500/20">
                <h2 className="text-xl font-semibold text-indigo-400">{selectedPattern.name}</h2>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-300 mb-4">{selectedPattern.description}</p>

                <h3 className="text-indigo-400 font-medium mb-2">Benefits:</h3>
                <ul className="space-y-2 mb-4">
                  {selectedPattern.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-400">
                      <Check className="w-4 h-4 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <h3 className="text-indigo-400 font-medium mb-2">Pattern:</h3>
                <div className="flex gap-3 text-center">
                  <div className="flex-1 p-3 bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-400">{selectedPattern.inhale}</div>
                    <div className="text-xs text-gray-500">Inhale</div>
                  </div>
                  <div className="flex-1 p-3 bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-violet-400">{selectedPattern.hold1}</div>
                    <div className="text-xs text-gray-500">Hold</div>
                  </div>
                  <div className="flex-1 p-3 bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{selectedPattern.exhale}</div>
                    <div className="text-xs text-gray-500">Exhale</div>
                  </div>
                  <div className="flex-1 p-3 bg-slate-800 rounded-lg">
                    <div className="text-2xl font-bold text-pink-400">{selectedPattern.hold2}</div>
                    <div className="text-xs text-gray-500">Hold</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completions Modal */}
        {showCompletions && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-indigo-500/20">
                <h2 className="text-xl font-semibold text-indigo-400">Completion History</h2>
                <button
                  onClick={() => setShowCompletions(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {completions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No completions yet. Start breathing!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completions.map((completion) => {
                      const pattern = breathingPatterns.find((p) => p.id === completion.patternId);
                      return (
                        <div
                          key={completion.id}
                          className="p-4 bg-slate-800/50 rounded-xl border border-indigo-500/10"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${pattern?.color || 'from-indigo-600 to-violet-600'}`}>
                                <Wind className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium">{pattern?.name || completion.patternId}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(completion.completedAt).toLocaleDateString()} at{' '}
                                  {new Date(completion.completedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-indigo-400 font-medium">{completion.cycles} cycles</div>
                          </div>
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

export default BreathingExercise;
