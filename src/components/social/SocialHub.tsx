// Social Hub Component
// Central social dashboard with profile, friends, activity feed, and leaderboards

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Avatar, Chip, TextField, Tab, Tabs, Badge, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Users, Trophy, Activity, Share2, Settings, Bell,
  MessageCircle, Gift, Star, Crown, Zap, Heart,
  Eye, Clock, TrendingUp, Award, Gamepad2
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { socialService, UserProfile, Friend, ActivityFeedItem, LeaderboardEntry } from '../../services/SocialService';
import { FriendSystem } from './FriendSystem';
import { Leaderboards } from './Leaderboards';
import { ShareRoom } from './ShareRoom';

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const SocialContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const ProfileCard = styled(GothicCard)({
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(212, 175, 55, 0.2))',
    borderRadius: '12px 12px 0 0',
  },
});

const ProfileAvatar = styled(Box)({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #8b5cf6, #d4af37)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '3rem',
  border: '4px solid #1a1028',
  boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
  position: 'relative',
  zIndex: 1,
  margin: '0 auto',
  marginTop: '-50px',
});

const OnlineIndicator = styled(Box)<{ status: string }>(({ status }) => ({
  position: 'absolute',
  bottom: '5px',
  right: '5px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '3px solid #1a1028',
  background: status === 'online' ? '#10b981' : status === 'away' ? '#f97316' : status === 'busy' ? '#ef4444' : '#666666',
  animation: status === 'online' ? `${pulse} 2s ease-in-out infinite` : 'none',
}));

const StatBox = styled(Box)({
  textAlign: 'center',
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(20, 20, 30, 0.6)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
    transform: 'translateY(-2px)',
  },
});

const ActivityItem = styled(Box)({
  display: 'flex',
  gap: '16px',
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(20, 20, 30, 0.6)',
  marginBottom: '12px',
  transition: 'all 0.3s ease',
  borderLeft: '3px solid transparent',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
    borderLeftColor: '#8b5cf6',
  },
});

const StyledTabs = styled(Tabs)({
  marginBottom: '24px',
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(90deg, #8b5cf6, #d4af37)',
    height: '3px',
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    color: '#888888',
    fontFamily: '"Cinzel", serif',
    textTransform: 'none',
    fontSize: '1rem',
    minWidth: '120px',
    '&.Mui-selected': {
      color: '#d4af37',
    },
  },
});

const QuickAction = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(20, 20, 30, 0.6)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.2)',
    transform: 'translateY(-4px)',
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

