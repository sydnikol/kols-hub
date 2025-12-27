// Accessibility Panel Component
// Provides comprehensive accessibility controls for WCAG 2.1 AA compliance

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Box, Typography, Switch, Slider, Select, MenuItem, FormControl, InputLabel, Chip, Collapse, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Accessibility, Eye, Type, Volume2, MousePointer, Keyboard,
  Sun, Moon, Contrast, ZoomIn, ZoomOut, RefreshCcw,
  ChevronDown, ChevronUp, Settings, Check, X
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(139, 92, 246, 0); }
`;

const AccessibilityContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const SettingCard = styled(GothicCard)({
  marginBottom: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
});

const SettingRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid rgba(100, 100, 120, 0.2)',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const SettingLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const IconBox = styled(Box)<{ color: string }>(({ color }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: `${color}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CustomSlider = styled(Slider)({
  color: '#8b5cf6',
  '& .MuiSlider-thumb': {
    backgroundColor: '#8b5cf6',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(139, 92, 246, 0.16)',
    },
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
});

const CustomSwitch = styled(Switch)({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#8b5cf6',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#8b5cf6',
  },
});

const PresetButton = styled(Box)<{ active: boolean }>(({ active }) => ({
  padding: '12px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  background: active ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 30, 40, 0.5)',
  border: active ? '2px solid #8b5cf6' : '2px solid transparent',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.15)',
  },
}));

const FocusIndicator = styled(Box)({
  position: 'fixed',
  bottom: '20px',
  left: '20px',
  padding: '12px 20px',
  background: 'rgba(16, 185, 129, 0.9)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  zIndex: 1001,
  animation: `${pulse} 2s ease-in-out infinite`,
});

// Accessibility Settings Interface
export interface AccessibilitySettings {
  // Visual
  fontSize: number; // 80-150%
  lineHeight: number; // 1.2-2.0
  letterSpacing: number; // 0-5px
  highContrast: boolean;
  darkMode: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

  // Motion
  reducedMotion: boolean;
  pauseAnimations: boolean;

  // Audio
  screenReaderOptimized: boolean;
  audioDescriptions: boolean;
  soundEffects: boolean;

  // Interaction
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  largeClickTargets: boolean;

  // Timing
  extendedTimeouts: boolean;
  autoPlayPrevention: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  lineHeight: 1.5,
  letterSpacing: 0,
  highContrast: false,
  darkMode: true,
  colorBlindMode: 'none',
  reducedMotion: false,
  pauseAnimations: false,
  screenReaderOptimized: false,
  audioDescriptions: false,
  soundEffects: true,
  keyboardNavigation: true,
  focusIndicators: true,
  largeClickTargets: false,
  extendedTimeouts: false,
  autoPlayPrevention: false,
};

// Accessibility Presets
const presets: Record<string, Partial<AccessibilitySettings>> = {
  'Low Vision': {
    fontSize: 130,
    lineHeight: 1.8,
    highContrast: true,
    focusIndicators: true,
    largeClickTargets: true,
  },
  'Motor Impairment': {
    largeClickTargets: true,
    keyboardNavigation: true,
    focusIndicators: true,
    extendedTimeouts: true,
  },
  'Vestibular/Motion': {
    reducedMotion: true,
    pauseAnimations: true,
    autoPlayPrevention: true,
  },
  'Screen Reader': {
    screenReaderOptimized: true,
    audioDescriptions: true,
    reducedMotion: true,
    focusIndicators: true,
  },
  'Sensory Overload': {
    reducedMotion: true,
    pauseAnimations: true,
    soundEffects: false,
    highContrast: false,
    fontSize: 90,
  },
};

