import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Briefcase, TrendingUp, Plus, Trash2, Star, Calendar, MapPin, CheckCircle, Clock, AlertCircle, Search, Filter, Edit2, Mail, Phone, Video, Coffee, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Contact {
  id: string;
  name: string;
  profession: string;
  company?: string;
  industry: string;
  connectionType: 'colleague' | 'client' | 'mentor' | 'mentee' | 'peer' | 'acquaintance' | 'other';
  strength: number; // 1-5
  metAt?: string;
  metDate?: string;
  lastContact?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  notes: string;
}

interface NetworkingEvent {
  id: string;
  name: string;
  type: 'conference' | 'meetup' | 'workshop' | 'seminar' | 'webinar' | 'networking-event';
  date: string;
  location: string;
  attendees: number;
  contactsMade: string[];
  registrationStatus: 'registered' | 'attended' | 'cancelled' | 'pending';
  outcome: string;
  notes: string;
  value: number; // 1-5
}

interface FollowUp {
  id: string;
  contactId: string;
  contactName: string;
  type: 'email' | 'call' | 'coffee' | 'linkedin' | 'video-call' | 'meeting';
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  actionItems: string[];
}

const SAMPLE_EVENTS: NetworkingEvent[] = [
  {
    id: '1',
    name: 'TechConnect Summit 2024',
    type: 'conference',
    date: '2024-03-15',
    location: 'San Francisco, CA',
    attendees: 2500,
    contactsMade: ['Sarah Chen', 'Michael Rodriguez'],
    registrationStatus: 'attended',
    outcome: 'Met 8 potential partners, 2 investors showed interest',
    notes: 'Excellent keynote on AI trends. Connected with Sarah from Google Cloud.',
    value: 5
  },
  {
    id: '2',
    name: 'Startup Founders Meetup',
    type: 'meetup',
    date: '2024-02-28',
    location: 'Austin, TX',
    attendees: 85,
    contactsMade: ['David Park', 'Emily Watson'],
    registrationStatus: 'attended',
    outcome: 'Found 3 potential co-founders, great discussions on funding',
    notes: 'Casual atmosphere. David has interesting SaaS project.',
    value: 4
  },
  {
    id: '3',
    name: 'Product Management Workshop',
    type: 'workshop',
    date: '2024-02-10',
    location: 'New York, NY',
    attendees: 45,
    contactsMade: ['Jennifer Lee'],
    registrationStatus: 'attended',
    outcome: 'Learned agile methodologies, Jennifer offered mentorship',
    notes: 'Hands-on exercises were valuable. Got PM certification.',
    value: 5
  },
  {
    id: '4',
    name: 'Women in Tech Leadership',
    type: 'networking-event',
    date: '2024-04-05',
    location: 'Boston, MA',
    attendees: 120,
    contactsMade: ['Rachel Adams', 'Sophia Martinez'],
    registrationStatus: 'registered',
    outcome: '',
    notes: 'Upcoming event focused on C-suite representation',
    value: 4
  },
  {
    id: '5',
    name: 'AI & Machine Learning Seminar',
    type: 'seminar',
    date: '2024-01-20',
    location: 'Seattle, WA',
    attendees: 300,
    contactsMade: ['Dr. James Wilson', 'Alex Thompson'],
    registrationStatus: 'attended',
    outcome: 'Gained insights on LLMs, connected with ML researchers',
    notes: 'Dr. Wilson working on computer vision. Alex from Microsoft Research.',
    value: 5
  },
  {
    id: '6',
    name: 'Digital Marketing Masterclass',
    type: 'webinar',
    date: '2024-03-01',
    location: 'Online',
    attendees: 850,
    contactsMade: ['Chris Anderson'],
    registrationStatus: 'attended',
    outcome: 'Learned SEO strategies, Chris shared growth hacking tips',
    notes: 'Recorded session available. Follow up with Chris on collaboration.',
    value: 3
  },
  {
    id: '7',
    name: 'Venture Capital Networking Night',
    type: 'networking-event',
    date: '2024-02-15',
    location: 'Palo Alto, CA',
    attendees: 200,
    contactsMade: ['Jessica Chen', 'Robert Kim', 'Maria Gonzalez'],
    registrationStatus: 'attended',
    outcome: 'Pitched to 3 VCs, Jessica interested in seed round',
    notes: 'High-value connections. Jessica from Sequoia wants follow-up meeting.',
    value: 5
  },
  {
    id: '8',
    name: 'Design Thinking Workshop',
    type: 'workshop',
    date: '2024-01-10',
    location: 'Chicago, IL',
    attendees: 60,
    contactsMade: ['Tom Bradley'],
    registrationStatus: 'attended',
    outcome: 'Improved UX skills, Tom interested in consulting project',
    notes: 'Interactive sessions on user research. Tom has agency.',
    value: 4
  },
  {
    id: '9',
    name: 'Blockchain & Web3 Conference',
    type: 'conference',
    date: '2024-04-20',
    location: 'Miami, FL',
    attendees: 1800,
    contactsMade: [],
    registrationStatus: 'registered',
    outcome: '',
    notes: 'Focus on DeFi and NFT technologies. Pre-registered VIP pass.',
    value: 4
  },
  {
    id: '10',
    name: 'Sales Excellence Summit',
    type: 'seminar',
    date: '2024-03-08',
    location: 'Dallas, TX',
    attendees: 400,
    contactsMade: ['Linda Torres', 'Kevin O\'Brien'],
    registrationStatus: 'attended',
    outcome: 'Advanced closing techniques, Linda shared CRM strategies',
    notes: 'Kevin runs sales training company. Potential partnership.',
    value: 4
  }
];

