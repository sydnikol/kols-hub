import React, { useState, useEffect } from 'react';
import { Users, Battery, Calendar, Plus, X, Trash2, Heart, MessageCircle, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Friend {
  id: string;
  name: string;
  relationship: string;
  howMet: string;
  interests: string[];
  lastContact: string;
  contactFrequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
  notes: string;
  starred: boolean;
  interactions: Interaction[];
  createdAt: number;
}

interface Interaction {
  id: string;
  date: string;
  type: 'hangout' | 'call' | 'text' | 'event' | 'other';
  quality: number; // 1-5
  notes: string;
  createdAt: number;
}

interface SocialBatteryEntry {
  id: string;
  date: string;
  level: number; // 0-100
  mood: string;
  activities: string[];
  rechargeActivities: string[];
  notes: string;
  createdAt: number;
}

interface SocialEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  type: 'party' | 'gathering' | 'dinner' | 'activity' | 'online' | 'other';
  energyLevel: 'low' | 'medium' | 'high'; // expected energy requirement
  notes: string;
  rsvp: 'yes' | 'no' | 'maybe' | 'pending';
  reminder: boolean;
  createdAt: number;
}

type TabType = 'overview' | 'friends' | 'battery' | 'events';

const moodOptions = ['😫', '😔', '😐', '🙂', '😊', '🎉'];

