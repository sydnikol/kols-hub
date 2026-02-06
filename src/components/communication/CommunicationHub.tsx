/**
 * Communication Hub
 * ==================
 * Embedded communication platforms - Discord, Messenger, Zoom, and more
 * All accessible directly within the app
 */

import React, { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface CommunicationHubProps {
  className?: string;
  onActivityLog?: (activity: { platform: string; action: string; timestamp: Date }) => void;
}

interface CommunicationPlatform {
  id: string;
  name: string;
  url: string;
  embedUrl?: string;
  icon: string;
  description: string;
  category: 'messaging' | 'video' | 'social' | 'collaboration';
  canEmbed: boolean;
  color: string;
}

// ============================================================================
// PLATFORMS DATABASE
// ============================================================================

const COMMUNICATION_PLATFORMS: CommunicationPlatform[] = [
  // Messaging
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com/app',
    embedUrl: 'https://discord.com/app',
    icon: '💬',
    description: 'Voice, video, and text chat for communities',
    category: 'messaging',
    canEmbed: true,
    color: 'indigo'
  },
  {
    id: 'messenger',
    name: 'Facebook Messenger',
    url: 'https://www.messenger.com/',
    embedUrl: 'https://www.messenger.com/',
    icon: '💭',
    description: 'Facebook Messenger for web',
    category: 'messaging',
    canEmbed: true,
    color: 'blue'
  },
  {
    id: 'telegram',
    name: 'Telegram Web',
    url: 'https://web.telegram.org/',
    embedUrl: 'https://web.telegram.org/',
    icon: '✈️',
    description: 'Fast, secure messaging',
    category: 'messaging',
    canEmbed: true,
    color: 'cyan'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Web',
    url: 'https://web.whatsapp.com/',
    embedUrl: 'https://web.whatsapp.com/',
    icon: '📱',
    description: 'WhatsApp in your browser',
    category: 'messaging',
    canEmbed: true,
    color: 'green'
  },
  {
    id: 'slack',
    name: 'Slack',
    url: 'https://app.slack.com/',
    embedUrl: 'https://app.slack.com/',
    icon: '💼',
    description: 'Team communication and collaboration',
    category: 'collaboration',
    canEmbed: true,
    color: 'purple'
  },

  // Video
  {
    id: 'zoom',
    name: 'Zoom',
    url: 'https://zoom.us/join',
    embedUrl: 'https://zoom.us/join',
    icon: '📹',
    description: 'Video conferencing and meetings',
    category: 'video',
    canEmbed: true,
    color: 'blue'
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    url: 'https://meet.google.com/',
    embedUrl: 'https://meet.google.com/',
    icon: '🎥',
    description: 'Video meetings by Google',
    category: 'video',
    canEmbed: true,
    color: 'green'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    url: 'https://teams.microsoft.com/',
    embedUrl: 'https://teams.microsoft.com/',
    icon: '👥',
    description: 'Microsoft Teams for collaboration',
    category: 'video',
    canEmbed: true,
    color: 'violet'
  },
  {
    id: 'jitsi',
    name: 'Jitsi Meet',
    url: 'https://meet.jit.si/',
    embedUrl: 'https://meet.jit.si/',
    icon: '🎤',
    description: 'Free, open source video meetings',
    category: 'video',
    canEmbed: true,
    color: 'orange'
  },

  // Social
  {
    id: 'twitter',
    name: 'Twitter/X',
    url: 'https://twitter.com/',
    embedUrl: 'https://twitter.com/',
    icon: '🐦',
    description: 'Microblogging and social network',
    category: 'social',
    canEmbed: true,
    color: 'sky'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com/',
    embedUrl: 'https://www.reddit.com/',
    icon: '🤖',
    description: 'Community discussions and news',
    category: 'social',
    canEmbed: true,
    color: 'orange'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    embedUrl: 'https://www.instagram.com/',
    icon: '📸',
    description: 'Photo and video sharing',
    category: 'social',
    canEmbed: true,
    color: 'pink'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/',
    embedUrl: 'https://www.tiktok.com/',
    icon: '🎵',
    description: 'Short-form video platform',
    category: 'social',
    canEmbed: true,
    color: 'pink'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/',
    embedUrl: 'https://www.facebook.com/',
    icon: '📘',
    description: 'Social networking platform',
    category: 'social',
    canEmbed: true,
    color: 'blue'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    embedUrl: 'https://www.linkedin.com/',
    icon: '💼',
    description: 'Professional networking',
    category: 'social',
    canEmbed: true,
    color: 'blue'
  },

  // Collaboration
  {
    id: 'notion',
    name: 'Notion',
    url: 'https://www.notion.so/',
    embedUrl: 'https://www.notion.so/',
    icon: '📝',
    description: 'All-in-one workspace',
    category: 'collaboration',
    canEmbed: true,
    color: 'gray'
  },
  {
    id: 'figma',
    name: 'Figma',
    url: 'https://www.figma.com/',
    embedUrl: 'https://www.figma.com/',
    icon: '🎨',
    description: 'Collaborative design tool',
    category: 'collaboration',
    canEmbed: true,
    color: 'purple'
  },
  {
    id: 'miro',
    name: 'Miro',
    url: 'https://miro.com/',
    embedUrl: 'https://miro.com/',
    icon: '🎯',
    description: 'Online whiteboard and collaboration',
    category: 'collaboration',
    canEmbed: true,
    color: 'yellow'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    url: 'https://docs.google.com/',
    embedUrl: 'https://docs.google.com/',
    icon: '📄',
    description: 'Collaborative document editing',
    category: 'collaboration',
    canEmbed: true,
    color: 'blue'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  className = '',
  onActivityLog
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<CommunicationPlatform | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'messaging' | 'video' | 'social' | 'collaboration'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '🌐' },
    { id: 'messaging', name: 'Messaging', icon: '💬' },
    { id: 'video', name: 'Video', icon: '📹' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'collaboration', name: 'Collaboration', icon: '🤝' }
  ];

  const filteredPlatforms = activeCategory === 'all'
    ? COMMUNICATION_PLATFORMS
    : COMMUNICATION_PLATFORMS.filter(p => p.category === activeCategory);

  const handleOpenPlatform = (platform: CommunicationPlatform) => {
    setSelectedPlatform(platform);
    onActivityLog?.({
      platform: platform.id,
      action: 'opened',
      timestamp: new Date()
    });
  };

  const handleOpenExternal = (platform: CommunicationPlatform) => {
    window.open(platform.url, '_blank');
    onActivityLog?.({
      platform: platform.id,
      action: 'opened_external',
      timestamp: new Date()
    });
  };

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-indigo-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-200">💬 Communication Hub</h2>
        <div className="text-sm text-gray-400">
          {COMMUNICATION_PLATFORMS.length} platforms available
        </div>
      </div>

      {/* If platform is selected, show embedded view */}
      {selectedPlatform ? (
        <div className="space-y-4">
          {/* Platform Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <span className="text-3xl">{selectedPlatform.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-indigo-200">{selectedPlatform.name}</h3>
                <p className="text-sm text-gray-400">{selectedPlatform.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isFullscreen ? '🔲 Exit' : '⛶ Fullscreen'}
              </button>
              <button
                onClick={() => handleOpenExternal(selectedPlatform)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Open in New Tab →
              </button>
            </div>
          </div>

          {/* Embedded Platform */}
          <div
            className={`bg-black rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
            style={{ height: isFullscreen ? '100vh' : '70vh' }}
          >
            <iframe
              src={selectedPlatform.embedUrl || selectedPlatform.url}
              className="w-full h-full"
              title={selectedPlatform.name}
              allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
            />
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg z-10"
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Access */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">⚡ Quick Access</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                { id: 'discord', name: 'Discord', icon: '💬' },
                { id: 'zoom', name: 'Zoom', icon: '📹' },
                { id: 'messenger', name: 'Messenger', icon: '💭' },
                { id: 'slack', name: 'Slack', icon: '💼' },
                { id: 'twitter', name: 'Twitter', icon: '🐦' },
                { id: 'notion', name: 'Notion', icon: '📝' }
              ].map(quick => {
                const platform = COMMUNICATION_PLATFORMS.find(p => p.id === quick.id);
                return platform ? (
                  <button
                    key={quick.id}
                    onClick={() => handleOpenPlatform(platform)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/40
                               border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-gray-800/60
                               transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-2xl">{quick.icon}</span>
                    <span className="text-sm text-gray-300">{quick.name}</span>
                  </button>
                ) : null;
              })}
            </div>
          </div>

          {/* All Platforms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredPlatforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => handleOpenPlatform(platform)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-800/60
                           border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800
                           transition-all duration-300 hover:scale-105 group"
              >
                <span className="text-4xl group-hover:animate-bounce">{platform.icon}</span>
                <div className="text-center">
                  <div className="font-medium text-gray-200">{platform.name}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{platform.description}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded bg-${platform.color}-900/50 text-${platform.color}-400`}>
                  {platform.category}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>💬 Communication Hub</span>
        <span>•</span>
        <span>All Your Apps in One Place</span>
        <span>•</span>
        <span>Stay Connected</span>
      </div>
    </div>
  );
};

export default CommunicationHub;
