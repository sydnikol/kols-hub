// GothicMealPlanner.tsx - Weekly Meal Planning with Drag-Drop
// Part of the Gothic Dollhouse Kitchen Lab

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  ShoppingCart,
  Sparkles,
  Search,
  Clock,
  Users,
  GripVertical,
  Copy,
  Download,
  RefreshCw,
  Sun,
  Sunrise,
  Moon,
  Coffee,
} from 'lucide-react';
import {
  gothicRecipes,
  GothicRecipe,
  formatTime,
  getTotalTime,
  searchRecipes,
  getRandomRecipe,
  categoryLabels,
  RecipeCategory,
} from '../../data/gothicRecipes';

// Types
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface MealSlot {
  recipeId: string | null;
  notes?: string;
}

interface DayPlan {
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
  snack: MealSlot;
}

interface WeekPlan {
  [key: string]: DayPlan; // key is DayOfWeek
  weekStart: string; // ISO date string
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0f0a18 100%)',
  padding: '24px',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
  borderRadius: '16px',
  padding: '24px 32px',
  marginBottom: '24px',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s infinite`,
  },
});

const WeekNavigator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  background: 'rgba(26, 16, 40, 0.8)',
  borderRadius: '12px',
  padding: '8px 16px',
  marginBottom: '24px',
});

const DayColumn = styled(Paper)<{ isToday?: boolean }>(({ isToday }) => ({
  background: isToday
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)'
    : 'rgba(26, 16, 40, 0.6)',
  borderRadius: '16px',
  border: isToday ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
  overflow: 'hidden',
  animation: `${fadeIn} 0.5s ease-out`,
  height: '100%',
}));

const DayHeader = styled(Box)<{ isToday?: boolean }>(({ isToday }) => ({
  background: isToday
    ? 'linear-gradient(135deg, #8b5cf6 0%, #d4af37 100%)'
    : 'rgba(139, 92, 246, 0.2)',
  padding: '12px 16px',
  textAlign: 'center',
}));

const MealSlotBox = styled(Box)<{ hasRecipe?: boolean }>(({ hasRecipe }) => ({
  minHeight: '80px',
  padding: '12px',
  margin: '8px',
  borderRadius: '12px',
  background: hasRecipe ? 'rgba(34, 197, 94, 0.1)' : 'rgba(26, 16, 40, 0.4)',
  border: `1px dashed ${hasRecipe ? 'rgba(34, 197, 94, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    background: hasRecipe ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.1)',
    borderColor: hasRecipe ? '#22c55e' : '#8b5cf6',
  },
}));

const MealTypeIcon: React.FC<{ type: MealType }> = ({ type }) => {
  const icons = {
    breakfast: <Sunrise size={16} color="#f97316" />,
    lunch: <Sun size={16} color="#eab308" />,
    dinner: <Moon size={16} color="#8b5cf6" />,
    snack: <Coffee size={16} color="#ec4899" />,
  };
  return icons[type];
};

const RecipePickerDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    color: '#ffffff',
    maxWidth: '600px',
  },
});

const RecipeOption = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '12px',
  background: 'rgba(26, 16, 40, 0.6)',
  marginBottom: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.2)',
    transform: 'translateX(4px)',
  },
});

// Helper functions
const getDaysOfWeek = (): DayOfWeek[] => [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const getMealTypes = (): MealType[] => ['breakfast', 'lunch', 'dinner', 'snack'];

const formatDayLabel = (day: DayOfWeek): string => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDateRange = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
};

const isToday = (weekStart: Date, dayIndex: number): boolean => {
  const today = new Date();
  const day = new Date(weekStart);
  day.setDate(day.getDate() + dayIndex);
  return day.toDateString() === today.toDateString();
};

const createEmptyDayPlan = (): DayPlan => ({
  breakfast: { recipeId: null },
  lunch: { recipeId: null },
  dinner: { recipeId: null },
  snack: { recipeId: null },
});

const createEmptyWeekPlan = (weekStart: Date): WeekPlan => {
  const plan: WeekPlan = { weekStart: weekStart.toISOString() };
  getDaysOfWeek().forEach(day => {
    plan[day] = createEmptyDayPlan();
  });
  return plan;
};

