import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Camera, Plus, Trash2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Trip {
  id: string;
  destination: string;
  country: string;
  type: 'vacation' | 'business' | 'adventure' | 'cultural' | 'relaxation' | 'family' | 'solo' | 'other';
  status: 'planning' | 'booked' | 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  budget?: number;
  spent?: number;
  accommodation?: string;
  transportation?: string;
  notes: string;
}

interface TravelMemory {
  id: string;
  tripDestination: string;
  title: string;
  date: string;
  type: 'photo' | 'experience' | 'food' | 'landmark' | 'people' | 'adventure' | 'other';
  rating: number; // 1-5
  description: string;
  location?: string;
  wouldRecommend: boolean;
}

interface BucketListDestination {
  id: string;
  destination: string;
  country: string;
  priority: 'low' | 'medium' | 'high' | 'must-visit';
  category: 'beach' | 'mountain' | 'city' | 'cultural' | 'adventure' | 'nature' | 'historical' | 'other';
  estimatedBudget?: number;
  bestTimeToVisit?: string;
  reasonToVisit: string;
  visited: boolean;
  visitedDate?: string;
}

const TravelHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trips' | 'memories' | 'bucket-list' | 'stats'>('trips');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [memories, setMemories] = useState<TravelMemory[]>([]);
  const [bucketList, setBucketList] = useState<BucketListDestination[]>([]);

  useEffect(() => {
    const savedTrips = localStorage.getItem('travelTrips');
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    const savedMemories = localStorage.getItem('travelMemories');
    if (savedMemories) setMemories(JSON.parse(savedMemories));
    const savedBucketList = localStorage.getItem('travelBucketList');
    if (savedBucketList) setBucketList(JSON.parse(savedBucketList));
  }, []);

  useEffect(() => { localStorage.setItem('travelTrips', JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem('travelMemories', JSON.stringify(memories)); }, [memories]);
  useEffect(() => { localStorage.setItem('travelBucketList', JSON.stringify(bucketList)); }, [bucketList]);

  const addTrip = () => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      destination: '',
      country: '',
      type: 'vacation',
      status: 'planning',
      notes: '',
    };
    setTrips([...trips, newTrip]);
    toast.success('Trip added');
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(trips.map(t => t.id === id ? { ...t, ...updates } : t));
    toast.success('Trip updated');
  };

  const deleteTrip = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
    toast.success('Trip deleted');
  };

  const addMemory = () => {
    const newMemory: TravelMemory = {
      id: Date.now().toString(),
      tripDestination: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: 'experience',
      rating: 3,
      description: '',
      wouldRecommend: true,
    };
    setMemories([...memories, newMemory]);
    toast.success('Memory added');
  };

  const updateMemory = (id: string, updates: Partial<TravelMemory>) => {
    setMemories(memories.map(m => m.id === id ? { ...m, ...updates } : m));
    toast.success('Memory updated');
  };

  const deleteMemory = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
    toast.success('Memory deleted');
  };

  const addBucketListItem = () => {
    const newItem: BucketListDestination = {
      id: Date.now().toString(),
      destination: '',
      country: '',
      priority: 'medium',
      category: 'other',
      reasonToVisit: '',
      visited: false,
    };
    setBucketList([...bucketList, newItem]);
    toast.success('Destination added to bucket list');
  };

  const updateBucketListItem = (id: string, updates: Partial<BucketListDestination>) => {
    setBucketList(bucketList.map(b => b.id === id ? { ...b, ...updates } : b));
    toast.success('Bucket list updated');
  };

  const deleteBucketListItem = (id: string) => {
    setBucketList(bucketList.filter(b => b.id !== id));
    toast.success('Destination removed');
  };

  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'booked').length;
  const visitedDestinations = bucketList.filter(b => b.visited).length;
  const totalSpent = trips.reduce((sum, t) => sum + (t.spent || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 pb-20">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Plane className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Travel Hub</h1>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{upcomingTrips}</div>
            <div className="text-xs opacity-90">Upcoming</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <MapPin className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completedTrips}</div>
            <div className="text-xs opacity-90">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Camera className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{memories.length}</div>
            <div className="text-xs opacity-90">Memories</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{visitedDestinations}</div>
            <div className="text-xs opacity-90">Visited</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'trips', label: 'Trips', icon: Plane },
            { id: 'memories', label: 'Memories', icon: Camera },
            { id: 'bucket-list', label: 'Bucket List', icon: MapPin },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50' : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'}`}>
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <button onClick={addTrip} className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Trip</span>
            </button>
            {trips.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Plane className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No trips yet. Start planning your adventure!</p>
              </div>
            ) : (
              trips.sort((a, b) => {
                if (!a.startDate) return 1;
                if (!b.startDate) return -1;
                return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
              }).map(trip => (
                <div key={trip.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${trip.status === 'completed' ? 'border-green-500' : trip.status === 'upcoming' || trip.status === 'booked' ? 'border-cyan-500' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <input type="text" value={trip.destination} onChange={(e) => updateTrip(trip.id, { destination: e.target.value })} placeholder="Destination..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none w-full mb-1" />
                      <input type="text" value={trip.country} onChange={(e) => updateTrip(trip.id, { country: e.target.value })} placeholder="Country..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-cyan-500 outline-none w-full" />
                    </div>
                    <button onClick={() => deleteTrip(trip.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={trip.type} onChange={(e) => updateTrip(trip.id, { type: e.target.value as Trip['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                      <option value="vacation">Vacation</option>
                      <option value="business">Business</option>
                      <option value="adventure">Adventure</option>
                      <option value="cultural">Cultural</option>
                      <option value="relaxation">Relaxation</option>
                      <option value="family">Family</option>
                      <option value="solo">Solo</option>
                      <option value="other">Other</option>
                    </select>
                    <select value={trip.status} onChange={(e) => updateTrip(trip.id, { status: e.target.value as Trip['status'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                      <option value="planning">Planning</option>
                      <option value="booked">Booked</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <input type="date" value={trip.startDate || ''} onChange={(e) => updateTrip(trip.id, { startDate: e.target.value })} placeholder="Start date..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                    <input type="date" value={trip.endDate || ''} onChange={(e) => updateTrip(trip.id, { endDate: e.target.value })} placeholder="End date..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                    <input type="number" step="0.01" value={trip.budget || ''} onChange={(e) => updateTrip(trip.id, { budget: parseFloat(e.target.value) || undefined })} placeholder="Budget..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                    <input type="number" step="0.01" value={trip.spent || ''} onChange={(e) => updateTrip(trip.id, { spent: parseFloat(e.target.value) || undefined })} placeholder="Spent..." className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                  </div>
                  <textarea value={trip.notes} onChange={(e) => updateTrip(trip.id, { notes: e.target.value })} placeholder="Notes, itinerary..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" rows={2} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'memories' && (
          <div className="space-y-4">
            <button onClick={addMemory} className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Memory</span>
            </button>
            {memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(memory => (
              <div key={memory.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="text" value={memory.tripDestination} onChange={(e) => updateMemory(memory.id, { tripDestination: e.target.value })} placeholder="Trip destination..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-cyan-500 outline-none w-full mb-1" />
                    <input type="text" value={memory.title} onChange={(e) => updateMemory(memory.id, { title: e.target.value })} placeholder="Memory title..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteMemory(memory.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="date" value={memory.date} onChange={(e) => updateMemory(memory.id, { date: e.target.value })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" />
                  <select value={memory.type} onChange={(e) => updateMemory(memory.id, { type: e.target.value as TravelMemory['type'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                    <option value="photo">Photo</option>
                    <option value="experience">Experience</option>
                    <option value="food">Food</option>
                    <option value="landmark">Landmark</option>
                    <option value="people">People</option>
                    <option value="adventure">Adventure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-2">Rating: {memory.rating}/5</label>
                  <input type="range" min="1" max="5" value={memory.rating} onChange={(e) => updateMemory(memory.id, { rating: parseInt(e.target.value) })} className="w-full" />
                </div>
                <textarea value={memory.description} onChange={(e) => updateMemory(memory.id, { description: e.target.value })} placeholder="Description..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bucket-list' && (
          <div className="space-y-4">
            <button onClick={addBucketListItem} className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Destination</span>
            </button>
            {bucketList.sort((a, b) => {
              if (a.visited !== b.visited) return a.visited ? 1 : -1;
              const priorityOrder = { 'must-visit': 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }).map(item => (
              <div key={item.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${item.visited ? 'border-green-500' : item.priority === 'must-visit' ? 'border-red-500' : item.priority === 'high' ? 'border-orange-500' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-2">
                    <input type="text" value={item.destination} onChange={(e) => updateBucketListItem(item.id, { destination: e.target.value })} placeholder="Destination..." className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-cyan-500 outline-none w-full mb-1" />
                    <input type="text" value={item.country} onChange={(e) => updateBucketListItem(item.id, { country: e.target.value })} placeholder="Country..." className="text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-cyan-500 outline-none w-full" />
                  </div>
                  <button onClick={() => deleteBucketListItem(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select value={item.priority} onChange={(e) => updateBucketListItem(item.id, { priority: e.target.value as BucketListDestination['priority'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="must-visit">Must Visit</option>
                  </select>
                  <select value={item.category} onChange={(e) => updateBucketListItem(item.id, { category: e.target.value as BucketListDestination['category'] })} className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none">
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                    <option value="city">City</option>
                    <option value="cultural">Cultural</option>
                    <option value="adventure">Adventure</option>
                    <option value="nature">Nature</option>
                    <option value="historical">Historical</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="flex items-center space-x-2 col-span-2">
                    <input type="checkbox" checked={item.visited} onChange={(e) => updateBucketListItem(item.id, { visited: e.target.checked })} className="w-5 h-5" />
                    <label className="text-sm text-gray-600">Visited</label>
                  </div>
                </div>
                <textarea value={item.reasonToVisit} onChange={(e) => updateBucketListItem(item.id, { reasonToVisit: e.target.value })} placeholder="Reason to visit..." className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-cyan-500 outline-none" rows={2} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-600">Travel Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trips:</span>
                  <span className="font-semibold">{trips.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Trips:</span>
                  <span className="font-semibold">{completedTrips}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming Trips:</span>
                  <span className="font-semibold">{upcomingTrips}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memories:</span>
                  <span className="font-semibold">{memories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bucket List:</span>
                  <span className="font-semibold">{bucketList.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visited:</span>
                  <span className="font-semibold">{visitedDestinations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold">${totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelHubPage;