export default function SocialConnectionHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [batteryLog, setBatteryLog] = useState<SocialBatteryEntry[]>([]);
  const [events, setEvents] = useState<SocialEvent[]>([]);

  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isAddingBattery, setIsAddingBattery] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [addingInteractionFor, setAddingInteractionFor] = useState<string | null>(null);

  // Friend form
  const [friendForm, setFriendForm] = useState({
    name: '',
    relationship: '',
    howMet: '',
    lastContact: new Date().toISOString().split('T')[0],
    contactFrequency: 'weekly' as Friend['contactFrequency'],
    notes: '',
  });
  const [friendInterests, setFriendInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  // Interaction form
  const [interactionForm, setInteractionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'hangout' as Interaction['type'],
    quality: 3,
    notes: '',
  });

  // Battery form
  const [batteryForm, setBatteryForm] = useState({
    date: new Date().toISOString().split('T')[0],
    level: 50,
    mood: '3',
    notes: '',
  });
  const [batteryActivities, setBatteryActivities] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState('');
  const [rechargeActivities, setRechargeActivities] = useState<string[]>([]);
  const [rechargeInput, setRechargeInput] = useState('');

  // Event form
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'gathering' as SocialEvent['type'],
    energyLevel: 'medium' as SocialEvent['energyLevel'],
    rsvp: 'pending' as SocialEvent['rsvp'],
    reminder: true,
    notes: '',
  });
  const [eventAttendees, setEventAttendees] = useState<string[]>([]);
  const [attendeeInput, setAttendeeInput] = useState('');

  useEffect(() => {
    const savedFriends = localStorage.getItem('socialFriends');
    const savedBattery = localStorage.getItem('socialBattery');
    const savedEvents = localStorage.getItem('socialEvents');
    if (savedFriends) setFriends(JSON.parse(savedFriends));
    if (savedBattery) setBatteryLog(JSON.parse(savedBattery));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  useEffect(() => {
    localStorage.setItem('socialFriends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('socialBattery', JSON.stringify(batteryLog));
  }, [batteryLog]);

  useEffect(() => {
    localStorage.setItem('socialEvents', JSON.stringify(events));
  }, [events]);

  const handleFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendForm.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const newFriend: Friend = {
      id: Date.now().toString(),
      ...friendForm,
      interests: friendInterests,
      starred: false,
      interactions: [],
      createdAt: Date.now(),
    };

    setFriends([...friends, newFriend]);
    setFriendForm({ name: '', relationship: '', howMet: '', lastContact: new Date().toISOString().split('T')[0], contactFrequency: 'weekly', notes: '' });
    setFriendInterests([]);
    setIsAddingFriend(false);
    toast.success('Friend added!');
  };

  const handleInteractionSubmit = (e: React.FormEvent, friendId: string) => {
    e.preventDefault();

    const newInteraction: Interaction = {
      id: Date.now().toString(),
      ...interactionForm,
      createdAt: Date.now(),
    };

    setFriends(friends.map(f => {
      if (f.id === friendId) {
        return {
          ...f,
          interactions: [...f.interactions, newInteraction],
          lastContact: interactionForm.date
        };
      }
      return f;
    }));

    setInteractionForm({ date: new Date().toISOString().split('T')[0], type: 'hangout', quality: 3, notes: '' });
    setAddingInteractionFor(null);
    toast.success('Interaction logged!');
  };

  const handleBatterySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: SocialBatteryEntry = {
      id: Date.now().toString(),
      ...batteryForm,
      activities: batteryActivities,
      rechargeActivities,
      createdAt: Date.now(),
    };

    setBatteryLog([...batteryLog, newEntry]);
    setBatteryForm({ date: new Date().toISOString().split('T')[0], level: 50, mood: '3', notes: '' });
    setBatteryActivities([]);
    setRechargeActivities([]);
    setIsAddingBattery(false);
    toast.success('Battery entry logged!');
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    const newEvent: SocialEvent = {
      id: Date.now().toString(),
      ...eventForm,
      attendees: eventAttendees,
      createdAt: Date.now(),
    };

    setEvents([...events, newEvent]);
    setEventForm({ title: '', date: '', time: '', location: '', type: 'gathering', energyLevel: 'medium', rsvp: 'pending', reminder: true, notes: '' });
    setEventAttendees([]);
    setIsAddingEvent(false);
    toast.success('Event added!');
  };

  const toggleStarFriend = (id: string) => {
    setFriends(friends.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
  };

  const updateEventRSVP = (id: string, rsvp: SocialEvent['rsvp']) => {
    setEvents(events.map(e => e.id === id ? { ...e, rsvp } : e));
  };

  const deleteFriend = (id: string) => {
    if (confirm('Delete this friend?')) {
      setFriends(friends.filter(f => f.id !== id));
      toast.success('Friend deleted');
    }
  };

  const deleteBatteryEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      setBatteryLog(batteryLog.filter(e => e.id !== id));
      toast.success('Entry deleted');
    }
  };

  const deleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
      toast.success('Event deleted');
    }
  };

  const addInterest = () => {
    if (!interestInput.trim() || friendInterests.includes(interestInput.trim())) return;
    setFriendInterests([...friendInterests, interestInput.trim()]);
    setInterestInput('');
  };

  const addActivity = () => {
    if (!activityInput.trim() || batteryActivities.includes(activityInput.trim())) return;
    setBatteryActivities([...batteryActivities, activityInput.trim()]);
    setActivityInput('');
  };

  const addRecharge = () => {
    if (!rechargeInput.trim() || rechargeActivities.includes(rechargeInput.trim())) return;
    setRechargeActivities([...rechargeActivities, rechargeInput.trim()]);
    setRechargeInput('');
  };

  const addAttendee = () => {
    if (!attendeeInput.trim() || eventAttendees.includes(attendeeInput.trim())) return;
    setEventAttendees([...eventAttendees, attendeeInput.trim()]);
    setAttendeeInput('');
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Users },
    { id: 'friends' as TabType, label: 'Friends', icon: Heart },
    { id: 'battery' as TabType, label: 'Social Battery', icon: Battery },
    { id: 'events' as TabType, label: 'Events', icon: Calendar },
  ];

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-300';
      case 'medium': return 'bg-orange-500/20 text-orange-300';
      case 'high': return 'bg-red-500/20 text-red-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  const getRSVPColor = (rsvp: string) => {
    switch (rsvp) {
      case 'yes': return 'bg-green-500/20 text-green-300';
      case 'no': return 'bg-red-500/20 text-red-300';
      case 'maybe': return 'bg-orange-500/20 text-orange-300';
      case 'pending': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  const averageBattery = batteryLog.length > 0 ? batteryLog.reduce((sum, e) => sum + e.level, 0) / batteryLog.length : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Social Connection Hub
            </h1>
          </div>
          <p className="text-blue-400">
            Nurture friendships, manage your social energy, plan meaningful connections
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-blue-900/20 p-2 rounded-xl border border-blue-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                      : 'bg-blue-900/20 text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
                  <Heart className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{friends.length}</h3>
                  <p className="text-blue-200/70">Friends Tracked</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/30 to-indigo-900/30 p-6 rounded-xl border border-cyan-500/30">
                  <Battery className="w-8 h-8 text-cyan-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{averageBattery.toFixed(0)}%</h3>
                  <p className="text-cyan-200/70">Avg Social Battery</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 p-6 rounded-xl border border-indigo-500/30">
                  <Calendar className="w-8 h-8 text-indigo-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{events.filter(e => e.rsvp === 'yes').length}</h3>
                  <p className="text-indigo-200/70">Upcoming Events</p>
                </div>
              </div>

              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-300 mb-3">About Social Connection Hub</h3>
                <p className="text-blue-200 mb-3">
                  Meaningful connections are vital for mental health and wellbeing. This hub helps you maintain friendships,
                  understand your social energy patterns, and plan social activities that work for you.
                </p>
                <div className="space-y-2 text-blue-100">
                  <p><strong>Friends:</strong> Track connections, log interactions, note shared interests</p>
                  <p><strong>Social Battery:</strong> Monitor your social energy levels and identify recharge activities</p>
                  <p><strong>Events:</strong> Plan social gatherings with energy-aware RSVP management</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Heart className="w-7 h-7 text-blue-400" />
                    Friend Tracker
                  </h2>
                  <p className="text-blue-200/70 mt-1">{friends.length} friends</p>
                </div>
                <button
                  onClick={() => setIsAddingFriend(!isAddingFriend)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center gap-2"
                >
                  {isAddingFriend ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingFriend ? 'Cancel' : 'Add Friend'}
                </button>
              </div>

              {isAddingFriend && (
                <form onSubmit={handleFriendSubmit} className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={friendForm.name}
                      onChange={(e) => setFriendForm({ ...friendForm, name: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="text"
                      value={friendForm.relationship}
                      onChange={(e) => setFriendForm({ ...friendForm, relationship: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Relationship (e.g., college friend, coworker)"
                    />
                    <input
                      type="text"
                      value={friendForm.howMet}
                      onChange={(e) => setFriendForm({ ...friendForm, howMet: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="How you met"
                    />
                    <select
                      value={friendForm.contactFrequency}
                      onChange={(e) => setFriendForm({ ...friendForm, contactFrequency: e.target.value as Friend['contactFrequency'] })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="daily">Contact Daily</option>
                      <option value="weekly">Contact Weekly</option>
                      <option value="monthly">Contact Monthly</option>
                      <option value="occasional">Contact Occasionally</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInterest();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Add shared interests..."
                    />
                    <button type="button" onClick={addInterest} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {friendInterests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {friendInterests.map(interest => (
                        <span key={interest} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm flex items-center gap-2">
                          {interest}
                          <button type="button" onClick={() => setFriendInterests(friendInterests.filter(i => i !== interest))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={friendForm.notes}
                    onChange={(e) => setFriendForm({ ...friendForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 min-h-[80px]"
                    placeholder="Notes about this friendship..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all font-medium"
                  >
                    Add Friend
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {friends.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/20">
                    <Heart className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                    <p className="text-blue-200/70">Add friends to start tracking connections!</p>
                  </div>
                ) : (
                  friends.sort((a, b) => {
                    if (a.starred && !b.starred) return -1;
                    if (!a.starred && b.starred) return 1;
                    return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
                  }).map(friend => (
                    <div key={friend.id} className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-5 border border-blue-500/20 hover:border-blue-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{friend.name}</h3>
                          {friend.relationship && <p className="text-blue-300/70 text-sm">{friend.relationship}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toggleStarFriend(friend.id)} className={`p-1 rounded ${friend.starred ? 'text-blue-400' : 'text-blue-600 hover:text-blue-400'}`}>
                            <Star className={`w-5 h-5 ${friend.starred ? 'fill-current' : ''}`} />
                          </button>
                          <button onClick={() => deleteFriend(friend.id)} className="p-1 text-red-300 hover:text-red-200">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {friend.howMet && <p className="text-blue-200/70 text-sm mb-2">Met: {friend.howMet}</p>}
                      <p className="text-blue-200/70 text-sm mb-2">Last contact: {new Date(friend.lastContact).toLocaleDateString()}</p>

                      {friend.interests.length > 0 && (
                        <div className="mb-3">
                          <p className="text-blue-300 text-sm font-medium mb-1">Shared Interests:</p>
                          <div className="flex flex-wrap gap-1">
                            {friend.interests.map(interest => (
                              <span key={interest} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-xs">{interest}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {friend.notes && <p className="text-blue-200/70 text-sm mb-3 italic">{friend.notes}</p>}

                      {friend.interactions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-blue-300 text-sm font-medium mb-2">Recent Interactions:</p>
                          <div className="space-y-2">
                            {friend.interactions.slice(-3).reverse().map(interaction => (
                              <div key={interaction.id} className="bg-black/20 p-2 rounded text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-blue-200">{interaction.type}</span>
                                  <span className="text-blue-300/70">{new Date(interaction.date).toLocaleDateString()}</span>
                                  <span>{'⭐'.repeat(interaction.quality)}</span>
                                </div>
                                {interaction.notes && <p className="text-blue-200/70 text-xs italic">{interaction.notes}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {addingInteractionFor === friend.id ? (
                        <form onSubmit={(e) => handleInteractionSubmit(e, friend.id)} className="space-y-3 bg-black/20 p-3 rounded">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={interactionForm.date}
                              onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })}
                              className="bg-black/40 border border-blue-500/30 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-400"
                            />
                            <select
                              value={interactionForm.type}
                              onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value as Interaction['type'] })}
                              className="bg-black/40 border border-blue-500/30 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-400"
                            >
                              <option value="hangout">Hangout</option>
                              <option value="call">Call</option>
                              <option value="text">Text</option>
                              <option value="event">Event</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-blue-300 text-xs mb-1 block">Quality: {interactionForm.quality}/5</label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={interactionForm.quality}
                              onChange={(e) => setInteractionForm({ ...interactionForm, quality: parseInt(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <textarea
                            value={interactionForm.notes}
                            onChange={(e) => setInteractionForm({ ...interactionForm, notes: e.target.value })}
                            className="w-full bg-black/40 border border-blue-500/30 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-400"
                            placeholder="Notes..."
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button type="submit" className="flex-1 py-1 bg-blue-500/30 text-blue-300 rounded text-sm hover:bg-blue-500/40">
                              Save
                            </button>
                            <button type="button" onClick={() => setAddingInteractionFor(null)} className="flex-1 py-1 bg-red-500/30 text-red-300 rounded text-sm hover:bg-red-500/40">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setAddingInteractionFor(friend.id)}
                          className="w-full py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Log Interaction
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'battery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Battery className="w-7 h-7 text-cyan-400" />
                    Social Battery
                  </h2>
                  <p className="text-cyan-200/70 mt-1">{batteryLog.length} entries logged</p>
                </div>
                <button
                  onClick={() => setIsAddingBattery(!isAddingBattery)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2"
                >
                  {isAddingBattery ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingBattery ? 'Cancel' : 'Log Battery'}
                </button>
              </div>

              {isAddingBattery && (
                <form onSubmit={handleBatterySubmit} className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/20 space-y-4">
                  <input
                    type="date"
                    value={batteryForm.date}
                    onChange={(e) => setBatteryForm({ ...batteryForm, date: e.target.value })}
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />

                  <div>
                    <label className="text-cyan-300 text-sm mb-2 block">Social Battery Level: {batteryForm.level}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={batteryForm.level}
                      onChange={(e) => setBatteryForm({ ...batteryForm, level: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-cyan-200/70 text-xs mt-1">
                      <span>Empty</span>
                      <span>Full</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-cyan-300 text-sm mb-2 block">How are you feeling?</label>
                    <div className="flex gap-2">
                      {moodOptions.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setBatteryForm({ ...batteryForm, mood: idx.toString() })}
                          className={`text-3xl p-3 rounded-lg transition-all ${
                            batteryForm.mood === idx.toString()
                              ? 'bg-cyan-500/30 scale-110'
                              : 'bg-black/20 hover:bg-cyan-500/20'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activityInput}
                      onChange={(e) => setActivityInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addActivity();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="What drained your battery?"
                    />
                    <button type="button" onClick={addActivity} className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {batteryActivities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {batteryActivities.map(activity => (
                        <span key={activity} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center gap-2">
                          - {activity}
                          <button type="button" onClick={() => setBatteryActivities(batteryActivities.filter(a => a !== activity))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rechargeInput}
                      onChange={(e) => setRechargeInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRecharge();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="What recharged your battery?"
                    />
                    <button type="button" onClick={addRecharge} className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {rechargeActivities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {rechargeActivities.map(activity => (
                        <span key={activity} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm flex items-center gap-2">
                          + {activity}
                          <button type="button" onClick={() => setRechargeActivities(rechargeActivities.filter(a => a !== activity))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={batteryForm.notes}
                    onChange={(e) => setBatteryForm({ ...batteryForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 min-h-[80px]"
                    placeholder="Additional notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all font-medium"
                  >
                    Log Battery
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {batteryLog.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20">
                    <Battery className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
                    <p className="text-cyan-200/70">Start logging your social battery levels!</p>
                  </div>
                ) : (
                  batteryLog.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                    <div key={entry.id} className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-cyan-300 text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                            <span className="text-3xl">{moodOptions[parseInt(entry.mood)]}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-black/40 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  entry.level >= 70 ? 'bg-green-500' : entry.level >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${entry.level}%` }}
                              />
                            </div>
                            <span className="text-cyan-300 font-bold">{entry.level}%</span>
                          </div>
                        </div>
                        <button onClick={() => deleteBatteryEntry(entry.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {entry.activities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-cyan-300 text-sm font-medium mb-1">Draining:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.activities.map(activity => (
                              <span key={activity} className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs">- {activity}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.rechargeActivities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-cyan-300 text-sm font-medium mb-1">Recharging:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.rechargeActivities.map(activity => (
                              <span key={activity} className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">+ {activity}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.notes && <p className="text-cyan-200/70 text-sm italic">{entry.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Calendar className="w-7 h-7 text-indigo-400" />
                    Social Events
                  </h2>
                  <p className="text-indigo-200/70 mt-1">{events.length} events</p>
                </div>
                <button
                  onClick={() => setIsAddingEvent(!isAddingEvent)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-500 hover:to-blue-500 transition-all flex items-center gap-2"
                >
                  {isAddingEvent ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingEvent ? 'Cancel' : 'Add Event'}
                </button>
              </div>

              {isAddingEvent && (
                <form onSubmit={handleEventSubmit} className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl p-6 border border-indigo-500/20 space-y-4">
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Event title"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                    />
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                    />
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Location"
                    />
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as SocialEvent['type'] })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                    >
                      <option value="gathering">Gathering</option>
                      <option value="party">Party</option>
                      <option value="dinner">Dinner</option>
                      <option value="activity">Activity</option>
                      <option value="online">Online</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-indigo-300 text-sm mb-2 block">Energy Required</label>
                      <select
                        value={eventForm.energyLevel}
                        onChange={(e) => setEventForm({ ...eventForm, energyLevel: e.target.value as SocialEvent['energyLevel'] })}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-indigo-300 text-sm mb-2 block">RSVP</label>
                      <select
                        value={eventForm.rsvp}
                        onChange={(e) => setEventForm({ ...eventForm, rsvp: e.target.value as SocialEvent['rsvp'] })}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      >
                        <option value="pending">Pending</option>
                        <option value="yes">Yes</option>
                        <option value="maybe">Maybe</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={attendeeInput}
                      onChange={(e) => setAttendeeInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAttendee();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Add attendee..."
                    />
                    <button type="button" onClick={addAttendee} className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {eventAttendees.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {eventAttendees.map(attendee => (
                        <span key={attendee} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2">
                          {attendee}
                          <button type="button" onClick={() => setEventAttendees(eventAttendees.filter(a => a !== attendee))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-indigo-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eventForm.reminder}
                      onChange={(e) => setEventForm({ ...eventForm, reminder: e.target.checked })}
                      className="rounded"
                    />
                    Set reminder
                  </label>

                  <textarea
                    value={eventForm.notes}
                    onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 min-h-[80px]"
                    placeholder="Event notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-500 hover:to-blue-500 transition-all font-medium"
                  >
                    Add Event
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {events.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-indigo-900/20 to-blue-900/20 rounded-xl border border-indigo-500/20">
                    <Calendar className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />
                    <p className="text-indigo-200/70">Plan your social events!</p>
                  </div>
                ) : (
                  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                    <div key={event.id} className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-indigo-300" />
                            <span className="text-indigo-300 text-sm">
                              {new Date(event.date).toLocaleDateString()}
                              {event.time && ` at ${event.time}`}
                            </span>
                          </div>
                          {event.location && (
                            <p className="text-indigo-300/70 text-sm mt-1">{event.location}</p>
                          )}
                        </div>
                        <button onClick={() => deleteEvent(event.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs">{event.type}</span>
                        <span className={`px-2 py-1 rounded text-xs ${getEnergyColor(event.energyLevel)}`}>
                          {event.energyLevel} energy
                        </span>
                        {event.reminder && <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Reminder</span>}
                      </div>

                      {event.attendees.length > 0 && (
                        <div className="mb-3">
                          <p className="text-indigo-300 text-sm font-medium mb-1">Attendees ({event.attendees.length}):</p>
                          <div className="flex flex-wrap gap-1">
                            {event.attendees.map(attendee => (
                              <span key={attendee} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">{attendee}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.notes && <p className="text-indigo-200/70 text-sm mb-3 italic">{event.notes}</p>}

                      <select
                        value={event.rsvp}
                        onChange={(e) => updateEventRSVP(event.id, e.target.value as SocialEvent['rsvp'])}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${getRSVPColor(event.rsvp)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="yes">Going</option>
                        <option value="maybe">Maybe</option>
                        <option value="no">Not Going</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
