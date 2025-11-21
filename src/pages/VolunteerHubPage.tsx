import React, { useState, useEffect } from 'react';
import { Heart, Clock, Users, TrendingUp, Plus, Trash2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface VolunteerOpportunity {
  id: string;
  organization: string;
  role: string;
  category: 'environment' | 'education' | 'healthcare' | 'social-justice' | 'animals' | 'community' | 'other';
  status: 'interested' | 'applied' | 'active' | 'completed' | 'inactive';
  startDate?: string;
  endDate?: string;
  hoursCommitted: number;
  contactPerson?: string;
  notes: string;
}

interface VolunteerSession {
  id: string;
  organization: string;
  role: string;
  date: string;
  duration: number; // hours
  activity: string;
  impact?: string;
  satisfaction: number; // 1-5
  notes: string;
}

interface ImpactGoal {
  id: string;
  goal: string;
  targetHours: number;
  currentHours: number;
  deadline?: string;
  category: string;
  active: boolean;
}

const VolunteerHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'sessions' | 'goals' | 'stats'>('opportunities');
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [sessions, setSessions] = useState<VolunteerSession[]>([]);
  const [goals, setGoals] = useState<ImpactGoal[]>([]);

  useEffect(() => {
    const savedOpps = localStorage.getItem('volunteerOpportunities');
    if (savedOpps) setOpportunities(JSON.parse(savedOpps));
    const savedSessions = localStorage.getItem('volunteerSessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    const savedGoals = localStorage.getItem('impactGoals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => { localStorage.setItem('volunteerOpportunities', JSON.stringify(opportunities)); }, [opportunities]);
  useEffect(() => { localStorage.setItem('volunteerSessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('impactGoals', JSON.stringify(goals)); }, [goals]);

  const addOpportunity = () => {
    const newOpp: VolunteerOpportunity = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      category: 'community',
      status: 'interested',
      hoursCommitted: 0,
      notes: '',
    };
    setOpportunities([...opportunities, newOpp]);
    toast.success('Opportunity added');
  };

  const updateOpportunity = (id: string, updates: Partial<VolunteerOpportunity>) => {
    setOpportunities(opportunities.map(o => o.id === id ? { ...o, ...updates } : o));
    toast.success('Opportunity updated');
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(opportunities.filter(o => o.id !== id));
    toast.success('Opportunity deleted');
  };

  const activeOpps = opportunities.filter(o => o.status === 'active').length;
  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
  const organizations = new Set(opportunities.map(o => o.organization)).size;
  const completedSessions = sessions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pb-20">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Volunteer Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeOpps}</div>
            <div className="text-xs opacity-90">Active</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalHours.toFixed(0)}h</div>
            <div className="text-xs opacity-90">Total Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Heart className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{organizations}</div>
            <div className="text-xs opacity-90">Orgs</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedSessions}</div>
            <div className="text-xs opacity-90">Sessions</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'opportunities', label: 'Opportunities', icon: Users },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'goals', label: 'Goals', icon: TrendingUp },
            { id: 'stats', label: 'Stats', icon: Award },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <button onClick={addOpportunity} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Opportunity</span>
            </button>
            {opportunities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No opportunities yet. Make a difference!</p>
              </div>
            ) : (
              opportunities.map(opp => (
                <div key={opp.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${opp.status === 'active' ? 'border-red-500' : opp.status === 'completed' ? 'border-green-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={opp.organization} onChange={(e) => updateOpportunity(opp.id, { organization: e.target.value })} placeholder="Organization..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none w-full mb-1" />
                      <input type="text" value={opp.role} onChange={(e) => updateOpportunity(opp.id, { role: e.target.value })} placeholder="Role..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-red-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteOpportunity(opp.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={opp.category} onChange={(e) => updateOpportunity(opp.id, { category: e.target.value as VolunteerOpportunity['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none">
                      <option value="environment">Environment</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="social-justice">Social Justice</option>
                      <option value="animals">Animals</option>
                      <option value="community">Community</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={opp.status} onChange={(e) => updateOpportunity(opp.id, { status: e.target.value as VolunteerOpportunity['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none">
                      <option value="interested">Interested</option>
                      <option value="applied">Applied</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <input type="number" step="0.5" value={opp.hoursCommitted} onChange={(e) => updateOpportunity(opp.id, { hoursCommitted: parseFloat(e.target.value) || 0 })} placeholder="Hours committed..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" />
                    <input type="text" value={opp.contactPerson || ''} onChange={(e) => updateOpportunity(opp.id, { contactPerson: e.target.value })} placeholder="Contact person..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" />
                  </div>
                  <textarea value={opp.notes} onChange={(e) => updateOpportunity(opp.id, { notes: e.target.value })} placeholder="Notes, responsibilities..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Volunteer Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Opportunities:</span>
                  <span className="font-semibold">{opportunities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Opportunities:</span>
                  <span className="font-semibold">{activeOpps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-semibold">{totalHours.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organizations:</span>
                  <span className="font-semibold">{organizations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions Completed:</span>
                  <span className="font-semibold">{completedSessions}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerHubPage;
