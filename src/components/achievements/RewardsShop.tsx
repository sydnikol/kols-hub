// Rewards Shop Component
// Spend achievement points on pets, themes, room decorations, and avatar items

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Store,
  Star,
  Check,
  Lock,
  ShoppingCart,
  Sparkles,
  Palette,
  Home,
  User,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Ghost,
  Flame,
  Crown,
  Gem,
  Heart,
  Moon,
  Sun,
  Wand2,
  Shirt,
  Glasses,
  Watch,
  Diamond,
  Gift,
  Coins,
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { achievementService } from '../../services/AchievementService';

// ==========================================
// Types
// ==========================================

type RewardCategory = 'pets' | 'themes' | 'decorations' | 'avatar';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: RewardCategory;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  preview?: string;
  bonus?: string;
}

// ==========================================
// Shop Items Data
// ==========================================

const shopItems: ShopItem[] = [
  // PETS
  {
    id: 'pet-shadow-cat',
    name: 'Shadow Cat',
    description: 'A mysterious feline companion that prowls the darkness',
    icon: Cat,
    category: 'pets',
    price: 500,
    rarity: 'rare',
    bonus: '+5% bonus points at night',
  },
  {
    id: 'pet-ghost-hound',
    name: 'Ghost Hound',
    description: 'A spectral dog loyal beyond the veil',
    icon: Dog,
    category: 'pets',
    price: 500,
    rarity: 'rare',
    bonus: '+10% exploration bonus',
  },
  {
    id: 'pet-raven',
    name: 'Midnight Raven',
    description: 'An intelligent bird that whispers secrets',
    icon: Bird,
    category: 'pets',
    price: 750,
    rarity: 'epic',
    bonus: 'Reveals hidden achievements',
  },
  {
    id: 'pet-koi',
    name: 'Spirit Koi',
    description: 'A mystical fish that brings fortune',
    icon: Fish,
    category: 'pets',
    price: 400,
    rarity: 'rare',
    bonus: '+5% point earnings',
  },
  {
    id: 'pet-moon-rabbit',
    name: 'Moon Rabbit',
    description: 'A celestial bunny from the lunar realm',
    icon: Rabbit,
    category: 'pets',
    price: 600,
    rarity: 'epic',
    bonus: '+15% points during full moon',
  },
  {
    id: 'pet-phoenix',
    name: 'Phoenix Hatchling',
    description: 'A baby phoenix born from eternal flames',
    icon: Flame,
    category: 'pets',
    price: 2000,
    rarity: 'legendary',
    bonus: 'Protects your streak from breaking once',
  },
  {
    id: 'pet-wraith',
    name: 'Friendly Wraith',
    description: 'A gentle spirit that follows you through rooms',
    icon: Ghost,
    category: 'pets',
    price: 1500,
    rarity: 'legendary',
    bonus: 'Double exploration points',
  },
  {
    id: 'pet-dragon',
    name: 'Pocket Dragon',
    description: 'A tiny dragon with a big personality',
    icon: Flame,
    category: 'pets',
    price: 5000,
    rarity: 'mythic',
    bonus: '+25% all point earnings',
  },

  // THEMES
  {
    id: 'theme-midnight',
    name: 'Midnight Velvet',
    description: 'Deep purple and black with silver accents',
    icon: Moon,
    category: 'themes',
    price: 300,
    rarity: 'common',
  },
  {
    id: 'theme-blood-moon',
    name: 'Blood Moon',
    description: 'Crimson reds and dark burgundy tones',
    icon: Moon,
    category: 'themes',
    price: 400,
    rarity: 'rare',
  },
  {
    id: 'theme-golden-dusk',
    name: 'Golden Dusk',
    description: 'Warm gold and amber sunset colors',
    icon: Sun,
    category: 'themes',
    price: 400,
    rarity: 'rare',
  },
  {
    id: 'theme-ethereal',
    name: 'Ethereal Mist',
    description: 'Ghostly whites and pale blues',
    icon: Ghost,
    category: 'themes',
    price: 500,
    rarity: 'rare',
  },
  {
    id: 'theme-enchanted',
    name: 'Enchanted Forest',
    description: 'Deep greens with mystical purple accents',
    icon: Wand2,
    category: 'themes',
    price: 600,
    rarity: 'epic',
  },
  {
    id: 'theme-crystal',
    name: 'Crystal Palace',
    description: 'Icy blues with diamond sparkles',
    icon: Diamond,
    category: 'themes',
    price: 750,
    rarity: 'epic',
  },
  {
    id: 'theme-inferno',
    name: 'Inferno',
    description: 'Blazing oranges and fiery reds',
    icon: Flame,
    category: 'themes',
    price: 1000,
    rarity: 'legendary',
  },
  {
    id: 'theme-celestial',
    name: 'Celestial',
    description: 'Cosmic purples with starry gold accents',
    icon: Star,
    category: 'themes',
    price: 2500,
    rarity: 'mythic',
  },

  // DECORATIONS
  {
    id: 'deco-candles',
    name: 'Floating Candles',
    description: 'Enchanted candles that hover in every room',
    icon: Flame,
    category: 'decorations',
    price: 200,
    rarity: 'common',
  },
  {
    id: 'deco-portraits',
    name: 'Moving Portraits',
    description: 'Paintings with eyes that follow you',
    icon: User,
    category: 'decorations',
    price: 350,
    rarity: 'rare',
  },
  {
    id: 'deco-cobwebs',
    name: 'Mystical Cobwebs',
    description: 'Glowing spider webs in doorways',
    icon: Home,
    category: 'decorations',
    price: 150,
    rarity: 'common',
  },
  {
    id: 'deco-crystals',
    name: 'Crystal Clusters',
    description: 'Luminescent crystals for any room',
    icon: Gem,
    category: 'decorations',
    price: 400,
    rarity: 'rare',
  },
  {
    id: 'deco-fountain',
    name: 'Gothic Fountain',
    description: 'A dark marble fountain with flowing mist',
    icon: Moon,
    category: 'decorations',
    price: 600,
    rarity: 'epic',
  },
  {
    id: 'deco-stained-glass',
    name: 'Stained Glass Windows',
    description: 'Beautiful colored glass panels',
    icon: Diamond,
    category: 'decorations',
    price: 800,
    rarity: 'epic',
  },
  {
    id: 'deco-throne',
    name: 'Obsidian Throne',
    description: 'A majestic throne fit for royalty',
    icon: Crown,
    category: 'decorations',
    price: 1500,
    rarity: 'legendary',
  },
  {
    id: 'deco-portal',
    name: 'Portal Mirror',
    description: 'A magical mirror showing other realms',
    icon: Sparkles,
    category: 'decorations',
    price: 3000,
    rarity: 'mythic',
  },

  // AVATAR ITEMS
  {
    id: 'avatar-cloak',
    name: 'Velvet Cloak',
    description: 'A flowing cloak with silver clasps',
    icon: Shirt,
    category: 'avatar',
    price: 250,
    rarity: 'common',
  },
  {
    id: 'avatar-glasses',
    name: 'Spectral Spectacles',
    description: 'Glasses that see the unseen',
    icon: Glasses,
    category: 'avatar',
    price: 300,
    rarity: 'rare',
  },
  {
    id: 'avatar-timepiece',
    name: 'Antique Timepiece',
    description: 'A pocket watch that never stops',
    icon: Watch,
    category: 'avatar',
    price: 400,
    rarity: 'rare',
  },
  {
    id: 'avatar-wings-small',
    name: 'Fairy Wings',
    description: 'Delicate translucent wings',
    icon: Sparkles,
    category: 'avatar',
    price: 500,
    rarity: 'rare',
  },
  {
    id: 'avatar-tiara',
    name: 'Crystal Tiara',
    description: 'A sparkling tiara with gems',
    icon: Crown,
    category: 'avatar',
    price: 600,
    rarity: 'epic',
  },
  {
    id: 'avatar-mask',
    name: 'Masquerade Mask',
    description: 'An ornate venetian mask',
    icon: User,
    category: 'avatar',
    price: 450,
    rarity: 'epic',
  },
  {
    id: 'avatar-aura',
    name: 'Mystical Aura',
    description: 'A glowing aura around your avatar',
    icon: Sparkles,
    category: 'avatar',
    price: 1000,
    rarity: 'legendary',
  },
  {
    id: 'avatar-wings-dragon',
    name: 'Dragon Wings',
    description: 'Massive dragon wings for your avatar',
    icon: Flame,
    category: 'avatar',
    price: 2500,
    rarity: 'mythic',
  },
];

