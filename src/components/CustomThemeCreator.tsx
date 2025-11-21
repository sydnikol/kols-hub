import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Download, Upload, Save, Sparkles, Eye, Copy, Trash2, RefreshCw, Moon, Sun } from 'lucide-react';
import { useKolHubStore } from '../store/kolhub-store';
import toast from 'react-hot-toast';

interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface SavedTheme extends ThemeColors {
  id: string;
  createdAt: string;
  category: 'gothic' | 'cyberpunk' | 'nature' | 'minimal' | 'custom';
}

const DEFAULT_THEME: ThemeColors = {
  name: 'New Theme',
  primary: '#8B5CF6',
  secondary: '#6366F1',
  accent: '#EC4899',
  background: '#0F0A1F',
  surface: '#1A1333',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  border: '#4C1D95',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

const PRESET_THEMES: ThemeColors[] = [
  {
    name: 'Gothic Futurism',
    primary: '#8B5CF6',
    secondary: '#6366F1',
    accent: '#EC4899',
    background: '#0F0A1F',
    surface: '#1A1333',
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    border: '#4C1D95',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  {
    name: 'Neon Dreams',
    primary: '#7f1d1d',
    secondary: '#00FFFF',
    accent: '#7f1d1d',
    background: '#000000',
    surface: '#0A0A0A',
    text: '#7f1d1d',
    textSecondary: '#CCCCCC',
    border: '#7f1d1d',
    success: '#00FF00',
    warning: '#7f1d1d',
    error: '#7f1d1d',
    info: '#00FFFF'
  },
  {
    name: 'Deep Ocean',
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    accent: '#22D3EE',
    background: '#0C1445',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#14B8A6',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  {
    name: 'Forest Witch',
    primary: '#059669',
    secondary: '#10B981',
    accent: '#34D399',
    background: '#1C2E23',
    surface: '#2D3E34',
    text: '#ECFDF5',
    textSecondary: '#A7F3D0',
    border: '#065F46',
    success: '#10B981',
    warning: '#FBBF24',
    error: '#DC2626',
    info: '#3B82F6'
  }
];

export const CustomThemeCreator: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const { settings, updateSettings } = useKolHubStore();

  useEffect(() => {
    loadSavedThemes();
  }, []);

  const loadSavedThemes = async () => {
    try {
      const stored = localStorage.getItem('kol_custom_themes');
      if (stored) {
        setSavedThemes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading themes:', error);
    }
  };

  const saveTheme = () => {
    const newTheme: SavedTheme = {
      ...currentTheme,
      id: `theme_${Date.now()}`,
      createdAt: new Date().toISOString(),
      category: 'custom'
    };

    const updated = [...savedThemes, newTheme];
    setSavedThemes(updated);
    localStorage.setItem('kol_custom_themes', JSON.stringify(updated));
    toast.success(`Theme "${currentTheme.name}" saved!`);
  };

  const deleteTheme = (id: string) => {
    const updated = savedThemes.filter(t => t.id !== id);
    setSavedThemes(updated);
    localStorage.setItem('kol_custom_themes', JSON.stringify(updated));
    toast.success('Theme deleted');
  };

  const applyTheme = (theme: ThemeColors) => {
    // Apply theme to app settings
    // Note: Currently only supports predefined themes
    // Custom themes are stored separately
    if (theme.name === 'Gothic Dark' || theme.name === 'gothic_dark') {
      updateSettings({ theme: 'gothic_dark' });
    } else if (theme.name === 'Clean Witchy Minimal' || theme.name === 'clean_witchy_minimal') {
      updateSettings({ theme: 'clean_witchy_minimal' });
    } else if (theme.name === 'Grayscale Print' || theme.name === 'grayscale_print') {
      updateSettings({ theme: 'grayscale_print' });
    } else {
      // For custom themes, store them in localStorage
      localStorage.setItem('kol_active_custom_theme', JSON.stringify(theme));
    }
    toast.success(`Applied theme: ${theme.name}`);
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(currentTheme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentTheme.name.replace(/\s+/g, '_')}_theme.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Theme exported!');
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setCurrentTheme(imported);
        toast.success('Theme imported!');
      } catch (error) {
        toast.error('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  const randomizeTheme = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setCurrentTheme({
      ...currentTheme,
      name: 'Random Theme',
      primary: randomColor(),
      secondary: randomColor(),
      accent: randomColor()
    });
    toast.success('Random theme generated!');
  };

  const ColorPicker: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
  }> = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 rounded cursor-pointer border-2 border-purple-500"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
          placeholder="#7f1d1d"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Custom Theme Creator</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Theme Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Name */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <input
                type="text"
                value={currentTheme.name}
                onChange={(e) => setCurrentTheme({ ...currentTheme, name: e.target.value })}
                className="w-full text-2xl font-bold bg-transparent border-b border-purple-500/30 pb-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="Theme Name"
              />
            </div>

            {/* Preset Themes */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Preset Themes</h3>
              <div className="grid grid-cols-2 gap-4">
                {PRESET_THEMES.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentTheme(preset);
                      setSelectedPreset(index);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPreset === index
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-purple-500/30 hover:border-purple-500/50'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`
                    }}
                  >
                    <p className="text-white font-semibold">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Pickers */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker
                  label="Primary"
                  value={currentTheme.primary}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, primary: value })}
                />
                <ColorPicker
                  label="Secondary"
                  value={currentTheme.secondary}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, secondary: value })}
                />
                <ColorPicker
                  label="Accent"
                  value={currentTheme.accent}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, accent: value })}
                />
                <ColorPicker
                  label="Background"
                  value={currentTheme.background}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, background: value })}
                />
                <ColorPicker
                  label="Surface"
                  value={currentTheme.surface}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, surface: value })}
                />
                <ColorPicker
                  label="Text"
                  value={currentTheme.text}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, text: value })}
                />
                <ColorPicker
                  label="Success"
                  value={currentTheme.success}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, success: value })}
                />
                <ColorPicker
                  label="Error"
                  value={currentTheme.error}
                  onChange={(value) => setCurrentTheme({ ...currentTheme, error: value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={saveTheme}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={exportTheme}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <label className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={randomizeTheme}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Saved Themes */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
              <div
                className="rounded-lg p-6 space-y-4"
                style={{ backgroundColor: currentTheme.background }}
              >
                <div
                  className="p-4 rounded"
                  style={{ backgroundColor: currentTheme.surface }}
                >
                  <h4 style={{ color: currentTheme.text }} className="font-bold mb-2">
                    Sample Card
                  </h4>
                  <p style={{ color: currentTheme.textSecondary }} className="text-sm">
                    This is how your theme will look
                  </p>
                </div>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                  <div
                    className="w-12 h-12 rounded"
                    style={{ backgroundColor: currentTheme.secondary }}
                  />
                  <div
                    className="w-12 h-12 rounded"
                    style={{ backgroundColor: currentTheme.accent }}
                  />
                </div>
                <button
                  onClick={() => applyTheme(currentTheme)}
                  className="w-full py-2 rounded font-semibold"
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.text
                  }}
                >
                  Apply Theme
                </button>
              </div>
            </div>

            {/* Saved Themes */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Saved Themes</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedThemes.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">
                    No saved themes yet
                  </p>
                ) : (
                  savedThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="p-4 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{theme.name}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentTheme(theme)}
                            className="p-1 hover:bg-purple-500/20 rounded"
                          >
                            <Copy className="w-4 h-4 text-purple-400" />
                          </button>
                          <button
                            onClick={() => applyTheme(theme)}
                            className="p-1 hover:bg-green-500/20 rounded"
                          >
                            <Sparkles className="w-4 h-4 text-green-400" />
                          </button>
                          <button
                            onClick={() => deleteTheme(theme.id)}
                            className="p-1 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: theme.secondary }}
                        />
                        <div
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
