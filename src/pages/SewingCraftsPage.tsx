/**
 * Sewing & Crafts Resource Page
 * Free patterns, tutorials, and software
 */

import React, { useState } from 'react';
import { SEWING_RESOURCES, SEWING_SOFTWARE } from '../data/sewing-crafts-database';

const SewingCraftsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patterns' | 'software'>('patterns');
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(SEWING_RESOURCES.map(r => r.category))];

  const filteredResources = selectedCategory
    ? SEWING_RESOURCES.filter(r => r.category === selectedCategory)
    : SEWING_RESOURCES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-black to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ✂️ Sewing & Crafts Studio
          </h1>
          <p className="text-gray-400">Free patterns, tutorials, and software for your creative projects</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'patterns'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📐 Patterns & Tutorials
          </button>
          <button
            onClick={() => setActiveTab('software')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'software'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            💻 Software & Tools
          </button>
        </div>

        {/* Embedded Viewer */}
        {embedUrl && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-800 rounded-t-xl px-4 py-2">
              <span className="text-gray-300">Embedded Resource</span>
              <button
                onClick={() => setEmbedUrl(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <iframe
              src={embedUrl}
              className="w-full h-[600px] rounded-b-xl border border-pink-500/20"
              title="Sewing Resource"
            />
          </div>
        )}

        {activeTab === 'patterns' && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded text-sm ${
                  !selectedCategory ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedCategory === cat ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <div
                  key={resource.id}
                  className="bg-gray-900/80 rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{resource.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{resource.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="text-xs bg-pink-900/50 text-pink-300 px-2 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEmbedUrl(resource.url)}
                          className="text-xs bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded"
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

        {activeTab === 'software' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEWING_SOFTWARE.map(software => (
              <div
                key={software.id}
                className="bg-gray-900/80 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{software.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{software.name}</h3>
                      {software.isFree && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">FREE</span>
                      )}
                      {software.isOpenSource && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Open Source</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{software.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                        {software.platform}
                      </span>
                      {software.features.slice(0, 2).map((f, i) => (
                        <span key={i} className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={software.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                      >
                        Download
                      </a>
                      {software.tutorialUrl && (
                        <a
                          href={software.tutorialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Tutorial
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SewingCraftsPage;
