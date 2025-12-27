import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
  Avatar,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  CreditCard,
  Smartphone,
  FileText,
  Heart,
  AlertTriangle,
  Phone,
  Plus,
  X,
  Download,
  Printer,
  Save,
  User,
  Pill,
  AlertCircle,
  Shield,
  Activity,
  Users,
  Edit3,
  Eye,
  Trash2,
  Check,
} from 'lucide-react';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
`;

// Styled Components
const BuilderContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a0d0d 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #ef4444 0%, #f87171 50%, #dc2626 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(239, 68, 68, 0.5)',
  marginBottom: '8px',
});

const CardTypeTab = styled(Tab)({
  color: '#f87171',
  fontWeight: 600,
  '&.Mui-selected': {
    color: '#ef4444',
  },
});

const PreviewCard = styled(Card)<{ cardtype?: string }>(({ cardtype }) => ({
  background: cardtype === 'wallet'
    ? 'linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%)'
    : cardtype === 'phone'
    ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
    : 'linear-gradient(135deg, #1a0d0d 0%, #2d1f1f 100%)',
  border: '2px solid rgba(239, 68, 68, 0.4)',
  borderRadius: cardtype === 'wallet' ? '12px' : '20px',
  padding: cardtype === 'phone' ? '40px 20px' : '16px',
  minHeight: cardtype === 'wallet' ? '200px' : cardtype === 'phone' ? '400px' : '500px',
  width: cardtype === 'wallet' ? '340px' : cardtype === 'phone' ? '280px' : '100%',
  animation: `${glow} 3s infinite`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: cardtype === 'wallet' ? '40px' : '60px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
}));

const FormCard = styled(Card)({
  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '16px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '10px',
    color: '#fecaca',
    '& fieldset': { borderColor: 'rgba(239, 68, 68, 0.3)' },
    '&:hover fieldset': { borderColor: '#ef4444' },
    '&.Mui-focused fieldset': { borderColor: '#f87171' },
  },
  '& .MuiInputLabel-root': { color: '#f87171' },
});

const AddButton = styled(Button)({
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px dashed rgba(239, 68, 68, 0.4)',
  color: '#f87171',
  borderRadius: '10px',
  padding: '10px',
  '&:hover': {
    background: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
});

const ItemChip = styled(Chip)({
  background: 'rgba(239, 68, 68, 0.15)',
  color: '#fecaca',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  margin: '4px',
  '& .MuiChip-deleteIcon': {
    color: '#f87171',
    '&:hover': { color: '#ef4444' },
  },
});

const ActionButton = styled(Button)({
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: '#fff',
  fontWeight: 600,
  padding: '12px 24px',
  borderRadius: '10px',
  '&:hover': {
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  },
});

const SecondaryButton = styled(Button)({
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.4)',
  color: '#f87171',
  padding: '12px 24px',
  borderRadius: '10px',
  '&:hover': {
    background: 'rgba(239, 68, 68, 0.2)',
  },
});

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface CardData {
  name: string;
  dateOfBirth: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  bloodType: string;
  emergencyContacts: EmergencyContact[];
  whatHelps: string[];
  whatMakesWorse: string[];
  instructions: string;
}

const defaultData: CardData = {
  name: '',
  dateOfBirth: '',
  conditions: [],
  medications: [],
  allergies: [],
  bloodType: '',
  emergencyContacts: [],
  whatHelps: [],
  whatMakesWorse: [],
  instructions: '',
};

export const EmergencyCardBuilder: React.FC = () => {
  const [cardType, setCardType] = useState<'wallet' | 'phone' | 'full'>('wallet');
  const [cardData, setCardData] = useState<CardData>(defaultData);
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newHelps, setNewHelps] = useState('');
  const [newWorse, setNewWorse] = useState('');
  const [newContact, setNewContact] = useState<EmergencyContact>({ name: '', relationship: '', phone: '' });
  const [showPreview, setShowPreview] = useState(true);

  const addItem = (field: keyof CardData, value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setCardData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
      setter('');
    }
  };

  const removeItem = (field: keyof CardData, index: number) => {
    setCardData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setCardData(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, { ...newContact }],
      }));
      setNewContact({ name: '', relationship: '', phone: '' });
    }
  };

  const removeContact = (index: number) => {
    setCardData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const renderWalletPreview = () => (
    <PreviewCard cardtype="wallet">
      <Box sx={{ position: 'relative', zIndex: 1, pt: 5 }}>
        <Box sx={{ position: 'absolute', top: 8, left: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={16} color="#fff" />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
            MEDICAL ALERT
          </Typography>
        </Box>

        <Typography sx={{ color: '#fecaca', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
          {cardData.name || 'Your Name'}
        </Typography>

        {cardData.conditions.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 600 }}>CONDITIONS:</Typography>
            <Typography sx={{ color: '#fecaca', fontSize: '0.8rem' }}>
              {cardData.conditions.slice(0, 3).join(' | ')}
            </Typography>
          </Box>
        )}

        {cardData.medications.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 600 }}>MEDICATIONS:</Typography>
            <Typography sx={{ color: '#fecaca', fontSize: '0.8rem' }}>
              {cardData.medications.slice(0, 3).join(' | ')}
            </Typography>
          </Box>
        )}

        {cardData.allergies.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>ALLERGIES:</Typography>
            <Typography sx={{ color: '#fecaca', fontSize: '0.8rem' }}>
              {cardData.allergies.join(' | ')}
            </Typography>
          </Box>
        )}

        {cardData.emergencyContacts.length > 0 && (
          <Box>
            <Typography sx={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 600 }}>EMERGENCY:</Typography>
            <Typography sx={{ color: '#fecaca', fontSize: '0.8rem' }}>
              {cardData.emergencyContacts[0].name}: {cardData.emergencyContacts[0].phone}
            </Typography>
          </Box>
        )}
      </Box>
    </PreviewCard>
  );

  const renderPhonePreview = () => (
    <PreviewCard cardtype="phone">
      <Box sx={{ position: 'relative', zIndex: 1, pt: 7, textAlign: 'center' }}>
        <Box sx={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={20} color="#fff" />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
            MEDICAL INFO
          </Typography>
        </Box>

        <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, background: 'rgba(239, 68, 68, 0.3)', border: '2px solid #ef4444' }}>
          <User size={30} color="#fecaca" />
        </Avatar>

        <Typography sx={{ color: '#fecaca', fontWeight: 700, fontSize: '1.2rem', mb: 0.5 }}>
          {cardData.name || 'Your Name'}
        </Typography>

        {cardData.bloodType && (
          <Chip
            label={`Blood Type: ${cardData.bloodType}`}
            size="small"
            sx={{ background: '#ef4444', color: '#fff', fontWeight: 600, mb: 2 }}
          />
        )}

        <Divider sx={{ borderColor: 'rgba(239, 68, 68, 0.3)', my: 2 }} />

        {cardData.conditions.length > 0 && (
          <Box sx={{ mb: 2, textAlign: 'left' }}>
            <Typography sx={{ color: '#f87171', fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
              CONDITIONS
            </Typography>
            {cardData.conditions.slice(0, 3).map((c, i) => (
              <Typography key={i} sx={{ color: '#fecaca', fontSize: '0.85rem' }}>
                {c}
              </Typography>
            ))}
          </Box>
        )}

        {cardData.emergencyContacts.length > 0 && (
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ color: '#f87171', fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
              EMERGENCY CONTACT
            </Typography>
            <Typography sx={{ color: '#fecaca', fontSize: '0.9rem', fontWeight: 600 }}>
              {cardData.emergencyContacts[0].name}
            </Typography>
            <Typography sx={{ color: '#fca5a5', fontSize: '0.85rem' }}>
              {cardData.emergencyContacts[0].phone}
            </Typography>
          </Box>
        )}
      </Box>
    </PreviewCard>
  );

  const renderFullPreview = () => (
    <PreviewCard cardtype="full" sx={{ width: '100%', maxWidth: 600 }}>
      <Box sx={{ position: 'relative', zIndex: 1, pt: 7 }}>
        <Box sx={{ position: 'absolute', top: 15, left: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield size={20} color="#fff" />
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
            MEDICAL SUPPORT CARD
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, background: 'rgba(239, 68, 68, 0.3)', border: '3px solid #ef4444' }}>
            <User size={40} color="#fecaca" />
          </Avatar>
          <Box>
            <Typography sx={{ color: '#fecaca', fontWeight: 700, fontSize: '1.4rem' }}>
              {cardData.name || 'Your Name'}
            </Typography>
            {cardData.dateOfBirth && (
              <Typography sx={{ color: '#fca5a5', fontSize: '0.9rem' }}>
                DOB: {cardData.dateOfBirth}
              </Typography>
            )}
            {cardData.bloodType && (
              <Chip
                label={`Blood Type: ${cardData.bloodType}`}
                size="small"
                sx={{ background: '#ef4444', color: '#fff', fontWeight: 600, mt: 1 }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Activity size={14} color="#f87171" />
              <Typography sx={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
                CONDITIONS
              </Typography>
            </Box>
            {cardData.conditions.map((c, i) => (
              <Typography key={i} sx={{ color: '#fecaca', fontSize: '0.85rem', pl: 2.5 }}>
                {c}
              </Typography>
            ))}
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Pill size={14} color="#f87171" />
              <Typography sx={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
                MEDICATIONS
              </Typography>
            </Box>
            {cardData.medications.map((m, i) => (
              <Typography key={i} sx={{ color: '#fecaca', fontSize: '0.85rem', pl: 2.5 }}>
                {m}
              </Typography>
            ))}
          </Box>
        </Box>

        {cardData.allergies.length > 0 && (
          <Box sx={{ background: 'rgba(239, 68, 68, 0.2)', p: 1.5, borderRadius: '8px', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <AlertCircle size={14} color="#ef4444" />
              <Typography sx={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>
                ALLERGIES
              </Typography>
            </Box>
            <Typography sx={{ color: '#fecaca', fontSize: '0.9rem', pl: 2.5 }}>
              {cardData.allergies.join(' | ')}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Typography sx={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
              WHAT HELPS
            </Typography>
            {cardData.whatHelps.map((h, i) => (
              <Typography key={i} sx={{ color: '#86efac', fontSize: '0.85rem' }}>
                + {h}
              </Typography>
            ))}
          </Box>

          <Box>
            <Typography sx={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
              WHAT MAKES WORSE
            </Typography>
            {cardData.whatMakesWorse.map((w, i) => (
              <Typography key={i} sx={{ color: '#fca5a5', fontSize: '0.85rem' }}>
                - {w}
              </Typography>
            ))}
          </Box>
        </Box>

        {cardData.instructions && (
          <Box sx={{ background: 'rgba(139, 92, 246, 0.1)', p: 1.5, borderRadius: '8px', mb: 2 }}>
            <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
              IF UNRESPONSIVE
            </Typography>
            <Typography sx={{ color: '#c4b5fd', fontSize: '0.9rem' }}>
              {cardData.instructions}
            </Typography>
          </Box>
        )}

        {cardData.emergencyContacts.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Phone size={14} color="#f87171" />
              <Typography sx={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
                EMERGENCY CONTACTS
              </Typography>
            </Box>
            {cardData.emergencyContacts.map((contact, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', pl: 2.5, mb: 0.5 }}>
                <Typography sx={{ color: '#fecaca', fontSize: '0.9rem' }}>
                  {contact.name} ({contact.relationship})
                </Typography>
                <Typography sx={{ color: '#fca5a5', fontSize: '0.9rem', fontWeight: 600 }}>
                  {contact.phone}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </PreviewCard>
  );

  return (
    <BuilderContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <GothicTitle variant="h3">Emergency Card Builder</GothicTitle>
        <Typography sx={{ color: '#f87171', fontSize: '1.1rem' }}>
          Create medical alert cards for wallet, phone, and care team
        </Typography>
      </Box>

      {/* Card Type Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Tabs
          value={cardType}
          onChange={(_, v) => setCardType(v)}
          sx={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '4px',
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '8px',
              height: '100%',
              zIndex: 0,
            },
          }}
        >
          <CardTypeTab
            value="wallet"
            icon={<CreditCard size={18} />}
            iconPosition="start"
            label="Wallet Card"
            sx={{ zIndex: 1 }}
          />
          <CardTypeTab
            value="phone"
            icon={<Smartphone size={18} />}
            iconPosition="start"
            label="Phone Wallpaper"
            sx={{ zIndex: 1 }}
          />
          <CardTypeTab
            value="full"
            icon={<FileText size={18} />}
            iconPosition="start"
            label="Full Support Card"
            sx={{ zIndex: 1 }}
          />
        </Tabs>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
        {/* Form */}
        <Box>
          {/* Basic Info */}
          <FormCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <User size={18} color="#f87171" />
              <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>Basic Information</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyledTextField
                label="Full Name"
                value={cardData.name}
                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <StyledTextField
                  label="Date of Birth"
                  value={cardData.dateOfBirth}
                  onChange={(e) => setCardData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  placeholder="MM/DD/YYYY"
                  sx={{ flex: 1 }}
                />
                <StyledTextField
                  label="Blood Type"
                  value={cardData.bloodType}
                  onChange={(e) => setCardData(prev => ({ ...prev, bloodType: e.target.value }))}
                  placeholder="O+"
                  sx={{ width: 120 }}
                />
              </Box>
            </Box>
          </FormCard>

          {/* Conditions */}
          <FormCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Activity size={18} color="#f87171" />
              <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>Medical Conditions</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <StyledTextField
                label="Add Condition"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem('conditions', newCondition, setNewCondition)}
                fullWidth
                size="small"
              />
              <IconButton onClick={() => addItem('conditions', newCondition, setNewCondition)}>
                <Plus size={20} color="#f87171" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {cardData.conditions.map((c, i) => (
                <ItemChip key={i} label={c} onDelete={() => removeItem('conditions', i)} />
              ))}
            </Box>
          </FormCard>

          {/* Medications */}
          <FormCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Pill size={18} color="#f87171" />
              <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>Medications</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <StyledTextField
                label="Add Medication"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem('medications', newMedication, setNewMedication)}
                fullWidth
                size="small"
              />
              <IconButton onClick={() => addItem('medications', newMedication, setNewMedication)}>
                <Plus size={20} color="#f87171" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {cardData.medications.map((m, i) => (
                <ItemChip key={i} label={m} onDelete={() => removeItem('medications', i)} />
              ))}
            </Box>
          </FormCard>

          {/* Allergies */}
          <FormCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AlertCircle size={18} color="#ef4444" />
              <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>Allergies</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <StyledTextField
                label="Add Allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem('allergies', newAllergy, setNewAllergy)}
                fullWidth
                size="small"
              />
              <IconButton onClick={() => addItem('allergies', newAllergy, setNewAllergy)}>
                <Plus size={20} color="#f87171" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {cardData.allergies.map((a, i) => (
                <ItemChip
                  key={i}
                  label={a}
                  onDelete={() => removeItem('allergies', i)}
                  sx={{ background: 'rgba(239, 68, 68, 0.25)', borderColor: '#ef4444' }}
                />
              ))}
            </Box>
          </FormCard>

          {/* Emergency Contacts */}
          <FormCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Phone size={18} color="#f87171" />
              <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>Emergency Contacts</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <StyledTextField
                  label="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <StyledTextField
                  label="Relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <StyledTextField
                  label="Phone Number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  size="small"
                  fullWidth
                />
                <IconButton onClick={addContact}>
                  <Plus size={20} color="#f87171" />
                </IconButton>
              </Box>
            </Box>
            {cardData.emergencyContacts.map((contact, i) => (
              <Box key={i} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                mb: 1,
              }}>
                <Box>
                  <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>{contact.name}</Typography>
                  <Typography sx={{ color: '#fca5a5', fontSize: '0.85rem' }}>
                    {contact.relationship} - {contact.phone}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => removeContact(i)}>
                  <Trash2 size={16} color="#f87171" />
                </IconButton>
              </Box>
            ))}
          </FormCard>

          {/* Full Card Only Fields */}
          {cardType === 'full' && (
            <>
              <FormCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Heart size={18} color="#22c55e" />
                  <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>What Helps</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <StyledTextField
                    label="Add What Helps"
                    value={newHelps}
                    onChange={(e) => setNewHelps(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('whatHelps', newHelps, setNewHelps)}
                    fullWidth
                    size="small"
                  />
                  <IconButton onClick={() => addItem('whatHelps', newHelps, setNewHelps)}>
                    <Plus size={20} color="#22c55e" />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {cardData.whatHelps.map((h, i) => (
                    <ItemChip
                      key={i}
                      label={h}
                      onDelete={() => removeItem('whatHelps', i)}
                      sx={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#86efac' }}
                    />
                  ))}
                </Box>
              </FormCard>

              <FormCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AlertTriangle size={18} color="#ef4444" />
                  <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>What Makes Worse</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <StyledTextField
                    label="Add What Makes Worse"
                    value={newWorse}
                    onChange={(e) => setNewWorse(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('whatMakesWorse', newWorse, setNewWorse)}
                    fullWidth
                    size="small"
                  />
                  <IconButton onClick={() => addItem('whatMakesWorse', newWorse, setNewWorse)}>
                    <Plus size={20} color="#ef4444" />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {cardData.whatMakesWorse.map((w, i) => (
                    <ItemChip key={i} label={w} onDelete={() => removeItem('whatMakesWorse', i)} />
                  ))}
                </Box>
              </FormCard>

              <FormCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Shield size={18} color="#a78bfa" />
                  <Typography sx={{ color: '#fecaca', fontWeight: 600 }}>Instructions If Unresponsive</Typography>
                </Box>
                <StyledTextField
                  label="Special Instructions"
                  value={cardData.instructions}
                  onChange={(e) => setCardData(prev => ({ ...prev, instructions: e.target.value }))}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="E.g., Check blood sugar first, call 911, do not move unless necessary..."
                />
              </FormCard>
            </>
          )}
        </Box>

        {/* Preview */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ color: '#fecaca', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Eye size={18} />
              Live Preview
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showPreview}
                  onChange={(e) => setShowPreview(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#ef4444' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#ef4444' },
                  }}
                />
              }
              label=""
            />
          </Box>

          {showPreview && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              {cardType === 'wallet' && renderWalletPreview()}
              {cardType === 'phone' && renderPhonePreview()}
              {cardType === 'full' && renderFullPreview()}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ActionButton startIcon={<Download size={18} />} fullWidth>
              Download as Image
            </ActionButton>
            <SecondaryButton startIcon={<Printer size={18} />} fullWidth>
              Print Card
            </SecondaryButton>
            <SecondaryButton startIcon={<Save size={18} />} fullWidth>
              Save to Profile
            </SecondaryButton>
          </Box>

          {/* Tips */}
          <Box sx={{
            mt: 3,
            p: 2,
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}>
            <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
              Tips for Emergency Cards
            </Typography>
            <Typography sx={{ color: '#c4b5fd', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {'\u2022'} Keep wallet card behind your ID<br />
              {'\u2022'} Set phone wallpaper as lock screen<br />
              {'\u2022'} Give full card to family & caregivers<br />
              {'\u2022'} Update when medications change
            </Typography>
          </Box>
        </Box>
      </Box>
    </BuilderContainer>
  );
};

export default EmergencyCardBuilder;
