import React, { useState, useEffect, useRef } from 'react';
import {
  FolderOpen, FileText, Plus, Trash2, Download, Calendar, Tag, Search, Filter,
  Upload, CheckSquare, Square, Package, AlertTriangle, Clock, DollarSign,
  Scale, User, Phone, Mail, Flag, ChevronDown, ChevronRight, Edit, Star,
  Shield, Lock, Briefcase, Heart, FileCheck, Gavel, Users, AlertCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DOCUMENTATION_VAULT, LEGAL_DISABILITY_SUPPORT } from '../../data/kol-master-feature-list';

// ========== INTERFACES ==========
interface VaultDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  date: string;
  provider?: string;
  tags: string[];
  fileRef?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  notes: string;
  important: boolean;
  createdAt: number;
  updatedAt: number;
}

type DocumentCategory =
  | 'Diagnoses'
  | 'Test Results'
  | 'Letters'
  | 'Disability Filings'
  | 'Appeals'
  | 'Hearing Prep';

interface DisabilityStatus {
  id: string;
  type: 'SSI' | 'SSDI' | 'State Disability' | 'Veterans' | 'Other';
  status: 'Not Applied' | 'Application Pending' | 'Initial Denial' | 'Reconsideration' | 'ALJ Hearing' | 'Appeals Council' | 'Federal Court' | 'Approved' | 'Terminated';
  applicationDate?: string;
  lastUpdateDate?: string;
  nextDeadline?: string;
  caseNumber?: string;
  notes: string;
}

interface AppealTimeline {
  id: string;
  disabilityStatusId: string;
  stage: string;
  dueDate: string;
  completed: boolean;
  notes: string;
  reminderSet: boolean;
}

interface EvidenceChecklistItem {
  id: string;
  category: string;
  item: string;
  obtained: boolean;
  documentId?: string;
  notes: string;
}

interface CostEntry {
  id: string;
  date: string;
  category: 'Medical' | 'Transportation' | 'Equipment' | 'Medication' | 'Caregiver' | 'Lost Wages' | 'Other';
  description: string;
  amount: number;
  receipt?: string;
  notes: string;
}

interface ImpactStatement {
  id: string;
  date: string;
  title: string;
  category: 'Physical' | 'Mental' | 'Daily Living' | 'Work' | 'Social' | 'Financial';
  content: string;
  severity: 1 | 2 | 3 | 4 | 5;
}

interface AdvocateContact {
  id: string;
  name: string;
  role: 'Attorney' | 'Disability Advocate' | 'Social Worker' | 'Patient Advocate' | 'Other';
  organization?: string;
  phone?: string;
  email?: string;
  specialization?: string;
  notes: string;
  isPrimary: boolean;
}

interface ExportPacket {
  name: string;
  purpose: 'Doctor Visit' | 'Disability Hearing' | 'Appeal' | 'Emergency' | 'Custom';
  documentIds: string[];
  includeImpactStatements: boolean;
  includeCostSummary: boolean;
  createdAt: number;
}

// ========== CONSTANTS ==========
const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Diagnoses',
  'Test Results',
  'Letters',
  'Disability Filings',
  'Appeals',
  'Hearing Prep'
];

const COMMON_TAGS = [
  'Critical', 'SSA Required', 'Medical Evidence', 'RFC Support', 'Specialist',
  'Hospital', 'Lab', 'Imaging', 'Mental Health', 'Physical Limitations',
  'Work Restrictions', 'Treatment Notes', 'Prescription', 'Diagnosis Confirmation'
];

const DEFAULT_EVIDENCE_CHECKLIST: Omit<EvidenceChecklistItem, 'id' | 'obtained' | 'documentId' | 'notes'>[] = [
  { category: 'Medical', item: 'Primary care physician records' },
  { category: 'Medical', item: 'Specialist records (all conditions)' },
  { category: 'Medical', item: 'Hospital records' },
  { category: 'Medical', item: 'Emergency room records' },
  { category: 'Medical', item: 'Mental health treatment records' },
  { category: 'Testing', item: 'Lab results' },
  { category: 'Testing', item: 'Imaging (X-rays, MRI, CT scans)' },
  { category: 'Testing', item: 'Psychological testing' },
  { category: 'Testing', item: 'Functional capacity evaluation' },
  { category: 'Letters', item: 'Treating physician statement' },
  { category: 'Letters', item: 'Medical source statement (RFC)' },
  { category: 'Letters', item: 'Mental health professional statement' },
  { category: 'Work', item: 'Employment history (15 years)' },
  { category: 'Work', item: 'Job descriptions' },
  { category: 'Work', item: 'Employer statements' },
  { category: 'Personal', item: 'Function report (ADL questionnaire)' },
  { category: 'Personal', item: 'Third-party function report' },
  { category: 'Personal', item: 'Pain/symptom diary' },
  { category: 'Personal', item: 'Impact statements' }
];

