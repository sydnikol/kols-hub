import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Phone, Heart, Brain, Shield, X,
  Ambulance, MessageCircle, Users, Home, Pill
} from 'lucide-react';

interface EmergencyContact {
  name: string;
  number: string;
  type: 'emergency' | 'support' | 'medical';
}

const EmergencyQuickAccess: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  // Emergency contacts (these should come from user settings)
  const emergencyContacts: EmergencyContact[] = [
    { name: '911 Emergency', number: '911', type: 'emergency' },
    { name: 'Crisis Hotline', number: '988', type: 'support' },
    { name: 'Poison Control', number: '1-800-222-1222', type: 'medical' },
  ];

  const quickLinks = [
    {
      name: 'Crisis Support',
      icon: Shield,
      path: '/emergency',
      color: 'bg-red-500',
      description: 'Coping skills & safety planning'
    },
    {
      name: 'Medication Info',
      icon: Pill,
      path: '/medications',
      color: 'bg-orange-500',
      description: 'Current meds & dosages'
    },
    {
      name: 'Health Summary',
      icon: Heart,
      path: '/health',
      color: 'bg-pink-500',
      description: 'Conditions & recent vitals'
    },
    {
      name: 'Mental Health',
      icon: Brain,
      path: '/mental-health',
      color: 'bg-purple-500',
      description: 'Mood tracking & support'
    },
    {
      name: 'Care Team',
      icon: Users,
      path: '/contacts',
      color: 'bg-blue-500',
      description: 'Doctors & caregivers'
    }
  ];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-40 p-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-all animate-pulse"
        title="Emergency Quick Access"
      >
        <AlertTriangle className="w-5 h-5 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-red-500/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-red-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Emergency Access</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-red-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Emergency Contacts
          </h3>
          <div className="space-y-2">
            {emergencyContacts.map((contact, idx) => (
              <button
                key={idx}
                onClick={() => handleCall(contact.number)}
                className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    contact.type === 'emergency' ? 'bg-red-500' :
                    contact.type === 'support' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-gray-400">{contact.number}</p>
                  </div>
                </div>
                <Ambulance className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <div className={`p-3 rounded-xl ${link.color} mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-white text-sm">{link.name}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{link.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety Message */}
        <div className="p-4 bg-gray-800/50">
          <p className="text-center text-sm text-gray-400">
            If you're in immediate danger, please call 911 or your local emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyQuickAccess;
