import React, { useState } from 'react';
import { Users, Heart, Shield, Activity, Calendar, FileText } from 'lucide-react';
import CaregiverInfoHub from '../components/caregiver/CaregiverInfoHub';
import CareSchedule from '../components/caregiver/CareSchedule';
import CareTasks from '../components/caregiver/CareTasks';

type TabType = 'overview' | 'info' | 'schedule' | 'tasks';

const CaregiverDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'cyan' },
    { id: 'info', label: 'Caregiver Info', icon: Users, color: 'blue' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'indigo' },
    { id: 'tasks', label: 'Tasks', icon: FileText, color: 'teal' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-cyan-950 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Caregiver Support Hub
            </h1>
          </div>
          <p className="text-cyan-400">
            Manage caregiver information, schedules, and care coordination
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-cyan-900/20 p-2 rounded-xl border border-cyan-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'bg-cyan-900/20 text-cyan-400 hover:bg-cyan-500/20'
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-cyan-300 font-semibold">Caregiver Info</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Essential</p>
                  <p className="text-cyan-400 text-sm mt-1">Emergency contacts & medical info</p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <h3 className="text-blue-300 font-semibold">Care Schedule</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Organize</p>
                  <p className="text-blue-400 text-sm mt-1">Track who helps when</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-indigo-300 font-semibold">Care Tasks</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Coordinate</p>
                  <p className="text-indigo-400 text-sm mt-1">Share task lists</p>
                </div>
              </div>

              {/* Feature Descriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white">Caregiver Information Hub</h2>
                  </div>
                  <p className="text-cyan-200 mb-4">
                    Store and share critical information with those who care for you. Emergency contacts,
                    medical details, and situation-specific care instructions all in one place.
                  </p>
                  <ul className="space-y-2 text-cyan-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Emergency contacts with priority levels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Medical information by category</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Situation-specific care instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Medical POA and prescription pickup tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>Export or copy all info for sharing</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Care Schedule</h2>
                  </div>
                  <p className="text-blue-200 mb-4">
                    Coordinate care with multiple helpers. Track who's available when, schedule
                    recurring help, and ensure continuous support.
                  </p>
                  <ul className="space-y-2 text-blue-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Weekly care calendar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Recurring care shifts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Availability tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Last-minute coverage requests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Share schedule with caregivers</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-white">Care Task Lists</h2>
                  </div>
                  <p className="text-indigo-200 mb-4">
                    Create and share task lists with caregivers. Track what needs to be done,
                    who's doing it, and ensure nothing falls through the cracks.
                  </p>
                  <ul className="space-y-2 text-indigo-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Daily care task checklists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Medication administration logs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Assign tasks to specific caregivers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Track completion status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>Notes and updates from caregivers</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Caregiver Wellness</h2>
                  </div>
                  <p className="text-purple-200 mb-4">
                    Support those who support you. Track caregiver well-being, prevent burnout,
                    and ensure sustainable care relationships.
                  </p>
                  <ul className="space-y-2 text-purple-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Caregiver burnout check-ins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Respite care scheduling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Appreciation and gratitude tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Caregiver resources and support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>Balance monitoring and alerts</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-purple-900/40 rounded-lg border border-purple-500/40">
                    <p className="text-purple-300 text-sm italic">
                      Support for caregivers is essential - track their wellbeing and prevent burnout
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-300 mb-3">
                  About Caregiver Support
                </h3>
                <div className="space-y-3 text-cyan-200">
                  <p>
                    Having chronic illness or disability often means relying on others for support. This
                    hub helps you organize that care, communicate needs clearly, and maintain healthy
                    caregiver relationships.
                  </p>
                  <p>
                    Whether it's a partner, parent, friend, or professional caregiver - good communication
                    and organization make care better for everyone involved.
                  </p>
                  <p className="font-semibold text-cyan-100">
                    Your needs are valid. Organizing care doesn't mean you're a burden - it means you're
                    taking charge of your health and building sustainable support systems.
                  </p>
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-lg font-bold text-blue-300 mb-2">Privacy & Your Data</h3>
                <p className="text-blue-400 leading-relaxed">
                  All caregiver information is stored locally on your device. You control what you share
                  and with whom. Export features let you share specific info with trusted caregivers
                  while keeping your data private and secure.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'info' && <CaregiverInfoHub />}

          {activeTab === 'schedule' && <CareSchedule />}

          {activeTab === 'tasks' && <CareTasks />}
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

export default CaregiverDashboardPage;
