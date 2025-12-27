// Friend System Component
// Manage friends, send gifts, and visit friend rooms

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, InputAdornment } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Users, UserPlus, UserMinus, Search, Gift, Home, Eye,
  MessageCircle, Heart, Clock, Star, Sparkles, X, Send, Check
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { socialService, Friend, VirtualGift, VIRTUAL_GIFTS, GiftTransaction } from '../../services/SocialService';
import { roomConfigs } from '../rooms';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const FriendCard = styled(GothicCard)<{ status: string }>(({ status }) => ({
  position: 'relative',
  transition: 'all 0.3s ease',
  borderLeft: `4px solid ${
    status === 'online' ? '#10b981' : status === 'away' ? '#f97316' : status === 'busy' ? '#ef4444' : '#444444'
  }`,
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StatusDot = styled(Box)<{ status: string }>(({ status }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  background: status === 'online' ? '#10b981' : status === 'away' ? '#f97316' : status === 'busy' ? '#ef4444' : '#444444',
  animation: status === 'online' ? `${pulse} 2s ease-in-out infinite` : 'none',
}));

const GiftCard = styled(Box)<{ selected: boolean; rarity: string }>(({ selected, rarity }) => {
  const rarityColors: Record<string, string> = {
    common: '#888888',
    uncommon: '#10b981',
    rare: '#60a5fa',
    legendary: '#d4af37',
  };
  return {
    padding: '16px',
    borderRadius: '12px',
    background: selected ? `${rarityColors[rarity]}20` : 'rgba(20, 20, 30, 0.6)',
    border: selected ? `2px solid ${rarityColors[rarity]}` : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    '&:hover': {
      background: `${rarityColors[rarity]}15`,
      transform: 'translateY(-2px)',
    },
  };
});

const RoomPreview = styled(Box)({
  padding: '16px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(212, 175, 55, 0.1))',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  textAlign: 'center',
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(20, 20, 30, 0.6)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#888888',
  },
});

const ReceivedGiftCard = styled(Box)<{ rarity: string }>(({ rarity }) => {
  const rarityColors: Record<string, string> = {
    common: '#888888',
    uncommon: '#10b981',
    rare: '#60a5fa',
    legendary: '#d4af37',
  };
  return {
    padding: '16px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${rarityColors[rarity]}10, ${rarityColors[rarity]}05)`,
    border: `1px solid ${rarityColors[rarity]}40`,
    marginBottom: '12px',
  };
});

interface FriendSystemProps {
  onFriendsUpdate?: () => void;
}

export const FriendSystem: React.FC<FriendSystemProps> = ({ onFriendsUpdate }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);
  const [giftMessage, setGiftMessage] = useState('');
  const [receivedGifts, setReceivedGifts] = useState<GiftTransaction[]>([]);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState('');

  useEffect(() => {
    loadFriends();
    setReceivedGifts(socialService.getReceivedGifts());
  }, []);

  const loadFriends = () => {
    setFriends(socialService.getFriends());
    onFriendsUpdate?.();
  };

  const filteredFriends = friends.filter(f =>
    f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusText = (status: Friend['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Do Not Disturb';
      case 'offline': return 'Offline';
    }
  };

  const formatLastActive = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const handleRemoveFriend = (friendId: string) => {
    socialService.removeFriend(friendId);
    loadFriends();
    setSelectedFriend(null);
    setProfileDialogOpen(false);
  };

  const handleSendGift = () => {
    if (!selectedFriend || !selectedGift) return;

    socialService.sendGift(selectedFriend.id, selectedGift.id, giftMessage);
    setGiftDialogOpen(false);
    setSelectedGift(null);
    setGiftMessage('');
    loadFriends();
  };

  const handleAddFriend = () => {
    if (!newFriendUsername.trim()) return;

    // Simulate adding a friend (in real app, this would be a server request)
    const newFriend: Omit<Friend, 'id' | 'addedAt'> = {
      username: newFriendUsername.toLowerCase().replace(/\s+/g, '_'),
      displayName: newFriendUsername,
      avatar: ['🧙‍♀️', '🧛', '🦇', '🌙', '🔮', '🦉'][Math.floor(Math.random() * 6)],
      status: Math.random() > 0.5 ? 'online' : 'offline',
      lastActiveAt: new Date().toISOString(),
      favoriteRoom: roomConfigs[Math.floor(Math.random() * roomConfigs.length)].id,
    };

    socialService.addFriend(newFriend);
    setNewFriendUsername('');
    setAddFriendDialogOpen(false);
    loadFriends();
  };

  const handleVisitRoom = (roomId?: string) => {
    if (roomId) {
      // In a real app, this would navigate to the room with friend's config loaded
      console.log('Visiting room:', roomId);
      // Could emit an event or use navigation here
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#d4af37';
      case 'rare': return '#60a5fa';
      case 'uncommon': return '#10b981';
      default: return '#888888';
    }
  };

  const onlineFriends = filteredFriends.filter(f => f.status === 'online');
  const offlineFriends = filteredFriends.filter(f => f.status !== 'online');

  return (
    <Box>
      {/* Header with Search and Add Friend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <SearchField
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#888888" />
              </InputAdornment>
            ),
          }}
        />
        <GothicButton
          variant="primary"
          startIcon={<UserPlus size={18} />}
          onClick={() => setAddFriendDialogOpen(true)}
        >
          Add Friend
        </GothicButton>
      </Box>

      <Grid container spacing={4}>
        {/* Friends List */}
        <Grid item xs={12} md={8}>
          {/* Online Friends */}
          {onlineFriends.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Online ({onlineFriends.length})
              </Typography>
              <Grid container spacing={2}>
                {onlineFriends.map((friend) => (
                  <Grid item xs={12} sm={6} key={friend.id}>
                    <FriendCard
                      variant="glass"
                      status={friend.status}
                      onClick={() => {
                        setSelectedFriend(friend);
                        setProfileDialogOpen(true);
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ fontSize: '2.5rem' }}>{friend.avatar}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>
                              {friend.displayName}
                            </Typography>
                            <StatusDot status={friend.status} />
                          </Box>
                          <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                            @{friend.username}
                          </Typography>
                          {friend.favoriteRoom && (
                            <Chip
                              icon={<Home size={12} />}
                              label={roomConfigs.find(r => r.id === friend.favoriteRoom)?.name || 'Unknown'}
                              size="small"
                              sx={{
                                mt: 1,
                                background: 'rgba(139, 92, 246, 0.2)',
                                color: '#a78bfa',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                        </Box>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GothicButton
                            variant="ghost"
                            size="small"
                            onClick={() => {
                              setSelectedFriend(friend);
                              setGiftDialogOpen(true);
                            }}
                          >
                            <Gift size={16} />
                          </GothicButton>
                          <GothicButton
                            variant="ghost"
                            size="small"
                            onClick={() => {
                              handleVisitRoom(friend.favoriteRoom);
                            }}
                          >
                            <Eye size={16} />
                          </GothicButton>
                        </Box>
                      </Box>
                    </FriendCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Offline Friends */}
          {offlineFriends.length > 0 && (
            <Box>
              <Typography sx={{ color: '#888', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <Clock size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Offline ({offlineFriends.length})
              </Typography>
              <Grid container spacing={2}>
                {offlineFriends.map((friend) => (
                  <Grid item xs={12} sm={6} key={friend.id}>
                    <FriendCard
                      variant="glass"
                      status={friend.status}
                      onClick={() => {
                        setSelectedFriend(friend);
                        setProfileDialogOpen(true);
                      }}
                      sx={{ cursor: 'pointer', opacity: 0.7 }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ fontSize: '2.5rem', filter: 'grayscale(50%)' }}>{friend.avatar}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#a0a0a0', fontWeight: 600 }}>
                              {friend.displayName}
                            </Typography>
                            <StatusDot status={friend.status} />
                          </Box>
                          <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Last seen: {formatLastActive(friend.lastActiveAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </FriendCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {filteredFriends.length === 0 && (
            <GothicCard variant="glass" sx={{ textAlign: 'center', py: 6 }}>
              <Users size={48} color="#444" />
              <Typography sx={{ color: '#666', mt: 2 }}>
                {searchQuery ? 'No friends found matching your search' : 'No friends yet. Add some!'}
              </Typography>
            </GothicCard>
          )}
        </Grid>

        {/* Received Gifts */}
        <Grid item xs={12} md={4}>
          <GothicCard variant="elevated" ornate>
            <Typography sx={{ color: '#ec4899', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Gift size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Received Gifts
            </Typography>

            {receivedGifts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Gift size={36} color="#444" />
                <Typography sx={{ color: '#666', mt: 1, fontSize: '0.9rem' }}>
                  No gifts received yet
                </Typography>
              </Box>
            ) : (
              receivedGifts.slice(0, 5).map((transaction) => (
                <ReceivedGiftCard key={transaction.id} rarity={transaction.gift.rarity}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ fontSize: '2rem' }}>{transaction.gift.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.95rem' }}>
                        {transaction.gift.name}
                      </Typography>
                      <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
                        From {transaction.fromUsername}
                      </Typography>
                      {transaction.message && (
                        <Typography sx={{ color: '#a0a0a0', fontSize: '0.8rem', fontStyle: 'italic', mt: 0.5 }}>
                          "{transaction.message}"
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={transaction.gift.rarity}
                      size="small"
                      sx={{
                        background: `${getRarityColor(transaction.gift.rarity)}20`,
                        color: getRarityColor(transaction.gift.rarity),
                        fontSize: '0.7rem',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                </ReceivedGiftCard>
              ))
            )}
          </GothicCard>
        </Grid>
      </Grid>

      {/* Add Friend Dialog */}
      <Dialog
        open={addFriendDialogOpen}
        onClose={() => setAddFriendDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028, #0a0812)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
          <UserPlus size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Add Friend
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#888', mb: 2 }}>
            Enter your friend's username to send a friend request.
          </Typography>
          <SearchField
            fullWidth
            label="Username"
            value={newFriendUsername}
            onChange={(e) => setNewFriendUsername(e.target.value)}
            placeholder="Enter username..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <GothicButton variant="ghost" onClick={() => setAddFriendDialogOpen(false)}>
            Cancel
          </GothicButton>
          <GothicButton
            variant="primary"
            startIcon={<UserPlus size={16} />}
            onClick={handleAddFriend}
            disabled={!newFriendUsername.trim()}
          >
            Add Friend
          </GothicButton>
        </DialogActions>
      </Dialog>

      {/* Friend Profile Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028, #0a0812)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            minWidth: '450px',
          },
        }}
      >
        {selectedFriend && (
          <>
            <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
              <Box sx={{ fontSize: '4rem', mb: 1 }}>{selectedFriend.avatar}</Box>
              <Typography sx={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600 }}>
                {selectedFriend.displayName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <StatusDot status={selectedFriend.status} />
                <Typography sx={{ color: '#888' }}>
                  {getStatusText(selectedFriend.status)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ color: '#666', textAlign: 'center', mb: 3 }}>
                @{selectedFriend.username}
              </Typography>

              {selectedFriend.favoriteRoom && (
                <RoomPreview>
                  <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 1 }}>
                    Favorite Room
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>
                      {roomConfigs.find(r => r.id === selectedFriend.favoriteRoom)?.icon}
                    </Typography>
                    <Typography sx={{ color: '#a78bfa', fontWeight: 600 }}>
                      {roomConfigs.find(r => r.id === selectedFriend.favoriteRoom)?.name}
                    </Typography>
                  </Box>
                  <GothicButton
                    variant="secondary"
                    size="small"
                    startIcon={<Eye size={14} />}
                    onClick={() => handleVisitRoom(selectedFriend.favoriteRoom)}
                    sx={{ mt: 2 }}
                  >
                    Visit Room
                  </GothicButton>
                </RoomPreview>
              )}

              <Typography sx={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', mt: 3 }}>
                <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Friends since {new Date(selectedFriend.addedAt).toLocaleDateString()}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
              <GothicButton
                variant="primary"
                startIcon={<Gift size={16} />}
                onClick={() => {
                  setProfileDialogOpen(false);
                  setGiftDialogOpen(true);
                }}
              >
                Send Gift
              </GothicButton>
              <GothicButton
                variant="danger"
                startIcon={<UserMinus size={16} />}
                onClick={() => handleRemoveFriend(selectedFriend.id)}
              >
                Remove
              </GothicButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Gift Dialog */}
      <Dialog
        open={giftDialogOpen}
        onClose={() => setGiftDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028, #0a0812)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#ec4899', fontFamily: '"Cinzel", serif' }}>
          <Gift size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Send a Gift to {selectedFriend?.displayName}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#888', mb: 3 }}>
            Choose a magical gift to send:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {VIRTUAL_GIFTS.slice(0, 12).map((gift) => (
              <Grid item xs={6} sm={4} md={3} key={gift.id}>
                <GiftCard
                  selected={selectedGift?.id === gift.id}
                  rarity={gift.rarity}
                  onClick={() => setSelectedGift(gift)}
                >
                  <Box sx={{ fontSize: '2rem', mb: 1 }}>{gift.icon}</Box>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.85rem', fontWeight: 600 }}>
                    {gift.name}
                  </Typography>
                  <Chip
                    label={gift.rarity}
                    size="small"
                    sx={{
                      mt: 1,
                      background: `${getRarityColor(gift.rarity)}20`,
                      color: getRarityColor(gift.rarity),
                      fontSize: '0.65rem',
                      textTransform: 'capitalize',
                    }}
                  />
                </GiftCard>
              </Grid>
            ))}
          </Grid>

          {selectedGift && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: '#a78bfa', mb: 1 }}>
                {selectedGift.description}
              </Typography>
              <SearchField
                fullWidth
                label="Add a message (optional)"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Write a heartfelt message..."
                multiline
                rows={2}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <GothicButton variant="ghost" onClick={() => setGiftDialogOpen(false)}>
            Cancel
          </GothicButton>
          <GothicButton
            variant="accent"
            startIcon={<Send size={16} />}
            onClick={handleSendGift}
            disabled={!selectedGift}
          >
            Send Gift
          </GothicButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FriendSystem;
