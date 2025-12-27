// MoodMixer Component
// Generate playlist suggestions based on mood sliders and context

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Slider,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Sparkles,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudMoon,
  Play,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Music,
  Heart,
  Zap,
  Coffee,
  BookOpen,
  Dumbbell,
  Palette,
  Bed,
  PartyPopper,
  Headphones,
  Brain,
  Flame,
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import {
  Track,
  musicLibrary,
  activityPlaylists,
  timeOfDayPlaylists,
  Genre,
  Mood,
} from '../../data/music_library';

// Animations
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

// Types
interface MoodMixerProps {
  onPlaylistGenerated?: (tracks: Track[], name: string) => void;
  onTrackPlay?: (track: Track) => void;
  compact?: boolean;
}

interface Activity {
  id: string;
  name: string;
  icon: React.FC<{ size?: number; color?: string }>;
  color: string;
}

interface TimeOfDay {
  id: string;
  name: string;
  icon: React.FC<{ size?: number; color?: string }>;
  color: string;
  hours: [number, number];
}

// Styled Components
const Container = styled(Box)({
  padding: '24px',
  background: 'linear-gradient(180deg, rgba(10, 8, 18, 0.95) 0%, rgba(20, 16, 32, 0.98) 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const Title = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.8rem',
  color: '#d4af37',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const SparkleIcon = styled(Box)({
  animation: `${pulse} 2s ease-in-out infinite`,
});

const Section = styled(Box)({
  marginBottom: '28px',
});

const SectionTitle = styled(Typography)({
  color: '#a78bfa',
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const SliderContainer = styled(Box)({
  padding: '0 12px',
});

const SliderLabel = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const SliderEndLabel = styled(Typography)({
  fontSize: '0.85rem',
  color: '#888888',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const MoodSlider = styled(Slider)<{ sliderColor?: string }>(({ sliderColor = '#8b5cf6' }) => ({
  color: sliderColor,
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
    background: `linear-gradient(90deg, ${sliderColor}, ${sliderColor}cc)`,
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(100, 100, 120, 0.3)',
  },
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: sliderColor,
    boxShadow: `0 0 15px ${sliderColor}80`,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: `0 0 20px ${sliderColor}`,
    },
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: sliderColor,
  },
}));

const ActivityGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: '12px',
});

const ActivityButton = styled(Box)<{ selected: boolean; buttonColor: string }>(({ selected, buttonColor }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '16px 12px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: selected ? `${buttonColor}30` : 'rgba(26, 16, 40, 0.6)',
  border: selected ? `2px solid ${buttonColor}` : '2px solid transparent',
  '&:hover': {
    background: `${buttonColor}20`,
    transform: 'translateY(-2px)',
  },
}));

const ActivityLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: '#e0e0e0',
  textAlign: 'center',
});

const TimeGrid = styled(Box)({
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
});

const TimeButton = styled(Box)<{ selected: boolean; buttonColor: string }>(({ selected, buttonColor }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: selected ? buttonColor : 'rgba(26, 16, 40, 0.6)',
  border: `1px solid ${buttonColor}`,
  '&:hover': {
    background: selected ? buttonColor : `${buttonColor}30`,
  },
}));

const ResultsContainer = styled(Box)({
  marginTop: '24px',
  padding: '20px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(212, 175, 55, 0.05))',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const TrackList = styled(Box)({
  maxHeight: '300px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(139, 92, 246, 0.3)',
    borderRadius: '3px',
  },
});

const TrackItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.15)',
  },
});

const MoodIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(26, 16, 40, 0.8)',
  marginBottom: '20px',
});

const MoodCircle = styled(Box)<{ moodValue: number }>(({ moodValue }) => {
  // Generate color based on mood value (0-100)
  const hue = 270 - (moodValue * 0.6); // Purple to orange
  const saturation = 60 + (moodValue * 0.2);
  return {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: `hsl(${hue}, ${saturation}%, 50%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 0 30px hsla(${hue}, ${saturation}%, 50%, 0.5)`,
    animation: `${glow} 3s ease-in-out infinite`,
  };
});

const ExpandButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '8px',
  cursor: 'pointer',
  color: '#888888',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#a78bfa',
  },
});

