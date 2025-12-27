// AccessibilityProvider.tsx
// Comprehensive accessibility system for the Gothic Dollhouse app
// WCAG 2.1 AA compliant with gothic theming

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { Box, Typography, Slider, IconButton, Portal, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Accessibility,
  Eye,
  Type,
  Keyboard,
  Monitor,
  X,
  Moon,
  Sun,
  Volume2,
  Focus,
  SkipForward,
  Settings,
  Check,
  RotateCcw,
} from 'lucide-react';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type FontSize = 'normal' | 'large' | 'x-large';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: FontSize;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusHighlight: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
  resetSettings: () => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'gothic-dollhouse-accessibility';

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'normal',
  screenReaderMode: false,
  keyboardNavigation: true,
  focusHighlight: true,
};

const fontSizeValues: Record<FontSize, string> = {
  normal: '100%',
  large: '125%',
  'x-large': '150%',
};

const fontSizeLabels: Record<FontSize, string> = {
  normal: 'Normal (100%)',
  large: 'Large (125%)',
  'x-large': 'Extra Large (150%)',
};

// ============================================================================
// Styled Components
// ============================================================================

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  50% { box-shadow: 0 0 20px 5px rgba(139, 92, 246, 0.2); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Skip Link - visible on focus for keyboard users
const SkipLink = styled('a')({
  position: 'fixed',
  top: '-100px',
  left: '16px',
  zIndex: 10000,
  padding: '16px 24px',
  background: 'linear-gradient(135deg, #1a1028 0%, #2d1f42 100%)',
  color: '#d4af37',
  textDecoration: 'none',
  borderRadius: '0 0 12px 12px',
  border: '2px solid #d4af37',
  fontFamily: '"Cinzel", serif',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  transition: 'top 0.3s ease',
  '&:focus': {
    top: 0,
    outline: '3px solid #8b5cf6',
    outlineOffset: '2px',
  },
});

// Accessibility Panel Container
const PanelContainer = styled(Box)<{ reducedMotion: boolean }>(({ reducedMotion }) => ({
  position: 'fixed',
  top: '80px',
  right: '20px',
  width: '380px',
  maxHeight: 'calc(100vh - 100px)',
  overflowY: 'auto',
  background: 'linear-gradient(145deg, #1a1028 0%, #0d0d1a 100%)',
  border: '2px solid rgba(139, 92, 246, 0.4)',
  borderRadius: '16px',
  boxShadow: '0 10px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.2)',
  zIndex: 9999,
  animation: reducedMotion ? 'none' : `${fadeIn} 0.3s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #8b5cf6, #d4af37, #8b5cf6)',
    borderRadius: '16px 16px 0 0',
  },
}));

const PanelHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px',
  borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
});

const PanelTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#d4af37',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  letterSpacing: '0.05em',
});

const PanelContent = styled(Box)({
  padding: '20px',
});

const SettingSection = styled(Box)({
  marginBottom: '24px',
});

const SectionTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#a78bfa',
  marginBottom: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
});

const ToggleRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  background: 'rgba(26, 16, 40, 0.5)',
  borderRadius: '10px',
  marginBottom: '8px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(139, 92, 246, 0.4)',
    background: 'rgba(26, 16, 40, 0.8)',
  },
  '&:focus-within': {
    outline: '2px solid #8b5cf6',
    outlineOffset: '2px',
  },
});

const ToggleLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const IconWrapper = styled(Box)<{ color?: string }>(({ color = '#8b5cf6' }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: `${color}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ToggleButton = styled('button')<{ active: boolean }>(({ active }) => ({
  width: '56px',
  height: '30px',
  borderRadius: '15px',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  background: active
    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    : 'rgba(100, 100, 120, 0.3)',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '3px',
    left: active ? '29px' : '3px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: active ? '#fff' : '#888',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  '&:focus': {
    outline: '2px solid #d4af37',
    outlineOffset: '2px',
  },
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const FontSizeSelector = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginTop: '8px',
});

const FontSizeButton = styled('button')<{ active: boolean }>(({ active }) => ({
  flex: 1,
  padding: '10px 12px',
  borderRadius: '8px',
  border: active ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.3)',
  background: active ? 'rgba(139, 92, 246, 0.2)' : 'rgba(26, 16, 40, 0.5)',
  color: active ? '#d4af37' : '#a0a0a0',
  cursor: 'pointer',
  fontFamily: '"Cinzel", serif',
  fontSize: '0.8rem',
  fontWeight: active ? 600 : 400,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.15)',
  },
  '&:focus': {
    outline: '2px solid #d4af37',
    outlineOffset: '2px',
  },
}));

const ActionButton = styled('button')<{ variant?: 'primary' | 'secondary' }>(({ variant = 'secondary' }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 20px',
  borderRadius: '8px',
  border: variant === 'primary' ? 'none' : '1px solid rgba(139, 92, 246, 0.4)',
  background: variant === 'primary'
    ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    : 'transparent',
  color: variant === 'primary' ? '#fff' : '#a78bfa',
  cursor: 'pointer',
  fontFamily: '"Cinzel", serif',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  flex: variant === 'primary' ? 1 : 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'primary'
      ? '0 5px 20px rgba(139, 92, 246, 0.4)'
      : '0 5px 15px rgba(139, 92, 246, 0.2)',
  },
  '&:focus': {
    outline: '2px solid #d4af37',
    outlineOffset: '2px',
  },
}));

