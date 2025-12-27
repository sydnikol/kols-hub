import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  CloudRain,
  Cloud,
  Flame,
  TreePine,
  Waves,
  Wind,
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Save,
  Trash2,
  Plus,
  X,
  Check,
  Settings,
  Sparkles,
  Zap,
  Coffee,
  Bed,
} from 'lucide-react';

// Types
interface Soundscape {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  frequency?: number; // Base oscillator frequency for synthesis
  noiseType?: 'white' | 'pink' | 'brown';
}

interface SoundMix {
  [soundId: string]: number; // 0-100 volume
}

interface Preset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  mix: SoundMix;
  isCustom?: boolean;
}

// Available Soundscapes
const soundscapes: Soundscape[] = [
  {
    id: 'rain',
    name: 'Rain',
    icon: <CloudRain className="w-6 h-6" />,
    color: 'from-blue-600 to-cyan-700',
    description: 'Gentle rainfall',
    noiseType: 'pink',
  },
  {
    id: 'thunder',
    name: 'Thunder',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-slate-600 to-zinc-800',
    description: 'Distant rumbles',
    noiseType: 'brown',
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    icon: <Flame className="w-6 h-6" />,
    color: 'from-orange-600 to-red-700',
    description: 'Crackling fire',
    noiseType: 'brown',
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: <TreePine className="w-6 h-6" />,
    color: 'from-green-600 to-emerald-800',
    description: 'Birds and rustling leaves',
    noiseType: 'pink',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: <Waves className="w-6 h-6" />,
    color: 'from-teal-600 to-blue-800',
    description: 'Waves on shore',
    noiseType: 'brown',
  },
  {
    id: 'wind',
    name: 'Wind',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-gray-600 to-slate-700',
    description: 'Gentle breeze',
    noiseType: 'white',
  },
  {
    id: 'night',
    name: 'Night',
    icon: <Moon className="w-6 h-6" />,
    color: 'from-indigo-700 to-purple-900',
    description: 'Crickets and owls',
    frequency: 220,
  },
  {
    id: 'storm',
    name: 'Storm',
    icon: <Cloud className="w-6 h-6" />,
    color: 'from-purple-700 to-slate-800',
    description: 'Heavy weather',
    noiseType: 'brown',
  },
];

// Default Presets
const defaultPresets: Preset[] = [
  {
    id: 'sleep',
    name: 'Sleep',
    icon: <Bed className="w-5 h-5" />,
    description: 'Drift into peaceful slumber',
    mix: { rain: 60, ocean: 30, wind: 20 },
  },
  {
    id: 'focus',
    name: 'Focus',
    icon: <Coffee className="w-5 h-5" />,
    description: 'Enhance concentration',
    mix: { rain: 40, fireplace: 50, forest: 20 },
  },
  {
    id: 'relax',
    name: 'Relax',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Unwind and destress',
    mix: { ocean: 50, wind: 30, night: 40 },
  },
  {
    id: 'storm-night',
    name: 'Storm Night',
    icon: <CloudRain className="w-5 h-5" />,
    description: 'Cozy stormy evening',
    mix: { rain: 70, thunder: 50, fireplace: 40 },
  },
  {
    id: 'nature',
    name: 'Nature Walk',
    icon: <TreePine className="w-5 h-5" />,
    description: 'Forest atmosphere',
    mix: { forest: 60, wind: 25, rain: 15 },
  },
];

