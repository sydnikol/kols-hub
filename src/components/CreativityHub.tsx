import React, { useState, useEffect } from 'react';
import { Palette, Camera, Pen, Music, Globe } from 'lucide-react';

const ART_PROMPTS = {
  poetry: [
    'Write about the color of silence',
    'A haiku about your favorite time of day',
    'Describe a memory using only sensory details',
    'Write a poem as if you\'re speaking to your younger self',
    'Create a sonnet about chronic illness',
    'Write about what home feels like',
    'A free verse about transformation',
    'Ekphrastic poem inspired by your favorite painting'
  ],
  photography: [
    'Capture light through a window',
    'Photo of something purple in your space',
    'Shadow play with hands',
    'Texture close-up',
    'Self-portrait with one light source',
    'Something that represents rest',
    'The color of your current mood',
    'An object that tells a story'
  ],
  drawing: [
    'Draw your energy level as a creature',
    'Sketch your ideal sanctuary',
    'Doodle pattern inspired by fabric',
    'Portrait of your altar items',
    'Map of your emotional landscape',
    'Design a personal sigil',
    'Illustrate a dream from this week',
    'Draw your favorite comfort item'
  ],
  mixed: [
    'Collage using magazine cutouts about identity',
    'Create a zine page about spoon theory',
    'Digital art combining photos and drawings',
    'Mixed media piece with found objects',
    'Art journal spread about today',
    'Typography poster with a favorite quote',
    'Fabric scrap artwork',
    'Paint over old book pages'
  ]
};

interface CreativeProject {
  id: string;
  date: Date;
  type: string;
  title: string;
  description: string;
  language?: string;
  tags?: string[];
  completed: boolean;
}

