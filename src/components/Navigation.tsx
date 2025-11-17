import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Heart, Brain, Lightbulb, Scissors, Film, 
  Dice3, Sparkles, Scale, BookOpen, Users, Settings, GraduationCap
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/health', icon: Heart, label: 'Health' },
  { path: '/mental-health', icon: Brain, label: 'Mental Health' },
  { path: '/education', icon: GraduationCap, label: 'Education' },
  { path: '/learning', icon: BookOpen, label: 'Learning Hub' },
  { path: '/sewing', icon: Scissors, label: 'Sewing Studio' },
  { path: '/ideas-vault', icon: Lightbulb, label: 'Ideas Vault' },
  { path: '/entertainment', icon: Film, label: 'Entertainment' },
  { path: '/kollective', icon: Dice3, label: 'The Kollective' },
  { path: '/hearing-companion', icon: Scale, label: 'Hearing Companion' },
  { path: '/kitchen-witch', icon: Sparkles, label: 'Kitchen Witch' },
  { path: '/companions', icon: Users, label: 'AI Companions' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-screen w-20 bg-gradient-to-b from-indigo-950 to-purple-950 border-r border-indigo-800/30 flex flex-col items-center py-6 gap-4 z-50">
      {/* Logo */}
      <div className="mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-900/50">
          K
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-2 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="relative group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-14 h-14 rounded-xl flex items-center justify-center
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/50' 
                    : 'bg-indigo-900/30 hover:bg-indigo-800/50'
                  }
                `}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
              </motion.div>

              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="bg-indigo-900 text-white px-3 py-2 rounded-lg shadow-xl border border-indigo-700">
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-indigo-400 text-xs">v2.0</div>
    </nav>
  );
}
