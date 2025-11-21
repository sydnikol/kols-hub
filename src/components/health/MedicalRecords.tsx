import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Download, Calendar, Tag, Search, Filter, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface MedicalRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  provider: string;
  description: string;
  tags: string[];
  fileUrl?: string;
  notes: string;
  important: boolean;
  createdDate: number;
}

const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    tags: [],
    important: false,
  });
  const [newTag, setNewTag] = useState('');

  const categories = [
    'All', 'Lab Results', 'Imaging', 'Diagnosis', 'Treatment Plan',
    'Surgery/Procedure', 'Prescription', 'Test Results', 'Specialist Report',
    'Insurance', 'Vaccination', 'Other'
  ];

  const commonTags = [
    'Urgent', 'POTS', 'Cardiology', 'Neurology', 'Gastro', 'Chronic Pain',
    'Disability', 'Insurance Claim', 'Second Opinion Needed', 'Follow-up Required'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('medical-records');
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  }, []);

  const saveRecords = (newRecords: MedicalRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('medical-records', JSON.stringify(newRecords));
  };

  const addRecord = () => {
    if (!formData.title || !formData.category || !formData.date) {
      toast.error('Title, category, and date required');
      return;
    }

    const newRecord: MedicalRecord = {
      id: `record_${Date.now()}`,
      title: formData.title!,
      category: formData.category!,
      date: formData.date!,
      provider: formData.provider || '',
      description: formData.description || '',
      tags: formData.tags || [],
      notes: formData.notes || '',
      important: formData.important || false,
      createdDate: Date.now(),
    };

    saveRecords([...records, newRecord]);
    setFormData({ tags: [], important: false });
    setShowForm(false);
    toast.success('Record added');
  };

  const deleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id));
    toast.success('Record deleted');
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
  };

  const toggleImportant = (id: string) => {
    const updated = records.map(r =>
      r.id === id ? { ...r, important: !r.important } : r
    );
    saveRecords(updated);
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), newTag]
    });
    setNewTag('');
  };

  const removeTag = (index: number) => {
    const tags = formData.tags || [];
    setFormData({
      ...formData,
      tags: tags.filter((_, i) => i !== index)
    });
  };

  const exportRecord = (record: MedicalRecord) => {
    const content = `
MEDICAL RECORD
==============

Title: ${record.title}
Category: ${record.category}
Date: ${new Date(record.date).toLocaleDateString()}
Provider: ${record.provider}
Important: ${record.important ? 'YES' : 'No'}

DESCRIPTION:
${record.description}

TAGS:
${record.tags.join(', ')}

NOTES:
${record.notes}

Created: ${new Date(record.createdDate).toLocaleDateString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-record-${record.title.replace(/\s+/g, '-')}-${record.date}.txt`;
    a.click();
    toast.success('Record exported');
  };

  const filteredRecords = records.filter(record => {
    if (selectedCategory !== 'All' && record.category !== selectedCategory) {
      return false;
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        record.title.toLowerCase().includes(search) ||
        record.description.toLowerCase().includes(search) ||
        record.provider.toLowerCase().includes(search) ||
        record.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return true;
  }).sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Medical Records</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Record'}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records, providers, tags..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-blue-400/50"
            />
          </div>
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Record Form */}
      {showForm && (
        <div className="bg-black/60 p-6 rounded-lg border border-blue-500/30 mb-6 space-y-4">
          <h3 className="text-blue-300 font-semibold text-lg">Add Medical Record</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Blood test results, MRI scan..."
                className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/50"
              />
            </div>

            <div>
              <label className="block text-blue-300 text-sm font-semibold mb-2">Category *</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select category...</option>
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 text-sm font-semibold mb-2">Date *</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-blue-300 text-sm font-semibold mb-2">Provider/Facility</label>
              <input
                type="text"
                value={formData.provider || ''}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                placeholder="Dr. Smith, City Hospital..."
                className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-300 text-sm font-semibold mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Key findings, results, recommendations..."
              className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/50"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-blue-300 text-sm font-semibold mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="flex-1 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/50"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-blue-600/30 hover:bg-blue-500/40 text-blue-300 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {commonTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFormData({...formData, tags: [...(formData.tags || []), tag]})}
                  className="px-2 py-1 bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 text-xs rounded transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  {tag}
                  <button onClick={() => removeTag(idx)} className="hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-blue-300 text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes, context, follow-up needed..."
              className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/50"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={formData.important}
              onChange={(e) => setFormData({...formData, important: e.target.checked})}
              className="w-4 h-4"
            />
            <label htmlFor="important" className="text-blue-300 font-semibold">
              Mark as Important
            </label>
          </div>

          <button
            onClick={addRecord}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Record
          </button>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.map(record => (
          <div
            key={record.id}
            className={`bg-black/40 p-4 rounded-lg border-2 transition-all ${
              record.important
                ? 'border-yellow-500/50 bg-yellow-900/10'
                : 'border-blue-500/20'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {record.important && <span className="text-yellow-400">⭐</span>}
                  <h3 className="text-white font-bold text-lg">{record.title}</h3>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                    {record.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  {record.provider && <span>{record.provider}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleImportant(record.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    record.important
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                      : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-400'
                  }`}
                  title={record.important ? 'Unmark important' : 'Mark important'}
                >
                  ⭐
                </button>
                <button
                  onClick={() => exportRecord(record)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                  title="Export"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {record.description && (
              <p className="text-gray-300 text-sm mb-2">{record.description}</p>
            )}

            {record.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {record.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {record.notes && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-gray-400 text-sm italic">{record.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center text-blue-400 py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">No records found</p>
          <p className="text-sm mt-2">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter'
              : 'Click "Add Record" to add your first medical record'}
          </p>
        </div>
      )}

      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
        <p className="text-blue-300 text-xs">
          <span className="font-bold">Record Keeping:</span> Organize lab results, imaging, diagnoses, and treatment plans. Mark important records with ⭐ for quick access. Export records to share with providers or for insurance claims.
        </p>
      </div>
    </div>
  );
};

export default MedicalRecords;
