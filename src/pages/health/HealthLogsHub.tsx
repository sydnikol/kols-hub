import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, AlertCircle, Pill, FileText, Zap, Image,
  Bell, Stethoscope, AlertTriangle, Heart, Building
} from 'lucide-react';

// Comprehensive Health Logs Hub - All V1 Health Features
const HealthLogsHub: React.FC = () => {
  const healthFeatures = [
    {
      id: 'trends',
      title: 'Trends & Correlations',
      description: 'Visualize how sleep, sodium, meds correlate with pain and energy',
      icon: TrendingUp,
      path: '/health/trends',
      color: 'from-purple-500 to-indigo-500',
      status: 'active'
    },
    {
      id: 'er-visits',
      title: 'Hospital & ER Visits Log',
      description: 'Structured record of all hospital and emergency room visits',
      icon: Hospital,
      path: '/health/er-visits',
      color: 'from-red-500 to-pink-500',
      status: 'active'
    },
    {
      id: 'med-effects',
      title: 'Medication Effect Journal',
      description: 'Track how each medication makes you feel - positive and negative effects',
      icon: Pill,
      path: '/health/med-effects',
      color: 'from-green-500 to-teal-500',
      status: 'active'
    },
    {
      id: 'appointment-notes',
      title: 'Appointment Notes Binder',
      description: 'Doctor-by-doctor notes from all appointments with searchable history',
      icon: FileText,
      path: '/health/appointment-notes',
      color: 'from-blue-500 to-cyan-500',
      status: 'active'
    },
    {
      id: 'triggers',
      title: 'Trigger Library',
      description: 'Catalog of known triggers with symptoms and coping strategies',
      icon: Zap,
      path: '/health/triggers',
      color: 'from-yellow-500 to-orange-500',
      status: 'active'
    },
    {
      id: 'good-days',
      title: 'Good Days Gallery',
      description: 'Photos and quotes from good moments to reference on hard days',
      icon: Image,
      path: '/health/good-days',
      color: 'from-pink-500 to-rose-500',
      status: 'active'
    },
    {
      id: 'vital-alerts',
      title: 'Vitals Threshold Alerts',
      description: 'Get notified when BP or HR cross your personalized thresholds',
      icon: Bell,
      path: '/health/vital-alerts',
      color: 'from-red-600 to-orange-500',
      status: 'active'
    },
    {
      id: 'doctor-protocols',
      title: 'Doctor Protocol Cards',
      description: 'Per-doctor prep: questions to ask, labs to request, visit tips',
      icon: Stethoscope,
      path: '/health/doctor-protocols',
      color: 'from-indigo-500 to-purple-500',
      status: 'active'
    },
    {
      id: 'allergies',
      title: 'Medication Allergies & Sensitivities',
      description: 'Prominent list of all medication and environmental allergies',
      icon: AlertTriangle,
      path: '/health/allergies',
      color: 'from-red-500 to-red-700',
      status: 'active'
    },
    {
      id: 'vitals-snapshot',
      title: 'Vitals Snapshot',
      description: 'Compact BP/HR/O2 display with color-coded thresholds',
      icon: Heart,
      path: '/health/vitals-snapshot',
      color: 'from-rose-500 to-pink-500',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <Heart size={48} />
            Health Logs Hub
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Comprehensive health tracking and analysis tools
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400">{healthFeatures.length} Features Available</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-400">10</div>
            <div className="text-sm text-gray-400 mt-1">Health Tracking Tools</div>
          </div>
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl font-bold text-green-400">100%</div>
            <div className="text-sm text-gray-400 mt-1">Offline Capable</div>
          </div>
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl font-bold text-blue-400">∞</div>
            <div className="text-sm text-gray-400 mt-1">Data Storage</div>
          </div>
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="text-3xl font-bold text-pink-400">V1</div>
            <div className="text-sm text-gray-400 mt-1">Feature Version</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={feature.path}
                className="group bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all hover:transform hover:scale-105"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    {feature.status}
                  </span>
                  <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform">
                    Open →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-purple-400" />
            About Health Logs
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              The Health Logs Hub provides comprehensive tracking tools designed specifically for chronic illness management,
              including EDS, POTS, and other complex conditions.
            </p>
            <p>
              All data is stored locally in your browser using IndexedDB, ensuring privacy and offline access.
              You can export your data at any time for backup or sharing with healthcare providers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                <div>
                  <div className="font-semibold text-white">Privacy First</div>
                  <div className="text-sm text-gray-400">All data stays on your device</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-400 mt-2"></div>
                <div>
                  <div className="font-semibold text-white">Offline Ready</div>
                  <div className="text-sm text-gray-400">Works without internet</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                <div>
                  <div className="font-semibold text-white">Exportable</div>
                  <div className="text-sm text-gray-400">Download your data anytime</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-400 mt-2"></div>
                <div>
                  <div className="font-semibold text-white">Always Improving</div>
                  <div className="text-sm text-gray-400">Features updated regularly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthLogsHub;
