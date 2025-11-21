import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showToast && isOnline) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      showToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
    }`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <div>
              <p className="font-semibold">Back Online</p>
              <p className="text-xs opacity-90">All features available</p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <div>
              <p className="font-semibold">You're Offline</p>
              <p className="text-xs opacity-90">Some features may be limited</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
