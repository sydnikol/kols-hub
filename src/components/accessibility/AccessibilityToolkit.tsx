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
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Eye,
  Ear,
  Hand,
  Brain,
  Sparkles,
  X,
  Star,
  CheckCircle2,
  Settings,
  Volume2,
  Type,
  MousePointer,
  Keyboard,
  Monitor,
  Accessibility,
} from 'lucide-react';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
`;

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
  background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #8b5cf6 100%)',
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

const QuickSettings = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '24px',
  border: '1px solid rgba(34, 197, 94, 0.3)',
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(34, 197, 94, 0.3)' },
    '&:hover fieldset': { borderColor: '#22c55e' },
    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
  },
  '& .MuiInputBase-input': { color: '#fff' },
});

const CategoryChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const CategoryChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor || '#22c55e' : 'rgba(34, 197, 94, 0.15)',
  color: selected ? '#fff' : '#4ade80',
  border: `1px solid ${selected ? chipcolor || '#22c55e' : 'rgba(34, 197, 94, 0.3)'}`,
  '&:hover': { backgroundColor: selected ? chipcolor : 'rgba(34, 197, 94, 0.25)' },
  transition: 'all 0.3s ease',
}));

const ToolsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const ToolCard = styled(Box)<{ enabled?: boolean }>(({ enabled }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '16px',
  padding: '20px',
  border: `1px solid ${enabled ? 'rgba(34, 197, 94, 0.5)' : 'rgba(139, 92, 246, 0.3)'}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  animation: enabled ? `${pulse} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 40px rgba(34, 197, 94, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: enabled ? '#22c55e' : 'linear-gradient(90deg, #22c55e, #06b6d4, #8b5cf6)',
  },
}));

const CardTitle = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#fff',
  marginBottom: '8px',
});

const CardDescription = styled(Typography)({
  fontSize: '0.85rem',
  color: '#a0a0a0',
  lineHeight: 1.5,
  marginBottom: '12px',
});

const DifficultyBadge = styled(Box)<{ level?: string }>(({ level }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: level === 'easy' ? 'rgba(34, 197, 94, 0.2)' :
                   level === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
                   'rgba(239, 68, 68, 0.2)',
  color: level === 'easy' ? '#4ade80' : level === 'medium' ? '#facc15' : '#f87171',
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
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  color: '#4ade80',
  border: '1px solid rgba(34, 197, 94, 0.2)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #0d0d1a 100%)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '20px',
    maxWidth: '600px',
    width: '100%',
  },
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

const StatItem = styled(Box)({ textAlign: 'center' });
const StatValue = styled(Typography)({ fontSize: '1.8rem', fontWeight: 700, color: '#22c55e' });
const StatLabel = styled(Typography)({ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' });

const accessibilityTools = [
  { id: 'access_001', category: 'Visual Accessibility', title: 'High Contrast Mode', description: 'Enable high contrast display settings on all devices to improve text readability and reduce eye strain.', difficulty: 'easy', tags: ['visual', 'display', 'contrast'] },
  { id: 'access_002', category: 'Visual Accessibility', title: 'Screen Reader Setup', description: 'Configure a screen reader like NVDA, JAWS, or VoiceOver to navigate digital content through audio.', difficulty: 'medium', tags: ['visual', 'screen-reader', 'audio'] },
  { id: 'access_003', category: 'Visual Accessibility', title: 'Text-to-Speech for Documents', description: 'Use text-to-speech software to have documents, emails, and web content read aloud.', difficulty: 'easy', tags: ['visual', 'text-to-speech', 'reading'] },
  { id: 'access_004', category: 'Visual Accessibility', title: 'Magnification Tools', description: 'Set up screen magnification software or use built-in zoom features to enlarge content.', difficulty: 'easy', tags: ['visual', 'magnification', 'zoom'] },
  { id: 'access_005', category: 'Visual Accessibility', title: 'Color Blind Filters', description: 'Apply color blind accessibility filters to distinguish colors that might appear similar.', difficulty: 'easy', tags: ['visual', 'colorblind', 'filters'] },
  { id: 'access_006', category: 'Motor Accessibility', title: 'Voice Control Setup', description: 'Configure voice control to operate your device hands-free using speech commands.', difficulty: 'medium', tags: ['motor', 'voice', 'hands-free'] },
  { id: 'access_007', category: 'Motor Accessibility', title: 'Keyboard Navigation', description: 'Learn keyboard shortcuts to navigate without a mouse. Tab, arrow keys, and shortcuts.', difficulty: 'easy', tags: ['motor', 'keyboard', 'shortcuts'] },
  { id: 'access_008', category: 'Motor Accessibility', title: 'Sticky Keys Enable', description: 'Enable sticky keys to press keyboard shortcuts one key at a time instead of simultaneously.', difficulty: 'easy', tags: ['motor', 'keyboard', 'sticky-keys'] },
  { id: 'access_009', category: 'Motor Accessibility', title: 'Mouse Pointer Customization', description: 'Adjust mouse pointer size, speed, and appearance for easier tracking and clicking.', difficulty: 'easy', tags: ['motor', 'mouse', 'pointer'] },
  { id: 'access_010', category: 'Motor Accessibility', title: 'Switch Access Configuration', description: 'Set up switch access for users who cannot use traditional input methods.', difficulty: 'hard', tags: ['motor', 'switch', 'alternative-input'] },
  { id: 'access_011', category: 'Hearing Accessibility', title: 'Closed Captions Enable', description: 'Turn on closed captions for all video content across streaming and social media apps.', difficulty: 'easy', tags: ['hearing', 'captions', 'video'] },
  { id: 'access_012', category: 'Hearing Accessibility', title: 'Visual Notifications', description: 'Enable visual alerts (screen flash, LED) for notifications instead of sound-only.', difficulty: 'easy', tags: ['hearing', 'visual', 'notifications'] },
  { id: 'access_013', category: 'Hearing Accessibility', title: 'Mono Audio Setting', description: 'Combine stereo audio into mono for users with hearing in one ear only.', difficulty: 'easy', tags: ['hearing', 'audio', 'mono'] },
  { id: 'access_014', category: 'Cognitive Accessibility', title: 'Focus Mode Enable', description: 'Use focus mode to reduce distractions and show only essential content.', difficulty: 'easy', tags: ['cognitive', 'focus', 'distraction'] },
  { id: 'access_015', category: 'Cognitive Accessibility', title: 'Reading Mode', description: 'Enable reading mode in browsers to strip away ads and show clean, readable text.', difficulty: 'easy', tags: ['cognitive', 'reading', 'clean'] },
  { id: 'access_016', category: 'Cognitive Accessibility', title: 'Timer and Reminder Setup', description: 'Configure timers and reminders for tasks to support memory and time management.', difficulty: 'easy', tags: ['cognitive', 'memory', 'reminders'] },
  { id: 'access_017', category: 'Cognitive Accessibility', title: 'Simplified Interface Mode', description: 'Use simplified or easy mode on devices to reduce complexity of the interface.', difficulty: 'easy', tags: ['cognitive', 'simplified', 'interface'] },
  { id: 'access_018', category: 'Cognitive Accessibility', title: 'Text Spacing Adjustment', description: 'Increase letter, word, and line spacing to improve reading comprehension.', difficulty: 'easy', tags: ['cognitive', 'reading', 'spacing'] },
  { id: 'access_019', category: 'Physical Setup', title: 'Ergonomic Workstation', description: 'Set up ergonomic desk, chair, and monitor positions to reduce physical strain.', difficulty: 'medium', tags: ['physical', 'ergonomic', 'workstation'] },
  { id: 'access_020', category: 'Physical Setup', title: 'Adjustable Desk Setup', description: 'Use a sit-stand desk to alternate positions throughout the day.', difficulty: 'medium', tags: ['physical', 'standing', 'adjustable'] },
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Accessibility, color: '#d4af37' },
  { id: 'Visual Accessibility', name: 'Visual', icon: Eye, color: '#22c55e' },
  { id: 'Motor Accessibility', name: 'Motor', icon: Hand, color: '#06b6d4' },
  { id: 'Hearing Accessibility', name: 'Hearing', icon: Ear, color: '#8b5cf6' },
  { id: 'Cognitive Accessibility', name: 'Cognitive', icon: Brain, color: '#ec4899' },
  { id: 'Physical Setup', name: 'Physical', icon: Monitor, color: '#f97316' },
];

export const AccessibilityToolkit: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState<typeof accessibilityTools[0] | null>(null);
  const [enabledTools, setEnabledTools] = useState<Set<string>>(new Set());

  // Quick settings
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const filteredTools = useMemo(() => {
    return accessibilityTools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => ({
    total: accessibilityTools.length,
    enabled: enabledTools.size,
    categories: categories.length - 1,
  }), [enabledTools]);

  const handleToggle = (id: string) => {
    setEnabledTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getCategoryIcon = (cat: string) => {
    const found = categories.find(c => c.id === cat || c.name === cat);
    return found?.icon || Accessibility;
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Accessibility size={40} color="#22c55e" />
        </Box>
        <Title>Accessibility Toolkit</Title>
        <Subtitle>Personalize your digital experience with adaptive accommodations</Subtitle>
      </Header>

      <QuickSettings>
        <Typography sx={{ color: '#22c55e', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings size={20} />
          Quick Settings
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <FormControlLabel
            control={<Switch checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22c55e' } }} />}
            label={<Typography sx={{ color: '#fff' }}>High Contrast</Typography>}
          />
          <FormControlLabel
            control={<Switch checked={largeText} onChange={(e) => setLargeText(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#06b6d4' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#06b6d4' } }} />}
            label={<Typography sx={{ color: '#fff' }}>Large Text</Typography>}
          />
          <FormControlLabel
            control={<Switch checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8b5cf6' } }} />}
            label={<Typography sx={{ color: '#fff' }}>Reduced Motion</Typography>}
          />
        </Box>
      </QuickSettings>

      <StatsBar>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Available Tools</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.enabled}</StatValue>
          <StatLabel>Enabled</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.categories}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatItem>
      </StatsBar>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search accessibility tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={20} color="#22c55e" /></InputAdornment>,
          }}
        />
      </SearchContainer>

      <CategoryChipsContainer>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <CategoryChip
              key={cat.id}
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Icon size={14} />{cat.name}</Box>}
              selected={selectedCategory === cat.id}
              chipcolor={cat.color}
              onClick={() => setSelectedCategory(cat.id)}
            />
          );
        })}
      </CategoryChipsContainer>

      <Typography sx={{ color: '#888', textAlign: 'center', mb: 3 }}>
        Showing {filteredTools.length} accessibility tools
      </Typography>

      <ToolsGrid>
        {filteredTools.map((tool) => {
          const Icon = getCategoryIcon(tool.category);
          const isEnabled = enabledTools.has(tool.id);

          return (
            <ToolCard key={tool.id} enabled={isEnabled} onClick={() => setSelectedTool(tool)}>
              {isEnabled && (
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <CheckCircle2 size={24} color="#22c55e" />
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color="#22c55e" />
                </Box>
                <Box>
                  <Typography sx={{ color: '#22c55e', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {tool.category}
                  </Typography>
                  <CardTitle>{tool.title}</CardTitle>
                </Box>
              </Box>

              <CardDescription>{tool.description}</CardDescription>

              <DifficultyBadge level={tool.difficulty}>
                <Star size={12} />
                {tool.difficulty} setup
              </DifficultyBadge>

              <TagsContainer>
                {tool.tags.map((tag, idx) => <Tag key={idx}>{tag}</Tag>)}
              </TagsContainer>
            </ToolCard>
          );
        })}
      </ToolsGrid>

      <StyledDialog open={!!selectedTool} onClose={() => setSelectedTool(null)}>
        {selectedTool && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(34, 197, 94, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#22c55e' }}>{selectedTool.category}</Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>{selectedTool.title}</Typography>
              </Box>
              <IconButton onClick={() => setSelectedTool(null)} sx={{ color: '#888' }}><X size={24} /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography sx={{ color: '#e0e0e0', mb: 3, lineHeight: 1.7, fontSize: '1.05rem' }}>
                {selectedTool.description}
              </Typography>

              <DifficultyBadge level={selectedTool.difficulty} sx={{ mb: 3 }}>
                <Star size={14} />
                {selectedTool.difficulty} to set up
              </DifficultyBadge>

              <Typography variant="subtitle2" sx={{ color: '#22c55e', mb: 1 }}>Related:</Typography>
              <TagsContainer sx={{ mb: 3 }}>
                {selectedTool.tags.map((tag, idx) => <Tag key={idx} sx={{ fontSize: '0.8rem', padding: '4px 12px' }}>{tag}</Tag>)}
              </TagsContainer>

              <Box sx={{ p: 2, background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <Typography sx={{ color: '#22c55e', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Accessibility size={18} />Accessibility Note
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  Everyone's needs are different. Experiment with settings to find what works best for you.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <Button variant="outlined" onClick={() => setSelectedTool(null)}
                sx={{ borderColor: 'rgba(139, 92, 246, 0.5)', color: '#8b5cf6', '&:hover': { borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)' } }}>
                Close
              </Button>
              <Button variant="contained" onClick={() => { handleToggle(selectedTool.id); setSelectedTool(null); }}
                startIcon={enabledTools.has(selectedTool.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{ backgroundColor: enabledTools.has(selectedTool.id) ? '#ef4444' : '#22c55e', '&:hover': { backgroundColor: enabledTools.has(selectedTool.id) ? '#dc2626' : '#16a34a' } }}>
                {enabledTools.has(selectedTool.id) ? 'Disable Tool' : 'Enable Tool'}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </PageContainer>
  );
};

export default AccessibilityToolkit;
