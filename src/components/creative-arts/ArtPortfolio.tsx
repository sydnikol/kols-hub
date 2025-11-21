import React, { useState, useEffect } from 'react';
import { Palette, Plus, Edit2, Trash2, Clock, Image, Tag, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ArtProject {
  id: string;
  title: string;
  medium: string;
  description: string;
  status: 'idea' | 'in-progress' | 'completed' | 'abandoned';
  startDate: string;
  completionDate?: string;
  timeSpent: number; // minutes
  materials: string[];
  tags: string[];
  size?: string;
  series?: string;
  notes: string;
  sessions: ArtSession[];
  createdAt: number;
}

interface ArtSession {
  id: string;
  date: string;
  duration: number; // minutes
  progress: string;
  mood: string;
  notes: string;
  createdAt: number;
}

const mediums = [
  'Acrylic Painting',
  'Oil Painting',
  'Watercolor',
  'Drawing (Pencil)',
  'Drawing (Ink)',
  'Charcoal',
  'Pastel',
  'Digital Art',
  'Mixed Media',
  'Sculpture',
  'Ceramics',
  'Photography',
  'Printmaking',
  'Collage',
  'Fiber Art',
  'Other',
];

const moods = [
  'Inspired',
  'Focused',
  'Experimental',
  'Frustrated',
  'Flowing',
  'Contemplative',
  'Excited',
  'Relaxed',
];

export default function ArtPortfolio() {
  const [projects, setProjects] = useState<ArtProject[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLoggingSession, setIsLoggingSession] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [projectForm, setProjectForm] = useState({
    title: '',
    medium: mediums[0],
    description: '',
    status: 'idea' as ArtProject['status'],
    startDate: new Date().toISOString().split('T')[0],
    size: '',
    series: '',
    notes: '',
  });
  const [materialsInput, setMaterialsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tempMaterials, setTempMaterials] = useState<string[]>([]);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [sessionForm, setSessionForm] = useState({
    duration: 60,
    progress: '',
    mood: moods[0],
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('artProjects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('artProjects', JSON.stringify(projects));
  }, [projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectForm.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    if (editingId) {
      setProjects(projects.map(project =>
        project.id === editingId
          ? {
              ...project,
              ...projectForm,
              materials: tempMaterials,
              tags: tempTags,
            }
          : project
      ));
      toast.success('Project updated!');
      setEditingId(null);
    } else {
      const newProject: ArtProject = {
        id: Date.now().toString(),
        ...projectForm,
        materials: tempMaterials,
        tags: tempTags,
        timeSpent: 0,
        sessions: [],
        createdAt: Date.now(),
      };
      setProjects([...projects, newProject]);
      toast.success('Project created!');
    }

    resetForm();
  };

  const resetForm = () => {
    setProjectForm({
      title: '',
      medium: mediums[0],
      description: '',
      status: 'idea',
      startDate: new Date().toISOString().split('T')[0],
      size: '',
      series: '',
      notes: '',
    });
    setTempMaterials([]);
    setTempTags([]);
    setMaterialsInput('');
    setTagsInput('');
    setIsAddingProject(false);
  };

  const handleEdit = (project: ArtProject) => {
    setProjectForm({
      title: project.title,
      medium: project.medium,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      size: project.size || '',
      series: project.series || '',
      notes: project.notes,
    });
    setTempMaterials(project.materials);
    setTempTags(project.tags);
    setEditingId(project.id);
    setIsAddingProject(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project and all its sessions?')) {
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject === id) {
        setSelectedProject(null);
      }
      toast.success('Project deleted');
    }
  };

  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject) return;

    const newSession: ArtSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...sessionForm,
      createdAt: Date.now(),
    };

    setProjects(projects.map(proj =>
      proj.id === selectedProject
        ? {
            ...proj,
            sessions: [...proj.sessions, newSession],
            timeSpent: proj.timeSpent + sessionForm.duration,
            status: proj.status === 'idea' ? 'in-progress' : proj.status,
          }
        : proj
    ));

    setSessionForm({
      duration: 60,
      progress: '',
      mood: moods[0],
      notes: '',
    });
    setIsLoggingSession(false);
    toast.success('Session logged!');
  };

  const updateProjectStatus = (projectId: string, status: ArtProject['status']) => {
    setProjects(projects.map(proj => {
      if (proj.id === projectId) {
        const updates: Partial<ArtProject> = { status };
        if (status === 'completed' && !proj.completionDate) {
          updates.completionDate = new Date().toISOString().split('T')[0];
        }
        return { ...proj, ...updates };
      }
      return proj;
    }));
    toast.success(`Status updated to ${status}`);
  };

  const addMaterial = () => {
    if (!materialsInput.trim()) return;
    if (!tempMaterials.includes(materialsInput.trim())) {
      setTempMaterials([...tempMaterials, materialsInput.trim()]);
    }
    setMaterialsInput('');
  };

  const removeMaterial = (material: string) => {
    setTempMaterials(tempMaterials.filter(m => m !== material));
  };

  const addTag = () => {
    if (!tagsInput.trim()) return;
    if (!tempTags.includes(tagsInput.trim())) {
      setTempTags([...tempTags, tagsInput.trim()]);
    }
    setTagsInput('');
  };

  const removeTag = (tag: string) => {
    setTempTags(tempTags.filter(t => t !== tag));
  };

  const getFilteredProjects = () => {
    return projects.filter(project => {
      if (filter === 'all') return true;
      if (filter === 'in-progress') return project.status === 'in-progress' || project.status === 'idea';
      if (filter === 'completed') return project.status === 'completed';
      return true;
    }).sort((a, b) => b.createdAt - a.createdAt);
  };

  const getStatusColor = (status: ArtProject['status']) => {
    return {
      idea: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
      'in-progress': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
      abandoned: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    }[status];
  };

  const getTotalStats = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalHours = projects.reduce((sum, p) => sum + p.timeSpent, 0) / 60;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;

    return { totalProjects, completedProjects, totalHours, inProgress };
  };

  const filteredProjects = getFilteredProjects();
  const stats = getTotalStats();
  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Palette className="w-7 h-7 text-purple-400" />
            Art Portfolio
          </h2>
          <p className="text-purple-200/70 mt-1">
            {stats.totalProjects} projects • {stats.completedProjects} completed • {Math.round(stats.totalHours)}h total
          </p>
        </div>
        <button
          onClick={() => setIsAddingProject(!isAddingProject)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2"
        >
          {isAddingProject ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAddingProject ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
        {(['all', 'in-progress', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              filter === tab
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                : 'text-purple-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'in-progress' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isAddingProject && (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Project' : 'Create New Project'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-purple-100 mb-2">Project Title *</label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                placeholder="Summer Landscape, Abstract Series #3, etc."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-100 mb-2">Medium</label>
                <select
                  value={projectForm.medium}
                  onChange={(e) => setProjectForm({ ...projectForm, medium: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  {mediums.map(medium => (
                    <option key={medium} value={medium}>{medium}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-100 mb-2">Status</label>
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as ArtProject['status'] })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="idea">Idea</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-100 mb-2">Start Date</label>
                <input
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-100 mb-2">Size</label>
                <input
                  type="text"
                  value={projectForm.size}
                  onChange={(e) => setProjectForm({ ...projectForm, size: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  placeholder="16x20 inches, A4, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-purple-100 mb-2">Series/Collection</label>
                <input
                  type="text"
                  value={projectForm.series}
                  onChange={(e) => setProjectForm({ ...projectForm, series: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  placeholder="Abstract Series, Nature Studies, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Description</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                placeholder="What's this project about?"
              />
            </div>

            {/* Materials */}
            <div>
              <label className="block text-purple-100 mb-2">Materials</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={materialsInput}
                  onChange={(e) => setMaterialsInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                  className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  placeholder="Add material..."
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {tempMaterials.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tempMaterials.map(material => (
                    <span
                      key={material}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                    >
                      {material}
                      <button
                        type="button"
                        onClick={() => removeMaterial(material)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-purple-100 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  placeholder="Add tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {tempTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tempTags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Notes</label>
              <textarea
                value={projectForm.notes}
                onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                placeholder="Any additional notes about this project..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
            >
              {editingId ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Log Session Modal */}
      {isLoggingSession && selectedProject && (
        <form onSubmit={handleLogSession} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Log Art Session</h3>
          <p className="text-purple-200 mb-4">Working on: {selectedProjectData?.title}</p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-100 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={sessionForm.duration}
                  onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-purple-100 mb-2">Mood</label>
                <select
                  value={sessionForm.mood}
                  onChange={(e) => setSessionForm({ ...sessionForm, mood: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  {moods.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Progress Made</label>
              <textarea
                value={sessionForm.progress}
                onChange={(e) => setSessionForm({ ...sessionForm, progress: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                placeholder="What did you accomplish in this session?"
              />
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Session Notes</label>
              <textarea
                value={sessionForm.notes}
                onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                placeholder="Techniques tried, challenges, insights..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
            >
              Log Session
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoggingSession(false);
                setSessionForm({
                  duration: 60,
                  progress: '',
                  mood: moods[0],
                  notes: '',
                });
              }}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
            <Palette className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-purple-200/70 text-lg">No art projects yet</p>
            <p className="text-purple-200/50 text-sm mt-2">Create your first project to start tracking your art!</p>
          </div>
        ) : (
          filteredProjects.map(project => {
            const statusColor = getStatusColor(project.status);
            const hoursSpent = Math.round(project.timeSpent / 60 * 10) / 10;

            return (
              <div
                key={project.id}
                className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-1 ${statusColor.bg} ${statusColor.text} rounded-full text-xs font-semibold`}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        {project.medium}
                      </span>
                      {project.series && (
                        <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                          {project.series}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedProject(project.id);
                        setIsLoggingSession(true);
                      }}
                      className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                      title="Log session"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                      title="Edit project"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                      title="Delete project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {project.description && (
                  <p className="text-purple-200/70 text-sm mb-3">{project.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-black/30 rounded-lg p-2 border border-purple-500/20">
                    <p className="text-purple-300 text-xs mb-1">Time Spent</p>
                    <p className="text-white font-semibold">{hoursSpent}h</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2 border border-purple-500/20">
                    <p className="text-purple-300 text-xs mb-1">Sessions</p>
                    <p className="text-white font-semibold">{project.sessions.length}</p>
                  </div>
                  {project.size && (
                    <div className="col-span-2 bg-black/30 rounded-lg p-2 border border-purple-500/20">
                      <p className="text-purple-300 text-xs mb-1">Size</p>
                      <p className="text-white font-semibold text-sm">{project.size}</p>
                    </div>
                  )}
                </div>

                {project.materials.length > 0 && (
                  <div className="mb-3">
                    <p className="text-purple-300 text-xs mb-2">Materials:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.materials.map(material => (
                        <span
                          key={material}
                          className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.tags.length > 0 && (
                  <div className="mb-3">
                    <p className="text-purple-300 text-xs mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.sessions.length > 0 && (
                  <div>
                    <p className="text-purple-300 text-xs mb-2">Recent Sessions:</p>
                    <div className="space-y-2">
                      {project.sessions.slice(-2).reverse().map(session => (
                        <div key={session.id} className="bg-black/30 rounded-lg p-2 border border-purple-500/20">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-purple-200">{new Date(session.date).toLocaleDateString()}</span>
                            <span className="text-purple-300">{session.duration} min</span>
                          </div>
                          {session.progress && (
                            <p className="text-purple-100 text-xs">{session.progress}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Status Change */}
                <div className="mt-3 pt-3 border-t border-purple-500/20 flex gap-2">
                  {['idea', 'in-progress', 'completed', 'abandoned'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateProjectStatus(project.id, status as ArtProject['status'])}
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                        project.status === status
                          ? `${getStatusColor(status as ArtProject['status']).bg} ${getStatusColor(status as ArtProject['status']).text}`
                          : 'bg-white/5 text-purple-300 hover:bg-white/10'
                      }`}
                      disabled={project.status === status}
                    >
                      {status === 'in-progress' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