const CloseButton = styled(IconButton)({
  color: '#888',
  '&:hover': {
    color: '#d4af37',
    background: 'rgba(212, 175, 55, 0.1)',
  },
  '&:focus': {
    outline: '2px solid #d4af37',
    outlineOffset: '2px',
  },
});

const FloatingTrigger = styled('button')<{ reducedMotion: boolean }>(({ reducedMotion }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  border: '2px solid rgba(139, 92, 246, 0.5)',
  background: 'linear-gradient(145deg, #1a1028 0%, #2d1f42 100%)',
  color: '#d4af37',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  zIndex: 9998,
  transition: 'all 0.3s ease',
  animation: reducedMotion ? 'none' : `${pulse} 3s ease-in-out infinite`,
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: '#d4af37',
  },
  '&:focus': {
    outline: '3px solid #d4af37',
    outlineOffset: '3px',
  },
}));

// Screen Reader Announcer (visually hidden)
const LiveRegion = styled('div')({
  position: 'absolute',
  left: '-10000px',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
});

const ShortcutHint = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 16px',
  background: 'rgba(26, 16, 40, 0.5)',
  borderRadius: '8px',
  marginTop: '16px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const KeyboardShortcut = styled('kbd')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 8px',
  margin: '0 4px',
  borderRadius: '4px',
  background: 'rgba(139, 92, 246, 0.2)',
  border: '1px solid rgba(139, 92, 246, 0.4)',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  color: '#d4af37',
});

// ============================================================================
// Context
// ============================================================================

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// ============================================================================
// Accessibility Panel Component
// ============================================================================

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
  resetSettings: () => void;
}

