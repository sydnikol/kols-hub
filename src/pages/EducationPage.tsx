import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Briefcase, TrendingUp, ExternalLink, CheckCircle, Clock, Target, Brain, FileText, Link as LinkIcon } from 'lucide-react';
import { educationService } from '../services/educationService';
import { resumeBuilderService } from '../services/resumeBuilderService';

interface Course {
  id: string;
  title: string;
  platform: string;
  url: string;
  credits: number;
  type: 'credit' | 'certificate' | 'skill';
  timeCommitment: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  deadline?: string;
}

interface ResumeItem {
  id: string;
  type: 'course' | 'project' | 'skill' | 'certification';
  title: string;
  description: string;
  dateCompleted?: string;
  verified: boolean;
}

const EducationPage: React.FC = () => {
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [resumeItems, setResumeItems] = useState<ResumeItem[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [activeTab, setActiveTab] = useState<'courses' | 'resume' | 'resources'>('courses');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const courses = await educationService.getCourses();
    const resume = await resumeBuilderService.getResumeItems();
    
    setActiveCourses(courses.filter(c => c.status !== 'completed'));
    setCompletedCourses(courses.filter(c => c.status === 'completed'));
    setResumeItems(resume);
    setTotalCredits(courses.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.credits, 0));
  };

  const freeCreditResources = [
    {
      category: 'College Credit (Free)',
      resources: [
        {
          name: 'Sophia Learning',
          url: 'https://www.sophia.org',
          description: 'Self-paced courses for ACE-approved college credit (60-90 day access)',
          credits: '3 credits per course',
          subjects: ['Psychology', 'Sociology', 'English', 'Math', 'Business']
        },
        {
          name: 'Study.com',
          url: 'https://study.com',
          description: 'ACE-recommended courses (7-day free trial)',
          credits: '3 credits per course',
          subjects: ['All majors', 'Test prep', 'Professional development']
        },
        {
          name: 'Modern States',
          url: 'https://modernstates.org',
          description: '100% FREE CLEP prep + exam vouchers',
          credits: '3-6 credits per exam',
          subjects: ['33 CLEP subjects', 'Complete degree pathways']
        },
        {
          name: 'Khan Academy',
          url: 'https://www.khanacademy.org',
          description: 'Free CLEP/AP prep (use with Modern States for credit)',
          credits: 'Varies by exam',
          subjects: ['Math', 'Science', 'Humanities', 'Economics']
        }
      ]
    },
    {
      category: 'Certificates (Resume Builders)',
      resources: [
        {
          name: 'Coursera',
          url: 'https://www.coursera.org',
          description: 'Financial aid available, many free audit options',
          credits: 'Professional certificates',
          subjects: ['Google', 'IBM', 'Meta certificates', 'University courses']
        },
        {
          name: 'edX',
          url: 'https://www.edx.org',
          description: 'Audit for free, pay only for verified certificate',
          credits: 'MicroMasters, Professional certificates',
          subjects: ['Harvard', 'MIT', 'Microsoft', 'All fields']
        },
        {
          name: 'LinkedIn Learning',
          url: 'https://www.linkedin.com/learning',
          description: '1-month free trial, certificates show on LinkedIn profile',
          credits: 'Industry certificates',
          subjects: ['Tech', 'Business', 'Creative', 'Soft skills']
        },
        {
          name: 'Google Career Certificates',
          url: 'https://grow.google/certificates',
          description: 'Financial aid available, job-ready skills',
          credits: 'Professional certificate',
          subjects: ['Data Analytics', 'Project Management', 'UX Design', 'IT Support']
        }
      ]
    },
    {
      category: 'Skills (Portfolio Building)',
      resources: [
        {
          name: 'FreeCodeCamp',
          url: 'https://www.freecodecamp.org',
          description: 'Completely free coding certifications',
          credits: '300-hour certifications',
          subjects: ['Web Development', 'Data Science', 'Machine Learning']
        },
        {
          name: 'The Odin Project',
          url: 'https://www.theodinproject.com',
          description: 'Free full-stack web development curriculum',
          credits: 'Portfolio projects',
          subjects: ['Full-stack development', 'JavaScript', 'Ruby']
        },
        {
          name: 'Codecademy Free',
          url: 'https://www.codecademy.com',
          description: 'Free courses (Pro has more, but basics are free)',
          credits: 'Project portfolio',
          subjects: ['Python', 'JavaScript', 'HTML/CSS', 'SQL']
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              Passive Education & Resume Builder
            </h1>
            <p className="text-purple-300">Low-pressure learning that builds your future automatically</p>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-4 backdrop-blur-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{totalCredits}</div>
              <div className="text-sm text-purple-300">Credits Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 bg-purple-900/20 p-1 rounded-xl border border-purple-500/30">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-3 px-6 rounded-lg transition-all ${
              activeTab === 'courses'
                ? 'bg-purple-500/30 text-purple-100 border border-purple-500/50'
                : 'text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <BookOpen className="inline mr-2" size={20} />
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex-1 py-3 px-6 rounded-lg transition-all ${
              activeTab === 'resume'
                ? 'bg-purple-500/30 text-purple-100 border border-purple-500/50'
                : 'text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <Briefcase className="inline mr-2" size={20} />
            Resume Builder
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-3 px-6 rounded-lg transition-all ${
              activeTab === 'resources'
                ? 'bg-purple-500/30 text-purple-100 border border-purple-500/50'
                : 'text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <Target className="inline mr-2" size={20} />
            Free Resources
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Active Courses */}
            <div>
              <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
                <Clock className="mr-2" />
                In Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCourses.length === 0 ? (
                  <div className="col-span-2 bg-purple-900/20 border border-purple-500/30 rounded-xl p-8 text-center">
                    <BookOpen className="mx-auto mb-4 text-purple-400" size={48} />
                    <p className="text-purple-300">No active courses yet. Check out the Free Resources tab!</p>
                  </div>
                ) : (
                  activeCourses.map(course => (
                    <div key={course.id} className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-6 backdrop-blur-xl hover:border-purple-400/70 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-purple-100">{course.title}</h3>
                        <span className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">{course.platform}</span>
                      </div>
                      <p className="text-sm text-purple-300 mb-3">{course.timeCommitment}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-purple-300 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-purple-950/50 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-400">{course.credits} credits</span>
                        <a 
                          href={course.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-purple-300 hover:text-purple-100 flex items-center"
                        >
                          Continue <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Courses */}
            <div>
              <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
                <CheckCircle className="mr-2" />
                Completed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {completedCourses.map(course => (
                  <div key={course.id} className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-green-100">{course.title}</h3>
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-xs text-green-300 mb-2">{course.platform}</p>
                    <p className="text-xs text-green-400 font-semibold">{course.credits} credits earned</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div>
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-6 backdrop-blur-xl mb-6">
              <h2 className="text-xl font-bold text-purple-100 mb-4">Auto-Generated Resume Content</h2>
              <p className="text-purple-300 mb-4">As you complete courses and projects, they're automatically formatted for your resume.</p>
              
              <div className="space-y-4">
                {resumeItems.length === 0 ? (
                  <p className="text-purple-400 text-center py-8">Complete courses to automatically generate resume content!</p>
                ) : (
                  resumeItems.map(item => (
                    <div key={item.id} className="bg-purple-950/50 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-purple-100">{item.title}</h3>
                        {item.verified && (
                          <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded-full flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-purple-300 mb-2">{item.description}</p>
                      {item.dateCompleted && (
                        <p className="text-xs text-purple-400">Completed: {item.dateCompleted}</p>
                      )}
                    </div>
                  ))
                )}
              </div>

              <button className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                <FileText className="inline mr-2" size={20} />
                Export Resume (PDF/DOCX)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8">
            {freeCreditResources.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-purple-300 mb-4">{category.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.resources.map((resource, ridx) => (
                    <div key={ridx} className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-6 backdrop-blur-xl hover:border-purple-400/70 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-purple-100">{resource.name}</h3>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-200"
                        >
                          <LinkIcon size={20} />
                        </a>
                      </div>
                      <p className="text-sm text-purple-300 mb-3">{resource.description}</p>
                      <div className="mb-3">
                        <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full">
                          {resource.credits}
                        </span>
                      </div>
                      <div className="text-xs text-purple-400">
                        <strong>Subjects:</strong> {resource.subjects.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Low-Pressure Learning Tips */}
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center">
                <Brain className="mr-2" />
                Low-Pressure Learning Strategy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-purple-200 mb-2">Start Small</h3>
                  <ul className="text-sm text-purple-300 space-y-1">
                    <li>• 15-30 minutes per day</li>
                    <li>• One course at a time</li>
                    <li>• Set flexible deadlines</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-200 mb-2">Easiest First</h3>
                  <ul className="text-sm text-purple-300 space-y-1">
                    <li>• Start with Modern States (completely free)</li>
                    <li>• Pick subjects you already know</li>
                    <li>• Build confidence with quick wins</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-200 mb-2">Energy Management</h3>
                  <ul className="text-sm text-purple-300 space-y-1">
                    <li>• Track your spoons before studying</li>
                    <li>• Use low-energy days for video watching</li>
                    <li>• High-energy days for practice tests</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-200 mb-2">Passive Options</h3>
                  <ul className="text-sm text-purple-300 space-y-1">
                    <li>• Listen to lectures while resting</li>
                    <li>• Watch educational videos in bed</li>
                    <li>• Use text-to-speech for reading</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;