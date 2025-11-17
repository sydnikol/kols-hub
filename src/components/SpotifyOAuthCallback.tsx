// 🎵 SPOTIFY OAUTH CALLBACK HANDLER
// Gothic Futurist Music Authentication

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify-service';
import { Music, Check, AlertCircle, Loader } from 'lucide-react';

export const SpotifyOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Authenticating with Spotify...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get authorization code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
          throw new Error(`Spotify authorization failed: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Spotify');
        }

        setMessage('Exchanging authorization code for access token...');

        // Initialize service if needed
        await spotifyService.initialize();

        // Exchange code for tokens
        const success = await spotifyService.handleCallback(code);

        if (success) {
          setStatus('success');
          setMessage('Successfully connected to Spotify!');

          // Fetch initial data
          try {
            await spotifyService.getUserProfile();
            await spotifyService.getUserPlaylists();
          } catch (e) {
            console.warn('Could not fetch initial Spotify data:', e);
          }

          // Redirect to Music Sanctuary after 2 seconds
          setTimeout(() => {
            navigate('/music');
          }, 2000);
        } else {
          throw new Error('Failed to obtain access token');
        }
      } catch (error: any) {
        console.error('Spotify auth error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');

        // Redirect back to music page after 3 seconds
        setTimeout(() => {
          navigate('/music');
        }, 3000);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Music className="w-16 h-16 text-purple-400" />
            {status === 'processing' && (
              <Loader className="w-6 h-6 text-purple-400 absolute -top-2 -right-2 animate-spin" />
            )}
            {status === 'success' && (
              <div className="w-6 h-6 bg-green-500 rounded-full absolute -top-2 -right-2 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-6 h-6 bg-red-500 rounded-full absolute -top-2 -right-2 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-purple-400">
          {status === 'processing' && 'Connecting to Spotify'}
          {status === 'success' && 'Connection Successful!'}
          {status === 'error' && 'Connection Failed'}
        </h2>

        {/* Message */}
        <p className="text-gray-300 text-center mb-6">
          {message}
        </p>

        {/* Progress Indicator */}
        {status === 'processing' && (
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-500 animate-pulse" 
                 style={{ width: '70%' }} />
          </div>
        )}

        {/* Success/Error Icons */}
        {status === 'success' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-green-400">
              <Check className="w-5 h-5" />
              <span>Redirecting to Music Sanctuary...</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>Redirecting back...</span>
            </div>
            <button
              onClick={() => navigate('/music')}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
            >
              Return to Music
            </button>
          </div>
        )}

        {/* Branding */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>KOL Personal OS</p>
          <p>Gothic Futurist Music Sanctuary</p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyOAuthCallback;
