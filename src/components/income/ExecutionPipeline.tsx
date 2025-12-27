import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Tabs,
  Tab,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Play,
  Pause,
  Check,
  X,
  Clock,
  Zap,
  Settings as SettingsIcon,
  List as ListIcon,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Trash2,
  GripVertical,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
} from 'lucide-react';

// ============================================================================
// ANIMATIONS
// ============================================================================

const rotateGear = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const progressShimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const success = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const Container = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  minHeight: '100vh',
  padding: theme.spacing(3),
  color: '#ffffff',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(16, 185, 129, 0.2)',
}));

const GearIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  borderRadius: '50%',
  animation: `${rotateGear} 8s linear infinite`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 24,
    height: 24,
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: '50%',
    animation: `${rotateGear} 6s linear infinite reverse`,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 16, 40, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: theme.spacing(2),
  color: '#ffffff',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)',
  },
}));

const ExecuteButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  color: '#ffffff',
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(16, 185, 129, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(90deg, #059669 0%, #3b82f6 100%)',
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 120,
  '&.Mui-selected': {
    color: '#10b981',
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #3b82f6 100%)',
    backgroundSize: '200% 100%',
    animation: `${progressShimmer} 2s ease-in-out infinite`,
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(26, 16, 40, 0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  color: '#ffffff',
}));

const QueueItem = styled(ListItem)(({ theme }) => ({
  background: 'rgba(26, 16, 40, 0.6)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(26, 16, 40, 0.8)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
}));

const StepPreviewCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 16, 40, 0.4)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  color: '#ffffff',
}));

const SuccessNotification = styled(Alert)(({ theme }) => ({
  background: 'rgba(16, 185, 129, 0.2)',
  border: '1px solid #10b981',
  color: '#10b981',
  borderRadius: theme.spacing(1),
  animation: `${success} 0.5s ease`,
  '& .MuiAlert-icon': {
    color: '#10b981',
  },
}));

// ============================================================================
// TYPES
// ============================================================================

