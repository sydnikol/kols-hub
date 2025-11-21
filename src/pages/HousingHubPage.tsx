import React, { useState, useEffect } from 'react';
import { Home, Search, Users, BookOpen, Plus, X, Trash2, Star, MapPin, DollarSign, Calendar, CheckCircle, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ApartmentListing {
  id: string;
  address: string;
  neighborhood: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  availableDate: string;
  pros: string[];
  cons: string[];
  notes: string;
  starred: boolean;
  status: 'considering' | 'applied' | 'approved' | 'rejected' | 'rented';
  contactInfo: string;
  amenities: string[];
  createdAt: number;
}

interface Roommate {
  id: string;
  name: string;
  age: number;
  occupation: string;
  budget: number;
  moveInDate: string;
  lifestyle: string;
  cleanliness: number; // 1-5
  noise: number; // 1-5
  guests: number; // 1-5
  pets: string;
  smoking: boolean;
  drinking: string;
  schedule: string;
  interests: string[];
  compatibility: number; // calculated 1-100
  notes: string;
  status: 'potential' | 'contacted' | 'met' | 'approved' | 'rejected';
  createdAt: number;
}

interface HousingEntry {
  id: string;
  date: string;
  category: 'maintenance' | 'lease' | 'move-in' | 'move-out' | 'neighbor' | 'general';
  title: string;
  content: string;
  createdAt: number;
}

type TabType = 'overview' | 'apartments' | 'roommates' | 'journal';

const amenitiesList = ['Parking', 'Laundry', 'Dishwasher', 'AC', 'Heat', 'Gym', 'Pool', 'Security', 'Elevator', 'Storage', 'Balcony', 'Pet-Friendly'];

export default function HousingHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [apartments, setApartments] = useState<ApartmentListing[]>([]);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [journal, setJournal] = useState<HousingEntry[]>([]);
  const [isAddingApt, setIsAddingApt] = useState(false);
  const [isAddingRoommate, setIsAddingRoommate] = useState(false);
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  // Apartment form state
  const [aptForm, setAptForm] = useState({
    address: '',
    neighborhood: '',
    rent: 0,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 0,
    availableDate: '',
    contactInfo: '',
    notes: '',
  });
  const [aptPros, setAptPros] = useState<string[]>([]);
  const [aptCons, setAptCons] = useState<string[]>([]);
  const [aptAmenities, setAptAmenities] = useState<string[]>([]);
  const [proInput, setProInput] = useState('');
  const [conInput, setConInput] = useState('');

  // Roommate form state
  const [roommateForm, setRoommateForm] = useState({
    name: '',
    age: 18,
    occupation: '',
    budget: 0,
    moveInDate: '',
    lifestyle: '',
    cleanliness: 3,
    noise: 3,
    guests: 3,
    pets: '',
    smoking: false,
    drinking: 'occasionally',
    schedule: '',
    notes: '',
  });
  const [roommateInterests, setRoommateInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  // Journal form state
  const [entryForm, setEntryForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'general' as HousingEntry['category'],
    title: '',
    content: '',
  });

  useEffect(() => {
    const savedApts = localStorage.getItem('housingApartments');
    const savedRoommates = localStorage.getItem('housingRoommates');
    const savedJournal = localStorage.getItem('housingJournal');
    if (savedApts) setApartments(JSON.parse(savedApts));
    if (savedRoommates) setRoommates(JSON.parse(savedRoommates));
    if (savedJournal) setJournal(JSON.parse(savedJournal));
  }, []);

  useEffect(() => {
    localStorage.setItem('housingApartments', JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    localStorage.setItem('housingRoommates', JSON.stringify(roommates));
  }, [roommates]);

  useEffect(() => {
    localStorage.setItem('housingJournal', JSON.stringify(journal));
  }, [journal]);

  const calculateCompatibility = (roommate: Partial<Roommate>) => {
    let score = 50; // base score

    // Cleanliness, noise, and guests preferences (closer to your ideal = higher score)
    const idealCleanliness = 4;
    const idealNoise = 2;
    const idealGuests = 3;

    if (roommate.cleanliness) score += (5 - Math.abs(idealCleanliness - roommate.cleanliness)) * 5;
    if (roommate.noise) score += (5 - Math.abs(idealNoise - roommate.noise)) * 5;
    if (roommate.guests) score += (5 - Math.abs(idealGuests - roommate.guests)) * 5;

    // Lifestyle factors
    if (roommate.smoking) score -= 10;
    if (roommate.drinking === 'never') score += 5;
    if (roommate.drinking === 'frequently') score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  const handleAptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptForm.address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    const newApt: ApartmentListing = {
      id: Date.now().toString(),
      ...aptForm,
      pros: aptPros,
      cons: aptCons,
      amenities: aptAmenities,
      starred: false,
      status: 'considering',
      createdAt: Date.now(),
    };

    setApartments([...apartments, newApt]);
    setAptForm({ address: '', neighborhood: '', rent: 0, bedrooms: 1, bathrooms: 1, sqft: 0, availableDate: '', contactInfo: '', notes: '' });
    setAptPros([]);
    setAptCons([]);
    setAptAmenities([]);
    setIsAddingApt(false);
    toast.success('Apartment added!');
  };

  const handleRoommateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roommateForm.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const compatibility = calculateCompatibility(roommateForm);

    const newRoommate: Roommate = {
      id: Date.now().toString(),
      ...roommateForm,
      interests: roommateInterests,
      compatibility,
      status: 'potential',
      createdAt: Date.now(),
    };

    setRoommates([...roommates, newRoommate]);
    setRoommateForm({ name: '', age: 18, occupation: '', budget: 0, moveInDate: '', lifestyle: '', cleanliness: 3, noise: 3, guests: 3, pets: '', smoking: false, drinking: 'occasionally', schedule: '', notes: '' });
    setRoommateInterests([]);
    setIsAddingRoommate(false);
    toast.success('Roommate added!');
  };

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newEntry: HousingEntry = {
      id: Date.now().toString(),
      ...entryForm,
      createdAt: Date.now(),
    };

    setJournal([...journal, newEntry]);
    setEntryForm({ date: new Date().toISOString().split('T')[0], category: 'general', title: '', content: '' });
    setIsAddingEntry(false);
    toast.success('Entry added!');
  };

  const toggleAptStar = (id: string) => {
    setApartments(apartments.map(apt => apt.id === id ? { ...apt, starred: !apt.starred } : apt));
  };

  const updateAptStatus = (id: string, status: ApartmentListing['status']) => {
    setApartments(apartments.map(apt => apt.id === id ? { ...apt, status } : apt));
  };

  const updateRoommateStatus = (id: string, status: Roommate['status']) => {
    setRoommates(roommates.map(rm => rm.id === id ? { ...rm, status } : rm));
  };

  const deleteApt = (id: string) => {
    if (confirm('Delete this apartment listing?')) {
      setApartments(apartments.filter(apt => apt.id !== id));
      toast.success('Apartment deleted');
    }
  };

  const deleteRoommate = (id: string) => {
    if (confirm('Delete this roommate profile?')) {
      setRoommates(roommates.filter(rm => rm.id !== id));
      toast.success('Roommate deleted');
    }
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this journal entry?')) {
      setJournal(journal.filter(e => e.id !== id));
      toast.success('Entry deleted');
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Home },
    { id: 'apartments' as TabType, label: 'Apartments', icon: Search },
    { id: 'roommates' as TabType, label: 'Roommates', icon: Users },
    { id: 'journal' as TabType, label: 'Journal', icon: BookOpen },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'considering': case 'potential': return 'bg-blue-500/20 text-blue-300';
      case 'applied': case 'contacted': return 'bg-cyan-500/20 text-cyan-300';
      case 'approved': case 'met': return 'bg-green-500/20 text-green-300';
      case 'rejected': return 'bg-red-500/20 text-red-300';
      case 'rented': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance': return 'bg-orange-500/20 text-orange-300';
      case 'lease': return 'bg-blue-500/20 text-blue-300';
      case 'move-in': return 'bg-green-500/20 text-green-300';
      case 'move-out': return 'bg-red-500/20 text-red-300';
      case 'neighbor': return 'bg-cyan-500/20 text-cyan-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Housing Hub
            </h1>
          </div>
          <p className="text-indigo-400">
            Find your home, connect with roommates, track your housing journey
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-indigo-900/20 p-2 rounded-xl border border-indigo-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                      : 'bg-indigo-900/20 text-indigo-400 hover:bg-indigo-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/30">
                  <Search className="w-8 h-8 text-indigo-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{apartments.length}</h3>
                  <p className="text-indigo-200/70">Apartments Tracked</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-6 rounded-xl border border-purple-500/30">
                  <Users className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{roommates.length}</h3>
                  <p className="text-purple-200/70">Potential Roommates</p>
                </div>
                <div className="bg-gradient-to-br from-violet-900/30 to-indigo-900/30 p-6 rounded-xl border border-violet-500/30">
                  <BookOpen className="w-8 h-8 text-violet-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{journal.length}</h3>
                  <p className="text-violet-200/70">Journal Entries</p>
                </div>
              </div>

              <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30">
                <h3 className="text-xl font-bold text-indigo-300 mb-3">About Housing Hub</h3>
                <p className="text-indigo-200 mb-3">
                  Finding safe, affordable housing and compatible roommates is crucial for your wellbeing.
                  This hub helps you track apartment searches, evaluate potential roommates, and document your housing journey.
                </p>
                <div className="space-y-2 text-indigo-100">
                  <p><strong>Apartments:</strong> Track listings, compare pros/cons, manage applications</p>
                  <p><strong>Roommates:</strong> Evaluate compatibility, track preferences, coordinate move-ins</p>
                  <p><strong>Journal:</strong> Document maintenance, lease info, and housing experiences</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apartments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Search className="w-7 h-7 text-indigo-400" />
                    Apartment Search
                  </h2>
                  <p className="text-indigo-200/70 mt-1">{apartments.length} listings tracked</p>
                </div>
                <button
                  onClick={() => setIsAddingApt(!isAddingApt)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2"
                >
                  {isAddingApt ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingApt ? 'Cancel' : 'Add Apartment'}
                </button>
              </div>

              {isAddingApt && (
                <form onSubmit={handleAptSubmit} className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={aptForm.address}
                      onChange={(e) => setAptForm({ ...aptForm, address: e.target.value })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Address"
                      required
                    />
                    <input
                      type="text"
                      value={aptForm.neighborhood}
                      onChange={(e) => setAptForm({ ...aptForm, neighborhood: e.target.value })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Neighborhood"
                    />
                    <input
                      type="number"
                      value={aptForm.rent || ''}
                      onChange={(e) => setAptForm({ ...aptForm, rent: parseInt(e.target.value) || 0 })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Monthly Rent ($)"
                    />
                    <input
                      type="number"
                      value={aptForm.sqft || ''}
                      onChange={(e) => setAptForm({ ...aptForm, sqft: parseInt(e.target.value) || 0 })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Square Feet"
                    />
                    <input
                      type="number"
                      value={aptForm.bedrooms}
                      onChange={(e) => setAptForm({ ...aptForm, bedrooms: parseInt(e.target.value) || 1 })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Bedrooms"
                      min="0"
                    />
                    <input
                      type="number"
                      value={aptForm.bathrooms}
                      onChange={(e) => setAptForm({ ...aptForm, bathrooms: parseFloat(e.target.value) || 1 })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Bathrooms"
                      min="0"
                      step="0.5"
                    />
                    <input
                      type="date"
                      value={aptForm.availableDate}
                      onChange={(e) => setAptForm({ ...aptForm, availableDate: e.target.value })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                    />
                    <input
                      type="text"
                      value={aptForm.contactInfo}
                      onChange={(e) => setAptForm({ ...aptForm, contactInfo: e.target.value })}
                      className="bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                      placeholder="Contact Info"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-indigo-300 font-medium">Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {amenitiesList.map(amenity => (
                        <label key={amenity} className="flex items-center gap-2 text-indigo-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aptAmenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAptAmenities([...aptAmenities, amenity]);
                              } else {
                                setAptAmenities(aptAmenities.filter(a => a !== amenity));
                              }
                            }}
                            className="rounded"
                          />
                          {amenity}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={proInput}
                      onChange={(e) => setProInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (proInput.trim()) {
                            setAptPros([...aptPros, proInput.trim()]);
                            setProInput('');
                          }
                        }
                      }}
                      className="flex-1 bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-400"
                      placeholder="Add a pro..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (proInput.trim()) {
                          setAptPros([...aptPros, proInput.trim()]);
                          setProInput('');
                        }
                      }}
                      className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {aptPros.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {aptPros.map((pro, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm flex items-center gap-2">
                          ✓ {pro}
                          <button type="button" onClick={() => setAptPros(aptPros.filter((_, i) => i !== idx))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={conInput}
                      onChange={(e) => setConInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (conInput.trim()) {
                            setAptCons([...aptCons, conInput.trim()]);
                            setConInput('');
                          }
                        }
                      }}
                      className="flex-1 bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                      placeholder="Add a con..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (conInput.trim()) {
                          setAptCons([...aptCons, conInput.trim()]);
                          setConInput('');
                        }
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {aptCons.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {aptCons.map((con, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center gap-2">
                          ✗ {con}
                          <button type="button" onClick={() => setAptCons(aptCons.filter((_, i) => i !== idx))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={aptForm.notes}
                    onChange={(e) => setAptForm({ ...aptForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 min-h-[80px]"
                    placeholder="Additional notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all font-medium"
                  >
                    Add Apartment
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {apartments.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/20">
                    <Search className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />
                    <p className="text-indigo-200/70">No apartments tracked yet - add your first listing!</p>
                  </div>
                ) : (
                  apartments.sort((a, b) => b.createdAt - a.createdAt).map(apt => (
                    <div key={apt.id} className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{apt.address}</h3>
                          {apt.neighborhood && <p className="text-indigo-300/70 text-sm flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{apt.neighborhood}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toggleAptStar(apt.id)} className={`p-1 rounded ${apt.starred ? 'text-indigo-400' : 'text-indigo-600 hover:text-indigo-400'}`}>
                            <Star className={`w-5 h-5 ${apt.starred ? 'fill-current' : ''}`} />
                          </button>
                          <button onClick={() => deleteApt(apt.id)} className="p-1 text-red-300 hover:text-red-200">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-2 text-indigo-200">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${apt.rent}/mo</span>
                        </div>
                        <div className="text-indigo-200">
                          {apt.bedrooms} bed, {apt.bathrooms} bath
                        </div>
                        {apt.sqft > 0 && <div className="text-indigo-200/70 text-sm">{apt.sqft} sqft</div>}
                        {apt.availableDate && (
                          <div className="text-indigo-200/70 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(apt.availableDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {apt.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {apt.amenities.map(amenity => (
                            <span key={amenity} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs">{amenity}</span>
                          ))}
                        </div>
                      )}

                      {apt.pros.length > 0 && (
                        <div className="mb-2">
                          <p className="text-green-300 font-medium text-sm mb-1">Pros:</p>
                          <div className="space-y-1">
                            {apt.pros.map((pro, idx) => (
                              <p key={idx} className="text-green-200/70 text-sm">✓ {pro}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {apt.cons.length > 0 && (
                        <div className="mb-3">
                          <p className="text-red-300 font-medium text-sm mb-1">Cons:</p>
                          <div className="space-y-1">
                            {apt.cons.map((con, idx) => (
                              <p key={idx} className="text-red-200/70 text-sm">✗ {con}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {apt.notes && <p className="text-indigo-200/70 text-sm mb-3 italic">{apt.notes}</p>}

                      {apt.contactInfo && <p className="text-indigo-300 text-sm mb-3">Contact: {apt.contactInfo}</p>}

                      <div className="flex items-center justify-between">
                        <select
                          value={apt.status}
                          onChange={(e) => updateAptStatus(apt.id, e.target.value as ApartmentListing['status'])}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)} bg-opacity-50`}
                        >
                          <option value="considering">Considering</option>
                          <option value="applied">Applied</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="rented">Rented</option>
                        </select>
                        <p className="text-indigo-300/50 text-xs">{new Date(apt.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'roommates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Users className="w-7 h-7 text-purple-400" />
                    Roommate Finder
                  </h2>
                  <p className="text-purple-200/70 mt-1">{roommates.length} potential roommates</p>
                </div>
                <button
                  onClick={() => setIsAddingRoommate(!isAddingRoommate)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2"
                >
                  {isAddingRoommate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingRoommate ? 'Cancel' : 'Add Roommate'}
                </button>
              </div>

              {isAddingRoommate && (
                <form onSubmit={handleRoommateSubmit} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={roommateForm.name}
                      onChange={(e) => setRoommateForm({ ...roommateForm, name: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="number"
                      value={roommateForm.age}
                      onChange={(e) => setRoommateForm({ ...roommateForm, age: parseInt(e.target.value) || 18 })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Age"
                      min="18"
                    />
                    <input
                      type="text"
                      value={roommateForm.occupation}
                      onChange={(e) => setRoommateForm({ ...roommateForm, occupation: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Occupation"
                    />
                    <input
                      type="number"
                      value={roommateForm.budget || ''}
                      onChange={(e) => setRoommateForm({ ...roommateForm, budget: parseInt(e.target.value) || 0 })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Budget ($)"
                    />
                    <input
                      type="date"
                      value={roommateForm.moveInDate}
                      onChange={(e) => setRoommateForm({ ...roommateForm, moveInDate: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                    <input
                      type="text"
                      value={roommateForm.lifestyle}
                      onChange={(e) => setRoommateForm({ ...roommateForm, lifestyle: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Lifestyle (e.g., student, professional)"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-purple-300 text-sm mb-1 block">Cleanliness (1=messy, 5=very clean)</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={roommateForm.cleanliness}
                        onChange={(e) => setRoommateForm({ ...roommateForm, cleanliness: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <p className="text-purple-200 text-center">{roommateForm.cleanliness}</p>
                    </div>
                    <div>
                      <label className="text-purple-300 text-sm mb-1 block">Noise Level (1=quiet, 5=loud)</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={roommateForm.noise}
                        onChange={(e) => setRoommateForm({ ...roommateForm, noise: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <p className="text-purple-200 text-center">{roommateForm.noise}</p>
                    </div>
                    <div>
                      <label className="text-purple-300 text-sm mb-1 block">Guests Frequency (1=rare, 5=often)</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={roommateForm.guests}
                        onChange={(e) => setRoommateForm({ ...roommateForm, guests: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <p className="text-purple-200 text-center">{roommateForm.guests}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={roommateForm.pets}
                      onChange={(e) => setRoommateForm({ ...roommateForm, pets: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Pets (e.g., cat, dog, none)"
                    />
                    <input
                      type="text"
                      value={roommateForm.schedule}
                      onChange={(e) => setRoommateForm({ ...roommateForm, schedule: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Schedule (e.g., 9-5, night shift)"
                    />
                    <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roommateForm.smoking}
                        onChange={(e) => setRoommateForm({ ...roommateForm, smoking: e.target.checked })}
                        className="rounded"
                      />
                      Smoker
                    </label>
                    <select
                      value={roommateForm.drinking}
                      onChange={(e) => setRoommateForm({ ...roommateForm, drinking: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="never">Never drinks</option>
                      <option value="occasionally">Drinks occasionally</option>
                      <option value="frequently">Drinks frequently</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (interestInput.trim() && !roommateInterests.includes(interestInput.trim())) {
                            setRoommateInterests([...roommateInterests, interestInput.trim()]);
                            setInterestInput('');
                          }
                        }
                      }}
                      className="flex-1 bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Add interests..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (interestInput.trim() && !roommateInterests.includes(interestInput.trim())) {
                          setRoommateInterests([...roommateInterests, interestInput.trim()]);
                          setInterestInput('');
                        }
                      }}
                      className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {roommateInterests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {roommateInterests.map(interest => (
                        <span key={interest} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2">
                          {interest}
                          <button type="button" onClick={() => setRoommateInterests(roommateInterests.filter(i => i !== interest))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={roommateForm.notes}
                    onChange={(e) => setRoommateForm({ ...roommateForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                    placeholder="Additional notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
                  >
                    Add Roommate
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {roommates.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
                    <Users className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                    <p className="text-purple-200/70">No roommates tracked yet - add your first potential match!</p>
                  </div>
                ) : (
                  roommates
                    .sort((a, b) => b.compatibility - a.compatibility)
                    .map(roommate => (
                      <div key={roommate.id} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{roommate.name}, {roommate.age}</h3>
                            <p className="text-purple-300/70 text-sm">{roommate.occupation}</p>
                          </div>
                          <button onClick={() => deleteRoommate(roommate.id)} className="p-1 text-red-300 hover:text-red-200">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mb-3 p-3 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg border border-purple-400/30">
                          <p className="text-purple-200 text-sm mb-1">Compatibility Score</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-black/40 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all"
                                style={{ width: `${roommate.compatibility}%` }}
                              />
                            </div>
                            <span className="text-white font-bold">{roommate.compatibility}%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div className="text-purple-200">Budget: ${roommate.budget}/mo</div>
                          {roommate.moveInDate && <div className="text-purple-200">Move-in: {new Date(roommate.moveInDate).toLocaleDateString()}</div>}
                          <div className="text-purple-200">Cleanliness: {roommate.cleanliness}/5</div>
                          <div className="text-purple-200">Noise: {roommate.noise}/5</div>
                          <div className="text-purple-200">Guests: {roommate.guests}/5</div>
                          <div className="text-purple-200">Pets: {roommate.pets || 'None'}</div>
                          {roommate.smoking && <div className="text-orange-300">Smoker</div>}
                          <div className="text-purple-200">Drinking: {roommate.drinking}</div>
                        </div>

                        {roommate.lifestyle && <p className="text-purple-200/70 text-sm mb-2">Lifestyle: {roommate.lifestyle}</p>}
                        {roommate.schedule && <p className="text-purple-200/70 text-sm mb-2">Schedule: {roommate.schedule}</p>}

                        {roommate.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {roommate.interests.map(interest => (
                              <span key={interest} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">{interest}</span>
                            ))}
                          </div>
                        )}

                        {roommate.notes && <p className="text-purple-200/70 text-sm mb-3 italic">{roommate.notes}</p>}

                        <div className="flex items-center justify-between">
                          <select
                            value={roommate.status}
                            onChange={(e) => updateRoommateStatus(roommate.id, e.target.value as Roommate['status'])}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(roommate.status)} bg-opacity-50`}
                          >
                            <option value="potential">Potential</option>
                            <option value="contacted">Contacted</option>
                            <option value="met">Met</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <p className="text-purple-300/50 text-xs">{new Date(roommate.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BookOpen className="w-7 h-7 text-violet-400" />
                    Housing Journal
                  </h2>
                  <p className="text-violet-200/70 mt-1">{journal.length} entries</p>
                </div>
                <button
                  onClick={() => setIsAddingEntry(!isAddingEntry)}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all flex items-center gap-2"
                >
                  {isAddingEntry ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingEntry ? 'Cancel' : 'Add Entry'}
                </button>
              </div>

              {isAddingEntry && (
                <form onSubmit={handleEntrySubmit} className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-6 border border-violet-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={entryForm.date}
                      onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    />
                    <select
                      value={entryForm.category}
                      onChange={(e) => setEntryForm({ ...entryForm, category: e.target.value as HousingEntry['category'] })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    >
                      <option value="general">General</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="lease">Lease</option>
                      <option value="move-in">Move-In</option>
                      <option value="move-out">Move-Out</option>
                      <option value="neighbor">Neighbor</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={entryForm.title}
                    onChange={(e) => setEntryForm({ ...entryForm, title: e.target.value })}
                    className="w-full bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    placeholder="Entry title..."
                    required
                  />
                  <textarea
                    value={entryForm.content}
                    onChange={(e) => setEntryForm({ ...entryForm, content: e.target.value })}
                    className="w-full bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400 min-h-[120px]"
                    placeholder="Write your entry..."
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all font-medium"
                  >
                    Add Entry
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {journal.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-xl border border-violet-500/20">
                    <BookOpen className="w-16 h-16 text-violet-400/50 mx-auto mb-4" />
                    <p className="text-violet-200/70">No journal entries yet - document your housing journey!</p>
                  </div>
                ) : (
                  journal.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                    <div key={entry.id} className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-5 border border-violet-500/20 hover:border-violet-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(entry.category)}`}>
                              {entry.category}
                            </span>
                            <span className="text-violet-300/70 text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                        </div>
                        <button onClick={() => deleteEntry(entry.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {entry.content && <p className="text-violet-200/70 whitespace-pre-wrap">{entry.content}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
