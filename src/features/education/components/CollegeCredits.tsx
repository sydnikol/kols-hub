import React, { useState } from 'react';
import { 
  GraduationCap, Award, BookOpen, CheckCircle, Clock, 
  Target, TrendingUp, FileText, ExternalLink, Plus,
  Star, Zap, Calendar, DollarSign, Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEducationStore } from '../store/educationStore';

const CollegeCredits: React.FC = () => {
  const { credits, totalCredits, addCredit } = useEducationStore();
  const [showAddCredit, setShowAddCredit] = useState(false);

  const creditSources = [
    {
      name: 'CLEP Exams',
      description: 'Test out of intro courses. 3-6 credits per exam.',
      cost: 'FREE vouchers from ModernStates.org',
      credits: '3-12 per exam',
      url: 'https://modernstates.org',
      icon: Award,
      color: 'purple',
      exams: [
        { name: 'College Composition', credits: 6, difficulty: 'Medium' },
        { name: 'College Mathematics', credits: 6, difficulty: 'Medium' },
        { name: 'American Government', credits: 3, difficulty: 'Easy' },
        { name: 'Intro to Psychology', credits: 3, difficulty: 'Easy' },
        { name: 'Intro to Sociology', credits: 3, difficulty: 'Easy' },
        { name: 'Western Civilization I', credits: 3, difficulty: 'Medium' },
        { name: 'Western Civilization II', credits: 3, difficulty: 'Medium' },
        { name: 'US History I', credits: 3, difficulty: 'Easy' },
        { name: 'US History II', credits: 3, difficulty: 'Easy' },
        { name: 'Biology', credits: 6, difficulty: 'Hard' },
        { name: 'Chemistry', credits: 6, difficulty: 'Hard' },
        { name: 'Calculus', credits: 4, difficulty: 'Hard' },
        { name: 'English Literature', credits: 6, difficulty: 'Medium' },
        { name: 'Spanish Language', credits: 6, difficulty: 'Medium' },
        { name: 'French Language', credits: 6, difficulty: 'Medium' },
        { name: 'Financial Accounting', credits: 3, difficulty: 'Hard' },
        { name: 'Information Systems', credits: 3, difficulty: 'Medium' },
        { name: 'Principles of Management', credits: 3, difficulty: 'Easy' },
        { name: 'Principles of Marketing', credits: 3, difficulty: 'Easy' },
        { name: 'Intro to Business Law', credits: 3, difficulty: 'Medium' }
      ]
    },
    {
      name: 'DSST Exams',
      description: 'Similar to CLEP but different subjects.',
      cost: '$85-135 per exam (cheaper than college course)',
      credits: '3 per exam',
      url: 'https://getcollegecredit.com',
      icon: BookOpen,
      color: 'blue',
      exams: [
        { name: 'Ethics in America', credits: 3, difficulty: 'Easy' },
        { name: 'Introduction to Computing', credits: 3, difficulty: 'Easy' },
        { name: 'Fundamentals of Counseling', credits: 3, difficulty: 'Medium' },
        { name: 'Human Resource Management', credits: 3, difficulty: 'Medium' },
        { name: 'Organizational Behavior', credits: 3, difficulty: 'Medium' },
        { name: 'Personal Finance', credits: 3, difficulty: 'Easy' },
        { name: 'Substance Abuse', credits: 3, difficulty: 'Easy' },
        { name: 'Technical Writing', credits: 3, difficulty: 'Medium' },
        { name: 'Criminal Justice', credits: 3, difficulty: 'Easy' },
        { name: 'Lifespan Developmental Psychology', credits: 3, difficulty: 'Medium' }
      ]
    },
    {
      name: 'Sophia Learning',
      description: 'Self-paced online courses, widely accepted.',
      cost: '$99/month unlimited courses',
      credits: '3 per course',
      url: 'https://www.sophia.org',
      icon: Star,
      color: 'amber',
      exams: [
        { name: 'College Algebra', credits: 3, difficulty: 'Medium' },
        { name: 'English Composition I', credits: 3, difficulty: 'Easy' },
        { name: 'English Composition II', credits: 3, difficulty: 'Easy' },
        { name: 'Intro to Statistics', credits: 3, difficulty: 'Medium' },
        { name: 'Microeconomics', credits: 3, difficulty: 'Medium' },
        { name: 'Macroeconomics', credits: 3, difficulty: 'Medium' },
        { name: 'Environmental Science', credits: 3, difficulty: 'Easy' },
        { name: 'Introduction to Ethics', credits: 3, difficulty: 'Easy' },
        { name: 'Approaches to Studying Religions', credits: 3, difficulty: 'Easy' },
        { name: 'Art History I', credits: 3, difficulty: 'Medium' }
      ]
    },
    {
      name: 'Study.com',
      description: 'Video-based college courses.',
      cost: '$199/month for 2 exams',
      credits: '3 per course',
      url: 'https://study.com',
      icon: FileText,
      color: 'green',
      exams: [
        { name: 'Business 104: Information Systems', credits: 3, difficulty: 'Medium' },
        { name: 'English 101: English Literature', credits: 3, difficulty: 'Medium' },
        { name: 'History 101: Western Civilization I', credits: 3, difficulty: 'Easy' },
        { name: 'Math 101: College Algebra', credits: 3, difficulty: 'Hard' },
        { name: 'Psychology 105: Research Methods', credits: 3, difficulty: 'Hard' }
      ]
    },
    {
      name: 'Saylor Academy',
      description: 'Completely free ACE-recommended courses.',
      cost: 'FREE! Optional $25 certificate',
      credits: '3 per course',
      url: 'https://www.saylor.org',
      icon: Gift,
      color: 'pink',
      exams: [
        { name: 'CS101: Introduction to Computer Science I', credits: 3, difficulty: 'Medium' },
        { name: 'ECON101: Principles of Microeconomics', credits: 3, difficulty: 'Medium' },
        { name: 'ENGL001: English Composition I', credits: 3, difficulty: 'Easy' },
        { name: 'HIST103: US History', credits: 3, difficulty: 'Easy' },
        { name: 'MA121: Introduction to Statistics', credits: 3, difficulty: 'Hard' },
        { name: 'POLS101: Introduction to Politics', credits: 3, difficulty: 'Easy' },
        { name: 'PSYCH101: Introduction to Psychology', credits: 3, difficulty: 'Easy' }
      ]
    }
  ];

  const degreeProgress = [
    { category: 'General Education', required: 60, earned: totalCredits, color: 'purple' },
    { category: 'Major Requirements', required: 40, earned: 0, color: 'blue' },
    { category: 'Electives', required: 20, earned: 0, color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Degree Progress */}
      <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <GraduationCap className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Degree Progress</h2>
              <p className="text-gray-400 text-sm">Track your path to a bachelor's degree</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {totalCredits}
            </div>
            <div className="text-sm text-gray-400">of 120 credits</div>
          </div>
        </div>

        {degreeProgress.map((category) => {
          const percentage = Math.min((category.earned / category.required) * 100, 100);
          return (
            <div key={category.category} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{category.category}</span>
                <span className="text-sm text-gray-400">
                  {category.earned} / {category.required} credits
                </span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-400 rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-500/10 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{credits.filter(c => c.completed).length}</div>
              <div className="text-xs text-gray-400">Exams Passed</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{Math.ceil((120 - totalCredits) / 3)}</div>
              <div className="text-xs text-gray-400">Exams to Graduate</div>
            </div>
          </div>
        </div>

        <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-400" />
            <div>
              <div className="text-2xl font-bold">${totalCredits * 400}</div>
              <div className="text-xs text-gray-400">Money Saved</div>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 backdrop-blur-xl rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-2xl font-bold">{Math.round((totalCredits / 120) * 100)}%</div>
              <div className="text-xs text-gray-400">Degree Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Sources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Earn College Credit
          </h2>
          <button
            onClick={() => setShowAddCredit(!showAddCredit)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Credit Earned
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {creditSources.map((source) => {
            const Icon = source.icon;
            return (
              <div
                key={source.name}
                className={`bg-${source.color}-500/10 backdrop-blur-xl rounded-xl p-5 border border-${source.color}-500/20`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${source.color}-500/20 rounded-lg`}>
                      <Icon className={`w-5 h-5 text-${source.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <p className="text-xs text-gray-400">{source.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(source.url, '_blank')}
                    className="p-1 hover:bg-white/10 rounded transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Cost:</span>
                    <span className={`font-medium text-${source.color}-400`}>{source.cost}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Credits per exam:</span>
                    <span className={`font-medium text-${source.color}-400`}>{source.credits}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-gray-400 mb-2">Available Exams:</div>
                  {source.exams.slice(0, 5).map((exam, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                        <span className="text-xs group-hover:text-white transition-colors">{exam.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          exam.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          exam.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {exam.difficulty}
                        </span>
                        <span className={`text-xs font-medium text-${source.color}-400`}>
                          {exam.credits} cr
                        </span>
                      </div>
                    </div>
                  ))}
                  {source.exams.length > 5 && (
                    <div className="text-xs text-gray-500 text-center pt-2">
                      +{source.exams.length - 5} more exams available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Credits History */}
      {credits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            My Earned Credits
          </h2>

          <div className="space-y-2">
            {credits.map((credit) => (
              <div
                key={credit.id}
                className={`bg-white/5 backdrop-blur-xl rounded-lg p-4 border ${
                  credit.completed ? 'border-green-500/20' : 'border-gray-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {credit.completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {!credit.completed && <Clock className="w-5 h-5 text-yellow-400" />}
                    <div>
                      <div className="font-medium">{credit.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>{credit.source}</span>
                        {credit.completionDate && (
                          <>
                            <span>•</span>
                            <span>{new Date(credit.completionDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${credit.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                    {credit.credits} cr
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeCredits;
