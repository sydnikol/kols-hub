import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, FileText, ClipboardCheck, AlertTriangle, Shield, FolderOpen,
  Plus, Trash2, Edit, Phone, Mail, MapPin, Star, ChevronDown, ChevronRight,
  Clock, Heart, Flag, CheckCircle, XCircle, MessageSquare, Share2, Lock,
  ExternalLink, AlertCircle, Search, Filter, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CARE_TEAM, HEALTHCARE_PROVIDERS, PSYCHOSOCIAL_CONSIDERATIONS } from '../../data/sydney-complete-health-profile';

// ========== INTERFACES ==========
interface Provider {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  facility?: string;
  phone?: string;
  email?: string;
  address?: string;
  manages: string[];
  isPrimary: boolean;
  safetyRating: number; // 1-5 how safe you feel
  behaviorNotes: string[];
  redFlagsNoted: string[];
  lastVisit?: string;
  nextAppointment?: string;
  isFromProfile: boolean;
}

interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  reason: string;
  prepNotes: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  debrief?: AppointmentDebrief;
  followUpTasks: FollowUpTask[];
}

interface AppointmentDebrief {
  whatWasDiscussed: string;
  actionItems: string[];
  emotionalSafetyRating: number; // 1-5
  redFlagsNoted: string[];
  providerBehavior: string;
  overallFeeling: 'safe' | 'neutral' | 'uncomfortable' | 'unsafe';
  notes: string;
  completedAt: string;
}

interface FollowUpTask {
  id: string;
  task: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  appointmentId: string;
  createdAt: string;
}

interface SharedAccess {
  id: string;
  personName: string;
  relationship: string;
  accessLevel: 'full' | 'limited' | 'emergency-only';
  canViewProviders: boolean;
  canViewAppointments: boolean;
  canViewDebriefs: boolean;
  canViewRedFlags: boolean;
  expiresAt?: string;
  notes: string;
  consentGiven: boolean;
  consentDate: string;
}

interface PrepTemplate {
  id: string;
  name: string;
  category: string;
  questions: string[];
  symptomsToReport: string[];
  documentsNeeded: string[];
  selfAdvocacyReminders: string[];
}

// ========== RED FLAG PHRASES ==========
const RED_FLAG_PHRASES = [
  "it's all in your head",
  "you're too young for that",
  "just lose weight",
  "have you tried yoga",
  "you don't look sick",
  "anxiety causes this",
  "you're being dramatic",
  "this isn't that serious",
  "everyone has pain",
  "stop googling symptoms",
  "you're drug seeking",
  "it's just stress",
  "you're fine",
  "nothing is wrong",
  "I don't believe",
  "exaggerating",
  "attention seeking",
  "try to relax",
  "just exercise more",
  "it's normal at your age"
];

// ========== DEFAULT PREP TEMPLATES ==========
const DEFAULT_PREP_TEMPLATES: PrepTemplate[] = [
  {
    id: 'general',
    name: 'General Visit',
    category: 'Primary Care',
    questions: [
      'What are my current treatment goals?',
      'Are there any new treatments I should consider?',
      'What should I monitor between appointments?',
      'When should I follow up?'
    ],
    symptomsToReport: ['Any new symptoms', 'Symptom changes', 'Medication side effects'],
    documentsNeeded: ['Insurance card', 'ID', 'Medication list', 'Previous records if new'],
    selfAdvocacyReminders: [
      'I have the right to take notes during my visit',
      'I can ask for things in writing',
      'I can request time to process information',
      'I can bring a support person'
    ]
  },
  {
    id: 'specialist',
    name: 'Specialist Visit',
    category: 'Specialist',
    questions: [
      'How does this condition interact with my other conditions?',
      'What communication will you have with my other providers?',
      'What are the next diagnostic steps?',
      'What are all my treatment options?'
    ],
    symptomsToReport: ['Specific symptoms related to specialty', 'Timeline of symptoms', 'Triggers identified'],
    documentsNeeded: ['Referral paperwork', 'Imaging/labs', 'List of current providers', 'Symptom journal'],
    selfAdvocacyReminders: [
      'I am the expert on my own body',
      'I can request copies of all records',
      'I can ask for the reasoning behind decisions',
      'I deserve to be believed'
    ]
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    category: 'Mental Health',
    questions: [
      'How is my current treatment working?',
      'Should we adjust any medications?',
      'What coping strategies should I focus on?',
      'What are my crisis resources?'
    ],
    symptomsToReport: ['Mood changes', 'Sleep patterns', 'Anxiety levels', 'Trauma responses'],
    documentsNeeded: ['Mood journal', 'Sleep log', 'Crisis plan'],
    selfAdvocacyReminders: [
      'My feelings are valid',
      'I can set the pace of therapy',
      'I can say if something feels uncomfortable',
      'Healing is not linear'
    ]
  },
  {
    id: 'pain-management',
    name: 'Pain Management',
    category: 'Pain',
    questions: [
      'What is causing my pain?',
      'What are ALL my pain management options?',
      'What is my pain management goal?',
      'How can I best track my pain?'
    ],
    symptomsToReport: ['Pain locations', 'Pain intensity scale', 'What helps/hurts', 'Impact on function'],
    documentsNeeded: ['Pain journal', 'Current medication list', 'Previous treatments tried'],
    selfAdvocacyReminders: [
      'My pain is real',
      'I deserve adequate pain management',
      'I know my body best',
      'Undertreated pain is harmful'
    ]
  }
];