// Main Component
interface GothicMealPlannerProps {
  onGenerateShoppingList?: (recipeIds: string[]) => void;
}

export const GothicMealPlanner: React.FC<GothicMealPlannerProps> = ({ onGenerateShoppingList }) => {
  // State
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getWeekStart(new Date()));
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(() => createEmptyWeekPlan(getWeekStart(new Date())));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: DayOfWeek; meal: MealType } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RecipeCategory | 'all'>('all');
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; day: DayOfWeek; meal: MealType } | null>(null);

  // Load from localStorage
  useEffect(() => {
    const key = `gothic-meal-plan-${currentWeekStart.toISOString().split('T')[0]}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setWeekPlan(JSON.parse(saved));
    } else {
      setWeekPlan(createEmptyWeekPlan(currentWeekStart));
    }
  }, [currentWeekStart]);

  // Save to localStorage
  useEffect(() => {
    const key = `gothic-meal-plan-${currentWeekStart.toISOString().split('T')[0]}`;
    localStorage.setItem(key, JSON.stringify(weekPlan));
  }, [weekPlan, currentWeekStart]);

  // Navigation
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  // Meal slot handlers
  const openRecipePicker = (day: DayOfWeek, meal: MealType) => {
    setSelectedSlot({ day, meal });
    setSearchQuery('');
    setCategoryFilter('all');
    setPickerOpen(true);
  };

  const selectRecipe = (recipeId: string) => {
    if (selectedSlot) {
      setWeekPlan(prev => ({
        ...prev,
        [selectedSlot.day]: {
          ...prev[selectedSlot.day],
          [selectedSlot.meal]: { recipeId, notes: '' },
        },
      }));
      setPickerOpen(false);
      setSelectedSlot(null);
    }
  };

  const clearSlot = (day: DayOfWeek, meal: MealType) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: { recipeId: null },
      },
    }));
    setContextMenu(null);
  };

  const copySlot = (day: DayOfWeek, meal: MealType) => {
    const recipeId = (weekPlan[day] as DayPlan)[meal].recipeId;
    if (recipeId) {
      localStorage.setItem('gothic-copied-meal', recipeId);
    }
    setContextMenu(null);
  };

  const pasteSlot = (day: DayOfWeek, meal: MealType) => {
    const copiedId = localStorage.getItem('gothic-copied-meal');
    if (copiedId) {
      setWeekPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: { recipeId: copiedId, notes: '' },
        },
      }));
    }
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, day: DayOfWeek, meal: MealType) => {
    e.preventDefault();
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, day, meal });
  };

  // Generate suggestions
  const generateSuggestions = () => {
    const days = getDaysOfWeek();
    const meals = getMealTypes();
    const newPlan = { ...weekPlan };

    days.forEach(day => {
      meals.forEach(meal => {
        if (!(newPlan[day] as DayPlan)[meal].recipeId) {
          const random = getRandomRecipe();
          (newPlan[day] as DayPlan)[meal] = { recipeId: random.id, notes: '' };
        }
      });
    });

    setWeekPlan(newPlan);
  };

  const clearWeek = () => {
    setWeekPlan(createEmptyWeekPlan(currentWeekStart));
  };

  // Get all recipe IDs for shopping list
  const getAllRecipeIds = (): string[] => {
    const ids: string[] = [];
    getDaysOfWeek().forEach(day => {
      getMealTypes().forEach(meal => {
        const recipeId = (weekPlan[day] as DayPlan)?.[meal]?.recipeId;
        if (recipeId && !ids.includes(recipeId)) {
          ids.push(recipeId);
        }
      });
    });
    return ids;
  };

  const handleGenerateShoppingList = () => {
    const ids = getAllRecipeIds();
    if (onGenerateShoppingList) {
      onGenerateShoppingList(ids);
    }
  };

  // Get recipe by ID
  const getRecipe = (id: string | null): GothicRecipe | undefined => {
    if (!id) return undefined;
    return gothicRecipes.find(r => r.id === id);
  };

  // Filter recipes for picker
  const filteredRecipes = searchQuery
    ? searchRecipes(searchQuery)
    : categoryFilter !== 'all'
    ? gothicRecipes.filter(r => r.category === categoryFilter)
    : gothicRecipes;

  // Count planned meals
  const plannedMealsCount = getAllRecipeIds().length;

  return (
    <Container>
      {/* Header */}
      <Header>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Calendar size={40} color="#d4af37" />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontFamily: '"Cinzel", serif', color: '#ffffff', fontWeight: 700 }}
              >
                Gothic Meal Planner
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Plan your week, simplify your cooking
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<Sparkles size={20} />}
              onClick={generateSuggestions}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                '&:hover': { background: 'rgba(255,255,255,0.3)' },
              }}
            >
              Auto-Fill
            </Button>
            <Button
              startIcon={<ShoppingCart size={20} />}
              onClick={handleGenerateShoppingList}
              disabled={plannedMealsCount === 0}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                color: '#0a0812',
                fontWeight: 600,
                '&:hover': { background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)' },
                '&:disabled': { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' },
              }}
            >
              Shopping List ({plannedMealsCount})
            </Button>
          </Stack>
        </Stack>
      </Header>

      {/* Week Navigator */}
      <WeekNavigator>
        <IconButton onClick={goToPreviousWeek} sx={{ color: '#8b5cf6' }}>
          <ChevronLeft size={24} />
        </IconButton>
        <Typography sx={{ color: '#d4af37', fontWeight: 600, fontSize: '1.1rem', minWidth: '180px', textAlign: 'center' }}>
          {formatDateRange(currentWeekStart)}
        </Typography>
        <IconButton onClick={goToNextWeek} sx={{ color: '#8b5cf6' }}>
          <ChevronRight size={24} />
        </IconButton>
        <Button
          size="small"
          onClick={goToCurrentWeek}
          sx={{ color: '#a78bfa', ml: 2 }}
        >
          Today
        </Button>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Clear week">
          <IconButton onClick={clearWeek} sx={{ color: 'rgba(239, 68, 68, 0.7)' }}>
            <Trash2 size={20} />
          </IconButton>
        </Tooltip>
      </WeekNavigator>

      {/* Week Grid */}
      <Grid container spacing={2}>
        {getDaysOfWeek().map((day, dayIndex) => {
          const dayPlan = weekPlan[day] as DayPlan;
          const today = isToday(currentWeekStart, dayIndex);

          return (
            <Grid item xs={12} sm={6} md={12/7} key={day}>
              <DayColumn isToday={today}>
                <DayHeader isToday={today}>
                  <Typography
                    sx={{
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 600,
                      color: today ? '#ffffff' : '#d4af37',
                      fontSize: '0.95rem',
                    }}
                  >
                    {formatDayLabel(day)}
                  </Typography>
                  {today && (
                    <Chip
                      label="Today"
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: '20px',
                        fontSize: '0.7rem',
                        background: 'rgba(255,255,255,0.2)',
                        color: '#ffffff',
                      }}
                    />
                  )}
                </DayHeader>

                {getMealTypes().map(meal => {
                  const slot = dayPlan?.[meal];
                  const recipe = getRecipe(slot?.recipeId || null);

                  return (
                    <MealSlotBox
                      key={meal}
                      hasRecipe={!!recipe}
                      onClick={() => openRecipePicker(day, meal)}
                      onContextMenu={(e) => handleContextMenu(e, day, meal)}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <MealTypeIcon type={meal} />
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                          }}
                        >
                          {meal}
                        </Typography>
                      </Stack>

                      {recipe ? (
                        <Box>
                          <Typography
                            sx={{
                              color: '#d4af37',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              lineHeight: 1.2,
                            }}
                          >
                            {recipe.image} {recipe.gothicName}
                          </Typography>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            <Chip
                              icon={<Clock size={10} />}
                              label={formatTime(getTotalTime(recipe))}
                              size="small"
                              sx={{
                                height: '18px',
                                fontSize: '0.65rem',
                                background: 'rgba(139, 92, 246, 0.2)',
                                color: '#a78bfa',
                                '& .MuiChip-icon': { fontSize: '10px' },
                              }}
                            />
                          </Stack>
                        </Box>
                      ) : (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          sx={{ height: '40px' }}
                        >
                          <Plus size={20} color="rgba(139, 92, 246, 0.5)" />
                        </Stack>
                      )}
                    </MealSlotBox>
                  );
                })}
              </DayColumn>
            </Grid>
          );
        })}
      </Grid>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            background: 'rgba(26, 16, 40, 0.95)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#ffffff',
          },
        }}
      >
        <MenuItem
          onClick={() => contextMenu && clearSlot(contextMenu.day, contextMenu.meal)}
          sx={{ '&:hover': { background: 'rgba(239, 68, 68, 0.2)' } }}
        >
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Clear
        </MenuItem>
        <MenuItem
          onClick={() => contextMenu && copySlot(contextMenu.day, contextMenu.meal)}
          sx={{ '&:hover': { background: 'rgba(139, 92, 246, 0.2)' } }}
        >
          <Copy size={16} style={{ marginRight: 8 }} />
          Copy
        </MenuItem>
        <MenuItem
          onClick={() => contextMenu && pasteSlot(contextMenu.day, contextMenu.meal)}
          sx={{ '&:hover': { background: 'rgba(139, 92, 246, 0.2)' } }}
        >
          <Download size={16} style={{ marginRight: 8 }} />
          Paste
        </MenuItem>
      </Menu>

      {/* Recipe Picker Dialog */}
      <RecipePickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontWeight: 600 }}>
              Choose a Recipe
            </Typography>
            <IconButton onClick={() => setPickerOpen(false)}>
              <X color="#8b5cf6" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#8b5cf6" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                background: 'rgba(26, 16, 40, 0.8)',
                '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                '&:hover fieldset': { borderColor: '#8b5cf6' },
                '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
              },
            }}
          />

          {/* Category Filter */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            {(['all', 'comfort', 'healthy', 'quick', 'desserts', 'drinks', 'cultural'] as const).map(cat => (
              <Chip
                key={cat}
                label={cat === 'all' ? 'All' : categoryLabels[cat as RecipeCategory]}
                size="small"
                onClick={() => setCategoryFilter(cat)}
                sx={{
                  background: categoryFilter === cat ? 'rgba(139, 92, 246, 0.3)' : 'rgba(26, 16, 40, 0.6)',
                  color: categoryFilter === cat ? '#d4af37' : 'rgba(255,255,255,0.7)',
                  border: `1px solid ${categoryFilter === cat ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'}`,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Stack>

          {/* Recipe List */}
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredRecipes.slice(0, 20).map(recipe => (
              <RecipeOption key={recipe.id} onClick={() => selectRecipe(recipe.id)}>
                <Box sx={{ fontSize: '2rem' }}>{recipe.image}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#d4af37', fontWeight: 600, fontSize: '0.95rem' }}>
                    {recipe.gothicName}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                    {recipe.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip
                      icon={<Clock size={12} />}
                      label={formatTime(getTotalTime(recipe))}
                      size="small"
                      sx={{ height: '20px', fontSize: '0.7rem', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                    />
                    <Chip
                      icon={<Users size={12} />}
                      label={recipe.servings}
                      size="small"
                      sx={{ height: '20px', fontSize: '0.7rem', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}
                    />
                  </Stack>
                </Box>
              </RecipeOption>
            ))}
            {filteredRecipes.length > 20 && (
              <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', py: 2 }}>
                Showing first 20 of {filteredRecipes.length} recipes. Refine your search to see more.
              </Typography>
            )}
            {filteredRecipes.length === 0 && (
              <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', py: 4 }}>
                No recipes found. Try a different search term.
              </Typography>
            )}
          </Box>

          {/* Random Button */}
          <Button
            fullWidth
            startIcon={<RefreshCw size={20} />}
            onClick={() => selectRecipe(getRandomRecipe().id)}
            sx={{
              mt: 2,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(212, 175, 55, 0.2))',
              color: '#d4af37',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(212, 175, 55, 0.3))',
              },
            }}
          >
            Pick Random Recipe
          </Button>
        </DialogContent>
      </RecipePickerDialog>
    </Container>
  );
};

export default GothicMealPlanner;