const SAMPLE_FOLLOWUPS: FollowUp[] = [
  {
    id: '1',
    contactId: 'c1',
    contactName: 'Sarah Chen',
    type: 'email',
    dueDate: '2024-03-20',
    status: 'pending',
    priority: 'high',
    notes: 'Follow up on Google Cloud partnership discussion',
    actionItems: ['Send proposal document', 'Schedule technical call', 'Share case studies']
  },
  {
    id: '2',
    contactId: 'c2',
    contactName: 'Jessica Chen',
    type: 'coffee',
    dueDate: '2024-03-18',
    status: 'pending',
    priority: 'high',
    notes: 'Coffee meeting to discuss seed funding at Sequoia',
    actionItems: ['Prepare pitch deck', 'Update financial projections', 'Bring term sheet draft']
  },
  {
    id: '3',
    contactId: 'c3',
    contactName: 'Michael Rodriguez',
    type: 'call',
    dueDate: '2024-03-15',
    status: 'completed',
    priority: 'medium',
    notes: 'Discussion about joint marketing campaign',
    actionItems: ['Share marketing calendar', 'Discuss budget allocation']
  },
  {
    id: '4',
    contactId: 'c4',
    contactName: 'David Park',
    type: 'video-call',
    dueDate: '2024-03-22',
    status: 'pending',
    priority: 'medium',
    notes: 'Technical architecture review for his SaaS platform',
    actionItems: ['Review code repository', 'Suggest scalability improvements', 'Discuss tech stack']
  },
  {
    id: '5',
    contactId: 'c5',
    contactName: 'Jennifer Lee',
    type: 'linkedin',
    dueDate: '2024-03-12',
    status: 'completed',
    priority: 'low',
    notes: 'Thank you message for mentorship offer',
    actionItems: ['Send connection request', 'Share LinkedIn article']
  },
  {
    id: '6',
    contactId: 'c6',
    contactName: 'Dr. James Wilson',
    type: 'email',
    dueDate: '2024-03-25',
    status: 'pending',
    priority: 'high',
    notes: 'Request collaboration on computer vision project',
    actionItems: ['Send research proposal', 'Share dataset samples', 'Propose meeting date']
  },
  {
    id: '7',
    contactId: 'c7',
    contactName: 'Alex Thompson',
    type: 'meeting',
    dueDate: '2024-03-28',
    status: 'pending',
    priority: 'medium',
    notes: 'Discuss potential partnership with Microsoft Research',
    actionItems: ['Prepare presentation', 'Book conference room', 'Send calendar invite']
  },
  {
    id: '8',
    contactId: 'c8',
    contactName: 'Emily Watson',
    type: 'coffee',
    dueDate: '2024-03-14',
    status: 'overdue',
    priority: 'high',
    notes: 'Co-founder discussion postponed, need to reschedule',
    actionItems: ['Propose new dates', 'Share business plan', 'Discuss equity split']
  },
  {
    id: '9',
    contactId: 'c9',
    contactName: 'Tom Bradley',
    type: 'call',
    dueDate: '2024-03-16',
    status: 'completed',
    priority: 'medium',
    notes: 'Consulting project scope definition call',
    actionItems: ['Send proposal', 'Agree on timeline']
  },
  {
    id: '10',
    contactId: 'c10',
    contactName: 'Linda Torres',
    type: 'email',
    dueDate: '2024-03-30',
    status: 'pending',
    priority: 'low',
    notes: 'Request CRM implementation best practices',
    actionItems: ['Share questions list', 'Schedule demo']
  },
  {
    id: '11',
    contactId: 'c11',
    contactName: 'Robert Kim',
    type: 'video-call',
    dueDate: '2024-03-19',
    status: 'pending',
    priority: 'high',
    notes: 'Series A funding discussion',
    actionItems: ['Prepare financial model', 'Update cap table', 'Share growth metrics']
  },
  {
    id: '12',
    contactId: 'c12',
    contactName: 'Chris Anderson',
    type: 'linkedin',
    dueDate: '2024-03-17',
    status: 'pending',
    priority: 'medium',
    notes: 'Explore growth hacking collaboration',
    actionItems: ['Send project brief', 'Discuss compensation model']
  }
];

const NetworkingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'events' | 'followups' | 'stats'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState<'all' | NetworkingEvent['type']>('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<'all' | NetworkingEvent['registrationStatus']>('all');
  const [followUpFilter, setFollowUpFilter] = useState<'all' | FollowUp['status']>('all');
  const [followUpPriorityFilter, setFollowUpPriorityFilter] = useState<'all' | FollowUp['priority']>('all');

  useEffect(() => {
    const savedContacts = localStorage.getItem('networkingContacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }

    const savedEvents = localStorage.getItem('networkingEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(SAMPLE_EVENTS);
      localStorage.setItem('networkingEvents', JSON.stringify(SAMPLE_EVENTS));
    }

    const savedFollowUps = localStorage.getItem('networkingFollowUps');
    if (savedFollowUps) {
      setFollowUps(JSON.parse(savedFollowUps));
    } else {
      setFollowUps(SAMPLE_FOLLOWUPS);
      localStorage.setItem('networkingFollowUps', JSON.stringify(SAMPLE_FOLLOWUPS));
    }
  }, []);

  useEffect(() => { localStorage.setItem('networkingContacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('networkingEvents', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('networkingFollowUps', JSON.stringify(followUps)); }, [followUps]);

  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: '',
      profession: '',
      industry: '',
      connectionType: 'acquaintance',
      strength: 1,
      notes: '',
    };
    setContacts([...contacts, newContact]);
    toast.success('Contact added');
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success('Contact deleted');
  };

  const addEvent = () => {
    const newEvent: NetworkingEvent = {
      id: Date.now().toString(),
      name: '',
      type: 'conference',
      date: new Date().toISOString().split('T')[0],
      location: '',
      attendees: 0,
      contactsMade: [],
      registrationStatus: 'pending',
      outcome: '',
      notes: '',
      value: 3
    };
    setEvents([...events, newEvent]);
    toast.success('Event added');
  };

  const updateEvent = (id: string, updates: Partial<NetworkingEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success('Event deleted');
  };

  const addFollowUp = () => {
    const newFollowUp: FollowUp = {
      id: Date.now().toString(),
      contactId: '',
      contactName: '',
      type: 'email',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      priority: 'medium',
      notes: '',
      actionItems: []
    };
    setFollowUps([...followUps, newFollowUp]);
    toast.success('Follow-up added');
  };

  const updateFollowUp = (id: string, updates: Partial<FollowUp>) => {
    setFollowUps(followUps.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(followUps.filter(f => f.id !== id));
    toast.success('Follow-up deleted');
  };

  const toggleFollowUpStatus = (id: string) => {
    const followUp = followUps.find(f => f.id === id);
    if (followUp) {
      const newStatus = followUp.status === 'completed' ? 'pending' : 'completed';
      updateFollowUp(id, { status: newStatus });
      toast.success(`Follow-up marked as ${newStatus}`);
    }
  };

  const strongConnections = contacts.filter(c => c.strength >= 4).length;
  const pendingFollowUps = followUps.filter(f => f.status === 'pending').length;
  const overdueFollowUps = followUps.filter(f => f.status === 'overdue').length;
  const industries = new Set(contacts.map(c => c.industry)).size;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date() && e.registrationStatus === 'registered').length;

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = eventFilter === 'all' || event.type === eventFilter;
    const matchesStatus = eventStatusFilter === 'all' || event.registrationStatus === eventStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = followUp.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         followUp.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = followUpFilter === 'all' || followUp.status === followUpFilter;
    const matchesPriority = followUpPriorityFilter === 'all' || followUp.priority === followUpPriorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getTypeIcon = (type: FollowUp['type']) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'video-call': return <Video className="w-4 h-4" />;
      case 'coffee': return <Coffee className="w-4 h-4" />;
      case 'linkedin': return <MessageCircle className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: FollowUp['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusColor = (status: FollowUp['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status: FollowUp['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: NetworkingEvent['type']) => {
    switch (type) {
      case 'conference': return 'bg-blue-100 text-blue-700';
      case 'meetup': return 'bg-purple-100 text-purple-700';
      case 'workshop': return 'bg-green-100 text-green-700';
      case 'seminar': return 'bg-orange-100 text-orange-700';
      case 'webinar': return 'bg-cyan-100 text-cyan-700';
      case 'networking-event': return 'bg-pink-100 text-pink-700';
    }
  };

  const getRegistrationStatusColor = (status: NetworkingEvent['registrationStatus']) => {
    switch (status) {
      case 'attended': return 'bg-green-100 text-green-700';
      case 'registered': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 pb-20">
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Networking Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <UserPlus className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{contacts.length}</div>
            <div className="text-xs opacity-90">Contacts</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{strongConnections}</div>
            <div className="text-xs opacity-90">Strong</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Briefcase className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{events.length}</div>
            <div className="text-xs opacity-90">Events</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{pendingFollowUps}</div>
            <div className="text-xs opacity-90">Follow-ups</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'contacts', label: 'Contacts', icon: UserPlus },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'followups', label: 'Follow-ups', icon: TrendingUp },
            { id: 'stats', label: 'Stats', icon: Star },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50' : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <button onClick={addContact} className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Contact</span>
            </button>
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No contacts yet. Build your network!</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={contact.name} onChange={(e) => updateContact(contact.id, { name: e.target.value })} placeholder="Name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none w-full mb-1" />
                      <input type="text" value={contact.profession} onChange={(e) => updateContact(contact.id, { profession: e.target.value })} placeholder="Profession..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-cyan-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteContact(contact.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={contact.industry} onChange={(e) => updateContact(contact.id, { industry: e.target.value })} placeholder="Industry..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                    <select value={contact.connectionType} onChange={(e) => updateContact(contact.id, { connectionType: e.target.value as Contact['connectionType'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                      <option value="colleague">Colleague</option>
                      <option value="client">Client</option>
                      <option value="mentor">Mentor</option>
                      <option value="mentee">Mentee</option>
                      <option value="peer">Peer</option>
                      <option value="acquaintance">Acquaintance</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="text" value={contact.company || ''} onChange={(e) => updateContact(contact.id, { company: e.target.value })} placeholder="Company..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Connection Strength: {contact.strength}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button key={level} onClick={() => updateContact(contact.id, { strength: level })} className={`w-10 h-10 rounded ${level <= contact.strength ? 'bg-cyan-500 text-white' : 'bg-gray-200'}`}>
                          <Star className="w-5 h-5 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={contact.notes} onChange={(e) => updateContact(contact.id, { notes: e.target.value })} placeholder="Notes, interests..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none text-sm"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value as any)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="conference">Conference</option>
                  <option value="meetup">Meetup</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="webinar">Webinar</option>
                  <option value="networking-event">Networking Event</option>
                </select>
                <select
                  value={eventStatusFilter}
                  onChange={(e) => setEventStatusFilter(e.target.value as any)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="attended">Attended</option>
                  <option value="registered">Registered</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <button onClick={addEvent} className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Event</span>
            </button>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No events found</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-teal-500">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={event.name}
                        onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                        placeholder="Event name..."
                        className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none w-full mb-2"
                      />
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRegistrationStatusColor(event.registrationStatus)}`}>
                          {event.registrationStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700 ml-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Type</label>
                      <select
                        value={event.type}
                        onChange={(e) => updateEvent(event.id, { type: e.target.value as NetworkingEvent['type'] })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      >
                        <option value="conference">Conference</option>
                        <option value="meetup">Meetup</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="webinar">Webinar</option>
                        <option value="networking-event">Networking Event</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Status</label>
                      <select
                        value={event.registrationStatus}
                        onChange={(e) => updateEvent(event.id, { registrationStatus: e.target.value as NetworkingEvent['registrationStatus'] })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="registered">Registered</option>
                        <option value="attended">Attended</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Date</label>
                      <input
                        type="date"
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Attendees</label>
                      <input
                        type="number"
                        value={event.attendees}
                        onChange={(e) => updateEvent(event.id, { attendees: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">Location</label>
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => updateEvent(event.id, { location: e.target.value })}
                      placeholder="Event location..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                    />
                  </div>

                  {event.contactsMade.length > 0 && (
                    <div className="mb-3 bg-cyan-50 p-3 rounded">
                      <label className="text-xs font-medium text-cyan-700 block mb-2">Contacts Made</label>
                      <div className="flex flex-wrap gap-2">
                        {event.contactsMade.map((contact, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-cyan-200 text-cyan-700">
                            {contact}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">Outcome</label>
                    <textarea
                      value={event.outcome}
                      onChange={(e) => updateEvent(event.id, { outcome: e.target.value })}
                      placeholder="Event outcomes and key results..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                      rows={2}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">Notes</label>
                    <textarea
                      value={event.notes}
                      onChange={(e) => updateEvent(event.id, { notes: e.target.value })}
                      placeholder="Additional notes..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Event Value: {event.value}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateEvent(event.id, { value: level })}
                          className={`w-8 h-8 rounded ${level <= event.value ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}
                        >
                          <Star className="w-4 h-4 mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'followups' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search follow-ups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none text-sm"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <select
                  value={followUpFilter}
                  onChange={(e) => setFollowUpFilter(e.target.value as any)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select
                  value={followUpPriorityFilter}
                  onChange={(e) => setFollowUpPriorityFilter(e.target.value as any)}
                  className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {overdueFollowUps > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Overdue Follow-ups</p>
                  <p className="text-sm text-red-700">You have {overdueFollowUps} overdue follow-up{overdueFollowUps !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}

            <button onClick={addFollowUp} className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Follow-up</span>
            </button>

            {filteredFollowUps.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No follow-ups found</p>
              </div>
            ) : (
              filteredFollowUps.map(followUp => (
                <div key={followUp.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${followUp.status === 'overdue' ? 'border-red-500' : followUp.status === 'completed' ? 'border-green-500' : 'border-cyan-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleFollowUpStatus(followUp.id)}
                        className={`mt-1 ${getStatusColor(followUp.status)} p-2 rounded-full transition-colors`}
                      >
                        {getStatusIcon(followUp.status)}
                      </button>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={followUp.contactName}
                          onChange={(e) => updateFollowUp(followUp.id, { contactName: e.target.value })}
                          placeholder="Contact name..."
                          className={`text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none w-full mb-2 ${followUp.status === 'completed' ? 'line-through text-gray-400' : ''}`}
                        />
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded border font-medium ${getPriorityColor(followUp.priority)}`}>
                            {followUp.priority.toUpperCase()}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 flex items-center space-x-1">
                            {getTypeIcon(followUp.type)}
                            <span>{followUp.type.replace('-', ' ')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteFollowUp(followUp.id)} className="text-red-500 hover:text-red-700 ml-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Type</label>
                      <select
                        value={followUp.type}
                        onChange={(e) => updateFollowUp(followUp.id, { type: e.target.value as FollowUp['type'] })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      >
                        <option value="email">Email</option>
                        <option value="call">Call</option>
                        <option value="video-call">Video Call</option>
                        <option value="coffee">Coffee</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="meeting">Meeting</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Priority</label>
                      <select
                        value={followUp.priority}
                        onChange={(e) => updateFollowUp(followUp.id, { priority: e.target.value as FollowUp['priority'] })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Due Date</label>
                      <input
                        type="date"
                        value={followUp.dueDate}
                        onChange={(e) => updateFollowUp(followUp.id, { dueDate: e.target.value })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Status</label>
                      <select
                        value={followUp.status}
                        onChange={(e) => updateFollowUp(followUp.id, { status: e.target.value as FollowUp['status'] })}
                        className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">Notes</label>
                    <textarea
                      value={followUp.notes}
                      onChange={(e) => updateFollowUp(followUp.id, { notes: e.target.value })}
                      placeholder="Follow-up notes..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none"
                      rows={2}
                    />
                  </div>

                  {followUp.actionItems.length > 0 && (
                    <div className="bg-cyan-50 p-3 rounded">
                      <label className="text-xs font-medium text-cyan-700 block mb-2">Action Items</label>
                      <ul className="space-y-1">
                        {followUp.actionItems.map((item, idx) => (
                          <li key={idx} className="text-sm text-cyan-900 flex items-start space-x-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-600">Networking Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Contacts:</span>
                  <span className="font-semibold text-lg">{contacts.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Strong Connections:</span>
                  <span className="font-semibold text-lg text-green-600">{strongConnections}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Industries Represented:</span>
                  <span className="font-semibold text-lg">{industries}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Events:</span>
                  <span className="font-semibold text-lg">{events.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Events Attended:</span>
                  <span className="font-semibold text-lg">{events.filter(e => e.registrationStatus === 'attended').length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Upcoming Events:</span>
                  <span className="font-semibold text-lg text-blue-600">{upcomingEvents}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Pending Follow-ups:</span>
                  <span className="font-semibold text-lg text-yellow-600">{pendingFollowUps}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Overdue Follow-ups:</span>
                  <span className="font-semibold text-lg text-red-600">{overdueFollowUps}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Completed Follow-ups:</span>
                  <span className="font-semibold text-lg text-green-600">{followUps.filter(f => f.status === 'completed').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-600">Connection Breakdown</h3>
              <div className="space-y-2">
                {['colleague', 'client', 'mentor', 'mentee', 'peer', 'acquaintance', 'other'].map(type => {
                  const count = contacts.filter(c => c.connectionType === type).length;
                  const percentage = contacts.length > 0 ? (count / contacts.length * 100).toFixed(0) : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{type}:</span>
                        <span className="font-medium">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-600">Event Distribution</h3>
              <div className="space-y-2">
                {['conference', 'meetup', 'workshop', 'seminar', 'webinar', 'networking-event'].map(type => {
                  const count = events.filter(e => e.type === type).length;
                  const percentage = events.length > 0 ? (count / events.length * 100).toFixed(0) : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{type.replace('-', ' ')}:</span>
                        <span className="font-medium">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkingHubPage;