const AccessibilityPanelComponent: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
  settings,
  updateSetting,
  toggleSetting,
  resetSettings,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fontSizes: FontSize[] = ['normal', 'large', 'x-large'];

  return (
    <Portal>
      <PanelContainer
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility Settings"
        reducedMotion={settings.reducedMotion}
      >
        <PanelHeader>
          <PanelTitle>
            <Accessibility size={24} />
            Accessibility
          </PanelTitle>
          <CloseButton
            ref={firstFocusableRef}
            onClick={onClose}
            aria-label="Close accessibility panel"
          >
            <X size={20} />
          </CloseButton>
        </PanelHeader>

        <PanelContent>
          {/* Visual Settings */}
          <SettingSection>
            <SectionTitle>Visual</SectionTitle>

            <ToggleRow>
              <ToggleLabel>
                <IconWrapper color="#f97316">
                  <Monitor size={18} color="#f97316" />
                </IconWrapper>
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>High Contrast</Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                    Increase color contrast for better visibility
                  </Typography>
                </Box>
              </ToggleLabel>
              <ToggleButton
                active={settings.highContrast}
                onClick={() => toggleSetting('highContrast')}
                role="switch"
                aria-checked={settings.highContrast}
                aria-label="High contrast mode"
              />
            </ToggleRow>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: '#e0e0e0', fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Type size={16} color="#8b5cf6" />
                Font Size
              </Typography>
              <FontSizeSelector role="radiogroup" aria-label="Font size selection">
                {fontSizes.map((size) => (
                  <FontSizeButton
                    key={size}
                    active={settings.fontSize === size}
                    onClick={() => updateSetting('fontSize', size)}
                    role="radio"
                    aria-checked={settings.fontSize === size}
                  >
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                    <br />
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                      {fontSizeLabels[size].split('(')[1]?.replace(')', '')}
                    </span>
                  </FontSizeButton>
                ))}
              </FontSizeSelector>
            </Box>
          </SettingSection>

          {/* Motion Settings */}
          <SettingSection>
            <SectionTitle>Motion</SectionTitle>

            <ToggleRow>
              <ToggleLabel>
                <IconWrapper color="#ec4899">
                  <Eye size={18} color="#ec4899" />
                </IconWrapper>
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Reduced Motion</Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                    Minimize animations and transitions
                  </Typography>
                </Box>
              </ToggleLabel>
              <ToggleButton
                active={settings.reducedMotion}
                onClick={() => toggleSetting('reducedMotion')}
                role="switch"
                aria-checked={settings.reducedMotion}
                aria-label="Reduced motion"
              />
            </ToggleRow>
          </SettingSection>

          {/* Navigation Settings */}
          <SettingSection>
            <SectionTitle>Navigation</SectionTitle>

            <ToggleRow>
              <ToggleLabel>
                <IconWrapper color="#10b981">
                  <Keyboard size={18} color="#10b981" />
                </IconWrapper>
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Keyboard Navigation</Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                    Enhanced keyboard shortcuts and navigation
                  </Typography>
                </Box>
              </ToggleLabel>
              <ToggleButton
                active={settings.keyboardNavigation}
                onClick={() => toggleSetting('keyboardNavigation')}
                role="switch"
                aria-checked={settings.keyboardNavigation}
                aria-label="Keyboard navigation"
              />
            </ToggleRow>

            <ToggleRow>
              <ToggleLabel>
                <IconWrapper color="#06b6d4">
                  <Focus size={18} color="#06b6d4" />
                </IconWrapper>
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Focus Highlight</Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                    Show visible focus indicators
                  </Typography>
                </Box>
              </ToggleLabel>
              <ToggleButton
                active={settings.focusHighlight}
                onClick={() => toggleSetting('focusHighlight')}
                role="switch"
                aria-checked={settings.focusHighlight}
                aria-label="Focus highlight"
              />
            </ToggleRow>
          </SettingSection>

          {/* Screen Reader Settings */}
          <SettingSection>
            <SectionTitle>Screen Reader</SectionTitle>

            <ToggleRow>
              <ToggleLabel>
                <IconWrapper color="#d4af37">
                  <Volume2 size={18} color="#d4af37" />
                </IconWrapper>
                <Box>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Screen Reader Mode</Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                    Optimize for assistive technology
                  </Typography>
                </Box>
              </ToggleLabel>
              <ToggleButton
                active={settings.screenReaderMode}
                onClick={() => toggleSetting('screenReaderMode')}
                role="switch"
                aria-checked={settings.screenReaderMode}
                aria-label="Screen reader mode"
              />
            </ToggleRow>
          </SettingSection>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <ActionButton
              variant="secondary"
              onClick={resetSettings}
              aria-label="Reset all settings to defaults"
            >
              <RotateCcw size={16} />
              Reset
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={onClose}
              aria-label="Apply and close"
            >
              <Check size={16} />
              Done
            </ActionButton>
          </Box>

          {/* Keyboard Shortcut Hint */}
          <ShortcutHint>
            <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
              Press <KeyboardShortcut>Alt</KeyboardShortcut> + <KeyboardShortcut>A</KeyboardShortcut> to open
            </Typography>
          </ShortcutHint>
        </PanelContent>
      </PanelContainer>
    </Portal>
  );
};

