// Gothic Navigation
// Sidebar/drawer navigation with categories and sub-items
// Icon-based with labels, collapsible on mobile

import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Collapse, Drawer, IconButton, Tooltip,
  useMediaQuery, useTheme, Badge, Divider
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Menu, X, ChevronDown, ChevronRight, Home, Building2,
  Users, Heart, Gamepad2, BookOpen, Sparkles, Settings,
  Moon, Bell, User, Search, Crown, Map, Palette, Music,
  Coffee, Shirt, Brain, Dumbbell, Dog, MessageCircle,
  Trophy, Star, History, Wand2, Utensils, Bed, Car,
  Wallet, Gift, PenTool, Headphones, Film, Dice5,
  Calculator, Book, Scroll, Archive, CircleDot, Flame,
  GraduationCap, Briefcase, Camera, Scissors, Clock,
  Shield, TreeDeciduous, Ghost, Telescope, FlaskConical,
  Theater, Puzzle, SunMoon, Volume2, Target
} from 'lucide-react';

// ==========================================
// Animations
// ==========================================

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.5); }
`;

// ==========================================
// Styled Components
// ==========================================

const NavContainer = styled(Box)<{ collapsed: boolean }>(({ collapsed }) => ({
  width: collapsed ? '70px' : '280px',
  height: '100vh',
  background: 'linear-gradient(180deg, rgba(10, 8, 18, 0.98) 0%, rgba(20, 15, 30, 0.98) 100%)',
  borderRight: '1px solid rgba(139, 92, 246, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.3s ease',
  overflow: 'hidden',
}));

const NavHeader = styled(Box)({
  padding: '16px',
  borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '60px',
});

const LogoText = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Cinzel", serif',
  fontSize: '1.2rem',
  background: 'linear-gradient(135deg, #d4af37 0%, #f5e6a3 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  whiteSpace: 'nowrap',
});

const NavContent = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '8px',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(139, 92, 246, 0.3)',
    borderRadius: '4px',
  },
});

const CategoryHeader = styled(Box)<{ active: boolean; color: string }>(({ active, color }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: active ? `${color}15` : 'transparent',
  border: active ? `1px solid ${color}30` : '1px solid transparent',
  marginBottom: '4px',
  '&:hover': {
    background: `${color}10`,
    transform: 'translateX(4px)',
  },
}));

const CategoryIcon = styled(Box)<{ color: string }>(({ color }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  background: `${color}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const SubItem = styled(Box)<{ active: boolean; color: string }>(({ active, color }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px 10px 56px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: active ? `${color}10` : 'transparent',
  '&:hover': {
    background: `${color}08`,
    paddingLeft: '60px',
  },
}));

const NavFooter = styled(Box)({
  padding: '12px',
  borderTop: '1px solid rgba(139, 92, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
});

const FooterButton = styled(IconButton)({
  color: '#888888',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#a78bfa',
    background: 'rgba(139, 92, 246, 0.1)',
  },
});

const MobileDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    background: 'transparent',
    boxShadow: 'none',
  },
});

const CollapsedIcon = styled(Box)<{ active: boolean; color: string }>(({ active, color }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: active ? `${color}20` : 'transparent',
  border: active ? `1px solid ${color}40` : '1px solid transparent',
  margin: '4px auto',
  '&:hover': {
    background: `${color}15`,
    animation: `${glow} 1.5s ease-in-out infinite`,
  },
}));

// ==========================================
// Types
// ==========================================

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  isNew?: boolean;
}

interface NavCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  items: SubMenuItem[];
}

