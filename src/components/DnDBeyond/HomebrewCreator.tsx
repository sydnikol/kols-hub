import React, { useState } from 'react';
import { Edit, Plus, Save } from 'lucide-react';

const HomebrewCreator: React.FC = () => {
  const [contentType, setContentType] = useState<'spell' | 'monster' | 'item' | 'class'>('spell');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const saveHomebrew = () => { alert(`Homebrew ${contentType} "${name}" saved!`); setName(''); setDescription(''); };

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2"><Edit className="w-6 h-6" />Homebrew Creator</h2>
        <div className="space-y-4">
          <div>
            <label className="text-purple-400 block mb-2">Content Type</label>
            <select value={contentType} onChange={(e) => setContentType(e.target.value as any)} className="w-full bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 outline-none border border-purple-500/30 focus:border-purple-500">
              <option value="spell">Spell</option>
              <option value="monster">Monster</option>
              <option value="item">Magic Item</option>
              <option value="class">Class/Subclass</option>
            </select>
          </div>
          <div>
            <label className="text-purple-400 block mb-2">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={`Enter ${contentType} name...`} className="w-full bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 placeholder-purple-500 outline-none border border-purple-500/30 focus:border-purple-500" />
          </div>
          <div>
            <label className="text-purple-400 block mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`Enter ${contentType} description and mechanics...`} className="w-full bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 placeholder-purple-500 outline-none border border-purple-500/30 focus:border-purple-500" rows={10} />
          </div>
          <button onClick={saveHomebrew} className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"><Save className="w-5 h-5" />Save Homebrew {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</button>
        </div>
      </div>
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-300 mb-4">Your Homebrew Content</h3>
        <div className="text-center py-8 text-purple-400"><Edit className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>No homebrew content yet. Create your first custom content above!</p></div>
      </div>
    </div>
  );
};

export default HomebrewCreator;
