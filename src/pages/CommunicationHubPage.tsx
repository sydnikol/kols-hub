/**
 * Communication Hub Page
 * Discord, Messenger, Zoom, Slack, and more - all embedded
 */

import React from 'react';
import { CommunicationHub } from '../components/communication/CommunicationHub';

const CommunicationHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-950">
      <CommunicationHub className="min-h-screen" />
    </div>
  );
};

export default CommunicationHubPage;
