import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Palette,
  Search,
  Sparkles,
  Brush,
  Pencil,
  Camera,
  Layers,
  Monitor,
  Frame,
  Scissors,
  Zap,
  CheckCircle2,
  Bookmark,
  Shuffle,
  X,
  Star,
  Image,
} from 'lucide-react';

// Import art data
import artData from '../../data/art_ideas.json';

// Animations
const colorShift = keyframes`
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
`;

const brushStroke = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
`;

// Styled components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'radial-gradient(ellipse at center top, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  position: 'relative',
  zIndex: 1,
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #a855f7 0%, #c084fc 30%, #ec4899 60%, #f472b6 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  '& svg': {
    animation: `${brushStroke} 2s ease-in-out infinite`,
  },
});

const Subtitle = styled(Typography)({
  color: 'rgba(192, 132, 252, 0.8)',
  fontSize: '1rem',
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '16px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(168, 85, 247, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(168, 85, 247, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#a855f7',
    },
  },
  '& .MuiInputAdornment-root svg': {
    color: '#a855f7',
  },
});

const CategoryContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor : 'rgba(26, 16, 40, 0.6)',
  color: selected ? '#0a0812' : chipcolor,
  border: `1px solid ${chipcolor}`,
  fontWeight: selected ? 600 : 400,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? chipcolor : `${chipcolor}20`,
    transform: 'translateY(-2px)',
  },
}));

const StatsPanel = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '32px',
});

const StatCard = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  padding: '16px 24px',
  border: '1px solid rgba(168, 85, 247, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '140px',
});

const StatNumber = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#c084fc',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(192, 132, 252, 0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  color: '#fff',
  borderRadius: '20px',
  padding: '10px 24px',
  fontWeight: 600,
  marginBottom: '24px',
  '&:hover': {
    background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
    transform: 'scale(1.02)',
  },
});

const ArtGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const ArtCard = styled(Card)<{ difficulty?: string }>(({ difficulty }) => {
  const colors: Record<string, string> = {
    easy: '#22c55e',
    medium: '#fbbf24',
    hard: '#ef4444',
  };
  const color = colors[difficulty || 'medium'] || colors.medium;

  return {
    background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
    borderRadius: '20px',
    border: `1px solid ${color}30`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${color}, ${color}80)`,
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px ${color}20`,
      border: `1px solid ${color}50`,
    },
  };
});

const ArtTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const ArtDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: 'rgba(240, 230, 255, 0.7)',
  lineHeight: 1.5,
  marginBottom: '12px',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const TagContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
});

const ArtTag = styled(Chip)({
  backgroundColor: 'rgba(168, 85, 247, 0.15)',
  color: '#c084fc',
  fontSize: '0.7rem',
  height: '24px',
  border: '1px solid rgba(168, 85, 247, 0.3)',
});

const DifficultyBadge = styled(Box)<{ level?: string }>(({ level }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    easy: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    hard: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const style = colors[level || 'medium'] || colors.medium;

  return {
    backgroundColor: style.bg,
    color: style.text,
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `1px solid ${style.text}40`,
  };
});

const EnergyBadge = styled(Box)<{ level?: string }>(({ level }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    low: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    high: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const style = colors[level || 'medium'] || colors.medium;

  return {
    backgroundColor: style.bg,
    color: style.text,
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    border: `1px solid ${style.text}40`,
  };
});

const CompletedBadge = styled(Box)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: 'rgba(34, 197, 94, 0.2)',
  color: '#22c55e',
  padding: '4px 8px',
  borderRadius: '8px',
  fontSize: '0.7rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
});

// Types
interface ArtProject {
  id: string;
  category: string;
  title: string;
  description: string;
  energy_level: string;
  difficulty: string;
  tags: string[];
}

// Category configuration
const categories = [
  { id: 'all', name: 'All Projects', icon: Sparkles, color: '#d4af37' },
  { id: 'Digital Art', name: 'Digital', icon: Monitor, color: '#3b82f6' },
  { id: 'Painting', name: 'Painting', icon: Brush, color: '#ec4899' },
  { id: 'Drawing', name: 'Drawing', icon: Pencil, color: '#8b5cf6' },
  { id: 'Photography', name: 'Photography', icon: Camera, color: '#06b6d4' },
  { id: 'Mixed Media', name: 'Mixed Media', icon: Layers, color: '#f59e0b' },
  { id: 'Collage', name: 'Collage', icon: Scissors, color: '#22c55e' },
  { id: 'Illustration', name: 'Illustration', icon: Image, color: '#a855f7' },
  { id: 'Printmaking', name: 'Printmaking', icon: Frame, color: '#ef4444' },
];

export const ArtProjectStudio: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ArtProject | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set());
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<string>>(new Set());

  const projects: ArtProject[] = artData.items;

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;

      const matchesDifficulty =
        !selectedDifficulty || project.difficulty === selectedDifficulty;

      const matchesEnergy = !selectedEnergy || project.energy_level === selectedEnergy;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEnergy;
    });
  }, [projects, searchQuery, selectedCategory, selectedDifficulty, selectedEnergy]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      completed: completedProjects.size,
      bookmarked: bookmarkedProjects.size,
      digital: projects.filter((p) => p.category === 'Digital Art').length,
    };
  }, [projects, completedProjects, bookmarkedProjects]);

  const getRandomProject = useCallback(() => {
    const available = filteredProjects.filter((p) => !completedProjects.has(p.id));
    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      setSelectedProject(random);
    }
  }, [filteredProjects, completedProjects]);

  const toggleCompleted = useCallback((projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }, []);

  const toggleBookmarked = useCallback((projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.icon : Palette;
  };

  const getCategoryColor = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.color : '#a855f7';
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Palette size={36} />
          Art Project Studio
        </Title>
        <Subtitle>350 creative projects across all mediums</Subtitle>
      </Header>

      <StatsPanel>
        <StatCard>
          <Palette size={24} color="#a855f7" />
          <Box>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Projects</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <CheckCircle2 size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Bookmark size={24} color="#ec4899" />
          <Box>
            <StatNumber>{stats.bookmarked}</StatNumber>
            <StatLabel>Saved</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Monitor size={24} color="#3b82f6" />
          <Box>
            <StatNumber>{stats.digital}</StatNumber>
            <StatLabel>Digital</StatLabel>
          </Box>
        </StatCard>
      </StatsPanel>

      <Box sx={{ textAlign: 'center' }}>
        <RandomButton onClick={getRandomProject} startIcon={<Shuffle size={18} />}>
          Random Project
        </RandomButton>
      </Box>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search projects, techniques, or styles..."
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

      <CategoryContainer>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <CategoryChip
              key={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
      </CategoryContainer>

      <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', fontSize: '0.8rem' }}>Difficulty:</Typography>
          {['easy', 'medium', 'hard'].map((diff) => (
            <Chip
              key={diff}
              label={diff}
              size="small"
              onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
              sx={{
                backgroundColor: selectedDifficulty === diff
                  ? (diff === 'easy' ? '#22c55e' : diff === 'medium' ? '#fbbf24' : '#ef4444')
                  : 'rgba(26, 16, 40, 0.6)',
                color: selectedDifficulty === diff ? '#0a0812' : (diff === 'easy' ? '#22c55e' : diff === 'medium' ? '#fbbf24' : '#ef4444'),
                border: `1px solid ${diff === 'easy' ? '#22c55e' : diff === 'medium' ? '#fbbf24' : '#ef4444'}`,
                textTransform: 'capitalize',
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', fontSize: '0.8rem' }}>Energy:</Typography>
          {['low', 'medium', 'high'].map((energy) => (
            <Chip
              key={energy}
              label={energy}
              size="small"
              icon={<Zap size={12} />}
              onClick={() => setSelectedEnergy(selectedEnergy === energy ? null : energy)}
              sx={{
                backgroundColor: selectedEnergy === energy
                  ? (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444')
                  : 'rgba(26, 16, 40, 0.6)',
                color: selectedEnergy === energy ? '#0a0812' : (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'),
                border: `1px solid ${energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'}`,
                textTransform: 'capitalize',
                '& .MuiChip-icon': {
                  color: selectedEnergy === energy ? '#0a0812' : (energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'),
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Typography
        sx={{
          textAlign: 'center',
          color: 'rgba(240, 230, 255, 0.6)',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}
      >
        Showing {filteredProjects.length} of {projects.length} art projects
      </Typography>

      <ArtGrid>
        {filteredProjects.map((project) => {
          const isCompleted = completedProjects.has(project.id);
          const isBookmarked = bookmarkedProjects.has(project.id);
          const CategoryIcon = getCategoryIcon(project.category);

          return (
            <ArtCard
              key={project.id}
              difficulty={project.difficulty}
              onClick={() => setSelectedProject(project)}
            >
              {isCompleted && (
                <CompletedBadge>
                  <CheckCircle2 size={12} />
                  Done
                </CompletedBadge>
              )}
              <CardContent sx={{ padding: '20px' }}>
                <ArtTitle>
                  <CategoryIcon size={18} color={getCategoryColor(project.category)} />
                  {project.title}
                </ArtTitle>

                <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <DifficultyBadge level={project.difficulty}>
                    {project.difficulty}
                  </DifficultyBadge>
                  <EnergyBadge level={project.energy_level}>
                    <Zap size={10} />
                    {project.energy_level}
                  </EnergyBadge>
                  <Chip
                    size="small"
                    label={project.category}
                    sx={{
                      backgroundColor: `${getCategoryColor(project.category)}20`,
                      color: getCategoryColor(project.category),
                      fontSize: '0.7rem',
                      height: '24px',
                      border: `1px solid ${getCategoryColor(project.category)}40`,
                    }}
                  />
                  {isBookmarked && (
                    <Bookmark size={16} color="#ec4899" fill="#ec4899" />
                  )}
                </Box>

                <ArtDescription>{project.description}</ArtDescription>

                <TagContainer>
                  {project.tags.slice(0, 3).map((tag) => (
                    <ArtTag key={tag} label={tag} size="small" />
                  ))}
                  {project.tags.length > 3 && (
                    <ArtTag label={`+${project.tags.length - 3}`} size="small" />
                  )}
                </TagContainer>
              </CardContent>
            </ArtCard>
          );
        })}
      </ArtGrid>

      {/* Project Detail Dialog */}
      <DialogStyled
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        maxWidth="md"
      >
        {selectedProject && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)',
                color: '#f0e6ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Palette size={24} color="#a855f7" />
                {selectedProject.title}
              </Box>
              <IconButton onClick={() => setSelectedProject(null)} sx={{ color: '#f0e6ff' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <DifficultyBadge level={selectedProject.difficulty}>
                  {selectedProject.difficulty}
                </DifficultyBadge>
                <EnergyBadge level={selectedProject.energy_level}>
                  <Zap size={12} />
                  {selectedProject.energy_level} energy
                </EnergyBadge>
                <Chip
                  label={selectedProject.category}
                  sx={{
                    backgroundColor: `${getCategoryColor(selectedProject.category)}20`,
                    color: getCategoryColor(selectedProject.category),
                    border: `1px solid ${getCategoryColor(selectedProject.category)}40`,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: 'rgba(240, 230, 255, 0.9)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                {selectedProject.description}
              </Typography>

              <Box sx={{ marginBottom: '20px' }}>
                <Typography sx={{ color: '#c084fc', fontWeight: 600, marginBottom: '12px' }}>
                  Tags & Techniques
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedProject.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(168, 85, 247, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={(e) => toggleBookmarked(selectedProject.id, e)}
                startIcon={<Bookmark size={18} fill={bookmarkedProjects.has(selectedProject.id) ? '#ec4899' : 'none'} />}
                sx={{
                  borderColor: '#ec4899',
                  color: '#ec4899',
                  '&:hover': { borderColor: '#db2777', backgroundColor: 'rgba(236, 72, 153, 0.1)' },
                }}
              >
                {bookmarkedProjects.has(selectedProject.id) ? 'Saved' : 'Save Project'}
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  toggleCompleted(selectedProject.id, e);
                  setSelectedProject(null);
                }}
                startIcon={completedProjects.has(selectedProject.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{
                  backgroundColor: completedProjects.has(selectedProject.id) ? '#6b7280' : '#22c55e',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: completedProjects.has(selectedProject.id) ? '#4b5563' : '#16a34a',
                  },
                }}
              >
                {completedProjects.has(selectedProject.id) ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogStyled>
    </PageContainer>
  );
};

export default ArtProjectStudio;
