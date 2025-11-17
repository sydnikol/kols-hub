import React, { useState } from 'react';
import { Plus, Award, TrendingUp, CheckCircle2, ExternalLink, BookOpen, Sparkles } from 'lucide-react';
import { useEducationStore } from '../store/educationStore';

const CreditTracker: React.FC = () => {
  const { credits, addCredit, totalCredits } = useEducationStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFreeResources, setShowFreeResources] = useState(false);
  
  const creditSources = [
    { name: 'CLEP', color: 'blue', earned: 12, possible: 120 },
    { name: 'Sophia', color: 'purple', earned: 18, possible: 90 },
    { name: 'Study.com', color: 'green', earned: 6, possible: 60 },
    { name: 'Traditional', color: 'orange', earned: 24, possible: 120 }
  ];

  const degreeProgress = {
    associates: { required: 60, current: totalCredits },
    bachelors: { required: 120, current: totalCredits }
  };

  const freeResourcesData = [
    {
      category: 'FREE College Credit (Zero Cost)',
      resources: [
        {
          name: 'Modern States',
          url: 'https://modernstates.org',
          description: '100% FREE CLEP prep courses + FREE exam vouchers = FREE college credit',
          credits: '3-6 credits per exam',
          cost: '$0 (completely free)',
          subjects: ['33 CLEP subjects', 'Complete degree pathways', 'All gen eds'],
          highlight: '✨ START HERE - Easiest path to free credits!'
        },
        {
          name: 'Khan Academy + Modern States',
          url: 'https://www.khanacademy.org',
          description: 'Free study materials paired with Modern States for free exams',
          credits: 'Varies by exam',
          cost: '$0 (completely free)',
          subjects: ['Math', 'Science', 'Humanities', 'Economics']
        }
      ]
    },
    {
      category: 'Low-Cost College Credit (Best Value)',
      resources: [
        {
          name: 'Sophia Learning',
          url: 'https://www.sophia.org',
          description: 'Self-paced ACE-approved courses, complete 2-4 courses per month',
          credits: '3 credits per course',
          cost: 'First month free, then $99/month',
          subjects: ['Psychology', 'Sociology', 'English', 'Math', 'Business'],
          highlight: 'Best value for bulk credits - get 9-12 credits in one month'
        },
        {
          name: 'Study.com',
          url: 'https://study.com',
          description: 'ACE-recommended courses with 7-day free trial',
          credits: '3 credits per course',
          cost: '7-day free trial, then $199/month',
          subjects: ['All majors', 'Test prep', 'Professional development']
        }
      ]
    },
    {
      category: 'Professional Certificates (Resume Builders)',
      resources: [
        {
          name: 'Google Career Certificates',
          url: 'https://grow.google/certificates',
          description: 'Industry-recognized certificates, financial aid available',
          credits: 'Professional certificate',
          cost: 'Financial aid available',
          subjects: ['Data Analytics', 'Project Management', 'UX Design', 'IT Support', 'Digital Marketing']
        },
        {
          name: 'Coursera',
          url: 'https://www.coursera.org',
          description: 'Financial aid available for most courses, audit for free',
          credits: 'Professional certificates',
          cost: 'Free to audit, ~$39-79/month for certificates',
          subjects: ['Google', 'IBM', 'Meta certificates', 'University courses']
        },
        {
          name: 'edX',
          url: 'https://www.edx.org',
          description: 'Audit university courses for free, pay only for certificate',
          credits: 'MicroMasters, Professional certificates',
          cost: 'Free to audit, $50-300 for certificates',
          subjects: ['Harvard', 'MIT', 'Microsoft', 'All fields']
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* FREE RESOURCES BANNER */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-emerald-500/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="text-xl font-bold text-emerald-100">Start Earning FREE College Credit Today!</h3>
              <p className="text-emerald-300 text-sm">Modern States offers 100% free courses + free exam vouchers = $0 cost</p>
            </div>
          </div>
          <button
            onClick={() => setShowFreeResources(!showFreeResources)}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-all"
          >
            View Free Resources
          </button>
        </div>
      </div>

      {/* Free Resources Panel */}
      {showFreeResources && (
        <div className="space-y-6">
          {freeResourcesData.map((category, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-purple-300">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.resources.map((resource, ridx) => (
                  <div key={ridx} className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-5 hover:border-purple-400/50 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg text-purple-100">{resource.name}</h4>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-200"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>
                    <p className="text-sm text-purple-200 mb-3">{resource.description}</p>
                    {resource.highlight && (
                      <div className="mb-3 px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium">
                        {resource.highlight}
                      </div>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-semibold">Credits:</span>
                        <span className="text-purple-200">{resource.credits}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-semibold">Cost:</span>
                        <span className="text-purple-200">{resource.cost}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-purple-400 font-semibold text-xs">Subjects:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resource.subjects.map((subject, sidx) => (
                            <span key={sidx} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Degree Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            Associate's Degree
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="font-semibold text-blue-400">
                {degreeProgress.associates.current} / {degreeProgress.associates.required} credits
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(degreeProgress.associates.current / degreeProgress.associates.required) * 100}%` }}
              />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.round((degreeProgress.associates.current / degreeProgress.associates.required) * 100)}% Complete
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Bachelor's Degree
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="font-semibold text-purple-400">
                {degreeProgress.bachelors.current} / {degreeProgress.bachelors.required} credits
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(degreeProgress.bachelors.current / degreeProgress.bachelors.required) * 100}%` }}
              />
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.round((degreeProgress.bachelors.current / degreeProgress.bachelors.required) * 100)}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Credit Sources Breakdown */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Credit Sources</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Credit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {creditSources.map((source) => (
            <div
              key={source.name}
              className={`p-4 bg-${source.color}-500/10 border border-${source.color}-500/20 rounded-xl`}
            >
              <div className="text-sm text-gray-400 mb-2">{source.name}</div>
              <div className={`text-2xl font-bold text-${source.color}-400`}>{source.earned}</div>
              <div className="text-xs text-gray-500">of {source.possible} possible</div>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className="p-6 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <h4 className="font-semibold mb-4">Add New Credit</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Name"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50"
              />
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50">
                <option>Modern States (FREE)</option>
                <option>CLEP</option>
                <option>Sophia Learning</option>
                <option>Study.com</option>
                <option>StraighterLine</option>
                <option>Traditional</option>
                <option>Other</option>
              </select>
              <input
                type="number"
                placeholder="Credits"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50"
              />
              <input
                type="date"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <button
              onClick={() => {
                // Add logic here
                setShowAddForm(false);
              }}
              className="mt-4 w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all"
            >
              Save Credit
            </button>
          </div>
        )}

        {/* Recent Credits */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-sm text-gray-400">Recent Completions</h4>
          <div className="space-y-2">
            {[
              { name: 'College Algebra', source: 'Modern States (FREE)', credits: 3, date: '2024-11-10' },
              { name: 'English Composition', source: 'Sophia', credits: 3, date: '2024-11-08' },
              { name: 'US History I', source: 'Modern States (FREE)', credits: 3, date: '2024-11-05' },
            ].map((credit, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium">{credit.name}</div>
                    <div className="text-xs text-gray-400">{credit.source} • {credit.date}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-purple-400">+{credit.credits}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low-Pressure Learning Strategy */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Low-Pressure Learning Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-semibold text-purple-200 mb-2">Start Small</h4>
            <ul className="text-sm text-purple-300 space-y-1">
              <li>• 15-30 minutes per day</li>
              <li>• One course at a time</li>
              <li>• Set flexible deadlines</li>
              <li>• Use Modern States first (100% free!)</li>
            </ul>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-semibold text-purple-200 mb-2">Energy Management</h4>
            <ul className="text-sm text-purple-300 space-y-1">
              <li>• Track spoons before studying</li>
              <li>• Low-energy: watch videos in bed</li>
              <li>• High-energy: practice tests</li>
              <li>• Use text-to-speech for reading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Suggested Next Steps */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Recommended Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Start with Modern States (FREE!)',
              desc: 'Take College Composition for FREE - course + exam voucher = $0',
              credits: '+3 FREE credits',
              difficulty: 'Easy',
              highlight: true
            },
            {
              title: 'Sophia Unlimited Month',
              desc: 'First month free, complete 3-4 easy courses',
              credits: '+9-12 credits',
              difficulty: 'Medium'
            },
            {
              title: 'More Modern States',
              desc: 'Intro Sociology, Intro Psychology - all FREE with vouchers',
              credits: '+6-9 FREE credits',
              difficulty: 'Easy'
            },
            {
              title: 'Google Certificate',
              desc: 'Data Analytics or IT Support - shows on resume',
              credits: 'Certificate + skills',
              difficulty: 'Beginner'
            }
          ].map((step, idx) => (
            <div key={idx} className={`p-4 rounded-xl ${step.highlight ? 'bg-emerald-500/20 border-2 border-emerald-500/50' : 'bg-white/5'}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{step.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  step.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  step.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {step.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{step.desc}</p>
              <div className={`text-sm font-medium ${step.highlight ? 'text-emerald-300' : 'text-green-400'}`}>
                {step.credits}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditTracker;