// 🎵 MUSIC SANCTUARY - Complete Integration
// Gothic Futurist Multimedia Hub
// Spotify + YouTube + SoundCloud in one unified interface

import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Video, Headphones, Search, Play, Pause, SkipForward, 
  SkipBack, Volume2, VolumeX, Download, Heart, Share2, 
  Settings, Repeat, Shuffle, ListMusic, User, TrendingUp,
  Youtube, Disc, Radio, Plus, X, ExternalLink, Clock
} from 'lucide-react';
import { spotifyService, SpotifyTrack, SpotifyPlaylist } from '../services/spotify-service';
import { youtubeService, YouTubeVideo } from '../services/youtube-service';
import { soundcloudService, SoundCloudTrack } from '../services/soundcloud-service';

type MediaType = 'spotify' | 'youtube' | 'soundcloud';
type ViewMode = 'search' | 'playlists' | 'trending' | 'library';

interface MediaItem {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  type: MediaType;
  url?: string;
  data: any; // Raw data from respective service
}

export const MusicSanctuary: React.FC = () => {
  // STATE
  const [activeService, setActiveService] = useState<MediaType>('spotify');
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // SPOTIFY AUTH STATE
  const [spotifyAuthed, setSpotifyAuthed] = useState(false);
  const [spotifyClientId, setSpotifyClientId] = useState('');
  const [spotifyClientSecret, setSpotifyClientSecret] = useState('');

  // YOUTUBE STATE
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [youtubeAuthed, setYoutubeAuthed] = useState(false);

  // SOUNDCLOUD STATE
  const [soundcloudClientId, setSoundcloudClientId] = useState('');
  const [soundcloudAuthed, setSoundcloudAuthed] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // INITIALIZE SERVICES
  useEffect(() => {
    const initServices = async () => {
      await spotifyService.initialize();
      await youtubeService.initialize();
      await soundcloudService.initialize();

      // Check auth status
      setSpotifyAuthed(spotifyService.isAuthenticated());
      setYoutubeAuthed(youtubeService.hasApiKey());
      setSoundcloudAuthed(soundcloudService.hasClientId());

      // Load saved credentials
      setSpotifyClientId(localStorage.getItem('spotify_client_id') || '');
      setSpotifyClientSecret(localStorage.getItem('spotify_client_secret') || '');
      setYoutubeApiKey(localStorage.getItem('youtube_api_key') || '');
      setSoundcloudClientId(localStorage.getItem('soundcloud_client_id') || '');
    };

    initServices();

    // Handle Spotify OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleSpotifyCallback(code);
    }
  }, []);

  // SPOTIFY AUTHENTICATION
  const handleSpotifyAuth = () => {
    if (!spotifyClientId || !spotifyClientSecret) {
      alert('Please enter your Spotify Client ID and Secret first!');
      setShowSettings(true);
      return;
    }

    spotifyService.setCredentials(spotifyClientId, spotifyClientSecret);
    window.location.href = spotifyService.getAuthUrl();
  };

  const handleSpotifyCallback = async (code: string) => {
    const success = await spotifyService.handleCallback(code);
    if (success) {
      setSpotifyAuthed(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert('🎵 Successfully connected to Spotify!');
    }
  };

  // YOUTUBE SETUP
  const setupYouTube = () => {
    if (!youtubeApiKey) {
      alert('Please enter your YouTube API key first!');
      setShowSettings(true);
      return;
    }

    youtubeService.setApiKey(youtubeApiKey);
    setYoutubeAuthed(true);
    alert('📺 Successfully connected to YouTube!');
  };

  // SOUNDCLOUD SETUP
  const setupSoundCloud = () => {
    if (!soundcloudClientId) {
      alert('Please enter your SoundCloud Client ID first!');
      setShowSettings(true);
      return;
    }

    soundcloudService.setClientId(soundcloudClientId);
    setSoundcloudAuthed(true);
    alert('🎧 Successfully connected to SoundCloud!');
  };

  // SEARCH
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let results: MediaItem[] = [];

      if (activeService === 'spotify' && spotifyAuthed) {
        const tracks = await spotifyService.search(searchQuery, 'track', 20);
        results = tracks.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artists.join(', '),
          thumbnail: track.albumArt,
          duration: track.duration,
          type: 'spotify' as MediaType,
          url: track.previewUrl,
          data: track
        }));
      } else if (activeService === 'youtube' && youtubeAuthed) {
        const videos = await youtubeService.searchVideos(searchQuery, 20);
        results = videos.map(video => ({
          id: video.id,
          title: video.title,
          artist: video.channelTitle,
          thumbnail: video.thumbnail,
          duration: youtubeService.parseDuration(video.duration),
          type: 'youtube' as MediaType,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          data: video
        }));
      } else if (activeService === 'soundcloud' && soundcloudAuthed) {
        const tracks = await soundcloudService.searchTracks(searchQuery, 20);
        results = tracks.map(track => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.user.username,
          thumbnail: track.artworkUrl,
          duration: track.duration / 1000,
          type: 'soundcloud' as MediaType,
          url: soundcloudService.getStreamUrl(track),
          data: track
        }));
      }

      setSearchResults(results);
      setViewMode('search');
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please check your API credentials.');
    } finally {
      setLoading(false);
    }
  };

  // LOAD PLAYLISTS
  const loadPlaylists = async () => {
    setLoading(true);
    try {
      if (activeService === 'spotify' && spotifyAuthed) {
        const playlists = await spotifyService.getUserPlaylists();
        setPlaylists(playlists);
      } else if (activeService === 'youtube' && youtubeAuthed) {
        // YouTube playlists would require OAuth2 for user playlists
        alert('YouTube user playlists require additional OAuth setup');
      } else if (activeService === 'soundcloud' && soundcloudAuthed) {
        alert('SoundCloud user playlists require additional OAuth setup');
      }
      setViewMode('playlists');
    } catch (error) {
      console.error('Playlist load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // LOAD TRENDING
  const loadTrending = async () => {
    setLoading(true);
    try {
      let results: MediaItem[] = [];

      if (activeService === 'spotify' && spotifyAuthed) {
        const tracks = await spotifyService.getTopTracks('short_term');
        results = tracks.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artists.join(', '),
          thumbnail: track.albumArt,
          duration: track.duration,
          type: 'spotify' as MediaType,
          url: track.previewUrl,
          data: track
        }));
      } else if (activeService === 'youtube' && youtubeAuthed) {
        const videos = await youtubeService.getTrending('US', 20);
        results = videos.map(video => ({
          id: video.id,
          title: video.title,
          artist: video.channelTitle,
          thumbnail: video.thumbnail,
          duration: youtubeService.parseDuration(video.duration),
          type: 'youtube' as MediaType,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          data: video
        }));
      } else if (activeService === 'soundcloud' && soundcloudAuthed) {
        const tracks = await soundcloudService.getGenreChart('all-music', 20);
        results = tracks.map(track => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.user.username,
          thumbnail: track.artworkUrl,
          duration: track.duration / 1000,
          type: 'soundcloud' as MediaType,
          url: soundcloudService.getStreamUrl(track),
          data: track
        }));
      }

      setSearchResults(results);
      setViewMode('trending');
    } catch (error) {
      console.error('Trending load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // PLAYBACK
  const playTrack = (item: MediaItem) => {
    setCurrentTrack(item);
    setIsPlaying(true);
    
    if (audioRef.current && item.url) {
      audioRef.current.src = item.url;
      audioRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  // FORMAT TIME
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // RENDER SERVICE STATUS
  const renderServiceStatus = () => (
    <div className="flex items-center space-x-4 mb-6">
      <button
        onClick={() => setActiveService('spotify')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
          activeService === 'spotify'
            ? 'bg-green-500/20 border-2 border-green-400 text-green-300'
            : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
        }`}
      >
        <Disc className="w-5 h-5" />
        <span>Spotify</span>
        {spotifyAuthed && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
      </button>

      <button
        onClick={() => setActiveService('youtube')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
          activeService === 'youtube'
            ? 'bg-red-500/20 border-2 border-red-400 text-red-300'
            : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
        }`}
      >
        <Youtube className="w-5 h-5" />
        <span>YouTube</span>
        {youtubeAuthed && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />}
      </button>

      <button
        onClick={() => setActiveService('soundcloud')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
          activeService === 'soundcloud'
            ? 'bg-orange-500/20 border-2 border-orange-400 text-orange-300'
            : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-600'
        }`}
      >
        <Headphones className="w-5 h-5" />
        <span>SoundCloud</span>
        {soundcloudAuthed && <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />}
      </button>
    </div>
  );

  // RENDER SETTINGS MODAL
  const renderSettings = () => {
    if (!showSettings) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-300 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              API Configuration
            </h2>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* SPOTIFY */}
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-green-400 font-bold mb-3 flex items-center">
                <Disc className="w-5 h-5 mr-2" />
                Spotify Setup
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Client ID"
                  value={spotifyClientId}
                  onChange={(e) => setSpotifyClientId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200"
                />
                <input
                  type="text"
                  placeholder="Client Secret"
                  value={spotifyClientSecret}
                  onChange={(e) => setSpotifyClientSecret(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200"
                />
                <button
                  onClick={handleSpotifyAuth}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Connect Spotify
                </button>
              </div>
            </div>

            {/* YOUTUBE */}
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-red-400 font-bold mb-3 flex items-center">
                <Youtube className="w-5 h-5 mr-2" />
                YouTube Setup
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="API Key"
                  value={youtubeApiKey}
                  onChange={(e) => setYoutubeApiKey(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200"
                />
                <button
                  onClick={setupYouTube}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Connect YouTube
                </button>
              </div>
            </div>

            {/* SOUNDCLOUD */}
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-orange-400 font-bold mb-3 flex items-center">
                <Headphones className="w-5 h-5 mr-2" />
                SoundCloud Setup
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Client ID"
                  value={soundcloudClientId}
                  onChange={(e) => setSoundcloudClientId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200"
                />
                <button
                  onClick={setupSoundCloud}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Connect SoundCloud
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">📚 <strong>Need help getting API keys?</strong></p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Spotify: https://developer.spotify.com/dashboard</li>
              <li>• YouTube: https://console.cloud.google.com/</li>
              <li>• SoundCloud: https://soundcloud.com/you/apps</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // RENDER SEARCH RESULTS
  const renderSearchResults = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {searchResults.map((item) => (
        <div
          key={item.id}
          className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all cursor-pointer group"
          onClick={() => playTrack(item)}
        >
          <div className="relative aspect-square">
            <img
              src={item.thumbnail || '/placeholder-album.png'}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-16 h-16 text-purple-400" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-200 truncate">{item.title}</h3>
            <p className="text-sm text-gray-400 truncate">{item.artist}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{formatTime(item.duration)}</span>
              <div className="flex space-x-2">
                {item.type === 'spotify' && <Disc className="w-4 h-4 text-green-400" />}
                {item.type === 'youtube' && <Youtube className="w-4 h-4 text-red-400" />}
                {item.type === 'soundcloud' && <Headphones className="w-4 h-4 text-orange-400" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // MAIN RENDER
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-400 to-purple-400">
          🎵 Music Sanctuary
        </h1>
        <p className="text-gray-400">Gothic Futurist Multimedia Hub</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* SERVICE SELECTOR */}
        {renderServiceStatus()}

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search music..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-gray-200 focus:border-purple-500 focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          <button
            onClick={loadPlaylists}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2"
          >
            <ListMusic className="w-5 h-5" />
            <span>Playlists</span>
          </button>

          <button
            onClick={loadTrending}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="mb-32">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            renderSearchResults()
          ) : (
            <div className="text-center py-20">
              <Music className="w-24 h-24 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-xl">
                {!spotifyAuthed && !youtubeAuthed && !soundcloudAuthed
                  ? 'Connect a service to start exploring music'
                  : 'Search for your favorite music'}
              </p>
            </div>
          )}
        </div>

        {/* NOW PLAYING BAR */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 z-40">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                {/* TRACK INFO */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-200 truncate">{currentTrack.title}</h4>
                    <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
                  </div>
                </div>

                {/* PLAYBACK CONTROLS */}
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* VOLUME */}
                <div className="flex items-center space-x-3">
                  <button onClick={toggleMute} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-24"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {renderSettings()}

        {/* AUDIO ELEMENT */}
        <audio
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            const audio = e.target as HTMLAudioElement;
            setProgress((audio.currentTime / audio.duration) * 100);
          }}
        />
      </div>
    </div>
  );
};
