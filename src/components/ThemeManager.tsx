import React, { useState, useEffect } from 'react';
import gothicThemes from '../data/gothic-themes-100.json';

interface Theme {
  id: number;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  aesthetic: string;
}

export const ThemeManager: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColor, setFilterColor] = useState<string>('all');

  useEffect(() => {
    // Load saved theme and favorites from localStorage
    const saved = localStorage.getItem('kolSelectedTheme');
    const savedFavs = localStorage.getItem('kolFavoriteThemes');
    
    if (saved) {
      setSelectedTheme(JSON.parse(saved));
    } else {
      // Default to "Void Empress"
      setSelectedTheme(gothicThemes.themes[0]);
    }
    
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('kolSelectedTheme', JSON.stringify(theme));
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    document.documentElement.style.setProperty('--color-text', theme.text);
    document.documentElement.style.setProperty('--color-background', theme.background);
  };

  const toggleFavorite = (themeId: number) => {
    const newFavs = favorites.includes(themeId)
      ? favorites.filter(id => id !== themeId)
      : [...favorites, themeId];
    
    setFavorites(newFavs);
    localStorage.setItem('kolFavoriteThemes', JSON.stringify(newFavs));
  };

  const getColorFamily = (theme: Theme): string => {
    const colors = [theme.primary, theme.secondary, theme.accent];
    const avgHue = colors.reduce((sum, color) => {
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 255;
      const g = (rgb >> 8) & 255;
      const b = rgb & 255;
      
      // Simple hue calculation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let hue = 0;
      
      if (max !== min) {
        const delta = max - min;
        if (max === r) {
          hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
          hue = ((b - r) / delta + 2) / 6;
        } else {
          hue = ((r - g) / delta + 4) / 6;
        }
      }
      
      return sum + hue * 360;
    }, 0) / colors.length;

    if (avgHue < 30) return 'red';
    if (avgHue < 60) return 'orange';
    if (avgHue < 90) return 'indigo';
    if (avgHue < 150) return 'green';
    if (avgHue < 210) return 'blue';
    if (avgHue < 270) return 'blue';
    if (avgHue < 330) return 'purple';
    return 'red';
  };

  const filteredThemes = gothicThemes.themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.aesthetic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = filterColor === 'all' || getColorFamily(theme) === filterColor;
    
    return matchesSearch && matchesColor;
  });

  const favoriteThemes = gothicThemes.themes.filter(theme => favorites.includes(theme.id));

  return (
    <div className="theme-manager p-6 bg-gradient-to-br from-purple-950 via-black to-indigo-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-300 mb-2">🎨 Theme Sanctuary</h1>
          <p className="text-purple-400">100 Gothic Futurist Themes for Your KOL Experience</p>
        </div>

        {/* Current Theme Display */}
        {selectedTheme && (
          <div 
            className="current-theme p-6 rounded-lg mb-8 border-2 border-purple-500"
            style={{
              background: `linear-gradient(135deg, ${selectedTheme.background} 0%, ${selectedTheme.primary} 100%)`
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: selectedTheme.text }}>
              Currently Active: {selectedTheme.name}
            </h2>
            <p className="mb-4" style={{ color: selectedTheme.text }}>
              {selectedTheme.aesthetic}
            </p>
            <div className="flex gap-4">
              <div className="flex gap-2">
                {[selectedTheme.primary, selectedTheme.secondary, selectedTheme.accent, selectedTheme.text, selectedTheme.background].map((color, idx) => (
                  <div 
                    key={idx}
                    className="w-12 h-12 rounded border-2 border-white"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 bg-purple-950 border border-purple-500 rounded text-purple-100 placeholder-purple-400"
          />
          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            className="px-4 py-2 bg-purple-950 border border-purple-500 rounded text-purple-100"
          >
            <option value="all">All Colors</option>
            <option value="red">Red Family</option>
            <option value="orange">Orange Family</option>
            <option value="indigo">Yellow Family</option>
            <option value="green">Green Family</option>
            <option value="blue">Cyan Family</option>
            <option value="blue">Blue Family</option>
            <option value="purple">Purple Family</option>
          </select>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-purple-300 mb-4">⭐ Your Favorites</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoriteThemes.map(theme => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme?.id === theme.id}
                  isFavorite={true}
                  onApply={applyTheme}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Themes Grid */}
        <div>
          <h3 className="text-2xl font-bold text-purple-300 mb-4">
            All Themes ({filteredThemes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme?.id === theme.id}
                isFavorite={favorites.includes(theme.id)}
                onApply={applyTheme}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  isFavorite: boolean;
  onApply: (theme: Theme) => void;
  onToggleFavorite: (themeId: number) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, isFavorite, onApply, onToggleFavorite }) => {
  return (
    <div 
      className={`theme-card p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected ? 'border-indigo-400 shadow-lg shadow-indigo-400/50' : 'border-purple-700 hover:border-purple-400'
      }`}
      style={{
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.primary} 50%, ${theme.secondary} 100%)`
      }}
      onClick={() => onApply(theme)}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-bold" style={{ color: theme.text }}>
          {theme.name}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(theme.id);
          }}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>
      <p className="text-sm mb-3" style={{ color: theme.text, opacity: 0.9 }}>
        {theme.aesthetic}
      </p>
      <div className="flex gap-1">
        {[theme.primary, theme.secondary, theme.accent, theme.text, theme.background].map((color, idx) => (
          <div 
            key={idx}
            className="w-8 h-8 rounded"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {isSelected && (
        <div className="mt-3 text-center py-1 bg-indigo-400 text-black rounded font-bold text-sm">
          ACTIVE
        </div>
      )}
    </div>
  );
};

export default ThemeManager;
