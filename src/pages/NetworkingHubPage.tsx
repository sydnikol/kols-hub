import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Briefcase, TrendingUp, Plus, Trash2, Star } from 'lucide-react';
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
  type: 'conference' | 'meetup' | 'workshop' | 'happy-hour' | 'online' | 'other';
  date: string;
  contactsMade: number;
  followUps: number;
  value: number; // 1-5
  notes: string;
}

interface FollowUp {
  id: string;
  contactName: string;
  type: 'email' | 'call' | 'coffee' | 'linkedin' | 'other';
  dueDate: string;
  status: 'pending' | 'completed' | 'scheduled';
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

const NetworkingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'events' | 'followups' | 'stats'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  useEffect(() => {
    const savedContacts = localStorage.getItem('networkingContacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    const savedEvents = localStorage.getItem('networkingEvents');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    const savedFollowUps = localStorage.getItem('networkingFollowUps');
    if (savedFollowUps) setFollowUps(JSON.parse(savedFollowUps));
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
    toast.success('Contact updated');
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success('Contact deleted');
  };

  const strongConnections = contacts.filter(c => c.strength >= 4).length;
  const pendingFollowUps = followUps.filter(f => f.status === 'pending').length;
  const industries = new Set(contacts.map(c => c.industry)).size;

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
            <div className="text-xl font-bold">{industries}</div>
            <div className="text-xs opacity-90">Industries</div>
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
            { id: 'events', label: 'Events', icon: Briefcase },
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

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-600">Networking Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Contacts:</span>
                  <span className="font-semibold">{contacts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Strong Connections:</span>
                  <span className="font-semibold">{strongConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Industries:</span>
                  <span className="font-semibold">{industries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Networking Events:</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Follow-ups:</span>
                  <span className="font-semibold">{pendingFollowUps}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkingHubPage;
