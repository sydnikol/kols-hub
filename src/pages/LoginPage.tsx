/**
 * Login Page
 *
 * Secure Google OAuth login
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntegrations } from '../contexts/IntegrationContext';
import { Sparkles, Shield, Lock, CheckCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useIntegrations();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
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

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 mb-6"
          >
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
            Continue with Google
          </button>

          {/* Security Features */}
          <div className="space-y-3 text-sm text-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Secure OAuth 2.0</p>
                <p className="text-purple-300">Industry-standard authentication protocol</p>
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
              By signing in, you'll grant access to:
              <span className="block mt-1 ml-2">
                • Google Fit (health data)
                <br />
                • Gmail (read-only)
                <br />
                • Calendar (read-only)
                <br />
                • Basic profile info
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
            Continue without signing in
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