const timerOptions = [
  { value: 0, label: 'No Timer' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
];

const SoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSounds, setActiveSounds] = useState<SoundMix>({});
  const [masterVolume, setMasterVolume] = useState(70);
  const [presets, setPresets] = useState<Preset[]>(defaultPresets);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Map<string, { source: AudioBufferSourceNode | OscillatorNode; gain: GainNode }>>(new Map());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Load presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('soundscape-presets');
    if (saved) {
      const customPresets = JSON.parse(saved);
      setPresets([...defaultPresets, ...customPresets]);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isPlaying && timer > 0 && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleStop();
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
  }, [isPlaying, timer, timeRemaining]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Create audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = masterVolume / 100;
    }
    return audioContextRef.current;
  }, []);

  // Create noise buffer
  const createNoiseBuffer = useCallback((type: 'white' | 'pink' | 'brown'): AudioBuffer => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'white') {
        data[i] = white * 0.5;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        // Brown noise
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }

    return buffer;
  }, [getAudioContext]);

  // Start a sound
  const startSound = useCallback((soundscape: Soundscape, volume: number) => {
    const ctx = getAudioContext();

    // Stop existing sound for this ID
    const existing = nodesRef.current.get(soundscape.id);
    if (existing) {
      existing.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      setTimeout(() => {
        try { existing.source.stop(); } catch {}
      }, 100);
    }

    const gainNode = ctx.createGain();
    gainNode.connect(masterGainRef.current!);
    gainNode.gain.value = (volume / 100) * 0.8;

    let source: AudioBufferSourceNode | OscillatorNode;

    if (soundscape.noiseType) {
      // Create noise-based sound
      const buffer = createNoiseBuffer(soundscape.noiseType);
      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = buffer;
      bufferSource.loop = true;

      // Add filtering for different sounds
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';

      switch (soundscape.id) {
        case 'rain':
          filter.frequency.value = 4000;
          break;
        case 'thunder':
          filter.frequency.value = 200;
          break;
        case 'fireplace':
          filter.frequency.value = 800;
          break;
        case 'forest':
          filter.frequency.value = 3000;
          break;
        case 'ocean':
          filter.frequency.value = 600;
          break;
        case 'wind':
          filter.frequency.value = 1500;
          break;
        case 'storm':
          filter.frequency.value = 400;
          break;
        default:
          filter.frequency.value = 2000;
      }

      bufferSource.connect(filter);
      filter.connect(gainNode);
      bufferSource.start();
      source = bufferSource;
    } else if (soundscape.frequency) {
      // Create oscillator-based sound
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = soundscape.frequency;

      // Add subtle modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.5;
      lfoGain.gain.value = 10;
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();

      oscillator.connect(gainNode);
      oscillator.start();
      source = oscillator;
    } else {
      return;
    }

    nodesRef.current.set(soundscape.id, { source, gain: gainNode });
  }, [getAudioContext, createNoiseBuffer]);

  // Stop a sound
  const stopSound = useCallback((soundId: string) => {
    const ctx = audioContextRef.current;
    const node = nodesRef.current.get(soundId);
    if (node && ctx) {
      node.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => {
        try { node.source.stop(); } catch {}
        nodesRef.current.delete(soundId);
      }, 500);
    }
  }, []);

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    nodesRef.current.forEach((node, id) => {
      stopSound(id);
    });
  }, [stopSound]);

  // Update volume for a sound
  const updateSoundVolume = useCallback((soundId: string, volume: number) => {
    const ctx = audioContextRef.current;
    const node = nodesRef.current.get(soundId);
    if (node && ctx) {
      node.gain.gain.setTargetAtTime(volume / 100 * 0.8, ctx.currentTime, 0.1);
    }
  }, []);

  // Update master volume
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        masterVolume / 100,
        audioContextRef.current.currentTime,
        0.1
      );
    }
  }, [masterVolume]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      handleStop();
    } else {
      // Resume audio context if suspended
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Start active sounds
      Object.entries(activeSounds).forEach(([soundId, volume]) => {
        if (volume > 0) {
          const soundscape = soundscapes.find((s) => s.id === soundId);
          if (soundscape) {
            startSound(soundscape, volume);
          }
        }
      });

      if (timer > 0) {
        setTimeRemaining(timer * 60);
      }

      setIsPlaying(true);
    }
  };

  // Handle stop
  const handleStop = () => {
    setIsPlaying(false);
    stopAllSounds();
    setTimeRemaining(0);
  };

  // Toggle a sound
  const toggleSound = (soundscape: Soundscape) => {
    const currentVolume = activeSounds[soundscape.id] || 0;

    if (currentVolume > 0) {
      // Turn off
      const newMix = { ...activeSounds };
      delete newMix[soundscape.id];
      setActiveSounds(newMix);
      if (isPlaying) {
        stopSound(soundscape.id);
      }
    } else {
      // Turn on at 50%
      setActiveSounds({ ...activeSounds, [soundscape.id]: 50 });
      if (isPlaying) {
        startSound(soundscape, 50);
      }
    }
    setActivePreset(null);
  };

  // Adjust sound volume
  const adjustSoundVolume = (soundId: string, volume: number) => {
    setActiveSounds({ ...activeSounds, [soundId]: volume });
    if (isPlaying) {
      if (volume === 0) {
        stopSound(soundId);
      } else {
        updateSoundVolume(soundId, volume);
      }
    }
    setActivePreset(null);
  };

  // Apply preset
  const applyPreset = (preset: Preset) => {
    // Stop current sounds
    if (isPlaying) {
      stopAllSounds();
    }

    setActiveSounds(preset.mix);
    setActivePreset(preset.id);

    // Start new sounds if playing
    if (isPlaying) {
      Object.entries(preset.mix).forEach(([soundId, volume]) => {
        const soundscape = soundscapes.find((s) => s.id === soundId);
        if (soundscape && volume > 0) {
          startSound(soundscape, volume);
        }
      });
    }
  };

  // Save custom preset
  const saveCustomPreset = () => {
    if (!newPresetName.trim() || Object.keys(activeSounds).length === 0) return;

    const newPreset: Preset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Custom mix',
      mix: { ...activeSounds },
      isCustom: true,
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    setActivePreset(newPreset.id);

    // Save to localStorage
    const customPresets = updatedPresets.filter((p) => p.isCustom);
    localStorage.setItem('soundscape-presets', JSON.stringify(customPresets));

    setNewPresetName('');
    setShowSavePreset(false);
  };

  // Delete custom preset
  const deletePreset = (presetId: string) => {
    const updatedPresets = presets.filter((p) => p.id !== presetId);
    setPresets(updatedPresets);
    if (activePreset === presetId) {
      setActivePreset(null);
    }

    const customPresets = updatedPresets.filter((p) => p.isCustom);
    localStorage.setItem('soundscape-presets', JSON.stringify(customPresets));
  };

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeSoundCount = Object.values(activeSounds).filter((v) => v > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white p-4 md:p-8">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Soundscape Player
            </h1>
            <Moon className="w-8 h-8 text-teal-400" />
          </div>
          <p className="text-gray-400 text-lg">Immerse yourself in ambient tranquility</p>
        </div>

        {/* Main Player */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 md:p-8 shadow-2xl mb-6">
          {/* Master Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-emerald-500/20">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                disabled={activeSoundCount === 0}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  activeSoundCount === 0
                    ? 'bg-slate-800 text-gray-600 cursor-not-allowed'
                    : isPlaying
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg'
                }`}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              <div>
                <div className="text-lg font-medium">
                  {isPlaying ? 'Playing' : 'Ready'}
                </div>
                <div className="text-sm text-gray-500">
                  {activeSoundCount} sound{activeSoundCount !== 1 ? 's' : ''} selected
                </div>
              </div>
            </div>

            {/* Master Volume */}
            <div className="flex items-center gap-4">
              <VolumeX className="w-5 h-5 text-gray-500" />
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-gray-400 w-10">{masterVolume}%</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-gray-500" />
              <select
                value={timer}
                onChange={(e) => {
                  setTimer(Number(e.target.value));
                  if (!isPlaying) {
                    setTimeRemaining(Number(e.target.value) * 60);
                  }
                }}
                className="px-3 py-2 bg-slate-800 border border-emerald-500/20 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500/50"
              >
                {timerOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {timeRemaining > 0 && isPlaying && (
                <span className="text-emerald-400 font-mono">{formatTime(timeRemaining)}</span>
              )}
            </div>
          </div>

          {/* Soundscapes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {soundscapes.map((soundscape) => {
              const isActive = (activeSounds[soundscape.id] || 0) > 0;
              return (
                <div
                  key={soundscape.id}
                  className={`relative p-4 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${soundscape.color} shadow-lg`
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                >
                  <button
                    onClick={() => toggleSound(soundscape)}
                    className="w-full flex flex-col items-center text-center"
                  >
                    <div className={`mb-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {soundscape.icon}
                    </div>
                    <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {soundscape.name}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {soundscape.description}
                    </div>
                  </button>

                  {isActive && (
                    <div className="mt-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activeSounds[soundscape.id] || 0}
                        onChange={(e) => adjustSoundVolume(soundscape.id, Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                      />
                      <div className="text-center text-xs text-white/80 mt-1">
                        {activeSounds[soundscape.id]}%
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Save Preset Button */}
          {activeSoundCount > 0 && (
            <button
              onClick={() => setShowSavePreset(true)}
              className="w-full py-3 bg-slate-800/50 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save as Preset
            </button>
          )}
        </div>

        {/* Presets */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Presets
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`relative p-4 rounded-xl text-left transition-all ${
                  activePreset === preset.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {preset.icon}
                  <span className="font-medium">{preset.name}</span>
                  {activePreset === preset.id && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </div>
                <p className={`text-sm ${activePreset === preset.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {preset.description}
                </p>

                {preset.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-900 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Mix Summary */}
        {activeSoundCount > 0 && (
          <div className="mt-6 p-4 bg-slate-900/60 rounded-xl border border-emerald-500/10">
            <div className="text-sm text-gray-400 mb-2">Current Mix:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeSounds)
                .filter(([_, vol]) => vol > 0)
                .map(([soundId, volume]) => {
                  const sound = soundscapes.find((s) => s.id === soundId);
                  return (
                    <span
                      key={soundId}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${sound?.color || 'from-gray-600 to-gray-700'} text-white text-sm`}
                    >
                      {sound?.icon}
                      {sound?.name} ({volume}%)
                    </span>
                  );
                })}
            </div>
          </div>
        )}

        {/* Save Preset Modal */}
        {showSavePreset && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-emerald-500/30 max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
                <h2 className="text-xl font-semibold text-emerald-400">Save Preset</h2>
                <button
                  onClick={() => setShowSavePreset(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-400 text-sm mb-4">
                  Save your current sound mix as a preset for quick access later.
                </p>

                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Preset name..."
                  className="w-full p-4 bg-slate-800/50 border border-emerald-500/20 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 mb-4"
                />

                <div className="text-sm text-gray-500 mb-4">
                  Includes:{' '}
                  {Object.entries(activeSounds)
                    .filter(([_, vol]) => vol > 0)
                    .map(([id]) => soundscapes.find((s) => s.id === id)?.name)
                    .join(', ')}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSavePreset(false)}
                    className="flex-1 py-3 bg-slate-800 rounded-xl text-gray-400 hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCustomPreset}
                    disabled={!newPresetName.trim()}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      newPresetName.trim()
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500'
                        : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Save className="w-5 h-5 inline-block mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundscapePlayer;
