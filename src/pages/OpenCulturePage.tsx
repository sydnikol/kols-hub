/**
 * OpenCulture Integration Page
 * Free courses, books, movies, and educational resources
 */

import React, { useState } from 'react';
import { OPENCULTURE_CATEGORIES, FREE_LEARNING_RESOURCES, OpenCultureCategory } from '../data/openculture-database';

const OpenCulturePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'openculture' | 'resources'>('openculture');
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const resourceTypes = [...new Set(FREE_LEARNING_RESOURCES.map(r => r.type))];

  const filteredResources = selectedType
    ? FREE_LEARNING_RESOURCES.filter(r => r.type === selectedType)
    : FREE_LEARNING_RESOURCES;

  const getCategoryIcon = (category: OpenCultureCategory) => {
    const icons: Record<string, string> = {
      'courses': '🎓',
      'movies': '🎬',
      'audiobooks': '🎧',
      'textbooks': '📚',
      'language': '🌍',
      'philosophy': '🤔',
      'history': '📜',
      'literature': '📖',
      'art': '🎨',
      'music': '🎵',
      'science': '🔬',
      'math': '➗',
      'psychology': '🧠',
      'economics': '📈',
      'business': '💼',
      'religion': '☯️',
      'architecture': '🏛️',
      'astronomy': '🌟',
      'biology': '🧬',
      'chemistry': '⚗️',
      'physics': '⚛️',
      'engineering': '⚙️',
      'computer-science': '💻',
      'law': '⚖️',
      'political-science': '🏛️',
      'sociology': '👥',
      'anthropology': '🦴',
      'archaeology': '🏺',
      'geography': '🗺️',
      'environmental': '🌿',
      'education': '📝',
      'journalism': '📰',
      'film': '🎥',
      'photography': '📷',
      'theater': '🎭',
      'dance': '💃',
      'design': '🖌️',
    };
    return icons[category.id] || '📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent mb-2">
            📚 Free Learning Resources
          </h1>
          <p className="text-gray-400">OpenCulture, TED, documentaries, and more - all free education</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('openculture')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'openculture'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🎓 OpenCulture Categories
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'resources'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🌐 All Resources
          </button>
        </div>

        {/* Embedded Viewer */}
        {embedUrl && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-800 rounded-t-xl px-4 py-2">
              <span className="text-gray-300">Learning Resource</span>
              <button
                onClick={() => setEmbedUrl(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <iframe
              src={embedUrl}
              className="w-full h-[600px] rounded-b-xl border border-emerald-500/20"
              title="Learning Resource"
            />
          </div>
        )}

        {activeTab === 'openculture' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {OPENCULTURE_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setEmbedUrl(category.url)}
                className="flex flex-col items-center gap-2 p-4 bg-gray-900/80 rounded-xl border border-emerald-500/20
                           hover:border-emerald-500/40 hover:bg-gray-800 transition-all hover:scale-105"
              >
                <span className="text-3xl">{getCategoryIcon(category)}</span>
                <span className="text-sm text-white text-center">{category.name}</span>
                {category.count && (
                  <span className="text-xs text-emerald-400">{category.count}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <>
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-3 py-1 rounded text-sm ${
                  !selectedType ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                All
              </button>
              {resourceTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded text-sm capitalize ${
                    selectedType === type ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <div
                  key={resource.id}
                  className="bg-gray-900/80 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{resource.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{resource.name}</h3>
                        {resource.isFree && (
                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">FREE</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded capitalize">
                          {resource.type}
                        </span>
                        {resource.topics?.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEmbedUrl(resource.url)}
                          className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                        >
                          Open Here
                        </button>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          New Tab
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenCulturePage;
