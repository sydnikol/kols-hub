import React, { Suspense } from 'react';

const ShadowLibraryHub = React.lazy(() => import('../components/library/ShadowLibraryHub'));

const ShadowLibraryPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📚</div>
          <p className="text-purple-300">Loading Shadow Libraries...</p>
        </div>
      </div>
    }>
      <ShadowLibraryHub />
    </Suspense>
  );
};

export default ShadowLibraryPage;