// ==========================================
// Animations
// ==========================================

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ==========================================
// Styled Components
// ==========================================

const ShopContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const PointsDisplay = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 24px',
  borderRadius: '24px',
  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))',
  border: '2px solid rgba(212, 175, 55, 0.5)',
  animation: `${pulse} 3s ease-in-out infinite`,
});

const ItemCard = styled(Box)<{ rarity: string; owned: boolean }>(({ rarity, owned }) => {
  const rarityColors: Record<string, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
    mythic: '#ec4899',
  };
  const color = rarityColors[rarity] || rarityColors.common;

  return {
    position: 'relative',
    padding: '20px',
    borderRadius: '16px',
    background: owned
      ? `linear-gradient(135deg, ${color}20, ${color}10)`
      : 'rgba(30, 30, 40, 0.6)',
    border: `2px solid ${owned ? '#22c55e' : color}80`,
    transition: 'all 0.3s ease',
    cursor: owned ? 'default' : 'pointer',
    opacity: owned ? 0.7 : 1,
    overflow: 'hidden',
    '&:hover': {
      transform: owned ? 'none' : 'translateY(-4px)',
      boxShadow: owned ? 'none' : `0 8px 24px ${color}40`,
      borderColor: owned ? '#22c55e' : color,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    },
  };
});

