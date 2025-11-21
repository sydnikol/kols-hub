/**
 * Quick Contact Actions Component
 * Reusable component for quick call/SMS/email actions
 */

import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Phone, MessageSquare, Mail } from 'lucide-react';
import phoneIntegrationService from '../../services/phoneIntegrationService';
import { toast } from 'react-hot-toast';

interface QuickContactActionsProps {
  phoneNumber?: string;
  email?: string;
  contactName?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'success';
  showLabels?: boolean;
}

const QuickContactActions: React.FC<QuickContactActionsProps> = ({
  phoneNumber,
  email,
  contactName,
  size = 'medium',
  color = 'primary',
  showLabels = false
}) => {
  const handleCall = async () => {
    if (!phoneNumber) return;

    try {
      await phoneIntegrationService.makeCall({
        phoneNumber,
        contactName
      });
    } catch (error) {
      console.error('Error making call:', error);
      toast.error('Failed to make call');
    }
  };

  const handleSMS = async () => {
    if (!phoneNumber) return;

    try {
      await phoneIntegrationService.sendSMS({
        phoneNumber,
        contactName
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error('Failed to send SMS');
    }
  };

  const handleEmail = () => {
    if (!email) return;

    window.location.href = `mailto:${email}`;
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {phoneNumber && (
        <Tooltip title={showLabels ? '' : 'Call'}>
          <IconButton
            size={size}
            color={color}
            onClick={handleCall}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.50'
              }
            }}
          >
            <Phone size={iconSize} />
          </IconButton>
        </Tooltip>
      )}

      {phoneNumber && (
        <Tooltip title={showLabels ? '' : 'Send SMS'}>
          <IconButton
            size={size}
            color={color}
            onClick={handleSMS}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.50'
              }
            }}
          >
            <MessageSquare size={iconSize} />
          </IconButton>
        </Tooltip>
      )}

      {email && (
        <Tooltip title={showLabels ? '' : 'Send Email'}>
          <IconButton
            size={size}
            color={color}
            onClick={handleEmail}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.50'
              }
            }}
          >
            <Mail size={iconSize} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default QuickContactActions;
