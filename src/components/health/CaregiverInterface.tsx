import React, { useState, useEffect } from 'react';
import {
  Users, Heart, Shield, AlertTriangle, ClipboardList, MessageSquare,
  ShoppingCart, Pill, Package, CheckCircle, Plus, Trash2, Edit,
  QrCode, Link2, Copy, Check, Download, ChevronDown, ChevronRight,
  Phone, Mail, Calendar, Clock, Star, HandHeart, Coffee, Sparkles,
  Ban, ThumbsUp, ThumbsDown, Share2, Eye, Lock, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { IDENTITY_CONTEXT, CAREGIVER_INTERFACES, CORE_DESIGN_PRINCIPLES } from '../../data/kol-master-feature-list';

// ========== INTERFACES ==========
interface CaregiverProfile {
  id: string;
  name: string;
  relationship: string;
  type: 'partner' | 'parent' | 'aide' | 'friend' | 'other';
  phone?: string;
  email?: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  createdAt: number;
}

interface HelpItem {
  id: string;
  text: string;
  category: 'helps' | 'harms';
  caregiverId: string;
}

interface CheckInScript {
  id: string;
  category: string;
  prompt: string;
  notes: string;
  isDefault: boolean;
}

interface CareTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  createdAt: number;
  completedAt?: number;
  notes?: string;
}

interface BoundaryReminder {
  id: string;
  title: string;
  description: string;
  isCore: boolean;
}

interface ReplenishmentItem {
  id: string;
  name: string;
  category: 'groceries' | 'medications' | 'supplies' | 'other';
  quantity?: string;
  urgency: 'low' | 'medium' | 'high';
  notes?: string;
  addedAt: number;
  caregiverCanHandle: boolean;
}

interface ShareableView {
  id: string;
  name: string;
  caregiverId: string;
  includeHelpHarms: boolean;
  includeScripts: boolean;
  includeTasks: boolean;
  includeBoundaries: boolean;
  includeReplenishment: boolean;
  createdAt: number;
  expiresAt?: number;
  accessCode: string;
}

// ========== DEFAULT DATA ==========
const DEFAULT_CAREGIVERS: CaregiverProfile[] = [
  {
    id: 'quincy',
    name: 'Quincy',
    relationship: 'Partner',
    type: 'partner',
    color: 'purple',
    isActive: true,
    createdAt: Date.now()
  },
  {
    id: 'daveon',
    name: "Da'Veon",
    relationship: 'Partner',
    type: 'partner',
    color: 'blue',
    isActive: true,
    createdAt: Date.now()
  },
  {
    id: 'mom',
    name: 'Mary Jones',
    relationship: 'Mother',
    type: 'parent',
    color: 'pink',
    isActive: true,
    createdAt: Date.now()
  },
  {
    id: 'aide',
    name: 'Home Health Aide',
    relationship: 'Professional Caregiver',
    type: 'aide',
    color: 'green',
    isActive: true,
    createdAt: Date.now()
  }
];

const DEFAULT_HELPS: HelpItem[] = [
  // Universal helps
  { id: 'h1', text: 'Using calm, quiet tones when speaking', category: 'helps', caregiverId: 'all' },
  { id: 'h2', text: 'Providing written instructions or reminders', category: 'helps', caregiverId: 'all' },
  { id: 'h3', text: 'Being patient with processing time', category: 'helps', caregiverId: 'all' },
  { id: 'h4', text: 'Asking before touching or physical contact', category: 'helps', caregiverId: 'all' },
  { id: 'h5', text: 'Offering specific help instead of vague offers', category: 'helps', caregiverId: 'all' },
  { id: 'h6', text: 'Respecting stated limits without questioning', category: 'helps', caregiverId: 'all' },
  { id: 'h7', text: 'Validating feelings without trying to fix them', category: 'helps', caregiverId: 'all' },
  { id: 'h8', text: 'Checking in with open-ended questions', category: 'helps', caregiverId: 'all' },
  { id: 'h9', text: 'Providing quiet companionship without expectation', category: 'helps', caregiverId: 'all' },
  { id: 'h10', text: 'Following established routines', category: 'helps', caregiverId: 'all' },
  { id: 'h11', text: 'Giving advance notice before changes', category: 'helps', caregiverId: 'all' },
  { id: 'h12', text: 'Handling tasks without needing direction', category: 'helps', caregiverId: 'all' },
  { id: 'h13', text: 'Keeping the environment low-stimulation', category: 'helps', caregiverId: 'all' },
  { id: 'h14', text: 'Remembering important health information', category: 'helps', caregiverId: 'all' },
  { id: 'h15', text: 'Being reliable and consistent', category: 'helps', caregiverId: 'all' }
];