// ========== COMPONENT ==========
const DocumentationVault: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'documents' | 'disability' | 'evidence' | 'costs' | 'impact' | 'advocates' | 'export'>('documents');
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [disabilityStatuses, setDisabilityStatuses] = useState<DisabilityStatus[]>([]);
  const [appealTimelines, setAppealTimelines] = useState<AppealTimeline[]>([]);
  const [evidenceChecklist, setEvidenceChecklist] = useState<EvidenceChecklistItem[]>([]);
  const [costEntries, setCostEntries] = useState<CostEntry[]>([]);
  const [impactStatements, setImpactStatements] = useState<ImpactStatement[]>([]);
  const [advocateContacts, setAdvocateContacts] = useState<AdvocateContact[]>([]);
  const [exportPackets, setExportPackets] = useState<ExportPacket[]>([]);

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [providerFilter, setProviderFilter] = useState('');
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [showDisabilityForm, setShowDisabilityForm] = useState(false);
  const [showCostForm, setShowCostForm] = useState(false);
  const [showImpactForm, setShowImpactForm] = useState(false);
  const [showAdvocateForm, setShowAdvocateForm] = useState(false);
  const [showExportBuilder, setShowExportBuilder] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['documents']);

  // Form state
  const [documentForm, setDocumentForm] = useState<Partial<VaultDocument>>({
    tags: [],
    important: false
  });
  const [disabilityForm, setDisabilityForm] = useState<Partial<DisabilityStatus>>({
    status: 'Not Applied'
  });
  const [costForm, setCostForm] = useState<Partial<CostEntry>>({});
  const [impactForm, setImpactForm] = useState<Partial<ImpactStatement>>({
    severity: 3
  });
  const [advocateForm, setAdvocateForm] = useState<Partial<AdvocateContact>>({
    isPrimary: false
  });
  const [exportForm, setExportForm] = useState<Partial<ExportPacket>>({
    documentIds: [],
    includeImpactStatements: false,
    includeCostSummary: false,
    purpose: 'Custom'
  });

  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedDocs = localStorage.getItem('vault-documents');
      const storedDisability = localStorage.getItem('vault-disability-status');
      const storedTimelines = localStorage.getItem('vault-appeal-timelines');
      const storedEvidence = localStorage.getItem('vault-evidence-checklist');
      const storedCosts = localStorage.getItem('vault-cost-entries');
      const storedImpact = localStorage.getItem('vault-impact-statements');
      const storedAdvocates = localStorage.getItem('vault-advocate-contacts');
      const storedPackets = localStorage.getItem('vault-export-packets');

      if (storedDocs) setDocuments(JSON.parse(storedDocs));
      if (storedDisability) setDisabilityStatuses(JSON.parse(storedDisability));
      if (storedTimelines) setAppealTimelines(JSON.parse(storedTimelines));
      if (storedCosts) setCostEntries(JSON.parse(storedCosts));
      if (storedImpact) setImpactStatements(JSON.parse(storedImpact));
      if (storedAdvocates) setAdvocateContacts(JSON.parse(storedAdvocates));
      if (storedPackets) setExportPackets(JSON.parse(storedPackets));

      // Initialize evidence checklist if empty
      if (storedEvidence) {
        setEvidenceChecklist(JSON.parse(storedEvidence));
      } else {
        const initialChecklist: EvidenceChecklistItem[] = DEFAULT_EVIDENCE_CHECKLIST.map((item, idx) => ({
          ...item,
          id: `evidence_${idx}`,
          obtained: false,
          notes: ''
        }));
        setEvidenceChecklist(initialChecklist);
        localStorage.setItem('vault-evidence-checklist', JSON.stringify(initialChecklist));
      }
    };

    loadData();
  }, []);

  // Save functions
  const saveDocuments = (docs: VaultDocument[]) => {
    setDocuments(docs);
    localStorage.setItem('vault-documents', JSON.stringify(docs));
  };

  const saveDisabilityStatuses = (statuses: DisabilityStatus[]) => {
    setDisabilityStatuses(statuses);
    localStorage.setItem('vault-disability-status', JSON.stringify(statuses));
  };

  const saveEvidenceChecklist = (checklist: EvidenceChecklistItem[]) => {
    setEvidenceChecklist(checklist);
    localStorage.setItem('vault-evidence-checklist', JSON.stringify(checklist));
  };

  const saveCostEntries = (costs: CostEntry[]) => {
    setCostEntries(costs);
    localStorage.setItem('vault-cost-entries', JSON.stringify(costs));
  };

  const saveImpactStatements = (statements: ImpactStatement[]) => {
    setImpactStatements(statements);
    localStorage.setItem('vault-impact-statements', JSON.stringify(statements));
  };

  const saveAdvocateContacts = (contacts: AdvocateContact[]) => {
    setAdvocateContacts(contacts);
    localStorage.setItem('vault-advocate-contacts', JSON.stringify(contacts));
  };

  // Document handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file reference (in real app, would upload to secure storage)
      const fileRef = `file_${Date.now()}_${file.name}`;
      setDocumentForm({
        ...documentForm,
        fileRef,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      toast.success(`File "${file.name}" selected`);
    }
  };

  const addDocument = () => {
    if (!documentForm.title || !documentForm.category) {
      toast.error('Title and category are required');
      return;
    }

    const newDoc: VaultDocument = {
      id: `doc_${Date.now()}`,
      title: documentForm.title!,
      description: documentForm.description || '',
      category: documentForm.category as DocumentCategory,
      date: documentForm.date || new Date().toISOString().split('T')[0],
      provider: documentForm.provider,
      tags: documentForm.tags || [],
      fileRef: documentForm.fileRef,
      fileName: documentForm.fileName,
      fileSize: documentForm.fileSize,
      fileType: documentForm.fileType,
      notes: documentForm.notes || '',
      important: documentForm.important || false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    saveDocuments([...documents, newDoc]);
    setDocumentForm({ tags: [], important: false });
    setShowDocumentForm(false);
    toast.success('Document added to vault');
  };

  const deleteDocument = (id: string) => {
    saveDocuments(documents.filter(d => d.id !== id));
    setSelectedDocuments(selectedDocuments.filter(did => did !== id));
    toast.success('Document removed');
  };

  const toggleDocumentImportant = (id: string) => {
    const updated = documents.map(d =>
      d.id === id ? { ...d, important: !d.important, updatedAt: Date.now() } : d
    );
    saveDocuments(updated);
  };

  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(did => did !== id) : [...prev, id]
    );
  };

  // Disability status handlers
  const addDisabilityStatus = () => {
    if (!disabilityForm.type) {
      toast.error('Disability type is required');
      return;
    }

    const newStatus: DisabilityStatus = {
      id: `disability_${Date.now()}`,
      type: disabilityForm.type as DisabilityStatus['type'],
      status: disabilityForm.status || 'Not Applied',
      applicationDate: disabilityForm.applicationDate,
      lastUpdateDate: new Date().toISOString().split('T')[0],
      nextDeadline: disabilityForm.nextDeadline,
      caseNumber: disabilityForm.caseNumber,
      notes: disabilityForm.notes || ''
    };

    saveDisabilityStatuses([...disabilityStatuses, newStatus]);
    setDisabilityForm({ status: 'Not Applied' });
    setShowDisabilityForm(false);
    toast.success('Disability status added');
  };

  const updateDisabilityStatus = (id: string, updates: Partial<DisabilityStatus>) => {
    const updated = disabilityStatuses.map(s =>
      s.id === id ? { ...s, ...updates, lastUpdateDate: new Date().toISOString().split('T')[0] } : s
    );
    saveDisabilityStatuses(updated);
    toast.success('Status updated');
  };

  // Cost entry handlers
  const addCostEntry = () => {
    if (!costForm.category || !costForm.amount) {
      toast.error('Category and amount are required');
      return;
    }

    const newCost: CostEntry = {
      id: `cost_${Date.now()}`,
      date: costForm.date || new Date().toISOString().split('T')[0],
      category: costForm.category as CostEntry['category'],
      description: costForm.description || '',
      amount: costForm.amount!,
      receipt: costForm.receipt,
      notes: costForm.notes || ''
    };

    saveCostEntries([...costEntries, newCost]);
    setCostForm({});
    setShowCostForm(false);
    toast.success('Cost entry added');
  };

  // Impact statement handlers
  const addImpactStatement = () => {
    if (!impactForm.title || !impactForm.content || !impactForm.category) {
      toast.error('Title, category, and content are required');
      return;
    }

    const newStatement: ImpactStatement = {
      id: `impact_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: impactForm.title!,
      category: impactForm.category as ImpactStatement['category'],
      content: impactForm.content!,
      severity: impactForm.severity || 3
    };

    saveImpactStatements([...impactStatements, newStatement]);
    setImpactForm({ severity: 3 });
    setShowImpactForm(false);
    toast.success('Impact statement added');
  };

  // Advocate contact handlers
  const addAdvocateContact = () => {
    if (!advocateForm.name || !advocateForm.role) {
      toast.error('Name and role are required');
      return;
    }

    const newAdvocate: AdvocateContact = {
      id: `advocate_${Date.now()}`,
      name: advocateForm.name!,
      role: advocateForm.role as AdvocateContact['role'],
      organization: advocateForm.organization,
      phone: advocateForm.phone,
      email: advocateForm.email,
      specialization: advocateForm.specialization,
      notes: advocateForm.notes || '',
      isPrimary: advocateForm.isPrimary || false
    };

    saveAdvocateContacts([...advocateContacts, newAdvocate]);
    setAdvocateForm({ isPrimary: false });
    setShowAdvocateForm(false);
    toast.success('Contact added');
  };

  // Export packet builder
  const createExportPacket = () => {
    if (!exportForm.name || selectedDocuments.length === 0) {
      toast.error('Name and at least one document are required');
      return;
    }

    const selectedDocs = documents.filter(d => selectedDocuments.includes(d.id));

    // Build export content
    let exportContent = `DOCUMENTATION PACKET: ${exportForm.name}\n`;
    exportContent += `Purpose: ${exportForm.purpose}\n`;
    exportContent += `Created: ${new Date().toLocaleDateString()}\n`;
    exportContent += `\n${'='.repeat(60)}\n\n`;

    // Document list
    exportContent += `INCLUDED DOCUMENTS (${selectedDocs.length})\n`;
    exportContent += `${'─'.repeat(40)}\n\n`;

    selectedDocs.forEach((doc, idx) => {
      exportContent += `${idx + 1}. ${doc.title}\n`;
      exportContent += `   Category: ${doc.category}\n`;
      exportContent += `   Date: ${new Date(doc.date).toLocaleDateString()}\n`;
      if (doc.provider) exportContent += `   Provider: ${doc.provider}\n`;
      if (doc.description) exportContent += `   Description: ${doc.description}\n`;
      if (doc.fileName) exportContent += `   File: ${doc.fileName}\n`;
      exportContent += `\n`;
    });

    // Impact statements
    if (exportForm.includeImpactStatements && impactStatements.length > 0) {
      exportContent += `\n${'='.repeat(60)}\n`;
      exportContent += `IMPACT STATEMENTS\n`;
      exportContent += `${'─'.repeat(40)}\n\n`;

      impactStatements.forEach(statement => {
        exportContent += `[${statement.category}] ${statement.title}\n`;
        exportContent += `Severity: ${statement.severity}/5\n`;
        exportContent += `Date: ${new Date(statement.date).toLocaleDateString()}\n`;
        exportContent += `\n${statement.content}\n\n`;
        exportContent += `${'─'.repeat(20)}\n\n`;
      });
    }

    // Cost summary
    if (exportForm.includeCostSummary && costEntries.length > 0) {
      exportContent += `\n${'='.repeat(60)}\n`;
      exportContent += `COST DOCUMENTATION SUMMARY\n`;
      exportContent += `${'─'.repeat(40)}\n\n`;

      const totalCost = costEntries.reduce((sum, c) => sum + c.amount, 0);
      const byCategory: Record<string, number> = {};
      costEntries.forEach(c => {
        byCategory[c.category] = (byCategory[c.category] || 0) + c.amount;
      });

      Object.entries(byCategory).forEach(([cat, amount]) => {
        exportContent += `${cat}: $${amount.toFixed(2)}\n`;
      });
      exportContent += `\nTOTAL: $${totalCost.toFixed(2)}\n`;
    }

    // Download
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportForm.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();

    toast.success('Export packet created and downloaded');
    setSelectedDocuments([]);
    setExportForm({
      documentIds: [],
      includeImpactStatements: false,
      includeCostSummary: false,
      purpose: 'Custom'
    });
    setShowExportBuilder(false);
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        doc.title.toLowerCase().includes(search) ||
        doc.description.toLowerCase().includes(search) ||
        doc.provider?.toLowerCase().includes(search) ||
        doc.tags.some(tag => tag.toLowerCase().includes(search));
      if (!matchesSearch) return false;
    }

    if (providerFilter && doc.provider?.toLowerCase() !== providerFilter.toLowerCase()) {
      return false;
    }

    if (dateRange.start && new Date(doc.date) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(doc.date) > new Date(dateRange.end)) return false;

    return true;
  }).sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get unique providers for filter
  const uniqueProviders = [...new Set(documents.map(d => d.provider).filter(Boolean))];

  // Calculate evidence progress
  const evidenceProgress = evidenceChecklist.length > 0
    ? Math.round((evidenceChecklist.filter(e => e.obtained).length / evidenceChecklist.length) * 100)
    : 0;

  // Calculate total costs
  const totalCosts = costEntries.reduce((sum, c) => sum + c.amount, 0);

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Add tag helper
  const addTag = () => {
    if (!newTag.trim()) return;
    setDocumentForm({
      ...documentForm,
      tags: [...(documentForm.tags || []), newTag]
    });
    setNewTag('');
  };

  // Get status color
  const getStatusColor = (status: DisabilityStatus['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Application Pending': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Initial Denial': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Reconsideration':
      case 'ALJ Hearing':
      case 'Appeals Council':
      case 'Federal Court': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Terminated': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Get severity color
  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'text-red-400';
    if (severity >= 3) return 'text-orange-400';
    if (severity >= 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-6 rounded-xl border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-7 h-7 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Documentation & Evidence Vault</h2>
            <p className="text-purple-300 text-sm">Secure storage for medical and disability documentation</p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-purple-900/40 border border-purple-500/40 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-purple-300 font-semibold mb-1">Your Data Stays Local</h4>
            <p className="text-purple-200/70 text-sm">
              All your documentation is stored locally on your device using browser storage.
              Your medical records, disability filings, and personal information never leave your computer.
              We recommend keeping your own secure backups of important files.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-black/40 p-3 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-xs font-semibold">Documents</span>
          </div>
          <p className="text-2xl font-bold text-white">{documents.length}</p>
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-xs font-semibold">Evidence</span>
          </div>
          <p className="text-2xl font-bold text-white">{evidenceProgress}%</p>
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-xs font-semibold">Costs Tracked</span>
          </div>
          <p className="text-2xl font-bold text-white">${totalCosts.toFixed(0)}</p>
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-xs font-semibold">Impact Statements</span>
          </div>
          <p className="text-2xl font-bold text-white">{impactStatements.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-purple-500/30 pb-4">
        {[
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'disability', label: 'Disability Status', icon: Briefcase },
          { id: 'evidence', label: 'Evidence Checklist', icon: FileCheck },
          { id: 'costs', label: 'Cost Tracking', icon: DollarSign },
          { id: 'impact', label: 'Impact Statements', icon: Heart },
          { id: 'advocates', label: 'Advocates', icon: Users },
          { id: 'export', label: 'Export Packets', icon: Package },
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

      {/* DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div>
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents, tags, providers..."
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-purple-400/50"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white appearance-none"
              >
                <option value="All">All Categories</option>
                {DOCUMENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowDocumentForm(!showDocumentForm)}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-purple-300 text-xs mb-1">From Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-purple-300 text-xs mb-1">To Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-purple-300 text-xs mb-1">Provider</label>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="">All Providers</option>
                {uniqueProviders.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selection Actions */}
          {selectedDocuments.length > 0 && (
            <div className="bg-purple-900/40 border border-purple-500/40 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-semibold">
                  {selectedDocuments.length} document(s) selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setExportForm({ ...exportForm, documentIds: selectedDocuments });
                      setShowExportBuilder(true);
                      setActiveTab('export');
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg text-sm"
                  >
                    <Package className="w-4 h-4" />
                    Create Packet
                  </button>
                  <button
                    onClick={() => setSelectedDocuments([])}
                    className="px-3 py-1 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Document Form */}
          {showDocumentForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-purple-500/30 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-purple-300 font-semibold text-lg">Add Document</h3>
                <button onClick={() => setShowDocumentForm(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={documentForm.title || ''}
                    onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })}
                    placeholder="Diagnosis letter, Lab results..."
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Category *</label>
                  <select
                    value={documentForm.category || ''}
                    onChange={(e) => setDocumentForm({ ...documentForm, category: e.target.value as DocumentCategory })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select category...</option>
                    {DOCUMENT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={documentForm.date || ''}
                    onChange={(e) => setDocumentForm({ ...documentForm, date: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Provider/Source</label>
                  <input
                    type="text"
                    value={documentForm.provider || ''}
                    onChange={(e) => setDocumentForm({ ...documentForm, provider: e.target.value })}
                    placeholder="Dr. Smith, City Hospital..."
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={documentForm.description || ''}
                  onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
                  placeholder="Brief description of document contents..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Attach File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className="hidden"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </button>
                  {documentForm.fileName && (
                    <span className="text-green-300 text-sm self-center">
                      {documentForm.fileName} ({Math.round((documentForm.fileSize || 0) / 1024)}KB)
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1">Supported: PDF, DOC, DOCX, JPG, PNG, GIF</p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add tag..."
                    className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                  <button onClick={addTag} className="px-4 py-2 bg-purple-600/30 text-purple-300 rounded-lg">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COMMON_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setDocumentForm({ ...documentForm, tags: [...(documentForm.tags || []), tag] })}
                      className="px-2 py-1 bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 text-xs rounded"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {documentForm.tags?.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                      {tag}
                      <button
                        onClick={() => {
                          const tags = documentForm.tags?.filter((_, i) => i !== idx) || [];
                          setDocumentForm({ ...documentForm, tags });
                        }}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Notes</label>
                <textarea
                  value={documentForm.notes || ''}
                  onChange={(e) => setDocumentForm({ ...documentForm, notes: e.target.value })}
                  placeholder="Additional notes..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  rows={2}
                />
              </div>

              {/* Important */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="doc-important"
                  checked={documentForm.important}
                  onChange={(e) => setDocumentForm({ ...documentForm, important: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="doc-important" className="text-purple-300 font-semibold">
                  Mark as Critical/Important
                </label>
              </div>

              <button
                onClick={addDocument}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Add to Vault
              </button>
            </div>
          )}

          {/* Documents List */}
          <div className="space-y-3">
            {filteredDocuments.map(doc => (
              <div
                key={doc.id}
                className={`bg-black/40 p-4 rounded-lg border-2 transition-all ${
                  doc.important
                    ? 'border-yellow-500/50 bg-yellow-900/10'
                    : selectedDocuments.includes(doc.id)
                    ? 'border-purple-500/50'
                    : 'border-purple-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleDocumentSelection(doc.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {selectedDocuments.includes(doc.id) ? (
                      <CheckSquare className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {doc.important && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                      <h4 className="text-white font-bold text-lg">{doc.title}</h4>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                        {doc.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(doc.date).toLocaleDateString()}
                      </div>
                      {doc.provider && <span>{doc.provider}</span>}
                      {doc.fileName && (
                        <span className="text-blue-400">{doc.fileName}</span>
                      )}
                    </div>

                    {doc.description && (
                      <p className="text-gray-300 text-sm mb-2">{doc.description}</p>
                    )}

                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {doc.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded border border-violet-500/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {doc.notes && (
                      <p className="text-gray-400 text-sm italic mt-2">{doc.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleDocumentImportant(doc.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        doc.important
                          ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                          : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${doc.important ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center text-purple-400 py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No documents found</p>
              <p className="text-sm mt-2">
                {searchTerm || selectedCategory !== 'All'
                  ? 'Try adjusting your search or filter'
                  : 'Click "Add Document" to add your first document'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* DISABILITY STATUS TAB */}
      {activeTab === 'disability' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-purple-300 font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Disability Status Tracking
            </h3>
            <button
              onClick={() => setShowDisabilityForm(!showDisabilityForm)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Status
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-300 font-semibold mb-1">SSI/SSDI Process Stages</h4>
                <p className="text-blue-200/70 text-sm">
                  Initial Application &rarr; Initial Denial (65%) &rarr; Reconsideration &rarr;
                  ALJ Hearing (highest approval rate) &rarr; Appeals Council &rarr; Federal Court.
                  Most cases are won at the ALJ hearing stage with proper documentation.
                </p>
              </div>
            </div>
          </div>

          {showDisabilityForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-purple-500/30 mb-6 space-y-4">
              <h4 className="text-purple-300 font-semibold">Add Disability Status</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Type *</label>
                  <select
                    value={disabilityForm.type || ''}
                    onChange={(e) => setDisabilityForm({ ...disabilityForm, type: e.target.value as any })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select type...</option>
                    <option value="SSI">SSI (Supplemental Security Income)</option>
                    <option value="SSDI">SSDI (Social Security Disability Insurance)</option>
                    <option value="State Disability">State Disability</option>
                    <option value="Veterans">Veterans Benefits</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Current Status</label>
                  <select
                    value={disabilityForm.status || 'Not Applied'}
                    onChange={(e) => setDisabilityForm({ ...disabilityForm, status: e.target.value as any })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Not Applied">Not Applied</option>
                    <option value="Application Pending">Application Pending</option>
                    <option value="Initial Denial">Initial Denial</option>
                    <option value="Reconsideration">Reconsideration</option>
                    <option value="ALJ Hearing">ALJ Hearing</option>
                    <option value="Appeals Council">Appeals Council</option>
                    <option value="Federal Court">Federal Court</option>
                    <option value="Approved">Approved</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Application Date</label>
                  <input
                    type="date"
                    value={disabilityForm.applicationDate || ''}
                    onChange={(e) => setDisabilityForm({ ...disabilityForm, applicationDate: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm font-semibold mb-2">Next Deadline</label>
                  <input
                    type="date"
                    value={disabilityForm.nextDeadline || ''}
                    onChange={(e) => setDisabilityForm({ ...disabilityForm, nextDeadline: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Case Number</label>
                <input
                  type="text"
                  value={disabilityForm.caseNumber || ''}
                  onChange={(e) => setDisabilityForm({ ...disabilityForm, caseNumber: e.target.value })}
                  placeholder="SSA case number..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-semibold mb-2">Notes</label>
                <textarea
                  value={disabilityForm.notes || ''}
                  onChange={(e) => setDisabilityForm({ ...disabilityForm, notes: e.target.value })}
                  placeholder="Important details, contacts, next steps..."
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                  rows={3}
                />
              </div>

              <button
                onClick={addDisabilityStatus}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Add Status
              </button>
            </div>
          )}

          {/* Status Cards */}
          {disabilityStatuses.length > 0 ? (
            <div className="space-y-4">
              {disabilityStatuses.map(status => (
                <div key={status.id} className="bg-black/40 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-bold text-lg">{status.type}</h4>
                      {status.caseNumber && (
                        <p className="text-gray-400 text-sm">Case #: {status.caseNumber}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(status.status)}`}>
                      {status.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                    {status.applicationDate && (
                      <div>
                        <span className="text-gray-400">Applied:</span>
                        <span className="text-white ml-2">{new Date(status.applicationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {status.lastUpdateDate && (
                      <div>
                        <span className="text-gray-400">Last Update:</span>
                        <span className="text-white ml-2">{new Date(status.lastUpdateDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {status.nextDeadline && (
                      <div className={new Date(status.nextDeadline) < new Date() ? 'text-red-400' : ''}>
                        <span className={new Date(status.nextDeadline) < new Date() ? 'text-red-400' : 'text-gray-400'}>
                          Deadline:
                        </span>
                        <span className={`ml-2 font-semibold ${new Date(status.nextDeadline) < new Date() ? 'text-red-400' : 'text-orange-300'}`}>
                          {new Date(status.nextDeadline).toLocaleDateString()}
                          {new Date(status.nextDeadline) < new Date() && ' (OVERDUE)'}
                        </span>
                      </div>
                    )}
                  </div>

                  {status.notes && (
                    <p className="text-gray-300 text-sm bg-black/20 p-2 rounded">{status.notes}</p>
                  )}

                  {/* Status Update Quick Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {status.status !== 'Approved' && status.status !== 'Terminated' && (
                      <>
                        <button
                          onClick={() => {
                            const statusOrder = ['Not Applied', 'Application Pending', 'Initial Denial', 'Reconsideration', 'ALJ Hearing', 'Appeals Council', 'Federal Court', 'Approved'];
                            const currentIdx = statusOrder.indexOf(status.status);
                            if (currentIdx < statusOrder.length - 1) {
                              updateDisabilityStatus(status.id, { status: statusOrder[currentIdx + 1] as any });
                            }
                          }}
                          className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-sm rounded"
                        >
                          Advance Stage
                        </button>
                        <button
                          onClick={() => updateDisabilityStatus(status.id, { status: 'Approved' })}
                          className="px-3 py-1 bg-green-600/30 hover:bg-green-600/50 text-green-300 text-sm rounded"
                        >
                          Mark Approved
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-purple-400 py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No disability status tracked</p>
              <p className="text-sm mt-2">Click "Add Status" to track your SSI/SSDI application</p>
            </div>
          )}
        </div>
      )}

      {/* EVIDENCE CHECKLIST TAB */}
      {activeTab === 'evidence' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-purple-300 font-semibold flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Evidence Checklist
              </h3>
              <p className="text-gray-400 text-sm">Track required documentation for disability claims</p>
            </div>
            <div className="text-right">
              <p className="text-purple-300 font-bold text-2xl">{evidenceProgress}%</p>
              <p className="text-gray-400 text-xs">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/40 rounded-full h-4 mb-6 border border-purple-500/30">
            <div
              className="bg-gradient-to-r from-purple-600 to-violet-500 h-full rounded-full transition-all"
              style={{ width: `${evidenceProgress}%` }}
            />
          </div>

          {/* Checklist by Category */}
          {['Medical', 'Testing', 'Letters', 'Work', 'Personal'].map(category => {
            const categoryItems = evidenceChecklist.filter(e => e.category === category);
            const categoryComplete = categoryItems.filter(e => e.obtained).length;

            return (
              <div key={category} className="mb-4">
                <button
                  onClick={() => toggleSection(category)}
                  className="flex items-center justify-between w-full bg-black/40 p-3 rounded-lg border border-purple-500/20 hover:border-purple-500/40"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections.includes(category) ? (
                      <ChevronDown className="w-4 h-4 text-purple-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-white font-semibold">{category}</span>
                  </div>
                  <span className="text-purple-300 text-sm">
                    {categoryComplete}/{categoryItems.length} complete
                  </span>
                </button>

                {expandedSections.includes(category) && (
                  <div className="mt-2 space-y-2 pl-4">
                    {categoryItems.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          item.obtained
                            ? 'bg-green-900/20 border-green-500/30'
                            : 'bg-black/20 border-gray-600/30'
                        }`}
                      >
                        <button
                          onClick={() => {
                            const updated = evidenceChecklist.map(e =>
                              e.id === item.id ? { ...e, obtained: !e.obtained } : e
                            );
                            saveEvidenceChecklist(updated);
                          }}
                          className="flex-shrink-0"
                        >
                          {item.obtained ? (
                            <CheckSquare className="w-5 h-5 text-green-400" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                          )}
                        </button>
                        <span className={`flex-1 ${item.obtained ? 'text-green-300 line-through opacity-70' : 'text-white'}`}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* COST TRACKING TAB */}
      {activeTab === 'costs' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-green-300 font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Documentation
              </h3>
              <p className="text-gray-400 text-sm">Track disability-related expenses</p>
            </div>
            <button
              onClick={() => setShowCostForm(!showCostForm)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Cost
            </button>
          </div>

          {/* Total Summary */}
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-green-300 font-semibold">Total Documented Costs:</span>
              <span className="text-green-400 font-bold text-2xl">${totalCosts.toFixed(2)}</span>
            </div>
          </div>

          {showCostForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-green-500/30 mb-6 space-y-4">
              <h4 className="text-green-300 font-semibold">Add Cost Entry</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Category *</label>
                  <select
                    value={costForm.category || ''}
                    onChange={(e) => setCostForm({ ...costForm, category: e.target.value as any })}
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select category...</option>
                    <option value="Medical">Medical</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Medication">Medication</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Lost Wages">Lost Wages</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costForm.amount || ''}
                    onChange={(e) => setCostForm({ ...costForm, amount: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={costForm.date || ''}
                    onChange={(e) => setCostForm({ ...costForm, date: e.target.value })}
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    value={costForm.description || ''}
                    onChange={(e) => setCostForm({ ...costForm, description: e.target.value })}
                    placeholder="Brief description..."
                    className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <button
                onClick={addCostEntry}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Add Cost Entry
              </button>
            </div>
          )}

          {/* Cost Entries */}
          {costEntries.length > 0 ? (
            <div className="space-y-2">
              {costEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(cost => (
                  <div key={cost.id} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                        {cost.category}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(cost.date).toLocaleDateString()}
                      </span>
                      <span className="text-white">{cost.description || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 font-bold">${cost.amount.toFixed(2)}</span>
                      <button
                        onClick={() => saveCostEntries(costEntries.filter(c => c.id !== cost.id))}
                        className="p-1 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-green-400 py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No costs tracked</p>
              <p className="text-sm mt-2">Document expenses to support your disability claim</p>
            </div>
          )}
        </div>
      )}

      {/* IMPACT STATEMENTS TAB */}
      {activeTab === 'impact' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-orange-300 font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Impact Statements
              </h3>
              <p className="text-gray-400 text-sm">Document how conditions affect daily life</p>
            </div>
            <button
              onClick={() => setShowImpactForm(!showImpactForm)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Statement
            </button>
          </div>

          {/* Tips */}
          <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 mb-6">
            <h4 className="text-orange-300 font-semibold mb-2">Writing Effective Impact Statements</h4>
            <ul className="text-orange-200/70 text-sm space-y-1">
              <li>- Be specific about what you cannot do or have difficulty doing</li>
              <li>- Include examples of bad days and good days</li>
              <li>- Describe how symptoms affect work, self-care, and relationships</li>
              <li>- Document frequency and duration of symptoms</li>
              <li>- Explain what happens when you try to push through</li>
            </ul>
          </div>

          {showImpactForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-orange-500/30 mb-6 space-y-4">
              <h4 className="text-orange-300 font-semibold">Add Impact Statement</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-orange-300 text-sm font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={impactForm.title || ''}
                    onChange={(e) => setImpactForm({ ...impactForm, title: e.target.value })}
                    placeholder="How POTS affects my work..."
                    className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-orange-300 text-sm font-semibold mb-2">Category *</label>
                  <select
                    value={impactForm.category || ''}
                    onChange={(e) => setImpactForm({ ...impactForm, category: e.target.value as any })}
                    className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select category...</option>
                    <option value="Physical">Physical Limitations</option>
                    <option value="Mental">Mental/Cognitive</option>
                    <option value="Daily Living">Daily Living Activities</option>
                    <option value="Work">Work/Employment</option>
                    <option value="Social">Social/Relationships</option>
                    <option value="Financial">Financial Impact</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">Severity (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => setImpactForm({ ...impactForm, severity: level as any })}
                      className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                        (impactForm.severity || 3) >= level
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                          : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-orange-300 text-sm font-semibold mb-2">Statement Content *</label>
                <textarea
                  value={impactForm.content || ''}
                  onChange={(e) => setImpactForm({ ...impactForm, content: e.target.value })}
                  placeholder="Describe in detail how your condition affects you..."
                  className="w-full bg-black/40 border border-orange-500/30 rounded-lg px-4 py-2 text-white"
                  rows={6}
                />
              </div>

              <button
                onClick={addImpactStatement}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Save Statement
              </button>
            </div>
          )}

          {/* Statements List */}
          {impactStatements.length > 0 ? (
            <div className="space-y-4">
              {impactStatements
                .sort((a, b) => b.severity - a.severity)
                .map(statement => (
                  <div key={statement.id} className="bg-black/40 p-4 rounded-lg border border-orange-500/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{statement.title}</h4>
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded">
                            {statement.category}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{new Date(statement.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getSeverityColor(statement.severity)}`}>
                          Severity: {statement.severity}/5
                        </span>
                        <button
                          onClick={() => saveImpactStatements(impactStatements.filter(s => s.id !== statement.id))}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{statement.content}</p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-orange-400 py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No impact statements</p>
              <p className="text-sm mt-2">Document how your conditions affect daily life</p>
            </div>
          )}
        </div>
      )}

      {/* ADVOCATES TAB */}
      {activeTab === 'advocates' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-blue-300 font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Attorney & Advocate Contacts
              </h3>
              <p className="text-gray-400 text-sm">Legal and advocacy support network</p>
            </div>
            <button
              onClick={() => setShowAdvocateForm(!showAdvocateForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>

          {showAdvocateForm && (
            <div className="bg-black/60 p-6 rounded-lg border border-blue-500/30 mb-6 space-y-4">
              <h4 className="text-blue-300 font-semibold">Add Advocate Contact</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={advocateForm.name || ''}
                    onChange={(e) => setAdvocateForm({ ...advocateForm, name: e.target.value })}
                    placeholder="John Smith, Esq."
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Role *</label>
                  <select
                    value={advocateForm.role || ''}
                    onChange={(e) => setAdvocateForm({ ...advocateForm, role: e.target.value as any })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select role...</option>
                    <option value="Attorney">Disability Attorney</option>
                    <option value="Disability Advocate">Disability Advocate</option>
                    <option value="Social Worker">Social Worker</option>
                    <option value="Patient Advocate">Patient Advocate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Organization</label>
                  <input
                    type="text"
                    value={advocateForm.organization || ''}
                    onChange={(e) => setAdvocateForm({ ...advocateForm, organization: e.target.value })}
                    placeholder="Law firm, nonprofit..."
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Specialization</label>
                  <input
                    type="text"
                    value={advocateForm.specialization || ''}
                    onChange={(e) => setAdvocateForm({ ...advocateForm, specialization: e.target.value })}
                    placeholder="SSI/SSDI, ADA, etc."
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={advocateForm.phone || ''}
                    onChange={(e) => setAdvocateForm({ ...advocateForm, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={advocateForm.email || ''}
                    onChange={(e) => setAdvocateForm({ ...advocateForm, email: e.target.value })}
                    placeholder="advocate@email.com"
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimaryAdvocate"
                  checked={advocateForm.isPrimary}
                  onChange={(e) => setAdvocateForm({ ...advocateForm, isPrimary: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPrimaryAdvocate" className="text-blue-300 font-semibold">
                  Primary Contact
                </label>
              </div>

              <button
                onClick={addAdvocateContact}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg"
              >
                Add Contact
              </button>
            </div>
          )}

          {/* Contacts List */}
          {advocateContacts.length > 0 ? (
            <div className="space-y-3">
              {advocateContacts
                .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
                .map(contact => (
                  <div
                    key={contact.id}
                    className={`bg-black/40 p-4 rounded-lg border ${
                      contact.isPrimary ? 'border-yellow-500/50' : 'border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {contact.isPrimary && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                          <h4 className="text-white font-bold text-lg">{contact.name}</h4>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {contact.role}
                          </span>
                        </div>
                        {contact.organization && <p className="text-gray-400 text-sm">{contact.organization}</p>}
                        {contact.specialization && (
                          <p className="text-purple-300 text-sm">Specializes in: {contact.specialization}</p>
                        )}
                      </div>
                      <button
                        onClick={() => saveAdvocateContacts(advocateContacts.filter(c => c.id !== contact.id))}
                        className="p-2 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1 text-green-300 hover:text-green-200"
                        >
                          <Phone className="w-4 h-4" />
                          {contact.phone}
                        </a>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1 text-blue-300 hover:text-blue-200"
                        >
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-blue-400 py-12">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No advocate contacts</p>
              <p className="text-sm mt-2">Add attorneys, advocates, and support contacts</p>
            </div>
          )}
        </div>
      )}

      {/* EXPORT PACKETS TAB */}
      {activeTab === 'export' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-violet-300 font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Export Packets
              </h3>
              <p className="text-gray-400 text-sm">Create document bundles for specific purposes</p>
            </div>
            <button
              onClick={() => setShowExportBuilder(!showExportBuilder)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Create Packet
            </button>
          </div>

          {/* Quick Export Templates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { purpose: 'Doctor Visit', icon: User, description: 'Medical history & current status' },
              { purpose: 'Disability Hearing', icon: Gavel, description: 'Full evidence package' },
              { purpose: 'Appeal', icon: Scale, description: 'Supporting documentation' },
              { purpose: 'Emergency', icon: AlertTriangle, description: 'Critical info only' }
            ].map(template => (
              <button
                key={template.purpose}
                onClick={() => {
                  setExportForm({ ...exportForm, purpose: template.purpose as any, documentIds: selectedDocuments });
                  setShowExportBuilder(true);
                }}
                className="flex flex-col items-center gap-2 p-4 bg-black/40 rounded-lg border border-violet-500/20 hover:border-violet-500/40 text-left"
              >
                <template.icon className="w-8 h-8 text-violet-400" />
                <span className="text-white font-semibold text-sm">{template.purpose}</span>
                <span className="text-gray-400 text-xs text-center">{template.description}</span>
              </button>
            ))}
          </div>

          {showExportBuilder && (
            <div className="bg-black/60 p-6 rounded-lg border border-violet-500/30 mb-6 space-y-4">
              <h4 className="text-violet-300 font-semibold">Build Export Packet</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-violet-300 text-sm font-semibold mb-2">Packet Name *</label>
                  <input
                    type="text"
                    value={exportForm.name || ''}
                    onChange={(e) => setExportForm({ ...exportForm, name: e.target.value })}
                    placeholder="ALJ Hearing Documents..."
                    className="w-full bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-violet-300 text-sm font-semibold mb-2">Purpose</label>
                  <select
                    value={exportForm.purpose || 'Custom'}
                    onChange={(e) => setExportForm({ ...exportForm, purpose: e.target.value as any })}
                    className="w-full bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Doctor Visit">Doctor Visit</option>
                    <option value="Disability Hearing">Disability Hearing</option>
                    <option value="Appeal">Appeal</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Document Selection */}
              <div>
                <label className="block text-violet-300 text-sm font-semibold mb-2">
                  Select Documents ({selectedDocuments.length} selected)
                </label>
                <div className="max-h-60 overflow-y-auto space-y-2 bg-black/20 p-3 rounded-lg border border-violet-500/20">
                  {documents.map(doc => (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                        selectedDocuments.includes(doc.id) ? 'bg-violet-500/20' : 'hover:bg-violet-500/10'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => toggleDocumentSelection(doc.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <span className="text-white">{doc.title}</span>
                        <span className="text-gray-400 text-xs ml-2">{doc.category}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={exportForm.includeImpactStatements}
                    onChange={(e) => setExportForm({ ...exportForm, includeImpactStatements: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Include Impact Statements
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={exportForm.includeCostSummary}
                    onChange={(e) => setExportForm({ ...exportForm, includeCostSummary: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Include Cost Summary
                </label>
              </div>

              <button
                onClick={createExportPacket}
                disabled={!exportForm.name || selectedDocuments.length === 0}
                className={`w-full font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  exportForm.name && selectedDocuments.length > 0
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-5 h-5" />
                Download Packet
              </button>
            </div>
          )}

          {documents.length === 0 && (
            <div className="text-center text-violet-400 py-12">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No documents to export</p>
              <p className="text-sm mt-2">Add documents to the vault first</p>
            </div>
          )}
        </div>
      )}

      {/* Footer - Privacy Reminder */}
      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-300 text-sm font-semibold mb-1">Documentation Vault</p>
            <p className="text-purple-200/70 text-xs">
              Your documentation is stored securely in your browser's local storage.
              This data never leaves your device. For important documents, we recommend
              maintaining additional backups. This system is designed to help you organize
              evidence for disability claims, medical visits, and appeals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationVault;
