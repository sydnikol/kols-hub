/**
 * Education Dashboard Component
 * Low-pressure college credit tracking and resume building
 */

import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Award, TrendingUp, DollarSign, Clock, Target, Sparkles } from 'lucide-react';
import { EducationService, CourseProgress, ResumeEntry, FREE_CREDIT_PLATFORMS, RESUME_BUILDERS } from './educationService';
import { db } from '../../services/db';

export const EducationDashboard: React.FC = () => {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [resumeEntries, setResumeEntries] = useState<ResumeEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'resume' | 'resources'>('overview');
  const [weeklySuggestion, setWeeklySuggestion] = useState('');

  useEffect(() => {
    loadData();
    setWeeklySuggestion(EducationService.getWeeklySuggestions()[0]);
  }, []);

  const loadData = async () => {
    const educationData = await db.education.toArray();
    const resumeData = await db.resume.toArray();
    setCourses(educationData as CourseProgress[]);
    setResumeEntries(resumeData as ResumeEntry[]);
  };

  const progress = EducationService.calculateDegreeProgress(courses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-black text-purple-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-10 h-10 text-purple-400" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Passive Education Engine
            </h1>
            <p className="text-purple-300">Building your future, one free credit at a time</p>
          </div>
        </div>

        {/* Weekly Gentle Suggestion */}
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-purple-300 font-medium">This week's gentle nudge:</p>
            <p className="text-purple-100">{weeklySuggestion}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Credits Earned"
          value={progress.completedCredits}
          subtitle={`${progress.percentComplete.toFixed(1)}% toward Bachelor's`}
          color="purple"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Money Saved"
          value={`$${progress.moneySaved.toLocaleString()}`}
          subtitle="vs traditional tuition"
          color="green"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Active Courses"
          value={courses.filter(c => c.status === 'in-progress').length}
          subtitle={`${courses.filter(c => c.status === 'completed').length} completed`}
          color="blue"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Resume Items"
          value={resumeEntries.length}
          subtitle="portfolio pieces"
          color="pink"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 bg-purple-900/20 p-2 rounded-lg">
          {['overview', 'courses', 'resume', 'resources'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:bg-purple-800/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && <OverviewTab courses={courses} progress={progress} />}
        {activeTab === 'courses' && <CoursesTab courses={courses} onUpdate={loadData} />}
        {activeTab === 'resume' && <ResumeTab entries={resumeEntries} onUpdate={loadData} />}
        {activeTab === 'resources' && <ResourcesTab />}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  color: string;
}> = ({ icon, label, value, subtitle, color }) => {
  const colorClasses = {
    purple: 'from-purple-600 to-purple-800',
    green: 'from-green-600 to-green-800',
    blue: 'from-blue-600 to-blue-800',
    pink: 'from-pink-600 to-pink-800'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-6 rounded-xl`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium opacity-90">{label}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-75">{subtitle}</div>
    </div>
  );
};

const OverviewTab: React.FC<{ courses: CourseProgress[]; progress: any }> = ({ courses, progress }) => {
  return (
    <div className="space-y-6">
      {/* Degree Progress */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          Your Degree Progress
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Associate's Degree */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Associate's Degree (60 credits)</span>
              <span className="text-purple-400">{progress.associateDegree.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-purple-950 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, progress.associateDegree)}%` }}
              />
            </div>
            <p className="text-sm text-purple-300 mt-2">
              {progress.completedCredits} / 60 credits completed
            </p>
          </div>

          {/* Bachelor's Degree */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Bachelor's Degree (120 credits)</span>
              <span className="text-purple-400">{progress.bachelorsDegree.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-purple-950 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-600 to-pink-400 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, progress.bachelorsDegree)}%` }}
              />
            </div>
            <p className="text-sm text-purple-300 mt-2">
              {progress.completedCredits} / 120 credits completed
            </p>
          </div>
        </div>
      </div>

      {/* Active Courses Preview */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Currently Learning</h2>
        {courses.filter(c => c.status === 'in-progress').length === 0 ? (
          <p className="text-purple-300">No active courses - ready to start something new?</p>
        ) : (
          <div className="space-y-3">
            {courses.filter(c => c.status === 'in-progress').slice(0, 3).map(course => (
              <div key={course.id} className="bg-purple-800/30 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{course.courseName}</h3>
                    <p className="text-sm text-purple-300">{course.platform} • {course.creditHours} credits</p>
                  </div>
                  <span className="text-purple-400 font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-purple-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-400 h-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CoursesTab: React.FC<{ courses: CourseProgress[]; onUpdate: () => void }> = ({ courses, onUpdate }) => {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const filteredCourses = courses.filter(c => 
    filter === 'all' || c.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-purple-300'
            }`}
          >
            {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold">{course.courseName}</h3>
                <p className="text-sm text-purple-300">{course.platform}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                course.status === 'completed' ? 'bg-green-600' :
                course.status === 'in-progress' ? 'bg-blue-600' :
                'bg-gray-600'
              }`}>
                {course.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Credits:</span>
                <span className="font-medium">{course.creditHours}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Time Spent:</span>
                <span className="font-medium">{Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Savings:</span>
                <span className="font-medium text-green-400">${course.costSavings.toLocaleString()}</span>
              </div>
            </div>

            <div className="w-full bg-purple-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-400 h-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-xs text-purple-300 mt-1">{course.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumeTab: React.FC<{ entries: ResumeEntry[]; onUpdate: () => void }> = ({ entries, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Your Resume Portfolio</h2>
        <p className="text-purple-300 mb-6">
          Auto-generated from your completed courses and achievements. Export anytime!
        </p>

        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="bg-purple-800/30 p-4 rounded-lg border-l-4 border-purple-400">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{entry.title}</h3>
                  <p className="text-purple-300">{entry.organization}</p>
                </div>
                <span className="text-xs bg-purple-600 px-2 py-1 rounded">{entry.type}</span>
              </div>
              <p className="text-sm text-purple-200 mb-2">{entry.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {entry.skills.map(skill => (
                  <span key={skill} className="text-xs bg-purple-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-purple-400">
                {entry.startDate} {entry.endDate && `- ${entry.endDate}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResourcesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Free College Credit */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Free College Credit Resources</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-purple-300">CLEP Exams (100% Free with Modern States)</h3>
            <a
              href="https://modernstates.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              modernstates.org
            </a>
            <p className="text-sm text-purple-200 mt-2">
              Free prep courses + they cover the $89 exam fee = Completely FREE college credit!
            </p>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
              {FREE_CREDIT_PLATFORMS.clep.modernstates.exams.slice(0, 6).map((exam, i) => (
                <div key={i} className="text-sm bg-purple-800/30 p-2 rounded">
                  {exam.name} ({exam.credits} credits)
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-purple-300">Sophia Learning (ACE Credit)</h3>
            <a
              href="https://www.sophia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              sophia.org
            </a>
            <p className="text-sm text-purple-200 mt-2">
              $99/month unlimited courses - finish multiple courses in one month!
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-purple-300">Free MOOCs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.coursera.org" target="_blank" className="text-purple-400 hover:text-purple-300">
                  Coursera
                </a> - Audit FREE, certificates available
              </li>
              <li>
                <a href="https://www.edx.org" target="_blank" className="text-purple-400 hover:text-purple-300">
                  edX
                </a> - Harvard, MIT courses FREE
              </li>
              <li>
                <a href="https://www.khanacademy.org" target="_blank" className="text-purple-400 hover:text-purple-300">
                  Khan Academy
                </a> - 100% FREE everything
              </li>
              <li>
                <a href="https://ocw.mit.edu" target="_blank" className="text-purple-400 hover:text-purple-300">
                  MIT OpenCourseWare
                </a> - Full MIT courses
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resume Builders */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Resume Building Resources</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-purple-300 mb-2">Free Certifications</h3>
            <ul className="space-y-2 text-sm">
              {RESUME_BUILDERS.certifications.map((cert, i) => (
                <li key={i} className="bg-purple-800/30 p-3 rounded">
                  <a href={cert.url} target="_blank" className="text-purple-400 hover:text-purple-300 font-medium">
                    {cert.name}
                  </a>
                  <p className="text-purple-200">{cert.cost} • {cert.time} • {cert.value} value</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-purple-300 mb-2">Volunteer Opportunities</h3>
            <ul className="space-y-2 text-sm">
              {RESUME_BUILDERS.volunteer.map((opp, i) => (
                <li key={i} className="bg-purple-800/30 p-3 rounded">
                  <a href={opp.url} target="_blank" className="text-purple-400 hover:text-purple-300 font-medium">
                    {opp.platform}
                  </a>
                  <p className="text-purple-200">{opp.type}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDashboard;