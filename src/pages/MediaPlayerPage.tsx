import React, { Suspense } from 'react';

const UniversalMediaPlayer = React.lazy(() => import('../components/media/UniversalMediaPlayer'));

const MediaPlayerPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📺</div>
          <p className="text-indigo-300">Loading Media Player...</p>
        </div>
      </div>
    }>
      <UniversalMediaPlayer />
    </Suspense>
  );
};

export default MediaPlayerPage;
