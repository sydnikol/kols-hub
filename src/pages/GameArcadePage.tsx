/**
 * Game Arcade Page
 * Playable embedded classic and HTML5 games
 */

import React from 'react';
import { GameArcade } from '../components/entertainment/GameArcade';

const GameArcadePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-black to-purple-950">
      <GameArcade className="min-h-screen" />
    </div>
  );
};

export default GameArcadePage;