export const CreativityHub: React.FC = () => {
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [viewMode, setViewMode] = useState<'prompts' | 'projects' | 'journal'>('prompts');
  const [selectedCategory, setSelectedCategory] = useState<'poetry' | 'photography' | 'drawing' | 'mixed'>('poetry');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [journalLanguage, setJournalLanguage] = useState('English');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('creativeProjects', 'readonly');
      const allProjects = await tx.objectStore('creativeProjects').getAll();
      setProjects(allProjects);
    } catch (error) {
      console.log('No projects yet');
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KolHubDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('creativeProjects')) {
          db.createObjectStore('creativeProjects', { keyPath: 'id' });
        }
      };
    });
  };

  const getRandomPrompt = () => {
    const prompts = ART_PROMPTS[selectedCategory];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPrompt(prompts[randomIndex]);
  };

  const addProject = async (project: Omit<CreativeProject, 'id'>) => {
    const newProject: CreativeProject = {
      ...project,
      id: `project_${Date.now()}`,
      date: new Date()
    };

    const db = await openDB();
    const tx = db.transaction('creativeProjects', 'readwrite');
    await tx.objectStore('creativeProjects').add(newProject);
    setProjects([newProject, ...projects]);
  };

  const toggleComplete = async (id: string) => {
    const db = await openDB();
    const tx = db.transaction('creativeProjects', 'readwrite');
    const store = tx.objectStore('creativeProjects');
    const project = await store.get(id);
    project.completed = !project.completed;
    await store.put(project);
    setProjects(projects.map(p => p.id === id ? project : p));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'poetry': return '✍️';
      case 'photography': return '📷';
      case 'drawing': return '🎨';
      case 'mixed': return '🖼️';
      default: return '✨';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-400 mb-2">
            🎨 Creativity Hub
          </h1>
          <p className="text-purple-200">Art prompts, creative logging, and multilingual journaling</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('prompts')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'prompts' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            💡 Prompts
          </button>
          <button
            onClick={() => setViewMode('projects')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'projects' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📁 Projects
          </button>
          <button
            onClick={() => setViewMode('journal')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === 'journal' ? 'bg-purple-600 text-white' : 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50'
            }`}
          >
            📝 Multilingual Journal
          </button>
        </div>

        {/* Prompts View */}
        {viewMode === 'prompts' && (
          <div>
            {/* Category Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setSelectedCategory('poetry')}
                className={`p-6 rounded-xl transition-all ${
                  selectedCategory === 'poetry'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                    : 'bg-purple-950/30 text-purple-300 hover:bg-purple-900/50'
                }`}
              >
                <div className="text-4xl mb-2">✍️</div>
                <div className="font-bold">Poetry</div>
              </button>
              <button
                onClick={() => setSelectedCategory('photography')}
                className={`p-6 rounded-xl transition-all ${
                  selectedCategory === 'photography'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                    : 'bg-purple-950/30 text-purple-300 hover:bg-purple-900/50'
                }`}
              >
                <div className="text-4xl mb-2">📷</div>
                <div className="font-bold">Photography</div>
              </button>
              <button
                onClick={() => setSelectedCategory('drawing')}
                className={`p-6 rounded-xl transition-all ${
                  selectedCategory === 'drawing'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                    : 'bg-purple-950/30 text-purple-300 hover:bg-purple-900/50'
                }`}
              >
                <div className="text-4xl mb-2">🎨</div>
                <div className="font-bold">Drawing</div>
              </button>
              <button
                onClick={() => setSelectedCategory('mixed')}
                className={`p-6 rounded-xl transition-all ${
                  selectedCategory === 'mixed'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white'
                    : 'bg-purple-950/30 text-purple-300 hover:bg-purple-900/50'
                }`}
              >
                <div className="text-4xl mb-2">🖼️</div>
                <div className="font-bold">Mixed Media</div>
              </button>
            </div>

            {/* Prompt Generator */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-100">
                  {getCategoryIcon(selectedCategory)} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Prompts
                </h2>
                <button
                  onClick={getRandomPrompt}
                  className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  ✨ Generate Prompt
                </button>
              </div>

              {currentPrompt && (
                <div className="bg-purple-900/40 rounded-lg p-6 border border-purple-500/30">
                  <div className="text-xl text-purple-100 font-medium mb-3">Your Creative Prompt:</div>
                  <div className="text-purple-200 text-lg italic mb-4">"{currentPrompt}"</div>
                  <button
                    onClick={() => addProject({
                      type: selectedCategory,
                      title: currentPrompt,
                      description: '',
                      completed: false
                    })}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    📁 Add to Projects
                  </button>
                </div>
              )}
            </div>

            {/* All Prompts List */}
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-100 mb-4">
                All {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Prompts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ART_PROMPTS[selectedCategory].map((prompt, index) => (
                  <div key={index} className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/50 transition-colors">
                    <div className="text-purple-200">{prompt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects View */}
        {viewMode === 'projects' && (
          <div>
            <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-purple-100 mb-2">Creative Projects</h2>
                  <p className="text-purple-300 text-sm">
                    {projects.filter(p => !p.completed).length} active • {projects.filter(p => p.completed).length} completed
                  </p>
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-purple-100 mb-4">🎯 Active Projects</h3>
              <div className="space-y-4">
                {projects.filter(p => !p.completed).map(project => (
                  <div key={project.id} className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{getCategoryIcon(project.type)}</div>
                          <h3 className="text-xl font-bold text-purple-100">{project.title}</h3>
                        </div>
                        <div className="text-purple-300 text-sm mb-2">
                          {new Date(project.date).toLocaleDateString()} • {project.type}
                        </div>
                        {project.description && (
                          <div className="text-purple-200 mb-3">{project.description}</div>
                        )}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                              <span key={i} className="bg-purple-600/30 px-2 py-1 rounded-full text-xs text-purple-200">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleComplete(project.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✓ Complete
                      </button>
                    </div>
                  </div>
                ))}
                
                {projects.filter(p => !p.completed).length === 0 && (
                  <div className="text-center py-12 text-purple-300">
                    No active projects. Generate a prompt to get started!
                  </div>
                )}
              </div>
            </div>

            {/* Completed Projects */}
            {projects.filter(p => p.completed).length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-purple-100 mb-4">✅ Completed Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.filter(p => p.completed).map(project => (
                    <div key={project.id} className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div>{getCategoryIcon(project.type)}</div>
                        <div className="font-medium text-purple-200">{project.title}</div>
                      </div>
                      <div className="text-xs text-purple-400">{new Date(project.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multilingual Journal View */}
        {viewMode === 'journal' && (
          <div className="bg-purple-950/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-purple-100 mb-6">
              <Globe className="inline mr-2" />
              Multilingual Creative Journal
            </h2>

            <div className="mb-6">
              <label className="block text-purple-200 mb-2">🌍 Writing Language</label>
              <select
                value={journalLanguage}
                onChange={(e) => setJournalLanguage(e.target.value)}
                className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100"
              >
                <option value="English">🇬🇧 English</option>
                <option value="Spanish">🇪🇸 Spanish (Español)</option>
                <option value="Japanese">🇯🇵 Japanese (日本語)</option>
                <option value="Korean">🇰🇷 Korean (한국어)</option>
                <option value="French">🇫🇷 French (Français)</option>
                <option value="German">🇩🇪 German (Deutsch)</option>
                <option value="Portuguese">🇧🇷 Portuguese (Português)</option>
                <option value="Multilingual">🌈 Multilingual Mix</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-purple-200 mb-2">✍️ Journal Entry</label>
              <textarea
                placeholder={`Write in ${journalLanguage}... Express yourself freely in any language!`}
                className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-100 h-64"
              />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white py-4 rounded-lg font-bold transition-all">
                💾 Save Entry
              </button>
              <button className="bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 px-6 py-4 rounded-lg transition-colors">
                🎤 Voice to Text
              </button>
            </div>

            <div className="mt-6 bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
              <div className="text-purple-200 text-sm">
                💡 <strong>Tip:</strong> Switch languages to express emotions that feel more natural in different tongues. Mix languages freely in multilingual mode!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};