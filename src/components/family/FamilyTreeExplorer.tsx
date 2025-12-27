import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Users,
  User,
  Heart,
  MapPin,
  Calendar,
  BookOpen,
  Feather,
  Star,
  X,
  ChevronRight,
  MessageCircle,
  TreePine,
  Globe,
  Activity,
  Sparkles,
  Navigation,
} from 'lucide-react';

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled Components
const ExplorerContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #0d1a14 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\' fill=\'%2310b98120\'/%3E%3C/svg%3E")',
    opacity: 0.5,
    pointerEvents: 'none',
  },
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(16, 185, 129, 0.5)',
  marginBottom: '8px',
});

const AncestorCard = styled(Card)<{ generation?: number; selected?: boolean }>(({ generation = 0, selected }) => ({
  background: generation === 0
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)'
    : generation === 1
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
    : generation === 2
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 140, 40, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  border: `2px solid ${selected
    ? '#10b981'
    : generation === 0
    ? 'rgba(16, 185, 129, 0.4)'
    : generation === 1
    ? 'rgba(59, 130, 246, 0.3)'
    : generation === 2
    ? 'rgba(139, 92, 246, 0.3)'
    : 'rgba(212, 175, 55, 0.3)'}`,
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: selected ? `${pulseGlow} 2s infinite` : 'none',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
  },
}));

const GenerationLabel = styled(Box)<{ gen?: number }>(({ gen = 0 }) => ({
  background: gen === 0
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    : gen === 1
    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    : gen === 2
    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    : 'linear-gradient(135deg, #d4af37 0%, #b48c28 100%)',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  display: 'inline-block',
  marginBottom: '8px',
}));

const HeritageBadge = styled(Box)<{ type?: string }>(({ type }) => ({
  background: type === 'african'
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'
    : type === 'native'
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 140, 40, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
  border: `1px solid ${type === 'african'
    ? 'rgba(139, 92, 246, 0.4)'
    : type === 'native'
    ? 'rgba(212, 175, 55, 0.4)'
    : 'rgba(16, 185, 129, 0.4)'}`,
  borderRadius: '12px',
  padding: '12px',
  marginBottom: '12px',
}));

const StoryCard = styled(Box)({
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  borderRadius: '12px',
  padding: '12px',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
});

const MigrationLine = styled(Box)({
  background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
  height: '3px',
  borderRadius: '2px',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    top: '-3.5px',
  },
  '&::before': {
    left: 0,
    background: '#10b981',
  },
  '&::after': {
    right: 0,
    background: '#8b5cf6',
  },
});

