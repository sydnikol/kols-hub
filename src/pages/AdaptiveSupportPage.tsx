import React from 'react';

const AdaptiveSupportHub = React.lazy(() => import('../components/adaptive/AdaptiveSupportHub'));

const AdaptiveSupportPage: React.FC = () => {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-lg text-purple-300">Loading Adaptive Support Hub...</p>
          <p className="text-sm text-gray-500 mt-2">AI Companion • Health • Body Weather • Wardrobe • Daily Life</p>
        </div>
      </div>
    }>
      <AdaptiveSupportHub />
    </React.Suspense>
  );
};

export default AdaptiveSupportPage;
