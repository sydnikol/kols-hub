// Creative Studio Room Component
// Art, writing, and creative expression hub

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Palette, PenTool, Camera, Music, Film, Brush,
  Sparkles, BookOpen, Lightbulb, Clock, Star, Zap, Scissors, ExternalLink
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const colorShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a080c 0%, #1a1020 50%, #0a080c 100%)',
  padding: '32px',
  position: 'relative',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const RoomTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #60a5fa)',
  backgroundSize: '200% 200%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${colorShift} 5s ease infinite`,
  letterSpacing: '0.1em',
  marginBottom: '8px',
});

const MediumCard = styled(GothicCard)<{ color: string }>(({ color }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${color}40`,
    borderColor: color,
  },
}));

const ProjectCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: '0 10px 30px rgba(236, 72, 153, 0.2)',
  },
});

const PromptCard = styled(Box)({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
  borderRadius: '16px',
  padding: '24px',
  textAlign: 'center',
  border: '1px solid rgba(139, 92, 246, 0.3)',
});

const creativeMediums = [
  { id: 'writing', name: 'Writing', icon: <PenTool size={32} />, color: '#ec4899', projects: 12 },
  { id: 'visual', name: 'Visual Art', icon: <Palette size={32} />, color: '#8b5cf6', projects: 8 },
  { id: 'music', name: 'Music', icon: <Music size={32} />, color: '#60a5fa', projects: 5 },
  { id: 'photo', name: 'Photography', icon: <Camera size={32} />, color: '#10b981', projects: 15 },
  { id: 'video', name: 'Video', icon: <Film size={32} />, color: '#f97316', projects: 3 },
  { id: 'crafts', name: 'Crafts', icon: <Brush size={32} />, color: '#d4af37', projects: 7 },
];

const activeProjects = [
  { id: 1, name: 'Gothic Novel Draft', medium: 'Writing', progress: 45, deadline: 'Jan 15', priority: 'high' },
  { id: 2, name: 'Digital Portrait Series', medium: 'Visual Art', progress: 70, deadline: 'Dec 30', priority: 'medium' },
  { id: 3, name: 'Ambient Album', medium: 'Music', progress: 25, deadline: 'Feb 1', priority: 'low' },
  { id: 4, name: 'Poetry Collection', medium: 'Writing', progress: 80, deadline: 'Dec 28', priority: 'high' },
];

const dailyPrompts = [
  { type: 'Writing', prompt: 'Write a scene where two strangers share an umbrella during a storm.' },
  { type: 'Visual', prompt: 'Create something inspired by the phrase "forgotten doorways."' },
  { type: 'Music', prompt: 'Compose a melody that captures the feeling of early morning fog.' },
];

const inspirationSources = [
  'Gothic Literature', 'Nature Photography', 'Afrofuturism',
  'Surrealism', 'Folk Tales', 'Urban Decay', 'Celestial Bodies',
];

export const CreativeStudio: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null);

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Sparkles size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Creative Studio
        </RoomTitle>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where imagination takes form
        </Typography>
      </HeaderSection>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <GothicButton
          variant="primary"
          startIcon={<Scissors size={18} />}
          onClick={() => navigate('/sewing')}
        >
          Sewing Studio
        </GothicButton>
        <GothicButton
          variant="secondary"
          startIcon={<PenTool size={18} />}
          onClick={() => navigate('/content-generation-hub')}
        >
          Content Generation Hub
        </GothicButton>
      </Box>

      {/* Creative Mediums */}
      <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
        Your Creative Spaces
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {creativeMediums.map((medium) => (
          <Grid item xs={6} sm={4} md={2} key={medium.id}>
            <MediumCard
              variant="glass"
              color={medium.color}
              onClick={() => setSelectedMedium(medium.id)}
              sx={{ border: selectedMedium === medium.id ? `2px solid ${medium.color}` : undefined }}
            >
              <Box sx={{ color: medium.color, mb: 2 }}>{medium.icon}</Box>
              <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>{medium.name}</Typography>
              <Chip
                label={`${medium.projects} projects`}
                size="small"
                sx={{ background: `${medium.color}20`, color: medium.color }}
              />
            </MediumCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Active Projects */}
        <Grid item xs={12} md={7}>
          <GothicCard variant="elevated" ornate>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ color: '#ec4899', fontFamily: '"Cinzel", serif', fontSize: '1.3rem' }}>
                <BookOpen size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Active Projects
              </Typography>
              <GothicButton variant="accent" size="small" startIcon={<Zap size={16} />}>
                New Project
              </GothicButton>
            </Box>
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} variant="glass" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem' }}>
                      {project.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={project.medium}
                        size="small"
                        sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                      />
                      <Chip
                        label={project.priority}
                        size="small"
                        sx={{
                          background: project.priority === 'high'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : project.priority === 'medium'
                            ? 'rgba(251, 191, 36, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                          color: project.priority === 'high'
                            ? '#ef4444'
                            : project.priority === 'medium'
                            ? '#fbbf24'
                            : '#10b981',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                      <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {project.deadline}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{
                      flex: 1,
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(236, 72, 153, 0.2)',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#ec4899' },
                    }}
                  />
                  <Typography sx={{ color: '#ec4899', fontWeight: 600, minWidth: '45px' }}>
                    {project.progress}%
                  </Typography>
                </Box>
              </ProjectCard>
            ))}
          </GothicCard>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={5}>
          {/* Daily Prompt */}
          <PromptCard sx={{ mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Lightbulb size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Today's Creative Prompt
            </Typography>
            <Typography sx={{ color: '#e0e0e0', fontSize: '1.1rem', fontStyle: 'italic', mb: 3 }}>
              "{dailyPrompts[0].prompt}"
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <GothicButton variant="primary" startIcon={<PenTool size={18} />}>
                Start Creating
              </GothicButton>
              <GothicButton variant="ghost" startIcon={<Sparkles size={18} />}>
                New Prompt
              </GothicButton>
            </Box>
          </PromptCard>

          {/* Inspiration Board */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#8b5cf6', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Star size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Inspiration Sources
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {inspirationSources.map((source) => (
                <Chip
                  key={source}
                  label={source}
                  sx={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#a78bfa',
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(139, 92, 246, 0.25)' },
                  }}
                />
              ))}
            </Box>
          </GothicCard>

          {/* Creative Stats */}
          <GothicCard variant="glass">
            <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              Creative Journey
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#10b981', fontSize: '2rem', fontWeight: 700 }}>47</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Projects Completed</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#ec4899', fontSize: '2rem', fontWeight: 700 }}>128</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Creative Hours</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#8b5cf6', fontSize: '2rem', fontWeight: 700 }}>15</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Day Streak</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px' }}>
                  <Typography sx={{ color: '#d4af37', fontSize: '2rem', fontWeight: 700 }}>6</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Mediums Explored</Typography>
                </Box>
              </Grid>
            </Grid>
          </GothicCard>
        </Grid>
      </Grid>
    </RoomContainer>
  );
};

export default CreativeStudio;