// Family Data
const ancestors = [
  {
    id: 'sydney-jones',
    name: 'Sydney Jones',
    nickname: 'Kol',
    birthYear: 1999,
    birthDate: 'September 7, 1999',
    birthPlace: 'Urbana, Illinois',
    relation: 'Self',
    generation: 0,
    sex: 'Non-binary',
    pronouns: 'they/them',
    culturalBackground: ['African American', 'Blackfoot (Siksika)'],
    partners: ['Da\'Veon', 'Quincy'],
    healthConditions: ['hEDS', 'POTS', 'Chronic Pain'],
    stories: [
      'Sydney was born in Urbana, Illinois and has deep roots in both Pennsylvania and the American South.',
      'Through their maternal grandmother Jacquie, Sydney carries Blackfoot (Siksika) Native American heritage.',
      'Despite living with hEDS, POTS, and chronic pain, Sydney continues to build and create.',
    ],
  },
  {
    id: 'james-jones-jr',
    name: 'James Collins Jones Jr.',
    birthYear: 1953,
    birthDate: 'December 13, 1953',
    birthPlace: 'Pittsburgh, Pennsylvania',
    relation: 'Father',
    generation: 1,
    sex: 'M',
    culturalBackground: ['African American'],
    residences: ['Pittsburgh, PA', 'Urbana, IL', 'Houston, TX', 'Virginia'],
    stories: ['James was born in Pittsburgh and later lived in several states.'],
  },
  {
    id: 'linda-jones',
    name: 'Linda C. Jones',
    maidenName: 'Samuels',
    birthYear: 1957,
    birthDate: 'August 1957',
    birthPlace: 'Fort Gordon, Georgia',
    relation: 'Mother',
    generation: 1,
    sex: 'F',
    culturalBackground: ['African American', 'Blackfoot (Siksika)'],
    residences: ['Fayetteville, NC', 'Stone Mountain, GA', 'Overland Park, KS'],
    stories: [
      'Linda was born at Fort Gordon, Georgia and attended Fayetteville State University.',
      'Linda carries Blackfoot heritage through her mother Jacquie.',
    ],
  },
  {
    id: 'james-collins-jones-sr',
    name: 'James Collins Jones Sr.',
    birthYear: 1921,
    birthDate: 'October 9, 1921',
    birthPlace: 'Alabama',
    deathYear: 1982,
    deathDate: 'August 28, 1982',
    deathPlace: 'Pittsburgh, Pennsylvania',
    relation: 'Paternal Grandfather',
    generation: 2,
    sex: 'M',
    culturalBackground: ['African American'],
    stories: [
      'James Collins Jones Sr. was born in Alabama and moved to Pittsburgh as a young child.',
      'Part of the Great Migration from the South to the North.',
    ],
  },
  {
    id: 'elizabeth-p-jones',
    name: 'Elizabeth P. Jones',
    maidenName: 'Peterson',
    birthYear: 1922,
    birthDate: 'May 18, 1922',
    birthPlace: 'Pittsburgh, Pennsylvania',
    deathYear: 2009,
    relation: 'Paternal Grandmother',
    generation: 2,
    sex: 'F',
    occupation: 'Punch Press Operator',
    culturalBackground: ['African American'],
    stories: [
      'Elizabeth was a lifelong Pittsburgh resident.',
      'She worked operating a punch press and lived independently.',
    ],
  },
  {
    id: 'jacquie-ella-vaughn',
    name: 'Jacquie Ella Vaughn',
    birthYear: 1934,
    birthDate: 'February 15, 1934',
    birthPlace: 'Florence, Alabama',
    deathYear: 2024,
    deathDate: 'September 16, 2024',
    relation: 'Maternal Grandmother',
    generation: 2,
    sex: 'F',
    culturalBackground: ['African American', 'Blackfoot (Siksika) - Half'],
    nativeHeritage: {
      tribe: 'Blackfoot',
      nation: 'Siksika',
      territory: 'Northern Great Plains',
      percentage: '50%',
    },
    stories: [
      'Jacquie Ella was born in Florence, Alabama and later settled in Fayetteville, North Carolina.',
      'She was half Blackfoot (Siksika), carrying the heritage of the great plains tribes.',
      'Her Blackfoot ancestry connects the family to the Siksika people of the Blackfoot Confederacy.',
    ],
  },
  {
    id: 'eva-mae-beckwith-perkins',
    name: 'Eva Mae Beckwith Perkins',
    relation: 'Maternal Great-Grandmother',
    generation: 3,
    sex: 'F',
    culturalBackground: ['African American'],
    stories: ['Eva Mae is an ancestor through the maternal line.'],
  },
];

const migrations = [
  { from: 'Alabama', to: 'Pittsburgh, Pennsylvania', period: 'Early 1900s', notes: 'Part of the Great Migration' },
  { from: 'Pittsburgh, Pennsylvania', to: 'Illinois', period: '1990s', notes: 'Family expansion to the Midwest' },
  { from: 'Northern Great Plains', to: 'Alabama', period: 'Historical', notes: 'Blackfoot heritage entering the family line' },
];

const getGenerationLabel = (gen: number) => {
  switch (gen) {
    case 0: return 'You';
    case 1: return 'Parents';
    case 2: return 'Grandparents';
    case 3: return 'Great-Grandparents';
    default: return `Generation ${gen}`;
  }
};

const getGenerationColor = (gen: number) => {
  switch (gen) {
    case 0: return '#10b981';
    case 1: return '#3b82f6';
    case 2: return '#8b5cf6';
    default: return '#d4af37';
  }
};

