import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, Mail, Phone, Calendar, CheckCircle, AlertCircle, Plus, Edit2, Trash2, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface MedicalPortal {
  id: string;
  name: string;
  type: 'patient-portal' | 'insurance' | 'pharmacy' | 'lab' | 'imaging' | 'telehealth' | 'other';
  url: string;
  username?: string;
  lastLogin?: string;
  hasUnreadMessages: boolean;
  hasAppointments: boolean;
  hasLabResults: boolean;
  hasBilling: boolean;
  notes: string;
  starred: boolean;
}

interface HealthcareContact {
  id: string;
  name: string;
  type: 'provider' | 'facility' | 'pharmacy' | 'insurance' | 'emergency' | 'support';
  phone: string;
  email?: string;
  website?: string;
  portalLink?: string;
  hours?: string;
  notes: string;
  priority: number; // 1-5
}

interface MedicalEmail {
  id: string;
  from: string;
  subject: string;
  date: string;
  category: 'appointment' | 'results' | 'billing' | 'prescription' | 'general';
  read: boolean;
  important: boolean;
  notes: string;
}

interface PortalTask {
  id: string;
  portal: string;
  task: string;
  type: 'check-messages' | 'review-results' | 'schedule-appointment' | 'pay-bill' | 'refill-rx' | 'update-info' | 'other';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
}

interface PortalStatus {
  id: string;
  portal: string;
  lastChecked: string;
  newMessages: number;
  newResults: number;
  upcomingAppointments: number;
  outstandingBills: number;
  notes: string;
}

const MedicalPortalsHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portals' | 'contacts' | 'emails' | 'tasks' | 'status'>('portals');
  const [portals, setPortals] = useState<MedicalPortal[]>([]);
  const [contacts, setContacts] = useState<HealthcareContact[]>([]);
  const [emails, setEmails] = useState<MedicalEmail[]>([]);
  const [tasks, setTasks] = useState<PortalTask[]>([]);
  const [statuses, setStatuses] = useState<PortalStatus[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedPortals = localStorage.getItem('medicalPortals');
    const savedContacts = localStorage.getItem('healthcareContacts');
    const savedEmails = localStorage.getItem('medicalEmails');
    const savedTasks = localStorage.getItem('portalTasks');
    const savedStatuses = localStorage.getItem('portalStatuses');

    if (savedPortals) setPortals(JSON.parse(savedPortals));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedEmails) setEmails(JSON.parse(savedEmails));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedStatuses) setStatuses(JSON.parse(savedStatuses));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('medicalPortals', JSON.stringify(portals));
  }, [portals]);

  useEffect(() => {
    localStorage.setItem('healthcareContacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('medicalEmails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('portalTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('portalStatuses', JSON.stringify(statuses));
  }, [statuses]);

  // Add default portals on first load
  useEffect(() => {
    if (portals.length === 0) {
      const defaultPortals: MedicalPortal[] = [
        {
          id: '1',
          name: 'MyChart',
          type: 'patient-portal',
          url: 'https://mychart.com',
          hasUnreadMessages: false,
          hasAppointments: false,
          hasLabResults: false,
          hasBilling: false,
          notes: 'Main patient portal',
          starred: true,
        },
        {
          id: '2',
          name: 'MyUHealth',
          type: 'patient-portal',
          url: 'https://myuhealth.com',
          hasUnreadMessages: false,
          hasAppointments: false,
          hasLabResults: false,
          hasBilling: false,
          notes: 'University Health portal',
          starred: true,
        },
        {
          id: '3',
          name: 'Saint Luke Portal',
          type: 'patient-portal',
          url: 'https://saintlukeskc.org',
          hasUnreadMessages: false,
          hasAppointments: false,
          hasLabResults: false,
          hasBilling: false,
          notes: 'Saint Luke Health System',
          starred: true,
        },
      ];
      setPortals(defaultPortals);
    }
  }, []);

  const addPortal = () => {
    const newPortal: MedicalPortal = {
      id: Date.now().toString(),
      name: '',
      type: 'patient-portal',
      url: '',
      hasUnreadMessages: false,
      hasAppointments: false,
      hasLabResults: false,
      hasBilling: false,
      notes: '',
      starred: false,
    };
    setPortals([...portals, newPortal]);
    toast.success('Portal added');
  };

  const updatePortal = (id: string, updates: Partial<MedicalPortal>) => {
    setPortals(portals.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Portal updated');
  };

  const deletePortal = (id: string) => {
    setPortals(portals.filter(p => p.id !== id));
    toast.success('Portal deleted');
  };

  const addContact = () => {
    const newContact: HealthcareContact = {
      id: Date.now().toString(),
      name: '',
      type: 'provider',
      phone: '',
      notes: '',
      priority: 3,
    };
    setContacts([...contacts, newContact]);
    toast.success('Contact added');
  };

  const updateContact = (id: string, updates: Partial<HealthcareContact>) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Contact updated');
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success('Contact deleted');
  };

  const addEmail = () => {
    const newEmail: MedicalEmail = {
      id: Date.now().toString(),
      from: '',
      subject: '',
      date: new Date().toISOString().split('T')[0],
      category: 'general',
      read: false,
      important: false,
      notes: '',
    };
    setEmails([...emails, newEmail]);
    toast.success('Email logged');
  };

  const updateEmail = (id: string, updates: Partial<MedicalEmail>) => {
    setEmails(emails.map(e => e.id === id ? { ...e, ...updates } : e));
    toast.success('Email updated');
  };

  const deleteEmail = (id: string) => {
    setEmails(emails.filter(e => e.id !== id));
    toast.success('Email deleted');
  };

  const addTask = () => {
    const newTask: PortalTask = {
      id: Date.now().toString(),
      portal: '',
      task: '',
      type: 'check-messages',
      priority: 'medium',
      completed: false,
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added');
  };

  const updateTask = (id: string, updates: Partial<PortalTask>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Task updated');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const addStatus = () => {
    const newStatus: PortalStatus = {
      id: Date.now().toString(),
      portal: '',
      lastChecked: new Date().toISOString().split('T')[0],
      newMessages: 0,
      newResults: 0,
      upcomingAppointments: 0,
      outstandingBills: 0,
      notes: '',
    };
    setStatuses([...statuses, newStatus]);
    toast.success('Status added');
  };

  const updateStatus = (id: string, updates: Partial<PortalStatus>) => {
    setStatuses(statuses.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Status updated');
  };

  const deleteStatus = (id: string) => {
    setStatuses(statuses.filter(s => s.id !== id));
    toast.success('Status deleted');
  };

  const totalPortals = portals.length;
  const unreadMessages = portals.filter(p => p.hasUnreadMessages).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const priorityContacts = contacts.filter(c => c.priority >= 4).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Medical Portals Hub</h1>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Globe className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalPortals}</div>
            <div className="text-xs opacity-90">Portals</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Mail className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{unreadMessages}</div>
            <div className="text-xs opacity-90">Unread</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{pendingTasks}</div>
            <div className="text-xs opacity-90">Tasks</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Phone className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{priorityContacts}</div>
            <div className="text-xs opacity-90">Key Contacts</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'portals', label: 'Portals', icon: Globe },
            { id: 'contacts', label: 'Contacts', icon: Phone },
            { id: 'emails', label: 'Emails', icon: Mail },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
            { id: 'status', label: 'Status', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Portals Tab */}
        {activeTab === 'portals' && (
          <div className="space-y-4">
            <button
              onClick={addPortal}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Portal</span>
            </button>

            {portals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No portals yet. Add your patient portals!</p>
              </div>
            ) : (
              portals.map(portal => (
                <div key={portal.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${portal.starred ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={portal.name}
                      onChange={(e) => updatePortal(portal.id, { name: e.target.value })}
                      placeholder="Portal name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updatePortal(portal.id, { starred: !portal.starred })}
                        className={portal.starred ? 'text-blue-500' : 'text-gray-300'}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                      <button onClick={() => deletePortal(portal.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <select
                      value={portal.type}
                      onChange={(e) => updatePortal(portal.id, { type: e.target.value as MedicalPortal['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="patient-portal">Patient Portal</option>
                      <option value="insurance">Insurance Portal</option>
                      <option value="pharmacy">Pharmacy Portal</option>
                      <option value="lab">Lab Portal</option>
                      <option value="imaging">Imaging Portal</option>
                      <option value="telehealth">Telehealth Portal</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="url"
                      value={portal.url}
                      onChange={(e) => updatePortal(portal.id, { url: e.target.value })}
                      placeholder="Portal URL..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={portal.username || ''}
                      onChange={(e) => updatePortal(portal.id, { username: e.target.value })}
                      placeholder="Username (optional)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {portal.url && (
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center mb-3"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      Open Portal
                    </a>
                  )}

                  <textarea
                    value={portal.notes}
                    onChange={(e) => updatePortal(portal.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2"
                    rows={2}
                  />

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={portal.hasUnreadMessages}
                        onChange={(e) => updatePortal(portal.id, { hasUnreadMessages: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Unread Messages</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={portal.hasAppointments}
                        onChange={(e) => updatePortal(portal.id, { hasAppointments: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Appointments</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={portal.hasLabResults}
                        onChange={(e) => updatePortal(portal.id, { hasLabResults: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">Lab Results</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={portal.hasBilling}
                        onChange={(e) => updatePortal(portal.id, { hasBilling: e.target.checked })}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">Billing</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <button
              onClick={addContact}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Contact</span>
            </button>

            {contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Phone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No contacts yet. Add your healthcare providers!</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                      placeholder="Contact name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteContact(contact.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={contact.type}
                      onChange={(e) => updateContact(contact.id, { type: e.target.value as HealthcareContact['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="provider">Provider</option>
                      <option value="facility">Facility</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="insurance">Insurance</option>
                      <option value="emergency">Emergency</option>
                      <option value="support">Support</option>
                    </select>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                      placeholder="Phone..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="email"
                      value={contact.email || ''}
                      onChange={(e) => updateContact(contact.id, { email: e.target.value })}
                      placeholder="Email (optional)..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="url"
                      value={contact.website || ''}
                      onChange={(e) => updateContact(contact.id, { website: e.target.value })}
                      placeholder="Website (optional)..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="block w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors text-center mb-2"
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Call {contact.name}
                    </a>
                  )}

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Priority: {contact.priority}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateContact(contact.id, { priority: level })}
                          className={`w-10 h-10 rounded ${level <= contact.priority ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={contact.notes}
                    onChange={(e) => updateContact(contact.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Emails Tab */}
        {activeTab === 'emails' && (
          <div className="space-y-4">
            <button
              onClick={addEmail}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Log Medical Email</span>
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <Mail className="w-5 h-5 inline mr-2" />
              Quick access to Gmail for medical correspondence
            </div>

            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center"
            >
              <ExternalLink className="w-4 h-4 inline mr-2" />
              Open Gmail
            </a>

            {emails.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No emails logged yet. Track medical correspondence!</p>
              </div>
            ) : (
              emails.map(email => (
                <div key={email.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${email.important ? 'border-red-500' : email.read ? 'border-gray-300' : 'border-blue-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={email.subject}
                      onChange={(e) => updateEmail(email.id, { subject: e.target.value })}
                      placeholder="Subject..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteEmail(email.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input
                      type="text"
                      value={email.from}
                      onChange={(e) => updateEmail(email.id, { from: e.target.value })}
                      placeholder="From..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="date"
                      value={email.date}
                      onChange={(e) => updateEmail(email.id, { date: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <select
                      value={email.category}
                      onChange={(e) => updateEmail(email.id, { category: e.target.value as MedicalEmail['category'] })}
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="appointment">Appointment</option>
                      <option value="results">Results</option>
                      <option value="billing">Billing</option>
                      <option value="prescription">Prescription</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <textarea
                    value={email.notes}
                    onChange={(e) => updateEmail(email.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none mb-2"
                    rows={2}
                  />

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={email.read}
                        onChange={(e) => updateEmail(email.id, { read: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Read</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={email.important}
                        onChange={(e) => updateEmail(email.id, { important: e.target.checked })}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-gray-700">Important</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <button
              onClick={addTask}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Portal Task</span>
            </button>

            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No tasks yet. Track portal to-dos!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${task.completed ? 'border-green-500' : task.priority === 'urgent' ? 'border-red-500' : 'border-orange-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={task.task}
                      onChange={(e) => updateTask(task.id, { task: e.target.value })}
                      placeholder="Task..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input
                      type="text"
                      value={task.portal}
                      onChange={(e) => updateTask(task.id, { portal: e.target.value })}
                      placeholder="Portal name..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <select
                      value={task.type}
                      onChange={(e) => updateTask(task.id, { type: e.target.value as PortalTask['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="check-messages">Check Messages</option>
                      <option value="review-results">Review Results</option>
                      <option value="schedule-appointment">Schedule Appointment</option>
                      <option value="pay-bill">Pay Bill</option>
                      <option value="refill-rx">Refill Prescription</option>
                      <option value="update-info">Update Info</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={task.priority}
                      onChange={(e) => updateTask(task.id, { priority: e.target.value as PortalTask['priority'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <input
                      type="date"
                      value={task.dueDate || ''}
                      onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                      placeholder="Due date (optional)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Completed</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <button
              onClick={addStatus}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Portal Status</span>
            </button>

            {statuses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No status updates yet. Track portal activity!</p>
              </div>
            ) : (
              statuses.map(status => (
                <div key={status.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={status.portal}
                      onChange={(e) => updateStatus(status.id, { portal: e.target.value })}
                      placeholder="Portal name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteStatus(status.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="date"
                      value={status.lastChecked}
                      onChange={(e) => updateStatus(status.id, { lastChecked: e.target.value })}
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">New Messages</label>
                        <input
                          type="number"
                          value={status.newMessages}
                          onChange={(e) => updateStatus(status.id, { newMessages: parseInt(e.target.value) || 0 })}
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">New Results</label>
                        <input
                          type="number"
                          value={status.newResults}
                          onChange={(e) => updateStatus(status.id, { newResults: parseInt(e.target.value) || 0 })}
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Upcoming Appointments</label>
                        <input
                          type="number"
                          value={status.upcomingAppointments}
                          onChange={(e) => updateStatus(status.id, { upcomingAppointments: parseInt(e.target.value) || 0 })}
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Outstanding Bills</label>
                        <input
                          type="number"
                          value={status.outstandingBills}
                          onChange={(e) => updateStatus(status.id, { outstandingBills: parseInt(e.target.value) || 0 })}
                          className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={status.notes}
                    onChange={(e) => updateStatus(status.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalPortalsHubPage;
