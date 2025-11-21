/**
 * Phone Contacts Page
 * UI for viewing, importing, and managing phone contacts
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import {
  Phone,
  Search,
  UserPlus,
  Download,
  Heart,
  AlertTriangle,
  Users,
  Tag,
  Mail,
  MapPin,
  Star,
  StarOff,
  Trash2,
  PhoneCall
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import phoneIntegrationService from '../services/phoneIntegrationService';
import {
  Contact,
  CareTeamContact,
  ContactRole,
  DEFAULT_CONTACT_TAGS,
  EMERGENCY_NUMBERS
} from '../types/phoneContacts';
import EmergencyContactCard from '../components/contacts/EmergencyContactCard';
import ContactListItem from '../components/contacts/ContactListItem';
import PermissionHandler from '../components/contacts/PermissionHandler';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contacts-tabpanel-${index}`}
      aria-labelledby={`contacts-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PhoneContactsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneContacts, setPhoneContacts] = useState<Contact[]>([]);
  const [careTeamContacts, setCareTeamContacts] = useState<CareTeamContact[]>([]);
  const [filteredPhoneContacts, setFilteredPhoneContacts] = useState<Contact[]>([]);
  const [filteredCareTeamContacts, setFilteredCareTeamContacts] = useState<CareTeamContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedRole, setSelectedRole] = useState<ContactRole>('other');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load contacts on mount
  useEffect(() => {
    checkPermissionAndLoadContacts();
    loadCareTeamContacts();
  }, []);

  // Filter contacts when search query changes
  useEffect(() => {
    filterContacts();
  }, [searchQuery, phoneContacts, careTeamContacts]);

  const checkPermissionAndLoadContacts = async () => {
    try {
      const status = await phoneIntegrationService.checkContactsPermission();
      setPermissionGranted(status.granted);

      if (status.granted) {
        loadPhoneContacts();
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setPermissionGranted(false);
      // Silently fail on web platform
      if (phoneIntegrationService.isNativePlatform()) {
        toast.error('Failed to check contacts permission');
      }
    }
  };

  const loadPhoneContacts = async () => {
    setLoading(true);
    try {
      const contacts = await phoneIntegrationService.getPhoneContacts();
      setPhoneContacts(contacts);
    } catch (error) {
      console.error('Error loading phone contacts:', error);
      toast.error('Failed to load phone contacts');
    } finally {
      setLoading(false);
    }
  };

  const loadCareTeamContacts = async () => {
    setLoading(true);
    try {
      const contacts = await phoneIntegrationService.getCareTeamContacts();
      setCareTeamContacts(contacts);
    } catch (error) {
      console.error('Error loading care team contacts:', error);
      toast.error('Failed to load care team contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    // Filter phone contacts
    const filteredPhone = phoneContacts.filter(contact =>
      contact.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phoneNumbers?.some(phone => phone.number.includes(searchQuery))
    );
    setFilteredPhoneContacts(filteredPhone);

    // Filter care team contacts
    const filteredCareTeam = careTeamContacts.filter(contact =>
      contact.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredCareTeamContacts(filteredCareTeam);
  };

  const handlePermissionGranted = () => {
    setPermissionGranted(true);
    loadPhoneContacts();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleContactSelect = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleImportClick = (contact: Contact) => {
    setSelectedContact(contact);
    setImportDialogOpen(true);
  };

  const handleImportContact = async () => {
    if (!selectedContact) return;

    try {
      await phoneIntegrationService.importContactToCareTeam(
        selectedContact,
        selectedRole,
        selectedTags
      );

      // Update the contact if marking as emergency or favorite
      if (isEmergency || isFavorite) {
        const imported = await phoneIntegrationService.getCareTeamContacts();
        const importedContact = imported.find(c => c.contactId === selectedContact.contactId);

        if (importedContact && importedContact.careTeamId) {
          if (isEmergency) {
            await phoneIntegrationService.toggleEmergencyContact(importedContact.careTeamId);
          }
          if (isFavorite) {
            await phoneIntegrationService.toggleFavoriteContact(importedContact.careTeamId);
          }
        }
      }

      toast.success('Contact imported to care team');
      setImportDialogOpen(false);
      resetImportForm();
      loadCareTeamContacts();
    } catch (error) {
      console.error('Error importing contact:', error);
      toast.error('Failed to import contact');
    }
  };

  const handleBulkImport = async () => {
    if (selectedContacts.size === 0) {
      toast.error('No contacts selected');
      return;
    }

    setLoading(true);
    try {
      const contactsToImport = phoneContacts.filter(c =>
        selectedContacts.has(c.contactId)
      );

      const result = await phoneIntegrationService.syncContactsToCareTeam(contactsToImport);

      toast.success(
        `Imported ${result.imported} contacts, updated ${result.updated}, skipped ${result.skipped}`
      );

      setSelectedContacts(new Set());
      loadCareTeamContacts();
    } catch (error) {
      console.error('Error bulk importing contacts:', error);
      toast.error('Failed to import contacts');
    } finally {
      setLoading(false);
    }
  };

  const resetImportForm = () => {
    setSelectedContact(null);
    setSelectedRole('other');
    setSelectedTags([]);
    setIsEmergency(false);
    setIsFavorite(false);
  };

  const handleCall = async (phoneNumber: string, contactName?: string) => {
    try {
      await phoneIntegrationService.makeCall({ phoneNumber, contactName });
    } catch (error) {
      console.error('Error making call:', error);
      toast.error('Failed to make call');
    }
  };

  const handleSMS = async (phoneNumber: string, contactName?: string) => {
    try {
      await phoneIntegrationService.sendSMS({ phoneNumber, contactName });
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error('Failed to send SMS');
    }
  };

  const handleToggleFavorite = async (contactId: string) => {
    try {
      await phoneIntegrationService.toggleFavoriteContact(contactId);
      loadCareTeamContacts();
      toast.success('Favorite status updated');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };

  const handleToggleEmergency = async (contactId: string) => {
    try {
      await phoneIntegrationService.toggleEmergencyContact(contactId);
      loadCareTeamContacts();
      toast.success('Emergency status updated');
    } catch (error) {
      console.error('Error toggling emergency:', error);
      toast.error('Failed to update emergency status');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to remove this contact from your care team?')) {
      return;
    }

    try {
      await phoneIntegrationService.deleteCareTeamContact(contactId);
      loadCareTeamContacts();
      toast.success('Contact removed from care team');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Phone Contacts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your phone contacts and care team
        </Typography>
      </Box>

      {/* Permission Handler */}
      {!permissionGranted && (
        <PermissionHandler onPermissionGranted={handlePermissionGranted} />
      )}

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: 8 }} />
          }}
        />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Care Team" icon={<Users size={20} />} iconPosition="start" />
          <Tab label="Phone Contacts" icon={<Phone size={20} />} iconPosition="start" />
          <Tab label="Emergency" icon={<AlertTriangle size={20} />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Care Team Tab */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredCareTeamContacts.length === 0 ? (
          <Alert severity="info">
            No care team contacts yet. Import contacts from your phone or add them manually.
          </Alert>
        ) : (
          <List>
            {filteredCareTeamContacts.map(contact => (
              <ContactListItem
                key={contact.careTeamId}
                contact={contact}
                onCall={handleCall}
                onSMS={handleSMS}
                onToggleFavorite={handleToggleFavorite}
                onToggleEmergency={handleToggleEmergency}
                onDelete={handleDeleteContact}
                showActions
              />
            ))}
          </List>
        )}
      </TabPanel>

      {/* Phone Contacts Tab */}
      <TabPanel value={tabValue} index={1}>
        {!permissionGranted ? (
          <Alert severity="warning">
            Contact permissions not granted. Please enable contacts access to view phone contacts.
          </Alert>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {selectedContacts.size > 0 && (
              <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2">
                  {selectedContacts.size} contacts selected
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Download size={20} />}
                  onClick={handleBulkImport}
                >
                  Import Selected
                </Button>
                <Button onClick={() => setSelectedContacts(new Set())}>
                  Clear Selection
                </Button>
              </Box>
            )}

            {filteredPhoneContacts.length === 0 ? (
              <Alert severity="info">
                No phone contacts found.
              </Alert>
            ) : (
              <List>
                {filteredPhoneContacts.map(contact => (
                  <ListItem
                    key={contact.contactId}
                    secondaryAction={
                      <Box>
                        <Checkbox
                          checked={selectedContacts.has(contact.contactId)}
                          onChange={() => handleContactSelect(contact.contactId)}
                        />
                        <IconButton
                          onClick={() => handleImportClick(contact)}
                          color="primary"
                        >
                          <UserPlus size={20} />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {contact.displayName?.[0] || contact.firstName?.[0] || '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.displayName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
                      secondary={
                        <>
                          {contact.phoneNumbers?.[0]?.number}
                          {contact.organizationName && ` | ${contact.organizationName}`}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </TabPanel>

      {/* Emergency Contacts Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Emergency Hotlines
          </Typography>
          <Grid container spacing={2}>
            {EMERGENCY_NUMBERS.map(emergency => (
              <Grid item xs={12} sm={6} md={4} key={emergency.number}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {emergency.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {emergency.description}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color={emergency.type === 'emergency' ? 'error' : 'primary'}
                    startIcon={<PhoneCall size={20} />}
                    onClick={() => handleCall(emergency.number, emergency.name)}
                    sx={{ mt: 1 }}
                  >
                    {emergency.number}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Personal Emergency Contacts
          </Typography>
          {careTeamContacts.filter(c => c.isEmergency).length === 0 ? (
            <Alert severity="info">
              No emergency contacts set. Mark important contacts as emergency from the Care Team tab.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {careTeamContacts
                .filter(c => c.isEmergency)
                .map(contact => (
                  <Grid item xs={12} sm={6} key={contact.careTeamId}>
                    <EmergencyContactCard
                      contact={contact}
                      onCall={handleCall}
                      onSMS={handleSMS}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
        </Box>
      </TabPanel>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Contact to Care Team</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedContact?.displayName}
            </Typography>

            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as ContactRole)}
                label="Role"
              >
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="therapist">Therapist</MenuItem>
                <MenuItem value="psychiatrist">Psychiatrist</MenuItem>
                <MenuItem value="counselor">Counselor</MenuItem>
                <MenuItem value="case_manager">Case Manager</MenuItem>
                <MenuItem value="family">Family</MenuItem>
                <MenuItem value="friend">Friend</MenuItem>
                <MenuItem value="partner">Partner</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
                <MenuItem value="support_group">Support Group</MenuItem>
                <MenuItem value="crisis_hotline">Crisis Hotline</MenuItem>
                <MenuItem value="pharmacy">Pharmacy</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={selectedTags}
                onChange={(e) => setSelectedTags(e.target.value as string[])}
                label="Tags"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {DEFAULT_CONTACT_TAGS.map(tag => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                />
              }
              label="Mark as Emergency Contact"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                />
              }
              label="Mark as Favorite"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleImportContact} variant="contained">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PhoneContactsPage;
