import React, { useState, useEffect, useMemo } from 'react';
import {
  Palette, Sparkles, Moon, Sun, Snowflake, Leaf, Flower2, CloudSun,
  Heart, Crown, Ghost, Skull, Star, BookOpen, Wand2, Castle,
  Music, Coffee, Wine, Flame, Droplets, Wind, Search, Filter,
  ChevronDown, ChevronUp, Check, RefreshCw, Save, Download, Upload,
  Calendar, Clock, Shuffle, Grid, List, Eye, EyeOff, Copy, Share2,
  Zap, Layers, SlidersHorizontal, Paintbrush, Home, X
} from 'lucide-react';
import {
  GOTHIC_THEMES,
  THEME_CATEGORIES,
  GothicTheme,
  ThemeCategory,
  getThemesByCategory,
  getHolidayThemes,
  getSeasonalThemes,
  getRandomTheme,
  searchThemes
} from '../data/gothic-apartment-themes';

interface GothicThemeGeneratorProps {
  onThemeSelect: (theme: GothicTheme) => void;
  currentTheme?: GothicTheme;
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<ThemeCategory, React.ReactNode> = {
  'classic-gothic': <Castle className="w-4 h-4" />,
  'victorian': <Crown className="w-4 h-4" />,
  'romantic-gothic': <Heart className="w-4 h-4" />,
  'dark-academia': <BookOpen className="w-4 h-4" />,
  'witchy': <Wand2 className="w-4 h-4" />,
  'vampire': <Skull className="w-4 h-4" />,
  'celestial': <Star className="w-4 h-4" />,
  'nature-gothic': <Leaf className="w-4 h-4" />,
  'royal': <Crown className="w-4 h-4" />,
  'holiday': <Calendar className="w-4 h-4" />,
  'seasonal': <Sun className="w-4 h-4" />,
  'mystical': <Sparkles className="w-4 h-4" />,
  'steampunk': <Zap className="w-4 h-4" />,
  'art-nouveau': <Paintbrush className="w-4 h-4" />,
  'baroque': <Layers className="w-4 h-4" />
};

const seasonIcons = {
  spring: <Flower2 className="w-4 h-4" />,
  summer: <Sun className="w-4 h-4" />,
  autumn: <Leaf className="w-4 h-4" />,
  winter: <Snowflake className="w-4 h-4" />
};

export default function GothicThemeGenerator({
  onThemeSelect,
  currentTheme,
  isOpen,
  onClose
}: GothicThemeGeneratorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const [selectedSeason, setSelectedSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter' | 'all'>('all');
  const [showHolidaysOnly, setShowHolidaysOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewTheme, setPreviewTheme] = useState<GothicTheme | null>(null);
  const [savedThemes, setSavedThemes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'season'>('name');

  // Load saved themes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gothicSavedThemes');
    if (saved) {
      setSavedThemes(JSON.parse(saved));
    }
  }, []);

  // Filter and sort themes
  const filteredThemes = useMemo(() => {
    let themes = [...GOTHIC_THEMES];

    // Search filter
    if (searchQuery) {
      themes = searchThemes(searchQuery);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      themes = themes.filter(t => t.category === selectedCategory);
    }

    // Season filter
    if (selectedSeason !== 'all') {
      themes = themes.filter(t => t.season === selectedSeason || t.season === 'all');
    }

    // Holiday filter
    if (showHolidaysOnly) {
      themes = themes.filter(t => t.isHoliday);
    }

    // Sort
    themes.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'season') return (a.season || 'all').localeCompare(b.season || 'all');
      return 0;
    });

