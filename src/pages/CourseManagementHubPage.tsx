import React, { useState, useEffect } from 'react';
import { GraduationCap, FileText, Target, Calendar, Plus, Trash2, Star } from 'lucide-react';
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
}

interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'homework' | 'quiz' | 'exam' | 'project' | 'paper' | 'presentation' | 'other';
  dueDate: string;
  points: number;
  earnedPoints?: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

const CourseManagementHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'grades'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
  }, []);

  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('assignments', JSON.stringify(assignments)); }, [assignments]);

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
    };
    setCourses([...courses, newCourse]);
    toast.success('Course added');
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Course updated');
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success('Course deleted');
  };

  const activeCourses = courses.filter(c => c.status === 'in-progress' || c.status === 'enrolled').length;
  const totalCredits = courses.filter(c => c.status === 'in-progress' || c.status === 'enrolled').reduce((sum, c) => sum + c.credits, 0);
  const pendingAssignments = assignments.filter(a => !a.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <GraduationCap className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Course Management Hub</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
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
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'courses', label: 'Courses', icon: GraduationCap },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'grades', label: 'Grades', icon: Target },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <button onClick={addCourse} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
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
                <div key={course.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={course.name} onChange={(e) => updateCourse(course.id, { name: e.target.value })} placeholder="Course name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteCourse(course.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input type="text" value={course.code} onChange={(e) => updateCourse(course.id, { code: e.target.value })} placeholder="Course code..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    <input type="text" value={course.instructor} onChange={(e) => updateCourse(course.id, { instructor: e.target.value })} placeholder="Instructor..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    <input type="number" value={course.credits} onChange={(e) => updateCourse(course.id, { credits: parseInt(e.target.value) || 0 })} placeholder="Credits..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    <select value={course.status} onChange={(e) => updateCourse(course.id, { status: e.target.value as Course['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none">
                      <option value="enrolled">Enrolled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </div>
                  <textarea value={course.notes} onChange={(e) => updateCourse(course.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'grades' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Grade Overview</h3>
              <div className="space-y-3">
                {courses.filter(c => c.status === 'in-progress' || c.status === 'completed').map(course => (
                  <div key={course.id} className="flex justify-between border-b pb-2">
                    <span className="text-gray-700">{course.name}</span>
                    <span className="font-semibold">{course.currentGrade ? `${course.currentGrade}%` : 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagementHubPage;
