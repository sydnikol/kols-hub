import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Heart, Brain, Gamepad2, Book, Music, Home, Activity, Pill } from 'lucide-react';

const SimpleLanding: React.FC = () => {
  const quickLinks = [
    { path: '/gothic-bratz-dollhouse', name: 'Gothic Bratz Dollhouse', icon: Home, color: 'purple' },
    { path: '/health', name: 'Health Dashboard', icon: Heart, color: 'red' },
    { path: '/medications', name: 'Medications', icon: Pill, color: 'pink' },
    { path: '/adaptive-support', name: 'Adaptive Support', icon: Activity, color: 'green' },
    { path: '/ai-characters', name: 'AI Characters', icon: Brain, color: 'indigo' },
    { path: '/gaming', name: 'Gaming Hub', icon: Gamepad2, color: 'blue' },
    { path: '/emulators', name: 'Emulators', icon: Gamepad2, color: 'cyan' },
    { path: '/education', name: 'Education', icon: Book, color: 'yellow' },
    { path: '/creative', name: 'Creative Studio', icon: Music, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Kol's Hub
            </h1>
          </div>
          <p className="text-xl text-gray-400">Your Gothic Bratz Dollhouse Digital Sanctuary</p>
          <p className="text-sm text-gray-500 mt-2">"One hand on the keyboard, one hand on the altar"</p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="p-6 bg-purple-900/30 rounded-xl border border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-900/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <link.icon className={`w-8 h-8 text-${link.color}-400`} />
                <span className="text-lg font-medium">{link.name}</span>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">9,000+</div>
              <div className="text-sm text-gray-500">Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">22+</div>
              <div className="text-sm text-gray-500">Medications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">60+</div>
              <div className="text-sm text-gray-500">Emulators</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLanding;
