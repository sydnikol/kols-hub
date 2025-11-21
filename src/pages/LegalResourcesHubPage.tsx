import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Calendar, CheckCircle, Plus, Edit2, Trash2, ExternalLink, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LegalDocument {
  id: string;
  name: string;
  type: 'id' | 'birth-certificate' | 'social-security' | 'passport' | 'lease' | 'court-order' | 'medical' | 'other';
  status: 'current' | 'pending' | 'expired' | 'needs-update';
  issueDate: string;
  expirationDate?: string;
  issuingAuthority: string;
  documentNumber: string;
  location: string; // where stored
  digitalCopy: boolean;
  notes: string;
  createdAt: number;
}

interface LegalCase {
  id: string;
  title: string;
  type: 'name-change' | 'marker-change' | 'discrimination' | 'housing' | 'employment' | 'family' | 'other';
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  completionDate?: string;
  attorney: string;
  courtName: string;
  caseNumber: string;
  nextHearing?: string;
  documents: string[];
  timeline: TimelineEntry[];
  notes: string;
  createdAt: number;
}

interface TimelineEntry {
  date: string;
  event: string;
  notes: string;
}

interface LegalRight {
  id: string;
  category: 'discrimination' | 'housing' | 'employment' | 'healthcare' | 'education' | 'public-accommodations';
  state: string;
  title: string;
  description: string;
  protections: string[];
  resources: string[];
  lastUpdated: string;
  starred: boolean;
  createdAt: number;
}

interface LegalAid {
  id: string;
  organization: string;
  type: 'legal-aid' | 'pro-bono' | 'lgbtq-specific' | 'general' | 'advocacy';
  services: string[];
  phone: string;
  email: string;
  website: string;
  address: string;
  notes: string;
  starred: boolean;
  createdAt: number;
}

const LegalResourcesHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'documents' | 'cases' | 'rights' | 'aid'>('documents');

  // Documents Tab
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<Partial<LegalDocument>>({
    type: 'id',
    status: 'current',
    digitalCopy: false
  });

  // Cases Tab
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  const [newCase, setNewCase] = useState<Partial<LegalCase>>({
    type: 'name-change',
    status: 'planning',
    documents: [],
    timeline: []
  });

  // Rights Tab
  const [rights, setRights] = useState<LegalRight[]>([]);
  const [showRightsForm, setShowRightsForm] = useState(false);
  const [editingRight, setEditingRight] = useState<string | null>(null);
  const [newRight, setNewRight] = useState<Partial<LegalRight>>({
    category: 'discrimination',
    protections: [],
    resources: [],
    starred: false
  });

  // Aid Tab
  const [legalAid, setLegalAid] = useState<LegalAid[]>([]);
  const [showAidForm, setShowAidForm] = useState(false);
  const [editingAid, setEditingAid] = useState<string | null>(null);
  const [newAid, setNewAid] = useState<Partial<LegalAid>>({
    type: 'legal-aid',
    services: [],
    starred: false
  });

  // Load data
  useEffect(() => {
    const savedDocs = localStorage.getItem('legalDocuments');
    const savedCases = localStorage.getItem('legalCases');
    const savedRights = localStorage.getItem('legalRights');
    const savedAid = localStorage.getItem('legalAid');

    if (savedDocs) setDocuments(JSON.parse(savedDocs));
    if (savedCases) setCases(JSON.parse(savedCases));
    if (savedRights) setRights(JSON.parse(savedRights));
    if (savedAid) setLegalAid(JSON.parse(savedAid));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('legalDocuments', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('legalCases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('legalRights', JSON.stringify(rights));
  }, [rights]);

  useEffect(() => {
    localStorage.setItem('legalAid', JSON.stringify(legalAid));
  }, [legalAid]);

  // Document functions
  const saveDocument = () => {
    if (!newDocument.name || !newDocument.type) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingDoc) {
      setDocuments(documents.map(d => d.id === editingDoc ? { ...d, ...newDocument } as LegalDocument : d));
      toast.success('Document updated!');
    } else {
      const doc: LegalDocument = {
        id: Date.now().toString(),
        name: newDocument.name!,
        type: newDocument.type!,
        status: newDocument.status || 'current',
        issueDate: newDocument.issueDate || '',
        expirationDate: newDocument.expirationDate,
        issuingAuthority: newDocument.issuingAuthority || '',
        documentNumber: newDocument.documentNumber || '',
        location: newDocument.location || '',
        digitalCopy: newDocument.digitalCopy || false,
        notes: newDocument.notes || '',
        createdAt: Date.now()
      };
      setDocuments([doc, ...documents]);
      toast.success('Document added!');
    }

    setNewDocument({ type: 'id', status: 'current', digitalCopy: false });
    setShowDocForm(false);
    setEditingDoc(null);
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    toast.success('Document deleted');
  };

  // Case functions
  const saveCase = () => {
    if (!newCase.title || !newCase.type) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingCase) {
      setCases(cases.map(c => c.id === editingCase ? { ...c, ...newCase } as LegalCase : c));
      toast.success('Case updated!');
    } else {
      const legalCase: LegalCase = {
        id: Date.now().toString(),
        title: newCase.title!,
        type: newCase.type!,
        status: newCase.status || 'planning',
        startDate: newCase.startDate || new Date().toISOString().split('T')[0],
        completionDate: newCase.completionDate,
        attorney: newCase.attorney || '',
        courtName: newCase.courtName || '',
        caseNumber: newCase.caseNumber || '',
        nextHearing: newCase.nextHearing,
        documents: newCase.documents || [],
        timeline: newCase.timeline || [],
        notes: newCase.notes || '',
        createdAt: Date.now()
      };
      setCases([legalCase, ...cases]);
      toast.success('Case added!');
    }

    setNewCase({ type: 'name-change', status: 'planning', documents: [], timeline: [] });
    setShowCaseForm(false);
    setEditingCase(null);
  };

  const deleteCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
    toast.success('Case deleted');
  };

  // Rights functions
  const saveRight = () => {
    if (!newRight.title || !newRight.category) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingRight) {
      setRights(rights.map(r => r.id === editingRight ? { ...r, ...newRight } as LegalRight : r));
      toast.success('Right updated!');
    } else {
      const right: LegalRight = {
        id: Date.now().toString(),
        category: newRight.category!,
        state: newRight.state || '',
        title: newRight.title!,
        description: newRight.description || '',
        protections: newRight.protections || [],
        resources: newRight.resources || [],
        lastUpdated: new Date().toISOString().split('T')[0],
        starred: false,
        createdAt: Date.now()
      };
      setRights([right, ...rights]);
      toast.success('Right added!');
    }

    setNewRight({ category: 'discrimination', protections: [], resources: [], starred: false });
    setShowRightsForm(false);
    setEditingRight(null);
  };

  const deleteRight = (id: string) => {
    setRights(rights.filter(r => r.id !== id));
    toast.success('Right deleted');
  };

  const toggleStarRight = (id: string) => {
    setRights(rights.map(r => r.id === id ? { ...r, starred: !r.starred } : r));
  };

  // Legal Aid functions
  const saveLegalAid = () => {
    if (!newAid.organization) {
      toast.error('Please enter organization name');
      return;
    }

    if (editingAid) {
      setLegalAid(legalAid.map(a => a.id === editingAid ? { ...a, ...newAid } as LegalAid : a));
      toast.success('Legal aid updated!');
    } else {
      const aid: LegalAid = {
        id: Date.now().toString(),
        organization: newAid.organization!,
        type: newAid.type || 'legal-aid',
        services: newAid.services || [],
        phone: newAid.phone || '',
        email: newAid.email || '',
        website: newAid.website || '',
        address: newAid.address || '',
        notes: newAid.notes || '',
        starred: false,
        createdAt: Date.now()
      };
      setLegalAid([aid, ...legalAid]);
      toast.success('Legal aid added!');
    }

    setNewAid({ type: 'legal-aid', services: [], starred: false });
    setShowAidForm(false);
    setEditingAid(null);
  };

  const deleteLegalAid = (id: string) => {
    setLegalAid(legalAid.filter(a => a.id !== id));
    toast.success('Legal aid deleted');
  };

  const toggleStarAid = (id: string) => {
    setLegalAid(legalAid.map(a => a.id === id ? { ...a, starred: !a.starred } : a));
  };

  // Stats
  const totalDocs = documents.length;
  const expiringDocs = documents.filter(d => {
    if (!d.expirationDate) return false;
    const daysUntil = Math.ceil((new Date(d.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil >= 0;
  }).length;
  const activeCases = cases.filter(c => c.status === 'in-progress').length;
  const completedCases = cases.filter(c => c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 p-6">
        <button onClick={() => navigate('/')} className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Scale className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Legal Resources Hub</h1>
        </div>
        <p className="text-blue-200">Track documents, cases, and know your rights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-4 rounded-lg border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{totalDocs}</div>
          <div className="text-sm text-blue-200">Documents</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-4 rounded-lg border border-orange-500/30">
          <div className="text-2xl font-bold text-orange-400">{expiringDocs}</div>
          <div className="text-sm text-orange-200">Expiring Soon</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-4 rounded-lg border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">{activeCases}</div>
          <div className="text-sm text-green-200">Active Cases</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-4 rounded-lg border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">{legalAid.length}</div>
          <div className="text-sm text-purple-200">Legal Aid Orgs</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 px-6 mb-6 no-scrollbar">
        {[
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'cases', label: 'Cases', icon: Scale },
          { id: 'rights', label: 'Your Rights', icon: Shield },
          { id: 'aid', label: 'Legal Aid', icon: Info }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowDocForm(!showDocForm)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Document
          </button>

          {showDocForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Document name"
                value={newDocument.name || ''}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newDocument.type}
                onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="id">ID / Driver's License</option>
                <option value="birth-certificate">Birth Certificate</option>
                <option value="social-security">Social Security Card</option>
                <option value="passport">Passport</option>
                <option value="lease">Lease / Rental Agreement</option>
                <option value="court-order">Court Order</option>
                <option value="medical">Medical Records</option>
                <option value="other">Other</option>
              </select>
              <select
                value={newDocument.status}
                onChange={(e) => setNewDocument({ ...newDocument, status: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="current">Current</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="needs-update">Needs Update</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newDocument.issueDate || ''}
                    onChange={(e) => setNewDocument({ ...newDocument, issueDate: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={newDocument.expirationDate || ''}
                    onChange={(e) => setNewDocument({ ...newDocument, expirationDate: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Issuing authority (optional)"
                value={newDocument.issuingAuthority || ''}
                onChange={(e) => setNewDocument({ ...newDocument, issuingAuthority: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Document number (optional)"
                value={newDocument.documentNumber || ''}
                onChange={(e) => setNewDocument({ ...newDocument, documentNumber: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Storage location (optional)"
                value={newDocument.location || ''}
                onChange={(e) => setNewDocument({ ...newDocument, location: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newDocument.digitalCopy || false}
                  onChange={(e) => setNewDocument({ ...newDocument, digitalCopy: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Have digital copy</span>
              </label>
              <textarea
                placeholder="Notes (optional)"
                value={newDocument.notes || ''}
                onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveDocument}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingDoc ? 'Update' : 'Save'} Document
                </button>
                <button
                  onClick={() => {
                    setShowDocForm(false);
                    setEditingDoc(null);
                    setNewDocument({ type: 'id', status: 'current', digitalCopy: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No documents tracked yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map(doc => {
                const daysUntilExpiration = doc.expirationDate
                  ? Math.ceil((new Date(doc.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                const isExpiring = daysUntilExpiration !== null && daysUntilExpiration <= 30 && daysUntilExpiration >= 0;
                const isExpired = daysUntilExpiration !== null && daysUntilExpiration < 0;

                return (
                  <div key={doc.id} className={`bg-gray-900 p-4 rounded-lg border ${isExpired ? 'border-red-500/50' : isExpiring ? 'border-orange-500/50' : 'border-gray-700'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">{doc.type.replace('-', ' ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingDoc(doc.id);
                            setNewDocument(doc);
                            setShowDocForm(true);
                          }}
                          className="p-2 text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded text-xs mb-2 capitalize ${
                      doc.status === 'current' ? 'bg-green-900/30 text-green-400' :
                      doc.status === 'pending' ? 'bg-blue-900/30 text-blue-400' :
                      doc.status === 'expired' ? 'bg-red-900/30 text-red-400' :
                      'bg-orange-900/30 text-orange-400'
                    }`}>
                      {doc.status.replace('-', ' ')}
                    </div>
                    {doc.digitalCopy && (
                      <span className="ml-2 inline-block px-2 py-1 rounded text-xs bg-blue-900/30 text-blue-400">
                        Digital Copy
                      </span>
                    )}
                    <div className="space-y-1 text-sm mt-2">
                      {doc.issueDate && (
                        <div className="text-gray-400">Issued: {doc.issueDate}</div>
                      )}
                      {doc.expirationDate && (
                        <div className={isExpired ? 'text-red-400 font-semibold' : isExpiring ? 'text-orange-400' : 'text-gray-400'}>
                          Expires: {doc.expirationDate}
                          {isExpired && <span className="ml-2">(Expired!)</span>}
                          {isExpiring && <span className="ml-2">(Expiring in {daysUntilExpiration} days)</span>}
                        </div>
                      )}
                      {doc.documentNumber && (
                        <div className="text-gray-400">Number: {doc.documentNumber}</div>
                      )}
                      {doc.location && (
                        <div className="text-gray-400">Location: {doc.location}</div>
                      )}
                    </div>
                    {doc.notes && (
                      <p className="text-sm text-gray-400 mt-2">{doc.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowCaseForm(!showCaseForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Legal Case
          </button>

          {showCaseForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Case title"
                value={newCase.title || ''}
                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newCase.type}
                onChange={(e) => setNewCase({ ...newCase, type: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="name-change">Name Change</option>
                <option value="marker-change">Gender Marker Change</option>
                <option value="discrimination">Discrimination</option>
                <option value="housing">Housing</option>
                <option value="employment">Employment</option>
                <option value="family">Family Law</option>
                <option value="other">Other</option>
              </select>
              <select
                value={newCase.status}
                onChange={(e) => setNewCase({ ...newCase, status: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              <input
                type="date"
                placeholder="Start date"
                value={newCase.startDate || ''}
                onChange={(e) => setNewCase({ ...newCase, startDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Attorney name (optional)"
                value={newCase.attorney || ''}
                onChange={(e) => setNewCase({ ...newCase, attorney: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Court name (optional)"
                value={newCase.courtName || ''}
                onChange={(e) => setNewCase({ ...newCase, courtName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Case number (optional)"
                value={newCase.caseNumber || ''}
                onChange={(e) => setNewCase({ ...newCase, caseNumber: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <div>
                <label className="block text-sm text-gray-400 mb-1">Next Hearing</label>
                <input
                  type="date"
                  value={newCase.nextHearing || ''}
                  onChange={(e) => setNewCase({ ...newCase, nextHearing: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={newCase.notes || ''}
                onChange={(e) => setNewCase({ ...newCase, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveCase}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingCase ? 'Update' : 'Save'} Case
                </button>
                <button
                  onClick={() => {
                    setShowCaseForm(false);
                    setEditingCase(null);
                    setNewCase({ type: 'name-change', status: 'planning', documents: [], timeline: [] });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {cases.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No legal cases tracked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cases.map(legalCase => (
                <div key={legalCase.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{legalCase.title}</h3>
                      <p className="text-sm text-gray-400 capitalize">{legalCase.type.replace('-', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCase(legalCase.id);
                          setNewCase(legalCase);
                          setShowCaseForm(true);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCase(legalCase.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className={`inline-block px-2 py-1 rounded text-xs mb-2 capitalize ${
                    legalCase.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    legalCase.status === 'in-progress' ? 'bg-blue-900/30 text-blue-400' :
                    legalCase.status === 'on-hold' ? 'bg-orange-900/30 text-orange-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {legalCase.status.replace('-', ' ')}
                  </div>
                  <div className="space-y-1 text-sm mt-2">
                    {legalCase.attorney && (
                      <div className="text-gray-400">Attorney: {legalCase.attorney}</div>
                    )}
                    {legalCase.caseNumber && (
                      <div className="text-gray-400">Case #: {legalCase.caseNumber}</div>
                    )}
                    {legalCase.nextHearing && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Calendar className="w-3 h-3" />
                        Next Hearing: {legalCase.nextHearing}
                      </div>
                    )}
                    <div className="text-gray-400">Started: {legalCase.startDate}</div>
                    {legalCase.completionDate && (
                      <div className="text-green-400">Completed: {legalCase.completionDate}</div>
                    )}
                  </div>
                  {legalCase.notes && (
                    <p className="text-sm text-gray-400 mt-2">{legalCase.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rights Tab */}
      {activeTab === 'rights' && (
        <div className="px-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 p-4 rounded-lg border border-blue-500/30">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">Know Your Rights</h3>
                <p className="text-sm text-blue-200">Document your legal protections and rights. Laws vary by location - always verify current information.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowRightsForm(!showRightsForm)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Right/Protection
          </button>

          {showRightsForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Title"
                value={newRight.title || ''}
                onChange={(e) => setNewRight({ ...newRight, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newRight.category}
                onChange={(e) => setNewRight({ ...newRight, category: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="discrimination">Discrimination</option>
                <option value="housing">Housing</option>
                <option value="employment">Employment</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="public-accommodations">Public Accommodations</option>
              </select>
              <input
                type="text"
                placeholder="State/location (optional)"
                value={newRight.state || ''}
                onChange={(e) => setNewRight({ ...newRight, state: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Description"
                value={newRight.description || ''}
                onChange={(e) => setNewRight({ ...newRight, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveRight}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingRight ? 'Update' : 'Save'} Right
                </button>
                <button
                  onClick={() => {
                    setShowRightsForm(false);
                    setEditingRight(null);
                    setNewRight({ category: 'discrimination', protections: [], resources: [], starred: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {rights.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No rights documented yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rights.map(right => (
                <div key={right.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{right.title}</h3>
                      <p className="text-sm text-gray-400 capitalize">
                        {right.category.replace('-', ' ')} {right.state && `• ${right.state}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStarRight(right.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          right.starred ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" fill={right.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRight(right.id);
                          setNewRight(right);
                          setShowRightsForm(true);
                        }}
                        className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRight(right.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {right.description && (
                    <p className="text-sm text-gray-300 mb-2">{right.description}</p>
                  )}
                  <div className="text-xs text-gray-500">Last updated: {right.lastUpdated}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legal Aid Tab */}
      {activeTab === 'aid' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowAidForm(!showAidForm)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Legal Aid Organization
          </button>

          {showAidForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Organization name"
                value={newAid.organization || ''}
                onChange={(e) => setNewAid({ ...newAid, organization: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newAid.type}
                onChange={(e) => setNewAid({ ...newAid, type: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="legal-aid">Legal Aid Society</option>
                <option value="pro-bono">Pro Bono Services</option>
                <option value="lgbtq-specific">LGBTQ-Specific</option>
                <option value="general">General Legal Services</option>
                <option value="advocacy">Advocacy Organization</option>
              </select>
              <input
                type="tel"
                placeholder="Phone"
                value={newAid.phone || ''}
                onChange={(e) => setNewAid({ ...newAid, phone: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newAid.email || ''}
                onChange={(e) => setNewAid({ ...newAid, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="url"
                placeholder="Website (optional)"
                value={newAid.website || ''}
                onChange={(e) => setNewAid({ ...newAid, website: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Address (optional)"
                value={newAid.address || ''}
                onChange={(e) => setNewAid({ ...newAid, address: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Notes (optional)"
                value={newAid.notes || ''}
                onChange={(e) => setNewAid({ ...newAid, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveLegalAid}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingAid ? 'Update' : 'Save'} Organization
                </button>
                <button
                  onClick={() => {
                    setShowAidForm(false);
                    setEditingAid(null);
                    setNewAid({ type: 'legal-aid', services: [], starred: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {legalAid.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Info className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No legal aid organizations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {legalAid.map(aid => (
                <div key={aid.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{aid.organization}</h3>
                      <p className="text-sm text-gray-400 capitalize">{aid.type.replace('-', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStarAid(aid.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          aid.starred ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" fill={aid.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingAid(aid.id);
                          setNewAid(aid);
                          setShowAidForm(true);
                        }}
                        className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLegalAid(aid.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    {aid.phone && (
                      <a href={`tel:${aid.phone}`} className="block text-blue-400 hover:underline">
                        {aid.phone}
                      </a>
                    )}
                    {aid.email && (
                      <a href={`mailto:${aid.email}`} className="block text-blue-400 hover:underline">
                        {aid.email}
                      </a>
                    )}
                    {aid.website && (
                      <a href={aid.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                        Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {aid.address && (
                      <div className="text-gray-400">{aid.address}</div>
                    )}
                  </div>
                  {aid.notes && (
                    <p className="text-sm text-gray-400 mt-2">{aid.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LegalResourcesHubPage;
