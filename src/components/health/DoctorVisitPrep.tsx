import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Download, Calendar, CheckSquare, AlertCircle, User, Pill, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

interface VisitPrep {
  id: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  visitReason: string;
  currentSymptoms: string[];
  questionsToAsk: string[];
  medicationsToDiscuss: string[];
  goalsForVisit: string[];
  concernsToAddress: string[];
  recentChanges: string;
  notes: string;
  completed: boolean;
  visitNotes?: string;
  followUpNeeded?: string;
  createdDate: number;
}

const DoctorVisitPrep: React.FC = () => {
  const [visits, setVisits] = useState<VisitPrep[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitPrep | null>(null);
  const [formData, setFormData] = useState<Partial<VisitPrep>>({
    currentSymptoms: [],
    questionsToAsk: [],
    medicationsToDiscuss: [],
    goalsForVisit: [],
    concernsToAddress: [],
    completed: false,
  });
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('doctor-visit-prep');
    if (stored) {
      setVisits(JSON.parse(stored));
    }
  }, []);

  const saveVisits = (newVisits: VisitPrep[]) => {
    setVisits(newVisits);
    localStorage.setItem('doctor-visit-prep', JSON.stringify(newVisits));
  };

  const createVisit = () => {
    if (!formData.doctorName || !formData.appointmentDate) {
      toast.error('Doctor name and appointment date required');
      return;
    }

    const newVisit: VisitPrep = {
      id: `visit_${Date.now()}`,
      doctorName: formData.doctorName!,
      specialty: formData.specialty || '',
      appointmentDate: formData.appointmentDate!,
      appointmentTime: formData.appointmentTime || '',
      visitReason: formData.visitReason || '',
      currentSymptoms: formData.currentSymptoms || [],
      questionsToAsk: formData.questionsToAsk || [],
      medicationsToDiscuss: formData.medicationsToDiscuss || [],
      goalsForVisit: formData.goalsForVisit || [],
      concernsToAddress: formData.concernsToAddress || [],
      recentChanges: formData.recentChanges || '',
      notes: formData.notes || '',
      completed: false,
      createdDate: Date.now(),
    };

    saveVisits([...visits, newVisit]);
    setFormData({
      currentSymptoms: [],
      questionsToAsk: [],
      medicationsToDiscuss: [],
      goalsForVisit: [],
      concernsToAddress: [],
      completed: false,
    });
    setShowForm(false);
    toast.success('Visit prep created');
  };

  const addToList = (field: keyof VisitPrep) => {
    if (!newItem.trim()) return;

    setFormData({
      ...formData,
      [field]: [...(formData[field] as string[] || []), newItem]
    });
    setNewItem('');
  };

  const removeFromList = (field: keyof VisitPrep, index: number) => {
    const list = formData[field] as string[];
    setFormData({
      ...formData,
      [field]: list.filter((_, i) => i !== index)
    });
  };

  const markComplete = (id: string) => {
    const updated = visits.map(v =>
      v.id === id ? { ...v, completed: true } : v
    );
    saveVisits(updated);
    toast.success('Visit marked as complete');
  };

  const deleteVisit = (id: string) => {
    saveVisits(visits.filter(v => v.id !== id));
    toast.success('Visit prep deleted');
    if (selectedVisit?.id === id) {
      setSelectedVisit(null);
    }
  };

  const exportVisit = (visit: VisitPrep) => {
    const content = `
DOCTOR VISIT PREPARATION
========================

Doctor: ${visit.doctorName}
Specialty: ${visit.specialty}
Date: ${new Date(visit.appointmentDate).toLocaleDateString()}
Time: ${visit.appointmentTime}
Reason: ${visit.visitReason}

CURRENT SYMPTOMS:
${visit.currentSymptoms.map(s => `• ${s}`).join('\n')}

QUESTIONS TO ASK:
${visit.questionsToAsk.map(q => `• ${q}`).join('\n')}

MEDICATIONS TO DISCUSS:
${visit.medicationsToDiscuss.map(m => `• ${m}`).join('\n')}

GOALS FOR THIS VISIT:
${visit.goalsForVisit.map(g => `• ${g}`).join('\n')}

CONCERNS TO ADDRESS:
${visit.concernsToAddress.map(c => `• ${c}`).join('\n')}

RECENT CHANGES:
${visit.recentChanges}

ADDITIONAL NOTES:
${visit.notes}

${visit.completed ? `
POST-VISIT NOTES:
${visit.visitNotes}

FOLLOW-UP NEEDED:
${visit.followUpNeeded}
` : ''}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctor-visit-${visit.doctorName.replace(/\s+/g, '-')}-${visit.appointmentDate}.txt`;
    a.click();
    toast.success('Visit prep exported');
  };

  const upcomingVisits = visits
    .filter(v => !v.completed && new Date(v.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const pastVisits = visits
    .filter(v => v.completed || new Date(v.appointmentDate) < new Date())
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Doctor Visit Prep</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Visit Prep'}
        </button>
      </div>

      {showForm && (
        <div className="bg-black/60 p-6 rounded-lg border border-indigo-500/30 mb-6 space-y-4">
          <h3 className="text-indigo-300 font-semibold text-lg">Prepare for Appointment</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-indigo-300 text-sm font-semibold mb-2">Doctor Name *</label>
              <input
                type="text"
                value={formData.doctorName || ''}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                placeholder="Dr. Smith"
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-indigo-400/50"
              />
            </div>
            <div>
              <label className="block text-indigo-300 text-sm font-semibold mb-2">Specialty</label>
              <input
                type="text"
                value={formData.specialty || ''}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                placeholder="Cardiologist, PCP, etc."
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-indigo-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-indigo-300 text-sm font-semibold mb-2">Appointment Date *</label>
              <input
                type="date"
                value={formData.appointmentDate || ''}
                onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-indigo-300 text-sm font-semibold mb-2">Time</label>
              <input
                type="time"
                value={formData.appointmentTime || ''}
                onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-indigo-300 text-sm font-semibold mb-2">Reason for Visit</label>
            <input
              type="text"
              value={formData.visitReason || ''}
              onChange={(e) => setFormData({...formData, visitReason: e.target.value})}
              placeholder="Follow-up, new symptoms, medication adjustment..."
              className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-indigo-400/50"
            />
          </div>

          {/* Current Symptoms */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <label className="block text-red-300 text-sm font-semibold mb-2">Current Symptoms</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToList('currentSymptoms')}
                placeholder="Add symptom..."
                className="flex-1 bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder-red-400/50"
              />
              <button
                onClick={() => addToList('currentSymptoms')}
                className="px-4 py-2 bg-red-600/30 hover:bg-red-500/40 text-red-300 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1">
              {formData.currentSymptoms?.map((symptom, idx) => (
                <li key={idx} className="flex items-center justify-between bg-black/40 px-3 py-2 rounded text-white text-sm">
                  <span>• {symptom}</span>
                  <button onClick={() => removeFromList('currentSymptoms', idx)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Questions to Ask */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <label className="block text-blue-300 text-sm font-semibold mb-2">Questions to Ask</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToList('questionsToAsk')}
                placeholder="Add question..."
                className="flex-1 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-blue-400/50"
              />
              <button
                onClick={() => addToList('questionsToAsk')}
                className="px-4 py-2 bg-blue-600/30 hover:bg-blue-500/40 text-blue-300 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1">
              {formData.questionsToAsk?.map((question, idx) => (
                <li key={idx} className="flex items-center justify-between bg-black/40 px-3 py-2 rounded text-white text-sm">
                  <span>• {question}</span>
                  <button onClick={() => removeFromList('questionsToAsk', idx)} className="text-blue-400 hover:text-blue-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Goals for Visit */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <label className="block text-green-300 text-sm font-semibold mb-2">Goals for This Visit</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToList('goalsForVisit')}
                placeholder="Add goal..."
                className="flex-1 bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
              <button
                onClick={() => addToList('goalsForVisit')}
                className="px-4 py-2 bg-green-600/30 hover:bg-green-500/40 text-green-300 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1">
              {formData.goalsForVisit?.map((goal, idx) => (
                <li key={idx} className="flex items-center justify-between bg-black/40 px-3 py-2 rounded text-white text-sm">
                  <span>• {goal}</span>
                  <button onClick={() => removeFromList('goalsForVisit', idx)} className="text-green-400 hover:text-green-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-indigo-300 text-sm font-semibold mb-2">Recent Changes or Updates</label>
            <textarea
              value={formData.recentChanges || ''}
              onChange={(e) => setFormData({...formData, recentChanges: e.target.value})}
              placeholder="Any changes in symptoms, medications, or lifestyle since last visit..."
              className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-indigo-400/50"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-indigo-300 text-sm font-semibold mb-2">Additional Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Anything else to remember or bring up..."
              className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white placeholder-indigo-400/50"
              rows={2}
            />
          </div>

          <button
            onClick={createVisit}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Visit Prep
          </button>
        </div>
      )}

      {/* Upcoming Visits */}
      {upcomingVisits.length > 0 && (
        <div className="mb-6">
          <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {upcomingVisits.map(visit => (
              <div key={visit.id} className="bg-black/40 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-bold text-lg">{visit.doctorName}</h4>
                    {visit.specialty && <p className="text-indigo-400 text-sm">{visit.specialty}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportVisit(visit)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                      title="Export to text file"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => markComplete(visit.id)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                      title="Mark as complete"
                    >
                      <CheckSquare className="w-4 h-4 text-green-400" />
                    </button>
                    <button
                      onClick={() => deleteVisit(visit.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1 text-purple-300">
                    <Calendar className="w-4 h-4" />
                    {new Date(visit.appointmentDate).toLocaleDateString()}
                  </div>
                  {visit.appointmentTime && (
                    <span className="text-purple-300">{visit.appointmentTime}</span>
                  )}
                </div>

                {visit.visitReason && (
                  <p className="text-gray-300 text-sm mb-3"><span className="font-semibold">Reason:</span> {visit.visitReason}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {visit.currentSymptoms.length > 0 && (
                    <div>
                      <p className="text-red-300 font-semibold mb-1">Symptoms ({visit.currentSymptoms.length})</p>
                      <ul className="text-gray-300 text-xs">
                        {visit.currentSymptoms.slice(0, 3).map((s, idx) => (
                          <li key={idx}>• {s}</li>
                        ))}
                        {visit.currentSymptoms.length > 3 && <li className="text-gray-500">+ {visit.currentSymptoms.length - 3} more</li>}
                      </ul>
                    </div>
                  )}

                  {visit.questionsToAsk.length > 0 && (
                    <div>
                      <p className="text-blue-300 font-semibold mb-1">Questions ({visit.questionsToAsk.length})</p>
                      <ul className="text-gray-300 text-xs">
                        {visit.questionsToAsk.slice(0, 3).map((q, idx) => (
                          <li key={idx}>• {q}</li>
                        ))}
                        {visit.questionsToAsk.length > 3 && <li className="text-gray-500">+ {visit.questionsToAsk.length - 3} more</li>}
                      </ul>
                    </div>
                  )}

                  {visit.goalsForVisit.length > 0 && (
                    <div>
                      <p className="text-green-300 font-semibold mb-1">Goals ({visit.goalsForVisit.length})</p>
                      <ul className="text-gray-300 text-xs">
                        {visit.goalsForVisit.slice(0, 2).map((g, idx) => (
                          <li key={idx}>• {g}</li>
                        ))}
                        {visit.goalsForVisit.length > 2 && <li className="text-gray-500">+ {visit.goalsForVisit.length - 2} more</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Visits */}
      {pastVisits.length > 0 && (
        <div>
          <h3 className="text-gray-400 font-semibold mb-3">Past Appointments</h3>
          <div className="space-y-2">
            {pastVisits.map(visit => (
              <div key={visit.id} className="bg-black/20 p-3 rounded-lg border border-gray-600/20 opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold">{visit.doctorName}</span>
                    <span className="text-gray-400 text-sm ml-3">
                      {new Date(visit.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportVisit(visit)}
                      className="p-1 hover:bg-blue-500/20 rounded"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => deleteVisit(visit.id)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visits.length === 0 && (
        <div className="text-center text-indigo-400 py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">No visits prepared yet</p>
          <p className="text-sm mt-2">Click "New Visit Prep" to prepare for an upcoming appointment</p>
        </div>
      )}

      <div className="mt-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-3">
        <p className="text-indigo-300 text-xs">
          <span className="font-bold">Self-Advocacy Tool:</span> Prepare thoroughly for doctor visits by documenting symptoms, questions, and goals. Export your prep sheet to bring to appointments or share with providers.
        </p>
      </div>
    </div>
  );
};

export default DoctorVisitPrep;