// Constants
const activities: Activity[] = [
  { id: 'studying', name: 'Studying', icon: BookOpen, color: '#8b5cf6' },
  { id: 'relaxing', name: 'Relaxing', icon: Coffee, color: '#60a5fa' },
  { id: 'working', name: 'Working', icon: Brain, color: '#10b981' },
  { id: 'exercising', name: 'Exercise', icon: Dumbbell, color: '#ef4444' },
  { id: 'sleeping', name: 'Sleeping', icon: Bed, color: '#6366f1' },
  { id: 'cooking', name: 'Cooking', icon: Flame, color: '#f59e0b' },
  { id: 'meditating', name: 'Meditating', icon: Sparkles, color: '#a855f7' },
  { id: 'partying', name: 'Partying', icon: PartyPopper, color: '#ec4899' },
  { id: 'reading', name: 'Reading', icon: BookOpen, color: '#d4af37' },
  { id: 'romantic', name: 'Romantic', icon: Heart, color: '#f472b6' },
];

const timesOfDay: TimeOfDay[] = [
  { id: 'morning', name: 'Morning', icon: Sunrise, color: '#f59e0b', hours: [6, 11] },
  { id: 'afternoon', name: 'Afternoon', icon: Sun, color: '#fbbf24', hours: [12, 17] },
  { id: 'evening', name: 'Evening', icon: Sunset, color: '#f97316', hours: [18, 21] },
  { id: 'night', name: 'Night', icon: Moon, color: '#8b5cf6', hours: [22, 1] },
  { id: 'latenight', name: 'Late Night', icon: CloudMoon, color: '#6366f1', hours: [2, 5] },
];

const getCurrentTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  if (hour >= 22 || hour < 2) return 'night';
  return 'latenight';
};

