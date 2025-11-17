import React, { useState } from 'react';
import { 
  GraduationCap, FileText, Award, TrendingUp, BookOpen, 
  Clock, Target, Sparkles, Brain, Coffee, Briefcase 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreditTracker from './components/CreditTracker';
import ResumeBuilder from './components/ResumeBuilder';
import MicroLearning from './components/MicroLearning';
import SkillsPortfolio from './components/SkillsPortfolio';
import { useEducationStore } from './store/educationStore';

interface EducationHubProps {
  onClose?: () => void;
}

const EducationHub: React.FC<EducationHubProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'credits' | 'resume' | 'learn' | 'portfolio'>('learn');
  const { totalCredits, completedCourses, activeGoals } = useEducationStore();

  const tabs = [
    { id: 'learn' as const, label: 'Micro Learn', icon: Brain, color: 'purple' },
    { id: 'credits' as const, label: 'Credits', icon: GraduationCap, color: 'blue' },
    { id: 'resume' as const, label: 'Resume', icon: FileText, color: 'green' },
    { id: 'portfolio' as const, label: 'Portfolio', icon: Briefcase, color: 'pink' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/30">
              <GraduationCap className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Education Sanctum
              </h1>
              <p className="text-gray-400 text-sm">Low-pressure learning, passive growth</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-500/10 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{totalCredits}</div>
                <div className="text-xs text-gray-400">College Credits</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <div className="text-xs text-gray-400">Courses Done</div>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{activeGoals}</div>
                <div className="text-xs text-gray-400">Active Goals</div>
              </div>
            </div>
          </div>

          <div className="bg-pink-500/10 backdrop-blur-xl rounded-2xl p-4 border border-pink-500/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <div>
                <div className="text-2xl font-bold">Auto</div>
                <div className="text-xs text-gray-400">Resume Updates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                  ${isActive 
                    ? `bg-${tab.color}-500/20 border-${tab.color}-500/50 text-${tab.color}-300` 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }
                  border backdrop-blur-xl
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'learn' && <MicroLearning />}
            {activeTab === 'credits' && <CreditTracker />}
            {activeTab === 'resume' && <ResumeBuilder />}
            {activeTab === 'portfolio' && <SkillsPortfolio />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EducationHub;
