// CookingTimer.tsx - Multiple simultaneous cooking timers
// Part of the Gothic Dollhouse Kitchen Lab

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Slider,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  Trash2,
  Volume2,
  VolumeX,
  Clock,
  ChefHat,
  Flame,
  Coffee,
  Soup,
  Egg,
  Croissant,
  Pizza,
  History,
  Bell,
  BellOff,
} from 'lucide-react';

// Types
interface CookingTimerData {
  id: string;
  name: string;
  duration: number; // total seconds
  remaining: number; // remaining seconds
  isRunning: boolean;
  createdAt: number;
  completedAt?: number;
  color: string;
  icon: string;
}

interface TimerPreset {
  name: string;
  duration: number; // seconds
  icon: string;
  color: string;
}

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0f0a18 100%)',
  padding: '24px',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
  borderRadius: '16px',
  padding: '24px 32px',
  marginBottom: '24px',
  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4)',
});

const TimerCard = styled(Paper)<{ isComplete?: boolean; isRunning?: boolean }>(({ isComplete, isRunning }) => ({
  background: isComplete
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)'
    : 'rgba(26, 16, 40, 0.6)',
  borderRadius: '20px',
  border: isComplete
    ? '2px solid #ef4444'
    : isRunning
    ? '2px solid #22c55e'
    : '1px solid rgba(139, 92, 246, 0.2)',
  padding: '24px',
  transition: 'all 0.3s ease',
  animation: isComplete ? `${glow} 1s ease-in-out infinite, ${shake} 0.5s ease-in-out infinite` : `${fadeIn} 0.5s ease-out`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.2)',
  },
}));

const TimerDisplay = styled(Box)<{ isRunning?: boolean }>(({ isRunning }) => ({
  fontSize: '3.5rem',
  fontFamily: '"Courier New", monospace',
  fontWeight: 700,
  textAlign: 'center',
  color: '#ffffff',
  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
  letterSpacing: '4px',
  animation: isRunning ? `${pulse} 2s ease-in-out infinite` : 'none',
}));

const ProgressRing = styled(Box)<{ progress: number; color: string }>(({ progress, color }) => ({
  position: 'relative',
  width: '200px',
  height: '200px',
  margin: '0 auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: `conic-gradient(${color} ${progress}%, rgba(139, 92, 246, 0.2) ${progress}%)`,
    filter: 'blur(0px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: 'rgba(26, 16, 40, 0.9)',
  },
}));

const PresetButton = styled(Button)<{ presetColor: string }>(({ presetColor }) => ({
  background: `${presetColor}20`,
  border: `1px solid ${presetColor}50`,
  color: presetColor,
  borderRadius: '12px',
  padding: '12px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `${presetColor}30`,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${presetColor}30`,
  },
}));

const HistoryItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(26, 16, 40, 0.6)',
  marginBottom: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
});

// Timer presets
const timerPresets: TimerPreset[] = [
  { name: 'Soft Boiled Egg', duration: 360, icon: '🥚', color: '#eab308' },
  { name: 'Hard Boiled Egg', duration: 720, icon: '🥚', color: '#f97316' },
  { name: 'Toast', duration: 180, icon: '🍞', color: '#d4af37' },
  { name: 'Pasta (al dente)', duration: 540, icon: '🍝', color: '#ef4444' },
  { name: 'Rice', duration: 1200, icon: '🍚', color: '#ffffff' },
  { name: 'Steep Tea', duration: 300, icon: '🍵', color: '#22c55e' },
  { name: 'French Press Coffee', duration: 240, icon: '☕', color: '#8b4513' },
  { name: 'Resting Meat', duration: 600, icon: '🥩', color: '#dc2626' },
  { name: 'Pizza', duration: 900, icon: '🍕', color: '#f97316' },
  { name: 'Cookies', duration: 720, icon: '🍪', color: '#d4af37' },
  { name: 'Brownies', duration: 1500, icon: '🍫', color: '#7c3aed' },
  { name: 'Roast Chicken', duration: 3600, icon: '🍗', color: '#f59e0b' },
];

