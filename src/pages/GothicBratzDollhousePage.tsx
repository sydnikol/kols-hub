import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Heart, Brain, Gamepad2, Book, Music, Sparkles,
  Pill, Activity, Users, Moon, Star, Palette, ChefHat,
  Crown, Glasses, Shield
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  path: string;
  features: string[];
}

const GothicBratzDollhousePage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const rooms: Room[] = [
    {
      id: 'grand-foyer',
      name: 'Grand Foyer',
      description: 'Dashboard & Navigation Hub',
      icon: Home,
      color: 'purple',
      path: '/dashboard',
      features: ['Quick Stats', 'Navigation', 'Notifications']
    },
    {
      id: 'apothecary',
      name: 'Apothecary',
      description: 'Health & Medications',
      icon: Pill,
      color: 'red',
      path: '/health',
      features: ['22+ Medications', 'Vitals', 'Health Tracking']
    },
    {
      id: 'wardrobe-palace',
      name: 'Wardrobe Palace',
      description: 'Fashion & Style',
      icon: Crown,
      color: 'pink',
      path: '/wardrobe',
      features: ['600+ Items', 'Outfits', 'Style Guide']
    },
    {
      id: 'library-study',
      name: 'Library Study',
      description: 'Education & Reading',
      icon: Book,
      color: 'indigo',
      path: '/education',
      features: ['Courses', 'Books', 'Research']
    },
    {
      id: 'gaming-den',
      name: 'Gaming Den',
      description: 'Gaming & Entertainment',
      icon: Gamepad2,
      color: 'blue',
      path: '/gaming',
      features: ['60+ Emulators', 'Retro Games', 'Arcade']
    },
    {
      id: 'music-room',
      name: 'Music Room',
      description: 'Music & Audio',
      icon: Music,
      color: 'cyan',
      path: '/creative',
      features: ['Playlists', 'Streaming', 'Instruments']
    },
    {
      id: 'creative-studio',
      name: 'Creative Studio',
      description: 'Art & Creativity',
      icon: Palette,
      color: 'orange',
      path: '/creative',
      features: ['Art Projects', 'Writing', 'Design']
    },
    {
      id: 'fortune-teller-alcove',
      name: 'Fortune Teller Alcove',
      description: 'Spirituality & Divination',
      icon: Moon,
      color: 'violet',
      path: '/spirituality',
      features: ['Tarot', 'Hoodoo', 'Rituals']
    },
    {
      id: 'dream-archives',
      name: 'Dream Archives',
      description: 'Dream Journal & Sleep',
      icon: Star,
      color: 'yellow',
      path: '/dream-journal',
      features: ['Dream Log', 'Sleep Tracking', 'Interpretation']
    },
    {
      id: 'ancestor-hall',
      name: 'Ancestor Hall',
      description: 'Family & Heritage',
      icon: Users,
      color: 'amber',
      path: '/ancestry',
      features: ['Family Tree', 'History', 'Memories']
    },
    {
      id: 'cloud-garden',
      name: 'Cloud Garden',
      description: 'Wellness & Relaxation',
      icon: Heart,
      color: 'green',
      path: '/wellness',
      features: ['Meditation', 'Self-Care', 'Mindfulness']
    },
    {
      id: 'rooftop-observatory',
      name: 'Rooftop Observatory',
      description: 'AI & Technology',
      icon: Brain,
      color: 'teal',
      path: '/ai-characters',
      features: ['AI Companions', 'Automation', 'Tech']
    },
    {
      id: 'kitchen-lab',
      name: 'Kitchen Lab',
      description: 'Food & Recipes',
      icon: ChefHat,
      color: 'rose',
      path: '/home',
      features: ['Recipes', 'Meal Plans', 'Nutrition']
    },
    {
      id: 'pet-sanctuary',
      name: 'Pet Sanctuary',
      description: 'Pet Care & Companions',
      icon: Heart,
      color: 'fuchsia',
      path: '/pet-companion',
      features: ['Pet Profiles', 'Care Tips', 'Activities']
    },
    {
      id: 'office-hub',
      name: 'Office Hub',
      description: 'Work & Finance',
      icon: Activity,
      color: 'emerald',
      path: '/financial',
      features: ['Budget', 'Income', 'Goals']
    },
    {
      id: 'guest-quarters',
      name: 'Guest Quarters',
      description: 'Social & Community',
      icon: Users,
      color: 'sky',
      path: '/relationships',
      features: ['Friends', 'Community', 'Events']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Gothic Bratz Dollhouse
            </h1>
            <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-400">Your 16-Room Digital Sanctuary</p>
          <p className="text-sm text-gray-500 mt-2">✨ 220+ AI Dolls • 600+ Wardrobe Items • 9,000+ Features ✨</p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <NavLink
              key={room.id}
              to={room.path}
              className={`p-6 bg-gradient-to-br from-${room.color}-900/40 to-${room.color}-950/40 rounded-2xl border border-${room.color}-500/30 hover:border-${room.color}-400/50 transition-all group hover:scale-105 hover:shadow-xl hover:shadow-${room.color}-500/20`}
              onMouseEnter={() => setSelectedRoom(room.id)}
              onMouseLeave={() => setSelectedRoom(null)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-xl bg-${room.color}-500/20`}>
                  <room.icon className={`w-8 h-8 text-${room.color}-400`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{room.name}</h3>
                  <p className="text-xs text-gray-400">{room.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {room.features.map((feature, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 text-xs bg-${room.color}-500/20 rounded-full text-${room.color}-300`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </NavLink>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">16</div>
              <div className="text-sm text-gray-500">Rooms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">220+</div>
              <div className="text-sm text-gray-500">AI Dolls</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400">600+</div>
              <div className="text-sm text-gray-500">Wardrobe Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">22+</div>
              <div className="text-sm text-gray-500">Medications</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">60+</div>
              <div className="text-sm text-gray-500">Emulators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">9,000+</div>
              <div className="text-sm text-gray-500">Features</div>
            </div>
          </div>
        </div>

        {/* Health Quick Access - Using Real Data */}
        <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-pink-900/20 rounded-2xl border border-red-500/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Pill className="text-red-400" />
            Today's Health Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NavLink to="/medications" className="p-4 bg-red-900/30 rounded-xl hover:bg-red-900/40 transition-all">
              <div className="text-2xl font-bold text-red-300">22+</div>
              <div className="text-sm text-gray-400">Active Medications</div>
              <div className="text-xs text-gray-500 mt-1">Tracked from myUHealth</div>
            </NavLink>
            <NavLink to="/adaptive-support" className="p-4 bg-pink-900/30 rounded-xl hover:bg-pink-900/40 transition-all">
              <div className="text-2xl font-bold text-pink-300">Body Weather</div>
              <div className="text-sm text-gray-400">Track Pain, Energy, Mood</div>
              <div className="text-xs text-gray-500 mt-1">Spoon Theory Tracking</div>
            </NavLink>
            <NavLink to="/health" className="p-4 bg-purple-900/30 rounded-xl hover:bg-purple-900/40 transition-all">
              <div className="text-2xl font-bold text-purple-300">6</div>
              <div className="text-sm text-gray-400">Health Conditions</div>
              <div className="text-xs text-gray-500 mt-1">EDS, POTS, Chronic Pain, ADHD...</div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GothicBratzDollhousePage;