// ========== COMPONENT ==========
const CareTeamCoordinator: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'directory' | 'appointments' | 'prep' | 'debrief' | 'tasks' | 'access' | 'docs'>('directory');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [followUpTasks, setFollowUpTasks] = useState<FollowUpTask[]>([]);
  const [sharedAccess, setSharedAccess] = useState<SharedAccess[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showDebriefForm, setShowDebriefForm] = useState(false);
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['primary']);

  // Form states
  const [providerForm, setProviderForm] = useState<Partial<Provider>>({
    isPrimary: false,
    safetyRating: 3,
    behaviorNotes: [],
    redFlagsNoted: [],
    manages: [],
    isFromProfile: false
  });

  const [appointmentForm, setAppointmentForm] = useState<Partial<Appointment>>({
    status: 'scheduled',
    followUpTasks: []
  });

  const [debriefForm, setDebriefForm] = useState<Partial<AppointmentDebrief>>({
    actionItems: [],
    redFlagsNoted: [],
    emotionalSafetyRating: 3,
    overallFeeling: 'neutral'
  });

  const [accessForm, setAccessForm] = useState<Partial<SharedAccess>>({
    accessLevel: 'limited',
    canViewProviders: true,
    canViewAppointments: true,
    canViewDebriefs: false,
    canViewRedFlags: false,
    consentGiven: false
  });

  const [newListItem, setNewListItem] = useState('');

  // Load from localStorage
  useEffect(() => {
    const storedProviders = localStorage.getItem('care-team-providers');
    const storedAppointments = localStorage.getItem('care-team-appointments');
    const storedTasks = localStorage.getItem('care-team-tasks');
    const storedAccess = localStorage.getItem('care-team-access');

    if (storedProviders) {
      setProviders(JSON.parse(storedProviders));
    } else {
      // Initialize with profile data
      initializeFromProfile();
    }

    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
    if (storedTasks) setFollowUpTasks(JSON.parse(storedTasks));
    if (storedAccess) setSharedAccess(JSON.parse(storedAccess));
  }, []);

  // Initialize providers from profile data
  const initializeFromProfile = () => {
    const profileProviders: Provider[] = [];

    // Add from CARE_TEAM
    CARE_TEAM.forEach((member, index) => {
      profileProviders.push({
        id: `profile_care_${index}`,
        name: member.name,
        role: member.role,
        facility: member.facility || '',
        manages: member.manages || [],
        isPrimary: member.isPrimary || false,
        safetyRating: 3,
        behaviorNotes: [],
        redFlagsNoted: [],
        isFromProfile: true
      });
    });

    // Add from HEALTHCARE_PROVIDERS (avoid duplicates)
    HEALTHCARE_PROVIDERS.forEach((provider, index) => {
      const exists = profileProviders.some(p =>
        p.name.toLowerCase().includes(provider.name.toLowerCase().replace('Dr. ', ''))
      );
      if (!exists) {
        profileProviders.push({
          id: `profile_health_${index}`,
          name: provider.name,
          role: provider.role,
          specialty: provider.specialty,
          facility: provider.clinic || '',
          phone: provider.phone,
          address: provider.address,
          manages: provider.manages || [],
          isPrimary: provider.isPrimary || false,
          safetyRating: 3,
          behaviorNotes: [],
          redFlagsNoted: [],
          isFromProfile: true
        });
      }
    });

    setProviders(profileProviders);
    localStorage.setItem('care-team-providers', JSON.stringify(profileProviders));
  };

  // Save functions
  const saveProviders = (newProviders: Provider[]) => {
    setProviders(newProviders);
    localStorage.setItem('care-team-providers', JSON.stringify(newProviders));
  };

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('care-team-appointments', JSON.stringify(newAppointments));
  };

  const saveTasks = (newTasks: FollowUpTask[]) => {
    setFollowUpTasks(newTasks);
    localStorage.setItem('care-team-tasks', JSON.stringify(newTasks));
  };

  const saveAccess = (newAccess: SharedAccess[]) => {
    setSharedAccess(newAccess);
    localStorage.setItem('care-team-access', JSON.stringify(newAccess));
  };

  // Red flag detection
  const detectRedFlags = (text: string): string[] => {
    const detected: string[] = [];
    const lowerText = text.toLowerCase();
    RED_FLAG_PHRASES.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        detected.push(phrase);
      }
    });
    return detected;
  };

  // Add provider
  const addProvider = () => {
    if (!providerForm.name || !providerForm.role) {
      toast.error('Name and role are required');
      return;
    }

    const newProvider: Provider = {
      id: `provider_${Date.now()}`,
      name: providerForm.name!,
      role: providerForm.role!,
      specialty: providerForm.specialty,
      facility: providerForm.facility,
      phone: providerForm.phone,
      email: providerForm.email,
      address: providerForm.address,
      manages: providerForm.manages || [],
      isPrimary: providerForm.isPrimary || false,
      safetyRating: providerForm.safetyRating || 3,
      behaviorNotes: providerForm.behaviorNotes || [],
      redFlagsNoted: providerForm.redFlagsNoted || [],
      lastVisit: providerForm.lastVisit,
      nextAppointment: providerForm.nextAppointment,
      isFromProfile: false
    };

    saveProviders([...providers, newProvider]);
    setProviderForm({
      isPrimary: false,
      safetyRating: 3,
      behaviorNotes: [],
      redFlagsNoted: [],
      manages: [],
      isFromProfile: false
    });
    setShowProviderForm(false);
    toast.success('Provider added to care team');
  };

  // Update provider
  const updateProvider = (id: string, updates: Partial<Provider>) => {
    const updatedProviders = providers.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    saveProviders(updatedProviders);
  };

  // Delete provider
  const deleteProvider = (id: string) => {
    saveProviders(providers.filter(p => p.id !== id));
    toast.success('Provider removed');
  };

  // Add appointment
  const addAppointment = () => {
    if (!appointmentForm.providerId || !appointmentForm.date) {
      toast.error('Provider and date are required');
      return;
    }

    const provider = providers.find(p => p.id === appointmentForm.providerId);
    const newAppointment: Appointment = {
      id: `appt_${Date.now()}`,
      providerId: appointmentForm.providerId!,
      providerName: provider?.name || 'Unknown Provider',
      date: appointmentForm.date!,
      time: appointmentForm.time || '',
      reason: appointmentForm.reason || '',
      prepNotes: appointmentForm.prepNotes || '',
      status: 'scheduled',
      followUpTasks: []
    };

    saveAppointments([...appointments, newAppointment]);
    setAppointmentForm({ status: 'scheduled', followUpTasks: [] });
    setShowAppointmentForm(false);
    toast.success('Appointment scheduled');
  };

  // Complete debrief
  const completeDebrief = () => {
    if (!selectedAppointment) return;

    // Check for red flags in text fields
    const notesRedFlags = detectRedFlags(debriefForm.providerBehavior || '');
    const allRedFlags = [...(debriefForm.redFlagsNoted || []), ...notesRedFlags];

    const debrief: AppointmentDebrief = {
      whatWasDiscussed: debriefForm.whatWasDiscussed || '',
      actionItems: debriefForm.actionItems || [],
      emotionalSafetyRating: debriefForm.emotionalSafetyRating || 3,
      redFlagsNoted: [...new Set(allRedFlags)],
      providerBehavior: debriefForm.providerBehavior || '',
      overallFeeling: debriefForm.overallFeeling || 'neutral',
      notes: debriefForm.notes || '',
      completedAt: new Date().toISOString()
    };

    const updatedAppointments = appointments.map(a =>
      a.id === selectedAppointment.id
        ? { ...a, status: 'completed' as const, debrief }
        : a
    );
    saveAppointments(updatedAppointments);

    // Update provider with red flags if any
    if (allRedFlags.length > 0) {
      const provider = providers.find(p => p.id === selectedAppointment.providerId);
      if (provider) {
        updateProvider(provider.id, {
          redFlagsNoted: [...new Set([...provider.redFlagsNoted, ...allRedFlags])]
        });
      }
    }

    // Create follow-up tasks from action items
    const newTasks: FollowUpTask[] = (debriefForm.actionItems || []).map(item => ({
      id: `task_${Date.now()}_${Math.random()}`,
      task: item,
      priority: 'medium' as const,
      completed: false,
      appointmentId: selectedAppointment.id,
      createdAt: new Date().toISOString()
    }));

    saveTasks([...followUpTasks, ...newTasks]);

    setDebriefForm({
      actionItems: [],
      redFlagsNoted: [],
      emotionalSafetyRating: 3,
      overallFeeling: 'neutral'
    });
    setShowDebriefForm(false);
    setSelectedAppointment(null);
    toast.success('Visit debrief saved');

    if (allRedFlags.length > 0) {
      toast('Red flags detected and logged', { icon: '🚩' });
    }
  };

  // Add shared access
  const addSharedAccess = () => {
    if (!accessForm.personName || !accessForm.consentGiven) {
      toast.error('Name and consent are required');
      return;
    }

    const newAccess: SharedAccess = {
      id: `access_${Date.now()}`,
      personName: accessForm.personName!,
      relationship: accessForm.relationship || '',
      accessLevel: accessForm.accessLevel || 'limited',
      canViewProviders: accessForm.canViewProviders || false,
      canViewAppointments: accessForm.canViewAppointments || false,
      canViewDebriefs: accessForm.canViewDebriefs || false,
      canViewRedFlags: accessForm.canViewRedFlags || false,
      expiresAt: accessForm.expiresAt,
      notes: accessForm.notes || '',
      consentGiven: true,
      consentDate: new Date().toISOString()
    };

    saveAccess([...sharedAccess, newAccess]);
    setAccessForm({
      accessLevel: 'limited',
      canViewProviders: true,
      canViewAppointments: true,
      canViewDebriefs: false,
      canViewRedFlags: false,
      consentGiven: false
    });
    setShowAccessForm(false);
    toast.success('Access granted');
  };

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    const updatedTasks = followUpTasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updatedTasks);
  };

  // Filter providers
  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const primaryProviders = filteredProviders.filter(p => p.isPrimary);
  const otherProviders = filteredProviders.filter(p => !p.isPrimary);

  // Upcoming appointments
  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled' && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Past appointments needing debrief
  const needsDebrief = appointments.filter(
    a => a.status === 'scheduled' && new Date(a.date) < new Date() && !a.debrief
  );

  // Incomplete tasks
  const incompleteTasks = followUpTasks.filter(t => !t.completed);

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Add to list helper
  const addToList = (field: string, formSetter: any, currentForm: any) => {
    if (!newListItem.trim()) return;
    formSetter({
      ...currentForm,
      [field]: [...(currentForm[field] || []), newListItem]
    });
    setNewListItem('');
  };

  // Safety rating color
  const getSafetyColor = (rating: number) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    if (rating >= 2) return 'text-orange-400';
    return 'text-red-400';
  };

  // Feeling badge
  const getFeelingBadge = (feeling: string) => {
    switch (feeling) {
      case 'safe': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'neutral': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'uncomfortable': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'unsafe': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Care Team Coordinator</h2>
            <p className="text-purple-300 text-sm">Trauma-informed care management</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-black/40 p-3 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-xs font-semibold">Providers</span>
          </div>
          <p className="text-2xl font-bold text-white">{providers.length}</p>
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-xs font-semibold">Upcoming</span>
          </div>
          <p className="text-2xl font-bold text-white">{upcomingAppointments.length}</p>
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-xs font-semibold">Tasks Due</span>
          </div>
          <p className="text-2xl font-bold text-white">{incompleteTasks.length}</p>
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-xs font-semibold">Needs Debrief</span>
          </div>
          <p className="text-2xl font-bold text-white">{needsDebrief.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-purple-500/30 pb-4">
        {[
          { id: 'directory', label: 'Provider Directory', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'prep', label: 'Pre-Visit Prep', icon: FileText },
          { id: 'debrief', label: 'Post-Visit Debrief', icon: ClipboardCheck },
          { id: 'tasks', label: 'Follow-ups', icon: CheckCircle },
          { id: 'access', label: 'Shared Access', icon: Share2 },
          { id: 'docs', label: 'Doc Vault', icon: FolderOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'directory' && (
        <div>
          {/* Search and Add */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search providers..."
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-purple-400/50"
              />
            </div>
            <button
              onClick={() => setShowProviderForm(!showProviderForm)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Provider
            </button>
          </div>

          {/* Add Provider Form */}
          {showProviderForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-purple-500/30 mb-6 space-y-4">
              <h3 className="text-purple-300 font-semibold text-lg">Add New Provider</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={providerForm.name || ''}
                    onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Role *</label>
                  <select
                    value={providerForm.role || ''}
                    onChange={(e) => setProviderForm({ ...providerForm, role: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select role...</option>
                    <option value="Primary Care">Primary Care</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Rheumatology">Rheumatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pain Management">Pain Management</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Therapy">Therapy</option>
                    <option value="Physical Therapy">Physical Therapy</option>
                    <option value="Other Specialist">Other Specialist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Specialty</label>
                  <input
                    type="text"
                    value={providerForm.specialty || ''}
                    onChange={(e) => setProviderForm({ ...providerForm, specialty: e.target.value })}
                    placeholder="POTS, EDS, etc."
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Facility</label>
                  <input
                    type="text"
                    value={providerForm.facility || ''}
                    onChange={(e) => setProviderForm({ ...providerForm, facility: e.target.value })}
                    placeholder="Hospital/Clinic name"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={providerForm.phone || ''}
                    onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={providerForm.email || ''}
                    onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })}
                    placeholder="provider@clinic.com"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Initial Safety Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setProviderForm({ ...providerForm, safetyRating: rating })}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                        (providerForm.safetyRating || 3) >= rating
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                          : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      {rating}
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-1">How safe do you feel with this provider?</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={providerForm.isPrimary}
                  onChange={(e) => setProviderForm({ ...providerForm, isPrimary: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPrimary" className="text-purple-300 font-semibold">
                  Primary Care Team Member
                </label>
              </div>

              <button
                onClick={addProvider}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Add Provider
              </button>
            </div>
          )}

          {/* Trauma-Informed Care Reminder */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-purple-300 font-semibold mb-1">Your Care Rights</h4>
                <ul className="text-purple-200/80 text-sm space-y-1">
                  {PSYCHOSOCIAL_CONSIDERATIONS.absoluteCareRules.slice(0, 3).map((rule, idx) => (
                    <li key={idx}>- {rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Primary Team */}
          {primaryProviders.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => toggleSection('primary')}
                className="flex items-center gap-2 text-purple-300 font-semibold mb-3 hover:text-purple-200"
              >
                {expandedSections.includes('primary') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Star className="w-5 h-5 text-yellow-400" />
                Primary Care Team ({primaryProviders.length})
              </button>

              {expandedSections.includes('primary') && (
                <div className="grid gap-3">
                  {primaryProviders.map(provider => (
                    <div key={provider.id} className="bg-black/40 p-4 rounded-lg border-2 border-yellow-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-bold text-lg">{provider.name}</h4>
                            <span className={`${getSafetyColor(provider.safetyRating)}`}>
                              <Heart className="w-4 h-4 inline" /> {provider.safetyRating}/5
                            </span>
                            {provider.redFlagsNoted.length > 0 && (
                              <span className="text-red-400 text-sm flex items-center gap-1">
                                <Flag className="w-3 h-3" /> {provider.redFlagsNoted.length} flags
                              </span>
                            )}
                          </div>
                          <p className="text-purple-300 font-semibold">{provider.role}</p>
                          {provider.facility && <p className="text-gray-400 text-sm">{provider.facility}</p>}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedProvider(provider);
                              setProviderForm(provider);
                              setShowProviderForm(true);
                            }}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          {!provider.isFromProfile && (
                            <button
                              onClick={() => deleteProvider(provider.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      {provider.manages.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-400 text-xs mb-1">Manages:</p>
                          <div className="flex flex-wrap gap-1">
                            {provider.manages.map((item, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {provider.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-400" />
                            <a href={`tel:${provider.phone}`} className="text-green-300 hover:text-green-200">
                              {provider.phone}
                            </a>
                          </div>
                        )}
                        {provider.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <a href={`mailto:${provider.email}`} className="text-blue-300 hover:text-blue-200 truncate">
                              {provider.email}
                            </a>
                          </div>
                        )}
                      </div>

                      {provider.redFlagsNoted.length > 0 && (
                        <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded">
                          <p className="text-red-300 text-xs font-semibold mb-1">Red Flags Noted:</p>
                          <ul className="text-red-200/80 text-xs space-y-0.5">
                            {provider.redFlagsNoted.map((flag, idx) => (
                              <li key={idx}>- "{flag}"</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other Providers */}
          {otherProviders.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('other')}
                className="flex items-center gap-2 text-gray-400 font-semibold mb-3 hover:text-gray-300"
              >
                {expandedSections.includes('other') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Other Providers ({otherProviders.length})
              </button>

              {expandedSections.includes('other') && (
                <div className="space-y-2">
                  {otherProviders.map(provider => (
                    <div key={provider.id} className="bg-black/20 p-3 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">{provider.name}</span>
                            <span className="text-gray-400 text-sm">- {provider.role}</span>
                            <span className={`text-sm ${getSafetyColor(provider.safetyRating)}`}>
                              <Heart className="w-3 h-3 inline" /> {provider.safetyRating}
                            </span>
                            {provider.redFlagsNoted.length > 0 && (
                              <Flag className="w-3 h-3 text-red-400" />
                            )}
                          </div>
                          {provider.facility && (
                            <p className="text-gray-400 text-xs">{provider.facility}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateProvider(provider.id, { isPrimary: true })}
                            className="p-1 hover:bg-yellow-500/20 rounded"
                            title="Add to primary team"
                          >
                            <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
                          </button>
                          {!provider.isFromProfile && (
                            <button
                              onClick={() => deleteProvider(provider.id)}
                              className="p-1 hover:bg-red-500/20 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {providers.length === 0 && (
            <div className="text-center text-purple-400 py-12">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No providers yet</p>
              <p className="text-sm mt-2">Click "Add Provider" or refresh to load from your health profile</p>
              <button
                onClick={initializeFromProfile}
                className="mt-4 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg"
              >
                Load from Health Profile
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAppointmentForm(!showAppointmentForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </button>
          </div>

          {showAppointmentForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-blue-500/30 mb-6 space-y-4">
              <h3 className="text-blue-300 font-semibold text-lg">Schedule Appointment</h3>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Provider *</label>
                <select
                  value={appointmentForm.providerId || ''}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, providerId: e.target.value })}
                  className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Select provider...</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.role}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Date *</label>
                  <input
                    type="date"
                    value={appointmentForm.date || ''}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Time</label>
                  <input
                    type="time"
                    value={appointmentForm.time || ''}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Reason for Visit</label>
                <input
                  type="text"
                  value={appointmentForm.reason || ''}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  placeholder="Follow-up, new symptoms, medication review..."
                  className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <button
                onClick={addAppointment}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Schedule Appointment
              </button>
            </div>
          )}

          {/* Calendar View - Simple List */}
          <div className="mb-6">
            <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Appointments
            </h3>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map(appt => {
                  const provider = providers.find(p => p.id === appt.providerId);
                  return (
                    <div key={appt.id} className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-bold">{appt.providerName}</h4>
                          <p className="text-blue-400 text-sm">{provider?.role}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300">{new Date(appt.date).toLocaleDateString()}</span>
                          {appt.time && <span className="text-gray-400">{appt.time}</span>}
                        </div>
                      </div>
                      {appt.reason && (
                        <p className="text-gray-300 text-sm mb-2"><span className="font-semibold">Reason:</span> {appt.reason}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setActiveTab('prep');
                          }}
                          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm rounded"
                        >
                          Prep Notes
                        </button>
                        <button
                          onClick={() => {
                            const updated = appointments.map(a =>
                              a.id === appt.id ? { ...a, status: 'cancelled' as const } : a
                            );
                            saveAppointments(updated);
                            toast.success('Appointment cancelled');
                          }}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-blue-400 py-8">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>

          {/* Needs Debrief Alert */}
          {needsDebrief.length > 0 && (
            <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h4 className="text-orange-300 font-semibold">Visits Needing Debrief</h4>
              </div>
              <div className="space-y-2">
                {needsDebrief.map(appt => (
                  <div key={appt.id} className="flex items-center justify-between bg-black/40 p-3 rounded">
                    <div>
                      <span className="text-white">{appt.providerName}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        {new Date(appt.date).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setShowDebriefForm(true);
                        setActiveTab('debrief');
                      }}
                      className="px-3 py-1 bg-orange-500/30 hover:bg-orange-500/40 text-orange-300 text-sm rounded font-semibold"
                    >
                      Complete Debrief
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'prep' && (
        <div>
          <h3 className="text-purple-300 font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Pre-Appointment Prep Templates
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {DEFAULT_PREP_TEMPLATES.map(template => (
              <div key={template.id} className="bg-black/40 p-4 rounded-lg border border-purple-500/20">
                <h4 className="text-white font-bold mb-2">{template.name}</h4>
                <p className="text-purple-400 text-sm mb-3">{template.category}</p>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-blue-300 font-semibold mb-1">Questions to Ask:</p>
                    <ul className="text-gray-300 text-xs space-y-0.5">
                      {template.questions.map((q, idx) => (
                        <li key={idx}>- {q}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-green-300 font-semibold mb-1">Documents Needed:</p>
                    <ul className="text-gray-300 text-xs space-y-0.5">
                      {template.documentsNeeded.map((d, idx) => (
                        <li key={idx}>- {d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-900/30 p-2 rounded border border-purple-500/30">
                    <p className="text-purple-300 font-semibold mb-1 text-xs">Self-Advocacy Reminders:</p>
                    <ul className="text-purple-200/80 text-xs space-y-0.5">
                      {template.selfAdvocacyReminders.map((r, idx) => (
                        <li key={idx}>- {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${template.name}\n\nQuestions:\n${template.questions.join('\n')}\n\nDocuments:\n${template.documentsNeeded.join('\n')}\n\nReminders:\n${template.selfAdvocacyReminders.join('\n')}`
                    );
                    toast.success('Template copied to clipboard');
                  }}
                  className="mt-3 w-full px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-sm rounded"
                >
                  Copy Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'debrief' && (
        <div>
          <h3 className="text-orange-300 font-semibold mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Post-Visit Debrief
          </h3>

          {/* Select appointment for debrief */}
          {!showDebriefForm && (
            <div className="mb-6">
              <p className="text-gray-400 mb-3">Select a past appointment to debrief:</p>
              <div className="space-y-2">
                {appointments
                  .filter(a => !a.debrief && new Date(a.date) <= new Date())
                  .map(appt => (
                    <button
                      key={appt.id}
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setShowDebriefForm(true);
                      }}
                      className="w-full flex items-center justify-between bg-black/40 p-3 rounded-lg border border-orange-500/20 hover:border-orange-500/40"
                    >
                      <div className="text-left">
                        <span className="text-white font-semibold">{appt.providerName}</span>
                        <span className="text-gray-400 text-sm ml-2">{appt.reason}</span>
                      </div>
                      <span className="text-orange-300 text-sm">
                        {new Date(appt.date).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Debrief Form */}
          {showDebriefForm && selectedAppointment && (
            <div className="bg-black/60 p-6 rounded-lg border border-orange-500/30 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-bold">Debrief: {selectedAppointment.providerName}</h4>
                  <p className="text-gray-400 text-sm">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDebriefForm(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">What Was Discussed</label>
                <textarea
                  value={debriefForm.whatWasDiscussed || ''}
                  onChange={(e) => setDebriefForm({ ...debriefForm, whatWasDiscussed: e.target.value })}
                  placeholder="Main topics, decisions made, diagnoses discussed..."
                  className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">Action Items</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newListItem}
                    onChange={(e) => setNewListItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToList('actionItems', setDebriefForm, debriefForm)}
                    placeholder="Add action item..."
                    className="flex-1 bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white"
                  />
                  <button
                    onClick={() => addToList('actionItems', setDebriefForm, debriefForm)}
                    className="px-4 py-2 bg-orange-600/30 text-orange-300 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <ul className="space-y-1">
                  {debriefForm.actionItems?.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-black/40 px-3 py-2 rounded text-white text-sm">
                      <span>- {item}</span>
                      <button
                        onClick={() => {
                          const items = [...(debriefForm.actionItems || [])];
                          items.splice(idx, 1);
                          setDebriefForm({ ...debriefForm, actionItems: items });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">
                  Emotional Safety Rating - How safe did you feel?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setDebriefForm({ ...debriefForm, emotionalSafetyRating: rating })}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                        (debriefForm.emotionalSafetyRating || 3) >= rating
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                          : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">Overall Feeling</label>
                <div className="flex gap-2">
                  {(['safe', 'neutral', 'uncomfortable', 'unsafe'] as const).map(feeling => (
                    <button
                      key={feeling}
                      onClick={() => setDebriefForm({ ...debriefForm, overallFeeling: feeling })}
                      className={`px-4 py-2 rounded-lg border capitalize transition-colors ${
                        debriefForm.overallFeeling === feeling
                          ? getFeelingBadge(feeling)
                          : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                      }`}
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">Provider Behavior Notes</label>
                <textarea
                  value={debriefForm.providerBehavior || ''}
                  onChange={(e) => {
                    setDebriefForm({ ...debriefForm, providerBehavior: e.target.value });
                    // Real-time red flag detection
                    const flags = detectRedFlags(e.target.value);
                    if (flags.length > 0 && flags.length !== (debriefForm.redFlagsNoted?.length || 0)) {
                      toast('Red flag phrase detected', { icon: '🚩' });
                    }
                  }}
                  placeholder="How did the provider treat you? Any concerning behavior? Positive interactions?"
                  className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white"
                  rows={3}
                />
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <label className="block text-red-300 text-sm font-semibold mb-2">
                  <Flag className="w-4 h-4 inline mr-1" />
                  Red Flags Noted
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newListItem}
                    onChange={(e) => setNewListItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToList('redFlagsNoted', setDebriefForm, debriefForm)}
                    placeholder='e.g. "said it was all in my head"'
                    className="flex-1 bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
                  />
                  <button
                    onClick={() => addToList('redFlagsNoted', setDebriefForm, debriefForm)}
                    className="px-4 py-2 bg-red-600/30 text-red-300 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {debriefForm.redFlagsNoted && debriefForm.redFlagsNoted.length > 0 && (
                  <ul className="space-y-1">
                    {debriefForm.redFlagsNoted.map((flag, idx) => (
                      <li key={idx} className="flex items-center justify-between bg-red-900/30 px-3 py-2 rounded text-red-200 text-sm">
                        <span>"{flag}"</span>
                        <button
                          onClick={() => {
                            const flags = [...(debriefForm.redFlagsNoted || [])];
                            flags.splice(idx, 1);
                            setDebriefForm({ ...debriefForm, redFlagsNoted: flags });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-red-300/60 text-xs mt-2">
                  Document any dismissive, gaslighting, or harmful statements for your records.
                </p>
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">Additional Notes</label>
                <textarea
                  value={debriefForm.notes || ''}
                  onChange={(e) => setDebriefForm({ ...debriefForm, notes: e.target.value })}
                  placeholder="Anything else to remember about this visit..."
                  className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white"
                  rows={2}
                />
              </div>

              <button
                onClick={completeDebrief}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Save Debrief
              </button>
            </div>
          )}

          {/* Past Debriefs */}
          {appointments.filter(a => a.debrief).length > 0 && (
            <div className="mt-6">
              <h4 className="text-gray-400 font-semibold mb-3">Completed Debriefs</h4>
              <div className="space-y-2">
                {appointments
                  .filter(a => a.debrief)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(appt => (
                    <div key={appt.id} className="bg-black/20 p-3 rounded-lg border border-gray-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{appt.providerName}</span>
                          <span className={`px-2 py-0.5 rounded text-xs border ${getFeelingBadge(appt.debrief!.overallFeeling)}`}>
                            {appt.debrief!.overallFeeling}
                          </span>
                          <span className={`text-sm ${getSafetyColor(appt.debrief!.emotionalSafetyRating)}`}>
                            <Heart className="w-3 h-3 inline" /> {appt.debrief!.emotionalSafetyRating}/5
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(appt.date).toLocaleDateString()}
                        </span>
                      </div>
                      {appt.debrief!.redFlagsNoted.length > 0 && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <Flag className="w-3 h-3" />
                          {appt.debrief!.redFlagsNoted.length} red flag(s) noted
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div>
          <h3 className="text-green-300 font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Follow-up Tasks
          </h3>

          {incompleteTasks.length > 0 ? (
            <div className="space-y-2 mb-6">
              {incompleteTasks
                .sort((a, b) => {
                  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map(task => {
                  const appt = appointments.find(a => a.id === task.appointmentId);
                  return (
                    <div
                      key={task.id}
                      className={`bg-black/40 p-3 rounded-lg border ${
                        task.priority === 'urgent' ? 'border-red-500/50' :
                        task.priority === 'high' ? 'border-orange-500/50' :
                        task.priority === 'medium' ? 'border-yellow-500/50' :
                        'border-green-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="mt-0.5"
                          >
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full hover:border-green-400" />
                            )}
                          </button>
                          <div>
                            <p className={`text-white ${task.completed ? 'line-through opacity-50' : ''}`}>
                              {task.task}
                            </p>
                            <p className="text-gray-400 text-xs">
                              From: {appt?.providerName || 'Unknown'} - {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          task.priority === 'urgent' ? 'bg-red-500/30 text-red-300' :
                          task.priority === 'high' ? 'bg-orange-500/30 text-orange-300' :
                          task.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                          'bg-green-500/30 text-green-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center text-green-400 py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>All tasks completed!</p>
            </div>
          )}

          {/* Completed tasks */}
          {followUpTasks.filter(t => t.completed).length > 0 && (
            <div>
              <h4 className="text-gray-400 font-semibold mb-3">Completed</h4>
              <div className="space-y-2 opacity-60">
                {followUpTasks
                  .filter(t => t.completed)
                  .slice(0, 5)
                  .map(task => (
                    <div key={task.id} className="bg-black/20 p-2 rounded-lg border border-gray-600/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 line-through text-sm">{task.task}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'access' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-blue-300 font-semibold flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Shared Access Management
            </h3>
            <button
              onClick={() => setShowAccessForm(!showAccessForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Grant Access
            </button>
          </div>

          {/* Consent Notice */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-purple-300 font-semibold mb-1">Your Privacy Controls</h4>
                <p className="text-purple-200/80 text-sm">
                  You control who can see your health information. All access requires your explicit consent
                  and can be revoked at any time. Red flags and debriefs contain sensitive information -
                  share carefully.
                </p>
              </div>
            </div>
          </div>

          {showAccessForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-blue-500/30 mb-6 space-y-4">
              <h4 className="text-blue-300 font-semibold">Grant New Access</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Person's Name *</label>
                  <input
                    type="text"
                    value={accessForm.personName || ''}
                    onChange={(e) => setAccessForm({ ...accessForm, personName: e.target.value })}
                    placeholder="Partner, caregiver, etc."
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Relationship</label>
                  <input
                    type="text"
                    value={accessForm.relationship || ''}
                    onChange={(e) => setAccessForm({ ...accessForm, relationship: e.target.value })}
                    placeholder="Partner, parent, friend..."
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Access Level</label>
                <select
                  value={accessForm.accessLevel || 'limited'}
                  onChange={(e) => setAccessForm({ ...accessForm, accessLevel: e.target.value as any })}
                  className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                >
                  <option value="full">Full Access - Can see everything</option>
                  <option value="limited">Limited - Selected information only</option>
                  <option value="emergency-only">Emergency Only - Basic info for emergencies</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={accessForm.canViewProviders}
                      onChange={(e) => setAccessForm({ ...accessForm, canViewProviders: e.target.checked })}
                      className="w-4 h-4"
                    />
                    View Providers
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={accessForm.canViewAppointments}
                      onChange={(e) => setAccessForm({ ...accessForm, canViewAppointments: e.target.checked })}
                      className="w-4 h-4"
                    />
                    View Appointments
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={accessForm.canViewDebriefs}
                      onChange={(e) => setAccessForm({ ...accessForm, canViewDebriefs: e.target.checked })}
                      className="w-4 h-4"
                    />
                    View Debriefs
                  </label>
                  <label className="flex items-center gap-2 text-red-300">
                    <input
                      type="checkbox"
                      checked={accessForm.canViewRedFlags}
                      onChange={(e) => setAccessForm({ ...accessForm, canViewRedFlags: e.target.checked })}
                      className="w-4 h-4"
                    />
                    View Red Flags (Sensitive)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Access Expiration (Optional)</label>
                <input
                  type="date"
                  value={accessForm.expiresAt || ''}
                  onChange={(e) => setAccessForm({ ...accessForm, expiresAt: e.target.value })}
                  className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={accessForm.consentGiven}
                    onChange={(e) => setAccessForm({ ...accessForm, consentGiven: e.target.checked })}
                    className="w-5 h-5 mt-0.5"
                  />
                  <span className="text-yellow-200 text-sm">
                    I consent to sharing my health information with this person as specified above.
                    I understand I can revoke this access at any time.
                  </span>
                </label>
              </div>

              <button
                onClick={addSharedAccess}
                disabled={!accessForm.consentGiven}
                className={`w-full font-bold py-3 px-4 rounded-lg ${
                  accessForm.consentGiven
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Grant Access
              </button>
            </div>
          )}

          {/* Current Access List */}
          {sharedAccess.length > 0 ? (
            <div className="space-y-3">
              {sharedAccess.map(access => (
                <div key={access.id} className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-bold">{access.personName}</h4>
                      <p className="text-blue-400 text-sm">{access.relationship}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        access.accessLevel === 'full' ? 'bg-green-500/30 text-green-300' :
                        access.accessLevel === 'limited' ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-red-500/30 text-red-300'
                      }`}>
                        {access.accessLevel}
                      </span>
                      <button
                        onClick={() => {
                          saveAccess(sharedAccess.filter(a => a.id !== access.id));
                          toast.success('Access revoked');
                        }}
                        className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded"
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {access.canViewProviders && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">Providers</span>}
                    {access.canViewAppointments && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">Appointments</span>}
                    {access.canViewDebriefs && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded">Debriefs</span>}
                    {access.canViewRedFlags && <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded">Red Flags</span>}
                  </div>
                  {access.expiresAt && (
                    <p className="text-gray-400 text-xs mt-2">Expires: {new Date(access.expiresAt).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-blue-400 py-8">
              <Share2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No shared access configured</p>
              <p className="text-sm mt-1">Grant access to partners, caregivers, or advocates</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'docs' && (
        <div>
          <h3 className="text-green-300 font-semibold mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Documentation Vault
          </h3>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
            <h4 className="text-white font-bold text-lg mb-2">Medical Records Storage</h4>
            <p className="text-green-200/80 mb-4">
              Store and organize your medical documents, test results, and records here.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded-lg">
                <ExternalLink className="w-4 h-4" />
                Link to Cloud Storage
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg">
                <Download className="w-4 h-4" />
                Export All Records
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-4">
              Integration with Google Drive, Dropbox, or local storage coming soon.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Lab Results', icon: FileText },
              { label: 'Imaging', icon: FileText },
              { label: 'Visit Notes', icon: ClipboardCheck },
              { label: 'Prescriptions', icon: FileText },
            ].map((item, idx) => (
              <button
                key={idx}
                className="flex flex-col items-center gap-2 p-4 bg-black/40 rounded-lg border border-purple-500/20 hover:border-purple-500/40"
              >
                <item.icon className="w-6 h-6 text-purple-400" />
                <span className="text-purple-300 text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer - Trauma-informed care reminder */}
      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-300 text-sm font-semibold mb-1">Trauma-Informed Care Coordinator</p>
            <p className="text-purple-200/70 text-xs">
              This tool is designed for survivors of medical trauma. Document provider behavior,
              track red flags, and advocate for yourself. Your experiences are valid. Your needs matter.
              {PSYCHOSOCIAL_CONSIDERATIONS.absoluteCareRules[0]} - always.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareTeamCoordinator;
