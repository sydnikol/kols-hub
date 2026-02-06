import React, { useState } from 'react';
import {
  Download, Search, ExternalLink, Play, Folder, Settings,
  Monitor, Smartphone, Globe, Github, Star, Shield, Zap
} from 'lucide-react';
import { TORRENT_CLIENTS, TORRENT_SITES, WEB_TORRENT_PLAYERS } from '../../data/torrent-clients-database';

type TabType = 'stream' | 'clients' | 'sites' | 'downloads';

const TorrentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stream');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [magnetLink, setMagnetLink] = useState('');
  const [embedUrl, setEmbedUrl] = useState('https://instant.io/');

  const handleStreamTorrent = () => {
    if (magnetLink) {
      // Use instant.io to stream the magnet link
      setEmbedUrl(`https://instant.io/#${encodeURIComponent(magnetLink)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Torrent Hub
            </h1>
          </div>
          <p className="text-gray-400">Stream and download torrents • qBittorrent • PikaTorrent • WebTorrent</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { id: 'stream', label: 'Stream Now', icon: Play },
              { id: 'clients', label: 'Torrent Clients', icon: Monitor },
              { id: 'sites', label: 'Torrent Sites', icon: Globe },
              { id: 'downloads', label: 'Downloads', icon: Download },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stream Tab - Embedded WebTorrent Player */}
        {activeTab === 'stream' && (
          <div className="space-y-6">
            {/* Magnet Link Input */}
            <div className="p-6 bg-purple-900/30 rounded-xl border border-purple-500/30">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Stream Torrent in Browser
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={magnetLink}
                  onChange={(e) => setMagnetLink(e.target.value)}
                  placeholder="Paste magnet link or torrent hash here..."
                  className="flex-1 px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={handleStreamTorrent}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Stream
                </button>
              </div>
            </div>

            {/* Web Player Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WEB_TORRENT_PLAYERS.map((player) => (
                <button
                  key={player.id}
                  onClick={() => setEmbedUrl(player.embedUrl)}
                  className={`p-4 rounded-lg border transition-all ${
                    embedUrl === player.embedUrl
                      ? 'bg-purple-600/30 border-purple-400'
                      : 'bg-purple-900/20 border-purple-500/30 hover:border-purple-400/50'
                  }`}
                >
                  <h3 className="font-bold">{player.name}</h3>
                  <p className="text-xs text-gray-400">{player.description}</p>
                </button>
              ))}
            </div>

            {/* Embedded WebTorrent Player */}
            <div className="rounded-xl overflow-hidden border border-purple-500/30">
              <iframe
                src={embedUrl}
                className="w-full h-[600px] bg-black"
                title="WebTorrent Player"
                allow="autoplay; fullscreen"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TORRENT_CLIENTS.map((client) => (
                <div
                  key={client.id}
                  className="p-6 bg-purple-900/30 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{client.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{client.name}</h3>
                      <div className="flex gap-2">
                        {client.isOpenSource && (
                          <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded">Open Source</span>
                        )}
                        {client.hasWebUI && (
                          <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">Web UI</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{client.description}</p>

                  {/* Platforms */}
                  <div className="flex gap-2 mb-4">
                    {client.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 text-xs bg-purple-500/20 rounded capitalize"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {client.features.slice(0, 4).map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 text-xs bg-gray-700/50 rounded text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={client.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-center transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    {client.githubUrl && (
                      <a
                        href={client.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sites Tab */}
        {activeTab === 'sites' && (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-300 text-sm">
                ⚠️ Use a VPN for privacy. Always verify file safety before downloading.
              </p>
            </div>

            {['general', 'movies', 'tv', 'anime', 'music', 'games', 'books'].map((category) => {
              const sites = TORRENT_SITES.filter((s) => s.category === category);
              if (sites.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-xl font-bold mb-4 capitalize">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sites.map((site) => (
                      <a
                        key={site.id}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <h3 className="font-bold">{site.name}</h3>
                          <p className="text-sm text-gray-400">{site.description}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Folder className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">No Active Downloads</h2>
              <p className="text-gray-400 mb-6">
                Use the Stream tab to download torrents in your browser, or install a desktop client.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="https://www.qbittorrent.org/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Get qBittorrent
                </a>
                <a
                  href="https://www.pikatorrent.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Get PikaTorrent
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TorrentHub;
