import React, { useState, useEffect } from 'react';
import { Heart, Clock, Users, TrendingUp, Plus, Trash2, Award, Calendar, Target, Star, BookOpen, Sparkles, CheckCircle2, MapPin } from 'lucide-react';
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
  impactMetrics?: string;
  satisfaction: number; // 1-5
  notes: string;
  location?: string;
  certificateEarned?: boolean;
  recognitionType?: string;
}

interface ImpactGoal {
  id: string;
  goal: string;
  type: 'hours' | 'causes' | 'skills' | 'impact';
  targetHours: number;
  currentHours: number;
  deadline?: string;
  category: string;
  motivation: string;
  impactGoal?: string;
  skillsToLearn?: string[];
  active: boolean;
  progress: number; // percentage
}

// Sample data for sessions
const sampleSessions: VolunteerSession[] = [
  {
    id: '1',
    organization: 'City Food Bank',
    role: 'Food Sorter & Distributor',
    date: '2025-11-15',
    duration: 4,
    activity: 'Sorted and packed 500+ food boxes for families in need. Helped with distribution drive.',
    impact: 'Helped feed approximately 150 families',
    impactMetrics: '500 boxes packed, 150 families served',
    satisfaction: 5,
    notes: 'Great team spirit! Met amazing volunteers and felt truly impactful.',
    location: 'Downtown Community Center',
    certificateEarned: true,
    recognitionType: 'Monthly Volunteer Award'
  },
  {
    id: '2',
    organization: 'Green Earth Initiative',
    role: 'Tree Planting Volunteer',
    date: '2025-11-08',
    duration: 5,
    activity: 'Planted 75 native trees in local park. Prepared soil and installed support stakes.',
    impact: 'Contributed to reforestation of 2 acres',
    impactMetrics: '75 trees planted, 2 acres restored',
    satisfaction: 5,
    notes: 'Physical work but incredibly rewarding. Learned about native species and ecosystem restoration.',
    location: 'Riverside Park',
    certificateEarned: false
  },
  {
    id: '3',
    organization: 'Youth Literacy Program',
    role: 'Reading Tutor',
    date: '2025-11-01',
    duration: 3,
    activity: 'One-on-one reading sessions with 3rd graders. Helped improve reading comprehension.',
    impact: '4 students showed improvement',
    impactMetrics: '4 students tutored, 12 books completed',
    satisfaction: 5,
    notes: 'Watching kids gain confidence in reading is priceless. Sarah improved 2 grade levels!',
    location: 'Lincoln Elementary School',
    certificateEarned: false
  },
  {
    id: '4',
    organization: 'Animal Shelter Alliance',
    role: 'Animal Care Assistant',
    date: '2025-10-25',
    duration: 4,
    activity: 'Fed, walked, and socialized shelter dogs. Cleaned kennels and updated adoption profiles.',
    impact: '2 dogs adopted during my shift!',
    impactMetrics: '15 dogs cared for, 2 adoptions facilitated',
    satisfaction: 4,
    notes: 'Emotional but fulfilling. The dogs bring so much joy despite their circumstances.',
    location: 'County Animal Shelter',
    certificateEarned: false
  },
  {
    id: '5',
    organization: 'Senior Care Network',
    role: 'Companion Volunteer',
    date: '2025-10-18',
    duration: 3,
    activity: 'Visited seniors at nursing home. Played cards, listened to stories, helped with technology.',
    impact: 'Brightened the day of 6 residents',
    impactMetrics: '6 seniors visited, 18 hours of companionship',
    satisfaction: 5,
    notes: 'Their stories are incredible. Mrs. Johnson taught me to play bridge!',
    location: 'Sunset Senior Living',
    certificateEarned: false
  },
  {
    id: '6',
    organization: 'Coastal Cleanup Coalition',
    role: 'Beach Cleanup Volunteer',
    date: '2025-10-12',
    duration: 4,
    activity: 'Collected plastic waste and debris from beach. Sorted recyclables and logged findings.',
    impact: 'Removed 120 lbs of trash from shoreline',
    impactMetrics: '120 lbs collected, 85% recyclable materials',
    satisfaction: 4,
    notes: 'Shocking amount of plastic. But great to see community come together for environment.',
    location: 'Sunset Beach',
    certificateEarned: false
  },
  {
    id: '7',
    organization: 'Community Tech Center',
    role: 'Digital Literacy Instructor',
    date: '2025-10-05',
    duration: 3,
    activity: 'Taught basic computer skills to adults. Covered email, internet safety, and job applications.',
    impact: '8 adults gained digital confidence',
    impactMetrics: '8 students taught, 100% completion rate',
    satisfaction: 5,
    notes: 'Empowering people with tech skills opens so many doors. Very rewarding experience.',
    location: 'Community Learning Hub',
    certificateEarned: true,
    recognitionType: 'Outstanding Educator Certificate'
  },
  {
    id: '8',
    organization: 'Homeless Support Services',
    role: 'Meal Server & Outreach',
    date: '2025-09-28',
    duration: 5,
    activity: 'Served meals, distributed hygiene kits, and connected people with resources.',
    impact: 'Served 200+ individuals',
    impactMetrics: '200 meals served, 50 hygiene kits distributed',
    satisfaction: 5,
    notes: 'Humbling experience. Everyone has a story. Connected 3 people with job programs.',
    location: 'Downtown Shelter',
    certificateEarned: false
  },
  {
    id: '9',
    organization: 'Youth Mentorship Alliance',
    role: 'Youth Mentor',
    date: '2025-09-20',
    duration: 2.5,
    activity: 'Mentored high school student on college applications and career planning.',
    impact: 'Helped student complete 5 applications',
    impactMetrics: '1 student mentored, 5 applications completed',
    satisfaction: 5,
    notes: 'Marcus has such potential! Helped him discover his passion for engineering.',
    location: 'City High School',
    certificateEarned: false
  },
  {
    id: '10',
    organization: 'Community Garden Project',
    role: 'Garden Volunteer',
    date: '2025-09-14',
    duration: 4,
    activity: 'Weeded, watered, and harvested vegetables for community food distribution.',
    impact: 'Harvested 80 lbs of fresh produce',
    impactMetrics: '80 lbs harvested, 40 families fed',
    satisfaction: 4,
    notes: 'Therapeutic work. Love seeing farm-to-table impact on local families.',
    location: 'Neighborhood Community Garden',
    certificateEarned: false
  },
  {
    id: '11',
    organization: 'Disaster Relief Fund',
    role: 'Emergency Response Volunteer',
    date: '2025-09-07',
    duration: 6,
    activity: 'Assisted with flood relief: packed emergency supplies, coordinated donations.',
    impact: 'Helped 50+ affected families',
    impactMetrics: '50 families assisted, 200 supply kits assembled',
    satisfaction: 5,
    notes: 'Intense but important work. Community resilience is inspiring during crisis.',
    location: 'Emergency Relief Center',
    certificateEarned: true,
    recognitionType: 'Emergency Response Certificate'
  },
  {
    id: '12',
    organization: 'Arts for All Foundation',
    role: 'Art Workshop Facilitator',
    date: '2025-08-30',
    duration: 3,
    activity: 'Led painting workshop for underprivileged youth. Taught basic techniques and creativity.',
    impact: '15 children created artwork',
    impactMetrics: '15 youth participants, 30 artworks created',
    satisfaction: 5,
    notes: 'Art is healing! Kids were so creative and engaged. Their joy is contagious.',
    location: 'Community Arts Center',
    certificateEarned: false
  }
];