const IconContainer = styled(Box)<{ color: string }>(({ color }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${color}40, ${color}20)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
  animation: `${float} 3s ease-in-out infinite`,
}));

const PriceBadge = styled(Box)<{ affordable: boolean }>(({ affordable }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '12px',
  background: affordable ? 'rgba(212, 175, 55, 0.2)' : 'rgba(239, 68, 68, 0.2)',
  border: `1px solid ${affordable ? 'rgba(212, 175, 55, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
  color: affordable ? '#d4af37' : '#ef4444',
  fontSize: '0.9rem',
  fontWeight: 700,
}));

const RarityBadge = styled(Box)<{ rarity: string }>(({ rarity }) => {
  const colors: Record<string, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
    mythic: '#ec4899',
  };
  const color = colors[rarity] || colors.common;

  return {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '4px 10px',
    borderRadius: '8px',
    background: `${color}20`,
    border: `1px solid ${color}50`,
    color: color,
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
});

const OwnedBadge = styled(Box)({
  position: 'absolute',
  top: '12px',
  left: '12px',
  padding: '4px 10px',
  borderRadius: '8px',
  background: 'rgba(34, 197, 94, 0.2)',
  border: '1px solid rgba(34, 197, 94, 0.5)',
  color: '#22c55e',
  fontSize: '0.7rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const CategoryTab = styled(Tab)<{ catcolor?: string }>(({ catcolor = '#8b5cf6' }) => ({
  color: '#888888',
  fontFamily: '"Cinzel", serif',
  fontSize: '0.9rem',
  minHeight: '48px',
  '&.Mui-selected': {
    color: catcolor,
  },
}));

// ==========================================
// Component
// ==========================================

interface RewardsShopProps {
  onPurchase?: (item: ShopItem) => void;
}

export const RewardsShop: React.FC<RewardsShopProps> = ({
  onPurchase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [userPoints, setUserPoints] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState<ShopItem | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load user data
  useEffect(() => {
    setUserPoints(achievementService.getTotalPoints());
    const claimedRewards = achievementService.getClaimedRewards();
    const purchased = new Set(
      claimedRewards
        .filter(r => r.startsWith('shop:'))
        .map(r => r.replace('shop:', ''))
    );
    setPurchasedItems(purchased);
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return shopItems;
    return shopItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  // Get rarity color
  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b',
      mythic: '#ec4899',
    };
    return colors[rarity] || colors.common;
  };

  // Handle purchase
  const handlePurchase = (item: ShopItem) => {
    if (purchasedItems.has(item.id)) return;
    if (userPoints < item.price) {
      setSnackbar({
        open: true,
        message: `Not enough points! You need ${item.price - userPoints} more points.`,
        severity: 'error',
      });
      return;
    }
    setConfirmDialog(item);
  };

  // Confirm purchase
  const confirmPurchase = () => {
    if (!confirmDialog) return;

    // Update local state
    const newPoints = userPoints - confirmDialog.price;
    setUserPoints(newPoints);
    setPurchasedItems(prev => new Set([...prev, confirmDialog.id]));

    // Save to localStorage (simulating the purchase)
    try {
      const claimedRewards = achievementService.getClaimedRewards();
      claimedRewards.push(`shop:${confirmDialog.id}`);
      localStorage.setItem('gothic_shop_purchases', JSON.stringify(Array.from(purchasedItems).concat(confirmDialog.id)));
    } catch (error) {
      console.error('Failed to save purchase:', error);
    }

    onPurchase?.(confirmDialog);

    setSnackbar({
      open: true,
      message: `Successfully purchased ${confirmDialog.name}!`,
      severity: 'success',
    });

    setConfirmDialog(null);
  };

  // Category info
  const categories = [
    { key: 'pets', name: 'Pets', icon: Cat, color: '#f59e0b' },
    { key: 'themes', name: 'Themes', icon: Palette, color: '#8b5cf6' },
    { key: 'decorations', name: 'Decorations', icon: Home, color: '#22c55e' },
    { key: 'avatar', name: 'Avatar', icon: User, color: '#ec4899' },
  ];

  return (
    <ShopContainer>
      {/* Header */}
      <HeaderSection>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #d4af37, #f59e0b, #d4af37)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${shine} 3s linear infinite`,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Store size={36} color="#d4af37" />
          Rewards Shop
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic', mb: 3 }}>
          Spend your achievement points on exclusive rewards
        </Typography>

        <PointsDisplay>
          <Coins size={24} color="#d4af37" />
          <Typography
            sx={{
              color: '#d4af37',
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: '"Cinzel", serif',
            }}
          >
            {userPoints.toLocaleString()}
          </Typography>
          <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
            points available
          </Typography>
        </PointsDisplay>
      </HeaderSection>

      {/* Category Tabs */}
      <GothicCard variant="glass" sx={{ mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #8b5cf6, #d4af37)',
            },
          }}
        >
          <CategoryTab value="all" label="All Items" catcolor="#d4af37" />
          {categories.map((cat) => (
            <CategoryTab
              key={cat.key}
              value={cat.key}
              label={cat.name}
              catcolor={cat.color}
              icon={<cat.icon size={16} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </GothicCard>

      {/* Items Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => {
          const isOwned = purchasedItems.has(item.id);
          const canAfford = userPoints >= item.price;
          const color = getRarityColor(item.rarity);
          const Icon = item.icon;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ItemCard
                rarity={item.rarity}
                owned={isOwned}
                onClick={() => !isOwned && handlePurchase(item)}
              >
                <RarityBadge rarity={item.rarity}>
                  {item.rarity}
                </RarityBadge>

                {isOwned && (
                  <OwnedBadge>
                    <Check size={12} />
                    Owned
                  </OwnedBadge>
                )}

                <IconContainer color={color}>
                  <Icon size={28} color={color} />
                </IconContainer>

                <Typography
                  sx={{
                    color: '#e0e0e0',
                    fontWeight: 700,
                    fontSize: '1rem',
                    mb: 0.5,
                  }}
                >
                  {item.name}
                </Typography>

                <Typography
                  sx={{
                    color: '#888',
                    fontSize: '0.85rem',
                    mb: 1.5,
                    minHeight: '40px',
                  }}
                >
                  {item.description}
                </Typography>

                {item.bonus && (
                  <Chip
                    icon={<Gift size={12} />}
                    label={item.bonus}
                    size="small"
                    sx={{
                      mb: 1.5,
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#22c55e',
                      fontSize: '0.7rem',
                      '& .MuiChip-icon': {
                        color: '#22c55e',
                      },
                    }}
                  />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <PriceBadge affordable={canAfford || isOwned}>
                    {isOwned ? (
                      <>
                        <Check size={14} />
                        Purchased
                      </>
                    ) : (
                      <>
                        <Star size={14} />
                        {item.price.toLocaleString()}
                      </>
                    )}
                  </PriceBadge>

                  {!isOwned && (
                    canAfford ? (
                      <ShoppingCart size={18} color="#22c55e" />
                    ) : (
                      <Lock size={18} color="#666" />
                    )
                  )}
                </Box>
              </ItemCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Store size={48} color="#666" />
          <Typography sx={{ color: '#888', mt: 2, fontSize: '1.1rem' }}>
            No items available in this category
          </Typography>
        </Box>
      )}

      {/* Confirm Purchase Dialog */}
      <Dialog
        open={!!confirmDialog}
        onClose={() => setConfirmDialog(null)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028, #0f0a18)',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            minWidth: '320px',
          },
        }}
      >
        {confirmDialog && (
          <>
            <DialogTitle sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
              Confirm Purchase
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <IconContainer color={getRarityColor(confirmDialog.rarity)} sx={{ margin: '0 auto' }}>
                  <confirmDialog.icon size={32} color={getRarityColor(confirmDialog.rarity)} />
                </IconContainer>
                <Typography sx={{ color: '#e0e0e0', fontWeight: 700, fontSize: '1.2rem', mt: 2 }}>
                  {confirmDialog.name}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.9rem', mt: 1 }}>
                  {confirmDialog.description}
                </Typography>
                <Box sx={{ mt: 3, p: 2, background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                  <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                    Cost: <span style={{ color: '#d4af37', fontWeight: 700 }}>{confirmDialog.price.toLocaleString()} points</span>
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.85rem', mt: 0.5 }}>
                    After purchase: <span style={{ color: '#22c55e', fontWeight: 700 }}>{(userPoints - confirmDialog.price).toLocaleString()} points</span>
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <GothicButton variant="ghost" onClick={() => setConfirmDialog(null)}>
                Cancel
              </GothicButton>
              <GothicButton variant="primary" onClick={confirmPurchase}>
                Purchase
              </GothicButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{
            background: snackbar.severity === 'success'
              ? 'rgba(34, 197, 94, 0.9)'
              : 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ShopContainer>
  );
};

export default RewardsShop;