export const MoodMixer: React.FC<MoodMixerProps> = ({
  onPlaylistGenerated,
  onTrackPlay,
  compact = false,
}) => {
  // Mood sliders (0-100)
  const [energyLevel, setEnergyLevel] = useState(50); // calm <-> energetic
  const [darknessLevel, setDarknessLevel] = useState(50); // light <-> dark
  const [tempoPreference, setTempoPreference] = useState(50); // slow <-> fast

  // Context selections
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>(getCurrentTimeOfDay());

  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState('');

  // Calculate mood description
  const getMoodDescription = useMemo(() => {
    const energy = energyLevel > 60 ? 'energetic' : energyLevel < 40 ? 'calm' : 'balanced';
    const darkness = darknessLevel > 60 ? 'dark' : darknessLevel < 40 ? 'light' : 'neutral';
    const tempo = tempoPreference > 60 ? 'upbeat' : tempoPreference < 40 ? 'slow' : 'moderate';

    const descriptions: Record<string, string> = {
      'energetic-dark-upbeat': 'Intense & Powerful',
      'energetic-dark-slow': 'Dark & Building',
      'energetic-dark-moderate': 'Mysterious Energy',
      'energetic-light-upbeat': 'Bright & Energetic',
      'energetic-light-slow': 'Hopeful Rising',
      'energetic-light-moderate': 'Uplifting Vibes',
      'energetic-neutral-upbeat': 'High Energy',
      'energetic-neutral-slow': 'Focused Power',
      'energetic-neutral-moderate': 'Balanced Energy',
      'calm-dark-upbeat': 'Gothic Groove',
      'calm-dark-slow': 'Deep & Atmospheric',
      'calm-dark-moderate': 'Moody & Reflective',
      'calm-light-upbeat': 'Gentle Joy',
      'calm-light-slow': 'Peaceful Dreams',
      'calm-light-moderate': 'Serene Moments',
      'calm-neutral-upbeat': 'Easy Going',
      'calm-neutral-slow': 'Quiet Contemplation',
      'calm-neutral-moderate': 'Relaxed Flow',
      'balanced-dark-upbeat': 'Dramatic Rhythm',
      'balanced-dark-slow': 'Cinematic Mood',
      'balanced-dark-moderate': 'Noir Vibes',
      'balanced-light-upbeat': 'Feel Good',
      'balanced-light-slow': 'Soft & Sweet',
      'balanced-light-moderate': 'Easy Listening',
      'balanced-neutral-upbeat': 'Everyday Energy',
      'balanced-neutral-slow': 'Mellow Mix',
      'balanced-neutral-moderate': 'Perfect Balance',
    };

    return descriptions[`${energy}-${darkness}-${tempo}`] || 'Custom Mix';
  }, [energyLevel, darknessLevel, tempoPreference]);

  // Generate playlist based on current settings
  const generatePlaylist = useCallback(() => {
    let candidateTracks = [...musicLibrary];

    // Filter by activity if selected
    if (selectedActivity && activityPlaylists[selectedActivity]) {
      const activityPrefs = activityPlaylists[selectedActivity];
      candidateTracks = candidateTracks.filter(track =>
        activityPrefs.genres.includes(track.genre) ||
        track.mood.some(m => activityPrefs.moods.includes(m))
      );
    }

    // Filter by time of day
    if (selectedTime && timeOfDayPlaylists[selectedTime]) {
      const timePrefs = timeOfDayPlaylists[selectedTime];
      // Weight tracks that match time preferences
      candidateTracks = candidateTracks.map(track => ({
        track,
        score: (
          (timePrefs.genres.includes(track.genre) ? 2 : 0) +
          (track.mood.some(m => timePrefs.moods.includes(m)) ? 2 : 0)
        ),
      }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.track);
    }

    // Score tracks based on mood sliders
    const scoredTracks = candidateTracks.map(track => {
      let score = 0;

      // Energy level matching
      const trackEnergy = track.energy === 'high' ? 80 : track.energy === 'medium' ? 50 : 20;
      score -= Math.abs(trackEnergy - energyLevel) * 0.5;

      // Darkness matching
      const darkMoods: Mood[] = ['dark', 'mysterious', 'haunting', 'melancholic'];
      const lightMoods: Mood[] = ['uplifting', 'romantic', 'calm', 'dreamy'];
      const trackDarkness = track.mood.some(m => darkMoods.includes(m)) ? 70 :
        track.mood.some(m => lightMoods.includes(m)) ? 30 : 50;
      score -= Math.abs(trackDarkness - darknessLevel) * 0.4;

      // Tempo matching
      const trackTempo = track.tempo === 'fast' ? 80 : track.tempo === 'medium' ? 50 : 20;
      score -= Math.abs(trackTempo - tempoPreference) * 0.3;

      // Bonus for variety
      score += Math.random() * 10;

      return { track, score };
    });

    // Sort by score and take top tracks
    const selectedTracks = scoredTracks
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => item.track);

    // Shuffle for variety while keeping some order
    const shuffled = selectedTracks
      .map((track, index) => ({ track, sort: Math.random() + (index < 5 ? 0.5 : 0) }))
      .sort((a, b) => b.sort - a.sort)
      .map(item => item.track);

    // Generate playlist name
    const activityName = selectedActivity
      ? activities.find(a => a.id === selectedActivity)?.name
      : '';
    const timeName = timesOfDay.find(t => t.id === selectedTime)?.name || '';
    const name = activityName
      ? `${getMoodDescription} ${activityName}`
      : `${getMoodDescription} - ${timeName}`;

    setGeneratedTracks(shuffled);
    setPlaylistName(name);
    onPlaylistGenerated?.(shuffled, name);
  }, [energyLevel, darknessLevel, tempoPreference, selectedActivity, selectedTime, getMoodDescription, onPlaylistGenerated]);

  // Auto-generate on significant changes
  const handleSliderChange = useCallback((setter: (value: number) => void) => (
    _event: Event,
    value: number | number[]
  ) => {
    setter(value as number);
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          <SparkleIcon>
            <Sparkles size={28} color="#d4af37" />
          </SparkleIcon>
          {compact ? 'Mood Mixer' : 'Mood Mixer'}
        </Title>
        <GothicButton
          variant="primary"
          startIcon={<RefreshCw size={18} />}
          onClick={generatePlaylist}
        >
          Generate
        </GothicButton>
      </Header>

      {/* Mood Indicator */}
      <MoodIndicator>
        <MoodCircle moodValue={(energyLevel + (100 - darknessLevel)) / 2}>
          <Music size={24} color="#fff" />
        </MoodCircle>
        <Box>
          <Typography sx={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 600 }}>
            {getMoodDescription}
          </Typography>
          <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
            Based on your current mood settings
          </Typography>
        </Box>
      </MoodIndicator>

      {/* Energy Slider */}
      <Section>
        <SectionTitle>
          <Zap size={18} />
          Energy Level
        </SectionTitle>
        <SliderContainer>
          <SliderLabel>
            <SliderEndLabel>
              <Coffee size={16} /> Calm
            </SliderEndLabel>
            <SliderEndLabel>
              Energetic <Zap size={16} />
            </SliderEndLabel>
          </SliderLabel>
          <MoodSlider
            value={energyLevel}
            onChange={handleSliderChange(setEnergyLevel)}
            sliderColor={energyLevel > 60 ? '#f97316' : energyLevel < 40 ? '#60a5fa' : '#8b5cf6'}
          />
        </SliderContainer>
      </Section>

      {/* Darkness Slider */}
      <Section>
        <SectionTitle>
          <Moon size={18} />
          Mood Tone
        </SectionTitle>
        <SliderContainer>
          <SliderLabel>
            <SliderEndLabel>
              <Sun size={16} /> Light
            </SliderEndLabel>
            <SliderEndLabel>
              Dark <Moon size={16} />
            </SliderEndLabel>
          </SliderLabel>
          <MoodSlider
            value={darknessLevel}
            onChange={handleSliderChange(setDarknessLevel)}
            sliderColor={darknessLevel > 60 ? '#7c2d12' : darknessLevel < 40 ? '#fbbf24' : '#a855f7'}
          />
        </SliderContainer>
      </Section>

      {/* Advanced Options */}
      <ExpandButton onClick={() => setShowAdvanced(!showAdvanced)}>
        <Typography sx={{ fontSize: '0.9rem' }}>
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </Typography>
        {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </ExpandButton>

      <Collapse in={showAdvanced}>
        {/* Tempo Slider */}
        <Section>
          <SectionTitle>
            <Headphones size={18} />
            Tempo Preference
          </SectionTitle>
          <SliderContainer>
            <SliderLabel>
              <SliderEndLabel>Slow</SliderEndLabel>
              <SliderEndLabel>Fast</SliderEndLabel>
            </SliderLabel>
            <MoodSlider
              value={tempoPreference}
              onChange={handleSliderChange(setTempoPreference)}
              sliderColor="#10b981"
            />
          </SliderContainer>
        </Section>
      </Collapse>

      {/* Time of Day */}
      <Section>
        <SectionTitle>
          <Sun size={18} />
          Time of Day
        </SectionTitle>
        <TimeGrid>
          {timesOfDay.map(time => {
            const Icon = time.icon;
            return (
              <TimeButton
                key={time.id}
                selected={selectedTime === time.id}
                buttonColor={time.color}
                onClick={() => setSelectedTime(time.id)}
              >
                <Icon size={18} color={selectedTime === time.id ? '#fff' : time.color} />
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    color: selectedTime === time.id ? '#fff' : '#e0e0e0',
                    fontWeight: selectedTime === time.id ? 600 : 400,
                  }}
                >
                  {time.name}
                </Typography>
              </TimeButton>
            );
          })}
        </TimeGrid>
      </Section>

      {/* Activity Selection */}
      <Section>
        <SectionTitle>
          <Palette size={18} />
          Activity (Optional)
        </SectionTitle>
        <ActivityGrid>
          {activities.map(activity => {
            const Icon = activity.icon;
            return (
              <ActivityButton
                key={activity.id}
                selected={selectedActivity === activity.id}
                buttonColor={activity.color}
                onClick={() =>
                  setSelectedActivity(selectedActivity === activity.id ? null : activity.id)
                }
              >
                <Icon
                  size={24}
                  color={selectedActivity === activity.id ? activity.color : '#888888'}
                />
                <ActivityLabel>{activity.name}</ActivityLabel>
              </ActivityButton>
            );
          })}
        </ActivityGrid>
      </Section>

      {/* Generated Results */}
      {generatedTracks.length > 0 && (
        <ResultsContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography sx={{ color: '#d4af37', fontSize: '1.1rem', fontWeight: 600 }}>
                {playlistName}
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                {generatedTracks.length} tracks generated
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Regenerate">
                <IconButton onClick={generatePlaylist} sx={{ color: '#a78bfa' }}>
                  <RefreshCw size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <TrackList>
            {generatedTracks.map((track, index) => (
              <TrackItem key={track.id} onClick={() => onTrackPlay?.(track)}>
                <Typography sx={{ color: '#666666', width: '24px', textAlign: 'center' }}>
                  {index + 1}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    {track.title}
                  </Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                    {track.artist}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {track.mood.slice(0, 2).map(m => (
                    <Chip
                      key={m}
                      label={m}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        color: '#a78bfa',
                        fontSize: '0.65rem',
                        height: '18px',
                      }}
                    />
                  ))}
                </Box>
                <Tooltip title="Play">
                  <IconButton size="small" sx={{ color: '#10b981' }}>
                    <Play size={16} />
                  </IconButton>
                </Tooltip>
              </TrackItem>
            ))}
          </TrackList>
        </ResultsContainer>
      )}
    </Container>
  );
};

export default MoodMixer;
