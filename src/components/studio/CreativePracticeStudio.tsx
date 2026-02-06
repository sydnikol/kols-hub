import React from 'react';
import { Palette, Music, PenTool, Camera, Sparkles } from 'lucide-react';

const CreativePracticeStudio: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Creative Practice Studio
            </h1>
          </div>
          <p className="text-gray-400">Your personal space for creative expression</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Digital Art', icon: Palette, color: 'purple' },
            { name: 'Music Creation', icon: Music, color: 'blue' },
            { name: 'Writing', icon: PenTool, color: 'green' },
            { name: 'Photography', icon: Camera, color: 'pink' },
            { name: 'Mixed Media', icon: Sparkles, color: 'yellow' },
          ].map((item) => (
            <div
              key={item.name}
              className={`p-6 bg-${item.color}-900/30 rounded-xl border border-${item.color}-500/30 hover:border-${item.color}-400/50 transition-all cursor-pointer`}
            >
              <item.icon className={`w-8 h-8 text-${item.color}-400 mb-3`} />
              <h3 className="text-xl font-bold">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativePracticeStudio;
