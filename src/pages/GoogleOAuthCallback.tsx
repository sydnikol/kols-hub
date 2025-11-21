/**
 * Google OAuth Callback Page
 * Handles the OAuth redirect from Google and sends the authorization code back to the main app
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Parse the URL to get the authorization code or error
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        setStatus('error');
        setMessage(errorDescription || error || 'Authentication failed');

        // Send error to parent window (for popup flow)
        if (window.opener) {
          window.opener.postMessage({
            type: 'google-oauth-callback',
            error: errorDescription || error,
          }, window.location.origin);
        }

        // Redirect to home after 3 seconds
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/');
          }
        }, 3000);
        return;
      }

      if (code) {
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');

        // Send code to parent window (for popup flow)
        if (window.opener) {
          window.opener.postMessage({
            type: 'google-oauth-callback',
            code,
          }, window.location.origin);

          // Close popup after a brief delay
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // If not a popup, store code temporarily and redirect
          sessionStorage.setItem('google_auth_code', code);
          navigate('/');
        }
      } else {
        setStatus('error');
        setMessage('No authorization code received');

        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/');
          }
        }, 3000);
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage('Failed to process authentication');

      setTimeout(() => {
        if (window.opener) {
          window.close();
        } else {
          navigate('/');
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-8 rounded-xl border border-purple-500/30 max-w-md w-full">
        <div className="text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'processing' && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
              </div>
            )}
            {status === 'success' && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Google Authentication
          </h1>

          {/* Message */}
          <p className={`text-lg ${
            status === 'success' ? 'text-green-400' :
            status === 'error' ? 'text-red-400' :
            'text-purple-400'
          }`}>
            {message}
          </p>

          {/* Additional info for popup */}
          {status === 'success' && window.opener && (
            <p className="text-sm text-purple-400 mt-4">
              This window will close automatically...
            </p>
          )}

          {/* Manual close button for errors */}
          {status === 'error' && window.opener && (
            <button
              onClick={() => window.close()}
              className="mt-6 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
            >
              Close Window
            </button>
          )}

          {/* Return home button for non-popup */}
          {status === 'error' && !window.opener && (
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors"
            >
              Return Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
