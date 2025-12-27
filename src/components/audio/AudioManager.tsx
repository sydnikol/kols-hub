// Audio Manager Component
// Handles ambient sounds, music integration, and sound effects for the Gothic Dollhouse

import React, { useState, useCallback, useEffect, createContext, useContext, useRef, useMemo } from 'react';
import { Box, Typography, Slider, IconButton, Collapse, Chip, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Volume2, VolumeX, Music, Wind, Droplets, Flame, Bird,
  Moon, CloudRain, Waves, Clock, Bell, Sparkles,
  ChevronDown, ChevronUp, Play, Pause, SkipForward, Shuffle, Loader
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// ============================================================================
// SOUND URLs - Free ambient sounds from Mixkit
// ============================================================================
const SOUND_URLS: Record<string, string> = {
  rain: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
  thunder: 'https://assets.mixkit.co/active_storage/sfx/1232/1232-preview.mp3',
  fireplace: 'https://assets.mixkit.co/active_storage/sfx/2502/2502-preview.mp3',
  wind: 'https://assets.mixkit.co/active_storage/sfx/2483/2483-preview.mp3',
  birds: 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3',
  water: 'https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3',
  ocean: 'https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3', // Using water for ocean
  bells: 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3', // Using birds as placeholder
  clock: 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3', // Using birds as placeholder
  night: 'https://assets.mixkit.co/active_storage/sfx/2483/2483-preview.mp3', // Using wind for night ambience
};

// ============================================================================
// Audio Engine Types
// ============================================================================
interface AudioInstance {
  audio: HTMLAudioElement;
  gainNode?: GainNode;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

interface AudioEngineState {
  instances: Map<string, AudioInstance>;
  loadingStates: Record<string, boolean>;
  loadedStates: Record<string, boolean>;
  errorStates: Record<string, string | null>;
}

// ============================================================================
// useAudioEngine Hook - Manages HTMLAudioElement instances
// ============================================================================
const useAudioEngine = () => {
  const audioInstances = useRef<Map<string, AudioInstance>>(new Map());
  const fadeTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [loadedStates, setLoadedStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string | null>>({});

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop all sounds and clean up
      audioInstances.current.forEach((instance, id) => {
        try {
          instance.audio.pause();
          instance.audio.src = '';
        } catch (e) {
          console.warn(`Error cleaning up audio ${id}:`, e);
        }
      });
      audioInstances.current.clear();

      // Clear all fade timers
      fadeTimers.current.forEach(timer => clearTimeout(timer));
      fadeTimers.current.clear();
    };
  }, []);

  // Load a sound (lazy loading with caching)
  const loadSound = useCallback(async (soundId: string): Promise<AudioInstance | null> => {
    // Check if already loaded or loading
    const existing = audioInstances.current.get(soundId);
    if (existing && (existing.isLoaded || existing.isLoading)) {
      return existing;
    }

    const url = SOUND_URLS[soundId];
    if (!url) {
      console.warn(`No URL found for sound: ${soundId}`);
      setErrorStates(prev => ({ ...prev, [soundId]: 'No URL available' }));
      return null;
    }

    // Mark as loading
    setLoadingStates(prev => ({ ...prev, [soundId]: true }));

    try {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0; // Start silent for fade in

      const instance: AudioInstance = {
        audio,
        isLoading: true,
        isLoaded: false,
        error: null,
      };

      audioInstances.current.set(soundId, instance);

      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve();
        };

        const handleError = (e: Event) => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          reject(new Error(`Failed to load sound: ${soundId}`));
        };

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.src = url;
        audio.load();
      });

      // Mark as loaded
      instance.isLoading = false;
      instance.isLoaded = true;
      setLoadingStates(prev => ({ ...prev, [soundId]: false }));
      setLoadedStates(prev => ({ ...prev, [soundId]: true }));
      setErrorStates(prev => ({ ...prev, [soundId]: null }));

      return instance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to load sound ${soundId}:`, errorMessage);

      setLoadingStates(prev => ({ ...prev, [soundId]: false }));
      setErrorStates(prev => ({ ...prev, [soundId]: errorMessage }));

      // Remove failed instance
      audioInstances.current.delete(soundId);
      return null;
    }
  }, []);

  // Fade volume helper
  const fadeVolume = useCallback((
    audio: HTMLAudioElement,
    fromVolume: number,
    toVolume: number,
    duration: number,
    onComplete?: () => void
  ) => {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = (toVolume - fromVolume) / steps;
    let currentStep = 0;

    const fade = () => {
      currentStep++;
      const newVolume = Math.max(0, Math.min(1, fromVolume + volumeStep * currentStep));
      audio.volume = newVolume;

      if (currentStep < steps) {
        setTimeout(fade, stepDuration);
      } else {
        audio.volume = toVolume;
        onComplete?.();
      }
    };

    fade();
  }, []);

  // Play a sound with fade in
  const playSound = useCallback(async (
    soundId: string,
    volume: number,
    fadeInDuration: number = 500
  ) => {
    let instance = audioInstances.current.get(soundId);

    // Load if not already loaded
    if (!instance || !instance.isLoaded) {
      instance = await loadSound(soundId);
    }

    if (!instance || !instance.isLoaded) {
      console.warn(`Could not play sound ${soundId}: not loaded`);
      return;
    }

    const audio = instance.audio;

    // Clear any existing fade timer for this sound
    const existingTimer = fadeTimers.current.get(soundId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      fadeTimers.current.delete(soundId);
    }

    // Start playing and fade in
    try {
      audio.volume = 0;
      await audio.play();
      fadeVolume(audio, 0, volume, fadeInDuration);
    } catch (error) {
      console.warn(`Error playing sound ${soundId}:`, error);
    }
  }, [loadSound, fadeVolume]);

  // Stop a sound with fade out
  const stopSound = useCallback((
    soundId: string,
    fadeOutDuration: number = 500
  ) => {
    const instance = audioInstances.current.get(soundId);
    if (!instance || !instance.audio) return;

    const audio = instance.audio;
    const currentVolume = audio.volume;

    // Clear any existing fade timer
    const existingTimer = fadeTimers.current.get(soundId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Fade out then pause
    fadeVolume(audio, currentVolume, 0, fadeOutDuration, () => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [fadeVolume]);

  // Update volume for a playing sound
  const setVolume = useCallback((soundId: string, volume: number) => {
    const instance = audioInstances.current.get(soundId);
    if (instance && instance.audio && !instance.audio.paused) {
      instance.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Set volume for all playing sounds
  const setAllVolumes = useCallback((volume: number) => {
    audioInstances.current.forEach((instance) => {
      if (instance.audio && !instance.audio.paused) {
        instance.audio.volume = Math.max(0, Math.min(1, volume));
      }
    });
  }, []);

  // Pause all sounds (without fade)
  const pauseAll = useCallback(() => {
    audioInstances.current.forEach((instance, id) => {
      if (instance.audio && !instance.audio.paused) {
        fadeVolume(instance.audio, instance.audio.volume, 0, 300, () => {
          instance.audio.pause();
        });
      }
    });
  }, [fadeVolume]);

  // Resume all paused sounds
  const resumeAll = useCallback((getVolume: (id: string) => number) => {
    audioInstances.current.forEach((instance, id) => {
      if (instance.audio && instance.audio.paused && instance.isLoaded) {
        const targetVolume = getVolume(id);
        instance.audio.volume = 0;
        instance.audio.play().then(() => {
          fadeVolume(instance.audio, 0, targetVolume, 300);
        }).catch(e => console.warn(`Error resuming ${id}:`, e));
      }
    });
  }, [fadeVolume]);

  // Mute all sounds
  const muteAll = useCallback(() => {
    audioInstances.current.forEach((instance) => {
      if (instance.audio) {
        instance.audio.muted = true;
      }
    });
  }, []);

  // Unmute all sounds
  const unmuteAll = useCallback(() => {
    audioInstances.current.forEach((instance) => {
      if (instance.audio) {
        instance.audio.muted = false;
      }
    });
  }, []);

  // Check if a sound is currently playing
  const isPlaying = useCallback((soundId: string): boolean => {
    const instance = audioInstances.current.get(soundId);
    return instance?.audio ? !instance.audio.paused : false;
  }, []);

  // Preload sounds (optional, for eager loading)
  const preloadSounds = useCallback(async (soundIds: string[]) => {
    await Promise.all(soundIds.map(id => loadSound(id)));
  }, [loadSound]);

  return {
    loadSound,
    playSound,
    stopSound,
    setVolume,
    setAllVolumes,
    pauseAll,
    resumeAll,
    muteAll,
    unmuteAll,
    isPlaying,
    preloadSounds,
    loadingStates,
    loadedStates,
    errorStates,
  };
};

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const wave = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const AudioPanel = styled(GothicCard)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '320px',
  zIndex: 1000,
  background: 'rgba(10, 8, 18, 0.95)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
});

const MiniPlayer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  cursor: 'pointer',
});

const SoundWave = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '2px',
  height: '20px',
});

const WaveBar = styled(Box)<{ delay: number; active: boolean }>(({ delay, active }) => ({
  width: '3px',
  background: active ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
  borderRadius: '2px',
  animation: active ? `${pulse} 0.8s ease-in-out infinite ${delay}s` : 'none',
  height: active ? `${10 + Math.random() * 10}px` : '4px',
  transition: 'height 0.3s ease',
}));

const AmbientCard = styled(Box)<{ active: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '8px',
  cursor: 'pointer',
  background: active ? 'rgba(139, 92, 246, 0.15)' : 'rgba(20, 20, 30, 0.5)',
  border: active ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
}));

const VolumeSlider = styled(Slider)({
  color: '#8b5cf6',
  height: 4,
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    backgroundColor: '#8b5cf6',
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
});

// Ambient sound definitions
const ambientSounds = [
  { id: 'rain', name: 'Gentle Rain', icon: CloudRain, category: 'nature', color: '#60a5fa' },
  { id: 'thunder', name: 'Distant Thunder', icon: Sparkles, category: 'nature', color: '#a78bfa' },
  { id: 'fireplace', name: 'Crackling Fire', icon: Flame, category: 'cozy', color: '#f97316' },
  { id: 'wind', name: 'Autumn Wind', icon: Wind, category: 'nature', color: '#6ee7b7' },
  { id: 'ocean', name: 'Ocean Waves', icon: Waves, category: 'nature', color: '#38bdf8' },
  { id: 'birds', name: 'Night Birds', icon: Bird, category: 'nature', color: '#fbbf24' },
  { id: 'bells', name: 'Gothic Bells', icon: Bell, category: 'atmosphere', color: '#d4af37' },
  { id: 'clock', name: 'Grandfather Clock', icon: Clock, category: 'atmosphere', color: '#b8860b' },
  { id: 'water', name: 'Fountain', icon: Droplets, category: 'cozy', color: '#22d3ee' },
  { id: 'night', name: 'Night Ambience', icon: Moon, category: 'atmosphere', color: '#c084fc' },
];

// Room-specific ambient presets
const roomPresets: Record<string, string[]> = {
  'grand-foyer': ['clock', 'bells'],
  'ancestor-hall': ['night', 'bells', 'wind'],
  'library-study': ['fireplace', 'clock', 'rain'],
  'apothecary': ['fireplace', 'water', 'bells'],
  'rooftop-observatory': ['night', 'wind', 'birds'],
  'gaming-den': ['fireplace', 'thunder'],
  'music-room': ['rain'],
  'dream-archives': ['night', 'water'],
  'fortune-teller-alcove': ['bells', 'night', 'thunder'],
  'cloud-garden': ['birds', 'wind', 'water'],
  'kitchen-lab': ['fireplace', 'water'],
  'pet-sanctuary': ['birds', 'water'],
  'creative-studio': ['rain', 'fireplace'],
  'wardrobe-palace': ['clock'],
  'office-hub': ['rain', 'clock'],
  'guest-quarters': ['rain', 'night'],
};

export interface AudioState {
  masterVolume: number;
  ambientVolume: number;
  musicVolume: number;
  effectsVolume: number;
  activeSounds: string[];
  isPlaying: boolean;
  isMuted: boolean;
}

interface AudioContextType {
  state: AudioState;
  toggleSound: (soundId: string) => void;
  setMasterVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  toggleMute: () => void;
  togglePlayback: () => void;
  applyRoomPreset: (roomId: string) => void;
  loadingStates: Record<string, boolean>;
  loadedStates: Record<string, boolean>;
  errorStates: Record<string, string | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AudioState>({
    masterVolume: 70,
    ambientVolume: 50,
    musicVolume: 60,
    effectsVolume: 80,
    activeSounds: [],
    isPlaying: false,
    isMuted: false,
  });

  // Initialize the audio engine
  const audioEngine = useAudioEngine();

  // Calculate effective volume for a sound
  const getEffectiveVolume = useCallback((soundId: string): number => {
    if (state.isMuted || !state.isPlaying) return 0;
    return (state.masterVolume / 100) * (state.ambientVolume / 100);
  }, [state.masterVolume, state.ambientVolume, state.isMuted, state.isPlaying]);

  // Track previous active sounds for comparison
  const prevActiveSoundsRef = useRef<string[]>([]);
  const prevIsPlayingRef = useRef(state.isPlaying);
  const prevIsMutedRef = useRef(state.isMuted);

  // Effect to sync audio playback with state changes
  useEffect(() => {
    const prevActiveSounds = prevActiveSoundsRef.current;
    const prevIsPlaying = prevIsPlayingRef.current;
    const prevIsMuted = prevIsMutedRef.current;

    // Determine which sounds to start/stop
    const soundsToStart = state.activeSounds.filter(s => !prevActiveSounds.includes(s));
    const soundsToStop = prevActiveSounds.filter(s => !state.activeSounds.includes(s));

    // Handle mute state change
    if (state.isMuted !== prevIsMuted) {
      if (state.isMuted) {
        audioEngine.muteAll();
      } else {
        audioEngine.unmuteAll();
      }
    }

    // Handle playback state change
    if (state.isPlaying !== prevIsPlaying) {
      if (state.isPlaying && !state.isMuted) {
        // Resume all active sounds
        state.activeSounds.forEach(soundId => {
          const volume = getEffectiveVolume(soundId);
          audioEngine.playSound(soundId, volume);
        });
      } else if (!state.isPlaying) {
        // Pause all sounds
        audioEngine.pauseAll();
      }
    }

    // Only process sound changes if playing
    if (state.isPlaying && !state.isMuted) {
      // Start new sounds
      soundsToStart.forEach(soundId => {
        const volume = getEffectiveVolume(soundId);
        audioEngine.playSound(soundId, volume);
      });

      // Stop removed sounds
      soundsToStop.forEach(soundId => {
        audioEngine.stopSound(soundId);
      });
    }

    // Update refs for next comparison
    prevActiveSoundsRef.current = [...state.activeSounds];
    prevIsPlayingRef.current = state.isPlaying;
    prevIsMutedRef.current = state.isMuted;
  }, [state.activeSounds, state.isPlaying, state.isMuted, audioEngine, getEffectiveVolume]);

  // Effect to update volume when master/ambient volume changes
  useEffect(() => {
    if (!state.isPlaying || state.isMuted) return;

    state.activeSounds.forEach(soundId => {
      const volume = getEffectiveVolume(soundId);
      audioEngine.setVolume(soundId, volume);
    });
  }, [state.masterVolume, state.ambientVolume, state.activeSounds, state.isPlaying, state.isMuted, audioEngine, getEffectiveVolume]);

  const toggleSound = useCallback((soundId: string) => {
    setState(prev => ({
      ...prev,
      activeSounds: prev.activeSounds.includes(soundId)
        ? prev.activeSounds.filter(s => s !== soundId)
        : [...prev.activeSounds, soundId],
    }));
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, masterVolume: volume }));
  }, []);

  const setAmbientVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, ambientVolume: volume }));
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const togglePlayback = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const applyRoomPreset = useCallback((roomId: string) => {
    const preset = roomPresets[roomId];
    if (preset) {
      // First stop all current sounds
      const currentSounds = prevActiveSoundsRef.current;
      currentSounds.forEach(soundId => {
        if (!preset.includes(soundId)) {
          audioEngine.stopSound(soundId);
        }
      });

      // Then set the new active sounds
      setState(prev => ({ ...prev, activeSounds: preset }));
    }
  }, [audioEngine]);

  return (
    <AudioContext.Provider value={{
      state,
      toggleSound,
      setMasterVolume,
      setAmbientVolume,
      toggleMute,
      togglePlayback,
      applyRoomPreset,
      loadingStates: audioEngine.loadingStates,
      loadedStates: audioEngine.loadedStates,
      errorStates: audioEngine.errorStates,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

// Spinning loader animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingIndicator = styled(Box)({
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    animation: `${spin} 1s linear infinite`,
  },
});

// Standalone AudioManager that works without provider (for testing)
export const AudioManagerStandalone: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [masterVolume, setMasterVolume] = useState(70);
  const [ambientVolume, setAmbientVolume] = useState(50);
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Use the audio engine directly for standalone mode
  const audioEngine = useAudioEngine();

  // Calculate effective volume
  const getEffectiveVolume = useCallback((): number => {
    if (isMuted || !isPlaying) return 0;
    return (masterVolume / 100) * (ambientVolume / 100);
  }, [masterVolume, ambientVolume, isMuted, isPlaying]);

  // Track previous state for comparison
  const prevActiveSoundsRef = useRef<string[]>([]);
  const prevIsPlayingRef = useRef(isPlaying);
  const prevIsMutedRef = useRef(isMuted);

  // Sync audio with state
  useEffect(() => {
    const prevActiveSounds = prevActiveSoundsRef.current;
    const prevIsPlaying = prevIsPlayingRef.current;
    const prevIsMuted = prevIsMutedRef.current;

    const soundsToStart = activeSounds.filter(s => !prevActiveSounds.includes(s));
    const soundsToStop = prevActiveSounds.filter(s => !activeSounds.includes(s));

    if (isMuted !== prevIsMuted) {
      if (isMuted) {
        audioEngine.muteAll();
      } else {
        audioEngine.unmuteAll();
      }
    }

    if (isPlaying !== prevIsPlaying) {
      if (isPlaying && !isMuted) {
        activeSounds.forEach(soundId => {
          audioEngine.playSound(soundId, getEffectiveVolume());
        });
      } else if (!isPlaying) {
        audioEngine.pauseAll();
      }
    }

    if (isPlaying && !isMuted) {
      soundsToStart.forEach(soundId => {
        audioEngine.playSound(soundId, getEffectiveVolume());
      });
      soundsToStop.forEach(soundId => {
        audioEngine.stopSound(soundId);
      });
    }

    prevActiveSoundsRef.current = [...activeSounds];
    prevIsPlayingRef.current = isPlaying;
    prevIsMutedRef.current = isMuted;
  }, [activeSounds, isPlaying, isMuted, audioEngine, getEffectiveVolume]);

  // Update volumes
  useEffect(() => {
    if (!isPlaying || isMuted) return;
    activeSounds.forEach(soundId => {
      audioEngine.setVolume(soundId, getEffectiveVolume());
    });
  }, [masterVolume, ambientVolume, activeSounds, isPlaying, isMuted, audioEngine, getEffectiveVolume]);

  const toggleSound = (soundId: string) => {
    setActiveSounds(prev =>
      prev.includes(soundId)
        ? prev.filter(s => s !== soundId)
        : [...prev, soundId]
    );
  };

  const clearAllSounds = () => {
    activeSounds.forEach(soundId => {
      audioEngine.stopSound(soundId);
    });
    setActiveSounds([]);
  };

  const applyRandomSounds = () => {
    const randomSounds = ambientSounds
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(s => s.id);

    // Stop current sounds not in random selection
    activeSounds.forEach(soundId => {
      if (!randomSounds.includes(soundId)) {
        audioEngine.stopSound(soundId);
      }
    });

    setActiveSounds(randomSounds);
  };

  const categories = ['nature', 'cozy', 'atmosphere'];

  return (
    <AudioPanel>
      {/* Mini Player Header */}
      <MiniPlayer onClick={() => setExpanded(!expanded)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            sx={{ color: isMuted ? '#666666' : '#8b5cf6', p: 0.5 }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </IconButton>
          <Box>
            <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem', fontWeight: 500 }}>
              Ambient Sounds
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
              {activeSounds.length} active {isPlaying ? '(playing)' : '(paused)'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SoundWave>
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
              <WaveBar key={i} delay={delay} active={isPlaying && !isMuted && activeSounds.length > 0} />
            ))}
          </SoundWave>
          {expanded ? <ChevronDown size={18} color="#888888" /> : <ChevronUp size={18} color="#888888" />}
        </Box>
      </MiniPlayer>

      {/* Expanded Panel */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
          {/* Master Volume */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                Master Volume
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                {masterVolume}%
              </Typography>
            </Box>
            <VolumeSlider
              value={masterVolume}
              onChange={(_, v) => setMasterVolume(v as number)}
              aria-label="Master volume"
            />
          </Box>

          {/* Ambient Volume */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                Ambient Volume
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                {ambientVolume}%
              </Typography>
            </Box>
            <VolumeSlider
              value={ambientVolume}
              onChange={(_, v) => setAmbientVolume(v as number)}
              aria-label="Ambient volume"
            />
          </Box>

          {/* Category Filter */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              size="small"
              onClick={() => setActiveCategory(null)}
              sx={{
                background: !activeCategory ? 'rgba(139, 92, 246, 0.3)' : 'rgba(50, 50, 60, 0.5)',
                color: !activeCategory ? '#a78bfa' : '#888888',
              }}
            />
            {categories.map(cat => (
              <Chip
                key={cat}
                label={cat}
                size="small"
                onClick={() => setActiveCategory(cat)}
                sx={{
                  background: activeCategory === cat ? 'rgba(139, 92, 246, 0.3)' : 'rgba(50, 50, 60, 0.5)',
                  color: activeCategory === cat ? '#a78bfa' : '#888888',
                  textTransform: 'capitalize',
                }}
              />
            ))}
          </Box>

          {/* Sound Grid */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '250px', overflowY: 'auto' }}>
            {ambientSounds
              .filter(s => !activeCategory || s.category === activeCategory)
              .map((sound) => {
                const Icon = sound.icon;
                const isActive = activeSounds.includes(sound.id);
                const isLoading = audioEngine.loadingStates[sound.id] || false;
                const hasError = audioEngine.errorStates[sound.id] || null;

                return (
                  <AmbientCard
                    key={sound.id}
                    active={isActive}
                    onClick={() => toggleSound(sound.id)}
                    sx={{
                      opacity: hasError ? 0.5 : 1,
                      cursor: hasError ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: `${sound.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {isLoading ? (
                        <LoadingIndicator>
                          <Loader size={16} color={sound.color} />
                        </LoadingIndicator>
                      ) : (
                        <Icon size={18} color={sound.color} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: isActive ? '#e0e0e0' : '#888888', fontSize: '0.9rem' }}>
                        {sound.name}
                        {hasError && (
                          <Typography component="span" sx={{ color: '#f87171', fontSize: '0.7rem', ml: 1 }}>
                            (unavailable)
                          </Typography>
                        )}
                      </Typography>
                      <Typography sx={{ color: '#666666', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                        {isLoading ? 'Loading...' : sound.category}
                      </Typography>
                    </Box>
                    {isActive && !isLoading && (
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: sound.color,
                          animation: `${pulse} 1.5s ease-in-out infinite`,
                        }}
                      />
                    )}
                  </AmbientCard>
                );
              })}
          </Box>

          {/* Playback Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, pt: 2, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <IconButton
              onClick={clearAllSounds}
              sx={{ color: '#888888' }}
              title="Clear all sounds"
            >
              <Shuffle size={18} />
            </IconButton>
            <IconButton
              onClick={() => setIsPlaying(!isPlaying)}
              sx={{
                color: '#8b5cf6',
                background: 'rgba(139, 92, 246, 0.2)',
                '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
              }}
              title={isPlaying ? 'Pause all' : 'Play all'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </IconButton>
            <IconButton
              onClick={applyRandomSounds}
              sx={{ color: '#888888' }}
              title="Random sounds"
            >
              <SkipForward size={18} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </AudioPanel>
  );
};

// Safe hook for optional context usage
const useOptionalAudio = (): AudioContextType | null => {
  const context = useContext(AudioContext);
  return context ?? null;
};

// Context-based AudioManager (requires AudioProvider)
export const AudioManager: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Safely try to use the audio context
  const audioContext = useOptionalAudio();

  // If no context, render standalone version
  if (!audioContext) {
    return <AudioManagerStandalone />;
  }

  const {
    state,
    toggleSound,
    setMasterVolume,
    setAmbientVolume,
    toggleMute,
    togglePlayback,
    loadingStates,
    errorStates,
  } = audioContext;

  const { masterVolume, ambientVolume, activeSounds, isPlaying, isMuted } = state;

  const clearAllSounds = () => {
    activeSounds.forEach(soundId => {
      toggleSound(soundId);
    });
  };

  const applyRandomSounds = () => {
    // First clear current sounds
    activeSounds.forEach(soundId => {
      toggleSound(soundId);
    });

    // Then add random sounds
    const randomSounds = ambientSounds
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    randomSounds.forEach(sound => {
      if (!activeSounds.includes(sound.id)) {
        toggleSound(sound.id);
      }
    });
  };

  const categories = ['nature', 'cozy', 'atmosphere'];

  return (
    <AudioPanel>
      {/* Mini Player Header */}
      <MiniPlayer onClick={() => setExpanded(!expanded)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            sx={{ color: isMuted ? '#666666' : '#8b5cf6', p: 0.5 }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </IconButton>
          <Box>
            <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem', fontWeight: 500 }}>
              Ambient Sounds
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
              {activeSounds.length} active {isPlaying ? '(playing)' : '(paused)'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SoundWave>
            {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
              <WaveBar key={i} delay={delay} active={isPlaying && !isMuted && activeSounds.length > 0} />
            ))}
          </SoundWave>
          {expanded ? <ChevronDown size={18} color="#888888" /> : <ChevronUp size={18} color="#888888" />}
        </Box>
      </MiniPlayer>

      {/* Expanded Panel */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
          {/* Master Volume */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                Master Volume
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                {masterVolume}%
              </Typography>
            </Box>
            <VolumeSlider
              value={masterVolume}
              onChange={(_, v) => setMasterVolume(v as number)}
              aria-label="Master volume"
            />
          </Box>

          {/* Ambient Volume */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>
                Ambient Volume
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                {ambientVolume}%
              </Typography>
            </Box>
            <VolumeSlider
              value={ambientVolume}
              onChange={(_, v) => setAmbientVolume(v as number)}
              aria-label="Ambient volume"
            />
          </Box>

          {/* Category Filter */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              size="small"
              onClick={() => setActiveCategory(null)}
              sx={{
                background: !activeCategory ? 'rgba(139, 92, 246, 0.3)' : 'rgba(50, 50, 60, 0.5)',
                color: !activeCategory ? '#a78bfa' : '#888888',
              }}
            />
            {categories.map(cat => (
              <Chip
                key={cat}
                label={cat}
                size="small"
                onClick={() => setActiveCategory(cat)}
                sx={{
                  background: activeCategory === cat ? 'rgba(139, 92, 246, 0.3)' : 'rgba(50, 50, 60, 0.5)',
                  color: activeCategory === cat ? '#a78bfa' : '#888888',
                  textTransform: 'capitalize',
                }}
              />
            ))}
          </Box>

          {/* Sound Grid */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '250px', overflowY: 'auto' }}>
            {ambientSounds
              .filter(s => !activeCategory || s.category === activeCategory)
              .map((sound) => {
                const Icon = sound.icon;
                const isActive = activeSounds.includes(sound.id);
                const isLoading = loadingStates[sound.id] || false;
                const hasError = errorStates[sound.id] || null;

                return (
                  <AmbientCard
                    key={sound.id}
                    active={isActive}
                    onClick={() => toggleSound(sound.id)}
                    sx={{
                      opacity: hasError ? 0.5 : 1,
                      cursor: hasError ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: `${sound.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {isLoading ? (
                        <LoadingIndicator>
                          <Loader size={16} color={sound.color} />
                        </LoadingIndicator>
                      ) : (
                        <Icon size={18} color={sound.color} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: isActive ? '#e0e0e0' : '#888888', fontSize: '0.9rem' }}>
                        {sound.name}
                        {hasError && (
                          <Typography component="span" sx={{ color: '#f87171', fontSize: '0.7rem', ml: 1 }}>
                            (unavailable)
                          </Typography>
                        )}
                      </Typography>
                      <Typography sx={{ color: '#666666', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                        {isLoading ? 'Loading...' : sound.category}
                      </Typography>
                    </Box>
                    {isActive && !isLoading && (
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: sound.color,
                          animation: `${pulse} 1.5s ease-in-out infinite`,
                        }}
                      />
                    )}
                  </AmbientCard>
                );
              })}
          </Box>

          {/* Playback Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, pt: 2, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <IconButton
              onClick={clearAllSounds}
              sx={{ color: '#888888' }}
              title="Clear all sounds"
            >
              <Shuffle size={18} />
            </IconButton>
            <IconButton
              onClick={togglePlayback}
              sx={{
                color: '#8b5cf6',
                background: 'rgba(139, 92, 246, 0.2)',
                '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
              }}
              title={isPlaying ? 'Pause all' : 'Play all'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </IconButton>
            <IconButton
              onClick={applyRandomSounds}
              sx={{ color: '#888888' }}
              title="Random sounds"
            >
              <SkipForward size={18} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </AudioPanel>
  );
};

export default AudioManager;
