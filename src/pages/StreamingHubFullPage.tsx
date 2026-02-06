/**
 * Streaming Hub Full Page
 * All streaming platforms with activity tracking
 */

import React from 'react';
import { StreamingLauncher } from '../components/entertainment/StreamingLauncher';

const StreamingHubFullPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-purple-950">
      <StreamingLauncher className="min-h-screen" />
    </div>
  );
};

export default StreamingHubFullPage;