    return themes;
  }, [searchQuery, selectedCategory, selectedSeason, showHolidaysOnly, sortBy]);

  const handleRandomTheme = () => {
    const randomTheme = filteredThemes[Math.floor(Math.random() * filteredThemes.length)] || getRandomTheme();
    setPreviewTheme(randomTheme);
  };

  const handleSaveTheme = (themeId: string) => {
    const newSaved = savedThemes.includes(themeId)
      ? savedThemes.filter(id => id !== themeId)
      : [...savedThemes, themeId];
    setSavedThemes(newSaved);
    localStorage.setItem('gothicSavedThemes', JSON.stringify(newSaved));
  };

  const handleApplyTheme = (theme: GothicTheme) => {
    onThemeSelect(theme);
    setPreviewTheme(null);
  };

  const exportTheme = (theme: GothicTheme) => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `gothic-theme-${theme.id}.json`);
    link.click();
  };

  const copyThemeCSS = (theme: GothicTheme) => {
    const css = `:root {
  --gothic-primary: ${theme.colors.primary};
  --gothic-secondary: ${theme.colors.secondary};
  --gothic-accent: ${theme.colors.accent};
  --gothic-background: ${theme.colors.background};
  --gothic-surface: ${theme.colors.surface};
  --gothic-text: ${theme.colors.text};
  --gothic-text-muted: ${theme.colors.textMuted};
  --gothic-glow: ${theme.colors.glow};
}`;
    navigator.clipboard.writeText(css);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-900/50 rounded-xl">
                <Palette className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Gothic Theme Generator</h1>
                <p className="text-gray-400">{GOTHIC_THEMES.length} Luxurious Gothic Themes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Current Theme Preview */}
          {(previewTheme || currentTheme) && (
            <div
              className="mb-6 p-6 rounded-2xl border-2 transition-all duration-500"
              style={{
                backgroundColor: (previewTheme || currentTheme)?.colors.background,
                borderColor: (previewTheme || currentTheme)?.colors.accent
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: (previewTheme || currentTheme)?.colors.text }}
                  >
                    {(previewTheme || currentTheme)?.name}
                  </h2>
                  <p
                    className="mb-4"
                    style={{ color: (previewTheme || currentTheme)?.colors.textMuted }}
                  >
                    {(previewTheme || currentTheme)?.description}
                  </p>

                  {/* Color Palette */}
                  <div className="flex gap-2 mb-4">
                    {Object.entries((previewTheme || currentTheme)?.colors || {}).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={`${key}: ${color}`}
                      />
                    ))}
                  </div>

                  {/* Ambiance Info */}
                  <div className="flex flex-wrap gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: (previewTheme || currentTheme)?.colors.surface,
                        color: (previewTheme || currentTheme)?.colors.accent
                      }}
                    >
                      {(previewTheme || currentTheme)?.ambiance.lighting}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: (previewTheme || currentTheme)?.colors.surface,
                        color: (previewTheme || currentTheme)?.colors.accent
                      }}
                    >
                      {(previewTheme || currentTheme)?.ambiance.mood}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: (previewTheme || currentTheme)?.colors.surface,
                        color: (previewTheme || currentTheme)?.colors.accent
                      }}
                    >
                      {(previewTheme || currentTheme)?.ambiance.scent}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {previewTheme && (
                    <button
                      onClick={() => handleApplyTheme(previewTheme)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Apply
                    </button>
                  )}
                  <button
                    onClick={() => copyThemeCSS(previewTheme || currentTheme!)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copy CSS Variables"
                  >
                    <Copy className="w-5 h-5 text-gray-300" />
                  </button>
                  <button
                    onClick={() => exportTheme(previewTheme || currentTheme!)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Export Theme"
                  >
                    <Download className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Quick Actions */}
              <button
                onClick={handleRandomTheme}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Random
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* View Mode */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                >
                  <Grid className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                >
                  <List className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as ThemeCategory | 'all')}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">All Categories</option>
                      {Object.entries(THEME_CATEGORIES).map(([key, { name }]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Season Filter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Season</label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">All Seasons</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                      <option value="autumn">Autumn</option>
                      <option value="winter">Winter</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="name">Name</option>
                      <option value="category">Category</option>
                      <option value="season">Season</option>
                    </select>
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="mt-4 flex gap-4">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHolidaysOnly}
                      onChange={(e) => setShowHolidaysOnly(e.target.checked)}
                      className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    Holiday Themes Only
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Category Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All ({GOTHIC_THEMES.length})
            </button>
            {Object.entries(THEME_CATEGORIES).map(([key, { name, icon }]) => {
              const count = GOTHIC_THEMES.filter(t => t.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as ThemeCategory)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    selectedCategory === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {categoryIcons[key as ThemeCategory]}
                  {name} ({count})
                </button>
              );
            })}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-gray-400">
            Showing {filteredThemes.length} of {GOTHIC_THEMES.length} themes
          </div>

          {/* Theme Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme?.id === theme.id}
                  isSaved={savedThemes.includes(theme.id)}
                  onSelect={() => setPreviewTheme(theme)}
                  onApply={() => handleApplyTheme(theme)}
                  onSave={() => handleSaveTheme(theme.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredThemes.map((theme) => (
                <ThemeListItem
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme?.id === theme.id}
                  isSaved={savedThemes.includes(theme.id)}
                  onSelect={() => setPreviewTheme(theme)}
                  onApply={() => handleApplyTheme(theme)}
                  onSave={() => handleSaveTheme(theme.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Theme Card Component
function ThemeCard({
  theme,
  isSelected,
  isSaved,
  onSelect,
  onApply,
  onSave
}: {
  theme: GothicTheme;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onApply: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group ${
        isSelected ? 'ring-2 ring-purple-500' : 'hover:ring-1 hover:ring-purple-500/50'
      }`}
      style={{ backgroundColor: theme.colors.background }}
      onClick={onSelect}
    >
      {/* Color Preview Bar */}
      <div className="h-2 flex">
        <div className="flex-1" style={{ backgroundColor: theme.colors.primary }} />
        <div className="flex-1" style={{ backgroundColor: theme.colors.secondary }} />
        <div className="flex-1" style={{ backgroundColor: theme.colors.accent }} />
        <div className="flex-1" style={{ backgroundColor: theme.colors.glow }} />
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3
              className="font-bold text-lg"
              style={{ color: theme.colors.text }}
            >
              {theme.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.accent
                }}
              >
                {THEME_CATEGORIES[theme.category].icon} {THEME_CATEGORIES[theme.category].name}
              </span>
              {theme.isHoliday && (
                <span className="text-xs px-2 py-0.5 rounded bg-orange-900/50 text-orange-400">
                  Holiday
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={`p-1.5 rounded transition-colors ${
              isSaved ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <p
          className="text-sm line-clamp-2 mb-3"
          style={{ color: theme.colors.textMuted }}
        >
          {theme.description}
        </p>

        {/* Ambiance Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.textMuted
            }}
          >
            {theme.ambiance.lighting}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.textMuted
            }}
          >
            {theme.ambiance.mood}
          </span>
        </div>

        {/* Color Swatches */}
        <div className="flex gap-1 mb-3">
          {[theme.colors.primary, theme.colors.accent, theme.colors.glow].map((color, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-md border border-white/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Apply Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onApply(); }}
          className="w-full py-2 rounded-lg font-medium transition-all opacity-0 group-hover:opacity-100"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.colors.background
          }}
        >
          Apply Theme
        </button>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

// Theme List Item Component
function ThemeListItem({
  theme,
  isSelected,
  isSaved,
  onSelect,
  onApply,
  onSave
}: {
  theme: GothicTheme;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onApply: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-purple-500' : 'hover:ring-1 hover:ring-purple-500/50'
      }`}
      style={{ backgroundColor: theme.colors.background }}
      onClick={onSelect}
    >
      {/* Color Preview */}
      <div className="flex flex-col gap-0.5">
        {[theme.colors.primary, theme.colors.accent, theme.colors.glow].map((color, i) => (
          <div
            key={i}
            className="w-3 h-8 rounded"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className="font-bold truncate"
            style={{ color: theme.colors.text }}
          >
            {theme.name}
          </h3>
          {theme.isHoliday && (
            <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
          )}
        </div>
        <p
          className="text-sm truncate"
          style={{ color: theme.colors.textMuted }}
        >
          {theme.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs"
            style={{ color: theme.colors.accent }}
          >
            {THEME_CATEGORIES[theme.category].name}
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-xs text-gray-500">
            {theme.ambiance.mood}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className={`p-2 rounded transition-colors ${
            isSaved ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onApply(); }}
          className="px-4 py-2 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: theme.colors.accent,
            color: theme.colors.background
          }}
        >
          Apply
        </button>
      </div>

      {isSelected && (
        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
