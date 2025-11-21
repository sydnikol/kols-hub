import React, { useState, useEffect } from 'react';
import { Users, Phone, AlertCircle, Heart, FileText, Download, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  canPickUpMeds: boolean;
  hasMedicalPOA: boolean;
  notes: string;
  priority: 1 | 2 | 3;
  createdAt: number;
}

interface MedicalInfo {
  id: string;
  category: string;
  info: string;
  lastUpdated: number;
}

interface CareInstruction {
  id: string;
  situation: string;
  instructions: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

const CaregiverInfoHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'medical' | 'instructions'>('contacts');
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo[]>([]);
  const [instructions, setInstructions] = useState<CareInstruction[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddMedical, setShowAddMedical] = useState(false);
  const [showAddInstruction, setShowAddInstruction] = useState(false);
  const [copied, setCopied] = useState(false);

  // Contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    canPickUpMeds: false,
    hasMedicalPOA: false,
    notes: '',
    priority: 2 as 1 | 2 | 3,
  });

  // Medical info form
  const [medicalForm, setMedicalForm] = useState({
    category: 'Diagnosis',
    info: '',
  });

  // Instruction form
  const [instructionForm, setInstructionForm] = useState({
    situation: '',
    instructions: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // Load data
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    const savedMedical = localStorage.getItem('medicalInfo');
    const savedInstructions = localStorage.getItem('careInstructions');

    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedMedical) setMedicalInfo(JSON.parse(savedMedical));
    if (savedInstructions) setInstructions(JSON.parse(savedInstructions));
  }, []);

  // Save functions
  const saveContacts = (updated: EmergencyContact[]) => {
    setContacts(updated);
    localStorage.setItem('emergencyContacts', JSON.stringify(updated));
  };

  const saveMedicalInfo = (updated: MedicalInfo[]) => {
    setMedicalInfo(updated);
    localStorage.setItem('medicalInfo', JSON.stringify(updated));
  };

  const saveInstructions = (updated: CareInstruction[]) => {
    setInstructions(updated);
    localStorage.setItem('careInstructions', JSON.stringify(updated));
  };

  // Add contact
  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.phone) {
      toast.error('Name and phone are required');
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      ...contactForm,
      createdAt: Date.now(),
    };

    saveContacts([...contacts, newContact].sort((a, b) => a.priority - b.priority));
    setContactForm({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      canPickUpMeds: false,
      hasMedicalPOA: false,
      notes: '',
      priority: 2,
    });
    setShowAddContact(false);
    toast.success('Emergency contact added!');
  };

  // Delete contact
  const handleDeleteContact = (id: string) => {
    if (confirm('Delete this emergency contact?')) {
      saveContacts(contacts.filter(c => c.id !== id));
      toast.success('Contact deleted');
    }
  };

  // Add medical info
  const handleAddMedical = () => {
    if (!medicalForm.info) {
      toast.error('Information is required');
      return;
    }

    const newInfo: MedicalInfo = {
      id: Date.now().toString(),
      ...medicalForm,
      lastUpdated: Date.now(),
    };

    saveMedicalInfo([...medicalInfo, newInfo]);
    setMedicalForm({ category: 'Diagnosis', info: '' });
    setShowAddMedical(false);
    toast.success('Medical info added!');
  };

  // Delete medical info
  const handleDeleteMedical = (id: string) => {
    if (confirm('Delete this medical information?')) {
      saveMedicalInfo(medicalInfo.filter(m => m.id !== id));
      toast.success('Medical info deleted');
    }
  };

  // Add instruction
  const handleAddInstruction = () => {
    if (!instructionForm.situation || !instructionForm.instructions) {
      toast.error('Situation and instructions are required');
      return;
    }

    const newInstruction: CareInstruction = {
      id: Date.now().toString(),
      ...instructionForm,
      createdAt: Date.now(),
    };

    saveInstructions([...instructions, newInstruction]);
    setInstructionForm({ situation: '', instructions: '', priority: 'medium' });
    setShowAddInstruction(false);
    toast.success('Care instruction added!');
  };

  // Delete instruction
  const handleDeleteInstruction = (id: string) => {
    if (confirm('Delete this care instruction?')) {
      saveInstructions(instructions.filter(i => i.id !== id));
      toast.success('Instruction deleted');
    }
  };

  // Export all info
  const handleExportAll = () => {
    const data = {
      emergencyContacts: contacts,
      medicalInformation: medicalInfo,
      careInstructions: instructions,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caregiver-info-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Caregiver info exported!');
  };

  // Copy all to clipboard
  const handleCopyAll = () => {
    const text = `
EMERGENCY CAREGIVER INFORMATION
Generated: ${new Date().toLocaleString()}

=== EMERGENCY CONTACTS ===
${contacts.map(c => `
${c.name} (${c.relationship}) - Priority ${c.priority}
Phone: ${c.phone}
Email: ${c.email || 'None'}
Can pick up meds: ${c.canPickUpMeds ? 'Yes' : 'No'}
Medical POA: ${c.hasMedicalPOA ? 'Yes' : 'No'}
Notes: ${c.notes || 'None'}
`).join('\n')}

=== MEDICAL INFORMATION ===
${medicalInfo.map(m => `
[${m.category}]
${m.info}
`).join('\n')}

=== CARE INSTRUCTIONS ===
${instructions.map(i => `
SITUATION: ${i.situation} (${i.priority.toUpperCase()} PRIORITY)
${i.instructions}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const medicalCategories = [
    'Diagnosis',
    'Medications',
    'Allergies',
    'Medical Equipment',
    'Doctors',
    'Pharmacy',
    'Insurance',
    'Hospital Preferences',
    'Triggers/Warnings',
    'Other',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Caregiver Information Hub</h2>
          <p className="text-cyan-400">Essential info for those who care for you</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Alert Box */}
      <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-red-300 font-bold mb-1">Critical Information</h3>
            <p className="text-red-200 text-sm">
              This info is essential for emergency situations. Keep it updated and share with trusted caregivers.
              Consider printing a copy for your wallet or fridge.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'contacts'
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
              : 'bg-cyan-900/20 text-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          <Phone className="w-5 h-5" />
          Contacts ({contacts.length})
        </button>

        <button
          onClick={() => setActiveTab('medical')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'medical'
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
              : 'bg-cyan-900/20 text-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          <Heart className="w-5 h-5" />
          Medical Info ({medicalInfo.length})
        </button>

        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'instructions'
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
              : 'bg-cyan-900/20 text-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          <FileText className="w-5 h-5" />
          Instructions ({instructions.length})
        </button>
      </div>

      {/* Emergency Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
          >
            {showAddContact ? 'Cancel' : '+ Add Emergency Contact'}
          </button>

          {showAddContact && (
            <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-500/30 space-y-4">
              <h3 className="text-xl font-bold text-white">New Emergency Contact</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-300 font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-semibold mb-2">Relationship</label>
                  <input
                    type="text"
                    value={contactForm.relationship}
                    onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Partner, parent, friend, etc."
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-semibold mb-2">Priority Level</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: parseInt(e.target.value) as 1 | 2 | 3 })}
                    className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={1}>1 - Primary (call first)</option>
                    <option value={2}>2 - Secondary</option>
                    <option value={3}>3 - Tertiary</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-cyan-300">
                  <input
                    type="checkbox"
                    checked={contactForm.canPickUpMeds}
                    onChange={(e) => setContactForm({ ...contactForm, canPickUpMeds: e.target.checked })}
                    className="w-5 h-5"
                  />
                  Can pick up prescriptions
                </label>

                <label className="flex items-center gap-2 text-cyan-300">
                  <input
                    type="checkbox"
                    checked={contactForm.hasMedicalPOA}
                    onChange={(e) => setContactForm({ ...contactForm, hasMedicalPOA: e.target.checked })}
                    className="w-5 h-5"
                  />
                  Has Medical Power of Attorney
                </label>
              </div>

              <div>
                <label className="block text-cyan-300 font-semibold mb-2">Notes</label>
                <textarea
                  value={contactForm.notes}
                  onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-20"
                  placeholder="Special instructions, best times to call, etc."
                />
              </div>

              <button
                onClick={handleAddContact}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 rounded-xl text-white font-bold hover:from-cyan-500/40 hover:to-blue-500/40 transition-all"
              >
                Add Contact
              </button>
            </div>
          )}

          {/* Contacts List */}
          {contacts.length === 0 ? (
            <div className="bg-cyan-900/10 p-12 rounded-xl border border-cyan-500/20 text-center">
              <Phone className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
              <p className="text-cyan-400">No emergency contacts yet. Add your first contact!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className="bg-cyan-900/20 p-4 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{contact.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          contact.priority === 1 ? 'bg-red-500/20 text-red-300' :
                          contact.priority === 2 ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          PRIORITY {contact.priority}
                        </span>
                      </div>
                      {contact.relationship && (
                        <p className="text-cyan-400 text-sm">{contact.relationship}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-cyan-500/70 text-xs mb-1">Phone</p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-cyan-300 font-semibold hover:text-cyan-200 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </a>
                    </div>

                    {contact.email && (
                      <div>
                        <p className="text-cyan-500/70 text-xs mb-1">Email</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-cyan-300 hover:text-cyan-200"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {contact.canPickUpMeds && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                        ✓ Can pick up meds
                      </span>
                    )}
                    {contact.hasMedicalPOA && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        ✓ Medical POA
                      </span>
                    )}
                  </div>

                  {contact.notes && (
                    <div className="mt-3 p-3 bg-black/30 rounded-lg">
                      <p className="text-cyan-300 text-sm">{contact.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Medical Info Tab */}
      {activeTab === 'medical' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddMedical(!showAddMedical)}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
          >
            {showAddMedical ? 'Cancel' : '+ Add Medical Information'}
          </button>

          {showAddMedical && (
            <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-500/30 space-y-4">
              <h3 className="text-xl font-bold text-white">New Medical Information</h3>

              <div>
                <label className="block text-cyan-300 font-semibold mb-2">Category</label>
                <select
                  value={medicalForm.category}
                  onChange={(e) => setMedicalForm({ ...medicalForm, category: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  {medicalCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-cyan-300 font-semibold mb-2">Information *</label>
                <textarea
                  value={medicalForm.info}
                  onChange={(e) => setMedicalForm({ ...medicalForm, info: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-32"
                  placeholder="Enter relevant medical information..."
                />
              </div>

              <button
                onClick={handleAddMedical}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 rounded-xl text-white font-bold hover:from-cyan-500/40 hover:to-blue-500/40 transition-all"
              >
                Add Medical Info
              </button>
            </div>
          )}

          {/* Medical Info List */}
          {medicalInfo.length === 0 ? (
            <div className="bg-cyan-900/10 p-12 rounded-xl border border-cyan-500/20 text-center">
              <Heart className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
              <p className="text-cyan-400">No medical information yet. Add important medical details!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicalInfo.map(info => (
                <div
                  key={info.id}
                  className="bg-cyan-900/20 p-4 rounded-xl border border-cyan-500/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                      {info.category}
                    </span>
                    <button
                      onClick={() => handleDeleteMedical(info.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-white whitespace-pre-wrap">{info.info}</p>
                  <p className="text-cyan-500/70 text-xs mt-2">
                    Updated: {new Date(info.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Care Instructions Tab */}
      {activeTab === 'instructions' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddInstruction(!showAddInstruction)}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
          >
            {showAddInstruction ? 'Cancel' : '+ Add Care Instruction'}
          </button>

          {showAddInstruction && (
            <div className="bg-cyan-900/20 p-6 rounded-xl border border-cyan-500/30 space-y-4">
              <h3 className="text-xl font-bold text-white">New Care Instruction</h3>

              <div>
                <label className="block text-cyan-300 font-semibold mb-2">Situation *</label>
                <input
                  type="text"
                  value={instructionForm.situation}
                  onChange={(e) => setInstructionForm({ ...instructionForm, situation: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., POTS flare-up, migraine, panic attack"
                />
              </div>

              <div>
                <label className="block text-cyan-300 font-semibold mb-2">Instructions *</label>
                <textarea
                  value={instructionForm.instructions}
                  onChange={(e) => setInstructionForm({ ...instructionForm, instructions: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-32"
                  placeholder="What should caregivers do? Be specific..."
                />
              </div>

              <div>
                <label className="block text-cyan-300 font-semibold mb-2">Priority</label>
                <select
                  value={instructionForm.priority}
                  onChange={(e) => setInstructionForm({ ...instructionForm, priority: e.target.value as any })}
                  className="w-full px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                onClick={handleAddInstruction}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 rounded-xl text-white font-bold hover:from-cyan-500/40 hover:to-blue-500/40 transition-all"
              >
                Add Instruction
              </button>
            </div>
          )}

          {/* Instructions List */}
          {instructions.length === 0 ? (
            <div className="bg-cyan-900/10 p-12 rounded-xl border border-cyan-500/20 text-center">
              <FileText className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
              <p className="text-cyan-400">No care instructions yet. Add situation-specific guidance!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {instructions.map(instruction => (
                <div
                  key={instruction.id}
                  className={`p-4 rounded-xl border ${
                    instruction.priority === 'high' ? 'bg-red-900/20 border-red-500/30' :
                    instruction.priority === 'medium' ? 'bg-orange-900/20 border-orange-500/30' :
                    'bg-cyan-900/20 border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{instruction.situation}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        instruction.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        instruction.priority === 'medium' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {instruction.priority.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteInstruction(instruction.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-white whitespace-pre-wrap">{instruction.instructions}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaregiverInfoHub;
