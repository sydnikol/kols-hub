import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, FileText, Trash2, AlertTriangle, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Visit {
  id: string;
  type: 'ER' | 'Hospital' | 'Urgent Care' | 'Clinic';
  facility: string;
  date: string;
  arrivalTime?: string;
  departureTime?: string;
  chiefComplaint: string;
  treatment: string;
  diagnosis?: string;
  medications?: string;
  followUp?: string;
  provider?: string;
  notes?: string;
}

const HospitalVisitsLog: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Visit>>({
    type: 'ER',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const stored = localStorage.getItem('hospital-visits');
    if (stored) {
      setVisits(JSON.parse(stored));
    }
  }, []);

  const saveVisits = (newVisits: Visit[]) => {
    setVisits(newVisits);
    localStorage.setItem('hospital-visits', JSON.stringify(newVisits));
  };

  const addVisit = () => {
    if (!formData.facility || !formData.chiefComplaint) {
      toast.error('Please fill required fields');
      return;
    }

    const newVisit: Visit = {
      id: `visit_${Date.now()}`,
      type: formData.type as Visit['type'],
      facility: formData.facility!,
      date: formData.date!,
      arrivalTime: formData.arrivalTime,
      departureTime: formData.departureTime,
      chiefComplaint: formData.chiefComplaint!,
      treatment: formData.treatment || '',
      diagnosis: formData.diagnosis,
      medications: formData.medications,
      followUp: formData.followUp,
      provider: formData.provider,
      notes: formData.notes,
    };

    saveVisits([...visits, newVisit]);
    setFormData({ type: 'ER', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    toast.success('Visit logged');
  };

  const deleteVisit = (id: string) => {
    saveVisits(visits.filter(v => v.id !== id));
    toast.success('Visit deleted');
  };

  const getTypeColor = (type: Visit['type']) => {
    switch (type) {
      case 'ER': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Hospital': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Urgent Care': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Clinic': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 p-6 rounded-xl border border-red-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Hospital & ER Visits</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Log Visit'}
        </button>
      </div>

      {showForm && (
        <div className="bg-black/60 p-4 rounded-lg border border-red-500/30 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Visit['type']})}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="ER">ER</option>
                <option value="Hospital">Hospital Stay</option>
                <option value="Urgent Care">Urgent Care</option>
                <option value="Clinic">Clinic</option>
              </select>
            </div>
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-red-300 text-sm font-semibold mb-2">Facility Name *</label>
            <input
              type="text"
              value={formData.facility || ''}
              onChange={(e) => setFormData({...formData, facility: e.target.value})}
              placeholder="Truman Medical Center"
              className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder-red-400/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">Arrival Time</label>
              <input
                type="time"
                value={formData.arrivalTime || ''}
                onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">Departure Time</label>
              <input
                type="time"
                value={formData.departureTime || ''}
                onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-red-300 text-sm font-semibold mb-2">Chief Complaint *</label>
            <input
              type="text"
              value={formData.chiefComplaint || ''}
              onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
              placeholder="POTS flare, fainting episode"
              className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder-red-400/50"
            />
          </div>

          <div>
            <label className="block text-red-300 text-sm font-semibold mb-2">Treatment Received</label>
            <textarea
              value={formData.treatment || ''}
              onChange={(e) => setFormData({...formData, treatment: e.target.value})}
              placeholder="IV fluids, labs, EKG..."
              className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder-red-400/50"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">Diagnosis</label>
              <input
                type="text"
                value={formData.diagnosis || ''}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">Provider</label>
              <input
                type="text"
                value={formData.provider || ''}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                placeholder="Dr. Smith"
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-red-300 text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional details, follow-up instructions..."
              className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder-red-400/50"
              rows={3}
            />
          </div>

          <button
            onClick={addVisit}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Visit
          </button>
        </div>
      )}

      <div className="space-y-4">
        {visits.length > 0 ? (
          visits.slice().reverse().map((visit) => (
            <div key={visit.id} className={`p-4 rounded-lg border-2 ${getTypeColor(visit.type)}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-white">{visit.type}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(visit.type)}`}>
                      {visit.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{visit.facility}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteVisit(visit.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(visit.date).toLocaleDateString()}</span>
                </div>
                {visit.arrivalTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{visit.arrivalTime} - {visit.departureTime || '?'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Chief Complaint:</span> {visit.chiefComplaint}
                </div>
                {visit.treatment && (
                  <div>
                    <span className="font-semibold">Treatment:</span> {visit.treatment}
                  </div>
                )}
                {visit.diagnosis && (
                  <div>
                    <span className="font-semibold">Diagnosis:</span> {visit.diagnosis}
                  </div>
                )}
                {visit.provider && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{visit.provider}</span>
                  </div>
                )}
                {visit.notes && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <span className="font-semibold">Notes:</span> {visit.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-red-400 py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No visits logged yet</p>
            <p className="text-sm mt-2">Click "Log Visit" to add your first entry</p>
          </div>
        )}
      </div>

      <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
        <p className="text-red-300 text-xs">
          <span className="font-bold">Keep accurate records:</span> Document all ER visits and hospital stays for medical history and insurance purposes.
        </p>
      </div>
    </div>
  );
};

export default HospitalVisitsLog;