export const SocialHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ displayName: '', bio: '', avatar: '' });

  useEffect(() => {
    // Initialize demo data and load profile
    socialService.initializeDemoData();
    loadData();
  }, []);

  const loadData = () => {
    const loadedProfile = socialService.getProfile();
    setProfile(loadedProfile);
    setFriends(socialService.getFriends());
    setActivityFeed(socialService.getActivityFeed(20));

    if (loadedProfile) {
      setEditedProfile({
        displayName: loadedProfile.displayName,
        bio: loadedProfile.bio,
        avatar: loadedProfile.avatar,
      });
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveProfile = () => {
    socialService.updateProfile(editedProfile);
    loadData();
    setIsEditing(false);
  };

  const getActivityIcon = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'achievement': return <Award size={20} color="#d4af37" />;
      case 'score': return <Trophy size={20} color="#10b981" />;
      case 'friend': return <Users size={20} color="#8b5cf6" />;
      case 'room-share': return <Share2 size={20} color="#60a5fa" />;
      case 'gift': return <Gift size={20} color="#ec4899" />;
      case 'milestone': return <Star size={20} color="#f97316" />;
      default: return <Activity size={20} color="#888888" />;
    }
  };

  const getActivityColor = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'achievement': return '#d4af37';
      case 'score': return '#10b981';
      case 'friend': return '#8b5cf6';
      case 'room-share': return '#60a5fa';
      case 'gift': return '#ec4899';
      case 'milestone': return '#f97316';
      default: return '#888888';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const onlineFriendsCount = friends.filter(f => f.status === 'online').length;

  const avatarOptions = ['👤', '🧙‍♀️', '🧛', '🦇', '🌙', '🔮', '🦉', '🐺', '🕷️', '🖤', '👻', '🎭', '⚰️', '🗝️', '📿', '🌹'];

  return (
    <SocialContainer>
      <HeaderSection>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#a855f7',
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
            mb: 1,
          }}
        >
          <Users size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Social Sanctuary
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Connect with fellow wanderers of the Gothic Dollhouse
        </Typography>
      </HeaderSection>

      <StyledTabs value={activeTab} onChange={handleTabChange} centered>
        <Tab icon={<Users size={18} />} label="Profile" />
        <Tab icon={<Badge badgeContent={onlineFriendsCount} color="success"><Users size={18} /></Badge>} label="Friends" />
        <Tab icon={<Trophy size={18} />} label="Leaderboards" />
        <Tab icon={<Share2 size={18} />} label="Share Rooms" />
        <Tab icon={<Activity size={18} />} label="Activity" />
      </StyledTabs>

      {/* Profile Tab */}
      <TabPanel value={activeTab} index={0}>
        {profile && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <ProfileCard variant="elevated" ornate>
                <Box sx={{ pt: 8, textAlign: 'center' }}>
                  <ProfileAvatar>
                    {profile.avatar}
                    <OnlineIndicator status="online" />
                  </ProfileAvatar>

                  {isEditing ? (
                    <Box sx={{ mt: 2, px: 2 }}>
                      <TextField
                        fullWidth
                        label="Display Name"
                        value={editedProfile.displayName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, displayName: e.target.value })}
                        sx={{ mb: 2, '& .MuiInputBase-root': { color: '#e0e0e0' } }}
                      />
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={2}
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        sx={{ mb: 2, '& .MuiInputBase-root': { color: '#e0e0e0' } }}
                      />
                      <Typography sx={{ color: '#888', fontSize: '0.9rem', mb: 1 }}>Select Avatar:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2 }}>
                        {avatarOptions.map((emoji) => (
                          <Box
                            key={emoji}
                            onClick={() => setEditedProfile({ ...editedProfile, avatar: emoji })}
                            sx={{
                              fontSize: '1.5rem',
                              p: 1,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              border: editedProfile.avatar === emoji ? '2px solid #d4af37' : '2px solid transparent',
                              background: editedProfile.avatar === emoji ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                              '&:hover': { background: 'rgba(139, 92, 246, 0.2)' },
                            }}
                          >
                            {emoji}
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <GothicButton variant="primary" size="small" onClick={handleSaveProfile}>Save</GothicButton>
                        <GothicButton variant="ghost" size="small" onClick={() => setIsEditing(false)}>Cancel</GothicButton>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600, mt: 2 }}>
                        {profile.displayName}
                      </Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.9rem', mb: 1 }}>
                        @{profile.username}
                      </Typography>
                      <Typography sx={{ color: '#a0a0a0', fontSize: '0.95rem', fontStyle: 'italic', px: 2, mb: 3 }}>
                        "{profile.bio}"
                      </Typography>
                      <GothicButton
                        variant="ghost"
                        size="small"
                        startIcon={<Settings size={16} />}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </GothicButton>
                    </>
                  )}
                </Box>

                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 1 }}>
                    <Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Member since {new Date(profile.joinedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </ProfileCard>

              {/* Quick Actions */}
              <GothicCard variant="glass" sx={{ mt: 3 }}>
                <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', mb: 2 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <QuickAction onClick={() => setActiveTab(1)}>
                      <Users size={24} color="#8b5cf6" />
                      <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Friends</Typography>
                    </QuickAction>
                  </Grid>
                  <Grid item xs={4}>
                    <QuickAction onClick={() => setActiveTab(2)}>
                      <Trophy size={24} color="#d4af37" />
                      <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Ranks</Typography>
                    </QuickAction>
                  </Grid>
                  <Grid item xs={4}>
                    <QuickAction onClick={() => setActiveTab(3)}>
                      <Share2 size={24} color="#60a5fa" />
                      <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>Share</Typography>
                    </QuickAction>
                  </Grid>
                </Grid>
              </GothicCard>
            </Grid>

            <Grid item xs={12} md={8}>
              {/* Stats Grid */}
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 2 }}>
                <TrendingUp size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Your Stats
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={4}>
                  <StatBox>
                    <Trophy size={28} color="#d4af37" style={{ marginBottom: '8px' }} />
                    <Typography sx={{ color: '#d4af37', fontSize: '1.8rem', fontWeight: 700 }}>
                      {profile.stats.totalScore.toLocaleString()}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Total Score</Typography>
                  </StatBox>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <StatBox>
                    <Gamepad2 size={28} color="#8b5cf6" style={{ marginBottom: '8px' }} />
                    <Typography sx={{ color: '#8b5cf6', fontSize: '1.8rem', fontWeight: 700 }}>
                      {profile.stats.gamesPlayed}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Games Played</Typography>
                  </StatBox>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <StatBox>
                    <Users size={28} color="#10b981" style={{ marginBottom: '8px' }} />
                    <Typography sx={{ color: '#10b981', fontSize: '1.8rem', fontWeight: 700 }}>
                      {profile.stats.friendCount}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Friends</Typography>
                  </StatBox>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <StatBox>
                    <Share2 size={28} color="#60a5fa" style={{ marginBottom: '8px' }} />
                    <Typography sx={{ color: '#60a5fa', fontSize: '1.8rem', fontWeight: 700 }}>
                      {profile.stats.roomsShared}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Rooms Shared</Typography>
                  </StatBox>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <StatBox>
                    <Gift size={28} color="#ec4899" style={{ marginBottom: '8px' }} />
                    <Typography sx={{ color: '#ec4899', fontSize: '1.8rem', fontWeight: 700 }}>
                      {profile.stats.giftsGiven + profile.stats.giftsReceived}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Gifts Exchanged</Typography>
                  </StatBox>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <StatBox>
                    <Award size={28} color="#f97316" style={{ marginBottom: '8px' }} />
                    <Typography sx={{ color: '#f97316', fontSize: '1.8rem', fontWeight: 700 }}>
                      {profile.stats.achievementCount}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Achievements</Typography>
                  </StatBox>
                </Grid>
              </Grid>

              {/* Online Friends Preview */}
              <GothicCard variant="glass" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.1rem' }}>
                    <Zap size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Online Now ({onlineFriendsCount})
                  </Typography>
                  <GothicButton variant="ghost" size="small" onClick={() => setActiveTab(1)}>
                    View All
                  </GothicButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {friends.filter(f => f.status === 'online').slice(0, 5).map((friend) => (
                    <Box
                      key={friend.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <Box sx={{ fontSize: '1.5rem' }}>{friend.avatar}</Box>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                        {friend.displayName}
                      </Typography>
                    </Box>
                  ))}
                  {onlineFriendsCount === 0 && (
                    <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
                      No friends online right now
                    </Typography>
                  )}
                </Box>
              </GothicCard>

              {/* Recent Activity Preview */}
              <GothicCard variant="glass">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ color: '#a855f7', fontFamily: '"Cinzel", serif', fontSize: '1.1rem' }}>
                    <Activity size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Recent Activity
                  </Typography>
                  <GothicButton variant="ghost" size="small" onClick={() => setActiveTab(4)}>
                    View All
                  </GothicButton>
                </Box>
                {activityFeed.slice(0, 3).map((item) => (
                  <ActivityItem key={item.id} sx={{ borderLeftColor: getActivityColor(item.type) }}>
                    <Box sx={{ fontSize: '1.5rem' }}>{item.avatar}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                        {item.message}
                      </Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                        {formatTimeAgo(item.timestamp)}
                      </Typography>
                    </Box>
                    {getActivityIcon(item.type)}
                  </ActivityItem>
                ))}
              </GothicCard>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Friends Tab */}
      <TabPanel value={activeTab} index={1}>
        <FriendSystem onFriendsUpdate={loadData} />
      </TabPanel>

      {/* Leaderboards Tab */}
      <TabPanel value={activeTab} index={2}>
        <Leaderboards />
      </TabPanel>

      {/* Share Rooms Tab */}
      <TabPanel value={activeTab} index={3}>
        <ShareRoom />
      </TabPanel>

      {/* Activity Feed Tab */}
      <TabPanel value={activeTab} index={4}>
        <GothicCard variant="elevated" ornate>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Activity size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Activity Feed
          </Typography>

          {activityFeed.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Activity size={48} color="#444" />
              <Typography sx={{ color: '#666', mt: 2 }}>No activity yet. Start exploring!</Typography>
            </Box>
          ) : (
            activityFeed.map((item) => (
              <ActivityItem key={item.id} sx={{ borderLeftColor: getActivityColor(item.type) }}>
                <Box sx={{ fontSize: '2rem' }}>{item.avatar}</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ color: '#a78bfa', fontWeight: 600 }}>
                      {item.username}
                    </Typography>
                    <Chip
                      label={item.type}
                      size="small"
                      sx={{
                        background: `${getActivityColor(item.type)}20`,
                        color: getActivityColor(item.type),
                        fontSize: '0.7rem',
                        height: '20px',
                      }}
                    />
                  </Box>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem' }}>
                    {item.message}
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: '0.8rem', mt: 0.5 }}>
                    <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {formatTimeAgo(item.timestamp)}
                  </Typography>
                </Box>
                {getActivityIcon(item.type)}
              </ActivityItem>
            ))
          )}

          {activityFeed.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <GothicButton
                variant="ghost"
                size="small"
                onClick={() => {
                  socialService.clearActivityFeed();
                  loadData();
                }}
              >
                Clear Activity
              </GothicButton>
            </Box>
          )}
        </GothicCard>
      </TabPanel>
    </SocialContainer>
  );
};

export default SocialHub;
