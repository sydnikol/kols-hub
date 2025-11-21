import React, { useState } from 'react';
import { Heart, Droplets, Flame, Cloud, MapPin, Shield, Activity, TrendingUp, FileText, ClipboardList, Users, Clock, Settings } from 'lucide-react';
import HydrationDial from '../components/health/HydrationDial';
import SodiumTracker from '../components/health/SodiumTracker';
import BodyWeatherDial from '../components/health/BodyWeatherDial';
import PainMap from '../components/health/PainMap';
import CrisisCalmMode from '../components/crisis/CrisisCalmMode';
import { VitalsTracker } from '../components/VitalsTracker';
import MedicationDashboard from '../components/health/MedicationDashboard';
import DoctorVisitPrep from '../components/health/DoctorVisitPrep';
import HospitalVisitsLog from '../components/health/HospitalVisitsLog';
import TrendsChart from '../components/health/TrendsChart';
import MedicalRecords from '../components/health/MedicalRecords';
import InsuranceTracker from '../components/health/InsuranceTracker';
import CareTeamDirectory from '../components/health/CareTeamDirectory';
import SymptomTimeline from '../components/health/SymptomTimeline';
import AccessibilitySettings from '../components/health/AccessibilitySettings';

type TabType = 'overview' | 'vitals' | 'hydration' | 'sodium' | 'weather' | 'pain' | 'meds' | 'crisis' | 'doctor-prep' | 'symptoms' | 'records' | 'insurance' | 'care-team' | 'hospital' | 'trends' | 'accessibility';

const HealthDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'purple' },
    { id: 'vitals', label: 'Vitals', icon: Heart, color: 'red' },
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: 'blue' },
    { id: 'sodium', label: 'Sodium', icon: Flame, color: 'orange' },
    { id: 'weather', label: 'Body Weather', icon: Cloud, color: 'indigo' },
    { id: 'pain', label: 'Pain Map', icon: MapPin, color: 'red' },
    { id: 'meds', label: 'Medications', icon: Heart, color: 'purple' },
    { id: 'symptoms', label: 'Symptom Timeline', icon: Clock, color: 'purple' },
    { id: 'doctor-prep', label: 'Doctor Visit Prep', icon: ClipboardList, color: 'indigo' },
    { id: 'records', label: 'Medical Records', icon: FileText, color: 'blue' },
    { id: 'insurance', label: 'Insurance', icon: Shield, color: 'green' },
    { id: 'care-team', label: 'Care Team', icon: Users, color: 'cyan' },
    { id: 'hospital', label: 'Hospital Visits', icon: Heart, color: 'red' },
    { id: 'trends', label: 'Trends', icon: TrendingUp, color: 'purple' },
    { id: 'accessibility', label: 'Accessibility', icon: Settings, color: 'indigo' },
    { id: 'crisis', label: 'Crisis Support', icon: Shield, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Health Dashboard
            </h1>
          </div>
          <p className="text-purple-400">
            Complete health tracking & crisis support system
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
                    <Droplets className="w-6 h-6 text-blue-400" />
                    <h3 className="text-blue-300 font-semibold">Hydration</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Track Daily</p>
                  <p className="text-blue-400 text-sm mt-1">Goal: 2.5L</p>
                </div>

                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-6 h-6 text-orange-400" />
                    <h3 className="text-orange-300 font-semibold">Sodium</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">POTS Support</p>
                  <p className="text-orange-400 text-sm mt-1">Goal: 4g</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Cloud className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-indigo-300 font-semibold">Body Weather</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Check In</p>
                  <p className="text-indigo-400 text-sm mt-1">Track your state</p>
                </div>

                <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-6 h-6 text-red-400" />
                    <h3 className="text-red-300 font-semibold">Pain Map</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">Log Pain</p>
                  <p className="text-red-400 text-sm mt-1">Visual tracking</p>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HydrationDial />
                <SodiumTracker />
                <BodyWeatherDial />
                <PainMap />
              </div>
            </div>
          )}

          {activeTab === 'vitals' && <VitalsTracker />}
          {activeTab === 'hydration' && <HydrationDial />}
          {activeTab === 'sodium' && <SodiumTracker />}
          {activeTab === 'weather' && <BodyWeatherDial />}
          {activeTab === 'pain' && <PainMap />}
          {activeTab === 'meds' && <MedicationDashboard />}
          {activeTab === 'symptoms' && <SymptomTimeline />}
          {activeTab === 'doctor-prep' && <DoctorVisitPrep />}
          {activeTab === 'records' && <MedicalRecords />}
          {activeTab === 'insurance' && <InsuranceTracker />}
          {activeTab === 'care-team' && <CareTeamDirectory />}
          {activeTab === 'hospital' && <HospitalVisitsLog />}
          {activeTab === 'trends' && <TrendsChart />}
          {activeTab === 'accessibility' && <AccessibilitySettings />}
          {activeTab === 'crisis' && <CrisisCalmMode />}
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

export default HealthDashboardPage;
