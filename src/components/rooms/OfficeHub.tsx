// Office Hub Room Component
// Finance, budgeting, and passive income command center

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Briefcase, DollarSign, TrendingUp, PiggyBank, Wallet,
  Target, Zap, Clock, ChevronRight, BarChart3, Coins, Calculator, LineChart
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.5); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #050f0a 0%, #0a1a12 50%, #050f0a 100%)',
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
  color: '#10b981',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
  marginBottom: '8px',
});

const StatCard = styled(GothicCard)<{ glowing?: boolean }>(({ glowing }) => ({
  textAlign: 'center',
  ...(glowing && {
    animation: `${pulseGlow} 3s ease-in-out infinite`,
  }),
}));

const IncomeStreamCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(8px)',
    borderColor: '#10b981',
  },
});

const GoalCard = styled(Box)({
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
});

const incomeStreams = [
  { id: 'freelance', name: 'Freelance Writing', monthly: 500, spoons: 3, status: 'active' },
  { id: 'etsy', name: 'Etsy Digital Products', monthly: 150, spoons: 1, status: 'active' },
  { id: 'affiliate', name: 'Affiliate Marketing', monthly: 75, spoons: 1, status: 'growing' },
  { id: 'courses', name: 'Online Courses', monthly: 0, spoons: 4, status: 'building' },
];

const budgetCategories = [
  { name: 'Housing', allocated: 1200, spent: 1200, color: '#8b5cf6' },
  { name: 'Food', allocated: 400, spent: 320, color: '#f97316' },
  { name: 'Healthcare', allocated: 300, spent: 280, color: '#ef4444' },
  { name: 'Transportation', allocated: 200, spent: 150, color: '#60a5fa' },
  { name: 'Savings', allocated: 300, spent: 300, color: '#10b981' },
];

const savingsGoals = [
  { name: 'Emergency Fund', target: 5000, current: 2500, icon: <PiggyBank size={20} /> },
  { name: 'Medical Expenses', target: 2000, current: 800, icon: <Target size={20} /> },
  { name: 'Equipment Upgrade', target: 1500, current: 600, icon: <Zap size={20} /> },
];

export const OfficeHub: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'income' | 'budget'>('overview');

  const totalMonthlyIncome = incomeStreams.reduce((sum, s) => sum + s.monthly, 0);
  const totalBudget = budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Briefcase size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Finance Hub
        </RoomTitle>
        <Typography sx={{ color: '#608060', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Your financial command center for independence
        </Typography>
      </HeaderSection>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard variant="glass" glowing>
            <DollarSign size={32} color="#10b981" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>Passive Income</Typography>
            <Typography sx={{ color: '#10b981', fontSize: '2rem', fontWeight: 700 }}>
              ${totalMonthlyIncome}
            </Typography>
            <Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>per month</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard variant="glass">
            <Wallet size={32} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>Monthly Budget</Typography>
            <Typography sx={{ color: '#8b5cf6', fontSize: '2rem', fontWeight: 700 }}>
              ${totalBudget}
            </Typography>
            <Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>allocated</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard variant="glass">
            <TrendingUp size={32} color="#d4af37" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>Savings Rate</Typography>
            <Typography sx={{ color: '#d4af37', fontSize: '2rem', fontWeight: 700 }}>
              12%
            </Typography>
            <Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>of income</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard variant="glass">
            <BarChart3 size={32} color="#ec4899" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>Income Streams</Typography>
            <Typography sx={{ color: '#ec4899', fontSize: '2rem', fontWeight: 700 }}>
              {incomeStreams.filter(s => s.status === 'active').length}
            </Typography>
            <Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>active</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* View Toggle */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
        {['overview', 'income', 'budget'].map((view) => (
          <GothicButton
            key={view}
            variant={activeView === view ? 'accent' : 'ghost'}
            onClick={() => setActiveView(view as typeof activeView)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </GothicButton>
        ))}
      </Box>

      {activeView === 'overview' && (
        <Grid container spacing={4}>
          {/* Savings Goals */}
          <Grid item xs={12} md={6}>
            <GothicCard variant="elevated" ornate>
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Target size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Savings Goals
              </Typography>
              {savingsGoals.map((goal) => (
                <GoalCard key={goal.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: '#10b981' }}>{goal.icon}</Box>
                      <Typography sx={{ color: '#e0e0e0' }}>{goal.name}</Typography>
                    </Box>
                    <Typography sx={{ color: '#10b981', fontWeight: 600 }}>
                      ${goal.current} / ${goal.target}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(goal.current / goal.target) * 100}
                    sx={{
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' },
                    }}
                  />
                </GoalCard>
              ))}
            </GothicCard>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <GothicCard variant="elevated" ornate>
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Zap size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <GothicButton variant="primary" startIcon={<DollarSign size={18} />} onClick={() => navigate('/financial')}>
                  Finance Dashboard
                </GothicButton>
                <GothicButton variant="secondary" startIcon={<Calculator size={18} />} onClick={() => navigate('/budget')}>
                  Budgeting Hub
                </GothicButton>
                <GothicButton variant="ghost" startIcon={<LineChart size={18} />} onClick={() => navigate('/passive-income-dashboard')}>
                  Passive Income Dashboard
                </GothicButton>
              </Box>
            </GothicCard>
          </Grid>
        </Grid>
      )}

      {activeView === 'income' && (
        <Box>
          <Typography sx={{ color: '#a0a0a0', mb: 3 }}>
            Your passive income streams (sorted by spoon cost)
          </Typography>
          {incomeStreams.map((stream) => (
            <IncomeStreamCard key={stream.id} variant="glass" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DollarSign size={24} color="#10b981" />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{stream.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={`${stream.spoons} spoons`}
                        size="small"
                        sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', fontSize: '0.7rem' }}
                      />
                      <Chip
                        label={stream.status}
                        size="small"
                        sx={{
                          background: stream.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                          color: stream.status === 'active' ? '#10b981' : '#fbbf24',
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
                    ${stream.monthly}
                  </Typography>
                  <Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>per month</Typography>
                </Box>
              </Box>
            </IncomeStreamCard>
          ))}
        </Box>
      )}

      {activeView === 'budget' && (
        <Box>
          <Typography sx={{ color: '#a0a0a0', mb: 3 }}>
            Monthly budget breakdown - ${totalSpent} of ${totalBudget} spent
          </Typography>
          <Grid container spacing={3}>
            {budgetCategories.map((category) => (
              <Grid item xs={12} sm={6} key={category.name}>
                <GothicCard variant="glass">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{category.name}</Typography>
                    <Typography sx={{ color: category.color }}>
                      ${category.spent} / ${category.allocated}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(category.spent / category.allocated) * 100}
                    sx={{
                      height: '10px',
                      borderRadius: '5px',
                      backgroundColor: `${category.color}30`,
                      '& .MuiLinearProgress-bar': { backgroundColor: category.color },
                    }}
                  />
                </GothicCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </RoomContainer>
  );
};

export default OfficeHub;
