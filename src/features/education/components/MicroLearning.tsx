import React, { useState } from 'react';
import { Clock, Coffee, Brain, CheckCircle, Play, Pause } from 'lucide-react';
import { useEducationStore } from '../store/educationStore';

const MicroLearning: React.FC = () => {
  const [isLearning, setIsLearning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { passiveSessions, addPassiveSession } = useEducationStore();

  const quickTopics = [
    {
      id: 'college-algebra',
      title: 'College Algebra Basics',
      duration: 10,
      credits: 'CLEP eligible',
      difficulty: 'Beginner',
      color: 'blue'
    },
    {
      id: 'us-history',
      title: 'US History Timeline',
      duration: 15,
      credits: 'CLEP eligible', 
      difficulty: 'Easy',
      color: 'green'
    },
    {
      id: 'intro-python',
      title: 'Python Basics',
      duration: 10,
      credits: 'Portfolio builder',
      difficulty: 'Beginner',
      color: 'purple'
    },
    {
      id: 'business-writing',
      title: 'Business Communication',
      duration: 12,
      credits: 'Resume skill',
      difficulty: 'Easy',
      color: 'pink'
    },
    {
      id: 'creative-writing',
      title: 'Creative Writing Tips',
      duration: 8,
      credits: 'Portfolio piece',
      difficulty: 'All levels',
      color: 'indigo'
    },
    {
      id: 'spanish-basics',
      title: 'Spanish Conversation',
      duration: 10,
      credits: 'Language credit',
      difficulty: 'Beginner',
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-semibold text-lg">Today's Learning</h3>
              <p className="text-sm text-gray-400">Low-pressure, bite-sized sessions</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">{passiveSessions.length}</div>
            <div className="text-xs text-gray-400">sessions completed</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400">Target</div>
            <div className="text-xl font-bold text-green-400">3/day</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400">Streak</div>
            <div className="text-xl font-bold text-orange-400">7 days</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400">Total</div>
            <div className="text-xl font-bold text-blue-400">42 hrs</div>
          </div>
        </div>
      </div>

      {/* Quick Learning Topics */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Pick a Topic (5-15 minutes)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTopics.map((topic) => (
            <div
              key={topic.id}
              className={`
                bg-${topic.color}-500/10 backdrop-blur-xl rounded-xl p-5 
                border border-${topic.color}-500/20 hover:border-${topic.color}-500/40
                transition-all cursor-pointer group hover:scale-105
              `}
              onClick={() => {
                setIsLearning(true);
                addPassiveSession(topic.id, topic.title, 'started', topic.duration);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 text-${topic.color}-400`} />
                  <span className={`text-sm font-medium text-${topic.color}-400`}>
                    {topic.duration} min
                  </span>
                </div>
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                  {topic.difficulty}
                </span>
              </div>

              <h4 className="font-semibold mb-2 group-hover:text-white transition-colors">
                {topic.title}
              </h4>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{topic.credits}</span>
                <Play className={`w-5 h-5 text-${topic.color}-400 group-hover:scale-110 transition-transform`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free Resources Section */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          Free College Credit Resources
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-green-400">Testing (Credit by Exam)</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <a href="https://clep.collegeboard.org" target="_blank" rel="noopener" className="hover:underline">
                  CLEP ($89/test, 3-6 credits each)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <a href="https://getcollegecredit.com" target="_blank" rel="noopener" className="hover:underline">
                  DSST ($85/test, 3 credits each)
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-blue-400">Online Courses (ACE Credit)</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <a href="https://sophia.org" target="_blank" rel="noopener" className="hover:underline">
                  Sophia Learning ($99/month unlimited)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <a href="https://study.com" target="_blank" rel="noopener" className="hover:underline">
                  Study.com ($199/month)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <a href="https://straighterline.com" target="_blank" rel="noopener" className="hover:underline">
                  StraighterLine ($59-99/course)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-xs text-gray-300">
            💡 <strong>Kol's Tip:</strong> Start with Sophia Learning - unlimited courses for $99/month. 
            You can earn 12-18 credits in one month if you grind! Perfect for low-energy learning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MicroLearning;
