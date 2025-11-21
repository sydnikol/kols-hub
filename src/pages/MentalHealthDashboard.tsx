import React, { useState } from 'react';
import { Brain, Smile, FileText, Shield, AlertCircle, Activity } from 'lucide-react';
import MoodTracker from '../components/mental-health/MoodTracker';
import TherapyJournal from '../components/mental-health/TherapyJournal';
import CopingSkillsLibrary from '../components/mental-health/CopingSkillsLibrary';
import TriggerTracker from '../components/mental-health/TriggerTracker';

type TabType = 'overview' | 'mood' | 'therapy' | 'coping' | 'triggers';

const MentalHealthDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'purple' },
    { id: 'mood', label: 'Mood Tracker', icon: Smile, color: 'blue' },
    { id: 'therapy', label: 'Therapy Journal', icon: FileText, color: 'green' },
    { id: 'coping', label: 'Coping Skills', icon: Shield, color: 'orange' },
    { id: 'triggers', label: 'Trigger Tracker', icon: AlertCircle, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mental Health Dashboard
            </h1>
          </div>
          <p className="text-purple-400">
            Tools for emotional wellness, therapy support, and self-awareness
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-purple-900/20 p-2 rounded-xl border border-purple-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500/30 text-${tab.color}-300 border border-${tab.color}-500/50`
                      : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Smile className="w-6 h-6 text-blue-400" />
                    <h3 className="text-blue-300 font-semibold">Mood Tracker</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Track Daily</p>
                  <p className="text-blue-400 text-sm mt-1">Understand patterns</p>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-green-400" />
                    <h3 className="text-green-300 font-semibold">Therapy Journal</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Prep & Reflect</p>
                  <p className="text-green-400 text-sm mt-1">Session support</p>
                </div>

                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-orange-400" />
                    <h3 className="text-orange-300 font-semibold">Coping Skills</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">10+ Techniques</p>
                  <p className="text-orange-400 text-sm mt-1">Evidence-based</p>
                </div>

                <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <h3 className="text-red-300 font-semibold">Trigger Tracker</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Identify Patterns</p>
                  <p className="text-red-400 text-sm mt-1">Build awareness</p>
                </div>
              </div>

              {/* Feature Description Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Smile className="w-8 h-8 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Mood Tracker</h2>
                  </div>
                  <p className="text-blue-200 mb-4">
                    Track your daily mood, energy levels, sleep quality, and triggers. Identify patterns over time
                    and see what helps you feel better.
                  </p>
                  <ul className="space-y-2 text-blue-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Daily mood scoring (1-10)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Energy and sleep tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Trigger and activity logging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Pattern analysis and trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Gratitude journaling</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Therapy Journal</h2>
                  </div>
                  <p className="text-green-200 mb-4">
                    Prepare for therapy sessions and reflect afterward. Track topics, insights, homework,
                    and progress over time.
                  </p>
                  <ul className="space-y-2 text-green-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Pre-session preparation tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Post-session reflection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Track insights and breakthroughs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Homework and action items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>Export for continuity of care</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-orange-400" />
                    <h2 className="text-2xl font-bold text-white">Coping Skills Library</h2>
                  </div>
                  <p className="text-orange-200 mb-4">
                    Access 10+ evidence-based coping techniques organized by category, time required,
                    and what they're helpful for.
                  </p>
                  <ul className="space-y-2 text-orange-300">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>Grounding, breathing, and cognitive techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>Step-by-step instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>Filter by situation and time available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>Rate effectiveness and track usage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>Add custom skills</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 p-6 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <h2 className="text-2xl font-bold text-white">Trigger Tracker</h2>
                  </div>
                  <p className="text-red-200 mb-4">
                    Log triggers, identify patterns, and understand your responses. Build awareness
                    to develop better coping strategies.
                  </p>
                  <ul className="space-y-2 text-red-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Track emotional and physical responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Log behaviors and urges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Record coping effectiveness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Pattern analysis and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Export for therapy</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-2">About This Dashboard</h3>
                <p className="text-purple-400 leading-relaxed">
                  These tools are designed to support your mental health journey alongside professional care.
                  They help you track patterns, prepare for therapy, learn coping skills, and build self-awareness.
                  All data is stored locally on your device and never shared. If you're in crisis, please call 988
                  (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'mood' && <MoodTracker />}
          {activeTab === 'therapy' && <TherapyJournal />}
          {activeTab === 'coping' && <CopingSkillsLibrary />}
          {activeTab === 'triggers' && <TriggerTracker />}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MentalHealthDashboard;
