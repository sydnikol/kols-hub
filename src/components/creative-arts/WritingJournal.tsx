import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, Clock, TrendingUp, Calendar, Feather, Save, X, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface WritingEntry {
  id: string;
  projectId: string;
  content: string;
  wordCount: number;
  date: string;
  duration: number; // minutes
  mood: string;
  notes: string;
  createdAt: number;
}

interface WritingProject {
  id: string;
  title: string;
  genre: string;
  description: string;
  goal: number; // word count goal
  currentWords: number;
  status: 'planning' | 'drafting' | 'editing' | 'complete' | 'on-hold';
  entries: WritingEntry[];
  createdAt: number;
}

const genres = [
  'Fiction',
  'Poetry',
  'Memoir',
  'Biography',
  'Essay',
  'Short Story',
  'Novel',
  'Screenplay',
  'Blog Post',
  'Journal',
  'Creative Nonfiction',
  'Fantasy',
  'Science Fiction',
  'Romance',
  'Mystery',
  'Horror',
  'Other',
];

const moods = [
  'Inspired',
  'Focused',
  'Struggling',
  'Flowing',
  'Blocked',
  'Excited',
  'Reflective',
  'Determined',
];

const statuses = [
  { value: 'planning', label: 'Planning', color: 'blue' },
  { value: 'drafting', label: 'Drafting', color: 'purple' },
  { value: 'editing', label: 'Editing', color: 'orange' },
  { value: 'complete', label: 'Complete', color: 'green' },
  { value: 'on-hold', label: 'On Hold', color: 'red' },
] as const;

