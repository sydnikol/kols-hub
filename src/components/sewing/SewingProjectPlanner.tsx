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
  LinearProgress,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Scissors,
  Search,
  Sparkles,
  Heart,
  Star,
  Bookmark,
  Shirt,
  Home,
  Palette,
  Recycle,
  Wand2,
  Wrench,
  Leaf,
  CheckCircle2,
  Clock,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

// Import sewing data
import sewingData from '../../data/sewing_ideas.json';

// Animations
const snip = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
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
    background: 'radial-gradient(ellipse at center top, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
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
  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbbf24 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  '& svg': {
    animation: `${snip} 2s ease-in-out infinite`,
  },
});

const Subtitle = styled(Typography)({
  color: 'rgba(244, 114, 182, 0.8)',
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
      borderColor: 'rgba(236, 72, 153, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(236, 72, 153, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputAdornment-root svg': {
    color: '#ec4899',
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
  border: '1px solid rgba(236, 72, 153, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '150px',
});

const StatNumber = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#f472b6',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(244, 114, 182, 0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const ProjectGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const ProjectCard = styled(Card)<{ difficulty?: string }>(({ difficulty }) => {
  const colors: Record<string, string> = {
    beginner: '#22c55e',
    intermediate: '#fbbf24',
    advanced: '#ef4444',
  };
  const color = colors[difficulty || 'beginner'] || colors.beginner;

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

const ProjectTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '8px',
});

const ProjectDescription = styled(Typography)({
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

const ProjectTag = styled(Chip)({
  backgroundColor: 'rgba(236, 72, 153, 0.15)',
  color: '#f472b6',
  fontSize: '0.7rem',
  height: '24px',
  border: '1px solid rgba(236, 72, 153, 0.3)',
});

const DifficultyBadge = styled(Box)<{ level?: string }>(({ level }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    beginner: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    intermediate: { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' },
    advanced: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  };
  const style = colors[level || 'beginner'] || colors.beginner;

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
    whiteSpace: 'nowrap',
  };
});

const EnergyIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '12px',
});

const EnergyBar = styled(LinearProgress)<{ energylevel?: string }>(({ energylevel }) => {
  const colors: Record<string, string> = {
    low: '#22c55e',
    medium: '#fbbf24',
    high: '#ef4444',
  };
  const color = colors[energylevel || 'low'] || colors.low;

  return {
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
    '& .MuiLinearProgress-bar': {
      backgroundColor: color,
      borderRadius: '3px',
    },
  };
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(236, 72, 153, 0.3)',
    maxWidth: '600px',
    width: '100%',
  },
});

const QuickFilters = styled(Box)({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  marginBottom: '20px',
  flexWrap: 'wrap',
});

const QuickFilterButton = styled(Button)<{ active?: boolean; filtercolor?: string }>(({ active, filtercolor }) => ({
  backgroundColor: active ? filtercolor : 'rgba(26, 16, 40, 0.6)',
  color: active ? '#0a0812' : filtercolor,
  border: `1px solid ${filtercolor}`,
  borderRadius: '20px',
  padding: '6px 16px',
  fontSize: '0.8rem',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? filtercolor : `${filtercolor}30`,
  },
}));

const BookmarkButton = styled(IconButton)<{ bookmarked?: boolean }>(({ bookmarked }) => ({
  color: bookmarked ? '#ec4899' : 'rgba(236, 72, 153, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#ec4899',
    transform: 'scale(1.1)',
  },
}));

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

// Types
interface SewingProject {
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
  { id: 'Clothing', name: 'Clothing', icon: Shirt, color: '#ec4899' },
  { id: 'Accessories', name: 'Accessories', icon: Heart, color: '#f472b6' },
  { id: 'Home Decor', name: 'Home Decor', icon: Home, color: '#8b5cf6' },
  { id: 'Costumes', name: 'Costumes', icon: Wand2, color: '#a855f7' },
  { id: 'Upcycling', name: 'Upcycling', icon: Recycle, color: '#22c55e' },
  { id: 'Repairs', name: 'Repairs', icon: Wrench, color: '#fbbf24' },
  { id: 'Alterations', name: 'Alterations', icon: Palette, color: '#06b6d4' },
  { id: 'Slow Fashion', name: 'Slow Fashion', icon: Leaf, color: '#84cc16' },
];

