import React, { useState, useEffect } from 'react';
import { Target, Trophy, TrendingUp, Calendar, Plus, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Goal {
  id: string;
  title: string;
  category: 'personal' | 'professional' | 'health' | 'financial' | 'relationships' | 'learning' | 'creative' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  progress: number; // 0-100
  description: string;
  milestones: string[];
  notes: string;
}

interface Milestone {
  id: string;
  goalTitle: string;
  milestone: string;
  date: string;
  completed: boolean;
  notes: string;
}

interface Achievement {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  significance: number; // 1-5
  celebratedWith: string;
  notes: string;
}

const GoalsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'milestones' | 'achievements' | 'stats'>('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('personalGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    const savedMilestones = localStorage.getItem('goalMilestones');
    if (savedMilestones) setMilestones(JSON.parse(savedMilestones));
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
  }, []);

  useEffect(() => { localStorage.setItem('personalGoals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('goalMilestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('achievements', JSON.stringify(achievements)); }, [achievements]);

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: '',
      category: 'personal',
      priority: 'medium',
      status: 'not-started',
      progress: 0,
      description: '',
      milestones: [],
      notes: '',
    };
    setGoals([...goals, newGoal]);
    toast.success('Goal added');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
    toast.success('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      goalTitle: '',
      milestone: '',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      notes: '',
    };
    setMilestones([...milestones, newMilestone]);
    toast.success('Milestone added');
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Milestone updated');
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
    toast.success('Milestone deleted');
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      significance: 3,
      celebratedWith: '',
      notes: '',
    };
    setAchievements([...achievements, newAchievement]);
    toast.success('Achievement added');
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements(achievements.map(a => a.id === id ? { ...a, ...updates } : a));
    toast.success('Achievement updated');
  };

  const deleteAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
    toast.success('Achievement deleted');
  };

  const activeGoals = goals.filter(g => g.status === 'in-progress').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const avgProgress = goals.length > 0 ? (goals.reduce((sum, g) => sum + g.progress, 0) / goals.length).toFixed(0) : '0';
  const completedMilestones = milestones.filter(m => m.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 pb-20">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Goals Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeGoals}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedGoals}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedMilestones}</div>
            <div className="text-xs opacity-90">Milestones</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{achievements.length}</div>
            <div className="text-xs opacity-90">Achievements</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'milestones', label: 'Milestones', icon: Calendar },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50' : 'text-gray-600 hover:text-violet-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <button onClick={addGoal} className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Goal</span>
            </button>
            {goals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No goals yet. Set your first goal!</p>
              </div>
            ) : (
              goals.sort((a, b) => {
                if (a.status !== b.status) {
                  const statusOrder = { 'in-progress': 0, 'not-started': 1, 'on-hold': 2, 'completed': 3, 'cancelled': 4 };
                  return statusOrder[a.status] - statusOrder[b.status];
                }
                const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              }).map(goal => (
                <div key={goal.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${goal.status === 'completed' ? 'border-green-500' : goal.priority === 'critical' ? 'border-red-500' : goal.priority === 'high' ? 'border-orange-500' : 'border-violet-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={goal.title} onChange={(e) => updateGoal(goal.id, { title: e.target.value })} placeholder="Goal title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-violet-500 outline-none w-full mb-1" />
                      <textarea value={goal.description} onChange={(e) => updateGoal(goal.id, { description: e.target.value })} placeholder="Description..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-violet-500 outline-none w-full" rows={2} />
                    </div>
                    <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={goal.category} onChange={(e) => updateGoal(goal.id, { category: e.target.value as Goal['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none">
                      <option value="personal">Personal</option>
                      <option value="professional">Professional</option>
                      <option value="health">Health</option>
                      <option value="financial">Financial</option>
                      <option value="relationships">Relationships</option>
                      <option value="learning">Learning</option>
                      <option value="creative">Creative</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={goal.priority} onChange={(e) => updateGoal(goal.id, { priority: e.target.value as Goal['priority'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical</option>
                    </select>
                    <select value={goal.status} onChange={(e) => updateGoal(goal.id, { status: e.target.value as Goal['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none">
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <input type="date" value={goal.targetDate || ''} onChange={(e) => updateGoal(goal.id, { targetDate: e.target.value })} placeholder="Target date..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Progress: {goal.progress}%</label>
                    <input type="range" min="0" max="100" value={goal.progress} onChange={(e) => updateGoal(goal.id, { progress: parseInt(e.target.value) })} className="w-full" />
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                  <textarea value={goal.notes} onChange={(e) => updateGoal(goal.id, { notes: e.target.value })} placeholder="Notes, action steps..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <button onClick={addMilestone} className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Milestone</span>
            </button>
            {milestones.sort((a, b) => {
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            }).map(milestone => (
              <div key={milestone.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${milestone.completed ? 'border-green-500' : 'border-violet-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="text" value={milestone.goalTitle} onChange={(e) => updateMilestone(milestone.id, { goalTitle: e.target.value })} placeholder="Goal..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-violet-500 outline-none w-full mb-1" />
                    <input type="text" value={milestone.milestone} onChange={(e) => updateMilestone(milestone.id, { milestone: e.target.value })} placeholder="Milestone..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-violet-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteMilestone(milestone.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="date" value={milestone.date} onChange={(e) => updateMilestone(milestone.id, { date: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={milestone.completed} onChange={(e) => updateMilestone(milestone.id, { completed: e.target.checked })} className="w-5 h-5" />
                    <label className="text-sm text-gray-600">Completed</label>
                  </div>
                </div>
                <textarea value={milestone.notes} onChange={(e) => updateMilestone(milestone.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <button onClick={addAchievement} className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Achievement</span>
            </button>
            {achievements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(achievement => (
              <div key={achievement.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-violet-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="text" value={achievement.title} onChange={(e) => updateAchievement(achievement.id, { title: e.target.value })} placeholder="Achievement..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-violet-500 outline-none w-full mb-1" />
                    <input type="text" value={achievement.category} onChange={(e) => updateAchievement(achievement.id, { category: e.target.value })} placeholder="Category..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-violet-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteAchievement(achievement.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <input type="date" value={achievement.date} onChange={(e) => updateAchievement(achievement.id, { date: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none w-full mb-3" />
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-2">Significance: {achievement.significance}/5</label>
                  <input type="range" min="1" max="5" value={achievement.significance} onChange={(e) => updateAchievement(achievement.id, { significance: parseInt(e.target.value) })} className="w-full" />
                </div>
                <textarea value={achievement.description} onChange={(e) => updateAchievement(achievement.id, { description: e.target.value })} placeholder="Description..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none mb-2" rows={2} />
                <textarea value={achievement.notes} onChange={(e) => updateAchievement(achievement.id, { notes: e.target.value })} placeholder="Notes, how you celebrated..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-violet-600">Goals Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Goals:</span>
                  <span className="font-semibold">{goals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Goals:</span>
                  <span className="font-semibold">{activeGoals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Goals:</span>
                  <span className="font-semibold">{completedGoals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Progress:</span>
                  <span className="font-semibold">{avgProgress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Milestones:</span>
                  <span className="font-semibold">{milestones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Milestones:</span>
                  <span className="font-semibold">{completedMilestones}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Achievements:</span>
                  <span className="font-semibold">{achievements.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsHubPage;