export const FamilyTreeExplorer: React.FC = () => {
  const [selectedAncestor, setSelectedAncestor] = useState<typeof ancestors[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'map'>('tree');

  const openDetail = (ancestor: typeof ancestors[0]) => {
    setSelectedAncestor(ancestor);
    setDetailOpen(true);
  };

  const groupedByGeneration = ancestors.reduce((acc, ancestor) => {
    const gen = ancestor.generation;
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(ancestor);
    return acc;
  }, {} as Record<number, typeof ancestors>);

  return (
    <ExplorerContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <GothicTitle variant="h3">Family Tree Explorer</GothicTitle>
        <Typography sx={{ color: '#34d399', fontSize: '1.1rem', mb: 2 }}>
          Discover your ancestors, heritage, and family stories
        </Typography>

        {/* Heritage Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <HeritageBadge type="african">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Globe size={16} color="#a78bfa" />
              <Typography sx={{ color: '#c4b5fd', fontWeight: 600 }}>African American</Typography>
            </Box>
          </HeritageBadge>
          <HeritageBadge type="native">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Feather size={16} color="#d4af37" />
              <Typography sx={{ color: '#f4d03f', fontWeight: 600 }}>Blackfoot (Siksika)</Typography>
              <Chip label="~12.5%" size="small" sx={{ background: '#d4af37', color: '#000', fontWeight: 600, height: 20 }} />
            </Box>
          </HeritageBadge>
        </Box>
      </Box>

      {/* View Mode Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        {[
          { id: 'tree', label: 'Tree View', icon: TreePine },
          { id: 'list', label: 'List View', icon: Users },
          { id: 'map', label: 'Migration Map', icon: Navigation },
        ].map((mode) => {
          const ModeIcon = mode.icon;
          return (
            <Button
              key={mode.id}
              onClick={() => setViewMode(mode.id as typeof viewMode)}
              startIcon={<ModeIcon size={18} />}
              sx={{
                background: viewMode === mode.id
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'rgba(16, 185, 129, 0.1)',
                color: viewMode === mode.id ? '#fff' : '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                px: 3,
                '&:hover': {
                  background: viewMode === mode.id
                    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                    : 'rgba(16, 185, 129, 0.2)',
                },
              }}
            >
              {mode.label}
            </Button>
          );
        })}
      </Box>

      {/* Tree View */}
      {viewMode === 'tree' && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {Object.entries(groupedByGeneration)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([gen, ancestorsInGen]) => (
              <Box key={gen} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <GenerationLabel gen={Number(gen)}>
                    {getGenerationLabel(Number(gen))}
                  </GenerationLabel>
                  <Box sx={{ flex: 1, height: '1px', background: `${getGenerationColor(Number(gen))}40` }} />
                </Box>

                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                  justifyContent: Number(gen) === 0 ? 'center' : 'flex-start',
                }}>
                  {ancestorsInGen.map((ancestor) => (
                    <AncestorCard
                      key={ancestor.id}
                      generation={ancestor.generation}
                      selected={selectedAncestor?.id === ancestor.id}
                      onClick={() => openDetail(ancestor)}
                      sx={{ width: Number(gen) === 0 ? 400 : 320 }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar sx={{
                            width: 60,
                            height: 60,
                            background: `${getGenerationColor(ancestor.generation)}30`,
                            border: `2px solid ${getGenerationColor(ancestor.generation)}`,
                          }}>
                            <User size={28} color={getGenerationColor(ancestor.generation)} />
                          </Avatar>

                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{
                              color: '#e2e8f0',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              fontFamily: '"Cinzel", serif',
                            }}>
                              {ancestor.name}
                            </Typography>

                            {ancestor.nickname && (
                              <Typography sx={{ color: '#10b981', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                "{ancestor.nickname}"
                              </Typography>
                            )}

                            <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                              {ancestor.relation}
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {ancestor.culturalBackground.map((bg, i) => (
                                <Chip
                                  key={i}
                                  label={bg}
                                  size="small"
                                  sx={{
                                    background: bg.includes('Blackfoot')
                                      ? 'rgba(212, 175, 55, 0.2)'
                                      : 'rgba(139, 92, 246, 0.2)',
                                    color: bg.includes('Blackfoot') ? '#f4d03f' : '#c4b5fd',
                                    border: `1px solid ${bg.includes('Blackfoot') ? 'rgba(212, 175, 55, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`,
                                    fontSize: '0.7rem',
                                    height: 22,
                                  }}
                                />
                              ))}
                            </Box>

                            {ancestor.birthPlace && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: '#64748b' }}>
                                <MapPin size={12} />
                                <Typography sx={{ fontSize: '0.8rem' }}>{ancestor.birthPlace}</Typography>
                              </Box>
                            )}

                            {ancestor.birthYear && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                <Calendar size={12} />
                                <Typography sx={{ fontSize: '0.8rem' }}>
                                  {ancestor.birthYear}{ancestor.deathYear ? ` - ${ancestor.deathYear}` : ''}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            size="small"
                            endIcon={<ChevronRight size={16} />}
                            sx={{ color: getGenerationColor(ancestor.generation) }}
                          >
                            View Story
                          </Button>
                        </Box>
                      </CardContent>
                    </AncestorCard>
                  ))}
                </Box>
              </Box>
            ))}
        </Box>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ color: '#34d399', fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Family Migration Paths
          </Typography>

          {migrations.map((migration, idx) => (
            <Box key={idx} sx={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              p: 3,
              mb: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <MapPin size={20} color="#10b981" />
                  <Typography sx={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>
                    {migration.from}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <MigrationLine />
                  <Typography sx={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', mt: 1 }}>
                    {migration.period}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <MapPin size={20} color="#8b5cf6" />
                  <Typography sx={{ color: '#a78bfa', fontWeight: 600, fontSize: '0.9rem' }}>
                    {migration.to}
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>
                {migration.notes}
              </Typography>
            </Box>
          ))}

          {/* Blackfoot Territory Info */}
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 140, 40, 0.1) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '16px',
            p: 3,
            mt: 4,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Feather size={24} color="#d4af37" />
              <Typography sx={{ color: '#f4d03f', fontWeight: 700, fontSize: '1.1rem' }}>
                Blackfoot (Siksika) Heritage
              </Typography>
            </Box>

            <Typography sx={{ color: '#fef3c7', mb: 2 }}>
              The Blackfoot Confederacy includes the Siksika, Kainai (Blood), and Piikani (Piegan) nations.
              Traditional territory spans the Northern Great Plains of Montana, Alberta, and Saskatchewan.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label="Siksika Nation" sx={{ background: 'rgba(212, 175, 55, 0.3)', color: '#f4d03f' }} />
              <Chip label="Blackfoot Confederacy" sx={{ background: 'rgba(212, 175, 55, 0.3)', color: '#f4d03f' }} />
              <Chip label="Northern Great Plains" sx={{ background: 'rgba(212, 175, 55, 0.3)', color: '#f4d03f' }} />
            </Box>
          </Box>
        </Box>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800, mx: 'auto' }}>
          {ancestors.map((ancestor, idx) => (
            <Box
              key={ancestor.id}
              onClick={() => openDetail(ancestor)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                mb: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.1)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Avatar sx={{
                background: `${getGenerationColor(ancestor.generation)}30`,
                border: `2px solid ${getGenerationColor(ancestor.generation)}`,
              }}>
                <User size={20} color={getGenerationColor(ancestor.generation)} />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#e2e8f0', fontWeight: 600 }}>{ancestor.name}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>{ancestor.relation}</Typography>
              </Box>

              <GenerationLabel gen={ancestor.generation}>
                Gen {ancestor.generation}
              </GenerationLabel>

              <ChevronRight size={20} color="#10b981" />
            </Box>
          ))}
        </Box>
      )}

      {/* Stats */}
      <Box sx={{
        mt: 4,
        p: 3,
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
              {ancestors.length}
            </Typography>
            <Typography sx={{ color: '#34d399', fontSize: '0.9rem' }}>
              Ancestors
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
              4
            </Typography>
            <Typography sx={{ color: '#34d399', fontSize: '0.9rem' }}>
              Generations
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 700 }}>
              2
            </Typography>
            <Typography sx={{ color: '#34d399', fontSize: '0.9rem' }}>
              Heritages
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
              {migrations.length}
            </Typography>
            <Typography sx={{ color: '#34d399', fontSize: '0.9rem' }}>
              Migrations
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0a0812 0%, #0d1a14 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
          },
        }}
      >
        {selectedAncestor && (
          <>
            <DialogTitle sx={{
              background: `linear-gradient(135deg, ${getGenerationColor(selectedAncestor.generation)}20 0%, ${getGenerationColor(selectedAncestor.generation)}10 100%)`,
              borderBottom: `1px solid ${getGenerationColor(selectedAncestor.generation)}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{
                  width: 60,
                  height: 60,
                  background: `${getGenerationColor(selectedAncestor.generation)}30`,
                  border: `2px solid ${getGenerationColor(selectedAncestor.generation)}`,
                }}>
                  <User size={28} color={getGenerationColor(selectedAncestor.generation)} />
                </Avatar>
                <Box>
                  <Typography sx={{
                    color: '#e2e8f0',
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    fontFamily: '"Cinzel", serif',
                  }}>
                    {selectedAncestor.name}
                  </Typography>
                  <Typography sx={{ color: '#94a3b8' }}>{selectedAncestor.relation}</Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setDetailOpen(false)}>
                <X size={20} color="#10b981" />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              {/* Vital Info */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                {selectedAncestor.birthDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} color="#10b981" />
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      Born: {selectedAncestor.birthDate}
                    </Typography>
                  </Box>
                )}
                {selectedAncestor.birthPlace && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={16} color="#10b981" />
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {selectedAncestor.birthPlace}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Heritage */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#34d399', fontWeight: 600, mb: 1 }}>Cultural Heritage</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedAncestor.culturalBackground.map((bg, i) => (
                    <Chip
                      key={i}
                      label={bg}
                      sx={{
                        background: bg.includes('Blackfoot')
                          ? 'rgba(212, 175, 55, 0.2)'
                          : 'rgba(139, 92, 246, 0.2)',
                        color: bg.includes('Blackfoot') ? '#f4d03f' : '#c4b5fd',
                        border: `1px solid ${bg.includes('Blackfoot') ? 'rgba(212, 175, 55, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Native Heritage Detail */}
              {selectedAncestor.nativeHeritage && (
                <HeritageBadge type="native" sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Feather size={18} color="#d4af37" />
                    <Typography sx={{ color: '#f4d03f', fontWeight: 600 }}>
                      {selectedAncestor.nativeHeritage.tribe} ({selectedAncestor.nativeHeritage.nation})
                    </Typography>
                    <Chip
                      label={selectedAncestor.nativeHeritage.percentage}
                      size="small"
                      sx={{ background: '#d4af37', color: '#000', fontWeight: 600 }}
                    />
                  </Box>
                  <Typography sx={{ color: '#fef3c7', fontSize: '0.9rem' }}>
                    Traditional Territory: {selectedAncestor.nativeHeritage.territory}
                  </Typography>
                </HeritageBadge>
              )}

              {/* Stories */}
              {selectedAncestor.stories && selectedAncestor.stories.length > 0 && (
                <Box>
                  <Typography sx={{ color: '#34d399', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookOpen size={18} />
                    Family Stories
                  </Typography>
                  {selectedAncestor.stories.map((story, i) => (
                    <StoryCard key={i}>
                      <Sparkles size={16} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography sx={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {story}
                      </Typography>
                    </StoryCard>
                  ))}
                </Box>
              )}

              {/* Health Conditions (for self) */}
              {selectedAncestor.healthConditions && (
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Activity size={18} />
                    Health Conditions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedAncestor.healthConditions.map((condition, i) => (
                      <Chip
                        key={i}
                        label={condition}
                        sx={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Partners (for self) */}
              {selectedAncestor.partners && (
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ color: '#ec4899', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Heart size={18} />
                    Partners
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedAncestor.partners.map((partner, i) => (
                      <Chip
                        key={i}
                        label={partner}
                        sx={{
                          background: 'rgba(236, 72, 153, 0.2)',
                          color: '#f472b6',
                          border: '1px solid rgba(236, 72, 153, 0.4)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Chat with Ancestor Button */}
              <Box sx={{ mt: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<MessageCircle size={18} />}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    },
                  }}
                >
                  Chat with {selectedAncestor.name.split(' ')[0]}
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </ExplorerContainer>
  );
};

export default FamilyTreeExplorer;
