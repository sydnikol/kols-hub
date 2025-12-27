// PlaylistManager Component
// Create, edit, and manage playlists with gothic vinyl aesthetics

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Plus,
  Edit3,
  Trash2,
  Share2,
  GripVertical,
  Play,
  Pause,
  Music,
  Heart,
  MoreVertical,
  X,
  Copy,
  Check,
  Disc3,
  ListMusic,
  Shuffle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import {
  Track,
  PlaylistMood,
  PlaylistCover,
  playlistCovers,
  musicLibrary,
} from '../../data/music_library';

// Animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// Types
export interface Playlist {
  id: string;
  name: string;
  description: string;
  mood: PlaylistMood;
  coverId: string;
  tracks: string[]; // Track IDs
  createdAt: number;
  updatedAt: number;
  isLiked: boolean;
}

interface PlaylistManagerProps {
  onPlaylistSelect?: (playlist: Playlist) => void;
  onTrackPlay?: (track: Track) => void;
  compact?: boolean;
}

// Styled Components
const Container = styled(Box)({
  padding: '24px',
  background: 'linear-gradient(180deg, rgba(10, 8, 18, 0.95) 0%, rgba(20, 16, 32, 0.98) 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const Title = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.8rem',
  color: '#d4af37',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const VinylIcon = styled(Box)({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #d4af37',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#d4af37',
  },
});

const PlaylistGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
});

const PlaylistCard = styled(GothicCard)<{ coverGradient: string }>(({ coverGradient }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: coverGradient,
    opacity: 0.8,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 15px 40px rgba(139, 92, 246, 0.2)',
    '& .vinyl-disc': {
      animation: `${spin} 3s linear infinite`,
    },
  },
}));

const PlaylistCoverArea = styled(Box)({
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
});

const VinylDisc = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: `
    radial-gradient(circle at 50% 50%, #1a1a1a 0%, #1a1a1a 15%,
    transparent 15%, transparent 20%,
    #2a2a2a 20%, #2a2a2a 25%,
    transparent 25%, transparent 30%,
    #1a1a1a 30%, #1a1a1a 35%,
    transparent 35%, transparent 40%,
    #2a2a2a 40%, #2a2a2a 100%)
  `,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#0a0a0a',
  },
});

const PlaylistInfo = styled(Box)({
  padding: '16px',
  position: 'relative',
  zIndex: 1,
});

const PlaylistName = styled(Typography)({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#e0e0e0',
  marginBottom: '4px',
});

const PlaylistMeta = styled(Typography)({
  fontSize: '0.85rem',
  color: '#888888',
  marginBottom: '8px',
});

const MoodChip = styled(Chip)<{ moodColor: string }>(({ moodColor }) => ({
  backgroundColor: `${moodColor}20`,
  color: moodColor,
  border: `1px solid ${moodColor}40`,
  fontSize: '0.75rem',
  height: '24px',
}));

const TrackList = styled(Box)({
  maxHeight: '400px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(139, 92, 246, 0.3)',
    borderRadius: '3px',
  },
});

const TrackItem = styled(Box)<{ isDragging?: boolean }>(({ isDragging }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '8px',
  cursor: 'grab',
  transition: 'all 0.2s ease',
  background: isDragging ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
  border: isDragging ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
}));

const CoverGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
});

const CoverOption = styled(Box)<{ selected: boolean; gradient: string }>(({ selected, gradient }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '12px',
  background: gradient,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  cursor: 'pointer',
  border: selected ? '3px solid #d4af37' : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: '#a78bfa',
  },
}));

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    maxWidth: '500px',
    width: '100%',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    color: '#f0e6ff',
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

const EmptyState = styled(Box)({
  textAlign: 'center',
  padding: '48px 24px',
  color: '#888888',
});

// Mood colors
const moodColors: Record<PlaylistMood, string> = {
  Gothic: '#7c2d12',
  Chill: '#60a5fa',
  Energetic: '#f97316',
  Focus: '#8b5cf6',
  Sleep: '#6366f1',
  Romantic: '#ec4899',
};

// Storage key
const PLAYLISTS_STORAGE_KEY = 'gothic-dollhouse-playlists';

