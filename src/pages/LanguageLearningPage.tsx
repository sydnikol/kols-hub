/**
 * Language Learning Hub Page
 * Full-featured language learning with embedded resources
 */

import React from 'react';
import { LanguageLearningHub } from '../components/learning/LanguageLearningHub';

const LanguageLearningPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950">
      <div className="max-w-7xl mx-auto">
        <LanguageLearningHub className="min-h-screen" />
      </div>
    </div>
  );
};

export default LanguageLearningPage;
