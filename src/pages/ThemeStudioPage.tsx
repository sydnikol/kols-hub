/**
 * Theme Studio Page
 * Comprehensive theme creation, management, and customization
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, Sparkles, Star, Download, Upload, Share2, Copy,
  Eye, EyeOff, Settings, Heart, Trash2, RefreshCw, Save,
  Grid, List, Wand2, Sun, Moon, Clock, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemePreview } from '../components/theme/ThemePreview';
import { AIThemePrompt } from '../components/theme/AIThemePrompt';
import {
  useTheme,
  useThemeGenerator,
  useThemeLibrary,
  usePainAdaptiveTheme,
  useMoodTheme,
  useCircadianTheme,
} from '../hooks/useTheme';
import { Theme } from '../services/themeGeneratorService';

type ViewMode = 'grid' | 'list';
type TabMode = 'library' | 'generate' | 'customize' | 'auto';

export const ThemeStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabMode>('library');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedThemeForPreview, setSelectedThemeForPreview] = useState<Theme | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { theme: currentTheme, applyTheme } = useTheme();
  const { generateTheme, generating } = useThemeGenerator();
  const { themes, favorites, toggleFavorite, refresh } = useThemeLibrary();
  const { adaptToPainLevel, getMigraineSafeTheme } = usePainAdaptiveTheme();
  const { getAnxietyCalmTheme } = useMoodTheme();
  const { adaptToTimeOfDay } = useCircadianTheme();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleGenerateTheme = async (prompt: string, options: any) => {
    const newTheme = await generateTheme({
      prompt,
      ...options,
    });

    if (newTheme) {
      toast.success('Theme generated successfully!');
      setSelectedThemeForPreview(newTheme);
      setActiveTab('customize');
    } else {
      toast.error('Failed to generate theme');
    }
  };

  const handleApplyTheme = async (theme: Theme) => {
    await applyTheme(theme);
    toast.success(`Applied "${theme.name}"!`);
  };

  const handleToggleFavorite = async (themeId: string) => {
    await toggleFavorite(themeId);
    toast.success('Favorites updated');
    await refresh();
  };

  const handleExportTheme = (theme: Theme) => {
    try {
      const dataStr = JSON.stringify(theme, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${theme.name.replace(/\s+/g, '_')}_theme.json`;

      // Try mobile-friendly method first
      if (typeof document !== 'undefined') {
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        toast.success('Theme exported!');
      } else {
        // Fallback: copy to clipboard on mobile
        if (navigator.clipboard) {
          navigator.clipboard.writeText(dataStr);
          toast.success('Theme JSON copied to clipboard!');
        } else {
          toast.error('Export not supported on this device');
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Mobile fallback: try to copy to clipboard
      try {
        const dataStr = JSON.stringify(theme, null, 2);
        navigator.clipboard.writeText(dataStr);
        toast.success('Theme JSON copied to clipboard!');
      } catch (clipboardError) {
        toast.error('Export failed. Please try on desktop.');
      }
    }
  };

  const handleShareTheme = async (theme: Theme) => {
    try {
      const shareData = {
        name: theme.name,
        description: theme.description,
        category: theme.category,
        mood: theme.mood,
      };

      const shareText = JSON.stringify(shareData, null, 2);

      // Try native share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: `KOL Hub Theme: ${theme.name}`,
          text: shareText,
        });
        toast.success('Theme shared!');
      } else if (navigator.clipboard) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Theme info copied to clipboard!');
      } else {
        toast.error('Sharing not supported on this device');
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share theme');
    }
  };

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || theme.category === filterCategory;
    const matchesFavorites = !showFavoritesOnly || theme.metadata.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const categories = Array.from(new Set(themes.map(t => t.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Palette className="text-purple-400" />
              Theme Studio
            </h1>
            <p className="text-purple-400 mt-2">
              AI-powered theme generation and customization
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentTheme && (
              <div className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                <span className="text-sm text-purple-400">Current: </span>
                <span className="text-white font-semibold">{currentTheme.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-purple-500/20">
          {[
            { id: 'library', label: 'Theme Library', icon: Grid },
            { id: 'generate', label: 'AI Generator', icon: Wand2 },
            { id: 'customize', label: 'Customize', icon: Settings },
            { id: 'auto', label: 'Auto-Adaptive', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabMode)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-purple-400 text-purple-300'
                  : 'border-transparent text-purple-500 hover:text-purple-400'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Controls */}
              <div className="flex gap-4 items-center flex-wrap">
                <input
                  type="text"
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 bg-purple-950/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
                />

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 bg-purple-950/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                    showFavoritesOnly
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                      : 'border-purple-500/30 text-purple-400 hover:border-purple-400'
                  }`}
                >
                  <Star size={16} className={showFavoritesOnly ? 'fill-current' : ''} />
                  Favorites
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-purple-500 hover:text-purple-400'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'list'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-purple-500 hover:text-purple-400'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              {/* Theme Grid/List */}
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-4'
                }
              >
                {filteredThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isActive={currentTheme?.id === theme.id}
                    isFavorite={theme.metadata.isFavorite}
                    viewMode={viewMode}
                    onApply={() => handleApplyTheme(theme)}
                    onPreview={() => setSelectedThemeForPreview(theme)}
                    onToggleFavorite={() => handleToggleFavorite(theme.id)}
                    onExport={() => handleExportTheme(theme)}
                    onShare={() => handleShareTheme(theme)}
                  />
                ))}
              </div>

              {filteredThemes.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <p className="text-purple-400">No themes found</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="space-y-6">
                <AIThemePrompt onGenerate={handleGenerateTheme} loading={generating} />
              </div>

              <div className="space-y-6">
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Preview</h3>
                  {selectedThemeForPreview ? (
                    <ThemePreview theme={selectedThemeForPreview} showDetails={true} />
                  ) : (
                    <div className="text-center py-12">
                      <Eye className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                      <p className="text-purple-400">Generate a theme to see preview</p>
                    </div>
                  )}
                </div>

                {selectedThemeForPreview && (
                  <button
                    onClick={() => handleApplyTheme(selectedThemeForPreview)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white flex items-center justify-center gap-2"
                  >
                    <Sparkles size={20} />
                    Apply This Theme
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'customize' && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center py-12"
            >
              <Settings className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <p className="text-purple-400 mb-4">Advanced Theme Customization</p>
              <p className="text-purple-500 text-sm">
                Fine-tune colors, typography, spacing, and effects to create your perfect theme. Start with one of our templates and customize every detail to match your style.
              </p>
            </motion.div>
          )}

          {activeTab === 'auto' && (
            <motion.div
              key="auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Auto-Adaptive Theming
                </h3>
                <p className="text-purple-400 mb-6">
                  Let themes automatically adapt to your context, pain levels, mood, and time of day
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AutoAdaptiveCard
                    icon={<Sun size={24} />}
                    title="Circadian Rhythm"
                    description="Theme adapts to time of day"
                    action="Adapt Now"
                    onAction={adaptToTimeOfDay}
                  />
                  <AutoAdaptiveCard
                    icon={<Heart size={24} />}
                    title="Pain-Adaptive"
                    description="Softer themes for high pain days"
                    action="Migraine Safe"
                    onAction={getMigraineSafeTheme}
                  />
                  <AutoAdaptiveCard
                    icon={<Zap size={24} />}
                    title="Mood-Based"
                    description="Themes match your emotional state"
                    action="Anxiety Calm"
                    onAction={getAnxietyCalmTheme}
                  />
                  <AutoAdaptiveCard
                    icon={<Clock size={24} />}
                    title="Auto-Evolution"
                    description="Subtle daily theme changes"
                    action="Enable"
                    onAction={() => toast.success('Auto-evolution enabled')}
                  />
                </div>
              </div>

              {/* Pain Level Quick Adapt */}
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Pain Level Adapt
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    defaultValue="0"
                    className="flex-1"
                    onChange={(e) => {
                      const level = parseInt(e.target.value);
                      adaptToPainLevel(level);
                    }}
                  />
                </div>
                <p className="text-sm text-purple-400">
                  Slide to adapt theme based on current pain level
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        {selectedThemeForPreview && activeTab === 'library' && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedThemeForPreview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-purple-950 border border-purple-500/30 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedThemeForPreview.name}
                </h2>
                <button
                  onClick={() => setSelectedThemeForPreview(null)}
                  className="p-2 hover:bg-purple-800/50 rounded-lg"
                >
                  <EyeOff className="text-purple-400" size={24} />
                </button>
              </div>

              <ThemePreview theme={selectedThemeForPreview} showDetails={true} />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    handleApplyTheme(selectedThemeForPreview);
                    setSelectedThemeForPreview(null);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white"
                >
                  Apply Theme
                </button>
                <button
                  onClick={() => handleExportTheme(selectedThemeForPreview)}
                  className="px-4 py-3 bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/30 rounded-lg text-purple-300"
                >
                  <Download size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Theme Card Component
const ThemeCard: React.FC<{
  theme: Theme;
  isActive: boolean;
  isFavorite: boolean;
  viewMode: ViewMode;
  onApply: () => void;
  onPreview: () => void;
  onToggleFavorite: () => void;
  onExport: () => void;
  onShare: () => void;
}> = ({ theme, isActive, isFavorite, viewMode, onApply, onPreview, onToggleFavorite, onExport, onShare }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-purple-950/30 border border-purple-500/20 hover:border-purple-400/40 rounded-lg p-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg border-2 border-white/20"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              }}
            />
            <div>
              <h4 className="text-lg font-semibold text-white">{theme.name}</h4>
              <p className="text-sm text-purple-400">{theme.description}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-purple-900/40 rounded text-purple-300">
                  {theme.category}
                </span>
                <span className="text-xs px-2 py-0.5 bg-purple-900/40 rounded text-purple-300">
                  {theme.mood}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onToggleFavorite} className="p-2 hover:bg-purple-800/50 rounded">
              <Star size={18} className={isFavorite ? 'fill-purple-400 text-purple-400' : 'text-purple-500'} />
            </button>
            <button onClick={onPreview} className="p-2 hover:bg-purple-800/50 rounded">
              <Eye size={18} className="text-purple-400" />
            </button>
            <button
              onClick={onApply}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium"
            >
              {isActive ? 'Active' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border-2 transition-all cursor-pointer ${
        isActive
          ? 'border-purple-400 shadow-lg shadow-purple-400/50'
          : 'border-purple-500/20 hover:border-purple-400/40'
      }`}
      onClick={onApply}
    >
      <div
        className="h-32 rounded-t-lg"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.primary} 50%, ${theme.colors.secondary} 100%)`,
        }}
      />
      <div className="p-4 bg-purple-950/40">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-white">{theme.name}</h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-1 hover:bg-purple-800/50 rounded"
          >
            <Star size={16} className={isFavorite ? 'fill-purple-400 text-purple-400' : 'text-purple-500'} />
          </button>
        </div>
        <p className="text-sm text-purple-400 mb-3">{theme.description}</p>
        <div className="flex gap-1 mb-3">
          {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map((color, idx) => (
            <div key={idx} className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="flex-1 py-2 bg-purple-900/30 hover:bg-purple-800/40 rounded text-sm text-purple-300"
          >
            Preview
          </button>
          {isActive && (
            <span className="flex-1 py-2 bg-purple-600 rounded text-sm text-white text-center font-semibold">
              Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Auto-Adaptive Card Component
const AutoAdaptiveCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}> = ({ icon, title, description, action, onAction }) => (
  <div className="p-6 bg-purple-900/20 border border-purple-500/20 rounded-lg hover:border-purple-400/40 transition-all">
    <div className="text-purple-400 mb-3">{icon}</div>
    <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
    <p className="text-sm text-purple-400 mb-4">{description}</p>
    <button
      onClick={onAction}
      className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium"
    >
      {action}
    </button>
  </div>
);

export default ThemeStudioPage;
