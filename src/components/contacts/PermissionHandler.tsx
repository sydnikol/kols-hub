/**
 * Permission Handler Component
 * Handles contact permission requests and status display
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Link
} from '@mui/material';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Smartphone
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import phoneIntegrationService from '../../services/phoneIntegrationService';
import { ContactPermissionStatus } from '../../types/phoneContacts';

interface PermissionHandlerProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

const PermissionHandler: React.FC<PermissionHandlerProps> = ({
  onPermissionGranted,
  onPermissionDenied
}) => {
  const [permissionStatus, setPermissionStatus] = useState<ContactPermissionStatus>({
    granted: false,
    canRequest: false,
    platform: 'web'
  });
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const status = await phoneIntegrationService.checkContactsPermission();
    setPermissionStatus(status);

    if (status.granted) {
      setActiveStep(2);
      onPermissionGranted?.();
    } else if (!status.canRequest) {
      setActiveStep(1);
    }
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const status = await phoneIntegrationService.requestContactsPermission();
      setPermissionStatus(status);

      if (status.granted) {
        setActiveStep(2);
        onPermissionGranted?.();
      } else {
        setActiveStep(1);
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setActiveStep(1);
    } finally {
      setLoading(false);
    }
  };

  const openAppSettings = () => {
    // Platform-specific instructions
    if (permissionStatus.platform === 'ios') {
      alert('Please go to Settings > Privacy > Contacts and enable access for this app.');
    } else if (permissionStatus.platform === 'android') {
      alert('Please go to Settings > Apps > KOL > Permissions and enable Contacts permission.');
    }
  };

  // Web platform - show alternative
  if (permissionStatus.platform === 'web') {
    return (
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.50', borderColor: 'info.main', border: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Smartphone size={24} color="#3B82F6" />
          <Box>
            <Typography variant="h6" gutterBottom>
              Web Platform Detected
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Native contact access is only available on iOS and Android mobile apps.
              You can still add contacts manually to your care team.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              To use contact sync features, please use the mobile app on your iOS or Android device.
            </Alert>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Permission granted
  if (permissionStatus.granted) {
    return (
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.50', borderColor: 'success.main', border: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircle size={24} color="#10B981" />
          <Box>
            <Typography variant="h6" color="success.main">
              Contacts Access Enabled
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can now view and import your phone contacts.
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Permission flow
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
        <Shield size={32} color="#8B5CF6" />
        <Box>
          <Typography variant="h5" gutterBottom>
            Contacts Permission Required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To sync your phone contacts with your care team, we need permission to access your contacts.
          </Typography>
        </Box>
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        {/* Step 1: Request Permission */}
        <Step>
          <StepLabel>
            <Typography variant="subtitle1">Grant Contacts Permission</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click the button below to grant permission. You'll see a system prompt asking for access to your contacts.
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Why we need this permission:</AlertTitle>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>View your phone contacts</li>
                <li>Import contacts to your care team</li>
                <li>Quick dial doctors, therapists, and emergency contacts</li>
                <li>Sync contact information automatically</li>
              </ul>
            </Alert>
            <Button
              variant="contained"
              onClick={requestPermission}
              disabled={loading}
              startIcon={<Shield size={20} />}
            >
              {loading ? 'Requesting...' : 'Grant Permission'}
            </Button>
          </StepContent>
        </Step>

        {/* Step 2: Permission Denied - Manual Enable */}
        <Step>
          <StepLabel
            error={activeStep === 1}
            StepIconComponent={() => <XCircle size={24} color="#EF4444" />}
          >
            <Typography variant="subtitle1">Permission Denied</Typography>
          </StepLabel>
          <StepContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Contacts permission was denied</AlertTitle>
              You need to enable contacts permission in your device settings to use this feature.
            </Alert>

            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>To enable manually:</strong>
            </Typography>

            {permissionStatus.platform === 'ios' && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" component="div">
                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Open <strong>Settings</strong> app</li>
                    <li>Scroll down and tap <strong>KOL</strong></li>
                    <li>Tap <strong>Contacts</strong></li>
                    <li>Enable <strong>Allow Access</strong></li>
                  </ol>
                </Typography>
              </Box>
            )}

            {permissionStatus.platform === 'android' && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" component="div">
                  <ol style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Open <strong>Settings</strong> app</li>
                    <li>Tap <strong>Apps</strong></li>
                    <li>Find and tap <strong>KOL</strong></li>
                    <li>Tap <strong>Permissions</strong></li>
                    <li>Tap <strong>Contacts</strong></li>
                    <li>Select <strong>Allow</strong></li>
                  </ol>
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={openAppSettings}
                startIcon={<Settings size={20} />}
              >
                Open Settings Guide
              </Button>
              <Button
                variant="contained"
                onClick={checkPermission}
              >
                Check Again
              </Button>
            </Box>
          </StepContent>
        </Step>

        {/* Step 3: Success */}
        <Step>
          <StepLabel
            StepIconComponent={() => <CheckCircle size={24} color="#10B981" />}
          >
            <Typography variant="subtitle1">Permission Granted</Typography>
          </StepLabel>
          <StepContent>
            <Alert severity="success">
              <AlertTitle>Success!</AlertTitle>
              You can now access and import your phone contacts.
            </Alert>
          </StepContent>
        </Step>
      </Stepper>

      {/* Privacy Notice */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" component="div">
          <Shield size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          <strong>Privacy Notice:</strong> Your contacts are stored locally on your device and are never uploaded to our servers.
          All contact data remains under your control.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PermissionHandler;
