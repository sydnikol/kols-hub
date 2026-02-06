import React, { Suspense } from 'react';

const EmulatorHubComplete = React.lazy(() => import('../components/gaming/EmulatorHubComplete'));

const EmulatorHubPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🎮</div>
          <p className="text-indigo-300">Loading Emulator Hub...</p>
        </div>
      </div>
    }>
      <EmulatorHubComplete />
    </Suspense>
  );
};

export default EmulatorHubPage;
