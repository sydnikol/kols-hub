/**
 * Emergency Contact Card Component
 * Quick access card for emergency contacts with one-tap actions
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { CareTeamContact } from '../../types/phoneContacts';

interface EmergencyContactCardProps {
  contact: CareTeamContact;
  onCall: (phoneNumber: string, contactName?: string) => void;
  onSMS: (phoneNumber: string, contactName?: string) => void;
  onEmail?: (email: string) => void;
  onLocation?: (contact: CareTeamContact) => void;
}

const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
  onCall,
  onSMS,
  onEmail,
  onLocation
}) => {
  const displayName =
    contact.displayName ||
    `${contact.firstName || ''} ${contact.lastName || ''}`.trim() ||
    'Unknown Contact';

  const primaryPhone = contact.phoneNumbers?.[0];
  const primaryEmail = contact.emails?.[0];
  const primaryAddress = contact.addresses?.[0];

  const handleCall = () => {
    if (primaryPhone) {
      onCall(primaryPhone.number, displayName);
    }
  };

  const handleSMS = () => {
    if (primaryPhone) {
      onSMS(primaryPhone.number, displayName);
    }
  };

  const handleEmail = () => {
    if (primaryEmail && onEmail) {
      onEmail(primaryEmail.address);
    }
  };

  const handleLocation = () => {
    if (primaryAddress && onLocation) {
      onLocation(contact);
    }
  };

  const getRoleColor = (role?: string): string => {
    const roleColors: Record<string, string> = {
      doctor: '#EF4444',
      therapist: '#8B5CF6',
      psychiatrist: '#EC4899',
      family: '#10B981',
      friend: '#3B82F6',
      emergency: '#DC2626',
      partner: '#F59E0B'
    };

    return roleColors[role || 'other'] || '#6B7280';
  };

  return (
    <Card
      sx={{
        border: '2px solid #DC2626',
        borderRadius: 2,
        bgcolor: '#FEF2F2',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: getRoleColor(contact.role),
              mr: 2
            }}
          >
            {displayName[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {displayName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={contact.role || 'Other'}
                size="small"
                color="error"
                icon={<AlertTriangle size={14} />}
              />
              {contact.isFavorite && (
                <Chip label="Favorite" size="small" color="primary" />
              )}
            </Box>
          </Box>
        </Box>

        {/* Contact Info */}
        <Box sx={{ mb: 2 }}>
          {primaryPhone && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Phone size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              {primaryPhone.number}
              {primaryPhone.type && ` (${primaryPhone.type})`}
            </Typography>
          )}

          {primaryEmail && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Mail size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              {primaryEmail.address}
            </Typography>
          )}

          {contact.organizationName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {contact.organizationName}
              {contact.organizationRole && ` - ${contact.organizationRole}`}
            </Typography>
          )}

          {contact.availableHours && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <Clock size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              {contact.availableHours}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Quick Actions */}
        <Stack spacing={1}>
          {primaryPhone && (
            <Button
              fullWidth
              variant="contained"
              color="error"
              size="large"
              startIcon={<Phone size={20} />}
              onClick={handleCall}
              sx={{ fontWeight: 'bold' }}
            >
              Call Now
            </Button>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {primaryPhone && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MessageSquare size={18} />}
                onClick={handleSMS}
              >
                Text
              </Button>
            )}

            {primaryEmail && onEmail && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Mail size={18} />}
                onClick={handleEmail}
              >
                Email
              </Button>
            )}
          </Box>
        </Stack>

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {contact.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        {/* Last Contacted */}
        {contact.lastContacted && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 2 }}
          >
            Last contacted:{' '}
            {new Date(contact.lastContacted).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContactCard;
