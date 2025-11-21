import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Plus, Download, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface CareEntry {
  id: string;
  date: string;
  careType: string;
  partnerName: string;
  whatTheyDid: string;
  howItHelped: string;
  myGratitude: string;
  reciprocated: boolean;
  reciprocationDetails?: string;
  tags: string[];
  timestamp: number;
}

interface GratitudeMoment {
  id: string;
  date: string;
  moment: string;
  feeling: string;
  timestamp: number;
}

const PartnerCareLog: React.FC = () => {
  const [entries, setEntries] = useState<CareEntry[]>([]);
  const [gratitude, setGratitude] = useState<GratitudeMoment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGratitudeForm, setShowGratitudeForm] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<CareEntry, 'id' | 'timestamp'>>({
    date: new Date().toISOString().split('T')[0],
    careType: 'Practical Support',
    partnerName: '',
    whatTheyDid: '',
    howItHelped: '',
    myGratitude: '',
    reciprocated: false,
    reciprocationDetails: '',
    tags: [],
  });

  const [gratitudeForm, setGratitudeForm] = useState({
    date: new Date().toISOString().split('T')[0],
    moment: '',
    feeling: '',
  });

  const careTypes = [
    'Practical Support',
    'Emotional Support',
    'Physical Care',
    'Acts of Service',
    'Quality Time',
    'Words of Affirmation',
    'Advocacy',
    'Listening',
    'Crisis Support',
    'Daily Help',
  ];

  const commonTags = [
    'Medical', 'Disability Support', 'Mental Health', 'Chronic Illness',
    'Household', 'Cooking', 'Cleaning', 'Shopping', 'Transportation',
    'Appointments', 'Medication', 'Comfort', 'Patience', 'Understanding'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedEntries = localStorage.getItem('partner_care_log');
    const savedGratitude = localStorage.getItem('partner_gratitude');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedGratitude) setGratitude(JSON.parse(savedGratitude));
  };

  const saveEntries = (data: CareEntry[]) => {
    setEntries(data);
    localStorage.setItem('partner_care_log', JSON.stringify(data));
  };

  const saveGratitude = (data: GratitudeMoment[]) => {
    setGratitude(data);
    localStorage.setItem('partner_gratitude', JSON.stringify(data));
  };

  const addEntry = () => {
    if (!formData.partnerName || !formData.whatTheyDid) {
      toast.error('Partner name and what they did are required');
      return;
    }

    const newEntry: CareEntry = {
      ...formData,
      id: `care_${Date.now()}`,
      timestamp: new Date(formData.date).getTime(),
    };

    saveEntries([...entries, newEntry].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Care entry added');
    setShowAddForm(false);
    resetForm();
  };

  const addGratitudeEntry = () => {
    if (!gratitudeForm.moment) {
      toast.error('Please describe the moment');
      return;
    }

    const newGratitude: GratitudeMoment = {
      id: `gratitude_${Date.now()}`,
      ...gratitudeForm,
      timestamp: new Date(gratitudeForm.date).getTime(),
    };

    saveGratitude([...gratitude, newGratitude].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Gratitude moment added');
    setShowGratitudeForm(false);
    setGratitudeForm({
      date: new Date().toISOString().split('T')[0],
      moment: '',
      feeling: '',
    });
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
    toast.success('Entry deleted');
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      careType: 'Practical Support',
      partnerName: '',
      whatTheyDid: '',
      howItHelped: '',
      myGratitude: '',
      reciprocated: false,
      reciprocationDetails: '',
      tags: [],
    });
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const exportLog = () => {
    let content = `PARTNER CARE LOG\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Total Entries: ${entries.length}\n\n`;
    content += `=`.repeat(80) + '\n\n';

    entries.forEach(entry => {
      content += `DATE: ${new Date(entry.timestamp).toLocaleDateString()}\n`;
      content += `PARTNER: ${entry.partnerName}\n`;
      content += `TYPE OF CARE: ${entry.careType}\n`;
      content += `\nWHAT THEY DID:\n${entry.whatTheyDid}\n`;
      content += `\nHOW IT HELPED:\n${entry.howItHelped}\n`;
      if (entry.myGratitude) {
        content += `\nMY GRATITUDE:\n${entry.myGratitude}\n`;
      }
      if (entry.reciprocated) {
        content += `\nRECIPROCATED: Yes\n`;
        if (entry.reciprocationDetails) {
          content += `HOW: ${entry.reciprocationDetails}\n`;
        }
      }
      if (entry.tags.length > 0) {
        content += `\nTAGS: ${entry.tags.join(', ')}\n`;
      }
      content += `\n${'-'.repeat(80)}\n\n`;
    });

    if (gratitude.length > 0) {
      content += `\n${'='.repeat(80)}\n\n`;
      content += `GRATITUDE MOMENTS:\n\n`;
      gratitude.forEach(g => {
        content += `${new Date(g.timestamp).toLocaleDateString()}: ${g.moment}\n`;
        if (g.feeling) content += `Feeling: ${g.feeling}\n`;
        content += `\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `partner-care-log-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Log exported');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Partner Care Log
          </h2>
          <p className="text-purple-300">Acknowledge and appreciate the care you receive</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportLog}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={() => setShowGratitudeForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Gratitude
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-500 hover:from-purple-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/30 p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-purple-300 font-semibold mb-2">Total Care Moments</h3>
          <p className="text-4xl font-bold text-white">{entries.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
          <h3 className="text-purple-300 font-semibold mb-2">Reciprocated</h3>
          <p className="text-4xl font-bold text-white">{entries.filter(e => e.reciprocated).length}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 p-6 rounded-xl border border-indigo-500/30">
          <h3 className="text-indigo-300 font-semibold mb-2">Gratitude Moments</h3>
          <p className="text-4xl font-bold text-white">{gratitude.length}</p>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-bold text-white">Care Received</h3>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No care entries yet. Start acknowledging the support you receive!</p>
          </div>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className="bg-gradient-to-br from-purple-900/20 to-purple-900/20 p-6 rounded-xl border border-purple-500/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-6 h-6 text-purple-400" />
                    <h4 className="text-xl font-bold text-white">{entry.partnerName}</h4>
                    <span className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-sm">
                      {entry.careType}
                    </span>
                    {entry.reciprocated && (
                      <span className="bg-green-500/20 px-3 py-1 rounded-full text-green-300 text-sm">
                        ↔️ Reciprocated
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-purple-300 text-sm mb-1">What they did:</p>
                    <p className="text-white">{entry.whatTheyDid}</p>
                  </div>

                  {expandedEntry === entry.id && (
                    <div className="space-y-3 border-t border-purple-500/30 pt-4 mt-4">
                      {entry.howItHelped && (
                        <div>
                          <p className="text-purple-300 text-sm mb-1">How it helped:</p>
                          <p className="text-purple-200">{entry.howItHelped}</p>
                        </div>
                      )}
                      {entry.myGratitude && (
                        <div>
                          <p className="text-purple-300 text-sm mb-1">My gratitude:</p>
                          <p className="text-purple-200 italic">{entry.myGratitude}</p>
                        </div>
                      )}
                      {entry.reciprocated && entry.reciprocationDetails && (
                        <div>
                          <p className="text-green-300 text-sm mb-1">How I reciprocated:</p>
                          <p className="text-green-200">{entry.reciprocationDetails}</p>
                        </div>
                      )}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, i) => (
                            <span key={i} className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                    className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all"
                  >
                    {expandedEntry === entry.id ? (
                      <EyeOff className="w-5 h-5 text-purple-300" />
                    ) : (
                      <Eye className="w-5 h-5 text-purple-300" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-red-300" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Gratitude Moments */}
      {gratitude.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Gratitude Moments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gratitude.map(g => (
              <div key={g.id} className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{new Date(g.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-purple-200 mb-2">{g.moment}</p>
                {g.feeling && (
                  <p className="text-purple-300 text-sm italic">Feeling: {g.feeling}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/90 to-purple-900/90 p-8 rounded-2xl border border-purple-500/50 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Log Care Received</h3>
              <button onClick={() => { setShowAddForm(false); resetForm(); }} className="p-2 bg-red-500/20 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Partner Name *</label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Type of Care</label>
                  <select
                    value={formData.careType}
                    onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  >
                    {careTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">What They Did *</label>
                <textarea
                  value={formData.whatTheyDid}
                  onChange={(e) => setFormData({ ...formData, whatTheyDid: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">How It Helped</label>
                <textarea
                  value={formData.howItHelped}
                  onChange={(e) => setFormData({ ...formData, howItHelped: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">My Gratitude</label>
                <textarea
                  value={formData.myGratitude}
                  onChange={(e) => setFormData({ ...formData, myGratitude: e.target.value })}
                  rows={2}
                  placeholder="Express your appreciation..."
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.reciprocated}
                    onChange={(e) => setFormData({ ...formData, reciprocated: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-purple-300 font-semibold">I reciprocated this care</span>
                </label>
                {formData.reciprocated && (
                  <textarea
                    value={formData.reciprocationDetails}
                    onChange={(e) => setFormData({ ...formData, reciprocationDetails: e.target.value })}
                    placeholder="How did you reciprocate?"
                    rows={2}
                    className="w-full px-4 py-3 bg-green-900/30 border border-green-500/30 rounded-lg text-green-200 placeholder-green-500 mt-2"
                  />
                )}
              </div>

              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-full text-sm"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-2 bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addEntry}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-500 text-white rounded-xl font-bold"
              >
                Add Entry
              </button>
              <button
                onClick={() => { setShowAddForm(false); resetForm(); }}
                className="px-6 py-4 bg-purple-900/30 text-purple-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gratitude Form */}
      {showGratitudeForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900/90 to-purple-900/90 p-8 rounded-2xl border border-purple-500/50 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Quick Gratitude</h3>
              <button onClick={() => setShowGratitudeForm(false)} className="p-2 bg-red-500/20 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-300 mb-2">Date</label>
                <input
                  type="date"
                  value={gratitudeForm.date}
                  onChange={(e) => setGratitudeForm({ ...gratitudeForm, date: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Grateful Moment</label>
                <textarea
                  value={gratitudeForm.moment}
                  onChange={(e) => setGratitudeForm({ ...gratitudeForm, moment: e.target.value })}
                  rows={4}
                  placeholder="What are you grateful for?"
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-300 mb-2">Feeling (Optional)</label>
                <input
                  type="text"
                  value={gratitudeForm.feeling}
                  onChange={(e) => setGratitudeForm({ ...gratitudeForm, feeling: e.target.value })}
                  placeholder="Loved, supported, appreciated..."
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addGratitudeEntry}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-500 text-white rounded-xl font-bold"
              >
                Add Gratitude
              </button>
              <button
                onClick={() => setShowGratitudeForm(false)}
                className="px-6 py-4 bg-purple-900/30 text-purple-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerCareLog;
