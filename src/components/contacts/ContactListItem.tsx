/**
 * Contact List Item Component
 * Reusable list item for displaying contact information with actions
 */

import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Box,
  Chip,
  Typography,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Phone,
  MessageSquare,
  Mail,
  Star,
  StarOff,
  AlertTriangle,
  MoreVertical,
  Trash2,
  Tag as TagIcon,
  UserCog
} from 'lucide-react';
import { CareTeamContact } from '../../types/phoneContacts';

interface ContactListItemProps {
  contact: CareTeamContact;
  onCall?: (phoneNumber: string, contactName?: string) => void;
  onSMS?: (phoneNumber: string, contactName?: string) => void;
  onEmail?: (email: string, contactName?: string) => void;
  onToggleFavorite?: (contactId: string) => void;
  onToggleEmergency?: (contactId: string) => void;
  onDelete?: (contactId: string) => void;
  onEdit?: (contact: CareTeamContact) => void;
  showActions?: boolean;
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onCall,
  onSMS,
  onEmail,
  onToggleFavorite,
  onToggleEmergency,
  onDelete,
  onEdit,
  showActions = false
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const displayName =
    contact.displayName ||
    `${contact.firstName || ''} ${contact.lastName || ''}`.trim() ||
    'Unknown Contact';

  const primaryPhone = contact.phoneNumbers?.[0];
  const primaryEmail = contact.emails?.[0];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (primaryPhone && onCall) {
      onCall(primaryPhone.number, displayName);
    }
  };

  const handleSMS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (primaryPhone && onSMS) {
      onSMS(primaryPhone.number, displayName);
    }
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (primaryEmail && onEmail) {
      onEmail(primaryEmail.address, displayName);
    }
  };

  const handleToggleFavorite = () => {
    if (contact.careTeamId && onToggleFavorite) {
      onToggleFavorite(contact.careTeamId);
    }
    handleMenuClose();
  };

  const handleToggleEmergency = () => {
    if (contact.careTeamId && onToggleEmergency) {
      onToggleEmergency(contact.careTeamId);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (contact.careTeamId && onDelete) {
      onDelete(contact.careTeamId);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(contact);
    }
    handleMenuClose();
  };

  const getRoleColor = (role?: string): string => {
    const roleColors: Record<string, string> = {
      doctor: '#EF4444',
      therapist: '#8B5CF6',
      psychiatrist: '#EC4899',
      counselor: '#06B6D4',
      case_manager: '#F59E0B',
      family: '#10B981',
      friend: '#3B82F6',
      partner: '#F59E0B',
      emergency: '#DC2626',
      support_group: '#8B5CF6',
      crisis_hotline: '#DC2626',
      pharmacy: '#10B981',
      other: '#6B7280'
    };

    return roleColors[role || 'other'] || '#6B7280';
  };

  return (
    <>
      <ListItem
        sx={{
          borderRadius: 1,
          mb: 1,
          border: '1px solid',
          borderColor: contact.isEmergency ? 'error.main' : 'divider',
          bgcolor: contact.isEmergency ? 'error.50' : 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
        secondaryAction={
          showActions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {primaryPhone && onCall && (
                <IconButton
                  edge="end"
                  onClick={handleCall}
                  color="primary"
                  title="Call"
                >
                  <Phone size={20} />
                </IconButton>
              )}

              {primaryPhone && onSMS && (
                <IconButton
                  edge="end"
                  onClick={handleSMS}
                  color="primary"
                  title="Send SMS"
                >
                  <MessageSquare size={20} />
                </IconButton>
              )}

              <IconButton edge="end" onClick={handleMenuClick}>
                <MoreVertical size={20} />
              </IconButton>
            </Box>
          )
        }
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: getRoleColor(contact.role),
              width: 48,
              height: 48
            }}
          >
            {displayName[0]}
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1">{displayName}</Typography>
              {contact.isFavorite && <Star size={16} fill="gold" color="gold" />}
              {contact.isEmergency && <AlertTriangle size={16} color="#DC2626" />}
            </Box>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              {/* Role and Organization */}
              <Typography variant="body2" component="div">
                {contact.role && (
                  <Chip
                    label={contact.role.replace('_', ' ')}
                    size="small"
                    sx={{
                      bgcolor: getRoleColor(contact.role),
                      color: 'white',
                      mr: 1,
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                )}
                {contact.organizationName && (
                  <span style={{ color: '#6B7280' }}>
                    {contact.organizationName}
                  </span>
                )}
              </Typography>

              {/* Phone Number */}
              {primaryPhone && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  <Phone size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {primaryPhone.number}
                  {primaryPhone.type && ` (${primaryPhone.type})`}
                </Typography>
              )}

              {/* Email */}
              {primaryEmail && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  <Mail size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {primaryEmail.address}
                </Typography>
              )}

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {contact.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ height: 18, fontSize: '0.65rem' }}
                    />
                  ))}
                </Box>
              )}

              {/* Synced from phone indicator */}
              {contact.syncedFromPhone && (
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                  Synced from phone
                </Typography>
              )}
            </Box>
          }
        />
      </ListItem>

      {/* More Actions Menu */}
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        {onToggleFavorite && (
          <MenuItem onClick={handleToggleFavorite}>
            {contact.isFavorite ? (
              <>
                <StarOff size={18} style={{ marginRight: 8 }} />
                Remove from Favorites
              </>
            ) : (
              <>
                <Star size={18} style={{ marginRight: 8 }} />
                Add to Favorites
              </>
            )}
          </MenuItem>
        )}

        {onToggleEmergency && (
          <MenuItem onClick={handleToggleEmergency}>
            <AlertTriangle size={18} style={{ marginRight: 8 }} />
            {contact.isEmergency ? 'Remove Emergency Status' : 'Mark as Emergency'}
          </MenuItem>
        )}

        {primaryEmail && onEmail && (
          <MenuItem onClick={handleEmail}>
            <Mail size={18} style={{ marginRight: 8 }} />
            Send Email
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <UserCog size={18} style={{ marginRight: 8 }} />
            Edit Contact
          </MenuItem>
        )}

        {onDelete && (
          <>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Trash2 size={18} style={{ marginRight: 8 }} />
              Remove from Care Team
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default ContactListItem;
