import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Calendar, DollarSign, Syringe, Pill, Scale, Activity, FileText, Plus, Edit2, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'other';
  breed: string;
  birthday: string;
  adoptionDate: string;
  weight: number;
  gender: 'male' | 'female' | 'unknown';
  microchipId: string;
  photo?: string;
  specialNeeds: string;
  allergies: string[];
  medications: string[];
  notes: string;
  createdAt: number;
}

interface VetAppointment {
  id: string;
  petId: string;
  date: string;
  time: string;
  vetClinic: string;
  vetName: string;
  reason: string;
  type: 'checkup' | 'vaccination' | 'emergency' | 'surgery' | 'dental' | 'grooming' | 'other';
  cost: number;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  followUp?: string;
  createdAt: number;
}

interface HealthRecord {
  id: string;
  petId: string;
  date: string;
  type: 'weight' | 'vaccination' | 'medication' | 'symptom' | 'behavior' | 'diet' | 'other';
  title: string;
  description: string;
  value?: number; // for weight tracking
  attachments: string[];
  createdAt: number;
}

interface Expense {
  id: string;
  petId: string;
  date: string;
  category: 'food' | 'medical' | 'grooming' | 'supplies' | 'toys' | 'boarding' | 'insurance' | 'other';
  description: string;
  amount: number;
  vendor: string;
  notes: string;
  createdAt: number;
}

interface Reminder {
  id: string;
  petId: string;
  title: string;
  type: 'vaccination' | 'medication' | 'grooming' | 'checkup' | 'flea-tick' | 'deworming' | 'other';
  dueDate: string;
  recurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  notes: string;
  createdAt: number;
}

const PetCareHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pets' | 'appointments' | 'health' | 'expenses' | 'reminders'>('pets');
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // Pets Tab
  const [pets, setPets] = useState<Pet[]>([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<string | null>(null);
  const [newPet, setNewPet] = useState<Partial<Pet>>({
    type: 'dog',
    gender: 'unknown',
    allergies: [],
    medications: []
  });

  // Appointments Tab
  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState<Partial<VetAppointment>>({
    type: 'checkup',
    status: 'scheduled'
  });

  // Health Records Tab
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [newHealthRecord, setNewHealthRecord] = useState<Partial<HealthRecord>>({
    type: 'weight',
    attachments: []
  });

  // Expenses Tab
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'food'
  });

  // Reminders Tab
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    type: 'vaccination',
    recurring: false,
    completed: false
  });

  // Load data
  useEffect(() => {
    const savedPets = localStorage.getItem('pets');
    const savedAppointments = localStorage.getItem('vetAppointments');
    const savedHealthRecords = localStorage.getItem('healthRecords');
    const savedExpenses = localStorage.getItem('petExpenses');
    const savedReminders = localStorage.getItem('petReminders');

    if (savedPets) {
      const loadedPets = JSON.parse(savedPets);
      setPets(loadedPets);
      if (loadedPets.length > 0 && !selectedPet) {
        setSelectedPet(loadedPets[0].id);
      }
    }
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
    if (savedHealthRecords) setHealthRecords(JSON.parse(savedHealthRecords));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('vetAppointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem('petExpenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('petReminders', JSON.stringify(reminders));
  }, [reminders]);

  // Pet functions
  const savePet = () => {
    if (!newPet.name || !newPet.type) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingPet) {
      setPets(pets.map(p => p.id === editingPet ? { ...p, ...newPet } as Pet : p));
      toast.success('Pet updated!');
    } else {
      const pet: Pet = {
        id: Date.now().toString(),
        name: newPet.name!,
        type: newPet.type!,
        breed: newPet.breed || '',
        birthday: newPet.birthday || '',
        adoptionDate: newPet.adoptionDate || '',
        weight: newPet.weight || 0,
        gender: newPet.gender || 'unknown',
        microchipId: newPet.microchipId || '',
        specialNeeds: newPet.specialNeeds || '',
        allergies: newPet.allergies || [],
        medications: newPet.medications || [],
        notes: newPet.notes || '',
        createdAt: Date.now()
      };
      setPets([pet, ...pets]);
      setSelectedPet(pet.id);
      toast.success('Pet added!');
    }

    setNewPet({ type: 'dog', gender: 'unknown', allergies: [], medications: [] });
    setShowPetForm(false);
    setEditingPet(null);
  };

  const deletePet = (id: string) => {
    setPets(pets.filter(p => p.id !== id));
    if (selectedPet === id) {
      setSelectedPet(pets[0]?.id || null);
    }
    toast.success('Pet removed');
  };

  // Appointment functions
  const saveAppointment = () => {
    if (!newAppointment.petId || !newAppointment.date || !newAppointment.time) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingAppointment) {
      setAppointments(appointments.map(a => a.id === editingAppointment ? { ...a, ...newAppointment } as VetAppointment : a));
      toast.success('Appointment updated!');
    } else {
      const appointment: VetAppointment = {
        id: Date.now().toString(),
        petId: newAppointment.petId!,
        date: newAppointment.date!,
        time: newAppointment.time!,
        vetClinic: newAppointment.vetClinic || '',
        vetName: newAppointment.vetName || '',
        reason: newAppointment.reason || '',
        type: newAppointment.type || 'checkup',
        cost: newAppointment.cost || 0,
        notes: newAppointment.notes || '',
        status: newAppointment.status || 'scheduled',
        createdAt: Date.now()
      };
      setAppointments([appointment, ...appointments]);
      toast.success('Appointment scheduled!');
    }

    setNewAppointment({ type: 'checkup', status: 'scheduled' });
    setShowAppointmentForm(false);
    setEditingAppointment(null);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    toast.success('Appointment deleted');
  };

  // Health Record functions
  const saveHealthRecord = () => {
    if (!newHealthRecord.petId || !newHealthRecord.date || !newHealthRecord.title) {
      toast.error('Please fill in required fields');
      return;
    }

    const record: HealthRecord = {
      id: Date.now().toString(),
      petId: newHealthRecord.petId!,
      date: newHealthRecord.date!,
      type: newHealthRecord.type || 'other',
      title: newHealthRecord.title!,
      description: newHealthRecord.description || '',
      value: newHealthRecord.value,
      attachments: newHealthRecord.attachments || [],
      createdAt: Date.now()
    };
    setHealthRecords([record, ...healthRecords]);
    toast.success('Health record added!');

    setNewHealthRecord({ type: 'weight', attachments: [] });
    setShowHealthForm(false);
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords(healthRecords.filter(r => r.id !== id));
    toast.success('Record deleted');
  };

  // Expense functions
  const saveExpense = () => {
    if (!newExpense.petId || !newExpense.date || !newExpense.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      petId: newExpense.petId!,
      date: newExpense.date!,
      category: newExpense.category || 'food',
      description: newExpense.description || '',
      amount: newExpense.amount!,
      vendor: newExpense.vendor || '',
      notes: newExpense.notes || '',
      createdAt: Date.now()
    };
    setExpenses([expense, ...expenses]);
    toast.success('Expense logged!');

    setNewExpense({ category: 'food' });
    setShowExpenseForm(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('Expense deleted');
  };

  // Reminder functions
  const saveReminder = () => {
    if (!newReminder.petId || !newReminder.title || !newReminder.dueDate) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingReminder) {
      setReminders(reminders.map(r => r.id === editingReminder ? { ...r, ...newReminder } as Reminder : r));
      toast.success('Reminder updated!');
    } else {
      const reminder: Reminder = {
        id: Date.now().toString(),
        petId: newReminder.petId!,
        title: newReminder.title!,
        type: newReminder.type || 'other',
        dueDate: newReminder.dueDate!,
        recurring: newReminder.recurring || false,
        frequency: newReminder.frequency,
        completed: false,
        notes: newReminder.notes || '',
        createdAt: Date.now()
      };
      setReminders([reminder, ...reminders]);
      toast.success('Reminder created!');
    }

    setNewReminder({ type: 'vaccination', recurring: false, completed: false });
    setShowReminderForm(false);
    setEditingReminder(null);
  };

  const toggleReminderComplete = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast.success('Reminder deleted');
  };

  // Stats
  const currentPet = pets.find(p => p.id === selectedPet);
  const petAppointments = appointments.filter(a => a.petId === selectedPet);
  const upcomingAppointments = petAppointments.filter(a => a.status === 'scheduled' && new Date(a.date) >= new Date());
  const petExpenses = expenses.filter(e => e.petId === selectedPet);
  const totalPetExpenses = petExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyAvgExpense = petExpenses.length > 0 ? totalPetExpenses / Math.max(1, Math.ceil((Date.now() - Math.min(...petExpenses.map(e => new Date(e.date).getTime()))) / (1000 * 60 * 60 * 24 * 30))) : 0;
  const petReminders = reminders.filter(r => r.petId === selectedPet && !r.completed);
  const overdueReminders = petReminders.filter(r => new Date(r.dueDate) < new Date());

  const getPetIcon = (type: string) => {
    return '🐾';
  };

  const getAge = (birthday: string) => {
    if (!birthday) return 'Unknown';
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age === 0 ? 'Less than 1 year' : `${age} year${age > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-900 p-6">
        <button onClick={() => navigate('/')} className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Pet Care Hub</h1>
        </div>
        <p className="text-green-200">Track health, appointments, and expenses</p>
      </div>

      {/* Pet Selector */}
      {pets.length > 0 && (
        <div className="px-6 py-4 overflow-x-auto">
          <div className="flex gap-2 no-scrollbar">
            {pets.map(pet => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedPet === pet.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {getPetIcon(pet.type)} {pet.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {currentPet && (
        <div className="grid grid-cols-2 gap-4 px-6 mb-6">
          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-4 rounded-lg border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400">{upcomingAppointments.length}</div>
            <div className="text-sm text-blue-200">Upcoming</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-4 rounded-lg border border-orange-500/30">
            <div className="text-2xl font-bold text-orange-400">{overdueReminders.length}</div>
            <div className="text-sm text-orange-200">Overdue</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-4 rounded-lg border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">${totalPetExpenses.toFixed(0)}</div>
            <div className="text-sm text-green-200">Total Spent</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-4 rounded-lg border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-400">${monthlyAvgExpense.toFixed(0)}</div>
            <div className="text-sm text-purple-200">Monthly Avg</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 px-6 mb-6 no-scrollbar">
        {[
          { id: 'pets', label: 'Pets', icon: Heart },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'health', label: 'Health', icon: Activity },
          { id: 'expenses', label: 'Expenses', icon: DollarSign },
          { id: 'reminders', label: 'Reminders', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pets Tab */}
      {activeTab === 'pets' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowPetForm(!showPetForm)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Pet
          </button>

          {showPetForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Pet name"
                value={newPet.name || ''}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newPet.type}
                onChange={(e) => setNewPet({ ...newPet, type: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="reptile">Reptile</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Breed (optional)"
                value={newPet.breed || ''}
                onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Birthday</label>
                  <input
                    type="date"
                    value={newPet.birthday || ''}
                    onChange={(e) => setNewPet({ ...newPet, birthday: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Adoption Date</label>
                  <input
                    type="date"
                    value={newPet.adoptionDate || ''}
                    onChange={(e) => setNewPet({ ...newPet, adoptionDate: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Weight (lbs)"
                  value={newPet.weight || ''}
                  onChange={(e) => setNewPet({ ...newPet, weight: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <select
                  value={newPet.gender}
                  onChange={(e) => setNewPet({ ...newPet, gender: e.target.value as any })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Microchip ID (optional)"
                value={newPet.microchipId || ''}
                onChange={(e) => setNewPet({ ...newPet, microchipId: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Special needs (optional)"
                value={newPet.specialNeeds || ''}
                onChange={(e) => setNewPet({ ...newPet, specialNeeds: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <textarea
                placeholder="Notes (optional)"
                value={newPet.notes || ''}
                onChange={(e) => setNewPet({ ...newPet, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={savePet}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingPet ? 'Update' : 'Save'} Pet
                </button>
                <button
                  onClick={() => {
                    setShowPetForm(false);
                    setEditingPet(null);
                    setNewPet({ type: 'dog', gender: 'unknown', allergies: [], medications: [] });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {pets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No pets added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pets.map(pet => (
                <div key={pet.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{getPetIcon(pet.type)}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{pet.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">{pet.type} {pet.breed && `• ${pet.breed}`}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingPet(pet.id);
                          setNewPet(pet);
                          setShowPetForm(true);
                        }}
                        className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePet(pet.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                    {pet.birthday && (
                      <div>
                        <span className="text-gray-400">Age:</span>
                        <span className="ml-2 text-white">{getAge(pet.birthday)}</span>
                      </div>
                    )}
                    {pet.weight > 0 && (
                      <div>
                        <span className="text-gray-400">Weight:</span>
                        <span className="ml-2 text-white">{pet.weight} lbs</span>
                      </div>
                    )}
                    {pet.gender !== 'unknown' && (
                      <div>
                        <span className="text-gray-400">Gender:</span>
                        <span className="ml-2 text-white capitalize">{pet.gender}</span>
                      </div>
                    )}
                    {pet.microchipId && (
                      <div>
                        <span className="text-gray-400">Microchip:</span>
                        <span className="ml-2 text-white">{pet.microchipId}</span>
                      </div>
                    )}
                  </div>
                  {pet.specialNeeds && (
                    <div className="bg-orange-900/30 text-orange-400 px-3 py-2 rounded text-sm mb-2">
                      <strong>Special Needs:</strong> {pet.specialNeeds}
                    </div>
                  )}
                  {pet.notes && (
                    <p className="text-sm text-gray-400 mt-2">{pet.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="px-6 space-y-4">
          {pets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Add a pet first to schedule appointments</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setNewAppointment({ ...newAppointment, petId: selectedPet || pets[0].id });
                  setShowAppointmentForm(!showAppointmentForm);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Schedule Appointment
              </button>

              {showAppointmentForm && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
                  <select
                    value={newAppointment.petId || ''}
                    onChange={(e) => setNewAppointment({ ...newAppointment, petId: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={newAppointment.date || ''}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      type="time"
                      value={newAppointment.time || ''}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as any })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="checkup">Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="emergency">Emergency</option>
                    <option value="surgery">Surgery</option>
                    <option value="dental">Dental</option>
                    <option value="grooming">Grooming</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Vet clinic"
                    value={newAppointment.vetClinic || ''}
                    onChange={(e) => setNewAppointment({ ...newAppointment, vetClinic: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Vet name (optional)"
                    value={newAppointment.vetName || ''}
                    onChange={(e) => setNewAppointment({ ...newAppointment, vetName: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Reason for visit"
                    value={newAppointment.reason || ''}
                    onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Cost (optional)"
                    step="0.01"
                    value={newAppointment.cost || ''}
                    onChange={(e) => setNewAppointment({ ...newAppointment, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <textarea
                    placeholder="Notes (optional)"
                    value={newAppointment.notes || ''}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveAppointment}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {editingAppointment ? 'Update' : 'Schedule'} Appointment
                    </button>
                    <button
                      onClick={() => {
                        setShowAppointmentForm(false);
                        setEditingAppointment(null);
                        setNewAppointment({ type: 'checkup', status: 'scheduled' });
                      }}
                      className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map(apt => {
                    const pet = pets.find(p => p.id === apt.petId);
                    const isPast = new Date(apt.date) < new Date();

                    return (
                      <div key={apt.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{pet?.name || 'Unknown Pet'}</h3>
                            <p className="text-sm text-gray-400 capitalize">{apt.type}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingAppointment(apt.id);
                                setNewAppointment(apt);
                                setShowAppointmentForm(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteAppointment(apt.id)}
                              className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {apt.date} at {apt.time}
                          </div>
                          {apt.vetClinic && (
                            <div className="text-gray-400">📍 {apt.vetClinic}</div>
                          )}
                          {apt.reason && (
                            <div className="text-gray-400">Reason: {apt.reason}</div>
                          )}
                          {apt.cost > 0 && (
                            <div className="text-green-400">${apt.cost.toFixed(2)}</div>
                          )}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                          apt.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                          apt.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                          isPast ? 'bg-orange-900/30 text-orange-400' :
                          'bg-blue-900/30 text-blue-400'
                        }`}>
                          {apt.status === 'completed' ? 'Completed' :
                           apt.status === 'cancelled' ? 'Cancelled' :
                           isPast ? 'Past' : 'Upcoming'}
                        </div>
                        {apt.notes && (
                          <p className="text-sm text-gray-400 mt-2">{apt.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Health Records Tab */}
      {activeTab === 'health' && (
        <div className="px-6 space-y-4">
          {pets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Add a pet first to track health records</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setNewHealthRecord({ ...newHealthRecord, petId: selectedPet || pets[0].id, date: new Date().toISOString().split('T')[0] });
                  setShowHealthForm(!showHealthForm);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Health Record
              </button>

              {showHealthForm && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
                  <select
                    value={newHealthRecord.petId || ''}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, petId: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newHealthRecord.date || ''}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <select
                    value={newHealthRecord.type}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, type: e.target.value as any })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="weight">Weight</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="medication">Medication</option>
                    <option value="symptom">Symptom</option>
                    <option value="behavior">Behavior</option>
                    <option value="diet">Diet</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newHealthRecord.title || ''}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  {newHealthRecord.type === 'weight' && (
                    <input
                      type="number"
                      placeholder="Weight (lbs)"
                      step="0.1"
                      value={newHealthRecord.value || ''}
                      onChange={(e) => setNewHealthRecord({ ...newHealthRecord, value: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  )}
                  <textarea
                    placeholder="Description"
                    value={newHealthRecord.description || ''}
                    onChange={(e) => setNewHealthRecord({ ...newHealthRecord, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveHealthRecord}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Save Record
                    </button>
                    <button
                      onClick={() => {
                        setShowHealthForm(false);
                        setNewHealthRecord({ type: 'weight', attachments: [] });
                      }}
                      className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {healthRecords.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No health records yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {healthRecords.map(record => {
                    const pet = pets.find(p => p.id === record.petId);

                    return (
                      <div key={record.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{record.title}</h3>
                            <p className="text-sm text-gray-400">{pet?.name || 'Unknown Pet'} • {record.date}</p>
                          </div>
                          <button
                            onClick={() => deleteHealthRecord(record.id)}
                            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className={`inline-block px-2 py-1 rounded text-xs mb-2 capitalize ${
                          record.type === 'weight' ? 'bg-blue-900/30 text-blue-400' :
                          record.type === 'vaccination' ? 'bg-green-900/30 text-green-400' :
                          record.type === 'symptom' ? 'bg-red-900/30 text-red-400' :
                          'bg-purple-900/30 text-purple-400'
                        }`}>
                          {record.type}
                        </div>
                        {record.value !== undefined && (
                          <div className="text-lg font-bold text-blue-400 mb-1">
                            {record.value} lbs
                          </div>
                        )}
                        {record.description && (
                          <p className="text-sm text-gray-400">{record.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="px-6 space-y-4">
          {pets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Add a pet first to track expenses</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setNewExpense({ ...newExpense, petId: selectedPet || pets[0].id, date: new Date().toISOString().split('T')[0] });
                  setShowExpenseForm(!showExpenseForm);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Log Expense
              </button>

              {showExpenseForm && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
                  <select
                    value={newExpense.petId || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, petId: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newExpense.date || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="food">Food</option>
                    <option value="medical">Medical</option>
                    <option value="grooming">Grooming</option>
                    <option value="supplies">Supplies</option>
                    <option value="toys">Toys</option>
                    <option value="boarding">Boarding</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    step="0.01"
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newExpense.description || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Vendor (optional)"
                    value={newExpense.vendor || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveExpense}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Save Expense
                    </button>
                    <button
                      onClick={() => {
                        setShowExpenseForm(false);
                        setNewExpense({ category: 'food' });
                      }}
                      className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {expenses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No expenses logged yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map(expense => {
                    const pet = pets.find(p => p.id === expense.petId);

                    return (
                      <div key={expense.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">${expense.amount.toFixed(2)}</h3>
                            <p className="text-sm text-gray-400">{pet?.name || 'Unknown Pet'} • {expense.date}</p>
                          </div>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className={`inline-block px-2 py-1 rounded text-xs mb-2 capitalize ${
                          expense.category === 'medical' ? 'bg-red-900/30 text-red-400' :
                          expense.category === 'food' ? 'bg-green-900/30 text-green-400' :
                          'bg-blue-900/30 text-blue-400'
                        }`}>
                          {expense.category}
                        </div>
                        {expense.description && (
                          <p className="text-sm text-gray-400">{expense.description}</p>
                        )}
                        {expense.vendor && (
                          <p className="text-xs text-gray-500 mt-1">Vendor: {expense.vendor}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="px-6 space-y-4">
          {pets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Add a pet first to set reminders</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setNewReminder({ ...newReminder, petId: selectedPet || pets[0].id });
                  setShowReminderForm(!showReminderForm);
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Reminder
              </button>

              {showReminderForm && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
                  <select
                    value={newReminder.petId || ''}
                    onChange={(e) => setNewReminder({ ...newReminder, petId: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Reminder title"
                    value={newReminder.title || ''}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="vaccination">Vaccination</option>
                    <option value="medication">Medication</option>
                    <option value="grooming">Grooming</option>
                    <option value="checkup">Checkup</option>
                    <option value="flea-tick">Flea/Tick</option>
                    <option value="deworming">Deworming</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="date"
                    value={newReminder.dueDate || ''}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newReminder.recurring || false}
                      onChange={(e) => setNewReminder({ ...newReminder, recurring: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Recurring reminder</span>
                  </label>
                  {newReminder.recurring && (
                    <select
                      value={newReminder.frequency || 'monthly'}
                      onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value as any })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  )}
                  <textarea
                    placeholder="Notes (optional)"
                    value={newReminder.notes || ''}
                    onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveReminder}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {editingReminder ? 'Update' : 'Save'} Reminder
                    </button>
                    <button
                      onClick={() => {
                        setShowReminderForm(false);
                        setEditingReminder(null);
                        setNewReminder({ type: 'vaccination', recurring: false, completed: false });
                      }}
                      className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {reminders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No reminders set</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map(reminder => {
                    const pet = pets.find(p => p.id === reminder.petId);
                    const isOverdue = new Date(reminder.dueDate) < new Date() && !reminder.completed;

                    return (
                      <div key={reminder.id} className={`bg-gray-900 p-4 rounded-lg border ${isOverdue ? 'border-red-500/50' : 'border-gray-700'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={reminder.completed}
                              onChange={() => toggleReminderComplete(reminder.id)}
                              className="mt-1 rounded"
                            />
                            <div className="flex-1">
                              <h3 className={`font-semibold ${reminder.completed ? 'line-through text-gray-500' : ''}`}>
                                {reminder.title}
                              </h3>
                              <p className="text-sm text-gray-400">{pet?.name || 'Unknown Pet'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingReminder(reminder.id);
                                setNewReminder(reminder);
                                setShowReminderForm(true);
                              }}
                              className="p-2 text-orange-400 hover:bg-orange-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="ml-7">
                          <div className={`text-sm mb-1 ${isOverdue ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                            Due: {reminder.dueDate}
                            {isOverdue && <span className="ml-2">(Overdue!)</span>}
                          </div>
                          <div className={`inline-block px-2 py-1 rounded text-xs capitalize ${
                            reminder.type === 'vaccination' ? 'bg-green-900/30 text-green-400' :
                            reminder.type === 'medication' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-purple-900/30 text-purple-400'
                          }`}>
                            {reminder.type}
                          </div>
                          {reminder.recurring && (
                            <span className="ml-2 text-xs text-gray-500">
                              Recurring {reminder.frequency}
                            </span>
                          )}
                          {reminder.notes && (
                            <p className="text-sm text-gray-400 mt-2">{reminder.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PetCareHubPage;
