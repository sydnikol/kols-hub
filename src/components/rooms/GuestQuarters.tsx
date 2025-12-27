// Guest Quarters Room Component
// Social connections, friends, and community features

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip, Avatar, Badge } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Users, MessageCircle, Heart, Star, Gift, Calendar,
  Mail, Bell, UserPlus, Share2, Crown, Sparkles, ExternalLink
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.3); }
  50% { box-shadow: 0 0 40px rgba(96, 165, 250, 0.5); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #080810 0%, #101828 50%, #080810 100%)',
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
  color: '#60a5fa',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(96, 165, 250, 0.4)',
  marginBottom: '8px',
});

const FriendCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 15px 30px rgba(96, 165, 250, 0.2)',
  },
});

const StyledAvatar = styled(Avatar)({
  width: '56px',
  height: '56px',
  border: '2px solid rgba(96, 165, 250, 0.5)',
});

const OnlineBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    backgroundColor: '#10b981',
    boxShadow: '0 0 10px #10b981',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #080810',
  },
});

const MessageCard = styled(Box)({
  background: 'rgba(96, 165, 250, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderLeft: '3px solid #60a5fa',
  '&:hover': {
    background: 'rgba(96, 165, 250, 0.2)',
  },
});

const friends = [
  { id: 1, name: 'Morgan', status: 'online', avatar: '🧙', level: 15, lastSeen: 'Now', mutualFriends: 5 },
  { id: 2, name: 'Riley', status: 'online', avatar: '🦋', level: 12, lastSeen: 'Now', mutualFriends: 3 },
  { id: 3, name: 'Jordan', status: 'away', avatar: '🌙', level: 18, lastSeen: '5m ago', mutualFriends: 8 },
  { id: 4, name: 'Casey', status: 'offline', avatar: '🌸', level: 10, lastSeen: '2h ago', mutualFriends: 2 },
  { id: 5, name: 'Alex', status: 'online', avatar: '⭐', level: 22, lastSeen: 'Now', mutualFriends: 12 },
  { id: 6, name: 'Sam', status: 'offline', avatar: '🔮', level: 8, lastSeen: '1d ago', mutualFriends: 4 },
];

const messages = [
  { from: 'Morgan', preview: 'Did you see the new tarot deck?', time: '5m ago', unread: true },
  { from: 'Riley', preview: 'Thanks for the recipe recommendation!', time: '1h ago', unread: true },
  { from: 'Jordan', preview: 'Want to do a group meditation?', time: '3h ago', unread: false },
];

const events = [
  { name: 'Full Moon Gathering', date: 'Dec 26', time: '8 PM', attendees: 12 },
  { name: 'Book Club: Gothic Fiction', date: 'Dec 28', time: '7 PM', attendees: 8 },
  { name: 'New Year Intention Setting', date: 'Dec 31', time: '11 PM', attendees: 25 },
];

const communities = [
  { name: 'Chronic Warriors', members: 1247, icon: '💪', joined: true },
  { name: 'Kitchen Witches', members: 892, icon: '🌿', joined: true },
  { name: 'Gothic Book Lovers', members: 634, icon: '📚', joined: false },
  { name: 'Meditation Circle', members: 2156, icon: '🧘', joined: true },
];