const DEFAULT_HARMS: HelpItem[] = [
  { id: 'hm1', text: 'Rushing or expressing impatience', category: 'harms', caregiverId: 'all' },
  { id: 'hm2', text: 'Dismissing or minimizing symptoms', category: 'harms', caregiverId: 'all' },
  { id: 'hm3', text: 'Offering unsolicited advice', category: 'harms', caregiverId: 'all' },
  { id: 'hm4', text: 'Suggesting they are "being dramatic"', category: 'harms', caregiverId: 'all' },
  { id: 'hm5', text: 'Asking "Are you better yet?"', category: 'harms', caregiverId: 'all' },
  { id: 'hm6', text: 'Unexpected physical contact', category: 'harms', caregiverId: 'all' },
  { id: 'hm7', text: 'Making sudden loud noises', category: 'harms', caregiverId: 'all' },
  { id: 'hm8', text: 'Questioning the reality of symptoms', category: 'harms', caregiverId: 'all' },
  { id: 'hm9', text: 'Comparing to others ("my friend has that and...")' , category: 'harms', caregiverId: 'all' },
  { id: 'hm10', text: 'Suggesting "just try harder"', category: 'harms', caregiverId: 'all' },
  { id: 'hm11', text: 'Making guilt-inducing statements', category: 'harms', caregiverId: 'all' },
  { id: 'hm12', text: 'Using moralistic language (lazy, should, etc.)', category: 'harms', caregiverId: 'all' },
  { id: 'hm13', text: 'Creating unpredictability in routines', category: 'harms', caregiverId: 'all' },
  { id: 'hm14', text: 'Bright lights or loud environments', category: 'harms', caregiverId: 'all' },
  { id: 'hm15', text: 'Demanding immediate responses', category: 'harms', caregiverId: 'all' }
];

const DEFAULT_SCRIPTS: CheckInScript[] = [
  {
    id: 's1',
    category: 'Daily Check-In',
    prompt: 'How are you feeling today?',
    notes: 'Use this instead of "are you better?" - focuses on current state without implying they should be improved',
    isDefault: true
  },
  {
    id: 's2',
    category: 'Needs Assessment',
    prompt: 'What do you need right now?',
    notes: 'Open-ended, allows them to identify their own needs without assumptions',
    isDefault: true
  },
  {
    id: 's3',
    category: 'Offering Help',
    prompt: 'Is there anything I can help with?',
    notes: 'Offers agency - they can accept, decline, or specify what they need',
    isDefault: true
  },
  {
    id: 's4',
    category: 'Energy Check',
    prompt: 'How are your spoons today?',
    notes: 'Uses shared language about energy capacity, no judgment implied',
    isDefault: true
  },
  {
    id: 's5',
    category: 'Pain/Comfort',
    prompt: 'Is there anything that would make you more comfortable?',
    notes: 'Focuses on comfort improvement, not fixing or curing',
    isDefault: true
  },
  {
    id: 's6',
    category: 'Validation',
    prompt: 'That sounds really hard. I\'m here for you.',
    notes: 'Pure validation without advice or silver lining',
    isDefault: true
  },
  {
    id: 's7',
    category: 'Boundary Check',
    prompt: 'Do you want company right now, or would you prefer space?',
    notes: 'Respects need for solitude without taking it personally',
    isDefault: true
  },
  {
    id: 's8',
    category: 'Task Support',
    prompt: 'Would it help if I handled [specific task]?',
    notes: 'Specific offer is easier to accept than vague "let me know if you need anything"',
    isDefault: true
  },
  {
    id: 's9',
    category: 'Appointment Support',
    prompt: 'Would you like me to come with you, or would you prefer to go alone?',
    notes: 'Offers support without assuming or pressuring',
    isDefault: true
  },
  {
    id: 's10',
    category: 'Bad Day Recognition',
    prompt: 'I can see today is hard. I\'m just going to be here.',
    notes: 'Acknowledges difficulty, offers presence without demands',
    isDefault: true
  }
];

const DEFAULT_BOUNDARIES: BoundaryReminder[] = [
  {
    id: 'b1',
    title: 'No Unsolicited Advice',
    description: 'Wait to be asked before offering suggestions. "Have you tried..." is rarely helpful unless specifically requested.',
    isCore: true
  },
  {
    id: 'b2',
    title: 'Respect Stated Limits',
    description: 'When Kol says "I can\'t" or "I need to rest," accept it without questioning or trying to motivate.',
    isCore: true
  },
  {
    id: 'b3',
    title: 'Check Before Physical Contact',
    description: 'Always ask before hugs, touching, or even sitting close. Consent applies to all physical interaction.',
    isCore: true
  },
  {
    id: 'b4',
    title: 'Validate Without Minimizing',
    description: 'Acknowledge experiences as real and valid. Avoid "at least," "but," or comparisons.',
    isCore: true
  },
  {
    id: 'b5',
    title: 'Written Over Verbal',
    description: 'Important information should be texted or written down, not just spoken.',
    isCore: false
  },
  {
    id: 'b6',
    title: 'Allow Processing Time',
    description: 'Don\'t expect immediate responses. Complex information needs time to process.',
    isCore: false
  },
  {
    id: 'b7',
    title: 'Respect Rest as Necessary',
    description: 'Rest is medical necessity, not laziness. Never make comments about being "unproductive."',
    isCore: false
  },
  {
    id: 'b8',
    title: 'Maintain Predictability',
    description: 'Give advance notice of changes. Unexpected events can be overwhelming.',
    isCore: false
  }
];

