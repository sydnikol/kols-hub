import React, { useState, useEffect } from 'react';
import {
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  Plus,
  Trash2,
  Star,
  Video,
  Book,
  GraduationCap,
  Users,
  FileText,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Filter,
  Search,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  CheckCircle2,
  PlayCircle,
  TrendingDown,
  Bot
} from 'lucide-react';
import toast from 'react-hot-toast';
import AITeacherPanel from '../components/AITeacherPanel';
import { TeachingDomain } from '../services/unified-ai-teacher';

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'creative' | 'business' | 'language' | 'soft-skills' | 'other';
  currentLevel: number;
  targetLevel: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'learning' | 'practicing' | 'proficient' | 'expert';
  resources: string[];
  notes: string;
}

interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'tutorial' | 'book' | 'workshop' | 'mentor' | 'video';
  category: 'technical' | 'creative' | 'business' | 'language' | 'soft-skills' | 'other';
  platform: string;
  cost: 'free' | 'paid' | 'freemium';
  price?: string;
  url?: string;
  description: string;
  duration?: string;
  rating: number;
  userRating?: number;
  completionStatus: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  bookmarked: boolean;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  enrollments?: string;
}

const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    type: 'course',
    category: 'technical',
    platform: 'Udemy',
    cost: 'paid',
    price: '$89.99',
    url: 'https://udemy.com',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive bootcamp.',
    duration: '65 hours',
    rating: 4.8,
    userRating: 5,
    completionStatus: 'in-progress',
    progress: 45,
    bookmarked: true,
    skillLevel: 'beginner',
    instructor: 'Dr. Angela Yu',
    enrollments: '847,392'
  },
  {
    id: '2',
    title: 'Advanced TypeScript Programming',
    type: 'course',
    category: 'technical',
    platform: 'Frontend Masters',
    cost: 'paid',
    price: '$39/month',
    url: 'https://frontendmasters.com',
    description: 'Deep dive into TypeScript with advanced types, generics, decorators, and real-world patterns.',
    duration: '8 hours',
    rating: 4.9,
    completionStatus: 'not-started',
    progress: 0,
    bookmarked: true,
    skillLevel: 'advanced',
    instructor: 'Mike North',
    enrollments: '23,456'
  },
  {
    id: '3',
    title: 'The Complete Digital Marketing Course',
    type: 'course',
    category: 'business',
    platform: 'Coursera',
    cost: 'freemium',
    price: 'Free (Cert: $49)',
    url: 'https://coursera.org',
    description: 'Learn SEO, social media marketing, email marketing, and analytics from industry experts.',
    duration: '40 hours',
    rating: 4.6,
    completionStatus: 'completed',
    progress: 100,
    bookmarked: false,
    skillLevel: 'beginner',
    instructor: 'Rob Percival',
    enrollments: '156,789'
  },
  {
    id: '4',
    title: 'JavaScript: The Definitive Guide',
    type: 'book',
    category: 'technical',
    platform: 'O\'Reilly',
    cost: 'paid',
    price: '$54.99',
    description: 'The comprehensive reference guide to JavaScript covering ES6+ features and best practices.',
    rating: 4.7,
    completionStatus: 'in-progress',
    progress: 60,
    bookmarked: true,
    skillLevel: 'intermediate',
    instructor: 'David Flanagan'
  },
  {
    id: '5',
    title: 'React Native - The Practical Guide',
    type: 'tutorial',
    category: 'technical',
    platform: 'YouTube',
    cost: 'free',
    url: 'https://youtube.com',
    description: 'Build cross-platform mobile apps with React Native, covering navigation, state management, and APIs.',
    duration: '12 hours',
    rating: 4.8,
    completionStatus: 'not-started',
    progress: 0,
    bookmarked: false,
    skillLevel: 'intermediate',
    instructor: 'Maximilian Schwarzmüller',
    enrollments: '2.3M views'
  },
  {
    id: '6',
    title: 'Professional Business Communication',
    type: 'course',
    category: 'soft-skills',
    platform: 'LinkedIn Learning',
    cost: 'paid',
    price: '$29.99/month',
    url: 'https://linkedin.com/learning',
    description: 'Master workplace communication, presentation skills, and professional writing techniques.',
    duration: '3 hours',
    rating: 4.5,
    userRating: 4,
    completionStatus: 'completed',
    progress: 100,
    bookmarked: true,
    skillLevel: 'beginner',
    instructor: 'Tatiana Kolovou',
    enrollments: '534,221'
  },
  {
    id: '7',
    title: 'UI/UX Design Specialization',
    type: 'course',
    category: 'creative',
    platform: 'Coursera',
    cost: 'freemium',
    price: 'Free (Cert: $79)',
    url: 'https://coursera.org',
    description: 'Learn user research, wireframing, prototyping, and design principles from California Institute of Arts.',
    duration: '120 hours',
    rating: 4.7,
    completionStatus: 'in-progress',
    progress: 25,
    bookmarked: true,
    skillLevel: 'beginner',
    instructor: 'CalArts Faculty',
    enrollments: '89,456'
  },
  {
    id: '8',
    title: 'Docker and Kubernetes Complete Guide',
    type: 'course',
    category: 'technical',
    platform: 'Udemy',
    cost: 'paid',
    price: '$94.99',
    description: 'Master containerization and orchestration with Docker and Kubernetes for production deployments.',
    duration: '22 hours',
    rating: 4.9,
    completionStatus: 'not-started',
    progress: 0,
    bookmarked: false,
    skillLevel: 'intermediate',
    instructor: 'Stephen Grider',
    enrollments: '167,893'
  },
  {
    id: '9',
    title: 'Spanish for Beginners',
    type: 'course',
    category: 'language',
    platform: 'Duolingo',
    cost: 'freemium',
    price: 'Free (Plus: $6.99/mo)',
    description: 'Interactive Spanish lessons covering grammar, vocabulary, and conversational skills.',
    duration: 'Self-paced',
    rating: 4.6,
    completionStatus: 'in-progress',
    progress: 35,
    bookmarked: true,
    skillLevel: 'beginner',
    enrollments: '5M+ learners'
  },
  {
    id: '10',
    title: 'Machine Learning A-Z',
    type: 'course',
    category: 'technical',
    platform: 'Udemy',
    cost: 'paid',
    price: '$99.99',
    description: 'Comprehensive ML course covering supervised/unsupervised learning, neural networks, and real projects.',
    duration: '44 hours',
    rating: 4.8,
    completionStatus: 'not-started',
    progress: 0,
    bookmarked: true,
    skillLevel: 'intermediate',
    instructor: 'Kirill Eremenko',
    enrollments: '912,345'
  },
  {
    id: '11',
    title: 'Effective Leadership Workshop',
    type: 'workshop',
    category: 'soft-skills',
    platform: 'Skillshare',
    cost: 'paid',
    price: '$32/month',
    description: 'Develop leadership skills including team management, conflict resolution, and strategic thinking.',
    duration: '6 hours',
    rating: 4.7,
    completionStatus: 'completed',
    progress: 100,
    bookmarked: false,
    skillLevel: 'intermediate',
    instructor: 'Seth Godin',
    enrollments: '45,678'
  },
  {
    id: '12',
    title: 'AWS Certified Solutions Architect',
    type: 'course',
    category: 'technical',
    platform: 'A Cloud Guru',
    cost: 'paid',
    price: '$47/month',
    description: 'Prepare for AWS certification with hands-on labs covering EC2, S3, VPC, and cloud architecture.',
    duration: '28 hours',
    rating: 4.9,
    completionStatus: 'in-progress',
    progress: 55,
    bookmarked: true,
    skillLevel: 'intermediate',
    instructor: 'Ryan Kroonenburg',
    enrollments: '234,567'
  },
  {
    id: '13',
    title: 'Advanced Excel Formulas & Functions',
    type: 'tutorial',
    category: 'business',
    platform: 'LinkedIn Learning',
    cost: 'paid',
    price: '$29.99/month',
    description: 'Master complex Excel functions, pivot tables, macros, and data analysis techniques.',
    duration: '4.5 hours',
    rating: 4.6,
    completionStatus: 'completed',
    progress: 100,
    bookmarked: false,
    skillLevel: 'advanced',
    instructor: 'Dennis Taylor',
    enrollments: '678,901'
  },
  {
    id: '14',
    title: 'Graphic Design Masterclass',
    type: 'course',
    category: 'creative',
    platform: 'Udemy',
    cost: 'paid',
    price: '$84.99',
    description: 'Learn Adobe Photoshop, Illustrator, and InDesign with real-world design projects.',
    duration: '38 hours',
    rating: 4.8,
    completionStatus: 'not-started',
    progress: 0,
    bookmarked: false,
    skillLevel: 'beginner',
    instructor: 'Lindsay Marsh',
    enrollments: '456,789'
  },
  {
    id: '15',
    title: 'Time Management Fundamentals',
    type: 'video',
    category: 'soft-skills',
    platform: 'LinkedIn Learning',
    cost: 'paid',
    price: '$29.99/month',
    description: 'Productivity strategies, prioritization techniques, and tools to manage your time effectively.',
    duration: '1.5 hours',
    rating: 4.5,
    userRating: 5,
    completionStatus: 'completed',
    progress: 100,
    bookmarked: true,
    skillLevel: 'beginner',
    instructor: 'Dave Crenshaw',
    enrollments: '1.2M'
  }
];

const SkillsDevelopmentHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skills' | 'resources' | 'stats'>('skills');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [resources, setResources] = useState<LearningResource[]>(INITIAL_RESOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCost, setFilterCost] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'progress' | 'title'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [showAITeacher, setShowAITeacher] = useState(false);
  const [aiTeacherDomain, setAITeacherDomain] = useState<TeachingDomain>('skill-development');

  useEffect(() => {
    const savedSkills = localStorage.getItem('skills');
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    } else {
      const defaultSkills: Skill[] = [
        {
          id: '1',
          name: 'React Development',
          category: 'technical',
          currentLevel: 3,
          targetLevel: 5,
          priority: 'high',
          status: 'practicing',
          resources: ['1', '5'],
          notes: 'Focus on hooks and state management'
        },
        {
          id: '2',
          name: 'Public Speaking',
          category: 'soft-skills',
          currentLevel: 2,
          targetLevel: 4,
          priority: 'medium',
          status: 'learning',
          resources: ['6'],
          notes: 'Practice presentations weekly'
        }
      ];
      setSkills(defaultSkills);
      localStorage.setItem('skills', JSON.stringify(defaultSkills));
    }

    const savedResources = localStorage.getItem('learningResources');
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      localStorage.setItem('learningResources', JSON.stringify(INITIAL_RESOURCES));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('learningResources', JSON.stringify(resources));
  }, [resources]);

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: 'technical',
      currentLevel: 1,
      targetLevel: 5,
      priority: 'medium',
      status: 'learning',
      resources: [],
      notes: '',
    };
    setSkills([...skills, newSkill]);
    toast.success('Skill added');
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(skills.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
    toast.success('Skill deleted');
  };

  const updateResource = (id: string, updates: Partial<LearningResource>) => {
    setResources(resources.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Resource updated');
  };

  const toggleBookmark = (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      updateResource(id, { bookmarked: !resource.bookmarked });
      toast.success(resource.bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    }
  };

  const updateProgress = (id: string, progress: number) => {
    const status = progress === 0 ? 'not-started' : progress === 100 ? 'completed' : 'in-progress';
    updateResource(id, { progress, completionStatus: status });
  };

  const updateUserRating = (id: string, rating: number) => {
    updateResource(id, { userRating: rating });
    toast.success('Rating updated');
  };

  const getFilteredResources = () => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(r => r.category === filterCategory);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }

    if (filterCost !== 'all') {
      filtered = filtered.filter(r => r.cost === filterCost);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.completionStatus === filterStatus);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'progress') return b.progress - a.progress;
      return a.title.localeCompare(b.title);
    });
  };

  const getRecommendedResources = () => {
    const skillCategories = skills.map(s => s.category);
    return resources.filter(r =>
      skillCategories.includes(r.category) &&
      r.completionStatus === 'not-started' &&
      r.rating >= 4.5
    ).slice(0, 3);
  };

  const activeSkills = skills.filter(s => s.status === 'learning' || s.status === 'practicing').length;
  const completedResources = resources.filter(r => r.completionStatus === 'completed').length;
  const inProgressResources = resources.filter(r => r.completionStatus === 'in-progress').length;
  const bookmarkedResources = resources.filter(r => r.bookmarked).length;
  const averageProgress = resources.length > 0
    ? Math.round(resources.reduce((sum, r) => sum + r.progress, 0) / resources.length)
    : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Zap className="w-4 h-4" />;
      case 'creative': return <Star className="w-4 h-4" />;
      case 'business': return <Target className="w-4 h-4" />;
      case 'language': return <Book className="w-4 h-4" />;
      case 'soft-skills': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <GraduationCap className="w-5 h-5" />;
      case 'tutorial': return <PlayCircle className="w-5 h-5" />;
      case 'book': return <Book className="w-5 h-5" />;
      case 'workshop': return <Users className="w-5 h-5" />;
      case 'mentor': return <Users className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getCostBadgeColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'freemium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryStats = () => {
    const categories = ['technical', 'creative', 'business', 'language', 'soft-skills', 'other'];
    return categories.map(cat => ({
      name: cat,
      count: skills.filter(s => s.category === cat).length,
      avgLevel: skills.filter(s => s.category === cat).length > 0
        ? (skills.filter(s => s.category === cat).reduce((sum, s) => sum + s.currentLevel, 0) /
           skills.filter(s => s.category === cat).length).toFixed(1)
        : '0'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Skills Development Hub</h1>
          </div>
          <button
            onClick={() => setShowAITeacher(!showAITeacher)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              showAITeacher
                ? 'bg-white text-emerald-700'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Tutor</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{skills.length}</div>
            <div className="text-xs opacity-90">Total Skills</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeSkills}</div>
            <div className="text-xs opacity-90">In Progress</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <BookOpen className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedResources}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'skills', label: 'Skills', icon: Zap },
            { id: 'resources', label: 'Resources', icon: BookOpen },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <button
              onClick={addSkill}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Skill</span>
            </button>
            {skills.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No skills yet. Start your learning journey!</p>
              </div>
            ) : (
              skills.map(skill => (
                <div key={skill.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      placeholder="Skill name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none flex-1 mr-2"
                    />
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, { category: e.target.value as Skill['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                    >
                      <option value="technical">Technical</option>
                      <option value="creative">Creative</option>
                      <option value="business">Business</option>
                      <option value="language">Language</option>
                      <option value="soft-skills">Soft Skills</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={skill.status}
                      onChange={(e) => updateSkill(skill.id, { status: e.target.value as Skill['status'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                    >
                      <option value="learning">Learning</option>
                      <option value="practicing">Practicing</option>
                      <option value="proficient">Proficient</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={skill.priority}
                      onChange={(e) => updateSkill(skill.id, { priority: e.target.value as Skill['priority'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical</option>
                    </select>
                    <div className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 text-gray-600">
                      Target: Level {skill.targetLevel}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">
                      Current Level: {skill.currentLevel}/5
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateSkill(skill.id, { currentLevel: level })}
                          className={`w-10 h-10 rounded font-semibold transition-colors ${
                            level <= skill.currentLevel
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">
                      Progress to Target
                    </label>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${(skill.currentLevel / skill.targetLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <textarea
                    value={skill.notes}
                    onChange={(e) => updateSkill(skill.id, { notes: e.target.value })}
                    placeholder="Notes, goals, milestones..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded font-medium hover:bg-emerald-200 transition-colors flex items-center space-x-1"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="technical">Technical</option>
                    <option value="creative">Creative</option>
                    <option value="business">Business</option>
                    <option value="language">Language</option>
                    <option value="soft-skills">Soft Skills</option>
                    <option value="other">Other</option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="course">Courses</option>
                    <option value="tutorial">Tutorials</option>
                    <option value="book">Books</option>
                    <option value="workshop">Workshops</option>
                    <option value="video">Videos</option>
                  </select>

                  <select
                    value={filterCost}
                    onChange={(e) => setFilterCost(e.target.value)}
                    className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                  >
                    <option value="all">All Pricing</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="freemium">Freemium</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none col-span-2"
                  >
                    <option value="rating">Sort by Rating</option>
                    <option value="progress">Sort by Progress</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>
              )}
            </div>

            {getRecommendedResources().length > 0 && (
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg p-4 border border-emerald-300">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-semibold text-emerald-900">Recommended for You</h3>
                </div>
                <div className="space-y-2">
                  {getRecommendedResources().map(resource => (
                    <div key={resource.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-emerald-600">
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-gray-600">{resource.platform}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">{resource.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-3">
              <div className="text-sm text-gray-600">
                {getFilteredResources().length} resources found
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Bookmark className="w-4 h-4" />
                <span>{bookmarkedResources} bookmarked</span>
              </div>
            </div>

            {getFilteredResources().length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No resources found matching your criteria</p>
              </div>
            ) : (
              getFilteredResources().map(resource => (
                <div key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="text-emerald-600 mt-1">
                          {getTypeIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {resource.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCostBadgeColor(resource.cost)}`}>
                              {resource.cost === 'free' ? 'Free' : resource.price}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(resource.completionStatus)}`}>
                              {resource.completionStatus.replace('-', ' ')}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium capitalize">
                              {resource.skillLevel}
                            </span>
                            <span className="text-xs text-gray-600 flex items-center">
                              {getCategoryIcon(resource.category)}
                              <span className="ml-1 capitalize">{resource.category.replace('-', ' ')}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <GraduationCap className="w-4 h-4" />
                              <span>{resource.platform}</span>
                            </div>
                            {resource.duration && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{resource.duration}</span>
                              </div>
                            )}
                            {resource.enrollments && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{resource.enrollments}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className={`ml-2 transition-colors ${
                          resource.bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        {resource.bookmarked ? (
                          <BookmarkCheck className="w-6 h-6 fill-current" />
                        ) : (
                          <Bookmark className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    {expandedResource === resource.id && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 mb-3">{resource.description}</p>
                        {resource.instructor && (
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Instructor:</span> {resource.instructor}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setExpandedResource(expandedResource === resource.id ? null : resource.id)}
                      className="text-emerald-600 text-sm font-medium mb-3 hover:text-emerald-700 flex items-center space-x-1"
                    >
                      <span>{expandedResource === resource.id ? 'Show less' : 'Show more'}</span>
                      {expandedResource === resource.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Platform Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= resource.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-semibold text-gray-900">{resource.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Your Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => updateUserRating(resource.id, star)}
                              className="transition-colors"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  resource.userRating && star <= resource.userRating
                                    ? 'text-emerald-500 fill-current'
                                    : 'text-gray-300 hover:text-emerald-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-semibold text-emerald-600">{resource.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            resource.progress === 100 ? 'bg-green-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${resource.progress}%` }}
                        ></div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={resource.progress}
                        onChange={(e) => updateProgress(resource.id, parseInt(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Visit Resource</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-emerald-600 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Overview Statistics</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-700">{skills.length}</div>
                  <div className="text-sm text-gray-600">Total Skills Tracked</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{activeSkills}</div>
                  <div className="text-sm text-gray-600">Skills In Progress</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{completedResources}</div>
                  <div className="text-sm text-gray-600">Resources Completed</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700">{inProgressResources}</div>
                  <div className="text-sm text-gray-600">Currently Learning</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{bookmarkedResources}</div>
                  <div className="text-sm text-gray-600">Bookmarked Resources</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <div className="text-2xl font-bold text-pink-700">{averageProgress}%</div>
                  <div className="text-sm text-gray-600">Average Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-emerald-600 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Skills by Category</span>
              </h3>
              <div className="space-y-3">
                {getCategoryStats().map(stat => (
                  <div key={stat.name} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(stat.name)}
                        <span className="font-medium capitalize">{stat.name.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Avg Level: {stat.avgLevel}/5</span>
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm font-semibold">
                          {stat.count}
                        </span>
                      </div>
                    </div>
                    {stat.count > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${(parseFloat(stat.avgLevel) / 5) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-emerald-600 flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Resource Statistics</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Resources:</span>
                  <span className="font-semibold">{resources.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed:</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">{completedResources}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Progress:</span>
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold">{inProgressResources}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Not Started:</span>
                  <span className="font-semibold">
                    {resources.filter(r => r.completionStatus === 'not-started').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Free Resources:</span>
                  <span className="font-semibold">
                    {resources.filter(r => r.cost === 'free').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paid Resources:</span>
                  <span className="font-semibold">
                    {resources.filter(r => r.cost === 'paid').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-emerald-600 flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Top Rated Resources</span>
              </h3>
              <div className="space-y-2">
                {resources
                  .filter(r => r.rating >= 4.7)
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map(resource => (
                    <div key={resource.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-emerald-600">
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{resource.title}</div>
                          <div className="text-xs text-gray-600">{resource.platform}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">{resource.rating}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Teacher Panel */}
        {showAITeacher && (
          <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] z-50">
            <div className="mb-2 flex gap-2 justify-end">
              <button
                onClick={() => setAITeacherDomain('skill-development')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  aiTeacherDomain === 'skill-development'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-900/80 text-emerald-300 hover:bg-emerald-800'
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setAITeacherDomain('college-prep')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  aiTeacherDomain === 'college-prep'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-900/80 text-emerald-300 hover:bg-emerald-800'
                }`}
              >
                College
              </button>
              <button
                onClick={() => setAITeacherDomain('language-learning')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  aiTeacherDomain === 'language-learning'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-900/80 text-emerald-300 hover:bg-emerald-800'
                }`}
              >
                Languages
              </button>
              <button
                onClick={() => setAITeacherDomain('general-education')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  aiTeacherDomain === 'general-education'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-900/80 text-emerald-300 hover:bg-emerald-800'
                }`}
              >
                Education
              </button>
            </div>
            <AITeacherPanel
              domain={aiTeacherDomain}
              title={
                aiTeacherDomain === 'skill-development' ? 'Skills Coach' :
                aiTeacherDomain === 'college-prep' ? 'College Advisor' :
                aiTeacherDomain === 'language-learning' ? 'Language Tutor' :
                'Learning Guide'
              }
              onClose={() => setShowAITeacher(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsDevelopmentHubPage;
