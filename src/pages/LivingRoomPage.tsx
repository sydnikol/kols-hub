import React from 'react';
import { NavLink } from 'react-router-dom';
import { Tv, Music, Gamepad2, Book, Film, Radio, ExternalLink } from 'lucide-react';

const LivingRoomPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tv className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Living Room Entertainment Center
            </h1>
          </div>
          <p className="text-gray-400">Your cozy entertainment hub</p>
        </div>

        {/* Entertainment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavLink
            to="/streaming-full"
            className="p-6 bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all group"
          >
            <Film className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Streaming Hub</h3>
            <p className="text-gray-400 text-sm">Movies, TV Shows, Documentaries</p>
          </NavLink>

          <NavLink
            to="/media-player"
            className="p-6 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all group"
          >
            <Tv className="w-10 h-10 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Media Player</h3>
            <p className="text-gray-400 text-sm">Play movies, music, audiobooks</p>
          </NavLink>

          <NavLink
            to="/creative"
            className="p-6 bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all group"
          >
            <Music className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Music Room</h3>
            <p className="text-gray-400 text-sm">Playlists and streaming</p>
          </NavLink>

          <NavLink
            to="/emulators"
            className="p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
          >
            <Gamepad2 className="w-10 h-10 text-purple-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Retro Gaming</h3>
            <p className="text-gray-400 text-sm">60+ emulators for all platforms</p>
          </NavLink>

          <NavLink
            to="/entertainment-library"
            className="p-6 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all group"
          >
            <Book className="w-10 h-10 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Entertainment Library</h3>
            <p className="text-gray-400 text-sm">Books, audiobooks, podcasts</p>
          </NavLink>

          <NavLink
            to="/shadow-library"
            className="p-6 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 rounded-xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all group"
          >
            <Radio className="w-10 h-10 text-indigo-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Shadow Library</h3>
            <p className="text-gray-400 text-sm">Free books and resources</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LivingRoomPage;
