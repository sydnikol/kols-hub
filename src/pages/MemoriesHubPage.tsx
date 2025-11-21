import React, { useState, useEffect } from 'react';
import { Heart, Camera, Star, Calendar, Plus, Trash2, Award, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Memory {
  id: string;
  title: string;
  date: string;
  category: 'family' | 'friends' | 'travel' | 'achievement' | 'milestone' | 'celebration' | 'personal' | 'other';
  description: string;
  location?: string;
  people: string[];
  emotions: string[];
  significance: number; // 1-5
  favorite: boolean;
  tags: string[];
}

interface Milestone {
  id: string;
  milestone: string;
  date: string;
  category: 'personal' | 'professional' | 'education' | 'relationship' | 'health' | 'financial' | 'creative' | 'other';
  description: string;
  impact: number; // 1-5
  lessonsLearned: string;
  gratitude: string;
  celebratedWith: string[];
}

interface SpecialMoment {
  id: string;
  moment: string;
  date: string;
  type: 'first-time' | 'achievement' | 'surprise' | 'connection' | 'realization' | 'adventure' | 'other';
  whatMadeItSpecial: string;
  peopleInvolved: string[];
  feelings: string;
  wouldRelive: boolean;
  reminderDate?: string;
}

const MemoriesHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'memories' | 'milestones' | 'moments' | 'stats'>('memories');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [specialMoments, setSpecialMoments] = useState<SpecialMoment[]>([]);

  useEffect(() => {
    const savedMemories = localStorage.getItem('memories');
    if (savedMemories) setMemories(JSON.parse(savedMemories));
    const savedMilestones = localStorage.getItem('milestones');
    if (savedMilestones) setMilestones(JSON.parse(savedMilestones));
    const savedMoments = localStorage.getItem('specialMoments');
    if (savedMoments) setSpecialMoments(JSON.parse(savedMoments));
  }, []);

  useEffect(() => { localStorage.setItem('memories', JSON.stringify(memories)); }, [memories]);
  useEffect(() => { localStorage.setItem('milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('specialMoments', JSON.stringify(specialMoments)); }, [specialMoments]);

  const addMemory = () => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'personal',
      description: '',
      location: '',
      people: [],
      emotions: [],
      significance: 3,
      favorite: false,
      tags: [],
    };
    setMemories([...memories, newMemory]);
    toast.success('Memory added');
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories(memories.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Memory updated');
  };

  const deleteMemory = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
    toast.success('Memory deleted');
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      milestone: '',
      date: new Date().toISOString().split('T')[0],
      category: 'personal',
      description: '',
      impact: 3,
      lessonsLearned: '',
      gratitude: '',
      celebratedWith: [],
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

  const addSpecialMoment = () => {
    const newMoment: SpecialMoment = {
      id: Date.now().toString(),
      moment: '',
      date: new Date().toISOString().split('T')[0],
      type: 'first-time',
      whatMadeItSpecial: '',
      peopleInvolved: [],
      feelings: '',
      wouldRelive: true,
    };
    setSpecialMoments([...specialMoments, newMoment]);
    toast.success('Special moment added');
  };

  const updateSpecialMoment = (id: string, updates: Partial<SpecialMoment>) => {
    setSpecialMoments(specialMoments.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Special moment updated');
  };

  const deleteSpecialMoment = (id: string) => {
    setSpecialMoments(specialMoments.filter(m => m.id !== id));
    toast.success('Special moment deleted');
  };

  const totalMemories = memories.length;
  const favoriteMemories = memories.filter(m => m.favorite).length;
  const totalMilestones = milestones.length;
  const avgSignificance = memories.length > 0 ? (memories.reduce((sum, m) => sum + m.significance, 0) / memories.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Camera className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Memories Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Camera className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalMemories}</div>
            <div className="text-xs opacity-90">Memories</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Heart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{favoriteMemories}</div>
            <div className="text-xs opacity-90">Favorites</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalMilestones}</div>
            <div className="text-xs opacity-90">Milestones</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{avgSignificance}</div>
            <div className="text-xs opacity-90">Avg Value</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'memories', label: 'Memories', icon: Camera },
            { id: 'milestones', label: 'Milestones', icon: Award },
            { id: 'moments', label: 'Special Moments', icon: Star },
            { id: 'stats', label: 'Stats', icon: Heart },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'memories' && (
          <div className="space-y-4">
            <button onClick={addMemory} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Memory</span>
            </button>
            {memories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No memories yet. Start capturing your moments!</p>
              </div>
            ) : (
              memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(memory => (
                <div key={memory.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${memory.favorite ? 'border-purple-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="date" value={memory.date} onChange={(e) => updateMemory(memory.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-purple-500 outline-none w-full mb-1" />
                      <input type="text" value={memory.title} onChange={(e) => updateMemory(memory.id, { title: e.target.value })} placeholder="Memory title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteMemory(memory.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <select value={memory.category} onChange={(e) => updateMemory(memory.id, { category: e.target.value as Memory['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none w-full mb-3">
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="travel">Travel</option>
                    <option value="achievement">Achievement</option>
                    <option value="milestone">Milestone</option>
                    <option value="celebration">Celebration</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <input type="text" value={memory.location || ''} onChange={(e) => updateMemory(memory.id, { location: e.target.value })} placeholder="Location..." className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Significance: {memory.significance}/5</label>
                    <input type="range" min="1" max="5" value={memory.significance} onChange={(e) => updateMemory(memory.id, { significance: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <textarea value={memory.description} onChange={(e) => updateMemory(memory.id, { description: e.target.value })} placeholder="Describe this memory..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none mb-2" rows={3} />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={memory.favorite} onChange={(e) => updateMemory(memory.id, { favorite: e.target.checked })} className="w-4 h-4" />
                    <label className="text-sm text-gray-600">Mark as favorite</label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <button onClick={addMilestone} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Milestone</span>
            </button>
            {milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(milestone => (
              <div key={milestone.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-violet-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={milestone.date} onChange={(e) => updateMilestone(milestone.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-violet-500 outline-none w-full mb-1" />
                    <input type="text" value={milestone.milestone} onChange={(e) => updateMilestone(milestone.id, { milestone: e.target.value })} placeholder="Milestone..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-violet-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteMilestone(milestone.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <select value={milestone.category} onChange={(e) => updateMilestone(milestone.id, { category: e.target.value as Milestone['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none w-full mb-3">
                  <option value="personal">Personal</option>
                  <option value="professional">Professional</option>
                  <option value="education">Education</option>
                  <option value="relationship">Relationship</option>
                  <option value="health">Health</option>
                  <option value="financial">Financial</option>
                  <option value="creative">Creative</option>
                  <option value="other">Other</option>
                </select>
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">Impact: {milestone.impact}/5</label>
                  <input type="range" min="1" max="5" value={milestone.impact} onChange={(e) => updateMilestone(milestone.id, { impact: parseInt(e.target.value) })} className="w-full" />
                </div>
                <textarea value={milestone.description} onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })} placeholder="Describe this milestone..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none mb-2" rows={2} />
                <textarea value={milestone.lessonsLearned} onChange={(e) => updateMilestone(milestone.id, { lessonsLearned: e.target.value })} placeholder="Lessons learned..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none mb-2" rows={2} />
                <textarea value={milestone.gratitude} onChange={(e) => updateMilestone(milestone.id, { gratitude: e.target.value })} placeholder="What are you grateful for?" className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-violet-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'moments' && (
          <div className="space-y-4">
            <button onClick={addSpecialMoment} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Special Moment</span>
            </button>
            {specialMoments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(moment => (
              <div key={moment.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${moment.wouldRelive ? 'border-green-500' : 'border-purple-500'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="date" value={moment.date} onChange={(e) => updateSpecialMoment(moment.id, { date: e.target.value })} className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-purple-500 outline-none w-full mb-1" />
                    <input type="text" value={moment.moment} onChange={(e) => updateSpecialMoment(moment.id, { moment: e.target.value })} placeholder="Special moment..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteSpecialMoment(moment.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <select value={moment.type} onChange={(e) => updateSpecialMoment(moment.id, { type: e.target.value as SpecialMoment['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none w-full mb-3">
                  <option value="first-time">First Time</option>
                  <option value="achievement">Achievement</option>
                  <option value="surprise">Surprise</option>
                  <option value="connection">Connection</option>
                  <option value="realization">Realization</option>
                  <option value="adventure">Adventure</option>
                  <option value="other">Other</option>
                </select>
                <textarea value={moment.whatMadeItSpecial} onChange={(e) => updateSpecialMoment(moment.id, { whatMadeItSpecial: e.target.value })} placeholder="What made it special?" className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none mb-2" rows={2} />
                <textarea value={moment.feelings} onChange={(e) => updateSpecialMoment(moment.id, { feelings: e.target.value })} placeholder="How did you feel?" className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none mb-2" rows={2} />
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={moment.wouldRelive} onChange={(e) => updateSpecialMoment(moment.id, { wouldRelive: e.target.checked })} className="w-4 h-4" />
                  <label className="text-sm text-gray-600">Would relive this moment</label>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600">Memories Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Memories:</span>
                  <span className="font-semibold">{totalMemories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Memories:</span>
                  <span className="font-semibold">{favoriteMemories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Milestones:</span>
                  <span className="font-semibold">{totalMilestones}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Special Moments:</span>
                  <span className="font-semibold">{specialMoments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Would Relive:</span>
                  <span className="font-semibold">{specialMoments.filter(m => m.wouldRelive).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Significance:</span>
                  <span className="font-semibold">{avgSignificance}/5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoriesHubPage;
