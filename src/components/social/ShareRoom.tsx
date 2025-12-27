// Share Room Component
// Export, share, and import room configurations

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Alert, Snackbar } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Share2, Download, Upload, Copy, Check, Eye, QrCode,
  Link2, Home, Palette, Clock, Users, Heart, Trash2,
  Code, FileJson, ExternalLink
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { socialService, SharedRoomConfig } from '../../services/SocialService';
import { roomConfigs } from '../rooms';

const shine = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ShareContainer = styled(Box)({
  width: '100%',
});

const RoomSelector = styled(Box)<{ selected: boolean; color: string }>(({ selected, color }) => ({
  padding: '16px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: selected ? `${color}20` : 'rgba(20, 20, 30, 0.6)',
  border: selected ? `2px solid ${color}` : '2px solid transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  '&:hover': {
    background: `${color}15`,
    transform: 'translateY(-2px)',
  },
}));

const ShareCodeBox = styled(Box)({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(212, 175, 55, 0.1))',
  border: '2px dashed rgba(212, 175, 55, 0.5)',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #d4af37, #8b5cf6, #d4af37)',
    backgroundSize: '200% 100%',
    animation: `${shine} 3s linear infinite`,
  },
});

const SharedRoomCard = styled(GothicCard)<{ color: string }>(({ color }) => ({
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: color,
    borderRadius: '12px 12px 0 0',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const ImportField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(20, 20, 30, 0.6)',
    borderRadius: '12px',
    fontFamily: 'monospace',
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

const StatChip = styled(Chip)({
  background: 'rgba(20, 20, 30, 0.8)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  '& .MuiChip-icon': {
    color: '#888',
  },
});

export const ShareRoom: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [sharedRooms, setSharedRooms] = useState<SharedRoomConfig[]>([]);
  const [importedRooms, setImportedRooms] = useState<SharedRoomConfig[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewRoom, setPreviewRoom] = useState<SharedRoomConfig | null>(null);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');
  const [shareName, setShareName] = useState('');
  const [shareDescription, setShareDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [generatedShareCode, setGeneratedShareCode] = useState<string | null>(null);
  const [exportedJson, setExportedJson] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    setSharedRooms(socialService.getSharedRooms());
    setImportedRooms(socialService.getImportedRooms());
  };

  const handleShareRoom = () => {
    if (!selectedRoom || !shareName.trim()) return;

    const roomConfig = roomConfigs.find(r => r.id === selectedRoom);
    if (!roomConfig) return;

    // Create room customizations (in a real app, this would pull from actual room state)
    const customizations = {
      theme: 'gothic-dark',
      ambiance: 'candlelit',
      decorations: ['candles', 'crystals', 'books'],
      layout: 'default',
      colors: {
        primary: roomConfig.color,
        accent: '#d4af37',
      },
    };

    const shared = socialService.shareRoom(
      selectedRoom,
      roomConfig.name,
      shareName,
      shareDescription,
      customizations
    );

    if (shared) {
      setGeneratedShareCode(shared.shareCode);
      setExportedJson(socialService.exportRoomConfig(shared));
      loadRooms();
      showSnackbar(`Room shared! Share code: ${shared.shareCode}`);
    }
  };

  const handleImportByCode = () => {
    if (!importCode.trim()) {
      setImportError('Please enter a share code');
      return;
    }

    const imported = socialService.importRoomByCode(importCode.trim());
    if (imported) {
      setPreviewRoom(imported);
      setPreviewDialogOpen(true);
      setImportDialogOpen(false);
      setImportCode('');
      setImportError('');
      loadRooms();
    } else {
      setImportError('Invalid share code. Please check and try again.');
    }
  };

  const handleImportFromJson = () => {
    if (!importCode.trim()) {
      setImportError('Please paste the exported JSON');
      return;
    }

    const imported = socialService.importRoomFromJson(importCode.trim());
    if (imported) {
      setPreviewRoom(imported);
      setPreviewDialogOpen(true);
      setImportDialogOpen(false);
      setImportCode('');
      setImportError('');
      loadRooms();
    } else {
      setImportError('Invalid room configuration. Please check the JSON format.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showSnackbar('Share code copied to clipboard!');
  };

  const handleCopyJson = (roomConfig: SharedRoomConfig) => {
    const json = socialService.exportRoomConfig(roomConfig);
    navigator.clipboard.writeText(json);
    showSnackbar('Room configuration copied to clipboard!');
  };

  const handleDeleteSharedRoom = (roomId: string) => {
    socialService.deleteSharedRoom(roomId);
    loadRooms();
    showSnackbar('Shared room deleted');
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const getRoomColor = (roomId: string) => {
    return roomConfigs.find(r => r.id === roomId)?.color || '#8b5cf6';
  };

  const getRoomIcon = (roomId: string) => {
    return roomConfigs.find(r => r.id === roomId)?.icon || '🏠';
  };

  return (
    <ShareContainer>
      <Grid container spacing={4}>
        {/* Share a Room */}
        <Grid item xs={12} md={6}>
          <GothicCard variant="elevated" ornate>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
              <Share2 size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Share Your Room
            </Typography>

            <Typography sx={{ color: '#888', mb: 3 }}>
              Select a room to share its configuration with friends:
            </Typography>

            <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 3 }}>
              {roomConfigs.map((room) => (
                <RoomSelector
                  key={room.id}
                  selected={selectedRoom === room.id}
                  color={room.color}
                  onClick={() => setSelectedRoom(room.id)}
                  sx={{ mb: 1 }}
                >
                  <Box sx={{ fontSize: '1.5rem' }}>{room.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: selectedRoom === room.id ? room.color : '#e0e0e0', fontWeight: 600 }}>
                      {room.name}
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                      {room.description}
                    </Typography>
                  </Box>
                  {selectedRoom === room.id && <Check size={20} color={room.color} />}
                </RoomSelector>
              ))}
            </Box>

            <GothicButton
              variant="primary"
              startIcon={<Share2 size={18} />}
              onClick={() => setShareDialogOpen(true)}
              disabled={!selectedRoom}
              sx={{ width: '100%' }}
            >
              Create Share Link
            </GothicButton>
          </GothicCard>
        </Grid>

        {/* Import a Room */}
        <Grid item xs={12} md={6}>
          <GothicCard variant="elevated" ornate>
            <Typography sx={{ color: '#60a5fa', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
              <Download size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Import a Room
            </Typography>

            <Typography sx={{ color: '#888', mb: 3 }}>
              Enter a share code or paste exported JSON to import a room configuration:
            </Typography>

            <ShareCodeBox sx={{ mb: 3 }}>
              <QrCode size={48} color="#d4af37" style={{ marginBottom: '12px' }} />
              <Typography sx={{ color: '#a78bfa', fontSize: '1.1rem', mb: 1 }}>
                Have a share code?
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                Enter the 8-character code to preview and import
              </Typography>
            </ShareCodeBox>

            <GothicButton
              variant="secondary"
              startIcon={<Upload size={18} />}
              onClick={() => setImportDialogOpen(true)}
              sx={{ width: '100%' }}
            >
              Import Room
            </GothicButton>
          </GothicCard>
        </Grid>

        {/* Your Shared Rooms */}
        <Grid item xs={12}>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Link2 size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Your Shared Rooms ({sharedRooms.length})
          </Typography>

          {sharedRooms.length === 0 ? (
            <GothicCard variant="glass" sx={{ textAlign: 'center', py: 6 }}>
              <Share2 size={48} color="#444" />
              <Typography sx={{ color: '#666', mt: 2 }}>
                You haven't shared any rooms yet. Create your first share above!
              </Typography>
            </GothicCard>
          ) : (
            <Grid container spacing={2}>
              {sharedRooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} key={room.id}>
                  <SharedRoomCard variant="glass" color={getRoomColor(room.roomId)}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ fontSize: '2.5rem' }}>{getRoomIcon(room.roomId)}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem' }}>
                          {room.name}
                        </Typography>
                        <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                          {room.roomName}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem', mb: 2 }}>
                      {room.description || 'No description'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <StatChip
                        icon={<Eye size={14} />}
                        label={`${room.stats.views} views`}
                        size="small"
                      />
                      <StatChip
                        icon={<Download size={14} />}
                        label={`${room.stats.imports} imports`}
                        size="small"
                      />
                      <StatChip
                        icon={<Heart size={14} />}
                        label={`${room.stats.likes} likes`}
                        size="small"
                      />
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      background: 'rgba(212, 175, 55, 0.1)',
                      borderRadius: '8px',
                      mb: 2,
                    }}>
                      <Code size={16} color="#d4af37" />
                      <Typography sx={{ color: '#d4af37', fontFamily: 'monospace', fontWeight: 600, flex: 1 }}>
                        {room.shareCode}
                      </Typography>
                      <Box
                        sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
                        onClick={() => handleCopyCode(room.shareCode)}
                      >
                        <Copy size={16} color="#d4af37" />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <GothicButton
                        variant="ghost"
                        size="small"
                        startIcon={<FileJson size={14} />}
                        onClick={() => handleCopyJson(room)}
                        sx={{ flex: 1 }}
                      >
                        Export
                      </GothicButton>
                      <GothicButton
                        variant="ghost"
                        size="small"
                        startIcon={<Trash2 size={14} />}
                        onClick={() => handleDeleteSharedRoom(room.id)}
                      >
                        Delete
                      </GothicButton>
                    </Box>

                    <Typography sx={{ color: '#555', fontSize: '0.75rem', mt: 2, textAlign: 'center' }}>
                      <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Created {new Date(room.createdAt).toLocaleDateString()}
                    </Typography>
                  </SharedRoomCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Imported Rooms */}
        {importedRooms.length > 0 && (
          <Grid item xs={12}>
            <Typography sx={{ color: '#60a5fa', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
              <Download size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Imported Rooms ({importedRooms.length})
            </Typography>

            <Grid container spacing={2}>
              {importedRooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} key={room.id}>
                  <SharedRoomCard variant="glass" color={getRoomColor(room.roomId)}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ fontSize: '2rem' }}>{getRoomIcon(room.roomId)}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>
                          {room.name}
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                          by @{room.createdByUsername}
                        </Typography>
                      </Box>
                    </Box>
                    <GothicButton
                      variant="ghost"
                      size="small"
                      startIcon={<ExternalLink size={14} />}
                      sx={{ width: '100%' }}
                    >
                      Apply to Room
                    </GothicButton>
                  </SharedRoomCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setGeneratedShareCode(null);
          setExportedJson(null);
          setShareName('');
          setShareDescription('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028, #0a0812)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
          <Share2 size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Share Room Configuration
        </DialogTitle>
        <DialogContent>
          {!generatedShareCode ? (
            <>
              <Typography sx={{ color: '#888', mb: 3 }}>
                Give your shared room a name and description:
              </Typography>

              {selectedRoom && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  background: `${getRoomColor(selectedRoom)}15`,
                  borderRadius: '12px',
                  border: `1px solid ${getRoomColor(selectedRoom)}50`,
                  mb: 3,
                }}>
                  <Box sx={{ fontSize: '2rem' }}>{getRoomIcon(selectedRoom)}</Box>
                  <Typography sx={{ color: getRoomColor(selectedRoom), fontWeight: 600 }}>
                    {roomConfigs.find(r => r.id === selectedRoom)?.name}
                  </Typography>
                </Box>
              )}

              <ImportField
                fullWidth
                label="Share Name"
                value={shareName}
                onChange={(e) => setShareName(e.target.value)}
                placeholder="e.g., My Cozy Reading Nook"
                sx={{ mb: 2 }}
              />
              <ImportField
                fullWidth
                label="Description (optional)"
                value={shareDescription}
                onChange={(e) => setShareDescription(e.target.value)}
                placeholder="Describe your room setup..."
                multiline
                rows={2}
              />
            </>
          ) : (
            <>
              <Alert severity="success" sx={{ mb: 3, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                Room shared successfully!
              </Alert>

              <Typography sx={{ color: '#888', mb: 2 }}>
                Share this code with friends:
              </Typography>

              <ShareCodeBox sx={{ mb: 3 }}>
                <Typography sx={{ color: '#d4af37', fontSize: '2rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.2em' }}>
                  {generatedShareCode}
                </Typography>
                <GothicButton
                  variant="ghost"
                  size="small"
                  startIcon={<Copy size={14} />}
                  onClick={() => handleCopyCode(generatedShareCode!)}
                  sx={{ mt: 2 }}
                >
                  Copy Code
                </GothicButton>
              </ShareCodeBox>

              <Typography sx={{ color: '#888', mb: 1, fontSize: '0.9rem' }}>
                Or copy the full configuration:
              </Typography>
              <Box sx={{
                p: 2,
                background: 'rgba(20, 20, 30, 0.8)',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#666',
                maxHeight: '100px',
                overflow: 'auto',
                wordBreak: 'break-all',
              }}>
                {exportedJson}
              </Box>
              <GothicButton
                variant="ghost"
                size="small"
                startIcon={<Copy size={14} />}
                onClick={() => {
                  navigator.clipboard.writeText(exportedJson!);
                  showSnackbar('JSON copied to clipboard!');
                }}
                sx={{ mt: 1 }}
              >
                Copy JSON
              </GothicButton>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {!generatedShareCode ? (
            <>
              <GothicButton variant="ghost" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </GothicButton>
              <GothicButton
                variant="primary"
                startIcon={<Share2 size={16} />}
                onClick={handleShareRoom}
                disabled={!shareName.trim()}
              >
                Share Room
              </GothicButton>
            </>
          ) : (
            <GothicButton
              variant="primary"
              onClick={() => {
                setShareDialogOpen(false);
                setGeneratedShareCode(null);
                setExportedJson(null);
                setShareName('');
                setShareDescription('');
              }}
            >
              Done
            </GothicButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => {
          setImportDialogOpen(false);
          setImportCode('');
          setImportError('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028, #0a0812)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#60a5fa', fontFamily: '"Cinzel", serif' }}>
          <Upload size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Import Room Configuration
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#888', mb: 3 }}>
            Enter an 8-character share code or paste the exported JSON:
          </Typography>

          <ImportField
            fullWidth
            label="Share Code or JSON"
            value={importCode}
            onChange={(e) => {
              setImportCode(e.target.value);
              setImportError('');
            }}
            placeholder="ABCD1234 or paste JSON..."
            error={!!importError}
            helperText={importError}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <GothicButton variant="ghost" onClick={() => setImportDialogOpen(false)}>
            Cancel
          </GothicButton>
          <GothicButton
            variant="secondary"
            startIcon={<Code size={16} />}
            onClick={handleImportByCode}
            disabled={importCode.length !== 8}
          >
            Import by Code
          </GothicButton>
          <GothicButton
            variant="primary"
            startIcon={<FileJson size={16} />}
            onClick={handleImportFromJson}
            disabled={importCode.length <= 8}
          >
            Import JSON
          </GothicButton>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028, #0a0812)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
          },
        }}
      >
        {previewRoom && (
          <>
            <DialogTitle sx={{ color: '#10b981', fontFamily: '"Cinzel", serif' }}>
              <Check size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Room Imported Successfully!
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ fontSize: '4rem', mb: 2 }}>{getRoomIcon(previewRoom.roomId)}</Box>
                <Typography sx={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 600 }}>
                  {previewRoom.name}
                </Typography>
                <Typography sx={{ color: '#888', mb: 2 }}>
                  {previewRoom.roomName} by @{previewRoom.createdByUsername}
                </Typography>

                {previewRoom.description && (
                  <Typography sx={{ color: '#a0a0a0', fontStyle: 'italic', mb: 3 }}>
                    "{previewRoom.description}"
                  </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {previewRoom.customizations.theme && (
                    <Chip
                      icon={<Palette size={14} />}
                      label={previewRoom.customizations.theme}
                      sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                    />
                  )}
                  {previewRoom.customizations.ambiance && (
                    <Chip
                      label={previewRoom.customizations.ambiance}
                      sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
                    />
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
              <GothicButton
                variant="primary"
                startIcon={<ExternalLink size={16} />}
                onClick={() => setPreviewDialogOpen(false)}
              >
                Apply to My Room
              </GothicButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ShareContainer>
  );
};

export default ShareRoom;
