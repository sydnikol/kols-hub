import React, { useState, useEffect } from 'react';
import { GraduationCap, Users, Target, TrendingUp, Plus, Trash2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface Mentor {
  id: string;
  name: string;
  expertise: string;
  role: 'mentor' | 'mentee';
  relationship: 'formal' | 'informal';
  status: 'active' | 'inactive' | 'completed';
  startDate?: string;
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'as-needed';
  contact?: string;
  notes: string;
}

interface MentorshipSession {
  id: string;
  mentorName: string;
  role: 'mentor' | 'mentee';
  date: string;
  duration: number; // minutes
  topics: string[];
  insights: string;
  actionItems: string;
  value: number; // 1-5
}

interface SkillGoal {
  id: string;
  skill: string;
  mentorName: string;
  currentLevel: number; // 1-5
  targetLevel: number; // 1-5
  deadline?: string;
  status: 'not-started' | 'in-progress' | 'achieved';
  notes: string;
}

const MentorshipHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mentors' | 'sessions' | 'goals' | 'stats'>('mentors');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [goals, setGoals] = useState<SkillGoal[]>([]);

  useEffect(() => {
    const savedMentors = localStorage.getItem('mentorshipRelations');
    if (savedMentors) setMentors(JSON.parse(savedMentors));
    const savedSessions = localStorage.getItem('mentorshipSessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    const savedGoals = localStorage.getItem('mentorshipGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => { localStorage.setItem('mentorshipRelations', JSON.stringify(mentors)); }, [mentors]);
  useEffect(() => { localStorage.setItem('mentorshipSessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('mentorshipGoals', JSON.stringify(goals)); }, [goals]);

  const addMentor = () => {
    const newMentor: Mentor = {
      id: Date.now().toString(),
      name: '',
      expertise: '',
      role: 'mentee',
      relationship: 'informal',
      status: 'active',
      meetingFrequency: 'monthly',
      notes: '',
    };
    setMentors([...mentors, newMentor]);
    toast.success('Mentorship added');
  };

  const updateMentor = (id: string, updates: Partial<Mentor>) => {
    setMentors(mentors.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Mentorship updated');
  };

  const deleteMentor = (id: string) => {
    setMentors(mentors.filter(m => m.id !== id));
    toast.success('Mentorship deleted');
  };

  const activeMentorships = mentors.filter(m => m.status === 'active').length;
  const totalSessions = sessions.length;
  const achievedGoals = goals.filter(g => g.status === 'achieved').length;
  const mentorsCount = mentors.filter(m => m.role === 'mentor').length;
  const menteesCount = mentors.filter(m => m.role === 'mentee').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <GraduationCap className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Mentorship Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeMentorships}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <GraduationCap className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalSessions}</div>
            <div className="text-xs opacity-90">Sessions</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Target className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{achievedGoals}</div>
            <div className="text-xs opacity-90">Goals</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{mentorsCount}/{menteesCount}</div>
            <div className="text-xs opacity-90">Mentors/Mentees</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'mentors', label: 'Relationships', icon: Users },
            { id: 'sessions', label: 'Sessions', icon: GraduationCap },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'mentors' && (
          <div className="space-y-4">
            <button onClick={addMentor} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Mentorship</span>
            </button>
            {mentors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No mentorships yet. Share knowledge!</p>
              </div>
            ) : (
              mentors.map(mentor => (
                <div key={mentor.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${mentor.status === 'active' ? (mentor.role === 'mentor' ? 'border-blue-500' : 'border-green-500') : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={mentor.name} onChange={(e) => updateMentor(mentor.id, { name: e.target.value })} placeholder="Name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full mb-1" />
                      <input type="text" value={mentor.expertise} onChange={(e) => updateMentor(mentor.id, { expertise: e.target.value })} placeholder="Expertise..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteMentor(mentor.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={mentor.role} onChange={(e) => updateMentor(mentor.id, { role: e.target.value as Mentor['role'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="mentor">I am the Mentor</option>
                      <option value="mentee">I am the Mentee</option>
                    </select>
                    <select value={mentor.relationship} onChange={(e) => updateMentor(mentor.id, { relationship: e.target.value as Mentor['relationship'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="formal">Formal</option>
                      <option value="informal">Informal</option>
                    </select>
                    <select value={mentor.status} onChange={(e) => updateMentor(mentor.id, { status: e.target.value as Mentor['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select value={mentor.meetingFrequency} onChange={(e) => updateMentor(mentor.id, { meetingFrequency: e.target.value as Mentor['meetingFrequency'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </div>
                  <textarea value={mentor.notes} onChange={(e) => updateMentor(mentor.id, { notes: e.target.value })} placeholder="Notes, focus areas..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">Mentorship Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Mentorships:</span>
                  <span className="font-semibold">{mentors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Relationships:</span>
                  <span className="font-semibold">{activeMentorships}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mentors:</span>
                  <span className="font-semibold">{mentorsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mentees:</span>
                  <span className="font-semibold">{menteesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions:</span>
                  <span className="font-semibold">{totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goals Achieved:</span>
                  <span className="font-semibold">{achievedGoals}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipHubPage;
