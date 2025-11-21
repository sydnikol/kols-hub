import React, { useState, useEffect } from 'react';
import { Zap, Target, TrendingUp, BookOpen, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'creative' | 'business' | 'language' | 'soft-skills' | 'other';
  currentLevel: number; // 1-5
  targetLevel: number; // 1-5
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'learning' | 'practicing' | 'proficient' | 'expert';
  resources: string[];
  notes: string;
}

interface LearningResource {
  id: string;
  name: string;
  type: 'course' | 'book' | 'video' | 'tutorial' | 'practice' | 'other';
  skill: string;
  url?: string;
  progress: number; // 0-100
  completed: boolean;
  rating: number; // 1-5
  notes: string;
}

const SkillsDevelopmentHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skills' | 'resources' | 'stats'>('skills');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);

  useEffect(() => {
    const savedSkills = localStorage.getItem('skills');
    if (savedSkills) setSkills(JSON.parse(savedSkills));
    const savedResources = localStorage.getItem('learningResources');
    if (savedResources) setResources(JSON.parse(savedResources));
  }, []);

  useEffect(() => { localStorage.setItem('skills', JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem('learningResources', JSON.stringify(resources)); }, [resources]);

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
    toast.success('Skill updated');
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
    toast.success('Skill deleted');
  };

  const activeSkills = skills.filter(s => s.status === 'learning' || s.status === 'practicing').length;
  const completedResources = resources.filter(r => r.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pb-20">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Skills Development Hub</h1>
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
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <button onClick={addSkill} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
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
                    <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, { name: e.target.value })} placeholder="Skill name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-emerald-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteSkill(skill.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={skill.category} onChange={(e) => updateSkill(skill.id, { category: e.target.value as Skill['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none">
                      <option value="technical">Technical</option>
                      <option value="creative">Creative</option>
                      <option value="business">Business</option>
                      <option value="language">Language</option>
                      <option value="soft-skills">Soft Skills</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={skill.status} onChange={(e) => updateSkill(skill.id, { status: e.target.value as Skill['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none">
                      <option value="learning">Learning</option>
                      <option value="practicing">Practicing</option>
                      <option value="proficient">Proficient</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Current Level: {skill.currentLevel}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button key={level} onClick={() => updateSkill(skill.id, { currentLevel: level })} className={`w-10 h-10 rounded ${level <= skill.currentLevel ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={skill.notes} onChange={(e) => updateSkill(skill.id, { notes: e.target.value })} placeholder="Notes, goals..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-emerald-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-emerald-600">Skill Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Skills:</span>
                  <span className="font-semibold">{skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-semibold">{activeSkills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resources Completed:</span>
                  <span className="font-semibold">{completedResources}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsDevelopmentHubPage;