// Helper functions
const loadPlaylists = (): Playlist[] => {
  try {
    const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
};

const generateId = () => `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  onPlaylistSelect,
  onTrackPlay,
  compact = false,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [newPlaylistMood, setNewPlaylistMood] = useState<PlaylistMood>('Gothic');
  const [newPlaylistCover, setNewPlaylistCover] = useState('vinyl');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuPlaylist, setMenuPlaylist] = useState<Playlist | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [draggedTrackIndex, setDraggedTrackIndex] = useState<number | null>(null);

  // Load playlists on mount
  useEffect(() => {
    setPlaylists(loadPlaylists());
  }, []);

  // Save playlists when changed
  useEffect(() => {
    if (playlists.length > 0) {
      savePlaylists(playlists);
    }
  }, [playlists]);

  const handleCreatePlaylist = useCallback(() => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
      id: generateId(),
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim(),
      mood: newPlaylistMood,
      coverId: newPlaylistCover,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isLiked: false,
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    setIsCreateDialogOpen(false);
    resetForm();
    setSnackbar({ open: true, message: 'Playlist created!', severity: 'success' });
  }, [newPlaylistName, newPlaylistDescription, newPlaylistMood, newPlaylistCover]);

  const handleEditPlaylist = useCallback(() => {
    if (!editingPlaylist || !newPlaylistName.trim()) return;

    setPlaylists(prev =>
      prev.map(p =>
        p.id === editingPlaylist.id
          ? {
              ...p,
              name: newPlaylistName.trim(),
              description: newPlaylistDescription.trim(),
              mood: newPlaylistMood,
              coverId: newPlaylistCover,
              updatedAt: Date.now(),
            }
          : p
      )
    );

    if (selectedPlaylist?.id === editingPlaylist.id) {
      setSelectedPlaylist(prev =>
        prev
          ? {
              ...prev,
              name: newPlaylistName.trim(),
              description: newPlaylistDescription.trim(),
              mood: newPlaylistMood,
              coverId: newPlaylistCover,
            }
          : null
      );
    }

    setIsEditDialogOpen(false);
    setEditingPlaylist(null);
    resetForm();
    setSnackbar({ open: true, message: 'Playlist updated!', severity: 'success' });
  }, [editingPlaylist, newPlaylistName, newPlaylistDescription, newPlaylistMood, newPlaylistCover, selectedPlaylist]);

  const handleDeletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
    setMenuAnchor(null);
    setMenuPlaylist(null);
    setSnackbar({ open: true, message: 'Playlist deleted', severity: 'success' });
  }, [selectedPlaylist]);

  const handleToggleLike = useCallback((playlistId: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId ? { ...p, isLiked: !p.isLiked, updatedAt: Date.now() } : p
      )
    );
  }, []);

  const handleSharePlaylist = useCallback((playlist: Playlist) => {
    const shareData = {
      name: playlist.name,
      mood: playlist.mood,
      tracks: playlist.tracks,
    };
    const shareString = btoa(JSON.stringify(shareData));
    navigator.clipboard.writeText(`gothic-playlist://${shareString}`);
    setSnackbar({ open: true, message: 'Playlist link copied!', severity: 'success' });
    setMenuAnchor(null);
  }, []);

  const handleAddTrack = useCallback((trackId: string) => {
    if (!selectedPlaylist) return;

    if (selectedPlaylist.tracks.includes(trackId)) {
      setSnackbar({ open: true, message: 'Track already in playlist', severity: 'error' });
      return;
    }

    const updatedPlaylist = {
      ...selectedPlaylist,
      tracks: [...selectedPlaylist.tracks, trackId],
      updatedAt: Date.now(),
    };

    setPlaylists(prev => prev.map(p => (p.id === selectedPlaylist.id ? updatedPlaylist : p)));
    setSelectedPlaylist(updatedPlaylist);
    setSnackbar({ open: true, message: 'Track added!', severity: 'success' });
  }, [selectedPlaylist]);

  const handleRemoveTrack = useCallback((trackId: string) => {
    if (!selectedPlaylist) return;

    const updatedPlaylist = {
      ...selectedPlaylist,
      tracks: selectedPlaylist.tracks.filter(id => id !== trackId),
      updatedAt: Date.now(),
    };

    setPlaylists(prev => prev.map(p => (p.id === selectedPlaylist.id ? updatedPlaylist : p)));
    setSelectedPlaylist(updatedPlaylist);
  }, [selectedPlaylist]);

  const handleReorderTrack = useCallback((fromIndex: number, toIndex: number) => {
    if (!selectedPlaylist) return;

    const newTracks = [...selectedPlaylist.tracks];
    const [movedTrack] = newTracks.splice(fromIndex, 1);
    newTracks.splice(toIndex, 0, movedTrack);

    const updatedPlaylist = {
      ...selectedPlaylist,
      tracks: newTracks,
      updatedAt: Date.now(),
    };

    setPlaylists(prev => prev.map(p => (p.id === selectedPlaylist.id ? updatedPlaylist : p)));
    setSelectedPlaylist(updatedPlaylist);
  }, [selectedPlaylist]);

  const resetForm = () => {
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setNewPlaylistMood('Gothic');
    setNewPlaylistCover('vinyl');
  };

  const openEditDialog = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setNewPlaylistName(playlist.name);
    setNewPlaylistDescription(playlist.description);
    setNewPlaylistMood(playlist.mood);
    setNewPlaylistCover(playlist.coverId);
    setIsEditDialogOpen(true);
    setMenuAnchor(null);
  };

  const getCover = (coverId: string): PlaylistCover => {
    return playlistCovers.find(c => c.id === coverId) || playlistCovers[0];
  };

  const getTrackById = (trackId: string): Track | undefined => {
    return musicLibrary.find(t => t.id === trackId);
  };

  const moods: PlaylistMood[] = ['Gothic', 'Chill', 'Energetic', 'Focus', 'Sleep', 'Romantic'];

  return (
    <Container>
      <Header>
        <Title>
          <VinylIcon>
            <Disc3 size={20} color="#d4af37" />
          </VinylIcon>
          {compact ? 'Playlists' : 'Playlist Manager'}
        </Title>
        <GothicButton variant="primary" startIcon={<Plus size={18} />} onClick={() => setIsCreateDialogOpen(true)}>
          New Playlist
        </GothicButton>
      </Header>

      {playlists.length === 0 ? (
        <EmptyState>
          <Disc3 size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <Typography sx={{ fontSize: '1.2rem', mb: 1 }}>No playlists yet</Typography>
          <Typography sx={{ fontSize: '0.9rem', mb: 3 }}>Create your first gothic playlist to get started</Typography>
          <GothicButton variant="secondary" startIcon={<Plus size={18} />} onClick={() => setIsCreateDialogOpen(true)}>
            Create Playlist
          </GothicButton>
        </EmptyState>
      ) : selectedPlaylist ? (
        // Playlist Detail View
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton onClick={() => setSelectedPlaylist(null)} sx={{ color: '#a78bfa' }}>
              <X size={20} />
            </IconButton>
            <Box
              sx={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                background: getCover(selectedPlaylist.coverId).gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              {getCover(selectedPlaylist.coverId).icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600 }}>
                {selectedPlaylist.name}
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>
                {selectedPlaylist.tracks.length} tracks
              </Typography>
              <MoodChip label={selectedPlaylist.mood} moodColor={moodColors[selectedPlaylist.mood]} size="small" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Shuffle">
                <IconButton sx={{ color: '#a78bfa' }}>
                  <Shuffle size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Tracks">
                <IconButton onClick={() => setIsTrackDialogOpen(true)} sx={{ color: '#10b981' }}>
                  <Plus size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={() => openEditDialog(selectedPlaylist)} sx={{ color: '#f59e0b' }}>
                  <Edit3 size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {selectedPlaylist.description && (
            <Typography sx={{ color: '#888888', mb: 3, fontStyle: 'italic' }}>
              {selectedPlaylist.description}
            </Typography>
          )}

          <TrackList>
            {selectedPlaylist.tracks.length === 0 ? (
              <EmptyState>
                <Music size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <Typography>No tracks yet</Typography>
                <GothicButton
                  variant="ghost"
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => setIsTrackDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Add Tracks
                </GothicButton>
              </EmptyState>
            ) : (
              selectedPlaylist.tracks.map((trackId, index) => {
                const track = getTrackById(trackId);
                if (!track) return null;

                return (
                  <TrackItem
                    key={trackId}
                    isDragging={draggedTrackIndex === index}
                    draggable
                    onDragStart={() => setDraggedTrackIndex(index)}
                    onDragEnd={() => setDraggedTrackIndex(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedTrackIndex !== null && draggedTrackIndex !== index) {
                        handleReorderTrack(draggedTrackIndex, index);
                      }
                    }}
                  >
                    <GripVertical size={16} color="#666666" style={{ cursor: 'grab' }} />
                    <Typography sx={{ color: '#666666', width: '24px', textAlign: 'center' }}>
                      {index + 1}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem' }}>{track.title}</Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>{track.artist}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Move Up">
                        <IconButton
                          size="small"
                          onClick={() => index > 0 && handleReorderTrack(index, index - 1)}
                          disabled={index === 0}
                          sx={{ color: '#888888' }}
                        >
                          <ChevronUp size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Move Down">
                        <IconButton
                          size="small"
                          onClick={() => index < selectedPlaylist.tracks.length - 1 && handleReorderTrack(index, index + 1)}
                          disabled={index === selectedPlaylist.tracks.length - 1}
                          sx={{ color: '#888888' }}
                        >
                          <ChevronDown size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Play">
                        <IconButton
                          size="small"
                          onClick={() => onTrackPlay?.(track)}
                          sx={{ color: '#10b981' }}
                        >
                          <Play size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveTrack(trackId)}
                          sx={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TrackItem>
                );
              })
            )}
          </TrackList>
        </Box>
      ) : (
        // Playlist Grid View
        <PlaylistGrid>
          {playlists.map(playlist => {
            const cover = getCover(playlist.coverId);
            return (
              <PlaylistCard
                key={playlist.id}
                variant="glass"
                coverGradient={cover.gradient}
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  onPlaylistSelect?.(playlist);
                }}
              >
                <PlaylistCoverArea>
                  <VinylDisc className="vinyl-disc" />
                  <Box
                    sx={{
                      position: 'absolute',
                      fontSize: '2rem',
                      bottom: '10px',
                      right: '10px',
                    }}
                  >
                    {cover.icon}
                  </Box>
                </PlaylistCoverArea>
                <PlaylistInfo>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <PlaylistName>{playlist.name}</PlaylistName>
                      <PlaylistMeta>{playlist.tracks.length} tracks</PlaylistMeta>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAnchor(e.currentTarget);
                        setMenuPlaylist(playlist);
                      }}
                      sx={{ color: '#888888' }}
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <MoodChip label={playlist.mood} moodColor={moodColors[playlist.mood]} size="small" />
                    {playlist.isLiked && <Heart size={14} color="#ec4899" fill="#ec4899" />}
                  </Box>
                </PlaylistInfo>
              </PlaylistCard>
            );
          })}
        </PlaylistGrid>
      )}

      {/* Playlist Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1028',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
          },
        }}
      >
        <MenuItem
          onClick={() => menuPlaylist && handleToggleLike(menuPlaylist.id)}
          sx={{ color: '#e0e0e0', gap: 1 }}
        >
          <Heart size={16} fill={menuPlaylist?.isLiked ? '#ec4899' : 'none'} />
          {menuPlaylist?.isLiked ? 'Unlike' : 'Like'}
        </MenuItem>
        <MenuItem onClick={() => menuPlaylist && openEditDialog(menuPlaylist)} sx={{ color: '#e0e0e0', gap: 1 }}>
          <Edit3 size={16} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => menuPlaylist && handleSharePlaylist(menuPlaylist)} sx={{ color: '#e0e0e0', gap: 1 }}>
          <Share2 size={16} />
          Share
        </MenuItem>
        <MenuItem
          onClick={() => menuPlaylist && handleDeletePlaylist(menuPlaylist.id)}
          sx={{ color: '#ef4444', gap: 1 }}
        >
          <Trash2 size={16} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Playlist Dialog */}
      <DialogStyled open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ListMusic size={24} />
            Create New Playlist
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <StyledTextField
            fullWidth
            label="Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <StyledTextField
            fullWidth
            label="Description (optional)"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          <Typography sx={{ color: '#a78bfa', mb: 2, fontWeight: 500 }}>Mood</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {moods.map(mood => (
              <Chip
                key={mood}
                label={mood}
                onClick={() => setNewPlaylistMood(mood)}
                sx={{
                  backgroundColor: newPlaylistMood === mood ? moodColors[mood] : `${moodColors[mood]}20`,
                  color: newPlaylistMood === mood ? '#fff' : moodColors[mood],
                  border: `1px solid ${moodColors[mood]}`,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: `${moodColors[mood]}40`,
                  },
                }}
              />
            ))}
          </Box>

          <Typography sx={{ color: '#a78bfa', mb: 2, fontWeight: 500 }}>Cover</Typography>
          <CoverGrid>
            {playlistCovers.map(cover => (
              <Tooltip key={cover.id} title={cover.name}>
                <CoverOption
                  selected={newPlaylistCover === cover.id}
                  gradient={cover.gradient}
                  onClick={() => setNewPlaylistCover(cover.id)}
                >
                  {cover.icon}
                </CoverOption>
              </Tooltip>
            ))}
          </CoverGrid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <GothicButton variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </GothicButton>
          <GothicButton variant="primary" onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
            Create
          </GothicButton>
        </DialogActions>
      </DialogStyled>

      {/* Edit Playlist Dialog */}
      <DialogStyled open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Edit3 size={24} />
            Edit Playlist
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <StyledTextField
            fullWidth
            label="Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <StyledTextField
            fullWidth
            label="Description (optional)"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          <Typography sx={{ color: '#a78bfa', mb: 2, fontWeight: 500 }}>Mood</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {moods.map(mood => (
              <Chip
                key={mood}
                label={mood}
                onClick={() => setNewPlaylistMood(mood)}
                sx={{
                  backgroundColor: newPlaylistMood === mood ? moodColors[mood] : `${moodColors[mood]}20`,
                  color: newPlaylistMood === mood ? '#fff' : moodColors[mood],
                  border: `1px solid ${moodColors[mood]}`,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>

          <Typography sx={{ color: '#a78bfa', mb: 2, fontWeight: 500 }}>Cover</Typography>
          <CoverGrid>
            {playlistCovers.map(cover => (
              <Tooltip key={cover.id} title={cover.name}>
                <CoverOption
                  selected={newPlaylistCover === cover.id}
                  gradient={cover.gradient}
                  onClick={() => setNewPlaylistCover(cover.id)}
                >
                  {cover.icon}
                </CoverOption>
              </Tooltip>
            ))}
          </CoverGrid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <GothicButton variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </GothicButton>
          <GothicButton variant="primary" onClick={handleEditPlaylist} disabled={!newPlaylistName.trim()}>
            Save Changes
          </GothicButton>
        </DialogActions>
      </DialogStyled>

      {/* Add Tracks Dialog */}
      <DialogStyled open={isTrackDialogOpen} onClose={() => setIsTrackDialogOpen(false)} maxWidth="md">
        <DialogTitle sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Plus size={24} />
            Add Tracks to {selectedPlaylist?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <TrackList sx={{ maxHeight: '500px' }}>
            {musicLibrary.slice(0, 50).map(track => {
              const isInPlaylist = selectedPlaylist?.tracks.includes(track.id);
              return (
                <TrackItem key={track.id} sx={{ cursor: 'pointer' }} onClick={() => !isInPlaylist && handleAddTrack(track.id)}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem' }}>{track.title}</Typography>
                    <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                      {track.artist} - {track.genre}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {track.mood.slice(0, 2).map(m => (
                      <Chip
                        key={m}
                        label={m}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(139, 92, 246, 0.2)',
                          color: '#a78bfa',
                          fontSize: '0.7rem',
                          height: '20px',
                        }}
                      />
                    ))}
                    {isInPlaylist ? (
                      <Check size={20} color="#10b981" />
                    ) : (
                      <IconButton size="small" sx={{ color: '#10b981' }}>
                        <Plus size={18} />
                      </IconButton>
                    )}
                  </Box>
                </TrackItem>
              );
            })}
          </TrackList>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <GothicButton variant="ghost" onClick={() => setIsTrackDialogOpen(false)}>
            Done
          </GothicButton>
        </DialogActions>
      </DialogStyled>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{
            backgroundColor: snackbar.severity === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            color: '#fff',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PlaylistManager;
