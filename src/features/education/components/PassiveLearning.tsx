import React, { useState, useEffect } from 'react';
import { 
  Brain, Clock, Zap, BookOpen, Trophy, Star, 
  ChevronRight, Play, CheckCircle, Coffee, Sparkles,
  Headphones, Video, FileText, Award, TrendingUp, GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEducationStore } from '../store/educationStore';

const PassiveLearning: React.FC = () => {
  const { energyLevel, addPassiveSession, passiveSessions } = useEducationStore();
  const [activeContent, setActiveContent] = useState<any>(null);
  const [todayMinutes, setTodayMinutes] = useState(0);

  // Calculate today's passive learning time
  useEffect(() => {
    const today = new Date().toDateString();
    const todaySessions = passiveSessions.filter(
      s => new Date(s.completedAt).toDateString() === today
    );
    const total = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    setTodayMinutes(total);
  }, [passiveSessions]);

  const passiveResources = [
    {
      id: 'crash-course',
      title: 'CrashCourse (YouTube)',
      type: 'video',
      icon: Video,
      color: 'blue',
      topics: ['History', 'Science', 'Literature', 'Psychology', 'Economics'],
      energy: 'low',
      credits: 'ACE-approved content',
      url: 'https://www.youtube.com/@crashcourse',
      description: 'Watch while resting. Many courses align with college credit exams.'
    },
    {
      id: 'khan-academy',
      title: 'Khan Academy',
      type: 'interactive',
      icon: BookOpen,
      color: 'green',
      topics: ['Math', 'Science', 'Computing', 'Economics', 'Humanities'],
      energy: 'medium',
      credits: 'SAT/AP prep → college credit',
      url: 'https://www.khanacademy.org',
      description: 'Self-paced, free, tracks progress. Study for CLEP exams.'
    },
    {
      id: 'coursera-audit',
      title: 'Coursera (Audit Free)',
      type: 'course',
      icon: Award,
      color: 'purple',
      topics: ['Business', 'Data Science', 'Arts', 'Health', 'Social Science'],
      energy: 'medium',
      credits: 'Partner universities offer credit',
      url: 'https://www.coursera.org',
      description: 'Audit courses FREE. Pay only for certificates if wanted.'
    },
    {
      id: 'modern-states',
      title: 'Modern States CLEP Prep',
      type: 'course',
      icon: GraduationCap,
      color: 'pink',
      topics: ['All CLEP exam subjects'],
      energy: 'low',
      credits: 'FREE CLEP vouchers + up to 30 credits',
      url: 'https://modernstates.org',
      description: 'Free courses + free exam vouchers. Earn real college credit!'
    },
    {
      id: 'saylor',
      title: 'Saylor Academy',
      type: 'course',
      icon: Brain,
      color: 'indigo',
      topics: ['100+ college-level courses'],
      energy: 'medium',
      credits: 'ACE-recommended credit',
      url: 'https://www.saylor.org',
      description: 'Fully free. Many courses recommended for college credit.'
    },
    {
      id: 'edx-audit',
      title: 'edX (Audit Free)',
      type: 'course',
      icon: Award,
      color: 'cyan',
      topics: ['Computer Science', 'Engineering', 'Humanities', 'Business'],
      energy: 'medium',
      credits: 'MicroBachelors can transfer',
      url: 'https://www.edx.org',
      description: 'Audit Harvard, MIT courses free. Certificate optional.'
    },
    {
      id: 'podcasts',
      title: 'Educational Podcasts',
      type: 'audio',
      icon: Headphones,
      color: 'rose',
      topics: ['Everything'],
      energy: 'very-low',
      credits: 'Supplemental learning',
      url: '',
      description: 'Listen while resting: Radiolab, 99% Invisible, Hidden Brain, Stuff You Should Know'
    },
    {
      id: 'sophia',
      title: 'Sophia Learning',
      type: 'course',
      icon: Star,
      color: 'amber',
      topics: ['General Education courses'],
      energy: 'low',
      credits: 'ACE credit (low monthly fee)',
      url: 'https://www.sophia.org',
      description: '$99/month unlimited. Self-paced, widely accepted.'
    },
    {
      id: 'study-com',
      title: 'Study.com',
      type: 'course',
      icon: FileText,
      color: 'emerald',
      topics: ['300+ courses'],
      energy: 'medium',
      credits: 'ACE credit (subscription)',
      url: 'https://study.com',
      description: 'Video lessons + quizzes. Many schools accept credits.'
    },
    {
      id: 'open-culture',
      title: 'Open Culture',
      type: 'mixed',
      icon: Sparkles,
      color: 'violet',
      topics: ['Free courses, audiobooks, movies'],
      energy: 'very-low',
      credits: 'Enrichment learning',
      url: 'https://www.openculture.com',
      description: '1500+ free courses. Listen, watch, learn passively.'
    }
  ];

  const energyFiltered = passiveResources.filter(resource => {
    if (energyLevel === 'low') return resource.energy === 'very-low' || resource.energy === 'low';
    if (energyLevel === 'medium') return resource.energy !== 'high';
    return true;
  });

  const handleStartSession = (resource: any) => {
    setActiveContent(resource);
    addPassiveSession(resource.id, resource.title, 'started');
  };

  const handleCompleteSession = (minutes: number) => {
    if (activeContent) {
      addPassiveSession(activeContent.id, activeContent.title, 'completed', minutes);
      setActiveContent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-500/10 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{todayMinutes}min</div>
              <div className="text-xs text-gray-400">Today's Learning</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-2xl font-bold capitalize">{energyLevel}</div>
              <div className="text-xs text-gray-400">Current Energy</div>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{passiveSessions.length}</div>
              <div className="text-xs text-gray-400">Total Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy-Based Message */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Coffee className={`w-6 h-6 mt-1 ${energyLevel === 'low' ? 'text-amber-400' : 'text-blue-400'}`} />
          <div>
            <h3 className="font-semibold mb-1">
              {energyLevel === 'low' && '☕ Low Energy Mode: Listen & Watch'}
              {energyLevel === 'medium' && '✨ Medium Energy: Light Interaction OK'}
              {energyLevel === 'high' && '🚀 High Energy: Full Engagement Ready'}
            </h3>
            <p className="text-sm text-gray-400">
              {energyLevel === 'low' && 'Try podcasts, YouTube videos, or audiobooks. No pressure to take notes.'}
              {energyLevel === 'medium' && 'Self-paced courses are perfect. Go at your own speed.'}
              {energyLevel === 'high' && 'Great time for interactive courses with quizzes and activities.'}
            </p>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Passive Learning Resources
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({energyFiltered.length} matched to your energy)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {energyFiltered.map((resource) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-${resource.color}-500/10 backdrop-blur-xl rounded-xl p-5 border border-${resource.color}-500/20 hover:border-${resource.color}-500/40 transition-all cursor-pointer group`}
                onClick={() => resource.url && window.open(resource.url, '_blank')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${resource.color}-500/20 rounded-lg`}>
                      <Icon className={`w-5 h-5 text-${resource.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-white transition-colors">
                        {resource.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-${resource.color}-500/20 text-${resource.color}-300`}>
                          {resource.type}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {resource.energy} energy
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-sm text-gray-400 mb-3">{resource.description}</p>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {resource.topics.slice(0, 3).map((topic: string) => (
                    <span key={topic} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">
                      {topic}
                    </span>
                  ))}
                  {resource.topics.length > 3 && (
                    <span className="text-xs text-gray-500">+{resource.topics.length - 3} more</span>
                  )}
                </div>

                <div className={`flex items-center gap-2 text-sm font-medium text-${resource.color}-400`}>
                  <Award className="w-4 h-4" />
                  <span>{resource.credits}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartSession(resource);
                  }}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-${resource.color}-500/20 hover:bg-${resource.color}-500/30 text-${resource.color}-300 font-medium transition-all`}
                >
                  <Play className="w-4 h-4" />
                  Start Session
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Session Modal */}
      {activeContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/30"
          >
            <h3 className="text-xl font-bold mb-2">{activeContent.title}</h3>
            <p className="text-gray-400 text-sm mb-6">{activeContent.description}</p>

            <div className="space-y-3">
              <p className="text-sm text-gray-400">How long did you learn?</p>
              {[5, 10, 15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleCompleteSession(mins)}
                  className="w-full px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium transition-all"
                >
                  {mins} minutes
                </button>
              ))}
              <button
                onClick={() => setActiveContent(null)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PassiveLearning;
