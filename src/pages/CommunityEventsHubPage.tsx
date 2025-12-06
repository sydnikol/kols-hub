import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Trash2, Check, Mail, Phone, MessageCircle, Tag, Search, Filter, Star, Award, Briefcase, Heart, UserPlus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface CommunityEvent {
  id: string;
  name: string;
  type: 'meetup' | 'workshop' | 'conference' | 'social' | 'networking' | 'cultural' | 'sports' | 'volunteer' | 'other';
  date: string;
  time: string;
  location: string;
  organizer?: string;
  status: 'interested' | 'registered' | 'attending' | 'attended' | 'missed' | 'cancelled';
  cost: number;
  notes: string;
}

interface Attendee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  eventsAttended: string[];
  connectionStrength: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  notes: string;
  metAt: string;
  lastContact?: string;
  linkedin?: string;
  interests?: string[];
}

const CommunityEventsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'stats'>('events');
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [filterStrength, setFilterStrength] = useState<number>(0);

  useEffect(() => {
    const savedEvents = localStorage.getItem('communityEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Initialize with sample events
      const sampleEvents: CommunityEvent[] = [
        {
          id: '1',
          name: 'Tech Meetup Downtown',
          type: 'meetup',
          date: '2025-12-15',
          time: '18:00',
          location: 'Innovation Hub, Downtown',
          organizer: 'Tech Community Coalition',
          status: 'attended',
          cost: 0,
          notes: 'Great networking opportunity, free pizza!'
        },
        {
          id: '2',
          name: 'React Workshop Series',
          type: 'workshop',
          date: '2025-11-28',
          time: '14:00',
          location: 'CodeSpace Center',
          organizer: 'Dev Academy',
          status: 'attended',
          cost: 45,
          notes: 'Hands-on React hooks training'
        },
        {
          id: '3',
          name: 'Community Volunteer Day',
          type: 'volunteer',
          date: '2025-10-20',
          time: '09:00',
          location: 'City Park',
          organizer: 'Local Volunteers',
          status: 'attended',
          cost: 0,
          notes: 'Park cleanup and tree planting'
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('communityEvents', JSON.stringify(sampleEvents));
    }

    const savedAttendees = localStorage.getItem('eventAttendees');
    if (savedAttendees) {
      setAttendees(JSON.parse(savedAttendees));
    } else {
      // Initialize with sample attendees
      const sampleAttendees: Attendee[] = [
        {
          id: '1',
          name: 'Sarah Martinez',
          email: 'sarah.martinez@techcorp.com',
          phone: '+1-555-0123',
          company: 'TechCorp Solutions',
          role: 'Senior Developer',
          eventsAttended: ['Tech Meetup Downtown', 'React Workshop Series'],
          connectionStrength: 5,
          tags: ['colleague', 'mentor', 'tech-enthusiast'],
          notes: 'Expert in React and Node.js. Very helpful with architecture questions. Met at Tech Meetup, grabbed coffee twice since then.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-15',
          linkedin: 'linkedin.com/in/sarahmartinez',
          interests: ['React', 'Cloud Architecture', 'Hiking']
        },
        {
          id: '2',
          name: 'James Chen',
          email: 'james.chen@startup.io',
          phone: '+1-555-0124',
          company: 'Startup.io',
          role: 'Founder & CEO',
          eventsAttended: ['Tech Meetup Downtown', 'Community Volunteer Day'],
          connectionStrength: 4,
          tags: ['entrepreneur', 'friend', 'networking'],
          notes: 'Building an AI-powered analytics platform. Great insights on startup culture and fundraising. Really passionate about community service.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-10',
          linkedin: 'linkedin.com/in/jameschen',
          interests: ['AI', 'Startups', 'Running']
        },
        {
          id: '3',
          name: 'Emily Johnson',
          email: 'emily.j@design.studio',
          phone: '+1-555-0125',
          company: 'Creative Design Studio',
          role: 'UX Designer',
          eventsAttended: ['React Workshop Series'],
          connectionStrength: 3,
          tags: ['colleague', 'creative'],
          notes: 'Talented UX designer with a focus on accessibility. Shared some great design resources. Works remotely from Portland.',
          metAt: 'React Workshop Series',
          lastContact: '2025-11-20',
          linkedin: 'linkedin.com/in/emilyjohnson',
          interests: ['Design', 'Photography', 'Yoga']
        },
        {
          id: '4',
          name: 'Michael Torres',
          email: 'mtorres@nonprofit.org',
          company: 'Local Nonprofit Foundation',
          role: 'Community Coordinator',
          eventsAttended: ['Community Volunteer Day'],
          connectionStrength: 4,
          tags: ['friend', 'volunteer', 'organizer'],
          notes: 'Organizes most of the volunteer events in the area. Very connected in the community. Great person to know for social impact projects.',
          metAt: 'Community Volunteer Day',
          lastContact: '2025-10-25',
          interests: ['Volunteering', 'Urban Planning', 'Basketball']
        },
        {
          id: '5',
          name: 'Aisha Patel',
          email: 'aisha.patel@cloudtech.com',
          phone: '+1-555-0126',
          company: 'CloudTech Systems',
          role: 'DevOps Engineer',
          eventsAttended: ['Tech Meetup Downtown', 'React Workshop Series'],
          connectionStrength: 5,
          tags: ['colleague', 'tech-enthusiast', 'mentor'],
          notes: 'AWS certified solutions architect. Has been incredibly helpful with cloud infrastructure questions. Very active in the local tech community.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-18',
          linkedin: 'linkedin.com/in/aishapatel',
          interests: ['Cloud Computing', 'DevOps', 'Travel']
        },
        {
          id: '6',
          name: 'David Kim',
          email: 'dkim@marketing.pro',
          phone: '+1-555-0127',
          company: 'Marketing Pro Agency',
          role: 'Digital Marketing Manager',
          eventsAttended: ['Tech Meetup Downtown'],
          connectionStrength: 2,
          tags: ['acquaintance', 'marketing'],
          notes: 'Interested in marketing automation and analytics. Exchanged business cards, might collaborate on a side project.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-05',
          interests: ['Marketing', 'Analytics', 'Golf']
        },
        {
          id: '7',
          name: 'Rachel Green',
          email: 'rachel.green@edutech.com',
          phone: '+1-555-0128',
          company: 'EduTech Innovations',
          role: 'Product Manager',
          eventsAttended: ['React Workshop Series', 'Tech Meetup Downtown'],
          connectionStrength: 4,
          tags: ['colleague', 'product', 'friend'],
          notes: 'Working on educational software for K-12. Very insightful about product development and user research. We share a lot of common interests.',
          metAt: 'React Workshop Series',
          lastContact: '2025-11-22',
          linkedin: 'linkedin.com/in/rachelgreen',
          interests: ['Education', 'Product Management', 'Reading']
        },
        {
          id: '8',
          name: 'Carlos Rodriguez',
          email: 'carlos.r@freelance.dev',
          phone: '+1-555-0129',
          company: 'Freelance',
          role: 'Full Stack Developer',
          eventsAttended: ['React Workshop Series', 'Tech Meetup Downtown'],
          connectionStrength: 3,
          tags: ['colleague', 'freelancer', 'tech-enthusiast'],
          notes: 'Experienced freelancer specializing in React and Django. Open to collaboration on projects. Very knowledgeable about remote work best practices.',
          metAt: 'React Workshop Series',
          lastContact: '2025-11-12',
          linkedin: 'linkedin.com/in/carlosrodriguez',
          interests: ['Full Stack Development', 'Gaming', 'Cooking']
        },
        {
          id: '9',
          name: 'Nina Williams',
          email: 'nina.w@healthtech.io',
          phone: '+1-555-0130',
          company: 'HealthTech Solutions',
          role: 'Data Scientist',
          eventsAttended: ['Tech Meetup Downtown'],
          connectionStrength: 3,
          tags: ['colleague', 'data-science', 'acquaintance'],
          notes: 'Working on healthcare analytics and machine learning models. Shared interesting insights about data privacy in healthcare.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-08',
          linkedin: 'linkedin.com/in/ninawilliams',
          interests: ['Machine Learning', 'Healthcare', 'Cycling']
        },
        {
          id: '10',
          name: 'Tom Anderson',
          email: 'tanderson@consulting.biz',
          phone: '+1-555-0131',
          company: 'Tech Consulting Group',
          role: 'Senior Consultant',
          eventsAttended: ['Tech Meetup Downtown', 'Community Volunteer Day'],
          connectionStrength: 4,
          tags: ['mentor', 'consultant', 'friend'],
          notes: 'Has 15+ years in tech consulting. Offered to review my resume and provide career advice. Very generous with his time and knowledge.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-17',
          linkedin: 'linkedin.com/in/tomanderson',
          interests: ['Consulting', 'Mentorship', 'Tennis']
        },
        {
          id: '11',
          name: 'Lisa Chang',
          email: 'lisa.chang@security.com',
          phone: '+1-555-0132',
          company: 'CyberSecurity Corp',
          role: 'Security Engineer',
          eventsAttended: ['Tech Meetup Downtown'],
          connectionStrength: 2,
          tags: ['acquaintance', 'security', 'tech-enthusiast'],
          notes: 'Specializes in application security and penetration testing. Had an interesting conversation about OAuth and security best practices.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-06',
          interests: ['Cybersecurity', 'Ethical Hacking', 'Chess']
        },
        {
          id: '12',
          name: 'Jordan Lee',
          email: 'jordan@community.coop',
          company: 'Community Tech Cooperative',
          role: 'Community Manager',
          eventsAttended: ['Community Volunteer Day', 'Tech Meetup Downtown'],
          connectionStrength: 5,
          tags: ['friend', 'organizer', 'volunteer', 'tech-enthusiast'],
          notes: 'One of the main organizers of local tech and community events. Super well-connected and always willing to make introductions. Became good friends!',
          metAt: 'Community Volunteer Day',
          lastContact: '2025-11-21',
          linkedin: 'linkedin.com/in/jordanlee',
          interests: ['Community Building', 'Technology', 'Music']
        },
        {
          id: '13',
          name: 'Amanda Foster',
          email: 'afoster@venture.capital',
          phone: '+1-555-0133',
          company: 'Tech Ventures VC',
          role: 'Investment Analyst',
          eventsAttended: ['Tech Meetup Downtown'],
          connectionStrength: 3,
          tags: ['acquaintance', 'investor', 'networking'],
          notes: 'Works in venture capital focusing on early-stage tech startups. Interested in AI and SaaS companies. Great contact for startup ecosystem insights.',
          metAt: 'Tech Meetup Downtown',
          lastContact: '2025-11-09',
          linkedin: 'linkedin.com/in/amandafoster',
          interests: ['Venture Capital', 'Startups', 'Sailing']
        },
        {
          id: '14',
          name: 'Kevin Murphy',
          email: 'kmurphy@bigtech.com',
          phone: '+1-555-0134',
          company: 'BigTech Inc',
          role: 'Engineering Manager',
          eventsAttended: ['React Workshop Series'],
          connectionStrength: 4,
          tags: ['colleague', 'mentor', 'tech-enthusiast'],
          notes: 'Manages a team of 20+ engineers. Offered great advice on technical leadership and team building. Very approachable despite senior position.',
          metAt: 'React Workshop Series',
          lastContact: '2025-11-19',
          linkedin: 'linkedin.com/in/kevinmurphy',
          interests: ['Engineering Management', 'Mentorship', 'Skiing']
        },
        {
          id: '15',
          name: 'Sophia Martinez',
          email: 'sophia.m@creative.agency',
          phone: '+1-555-0135',
          company: 'Creative Digital Agency',
          role: 'Content Strategist',
          eventsAttended: ['Community Volunteer Day'],
          connectionStrength: 2,
          tags: ['acquaintance', 'creative', 'marketing'],
          notes: 'Creates content strategy for tech companies. Passionate about environmental causes. We bonded over sustainability initiatives.',
          metAt: 'Community Volunteer Day',
          lastContact: '2025-10-22',
          interests: ['Content Strategy', 'Sustainability', 'Gardening']
        }
      ];
      setAttendees(sampleAttendees);
      localStorage.setItem('eventAttendees', JSON.stringify(sampleAttendees));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('communityEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('eventAttendees', JSON.stringify(attendees));
  }, [attendees]);

  const addEvent = () => {
    const newEvent: CommunityEvent = {
      id: Date.now().toString(),
      name: '',
      type: 'meetup',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      location: '',
      status: 'interested',
      cost: 0,
      notes: '',
    };
    setEvents([...events, newEvent]);
    toast.success('Event added');
  };

  const updateEvent = (id: string, updates: Partial<CommunityEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
    toast.success('Event updated');
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success('Event deleted');
  };

  const addAttendee = () => {
    const newAttendee: Attendee = {
      id: Date.now().toString(),
      name: '',
      eventsAttended: [],
      connectionStrength: 3,
      tags: [],
      notes: '',
      metAt: events.length > 0 ? events[0].name : '',
    };
    setAttendees([...attendees, newAttendee]);
    toast.success('Contact added');
  };

  const updateAttendee = (id: string, updates: Partial<Attendee>) => {
    setAttendees(attendees.map(a => a.id === id ? { ...a, ...updates } : a));
    toast.success('Contact updated');
  };

  const deleteAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id));
    toast.success('Contact deleted');
  };

  const upcomingEvents = events.filter(e => e.status === 'registered' || e.status === 'attending').length;
  const attendedEvents = events.filter(e => e.status === 'attended').length;
  const totalCost = events.filter(e => e.status === 'attended' || e.status === 'attending').reduce((sum, e) => sum + e.cost, 0);

  // Get all unique tags from attendees
  const allTags = Array.from(new Set(attendees.flatMap(a => a.tags)));

  // Filter attendees based on search and filters
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = searchQuery === '' ||
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = filterTag === 'all' || attendee.tags.includes(filterTag);
    const matchesStrength = filterStrength === 0 || attendee.connectionStrength >= filterStrength;

    return matchesSearch && matchesTag && matchesStrength;
  });

  // Sort attendees by connection strength (highest first)
  const sortedAttendees = [...filteredAttendees].sort((a, b) => b.connectionStrength - a.connectionStrength);

  const getConnectionLabel = (strength: number) => {
    switch (strength) {
      case 5: return 'Close Friend';
      case 4: return 'Good Friend';
      case 3: return 'Regular Contact';
      case 2: return 'Acquaintance';
      case 1: return 'Just Met';
      default: return 'Unknown';
    }
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'friend': 'bg-orange-100 text-orange-700 border-orange-200',
      'colleague': 'bg-amber-100 text-amber-700 border-amber-200',
      'mentor': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'acquaintance': 'bg-orange-50 text-orange-600 border-orange-100',
      'organizer': 'bg-orange-200 text-orange-800 border-orange-300',
      'volunteer': 'bg-amber-200 text-amber-800 border-amber-300',
      'tech-enthusiast': 'bg-yellow-200 text-yellow-800 border-yellow-300',
      'entrepreneur': 'bg-orange-300 text-orange-900 border-orange-400',
      'freelancer': 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[tag] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Community Events Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{events.length}</div>
            <div className="text-xs opacity-90">Total</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{upcomingEvents}</div>
            <div className="text-xs opacity-90">Upcoming</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Check className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{attendedEvents}</div>
            <div className="text-xs opacity-90">Attended</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{attendees.length}</div>
            <div className="text-xs opacity-90">People Met</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'attendees', label: 'People Met', icon: Users },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'events' && (
          <div className="space-y-4">
            <button
              onClick={addEvent}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-amber-700 transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Event</span>
            </button>
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No events yet. Discover your community!</p>
              </div>
            ) : (
              events.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()).map(event => (
                <div
                  key={event.id}
                  className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                    event.status === 'attended'
                      ? 'border-green-500'
                      : event.status === 'attending' || event.status === 'registered'
                      ? 'border-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={event.name}
                      onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                      placeholder="Event name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none flex-1 mr-2"
                    />
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={event.type}
                      onChange={(e) => updateEvent(event.id, { type: e.target.value as CommunityEvent['type'] })}
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    >
                      <option value="meetup">Meetup</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="social">Social</option>
                      <option value="networking">Networking</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={event.status}
                      onChange={(e) => updateEvent(event.id, { status: e.target.value as CommunityEvent['status'] })}
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    >
                      <option value="interested">Interested</option>
                      <option value="registered">Registered</option>
                      <option value="attending">Attending</option>
                      <option value="attended">Attended</option>
                      <option value="missed">Missed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="time"
                      value={event.time}
                      onChange={(e) => updateEvent(event.id, { time: e.target.value })}
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => updateEvent(event.id, { location: e.target.value })}
                      placeholder="Location..."
                      className="col-span-2 text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={event.cost}
                      onChange={(e) => updateEvent(event.id, { cost: parseFloat(e.target.value) || 0 })}
                      placeholder="Cost..."
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="text"
                      value={event.organizer || ''}
                      onChange={(e) => updateEvent(event.id, { organizer: e.target.value })}
                      placeholder="Organizer..."
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <textarea
                    value={event.notes}
                    onChange={(e) => updateEvent(event.id, { notes: e.target.value })}
                    placeholder="Notes, parking info..."
                    className="w-full text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'attendees' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, company, email..."
                  className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilterTag('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    filterTag === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                      filterTag === tag
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Min. Connection:</span>
                <div className="flex gap-1">
                  {[0, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setFilterStrength(level)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        filterStrength === level
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level === 0 ? 'All' : `${level}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={addAttendee}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-amber-700 transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Contact</span>
            </button>

            {sortedAttendees.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No contacts found. Start networking at events!</p>
              </div>
            ) : (
              sortedAttendees.map(attendee => (
                <div
                  key={attendee.id}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={attendee.name}
                        onChange={(e) => updateAttendee(attendee.id, { name: e.target.value })}
                        placeholder="Contact name..."
                        className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none w-full mb-1"
                      />
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 cursor-pointer ${
                              star <= attendee.connectionStrength
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-gray-300'
                            }`}
                            onClick={() => updateAttendee(attendee.id, { connectionStrength: star as any })}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          {getConnectionLabel(attendee.connectionStrength)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAttendee(attendee.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="col-span-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-orange-600" />
                      <input
                        type="text"
                        value={attendee.company || ''}
                        onChange={(e) => updateAttendee(attendee.id, { company: e.target.value })}
                        placeholder="Company..."
                        className="flex-1 text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={attendee.role || ''}
                        onChange={(e) => updateAttendee(attendee.id, { role: e.target.value })}
                        placeholder="Role/Title..."
                        className="w-full text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-600" />
                      <input
                        type="email"
                        value={attendee.email || ''}
                        onChange={(e) => updateAttendee(attendee.id, { email: e.target.value })}
                        placeholder="Email..."
                        className="flex-1 text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <input
                        type="tel"
                        value={attendee.phone || ''}
                        onChange={(e) => updateAttendee(attendee.id, { phone: e.target.value })}
                        placeholder="Phone..."
                        className="flex-1 text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={attendee.metAt}
                        onChange={(e) => updateAttendee(attendee.id, { metAt: e.target.value })}
                        placeholder="Met at..."
                        className="w-full text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <input
                      type="date"
                      value={attendee.lastContact || ''}
                      onChange={(e) => updateAttendee(attendee.id, { lastContact: e.target.value })}
                      placeholder="Last contact..."
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                    <input
                      type="text"
                      value={attendee.linkedin || ''}
                      onChange={(e) => updateAttendee(attendee.id, { linkedin: e.target.value })}
                      placeholder="LinkedIn..."
                      className="text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Tags:</span>
                    </div>
                    <input
                      type="text"
                      value={attendee.tags.join(', ')}
                      onChange={(e) => updateAttendee(attendee.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                      placeholder="friend, colleague, mentor..."
                      className="w-full text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {attendee.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Notes:</span>
                    </div>
                    <textarea
                      value={attendee.notes}
                      onChange={(e) => updateAttendee(attendee.id, { notes: e.target.value })}
                      placeholder="Notes about this person, conversations, interests..."
                      className="w-full text-sm bg-orange-50 px-3 py-2 rounded border border-orange-200 focus:border-orange-500 outline-none"
                      rows={3}
                    />
                  </div>

                  {attendee.eventsAttended.length > 0 && (
                    <div className="pt-3 border-t border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Events together ({attendee.eventsAttended.length}):
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {attendee.eventsAttended.map((event, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
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
              <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Event Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    Total Events:
                  </span>
                  <span className="font-semibold text-orange-700">{events.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Upcoming Events:
                  </span>
                  <span className="font-semibold text-orange-700">{upcomingEvents}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Events Attended:
                  </span>
                  <span className="font-semibold text-green-700">{attendedEvents}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    People Met:
                  </span>
                  <span className="font-semibold text-orange-700">{attendees.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold text-orange-700">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Network Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
                    Close Friends (5 stars):
                  </span>
                  <span className="font-semibold text-orange-700">
                    {attendees.filter(a => a.connectionStrength === 5).length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    Good Friends (4 stars):
                  </span>
                  <span className="font-semibold text-orange-700">
                    {attendees.filter(a => a.connectionStrength === 4).length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-orange-100">
                  <span className="text-gray-600">Regular Contacts (3 stars):</span>
                  <span className="font-semibold text-orange-700">
                    {attendees.filter(a => a.connectionStrength === 3).length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Acquaintances (1-2 stars):</span>
                  <span className="font-semibold text-orange-700">
                    {attendees.filter(a => a.connectionStrength <= 2).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Event Types
              </h3>
              <div className="space-y-2">
                {['meetup', 'workshop', 'conference', 'social', 'networking', 'cultural', 'sports', 'volunteer', 'other'].map(type => {
                  const count = events.filter(e => e.type === type).length;
                  if (count === 0) return null;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 capitalize">{type}</span>
                          <span className="text-sm font-medium text-orange-700">{count}</span>
                        </div>
                        <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-600 rounded-full"
                            style={{ width: `${(count / events.length) * 100}%` }}
                          />
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
    </div>
  );
};

export default CommunityEventsHubPage;
