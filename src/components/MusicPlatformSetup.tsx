// 🎯 MUSIC PLATFORM SETUP WIZARD
// Simple visual guide for connecting all music services

import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ExternalLink, Copy, AlertCircle, Sparkles } from 'lucide-react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  url?: string;
  completed: boolean;
}

interface MusicPlatformSetupProps {
  onComplete: () => void;
}

export const MusicPlatformSetup: React.FC<MusicPlatformSetupProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'soundcloud' | 'youtube' | 'spotify'>('soundcloud');
  const [soundcloudClientId, setSoundcloudClientId] = useState('');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [spotifyClientId, setSpotifyClientId] = useState('');
  const [spotifyClientSecret, setSpotifyClientSecret] = useState('');

  const [setupStatus, setSetupStatus] = useState({
    soundcloud: false,
    youtube: false,
    spotify: false
  });

  useEffect(() => {
    // Check saved credentials
    const scId = localStorage.getItem('soundcloud_client_id');
    const ytKey = localStorage.getItem('youtube_api_key');
    const spId = localStorage.getItem('spotify_client_id');
    const spSecret = localStorage.getItem('spotify_client_secret');

    if (scId) {
      setSoundcloudClientId(scId);
      setSetupStatus(prev => ({ ...prev, soundcloud: true }));
    }
    if (ytKey) {
      setYoutubeApiKey(ytKey);
      setSetupStatus(prev => ({ ...prev, youtube: true }));
    }
    if (spId && spSecret) {
      setSpotifyClientId(spId);
      setSpotifyClientSecret(spSecret);
      setSetupStatus(prev => ({ ...prev, spotify: true }));
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const saveSoundCloud = () => {
    if (!soundcloudClientId.trim()) {
      alert('Please enter a Client ID!');
      return;
    }
    localStorage.setItem('soundcloud_client_id', soundcloudClientId);
    setSetupStatus(prev => ({ ...prev, soundcloud: true }));
    alert('✅ SoundCloud configured! You can now search and play SoundCloud music.');
  };

  const saveYouTube = () => {
    if (!youtubeApiKey.trim()) {
      alert('Please enter an API Key!');
      return;
    }
    localStorage.setItem('youtube_api_key', youtubeApiKey);
    setSetupStatus(prev => ({ ...prev, youtube: true }));
    alert('✅ YouTube configured! You can now search and watch YouTube videos.');
  };

  const saveSpotify = () => {
    if (!spotifyClientId.trim() || !spotifyClientSecret.trim()) {
      alert('Please enter both Client ID and Client Secret!');
      return;
    }
    localStorage.setItem('spotify_client_id', spotifyClientId);
    localStorage.setItem('spotify_client_secret', spotifyClientSecret);
    setSetupStatus(prev => ({ ...prev, spotify: true }));
    alert('✅ Spotify configured! Click "Connect Spotify Account" to finish setup.');
  };

  const allCompleted = Object.values(setupStatus).every(status => status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
            🎵 Music Platform Setup Wizard
          </h1>
          <p className="text-gray-300">Set up your music platforms in 3 easy steps!</p>
        </div>

        {/* Progress */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Setup Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'SoundCloud', status: setupStatus.soundcloud, icon: '🎧' },
              { name: 'YouTube', status: setupStatus.youtube, icon: '📺' },
              { name: 'Spotify', status: setupStatus.spotify, icon: '🎵' }
            ].map((platform) => (
              <div key={platform.name} className={`
                p-4 rounded-lg border-2 transition-all
                ${platform.status 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 bg-gray-700/30'
                }
              `}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{platform.icon}</span>
                  {platform.status ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <p className="text-sm font-medium">{platform.name}</p>
                <p className="text-xs text-gray-400">
                  {platform.status ? 'Configured ✓' : 'Not configured'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'soundcloud', label: '🎧 SoundCloud', difficulty: 'Easiest!' },
            { id: 'youtube', label: '📺 YouTube', difficulty: 'Easy!' },
            { id: 'spotify', label: '🎵 Spotify', difficulty: 'Medium' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex-1 px-4 py-3 rounded-lg font-semibold transition-all
                ${activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }
              `}
            >
              <div>{tab.label}</div>
              <div className="text-xs opacity-75">{tab.difficulty}</div>
            </button>
          ))}
        </div>

        {/* Setup Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
          
          {/* SOUNDCLOUD */}
          {activeTab === 'soundcloud' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🎧 SoundCloud Setup
                <span className="text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Easiest!
                </span>
              </h2>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Step 1: Get Your Client ID
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-2">
                    <li>Go to SoundCloud Developers</li>
                    <li>Sign in with your SoundCloud account</li>
                    <li>Click "Register a new app"</li>
                    <li>Fill in app name and details</li>
                    <li>Use redirect URI: <code className="bg-gray-700 px-2 py-1 rounded">http://localhost:5173/callback/soundcloud</code></li>
                    <li>Copy your <strong>Client ID</strong></li>
                  </ol>
                  <a
                    href="https://developers.soundcloud.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open SoundCloud Developers
                  </a>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Step 2: Paste Your Client ID Here
                  </label>
                  <input
                    type="text"
                    value={soundcloudClientId}
                    onChange={(e) => setSoundcloudClientId(e.target.value)}
                    placeholder="Enter your SoundCloud Client ID"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                  />
                </div>

                <button
                  onClick={saveSoundCloud}
                  disabled={setupStatus.soundcloud}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all shadow-lg"
                >
                  {setupStatus.soundcloud ? '✅ SoundCloud Configured' : 'Save SoundCloud'}
                </button>
              </div>
            </div>
          )}

          {/* YOUTUBE */}
          {activeTab === 'youtube' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                📺 YouTube Setup
                <span className="text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  Easy!
                </span>
              </h2>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Step 1: Create Google Cloud Project
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-2">
                    <li>Go to Google Cloud Console</li>
                    <li>Create a new project named "KOL Music"</li>
                    <li>Enable "YouTube Data API v3"</li>
                    <li>Go to Credentials and create an API key</li>
                    <li>Copy the API key</li>
                  </ol>
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Google Cloud Console
                  </a>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Step 2: Paste Your API Key Here
                  </label>
                  <input
                    type="text"
                    value={youtubeApiKey}
                    onChange={(e) => setYoutubeApiKey(e.target.value)}
                    placeholder="Enter your YouTube API Key"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                  />
                </div>

                <button
                  onClick={saveYouTube}
                  disabled={setupStatus.youtube}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all shadow-lg"
                >
                  {setupStatus.youtube ? '✅ YouTube Configured' : 'Save YouTube'}
                </button>
              </div>
            </div>
          )}

          {/* SPOTIFY */}
          {activeTab === 'spotify' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🎵 Spotify Setup
                <span className="text-sm bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                  Medium
                </span>
              </h2>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Step 1: Create Spotify App
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-2">
                    <li>Go to Spotify Developer Dashboard</li>
                    <li>Log in with your Spotify account</li>
                    <li>Click "Create app"</li>
                    <li>Fill in app name and description</li>
                    <li className="font-semibold text-indigo-400">Redirect URI: <code className="bg-gray-700 px-2 py-1 rounded">http://localhost:5173/callback/spotify</code></li>
                    <li>Save and copy your <strong>Client ID</strong> and <strong>Client Secret</strong></li>
                  </ol>
                  <a
                    href="https://developer.spotify.com/dashboard/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Spotify Dashboard
                  </a>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Step 2: Paste Your Client ID
                  </label>
                  <input
                    type="text"
                    value={spotifyClientId}
                    onChange={(e) => setSpotifyClientId(e.target.value)}
                    placeholder="Enter your Spotify Client ID"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none mb-3"
                  />
                  
                  <label className="block mb-2 font-medium">
                    Step 3: Paste Your Client Secret
                  </label>
                  <input
                    type="password"
                    value={spotifyClientSecret}
                    onChange={(e) => setSpotifyClientSecret(e.target.value)}
                    placeholder="Enter your Spotify Client Secret"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                  />
                </div>

                <button
                  onClick={saveSpotify}
                  disabled={setupStatus.spotify}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 rounded-lg font-semibold transition-all shadow-lg"
                >
                  {setupStatus.spotify ? '✅ Spotify Configured' : 'Save Spotify'}
                </button>

                {setupStatus.spotify && (
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mt-4">
                    <p className="text-sm text-indigo-300">
                      ⚠️ Don't forget: After saving, you need to click "Connect Spotify Account" 
                      in the Music Sanctuary to authorize access to your music!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Completion */}
        {allCompleted && (
          <div className="mt-6 bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">🎉 All Platforms Configured!</h3>
            <p className="mb-4">You can now access all three music platforms!</p>
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Start Using Music Sanctuary →
            </button>
          </div>
        )}

        {/* Skip Option */}
        <div className="mt-6 text-center">
          <button
            onClick={onComplete}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            Skip setup for now (you can configure later in Settings)
          </button>
        </div>
      </div>
    </div>
  );
};
