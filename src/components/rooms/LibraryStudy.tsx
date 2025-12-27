// Library Study Room Component
// Learning hub with AI teacher and educational resources

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Book, GraduationCap, Brain, Lightbulb, Trophy, Clock,
  Play, CheckCircle, Star, Bookmark, Search, Users, ExternalLink
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const floatBooks = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0c08 0%, #141a10 50%, #0a0c08 100%)',
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
  color: '#84cc16',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(132, 204, 22, 0.4)',
  marginBottom: '8px',
});

const CourseCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(132, 204, 22, 0.2)',
  },
});

const AITeacherCard = styled(GothicCard)({
  background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.15), rgba(20, 20, 30, 0.9))',
  border: '1px solid rgba(132, 204, 22, 0.4)',
});

const ProgressCard = styled(Box)({
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
});

const courses = [
  { id: 'self-advocacy', name: 'Self-Advocacy Mastery', lessons: 50, completed: 12, category: 'Life Skills', color: '#8b5cf6' },
  { id: 'finance-101', name: 'Financial Independence', lessons: 30, completed: 8, category: 'Finance', color: '#10b981' },
  { id: 'history-liberation', name: 'Black Liberation History', lessons: 40, completed: 25, category: 'History', color: '#d4af37' },
  { id: 'creative-writing', name: 'Gothic Creative Writing', lessons: 20, completed: 5, category: 'Creative', color: '#ec4899' },
  { id: 'health-chronic', name: 'Chronic Illness Management', lessons: 35, completed: 18, category: 'Health', color: '#ef4444' },
  { id: 'spirituality', name: 'Hoodoo & Spiritual Practices', lessons: 45, completed: 30, category: 'Spirituality', color: '#7c2d12' },
];

const studyTopics = [
  'African American History', 'Disability Rights', 'Financial Literacy',
  'Self-Care Strategies', 'Indigenous Knowledge', 'LGBTQ+ History',
  'Creative Expression', 'Meditation & Mindfulness'
];

export const LibraryStudy: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);
  const completedLessons = courses.reduce((sum, c) => sum + c.completed, 0);
  const overallProgress = (completedLessons / totalLessons) * 100;

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Book size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Library Study
        </RoomTitle>
        <Typography sx={{ color: '#808060', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where knowledge transforms into wisdom
        </Typography>
      </HeaderSection>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <GothicButton
          variant="primary"
          startIcon={<Book size={18} />}
          onClick={() => navigate('/learning')}
        >
          Learning Hub
        </GothicButton>
        <GothicButton
          variant="secondary"
          startIcon={<GraduationCap size={18} />}
          onClick={() => navigate('/courses')}
        >
          Course Management
        </GothicButton>
        <GothicButton
          variant="ghost"
          startIcon={<Search size={18} />}
          onClick={() => navigate('/research')}
        >
          Research Hub
        </GothicButton>
      </Box>

      {/* AI Teacher Section */}
      <AITeacherCard variant="elevated" ornate sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #84cc16, #65a30d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap size={40} color="#0a0a0f" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#84cc16', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 1 }}>
              AI Learning Companion
            </Typography>
            <Typography sx={{ color: '#a0a0a0', mb: 2 }}>
              Your personalized tutor adapts to your learning style, pace, and interests
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <GothicButton variant="accent" startIcon={<Brain size={18} />}>
                Start Learning Session
              </GothicButton>
              <GothicButton variant="secondary" startIcon={<Lightbulb size={18} />}>
                Get Study Suggestions
              </GothicButton>
            </Box>
          </Box>
        </Box>
      </AITeacherCard>

      {/* Progress Overview */}
      <GothicCard variant="glass" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>
            <Trophy size={18} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#d4af37' }} />
            Overall Learning Progress
          </Typography>
          <Typography sx={{ color: '#84cc16', fontWeight: 600 }}>
            {completedLessons} / {totalLessons} lessons
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={overallProgress}
          sx={{
            height: '12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(132, 204, 22, 0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#84cc16',
              borderRadius: '6px',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
            <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            12 hours studied this week
          </Typography>
          <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
            {Math.round(overallProgress)}% complete
          </Typography>
        </Box>
      </GothicCard>

      {/* Courses Grid */}
      <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
        Your Learning Paths
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <CourseCard
              variant="glass"
              onClick={() => setSelectedCourse(course.id)}
              sx={{ border: selectedCourse === course.id ? `2px solid ${course.color}` : undefined }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Chip
                  label={course.category}
                  size="small"
                  sx={{ background: `${course.color}30`, color: course.color }}
                />
                <Bookmark size={18} color="#888888" style={{ cursor: 'pointer' }} />
              </Box>
              <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem', mb: 1 }}>
                {course.name}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                    {course.completed} / {course.lessons} lessons
                  </Typography>
                  <Typography sx={{ color: course.color, fontSize: '0.85rem' }}>
                    {Math.round((course.completed / course.lessons) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(course.completed / course.lessons) * 100}
                  sx={{
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: `${course.color}20`,
                    '& .MuiLinearProgress-bar': { backgroundColor: course.color },
                  }}
                />
              </Box>
              <GothicButton variant="ghost" size="small" startIcon={<Play size={14} />}>
                Continue
              </GothicButton>
            </CourseCard>
          </Grid>
        ))}
      </Grid>

      {/* Study Topics */}
      <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 2 }}>
        Explore Topics
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {studyTopics.map((topic) => (
          <Chip
            key={topic}
            label={topic}
            sx={{
              background: 'rgba(132, 204, 22, 0.15)',
              color: '#84cc16',
              cursor: 'pointer',
              '&:hover': { background: 'rgba(132, 204, 22, 0.25)' },
            }}
          />
        ))}
      </Box>
    </RoomContainer>
  );
};

export default LibraryStudy;
