import React, { useState, useEffect } from 'react';
import { GraduationCap, TreePine, BookOpen, Clock, Plus, X, Trash2, CheckCircle, Circle, Star, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  targetLevel: number;
  experience: number;
  milestones: Milestone[];
  resources: string[];
  notes: string;
  createdAt: number;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: number;
}

interface Course {
  id: string;
  title: string;
  platform: string;
  instructor: string;
  category: string;
  status: 'wishlist' | 'enrolled' | 'in-progress' | 'completed' | 'paused';
  progress: number; // 0-100
  totalHours: number;
  hoursCompleted: number;
  startDate: string;
  targetDate: string;
  completionDate?: string;
  rating: number; // 1-5
  cost: number;
  certificate: boolean;
  notes: string;
  createdAt: number;
}

interface StudySession {
  id: string;
  subject: string;
  date: string;
  duration: number; // minutes
  topics: string[];
  quality: number; // 1-5
  notes: string;
  breaks: number;
  focusLevel: number; // 1-5
  createdAt: number;
}

type TabType = 'overview' | 'skills' | 'courses' | 'sessions';

const skillCategories = ['Programming', 'Language', 'Art', 'Music', 'Writing', 'Business', 'Science', 'Health', 'Trade', 'Other'];
const coursePlatforms = ['Coursera', 'Udemy', 'edX', 'YouTube', 'Skillshare', 'LinkedIn Learning', 'Khan Academy', 'FreeCodeCamp', 'University', 'Other'];

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingSession, setIsAddingSession] = useState(false);

  // Skill form
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: skillCategories[0],
    targetLevel: 100,
    notes: '',
  });
  const [milestoneInput, setMilestoneInput] = useState('');
  const [tempMilestones, setTempMilestones] = useState<string[]>([]);
  const [resourceInput, setResourceInput] = useState('');
  const [tempResources, setTempResources] = useState<string[]>([]);

  // Course form
  const [courseForm, setCourseForm] = useState({
    title: '',
    platform: coursePlatforms[0],
    instructor: '',
    category: skillCategories[0],
    totalHours: 0,
    startDate: '',
    targetDate: '',
    cost: 0,
    certificate: false,
    notes: '',
  });

  // Session form
  const [sessionForm, setSessionForm] = useState({
    subject: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    quality: 3,
    notes: '',
    breaks: 0,
    focusLevel: 3,
  });
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');

  useEffect(() => {
    const savedSkills = localStorage.getItem('learningSkills');
    const savedCourses = localStorage.getItem('learningCourses');
    const savedSessions = localStorage.getItem('learningSessions');
    if (savedSkills) setSkills(JSON.parse(savedSkills));
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => {
    localStorage.setItem('learningSkills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('learningCourses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('learningSessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    const newSkill: Skill = {
      id: Date.now().toString(),
      ...skillForm,
      level: 0,
      experience: 0,
      milestones: tempMilestones.map((title, idx) => ({
        id: `${Date.now()}-${idx}`,
        title,
        completed: false,
      })),
      resources: tempResources,
      createdAt: Date.now(),
    };

    setSkills([...skills, newSkill]);
    setSkillForm({ name: '', category: skillCategories[0], targetLevel: 100, notes: '' });
    setTempMilestones([]);
    setTempResources([]);
    setIsAddingSkill(false);
    toast.success('Skill added!');
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      toast.error('Please enter a course title');
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      ...courseForm,
      status: 'wishlist',
      progress: 0,
      hoursCompleted: 0,
      rating: 0,
      createdAt: Date.now(),
    };

    setCourses([...courses, newCourse]);
    setCourseForm({ title: '', platform: coursePlatforms[0], instructor: '', category: skillCategories[0], totalHours: 0, startDate: '', targetDate: '', cost: 0, certificate: false, notes: '' });
    setIsAddingCourse(false);
    toast.success('Course added!');
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    const newSession: StudySession = {
      id: Date.now().toString(),
      ...sessionForm,
      topics: sessionTopics,
      createdAt: Date.now(),
    };

    setSessions([...sessions, newSession]);
    setSessionForm({ subject: '', date: new Date().toISOString().split('T')[0], duration: 60, quality: 3, notes: '', breaks: 0, focusLevel: 3 });
    setSessionTopics([]);
    setIsAddingSession(false);
    toast.success('Study session logged!');
  };

  const addExperience = (skillId: string, amount: number) => {
    setSkills(skills.map(skill => {
      if (skill.id === skillId) {
        const newExperience = skill.experience + amount;
        const newLevel = Math.min(100, Math.floor(newExperience / 10));
        return { ...skill, experience: newExperience, level: newLevel };
      }
      return skill;
    }));
    toast.success(`+${amount} XP!`);
  };

  const toggleMilestone = (skillId: string, milestoneId: string) => {
    setSkills(skills.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          milestones: skill.milestones.map(m =>
            m.id === milestoneId
              ? { ...m, completed: !m.completed, completedAt: !m.completed ? Date.now() : undefined }
              : m
          )
        };
      }
      return skill;
    }));
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        const hoursCompleted = Math.floor((progress / 100) * course.totalHours);
        const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : course.status;
        return {
          ...course,
          progress,
          hoursCompleted,
          status,
          completionDate: progress === 100 ? new Date().toISOString().split('T')[0] : course.completionDate
        };
      }
      return course;
    }));
  };

  const updateCourseStatus = (courseId: string, status: Course['status']) => {
    setCourses(courses.map(course => course.id === courseId ? { ...course, status } : course));
  };

  const updateCourseRating = (courseId: string, rating: number) => {
    setCourses(courses.map(course => course.id === courseId ? { ...course, rating } : course));
  };

  const deleteSkill = (id: string) => {
    if (confirm('Delete this skill?')) {
      setSkills(skills.filter(s => s.id !== id));
      toast.success('Skill deleted');
    }
  };

  const deleteCourse = (id: string) => {
    if (confirm('Delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
      toast.success('Course deleted');
    }
  };

  const deleteSession = (id: string) => {
    if (confirm('Delete this session?')) {
      setSessions(sessions.filter(s => s.id !== id));
      toast.success('Session deleted');
    }
  };

  const addMilestone = () => {
    if (!milestoneInput.trim()) return;
    setTempMilestones([...tempMilestones, milestoneInput.trim()]);
    setMilestoneInput('');
  };

  const addResource = () => {
    if (!resourceInput.trim()) return;
    setTempResources([...tempResources, resourceInput.trim()]);
    setResourceInput('');
  };

  const addTopic = () => {
    if (!topicInput.trim() || sessionTopics.includes(topicInput.trim())) return;
    setSessionTopics([...sessionTopics, topicInput.trim()]);
    setTopicInput('');
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: GraduationCap },
    { id: 'skills' as TabType, label: 'Skill Trees', icon: TreePine },
    { id: 'courses' as TabType, label: 'Courses', icon: BookOpen },
    { id: 'sessions' as TabType, label: 'Study Sessions', icon: Clock },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'wishlist': return 'bg-blue-500/20 text-blue-300';
      case 'enrolled': return 'bg-cyan-500/20 text-cyan-300';
      case 'in-progress': return 'bg-purple-500/20 text-purple-300';
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'paused': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  const totalStudyHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const averageFocus = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.focusLevel, 0) / sessions.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Learning Hub
            </h1>
          </div>
          <p className="text-purple-400">
            Track your learning journey, master new skills, complete courses
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-6 rounded-xl border border-purple-500/30">
                  <TreePine className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{skills.length}</h3>
                  <p className="text-purple-200/70">Skills Tracked</p>
                </div>
                <div className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 p-6 rounded-xl border border-violet-500/30">
                  <BookOpen className="w-8 h-8 text-violet-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{courses.length}</h3>
                  <p className="text-violet-200/70">Courses Enrolled</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 rounded-xl border border-blue-500/30">
                  <Clock className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{totalStudyHours.toFixed(1)}h</h3>
                  <p className="text-blue-200/70">Study Time</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30">
                  <TrendingUp className="w-8 h-8 text-indigo-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{averageFocus.toFixed(1)}/5</h3>
                  <p className="text-indigo-200/70">Avg Focus</p>
                </div>
              </div>

              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-300 mb-3">About Learning Hub</h3>
                <p className="text-purple-200 mb-3">
                  Continuous learning is key to personal and professional growth. Track your skills, manage courses,
                  and optimize your study sessions all in one place.
                </p>
                <div className="space-y-2 text-purple-100">
                  <p><strong>Skill Trees:</strong> Build and track skills with milestones and XP progression</p>
                  <p><strong>Courses:</strong> Manage online courses, track progress, and earn certificates</p>
                  <p><strong>Study Sessions:</strong> Log study time, topics covered, and focus quality</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <TreePine className="w-7 h-7 text-purple-400" />
                    Skill Trees
                  </h2>
                  <p className="text-purple-200/70 mt-1">{skills.length} skills tracked</p>
                </div>
                <button
                  onClick={() => setIsAddingSkill(!isAddingSkill)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2"
                >
                  {isAddingSkill ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingSkill ? 'Cancel' : 'Add Skill'}
                </button>
              </div>

              {isAddingSkill && (
                <form onSubmit={handleSkillSubmit} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Skill name"
                      required
                    />
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    >
                      {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-purple-300 text-sm mb-2 block">Target Level: {skillForm.targetLevel}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skillForm.targetLevel}
                      onChange={(e) => setSkillForm({ ...skillForm, targetLevel: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={milestoneInput}
                      onChange={(e) => setMilestoneInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMilestone();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Add milestone..."
                    />
                    <button type="button" onClick={addMilestone} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {tempMilestones.length > 0 && (
                    <div className="space-y-2">
                      {tempMilestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-purple-500/10 p-2 rounded">
                          <Circle className="w-4 h-4 text-purple-300" />
                          <span className="flex-1 text-purple-200">{milestone}</span>
                          <button type="button" onClick={() => setTempMilestones(tempMilestones.filter((_, i) => i !== idx))}>
                            <X className="w-4 h-4 text-red-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={resourceInput}
                      onChange={(e) => setResourceInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addResource();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Add resource (book, course, video)..."
                    />
                    <button type="button" onClick={addResource} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {tempResources.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tempResources.map((resource, idx) => (
                        <span key={idx} className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm flex items-center gap-2">
                          {resource}
                          <button type="button" onClick={() => setTempResources(tempResources.filter((_, i) => i !== idx))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={skillForm.notes}
                    onChange={(e) => setSkillForm({ ...skillForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                    placeholder="Notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
                  >
                    Add Skill
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {skills.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
                    <TreePine className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                    <p className="text-purple-200/70">Start tracking your skills!</p>
                  </div>
                ) : (
                  skills.sort((a, b) => b.level - a.level).map(skill => (
                    <div key={skill.id} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{skill.category}</span>
                        </div>
                        <button onClick={() => deleteSkill(skill.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-purple-300 text-sm">Level {skill.level}</span>
                          <span className="text-purple-300 text-sm">{skill.experience} XP</span>
                        </div>
                        <div className="bg-black/40 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full transition-all"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <div className="text-purple-200/70 text-xs">Target: {skill.targetLevel}%</div>
                      </div>

                      {skill.milestones.length > 0 && (
                        <div className="mb-4">
                          <p className="text-purple-300 text-sm font-medium mb-2">Milestones:</p>
                          <div className="space-y-2">
                            {skill.milestones.map(milestone => (
                              <button
                                key={milestone.id}
                                onClick={() => toggleMilestone(skill.id, milestone.id)}
                                className="w-full flex items-center gap-2 text-left p-2 rounded hover:bg-purple-500/10 transition-all"
                              >
                                {milestone.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-purple-300" />
                                )}
                                <span className={`flex-1 text-sm ${milestone.completed ? 'text-purple-200/50 line-through' : 'text-purple-200'}`}>
                                  {milestone.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {skill.resources.length > 0 && (
                        <div className="mb-4">
                          <p className="text-purple-300 text-sm font-medium mb-1">Resources:</p>
                          <div className="flex flex-wrap gap-1">
                            {skill.resources.map((resource, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">{resource}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {skill.notes && <p className="text-purple-200/70 text-sm mb-4 italic">{skill.notes}</p>}

                      <div className="flex gap-2">
                        <button
                          onClick={() => addExperience(skill.id, 10)}
                          className="flex-1 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 font-medium text-sm"
                        >
                          +10 XP
                        </button>
                        <button
                          onClick={() => addExperience(skill.id, 50)}
                          className="flex-1 py-2 bg-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-500/30 font-medium text-sm"
                        >
                          +50 XP
                        </button>
                        <button
                          onClick={() => addExperience(skill.id, 100)}
                          className="flex-1 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 font-medium text-sm"
                        >
                          +100 XP
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BookOpen className="w-7 h-7 text-violet-400" />
                    Course Tracker
                  </h2>
                  <p className="text-violet-200/70 mt-1">{courses.length} courses</p>
                </div>
                <button
                  onClick={() => setIsAddingCourse(!isAddingCourse)}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-500 hover:to-blue-500 transition-all flex items-center gap-2"
                >
                  {isAddingCourse ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingCourse ? 'Cancel' : 'Add Course'}
                </button>
              </div>

              {isAddingCourse && (
                <form onSubmit={handleCourseSubmit} className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 rounded-xl p-6 border border-violet-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                      placeholder="Course title"
                      required
                    />
                    <select
                      value={courseForm.platform}
                      onChange={(e) => setCourseForm({ ...courseForm, platform: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    >
                      {coursePlatforms.map(plat => <option key={plat} value={plat}>{plat}</option>)}
                    </select>
                    <input
                      type="text"
                      value={courseForm.instructor}
                      onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                      placeholder="Instructor"
                    />
                    <select
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    >
                      {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <input
                      type="number"
                      value={courseForm.totalHours || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, totalHours: parseInt(e.target.value) || 0 })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                      placeholder="Total hours"
                    />
                    <input
                      type="number"
                      value={courseForm.cost || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, cost: parseFloat(e.target.value) || 0 })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                      placeholder="Cost ($)"
                    />
                    <input
                      type="date"
                      value={courseForm.startDate}
                      onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                      placeholder="Start date"
                    />
                    <input
                      type="date"
                      value={courseForm.targetDate}
                      onChange={(e) => setCourseForm({ ...courseForm, targetDate: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                      placeholder="Target completion"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-violet-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={courseForm.certificate}
                      onChange={(e) => setCourseForm({ ...courseForm, certificate: e.target.checked })}
                      className="rounded"
                    />
                    Offers certificate
                  </label>

                  <textarea
                    value={courseForm.notes}
                    onChange={(e) => setCourseForm({ ...courseForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400 min-h-[80px]"
                    placeholder="Notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-500 hover:to-blue-500 transition-all font-medium"
                  >
                    Add Course
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {courses.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-violet-900/20 to-blue-900/20 rounded-xl border border-violet-500/20">
                    <BookOpen className="w-16 h-16 text-violet-400/50 mx-auto mb-4" />
                    <p className="text-violet-200/70">Add courses to your learning journey!</p>
                  </div>
                ) : (
                  courses.sort((a, b) => b.progress - a.progress).map(course => (
                    <div key={course.id} className="bg-gradient-to-br from-violet-900/30 to-blue-900/30 rounded-xl p-5 border border-violet-500/20 hover:border-violet-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{course.title}</h3>
                          <p className="text-violet-300/70 text-sm">{course.instructor} • {course.platform}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded text-xs">{course.category}</span>
                            {course.certificate && <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">Certificate</span>}
                          </div>
                        </div>
                        <button onClick={() => deleteCourse(course.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-violet-300 text-sm">Progress: {course.progress}%</span>
                          <span className="text-violet-300 text-sm">{course.hoursCompleted}/{course.totalHours}h</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={course.progress}
                          onChange={(e) => updateCourseProgress(course.id, parseInt(e.target.value))}
                          className="w-full mb-2"
                        />
                        <div className="bg-black/40 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {course.cost > 0 && <p className="text-violet-200/70 text-sm mb-2">Cost: ${course.cost}</p>}

                      {course.status === 'completed' && course.rating > 0 && (
                        <div className="mb-3">
                          <span className="text-2xl">{'⭐'.repeat(course.rating)}</span>
                        </div>
                      )}

                      {course.status === 'completed' && course.rating === 0 && (
                        <div className="mb-3">
                          <p className="text-violet-300 text-sm mb-1">Rate this course:</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <button
                                key={rating}
                                onClick={() => updateCourseRating(course.id, rating)}
                                className="text-2xl hover:scale-110 transition-all"
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {course.notes && <p className="text-violet-200/70 text-sm mb-3 italic">{course.notes}</p>}

                      <select
                        value={course.status}
                        onChange={(e) => updateCourseStatus(course.id, e.target.value as Course['status'])}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(course.status)}`}
                      >
                        <option value="wishlist">Wishlist</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Clock className="w-7 h-7 text-blue-400" />
                    Study Sessions
                  </h2>
                  <p className="text-blue-200/70 mt-1">{sessions.length} sessions logged</p>
                </div>
                <button
                  onClick={() => setIsAddingSession(!isAddingSession)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                >
                  {isAddingSession ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingSession ? 'Cancel' : 'Log Session'}
                </button>
              </div>

              {isAddingSession && (
                <form onSubmit={handleSessionSubmit} className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={sessionForm.subject}
                      onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Subject"
                      required
                    />
                    <input
                      type="date"
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                    <input
                      type="number"
                      value={sessionForm.duration}
                      onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 0 })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Duration (minutes)"
                      min="1"
                    />
                    <input
                      type="number"
                      value={sessionForm.breaks}
                      onChange={(e) => setSessionForm({ ...sessionForm, breaks: parseInt(e.target.value) || 0 })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Number of breaks"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="text-blue-300 text-sm mb-2 block">Focus Level: {sessionForm.focusLevel}/5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={sessionForm.focusLevel}
                      onChange={(e) => setSessionForm({ ...sessionForm, focusLevel: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-blue-300 text-sm mb-2 block">Session Quality: {sessionForm.quality}/5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={sessionForm.quality}
                      onChange={(e) => setSessionForm({ ...sessionForm, quality: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTopic();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Add topic covered..."
                    />
                    <button type="button" onClick={addTopic} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {sessionTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sessionTopics.map(topic => (
                        <span key={topic} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-2">
                          {topic}
                          <button type="button" onClick={() => setSessionTopics(sessionTopics.filter(t => t !== topic))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={sessionForm.notes}
                    onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 min-h-[80px]"
                    placeholder="Session notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all font-medium"
                  >
                    Log Session
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl border border-blue-500/20">
                    <Clock className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                    <p className="text-blue-200/70">Log your first study session!</p>
                  </div>
                ) : (
                  sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(session => (
                    <div key={session.id} className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-5 border border-blue-500/20 hover:border-blue-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{session.subject}</h3>
                          <p className="text-blue-300/70 text-sm">{new Date(session.date).toLocaleDateString()} • {session.duration} min</p>
                        </div>
                        <button onClick={() => deleteSession(session.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-blue-300/70">Focus Level</p>
                          <p className="text-blue-200 font-semibold">{session.focusLevel}/5 {'⭐'.repeat(session.focusLevel)}</p>
                        </div>
                        <div>
                          <p className="text-blue-300/70">Quality</p>
                          <p className="text-blue-200 font-semibold">{session.quality}/5 {'⭐'.repeat(session.quality)}</p>
                        </div>
                        {session.breaks > 0 && (
                          <div>
                            <p className="text-blue-300/70">Breaks</p>
                            <p className="text-blue-200 font-semibold">{session.breaks}</p>
                          </div>
                        )}
                      </div>

                      {session.topics.length > 0 && (
                        <div className="mb-3">
                          <p className="text-blue-300 text-sm font-medium mb-1">Topics Covered:</p>
                          <div className="flex flex-wrap gap-1">
                            {session.topics.map(topic => (
                              <span key={topic} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">{topic}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {session.notes && <p className="text-blue-200/70 text-sm italic">{session.notes}</p>}
                    </div>
                  ))
                )}
              </div>
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
}
