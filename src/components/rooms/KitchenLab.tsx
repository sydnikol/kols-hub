// Kitchen Lab Room Component
// Recipes, meal planning, and cooking with chronic illness accommodations

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  ChefHat, Flame, Clock, Heart, Leaf, Zap,
  BookOpen, Sparkles, Timer, Star, ThermometerSun, UtensilsCrossed, Apple, Wand2
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const simmer = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-5px); opacity: 1; }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0c0808 0%, #1a1210 50%, #0c0808 100%)',
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
  color: '#f97316',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(249, 115, 22, 0.4)',
  marginBottom: '8px',
});

const RecipeCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(249, 115, 22, 0.2)',
  },
});

const SpoonIndicator = styled(Box)<{ spoons: number }>(({ spoons }) => ({
  display: 'flex',
  gap: '4px',
  '& .spoon': {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: spoons >= 1 ? '#f97316' : 'rgba(249, 115, 22, 0.2)',
    '&:nth-of-type(2)': { background: spoons >= 2 ? '#f97316' : 'rgba(249, 115, 22, 0.2)' },
    '&:nth-of-type(3)': { background: spoons >= 3 ? '#f97316' : 'rgba(249, 115, 22, 0.2)' },
    '&:nth-of-type(4)': { background: spoons >= 4 ? '#f97316' : 'rgba(249, 115, 22, 0.2)' },
    '&:nth-of-type(5)': { background: spoons >= 5 ? '#f97316' : 'rgba(249, 115, 22, 0.2)' },
  },
}));

const recipes = [
  { id: 1, name: 'One-Pot Lemon Pasta', spoons: 1, time: '20 min', tags: ['Low Spoon', 'Quick'], image: '🍝' },
  { id: 2, name: 'Sheet Pan Chicken', spoons: 2, time: '45 min', tags: ['Meal Prep', 'Protein'], image: '🍗' },
  { id: 3, name: 'Slow Cooker Stew', spoons: 1, time: '6 hrs', tags: ['Set & Forget', 'Comfort'], image: '🍲' },
  { id: 4, name: 'Microwave Mug Cake', spoons: 1, time: '5 min', tags: ['Low Spoon', 'Sweet'], image: '🧁' },
  { id: 5, name: 'Buddha Bowl', spoons: 2, time: '25 min', tags: ['Healthy', 'Colorful'], image: '🥗' },
  { id: 6, name: 'Dump & Go Soup', spoons: 1, time: '30 min', tags: ['Low Spoon', 'Freezable'], image: '🥣' },
];

const mealPlan = [
  { day: 'Mon', breakfast: '🥣 Oatmeal', lunch: '🥗 Salad', dinner: '🍝 Pasta' },
  { day: 'Tue', breakfast: '🍳 Eggs', lunch: '🥪 Sandwich', dinner: '🍗 Chicken' },
  { day: 'Wed', breakfast: '🥐 Toast', lunch: '🍲 Soup', dinner: '🌮 Tacos' },
  { day: 'Thu', breakfast: '🥣 Cereal', lunch: '🥗 Leftovers', dinner: '🍕 Pizza' },
  { day: 'Fri', breakfast: '🍌 Smoothie', lunch: '🥪 Wrap', dinner: '🍲 Stew' },
];

const pantryCategories = [
  { name: 'Proteins', items: 8, icon: '🥩' },
  { name: 'Grains', items: 12, icon: '🌾' },
  { name: 'Produce', items: 15, icon: '🥬' },
  { name: 'Spices', items: 24, icon: '🧂' },
];

const cookingTips = [
  { tip: 'Prep ingredients while sitting', category: 'Low Energy' },
  { tip: 'Use a kitchen stool', category: 'Mobility' },
  { tip: 'Batch cook on good days', category: 'Planning' },
  { tip: 'Keep easy snacks accessible', category: 'Flare Days' },
];

