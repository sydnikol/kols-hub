import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Heart,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  Plus,
  Trash2,
  Edit2,
  Save,
  ChevronDown,
  ChevronUp,
  Shield,
  Sparkles,
  MessageCircle,
  Clock,
  Star,
  Home,
  UserPlus,
} from 'lucide-react';

// Animation keyframes
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.5); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  background: 'linear-gradient(135deg, #ec4899 0%, #d4af37 50%, #8b5cf6 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  fontFamily: '"Cinzel", serif',
});

const Subtitle = styled(Typography)({
  color: '#a0a0a0',
  fontSize: '1rem',
  maxWidth: '600px',
  margin: '0 auto',
});

const StyledTabs = styled(Tabs)({
  marginBottom: '24px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#ec4899',
  },
  '& .MuiTab-root': {
    color: '#888',
    '&.Mui-selected': {
      color: '#ec4899',
    },
  },
});

const ContentCard = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
  borderRadius: '20px',
  padding: '24px',
  border: '1px solid rgba(236, 72, 153, 0.2)',
  marginBottom: '20px',
  animation: `${fadeIn} 0.3s ease`,
});

const PersonCard = styled(Box)<{ expanded?: boolean }>(({ expanded }) => ({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  border: `1px solid ${expanded ? 'rgba(236, 72, 153, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
  marginBottom: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  animation: expanded ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    border: '1px solid rgba(236, 72, 153, 0.4)',
  },
}));

const PersonHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
});

const PersonContent = styled(Box)({
  padding: '0 20px 20px',
});

const SectionTitle = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#d4af37',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const HelpItem = styled(ListItem)({
  backgroundColor: 'rgba(34, 197, 94, 0.1)',
  borderRadius: '8px',
  marginBottom: '8px',
  border: '1px solid rgba(34, 197, 94, 0.2)',
});

const DontHelpItem = styled(ListItem)({
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: '8px',
  marginBottom: '8px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
});

const CrisisBox = styled(Box)({
  backgroundColor: 'rgba(234, 179, 8, 0.15)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid rgba(234, 179, 8, 0.3)',
  marginTop: '16px',
});

const NotesBox = styled(Box)({
  backgroundColor: 'rgba(139, 92, 246, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  marginTop: '16px',
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
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
  '& .MuiInputLabel-root': {
    color: '#888',
  },
});

const ActionButton = styled(Button)({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
});

const QuickTipCard = styled(Box)({
  background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(236, 72, 153, 0.2)',
  marginBottom: '16px',
});

const ResourceCard = styled(Box)({
  background: 'rgba(26, 16, 40, 0.6)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
  },
});

interface Person {
  id: string;
  label: string;
  how_to_help: string[];
  how_not_to_help: string[];
  crisis_plan: string;
  notes: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  );
}

// Initial data
const initialPeople: Person[] = [
  {
    id: 'self',
    label: 'Self-Care (Me)',
    how_to_help: [
      'Take breaks when energy is low - listen to your body',
      'Use the spoon system to track energy levels',
      'Ask for help before reaching burnout',
      'Practice grounding exercises when overwhelmed',
    ],
    how_not_to_help: [
      'Push through pain or exhaustion - it makes things worse',
      'Isolate completely when feeling down',
      'Skip medications or self-care routines',
    ],
    crisis_plan: 'Call support person, use grounding techniques (5-4-3-2-1 senses), move to safe space, contact crisis line if needed.',
    notes: 'Remember: You cannot pour from an empty cup. Taking care of yourself enables you to care for others.',
  },
  {
    id: 'partner',
    label: 'Partner',
    how_to_help: [
      'Listen without trying to fix everything',
      'Offer physical comfort when wanted',
      'Help with practical tasks during hard days',
      'Validate feelings before offering solutions',
    ],
    how_not_to_help: [
      'Dismiss concerns as "not that bad"',
      'Take over without asking first',
      'Make decisions without consulting them',
    ],
    crisis_plan: 'Stay calm, offer presence, help contact their therapist or doctor if needed.',
    notes: 'Communication styles may differ during stress. Check in about preferred support methods.',
  },
  {
    id: 'parent',
    label: 'Parent/Elder',
    how_to_help: [
      'Be patient and repeat information if needed',
      'Maintain their dignity and independence',
      'Schedule activities around their best times of day',
      'Break tasks into smaller, manageable steps',
    ],
    how_not_to_help: [
      'Talk down to them or treat them like a child',
      'Rush them through activities',
      'Make major decisions without their input',
    ],
    crisis_plan: 'Contact their primary care physician, have emergency contacts readily available.',
    notes: 'Track good days and difficult days to identify patterns.',
  },
  {
    id: 'child',
    label: 'Child',
    how_to_help: [
      'Use age-appropriate explanations',
      'Maintain consistent routines',
      'Validate their feelings even when behavior needs correction',
      'Offer choices within boundaries',
    ],
    how_not_to_help: [
      'Dismiss their concerns as "silly"',
      'Make promises you cannot keep',
      'Compare them to others',
    ],
    crisis_plan: 'Stay calm, ensure safety, contact pediatrician or crisis line for children.',
    notes: 'Children often express stress through behavior changes. Watch for patterns.',
  },
];

const caregiverResources = [
  { title: 'Caregiver Burnout Signs', icon: AlertTriangle, description: 'Learn to recognize when you need a break' },
  { title: 'Self-Care Checklist', icon: CheckCircle2, description: 'Daily, weekly, and monthly self-care tasks' },
  { title: 'Emergency Contacts', icon: Phone, description: 'Quick access to important numbers' },
  { title: 'Support Groups', icon: Users, description: 'Connect with other caregivers' },
];

const quickTips = [
  'Set boundaries - saying "no" is self-care',
  'Accept help when offered - you don\'t have to do it all',
  'Celebrate small wins - every good moment matters',
  'Schedule "me time" like any other appointment',
  'Keep a gratitude journal for difficult days',
];

export const CaregiverSupportHandbook: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [expandedPerson, setExpandedPerson] = useState<string | null>('self');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');

  const handleToggleExpand = (personId: string) => {
    setExpandedPerson(expandedPerson === personId ? null : personId);
  };

  const handleAddHelpItem = (personId: string, isHelp: boolean) => {
    if (!newItem.trim()) return;

    setPeople(prev => prev.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          [isHelp ? 'how_to_help' : 'how_not_to_help']: [
            ...person[isHelp ? 'how_to_help' : 'how_not_to_help'],
            newItem.trim()
          ]
        };
      }
      return person;
    }));
    setNewItem('');
  };

  const handleRemoveItem = (personId: string, index: number, isHelp: boolean) => {
    setPeople(prev => prev.map(person => {
      if (person.id === personId) {
        const key = isHelp ? 'how_to_help' : 'how_not_to_help';
        return {
          ...person,
          [key]: person[key].filter((_, i) => i !== index)
        };
      }
      return person;
    }));
  };

  const handleUpdateNotes = (personId: string, notes: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id === personId) {
        return { ...person, notes };
      }
      return person;
    }));
  };

  const handleUpdateCrisisPlan = (personId: string, crisis_plan: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id === personId) {
        return { ...person, crisis_plan };
      }
      return person;
    }));
  };

  return (
    <PageContainer>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Heart size={40} color="#ec4899" fill="#ec4899" />
        </Box>
        <Title>Caregiver Support Handbook</Title>
        <Subtitle>
          Your personalized guide to supporting loved ones while caring for yourself.
          Document what helps, what doesn't, and crisis plans for everyone you care for.
        </Subtitle>
      </Header>

      <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
        <StyledTabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          centered
        >
          <Tab icon={<Users size={18} />} label="People" />
          <Tab icon={<BookOpen size={18} />} label="Resources" />
          <Tab icon={<Sparkles size={18} />} label="Quick Tips" />
        </StyledTabs>

        {/* People Tab */}
        <TabPanel value={tabValue} index={0}>
          {people.map((person) => (
            <PersonCard key={person.id} expanded={expandedPerson === person.id}>
              <PersonHeader onClick={() => handleToggleExpand(person.id)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {person.id === 'self' ? <Heart size={22} /> :
                     person.id === 'partner' ? <Heart size={22} /> :
                     person.id === 'parent' ? <Home size={22} /> :
                     <Users size={22} />}
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>
                      {person.label}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                      {person.how_to_help.length} helpful actions • {person.how_not_to_help.length} things to avoid
                    </Typography>
                  </Box>
                </Box>
                <IconButton sx={{ color: '#8b5cf6' }}>
                  {expandedPerson === person.id ? <ChevronUp /> : <ChevronDown />}
                </IconButton>
              </PersonHeader>

              <Collapse in={expandedPerson === person.id}>
                <PersonContent>
                  {/* How to Help */}
                  <SectionTitle>
                    <CheckCircle2 size={18} color="#22c55e" />
                    How to Help
                  </SectionTitle>
                  <List sx={{ p: 0 }}>
                    {person.how_to_help.map((item, idx) => (
                      <HelpItem key={idx}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle2 size={18} color="#22c55e" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          sx={{ '& .MuiListItemText-primary': { color: '#e0e0e0' } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(person.id, idx, true)}
                          sx={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </HelpItem>
                    ))}
                  </List>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 3 }}>
                    <StyledTextField
                      size="small"
                      placeholder="Add helpful action..."
                      value={editMode === `${person.id}-help` ? newItem : ''}
                      onFocus={() => setEditMode(`${person.id}-help`)}
                      onChange={(e) => setNewItem(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <ActionButton
                      variant="contained"
                      size="small"
                      onClick={() => handleAddHelpItem(person.id, true)}
                      sx={{ backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}
                    >
                      <Plus size={18} />
                    </ActionButton>
                  </Box>

                  {/* How NOT to Help */}
                  <SectionTitle>
                    <XCircle size={18} color="#ef4444" />
                    What to Avoid
                  </SectionTitle>
                  <List sx={{ p: 0 }}>
                    {person.how_not_to_help.map((item, idx) => (
                      <DontHelpItem key={idx}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <XCircle size={18} color="#ef4444" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          sx={{ '& .MuiListItemText-primary': { color: '#e0e0e0' } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(person.id, idx, false)}
                          sx={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </DontHelpItem>
                    ))}
                  </List>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <StyledTextField
                      size="small"
                      placeholder="Add thing to avoid..."
                      value={editMode === `${person.id}-avoid` ? newItem : ''}
                      onFocus={() => setEditMode(`${person.id}-avoid`)}
                      onChange={(e) => setNewItem(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <ActionButton
                      variant="contained"
                      size="small"
                      onClick={() => handleAddHelpItem(person.id, false)}
                      sx={{ backgroundColor: '#ef4444', '&:hover': { backgroundColor: '#dc2626' } }}
                    >
                      <Plus size={18} />
                    </ActionButton>
                  </Box>

                  {/* Crisis Plan */}
                  <CrisisBox>
                    <SectionTitle sx={{ color: '#eab308' }}>
                      <AlertTriangle size={18} />
                      Crisis Plan
                    </SectionTitle>
                    <StyledTextField
                      multiline
                      rows={3}
                      fullWidth
                      value={person.crisis_plan}
                      onChange={(e) => handleUpdateCrisisPlan(person.id, e.target.value)}
                      placeholder="Document steps to take during a crisis..."
                    />
                  </CrisisBox>

                  {/* Notes */}
                  <NotesBox>
                    <SectionTitle sx={{ color: '#8b5cf6' }}>
                      <MessageCircle size={18} />
                      Personal Notes
                    </SectionTitle>
                    <StyledTextField
                      multiline
                      rows={2}
                      fullWidth
                      value={person.notes}
                      onChange={(e) => handleUpdateNotes(person.id, e.target.value)}
                      placeholder="Add personal notes, observations, patterns..."
                    />
                  </NotesBox>
                </PersonContent>
              </Collapse>
            </PersonCard>
          ))}

          <ActionButton
            variant="outlined"
            fullWidth
            startIcon={<UserPlus size={18} />}
            sx={{
              borderColor: 'rgba(236, 72, 153, 0.5)',
              color: '#ec4899',
              py: 1.5,
              '&:hover': {
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
              },
            }}
            onClick={() => {
              const newId = `person_${Date.now()}`;
              setPeople([...people, {
                id: newId,
                label: 'New Person',
                how_to_help: [],
                how_not_to_help: [],
                crisis_plan: '',
                notes: '',
              }]);
              setExpandedPerson(newId);
            }}
          >
            Add Another Person
          </ActionButton>
        </TabPanel>

        {/* Resources Tab */}
        <TabPanel value={tabValue} index={1}>
          <ContentCard>
            <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BookOpen size={22} />
              Caregiver Resources
            </Typography>

            {caregiverResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <ResourceCard key={idx}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={24} color="#d4af37" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                      {resource.title}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                      {resource.description}
                    </Typography>
                  </Box>
                </ResourceCard>
              );
            })}
          </ContentCard>

          <ContentCard>
            <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone size={22} />
              Crisis Hotlines
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '1.2rem' }}>
                  988 - Suicide & Crisis Lifeline
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  24/7, free and confidential support
                </Typography>
              </Box>

              <Box sx={{ p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <Typography sx={{ color: '#8b5cf6', fontWeight: 700, fontSize: '1.2rem' }}>
                  1-800-422-4453 - Childhelp
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  National child abuse hotline
                </Typography>
              </Box>

              <Box sx={{ p: 2, background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <Typography sx={{ color: '#22c55e', fontWeight: 700, fontSize: '1.2rem' }}>
                  1-800-677-1116 - Eldercare Locator
                </Typography>
                <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                  Connect to services for older adults
                </Typography>
              </Box>
            </Box>
          </ContentCard>
        </TabPanel>

        {/* Quick Tips Tab */}
        <TabPanel value={tabValue} index={2}>
          <ContentCard>
            <Typography variant="h6" sx={{ color: '#d4af37', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sparkles size={22} />
              Daily Reminders for Caregivers
            </Typography>

            {quickTips.map((tip, idx) => (
              <QuickTipCard key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Star size={18} color="#fff" />
                  </Box>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '1rem' }}>
                    {tip}
                  </Typography>
                </Box>
              </QuickTipCard>
            ))}
          </ContentCard>

          <ContentCard>
            <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Shield size={22} />
              Signs You Need a Break
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                'Constant exhaustion',
                'Feeling resentful',
                'Getting sick more often',
                'Withdrawing from friends',
                'Sleep problems',
                'Losing interest in activities',
                'Feeling hopeless',
                'Increased irritability',
                'Neglecting own needs',
              ].map((sign, idx) => (
                <Chip
                  key={idx}
                  label={sign}
                  sx={{
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    color: '#facc15',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                  }}
                />
              ))}
            </Box>

            <Box sx={{ mt: 3, p: 2, background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              <Typography sx={{ color: '#ec4899', fontWeight: 600, mb: 1 }}>
                Remember: Taking care of yourself is not selfish.
              </Typography>
              <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                It's essential. You deserve rest, joy, and support just as much as anyone you care for.
              </Typography>
            </Box>
          </ContentCard>
        </TabPanel>
      </Box>
    </PageContainer>
  );
};

export default CaregiverSupportHandbook;
