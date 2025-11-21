import React, { useState, useEffect } from 'react';
import { Megaphone, Flag, Users, TrendingUp, Plus, Trash2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface Cause {
  id: string;
  name: string;
  category: 'climate' | 'human-rights' | 'social-justice' | 'education' | 'healthcare' | 'political' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  involvement: 'interested' | 'supporting' | 'active' | 'leading';
  organization?: string;
  notes: string;
}

interface Campaign {
  id: string;
  causeName: string;
  campaignName: string;
  type: 'petition' | 'protest' | 'awareness' | 'fundraising' | 'lobbying' | 'other';
  status: 'planning' | 'active' | 'completed' | 'suspended';
  startDate?: string;
  endDate?: string;
  goal?: string;
  impact?: string;
  notes: string;
}

interface Action {
  id: string;
  causeName: string;
  actionType: 'sign-petition' | 'attend-event' | 'donate' | 'share' | 'contact-rep' | 'volunteer' | 'other';
  description: string;
  date: string;
  impact: number; // 1-5
  notes: string;
}

const AdvocacyHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'causes' | 'campaigns' | 'actions' | 'stats'>('causes');
  const [causes, setCauses] = useState<Cause[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    const savedCauses = localStorage.getItem('advocacyCauses');
    if (savedCauses) setCauses(JSON.parse(savedCauses));
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
    const savedActions = localStorage.getItem('advocacyActions');
    if (savedActions) setActions(JSON.parse(savedActions));
  }, []);

  useEffect(() => { localStorage.setItem('advocacyCauses', JSON.stringify(causes)); }, [causes]);
  useEffect(() => { localStorage.setItem('campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('advocacyActions', JSON.stringify(actions)); }, [actions]);

  const addCause = () => {
    const newCause: Cause = {
      id: Date.now().toString(),
      name: '',
      category: 'other',
      priority: 'medium',
      involvement: 'interested',
      notes: '',
    };
    setCauses([...causes, newCause]);
    toast.success('Cause added');
  };

  const updateCause = (id: string, updates: Partial<Cause>) => {
    setCauses(causes.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Cause updated');
  };

  const deleteCause = (id: string) => {
    setCauses(causes.filter(c => c.id !== id));
    toast.success('Cause deleted');
  };

  const addCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      causeName: '',
      campaignName: '',
      type: 'petition',
      status: 'planning',
      notes: '',
    };
    setCampaigns([...campaigns, newCampaign]);
    toast.success('Campaign added');
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Campaign updated');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success('Campaign deleted');
  };

  const activeCauses = causes.filter(c => c.involvement === 'active' || c.involvement === 'leading').length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalActions = actions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Megaphone className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Advocacy Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Flag className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{causes.length}</div>
            <div className="text-xs opacity-90">Causes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeCauses}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeCampaigns}</div>
            <div className="text-xs opacity-90">Campaigns</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalActions}</div>
            <div className="text-xs opacity-90">Actions</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'causes', label: 'Causes', icon: Flag },
            { id: 'campaigns', label: 'Campaigns', icon: TrendingUp },
            { id: 'actions', label: 'Actions', icon: Award },
            { id: 'stats', label: 'Stats', icon: Users },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'causes' && (
          <div className="space-y-4">
            <button onClick={addCause} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Cause</span>
            </button>
            {causes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No causes yet. Stand up for what you believe in!</p>
              </div>
            ) : (
              causes.map(cause => (
                <div key={cause.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${cause.involvement === 'active' || cause.involvement === 'leading' ? 'border-purple-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={cause.name} onChange={(e) => updateCause(cause.id, { name: e.target.value })} placeholder="Cause name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteCause(cause.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={cause.category} onChange={(e) => updateCause(cause.id, { category: e.target.value as Cause['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="climate">Climate & Environment</option>
                      <option value="human-rights">Human Rights</option>
                      <option value="social-justice">Social Justice</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="political">Political</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={cause.priority} onChange={(e) => updateCause(cause.id, { priority: e.target.value as Cause['priority'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical</option>
                    </select>
                    <select value={cause.involvement} onChange={(e) => updateCause(cause.id, { involvement: e.target.value as Cause['involvement'] })} className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                      <option value="interested">Interested</option>
                      <option value="supporting">Supporting</option>
                      <option value="active">Active</option>
                      <option value="leading">Leading</option>
                    </select>
                    <input type="text" value={cause.organization || ''} onChange={(e) => updateCause(cause.id, { organization: e.target.value })} placeholder="Organization..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                  </div>
                  <textarea value={cause.notes} onChange={(e) => updateCause(cause.id, { notes: e.target.value })} placeholder="Notes, goals..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <button onClick={addCampaign} className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Campaign</span>
            </button>
            {campaigns.map(campaign => (
              <div key={campaign.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${campaign.status === 'active' ? 'border-purple-500' : campaign.status === 'completed' ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="text" value={campaign.causeName} onChange={(e) => updateCampaign(campaign.id, { causeName: e.target.value })} placeholder="Cause..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-purple-500 outline-none w-full mb-1" />
                    <input type="text" value={campaign.campaignName} onChange={(e) => updateCampaign(campaign.id, { campaignName: e.target.value })} placeholder="Campaign name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-purple-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteCampaign(campaign.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <select value={campaign.type} onChange={(e) => updateCampaign(campaign.id, { type: e.target.value as Campaign['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                    <option value="petition">Petition</option>
                    <option value="protest">Protest</option>
                    <option value="awareness">Awareness</option>
                    <option value="fundraising">Fundraising</option>
                    <option value="lobbying">Lobbying</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={campaign.status} onChange={(e) => updateCampaign(campaign.id, { status: e.target.value as Campaign['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none">
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <input type="text" value={campaign.goal || ''} onChange={(e) => updateCampaign(campaign.id, { goal: e.target.value })} placeholder="Goal..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" />
                </div>
                <textarea value={campaign.notes} onChange={(e) => updateCampaign(campaign.id, { notes: e.target.value })} placeholder="Notes, strategy..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-purple-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600">Advocacy Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Causes:</span>
                  <span className="font-semibold">{causes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Causes:</span>
                  <span className="font-semibold">{activeCauses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Campaigns:</span>
                  <span className="font-semibold">{campaigns.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Campaigns:</span>
                  <span className="font-semibold">{activeCampaigns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actions Taken:</span>
                  <span className="font-semibold">{totalActions}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvocacyHubPage;
