/**
 * Art Studio Component
 * ====================
 * Free art tools, creative software, and learning resources
 * ACTUAL working links and embedded tools
 */

import React, { useState } from 'react';
import {
  ALL_CREATIVE_TOOLS,
  ALL_LEARNING_RESOURCES,
  DIGITAL_PAINTING_APPS,
  VECTOR_GRAPHICS_APPS,
  DESIGN_APPS,
  THREE_D_APPS,
  ANIMATION_APPS,
  DRAWING_FUNDAMENTALS,
  DIGITAL_ART_LEARNING,
  VIDEO_COURSES,
  COMMUNITY_RESOURCES,
  getArtStudioStats,
  CreativeTool,
  LearningResource
} from '../../data/art-creative-database';

// ============================================================================
// TYPES
// ============================================================================

interface ArtStudioProps {
  className?: string;
}

type ToolTab = 'painting' | 'vector' | 'design' | '3d' | 'animation';
type LearnTab = 'fundamentals' | 'digital' | 'courses' | 'community';
type MainView = 'tools' | 'learn' | 'archives';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const ToolCard: React.FC<{ tool: CreativeTool; onLaunch: (tool: CreativeTool) => void }> = ({ tool, onLaunch }) => (
  <div className="bg-gray-800/60 rounded-xl border border-gray-700 hover:border-purple-500/50
                  transition-all p-4 group">
    <div className="flex items-start gap-3 mb-3">
      <span className="text-3xl group-hover:scale-110 transition-transform">{tool.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-purple-200">{tool.name}</h3>
          {tool.isOpenSource && (
            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">OSS</span>
          )}
          {tool.rating && (
            <span className="text-xs text-yellow-400">★ {tool.rating}</span>
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
      </div>
    </div>

    {/* Features */}
    <div className="flex flex-wrap gap-1 mb-3">
      {tool.features.slice(0, 4).map((feature, idx) => (
        <span key={idx} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded">
          {feature}
        </span>
      ))}
      {tool.features.length > 4 && (
        <span className="text-xs text-gray-500">+{tool.features.length - 4} more</span>
      )}
    </div>

    {/* Platforms */}
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        {tool.platforms.map(platform => (
          <span key={platform} className="text-xs text-gray-500">
            {platform === 'windows' ? '🪟' :
             platform === 'mac' ? '🍎' :
             platform === 'linux' ? '🐧' :
             platform === 'web' ? '🌐' :
             platform === 'ios' ? '📱' : '🤖'}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        {tool.downloadUrl && (
          <button
            onClick={() => window.open(tool.downloadUrl, '_blank')}
            className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"
          >
            Download
          </button>
        )}
        <button
          onClick={() => onLaunch(tool)}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
        >
          Open →
        </button>
      </div>
    </div>
  </div>
);

const ResourceCard: React.FC<{ resource: LearningResource; onOpen: (r: LearningResource) => void }> = ({ resource, onOpen }) => (
  <button
    onClick={() => onOpen(resource)}
    className="bg-gray-800/60 rounded-xl border border-gray-700 hover:border-blue-500/50
               transition-all p-4 text-left group w-full"
  >
    <div className="flex items-start gap-3">
      <span className="text-3xl group-hover:scale-110 transition-transform">{resource.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-blue-200">{resource.name}</h3>
          {resource.pricing === 'free' && (
            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">FREE</span>
          )}
          {resource.rating && (
            <span className="text-xs text-yellow-400">★ {resource.rating}</span>
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{resource.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.topics.slice(0, 3).map((topic, idx) => (
            <span key={idx} className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">
              {topic}
            </span>
          ))}
        </div>
      </div>
      <span className="text-gray-500 group-hover:text-blue-400 transition-colors">→</span>
    </div>
  </button>
);

// ============================================================================
// ARCHIVE RESOURCES
// ============================================================================

const ARCHIVE_RESOURCES = [
  {
    id: 'internet-archive',
    name: 'Internet Archive',
    url: 'https://archive.org/',
    searchUrl: 'https://archive.org/search?query=',
    icon: '🏛️',
    description: 'Digital library with millions of free books, movies, software, music, and websites',
    stats: '866B+ web pages, 42M+ books, 14M+ audio, 8M+ videos',
    categories: ['books', 'movies', 'music', 'software', 'web']
  },
  {
    id: 'wayback-machine',
    name: 'Wayback Machine',
    url: 'https://web.archive.org/',
    searchUrl: 'https://web.archive.org/web/*/',
    icon: '⏰',
    description: 'Browse 866 billion archived web pages',
    stats: '866B+ archived pages since 1996',
    categories: ['web']
  },
  {
    id: 'archive-books',
    name: 'Archive.org Books',
    url: 'https://archive.org/details/texts',
    searchUrl: 'https://archive.org/search?query=mediatype:texts+',
    icon: '📚',
    description: 'Free ebooks and texts collection',
    stats: '42M+ texts available',
    categories: ['books']
  },
  {
    id: 'archive-audio',
    name: 'Archive.org Audio',
    url: 'https://archive.org/details/audio',
    searchUrl: 'https://archive.org/search?query=mediatype:audio+',
    icon: '🎵',
    description: 'Free music, podcasts, and audio recordings',
    stats: '14M+ audio files',
    categories: ['music', 'podcasts']
  },
  {
    id: 'archive-movies',
    name: 'Archive.org Movies',
    url: 'https://archive.org/details/movies',
    searchUrl: 'https://archive.org/search?query=mediatype:movies+',
    icon: '🎬',
    description: 'Free movies, documentaries, and video content',
    stats: '8M+ videos',
    categories: ['movies', 'documentaries']
  },
  {
    id: 'archive-software',
    name: 'Archive.org Software',
    url: 'https://archive.org/details/software',
    searchUrl: 'https://archive.org/search?query=mediatype:software+',
    icon: '💾',
    description: 'Vintage software, games, and programs',
    stats: '1M+ software titles',
    categories: ['software', 'games']
  },
  {
    id: 'media-history-project',
    name: 'Media History Project',
    url: 'https://mediahistoryproject.org/',
    icon: '📺',
    description: 'Digitized media history magazines and publications',
    stats: 'Historic media publications',
    categories: ['history', 'media']
  },
  {
    id: 'archive-images',
    name: 'Archive.org Images',
    url: 'https://archive.org/details/image',
    searchUrl: 'https://archive.org/search?query=mediatype:image+',
    icon: '🖼️',
    description: 'Public domain images and photographs',
    stats: '4M+ images',
    categories: ['images', 'art']
  },
  {
    id: 'open-library',
    name: 'Open Library',
    url: 'https://openlibrary.org/',
    searchUrl: 'https://openlibrary.org/search?q=',
    icon: '📖',
    description: 'Borrow ebooks for free with library card',
    stats: '2M+ free ebooks',
    categories: ['books']
  },
  {
    id: 'tv-archive',
    name: 'TV News Archive',
    url: 'https://archive.org/details/tv',
    searchUrl: 'https://archive.org/search?query=collection:tvarchive+',
    icon: '📡',
    description: 'Searchable TV news archive',
    stats: '2.5M+ TV news clips',
    categories: ['news', 'tv']
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ArtStudio: React.FC<ArtStudioProps> = ({ className = '' }) => {
  const [mainView, setMainView] = useState<MainView>('tools');
  const [toolTab, setToolTab] = useState<ToolTab>('painting');
  const [learnTab, setLearnTab] = useState<LearnTab>('fundamentals');
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveSearch, setArchiveSearch] = useState('');

  const stats = getArtStudioStats();

  const toolTabs: { id: ToolTab; name: string; icon: string; tools: CreativeTool[] }[] = [
    { id: 'painting', name: 'Digital Painting', icon: '🎨', tools: DIGITAL_PAINTING_APPS },
    { id: 'vector', name: 'Vector Graphics', icon: '✒️', tools: VECTOR_GRAPHICS_APPS },
    { id: 'design', name: 'Design', icon: '🎯', tools: DESIGN_APPS },
    { id: '3d', name: '3D & Sculpting', icon: '🧊', tools: THREE_D_APPS },
    { id: 'animation', name: 'Animation', icon: '🎬', tools: ANIMATION_APPS }
  ];

  const learnTabs: { id: LearnTab; name: string; icon: string; resources: LearningResource[] }[] = [
    { id: 'fundamentals', name: 'Fundamentals', icon: '📐', resources: DRAWING_FUNDAMENTALS },
    { id: 'digital', name: 'Digital Art', icon: '💻', resources: DIGITAL_ART_LEARNING },
    { id: 'courses', name: 'Courses', icon: '🎓', resources: VIDEO_COURSES },
    { id: 'community', name: 'Community', icon: '👥', resources: COMMUNITY_RESOURCES }
  ];

  const currentTools = toolTabs.find(t => t.id === toolTab)?.tools || [];
  const currentResources = learnTabs.find(t => t.id === learnTab)?.resources || [];

  const handleLaunchTool = (tool: CreativeTool) => {
    window.open(tool.url, '_blank');
  };

  const handleOpenResource = (resource: LearningResource) => {
    window.open(resource.url, '_blank');
  };

  const handleArchiveSearch = (archive: typeof ARCHIVE_RESOURCES[0]) => {
    if (archiveSearch.trim() && archive.searchUrl) {
      window.open(archive.searchUrl + encodeURIComponent(archiveSearch), '_blank');
    } else {
      window.open(archive.url, '_blank');
    }
  };

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-purple-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-200">🎨 Art Studio</h2>
        <div className="text-sm text-gray-400">
          {stats.totalTools} tools • {stats.totalResources} resources • {stats.openSourceTools} open source
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMainView('tools')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            mainView === 'tools'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>🖌️</span>
          <span>Creative Tools</span>
        </button>
        <button
          onClick={() => setMainView('learn')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            mainView === 'learn'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>📚</span>
          <span>Learn Art</span>
        </button>
        <button
          onClick={() => setMainView('archives')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            mainView === 'archives'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>🏛️</span>
          <span>Archives</span>
        </button>
      </div>

      {/* CREATIVE TOOLS VIEW */}
      {mainView === 'tools' && (
        <>
          {/* Tool Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {toolTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setToolTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  toolTab === tab.id
                    ? 'bg-purple-600/80 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                <span className="text-xs opacity-60">({tab.tools.length})</span>
              </button>
            ))}
          </div>

          {/* Quick Launch - Featured Tools */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">⚡ Quick Launch</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: 'Krita', icon: '🎨', url: 'https://krita.org/' },
                { name: 'GIMP', icon: '🖼️', url: 'https://www.gimp.org/' },
                { name: 'Inkscape', icon: '✒️', url: 'https://inkscape.org/' },
                { name: 'Blender', icon: '🧊', url: 'https://www.blender.org/' },
                { name: 'Figma', icon: '🎯', url: 'https://www.figma.com/' },
                { name: 'Photopea', icon: '🌐', url: 'https://www.photopea.com/' }
              ].map(tool => (
                <button
                  key={tool.name}
                  onClick={() => window.open(tool.url, '_blank')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/40
                             border border-purple-500/20 hover:border-purple-400/50 hover:bg-gray-800/60
                             transition-all duration-300 hover:scale-105"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="text-sm text-gray-300">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} onLaunch={handleLaunchTool} />
            ))}
          </div>
        </>
      )}

      {/* LEARN ART VIEW */}
      {mainView === 'learn' && (
        <>
          {/* Learning Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {learnTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setLearnTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  learnTab === tab.id
                    ? 'bg-blue-600/80 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                <span className="text-xs opacity-60">({tab.resources.length})</span>
              </button>
            ))}
          </div>

          {/* Featured Learning */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">⭐ Start Here</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Ctrl+Paint', icon: '🎓', url: 'https://www.ctrlpaint.com/', desc: 'Free digital painting' },
                { name: 'Drawabox', icon: '📦', url: 'https://drawabox.com/', desc: 'Drawing fundamentals' },
                { name: 'Proko', icon: '👤', url: 'https://www.proko.com/', desc: 'Anatomy & figure' },
                { name: 'Krita Docs', icon: '📚', url: 'https://docs.krita.org/', desc: 'Official tutorials' }
              ].map(resource => (
                <button
                  key={resource.name}
                  onClick={() => window.open(resource.url, '_blank')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/40
                             border border-blue-500/20 hover:border-blue-400/50 hover:bg-gray-800/60
                             transition-all duration-300 hover:scale-105 text-center"
                >
                  <span className="text-2xl">{resource.icon}</span>
                  <span className="text-sm font-medium text-blue-200">{resource.name}</span>
                  <span className="text-xs text-gray-500">{resource.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} onOpen={handleOpenResource} />
            ))}
          </div>
        </>
      )}

      {/* ARCHIVES VIEW */}
      {mainView === 'archives' && (
        <>
          {/* Archive Search */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                placeholder="Search archives for books, movies, music, software..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-12
                           text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
            <button
              onClick={() => archiveSearch.trim() && window.open(`https://archive.org/search?query=${encodeURIComponent(archiveSearch)}`, '_blank')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl
                         font-medium transition-colors flex items-center gap-2"
            >
              <span>Search Archive</span>
              <span>→</span>
            </button>
          </div>

          {/* Archive Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-300">866B+</div>
              <div className="text-xs text-gray-500">Web Pages</div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-300">42M+</div>
              <div className="text-xs text-gray-500">Books</div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-300">14M+</div>
              <div className="text-xs text-gray-500">Audio</div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-300">8M+</div>
              <div className="text-xs text-gray-500">Videos</div>
            </div>
          </div>

          {/* Archive Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARCHIVE_RESOURCES.map(archive => (
              <button
                key={archive.id}
                onClick={() => handleArchiveSearch(archive)}
                className="flex items-start gap-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700
                           hover:border-amber-500/50 hover:bg-gray-800 transition-all text-left group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{archive.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-amber-200 group-hover:text-amber-100">
                    {archive.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{archive.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{archive.stats}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {archive.categories.map((cat, idx) => (
                      <span key={idx} className="text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-gray-500 group-hover:text-amber-400 transition-colors">→</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>🎨 Art Studio</span>
        <span>•</span>
        <span>{stats.totalTools} Creative Tools</span>
        <span>•</span>
        <span>{stats.openSourceTools} Open Source</span>
        <span>•</span>
        <span>100% Free Resources</span>
      </div>
    </div>
  );
};

export default ArtStudio;