// Sample data for goals
const sampleGoals: ImpactGoal[] = [
  {
    id: '1',
    goal: 'Volunteer 100 hours in 2025',
    type: 'hours',
    targetHours: 100,
    currentHours: 45.5,
    deadline: '2025-12-31',
    category: 'General',
    motivation: 'Want to make a meaningful difference in my community and develop a consistent volunteering habit.',
    active: true,
    progress: 45.5
  },
  {
    id: '2',
    goal: 'Support 3 different environmental causes',
    type: 'causes',
    targetHours: 30,
    currentHours: 13,
    deadline: '2025-12-31',
    category: 'Environment',
    motivation: 'Climate change is critical. I want to contribute to conservation and sustainability efforts.',
    impactGoal: 'Help plant 200+ trees and participate in 5 cleanup events',
    active: true,
    progress: 43.3
  },
  {
    id: '3',
    goal: 'Develop youth mentorship skills',
    type: 'skills',
    targetHours: 20,
    currentHours: 5.5,
    deadline: '2025-06-30',
    category: 'Education',
    motivation: 'I believe in empowering the next generation. Want to become a certified mentor.',
    skillsToLearn: ['Active Listening', 'Goal Setting', 'Youth Psychology', 'Career Counseling'],
    active: true,
    progress: 27.5
  },
  {
    id: '4',
    goal: 'Feed 500 families through food programs',
    type: 'impact',
    targetHours: 40,
    currentHours: 17,
    deadline: '2025-12-31',
    category: 'Food Security',
    motivation: 'No one should go hungry. Food insecurity affects too many in our community.',
    impactGoal: 'Participate in food banks and meal programs to help 500 families',
    active: true,
    progress: 42.5
  },
  {
    id: '5',
    goal: 'Learn animal care and rehabilitation skills',
    type: 'skills',
    targetHours: 25,
    currentHours: 4,
    deadline: '2025-09-30',
    category: 'Animal Welfare',
    motivation: 'Passionate about animal welfare. Want to gain skills to help more effectively.',
    skillsToLearn: ['Animal First Aid', 'Behavior Assessment', 'Adoption Counseling', 'Basic Training'],
    active: true,
    progress: 16
  },
  {
    id: '6',
    goal: 'Teach digital literacy to 50 adults',
    type: 'impact',
    targetHours: 30,
    currentHours: 3,
    deadline: '2025-10-31',
    category: 'Technology',
    motivation: 'Digital skills are essential today. Want to bridge the digital divide in my community.',
    impactGoal: 'Help 50 adults gain confidence with technology for work and daily life',
    active: true,
    progress: 10
  },
  {
    id: '7',
    goal: 'Emergency response certification',
    type: 'skills',
    targetHours: 15,
    currentHours: 6,
    deadline: '2025-07-31',
    category: 'Emergency Services',
    motivation: 'Want to be prepared to help during community emergencies and natural disasters.',
    skillsToLearn: ['CPR/First Aid', 'Disaster Response', 'Crisis Communication', 'Supply Management'],
    active: true,
    progress: 40
  },
  {
    id: '8',
    goal: 'Reduce community waste by 1000 lbs',
    type: 'impact',
    targetHours: 20,
    currentHours: 8,
    deadline: '2025-11-30',
    category: 'Environment',
    motivation: 'Waste pollution is destroying our ecosystem. Every bit removed helps our planet.',
    impactGoal: 'Participate in cleanup initiatives to remove 1000 lbs of waste from public spaces',
    active: true,
    progress: 40
  }
];

const VolunteerHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'sessions' | 'goals' | 'stats'>('opportunities');
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [sessions, setSessions] = useState<VolunteerSession[]>([]);
  const [goals, setGoals] = useState<ImpactGoal[]>([]);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  useEffect(() => {
    const savedOpps = localStorage.getItem('volunteerOpportunities');
    if (savedOpps) {
      setOpportunities(JSON.parse(savedOpps));
    }

    const savedSessions = localStorage.getItem('volunteerSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      setSessions(sampleSessions);
    }

    const savedGoals = localStorage.getItem('impactGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(sampleGoals);
    }
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

  const addSession = () => {
    const newSession: VolunteerSession = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      date: new Date().toISOString().split('T')[0],
      duration: 0,
      activity: '',
      satisfaction: 5,
      notes: '',
    };
    setSessions([newSession, ...sessions]);
    setShowAddSession(false);
    toast.success('Session added');
  };

  const updateSession = (id: string, updates: Partial<VolunteerSession>) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success('Session deleted');
  };

  const addGoal = () => {
    const newGoal: ImpactGoal = {
      id: Date.now().toString(),
      goal: '',
      type: 'hours',
      targetHours: 0,
      currentHours: 0,
      category: '',
      motivation: '',
      active: true,
      progress: 0,
    };
    setGoals([...goals, newGoal]);
    setShowAddGoal(false);
    toast.success('Goal added');
  };

  const updateGoal = (id: string, updates: Partial<ImpactGoal>) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const updated = { ...g, ...updates };
        if (updates.currentHours !== undefined || updates.targetHours !== undefined) {
          updated.progress = (updated.currentHours / updated.targetHours) * 100;
        }
        return updated;
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const activeOpps = opportunities.filter(o => o.status === 'active').length;
  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
  const organizations = new Set(sessions.map(s => s.organization).filter(o => o)).size;
  const completedSessions = sessions.length;
  const certificatesEarned = sessions.filter(s => s.certificateEarned).length;
  const avgSatisfaction = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.satisfaction, 0) / sessions.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-lime-600 text-white p-6 shadow-lg">
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
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <button onClick={addOpportunity} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
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
                <div key={opp.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${opp.status === 'active' ? 'border-green-500' : opp.status === 'completed' ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={opp.organization} onChange={(e) => updateOpportunity(opp.id, { organization: e.target.value })} placeholder="Organization..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full mb-1" />
                      <input type="text" value={opp.role} onChange={(e) => updateOpportunity(opp.id, { role: e.target.value })} placeholder="Role..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteOpportunity(opp.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={opp.category} onChange={(e) => updateOpportunity(opp.id, { category: e.target.value as VolunteerOpportunity['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="environment">Environment</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="social-justice">Social Justice</option>
                      <option value="animals">Animals</option>
                      <option value="community">Community</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={opp.status} onChange={(e) => updateOpportunity(opp.id, { status: e.target.value as VolunteerOpportunity['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none">
                      <option value="interested">Interested</option>
                      <option value="applied">Applied</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <input type="number" step="0.5" value={opp.hoursCommitted} onChange={(e) => updateOpportunity(opp.id, { hoursCommitted: parseFloat(e.target.value) || 0 })} placeholder="Hours committed..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                    <input type="text" value={opp.contactPerson || ''} onChange={(e) => updateOpportunity(opp.id, { contactPerson: e.target.value })} placeholder="Contact person..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" />
                  </div>
                  <textarea value={opp.notes} onChange={(e) => updateOpportunity(opp.id, { notes: e.target.value })} placeholder="Notes, responsibilities..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <button onClick={addSession} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Log New Session</span>
            </button>

            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No sessions logged yet. Start tracking your impact!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map(session => (
                  <div key={session.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <input
                            type="date"
                            value={session.date}
                            onChange={(e) => updateSession(session.id, { date: e.target.value })}
                            className="text-sm font-medium text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none"
                          />
                          <Clock className="w-4 h-4 text-green-600 ml-3" />
                          <input
                            type="number"
                            step="0.5"
                            value={session.duration}
                            onChange={(e) => updateSession(session.id, { duration: parseFloat(e.target.value) || 0 })}
                            className="w-16 text-sm font-medium text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none"
                          />
                          <span className="text-sm text-gray-600">hours</span>
                        </div>
                        <input
                          type="text"
                          value={session.organization}
                          onChange={(e) => updateSession(session.id, { organization: e.target.value })}
                          placeholder="Organization..."
                          className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full mb-1"
                        />
                        <input
                          type="text"
                          value={session.role}
                          onChange={(e) => updateSession(session.id, { role: e.target.value })}
                          placeholder="Role..."
                          className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none w-full mb-2"
                        />
                      </div>
                      <button onClick={() => deleteSession(session.id)} className="text-red-500 hover:text-red-700 ml-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {session.location && (
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={session.location}
                          onChange={(e) => updateSession(session.id, { location: e.target.value })}
                          placeholder="Location..."
                          className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none flex-1"
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="text-xs text-gray-500 font-medium flex items-center space-x-1 mb-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Activities Performed</span>
                      </label>
                      <textarea
                        value={session.activity}
                        onChange={(e) => updateSession(session.id, { activity: e.target.value })}
                        placeholder="What did you do during this session?"
                        className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                        rows={2}
                      />
                    </div>

                    {session.impact && (
                      <div className="mb-3 bg-green-50 p-3 rounded-lg">
                        <label className="text-xs text-green-700 font-medium flex items-center space-x-1 mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Impact Made</span>
                        </label>
                        <textarea
                          value={session.impact}
                          onChange={(e) => updateSession(session.id, { impact: e.target.value })}
                          placeholder="What impact did you make?"
                          className="w-full text-sm bg-white px-3 py-2 rounded border border-green-200 focus:border-green-500 outline-none"
                          rows={1}
                        />
                      </div>
                    )}

                    {session.impactMetrics && (
                      <div className="mb-3 bg-blue-50 p-2 rounded">
                        <label className="text-xs text-blue-700 font-medium flex items-center space-x-1 mb-1">
                          <Target className="w-3 h-3" />
                          <span>Impact Metrics</span>
                        </label>
                        <input
                          type="text"
                          value={session.impactMetrics}
                          onChange={(e) => updateSession(session.id, { impactMetrics: e.target.value })}
                          placeholder="Quantifiable metrics..."
                          className="w-full text-xs bg-white px-2 py-1 rounded border border-blue-200 focus:border-blue-500 outline-none"
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="text-xs text-gray-500 font-medium flex items-center space-x-1 mb-1">
                        <Star className="w-3 h-3" />
                        <span>Satisfaction Level: {session.satisfaction}/5</span>
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => updateSession(session.id, { satisfaction: rating })}
                            className={`p-1 ${rating <= session.satisfaction ? 'text-yellow-500' : 'text-gray-300'}`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="text-xs text-gray-500 font-medium mb-1 block">Reflection Notes</label>
                      <textarea
                        value={session.notes}
                        onChange={(e) => updateSession(session.id, { notes: e.target.value })}
                        placeholder="Personal reflections, learnings, feelings..."
                        className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                        rows={2}
                      />
                    </div>

                    {session.certificateEarned && (
                      <div className="flex items-center space-x-2 bg-amber-50 p-2 rounded border border-amber-200">
                        <Award className="w-4 h-4 text-amber-600" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-amber-800">Certificate Earned</div>
                          {session.recognitionType && (
                            <input
                              type="text"
                              value={session.recognitionType}
                              onChange={(e) => updateSession(session.id, { recognitionType: e.target.value })}
                              className="text-xs text-amber-700 bg-transparent border-b border-amber-200 focus:border-amber-500 outline-none w-full"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            <button onClick={addGoal} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Goal</span>
            </button>

            {goals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No goals set yet. Start planning your impact!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map(goal => (
                  <div key={goal.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${goal.active ? 'border-green-500' : 'border-gray-400'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={goal.goal}
                          onChange={(e) => updateGoal(goal.id, { goal: e.target.value })}
                          placeholder="Goal description..."
                          className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none w-full mb-2"
                        />
                        <div className="flex items-center space-x-2 mb-2">
                          <select
                            value={goal.type}
                            onChange={(e) => updateGoal(goal.id, { type: e.target.value as ImpactGoal['type'] })}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded border border-green-300 focus:border-green-500 outline-none"
                          >
                            <option value="hours">Hours Goal</option>
                            <option value="causes">Causes Goal</option>
                            <option value="skills">Skills Goal</option>
                            <option value="impact">Impact Goal</option>
                          </select>
                          <input
                            type="text"
                            value={goal.category}
                            onChange={(e) => updateGoal(goal.id, { category: e.target.value })}
                            placeholder="Category..."
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-300 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={() => updateGoal(goal.id, { active: !goal.active })}
                          className={`px-2 py-1 rounded text-xs font-medium ${goal.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {goal.active ? 'Active' : 'Paused'}
                        </button>
                        <button onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-500 font-medium">Progress</label>
                        <span className="text-sm font-semibold text-green-600">{goal.progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            goal.progress >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                            goal.progress >= 75 ? 'bg-gradient-to-r from-green-500 to-lime-600' :
                            goal.progress >= 50 ? 'bg-gradient-to-r from-lime-500 to-yellow-500' :
                            goal.progress >= 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            step="0.5"
                            value={goal.currentHours}
                            onChange={(e) => updateGoal(goal.id, { currentHours: parseFloat(e.target.value) || 0 })}
                            className="w-16 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-300 focus:border-green-500 outline-none"
                          />
                          <span className="text-xs text-gray-600">/</span>
                          <input
                            type="number"
                            step="0.5"
                            value={goal.targetHours}
                            onChange={(e) => updateGoal(goal.id, { targetHours: parseFloat(e.target.value) || 0 })}
                            className="w-16 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-300 focus:border-green-500 outline-none"
                          />
                          <span className="text-xs text-gray-600">hours</span>
                        </div>
                        {goal.deadline && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <input
                              type="date"
                              value={goal.deadline}
                              onChange={(e) => updateGoal(goal.id, { deadline: e.target.value })}
                              className="text-xs text-gray-600 bg-transparent border-b border-gray-200 focus:border-green-500 outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 bg-purple-50 p-3 rounded-lg">
                      <label className="text-xs text-purple-700 font-medium flex items-center space-x-1 mb-1">
                        <Heart className="w-3 h-3" />
                        <span>Motivation</span>
                      </label>
                      <textarea
                        value={goal.motivation}
                        onChange={(e) => updateGoal(goal.id, { motivation: e.target.value })}
                        placeholder="Why is this goal important to you?"
                        className="w-full text-sm bg-white px-3 py-2 rounded border border-purple-200 focus:border-purple-500 outline-none"
                        rows={2}
                      />
                    </div>

                    {goal.type === 'impact' && goal.impactGoal && (
                      <div className="mb-3 bg-blue-50 p-3 rounded-lg">
                        <label className="text-xs text-blue-700 font-medium flex items-center space-x-1 mb-1">
                          <Target className="w-3 h-3" />
                          <span>Impact Target</span>
                        </label>
                        <textarea
                          value={goal.impactGoal}
                          onChange={(e) => updateGoal(goal.id, { impactGoal: e.target.value })}
                          placeholder="Specific impact you want to achieve..."
                          className="w-full text-sm bg-white px-3 py-2 rounded border border-blue-200 focus:border-blue-500 outline-none"
                          rows={2}
                        />
                      </div>
                    )}

                    {goal.type === 'skills' && goal.skillsToLearn && goal.skillsToLearn.length > 0 && (
                      <div className="mb-3 bg-orange-50 p-3 rounded-lg">
                        <label className="text-xs text-orange-700 font-medium flex items-center space-x-1 mb-2">
                          <BookOpen className="w-3 h-3" />
                          <span>Skills to Develop</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {goal.skillsToLearn.map((skill, idx) => (
                            <div key={idx} className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-orange-200">
                              <CheckCircle2 className="w-3 h-3 text-orange-600" />
                              <span className="text-xs text-orange-800">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {goal.progress >= 100 && (
                      <div className="bg-green-100 border border-green-300 rounded-lg p-2 flex items-center space-x-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">Goal Achieved!</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Volunteer Statistics</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Total Opportunities</span>
                  </span>
                  <span className="font-semibold">{opportunities.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-green-600" />
                    <span>Active Opportunities</span>
                  </span>
                  <span className="font-semibold">{activeOpps}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Total Hours Volunteered</span>
                  </span>
                  <span className="font-semibold text-green-600">{totalHours.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>Organizations Served</span>
                  </span>
                  <span className="font-semibold">{organizations}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>Sessions Completed</span>
                  </span>
                  <span className="font-semibold">{completedSessions}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <span>Certificates Earned</span>
                  </span>
                  <span className="font-semibold">{certificatesEarned}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Star className="w-4 h-4 text-green-600" />
                    <span>Average Satisfaction</span>
                  </span>
                  <span className="font-semibold">{avgSatisfaction}/5</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span>Active Goals</span>
                  </span>
                  <span className="font-semibold">{goals.filter(g => g.active).length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Goal Progress Overview</span>
              </h3>
              <div className="space-y-3">
                {goals.filter(g => g.active).length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No active goals set yet</p>
                ) : (
                  goals.filter(g => g.active).map(goal => (
                    <div key={goal.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-800">{goal.goal}</div>
                          <div className="text-xs text-gray-500 mt-1">{goal.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">{goal.progress.toFixed(0)}%</div>
                          <div className="text-xs text-gray-500">{goal.currentHours}/{goal.targetHours}h</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-lime-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {sessions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Recent Impact Highlights</span>
                </h3>
                <div className="space-y-3">
                  {sessions.slice(0, 5).map(session => (
                    <div key={session.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-800">{session.organization}</div>
                          <div className="text-xs text-gray-500 mt-1">{session.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">{session.duration}h</div>
                          <div className="flex items-center justify-end space-x-0.5 mt-1">
                            {[...Array(session.satisfaction)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      {session.impact && (
                        <div className="mt-2 text-xs text-gray-600 italic">{session.impact}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerHubPage;
