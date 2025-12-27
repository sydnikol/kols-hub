// Gothic Journal Component
// Personal journaling with mood tracking, dream diary, and gratitude practice

import React, { useState } from 'react';
import { Box, Typography, Grid, Chip, TextField, Slider, IconButton, Tabs, Tab } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  BookOpen, Moon, Heart, Sparkles, Sun, Cloud, CloudRain,
  Zap, Star, Feather, Edit3, Calendar, Clock, Lock,
  Unlock, Search, Tag, TrendingUp, Flame, Coffee
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const JournalContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const JournalBook = styled(GothicCard)({
  background: 'linear-gradient(135deg, #1a1428 0%, #2a1a38 100%)',
  borderLeft: '8px solid #8b5cf6',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '30px',
    top: 0,
    bottom: 0,
    width: '1px',
    background: 'rgba(139, 92, 246, 0.3)',
  },
});

const MoodButton = styled(Box)<{ selected: boolean; moodColor: string }>(({ selected, moodColor }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1.8rem',
  background: selected ? `${moodColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `3px solid ${moodColor}` : '2px solid rgba(100, 100, 120, 0.3)',
  transition: 'all 0.3s ease',
  animation: selected ? `${glow} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    background: `${moodColor}20`,
  },
}));

const DreamCard = styled(GothicCard)({
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  borderTop: '3px solid #8b5cf6',
});

const GratitudeItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  background: 'rgba(16, 185, 129, 0.1)',
  borderRadius: '8px',
  marginBottom: '8px',
  borderLeft: '3px solid #10b981',
});

const StatCard = styled(Box)<{ color: string }>(({ color }) => ({
  textAlign: 'center',
  padding: '16px',
  borderRadius: '12px',
  background: `${color}10`,
  border: `1px solid ${color}30`,
}));

const moods = [
  { id: 'radiant', emoji: '✨', label: 'Radiant', color: '#f59e0b' },
  { id: 'peaceful', emoji: '🌸', label: 'Peaceful', color: '#ec4899' },
  { id: 'content', emoji: '☀️', label: 'Content', color: '#10b981' },
  { id: 'neutral', emoji: '🌙', label: 'Neutral', color: '#8b5cf6' },
  { id: 'tired', emoji: '🌧️', label: 'Tired', color: '#6366f1' },
  { id: 'anxious', emoji: '⚡', label: 'Anxious', color: '#f97316' },
  { id: 'melancholy', emoji: '🥀', label: 'Melancholy', color: '#a855f7' },
  { id: 'struggling', emoji: '🌊', label: 'Struggling', color: '#3b82f6' },
];

const dreamSymbols = [
  { symbol: '🦋', meaning: 'Transformation' },
  { symbol: '🗝️', meaning: 'Hidden knowledge' },
  { symbol: '🌊', meaning: 'Emotions' },
  { symbol: '🔮', meaning: 'Intuition' },
  { symbol: '🌹', meaning: 'Love/Beauty' },
  { symbol: '🦉', meaning: 'Wisdom' },
  { symbol: '🌙', meaning: 'The unconscious' },
  { symbol: '🚪', meaning: 'Opportunities' },
  { symbol: '🕯️', meaning: 'Guidance' },
  { symbol: '🪞', meaning: 'Self-reflection' },
];

const journalPrompts = [
  "What brought you unexpected joy today?",
  "Describe a moment of peace you experienced recently.",
  "What are you learning about yourself?",
  "Write about a small victory, no matter how tiny.",
  "What would you tell your past self?",
  "Describe your ideal sanctuary.",
  "What boundaries are you working on?",
  "Write a letter to your future self.",
  "What patterns are you noticing in your life?",
  "Describe something beautiful you witnessed today.",
];

const recentEntries = [
  {
    id: 1,
    date: 'December 24, 2024',
    type: 'mood',
    mood: 'peaceful',
    title: 'Winter Solstice Reflections',
    preview: 'The longest night brought clarity...',
    tags: ['reflection', 'solstice', 'peace'],
    private: true,
  },
  {
    id: 2,
    date: 'December 23, 2024',
    type: 'dream',
    title: 'The Library of Forgotten Things',
    preview: 'I found myself in an infinite library where books wrote themselves...',
    tags: ['vivid', 'library', 'mystery'],
    private: false,
  },
  {
    id: 3,
    date: 'December 22, 2024',
    type: 'gratitude',
    title: 'Three Good Things',
    preview: 'Hot tea on a cold morning, a kind message from a friend...',
    tags: ['daily', 'gratitude'],
    private: false,
  },
];

const weeklyMoodData = [
  { day: 'Mon', mood: 'content', value: 7 },
  { day: 'Tue', mood: 'peaceful', value: 8 },
  { day: 'Wed', mood: 'tired', value: 4 },
  { day: 'Thu', mood: 'anxious', value: 5 },
  { day: 'Fri', mood: 'content', value: 7 },
  { day: 'Sat', mood: 'radiant', value: 9 },
  { day: 'Sun', mood: 'peaceful', value: 8 },
];

