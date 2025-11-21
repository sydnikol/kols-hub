import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  fullScreen = false,
  color = 'purple'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4'
  };

  const colorClasses = {
    purple: 'border-purple-600 border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    green: 'border-green-600 border-t-transparent',
    pink: 'border-pink-600 border-t-transparent'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color as keyof typeof colorClasses] || colorClasses.purple} rounded-full animate-spin`}
      />
      {message && (
        <p className="text-gray-400 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
    <LoadingSpinner size="xl" message={message} />
  </div>
);

export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size="md" message={message} />
  </div>
);

export const ButtonLoader: React.FC = () => (
  <LoadingSpinner size="sm" />
);
