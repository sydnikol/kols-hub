import React, { useState } from 'react';
import { Heart, Users, Calendar, MessageCircle, Activity, Gift } from 'lucide-react';
import PartnerCareLog from '../components/relationship/PartnerCareLog';
import LoveLanguageTracker from '../components/relationship/LoveLanguageTracker';

type TabType = 'overview' | 'care-log' | 'connection' | 'communication';

const RelationshipDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'purple' },
    { id: 'care-log', label: 'Care Log', icon: Heart, color: 'violet' },
    { id: 'connection', label: 'Connection', icon: Users, color: 'blue' },
    { id: 'communication', label: 'Communication', icon: MessageCircle, color: 'indigo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
              Relationship & Connection Hub
            </h1>
          </div>
          <p className="text-purple-400">
            Tools for nurturing relationships, acknowledging care, and deepening connections
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
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
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
                <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 p-6 rounded-xl border border-violet-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-6 h-6 text-violet-400" />
                    <h3 className="text-violet-300 font-semibold">Care Log</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Track Care</p>
                  <p className="text-violet-400 text-sm mt-1">Acknowledge support</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <h3 className="text-purple-300 font-semibold">Connection</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Build Bonds</p>
                  <p className="text-purple-400 text-sm mt-1">Deepen relationships</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-indigo-300 font-semibold">Communication</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Express Needs</p>
                  <p className="text-indigo-400 text-sm mt-1">Healthy dialogue</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-6 h-6 text-purple-400" />
                    <h3 className="text-purple-300 font-semibold">Gratitude</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Show Thanks</p>
                  <p className="text-purple-400 text-sm mt-1">Express appreciation</p>
                </div>
              </div>

              {/* Feature Description Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 p-6 rounded-xl border border-violet-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-violet-400" />
                    <h2 className="text-2xl font-bold text-white">Partner Care Log</h2>
                  </div>
                  <p className="text-violet-200 mb-4">
                    Acknowledge and track the care you receive from partners, caregivers, and loved ones.
                    Especially valuable for those with chronic illness or disability.
                  </p>
                  <ul className="space-y-2 text-violet-300">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>Log 10 types of care received</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>Track what helped and express gratitude</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>Record reciprocation and mutual support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>Tag entries for easy filtering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>Quick gratitude moments feature</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>Export for sharing or reflection</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Connection Tools</h2>
                  </div>
                  <p className="text-purple-200 mb-4">
                    Activities and prompts to deepen emotional intimacy and maintain meaningful connections
                    with partners, friends, and family.
                  </p>
                  <ul className="space-y-2 text-purple-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Relationship check-in prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Quality time activity ideas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Emotional intimacy exercises</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Love language tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Milestone and anniversary tracker</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Shared goals and dreams log</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-purple-900/40 rounded-lg border border-purple-500/40">
                    <p className="text-purple-300 text-sm italic">
                      Coming soon: Interactive connection-building tools
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageCircle className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-white">Communication Skills</h2>
                  </div>
                  <p className="text-indigo-200 mb-4">
                    Templates, scripts, and guides for healthy communication, setting boundaries, and
                    expressing needs - especially valuable for chronic illness relationships.
                  </p>
                  <ul className="space-y-2 text-indigo-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Boundary-setting scripts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Need expression templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>"I" statement builder</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Difficult conversation prep</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Active listening reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Conflict resolution frameworks</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-indigo-900/40 rounded-lg border border-indigo-500/40">
                    <p className="text-indigo-300 text-sm italic">
                      Coming soon: Communication skill builders
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Gift className="w-8 h-8 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Gratitude & Appreciation</h2>
                  </div>
                  <p className="text-purple-200 mb-4">
                    Express and track gratitude for your relationships. Build a practice of acknowledging
                    the good, even during difficult times.
                  </p>
                  <ul className="space-y-2 text-purple-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Daily gratitude prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Appreciation letter templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Positive memory collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Small joys tracker</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Gift and gesture ideas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Acts of kindness log</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-purple-900/40 rounded-lg border border-purple-500/40">
                    <p className="text-purple-300 text-sm italic">
                      Coming soon: Gratitude practice tools
                    </p>
                  </div>
                </div>
              </div>

              {/* Chronic Illness & Disability Relationships Info */}
              <div className="bg-violet-900/20 p-6 rounded-xl border border-violet-500/30">
                <h3 className="text-xl font-bold text-violet-300 mb-3">
                  Supporting Chronic Illness & Disability Relationships
                </h3>
                <div className="space-y-3 text-violet-200">
                  <p>
                    Chronic illness and disability add unique layers to relationships. These tools are designed
                    to help you acknowledge the care you receive, express gratitude meaningfully, and maintain
                    connection during difficult times.
                  </p>
                  <p>
                    The Care Log helps validate the labor often invisible to others - the emotional support,
                    advocacy, practical help, and patience your partners provide. Acknowledging this care
                    strengthens your relationship and helps you both feel seen.
                  </p>
                  <p className="font-semibold text-violet-100">
                    Remember: Needing care is not a burden. You deserve support, and your relationships are
                    valuable beyond your ability to "do" or "contribute" in traditional ways.
                  </p>
                </div>
              </div>

              {/* Privacy & Data */}
              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Privacy & Your Data</h3>
                <p className="text-purple-400 leading-relaxed">
                  All relationship data is stored locally on your device and never shared or uploaded anywhere.
                  You have full control over your data and can export it anytime. These tools are for your
                  personal reflection and relationship growth.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'care-log' && <PartnerCareLog />}

          {activeTab === 'connection' && <LoveLanguageTracker />}

          {activeTab === 'communication' && (
            <div className="bg-indigo-900/20 p-12 rounded-xl border border-indigo-500/30 text-center">
              <MessageCircle className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Communication Skills Coming Soon</h2>
              <p className="text-indigo-300 max-w-2xl mx-auto">
                Boundary-setting scripts, need expression templates, conflict resolution frameworks, and
                difficult conversation prep tools are currently in development.
              </p>
            </div>
          )}
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

export default RelationshipDashboardPage;