// Context for global accessibility state
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  applyPreset: (presetName: string) => void;
  resetToDefaults: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--a11y-font-size', `${settings.fontSize}%`);
    root.style.setProperty('--a11y-line-height', `${settings.lineHeight}`);
    root.style.setProperty('--a11y-letter-spacing', `${settings.letterSpacing}px`);

    // Apply classes for CSS-based accessibility
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    document.body.classList.toggle('large-targets', settings.largeClickTargets);
    document.body.classList.toggle('focus-visible', settings.focusIndicators);

    // Color blind mode filter
    if (settings.colorBlindMode !== 'none') {
      document.body.setAttribute('data-colorblind', settings.colorBlindMode);
    } else {
      document.body.removeAttribute('data-colorblind');
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName: string) => {
    const preset = presets[presetName];
    if (preset) {
      setSettings(prev => ({ ...prev, ...preset }));
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, applyPreset, resetToDefaults }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const AccessibilityPanel: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('visual');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Local state for demo (use useAccessibility in production)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setActivePreset(null);
  };

  const applyPreset = (presetName: string) => {
    const preset = presets[presetName];
    if (preset) {
      setSettings(prev => ({ ...prev, ...preset }));
      setActivePreset(presetName);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <AccessibilityContainer>
      <HeaderSection>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#8b5cf6',
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            mb: 1,
          }}
        >
          <Accessibility size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Accessibility Settings
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Customize your experience for comfort and ease of use
        </Typography>
      </HeaderSection>

      {/* Quick Presets */}
      <SettingCard variant="elevated" ornate sx={{ mb: 4 }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
          Quick Presets
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
          {Object.keys(presets).map((presetName) => (
            <PresetButton
              key={presetName}
              active={activePreset === presetName}
              onClick={() => applyPreset(presetName)}
            >
              <Typography sx={{ color: activePreset === presetName ? '#8b5cf6' : '#e0e0e0', fontSize: '0.9rem' }}>
                {presetName}
              </Typography>
            </PresetButton>
          ))}
        </Box>
      </SettingCard>

      {/* Visual Settings */}
      <SettingCard variant="glass">
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => toggleSection('visual')}
        >
          <SettingLabel>
            <IconBox color="#8b5cf6">
              <Eye size={20} color="#8b5cf6" />
            </IconBox>
            <Box>
              <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>Visual Settings</Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Font size, contrast, colors</Typography>
            </Box>
          </SettingLabel>
          {expandedSection === 'visual' ? <ChevronUp color="#888" /> : <ChevronDown color="#888" />}
        </Box>

        <Collapse in={expandedSection === 'visual'}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(100, 100, 120, 0.2)' }}>
            {/* Font Size */}
            <SettingRow>
              <SettingLabel>
                <Type size={18} color="#a78bfa" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Font Size</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{settings.fontSize}%</Typography>
                </Box>
              </SettingLabel>
              <Box sx={{ width: '150px' }}>
                <CustomSlider
                  value={settings.fontSize}
                  onChange={(_, v) => updateSetting('fontSize', v as number)}
                  min={80}
                  max={150}
                  step={10}
                />
              </Box>
            </SettingRow>

            {/* Line Height */}
            <SettingRow>
              <SettingLabel>
                <Type size={18} color="#a78bfa" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Line Height</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{settings.lineHeight}</Typography>
                </Box>
              </SettingLabel>
              <Box sx={{ width: '150px' }}>
                <CustomSlider
                  value={settings.lineHeight}
                  onChange={(_, v) => updateSetting('lineHeight', v as number)}
                  min={1.2}
                  max={2.0}
                  step={0.1}
                />
              </Box>
            </SettingRow>

            {/* High Contrast */}
            <SettingRow>
              <SettingLabel>
                <Contrast size={18} color="#a78bfa" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>High Contrast</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Increase color contrast</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
              />
            </SettingRow>

            {/* Color Blind Mode */}
            <SettingRow>
              <SettingLabel>
                <Eye size={18} color="#a78bfa" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Color Blind Mode</Typography>
                </Box>
              </SettingLabel>
              <FormControl size="small" sx={{ minWidth: '140px' }}>
                <Select
                  value={settings.colorBlindMode}
                  onChange={(e) => updateSetting('colorBlindMode', e.target.value as any)}
                  sx={{
                    color: '#e0e0e0',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8b5cf6' },
                    '.MuiSvgIcon-root': { color: '#888888' },
                  }}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="protanopia">Protanopia</MenuItem>
                  <MenuItem value="deuteranopia">Deuteranopia</MenuItem>
                  <MenuItem value="tritanopia">Tritanopia</MenuItem>
                </Select>
              </FormControl>
            </SettingRow>
          </Box>
        </Collapse>
      </SettingCard>

      {/* Motion Settings */}
      <SettingCard variant="glass">
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => toggleSection('motion')}
        >
          <SettingLabel>
            <IconBox color="#ec4899">
              <RefreshCcw size={20} color="#ec4899" />
            </IconBox>
            <Box>
              <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>Motion & Animation</Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Reduce visual motion</Typography>
            </Box>
          </SettingLabel>
          {expandedSection === 'motion' ? <ChevronUp color="#888" /> : <ChevronDown color="#888" />}
        </Box>

        <Collapse in={expandedSection === 'motion'}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(100, 100, 120, 0.2)' }}>
            <SettingRow>
              <SettingLabel>
                <RefreshCcw size={18} color="#ec4899" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Reduce Motion</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Minimize animations</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <X size={18} color="#ec4899" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Pause Animations</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Stop all animations</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.pauseAnimations}
                onChange={(e) => updateSetting('pauseAnimations', e.target.checked)}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <X size={18} color="#ec4899" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Prevent Auto-Play</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>No auto-playing media</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.autoPlayPrevention}
                onChange={(e) => updateSetting('autoPlayPrevention', e.target.checked)}
              />
            </SettingRow>
          </Box>
        </Collapse>
      </SettingCard>

      {/* Interaction Settings */}
      <SettingCard variant="glass">
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => toggleSection('interaction')}
        >
          <SettingLabel>
            <IconBox color="#10b981">
              <MousePointer size={20} color="#10b981" />
            </IconBox>
            <Box>
              <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>Interaction</Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Navigation and input</Typography>
            </Box>
          </SettingLabel>
          {expandedSection === 'interaction' ? <ChevronUp color="#888" /> : <ChevronDown color="#888" />}
        </Box>

        <Collapse in={expandedSection === 'interaction'}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(100, 100, 120, 0.2)' }}>
            <SettingRow>
              <SettingLabel>
                <Keyboard size={18} color="#10b981" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Keyboard Navigation</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Full keyboard support</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.keyboardNavigation}
                onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Eye size={18} color="#10b981" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Focus Indicators</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Show focus outlines</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.focusIndicators}
                onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <ZoomIn size={18} color="#10b981" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Large Click Targets</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Bigger buttons and links</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.largeClickTargets}
                onChange={(e) => updateSetting('largeClickTargets', e.target.checked)}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Settings size={18} color="#10b981" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Extended Timeouts</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>More time for actions</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.extendedTimeouts}
                onChange={(e) => updateSetting('extendedTimeouts', e.target.checked)}
              />
            </SettingRow>
          </Box>
        </Collapse>
      </SettingCard>

      {/* Audio Settings */}
      <SettingCard variant="glass">
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => toggleSection('audio')}
        >
          <SettingLabel>
            <IconBox color="#f97316">
              <Volume2 size={20} color="#f97316" />
            </IconBox>
            <Box>
              <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>Audio & Screen Reader</Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Sound and voice options</Typography>
            </Box>
          </SettingLabel>
          {expandedSection === 'audio' ? <ChevronUp color="#888" /> : <ChevronDown color="#888" />}
        </Box>

        <Collapse in={expandedSection === 'audio'}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(100, 100, 120, 0.2)' }}>
            <SettingRow>
              <SettingLabel>
                <Accessibility size={18} color="#f97316" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Screen Reader Optimized</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Enhanced ARIA labels</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.screenReaderOptimized}
                onChange={(e) => updateSetting('screenReaderOptimized', e.target.checked)}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Volume2 size={18} color="#f97316" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Audio Descriptions</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>Describe visual content</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.audioDescriptions}
                onChange={(e) => updateSetting('audioDescriptions', e.target.checked)}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>
                <Volume2 size={18} color="#f97316" />
                <Box>
                  <Typography sx={{ color: '#e0e0e0' }}>Sound Effects</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>UI sound feedback</Typography>
                </Box>
              </SettingLabel>
              <CustomSwitch
                checked={settings.soundEffects}
                onChange={(e) => updateSetting('soundEffects', e.target.checked)}
              />
            </SettingRow>
          </Box>
        </Collapse>
      </SettingCard>

      {/* Reset Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <GothicButton
          variant="ghost"
          startIcon={<RefreshCcw size={16} />}
          onClick={() => setSettings(defaultSettings)}
        >
          Reset to Defaults
        </GothicButton>
        <GothicButton variant="primary" startIcon={<Check size={16} />}>
          Save Settings
        </GothicButton>
      </Box>

      {/* Focus Mode Indicator */}
      {settings.focusIndicators && (
        <FocusIndicator>
          <Keyboard size={16} color="#ffffff" />
          <Typography sx={{ color: '#ffffff', fontSize: '0.85rem' }}>
            Press Tab to navigate
          </Typography>
        </FocusIndicator>
      )}
    </AccessibilityContainer>
  );
};

export default AccessibilityPanel;