export const KitchenLab: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'recipes' | 'plan' | 'pantry'>('recipes');
  const [currentSpoons, setCurrentSpoons] = useState(3);

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <ChefHat size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Kitchen Lab
        </RoomTitle>
        <Typography sx={{ color: '#a08060', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Nourishment made accessible
        </Typography>
      </HeaderSection>

      {/* Energy Level Selector */}
      <GothicCard variant="elevated" ornate sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
        <Typography sx={{ color: '#f97316', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2, textAlign: 'center' }}>
          <Zap size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Today's Spoon Level
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          {[1, 2, 3, 4, 5].map((level) => (
            <Box
              key={level}
              onClick={() => setCurrentSpoons(level)}
              sx={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: currentSpoons >= level ? '#f97316' : 'rgba(249, 115, 22, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: currentSpoons >= level ? '2px solid #fb923c' : '2px solid transparent',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <Typography sx={{ color: currentSpoons >= level ? '#0a0a0f' : '#888888', fontWeight: 700 }}>
                {level}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ color: '#a0a0a0', textAlign: 'center', fontSize: '0.9rem' }}>
          Showing recipes matching your energy level
        </Typography>
      </GothicCard>

      {/* View Toggle */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        {[
          { key: 'recipes', label: 'Recipes', icon: <BookOpen size={18} /> },
          { key: 'plan', label: 'Meal Plan', icon: <Timer size={18} /> },
          { key: 'pantry', label: 'Pantry', icon: <UtensilsCrossed size={18} /> },
        ].map((tab) => (
          <GothicButton
            key={tab.key}
            variant={activeView === tab.key ? 'accent' : 'ghost'}
            startIcon={tab.icon}
            onClick={() => setActiveView(tab.key as typeof activeView)}
          >
            {tab.label}
          </GothicButton>
        ))}
      </Box>

      {/* Navigation to Related Pages */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <GothicButton variant="primary" startIcon={<ChefHat size={18} />} onClick={() => navigate('/cooking')}>
          Cooking Hub
        </GothicButton>
        <GothicButton variant="secondary" startIcon={<Apple size={18} />} onClick={() => navigate('/nutrition')}>
          Nutrition Hub
        </GothicButton>
        <GothicButton variant="ghost" startIcon={<Wand2 size={18} />} onClick={() => navigate('/kitchen-witch')}>
          Kitchen Witch
        </GothicButton>
      </Box>

      {activeView === 'recipes' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
              <Flame size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Recipes for {currentSpoons} Spoons
            </Typography>
            <Grid container spacing={2}>
              {recipes.filter(r => r.spoons <= currentSpoons).map((recipe) => (
                <Grid item xs={12} sm={6} key={recipe.id}>
                  <RecipeCard variant="glass">
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ fontSize: '3rem' }}>{recipe.image}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem', mb: 1 }}>
                          {recipe.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            icon={<Clock size={12} />}
                            label={recipe.time}
                            size="small"
                            sx={{ background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' }}
                          />
                          {recipe.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                        <SpoonIndicator spoons={recipe.spoons}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Box key={s} className="spoon" />
                          ))}
                        </SpoonIndicator>
                      </Box>
                    </Box>
                  </RecipeCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <GothicCard variant="glass" sx={{ mb: 3 }}>
              <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <Leaf size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Low Energy Tips
              </Typography>
              {cookingTips.map((tip, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderLeft: '3px solid #10b981',
                  }}
                >
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{tip.tip}</Typography>
                  <Chip
                    label={tip.category}
                    size="small"
                    sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', mt: 1, fontSize: '0.7rem' }}
                  />
                </Box>
              ))}
            </GothicCard>

            <GothicCard variant="glass">
              <Typography sx={{ color: '#ec4899', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <Heart size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Favorites
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Comfort Soup', 'Easy Pasta', 'Mug Meals', 'No-Cook'].map((fav) => (
                  <Chip
                    key={fav}
                    label={fav}
                    sx={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </GothicCard>
          </Grid>
        </Grid>
      )}

      {activeView === 'plan' && (
        <GothicCard variant="elevated" ornate>
          <Typography sx={{ color: '#f97316', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Timer size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            This Week's Meal Plan
          </Typography>
          <Grid container spacing={2}>
            {mealPlan.map((day) => (
              <Grid item xs={12} sm={6} md={2.4} key={day.day}>
                <Box
                  sx={{
                    p: 2,
                    background: 'rgba(249, 115, 22, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                  }}
                >
                  <Typography sx={{ color: '#f97316', fontWeight: 700, mb: 2, textAlign: 'center' }}>
                    {day.day}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ p: 1, background: 'rgba(20, 20, 30, 0.6)', borderRadius: '8px' }}>
                      <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Breakfast</Typography>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{day.breakfast}</Typography>
                    </Box>
                    <Box sx={{ p: 1, background: 'rgba(20, 20, 30, 0.6)', borderRadius: '8px' }}>
                      <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Lunch</Typography>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{day.lunch}</Typography>
                    </Box>
                    <Box sx={{ p: 1, background: 'rgba(20, 20, 30, 0.6)', borderRadius: '8px' }}>
                      <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Dinner</Typography>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{day.dinner}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <GothicButton variant="primary" startIcon={<Sparkles size={18} />}>
              Generate AI Plan
            </GothicButton>
            <GothicButton variant="secondary" startIcon={<BookOpen size={18} />}>
              Shopping List
            </GothicButton>
          </Box>
        </GothicCard>
      )}

      {activeView === 'pantry' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
              <UtensilsCrossed size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Your Pantry
            </Typography>
            <Grid container spacing={2}>
              {pantryCategories.map((category) => (
                <Grid item xs={6} sm={3} key={category.name}>
                  <GothicCard variant="glass" sx={{ textAlign: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontSize: '3rem', mb: 1 }}>{category.icon}</Typography>
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{category.name}</Typography>
                    <Chip
                      label={`${category.items} items`}
                      size="small"
                      sx={{ background: 'rgba(249, 115, 22, 0.2)', color: '#f97316', mt: 1 }}
                    />
                  </GothicCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </RoomContainer>
  );
};

export default KitchenLab;
