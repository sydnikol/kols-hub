import React, { useState, useEffect } from 'react';
import { Eye, Type, Zap, Volume2, MousePointer, Keyboard, Moon, Sun, Check, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface AccessibilityPreferences {
  // Visual
  textSize: 'small' | 'medium' | 'large' | 'x-large';
  fontFamily: 'default' | 'dyslexia' | 'mono' | 'sans-serif';
  highContrast: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';

  // Interaction
  touchTargetSize: 'default' | 'large' | 'x-large';
  keyboardNavigation: boolean;
  focusIndicators: 'default' | 'enhanced' | 'high-visibility';
  clickDelay: number; // ms, helps prevent accidental clicks

  // Content
  autoPlay: boolean;
  showAnimations: boolean;
  simplifiedUI: boolean;

  // Audio/Reading
  screenReaderOptimized: boolean;
  readAloud: boolean;
  captionsEnabled: boolean;
  soundEffects: boolean;

  // Cognitive Support
  numberAsDigits: boolean; // Show "5" instead of "five"
  useIcons: boolean; // Show icons alongside text
  showTooltips: boolean;
  reminderSounds: boolean;
}

const defaultPreferences: AccessibilityPreferences = {
  textSize: 'medium',
  fontFamily: 'default',
  highContrast: false,
  darkMode: true,
  reducedMotion: false,
  colorBlindMode: 'none',
  touchTargetSize: 'default',
  keyboardNavigation: true,
  focusIndicators: 'default',
  clickDelay: 0,
  autoPlay: false,
  showAnimations: true,
  simplifiedUI: false,
  screenReaderOptimized: false,
  readAloud: false,
  captionsEnabled: false,
  soundEffects: true,
  numberAsDigits: false,
  useIcons: true,
  showTooltips: true,
  reminderSounds: true,
};

const AccessibilitySettings: React.FC = () => {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(defaultPreferences);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem('accessibility_preferences');
    if (saved) {
      setPrefs(JSON.parse(saved));
    }
  };

  const savePreferences = () => {
    localStorage.setItem('accessibility_preferences', JSON.stringify(prefs));
    applyPreferences(prefs);
    setUnsavedChanges(false);
    toast.success('Accessibility preferences saved');
  };

  const applyPreferences = (preferences: AccessibilityPreferences) => {
    const root = document.documentElement;

    // Text size
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'x-large': '20px',
    };
    root.style.fontSize = sizeMap[preferences.textSize];

    // Font family
    const fontMap = {
      default: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      dyslexia: "'OpenDyslexic', 'Comic Sans MS', sans-serif",
      mono: "'Courier New', Courier, monospace",
      'sans-serif': "'Arial', 'Helvetica', sans-serif",
    };
    root.style.fontFamily = fontMap[preferences.fontFamily];

    // High contrast
    if (preferences.highContrast) {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--border-color', '#FFFFFF');
    } else {
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--border-color');
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Dark mode
    if (preferences.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Color blind mode filter
    const filterMap = {
      none: 'none',
      protanopia: 'url(#protanopia-filter)',
      deuteranopia: 'url(#deuteranopia-filter)',
      tritanopia: 'url(#tritanopia-filter)',
      monochrome: 'grayscale(100%)',
    };
    root.style.filter = filterMap[preferences.colorBlindMode];
  };

  const updatePref = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPrefs({ ...prefs, [key]: value });
    setUnsavedChanges(true);
  };

  const resetToDefaults = () => {
    if (confirm('Reset all accessibility settings to defaults?')) {
      setPrefs(defaultPreferences);
      setUnsavedChanges(true);
      toast.success('Reset to defaults');
    }
  };

  const previewChanges = () => {
    applyPreferences(prefs);
    toast.success('Preview applied (not saved)');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Accessibility Settings</h2>
        <p className="text-purple-300">Customize the app to meet your needs</p>
      </div>

      {/* Save Bar */}
      {unsavedChanges && (
        <div className="bg-yellow-900/30 border border-yellow-500/50 p-4 rounded-xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-300 font-semibold">You have unsaved changes</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={previewChanges}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
            >
              Preview
            </button>
            <button
              onClick={savePreferences}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Visual Settings */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">Visual Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Text Size */}
            <div>
              <label className="block text-purple-300 mb-3 font-semibold">Text Size</label>
              <div className="grid grid-cols-4 gap-3">
                {(['small', 'medium', 'large', 'x-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updatePref('textSize', size)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      prefs.textSize === size
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                    }`}
                  >
                    {size === 'x-large' ? 'Extra Large' : size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-purple-300 mb-3 font-semibold">Font Style</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'default', label: 'Default' },
                  { value: 'dyslexia', label: 'Dyslexia-Friendly' },
                  { value: 'mono', label: 'Monospace' },
                  { value: 'sans-serif', label: 'Sans-Serif' },
                ] as const).map((font) => (
                  <button
                    key={font.value}
                    onClick={() => updatePref('fontFamily', font.value)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      prefs.fontFamily === font.value
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Blind Mode */}
            <div>
              <label className="block text-purple-300 mb-3 font-semibold">Color Vision Mode</label>
              <select
                value={prefs.colorBlindMode}
                onChange={(e) => updatePref('colorBlindMode', e.target.value as any)}
                className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
              >
                <option value="none">Standard Vision</option>
                <option value="protanopia">Protanopia (Red-Blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                <option value="monochrome">Monochrome</option>
              </select>
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                label="High Contrast Mode"
                checked={prefs.highContrast}
                onChange={(val) => updatePref('highContrast', val)}
              />
              <ToggleSwitch
                label="Dark Mode"
                checked={prefs.darkMode}
                onChange={(val) => updatePref('darkMode', val)}
              />
              <ToggleSwitch
                label="Reduce Motion"
                checked={prefs.reducedMotion}
                onChange={(val) => updatePref('reducedMotion', val)}
              />
              <ToggleSwitch
                label="Show Animations"
                checked={prefs.showAnimations}
                onChange={(val) => updatePref('showAnimations', val)}
              />
            </div>
          </div>
        </div>

        {/* Interaction Settings */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
          <div className="flex items-center gap-3 mb-6">
            <MousePointer className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Interaction Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Touch Target Size */}
            <div>
              <label className="block text-blue-300 mb-3 font-semibold">Button & Touch Target Size</label>
              <div className="grid grid-cols-3 gap-3">
                {(['default', 'large', 'x-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updatePref('touchTargetSize', size)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      prefs.touchTargetSize === size
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                        : 'bg-blue-900/20 text-blue-400 hover:bg-blue-500/20'
                    }`}
                  >
                    {size === 'x-large' ? 'Extra Large' : size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Indicators */}
            <div>
              <label className="block text-blue-300 mb-3 font-semibold">Focus Indicator Style</label>
              <div className="grid grid-cols-3 gap-3">
                {(['default', 'enhanced', 'high-visibility'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => updatePref('focusIndicators', style)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      prefs.focusIndicators === style
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                        : 'bg-blue-900/20 text-blue-400 hover:bg-blue-500/20'
                    }`}
                  >
                    {style.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Click Delay */}
            <div>
              <label className="block text-blue-300 mb-3 font-semibold">
                Click Delay: {prefs.clickDelay}ms {prefs.clickDelay > 0 && '(Prevents Accidental Clicks)'}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={prefs.clickDelay}
                onChange={(e) => updatePref('clickDelay', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-blue-400 mt-1">
                <span>0ms - Instant</span>
                <span>500ms - Moderate</span>
                <span>1000ms - High Protection</span>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                label="Keyboard Navigation"
                checked={prefs.keyboardNavigation}
                onChange={(val) => updatePref('keyboardNavigation', val)}
              />
              <ToggleSwitch
                label="Simplified UI"
                checked={prefs.simplifiedUI}
                onChange={(val) => updatePref('simplifiedUI', val)}
              />
            </div>
          </div>
        </div>

        {/* Content & Media Settings */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl font-bold text-white">Content & Media</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch
              label="Auto-Play Media"
              checked={prefs.autoPlay}
              onChange={(val) => updatePref('autoPlay', val)}
            />
            <ToggleSwitch
              label="Captions/Subtitles"
              checked={prefs.captionsEnabled}
              onChange={(val) => updatePref('captionsEnabled', val)}
            />
            <ToggleSwitch
              label="Sound Effects"
              checked={prefs.soundEffects}
              onChange={(val) => updatePref('soundEffects', val)}
            />
            <ToggleSwitch
              label="Reminder Sounds"
              checked={prefs.reminderSounds}
              onChange={(val) => updatePref('reminderSounds', val)}
            />
          </div>
        </div>

        {/* Screen Reader & Reading Support */}
        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Type className="w-6 h-6 text-orange-400" />
            <h3 className="text-2xl font-bold text-white">Reading & Cognitive Support</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch
              label="Screen Reader Optimized"
              checked={prefs.screenReaderOptimized}
              onChange={(val) => updatePref('screenReaderOptimized', val)}
              description="Adds ARIA labels and semantic HTML"
            />
            <ToggleSwitch
              label="Read Aloud"
              checked={prefs.readAloud}
              onChange={(val) => updatePref('readAloud', val)}
              description="Text-to-speech for content"
            />
            <ToggleSwitch
              label="Show Numbers as Digits"
              checked={prefs.numberAsDigits}
              onChange={(val) => updatePref('numberAsDigits', val)}
              description="Display '5' instead of 'five'"
            />
            <ToggleSwitch
              label="Use Icons"
              checked={prefs.useIcons}
              onChange={(val) => updatePref('useIcons', val)}
              description="Show icons alongside text"
            />
            <ToggleSwitch
              label="Show Tooltips"
              checked={prefs.showTooltips}
              onChange={(val) => updatePref('showTooltips', val)}
              description="Helpful hints on hover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={savePreferences}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all"
          >
            <Check className="w-6 h-6" />
            Save All Settings
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-6 py-4 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 rounded-xl font-semibold transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
          <h4 className="text-lg font-bold text-purple-300 mb-2">About Accessibility</h4>
          <p className="text-purple-400 leading-relaxed">
            These settings help make the app more accessible and comfortable for everyone. Changes are saved
            locally to your device and will persist across sessions. If you have suggestions for additional
            accessibility features, please let us know!
          </p>
        </div>
      </div>
    </div>
  );
};

// Toggle Switch Component
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, description }) => {
  return (
    <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="text-purple-200 font-semibold block">{label}</label>
          {description && <p className="text-sm text-purple-400 mt-1">{description}</p>}
        </div>
        <button
          onClick={() => onChange(!checked)}
          className={`relative w-14 h-8 rounded-full transition-all ${
            checked ? 'bg-purple-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              checked ? 'transform translate-x-6' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