export const SewingProjectPlanner: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<SewingProject | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set());
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<string>>(new Set());

  const projects: SewingProject[] = sewingData.items;

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
      beginner: projects.filter((p) => p.difficulty === 'beginner').length,
    };
  }, [projects, completedProjects, bookmarkedProjects]);

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

  const getEnergyValue = (level: string): number => {
    const values: Record<string, number> = { low: 33, medium: 66, high: 100 };
    return values[level] || 50;
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.icon : Scissors;
  };

  const getCategoryColor = (categoryName: string) => {
    const cat = categories.find((c) => c.id === categoryName);
    return cat ? cat.color : '#ec4899';
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Scissors size={36} />
          Sewing Project Planner
        </Title>
        <Subtitle>200+ creative projects for every skill level</Subtitle>
      </Header>

      <StatsPanel>
        <StatCard>
          <Scissors size={24} color="#ec4899" />
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
          <Bookmark size={24} color="#fbbf24" />
          <Box>
            <StatNumber>{stats.bookmarked}</StatNumber>
            <StatLabel>Saved</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Star size={24} color="#8b5cf6" />
          <Box>
            <StatNumber>{stats.beginner}</StatNumber>
            <StatLabel>Beginner</StatLabel>
          </Box>
        </StatCard>
      </StatsPanel>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search projects, techniques, or materials..."
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

      <QuickFilters>
        <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', fontSize: '0.8rem', alignSelf: 'center' }}>
          Difficulty:
        </Typography>
        {['beginner', 'intermediate', 'advanced'].map((diff) => (
          <QuickFilterButton
            key={diff}
            active={selectedDifficulty === diff}
            filtercolor={diff === 'beginner' ? '#22c55e' : diff === 'intermediate' ? '#fbbf24' : '#ef4444'}
            onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </QuickFilterButton>
        ))}
        <Box sx={{ width: '16px' }} />
        <Typography sx={{ color: 'rgba(240, 230, 255, 0.6)', fontSize: '0.8rem', alignSelf: 'center' }}>
          Energy:
        </Typography>
        {['low', 'medium', 'high'].map((energy) => (
          <QuickFilterButton
            key={energy}
            active={selectedEnergy === energy}
            filtercolor={energy === 'low' ? '#22c55e' : energy === 'medium' ? '#fbbf24' : '#ef4444'}
            onClick={() => setSelectedEnergy(selectedEnergy === energy ? null : energy)}
          >
            <Zap size={12} style={{ marginRight: '4px' }} />
            {energy.charAt(0).toUpperCase() + energy.slice(1)}
          </QuickFilterButton>
        ))}
      </QuickFilters>

      <Typography
        sx={{
          textAlign: 'center',
          color: 'rgba(240, 230, 255, 0.6)',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}
      >
        Showing {filteredProjects.length} of {projects.length} projects
      </Typography>

      <ProjectGrid>
        {filteredProjects.map((project) => {
          const isCompleted = completedProjects.has(project.id);
          const isBookmarked = bookmarkedProjects.has(project.id);
          const CategoryIcon = getCategoryIcon(project.category);

          return (
            <ProjectCard
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
                <ProjectTitle>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CategoryIcon size={18} color={getCategoryColor(project.category)} />
                    {project.title}
                  </Box>
                  <Box sx={{ display: 'flex', gap: '4px' }}>
                    <BookmarkButton
                      bookmarked={isBookmarked}
                      onClick={(e) => toggleBookmarked(project.id, e)}
                      size="small"
                    >
                      <Bookmark size={16} fill={isBookmarked ? '#ec4899' : 'none'} />
                    </BookmarkButton>
                  </Box>
                </ProjectTitle>

                <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <DifficultyBadge level={project.difficulty}>
                    {project.difficulty}
                  </DifficultyBadge>
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
                </Box>

                <ProjectDescription>{project.description}</ProjectDescription>

                <EnergyIndicator>
                  <Zap size={14} color={project.energy_level === 'low' ? '#22c55e' : project.energy_level === 'medium' ? '#fbbf24' : '#ef4444'} />
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(240, 230, 255, 0.6)', minWidth: '50px' }}>
                    {project.energy_level} energy
                  </Typography>
                  <EnergyBar
                    variant="determinate"
                    value={getEnergyValue(project.energy_level)}
                    energylevel={project.energy_level}
                  />
                </EnergyIndicator>

                <TagContainer>
                  {project.tags.slice(0, 3).map((tag) => (
                    <ProjectTag key={tag} label={tag} size="small" />
                  ))}
                  {project.tags.length > 3 && (
                    <ProjectTag label={`+${project.tags.length - 3}`} size="small" />
                  )}
                </TagContainer>
              </CardContent>
            </ProjectCard>
          );
        })}
      </ProjectGrid>

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
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                color: '#f0e6ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Scissors size={24} color="#ec4899" />
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
                <Chip
                  label={selectedProject.category}
                  sx={{
                    backgroundColor: `${getCategoryColor(selectedProject.category)}20`,
                    color: getCategoryColor(selectedProject.category),
                    border: `1px solid ${getCategoryColor(selectedProject.category)}40`,
                  }}
                />
                <Chip
                  icon={<Zap size={14} />}
                  label={`${selectedProject.energy_level} energy`}
                  sx={{
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    '& .MuiChip-icon': { color: '#fbbf24' },
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
                <Typography sx={{ color: '#f472b6', fontWeight: 600, marginBottom: '12px' }}>
                  Project Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedProject.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        backgroundColor: 'rgba(236, 72, 153, 0.15)',
                        color: '#f472b6',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <EnergyIndicator sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: 'rgba(240, 230, 255, 0.7)', minWidth: '100px' }}>
                    Energy Required:
                  </Typography>
                  <EnergyBar
                    variant="determinate"
                    value={getEnergyValue(selectedProject.energy_level)}
                    energylevel={selectedProject.energy_level}
                  />
                </EnergyIndicator>
              </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={(e) => toggleBookmarked(selectedProject.id, e)}
                startIcon={<Bookmark size={18} fill={bookmarkedProjects.has(selectedProject.id) ? '#ec4899' : 'none'} />}
                sx={{
                  borderColor: '#ec4899',
                  color: '#ec4899',
                  '&:hover': { borderColor: '#f472b6', backgroundColor: 'rgba(236, 72, 153, 0.1)' },
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

export default SewingProjectPlanner;
