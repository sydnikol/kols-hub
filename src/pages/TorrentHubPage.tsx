import React from 'react';

const TorrentHub = React.lazy(() => import('../components/torrents/TorrentHub'));

const TorrentHubPage: React.FC = () => {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-lg text-purple-300">Loading Torrent Hub...</p>
        </div>
      </div>
    }>
      <TorrentHub />
    </React.Suspense>
  );
};

export default TorrentHubPage;
