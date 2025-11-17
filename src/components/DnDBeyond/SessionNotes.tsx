import React, { useState } from 'react';
import { Scroll, Plus, Calendar, Edit } from 'lucide-react';

interface Campaign { id: string; name: string; sessions: number; }
interface SessionNote { id: string; campaignId: string; sessionNumber: number; date: Date; title: string; notes: string; npcs: string[]; locations: string[]; loot: string[]; }
interface SessionNotesProps { campaigns: Campaign[]; }

const SessionNotes: React.FC<SessionNotesProps> = ({ campaigns }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [currentNote, setCurrentNote] = useState<SessionNote | null>(null);
  const [editing, setEditing] = useState(false);

  const createNewNote = () => {
    if (!selectedCampaign) return;
    const campaign = campaigns.find(c => c.id === selectedCampaign);
    if (!campaign) return;
    const note: SessionNote = { id: Date.now().toString(), campaignId: selectedCampaign, sessionNumber: campaign.sessions + 1, date: new Date(), title: `Session ${campaign.sessions + 1}`, notes: '', npcs: [], locations: [], loot: [] };
    setNotes([note, ...notes]);
    setCurrentNote(note);
    setEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2"><Scroll className="w-6 h-6" />Session Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)} className="bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 outline-none border border-purple-500/30 focus:border-purple-500">
            <option value="">Select Campaign</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={createNewNote} disabled={!selectedCampaign} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />New Session Note</button>
        </div>
      </div>

      {currentNote && editing && (
        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-purple-300">Session {currentNote.sessionNumber}</h3>
            <button onClick={() => setEditing(false)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">Done</button>
          </div>
          <div className="space-y-4">
            <div><label className="text-purple-400 block mb-2">Title</label><input value={currentNote.title} onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} className="w-full bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 outline-none border border-purple-500/30 focus:border-purple-500" /></div>
            <div><label className="text-purple-400 block mb-2">Session Notes</label><textarea value={currentNote.notes} onChange={(e) => setCurrentNote({...currentNote, notes: e.target.value})} className="w-full bg-purple-800/30 rounded-lg px-4 py-2 text-purple-200 outline-none border border-purple-500/30 focus:border-purple-500" rows={10} placeholder="What happened this session? Key events, plot developments, player decisions..." /></div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {notes.filter(n => !selectedCampaign || n.campaignId === selectedCampaign).map((note) => (
          <div key={note.id} className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:bg-purple-900/40 transition-all cursor-pointer" onClick={() => { setCurrentNote(note); setEditing(true); }}>
            <div className="flex items-start justify-between">
              <div><h3 className="text-xl font-bold text-purple-200">{note.title}</h3><p className="text-purple-400">Session {note.sessionNumber} • {new Date(note.date).toLocaleDateString()}</p></div>
              <button className="text-purple-400 hover:text-purple-300"><Edit className="w-5 h-5" /></button>
            </div>
            {note.notes && <p className="text-purple-300 mt-3 line-clamp-3">{note.notes}</p>}
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center py-8 text-purple-400 bg-purple-900/30 backdrop-blur-sm rounded-xl border border-purple-500/30"><Scroll className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>No session notes yet. Create your first note above!</p></div>
        )}
      </div>
    </div>
  );
};

export default SessionNotes;
