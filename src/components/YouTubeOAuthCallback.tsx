// 🔐 YOUTUBE OAUTH CALLBACK HANDLER
// Processes OAuth redirect and sends tokens back to parent window

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function YouTubeOAuthCallback() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the OAuth response from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');
    const tokenType = params.get('token_type');
    const scope = params.get('scope');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      
      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'youtube-oauth-error',
          error: error
        }, window.location.origin);
      }
      
      setTimeout(() => window.close(), 3000);
      return;
    }

    if (accessToken && expiresIn) {
      setStatus('success');
      setMessage('Authentication successful! Closing window...');

      // Send tokens to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'youtube-oauth-success',
          tokens: {
            access_token: accessToken,
            expires_in: parseInt(expiresIn),
            token_type: tokenType || 'Bearer',
            scope: scope || ''
          }
        }, window.location.origin);
      }

      setTimeout(() => {
        window.close();
        navigate('/music');
      }, 1500);
    } else {
      setStatus('error');
      setMessage('Invalid authentication response');
      setTimeout(() => window.close(), 3000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-8">
      <div className="bg-black/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-purple-300 mb-2">Processing...</h2>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Success!</h2>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
            </>
          )}
          
          <p className="text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
}
