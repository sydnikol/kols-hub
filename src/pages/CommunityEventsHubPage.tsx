import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Trash2, Check } from 'lucide-react';
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
  eventName: string;
  name: string;
  contact?: string;
  connection: 'friend' | 'colleague' | 'acquaintance' | 'new-connection';
  notes: string;
}

const CommunityEventsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'stats'>('events');
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem('communityEvents');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    const savedAttendees = localStorage.getItem('eventAttendees');
    if (savedAttendees) setAttendees(JSON.parse(savedAttendees));
  }, []);

  useEffect(() => { localStorage.setItem('communityEvents', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('eventAttendees', JSON.stringify(attendees)); }, [attendees]);

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

  const upcomingEvents = events.filter(e => e.status === 'registered' || e.status === 'attending').length;
  const attendedEvents = events.filter(e => e.status === 'attended').length;
  const totalCost = events.filter(e => e.status === 'attended' || e.status === 'attending').reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
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
            { id: 'stats', label: 'Stats', icon: MapPin },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'events' && (
          <div className="space-y-4">
            <button onClick={addEvent} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
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
                <div key={event.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${event.status === 'attended' ? 'border-green-500' : event.status === 'attending' || event.status === 'registered' ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input type="text" value={event.name} onChange={(e) => updateEvent(event.id, { name: e.target.value })} placeholder="Event name..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2" />
                    <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={event.type} onChange={(e) => updateEvent(event.id, { type: e.target.value as CommunityEvent['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none">
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
                    <select value={event.status} onChange={(e) => updateEvent(event.id, { status: e.target.value as CommunityEvent['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none">
                      <option value="interested">Interested</option>
                      <option value="registered">Registered</option>
                      <option value="attending">Attending</option>
                      <option value="attended">Attended</option>
                      <option value="missed">Missed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <input type="date" value={event.date} onChange={(e) => updateEvent(event.id, { date: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    <input type="time" value={event.time} onChange={(e) => updateEvent(event.id, { time: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    <input type="text" value={event.location} onChange={(e) => updateEvent(event.id, { location: e.target.value })} placeholder="Location..." className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    <input type="number" step="0.01" value={event.cost} onChange={(e) => updateEvent(event.id, { cost: parseFloat(e.target.value) || 0 })} placeholder="Cost..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                    <input type="text" value={event.organizer || ''} onChange={(e) => updateEvent(event.id, { organizer: e.target.value })} placeholder="Organizer..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
                  </div>
                  <textarea value={event.notes} onChange={(e) => updateEvent(event.id, { notes: e.target.value })} placeholder="Notes, parking info..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">Event Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events:</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming Events:</span>
                  <span className="font-semibold">{upcomingEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Attended:</span>
                  <span className="font-semibold">{attendedEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">People Met:</span>
                  <span className="font-semibold">{attendees.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityEventsHubPage;