export const GothicJournal: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [journalText, setJournalText] = useState('');
  const [dreamText, setDreamText] = useState('');
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', '']);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const getMoodColor = (moodId: string) => {
    return moods.find(m => m.id === moodId)?.color || '#888888';
  };

  const getRandomPrompt = () => {
    const prompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setSelectedPrompt(prompt);
  };

  return (
    <JournalContainer>
      <HeaderSection>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#8b5cf6',
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            mb: 1,
          }}
        >
          <BookOpen size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Gothic Journal
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Your private sanctuary for reflection and growth
        </Typography>
      </HeaderSection>

      {/* Stats Overview */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard color="#8b5cf6">
            <Flame size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>
              23
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Day Streak</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#10b981">
            <Edit3 size={24} color="#10b981" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
              147
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Total Entries</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#ec4899">
            <Moon size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>
              34
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Dreams Logged</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#f59e0b">
            <Heart size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>
              89
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Gratitudes</Typography>
          </StatCard>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Main Journal Area */}
        <Grid item xs={12} md={8}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              mb: 3,
              '& .MuiTab-root': { color: '#888888' },
              '& .Mui-selected': { color: '#8b5cf6' },
              '& .MuiTabs-indicator': { backgroundColor: '#8b5cf6' },
            }}
          >
            <Tab icon={<Feather size={18} />} label="Free Write" />
            <Tab icon={<Moon size={18} />} label="Dream Diary" />
            <Tab icon={<Heart size={18} />} label="Gratitude" />
            <Tab icon={<TrendingUp size={18} />} label="Insights" />
          </Tabs>

          {/* Free Write Tab */}
          {activeTab === 0 && (
            <JournalBook variant="elevated" ornate>
              {/* Mood Tracker */}
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <Sparkles size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                How are you feeling?
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, justifyContent: 'center' }}>
                {moods.map((mood) => (
                  <Box key={mood.id} sx={{ textAlign: 'center' }}>
                    <MoodButton
                      selected={selectedMood === mood.id}
                      moodColor={mood.color}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      {mood.emoji}
                    </MoodButton>
                    <Typography sx={{ color: selectedMood === mood.id ? mood.color : '#666666', fontSize: '0.75rem', mt: 0.5 }}>
                      {mood.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Energy Level */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#a78bfa', mb: 1 }}>
                  <Coffee size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Energy Level: {energyLevel}/10 spoons
                </Typography>
                <Slider
                  value={energyLevel}
                  onChange={(_, v) => setEnergyLevel(v as number)}
                  min={1}
                  max={10}
                  marks
                  sx={{
                    color: '#8b5cf6',
                    '& .MuiSlider-thumb': { backgroundColor: '#8b5cf6' },
                    '& .MuiSlider-track': { backgroundColor: '#8b5cf6' },
                    '& .MuiSlider-rail': { backgroundColor: 'rgba(139, 92, 246, 0.3)' },
                    '& .MuiSlider-mark': { backgroundColor: 'rgba(139, 92, 246, 0.5)' },
                  }}
                />
              </Box>

              {/* Journal Prompt */}
              <Box sx={{ mb: 3, p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
                    <Sparkles size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Writing Prompt
                  </Typography>
                  <GothicButton variant="ghost" size="small" onClick={getRandomPrompt}>
                    New Prompt
                  </GothicButton>
                </Box>
                <Typography sx={{ color: '#e0e0e0', fontStyle: 'italic' }}>
                  {selectedPrompt || "Click 'New Prompt' for inspiration..."}
                </Typography>
              </Box>

              {/* Writing Area */}
              <TextField
                multiline
                rows={12}
                fullWidth
                placeholder="Begin writing... Your thoughts are safe here."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e0e0',
                    fontFamily: '"Crimson Text", serif',
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    background: 'rgba(10, 10, 20, 0.4)',
                    '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#666666', fontSize: '0.85rem' }}>
                  {journalText.split(/\s+/).filter(w => w).length} words
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <GothicButton variant="ghost" startIcon={<Lock size={16} />}>
                    Private
                  </GothicButton>
                  <GothicButton variant="primary" startIcon={<Edit3 size={16} />}>
                    Save Entry
                  </GothicButton>
                </Box>
              </Box>
            </JournalBook>
          )}

          {/* Dream Diary Tab */}
          {activeTab === 1 && (
            <DreamCard variant="elevated" ornate>
              <Typography sx={{ color: '#ec4899', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Moon size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Dream Diary
              </Typography>

              <TextField
                multiline
                rows={8}
                fullWidth
                placeholder="Describe your dream... Include colors, emotions, symbols, and any recurring themes..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e0e0',
                    fontFamily: '"Crimson Text", serif',
                    fontSize: '1.1rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    '& fieldset': { borderColor: 'rgba(236, 72, 153, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(236, 72, 153, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#ec4899' },
                  },
                }}
              />

              <Typography sx={{ color: '#a78bfa', mb: 2 }}>
                Common Dream Symbols
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {dreamSymbols.map((item) => (
                  <Chip
                    key={item.meaning}
                    label={`${item.symbol} ${item.meaning}`}
                    onClick={() => setDreamText(prev => prev + ` ${item.symbol}`)}
                    sx={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#a78bfa',
                      '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <GothicButton variant="ghost" startIcon={<Star size={16} />}>
                  Mark as Lucid
                </GothicButton>
                <GothicButton variant="primary" startIcon={<Moon size={16} />}>
                  Save Dream
                </GothicButton>
              </Box>
            </DreamCard>
          )}

          {/* Gratitude Tab */}
          {activeTab === 2 && (
            <GothicCard variant="elevated" ornate>
              <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Heart size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Three Good Things
              </Typography>
              <Typography sx={{ color: '#888888', mb: 3 }}>
                What are three things you're grateful for today, no matter how small?
              </Typography>

              {[0, 1, 2].map((index) => (
                <GratitudeItem key={index}>
                  <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
                    {index + 1}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={
                      index === 0 ? "Something that made you smile..." :
                      index === 1 ? "A person you're thankful for..." :
                      "A small comfort you enjoyed..."
                    }
                    value={gratitudeItems[index]}
                    onChange={(e) => {
                      const newItems = [...gratitudeItems];
                      newItems[index] = e.target.value;
                      setGratitudeItems(newItems);
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#e0e0e0',
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                </GratitudeItem>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <GothicButton variant="primary" startIcon={<Heart size={16} />}>
                  Save Gratitudes
                </GothicButton>
              </Box>
            </GothicCard>
          )}

          {/* Insights Tab */}
          {activeTab === 3 && (
            <GothicCard variant="elevated" ornate>
              <Typography sx={{ color: '#f59e0b', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <TrendingUp size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Mood Insights
              </Typography>

              {/* Weekly Mood Chart */}
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ color: '#888888', mb: 2 }}>This Week's Mood</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px' }}>
                  {weeklyMoodData.map((day) => (
                    <Box key={day.day} sx={{ textAlign: 'center', flex: 1 }}>
                      <Box
                        sx={{
                          width: '30px',
                          height: `${day.value * 12}px`,
                          background: `linear-gradient(180deg, ${getMoodColor(day.mood)} 0%, ${getMoodColor(day.mood)}50 100%)`,
                          borderRadius: '4px 4px 0 0',
                          mx: 'auto',
                          mb: 1,
                        }}
                      />
                      <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{day.day}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Mood Patterns */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#a78bfa', mb: 2 }}>Patterns Noticed</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label="🌙 Lower energy on Wednesdays"
                    sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', justifyContent: 'flex-start' }}
                  />
                  <Chip
                    label="✨ Peak moods on weekends"
                    sx={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', justifyContent: 'flex-start' }}
                  />
                  <Chip
                    label="📈 Improving trend this month"
                    sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', justifyContent: 'flex-start' }}
                  />
                </Box>
              </Box>

              {/* Common Tags */}
              <Typography sx={{ color: '#888888', mb: 1 }}>Most Used Tags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['reflection', 'gratitude', 'growth', 'peace', 'creativity', 'healing'].map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
                  />
                ))}
              </Box>
            </GothicCard>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Recent Entries */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Recent Entries
            </Typography>
            {recentEntries.map((entry) => (
              <Box
                key={entry.id}
                sx={{
                  p: 2,
                  mb: 2,
                  background: 'rgba(20, 20, 30, 0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${
                    entry.type === 'mood' ? '#8b5cf6' :
                    entry.type === 'dream' ? '#ec4899' : '#10b981'
                  }`,
                  '&:hover': { background: 'rgba(30, 30, 45, 0.7)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
                    {entry.date}
                  </Typography>
                  {entry.private ? (
                    <Lock size={12} color="#888888" />
                  ) : (
                    <Unlock size={12} color="#888888" />
                  )}
                </Box>
                <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                  {entry.title}
                </Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.85rem', mb: 1 }}>
                  {entry.preview}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {entry.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '0.7rem',
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#a78bfa',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </GothicCard>

          {/* Quick Actions */}
          <GothicCard variant="elevated">
            <Typography sx={{ color: '#f97316', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Zap size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <GothicButton variant="ghost" fullWidth startIcon={<Search size={16} />}>
                Search Entries
              </GothicButton>
              <GothicButton variant="ghost" fullWidth startIcon={<Tag size={16} />}>
                Browse Tags
              </GothicButton>
              <GothicButton variant="ghost" fullWidth startIcon={<Calendar size={16} />}>
                View Calendar
              </GothicButton>
              <GothicButton variant="ghost" fullWidth startIcon={<TrendingUp size={16} />}>
                Export Data
              </GothicButton>
            </Box>
          </GothicCard>
        </Grid>
      </Grid>
    </JournalContainer>
  );
};

export default GothicJournal;