interface Idea {
  id: string;
  title: string;
  description: string;
  platform: 'Etsy' | 'Redbubble' | 'Shopify' | 'Amazon';
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

interface QueuedIdea extends Idea {
  scheduledTime: string;
  priority: number;
}

interface ExecutionStats {
  todayComplete: number;
  todayTotal: number;
  successRate: number;
  avgTime: number;
  queueRemaining: number;
}

interface StepData {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'approved';
  preview?: any;
  canEdit: boolean;
}

type ExecutionMode = 'one-click' | 'step-by-step' | 'autopilot';

// ============================================================================
// CONSTANTS
// ============================================================================

const EXECUTION_STEPS = [
  'Select Art',
  'Generate Mockups',
  'Create Listing Copy',
  'Set Price',
  'Review',
  'Publish',
];

const SAMPLE_IDEA: Idea = {
  id: '1',
  title: 'Celestial Moon Phases Art Print',
  description: 'Minimalist moon phases illustration with celestial elements',
  platform: 'Etsy',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ExecutionPipeline: React.FC = memo(() => {
  const [currentMode, setCurrentMode] = useState<ExecutionMode>('one-click');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState<string>('');
  const [executionComplete, setExecutionComplete] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<StepData[]>(
    EXECUTION_STEPS.map((name) => ({
      name,
      status: 'pending',
      canEdit: true,
    }))
  );
  const [queue, setQueue] = useState<QueuedIdea[]>([]);
  const [isQueueRunning, setIsQueueRunning] = useState(false);
  const [scheduleSettings, setScheduleSettings] = useState({
    ideasPerDay: 5,
    timeOfDay: '09:00',
    platforms: ['Etsy', 'Redbubble'],
  });

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedQueue = localStorage.getItem('executionQueue');
    const savedSettings = localStorage.getItem('scheduleSettings');

    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }
    if (savedSettings) {
      setScheduleSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('executionQueue', JSON.stringify(queue));
  }, [queue]);

  React.useEffect(() => {
    localStorage.setItem('scheduleSettings', JSON.stringify(scheduleSettings));
  }, [scheduleSettings]);

  // Execution stats
  const stats: ExecutionStats = useMemo(() => ({
    todayComplete: 12,
    todayTotal: 15,
    successRate: 95,
    avgTime: 2.3,
    queueRemaining: queue.length,
  }), [queue.length]);

  // One-Click Execute Handler
  const handleOneClickExecute = useCallback(async () => {
    setIsExecuting(true);
    setExecutionComplete(false);

    // Simulate execution phases
    const phases = ['Generating', 'Publishing', 'Complete'];
    for (let i = 0; i < phases.length; i++) {
      setExecutionProgress(phases[i]);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setExecutionComplete(true);
    setResultUrl('https://etsy.com/listing/12345');
    setIsExecuting(false);
    setExecutionProgress('');
  }, []);

  // Step-by-Step Handlers
  const handleApproveStep = useCallback(() => {
    setStepData(prev => {
      const updated = [...prev];
      updated[currentStep].status = 'approved';
      return updated;
    });

    if (currentStep < EXECUTION_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Simulate processing next step
      setStepData(prev => {
        const updated = [...prev];
        updated[currentStep + 1].status = 'processing';
        return updated;
      });
    }
  }, [currentStep]);

  const handleRegenerateStep = useCallback(() => {
    setStepData(prev => {
      const updated = [...prev];
      updated[currentStep].status = 'processing';
      return updated;
    });

    setTimeout(() => {
      setStepData(prev => {
        const updated = [...prev];
        updated[currentStep].status = 'pending';
        updated[currentStep].preview = { updated: true };
        return updated;
      });
    }, 1500);
  }, [currentStep]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Autopilot Queue Handlers
  const handleAddToQueue = useCallback(() => {
    const newIdea: QueuedIdea = {
      ...SAMPLE_IDEA,
      id: Date.now().toString(),
      scheduledTime: new Date(Date.now() + 3600000).toISOString(),
      priority: queue.length + 1,
      status: 'pending',
    };
    setQueue(prev => [...prev, newIdea]);
  }, [queue.length]);

  const handleRemoveFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleToggleQueue = useCallback(() => {
    setIsQueueRunning(prev => !prev);
  }, []);

  const recommendedMode = useMemo(() => {
    if (queue.length > 10) return 'autopilot';
    if (SAMPLE_IDEA.platform === 'Etsy') return 'one-click';
    return 'step-by-step';
  }, [queue.length]);

  // ============================================================================
  // MODE RENDERERS
  // ============================================================================

  const renderOneClickMode = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <StyledCard>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: '#10b981', fontWeight: 600 }}>
              {SAMPLE_IDEA.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              {SAMPLE_IDEA.description}
            </Typography>

            <Chip
              label={SAMPLE_IDEA.platform}
              sx={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                mb: 3,
              }}
            />

            <Box sx={{ mt: 3 }}>
              <ExecuteButton
                onClick={handleOneClickExecute}
                disabled={isExecuting}
                startIcon={isExecuting ? <RefreshCw size={20} /> : <Zap size={20} />}
                fullWidth
              >
                {isExecuting ? executionProgress : 'Execute'}
              </ExecuteButton>
            </Box>

            {isExecuting && (
              <Box sx={{ mt: 2, animation: `${slideIn} 0.3s ease` }}>
                <ProgressBar />
                <Typography
                  variant="body2"
                  sx={{ mt: 1, textAlign: 'center', color: '#10b981', animation: `${pulse} 1.5s ease infinite` }}
                >
                  {executionProgress}...
                </Typography>
              </Box>
            )}

            <Collapse in={executionComplete}>
              <Box sx={{ mt: 3 }}>
                <SuccessNotification icon={<Check />}>
                  Published to {SAMPLE_IDEA.platform} successfully!
                </SuccessNotification>
                <Button
                  href={resultUrl}
                  target="_blank"
                  sx={{
                    mt: 2,
                    color: '#3b82f6',
                    textTransform: 'none',
                    '&:hover': { background: 'rgba(59, 130, 246, 0.1)' },
                  }}
                  endIcon={<ChevronRight size={16} />}
                >
                  View listing
                </Button>
              </Box>
            </Collapse>
          </CardContent>
        </StyledCard>
      </Grid>

      <Grid item xs={12} md={4}>
        {renderStats()}
      </Grid>
    </Grid>
  );

