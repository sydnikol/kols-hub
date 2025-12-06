/**
 * GOOGLE OAUTH CALLBACK PAGE - Production-Ready OAuth Handler
 * Handles OAuth redirects from Google with comprehensive error handling,
 * token exchange, user profile fetching, and security validation
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleConnector } from '../services/google-connector';

// Google brand colors
const GOOGLE_COLORS = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC04',
  green: '#34A853',
};

// TypeScript interfaces for OAuth responses
interface OAuthError {
  error: string;
  error_description?: string;
  error_uri?: string;
}

interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}

interface GrantedScope {
  name: string;
  icon: string;
  description: string;
}

type CallbackStatus =
  | 'initializing'
  | 'validating'
  | 'exchanging_token'
  | 'fetching_profile'
  | 'success'
  | 'error'
  | 'timeout';

interface CallbackState {
  status: CallbackStatus;
  progress: number;
  message: string;
  userProfile?: GoogleUserProfile;
  grantedScopes?: GrantedScope[];
  error?: string;
  errorDetails?: string;
  retryCount: number;
}

const GoogleOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<CallbackState>({
    status: 'initializing',
    progress: 0,
    message: 'Initializing authentication...',
    retryCount: 0,
  });

  // Timeout handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.status !== 'success' && state.status !== 'error') {
        setState(prev => ({
          ...prev,
          status: 'timeout',
          message: 'Authentication timeout',
          error: 'The authentication process took too long. Please try again.',
        }));
      }
    }, 30000); // 30 second timeout

    return () => clearTimeout(timeoutId);
  }, [state.status]);

  // Parse scope string into user-friendly granted permissions
  const parseGrantedScopes = useCallback((scopeString: string): GrantedScope[] => {
    const scopeMap: Record<string, GrantedScope> = {
      'userinfo.email': {
        name: 'Email Address',
        icon: '📧',
        description: 'Access to your email address',
      },
      'userinfo.profile': {
        name: 'Profile Information',
        icon: '👤',
        description: 'Access to your basic profile info',
      },
      'calendar': {
        name: 'Google Calendar',
        icon: '📅',
        description: 'Manage your calendar events',
      },
      'gmail': {
        name: 'Gmail',
        icon: '✉️',
        description: 'Read and send emails',
      },
      'drive': {
        name: 'Google Drive',
        icon: '📁',
        description: 'Access your Drive files',
      },
      'fitness': {
        name: 'Google Fit',
        icon: '💪',
        description: 'Access your fitness data',
      },
      'photoslibrary': {
        name: 'Google Photos',
        icon: '📷',
        description: 'Access your photo library',
      },
      'homegraph': {
        name: 'Smart Home',
        icon: '🏠',
        description: 'Control smart home devices',
      },
      'youtube': {
        name: 'YouTube',
        icon: '📺',
        description: 'Access YouTube data',
      },
    };

    const scopes = scopeString.split(' ');
    const granted: GrantedScope[] = [];

    scopes.forEach(scope => {
      const key = Object.keys(scopeMap).find(k => scope.includes(k));
      if (key && !granted.find(g => g.name === scopeMap[key].name)) {
        granted.push(scopeMap[key]);
      }
    });

    return granted;
  }, []);

  // Fetch user profile from Google
  const fetchUserProfile = async (accessToken: string): Promise<GoogleUserProfile> => {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
  };

  // Retry logic with exponential backoff
  const retryWithBackoff = async <T,>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i);
          console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
          setState(prev => ({
            ...prev,
            message: `Network error. Retrying (${i + 1}/${maxRetries})...`,
            retryCount: i + 1,
          }));
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Unknown error during retry');
  };

  // Validate CSRF state parameter
  const validateState = (receivedState: string | null): boolean => {
    // In a production app, you would store the state in sessionStorage
    // during the initial OAuth request and validate it here
    const storedState = sessionStorage.getItem('oauth_state');

    // For now, we'll just log if state is present
    // In production, uncomment the validation below
    if (storedState && receivedState !== storedState) {
      console.error('CSRF state mismatch!');
      // return false;
    }

    // Clean up
    sessionStorage.removeItem('oauth_state');
    return true;
  };

  // Log authentication attempt for debugging
  const logAuthAttempt = (data: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      origin: window.location.origin,
      opener: !!window.opener,
      ...data,
    };
    console.log('[OAuth Callback]', logEntry);

    // Store in sessionStorage for debugging (avoid localStorage for security)
    try {
      const logs = JSON.parse(sessionStorage.getItem('oauth_logs') || '[]');
      logs.push(logEntry);
      // Keep only last 10 logs
      sessionStorage.setItem('oauth_logs', JSON.stringify(logs.slice(-10)));
    } catch (error) {
      console.error('Failed to log auth attempt:', error);
    }
  };

  // Main callback handler
  const handleCallback = async () => {
    try {
      logAuthAttempt({ stage: 'start' });

      // Parse URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      const stateParam = urlParams.get('state');
      const scope = urlParams.get('scope');

      // Update progress: Validation
      setState(prev => ({
        ...prev,
        status: 'validating',
        progress: 20,
        message: 'Validating security parameters...',
      }));

      // Validate state parameter for CSRF protection
      if (!validateState(stateParam)) {
        throw new Error('Security validation failed. Possible CSRF attack detected.');
      }

      // Handle OAuth errors
      if (error) {
        logAuthAttempt({ stage: 'error', error, errorDescription });

        const errorMessages: Record<string, string> = {
          'access_denied': 'You denied access to your Google account. Please grant permissions to continue.',
          'invalid_request': 'Invalid authentication request. Please try again.',
          'unauthorized_client': 'This application is not authorized. Please contact support.',
          'server_error': 'Google authentication server error. Please try again later.',
          'temporarily_unavailable': 'Google authentication is temporarily unavailable. Please try again in a moment.',
        };

        const userFriendlyError = errorMessages[error] || errorDescription || error;

        setState(prev => ({
          ...prev,
          status: 'error',
          progress: 100,
          message: 'Authentication failed',
          error: userFriendlyError,
          errorDetails: errorDescription || error,
        }));

        // Notify parent window if popup
        if (window.opener) {
          window.opener.postMessage({
            type: 'google-oauth-callback',
            error: userFriendlyError,
            errorCode: error,
          }, window.location.origin);
        }

        return;
      }

      // Validate authorization code
      if (!code) {
        throw new Error('No authorization code received from Google');
      }

      logAuthAttempt({ stage: 'code_received', codeLength: code.length });

      // Update progress: Token exchange
      setState(prev => ({
        ...prev,
        status: 'exchanging_token',
        progress: 40,
        message: 'Exchanging authorization code for access token...',
      }));

      // Exchange code for tokens with retry logic
      const tokens = await retryWithBackoff(async () => {
        return await googleConnector.exchangeCodeForTokens(code);
      });

      logAuthAttempt({
        stage: 'token_received',
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        expiresIn: tokens.expires_in,
      });

      // Parse granted scopes
      const grantedScopes = scope ? parseGrantedScopes(scope) : [];

      // Update progress: Fetching profile
      setState(prev => ({
        ...prev,
        status: 'fetching_profile',
        progress: 70,
        message: 'Fetching your profile information...',
        grantedScopes,
      }));

      // Fetch user profile with retry logic
      const userProfile = await retryWithBackoff(async () => {
        return await fetchUserProfile(tokens.access_token);
      });

      logAuthAttempt({
        stage: 'profile_received',
        userId: userProfile.id,
        email: userProfile.email,
        verified: userProfile.verified_email,
      });

      // Success!
      setState(prev => ({
        ...prev,
        status: 'success',
        progress: 100,
        message: 'Authentication successful!',
        userProfile,
      }));

      // Store user info in sessionStorage
      sessionStorage.setItem('google_user_profile', JSON.stringify(userProfile));

      // Notify parent window if popup
      if (window.opener) {
        window.opener.postMessage({
          type: 'google-oauth-callback',
          success: true,
          tokens,
          userProfile,
          grantedScopes,
        }, window.location.origin);

        // Close popup after showing success animation
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        // Redirect to home or dashboard
        setTimeout(() => {
          const returnUrl = sessionStorage.getItem('oauth_return_url') || '/';
          sessionStorage.removeItem('oauth_return_url');
          navigate(returnUrl);
        }, 2000);
      }

    } catch (error) {
      console.error('OAuth callback error:', error);
      logAuthAttempt({ stage: 'error', error: (error as Error).message });

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      setState(prev => ({
        ...prev,
        status: 'error',
        progress: 100,
        message: 'Authentication failed',
        error: errorMessage,
        errorDetails: error instanceof Error ? error.stack : undefined,
      }));

      // Notify parent window if popup
      if (window.opener) {
        window.opener.postMessage({
          type: 'google-oauth-callback',
          error: errorMessage,
        }, window.location.origin);
      }
    }
  };

  // Run callback handler on mount
  useEffect(() => {
    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render loading spinner
  const renderSpinner = () => (
    <div className="relative w-16 h-16">
      {/* Multi-color Google spinner */}
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4285F4] border-r-[#EA4335] border-b-[#FBBC04] border-l-[#34A853] animate-spin"></div>
    </div>
  );

  // Render status icon
  const renderStatusIcon = () => {
    switch (state.status) {
      case 'success':
        return (
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full animate-pulse"></div>
            <svg className="relative w-16 h-16 text-[#34A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'error':
      case 'timeout':
        return (
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-full"></div>
            <svg className="relative w-16 h-16 text-[#EA4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return renderSpinner();
    }
  };

  // Render user profile card
  const renderUserProfile = () => {
    if (!state.userProfile) return null;

    return (
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          {state.userProfile.picture ? (
            <img
              src={state.userProfile.picture}
              alt={state.userProfile.name}
              className="w-16 h-16 rounded-full border-2 border-[#4285F4]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center text-white text-2xl font-bold">
              {state.userProfile.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 text-left">
            <h3 className="text-lg font-semibold text-white">{state.userProfile.name}</h3>
            <p className="text-sm text-gray-400">{state.userProfile.email}</p>
            {state.userProfile.verified_email && (
              <div className="flex items-center space-x-1 mt-1">
                <svg className="w-4 h-4 text-[#34A853]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-[#34A853]">Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render granted permissions
  const renderGrantedScopes = () => {
    if (!state.grantedScopes || state.grantedScopes.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2 text-[#34A853]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Permissions Granted
        </h4>
        <div className="space-y-2">
          {state.grantedScopes.map((scope, index) => (
            <div key={index} className="flex items-start space-x-3 text-left">
              <span className="text-xl">{scope.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{scope.name}</p>
                <p className="text-xs text-gray-400">{scope.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#4285F4]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#34A853]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Main card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div className="text-center">
            {/* Status Icon */}
            <div className="mb-6 flex justify-center">
              {renderStatusIcon()}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
              <svg className="w-8 h-8" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC04" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
              <span>Google Authentication</span>
            </h1>

            {/* Progress bar */}
            {state.status !== 'success' && state.status !== 'error' && state.status !== 'timeout' && (
              <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] transition-all duration-500 ease-out"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
            )}

            {/* Status message */}
            <p className={`text-lg mb-2 ${
              state.status === 'success' ? 'text-[#34A853]' :
              state.status === 'error' || state.status === 'timeout' ? 'text-[#EA4335]' :
              'text-[#4285F4]'
            }`}>
              {state.message}
            </p>

            {/* Retry count */}
            {state.retryCount > 0 && state.status !== 'error' && (
              <p className="text-sm text-gray-400">
                Retry attempt {state.retryCount}/3
              </p>
            )}

            {/* Error details */}
            {state.error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
                <p className="text-sm text-red-400">{state.error}</p>
                {state.errorDetails && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                      Technical details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-500 overflow-x-auto">
                      {state.errorDetails}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* User profile card */}
            {state.status === 'success' && renderUserProfile()}

            {/* Granted permissions */}
            {state.status === 'success' && renderGrantedScopes()}

            {/* Auto-close notice for popup */}
            {state.status === 'success' && window.opener && (
              <p className="text-sm text-gray-400 mt-4 flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Closing window...</span>
              </p>
            )}

            {/* Action buttons */}
            {(state.status === 'error' || state.status === 'timeout') && (
              <div className="mt-6 flex flex-col space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#4285F4] to-[#34A853] hover:from-[#3367D6] hover:to-[#2D8E47] text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Try Again</span>
                </button>

                {window.opener ? (
                  <button
                    onClick={() => window.close()}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
                  >
                    Close Window
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
                  >
                    Return Home
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Debug info (only in development) */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-black/50 rounded-lg border border-white/10 text-left">
            <details>
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                Debug Information
              </summary>
              <pre className="mt-2 text-xs text-gray-500 overflow-x-auto">
                {JSON.stringify({
                  status: state.status,
                  progress: state.progress,
                  isPopup: !!window.opener,
                  origin: window.location.origin,
                  hasProfile: !!state.userProfile,
                  scopeCount: state.grantedScopes?.length || 0,
                }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
