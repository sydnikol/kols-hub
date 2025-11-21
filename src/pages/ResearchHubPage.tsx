import React, { useState, useEffect } from 'react';
import { Search, FileText, Lightbulb, TrendingUp, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResearchProject {
  id: string;
  title: string;
  topic: string;
  field: 'science' | 'technology' | 'humanities' | 'social-sciences' | 'arts' | 'other';
  status: 'planning' | 'researching' | 'writing' | 'reviewing' | 'completed';
  startDate: string;
  deadline?: string;
  progress: number; // 0-100
  notes: string;
}

interface ResearchNote {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  content: string;
  source?: string;
  tags: string[];
  date: string;
}

interface Citation {
  id: string;
  projectId: string;
  projectTitle: string;
  author: string;
  title: string;
  year: string;
  type: 'book' | 'article' | 'website' | 'journal' | 'other';
  url?: string;
  notes: string;
}

const ResearchHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'notes' | 'citations'>('projects');
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('researchProjects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    const savedNotes = localStorage.getItem('researchNotes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    const savedCitations = localStorage.getItem('citations');
    if (savedCitations) setCitations(JSON.parse(savedCitations));
  }, []);

  useEffect(() => { localStorage.setItem('researchProjects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('researchNotes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('citations', JSON.stringify(citations)); }, [citations]);

  const addProject = () => {
    const newProject: ResearchProject = {
      id: Date.now().toString(),
      title: '',
      topic: '',
      field: 'other',
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      progress: 0,
      notes: '',
    };
    setProjects([...projects, newProject]);
    toast.success('Project added');
  };

  const updateProject = (id: string, updates: Partial<ResearchProject>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Project updated');
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted');
  };

  const activeProjects = projects.filter(p => p.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 pb-20">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Research Hub</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Search className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeProjects}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{notes.length}</div>
            <div className="text-xs opacity-90">Notes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Lightbulb className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{citations.length}</div>
            <div className="text-xs opacity-90">Citations</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'projects', label: 'Projects', icon: Search },
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'citations', label: 'Citations', icon: Lightbulb },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50' : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <button onClick={addProject} className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Research Project</span>
            </button>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No projects yet. Start your research!</p>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={project.title} onChange={(e) => updateProject(project.id, { title: e.target.value })} placeholder="Project title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={project.topic} onChange={(e) => updateProject(project.id, { topic: e.target.value })} placeholder="Topic..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                    <select value={project.field} onChange={(e) => updateProject(project.id, { field: e.target.value as ResearchProject['field'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                      <option value="science">Science</option>
                      <option value="technology">Technology</option>
                      <option value="humanities">Humanities</option>
                      <option value="social-sciences">Social Sciences</option>
                      <option value="arts">Arts</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={project.status} onChange={(e) => updateProject(project.id, { status: e.target.value as ResearchProject['status'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                      <option value="planning">Planning</option>
                      <option value="researching">Researching</option>
                      <option value="writing">Writing</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Progress: {project.progress}%</label>
                    <input type="range" min="0" max="100" value={project.progress} onChange={(e) => updateProject(project.id, { progress: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  </div>
                  <textarea value={project.notes} onChange={(e) => updateProject(project.id, { notes: e.target.value })} placeholder="Notes, methodology..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchHubPage;