  const renderStepByStepMode = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledCard>
          <CardContent>
            <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
              {EXECUTION_STEPS.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                      '& .MuiStepLabel-label.Mui-active': {
                        color: '#10b981',
                      },
                      '& .MuiStepLabel-label.Mui-completed': {
                        color: '#3b82f6',
                      },
                      '& .MuiStepIcon-root': {
                        color: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiStepIcon-root.Mui-active': {
                        color: '#10b981',
                      },
                      '& .MuiStepIcon-root.Mui-completed': {
                        color: '#3b82f6',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <StepPreviewCard>
              <Typography variant="h6" gutterBottom sx={{ color: '#10b981' }}>
                {EXECUTION_STEPS[currentStep]}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Review the generated content and approve to continue, or regenerate if needed.
              </Typography>

              {stepData[currentStep].status === 'processing' ? (
                <Box sx={{ py: 3 }}>
                  <ProgressBar />
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, textAlign: 'center', color: '#10b981' }}
                  >
                    Processing...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      p: 2,
                      background: 'rgba(10, 8, 18, 0.6)',
                      borderRadius: 1,
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Preview content for {EXECUTION_STEPS[currentStep]}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={handleApproveStep}
                      startIcon={<Check size={20} />}
                      sx={{
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                        },
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleRegenerateStep}
                      startIcon={<RefreshCw size={20} />}
                      sx={{
                        borderColor: '#3b82f6',
                        color: '#3b82f6',
                        '&:hover': {
                          borderColor: '#2563eb',
                          background: 'rgba(59, 130, 246, 0.1)',
                        },
                      }}
                    >
                      Regenerate
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon size={20} />}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          background: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      Edit
                    </Button>
                  </Stack>
                </>
              )}
            </StepPreviewCard>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                startIcon={<ChevronLeft size={20} />}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                }}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', alignSelf: 'center' }}>
                Step {currentStep + 1} of {EXECUTION_STEPS.length}
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Grid>

      <Grid item xs={12}>
        {renderStats()}
      </Grid>
    </Grid>
  );

  const renderAutopilotMode = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 600 }}>
                Execution Queue
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  icon={isQueueRunning ? <Play size={16} /> : <Pause size={16} />}
                  label={isQueueRunning ? 'Running' : 'Paused'}
                  sx={{
                    background: isQueueRunning
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: isQueueRunning ? '#10b981' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${isQueueRunning ? '#10b981' : 'rgba(255, 255, 255, 0.3)'}`,
                  }}
                />
                <IconButton
                  onClick={handleToggleQueue}
                  sx={{
                    background: isQueueRunning
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(16, 185, 129, 0.2)',
                    color: isQueueRunning ? '#ef4444' : '#10b981',
                    '&:hover': {
                      background: isQueueRunning
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(16, 185, 129, 0.3)',
                    },
                  }}
                >
                  {isQueueRunning ? <Pause size={20} /> : <Play size={20} />}
                </IconButton>
              </Box>
            </Box>

            <Button
              onClick={handleAddToQueue}
              startIcon={<Zap size={20} />}
              fullWidth
              sx={{
                mb: 3,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                },
              }}
            >
              Add Idea to Queue
            </Button>

            <List>
              {queue.map((idea, index) => (
                <QueueItem key={idea.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <GripVertical size={20} style={{ marginRight: 12, color: 'rgba(255, 255, 255, 0.3)' }} />
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500 }}>
                          {idea.title}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Chip
                            size="small"
                            label={idea.platform}
                            sx={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                              border: '1px solid #3b82f6',
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clock size={14} color="#10b981" />
                            <Typography variant="caption" sx={{ color: '#10b981' }}>
                              {new Date(idea.scheduledTime).toLocaleString()}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            label={idea.status || 'pending'}
                            sx={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                            }}
                          />
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFromQueue(idea.id)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { background: 'rgba(239, 68, 68, 0.1)' },
                        }}
                      >
                        <Trash2 size={20} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Box>
                </QueueItem>
              ))}
              {queue.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ListIcon size={48} color="rgba(255, 255, 255, 0.3)" style={{ marginBottom: 16 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    No ideas in queue. Add some to get started!
                  </Typography>
                </Box>
              )}
            </List>
          </CardContent>
        </StyledCard>
      </Grid>

      <Grid item xs={12} md={4}>
        <StyledCard sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon size={20} />
              Schedule Settings
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Ideas per day"
                type="number"
                value={scheduleSettings.ideasPerDay}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, ideasPerDay: parseInt(e.target.value) }))}
                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{
                  style: { color: '#ffffff' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Time of day"
                type="time"
                value={scheduleSettings.timeOfDay}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, timeOfDay: e.target.value }))}
                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' }, shrink: true }}
                InputProps={{
                  style: { color: '#ffffff' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Platforms</InputLabel>
              <Select
                multiple
                value={scheduleSettings.platforms}
                onChange={(e) => setScheduleSettings(prev => ({ ...prev, platforms: e.target.value as string[] }))}
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                }}
              >
                <MenuItem value="Etsy">Etsy</MenuItem>
                <MenuItem value="Redbubble">Redbubble</MenuItem>
                <MenuItem value="Shopify">Shopify</MenuItem>
                <MenuItem value="Amazon">Amazon</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </StyledCard>

        {renderStats()}
      </Grid>
    </Grid>
  );

  const renderStats = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: '#10b981', mb: 2 }}>
        Execution Stats
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StatsCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Calendar size={20} color="#3b82f6" />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Today
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 600 }}>
              {stats.todayComplete}/{stats.todayTotal}
            </Typography>
          </StatsCard>
        </Grid>

        <Grid item xs={6}>
          <StatsCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Target size={20} color="#3b82f6" />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Success Rate
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 600 }}>
              {stats.successRate}%
            </Typography>
          </StatsCard>
        </Grid>

        <Grid item xs={6}>
          <StatsCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Clock size={20} color="#3b82f6" />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Avg Time
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 600 }}>
              {stats.avgTime}m
            </Typography>
          </StatsCard>
        </Grid>

        <Grid item xs={6}>
          <StatsCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUp size={20} color="#3b82f6" />
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Queue
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 600 }}>
              {stats.queueRemaining}
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>
    </Box>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Container>
      <Header>
        <GearIcon />
        <Box>
          <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
            Execution Pipeline
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Automate your passive income creation
          </Typography>
        </Box>
        {currentMode === recommendedMode && (
          <Chip
            label="Recommended"
            icon={<Zap size={16} />}
            sx={{
              ml: 'auto',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              fontWeight: 600,
            }}
          />
        )}
      </Header>

      <StyledTabs
        value={currentMode}
        onChange={(_, value) => setCurrentMode(value)}
        centered
      >
        <StyledTab
          value="one-click"
          label="One-Click Execute"
          icon={<Zap size={20} />}
          iconPosition="start"
        />
        <StyledTab
          value="step-by-step"
          label="Step-by-Step"
          icon={<ListIcon size={20} />}
          iconPosition="start"
        />
        <StyledTab
          value="autopilot"
          label="Autopilot Queue"
          icon={<Target size={20} />}
          iconPosition="start"
        />
      </StyledTabs>

      {currentMode === 'one-click' && renderOneClickMode()}
      {currentMode === 'step-by-step' && renderStepByStepMode()}
      {currentMode === 'autopilot' && renderAutopilotMode()}
    </Container>
  );
});

ExecutionPipeline.displayName = 'ExecutionPipeline';

export default ExecutionPipeline;
