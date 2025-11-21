import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Trash2, Star, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  starred: boolean;
  createdAt: number;
}

const categories = [
  'Writing',
  'Art',
  'Music',
  'Film/Video',
  'Photography',
  'Design',
  'Performance',
  'Craft',
  'General',
];

export default function CreativeIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'starred'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
  });
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('creativeIdeas');
    if (saved) setIdeas(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('creativeIdeas', JSON.stringify(ideas));
  }, [ideas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newIdea: Idea = {
      id: Date.now().toString(),
      ...formData,
      tags: tempTags,
      starred: false,
      createdAt: Date.now(),
    };

    setIdeas([...ideas, newIdea]);
    setFormData({ title: '', description: '', category: categories[0] });
    setTempTags([]);
    setIsAdding(false);
    toast.success('Idea captured!');
  };

  const toggleStar = (id: string) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, starred: !idea.starred } : idea));
  };

  const deleteIdea = (id: string) => {
    if (confirm('Delete this idea?')) {
      setIdeas(ideas.filter(i => i.id !== id));
      toast.success('Idea deleted');
    }
  };

  const addTag = () => {
    if (!tagInput.trim() || tempTags.includes(tagInput.trim())) return;
    setTempTags([...tempTags, tagInput.trim()]);
    setTagInput('');
  };

  const filteredIdeas = ideas
    .filter(idea => filter === 'all' || idea.starred)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-purple-400" />
            Creative Ideas
          </h2>
          <p className="text-purple-200/70 mt-1">{ideas.length} ideas captured</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Capture Idea'}
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'starred'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' : 'bg-white/5 text-purple-300 hover:bg-white/10'
            }`}
          >
            {f === 'all' ? 'All Ideas' : 'Starred'}
          </button>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-4"
            placeholder="Idea title..."
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[100px] mb-4"
            placeholder="Describe your idea..."
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 mb-4"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              placeholder="Add tags..."
            />
            <button type="button" onClick={addTag} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {tempTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tempTags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2">
                  #{tag}
                  <button type="button" onClick={() => setTempTags(tempTags.filter(t => t !== tag))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
          >
            Capture Idea
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
            <Lightbulb className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-purple-200/70">No ideas yet - capture your first inspiration!</p>
          </div>
        ) : (
          filteredIdeas.map(idea => (
            <div key={idea.id} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold text-white flex-1">{idea.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStar(idea.id)}
                    className={`p-1 rounded ${idea.starred ? 'text-purple-400' : 'text-purple-600 hover:text-purple-400'}`}
                  >
                    <Star className={`w-5 h-5 ${idea.starred ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => deleteIdea(idea.id)} className="p-1 text-red-300 hover:text-red-200">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{idea.category}</span>
              {idea.description && <p className="text-purple-200/70 text-sm mt-3">{idea.description}</p>}
              {idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {idea.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-purple-300/50 text-xs mt-3">{new Date(idea.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
