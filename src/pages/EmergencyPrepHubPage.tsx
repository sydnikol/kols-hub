import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, Users, MapPin, FileText, Plus, Edit2, Trash2, Star, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencySupply {
  id: string;
  item: string;
  category: 'food' | 'water' | 'medical' | 'tools' | 'communication' | 'clothing' | 'documents' | 'other';
  quantity: number;
  unit: string;
  location: string;
  expirationDate?: string;
  checkDate?: string;
  essential: boolean;
  notes: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  type: 'family' | 'friend' | 'medical' | 'emergency-service' | 'utility' | 'insurance' | 'other';
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  priority: number; // 1-5
  notes: string;
}

interface EvacuationPlan {
  id: string;
  name: string;
  scenario: 'fire' | 'flood' | 'earthquake' | 'severe-weather' | 'chemical' | 'other';
  primaryRoute: string;
  alternateRoute: string;
  meetingPoint: string;
  transportation: string;
  specialConsiderations: string[];
  practiced: boolean;
  lastPracticeDate?: string;
  notes: string;
}

interface EmergencyDocument {
  id: string;
  name: string;
  type: 'id' | 'insurance' | 'medical' | 'financial' | 'property' | 'legal' | 'other';
  location: string;
  digitalCopy: boolean;
  cloudBackup: boolean;
  lastUpdated?: string;
  notes: string;
}

interface SafetyDrill {
  id: string;
  drillType: 'fire' | 'earthquake' | 'tornado' | 'evacuation' | 'shelter-in-place' | 'other';
  date: string;
  participants: string[];
  duration: number; // minutes
  issues: string[];
  improvements: string[];
  nextScheduled?: string;
  completed: boolean;
}

const EmergencyPrepHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'supplies' | 'contacts' | 'evacuation' | 'documents' | 'drills'>('supplies');
  const [supplies, setSupplies] = useState<EmergencySupply[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [evacuationPlans, setEvacuationPlans] = useState<EvacuationPlan[]>([]);
  const [documents, setDocuments] = useState<EmergencyDocument[]>([]);
  const [drills, setDrills] = useState<SafetyDrill[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedSupplies = localStorage.getItem('emergencySupplies');
    const savedContacts = localStorage.getItem('emergencyContacts');
    const savedPlans = localStorage.getItem('evacuationPlans');
    const savedDocuments = localStorage.getItem('emergencyDocuments');
    const savedDrills = localStorage.getItem('safetyDrills');

    if (savedSupplies) setSupplies(JSON.parse(savedSupplies));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedPlans) setEvacuationPlans(JSON.parse(savedPlans));
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
    if (savedDrills) setDrills(JSON.parse(savedDrills));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('emergencySupplies', JSON.stringify(supplies));
  }, [supplies]);

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('evacuationPlans', JSON.stringify(evacuationPlans));
  }, [evacuationPlans]);

  useEffect(() => {
    localStorage.setItem('emergencyDocuments', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('safetyDrills', JSON.stringify(drills));
  }, [drills]);

  const addSupply = () => {
    const newSupply: EmergencySupply = {
      id: Date.now().toString(),
      item: '',
      category: 'food',
      quantity: 0,
      unit: '',
      location: '',
      essential: false,
      notes: '',
    };
    setSupplies([...supplies, newSupply]);
    toast.success('Supply added');
  };

  const updateSupply = (id: string, updates: Partial<EmergencySupply>) => {
    setSupplies(supplies.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Supply updated');
  };

  const deleteSupply = (id: string) => {
    setSupplies(supplies.filter(s => s.id !== id));
    toast.success('Supply deleted');
  };

  const addContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      type: 'family',
      phone: '',
      priority: 3,
      notes: '',
    };
    setContacts([...contacts, newContact]);
    toast.success('Contact added');
  };

  const updateContact = (id: string, updates: Partial<EmergencyContact>) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Contact updated');
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast.success('Contact deleted');
  };

  const addEvacuationPlan = () => {
    const newPlan: EvacuationPlan = {
      id: Date.now().toString(),
      name: '',
      scenario: 'fire',
      primaryRoute: '',
      alternateRoute: '',
      meetingPoint: '',
      transportation: '',
      specialConsiderations: [],
      practiced: false,
      notes: '',
    };
    setEvacuationPlans([...evacuationPlans, newPlan]);
    toast.success('Evacuation plan added');
  };

  const updateEvacuationPlan = (id: string, updates: Partial<EvacuationPlan>) => {
    setEvacuationPlans(evacuationPlans.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Plan updated');
  };

  const deleteEvacuationPlan = (id: string) => {
    setEvacuationPlans(evacuationPlans.filter(p => p.id !== id));
    toast.success('Plan deleted');
  };

  const addDocument = () => {
    const newDocument: EmergencyDocument = {
      id: Date.now().toString(),
      name: '',
      type: 'id',
      location: '',
      digitalCopy: false,
      cloudBackup: false,
      notes: '',
    };
    setDocuments([...documents, newDocument]);
    toast.success('Document added');
  };

  const updateDocument = (id: string, updates: Partial<EmergencyDocument>) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, ...updates } : d));
    toast.success('Document updated');
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
    toast.success('Document deleted');
  };

  const addDrill = () => {
    const newDrill: SafetyDrill = {
      id: Date.now().toString(),
      drillType: 'fire',
      date: new Date().toISOString().split('T')[0],
      participants: [],
      duration: 0,
      issues: [],
      improvements: [],
      completed: false,
    };
    setDrills([...drills, newDrill]);
    toast.success('Drill added');
  };

  const updateDrill = (id: string, updates: Partial<SafetyDrill>) => {
    setDrills(drills.map(d => d.id === id ? { ...d, ...updates } : d));
    toast.success('Drill updated');
  };

  const deleteDrill = (id: string) => {
    setDrills(drills.filter(d => d.id !== id));
    toast.success('Drill deleted');
  };

  const essentialSupplies = supplies.filter(s => s.essential).length;
  const primaryContacts = contacts.filter(c => c.priority >= 4).length;
  const practicedPlans = evacuationPlans.filter(p => p.practiced).length;
  const backedUpDocs = documents.filter(d => d.cloudBackup).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Emergency Prep Hub</h1>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Package className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{essentialSupplies}</div>
            <div className="text-xs opacity-90">Essential</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{primaryContacts}</div>
            <div className="text-xs opacity-90">Key Contacts</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <MapPin className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{practicedPlans}</div>
            <div className="text-xs opacity-90">Practiced Plans</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{backedUpDocs}</div>
            <div className="text-xs opacity-90">Backed Up</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {[
            { id: 'supplies', label: 'Supplies', icon: Package },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'evacuation', label: 'Evacuation', icon: MapPin },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'drills', label: 'Drills', icon: CheckCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-fit px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
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
        {/* Supplies Tab */}
        {activeTab === 'supplies' && (
          <div className="space-y-4">
            <button
              onClick={addSupply}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Emergency Supply</span>
            </button>

            {supplies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No supplies yet. Build your emergency kit!</p>
              </div>
            ) : (
              supplies.map(supply => (
                <div key={supply.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${supply.essential ? 'border-red-500' : 'border-orange-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={supply.item}
                      onChange={(e) => updateSupply(supply.id, { item: e.target.value })}
                      placeholder="Item name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteSupply(supply.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={supply.category}
                      onChange={(e) => updateSupply(supply.id, { category: e.target.value as EmergencySupply['category'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    >
                      <option value="food">Food</option>
                      <option value="water">Water</option>
                      <option value="medical">Medical</option>
                      <option value="tools">Tools</option>
                      <option value="communication">Communication</option>
                      <option value="clothing">Clothing</option>
                      <option value="documents">Documents</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={supply.location}
                      onChange={(e) => updateSupply(supply.id, { location: e.target.value })}
                      placeholder="Location..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="number"
                      value={supply.quantity}
                      onChange={(e) => updateSupply(supply.id, { quantity: parseInt(e.target.value) || 0 })}
                      placeholder="Quantity..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="text"
                      value={supply.unit}
                      onChange={(e) => updateSupply(supply.id, { unit: e.target.value })}
                      placeholder="Unit..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="date"
                      value={supply.expirationDate || ''}
                      onChange={(e) => updateSupply(supply.id, { expirationDate: e.target.value })}
                      placeholder="Expiration (optional)..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={supply.notes}
                    onChange={(e) => updateSupply(supply.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none mb-2"
                    rows={2}
                  />

                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={supply.essential}
                      onChange={(e) => updateSupply(supply.id, { essential: e.target.checked })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">Essential item</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <button
              onClick={addContact}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Emergency Contact</span>
            </button>

            {contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No emergency contacts yet. Add your support network!</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                      placeholder="Contact name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteContact(contact.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={contact.relationship}
                      onChange={(e) => updateContact(contact.id, { relationship: e.target.value })}
                      placeholder="Relationship..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <select
                      value={contact.type}
                      onChange={(e) => updateContact(contact.id, { type: e.target.value as EmergencyContact['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    >
                      <option value="family">Family</option>
                      <option value="friend">Friend</option>
                      <option value="medical">Medical</option>
                      <option value="emergency-service">Emergency Service</option>
                      <option value="utility">Utility</option>
                      <option value="insurance">Insurance</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                      placeholder="Phone..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="tel"
                      value={contact.alternatePhone || ''}
                      onChange={(e) => updateContact(contact.id, { alternatePhone: e.target.value })}
                      placeholder="Alternate phone (optional)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="email"
                      value={contact.email || ''}
                      onChange={(e) => updateContact(contact.id, { email: e.target.value })}
                      placeholder="Email (optional)..."
                      className="col-span-2 text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">Priority: {contact.priority}/5</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateContact(contact.id, { priority: level })}
                          className={`w-10 h-10 rounded ${level <= contact.priority ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={contact.notes}
                    onChange={(e) => updateContact(contact.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    rows={2}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Evacuation Tab */}
        {activeTab === 'evacuation' && (
          <div className="space-y-4">
            <button
              onClick={addEvacuationPlan}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Evacuation Plan</span>
            </button>

            {evacuationPlans.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No evacuation plans yet. Plan your escape routes!</p>
              </div>
            ) : (
              evacuationPlans.map(plan => (
                <div key={plan.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${plan.practiced ? 'border-green-500' : 'border-orange-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => updateEvacuationPlan(plan.id, { name: e.target.value })}
                      placeholder="Plan name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteEvacuationPlan(plan.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <select
                      value={plan.scenario}
                      onChange={(e) => updateEvacuationPlan(plan.id, { scenario: e.target.value as EvacuationPlan['scenario'] })}
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    >
                      <option value="fire">Fire</option>
                      <option value="flood">Flood</option>
                      <option value="earthquake">Earthquake</option>
                      <option value="severe-weather">Severe Weather</option>
                      <option value="chemical">Chemical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={plan.primaryRoute}
                      onChange={(e) => updateEvacuationPlan(plan.id, { primaryRoute: e.target.value })}
                      placeholder="Primary route..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="text"
                      value={plan.alternateRoute}
                      onChange={(e) => updateEvacuationPlan(plan.id, { alternateRoute: e.target.value })}
                      placeholder="Alternate route..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="text"
                      value={plan.meetingPoint}
                      onChange={(e) => updateEvacuationPlan(plan.id, { meetingPoint: e.target.value })}
                      placeholder="Meeting point..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="text"
                      value={plan.transportation}
                      onChange={(e) => updateEvacuationPlan(plan.id, { transportation: e.target.value })}
                      placeholder="Transportation method..."
                      className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={plan.notes}
                    onChange={(e) => updateEvacuationPlan(plan.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none mb-2"
                    rows={2}
                  />

                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={plan.practiced}
                      onChange={(e) => updateEvacuationPlan(plan.id, { practiced: e.target.checked, lastPracticeDate: e.target.checked ? new Date().toISOString().split('T')[0] : undefined })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Practiced</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <button
              onClick={addDocument}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Document</span>
            </button>

            {documents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No documents tracked yet. Secure your important papers!</p>
              </div>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${doc.cloudBackup ? 'border-green-500' : 'border-orange-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => updateDocument(doc.id, { name: e.target.value })}
                      placeholder="Document name..."
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none flex-1 mr-2"
                    />
                    <button onClick={() => deleteDocument(doc.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={doc.type}
                      onChange={(e) => updateDocument(doc.id, { type: e.target.value as EmergencyDocument['type'] })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    >
                      <option value="id">ID</option>
                      <option value="insurance">Insurance</option>
                      <option value="medical">Medical</option>
                      <option value="financial">Financial</option>
                      <option value="property">Property</option>
                      <option value="legal">Legal</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={doc.location}
                      onChange={(e) => updateDocument(doc.id, { location: e.target.value })}
                      placeholder="Physical location..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                  </div>

                  <textarea
                    value={doc.notes}
                    onChange={(e) => updateDocument(doc.id, { notes: e.target.value })}
                    placeholder="Notes..."
                    className="w-full text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none mb-2"
                    rows={2}
                  />

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={doc.digitalCopy}
                        onChange={(e) => updateDocument(doc.id, { digitalCopy: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Digital copy</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={doc.cloudBackup}
                        onChange={(e) => updateDocument(doc.id, { cloudBackup: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700">Cloud backup</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Drills Tab */}
        {activeTab === 'drills' && (
          <div className="space-y-4">
            <button
              onClick={addDrill}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Safety Drill</span>
            </button>

            {drills.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No drills logged yet. Practice makes prepared!</p>
              </div>
            ) : (
              drills.map(drill => (
                <div key={drill.id} className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${drill.completed ? 'border-green-500' : 'border-orange-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <select
                      value={drill.drillType}
                      onChange={(e) => updateDrill(drill.id, { drillType: e.target.value as SafetyDrill['drillType'] })}
                      className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-red-500 outline-none flex-1 mr-2"
                    >
                      <option value="fire">Fire Drill</option>
                      <option value="earthquake">Earthquake Drill</option>
                      <option value="tornado">Tornado Drill</option>
                      <option value="evacuation">Evacuation Drill</option>
                      <option value="shelter-in-place">Shelter-in-Place</option>
                      <option value="other">Other</option>
                    </select>
                    <button onClick={() => deleteDrill(drill.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input
                      type="date"
                      value={drill.date}
                      onChange={(e) => updateDrill(drill.id, { date: e.target.value })}
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                    <input
                      type="number"
                      value={drill.duration}
                      onChange={(e) => updateDrill(drill.id, { duration: parseInt(e.target.value) || 0 })}
                      placeholder="Duration (minutes)..."
                      className="text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 focus:border-red-500 outline-none"
                    />
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer text-sm mt-2">
                    <input
                      type="checkbox"
                      checked={drill.completed}
                      onChange={(e) => updateDrill(drill.id, { completed: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Completed</span>
                  </label>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyPrepHubPage;
