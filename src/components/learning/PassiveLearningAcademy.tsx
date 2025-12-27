import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  GraduationCap,
  Palette,
  Code,
  Music,
  Camera,
  Scissors,
  Pencil,
  BookOpen,
  Sparkles,
  Clock,
  Star,
  ChevronRight,
  X,
  Zap,
  Target,
  CheckCircle2,
} from 'lucide-react';

// Animation keyframes
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  paddingBottom: '100px',
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #8b5cf6 0%, #d4af37 50%, #ec4899 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  fontFamily: '"Cinzel", serif',
});

const Subtitle = styled(Typography)({
  color: '#a0a0a0',
  fontSize: '1rem',
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#8b5cf6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#d4af37',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
  '& .MuiInputAdornment-root': {
    color: '#8b5cf6',
  },
});

const CategoryChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor || '#8b5cf6' : 'rgba(139, 92, 246, 0.15)',
  color: selected ? '#fff' : '#d4af37',
  border: `1px solid ${selected ? chipcolor || '#8b5cf6' : 'rgba(212, 175, 55, 0.3)'}`,
  '&:hover': {
    backgroundColor: selected ? chipcolor || '#8b5cf6' : 'rgba(139, 92, 246, 0.25)',
  },
  transition: 'all 0.3s ease',
}));

const LessonsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const LessonCard = styled(Box)<{ difficulty?: string }>(({ difficulty }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  padding: '20px',
  border: `1px solid ${
    difficulty === 'beginner' ? 'rgba(34, 197, 94, 0.3)' :
    difficulty === 'intermediate' ? 'rgba(234, 179, 8, 0.3)' :
    'rgba(239, 68, 68, 0.3)'
  }`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 10px 40px ${
      difficulty === 'beginner' ? 'rgba(34, 197, 94, 0.2)' :
      difficulty === 'intermediate' ? 'rgba(234, 179, 8, 0.2)' :
      'rgba(239, 68, 68, 0.2)'
    }`,
    border: `1px solid ${
      difficulty === 'beginner' ? 'rgba(34, 197, 94, 0.5)' :
      difficulty === 'intermediate' ? 'rgba(234, 179, 8, 0.5)' :
      'rgba(239, 68, 68, 0.5)'
    }`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: difficulty === 'beginner' ? 'linear-gradient(90deg, #22c55e, #4ade80)' :
                difficulty === 'intermediate' ? 'linear-gradient(90deg, #eab308, #facc15)' :
                'linear-gradient(90deg, #ef4444, #f87171)',
  },
}));

const LessonHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
});

const LessonCategory = styled(Typography)({
  fontSize: '0.75rem',
  color: '#8b5cf6',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '4px',
});

const LessonTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#fff',
  marginBottom: '8px',
});

const LessonDescription = styled(Typography)({
  fontSize: '0.9rem',
  color: '#a0a0a0',
  lineHeight: 1.5,
  marginBottom: '12px',
});

const LessonMeta = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
});

const MetaItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#888',
  fontSize: '0.8rem',
});

const DifficultyBadge = styled(Box)<{ level?: string }>(({ level }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: level === 'beginner' ? 'rgba(34, 197, 94, 0.2)' :
                   level === 'intermediate' ? 'rgba(234, 179, 8, 0.2)' :
                   'rgba(239, 68, 68, 0.2)',
  color: level === 'beginner' ? '#4ade80' :
         level === 'intermediate' ? '#facc15' :
         '#f87171',
}));

const TagsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
});

const Tag = styled(Box)({
  padding: '2px 8px',
  borderRadius: '8px',
  fontSize: '0.7rem',
  backgroundColor: 'rgba(139, 92, 246, 0.15)',
  color: '#a78bfa',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #0d0d1a 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
  },
});

const ProgressSection = styled(Box)({
  background: 'rgba(139, 92, 246, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '20px',
});

const StatsBar = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '32px',
  padding: '20px',
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const StatItem = styled(Box)({
  textAlign: 'center',
});

const StatValue = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#d4af37',
});

const StatLabel = styled(Typography)({
  fontSize: '0.8rem',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

// Data
const learningIdeas = [
  { id: 'learn_001', category: 'Drawing Fundamentals', title: 'Gesture Drawing 30-Second Poses', description: 'Practice capturing the essence of a figure in 30-second sketches. Focus on movement and flow, not details.', difficulty: 'beginner', duration: '15 min', tags: ['drawing', 'gesture', 'figure', 'practice'] },
  { id: 'learn_002', category: 'Drawing Fundamentals', title: 'Contour Drawing Without Looking', description: 'Draw an object while only looking at it, not your paper. Builds hand-eye coordination and observation skills.', difficulty: 'beginner', duration: '10 min', tags: ['drawing', 'contour', 'observation'] },
  { id: 'learn_003', category: 'Digital Art', title: 'Custom Brush Creation', description: 'Create your own custom brushes with unique textures and behavior settings.', difficulty: 'intermediate', duration: '45 min', tags: ['digital', 'brushes', 'custom'] },
  { id: 'learn_004', category: 'Digital Art', title: 'Layer Blending Modes Exploration', description: 'Experiment with Multiply, Screen, Overlay, and other blending modes to understand effects.', difficulty: 'beginner', duration: '30 min', tags: ['digital', 'layers', 'blending'] },
  { id: 'learn_005', category: 'Painting Techniques', title: 'Color Wheel Mixing Exercise', description: 'Mix secondary and tertiary colors using only primary paints to understand color theory.', difficulty: 'beginner', duration: '45 min', tags: ['painting', 'color-theory', 'mixing'] },
  { id: 'learn_006', category: 'Painting Techniques', title: 'Wet-on-Wet Watercolor', description: 'Apply wet paint to wet paper for soft, diffused edges and color blending.', difficulty: 'beginner', duration: '30 min', tags: ['painting', 'watercolor', 'technique'] },
  { id: 'learn_007', category: 'Poetry Writing', title: 'Haiku Daily Practice', description: 'Write one haiku (5-7-5 syllables) each day capturing a moment in nature.', difficulty: 'beginner', duration: '10 min', tags: ['poetry', 'haiku', 'daily'] },
  { id: 'learn_008', category: 'Poetry Writing', title: 'Sonnet Structure Study', description: 'Learn the 14-line sonnet form with iambic pentameter and rhyme scheme.', difficulty: 'advanced', duration: '1 hour', tags: ['poetry', 'sonnet', 'classical'] },
  { id: 'learn_009', category: 'Sewing Skills', title: 'Hand Stitch Sampler', description: 'Practice running stitch, backstitch, whip stitch, and blanket stitch on scrap fabric.', difficulty: 'beginner', duration: '45 min', tags: ['sewing', 'hand-stitch', 'basics'] },
  { id: 'learn_010', category: 'Sewing Skills', title: 'Zipper Installation', description: 'Learn to install a basic centered zipper using zipper foot.', difficulty: 'intermediate', duration: '1 hour', tags: ['sewing', 'zipper', 'closures'] },
  { id: 'learn_011', category: 'Music Skills', title: 'Major Scale Practice All Keys', description: 'Practice major scales in all 12 keys to build finger dexterity and key familiarity.', difficulty: 'beginner', duration: '30 min', tags: ['music', 'scales', 'practice'] },
  { id: 'learn_012', category: 'Music Skills', title: 'Song Transcription by Ear', description: 'Listen to a simple song and write down the melody by ear.', difficulty: 'advanced', duration: '1 hour', tags: ['music', 'transcription', 'ear'] },
  { id: 'learn_013', category: 'Coding Basics', title: 'Variables and Data Types', description: 'Learn to declare variables and understand strings, numbers, booleans, and arrays.', difficulty: 'beginner', duration: '30 min', tags: ['coding', 'variables', 'fundamentals'] },
  { id: 'learn_014', category: 'Coding Basics', title: 'Array Methods Mastery', description: 'Learn map, filter, reduce, find, and other powerful array methods.', difficulty: 'intermediate', duration: '1 hour', tags: ['coding', 'arrays', 'javascript'] },
  { id: 'learn_015', category: 'Web Development', title: 'CSS Flexbox Layout', description: 'Master flexbox for one-dimensional layouts with justify and align properties.', difficulty: 'beginner', duration: '45 min', tags: ['web', 'css', 'flexbox'] },
  { id: 'learn_016', category: 'Web Development', title: 'React Hooks useState/useEffect', description: 'Manage state and side effects in functional components.', difficulty: 'intermediate', duration: '1 hour', tags: ['web', 'react', 'hooks'] },
  { id: 'learn_017', category: 'AI Art Tools', title: 'Prompt Engineering Basics', description: 'Learn to write effective prompts for AI image generators with style, subject, and detail.', difficulty: 'beginner', duration: '30 min', tags: ['ai-art', 'prompts', 'creative'] },
  { id: 'learn_018', category: 'AI Art Tools', title: 'ControlNet Pose Guidance', description: 'Use ControlNet with pose references to guide AI image composition.', difficulty: 'intermediate', duration: '45 min', tags: ['ai-art', 'controlnet', 'poses'] },
  { id: 'learn_019', category: 'Embroidery', title: 'Basic Embroidery Stitches', description: 'Learn running stitch, back stitch, satin stitch, and French knots on fabric.', difficulty: 'beginner', duration: '1 hour', tags: ['embroidery', 'stitches', 'basics'] },
  { id: 'learn_020', category: 'Crochet', title: 'Amigurumi Magic Ring', description: 'Start amigurumi projects with the adjustable magic ring technique.', difficulty: 'intermediate', duration: '30 min', tags: ['crochet', 'amigurumi', 'technique'] },
  { id: 'learn_021', category: 'Calligraphy', title: 'Basic Strokes Practice', description: 'Practice fundamental strokes - upstrokes, downstrokes, ovals, and curves.', difficulty: 'beginner', duration: '30 min', tags: ['calligraphy', 'strokes', 'basics'] },
  { id: 'learn_022', category: 'Photography', title: 'Rule of Thirds Composition', description: 'Practice placing subjects at rule of thirds intersections for balanced photos.', difficulty: 'beginner', duration: '30 min', tags: ['photography', 'composition', 'framing'] },
  { id: 'learn_023', category: '3D Modeling', title: 'Blender Interface Navigation', description: 'Learn Blenders viewport navigation, selection, and basic tools.', difficulty: 'beginner', duration: '45 min', tags: ['3d', 'blender', 'interface'] },
  { id: 'learn_024', category: 'Animation Basics', title: 'Squash and Stretch Principle', description: 'Apply squash and stretch to bouncing ball for believable motion.', difficulty: 'beginner', duration: '45 min', tags: ['animation', 'principles', 'motion'] },
];

const categories = [
  { id: 'all', name: 'All Lessons', icon: Sparkles, color: '#d4af37' },
  { id: 'Drawing Fundamentals', name: 'Drawing', icon: Pencil, color: '#8b5cf6' },
  { id: 'Digital Art', name: 'Digital Art', icon: Palette, color: '#ec4899' },
  { id: 'Painting Techniques', name: 'Painting', icon: Palette, color: '#f97316' },
  { id: 'Poetry Writing', name: 'Poetry', icon: BookOpen, color: '#a855f7' },
  { id: 'Sewing Skills', name: 'Sewing', icon: Scissors, color: '#14b8a6' },
  { id: 'Music Skills', name: 'Music', icon: Music, color: '#3b82f6' },
  { id: 'Coding Basics', name: 'Coding', icon: Code, color: '#22c55e' },
  { id: 'Web Development', name: 'Web Dev', icon: Code, color: '#06b6d4' },
  { id: 'Photography', name: 'Photo', icon: Camera, color: '#eab308' },
];

export const PassiveLearningAcademy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState<typeof learningIdeas[0] | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const filteredLessons = useMemo(() => {
    return learningIdeas.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    const total = learningIdeas.length;
    const completed = completedLessons.size;
    const beginnerCount = learningIdeas.filter(l => l.difficulty === 'beginner').length;
    const intermediateCount = learningIdeas.filter(l => l.difficulty === 'intermediate').length;
    const advancedCount = learningIdeas.filter(l => l.difficulty === 'advanced').length;
    return { total, completed, beginnerCount, intermediateCount, advancedCount };
  }, [completedLessons]);

  const handleMarkComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.id === categoryName || c.name === categoryName);
    return category?.icon || Sparkles;
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <GraduationCap size={40} color="#d4af37" />
        </Box>
        <Title>Passive Learning Academy</Title>
        <Subtitle>Master new skills at your own pace - bite-sized lessons for creative growth</Subtitle>
      </Header>

      <StatsBar>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Lessons</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.beginnerCount}</StatValue>
          <StatLabel>Beginner</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.intermediateCount}</StatValue>
          <StatLabel>Intermediate</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.advancedCount}</StatValue>
          <StatLabel>Advanced</StatLabel>
        </StatItem>
      </StatsBar>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search lessons by topic, skill, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      <CategoryChipsContainer>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <CategoryChip
              key={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Icon size={14} />
                  {category.name}
                </Box>
              }
              selected={selectedCategory === category.id}
              chipcolor={category.color}
              onClick={() => setSelectedCategory(category.id)}
            />
          );
        })}
      </CategoryChipsContainer>

      <Typography sx={{ color: '#888', textAlign: 'center', mb: 3 }}>
        Showing {filteredLessons.length} lessons
      </Typography>

      <LessonsGrid>
        {filteredLessons.map((lesson) => {
          const CategoryIcon = getCategoryIcon(lesson.category);
          const isCompleted = completedLessons.has(lesson.id);

          return (
            <LessonCard
              key={lesson.id}
              difficulty={lesson.difficulty}
              onClick={() => setSelectedLesson(lesson)}
              sx={{ opacity: isCompleted ? 0.7 : 1 }}
            >
              {isCompleted && (
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <CheckCircle2 size={24} color="#22c55e" />
                </Box>
              )}

              <LessonHeader>
                <Box>
                  <LessonCategory>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CategoryIcon size={12} />
                      {lesson.category}
                    </Box>
                  </LessonCategory>
                  <LessonTitle>{lesson.title}</LessonTitle>
                </Box>
              </LessonHeader>

              <LessonDescription>{lesson.description}</LessonDescription>

              <LessonMeta>
                <DifficultyBadge level={lesson.difficulty}>
                  <Zap size={12} />
                  {lesson.difficulty}
                </DifficultyBadge>
                <MetaItem>
                  <Clock size={14} />
                  {lesson.duration}
                </MetaItem>
              </LessonMeta>

              <TagsContainer>
                {lesson.tags.slice(0, 4).map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
              </TagsContainer>
            </LessonCard>
          );
        })}
      </LessonsGrid>

      {/* Lesson Detail Dialog */}
      <StyledDialog open={!!selectedLesson} onClose={() => setSelectedLesson(null)}>
        {selectedLesson && (
          <>
            <DialogTitle sx={{
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#8b5cf6' }}>
                  {selectedLesson.category}
                </Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                  {selectedLesson.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedLesson(null)} sx={{ color: '#888' }}>
                <X size={24} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <ProgressSection>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#d4af37', fontWeight: 600 }}>
                    Lesson Progress
                  </Typography>
                  <Typography sx={{ color: '#888' }}>
                    {completedLessons.has(selectedLesson.id) ? '100%' : '0%'}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completedLessons.has(selectedLesson.id) ? 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#22c55e',
                      borderRadius: 4,
                    },
                  }}
                />
              </ProgressSection>

              <Typography sx={{ color: '#e0e0e0', mb: 3, lineHeight: 1.7 }}>
                {selectedLesson.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <DifficultyBadge level={selectedLesson.difficulty}>
                  <Zap size={14} />
                  {selectedLesson.difficulty}
                </DifficultyBadge>
                <MetaItem sx={{ color: '#d4af37' }}>
                  <Clock size={16} />
                  {selectedLesson.duration}
                </MetaItem>
              </Box>

              <Typography variant="subtitle2" sx={{ color: '#8b5cf6', mb: 1 }}>
                Topics Covered:
              </Typography>
              <TagsContainer sx={{ mb: 2 }}>
                {selectedLesson.tags.map((tag, idx) => (
                  <Tag key={idx} sx={{ fontSize: '0.8rem', padding: '4px 12px' }}>{tag}</Tag>
                ))}
              </TagsContainer>

              <Box sx={{
                mt: 3,
                p: 2,
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Target size={18} />
                  Learning Tip
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  Take your time with this lesson. Practice in short sessions to build muscle memory and avoid fatigue. Remember, consistency beats intensity!
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={() => setSelectedLesson(null)}
                sx={{
                  borderColor: 'rgba(139, 92, 246, 0.5)',
                  color: '#8b5cf6',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => handleMarkComplete(selectedLesson.id)}
                sx={{
                  backgroundColor: completedLessons.has(selectedLesson.id) ? '#ef4444' : '#22c55e',
                  '&:hover': {
                    backgroundColor: completedLessons.has(selectedLesson.id) ? '#dc2626' : '#16a34a',
                  },
                }}
                startIcon={completedLessons.has(selectedLesson.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
              >
                {completedLessons.has(selectedLesson.id) ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </PageContainer>
  );
};

export default PassiveLearningAcademy;