// ============================================================================
// Provider Component
// ============================================================================

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Check system preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...defaultSettings,
            ...parsed,
            reducedMotion: parsed.reducedMotion ?? prefersReducedMotion,
          };
        } catch {
          // Invalid JSON, use defaults
        }
      }
    }

    return {
      ...defaultSettings,
      reducedMotion: prefersReducedMotion,
    };
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<{
    message: string;
    priority: 'polite' | 'assertive';
  } | null>(null);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.style.setProperty('--a11y-font-size', fontSizeValues[settings.fontSize]);
    root.style.setProperty('--a11y-font-scale', settings.fontSize === 'normal' ? '1' : settings.fontSize === 'large' ? '1.25' : '1.5');

    // Toggle classes on body
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    document.body.classList.toggle('focus-visible-enabled', settings.focusHighlight);
    document.body.classList.toggle('keyboard-navigation', settings.keyboardNavigation);
    document.body.classList.toggle('screen-reader-mode', settings.screenReaderMode);

    // Set data attributes for CSS selectors
    document.body.setAttribute('data-font-size', settings.fontSize);
    if (settings.highContrast) {
      document.body.setAttribute('data-high-contrast', 'true');
    } else {
      document.body.removeAttribute('data-high-contrast');
    }
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings((prev) => ({
        ...prev,
        reducedMotion: e.matches,
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Keyboard shortcut (Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsPanelOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSetting = useCallback((key: keyof AccessibilitySettings) => {
    setSettings((prev) => {
      const currentValue = prev[key];
      if (typeof currentValue === 'boolean') {
        return { ...prev, [key]: !currentValue };
      }
      return prev;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSettings({
      ...defaultSettings,
      reducedMotion: prefersReducedMotion,
    });
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);
  const togglePanel = useCallback(() => setIsPanelOpen((prev) => !prev), []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ message, priority });
    // Clear after announcement is read
    setTimeout(() => setAnnouncement(null), 1000);
  }, []);

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    toggleSetting,
    resetSettings,
    isPanelOpen,
    openPanel,
    closePanel,
    togglePanel,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Skip Links */}
      <SkipLink href="#main-content">
        <SkipForward size={16} style={{ marginRight: '8px' }} />
        Skip to main content
      </SkipLink>

      {/* Screen Reader Live Regions */}
      <LiveRegion
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement?.priority === 'polite' ? announcement.message : ''}
      </LiveRegion>
      <LiveRegion
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {announcement?.priority === 'assertive' ? announcement.message : ''}
      </LiveRegion>

      {/* Main Content */}
      {children}

      {/* Floating Trigger Button */}
      <FloatingTrigger
        onClick={togglePanel}
        aria-label="Open accessibility settings"
        aria-expanded={isPanelOpen}
        aria-controls="accessibility-panel"
        reducedMotion={settings.reducedMotion}
      >
        <Accessibility size={24} />
      </FloatingTrigger>

      {/* Accessibility Panel */}
      <AccessibilityPanelComponent
        isOpen={isPanelOpen}
        onClose={closePanel}
        settings={settings}
        updateSetting={updateSetting}
        toggleSetting={toggleSetting}
        resetSettings={resetSettings}
      />

      {/* Global Accessibility Styles */}
      <style>{`
        /* Reduced Motion */
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* High Contrast Mode */
        .high-contrast {
          --bg-primary: #000000;
          --bg-secondary: #1a1a1a;
          --text-primary: #ffffff;
          --text-secondary: #e0e0e0;
          --border-color: #ffffff;
          --accent-color: #ffff00;
        }

        .high-contrast * {
          border-color: var(--border-color) !important;
        }

        .high-contrast a,
        .high-contrast button {
          outline: 2px solid transparent;
        }

        .high-contrast a:focus,
        .high-contrast button:focus {
          outline: 3px solid #ffff00 !important;
          outline-offset: 2px;
        }

        /* Focus Highlight */
        .focus-visible-enabled *:focus {
          outline: 3px solid #8b5cf6 !important;
          outline-offset: 2px;
        }

        .focus-visible-enabled *:focus:not(:focus-visible) {
          outline: none !important;
        }

        .focus-visible-enabled *:focus-visible {
          outline: 3px solid #8b5cf6 !important;
          outline-offset: 2px;
        }

        /* Keyboard Navigation Visual Cues */
        .keyboard-navigation [tabindex]:focus,
        .keyboard-navigation button:focus,
        .keyboard-navigation a:focus,
        .keyboard-navigation input:focus,
        .keyboard-navigation select:focus,
        .keyboard-navigation textarea:focus {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.5);
        }

        /* Font Size Scaling */
        [data-font-size="large"] {
          font-size: 125%;
        }

        [data-font-size="x-large"] {
          font-size: 150%;
        }

        /* Screen Reader Optimizations */
        .screen-reader-mode .decorative-only {
          display: none !important;
        }

        .screen-reader-mode img:not([alt]) {
          outline: 3px solid red;
        }

        /* ARIA Landmarks */
        #main-content:focus {
          outline: none;
        }

        /* High Contrast Mode Overrides */
        [data-high-contrast="true"] {
          filter: contrast(1.2);
        }

        [data-high-contrast="true"] img {
          filter: contrast(1);
        }

        /* Large Click Targets (minimum 44x44px) */
        .keyboard-navigation button,
        .keyboard-navigation a,
        .keyboard-navigation [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }

        /* Skip link styles already defined in styled component */
      `}</style>
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
