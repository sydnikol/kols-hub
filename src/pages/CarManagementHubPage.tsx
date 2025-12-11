import React, { useState, useEffect } from 'react';
import { Car, Wrench, Fuel, Calendar, DollarSign, MapPin, AlertTriangle, Plus, Edit2, Trash2, FileText, Shield, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  color: string;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'other';
  purchaseDate?: string;
  purchasePrice?: number;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  notes: string;
  photo?: string;
  createdAt: number;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: 'oil-change' | 'tire-rotation' | 'brake-service' | 'transmission' | 'battery' | 'filter' | 'inspection' | 'repair' | 'other';
  description: string;
  mileage: number;
  cost: number;
  provider: string;
  notes: string;
  nextServiceMileage?: number;
  nextServiceDate?: string;
  createdAt: number;
}

interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  mileage: number;
  station: string;
  fuelGrade: 'regular' | 'mid-grade' | 'premium' | 'diesel' | 'electric';
  fullTank: boolean;
  notes: string;
  createdAt: number;
}

interface Expense {
  id: string;
  vehicleId: string;
  date: string;
  category: 'maintenance' | 'fuel' | 'insurance' | 'registration' | 'parking' | 'tolls' | 'wash' | 'accessories' | 'tickets' | 'other';
  description: string;
  amount: number;
  vendor?: string;
  receipt?: string;
  notes: string;
  createdAt: number;
}

interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  type: 'oil-change' | 'tire-rotation' | 'inspection' | 'registration' | 'insurance' | 'smog' | 'brake' | 'other';
  dueDate?: string;
  dueMileage?: number;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'miles';
  frequencyMiles?: number;
  completed: boolean;
  notes: string;
  createdAt: number;
}

interface Trip {
  id: string;
  vehicleId: string;
  date: string;
  purpose: 'business' | 'personal' | 'medical' | 'charity' | 'commute' | 'other';
  startLocation: string;
  endLocation: string;
  startMileage: number;
  endMileage: number;
  distance: number;
  notes: string;
  createdAt: number;
}

const CarManagementHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'maintenance' | 'fuel' | 'expenses' | 'reminders' | 'trips'>('vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // State for each section
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  // Form states
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({ fuelType: 'gasoline', year: new Date().getFullYear() });
  const [newMaintenance, setNewMaintenance] = useState<Partial<MaintenanceRecord>>({ type: 'oil-change' });
  const [newFuel, setNewFuel] = useState<Partial<FuelLog>>({ fuelGrade: 'regular', fullTank: true });
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({ category: 'maintenance' });
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({ type: 'oil-change', recurring: false, completed: false });
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({ purpose: 'personal' });

  // Load data
  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    const savedMaintenance = localStorage.getItem('vehicleMaintenance');
    const savedFuel = localStorage.getItem('fuelLogs');
    const savedExpenses = localStorage.getItem('vehicleExpenses');
    const savedReminders = localStorage.getItem('vehicleReminders');
    const savedTrips = localStorage.getItem('vehicleTrips');

    if (savedVehicles) {
      const loaded = JSON.parse(savedVehicles);
      setVehicles(loaded);
      if (loaded.length > 0) setSelectedVehicle(loaded[0].id);
    }
    if (savedMaintenance) setMaintenance(JSON.parse(savedMaintenance));
    if (savedFuel) setFuelLogs(JSON.parse(savedFuel));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedTrips) setTrips(JSON.parse(savedTrips));
  }, []);

  // Save data
  useEffect(() => { localStorage.setItem('vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('vehicleMaintenance', JSON.stringify(maintenance)); }, [maintenance]);
  useEffect(() => { localStorage.setItem('fuelLogs', JSON.stringify(fuelLogs)); }, [fuelLogs]);
  useEffect(() => { localStorage.setItem('vehicleExpenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('vehicleReminders', JSON.stringify(reminders)); }, [reminders]);
  useEffect(() => { localStorage.setItem('vehicleTrips', JSON.stringify(trips)); }, [trips]);

  // Vehicle functions
  const saveVehicle = () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle ? { ...v, ...newVehicle } as Vehicle : v));
      toast.success('Vehicle updated!');
    } else {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        make: newVehicle.make!,
        model: newVehicle.model!,
        year: newVehicle.year!,
        vin: newVehicle.vin || '',
        licensePlate: newVehicle.licensePlate || '',
        color: newVehicle.color || '',
        mileage: newVehicle.mileage || 0,
        fuelType: newVehicle.fuelType || 'gasoline',
        purchaseDate: newVehicle.purchaseDate,
        purchasePrice: newVehicle.purchasePrice,
        insuranceProvider: newVehicle.insuranceProvider,
        insurancePolicyNumber: newVehicle.insurancePolicyNumber,
        insuranceExpiry: newVehicle.insuranceExpiry,
        registrationExpiry: newVehicle.registrationExpiry,
        notes: newVehicle.notes || '',
        createdAt: Date.now()
      };
      setVehicles([vehicle, ...vehicles]);
      setSelectedVehicle(vehicle.id);
      toast.success('Vehicle added!');
    }

    setNewVehicle({ fuelType: 'gasoline', year: new Date().getFullYear() });
    setShowVehicleForm(false);
    setEditingVehicle(null);
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    if (selectedVehicle === id) setSelectedVehicle(vehicles[0]?.id || null);
    toast.success('Vehicle removed');
  };

  // Maintenance functions
  const saveMaintenance = () => {
    if (!newMaintenance.vehicleId || !newMaintenance.date || !newMaintenance.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const record: MaintenanceRecord = {
      id: Date.now().toString(),
      vehicleId: newMaintenance.vehicleId!,
      date: newMaintenance.date!,
      type: newMaintenance.type || 'other',
      description: newMaintenance.description!,
      mileage: newMaintenance.mileage || 0,
      cost: newMaintenance.cost || 0,
      provider: newMaintenance.provider || '',
      notes: newMaintenance.notes || '',
      nextServiceMileage: newMaintenance.nextServiceMileage,
      nextServiceDate: newMaintenance.nextServiceDate,
      createdAt: Date.now()
    };
    setMaintenance([record, ...maintenance]);

    // Update vehicle mileage
    if (newMaintenance.mileage) {
      setVehicles(vehicles.map(v => v.id === newMaintenance.vehicleId ? { ...v, mileage: Math.max(v.mileage, newMaintenance.mileage!) } : v));
    }

    toast.success('Maintenance record added!');
    setNewMaintenance({ type: 'oil-change' });
    setShowMaintenanceForm(false);
  };

  const deleteMaintenance = (id: string) => {
    setMaintenance(maintenance.filter(m => m.id !== id));
    toast.success('Record deleted');
  };

  // Fuel functions
  const saveFuel = () => {
    if (!newFuel.vehicleId || !newFuel.date || !newFuel.gallons) {
      toast.error('Please fill in required fields');
      return;
    }

    const log: FuelLog = {
      id: Date.now().toString(),
      vehicleId: newFuel.vehicleId!,
      date: newFuel.date!,
      gallons: newFuel.gallons!,
      pricePerGallon: newFuel.pricePerGallon || 0,
      totalCost: newFuel.totalCost || (newFuel.gallons! * (newFuel.pricePerGallon || 0)),
      mileage: newFuel.mileage || 0,
      station: newFuel.station || '',
      fuelGrade: newFuel.fuelGrade || 'regular',
      fullTank: newFuel.fullTank ?? true,
      notes: newFuel.notes || '',
      createdAt: Date.now()
    };
    setFuelLogs([log, ...fuelLogs]);

    // Update vehicle mileage
    if (newFuel.mileage) {
      setVehicles(vehicles.map(v => v.id === newFuel.vehicleId ? { ...v, mileage: Math.max(v.mileage, newFuel.mileage!) } : v));
    }

    toast.success('Fuel log added!');
    setNewFuel({ fuelGrade: 'regular', fullTank: true });
    setShowFuelForm(false);
  };

  const deleteFuel = (id: string) => {
    setFuelLogs(fuelLogs.filter(f => f.id !== id));
    toast.success('Fuel log deleted');
  };

  // Expense functions
  const saveExpense = () => {
    if (!newExpense.vehicleId || !newExpense.date || !newExpense.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      vehicleId: newExpense.vehicleId!,
      date: newExpense.date!,
      category: newExpense.category || 'other',
      description: newExpense.description || '',
      amount: newExpense.amount!,
      vendor: newExpense.vendor,
      notes: newExpense.notes || '',
      createdAt: Date.now()
    };
    setExpenses([expense, ...expenses]);
    toast.success('Expense logged!');
    setNewExpense({ category: 'maintenance' });
    setShowExpenseForm(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('Expense deleted');
  };

  // Reminder functions
  const saveReminder = () => {
    if (!newReminder.vehicleId || !newReminder.title) {
      toast.error('Please fill in required fields');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      vehicleId: newReminder.vehicleId!,
      title: newReminder.title!,
      type: newReminder.type || 'other',
      dueDate: newReminder.dueDate,
      dueMileage: newReminder.dueMileage,
      recurring: newReminder.recurring || false,
      frequency: newReminder.frequency,
      frequencyMiles: newReminder.frequencyMiles,
      completed: false,
      notes: newReminder.notes || '',
      createdAt: Date.now()
    };
    setReminders([reminder, ...reminders]);
    toast.success('Reminder created!');
    setNewReminder({ type: 'oil-change', recurring: false, completed: false });
    setShowReminderForm(false);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast.success('Reminder deleted');
  };

  // Trip functions
  const saveTrip = () => {
    if (!newTrip.vehicleId || !newTrip.date || !newTrip.startMileage || !newTrip.endMileage) {
      toast.error('Please fill in required fields');
      return;
    }

    const trip: Trip = {
      id: Date.now().toString(),
      vehicleId: newTrip.vehicleId!,
      date: newTrip.date!,
      purpose: newTrip.purpose || 'personal',
      startLocation: newTrip.startLocation || '',
      endLocation: newTrip.endLocation || '',
      startMileage: newTrip.startMileage!,
      endMileage: newTrip.endMileage!,
      distance: newTrip.endMileage! - newTrip.startMileage!,
      notes: newTrip.notes || '',
      createdAt: Date.now()
    };
    setTrips([trip, ...trips]);

    // Update vehicle mileage
    setVehicles(vehicles.map(v => v.id === newTrip.vehicleId ? { ...v, mileage: Math.max(v.mileage, newTrip.endMileage!) } : v));

    toast.success('Trip logged!');
    setNewTrip({ purpose: 'personal' });
    setShowTripForm(false);
  };

  const deleteTrip = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
    toast.success('Trip deleted');
  };

  // Stats
  const currentVehicle = vehicles.find(v => v.id === selectedVehicle);
  const vehicleMaintenance = maintenance.filter(m => m.vehicleId === selectedVehicle);
  const vehicleFuel = fuelLogs.filter(f => f.vehicleId === selectedVehicle);
  const vehicleExpenses = expenses.filter(e => e.vehicleId === selectedVehicle);
  const vehicleReminders = reminders.filter(r => r.vehicleId === selectedVehicle && !r.completed);
  const vehicleTrips = trips.filter(t => t.vehicleId === selectedVehicle);

  const totalFuelCost = vehicleFuel.reduce((sum, f) => sum + f.totalCost, 0);
  const totalMaintenanceCost = vehicleMaintenance.reduce((sum, m) => sum + m.cost, 0);
  const totalExpenses = vehicleExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMiles = vehicleTrips.reduce((sum, t) => sum + t.distance, 0);

  // Calculate MPG
  const calculateMPG = () => {
    const fullTankLogs = vehicleFuel.filter(f => f.fullTank).sort((a, b) => a.mileage - b.mileage);
    if (fullTankLogs.length < 2) return 0;
    let totalMiles = 0;
    let totalGallons = 0;
    for (let i = 1; i < fullTankLogs.length; i++) {
      totalMiles += fullTankLogs[i].mileage - fullTankLogs[i - 1].mileage;
      totalGallons += fullTankLogs[i].gallons;
    }
    return totalGallons > 0 ? (totalMiles / totalGallons).toFixed(1) : 0;
  };

  const overdueReminders = vehicleReminders.filter(r => {
    if (r.dueDate && new Date(r.dueDate) < new Date()) return true;
    if (r.dueMileage && currentVehicle && currentVehicle.mileage >= r.dueMileage) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Car className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Car Management Hub</h1>
        </div>
        <p className="text-blue-200 text-sm">Track maintenance, fuel, expenses & trips</p>

        {currentVehicle && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <Fuel className="w-5 h-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{calculateMPG()}</div>
              <div className="text-xs opacity-80">Avg MPG</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <DollarSign className="w-5 h-5 mx-auto mb-1" />
              <div className="text-lg font-bold">${(totalFuelCost + totalMaintenanceCost).toFixed(0)}</div>
              <div className="text-xs opacity-80">Total Cost</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <MapPin className="w-5 h-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{currentVehicle.mileage.toLocaleString()}</div>
              <div className="text-xs opacity-80">Miles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{overdueReminders.length}</div>
              <div className="text-xs opacity-80">Due</div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Selector */}
      {vehicles.length > 0 && (
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {vehicles.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedVehicle === v.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {v.year} {v.make} {v.model}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-slate-800/50 shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'vehicles', label: 'Vehicles', icon: Car },
            { id: 'maintenance', label: 'Service', icon: Wrench },
            { id: 'fuel', label: 'Fuel', icon: Fuel },
            { id: 'expenses', label: 'Expenses', icon: DollarSign },
            { id: 'reminders', label: 'Reminders', icon: Clock },
            { id: 'trips', label: 'Trips', icon: MapPin },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/30'
                  : 'text-gray-400 hover:text-blue-300 hover:bg-slate-700/50'
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
        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowVehicleForm(!showVehicleForm)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Vehicle</span>
            </button>

            {showVehicleForm && (
              <div className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-700">
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Year"
                    value={newVehicle.year || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Make"
                    value={newVehicle.make || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={newVehicle.model || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Color"
                    value={newVehicle.color || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value as any })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Current Mileage"
                    value={newVehicle.mileage || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="License Plate"
                    value={newVehicle.licensePlate || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="VIN (optional)"
                  value={newVehicle.vin || ''}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={newVehicle.purchaseDate || ''}
                      onChange={(e) => setNewVehicle({ ...newVehicle, purchaseDate: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Purchase Price</label>
                    <input
                      type="number"
                      placeholder="$"
                      value={newVehicle.purchasePrice || ''}
                      onChange={(e) => setNewVehicle({ ...newVehicle, purchasePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-300 mt-2">Insurance & Registration</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Insurance Provider"
                    value={newVehicle.insuranceProvider || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, insuranceProvider: e.target.value })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Policy Number"
                    value={newVehicle.insurancePolicyNumber || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, insurancePolicyNumber: e.target.value })}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Insurance Expiry</label>
                    <input
                      type="date"
                      value={newVehicle.insuranceExpiry || ''}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExpiry: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Registration Expiry</label>
                    <input
                      type="date"
                      value={newVehicle.registrationExpiry || ''}
                      onChange={(e) => setNewVehicle({ ...newVehicle, registrationExpiry: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Notes"
                  value={newVehicle.notes || ''}
                  onChange={(e) => setNewVehicle({ ...newVehicle, notes: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-20"
                />
                <div className="flex gap-2">
                  <button onClick={saveVehicle} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                    {editingVehicle ? 'Update' : 'Save'} Vehicle
                  </button>
                  <button
                    onClick={() => { setShowVehicleForm(false); setEditingVehicle(null); setNewVehicle({ fuelType: 'gasoline', year: new Date().getFullYear() }); }}
                    className="px-4 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No vehicles added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-gray-400">{vehicle.color} {vehicle.licensePlate && `• ${vehicle.licensePlate}`}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingVehicle(vehicle.id); setNewVehicle(vehicle); setShowVehicleForm(true); }}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVehicle(vehicle.id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{vehicle.mileage.toLocaleString()} miles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{vehicle.fuelType}</span>
                      </div>
                      {vehicle.insuranceExpiry && (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span>Ins: {vehicle.insuranceExpiry}</span>
                        </div>
                      )}
                      {vehicle.registrationExpiry && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>Reg: {vehicle.registrationExpiry}</span>
                        </div>
                      )}
                    </div>
                    {vehicle.notes && <p className="text-sm text-gray-400 mt-2">{vehicle.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Add a vehicle first</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setNewMaintenance({ ...newMaintenance, vehicleId: selectedVehicle || vehicles[0].id, date: new Date().toISOString().split('T')[0] }); setShowMaintenanceForm(!showMaintenanceForm); }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Log Maintenance</span>
                </button>

                {showMaintenanceForm && (
                  <div className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-700">
                    <select
                      value={newMaintenance.vehicleId || ''}
                      onChange={(e) => setNewMaintenance({ ...newMaintenance, vehicleId: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={newMaintenance.date || ''}
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, date: e.target.value })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <select
                        value={newMaintenance.type}
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, type: e.target.value as any })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="oil-change">Oil Change</option>
                        <option value="tire-rotation">Tire Rotation</option>
                        <option value="brake-service">Brake Service</option>
                        <option value="transmission">Transmission</option>
                        <option value="battery">Battery</option>
                        <option value="filter">Filter</option>
                        <option value="inspection">Inspection</option>
                        <option value="repair">Repair</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Description"
                      value={newMaintenance.description || ''}
                      onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Mileage"
                        value={newMaintenance.mileage || ''}
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, mileage: parseInt(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="number"
                        placeholder="Cost ($)"
                        step="0.01"
                        value={newMaintenance.cost || ''}
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: parseFloat(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Service Provider"
                      value={newMaintenance.provider || ''}
                      onChange={(e) => setNewMaintenance({ ...newMaintenance, provider: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Next Service Date</label>
                        <input
                          type="date"
                          value={newMaintenance.nextServiceDate || ''}
                          onChange={(e) => setNewMaintenance({ ...newMaintenance, nextServiceDate: e.target.value })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Next Service Miles</label>
                        <input
                          type="number"
                          placeholder="Mileage"
                          value={newMaintenance.nextServiceMileage || ''}
                          onChange={(e) => setNewMaintenance({ ...newMaintenance, nextServiceMileage: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Notes"
                      value={newMaintenance.notes || ''}
                      onChange={(e) => setNewMaintenance({ ...newMaintenance, notes: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-20"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveMaintenance} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                        Save Record
                      </button>
                      <button
                        onClick={() => { setShowMaintenanceForm(false); setNewMaintenance({ type: 'oil-change' }); }}
                        className="px-4 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {vehicleMaintenance.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No maintenance records</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vehicleMaintenance.map(record => (
                      <div key={record.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold capitalize">{record.type.replace('-', ' ')}</h3>
                            <p className="text-sm text-gray-400">{record.date} {record.mileage > 0 && `• ${record.mileage.toLocaleString()} mi`}</p>
                          </div>
                          <button onClick={() => deleteMaintenance(record.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{record.description}</p>
                        {record.cost > 0 && <div className="text-green-400 font-semibold">${record.cost.toFixed(2)}</div>}
                        {record.provider && <p className="text-xs text-gray-500">Provider: {record.provider}</p>}
                        {record.nextServiceDate && (
                          <div className="text-xs text-blue-400 mt-1">Next service: {record.nextServiceDate}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Fuel Tab */}
        {activeTab === 'fuel' && (
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Add a vehicle first</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setNewFuel({ ...newFuel, vehicleId: selectedVehicle || vehicles[0].id, date: new Date().toISOString().split('T')[0] }); setShowFuelForm(!showFuelForm); }}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Log Fuel</span>
                </button>

                {showFuelForm && (
                  <div className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-700">
                    <select
                      value={newFuel.vehicleId || ''}
                      onChange={(e) => setNewFuel({ ...newFuel, vehicleId: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={newFuel.date || ''}
                      onChange={(e) => setNewFuel({ ...newFuel, date: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Gallons"
                        step="0.001"
                        value={newFuel.gallons || ''}
                        onChange={(e) => setNewFuel({ ...newFuel, gallons: parseFloat(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="number"
                        placeholder="Price/Gallon"
                        step="0.01"
                        value={newFuel.pricePerGallon || ''}
                        onChange={(e) => setNewFuel({ ...newFuel, pricePerGallon: parseFloat(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Total Cost"
                        step="0.01"
                        value={newFuel.totalCost || ''}
                        onChange={(e) => setNewFuel({ ...newFuel, totalCost: parseFloat(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="number"
                        placeholder="Odometer"
                        value={newFuel.mileage || ''}
                        onChange={(e) => setNewFuel({ ...newFuel, mileage: parseInt(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={newFuel.fuelGrade}
                        onChange={(e) => setNewFuel({ ...newFuel, fuelGrade: e.target.value as any })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="regular">Regular</option>
                        <option value="mid-grade">Mid-Grade</option>
                        <option value="premium">Premium</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Station"
                        value={newFuel.station || ''}
                        onChange={(e) => setNewFuel({ ...newFuel, station: e.target.value })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newFuel.fullTank ?? true}
                        onChange={(e) => setNewFuel({ ...newFuel, fullTank: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-300">Full tank (for MPG calculation)</span>
                    </label>
                    <div className="flex gap-2">
                      <button onClick={saveFuel} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors">
                        Save Fuel Log
                      </button>
                      <button
                        onClick={() => { setShowFuelForm(false); setNewFuel({ fuelGrade: 'regular', fullTank: true }); }}
                        className="px-4 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Fuel Stats */}
                {vehicleFuel.length > 0 && (
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-semibold mb-3 text-amber-400">Fuel Statistics</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Total Spent:</span>
                        <span className="ml-2 font-semibold">${totalFuelCost.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg MPG:</span>
                        <span className="ml-2 font-semibold">{calculateMPG()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Fill-ups:</span>
                        <span className="ml-2 font-semibold">{vehicleFuel.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Cost:</span>
                        <span className="ml-2 font-semibold">${(totalFuelCost / vehicleFuel.length).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {vehicleFuel.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Fuel className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No fuel logs</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vehicleFuel.map(log => (
                      <div key={log.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">${log.totalCost.toFixed(2)}</h3>
                            <p className="text-sm text-gray-400">{log.date} {log.mileage > 0 && `• ${log.mileage.toLocaleString()} mi`}</p>
                          </div>
                          <button onClick={() => deleteFuel(log.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-300">
                          {log.gallons.toFixed(3)} gal @ ${log.pricePerGallon.toFixed(2)}/gal
                          <span className="ml-2 capitalize text-amber-400">{log.fuelGrade}</span>
                        </div>
                        {log.station && <p className="text-xs text-gray-500 mt-1">{log.station}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Add a vehicle first</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setNewExpense({ ...newExpense, vehicleId: selectedVehicle || vehicles[0].id, date: new Date().toISOString().split('T')[0] }); setShowExpenseForm(!showExpenseForm); }}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Log Expense</span>
                </button>

                {showExpenseForm && (
                  <div className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-700">
                    <select
                      value={newExpense.vehicleId || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, vehicleId: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={newExpense.date || ''}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="maintenance">Maintenance</option>
                        <option value="fuel">Fuel</option>
                        <option value="insurance">Insurance</option>
                        <option value="registration">Registration</option>
                        <option value="parking">Parking</option>
                        <option value="tolls">Tolls</option>
                        <option value="wash">Car Wash</option>
                        <option value="accessories">Accessories</option>
                        <option value="tickets">Tickets</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      step="0.01"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newExpense.description || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Vendor (optional)"
                      value={newExpense.vendor || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveExpense} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                        Save Expense
                      </button>
                      <button
                        onClick={() => { setShowExpenseForm(false); setNewExpense({ category: 'maintenance' }); }}
                        className="px-4 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {vehicleExpenses.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No expenses logged</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vehicleExpenses.map(expense => (
                      <div key={expense.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">${expense.amount.toFixed(2)}</h3>
                            <p className="text-sm text-gray-400">{expense.date}</p>
                          </div>
                          <button onClick={() => deleteExpense(expense.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="inline-block px-2 py-1 rounded text-xs mb-2 capitalize bg-purple-900/30 text-purple-400">
                          {expense.category}
                        </div>
                        {expense.description && <p className="text-sm text-gray-300">{expense.description}</p>}
                        {expense.vendor && <p className="text-xs text-gray-500 mt-1">{expense.vendor}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Add a vehicle first</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setNewReminder({ ...newReminder, vehicleId: selectedVehicle || vehicles[0].id }); setShowReminderForm(!showReminderForm); }}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Reminder</span>
                </button>

                {showReminderForm && (
                  <div className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-700">
                    <select
                      value={newReminder.vehicleId || ''}
                      onChange={(e) => setNewReminder({ ...newReminder, vehicleId: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Reminder title"
                      value={newReminder.title || ''}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    />
                    <select
                      value={newReminder.type}
                      onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="oil-change">Oil Change</option>
                      <option value="tire-rotation">Tire Rotation</option>
                      <option value="inspection">Inspection</option>
                      <option value="registration">Registration</option>
                      <option value="insurance">Insurance</option>
                      <option value="smog">Smog Check</option>
                      <option value="brake">Brake Service</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                        <input
                          type="date"
                          value={newReminder.dueDate || ''}
                          onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Due Mileage</label>
                        <input
                          type="number"
                          placeholder="Miles"
                          value={newReminder.dueMileage || ''}
                          onChange={(e) => setNewReminder({ ...newReminder, dueMileage: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newReminder.recurring || false}
                        onChange={(e) => setNewReminder({ ...newReminder, recurring: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-300">Recurring reminder</span>
                    </label>
                    <textarea
                      placeholder="Notes"
                      value={newReminder.notes || ''}
                      onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-16"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveReminder} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors">
                        Save Reminder
                      </button>
                      <button
                        onClick={() => { setShowReminderForm(false); setNewReminder({ type: 'oil-change', recurring: false, completed: false }); }}
                        className="px-4 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {vehicleReminders.length === 0 && reminders.filter(r => r.vehicleId === selectedVehicle && r.completed).length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No reminders set</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reminders.filter(r => r.vehicleId === selectedVehicle).map(reminder => {
                      const isOverdue = (reminder.dueDate && new Date(reminder.dueDate) < new Date()) ||
                        (reminder.dueMileage && currentVehicle && currentVehicle.mileage >= reminder.dueMileage);

                      return (
                        <div key={reminder.id} className={`bg-slate-800 p-4 rounded-lg border ${isOverdue && !reminder.completed ? 'border-red-500/50' : 'border-slate-700'}`}>
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={reminder.completed}
                              onChange={() => toggleReminder(reminder.id)}
                              className="mt-1 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className={`font-semibold ${reminder.completed ? 'line-through text-gray-500' : ''}`}>
                                  {reminder.title}
                                </h3>
                                <button onClick={() => deleteReminder(reminder.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {reminder.dueDate && <span>Due: {reminder.dueDate}</span>}
                                {reminder.dueDate && reminder.dueMileage && <span> or </span>}
                                {reminder.dueMileage && <span>{reminder.dueMileage.toLocaleString()} mi</span>}
                              </div>
                              {isOverdue && !reminder.completed && (
                                <div className="text-red-400 text-sm font-semibold mt-1">Overdue!</div>
                              )}
                              <div className="inline-block px-2 py-1 rounded text-xs mt-2 capitalize bg-orange-900/30 text-orange-400">
                                {reminder.type.replace('-', ' ')}
                              </div>
                            </div>
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

        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Add a vehicle first</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setNewTrip({ ...newTrip, vehicleId: selectedVehicle || vehicles[0].id, date: new Date().toISOString().split('T')[0] }); setShowTripForm(!showTripForm); }}
                  className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Log Trip</span>
                </button>

                {showTripForm && (
                  <div className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-700">
                    <select
                      value={newTrip.vehicleId || ''}
                      onChange={(e) => setNewTrip({ ...newTrip, vehicleId: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={newTrip.date || ''}
                        onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <select
                        value={newTrip.purpose}
                        onChange={(e) => setNewTrip({ ...newTrip, purpose: e.target.value as any })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="personal">Personal</option>
                        <option value="business">Business</option>
                        <option value="medical">Medical</option>
                        <option value="charity">Charity</option>
                        <option value="commute">Commute</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Start Location"
                        value={newTrip.startLocation || ''}
                        onChange={(e) => setNewTrip({ ...newTrip, startLocation: e.target.value })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="text"
                        placeholder="End Location"
                        value={newTrip.endLocation || ''}
                        onChange={(e) => setNewTrip({ ...newTrip, endLocation: e.target.value })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Start Mileage"
                        value={newTrip.startMileage || ''}
                        onChange={(e) => setNewTrip({ ...newTrip, startMileage: parseInt(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="number"
                        placeholder="End Mileage"
                        value={newTrip.endMileage || ''}
                        onChange={(e) => setNewTrip({ ...newTrip, endMileage: parseInt(e.target.value) || 0 })}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <textarea
                      placeholder="Notes"
                      value={newTrip.notes || ''}
                      onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-16"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveTrip} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors">
                        Save Trip
                      </button>
                      <button
                        onClick={() => { setShowTripForm(false); setNewTrip({ purpose: 'personal' }); }}
                        className="px-4 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Trip Stats */}
                {vehicleTrips.length > 0 && (
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-semibold mb-3 text-cyan-400">Trip Statistics</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Total Miles:</span>
                        <span className="ml-2 font-semibold">{totalMiles.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Trips:</span>
                        <span className="ml-2 font-semibold">{vehicleTrips.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Business Miles:</span>
                        <span className="ml-2 font-semibold">
                          {vehicleTrips.filter(t => t.purpose === 'business').reduce((sum, t) => sum + t.distance, 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Medical Miles:</span>
                        <span className="ml-2 font-semibold">
                          {vehicleTrips.filter(t => t.purpose === 'medical').reduce((sum, t) => sum + t.distance, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {vehicleTrips.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No trips logged</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vehicleTrips.map(trip => (
                      <div key={trip.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{trip.distance.toLocaleString()} miles</h3>
                            <p className="text-sm text-gray-400">{trip.date}</p>
                          </div>
                          <button onClick={() => deleteTrip(trip.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="inline-block px-2 py-1 rounded text-xs mb-2 capitalize bg-cyan-900/30 text-cyan-400">
                          {trip.purpose}
                        </div>
                        <div className="text-sm text-gray-300">
                          {trip.startLocation && trip.endLocation ? (
                            <span>{trip.startLocation} → {trip.endLocation}</span>
                          ) : (
                            <span>{trip.startMileage.toLocaleString()} → {trip.endMileage.toLocaleString()} mi</span>
                          )}
                        </div>
                        {trip.notes && <p className="text-xs text-gray-500 mt-1">{trip.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarManagementHubPage;
