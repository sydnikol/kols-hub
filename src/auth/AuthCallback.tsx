import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const { isLoading, isAuthenticated, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error('Auth0 callback error:', error);
        navigate('/login?error=' + encodeURIComponent(error.message));
      } else if (isAuthenticated) {
        // Redirect to dashboard or stored return path
        const returnTo = localStorage.getItem('auth_return_to') || '/dashboard';
        localStorage.removeItem('auth_return_to');
        navigate(returnTo);
      }
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-300 text-lg">Authenticating...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we verify your identity</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="text-center p-8 bg-black/50 rounded-xl border border-red-500/30">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Authentication Error</h2>
          <p className="text-gray-400">{error.message}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