export default function WritingJournal() {
  const [projects, setProjects] = useState<WritingProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [viewMode, setViewMode] = useState<'projects' | 'writing' | 'stats'>('projects');
  const [projectForm, setProjectForm] = useState({
    title: '',
    genre: genres[0],
    description: '',
    goal: 50000,
    status: 'planning' as WritingProject['status'],
  });
  const [writingForm, setWritingForm] = useState({
    content: '',
    duration: 30,
    mood: moods[0],
    notes: '',
  });
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('writingProjects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('writingProjects', JSON.stringify(projects));
  }, [projects]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectForm.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    const newProject: WritingProject = {
      id: Date.now().toString(),
      ...projectForm,
      currentWords: 0,
      entries: [],
      createdAt: Date.now(),
    };

    setProjects([...projects, newProject]);
    setProjectForm({
      title: '',
      genre: genres[0],
      description: '',
      goal: 50000,
      status: 'planning',
    });
    setIsAddingProject(false);
    toast.success('Project created!');
  };

  const handleSaveEntry = () => {
    if (!selectedProject || !writingForm.content.trim()) {
      toast.error('Please write something before saving');
      return;
    }

    const wordCount = writingForm.content.trim().split(/\s+/).length;
    const actualDuration = startTime ? Math.round((Date.now() - startTime) / 60000) : writingForm.duration;

    const newEntry: WritingEntry = {
      id: Date.now().toString(),
      projectId: selectedProject,
      content: writingForm.content,
      wordCount,
      date: new Date().toISOString().split('T')[0],
      duration: actualDuration,
      mood: writingForm.mood,
      notes: writingForm.notes,
      createdAt: Date.now(),
    };

    setProjects(projects.map(proj =>
      proj.id === selectedProject
        ? {
            ...proj,
            entries: [...proj.entries, newEntry],
            currentWords: proj.currentWords + wordCount,
          }
        : proj
    ));

    setWritingForm({
      content: '',
      duration: 30,
      mood: moods[0],
      notes: '',
    });
    setStartTime(null);
    setIsWriting(false);
    toast.success(`Entry saved! ${wordCount} words added`);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project and all its entries?')) {
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject === id) {
        setSelectedProject(null);
      }
      toast.success('Project deleted');
    }
  };

  const handleDeleteEntry = (projectId: string, entryId: string) => {
    if (confirm('Delete this entry?')) {
      setProjects(projects.map(proj => {
        if (proj.id === projectId) {
          const entry = proj.entries.find(e => e.id === entryId);
          const wordsToRemove = entry?.wordCount || 0;
          return {
            ...proj,
            entries: proj.entries.filter(e => e.id !== entryId),
            currentWords: Math.max(0, proj.currentWords - wordsToRemove),
          };
        }
        return proj;
      }));
      toast.success('Entry deleted');
    }
  };

  const updateProjectStatus = (projectId: string, status: WritingProject['status']) => {
    setProjects(projects.map(proj =>
      proj.id === projectId ? { ...proj, status } : proj
    ));
    toast.success(`Status updated to ${status}`);
  };

  const startWritingSession = (projectId: string) => {
    setSelectedProject(projectId);
    setIsWriting(true);
    setStartTime(Date.now());
    setViewMode('writing');
  };

  const getProjectStats = (project: WritingProject) => {
    const totalSessions = project.entries.length;
    const totalMinutes = project.entries.reduce((sum, e) => sum + e.duration, 0);
    const avgWordsPerSession = totalSessions > 0 ? Math.round(project.currentWords / totalSessions) : 0;
    const progress = project.goal > 0 ? (project.currentWords / project.goal) * 100 : 0;

    return { totalSessions, totalMinutes, avgWordsPerSession, progress };
  };

  const getOverallStats = () => {
    const totalProjects = projects.length;
    const totalWords = projects.reduce((sum, p) => sum + p.currentWords, 0);
    const totalEntries = projects.reduce((sum, p) => sum + p.entries.length, 0);
    const totalMinutes = projects.reduce((sum, p) =>
      sum + p.entries.reduce((s, e) => s + e.duration, 0), 0
    );
    const completedProjects = projects.filter(p => p.status === 'complete').length;

    return { totalProjects, totalWords, totalEntries, totalMinutes, completedProjects };
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const overallStats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-purple-400" />
            Writing Journal
          </h2>
          <p className="text-purple-200/70 mt-1">
            {overallStats.totalWords.toLocaleString()} words across {overallStats.totalProjects} projects
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

      {/* View Mode Tabs */}
      <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
        {(['projects', 'writing', 'stats'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              viewMode === mode
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                : 'text-purple-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* New Project Form */}
      {isAddingProject && (
        <form onSubmit={handleCreateProject} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Create New Project</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-purple-100 mb-2">Project Title *</label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                placeholder="My Novel, Poetry Collection, etc."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-100 mb-2">Genre</label>
                <select
                  value={projectForm.genre}
                  onChange={(e) => setProjectForm({ ...projectForm, genre: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-100 mb-2">Word Count Goal</label>
                <input
                  type="number"
                  value={projectForm.goal}
                  onChange={(e) => setProjectForm({ ...projectForm, goal: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-purple-100 mb-2">Status</label>
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as WritingProject['status'] })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-purple-100 mb-2">Description</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[100px]"
                placeholder="What's this project about?"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
          >
            Create Project
          </button>
        </form>
      )}

      {/* Projects View */}
      {viewMode === 'projects' && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
              <BookOpen className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-purple-200/70 text-lg">No writing projects yet</p>
              <p className="text-purple-200/50 text-sm mt-2">Create your first project to start writing!</p>
            </div>
          ) : (
            projects.map(project => {
              const stats = getProjectStats(project);
              const statusInfo = statuses.find(s => s.value === project.status)!;

              return (
                <div
                  key={project.id}
                  className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                        <span className={`px-2 py-1 bg-${statusInfo.color}-500/20 text-${statusInfo.color}-300 rounded-full text-xs font-semibold`}>
                          {statusInfo.label}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {project.genre}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-purple-200/70 text-sm mb-3">{project.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startWritingSession(project.id)}
                        className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all"
                        title="Start writing"
                      >
                        <Feather className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                        title="Delete project"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-purple-200">
                        {project.currentWords.toLocaleString()} / {project.goal.toLocaleString()} words
                      </span>
                      <span className="text-purple-300 font-semibold">
                        {stats.progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-black/40 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(stats.progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Sessions</span>
                      </div>
                      <p className="text-white font-bold text-lg">{stats.totalSessions}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                        <Clock className="w-4 h-4" />
                        <span>Time</span>
                      </div>
                      <p className="text-white font-bold text-lg">{Math.round(stats.totalMinutes / 60)}h</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                      <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Avg/Session</span>
                      </div>
                      <p className="text-white font-bold text-lg">{stats.avgWordsPerSession}</p>
                    </div>
                  </div>

                  {/* Recent Entries */}
                  {project.entries.length > 0 && (
                    <div>
                      <h4 className="text-purple-200 font-semibold mb-2">Recent Entries</h4>
                      <div className="space-y-2">
                        {project.entries.slice(-3).reverse().map(entry => (
                          <div key={entry.id} className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-purple-200">{new Date(entry.date).toLocaleDateString()}</span>
                                <span className="text-purple-300">{entry.wordCount} words</span>
                                <span className="text-purple-300">{entry.duration} min</span>
                                <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">
                                  {entry.mood}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteEntry(project.id, entry.id)}
                                className="text-red-300 hover:text-red-200 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-purple-100 text-sm line-clamp-2">{entry.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Selector */}
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {statuses.map(s => (
                      <button
                        key={s.value}
                        onClick={() => updateProjectStatus(project.id, s.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          project.status === s.value
                            ? `bg-${s.color}-500/30 text-${s.color}-300 border border-${s.color}-500/50`
                            : 'bg-white/5 text-purple-300 hover:bg-white/10'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Writing View */}
      {viewMode === 'writing' && (
        <div className="space-y-4">
          {!selectedProject ? (
            <div className="text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
              <Feather className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-purple-200/70 text-lg">Select a project to start writing</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {selectedProjectData?.title}
                </h3>
                <div className="flex gap-2">
                  {startTime && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">
                      Writing...
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-purple-100 mb-2">Your Writing</label>
                  <textarea
                    value={writingForm.content}
                    onChange={(e) => setWritingForm({ ...writingForm, content: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 min-h-[400px] font-mono leading-relaxed"
                    placeholder="Start writing your thoughts, stories, poetry..."
                  />
                  <div className="flex items-center justify-between mt-2 text-sm text-purple-200">
                    <span>
                      Word count: {writingForm.content.trim() ? writingForm.content.trim().split(/\s+/).length : 0}
                    </span>
                    {startTime && (
                      <span>
                        Time: {Math.round((Date.now() - startTime) / 60000)} minutes
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-100 mb-2">Mood</label>
                    <select
                      value={writingForm.mood}
                      onChange={(e) => setWritingForm({ ...writingForm, mood: e.target.value })}
                      className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    >
                      {moods.map(mood => (
                        <option key={mood} value={mood}>{mood}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-100 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={writingForm.duration}
                      onChange={(e) => setWritingForm({ ...writingForm, duration: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      min="1"
                      disabled={!!startTime}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-purple-100 mb-2">Session Notes</label>
                  <textarea
                    value={writingForm.notes}
                    onChange={(e) => setWritingForm({ ...writingForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                    placeholder="How did this session go? Any insights?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEntry}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Entry
                  </button>
                  <button
                    onClick={() => {
                      if (writingForm.content && !confirm('Discard unsaved writing?')) return;
                      setIsWriting(false);
                      setStartTime(null);
                      setWritingForm({
                        content: '',
                        duration: 30,
                        mood: moods[0],
                        notes: '',
                      });
                    }}
                    className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats View */}
      {viewMode === 'stats' && (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Overall Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Total Words</p>
                <p className="text-white font-bold text-2xl">{overallStats.totalWords.toLocaleString()}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Projects</p>
                <p className="text-white font-bold text-2xl">{overallStats.totalProjects}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Entries</p>
                <p className="text-white font-bold text-2xl">{overallStats.totalEntries}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Hours</p>
                <p className="text-white font-bold text-2xl">{Math.round(overallStats.totalMinutes / 60)}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-300 text-sm mb-1">Completed</p>
                <p className="text-white font-bold text-2xl">{overallStats.completedProjects}</p>
              </div>
            </div>
          </div>

          {/* Project Breakdown */}
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Projects Breakdown</h3>
            <div className="space-y-3">
              {projects.map(project => {
                const stats = getProjectStats(project);
                return (
                  <div key={project.id} className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{project.title}</h4>
                      <span className="text-purple-300 text-sm">{project.genre}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-purple-300">Words</p>
                        <p className="text-white font-semibold">{project.currentWords.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-purple-300">Sessions</p>
                        <p className="text-white font-semibold">{stats.totalSessions}</p>
                      </div>
                      <div>
                        <p className="text-purple-300">Hours</p>
                        <p className="text-white font-semibold">{Math.round(stats.totalMinutes / 60)}</p>
                      </div>
                      <div>
                        <p className="text-purple-300">Progress</p>
                        <p className="text-white font-semibold">{stats.progress.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
