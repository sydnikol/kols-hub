import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, X, Pill, Heart, Brain, Phone, AlertTriangle,
  MessageCircle, Home, Sparkles, Plus, Clock, Calendar,
  Sun, Moon, Coffee, Dumbbell, Book, Music
} from 'lucide-react';

interface QuickAction {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path?: string;
  action?: () => void;
  color: string;
  category: 'health' | 'mood' | 'productivity' | 'emergency';
}

const QuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyAffirmation, setDailyAffirmation] = useState('');

  // Daily affirmations
  const affirmations = [
    "You are worthy of love and respect.",
    "Today, I choose peace over perfection.",
    "My chronic illness does not define my worth.",
    "I am doing the best I can with what I have.",
    "Small progress is still progress.",
    "I deserve rest without guilt.",
    "My feelings are valid.",
    "I am stronger than I know.",
    "Today is a new opportunity.",
    "I am enough, exactly as I am.",
    "My body is doing its best to support me.",
    "I celebrate my small victories.",
    "Self-care is not selfish.",
    "I release what I cannot control.",
    "My worth is not measured by productivity.",
    "I am allowed to take up space.",
    "I trust my journey, even when it's difficult.",
    "I am resilient and capable.",
    "Today I will be gentle with myself.",
    "I honor my needs and boundaries."
  ];

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    // Set daily affirmation based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyAffirmation(affirmations[dayOfYear % affirmations.length]);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun };
    if (hour < 17) return { text: 'Good afternoon', icon: Coffee };
    if (hour < 21) return { text: 'Good evening', icon: Moon };
    return { text: 'Good night', icon: Moon };
  };

  const quickActions: QuickAction[] = [
    {
      id: 'meds',
      name: 'Take Meds',
      icon: Pill,
      path: '/medications',
      color: 'bg-red-500',
      category: 'health'
    },
    {
      id: 'health',
      name: 'Log Health',
      icon: Heart,
      path: '/health/logs',
      color: 'bg-pink-500',
      category: 'health'
    },
    {
      id: 'mood',
      name: 'Mood Check',
      icon: Brain,
      path: '/mental-health',
      color: 'bg-purple-500',
      category: 'mood'
    },
    {
      id: 'emergency',
      name: 'Emergency',
      icon: AlertTriangle,
      path: '/emergency',
      color: 'bg-orange-500',
      category: 'emergency'
    },
    {
      id: 'chronomuse',
      name: 'ChronoMuse',
      icon: Sparkles,
      path: '/chronomuse',
      color: 'bg-indigo-500',
      category: 'mood'
    },
    {
      id: 'contacts',
      name: 'Contacts',
      icon: Phone,
      path: '/contacts',
      color: 'bg-green-500',
      category: 'emergency'
    }
  ];

  const handleAction = (action: QuickAction) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action) {
      action.action();
    }
    setIsOpen(false);
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 rotate-45'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Zap className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Quick Actions Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-black/90 backdrop-blur-lg rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
          {/* Header with greeting */}
          <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <GreetingIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold text-white">{greeting.text}, Kol</span>
            </div>
            <p className="text-sm text-purple-300 italic">"{dailyAffirmation}"</p>
          </div>

          {/* Quick Actions Grid */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl ${action.color} hover:opacity-80 transition-all transform hover:scale-105`}
                  >
                    <Icon className="w-6 h-6 text-white mb-1" />
                    <span className="text-xs text-white font-medium">{action.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Time */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActionsWidget;
