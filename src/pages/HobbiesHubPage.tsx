import React, { useState, useEffect } from 'react';
import { Heart, Package, Clock, TrendingUp, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Hobby {
  id: string;
  name: string;
  category: 'crafting' | 'collecting' | 'outdoor' | 'indoor' | 'creative' | 'sports' | 'music' | 'tech' | 'other';
  skillLevel: number; // 1-5
  hoursSpent: number;
  started: string;
  active: boolean;
  notes: string;
}

interface HobbyProject {
  id: string;
  hobbyName: string;
  projectName: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'abandoned';
  startDate: string;
  completedDate?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  progress: number; // 0-100
  cost: number;
  notes: string;
}

interface Collection {
  id: string;
  name: string;
  category: string;
  items: number;
  value?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'ultra-rare';
  notes: string;
}

interface HobbySession {
  id: string;
  hobbyName: string;
  date: string;
  duration: number; // minutes
  activity: string;
  enjoyment: number; // 1-5
  productive: boolean;
  notes: string;
}

const HobbiesHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hobbies' | 'projects' | 'collections' | 'stats'>('hobbies');
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [projects, setProjects] = useState<HobbyProject[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [sessions, setSessions] = useState<HobbySession[]>([]);

  useEffect(() => {
    const savedHobbies = localStorage.getItem('hobbiesList');
    if (savedHobbies) setHobbies(JSON.parse(savedHobbies));
    const savedProjects = localStorage.getItem('hobbyProjects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    const savedCollections = localStorage.getItem('collections');
    if (savedCollections) setCollections(JSON.parse(savedCollections));
    const savedSessions = localStorage.getItem('hobbySessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  useEffect(() => { localStorage.setItem('hobbiesList', JSON.stringify(hobbies)); }, [hobbies]);
  useEffect(() => { localStorage.setItem('hobbyProjects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('collections', JSON.stringify(collections)); }, [collections]);
  useEffect(() => { localStorage.setItem('hobbySessions', JSON.stringify(sessions)); }, [sessions]);

  const addHobby = () => {
    const newHobby: Hobby = {
      id: Date.now().toString(),
      name: '',
      category: 'other',
      skillLevel: 1,
      hoursSpent: 0,
      started: new Date().toISOString().split('T')[0],
      active: true,
      notes: '',
    };
    setHobbies([...hobbies, newHobby]);
    toast.success('Hobby added');
  };

  const updateHobby = (id: string, updates: Partial<Hobby>) => {
    setHobbies(hobbies.map(h => h.id === id ? { ...h, ...updates } : h));
    toast.success('Hobby updated');
  };

  const deleteHobby = (id: string) => {
    setHobbies(hobbies.filter(h => h.id !== id));
    toast.success('Hobby deleted');
  };

  const addProject = () => {
    const newProject: HobbyProject = {
      id: Date.now().toString(),
      hobbyName: '',
      projectName: '',
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      difficulty: 'medium',
      progress: 0,
      cost: 0,
      notes: '',
    };
    setProjects([...projects, newProject]);
    toast.success('Project added');
  };

  const updateProject = (id: string, updates: Partial<HobbyProject>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Project updated');
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted');
  };

  const addCollection = () => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name: '',
      category: '',
      items: 0,
      rarity: 'common',
      notes: '',
    };
    setCollections([...collections, newCollection]);
    toast.success('Collection added');
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(collections.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Collection updated');
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
    toast.success('Collection deleted');
  };

  const activeHobbies = hobbies.filter(h => h.active).length;
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalItems = collections.reduce((sum, c) => sum + c.items, 0);
  const totalHours = hobbies.reduce((sum, h) => sum + h.hoursSpent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Hobbies Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Heart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeHobbies}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeProjects}</div>
            <div className="text-xs opacity-90">Projects</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Package className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalItems}</div>
            <div className="text-xs opacity-90">Items</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalHours.toFixed(0)}h</div>
            <div className="text-xs opacity-90">Total Time</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'hobbies', label: 'Hobbies', icon: Heart },
            { id: 'projects', label: 'Projects', icon: TrendingUp },
            { id: 'collections', label: 'Collections', icon: Package },
            { id: 'stats', label: 'Stats', icon: Star },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'hobbies' && (
          <div className="space-y-4">
            <button onClick={addHobby} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Hobby</span>
            </button>
            {hobbies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No hobbies yet. Track your passions!</p>
              </div>
            ) : (
              hobbies.map(hobby => (
                <div key={hobby.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${hobby.active ? 'border-indigo-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={hobby.name} onChange={(e) => updateHobby(hobby.id, { name: e.target.value })} placeholder="Hobby name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteHobby(hobby.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={hobby.category} onChange={(e) => updateHobby(hobby.id, { category: e.target.value as Hobby['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                      <option value="crafting">Crafting</option>
                      <option value="collecting">Collecting</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="indoor">Indoor</option>
                      <option value="creative">Creative</option>
                      <option value="sports">Sports</option>
                      <option value="music">Music</option>
                      <option value="tech">Technology</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="number" step="0.5" value={hobby.hoursSpent} onChange={(e) => updateHobby(hobby.id, { hoursSpent: parseFloat(e.target.value) || 0 })} placeholder="Hours spent..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                    <input type="date" value={hobby.started} onChange={(e) => updateHobby(hobby.id, { started: e.target.value })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Skill Level: {hobby.skillLevel}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button key={level} onClick={() => updateHobby(hobby.id, { skillLevel: level })} className={`w-10 h-10 rounded ${level <= hobby.skillLevel ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer text-sm mb-2">
                    <input type="checkbox" checked={hobby.active} onChange={(e) => updateHobby(hobby.id, { active: e.target.checked })} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-gray-700">Active Hobby</span>
                  </label>
                  <textarea value={hobby.notes} onChange={(e) => updateHobby(hobby.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <button onClick={addProject} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Project</span>
            </button>
            {projects.map(project => (
              <div key={project.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${project.status === 'completed' ? 'border-green-500' : project.status === 'in-progress' ? 'border-indigo-500' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="text" value={project.hobbyName} onChange={(e) => updateProject(project.id, { hobbyName: e.target.value })} placeholder="Hobby..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-indigo-500 outline-none w-full mb-1" />
                    <input type="text" value={project.projectName} onChange={(e) => updateProject(project.id, { projectName: e.target.value })} placeholder="Project name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={project.status} onChange={(e) => updateProject(project.id, { status: e.target.value as HobbyProject['status'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                  <select value={project.difficulty} onChange={(e) => updateProject(project.id, { difficulty: e.target.value as HobbyProject['difficulty'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                  <input type="number" step="0.01" value={project.cost} onChange={(e) => updateProject(project.id, { cost: parseFloat(e.target.value) || 0 })} placeholder="Cost..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-2">Progress: {project.progress}%</label>
                  <input type="range" min="0" max="100" value={project.progress} onChange={(e) => updateProject(project.id, { progress: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
                <textarea value={project.notes} onChange={(e) => updateProject(project.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="space-y-4">
            <button onClick={addCollection} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Collection</span>
            </button>
            {collections.map(collection => (
              <div key={collection.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-3">
                  <input type="text" value={collection.name} onChange={(e) => updateCollection(collection.id, { name: e.target.value })} placeholder="Collection name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 mr-2" />
                  <button onClick={() => deleteCollection(collection.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <input type="text" value={collection.category} onChange={(e) => updateCollection(collection.id, { category: e.target.value })} placeholder="Category..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                  <input type="number" value={collection.items} onChange={(e) => updateCollection(collection.id, { items: parseInt(e.target.value) || 0 })} placeholder="Number of items..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                  <select value={collection.rarity} onChange={(e) => updateCollection(collection.id, { rarity: e.target.value as Collection['rarity'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none">
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="very-rare">Very Rare</option>
                    <option value="ultra-rare">Ultra Rare</option>
                  </select>
                  <input type="number" step="0.01" value={collection.value || ''} onChange={(e) => updateCollection(collection.id, { value: parseFloat(e.target.value) || undefined })} placeholder="Estimated value..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" />
                </div>
                <textarea value={collection.notes} onChange={(e) => updateCollection(collection.id, { notes: e.target.value })} placeholder="Notes..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-indigo-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">Hobby Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hobbies:</span>
                  <span className="font-semibold">{hobbies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Hobbies:</span>
                  <span className="font-semibold">{activeHobbies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Projects:</span>
                  <span className="font-semibold">{activeProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Projects:</span>
                  <span className="font-semibold">{completedProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collections:</span>
                  <span className="font-semibold">{collections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items Collected:</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time Invested:</span>
                  <span className="font-semibold">{totalHours.toFixed(1)} hours</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HobbiesHubPage;
