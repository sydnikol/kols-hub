import React, { useState } from 'react';
import { Map, Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';

interface Campaign { id: string; name: string; description: string; dm: string; players: string[]; sessions: number; lastSession?: Date; level: string; setting: string; notes?: string; }
interface CampaignManagerProps { campaigns: Campaign[]; setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>; selectedCampaign: Campaign | null; }

const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, setCampaigns, selectedCampaign }) => {
  const [viewing, setViewing] = useState<Campaign | null>(selectedCampaign);
  const [editing, setEditing] = useState(false);

  const createNewCampaign = () => {
    const campaign: Campaign = { id: Date.now().toString(), name: 'New Campaign', description: '', dm: 'DM Name', players: [], sessions: 0, level: '1-5', setting: 'Forgotten Realms', notes: '' };
    setCampaigns([...campaigns, campaign]);
    setViewing(campaign);
    setEditing(true);
  };

  if (!viewing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-300">Your Campaigns</h2>
          <button onClick={createNewCampaign} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center gap-2"><Plus className="w-4 h-4" />New Campaign</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:bg-purple-900/40 transition-all cursor-pointer" onClick={() => setViewing(campaign)}>
              <h3 className="text-xl font-bold text-purple-200 mb-2">{campaign.name}</h3>
              <p className="text-purple-400 mb-4">{campaign.description}</p>
              <div className="flex items-center gap-4 text-sm text-purple-400">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{campaign.players.length} Players</span>
                <span>{campaign.sessions} Sessions</span>
                <span>Level {campaign.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setViewing(null)} className="text-purple-400 hover:text-purple-300">← Back to Campaigns</button>
        <button onClick={() => setEditing(!editing)} className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
      </div>
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
        {editing ? <input value={viewing.name} onChange={(e) => setViewing({...viewing, name: e.target.value})} className="text-3xl font-bold bg-transparent border-b-2 border-purple-500/50 outline-none text-purple-200 w-full mb-4" /> : <h2 className="text-3xl font-bold text-purple-200 mb-4">{viewing.name}</h2>}
        <div className="space-y-4">
          <div><label className="text-purple-400 block mb-2">Description</label>{editing ? <textarea value={viewing.description} onChange={(e) => setViewing({...viewing, description: e.target.value})} className="w-full bg-purple-800/30 rounded-lg p-3 text-purple-200 outline-none border border-purple-500/30 focus:border-purple-500" rows={3} /> : <p className="text-purple-200">{viewing.description}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-purple-400 block mb-2">DM</label>{editing ? <input value={viewing.dm} onChange={(e) => setViewing({...viewing, dm: e.target.value})} className="w-full bg-purple-800/30 rounded-lg p-2 text-purple-200 outline-none border border-purple-500/30" /> : <p className="text-purple-200">{viewing.dm}</p>}</div>
            <div><label className="text-purple-400 block mb-2">Setting</label>{editing ? <input value={viewing.setting} onChange={(e) => setViewing({...viewing, setting: e.target.value})} className="w-full bg-purple-800/30 rounded-lg p-2 text-purple-200 outline-none border border-purple-500/30" /> : <p className="text-purple-200">{viewing.setting}</p>}</div>
          </div>
          <div><label className="text-purple-400 block mb-2">Sessions: {viewing.sessions}</label><div className="flex gap-2"><button onClick={() => setViewing({...viewing, sessions: viewing.sessions + 1})} className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg">+ Session</button></div></div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;
