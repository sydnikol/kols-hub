import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Heart, Calendar, DollarSign, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AssistanceProgram {
  id: string;
  name: string;
  type: 'SSI' | 'SSDI' | 'SNAP' | 'medicaid' | 'housing' | 'utility' | 'food-bank' | 'charity' | 'grant' | 'other';
  status: 'applied' | 'approved' | 'receiving' | 'denied' | 'pending-renewal' | 'inactive';
  monthlyAmount?: number;
  applicationDate?: string;
  approvalDate?: string;
  renewalDate?: string;
  caseNumber?: string;
  contactPerson?: string;
  contactPhone?: string;
  notes: string;
}

interface Benefit {
  id: string;
  programId: string;
  programName: string;
  amount: number;
  date: string;
  notes: string;
}

interface Document {
  id: string;
  programId: string;
  name: string;
  type: 'application' | 'approval' | 'denial' | 'renewal' | 'correspondence' | 'other';
  dateAdded: string;
  notes: string;
}

const FinancialAssistanceTracker: React.FC = () => {
  const [programs, setPrograms] = useState<AssistanceProgram[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'programs' | 'benefits' | 'documents'>('programs');

  useEffect(() => {
    const savedPrograms = localStorage.getItem('assistancePrograms');
    if (savedPrograms) setPrograms(JSON.parse(savedPrograms));

    const savedBenefits = localStorage.getItem('assistanceBenefits');
    if (savedBenefits) setBenefits(JSON.parse(savedBenefits));

    const savedDocuments = localStorage.getItem('assistanceDocuments');
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
  }, []);

  useEffect(() => {
    localStorage.setItem('assistancePrograms', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('assistanceBenefits', JSON.stringify(benefits));
  }, [benefits]);

  useEffect(() => {
    localStorage.setItem('assistanceDocuments', JSON.stringify(documents));
  }, [documents]);

  const addProgram = () => {
    const newProgram: AssistanceProgram = {
      id: Date.now().toString(),
      name: '',
      type: 'other',
      status: 'applied',
      applicationDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
    setPrograms([...programs, newProgram]);
  };

  const updateProgram = (id: string, updates: Partial<AssistanceProgram>) => {
    setPrograms(programs.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProgram = (id: string) => {
    if (confirm('Delete this program?')) {
      setPrograms(programs.filter(p => p.id !== id));
      setBenefits(benefits.filter(b => b.programId !== id));
      setDocuments(documents.filter(d => d.programId !== id));
      toast.success('Program deleted');
    }
  };

  const addBenefit = (programId?: string) => {
    const program = programId ? programs.find(p => p.id === programId) : null;

    const newBenefit: Benefit = {
      id: Date.now().toString(),
      programId: program?.id || '',
      programName: program?.name || '',
      amount: program?.monthlyAmount || 0,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };

    setBenefits([...benefits, newBenefit]);
    toast.success('Benefit recorded!');
  };

  const updateBenefit = (id: string, updates: Partial<Benefit>) => {
    setBenefits(benefits.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBenefit = (id: string) => {
    if (confirm('Delete this benefit record?')) {
      setBenefits(benefits.filter(b => b.id !== id));
      toast.success('Benefit deleted');
    }
  };

  const addDocument = (programId?: string) => {
    const program = programId ? programs.find(p => p.id === programId) : null;

    const newDocument: Document = {
      id: Date.now().toString(),
      programId: program?.id || '',
      name: '',
      type: 'application',
      dateAdded: new Date().toISOString().split('T')[0],
      notes: ''
    };

    setDocuments([...documents, newDocument]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDocument = (id: string) => {
    if (confirm('Delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
      toast.success('Document deleted');
    }
  };

  const totalMonthlyBenefits = programs
    .filter(p => p.status === 'receiving' && p.monthlyAmount)
    .reduce((sum, p) => sum + (p.monthlyAmount || 0), 0);

  const totalReceived = benefits.reduce((sum, b) => sum + b.amount, 0);

  const getStatusColor = (status: string) => {
    const colors = {
      applied: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      approved: 'bg-green-500/20 border-green-500/30 text-green-300',
      receiving: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      denied: 'bg-red-500/20 border-red-500/30 text-red-300',
      'pending-renewal': 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      inactive: 'bg-gray-500/20 border-gray-500/30 text-gray-300'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      SSI: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      SSDI: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
      SNAP: 'bg-green-500/20 border-green-500/30 text-green-300',
      medicaid: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      housing: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      utility: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
      'food-bank': 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      charity: 'bg-pink-500/20 border-pink-500/30 text-pink-300',
      grant: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      other: 'bg-gray-500/20 border-gray-500/30 text-gray-300'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-6 rounded-xl border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-emerald-300 font-semibold">Monthly Benefits</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalMonthlyBenefits.toFixed(2)}</p>
          <p className="text-emerald-400 text-sm mt-1">From active programs</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-blue-300 font-semibold">Active Programs</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {programs.filter(p => p.status === 'receiving' || p.status === 'approved').length}
          </p>
          <p className="text-blue-400 text-sm mt-1">{programs.length} total tracked</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-purple-300 font-semibold">Total Received</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalReceived.toFixed(2)}</p>
          <p className="text-purple-400 text-sm mt-1">All time</p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 p-6 rounded-xl border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-amber-300 font-semibold">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {programs.filter(p => p.status === 'applied' || p.status === 'pending-renewal').length}
          </p>
          <p className="text-amber-400 text-sm mt-1">Applications & renewals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'programs'
              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
              : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          Programs ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'benefits'
              ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
              : 'bg-blue-900/20 text-blue-400 hover:bg-blue-500/20'
          }`}
        >
          Benefits ({benefits.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'documents'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
              : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
          }`}
        >
          Documents ({documents.length})
        </button>
      </div>

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <button
            onClick={addProgram}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500/20 border-2 border-emerald-500/30 rounded-xl text-emerald-300 hover:bg-emerald-500/30 transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Assistance Program
          </button>

          {programs.map(program => {
            const programBenefits = benefits.filter(b => b.programId === program.id);
            const programDocs = documents.filter(d => d.programId === program.id);

            return (
              <div key={program.id} className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 p-6 rounded-xl border border-emerald-500/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-6 h-6 text-emerald-400" />
                      <input
                        type="text"
                        value={program.name}
                        onChange={(e) => updateProgram(program.id, { name: e.target.value })}
                        placeholder="Program name..."
                        className="text-lg font-bold bg-transparent border-b-2 border-emerald-500/30 focus:border-emerald-500 outline-none text-white flex-1"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(program.type)}`}>
                        {program.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(program.status)}`}>
                        {program.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Type</label>
                        <select
                          value={program.type}
                          onChange={(e) => updateProgram(program.id, { type: e.target.value as AssistanceProgram['type'] })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                        >
                          <option value="SSI">SSI (Supplemental Security Income)</option>
                          <option value="SSDI">SSDI (Social Security Disability)</option>
                          <option value="SNAP">SNAP (Food Stamps)</option>
                          <option value="medicaid">Medicaid</option>
                          <option value="housing">Housing Assistance</option>
                          <option value="utility">Utility Assistance</option>
                          <option value="food-bank">Food Bank</option>
                          <option value="charity">Charity/Non-Profit</option>
                          <option value="grant">Grant</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Status</label>
                        <select
                          value={program.status}
                          onChange={(e) => updateProgram(program.id, { status: e.target.value as AssistanceProgram['status'] })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                        >
                          <option value="applied">Applied</option>
                          <option value="approved">Approved</option>
                          <option value="receiving">Receiving Benefits</option>
                          <option value="denied">Denied</option>
                          <option value="pending-renewal">Pending Renewal</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Monthly Amount ($)</label>
                        <input
                          type="number"
                          value={program.monthlyAmount || ''}
                          onChange={(e) => updateProgram(program.id, { monthlyAmount: parseFloat(e.target.value) || undefined })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Case Number</label>
                        <input
                          type="text"
                          value={program.caseNumber || ''}
                          onChange={(e) => updateProgram(program.id, { caseNumber: e.target.value })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                          placeholder="123456"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Application Date</label>
                        <input
                          type="date"
                          value={program.applicationDate || ''}
                          onChange={(e) => updateProgram(program.id, { applicationDate: e.target.value })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Approval Date</label>
                        <input
                          type="date"
                          value={program.approvalDate || ''}
                          onChange={(e) => updateProgram(program.id, { approvalDate: e.target.value })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Renewal Date</label>
                        <input
                          type="date"
                          value={program.renewalDate || ''}
                          onChange={(e) => updateProgram(program.id, { renewalDate: e.target.value })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Contact Person</label>
                        <input
                          type="text"
                          value={program.contactPerson || ''}
                          onChange={(e) => updateProgram(program.id, { contactPerson: e.target.value })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                          placeholder="Caseworker name"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-emerald-400 block mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          value={program.contactPhone || ''}
                          onChange={(e) => updateProgram(program.id, { contactPhone: e.target.value })}
                          className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs text-emerald-400 block mb-1">Notes</label>
                      <textarea
                        value={program.notes}
                        onChange={(e) => updateProgram(program.id, { notes: e.target.value })}
                        placeholder="Additional details, requirements, deadlines..."
                        className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded px-3 py-2 text-white text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => addBenefit(program.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Record Benefit
                      </button>
                      <button
                        onClick={() => addDocument(program.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        Add Document
                      </button>
                      <button
                        onClick={() => deleteProgram(program.id)}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {(programBenefits.length > 0 || programDocs.length > 0) && (
                      <div className="mt-4 pt-4 border-t border-emerald-500/30 text-sm">
                        <div className="flex gap-6">
                          {programBenefits.length > 0 && (
                            <span className="text-emerald-400">
                              {programBenefits.length} benefits recorded (${programBenefits.reduce((sum, b) => sum + b.amount, 0).toFixed(2)})
                            </span>
                          )}
                          {programDocs.length > 0 && (
                            <span className="text-blue-400">
                              {programDocs.length} documents attached
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {programs.length === 0 && (
            <div className="bg-emerald-900/20 p-12 rounded-xl border border-emerald-500/30 text-center">
              <Heart className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Programs Tracked Yet</h3>
              <p className="text-emerald-400">
                Track SSI, SSDI, SNAP, and other assistance programs to manage your benefits.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Benefits Tab - Implementation continues as needed */}
      {activeTab === 'benefits' && (
        <div className="space-y-4">
          <p className="text-emerald-400 text-center py-8">
            Click "Record Benefit" on a program to log received benefits
          </p>
        </div>
      )}

      {/* Documents Tab - Implementation continues as needed */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <p className="text-emerald-400 text-center py-8">
            Click "Add Document" on a program to track related paperwork
          </p>
        </div>
      )}
    </div>
  );
};

export default FinancialAssistanceTracker;
