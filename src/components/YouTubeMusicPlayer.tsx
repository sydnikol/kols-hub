// 🎵 YOUTUBE MUSIC PLAYER - Complete Integration Component
// Gothic Futurist Video Streaming Interface

import { useState, useEffect } from 'react';
import { youtubeOAuth } from '../services/youtube-oauth';
import { API_CONFIG } from '../config/api-config';

export default function YouTubeMusicPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(youtubeOAuth.isAuthenticated());
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await youtubeOAuth.startAuthFlow();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('OAuth error:', error);
      alert('Failed to connect to YouTube');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    youtubeOAuth.logout();
    setIsAuthenticated(false);
    setVideos([]);
    setCurrentVideo(null);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `key=${API_CONFIG.youtube.apiKey}&` +
        `part=snippet&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `type=video&` +
        `videoCategoryId=10&` +
        `maxResults=25`
      );
      
      const data = await response.json();
      setVideos(data.items || []);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVideo = (videoId: string) => {
    setCurrentVideo(videoId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-500">
            📺 YouTube Music
          </h1>
          
          {isAuthenticated ? (
            <button
              onClick={handleDisconnect}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connecting...' : 'Connect YouTube'}
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for music videos..."
              className="flex-1 px-6 py-4 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Current Video Player */}
        {currentVideo && (
          <div className="mb-8 bg-black/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            ></iframe>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              onClick={() => handlePlayVideo(video.id.videoId)}
              className="bg-black/50 backdrop-blur-lg border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-500 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-6xl">▶️</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold line-clamp-2 mb-2">
                  {video.snippet.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {video.snippet.channelTitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && videos.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && videos.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