interface GothicNavigationProps {
  currentItem?: string;
  onNavigate?: (itemId: string, categoryId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  notifications?: number;
}

// ==========================================
// Navigation Data
// ==========================================

const navigationCategories: NavCategory[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    color: '#d4af37',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: CircleDot },
      { id: 'grand-foyer', label: 'Grand Foyer', icon: Building2 },
      { id: 'quick-actions', label: 'Quick Actions', icon: Flame },
    ],
  },
  {
    id: 'rooms',
    label: 'Rooms',
    icon: Building2,
    color: '#8b5cf6',
    items: [
      { id: 'ancestor-hall', label: 'Ancestor Hall', icon: History },
      { id: 'wardrobe-palace', label: 'Wardrobe Palace', icon: Shirt },
      { id: 'library-study', label: 'Library Study', icon: BookOpen },
      { id: 'apothecary', label: 'Apothecary', icon: FlaskConical },
      { id: 'office-hub', label: 'Office Hub', icon: Briefcase },
      { id: 'gaming-den', label: 'Gaming Den', icon: Gamepad2 },
      { id: 'rooftop-observatory', label: 'Observatory', icon: Telescope },
      { id: 'dream-archives', label: 'Dream Archives', icon: SunMoon },
      { id: 'fortune-teller-alcove', label: 'Fortune Alcove', icon: Wand2 },
      { id: 'cloud-garden', label: 'Cloud Garden', icon: TreeDeciduous },
      { id: 'creative-studio', label: 'Creative Studio', icon: Palette },
      { id: 'kitchen-lab', label: 'Kitchen Lab', icon: Utensils },
      { id: 'music-room', label: 'Music Room', icon: Music },
      { id: 'pet-sanctuary', label: 'Pet Sanctuary', icon: Dog },
      { id: 'guest-quarters', label: 'Guest Quarters', icon: Bed },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: Users,
    color: '#06b6d4',
    items: [
      { id: 'social-hub', label: 'Social Hub', icon: MessageCircle },
      { id: 'friends', label: 'Friends', icon: Users },
      { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
      { id: 'share-room', label: 'Share Designs', icon: Camera },
    ],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    icon: Heart,
    color: '#ec4899',
    items: [
      { id: 'mental-health', label: 'Mental Health', icon: Brain },
      { id: 'meditation', label: 'Meditation', icon: Moon },
      { id: 'mood-tracker', label: 'Mood Tracker', icon: Target },
      { id: 'affirmations', label: 'Affirmations', icon: Sparkles },
      { id: 'movement', label: 'Movement', icon: Dumbbell },
      { id: 'sleep', label: 'Sleep Tracker', icon: Bed },
    ],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: Gamepad2,
    color: '#f97316',
    items: [
      { id: 'games', label: 'Games', icon: Dice5 },
      { id: 'music-player', label: 'Music Player', icon: Headphones },
      { id: 'movies', label: 'Movie Night', icon: Film },
      { id: 'coloring', label: 'Coloring Book', icon: PenTool },
      { id: 'puzzles', label: 'Puzzles', icon: Puzzle },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    icon: BookOpen,
    color: '#10b981',
    items: [
      { id: 'reading', label: 'Reading Nook', icon: Book },
      { id: 'journal', label: 'Gothic Journal', icon: Scroll },
      { id: 'history', label: 'History Lessons', icon: History },
      { id: 'learning', label: 'Learning Hub', icon: GraduationCap },
      { id: 'archives', label: 'Archives', icon: Archive },
    ],
  },
  {
    id: 'oracle',
    label: 'Oracle',
    icon: Sparkles,
    color: '#a855f7',
    items: [
      { id: 'tarot', label: 'Tarot Reading', icon: Wand2 },
      { id: 'oracle-cards', label: 'Oracle Cards', icon: Star },
      { id: 'daily-oracle', label: 'Daily Oracle', icon: Flame },
      { id: 'rituals', label: 'Rituals', icon: Ghost },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    color: '#64748b',
    items: [
      { id: 'accessibility', label: 'Accessibility', icon: Shield },
      { id: 'themes', label: 'Themes', icon: Palette },
      { id: 'sounds', label: 'Sounds', icon: Volume2 },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  },
];

// ==========================================
// Component
// ==========================================

export const GothicNavigation: React.FC<GothicNavigationProps> = ({
  currentItem = 'dashboard',
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  notifications = 0,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['home']);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Find current category based on item
  const getCurrentCategory = useCallback(() => {
    for (const category of navigationCategories) {
      if (category.items.some(item => item.id === currentItem)) {
        return category.id;
      }
    }
    return 'home';
  }, [currentItem]);

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // Handle navigation
  const handleNavigate = useCallback((itemId: string, categoryId: string) => {
    onNavigate?.(itemId, categoryId);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [onNavigate, isMobile]);

  // Render collapsed view
  const renderCollapsedNav = () => (
    <NavContainer collapsed={true}>
      <NavHeader>
        <Tooltip title="Expand Menu" placement="right">
          <IconButton onClick={onToggleCollapse} sx={{ color: '#d4af37' }}>
            <Menu size={24} />
          </IconButton>
        </Tooltip>
      </NavHeader>
      <NavContent>
        {navigationCategories.map((category) => {
          const isActive = category.id === getCurrentCategory();
          return (
            <Tooltip key={category.id} title={category.label} placement="right">
              <CollapsedIcon
                active={isActive}
                color={category.color}
                onClick={() => {
                  onToggleCollapse?.();
                  setExpandedCategories([category.id]);
                }}
              >
                <category.icon size={20} color={isActive ? category.color : '#888'} />
              </CollapsedIcon>
            </Tooltip>
          );
        })}
      </NavContent>
      <NavFooter sx={{ flexDirection: 'column', gap: 1 }}>
        <FooterButton>
          <Bell size={18} />
        </FooterButton>
        <FooterButton>
          <Settings size={18} />
        </FooterButton>
      </NavFooter>
    </NavContainer>
  );

  // Render expanded view
  const renderExpandedNav = () => (
    <NavContainer collapsed={false}>
      <NavHeader>
        <LogoText>Gothic Dollhouse</LogoText>
        <IconButton onClick={onToggleCollapse || (() => setMobileOpen(false))} sx={{ color: '#888' }}>
          {isMobile ? <X size={20} /> : <ChevronRight size={20} />}
        </IconButton>
      </NavHeader>

      <NavContent>
        {navigationCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const isCategoryActive = category.id === getCurrentCategory();

          return (
            <Box key={category.id} sx={{ mb: 1 }}>
              <CategoryHeader
                active={isCategoryActive}
                color={category.color}
                onClick={() => toggleCategory(category.id)}
              >
                <CategoryIcon color={category.color}>
                  <category.icon size={18} color={category.color} />
                </CategoryIcon>
                <Typography
                  sx={{
                    flex: 1,
                    color: isCategoryActive ? category.color : '#e0e0e0',
                    fontFamily: '"Cinzel", serif',
                    fontSize: '0.95rem',
                    fontWeight: isCategoryActive ? 600 : 400,
                  }}
                >
                  {category.label}
                </Typography>
                <Box
                  sx={{
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <ChevronDown size={16} color="#888" />
                </Box>
              </CategoryHeader>

              <Collapse in={isExpanded}>
                {category.items.map((item) => {
                  const isItemActive = currentItem === item.id;
                  return (
                    <SubItem
                      key={item.id}
                      active={isItemActive}
                      color={category.color}
                      onClick={() => handleNavigate(item.id, category.id)}
                    >
                      <item.icon
                        size={16}
                        color={isItemActive ? category.color : '#888'}
                      />
                      <Typography
                        sx={{
                          flex: 1,
                          color: isItemActive ? '#e0e0e0' : '#888',
                          fontSize: '0.85rem',
                        }}
                      >
                        {item.label}
                      </Typography>
                      {item.badge && (
                        <Badge
                          badgeContent={item.badge}
                          sx={{
                            '& .MuiBadge-badge': {
                              background: category.color,
                              color: '#fff',
                              fontSize: '0.65rem',
                            },
                          }}
                        />
                      )}
                      {item.isNew && (
                        <Typography
                          sx={{
                            fontSize: '0.6rem',
                            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: '#fff',
                          }}
                        >
                          NEW
                        </Typography>
                      )}
                    </SubItem>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}
      </NavContent>

      <NavFooter>
        <Tooltip title="Search">
          <FooterButton>
            <Search size={18} />
          </FooterButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <FooterButton>
            <Badge badgeContent={notifications} color="error">
              <Bell size={18} />
            </Badge>
          </FooterButton>
        </Tooltip>
        <Tooltip title="Settings">
          <FooterButton>
            <Settings size={18} />
          </FooterButton>
        </Tooltip>
        <Tooltip title="Profile">
          <FooterButton>
            <User size={18} />
          </FooterButton>
        </Tooltip>
      </NavFooter>
    </NavContainer>
  );

  // Mobile trigger button
  const MobileMenuButton = () => (
    <IconButton
      onClick={() => setMobileOpen(true)}
      sx={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        zIndex: 1200,
        background: 'rgba(10, 8, 18, 0.9)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        color: '#a78bfa',
        '&:hover': {
          background: 'rgba(139, 92, 246, 0.2)',
        },
      }}
    >
      <Menu size={24} />
    </IconButton>
  );

  // Render based on device
  if (isMobile) {
    return (
      <>
        <MobileMenuButton />
        <MobileDrawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          {renderExpandedNav()}
        </MobileDrawer>
      </>
    );
  }

  return collapsed ? renderCollapsedNav() : renderExpandedNav();
};

export default GothicNavigation;
