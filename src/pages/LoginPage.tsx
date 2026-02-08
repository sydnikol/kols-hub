/**
 * Login Page
 *
 * Secure Google OAuth login with PKCE
 * Also supports guest mode for users who prefer not to authenticate
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntegrations } from '../contexts/IntegrationContext';
import { Sparkles, Shield, Lock, CheckCircle, User, LogIn, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, loginAsGuest, isAuthenticated, isGuestUser } = useIntegrations();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login();
      // Navigation happens via useEffect when isAuthenticated changes
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to start login. Please try again or continue as guest.');
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setError(null);
    try {
      loginAsGuest();
      // Navigation happens via useEffect when isAuthenticated changes
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Failed to continue as guest. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              KOL Personal OS
            </h1>
          </div>
          <p className="text-purple-300 text-lg">
            Your Self-Evolving Digital Ecosystem
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-purple-900/20 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Sign In to Continue
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 mb-4"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-purple-500/30" />
            <span className="text-sm text-purple-400">or</span>
            <div className="flex-1 h-px bg-purple-500/30" />
          </div>

          {/* Guest Login Button */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-purple-800/50 hover:bg-purple-700/50 disabled:bg-purple-900/30 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-3 border border-purple-500/30 hover:border-purple-400/50"
          >
            <User className="w-5 h-5" />
            Continue as Guest
          </button>

          {/* Guest Mode Info */}
          <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <p className="text-xs text-purple-300 text-center">
              Guest mode saves data locally. Sign in with Google to sync across devices and access connected services.
            </p>
          </div>

          {/* Security Features */}
          <div className="mt-6 space-y-3 text-sm text-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Secure OAuth 2.0 + PKCE</p>
                <p className="text-purple-300">Industry-standard secure authentication</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Your Data Stays Private</p>
                <p className="text-purple-300">We never store your passwords</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Connect Real Data</p>
                <p className="text-purple-300">Access your health, calendar, and more</p>
              </div>
            </div>
          </div>

          {/* Permissions Info */}
          <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
            <p className="text-xs text-purple-300 leading-relaxed">
              <span className="font-semibold text-white">With Google sign-in, you can access:</span>
              <span className="block mt-2 ml-2 space-y-1">
                <span className="block">• Google Fit (health data)</span>
                <span className="block">• Gmail (read-only)</span>
                <span className="block">• Calendar (read-only)</span>
                <span className="block">• Basic profile info</span>
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Home
          </button>
          <p className="text-purple-400 text-sm mt-4">
            9,000+ features • Always evolving
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
