import React from 'react';
import { useAuth } from '../../auth/useAuth';
import { User, Mail, Shield, ExternalLink, LogOut, Settings } from 'lucide-react';

interface UserProfileProps {
  className?: string;
  showLogout?: boolean;
  compact?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  className = '',
  showLogout = true,
  compact = false,
}) => {
  const { isAuthenticated, user, logout, isConfigured } = useAuth();

  if (!isConfigured) {
    return (
      <div className={`p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl ${className}`}>
        <p className="text-yellow-400 text-sm">
          Auth0 is not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your environment.
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={`p-4 bg-gray-800/50 border border-gray-700 rounded-xl ${className}`}>
        <p className="text-gray-400 text-center">Not logged in</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl ${className}`}>
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-pink-500/50"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{user.name}</p>
          <p className="text-gray-400 text-sm truncate">{user.email}</p>
        </div>
        {showLogout && (
          <button
            onClick={() => logout()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden ${className}`}>
      {/* Header with avatar */}
      <div className="relative h-24 bg-gradient-to-r from-pink-600/30 to-purple-600/30">
        <div className="absolute -bottom-10 left-6">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-gray-900 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center border-4 border-gray-900 shadow-xl">
              <User className="w-10 h-10 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="pt-14 px-6 pb-6">
        <h3 className="text-xl font-bold text-white">{user.name}</h3>
        {user.nickname && user.nickname !== user.name && (
          <p className="text-gray-400 text-sm">@{user.nickname}</p>
        )}

        <div className="mt-4 space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 text-gray-400">
            <Mail className="w-4 h-4 text-pink-500" />
            <span className="text-sm">{user.email}</span>
            {user.emailVerified && (
              <Shield className="w-4 h-4 text-green-500" title="Email verified" />
            )}
          </div>

          {/* User ID */}
          <div className="flex items-center gap-3 text-gray-500">
            <User className="w-4 h-4" />
            <span className="text-xs font-mono truncate">{user.id}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <a
            href="https://manage.auth0.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            Account
            <ExternalLink className="w-3 h-3" />
          </a>
          {showLogout && (
            <button
              onClick={() => logout()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
