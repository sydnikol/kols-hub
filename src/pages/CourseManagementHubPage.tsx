import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  FileText,
  Target,
  Calendar,
  Plus,
  Trash2,
  Star,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen,
  Edit2,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  term: string;
  credits: number;
  currentGrade?: number;
  targetGrade?: number;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  notes: string;
  color?: string;
}

interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  courseColor: string;
  title: string;
  description: string;
  type: 'homework' | 'quiz' | 'exam' | 'project' | 'paper' | 'presentation' | 'lab';
  dueDate: string;
  points: number;
  earnedPoints?: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  submissionType: 'online' | 'in-person' | 'canvas' | 'email';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    name: 'Advanced Web Development',
    code: 'CS 401',
    instructor: 'Dr. Sarah Chen',
    term: 'Fall 2024',
    credits: 4,
    currentGrade: 92,
    targetGrade: 95,
    status: 'in-progress',
    notes: 'Focus on React and TypeScript patterns',
    color: 'indigo'
  },
  {
    id: '2',
    name: 'Database Systems',
    code: 'CS 352',
    instructor: 'Prof. Michael Rodriguez',
    term: 'Fall 2024',
    credits: 3,
    currentGrade: 88,
    targetGrade: 90,
    status: 'in-progress',
    notes: 'SQL optimization and NoSQL databases',
    color: 'purple'
  },
  {
    id: '3',
    name: 'Machine Learning',
    code: 'CS 475',
    instructor: 'Dr. Emily Zhang',
    term: 'Fall 2024',
    credits: 4,
    currentGrade: 85,
    targetGrade: 88,
    status: 'in-progress',
    notes: 'Neural networks and deep learning focus',
    color: 'blue'
  },
  {
    id: '4',
    name: 'Software Engineering',
    code: 'CS 420',
    instructor: 'Prof. David Johnson',
    term: 'Fall 2024',
    credits: 3,
    currentGrade: 94,
    targetGrade: 95,
    status: 'in-progress',
    notes: 'Agile methodologies and design patterns',
    color: 'violet'
  }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    courseId: '1',
    courseName: 'Advanced Web Development',
    courseColor: 'indigo',
    title: 'React Hooks Deep Dive',
    description: 'Implement custom hooks for state management and side effects',
    type: 'homework',
    dueDate: '2024-11-23T23:59:00',
    points: 100,
    earnedPoints: 95,
    status: 'graded',
    submissionType: 'canvas',
    priority: 'medium',
    notes: 'Great work on useMemo optimization'
  },
  {
    id: 'a2',
    courseId: '1',
    courseName: 'Advanced Web Development',
    courseColor: 'indigo',
    title: 'TypeScript Advanced Types',
    description: 'Create type-safe API client with generics and utility types',
    type: 'project',
    dueDate: '2024-11-25T23:59:00',
    points: 150,
    status: 'pending',
    submissionType: 'canvas',
    priority: 'critical',
    notes: 'Use mapped types and conditional types'
  },
  {
    id: 'a3',
    courseId: '2',
    courseName: 'Database Systems',
    courseColor: 'purple',
    title: 'SQL Query Optimization',
    description: 'Optimize slow queries and create proper indexes',
    type: 'homework',
    dueDate: '2024-11-24T23:59:00',
    points: 100,
    earnedPoints: 88,
    status: 'graded',
    submissionType: 'online',
    priority: 'medium',
    notes: 'Good use of explain plans'
  },
  {
    id: 'a4',
    courseId: '2',
    courseName: 'Database Systems',
    courseColor: 'purple',
    title: 'NoSQL Database Design',
    description: 'Design MongoDB schema for e-commerce application',
    type: 'project',
    dueDate: '2024-11-26T23:59:00',
    points: 200,
    status: 'submitted',
    submissionType: 'canvas',
    priority: 'high',
    notes: 'Include data modeling rationale'
  },
  {
    id: 'a5',
    courseId: '3',
    courseName: 'Machine Learning',
    courseColor: 'blue',
    title: 'Neural Network Implementation',
    description: 'Build CNN for image classification from scratch',
    type: 'project',
    dueDate: '2024-11-28T23:59:00',
    points: 250,
    status: 'pending',
    submissionType: 'canvas',
    priority: 'high',
    notes: 'No frameworks allowed - pure NumPy'
  },
  {
    id: 'a6',
    courseId: '3',
    courseName: 'Machine Learning',
    courseColor: 'blue',
    title: 'Midterm Exam',
    description: 'Comprehensive exam covering supervised and unsupervised learning',
    type: 'exam',
    dueDate: '2024-11-22T14:00:00',
    points: 200,
    earnedPoints: 172,
    status: 'graded',
    submissionType: 'in-person',
    priority: 'critical',
    notes: 'Strong performance on theory questions'
  },
  {
    id: 'a7',
    courseId: '4',
    courseName: 'Software Engineering',
    courseColor: 'violet',
    title: 'Design Patterns Implementation',
    description: 'Implement 5 design patterns with real-world examples',
    type: 'homework',
    dueDate: '2024-11-27T23:59:00',
    points: 120,
    status: 'pending',
    submissionType: 'canvas',
    priority: 'medium',
    notes: 'Focus on creational and structural patterns'
  },
  {
    id: 'a8',
    courseId: '4',
    courseName: 'Software Engineering',
    courseColor: 'violet',
    title: 'Agile Sprint Planning',
    description: 'Create sprint backlog and user stories for team project',
    type: 'project',
    dueDate: '2024-11-23T18:00:00',
    points: 100,
    earnedPoints: 98,
    status: 'graded',
    submissionType: 'online',
    priority: 'medium',
    notes: 'Excellent story point estimation'
  },
  {
    id: 'a9',
    courseId: '1',
    courseName: 'Advanced Web Development',
    courseColor: 'indigo',
    title: 'Performance Optimization Quiz',
    description: 'Quiz on React performance optimization techniques',
    type: 'quiz',
    dueDate: '2024-11-24T16:00:00',
    points: 50,
    status: 'pending',
    submissionType: 'online',
    priority: 'medium',
    notes: 'Review memo, callback, and lazy loading'
  },
  {
    id: 'a10',
    courseId: '2',
    courseName: 'Database Systems',
    courseColor: 'purple',
    title: 'Transaction Management Lab',
    description: 'Implement ACID properties in distributed database',
    type: 'lab',
    dueDate: '2024-11-29T23:59:00',
    points: 80,
    status: 'pending',
    submissionType: 'canvas',
    priority: 'low',
    notes: 'Use two-phase commit protocol'
  },
  {
    id: 'a11',
    courseId: '3',
    courseName: 'Machine Learning',
    courseColor: 'blue',
    title: 'Research Paper Review',
    description: 'Critical analysis of recent deep learning paper',
    type: 'paper',
    dueDate: '2024-11-30T23:59:00',
    points: 100,
    status: 'pending',
    submissionType: 'email',
    priority: 'low',
    notes: 'Choose from provided paper list'
  },
  {
    id: 'a12',
    courseId: '4',
    courseName: 'Software Engineering',
    courseColor: 'violet',
    title: 'Architecture Presentation',
    description: 'Present microservices architecture design for final project',
    type: 'presentation',
    dueDate: '2024-12-01T10:00:00',
    points: 150,
    status: 'pending',
    submissionType: 'in-person',
    priority: 'high',
    notes: '15-minute presentation with Q&A'
  },
  {
    id: 'a13',
    courseId: '1',
    courseName: 'Advanced Web Development',
    courseColor: 'indigo',
    title: 'State Management Lab',
    description: 'Implement Redux Toolkit with TypeScript',
    type: 'lab',
    dueDate: '2024-11-20T23:59:00',
    points: 75,
    earnedPoints: 70,
    status: 'graded',
    submissionType: 'canvas',
    priority: 'low',
    notes: 'Good implementation, minor type issues'
  },
  {
    id: 'a14',
    courseId: '3',
    courseName: 'Machine Learning',
    courseColor: 'blue',
    title: 'Kaggle Competition',
    description: 'Participate in course Kaggle competition for bonus points',
    type: 'project',
    dueDate: '2024-12-05T23:59:00',
    points: 50,
    status: 'pending',
    submissionType: 'online',
    priority: 'low',
    notes: 'Optional but recommended for practice'
  },
  {
    id: 'a15',
    courseId: '2',
    courseName: 'Database Systems',
    courseColor: 'purple',
    title: 'Final Exam',
    description: 'Comprehensive final covering all course topics',
    type: 'exam',
    dueDate: '2024-12-10T14:00:00',
    points: 300,
    status: 'pending',
    submissionType: 'in-person',
    priority: 'critical',
    notes: 'Study indexing, normalization, and transactions'
  }
];

const CourseManagementHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'grades'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'points' | 'priority'>('dueDate');

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(INITIAL_COURSES);
      localStorage.setItem('courses', JSON.stringify(INITIAL_COURSES));
    }

    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    } else {
      setAssignments(INITIAL_ASSIGNMENTS);
      localStorage.setItem('assignments', JSON.stringify(INITIAL_ASSIGNMENTS));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      code: '',
      instructor: '',
      term: '',
      credits: 3,
      status: 'enrolled',
      notes: '',
      color: 'indigo'
    };
    setCourses([...courses, newCourse]);
    toast.success('Course added');
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    setAssignments(assignments.filter(a => a.courseId !== id));
    toast.success('Course deleted');
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast.success('Assignment deleted');
  };

  const getAssignmentPriority = (dueDate: string, status: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (status === 'graded') return 'low';
    const due = new Date(dueDate);
    const now = new Date();
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDue < 0) return 'critical';
    if (hoursUntilDue < 24) return 'critical';
    if (hoursUntilDue < 72) return 'high';
    if (hoursUntilDue < 168) return 'medium';
    return 'low';
  };

  const getTimeUntilDue = (dueDate: string): string => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();

    if (diff < 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const filteredAssignments = assignments
    .filter(a => {
      if (searchTerm && !a.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !a.courseName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterCourse !== 'all' && a.courseId !== filterCourse) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterPriority !== 'all') {
        const priority = getAssignmentPriority(a.dueDate, a.status);
        if (priority !== filterPriority) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'points') {
        return b.points - a.points;
      } else {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const aPriority = getAssignmentPriority(a.dueDate, a.status);
        const bPriority = getAssignmentPriority(b.dueDate, b.status);
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      }
    });

  const activeCourses = courses.filter(c => c.status === 'in-progress' || c.status === 'enrolled').length;
  const totalCredits = courses.filter(c => c.status === 'in-progress' || c.status === 'enrolled').reduce((sum, c) => sum + c.credits, 0);
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const overallGPA = courses.filter(c => c.currentGrade).length > 0
    ? (courses.filter(c => c.currentGrade).reduce((sum, c) => sum + (c.currentGrade || 0), 0) / courses.filter(c => c.currentGrade).length).toFixed(2)
    : 'N/A';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'submitted': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <GraduationCap className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Course Management Hub</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <GraduationCap className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeCourses}</div>
            <div className="text-xs opacity-90">Active Courses</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalCredits}</div>
            <div className="text-xs opacity-90">Credits</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{pendingAssignments}</div>
            <div className="text-xs opacity-90">Pending</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{overallGPA}</div>
            <div className="text-xs opacity-90">Avg Grade</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'courses', label: 'Courses', icon: GraduationCap },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'grades', label: 'Grades', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <button
              onClick={addCourse}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Course</span>
            </button>
            {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No courses yet. Add your classes!</p>
              </div>
            ) : (
              courses.map(course => (
                <div key={course.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-${course.color || 'indigo'}-500`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                      placeholder="Course name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 mr-2"
                    />
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input
                      type="text"
                      value={course.code}
                      onChange={(e) => updateCourse(course.id, { code: e.target.value })}
                      placeholder="Course code..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="text"
                      value={course.instructor}
                      onChange={(e) => updateCourse(course.id, { instructor: e.target.value })}
                      placeholder="Instructor..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="text"
                      value={course.term}
                      onChange={(e) => updateCourse(course.id, { term: e.target.value })}
                      placeholder="Term (e.g., Fall 2024)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="number"
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 0 })}
                      placeholder="Credits..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                    <select
                      value={course.status}
                      onChange={(e) => updateCourse(course.id, { status: e.target.value as Course['status'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    >
                      <option value="enrolled">Enrolled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                    <input
                      type="number"
                      value={course.currentGrade || ''}
                      onChange={(e) => updateCourse(course.id, { currentGrade: parseFloat(e.target.value) || undefined })}
                      placeholder="Current grade %"
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <textarea
                    value={course.notes}
                    onChange={(e) => updateCourse(course.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                    rows={2}
                  />
                  {course.currentGrade && (
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Current Grade:</span>
                      <span className={`font-semibold ${course.currentGrade >= 90 ? 'text-green-600' : course.currentGrade >= 80 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {course.currentGrade}%
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search assignments..."
                  className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                >
                  <option value="all">All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code || c.name}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none"
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="points">Sort by Points</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>

            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No assignments found</p>
              </div>
            ) : (
              filteredAssignments.map(assignment => {
                const priority = getAssignmentPriority(assignment.dueDate, assignment.status);
                const timeUntil = getTimeUntilDue(assignment.dueDate);
                const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === 'pending';

                return (
                  <div
                    key={assignment.id}
                    className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                      isOverdue ? 'border-red-500' : `border-${assignment.courseColor}-500`
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full bg-${assignment.courseColor}-100 text-${assignment.courseColor}-800`}>
                            {assignment.courseName}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(priority)}`}>
                            {priority.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                      </div>
                      <button
                        onClick={() => deleteAssignment(assignment.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                          {timeUntil}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>{assignment.points} points</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="capitalize">{assignment.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(assignment.status)}
                        <span className="text-sm capitalize font-medium">{assignment.status}</span>
                      </div>

                      {assignment.status === 'graded' && assignment.earnedPoints !== undefined && (
                        <div className="text-sm font-semibold">
                          <span className={`${
                            (assignment.earnedPoints / assignment.points) >= 0.9 ? 'text-green-600' :
                            (assignment.earnedPoints / assignment.points) >= 0.8 ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {assignment.earnedPoints}/{assignment.points} ({((assignment.earnedPoints / assignment.points) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>

                    {assignment.notes && (
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        {assignment.notes}
                      </div>
                    )}

                    {assignment.status === 'pending' && (
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => updateAssignment(assignment.id, { status: 'submitted' })}
                          className="flex-1 bg-indigo-600 text-white py-2 rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Mark Submitted
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-indigo-600">Grade Overview</h3>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">{overallGPA}</span>
                  <span className="text-sm text-gray-500">Average</span>
                </div>
              </div>

              <div className="space-y-3">
                {courses.filter(c => c.status === 'in-progress' || c.status === 'completed').map(course => {
                  const courseAssignments = assignments.filter(a => a.courseId === course.id && a.status === 'graded');
                  const totalPoints = courseAssignments.reduce((sum, a) => sum + a.points, 0);
                  const earnedPoints = courseAssignments.reduce((sum, a) => sum + (a.earnedPoints || 0), 0);
                  const calculatedGrade = totalPoints > 0 ? ((earnedPoints / totalPoints) * 100).toFixed(1) : null;

                  return (
                    <div key={course.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{course.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({course.code})</span>
                        </div>
                        <span className={`text-lg font-bold ${
                          (course.currentGrade || 0) >= 90 ? 'text-green-600' :
                          (course.currentGrade || 0) >= 80 ? 'text-blue-600' :
                          (course.currentGrade || 0) >= 70 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {course.currentGrade ? `${course.currentGrade}%` : 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{course.instructor}</span>
                        <span>{course.credits} credits</span>
                        {calculatedGrade && (
                          <span className="text-indigo-600">
                            Calculated: {calculatedGrade}%
                          </span>
                        )}
                      </div>

                      {course.currentGrade && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                course.currentGrade >= 90 ? 'bg-green-500' :
                                course.currentGrade >= 80 ? 'bg-blue-500' :
                                course.currentGrade >= 70 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${course.currentGrade}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-indigo-600 mb-4">Assignment Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-indigo-600">{assignments.length}</div>
                  <div className="text-sm text-gray-600">Total Assignments</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {assignments.filter(a => a.status === 'graded').length}
                  </div>
                  <div className="text-sm text-gray-600">Graded</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {assignments.filter(a => a.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-gray-600">Submitted</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {assignments.filter(a => a.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagementHubPage;