// Helper functions
const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const generateId = (): string => `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const timerColors = ['#8b5cf6', '#22c55e', '#f97316', '#ec4899', '#3b82f6', '#eab308', '#ef4444', '#06b6d4'];

// Main Component
interface CookingTimerProps {
  onClose?: () => void;
}

export const CookingTimer: React.FC<CookingTimerProps> = ({ onClose }) => {
  // State
  const [timers, setTimers] = useState<CookingTimerData[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerMinutes, setNewTimerMinutes] = useState(5);
  const [newTimerSeconds, setNewTimerSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [history, setHistory] = useState<CookingTimerData[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedTimers = localStorage.getItem('gothic-cooking-timers');
    const savedHistory = localStorage.getItem('gothic-timer-history');
    const savedSound = localStorage.getItem('gothic-timer-sound');

    if (savedTimers) {
      const parsed = JSON.parse(savedTimers);
      // Reset running state for all timers on load
      setTimers(parsed.map((t: CookingTimerData) => ({ ...t, isRunning: false })));
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gothic-cooking-timers', JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    localStorage.setItem('gothic-timer-history', JSON.stringify(history.slice(0, 20)));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('gothic-timer-sound', String(soundEnabled));
  }, [soundEnabled]);

  // Timer tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev =>
        prev.map(timer => {
          if (timer.isRunning && timer.remaining > 0) {
            const newRemaining = timer.remaining - 1;
            if (newRemaining === 0) {
              // Timer complete
              playAlarm();
              return { ...timer, remaining: 0, isRunning: false, completedAt: Date.now() };
            }
            return { ...timer, remaining: newRemaining };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Play alarm sound
  const playAlarm = () => {
    if (soundEnabled) {
      // Create beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.5;

      oscillator.start();

      // Beep pattern
      let beepCount = 0;
      const beepInterval = setInterval(() => {
        if (beepCount >= 6) {
          clearInterval(beepInterval);
          oscillator.stop();
          return;
        }
        gainNode.gain.value = beepCount % 2 === 0 ? 0.5 : 0;
        beepCount++;
      }, 200);
    }
  };

  // Timer actions
  const addTimer = (name: string, duration: number, icon: string = '⏰', color?: string) => {
    const newTimer: CookingTimerData = {
      id: generateId(),
      name,
      duration,
      remaining: duration,
      isRunning: false,
      createdAt: Date.now(),
      color: color || timerColors[timers.length % timerColors.length],
      icon,
    };
    setTimers(prev => [...prev, newTimer]);
  };

  const addCustomTimer = () => {
    const totalSeconds = newTimerMinutes * 60 + newTimerSeconds;
    if (totalSeconds > 0) {
      addTimer(newTimerName || 'Custom Timer', totalSeconds);
      setNewTimerName('');
      setNewTimerMinutes(5);
      setNewTimerSeconds(0);
      setShowAddDialog(false);
    }
  };

  const toggleTimer = (id: string) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
      )
    );
  };

  const resetTimer = (id: string) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id
          ? { ...timer, remaining: timer.duration, isRunning: false, completedAt: undefined }
          : timer
      )
    );
  };

  const deleteTimer = (id: string) => {
    const timer = timers.find(t => t.id === id);
    if (timer) {
      setHistory(prev => [timer, ...prev].slice(0, 20));
    }
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const restoreFromHistory = (timer: CookingTimerData) => {
    addTimer(timer.name, timer.duration, timer.icon, timer.color);
    setShowHistoryDialog(false);
  };

  const clearAllTimers = () => {
    setHistory(prev => [...timers, ...prev].slice(0, 20));
    setTimers([]);
  };

  // Get progress percentage
  const getProgress = (timer: CookingTimerData): number => {
    if (timer.duration === 0) return 0;
    return ((timer.duration - timer.remaining) / timer.duration) * 100;
  };

  // Active timers count
  const activeCount = timers.filter(t => t.isRunning).length;
  const completedCount = timers.filter(t => t.remaining === 0).length;

  return (
    <Container>
      {/* Header */}
      <Header>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Timer size={40} color="#ffffff" />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontFamily: '"Cinzel", serif', color: '#ffffff', fontWeight: 700 }}
              >
                Cooking Timers
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {timers.length} timer{timers.length !== 1 ? 's' : ''} • {activeCount} active
                {completedCount > 0 && ` • ${completedCount} done!`}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <IconButton
              onClick={() => setSoundEnabled(!soundEnabled)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                '&:hover': { background: 'rgba(255,255,255,0.3)' },
              }}
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </IconButton>
            <Button
              startIcon={<History size={20} />}
              onClick={() => setShowHistoryDialog(true)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                '&:hover': { background: 'rgba(255,255,255,0.3)' },
              }}
            >
              History
            </Button>
            <Button
              startIcon={<Plus size={20} />}
              onClick={() => setShowAddDialog(true)}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                color: '#f97316',
                fontWeight: 600,
                '&:hover': { background: '#ffffff' },
              }}
            >
              New Timer
            </Button>
          </Stack>
        </Stack>
      </Header>

      {/* Quick Presets */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ color: '#d4af37', mb: 2, fontWeight: 600, fontFamily: '"Cinzel", serif' }}>
          Quick Presets
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {timerPresets.map(preset => (
            <PresetButton
              key={preset.name}
              presetColor={preset.color}
              onClick={() => addTimer(preset.name, preset.duration, preset.icon, preset.color)}
            >
              <span style={{ marginRight: 8, fontSize: '1.2rem' }}>{preset.icon}</span>
              {preset.name}
              <Chip
                label={formatTime(preset.duration)}
                size="small"
                sx={{
                  ml: 1,
                  height: '20px',
                  fontSize: '0.7rem',
                  background: `${preset.color}30`,
                  color: preset.color,
                }}
              />
            </PresetButton>
          ))}
        </Stack>
      </Box>

      {/* Active Timers */}
      {timers.length > 0 ? (
        <Grid container spacing={3}>
          {timers.map(timer => (
            <Grid item xs={12} sm={6} md={4} key={timer.id}>
              <TimerCard isComplete={timer.remaining === 0} isRunning={timer.isRunning}>
                {/* Timer Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span style={{ fontSize: '1.5rem' }}>{timer.icon}</span>
                    <Typography sx={{ color: timer.color, fontWeight: 600 }}>
                      {timer.name}
                    </Typography>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={() => deleteTimer(timer.id)}
                    sx={{ color: 'rgba(239, 68, 68, 0.6)', '&:hover': { color: '#ef4444' } }}
                  >
                    <X size={18} />
                  </IconButton>
                </Stack>

                {/* Progress Ring */}
                <ProgressRing progress={getProgress(timer)} color={timer.color}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                      textAlign: 'center',
                    }}
                  >
                    <TimerDisplay isRunning={timer.isRunning}>
                      {formatTime(timer.remaining)}
                    </TimerDisplay>
                    {timer.remaining === 0 && (
                      <Typography sx={{ color: '#ef4444', fontWeight: 600, mt: 1 }}>
                        DONE!
                      </Typography>
                    )}
                  </Box>
                </ProgressRing>

                {/* Progress Bar */}
                <LinearProgress
                  variant="determinate"
                  value={getProgress(timer)}
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(139, 92, 246, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: timer.remaining === 0
                        ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                        : `linear-gradient(90deg, ${timer.color}, ${timer.color}aa)`,
                      borderRadius: 4,
                    },
                  }}
                />

                {/* Controls */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <IconButton
                    onClick={() => toggleTimer(timer.id)}
                    disabled={timer.remaining === 0}
                    sx={{
                      background: timer.isRunning
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(34, 197, 94, 0.2)',
                      color: timer.isRunning ? '#ef4444' : '#22c55e',
                      width: 56,
                      height: 56,
                      '&:hover': {
                        background: timer.isRunning
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(34, 197, 94, 0.3)',
                      },
                      '&:disabled': {
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: 'rgba(139, 92, 246, 0.3)',
                      },
                    }}
                  >
                    {timer.isRunning ? <Pause size={28} /> : <Play size={28} />}
                  </IconButton>
                  <IconButton
                    onClick={() => resetTimer(timer.id)}
                    sx={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#a78bfa',
                      width: 56,
                      height: 56,
                      '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
                    }}
                  >
                    <RotateCcw size={24} />
                  </IconButton>
                </Stack>

                {/* Original Duration */}
                <Typography
                  sx={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.8rem',
                    mt: 2,
                  }}
                >
                  Original: {formatTime(timer.duration)}
                </Typography>
              </TimerCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Timer size={64} color="#8b5cf6" style={{ opacity: 0.5 }} />
          <Typography sx={{ color: 'rgba(139, 92, 246, 0.7)', mt: 2, fontSize: '1.2rem' }}>
            No active timers
          </Typography>
          <Typography sx={{ color: 'rgba(139, 92, 246, 0.5)', mt: 1 }}>
            Use a preset above or create a custom timer
          </Typography>
        </Box>
      )}

      {/* Clear All Button */}
      {timers.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            startIcon={<Trash2 size={20} />}
            onClick={clearAllTimers}
            sx={{
              color: 'rgba(239, 68, 68, 0.7)',
              '&:hover': { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' },
            }}
          >
            Clear All Timers
          </Button>
        </Box>
      )}

      {/* Add Timer Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#ffffff',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
              Create Custom Timer
            </Typography>
            <IconButton onClick={() => setShowAddDialog(false)}>
              <X color="#8b5cf6" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Timer Name (optional)"
              value={newTimerName}
              onChange={(e) => setNewTimerName(e.target.value)}
              placeholder="e.g., Baking cookies"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: '#8b5cf6' },
                  '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              }}
            />

            <Box>
              <Typography sx={{ color: '#d4af37', mb: 2 }}>Minutes: {newTimerMinutes}</Typography>
              <Slider
                value={newTimerMinutes}
                onChange={(_, value) => setNewTimerMinutes(value as number)}
                min={0}
                max={120}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 30, label: '30' },
                  { value: 60, label: '60' },
                  { value: 90, label: '90' },
                  { value: 120, label: '120' },
                ]}
                sx={{
                  color: '#8b5cf6',
                  '& .MuiSlider-markLabel': { color: 'rgba(255,255,255,0.5)' },
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ color: '#d4af37', mb: 2 }}>Seconds: {newTimerSeconds}</Typography>
              <Slider
                value={newTimerSeconds}
                onChange={(_, value) => setNewTimerSeconds(value as number)}
                min={0}
                max={59}
                step={5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 15, label: '15' },
                  { value: 30, label: '30' },
                  { value: 45, label: '45' },
                ]}
                sx={{
                  color: '#8b5cf6',
                  '& .MuiSlider-markLabel': { color: 'rgba(255,255,255,0.5)' },
                }}
              />
            </Box>

            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                Total Duration
              </Typography>
              <Typography sx={{ color: '#d4af37', fontSize: '2rem', fontFamily: 'monospace' }}>
                {formatTime(newTimerMinutes * 60 + newTimerSeconds)}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowAddDialog(false)} sx={{ color: '#a78bfa' }}>
            Cancel
          </Button>
          <Button
            onClick={addCustomTimer}
            disabled={newTimerMinutes === 0 && newTimerSeconds === 0}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              '&:hover': { background: 'linear-gradient(135deg, #ea580c, #f97316)' },
            }}
          >
            Start Timer
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#ffffff',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
              Timer History
            </Typography>
            <IconButton onClick={() => setShowHistoryDialog(false)}>
              <X color="#8b5cf6" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {history.length > 0 ? (
            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {history.map((timer, idx) => (
                <HistoryItem key={`${timer.id}-${idx}`}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <span style={{ fontSize: '1.2rem' }}>{timer.icon}</span>
                    <Box>
                      <Typography sx={{ color: timer.color, fontWeight: 600 }}>
                        {timer.name}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        {formatTime(timer.duration)}
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    size="small"
                    onClick={() => restoreFromHistory(timer)}
                    sx={{ color: '#22c55e' }}
                  >
                    Use Again
                  </Button>
                </HistoryItem>
              ))}
            </Box>
          ) : (
            <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', py: 4 }}>
              No timer history yet
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CookingTimer;
