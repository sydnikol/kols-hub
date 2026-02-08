/**
 * LIBRE RESOURCES HUB
 * ===================
 * Comprehensive hub for all free, open-source, and public domain resources
 * Embedded directly with iframes, APIs, and interactive components
 */

import React, { useState, useEffect } from 'react';
import {
  Book, Music, Image, Film, Gamepad2, GraduationCap, Code, Database,
  Search, ExternalLink, Download, Play, Bookmark, Star, Filter,
  Library, Palette, Globe, FileText, Mic, Camera, Map, ChefHat,
  Dice6, Sword, Crown, Heart, Sparkles, Layers, Box, Terminal
} from 'lucide-react';

import LIBRE_RESOURCES from '../data/libre-resources-complete';

// ============================================
// TYPES
// ============================================
interface ResourceCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface EmbeddedResource {
  name: string;
  url: string;
  embedUrl?: string;
  description: string;
  embedType: 'iframe' | 'api' | 'link' | 'component';
  license: string;
}

// ============================================
// CATEGORIES
// ============================================
const CATEGORIES: ResourceCategory[] = [
  { id: 'literature', name: 'Literature & eBooks', icon: Book, color: '#8b5cf6', description: 'Books, papers, and texts' },
  { id: 'audio', name: 'Audio & Music', icon: Music, color: '#ec4899', description: 'Audiobooks, music, sounds' },
  { id: 'images', name: 'Images & Art', icon: Image, color: '#f59e0b', description: 'Photos, illustrations, art' },
  { id: 'museums', name: 'Museums & Culture', icon: Palette, color: '#10b981', description: 'Cultural collections' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#3b82f6', description: 'Courses and learning' },
  { id: 'reference', name: 'Reference', icon: Globe, color: '#6366f1', description: 'Wikipedia, maps, facts' },
  { id: 'software', name: 'Software', icon: Code, color: '#14b8a6', description: 'Free & open source apps' },
  { id: 'datasets', name: 'Datasets & ML', icon: Database, color: '#f97316', description: 'Data for research' },
  { id: 'games', name: 'Libre Games', icon: Gamepad2, color: '#ef4444', description: 'Open source games' },
  { id: 'tabletop', name: 'Tabletop & RPG', icon: Dice6, color: '#a855f7', description: 'D&D, board games, RPGs' },
  { id: 'comics', name: 'Comics', icon: Layers, color: '#f43f5e', description: 'Public domain comics' },
  { id: 'archive', name: 'Internet Archive', icon: Library, color: '#0ea5e9', description: 'Universal library' },
];

// ============================================
// COMPONENT
// ============================================
const LibreResourcesHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('literature');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [embedTitle, setEmbedTitle] = useState<string>('');

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('libreResourcesFavorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (resourceId: string) => {
    const newFavorites = favorites.includes(resourceId)
      ? favorites.filter(f => f !== resourceId)
      : [...favorites, resourceId];
    setFavorites(newFavorites);
    localStorage.setItem('libreResourcesFavorites', JSON.stringify(newFavorites));
  };

  const openEmbed = (url: string, title: string) => {
    setEmbedUrl(url);
    setEmbedTitle(title);
  };

  const closeEmbed = () => {
    setEmbedUrl(null);
    setEmbedTitle('');
  };

  // Get resources for current category
  const getCategoryResources = () => {
    const data = LIBRE_RESOURCES as any;
    switch (activeCategory) {
      case 'literature': return data.literature;
      case 'audio': return data.audio;
      case 'images': return data.images;
      case 'museums': return data.museums;
      case 'education': return data.education;
      case 'reference': return data.reference;
      case 'software': return data.software;
      case 'datasets': return data.datasets;
      case 'games': return data.games;
      case 'tabletop': return data.tabletop;
      case 'comics': return data.comics;
      case 'archive': return { internetArchive: data.internetArchive };
      default: return {};
    }
  };

  const resources = getCategoryResources();
  const currentCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0812] via-[#1a1028] to-[#0a0812] p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Libre Resources Hub
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Access millions of free books, music, art, courses, software, and games.
          All open-source, Creative Commons, or public domain.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1028]/80 border border-purple-500/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-purple-600/30 border-2 border-purple-500 text-purple-300'
                  : 'bg-[#1a1028]/60 border border-gray-700 text-gray-400 hover:border-purple-500/50'
              }`}
            >
              <Icon size={18} style={{ color: isActive ? cat.color : undefined }} />
              <span className="hidden md:inline">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Category Header */}
      {currentCat && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
            <currentCat.icon size={28} style={{ color: currentCat.color }} />
            {currentCat.name}
          </h2>
          <p className="text-gray-400">{currentCat.description}</p>
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {Object.entries(resources).map(([key, resource]: [string, any]) => (
          <div
            key={key}
            className="bg-[#1a1028]/80 border border-purple-500/20 rounded-xl p-5 hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                {resource.name}
              </h3>
              <button
                onClick={() => toggleFavorite(key)}
                className="text-gray-500 hover:text-pink-500 transition-colors"
              >
                <Heart size={18} fill={favorites.includes(key) ? '#ec4899' : 'none'} />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {resource.description}
            </p>

            {/* Stats */}
            {(resource.totalItems || resource.totalBooks || resource.totalPhotos) && (
              <div className="text-xs text-purple-400 mb-3">
                <Sparkles size={12} className="inline mr-1" />
                {(resource.totalItems || resource.totalBooks || resource.totalPhotos)?.toLocaleString()} items
              </div>
            )}

            {/* License Badge */}
            {resource.license && (
              <span className="inline-block text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded mb-3">
                {resource.license}
              </span>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              {(resource.baseUrl || resource.website) && (
                <button
                  onClick={() => openEmbed(resource.baseUrl || resource.website, resource.name)}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 py-2 rounded-lg text-sm transition-all"
                >
                  <Play size={14} />
                  Open
                </button>
              )}
              {(resource.baseUrl || resource.website) && (
                <a
                  href={resource.baseUrl || resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#2a2038] hover:bg-[#3a3048] text-gray-300 px-4 py-2 rounded-lg text-sm transition-all"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Categories/Features */}
            {resource.categories && (
              <div className="flex flex-wrap gap-1 mt-3">
                {resource.categories.slice(0, 4).map((cat: string) => (
                  <span key={cat} className="text-xs bg-[#2a2038] text-gray-400 px-2 py-0.5 rounded">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Embed Modal */}
      {embedUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-[#1a1028] border-b border-purple-500/30">
            <h3 className="text-white font-semibold">{embedTitle}</h3>
            <div className="flex items-center gap-4">
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Open in new tab
              </a>
              <button
                onClick={closeEmbed}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
          </div>
          <iframe
            src={embedUrl}
            className="flex-1 w-full bg-white"
            title={embedTitle}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="bg-[#1a1028]/60 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">70K+</div>
          <div className="text-gray-400 text-sm">Free eBooks</div>
        </div>
        <div className="bg-[#1a1028]/60 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-pink-400">90M+</div>
          <div className="text-gray-400 text-sm">Media Files</div>
        </div>
        <div className="bg-[#1a1028]/60 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">2.5K+</div>
          <div className="text-gray-400 text-sm">Free Courses</div>
        </div>
        <div className="bg-[#1a1028]/60 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">50+</div>
          <div className="text-gray-400 text-sm">Libre Games</div>
        </div>
      </div>
    </div>
  );
};

export default LibreResourcesHub;
