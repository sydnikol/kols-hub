/**
 * Phone Integration Usage Examples
 * Demonstrates how to use phone integration in other parts of the app
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import phoneIntegrationService from '../services/phoneIntegrationService';
import { QuickContactActions } from '../components/contacts';
import { CareTeamContact } from '../types/phoneContacts';
import { toast } from 'react-hot-toast';

/**
 * Example 1: Emergency Call Button
 * Quick access to emergency services
 */
export const EmergencyCallButton: React.FC = () => {
  const handleEmergencyCall = async () => {
    if (confirm('Call 911?')) {
      try {
        await phoneIntegrationService.callEmergencyNumber('911');
      } catch (error) {
        toast.error('Failed to call emergency services');
      }
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      size="large"
      startIcon={<AlertTriangle size={20} />}
      onClick={handleEmergencyCall}
      sx={{ minWidth: 200 }}
    >
      Emergency: Call 911
    </Button>
  );
};

/**
 * Example 2: Crisis Hotline Button
 * Quick access to suicide prevention hotline
 */
export const CrisisHotlineButton: React.FC = () => {
  const handleCrisisCall = async () => {
    try {
      await phoneIntegrationService.callEmergencyNumber('988');
      toast.success('Connecting to 988 Suicide & Crisis Lifeline');
    } catch (error) {
      toast.error('Failed to connect to crisis line');
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<Phone size={20} />}
      onClick={handleCrisisCall}
    >
      988 Crisis Lifeline
    </Button>
  );
};

/**
 * Example 3: Quick Contact Doctor
 * Widget to call your primary doctor
 */
export const CallMyDoctorWidget: React.FC = () => {
  const [doctor, setDoctor] = useState<CareTeamContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, []);

  const loadDoctor = async () => {
    try {
      const doctors = await phoneIntegrationService.getCareTeamContacts({
        role: 'doctor'
      });

      if (doctors.length > 0) {
        setDoctor(doctors[0]); // Get first doctor
      }
    } catch (error) {
      console.error('Error loading doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async () => {
    if (doctor?.careTeamId) {
      try {
        await phoneIntegrationService.quickDial(doctor.careTeamId);
      } catch (error) {
        toast.error('Failed to call doctor');
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  if (!doctor) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No doctor added to care team. Go to Phone Contacts to add one.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your Doctor
        </Typography>
        <Typography variant="body1">{doctor.displayName}</Typography>
        {doctor.organizationName && (
          <Typography variant="body2" color="text.secondary">
            {doctor.organizationName}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Phone size={20} />}
            onClick={handleCall}
            fullWidth
          >
            Call Doctor
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Example 4: Recent Contacts Widget
 * Show recently contacted care team members
 */
export const RecentContactsWidget: React.FC = () => {
  const [recentContacts, setRecentContacts] = useState<CareTeamContact[]>([]);

  useEffect(() => {
    loadRecentContacts();
  }, []);

  const loadRecentContacts = async () => {
    try {
      const contacts = await phoneIntegrationService.getRecentContacts(3);
      setRecentContacts(contacts);
    } catch (error) {
      console.error('Error loading recent contacts:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Contacts
        </Typography>
        {recentContacts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recent contacts
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentContacts.map(contact => (
              <Box
                key={contact.careTeamId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="body1">{contact.displayName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {contact.role}
                  </Typography>
                </Box>
                <QuickContactActions
                  phoneNumber={contact.phoneNumbers?.[0]?.number}
                  email={contact.emails?.[0]?.address}
                  contactName={contact.displayName}
                  size="small"
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Example 5: Medication Reminder with Doctor Call
 * Integration with medication tracker
 */
export const MedicationReminderWithCall: React.FC = () => {
  const handleCallPharmacy = async () => {
    try {
      const pharmacies = await phoneIntegrationService.getCareTeamContacts({
        role: 'pharmacy'
      });

      if (pharmacies.length > 0 && pharmacies[0].careTeamId) {
        await phoneIntegrationService.quickDial(pharmacies[0].careTeamId);
      } else {
        toast.error('No pharmacy in care team');
      }
    } catch (error) {
      toast.error('Failed to call pharmacy');
    }
  };

  return (
    <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
      <CardContent>
        <Typography variant="h6" color="warning.dark">
          Medication Refill Due
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your prescription for Gabapentin is due for refill
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={handleCallPharmacy}>
            Call Pharmacy
          </Button>
          <Button variant="outlined">Remind Later</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Example 6: Therapist Quick Text
 * Send a quick message to your therapist
 */
export const QuickTextTherapist: React.FC = () => {
  const [therapist, setTherapist] = useState<CareTeamContact | null>(null);

  useEffect(() => {
    loadTherapist();
  }, []);

  const loadTherapist = async () => {
    try {
      const therapists = await phoneIntegrationService.getCareTeamContacts({
        role: 'therapist'
      });

      if (therapists.length > 0) {
        setTherapist(therapists[0]);
      }
    } catch (error) {
      console.error('Error loading therapist:', error);
    }
  };

  const handleQuickMessage = async (message: string) => {
    if (therapist?.careTeamId) {
      try {
        await phoneIntegrationService.quickText(therapist.careTeamId, message);
      } catch (error) {
        toast.error('Failed to send message');
      }
    }
  };

  if (!therapist) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Message to Therapist
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {therapist.displayName}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickMessage('I need to reschedule our appointment')}
          >
            Need to Reschedule
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickMessage('Can we talk today?')}
          >
            Request Same-Day Call
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickMessage('Having a rough day, could use support')}
          >
            Need Support
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Example 7: Health Dashboard Integration
 * Show emergency contacts in health dashboard
 */
export const HealthDashboardEmergencyContacts: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState<CareTeamContact[]>([]);

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      const contacts = await phoneIntegrationService.getCareTeamContacts({
        isEmergency: true
      });
      setEmergencyContacts(contacts.slice(0, 2)); // Top 2
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  return (
    <Card sx={{ bgcolor: 'error.50' }}>
      <CardContent>
        <Typography variant="h6" color="error.main" gutterBottom>
          Emergency Contacts
        </Typography>
        {emergencyContacts.map(contact => (
          <Box
            key={contact.careTeamId}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}
          >
            <Typography variant="body2">{contact.displayName}</Typography>
            <QuickContactActions
              phoneNumber={contact.phoneNumbers?.[0]?.number}
              contactName={contact.displayName}
              color="error"
              size="small"
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

/**
 * Example 8: Import Contacts Flow
 * Show how to trigger contact import from another page
 */
export const ImportContactsButton: React.FC = () => {
  const handleImportContacts = async () => {
    try {
      // Check permission first
      const status = await phoneIntegrationService.checkContactsPermission();

      if (!status.granted) {
        const granted = await phoneIntegrationService.requestContactsPermission();
        if (!granted.granted) {
          toast.error('Contacts permission required');
          return;
        }
      }

      // Get contacts
      const contacts = await phoneIntegrationService.getPhoneContacts();

      // Could show a selection dialog here, but for demo just import all
      const result = await phoneIntegrationService.syncContactsToCareTeam(contacts);

      toast.success(
        `Imported ${result.imported} contacts, updated ${result.updated}`
      );
    } catch (error) {
      toast.error('Failed to import contacts');
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<Phone size={20} />}
      onClick={handleImportContacts}
    >
      Import Phone Contacts
    </Button>
  );
};

/**
 * Example 9: Care Team Summary
 * Show care team statistics
 */
export const CareTeamSummary: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    doctors: 0,
    therapists: 0,
    emergency: 0,
    favorites: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [all, doctors, therapists, emergency, favorites] = await Promise.all([
        phoneIntegrationService.getCareTeamContacts(),
        phoneIntegrationService.getCareTeamContacts({ role: 'doctor' }),
        phoneIntegrationService.getCareTeamContacts({ role: 'therapist' }),
        phoneIntegrationService.getCareTeamContacts({ isEmergency: true }),
        phoneIntegrationService.getFavoriteContacts()
      ]);

      setStats({
        total: all.length,
        doctors: doctors.length,
        therapists: therapists.length,
        emergency: emergency.length,
        favorites: favorites.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Care Team Summary
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Contacts
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="error">
              {stats.emergency}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Emergency
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="success.main">
              {stats.doctors}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Doctors
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="info.main">
              {stats.therapists}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Therapists
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Example 10: Complete Integration Demo Page
 * Shows multiple widgets together
 */
export const PhoneIntegrationDemoPage: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Phone Integration Examples
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Demonstrations of how to use phone integration throughout the app
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 3 }}>
        <CareTeamSummary />
        <CallMyDoctorWidget />
        <RecentContactsWidget />
        <HealthDashboardEmergencyContacts />
        <QuickTextTherapist />
        <MedicationReminderWithCall />
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <EmergencyCallButton />
        <CrisisHotlineButton />
        <ImportContactsButton />
      </Box>
    </Box>
  );
};

export default PhoneIntegrationDemoPage;
