import React from 'react';
import { useAuth } from '../../auth/useAuth';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';

interface LoginButtonProps {
  className?: string;
  showUserInfo?: boolean;
  variant?: 'button' | 'icon' | 'minimal';
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  className = '',
  showUserInfo = true,
  variant = 'button',
}) => {
  const { isAuthenticated, isLoading, user, login, logout, isConfigured } = useAuth();

  // If Auth0 is not configured, show setup message
  if (!isConfigured) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        Auth not configured
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
        {variant === 'button' && <span className="text-gray-400">Loading...</span>}
      </div>
    );
  }

  // Authenticated state
  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showUserInfo && (
          <div className="flex items-center gap-2">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-pink-500/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            {variant === 'button' && (
              <span className="text-white text-sm hidden md:inline">
                {user.name || user.email}
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => logout()}
          className={`
            flex items-center gap-2 transition-colors
            ${variant === 'button'
              ? 'px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600'
              : 'p-2 hover:bg-gray-800 rounded-lg'
            }
          `}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {variant === 'button' && <span>Logout</span>}
        </button>
      </div>
    );
  }

  // Not authenticated state
  return (
    <button
      onClick={() => login()}
      className={`
        flex items-center gap-2 transition-colors
        ${variant === 'button'
          ? 'px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg shadow-lg shadow-pink-500/25'
          : variant === 'icon'
          ? 'p-2 hover:bg-gray-800 rounded-lg text-pink-400'
          : 'text-pink-400 hover:text-pink-300'
        }
        ${className}
      `}
    >
      <LogIn className="w-4 h-4" />
      {variant === 'button' && <span>Login</span>}
    </button>
  );
};

export default LoginButton;
