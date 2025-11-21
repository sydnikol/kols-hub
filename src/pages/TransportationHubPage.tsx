import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Bus, Bike, Car, Train, Users, DollarSign, Shield, Navigation, Clock, Calendar, Star, Plus, Edit2, Trash2, CheckCircle, AlertTriangle, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  mode: 'bus' | 'train' | 'bike' | 'walk' | 'rideshare' | 'drive';
  duration: number; // minutes
  cost: number;
  steps: string[];
  accessibility: boolean;
  notes: string;
  frequency: 'daily' | 'weekly' | 'occasional';
  starred: boolean;
  safetyRating: number; // 1-5
  lastUsed: string;
  createdAt: number;
}

interface TransitPass {
  id: string;
  name: string;
  type: 'monthly' | 'weekly' | 'daily' | 'stored-value';
  balance?: number;
  purchaseDate: string;
  expirationDate: string;
  autoReload: boolean;
  reloadAmount?: number;
  reloadThreshold?: number;
  cost: number;
  notes: string;
  createdAt: number;
}

interface Trip {
  id: string;
  date: string;
  routeId?: string;
  from: string;
  to: string;
  mode: 'bus' | 'train' | 'bike' | 'walk' | 'rideshare' | 'drive';
  cost: number;
  duration: number;
  safetyCheck: boolean;
  sharedWith: string[];
  notes: string;
  createdAt: number;
}

interface SafetyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  primary: boolean;
  createdAt: number;
}

interface BikeRoute {
  id: string;
  name: string;
  distance: number; // miles
  difficulty: 'easy' | 'moderate' | 'hard';
  terrain: string;
  bikePathPercent: number; // 0-100
  landmarks: string[];
  safety: number; // 1-5
  scenic: number; // 1-5
  notes: string;
  starred: boolean;
  createdAt: number;
}

const TransportationHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'routes' | 'passes' | 'trips' | 'safety' | 'bike'>('routes');

  // Routes Tab
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [newRoute, setNewRoute] = useState<Partial<Route>>({
    mode: 'bus',
    accessibility: false,
    starred: false,
    safetyRating: 3,
    frequency: 'occasional',
    steps: []
  });

  // Transit Passes Tab
  const [passes, setPasses] = useState<TransitPass[]>([]);
  const [showPassForm, setShowPassForm] = useState(false);
  const [editingPass, setEditingPass] = useState<string | null>(null);
  const [newPass, setNewPass] = useState<Partial<TransitPass>>({
    type: 'monthly',
    autoReload: false
  });

  // Trips Tab
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showTripForm, setShowTripForm] = useState(false);
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    mode: 'bus',
    safetyCheck: false,
    sharedWith: []
  });

  // Safety Tab
  const [safetyContacts, setSafetyContacts] = useState<SafetyContact[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<Partial<SafetyContact>>({
    primary: false
  });

  // Bike Routes Tab
  const [bikeRoutes, setBikeRoutes] = useState<BikeRoute[]>([]);
  const [showBikeForm, setShowBikeForm] = useState(false);
  const [editingBike, setEditingBike] = useState<string | null>(null);
  const [newBikeRoute, setNewBikeRoute] = useState<Partial<BikeRoute>>({
    difficulty: 'moderate',
    starred: false,
    landmarks: []
  });

  // Load data
  useEffect(() => {
    const savedRoutes = localStorage.getItem('transportRoutes');
    const savedPasses = localStorage.getItem('transitPasses');
    const savedTrips = localStorage.getItem('trips');
    const savedContacts = localStorage.getItem('safetyContacts');
    const savedBikeRoutes = localStorage.getItem('bikeRoutes');

    if (savedRoutes) setRoutes(JSON.parse(savedRoutes));
    if (savedPasses) setPasses(JSON.parse(savedPasses));
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedContacts) setSafetyContacts(JSON.parse(savedContacts));
    if (savedBikeRoutes) setBikeRoutes(JSON.parse(savedBikeRoutes));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('transportRoutes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('transitPasses', JSON.stringify(passes));
  }, [passes]);

  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('safetyContacts', JSON.stringify(safetyContacts));
  }, [safetyContacts]);

  useEffect(() => {
    localStorage.setItem('bikeRoutes', JSON.stringify(bikeRoutes));
  }, [bikeRoutes]);

  // Route functions
  const saveRoute = () => {
    if (!newRoute.name || !newRoute.from || !newRoute.to) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute ? { ...r, ...newRoute } as Route : r));
      toast.success('Route updated!');
    } else {
      const route: Route = {
        id: Date.now().toString(),
        name: newRoute.name!,
        from: newRoute.from!,
        to: newRoute.to!,
        mode: newRoute.mode || 'bus',
        duration: newRoute.duration || 0,
        cost: newRoute.cost || 0,
        steps: newRoute.steps || [],
        accessibility: newRoute.accessibility || false,
        notes: newRoute.notes || '',
        frequency: newRoute.frequency || 'occasional',
        starred: newRoute.starred || false,
        safetyRating: newRoute.safetyRating || 3,
        lastUsed: new Date().toISOString().split('T')[0],
        createdAt: Date.now()
      };
      setRoutes([route, ...routes]);
      toast.success('Route saved!');
    }

    setNewRoute({ mode: 'bus', accessibility: false, starred: false, safetyRating: 3, frequency: 'occasional', steps: [] });
    setShowRouteForm(false);
    setEditingRoute(null);
  };

  const deleteRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    toast.success('Route deleted');
  };

  const toggleStarRoute = (id: string) => {
    setRoutes(routes.map(r => r.id === id ? { ...r, starred: !r.starred } : r));
  };

  // Transit Pass functions
  const savePass = () => {
    if (!newPass.name || !newPass.expirationDate) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingPass) {
      setPasses(passes.map(p => p.id === editingPass ? { ...p, ...newPass } as TransitPass : p));
      toast.success('Pass updated!');
    } else {
      const pass: TransitPass = {
        id: Date.now().toString(),
        name: newPass.name!,
        type: newPass.type || 'monthly',
        balance: newPass.balance,
        purchaseDate: newPass.purchaseDate || new Date().toISOString().split('T')[0],
        expirationDate: newPass.expirationDate!,
        autoReload: newPass.autoReload || false,
        reloadAmount: newPass.reloadAmount,
        reloadThreshold: newPass.reloadThreshold,
        cost: newPass.cost || 0,
        notes: newPass.notes || '',
        createdAt: Date.now()
      };
      setPasses([pass, ...passes]);
      toast.success('Transit pass added!');
    }

    setNewPass({ type: 'monthly', autoReload: false });
    setShowPassForm(false);
    setEditingPass(null);
  };

  const deletePass = (id: string) => {
    setPasses(passes.filter(p => p.id !== id));
    toast.success('Pass deleted');
  };

  const updatePassBalance = (id: string, amount: number) => {
    setPasses(passes.map(p => {
      if (p.id === id && p.balance !== undefined) {
        const newBalance = p.balance + amount;
        if (p.autoReload && p.reloadThreshold && newBalance < p.reloadThreshold && p.reloadAmount) {
          toast.success(`Auto-reload triggered: +$${p.reloadAmount}`);
          return { ...p, balance: newBalance + p.reloadAmount };
        }
        return { ...p, balance: newBalance };
      }
      return p;
    }));
  };

  // Trip functions
  const saveTrip = () => {
    if (!newTrip.from || !newTrip.to || !newTrip.date) {
      toast.error('Please fill in required fields');
      return;
    }

    const trip: Trip = {
      id: Date.now().toString(),
      date: newTrip.date!,
      routeId: newTrip.routeId,
      from: newTrip.from!,
      to: newTrip.to!,
      mode: newTrip.mode || 'bus',
      cost: newTrip.cost || 0,
      duration: newTrip.duration || 0,
      safetyCheck: newTrip.safetyCheck || false,
      sharedWith: newTrip.sharedWith || [],
      notes: newTrip.notes || '',
      createdAt: Date.now()
    };
    setTrips([trip, ...trips]);
    toast.success('Trip logged!');

    // Update route last used
    if (newTrip.routeId) {
      setRoutes(routes.map(r => r.id === newTrip.routeId ? { ...r, lastUsed: newTrip.date! } : r));
    }

    setNewTrip({ mode: 'bus', safetyCheck: false, sharedWith: [] });
    setShowTripForm(false);
  };

  const deleteTrip = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
    toast.success('Trip deleted');
  };

  // Safety Contact functions
  const saveContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingContact) {
      setSafetyContacts(safetyContacts.map(c => c.id === editingContact ? { ...c, ...newContact } as SafetyContact : c));
      toast.success('Contact updated!');
    } else {
      const contact: SafetyContact = {
        id: Date.now().toString(),
        name: newContact.name!,
        phone: newContact.phone!,
        email: newContact.email || '',
        relationship: newContact.relationship || '',
        primary: newContact.primary || false,
        createdAt: Date.now()
      };
      setSafetyContacts([contact, ...safetyContacts]);
      toast.success('Safety contact added!');
    }

    setNewContact({ primary: false });
    setShowContactForm(false);
    setEditingContact(null);
  };

  const deleteContact = (id: string) => {
    setSafetyContacts(safetyContacts.filter(c => c.id !== id));
    toast.success('Contact deleted');
  };

  const setPrimaryContact = (id: string) => {
    setSafetyContacts(safetyContacts.map(c => ({
      ...c,
      primary: c.id === id
    })));
    toast.success('Primary contact updated');
  };

  // Bike Route functions
  const saveBikeRoute = () => {
    if (!newBikeRoute.name || !newBikeRoute.distance) {
      toast.error('Please fill in required fields');
      return;
    }

    if (editingBike) {
      setBikeRoutes(bikeRoutes.map(b => b.id === editingBike ? { ...b, ...newBikeRoute } as BikeRoute : b));
      toast.success('Bike route updated!');
    } else {
      const route: BikeRoute = {
        id: Date.now().toString(),
        name: newBikeRoute.name!,
        distance: newBikeRoute.distance!,
        difficulty: newBikeRoute.difficulty || 'moderate',
        terrain: newBikeRoute.terrain || '',
        bikePathPercent: newBikeRoute.bikePathPercent || 0,
        landmarks: newBikeRoute.landmarks || [],
        safety: newBikeRoute.safety || 3,
        scenic: newBikeRoute.scenic || 3,
        notes: newBikeRoute.notes || '',
        starred: newBikeRoute.starred || false,
        createdAt: Date.now()
      };
      setBikeRoutes([route, ...bikeRoutes]);
      toast.success('Bike route saved!');
    }

    setNewBikeRoute({ difficulty: 'moderate', starred: false, landmarks: [] });
    setShowBikeForm(false);
    setEditingBike(null);
  };

  const deleteBikeRoute = (id: string) => {
    setBikeRoutes(bikeRoutes.filter(b => b.id !== id));
    toast.success('Bike route deleted');
  };

  const toggleStarBike = (id: string) => {
    setBikeRoutes(bikeRoutes.map(b => b.id === id ? { ...b, starred: !b.starred } : b));
  };

  // Stats
  const totalTrips = trips.length;
  const totalTransportCost = trips.reduce((sum, t) => sum + t.cost, 0);
  const avgTripCost = totalTrips > 0 ? totalTransportCost / totalTrips : 0;
  const mostUsedMode = trips.length > 0
    ? trips.reduce((acc, trip) => {
        acc[trip.mode] = (acc[trip.mode] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  const topMode = Object.entries(mostUsedMode).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bike': return <Bike className="w-4 h-4" />;
      case 'rideshare': return <Users className="w-4 h-4" />;
      case 'drive': return <Car className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'bus': return 'text-blue-400';
      case 'train': return 'text-purple-400';
      case 'bike': return 'text-green-400';
      case 'rideshare': return 'text-orange-400';
      case 'drive': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-900 p-6">
        <button onClick={() => navigate('/')} className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Navigation className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Transportation Hub</h1>
        </div>
        <p className="text-blue-200">Plan routes, track passes, and stay safe</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-4 rounded-lg border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">{totalTrips}</div>
          <div className="text-sm text-blue-200">Total Trips</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-4 rounded-lg border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">${avgTripCost.toFixed(2)}</div>
          <div className="text-sm text-green-200">Avg Cost/Trip</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-4 rounded-lg border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">{routes.length}</div>
          <div className="text-sm text-purple-200">Saved Routes</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-4 rounded-lg border border-orange-500/30">
          <div className="text-2xl font-bold text-orange-400 capitalize">{topMode}</div>
          <div className="text-sm text-orange-200">Most Used</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 px-6 mb-6 no-scrollbar">
        {[
          { id: 'routes', label: 'Routes', icon: MapPin },
          { id: 'passes', label: 'Passes', icon: Calendar },
          { id: 'trips', label: 'Trips', icon: Clock },
          { id: 'safety', label: 'Safety', icon: Shield },
          { id: 'bike', label: 'Bike', icon: Bike }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowRouteForm(!showRouteForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Route
          </button>

          {showRouteForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Route name (e.g., Home to Work)"
                value={newRoute.name || ''}
                onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="From"
                  value={newRoute.from || ''}
                  onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="To"
                  value={newRoute.to || ''}
                  onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <select
                value={newRoute.mode}
                onChange={(e) => setNewRoute({ ...newRoute, mode: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="bike">Bike</option>
                <option value="walk">Walk</option>
                <option value="rideshare">Rideshare</option>
                <option value="drive">Drive</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={newRoute.duration || ''}
                  onChange={(e) => setNewRoute({ ...newRoute, duration: parseInt(e.target.value) || 0 })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Cost ($)"
                  step="0.01"
                  value={newRoute.cost || ''}
                  onChange={(e) => setNewRoute({ ...newRoute, cost: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <select
                value={newRoute.frequency}
                onChange={(e) => setNewRoute({ ...newRoute, frequency: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="occasional">Occasional</option>
              </select>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Safety Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewRoute({ ...newRoute, safetyRating: rating })}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        newRoute.safetyRating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRoute.accessibility || false}
                  onChange={(e) => setNewRoute({ ...newRoute, accessibility: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Wheelchair Accessible</span>
              </label>
              <textarea
                placeholder="Notes (optional)"
                value={newRoute.notes || ''}
                onChange={(e) => setNewRoute({ ...newRoute, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveRoute}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingRoute ? 'Update' : 'Save'} Route
                </button>
                <button
                  onClick={() => {
                    setShowRouteForm(false);
                    setEditingRoute(null);
                    setNewRoute({ mode: 'bus', accessibility: false, starred: false, safetyRating: 3, frequency: 'occasional', steps: [] });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {routes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No saved routes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {routes.map(route => (
                <div key={route.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={getModeColor(route.mode)}>
                        {getModeIcon(route.mode)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{route.name}</h3>
                        <p className="text-sm text-gray-400">{route.from} → {route.to}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStarRoute(route.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          route.starred ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={route.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRoute(route.id);
                          setNewRoute(route);
                          setShowRouteForm(true);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRoute(route.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div className="flex items-center gap-1 text-blue-400">
                      <Clock className="w-3 h-3" />
                      {route.duration} min
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="w-3 h-3" />
                      ${route.cost.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Shield className="w-3 h-3" />
                      {route.safetyRating}/5
                    </div>
                  </div>
                  {route.accessibility && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs mb-2">
                      <CheckCircle className="w-3 h-3" />
                      Accessible
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="capitalize">{route.frequency}</span>
                    <span>•</span>
                    <span>Last used: {route.lastUsed}</span>
                  </div>
                  {route.notes && (
                    <p className="text-sm text-gray-400 mt-2">{route.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transit Passes Tab */}
      {activeTab === 'passes' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowPassForm(!showPassForm)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Transit Pass
          </button>

          {showPassForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Pass name (e.g., Monthly Metro Pass)"
                value={newPass.name || ''}
                onChange={(e) => setNewPass({ ...newPass, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newPass.type}
                onChange={(e) => setNewPass({ ...newPass, type: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="monthly">Monthly Pass</option>
                <option value="weekly">Weekly Pass</option>
                <option value="daily">Daily Pass</option>
                <option value="stored-value">Stored Value Card</option>
              </select>
              {newPass.type === 'stored-value' && (
                <input
                  type="number"
                  placeholder="Current balance"
                  step="0.01"
                  value={newPass.balance || ''}
                  onChange={(e) => setNewPass({ ...newPass, balance: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="Purchase date"
                  value={newPass.purchaseDate || ''}
                  onChange={(e) => setNewPass({ ...newPass, purchaseDate: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="date"
                  placeholder="Expiration date"
                  value={newPass.expirationDate || ''}
                  onChange={(e) => setNewPass({ ...newPass, expirationDate: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <input
                type="number"
                placeholder="Cost"
                step="0.01"
                value={newPass.cost || ''}
                onChange={(e) => setNewPass({ ...newPass, cost: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              {newPass.type === 'stored-value' && (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newPass.autoReload || false}
                      onChange={(e) => setNewPass({ ...newPass, autoReload: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Enable Auto-Reload</span>
                  </label>
                  {newPass.autoReload && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Reload amount"
                        step="0.01"
                        value={newPass.reloadAmount || ''}
                        onChange={(e) => setNewPass({ ...newPass, reloadAmount: parseFloat(e.target.value) || 0 })}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="number"
                        placeholder="When below"
                        step="0.01"
                        value={newPass.reloadThreshold || ''}
                        onChange={(e) => setNewPass({ ...newPass, reloadThreshold: parseFloat(e.target.value) || 0 })}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  )}
                </>
              )}
              <textarea
                placeholder="Notes (optional)"
                value={newPass.notes || ''}
                onChange={(e) => setNewPass({ ...newPass, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={savePass}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingPass ? 'Update' : 'Save'} Pass
                </button>
                <button
                  onClick={() => {
                    setShowPassForm(false);
                    setEditingPass(null);
                    setNewPass({ type: 'monthly', autoReload: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {passes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No transit passes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {passes.map(pass => {
                const daysUntilExpiration = Math.ceil((new Date(pass.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isExpiring = daysUntilExpiration <= 7 && daysUntilExpiration >= 0;
                const isExpired = daysUntilExpiration < 0;

                return (
                  <div key={pass.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{pass.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">{pass.type.replace('-', ' ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingPass(pass.id);
                            setNewPass(pass);
                            setShowPassForm(true);
                          }}
                          className="p-2 text-purple-400 hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePass(pass.id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {pass.balance !== undefined && (
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-green-400">${pass.balance.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Current Balance</div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updatePassBalance(pass.id, -2.75)}
                            className="flex-1 bg-red-900/30 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-900/50 transition-colors"
                          >
                            -$2.75
                          </button>
                          <button
                            onClick={() => updatePassBalance(pass.id, 10)}
                            className="flex-1 bg-green-900/30 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-900/50 transition-colors"
                          >
                            +$10
                          </button>
                          <button
                            onClick={() => updatePassBalance(pass.id, 20)}
                            className="flex-1 bg-green-900/30 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-900/50 transition-colors"
                          >
                            +$20
                          </button>
                        </div>
                        {pass.autoReload && (
                          <div className="mt-2 text-xs text-blue-400">
                            Auto-reload: ${pass.reloadAmount} when below ${pass.reloadThreshold}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Purchased:</span>
                        <span>{pass.purchaseDate}</span>
                      </div>
                      <div className={`flex justify-between ${isExpired ? 'text-red-400' : isExpiring ? 'text-yellow-400' : 'text-gray-400'}`}>
                        <span>Expires:</span>
                        <span>{pass.expirationDate}</span>
                      </div>
                      {(isExpiring || isExpired) && (
                        <div className={`flex items-center gap-1 ${isExpired ? 'text-red-400' : 'text-yellow-400'}`}>
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-xs">
                            {isExpired ? 'Expired!' : `Expires in ${daysUntilExpiration} days`}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-400">
                        <span>Cost:</span>
                        <span>${pass.cost.toFixed(2)}</span>
                      </div>
                    </div>
                    {pass.notes && (
                      <p className="text-sm text-gray-400 mt-2">{pass.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowTripForm(!showTripForm)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Log Trip
          </button>

          {showTripForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="date"
                value={newTrip.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newTrip.routeId || ''}
                onChange={(e) => {
                  const route = routes.find(r => r.id === e.target.value);
                  if (route) {
                    setNewTrip({
                      ...newTrip,
                      routeId: route.id,
                      from: route.from,
                      to: route.to,
                      mode: route.mode,
                      cost: route.cost,
                      duration: route.duration
                    });
                  } else {
                    setNewTrip({ ...newTrip, routeId: undefined });
                  }
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select a saved route (optional)</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>{route.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="From"
                  value={newTrip.from || ''}
                  onChange={(e) => setNewTrip({ ...newTrip, from: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="To"
                  value={newTrip.to || ''}
                  onChange={(e) => setNewTrip({ ...newTrip, to: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <select
                value={newTrip.mode}
                onChange={(e) => setNewTrip({ ...newTrip, mode: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="bike">Bike</option>
                <option value="walk">Walk</option>
                <option value="rideshare">Rideshare</option>
                <option value="drive">Drive</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={newTrip.duration || ''}
                  onChange={(e) => setNewTrip({ ...newTrip, duration: parseInt(e.target.value) || 0 })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Cost ($)"
                  step="0.01"
                  value={newTrip.cost || ''}
                  onChange={(e) => setNewTrip({ ...newTrip, cost: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newTrip.safetyCheck || false}
                  onChange={(e) => setNewTrip({ ...newTrip, safetyCheck: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Shared location with safety contact</span>
              </label>
              <textarea
                placeholder="Notes (optional)"
                value={newTrip.notes || ''}
                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveTrip}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  Log Trip
                </button>
                <button
                  onClick={() => {
                    setShowTripForm(false);
                    setNewTrip({ mode: 'bus', safetyCheck: false, sharedWith: [] });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {trips.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No trips logged yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={getModeColor(trip.mode)}>
                        {getModeIcon(trip.mode)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{trip.from} → {trip.to}</p>
                        <p className="text-xs text-gray-500">{trip.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-blue-400">
                      <Clock className="w-3 h-3" />
                      {trip.duration} min
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="w-3 h-3" />
                      ${trip.cost.toFixed(2)}
                    </div>
                    {trip.safetyCheck && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Shield className="w-3 h-3" />
                        Safe
                      </div>
                    )}
                  </div>
                  {trip.notes && (
                    <p className="text-sm text-gray-400 mt-2">{trip.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Safety Tab */}
      {activeTab === 'safety' && (
        <div className="px-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 p-4 rounded-lg border border-blue-500/30">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">Safety First</h3>
                <p className="text-sm text-blue-200">Add trusted contacts who can track your trips. Share your location when traveling alone or using rideshare services.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowContactForm(!showContactForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Safety Contact
          </button>

          {showContactForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name || ''}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={newContact.phone || ''}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newContact.email || ''}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Relationship (e.g., friend, family)"
                value={newContact.relationship || ''}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newContact.primary || false}
                  onChange={(e) => setNewContact({ ...newContact, primary: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Set as primary contact</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={saveContact}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingContact ? 'Update' : 'Save'} Contact
                </button>
                <button
                  onClick={() => {
                    setShowContactForm(false);
                    setEditingContact(null);
                    setNewContact({ primary: false });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {safetyContacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No safety contacts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {safetyContacts.map(contact => (
                <div key={contact.id} className={`bg-gray-900 p-4 rounded-lg border ${contact.primary ? 'border-blue-500' : 'border-gray-700'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {contact.name}
                        {contact.primary && (
                          <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">Primary</span>
                        )}
                      </h3>
                      {contact.relationship && (
                        <p className="text-sm text-gray-400">{contact.relationship}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!contact.primary && (
                        <button
                          onClick={() => setPrimaryContact(contact.id)}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingContact(contact.id);
                          setNewContact(contact);
                          setShowContactForm(true);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Smartphone className="w-3 h-3" />
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-400 transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-xs">@</span>
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-400 transition-colors">
                          {contact.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bike Routes Tab */}
      {activeTab === 'bike' && (
        <div className="px-6 space-y-4">
          <button
            onClick={() => setShowBikeForm(!showBikeForm)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Bike Route
          </button>

          {showBikeForm && (
            <div className="bg-gray-900 p-4 rounded-lg space-y-3 border border-gray-700">
              <input
                type="text"
                placeholder="Route name"
                value={newBikeRoute.name || ''}
                onChange={(e) => setNewBikeRoute({ ...newBikeRoute, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <input
                type="number"
                placeholder="Distance (miles)"
                step="0.1"
                value={newBikeRoute.distance || ''}
                onChange={(e) => setNewBikeRoute({ ...newBikeRoute, distance: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <select
                value={newBikeRoute.difficulty}
                onChange={(e) => setNewBikeRoute({ ...newBikeRoute, difficulty: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
              <input
                type="text"
                placeholder="Terrain (e.g., paved, gravel, mixed)"
                value={newBikeRoute.terrain || ''}
                onChange={(e) => setNewBikeRoute({ ...newBikeRoute, terrain: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bike Path % (0-100)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newBikeRoute.bikePathPercent || 0}
                  onChange={(e) => setNewBikeRoute({ ...newBikeRoute, bikePathPercent: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-400 mt-1">{newBikeRoute.bikePathPercent || 0}%</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Safety (1-5)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewBikeRoute({ ...newBikeRoute, safety: rating })}
                        className={`flex-1 py-2 rounded-lg transition-colors ${
                          newBikeRoute.safety === rating
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Scenic (1-5)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewBikeRoute({ ...newBikeRoute, scenic: rating })}
                        className={`flex-1 py-2 rounded-lg transition-colors ${
                          newBikeRoute.scenic === rating
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={newBikeRoute.notes || ''}
                onChange={(e) => setNewBikeRoute({ ...newBikeRoute, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveBikeRoute}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingBike ? 'Update' : 'Save'} Route
                </button>
                <button
                  onClick={() => {
                    setShowBikeForm(false);
                    setEditingBike(null);
                    setNewBikeRoute({ difficulty: 'moderate', starred: false, landmarks: [] });
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {bikeRoutes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bike className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No bike routes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bikeRoutes.map(route => (
                <div key={route.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{route.name}</h3>
                      <p className="text-sm text-gray-400">{route.distance} miles • {route.difficulty}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStarBike(route.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          route.starred ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={route.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingBike(route.id);
                          setNewBikeRoute(route);
                          setShowBikeForm(true);
                        }}
                        className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBikeRoute(route.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div className="text-blue-400">
                      {route.bikePathPercent}% bike path
                    </div>
                    <div className="text-yellow-400">
                      Safety: {route.safety}/5
                    </div>
                    <div className="text-purple-400">
                      Scenic: {route.scenic}/5
                    </div>
                  </div>
                  {route.terrain && (
                    <div className="text-sm text-gray-400">Terrain: {route.terrain}</div>
                  )}
                  {route.notes && (
                    <p className="text-sm text-gray-400 mt-2">{route.notes}</p>
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

export default TransportationHubPage;