// ========== COMPONENT ==========
const CaregiverInterface: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'profiles' | 'helps' | 'scripts' | 'tasks' | 'boundaries' | 'replenishment' | 'share'>('profiles');
  const [selectedCaregiver, setSelectedCaregiver] = useState<string>('all');
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>([]);
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);
  const [scripts, setScripts] = useState<CheckInScript[]>([]);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [boundaries, setBoundaries] = useState<BoundaryReminder[]>([]);
  const [replenishmentItems, setReplenishmentItems] = useState<ReplenishmentItem[]>([]);
  const [shareableViews, setShareableViews] = useState<ShareableView[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['helps', 'harms']);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Form states
  const [newHelpItem, setNewHelpItem] = useState({ text: '', category: 'helps' as 'helps' | 'harms' });
  const [newScript, setNewScript] = useState({ category: '', prompt: '', notes: '' });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: ''
  });
  const [newReplenishment, setNewReplenishment] = useState({
    name: '',
    category: 'groceries' as 'groceries' | 'medications' | 'supplies' | 'other',
    quantity: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
    caregiverCanHandle: true
  });
  const [shareForm, setShareForm] = useState({
    name: '',
    caregiverId: 'all',
    includeHelpHarms: true,
    includeScripts: true,
    includeTasks: false,
    includeBoundaries: true,
    includeReplenishment: true,
    expiresIn: '7'
  });

  // Load from localStorage
  useEffect(() => {
    const storedCaregivers = localStorage.getItem('caregiver-profiles');
    const storedHelps = localStorage.getItem('caregiver-helps');
    const storedScripts = localStorage.getItem('caregiver-scripts');
    const storedTasks = localStorage.getItem('caregiver-tasks');
    const storedBoundaries = localStorage.getItem('caregiver-boundaries');
    const storedReplenishment = localStorage.getItem('caregiver-replenishment');
    const storedShares = localStorage.getItem('caregiver-shares');

    if (storedCaregivers) {
      setCaregivers(JSON.parse(storedCaregivers));
    } else {
      setCaregivers(DEFAULT_CAREGIVERS);
      localStorage.setItem('caregiver-profiles', JSON.stringify(DEFAULT_CAREGIVERS));
    }

    if (storedHelps) {
      setHelpItems(JSON.parse(storedHelps));
    } else {
      const allHelps = [...DEFAULT_HELPS, ...DEFAULT_HARMS];
      setHelpItems(allHelps);
      localStorage.setItem('caregiver-helps', JSON.stringify(allHelps));
    }

    if (storedScripts) {
      setScripts(JSON.parse(storedScripts));
    } else {
      setScripts(DEFAULT_SCRIPTS);
      localStorage.setItem('caregiver-scripts', JSON.stringify(DEFAULT_SCRIPTS));
    }

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    if (storedBoundaries) {
      setBoundaries(JSON.parse(storedBoundaries));
    } else {
      setBoundaries(DEFAULT_BOUNDARIES);
      localStorage.setItem('caregiver-boundaries', JSON.stringify(DEFAULT_BOUNDARIES));
    }

    if (storedReplenishment) {
      setReplenishmentItems(JSON.parse(storedReplenishment));
    }

    if (storedShares) {
      setShareableViews(JSON.parse(storedShares));
    }
  }, []);

  // Save functions
  const saveCaregivers = (data: CaregiverProfile[]) => {
    setCaregivers(data);
    localStorage.setItem('caregiver-profiles', JSON.stringify(data));
  };

  const saveHelpItems = (data: HelpItem[]) => {
    setHelpItems(data);
    localStorage.setItem('caregiver-helps', JSON.stringify(data));
  };

  const saveScripts = (data: CheckInScript[]) => {
    setScripts(data);
    localStorage.setItem('caregiver-scripts', JSON.stringify(data));
  };

  const saveTasks = (data: CareTask[]) => {
    setTasks(data);
    localStorage.setItem('caregiver-tasks', JSON.stringify(data));
  };

  const saveBoundaries = (data: BoundaryReminder[]) => {
    setBoundaries(data);
    localStorage.setItem('caregiver-boundaries', JSON.stringify(data));
  };

  const saveReplenishment = (data: ReplenishmentItem[]) => {
    setReplenishmentItems(data);
    localStorage.setItem('caregiver-replenishment', JSON.stringify(data));
  };

  const saveShares = (data: ShareableView[]) => {
    setShareableViews(data);
    localStorage.setItem('caregiver-shares', JSON.stringify(data));
  };

  // Add functions
  const addHelpItem = () => {
    if (!newHelpItem.text.trim()) {
      toast.error('Please enter what helps or harms');
      return;
    }
    const item: HelpItem = {
      id: `help_${Date.now()}`,
      text: newHelpItem.text,
      category: newHelpItem.category,
      caregiverId: selectedCaregiver
    };
    saveHelpItems([...helpItems, item]);
    setNewHelpItem({ text: '', category: 'helps' });
    setShowAddForm(null);
    toast.success(`Added to "${newHelpItem.category === 'helps' ? 'What Helps' : 'What Harms'}"`);
  };

  const addScript = () => {
    if (!newScript.prompt.trim()) {
      toast.error('Please enter a check-in prompt');
      return;
    }
    const script: CheckInScript = {
      id: `script_${Date.now()}`,
      category: newScript.category || 'Custom',
      prompt: newScript.prompt,
      notes: newScript.notes,
      isDefault: false
    };
    saveScripts([...scripts, script]);
    setNewScript({ category: '', prompt: '', notes: '' });
    setShowAddForm(null);
    toast.success('Check-in script added');
  };

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    const task: CareTask = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo || 'unassigned',
      priority: newTask.priority,
      status: 'pending',
      dueDate: newTask.dueDate,
      createdAt: Date.now()
    };
    saveTasks([...tasks, task]);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
    setShowAddForm(null);
    toast.success('Task added');
  };

  const addReplenishmentItem = () => {
    if (!newReplenishment.name.trim()) {
      toast.error('Please enter item name');
      return;
    }
    const item: ReplenishmentItem = {
      id: `rep_${Date.now()}`,
      name: newReplenishment.name,
      category: newReplenishment.category,
      quantity: newReplenishment.quantity,
      urgency: newReplenishment.urgency,
      notes: newReplenishment.notes,
      addedAt: Date.now(),
      caregiverCanHandle: newReplenishment.caregiverCanHandle
    };
    saveReplenishment([...replenishmentItems, item]);
    setNewReplenishment({
      name: '',
      category: 'groceries',
      quantity: '',
      urgency: 'medium',
      notes: '',
      caregiverCanHandle: true
    });
    setShowAddForm(null);
    toast.success('Item added to replenishment list');
  };

  // Generate shareable view
  const generateShareableView = () => {
    if (!shareForm.name.trim()) {
      toast.error('Please name this shareable view');
      return;
    }

    const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = shareForm.expiresIn !== 'never'
      ? Date.now() + (parseInt(shareForm.expiresIn) * 24 * 60 * 60 * 1000)
      : undefined;

    const view: ShareableView = {
      id: `share_${Date.now()}`,
      name: shareForm.name,
      caregiverId: shareForm.caregiverId,
      includeHelpHarms: shareForm.includeHelpHarms,
      includeScripts: shareForm.includeScripts,
      includeTasks: shareForm.includeTasks,
      includeBoundaries: shareForm.includeBoundaries,
      includeReplenishment: shareForm.includeReplenishment,
      createdAt: Date.now(),
      expiresAt,
      accessCode
    };

    saveShares([...shareableViews, view]);

    // Generate QR code URL (using a public QR API)
    const shareUrl = `${window.location.origin}/caregiver-view/${accessCode}`;
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`);

    toast.success('Shareable view created!');
  };

  // Copy share link
  const copyShareLink = (accessCode: string) => {
    const shareUrl = `${window.location.origin}/caregiver-view/${accessCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard');
  };

  // Update task status
  const updateTaskStatus = (taskId: string, status: CareTask['status']) => {
    const updated = tasks.map(t =>
      t.id === taskId
        ? { ...t, status, completedAt: status === 'completed' ? Date.now() : undefined }
        : t
    );
    saveTasks(updated);
    if (status === 'completed') {
      toast.success('Task completed!');
    }
  };

  // Delete functions
  const deleteHelpItem = (id: string) => {
    saveHelpItems(helpItems.filter(h => h.id !== id));
    toast.success('Item removed');
  };

  const deleteScript = (id: string) => {
    saveScripts(scripts.filter(s => s.id !== id));
    toast.success('Script removed');
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    toast.success('Task removed');
  };

  const deleteReplenishmentItem = (id: string) => {
    saveReplenishment(replenishmentItems.filter(r => r.id !== id));
    toast.success('Item removed');
  };

  const deleteShare = (id: string) => {
    saveShares(shareableViews.filter(s => s.id !== id));
    toast.success('Share link removed');
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Filter items for selected caregiver
  const filteredHelpItems = helpItems.filter(h =>
    h.caregiverId === 'all' || h.caregiverId === selectedCaregiver
  );

  const helps = filteredHelpItems.filter(h => h.category === 'helps');
  const harms = filteredHelpItems.filter(h => h.category === 'harms');

  const filteredTasks = selectedCaregiver === 'all'
    ? tasks
    : tasks.filter(t => t.assignedTo === selectedCaregiver || t.assignedTo === 'unassigned');

  // Get caregiver color
  const getCaregiverColor = (caregiverId: string) => {
    const caregiver = caregivers.find(c => c.id === caregiverId);
    const colorMap: Record<string, string> = {
      purple: 'from-purple-600/30 to-purple-900/30 border-purple-500/30',
      blue: 'from-blue-600/30 to-blue-900/30 border-blue-500/30',
      pink: 'from-pink-600/30 to-pink-900/30 border-pink-500/30',
      green: 'from-green-600/30 to-green-900/30 border-green-500/30'
    };
    return colorMap[caregiver?.color || 'purple'] || colorMap.purple;
  };

  const getTextColor = (caregiverId: string) => {
    const caregiver = caregivers.find(c => c.id === caregiverId);
    const colorMap: Record<string, string> = {
      purple: 'text-purple-300',
      blue: 'text-blue-300',
      pink: 'text-pink-300',
      green: 'text-green-300'
    };
    return colorMap[caregiver?.color || 'purple'] || colorMap.purple;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/30 text-red-300 border-red-500/50';
      case 'high': return 'bg-orange-500/30 text-orange-300 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
      default: return 'bg-green-500/30 text-green-300 border-green-500/50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/30 text-red-300';
      case 'medium': return 'bg-yellow-500/30 text-yellow-300';
      default: return 'bg-green-500/30 text-green-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'groceries': return ShoppingCart;
      case 'medications': return Pill;
      case 'supplies': return Package;
      default: return Package;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HandHeart className="w-7 h-7 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Partner & Caregiver Support</h2>
            <p className="text-purple-300 text-sm">Trauma-informed care coordination for {IDENTITY_CONTEXT.name}'s support network</p>
          </div>
        </div>
      </div>

      {/* Caregiver Selector */}
      <div className="mb-6">
        <p className="text-purple-300 text-sm font-semibold mb-3">View information for:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCaregiver('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCaregiver === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            All Caregivers
          </button>
          {caregivers.map(caregiver => (
            <button
              key={caregiver.id}
              onClick={() => setSelectedCaregiver(caregiver.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCaregiver === caregiver.id
                  ? `bg-${caregiver.color}-600 text-white`
                  : `bg-${caregiver.color}-900/30 text-${caregiver.color}-300 hover:bg-${caregiver.color}-800/40`
              }`}
              style={{
                backgroundColor: selectedCaregiver === caregiver.id
                  ? `var(--${caregiver.color}-600, rgba(147, 51, 234, 0.8))`
                  : `rgba(147, 51, 234, 0.2)`
              }}
            >
              {caregiver.name}
              <span className="ml-2 text-xs opacity-70">({caregiver.relationship})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Core Principles Banner */}
      <div className="bg-purple-900/40 border border-purple-500/40 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-purple-300 font-semibold mb-2">Trauma-Informed Care Principles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p className="text-purple-200/80">- {CORE_DESIGN_PRINCIPLES.writtenOverVerbal.description}</p>
              <p className="text-purple-200/80">- {CORE_DESIGN_PRINCIPLES.consentFirst.description}</p>
              <p className="text-purple-200/80">- {CORE_DESIGN_PRINCIPLES.noMoralLanguage.description}</p>
              <p className="text-purple-200/80">- {CORE_DESIGN_PRINCIPLES.calmUX.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-purple-500/30 pb-4">
        {[
          { id: 'profiles', label: 'Profiles', icon: Users },
          { id: 'helps', label: 'What Helps/Harms', icon: Heart },
          { id: 'scripts', label: 'Check-In Scripts', icon: MessageSquare },
          { id: 'tasks', label: 'Task Delegation', icon: ClipboardList },
          { id: 'boundaries', label: 'Boundary Reminders', icon: Shield },
          { id: 'replenishment', label: 'No-Ask Lists', icon: ShoppingCart },
          { id: 'share', label: 'Share Views', icon: Share2 }
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

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="space-y-4">
          <h3 className="text-purple-300 font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Caregiver Profiles
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {caregivers.map(caregiver => (
              <div
                key={caregiver.id}
                className={`bg-gradient-to-br ${getCaregiverColor(caregiver.id)} p-5 rounded-xl border`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-white font-bold text-xl">{caregiver.name}</h4>
                    <p className={getTextColor(caregiver.id)}>{caregiver.relationship}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    caregiver.type === 'partner' ? 'bg-pink-500/30 text-pink-300' :
                    caregiver.type === 'parent' ? 'bg-blue-500/30 text-blue-300' :
                    caregiver.type === 'aide' ? 'bg-green-500/30 text-green-300' :
                    'bg-gray-500/30 text-gray-300'
                  }`}>
                    {caregiver.type.charAt(0).toUpperCase() + caregiver.type.slice(1)}
                  </span>
                </div>

                {(caregiver.phone || caregiver.email) && (
                  <div className="space-y-2 mb-4 text-sm">
                    {caregiver.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-400" />
                        <a href={`tel:${caregiver.phone}`} className="text-green-300 hover:text-green-200">
                          {caregiver.phone}
                        </a>
                      </div>
                    )}
                    {caregiver.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <a href={`mailto:${caregiver.email}`} className="text-blue-300 hover:text-blue-200">
                          {caregiver.email}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCaregiver(caregiver.id);
                      setActiveTab('helps');
                    }}
                    className="flex-1 px-3 py-2 bg-black/30 hover:bg-black/50 text-white text-sm rounded-lg"
                  >
                    View Guide
                  </button>
                  <button
                    onClick={() => {
                      setShareForm({ ...shareForm, caregiverId: caregiver.id, name: `Guide for ${caregiver.name}` });
                      setActiveTab('share');
                    }}
                    className="px-3 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 text-sm rounded-lg"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What Helps/What Harms Tab */}
      {activeTab === 'helps' && (
        <div className="space-y-6">
          {/* Helps Section */}
          <div>
            <button
              onClick={() => toggleSection('helps')}
              className="flex items-center gap-2 text-green-300 font-semibold mb-3 hover:text-green-200"
            >
              {expandedSections.includes('helps') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <ThumbsUp className="w-5 h-5" />
              What Helps ({helps.length})
            </button>

            {expandedSections.includes('helps') && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 space-y-3">
                <p className="text-green-200/70 text-sm mb-3">
                  Actions and approaches that support {IDENTITY_CONTEXT.name}'s wellbeing
                </p>

                {helps.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-green-900/30 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white">{item.text}</span>
                    </div>
                    {item.caregiverId !== 'all' && (
                      <button
                        onClick={() => deleteHelpItem(item.id)}
                        className="p-1 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}

                {showAddForm === 'helps' ? (
                  <div className="bg-black/40 p-4 rounded-lg space-y-3">
                    <input
                      type="text"
                      value={newHelpItem.text}
                      onChange={(e) => setNewHelpItem({ ...newHelpItem, text: e.target.value, category: 'helps' })}
                      placeholder="What helps..."
                      className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addHelpItem}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddForm(null)}
                        className="px-4 py-2 bg-gray-600/30 text-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm('helps')}
                    className="w-full px-4 py-2 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add What Helps
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Harms Section */}
          <div>
            <button
              onClick={() => toggleSection('harms')}
              className="flex items-center gap-2 text-red-300 font-semibold mb-3 hover:text-red-200"
            >
              {expandedSections.includes('harms') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <ThumbsDown className="w-5 h-5" />
              What Harms ({harms.length})
            </button>

            {expandedSections.includes('harms') && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 space-y-3">
                <p className="text-red-200/70 text-sm mb-3">
                  Actions and phrases to avoid - these can cause harm even with good intentions
                </p>

                {harms.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-red-900/30 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Ban className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-white">{item.text}</span>
                    </div>
                    {item.caregiverId !== 'all' && (
                      <button
                        onClick={() => deleteHelpItem(item.id)}
                        className="p-1 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}

                {showAddForm === 'harms' ? (
                  <div className="bg-black/40 p-4 rounded-lg space-y-3">
                    <input
                      type="text"
                      value={newHelpItem.text}
                      onChange={(e) => setNewHelpItem({ ...newHelpItem, text: e.target.value, category: 'harms' })}
                      placeholder="What harms..."
                      className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addHelpItem}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddForm(null)}
                        className="px-4 py-2 bg-gray-600/30 text-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm('harms')}
                    className="w-full px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add What Harms
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Check-In Scripts Tab */}
      {activeTab === 'scripts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-300 font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Daily Check-In Scripts
            </h3>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-4">
            <p className="text-purple-200/80 text-sm">
              <strong className="text-purple-300">Why scripts matter:</strong> The right words can reduce anxiety and create safety.
              The wrong words (even well-intentioned) can cause harm. These templates help ensure supportive communication.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {scripts.map(script => (
              <div
                key={script.id}
                className="bg-black/40 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded font-semibold">
                    {script.category}
                  </span>
                  {!script.isDefault && (
                    <button
                      onClick={() => deleteScript(script.id)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>

                <blockquote className="text-white text-lg font-semibold mb-2 border-l-4 border-purple-500 pl-3">
                  "{script.prompt}"
                </blockquote>

                {script.notes && (
                  <p className="text-purple-200/70 text-sm italic">
                    {script.notes}
                  </p>
                )}

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(script.prompt);
                    toast.success('Script copied!');
                  }}
                  className="mt-3 w-full px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-sm rounded flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Script
                </button>
              </div>
            ))}
          </div>

          {/* Add Script Form */}
          {showAddForm === 'script' ? (
            <div className="bg-black/60 p-6 rounded-lg border border-purple-500/30 space-y-4">
              <h4 className="text-purple-300 font-semibold">Add Custom Check-In Script</h4>

              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Category</label>
                <input
                  type="text"
                  value={newScript.category}
                  onChange={(e) => setNewScript({ ...newScript, category: e.target.value })}
                  placeholder="e.g., Morning Check-In, Pain Support..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Script Prompt *</label>
                <textarea
                  value={newScript.prompt}
                  onChange={(e) => setNewScript({ ...newScript, prompt: e.target.value })}
                  placeholder="The words to say..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Usage Notes</label>
                <textarea
                  value={newScript.notes}
                  onChange={(e) => setNewScript({ ...newScript, notes: e.target.value })}
                  placeholder="When to use this, why it helps..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addScript}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
                >
                  Add Script
                </button>
                <button
                  onClick={() => setShowAddForm(null)}
                  className="px-4 py-2 bg-gray-600/30 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm('script')}
              className="w-full px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Custom Script
            </button>
          )}
        </div>
      )}

      {/* Task Delegation Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-300 font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Task Delegation
            </h3>
            <button
              onClick={() => setShowAddForm(showAddForm === 'task' ? null : 'task')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          {/* Add Task Form */}
          {showAddForm === 'task' && (
            <div className="bg-black/60 p-6 rounded-lg border border-blue-500/30 space-y-4">
              <h4 className="text-blue-300 font-semibold">Add New Task</h4>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Additional details..."
                  className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Assign To</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Unassigned</option>
                    {caregivers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-semibold mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addTask}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddForm(null)}
                  className="px-4 py-2 bg-gray-600/30 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tasks List */}
          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks
                .sort((a, b) => {
                  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                  if (a.status === 'completed' && b.status !== 'completed') return 1;
                  if (a.status !== 'completed' && b.status === 'completed') return -1;
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map(task => {
                  const assignee = caregivers.find(c => c.id === task.assignedTo);
                  return (
                    <div
                      key={task.id}
                      className={`bg-black/40 p-4 rounded-lg border ${
                        task.status === 'completed' ? 'border-green-500/30 opacity-60' : 'border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => updateTaskStatus(
                              task.id,
                              task.status === 'completed' ? 'pending' : 'completed'
                            )}
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-400 rounded-full hover:border-green-400" />
                            )}
                          </button>
                          <div>
                            <h4 className={`text-white font-semibold ${task.status === 'completed' ? 'line-through' : ''}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        {assignee ? (
                          <span className="text-purple-300">
                            <Users className="w-4 h-4 inline mr-1" />
                            {assignee.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                        {task.dueDate && (
                          <span className="text-orange-300">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center text-blue-400 py-8">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tasks yet</p>
              <p className="text-sm mt-1">Add tasks that caregivers can help with</p>
            </div>
          )}
        </div>
      )}

      {/* Boundary Reminders Tab */}
      {activeTab === 'boundaries' && (
        <div className="space-y-4">
          <h3 className="text-orange-300 font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Boundary Reminders
          </h3>

          <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 mb-4">
            <p className="text-orange-200/80 text-sm">
              These boundaries protect {IDENTITY_CONTEXT.name}'s wellbeing. Respecting them is an act of care.
              Boundaries are not personal rejection - they are necessary for safety and healing.
            </p>
          </div>

          {/* Core Boundaries */}
          <div>
            <h4 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Core Boundaries (Non-Negotiable)
            </h4>
            <div className="space-y-3">
              {boundaries.filter(b => b.isCore).map(boundary => (
                <div
                  key={boundary.id}
                  className="bg-red-900/20 p-4 rounded-lg border border-red-500/30"
                >
                  <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    {boundary.title}
                  </h5>
                  <p className="text-red-200/80 text-sm">{boundary.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Boundaries */}
          <div>
            <h4 className="text-orange-300 font-semibold mb-3">Additional Boundaries</h4>
            <div className="space-y-3">
              {boundaries.filter(b => !b.isCore).map(boundary => (
                <div
                  key={boundary.id}
                  className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30"
                >
                  <h5 className="text-white font-semibold mb-2">{boundary.title}</h5>
                  <p className="text-orange-200/80 text-sm">{boundary.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Kol's stated values */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mt-6">
            <h4 className="text-purple-300 font-semibold mb-3">Core Values to Honor</h4>
            <div className="flex flex-wrap gap-2">
              {IDENTITY_CONTEXT.values.map((value, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No-Ask Replenishment Lists Tab */}
      {activeTab === 'replenishment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-green-300 font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              No-Ask Replenishment Lists
            </h3>
            <button
              onClick={() => setShowAddForm(showAddForm === 'replenishment' ? null : 'replenishment')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-4">
            <p className="text-green-200/80 text-sm">
              Items on this list can be handled by caregivers without asking first.
              This reduces decision fatigue and cognitive load. Caregivers: if you see something running low, just handle it.
            </p>
          </div>

          {/* Add Item Form */}
          {showAddForm === 'replenishment' && (
            <div className="bg-black/60 p-6 rounded-lg border border-green-500/30 space-y-4">
              <h4 className="text-green-300 font-semibold">Add Item to Replenishment List</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={newReplenishment.name}
                    onChange={(e) => setNewReplenishment({ ...newReplenishment, name: e.target.value })}
                    placeholder="Item name"
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Category</label>
                  <select
                    value={newReplenishment.category}
                    onChange={(e) => setNewReplenishment({ ...newReplenishment, category: e.target.value as any })}
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="groceries">Groceries</option>
                    <option value="medications">Medications</option>
                    <option value="supplies">Supplies</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Quantity/Size</label>
                  <input
                    type="text"
                    value={newReplenishment.quantity}
                    onChange={(e) => setNewReplenishment({ ...newReplenishment, quantity: e.target.value })}
                    placeholder="e.g., 2 boxes, 1L, etc."
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Urgency</label>
                  <select
                    value={newReplenishment.urgency}
                    onChange={(e) => setNewReplenishment({ ...newReplenishment, urgency: e.target.value as any })}
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="low">Low - when convenient</option>
                    <option value="medium">Medium - soon</option>
                    <option value="high">High - needed now</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-green-300 text-sm font-semibold mb-2">Notes</label>
                <input
                  type="text"
                  value={newReplenishment.notes}
                  onChange={(e) => setNewReplenishment({ ...newReplenishment, notes: e.target.value })}
                  placeholder="Brand preference, location, etc."
                  className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="caregiverCanHandle"
                  checked={newReplenishment.caregiverCanHandle}
                  onChange={(e) => setNewReplenishment({ ...newReplenishment, caregiverCanHandle: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="caregiverCanHandle" className="text-green-300 text-sm">
                  Caregivers can handle without asking
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addReplenishmentItem}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddForm(null)}
                  className="px-4 py-2 bg-gray-600/30 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Categories */}
          {['medications', 'groceries', 'supplies', 'other'].map(category => {
            const items = replenishmentItems.filter(i => i.category === category);
            const CategoryIcon = getCategoryIcon(category);

            if (items.length === 0 && category !== 'medications' && category !== 'groceries') return null;

            return (
              <div key={category}>
                <button
                  onClick={() => toggleSection(category)}
                  className="flex items-center gap-2 text-white font-semibold mb-3 hover:text-green-300"
                >
                  {expandedSections.includes(category) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <CategoryIcon className="w-5 h-5 text-green-400" />
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({items.length})
                </button>

                {expandedSections.includes(category) && (
                  <div className="space-y-2 ml-7">
                    {items.length > 0 ? (
                      items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-green-500/20"
                        >
                          <div className="flex items-center gap-3">
                            {item.caregiverCanHandle && (
                              <CheckCircle className="w-4 h-4 text-green-400" title="Caregiver can handle" />
                            )}
                            <div>
                              <span className="text-white font-semibold">{item.name}</span>
                              {item.quantity && (
                                <span className="text-gray-400 ml-2">({item.quantity})</span>
                              )}
                              {item.notes && (
                                <p className="text-gray-400 text-xs mt-1">{item.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${getUrgencyColor(item.urgency)}`}>
                              {item.urgency}
                            </span>
                            <button
                              onClick={() => deleteReplenishmentItem(item.id)}
                              className="p-1 hover:bg-red-500/20 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">No items in this category</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Share Views Tab */}
      {activeTab === 'share' && (
        <div className="space-y-4">
          <h3 className="text-purple-300 font-semibold flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Caregiver Views
          </h3>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-4">
            <p className="text-purple-200/80 text-sm">
              Create shareable links for specific caregivers. They can view their personalized guide
              without needing an account. All sharing is consent-based and can be revoked at any time.
            </p>
          </div>

          {/* Create Share Form */}
          <div className="bg-black/60 p-6 rounded-lg border border-purple-500/30 space-y-4">
            <h4 className="text-purple-300 font-semibold">Create Shareable View</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">View Name *</label>
                <input
                  type="text"
                  value={shareForm.name}
                  onChange={(e) => setShareForm({ ...shareForm, name: e.target.value })}
                  placeholder="e.g., Guide for Quincy"
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">For Caregiver</label>
                <select
                  value={shareForm.caregiverId}
                  onChange={(e) => setShareForm({ ...shareForm, caregiverId: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                >
                  <option value="all">All (General Guide)</option>
                  {caregivers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Include Sections</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={shareForm.includeHelpHarms}
                    onChange={(e) => setShareForm({ ...shareForm, includeHelpHarms: e.target.checked })}
                    className="w-4 h-4"
                  />
                  What Helps/Harms
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={shareForm.includeScripts}
                    onChange={(e) => setShareForm({ ...shareForm, includeScripts: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Check-In Scripts
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={shareForm.includeBoundaries}
                    onChange={(e) => setShareForm({ ...shareForm, includeBoundaries: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Boundary Reminders
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={shareForm.includeReplenishment}
                    onChange={(e) => setShareForm({ ...shareForm, includeReplenishment: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Replenishment Lists
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={shareForm.includeTasks}
                    onChange={(e) => setShareForm({ ...shareForm, includeTasks: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Task List
                </label>
              </div>
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Link Expires</label>
              <select
                value={shareForm.expiresIn}
                onChange={(e) => setShareForm({ ...shareForm, expiresIn: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>

            <button
              onClick={generateShareableView}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              Generate Share Link
            </button>
          </div>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="bg-black/60 p-6 rounded-lg border border-green-500/30 text-center">
              <h4 className="text-green-300 font-semibold mb-4">Share Link Created!</h4>
              <img
                src={qrCodeUrl}
                alt="QR Code for sharing"
                className="mx-auto mb-4 rounded-lg"
              />
              <p className="text-gray-400 text-sm mb-4">
                Scan this QR code or copy the link below
              </p>
              <button
                onClick={() => {
                  const latestShare = shareableViews[shareableViews.length - 1];
                  if (latestShare) copyShareLink(latestShare.accessCode);
                }}
                className="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded-lg flex items-center gap-2 mx-auto"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}

          {/* Existing Shares */}
          {shareableViews.length > 0 && (
            <div className="mt-6">
              <h4 className="text-gray-400 font-semibold mb-3">Active Share Links</h4>
              <div className="space-y-2">
                {shareableViews.map(share => {
                  const caregiver = caregivers.find(c => c.id === share.caregiverId);
                  const isExpired = share.expiresAt && new Date(share.expiresAt) < new Date();

                  return (
                    <div
                      key={share.id}
                      className={`bg-black/40 p-4 rounded-lg border ${
                        isExpired ? 'border-red-500/30 opacity-60' : 'border-purple-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-white font-semibold">{share.name}</h5>
                          <p className="text-gray-400 text-sm">
                            For: {caregiver?.name || 'All Caregivers'}
                            {share.expiresAt && (
                              <span className="ml-2">
                                {isExpired ? '(Expired)' : `Expires: ${new Date(share.expiresAt).toLocaleDateString()}`}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isExpired && (
                            <>
                              <button
                                onClick={() => copyShareLink(share.accessCode)}
                                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg"
                                title="Copy link"
                              >
                                <Copy className="w-4 h-4 text-purple-400" />
                              </button>
                              <button
                                onClick={() => {
                                  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/caregiver-view/${share.accessCode}`)}`;
                                  setQrCodeUrl(url);
                                }}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg"
                                title="Show QR code"
                              >
                                <QrCode className="w-4 h-4 text-blue-400" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteShare(share.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
                            title="Revoke access"
                          >
                            <XCircle className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {share.includeHelpHarms && <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded">Helps/Harms</span>}
                        {share.includeScripts && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">Scripts</span>}
                        {share.includeBoundaries && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded">Boundaries</span>}
                        {share.includeReplenishment && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">Replenishment</span>}
                        {share.includeTasks && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded">Tasks</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-300 text-sm font-semibold mb-1">
              For {IDENTITY_CONTEXT.name}'s Support Network
            </p>
            <p className="text-purple-200/70 text-xs">
              This system exists to help caregivers provide trauma-informed support.
              When in doubt, ask. When you make mistakes, apologize and adjust.
              Your presence and consistency matter more than perfection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverInterface;