export const GuestQuarters: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'friends' | 'messages' | 'events'>('friends');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#fbbf24';
      default: return '#6b7280';
    }
  };

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Users size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Guest Quarters
        </RoomTitle>
        <Typography sx={{ color: '#6080a0', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Connect with kindred spirits
        </Typography>
      </HeaderSection>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Users size={24} color="#60a5fa" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 700 }}>
              {friends.filter(f => f.status === 'online').length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Online Now</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <MessageCircle size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>
              {messages.filter(m => m.unread).length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Unread</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Calendar size={24} color="#10b981" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
              {events.length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Upcoming</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Heart size={24} color="#d4af37" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#d4af37', fontSize: '1.5rem', fontWeight: 700 }}>
              {friends.length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Friends</Typography>
          </GothicCard>
        </Grid>
      </Grid>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        {[
          { key: 'friends', label: 'Friends', icon: <Users size={18} /> },
          { key: 'messages', label: 'Messages', icon: <MessageCircle size={18} /> },
          { key: 'events', label: 'Events', icon: <Calendar size={18} /> },
        ].map((tab) => (
          <GothicButton
            key={tab.key}
            variant={activeTab === tab.key ? 'accent' : 'ghost'}
            startIcon={tab.icon}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </GothicButton>
        ))}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {activeTab === 'friends' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem' }}>
                  Your Circle
                </Typography>
                <GothicButton variant="accent" size="small" startIcon={<UserPlus size={16} />}>
                  Add Friend
                </GothicButton>
              </Box>
              <Grid container spacing={2}>
                {friends.map((friend) => (
                  <Grid item xs={12} sm={6} key={friend.id}>
                    <FriendCard variant="glass">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <OnlineBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          invisible={friend.status !== 'online'}
                        >
                          <StyledAvatar sx={{ fontSize: '1.8rem', background: 'rgba(96, 165, 250, 0.2)' }}>
                            {friend.avatar}
                          </StyledAvatar>
                        </OnlineBadge>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{friend.name}</Typography>
                            <Chip
                              label={`Lv.${friend.level}`}
                              size="small"
                              sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', height: '20px' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Typography sx={{ color: getStatusColor(friend.status), fontSize: '0.8rem' }}>
                              {friend.lastSeen}
                            </Typography>
                            <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                              · {friend.mutualFriends} mutual
                            </Typography>
                          </Box>
                        </Box>
                        <GothicButton variant="ghost" sx={{ minWidth: 'auto', p: 1 }}>
                          <MessageCircle size={18} />
                        </GothicButton>
                      </Box>
                    </FriendCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 'messages' && (
            <GothicCard variant="elevated" ornate>
              <Typography sx={{ color: '#60a5fa', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Mail size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Recent Messages
              </Typography>
              {messages.map((message, i) => (
                <MessageCard key={i}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{message.from}</Typography>
                        {message.unread && (
                          <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }} />
                        )}
                      </Box>
                      <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>{message.preview}</Typography>
                    </Box>
                    <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>{message.time}</Typography>
                  </Box>
                </MessageCard>
              ))}
              <GothicButton variant="primary" sx={{ width: '100%', mt: 2 }}>
                View All Messages
              </GothicButton>
            </GothicCard>
          )}

          {activeTab === 'events' && (
            <Box>
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Calendar size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Upcoming Events
              </Typography>
              {events.map((event, i) => (
                <GothicCard key={i} variant="glass" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem', mb: 0.5 }}>
                        {event.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip
                          label={event.date}
                          size="small"
                          sx={{ background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa' }}
                        />
                        <Chip
                          label={event.time}
                          size="small"
                          sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                        />
                        <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                          <Users size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {event.attendees} attending
                        </Typography>
                      </Box>
                    </Box>
                    <GothicButton variant="accent" size="small">Join</GothicButton>
                  </Box>
                </GothicCard>
              ))}
            </Box>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Communities */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#8b5cf6', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Crown size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Communities
            </Typography>
            {communities.map((community) => (
              <Box
                key={community.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  mb: 1,
                  borderRadius: '8px',
                  background: community.joined ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(139, 92, 246, 0.15)' },
                }}
              >
                <Typography sx={{ fontSize: '1.5rem' }}>{community.icon}</Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{community.name}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
                    {community.members.toLocaleString()} members
                  </Typography>
                </Box>
                {community.joined ? (
                  <Chip label="Joined" size="small" sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }} />
                ) : (
                  <GothicButton variant="ghost" size="small">Join</GothicButton>
                )}
              </Box>
            ))}
          </GothicCard>

          {/* Social Hubs Navigation */}
          <GothicCard variant="glass" sx={{ mb: 3 }}>
            <Typography sx={{ color: '#60a5fa', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <ExternalLink size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Social Hubs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <GothicButton
                variant="primary"
                onClick={() => navigate('/social')}
                startIcon={<Users size={18} />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Social Connection Hub
              </GothicButton>
              <GothicButton
                variant="secondary"
                onClick={() => navigate('/relationships')}
                startIcon={<Heart size={18} />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Relationship Dashboard
              </GothicButton>
            </Box>
          </GothicCard>

          {/* Quick Actions */}
          <GothicCard variant="glass">
            <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Sparkles size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <GothicButton variant="ghost" startIcon={<Gift size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Send a Gift
              </GothicButton>
              <GothicButton variant="ghost" startIcon={<Share2 size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Share Your Space
              </GothicButton>
              <GothicButton variant="ghost" startIcon={<Bell size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Notifications
              </GothicButton>
            </Box>
          </GothicCard>
        </Grid>
      </Grid>
    </RoomContainer>
  );
};

export default GuestQuarters;
