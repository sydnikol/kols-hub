import React, { useState, useEffect } from 'react';
import { Activity, Calendar, FileText, Shield, TrendingUp, Plus, Edit2, Trash2, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Appointment {
  id: string;
  provider: string;
  specialty: string;
  date: string;
  time: string;
  purpose: string;
  questionsToAsk: string[];
  symptomsToReport: string[];
  prepNotes: string;
  followUpNeeded: boolean;
  completed: boolean;
  outcomeNotes?: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  type: 'primary' | 'specialist' | 'therapist' | 'dentist' | 'other';
  phone: string;
  address: string;
  rating: number; // 1-5
  lgbtqAffirming: boolean;
  disabilityAware: boolean;
  acceptingNewPatients: boolean;
  notes: string;
  lastVisit?: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  provider: string;
  type: 'diagnosis' | 'prescription' | 'procedure' | 'lab-result' | 'imaging' | 'referral' | 'other';
  title: string;
  details: string;
  important: boolean;
  followUpRequired: boolean;
  attachments: string[];
}

interface SymptomLog {
  id: string;
  date: string;
  symptom: string;
  severity: number; // 1-10
  duration: string;
  triggers: string[];
  relievingFactors: string[];
  associatedSymptoms: string[];
  notes: string;
}

interface MedicationTracker {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  prescriber: string;
  startDate: string;
  endDate?: string;
  sideEffects: string[];
  effectiveness: number; // 1-5
  active: boolean;
  reminderEnabled: boolean;
}

const MedicalAdvocacyHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'providers' | 'records' | 'symptoms' | 'medications'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
  const [medications, setMedications] = useState<MedicationTracker[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('medicalAppointments');
    const savedProviders = localStorage.getItem('medicalProviders');
    const savedRecords = localStorage.getItem('medicalRecords');
    const savedSymptoms = localStorage.getItem('symptomLogs');
    const savedMedications = localStorage.getItem('medicationTrackers');

    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
    if (savedProviders) setProviders(JSON.parse(savedProviders));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));
    if (savedMedications) setMedications(JSON.parse(savedMedications));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('medicalAppointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medicalProviders', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('medicalRecords', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('symptomLogs', JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem('medicationTrackers', JSON.stringify(medications));
  }, [medications]);

  const addAppointment = () => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      provider: '',
      specialty: '',
      date: '',
      time: '',
      purpose: '',
      questionsToAsk: [],
      symptomsToReport: [],
      prepNotes: '',
      followUpNeeded: false,
      completed: false,
    };
    setAppointments([...appointments, newAppointment]);
    toast.success('Appointment prep added');
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, ...updates } : apt));
    toast.success('Appointment updated');
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    toast.success('Appointment deleted');
  };

  const addProvider = () => {
    const newProvider: Provider = {
      id: Date.now().toString(),
      name: '',
      specialty: '',
      type: 'specialist',
      phone: '',
      address: '',
      rating: 3,
      lgbtqAffirming: false,
      disabilityAware: false,
      acceptingNewPatients: true,
      notes: '',
    };
    setProviders([...providers, newProvider]);
    toast.success('Provider added');
  };

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders(providers.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Provider updated');
  };

  const deleteProvider = (id: string) => {
    setProviders(providers.filter(p => p.id !== id));
    toast.success('Provider deleted');
  };

  const addRecord = () => {
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      provider: '',
      type: 'diagnosis',
      title: '',
      details: '',
      important: false,
      followUpRequired: false,
      attachments: [],
    };
    setRecords([...records, newRecord]);
    toast.success('Medical record added');
  };

  const updateRecord = (id: string, updates: Partial<MedicalRecord>) => {
    setRecords(records.map(r => r.id === id ? { ...r, ...updates } : r));
    toast.success('Record updated');
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    toast.success('Record deleted');
  };

  const addSymptom = () => {
    const newSymptom: SymptomLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      symptom: '',
      severity: 5,
      duration: '',
      triggers: [],
      relievingFactors: [],
      associatedSymptoms: [],
      notes: '',
    };
    setSymptoms([...symptoms, newSymptom]);
    toast.success('Symptom logged');
  };

  const updateSymptom = (id: string, updates: Partial<SymptomLog>) => {
    setSymptoms(symptoms.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Symptom updated');
  };

  const deleteSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
    toast.success('Symptom deleted');
  };

  const addMedication = () => {
    const newMedication: MedicationTracker = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      purpose: '',
      prescriber: '',
      startDate: new Date().toISOString().split('T')[0],
      sideEffects: [],
      effectiveness: 3,
      active: true,
      reminderEnabled: false,
    };
    setMedications([...medications, newMedication]);
    toast.success('Medication added');
  };

  const updateMedication = (id: string, updates: Partial<MedicationTracker>) => {
    setMedications(medications.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Medication updated');
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    toast.success('Medication deleted');
  };

  const upcomingAppointments = appointments.filter(a => !a.completed && new Date(a.date) >= new Date()).length;
  const activeProviders = providers.filter(p => p.rating >= 4).length;
  const activeMedications = medications.filter(m => m.active).length;
  const recentSymptoms = symptoms.filter(s => {
    const logDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Medical Advocacy Hub</h1>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{upcomingAppointments}</div>
            <div className="text-xs opacity-90">Upcoming</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Activity className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeProviders}</div>
            <div className="text-xs opacity-90">Top Providers</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{activeMedications}</div>
            <div className="text-xs opacity-90">Active Meds</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{recentSymptoms}</div>
            <div className="text-xs opacity-90">Symptoms (7d)</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'providers', label: 'Providers', icon: Shield },
            { id: 'records', label: 'Records', icon: FileText },
            { id: 'symptoms', label: 'Symptoms', icon: AlertCircle },
            { id: 'medications', label: 'Medications', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
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
        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <button
              onClick={addAppointment}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Prepare for Appointment</span>
            </button>

            {appointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No appointments yet. Add one to start preparing!</p>
              </div>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${apt.completed ? 'border-green-500' : 'border-blue-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={apt.provider}
                      onChange={(e) => updateAppointment(apt.id, { provider: e.target.value })}
                      placeholder="Provider name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteAppointment(apt.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={apt.specialty}
                      onChange={(e) => updateAppointment(apt.id, { specialty: e.target.value })}
                      placeholder="Specialty..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="date"
                      value={apt.date}
                      onChange={(e) => updateAppointment(apt.id, { date: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="time"
                      value={apt.time}
                      onChange={(e) => updateAppointment(apt.id, { time: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={apt.purpose}
                      onChange={(e) => updateAppointment(apt.id, { purpose: e.target.value })}
                      placeholder="Purpose..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={apt.prepNotes}
                    onChange={(e) => updateAppointment(apt.id, { prepNotes: e.target.value })}
                    placeholder="Preparation notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none mb-2"
                    rows={2}
                  />

                  {apt.completed && (
                    <textarea
                      value={apt.outcomeNotes || ''}
                      onChange={(e) => updateAppointment(apt.id, { outcomeNotes: e.target.value })}
                      placeholder="Outcome notes..."
                      className="w-full text-sm bg-green-50 px-3 py-2 rounded border border-green-300 focus:border-green-500 outline-none mb-2"
                      rows={2}
                    />
                  )}

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={apt.completed}
                        onChange={(e) => updateAppointment(apt.id, { completed: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Completed</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={apt.followUpNeeded}
                        onChange={(e) => updateAppointment(apt.id, { followUpNeeded: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Follow-up needed</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            <button
              onClick={addProvider}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Provider</span>
            </button>

            {providers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No providers yet. Add your healthcare team!</p>
              </div>
            ) : (
              providers.map(provider => (
                <div key={provider.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={provider.name}
                      onChange={(e) => updateProvider(provider.id, { name: e.target.value })}
                      placeholder="Provider name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteProvider(provider.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={provider.specialty}
                      onChange={(e) => updateProvider(provider.id, { specialty: e.target.value })}
                      placeholder="Specialty..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <select
                      value={provider.type}
                      onChange={(e) => updateProvider(provider.id, { type: e.target.value as Provider['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="primary">Primary Care</option>
                      <option value="specialist">Specialist</option>
                      <option value="therapist">Therapist</option>
                      <option value="dentist">Dentist</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="tel"
                      value={provider.phone}
                      onChange={(e) => updateProvider(provider.id, { phone: e.target.value })}
                      placeholder="Phone..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => updateProvider(provider.id, { rating: star })}
                          className={`${star <= provider.rating ? 'text-green-500' : 'text-gray-300'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={provider.address}
                    onChange={(e) => updateProvider(provider.id, { address: e.target.value })}
                    placeholder="Address..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none mb-2"
                  />

                  <textarea
                    value={provider.notes}
                    onChange={(e) => updateProvider(provider.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none mb-2"
                    rows={2}
                  />

                  <div className="flex flex-wrap gap-3 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={provider.lgbtqAffirming}
                        onChange={(e) => updateProvider(provider.id, { lgbtqAffirming: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">LGBTQ+ Affirming</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={provider.disabilityAware}
                        onChange={(e) => updateProvider(provider.id, { disabilityAware: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Disability Aware</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={provider.acceptingNewPatients}
                        onChange={(e) => updateProvider(provider.id, { acceptingNewPatients: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Accepting New Patients</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            <button
              onClick={addRecord}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Medical Record</span>
            </button>

            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No records yet. Track your medical history!</p>
              </div>
            ) : (
              records.map(record => (
                <div key={record.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${record.important ? 'border-red-500' : 'border-blue-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={record.title}
                      onChange={(e) => updateRecord(record.id, { title: e.target.value })}
                      placeholder="Record title..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteRecord(record.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="date"
                      value={record.date}
                      onChange={(e) => updateRecord(record.id, { date: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <select
                      value={record.type}
                      onChange={(e) => updateRecord(record.id, { type: e.target.value as MedicalRecord['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    >
                      <option value="diagnosis">Diagnosis</option>
                      <option value="prescription">Prescription</option>
                      <option value="procedure">Procedure</option>
                      <option value="lab-result">Lab Result</option>
                      <option value="imaging">Imaging</option>
                      <option value="referral">Referral</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={record.provider}
                      onChange={(e) => updateRecord(record.id, { provider: e.target.value })}
                      placeholder="Provider..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={record.details}
                    onChange={(e) => updateRecord(record.id, { details: e.target.value })}
                    placeholder="Details..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none mb-2"
                    rows={3}
                  />

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={record.important}
                        onChange={(e) => updateRecord(record.id, { important: e.target.checked })}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-gray-700">Important</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={record.followUpRequired}
                        onChange={(e) => updateRecord(record.id, { followUpRequired: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Follow-up required</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Symptoms Tab */}
        {activeTab === 'symptoms' && (
          <div className="space-y-4">
            <button
              onClick={addSymptom}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Log Symptom</span>
            </button>

            {symptoms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No symptoms logged yet. Track patterns over time!</p>
              </div>
            ) : (
              symptoms.map(symptom => (
                <div key={symptom.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={symptom.symptom}
                      onChange={(e) => updateSymptom(symptom.id, { symptom: e.target.value })}
                      placeholder="Symptom..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteSymptom(symptom.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="date"
                      value={symptom.date}
                      onChange={(e) => updateSymptom(symptom.id, { date: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={symptom.duration}
                      onChange={(e) => updateSymptom(symptom.id, { duration: e.target.value })}
                      placeholder="Duration..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Severity: {symptom.severity}/10</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={symptom.severity}
                      onChange={(e) => updateSymptom(symptom.id, { severity: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>

                  <textarea
                    value={symptom.notes}
                    onChange={(e) => updateSymptom(symptom.id, { notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="space-y-4">
            <button
              onClick={addMedication}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Medication</span>
            </button>

            {medications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No medications yet. Track your prescriptions!</p>
              </div>
            ) : (
              medications.map(med => (
                <div key={med.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${med.active ? 'border-green-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(med.id, { name: e.target.value })}
                      placeholder="Medication name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-green-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteMedication(med.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(med.id, { dosage: e.target.value })}
                      placeholder="Dosage..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(med.id, { frequency: e.target.value })}
                      placeholder="Frequency..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={med.purpose}
                      onChange={(e) => updateMedication(med.id, { purpose: e.target.value })}
                      placeholder="Purpose..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="text"
                      value={med.prescriber}
                      onChange={(e) => updateMedication(med.id, { prescriber: e.target.value })}
                      placeholder="Prescriber..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="date"
                      value={med.startDate}
                      onChange={(e) => updateMedication(med.id, { startDate: e.target.value })}
                      placeholder="Start date..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                    <input
                      type="date"
                      value={med.endDate || ''}
                      onChange={(e) => updateMedication(med.id, { endDate: e.target.value })}
                      placeholder="End date (optional)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Effectiveness: {med.effectiveness}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateMedication(med.id, { effectiveness: level })}
                          className={`w-10 h-10 rounded ${level <= med.effectiveness ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={med.active}
                        onChange={(e) => updateMedication(med.id, { active: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Currently taking</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={med.reminderEnabled}
                        onChange={(e) => updateMedication(med.id, { reminderEnabled: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Reminder</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalAdvocacyHubPage;
